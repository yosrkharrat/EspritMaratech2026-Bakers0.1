import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  onRate?: (rating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  showValue?: boolean;
}

const sizes = { sm: 'w-3.5 h-3.5', md: 'w-5 h-5', lg: 'w-7 h-7' };

const RatingStars = ({ rating, onRate, size = 'md', showValue }: RatingStarsProps) => (
  <div className="flex items-center gap-1">
    {[1, 2, 3, 4, 5].map(i => (
      <button key={i} onClick={() => onRate?.(i)} disabled={!onRate}
        className={`transition-transform ${onRate ? 'hover:scale-110 active:scale-125 cursor-pointer' : 'cursor-default'}`}>
        <Star className={`${sizes[size]} transition-colors ${i <= rating ? 'fill-secondary text-secondary' : 'text-muted-foreground/30'}`} />
      </button>
    ))}
    {showValue && <span className="text-sm font-semibold ml-1">{rating.toFixed(1)}</span>}
  </div>
);

export default RatingStars;
