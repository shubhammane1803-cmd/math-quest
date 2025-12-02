import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StarRatingProps {
  stars: number;
  maxStars?: number;
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export default function StarRating({
  stars,
  maxStars = 3,
  size = 'md',
  animated = false,
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className="flex gap-1">
      {Array.from({ length: maxStars }, (_, i) => (
        <Star
          key={i}
          className={cn(
            sizeClasses[size],
            i < stars ? 'fill-warning text-warning' : 'fill-muted text-muted',
            animated && i < stars && 'animate-bounce-slow'
          )}
          style={animated && i < stars ? { animationDelay: `${i * 0.1}s` } : undefined}
        />
      ))}
    </div>
  );
}
8