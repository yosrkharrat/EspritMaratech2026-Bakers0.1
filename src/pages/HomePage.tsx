import { Bell, Search } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";
import StoriesBar from "@/components/StoriesBar";
import PostCard from "@/components/PostCard";
import EventCard from "@/components/EventCard";

const upcomingEvents = [
  { title: "Sortie matinale Lac de Tunis", date: "8 Fév", time: "06:30", location: "Lac de Tunis", group: "Groupe A", type: "daily" as const, participants: 18 },
  { title: "Sortie longue hebdomadaire", date: "9 Fév", time: "07:00", location: "Parc du Belvédère", group: "Tous", type: "weekly" as const, participants: 45 },
  { title: "Semi-Marathon de Carthage", date: "15 Fév", time: "08:00", location: "Carthage", group: "Compétition", type: "race" as const, participants: 32 },
];

const posts = [
  {
    author: "Ahmed Ben Ali",
    avatar: "",
    time: "Il y a 2h",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=450&fit=crop",
    caption: "Belle sortie matinale au Lac de Tunis 🏃‍♂️ 12km en 5:30/km, super ambiance avec le groupe !",
    likes: 24,
    comments: 6,
    distance: "12 km",
    pace: "5:30/km",
  },
  {
    author: "Salma Gharbi",
    avatar: "",
    time: "Il y a 5h",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=450&fit=crop",
    caption: "Nouveau record personnel sur 10km ! Merci RCT pour la motivation 💪🔥",
    likes: 56,
    comments: 12,
    distance: "10 km",
    pace: "4:45/km",
  },
];

const HomePage = () => (
  <div className="pb-20">
    {/* Hero */}
    <div className="relative h-56 overflow-hidden">
      <img src={heroBanner} alt="Running Club Tunis" className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between p-4 pt-6">
        <div>
          <h1 className="font-display font-extrabold text-xl text-primary-foreground drop-shadow-lg">RCT</h1>
          <p className="text-[11px] text-primary-foreground/80 font-body drop-shadow">Running Club Tunis</p>
        </div>
        <div className="flex gap-2">
          <button className="w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center">
            <Search className="w-5 h-5 text-primary-foreground" />
          </button>
          <button className="w-10 h-10 rounded-full bg-card/20 backdrop-blur-md flex items-center justify-center relative">
            <Bell className="w-5 h-5 text-primary-foreground" />
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-secondary border-2 border-transparent" />
          </button>
        </div>
      </div>
      <div className="absolute bottom-4 left-4 right-4">
        <p className="font-display font-bold text-lg text-primary-foreground drop-shadow-lg">
          Depuis 2016, on court ensemble 🇹🇳
        </p>
        <p className="text-xs text-primary-foreground/80 mt-0.5 drop-shadow">125 coureurs · Fondé le 21/04/2016</p>
      </div>
    </div>

    {/* Stories */}
    <StoriesBar />

    {/* Quick Stats */}
    <div className="grid grid-cols-3 gap-3 px-4 mb-4">
      {[
        { value: "125", label: "Membres", color: "rct-gradient-hero" },
        { value: "2.4K", label: "Km/semaine", color: "rct-gradient-warm" },
        { value: "48", label: "Événements", color: "rct-gradient-fresh" },
      ].map((stat) => (
        <div key={stat.label} className="bg-card rounded-2xl rct-shadow-card p-3 text-center">
          <p className={`font-display font-extrabold text-xl rct-text-gradient`}>{stat.value}</p>
          <p className="text-[11px] text-muted-foreground mt-0.5">{stat.label}</p>
        </div>
      ))}
    </div>

    {/* Upcoming Events */}
    <div className="px-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display font-bold text-lg">Événements à venir</h2>
        <button className="text-xs text-primary font-semibold">Voir tout →</button>
      </div>
      <div className="space-y-3">
        {upcomingEvents.map((event, i) => (
          <EventCard key={i} {...event} />
        ))}
      </div>
    </div>

    {/* Feed */}
    <div className="px-4">
      <h2 className="font-display font-bold text-lg mb-3">Actualités</h2>
      <div className="space-y-4">
        {posts.map((post, i) => (
          <PostCard key={i} {...post} />
        ))}
      </div>
    </div>
  </div>
);

export default HomePage;
