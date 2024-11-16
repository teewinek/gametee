import React from 'react';
import { Scissors, FileText, Hand } from 'lucide-react';
import type { Move } from '../types';

interface MoveButtonProps {
  move: Move;
  onClick: () => void;
  disabled?: boolean;
  isActive?: boolean;
}

const icons = {
  rock: Hand,
  paper: FileText,
  scissors: Scissors
};

export const MoveButton: React.FC<MoveButtonProps> = ({ 
  move, 
  onClick, 
  disabled,
  isActive 
}) => {
  const Icon = icons[move];
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        relative p-6 rounded-full
        transform transition-all duration-300
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110 active:scale-95'}
        ${isActive ? 'animate-move' : ''}
        bg-gradient-to-br
        ${move === 'rock' ? 'from-red-400 to-red-600' : 
          move === 'paper' ? 'from-blue-400 to-blue-600' : 
          'from-green-400 to-green-600'}
        shadow-lg hover:shadow-xl
        text-white
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100
        ${move === 'rock' ? 'focus:ring-red-500 hover:shadow-red-500/50' : 
          move === 'paper' ? 'focus:ring-blue-500 hover:shadow-blue-500/50' : 
          'focus:ring-green-500 hover:shadow-green-500/50'}
        transition-shadow duration-300
      `}
    >
      <Icon 
        className={`w-8 h-8 transition-transform duration-300
          ${disabled ? '' : 'group-hover:rotate-12'}
        `}
      />
      <span className="sr-only">{move}</span>
    </button>
  );
};