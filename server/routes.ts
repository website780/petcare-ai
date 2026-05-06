import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import OpenAI from "openai";
import { analyzeImageResponseSchema, insertReminderSchema, insertVetConsultationSchema, insertInsurancePolicySchema, insertInsuranceClaimSchema, insertPetExpenseSchema } from "../shared/schema.js";
import { z } from "zod";
import fetch from "node-fetch";
import { insertGroomingAppointmentSchema } from "../shared/schema.js";
import { insertTrainingAppointmentSchema } from "../shared/schema.js";
import { generateTrainingPlan, generateNutritionPlan, generatePersonalizedNutrition, generateVaccinationPlan, analyzePetBasic } from "./lib/openai.js"; // Import the functions
import Stripe from "stripe";

// Sanitize Secret Key (handles multi-line values from .env)
const rawSecretKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";
const cleanSecretKey = rawSecretKey.replace(/\s/g, '');
const stripe = new Stripe(cleanSecretKey);

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Add this near other schema definitions
const injuryAnalysisResponseSchema = z.object({
  hasInjury: z.boolean(),
  injuryDescription: z.string().nullable().optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "NONE"]).nullable().optional().default("NONE"),
  recommendations: z.array(z.string()).optional().default([]),
  requiredVetVisit: z.boolean().optional().default(false),
  immediateActions: z.array(z.string()).optional().default([]),
  treatmentOptions: z.array(z.object({
    name: z.string(),
    description: z.string().optional().default(""),
    type: z.string().optional().default("OTHER"), // Changed from enum to string for flexibility
    brandNames: z.array(z.string()).optional().default([]),
    activeIngredients: z.array(z.string()).optional().default([]),
    usage: z.string().optional().default("As needed"),
    precautions: z.array(z.string()).optional().default([]),
    expectedResults: z.string().optional().default("")
  })).optional().default([])
});

export function registerRoutes(app: Express): Server {
  // Production Health Check (Used by AWS Load Balancers)
  app.get("/api/health", async (_req, res) => {
    try {
      // Check Database connectivity
      await storage.getUserByFirebaseId("health-check");
      res.json({ 
        status: "healthy", 
        timestamp: new Date().toISOString(),
        service: "pet-ai-companion-api"
      });
    } catch (err) {
      res.status(503).json({ status: "unhealthy", reason: "Database unavailable" });
    }
  });

  /*
  // Admin Data Route (Disabled for security)
  app.get("/api/admin/all-data", async (req, res) => {
    try {
      const data = await storage.getAdminAllData();
      res.json(data);
    } catch (err: any) {
      console.error("Admin data fetch error:", err);
      res.status(500).json({ error: err.message || "Internal server error" });
    }
  });
  */

  // User sync route
  app.post("/api/auth/sync", async (req, res) => {
    try {
      const { email, displayName, photoURL, firebaseId } = req.body;

      let user = await storage.getUserByFirebaseId(firebaseId);

      if (!user) {
        // Create new user
        user = await storage.createUser({
          email,
          displayName,
          photoURL,
          firebaseId,
        });
        // Grant 40 free welcome tokens on first signup
        user = await storage.adjustUserTokens(user.id, 40, "welcome", "Welcome Bonus - 40 Free Tokens");
        user = await storage.updateUser(user.id, { lastPackage: "free" });
        console.log(`[WELCOME] Granted 40 free tokens to new user ${user.id}`);
      } else {
        // Update existing user
        // Sync profile data
        user = await storage.updateUser(user.id, {
          email,
          displayName,
          photoURL,
        });
      }

      console.log(`[SYNC-FINAL] Returning user ${user.id} -> SCAN:${user.freeScanUsed}, INJURY:${user.freeInjuryScanUsed}, VET:${user.vetChatCredits}, TOKENS:${user.appTokenBalance}`);
      res.json(user);
    } catch (error) {
      console.error("Error syncing user:", error);
      res.status(500).json({ 
        error: "Failed to sync user", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });
  
  // Debug route to reset account for testing
  app.post("/api/auth/reset-test-account", async (req, res) => {
    try {
      const { userId } = req.body;
      if (!userId) return res.status(400).json({ error: "User ID required" });

      const updatedUser = await storage.resetUserForTesting(Number(userId));
      
      res.json({ 
        success: true, 
        freeScanUsed: updatedUser.freeScanUsed, 
        freeInjuryScanUsed: updatedUser.freeInjuryScanUsed,
        vetChatCredits: updatedUser.vetChatCredits 
      });
    } catch (error) {
      console.error("[RESET] Error:", error);
      const errorMessage = error instanceof Error ? error.message : String(error);
      res.status(500).json({ 
        error: "Failed to reset account", 
        details: errorMessage,
        stack: error instanceof Error ? error.stack : undefined 
      });
    }
  });

  // YouTube search endpoint
  app.get("/api/youtube/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== 'string') {
        return res.status(400).json({ error: "Search query is required" });
      }

      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(q)}&type=video&maxResults=3&key=${process.env.YOUTUBE_API_KEY}`;

      const response = await fetch(searchUrl);
      const data = await response.json();

      if (!response.ok) {
        console.error('YouTube API error:', data);
        throw new Error('Failed to fetch from YouTube API');
      }

      const videos = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.medium.url,
      }));

      res.json(videos);
    } catch (error) {
      console.error('Error searching YouTube:', error);
      res.status(500).json({ error: 'Failed to search YouTube videos' });
    }
  });
  
  // Google Maps Places API search endpoint for pet service providers (groomers, vets, trainers)
  app.get("/api/places/search", async (req, res) => {
    const serviceTypeStr =
      typeof req.query.serviceType === "string" ? req.query.serviceType : "groomer";
    try {
      const { location, petType } = req.query;

      if (!location || typeof location !== "string") {
        return res.status(400).json({ error: "Location is required" });
      }

      if (!process.env.GOOGLE_MAPS_API_KEY) {
        return res.status(500).json({ error: "Google Maps API key is required but not configured" });
      }

      const validServiceTypes = ["groomer", "vet", "trainer"];
      
      // Validate service type
      if (!validServiceTypes.includes(serviceTypeStr)) {
        return res.status(400).json({ 
          error: "Invalid service type", 
          message: `Service type must be one of: ${validServiceTypes.join(', ')}`
        });
      }
      
      console.log(`Searching for ${petType || ''} ${serviceTypeStr} near ${location}`);
      
      try {
        // Map service type to search terms
        const serviceTerms: {[key: string]: string} = {
          'groomer': 'pet groomer',
          'vet': 'veterinarian animal hospital',
          'trainer': 'pet trainer dog training'
        };
        
        const searchTerm = serviceTerms[serviceTypeStr] || 'pet groomer';
        
        // Create search query based on pet type and location
        // For ZIP codes, use a different format to improve results
        const locationIsZipCode = /^\d{5}(-\d{4})?$/.test(location.trim());
        const searchQuery = locationIsZipCode 
          ? `${petType || ''} ${searchTerm} in zip code ${location}`.trim()
          : `${petType || ''} ${searchTerm} near ${location}`.trim();
        
        // First, geocode the location to get coordinates
        const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(location)}&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        
        const geocodeResponse = await fetch(geocodeUrl);
        const geocodeData = await geocodeResponse.json();
        
        if (geocodeData.status !== 'OK' || !geocodeData.results[0]) {
          console.error('Geocoding error:', geocodeData);
          return res.status(400).json({ 
            error: "Unable to find the specified location", 
            details: geocodeData.error_message || "Geocoding failed"
          });
        }
        
        const { lat, lng } = geocodeData.results[0].geometry.location;
        
        // Then, search for groomers near these coordinates
        // For ZIP codes, increase the search radius to find more results
        const searchRadius = locationIsZipCode ? 15000 : 5000; // 15km for ZIP codes, 5km for other locations
        
        const placesUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${searchRadius}&keyword=${encodeURIComponent(searchQuery)}&type=establishment&key=${process.env.GOOGLE_MAPS_API_KEY}`;
        
        const placesResponse = await fetch(placesUrl);
        const placesData = await placesResponse.json();
        
        if (placesData.status !== 'OK' && placesData.status !== 'ZERO_RESULTS') {
          console.error('Places API error:', placesData);
          // Service type specific error messages
          const serviceTypeErrorMessages: {[key: string]: string} = {
            'groomer': "Failed to search for groomers",
            'vet': "Failed to search for veterinarians",
            'trainer': "Failed to search for trainers"
          };
          
          return res.status(400).json({ 
            error: serviceTypeErrorMessages[serviceTypeStr] || "Failed to search for service providers", 
            details: placesData.error_message || `Google Maps API error: ${placesData.status}`
          });
        }
        
        // Process and format the results
        const groomers = (placesData.results || []).map((place: any) => ({
          placeId: place.place_id,
          name: place.name,
          address: place.vicinity,
          location: place.geometry.location,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          openNow: place.opening_hours?.open_now,
          photos: place.photos ? place.photos.map((photo: any) => ({
            reference: photo.photo_reference,
            width: photo.width,
            height: photo.height,
            url: `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=${process.env.GOOGLE_MAPS_API_KEY}`
          })) : [],
          icon: place.icon,
        }));
        
        if (groomers.length === 0) {
          // No results found from the API - use different error messages based on service type
          const serviceTypeErrorMessages: {[key: string]: string} = {
            'groomer': "No groomer results found",
            'vet': "No veterinarian results found",
            'trainer': "No trainer results found"
          };
          
          const serviceTypeMessageDetails: {[key: string]: string} = {
            'groomer': "No pet groomers were found in this location.",
            'vet': "No veterinarians were found in this location.",
            'trainer': "No pet trainers were found in this location."
          };
          
          return res.status(404).json({ 
            error: serviceTypeErrorMessages[serviceTypeStr] || "No service providers found", 
            message: `${serviceTypeMessageDetails[serviceTypeStr] || "No service providers were found."} Try a different search area or search term.`
          });
        }
        
        // Get detailed info for each place to get phone numbers
        const detailedGroomers = await Promise.all(
          groomers.slice(0, 5).map(async (groomer: any) => {
            try {
              const detailsUrl = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${groomer.placeId}&fields=name,formatted_address,formatted_phone_number,website,url&key=${process.env.GOOGLE_MAPS_API_KEY}`;
              
              const detailsResponse = await fetch(detailsUrl);
              const detailsData = await detailsResponse.json();
              
              if (detailsData.status === 'OK' && detailsData.result) {
                return {
                  ...groomer,
                  address: detailsData.result.formatted_address || groomer.address,
                  phone: detailsData.result.formatted_phone_number,
                  website: detailsData.result.website,
                  url: detailsData.result.url,
                };
              }
              
              return groomer;
            } catch (error) {
              console.error(`Error fetching details for ${groomer.name}:`, error);
              return groomer;
            }
          })
        );
        
        // Return a consistent structure but with service-specific naming based on serviceType
        const responseStructure: {[key: string]: string} = {
          'groomer': 'groomers',
          'vet': 'veterinarians',
          'trainer': 'trainers'
        };
        
        // Build response with dynamic property name based on service type
        const response: any = {
          searchLocation: {
            address: geocodeData.results[0].formatted_address,
            location: { lat, lng }
          }
        };
        
        // Add results with the appropriate service type name
        // But keep 'groomers' field for backward compatibility (existing components like GroomingScheduler)
        response.groomers = detailedGroomers;
        
        // Add service-specific field if it's different from 'groomers'
        if (serviceTypeStr !== 'groomer') {
          response[responseStructure[serviceTypeStr]] = detailedGroomers;
        }
        
        res.json(response);
      } catch (error) {
        console.error('Error in Google Maps API:', error);
        // Service type specific error messages
        const serviceTypeErrorMessages: {[key: string]: string} = {
          'groomer': "Failed to search for groomers",
          'vet': "Failed to search for veterinarians",
          'trainer': "Failed to search for trainers"
        };
        
        return res.status(500).json({ 
          error: serviceTypeErrorMessages[serviceTypeStr] || "Failed to search for service providers", 
          details: error instanceof Error ? error.message : String(error)
        });
      }
    } catch (error) {
      console.error(`Error searching for ${serviceTypeStr}:`, error);
      
      // Service type specific error messages
      const serviceTypeErrorMessages: {[key: string]: string} = {
        'groomer': "Failed to search for groomers",
        'vet': "Failed to search for veterinarians",
        'trainer': "Failed to search for trainers"
      };
      
      res.status(500).json({ 
        error: serviceTypeErrorMessages[serviceTypeStr] || "Failed to search for service providers",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  


  app.post("/api/analyze", async (req, res) => {
    try {
      const { imageData } = req.body;
      if (!imageData) {
        console.error("No image data provided in request body");
        return res.status(400).json({ error: "No image data provided" });
      }

      if (!process.env.OPENAI_API_KEY) {
        console.error("OpenAI API key is not configured");
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }

      const { userId, firebaseId } = req.body;
      let targetUser = null;
      
      if (firebaseId) {
        targetUser = await storage.getUserByFirebaseId(firebaseId);
      } else if (userId) {
        targetUser = await storage.getUser(Number(userId));
      }

      if (targetUser) {
        if ((targetUser.appTokenBalance || 0) < 5) {
          return res.status(402).json({ error: "Insufficient tokens. 5 Tokens required for pet profile analysis." });
        }
        // Token deduction moved to AFTER successful AI response (see below)
      }

      console.log("Starting image analysis with OpenAI Vision API");
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert in pet emotion analysis and facial expression detection.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this pet image. Provide the following information in JSON format (Exclude description and careRecommendations):\n" +
                      "{\n" +
                      "  species: string,\n" +
                      "  breed: string | null,\n" +
                      "  gender: string | null,\n" +
                      "  weight: string | null,\n" +
                      "  size: string | null,\n" +
                      "  lifespan: string,\n" +
                      "  vetCareFrequency: string,\n" +
                      "  vetCareDetails: string[],\n" +
                      "  groomingSchedule: string,\n" +
                      "  groomingDetails: string[],\n" +
                      "  groomingVideos: { url: string, title: string }[],\n" +
                      "  dietType: string,\n" +
                      "  foodRecommendations: string[],\n" +
                      "  feedingSchedule: string,\n" +
                      "  portionSize: string,\n" +
                      "  nutritionalNeeds: string[],\n" +
                      "  foodRestrictions: string[],\n" +
                      "  treatRecommendations: string[],\n" +
                      "  currentMood: string,\n" +
                      "  moodDescription: string,\n" +
                      "  moodRecommendations: string[],\n" +
                      "  trainingLevel: string,\n" +
                      "  exerciseNeeds: string,\n" +
                      "  exerciseSchedule: string,\n" +
                      "  exerciseDuration: string,\n" +
                      "  trainingDetails: string[],\n" +
                      "  trainingVideos: { url: string, title: string }[],\n" +
                      "  exerciseType: string,\n" +
                      "  trainingProgress: string\n" +
                      "}\n"
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      const analysis = JSON.parse(content);

      // Deduct tokens AFTER successful AI response (Deduct-After-Delivery pattern)
      if (targetUser) {
        console.log(`[SCAN-SUCCESS] Deducting 5 tokens for user ${targetUser.id} after successful analysis`);
        await storage.adjustUserTokens(targetUser.id, -5, "usage", "Pet Profile Analysis");
      }
      // Legacy credit tracking
      if (targetUser && Number(targetUser.freeScanUsed || 0) < 2) {
        await storage.updateUserCredits(targetUser.id, 'freeScanUsed', (Number(targetUser.freeScanUsed || 0) + 1));
      }

      res.json(analysis);
    } catch (error: any) {
      console.error("Error analyzing image:", error);
      res.status(500).json({ 
        error: "Failed to analyze image", 
        details: error?.message || String(error) 
      });
    }
  });

  // Standalone Body Identification
  app.post("/api/standalone/analyze-body", async (req, res) => {
    try {
      const { imageData } = req.body;
      const result = await analyzePetBasic(imageData);
      res.json(result);
    } catch (error) {
      res.status(500).json({ error: "Failed to identify pet" });
    }
  });

  // Get standalone scan by ID
  app.get("/api/standalone/scan/:id", async (req, res) => {
    try {
      const scanId = Number(req.params.id);
      const scan = await storage.getStandaloneScan(scanId);
      if (!scan) return res.status(404).json({ error: "Scan not found" });
      res.json(scan);
    } catch (error) {
      console.error("Error fetching standalone scan:", error);
      res.status(500).json({ error: "Failed to fetch scan" });
    }
  });

  // Get scan history
  app.get("/api/standalone/scans/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const scans = await storage.getStandaloneScans(Number(userId));
      res.json(scans);
    } catch (error) {
      console.error("Error fetching standalone scans:", error);
      res.status(500).json({ error: "Failed to fetch scan history" });
    }
  });

  // Save scan and handle free scan logic
  app.post("/api/standalone/scan", async (req, res) => {
    try {
      const { userId, petInfo, injuryPhotoUrl, analysisResults } = req.body;
      
      const user = await storage.getUser(Number(userId));
      if (!user) return res.status(404).json({ error: "User not found" });

      let isPaid = 1;
      
      if ((user.appTokenBalance || 0) < 20) {
        return res.status(402).json({ error: "Insufficient tokens. 20 Tokens required for injury scan." });
      }

      const scan = await storage.createStandaloneScan({
        userId,
        petInfo,
        injuryPhotoUrl,
        analysisResults,
        isPaid
      });

      // Deduct tokens AFTER successful save (Deduct-After-Delivery)
      console.log(`[SCAN-INJURY] Deducting 20 Tokens for user ${user.id} after successful scan save`);
      await storage.adjustUserTokens(user.id, -20, "usage", "AI Injury Scan");

      res.json({ 
        scanId: scan.id, 
        isPaid: Boolean(isPaid || scan.isPaid)
      });
    } catch (error) {
      console.error("Error saving scan:", error);
      res.status(500).json({ error: "Failed to save scan results" });
    }
  });

  // Stripe Checkout Session Creation
  app.post("/api/stripe/create-checkout", async (req, res) => {
    try {
      const { type, userId, metadata } = req.body;
      console.log(`[Stripe] Creating checkout for type: ${type}, userId: ${userId}`);
      let baseLink = "";
      
      // 1. SMART SESSIONS: Dynamic checkout for most types
      if (type.startsWith("portrait") || type === "vet_chat_pack" || type === "injury_report" || type === "credit_topup") {
        let amount = 1500; // Default $15.00
        let description = "Pet AI Feature";

        if (type === "injury_report") {
          amount = 499; // $4.99 (Unique ID for Injury)
          description = "Pet AI Companion - Professional Injury Analysis";
        } else if (type === "vet_chat_pack") {
          amount = 1500; // $15.00
          description = "Pet AI Companion - 5 Expert AI Vet Questions";
        } else if (type === "credit_topup") {
          // Token Pack Pricing:
          if (metadata?.package === "tier_1") {
            amount = 999; // $9.99
            description = "Pet AI Companion - Starter Pack (150 Tokens)";
          } else if (metadata?.package === "tier_2" || metadata?.package === "100_credits") {
            amount = 1999; // $19.99
            description = "Pet AI Companion - Pro Pack (350 Tokens)";
          } else if (metadata?.package === "20_credits") {
            amount = 500; // $5.00
            description = "Pet AI Companion - 20 Universal Credits";
          } else {
            amount = 1999;
            description = "Pet AI Companion - Pro Pack (350 Tokens)";
          }
        } else if (type.startsWith("portrait")) {
          // If it's a simple download (portrait_hd), default to $9.95
          amount = 995;
          description = "Pet AI Companion - Professional HD Portrait";

          if (type === "portrait_print") {
            const prices: Record<string, number> = {
              "5x5": 1500, "8x8": 2500, "12x12": 3500,
              "16x16": 4900, "24x24": 6900, "36x36": 9900
            };
            amount = prices[metadata?.printSize] || 1500;
            description = `AI Pet Portrait - Premium Canvas Print (${metadata?.printSize}")`;
          }
        }

        const origin = req.get('origin') || `${req.protocol}://${req.get('host')}`;

        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          line_items: [{
            price_data: {
              currency: "usd",
              product_data: { name: description },
              unit_amount: amount,
            },
            quantity: 1,
          }],
          mode: "payment",
          success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${origin}/cancel`,
          client_reference_id: `user_${userId || 'unknown'}${metadata?.portraitId ? `|portrait_${metadata.portraitId}` : ''}${metadata?.scanId ? `|scan_${metadata.scanId}` : ''}|type_${type}`,
          metadata: {
            type: type,
            scanId: String(metadata?.scanId || ""),
            portraitId: String(metadata?.portraitId || ""),
            package: String(metadata?.package || "")
          }
        });

        return res.json({ url: session.url });
      }

      // 2. LEGACY PATH: AI Scan remains on the old path ($5.00)
      if (type === "home_analysis") {
        baseLink = (process.env.STRIPE_LINK || "").trim().replace(/^"(.*)"$/, '$1');
      }

      if (!baseLink || baseLink.trim() === "") {
        console.error(`[Stripe] Error: Fallback link is missing for type: ${type}.`);
        return res.status(500).json({ error: "Payment configuration missing on server" });
      }

      // Force absolute URL and clean whitespace/newlines
      const normalizedLink = baseLink.trim().replace(/\s/g, '');
      const url = new URL(normalizedLink);
      // Ensure the type is passed in metadata if possible, or just via refId
      const refId = `user_${userId || 'unknown'}${metadata?.scanId ? `|scan_${metadata.scanId}` : ''}|type_${type}`;
      
      console.log(`[Stripe] Redirecting user ${userId} for type ${type} with refId: ${refId}`);
      
      url.searchParams.append("client_reference_id", refId);
      res.json({ url: url.toString() });
    } catch (error: any) {
      console.error("[Stripe] Payment initiation error:", {
        message: error?.message,
        type: req.body.type,
        userId: req.body.userId,
        stack: error?.stack
      });
      res.status(500).json({ 
        error: "Failed to generate payment redirect",
        details: error?.message || String(error)
      });
    }
  });

  // SHARED FULFILLMENT LOGIC: Used by both the Webhook and the Success Page manually
  const fulfillOrder = async (session: Stripe.Checkout.Session, typeHint?: string) => {
    console.log(`[Stripe-Fulfillment] Starting fulfillment for session: ${session.id}, Hint: ${typeHint}`);
    
    // ANTI-EXPLOIT: Check if this session has already been processed
    const alreadyProcessed = await storage.isPaymentProcessed(session.id);
    if (alreadyProcessed) {
      console.warn(`[Stripe-Fulfillment] REJECTED: Session ${session.id} already processed. Treating as success for UI.`);
      return true; // Return true so the UI shows success even if webhook already did the work
    }
    
    // Extract ID and metadata safely
    const refId = session.client_reference_id || "";
    const parts = refId.split('|');
    let userIdPart = parts.find(p => p.startsWith('user_'))?.replace('user_', '');
    const scanIdPart = parts.find(p => p.startsWith('scan_'))?.replace('scan_', '');
    const portraitIdPart = parts.find(p => p.startsWith('portrait_'))?.replace('portrait_', '');
    
    // Use the hint if Stripe metadata is missing
    const typePart = parts.find(p => p.startsWith('type_'))?.replace('type_', '') || session.metadata?.type || typeHint;

    // Consolidated Email Fallback: If userId is missing, look up by email
    if (!userIdPart && session.customer_details?.email) {
      console.log(`[Stripe-Fulfillment] No UserID in metadata. Forensic email lookup: ${session.customer_details.email}`);
      const userFoundByEmail = await storage.getUserByEmail(session.customer_details.email);
      if (userFoundByEmail) {
        userIdPart = String(userFoundByEmail.id);
        console.log(`[Stripe-Fulfillment] Forensic Match! Found User:${userIdPart}`);
      }
    }

    console.log(`[Stripe-Fulfillment] Finalizing: User:${userIdPart}, Type:${typePart}, ScanID:${scanIdPart}, PortraitID:${portraitIdPart}`);
    console.log(`[Stripe-Fulfillment] session.metadata:`, JSON.stringify(session.metadata));

    // FULFILLMENT EXECUTION
    let wasFulfilled = false;

    if (scanIdPart) {
      await storage.updateStandaloneScan(Number(scanIdPart), { isPaid: 1 });
      wasFulfilled = true;
    } else if (portraitIdPart) {
      const type = session.metadata?.type;
      await storage.updatePetPortrait(Number(portraitIdPart), { 
        paid: "true",
        paymentType: type === "portrait_print" ? "print" : "hd_download"
      });
      wasFulfilled = true;
    } else if (userIdPart) {
      const user = await storage.getUser(Number(userIdPart));
      if (user) {
        if (typePart === "credit_topup") {
          const packageType = session.metadata?.package;
          const amount = session.amount_total || 0;
          let tokensToAdd = 150;
          let planName = "Token Top-up";

          if (packageType === "tier_1" || amount === 999) {
            tokensToAdd = 150;
            planName = "Starter Pack (150 Tokens)";
          } else if (packageType === "tier_2" || amount === 1999) {
            tokensToAdd = 350;
            planName = "Pro Pack (350 Tokens)";
          } else if (packageType === "20_credits") {
            tokensToAdd = 20;
            planName = "Legacy 20 Pack";
          } else if (packageType === "100_credits" || amount === 2000) {
            tokensToAdd = 100;
            planName = "Legacy 100 Pack";
          }
          
          await storage.adjustUserTokens(user.id, tokensToAdd, "top_up", planName);
          
          // Save the last package type for "Current Plan" display on pricing page
          if (packageType === "tier_1" || packageType === "tier_2") {
            await storage.updateUser(user.id, { lastPackage: packageType });
          } else if (packageType === "free") {
            await storage.updateUser(user.id, { lastPackage: "free" });
          }
          
          wasFulfilled = true;
        } else if (session.amount_total === 1500 || typePart === "vet_chat_pack" || typePart === "vet_chat") {
          await storage.updateUserCredits(user.id, 'vetChatCredits', (user.vetChatCredits || 0) + 5);
          wasFulfilled = true;
        } else if (typePart === "home_analysis") {
          await storage.updateUserCredits(user.id, 'freeScanUsed', 0);
          wasFulfilled = true;
        } else if (typePart === "injury_report") {
          await storage.updateUserCredits(user.id, 'freeInjuryScanUsed', 0);
          wasFulfilled = true;
        }
      }
    }

    if (wasFulfilled) {
      console.log(`[Stripe-Fulfillment] SUCCESS: Fulfillment completed for ID:${userIdPart || scanIdPart}`);
      // MARK AS PROCESSED: Remember this session ID so it can't be reused
      if (userIdPart) {
        await storage.markPaymentProcessed(Number(userIdPart), session.id);
      }
      return true;
    }

    console.warn(`[Stripe-Fulfillment] FAILED: No matching feature found to unlock for session ${session.id}`);
    return false;
  };

  // Stripe Webhook
  app.post("/api/stripe/webhook", express.raw({type: 'application/json'}), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const signature = Array.isArray(sig) ? sig[0] : sig;
    let event;

    try {
      if (!signature || typeof signature !== "string") {
        return res.status(400).send("Missing stripe-signature header");
      }
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET || "",
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : String(err)}`);
    }

    if (event.type === 'checkout.session.completed') {
      await fulfillOrder(event.data.object as Stripe.Checkout.Session);
    }

    res.json({ received: true });
  });

  // VERIFY & FULFILL: Direct endpoint used by SuccessPage.tsx 
  // This bypasses webhook delays/failures and provides instant gratification
  app.get("/api/stripe/fulfill-session", async (req, res) => {
    try {
      const sessionId = req.query.sessionId as string;
      if (!sessionId) return res.status(400).send("sessionId required");

      console.log(`[Direct-Fulfillment] Verifying session: ${sessionId}`);
      const session = await stripe.checkout.sessions.retrieve(sessionId);

      if (session.payment_status === 'paid') {
        const success = await fulfillOrder(session);
        console.log(`[Stripe-Success] Found and processed session: ${session.id}`);
        return res.json({ 
          success, 
          type: session.metadata?.type || "unknown", 
          metadata: session.metadata, // Return all metadata for client-side routing
          message: success ? "Your purchase has been fulfilled!" : "Partial match found." 
        });
      }
      
      res.json({ success: false, message: "Payment not verified yet." });
    } catch (error: any) {
      console.error("[Direct-Fulfillment] Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // ULTIMATE FALLBACK: Search recent Stripe sessions by email 
  app.get("/api/stripe/fulfill-by-email", async (req, res) => {
    try {
      const email = req.query.email as string;
      const typeHint = req.query.type as string; 
      if (!email) return res.status(400).send("email required");

      console.log(`[Email-Forensics] Searching recent sessions for: ${email}, Hint: ${typeHint}`);
      
      const sessions = await stripe.checkout.sessions.list({
        limit: 30, // Increased limit for better chance of finding it
        expand: ['data.customer_details']
      });

      // Find sessions for this email
      const emailSessions = sessions.data.filter(s => 
        s.customer_details?.email?.toLowerCase() === email.toLowerCase()
      );

      if (emailSessions.length === 0) {
        return res.json({ success: false, message: `No sessions found for ${email}` });
      }

      // Find the first paid session that HASN'T been processed yet AND is RECENT AND MATCHES TYPE
      const FIFTEEN_MINUTES_AGO = Math.floor(Date.now() / 1000) - 900;
      let match = null;
      
      for (const s of emailSessions) {
        if (s.payment_status === 'paid' && s.created >= FIFTEEN_MINUTES_AGO) {
          const alreadyProcessed = await storage.isPaymentProcessed(s.id);
          if (alreadyProcessed) continue;

          // TYPE CHECK: Ensure this session is actually for what we are looking for
          const meta = s.metadata?.type;
          const refId = s.client_reference_id || "";
          
          const isExactMatch = (meta === typeHint || refId.includes(`type_${typeHint}`));
          const isUntagged = (!meta && !refId.includes('type_')); // If metadata is missing entirely, we allow it

          // PRICE SAFETY: Support taxes/fees by using ranges instead of exact cents
          let priceMatches = true;
          const amount = s.amount_total || 0;
          
          if (typeHint === "vet_chat_pack" && amount < 1000) priceMatches = false;
          if ((typeHint === "home_analysis" || typeHint === "injury_report") && amount > 1000) priceMatches = false;

          // FINAL ACCURACY CHECK:
          // Since Injury reports are now ALWAYS tagged (Smart Sessions), 
          // we should only fulfill if we find a tag. 
          // Home Analysis is "Untagged" (Legacy Path) so it gets the fallback.
          let finalMatch = false;
          if (isExactMatch) finalMatch = true;
          
          if (isUntagged && typeHint === "home_analysis") {
            // ULTRA-RECENT: For the legacy untagged path, only allow the last 5 minutes
            const FIVE_MINUTES_AGO = Math.floor(Date.now() / 1000) - 300;
            if (s.created >= FIVE_MINUTES_AGO) {
              finalMatch = true;
            }
          }

          if (finalMatch && priceMatches) {
            match = s;
            break; 
          }
        }
      }

      if (match) {
        console.log(`[Email-Forensics] Found new paid session: ${match.id}`);
        const success = await fulfillOrder(match, typeHint);
        return res.json({ 
          success, 
          type: typeHint || "unknown", 
          metadata: match.metadata,
          message: "Found and processed your payment!" 
        });
      }

      res.json({ success: false, message: `Found ${emailSessions.length} session(s), but none are 'paid' yet.` });
    } catch (error: any) {
      console.error("[Email-Forensics] Error:", error.message);
      res.status(500).json({ error: error.message });
    }
  });

  // DEBUG ONLY: Simulate a successful payment webhook
  // Use this to test the "Free -> Paid" transition without the Stripe CLI
  app.get("/api/stripe/simulate-success", async (req, res) => {
    const { userId, type } = req.query;
    if (!userId) return res.status(400).send("userId required");
    
    console.log(`[SIMULATION] Manually triggering success for User:${userId}, Type:${type}`);
    
    if (type === "home_analysis") {
      await storage.updateUserCredits(Number(userId), 'freeScanUsed', 0);
      res.send(`Successfully simulated home_analysis payment for user ${userId}. You can now scan again!`);
    } else if (type === "injury_report") {
      await storage.updateUserCredits(Number(userId), 'freeInjuryScanUsed', 0);
      res.send(`Successfully simulated injury_report payment for user ${userId}. You can now start a new injury scan!`);
    } else if (type === "vet_chat_pack") {
      const user = await storage.getUser(Number(userId));
      if (user) {
        await storage.updateUserCredits(user.id, 'vetChatCredits', (user.vetChatCredits || 0) + 5);
        res.send(`Successfully simulated vet_chat_pack payment for user ${userId}. 5 credits added!`);
      } else {
        res.status(404).send("User not found");
      }
    } else {
      res.send("Simulation type not recognized. Use type=home_analysis, type=injury_report or type=vet_chat_pack");
    }
  });

  // Enhanced injury analysis endpoint with pet-specific details
  app.post("/api/analyze/injury", async (req, res) => {
    try {
      const { imageData, petSpecies, petBreed, injuryDetails } = req.body;
      if (!imageData) {
        return res.status(400).json({ error: "No image data provided" });
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      
      // Build a more detailed context from the injury details (if provided)
      let detailsContext = '';
      if (injuryDetails) {
        detailsContext = `Additional details provided by the pet owner:\n`;
        if (injuryDetails.location) detailsContext += `- Location: ${injuryDetails.location}\n`;
        
        const getDurationText = (duration: string) => {
          switch (duration) {
            case 'less-than-day': return 'Less than 24 hours';
            case '1-3-days': return '1-3 days';
            case '3-7-days': return '3-7 days';
            case 'more-than-week': return 'More than a week';
            case 'chronic': return 'Chronic/Recurring';
            default: return duration;
          }
        };
        
        if (injuryDetails.duration) {
          detailsContext += `- Duration: ${getDurationText(injuryDetails.duration)}\n`;
        }
        
        if (injuryDetails.symptoms && injuryDetails.symptoms.length > 0) {
          detailsContext += `- Observed symptoms: ${injuryDetails.symptoms.join(', ')}\n`;
        }
        
        if (injuryDetails.description) {
          detailsContext += `- Additional details: ${injuryDetails.description}\n`;
        }
      }

      // Create species-specific context
      const petContext = `The image is of a ${petSpecies}${petBreed ? ` (${petBreed} breed)` : ''}. `;
      const speciesGuidance = `Please provide recommendations and treatments that are specifically appropriate for ${petSpecies}${petBreed ? ` of the ${petBreed} breed` : ''}, considering any breed-specific health concerns.`;

      console.log("Starting pet-specific injury analysis with OpenAI Vision API");
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a veterinary expert specialized in identifying pet injuries and providing detailed treatment recommendations specific to different animal species and breeds. You have particular expertise with ${petSpecies}${petBreed ? `, especially the ${petBreed} breed` : ''}.`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `${petContext}Analyze this image for any visible injuries or health issues. ${speciesGuidance}\n\n${detailsContext}\n\nProvide detailed analysis in this JSON format:\n` +
                      "{\n" +
                      "  hasInjury: boolean,\n" +
                      "  injuryDescription: string or null,\n" +
                      "  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'NONE',\n" +
                      "  recommendations: string[],\n" +
                      "  requiredVetVisit: boolean,\n" +
                      "  immediateActions: string[],\n" +
                      "  treatmentOptions: Array<{\n" +
                      "    name: string,\n" +
                      "    description: string,\n" +
                      "    type: 'MEDICATION' | 'OINTMENT' | 'BANDAGE' | 'OTHER',\n" +
                      "    brandNames: string[],\n" +
                      "    activeIngredients: string[],\n" +
                      "    usage: string,\n" +
                      "    precautions: string[],\n" +
                      "    expectedResults: string\n" +
                      "  }>\n" +
                      "}\n\n" +
                      `Make sure all recommendations are safe and appropriate for ${petSpecies}${petBreed ? ` of the ${petBreed} breed` : ''}. For medications and ointments, provide specific brand names, active ingredients, detailed usage instructions, and expected results. Include common veterinary medications and treatments available over-the-counter or through veterinary prescription.`
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${imageData}`
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_tokens: 4000
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      try {
        const parsedContent = JSON.parse(content);
        // Using .safeParse for more resilient handling if needed, but .parse is okay with relaxed schema
        const analysis = injuryAnalysisResponseSchema.parse(parsedContent);
        res.json(analysis);
      } catch (error) {
        if (error instanceof z.ZodError) {
          console.error("Zod Validation Error:", JSON.stringify(error.errors, null, 2));
          return res.status(500).json({ 
            error: "Failed to validate AI response", 
            details: "Injury analysis format was incorrect",
            validationErrors: error.errors
          });
        }
        throw error;
      }
    } catch (error) {
      console.error("Error analyzing injury:", error);
      res.status(500).json({ 
        error: "Failed to analyze injury", 
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // New endpoint for post-scan injury chat
  app.post("/api/chat/injury", async (req, res) => {
    try {
      const { message, petId, petSpecies, petBreed, analysisContext } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "No message provided" });
      }
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      
      console.log(`Processing injury chat for pet ID: ${petId}`);
      
      // Prepare the chat history for context
      const chatHistoryPrompt = analysisContext.chatHistory?.length > 0 
        ? "Previous conversation:\n" + analysisContext.chatHistory.map((msg: any) => 
            `${msg.role === 'user' ? 'Pet Owner' : 'Veterinary Assistant'}: ${msg.content}`
          ).join("\n")
        : "";
      
      // Prepare analysis context
      const analysisPrompt = `
Based on the previous analysis, the pet has ${analysisContext.hasInjury ? 'an injury' : 'no significant injury'}.
${analysisContext.injuryDescription ? `The injury description is: ${analysisContext.injuryDescription}` : ''}
${analysisContext.severity ? `The severity level is: ${analysisContext.severity}` : ''}
`;
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a veterinary assistant providing follow-up guidance for a pet injury. You're answering questions about a ${petSpecies}${petBreed ? ` (${petBreed})` : ''}. 
            
Focus on providing specific and practical advice with actual product names and treatment options. Include real brand names and medicine names that are commonly used for the specific condition or injury.

For example:
- For pain management: Mention specific medications like Rimadyl (carprofen), Metacam (meloxicam), or Galliprant (grapiprant) with general dosing guidelines based on pet size.
- For wound care: Suggest specific products like Vetericyn Wound Care, 3M Vetbond Tissue Adhesive, or Neosporin (avoiding those with pain relievers for cats).
- For bandaging: Recommend specific brands like 3M Vetrap, PetFlex, or CoFlex.

Your answers should be:
1. Specific and detailed with actual product recommendations
2. Include exact brand names, active ingredients, and application methods
3. Clear and tailored to the pet's species, breed, and injury type
4. Factually accurate about injury treatment options
5. Compassionate and practical

Only mention consulting a veterinarian once if absolutely necessary for severe injuries. For routine care, provide direct actionable advice without repeatedly suggesting vet visits.`
          },
          {
            role: "user",
            content: `${analysisPrompt}
            
${chatHistoryPrompt}

Pet Owner: ${message}`
          }
        ],
        max_tokens: 2000
      });
      
      const responseContent = response.choices[0].message.content;
      if (!responseContent) {
        throw new Error("No response generated");
      }
      
      res.json({ response: responseContent });
      
    } catch (error) {
      console.error("Error in injury chat:", error);
      res.status(500).json({
        error: "Failed to generate chat response",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });
  
  // New endpoint for general vet chat
  app.post("/api/chat/vet", async (req, res) => {
    try {
      const { message, petId, userId, petSpecies, petBreed, petInfo, chatHistory, category, injuryContext } = req.body;
      
      // Support both direct fields and nested petInfo object
      const species = petSpecies || petInfo?.species || "pet";
      const breed = petBreed || petInfo?.breed || "";
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const user = await storage.getUser(Number(userId));
      if (!user) return res.status(404).json({ error: "User not found" });

      // API Token System Check (10 credits per message)
      if ((user.appTokenBalance || 0) < 10) {
        return res.status(402).json({ error: "Insufficient tokens. 10 Tokens required per message." });
      }
      
      // Token deduction moved to AFTER successful AI response (Deduct-After-Delivery)

      if (!message) {
        return res.status(400).json({ error: "No message provided" });
      }
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }
      
      console.log(`Processing vet chat for pet ID: ${petId}, category: ${category || 'general'}`);
      
      // Prepare the chat history for context
      const chatHistoryPrompt = chatHistory?.length > 0 
        ? "Previous conversation:\n" + chatHistory.map((msg: any) => 
            `${msg.role === 'user' ? 'Pet Owner' : 'Veterinary Assistant'}: ${msg.content}`
          ).join("\n")
        : "";

      // Format injury context if present
      let injuryAnalysisContext = "";
      if (injuryContext) {
        if (typeof injuryContext === 'string') {
          injuryAnalysisContext = `\nRECENT INJURY SCAN FINDINGS:\n${injuryContext}\n`;
        } else if (typeof injuryContext === 'object') {
          injuryAnalysisContext = `\nRECENT INJURY SCAN FINDINGS:\n` +
            `- Description: ${injuryContext.injuryDescription || 'N/A'}\n` +
            `- Severity: ${injuryContext.severity || 'N/A'}\n` +
            `- Recommended Immediate Actions: ${injuryContext.immediateActions?.join(', ') || 'N/A'}\n` +
            `- Treatment Options: ${injuryContext.treatmentOptions?.map((o: any) => o.name).join(', ') || 'N/A'}\n`;
        }
      }
      
      // Create category-specific context
      let categoryContext = "";
      if (category) {
        switch (category) {
          case "behaviour":
            categoryContext = "The pet owner is asking about behavioral issues, which may include unusual behaviors, aggression, anxiety, or training concerns.";
            break;
          case "diet":
            categoryContext = "The pet owner is asking about diet and nutrition, which may include food recommendations, diet changes, weight issues, or eating habits.";
            break;
          case "symptom":
            categoryContext = "The pet owner is asking about general symptoms or health concerns, which may include lethargy, vomiting, digestive issues, or other non-visible health issues.";
            break;
          case "preventcare":
            categoryContext = "The pet owner is asking about preventive care, which may include vaccinations, parasite prevention, dental care, or routine check-ups.";
            break;
          case "senior":
            categoryContext = "The pet owner is asking about senior pet care, which may include aging-related issues, mobility problems, cognitive changes, or special needs for older pets.";
            break;
          default:
            categoryContext = "The pet owner is asking a general question about their pet's health.";
        }
      }
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
             content: `You are a veterinary assistant providing guidance on pet health issues. You're answering questions about a ${species}${breed ? ` (${breed})` : ''}. 
            
${injuryAnalysisContext}
${categoryContext}

Focus on providing specific, actionable advice with real brand names and medicine names where appropriate. For example, instead of saying "use a flea treatment," recommend specific products like "Frontline Plus, Advantage II, or Seresto collars." For supplements, mention specific brands like "Cosequin, Dasuquin, or Nordic Naturals Omega-3 Pet." For medications, refer to common veterinary medicines by name when appropriate.

Your answers should be:
1. Specific and detailed, with actual product recommendations and dosing guidelines where appropriate (e.g., "For a ${species} of this breed, typical products include X, Y, and Z")
2. Include exact brand names, active ingredients, and typical application methods
3. Clear and tailored to the pet's species and breed characteristics
4. Factually accurate about pet health concerns
5. Compassionate and reassuring in tone

Only mention consulting a veterinarian once briefly if absolutely necessary, and only for the most serious conditions. For routine matters, provide direct advice without constantly deferring to vet consultations.`
          },
          {
            role: "user",
            content: `${chatHistoryPrompt}

Pet Owner: ${message}`
          }
        ],
        max_tokens: 2000
      });
      
      const responseContent = response.choices[0].message.content;
      if (!responseContent) {
        throw new Error("No response generated");
      }

      // Deduct tokens AFTER successful AI response (Deduct-After-Delivery)
      console.log(`[VET-CHAT-SUCCESS] Deducting 10 tokens for user ${user.id} after successful response`);
      await storage.adjustUserTokens(user.id, -10, "usage", "AI Vet Consultation");
      // Legacy credit tracking
      await storage.updateUserCredits(user.id, 'vetChatCredits', Math.max(0, (user.vetChatCredits || 0) - 1));
      
      res.json({ response: responseContent });
      
    } catch (error) {
      console.error("Error in vet chat:", error);
      res.status(500).json({
        error: "Failed to generate chat response",
        details: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Get standalone vet chat history (all chats)
  app.get("/api/standalone/vet-chat/history/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      const chats = await storage.getStandaloneVetChats(Number(userId));
      res.json(chats);
    } catch (error) {
      console.error("Error fetching vet chats:", error);
      res.status(500).json({ error: "Failed to fetch vet chat history" });
    }
  });

  // Get user pet portraits
  app.get("/api/users/:userId/portraits", async (req, res) => {
    try {
      const { userId } = req.params;
      const portraits = await storage.getPetPortraits(Number(userId));
      res.json(portraits);
    } catch (error) {
      console.error("Error fetching portraits:", error);
      res.status(500).json({ error: "Failed to fetch pet portraits" });
    }
  });

  // Standalone Vet Chat Persistence (Latest)
  app.get("/api/standalone/vet-chat/latest", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        console.log("[VET-CHAT-LOAD] Missing userId in query");
        return res.status(400).json({ error: "User ID required" });
      }

      console.log(`[VET-CHAT-LOAD] Searching for sessions for user: ${userId}`);
      const chats = await storage.getStandaloneVetChats(Number(userId));
      
      if (chats.length > 0) {
        console.log(`[VET-CHAT-LOAD] Found ${chats.length} sessions. Returning latest: ${chats[0].id}`);
      } else {
        console.log(`[VET-CHAT-LOAD] No sessions found for user ${userId}`);
      }
      
      res.json(chats[0] || null);
    } catch (error) {
      console.error("[VET-CHAT-LOAD-ERROR] Failed to fetch latest chat:", error);
      res.status(500).json({ error: "Failed to fetch latest chat" });
    }
  });

  app.post("/api/standalone/vet-chat", async (req, res) => {
    try {
      const { userId, petInfo, chatHistory, id } = req.body;
      if (!userId) {
        console.log("[VET-CHAT-SAVE] Missing userId in body");
        return res.status(400).json({ error: "User ID required" });
      }

      let chat;
      if (id) {
        // Update existing session
        chat = await storage.updateStandaloneVetChat(Number(id), { 
          petInfo, 
          chatHistory 
        });
        console.log(`[VET-CHAT-SAVE] UPDATED session ${id} for user ${userId}. History length: ${chatHistory?.length}`);
      } else {
        // Create new session
        chat = await storage.createStandaloneVetChat({
          userId: Number(userId),
          petInfo,
          chatHistory: chatHistory || [],
          questionsUsed: 0
        });
        console.log(`[VET-CHAT-SAVE] CREATED new session ${chat.id} for user ${userId}`);
      }

      res.json(chat);
    } catch (error) {
      console.error("[VET-CHAT-SAVE-ERROR] Failed to save standalone vet chat:", error);
      res.status(500).json({ error: "Failed to save chat" });
    }
  });

  app.get("/api/pets/:id", async (req, res) => {
    try {
      const pet = await storage.getPet(Number(req.params.id));
      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }
      res.json(pet);
    } catch (error) {
      console.error("Error fetching pet:", error);
      res.status(500).json({ error: "Failed to fetch pet", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.get("/api/pets", async (req, res) => {
    try {
      const { userId } = req.query;
      console.log("Fetching pets for userId:", userId);

      if (!userId || typeof userId !== 'string') {
        console.error("Invalid or missing userId in request:", userId);
        return res.status(400).json({ error: "User ID is required" });
      }

      const numericUserId = parseInt(userId);
      if (isNaN(numericUserId)) {
        console.error("Failed to parse userId to number:", userId);
        return res.status(400).json({ error: "Invalid user ID format" });
      }

      const pets = await storage.getAllPets(numericUserId);
      console.log("Retrieved pets for user:", pets);
      res.json(pets);
    } catch (error) {
      console.error("Error fetching pets:", error);
      res.status(500).json({ 
        error: "Failed to fetch pets", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.post("/api/pets", async (req, res) => {
    try {
      console.log("Creating pet with data:", req.body);
      // Ensure we initialize imageGallery as an array if imageUrl is present
      if (req.body.imageUrl) {
        console.log("Initial image URL received:", req.body.imageUrl);
        req.body.imageGallery = [req.body.imageUrl];
      }
      console.log("Creating pet with processed data:", req.body);
      const pet = await storage.createPet(req.body);
      if (!pet) {
        console.error("Failed to create pet - no pet returned from storage");
        return res.status(500).json({ error: "Failed to create pet" });
      }

      // Generate training, nutrition, and vaccination plans if pet was created successfully
      try {
        console.log("Generating training, nutrition, and vaccination plans for pet:", pet);
        
        const [trainingPlan, nutritionPlan, vaccinationPlan] = await Promise.all([
          generateTrainingPlan(pet),
          generateNutritionPlan(pet),
          generateVaccinationPlan(pet)
        ]);
        
        console.log("Generated training plan:", trainingPlan);
        console.log("Generated nutrition plan:", nutritionPlan);
        console.log("Generated vaccination plan:", vaccinationPlan);

        // Process both plans to properly serialize structured data
        const processedTrainingPlan = {
          ...trainingPlan,
          // Serialize training details if they are objects
          trainingDetails: trainingPlan.trainingDetails
            ? trainingPlan.trainingDetails.map((detail: any) => {
                try {
                  if (typeof detail === 'object' && detail !== null) {
                    console.log("Serializing training detail:", detail);
                    // Ensure proper JSON serialization
                    const serialized = JSON.stringify(detail);
                    console.log("Serialized result:", serialized);
                    return serialized;
                  }
                  return String(detail);
                } catch (error) {
                  console.error("Error serializing training detail:", error, detail);
                  // Return a fallback object if serialization fails
                  return JSON.stringify({
                    step: typeof detail === 'string' ? detail : "Training Step",
                    description: "Training detail could not be processed properly",
                    duration: "Not specified",
                    prerequisites: [],
                    difficulty: "Beginner",
                    checkpoints: ["Complete this task"],
                    tips: []
                  });
                }
              })
            : []
        };

        const processedNutritionPlan = {
          ...nutritionPlan,
          // Serialize food recommendations as JSON strings to store in database
          foodRecommendations: nutritionPlan.foodRecommendations 
            ? nutritionPlan.foodRecommendations.map((food: any) => {
                if (typeof food === 'object' && food !== null) {
                  console.log("Serializing food recommendation:", food);
                  return JSON.stringify(food);
                }
                return String(food);
              })
            : []
        };

        // Update pet with training, nutrition, and vaccination plans
        const updatedPet = await storage.updatePet(pet.id, {
          ...processedTrainingPlan,
          ...processedNutritionPlan,
          vaccinationRecords: vaccinationPlan.vaccinationRecords,
          vaccinationSchedule: vaccinationPlan.vaccinationSchedule,
          vaccinationNotes: vaccinationPlan.vaccinationNotes,
          nextVaccinationDue: vaccinationPlan.nextVaccinationDue
        });
        console.log("Successfully created pet with training, nutrition, and vaccination plans:", updatedPet);
        res.status(201).json(updatedPet);
      } catch (error) {
        // If plan generation fails, return the pet anyway but with default details
        console.error("Error generating training, nutrition, or vaccination plan:", error);
        const updatedPet = await storage.updatePet(pet.id, {
          trainingDetails: [
            "Basic Commands: Start with sit, stay, and come",
            "Leash Training: Practice walking without pulling",
            "Socialization: Expose to different environments and other pets",
            "Positive Reinforcement: Reward good behavior with treats"
          ],
          trainingLevel: "Beginner",
          exerciseNeeds: "Regular daily exercise needed",
          exerciseSchedule: "Twice daily, morning and evening",
          exerciseDuration: "30-45 minutes per session",
          exerciseType: "Walks, play sessions, and training exercises",
          dietType: "Consult veterinarian",
          feedingSchedule: "2-3 times daily",
          nutritionalNeeds: ["Balanced nutrition", "Fresh water"],
          foodRecommendations: ["Consult with veterinarian for species-specific recommendations"],
          foodRestrictions: ["Avoid toxic foods for this species"],
          treatRecommendations: ["Species-appropriate healthy treats"],
          vaccinationRecords: [],
          vaccinationSchedule: `Regular vaccination schedule recommended for ${pet.species}. Consult your veterinarian for a personalized vaccination plan.`,
          vaccinationNotes: null,
          nutritionAnalysis: null,
          lastInjuryAnalysis: null,
        });
        res.status(201).json(updatedPet);
      }
    } catch (error) {
      console.error("Error creating pet:", error);
      res.status(500).json({ 
        error: "Failed to create pet", 
        details: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.patch("/api/pets/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const pet = await storage.getPet(id);

      if (!pet) {
        return res.status(404).json({ error: "Pet not found" });
      }

      // Handle image updates
      if (req.body.imageUrl) {
        // If imageUrl is being updated, only add to gallery if it's not already there
        console.log("Image gallery update detected.  Adding image:", req.body.imageUrl);
        req.body.imageGallery = Array.from(new Set([
          ...(pet.imageGallery || []),
          ...(req.body.imageGallery || [])
        ]));
      }

      const updatedPet = await storage.updatePet(id, req.body);
      res.json(updatedPet);
    } catch (error) {
      console.error("Error updating pet:", error);
      res.status(500).json({ error: "Failed to update pet", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.post("/api/pets/:petId/reminders", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const currentDate = new Date();

      // If there's a specific time for the reminder, set it
      if (req.body.dueTime) {
        const [hours, minutes] = req.body.dueTime.split(':').map(Number);
        currentDate.setHours(hours, minutes, 0, 0);
      }

      const reminder = insertReminderSchema.parse({
        ...req.body,
        petId,
        dueDate: currentDate.toISOString(),
      });

      const newReminder = await storage.createReminder(reminder);
      res.status(201).json(newReminder);
    } catch (error) {
      console.error("Error creating reminder:", error);
      res.status(500).json({
        error: "Failed to create reminder",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/pets/:petId/reminders", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const reminders = await storage.getReminders(petId);

      // Format reminders to include local time
      const formattedReminders = reminders.map(reminder => {
        const date = new Date(reminder.dueDate);
        return {
          ...reminder,
          dueTime: reminder.dueTime || `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`,
        };
      });

      res.json(formattedReminders);
    } catch (error) {
      console.error("Error fetching reminders:", error);
      res.status(500).json({ error: "Failed to fetch reminders", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.patch("/api/reminders/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updateData = z.object({
        completed: z.boolean().optional(),
        dueTime: z.string().optional(),
      }).parse(req.body);

      await storage.updateReminderStatus(id, updateData);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating reminder:", error);
      res.status(500).json({ error: "Failed to update reminder", details: error instanceof Error ? error.message : String(error) });
    }
  });

  app.delete("/api/reminders/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteReminder(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting reminder:", error);
      res.status(500).json({ error: "Failed to delete reminder", details: error instanceof Error ? error.message : String(error) });
    }
  });


  // Vet consultation routes
  app.post("/api/pets/:petId/consultations", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const consultation = insertVetConsultationSchema.parse({
        ...req.body,
        petId,
      });

      const newConsultation = await storage.createVetConsultation(consultation);
      res.status(201).json(newConsultation);
    } catch (error) {
      console.error("Error creating consultation:", error);
      res.status(500).json({
        error: "Failed to create consultation",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/pets/:petId/consultations", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const consultations = await storage.getVetConsultations(petId);
      res.json(consultations);
    } catch (error) {
      console.error("Error fetching consultations:", error);
      res.status(500).json({
        error: "Failed to fetch consultations",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/consultations/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertVetConsultationSchema.partial().parse(req.body);
      const updatedConsultation = await storage.updateVetConsultation(id, updates);
      res.json(updatedConsultation);
    } catch (error) {
      console.error("Error updating consultation:", error);
      res.status(500).json({
        error: "Failed to update consultation",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/consultations/:id/cancel", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.cancelVetConsultation(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling consultation:", error);
      res.status(500).json({
        error: "Failed to cancel consultation",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/pets/:petId/grooming", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const appointment = insertGroomingAppointmentSchema.parse({
        ...req.body,
        petId,
      });

      const newAppointment = await storage.createGroomingAppointment(appointment);
      res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Error creating grooming appointment:", error);
      res.status(500).json({
        error: "Failed to create grooming appointment",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/pets/:petId/grooming", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const appointments = await storage.getGroomingAppointments(petId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching grooming appointments:", error);
      res.status(500).json({
        error: "Failed to fetch grooming appointments",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/grooming/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertGroomingAppointmentSchema.partial().parse(req.body);
      const updatedAppointment = await storage.updateGroomingAppointment(id, updates);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating grooming appointment:", error);
      res.status(500).json({
        error: "Failed to update grooming appointment",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/grooming/:id/cancel", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.cancelGroomingAppointment(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling grooming appointment:", error);
      res.status(500).json({
        error: "Failed to cancel grooming appointment",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Training appointment routes
  app.post("/api/pets/:petId/training", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const appointment = insertTrainingAppointmentSchema.parse({
        ...req.body,
        petId,
      });

      const newAppointment = await storage.createTrainingAppointment(appointment);
      res.status(201).json(newAppointment);
    } catch (error) {
      console.error("Error creating training appointment:", error);
      res.status(500).json({
        error: "Failed to create training appointment",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/pets/:petId/training", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const appointments = await storage.getTrainingAppointments(petId);
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching training appointments:", error);
      res.status(500).json({
        error: "Failed to fetch training appointments",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/training/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertTrainingAppointmentSchema.partial().parse(req.body);
      const updatedAppointment = await storage.updateTrainingAppointment(id, updates);
      res.json(updatedAppointment);
    } catch (error) {
      console.error("Error updating training appointment:", error);
      res.status(500).json({
        error: "Failed to update training appointment",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.post("/api/training/:id/cancel", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.cancelTrainingAppointment(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error cancelling training appointment:", error);
      res.status(500).json({
        error: "Failed to cancel training appointment",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Personalized nutrition analysis endpoint
  app.post("/api/nutrition/analyze", async (req, res) => {
    try {
      const { breed, weight, activityLevel, species, age, userId } = req.body;
      
      if (!breed || !weight || !activityLevel || !species) {
        return res.status(400).json({ 
          error: "Missing required fields: breed, weight, activityLevel, and species are required" 
        });
      }

      if (userId !== undefined && userId !== null) {
        const user = await storage.getUser(Number(userId));
        if (!user) return res.status(404).json({ error: "User not found" });

        if ((user.appTokenBalance || 0) < 3) {
          return res.status(402).json({ error: "Insufficient tokens. 3 Tokens required." });
        }
        
        console.log(`[NUTRITION] Consuming 3 Tokens for user ${user.id}`);
        await storage.adjustUserTokens(user.id, -3, "usage", "AI Nutrition Analysis");
      }

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }

      const nutritionAnalysis = await generatePersonalizedNutrition({
        breed,
        weight: Number(weight),
        activityLevel,
        species,
        age: age ? Number(age) : undefined
      });

      res.json(nutritionAnalysis);
    } catch (error) {
      console.error("Error generating nutrition analysis:", error);
      res.status(500).json({
        error: "Failed to generate nutrition analysis",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });
  
  // Generic token deduction endpoint
  app.post("/api/tokens/deduct", async (req, res) => {
    try {
      const { userId, amount, reason } = req.body;
      if (!userId || amount === undefined) {
        return res.status(400).json({ error: "userId and amount are required" });
      }

      // Security: Ensure amount is positive to prevent token inflation
      if (amount <= 0) {
        return res.status(400).json({ error: "Invalid amount. Deduction must be greater than zero." });
      }

      const user = await storage.getUser(Number(userId));
      if (!user) return res.status(404).json({ error: "User not found" });

      if ((user.appTokenBalance || 0) < amount) {
        return res.status(402).json({ error: `Insufficient tokens. ${amount} Tokens required.` });
      }

      console.log(`[TOKEN-CONSUME] Consuming ${amount} Tokens for user ${user.id}. Reason: ${reason || 'Generic'}`);
      const updatedUser = await storage.adjustUserTokens(user.id, -amount, "usage", reason || "Token Deduction");
      res.json(updatedUser);
    } catch (error) {
      console.error("Error deducting tokens:", error);
      res.status(500).json({ error: "Failed to deduct tokens" });
    }
  });

  app.get("/api/transactions", async (req, res) => {
    try {
      const userId = Number(req.query.userId);
      if (!userId) return res.status(400).send("userId required");
      const transactions = await storage.getTokenTransactions(userId);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  });

  app.get("/api/subscriptions/latest", async (req, res) => {
    try {
      const userId = Number(req.query.userId);
      if (!userId) return res.status(400).send("userId required");
      const sub = await storage.getLatestSubscription(userId);
      res.json(sub || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch subscription" });
    }
  });

  // Insurance Policy Routes
  app.post("/api/users/:userId/insurance-policies", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const policy = insertInsurancePolicySchema.parse({
        ...req.body,
        userId,
      });
      const newPolicy = await storage.createInsurancePolicy(policy);
      res.status(201).json(newPolicy);
    } catch (error) {
      console.error("Error creating insurance policy:", error);
      res.status(500).json({
        error: "Failed to create insurance policy",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/users/:userId/insurance-policies", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const policies = await storage.getInsurancePolicies(userId);
      res.json(policies);
    } catch (error) {
      console.error("Error fetching insurance policies:", error);
      res.status(500).json({
        error: "Failed to fetch insurance policies",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/insurance-policies/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const policy = await storage.getInsurancePolicy(id);
      if (!policy) {
        return res.status(404).json({ error: "Insurance policy not found" });
      }
      res.json(policy);
    } catch (error) {
      console.error("Error fetching insurance policy:", error);
      res.status(500).json({
        error: "Failed to fetch insurance policy",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/insurance-policies/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertInsurancePolicySchema.partial().parse(req.body);
      const updatedPolicy = await storage.updateInsurancePolicy(id, updates);
      res.json(updatedPolicy);
    } catch (error) {
      console.error("Error updating insurance policy:", error);
      res.status(500).json({
        error: "Failed to update insurance policy",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.delete("/api/insurance-policies/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteInsurancePolicy(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting insurance policy:", error);
      res.status(500).json({
        error: "Failed to delete insurance policy",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Insurance Claims Routes
  app.post("/api/users/:userId/insurance-claims", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const claim = insertInsuranceClaimSchema.parse({
        ...req.body,
        userId,
      });
      const newClaim = await storage.createInsuranceClaim(claim);
      res.status(201).json(newClaim);
    } catch (error) {
      console.error("Error creating insurance claim:", error);
      res.status(500).json({
        error: "Failed to create insurance claim",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/users/:userId/insurance-claims", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const claims = await storage.getInsuranceClaims(userId);
      res.json(claims);
    } catch (error) {
      console.error("Error fetching insurance claims:", error);
      res.status(500).json({
        error: "Failed to fetch insurance claims",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/insurance-policies/:policyId/claims", async (req, res) => {
    try {
      const policyId = Number(req.params.policyId);
      const claims = await storage.getClaimsByPolicy(policyId);
      res.json(claims);
    } catch (error) {
      console.error("Error fetching claims by policy:", error);
      res.status(500).json({
        error: "Failed to fetch claims",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/insurance-claims/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertInsuranceClaimSchema.partial().parse(req.body);
      const updatedClaim = await storage.updateInsuranceClaim(id, updates);
      res.json(updatedClaim);
    } catch (error) {
      console.error("Error updating insurance claim:", error);
      res.status(500).json({
        error: "Failed to update insurance claim",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.delete("/api/insurance-claims/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deleteInsuranceClaim(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting insurance claim:", error);
      res.status(500).json({
        error: "Failed to delete insurance claim",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Receipt OCR endpoint for expense tracking
    app.post("/api/expenses/ocr", async (req, res) => {
    try {
      const { imageBase64 } = req.body;
      
      if (!imageBase64) {
        return res.status(400).json({ error: "Image is required" });
      }
      
      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }

      console.log("Starting receipt OCR analysis with OpenAI Vision API");
      
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are an expert receipt scanner and OCR specialist for pet-related expenses. Analyze the receipt image and extract the following information accurately:
- Total amount (in cents, as an integer - e.g., $45.99 = 4599)
- Vendor/merchant name
- Date of purchase (in ISO format YYYY-MM-DD)
- Category (one of: vet_visit, food, medication, grooming, training, supplies, insurance, emergency, other)
- Currency code (e.g., USD, EUR, GBP)
- Key items purchased (as rawText summary)
- Confidence level (0-1 float indicating how confident you are in the extraction)

For pet expense categories:
- vet_visit: Veterinary services, checkups, treatments
- food: Pet food, treats, supplements
- medication: Prescriptions, flea/tick treatments, vitamins
- grooming: Grooming services, bathing, haircuts
- training: Training classes, obedience school
- supplies: Toys, beds, leashes, carriers, litter
- insurance: Pet insurance premiums
- emergency: Emergency vet visits, urgent care
- other: Anything else pet-related

Always respond in valid JSON format.`
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this receipt and extract the expense information. If the receipt is not readable or not a valid receipt, indicate low confidence. Extract the total amount, vendor, date, and categorize the expense."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                  detail: "high"
                }
              }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 1000,
      });

      const content = response.choices[0].message.content;
      if (!content) {
        throw new Error("No content in OpenAI response");
      }

      console.log("Receipt OCR response:", content);
      
      const parsedContent = JSON.parse(content);
      
      // Validate and structure the response
      const ocrResult = {
        amount: typeof parsedContent.amount === 'number' ? parsedContent.amount : null,
        vendor: parsedContent.vendor || parsedContent.merchant || null,
        date: parsedContent.date || null,
        category: parsedContent.category || 'other',
        currency: parsedContent.currency || 'USD',
        rawText: parsedContent.rawText || parsedContent.items || parsedContent.description || null,
        confidence: typeof parsedContent.confidence === 'number' ? parsedContent.confidence : 0.5,
      };

      res.json(ocrResult);
    } catch (error) {
      console.error("Error analyzing receipt:", error);
      res.status(500).json({
        error: "Failed to analyze receipt",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // Pet Expenses Routes
  app.post("/api/users/:userId/expenses", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const expense = insertPetExpenseSchema.parse({
        ...req.body,
        userId,
      });
      const newExpense = await storage.createPetExpense(expense);
      res.status(201).json(newExpense);
    } catch (error) {
      console.error("Error creating expense:", error);
      res.status(500).json({
        error: "Failed to create expense",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/users/:userId/expenses", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const expenses = await storage.getPetExpenses(userId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching expenses:", error);
      res.status(500).json({
        error: "Failed to fetch expenses",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/pets/:petId/expenses", async (req, res) => {
    try {
      const petId = Number(req.params.petId);
      const expenses = await storage.getPetExpensesByPet(petId);
      res.json(expenses);
    } catch (error) {
      console.error("Error fetching pet expenses:", error);
      res.status(500).json({
        error: "Failed to fetch pet expenses",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.patch("/api/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const updates = insertPetExpenseSchema.partial().parse(req.body);
      const updatedExpense = await storage.updatePetExpense(id, updates);
      res.json(updatedExpense);
    } catch (error) {
      console.error("Error updating expense:", error);
      res.status(500).json({
        error: "Failed to update expense",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.delete("/api/expenses/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      await storage.deletePetExpense(id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting expense:", error);
      res.status(500).json({
        error: "Failed to delete expense",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  // ==================== PET PORTRAIT ROUTES ====================

  app.post("/api/portraits/generate", async (req, res) => {
    try {
      const { imageBase64, style, userId, petId } = req.body;

      if (!imageBase64 || !style || !userId) {
        return res.status(400).json({ error: "Image, style, and userId are required" });
      }

      const user = await storage.getUser(Number(userId));
      if (!user) return res.status(404).json({ error: "User not found" });

      if ((user.appTokenBalance || 0) < 20) {
        return res.status(402).json({ error: "Insufficient tokens. 20 Tokens required for portrait generation." });
      }

      // Token deduction moved to AFTER successful generation (Deduct-After-Delivery)

      if (!process.env.OPENAI_API_KEY) {
        return res.status(500).json({ error: "OpenAI API is not configured" });
      }

      const stylePrompts: Record<string, string> = {
        "watercolor": "Transform this pet photo into a beautiful watercolor painting style. Use soft, flowing watercolor washes with gentle color bleeding. Keep the pet recognizable but with an artistic watercolor aesthetic. Light, airy feel with subtle paper texture.",
        "oil-painting": "Transform this pet photo into a classic oil painting style reminiscent of Renaissance pet portraits. Rich, deep colors with visible brushstrokes. Dramatic lighting with a regal, majestic feel. Museum-quality fine art style.",
        "pop-art": "Transform this pet photo into a vibrant Andy Warhol inspired pop art style. Bold, bright contrasting colors, strong outlines, halftone dot patterns. Fun, energetic, and modern graphic art feel.",
        "anime": "Transform this pet photo into a beautiful anime/manga illustration style. Large expressive eyes, clean lines, vibrant colors. Japanese animation aesthetic with a cute, kawaii feel.",
        "pencil-sketch": "Transform this pet photo into a detailed pencil sketch drawing. Fine graphite lines, realistic shading, cross-hatching technique. Black and white with subtle tonal gradations. Classical drawing style.",
        "pixel-art": "Transform this pet photo into a charming retro pixel art style. 16-bit or 32-bit gaming aesthetic with visible pixels. Bright, nostalgic color palette. Fun, retro gaming feel.",
        "stained-glass": "Transform this pet photo into a beautiful stained glass window art style. Bold black outlines separating colorful glass-like sections. Rich, jewel-toned colors with light appearing to shine through.",
        "art-nouveau": "Transform this pet photo into an elegant Art Nouveau illustration style. Flowing organic lines, decorative floral borders, muted earthy color palette. Inspired by Alphonse Mucha.",
        "cyberpunk": "Transform this pet photo into a futuristic cyberpunk digital art style. Neon glowing accents, dark background, holographic effects. High-tech, futuristic aesthetic with vibrant neon colors.",
        "impressionist": "Transform this pet photo into a beautiful Impressionist painting style inspired by Monet. Soft, dappled light effects, loose brushstrokes, pastel and natural color palette. Outdoor garden-like atmosphere.",
      };

      const stylePrompt = stylePrompts[style] || stylePrompts["watercolor"];

      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Perform a forensic physical analysis of this pet for a world-class portrait artist. Describe its species, breed, and most importantly, identifying landmarks: the unique pattern of its fur/spots, exact shape of the face and snout, distinct ear positioning, eye color, and any asymmetrical markings. Your description will be used to recreate this exact individual pet in an artistic style. Be extremely specific about identity markers. 2-3 detailed sentences."
              },
              {
                type: "image_url",
                image_url: {
                  url: imageBase64.startsWith("data:") ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`,
                },
              },
            ],
          },
        ],
        max_tokens: 400,
      });

      const petDescription = visionResponse.choices[0]?.message?.content || "a cute pet";

      const imageResponse = await openai.images.generate({
        model: "dall-e-3",
        prompt: `${stylePrompt}\n\nThe subject is: ${petDescription}\n\nIMPORTANT: Create a stylized artistic portrait that preserves the unique identity markers mentioned. It must be a single centered composition of just this pet with a complementary background. If the style is Anime, use a high-fidelity 'Seinen' anime aesthetic that respects the pet's actual bone structure and facial proportions.`,
        n: 1,
        size: "1024x1024",
        quality: "hd",
      });

      const generatedImageUrl = imageResponse.data?.[0]?.url;

      if (!generatedImageUrl) {
        throw new Error("Failed to generate portrait image");
      }

      const imageRes = await fetch(generatedImageUrl);
      const imageBuffer = Buffer.from(await imageRes.arrayBuffer());
      const portraitBase64 = `data:image/png;base64,${imageBuffer.toString("base64")}`;

      const portrait = await storage.createPetPortrait({
        userId,
        petId: petId || null,
        originalImageUrl: imageBase64.substring(0, 200) + "...",
        portraitImageUrl: portraitBase64,
        style,
        status: "completed",
        paid: "false",
        paymentType: null,
      });

      // Deduct tokens AFTER successful portrait generation (Deduct-After-Delivery)
      console.log(`[PORTRAIT] Deducting 20 tokens for user ${user.id} after successful generation`);
      await storage.adjustUserTokens(user.id, -20, "usage", "AI Portrait Generation");

      res.json({
        id: portrait.id,
        portraitImageUrl: portraitBase64,
        style,
        status: "completed",
      });
    } catch (error) {
      console.error("Error generating portrait:", error);
      res.status(500).json({
        error: "Failed to generate portrait",
        details: error instanceof Error ? error.message : String(error),
      });
    }
  });

  app.get("/api/users/:userId/portraits", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ error: "Valid user ID is required" });
      }
      const portraits = await storage.getPetPortraits(userId);
      res.json(portraits);
    } catch (error) {
      console.error("Error fetching portraits:", error);
      res.status(500).json({ error: "Failed to fetch portraits" });
    }
  });

  // Standalone Scan History
  app.get("/api/standalone/scans/:userId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const scans = await storage.getStandaloneScans(userId);
      res.json(scans);
    } catch (error) {
      console.error("Error fetching scans:", error);
      res.status(500).json({ error: "Failed to fetch scans" });
    }
  });

  app.post("/api/standalone/scans", async (req, res) => {
    try {
      const scan = await storage.createStandaloneScan(req.body);
      res.json(scan);
    } catch (error) {
      console.error("Error saving scan:", error);
      res.status(500).json({ error: "Failed to save scan" });
    }
  });

  // Standalone Vet Chat History
  app.get("/api/standalone/vet-chat/history/:userId", async (req, res) => {
    try {
      const userId = Number(req.params.userId);
      const chats = await storage.getStandaloneVetChats(userId);
      res.json(chats);
    } catch (error) {
      console.error("Error fetching vet chats:", error);
      res.status(500).json({ error: "Failed to fetch vet chats" });
    }
  });

  app.post("/api/standalone/vet-chat", async (req, res) => {
    try {
      const { id, ...chatData } = req.body;
      if (id) {
        const updated = await storage.updateStandaloneVetChat(id, chatData);
        res.json(updated);
      } else {
        const chat = await storage.createStandaloneVetChat(chatData);
        res.json(chat);
      }
    } catch (error) {
      console.error("Error saving vet chat:", error);
      res.status(500).json({ error: "Failed to save vet chat" });
    }
  });

  app.get("/api/portraits/:id", async (req, res) => {
    try {
      const id = Number(req.params.id);
      const portrait = await storage.getPetPortrait(id);
      if (!portrait) {
        return res.status(404).json({ error: "Portrait not found" });
      }
      res.json(portrait);
    } catch (error) {
      console.error("Error fetching portrait:", error);
      res.status(500).json({ error: "Failed to fetch portrait" });
    }
  });

  app.post("/api/chat/initial-questions", async (req, res) => {
  try {
    const { petSpecies, petBreed, severity } = req.body;
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a vet. Generate 4 specific follow-up questions for a ${petSpecies}${petBreed ? ` ${petBreed}` : ''} with a ${severity || 'potential'} injury. Return JSON with "questions" array of 4 strings.`
        },
        {
          role: "user",
          content: `Generate 4 questions to ask owner about this ${petSpecies}${petBreed ? ` ${petBreed}` : ''}'s condition.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 500
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content");
    
    const data = JSON.parse(content);
    res.json({ questions: data.questions });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Failed to generate questions" });
  }
});

  return createServer(app);
}
