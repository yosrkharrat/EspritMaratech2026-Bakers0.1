import { Bell, Plus, BookOpen } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import heroBanner from '@/assets/hero-banner.jpg';
import StoriesBar from '@/components/StoriesBar';
import PostCard from '@/components/PostCard';
import EventCard from '@/components/EventCard';
import { useAuth } from '@/contexts/AuthContext';
import { getEvents, getPosts, getUnreadCount } from '@/lib/store';

const HomePage = () => {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const events = getEvents().slice(0, 3);
  const posts = getPosts().filter(p => p.type === 'post').slice(0, 5);
  const unread = user ? getUnreadCount(user.id) : 0;

  return (
    <div className="pb-20">
      {/* Hero */}
      <div className="relative h-56 overflow-hidden">
        <img src={heroBanner} alt="Running Club Tunis" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-2">
          <div>
            <h1 className="font-display font-extrabold text-xl text-primary-foreground drop-shadow-lg">RCT</h1>
            <p className="text-[11px] text-primary-foreground/80 font-body drop-shadow">Running Club Tunis</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => navigate('/history')} className="w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </button>
            <button onClick={() => navigate('/notifications')} className="w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center relative">
              <Bell className="w-5 h-5 text-primary-foreground" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-destructive text-[10px] text-white font-bold flex items-center justify-center">{unread}</span>
              )}
            </button>
          </div>
        </div>
        <div className="absolute bottom-4 left-4 right-4">
          <p className="font-display font-bold text-lg text-primary-foreground drop-shadow-lg">
            {isLoggedIn ? `Salut ${user?.name.split(' ')[0]}! 🏃‍♂️` : 'Depuis 2016, on court ensemble 🇹🇳'}
          </p>
          <p className="text-xs text-primary-foreground/80 mt-0.5 drop-shadow">125 coureurs · Fondé le 21/04/2016</p>
        </div>
      </div>

      <StoriesBar />

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3 px-4 mb-4">
        {[
          { value: '125', label: 'Membres' },
          { value: user ? `${user.stats.totalDistance}` : '2.4K', label: user ? 'Mes km' : 'Km/semaine' },
          { value: `${getEvents().length}`, label: 'Événements' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-2xl rct-shadow-card p-3 text-center">
            <p className="font-display font-extrabold text-xl rct-text-gradient">{stat.value}</p>
            <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Events */}
      <div className="px-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg">Événements à venir</h2>
          <button onClick={() => navigate('/calendar')} className="text-xs text-primary font-semibold">Voir tout →</button>
        </div>
        <div className="space-y-3">
          {events.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      </div>

      {/* Feed */}
      <div className="px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-display font-bold text-lg">Actualités</h2>
          {isLoggedIn && (
            <button onClick={() => navigate('/create-post')} className="flex items-center gap-1 text-xs text-primary font-semibold">
              <Plus className="w-3.5 h-3.5" /> Publier
            </button>
          )}
        </div>
        <div className="space-y-4">
          {posts.map(post => <PostCard key={post.id} post={post} />)}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
