import { Card, CardContent } from '@/ui/card';
import { Trophy, Star, Target, Flame } from 'lucide-react';
import type { PlayerProgress } from '@/types/game';

interface PlayerStatsProps {
  progress: PlayerProgress;
}

export default function PlayerStats({ progress }: PlayerStatsProps) {
  const stats = [
    {
      icon: Star,
      label: 'Total Stars',
      value: progress.totalStars,
      color: 'text-warning',
    },
    {
      icon: Target,
      label: 'Problems Solved',
      value: progress.totalProblemsSolved,
      color: 'text-primary',
    },
    {
      icon: Flame,
      label: 'Current Streak',
      value: progress.currentStreak,
      color: 'text-destructive',
    },
    {
      icon: Trophy,
      label: 'Best Streak',
      value: progress.bestStreak,
      color: 'text-success',
    },
  ];

  return (
    <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
      <CardContent className="p-4">
        <h2 className="text-xl font-bold mb-4 text-center gradient-text">
          {progress.playerName}'s Progress
        </h2>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-1 ${stat.color}`} />
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
8