import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PetMood } from "@/components/PetMood";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Apple, Stethoscope, Scissors, Pencil, Camera, Calendar, Dumbbell, Scan, Syringe } from "lucide-react";
import { type Pet } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/use-auth"; // Added import for useAuth
import { ShareMissingPet } from "@/components/ShareMissingPet"; // Added import for ShareMissingPet

const MAX_IMAGE_SIZE = 20 * 1024 * 1024; // 20MB for initial uploads
const COMPRESSION_QUALITY = 0.9; // 90% quality

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

export default function PetProfile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { user, loading } = useAuth(); // Added useAuth hook

  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: [`/api/pets/${id}`],
  });

  const updatePetImage = useMutation({
    mutationFn: async (imageUrl: string) => {
      // Only update if we have a valid image URL
      if (!imageUrl) return;

      const response = await apiRequest("PATCH", `/api/pets/${id}`, {
        imageUrl,
        // Only include the new image in gallery if it's not the same as current imageUrl
        imageGallery: pet?.imageUrl !== imageUrl ? [imageUrl] : []
      });
      if (!response.ok) {
        throw new Error('Failed to update pet image');
      }
      return response.json();
    },
    onSuccess: (data) => {
      // Update local query cache immediately
      queryClient.setQueryData([`/api/pets/${id}`], data);
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}`] });
      toast({ title: "Pet image updated successfully" });
      setIsProcessing(false);
      setImagePreview(null);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update pet image",
      });
      setIsProcessing(false);
      setImagePreview(null);
    },
  });

  const updatePetDetails = useMutation({
    mutationFn: async (data: Partial<Pet>) => {
      const response = await apiRequest("PATCH", `/api/pets/${id}`, data);
      if (!response.ok) {
        throw new Error('Failed to update pet details');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}`] });
      toast({ title: "Pet details updated successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update pet details",
      });
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > MAX_IMAGE_SIZE) {
      toast({
        variant: "destructive",
        title: "Image too large",
        description: "Please select an image under 20MB"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const compressedImage = await compressImage(file);
      setImagePreview(compressedImage);
      // Wait for the mutation to complete before clearing the preview
      await updatePetImage.mutateAsync(compressedImage);
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        variant: "destructive",
        title: "Failed to process image",
        description: "Please try again with a different image"
      });
      setImagePreview(null);
      setIsProcessing(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
    maxSize: MAX_IMAGE_SIZE,
  });

  if (isLoading) {
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

  if (!pet) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Pet not found</h2>
              <Link href="/">
                <Button>
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </>
    );
  }

  const sections = [
    {
      title: "Pet Details & Injury Scanner",
      icon: Scan,
      href: `/pet/${id}/details`,
      description: "View pet details and scan injuries for treatment recommendations"
    },
    {
      title: "Nutrition Guide",
      icon: Apple,
      href: `/pet/${id}/nutrition`,
      description: "Manage your pet's diet and feeding schedule"
    },
    {
      title: "Training & Exercise",
      icon: Dumbbell,
      href: `/pet/${id}/training`,
      description: "View training guides and schedule exercise sessions"
    },
    {
      title: "Vaccination Records",
      icon: Syringe,
      href: `/pet/${id}/vaccinations`,
      description: "Track vaccinations, schedules, and immunization history"
    },
    {
      title: "Vet Assessment",
      icon: Stethoscope,
      href: `/pet/${id}/vet`,
      description: "Track veterinary care and health records"
    },
    {
      title: "Grooming Guide",
      icon: Scissors,
      href: `/pet/${id}/grooming`,
      description: "Schedule and manage grooming appointments"
    },
    {
      title: "Reminders & Schedule",
      icon: Calendar,
      href: `/pet/${id}/schedule`,
      description: "View all upcoming activities and reminders"
    }
  ];

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
        <Link href="/">
          <Button variant="ghost" className="mb-4 w-full sm:w-auto">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-2xl md:text-3xl">{pet.name}</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10">
                      <Pencil className="h-5 w-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="p-4 md:p-6">
                    <DialogHeader>
                      <DialogTitle>Edit Pet Name</DialogTitle>
                    </DialogHeader>
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.currentTarget);
                        const name = formData.get('name') as string;
                        if (name) {
                          updatePetDetails.mutate({ name });
                        }
                      }}
                      className="space-y-4"
                    >
                      <div className="space-y-2">
                        <label htmlFor="name" className="text-sm font-medium">
                          Name
                        </label>
                        <Input
                          id="name"
                          name="name"
                          defaultValue={pet.name}
                          required
                          className="text-lg h-12 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2"
                        />
                      </div>
                      <Button type="submit" className="w-full py-6 bg-[#ff6b4a] hover:bg-[#e05a3b]">
                        Save Changes
                      </Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-6">
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
                  <PhotoGallery pet={pet} />
                </div>
              )}

              <div>
                <h3 className="text-lg font-semibold mb-4">Pet Mood</h3>
                <PetMood pet={pet} />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4">Details</h3>
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Species:</span> {pet.species}
                  </p>
                  {pet.breed && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Breed:</span> {pet.breed}
                    </p>
                  )}
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Gender:</span> {pet.gender || 'Not specified'}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-4 md:p-6">
                        <DialogHeader>
                          <DialogTitle>Edit Gender</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const gender = formData.get('gender') as string;
                            if (gender) {
                              updatePetDetails.mutate({ gender });
                            }
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                             <Select 
                              defaultValue={pet.gender || ''} 
                              onValueChange={(val) => updatePetDetails.mutate({ gender: val })}
                            >
                              <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2">
                                <SelectValue placeholder="Select gender" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="male">Male</SelectItem>
                                <SelectItem value="female">Female</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="button" onClick={() => (document.querySelector('dialog') as any)?.close()} className="w-full py-6 bg-[#ff6b4a] hover:bg-[#e05a3b]">
                            Save Changes
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Weight:</span> {pet.weight || 'Not specified'}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-4 md:p-6">
                        <DialogHeader>
                          <DialogTitle>Edit Weight</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const weight = formData.get('weight') as string;
                            if (weight) {
                              updatePetDetails.mutate({ weight });
                            }
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                            <label htmlFor="weight" className="text-sm font-medium">
                              Weight (with units)
                            </label>
                            <Input
                              id="weight"
                              name="weight"
                              defaultValue={pet.weight || ''}
                              placeholder="e.g., 25 lbs"
                              className="text-lg p-3"
                            />
                          </div>
                          <Button type="submit" className="w-full py-6">
                            Save Changes
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-muted-foreground">
                      <span className="font-medium">Size:</span> {pet.size || 'Not specified'}
                    </p>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-4 md:p-6">
                        <DialogHeader>
                          <DialogTitle>Edit Size</DialogTitle>
                        </DialogHeader>
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            const formData = new FormData(e.currentTarget);
                            const size = formData.get('size') as string;
                            if (size) {
                              updatePetDetails.mutate({ size });
                            }
                          }}
                          className="space-y-4"
                        >
                          <div className="space-y-2">
                             <Select 
                              defaultValue={pet.size || ''} 
                              onValueChange={(val) => updatePetDetails.mutate({ size: val })}
                            >
                              <SelectTrigger className="w-full h-11 bg-white/50 dark:bg-black/50 backdrop-blur-sm border-2">
                                <SelectValue placeholder="Select size" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Tiny">Tiny</SelectItem>
                                <SelectItem value="Small">Small</SelectItem>
                                <SelectItem value="Medium">Medium</SelectItem>
                                <SelectItem value="Large">Large</SelectItem>
                                <SelectItem value="Extra Large">Extra Large</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button type="button" onClick={() => (document.querySelector('dialog') as any)?.close()} className="w-full py-6 bg-[#ff6b4a] hover:bg-[#e05a3b]">
                            Save Changes
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  {pet.lifespan && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Expected Lifespan:</span> {pet.lifespan}
                    </p>
                  )}
                </div>
              </div>

              {/* Added ShareMissingPet component */}
              <ShareMissingPet 
                pet={pet} 
                ownerContact={user?.email || "Not available"}
              />

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Care Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {sections.map((section) => (
                    <Link key={section.title} href={section.href}>
                      <Button
                        variant="outline"
                        className="w-full h-auto p-6 flex flex-col items-center gap-3 whitespace-normal"
                      >
                        <section.icon className="h-8 w-8" />
                        <div className="text-center">
                          <h3 className="font-semibold text-lg">{section.title}</h3>
                          <p className="text-muted-foreground text-sm mt-1">
                            {section.description}
                          </p>
                        </div>
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}