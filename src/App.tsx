import React, { useEffect, useState } from 'react';
import { Moon, Sun, Volume2, VolumeX, RotateCcw, Undo2 } from 'lucide-react';
import { MoveButton } from './components/MoveButton';
import { MoveDisplay } from './components/MoveDisplay';
import { ScoreBoard } from './components/ScoreBoard';
import { GameHistory } from './components/GameHistory';
import { VictoryScreen } from './components/VictoryScreen';
import { GameOverScreen } from './components/GameOverScreen';
import { useGame } from './hooks/useGame';
import type { Move } from './types';

function App() {
  const {
    gameState,
    makeMove,
    undoLastMove,
    resetGame,
    toggleDarkMode,
    toggleSound,
    setPlayerName,
    setComputerName,
    isGameOver
  } = useGame();

  const [activeMove, setActiveMove] = useState<Move | null>(null);
  const [showMoves, setShowMoves] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [showGameOver, setShowGameOver] = useState(false);

  const handleMove = (move: Move) => {
    setActiveMove(move);
    setShowMoves(false);
    makeMove(move);
    setTimeout(() => {
      setShowMoves(true);
      setTimeout(() => setActiveMove(null), 1000);
    }, 300);
  };

  useEffect(() => {
    if (isGameOver) {
      const isVictory = gameState.playerScore > gameState.computerScore;
      if (isVictory) {
        setShowVictory(true);
      }
      setShowGameOver(true);
    }
  }, [isGameOver, gameState.playerScore, gameState.computerScore]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isGameOver) return;
      
      const moves: Record<string, Move> = {
        'r': 'rock',
        'p': 'paper',
        's': 'scissors'
      };
      
      if (moves[e.key.toLowerCase()]) {
        handleMove(moves[e.key.toLowerCase()]);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isGameOver, makeMove]);

  useEffect(() => {
    if (gameState.isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [gameState.isDarkMode]);

  const handlePlayAgain = () => {
    setShowVictory(false);
    setShowGameOver(false);
    resetGame();
  };

  return (
    <div className={`
      min-h-screen w-full
      transition-colors duration-200
      ${gameState.isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}
    `}>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Rock Paper Scissors</h1>
          <div className="flex gap-4">
            <button
              onClick={toggleSound}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800
                transition-colors duration-200"
              aria-label="Toggle sound"
            >
              {gameState.isSoundEnabled ? (
                <Volume2 className="w-6 h-6" />
              ) : (
                <VolumeX className="w-6 h-6" />
              )}
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800
                transition-colors duration-200"
              aria-label="Toggle theme"
            >
              {gameState.isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <ScoreBoard
          playerScore={gameState.playerScore}
          computerScore={gameState.computerScore}
          playerName={gameState.playerName}
          computerName={gameState.computerName}
          onPlayerNameChange={setPlayerName}
          onComputerNameChange={setComputerName}
        />

        {gameState.lastMove && (
          <MoveDisplay
            playerMove={gameState.lastMove.playerMove}
            computerMove={gameState.lastMove.computerMove}
            result={gameState.lastMove.result}
            isRevealed={showMoves}
          />
        )}

        {!isGameOver && (
          <>
            <div className="flex justify-center gap-6 mb-8">
              <MoveButton 
                move="rock" 
                onClick={() => handleMove('rock')}
                isActive={activeMove === 'rock'} 
              />
              <MoveButton 
                move="paper" 
                onClick={() => handleMove('paper')}
                isActive={activeMove === 'paper'} 
              />
              <MoveButton 
                move="scissors" 
                onClick={() => handleMove('scissors')}
                isActive={activeMove === 'scissors'} 
              />
            </div>

            <div className="text-center mb-4 text-sm text-gray-600 dark:text-gray-400">
              Press R, P, or S keys to make a move
            </div>

            {gameState.lastMove && (
              <div className="text-center mb-8 animate-fade-in">
                <p className="text-lg mb-2">
                  {gameState.lastMove.result === 'win' ? '🎉 You won!' :
                   gameState.lastMove.result === 'lose' ? '😔 Computer won' :
                   "🤝 It's a draw!"}
                </p>
                <button
                  onClick={undoLastMove}
                  className="text-sm text-gray-600 dark:text-gray-400
                    hover:text-gray-900 dark:hover:text-white
                    flex items-center gap-1 mx-auto
                    transition-colors duration-200"
                >
                  <Undo2 className="w-4 h-4" />
                  Undo last move
                </button>
              </div>
            )}
          </>
        )}

        <GameHistory history={gameState.history} />

        <VictoryScreen 
          isVisible={showVictory} 
          onClose={handlePlayAgain}
        />

        <GameOverScreen
          isVisible={showGameOver}
          onClose={handlePlayAgain}
          finalScore={gameState.playerScore}
          isVictory={gameState.playerScore > gameState.computerScore}
        />
      </div>
    </div>
  );
}

export default App;