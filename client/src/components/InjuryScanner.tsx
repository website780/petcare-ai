import { useState, useEffect, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Loader2, AlertTriangle, CheckCircle2, ChevronRight, User, HeartPulse, MessageSquare, PawPrint, Plus } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Pet, insertPetSchema } from "@shared/schema";

type TreatmentOption = {
  name: string;
  description: string;
  type: "MEDICATION" | "OINTMENT" | "BANDAGE" | "OTHER";
  brandNames: string[];
  activeIngredients: string[];
  usage: string;
  precautions: string[];
  expectedResults: string;
};

type InjuryAnalysis = {
  hasInjury: boolean;
  injuryDescription: string | null;
  severity: "LOW" | "MEDIUM" | "HIGH" | "NONE" | null;
  recommendations: string[];
  requiredVetVisit: boolean;
  immediateActions: string[];
  treatmentOptions: TreatmentOption[];
};

// Step 1 is now "pet_select" — user picks existing pet OR creates new one via photo upload
type Step = "pet_select" | "create_pet" | "pet_details" | "injury_photo" | "analysis";

const MAX_IMAGE_SIZE = 15 * 1024 * 1024;

async function compressImage(file: File, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) { reject(new Error("canvas ctx failed")); return; }
        let { width, height } = img;
        const max = 1536;
        if (width > height && width > max) { height = (height * max) / width; width = max; }
        else if (height > max) { width = (width * max) / height; height = max; }
        canvas.width = width; canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = () => reject(new Error("img load failed"));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error("file read failed"));
    reader.readAsDataURL(file);
  });
}

export function InjuryScanner() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();

  const [step, setStep] = useState<Step>("pet_select");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isCreatingPet, setIsCreatingPet] = useState(false);

  // Selected existing pet
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);

  // Pet info for scan context (populated from selected pet OR new pet creation)
  const [petInfo, setPetInfo] = useState<{
    species: string;
    breed: string;
    weight: string;
    age: string;
    gender: string;
  }>({ species: "", breed: "", weight: "", age: "", gender: "" });

  // For new pet creation flow (same as home page)
  const [newPetImagePreview, setNewPetImagePreview] = useState<string | null>(null);

  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [injuryImage, setInjuryImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<InjuryAnalysis | null>(null);
  const [currentScanId, setCurrentScanId] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string | null>(null);

  const isUnlocked = isPaid || Number(user?.freeInjuryScanUsed ?? 1) === 0;

  // Fetch existing pets
  const { data: pets, isLoading: isLoadingPets } = useQuery<Pet[]>({
    queryKey: ["/api/pets", user?.dbId],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const response = await apiRequest("GET", `/api/pets?userId=${user.dbId}`);
      return response.json();
    },
    enabled: !!user?.dbId,
  });

  // Add this near your other useQuery/useMutation hooks
  const updatePetDetailsMutation = useMutation({
    mutationFn: async (data: Partial<Pet>) => {
      if (!selectedPetId) return;
      const response = await apiRequest("PATCH", `/api/pets/${selectedPetId}`, data);
      if (!response.ok) throw new Error('Failed to update pet details');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets", user?.dbId] });
    }
  });

  // Create pet mutation (mirrors home.tsx logic)
  const createPetMutation = useMutation({
    mutationFn: async (pet: Omit<Pet, "id">) => {
      const petWithSerializedVideos = {
        ...pet,
        groomingVideos: pet.groomingVideos?.map((v: any) =>
          typeof v === "string" ? v : JSON.stringify(v)
        ),
      };
      const validatedPet = insertPetSchema.parse(petWithSerializedVideos);
      const res = await apiRequest("POST", "/api/pets", validatedPet);
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.details || "Failed to create pet");
      }
      return res.json();
    },
    onSuccess: (newPet) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pets", user?.dbId] });
      // Pre-fill petInfo from new pet data
      setPetInfo({
        species: newPet.species || "",
        breed: newPet.breed || "",
        weight: newPet.weight || "",
        age: newPet.age || "",
        gender: newPet.gender || "",
      });
      setSelectedPetId(newPet.id);
      setStep("pet_details");
      toast({ title: "Pet profile created!", description: "Now verify your pet's details to continue." });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Failed to create pet", description: err.message });
    },
  });

  // AUTO-UNLOCK POLLING
  useEffect(() => {
    if (!user?.email || isPaid) return;
    const interval = setInterval(async () => {
      try {
        const response = await apiRequest("GET", `/api/stripe/fulfill-by-email?email=${user.email}&type=injury_report`);
        const data = await response.json();
        if (data.success) {
          setFulfillmentStatus("✅ Payment Confirmed! Unlocking...");
          await refreshUser();
          setIsPaid(true);
          toast({ title: "Success", description: "Your injury scan has been unlocked!" });
          clearInterval(interval);
        } else {
          setFulfillmentStatus("🔍 Searching for payment...");
        }
      } catch {
        setFulfillmentStatus("⚠️ Waiting for Stripe signal...");
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [user?.email, isPaid]);

  // Handle new pet photo upload (same flow as home.tsx analyzeImage)
const handleNewPetPhotoUpload = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > MAX_IMAGE_SIZE) {
      toast({ variant: "destructive", title: "Image too large", description: "Max 15MB" });
      return;
    }

    setIsCreatingPet(true);
    try {
      // 1. ALWAYS compress the image first to make it extremely lightweight!
      // This stops the terminal from choking on massive strings and speeds up the AI call.
      // We pass 0.6 quality to crunch it down significantly.
      const compressedDataUrl = await compressImage(file, 0.6); 
      
      setNewPetImagePreview(compressedDataUrl);
      
      // Extract just the base64 string for the AI (remove the data:image/jpeg;base64, prefix)
      const base64 = compressedDataUrl.split(",")[1];

      // 2. Call AI Analysis with the COMPRESSED, tiny image
      const analyzeRes = await apiRequest("POST", "/api/analyze", {
        imageData: base64,
        userId: user?.dbId,
      });

      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.details || "Analysis failed");
      }
      
      const analysis = await analyzeRes.json(); 

      // 3. Create the Pet in the database using the same COMPRESSED image
      await createPetMutation.mutateAsync({
        name: "New Pet",
        userId: user?.dbId || 0,
        species: analysis.species || "Unknown",
        breed: analysis.breed ?? null,
        gender: analysis.gender ?? null,
        age: (analysis as any).age ?? null,
        imageUrl: compressedDataUrl, // Use the lightweight string here!
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
        groomingVideos: (analysis.groomingVideos || []).map((v: any) => JSON.stringify(v)),
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
        trainingVideos: (analysis.trainingVideos || []).map((v: any) => JSON.stringify(v)),
        trainingSchedule: analysis.trainingSchedule ?? null,
        exerciseType: analysis.exerciseType ?? null,
        trainingProgress: analysis.trainingProgress ?? null,
        vaccinationRecords: [],
        vaccinationSchedule: null,
        nextVaccinationDue: null,
        vaccinationNotes: null,
      } as any);

    } catch (err: any) {
      toast({ variant: "destructive", title: "Identification Failed", description: err.message || "Could not identify pet." });
      setStep("pet_details");
    } finally {
      setIsCreatingPet(false);
    }
  };
  // When user selects existing pet → pre-fill petInfo → go to pet_details
  const handleSelectExistingPet = (pet: Pet) => {
    setSelectedPetId(pet.id);
    setPetInfo({
      species: pet.species || "",
      breed: pet.breed || "",
      weight: pet.weight || "",
      age: (pet as any).age || "",
      gender: pet.gender || "",
    });
    setStep("pet_details");
  };

  const handleInjuryUpload = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setInjuryImage(reader.result as string);
    reader.readAsDataURL(file);

    setIsAnalyzing(true);
    try {
      const base64Data = (await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(file);
      })) as string;

      const base64Image = base64Data.split(",")[1];
      const response = await apiRequest("POST", "/api/analyze/injury", {
        imageData: base64Image,
        petSpecies: petInfo.species,
        petBreed: petInfo.breed,
        injuryDetails: {},
      });

      if (!response.ok) throw new Error();

      const result = await response.json();
      setAnalysis(result);

      if (user) {
        const saveRes = await apiRequest("POST", "/api/standalone/scan", {
          userId: user.dbId,
          petInfo,
          injuryPhotoUrl: base64Image,
          analysisResults: result,
        });
        const responseData = await saveRes.json();
        setCurrentScanId(responseData.scanId);

        const isScanUnlocked = responseData.isPaid === 1 || responseData.isPaid === true;
        setIsPaid(isScanUnlocked);
        await refreshUser();
      }

      setStep("analysis");
    } catch {
      toast({ variant: "destructive", title: "Analysis Failed", description: "Failed to analyze injury. Please try again." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps: getNewPetProps, getInputProps: getNewPetInput } = useDropzone({
    onDrop: handleNewPetPhotoUpload,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
    disabled: isCreatingPet,
  });

  const { getRootProps: getInjuryProps, getInputProps: getInjuryInput } = useDropzone({
    onDrop: handleInjuryUpload,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
  });

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to proceed with payment." });
      return;
    }
    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout", {
        type: "injury_report",
        userId: user.dbId,
        metadata: { scanId: currentScanId },
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch {
      toast({ variant: "destructive", title: "Error", description: "Could not initiate payment." });
    }
  };

  // Step labels updated — "Identification" replaced by "Select Pet"
  const stepLabels = [
    { label: "Select Pet", id: "pet_select" },
    { label: "Details", id: "pet_details" },
    { label: "Injury Photo", id: "injury_photo" },
    { label: "Full Report", id: "analysis" },
  ];

  // Map create_pet to pet_select visually in progress bar
  const progressStep = step === "create_pet" ? "pet_select" : step;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Progress Indicators */}
      <div className="flex justify-between mb-8 opacity-60">
        {stepLabels.map((s, idx) => (
          <div
            key={s.id}
            className={`flex flex-col items-center gap-2 ${progressStep === s.id ? "text-[#ff6b4a] opacity-100 font-bold" : ""}`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${
                progressStep === s.id ? "border-[#ff6b4a] bg-[#ff6b4a]/10" : ""
              }`}
            >
              {idx + 1}
            </div>
            <span className="text-[10px] uppercase tracking-wider hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── STEP 1A: Pet Select (has pets) or Create Pet (no pets) ── */}
      {step === "pet_select" && (
        <Card className="border-2 border-dashed border-muted hover:border-[#ff6b4a]/30 transition-all">
          <CardHeader className="text-center">
            <PawPrint className="w-12 h-12 mx-auto mb-2 text-[#ff6b4a]" />
            <CardTitle>
              {Number(user?.freeInjuryScanUsed || 0) >= 2
                ? "Premium Analysis Required"
                : isLoadingPets
                ? "Loading your pets..."
                : pets && pets.length > 0
                ? "Step 1: Select Your Pet"
                : "Step 1: Create a Pet Profile"}
            </CardTitle>
            <CardDescription>
              {Number(user?.freeInjuryScanUsed || 0) >= 2
                ? "You've used your scans. Upgrade to continue."
                : pets && pets.length > 0
                ? "Choose an existing pet or add a new one."
                : "Upload a photo so AI can identify your pet, or enter details manually."}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {/* ── Paywall ── */}
            {Number(user?.freeInjuryScanUsed || 0) >= 2 ? (
              <div className="flex flex-col items-center gap-6 py-8">
                <div className="bg-primary/5 rounded-2xl p-8 w-full text-center space-y-4">
                  <div className="text-3xl font-black">$4.99</div>
                  <p className="text-sm text-muted-foreground">Complete High-Accuracy Medical Report & AI Vet Access</p>
                  <Button
                    size="lg"
                    className="w-full bg-[#ff6b4a] hover:bg-[#e05a3b] py-6 font-bold"
                    onClick={handleCheckout}
                  >
                    Pay & Start Scan
                  </Button>
                  {fulfillmentStatus && (
                    <div className="flex items-center justify-center gap-2 py-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                      <span className="text-xs font-medium text-muted-foreground animate-pulse">{fulfillmentStatus}</span>
                    </div>
                  )}
                </div>
              </div>
            ) : isLoadingPets ? (
              <div className="flex flex-col items-center py-12 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-[#ff6b4a]" />
                <p className="text-muted-foreground animate-pulse">Loading your pets...</p>
              </div>
            ) : pets && pets.length > 0 ? (
              /* ── Has pets: show grid to select + "Add New" button ── */
              <div className="space-y-6">
                <div className="grid gap-4 sm:grid-cols-2">
                  {pets.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => handleSelectExistingPet(pet)}
                      className="flex items-center gap-4 p-4 rounded-xl border-2 border-border hover:border-[#ff6b4a]/50 hover:bg-[#ff6b4a]/5 transition-all text-left group"
                    >
                      {pet.imageUrl ? (
                        <img
                          src={pet.imageUrl}
                          alt={pet.name}
                          className="w-16 h-16 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-muted flex items-center justify-center shrink-0">
                          <PawPrint className="w-7 h-7 text-muted-foreground" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="font-bold truncate">{pet.name}</p>
                        <p className="text-sm text-muted-foreground truncate">
                          {pet.breed ? `${pet.species} · ${pet.breed}` : pet.species}
                        </p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground ml-auto shrink-0 group-hover:text-[#ff6b4a] transition-colors" />
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-card px-3 text-muted-foreground">or</span>
                  </div>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2 border-dashed border-2 py-6 text-muted-foreground hover:text-[#ff6b4a] hover:border-[#ff6b4a]/40"
                  onClick={() => setStep("create_pet")}
                >
                  <Plus className="w-5 h-5" />
                  Add a New Pet
                </Button>
              </div>
            ) : (
              /* ── No pets: go straight to create flow ── */
              <div className="space-y-4 text-center py-4">
                <p className="text-muted-foreground text-sm">No pets yet. Let's create a profile first.</p>
                <Button
                  className="bg-[#ff6b4a] hover:bg-[#e05a3b] gap-2"
                  onClick={() => setStep("create_pet")}
                >
                  <Plus className="w-4 h-4" /> Create Pet Profile
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── STEP 1B: Create New Pet (photo upload → auto-identify, mirrors home.tsx) ── */}
      {step === "create_pet" && (
        <Card className="border-2 border-dashed border-muted hover:border-[#ff6b4a]/30 transition-all">
          <CardHeader className="text-center">
            <PawPrint className="w-12 h-12 mx-auto mb-2 text-[#ff6b4a]" />
            <CardTitle>Add New Pet</CardTitle>
            <CardDescription>
              Upload a full-body photo — our AI will detect species, breed & more, then create the profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div
              {...getNewPetProps()}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 relative
                ${isCreatingPet ? "cursor-wait border-primary/20 bg-primary/5" : "cursor-pointer border-primary/40 hover:border-[#ff6b4a] hover:bg-[#ff6b4a]/5 hover:-translate-y-1 hover:shadow-lg"}`}
            >
              <input {...getNewPetInput()} />
              {isCreatingPet ? (
                <div className="space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#ff6b4a]" />
                  <p className="font-semibold animate-pulse">Creating pet profile...</p>
                  <p className="text-sm text-muted-foreground">PetCare AI is identifying your pet</p>
                </div>
              ) : newPetImagePreview ? (
                <img src={newPetImagePreview} alt="Pet preview" className="max-h-48 mx-auto rounded-xl object-cover" />
              ) : (
                <div className="space-y-4">
                  <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                  <p className="font-medium">Click or drag a full-body photo here</p>
                  <p className="text-sm text-muted-foreground">JPG, PNG up to 15MB</p>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              className="w-full text-muted-foreground"
              onClick={() => setStep("pet_select")}
            >
              ← Back to Pet Selection
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── STEP 2: Verify Pet Details ── */}
      {step === "pet_details" && (
        <Card className="border-[#ff6b4a]/20 shadow-lg">
          <CardHeader>
            <CardTitle>Verify Pet Information</CardTitle>
            <CardDescription>Confirm and add missing details before the injury scan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Species</Label>
                <Input value={petInfo.species} onChange={(e) => setPetInfo({ ...petInfo, species: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Breed</Label>
                <Input value={petInfo.breed} onChange={(e) => setPetInfo({ ...petInfo, breed: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Weight (e.g. 25 lbs) <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. 25 lbs" value={petInfo.weight} onChange={(e) => setPetInfo({ ...petInfo, weight: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Age (Years) <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. 5" value={petInfo.age} onChange={(e) => setPetInfo({ ...petInfo, age: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Gender <span className="text-red-500">*</span></Label>
                <Select value={petInfo.gender} onValueChange={(val) => setPetInfo({ ...petInfo, gender: val })}>
                  <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2">
                    <SelectValue placeholder="Select Gender" />
                  </SelectTrigger>
                  <SelectContent className="z-[10001]">
                    <SelectItem value="Male">Male</SelectItem>
                    <SelectItem value="Female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              className="w-full bg-[#ff6b4a] hover:bg-[#e05a3b]"
              onClick={() => {
                if (!petInfo.age || !petInfo.gender || !petInfo.weight) {
                  toast({
                    variant: "destructive",
                    title: "Required Fields",
                    description: "Please enter your pet's age, gender, and weight to continue.",
                  });
                  return;
                }
                
                // SAVE data to the database before moving to injury scan
                if (selectedPetId) {
                  updatePetDetailsMutation.mutate({
                    species: petInfo.species,
                    breed: petInfo.breed,
                    weight: petInfo.weight,
                    age: petInfo.age,
                    gender: petInfo.gender,
                  } as any);
                }

                setStep("injury_photo");
              }}
            >
              Next: Upload Injury Photo <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── STEP 3: Injury Photo ── */}
      {step === "injury_photo" && (
        <Card className="border-2 border-dashed border-red-200 bg-red-50/10 dark:bg-red-950/5">
          <CardHeader className="text-center">
            <HeartPulse className="w-12 h-12 mx-auto mb-2 text-red-500" />
            <CardTitle>Step 2: Scan the Injury</CardTitle>
            <CardDescription>Take a clear, close-up photo of the affected area.</CardDescription>
          </CardHeader>
          <CardContent>
            <div
              {...getInjuryProps()}
              className="border-2 border-dashed border-red-200/50 rounded-xl p-12 text-center cursor-pointer hover:bg-red-50/20 transition-colors"
            >
              <input {...getInjuryInput()} />
              {isAnalyzing ? (
                <div className="space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto text-red-500" />
                  <p className="font-semibold text-red-600 animate-pulse">Running AI Medical Analysis...</p>
                  <p className="text-sm text-muted-foreground italic text-center">Comparing against 50,000+ veterinary case files</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-10 h-10 mx-auto text-red-400" />
                  <p className="font-medium">Upload Injury Photo</p>
                  <p className="text-sm text-muted-foreground max-w-xs mx-auto">Ensure good lighting and focus for higher accuracy.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── STEP 4: Analysis Results (unchanged) ── */}
      {step === "analysis" && analysis && (
        <div className="space-y-6">
          <Alert
            className={`border-2 ${
              analysis.severity === "HIGH" ? "border-red-500 bg-red-50/10" : "border-yellow-500 bg-yellow-50/10"
            }`}
          >
            <AlertTriangle
              className={`h-6 w-6 ${analysis.severity === "HIGH" ? "text-red-500" : "text-yellow-500"}`}
            />
            <AlertTitle className="text-xl font-bold ml-2">
              Potential {analysis.severity} Severity Detected
            </AlertTitle>
            <AlertDescription className="mt-2 text-md">{analysis.injuryDescription}</AlertDescription>
          </Alert>

          <Card className="overflow-hidden border-2 border-[#0a0a0a]">
            <CardHeader className="bg-[#0a0a0a] text-white py-4">
              <CardTitle className="flex justify-between items-center">
                <span>Preliminary Triage Report</span>
                <Badge variant="outline" className="text-white border-white">
                  {petInfo.species} - {petInfo.breed}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="relative">
                <div
                  className={`space-y-6 ${!isUnlocked ? "blur-[8px] pointer-events-none select-none opacity-40" : ""}`}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold border-b pb-2">Treatment Options</h3>
                      <div className="space-y-4">
                        {analysis.treatmentOptions.map((opt, i) => (
                          <div key={i} className="p-4 bg-muted/50 rounded-xl space-y-1">
                            <p className="font-bold text-[#ff6b4a]">{opt.name}</p>
                            <p className="text-sm">{opt.description}</p>
                            <div className="mt-2 text-xs opacity-70">
                              <b>Ingredients:</b> {opt.activeIngredients.join(", ")}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-lg font-bold border-b pb-2">Immediate Steps</h3>
                      <ul className="space-y-2">
                        {analysis.immediateActions.map((action, i) => (
                          <li key={i} className="flex gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                      <h3 className="text-lg font-bold border-b pb-2 pt-4">Vet Recommendation</h3>
                      <p className="text-sm">
                        {analysis.requiredVetVisit
                          ? "⚠️ This condition requires a professional veterinary examination."
                          : "✅ Home care may be sufficient, but monitor closely."}
                      </p>
                    </div>
                  </div>
                </div>

                {!isUnlocked && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full shadow-2xl border-[#ff6b4a]/30 bg-white dark:bg-gray-900">
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Unlock Full Analysis</CardTitle>
                        <CardDescription>
                          Get the complete report including medications, expert advice, and AI Vet chat access.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-6">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-4xl font-black text-[#0a0a0a] dark:text-white">$4.99</span>
                          <span className="text-xs text-muted-foreground">one-time payment per scan</span>
                        </div>
                        <div className="space-y-3">
                          {[
                            "Detailed medical descriptions & diagnosis",
                            "Exact medication & ointment names",
                            "Unlock 24/7 AI Vet Chat for follow up",
                          ].map((f) => (
                            <div key={f} className="flex items-center gap-2 text-sm text-left px-4">
                              <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                              <span>{f}</span>
                            </div>
                          ))}
                        </div>
                        <Button
                          size="lg"
                          className="w-full bg-[#ff6b4a] hover:bg-[#e05a3b] text-lg font-bold py-7 rounded-xl shadow-lg hover:shadow-[#ff6b4a]/20"
                          onClick={handleCheckout}
                        >
                          Unlock Full Report Now
                        </Button>
                        {fulfillmentStatus && (
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                            <span className="text-xs font-medium text-orange-600 dark:text-orange-400 animate-pulse">
                              {fulfillmentStatus}
                            </span>
                          </div>
                        )}
                        <p className="text-[10px] text-muted-foreground">Secure payment via Stripe. 256-bit encryption.</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Vet Chat */}
          <div className="bg-muted/30 rounded-2xl p-8 text-center border-2 border-dashed flex flex-col items-center gap-4">
            <MessageSquare className="w-12 h-12 text-muted-foreground opacity-20" />
            <div className="space-y-1">
              <h3 className={`font-bold text-lg ${!isUnlocked ? "opacity-40" : ""}`}>24/7 Veterinary Assistant</h3>
              <p className={`text-sm text-muted-foreground max-w-sm ${!isUnlocked ? "opacity-40" : ""}`}>
                Ask follow-up questions about this injury, recovery, or diet directly to our expert AI Vet.
              </p>
            </div>
            {isUnlocked ? (
              <Button
                className="gap-2 bg-[#ff6b4a] hover:bg-[#e05a3b] px-8 py-6 text-lg font-bold shadow-lg shadow-orange-500/20 animate-in fade-in zoom-in duration-300"
                onClick={() => {
                const injuryContext = encodeURIComponent(JSON.stringify({
                  petId: selectedPetId,
                  petInfo,
                  injuryDescription: analysis?.injuryDescription,
                  severity: analysis?.severity,
                }));
                setLocation(`/vet?injuryContext=${injuryContext}`);
              }}
              >
                Start Consultation <MessageSquare className="w-5 h-5 ml-1" />
              </Button>
            ) : (
              <Button variant="outline" disabled className="gap-2 border-muted-foreground/30 text-muted-foreground px-8 py-6">
                Unlock with Report
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}