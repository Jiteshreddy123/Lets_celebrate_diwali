import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Flame, Power, Wand2 } from 'lucide-react';
import { PhuljadiEmitter, PHULJADI_PALETTES } from '../utils/phuljadiParticles';
import { soundEffects } from '../utils/soundEffects';

export const Phuljadi: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [isLit, setIsLit] = useState(false);
  const [activePalette, setActivePalette] = useState('gold');
  const [tipPosition, setTipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isInteracting, setIsInteracting] = useState(false);

  const emitterRef = useRef<PhuljadiEmitter>(new PhuljadiEmitter());
  const coordsRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const isLitRef = useRef(isLit);
  isLitRef.current = isLit;

  // Toggle sparkler on / off
  const toggleSparkler = () => {
    const next = !isLit;
    setIsLit(next);
    if (next) {
      soundEffects.playDiyaIgnite();
      soundEffects.startPhuljadiCrackle();
      // Initial spark burst
      emitterRef.current.emit(coordsRef.current.x, coordsRef.current.y, 35, true);
    } else {
      soundEffects.stopPhuljadiCrackle();
    }
  };

  // Spark burst trigger
  const triggerBurst = () => {
    if (!isLit) {
      toggleSparkler();
      return;
    }
    soundEffects.playSparkBurst();
    emitterRef.current.emit(coordsRef.current.x, coordsRef.current.y, 45, true);
  };

  // Switch palette
  const changePalette = (key: string) => {
    setActivePalette(key);
    emitterRef.current.setPalette(key);
  };

  // Handle pointer down / move on canvas
  const handlePointer = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    coordsRef.current = { x, y };
    setTipPosition({ x, y });

    if (isLitRef.current) {
      // Emit extra sparks on user movement
      emitterRef.current.emit(x, y, 7);
    }
  }, []);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const emitter = emitterRef.current;

    const resize = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.resetTransform();
      ctx.scale(dpr, dpr);

      // Default initial tip position at center
      if (coordsRef.current.x === 0 && coordsRef.current.y === 0) {
        const initX = rect.width / 2;
        const initY = rect.height * 0.42;
        coordsRef.current = { x: initX, y: initY };
        setTipPosition({ x: initX, y: initY });
      }
    };

    resize();
    window.addEventListener('resize', resize);

    let idleAngle = 0;

    const render = () => {
      const rect = canvas.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const isBurning = isLitRef.current;

      // When burning but user is not dragging, gently animate the tip
      if (isBurning && !isInteracting) {
        idleAngle += 0.04;
        const centerX = rect.width / 2;
        const centerY = rect.height * 0.42;
        // Subtle figure-8 / sway motion
        coordsRef.current.x = centerX + Math.sin(idleAngle) * 35;
        coordsRef.current.y = centerY + Math.sin(idleAngle * 2) * 12;
        setTipPosition({ ...coordsRef.current });
      }

      if (isBurning) {
        // Continuous emitting of sparks from burning chemical tip
        emitter.emit(coordsRef.current.x, coordsRef.current.y, 4);

        // Random micro burst
        if (Math.random() < 0.04) {
          emitter.emit(coordsRef.current.x, coordsRef.current.y, 14, true);
        }
      }

      emitter.update();
      emitter.draw(ctx, coordsRef.current.x, coordsRef.current.y, isBurning);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      soundEffects.stopPhuljadiCrackle();
    };
  }, [isInteracting]);

  return (
    <section id="phuljadi" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-festive border border-amber-500/25 text-amber-300 text-xs sm:text-sm font-medium mb-3">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Handheld Sparkler Experience</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-gold-gradient tracking-tight mb-4">
          Interactive Phuljadi
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Light the sparkler, then touch and move your finger across the sky to draw glowing golden trails. Feel the nostalgic crackle of real Diwali phuljadis.
        </p>
      </div>

      {/* Main Interactive Stage Container */}
      <div className="relative max-w-4xl mx-auto glass-card rounded-3xl p-4 sm:p-8 border border-amber-500/25 shadow-2xl overflow-hidden">
        
        {/* Controls Toolbar: Power Button, Burst, Color Palettes */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-amber-500/15">
          {/* Main Action: Light Phuljadi Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSparkler}
              className={`px-5 sm:px-6 py-3 rounded-2xl font-serif font-bold text-sm sm:text-base flex items-center gap-2.5 shadow-xl transition-all active:scale-95 min-h-[48px] ${
                isLit
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white shadow-rose-900/30'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-festive-darker shadow-amber-500/30 hover:scale-[1.02]'
              }`}
            >
              <Power className="w-5 h-5" />
              <span>{isLit ? 'EXTINGUISH PHULJADI' : 'LIGHT PHULJADI ✨'}</span>
            </button>

            {isLit && (
              <button
                onClick={triggerBurst}
                className="px-4 py-3 rounded-2xl glass-festive border border-amber-400/50 text-amber-200 hover:text-white font-medium text-xs sm:text-sm flex items-center gap-1.5 shadow-lg active:scale-95 transition-all min-h-[48px]"
              >
                <Wand2 className="w-4 h-4 text-amber-300 animate-spin" style={{ animationDuration: '4s' }} />
                <span>Spark Burst!</span>
              </button>
            )}
          </div>

          {/* Color Selectors */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 hidden sm:inline">Theme:</span>
            {Object.entries(PHULJADI_PALETTES).map(([key, pal]) => (
              <button
                key={key}
                onClick={() => changePalette(key)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                  activePalette === key
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/20'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                }`}
              >
                {pal.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* The Sparkler Interactive Stage (Canvas Area) */}
        <div
          ref={containerRef}
          className="relative w-full h-[380px] sm:h-[460px] bg-gradient-to-b from-[#070b1a] via-[#040610] to-[#020308] rounded-2xl border border-amber-500/20 overflow-hidden cursor-crosshair select-none canvas-interactive shadow-inner"
          onPointerDown={(e) => {
            (e.target as HTMLElement).setPointerCapture(e.pointerId);
            setIsInteracting(true);
            handlePointer(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (isInteracting) {
              handlePointer(e.clientX, e.clientY);
            }
          }}
          onPointerUp={(e) => {
            try {
              (e.target as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {
              // Ignore
            }
            setIsInteracting(false);
          }}
          onPointerCancel={() => setIsInteracting(false)}
        >
          {/* Subtle night-sky stars in canvas background */}
          <div className="absolute inset-0 pointer-events-none opacity-40 bg-[radial-gradient(#FDE047_1px,transparent_1px)] [background-size:28px_28px]" />

          {/* Spark Particles Canvas */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
          />

          {/* Handheld Sparkler Illustration following tip position */}
          <div
            className="absolute pointer-events-none transition-transform duration-75 origin-top-left"
            style={{
              left: `${tipPosition.x}px`,
              top: `${tipPosition.y}px`,
              transform: `translate(0px, 0px) rotate(${isInteracting ? -18 : -22}deg)`,
            }}
          >
            {/* SVG of traditional Indian wire phuljadi */}
            <svg width="60" height="260" viewBox="0 0 60 260" className="drop-shadow-lg">
              <defs>
                {/* Metallic wire gradient */}
                <linearGradient id="wireGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#94A3B8" />
                  <stop offset="50%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#64748B" />
                </linearGradient>

                {/* Combustible chemical composition coating (dark speckled charcoal/magnesium) */}
                <linearGradient id="chemicalGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#334155" />
                  <stop offset="50%" stopColor="#475569" />
                  <stop offset="100%" stopColor="#1E293B" />
                </linearGradient>

                {/* Hot glowing ember tip gradient */}
                <linearGradient id="burningTipGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="40%" stopColor="#FDE047" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>
              </defs>

              {/* Lower bare steel wire handle */}
              <line
                x1="6"
                y1="110"
                x2="6"
                y2="250"
                stroke="url(#wireGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Chemical coating body */}
              <rect
                x="3"
                y="6"
                width="6.5"
                height="115"
                rx="2"
                fill="url(#chemicalGrad)"
                stroke="#1E293B"
                strokeWidth="0.8"
              />

              {/* Burning hot tip at the apex */}
              {isLit && (
                <g>
                  {/* Glowing hot core */}
                  <circle cx="6" cy="6" r="6" fill="url(#burningTipGrad)" className="animate-pulse" />
                  <circle cx="6" cy="6" r="3" fill="#FFFFFF" />
                </g>
              )}
            </svg>
          </div>

          {/* Interactive Hint Overlay */}
          {!isLit ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center pointer-events-none bg-black/40 backdrop-blur-[2px]">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="max-w-sm p-6 rounded-2xl glass-festive border border-amber-400/40 shadow-2xl"
              >
                <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400/40 flex items-center justify-center mx-auto mb-3">
                  <Flame className="w-6 h-6 text-amber-300 animate-bounce" />
                </div>
                <h4 className="font-serif font-bold text-lg text-amber-200 mb-1">
                  Sparkler is Ready
                </h4>
                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  Click the &ldquo;LIGHT PHULJADI&rdquo; button above to ignite the sparkler and begin creating golden trails.
                </p>
                <button
                  onClick={toggleSparkler}
                  className="pointer-events-auto px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-festive-darker font-bold text-sm shadow-lg shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all"
                >
                  Light Phuljadi ✨
                </button>
              </motion.div>
            </div>
          ) : (
            /* Live Touch Prompt */
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none px-4 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/30 text-[11px] sm:text-xs text-amber-200 font-medium text-center shadow-lg whitespace-nowrap">
              {isInteracting 
                ? '✨ Drawing sparks in the air!' 
                : '👆 Touch & drag anywhere to wave the phuljadi'}
            </div>
          )}
        </div>

        {/* Feature Highlights Footer */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/80">
            <span className="text-xs text-amber-300 font-medium block">Sparks with Gravity</span>
            <span className="text-[10px] text-slate-400">Authentic ballistic physics</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/80">
            <span className="text-xs text-amber-300 font-medium block">Branching Micro-Sparks</span>
            <span className="text-[10px] text-slate-400">Real charcoal pop effect</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/80">
            <span className="text-xs text-amber-300 font-medium block">Mobile-First Touch</span>
            <span className="text-[10px] text-slate-400">Silky 60fps gesture tracking</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-900/30 border border-slate-800/80">
            <span className="text-xs text-amber-300 font-medium block">Organic Crackling Sound</span>
            <span className="text-[10px] text-slate-400">Web Audio synthesized</span>
          </div>
        </div>

      </div>
    </section>
  );
};
