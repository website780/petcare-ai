import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Pet } from "@shared/schema";
import { Scissors, Bath, Brush, Bone, Video } from "lucide-react";
import { searchYouTubeVideos } from "@/lib/youtube";
import { useQuery } from "@tanstack/react-query";

interface GroomingTipsProps {
  pet: Pet;
}

interface GroomingTask {
  id: string;
  completed: boolean;
}

interface GroomingStep {
  title: string;
  description: string;
  icon: string;
}

interface GroomingGuide {
  title: string;
  icon: any;
  steps: GroomingStep[];
}

export function GroomingTips({ pet }: GroomingTipsProps) {
  const [groomingTasks, setGroomingTasks] = useState<Record<string, GroomingTask>>({});
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  // Search for grooming videos based on pet species and breed
  const searchQuery = `${pet.species}${pet.breed ? ` ${pet.breed}` : ''} grooming tutorial`;
  const { data: videos = [], isLoading: isLoadingVideos } = useQuery({
    queryKey: ['youtube-search', searchQuery],
    queryFn: async () => searchYouTubeVideos(searchQuery),
  });

  // Auto-select the first video when videos are loaded
  useEffect(() => {
    if (videos.length > 0 && !selectedVideo) {
      setSelectedVideo(videos[0].id);
    }
  }, [videos]);

  const toggleTask = (taskId: string) => {
    setGroomingTasks((prev) => ({
      ...prev,
      [taskId]: {
        id: taskId,
        completed: !prev[taskId]?.completed,
      },
    }));
  };

  // Comprehensive grooming guides based on pet species
  const getGroomingGuides = (): GroomingGuide[] => {
    const species = pet.species?.toLowerCase();
    
    if (species === 'dog') {
      return [
        {
          title: "Brushing & Coat Care",
          icon: Brush,
          steps: [
            {
              title: "Pre-Brush Inspection",
              description: "Check your dog's coat for mats, tangles, or skin irritations. Feel for any lumps or bumps.",
              icon: "search"
            },
            {
              title: "Choose Right Brush",
              description: "Use a slicker brush for most coats, pin brush for long hair, or de-shedding tool for heavy shedders.",
              icon: "brush"
            },
            {
              title: "Brush Systematically",
              description: "Start from the head and work down. Brush in the direction of hair growth with gentle, long strokes.",
              icon: "arrow-down"
            },
            {
              title: "Focus on Problem Areas",
              description: "Pay extra attention to areas prone to matting: behind ears, under legs, chest, and tail.",
              icon: "target"
            }
          ]
        },
        {
          title: "Bathing Process",
          icon: Bath,
          steps: [
            {
              title: "Pre-Bath Preparation",
              description: "Brush thoroughly to remove loose hair and mats. Place cotton balls in ears to prevent water entry.",
              icon: "preparation"
            },
            {
              title: "Water Temperature & Wetting",
              description: "Use lukewarm water (not hot). Wet your dog thoroughly, starting from the back and avoiding the face initially.",
              icon: "thermometer"
            },
            {
              title: "Shampoo Application",
              description: "Apply dog-specific shampoo, work into a lather. Massage gently, starting from neck down to tail.",
              icon: "soap"
            },
            {
              title: "Rinse & Dry",
              description: "Rinse thoroughly until water runs clear. Towel dry first, then use blow dryer on cool setting if tolerated.",
              icon: "wind"
            }
          ]
        },
        {
          title: "Nail Trimming",
          icon: Scissors,
          steps: [
            {
              title: "Gather Supplies",
              description: "Get proper dog nail clippers, styptic powder (in case of bleeding), and high-value treats.",
              icon: "scissors"
            },
            {
              title: "Position & Hold",
              description: "Hold paw firmly but gently. Press on paw pad to extend the nail. Identify the pink quick inside.",
              icon: "hand"
            },
            {
              title: "Make the Cut",
              description: "Cut at a 45-degree angle, staying well away from the pink quick. Cut only the white/clear tip.",
              icon: "cut"
            },
            {
              title: "Reward & Check",
              description: "Give treats immediately after each nail. Check for any bleeding and apply styptic powder if needed.",
              icon: "gift"
            }
          ]
        },
        {
          title: "Ear Cleaning",
          icon: Bone,
          steps: [
            {
              title: "Inspect Ears",
              description: "Look for redness, swelling, discharge, or strong odor. If present, consult your vet first.",
              icon: "eye"
            },
            {
              title: "Apply Ear Cleaner",
              description: "Use veterinary ear cleaning solution. Fill the ear canal and massage the base gently for 30 seconds.",
              icon: "droplet"
            },
            {
              title: "Let Dog Shake",
              description: "Allow your dog to shake their head to help loosen debris. This is normal and expected.",
              icon: "shake"
            },
            {
              title: "Wipe Clean",
              description: "Use cotton balls or gauze to wipe out visible debris. Never use cotton swabs deep in the ear.",
              icon: "clean"
            }
          ]
        }
      ];
    } else if (species === 'cat') {
      return [
        {
          title: "Brushing & Fur Care",
          icon: Brush,
          steps: [
            {
              title: "Start Slowly",
              description: "Begin with short sessions when your cat is relaxed. Let them sniff and investigate the brush first.",
              icon: "clock"
            },
            {
              title: "Brush Direction",
              description: "Brush in the direction of fur growth. Start with areas your cat enjoys being petted.",
              icon: "arrow-right"
            },
            {
              title: "Focus on Shedding Areas",
              description: "Pay attention to areas where your cat sheds most: back, sides, and chest areas.",
              icon: "target"
            },
            {
              title: "Handle Mats Carefully",
              description: "For small mats, work them out gently with your fingers. Large mats may need professional removal.",
              icon: "scissors"
            }
          ]
        },
        {
          title: "Nail Trimming",
          icon: Scissors,
          steps: [
            {
              title: "Get Cat Comfortable",
              description: "Practice handling paws when your cat is calm. Give treats and praise for cooperation.",
              icon: "heart"
            },
            {
              title: "Extend the Claws",
              description: "Gently press on the paw pad to extend the claw. You'll see the clear part and pink quick inside.",
              icon: "hand"
            },
            {
              title: "Trim Just the Tips",
              description: "Cut only the sharp, clear tips. Stay well away from the pink quick to avoid pain and bleeding.",
              icon: "cut"
            },
            {
              title: "Reward Success",
              description: "Give treats and praise after each successful clip. Start with just a few nails per session.",
              icon: "gift"
            }
          ]
        },
        {
          title: "Ear Inspection",
          icon: Bone,
          steps: [
            {
              title: "Weekly Check",
              description: "Look inside ears weekly for dirt, wax buildup, redness, or unusual odor.",
              icon: "calendar"
            },
            {
              title: "Gentle Cleaning",
              description: "Use a cotton ball dampened with vet-approved ear cleaner. Wipe only the visible areas.",
              icon: "droplet"
            },
            {
              title: "Watch for Issues",
              description: "Look for excessive scratching, head shaking, or dark discharge. These may indicate infection.",
              icon: "eye"
            },
            {
              title: "Professional Help",
              description: "If you notice any concerning signs, consult your veterinarian before attempting to clean.",
              icon: "phone"
            }
          ]
        },
        {
          title: "Dental Care",
          icon: Bath,
          steps: [
            {
              title: "Introduce Gradually",
              description: "Start by letting your cat lick cat toothpaste from your finger. Make it a positive experience.",
              icon: "smile"
            },
            {
              title: "Finger Brushing",
              description: "Wrap gauze around your finger with cat toothpaste. Gently rub teeth and gums for a few seconds.",
              icon: "finger"
            },
            {
              title: "Progress to Brush",
              description: "Once comfortable, introduce a soft cat toothbrush or finger brush with pet-safe toothpaste.",
              icon: "brush"
            },
            {
              title: "Focus on Key Areas",
              description: "Concentrate on the outer surfaces of teeth where plaque typically accumulates most.",
              icon: "target"
            }
          ]
        }
      ];
    } else {
      // Default grooming guide for other pets
      return [
        {
          title: "General Grooming",
          icon: Brush,
          steps: [
            {
              title: "Regular Inspection",
              description: "Check your pet regularly for any changes in skin, coat, or overall condition.",
              icon: "search"
            },
            {
              title: "Gentle Cleaning",
              description: "Use species-appropriate cleaning methods and products recommended by your veterinarian.",
              icon: "clean"
            },
            {
              title: "Professional Consultation",
              description: "Consult with your vet about specific grooming needs for your pet's species and breed.",
              icon: "phone"
            },
            {
              title: "Monitor Health",
              description: "Watch for any signs of discomfort, irritation, or changes during grooming sessions.",
              icon: "heart"
            }
          ]
        }
      ];
    }
  };

  const groomingGuides = getGroomingGuides();

  const getStepIcon = (iconName: string) => {
    // Map icon names to actual components or use a default
    switch(iconName) {
      case 'search': case 'eye': return '🔍';
      case 'brush': return '🪥';
      case 'arrow-down': case 'arrow-right': return '⬇️';
      case 'target': return '🎯';
      case 'preparation': return '📋';
      case 'thermometer': return '🌡️';
      case 'soap': return '🧼';
      case 'wind': return '💨';
      case 'scissors': case 'cut': return '✂️';
      case 'hand': case 'finger': return '👋';
      case 'gift': return '🎁';
      case 'droplet': return '💧';
      case 'shake': return '📳';
      case 'clean': return '🧽';
      case 'clock': return '⏰';
      case 'heart': return '❤️';
      case 'calendar': return '📅';
      case 'phone': return '📞';
      case 'smile': return '😊';
      default: return '✨';
    }
  };

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Comprehensive Grooming Guide</h3>
      {pet.groomingSchedule && (
        <p className="text-muted-foreground mb-6">
          <span className="font-medium">Recommended Schedule: </span>
          {pet.groomingSchedule}
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div>
          <ScrollArea className="h-[600px] pr-4">
            <Accordion type="single" collapsible className="space-y-4">
              {groomingGuides.map((guide, guideIndex) => {
                const GuideIcon = guide.icon;
                return (
                  <AccordionItem key={guideIndex} value={`guide-${guideIndex}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <GuideIcon className="h-5 w-5" />
                          <span className="text-left font-semibold">{guide.title}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mr-2">
                          {guide.steps.filter((_, stepIndex) => 
                            groomingTasks[`grooming-${guideIndex}-${stepIndex}`]?.completed
                          ).length} / {guide.steps.length} completed
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        {guide.steps.map((step, stepIndex) => {
                          const taskId = `grooming-${guideIndex}-${stepIndex}`;
                          return (
                            <div key={stepIndex} className="border rounded-lg p-4 bg-muted/20">
                              <div className="flex items-start gap-3 mb-3">
                                <div className="text-2xl flex-shrink-0 mt-1">
                                  {getStepIcon(step.icon)}
                                </div>
                                <div className="flex-1">
                                  <h4 className="font-semibold text-sm mb-1">
                                    Step {stepIndex + 1}: {step.title}
                                  </h4>
                                  <p className="text-sm text-muted-foreground leading-relaxed">
                                    {step.description}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 ml-11">
                                <Checkbox
                                  id={taskId}
                                  checked={groomingTasks[taskId]?.completed}
                                  onCheckedChange={() => toggleTask(taskId)}
                                />
                                <label
                                  htmlFor={taskId}
                                  className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  Mark as completed
                                </label>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
        </div>

        <div>
          <h4 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Video className="h-5 w-5" />
            Grooming Tutorial Videos
          </h4>
          {isLoadingVideos ? (
            <div className="space-y-2">
              {[1, 2, 3].map((n) => (
                <div key={n} className="animate-pulse h-12 bg-muted rounded" />
              ))}
            </div>
          ) : videos.length > 0 ? (
            <div className="space-y-4">
              {selectedVideo && (
                <div className="relative pt-[56.25%] rounded-lg overflow-hidden bg-muted">
                  <iframe
                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                    className="absolute top-0 left-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
              <div className="space-y-2">
                {videos.map((video) => (
                  <Button
                    key={video.id}
                    variant={selectedVideo === video.id ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => setSelectedVideo(video.id)}
                  >
                    <Video className="h-4 w-4 mr-2" />
                    {video.title}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-center">
              No tutorial videos available for this pet.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}