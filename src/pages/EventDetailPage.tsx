import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, Users, Share2, UserPlus, UserMinus } from 'lucide-react';
import { getEvent, joinEvent, leaveEvent, getUser } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';
import { useState } from 'react';

const typeStyles: Record<string, string> = {
  daily: 'bg-primary/10 text-primary',
  weekly: 'bg-secondary/10 text-secondary',
  race: 'bg-accent/10 text-accent',
};
const typeLabels: Record<string, string> = { daily: 'Quotidien', weekly: 'Hebdomadaire', race: 'Course' };

const EventDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const event = getEvent(id || '');

  if (!event) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Événement introuvable</p>
    </div>
  );

  const isJoined = user ? event.participants.includes(user.id) : false;

  const handleJoin = () => {
    if (!user) return;
    if (isJoined) leaveEvent(event.id, user.id);
    else joinEvent(event.id, user.id);
    setTick(t => t + 1);
  };

  const currentEvent = getEvent(id || '')!;
  const participants = currentEvent.participants.map(pid => getUser(pid)).filter(Boolean);

  return (
    <div className="pb-20 pt-6">
      <div className="flex items-center gap-3 px-4 mb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-extrabold text-xl flex-1">Détail</h1>
        <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Share2 className="w-5 h-5" />
        </button>
      </div>

      <div className="mx-4 bg-card rounded-2xl rct-shadow-elevated p-6 mb-4">
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${typeStyles[currentEvent.type]}`}>
          {typeLabels[currentEvent.type]}
        </span>
        <h2 className="font-display font-extrabold text-2xl mt-3">{currentEvent.title}</h2>
        <p className="text-sm text-muted-foreground mt-2">{currentEvent.description}</p>

        <div className="grid grid-cols-2 gap-3 mt-5">
          {[
            { icon: Calendar, label: currentEvent.date, sub: 'Date' },
            { icon: Clock, label: currentEvent.time, sub: 'Heure' },
            { icon: MapPin, label: currentEvent.location, sub: 'Lieu' },
            { icon: Users, label: currentEvent.group, sub: 'Groupe' },
          ].map(item => (
            <div key={item.sub} className="bg-muted rounded-xl p-3">
              <div className="flex items-center gap-2 mb-1">
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-[11px] text-muted-foreground">{item.sub}</span>
              </div>
              <p className="text-sm font-semibold">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Participants */}
      <div className="mx-4 bg-card rounded-2xl rct-shadow-card p-4 mb-4">
        <h3 className="font-display font-bold text-base mb-3">
          Participants ({participants.length})
        </h3>
        <div className="space-y-2">
          {participants.map(p => p && (
            <div key={p.id} className="flex items-center gap-3 p-2 rounded-xl bg-muted">
              <div className="w-9 h-9 rounded-full rct-gradient-hero flex items-center justify-center">
                <span className="text-xs font-bold text-white">{p.name.slice(0, 2).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm font-semibold">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">{p.group || 'Membre'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Join / Leave */}
      {user && (
        <div className="mx-4">
          <button onClick={handleJoin}
            className={`w-full h-12 font-display font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98] ${
              isJoined
                ? 'bg-destructive/10 text-destructive border border-destructive/30'
                : 'rct-gradient-hero text-white rct-glow-blue'
            }`}>
            {isJoined ? <><UserMinus className="w-5 h-5" /> Quitter l'événement</> : <><UserPlus className="w-5 h-5" /> Participer</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default EventDetailPage;
