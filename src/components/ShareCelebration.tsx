import React, { useState } from 'react';
import { Share2, MessageCircle, Copy, Check, Download, Sparkles } from 'lucide-react';
import { shareToWhatsApp, shareNative, copyToClipboard, getShareUrl, generateGreetingCardPng } from '../utils/sharing';
import { soundEffects } from '../utils/soundEffects';

export const ShareCelebration: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [customName, setCustomName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const websiteUrl = getShareUrl();

  const handleCopyLink = async () => {
    soundEffects.playSparkBurst();
    const success = await copyToClipboard(websiteUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleWhatsAppGeneral = () => {
    soundEffects.playCelebrationChime();
    shareToWhatsApp(customName ? { recipientName: customName } : undefined);
  };

  const handleNativeShare = async () => {
    soundEffects.playCelebrationChime();
    const shared = await shareNative(customName ? { recipientName: customName } : undefined);
    if (!shared) {
      handleWhatsAppGeneral();
    }
  };

  const handleDownloadQuickCard = async () => {
    setIsExporting(true);
    soundEffects.playDiyaIgnite();
    try {
      const name = customName.trim() || 'My Dear Loved Ones';
      const wish = 'May the divine light of Diwali bring immense joy, peace, prosperity, and endless sparkle to you and your family!';
      const dataUrl = await generateGreetingCardPng(name, wish);
      if (dataUrl) {
        const link = document.createElement('a');
        link.download = `Diwali_Celebration_Card.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Failed to download card: ', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <section id="share" className="relative py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Background Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />

      {/* Main Glass Card */}
      <div className="relative max-w-4xl mx-auto glass-card rounded-3xl p-6 sm:p-12 border border-amber-500/30 shadow-2xl overflow-hidden text-center">
        
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-festive border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-medium mb-6">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Spread The Light</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-gold-gradient tracking-tight mb-4">
          YOUR LIGHT SHOULDN&apos;T STOP HERE.
        </h2>

        {/* Supporting text */}
        <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
          Invite your friends, family and everyone you care about to celebrate Diwali with you. Share the glow across WhatsApp, LinkedIn, and Instagram.
        </p>

        {/* Optional Name Customizer */}
        <div className="max-w-md mx-auto mb-8">
          <label htmlFor="custom-share-name" className="block text-xs font-semibold text-amber-200/90 uppercase tracking-wider mb-2">
            Customize wish for someone special (Optional):
          </label>
          <div className="relative">
            <input
              id="custom-share-name"
              type="text"
              maxLength={40}
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Papa, Rohan, Priya, Team"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-amber-500/30 text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-sm sm:text-base text-center"
            />
          </div>
        </div>

        {/* Main Share Buttons Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto mb-10">
          
          {/* WhatsApp Share Button */}
          <button
            onClick={handleWhatsAppGeneral}
            className="py-4 px-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-emerald-950/40 hover:scale-[1.02] active:scale-95 transition-all min-h-[52px]"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Native Mobile Share */}
          <button
            onClick={handleNativeShare}
            className="py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-festive-darker font-bold text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-xl shadow-amber-500/20 hover:scale-[1.02] active:scale-95 transition-all min-h-[52px]"
          >
            <Share2 className="w-5 h-5" />
            <span>Native Share</span>
          </button>

          {/* Copy Link Button */}
          <button
            onClick={handleCopyLink}
            className="py-4 px-5 rounded-2xl glass-festive border border-amber-400/40 text-amber-200 hover:text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all min-h-[52px]"
          >
            {copied ? (
              <>
                <Check className="w-5 h-5 text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-5 h-5" />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Download Card PNG */}
          <button
            onClick={handleDownloadQuickCard}
            disabled={isExporting}
            className="py-4 px-5 rounded-2xl glass-festive border border-amber-400/40 text-amber-200 hover:text-white font-medium text-sm sm:text-base flex items-center justify-center gap-2.5 shadow-lg active:scale-95 transition-all min-h-[52px]"
          >
            <Download className="w-5 h-5 text-amber-300" />
            <span>{isExporting ? 'Generating...' : 'Download Card'}</span>
          </button>
        </div>

        {/* WhatsApp Preview Quote Box */}
        <div className="max-w-xl mx-auto rounded-2xl bg-black/40 border border-white/10 p-5 text-left text-xs sm:text-sm text-slate-300 space-y-2">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs uppercase tracking-wider">
            <MessageCircle className="w-3.5 h-3.5" />
            <span>WhatsApp Message Preview</span>
          </div>
          <p className="font-mono text-xs text-slate-300 whitespace-pre-line leading-relaxed">
            {customName ? (
              `✨ Happy Diwali, ${customName}! 🪔✨\nI lit a special Diwali diya just for you ❤️\nCome light your own diya, play with virtual phuljadi and launch fireworks!\n${websiteUrl}`
            ) : (
              `I lit a diya for you this Diwali! 🪔✨\n\nCome light your own diya, play with a virtual phuljadi and enjoy some fireworks!\n\nLet's spread happiness together ❤️\n\n${websiteUrl}`
            )}
          </p>
        </div>

      </div>
    </section>
  );
};
