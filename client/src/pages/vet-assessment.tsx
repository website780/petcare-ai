import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Pet } from "@shared/schema";
import { ArrowLeft, ActivitySquare } from "lucide-react";
import { Header } from "@/components/Header";
import { VetConsultation } from "@/components/VetConsultation";
import { HealthAssessmentQuiz } from "@/components/HealthAssessmentQuiz";


export default function VetAssessmentPage() {
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
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        <Link href={`/pet/${id}`}>
          <Button 
            variant="ghost" 
            className="mb-8 hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl"
          >
            <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Back to Profile
          </Button>
        </Link>

        <div className="grid grid-cols-1 gap-10">
          <Card className="border border-black/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
             <div className="h-2 bg-gradient-to-r from-blue-400 to-[#ff6b4a]" />
             <CardHeader className="p-8 md:p-10 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                      <h3 className="text-3xl font-black tracking-tight mb-1">{pet.name}'s Health Nexus</h3>
                      <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Diagnostic & Clinical Intelligence</p>
                   </div>
                   <div className="flex items-center gap-3 bg-muted/50 p-2 rounded-2xl border border-black/[0.02]">
                       <div className="w-10 h-10 rounded-xl bg-[#ff6b4a] text-white flex items-center justify-center shadow-lg shadow-[#ff6b4a]/20">
                          <ActivitySquare className="w-5 h-5" />
                       </div>
                       <div className="pr-4">
                          <div className="text-[10px] font-black text-muted-foreground uppercase">Wellness Status</div>
                          <div className="text-xs font-black">Optimization Active</div>
                       </div>
                   </div>
                </div>
             </CardHeader>
             <CardContent className="p-8 md:p-10 pt-0 space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="space-y-8">
                       <div className="p-6 rounded-3xl bg-black/[0.01] border border-black/[0.03]">
                          <HealthAssessmentQuiz pet={pet} />
                       </div>

                       <div className="space-y-6">
                          <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#ff6b4a] border-b border-black/[0.05] pb-2">Clinical Parameters</h4>
                          <div className="space-y-4">
                            {pet.vetCareFrequency && (
                                <div className="flex items-center justify-between group">
                                    <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">Checkup Cadence</span>
                                    <Badge variant="outline" className="rounded-lg font-black text-xs py-1 px-3 border-black/[0.08] group-hover:border-[#ff6b4a]/40 transition-colors">
                                        {pet.vetCareFrequency}
                                    </Badge>
                                </div>
                            )}

                            {pet.vetCareDetails && pet.vetCareDetails.length > 0 && (
                            <div className="pt-4 space-y-3">
                                <span className="text-xs font-black text-muted-foreground uppercase tracking-wider">Required Protocols</span>
                                <div className="grid grid-cols-1 gap-2">
                                {pet.vetCareDetails.map((detail, index) => (
                                    <div key={index} className="flex items-center gap-3 p-3 rounded-xl bg-white border border-black/[0.03] shadow-sm">
                                        <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b4a]" />
                                        <span className="text-[11px] font-bold text-gray-700 leading-tight">{detail}</span>
                                    </div>
                                ))}
                                </div>
                            </div>
                            )}
                          </div>
                       </div>
                    </div>

                    <div className="p-8 rounded-[2rem] bg-gradient-to-br from-gray-900 to-black text-white shadow-2xl relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-[#ff6b4a]/20 blur-[60px] rounded-full -mr-10 -mt-10 group-hover:bg-[#ff6b4a]/40 transition-all duration-700" />
                       <VetConsultation pet={pet} />
                    </div>
                </div>
             </CardContent>
          </Card>

          {/* New Vet Chat Component */}
          <div className="mb-10 p-1 rounded-[2.5rem] bg-gradient-to-br from-[#ff6b4a]/20 to-blue-500/20 shadow-xl">
             <div className="bg-white rounded-[2.2rem] overflow-hidden">
<p className="text-muted-foreground text-center py-8 text-sm italic">Health records are being updated. Use the AI Vet Chat for current questions.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}