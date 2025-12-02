import { Lock } from 'lucide-react';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import type { MiniGame } from '@/types/game';
import { cn } from '@/lib/utils';

interface MiniGameCardProps {
  game: MiniGame;
  onPlay: (gameId: number) => void;
}

const themeGradients: Record<string, string> = {
  classic: 'from-primary to-secondary',
  racing: 'from-destructive to-warning',
  space: 'from-primary to-chart-3',
  balloons: 'from-accent to-secondary',
  dinosaur: 'from-success to-chart-2',
  bike: 'from-warning to-destructive',
  tennis: 'from-chart-3 to-primary',
};

export default function MiniGameCard({ game, onPlay }: MiniGameCardProps) {
  const gradientClass = themeGradients[game.theme] || 'from-primary to-secondary';

  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        game.unlocked
          ? 'hover:scale-105 hover:shadow-lg cursor-pointer'
          : 'opacity-60 cursor-not-allowed'
      )}
    >
      <div className={cn('absolute inset-0 bg-gradient-to-br opacity-10', gradientClass)} />
      <CardContent className="p-4 relative">
        <div className="flex items-start justify-between mb-3">
          <div className="text-5xl animate-float">{game.icon}</div>
          {!game.unlocked && (
            <div className="bg-muted rounded-full p-2">
              <Lock className="w-4 h-4 text-muted-foreground" />
            </div>
          )}
        </div>

        <h3 className="font-bold text-base mb-1 text-foreground">{game.name}</h3>
        <p className="text-xs text-muted-foreground mb-3">{game.description}</p>

        <div className="flex items-center justify-between">
          {!game.unlocked && (
            <span className="text-xs text-muted-foreground">Requires {game.requiredStars} ⭐</span>
          )}
          <Button
            size="sm"
            disabled={!game.unlocked}
            onClick={() => onPlay(game.id)}
            className={cn('text-xs', game.unlocked && 'ml-auto')}
          >
            Play
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
