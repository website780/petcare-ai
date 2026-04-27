import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Syringe, Calendar, CheckCircle2, AlertCircle, Clock, Plus, Shield, Heart, Info, Bell, FileText } from "lucide-react";
import { type Pet } from "@shared/schema";
import { Header } from "@/components/Header";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format, addMonths, addYears, isPast, isFuture, differenceInDays } from "date-fns";

interface VaccinationRecord {
  name: string;
  dateGiven?: string;
  dateAdministered?: string;
  nextDue: string;
  veterinarian?: string;
  notes?: string;
  status: "completed" | "upcoming" | "overdue";
  isCore?: boolean;
  protectsAgainst?: string;
  boosterFrequency?: string;
  recommendedFor?: string;
}

const getSpeciesVaccinations = (species: string) => {
  const speciesLower = species.toLowerCase();
  
  if (speciesLower === "dog" || speciesLower.includes("dog")) {
    return {
      core: [
        { name: "Rabies", frequency: "1-3 years", description: "Required by law in most states. Protects against fatal viral disease." },
        { name: "Distemper (DHPP)", frequency: "1-3 years", description: "Combination vaccine for Distemper, Hepatitis, Parainfluenza, Parvovirus." },
        { name: "Parvovirus", frequency: "1-3 years", description: "Highly contagious viral illness affecting intestinal tract." },
        { name: "Canine Hepatitis", frequency: "1-3 years", description: "Protects against adenovirus type 1 affecting the liver." },
      ],
      nonCore: [
        { name: "Bordetella (Kennel Cough)", frequency: "6-12 months", description: "Recommended for dogs in boarding, daycare, or dog parks." },
        { name: "Lyme Disease", frequency: "Annual", description: "Recommended in areas with high tick populations." },
        { name: "Leptospirosis", frequency: "Annual", description: "Bacterial disease spread through contaminated water." },
        { name: "Canine Influenza (H3N2/H3N8)", frequency: "Annual", description: "Recommended for dogs frequently exposed to other dogs." },
      ],
      schedule: [
        { age: "6-8 weeks", vaccines: ["DHPP (1st dose)", "Bordetella (optional)"] },
        { age: "10-12 weeks", vaccines: ["DHPP (2nd dose)", "Leptospirosis (1st dose)", "Lyme (1st dose, if applicable)"] },
        { age: "14-16 weeks", vaccines: ["DHPP (3rd dose)", "Rabies", "Leptospirosis (2nd dose)", "Lyme (2nd dose, if applicable)"] },
        { age: "1 year", vaccines: ["DHPP booster", "Rabies booster", "Bordetella", "Leptospirosis", "Lyme (if applicable)"] },
        { age: "Annually", vaccines: ["Bordetella", "Leptospirosis", "Lyme", "Canine Influenza"] },
        { age: "Every 1-3 years", vaccines: ["DHPP", "Rabies (depending on state law)"] },
      ]
    };
  } else if (speciesLower === "cat" || speciesLower.includes("cat")) {
    return {
      core: [
        { name: "Rabies", frequency: "1-3 years", description: "Required by law in most states. Essential for all cats." },
        { name: "FVRCP", frequency: "1-3 years", description: "Feline Viral Rhinotracheitis, Calicivirus, Panleukopenia combination." },
        { name: "Feline Panleukopenia (FPV)", frequency: "1-3 years", description: "Highly contagious and often fatal viral disease." },
      ],
      nonCore: [
        { name: "Feline Leukemia (FeLV)", frequency: "Annual", description: "Recommended for outdoor cats or those exposed to other cats." },
        { name: "Feline Immunodeficiency Virus (FIV)", frequency: "As needed", description: "For high-risk cats; discuss with veterinarian." },
        { name: "Bordetella", frequency: "Annual", description: "For cats in shelters or multi-cat households." },
        { name: "Chlamydia", frequency: "Annual", description: "For cats at risk of respiratory infections." },
      ],
      schedule: [
        { age: "6-8 weeks", vaccines: ["FVRCP (1st dose)"] },
        { age: "10-12 weeks", vaccines: ["FVRCP (2nd dose)", "FeLV (1st dose, if applicable)"] },
        { age: "14-16 weeks", vaccines: ["FVRCP (3rd dose)", "Rabies", "FeLV (2nd dose, if applicable)"] },
        { age: "1 year", vaccines: ["FVRCP booster", "Rabies booster", "FeLV (if applicable)"] },
        { age: "Annually", vaccines: ["FeLV (for at-risk cats)"] },
        { age: "Every 1-3 years", vaccines: ["FVRCP", "Rabies"] },
      ]
    };
  } else if (speciesLower.includes("bird") || speciesLower.includes("parrot") || speciesLower.includes("parakeet")) {
    return {
      core: [
        { name: "Polyomavirus", frequency: "As recommended", description: "Important for young birds; prevents fatal disease." },
      ],
      nonCore: [
        { name: "Pacheco's Disease", frequency: "As recommended", description: "For birds at risk of herpesvirus infection." },
      ],
      schedule: [
        { age: "Young birds", vaccines: ["Polyomavirus (if applicable)"] },
        { age: "Annually", vaccines: ["Health check and disease screening"] },
      ]
    };
  } else if (speciesLower.includes("rabbit") || speciesLower.includes("bunny")) {
    return {
      core: [
        { name: "RHDV2 (Rabbit Hemorrhagic Disease)", frequency: "Annual", description: "Protects against fatal viral hemorrhagic disease." },
        { name: "Myxomatosis", frequency: "Annual", description: "Required in some regions; protects against myxoma virus." },
      ],
      nonCore: [],
      schedule: [
        { age: "10-12 weeks", vaccines: ["RHDV2 (1st dose)"] },
        { age: "14-16 weeks", vaccines: ["RHDV2 (2nd dose)", "Myxomatosis (if applicable)"] },
        { age: "Annually", vaccines: ["RHDV2 booster", "Myxomatosis booster (if applicable)"] },
      ]
    };
  } else if (speciesLower.includes("ferret")) {
    return {
      core: [
        { name: "Rabies", frequency: "Annual", description: "Required by law in most areas." },
        { name: "Canine Distemper", frequency: "Annual", description: "Essential protection; distemper is fatal in ferrets." },
      ],
      nonCore: [],
      schedule: [
        { age: "6-8 weeks", vaccines: ["Canine Distemper (1st dose)"] },
        { age: "10-12 weeks", vaccines: ["Canine Distemper (2nd dose)"] },
        { age: "14-16 weeks", vaccines: ["Canine Distemper (3rd dose)", "Rabies"] },
        { age: "Annually", vaccines: ["Canine Distemper", "Rabies"] },
      ]
    };
  } else {
    return {
      core: [
        { name: "Species-specific vaccines", frequency: "Consult veterinarian", description: "Vaccination requirements vary by species." },
      ],
      nonCore: [],
      schedule: [
        { age: "As recommended", vaccines: ["Consult with exotic animal veterinarian"] },
      ]
    };
  }
};

export default function VaccinationRecordsPage() {
  const { id } = useParams();
  const { toast } = useToast();
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    name: "",
    dateGiven: "",
    nextDue: "",
    veterinarian: "",
    notes: ""
  });

  const { data: pet, isLoading } = useQuery<Pet>({
    queryKey: [`/api/pets/${id}`],
  });

  const updateVaccinationMutation = useMutation({
    mutationFn: async (data: Partial<Pet>) => {
      const response = await apiRequest("PATCH", `/api/pets/${id}`, data);
      if (!response.ok) throw new Error("Failed to update vaccination records");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}`] });
      toast({ title: "Vaccination record saved successfully" });
      setIsAddingRecord(false);
      setNewRecord({ name: "", dateGiven: "", nextDue: "", veterinarian: "", notes: "" });
    },
    onError: () => {
      toast({ variant: "destructive", title: "Failed to save vaccination record" });
    }
  });

  const parseRecords = (records: string[] | null | undefined): VaccinationRecord[] => {
    if (!records || records.length === 0) return [];
    return records.map(record => {
      try {
        const parsed = JSON.parse(record);
        const nextDueDate = parsed.nextDue ? new Date(parsed.nextDue) : null;
        const dateGiven = parsed.dateGiven || parsed.dateAdministered;
        let status: "completed" | "upcoming" | "overdue" = parsed.status || "upcoming";
        
        if (dateGiven) {
          status = "completed";
          if (nextDueDate && isPast(nextDueDate)) {
            status = "overdue";
          }
        } else if (nextDueDate) {
          if (isPast(nextDueDate)) {
            status = "overdue";
          } else if (isFuture(nextDueDate)) {
            status = "upcoming";
          }
        }
        
        return { 
          ...parsed, 
          dateGiven: dateGiven,
          status 
        };
      } catch {
        return null;
      }
    }).filter(Boolean) as VaccinationRecord[];
  };

  const handleAddRecord = () => {
    if (!newRecord.name || !newRecord.dateGiven) {
      toast({ variant: "destructive", title: "Please fill in required fields" });
      return;
    }

    const record: VaccinationRecord = {
      name: newRecord.name,
      dateGiven: newRecord.dateGiven,
      nextDue: newRecord.nextDue,
      veterinarian: newRecord.veterinarian,
      notes: newRecord.notes,
      status: newRecord.nextDue && isFuture(new Date(newRecord.nextDue)) ? "upcoming" : "completed"
    };

    const existingRecords = pet?.vaccinationRecords || [];
    const updatedRecords = [...existingRecords, JSON.stringify(record)];

    updateVaccinationMutation.mutate({
      vaccinationRecords: updatedRecords,
      nextVaccinationDue: newRecord.nextDue ? new Date(newRecord.nextDue) : undefined
    });
  };

  const handleMarkAsAdministered = (vaccineName: string) => {
    const existingRecords = pet?.vaccinationRecords || [];
    const today = new Date().toISOString().split('T')[0];
    
    let recordFound = false;
    const updatedRecords = existingRecords.map(recordStr => {
      try {
        const record = JSON.parse(recordStr);
        if (record.name === vaccineName && !record.dateGiven && !record.dateAdministered) {
          recordFound = true;
          const updatedRecord = {
            ...record,
            dateGiven: today,
            dateAdministered: today,
            status: "completed"
          };
          return JSON.stringify(updatedRecord);
        }
        return recordStr;
      } catch (err) {
        console.error("Failed to parse vaccination record:", err, recordStr);
        return recordStr;
      }
    });

    if (!recordFound) {
      toast({ 
        variant: "destructive", 
        title: "Could not update vaccine record",
        description: "The vaccine record was not found or was already marked as administered."
      });
      return;
    }

    updateVaccinationMutation.mutate({
      vaccinationRecords: updatedRecords
    });
    
    toast({ title: `${vaccineName} marked as administered` });
  };

  if (isLoading || !pet) {
    return (
      <>
        <Header />
        <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-48 bg-muted rounded" />
            <div className="h-64 bg-muted rounded" />
          </div>
        </div>
      </>
    );
  }

  const staticVaccinationInfo = getSpeciesVaccinations(pet.species);
  const records = parseRecords(pet.vaccinationRecords);
  
  const coreRecords = records.filter(r => r.isCore === true);
  const nonCoreRecords = records.filter(r => r.isCore === false);
  const manualRecords = records.filter(r => r.isCore === undefined);
  const hasAIGeneratedRecords = coreRecords.length > 0 || nonCoreRecords.length > 0;
  
  const overdueCount = records.filter(r => r.status === "overdue").length;
  const upcomingCount = records.filter(r => r.status === "upcoming" && !r.dateGiven).length;
  const completedCount = records.filter(r => r.dateGiven).length;

  const totalRecommended = hasAIGeneratedRecords 
    ? coreRecords.length + nonCoreRecords.length
    : staticVaccinationInfo.core.length + staticVaccinationInfo.nonCore.length;
  
  const staticVaccineNames = [
    ...staticVaccinationInfo.core.map(v => v.name.toLowerCase()),
    ...staticVaccinationInfo.nonCore.map(v => v.name.toLowerCase())
  ];
  
  const vaccinesGiven = hasAIGeneratedRecords
    ? [...coreRecords, ...nonCoreRecords].filter(r => r.dateGiven).length
    : records.filter(r => r.dateGiven && staticVaccineNames.includes(r.name.toLowerCase())).length;
  
  const completionPercentage = totalRecommended > 0 
    ? Math.min(100, Math.round((vaccinesGiven / totalRecommended) * 100))
    : 0;

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

        <Card className="border border-black/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl mb-10">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-[#ff6b4a]" />
          <CardHeader className="p-8 md:p-10 pb-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 rounded-[1.5rem] bg-[#ff6b4a] text-white flex items-center justify-center shadow-lg shadow-[#ff6b4a]/20">
                  <Syringe className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-3xl font-black tracking-tight mb-1">{pet.name}'s Immunity Ledger</h3>
                  <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none">Clinical Prophylaxis Records</p>
                </div>
              </div>
              <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
                <DialogTrigger asChild>
                  <Button className="bg-black hover:bg-black/90 text-white rounded-2xl h-12 px-6 font-black text-xs uppercase tracking-widest shadow-xl shadow-black/10 transition-all border-none">
                    <Plus className="mr-2 h-4 w-4" />
                    Archive New Record
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 border-none shadow-2xl">
                   <div className="bg-[#ff6b4a] h-1.5 absolute top-0 left-0 w-full" />
                   <DialogHeader className="mb-6">
                      <DialogTitle className="text-2xl font-black tracking-tight">Archive Vaccination</DialogTitle>
                   </DialogHeader>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Vaccine Identifier</label>
                        <Select value={newRecord.name} onValueChange={(value) => setNewRecord({ ...newRecord, name: value })}>
                          <SelectTrigger className="h-12 rounded-xl border-black/[0.08] focus:ring-[#ff6b4a]">
                            <SelectValue placeholder="Identify Vaccine" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-none shadow-2xl">
                             {/* ... same options logic ... */}
                             <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Administered</label>
                          <Input type="date" value={newRecord.dateGiven} onChange={(e) => setNewRecord({ ...newRecord, dateGiven: e.target.value })} className="h-12 rounded-xl border-black/[0.08] focus:ring-[#ff6b4a]" />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Next Booster</label>
                          <Input type="date" value={newRecord.nextDue} onChange={(e) => setNewRecord({ ...newRecord, nextDue: e.target.value })} className="h-12 rounded-xl border-black/[0.08] focus:ring-[#ff6b4a]" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Clinical Remarks</label>
                        <Textarea value={newRecord.notes} onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })} className="rounded-xl border-black/[0.08] focus:ring-[#ff6b4a] resize-none" />
                      </div>
                      <Button onClick={handleAddRecord} disabled={updateVaccinationMutation.isPending} className="w-full h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl mt-4">
                        {updateVaccinationMutation.isPending ? "Archiving..." : "Finalize Record"}
                      </Button>
                   </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="p-8 md:p-10 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-10">
              {[
                { label: "Completed", value: completedCount, icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
                { label: "Upcoming", value: upcomingCount, icon: Clock, color: "text-blue-500", bg: "bg-blue-50" },
                { label: "Overdue", value: overdueCount, icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
                { label: "Shield Total", value: `${completionPercentage}%`, icon: Shield, color: "text-purple-500", bg: "bg-purple-50" }
              ].map((stat, i) => (
                <div key={i} className={`p-5 rounded-[2rem] ${stat.bg} border border-black/[0.02] shadow-sm`}>
                   <div className="flex items-center gap-2 mb-3">
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">{stat.label}</span>
                   </div>
                   <div className="text-2xl font-black tracking-tight">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="mb-12">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#ff6b4a]">Systematic Coverage</span>
                <span className="text-[10px] font-bold text-muted-foreground">{vaccinesGiven} / {totalRecommended} Protocol Subsets</span>
              </div>
              <div className="h-4 bg-muted/30 rounded-full overflow-hidden p-1 border border-black/[0.02]">
                 <div className="h-full bg-[#ff6b4a] rounded-full shadow-[0_0_12px_rgba(255,107,74,0.3)] transition-all duration-1000" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>

            {(pet.vaccinationSchedule || pet.vaccinationNotes) && (
              <div className="mb-12 p-8 rounded-[2rem] bg-gradient-to-br from-gray-900 to-black text-white relative overflow-hidden group shadow-2xl">
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
                   <div className="space-y-6 flex-1">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-[#ff6b4a] flex items-center justify-center">
                            <Shield className="w-5 h-5" />
                         </div>
                         <h3 className="text-xl font-black tracking-tight">Biological Security Guard</h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {pet.vaccinationSchedule && (
                            <div className="space-y-2">
                               <div className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Strategic Schedule</div>
                               <p className="text-xs font-medium text-white/70 leading-relaxed">{pet.vaccinationSchedule}</p>
                            </div>
                         )}
                         {pet.vaccinationNotes && (
                            <div className="space-y-2">
                               <div className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Breed Nuances</div>
                               <p className="text-xs font-medium text-white/70 leading-relaxed">{pet.vaccinationNotes}</p>
                            </div>
                         )}
                      </div>
                   </div>
                   {pet.nextVaccinationDue && (
                      <div className="bg-white/5 p-6 rounded-[2.5rem] border border-white/10 flex flex-col items-center justify-center min-w-[200px]">
                         <Calendar className="w-6 h-6 text-[#ff6b4a] mb-2" />
                         <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mb-1">Booster Horizon</div>
                         <div className="text-sm font-black">{format(new Date(pet.nextVaccinationDue), "MMM d, yyyy")}</div>
                      </div>
                   )}
                </div>
                <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#ff6b4a]/10 blur-[100px] rounded-full group-hover:bg-[#ff6b4a]/20 transition-all duration-1000" />
              </div>
            )}

            <div className="space-y-12">
               {/* Core Vaccines Section */}
               <div className="space-y-6">
                  <div className="flex items-center gap-3 border-b border-black/[0.05] pb-4">
                     <div className="w-1.5 h-6 bg-[#ff6b4a] rounded-full" />
                     <h3 className="text-xl font-black tracking-tight">Core Protocol Hierarchy</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(hasAIGeneratedRecords && coreRecords.length > 0 ? coreRecords : staticVaccinationInfo.core).map((vaccine, index) => {
                      const isComplete = (vaccine as any).dateGiven || records.some(r => r.name.toLowerCase() === vaccine.name.toLowerCase());
                      return (
                        <div key={index} className={`p-6 rounded-[2rem] border transition-all duration-300 ${isComplete ? 'bg-green-50/50 border-green-100 shadow-sm' : 'bg-white border-black/[0.04] shadow-sm hover:shadow-xl'}`}>
                           <div className="flex items-start justify-between mb-4">
                              <div className="space-y-1">
                                 <h4 className="font-black text-base">{vaccine.name}</h4>
                                 <p className="text-[10px] font-medium text-muted-foreground leading-snug line-clamp-2">{(vaccine as any).description || (vaccine as any).protectsAgainst}</p>
                              </div>
                              <Badge variant="outline" className={`rounded-xl px-3 h-7 font-black uppercase tracking-widest text-[8px] border-none ${isComplete ? 'bg-green-500 text-white shadow-lg shadow-green-500/20' : 'bg-muted text-muted-foreground'}`}>
                                 {isComplete ? 'Secured' : 'Mandatory'}
                              </Badge>
                           </div>
                           <div className="flex items-center justify-between pt-4 border-t border-black/[0.02]">
                              <div className="flex flex-col">
                                 <span className="text-[9px] font-black uppercase text-muted-foreground opacity-60">Frequency</span>
                                 <span className="text-[10px] font-bold">{(vaccine as any).frequency || (vaccine as any).boosterFrequency}</span>
                              </div>
                              {!isComplete && (
                                 <Button size="sm" variant="ghost" onClick={() => handleMarkAsAdministered(vaccine.name)} className="h-8 rounded-lg font-black text-[9px] uppercase tracking-widest hover:bg-[#ff6b4a]/5 hover:text-[#ff6b4a]">
                                    Log Dose
                                 </Button>
                              )}
                           </div>
                        </div>
                      );
                    })}
                  </div>
               </div>

               {/* History Timeline */}
               {records.length > 0 && (
                  <div className="space-y-6">
                     <div className="flex items-center justify-between border-b border-black/[0.05] pb-4">
                        <div className="flex items-center gap-3">
                           <div className="w-1.5 h-6 bg-black rounded-full" />
                           <h3 className="text-xl font-black tracking-tight">Timeline Ledger</h3>
                        </div>
                        <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{records.length} Logs</span>
                     </div>
                     <div className="space-y-4">
                        {records.map((record, index) => (
                           <div key={index} className="flex gap-6 group">
                              <div className="flex flex-col items-center">
                                 <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 z-10 bg-white transition-colors ${record.status === 'overdue' ? 'border-red-500' : 'border-green-500'}`}>
                                    <div className={`w-2 h-2 rounded-full ${record.status === 'overdue' ? 'bg-red-500' : 'bg-green-500'}`} />
                                 </div>
                                 <div className="w-0.5 flex-1 bg-black/[0.05] group-last:hidden" />
                              </div>
                              <div className="flex-1 pb-10">
                                 <div className="p-6 rounded-[2rem] bg-white border border-black/[0.04] shadow-sm group-hover:shadow-xl transition-all duration-500">
                                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                       <div className="space-y-1">
                                          <h4 className="font-black text-lg">{record.name}</h4>
                                          <div className="flex items-center gap-2">
                                             <span className="text-[10px] font-black uppercase text-muted-foreground opacity-60">Status</span>
                                             <Badge className={`rounded-xl px-2 h-5 font-black text-[8px] uppercase tracking-tighter border-none ${record.status === 'overdue' ? 'bg-red-500' : record.status === 'upcoming' ? 'bg-blue-500' : 'bg-green-500'}`}>
                                                {record.status}
                                             </Badge>
                                          </div>
                                       </div>
                                       <div className="text-right">
                                          <div className="text-[9px] font-black uppercase text-muted-foreground opacity-40">Administered</div>
                                          <div className="text-xs font-black">{record.dateGiven ? format(new Date(record.dateGiven), "MMM d, yyyy") : 'Incomplete'}</div>
                                       </div>
                                    </div>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-black/[0.02]">
                                       {[
                                          { label: "Clinician", value: record.veterinarian || 'Unspecified' },
                                          { label: "Booster Due", value: record.nextDue ? format(new Date(record.nextDue), "MM/DD/YY") : 'N/A' },
                                          { label: "Protects", value: record.protectsAgainst || 'Broad Spectrum', col: "col-span-2" }
                                       ].map((item, i) => (
                                          <div key={i} className={item.col}>
                                             <div className="text-[8px] font-black uppercase text-muted-foreground opacity-40 leading-none mb-1">{item.label}</div>
                                             <div className="text-[10px] font-bold truncate">{item.value}</div>
                                          </div>
                                       ))}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        ))}
                     </div>
                  </div>
               )}
            </div>
          </CardContent>
        </Card>

        {!hasAIGeneratedRecords && (
          <Card className="border border-black/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl mb-10">
            <div className="h-2 bg-gradient-to-r from-orange-400 to-[#ff6b4a]" />
            <CardHeader className="p-8 md:p-10 pb-4">
              <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-orange-100 text-[#ff6b4a]">
                  <Bell className="h-5 w-5" />
                </div>
                Recommended Vaccination Schedule
              </CardTitle>
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mt-2">
                Standard protocol for {pet.species.toLowerCase()}s
              </p>
            </CardHeader>
            <CardContent className="p-8 md:p-10 pt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {staticVaccinationInfo.schedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="p-6 rounded-[2rem] bg-white border border-black/[0.03] shadow-sm hover:shadow-xl transition-all duration-500"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-[#ff6b4a]">
                        <Calendar className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="text-xl font-black tracking-tight mb-3">{schedule.age}</div>
                        <ul className="space-y-2">
                          {schedule.vaccines.map((v, i) => (
                            <li key={i} className="text-[11px] font-bold text-gray-600 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-[#ff6b4a]" />
                              {v}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="border border-black/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-blue-400 to-indigo-400" />
          <CardHeader className="p-8 md:p-10 pb-4">
            <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-blue-100 text-blue-600">
                <Info className="h-5 w-5" />
              </div>
              Clinical Guidance
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 md:p-10 pt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
              <ul className="space-y-4">
                <li className="flex gap-3">
                   <div className="mt-1"><Shield className="w-3.5 h-3.5 text-[#ff6b4a]" /></div>
                   <p className="text-[11px] font-bold text-gray-600 leading-relaxed"><strong>Core vaccines</strong> are essential for all pets and protect against severe, life-threatening diseases.</p>
                </li>
                <li className="flex gap-3">
                   <div className="mt-1"><AlertCircle className="w-3.5 h-3.5 text-blue-500" /></div>
                   <p className="text-[11px] font-bold text-gray-600 leading-relaxed"><strong>Non-core vaccines</strong> are recommended based on lifestyle factors like outdoor access or geography.</p>
                </li>
              </ul>
              <ul className="space-y-4">
                <li className="flex gap-3">
                   <div className="mt-1"><FileText className="w-3.5 h-3.5 text-purple-500" /></div>
                   <p className="text-[11px] font-bold text-gray-600 leading-relaxed">Keep records updated for boarding, travel, and insurance compliance.</p>
                </li>
                 <li className="flex gap-3">
                   <div className="mt-1"><Heart className="w-3.5 h-3.5 text-pink-500" /></div>
                   <p className="text-[11px] font-bold text-gray-600 leading-relaxed">Mild reactions are common. Monitor {pet.name} for 24 hours post-administration.</p>
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
