import { Settings, Trophy, TrendingUp, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  { label: "Distance totale", value: "847 km", icon: MapPin, trend: "+12%" },
  { label: "Courses", value: "156", icon: Calendar, trend: "+8%" },
  { label: "Classement", value: "#12", icon: Trophy, trend: "↑3" },
  { label: "Série", value: "14 jours", icon: TrendingUp, trend: "Record !" },
];

const menuItems = [
  { label: "Mes activités", count: "156" },
  { label: "Programmes d'entraînement", count: "3" },
  { label: "Groupes", count: "2" },
  { label: "Badges & accomplissements", count: "8" },
  { label: "Connecter Strava", count: "" },
  { label: "Paramètres", count: "" },
];

const ProfilePage = () => (
  <div className="pb-20 pt-6">
    {/* Header */}
    <div className="flex items-center justify-between px-4 mb-6">
      <h1 className="font-display font-extrabold text-2xl">Profil</h1>
      <button className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
        <Settings className="w-5 h-5" />
      </button>
    </div>

    {/* Profile card */}
    <div className="mx-4 bg-card rounded-2xl rct-shadow-elevated p-6 text-center mb-4">
      <Avatar className="w-24 h-24 mx-auto mb-3 ring-4 ring-primary/20">
        <AvatarFallback className="rct-gradient-hero text-primary-foreground font-display text-2xl font-bold">
          RC
        </AvatarFallback>
      </Avatar>
      <h2 className="font-display font-bold text-xl">Coureur RCT</h2>
      <p className="text-sm text-muted-foreground mt-1">Membre depuis Avril 2023</p>
      <div className="flex justify-center gap-6 mt-4">
        <div className="text-center">
          <p className="font-display font-bold text-lg rct-text-gradient">847</p>
          <p className="text-[11px] text-muted-foreground">km</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="font-display font-bold text-lg rct-text-gradient">156</p>
          <p className="text-[11px] text-muted-foreground">sorties</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="font-display font-bold text-lg rct-text-gradient">5:12</p>
          <p className="text-[11px] text-muted-foreground">pace moy.</p>
        </div>
      </div>
    </div>

    {/* Stats grid */}
    <div className="grid grid-cols-2 gap-3 px-4 mb-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-card rounded-2xl rct-shadow-card p-4">
          <div className="flex items-center gap-2 mb-2">
            <stat.icon className="w-4 h-4 text-primary" />
            <span className="text-[11px] text-muted-foreground">{stat.label}</span>
          </div>
          <p className="font-display font-bold text-xl">{stat.value}</p>
          <span className="text-[11px] text-accent font-semibold">{stat.trend}</span>
        </div>
      ))}
    </div>

    {/* Menu */}
    <div className="mx-4 bg-card rounded-2xl rct-shadow-card overflow-hidden">
      {menuItems.map((item, i) => (
        <button key={i} className="w-full flex items-center justify-between px-4 py-3.5 border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
          <span className="text-sm font-medium">{item.label}</span>
          <div className="flex items-center gap-2">
            {item.count && <span className="text-xs text-muted-foreground">{item.count}</span>}
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </button>
      ))}
    </div>
  </div>
);

export default ProfilePage;
