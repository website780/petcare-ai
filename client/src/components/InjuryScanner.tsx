import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Upload, Loader2, AlertTriangle, CheckCircle2, ChevronRight, User, HeartPulse, MessageSquare } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";

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

type Step = "body_photo" | "pet_details" | "injury_photo" | "analysis";

export function InjuryScanner() {
  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  
  const [step, setStep] = useState<Step>("body_photo");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
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

  const [bodyImage, setBodyImage] = useState<string | null>(null);
  const [injuryImage, setInjuryImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<InjuryAnalysis | null>(null);
  const [currentScanId, setCurrentScanId] = useState<number | null>(null);
  const [isPaid, setIsPaid] = useState<boolean>(false);

  const handleBodyUpload = async (acceptedFiles: File[]) => {
    if (user?.freeInjuryScanUsed === 1) {
      handleCheckout();
      return;
    }
    const file = acceptedFiles[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setBodyImage(reader.result as string);
    reader.readAsDataURL(file);

    setIsAnalyzing(true);
    try {
      const base64Data = (await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result as string);
        r.readAsDataURL(file);
      })) as string;

      const base64Image = base64Data.split(",")[1];
      const response = await apiRequest("POST", "/api/standalone/analyze-body", { imageData: base64Image });
      const result = await response.json();
      
      setPetInfo(prev => ({ ...prev, ...result }));
      setStep("pet_details");
    } catch (error) {
      toast({ variant: "destructive", title: "Identification Failed", description: "Could not identify pet. Please enter manually." });
      setStep("pet_details");
    } finally {
      setIsAnalyzing(false);
    }
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
        r.onload = () => resolve(r.result);
        r.readAsDataURL(file);
      })) as string;

      const base64Image = base64Data.split(",")[1];
      const response = await apiRequest("POST", "/api/analyze/injury", { 
        imageData: base64Image,
        petSpecies: petInfo.species,
        petBreed: petInfo.breed,
        injuryDetails: {} // Placeholder or expanded details
      });

      if (!response.ok) throw new Error();

      const result = await response.json();
      setAnalysis(result);
      
      // NEW: Persistent scan saving & Free scan logic
      if (user) {
        const saveRes = await apiRequest("POST", "/api/standalone/scan", {
          userId: user.dbId,
          petInfo,
          injuryPhotoUrl: base64Image, // In a real app, this would be a cloud URL
          analysisResults: result
        });
        const responseData = await saveRes.json();
        setCurrentScanId(responseData.scanId);
        
        // Robust check for isPaid being either 1 or true
        const isScanUnlocked = responseData.isPaid === 1 || responseData.isPaid === true;
        
        console.log(`[INJURY-SCAN] Scan ${responseData.scanId} unlocked: ${isScanUnlocked}`);
        setIsPaid(isScanUnlocked);
        
        // Await refresh to ensure UI tokens are up to date
        await refreshUser();
      }
      
      setStep("analysis");
    } catch (error) {
      toast({ variant: "destructive", title: "Analysis Failed", description: "Failed to analyze injury. Please try again." });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps: getBodyProps, getInputProps: getBodyInput } = useDropzone({
    onDrop: handleBodyUpload,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
  });

  const { getRootProps: getInjuryProps, getInputProps: getInjuryInput } = useDropzone({
    onDrop: handleInjuryUpload,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
  });

  const handleCheckout = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to proceed with payment." });
      // Redirect or show login modal (handled by layout usually)
      return;
    }

    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout", {
        type: "injury_report",
        userId: user.dbId,
        metadata: {
          scanId: currentScanId
        }
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not initiate payment." });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      {/* Progress Indicators */}
      <div className="flex justify-between mb-8 opacity-60">
        {[
          { label: "Identification", id: "body_photo" },
          { label: "Details", id: "pet_details" },
          { label: "Injury Photo", id: "injury_photo" },
          { label: "Full Report", id: "analysis" }
        ].map((s, idx) => (
          <div key={s.id} className={`flex flex-col items-center gap-2 ${step === s.id ? "text-[#ff6b4a] opacity-100 font-bold" : ""}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs border ${step === s.id ? "border-[#ff6b4a] bg-[#ff6b4a]/10" : ""}`}>
              {idx + 1}
            </div>
            <span className="text-[10px] uppercase tracking-wider hidden sm:block">{s.label}</span>
          </div>
        ))}
      </div>

      {step === "body_photo" && (
        <Card className="border-2 border-dashed border-muted hover:border-[#ff6b4a]/30 transition-all">
          <CardHeader className="text-center">
            <User className="w-12 h-12 mx-auto mb-2 text-[#ff6b4a]" />
            <CardTitle>{user?.freeInjuryScanUsed === 1 ? "Premium Analysis Required" : "Step 1: Identify Your Pet"}</CardTitle>
            <CardDescription>
              {user?.freeInjuryScanUsed === 1 
                ? "You have used your free platform scan. Upgrade to continue with high-accuracy AI diagnostics." 
                : "Upload a full body photo. Our AI will detect species, breed and weight."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {user?.freeInjuryScanUsed === 1 ? (
              <div className="flex flex-col items-center gap-6 py-8">
                <div className="bg-primary/5 rounded-2xl p-8 w-full text-center space-y-4">
                  <div className="text-3xl font-black">$5.00</div>
                  <p className="text-sm text-muted-foreground">Complete High-Accuracy Medical Report & AI Vet Access</p>
                  <Button 
                    size="lg" 
                    className="w-full bg-[#ff6b4a] hover:bg-[#e05a3b] py-6 font-bold"
                    onClick={handleCheckout}
                  >
                    Pay & Start Scan
                  </Button>
                </div>
              </div>
            ) : (
              <div
                {...getBodyProps()}
                className={`border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300 relative overflow-hidden group/dropzone
                  ${isAnalyzing ? 'border-primary/20 bg-primary/5 cursor-wait' : 'border-primary/40 hover:border-primary hover:bg-primary/5 cursor-pointer hover:shadow-lg hover:-translate-y-1'}`}
              >
                <input {...getBodyInput()} />
                {isAnalyzing ? (
                  <div className="space-y-4">
                    <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#ff6b4a]" />
                    <p className="animate-pulse">Identifying pet species and breed...</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Upload className="w-10 h-10 mx-auto text-muted-foreground" />
                    <p className="font-medium">Click or drag a full body photo here</p>
                    <p className="text-sm text-muted-foreground">This helps the AI provide specific medical context</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === "pet_details" && (
        <Card className="border-[#ff6b4a]/20 shadow-lg">
          <CardHeader>
            <CardTitle>Verify Pet Information</CardTitle>
            <CardDescription>Detected from photo. Please fill in the missing details.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Species</Label>
                <Input value={petInfo.species} onChange={(e) => setPetInfo({...petInfo, species: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Breed</Label>
                <Input value={petInfo.breed} onChange={(e) => setPetInfo({...petInfo, breed: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Weight (Lbs)</Label>
                <Input value={petInfo.weight} onChange={(e) => setPetInfo({...petInfo, weight: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Age (Years) <span className="text-red-500">*</span></Label>
                <Input placeholder="e.g. 5" value={petInfo.age} onChange={(e) => setPetInfo({...petInfo, age: e.target.value})} />
              </div>
              <div className="space-y-2">
                <Label>Gender <span className="text-red-500">*</span></Label>
                <select 
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                  value={petInfo.gender}
                  onChange={(e) => setPetInfo({...petInfo, gender: e.target.value})}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>
            <Button 
              className="w-full bg-[#ff6b4a] hover:bg-[#e05a3b]" 
              onClick={() => {
                if (!petInfo.age || !petInfo.gender) {
                  toast({
                    variant: "destructive",
                    title: "Required Fields",
                    description: "Please enter your pet's age and gender to continue."
                  });
                  return;
                }
                setStep("injury_photo");
              }}
            >
              Next: Upload Injury Photo <ChevronRight className="ml-1 w-4 h-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "injury_photo" && (
        <Card className="border-2 border-dashed border-red-200 bg-red-50/10 dark:bg-red-950/5">
          <CardHeader className="text-center">
            <HeartPulse className="w-12 h-12 mx-auto mb-2 text-red-500" />
            <CardTitle>Step 2: Scan the Injury</CardTitle>
            <CardDescription>Take a clear, close-up photo of the affected area.</CardDescription>
          </CardHeader>
          <CardContent>
             <div {...getInjuryProps()} className="border-2 border-dashed border-red-200/50 rounded-xl p-12 text-center cursor-pointer hover:bg-red-50/20 transition-colors">
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

      {step === "analysis" && analysis && (
        <div className="space-y-6">
           <Alert className={`border-2 ${analysis.severity === 'HIGH' ? 'border-red-500 bg-red-50/10' : 'border-yellow-500 bg-yellow-50/10'}`}>
            <AlertTriangle className={`h-6 w-6 ${analysis.severity === 'HIGH' ? 'text-red-500' : 'text-yellow-500'}`} />
            <AlertTitle className="text-xl font-bold ml-2">Potential {analysis.severity} Severity Detected</AlertTitle>
            <AlertDescription className="mt-2 text-md">
              {analysis.injuryDescription}
            </AlertDescription>
          </Alert>

          <Card className="overflow-hidden border-2 border-[#0a0a0a]">
            <CardHeader className="bg-[#0a0a0a] text-white py-4">
              <CardTitle className="flex justify-between items-center">
                <span>Preliminary Triage Report</span>
                <Badge variant="outline" className="text-white border-white">{petInfo.species} - {petInfo.breed}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              {/* Premium Content Wall */}
              <div className="relative">
                <div className={`space-y-6 ${!isPaid ? "blur-[8px] pointer-events-none select-none opacity-40" : ""}`}>
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
                      <p className="text-sm">{analysis.requiredVetVisit ? "⚠️ This condition requires a professional veterinary examination." : "✅ Home care may be sufficient, but monitor closely."}</p>
                    </div>
                  </div>
                </div>

                {!isPaid && (
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Card className="max-w-md w-full shadow-2xl border-[#ff6b4a]/30 bg-white dark:bg-gray-900">
                      <CardHeader className="text-center pb-2">
                        <CardTitle className="text-2xl">Unlock Full Analysis</CardTitle>
                        <CardDescription>Get the complete report including medications, expert advice, and AI Vet chat access.</CardDescription>
                      </CardHeader>
                      <CardContent className="text-center space-y-6">
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-4xl font-black text-[#0a0a0a] dark:text-white">$5.00</span>
                          <span className="text-xs text-muted-foreground">one-time payment per scan</span>
                        </div>
                        
                        <div className="space-y-3">
                           <div className="flex items-center gap-2 text-sm text-left px-4">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>Detailed medical descriptions & diagnosis</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-left px-4">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>Exact medication & ointment names</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-left px-4">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>Unlock 24/7 AI Vet Chat for follow up</span>
                          </div>
                        </div>

                        <Button 
                          size="lg" 
                          className="w-full bg-[#ff6b4a] hover:bg-[#e05a3b] text-lg font-bold py-7 rounded-xl shadow-lg hover:shadow-[#ff6b4a]/20"
                          onClick={handleCheckout}
                        >
                          Unlock Full Report Now
                        </Button>
                        
                        <p className="text-[10px] text-muted-foreground">Secure payment via Stripe. 256-bit encryption.</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* AI Vet Chat Placeholder (Locked) */}
          <div className="bg-muted/30 rounded-2xl p-8 text-center border-2 border-dashed flex flex-col items-center gap-4">
            <MessageSquare className="w-12 h-12 text-muted-foreground opacity-20" />
            <div className="space-y-1">
              <h3 className={`font-bold text-lg ${!isPaid ? "opacity-40" : ""}`}>24/7 Veterinary Assistant</h3>
              <p className={`text-sm text-muted-foreground max-w-sm ${!isPaid ? "opacity-40" : ""}`}>Ask follow-up questions about this injury, recovery, or diet directly to our expert AI Vet.</p>
            </div>
            {isPaid ? (
              <Button 
                className="gap-2 bg-[#ff6b4a] hover:bg-[#e05a3b] px-8 py-6 text-lg font-bold shadow-lg shadow-orange-500/20 animate-in fade-in zoom-in duration-300" 
                onClick={() => setLocation("/vet")}
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