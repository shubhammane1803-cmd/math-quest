import { Lock } from 'lucide-react';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import StarRating from './StarRating';
import type { Level } from '@/types/game';
import { cn } from '@/lib/utils';

interface LevelCardProps {
  level: Level;
  onPlay: (levelId: number) => void;
}

const operationIcons: Record<string, string> = {
  addition: '➕',
  subtraction: '➖',
  multiplication: '✖️',
  mixed: '🔢',
};

const operationColors: Record<string, string> = {
  addition: 'from-primary to-primary-glow',
  subtraction: 'from-secondary to-accent',
  multiplication: 'from-success to-chart-2',
  mixed: 'from-warning to-accent',
};

export default function LevelCard({ level, onPlay }: LevelCardProps) {
  const icon = operationIcons[level.operation] || '🔢';
  const gradientClass = operationColors[level.operation] || 'from-primary to-secondary';

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        level.unlocked
          ? 'hover:scale-105 hover:shadow-lg cursor-pointer'
          : 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', gradientClass)} />
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl animate-float">{icon}</div>
          {!level.unlocked && (
            <div className="bg-muted rounded-full p-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>

        <h3 className="font-bold text-base mb-2 text-foreground">{level.name}</h3>

        <div className="flex items-center justify-between">
          <StarRating stars={level.stars} size="sm" />
          <Button
            size="sm"
            disabled={!level.unlocked}
            onClick={() => onPlay(level.id)}
            className="text-xs"
          >
            {level.completed ? 'Replay' : 'Play'}
          </Button>
        </div>

        {!level.unlocked && (
          <p className="text-xs text-muted-foreground mt-2">
            Requires {level.requiredStars} ⭐
          </p>
        )}
      </CardContent>
    </Card>
  );
}
