import { useEffect, useState, useRef } from 'react';
import { MapPin, Star, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getCourses } from '@/lib/store';
import RatingStars from '@/components/RatingStars';
import { addRating } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';

// Fix leaflet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const rctIcon = new L.DivIcon({
  html: `<div style="background:linear-gradient(135deg,#1a6dd4,#185ab3);width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;border:3px solid white;box-shadow:0 2px 8px rgba(0,0,0,0.3)"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>`,
  className: '',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const UserLocationMarker = () => {
  const map = useMap();
  const [pos, setPos] = useState<[number, number] | null>(null);

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition(
      p => {
        const loc: [number, number] = [p.coords.latitude, p.coords.longitude];
        setPos(loc);
      },
      () => {/* fallback to Tunis */},
      { enableHighAccuracy: true }
    );
  }, [map]);

  if (!pos) return null;
  return (
    <Marker position={pos} icon={new L.DivIcon({
      html: '<div style="width:16px;height:16px;background:#1a6dd4;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(26,109,212,0.3)"></div>',
      className: '', iconSize: [16, 16], iconAnchor: [8, 8],
    })}>
      <Popup>Votre position</Popup>
    </Marker>
  );
};

const difficultyColors: Record<string, string> = {
  Facile: 'bg-accent/10 text-accent',
  Moyen: 'bg-secondary/10 text-secondary',
  Difficile: 'bg-destructive/10 text-destructive',
};

const MapPage = () => {
  const { user } = useAuth();
  const [, setTick] = useState(0);
  const courses = getCourses();
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [newRating, setNewRating] = useState(0);
  const [newComment, setNewComment] = useState('');
  const mapRef = useRef<any>(null);

  const selected = selectedCourse ? courses.find(c => c.id === selectedCourse) : null;
  const avgRating = (courseId: string) => {
    const c = courses.find(x => x.id === courseId);
    if (!c || c.ratings.length === 0) return 0;
    return c.ratings.reduce((sum, r) => sum + r.rating, 0) / c.ratings.length;
  };

  const handleSubmitRating = () => {
    if (!user || !selectedCourse || newRating === 0) return;
    addRating(selectedCourse, {
      id: 'r_' + Date.now(),
      courseId: selectedCourse,
      userId: user.id,
      userName: user.name,
      rating: newRating,
      comment: newComment,
      createdAt: new Date().toISOString(),
    });
    setNewRating(0);
    setNewComment('');
    setTick(t => t + 1);
  };

  return (
    <div className="pb-20 pt-6">
      <div className="px-4 mb-4">
        <h1 className="font-display font-extrabold text-2xl">Carte</h1>
        <p className="text-sm text-muted-foreground">Parcours de course à proximité</p>
      </div>

      {/* Map */}
      <div className="mx-4 h-72 rounded-2xl overflow-hidden rct-shadow-elevated mb-4">
        <MapContainer ref={mapRef} center={[36.83, 10.2]} zoom={11} scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://osm.org">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <UserLocationMarker />
          {courses.map(course => (
            <Marker key={course.id} position={[course.lat, course.lng]} icon={rctIcon}
              eventHandlers={{ click: () => setSelectedCourse(course.id) }}>
              <Popup>
                <div className="font-display text-sm">
                  <strong>{course.name}</strong>
                  <br />{course.distance} · {course.difficulty}
                  <br />⭐ {avgRating(course.id).toFixed(1)}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Selected Course Detail */}
      {selected && (
        <div className="mx-4 bg-card rounded-2xl rct-shadow-elevated p-5 mb-4 animate-slide-up">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-display font-bold text-lg">{selected.name}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{selected.description}</p>
            </div>
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${difficultyColors[selected.difficulty]}`}>
              {selected.difficulty}
            </span>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <div className="flex items-center gap-1">
              <Navigation className="w-4 h-4 text-primary" />
              <span className="text-sm font-semibold">{selected.distance}</span>
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span className="text-sm font-semibold">{avgRating(selected.id).toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({selected.ratings.length} avis)</span>
            </div>
          </div>

          {/* Ratings */}
          <div className="space-y-2 mb-4">
            {selected.ratings.slice(0, 3).map(r => (
              <div key={r.id} className="bg-muted rounded-xl p-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold">{r.userName}</span>
                  <RatingStars rating={r.rating} size="sm" />
                </div>
                <p className="text-xs text-muted-foreground">{r.comment}</p>
              </div>
            ))}
          </div>

          {/* Add Rating */}
          {user && (
            <div className="bg-muted rounded-xl p-3 space-y-2">
              <p className="text-xs font-semibold">Votre avis</p>
              <RatingStars rating={newRating} onRate={setNewRating} />
              <input value={newComment} onChange={e => setNewComment(e.target.value)}
                placeholder="Commentaire..."
                className="w-full h-9 px-3 rounded-lg bg-card border border-border text-xs" />
              <button onClick={handleSubmitRating} disabled={newRating === 0}
                className="w-full h-8 rct-gradient-hero text-white text-xs font-bold rounded-lg disabled:opacity-50">
                Envoyer
              </button>
            </div>
          )}
        </div>
      )}

      {/* Course list */}
      <div className="px-4 space-y-3">
        <h3 className="font-display font-bold">Parcours populaires</h3>
        {courses.map((course, i) => (
          <button key={course.id} onClick={() => setSelectedCourse(course.id)}
            className={`w-full text-left bg-card rounded-2xl rct-shadow-card p-4 flex items-center gap-4 animate-slide-up transition-all ${selectedCourse === course.id ? 'ring-2 ring-primary' : ''}`}
            style={{ animationDelay: `${i * 0.1}s` }}>
            <div className="w-12 h-12 rounded-xl rct-gradient-hero flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-display font-semibold text-sm">{course.name}</h4>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs text-muted-foreground">{course.distance}</span>
                <RatingStars rating={avgRating(course.id)} size="sm" />
              </div>
            </div>
            <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${difficultyColors[course.difficulty]}`}>
              {course.difficulty}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default MapPage;
