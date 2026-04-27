import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
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
    <div className="space-y-10">
      {/* Progress Overview */}
      <div className="bg-black/[0.02] border border-black/[0.04] p-6 md:p-8 rounded-[2rem]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-1">Training Mastery</h3>
            <p className="text-sm font-medium text-muted-foreground">
               Current Track: <span className="text-[#ff6b4a] font-black">{pet.trainingLevel || "Beginner"}</span>
            </p>
          </div>
          <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-white">
             <div className="flex -space-x-2">
                {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-[#ff6b4a]/10 flex items-center justify-center text-[10px] font-black">L{i}</div>)}
             </div>
             <span className="text-xs font-black uppercase tracking-widest text-[#ff6b4a]">Elite Series</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['basic', 'exercise', 'behavioral'] as const).map((categoryType) => {
            const progress = calculateCategoryProgress(categoryType);
            const colors = {
              basic: "from-blue-400 to-indigo-500",
              exercise: "from-orange-400 to-[#ff6b4a]",
              behavioral: "from-violet-400 to-purple-500"
            };
            return (
              <div key={categoryType} className="bg-white p-5 rounded-2xl border border-black/[0.04] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl bg-gradient-to-br ${colors[categoryType]} text-white shadow-lg shadow-black/5`}>
                      {categoryType === 'basic' && <Target className="h-4 w-4" />}
                      {categoryType === 'exercise' && <Dumbbell className="h-4 w-4" />}
                      {categoryType === 'behavioral' && <Brain className="h-4 w-4" />}
                    </div>
                    <span className="text-sm font-black tracking-tight">{getCategoryLabel(categoryType)}</span>
                  </div>
                  <span className="text-xs font-black text-muted-foreground">{progress}%</span>
                </div>
                <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`absolute inset-y-0 left-0 bg-gradient-to-r ${colors[categoryType]} transition-all duration-1000 ease-out`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="space-y-6">
          <h4 className="text-xl font-black tracking-tight flex items-center gap-2">
             <Award className="w-5 h-5 text-[#ff6b4a]" />
             Active Modules
          </h4>
          <ScrollArea className="h-[600px] -mx-1 px-1">
            <Accordion type="single" collapsible className="space-y-4 border-none">
              {trainingSteps.map((step, index) => {
                const stepId = `step-${index}`;
                const stepProgress = calculateStepProgress(stepId, step.checkpoints);
                const isComplete = stepProgress === 100;

                return (
                  <AccordionItem key={index} value={`item-${index}`} className="border border-black/[0.04] rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                    <AccordionTrigger className="px-5 py-4 hover:no-underline hover:bg-muted/30 group">
                      <div className="flex items-center gap-4 w-full">
                         <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isComplete ? 'bg-green-500 text-white' : 'bg-muted group-hover:bg-[#ff6b4a]/10 group-hover:text-[#ff6b4a]'}`}>
                            {isComplete ? <CheckCircle2 className="w-6 h-6" /> : getIcon(step.category)}
                         </div>
                         <div className="flex-1 text-left">
                            <div className="flex items-center gap-2 mb-0.5">
                               <span className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">{step.category}</span>
                               <Badge variant="outline" className="text-[9px] font-bold py-0 h-4">{step.difficulty}</Badge>
                            </div>
                            <span className="font-black text-base">{step.step}</span>
                         </div>
                         <div className="mr-2 text-right">
                             <div className="text-[10px] font-black text-muted-foreground uppercase">{isComplete ? "Mastered" : "Progress"}</div>
                             <div className={`text-sm font-black ${isComplete ? 'text-green-600' : 'text-foreground'}`}>
                                {Math.round(stepProgress)}%
                             </div>
                         </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-2 border-t border-black/[0.02]">
                      <div className="space-y-6">
                        <p className="text-xs font-medium text-muted-foreground leading-relaxed">
                            {step.description}
                        </p>

                        <div className="grid grid-cols-2 gap-4 p-3 rounded-xl bg-muted/30">
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase text-muted-foreground">Session Est.</span>
                                <span className="text-xs font-bold">{step.duration}</span>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-[9px] font-black uppercase text-muted-foreground">Focus Area</span>
                                <span className="text-xs font-bold">{step.category}</span>
                            </div>
                        </div>

                        <div className="space-y-3">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Module Checkpoints</h5>
                          <div className="space-y-2">
                            {step.checkpoints.map((checkpoint, idx) => {
                              const isCpDone = trainingProgress[stepId]?.find(cp => cp.checkpoint === checkpoint)?.completed;
                              return (
                                <button
                                  key={idx}
                                  onClick={() => toggleCheckpoint(stepId, checkpoint)}
                                  className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isCpDone ? 'bg-green-50/50 border-green-100' : 'bg-white border-black/[0.04] hover:border-[#ff6b4a]/50'}`}
                                >
                                  <div className={`w-5 h-5 rounded-md border flex-shrink-0 flex items-center justify-center transition-all ${isCpDone ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-black/10'}`}>
                                    {isCpDone && <CheckCircle2 className="h-3 w-3" />}
                                  </div>
                                  <span className={`text-xs font-bold ${isCpDone ? 'text-green-800 line-through opacity-70' : 'text-foreground'}`}>
                                    {checkpoint}
                                  </span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {step.tips.length > 0 && (
                          <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100">
                            <h5 className="text-[10px] font-black uppercase tracking-widest text-amber-700 mb-2">Pro Tips</h5>
                            <ul className="space-y-2">
                              {step.tips.map((tip, idx) => (
                                <li key={idx} className="text-[11px] font-medium text-amber-800 flex items-start gap-2">
                                  <span className="text-amber-400 mt-0.5">•</span>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </ScrollArea>
        </div>

        <div className="sticky top-4 space-y-6">
           <Card className="border border-black/[0.04] shadow-sm rounded-2xl overflow-hidden bg-black/[0.01]">
              <CardHeader className="p-5 pb-2">
                  <CardTitle className="text-lg font-black flex items-center gap-2">
                      <Video className="h-5 w-5 text-[#ff6b4a]" />
                      Training Masterclasses
                  </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                  {isLoadingVideos ? (
                      <div className="space-y-3">
                          {[1, 2, 3].map((n) => (
                              <div key={n} className="animate-pulse h-16 bg-muted rounded-xl" />
                          ))}
                      </div>
                  ) : videos.length > 0 ? (
                      <div className="space-y-4">
                          {selectedVideo && (
                              <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black shadow-lg">
                                  <iframe
                                      src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=0`}
                                      className="absolute top-0 left-0 w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                  />
                              </div>
                          )}
                          <ScrollArea className="h-[300px] -mx-1 px-1">
                              <div className="space-y-2">
                                  {videos.map((video) => (
                                      <button
                                          key={video.id}
                                          className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${selectedVideo === video.id ? 'bg-[#ff6b4a] text-white shadow-md' : 'hover:bg-white border border-transparent hover:border-black/[0.05]'}`}
                                          onClick={() => setSelectedVideo(video.id)}
                                      >
                                          <div className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${selectedVideo === video.id ? 'bg-white/20' : 'bg-muted'}`}>
                                            <Video className="h-4 w-4" />
                                          </div>
                                          <span className="text-xs font-bold line-clamp-2">{video.title}</span>
                                      </button>
                                  ))}
                              </div>
                          </ScrollArea>
                      </div>
                  ) : (
                      <div className="text-center py-10 px-4">
                           <p className="text-sm font-medium text-muted-foreground">Select a module to view tutorials.</p>
                      </div>
                  )}
              </CardContent>
           </Card>

           {pet.exerciseNeeds && (
            <div className="p-6 rounded-[2rem] bg-gradient-to-br from-[#ff6b4a] to-[#ff8f6b] text-white shadow-xl shadow-[#ff6b4a]/20">
              <div className="flex items-center gap-3 mb-4">
                 <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                    <Dumbbell className="w-5 h-5" />
                 </div>
                 <h4 className="text-lg font-black tracking-tight">Daily Exercise</h4>
              </div>
              <p className="text-sm font-medium leading-relaxed opacity-90 mb-4">{pet.exerciseNeeds}</p>
              <div className="grid grid-cols-2 gap-4">
                  <div className="bg-black/5 rounded-xl p-3">
                      <div className="text-[10px] font-black uppercase opacity-60">Daily Target</div>
                      <div className="text-sm font-black">{pet.exerciseDuration || "30-45m"}</div>
                  </div>
                  <div className="bg-black/5 rounded-xl p-3">
                      <div className="text-[10px] font-black uppercase opacity-60">Frequency</div>
                      <div className="text-sm font-black">{pet.exerciseSchedule || "2x Daily"}</div>
                  </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}