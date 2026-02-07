import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Users, ChevronRight } from 'lucide-react';
import type { RCTEvent } from '@/types';

interface EventCardProps {
  event: RCTEvent;
}

const typeBadge = (type: RCTEvent['type']) => {
  switch (type) {
    case 'daily': return { label: 'Quotidien', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' };
    case 'weekly': return { label: 'Hebdo', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' };
    case 'race': return { label: 'Course', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' };
    case 'special': return { label: 'Spécial', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300' };
    default: return { label: type, color: 'bg-muted text-muted-foreground' };
  }
};

const EventCard = ({ event }: EventCardProps) => {
  const navigate = useNavigate();
  const badge = typeBadge(event.type);
  const date = new Date(event.date);
  const day = date.getDate();
  const month = date.toLocaleDateString('fr-FR', { month: 'short' });

  return (
    <button
      onClick={() => navigate(`/event/${event.id}`)}
      className="w-full bg-card rounded-2xl rct-shadow-card p-4 flex items-center gap-4 active:scale-[.98] transition-transform text-left"
    >
      {/* Date badge */}
      <div className="w-14 h-14 rounded-xl rct-gradient-hero flex flex-col items-center justify-center text-white flex-shrink-0">
        <span className="text-lg font-extrabold leading-none">{day}</span>
        <span className="text-[10px] uppercase font-semibold">{month}</span>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-sm truncate">{event.title}</h3>
          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${badge.color}`}>
            {badge.label}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" /> {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" /> {event.location}
          </span>
        </div>
        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
          <Users className="w-3 h-3" />
          <span>{event.participants.length} participant{event.participants.length > 1 ? 's' : ''}</span>
          {event.group && <span className="ml-2 text-primary font-medium">• {event.group}</span>}
        </div>
      </div>

      <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
    </button>
  );
};

export default EventCard;
