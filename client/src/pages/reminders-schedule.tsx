import { useState } from "react";
import { useParams, Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type Pet, type Reminder, type VetConsultation, type GroomingAppointment, type TrainingAppointment } from "@shared/schema";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import { Header } from "@/components/Header";
import { format, parseISO } from "date-fns";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

// Helper function to ensure consistent date handling
const formatDateTime = (dateStr: string | Date | null | undefined) => {
  if (!dateStr) return { date: 'N/A', time: 'N/A' };
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isNaN(date.getTime())) return { date: 'Invalid Date', time: 'Invalid Time' };
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
    <div className="min-h-screen bg-[#fafafa]">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl relative z-10">
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link href={`/pet/${id}`}>
            <Button 
                variant="ghost" 
                className="hover:bg-[#ff6b4a]/10 hover:text-[#ff6b4a] transition-all group rounded-2xl"
            >
              <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              Back to Profile
            </Button>
          </Link>
        </div>

        <Card className="border border-black/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.04)] rounded-[2.5rem] overflow-hidden bg-white/80 backdrop-blur-xl">
          <div className="h-2 bg-gradient-to-r from-blue-500 to-[#ff6b4a]" />
          <CardHeader className="p-8 md:p-10 pb-4">
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-[1.5rem] bg-black text-white flex items-center justify-center shadow-lg shadow-black/20">
                <Calendar className="h-8 w-8" />
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight mb-1">{pet.name}'s Timeline</h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-widest leading-none">Activity & Appointment Schedule</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8 md:p-10">
            <div className="space-y-4">
              {allEvents.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-[2rem] border border-dashed border-black/[0.05]">
                   <Clock className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                   <p className="text-sm font-black text-muted-foreground uppercase tracking-widest">Horizon Clear</p>
                   <p className="text-xs font-medium text-muted-foreground/60 mt-2">No upcoming events detected in clinical range.</p>
                </div>
              ) : (
                allEvents.map((event, index) => (
                  <div
                    key={index}
                    className={`group relative p-8 rounded-[2rem] border transition-all duration-500 ${
                      event.status === 'completed' 
                        ? 'bg-muted/30 border-transparent opacity-60' 
                        : 'bg-white border-black/[0.04] shadow-sm hover:shadow-2xl hover:-translate-y-1'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-center gap-3">
                           <div className={`w-2 h-2 rounded-full ${
                              event.type === 'consultation' ? 'bg-red-500' :
                              event.type === 'grooming' ? 'bg-blue-500' :
                              event.type === 'training' ? 'bg-purple-500' : 'bg-[#ff6b4a]'
                           }`} />
                           <h3 className="font-black text-xl tracking-tight">{event.title}</h3>
                        </div>
                        
                        {event.description && (
                          <p className="text-sm font-medium text-muted-foreground leading-relaxed italic border-l-2 border-black/[0.03] pl-4">
                             "{event.description}"
                          </p>
                        )}
                        
                        <div className="flex flex-wrap items-center gap-6 text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 opacity-40" />
                            {event.formattedDate}
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 opacity-40" />
                            {event.formattedTime}
                          </div>
                          {event.recurring && (
                            <div className="bg-black/5 px-2 py-1 rounded-lg text-black">
                               Cycle: {event.recurring}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className={`px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-sm ${
                          event.status === 'completed' ? 'bg-green-500 text-white shadow-green-500/10' :
                            event.status === 'cancelled' ? 'bg-red-500 text-white shadow-red-500/10' :
                              'bg-black text-white shadow-black/10'
                        }`}>
                          {event.status}
                        </div>

                        {(event.type === 'consultation' || event.type === 'grooming' || event.type === 'training') && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="icon" className="w-10 h-10 rounded-xl border-black/[0.08] hover:bg-[#ff6b4a] hover:text-white hover:border-[#ff6b4a] transition-all">
                                <Clock className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                               <div className="bg-[#ff6b4a] h-1.5 absolute top-0 left-0 w-full" />
                               <DialogHeader className="mb-6">
                                 <DialogTitle className="text-2xl font-black tracking-tight tracking-tight uppercase tracking-widest">Reschedule Event</DialogTitle>
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
                                 className="space-y-6 mt-4"
                               >
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Adjust Date</label>
                                   <Input
                                     type="date"
                                     name="date"
                                     className="h-12 rounded-xl border-black/[0.08] focus:ring-[#ff6b4a]"
                                     defaultValue={format(event.date, 'yyyy-MM-dd')}
                                   />
                                 </div>
                                 <div className="space-y-2">
                                   <label className="text-[10px] font-black uppercase tracking-widest text-[#ff6b4a]">Adjust Time</label>
                                   <Input
                                     type="time"
                                     name="time"
                                     className="h-12 rounded-xl border-black/[0.08] focus:ring-[#ff6b4a]"
                                     defaultValue={format(event.date, 'HH:mm')}
                                   />
                                 </div>
                                 <Button type="submit" className="w-full h-14 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl mt-4">
                                   Finalize Changes
                                 </Button>
                               </form>
                            </DialogContent>
                          </Dialog>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}