import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, ChevronDown, Heart } from 'lucide-react';
import { createAmbientParticle, AmbientParticle } from '../utils/particles';
import lakshmiDeviImg from '../assets/lakshmi-devi.jpg';

interface HeroProps {
  onEnter: () => void;
  onDiyaClick: () => void;
  heroDiyaLit: boolean;
}

export const Hero: React.FC<HeroProps> = ({ onEnter, onDiyaClick, heroDiyaLit }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Background floating golden particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: AmbientParticle[] = [];
    const count = Math.min(Math.floor((width * height) / 18000), 75);

    for (let i = 0; i < count; i++) {
      particles.push(createAmbientParticle(width, height));
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulsePhase += p.pulseSpeed;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.15;
        const boundedAlpha = Math.max(0.05, Math.min(currentAlpha, p.maxAlpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 90%, 65%, ${boundedAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = `hsla(${p.hue}, 95%, 60%, 0.8)`;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-4 overflow-hidden bg-gradient-to-b from-festive-dark via-festive-midnight to-festive-darker">
      {/* Background Floating Dust Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none z-0 opacity-75"
      />

      {/* Subtle Festive Radial Glow behind Hero */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] sm:w-[650px] h-[340px] sm:h-[650px] rounded-full pointer-events-none z-0 transition-opacity duration-1000"
        style={{
          background: heroDiyaLit 
            ? 'radial-gradient(circle, rgba(245, 158, 11, 0.22) 0%, rgba(234, 88, 12, 0.08) 45%, rgba(0,0,0,0) 70%)'
            : 'radial-gradient(circle, rgba(229, 169, 60, 0.12) 0%, rgba(0,0,0,0) 65%)'
        }}
      />

      {/* Decorative Traditional Rangoli Ring (subtle SVG background) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] z-0">
        <svg viewBox="0 0 600 600" className="w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] animate-[spin_120s_linear_infinite]">
          <circle cx="300" cy="300" r="280" fill="none" stroke="#FDE047" strokeWidth="2" strokeDasharray="8 8" />
          <circle cx="300" cy="300" r="230" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="300" cy="300" r="180" fill="none" stroke="#FDE047" strokeWidth="2" strokeDasharray="4 6" />
          <circle cx="300" cy="300" r="120" fill="none" stroke="#F59E0B" strokeWidth="1" />
          {[...Array(12)].map((_, i) => (
            <line
              key={i}
              x1="300"
              y1="20"
              x2="300"
              y2="580"
              stroke="#FDE047"
              strokeWidth="0.8"
              transform={`rotate(${i * 15} 300 300)`}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Festive Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-festive border border-amber-400/30 text-amber-200 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-amber-500/10"
        >
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>The Digital Festival of Lights</span>
          <span className="text-amber-400">✨</span>
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.15, ease: 'easeOut' }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-serif font-black tracking-tight mb-4 flex items-center justify-center gap-2 sm:gap-4 flex-wrap"
        >
          <span className="text-gold-gradient drop-shadow-md">DIWALI UNLIMITED</span>
          <span className="text-3xl sm:text-5xl md:text-6xl animate-bounce" style={{ animationDuration: '3s' }}>🪔</span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-lg sm:text-2xl md:text-3xl font-serif font-medium text-amber-200/90 tracking-wide mb-3"
        >
          &ldquo;Light a diya. Spark a smile. Spread happiness.&rdquo;
        </motion.p>

        {/* Sacred Lakshmi Devi Portrait in Exact Proportion */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="relative my-3 flex flex-col items-center"
        >
          {/* Radiant Halo behind Lakshmi Devi */}
          <div 
            className="absolute inset-0 rounded-3xl blur-2xl pointer-events-none transition-all duration-700"
            style={{
              background: heroDiyaLit
                ? 'radial-gradient(circle, rgba(251, 191, 36, 0.45) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 75%)'
                : 'radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, transparent 70%)'
            }}
          />

          {/* Golden Framed Picture */}
          <div className="relative p-1.5 sm:p-2 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-amber-300 via-amber-500 to-amber-800 shadow-2xl shadow-amber-950/60 border border-amber-300/50">
            <img
              src={lakshmiDeviImg}
              alt="Maa Lakshmi Devi — Goddess of Wealth, Light and Prosperity"
              className="w-48 sm:w-60 md:w-72 aspect-square object-contain rounded-xl sm:rounded-2xl drop-shadow-xl"
              loading="eager"
            />
          </div>
        </motion.div>

        {/* Hero Interactive Clay Diya */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.55 }}
          className="my-1 sm:my-3 cursor-pointer group flex flex-col items-center"
          onClick={onDiyaClick}
        >
          <div className="relative p-2">
            {/* Ambient Diya Aura */}
            <div 
              className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
                heroDiyaLit 
                  ? 'bg-amber-500/40 scale-125' 
                  : 'bg-amber-500/10 scale-90 group-hover:bg-amber-500/25'
              }`}
            />

            {/* SVG Diya */}
            <svg
              viewBox="0 0 200 160"
              className="w-44 h-36 sm:w-56 sm:h-44 transition-transform duration-300 group-hover:scale-105"
            >
              {/* Flame (visible if lit) */}
              {heroDiyaLit ? (
                <g className="animate-flame-pulse">
                  {/* Outer flame halo */}
                  <ellipse cx="100" cy="55" rx="22" ry="32" fill="url(#heroFlameOuter)" opacity="0.6" />
                  
                  {/* Flame body */}
                  <path
                    d="M 100 15 C 80 50 82 85 100 88 C 118 85 120 50 100 15 Z"
                    fill="url(#heroFlameGrad)"
                    className="animate-flicker origin-bottom"
                  />
                  {/* White-hot inner flame */}
                  <path
                    d="M 100 35 C 90 60 92 82 100 84 C 108 82 110 60 100 35 Z"
                    fill="#FFFBEB"
                    opacity="0.92"
                  />
                </g>
              ) : (
                /* Unlit cotton wick */
                <path
                  d="M 98 84 Q 100 70 102 62"
                  stroke="#475569"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                />
              )}

              {/* Clay Diya Body with Terracotta Texture & Engravings */}
              <defs>
                <linearGradient id="heroFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#FFFBEB" />
                  <stop offset="20%" stopColor="#FDE047" />
                  <stop offset="60%" stopColor="#F59E0B" />
                  <stop offset="100%" stopColor="#EA580C" />
                </linearGradient>

                <radialGradient id="heroFlameOuter" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.8" />
                  <stop offset="50%" stopColor="#EA580C" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#EA580C" stopOpacity="0" />
                </radialGradient>

                <linearGradient id="clayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#C2410C" />
                  <stop offset="35%" stopColor="#9A3412" />
                  <stop offset="100%" stopColor="#431407" />
                </linearGradient>

                <linearGradient id="goldRim" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#F59E0B" />
                  <stop offset="50%" stopColor="#FEF08A" />
                  <stop offset="100%" stopColor="#D97706" />
                </linearGradient>
              </defs>

              {/* Diya Base Shadow */}
              <ellipse cx="100" cy="142" rx="60" ry="10" fill="rgba(0, 0, 0, 0.45)" />

              {/* Clay Diya Pot */}
              <path
                d="M 30 92 C 35 130 70 142 100 142 C 130 142 165 130 170 92 C 150 102 115 106 100 106 C 85 106 50 102 30 92 Z"
                fill="url(#clayGrad)"
                stroke="#B45309"
                strokeWidth="2"
              />

              {/* Diya Lip / Rim with Gold Inlay */}
              <ellipse
                cx="100"
                cy="92"
                rx="70"
                ry="15"
                fill="#78350F"
                stroke="url(#goldRim)"
                strokeWidth="2.5"
              />

              {/* Oil reservoir */}
              <ellipse
                cx="100"
                cy="93"
                rx="56"
                ry="9"
                fill={heroDiyaLit ? '#92400E' : '#451A03'}
              />

              {/* Engraved traditional floral dots on clay body */}
              <circle cx="70" cy="116" r="2.5" fill="#FDE047" opacity="0.8" />
              <circle cx="85" cy="122" r="2.5" fill="#FDE047" opacity="0.8" />
              <circle cx="100" cy="124" r="3" fill="#FDE047" opacity="0.9" />
              <circle cx="115" cy="122" r="2.5" fill="#FDE047" opacity="0.8" />
              <circle cx="130" cy="116" r="2.5" fill="#FDE047" opacity="0.8" />
            </svg>
          </div>

          <span className="text-xs sm:text-sm font-medium text-amber-300/80 mt-1 flex items-center gap-1.5 group-hover:text-amber-200 transition-colors">
            {heroDiyaLit ? (
              <span className="text-amber-300">✨ Flame ignited! Tap again for sound & sparks</span>
            ) : (
              <span>👆 Tap to ignite the auspicious first diya</span>
            )}
          </span>
        </motion.div>

        {/* Primary CTA: "ENTER THE CELEBRATION" */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.75 }}
          className="flex flex-col sm:flex-row items-center gap-4 mt-4 w-full sm:w-auto"
        >
          <button
            onClick={onEnter}
            type="button"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:via-yellow-400 hover:to-amber-500 text-festive-darker font-serif font-bold text-base sm:text-lg tracking-wider shadow-xl shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 min-h-[52px]"
          >
            <span>ENTER THE CELEBRATION</span>
            <Sparkles className="w-5 h-5 text-festive-darker" />
          </button>

          <a
            href="#dedicate"
            className="w-full sm:w-auto px-6 py-4 rounded-2xl glass-festive border border-amber-500/30 hover:border-amber-400/60 text-amber-200 hover:text-white font-medium text-sm sm:text-base tracking-wide transition-all flex items-center justify-center gap-2 min-h-[52px]"
          >
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40" />
            <span>Dedicate a Diya</span>
          </a>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
          className="mt-12 hidden sm:flex flex-col items-center text-amber-300/60 text-xs gap-1"
        >
          <span>Scroll to celebrate</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>

      </div>
    </section>
  );
};
