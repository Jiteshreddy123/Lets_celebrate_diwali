// Social and Native Sharing Utilities for Diwali Unlimited

export interface ShareData {
  recipientName?: string;
  senderName?: string;
  wishText?: string;
}

export function getShareUrl(): string {
  if (typeof window !== 'undefined') {
    const base = window.location.origin + window.location.pathname;
    return base.replace(/\/$/, '') + '/?v=diwali';
  }
  return 'https://diwali-unlimited.web.app/?v=diwali';
}

export function formatWhatsAppMessage(data?: ShareData): string {
  const url = getShareUrl();

  if (data?.recipientName) {
    const wish = data.wishText || 'May your life always shine with happiness, peace and endless opportunities.';
    return `✨ *Happy Diwali, ${data.recipientName}!* 🪔✨\n\n` +
      `I lit a special Diwali diya just for you ❤️\n\n` +
      `"${wish}"\n\n` +
      `Come light your own diya, play with a virtual phuljadi and launch fireworks with me at *DIWALI UNLIMITED*:\n` +
      `${url}`;
  }

  return `🪔 *DIWALI UNLIMITED* — Light. Sparkle. Share. ✨\n\n` +
    `I lit a diya for you this Diwali! 🪔✨\n\n` +
    `Come light your own diya, play with a virtual phuljadi (sparkler) and enjoy some magical fireworks!\n\n` +
    `Let's spread happiness together ❤️\n\n` +
    `${url}`;
}

export async function shareToWhatsApp(data?: ShareData): Promise<void> {
  const message = formatWhatsAppMessage(data);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
}

export async function shareNative(data?: ShareData): Promise<boolean> {
  const url = getShareUrl();
  const title = 'DIWALI UNLIMITED — Light. Sparkle. Share.';
  const text = data?.recipientName 
    ? `I lit a special Diwali diya for ${data.recipientName}! 🪔✨`
    : `Celebrate Diwali with me! Light diyas, play with phuljadi and launch fireworks 🪔✨`;

  if (navigator.share) {
    try {
      await navigator.share({
        title,
        text,
        url,
      });
      return true;
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
      return false;
    }
  }
  return false;
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Could not copy text: ', err);
    return false;
  }
}

// Generate an ultra-high quality personalized festive greeting card PNG using HTML Canvas
export function generateGreetingCardPng(
  recipientName: string,
  wishText: string,
  senderName: string = ''
): Promise<string> {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350; // Instagram / WhatsApp story 4:5 aspect ratio
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve('');
      return;
    }

    // 1. Festive dark gradient background
    const bgGradient = ctx.createRadialGradient(540, 480, 50, 540, 675, 750);
    bgGradient.addColorStop(0, '#1c1335');
    bgGradient.addColorStop(0.5, '#0b0f24');
    bgGradient.addColorStop(1, '#03050c');
    ctx.fillStyle = bgGradient;
    ctx.fillRect(0, 0, 1080, 1350);

    // 2. Intricate gold border
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 4;
    ctx.strokeRect(36, 36, 1008, 1278);

    ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(48, 48, 984, 1254);

    // Corner decorative flourishes
    const drawCorner = (x: number, y: number, angle: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      ctx.strokeStyle = '#FACC15';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 40);
      ctx.lineTo(0, 0);
      ctx.lineTo(40, 0);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(12, 12, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#F59E0B';
      ctx.fill();
      ctx.restore();
    };

    drawCorner(48, 48, 0);
    drawCorner(1032, 48, Math.PI / 2);
    drawCorner(1032, 1302, Math.PI);
    drawCorner(48, 1302, -Math.PI / 2);

    // 3. Floating golden dust particles
    for (let i = 0; i < 90; i++) {
      const px = 60 + Math.random() * 960;
      const py = 60 + Math.random() * 1230;
      const size = 1 + Math.random() * 3.5;
      const alpha = 0.2 + Math.random() * 0.7;
      ctx.beginPath();
      ctx.arc(px, py, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      ctx.fill();
    }

    // 4. Header text: DIWALI UNLIMITED
    ctx.textAlign = 'center';
    ctx.font = '700 32px Cinzel, serif';
    ctx.fillStyle = '#E5A93C';
    ctx.fillText('DIWALI UNLIMITED', 540, 140);

    ctx.font = '300 22px Outfit, sans-serif';
    ctx.fillStyle = 'rgba(253, 224, 71, 0.7)';
    ctx.fillText('• Light · Sparkle · Share •', 540, 180);

    // 5. Central glowing traditional diya illustration
    const diyaY = 460;
    // Diya flame aura
    const flameAura = ctx.createRadialGradient(540, diyaY - 60, 10, 540, diyaY - 60, 180);
    flameAura.addColorStop(0, 'rgba(245, 158, 11, 0.7)');
    flameAura.addColorStop(0.5, 'rgba(234, 88, 12, 0.25)');
    flameAura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = flameAura;
    ctx.beginPath();
    ctx.arc(540, diyaY - 60, 180, 0, Math.PI * 2);
    ctx.fill();

    // Diya clay base
    ctx.beginPath();
    ctx.moveTo(380, diyaY);
    ctx.bezierCurveTo(400, diyaY + 110, 680, diyaY + 110, 700, diyaY);
    ctx.bezierCurveTo(620, diyaY + 30, 460, diyaY + 30, 380, diyaY);
    const clayGrad = ctx.createLinearGradient(380, diyaY, 700, diyaY + 100);
    clayGrad.addColorStop(0, '#B45309');
    clayGrad.addColorStop(0.5, '#78350F');
    clayGrad.addColorStop(1, '#451A03');
    ctx.fillStyle = clayGrad;
    ctx.fill();
    ctx.strokeStyle = '#FBBF24';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Diya flame
    ctx.beginPath();
    ctx.moveTo(540, diyaY - 140);
    ctx.bezierCurveTo(500, diyaY - 80, 510, diyaY - 10, 540, diyaY - 5);
    ctx.bezierCurveTo(570, diyaY - 10, 580, diyaY - 80, 540, diyaY - 140);
    const flameGrad = ctx.createLinearGradient(540, diyaY - 140, 540, diyaY);
    flameGrad.addColorStop(0, '#FFFFFF');
    flameGrad.addColorStop(0.2, '#FEF08A');
    flameGrad.addColorStop(0.6, '#F59E0B');
    flameGrad.addColorStop(1, '#EA580C');
    ctx.fillStyle = flameGrad;
    ctx.fill();

    // 6. Dedication Text
    ctx.font = '600 48px Cinzel, serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(`This Diya is Lit For`, 540, 680);

    ctx.font = '800 64px Cinzel, serif';
    const nameGrad = ctx.createLinearGradient(300, 760, 780, 760);
    nameGrad.addColorStop(0, '#FDE047');
    nameGrad.addColorStop(0.5, '#F59E0B');
    nameGrad.addColorStop(1, '#D97706');
    ctx.fillStyle = nameGrad;
    ctx.fillText(`${recipientName} ❤️`, 540, 760);

    // Decorative underline
    ctx.beginPath();
    ctx.moveTo(340, 790);
    ctx.lineTo(740, 790);
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.6)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // 7. Personal Wish / Blessing (wrapped text)
    ctx.font = '400 32px Outfit, sans-serif';
    ctx.fillStyle = '#E2E8F0';
    const fullWish = wishText || 'May your life always shine with happiness, peace, and endless opportunities.';
    
    // Word wrap function
    const words = fullWish.split(' ');
    let line = '';
    let currentY = 870;
    const maxLineWidth = 820;

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxLineWidth && n > 0) {
        ctx.fillText(line, 540, currentY);
        line = words[n] + ' ';
        currentY += 46;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, 540, currentY);

    // 8. Sender signature if provided
    if (senderName) {
      ctx.font = '500 28px Outfit, sans-serif';
      ctx.fillStyle = '#FBBF24';
      ctx.fillText(`With warm love & wishes from ${senderName}`, 540, currentY + 90);
    }

    // 9. Footer: Happy Diwali
    ctx.font = '700 38px Cinzel, serif';
    ctx.fillStyle = '#FDE047';
    ctx.fillText('HAPPY DIWALI 🪔', 540, 1210);

    ctx.font = '300 20px Outfit, sans-serif';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('diwali-unlimited.web.app', 540, 1250);

    resolve(canvas.toDataURL('image/png'));
  });
}
