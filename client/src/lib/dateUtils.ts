import { format, parseISO } from "date-fns";

export const formatDateTime = (dateStr: string | Date | null | undefined) => {
  if (!dateStr) return { date: 'N/A', time: 'N/A', dateTime: 'N/A' };
  const date = typeof dateStr === 'string' ? parseISO(dateStr) : dateStr;
  if (isNaN(date.getTime())) return { date: 'Invalid Date', time: 'Invalid Time', dateTime: 'Invalid Date' };
  return {
    date: format(date, 'MMM d, yyyy'),
    time: format(date, 'h:mm a'),
    dateTime: format(date, 'PPP p')
  };
};

export const formatTimeForInput = (date: Date) => {
  return format(date, 'HH:mm');
};

export const formatDateForInput = (date: Date) => {
  return format(date, 'yyyy-MM-dd');
};
