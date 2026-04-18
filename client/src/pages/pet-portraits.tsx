import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/auth-context";
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
  CreditCard, ShieldCheck, Package, CheckCircle2, MapPin,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const STYLES = [
  { id: "watercolor", name: "Watercolor", emoji: "🎨", description: "Soft flowing washes" },
  { id: "oil-painting", name: "Oil Painting", emoji: "🖼️", description: "Classic renaissance style" },
  { id: "pop-art", name: "Pop Art", emoji: "🌈", description: "Bold Warhol-inspired" },
  { id: "anime", name: "Anime", emoji: "✨", description: "Kawaii anime style" },
  { id: "pencil-sketch", name: "Pencil Sketch", emoji: "✏️", description: "Classic graphite drawing" },
  { id: "pixel-art", name: "Pixel Art", emoji: "👾", description: "Retro 16-bit gaming" },
  { id: "stained-glass", name: "Stained Glass", emoji: "🏰", description: "Cathedral window art" },
  { id: "art-nouveau", name: "Art Nouveau", emoji: "🌸", description: "Elegant Mucha-inspired" },
  { id: "cyberpunk", name: "Cyberpunk", emoji: "🤖", description: "Futuristic neon glow" },
  { id: "impressionist", name: "Impressionist", emoji: "🌻", description: "Monet-inspired light" },
];

type CheckoutType = "download" | "print" | null;
type CheckoutStep = "form" | "processing" | "success";

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

function formatCardNumber(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ");
}

function formatExpiry(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return digits.slice(0, 2) + " / " + digits.slice(2);
  return digits;
}

export default function PetPortraits() {
  const { user } = useAuth();
  const { toast } = useToast();
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

  // Derive purchase status from current portrait data in DB
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
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File too large", description: "Please select an image under 10MB.", variant: "destructive" });
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
      setPortraitId(data.id); // Need to track this for Stripe
      setStep("result");
      queryClient.invalidateQueries({ queryKey: [`/api/users/${user.dbId}/portraits`] });
      toast({ title: "Portrait created!", description: "Your stylish pet portrait is ready." });
    } catch (error) {
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      });
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

          const repeatGap = img.width * 0.4;
          for (let y = -img.height; y < img.height * 2; y += repeatGap) {
            for (let x = -img.width; x < img.width * 2; x += repeatGap) {
              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(-Math.PI / 6);
              ctx.globalAlpha = 0.15;
              ctx.font = `bold ${Math.max(img.width * 0.035, 16)}px Arial, sans-serif`;
              ctx.strokeStyle = "rgba(0,0,0,0.3)";
              ctx.lineWidth = 2;
              ctx.strokeText(text, 0, 0);
              ctx.fillText(text, 0, 0);
              ctx.restore();
            }
          }

          const logoSize = Math.max(img.width * 0.15, 80);
          const logoX = img.width - logoSize - 15;
          const logoY = 15;
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
    if (!user) {
      toast({ title: "Login Required", description: "Please sign in to buy credits." });
      return;
    }
    
    setIsGenerating(true); // Reuse generating state for loading

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
    link.download = `pet-portrait-${selectedStyle}-hd.png`;
    link.click();
    toast({ title: "Downloaded!", description: "Your HD portrait without watermark has been saved." });
  };

  const handleDownloadWithWatermark = async () => {
    if (!generatedPortrait) return;
    const watermarked = await drawWatermarkedImage(generatedPortrait);
    const link = document.createElement("a");
    link.href = watermarked;
    link.download = `pet-portrait-${selectedStyle}-watermarked.png`;
    link.click();
    toast({ title: "Downloaded!", description: "Portrait saved with watermark." });
  };

  const resetAll = () => {
    setUploadedImage(null);
    setSelectedStyle(null);
    setGeneratedPortrait(null);
    setStep("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };


  // Allow unauthenticated users to see the page, but generation needs login
  // (We handle the specific block in the UI below)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-amber-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Header />
      <div className="container max-w-6xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-amber-500 bg-clip-text text-transparent mb-3">
            AI Pet Portraits
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto">
            Turn your pet's photo into a stunning piece of art. Choose from 10 unique styles.
          </p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            {["upload", "style", "result"].map((s, i) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                  step === s ? "bg-purple-500 text-white scale-110" :
                  ["upload", "style", "result"].indexOf(step) > i ? "bg-green-500 text-white" :
                  "bg-gray-200 dark:bg-gray-700 text-gray-500"
                }`}>
                  {["upload", "style", "result"].indexOf(step) > i ? <Check className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-sm font-medium hidden sm:inline ${step === s ? "text-purple-600" : "text-gray-500"}`}>
                  {s === "upload" ? "Upload Photo" : s === "style" ? "Choose Style" : "Your Portrait"}
                </span>
                {i < 2 && <div className="w-8 h-0.5 bg-gray-300 dark:bg-gray-600" />}
              </div>
            ))}
          </div>
        </div>

        {step === "upload" && (
          <div className="max-w-3xl mx-auto space-y-8">
            <Card className="border-2 border-dashed border-purple-300 hover:border-purple-500 transition-colors">
              <CardContent className="p-10">
                <div
                  className="text-center cursor-pointer"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="w-20 h-20 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
                    <Upload className="w-10 h-10 text-purple-500" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Upload a New Photo</h3>
                  <p className="text-gray-500 mb-4 text-sm">Click to select an image from your device (max 10MB)</p>
                  <Button variant="outline" size="lg" className="gap-2">
                    <ImageIcon className="w-5 h-5" />
                    Select Photo
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

            {(() => {
              const petPhotos = userPets
                .filter((pet: any) => pet.imageUrl || (pet.imageGallery && pet.imageGallery.length > 0))
                .flatMap((pet: any) => {
                  const photos: { petName: string; url: string; isMain: boolean }[] = [];
                  if (pet.imageUrl) {
                    photos.push({ petName: pet.name, url: pet.imageUrl, isMain: true });
                  }
                  if (pet.imageGallery && Array.isArray(pet.imageGallery)) {
                    pet.imageGallery.forEach((url: string) => {
                      if (url && url !== pet.imageUrl) {
                        photos.push({ petName: pet.name, url, isMain: false });
                      }
                    });
                  }
                  return photos;
                });

              if (petPhotos.length === 0) return null;

              return (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Separator className="flex-1" />
                    <span className="text-sm font-medium text-gray-400 whitespace-nowrap">or choose from your pets</span>
                    <Separator className="flex-1" />
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                    {isLoadingPets ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="aspect-square rounded-xl" />
                      ))
                    ) : petPhotos.map((photo, idx) => (
                      <div
                        key={idx}
                        className="group relative cursor-pointer rounded-xl overflow-hidden border-2 border-transparent hover:border-purple-500 transition-all hover:scale-105 hover:shadow-lg"
                        onClick={() => {
                          setUploadedImage(photo.url);
                          setStep("style");
                        }}
                      >
                        <div className="aspect-square">
                          <img
                            src={photo.url}
                            alt={photo.petName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <span className="text-white text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 px-2 py-1 rounded-full">
                            Use this
                          </span>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                          <p className="text-white text-xs font-medium truncate">{photo.petName}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {step === "style" && (
          <div className="max-w-5xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={() => setStep("upload")} className="gap-1">
                <ChevronLeft className="w-4 h-4" /> Back
              </Button>
              {uploadedImage && (
                <div className="flex items-center gap-3">
                  <img src={uploadedImage} alt="Uploaded pet" className="w-12 h-12 rounded-lg object-cover border-2 border-purple-300" />
                  <span className="text-sm text-gray-500">Your photo</span>
                </div>
              )}
            </div>

            <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Art Style</h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
              {STYLES.map((style) => (
                <Card
                  key={style.id}
                  className={`cursor-pointer transition-all hover:scale-105 ${
                    selectedStyle === style.id
                      ? "ring-2 ring-purple-500 bg-purple-50 dark:bg-purple-900/20"
                      : "hover:shadow-lg"
                  }`}
                  onClick={() => setSelectedStyle(style.id)}
                >
                  <CardContent className="p-4 text-center">
                    <div className="text-3xl mb-2">{style.emoji}</div>
                    <p className="font-semibold text-sm">{style.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{style.description}</p>
                    {selectedStyle === style.id && (
                      <Badge className="mt-2 bg-purple-500">Selected</Badge>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button
                size="lg"
                disabled={!selectedStyle || isGenerating}
                onClick={handleGenerate}
                className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating Portrait... (30-60 sec)
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Portrait
                  </>
                )}
              </Button>
            </div>
          </div>
        )}

        {step === "result" && generatedPortrait && (
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" onClick={resetAll} className="gap-1">
                <ChevronLeft className="w-4 h-4" /> Create Another
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-purple-500" />
                  Your Portrait
                  <Badge variant="outline">{STYLES.find(s => s.id === selectedStyle)?.name}</Badge>
                </h3>
                <Card className="overflow-hidden">
                  <div className="relative">
                    <img src={generatedPortrait} alt="Generated portrait" className="w-full" />
                    {!hasPurchasedDownload && (
                      <>
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="transform -rotate-[30deg]">
                            <p className="text-white/40 text-4xl font-bold tracking-wider"
                              style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                              pet-care.ai
                            </p>
                          </div>
                        </div>
                        <div className="absolute top-3 right-3 pointer-events-none">
                          <img src="/images/petcare-logo.png" alt="pet-care.ai" className="w-16 h-16 rounded-lg opacity-85 shadow-lg" />
                        </div>
                      </>
                    )}
                    {hasPurchasedDownload && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white rounded-full px-3 py-1 text-xs font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Purchased
                      </div>
                    )}
                  </div>
                </Card>
              </div>

              <div className="space-y-4">
                {hasPurchasedDownload ? (
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <CheckCircle2 className="w-5 h-5" />
                        Purchase Complete
                      </CardTitle>
                      <CardDescription>
                        Your watermark-free portrait is ready to download
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button onClick={handleCleanDownload} className="w-full gap-2 bg-green-600 hover:bg-green-700">
                        <Download className="w-4 h-4" />
                        Download HD Portrait
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-300">
                        <Download className="w-5 h-5" />
                        Download Without Watermark
                      </CardTitle>
                      <CardDescription>
                        Get your portrait in full HD without any watermark
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-3xl font-bold text-green-700 dark:text-green-300">$9</p>
                          <p className="text-sm text-gray-500">One-time purchase</p>
                        </div>
                        <Button onClick={() => handleCheckoutSubmit("download")} className="gap-2 bg-green-600 hover:bg-green-700">
                          <CreditCard className="w-4 h-4" />
                          Buy & Download
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {hasPurchasedPrint ? (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <CheckCircle2 className="w-5 h-5" />
                        Print Order Placed
                      </CardTitle>
                      <CardDescription>
                        Your {PRINT_SIZES.find(s => s.id === purchasedPrintSize)?.label || ""} canvas print is being prepared and will ship within 3-5 business days
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400">
                        <Package className="w-4 h-4" />
                        <span>Estimated delivery: 5-7 business days</span>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                        <Printer className="w-5 h-5" />
                        Order Printed Copy
                      </CardTitle>
                      <CardDescription>
                        Premium canvas print shipped to your door. Larger sizes cost more.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">Select Size & Quality</p>
                      <div className="grid grid-cols-2 gap-2">
                        {PRINT_SIZES.map((size) => (
                          <div
                            key={size.id}
                            onClick={() => setSelectedPrintSize(size.id)}
                            className={`relative cursor-pointer rounded-lg border-2 p-2.5 transition-all text-left ${
                              selectedPrintSize === size.id
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                : "border-gray-200 dark:border-gray-700 hover:border-blue-300"
                            }`}
                          >
                            {size.recommended && (
                              <span className="absolute -top-2 right-2 bg-blue-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">BEST VALUE</span>
                            )}
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-sm">{size.label}</span>
                              <span className="font-bold text-sm text-blue-600 dark:text-blue-400">${size.price}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <div className={`w-2 h-2 rounded-full ${
                                size.quality === "excellent" ? "bg-green-500" :
                                size.quality === "good" ? "bg-yellow-500" : "bg-orange-400"
                              }`} />
                              <span className="text-[10px] text-gray-500">{size.qualityNote}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 p-2 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                        <ImageIcon className="w-4 h-4 text-blue-500 shrink-0" />
                        <p className="text-[11px] text-blue-700 dark:text-blue-300">
                          AI portraits are generated at 1024x1024px. Smaller prints look sharpest; larger prints use professional upscaling.
                        </p>
                      </div>
                      <Button onClick={() => handleCheckoutSubmit("print", selectedPrintSize)} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
                        <CreditCard className="w-4 h-4" />
                        Order {PRINT_SIZES.find(s => s.id === selectedPrintSize)?.label} Print &mdash; ${PRINT_SIZES.find(s => s.id === selectedPrintSize)?.price}
                      </Button>
                    </CardContent>
                  </Card>
                )}

                <Card>
                  <CardContent className="p-4">
                    <Button onClick={handleDownloadWithWatermark} variant="outline" className="w-full gap-2">
                      <Download className="w-4 h-4" />
                      Download Free (With Watermark)
                    </Button>
                  </CardContent>
                </Card>

                <Button onClick={resetAll} variant="ghost" className="w-full gap-2">
                  <Palette className="w-4 h-4" />
                  Create Another Portrait
                </Button>
              </div>
            </div>
          </div>
        )}

        {((savedPortraits.length > 0 || isLoadingPortraits) && step !== "result") && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Your Portrait Gallery</h2>
            <p className="text-sm text-gray-500 mb-4">Click any portrait to view purchase options</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {isLoadingPortraits ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-xl" />
                ))
              ) : savedPortraits.map((portrait: any) => (
                <Card
                  key={portrait.id}
                  className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02] hover:ring-2 hover:ring-purple-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                    setGeneratedPortrait(portrait.portraitImageUrl);
                    setSelectedStyle(portrait.style);
                    setPortraitId(portrait.id); // Important for checking paid status
                    setSelectedPrintSize("5x5");
                    setStep("result");
                  }}
                >
                  <div className="relative aspect-square">
                    <img
                      src={portrait.portraitImageUrl}
                      alt={`${portrait.style} portrait`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <p className="text-white/30 text-lg font-bold transform -rotate-[30deg]"
                        style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
                        pet-care.ai
                      </p>
                    </div>
                    <div className="absolute top-2 right-2 pointer-events-none">
                      <img src="/images/petcare-logo.png" alt="pet-care.ai" className="w-8 h-8 rounded opacity-80" />
                    </div>
                    <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-end justify-center pb-3 opacity-0 hover:opacity-100">
                      <span className="bg-white/90 dark:bg-gray-800/90 text-xs font-medium px-3 py-1.5 rounded-full shadow">
                        View & Purchase
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-3">
                    <Badge variant="outline" className="text-xs">
                      {STYLES.find(s => s.id === portrait.style)?.name || portrait.style}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
