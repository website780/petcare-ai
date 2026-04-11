import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Share2, Image } from "lucide-react";
import { Pet } from "@shared/schema";
import { ShareAchievement } from "./ShareAchievement";

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
              className="w-full h-full object-cover rounded-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Button
                variant="outline"
                className="text-white border-white hover:text-white"
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
              <ShareAchievement
                pet={pet}
                shareImage={selectedImage}
                achievement="Check out this photo!"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}