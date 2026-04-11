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
  ChevronRight, Sparkles, CheckCircle2, Lock, CreditCard 
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/auth-context";

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

type Step = "pet_id" | "pet_details" | "chat";

export function VetChatStandalone() {
  const { user, refreshUser, loading } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<Step>("pet_id");
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
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load latest chat on mount
  useEffect(() => {
    if (loading) return;
    
    const loadLatestChat = async () => {
      if (user?.dbId) {
        try {
          console.log("[VET-CHAT] Fetching session for user:", user.dbId);
          const res = await apiRequest("GET", `/api/standalone/vet-chat/latest?userId=${user.dbId}`);
          if (res.ok) {
            const latestChat = await res.json();
            if (latestChat) {
              console.log("[VET-CHAT] Session restored:", latestChat.id);
              setCurrentChatId(latestChat.id);
              if (latestChat.petInfo) setPetInfo(latestChat.petInfo);
              
              if (latestChat.chatHistory && latestChat.chatHistory.length > 0) {
                const restoredHistory = latestChat.chatHistory.map((m: any) => ({
                  role: m.role,
                  content: m.content,
                  timestamp: new Date()
                }));
                setChatHistory(restoredHistory);
                setStep("chat");
              } else if (latestChat.petInfo?.species) {
                setStep("pet_details");
              }
            }
          }
        } catch (error) {
          console.error("[VET-CHAT] Load failed:", error);
        }
      }
      setIsInitialLoading(false);
    };

    if (step === "pet_id") {
      loadLatestChat();
    } else {
      setIsInitialLoading(false);
    }
  }, [user?.dbId, loading]);

  // Sync chat to database
  const syncChat = async (history: ChatMessage[], info = petInfo) => {
    if (!user?.dbId) return;
    try {
      console.log("[VET-CHAT] Syncing session...", { id: currentChatId, historyCount: history.length });
      const res = await apiRequest("POST", "/api/standalone/vet-chat", {
        userId: user.dbId,
        id: currentChatId,
        petInfo: info,
        chatHistory: history.map(m => ({ role: m.role, content: m.content }))
      });
      const data = await res.json();
      if (data.id && currentChatId !== data.id) {
        console.log("[VET-CHAT] Session ID assigned/updated:", data.id);
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

  const handleBodyUpload = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsAnalyzing(true);
    try {
      const base64Data = (await new Promise((resolve) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result);
        r.readAsDataURL(file);
      })) as string;

      const base64Image = base64Data.split(",")[1];
      const response = await apiRequest("POST", "/api/standalone/analyze-body", { imageData: base64Image });
      const result = await response.json();
      
      const updatedInfo = { ...petInfo, ...result };
      setPetInfo(updatedInfo);
      setStep("pet_details");
      
      // Save initial session
      syncChat([], updatedInfo);
    } catch (error) {
      toast({ variant: "destructive", title: "Identification Failed", description: "Please enter details manually." });
      setStep("pet_details");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const { getRootProps: getPetProps, getInputProps: getPetInput } = useDropzone({
    onDrop: handleBodyUpload,
    accept: { "image/*": [".jpeg", ".jpg", ".png"] },
    maxFiles: 1,
  });

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Check Credits (Now triggers Stripe automatically)
    const questionsRemaining = Number(user?.vetChatCredits ?? 0);
    if (questionsRemaining <= 0) {
      handleBuyCredits();
      return;
    }

    const userMsg: ChatMessage = { role: "user", content: inputMessage, timestamp: new Date() };
    const updatedHistory = [...chatHistory, userMsg];
    setChatHistory(updatedHistory);
    setInputMessage("");
    setIsSending(true);

    // Save immediately so state isn't lost if they close/redirect
    syncChat(updatedHistory);

    try {
      const res = await apiRequest("POST", "/api/chat/vet", {
        message: inputMessage,
        userId: user?.dbId,
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

  const handleBuyCredits = async () => {
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to buy credits." });
      return;
    }

    // Capture current state before redirecting
    await syncChat(chatHistory);

    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout", {
        type: "vet_chat_pack",
        userId: user.dbId,
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Could not initiate payment." });
    }
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
    <div className="max-w-4xl mx-auto">
      {step === "pet_id" && (
        <Card className="border-2 border-dashed border-[#ff6b4a]/20">
          <CardHeader className="text-center">
            <User className="w-12 h-12 mx-auto mb-2 text-[#ff6b4a]" />
            <CardTitle>Whom are we helping today?</CardTitle>
            <CardDescription>Upload a photo of your pet for an instant identification and health baseline.</CardDescription>
          </CardHeader>
          <CardContent>
            <div {...getPetProps()} className="border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer hover:bg-[#ff6b4a]/5 transition-all">
              <input {...getPetInput()} />
              {isAnalyzing ? (
                <div className="space-y-4">
                  <Loader2 className="w-10 h-10 animate-spin mx-auto text-[#ff6b4a]" />
                  <p className="font-medium animate-pulse">Running facial and body recognition...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  <Upload className="w-12 h-12 mx-auto text-[#ff6b4a]/40" />
                  <p className="text-lg font-semibold">Drop a pet photo here</p>
                  <p className="text-sm text-muted-foreground italic">AI will detect species, breed, and weight instantly</p>
                </div>
              )}
            </div>
            <div className="mt-8 grid grid-cols-3 gap-4 text-center">
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-2xl font-bold text-[#ff6b4a]">99%</span>
                <p className="text-[10px] uppercase text-muted-foreground mt-1">Accuracy</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-2xl font-bold text-[#ff6b4a]">2s</span>
                <p className="text-[10px] uppercase text-muted-foreground mt-1">Speed</p>
              </div>
              <div className="p-4 bg-muted/30 rounded-lg">
                <span className="text-2xl font-bold text-[#ff6b4a]">5k+</span>
                <p className="text-[10px] uppercase text-muted-foreground mt-1">Breeds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === "pet_details" && (
        <Card className="border-[#ff6b4a]/20 shadow-xl overflow-hidden">
          <div className="h-2 bg-[#ff6b4a]" />
          <CardHeader>
            <CardTitle className="text-2xl">Confirm Patient Details</CardTitle>
            <CardDescription>The AI has analyzed your photo. Please verify the following information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Species</Label>
                <Badge variant="secondary" className="block w-fit text-lg py-1 px-3 mb-2">{petInfo.species}</Badge>
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
                <Input placeholder="e.g. 3" value={petInfo.age} onChange={(e) => setPetInfo({...petInfo, age: e.target.value})} />
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
              className="w-full bg-[#ff6b4a] hover:bg-[#e05a3b] text-lg font-bold py-6 group" 
              disabled={loading}
              onClick={() => {
                if (loading) return;
                
                // Validation for mandatory fields
                if (!petInfo.age || !petInfo.gender) {
                  toast({
                    variant: "destructive",
                    title: "Missing Details",
                    description: "Please provide your pet's age and gender to get an accurate consultation."
                  });
                  return;
                }

                // Strict check for vet credits specifically
                const credits = user ? Number(user.vetChatCredits ?? 0) : 0;
                console.log(`[VET-CHAT-GATE] User: ${user?.dbId}, Credits: ${credits}, Loading: ${loading}`);
                
                if (credits <= 0) {
                  handleBuyCredits();
                } else {
                  setStep("chat");
                }
              }}
            >
              Start Consultation <ChevronRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </CardContent>
        </Card>
      )}

      {step === "chat" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Card className="h-[600px] flex flex-col border-2 border-[#0a0a0a] rounded-2xl overflow-hidden shadow-2xl">
              <CardHeader className="bg-[#0a0a0a] text-white py-4 shrink-0 rounded-t-xl rounded-b-none">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Live AI Vet Chat
                </CardTitle>
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
                          ? 'bg-[#0a0a0a] text-white rounded-tr-none' 
                          : 'bg-white shadow-sm border rounded-tl-none dark:bg-gray-800'
                      }`}>
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <span className="text-[10px] mt-2 block opacity-50">
                          {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={chatEndRef} />
              </CardContent>

              <div className="p-4 border-t bg-white dark:bg-gray-900 shrink-0 rounded-b-xl">
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
                    onClick={handleSendMessage}
                    disabled={isSending || !inputMessage.trim()}
                  >
                    {isSending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="border-[#ff6b4a]/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Session Status</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span>Questions Remaining</span>
                  <Badge variant={user?.vetChatCredits === 0 ? "destructive" : "secondary"} className="text-lg">
                    {user?.vetChatCredits ?? 2}
                  </Badge>
                </div>
                
                {(user?.vetChatCredits ?? 0) <= 1 && (
                  <Alert className="bg-amber-50/50 border-amber-200 py-3">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <AlertDescription className="text-xs">
                      Running low on questions? Top up to keep the consultation going.
                    </AlertDescription>
                  </Alert>
                )}

                <Button 
                  className="w-full bg-[#0a0a0a] hover:bg-black text-white gap-2 py-6"
                  onClick={handleBuyCredits}
                >
                  <CreditCard className="w-4 h-4" />
                  Buy 5 More Questions - $15
                </Button>

                <div className="space-y-2 pt-2 border-t">
                  <p className="text-[10px] font-bold text-muted-foreground uppercase">Included in Pack:</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[11px] font-medium">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>Professional Veterinary AI</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>Context-aware diagnosis</span>
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-medium">
                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                      <span>Save history forever</span>
                    </div>
                  </div>
                </div>
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
