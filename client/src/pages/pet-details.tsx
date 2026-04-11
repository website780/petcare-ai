import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Pet } from "@shared/schema";
import { ArrowLeft, Camera, Scan } from "lucide-react";
import { Header } from "@/components/Header";
import { PetMood } from "@/components/PetMood";
import { PetInjuryScanner } from "@/components/PetInjuryScanner";
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
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link href={`/pet/${id}`}>
            <Button variant="ghost" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-2xl md:text-3xl">{pet.name}'s Details</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-6">
            <div
              {...getRootProps()}
              className={`relative group cursor-pointer mb-6 touch-manipulation ${
                isDragActive ? "ring-2 ring-primary" : ""
              }`}
            >
              <input {...getInputProps()} />
              {(imagePreview || pet.imageUrl) ? (
                <>
                  <img
                    src={imagePreview || pet.imageUrl || ''}
                    alt={pet.name}
                    className="w-full max-h-72 md:max-h-96 object-cover rounded-lg"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center p-8 md:p-12 border-2 border-dashed rounded-lg">
                  <Camera className="h-10 w-10 md:h-12 md:w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center text-sm md:text-base">
                    Tap to upload a photo
                  </p>
                </div>
              )}
            </div>

            {pet.imageGallery && pet.imageGallery.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold mb-4">Photo Gallery</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {pet.imageGallery.map((imageUrl, index) => (
                    <div key={index} className="relative aspect-square rounded-lg overflow-hidden">
                      <img
                        src={imageUrl}
                        alt={`${pet.name}'s photo ${index + 1}`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-4">
              <PetMood pet={pet} />
              <p className="text-muted-foreground">
                <span className="font-medium">Species:</span> {pet.species}
              </p>
              {pet.breed && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Breed:</span> {pet.breed}
                </p>
              )}
              {pet.weight && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Weight:</span> {pet.weight}
                </p>
              )}
              {pet.size && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Size:</span> {pet.size}
                </p>
              )}
              {pet.lifespan && (
                <p className="text-muted-foreground">
                  <span className="font-medium">Expected Lifespan:</span> {pet.lifespan}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="mt-6">
          <PetInjuryScanner pet={pet} />
        </div>
      </div>
    </>
  );
}