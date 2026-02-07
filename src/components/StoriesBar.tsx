import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface Story {
  name: string;
  avatar: string;
  hasNew: boolean;
}

const stories: Story[] = [
  { name: "Votre story", avatar: "", hasNew: false },
  { name: "Ahmed", avatar: "", hasNew: true },
  { name: "Salma", avatar: "", hasNew: true },
  { name: "Youssef", avatar: "", hasNew: true },
  { name: "Nour", avatar: "", hasNew: true },
  { name: "Karim", avatar: "", hasNew: false },
  { name: "Leila", avatar: "", hasNew: true },
];

const StoriesBar = () => (
  <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 py-3">
    {stories.map((story, i) => (
      <button key={i} className="flex flex-col items-center gap-1.5 min-w-[64px]">
        <div className={`p-[2px] rounded-full ${story.hasNew ? "rct-gradient-warm" : "bg-border"}`}>
          <Avatar className="w-14 h-14 border-2 border-card">
            <AvatarImage src={story.avatar} />
            <AvatarFallback className={`font-display text-sm ${i === 0 ? "bg-muted text-muted-foreground" : "rct-gradient-hero text-primary-foreground"}`}>
              {i === 0 ? "+" : story.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <span className="text-[11px] font-body text-muted-foreground truncate w-16 text-center">
          {story.name}
        </span>
      </button>
    ))}
  </div>
);

export default StoriesBar;
