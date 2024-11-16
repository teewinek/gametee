import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy, Award, RotateCcw, Star } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface GameStats {
  gamesPlayed: number;
  wins: number;
  losses: number;
  bestStreak: number;
}

interface GameOverScreenProps {
  isVisible: boolean;
  onClose: () => void;
  finalScore: number;
  isVictory: boolean;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  isVisible,
  onClose,
  finalScore,
  isVictory
}) => {
  const [displayScore, setDisplayScore] = useState(0);
  const [stats, setStats] = useLocalStorage<GameStats>('rps-stats', {
    gamesPlayed: 0,
    wins: 0,
    losses: 0,
    bestStreak: 0
  });
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const tickRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Play victory/defeat sound
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      // Animate score counter
      const duration = 1500;
      const startTime = Date.now();
      const startScore = 0;

      const animateScore = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        const currentScore = Math.floor(startScore + (finalScore - startScore) * progress);
        setDisplayScore(currentScore);

        if (progress < 1) {
          requestAnimationFrame(animateScore);
          // Play tick sound
          if (tickRef.current && currentScore % 1 === 0) {
            const tickClone = tickRef.current.cloneNode() as HTMLAudioElement;
            tickClone.volume = 0.2;
            tickClone.play().catch(() => {});
          }
        }
      };

      animateScore();

      // Update stats
      setStats(prev => ({
        gamesPlayed: prev.gamesPlayed + 1,
        wins: prev.wins + (isVictory ? 1 : 0),
        losses: prev.losses + (isVictory ? 0 : 1),
        bestStreak: isVictory ? Math.max(prev.bestStreak, prev.wins + 1) : prev.bestStreak
      }));

      // Create particles
      if (isVictory) {
        const interval = setInterval(() => {
          confetti({
            particleCount: 50,
            spread: 80,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#FF69B4'],
          });
        }, 300);

        return () => clearInterval(interval);
      }
    }
  }, [isVisible, finalScore, isVictory, setStats]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
          
          <audio ref={audioRef} src={`/sounds/${isVictory ? 'victory' : 'defeat'}.mp3`} />
          <audio ref={tickRef} src="/sounds/tick.mp3" />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative bg-white dark:bg-gray-800 rounded-xl p-8 max-w-md w-full mx-4
                     shadow-2xl border border-white/10"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 rounded-xl" />
            
            <div className="relative">
              {isVictory ? (
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
              ) : (
                <Award className="w-16 h-16 mx-auto mb-4 text-blue-500" />
              )}

              <h2 className={`text-3xl font-bold text-center mb-6
                ${isVictory ? 'text-yellow-500' : 'text-blue-500'}`}>
                Game Over
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Final Score</span>
                  <span className="text-2xl font-bold">{displayScore}</span>
                </div>

                <div className="h-px bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent" />

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Games Played</div>
                    <div className="text-xl font-bold">{stats.gamesPlayed}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
                    <div className="text-sm text-gray-600 dark:text-gray-400">Win Rate</div>
                    <div className="text-xl font-bold">
                      {Math.round((stats.wins / Math.max(stats.gamesPlayed, 1)) * 100)}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-center text-yellow-500">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Best Streak: {stats.bestStreak}</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="w-full py-3 px-6 rounded-lg
                  bg-gradient-to-r from-indigo-500 to-purple-500
                  text-white font-semibold
                  hover:from-indigo-600 hover:to-purple-600
                  transform transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50
                  animate-pulse-glow
                  flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Play Again
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};