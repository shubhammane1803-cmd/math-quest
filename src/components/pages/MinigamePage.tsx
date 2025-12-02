import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { ArrowLeft } from 'lucide-react';
import { useProgress } from '@/context/ProgressContexts';
import { generateMathProblem } from '@/utils/gameLogic';
import ConfettiEffect from '@/game/ConfettiEffect';
import type { MathProblem } from '@/types/game';

export default function MiniGamePage() {
  const { gameId } = useParams<{ gameId: string }>();
  const navigate = useNavigate();
  const { progress, updateStreak } = useProgress();

  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameProgress, setGameProgress] = useState(0);

  const game = progress.miniGames.find((g) => g.id === Number(gameId));

  useEffect(() => {
    if (game) {
      generateNewProblem();
    }
  }, [game]);

  const generateNewProblem = () => {
    const operations: ('addition' | 'subtraction' | 'multiplication')[] = [
      'addition',
      'subtraction',
      'multiplication',
    ];
    const randomOp = operations[Math.floor(Math.random() * operations.length)];
    const newProblem = generateMathProblem(randomOp, 'beginner');
    setProblem(newProblem);
    setSelectedAnswer(null);
    setShowResult(false);
  };

  const handleAnswerSelect = (answer: number) => {
    if (showResult) return;
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (selectedAnswer === null || !problem) return;

    const correct = selectedAnswer === problem.correctAnswer;
    setIsCorrect(correct);
    setShowResult(true);

    if (correct) {
      setScore((prev) => prev + 10);
      setGameProgress((prev) => Math.min(prev + 10, 100));
      updateStreak(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    } else {
      updateStreak(false);
    }
  };

  const handleNext = () => {
    generateNewProblem();
  };

  if (!game) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Game not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto" />
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 xl:p-8">
      <ConfettiEffect show={showConfetti} />
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-lg font-bold text-primary">Score: {score}</div>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardContent className="p-6 text-center">
            <div className="text-4xl mb-2 animate-float">{game.icon}</div>
            <h2 className="text-2xl font-bold gradient-text">{game.name}</h2>
            <p className="text-sm text-muted-foreground">{game.description}</p>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Progress</span>
            <span>{gameProgress}%</span>
          </div>
          <Progress value={gameProgress} className="h-3" />
        </div>

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <div className="text-5xl xl:text-6xl font-bold text-foreground mb-4 animate-float">
                {problem.question} = ?
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {problem.options.map((option, index) => (
                <Button
                  key={index}
                  size="lg"
                  variant={selectedAnswer === option ? 'default' : 'outline'}
                  onClick={() => handleAnswerSelect(option)}
                  disabled={showResult}
                  className={`text-2xl h-20 ${
                    showResult && option === problem.correctAnswer
                      ? 'bg-success hover:bg-success'
                      : showResult && option === selectedAnswer && !isCorrect
                        ? 'bg-destructive hover:bg-destructive'
                        : ''
                  }`}
                >
                  {option}
                </Button>
              ))}
            </div>

            {showResult && (
              <div className="text-center space-y-4">
                <div
                  className={`text-xl font-bold ${isCorrect ? 'text-success' : 'text-destructive'}`}
                >
                  {isCorrect ? '🎉 Correct! +10 points' : '❌ Incorrect'}
                </div>
                {!isCorrect && (
                  <p className="text-muted-foreground">
                    The correct answer is {problem.correctAnswer}
                  </p>
                )}
                <Button onClick={handleNext} size="lg" className="w-full">
                  Next Question
                </Button>
              </div>
            )}

            {!showResult && (
              <Button
                onClick={handleSubmit}
                disabled={selectedAnswer === null}
                size="lg"
                className="w-full"
              >
                Submit Answer
              </Button>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Current Streak: {progress.currentStreak} 🔥
        </div>
      </div>
    </div>
  );
}
8