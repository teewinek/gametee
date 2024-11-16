import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Trophy } from 'lucide-react';

interface VictoryScreenProps {
  isVisible: boolean;
  onClose: () => void;
}

export const VictoryScreen: React.FC<VictoryScreenProps> = ({ isVisible, onClose }) => {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (isVisible) {
      // Play victory sound
      if (audioRef.current) {
        audioRef.current.play().catch(() => {});
      }

      // Create confetti bursts
      const duration = 3 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      };

      const interval = setInterval(() => {
        const timeLeft = animationEnd - Date.now();

        if (timeLeft <= 0) {
          clearInterval(interval);
          return;
        }

        const particleCount = 50;

        confetti({
          particleCount,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#FFD700', '#FFA500', '#FF69B4', '#00FF00', '#4169E1'],
          ticks: 300,
          gravity: 0.8,
          scalar: 1.2,
          shapes: ['star', 'circle'],
          angle: randomInRange(55, 125),
        });

        confetti({
          particleCount: particleCount / 2,
          angle: randomInRange(55, 125),
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#FFD700', '#FFA500', '#FF69B4'],
          ticks: 200,
          gravity: 0.8,
          scalar: 1,
          shapes: ['circle'],
        });
      }, 250);

      return () => clearInterval(interval);
    }
  }, [isVisible]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-50"
        >
          <audio ref={audioRef} src="/sounds/victory.mp3" />
          
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { type: "spring", duration: 0.8 }
            }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
                          opacity-75 blur-3xl animate-pulse-slow" />
            
            <motion.div
              animate={{
                scale: [1, 1.02, 1],
                rotate: [0, -1, 1, -1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse"
              }}
              className="relative bg-white dark:bg-gray-800 rounded-2xl p-12 shadow-2xl
                         transform -rotate-1"
            >
              <Trophy className="w-24 h-24 mx-auto mb-6 text-yellow-500 animate-bounce-slow" />
              
              <motion.h2
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  repeatType: "reverse"
                }}
                className="text-4xl md:text-6xl font-bold text-center mb-4
                           bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500
                           text-transparent bg-clip-text
                           animate-text-shine"
              >
                WINNER!
              </motion.h2>
              
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-2xl md:text-3xl text-center font-bold
                           bg-gradient-to-r from-purple-500 via-pink-500 to-red-500
                           text-transparent bg-clip-text
                           animate-text-rainbow"
              >
                SA7BIIII
              </motion.div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="mt-8 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500
                         text-white rounded-lg font-semibold
                         hover:from-indigo-600 hover:to-purple-600
                         transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50"
              >
                Play Again
              </motion.button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};