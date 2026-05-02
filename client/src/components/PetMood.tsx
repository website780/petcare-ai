import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Smile, Frown, Meh, Heart, AlertCircle, Camera, Info } from "lucide-react";
import { Pet } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useDropzone } from "react-dropzone";
import { format } from "date-fns";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

interface PetMoodProps {
  pet: Pet;
  onMoodUpdate?: () => void;
}

async function compressImage(imageDataUrl: string, maxWidth = 800): Promise<string> {
  return new Promise((resolve, reject) => {
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

      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }

      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);
      resolve(canvas.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = reject;
    img.src = imageDataUrl;
  });
}

export function PetMood({ pet, onMoodUpdate }: PetMoodProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const analyzeMood = useMutation({
    mutationFn: async (base64Image: string) => {
      const response = await apiRequest("POST", "/api/analyze", { imageData: base64Image });
      if (!response.ok) {
        throw new Error('Failed to analyze mood');
      }
      return response.json();
    },
    onSuccess: async (analysis) => {
      try {
        const now = new Date();
        const currentGallery = pet.imageGallery || [];
        const compressedImage = imagePreview ? await compressImage(imagePreview) : null;

        const response = await apiRequest("PATCH", `/api/pets/${pet.id}`, {
          currentMood: analysis.currentMood,
          moodDescription: analysis.moodDescription,
          moodRecommendations: analysis.moodRecommendations,
          lastMoodUpdate: now.toISOString(),
          imageGallery: compressedImage ? [...currentGallery, compressedImage] : currentGallery,
        });

        if (!response.ok) {
          throw new Error('Failed to update pet mood');
        }

        queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}`] });

        toast({
          title: "Mood updated!",
          description: `Your pet seems to be ${analysis.currentMood.toLowerCase()}.`,
        });
        onMoodUpdate?.();
        setImagePreview(null);
      } catch (error) {
        console.error('Error updating pet mood:', error);
        toast({
          variant: "destructive",
          title: "Failed to update mood",
          description: error instanceof Error ? error.message : "Please try again",
        });
      }
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Failed to analyze mood",
        description: error instanceof Error ? error.message : "Please try again",
      });
    },
  });

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      toast({
        variant: "destructive",
        title: "File too large",
        description: "Please select an image under 10MB",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async () => {
      const imageData = reader.result as string;
      try {
        const compressedImage = await compressImage(imageData);
        setImagePreview(compressedImage);

        const base64 = compressedImage.split(",")[1];
        await analyzeMood.mutateAsync(base64);
      } catch (error) {
        console.error('Error processing image:', error);
        toast({
          variant: "destructive",
          title: "Error processing image",
          description: "Please try again with a different image",
        });
        setImagePreview(null);
      }
    };
    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    maxFiles: 1,
  });

  const getMoodIcon = () => {
    const mood = pet.currentMood?.toLowerCase() || "";
    if (mood.includes("happy") || mood.includes("excited") || mood.includes("playful")) {
      return <Smile className="h-8 w-8 text-green-500" />;
    }
    if (mood.includes("sad") || mood.includes("anxious") || mood.includes("stressed")) {
      return <Frown className="h-8 w-8 text-yellow-500" />;
    }
    if (mood.includes("calm") || mood.includes("relaxed") || mood.includes("content")) {
      return <Heart className="h-8 w-8 text-blue-500" />;
    }
    if (mood.includes("alert") || mood.includes("attention")) {
      return <AlertCircle className="h-8 w-8 text-orange-500" />;
    }
    return <Meh className="h-8 w-8 text-gray-500" />;
  };

  // Get pet-specific photo guidelines based on species and breed
  const getPhotoGuidelines = () => {
    const species = pet.species?.toLowerCase() || '';
    const breed = pet.breed?.toLowerCase() || '';
    
    // Common photo guidelines for different pet types
    let specificGuidelines: { title: string; tips: string[] } = {
      title: "General Pet Photo Tips",
      tips: [
        "Ensure good lighting - natural daylight is best",
        "Get at eye level with your pet",
        "Use treats or toys to get their attention",
        "Capture multiple images to increase chances of success",
        "Avoid using flash as it can distort facial expressions"
      ]
    };
    
    if (species.includes('dog')) {
      specificGuidelines = {
        title: "Dog Photo Guidelines",
        tips: [
          "Capture facial features - especially the eyes, ears, and mouth position",
          "Pay attention to ear position - forward ears often indicate alertness, while flattened ears may show fear or submission",
          "Notice tail position - high and wagging indicates happiness, tucked indicates fear",
          "Look for facial muscle tension, especially around the mouth and eyes",
          "For high energy breeds, try to capture them when calm to better assess emotions",
          "For brachycephalic (flat-faced) breeds like Bulldogs, focus more on body posture than facial expression"
        ]
      };
      
      // Add breed-specific guidance for common dog breeds
      if (breed.includes('collie') || breed.includes('shepherd') || breed.includes('retriever') || breed.includes('setter')) {
        specificGuidelines.tips.push("Expressive breeds with clear facial signals - focus on eyebrow movements and ear positions");
      } else if (breed.includes('bulldog') || breed.includes('pug') || breed.includes('boxer')) {
        specificGuidelines.tips.push("Flat-faced breeds show emotion through body posture and eye expressions more than facial muscles");
      } else if (breed.includes('hound') || breed.includes('beagle') || breed.includes('dachshund')) {
        specificGuidelines.tips.push("Hound breeds often show emotions through vocalizations, capture when they're actively expressing");
      }
    } else if (species.includes('cat')) {
      specificGuidelines = {
        title: "Cat Photo Guidelines",
        tips: [
          "Focus on eye shape and pupil dilation - narrow pupils can indicate aggression or fear",
          "Pay attention to ear position - flattened ears show fear or aggression",
          "Observe whisker position - forward indicates curiosity, back suggests fear",
          "Notice tail position and movement - upright means confidence, twitching may indicate agitation",
          "Look for body posture - arched back may indicate fear, while relaxed posture suggests contentment",
          "Try to photograph during natural behaviors rather than posed moments"
        ]
      };
      
      // Add breed-specific guidance for common cat breeds
      if (breed.includes('persian') || breed.includes('himalayan') || breed.includes('exotic')) {
        specificGuidelines.tips.push("Flat-faced breeds show emotion through body posture and eye expressions more than facial muscles");
      } else if (breed.includes('siamese') || breed.includes('oriental') || breed.includes('abyssinian')) {
        specificGuidelines.tips.push("Highly expressive breeds - capture vocalization moments and active expressions");
      }
    } else if (species.includes('bird')) {
      specificGuidelines = {
        title: "Bird Photo Guidelines",
        tips: [
          "Focus on feather positioning - fluffed or sleeked feathers indicate different moods",
          "Pay attention to pupil dilation and eye movement",
          "Notice beak position - open beak may indicate stress or excitement",
          "Capture natural perching position rather than flight",
          "Allow for natural head movements and postures",
          "Photograph during active periods when birds are most expressive"
        ]
      };
    } else if (species.includes('rabbit') || species.includes('rodent')) {
      specificGuidelines = {
        title: "Small Pet Photo Guidelines",
        tips: [
          "Focus on ear position - upright ears indicate alertness, while flat ears suggest fear",
          "Observe whisker position and movement",
          "Notice body posture - hunched posture may indicate pain or discomfort",
          "Pay attention to eye wideness and blinking frequency",
          "Capture during natural exploration or resting periods",
          "Use treats to encourage facing the camera for better facial expression capture"
        ]
      };
    }
    
    return specificGuidelines;
  };

  const guidelines = getPhotoGuidelines();
  
  // Emotions that AI systems can potentially detect in pets
  const emotionDetectionInfo = [
    {
      emotion: "Pain",
      indicators: [
        "Squinted or partially closed eyes",
        "Flattened ears or unusual ear position",
        "Tense facial muscles",
        "Hunched or tense body posture",
        "Excessive facial symmetry (abnormal in pain states)"
      ]
    },
    {
      emotion: "Happiness/Relaxation",
      indicators: [
        "Relaxed facial muscles",
        "Neutral or slightly open mouth position",
        "Forward or relaxed ear position",
        "Relaxed eye appearance",
        "Natural body posture"
      ]
    },
    {
      emotion: "Fear/Anxiety",
      indicators: [
        "Dilated pupils",
        "Wide eyes with visible white portions",
        "Flattened ears",
        "Tense facial muscles",
        "Mouth closed tightly or panting"
      ]
    },
    {
      emotion: "Alertness/Attention",
      indicators: [
        "Forward-facing ears",
        "Direct eye contact or fixed gaze",
        "Slightly raised eyebrows (in some species)",
        "Head tilted or focused posture",
        "Mouth closed or slightly open"
      ]
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          {getMoodIcon()}
          <div>
            <h3 className="text-xl font-semibold">{pet.currentMood || "Unknown Mood"}</h3>
            {pet.lastMoodUpdate && (
              <p className="text-sm text-muted-foreground">
                Last updated: {format(new Date(pet.lastMoodUpdate), 'PPp')}
              </p>
            )}
          </div>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Camera className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-y-auto rounded-[2rem] p-6">
            <DialogHeader>
              <DialogTitle>Capture {pet.name}'s Mood</DialogTitle>
              <DialogDescription>
                Upload a clear photo of your {pet.species}'s face and body posture to analyze their mood
              </DialogDescription>
            </DialogHeader>
            
            {/* Photo Guidelines Accordion */}
            <Accordion type="single" collapsible className="w-full mb-4">
              <AccordionItem value="guidelines">
                <AccordionTrigger className="text-sm font-medium flex items-center gap-2">
                  <Info className="h-4 w-4 text-blue-500" />
                  How to take effective emotion-revealing photos
                </AccordionTrigger>
                <AccordionContent className="text-sm">
                  <div className="space-y-4 mt-2">
                    <div>
                      <h4 className="font-medium text-sm mb-2">{guidelines.title}</h4>
                      <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                        {guidelines.tips.map((tip, i) => (
                          <li key={i}>{tip}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="mt-4">
                      <h4 className="font-medium text-sm mb-2">Detectable Emotions & Their Indicators</h4>
                      <div className="space-y-3">
                        {emotionDetectionInfo.map((item, i) => (
                          <div key={i} className="text-sm">
                            <p className="font-medium">{item.emotion}</p>
                            <ul className="list-disc list-inside text-muted-foreground ml-2">
                              {item.indicators.slice(0, 3).map((indicator, j) => (
                                <li key={j} className="text-xs">{indicator}</li>
                              ))}
                            </ul>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            {/* Image Upload Area */}
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                ${isDragActive ? "border-primary bg-primary/5" : "border-muted"}
                ${analyzeMood.isPending ? "pointer-events-none opacity-50" : ""}`}
            >
              <input {...getInputProps()} />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="max-h-64 mx-auto mb-4 rounded-lg"
                />
              ) : (
                <Camera className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
              )}
              {analyzeMood.isPending ? (
                <p>Analyzing mood...</p>
              ) : (
                <div>
                  <p className="mb-2">Take a photo or drop an image here to analyze {pet.name}'s mood</p>
                  <p className="text-xs text-muted-foreground">For best results, ensure the photo clearly shows facial features and body posture</p>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {pet.moodDescription && (
        <p className="text-muted-foreground mb-4">{pet.moodDescription}</p>
      )}

      {pet.moodRecommendations && pet.moodRecommendations.length > 0 && (
        <div>
          <h4 className="font-medium mb-2">Recommendations:</h4>
          <ul className="list-disc list-inside space-y-1">
            {pet.moodRecommendations.map((recommendation, index) => (
              <li key={index} className="text-muted-foreground">
                {recommendation}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}