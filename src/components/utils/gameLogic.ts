import type { MathProblem, OperationType, DifficultyLevel } from '@/types/game';

export function generateMathProblem(
  operation: OperationType,
  difficulty: DifficultyLevel
): MathProblem {
  let num1: number;
  let num2: number;
  let correctAnswer: number;
  let question: string;
  let actualOperation: 'addition' | 'subtraction' | 'multiplication';

  if (operation === 'mixed') {
    const operations: ('addition' | 'subtraction' | 'multiplication')[] = [
      'addition',
      'subtraction',
      'multiplication',
    ];
    actualOperation = operations[Math.floor(Math.random() * operations.length)];
  } else {
    actualOperation = operation;
  }

  if (difficulty === 'beginner') {
    num1 = Math.floor(Math.random() * 10) + 1;
    num2 = Math.floor(Math.random() * 10) + 1;
  } else {
    num1 = Math.floor(Math.random() * 20) + 10;
    num2 = Math.floor(Math.random() * 20) + 10;
  }

  switch (actualOperation) {
    case 'addition':
      correctAnswer = num1 + num2;
      question = `${num1} + ${num2}`;
      break;
    case 'subtraction':
      if (num1 < num2) [num1, num2] = [num2, num1];
      correctAnswer = num1 - num2;
      question = `${num1} - ${num2}`;
      break;
    case 'multiplication':
      if (difficulty === 'beginner') {
        num1 = Math.floor(Math.random() * 10) + 1;
        num2 = Math.floor(Math.random() * 10) + 1;
      } else {
        num1 = Math.floor(Math.random() * 12) + 1;
        num2 = Math.floor(Math.random() * 12) + 1;
      }
      correctAnswer = num1 * num2;
      question = `${num1} × ${num2}`;
      break;
  }

  const options = generateOptions(correctAnswer, difficulty);

  return {
    question,
    correctAnswer,
    options,
    operation: actualOperation,
  };
}

function generateOptions(correctAnswer: number, difficulty: DifficultyLevel): number[] {
  const options = new Set<number>([correctAnswer]);
  const range = difficulty === 'beginner' ? 10 : 20;

  while (options.size < 4) {
    const offset = Math.floor(Math.random() * range) - range / 2;
    const option = correctAnswer + offset;
    if (option > 0 && option !== correctAnswer) {
      options.add(option);
    }
  }

  return Array.from(options).sort(() => Math.random() - 0.5);
}

export function calculateStars(correctAnswers: number, totalQuestions: number): number {
  const percentage = (correctAnswers / totalQuestions) * 100;

  if (percentage >= 90) return 3;
  if (percentage >= 70) return 2;
  if (percentage >= 50) return 1;
  return 0;
}

export function shouldUnlockBadge(
  badgeCondition: { type: string; value: number },
  progress: {
    totalStars: number;
    totalProblemsSolved: number;
    bestStreak: number;
    completedLevels: number;
  }
): boolean {
  switch (badgeCondition.type) {
    case 'first_win':
      return progress.completedLevels >= badgeCondition.value;
    case 'stars':
      return progress.totalStars >= badgeCondition.value;
    case 'problems_solved':
      return progress.totalProblemsSolved >= badgeCondition.value;
    case 'streak':
      return progress.bestStreak >= badgeCondition.value;
    default:
      return false;
  }
}
