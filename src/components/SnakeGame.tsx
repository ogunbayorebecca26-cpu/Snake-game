import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Point, Direction } from '../types';
import { GRID_SIZE, INITIAL_SPEED, SPEED_INCREMENT, MIN_SPEED } from '../constants';
import { Trophy, RefreshCw, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const SnakeGame: React.FC = () => {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>('RIGHT');
  const [isGameOver, setIsGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [speed, setSpeed] = useState(INITIAL_SPEED);

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const generateFood = useCallback((currentSnake: Point[]): Point => {
    let newFood: Point;
    while (true) {
      newFood = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      };
      const isOnSnake = currentSnake.some(
        (segment) => segment.x === newFood.x && segment.y === newFood.y
      );
      if (!isOnSnake) break;
    }
    return newFood;
  }, []);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setIsGameOver(false);
    setScore(0);
    setIsPaused(false);
    setSpeed(INITIAL_SPEED);
  };

  const moveSnake = useCallback(() => {
    if (isPaused || isGameOver) return;

    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { ...head };

      switch (direction) {
        case 'UP': newHead.y -= 1; break;
        case 'DOWN': newHead.y += 1; break;
        case 'LEFT': newHead.x -= 1; break;
        case 'RIGHT': newHead.x += 1; break;
      }

      // Check collisions
      if (
        newHead.x < 0 ||
        newHead.x >= GRID_SIZE ||
        newHead.y < 0 ||
        newHead.y >= GRID_SIZE ||
        prevSnake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)
      ) {
        setIsGameOver(true);
        setIsPaused(true);
        if (score > highScore) setHighScore(score);
        return prevSnake;
      }

      const newSnake = [newHead, ...prevSnake];

      // Check food
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore((s) => s + 10);
        setFood(generateFood(newSnake));
        setSpeed((prev) => Math.max(MIN_SPEED, prev - SPEED_INCREMENT));
      } else {
        newSnake.pop();
      }

      return newSnake;
    });
  }, [direction, food, isGameOver, isPaused, score, highScore, generateFood]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (direction !== 'DOWN') setDirection('UP'); break;
        case 'ArrowDown': if (direction !== 'UP') setDirection('DOWN'); break;
        case 'ArrowLeft': if (direction !== 'RIGHT') setDirection('LEFT'); break;
        case 'ArrowRight': if (direction !== 'LEFT') setDirection('RIGHT'); break;
        case ' ': setIsPaused((p) => !p); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [direction]);

  useEffect(() => {
    if (!isPaused && !isGameOver) {
      gameLoopRef.current = setInterval(moveSnake, speed);
    } else {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    }
    return () => {
      if (gameLoopRef.current) clearInterval(gameLoopRef.current);
    };
  }, [isPaused, isGameOver, moveSnake, speed]);

  return (
    <div className="flex flex-col items-center gap-6 p-6 bg-black glitch-border">
      <div className="flex justify-between w-full px-4 items-center">
        <div className="flex items-center gap-2">
          <span className="text-[#0ff] font-mono text-2xl glitch-text tracking-tighter">DATA_COLLECTED: {score}</span>
        </div>
        <div className="text-[#f0f] font-mono text-sm opacity-70">MAX_YIELD: {highScore}</div>
      </div>

      <div 
        className="relative bg-[#050505] border-4 border-[#0ff] overflow-hidden"
        style={{ 
          width: GRID_SIZE * 20, 
          height: GRID_SIZE * 20,
          display: 'grid',
          gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
          gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`
        }}
      >
        {/* Grid Lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ 
               backgroundImage: 'linear-gradient(#0ff 1px, transparent 1px), linear-gradient(90deg, #0ff 1px, transparent 1px)',
               backgroundSize: '20px 20px'
             }} 
        />

        {/* Snake segments */}
        {snake.map((segment, i) => (
          <motion.div
            key={`${i}-${segment.x}-${segment.y}`}
            initial={false}
            animate={{ x: 0, y: 0 }}
            className={`absolute ${i === 0 ? 'bg-[#0ff] z-10' : 'bg-[#f0f] opacity-80'}`}
            style={{
              width: 18,
              height: 18,
              left: segment.x * 20 + 1,
              top: segment.y * 20 + 1,
            }}
          />
        ))}

        {/* Food */}
        <motion.div
          animate={{ 
            opacity: [1, 0, 1],
            scale: [1, 1.5, 1]
          }}
          transition={{ repeat: Infinity, duration: 0.2 }}
          className="absolute bg-[#fff] z-5"
          style={{
            width: 14,
            height: 14,
            left: food.x * 20 + 3,
            top: food.y * 20 + 3,
          }}
        />

        {/* Game Over Overlay */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-[#f00]/20 flex flex-col items-center justify-center gap-4 backdrop-invert"
            >
              <h2 className="text-[#f0f] text-5xl font-black glitch-text tracking-widest">SYSTEM_CRASH</h2>
              <button 
                onClick={resetGame}
                className="px-8 py-2 bg-[#0ff] text-black font-bold hover:bg-[#f0f] transition-colors uppercase tracking-tighter"
              >
                REBOOT_SEQUENCE
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Start/Pause Overlay */}
        <AnimatePresence>
          {isPaused && !isGameOver && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-20 bg-black/60 flex flex-col items-center justify-center gap-4"
            >
              <button 
                onClick={() => setIsPaused(false)}
                className="px-10 py-4 border-4 border-[#0ff] text-[#0ff] text-2xl font-bold hover:bg-[#0ff] hover:text-black transition-all glitch-text"
              >
                INITIATE_LINK
              </button>
              <p className="text-[#f0f] font-mono text-xs animate-pulse tracking-[0.3em]">WAITING_FOR_INPUT...</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="text-[#0ff]/40 text-xs font-mono tracking-widest uppercase">
        [ NAV_KEYS: ARROWS ] [ INTERRUPT: SPACE ]
      </div>
    </div>
  );
};

export default SnakeGame;
