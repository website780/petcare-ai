import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Pet } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { TrainingTips } from "@/components/TrainingTips";
import { TrainingScheduler } from "@/components/TrainingScheduler";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function TrainingGuidePage() {
  const { id } = useParams();
  const { toast } = useToast();

  // Initialize training data when the page loads
  const initializeTraining = useMutation({
    mutationFn: async () => {
      console.log("Initializing training data for pet ID:", id);
      const response = await apiRequest("PATCH", `/api/pets/${id}`, {});
      if (!response.ok) {
        console.error("Failed to initialize training data:", await response.text());
        throw new Error('Failed to initialize training data');
      }
      return response.json();
    },
    onSuccess: (data) => {
      console.log("Successfully initialized training data:", data);
      // Invalidate and refetch pet data after initialization
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}`] });
      toast({ title: "Training data initialized successfully" });
    },
    onError: (error) => {
      console.error("Error initializing training data:", error);
      toast({
        variant: "destructive",
        title: "Failed to initialize training data",
      });
    },
  });

  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: [`/api/pets/${id}`],
    onSuccess: (data) => {
      console.log("Fetched pet data:", data);
      // Initialize training data if not present
      if (!data.trainingDetails || !data.exerciseNeeds) {
        console.log("Training data missing, initializing...");
        initializeTraining.mutate();
      }
    },
  });

  if (isLoading || !pet) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-3xl">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <Link href={`/pet/${id}`}>
            <Button variant="ghost" className="w-full sm:w-auto">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-2xl md:text-3xl">
              {pet.name}'s Training & Exercise Guide
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-6">
            <TrainingTips pet={pet} />
            <div className="mt-6">
              <TrainingScheduler pet={pet} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}