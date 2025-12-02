import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import { useProgress } from '@/context/ProgressContexts';
import PlayerStats from '@/common/PlayerStats';
import LevelCard from '@/common/LevelCard';
import MiniGameCard from '@/common/MiniGameCard';
import BadgeCard from '@/game/BadgeCard';

export default function HomePage() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  const [activeTab, setActiveTab] = useState('levels');

  const handlePlayLevel = (levelId: number) => {
    navigate(`/play/${levelId}`);
  };

  const handlePlayMiniGame = (gameId: number) => {
    navigate(`/minigame/${gameId}`);
  };

  return (
    <div className="min-h-screen p-4 xl:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center mb-6">
          <h1 className="text-4xl xl:text-5xl font-bold mb-2 gradient-text animate-float">
            Math Quest 🎮
          </h1>
          <p className="text-muted-foreground">Learn math while having fun!</p>
        </div>

        <PlayerStats progress={progress} />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="levels" className="text-sm xl:text-base">
              📚 Levels
            </TabsTrigger>
            <TabsTrigger value="minigames" className="text-sm xl:text-base">
              🎮 Mini Games
            </TabsTrigger>
            <TabsTrigger value="badges" className="text-sm xl:text-base">
              🏆 Badges
            </TabsTrigger>
          </TabsList>

          <TabsContent value="levels" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
              {progress.levels.map((level) => (
                <LevelCard key={level.id} level={level} onPlay={handlePlayLevel} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="minigames" className="space-y-4">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
              {progress.miniGames.map((game) => (
                <MiniGameCard key={game.id} game={game} onPlay={handlePlayMiniGame} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="badges" className="space-y-4">
            <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
              {progress.badges.map((badge) => (
                <BadgeCard key={badge.id} badge={badge} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
8