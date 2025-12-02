import type { PlayerProgress } from '@/types/game';
import { INITIAL_LEVELS, MINI_GAMES, BADGES } from '@/constants/gameData';

const STORAGE_KEY = 'mathquest_progress';

export function getPlayerProgress(): PlayerProgress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const progress = JSON.parse(stored);
      return {
        ...progress,
        lastPlayed: progress.lastPlayed ? new Date(progress.lastPlayed) : undefined,
        badges: progress.badges.map((badge: any) => ({
          ...badge,
          unlockedAt: badge.unlockedAt ? new Date(badge.unlockedAt) : undefined,
        })),
      };
    }
  } catch (error) {
    console.error('Error loading progress:', error);
  }

  return {
    playerName: 'Player',
    totalStars: 0,
    totalProblemsSolved: 0,
    currentStreak: 0,
    bestStreak: 0,
    levels: INITIAL_LEVELS,
    badges: BADGES,
    miniGames: MINI_GAMES,
  };
}

export function savePlayerProgress(progress: PlayerProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error('Error saving progress:', error);
  }
}

export function resetProgress(): void {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error('Error resetting progress:', error);
  }
}
