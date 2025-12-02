import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { PlayerProgress, Badge } from '@/types/game';
import { getPlayerProgress, savePlayerProgress } from '@/utils/storage';
import { shouldUnlockBadge } from '@/utils/gameLogic';

interface ProgressContextType {
  progress: PlayerProgress;
  updateProgress: (updates: Partial<PlayerProgress>) => void;
  completeLevel: (levelId: number, stars: number, problemsSolved: number) => void;
  updateStreak: (correct: boolean) => void;
  setPlayerName: (name: string) => void;
  checkAndUnlockBadges: () => Badge[];
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<PlayerProgress>(getPlayerProgress());

  useEffect(() => {
    savePlayerProgress(progress);
  }, [progress]);

  const updateProgress = (updates: Partial<PlayerProgress>) => {
    setProgress((prev) => ({ ...prev, ...updates, lastPlayed: new Date() }));
  };

  const completeLevel = (levelId: number, stars: number, problemsSolved: number) => {
    setProgress((prev) => {
      const updatedLevels = prev.levels.map((level) => {
        if (level.id === levelId) {
          return {
            ...level,
            completed: true,
            stars: Math.max(level.stars, stars),
          };
        }
        return level;
      });

      const totalStars = updatedLevels.reduce((sum, level) => sum + level.stars, 0);

      const updatedLevelsWithUnlock = updatedLevels.map((level) => ({
        ...level,
        unlocked: level.unlocked || totalStars >= level.requiredStars,
      }));

      const updatedMiniGames = prev.miniGames.map((game) => ({
        ...game,
        unlocked: totalStars >= game.requiredStars,
      }));

      return {
        ...prev,
        levels: updatedLevelsWithUnlock,
        miniGames: updatedMiniGames,
        totalStars,
        totalProblemsSolved: prev.totalProblemsSolved + problemsSolved,
        lastPlayed: new Date(),
      };
    });
  };

  const updateStreak = (correct: boolean) => {
    setProgress((prev) => {
      if (correct) {
        const newStreak = prev.currentStreak + 1;
        return {
          ...prev,
          currentStreak: newStreak,
          bestStreak: Math.max(prev.bestStreak, newStreak),
        };
      }
      return {
        ...prev,
        currentStreak: 0,
      };
    });
  };

  const setPlayerName = (name: string) => {
    updateProgress({ playerName: name });
  };

  const checkAndUnlockBadges = (): Badge[] => {
    const newlyUnlocked: Badge[] = [];

    setProgress((prev) => {
      const completedLevels = prev.levels.filter((l) => l.completed).length;

      const updatedBadges = prev.badges.map((badge) => {
        if (!badge.unlocked) {
          const shouldUnlock = shouldUnlockBadge(badge.condition, {
            totalStars: prev.totalStars,
            totalProblemsSolved: prev.totalProblemsSolved,
            bestStreak: prev.bestStreak,
            completedLevels,
          });

          if (shouldUnlock) {
            newlyUnlocked.push(badge);
            return { ...badge, unlocked: true, unlockedAt: new Date() };
          }
        }
        return badge;
      });

      return { ...prev, badges: updatedBadges };
    });

    return newlyUnlocked;
  };

  return (
    <ProgressContext.Provider
      value={{
        progress,
        updateProgress,
        completeLevel,
        updateStreak,
        setPlayerName,
        checkAndUnlockBadges,
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return context;
}
