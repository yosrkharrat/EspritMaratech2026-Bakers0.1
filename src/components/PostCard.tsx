import { Heart, MessageCircle, Share2, Bookmark } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface PostCardProps {
  author: string;
  avatar: string;
  time: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  distance?: string;
  pace?: string;
}

const PostCard = ({ author, avatar, time, image, caption, likes, comments, distance, pace }: PostCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div className="bg-card rounded-2xl rct-shadow-card overflow-hidden animate-slide-up">
      {/* Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar className="w-10 h-10 ring-2 ring-primary/20">
          <AvatarImage src={avatar} />
          <AvatarFallback className="rct-gradient-hero text-primary-foreground font-display text-sm">
            {author.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="font-display font-semibold text-sm">{author}</p>
          <p className="text-xs text-muted-foreground">{time}</p>
        </div>
        {distance && (
          <div className="flex gap-2">
            <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">{distance}</span>
            {pace && <span className="px-2 py-1 rounded-full bg-accent/10 text-accent text-xs font-semibold">{pace}</span>}
          </div>
        )}
      </div>

      {/* Image */}
      <div className="aspect-[4/3] bg-muted overflow-hidden">
        <img src={image} alt={caption} className="w-full h-full object-cover" />
      </div>

      {/* Actions */}
      <div className="p-4 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={handleLike} className="transition-transform active:scale-125">
              <Heart
                className={`w-6 h-6 transition-colors ${liked ? "fill-destructive text-destructive" : "text-foreground"}`}
              />
            </button>
            <button>
              <MessageCircle className="w-6 h-6 text-foreground" />
            </button>
            <button>
              <Share2 className="w-5 h-5 text-foreground" />
            </button>
          </div>
          <button>
            <Bookmark className="w-6 h-6 text-foreground" />
          </button>
        </div>
        <p className="font-display font-semibold text-sm">{likeCount} j'aime</p>
        <p className="text-sm">
          <span className="font-display font-semibold">{author}</span>{" "}
          <span className="text-muted-foreground">{caption}</span>
        </p>
        {comments > 0 && (
          <button className="text-xs text-muted-foreground">
            Voir les {comments} commentaires
          </button>
        )}
      </div>
    </div>
  );
};

export default PostCard;
