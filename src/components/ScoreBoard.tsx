import React from 'react';
import { PlayerProfile } from './PlayerProfile';

interface ScoreBoardProps {
  playerScore: number;
  computerScore: number;
  playerName: string;
  computerName: string;
  onPlayerNameChange: (name: string) => void;
  onComputerNameChange: (name: string) => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  playerScore,
  computerScore,
  playerName,
  computerName,
  onPlayerNameChange,
  onComputerNameChange,
}) => {
  return (
    <div className="flex justify-center items-center gap-12 mb-12">
      <div className="text-center">
        <PlayerProfile
          name={playerName}
          onNameChange={onPlayerNameChange}
          imageUrl="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop"
        />
        <div className="text-4xl font-bold mt-2">{playerScore}</div>
      </div>

      <div className="text-4xl font-bold text-gray-400">vs</div>

      <div className="text-center">
        <PlayerProfile
          name={computerName}
          onNameChange={onComputerNameChange}
          imageUrl="https://images.unsplash.com/photo-1563898989545-9e6c89ba9e9f?w=200&h=200&fit=crop"
          isComputer
        />
        <div className="text-4xl font-bold mt-2">{computerScore}</div>
      </div>
    </div>
  );
};