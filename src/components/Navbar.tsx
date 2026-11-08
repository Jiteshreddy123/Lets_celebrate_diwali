import React, { useState } from 'react';
import { Volume2, VolumeX, Sparkles, Menu, X, Flame } from 'lucide-react';
import { soundEffects } from '../utils/soundEffects';

interface NavbarProps {
  litCount: number;
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ litCount, activeSection }) => {
  const [isMuted, setIsMuted] = useState<boolean>(() => soundEffects.getMuted());
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleSound = () => {
    const nextState = soundEffects.toggleMute();
    setIsMuted(nextState);
    if (!nextState) {
      soundEffects.playDiyaIgnite();
    }
  };

  const navItems = [
    { id: 'phuljadi', label: 'Phuljadi', href: '#phuljadi' },
    { id: 'fireworks', label: 'Fireworks', href: '#fireworks' },
    { id: 'dedicate', label: 'Dedicate', href: '#dedicate' },
    { id: 'wall', label: 'Diya Wall', href: '#wall' },
    { id: 'share', label: 'Share', href: '#share' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 sm:pt-4">
        <div className="glass-festive rounded-2xl px-4 py-2.5 sm:py-3 flex items-center justify-between shadow-2xl shadow-amber-950/20 border border-amber-500/20">
          
          {/* Logo & Festival Name */}
          <a 
            href="#" 
            className="flex items-center gap-2.5 group focus:outline-none"
            aria-label="Diwali Unlimited Home"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-200 flex items-center justify-center shadow-lg shadow-amber-500/30 group-hover:scale-105 transition-transform">
              <span className="text-xl leading-none">🪔</span>
            </div>
            <div>
              <span className="font-serif font-extrabold text-base sm:text-lg tracking-wider text-gold-gradient block leading-tight">
                DIWALI UNLIMITED
              </span>
              <span className="text-[10px] tracking-widest uppercase text-amber-200/70 block font-sans">
                Light • Sparkle • Share
              </span>
            </div>
          </a>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'text-amber-200 bg-amber-500/20 border border-amber-400/40 shadow-sm shadow-amber-500/20'
                      : 'text-slate-300 hover:text-amber-300 hover:bg-amber-500/10'
                  }`}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>

          {/* Controls: Diya Count + Sound Toggle */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Diya Lit Badge */}
            <div 
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-amber-500/15 to-orange-500/15 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-medium shadow-inner"
              title="Total Diyas Lit by You & Loved Ones"
            >
              <Flame className="w-3.5 h-3.5 text-orange-400 fill-orange-400 animate-pulse" />
              <span className="font-bold tabular-nums text-amber-200">{litCount}</span>
              <span className="hidden sm:inline text-amber-200/80">Lit</span>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={toggleSound}
              type="button"
              className={`relative p-2 rounded-xl transition-all border ${
                isMuted
                  ? 'bg-slate-800/60 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  : 'bg-amber-500/20 border-amber-400/40 text-amber-300 shadow-md shadow-amber-500/20'
              }`}
              title={isMuted ? 'Turn Sound On' : 'Mute Sound'}
              aria-label={isMuted ? 'Turn Sound On' : 'Mute Sound'}
            >
              {isMuted ? (
                <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>

            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-300 hover:text-amber-300 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-2 glass-festive rounded-2xl p-4 border border-amber-500/20 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-200">
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-base text-slate-200 hover:text-amber-300 hover:bg-amber-500/15 transition-all flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <Sparkles className="w-4 h-4 text-amber-400/50" />
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};
