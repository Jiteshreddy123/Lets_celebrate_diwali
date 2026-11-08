import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, ChevronRight, ChevronLeft } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface RightDiyaCounterProps {
  litCount: number;
  onQuickLight: () => void;
}

export const RightDiyaCounter: React.FC<RightDiyaCounterProps> = ({ litCount, onQuickLight }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [plusOnes, setPlusOnes] = useState<Array<{ id: number; y: number }>>([]);

  // Trigger pulse animation when litCount increments
  useEffect(() => {
    setPulse(true);
    const newPlus = { id: Date.now(), y: -20 - Math.random() * 25 };
    setPlusOnes((prev) => [...prev.slice(-3), newPlus]);

    const timer = setTimeout(() => setPulse(false), 600);
    const cleanupPlus = setTimeout(() => {
      setPlusOnes((prev) => prev.filter((p) => p.id !== newPlus.id));
    }, 1200);

    return () => {
      clearTimeout(timer);
      clearTimeout(cleanupPlus);
    };
  }, [litCount]);

  const handleWidgetClick = () => {
    soundEffects.playDiyaIgnite();
    onQuickLight();
  };

  return (
    <aside
      aria-label="Live Diya Counter"
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 select-none transition-all duration-300"
    >
      <div className="relative flex items-center">
        
        {/* Toggle Collapse tab */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 sm:p-1.5 rounded-l-xl bg-amber-950/90 border-y border-l border-amber-500/30 text-amber-300/80 hover:text-amber-200 hover:bg-amber-900/90 shadow-lg backdrop-blur-md transition-all -mr-[1px]"
          title={isCollapsed ? 'Show Diya Counter' : 'Collapse Diya Counter'}
          aria-label={isCollapsed ? 'Show Diya Counter' : 'Collapse Diya Counter'}
        >
          {isCollapsed ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        </button>

        {/* Floating +1 particle celebrations */}
        <div className="absolute -top-6 right-8 pointer-events-none">
          <AnimatePresence>
            {plusOnes.map((p) => (
              <motion.span
                key={p.id}
                initial={{ opacity: 1, scale: 0.6, y: 0 }}
                animate={{ opacity: 0, scale: 1.4, y: p.y }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="absolute text-xs sm:text-sm font-black text-amber-300 font-serif drop-shadow-[0_0_8px_#F59E0B] whitespace-nowrap"
              >
                +1 🪔
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        {/* Main Counter Card */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: 25, scale: 0.9 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.85 }}
              transition={{ duration: 0.25 }}
              className="glass-festive rounded-2xl p-3 sm:p-4 border border-amber-400/40 shadow-2xl shadow-amber-950/40 backdrop-blur-xl flex flex-col items-center text-center max-w-[130px] sm:max-w-[155px] group hover:border-amber-400/70 transition-all cursor-pointer"
              onClick={handleWidgetClick}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleWidgetClick();
                }
              }}
            >
              {/* Live Indicator Header */}
              <div className="flex items-center gap-1.5 mb-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                  Live Global
                </span>
              </div>

              {/* Glowing Animated Diya Icon */}
              <div className="relative mb-1">
                <div 
                  className={`absolute inset-0 rounded-full blur-md bg-amber-500/40 transition-all duration-300 ${
                    pulse ? 'scale-150 bg-amber-400/70' : 'scale-100'
                  }`}
                />
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/30 relative">
                  <span className="text-xl sm:text-2xl leading-none">🪔</span>
                </div>
              </div>

              {/* Number Count Display */}
              <div className="mt-1">
                <motion.span
                  key={litCount}
                  initial={{ scale: 1.15 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="font-serif font-black text-xl sm:text-2xl md:text-3xl text-gold-gradient tracking-tight block leading-tight tabular-nums"
                >
                  {litCount.toLocaleString()}
                </motion.span>
                <span className="text-[10px] sm:text-xs font-semibold text-amber-200/90 block leading-tight mt-0.5">
                  Diyas Lighted Up
                </span>
              </div>

              {/* Subtitle / CTA */}
              <div className="mt-2 pt-2 border-t border-amber-500/20 w-full flex items-center justify-center gap-1 text-[9px] sm:text-[10px] text-amber-300/80 group-hover:text-amber-200 transition-colors">
                <Flame className="w-3 h-3 text-orange-400 fill-orange-400 animate-pulse" />
                <span>Tap to Light +1</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </aside>
  );
};
