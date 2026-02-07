import StoriesBar from "@/components/StoriesBar";
import PostCard from "@/components/PostCard";

const posts = [
  {
    author: "Youssef Trabelsi",
    avatar: "",
    time: "Il y a 1h",
    image: "https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=600&h=450&fit=crop",
    caption: "Sortie nocturne sous les étoiles ✨ Rien de mieux que courir avec le groupe !",
    likes: 38,
    comments: 8,
    distance: "8 km",
    pace: "5:15/km",
  },
  {
    author: "Nour Mejri",
    avatar: "",
    time: "Il y a 3h",
    image: "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&h=450&fit=crop",
    caption: "Premier 21km ! Le RCT m'a donné la force d'y arriver 🏅",
    likes: 92,
    comments: 24,
    distance: "21 km",
    pace: "5:50/km",
  },
  {
    author: "Karim Bouazizi",
    avatar: "",
    time: "Il y a 6h",
    image: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=600&h=450&fit=crop",
    caption: "Interval training au stade El Menzah 🔥 6x1000m, les jambes brûlent !",
    likes: 41,
    comments: 5,
    distance: "10 km",
  },
  {
    author: "Leila Hammami",
    avatar: "",
    time: "Hier",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&h=450&fit=crop",
    caption: "Yoga de récupération après la sortie longue 🧘‍♀️ #recovery #RCT",
    likes: 29,
    comments: 3,
  },
];

const CommunityPage = () => (
  <div className="pb-20 pt-6">
    <div className="px-4 mb-2">
      <h1 className="font-display font-extrabold text-2xl">Communauté</h1>
      <p className="text-sm text-muted-foreground">Feed des coureurs RCT</p>
    </div>

    <StoriesBar />

    {/* Tabs */}
    <div className="flex gap-2 px-4 mb-4">
      {["Pour vous", "Suivis", "Reels"].map((tab, i) => (
        <button
          key={tab}
          className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            i === 0
              ? "rct-gradient-hero text-primary-foreground rct-glow-blue"
              : "bg-muted text-muted-foreground"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>

    <div className="px-4 space-y-4">
      {posts.map((post, i) => (
        <PostCard key={i} {...post} />
      ))}
    </div>
  </div>
);

export default CommunityPage;
