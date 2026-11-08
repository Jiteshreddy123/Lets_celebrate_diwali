import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Send, Share2, Download, Copy, Check } from 'lucide-react';
import { shareToWhatsApp, shareNative, copyToClipboard, generateGreetingCardPng, formatWhatsAppMessage } from '../utils/sharing';
import { soundEffects } from '../utils/soundEffects';

export interface DedicationItem {
  id: string;
  recipientName: string;
  senderName: string;
  wishText: string;
  category: string;
  timestamp: number;
  isLocal: boolean;
}

interface DedicationProps {
  onDedicationAdded: (item: DedicationItem) => void;
}

export const Dedication: React.FC<DedicationProps> = ({ onDedicationAdded }) => {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [wishText, setWishText] = useState('');
  const [category, setCategory] = useState('Family');

  const [activeDedication, setActiveDedication] = useState<DedicationItem | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const categories = ['Family', 'Friend', 'Partner', 'Mentor', 'Loved One'];

  const defaultWishes: Record<string, string> = {
    Family: 'May our home always resonate with laughter, warmth, and boundless togetherness.',
    Friend: 'May your life always shine with happiness, peace and endless opportunities.',
    Partner: 'You are the brightest light in my life. Wishing you endless love and happiness.',
    Mentor: 'Thank you for illuminating my path with wisdom, encouragement, and guidance.',
    'Loved One': 'Sending you a heart full of light, warm blessings, and deep joy this Diwali.',
  };

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    if (!wishText || Object.values(defaultWishes).includes(wishText)) {
      setWishText(defaultWishes[cat]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipientName.trim()) return;

    soundEffects.playDiyaIgnite();
    soundEffects.playCelebrationChime();

    const newDedication: DedicationItem = {
      id: `local_${Date.now()}`,
      recipientName: recipientName.trim(),
      senderName: senderName.trim(),
      wishText: wishText.trim() || defaultWishes[category],
      category,
      timestamp: Date.now(),
      isLocal: true,
    };

    setActiveDedication(newDedication);
    onDedicationAdded(newDedication);
  };

  const handleShareWhatsApp = () => {
    if (!activeDedication) return;
    shareToWhatsApp({
      recipientName: activeDedication.recipientName,
      senderName: activeDedication.senderName,
      wishText: activeDedication.wishText,
    });
  };

  const handleShareNative = async () => {
    if (!activeDedication) return;
    const shared = await shareNative({
      recipientName: activeDedication.recipientName,
      senderName: activeDedication.senderName,
      wishText: activeDedication.wishText,
    });
    if (!shared) {
      handleShareWhatsApp();
    }
  };

  const handleCopyWish = async () => {
    if (!activeDedication) return;
    const msg = formatWhatsAppMessage({
      recipientName: activeDedication.recipientName,
      senderName: activeDedication.senderName,
      wishText: activeDedication.wishText,
    });
    const copied = await copyToClipboard(msg);
    if (copied) {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownloadCard = async () => {
    if (!activeDedication) return;
    setIsDownloading(true);
    try {
      const dataUrl = await generateGreetingCardPng(
        activeDedication.recipientName,
        activeDedication.wishText,
        activeDedication.senderName
      );
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `Diwali_Wishes_For_${activeDedication.recipientName.replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Card generation failed: ', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <section id="dedicate" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full glass-festive border border-amber-500/25 text-amber-300 text-xs sm:text-sm font-medium mb-3">
          <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          <span>Heartfelt Dedication</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-serif font-black text-gold-gradient tracking-tight mb-4">
          Who Would You Like to Light a Diya for Today?
        </h2>
        <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
          Dedicate a sacred lamp to parents, friends, partners, or mentors. Create an illuminated card with your personal blessing and share it instantly on WhatsApp.
        </p>
      </div>

      <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Form Column */}
        <div className="lg:col-span-6 glass-card rounded-3xl p-6 sm:p-8 border border-amber-500/25 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-amber-200/90 uppercase tracking-wider mb-2">
                Relationship
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleCategorySelect(cat)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-all ${
                      category === cat
                        ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-md shadow-amber-500/15'
                        : 'border-slate-800 bg-slate-900/50 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Recipient Name */}
            <div>
              <label htmlFor="recipient" className="block text-xs font-semibold text-amber-200/90 uppercase tracking-wider mb-1.5">
                Their Name *
              </label>
              <input
                id="recipient"
                type="text"
                required
                maxLength={40}
                value={recipientName}
                onChange={(e) => setRecipientName(e.target.value)}
                placeholder="e.g. Rahul, Maa & Papa, Ananya"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-amber-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 transition-all text-sm sm:text-base"
              />
            </div>

            {/* Your Name (Optional) */}
            <div>
              <label htmlFor="sender" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Name (Optional)
              </label>
              <input
                id="sender"
                type="text"
                maxLength={40}
                value={senderName}
                onChange={(e) => setSenderName(e.target.value)}
                placeholder="e.g. With love, Priya"
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all text-sm"
              />
            </div>

            {/* Personal Wish */}
            <div>
              <label htmlFor="wish" className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Your Diwali Blessing / Wish
              </label>
              <textarea
                id="wish"
                rows={3}
                maxLength={220}
                value={wishText}
                onChange={(e) => setWishText(e.target.value)}
                placeholder={defaultWishes[category] || 'May your life always shine with happiness, peace and endless opportunities.'}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-all text-sm resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-festive-darker font-serif font-bold text-base shadow-xl shadow-amber-500/25 hover:shadow-amber-400/40 hover:scale-[1.01] active:scale-[0.98] transition-all flex items-center justify-center gap-2 min-h-[50px]"
            >
              <Send className="w-4 h-4 text-festive-darker" />
              <span>LIGHT DEDICATED DIYA 🪔</span>
            </button>
          </form>
        </div>

        {/* Live Preview / Dedicated Card Column */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <AnimatePresence mode="wait">
            {activeDedication ? (
              <motion.div
                key={activeDedication.id}
                initial={{ opacity: 0, scale: 0.9, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                className="w-full glass-festive rounded-3xl p-6 sm:p-8 border border-amber-400/40 shadow-2xl relative overflow-hidden flex flex-col items-center text-center"
              >
                {/* Glowing Top Aura */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-amber-500/25 blur-3xl pointer-events-none" />

                {/* Animated Dedicated Diya Graphic */}
                <div className="relative w-36 h-32 mb-2">
                  <svg viewBox="0 0 140 120" className="w-full h-full drop-shadow-xl animate-flame-pulse">
                    {/* Flame */}
                    <path
                      d="M 70 14 C 55 42 56 75 70 78 C 84 75 85 42 70 14 Z"
                      fill="url(#dedicateFlame)"
                      className="animate-flicker origin-bottom"
                    />
                    <path
                      d="M 70 32 C 62 50 63 73 70 75 C 77 73 78 50 70 32 Z"
                      fill="#FFFBEB"
                    />

                    <defs>
                      <linearGradient id="dedicateFlame" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#FFFFFF" />
                        <stop offset="30%" stopColor="#FDE047" />
                        <stop offset="70%" stopColor="#F59E0B" />
                        <stop offset="100%" stopColor="#DC2626" />
                      </linearGradient>
                      <linearGradient id="dedicateClay" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#C2410C" />
                        <stop offset="100%" stopColor="#431407" />
                      </linearGradient>
                    </defs>

                    {/* Clay pot */}
                    <path
                      d="M 20 78 C 25 106 50 114 70 114 C 90 114 115 106 120 78 C 105 87 85 90 70 90 C 55 90 35 87 20 78 Z"
                      fill="url(#dedicateClay)"
                      stroke="#F59E0B"
                      strokeWidth="1.5"
                    />
                    <ellipse cx="70" cy="78" rx="50" ry="11" fill="#7C2D12" stroke="#FEF08A" strokeWidth="1.5" />
                    <ellipse cx="70" cy="79" rx="40" ry="7" fill="#B45309" />
                  </svg>
                </div>

                {/* Dedication Text */}
                <span className="text-xs font-semibold uppercase tracking-widest text-amber-300/80 mb-1">
                  Sacred Diya Lit For
                </span>
                <h3 className="text-2xl sm:text-3xl font-serif font-black text-gold-gradient mb-3">
                  {activeDedication.recipientName} ❤️
                </h3>

                {/* Wish */}
                <p className="text-slate-200 text-sm sm:text-base font-normal leading-relaxed italic max-w-md bg-amber-950/30 p-4 rounded-2xl border border-amber-500/20 mb-3">
                  &ldquo;{activeDedication.wishText}&rdquo;
                </p>

                {activeDedication.senderName && (
                  <p className="text-xs text-amber-300 font-medium mb-6">
                    — With blessings from {activeDedication.senderName}
                  </p>
                )}

                {/* Share Actions Bar */}
                <div className="w-full flex flex-col sm:flex-row items-center gap-2.5 mt-2">
                  <button
                    onClick={handleShareWhatsApp}
                    className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition-all active:scale-95"
                  >
                    <span>Share on WhatsApp</span>
                  </button>

                  <button
                    onClick={handleDownloadCard}
                    disabled={isDownloading}
                    className="w-full sm:w-auto py-3 px-4 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-200 hover:text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95"
                    title="Download Card as Image"
                  >
                    <Download className="w-4 h-4 text-amber-300" />
                    <span>{isDownloading ? 'Exporting...' : 'Save PNG'}</span>
                  </button>

                  <button
                    onClick={handleCopyWish}
                    className="w-full sm:w-auto py-3 px-3 rounded-xl glass-festive border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center justify-center gap-1 transition-all"
                    title="Copy Text"
                  >
                    {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>

                  <button
                    onClick={handleShareNative}
                    className="w-full sm:w-auto py-3 px-3 rounded-xl glass-festive border border-slate-700 text-slate-300 hover:text-white text-xs flex items-center justify-center gap-1 transition-all"
                    title="Native Share"
                  >
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ) : (
              /* Idle Empty Card State */
              <div className="w-full glass-festive rounded-3xl p-8 border border-amber-500/20 flex flex-col items-center justify-center text-center min-h-[360px] opacity-80">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-amber-400" />
                </div>
                <h4 className="font-serif font-bold text-lg text-amber-200 mb-2">
                  Your Personalized Card Will Appear Here
                </h4>
                <p className="text-xs text-slate-400 max-w-xs leading-relaxed">
                  Enter the name of someone dear to you on the left, type an optional blessing, and light their personalized diya.
                </p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
