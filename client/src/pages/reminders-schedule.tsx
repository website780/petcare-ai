import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Pet, type Reminder, type VetConsultation, type GroomingAppointment, type TrainingAppointment } from "@shared/schema";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Helper function to ensure consistent date handling
const formatDateTime = (dateStr: string | Date) => {
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  return {
    date: format(date, 'MMM d, yyyy'),
    time: format(date, 'h:mm a')
  };
};

export default function RemindersSchedulePage() {
  const { id } = useParams();
  const { toast } = useToast();

  const { data: pet, isLoading: isPetLoading } = useQuery<Pet>({
    queryKey: [`/api/pets/${id}`],
  });

  const { data: reminders = [], isLoading: isRemindersLoading } = useQuery<Reminder[]>({
    queryKey: [`/api/pets/${id}/reminders`],
    enabled: !!id,
  });

  const { data: vetConsultations = [], isLoading: isConsultationsLoading } = useQuery<VetConsultation[]>({
    queryKey: [`/api/pets/${id}/consultations`],
    enabled: !!id,
  });

  const { data: groomingAppointments = [], isLoading: isGroomingLoading } = useQuery<GroomingAppointment[]>({
    queryKey: [`/api/pets/${id}/grooming`],
    enabled: !!id,
  });

  const { data: trainingAppointments = [], isLoading: isTrainingLoading } = useQuery<TrainingAppointment[]>({
    queryKey: [`/api/pets/${id}/training`],
    enabled: !!id,
  });

  const updateVetConsultation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<VetConsultation> }) => {
      const response = await apiRequest("PATCH", `/api/consultations/${id}`, {
        ...data,
        status: "scheduled"
      });
      if (!response.ok) throw new Error('Failed to update consultation');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}/consultations`] });
      toast({ title: "Consultation updated successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update consultation",
      });
    },
  });

  const updateGroomingAppointment = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<GroomingAppointment> }) => {
      const response = await apiRequest("PATCH", `/api/grooming/${id}`, {
        ...data,
        status: "scheduled"
      });
      if (!response.ok) throw new Error('Failed to update grooming appointment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}/grooming`] });
      toast({ title: "Grooming appointment updated successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update grooming appointment",
      });
    },
  });

  const updateTrainingAppointment = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<TrainingAppointment> }) => {
      const response = await apiRequest("PATCH", `/api/training/${id}`, {
        ...data,
        status: "scheduled"
      });
      if (!response.ok) throw new Error('Failed to update training appointment');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/pets/${id}/training`] });
      toast({ title: "Training appointment updated successfully" });
    },
    onError: () => {
      toast({
        variant: "destructive",
        title: "Failed to update training appointment",
      });
    },
  });

  const isLoading = isPetLoading || isRemindersLoading || isConsultationsLoading || isGroomingLoading || isTrainingLoading;

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

  type Event = {
    type: 'reminder' | 'consultation' | 'grooming' | 'training';
    id: number;
    title: string;
    description?: string;
    date: Date;
    formattedDate: string;
    formattedTime: string;
    status: string;
    recurring?: string;
    originalData: Reminder | VetConsultation | GroomingAppointment | TrainingAppointment;
  };

  const allEvents: Event[] = [
    ...reminders.map(reminder => {
      const dateTime = formatDateTime(reminder.dueDate);
      return {
        type: 'reminder' as const,
        id: reminder.id,
        title: reminder.title,
        description: reminder.description || undefined,
        date: new Date(reminder.dueDate),
        formattedDate: dateTime.date,
        formattedTime: reminder.dueTime || dateTime.time,
        status: reminder.completed ? 'completed' : 'pending',
        recurring: reminder.recurring || undefined,
        originalData: reminder
      };
    }),
    ...vetConsultations.map(consultation => {
      const dateTime = formatDateTime(consultation.scheduledDate);
      return {
        type: 'consultation' as const,
        id: consultation.id,
        title: 'Vet Consultation',
        description: consultation.reason || undefined,
        date: new Date(consultation.scheduledDate),
        formattedDate: dateTime.date,
        formattedTime: dateTime.time,
        status: consultation.status,
        originalData: consultation
      };
    }),
    ...groomingAppointments.map(appointment => {
      const dateTime = formatDateTime(appointment.scheduledDate);
      return {
        type: 'grooming' as const,
        id: appointment.id,
        title: `${appointment.serviceType} Session`,
        date: new Date(appointment.scheduledDate),
        formattedDate: dateTime.date,
        formattedTime: dateTime.time,
        status: appointment.status,
        originalData: appointment
      };
    }),
    ...trainingAppointments.map(appointment => {
      const dateTime = formatDateTime(appointment.scheduledDate);
      return {
        type: 'training' as const,
        id: appointment.id,
        title: `Training: ${appointment.trainingType}`,
        description: appointment.notes || undefined,
        date: new Date(appointment.scheduledDate),
        formattedDate: dateTime.date,
        formattedTime: dateTime.time,
        status: appointment.status,
        originalData: appointment
      };
    })
  ].sort((a, b) => a.date.getTime() - b.date.getTime());

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
            <CardTitle className="text-2xl md:text-3xl">{pet.name}'s Schedule</CardTitle>
          </CardHeader>
          <CardContent className="p-4 md:p-6">
            <div className="space-y-6">
              {allEvents.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No scheduled events or reminders yet
                </p>
              ) : (
                allEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`p-4 border rounded-lg ${
                      event.status === 'completed' ? 'bg-muted' : 'bg-card'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{event.title}</h3>
                        {event.description && (
                          <p className="text-muted-foreground mb-2">{event.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {event.formattedDate}
                          </div>
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1" />
                            {event.formattedTime}
                          </div>
                          {event.recurring && (
                            <span className="capitalize">Repeats {event.recurring}</span>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {(event.type === 'consultation' || event.type === 'grooming' || event.type === 'training') && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Edit
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Edit {event.title}</DialogTitle>
                              </DialogHeader>
                              <form
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  const formData = new FormData(e.currentTarget);
                                  const date = formData.get('date') as string;
                                  const time = formData.get('time') as string;

                                  if (date && time) {
                                    const scheduledDate = new Date(`${date}T${time}`);

                                    if (event.type === 'consultation') {
                                      updateVetConsultation.mutate({
                                        id: event.id,
                                        data: { scheduledDate }
                                      });
                                    } else if (event.type === 'grooming') {
                                      updateGroomingAppointment.mutate({
                                        id: event.id,
                                        data: { scheduledDate }
                                      });
                                    } else if (event.type === 'training') {
                                      updateTrainingAppointment.mutate({
                                        id: event.id,
                                        data: { scheduledDate }
                                      });
                                    }
                                  }
                                }}
                                className="space-y-4 mt-4"
                              >
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Date
                                  </label>
                                  <Input
                                    type="date"
                                    name="date"
                                    defaultValue={format(event.date, 'yyyy-MM-dd')}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <label className="text-sm font-medium">
                                    Time
                                  </label>
                                  <Input
                                    type="time"
                                    name="time"
                                    defaultValue={format(event.date, 'HH:mm')}
                                  />
                                </div>
                                <Button type="submit" className="w-full">
                                  Save Changes
                                </Button>
                              </form>
                            </DialogContent>
                          </Dialog>
                        )}
                        <span className={`capitalize px-2 py-1 rounded text-sm ${
                          event.status === 'completed' ? 'bg-green-100 text-green-800' :
                            event.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                              'bg-blue-100 text-blue-800'
                        }`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}