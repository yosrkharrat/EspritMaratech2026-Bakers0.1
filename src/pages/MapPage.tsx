import { MapPin, Navigation } from "lucide-react";

const courses = [
  { name: "Lac de Tunis", distance: "8 km", difficulty: "Facile", lat: "36.80", lng: "10.18" },
  { name: "Parc du Belvédère", distance: "5 km", difficulty: "Facile", lat: "36.82", lng: "10.17" },
  { name: "Carthage - Sidi Bou Said", distance: "12 km", difficulty: "Moyen", lat: "36.86", lng: "10.32" },
  { name: "Forêt de Jebel Nahli", distance: "15 km", difficulty: "Difficile", lat: "36.87", lng: "10.07" },
  { name: "La Marsa Corniche", distance: "10 km", difficulty: "Moyen", lat: "36.88", lng: "10.33" },
];

const difficultyColors: Record<string, string> = {
  Facile: "bg-accent/10 text-accent",
  Moyen: "bg-secondary/10 text-secondary",
  Difficile: "bg-destructive/10 text-destructive",
};

const MapPage = () => (
  <div className="pb-20 pt-6">
    <div className="px-4 mb-4">
      <h1 className="font-display font-extrabold text-2xl">Carte</h1>
      <p className="text-sm text-muted-foreground">Parcours de course à proximité</p>
    </div>

    {/* Map placeholder */}
    <div className="mx-4 h-64 rounded-2xl rct-gradient-hero relative overflow-hidden mb-4 rct-shadow-elevated">
      <div className="absolute inset-0 flex items-center justify-center flex-col gap-2">
        <Navigation className="w-12 h-12 text-primary-foreground/60" />
        <p className="text-primary-foreground/80 text-sm font-body">Carte interactive</p>
        <p className="text-primary-foreground/50 text-xs">Tunis, Tunisie 🇹🇳</p>
      </div>
      {/* Decorative dots */}
      {courses.map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 rounded-full bg-secondary animate-pulse-soft border-2 border-primary-foreground/50"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${10 + Math.random() * 80}%`,
          }}
        />
      ))}
    </div>

    {/* Course list */}
    <div className="px-4 space-y-3">
      <h3 className="font-display font-bold">Parcours populaires</h3>
      {courses.map((course, i) => (
        <div key={i} className="bg-card rounded-2xl rct-shadow-card p-4 flex items-center gap-4 animate-slide-up" style={{ animationDelay: `${i * 0.1}s` }}>
          <div className="w-12 h-12 rounded-xl rct-gradient-hero flex items-center justify-center flex-shrink-0">
            <MapPin className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-display font-semibold text-sm">{course.name}</h4>
            <p className="text-xs text-muted-foreground">{course.distance} · {course.lat}°N, {course.lng}°E</p>
          </div>
          <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${difficultyColors[course.difficulty]}`}>
            {course.difficulty}
          </span>
        </div>
      ))}
    </div>
  </div>
);

export default MapPage;
