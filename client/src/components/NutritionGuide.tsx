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
  const [nutritionAnalysis, setNutritionAnalysis] = useState<NutritionAnalysisResult | null>(null);

  const { data: reminders = [] } = useQuery<Reminder[]>({
    queryKey: [`/api/pets/${pet.id}/reminders`],
  });

  // Check for due reminders every minute
  useEffect(() => {
    const checkReminders = () => {
      const now = new Date();
      reminders.forEach((reminder: Reminder) => {
        if (reminder.dueTime) {
          const dueTime = parseISO(reminder.dueTime);
          const diffInMinutes = Math.abs((now.getTime() - dueTime.getTime()) / (1000 * 60));
          
          // Check if reminder is due (within 1 minute window)
          if (diffInMinutes <= 1 && !reminder.completed && reminder.title.toLowerCase().includes('feeding')) {
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
        title: data.mealName,
        dueTime: data.time,
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
    onSuccess: (result) => {
      setNutritionAnalysis(result);
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
      .filter((reminder: Reminder) => reminder.title.toLowerCase().includes('feeding'))
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
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Apple className="w-6 h-6 mr-3 text-blue-600" />
              <h4 className="text-lg font-semibold text-blue-900">AI Nutrition Analysis Results</h4>
            </div>
            
            <div className="grid gap-4 md:grid-cols-3 mb-6">
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-sm mb-2">Daily Calories</h5>
                <p className="text-2xl font-bold text-blue-600">{nutritionAnalysis.dailyCalories}</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-sm mb-2">Protein</h5>
                <p className="text-lg font-semibold">{nutritionAnalysis.protein.grams}g ({nutritionAnalysis.protein.percentage}%)</p>
              </div>
              <div className="bg-white p-4 rounded-lg border">
                <h5 className="font-semibold text-sm mb-2">Fats</h5>
                <p className="text-lg font-semibold">{nutritionAnalysis.fats.grams}g ({nutritionAnalysis.fats.percentage}%)</p>
              </div>
            </div>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="recommended-foods">
                <AccordionTrigger>Recommended Foods</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">
                    {nutritionAnalysis.recommendedFoods.map((food, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h6 className="font-semibold">{food.productName}</h6>
                            <p className="text-sm text-blue-600">{food.brand}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{food.dailyAmount}</p>
                            <p className="text-xs text-gray-500">{food.caloriesPerServing} cal/serving</p>
                          </div>
                        </div>
                        <p className="text-sm text-gray-700">{food.reasons}</p>
                        <div className="flex gap-4 mt-2 text-xs text-gray-600">
                          <span>Protein: {food.proteinContent}</span>
                          <span>Fat: {food.fatContent}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="macronutrients">
                <AccordionTrigger>Detailed Macronutrients</AccordionTrigger>
                <AccordionContent>
                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="bg-white p-4 rounded-lg border">
                      <h6 className="font-semibold mb-2">Protein Sources</h6>
                      <ul className="text-sm space-y-1">
                        {nutritionAnalysis.protein.sources.map((source, index) => (
                          <li key={index}>• {source}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h6 className="font-semibold mb-2">Fat Sources</h6>
                      <ul className="text-sm space-y-1">
                        {nutritionAnalysis.fats.sources.map((source, index) => (
                          <li key={index}>• {source}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-white p-4 rounded-lg border">
                      <h6 className="font-semibold mb-2">Carbohydrate Sources</h6>
                      <ul className="text-sm space-y-1">
                        {nutritionAnalysis.carbohydrates.sources.map((source, index) => (
                          <li key={index}>• {source}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
              
              <AccordionItem value="feeding-schedule">
                <AccordionTrigger>Feeding Schedule & Notes</AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-lg border">
                      <h6 className="font-semibold mb-2">Feeding Schedule</h6>
                      <p className="text-sm">{nutritionAnalysis.feedingSchedule}</p>
                    </div>
                    
                    {nutritionAnalysis.specialConsiderations && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h6 className="font-semibold mb-2">Special Considerations</h6>
                        <p className="text-sm">{nutritionAnalysis.specialConsiderations}</p>
                      </div>
                    )}
                    
                    {nutritionAnalysis.supplementRecommendations.length > 0 && (
                      <div className="bg-white p-4 rounded-lg border">
                        <h6 className="font-semibold mb-2">Supplement Recommendations</h6>
                        <ul className="text-sm space-y-1">
                          {nutritionAnalysis.supplementRecommendations.map((supplement, index) => (
                            <li key={index}>• {supplement}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    
                    {nutritionAnalysis.warningFoods.length > 0 && (
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <h6 className="font-semibold mb-2 text-red-800">Foods to Avoid</h6>
                        <ul className="text-sm space-y-1 text-red-700">
                          {nutritionAnalysis.warningFoods.map((food, index) => (
                            <li key={index}>• {food}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        {/* Nutritional Information */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Apple className="w-6 h-6 mr-3 text-green-600" />
              <h4 className="text-lg font-semibold">Nutritional Needs</h4>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Daily Calories:</span>
                <span className="text-sm">{nutritionalInfo.dailyCalories}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Protein Needs:</span>
                <span className="text-sm">{nutritionalInfo.proteinNeeds}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Feeding Frequency:</span>
                <span className="text-sm">{nutritionalInfo.feedingFrequency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Special Diet:</span>
                <span className="text-sm">{nutritionalInfo.specialDiet}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Food Recommendations */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center mb-4">
              <Cookie className="w-6 h-6 mr-3 text-orange-600" />
              <h4 className="text-lg font-semibold">Recommended Foods</h4>
            </div>
            <ScrollArea className="h-80">
              <div className="space-y-4">
                {formatFoodRecommendations(pet).map((food, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-gray-50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h5 className="font-semibold text-sm text-gray-900">{food.productName}</h5>
                        <p className="text-xs text-blue-600 font-medium">{food.brand}</p>
                      </div>
                      <div className="text-xs text-gray-500">{food.category}</div>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-xs text-gray-600 mb-1">
                        <strong>Key Ingredients:</strong> {food.activeIngredients.join(", ")}
                      </p>
                    </div>
                    
                    <div className="mb-2">
                      <p className="text-xs text-green-700">
                        <strong>Benefits:</strong> {food.benefits}
                      </p>
                    </div>
                    
                    {food.feedingGuide && (
                      <div className="text-xs text-gray-600">
                        <strong>Feeding Guide:</strong> {food.feedingGuide}
                      </div>
                    )}
                    
                    {food.specialNotes && (
                      <div className="mt-2 text-xs text-amber-700 bg-amber-50 p-2 rounded">
                        <strong>Note:</strong> {food.specialNotes}
                      </div>
                    )}
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
                              {reminder.dueTime ? format(parseISO(reminder.dueTime), 'HH:mm') : 'No time set'}
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