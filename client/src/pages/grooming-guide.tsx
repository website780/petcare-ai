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
      <div className="container mx-auto px-4 py-4 max-w-4xl relative z-10">
        <Link href={`/pet/${id}`}>
          <Button 
            variant="ghost" 
            className="mb-6 hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Button>
        </Link>

        <Card className="border border-black/[0.04] shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-3xl overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-blue-400 to-cyan-400" />
          <CardHeader className="p-6 md:p-8">
            <CardTitle className="text-3xl font-black tracking-tight">{pet.name}'s Grooming Guide</CardTitle>
          </CardHeader>
          <CardContent className="p-6 md:p-8 space-y-6">
            <GroomingTips pet={pet} />
            <div className="pt-6 border-t border-black/[0.04]">
              <GroomingScheduler pet={pet} />
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
