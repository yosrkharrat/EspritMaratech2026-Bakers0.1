import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Activity, TrendingUp, Zap, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { updateUser } from '@/lib/store';
import { useState } from 'react';

const StravaPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [connected, setConnected] = useState(user?.strava?.connected || false);
  const [syncing, setSyncing] = useState(false);

  const handleConnect = () => {
    // Simulate Strava OAuth
    if (user) {
      const updated = { ...user, strava: { connected: true, athleteId: 'strava_' + user.id } };
      updateUser(updated);
      setConnected(true);
    }
  };

  const handleSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  const handleDisconnect = () => {
    if (user) {
      const updated = { ...user, strava: { connected: false } };
      updateUser(updated);
      setConnected(false);
    }
  };

  const mockActivities = [
    { title: 'Morning Run', distance: '8.2 km', pace: '5:15/km', time: '43:02', date: 'Aujourd\'hui' },
    { title: 'Interval Training', distance: '6.0 km', pace: '4:45/km', time: '28:30', date: 'Hier' },
    { title: 'Long Run', distance: '15.3 km', pace: '5:40/km', time: '1:26:42', date: 'Il y a 3j' },
    { title: 'Easy Recovery', distance: '5.0 km', pace: '6:10/km', time: '30:50', date: 'Il y a 5j' },
  ];

  return (
    <div className="pb-20 pt-6">
      <div className="flex items-center gap-3 px-4 mb-6">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="font-display font-extrabold text-xl">Strava</h1>
      </div>

      {!connected ? (
        <div className="mx-4">
          <div className="bg-card rounded-2xl rct-shadow-elevated p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-[#FC4C02]/10 flex items-center justify-center mx-auto mb-4">
              <Activity className="w-10 h-10 text-[#FC4C02]" />
            </div>
            <h2 className="font-display font-bold text-xl mb-2">Connecter Strava</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Synchronisez vos activités Strava avec RCT Connect pour suivre vos performances automatiquement.
            </p>
            <button onClick={handleConnect}
              className="w-full h-12 bg-[#FC4C02] text-white font-display font-bold rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-[0.98]">
              <ExternalLink className="w-5 h-5" /> Connecter avec Strava
            </button>
            <p className="text-[11px] text-muted-foreground mt-3">
              Nous accéderons uniquement à vos activités de course à pied.
            </p>
          </div>
        </div>
      ) : (
        <div className="px-4 space-y-4">
          {/* Status */}
          <div className="bg-card rounded-2xl rct-shadow-card p-4 flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#FC4C02]/10 flex items-center justify-center">
              <Activity className="w-6 h-6 text-[#FC4C02]" />
            </div>
            <div className="flex-1">
              <p className="font-display font-bold text-sm">Strava connecté ✓</p>
              <p className="text-xs text-accent">Synchronisation active</p>
            </div>
            <button onClick={handleSync} className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center ${syncing ? 'animate-spin' : ''}`}>
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { icon: TrendingUp, value: '34.5 km', label: 'Cette semaine' },
              { icon: Zap, value: '5:20/km', label: 'Allure moy.' },
              { icon: Activity, value: '4', label: 'Activités' },
            ].map(s => (
              <div key={s.label} className="bg-card rounded-2xl rct-shadow-card p-3 text-center">
                <s.icon className="w-5 h-5 text-[#FC4C02] mx-auto mb-1" />
                <p className="font-display font-bold text-lg">{s.value}</p>
                <p className="text-[10px] text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Recent activities */}
          <div>
            <h3 className="font-display font-bold text-base mb-3">Activités récentes</h3>
            <div className="space-y-2">
              {mockActivities.map((a, i) => (
                <div key={i} className="bg-card rounded-2xl rct-shadow-card p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FC4C02]/10 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-[#FC4C02]" />
                  </div>
                  <div className="flex-1">
                    <p className="font-display font-semibold text-sm">{a.title}</p>
                    <p className="text-xs text-muted-foreground">{a.distance} · {a.pace} · {a.time}</p>
                  </div>
                  <span className="text-[11px] text-muted-foreground">{a.date}</span>
                </div>
              ))}
            </div>
          </div>

          <button onClick={handleDisconnect}
            className="w-full h-10 bg-destructive/10 text-destructive text-sm font-semibold rounded-xl">
            Déconnecter Strava
          </button>
        </div>
      )}
    </div>
  );
};

export default StravaPage;
