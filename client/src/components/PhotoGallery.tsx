import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Image } from "lucide-react";
import { Pet } from "@shared/schema";


interface PhotoGalleryProps {
  pet: Pet;
}

export function PhotoGallery({ pet }: PhotoGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showShareDialog, setShowShareDialog] = useState(false);

  // Only use images from imageGallery
  const gallery = pet.imageGallery || [];

  if (!gallery.length) {
    return (
      <Card className="p-6 text-center">
        <Image className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">No gallery photos available.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((imageUrl, index) => (
          <div key={index} className="relative group aspect-square">
            <img
              src={imageUrl}
              alt={`${pet.name}'s photo ${index + 1}`}
              className="w-full h-full object-cover rounded-2xl"
            />
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center rounded-2xl">
              <Button
                variant="default"
                className="bg-white hover:bg-[#ff6b4a] text-black hover:text-white font-black rounded-2xl h-11 px-5 shadow-xl border-none transition-all hover:scale-105"
                onClick={() => {
                  setSelectedImage(imageUrl);
                  setShowShareDialog(true);
                }}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={showShareDialog} onOpenChange={setShowShareDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share Photo</DialogTitle>
          </DialogHeader>
          {selectedImage && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img
                  src={selectedImage}
                  alt={`${pet.name}'s selected photo`}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
              <div className="flex justify-center pt-2">
                <Button className="w-full bg-[#ff6b4a] hover:bg-[#e05a3b]" onClick={() => {
                  const link = document.createElement('a');
                  link.href = selectedImage;
                  link.download = `${pet.name}-photo.jpg`;
                  link.click();
                }}>
                  Download Photo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}