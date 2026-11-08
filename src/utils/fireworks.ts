// Advanced Fireworks Simulation Engine
// Supports Golden Chrysanthemum, Colorful Peony, Willow Glitter, Starburst & Ring patterns

export type FireworkType = 'chrysanthemum' | 'colorful' | 'star' | 'willow' | 'ring';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  alpha: number;
  decay: number;
  gravity: number;
  drag: number;
  flicker: boolean;
  history: Array<{ x: number; y: number }>;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vx: number;
  vy: number;
  color: string;
  type: FireworkType;
  exploded: boolean;
  history: Array<{ x: number; y: number }>;
}

const FESTIVE_PALETTES = [
  ['#FACC15', '#F59E0B', '#D97706', '#FFFBEB'], // Pure Gold Chrysanthemum
  ['#EC4899', '#8B5CF6', '#3B82F6', '#10B981', '#F59E0B'], // Multi-color Peony
  ['#EF4444', '#F97316', '#FBBF24', '#FEF08A'], // Warm Fire
  ['#38BDF8', '#818CF8', '#C084FC', '#F472B6'], // Cosmic Glow
  ['#34D399', '#6EE7B7', '#A7F3D0', '#FDE047'], // Emerald & Lime
];

export class FireworksManager {
  private rockets: Rocket[] = [];
  private particles: Particle[] = [];
  public onExplode?: (x: number, y: number, type: FireworkType) => void;

  public launch(startX: number, startY: number, targetX: number, targetY: number, customType?: FireworkType) {
    const types: FireworkType[] = ['chrysanthemum', 'colorful', 'star', 'willow', 'ring'];
    const chosenType = customType || types[Math.floor(Math.random() * types.length)];

    const dx = targetX - startX;
    const dy = targetY - startY;
    const distance = Math.hypot(dx, dy);
    const speed = 9.5 + Math.random() * 2.5;

    const vx = (dx / distance) * speed;
    const vy = (dy / distance) * speed;

    this.rockets.push({
      x: startX,
      y: startY,
      targetY,
      vx,
      vy,
      color: '#FDE047',
      type: chosenType,
      exploded: false,
      history: [{ x: startX, y: startY }],
    });
  }

  // Create explosion particles based on chosen firework pattern
  public explode(x: number, y: number, type: FireworkType) {
    if (this.onExplode) {
      this.onExplode(x, y, type);
    }

    const palette = FESTIVE_PALETTES[Math.floor(Math.random() * FESTIVE_PALETTES.length)];

    switch (type) {
      case 'chrysanthemum': {
        // Spherical explosion with trailing golden particles and flickering ends
        const count = 90;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.5 + Math.random() * 5.5;
          const color = '#FBBF24';
          this.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: 2.2,
            alpha: 1.0,
            decay: 0.012 + Math.random() * 0.008,
            gravity: 0.045,
            drag: 0.965,
            flicker: Math.random() > 0.4,
            history: [{ x, y }],
          });
        }
        break;
      }

      case 'star': {
        // Star pattern with 5 or 6 geometric points
        const points = 5;
        const countPerPoint = 16;
        for (let p = 0; p < points; p++) {
          const baseAngle = (p * 2 * Math.PI) / points - Math.PI / 2;
          for (let i = 0; i < countPerPoint; i++) {
            const spread = (Math.random() - 0.5) * 0.22;
            const angle = baseAngle + spread;
            const speed = 2.0 + Math.random() * 5.0;
            const color = palette[p % palette.length];
            this.particles.push({
              x,
              y,
              vx: Math.cos(angle) * speed,
              vy: Math.sin(angle) * speed,
              color,
              size: 2.0,
              alpha: 1.0,
              decay: 0.016 + Math.random() * 0.01,
              gravity: 0.04,
              drag: 0.96,
              flicker: true,
              history: [{ x, y }],
            });
          }
        }
        break;
      }

      case 'willow': {
        // Gentle glittering golden willow falling like shimmering rain
        const count = 75;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 0.8 + Math.random() * 4.2;
          this.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed * 0.6,
            color: '#FEF08A',
            size: 1.8,
            alpha: 1.0,
            decay: 0.007 + Math.random() * 0.006, // long lasting
            gravity: 0.065, // gently falls down
            drag: 0.95,
            flicker: true,
            history: [{ x, y }],
          });
        }
        break;
      }

      case 'ring': {
        // Expanding ring of radiant colors
        const count = 60;
        const speed = 4.2;
        for (let i = 0; i < count; i++) {
          const angle = (i * 2 * Math.PI) / count;
          const color = palette[i % palette.length];
          this.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed * (0.95 + Math.random() * 0.1),
            vy: Math.sin(angle) * speed * (0.95 + Math.random() * 0.1),
            color,
            size: 2.4,
            alpha: 1.0,
            decay: 0.015,
            gravity: 0.035,
            drag: 0.97,
            flicker: false,
            history: [{ x, y }],
          });
        }
        break;
      }

      case 'colorful':
      default: {
        // Vibrant multicolored peony burst
        const count = 80;
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const speed = 1.8 + Math.random() * 5.8;
          const color = palette[Math.floor(Math.random() * palette.length)];
          this.particles.push({
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            color,
            size: 2.2,
            alpha: 1.0,
            decay: 0.014 + Math.random() * 0.01,
            gravity: 0.045,
            drag: 0.96,
            flicker: Math.random() > 0.6,
            history: [{ x, y }],
          });
        }
        break;
      }
    }
  }

  public update() {
    // 1. Update rockets
    const aliveRockets: Rocket[] = [];
    for (const r of this.rockets) {
      r.history.push({ x: r.x, y: r.y });
      if (r.history.length > 5) r.history.shift();

      r.x += r.vx;
      r.y += r.vy;
      r.vy += 0.03; // slight gravity on rocket

      // Check if rocket reached zenith or descending
      if (r.y <= r.targetY || r.vy >= 0) {
        this.explode(r.x, r.y, r.type);
      } else {
        aliveRockets.push(r);
      }
    }
    this.rockets = aliveRockets;

    // 2. Update particles
    const aliveParticles: Particle[] = [];
    for (const p of this.particles) {
      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > 4) p.history.shift();

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.alpha -= p.decay;

      if (p.alpha > 0.01) {
        aliveParticles.push(p);
      }
    }
    this.particles = aliveParticles;
  }

  public draw(ctx: CanvasRenderingContext2D) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. Draw rocket trails
    for (const r of this.rockets) {
      if (r.history.length < 2) continue;
      ctx.beginPath();
      ctx.moveTo(r.history[0].x, r.history[0].y);
      for (let i = 1; i < r.history.length; i++) {
        ctx.lineTo(r.history[i].x, r.history[i].y);
      }
      ctx.lineTo(r.x, r.y);
      ctx.strokeStyle = '#FDE047';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Rocket head glow
      ctx.beginPath();
      ctx.arc(r.x, r.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    // 2. Draw explosion particles
    for (const p of this.particles) {
      if (p.history.length < 2) continue;

      let currentAlpha = p.alpha;
      if (p.flicker && Math.random() < 0.25) {
        currentAlpha *= 0.4;
      }

      ctx.beginPath();
      ctx.moveTo(p.history[0].x, p.history[0].y);
      for (let i = 1; i < p.history.length; i++) {
        ctx.lineTo(p.history[i].x, p.history[i].y);
      }
      ctx.lineTo(p.x, p.y);

      ctx.strokeStyle = p.color;
      ctx.globalAlpha = Math.max(0, currentAlpha);
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Sparkle tip
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.7, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    ctx.restore();
  }

  public clear() {
    this.rockets = [];
    this.particles = [];
  }
}
