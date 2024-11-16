import React from 'react';
import { Clock, Trophy, Minus } from 'lucide-react';
import type { GameHistory as GameHistoryType } from '../types';

interface GameHistoryProps {
  history: GameHistoryType[];
}

export const GameHistory: React.FC<GameHistoryProps> = ({ history }) => {
  return (
    <div className="w-full max-w-md mt-8">
      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5" />
        Game History
      </h3>
      <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
        {history.map((game, index) => (
          <div
            key={game.timestamp}
            className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                #{history.length - index}
              </span>
              <div className="flex items-center gap-2">
                <span className="capitalize">{game.playerMove}</span>
                <span className="text-gray-400">vs</span>
                <span className="capitalize">{game.computerMove}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {game.result === 'win' && <Trophy className="w-4 h-4 text-yellow-500" />}
              {game.result === 'lose' && <Trophy className="w-4 h-4 text-red-500" />}
              {game.result === 'draw' && <Minus className="w-4 h-4 text-gray-500" />}
              <span className={`
                text-sm font-medium
                ${game.result === 'win' ? 'text-yellow-500' : 
                  game.result === 'lose' ? 'text-red-500' : 
                  'text-gray-500'}
              `}>
                {game.result.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};