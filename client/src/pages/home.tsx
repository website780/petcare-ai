import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Upload, Loader2, Heart, LogOut, Sparkles, PawPrint, ArrowLeft, 
  Camera, Stethoscope, Activity, HeartPulse, ShieldCheck, ChevronRight, Plus, CheckCircle2
} from "lucide-react";
import { motion } from "framer-motion";
import { SiFacebook } from "react-icons/si";
import { type Pet, type AnalyzeImageResponse, insertPetSchema } from "@shared/schema";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth-context";
import petCareImage from "../assets/pet-care.png";
import { Header } from "@/components/Header";

const MAX_INITIAL_IMAGE_SIZE = 15 * 1024 * 1024; // 15MB for initial pet creation
const INITIAL_COMPRESSION_QUALITY = 0.75; // Balanced for Vercel 4.5MB payload limit

async function compressImage(file: File, quality = INITIAL_COMPRESSION_QUALITY): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Failed to get canvas context'));
          return;
        }

        let width = img.width;
        let height = img.height;
        const maxDimension = 1536; // Optimized to prevent Vercel 4.5MB limit crashes

        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);

        // Use higher quality for initial pet photos
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function Home() {
  const [showUploader, setShowUploader] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string | null>(null);

  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const { user, loading, signInWithGoogle, logout, signInWithFacebook, refreshUser } = useAuth();
  const queryClient = useQueryClient();

  // Auto-refresh user state after payment interaction
  useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    
    const checkFulfillment = async () => {
      // Use Number() to be safe if DB returns string "1"
      const isLocked = Number(user?.freeScanUsed ?? 0) >= 2;
      const userEmail = user?.email;

      if (isLocked && userEmail) {
        setFulfillmentStatus(`Searching for payment for ${userEmail}...`);
        try {
          console.log("[Home] Forensic check for:", userEmail);
          const response = await apiRequest("GET", `/api/stripe/fulfill-by-email?email=${userEmail}&type=home_analysis`);
          const data = await response.json();
          
          if (data.success) {
            setFulfillmentStatus("✅ Payment Confirmed! Unlocking...");
            await refreshUser();
            toast({
              title: "Scan Unlocked!",
              description: "Your payment was verified. You can now use the scanner.",
            });
          } else {
            // Display the specific reason from the server
            setFulfillmentStatus(`ℹ️ ${data.message || "Checking Stripe..."}`);
            await refreshUser();
          }
        } catch (e) {
          setFulfillmentStatus("⚠️ Waiting for Stripe signal...");
          await refreshUser();
        }
      } else {
        setFulfillmentStatus(null);
      }
    };

    if (Number(user?.freeScanUsed || 0) >= 2) {
      // Initial check
      checkFulfillment();
      // Periodically check every 10 seconds
      interval = setInterval(checkFulfillment, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user?.freeScanUsed, refreshUser, toast]);

  // Restore pet profile breadcrumb on mount
  useEffect(() => {
    const saved = localStorage.getItem("petai_profile_breadcrumb");
    if (saved) {
      try {
        const { image, timestamp } = JSON.parse(saved);
        // 30 minute expiration
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          setImagePreview(image);
          setShowUploader(true);
          toast({
            title: "Session Recovered",
            description: "Restoring your pet profile analysis...",
          });
          performAnalysis(image);
        }
      } catch (e) {
        console.error("Error restoring breadcrumb:", e);
      } finally {
        localStorage.removeItem("petai_profile_breadcrumb");
      }
    }
  }, [toast]);

const { data: pets, isLoading: isLoadingPets } = useQuery<Pet[]>({
    queryKey: ["/api/pets", user?.dbId],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");
      const numericId = user?.dbId;
      if (!numericId) throw new Error("Invalid user ID");
      const response = await apiRequest("GET", `/api/pets?userId=${numericId}`);
      const data = await response.json();
      return data;
    },
    enabled: !!user?.dbId,
  });

  const analyzeImage = useMutation({
    mutationFn: async (base64Image: string) => {
      const res = await apiRequest("POST", "/api/analyze", { 
        imageData: base64Image,
        userId: user?.dbId
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.details || 'Failed to analyze image');
      }
      return res.json() as Promise<AnalyzeImageResponse>;
    },
  });

  const createPet = useMutation({
    mutationFn: async (pet: Omit<Pet, "id">) => {
      try {
        const petWithSerializedVideos = {
          ...pet,
          groomingVideos: pet.groomingVideos?.map(video =>
            typeof video === 'string' ? video : JSON.stringify(video)
          ),
        };

        const validatedPet = insertPetSchema.parse(petWithSerializedVideos);
        const res = await apiRequest("POST", "/api/pets", validatedPet);
        if (!res.ok) {
          const error = await res.json();
          throw new Error(error.details || 'Failed to create pet');
        }

        const newPet = await res.json();
        return newPet;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (pet) => {
      // Update to use dbId in the query invalidation
      localStorage.removeItem("petai_profile_breadcrumb");
      queryClient.invalidateQueries({ queryKey: ["/api/pets", user?.dbId] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setLocation(`/pet/${pet.id}`);
      toast({
        title: "Pet profile created!",
        description: "You can now view your pet's profile and care recommendations.",
      });
    },
    onError: (error) => {
      localStorage.removeItem("petai_profile_breadcrumb");
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create pet profile",
      });
    }
  });

  const performAnalysis = async (fileDataUrl: string, originalFile?: File) => {
    try {
      if ((user?.appTokenBalance || 0) < 5) {
        toast({
          variant: "destructive",
          title: "Insufficient Tokens",
          description: "This analysis requires 5 Tokens. Let's top up!",
        });
        return;
      }

      // Save breadcrumb in case of refresh during analysis
      localStorage.setItem("petai_profile_breadcrumb", JSON.stringify({
        image: fileDataUrl,
        timestamp: Date.now()
      }));

      // Immediately set UI preview
      setImagePreview(fileDataUrl);

      // Extract base64 part for the AI analysis
      const base64 = fileDataUrl.split(",")[1];
      
      const analysis = await analyzeImage.mutateAsync(base64);

      if (pets) {
        const duplicatePet = checkForDuplicatePet(analysis, pets);
        if (duplicatePet) {
          toast({
            variant: "destructive",
            title: "Similar pet already exists",
            description: `You already have a ${analysis.species}${analysis.breed ? ` (${analysis.breed})` : ''} named ${duplicatePet.name} in your profile.`,
          });
          setImagePreview(null);
          localStorage.removeItem("petai_profile_breadcrumb");
          return;
        }
      }

      // Ensure we use the loaded file string, or compress if it's too large
      let imageToUpload = fileDataUrl;
      if (originalFile && originalFile.size > 5 * 1024 * 1024) { // Only compress if over 5MB
        try {
          imageToUpload = await compressImage(originalFile);
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      }

      await createPet.mutateAsync({
        name: "New Pet",
        userId: user?.dbId || 0,
        species: analysis.species,
        breed: analysis.breed ?? null,
        gender: analysis.gender ?? null,
        age: (analysis as any).age ?? null,
        imageUrl: imageToUpload,
        imageGallery: [],
        lastMoodUpdate: null,
        careRecommendations: analysis.careRecommendations ?? [],
        weight: analysis.weight ?? null,
        size: analysis.size ?? null,
        lifespan: analysis.lifespan ?? null,
        vetCareFrequency: analysis.vetCareFrequency ?? null,
        vetCareDetails: analysis.vetCareDetails ?? [],
        groomingSchedule: analysis.groomingSchedule ?? null,
        groomingDetails: analysis.groomingDetails ?? [],
        groomingVideos: (analysis.groomingVideos || []).map(video => JSON.stringify(video)),
        dietType: analysis.dietType ?? null,
        foodRecommendations: analysis.foodRecommendations ?? [],
        feedingSchedule: analysis.feedingSchedule ?? null,
        portionSize: analysis.portionSize ?? null,
        nutritionalNeeds: analysis.nutritionalNeeds ?? [],
        foodRestrictions: analysis.foodRestrictions ?? [],
        treatRecommendations: analysis.treatRecommendations ?? [],
        currentMood: analysis.currentMood ?? null,
        moodDescription: analysis.moodDescription ?? null,
        moodRecommendations: analysis.moodRecommendations ?? [],
        trainingLevel: analysis.trainingLevel ?? null,
        exerciseNeeds: analysis.exerciseNeeds ?? null,
        exerciseSchedule: analysis.exerciseSchedule ?? null,
        exerciseDuration: analysis.exerciseDuration ?? null,
        trainingDetails: analysis.trainingDetails ?? [],
        trainingVideos: (analysis.trainingVideos || []).map(video => JSON.stringify(video)),
        trainingSchedule: analysis.trainingSchedule ?? null,
        exerciseType: analysis.exerciseType ?? null,
        trainingProgress: analysis.trainingProgress ?? null,
        vaccinationRecords: [],
        vaccinationSchedule: null,
        nextVaccinationDue: null,
        vaccinationNotes: null,
        nutritionAnalysis: null,
        lastInjuryAnalysis: null,
      });
      await refreshUser();
    } catch (error) {
      console.error('Error analyzing image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to analyze image",
      });
      setImagePreview(null);
      localStorage.removeItem("petai_profile_breadcrumb");
    }
  };

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_INITIAL_IMAGE_SIZE) {
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please select an image under 15MB"
      });
      return;
    }

    // Convert file to Data URL reliably via Promise
    const fileDataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });

    await performAnalysis(fileDataUrl, file);
  };

  const handleCheckout = async () => {
    const targetUserId = user?.dbId;
    if (!targetUserId) {
      console.error("[Checkout] No database ID found for current user", user);
      toast({ 
        variant: "destructive", 
        title: "Account Error", 
        description: "Your account is still syncing. Please wait a moment and try again." 
      });
      return;
    }

    try {
      console.log(`[Checkout] Initiating payment for user ${targetUserId}`);
      const res = await apiRequest("POST", "/api/stripe/create-checkout", {
        type: "home_analysis", 
        userId: targetUserId,
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.details || data.error || "Server failed to respond.");
      }
      
      if (!data.url) throw new Error("No checkout URL found.");
      window.location.href = data.url;
    } catch (err) {
      console.error("[Checkout] Stripe API Error:", err);
      toast({ 
        variant: "destructive", 
        title: "Stripe Error", 
        description: err instanceof Error ? err.message : "Could not initiate payment." 
      });
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    noClick: false,
    noKeyboard: false,
  });

  const isLoading = analyzeImage.isPending || createPet.isPending;

  const handleSignOut = async () => {
    try {
      await logout();
      setShowUploader(false);
      toast({
        title: "Signed out successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to sign out",
        description: "Please try again",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  function checkForDuplicatePet(newPetAnalysis: AnalyzeImageResponse, existingPets: Pet[]): Pet | undefined {
    return existingPets.find(existingPet => {
      const speciesMatch = existingPet.species.toLowerCase() === newPetAnalysis.species.toLowerCase();
      const breedMatch = existingPet.breed && newPetAnalysis.breed
        ? existingPet.breed.toLowerCase() === newPetAnalysis.breed.toLowerCase()
        : true;
      return speciesMatch && breedMatch;
    });
  }

  return (
    <div className="min-h-[calc(100vh-80px)] md:min-h-screen relative flex flex-col">
      
      {!user ? (
        <div className="flex-1 flex flex-col items-center w-full py-8 md:py-16 relative z-10 space-y-16">
          {/* Main Hero & CTA */}
          <div className="w-[92%] max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-24 flex flex-col items-center text-center bg-white/60 backdrop-blur-xl border border-white/60 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] rounded-[3rem]">
            <span className="text-xs md:text-sm font-black tracking-[0.3em] uppercase text-[#ff6b4a] bg-[#ff6b4a]/5 border border-[#ff6b4a]/10 rounded-full px-6 py-2 mb-8 animate-pulse">
              Next-Gen AI Companion
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-[-0.04em] text-[#0a0a0a] cursor-default leading-[1.05]">
              Take Care of your <span className="bg-gradient-to-r from-[#ff6b4a] to-[#ff8f6b] bg-clip-text text-transparent animate-gradient-x">Best Friend</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed font-medium">
              Experience the future of pet care with instant AI-powered wellness tracking, digital injury scanning, 24/7 expert veterinary conversations, and artistic masterpiece generations.
            </p>

            {/* Core Sign-in CTAs */}
            <div className="flex flex-col sm:flex-row gap-5 w-full max-w-lg relative z-10 mt-4 justify-center">
              <Button
                size="lg"
                onClick={signInWithGoogle}
                className="flex-1 text-base px-6 py-7 bg-[#0F172A] hover:bg-[#1e293b] text-white border-transparent shadow-[0_12px_32px_-4px_rgba(15,23,42,0.3)] hover:shadow-[0_16px_40px_-4px_rgba(15,23,42,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out rounded-2xl group flex items-center justify-center font-black"
              >
                <Heart className="mr-3 h-5 w-5 text-red-500 group-hover:scale-125 transition-transform duration-300" />
                Sign in with Google
              </Button>

              {/* 
              <Button
                size="lg"
                onClick={signInWithFacebook}
                variant="outline"
                className="flex-1 text-base px-6 py-7 bg-[#1877F2] border-transparent shadow-[0_12px_32px_-4px_rgba(24,119,242,0.3)] hover:shadow-[0_16px_40px_-4px_rgba(24,119,242,0.4)] text-white hover:bg-[#1877F2]/90 hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out rounded-2xl group flex items-center justify-center font-black"
              >
                <SiFacebook className="mr-3 h-5 w-5 group-hover:rotate-12 transition-transform duration-300" />
                Sign in with Facebook
              </Button>
              */}
            </div>
          </div>

          {/* Core Feature Journeys Section */}
          <div className="w-[92%] max-w-6xl mx-auto space-y-24 py-12">
            <div className="flex flex-col items-center text-center space-y-4 max-w-xl mx-auto mb-16">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-none">
                Transforming Pet Journeys
              </h2>
              <div className="h-1 w-20 bg-gradient-to-r from-[#ff6b4a] to-[#ff8f6b] rounded-full" />
              <p className="text-slate-500 font-medium leading-relaxed">
                Unlock specialized tools that adapt to your pet's exact daily lifestyle and immediate health requirements.
              </p>
            </div>

            {/* Journey 1: Injury Scanner */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-6 space-y-6">
                <span className="text-[10px] font-black tracking-[0.3em] text-[#ff6b4a] bg-[#ff6b4a]/5 border border-[#ff6b4a]/10 px-4 py-2 rounded-full uppercase">
                  Feature 01 · Triage
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  Smart AI Injury Scanner
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                  Upload a photo of a skin symptom, wound, or direct injury to receive an instant specialized deep-dive medical report. It analyzes immediate risks and generates tailored treatment recommendations.
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Fast photo upload and instant analysis
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Full symptoms and risk breakdown
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Specialized first-aid advice
                  </li>
                </ul>
              </div>
              <div className="md:col-span-6 group">
                <Card className="p-4 bg-gradient-to-br from-[#ff6b4a]/5 via-transparent to-orange-500/[0.02] backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] rounded-[2.5rem] border-none group-hover:scale-[1.02] duration-500 transition-all overflow-hidden relative">
                  <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-[#ff6b4a]/10 blur-[60px] rounded-full pointer-events-none" />
                  <div className="p-6 bg-white/80 border border-black/[0.02] rounded-3xl space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#ff6b4a] to-orange-500 flex items-center justify-center rounded-2xl shadow-md text-white shadow-orange-500/30">
                        <HeartPulse className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Specialized Flow</p>
                        <h4 className="text-lg font-black text-slate-900 leading-tight">Digital Injury Scanning</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left: Half Pet Image */}
                      <div className="relative h-52 rounded-2xl overflow-hidden border border-black/[0.03] shadow-inner bg-slate-50">
                        <img 
                          src="https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400" 
                          alt="Pet preview"
                          className="w-full h-full object-cover select-none pointer-events-none opacity-90 transition-all"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>
                      
                      {/* Right: Half Result with a little blur */}
                      <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-black/[0.02] text-left h-52 flex flex-col justify-between relative overflow-hidden">
                        <div className="space-y-2 relative">
                          <div className="flex justify-between items-center mb-1">
                            <span className="text-[9px] font-black px-1.5 py-0.5 bg-red-50 text-red-500 rounded border border-red-100 uppercase tracking-wider">Analysis Result</span>
                            <span className="text-[9px] text-slate-400 font-bold">94% Match</span>
                          </div>
                          
                          {/* Full Report Details with fade effect at bottom */}
                          <div className="relative h-36 overflow-hidden select-none">
                            <h5 className="font-bold text-slate-800 text-xs leading-snug mb-1">Dermatological & Scratch Report</h5>
                            <p className="text-[10px] text-slate-600 leading-relaxed font-medium">
                              Patient displays localized inflammation around paw pads. There is no major laceration, but mild surface abrasions suggest environmental irritants or continuous licking.
                            </p>
                            <p className="text-[10px] text-slate-500 leading-relaxed font-medium mt-1">
                              Treatment: 1. Clean gently twice daily with cool sterile saline. 2. Apply organic paw balm. 3. Prevent licking using a specialized soft pet cone if necessary.
                            </p>
                            
                            {/* Fade effect overlay to bottom of card */}
                            <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-white via-white/40 to-transparent pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>

            {/* Journey 2: AI Vet Consultation */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-6 order-2 md:order-1 group">
                <Card className="p-4 bg-gradient-to-br from-blue-500/5 via-transparent to-teal-500/[0.02] backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] rounded-[2.5rem] border-none group-hover:scale-[1.02] duration-500 transition-all overflow-hidden relative">
                  <div className="absolute top-[-10%] left-[-10%] w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />
                  <div className="p-6 bg-white/80 border border-black/[0.02] rounded-3xl space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center rounded-2xl shadow-md text-white shadow-blue-500/30">
                        <Stethoscope className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">24/7 Conversations</p>
                        <h4 className="text-lg font-black text-slate-900 leading-tight">Virtual Vet Chat</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left: Half Pet Image */}
                      <div className="relative h-52 rounded-2xl overflow-hidden border border-black/[0.03] shadow-inner bg-slate-50">
                        <img 
                          src="https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400" 
                          alt="Pet preview"
                          className="w-full h-full object-cover select-none pointer-events-none opacity-90 transition-all"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>
                      
                      {/* Right: Half Result with a little blur */}
                      <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-black/[0.02] space-y-2.5 text-left h-52 flex flex-col justify-between">
                        <div className="space-y-2 overflow-y-auto">
                          <div className="flex gap-1.5 items-start">
                            <div className="w-5 h-5 bg-slate-200 rounded-lg flex items-center justify-center text-[9px] text-slate-600 font-bold shrink-0">U</div>
                            <div className="bg-white px-2 py-1 rounded-xl border border-slate-100/60 text-[10px] text-slate-600 font-medium">Refusing new kibble. What can I do?</div>
                          </div>
                          <div className="flex gap-1.5 items-start">
                            <div className="w-5 h-5 bg-blue-500/10 text-blue-500 rounded-lg flex items-center justify-center text-[9px] font-bold shrink-0">AI</div>
                            <div className="bg-blue-50/40 px-2 py-1 rounded-xl border border-blue-100/40 text-[10px] text-slate-700 font-medium leading-relaxed">
                              Try mixing a small amount of warm water or low-sodium broth.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
              <div className="md:col-span-6 order-1 md:order-2 space-y-6">
                <span className="text-[10px] font-black tracking-[0.3em] text-blue-500 bg-blue-500/5 border border-blue-500/10 px-4 py-2 rounded-full uppercase">
                  Feature 02 · Guidance
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  Consultation With Specialized AI
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                  Get instant behavioral tips, precise diet plans, and medical triage answers anytime. It acts as your fully accessible, customized digital veterinarian, providing expert advice without delay.
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Fully customized triage conversations
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Instant dietary & behavioral plans
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Real-time 24/7 responsiveness
                  </li>
                </ul>
              </div>
            </div>

            {/* Journey 3: AI Portraits */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
              <div className="md:col-span-6 space-y-6">
                <span className="text-[10px] font-black tracking-[0.3em] text-purple-600 bg-purple-500/5 border border-purple-500/10 px-4 py-2 rounded-full uppercase">
                  Feature 03 · Masterpieces
                </span>
                <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  Exclusive AI Portrait Studio
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed text-sm md:text-base">
                  Transform normal pet pictures into high-definition digital artistic masterpieces. Select from multiple curated styles, witness transformations in seconds, and create custom exhibitions of your pet.
                </p>
                <ul className="space-y-3 pt-2">
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Gorgeous high-definition rendering
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Multiple distinct artistic styles
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" /> Download & keep your exhibitions
                  </li>
                </ul>
              </div>
              <div className="md:col-span-6 group">
                <Card className="p-4 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/[0.02] backdrop-blur-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)] rounded-[2.5rem] border-none group-hover:scale-[1.02] duration-500 transition-all overflow-hidden relative">
                  <div className="absolute top-[-10%] right-[-10%] w-48 h-48 bg-purple-500/10 blur-[60px] rounded-full pointer-events-none" />
                  <div className="p-6 bg-white/80 border border-black/[0.02] rounded-3xl space-y-6 relative z-10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center rounded-2xl shadow-md text-white shadow-purple-500/30">
                        <Camera className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-0.5">Artistic Transformation</p>
                        <h4 className="text-lg font-black text-slate-900 leading-tight">Custom Portrait Exhibition</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Left: Half Pet Image */}
                      <div className="relative h-52 rounded-2xl overflow-hidden border border-black/[0.03] shadow-inner bg-slate-50">
                        <img 
                          src="https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&q=80&w=400" 
                          alt="Pet preview"
                          className="w-full h-full object-cover select-none pointer-events-none opacity-90 transition-all"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                      </div>
                      
                      {/* Right: Half Result with a little blur */}
                      <div className="bg-white/40 backdrop-blur-md p-4 rounded-2xl border border-black/[0.02] space-y-2.5 text-left h-52 flex flex-col justify-between">
                        <div className="flex-1 flex flex-col justify-center">
                          <span className="text-[9px] font-black bg-purple-50 text-purple-600 border border-purple-100 px-1.5 py-0.5 rounded uppercase tracking-wider self-start mb-2">Artistic</span>
                          <h5 className="font-bold text-slate-800 text-xs leading-snug truncate">"Sir Charles" Portrait</h5>
                          <p className="text-[10px] text-slate-500 leading-relaxed font-medium mt-1">Victorian Masterpiece</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      ) : !showUploader ? (
        <>
          <Header />
          
          {/* ── Dashboard: 3 Premium Feature Cards ── */}
          <div className="container max-w-7xl mx-auto px-4 pt-6 pb-4 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6"
            >
              {/* Card 1: Injury Scanner (Moved to 1st) */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setLocation("/scan")} 
                className="group relative cursor-pointer overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-[#ff6b4a]/10 to-orange-500/5 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b4a]/20 to-orange-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-[#ff6b4a] to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-orange-500/40 group-hover:scale-110 transition-transform duration-500">
                    <HeartPulse className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3">Injury Scanner</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Upload a photo of an injury for a specialized deep-dive medical report and treatment analysis.
                  </p>
                  <div className="mt-8 flex items-center text-[#ff6b4a] font-bold text-sm tracking-wide">
                    SCAN NOW <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Card 2: AI Vet Consultation (Remains 2nd) */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setLocation("/vet")}
                className="group relative cursor-pointer overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-blue-500/10 to-teal-500/5 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-blue-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/40 group-hover:scale-110 transition-transform duration-500">
                    <Stethoscope className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3">Consult AI Vet</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Instant medical triage, behavioral advice, and symptom checking powered by specialized veterinary AI.
                  </p>
                  <div className="mt-8 flex items-center text-blue-500 font-bold text-sm tracking-wide">
                    START CHAT <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>

              {/* Card 3: AI Portraits (Moved to 3rd) */}
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setLocation("/pet-portraits")}
                className="group relative cursor-pointer overflow-hidden p-8 rounded-[2.5rem] bg-gradient-to-br from-purple-500/10 to-pink-500/5 backdrop-blur-xl border border-white/20 shadow-2xl transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col h-full">
                  <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center mb-6 shadow-lg shadow-purple-500/40 group-hover:scale-110 transition-transform duration-500">
                    <Camera className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-foreground mb-3">AI Portraits</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Capture stunning, high-definition AI-generated portraits of your pets in unique artistic styles.
                  </p>
                  <div className="mt-8 flex items-center text-purple-500 font-bold text-sm tracking-wide">
                    CREATE NOW <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Quick Create Pet Floating Card (Premium MVP style) */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              onClick={() => setShowUploader(true)}
              className="flex items-center justify-center gap-3 p-4 mb-6 bg-white/40 dark:bg-black/40 backdrop-blur-xl border border-white/40 rounded-2xl cursor-pointer hover:bg-[#ff6b4a]/10 hover:border-[#ff6b4a]/40 transition-all group"
            >
              <Plus className="w-5 h-5 text-[#ff6b4a] group-hover:rotate-90 transition-transform" />
              <span className="font-bold text-sm tracking-tight">ADD A NEW PET PROFILE</span>
            </motion.div>
          </div>
          <div className="container max-w-7xl mx-auto px-4 py-4 relative z-10 border-t border-white/10">
            {isLoadingPets ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff6b4a] mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading your pets...</p>
              </div>
            ) : pets && pets.length > 0 ? (
              <div>
                <h2 className="text-2xl font-black mb-4 tracking-tight">Your Pets</h2>
                <div className="grid gap-6 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {pets.map((pet) => (
                    <Card
                      key={pet.id}
                      className="cursor-pointer overflow-hidden border-border/50 bg-background/60 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-300 ease-out group"
                      onClick={() => setLocation(`/pet/${pet.id}`)}
                    >
                      <CardContent className="p-3">
                        {pet.imageUrl && (
                          <div className="relative w-full aspect-[4/3] mb-5 overflow-hidden rounded-xl shadow-inner">
                            <img
                              src={pet.imageUrl}
                              alt={pet.name}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors">{pet.name}</h3>
                        <p className="text-xs font-medium text-muted-foreground mt-1">
                          {pet.breed ? `${pet.species} • ${pet.breed}` : pet.species}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </>
      ) : (
        <>
          <Header />
          <div className="container max-w-4xl mx-auto px-4 py-12 relative z-10">
            <div className="w-full flex justify-between items-center mb-4">
              <Button
                variant="outline"
                onClick={() => setShowUploader(false)}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back 
              </Button>

              <Button
                variant="outline"
                onClick={handleSignOut}
                className="gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>

            {/* ── Dropzone card with rich AI-focused content ── */}
            <Card className="mb-12 border border-black/[0.04] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.08)] hover:shadow-[0_24px_60px_-12px_rgba(255,107,74,0.12)] transition-all duration-500 bg-white overflow-hidden rounded-3xl">
              <CardContent className="pt-8 pb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-[#ff6b4a]/[0.03] via-transparent to-blue-500/[0.02] pointer-events-none" />
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-10 md:p-16 text-center cursor-pointer transition-all duration-500 ease-in-out relative z-10
                    ${isDragActive ? "border-[#ff6b4a] bg-[#ff6b4a]/[0.06] scale-[1.02]" : "border-black/10 hover:border-[#ff6b4a]/50 hover:bg-[#ff6b4a]/[0.02]"}
                    ${isLoading ? "pointer-events-none opacity-50" : ""}`}
                >
                  <input {...getInputProps()} />

                  {imagePreview ? (
                    /* Preview state */
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="max-h-64 mx-auto mb-4 rounded-lg object-cover"
                    />
                  ) : (
                    /* Empty / drag-active state */
                    <div className="flex flex-col items-center gap-3">
                      <div className={`relative mb-4 transition-transform duration-300 ${isDragActive ? "scale-110" : ""}`}>
                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#ff6b4a] to-[#ff8f6b] flex items-center justify-center mx-auto shadow-lg shadow-[#ff6b4a]/20">
                          <PawPrint className="w-10 h-10 text-white" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-white shadow-md flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-[#ff6b4a]" />
                        </div>
                      </div>

                      <p className="text-xl md:text-2xl font-bold text-foreground">
                        {isDragActive ? "Release to analyze your pet!" : "Drop your pet's photo here"}
                      </p>

                      <p className="text-sm md:text-base text-muted-foreground max-w-sm leading-relaxed">
                        PetCare AI will instantly analyze the image and generate a complete care profile.
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">or click to select a photo · JPG, PNG up to 15MB</span>
                      </div>

                      {/* AI feature badges */}
                      <div className="flex flex-wrap justify-center gap-2 mt-4">
                        {["Breed Detection", "Diet Plan", "Grooming Guide", "Care Tips"].map((badge) => (
                          <span
                            key={badge}
                            className="text-xs px-3 py-1.5 rounded-full bg-[#ff6b4a]/[0.06] text-[#ff6b4a] font-semibold border border-[#ff6b4a]/10 tracking-wide"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {isLoading && (
                    <div className="flex flex-col items-center gap-3 mt-4">
                      <Loader2 className="w-6 h-6 animate-spin text-[#ff6b4a]" />
                      <p className="text-sm font-medium text-muted-foreground animate-pulse">
                        PetCare AI is analyzing your pet…
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            

            {isLoadingPets ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff6b4a] mb-4" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading your pets...</p>
              </div>
            ) : pets && pets.length > 0 ? (
              <div>
                <h2 className="text-2xl font-semibold mb-4">Your Pets</h2>
                <div className="grid gap-4 md:grid-cols-2">
                  {pets.map((pet) => (
                    <Card
                      key={pet.id}
                      className="cursor-pointer overflow-hidden border-border/50 bg-background/60 backdrop-blur-sm hover:shadow-xl hover:-translate-y-2 hover:border-primary/30 transition-all duration-300 ease-out group"
                      onClick={() => setLocation(`/pet/${pet.id}`)}
                    >
                      <CardContent className="p-4">
                        {pet.imageUrl && (
                          <div className="relative w-full h-56 mb-5 overflow-hidden rounded-xl shadow-inner">
                            <img
                              src={pet.imageUrl}
                              alt={pet.name}
                              className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </div>
                        )}
                        <h3 className="font-bold text-xl group-hover:text-primary transition-colors">{pet.name}</h3>
                        <p className="text-sm font-medium text-muted-foreground mt-1">
                          {pet.breed ? `${pet.species} • ${pet.breed}` : pet.species}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}