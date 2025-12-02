export type OperationType = 'addition' | 'subtraction' | 'multiplication' | 'mixed';

export type DifficultyLevel = 'beginner' | 'advanced';

export interface Level {
  id: number;
  name: string;
  operation: OperationType;
  difficulty: DifficultyLevel;
  unlocked: boolean;
  stars: number;
  completed: boolean;
  requiredStars: number;
}

export interface MiniGame {
  id: number;
  name: string;
  description: string;
  theme: string;
  requiredStars: number;
  unlocked: boolean;
  icon: string;
}

export interface Badge {
  id: number;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: Date;
  condition: {
    type: 'first_win' | 'streak' | 'stars' | 'problems_solved';
    value: number;
  };
}

export interface MathProblem {
  question: string;
  correctAnswer: number;
  options: number[];
  operation: OperationType;
}

export interface PlayerProgress {
  playerName: string;
  totalStars: number;
  totalProblemsSolved: number;
  currentStreak: number;
  bestStreak: number;
  levels: Level[];
  badges: Badge[];
  miniGames: MiniGame[];
  lastPlayed?: Date;
}

export interface GameSession {
  levelId: number;
  startTime: Date;
  correctAnswers: number;
  totalQuestions: number;
  currentStreak: number;
  timePerQuestion: number[];
}
