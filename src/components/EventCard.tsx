import { Calendar, MapPin, Users, Clock } from "lucide-react";

interface EventCardProps {
  title: string;
  date: string;
  time: string;
  location: string;
  group: string;
  type: "daily" | "weekly" | "race";
  participants: number;
}

const typeStyles = {
  daily: "bg-primary/10 text-primary",
  weekly: "bg-secondary/10 text-secondary",
  race: "bg-accent/10 text-accent",
};

const typeLabels = {
  daily: "Quotidien",
  weekly: "Hebdomadaire",
  race: "Course",
};

const EventCard = ({ title, date, time, location, group, type, participants }: EventCardProps) => (
  <div className="bg-card rounded-2xl rct-shadow-card p-4 space-y-3 animate-slide-up">
    <div className="flex items-start justify-between">
      <div className="space-y-1">
        <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${typeStyles[type]}`}>
          {typeLabels[type]}
        </span>
        <h3 className="font-display font-bold text-base mt-2">{title}</h3>
      </div>
      <div className="flex -space-x-2">
        {Array.from({ length: Math.min(participants, 3) }).map((_, i) => (
          <div key={i} className="w-7 h-7 rounded-full rct-gradient-hero border-2 border-card flex items-center justify-center">
            <span className="text-[10px] font-bold text-primary-foreground">{i + 1}</span>
          </div>
        ))}
        {participants > 3 && (
          <div className="w-7 h-7 rounded-full bg-muted border-2 border-card flex items-center justify-center">
            <span className="text-[10px] font-semibold text-muted-foreground">+{participants - 3}</span>
          </div>
        )}
      </div>
    </div>
    <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
      <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{date}</span>
      <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{time}</span>
      <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{location}</span>
      <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{group}</span>
    </div>
  </div>
);

export default EventCard;
