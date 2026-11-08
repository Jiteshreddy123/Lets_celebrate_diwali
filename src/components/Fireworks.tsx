import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Play, StopCircle } from 'lucide-react';
import { FireworksManager, FireworkType } from '../utils/fireworks';
import { soundEffects } from '../utils/soundEffects';
import { useReducedMotion } from '../hooks/useReducedMotion';

export const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const managerRef = useRef<FireworksManager>(new FireworksManager());
  const prefersReducedMotion = useReducedMotion();

  const [selectedType, setSelectedType] = useState<FireworkType | 'random'>('random');
  const [isGrandShowRunning, setIsGrandShowRunning] = useState(false);
  const [skyFlash, setSkyFlash] = useState(false);
  const grandShowTimerRef = useRef<number | null>(null);

  // Sound hook on explosion
  useEffect(() => {
    managerRef.current.onExplode = (_x, _y, type) => {
      soundEffects.playFireworkExplosion(type === 'chrysanthemum' ? 'grand' : 'normal');

      // Subtle sky illumination flash
      if (!prefersReducedMotion) {
        setSkyFlash(true);
        setTimeout(() => setSkyFlash(false), 90);
      }
    };
  }, [prefersReducedMotion]);

  // Launch a firework at target coordinates
  const launchAt = useCallback((targetX: number, targetY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Rocket starts from near bottom, slightly randomized around target X
    const startX = targetX + (Math.random() - 0.5) * 60;
    const startY = rect.height - 10;

    const chosen = selectedType === 'random' ? undefined : selectedType;
    soundEffects.playFireworkLaunch();
    managerRef.current.launch(startX, startY, targetX, targetY, chosen);
  }, [selectedType]);

  // Grand Diwali Show barrage
  const toggleGrandShow = () => {
    if (isGrandShowRunning) {
      if (grandShowTimerRef.current) clearInterval(grandShowTimerRef.current);
      setIsGrandShowRunning(false);
      return;
    }

    setIsGrandShowRunning(true);
    soundEffects.playCelebrationChime();

    let shots = 0;
    const maxShots = 24;

    grandShowTimerRef.current = window.setInterval(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();

      const tx = 60 + Math.random() * (rect.width - 120);
      const ty = 60 + Math.random() * (rect.height * 0.55);
      launchAt(tx, ty);

      shots++;
      if (shots >= maxShots) {
        if (grandShowTimerRef.current) clearInterval(grandShowTimerRef.current);
        setIsGrandShowRunning(false);
      }
    }, 420);
  };

  // Canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const manager = managerRef.current;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      // Night sky clear with slight trail fade
      ctx.fillStyle = 'rgba(5, 7, 17, 0.22)';
      ctx.fillRect(0, 0, rect.width, rect.height);

      manager.update();
      manager.draw(ctx);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      if (grandShowTimerRef.current) clearInterval(grandShowTimerRef.current);
    };
  }, []);

  return (
    <section id="fireworks" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-festive border border-amber-500/25 text-amber-300 text-xs sm:text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Interactive Night Sky</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-gold-gradient tracking-tight mb-4">
          Diwali Fireworks Sky
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Tap or click anywhere in the night sky to launch vibrant fireworks. Experience the magic of golden chrysanthemums, twinkling willows, and dazzling starbursts.
        </p>

        {/* Emotion Message */}
        <p className="text-amber-200/90 font-serif italic text-base sm:text-xl font-medium mt-3">
          &ldquo;May your dreams shine brighter than the stars.&rdquo;
        </p>
      </div>

      {/* Interactive Sky Canvas Frame */}
      <div className="relative max-w-5xl mx-auto glass-card rounded-3xl p-4 sm:p-6 border border-amber-500/25 shadow-2xl overflow-hidden">
        
        {/* Sky Toolbar: Grand Show button + Pattern Selector */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-amber-500/15">
          {/* Grand Show CTA Button */}
          <button
            onClick={toggleGrandShow}
            className={`px-5 sm:px-6 py-3 rounded-2xl font-serif font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition-all active:scale-95 min-h-[48px] ${
              isGrandShowRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-900/30 animate-pulse'
                : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-festive-darker shadow-amber-500/25 hover:scale-[1.02]'
            }`}
          >
            {isGrandShowRunning ? <StopCircle className="w-5 h-5" /> : <Play className="w-5 h-5 fill-current" />}
            <span>{isGrandShowRunning ? 'STOP CELEBRATION' : 'GRAND DIWALI SHOW 🎆'}</span>
          </button>

          {/* Firework Pattern Filter Buttons */}
          <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
            <span className="text-xs text-slate-400 hidden md:inline">Pattern:</span>
            {[
              { id: 'random', label: 'Random ✨' },
              { id: 'chrysanthemum', label: 'Golden 🌼' },
              { id: 'colorful', label: 'Peony 🌸' },
              { id: 'willow', label: 'Willow 💧' },
              { id: 'star', label: 'Starburst ⭐' },
            ].map((p) => (
              <button
                key={p.id}
                onClick={() => setSelectedType(p.id as FireworkType | 'random')}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  selectedType === p.id
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/20'
                    : 'border-slate-800 bg-slate-900/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* The Interactive Sky Stage */}
        <div
          ref={containerRef}
          onClick={(e) => {
            const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
            launchAt(e.clientX - rect.left, e.clientY - rect.top);
          }}
          className="relative w-full h-[400px] sm:h-[500px] bg-gradient-to-b from-[#03050e] via-[#050818] to-[#0a0f2b] rounded-2xl border border-amber-500/20 overflow-hidden cursor-pointer select-none canvas-interactive shadow-inner"
        >
          {/* Ambient Sky Flash on Burst */}
          <AnimatePresence>
            {skyFlash && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.18 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.1 }}
                className="absolute inset-0 bg-amber-200 pointer-events-none z-10"
              />
            )}
          </AnimatePresence>

          {/* Background Stars / Constellations */}
          <div className="absolute inset-0 pointer-events-none opacity-50 bg-[radial-gradient(#FFF_1px,transparent_1px)] [background-size:32px_32px]" />

          {/* Temple Silhouette at the horizon */}
          <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none opacity-20 flex justify-between items-end px-4">
            <svg viewBox="0 0 800 60" className="w-full h-full fill-slate-900 preserve-3d">
              <path d="M0,60 L0,40 Q40,30 80,45 T160,35 Q200,10 240,40 T320,45 Q400,20 480,45 T560,30 Q640,15 720,40 T800,45 L800,60 Z" />
            </svg>
          </div>

          {/* Canvas for Rockets & Particles */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
          />

          {/* Tap Prompt Overlay */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-[11px] sm:text-xs text-amber-200 font-medium text-center shadow-lg">
            ✨ Tap or click anywhere to explode fireworks
          </div>
        </div>

        {/* Accessibility Notice */}
        {prefersReducedMotion && (
          <p className="text-[11px] text-amber-400/80 text-center mt-3">
            ℹ️ Reduced-motion is enabled on your device: Sky flashes are softened.
          </p>
        )}

      </div>
    </section>
  );
};
