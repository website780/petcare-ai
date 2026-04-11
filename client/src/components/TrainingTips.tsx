import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Pet } from "@shared/schema";
import { Dumbbell, Target, Video, Brain, Award, CheckCircle2 } from "lucide-react";
import { searchYouTubeVideos } from "@/lib/youtube";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface TrainingTipsProps {
  pet: Pet;
}

interface TrainingStep {
  category: string;
  step: string;
  type?: string;
  description: string;
  duration: string;
  prerequisites: string[];
  difficulty: string;
  checkpoints: string[];
  tips: string[];
  completed?: boolean;
  progress?: number;
}

interface TrainingProgress {
  stepId: string;
  checkpoint: string;
  completed: boolean;
}

export function TrainingTips({ pet }: TrainingTipsProps) {
  const [trainingProgress, setTrainingProgress] = useState<Record<string, TrainingProgress[]>>({});
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Search for training videos based on pet species and breed
  const searchQuery = `${pet.species}${pet.breed ? ` ${pet.breed}` : ''} training tutorial`;
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

  const updateProgress = useMutation({
    mutationFn: async (data: { stepId: string, checkpoint: string, completed: boolean }) => {
      const response = await apiRequest("PATCH", `/api/pets/${pet.id}`, {
        trainingProgress: JSON.stringify({
          ...trainingProgress,
          [data.stepId]: trainingProgress[data.stepId]?.map(cp => 
            cp.checkpoint === data.checkpoint ? { ...cp, completed: data.completed } : cp
          ) || []
        })
      });
      if (!response.ok) throw new Error('Failed to update training progress');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}`] });
    }
  });

  const toggleCheckpoint = (stepId: string, checkpoint: string) => {
    const currentProgress = trainingProgress[stepId] || [];
    const checkpointProgress = currentProgress.find(cp => cp.checkpoint === checkpoint);
    const completed = !checkpointProgress?.completed;

    updateProgress.mutate({ stepId, checkpoint, completed });

    setTrainingProgress(prev => ({
      ...prev,
      [stepId]: [
        ...(prev[stepId] || []).filter(cp => cp.checkpoint !== checkpoint),
        { stepId, checkpoint, completed }
      ]
    }));
  };

  const getIcon = (category: string) => {
    // Map categories to specific icons
    if (category.toLowerCase().includes('command') || category.toLowerCase().includes('trick') || category.toLowerCase().includes('clicker')) {
      return <Target className="h-5 w-5" />;
    } else if (category.toLowerCase().includes('exercise') || category.toLowerCase().includes('goals')) {
      return <Dumbbell className="h-5 w-5" />;
    } else {
      return <Brain className="h-5 w-5" />; // For behavioral training
    }
  };

  const getCategoryType = (step: TrainingStep): 'basic' | 'exercise' | 'behavioral' => {
    // Use explicit type field if available
    if (step.type && ['basic', 'exercise', 'behavioral'].includes(step.type)) {
      return step.type as 'basic' | 'exercise' | 'behavioral';
    }
    
    // Fallback to keyword matching
    const category = step.category.toLowerCase();
    if (category.includes('command') || category.includes('trick') || category.includes('clicker') || category.includes('enrichment')) {
      return 'basic';
    } else if (category.includes('exercise') || category.includes('goals')) {
      return 'exercise';
    } else {
      return 'behavioral';
    }
  };

  const calculateStepProgress = (stepId: string, checkpoints: string[]) => {
    const stepProgress = trainingProgress[stepId] || [];
    const completedCount = stepProgress.filter(cp => cp.completed).length;
    return (completedCount / checkpoints.length) * 100;
  };

  const calculateCategoryProgress = (categoryType: 'basic' | 'exercise' | 'behavioral') => {
    const relevantSteps = trainingSteps.filter(step => getCategoryType(step) === categoryType);
    if (relevantSteps.length === 0) return 0;
    
    let totalProgress = 0;
    relevantSteps.forEach((step) => {
      const stepId = `step-${trainingSteps.indexOf(step)}`;
      const stepProgress = calculateStepProgress(stepId, step.checkpoints);
      totalProgress += stepProgress;
    });
    
    return Math.round(totalProgress / relevantSteps.length);
  };

  const getCategoryLabel = (categoryType: 'basic' | 'exercise' | 'behavioral') => {
    switch (categoryType) {
      case 'basic': return 'Basic Commands';
      case 'exercise': return 'Exercise Goals';
      case 'behavioral': return 'Behavioral Training';
      default: return 'Training';
    }
  };

  // Check if training details need to be refreshed
  const hasObjectStringIssue = pet.trainingDetails?.some(detail => 
    typeof detail === 'string' && detail === '[object Object]'
  );

  if (!pet.trainingDetails || !Array.isArray(pet.trainingDetails) || pet.trainingDetails.length === 0) {
    return (
      <Card className="p-6">
        <p className="text-muted-foreground text-center">
          No training information available yet. Upload a photo of your pet to get personalized training recommendations.
        </p>
      </Card>
    );
  }

  if (hasObjectStringIssue) {
    return (
      <Card className="p-6">
        <div className="text-center space-y-4">
          <p className="text-muted-foreground">
            Training details are being processed. Please refresh the page in a moment.
          </p>
          <Button 
            onClick={() => window.location.reload()} 
            variant="outline"
          >
            Refresh Page
          </Button>
        </div>
      </Card>
    );
  }

  // Initialize training progress from saved data
  useEffect(() => {
    if (pet.trainingProgress && typeof pet.trainingProgress === 'string') {
      try {
        const savedProgress = JSON.parse(pet.trainingProgress);
        if (savedProgress && typeof savedProgress === 'object') {
          setTrainingProgress(savedProgress);
        }
      } catch (error) {
        console.warn('Failed to parse saved training progress:', error);
      }
    }
  }, [pet.trainingProgress]);

  // Parse training details - handle both string and object formats
  const trainingSteps: TrainingStep[] = pet.trainingDetails.map((detail: any, index: number) => {
    // Handle case where detail is already an object
    if (typeof detail === 'object' && detail !== null) {
      return {
        category: detail.category || `Category ${index + 1}`,
        step: detail.step || `Training Step ${index + 1}`,
        description: detail.description || "No description available",
        duration: detail.duration || "Not specified",
        prerequisites: Array.isArray(detail.prerequisites) ? detail.prerequisites : [],
        difficulty: detail.difficulty || "Beginner", 
        checkpoints: Array.isArray(detail.checkpoints) ? detail.checkpoints : ["Complete this task"],
        tips: Array.isArray(detail.tips) ? detail.tips : []
      };
    }
    
    // Handle string format (try to parse as JSON)
    if (typeof detail === 'string') {
      // Skip if it's just "[object Object]" string
      if (detail === '[object Object]') {
        return {
          category: `Category ${index + 1}`,
          step: `Training Step ${index + 1}`,
          description: "Training details are being processed. Please refresh the page.",
          duration: "Not specified",
          prerequisites: [],
          difficulty: "Beginner",
          checkpoints: ["Complete this task"],
          tips: []
        };
      }
      
      try {
        const parsed = JSON.parse(detail);
        return {
          category: parsed.category || `Category ${index + 1}`,
          step: parsed.step || `Training Step ${index + 1}`,
          type: parsed.type,
          description: parsed.description || detail,
          duration: parsed.duration || "Not specified",
          prerequisites: Array.isArray(parsed.prerequisites) ? parsed.prerequisites : [],
          difficulty: parsed.difficulty || "Beginner",
          checkpoints: Array.isArray(parsed.checkpoints) ? parsed.checkpoints : ["Complete this task"],
          tips: Array.isArray(parsed.tips) ? parsed.tips : []
        };
      } catch {
        // If parsing fails, treat as simple text
        return {
          category: `Category ${index + 1}`,
          step: `Training Step ${index + 1}`,
          description: detail,
          duration: "Not specified",
          prerequisites: [],
          difficulty: "Beginner",
          checkpoints: ["Complete this task"],
          tips: []
        };
      }
    }
    
    // Fallback for any other type
    return {
      category: `Category ${index + 1}`,
      step: `Training Step ${index + 1}`,
      description: "Training details unavailable",
      duration: "Not specified",
      prerequisites: [],
      difficulty: "Beginner", 
      checkpoints: ["Complete this task"],
      tips: []
    };
  });

  return (
    <Card className="p-6">
      <h3 className="text-2xl font-semibold mb-4">Interactive Training Guide</h3>
      {pet.trainingLevel && (
        <p className="text-muted-foreground mb-6">
          <span className="font-medium">Current Level: </span>
          {pet.trainingLevel}
        </p>
      )}
      
      {/* Progress Overview */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold mb-4">Training Progress Overview</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['basic', 'exercise', 'behavioral'] as const).map((categoryType) => {
            const progress = calculateCategoryProgress(categoryType);
            return (
              <div key={categoryType} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {categoryType === 'basic' && <Target className="h-4 w-4" />}
                    {categoryType === 'exercise' && <Dumbbell className="h-4 w-4" />}
                    {categoryType === 'behavioral' && <Brain className="h-4 w-4" />}
                    <span className="text-sm font-medium">{getCategoryLabel(categoryType)}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" data-testid={`progress-${categoryType}`} />
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <ScrollArea className="h-[600px] pr-4">
            <Accordion type="single" collapsible className="space-y-4">
              {trainingSteps.map((step, index) => {
                const stepProgress = calculateStepProgress(`step-${index}`, step.checkpoints);
                return (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="hover:no-underline">
                      <div className="flex items-center gap-3 w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            {getIcon(step.category)}
                            <Badge variant="outline" className="text-xs">
                              {step.category}
                            </Badge>
                          </div>
                          <span className="text-left font-medium">{step.step}</span>
                        </div>
                        <Badge variant={stepProgress === 100 ? "default" : "secondary"}>
                          {stepProgress === 100 ? (
                            <CheckCircle2 className="h-4 w-4" />
                          ) : (
                            `${Math.round(stepProgress)}%`
                          )}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <p className="text-muted-foreground">{step.description}</p>

                        <div>
                          <Badge variant="outline">{step.difficulty}</Badge>
                          <span className="ml-2 text-sm text-muted-foreground">
                            Estimated time: {step.duration}
                          </span>
                        </div>

                        {step.prerequisites.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Prerequisites:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {step.prerequisites.map((prereq, idx) => (
                                <li key={idx} className="text-muted-foreground text-sm">
                                  {prereq}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <div>
                          <h5 className="font-medium mb-2">Progress Checkpoints:</h5>
                          <div className="space-y-2">
                            {step.checkpoints.map((checkpoint, idx) => (
                              <div key={idx} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`checkpoint-${index}-${idx}`}
                                  checked={trainingProgress[`step-${index}`]?.find(
                                    cp => cp.checkpoint === checkpoint
                                  )?.completed}
                                  onCheckedChange={() => toggleCheckpoint(`step-${index}`, checkpoint)}
                                />
                                <label
                                  htmlFor={`checkpoint-${index}-${idx}`}
                                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                  {checkpoint}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>

                        {step.tips.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2">Training Tips:</h5>
                            <ul className="list-disc pl-5 space-y-1">
                              {step.tips.map((tip, idx) => (
                                <li key={idx} className="text-muted-foreground text-sm">
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        <Progress value={stepProgress} className="mt-2" />
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
            Training Tutorial Videos
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
                    src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=0`}
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

      {pet.exerciseNeeds && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Exercise Requirements</h4>
          <p className="text-muted-foreground">{pet.exerciseNeeds}</p>
          {pet.exerciseSchedule && (
            <p className="text-muted-foreground mt-2">
              <span className="font-medium">Recommended Schedule:</span> {pet.exerciseSchedule}
            </p>
          )}
          {pet.exerciseDuration && (
            <p className="text-muted-foreground mt-2">
              <span className="font-medium">Recommended Duration:</span> {pet.exerciseDuration}
            </p>
          )}
        </div>
      )}
    </Card>
  );
}