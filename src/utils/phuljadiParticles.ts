// Realistic Indian Phuljadi (Sparkler) Particle Physics Engine

export interface SparkParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  size: number;
  length: number;
  alpha: number;
  decay: number;
  gravity: number;
  drag: number;
  canBranch: boolean;
  history: Array<{ x: number; y: number }>;
}

export interface SparklerPalette {
  name: string;
  coreColor: string;
  sparks: string[];
  glow: string;
}

export const PHULJADI_PALETTES: Record<string, SparklerPalette> = {
  gold: {
    name: 'Classic Golden',
    coreColor: '#FFFDF0',
    sparks: ['#FFFFFF', '#FFF7A0', '#FDE047', '#FBBF24', '#F59E0B', '#EA580C', '#DC2626'],
    glow: 'rgba(251, 191, 36, 0.75)',
  },
  silver: {
    name: 'Silver Diamond',
    coreColor: '#FFFFFF',
    sparks: ['#FFFFFF', '#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8'],
    glow: 'rgba(224, 242, 254, 0.85)',
  },
  crimson: {
    name: 'Royal Kesariya',
    coreColor: '#FFF1F2',
    sparks: ['#FFFFFF', '#FFE4E6', '#FDA4AF', '#FB7185', '#F43F5E', '#E11D48'],
    glow: 'rgba(251, 113, 133, 0.8)',
  },
  rainbow: {
    name: 'Festive Magic',
    coreColor: '#FFFFFF',
    sparks: ['#FDE047', '#4ADE80', '#38BDF8', '#C084FC', '#F472B6', '#FB923C'],
    glow: 'rgba(253, 224, 71, 0.8)',
  }
};

export class PhuljadiEmitter {
  public particles: SparkParticle[] = [];
  public maxParticles: number = 380;
  private currentPalette: SparklerPalette = PHULJADI_PALETTES.gold;

  public setPalette(paletteKey: string) {
    if (PHULJADI_PALETTES[paletteKey]) {
      this.currentPalette = PHULJADI_PALETTES[paletteKey];
    }
  }

  public getPalette(): SparklerPalette {
    return this.currentPalette;
  }

  // Emit realistic sparks from the phuljadi tip
  public emit(x: number, y: number, count: number = 12, burst: boolean = false) {
    if (this.particles.length >= this.maxParticles) return;

    for (let i = 0; i < count; i++) {
      if (this.particles.length >= this.maxParticles) break;

      const angle = Math.random() * Math.PI * 2;
      const speed = burst 
        ? 3.5 + Math.random() * 8.5 
        : 1.8 + Math.random() * 5.2;

      const colors = this.currentPalette.sparks;
      const color = colors[Math.floor(Math.random() * colors.length)];

      this.particles.push({
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 1.2 + Math.random() * 2.2,
        length: 3 + Math.random() * 5,
        alpha: 1.0,
        decay: burst ? 0.018 + Math.random() * 0.02 : 0.024 + Math.random() * 0.028,
        gravity: 0.12 + Math.random() * 0.08,
        drag: 0.94 + Math.random() * 0.03,
        canBranch: Math.random() < 0.22, // 22% chance of micro-branching
        history: [{ x, y }],
      });
    }
  }

  // Update physics for each particle
  public update() {
    const newParticles: SparkParticle[] = [];

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];

      // Update position history for motion trail
      p.history.push({ x: p.x, y: p.y });
      if (p.history.length > 4) {
        p.history.shift();
      }

      // Physics integration
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.drag;
      p.vy *= p.drag;
      p.alpha -= p.decay;

      // Micro branching (classic sparkler pop)
      if (p.canBranch && p.alpha < 0.65 && p.alpha > 0.5 && Math.random() < 0.15) {
        p.canBranch = false;
        if (newParticles.length + this.particles.length < this.maxParticles) {
          const branchAngle = Math.random() * Math.PI * 2;
          const branchSpeed = 1.2 + Math.random() * 2.5;
          newParticles.push({
            x: p.x,
            y: p.y,
            vx: Math.cos(branchAngle) * branchSpeed,
            vy: Math.sin(branchAngle) * branchSpeed,
            color: this.currentPalette.sparks[1] || '#FFFFFF',
            size: p.size * 0.75,
            length: 2.5,
            alpha: 0.85,
            decay: 0.05,
            gravity: 0.15,
            drag: 0.92,
            canBranch: false,
            history: [{ x: p.x, y: p.y }],
          });
        }
      }

      if (p.alpha > 0.02) {
        newParticles.push(p);
      }
    }

    this.particles = newParticles;
  }

  // Draw phuljadi sparks with glowing streaks
  public draw(ctx: CanvasRenderingContext2D, tipX: number, tipY: number, isBurning: boolean) {
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    // 1. Draw glowing incandescent core at tip if burning
    if (isBurning) {
      // Outer ambient warm halo
      const outerGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 48);
      outerGrad.addColorStop(0, this.currentPalette.glow);
      outerGrad.addColorStop(0.4, 'rgba(245, 158, 11, 0.25)');
      outerGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 48, 0, Math.PI * 2);
      ctx.fill();

      // Inner white-hot core
      const innerGrad = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 14);
      innerGrad.addColorStop(0, '#FFFFFF');
      innerGrad.addColorStop(0.5, this.currentPalette.coreColor);
      innerGrad.addColorStop(1, 'rgba(255, 200, 50, 0)');
      ctx.fillStyle = innerGrad;
      ctx.beginPath();
      ctx.arc(tipX, tipY, 14, 0, Math.PI * 2);
      ctx.fill();
    }

    // 2. Draw spark particles
    for (const p of this.particles) {
      if (p.history.length < 2) continue;

      ctx.beginPath();
      ctx.moveTo(p.history[0].x, p.history[0].y);
      for (let j = 1; j < p.history.length; j++) {
        ctx.lineTo(p.history[j].x, p.history[j].y);
      }
      ctx.lineTo(p.x, p.y);

      ctx.strokeStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.lineWidth = p.size;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Draw bright glowing head of the spark
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#FFFFFF';
      ctx.fill();
    }

    ctx.restore();
  }

  public clear() {
    this.particles = [];
  }
}
