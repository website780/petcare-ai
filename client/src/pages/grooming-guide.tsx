import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Pet } from "@shared/schema";
import { ArrowLeft } from "lucide-react";
import { Header } from "@/components/Header";
import { GroomingTips } from "@/components/GroomingTips";
import { GroomingScheduler } from "@/components/GroomingScheduler";

export default function GroomingGuidePage() {
  const { id } = useParams();

  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: [`/api/pets/${id}`],
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
            <CardTitle className="text-2xl md:text-3xl">{pet.name}'s Grooming Guide</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6 space-y-6">
            <GroomingTips pet={pet} />
            <div className="mt-6">
              <GroomingScheduler pet={pet} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
