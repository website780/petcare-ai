import { useState, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Upload, Loader2, MessageSquare, Send, User, 
  ChevronRight, Sparkles, CheckCircle2, Lock, CreditCard,
  PawPrint, Plus, RotateCcw, ArrowLeft, Stethoscope, HeartPulse
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from 'react-markdown';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { type Pet, insertPetSchema } from "@shared/schema";
import { HealthAssessmentQuiz } from "@/components/HealthAssessmentQuiz";
import { VetConsultation } from "@/components/VetConsultation";

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

interface VetChatCategory {
  id: string;
  name: string;
  description: string;
  examples: string[];
}

const issueCategories: VetChatCategory[] = [
  {
    id: "behaviour",
    name: "Behavioral Issues",
    description: "Ask about unusual behaviors, aggression, anxiety, or training concerns",
    examples: [
      "My pet is suddenly afraid of loud noises",
      "Why is my pet hiding more than usual?",
      "My pet is showing aggression toward other animals"
    ]
  },
  {
    id: "diet",
    name: "Diet & Nutrition",
    description: "Questions about food, diet changes, weight issues, or eating habits",
    examples: [
      "My pet has stopped eating their regular food",
      "How much should I feed my pet?",
      "Is my pet's weight healthy?"
    ]
  },
  {
    id: "symptom",
    name: "General Symptoms",
    description: "Discuss symptoms like lethargy, vomiting, digestive issues, or other health concerns",
    examples: [
      "My pet seems more tired than usual",
      "My pet is drinking more water than normal",
      "My pet has been vomiting"
    ]
  },
  {
    id: "preventcare",
    name: "Preventive Care",
    description: "Ask about vaccinations, parasite prevention, dental care, or routine check-ups",
    examples: [
      "When should my pet be vaccinated?",
      "What flea and tick prevention is best?",
      "How often should I brush my pet's teeth?"
    ]
  },
  {
    id: "senior",
    name: "Senior Pet Care",
    description: "Questions about aging pets, mobility issues, cognitive changes, or special needs",
    examples: [
      "My older pet is sleeping more than usual",
      "My senior pet seems confused sometimes",
      "My pet is having trouble climbing stairs"
    ]
  }
];

type Step = "pet_select" | "pet_details" | "chat";

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

export function VetChatStandalone() {
  const { user, refreshUser, loading } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [step, setStep] = useState<Step>("pet_select");

  const queryClient = useQueryClient();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [isCreatingPet, setIsCreatingPet] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isFetchingQuestions, setIsFetchingQuestions] = useState(false);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  
  // Pet Data
  const [petInfo, setPetInfo] = useState<{
    species: string;
    breed: string;
    weight: string;
    age: string;
    gender: string;
  }>({
    species: "",
    breed: "",
    weight: "",
    age: "",
    gender: "",
  });

  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [currentChatId, setCurrentChatId] = useState<number | null>(null);
  const [fulfillmentStatus, setFulfillmentStatus] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { data: pets, isLoading: isLoadingPets } = useQuery<Pet[]>({
    queryKey: ["/api/pets", user?.dbId],
    queryFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const response = await apiRequest("GET", `/api/pets?userId=${user.dbId}`);
      return response.json();
    },
    enabled: !!user?.dbId,
  });

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
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets", user?.dbId] });
      setPetInfo({
        species: newPet.species || "",
        breed: newPet.breed || "",
        weight: newPet.weight || "",
        age: (newPet as any).age || "",
        gender: newPet.gender || "",
      });
      setSelectedPetId(newPet.id);
      setStep("pet_details");
      toast({ title: "Pet profile created!", description: "Verify details to start consultation." });
    },
    onError: (err: any) => {
      toast({ variant: "destructive", title: "Failed to create pet", description: err.message });
    },
  });

  // Fetch dynamic AI questions from the API
  const fetchInitialQuestions = async (species: string, breed?: string, severity?: string) => {
    setIsFetchingQuestions(true);
    try {
      const res = await apiRequest("POST", "/api/chat/initial-questions", {
        petSpecies: species,
        petBreed: breed,
        severity: severity || "potential"
      });
      const data = await res.json();
      if (data.questions) {
        setSuggestedQuestions(data.questions);
      }
    } catch (error) {
      console.error("Failed to fetch initial questions:", error);
    } finally {
      setIsFetchingQuestions(false);
    }
  };

  // AUTO-UNLOCK POLLING
  useEffect(() => {
    if (!user?.email || (Number(user?.vetChatCredits ?? 0) > 0)) return;
    
    const interval = setInterval(async () => {
      try {
        const response = await apiRequest("GET", `/api/stripe/fulfill-by-email?email=${user.email}&type=vet_chat_pack`);
        const data = await response.json();
        
        if (data.success) {
          setFulfillmentStatus("✅ Credits Added! Consultation Unlocked.");
          await refreshUser();
          toast({ title: "Credits Added", description: "5 new questions have been added to your account!" });
          clearInterval(interval);
        } else {
          setFulfillmentStatus("🔍 Searching for payment...");
        }
      } catch (e) {
        setFulfillmentStatus("⚠️ Waiting for Stripe signal...");
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [user?.email, user?.vetChatCredits]);

  // Load latest chat on mount and Handle persistence
  useEffect(() => {
    if (loading) return;

    const loadLatestChat = async () => {
      // 1. Detect injury handoff from URL
      const params = new URLSearchParams(window.location.search);
      const injuryContextRaw = params.get("injuryContext");
      
      if (injuryContextRaw) {
        try {
          const ctx = JSON.parse(decodeURIComponent(injuryContextRaw));
          if (ctx.petId) setSelectedPetId(ctx.petId);
          if (ctx.petInfo) setPetInfo(ctx.petInfo);
          
          setStep("chat");
          setIsInitialLoading(false);

          // Get Dynamic Questions
          fetchInitialQuestions(ctx.petInfo?.species || "pet", ctx.petInfo?.breed, ctx.severity);

          // Instantly sync empty chat to persist it so it survives a refresh
          if (user?.dbId) {
             const res = await apiRequest("POST", "/api/standalone/vet-chat", {
               userId: user.dbId,
               petInfo: ctx.petInfo,
               chatHistory: []
             });
             const data = await res.json();
             if (data.id) setCurrentChatId(data.id);
          }

          // Clean up URL so refresh doesn't trigger this branch again
          window.history.replaceState({}, document.title, window.location.pathname);
          return;
        } catch {
          // bad params, fall through
        }
      }

      // 2. Load from DB state (Survives Refresh)
      if (user?.dbId) {
        try {
          const res = await apiRequest("GET", `/api/standalone/vet-chat/latest?userId=${user.dbId}`);
          if (res.ok) {
            const latestChat = await res.json();
            if (latestChat) {
              setCurrentChatId(latestChat.id);
              if (latestChat.petInfo) setPetInfo(latestChat.petInfo);
              
              if (latestChat.chatHistory && latestChat.chatHistory.length > 0) {
                // Chat has messages, just load the history
                setChatHistory(latestChat.chatHistory.map((m: any) => ({
                  role: m.role,
                  content: m.content,
                  timestamp: new Date()
                })));
                setStep("chat");
              } else if (latestChat.petInfo?.species) {
                // Empty chat restored from DB -> Re-fetch questions!
                fetchInitialQuestions(latestChat.petInfo.species, latestChat.petInfo.breed);
                setStep("chat");
              }
            }
          }
        } catch (error) {
          console.error("[VET-CHAT] Load failed:", error);
        }
      }
      setIsInitialLoading(false);
    };

    if (step === "pet_select") {
      loadLatestChat();
    } else {
      setIsInitialLoading(false);
    }
  }, [user?.dbId, loading]);

  // Sync chat to database
  const syncChat = async (history: ChatMessage[], info = petInfo) => {
    if (!user?.dbId) return;
    try {
      const res = await apiRequest("POST", "/api/standalone/vet-chat", {
        userId: user.dbId,
        id: currentChatId,
        petInfo: info,
        chatHistory: history.map(m => ({ role: m.role, content: m.content }))
      });
      const data = await res.json();
      if (data.id && currentChatId !== data.id) {
        setCurrentChatId(data.id);
      }
    } catch (error) {
      console.error("[VET-CHAT] Sync failed:", error);
    }
  };

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  const handleNewPetPhotoUpload = async (acceptedFiles: File[]) => {
    const tokens = Number(user?.appTokenBalance ?? 0);
    if (tokens < 2) {
      toast({ 
        variant: "destructive", 
        title: "Insufficient Tokens", 
        description: "Creating a new pet profile requires 2 tokens. Please top up your wallet." 
      });
      handleBuyCredits();
      return;
    }

    const file = acceptedFiles[0];
    if (!file) return;
    if (file.size > 15 * 1024 * 1024) {
      toast({ variant: "destructive", title: "Image too large", description: "Max 15MB" });
      return;
    }

    setIsCreatingPet(true);
    try {
      const compressedDataUrl = await compressImage(file, 0.6);
      const base64 = compressedDataUrl.split(",")[1];

      const analyzeRes = await apiRequest("POST", "/api/analyze", {
        imageData: base64,
        userId: user?.dbId,
      });
      if (!analyzeRes.ok) {
        const err = await analyzeRes.json();
        throw new Error(err.details || "Analysis failed");
      }
      const analysis = await analyzeRes.json();

      // BREED FIX: Populating form immediately so user sees it right away
      setPetInfo(prev => ({
        ...prev,
        species: analysis.species || prev.species,
        breed: analysis.breed || prev.breed,
        weight: analysis.weight || prev.weight,
        gender: analysis.gender || prev.gender
      }));

      await createPetMutation.mutateAsync({
        name: "New Pet",
        userId: user?.dbId || 0,
        species: analysis.species || "Unknown",
        breed: analysis.breed ?? null,
        gender: analysis.gender ?? null,
        imageUrl: compressedDataUrl,
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

  const { getRootProps: getNewPetProps, getInputProps: getNewPetInput } = useDropzone({
    onDrop: handleNewPetPhotoUpload,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
    disabled: isCreatingPet || (Number(user?.appTokenBalance ?? 0) < 2),
  });

  const handleSendMessage = async (overrideMessage?: string) => {
    const message = (overrideMessage ?? inputMessage).trim();
    if (!message) return;

    const tokensRemaining = Number(user?.appTokenBalance ?? 0);
    if (tokensRemaining < 3) {
      handleBuyCredits();
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: message, timestamp: new Date() };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setInputMessage("");
    setIsSending(true);

    syncChat(updatedHistory);

    try {
      const res = await apiRequest("POST", "/api/chat/vet", {
        message: message,
        userId: user?.dbId,
        petId: selectedPetId,
        petInfo,
        chatHistory: chatHistory.map(m => ({ role: m.role, content: m.content })),
        isStandalone: true
      });

      if (res.status === 403) {
        handleBuyCredits();
        return;
      }

      if (!res.ok) throw new Error();
      const data = await res.json();
      
      const finalHistory: ChatMessage[] = [...updatedHistory, { role: "assistant", content: data.response, timestamp: new Date() }];
      setChatHistory(finalHistory);
      syncChat(finalHistory);
      await refreshUser();
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Your credit limit has been reached or there was a network error. Please top up to continue." });
    } finally {
      setIsSending(false);
    }
  };

  const handleBuyCredits = () => {
    setLocation("/pricing");
  };

  if (isInitialLoading || loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-[#ff6b4a]" />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">Restoring your consultation...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-4 pb-10 pt-2 md:pt-4">
      <Button 
        variant="ghost" 
        onClick={() => setLocation("/")}
        className="hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl"
      >
        <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
        Back to Dashboard
      </Button>
      {step === "pet_select" && (
        <div className="space-y-6">
          {isLoadingPets ? (
            <div className="flex justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-[#ff6b4a]" />
            </div>
          ) : pets && pets.length > 0 ? (
            <Card className="border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
              <CardHeader className="text-center">
                <PawPrint className="w-12 h-12 mx-auto mb-2 text-[#ff6b4a]" />
                <CardTitle>Select Your Pet</CardTitle>
                <CardDescription>Choose which pet needs a consultation today.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {pets.map((pet) => (
                    <button
                      key={pet.id}
                      onClick={() => handleSelectExistingPet(pet)}
                      className="flex flex-col items-center gap-2 p-4 rounded-2xl border border-black/[0.04] hover:border-[#ff6b4a]/30 hover:bg-[#ff6b4a]/[0.03] hover:shadow-md transition-all duration-300 group"
                    >
                      {pet.imageUrl ? (
                        <img src={pet.imageUrl} alt={pet.name} className="w-16 h-16 rounded-full object-cover border-2 border-muted" />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                          <PawPrint className="w-6 h-6 text-muted-foreground" />
                        </div>
                      )}
                      <span className="text-sm font-semibold group-hover:text-[#ff6b4a] transition-colors">{pet.name}</span>
                      <span className="text-xs text-muted-foreground">{pet.breed || pet.species}</span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">or add a new pet</span>
                  </div>
                </div>

                <div
                  {...getNewPetProps()}
                  className="border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer hover:bg-[#ff6b4a]/[0.03] hover:border-[#ff6b4a]/30 transition-all duration-300"
                >
                  <input {...getNewPetInput()} />
                  {isCreatingPet ? (
                    <div className="space-y-2">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#ff6b4a]" />
                      <p className="text-sm font-medium animate-pulse">Identifying your pet...</p>
                    </div>
                  ) : (Number(user?.appTokenBalance ?? 0) < 2) ? (
                    <div className="flex flex-col items-center gap-2 opacity-60 py-2">
                      <Lock className="w-6 h-6 text-gray-400" />
                      <p className="text-sm font-black uppercase tracking-tight">Insufficient Tokens</p>
                      <p className="text-xs text-muted-foreground font-medium">2 Tokens required for AI profiling</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Plus className="w-8 h-8 text-[#ff6b4a]/50" />
                      <p className="text-sm font-medium">Upload new pet photo</p>
                      <p className="text-xs text-muted-foreground">AI identifies breed & details instantly</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden">
              <CardHeader className="text-center">
                <User className="w-12 h-12 mx-auto mb-2 text-[#ff6b4a]" />
                <CardTitle>Whom are we helping today?</CardTitle>
                <CardDescription>Upload a photo of your pet for instant identification.</CardDescription>
              </CardHeader>
              <CardContent>
                <div {...getNewPetProps()} className="border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer hover:bg-[#ff6b4a]/[0.03] hover:border-[#ff6b4a]/30 transition-all duration-300">
                  <input {...getNewPetInput()} />
                  {isCreatingPet ? (
                    <div className="space-y-4">
                      <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#ff6b4a]" />
                      <p className="font-medium animate-pulse">Running facial and body recognition...</p>
                    </div>
                  ) : (Number(user?.appTokenBalance ?? 0) < 2) ? (
                    <div className="flex flex-col items-center gap-4 opacity-60 py-4">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-2">
                        <Lock className="w-8 h-8 text-gray-400" />
                      </div>
                      <div>
                        <p className="text-lg font-black uppercase tracking-tighter">Insufficient Tokens</p>
                        <p className="text-sm text-muted-foreground font-medium">Creating a pet profile requires 2 universal tokens.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-[#ff6b4a]/40" />
                      <p className="text-lg font-semibold">Drop a pet photo here</p>
                      <p className="text-sm text-muted-foreground italic">AI will detect species, breed, and weight instantly</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {step === "pet_details" && (
        <div className="space-y-4">
          <Card className="border-[#ff6b4a]/20 shadow-xl overflow-hidden bg-white/60 dark:bg-black/60 backdrop-blur-xl">
            <div className="h-2 bg-[#ff6b4a]" />
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="text-2xl md:text-3xl font-bold">{petInfo.species || "Pet"}'s Digital Profile</CardTitle>
              <CardDescription>Generated by PetCare AI Analysis</CardDescription>
            </CardHeader>
            <CardContent className="p-4 md:p-6 space-y-4">
              {/* Profile Card Header */}
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="w-full md:w-48 h-48 rounded-2xl overflow-hidden shadow-lg border-4 border-white/50">
                  {pets?.find(p => p.id === selectedPetId)?.imageUrl ? (
                    <img 
                      src={pets.find(p => p.id === selectedPetId)?.imageUrl || ""} 
                      alt={petInfo.species} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#ff6b4a]/10 flex items-center justify-center">
                      <PawPrint className="w-12 h-12 text-[#ff6b4a]/40" />
                    </div>
                  )}
                </div>
                
                <div className="flex-1 w-full grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Species</p>
                    <p className="text-lg font-semibold">{petInfo.species}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Breed / Variety</p>
                    <p className="text-lg font-semibold">{petInfo.breed || "TBD during scan"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Gender</p>
                    <Select 
                      value={petInfo.gender} 
                      onValueChange={(val) => setPetInfo({...petInfo, gender: val})}
                    >
                      <SelectTrigger className="w-full h-10 bg-white/50 dark:bg-black/50 border-2">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="z-[10001]">
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs uppercase tracking-wider text-muted-foreground font-bold">Age (Years) <span className="text-red-500">*</span></p>
                    <Input 
                      placeholder="e.g. 3" 
                      value={petInfo.age} 
                      onChange={(e) => setPetInfo({...petInfo, age: e.target.value})}
                      className="h-10 text-lg font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#ff6b4a]/5 p-6 rounded-2xl border border-[#ff6b4a]/10">
                <div className="space-y-2">
                  <Label className="text-sm font-bold text-[#ff6b4a]">Current Weight (Lbs)</Label>
                  <Input 
                    value={petInfo.weight} 
                    onChange={(e) => setPetInfo({...petInfo, weight: e.target.value})}
                    placeholder="Enter weight"
                  />
                </div>
                <div className="flex items-end gap-3">
                   <Button 
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                    onClick={() => setStep("pet_select")}
                   >
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back
                   </Button>
                   <Button 
                    className="flex-[2] bg-[#ff6b4a] hover:bg-[#e05a3b] text-white font-bold h-12 rounded-xl group" 
                    disabled={loading}
                    onClick={async () => {
                      if (loading) return;
                      
                      if (!petInfo.age || !petInfo.gender) {
                        toast({
                          variant: "destructive",
                          title: "Missing Details",
                          description: "Please provide your pet's age and gender."
                        });
                        return;
                      }

                      const tokens = user ? Number(user.appTokenBalance ?? 0) : 0;
                      if (tokens < 3) {
                        toast({ variant: "destructive", title: "Insufficient Tokens", description: "3 Tokens required for a vet chat."});
                        handleBuyCredits();
                      } else {
                        setStep("chat");
                        // Sync pet details
                        if (selectedPetId) {
                          try {
                            await apiRequest("PATCH", `/api/pets/${selectedPetId}`, {
                              age: petInfo.age,
                              gender: petInfo.gender,
                              weight: petInfo.weight,
                              breed: petInfo.breed
                            });
                          } catch (e) {
                            console.error("Failed to sync pet details to database");
                          }
                        }
                        // Initialize session and questions
                        fetchInitialQuestions(petInfo.species, petInfo.breed);
                      }
                    }}
                  >
                    Go to Vet Chat <MessageSquare className="ml-2 w-5 h-5 group-hover:scale-110 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card className="border-border/50 bg-background/60 backdrop-blur-sm overflow-hidden">
               <CardHeader className="bg-primary/5 pb-0">
                <CardTitle className="text-xl flex items-center gap-2 pt-4 px-6">
                  <HeartPulse className="w-5 h-5 text-primary" />
                  Veterinary Care
                </CardTitle>
                <CardDescription className="px-6 pb-2">Comprehensive health tracking and assessment tools</CardDescription>
                <Tabs defaultValue="consultation" className="w-full">
                  <TabsList className="w-full justify-start rounded-none border-b bg-transparent h-12 px-6">
                    <TabsTrigger value="consultation" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold">
                      Consultation
                    </TabsTrigger>
                    <TabsTrigger value="assessment" className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent font-bold">
                      Health Assessment
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="consultation" className="p-6 mt-0">
                    <VetConsultation pet={pets?.find(p => p.id === selectedPetId) || (pets && pets[0])!} />
                  </TabsContent>
                  <TabsContent value="assessment" className="p-6 mt-0">
                    <HealthAssessmentQuiz pet={pets?.find(p => p.id === selectedPetId) || (pets && pets[0])!} />
                  </TabsContent>
                </Tabs>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#ff6b4a]" />
              How can we help you today?
            </h3>
            <p className="text-muted-foreground text-sm">Select a specific health category to get targeted guidance instantly.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {issueCategories.map(category => (
                <Card 
                  key={category.id} 
                  className="cursor-pointer hover:border-[#ff6b4a] hover:bg-[#ff6b4a]/5 transition-all group overflow-hidden border-2"
                  onClick={() => {
                    const tokens = user ? Number(user.appTokenBalance ?? 0) : 0;
                    if (tokens < 3) {
                      toast({ variant: "destructive", title: "Insufficient Tokens", description: "3 Tokens required for a vet chat."});
                      handleBuyCredits();
                      return;
                    }
                    setSelectedPetId(selectedPetId);
                    setStep("chat");
                    fetchInitialQuestions(petInfo.species, petInfo.breed);
                  }}
                >
                  <CardContent className="p-4">
                    <h4 className="font-bold text-[#ff6b4a] group-hover:scale-105 transition-transform origin-left">{category.name}</h4>
                    <p className="text-xs text-muted-foreground mt-1 mb-3">{category.description}</p>
                    <div className="space-y-1.5 border-t pt-3 border-[#ff6b4a]/10">
                      {category.examples.map((example, idx) => (
                        <button
                          key={idx}
                          className="w-full text-left text-[11px] text-[#ff6b4a] bg-[#ff6b4a]/5 hover:bg-[#ff6b4a]/10 p-2 rounded-lg transition-colors font-medium border border-[#ff6b4a]/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            const credits = user ? Number(user.vetChatCredits ?? 0) : 0;
                            if (credits <= 0) {
                              handleBuyCredits();
                              return;
                            }
                            setStep("chat");
                            handleSendMessage(example);
                          }}
                        >
                          {example}
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      )}

      {step === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card className="h-[600px] flex flex-col border border-black/[0.06] rounded-3xl overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.06)]">
              <CardHeader className="bg-gradient-to-r from-[#0a0a0a] to-[#1a1a2e] text-white py-4 shrink-0">
                <div className="flex items-center justify-between w-full">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                    Live AI Vet Chat
                  </CardTitle>
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => {
                        setChatHistory([]);
                        setCurrentChatId(null);
                        toast({ title: "Started a fresh conversation" });
                      }}
                      className="h-8 bg-white/10 border-white/20 hover:bg-[#ff6b4a] hover:border-[#ff6b4a] hover:text-white transition-all duration-300"
                    >
                      <RotateCcw className="w-3 h-3 mr-2" />
                      New Chat
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => setStep("pet_select")}
                      className="h-8 text-white hover:bg-[#ff6b4a] hover:text-white transition-all duration-300"
                    >
                      <ArrowLeft className="w-3 h-3 mr-2" />
                      Back
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10">
                {chatHistory.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-[#ff6b4a]/10 flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-[#ff6b4a]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xl">Consultation Started</h4>
                      <p className="text-muted-foreground text-sm max-w-xs">Upload medical records or ask questions about symptoms, diet, or behavior.</p>
                    </div>
                  </div>
                ) : (
                  chatHistory.map((msg, i) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] p-4 rounded-2xl ${
                        msg.role === 'user' 
                          ? 'bg-white shadow-sm border rounded-tr-none dark:bg-gray-800' 
                          : 'bg-white shadow-sm border rounded-tl-none dark:bg-gray-800'
                      }`}>
                        <div className="text-sm text-w leading-relaxed prose prose-sm max-w-none dark:prose-invert">
                          <ReactMarkdown>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                        <span className="text-[10px] mt-2 block opacity-50">
                          {msg.timestamp?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || ""}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </CardContent>

              <div className="p-4 border-t bg-white dark:bg-gray-900 shrink-0 rounded-b-xl space-y-2">
                {isFetchingQuestions && chatHistory.length === 0 && (
                  <div className="flex justify-center p-2">
                    <Loader2 className="w-5 h-5 animate-spin text-[#ff6b4a]" />
                  </div>
                )}
                
                {suggestedQuestions.length > 0 && chatHistory.length === 0 && !isFetchingQuestions && (
                  <div className="grid grid-cols-1 gap-2 mb-2">
                    {suggestedQuestions.map((q, i) => (
                      <button
                        key={i}
                        onClick={async () => {
                          setSuggestedQuestions([]);
                          setInputMessage("");
                          await handleSendMessage(q);
                        }}
                        className="w-full text-left text-xs p-3 rounded-xl bg-[#ff6b4a]/10 border border-[#ff6b4a]/30 text-[#ff6b4a] hover:bg-[#ff6b4a]/20 transition-colors font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Input
                    placeholder="Type your question..."
                    className="flex-1 h-12 rounded-xl"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={isSending}
                  />
                  <Button
                    className="h-12 w-12 rounded-xl bg-[#ff6b4a] hover:bg-[#e05a3b]"
                    onClick={() => handleSendMessage()}
                    disabled={isSending || !inputMessage.trim()}
                  >
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-2xl">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Session Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Tokens Remaining</span>
                  <Badge variant={(user?.appTokenBalance ?? 0) < 3 ? "destructive" : "secondary"} className="text-lg">
                    {user?.appTokenBalance ?? 0}
                  </Badge>
                </div>
                
                {(user?.appTokenBalance ?? 0) < 3 && (
                  <Alert className="bg-amber-50/50 border-amber-200 py-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <AlertDescription className="text-xs">
                      Running low on tokens? Top up to keep the consultation going.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  className="w-full bg-[#0a0a0a] hover:bg-black text-white gap-2 py-6"
                  onClick={handleBuyCredits}
                >
                  <CreditCard className="w-4 h-4" />
                  Top Up Tokens
                </Button>

                {fulfillmentStatus && (
                  <div className="flex items-center justify-center gap-2 py-1">
                    <div className="w-2 h-2 rounded-full bg-[#ff6b4a] animate-pulse" />
                    <span className="text-xs font-medium text-[#ff6b4a] animate-pulse">{fulfillmentStatus}</span>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 border-purple-200">
               <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-purple-600 uppercase">Emergency Tip</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[11px] leading-relaxed italic text-purple-800 dark:text-purple-300">
                  "If your pet is showing difficulty breathing, excessive bleeding, or sudden paralysis, please proceed to the nearest emergency veterinary clinic immediately."
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}