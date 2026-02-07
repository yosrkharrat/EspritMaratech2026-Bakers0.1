import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';
import { Story } from '@/types';
import { viewStory } from '@/lib/store';
import { useAuth } from '@/contexts/AuthContext';

interface StoryViewerProps {
  stories: Story[];
  initialIndex: number;
  onClose: () => void;
}

const StoryViewer = ({ stories, initialIndex, onClose }: StoryViewerProps) => {
  const { user } = useAuth();
  const [index, setIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const story = stories[index];

  useEffect(() => {
    if (user && story) viewStory(story.id, user.id);
  }, [index, user, story]);

  useEffect(() => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(p => {
        if (p >= 100) {
          if (index < stories.length - 1) setIndex(i => i + 1);
          else onClose();
          return 0;
        }
        return p + 2;
      });
    }, 100);
    return () => clearInterval(interval);
  }, [index, stories.length, onClose]);

  if (!story) return null;

  const formatTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    if (diff < 3600000) return `${Math.floor(diff / 60000)}min`;
    return `${Math.floor(diff / 3600000)}h`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col">
      {/* Progress bars */}
      <div className="flex gap-1 p-3 pt-[calc(env(safe-area-inset-top,0px)+12px)]">
        {stories.map((_, i) => (
          <div key={i} className="flex-1 h-0.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-100"
              style={{ width: i < index ? '100%' : i === index ? `${progress}%` : '0%' }} />
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full rct-gradient-hero flex items-center justify-center">
            <span className="text-xs font-bold text-white">{story.authorName.slice(0, 2).toUpperCase()}</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">{story.authorName}</p>
            <p className="text-white/50 text-[11px]">Il y a {formatTime(story.createdAt)}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center">
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Image */}
      <div className="flex-1 relative">
        <img src={story.image} alt={story.caption} className="w-full h-full object-cover" />

        {/* Navigation zones */}
        <button onClick={() => index > 0 && setIndex(index - 1)}
          className="absolute left-0 top-0 bottom-0 w-1/3 flex items-center pl-2">
          {index > 0 && <ChevronLeft className="w-8 h-8 text-white/50" />}
        </button>
        <button onClick={() => index < stories.length - 1 ? setIndex(index + 1) : onClose()}
          className="absolute right-0 top-0 bottom-0 w-1/3 flex items-center justify-end pr-2">
          {index < stories.length - 1 && <ChevronRight className="w-8 h-8 text-white/50" />}
        </button>

        {/* Caption */}
        {story.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-16">
            <p className="text-white text-sm">{story.caption}</p>
          </div>
        )}
      </div>

      {/* Viewers */}
      <div className="px-4 py-3 flex items-center gap-2 bg-black/80" style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}>
        <Eye className="w-4 h-4 text-white/50" />
        <span className="text-white/50 text-xs">{story.viewers.length} vues</span>
      </div>
    </div>
  );
};

export default StoryViewer;
