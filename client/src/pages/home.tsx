import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, Loader2, Heart, LogOut, Sparkles, PawPrint, ArrowLeft } from "lucide-react";
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
      const isLocked = Number(user?.freeScanUsed ?? 0) === 1;
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

    if (user?.freeScanUsed === 1) {
      // Initial check
      checkFulfillment();
      // Periodically check every 10 seconds
      interval = setInterval(checkFulfillment, 10000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [user?.freeScanUsed, refreshUser, toast]);

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
      queryClient.invalidateQueries({ queryKey: ["/api/pets", user?.dbId] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      setLocation(`/pet/${pet.id}`);
      toast({
        title: "Pet profile created!",
        description: "You can now view your pet's profile and care recommendations.",
      });
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create pet profile",
      });
    }
  });

const onDrop = async (acceptedFiles: File[]) => {
    if (Number(user?.freeScanUsed || 0) >= 2) {
      toast({
        variant: "destructive",
        title: "Scan limit reached",
        description: "You have used your scans. Please unlock more to continue.",
      });
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_INITIAL_IMAGE_SIZE) {
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please select an image under 20MB"
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

    // Immediately set UI preview
    setImagePreview(fileDataUrl);

    // Extract base64 part for the AI analysis
    const base64 = fileDataUrl.split(",")[1];
    
    try {
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
          return;
        }
      }

      // Ensure we use the loaded file string, or compress if it's too large
      let imageToUpload = fileDataUrl;
      if (file.size > 5 * 1024 * 1024) { // Only compress if over 5MB
        try {
          imageToUpload = await compressImage(file);
        } catch (error) {
          console.error('Error compressing image:', error);
          // Continue with original imageToUpload if compression fails
        }
      }

      await createPet.mutateAsync({
        name: "New Pet",
        userId: user?.dbId || 0,
        species: analysis.species,
        breed: analysis.breed ?? null,
        gender: analysis.gender ?? null,
        imageUrl: imageToUpload, // This now safely contains your initial image
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
    }
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
    noClick: user?.freeScanUsed === 1,
    noKeyboard: user?.freeScanUsed === 1,
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
        <div className="flex-1 flex items-center justify-center w-full py-12 md:py-20 relative z-10">
          <div className="w-[92%] max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20 flex flex-col items-center text-center bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-[3rem]">
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-[#0a0a0a] transition-transform duration-500 cursor-default">
              Take Care of your Best Friend
            </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            Sign in to start tracking and caring for your pets
          </p>

          <div className="w-full max-w-2xl mb-12 relative group cursor-default">
            <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full scale-90 group-hover:bg-primary/20 transition-colors duration-500" />
            <img
              src={petCareImage}
              alt="Pet care illustration"
              className="w-full h-auto relative z-10 drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-500"
            />
          </div>

          <div className="flex flex-col gap-5 w-full max-w-md relative z-10 mt-8">
            <Button
              size="lg"
              onClick={signInWithGoogle}
              className="text-xl px-8 py-8 bg-[#0F172A] hover:bg-[#1e293b] text-white border-transparent shadow-[0_15px_40px_-5px_rgba(15,23,42,0.3)] hover:shadow-[0_20px_50px_-5px_rgba(15,23,42,0.4)] hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out rounded-2xl group"
            >
              <Heart className="mr-3 h-6 w-6 text-red-500 group-hover:scale-125 transition-transform duration-300" />
              Sign in with Google
            </Button>

            <Button
              size="lg"
              onClick={signInWithFacebook}
              variant="outline"
              className="text-xl px-8 py-8 bg-[#1877F2] border-transparent shadow-[0_15px_40px_-5px_rgba(24,119,242,0.3)] hover:shadow-[0_20px_50px_-5px_rgba(24,119,242,0.4)] text-white hover:bg-[#1877F2]/90 hover:scale-[1.02] active:scale-95 transition-all duration-300 ease-out rounded-2xl group"
            >
              <SiFacebook className="mr-3 h-6 w-6 group-hover:rotate-12 transition-transform duration-300" />
              Sign in with Facebook
            </Button>
          </div>
        </div>
      </div>
      ) : !showUploader ? (
        <>
          <Header />
          <div className="flex-1 flex items-center justify-center w-full py-12 relative z-10">
            <div className="w-[92%] max-w-6xl mx-auto px-6 md:px-12 py-16 md:py-20 flex flex-col items-center text-center bg-white/20 dark:bg-black/20 backdrop-blur-2xl border border-white/40 dark:border-white/10 shadow-[0_8px_32px_0_rgba(31,38,135,0.15)] rounded-[3rem]">
              <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-[#0a0a0a] transition-transform duration-500 cursor-default">
              Take Care of your Best Friend
            </h1>
            <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
              We will help you to provide guided care for your furry and non-furry friends
            </p>

{/*            
              <img
                src={petCareImage}
                alt="Pet care illustration"
                className="w-full h-50 relative z-10 drop-shadow-2xl group-hover:scale-[1.03] transition-transform duration-500"
              /> */}
            

            <div className="flex flex-col items-center gap-4">
              <Button
                size="lg"
                onClick={() => {
                  if (Number(user?.freeScanUsed || 0) >= 2) {
                    handleCheckout();
                  } else {
                    setShowUploader(true);
                  }
                }}
                className="text-xl px-12 py-8 bg-[#ff6b4a] hover:bg-[#e05a3b] text-white border-transparent shadow-[0_20px_50px_rgba(255,107,74,0.3)] hover:shadow-[0_25px_60px_rgba(255,107,74,0.5)] hover:-translate-y-2 active:translate-y-0 active:scale-95 transition-all duration-300 ease-out rounded-full"
              >
                {Number(user?.freeScanUsed || 0) >= 2 ? 'Unlock Unlimited Scans' : 'Get Guided Care'}
              </Button>

              {fulfillmentStatus && (
                <p className="mt-4 text-sm font-medium animate-pulse text-[#ff6b4a] bg-[#ff6b4a]/10 px-4 py-2 rounded-full border border-[#ff6b4a]/20">
                  {fulfillmentStatus}
                </p>
              )}
            </div>
          </div>
        </div>
<div className="container max-w-4xl mx-auto px-4 py-12 relative z-10">
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
                          <div className="relative w-full h-70 mb-5 overflow-hidden rounded-xl shadow-inner">
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
            <Card className="mb-12 border-0 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] hover:shadow-[0_20px_60px_-15px_rgba(168,85,247,0.3)] transition-shadow duration-500 bg-card/60 backdrop-blur-xl overflow-hidden rounded-2xl">
              <CardContent className="pt-6 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-pink-500/10 pointer-events-none" />
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-xl p-10 md:p-16 text-center cursor-pointer transition-all duration-500 ease-in-out relative z-10
                    ${isDragActive ? "border-[#ff6b4a] bg-[#ff6b4a]/10 scale-105 shadow-inner" : "border-primary/50 hover:border-primary hover:bg-primary/5 hover:-translate-y-1"}
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
                      <div className={`relative mb-2 transition-transform duration-300 ${isDragActive ? "scale-110" : ""}`}>
                        <div className="w-20 h-20 rounded-full bg-[#ff6b4a]/10 flex items-center justify-center mx-auto">
                          <PawPrint className="w-10 h-10 text-[#ff6b4a]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                          <Sparkles className="w-4 h-4 text-primary" />
                        </div>
                      </div>

                      <p className="text-xl md:text-2xl font-bold text-foreground">
                        {isDragActive ? "Release to analyze your pet!" : "Drop your pet's photo here"}
                      </p>

                      <p className="text-sm md:text-base text-muted-foreground max-w-sm leading-relaxed">
                        PetCare AI will instantly analyze the image and generate a complete care profile — breed, diet, grooming, training & more.
                      </p>

                      <div className="flex items-center gap-2 mt-1">
                        <Upload className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs text-muted-foreground">or click to select a photo · JPG, PNG up to 15MB</span>
                      </div>

                      {/* AI feature badges */}
                      <div className="flex flex-wrap justify-center gap-2 mt-3">
                        {["Breed Detection", "Diet Plan", "Grooming Guide", "Care Tips"].map((badge) => (
                          <span
                            key={badge}
                            className="text-xs px-3 py-1 rounded-full bg-[#ff6b4a]/10 text-[#ff6b4a] font-medium border border-[#ff6b4a]/20"
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