import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PetMood } from "@/components/PetMood";
import { PhotoGallery } from "@/components/PhotoGallery";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeft, Apple, Stethoscope, Scissors, Pencil, Camera, Calendar, Dumbbell, Scan, Syringe, ImagePlus, ChevronRight } from "lucide-react";
import { type Pet } from "@shared/schema";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useDropzone } from "react-dropzone";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Header } from "@/components/Header";
import { useAuth } from "@/hooks/use-auth";


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
  // Controls whether the change-photo dropzone overlay is visible
  const [showChangePhoto, setShowChangePhoto] = useState(false);
  const [pendingSize, setPendingSize] = useState<string>("");
  const [pendingGender, setPendingGender] = useState<string>("");
  const { user, loading } = useAuth();

  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: [`/api/pets/${id}`],
  });

  const updatePetImage = useMutation({
    mutationFn: async (imageUrl: string) => {
      if (!imageUrl) return;

      const response = await apiRequest("PATCH", `/api/pets/${id}`, {
        imageUrl,
        // Only add to gallery if it's a genuinely new image
        imageGallery: pet?.imageUrl !== imageUrl ? [imageUrl] : []
      });
      if (!response.ok) {
        throw new Error('Failed to update pet image');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.setQueryData([`/api/pets/${id}`], data);
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}`] });
      toast({ title: "Pet photo updated!" });
      setIsProcessing(false);
      setImagePreview(null);
      setShowChangePhoto(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update pet photo",
      });
      setIsProcessing(false);
      setImagePreview(null);
    },
  });

  const updatePetDetails = useMutation({
    mutationFn: async (data: Partial<Pet>) => {
      // PERFORMANCE OPTIMIZATION: Stripping out image fields for simple text edits
      // This prevents sending massive base64 strings when only the name/age is changed
      const updateData = { ...data };
      delete updateData.imageUrl;
      delete updateData.imageGallery;
      
      const response = await apiRequest("PATCH", `/api/pets/${id}`, updateData);
      if (!response.ok) {
        throw new Error('Failed to update pet details');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/pets"] });
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
    // {
    //   title: "Pet Details & Injury Scanner",
    //   icon: Scan,
    //   href: `/pet/${id}/details`,
    //   description: "View pet details and scan injuries for treatment recommendations"
    // },
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
    // {
    //   title: "Vet Assessment",
    //   icon: Stethoscope,
    //   href: `/pet/${id}/vet`,
    //   description: "Track veterinary care and health records"
    // },
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

  // The image to display — either a freshly picked preview or the saved pet image
  const displayImage = imagePreview || pet.imageUrl;

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <Link href="/">
          <Button variant="ghost" className="mb-8 hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl px-6">
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Pet Identity & Photo */}
          <div className="lg:col-span-5 space-y-6 sticky lg:top-24">
            <Card className="border border-black/[0.04] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[3rem] overflow-hidden bg-white/80 backdrop-blur-xl">
              <div className="p-8 md:p-10 space-y-8">
                {/* Pet Name Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">{pet.name}</h1>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a]">
                          <Pencil className="h-5 w-5" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-8 rounded-[2.5rem]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black">Edit Pet Name</DialogTitle>
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
                          className="space-y-6 pt-4"
                        >
                          <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-black text-slate-400 uppercase tracking-widest">
                              Name
                            </label>
                            <Input
                              id="name"
                              name="name"
                              defaultValue={pet.name}
                              required
                              className="text-lg h-14 bg-slate-50 border-0 rounded-2xl focus-visible:ring-[#ff6b4a]"
                            />
                          </div>
                          <Button type="submit" className="w-full h-14 bg-[#ff6b4a] hover:bg-[#e05a3b] rounded-2xl font-black text-lg">
                            Save Changes
                          </Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>
                  <div className="bg-green-50 text-green-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100">
                    Active Profile
                  </div>
                </div>

                {/* Pet Photo Section */}
                <div className="relative group">
                  {displayImage ? (
                    <div className="space-y-4">
                      <div className="relative rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white aspect-[4/3]">
                        <img
                          src={displayImage}
                          alt={pet.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        {isProcessing && (
                          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                            <div className="flex flex-col items-center gap-3 text-white">
                              <div className="animate-spin h-10 w-10 border-4 border-[#ff6b4a] border-t-transparent rounded-full" />
                              <p className="text-sm font-black uppercase tracking-widest">Updating...</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {!showChangePhoto ? (
                        <Button
                          variant="ghost"
                          onClick={() => setShowChangePhoto(true)}
                          className="w-full h-12 rounded-2xl border-2 border-dashed border-slate-200 text-slate-400 font-black hover:border-[#ff6b4a]/40 hover:text-[#ff6b4a] hover:bg-[#ff6b4a]/5 transition-all"
                        >
                          <Camera className="mr-2 h-5 w-5" />
                          CHANGE PHOTO
                        </Button>
                      ) : (
                        <div
                          {...getRootProps()}
                          className={`border-2 border-dashed rounded-[2rem] p-8 text-center cursor-pointer transition-all duration-300
                            ${isDragActive ? "border-[#ff6b4a] bg-[#ff6b4a]/10" : "border-slate-200 hover:border-[#ff6b4a]/40 hover:bg-slate-50"}
                            ${isProcessing ? "pointer-events-none opacity-50" : ""}`}
                        >
                          <input {...getInputProps()} />
                          <div className="flex flex-col items-center gap-2">
                            <Camera className="h-10 w-10 text-slate-300" />
                            <p className="text-sm font-black text-slate-600 uppercase tracking-tight">Drop to replace</p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="mt-2 font-black text-[#ff6b4a]"
                              onClick={(e) => { e.stopPropagation(); setShowChangePhoto(false); }}
                            >
                              CANCEL
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-[2rem] aspect-[4/3] flex items-center justify-center text-center cursor-pointer transition-all duration-300
                        ${isDragActive ? "border-[#ff6b4a] bg-[#ff6b4a]/10" : "border-slate-200 hover:border-[#ff6b4a]/40 hover:bg-slate-50"}`}
                    >
                      <input {...getInputProps()} />
                      <div className="p-8 space-y-4">
                        <div className="w-20 h-20 rounded-full bg-[#ff6b4a]/10 flex items-center justify-center mx-auto text-[#ff6b4a]">
                          <Camera className="h-10 w-10" />
                        </div>
                        <p className="text-slate-900 font-black">Upload a photo for AI analysis</p>
                        <p className="text-xs text-slate-400 font-medium">JPG, PNG · up to 20MB</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Basic Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-5 rounded-3xl bg-slate-50/50 border border-black/[0.02]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Species</p>
                    <p className="font-black text-slate-900">{pet.species}</p>
                  </div>
                  <div className="p-5 rounded-3xl bg-slate-50/50 border border-black/[0.02]">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Breed</p>
                    <p className="font-black text-slate-900 truncate">{pet.breed || 'Unique Mix'}</p>
                  </div>
                </div>

                {/* Pet Mood Component */}
                <div className="pt-4">
                  <div className="flex items-center gap-3 px-2 mb-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 whitespace-nowrap">Emotional Pulse</h3>
                    <div className="h-px w-full bg-black/[0.04]" />
                  </div>
                  <PetMood pet={pet} />
                </div>
              </div>
            </Card>

            {/* Photo Gallery - Minimal version */}
            {pet.imageGallery && pet.imageGallery.length > 2 && (
              <Card className="border border-black/[0.04] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[2.5rem] bg-white/80 backdrop-blur-xl p-8">
                 <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-slate-900">Gallery</h3>
                    <span className="text-xs font-black text-[#ff6b4a]">{pet.imageGallery.length} Photos</span>
                 </div>
                 <PhotoGallery pet={pet} />
              </Card>
            )}
          </div>

          {/* Right Column: Details & Care Management */}
          <div className="lg:col-span-7 space-y-8">
            {/* Quick Details Card */}
            <Card className="border border-black/[0.04] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] rounded-[3rem] bg-white p-10 overflow-hidden relative group">
              <div className="absolute top-[-20%] right-[-10%] w-64 h-64 bg-slate-50 blur-[80px] rounded-full group-hover:bg-[#ff6b4a]/5 transition-colors duration-700 pointer-events-none" />
              <div className="relative z-10 space-y-10">
                <div className="flex items-center gap-4">
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[#ff6b4a]">Core Vital Details</h3>
                  <div className="h-px flex-1 bg-black/[0.04]" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Weight Detail */}
                  <div className="flex items-center justify-between group/detail">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/detail:bg-[#ff6b4a]/10 group-hover/detail:text-[#ff6b4a] transition-all">
                        <Dumbbell className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Weight</p>
                        <p className="text-lg font-black text-slate-900">{pet.weight || 'Not specified'}</p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#ff6b4a]/10">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-8 rounded-[2.5rem]">
                        <DialogHeader><DialogTitle className="text-2xl font-black">Edit Weight</DialogTitle></DialogHeader>
                        <form onSubmit={(e) => { e.preventDefault(); const d = new FormData(e.currentTarget); const w = d.get('weight') as string; if(w) updatePetDetails.mutate({weight: w}); }} className="space-y-6 pt-4">
                          <Input name="weight" defaultValue={pet.weight || ''} placeholder="e.g., 25 lbs" className="h-14 bg-slate-50 border-0 rounded-2xl" />
                          <Button type="submit" className="w-full h-14 bg-[#ff6b4a] rounded-2xl font-black">Save Changes</Button>
                        </form>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Size Detail */}
                  <div className="flex items-center justify-between group/detail">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/detail:bg-[#ff6b4a]/10 group-hover/detail:text-[#ff6b4a] transition-all">
                        <Scan className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Size Class</p>
                        <p className="text-lg font-black text-slate-900">{pet.size || 'Not specified'}</p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#ff6b4a]/10">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-8 rounded-[2.5rem]">
                        <DialogHeader><DialogTitle className="text-2xl font-black">Edit Size</DialogTitle></DialogHeader>
                        <div className="space-y-6 pt-4">
                          <Select 
                            defaultValue={pet.size || ''} 
                            onValueChange={(val) => setPendingSize(val)}
                          >
                            <SelectTrigger className="h-14 bg-slate-50 border-0 rounded-2xl">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Tiny">Tiny</SelectItem>
                              <SelectItem value="Small">Small</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="Large">Large</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            onClick={() => {
                              if (pendingSize) updatePetDetails.mutate({ size: pendingSize });
                              (document.querySelector('[data-state="open"]')?.parentElement?.querySelector('[data-state="closed"]') as any)?.click();
                            }} 
                            className="w-full h-14 bg-[#ff6b4a] rounded-2xl font-black"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {/* Gender Detail */}
                  <div className="flex items-center justify-between group/detail">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover/detail:bg-[#ff6b4a]/10 group-hover/detail:text-[#ff6b4a] transition-all">
                        <Scan className="h-6 w-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Gender</p>
                        <p className="text-lg font-black text-slate-900 capitalize">{pet.gender || 'Not specified'}</p>
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full hover:bg-[#ff6b4a]/10">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="p-8 rounded-[2.5rem]">
                        <DialogHeader><DialogTitle className="text-2xl font-black">Edit Gender</DialogTitle></DialogHeader>
                        <div className="space-y-6 pt-4">
                          <Select 
                            defaultValue={pet.gender || ''} 
                            onValueChange={(val) => setPendingGender(val)}
                          >
                            <SelectTrigger className="h-14 bg-slate-50 border-0 rounded-2xl">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="male">Male</SelectItem>
                              <SelectItem value="female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                          <Button 
                            type="button" 
                            onClick={() => {
                              if (pendingGender) updatePetDetails.mutate({ gender: pendingGender });
                              (document.querySelector('[data-state="open"]')?.parentElement?.querySelector('[data-state="closed"]') as any)?.click();
                            }} 
                            className="w-full h-14 bg-[#ff6b4a] rounded-2xl font-black"
                          >
                            Save Changes
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>

            {/* Care Management Grid */}
            <div className="space-y-6">
              <div className="flex items-center gap-4 px-2">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Professional Care Suite</h3>
                <div className="h-px flex-1 bg-black/[0.04]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {sections.map((section) => (
                  <Link key={section.title} href={section.href}>
                    <div className="group relative p-8 rounded-[2.5rem] bg-white border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:scale-150 transition-transform duration-700">
                        <section.icon className="w-24 h-24" />
                      </div>
                      
                      <div className="relative z-10 space-y-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#ff6b4a]/5 flex items-center justify-center text-[#ff6b4a] group-hover:bg-[#ff6b4a] group-hover:text-white transition-all duration-500 shadow-sm group-hover:shadow-orange-500/40">
                          <section.icon className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-black text-slate-900">{section.title}</h3>
                          <p className="text-sm font-medium text-slate-400 leading-relaxed">
                            {section.description}
                          </p>
                        </div>
                        <div className="pt-2 flex items-center gap-2 text-xs font-black text-[#ff6b4a] opacity-0 group-hover:opacity-100 -translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                          OPEN DASHBOARD <ChevronRight className="w-3 h-3" />
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}