import React from 'react';
import { Hand, FileText, Scissors } from 'lucide-react';
import type { Move } from '../types';

interface MoveDisplayProps {
  playerMove?: Move;
  computerMove?: Move;
  result?: 'win' | 'lose' | 'draw';
  isRevealed: boolean;
}

const icons = {
  rock: Hand,
  paper: FileText,
  scissors: Scissors
};

const getBackgroundColor = (move: Move) => {
  const colors = {
    rock: 'from-red-400 to-red-600',
    paper: 'from-blue-400 to-blue-600',
    scissors: 'from-green-400 to-green-600'
  };
  return colors[move];
};

export const MoveDisplay: React.FC<MoveDisplayProps> = ({
  playerMove,
  computerMove,
  result,
  isRevealed
}) => {
  if (!playerMove || !computerMove) return null;

  const PlayerIcon = icons[playerMove];
  const ComputerIcon = icons[computerMove];

  return (
    <div className="flex justify-center items-center gap-8 mb-8">
      <div className={`
        transform transition-all duration-500
        ${isRevealed ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0'}
      `}>
        <div className={`
          p-8 rounded-full
          bg-gradient-to-br ${getBackgroundColor(playerMove)}
          ${result === 'win' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
          shadow-lg
          animate-slide-in-left
        `}>
          <PlayerIcon className="w-12 h-12 text-white" />
        </div>
        <p className="text-center mt-2 font-medium">Your Move</p>
      </div>

      <div className="text-2xl font-bold text-gray-400">vs</div>

      <div className={`
        transform transition-all duration-500
        ${isRevealed ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
      `}>
        <div className={`
          p-8 rounded-full
          bg-gradient-to-br ${getBackgroundColor(computerMove)}
          ${result === 'lose' ? 'ring-4 ring-yellow-400 ring-opacity-50' : ''}
          shadow-lg
          animate-slide-in-right
        `}>
          <ComputerIcon className="w-12 h-12 text-white" />
        </div>
        <p className="text-center mt-2 font-medium">Computer's Move</p>
      </div>
    </div>
  );
};