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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-semibold">Vet Consultations</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Schedule Consultation</Button>
          </DialogTrigger>
          <DialogContent className="p-4 md:p-6 w-[95vw] max-w-[850px]">
            <DialogHeader>
              <DialogTitle>Schedule a Vet Consultation</DialogTitle>
              <DialogDescription>
                Schedule a veterinary consultation for {pet.name} and find a vet near you
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Appointment Details</TabsTrigger>
                <TabsTrigger value="vet">Find a Veterinarian</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                {selectedVet && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Selected Veterinarian
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="text-sm font-medium">{selectedVet.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedVet.address}</div>
                      {selectedVet.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" /> {selectedVet.phone}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-7" 
                        onClick={() => setActiveTab("vet")}
                      >
                        Change Veterinarian
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => scheduleConsultation.mutate(data))}
                    className="space-y-4"
                  >
                    <FormField
                      control={form.control}
                      name="scheduledDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date</FormLabel>
                          <FormControl>
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              className="rounded-md border"
                              disabled={(date) => date < new Date()}
                            />
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
                            <div className="flex items-center">
                              <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                              <Input type="time" {...field} className="w-full" />
                            </div>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="reason"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Visit</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Describe the reason for the consultation"
                              className="resize-none"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={scheduleConsultation.isPending}
                      >
                        {scheduleConsultation.isPending
                          ? "Scheduling..."
                          : "Schedule Consultation"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="vet" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Find a Veterinarian</CardTitle>
                    <CardDescription>
                      Search for veterinarians in your area to schedule a consultation for {pet.species}. 
                      You can search by city, full address, or ZIP code.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          placeholder="City, ZIP code, or full address"
                          value={searchLocation}
                          onChange={(e) => setSearchLocation(e.target.value)}
                          className="w-full"
                        />
                        <div className="text-xs text-muted-foreground mt-1">
                          For best results with ZIP codes, include complete 5-digit code
                        </div>
                      </div>
                      <Button 
                        onClick={searchVets} 
                        disabled={isSearching || !searchLocation}
                        className="gap-2"
                      >
                        {isSearching ? (
                          <>Searching...</>
                        ) : (
                          <>
                            <Search className="h-4 w-4" />
                            Search
                          </>
                        )}
                      </Button>
                    </div>
                    
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground mb-2">
                        Search will open Google Maps in a new tab. Select a veterinarian below or manually enter details.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setSearchLocation("78641")}>ZIP: 78641</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setSearchLocation("Austin, TX")}>Austin, TX</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setSearchLocation("60564")}>ZIP: 60564</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {searchResults.length > 0 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium">
                        Search Results
                      </h3>
                      <div className="flex items-center gap-2">
                        {searchLocation.match(/^\d{5}(-\d{4})?$/) && (
                          <Badge variant="outline" className="bg-primary/10">ZIP Code Search</Badge>
                        )}
                        <Badge variant="outline">{searchResults.length} found</Badge>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mb-2">
                      <div className="max-w-[250px]">
                        <Select value={sortBy} onValueChange={(value) => {
                          setSortBy(value as "rating" | "distance" | "default");
                          processSearchResults(searchResults);
                        }}>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sort results" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="default">Default (Distance)</SelectItem>
                            <SelectItem value="rating">Sort by Rating</SelectItem>
                            <SelectItem value="distance">Sort by Distance</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {displayedResults.map((vet) => (
                      <Card 
                        key={vet.placeId}
                        className="cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
                        onClick={() => selectVet(vet)}
                      >
                        <div className="flex">
                          {vet.photos && vet.photos.length > 0 && (
                            <div className="w-1/4 min-w-[100px] relative hidden md:block">
                              <div 
                                className="absolute inset-0 bg-center bg-cover" 
                                style={{ backgroundImage: `url(${vet.photos[0].url})` }}
                              />
                            </div>
                          )}
                          <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-base">{vet.name}</h4>
                                  {vet.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-medium">{vet.rating}</span>
                                      {vet.userRatingsTotal && (
                                        <span className="text-xs text-muted-foreground">({vet.userRatingsTotal})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{vet.address}</p>
                                {vet.phone && (
                                  <p className="text-sm flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {vet.phone}
                                  </p>
                                )}
                                {vet.website && (
                                  <a 
                                    href={vet.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                                  >
                                    <ExternalLink className="h-3 w-3" /> Website
                                  </a>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    ))}
                    
                    {/* Load More button */}
                    {searchResults.length > displayedResults.length && (
                      <div className="text-center mt-4">
                        <Button 
                          variant="outline" 
                          onClick={loadMoreResults} 
                          className="w-full sm:w-auto"
                        >
                          Load More Results ({displayedResults.length} of {searchResults.length})
                        </Button>
                      </div>
                    )}
                    
                    {/* No results case (shouldn't happen with sorting only) */}
                    {searchResults.length > 0 && displayedResults.length === 0 && (
                      <div className="text-center py-8 bg-muted/20 rounded-lg border">
                        <p className="text-muted-foreground">No results to display.</p>
                        <Button 
                          variant="link" 
                          onClick={() => {
                            setSortBy("default");
                            processSearchResults(searchResults);
                          }}
                          className="mt-2"
                        >
                          Reset Sorting
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Enter Veterinarian Details Manually</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Vet Name</label>
                      <Input 
                        placeholder="Enter veterinarian name"
                        value={selectedVet?.name || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          setSelectedVet(prev => prev ? {...prev, name} : {
                            placeId: "manual",
                            name,
                            address: "",
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Address</label>
                      <Input 
                        placeholder="Enter address"
                        value={selectedVet?.address || ""}
                        onChange={(e) => {
                          const address = e.target.value;
                          setSelectedVet(prev => prev ? {...prev, address} : {
                            placeId: "manual",
                            name: "",
                            address,
                          });
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone</label>
                      <Input 
                        placeholder="Enter phone number"
                        value={selectedVet?.phone || ""}
                        onChange={(e) => {
                          const phone = e.target.value;
                          setSelectedVet(prev => prev ? {...prev, phone} : {
                            placeId: "manual",
                            name: "",
                            address: "",
                            phone,
                          });
                        }}
                      />
                    </div>
                    <div className="pt-2">
                      <Button 
                        onClick={() => setActiveTab("details")}
                        className="w-full"
                        disabled={!selectedVet?.name}
                      >
                        Continue to Appointment Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DialogContent>
        </Dialog>
      </div>

      {consultations.length > 0 ? (
        <div className="space-y-4">
          {consultations.map((consultation) => {
            const { dateTime } = formatDateTime(consultation.scheduledDate);
            return (
              <div
                key={consultation.id}
                className="border rounded-lg p-4 space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">
                      {dateTime}
                    </span>
                  </div>
                  {consultation.status === "scheduled" && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => cancelConsultation.mutate(consultation.id)}
                    >
                      <X className="h-4 w-4 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
                {consultation.reason && (
                  <p className="text-muted-foreground">{consultation.reason}</p>
                )}
                <p className="text-sm font-medium">
                  Status:{" "}
                  <span
                    className={`capitalize ${
                      consultation.status === "cancelled"
                        ? "text-destructive"
                        : consultation.status === "completed"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {consultation.status}
                  </span>
                </p>
                {consultation.vetNotes && (
                  <div className="mt-2">
                    <p className="font-medium">Vet Notes:</p>
                    <p className="text-muted-foreground">{consultation.vetNotes}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground">No consultations scheduled.</p>
      )}
    </div>
  );
}