import { Card, CardContent } from '@/ui/card';
import type { Badge } from '@/types/game';
import { cn } from '@/lib/utils';

interface BadgeCardProps {
  badge: Badge;
}

export default function BadgeCard({ badge }: BadgeCardProps) {
  return (
    <Card
      className={cn(
        'relative overflow-hidden transition-all duration-300',
        badge.unlocked ? 'hover:scale-105' : 'opacity-50'
      )}
    >
      <CardContent className="p-4 text-center">
        <div
          className={cn(
            'text-5xl mb-3 mx-auto w-16 h-16 flex items-center justify-center rounded-full',
            badge.unlocked ? 'bg-gradient-to-br from-warning to-accent animate-pulse-slow' : 'bg-muted'
          )}
        >
          {badge.icon}
        </div>

        <h3 className="font-bold text-sm mb-1 text-foreground">{badge.name}</h3>
        <p className="text-xs text-muted-foreground">{badge.description}</p>

        {badge.unlocked && badge.unlockedAt && (
          <p className="text-xs text-success mt-2">
            Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
8