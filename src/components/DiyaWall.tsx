import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Globe2, UserCheck, Flame } from 'lucide-react';
import { DedicationItem } from './Dedication';
import { soundEffects } from '../utils/soundEffects';

interface DiyaWallProps {
  dedications: DedicationItem[];
  onHeartDiya: (id: string) => void;
}

// Pre-seeded community wishes with diverse, heartfelt representation
const SEED_COMMUNITY_DIYAS: DedicationItem[] = [
  {
    id: 'seed_1',
    recipientName: 'Maa & Bauji',
    senderName: 'Aarav (Bengaluru)',
    wishText: 'May good health and joyful peace grace our ancestral courtyard forever.',
    category: 'Family',
    timestamp: Date.now() - 3600000 * 2,
    isLocal: false,
  },
  {
    id: 'seed_2',
    recipientName: 'Priya & Kabir',
    senderName: 'Neha (Mumbai)',
    wishText: 'Wishing you both a year brimming with laughter, love, and sweet beginnings.',
    category: 'Friend',
    timestamp: Date.now() - 3600000 * 5,
    isLocal: false,
  },
  {
    id: 'seed_3',
    recipientName: 'Our Mentors & Teachers',
    senderName: 'Batch of 2026',
    wishText: 'Thank you for dispelling our darkness and lighting up our minds with knowledge.',
    category: 'Mentor',
    timestamp: Date.now() - 3600000 * 8,
    isLocal: false,
  },
  {
    id: 'seed_4',
    recipientName: 'Little Ananya',
    senderName: 'Chacha & Chachi',
    wishText: 'Keep sparkling bright like a golden phuljadi in every dream you chase!',
    category: 'Family',
    timestamp: Date.now() - 3600000 * 12,
    isLocal: false,
  },
  {
    id: 'seed_5',
    recipientName: 'Frontline Workers',
    senderName: 'Devika (Delhi)',
    wishText: 'This lamp burns in gratitude for those who keep the world safe day and night.',
    category: 'Loved One',
    timestamp: Date.now() - 3600000 * 18,
    isLocal: false,
  },
  {
    id: 'seed_6',
    recipientName: 'Grandma Rukmini',
    senderName: 'Rohan (London)',
    wishText: 'Missing your besan laddoos and bedtime Diwali tales. Sending all my love!',
    category: 'Family',
    timestamp: Date.now() - 3600000 * 24,
    isLocal: false,
  },
];

export const DiyaWall: React.FC<DiyaWallProps> = ({ dedications, onHeartDiya }) => {
  const [filter, setFilter] = useState<'all' | 'local' | 'community'>('all');
  const [likedIds, setLikedIds] = useState<Record<string, number>>({});

  // Combine user local dedications with community demo wall
  const allDiyas = [...dedications, ...SEED_COMMUNITY_DIYAS];

  const filteredDiyas = allDiyas.filter((d) => {
    if (filter === 'local') return d.isLocal;
    if (filter === 'community') return !d.isLocal;
    return true;
  });

  const handleLike = (id: string) => {
    soundEffects.playDiyaIgnite();
    setLikedIds((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
    onHeartDiya(id);
  };

  return (
    <section id="wall" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-festive border border-amber-500/25 text-amber-300 text-xs sm:text-sm font-medium mb-3">
          <Globe2 className="w-4 h-4 text-amber-400" />
          <span>The Shared Diya Wall</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-gold-gradient tracking-tight mb-4">
          TOGETHER, WE LIGHT UP THE WORLD
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Every lamp represents a warm wish sent out to the universe. Explore the glowing tapestry of prayers, love, and blessings.
        </p>

        {/* Clear Transparency Notice regarding Local vs Demo Global */}
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 border border-slate-800 text-[11px] sm:text-xs text-slate-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Your dedications are saved locally on your device. Community lamps showcase demo festival wishes worldwide.
          </span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-10">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border transition-all ${
            filter === 'all'
              ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/15'
              : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
          }`}
        >
          <span>All Lights ({allDiyas.length})</span>
        </button>

        <button
          onClick={() => setFilter('local')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-1.5 transition-all ${
            filter === 'local'
              ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/15'
              : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Your Dedications ({dedications.length})</span>
        </button>

        <button
          onClick={() => setFilter('community')}
          className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-medium border flex items-center gap-1.5 transition-all ${
            filter === 'community'
              ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/15'
              : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
          }`}
        >
          <Globe2 className="w-3.5 h-3.5 text-amber-400" />
          <span>Community ({SEED_COMMUNITY_DIYAS.length})</span>
        </button>
      </div>

      {/* Responsive Masonry / Grid of Glowing Diyas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredDiyas.map((diya, idx) => {
            const likes = (likedIds[diya.id] || 0) + (diya.isLocal ? 1 : 12 + (idx * 3));

            return (
              <motion.div
                key={diya.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className={`glass-card rounded-3xl p-6 border transition-all relative flex flex-col justify-between overflow-hidden group hover:scale-[1.02] ${
                  diya.isLocal
                    ? 'border-amber-400/50 shadow-xl shadow-amber-500/10 bg-gradient-to-b from-amber-950/20 to-slate-900/90'
                    : 'border-amber-500/15 hover:border-amber-500/35'
                }`}
              >
                {/* Subtle warm glow behind flame */}
                <div className="absolute top-2 left-6 w-24 h-24 bg-amber-500/15 rounded-full blur-xl pointer-events-none" />

                <div>
                  {/* Top Header: Badge + Category */}
                  <div className="flex items-center justify-between mb-4">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full border ${
                      diya.isLocal
                        ? 'bg-amber-500/20 border-amber-400/40 text-amber-200'
                        : 'bg-slate-800/80 border-slate-700 text-slate-400'
                    }`}>
                      {diya.isLocal ? '📍 Your Dedication' : '🌍 Community'}
                    </span>

                    <span className="text-[11px] text-amber-300/70 font-medium">
                      {diya.category}
                    </span>
                  </div>

                  {/* Diya SVG + Recipient Name */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-14 h-14 flex-shrink-0 relative">
                      <svg viewBox="0 0 80 70" className="w-full h-full drop-shadow-md animate-flame-pulse">
                        {/* Flame */}
                        <path
                          d="M 40 8 C 30 24 31 42 40 44 C 49 42 50 24 40 8 Z"
                          fill="#F59E0B"
                          className="animate-flicker origin-bottom"
                        />
                        <path
                          d="M 40 18 C 35 28 36 40 40 42 C 44 40 45 28 40 18 Z"
                          fill="#FFFBEB"
                        />
                        {/* Diya Bowl */}
                        <path
                          d="M 14 44 C 18 60 32 66 40 66 C 48 66 62 60 66 44 C 58 48 48 50 40 50 C 32 50 22 48 14 44 Z"
                          fill="#9A3412"
                          stroke="#FBBF24"
                          strokeWidth="1"
                        />
                        <ellipse cx="40" cy="44" rx="26" ry="6" fill="#7C2D12" />
                      </svg>
                    </div>

                    <div>
                      <span className="text-[10px] text-slate-400 uppercase tracking-widest block font-medium">
                        Lit For
                      </span>
                      <h4 className="font-serif font-black text-lg text-gold-gradient leading-tight">
                        {diya.recipientName}
                      </h4>
                    </div>
                  </div>

                  {/* Wish Text */}
                  <p className="text-slate-200 text-sm leading-relaxed italic bg-black/20 p-3.5 rounded-xl border border-white/5 mb-4">
                    &ldquo;{diya.wishText}&rdquo;
                  </p>
                </div>

                {/* Card Footer: Sender + Heart reaction */}
                <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs">
                  <span className="text-slate-400 font-medium truncate max-w-[170px]">
                    {diya.senderName ? `From: ${diya.senderName}` : 'Anonymous Wish'}
                  </span>

                  <button
                    onClick={() => handleLike(diya.id)}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/20 transition-all active:scale-95"
                    title="Send Love to this Diya"
                  >
                    <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
                    <span className="tabular-nums font-semibold">{likes}</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {filteredDiyas.length === 0 && (
        <div className="text-center py-12 glass-festive rounded-2xl p-6">
          <Flame className="w-8 h-8 text-amber-400 mx-auto mb-2 opacity-60" />
          <p className="text-slate-300 font-medium">No dedications in this category yet.</p>
          <a href="#dedicate" className="text-xs text-amber-300 hover:underline mt-1 inline-block">
            Be the first to dedicate a diya!
          </a>
        </div>
      )}

    </section>
  );
};
