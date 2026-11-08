import React, { useState } from 'react';
import { Heart, Sparkles, ArrowUp } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface FooterProps {
  onFinaleTrigger: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onFinaleTrigger }) => {
  const [celebrated, setCelebrated] = useState(false);

  const handleCelebrate = () => {
    soundEffects.playCelebrationChime();
    soundEffects.playFireworkExplosion('grand');
    setCelebrated(true);
    onFinaleTrigger();
    setTimeout(() => setCelebrated(false), 3000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="relative pt-24 pb-12 px-4 sm:px-6 lg:px-8 border-t border-amber-500/20 bg-gradient-to-b from-festive-midnight via-festive-darker to-black overflow-hidden">
      
      {/* Radiant Background Aura */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-amber-600/10 blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center flex flex-col items-center">
        
        {/* Ceremonial Glowing Diya Graphic */}
        <div className="w-20 h-20 mb-6 relative">
          <svg viewBox="0 0 100 90" className="w-full h-full drop-shadow-xl animate-flame-pulse">
            <path
              d="M 50 10 C 40 28 41 48 50 50 C 59 48 60 28 50 10 Z"
              fill="#F59E0B"
              className="animate-flicker origin-bottom"
            />
            <path
              d="M 50 22 C 45 32 46 45 50 47 C 54 45 55 32 50 22 Z"
              fill="#FFFBEB"
            />
            <path
              d="M 18 50 C 22 72 38 78 50 78 C 62 78 78 72 82 50 C 72 55 60 58 50 58 C 40 58 28 55 18 50 Z"
              fill="#9A3412"
              stroke="#FDE047"
              strokeWidth="1.5"
            />
            <ellipse cx="50" cy="50" rx="32" ry="8" fill="#7C2D12" stroke="#FEF08A" strokeWidth="1" />
          </svg>
        </div>

        {/* Section Title */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-gold-gradient tracking-tight mb-4">
          THIS DIWALI, BE SOMEONE&apos;S LIGHT.
        </h2>

        {/* Blessing Message */}
        <p className="text-base sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed mb-6 font-normal">
          May your home be filled with happiness, your heart with peace and your journey with beautiful new beginnings.
        </p>

        {/* Final Warm Wish */}
        <p className="text-2xl sm:text-4xl font-serif font-bold text-amber-200 tracking-wide mb-8 flex items-center gap-3">
          <span>Happy Diwali!</span>
          <span className="text-3xl">🪔</span>
          <span className="text-rose-400">❤️</span>
        </p>

        {/* Finale Fireworks Trigger Button */}
        <button
          onClick={handleCelebrate}
          className="px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-festive-darker font-serif font-black text-base sm:text-lg shadow-2xl shadow-amber-500/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-3 mb-16 min-h-[52px]"
        >
          <Sparkles className="w-5 h-5 text-festive-darker" />
          <span>{celebrated ? 'SPARKLE SHOWER ACTIVATED! ✨' : 'LAUNCH GRAND CELEBRATION 🎆'}</span>
        </button>

        {/* Back to Top */}
        <button
          onClick={scrollToTop}
          className="p-3 rounded-full glass-festive border border-amber-500/30 text-amber-300 hover:text-white hover:border-amber-400 transition-all mb-8 shadow-lg"
          title="Scroll to Top"
          aria-label="Scroll to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>

        {/* Bottom Credits & Copyright */}
        <div className="pt-8 border-t border-white/10 w-full flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif font-bold text-amber-400/80">DIWALI UNLIMITED</span>
            <span>• Crafted with love & light for Diwali celebrations</span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Wishing you peace, joy and abundance</span>
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400 inline" />
          </div>
        </div>

      </div>
    </footer>
  );
};
