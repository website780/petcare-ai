import { useState } from "react";
import { Pet } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Share2, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ShareMissingPetProps {
  pet: Pet;
  ownerContact: string;
}

export function ShareMissingPet({ pet, ownerContact }: ShareMissingPetProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const generateShareText = () => {
    return `🚨 MISSING PET ALERT 🚨

Pet Name: ${pet.name}
Species: ${pet.species}
Breed: ${pet.breed || 'Not specified'}
Gender: ${pet.gender || 'Not specified'}

Last Known Details:
${pet.size ? `Size: ${pet.size}` : ''}
${pet.weight ? `Weight: ${pet.weight}` : ''}
Special Characteristics: ${pet.vetCareDetails ? pet.vetCareDetails.join(', ') : 'Not specified'}

If found, please contact: ${ownerContact}

Additional Information:
${pet.careRecommendations ? pet.careRecommendations.join('\n') : ''}

Please share to help us find them! 🙏`;
  };

  const handleShare = async () => {
    const shareData = {
      title: `Missing Pet: ${pet.name}`,
      text: generateShareText(),
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        toast({
          title: "Shared successfully",
          description: "Thank you for helping spread the word!"
        });
      } else {
        throw new Error("Share not supported");
      }
    } catch (error) {
      // Fallback to copy to clipboard
      handleCopy();
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generateShareText());
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "You can now paste and share this information"
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to copy",
        description: "Please try again"
      });
    }
  };

  return (
    <Card className="mt-6">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Share Missing Pet Information</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pet.imageGallery && pet.imageGallery.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`${pet.name} - Photo ${index + 1}`}
                className="rounded-lg object-cover h-48 w-full"
              />
            ))}
          </div>

          <div className="flex flex-col space-y-2">
            <p className="text-sm text-muted-foreground">
              Share this information to help find {pet.name}
            </p>
            <div className="flex gap-2">
              <Button
                onClick={handleShare}
                className="flex-1"
                variant="default"
              >
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button
                onClick={handleCopy}
                variant="outline"
                className="flex-1"
              >
                {copied ? (
                  <Check className="mr-2 h-4 w-4" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                {copied ? "Copied!" : "Copy Details"}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}