export type Move = 'rock' | 'paper' | 'scissors';
export type GameResult = 'win' | 'lose' | 'draw';

export interface GameHistory {
  playerMove: Move;
  computerMove: Move;
  result: GameResult;
  timestamp: number;
}

export interface GameState {
  playerScore: number;
  computerScore: number;
  history: GameHistory[];
  roundsPlayed: number;
  lastMove?: GameHistory;
  isDarkMode: boolean;
  isSoundEnabled: boolean;
  playerName: string;
  computerName: string;
}