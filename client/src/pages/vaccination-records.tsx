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
    <>
      <Header />
      <div className="container mx-auto px-4 py-4 md:py-8 max-w-4xl">
        <Link href={`/pet/${id}`}>
          <Button variant="ghost" className="mb-4 w-full sm:w-auto" data-testid="button-back-to-profile">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>
        </Link>

        <Card className="mb-6">
          <CardHeader className="p-4 md:p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-full">
                <Syringe className="h-8 w-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl md:text-3xl">{pet.name}'s Vaccination Records</CardTitle>
                <p className="text-muted-foreground mt-1">Track and manage all vaccinations</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  <span className="font-medium text-green-800 dark:text-green-200">Completed</span>
                </div>
                <p className="text-2xl font-bold text-green-700 dark:text-green-300" data-testid="text-completed-count">{completedCount}</p>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  <span className="font-medium text-blue-800 dark:text-blue-200">Upcoming</span>
                </div>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300" data-testid="text-upcoming-count">{upcomingCount}</p>
              </div>
              <div className="p-4 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800 dark:text-red-200">Overdue</span>
                </div>
                <p className="text-2xl font-bold text-red-700 dark:text-red-300" data-testid="text-overdue-count">{overdueCount}</p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  <span className="font-medium text-purple-800 dark:text-purple-200">Coverage</span>
                </div>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300" data-testid="text-coverage-percent">{completionPercentage}%</p>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Vaccination Coverage Progress</span>
                <span className="text-sm text-muted-foreground">{vaccinesGiven} of {totalRecommended} recommended vaccines administered</span>
              </div>
              <Progress value={completionPercentage} className="h-3" />
            </div>

            {(pet.vaccinationSchedule || pet.vaccinationNotes) && (
              <div className="mb-6 p-4 bg-gradient-to-r from-primary/5 to-primary/10 rounded-lg border border-primary/20">
                <div className="flex items-center gap-2 mb-3">
                  <div className="p-2 bg-primary/20 rounded-full">
                    <Syringe className="h-4 w-4 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg">Personalized for {pet.breed || pet.species}</h3>
                </div>
                {pet.vaccinationSchedule && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-primary mb-1">Recommended Schedule</p>
                    <p className="text-sm text-muted-foreground">{pet.vaccinationSchedule}</p>
                  </div>
                )}
                {pet.vaccinationNotes && (
                  <div>
                    <p className="text-sm font-medium text-primary mb-1">Breed-Specific Notes</p>
                    <p className="text-sm text-muted-foreground">{pet.vaccinationNotes}</p>
                  </div>
                )}
                {pet.nextVaccinationDue && (
                  <div className="mt-3 flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-orange-500" />
                    <span className="font-medium">Next vaccination due:</span>
                    <span className="text-muted-foreground">
                      {format(new Date(pet.nextVaccinationDue), "MMMM d, yyyy")}
                    </span>
                  </div>
                )}
              </div>
            )}

            <Dialog open={isAddingRecord} onOpenChange={setIsAddingRecord}>
              <DialogTrigger asChild>
                <Button className="w-full mb-6" data-testid="button-add-vaccination">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Vaccination Record
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add Vaccination Record</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Vaccine Name *</label>
                    <Select
                      value={newRecord.name}
                      onValueChange={(value) => setNewRecord({ ...newRecord, name: value })}
                    >
                      <SelectTrigger data-testid="select-vaccine-name">
                        <SelectValue placeholder="Select vaccine" />
                      </SelectTrigger>
                      <SelectContent>
                        {hasAIGeneratedRecords ? (
                          <>
                            {coreRecords.map((v: VaccinationRecord) => (
                              <SelectItem key={v.name} value={v.name}>{v.name} (Core)</SelectItem>
                            ))}
                            {nonCoreRecords.map((v: VaccinationRecord) => (
                              <SelectItem key={v.name} value={v.name}>{v.name} (Non-Core)</SelectItem>
                            ))}
                          </>
                        ) : (
                          <>
                            {staticVaccinationInfo.core.map((v) => (
                              <SelectItem key={v.name} value={v.name}>{v.name} (Core)</SelectItem>
                            ))}
                            {staticVaccinationInfo.nonCore.map((v) => (
                              <SelectItem key={v.name} value={v.name}>{v.name} (Non-Core)</SelectItem>
                            ))}
                          </>
                        )}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Date Given *</label>
                    <Input
                      type="date"
                      value={newRecord.dateGiven}
                      onChange={(e) => setNewRecord({ ...newRecord, dateGiven: e.target.value })}
                      data-testid="input-date-given"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Next Due Date</label>
                    <Input
                      type="date"
                      value={newRecord.nextDue}
                      onChange={(e) => setNewRecord({ ...newRecord, nextDue: e.target.value })}
                      data-testid="input-next-due"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Veterinarian</label>
                    <Input
                      value={newRecord.veterinarian}
                      onChange={(e) => setNewRecord({ ...newRecord, veterinarian: e.target.value })}
                      placeholder="Dr. Smith"
                      data-testid="input-veterinarian"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Notes</label>
                    <Textarea
                      value={newRecord.notes}
                      onChange={(e) => setNewRecord({ ...newRecord, notes: e.target.value })}
                      placeholder="Any reactions, batch number, etc."
                      data-testid="textarea-notes"
                    />
                  </div>
                  <Button
                    onClick={handleAddRecord}
                    disabled={updateVaccinationMutation.isPending}
                    className="w-full"
                    data-testid="button-save-vaccination"
                  >
                    {updateVaccinationMutation.isPending ? "Saving..." : "Save Record"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {records.length > 0 && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Vaccination History
                </h3>
                <div className="space-y-3">
                  {records.map((record, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        record.status === "overdue"
                          ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                          : record.status === "upcoming"
                          ? "border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950"
                          : "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                      }`}
                      data-testid={`card-vaccination-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{record.name}</span>
                            <Badge
                              variant={record.status === "overdue" ? "destructive" : record.status === "upcoming" ? "default" : "secondary"}
                            >
                              {record.status === "overdue" ? "Overdue" : record.status === "upcoming" ? "Upcoming" : "Completed"}
                            </Badge>
                          </div>
                          {record.dateGiven ? (
                            <p className="text-sm text-muted-foreground">
                              Given: {format(new Date(record.dateGiven), "MMM d, yyyy")}
                            </p>
                          ) : (
                            <p className="text-sm text-muted-foreground italic">Not yet administered</p>
                          )}
                          {record.protectsAgainst && (
                            <p className="text-sm text-muted-foreground">
                              Protects against: {record.protectsAgainst}
                            </p>
                          )}
                          {record.boosterFrequency && (
                            <p className="text-sm text-muted-foreground">
                              Booster: {record.boosterFrequency}
                            </p>
                          )}
                          {record.nextDue && (
                            <p className="text-sm text-muted-foreground">
                              Next due: {format(new Date(record.nextDue), "MMM d, yyyy")}
                              {record.status === "overdue" && (
                                <span className="text-red-600 ml-2">
                                  ({differenceInDays(new Date(), new Date(record.nextDue))} days overdue)
                                </span>
                              )}
                            </p>
                          )}
                          {record.veterinarian && (
                            <p className="text-sm text-muted-foreground">Vet: {record.veterinarian}</p>
                          )}
                          {record.notes && (
                            <p className="text-sm text-muted-foreground mt-1 italic">"{record.notes}"</p>
                          )}
                        </div>
                        {record.status === "overdue" && (
                          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {hasAIGeneratedRecords && coreRecords.length > 0 ? (
          <Card className="mb-6">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Core Vaccines for {pet.breed || pet.species}
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                AI-generated essential vaccinations for your {pet.breed || pet.species}
              </p>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {coreRecords.map((vaccine, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${vaccine.dateGiven ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}`}
                    data-testid={`card-core-vaccine-${index}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{vaccine.name}</span>
                          {vaccine.dateGiven ? (
                            <Badge variant="secondary" className="bg-green-200 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Administered
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-700 border-yellow-400">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        {vaccine.protectsAgainst && (
                          <p className="text-sm text-muted-foreground">Protects against: {vaccine.protectsAgainst}</p>
                        )}
                        {vaccine.notes && (
                          <p className="text-sm text-muted-foreground italic">{vaccine.notes}</p>
                        )}
                        {vaccine.boosterFrequency && (
                          <p className="text-sm font-medium mt-2 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Booster: {vaccine.boosterFrequency}
                          </p>
                        )}
                        {vaccine.dateGiven && (
                          <p className="text-sm text-green-600 mt-2">
                            Given: {format(new Date(vaccine.dateGiven), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      {!vaccine.dateGiven && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsAdministered(vaccine.name)}
                          disabled={updateVaccinationMutation.isPending}
                          className="flex-shrink-0 ml-2"
                          data-testid={`button-mark-administered-${index}`}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                Core Vaccines for {pet.species}s
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Essential vaccinations recommended for all {pet.species.toLowerCase()}s
              </p>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {staticVaccinationInfo.core.map((vaccine, index) => {
                  const hasRecord = records.some(r => r.name.toLowerCase() === vaccine.name.toLowerCase());
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${hasRecord ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}`}
                      data-testid={`card-core-vaccine-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{vaccine.name}</span>
                            {hasRecord && (
                              <Badge variant="secondary" className="bg-green-200 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Recorded
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{vaccine.description}</p>
                          <p className="text-sm font-medium mt-2 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Frequency: {vaccine.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {hasAIGeneratedRecords && nonCoreRecords.length > 0 ? (
          <Card className="mb-6">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Non-Core Vaccines (Lifestyle-Based)
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                AI-recommended vaccines based on {pet.breed || pet.species} lifestyle factors
              </p>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {nonCoreRecords.map((vaccine, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg border ${vaccine.dateGiven ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}`}
                    data-testid={`card-noncore-vaccine-${index}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">{vaccine.name}</span>
                          {vaccine.dateGiven ? (
                            <Badge variant="secondary" className="bg-green-200 text-green-800">
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              Administered
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-yellow-700 border-yellow-400">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </div>
                        {vaccine.protectsAgainst && (
                          <p className="text-sm text-muted-foreground">Protects against: {vaccine.protectsAgainst}</p>
                        )}
                        {vaccine.recommendedFor && (
                          <p className="text-sm text-muted-foreground">Recommended for: {vaccine.recommendedFor}</p>
                        )}
                        {vaccine.notes && (
                          <p className="text-sm text-muted-foreground italic">{vaccine.notes}</p>
                        )}
                        {vaccine.boosterFrequency && (
                          <p className="text-sm font-medium mt-2 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Booster: {vaccine.boosterFrequency}
                          </p>
                        )}
                        {vaccine.dateGiven && (
                          <p className="text-sm text-green-600 mt-2">
                            Given: {format(new Date(vaccine.dateGiven), "MMM d, yyyy")}
                          </p>
                        )}
                      </div>
                      {!vaccine.dateGiven && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleMarkAsAdministered(vaccine.name)}
                          disabled={updateVaccinationMutation.isPending}
                          className="flex-shrink-0 ml-2"
                          data-testid={`button-mark-noncore-administered-${index}`}
                        >
                          <CheckCircle2 className="h-4 w-4 mr-1" />
                          Mark Done
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : staticVaccinationInfo.nonCore.length > 0 ? (
          <Card className="mb-6">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-pink-500" />
                Non-Core Vaccines (Lifestyle-Based)
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Recommended based on your pet's lifestyle and risk factors
              </p>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {staticVaccinationInfo.nonCore.map((vaccine, index) => {
                  const hasRecord = records.some(r => r.name.toLowerCase() === vaccine.name.toLowerCase());
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${hasRecord ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950" : "border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"}`}
                      data-testid={`card-noncore-vaccine-${index}`}
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{vaccine.name}</span>
                            {hasRecord && (
                              <Badge variant="secondary" className="bg-green-200 text-green-800">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Recorded
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{vaccine.description}</p>
                          <p className="text-sm font-medium mt-2 flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            Frequency: {vaccine.frequency}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : null}

        {!hasAIGeneratedRecords && (
          <Card className="mb-6">
            <CardHeader className="p-4 md:p-6">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-orange-500" />
                Recommended Vaccination Schedule
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Standard vaccination timeline for {pet.species.toLowerCase()}s
              </p>
            </CardHeader>
            <CardContent className="p-4 md:p-6">
              <div className="space-y-4">
                {staticVaccinationInfo.schedule.map((schedule, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                    data-testid={`card-schedule-${index}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-orange-100 dark:bg-orange-900 rounded-full">
                        <Calendar className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <span className="font-medium text-lg">{schedule.age}</span>
                        <ul className="mt-2 space-y-1">
                          {schedule.vaccines.map((v, i) => (
                            <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                              <Syringe className="h-3 w-3" />
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

        <Card>
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5 text-blue-500" />
              Important Vaccination Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="prose prose-sm max-w-none dark:prose-invert">
              <ul className="space-y-2 text-muted-foreground">
                <li><strong>Core vaccines</strong> are essential for all pets and protect against severe, life-threatening diseases.</li>
                <li><strong>Non-core vaccines</strong> are recommended based on lifestyle factors like outdoor access, boarding, or geographic location.</li>
                <li><strong>Puppy/Kitten series</strong>: Young animals need multiple doses to build proper immunity.</li>
                <li><strong>Boosters</strong>: Adult pets need regular boosters to maintain protection.</li>
                <li><strong>Reactions</strong>: Mild reactions (lethargy, mild fever) are normal. Contact your vet for severe reactions.</li>
                <li><strong>Timing</strong>: Don't vaccinate sick pets. Wait until they've fully recovered.</li>
                <li><strong>Records</strong>: Keep vaccination records updated for boarding, travel, and veterinary visits.</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
