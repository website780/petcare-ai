import { useState, useEffect, useRef } from "react";
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
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { format, differenceInMinutes, differenceInDays } from "date-fns";
import { useForm } from "react-hook-form";
import { Pet, GroomingAppointment } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Clock, Calendar as CalendarIcon, X, MapPin, Search, Star, Phone, ExternalLink } from "lucide-react";
import { formatDateTime, formatTimeForInput, formatDateForInput } from "@/lib/dateUtils";

interface AppointmentFormData {
  scheduledDate: Date;
  serviceType: "full grooming" | "nail trimming" | "bath" | "brushing";
  notes?: string;
  time: string;
  groomerName?: string;
  groomerAddress?: string;
  groomerPhone?: string;
}

interface Photo {
  reference: string;
  width: number;
  height: number;
  url: string;
}

interface GroomerLocation {
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

interface GroomingSchedulerProps {
  pet: Pet;
}

export function GroomingScheduler({ pet }: GroomingSchedulerProps) {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [lastNotificationCheck, setLastNotificationCheck] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<string>("details");
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<GroomerLocation[]>([]);
  const [displayedResults, setDisplayedResults] = useState<GroomerLocation[]>([]);
  const [selectedGroomer, setSelectedGroomer] = useState<GroomerLocation | null>(null);
  const [sortBy, setSortBy] = useState<"rating" | "distance" | "default">("default");
  const [resultsPage, setResultsPage] = useState(1);
  const resultsPerPage = 4;

  const { data: appointments = [], isLoading } = useQuery<GroomingAppointment[]>({
    queryKey: [`/api/pets/${pet.id}/grooming`],
  });

  // Check for upcoming appointments and send notifications
  useEffect(() => {
    const checkUpcomingAppointments = () => {
      const now = new Date();
      const lastCheck = lastNotificationCheck;

      appointments.forEach(appointment => {
        if (appointment.status !== 'scheduled') return;

        const appointmentDate = new Date(appointment.scheduledDate);
        const minutesUntil = differenceInMinutes(appointmentDate, now);
        const daysUntil = differenceInDays(appointmentDate, now);

        // Show notifications for upcoming appointments
        if (appointmentDate > now) {
          // Only show notifications if time has passed since last check
          const minutesSinceLastCheck = differenceInMinutes(now, lastCheck);
          
          // 5 days notification
          if (daysUntil === 5 && minutesUntil % (24 * 60) <= 1 && minutesSinceLastCheck >= 1) {
            toast({
              title: "Upcoming Grooming Appointment",
              description: `${pet.name}'s grooming is in 5 days on ${format(appointmentDate, 'PPP p')}`,
              duration: 10000,
            });
          }

          // 1 day notification
          if (daysUntil === 1 && minutesUntil % (24 * 60) <= 1 && minutesSinceLastCheck >= 1) {
            toast({
              title: "Grooming Tomorrow",
              description: `${pet.name}'s grooming is tomorrow at ${format(appointmentDate, 'p')}`,
              duration: 10000,
            });
          }

          // 30 minutes notification
          if (minutesUntil === 30 && minutesSinceLastCheck >= 1) {
            toast({
              title: "Grooming Soon",
              description: `${pet.name}'s grooming is in 30 minutes!`,
              duration: 15000,
            });
          }
        }
      });

      if (differenceInMinutes(now, lastCheck) >= 1) {
        setLastNotificationCheck(now);
      }
    };

    // Check immediately and then every minute
    checkUpcomingAppointments();
    const interval = setInterval(checkUpcomingAppointments, 60000);
    return () => clearInterval(interval);
  }, [appointments, toast, pet.name, lastNotificationCheck]);

  // Function to process search results with sorting only
  const processSearchResults = (results: GroomerLocation[]) => {
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
  
  // Function to search for groomers using Google Maps Places API
  const searchGroomers = async () => {
    if (!searchLocation) {
      toast({
        title: "Location required",
        description: "Please enter a location to search for groomers",
        variant: "destructive",
      });
      return;
    }

    setIsSearching(true);
    setSearchResults([]);
    
    try {
      // Fetch real groomer data from our API endpoint
      const petType = pet.species || '';
      const response = await fetch(`/api/places/search?location=${encodeURIComponent(searchLocation)}&petType=${encodeURIComponent(petType)}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        
        // Special handling for "no results found" cases
        if (response.status === 404 && errorData.error === "No groomer results found") {
          setSearchResults([]);
          toast({
            title: "No groomers found",
            description: "No pet groomers were found in this location. Try searching in a different area or with different keywords.",
            variant: "default",
          });
          setIsSearching(false);
          return;
        }
        
        throw new Error(errorData.error || 'Failed to search for groomers');
      }
      
      const data = await response.json();
      
      // Open Google Maps in a new tab to show results visually
      if (data.searchLocation?.location) {
        const { lat, lng } = data.searchLocation.location;
        const searchQuery = `${petType} pet groomers near ${searchLocation}`;
        const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(searchQuery)}/@${lat},${lng},14z`;
        window.open(googleMapsUrl, '_blank');
      }
      
      if (data.groomers && data.groomers.length > 0) {
        // Process the results with our sorting and filtering
        processSearchResults(data.groomers);
        
        toast({
          title: "Search complete",
          description: `Found ${data.groomers.length} groomers in ${data.searchLocation?.address || searchLocation}`,
        });
      } else {
        setSearchResults([]);
        setDisplayedResults([]);
        toast({
          title: "No groomers found",
          description: "Try a different location or search term",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error searching for groomers:", error);
      toast({
        title: "Search failed",
        description: error instanceof Error ? error.message : "Failed to search for groomers. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSearching(false);
    }
  };
  
  // When a groomer is selected, update the form with real Google Maps data
  const selectGroomer = (groomer: GroomerLocation) => {
    setSelectedGroomer(groomer);
    
    // Update form fields with Google Maps groomer information
    form.setValue("groomerName", groomer.name);
    form.setValue("groomerAddress", groomer.address);
    form.setValue("groomerPhone", groomer.phone || "");
    
    // Create info notes from Google Maps data
    const infoNotes = [
      groomer.rating ? `Rating: ${groomer.rating}/5` : '',
      groomer.userRatingsTotal ? `(${groomer.userRatingsTotal} reviews)` : '',
      groomer.website ? `Website: ${groomer.website}` : '',
      groomer.url ? `Google Maps URL: ${groomer.url}` : '',
      groomer.openNow !== undefined ? `Open at time of booking: ${groomer.openNow ? 'Yes' : 'No'}` : ''
    ].filter(Boolean).join('\n');
    
    // Add Google Maps info to appointment notes if available
    if (infoNotes) {
      const currentNotes = form.getValues("notes") || '';
      if (!currentNotes.includes('Google Maps Information')) {
        form.setValue("notes", currentNotes ? 
          `${currentNotes}\n\n----- Google Maps Information -----\n${infoNotes}` : 
          `Google Maps Information:\n${infoNotes}`
        );
      }
    }
    
    // Switch to the appointment details tab
    setActiveTab("details");
    
    toast({
      title: "Groomer selected",
      description: `${groomer.name} has been added to your appointment details.`,
    });
  };

  const form = useForm<AppointmentFormData>({
    defaultValues: {
      scheduledDate: new Date(),
      serviceType: "full grooming",
      notes: "",
      time: formatTimeForInput(new Date()),
      groomerName: "",
      groomerAddress: "",
      groomerPhone: "",
    },
  });

  const scheduleAppointment = useMutation({
    mutationFn: async (data: AppointmentFormData) => {
      const scheduledDateTime = new Date(data.scheduledDate);
      const [hours, minutes] = data.time.split(":").map(Number);
      scheduledDateTime.setHours(hours, minutes);

      // Prepare notes with groomer information if provided
      let appointmentNotes = data.notes || "";
      if (data.groomerName) {
        const groomerInfo = [
          `Groomer: ${data.groomerName}`,
          data.groomerAddress ? `Address: ${data.groomerAddress}` : "",
          data.groomerPhone ? `Phone: ${data.groomerPhone}` : ""
        ].filter(Boolean).join("\n");
        
        appointmentNotes = appointmentNotes 
          ? `${appointmentNotes}\n\n${groomerInfo}` 
          : groomerInfo;
      }

      await apiRequest("POST", `/api/pets/${pet.id}/grooming`, {
        scheduledDate: scheduledDateTime.toISOString(),
        serviceType: data.serviceType,
        notes: appointmentNotes,
        userId: pet.userId,
        // Include groomer details as separate fields
        groomerName: data.groomerName,
        groomerAddress: data.groomerAddress,
        groomerPhone: data.groomerPhone
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}/grooming`] });
      toast({
        title: "Appointment scheduled",
        description: "Your grooming appointment has been scheduled successfully",
      });
      setIsDialogOpen(false);
      form.reset();
    },
  });

  const cancelAppointment = useMutation({
    mutationFn: async (appointmentId: number) => {
      await apiRequest("POST", `/api/grooming/${appointmentId}/cancel`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${pet.id}/grooming`] });
      toast({ title: "Appointment cancelled" });
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
      <div className="flex items-center justify-between flex-col sm:flex-row gap-4">
        <h3 className="text-2xl font-semibold">Grooming Appointments</h3>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto py-6 text-lg">Schedule Grooming</Button>
          </DialogTrigger>
          <DialogContent className="p-0 border-none w-[95vw] max-w-[850px] max-h-[90vh] overflow-hidden rounded-[2.5rem] shadow-2xl">
            <div className="bg-gradient-to-r from-orange-400 to-[#ff6b4a] h-2" />
            <div className="p-0 overflow-y-auto max-h-[calc(90vh-8px)]">
              <div className="p-8 md:p-10 pb-4">
                <DialogHeader>
                  <DialogTitle className="text-xl">Schedule a Grooming Appointment</DialogTitle>
                  <DialogDescription>
                    Set up your grooming appointment and find a groomer for {pet.name}
                  </DialogDescription>
                </DialogHeader>
                
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Appointment Details</TabsTrigger>
                <TabsTrigger value="groomer">Find a Groomer</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="space-y-4 mt-4">
                {selectedGroomer && (
                  <Card className="bg-primary/5 border-primary/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Selected Groomer
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="text-sm font-medium">{selectedGroomer.name}</div>
                      <div className="text-sm text-muted-foreground">{selectedGroomer.address}</div>
                      {selectedGroomer.phone && (
                        <div className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                          <Phone className="h-3 w-3" /> {selectedGroomer.phone}
                        </div>
                      )}
                    </CardContent>
                    <CardFooter className="pt-0">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-xs h-7" 
                        onClick={() => setActiveTab("groomer")}
                      >
                        Change Groomer
                      </Button>
                    </CardFooter>
                  </Card>
                )}
                
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit((data) => scheduleAppointment.mutate(data))}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <FormField
                          control={form.control}
                          name="scheduledDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg">Date</FormLabel>
                              <FormControl>
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  className="rounded-md border mx-auto"
                                  disabled={(date) => date < new Date()}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="time"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg">Time</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Clock className="mr-2 h-5 w-5 text-muted-foreground" />
                                  <Input
                                    type="time"
                                    {...field}
                                    className="w-full text-lg p-6"
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="serviceType"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-lg">Service Type</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger className="w-full p-6 text-lg">
                                    <SelectValue placeholder="Select a service" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="full grooming" className="text-lg p-4">Full Grooming</SelectItem>
                                  <SelectItem value="nail trimming" className="text-lg p-4">Nail Trimming</SelectItem>
                                  <SelectItem value="bath" className="text-lg p-4">Bath</SelectItem>
                                  <SelectItem value="brushing" className="text-lg p-4">Brushing</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        
                        {!selectedGroomer && (
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">No groomer selected</p>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => setActiveTab("groomer")}
                            >
                              Find a Groomer
                            </Button>
                          </div>
                        )}
                        
                        <FormField
                          control={form.control}
                          name="groomerName"
                          render={({ field }) => (
                            <FormItem className={!selectedGroomer ? "hidden" : ""}>
                              <FormLabel>Groomer Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="groomerAddress"
                          render={({ field }) => (
                            <FormItem className={!selectedGroomer ? "hidden" : ""}>
                              <FormLabel>Groomer Address</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="groomerPhone"
                          render={({ field }) => (
                            <FormItem className={!selectedGroomer ? "hidden" : ""}>
                              <FormLabel>Groomer Phone</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-lg">Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Any special instructions or requests"
                              className="resize-none text-lg p-4 min-h-[100px]"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end pt-4">
                      <Button
                        type="submit"
                        disabled={scheduleAppointment.isPending}
                        className="w-full sm:w-auto py-6 text-lg"
                      >
                        {scheduleAppointment.isPending
                          ? "Scheduling..."
                          : "Schedule Appointment"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </TabsContent>
              
              <TabsContent value="groomer" className="space-y-4 mt-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">Find a Groomer for {pet.name}</CardTitle>
                    <CardDescription>
                      Search for groomers in your area to schedule your {pet.species}'s grooming appointment. 
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
                          For best results with ZIP codes, include complete 5-digit code (e.g., 78641)
                        </div>
                      </div>
                      <Button 
                        onClick={searchGroomers} 
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
                        Search will open Google Maps in a new tab. Select a groomer below or manually enter details.
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setSearchLocation("78641")}>ZIP: 78641</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setSearchLocation("Austin, TX")}>Austin, TX</Badge>
                        <Badge variant="outline" className="cursor-pointer hover:bg-accent" onClick={() => setSearchLocation("12345 Main St")}>Address Example</Badge>
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
                    {displayedResults.map((groomer, index) => (
                      <Card 
                        key={groomer.placeId}
                        className="cursor-pointer hover:bg-accent/50 transition-colors overflow-hidden"
                        onClick={() => selectGroomer(groomer)}
                      >
                        <div className="flex">
                          {groomer.photos && groomer.photos.length > 0 && (
                            <div className="w-1/4 min-w-[100px] relative hidden md:block">
                              <div 
                                className="absolute inset-0 bg-center bg-cover" 
                                style={{ backgroundImage: `url(${groomer.photos[0].url})` }}
                              />
                            </div>
                          )}
                          <CardContent className="p-4 flex-1">
                            <div className="flex justify-between items-start gap-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium text-base">{groomer.name}</h4>
                                  {groomer.rating && (
                                    <div className="flex items-center gap-1">
                                      <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                      <span className="text-sm font-medium">{groomer.rating}</span>
                                      {groomer.userRatingsTotal && (
                                        <span className="text-xs text-muted-foreground">({groomer.userRatingsTotal})</span>
                                      )}
                                    </div>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground">{groomer.address}</p>
                                {groomer.phone && (
                                  <p className="text-sm flex items-center gap-1">
                                    <Phone className="h-3 w-3" /> {groomer.phone}
                                  </p>
                                )}
                                {groomer.website && (
                                  <a 
                                    href={groomer.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs text-primary flex items-center gap-1 hover:underline"
                                  >
                                    <ExternalLink className="h-3 w-3" /> Website
                                  </a>
                                )}
                              </div>
                              <div className="flex flex-col items-end gap-2">
                                {groomer.openNow !== undefined && (
                                  <Badge variant={groomer.openNow ? "default" : "secondary"} className="text-xs">
                                    {groomer.openNow ? "Open Now" : "Closed"}
                                  </Badge>
                                )}
                                {groomer.url && (
                                  <a 
                                    href={groomer.url} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground"
                                  >
                                    <MapPin className="h-3 w-3" /> Maps
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
                    <CardTitle className="text-base">Enter Groomer Details Manually</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Groomer Name</label>
                      <Input 
                        value={form.getValues("groomerName") || ""}
                        onChange={(e) => form.setValue("groomerName", e.target.value)}
                        placeholder="Enter groomer's business name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Groomer Address</label>
                      <Input 
                        value={form.getValues("groomerAddress") || ""}
                        onChange={(e) => form.setValue("groomerAddress", e.target.value)}
                        placeholder="Enter complete address"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Phone Number</label>
                      <Input 
                        value={form.getValues("groomerPhone") || ""}
                        onChange={(e) => form.setValue("groomerPhone", e.target.value)}
                        placeholder="Phone number for appointments"
                      />
                    </div>
                    
                    <Button 
                      className="w-full" 
                      variant="outline"
                      onClick={() => {
                        const groomerName = form.getValues("groomerName");
                        if (groomerName) {
                          setSelectedGroomer({
                            placeId: `manual-${Date.now()}`,
                            name: groomerName,
                            address: form.getValues("groomerAddress") || "No address provided",
                            phone: form.getValues("groomerPhone") || undefined
                          });
                          setActiveTab("details");
                          toast({
                            title: "Groomer details saved",
                            description: "Groomer information has been added to your appointment."
                          });
                        } else {
                          toast({
                            title: "Groomer name required",
                            description: "Please enter at least the groomer's name.",
                            variant: "destructive"
                          });
                        }
                      }}
                    >
                      Save & Continue
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
                </Tabs>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {appointments.length > 0 ? (
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
                  Service: {appointment.serviceType}
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
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-muted-foreground text-lg text-center py-8">
          No grooming appointments scheduled.
        </p>
      )}
    </div>
  );
}