import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  left: number;
  backgroundColor: string;
  animationDelay: string;
  animationDuration: string;
}

export default function ConfettiEffect({ show }: { show: boolean }) {
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (show) {
      const colors = [
        'hsl(220, 90%, 56%)',
        'hsl(280, 70%, 60%)',
        'hsl(142, 76%, 45%)',
        'hsl(38, 92%, 50%)',
        'hsl(340, 82%, 52%)',
      ];

      const pieces: ConfettiPiece[] = Array.from({ length: 50 }, (_, i) => ({
        id: i,
        left: Math.random() * 100,
        backgroundColor: colors[Math.floor(Math.random() * colors.length)],
        animationDelay: `${Math.random() * 0.5}s`,
        animationDuration: `${2 + Math.random() * 2}s`,
      }));

      setConfetti(pieces);

      const timer = setTimeout(() => {
        setConfetti([]);
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!show || confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="confetti absolute w-2 h-2 rounded-sm"
          style={{
            left: `${piece.left}%`,
            backgroundColor: piece.backgroundColor,
            animationDelay: piece.animationDelay,
            animationDuration: piece.animationDuration,
          }}
        />
      ))}
    </div>
  );
}
8