import { useState, useEffect } from "react";
import { animated, useSpring } from "@react-spring/web";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pet } from "@shared/schema";
import { UtensilsCrossed, Clock, Bell } from "lucide-react";
import { format, parse, isBefore } from "date-fns";
import useSound from "use-sound";
import { useToast } from "@/hooks/use-toast";

interface FeedingReminderProps {
  pet: Pet;
}

interface FeedingTime {
  time: string;
  completed: boolean;
}

const PetBowlAnimation = () => {
  const [bounce, setBounce] = useState(false);

  const animation = useSpring({
    transform: bounce ? "scale(1.1) translateY(-10px)" : "scale(1) translateY(0px)",
    config: { tension: 300, friction: 10 },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setBounce(true);
      setTimeout(() => setBounce(false), 500);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <animated.div style={animation} className="w-24 h-24 mx-auto mb-4">
      <UtensilsCrossed className="w-full h-full text-primary animate-pulse" />
    </animated.div>
  );
};

export function FeedingReminder({ pet }: FeedingReminderProps) {
  const [feedingTimes, setFeedingTimes] = useState<FeedingTime[]>([]);
  const [newTime, setNewTime] = useState("");
  const { toast } = useToast();
  const [playSound] = useSound("/sounds/feeding-reminder.mp3");

  useEffect(() => {
    const checkFeedingTimes = () => {
      const now = new Date();
      const currentTime = format(now, "HH:mm");

      feedingTimes.forEach((feedingTime, index) => {
        if (!feedingTime.completed) {
          const feedingDateTime = parse(feedingTime.time, "HH:mm", new Date());
          if (isBefore(feedingDateTime, now)) {
            playSound();
            toast({
              title: "Feeding Time!",
              description: `Time to feed ${pet.name}!`,
            });
            setFeedingTimes((prev) =>
              prev.map((ft, i) => (i === index ? { ...ft, completed: true } : ft))
            );
          }
        }
      });
    };

    const interval = setInterval(checkFeedingTimes, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [feedingTimes, pet.name, toast, playSound]);

  const addFeedingTime = () => {
    if (!newTime) return;
    setFeedingTimes((prev) => [...prev, { time: newTime, completed: false }]);
    setNewTime("");
  };

  const resetFeedingTimes = () => {
    setFeedingTimes((prev) =>
      prev.map((ft) => ({ ...ft, completed: false }))
    );
  };

  return (
    <Card className="p-6">
      <div className="text-center mb-6">
        <PetBowlAnimation />
        <h3 className="text-2xl font-semibold">Feeding Schedule</h3>
        {pet.feedingSchedule && (
          <p className="text-muted-foreground mt-2">
            Recommended: {pet.feedingSchedule}
            {pet.portionSize && ` (${pet.portionSize} per meal)`}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="flex gap-2">
          <Input
            type="time"
            value={newTime}
            onChange={(e) => setNewTime(e.target.value)}
            className="flex-1"
          />
          <Button onClick={addFeedingTime}>
            Add Time
          </Button>
        </div>

        <div className="space-y-2">
          {feedingTimes.map((ft, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 border rounded-lg ${
                ft.completed ? "bg-muted" : ""
              }`}
            >
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{ft.time}</span>
              </div>
              <div className="flex items-center gap-2">
                {ft.completed ? (
                  <span className="text-sm text-muted-foreground">Completed</span>
                ) : (
                  <Bell className="h-4 w-4 text-primary animate-bounce" />
                )}
              </div>
            </div>
          ))}
        </div>

        {feedingTimes.length > 0 && (
          <Button
            variant="outline"
            className="w-full"
            onClick={resetFeedingTimes}
          >
            Reset All Times
          </Button>
        )}
      </div>
    </Card>
  );
}