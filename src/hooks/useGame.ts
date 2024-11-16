import { useState, useCallback } from 'react';
import type { Move, GameResult, GameHistory, GameState } from '../types';

const WINNING_SCORE = 2;

const determineWinner = (playerMove: Move, computerMove: Move): GameResult => {
  if (playerMove === computerMove) return 'draw';
  
  const wins = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper'
  };
  
  return wins[playerMove] === computerMove ? 'win' : 'lose';
};

const generateComputerMove = (): Move => {
  const moves: Move[] = ['rock', 'paper', 'scissors'];
  return moves[Math.floor(Math.random() * moves.length)];
};

export const useGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    playerScore: 0,
    computerScore: 0,
    history: [],
    roundsPlayed: 0,
    isDarkMode: false,
    isSoundEnabled: true,
    playerName: 'Player',
    computerName: 'teewinek'
  });

  const playSound = useCallback((sound: 'move' | 'win' | 'lose') => {
    if (!gameState.isSoundEnabled) return;
    
    const audio = new Audio(`/sounds/${sound}.mp3`);
    audio.play().catch(() => {});
  }, [gameState.isSoundEnabled]);

  const makeMove = useCallback((playerMove: Move) => {
    const computerMove = generateComputerMove();
    const result = determineWinner(playerMove, computerMove);
    
    playSound(result === 'win' ? 'win' : result === 'lose' ? 'lose' : 'move');

    const newHistory: GameHistory = {
      playerMove,
      computerMove,
      result,
      timestamp: Date.now()
    };

    setGameState(prev => ({
      ...prev,
      playerScore: prev.playerScore + (result === 'win' ? 1 : 0),
      computerScore: prev.computerScore + (result === 'lose' ? 1 : 0),
      history: [newHistory, ...prev.history],
      roundsPlayed: prev.roundsPlayed + 1,
      lastMove: newHistory
    }));
  }, [playSound]);

  const undoLastMove = useCallback(() => {
    setGameState(prev => {
      if (prev.history.length === 0) return prev;
      
      const [lastMove, ...remainingHistory] = prev.history;
      return {
        ...prev,
        playerScore: prev.playerScore - (lastMove.result === 'win' ? 1 : 0),
        computerScore: prev.computerScore - (lastMove.result === 'lose' ? 1 : 0),
        history: remainingHistory,
        roundsPlayed: prev.roundsPlayed - 1,
        lastMove: remainingHistory[0]
      };
    });
  }, []);

  const resetGame = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      playerScore: 0,
      computerScore: 0,
      history: [],
      roundsPlayed: 0,
      lastMove: undefined
    }));
  }, []);

  const toggleDarkMode = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isDarkMode: !prev.isDarkMode
    }));
  }, []);

  const toggleSound = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isSoundEnabled: !prev.isSoundEnabled
    }));
  }, []);

  const setPlayerName = useCallback((name: string) => {
    setGameState(prev => ({
      ...prev,
      playerName: name
    }));
  }, []);

  const setComputerName = useCallback((name: string) => {
    setGameState(prev => ({
      ...prev,
      computerName: name
    }));
  }, []);

  const isGameOver = gameState.playerScore >= WINNING_SCORE || 
                    gameState.computerScore >= WINNING_SCORE;

  return {
    gameState,
    makeMove,
    undoLastMove,
    resetGame,
    toggleDarkMode,
    toggleSound,
    setPlayerName,
    setComputerName,
    isGameOver
  };
};