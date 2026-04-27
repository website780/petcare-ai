import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, differenceInMinutes, differenceInDays, addMinutes } from "date-fns";
import { useForm } from "react-hook-form";
import { Pet, VetConsultation as ConsultationType } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Clock, 
  Calendar as CalendarIcon, 
  X, 
  MapPin, 
  Search, 
  Star, 
  Phone, 
  ExternalLink 
} from "lucide-react";
import { formatDateTime, formatTimeForInput, formatDateForInput } from "@/lib/dateUtils";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Photo {
  reference: string;
  width: number;
  height: number;
  url: string;
}

interface VetLocation {
  placeId: string;
  name: string;
  address: string;
  location?: { lat: number; lng: number };
  rating?: number;
  userRatingsTotal?: number;
  phone?: string;
  openNow?: boolean;
  photos?: Photo[];
  icon?: string;
  website?: string;
  url?: string; // Google Maps URL
}

interface ConsultationFormData {
  scheduledDate: Date;
  reason: string;
  time: string;
  vetName?: string; 
  vetAddress?: string;
  vetPhone?: string;
}

interface VetConsultationProps {
  pet: Pet;
}

export function VetConsultation({ pet }: VetConsultationProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastNotificationCheck, setLastNotificationCheck] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("details");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<VetLocation[]>([]);
  const [displayedResults, setDisplayedResults] = useState<VetLocation[]>([]);
  const [selectedVet, setSelectedVet] = useState<VetLocation | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "default">("default");
  const [resultsPage, setResultsPage] = useState(1);
  const resultsPerPage = 4;

  const { data: consultations = [], isLoading } = useQuery<ConsultationType[]>({
    queryKey: [`/api/pets/${pet.id}/consultations`],
  });

  // Check for upcoming consultations and send notifications
  useEffect(() => {
    const checkUpcomingConsultations = () => {
      const now = new Date();

      consultations.forEach(consultation => {
        if (consultation.status !== 'scheduled') return;

        const consultationDate = new Date(consultation.scheduledDate);
        const minutesUntil = differenceInMinutes(consultationDate, now);
        const daysUntil = differenceInDays(consultationDate, now);

        // Check if we haven't shown this notification since last check
        // and the consultation is in the future
        if (consultationDate > now) {
          // 5 days notification
          if (daysUntil === 5 && minutesUntil % (24 * 60) <= 1) {
            toast({
              title: "Upcoming Vet Consultation",
              description: `${pet.name}'s vet consultation is in 5 days on ${format(consultationDate, 'PPP p')}`,
              duration: 10000,
            });
          }

          // 1 day notification
          if (daysUntil === 1 && minutesUntil % (24 * 60) <= 1) {
            toast({
              title: "Vet Consultation Tomorrow",
              description: `${pet.name}'s vet consultation is tomorrow at ${format(consultationDate, 'p')}`,
              duration: 10000,
            });
          }

          // 30 minutes notification
          if (minutesUntil === 30) {
            toast({
              title: "Vet Consultation Soon",
              description: `${pet.name}'s vet consultation is in 30 minutes!`,
              duration: 15000,
            });
          }
        }
      });

      setLastNotificationCheck(now);
    };

    // Check immediately and then every minute
    checkUpcomingConsultations();
    const interval = setInterval(checkUpcomingConsultations, 60000);
    return () => clearInterval(interval);
  }, [consultations, toast, pet.name, lastNotificationCheck]);
  
  // Function to process search results with sorting
  const processSearchResults = (results: VetLocation[]) => {
    // Create a new array to avoid modifying original data
    let processed = [...results];
    
    // Apply sorting
    if (sortBy === "rating") {
      processed.sort((a, b) => {
        // Handle undefined ratings
        const ratingA = a.rating || 0;
        const ratingB = b.rating || 0;
        return ratingB - ratingA; // Sort by descending rating
      });
    }
    // For "distance" or "default", we keep the original order from Google Maps API
    // which is already sorted by distance (closest first)
    
    // Set the total processed results
    setSearchResults(processed);
    
    // Set first page of displayed results
    const firstPageResults = processed.slice(0, resultsPerPage);
    setDisplayedResults(firstPageResults);
    setResultsPage(1);
  };
  
  // Function to load more results
  const loadMoreResults = () => {
    const nextPage = resultsPage + 1;
    const nextResults = searchResults.slice(0, nextPage * resultsPerPage);
    setDisplayedResults(nextResults);
    setResultsPage(nextPage);
  };
  
  // Function to search for vets using Google Maps Places API
  const searchVets = async () => {
    if (!searchLocation) {
      toast({
        title: "Location required",
        description: "Please enter a location to search for veterinarians",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Fetch real vet data from our API endpoint
      const petType = pet.species || '';
      const response = await fetch(`/api/places/search?location=${encodeURIComponent(searchLocation)}&petType=${encodeURIComponent(petType)}&serviceType=vet`);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Special handling for "no results found" cases
        if (response.status === 404 && errorData.error === "No veterinarian results found") {
          setSearchResults([]);
          toast({
            title: "No veterinarians found",
            description: "No veterinarians were found in this location. Try searching in a different area or with different keywords.",
            variant: "default",
          });
          setIsSearching(false);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to search for veterinarians');
      }
      
      const data = await response.json();
      
      // Open Google Maps in a new tab to show results visually
      if (data.searchLocation?.location) {
        const { lat, lng } = data.searchLocation.location;
        const searchQuery = `${petType} veterinarian animal hospital near ${searchLocation}`;
        const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${lat},${lng},14z`;
        window.open(googleMapsUrl, '_blank');
      }
      
      if (data.groomers && data.groomers.length > 0) {
        // Process the results with our sorting
        processSearchResults(data.groomers);
        
        toast({
          title: "Search complete",
          description: `Found ${data.groomers.length} veterinarians in ${data.searchLocation?.address || searchLocation}`,
        });
      } else {
        setSearchResults([]);
        setDisplayedResults([]);
        toast({
          title: "No veterinarians found",
          description: "Try a different location or search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching for veterinarians:", error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search for veterinarians. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // When a vet is selected, update the form with real Google Maps data
  const selectVet = (vet: VetLocation) => {
    setSelectedVet(vet);
    
    // Update form fields with Google Maps vet information
    form.setValue("vetName", vet.name);
    form.setValue("vetAddress", vet.address);
    form.setValue("vetPhone", vet.phone || "");
    
    // Create info notes from Google Maps data
    const infoNotes = [
      vet.rating ? `Rating: ${vet.rating}/5` : '',
      vet.userRatingsTotal ? `(${vet.userRatingsTotal} reviews)` : '',
      vet.website ? `Website: ${vet.website}` : '',
      vet.url ? `Google Maps URL: ${vet.url}` : '',
      vet.openNow !== undefined ? `Open at time of booking: ${vet.openNow ? 'Yes' : 'No'}` : ''
    ].filter(Boolean).join('\n');
    
    // Add Google Maps info to appointment notes if available
    if (infoNotes) {
      const currentNotes = form.getValues("reason") || '';
      if (!currentNotes.includes('Google Maps Information')) {
        form.setValue("reason", currentNotes ? 
          `${currentNotes}\n\n----- Google Maps Information -----\n${infoNotes}` : 
          `Google Maps Information:\n${infoNotes}`
        );
      }
    }
    
    // Switch to the appointment details tab
    setActiveTab("details");
    
    toast({
      title: "Veterinarian selected",
      description: `${vet.name} has been added to your appointment details.`,
    });
  };

  const form = useForm<ConsultationFormData>({
    defaultValues: {
      scheduledDate: new Date(),
      reason: "",
      time: formatTimeForInput(new Date()),
      vetName: "",
      vetAddress: "",
      vetPhone: "",
    },
  });

  const scheduleConsultation = useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      const scheduledDateTime = new Date(data.scheduledDate);
      const [hours, minutes] = data.time.split(":").map(Number);
      scheduledDateTime.setHours(hours, minutes);

      await apiRequest("POST", `/api/pets/${pet.id}/consultations`, {
        scheduledDate: scheduledDateTime.toISOString(),
        reason: data.reason,
        userId: pet.userId,
        vetName: data.vetName,
        vetAddress: data.vetAddress,
        vetPhone: data.vetPhone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}/consultations`] });
      toast({
        title: "Consultation scheduled",
        description: "Your vet consultation has been scheduled successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to schedule consultation",
      });
    },
  });

  const cancelConsultation = useMutation({
    mutationFn: async (consultationId: number) => {
      await apiRequest("POST", `/api/consultations/${consultationId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}/consultations`] });
      toast({ title: "Consultation cancelled" });
    },
  });

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 bg-muted rounded w-1/3" />
      <div className="h-32 bg-muted rounded" />
    </div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h3 className="text-2xl font-black tracking-tight text-foreground">Clinical Appointments</h3>
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mt-1">Manage physical consultations</p>
         </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ff6b4a] hover:bg-[#ff8f6b] text-white font-black rounded-2xl h-12 px-6 shadow-lg shadow-[#ff6b4a]/20 border-none transition-all">
               Schedule Consultation
            </Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-none w-[95vw] max-w-[850px] max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2" />
            <div className="p-0 overflow-y-auto max-h-[calc(90vh-8px)]">
                <div className="p-8 md:p-10 pb-4">
                  <DialogHeader>
                    <DialogTitle className="text-3xl font-black tracking-tight">Veternary Scheduler</DialogTitle>
                    <DialogDescription className="font-bold text-muted-foreground uppercase text-[10px] tracking-widest mt-2">
                       Secure a professional clinical slot for {pet.name}
                    </DialogDescription>
                  </DialogHeader>
                  
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
                    <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/40 rounded-2xl h-14 border border-black/[0.04]">
                      <TabsTrigger value="details" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:shadow-md data-[state=active]:bg-white">
                         1. Appointment
                      </TabsTrigger>
                      <TabsTrigger value="vet" className="rounded-xl font-black text-xs uppercase tracking-widest data-[state=active]:shadow-md data-[state=active]:bg-white">
                         2. Find Clinician
                      </TabsTrigger>
                    </TabsList>
                    
                    <div className="mt-8">
                        <TabsContent value="details" className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                          {selectedVet && (
                            <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex items-center justify-between group">
                               <div className="flex items-center gap-4">
                                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/20">
                                     <MapPin className="w-6 h-6" />
                                  </div>
                                  <div>
                                     <div className="text-[10px] font-black uppercase tracking-widest text-blue-600">Active Selection</div>
                                     <h5 className="font-black text-base text-blue-900">{selectedVet.name}</h5>
                                     <p className="text-[10px] font-medium text-blue-700/60 truncate max-w-[200px] md:max-w-md">{selectedVet.address}</p>
                                  </div>
                               </div>
                               <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="rounded-xl h-10 px-4 font-black text-[10px] uppercase tracking-widest hover:bg-blue-100/50 text-blue-700" 
                                  onClick={() => setActiveTab("vet")}
                                >
                                  Modify
                                </Button>
                            </div>
                          )}
                          
                          <Form {...form}>
                            <form
                              onSubmit={form.handleSubmit((data) => scheduleConsultation.mutate(data))}
                              className="grid gap-8"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                  <FormField
                                    control={form.control}
                                    name="scheduledDate"
                                    render={({ field }) => (
                                      <FormItem className="space-y-3">
                                        <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Select Target Date</FormLabel>
                                        <FormControl>
                                          <div className="p-2 bg-white rounded-3xl border border-black/[0.06] shadow-sm">
                                            <Calendar
                                              mode="single"
                                              selected={field.value}
                                              onSelect={field.onChange}
                                              className="rounded-2xl"
                                              disabled={(date) => date < new Date()}
                                            />
                                          </div>
                                        </FormControl>
                                      </FormItem>
                                    )}
                                  />
                                  <div className="space-y-8">
                                      <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                          <FormItem className="space-y-3">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Preferred Slot</FormLabel>
                                            <FormControl>
                                              <div className="relative group">
                                                <Clock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-[#ff6b4a] transition-colors" />
                                                <Input type="time" {...field} className="h-14 pl-12 rounded-2xl border-black/[0.08] focus-visible:ring-[#ff6b4a] font-bold" />
                                              </div>
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                      <FormField
                                        control={form.control}
                                        name="reason"
                                        render={({ field }) => (
                                          <FormItem className="space-y-3">
                                            <FormLabel className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Assessment Rationale</FormLabel>
                                            <FormControl>
                                              <Textarea
                                                {...field}
                                                placeholder="Clarify specific symptoms or concerns..."
                                                className="min-h-[140px] rounded-[1.5rem] border-black/[0.08] focus-visible:ring-[#ff6b4a] p-4 font-medium resize-none"
                                              />
                                            </FormControl>
                                          </FormItem>
                                        )}
                                      />
                                  </div>
                              </div>
                              <div className="flex justify-end p-6 md:p-8 bg-muted/20 border-t border-black/[0.02] -mx-8 md:-mx-10 mt-4 rounded-b-[2.5rem]">
                                <Button
                                  type="submit"
                                  disabled={scheduleConsultation.isPending}
                                  className="bg-black hover:bg-black/90 text-white h-14 px-10 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-black/10 transition-all border-none"
                                >
                                  {scheduleConsultation.isPending
                                    ? "Processing..."
                                    : "Authorize Appointment"}
                                </Button>
                              </div>
                            </form>
                          </Form>
                        </TabsContent>
                        
                        <TabsContent value="vet" className="space-y-8 outline-none animate-in fade-in slide-in-from-bottom-4 duration-500">
                          <div className="bg-black text-white rounded-[2rem] p-8 md:p-10 relative overflow-hidden group shadow-2xl">
                             <div className="relative z-10">
                                <h4 className="text-xl font-black mb-1 uppercase tracking-tight">Geospatial Search</h4>
                                <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-8">Locate premier clinical centers</p>
                                
                                <div className="flex flex-col sm:flex-row gap-3">
                                  <div className="relative flex-1 group">
                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/30 group-focus-within:text-[#ff6b4a] transition-all" />
                                    <Input
                                      placeholder="City, ZIP, or Full Address"
                                      value={searchLocation}
                                      onChange={(e) => setSearchLocation(e.target.value)}
                                      className="h-14 pl-12 rounded-2xl bg-white/10 border-white/10 text-white placeholder:text-white/20 focus-visible:ring-[#ff6b4a] transition-all"
                                    />
                                  </div>
                                  <Button 
                                    onClick={searchVets} 
                                    disabled={isSearching || !searchLocation}
                                    className="h-14 px-8 rounded-2xl bg-[#ff6b4a] hover:bg-[#ff8f6b] text-white font-black text-xs uppercase tracking-[0.1em] shadow-lg shadow-[#ff6b4a]/20 border-none transition-all group"
                                  >
                                    {isSearching ? (
                                      <div className="flex items-center gap-2">
                                         <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                         Scanning...
                                      </div>
                                    ) : (
                                      <div className="flex items-center gap-2">
                                        <Search className="h-4 w-4 group-hover:scale-110 transition-transform" />
                                        Execute Search
                                      </div>
                                    )}
                                  </Button>
                                </div>
                                
                                <div className="mt-6 flex flex-wrap items-center gap-2">
                                  <span className="text-[9px] font-black uppercase text-white/30 tracking-widest mr-2">Hotspots:</span>
                                  {["78641", "Austin, TX", "60564"].map(spot => (
                                    <button 
                                      key={spot}
                                      onClick={() => setSearchLocation(spot)}
                                      className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-black text-white/60 hover:bg-white/10 hover:text-white transition-all uppercase tracking-tighter"
                                    >
                                      {spot}
                                    </button>
                                  ))}
                                </div>
                             </div>
                             <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-blue-600/10 blur-[80px] rounded-full group-hover:bg-blue-600/20 transition-all duration-1000" />
                          </div>
                          
                          {searchResults.length > 0 ? (
                            <div className="space-y-8 pb-10">
                              <div className="flex items-center justify-between px-2">
                                <div className="flex items-center gap-3">
                                   <div className="w-2 h-2 rounded-full bg-[#ff6b4a]" />
                                   <h3 className="text-sm font-black uppercase tracking-widest">Found {searchResults.length} Institutions</h3>
                                </div>
                                <div className="w-48">
                                  <Select value={sortBy} onValueChange={(value) => {
                                    setSortBy(value as "rating" | "distance" | "default");
                                    processSearchResults(searchResults);
                                  }}>
                                    <SelectTrigger className="h-10 rounded-xl border-black/[0.06] bg-black/[0.01] font-black text-[10px] uppercase tracking-widest">
                                      <SelectValue placeholder="Sort Results" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl border-none shadow-2xl">
                                      <SelectItem value="default" className="text-xs font-bold font-black">Proximity First</SelectItem>
                                      <SelectItem value="rating" className="text-xs font-bold font-black">Top Rated</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {displayedResults.map((vet) => (
                                  <div 
                                    key={vet.placeId}
                                    onClick={() => selectVet(vet)}
                                    className="group relative bg-white border border-black/[0.04] p-5 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
                                  >
                                    <div className="flex flex-col gap-4">
                                      <div className="flex items-start justify-between">
                                          <div className={`p-4 rounded-2xl bg-black/[0.02] group-hover:bg-[#ff6b4a]/10 group-hover:text-[#ff6b4a] transition-all duration-300`}>
                                             <MapPin className="h-6 w-6" />
                                          </div>
                                          {vet.rating ? (
                                             <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-100 shadow-sm">
                                                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                                                <span className="text-xs font-black text-amber-700">{vet.rating}</span>
                                             </div>
                                          ) : null}
                                      </div>
                                      <div className="space-y-1">
                                        <h4 className="font-black text-lg text-gray-900 group-hover:text-[#ff6b4a] transition-colors leading-tight line-clamp-1">{vet.name}</h4>
                                        <p className="text-[11px] font-bold text-muted-foreground leading-relaxed line-clamp-2">{vet.address}</p>
                                      </div>
                                      <div className="flex items-center justify-between pt-2 border-t border-black/[0.02]">
                                          <span className="text-[10px] font-black uppercase text-[#ff6b4a] tracking-widest opacity-0 group-hover:opacity-100 transition-all">Select Profile</span>
                                          <div className="flex items-center gap-3">
                                            {vet.phone && <Phone className="h-3 w-3 text-muted-foreground" title={vet.phone} />}
                                            {vet.website && <ExternalLink className="h-3 w-3 text-muted-foreground" title="Website Available" />}
                                          </div>
                                      </div>
                                    </div>
                                    <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-[#ff6b4a]/5 to-transparent rounded-bl-[100%] pointer-events-none" />
                                  </div>
                                ))}
                              </div>
                              
                              {searchResults.length > displayedResults.length && (
                                <div className="text-center mt-6">
                                  <Button 
                                    variant="outline" 
                                    onClick={loadMoreResults} 
                                    className="h-12 px-8 rounded-xl font-black text-xs uppercase tracking-widest border-black/[0.1] hover:bg-black hover:text-white transition-all shadow-md"
                                  >
                                    Load Remaining ({searchResults.length - displayedResults.length})
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="p-10 rounded-[2.5rem] bg-black/[0.01] border-2 border-dashed border-black/[0.05] text-center space-y-10">
                               <div className="space-y-4">
                                  <h4 className="text-lg font-black tracking-tight">Manual Disclosure</h4>
                                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest max-w-[280px] mx-auto">Input institutional data if catalog search fails</p>
                               </div>
                               <div className="grid gap-4 max-w-md mx-auto">
                                  <Input 
                                    placeholder="Institution Full Name"
                                    value={selectedVet?.name || ""}
                                    onChange={(e) => {
                                      const name = e.target.value;
                                      setSelectedVet(prev => prev ? {...prev, name} : { placeId: "manual", name, address: "" });
                                    }}
                                    className="h-12 rounded-xl border-black/[0.08] focus-visible:ring-[#ff6b4a] font-bold"
                                  />
                                  <Input 
                                    placeholder="Institutional Address"
                                    value={selectedVet?.address || ""}
                                    onChange={(e) => {
                                      const address = e.target.value;
                                      setSelectedVet(prev => prev ? {...prev, address} : { placeId: "manual", name: "", address });
                                    }}
                                    className="h-12 rounded-xl border-black/[0.08] focus-visible:ring-[#ff6b4a] font-bold"
                                  />
                                  <Button 
                                    onClick={() => setActiveTab("details")}
                                    className="h-12 rounded-xl bg-black text-white font-black text-xs uppercase tracking-widest shadow-lg border-none"
                                    disabled={!selectedVet?.name}
                                  >
                                    Initialize Appointment
                                  </Button>
                               </div>
                            </div>
                          )}
                        </TabsContent>
                    </div>
                  </Tabs>
                </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        {consultations.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {consultations.map((consultation) => {
              const { dateTime } = formatDateTime(consultation.scheduledDate);
              const isCancelled = consultation.status === "cancelled";
              const isCompleted = consultation.status === "completed";

              return (
                <div
                  key={consultation.id}
                  className={`group relative overflow-hidden p-6 rounded-[2rem] border transition-all duration-500 ${isCancelled ? 'bg-muted/50 border-black/5 opacity-60' : 'bg-white border-black/[0.04] shadow-sm hover:shadow-xl'}`}
                >
                  <div className="relative z-10 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 ${isCancelled ? 'bg-muted text-muted-foreground' : isCompleted ? 'bg-green-500 text-white shadow-green-500/20' : 'bg-[#ff6b4a] text-white shadow-[#ff6b4a]/20'}`}>
                           <CalendarIcon className="h-5 w-5" />
                        </div>
                        <div>
                           <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Protocol Slot</div>
                           <span className="text-sm font-black tracking-tight">{dateTime}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`rounded-xl h-8 px-4 font-black uppercase tracking-[0.1em] text-[9px] border-none shadow-sm ${isCancelled ? 'bg-red-50 text-red-600' : isCompleted ? 'bg-green-50 text-green-600' : 'bg-[#ff6b4a]/10 text-[#ff6b4a]'}`}>
                        {consultation.status}
                      </Badge>
                    </div>

                    {consultation.reason && (
                      <div className="p-4 rounded-[1.5rem] bg-black/[0.02] border border-black/[0.01]">
                         <p className="text-xs font-bold text-gray-700 leading-relaxed italic line-clamp-3">"{consultation.reason}"</p>
                      </div>
                    )}

                    {consultation.vetName && (
                      <div className="space-y-1">
                         <div className="text-[9px] font-black text-muted-foreground uppercase flex items-center gap-1"><MapPin className="w-3 h-3" /> Location Identifier</div>
                         <div className="text-[11px] font-black text-gray-900">{consultation.vetName}</div>
                         <p className="text-[10px] font-medium text-muted-foreground truncate">{consultation.vetAddress}</p>
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                       {consultation.status === "scheduled" && (
                        <button
                          onClick={() => cancelConsultation.mutate(consultation.id)}
                          className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:text-red-700 transition-colors flex items-center gap-1.5"
                        >
                          <X className="h-3 w-3" /> Deauthorize Appointment
                        </button>
                      )}
                      
                      {isCompleted && consultation.vetNotes && (
                        <div className="flex items-center gap-2">
                           <div className="w-4 h-4 rounded-md bg-green-100 flex items-center justify-center">
                              <Star className="w-2.5 h-2.5 text-green-600 fill-green-600" />
                           </div>
                           <span className="text-[9px] font-black uppercase tracking-widest text-green-700">Digital Notes Attached</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className={`absolute top-0 right-0 w-24 h-24 blur-[60px] rounded-full -mr-10 -mt-10 opacity-20 pointer-events-none transition-colors ${isCancelled ? 'bg-red-500' : isCompleted ? 'bg-green-500' : 'bg-[#ff6b4a]'}`} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="py-6 text-center bg-black/[0.02] backdrop-blur-xl rounded-[2.5rem] border border-black/[0.05] border-dashed">
             <div className="w-16 h-16 rounded-[2rem] bg-black/[0.02] flex items-center justify-center mx-auto mb-4 shadow-sm border border-black/[0.05]">
                <CalendarIcon className="w-6 h-6 text-muted-foreground/40" />
             </div>
             <p className="text-xs font-black text-muted-foreground/60 uppercase tracking-widest">No active clinical logs found.</p>
          </div>
        )}
      </div>
    </div>
  );
}