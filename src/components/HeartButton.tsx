import React from 'react';
import { Heart } from 'lucide-react';

interface HeartButtonProps {
  onClick: () => void;
  className?: string;
}

export const HeartButton: React.FC<HeartButtonProps> = ({ onClick, className = '' }) => {
  return (
    <button
      onClick={onClick}
      className={`transform transition-transform hover:scale-110 focus:outline-none ${className}`}
    >
      <Heart className="w-8 h-8 text-romance-500 animate-heartbeat" fill="currentColor" />
    </button>
  );
};