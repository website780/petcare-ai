import { useState, useRef, useCallback, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useLocation } from "wouter";
import { Header } from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import {
  Upload, Paintbrush, Download, Printer, Loader2, Image as ImageIcon,
  Palette, Sparkles, X, Check, ChevronLeft, ChevronRight, Lock,
  CreditCard, ShieldCheck, Package, CheckCircle2, MapPin, ArrowLeft, Camera, Layers, Wand2
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { motion, AnimatePresence } from "framer-motion";

const STYLES = [
  { id: "watercolor", name: "Watercolor", emoji: "🎨", description: "Soft flowing washes", color: "from-blue-400 to-indigo-400" },
  { id: "oil-painting", name: "Oil Painting", emoji: "🖼️", description: "Classic renaissance", color: "from-amber-400 to-orange-500" },
  { id: "pop-art", name: "Pop Art", emoji: "🌈", description: "Bold Warhol-inspired", color: "from-pink-500 to-rose-500" },
  { id: "anime", name: "Anime", emoji: "✨", description: "High-fidelity Seinen", color: "from-purple-500 to-indigo-500" },
  { id: "pencil-sketch", name: "Pencil Sketch", emoji: "✏️", description: "Detailed graphite", color: "from-slate-400 to-slate-600" },
  { id: "pixel-art", name: "Pixel Art", emoji: "👾", description: "Retro 16-bit gaming", color: "from-green-400 to-emerald-500" },
  { id: "stained-glass", name: "Stained Glass", emoji: "🏰", description: "Cathedral window", color: "from-violet-500 to-fuchsia-500" },
  { id: "art-nouveau", name: "Art Nouveau", emoji: "🌸", description: "Elegant Mucha", color: "from-emerald-400 to-teal-500" },
  { id: "cyberpunk", name: "Cyberpunk", emoji: "🤖", description: "Futuristic neon", color: "from-cyan-400 to-blue-500" },
  { id: "impressionist", name: "Impressionist", emoji: "🌻", description: "Monet-inspired", color: "from-yellow-400 to-orange-400" },
];

interface PrintSize {
  id: string;
  label: string;
  dimensions: string;
  price: number;
  quality: "excellent" | "good" | "fair";
  qualityNote: string;
  recommended?: boolean;
}

const PRINT_SIZES: PrintSize[] = [
  { id: "5x5", label: '5" x 5"', dimensions: "5x5", price: 15, quality: "excellent", qualityNote: "Pixel-perfect sharpness", recommended: true },
  { id: "8x8", label: '8" x 8"', dimensions: "8x8", price: 25, quality: "excellent", qualityNote: "Crisp, high detail" },
  { id: "12x12", label: '12" x 12"', dimensions: "12x12", price: 35, quality: "good", qualityNote: "Great for wall display" },
  { id: "16x16", label: '16" x 16"', dimensions: "16x16", price: 49, quality: "good", qualityNote: "Statement piece" },
  { id: "24x24", label: '24" x 24"', dimensions: "24x24", price: 69, quality: "fair", qualityNote: "Large canvas, slight softening" },
  { id: "36x36", label: '36" x 36"', dimensions: "36x36", price: 99, quality: "fair", qualityNote: "Gallery-size, best viewed at distance" },
];

export default function PetPortraits() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [generatedPortrait, setGeneratedPortrait] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [step, setStep] = useState<"upload" | "style" | "result">("upload");

  const [selectedPrintSize, setSelectedPrintSize] = useState<string>("5x5");
  const [portraitId, setPortraitId] = useState<number | null>(null);

  const { data: savedPortraits = [], isLoading: isLoadingPortraits } = useQuery<any[]>({
    queryKey: [`/api/users/${user?.dbId}/portraits`],
    enabled: !!user?.dbId,
  });

  const currentPortraitInDb = savedPortraits.find(p => p.id === portraitId || p.portraitImageUrl === generatedPortrait);
  const hasPurchasedDownload = currentPortraitInDb?.paid === "true";
  const hasPurchasedPrint = currentPortraitInDb?.paid === "true" && currentPortraitInDb?.paymentType === "print";
  const purchasedPrintSize = currentPortraitInDb?.metadata?.printSize || "";

  const { data: userPets = [], isLoading: isLoadingPets } = useQuery<any[]>({
    queryKey: [`/api/pets?userId=${user?.dbId}`],
    enabled: !!user?.dbId,
  });

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please select an image file.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new window.Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = 1024;
        let width = img.width;
        let height = img.height;
        if (width > maxSize || height > maxSize) {
          if (width > height) {
            height = (height / width) * maxSize;
            width = maxSize;
          } else {
            width = (width / height) * maxSize;
            height = maxSize;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);
        const compressed = canvas.toDataURL("image/jpeg", 0.8);
        setUploadedImage(compressed);
        setStep("style");
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleGenerate = async () => {
    if (!uploadedImage || !selectedStyle) return;
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to generate your pet portrait." });
      return;
    }
    setIsGenerating(true);
    try {
      const response = await apiRequest("POST", "/api/portraits/generate", {
        imageBase64: uploadedImage,
        style: selectedStyle,
        userId: user.dbId,
      });
      const data = await response.json();
      setGeneratedPortrait(data.portraitImageUrl);
      setPortraitId(data.id);
      setStep("result");
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.dbId}/portraits`] });
      toast({ title: "Artistic Masterpiece Ready!", description: "Check out your new pet portrait.", className: "bg-purple-600 text-white" });
    } catch (error) {
      toast({ title: "Generation failed", description: "Something went wrong.", variant: "destructive" });
    } finally {
      setIsGenerating(false);
    }
  };

  const drawWatermarkedImage = useCallback((imgSrc: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new window.Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const logo = new window.Image();
        logo.crossOrigin = "anonymous";
        logo.onload = () => {
          const canvas = document.createElement("canvas");
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);

          ctx.save();
          ctx.globalAlpha = 0.35;
          ctx.fillStyle = "#ffffff";
          ctx.font = `bold ${Math.max(img.width * 0.06, 24)}px Arial, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          const text = "pet-care.ai";
          const centerX = img.width / 2;
          const centerY = img.height / 2;

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.rotate(-Math.PI / 6);
          ctx.strokeStyle = "rgba(0,0,0,0.5)";
          ctx.lineWidth = 3;
          ctx.strokeText(text, 0, 0);
          ctx.fillText(text, 0, 0);
          ctx.restore();

          const logoSize = Math.max(img.width * 0.15, 80);
          const logoX = img.width - logoSize - 30; // 30px padding from right
          const logoY = 30; // 30px padding from top
          ctx.globalAlpha = 0.85;
          ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);

          ctx.restore();
          resolve(canvas.toDataURL("image/png"));
        };
        logo.src = "/images/petcare-logo.png";
      };
      img.src = imgSrc;
    });
  }, []);

  const handleCheckoutSubmit = async (type: "download" | "print", printSize?: string) => {
    if (!user) return;
    setIsGenerating(true);
    try {
      const res = await apiRequest("POST", "/api/stripe/create-checkout", {
        type: type === "download" ? "portrait_hd" : "portrait_print",
        userId: user.dbId,
        metadata: {
          portraitId: portraitId,
          printSize: type === "print" ? printSize : undefined
        }
      });
      const { url } = await res.json();
      window.location.href = url;
    } catch (err) {
      toast({ variant: "destructive", title: "Error", description: "Payment initiation failed." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCleanDownload = () => {
    if (!generatedPortrait) return;
    const link = document.createElement("a");
    link.href = generatedPortrait;
    link.download = `pet-portrait-${selectedStyle}.png`;
    link.click();
  };

  const handleDownloadWithWatermark = async () => {
    if (!generatedPortrait) return;
    const watermarked = await drawWatermarkedImage(generatedPortrait);
    const link = document.createElement("a");
    link.href = watermarked;
    link.download = `pet-portrait-${selectedStyle}-preview.png`;
    link.click();
  };

  const resetAll = () => {
    setUploadedImage(null);
    setSelectedStyle(null);
    setGeneratedPortrait(null);
    setStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] relative overflow-hidden font-sans">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-pink-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <Header />

      <main className="container max-w-6xl mx-auto px-6 py-12 relative z-10">
        {/* Navigation & Title */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center text-center mb-16"
        >
          <Button 
            variant="ghost" 
            onClick={() => setLocation("/")}
            className="mb-8 hover:bg-white/40 dark:hover:bg-white/5 backdrop-blur-md transition-all group rounded-2xl px-6 py-2 border border-white/20 shadow-sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" /> 
            Back to Dashboard
          </Button>

          <div className="relative inline-block mb-4">
            <span className="absolute -top-6 -right-6 bg-purple-100 text-purple-600 text-[10px] font-black px-2 py-1 rounded-lg border border-purple-200 rotate-12 shadow-sm animate-pulse">NEW ENGINE</span>
            <h1 className="text-5xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.1]">
              AI Pet <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent">Portraits</span>
            </h1>
          </div>
          
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
            World-class forensic identity preservation meets fine art. Turn regular photos into museum-quality masterpieces.
          </p>
        </motion.div>

        {/* Step Progress */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-2 p-2 bg-white/40 dark:bg-white/5 backdrop-blur-xl border border-white/40 rounded-[2rem] shadow-xl">
            {["upload", "style", "result"].map((s, i) => (
              <div key={s} className="flex items-center">
                <motion.div 
                  className={`flex items-center gap-3 px-5 py-2.5 rounded-full transition-all duration-500 ${
                    step === s ? "bg-[#0F172A] text-white shadow-lg" : "text-slate-400"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black border ${
                    step === s ? "bg-white text-[#0F172A] border-white" : "border-slate-300"
                  }`}>
                    {i + 1}
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest hidden md:inline">
                    {s === "upload" ? "Upload" : s === "style" ? "Art Style" : "Masterpiece"}
                  </span>
                </motion.div>
                {i < 2 && <div className="mx-2 w-4 h-px bg-slate-200" />}
              </div>
            ))}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {step === "upload" && (
            <motion.div 
              key="upload-step"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="max-w-4xl mx-auto space-y-12"
            >
              <Card 
                className="group relative cursor-pointer overflow-hidden border-none bg-white/60 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[3rem] transition-all hover:shadow-[0_48px_80px_-16px_rgba(147,51,234,0.15)]"
                onClick={() => fileInputRef.current?.click()}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <CardContent className="p-16 md:p-24 flex flex-col items-center">
                  <div className="relative mb-10 group-hover:scale-110 transition-transform duration-700">
                    <div className="absolute inset-0 bg-purple-500/20 blur-3xl scale-150 group-hover:scale-[2] transition-transform duration-700" />
                    <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center relative z-10 shadow-2xl">
                      <Camera className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  
                  <h3 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">Upload Source Photo</h3>
                  <p className="text-slate-500 mb-10 text-center max-w-sm font-medium">Use a high-quality photo of your pet facing the camera for maximum identity accuracy.</p>
                  
                  <Button size="lg" className="h-16 px-10 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl gap-3 text-lg font-bold shadow-xl">
                    <Upload className="w-5 h-5" />
                    Pick a Photo
                  </Button>
                  
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
                </CardContent>
              </Card>

              {(() => {
                const petPhotos = userPets.filter(p => p.imageUrl).map(p => ({ petName: p.name, url: p.imageUrl }));
                if (petPhotos.length === 0) return null;
                return (
                  <div className="space-y-8">
                    <div className="flex items-center gap-6">
                      <div className="h-px flex-1 bg-slate-200" />
                      <span className="text-[10px] font-black text-slate-400 tracking-[0.2em] uppercase">Existing Pet Gallery</span>
                      <div className="h-px flex-1 bg-slate-200" />
                    </div>
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                      {petPhotos.map((photo, idx) => (
                        <motion.div
                          key={idx}
                          whileHover={{ y: -8, scale: 1.05 }}
                          className="group relative cursor-pointer rounded-3xl overflow-hidden shadow-lg aspect-square border-4 border-white transition-all hover:border-purple-500"
                          onClick={() => { setUploadedImage(photo.url); setStep("style"); }}
                        >
                          <img src={photo.url} alt={photo.petName} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-2 text-center">
                            <span className="text-white text-[10px] font-black uppercase tracking-tighter">{photo.petName}</span>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </motion.div>
          )}

          {step === "style" && (
            <motion.div 
              key="style-step"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex flex-col md:flex-row gap-12 items-start">
                <div className="w-full md:w-80 md:sticky md:top-24 space-y-6">
                  <div className="relative group rounded-[2.5rem] overflow-hidden shadow-2xl bg-white p-2">
                     <img src={uploadedImage!} alt="Original" className="w-full aspect-square object-cover rounded-[2rem]" />
                     <div className="absolute top-6 left-6 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black tracking-widest text-[#0F172A] shadow-sm">SOURCE PHOTO</div>
                  </div>
                  <Button variant="outline" className="w-full rounded-2xl h-12 border-slate-200 font-bold" onClick={() => setStep("upload")}>
                    Change Photo
                  </Button>
                </div>

                <div className="flex-1 space-y-10">
                  <div className="text-left">
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Select Art <span className="text-purple-600">Style</span></h2>
                    <p className="text-slate-500 font-medium">Choose how you want to reimagine your pet.</p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
                    {STYLES.map((style) => (
                      <motion.div
                        key={style.id}
                        whileHover={{ y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setSelectedStyle(style.id)}
                        className={`group relative cursor-pointer p-6 rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${
                          selectedStyle === style.id 
                            ? "border-purple-600 bg-white shadow-2xl" 
                            : "border-white/40 bg-white/30 backdrop-blur-sm hover:border-purple-200 hover:bg-white"
                        }`}
                      >
                        <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${style.color} opacity-10 rounded-full blur-2xl transition-transform duration-700 group-hover:scale-150`} />
                        
                        <div className="relative z-10">
                          <div className="text-4xl mb-6 transform group-hover:scale-125 transition-transform duration-500">{style.emoji}</div>
                          <h4 className="text-xl font-black text-slate-900 mb-2 truncate">{style.name}</h4>
                          <p className="text-xs text-slate-500 font-medium leading-relaxed">{style.description}</p>
                          
                          {selectedStyle === style.id && (
                            <motion.div layoutId="selection-check" className="absolute top-2 right-2 flex items-center justify-center w-8 h-8 rounded-full bg-purple-600 text-white shadow-lg">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </motion.div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  <div className="pt-10 flex justify-center sticky bottom-8 md:static">
                    <Button
                      size="lg"
                      disabled={!selectedStyle || isGenerating}
                      onClick={handleGenerate}
                      className="h-20 px-16 group relative overflow-hidden rounded-[2.5rem] bg-[#0F172A] text-white shadow-[0_32px_64px_-12px_rgba(15,23,42,0.4)] hover:shadow-[0_48px_80px_-12px_rgba(15,23,42,0.5)] transition-all active:scale-95"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      <div className="relative z-10 flex items-center gap-4 text-xl font-black">
                        {isGenerating ? (
                          <>
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>ARTIST IS WORKING...</span>
                          </>
                        ) : (
                          <>
                            <Wand2 className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                            <span>CREATE MASTERPIECE</span>
                          </>
                        )}
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === "result" && generatedPortrait && (
            <motion.div 
              key="result-step"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-6xl mx-auto"
            >
              <div className="flex flex-col lg:flex-row gap-12 items-stretch">
                <div className="flex-1 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Artistic <span className="text-purple-600">Reveal</span></h3>
                    <Badge variant="outline" className="px-4 py-1.5 rounded-full border-slate-200 bg-white font-black text-[10px] text-slate-500 tracking-widest uppercase">
                      {STYLES.find(s => s.id === selectedStyle)?.name} STYLE
                    </Badge>
                  </div>

                  <Card className="p-3 bg-white/60 backdrop-blur-3xl shadow-2xl rounded-[3rem] overflow-hidden relative group border-none">
                    <div className="relative aspect-square overflow-hidden rounded-[2.5rem]">
                      <img src={generatedPortrait} alt="Masterpiece" className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" />
                      
                      {!hasPurchasedDownload && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="absolute inset-0 bg-black/5 backdrop-blur-[1px]" />
                          <div className="transform -rotate-[30deg] relative z-10">
                            <p className="text-white font-black text-6xl tracking-[0.2em] opacity-30 select-none" style={{ textShadow: "0 0 40px rgba(0,0,0,0.5)" }}>PETCARE.AI</p>
                          </div>
                          <div className="absolute top-6 right-6">
                            <img src="/images/petcare-logo.png" className="w-20 h-20 opacity-80 drop-shadow-2xl" />
                          </div>
                        </div>
                      )}

                      {hasPurchasedDownload && (
                        <div className="absolute top-8 left-8 bg-emerald-500 text-white rounded-full px-6 py-2 text-xs font-black flex items-center gap-2 shadow-xl animate-bounce-slow">
                          <CheckCircle2 className="w-4 h-4" /> HD UNLOCKED
                        </div>
                      )}
                    </div>
                  </Card>
                </div>

                <div className="w-full lg:w-[400px] space-y-6">
                  <div className="p-8 bg-[#0F172A] rounded-[3rem] text-white shadow-2xl relative overflow-hidden flex flex-col justify-between h-full">
                    <div className="absolute top-[-20%] right-[-20%] w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full" />
                    
                    <div className="relative z-10 space-y-8">
                      {hasPurchasedDownload ? (
                        <div className="space-y-6">
                          <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
                            <ShieldCheck className="w-8 h-8 text-emerald-400" />
                          </div>
                          <h4 className="text-3xl font-black tracking-tight">Identity Verified & Unlocked</h4>
                          <p className="text-slate-400 font-medium text-sm leading-relaxed">Your high-definition portrait without the watermark is ready for download.</p>
                          <Button 
                            onClick={handleCleanDownload} 
                            className="w-full h-16 rounded-2xl bg-white text-[#0F172A] hover:bg-slate-100 font-black gap-3 text-lg transition-transform active:scale-95"
                          >
                            <Download className="w-5 h-5" /> DOWNLOAD HD
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          <div className="space-y-4">
                            <h4 className="text-3xl font-black tracking-tight">Unlock HD Version</h4>
                            <p className="text-slate-400 font-medium text-sm leading-relaxed">Remove the watermark and get the full resolution masterpiece for personal use.</p>
                          </div>
                          
                          <div className="p-6 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-between">
                            <div>
                              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">Total Price</span>
                              <span className="text-4xl font-black">$9.00</span>
                            </div>
                            <Button onClick={() => handleCheckoutSubmit("download")} className="bg-purple-600 hover:bg-purple-500 text-white rounded-2xl px-6 font-black h-12 shadow-lg shadow-purple-600/30">
                              BUY NOW
                            </Button>
                          </div>
                        </div>
                      )}

                      <Separator className="bg-white/10" />

                      <div className="space-y-6">
                        <div className="flex items-center gap-3">
                          <Printer className="w-5 h-5 text-amber-500" />
                          <h5 className="font-black text-sm uppercase tracking-widest">Physical Printing</h5>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3">
                          {PRINT_SIZES.slice(0, 4).map(size => (
                            <div 
                              key={size.id}
                              onClick={() => setSelectedPrintSize(size.id)}
                              className={`p-4 rounded-2xl border-2 transition-all cursor-pointer text-left ${
                                selectedPrintSize === size.id ? "border-amber-500 bg-amber-500/10" : "border-white/5 hover:border-white/10"
                              }`}
                            >
                              <span className="text-xs font-black block mb-1">{size.label}</span>
                              <span className="text-sm font-medium text-slate-400">${size.price}</span>
                            </div>
                          ))}
                        </div>

                        <Button 
                          onClick={() => handleCheckoutSubmit("print", selectedPrintSize)} 
                          className="w-full h-16 rounded-2xl bg-white/10 border border-white/20 text-white hover:bg-white/20 font-black gap-3 text-sm transition-all shadow-lg backdrop-blur-md"
                        >
                           ORDER PHYSICAL PRINT
                        </Button>
                      </div>
                    </div>

                    <div className="relative z-10 pt-8 flex items-center justify-center gap-4">
                      <Button 
                        variant="ghost" 
                        className="text-slate-400 hover:text-white hover:bg-white/10" 
                        onClick={resetAll}
                      >
                        RESTART
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="text-slate-400 hover:text-white hover:bg-white/10" 
                        onClick={handleDownloadWithWatermark}
                      >
                        FREE PREVIEW
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {((savedPortraits.length > 0 || isLoadingPortraits) && step !== "result") && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-24 space-y-10"
          >
            <div className="flex items-center gap-6">
              <h2 className="text-3xl font-black tracking-tight text-slate-900 uppercase whitespace-nowrap">Your <span className="text-pink-500">Exhibition</span></h2>
              <div className="h-px flex-1 bg-slate-200" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
              {isLoadingPortraits ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-[2rem]" />
                ))
              ) : savedPortraits.map((portrait: any) => (
                <motion.div
                  key={portrait.id}
                  whileHover={{ y: -10 }}
                  className="group relative cursor-pointer aspect-square rounded-[2.5rem] overflow-hidden bg-white shadow-xl hover:shadow-2xl transition-all border-4 border-white"
                  onClick={() => {
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setGeneratedPortrait(portrait.portraitImageUrl);
                    setSelectedStyle(portrait.style);
                    setPortraitId(portrait.id);
                    setStep("result");
                  }}
                >
                  <img src={portrait.portraitImageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-4">
                      <Layers className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-black uppercase tracking-widest">{portrait.style}</span>
                    <span className="mt-2 text-white/60 text-[10px] font-bold">VIEW MASTERPIECE</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
