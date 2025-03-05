import React, { useState, useEffect, useCallback } from 'react';
import { Heart } from 'lucide-react';

interface FallingHeart {
  id: number;
  x: number;
  caught: boolean;
}

export const CatchHeartsGame: React.FC = () => {
  const [hearts, setHearts] = useState<FallingHeart[]>([]);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [message, setMessage] = useState('');
  const targetScore = 10;

  const createHeart = useCallback(() => {
    const x = Math.random() * (window.innerWidth - 40);
    setHearts(prev => [...prev, { id: Date.now(), x, caught: false }]);
  }, []);

  const catchHeart = (id: number) => {
    setHearts(prev =>
      prev.map(heart =>
        heart.id === id ? { ...heart, caught: true } : heart
      )
    );
    setScore(prev => {
      const newScore = prev + 1;
      if (newScore >= targetScore) {
        setMessage("You've caught all my love! 💕 I love you so much!");
        setGameStarted(false);
      }
      return newScore;
    });
  };

  useEffect(() => {
    if (!gameStarted) return;
    
    const interval = setInterval(createHeart, 1000);
    return () => clearInterval(interval);
  }, [gameStarted, createHeart]);

  if (!gameStarted) {
    return (
      <div className="text-center p-8">
        {message ? (
          <div className="animate-float">
            <p className="text-xl text-romance-600 mb-4">{message}</p>
            <button
              onClick={() => {
                setScore(0);
                setMessage('');
                setHearts([]);
                setGameStarted(true);
              }}
              className="bg-romance-500 text-white px-6 py-2 rounded-full hover:bg-romance-600 transition-colors"
            >
              Play Again
            </button>
          </div>
        ) : (
          <button
            onClick={() => setGameStarted(true)}
            className="bg-romance-500 text-white px-6 py-2 rounded-full hover:bg-romance-600 transition-colors"
          >
            Start Game
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="relative h-[400px] overflow-hidden">
      <div className="absolute top-4 left-4 bg-white/80 px-4 py-2 rounded-full">
        Score: {score}/{targetScore}
      </div>
      {hearts.map(heart => (
        <div
          key={heart.id}
          className={`absolute animate-fallDown ${heart.caught ? 'opacity-0' : ''}`}
          style={{ left: `${heart.x}px` }}
        >
          <button
            onClick={() => !heart.caught && catchHeart(heart.id)}
            className="transform transition-transform hover:scale-110 focus:outline-none"
          >
            <Heart
              className="w-8 h-8 text-romance-500"
              fill="currentColor"
            />
          </button>
        </div>
      ))}
    </div>
  );
};