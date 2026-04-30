import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Pet } from "@shared/schema";
import { ArrowLeft, Camera, Scan } from "lucide-react";
import { Header } from "@/components/Header";


import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024; // 5MB
const COMPRESSION_QUALITY = 0.7; // 70% quality

async function compressImage(file: File): Promise<string> {
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
        const maxDimension = 2048;

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
        const compressedDataUrl = canvas.toDataURL('image/jpeg', COMPRESSION_QUALITY);
        resolve(compressedDataUrl);
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

export default function PetDetails() {
  const { id } = useParams();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: [`/api/pets/${id}`],
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please select an image under 5MB"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const compressedImage = await compressImage(file);
      setImagePreview(compressedImage);
      await apiRequest("PATCH", `/api/pets/${id}`, { imageUrl: compressedImage });
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}`] });
      toast({ title: "Pet image updated successfully" });
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: "destructive",
        title: "Failed to process image",
        description: "Please try again with a different image"
      });
      setImagePreview(null);
    }
    setIsProcessing(false);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    maxSize: MAX_IMAGE_SIZE,
  });

  if (isLoading || !pet) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Link href={`/pet/${id}`}>
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Button>
        </Link>

        <Card className="border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-orange-400 to-[#ff6b4a]" />
          <CardHeader className="p-6 md:p-8">
            <CardTitle className="text-3xl font-black tracking-tight">{pet.name}'s Identity Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-10">
            <div
              {...getRootProps()}
              className={`relative group cursor-pointer overflow-hidden rounded-3xl border-2 border-dashed transition-all duration-300 ${
                isDragActive ? "border-[#ff6b4a] bg-[#ff6b4a]/5" : "border-black/5 hover:border-[#ff6b4a]/40 bg-black/[0.01]"
              }`}
            >
              <input {...getInputProps()} />
              {(imagePreview || pet.imageUrl) ? (
                <div className="relative aspect-video md:aspect-[21/9]">
                  <img
                    src={imagePreview || pet.imageUrl || ''}
                    alt={pet.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 transform scale-90 group-hover:scale-100 transition-transform">
                        <Camera className="h-8 w-8 text-white" />
                    </div>
                    <p className="text-white font-black text-xs mt-4 tracking-widest uppercase">Update Identity Card</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center p-12 md:p-20 text-center">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-100 to-[#ff6b4a]/10 flex items-center justify-center mb-6">
                    <Camera className="h-10 w-10 text-[#ff6b4a]" />
                  </div>
                  <h4 className="text-xl font-black mb-1">Mirror the Beauty</h4>
                  <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">
                    Tap to establish a visual profile
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                   <h3 className="text-lg font-black tracking-tight text-foreground uppercase tracking-widest text-[#ff6b4a] flex items-center gap-2">
                       <Scan className="w-4 h-4" /> Visual Identity
                   </h3>
                   <div className="grid grid-cols-2 gap-3">
                      {[
                        { label: "Species", value: pet.species, icon: "🐾" },
                        { label: "Breed", value: pet.breed, icon: "🐕" },
                        { label: "Weight", value: pet.weight, icon: "⚖️" },
                        { label: "Size", value: pet.size, icon: "📏" },
                        { label: "Lifespan", value: pet.lifespan, icon: "🧬" }
                      ].map((item, i) => (
                        item.value ? (
                          <div key={i} className="p-4 rounded-2xl bg-black/[0.02] border border-black/[0.02] flex flex-col gap-1">
                             <span className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">{item.label}</span>
                             <span className="text-sm font-black flex items-center gap-2">{item.icon} {item.value}</span>
                          </div>
                        ) : null
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
    <p className="text-muted-foreground text-center py-8">Vet consultation history is being migrated. Use the AI Vet Chat for new questions.</p>
                </div>
            </div>

            {pet.imageGallery && pet.imageGallery.length > 0 && (
              <div className="pt-10 border-t border-black/[0.04]">
                <h3 className="text-xl font-black mb-6 tracking-tight">Memories Vault</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {pet.imageGallery.map((imageUrl, index) => (
                    <div key={index} className="group relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500">
                      <img
                        src={imageUrl}
                        alt={`${pet.name}'s photo ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        <div className="mt-12">
<p className="text-muted-foreground text-center py-8">Injury scanner is currently being updated. Use the standalone scanner for now.</p>
        </div>
      </div>
    </>
  );
}