import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { Progress } from '@/ui/progress';
import { ArrowLeft, Trophy } from 'lucide-react';
import { useProgress } from '@/context/ProgressContexts';
import { generateMathProblem, calculateStars } from '@/utils/gameLogic';
import { QUESTIONS_PER_LEVEL } from '@/constants/gameData';
import ConfettiEffect from '@/game/ConfettiEffect';
import StarRating from '@/common/StarRating';
import { useToast } from '@/hooks/use-toast';
import type { MathProblem } from '@/types/game';

export default function GamePlayPage() {
  const { levelId } = useParams<{ levelId: string }>();
  const navigate = useNavigate();
  const { progress, completeLevel, updateStreak, checkAndUnlockBadges } = useProgress();
  const { toast } = useToast();

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [problem, setProblem] = useState<MathProblem | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [earnedStars, setEarnedStars] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);

  const level = progress.levels.find((l) => l.id === Number(levelId));

  useEffect(() => {
    if (level && !gameComplete) {
      generateNewProblem();
    }
  }, [currentQuestion, level, gameComplete]);

  const generateNewProblem = () => {
    if (!level) return;
    const newProblem = generateMathProblem(level.operation, level.difficulty);
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
      setCorrectAnswers((prev) => prev + 1);
      updateStreak(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      updateStreak(false);
    }
  };

  const handleNext = () => {
    if (currentQuestion + 1 >= QUESTIONS_PER_LEVEL) {
      const stars = calculateStars(correctAnswers, QUESTIONS_PER_LEVEL);
      setEarnedStars(stars);
      setGameComplete(true);
      completeLevel(Number(levelId), stars, QUESTIONS_PER_LEVEL);

      const newBadges = checkAndUnlockBadges();
      if (newBadges.length > 0) {
        setTimeout(() => {
          newBadges.forEach((badge) => {
            toast({
              title: '🎉 New Badge Unlocked!',
              description: `${badge.icon} ${badge.name}`,
            });
          });
        }, 1000);
      }
    } else {
      setCurrentQuestion((prev) => prev + 1);
    }
  };

  if (!level) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-muted-foreground">Level not found</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (gameComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <ConfettiEffect show={earnedStars > 0} />
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center space-y-6">
            <Trophy className="w-20 h-20 mx-auto text-warning animate-bounce-slow" />
            <h2 className="text-3xl font-bold gradient-text">Level Complete!</h2>
            <div className="space-y-2">
              <p className="text-lg text-foreground">
                You got {correctAnswers} out of {QUESTIONS_PER_LEVEL} correct!
              </p>
              <div className="flex justify-center">
                <StarRating stars={earnedStars} size="lg" animated />
              </div>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate('/')} className="flex-1">
                Home
              </Button>
              <Button onClick={() => window.location.reload()} className="flex-1">
                Play Again
              </Button>
            </div>
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

  const progressPercentage = ((currentQuestion + 1) / QUESTIONS_PER_LEVEL) * 100;

  return (
    <div className="min-h-screen p-4 xl:p-8">
      <ConfettiEffect show={showConfetti} />
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="text-sm text-muted-foreground">
            Question {currentQuestion + 1} / {QUESTIONS_PER_LEVEL}
          </div>
        </div>

        <Progress value={progressPercentage} className="h-2" />

        <Card>
          <CardContent className="p-8 space-y-6">
            <div className="text-center">
              <h2 className="text-sm font-medium text-muted-foreground mb-2">{level.name}</h2>
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
                  {isCorrect ? '🎉 Correct!' : '❌ Incorrect'}
                </div>
                {!isCorrect && (
                  <p className="text-muted-foreground">
                    The correct answer is {problem.correctAnswer}
                  </p>
                )}
                <Button onClick={handleNext} size="lg" className="w-full">
                  {currentQuestion + 1 >= QUESTIONS_PER_LEVEL ? 'Finish' : 'Next Question'}
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
