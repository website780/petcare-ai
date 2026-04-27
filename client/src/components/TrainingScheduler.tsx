import { useState } from "react";
import { useParams } from "wouter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type Pet, type TrainingAppointment } from "@shared/schema";
import { format } from "date-fns";
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
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

interface Photo {
  reference: string;
  width: number;
  height: number;
  url: string;
}

interface TrainerLocation {
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

interface TrainingSchedulerProps {
  pet: Pet;
}

export function TrainingScheduler({ pet }: TrainingSchedulerProps) {
  const { id } = useParams();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("details");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<TrainerLocation[]>([]);
  const [displayedResults, setDisplayedResults] = useState<TrainerLocation[]>([]);
  const [selectedTrainer, setSelectedTrainer] = useState<TrainerLocation | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "default">("default");
  const [resultsPage, setResultsPage] = useState(1);
  const resultsPerPage = 4;

  const { data: appointments = [], isLoading } = useQuery<TrainingAppointment[]>({
    queryKey: [`/api/pets/${id}/training`],
  });
  
  // Function to process search results with sorting
  const processSearchResults = (results: TrainerLocation[]) => {
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
  
  // Function to search for trainers using Google Maps Places API
  const searchTrainers = async () => {
    if (!searchLocation) {
      toast({
        title: "Location required",
        description: "Please enter a location to search for trainers",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Fetch real trainer data from our API endpoint
      const petType = pet.species || '';
      const response = await fetch(`/api/places/search?location=${encodeURIComponent(searchLocation)}&petType=${encodeURIComponent(petType)}&serviceType=trainer`);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Special handling for "no results found" cases
        if (response.status === 404 && errorData.error === "No trainer results found") {
          setSearchResults([]);
          toast({
            title: "No trainers found",
            description: "No pet trainers were found in this location. Try searching in a different area or with different keywords.",
            variant: "default",
          });
          setIsSearching(false);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to search for trainers');
      }
      
      const data = await response.json();
      
      // Open Google Maps in a new tab to show results visually
      if (data.searchLocation?.location) {
        const { lat, lng } = data.searchLocation.location;
        const searchQuery = `${petType} pet trainer near ${searchLocation}`;
        const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${lat},${lng},14z`;
        window.open(googleMapsUrl, '_blank');
      }
      
      if (data.groomers && data.groomers.length > 0) {
        // Process the results with our sorting
        processSearchResults(data.groomers);
        
        toast({
          title: "Search complete",
          description: `Found ${data.groomers.length} trainers in ${data.searchLocation?.address || searchLocation}`,
        });
      } else {
        setSearchResults([]);
        setDisplayedResults([]);
        toast({
          title: "No trainers found",
          description: "Try a different location or search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching for trainers:", error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search for trainers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // When a trainer is selected, update the form with real Google Maps data
  const selectTrainer = (trainer: TrainerLocation) => {
    setSelectedTrainer(trainer);
    
    // Switch to the appointment details tab
    setActiveTab("details");
    
    toast({
      title: "Trainer selected",
      description: `${trainer.name} has been added to your appointment details.`,
    });
  };

  const scheduleTraining = useMutation({
    mutationFn: async (data: {
      scheduledDate: string;
      trainingType: string;
      notes?: string;
      trainerName?: string;
      trainerAddress?: string;
      trainerPhone?: string;
    }) => {
      const response = await apiRequest("POST", `/api/pets/${id}/training`, {
        ...data,
        userId: pet.userId // Add the userId from the pet object
      });
      if (!response.ok) throw new Error('Failed to schedule training session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}/training`] });
      toast({ title: "Training session scheduled successfully" });
      setIsDialogOpen(false);
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to schedule training session",
      });
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: async (appointmentId: number) => {
      const response = await apiRequest("POST", `/api/training/${appointmentId}/cancel`);
      if (!response.ok) throw new Error('Failed to cancel training session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}/training`] });
      toast({ title: "Training session cancelled" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to cancel training session",
      });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Training Schedule</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>Schedule Training</Button>
          </DialogTrigger>
          <DialogContent className="p-4 md:p-6 w-[95vw] max-w-[850px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Schedule Training Session</DialogTitle>
              <DialogDescription>
                Set up a training session for {pet.name} and find a trainer
              </DialogDescription>
            </DialogHeader>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Appointment Details</TabsTrigger>
                <TabsTrigger value="trainer">Find a Trainer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                {selectedTrainer && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Selected Trainer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="text-sm font-medium">{selectedTrainer.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedTrainer.address}</div>
                      {selectedTrainer.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" /> {selectedTrainer.phone}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-7" 
                        onClick={() => setActiveTab("trainer")}
                      >
                        Change Trainer
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const date = formData.get('date') as string;
                    const time = formData.get('time') as string;
                    const trainingType = formData.get('trainingType') as string;
                    const notes = formData.get('notes') as string;
                    
                    if (date && time && trainingType) {
                      const scheduledDate = new Date(`${date}T${time}`).toISOString();
                      const trainerInfo = selectedTrainer ? {
                        trainerName: selectedTrainer.name,
                        trainerAddress: selectedTrainer.address,
                        trainerPhone: selectedTrainer.phone || ""
                      } : {};
                      
                      scheduleTraining.mutate({ 
                        scheduledDate, 
                        trainingType, 
                        notes,
                        ...trainerInfo
                      });
                    }
                  }}
                  className="space-y-4 mt-4"
                >
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date</label>
                    <Input
                      type="date"
                      name="date"
                      min={format(new Date(), 'yyyy-MM-dd')}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Time</label>
                    <Input type="time" name="time" required />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Training Type</label>
                    <select
                      name="trainingType"
                      className="w-full p-2 border rounded-md"
                      required
                    >
                      <option value="">Select training type</option>
                      <option value="basic obedience">Basic Obedience</option>
                      <option value="advanced tricks">Advanced Tricks</option>
                      <option value="behavior correction">Behavior Correction</option>
                      <option value="agility training">Agility Training</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Notes (optional)</label>
                    <Textarea
                      name="notes"
                      placeholder="Add any special instructions or notes"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Schedule Session
                  </Button>
                </form>
              </TabsContent>
                
              <TabsContent value="trainer" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Find a Trainer</CardTitle>
                    <CardDescription>
                      Search for trainers in your area to schedule your {pet.species}'s training session. 
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
                        onClick={searchTrainers} 
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
                        Search will open Google Maps in a new tab. Select a trainer below or manually enter details.
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
                    
                    {displayedResults.map((trainer) => (
                      <Card 
                        key={trainer.placeId}
                        className="cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
                        onClick={() => selectTrainer(trainer)}
                      >
                        <div className="flex">
                          {trainer.photos && trainer.photos.length > 0 && (
                            <div className="w-1/4 min-w-[100px] relative hidden md:block">
                              <div 
                                className="absolute inset-0 bg-center bg-cover" 
                                style={{ backgroundImage: `url(${trainer.photos[0].url})` }}
                              />
                            </div>
                          )}
                          <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-base">{trainer.name}</h4>
                                  {trainer.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-medium">{trainer.rating}</span>
                                      {trainer.userRatingsTotal && (
                                        <span className="text-xs text-muted-foreground">({trainer.userRatingsTotal})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{trainer.address}</p>
                                {trainer.phone && (
                                  <p className="text-sm flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {trainer.phone}
                                  </p>
                                )}
                                {trainer.website && (
                                  <a 
                                    href={trainer.website} 
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
                    <CardTitle className="text-base">Enter Trainer Details Manually</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Trainer Name</label>
                      <Input 
                        placeholder="Enter trainer name"
                        value={selectedTrainer?.name || ""}
                        onChange={(e) => {
                          const name = e.target.value;
                          setSelectedTrainer(prev => prev ? {...prev, name} : {
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
                        value={selectedTrainer?.address || ""}
                        onChange={(e) => {
                          const address = e.target.value;
                          setSelectedTrainer(prev => prev ? {...prev, address} : {
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
                        value={selectedTrainer?.phone || ""}
                        onChange={(e) => {
                          const phone = e.target.value;
                          setSelectedTrainer(prev => prev ? {...prev, phone} : {
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
                        disabled={!selectedTrainer?.name}
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

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="animate-pulse h-24 bg-muted rounded-lg" />
          ))}
        </div>
      ) : appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const { dateTime } = formatDateTime(appointment.scheduledDate);
            return (
              <div
                key={appointment.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-muted-foreground" />
                    <span className="font-medium text-lg">
                      {dateTime}
                    </span>
                  </div>
                  {appointment.status === "scheduled" && (
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => cancelAppointment.mutate(appointment.id)}
                      className="w-full sm:w-auto py-6"
                    >
                      <X className="h-5 w-5 mr-2" />
                      Cancel
                    </Button>
                  )}
                </div>
                <p className="capitalize font-medium text-lg">
                  Type: {appointment.trainingType}
                </p>
                {appointment.notes && (
                  <p className="text-muted-foreground text-lg">{appointment.notes}</p>
                )}
                <p className="text-lg font-medium">
                  Status:{" "}
                  <span
                    className={`capitalize ${
                      appointment.status === "cancelled"
                        ? "text-destructive"
                        : appointment.status === "completed"
                        ? "text-green-600"
                        : "text-blue-600"
                    }`}
                  >
                    {appointment.status}
                  </span>
                </p>
                {appointment.progress && (
                  <p className="text-muted-foreground text-lg">
                    Progress: {appointment.progress}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-lg text-center py-8">
          No training sessions scheduled.
        </p>
      )}
    </div>
  );
}