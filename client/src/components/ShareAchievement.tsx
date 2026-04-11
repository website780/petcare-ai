import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Share2, Facebook, Twitter, Linkedin, Copy, Check } from "lucide-react";
import { Pet } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ShareAchievementProps {
  pet: Pet;
  achievement?: string;
  shareImage?: string | null;
}

export function ShareAchievement({ pet, achievement, shareImage }: ShareAchievementProps) {
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const moodText = pet.currentMood 
    ? `${pet.name} is feeling ${pet.currentMood.toLowerCase()}!` 
    : `Check out my amazing pet ${pet.name}!`;

  const shareText = achievement || moodText;

  // Get current page URL for sharing
  const shareUrl = window.location.href;

  // Create sharing text with image if available
  const fullShareText = `${shareText}\n\n${pet.moodDescription || ''}\n\nSee more: ${shareUrl}`;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        const shareData: ShareData = {
          title: pet.name,
          text: shareText,
          url: shareUrl,
        };

        // If we have an image and the browser supports sharing files
        if ((shareImage || pet.imageUrl) && navigator.canShare) {
          try {
            // Fetch the image and convert it to a blob
            const response = await fetch(shareImage || pet.imageUrl!);
            const blob = await response.blob();
            const file = new File([blob], "pet-image.jpg", { type: "image/jpeg" });

            // Add the file to share data if the browser can share it
            if (navigator.canShare({ files: [file] })) {
              shareData.files = [file];
            }
          } catch (error) {
            console.error('Error preparing image for sharing:', error);
          }
        }

        await navigator.share(shareData);
        toast({
          title: "Shared successfully!",
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          toast({
            variant: "destructive",
            title: "Failed to share",
            description: "Please try using the social media buttons instead.",
          });
        }
      }
    } else {
      toast({
        description: "Please use the social media buttons to share.",
      });
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast({
      title: "Link copied to clipboard!",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const socialLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}&quote=${encodeURIComponent(fullShareText)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(fullShareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Input
          readOnly
          value={shareUrl}
          className="flex-1"
        />
        <Button
          size="icon"
          variant="outline"
          onClick={handleCopyLink}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>

      <div className="flex justify-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(socialLinks.facebook, '_blank')}
          className="hover:text-blue-600 hover:border-blue-600"
        >
          <Facebook className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(socialLinks.twitter, '_blank')}
          className="hover:text-blue-400 hover:border-blue-400"
        >
          <Twitter className="h-5 w-5" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => window.open(socialLinks.linkedin, '_blank')}
          className="hover:text-blue-700 hover:border-blue-700"
        >
          <Linkedin className="h-5 w-5" />
        </Button>
      </div>

      <Separator />

      {navigator.share && (
        <Button
          className="w-full"
          onClick={handleShare}
        >
          <Share2 className="h-4 w-4 mr-2" />
          Share using device
        </Button>
      )}
    </div>
  );
}