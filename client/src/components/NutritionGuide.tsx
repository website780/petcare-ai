import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Pet, Reminder } from "@shared/schema";
import { Apple, Clock, AlertTriangle, Cookie, Utensils, Bell, Plus, Edit2, Check, X } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {format, isAfter, isBefore, parseISO, addMinutes} from 'date-fns';

interface FeedingTimeFormData {
  time: string;
  mealName: string;
}

interface EditReminderTimeData {
  time: string;
}

interface NutritionAnalysisFormData {
  breed: string;
  weight: number;
  activityLevel: string;
  age?: number;
}

interface NutritionAnalysisResult {
  dailyCalories: number;
  protein: {
    grams: number;
    percentage: number;
    sources: string[];
  };
  fats: {
    grams: number;
    percentage: number;
    sources: string[];
  };
  carbohydrates: {
    grams: number;
    percentage: number;
    sources: string[];
  };
  recommendedFoods: Array<{
    productName: string;
    brand: string;
    dailyAmount: string;
    caloriesPerServing: number;
    proteinContent: string;
    fatContent: string;
    reasons: string;
  }>;
  feedingSchedule: string;
  specialConsiderations: string;
  supplementRecommendations: string[];
  warningFoods: string[];
}

interface FoodRecommendation {
  productName: string;
  brand: string;
  category: string;
  activeIngredients: string[];
  benefits: string;
  feedingGuide?: string;
  specialNotes?: string;
}

// Convert OpenAI generated food recommendations to display format
const formatFoodRecommendations = (pet: Pet): FoodRecommendation[] => {
  if (!pet.foodRecommendations || !Array.isArray(pet.foodRecommendations)) {
    return [{
      productName: 'Consult Veterinarian',
      brand: 'Professional Guidance',
      category: 'Specialized',
      activeIngredients: ['Species-specific nutrients'],
      benefits: 'Please consult with a veterinarian for personalized nutrition recommendations for your pet.',
      feedingGuide: 'Follow veterinary guidance',
      specialNotes: 'Nutrition recommendations will be generated when you create a new pet profile'
    }];
  }

  // Check if foodRecommendations contains structured data (from OpenAI) or simple strings (from legacy)
  if (typeof pet.foodRecommendations[0] === 'string') {
    // Try to parse as JSON first (new OpenAI format)
    try {
      const firstRecommendation = JSON.parse(pet.foodRecommendations[0]);
      if (firstRecommendation && typeof firstRecommendation === 'object' && firstRecommendation.productName) {
        // This is serialized structured data from OpenAI - parse all items
        return pet.foodRecommendations.map((food: string) => JSON.parse(food) as FoodRecommendation);
      }
    } catch (e) {
      // Not JSON, treat as legacy string format
    }
    
    // Legacy format - convert strings to recommendation objects
    return pet.foodRecommendations.map((food: string, index: number) => ({
      productName: food,
      brand: 'Veterinary Recommended',
      category: 'General',
      activeIngredients: ['Various nutrients'],
      benefits: 'Provides balanced nutrition appropriate for your pet species.',
      feedingGuide: 'Follow package instructions',
      specialNotes: index === 0 ? 'For detailed recommendations, create a new pet profile to get AI-generated nutrition plans' : undefined
    }));
  }

  // Direct structured data from OpenAI (shouldn't happen with current implementation)
  return pet.foodRecommendations as unknown as FoodRecommendation[];
};

export function NutritionGuide({ pet }: { pet: Pet }) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);
  const [editingReminderId, setEditingReminderId] = useState<number | null>(null);
  const [lastNotificationCheck, setLastNotificationCheck] = useState<Date>(new Date());
  const [isNutritionDialogOpen, setIsNutritionDialogOpen] = useState(false);
  const [nutritionAnalysis, setNutritionAnalysis] = useState<NutritionAnalysisResult | null>((pet as any).nutritionAnalysis || null);

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: [`/api/pets/${pet.id}/reminders`],
  });

  // Check for due reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach((reminder: Reminder) => {
        if (reminder.dueTime) {
          // dueTime is format HH:mm, need to parse manually for safety
          const [hours, minutes] = reminder.dueTime.split(':').map(Number);
          const dueTime = new Date();
          dueTime.setHours(hours, minutes, 0, 0);
          
          const diffInMinutes = Math.abs((now.getTime() - dueTime.getTime()) / (1000 * 60));
          
          // Check if reminder is due (within 1 minute window)
          if (diffInMinutes <= 1 && !reminder.completed && (reminder.title?.toLowerCase().includes('feeding') || reminder.type === 'feeding')) {
            toast({
              title: "Feeding Time!",
              description: `Time to feed ${pet.name} - ${reminder.title}`,
              duration: 10000,
            });
          }
        }
      });
      setLastNotificationCheck(now);
    };

    // Check immediately and then every minute
    checkReminders();
    const interval = setInterval(checkReminders, 60000);
    return () => clearInterval(interval);
  }, [reminders, toast, pet.name, lastNotificationCheck]);

  const form = useForm<FeedingTimeFormData>({
    defaultValues: {
      time: "",
      mealName: "",
    },
  });

  const editForm = useForm<EditReminderTimeData>({
    defaultValues: {
      time: "",
    },
  });

  const nutritionForm = useForm<NutritionAnalysisFormData>({
    defaultValues: {
      breed: pet.breed || "",
      weight: 0,
      activityLevel: "moderate",
      age: undefined,
    },
  });

  const addFeedingTime = useMutation({
    mutationFn: async (data: FeedingTimeFormData) => {
      const response = await apiRequest("POST", `/api/pets/${pet.id}/reminders`, {
        type: "feeding",
        title: `Feeding: ${data.mealName}`,
        dueTime: data.time,
        dueDate: new Date().toISOString(),
        userId: pet.userId,
      });
      if (!response.ok) throw new Error('Failed to add feeding time');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}/reminders`] });
      toast({ title: "Feeding time added successfully" });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error adding feeding time",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateReminderTime = useMutation({
    mutationFn: async (data: EditReminderTimeData) => {
      if (!editingReminderId) throw new Error('No reminder selected');
      const response = await apiRequest("PUT", `/api/pets/${pet.id}/reminders/${editingReminderId}`, {
        dueTime: data.time,
      });
      if (!response.ok) throw new Error('Failed to update reminder time');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}/reminders`] });
      toast({ title: "Feeding time updated successfully" });
      setEditingReminderId(null);
      editForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error updating feeding time",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const markComplete = useMutation({
    mutationFn: async (reminderId: number) => {
      const response = await apiRequest("PUT", `/api/pets/${pet.id}/reminders/${reminderId}`, {
        completed: true,
      });
      if (!response.ok) throw new Error('Failed to mark reminder as complete');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}/reminders`] });
      toast({ title: "Feeding marked as complete" });
    },
  });

  const deleteReminder = useMutation({
    mutationFn: async (reminderId: number) => {
      const response = await apiRequest("DELETE", `/api/pets/${pet.id}/reminders/${reminderId}`);
      if (!response.ok) throw new Error('Failed to delete reminder');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}/reminders`] });
      toast({ title: "Feeding time removed" });
    },
  });

  const analyzeNutrition = useMutation({
    mutationFn: async (data: NutritionAnalysisFormData) => {
      const response = await apiRequest("POST", "/api/nutrition/analyze", {
        breed: data.breed,
        weight: data.weight,
        activityLevel: data.activityLevel,
        species: pet.species,
        age: data.age,
      });
      if (!response.ok) throw new Error('Failed to analyze nutrition');
      return response.json();
    },
    onSuccess: async (result) => {
      setNutritionAnalysis(result);
      
      // Persist to pet profile
      try {
        await apiRequest("PATCH", `/api/pets/${pet.id}`, {
          nutritionAnalysis: result
        });
        queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}`] });
      } catch (err) {
        console.error("Failed to save nutrition analysis:", err);
      }

      toast({ title: "AI nutrition analysis completed!" });
      setIsNutritionDialogOpen(false);
    },
    onError: (error) => {
      toast({
        title: "Error analyzing nutrition",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Group feeding reminders by completed status and sort by time
  const feedingReminders = useMemo(() => {
    return reminders
      .filter((reminder: Reminder) => reminder.title?.toLowerCase().includes('feeding'))
      .sort((a: Reminder, b: Reminder) => {
        if (a.dueTime && b.dueTime) {
          return a.dueTime.localeCompare(b.dueTime);
        }
        return 0;
      });
  }, [reminders]);

  const pendingReminders = feedingReminders.filter(r => !r.completed);
  const completedReminders = feedingReminders.filter(r => r.completed);

  const nutritionalInfo = useMemo(() => {
    if (!pet.nutritionalNeeds || !pet.foodRecommendations) {
      return {
        dailyCalories: "Contact your veterinarian",
        proteinNeeds: "Varies by species",
        feedingFrequency: "2-3 times daily",
        specialDiet: "Consult with vet"
      };
    }

    return {
      dailyCalories: "Based on age, weight, and activity level",
      proteinNeeds: pet.nutritionalNeeds.join(", "),
      feedingFrequency: pet.feedingSchedule || "2-3 times daily",
      specialDiet: pet.foodRestrictions && pet.foodRestrictions.length > 0 ? pet.foodRestrictions.join(", ") : "None specified"
    };
  }, [pet]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Nutrition Guide</h3>
        <div className="flex gap-2">
          <Dialog open={isNutritionDialogOpen} onOpenChange={setIsNutritionDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Apple className="w-4 h-4 mr-2" />
                AI Nutrition Analysis
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Personalized Nutrition Analysis</DialogTitle>
              </DialogHeader>
              <Form {...nutritionForm}>
                <form
                  onSubmit={nutritionForm.handleSubmit((data) => analyzeNutrition.mutate(data))}
                  className="space-y-4"
                >
                  <FormField
                    control={nutritionForm.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Breed</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Golden Retriever, Persian Cat" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={nutritionForm.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (lbs)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="0" 
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={nutritionForm.control}
                    name="activityLevel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Activity Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select activity level" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="sedentary">Sedentary (Couch potato)</SelectItem>
                            <SelectItem value="moderate">Moderate (Regular walks)</SelectItem>
                            <SelectItem value="active">Active (Daily exercise)</SelectItem>
                            <SelectItem value="very-active">Very Active (Working dog/athlete)</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={nutritionForm.control}
                    name="age"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Age (years, optional)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Optional"
                            {...field}
                            onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button type="submit" disabled={analyzeNutrition.isPending} className="w-full">
                    {analyzeNutrition.isPending ? "Analyzing..." : "Get AI Nutrition Plan"}
                  </Button>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Feeding Time
              </Button>
            </DialogTrigger>
            <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Feeding Time</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit((data) => addFeedingTime.mutate(data))}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="mealName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Meal Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Breakfast, Lunch, Dinner" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Time</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={addFeedingTime.isPending}>
                  {addFeedingTime.isPending ? "Adding..." : "Add Feeding Time"}
                </Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* AI Nutrition Analysis Results */}
      {nutritionAnalysis && (
        <Card className="border-none shadow-[0_8px_32px_rgba(37,99,235,0.1)] overflow-hidden rounded-[2rem] bg-gradient-to-tr from-blue-50 to-indigo-50">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500" />
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Apple className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-2xl font-black text-blue-900 tracking-tight">AI Precision Plan</h4>
                <p className="text-sm font-medium text-blue-700/70">Customized for {pet.name}</p>
              </div>
            </div>
            
            <div className="grid gap-6 md:grid-cols-3 mb-8">
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Daily Target</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-blue-900">{nutritionAnalysis.dailyCalories}</span>
                  <span className="text-xs font-bold text-blue-700 mb-1.5 ml-1">kcal</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Protein Focus</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-blue-900">{nutritionAnalysis.protein.grams}g</span>
                  <span className="text-xs font-bold text-[#ff6b4a] mb-1.5 ml-1">{nutritionAnalysis.protein.percentage}%</span>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-5 rounded-2xl border border-white shadow-sm flex flex-col gap-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600">Healthy Fats</p>
                <div className="flex items-end gap-1">
                  <span className="text-3xl font-black text-blue-900">{nutritionAnalysis.fats.grams}g</span>
                  <span className="text-xs font-bold text-emerald-600 mb-1.5 ml-1">{nutritionAnalysis.fats.percentage}%</span>
                </div>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full space-y-4 border-none">
              <AccordionItem value="recommended-foods" className="border border-blue-100 rounded-2xl bg-white/50 overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline font-black text-blue-900">Recommended Selection</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pb-4">
                    {nutritionAnalysis.recommendedFoods.map((food, index) => (
                      <div key={index} className="p-4 bg-white rounded-xl border border-blue-50 shadow-sm flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h6 className="font-black text-base text-blue-900">{food.productName}</h6>
                            <Badge className="bg-blue-100 text-blue-700 text-[9px] uppercase font-black tracking-widest hover:bg-blue-100 border-none">{food.brand}</Badge>
                          </div>
                          <p className="text-xs font-medium text-gray-600 leading-relaxed mb-3">{food.reasons}</p>
                          <div className="flex gap-4">
                            <div className="px-2 py-1 bg-muted/40 rounded-lg text-[10px] font-bold">Protein: {food.proteinContent}</div>
                            <div className="px-2 py-1 bg-muted/40 rounded-lg text-[10px] font-bold">Fat: {food.fatContent}</div>
                          </div>
                        </div>
                        <div className="sm:text-right flex flex-col justify-center bg-blue-50/50 p-3 rounded-xl min-w-[120px]">
                          <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-1">Daily Qty</p>
                          <p className="text-base font-black text-blue-900">{food.dailyAmount}</p>
                          <p className="text-[10px] font-bold text-blue-700/60">{food.caloriesPerServing} cal / svg</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="macronutrients" className="border border-blue-100 rounded-2xl bg-white/50 overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline font-black text-blue-900">Optimal Sources</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 md:grid-cols-3 pb-4">
                    <div className="bg-white p-4 rounded-xl border border-blue-50">
                      <h6 className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a] mb-3">Proteins</h6>
                      <ul className="space-y-2">
                        {nutritionAnalysis.protein.sources.map((source, index) => (
                          <li key={index} className="text-xs font-bold flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-[#ff6b4a]" /> {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-blue-50">
                      <h6 className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-3">Fats</h6>
                      <ul className="space-y-2">
                        {nutritionAnalysis.fats.sources.map((source, index) => (
                          <li key={index} className="text-xs font-bold flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-emerald-500" /> {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-blue-50">
                      <h6 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-3">Carbs</h6>
                      <ul className="space-y-2">
                        {nutritionAnalysis.carbohydrates.sources.map((source, index) => (
                          <li key={index} className="text-xs font-bold flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full bg-blue-500" /> {source}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="feeding-schedule" className="border border-blue-100 rounded-2xl bg-white/50 overflow-hidden px-4">
                <AccordionTrigger className="hover:no-underline font-black text-blue-900">Feeding Strategy</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4 pb-4">
                    <div className="bg-white p-5 rounded-xl border border-blue-50">
                      <h6 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Protocol</h6>
                      <p className="text-xs font-medium leading-relaxed">{nutritionAnalysis.feedingSchedule}</p>
                    </div>
                    
                    {nutritionAnalysis.specialConsiderations && (
                      <div className="bg-white p-5 rounded-xl border border-blue-50">
                        <h6 className="text-[10px] font-black uppercase tracking-widest text-violet-600 mb-2">Considerations</h6>
                        <p className="text-xs font-medium leading-relaxed">{nutritionAnalysis.specialConsiderations}</p>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {nutritionAnalysis.supplementRecommendations.length > 0 && (
                          <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-100">
                            <h6 className="text-[10px] font-black uppercase tracking-widest text-emerald-700 mb-3">Supplements</h6>
                            <ul className="space-y-2">
                              {nutritionAnalysis.supplementRecommendations.map((supplement, index) => (
                                <li key={index} className="text-xs font-bold text-emerald-800 flex items-start gap-2">
                                  <span className="text-emerald-400">•</span> {supplement}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        
                        {nutritionAnalysis.warningFoods.length > 0 && (
                          <div className="bg-red-50 p-5 rounded-xl border border-red-100">
                            <h6 className="text-[10px] font-black uppercase tracking-widest text-red-700 mb-3">Health Hazards</h6>
                            <ul className="space-y-2">
                              {nutritionAnalysis.warningFoods.map((food, index) => (
                                <li key={index} className="text-xs font-bold text-red-800 flex items-start gap-2">
                                  <span className="text-red-400">•</span> {food}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-8 md:grid-cols-2">
        {/* Nutritional Information */}
        <Card className="border border-black/[0.04] shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-8">
               <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <Apple className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black tracking-tight">Standard Profile</h4>
            </div>
            <div className="space-y-4">
              {[
                { label: "Daily Target", value: nutritionalInfo.dailyCalories, icon: "🔥" },
                { label: "Essential Protein", value: nutritionalInfo.proteinNeeds, icon: "🥩" },
                { label: "Cycle", value: nutritionalInfo.feedingFrequency, icon: "🕒" },
                { label: "Dietary Flags", value: nutritionalInfo.specialDiet, icon: "⚠️" }
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-black/[0.02] border border-black/[0.02]">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-black text-right max-w-[150px] leading-tight">{item.value}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Food Recommendations */}
        <Card className="border border-black/[0.04] shadow-sm rounded-3xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <div className="flex items-center gap-4 mb-3">
               <div className="w-12 h-12 rounded-2xl bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20">
                <Cookie className="w-6 h-6" />
              </div>
              <h4 className="text-xl font-black tracking-tight">Top Formula Picks</h4>
            </div>
            <ScrollArea className="h-[500px] -mx-2 px-2">
              <div className="space-y-4">
                {formatFoodRecommendations(pet).map((food, index) => (
                  <div key={index} className="p-5 border border-black/[0.04] rounded-2xl bg-black/[0.01] hover:bg-white hover:shadow-md transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h5 className="font-black text-base text-gray-900 mb-0.5">{food.productName}</h5>
                        <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">{food.brand}</p>
                      </div>
                      <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-black/[0.1]">{food.category}</Badge>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-start gap-2">
                         <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1" />
                         <p className="text-xs font-medium text-emerald-800 leading-relaxed">
                            {food.benefits}
                         </p>
                      </div>
                      
                      {food.feedingGuide && (
                        <div className="bg-white/50 p-2 rounded-lg border border-black/[0.02] text-[10px] font-bold text-gray-500">
                          <span className="uppercase tracking-widest opacity-60 mr-1">Guide:</span> {food.feedingGuide}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* Feeding Schedule */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <Clock className="w-6 h-6 mr-3 text-blue-600" />
              <h4 className="text-lg font-semibold">Feeding Schedule</h4>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingSchedule(!isEditingSchedule)}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              {isEditingSchedule ? "Done Editing" : "Edit Schedule"}
            </Button>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {/* Pending Reminders */}
            {pendingReminders.length > 0 && (
              <AccordionItem value="pending">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <Bell className="w-4 h-4 mr-2 text-orange-500" />
                    Upcoming Meals ({pendingReminders.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {pendingReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-gray-500" />
                          <div>
                            <div className="font-medium">{reminder.title}</div>
                             <div className="text-sm text-gray-500">
                               {reminder.dueTime || 'No time set'}
                             </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {isEditingSchedule && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setEditingReminderId(reminder.id);
                                  if (reminder.dueTime) {
                                    const time = format(parseISO(reminder.dueTime), 'HH:mm');
                                    editForm.setValue('time', time);
                                  }
                                }}
                              >
                                <Edit2 className="w-3 h-3" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => deleteReminder.mutate(reminder.id)}
                              >
                                <X className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => markComplete.mutate(reminder.id)}
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Inline editing form */}
                  {editingReminderId && (
                    <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                      <Form {...editForm}>
                        <form
                          onSubmit={editForm.handleSubmit((data) => updateReminderTime.mutate(data))}
                          className="flex items-center space-x-2"
                        >
                          <FormField
                            control={editForm.control}
                            name="time"
                            render={({ field }) => (
                              <FormItem className="flex-1">
                                <FormControl>
                                  <Input type="time" {...field} />
                                </FormControl>
                              </FormItem>
                            )}
                          />
                          <Button type="submit" size="sm">
                            Update
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingReminderId(null)}
                          >
                            Cancel
                          </Button>
                        </form>
                      </Form>
                    </div>
                  )}
                </AccordionContent>
              </AccordionItem>
            )}

            {/* Completed Reminders */}
            {completedReminders.length > 0 && (
              <AccordionItem value="completed">
                <AccordionTrigger className="text-left">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2 text-green-500" />
                    Completed Today ({completedReminders.length})
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2">
                    {completedReminders.map((reminder) => (
                      <div key={reminder.id} className="flex items-center p-2 text-sm bg-green-50 rounded">
                        <Check className="w-3 h-3 mr-2 text-green-500" />
                        <span className="line-through text-gray-500">{reminder.title}</span>
                        <span className="ml-auto text-gray-400">
                          {reminder.dueTime ? format(parseISO(reminder.dueTime), 'HH:mm') : ''}
                        </span>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            )}
          </Accordion>

          {pendingReminders.length === 0 && completedReminders.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No feeding schedule set up yet.</p>
              <p className="text-sm">Add your first feeding time to get started!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Food Restrictions & Allergies */}
      {pet.foodRestrictions && pet.foodRestrictions.length > 0 && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <AlertTriangle className="w-6 h-6 mr-3 text-red-600" />
              <h4 className="text-lg font-semibold">Food Restrictions & Allergies</h4>
            </div>
            <div className="grid gap-2 md:grid-cols-2">
              {pet.foodRestrictions.map((restriction, index) => (
                <div key={index} className="flex items-center p-2 bg-red-50 rounded-lg">
                  <AlertTriangle className="w-4 h-4 mr-2 text-red-500" />
                  <span className="text-sm font-medium">{restriction}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}