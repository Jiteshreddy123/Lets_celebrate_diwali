// Ambient Golden Dust & Diya Spark Particles

export interface AmbientParticle {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  alpha: number;
  maxAlpha: number;
  fadeSpeed: number;
  hue: number;
  pulseSpeed: number;
  pulsePhase: number;
}

export function createAmbientParticle(width: number, height: number): AmbientParticle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    size: 1 + Math.random() * 2.5,
    vx: (Math.random() - 0.5) * 0.4,
    vy: -0.2 - Math.random() * 0.4, // gently rises upwards
    alpha: 0.1 + Math.random() * 0.2,
    maxAlpha: 0.4 + Math.random() * 0.5,
    fadeSpeed: 0.003 + Math.random() * 0.005,
    hue: 38 + Math.random() * 14, // 38 to 52: golden amber
    pulseSpeed: 0.02 + Math.random() * 0.03,
    pulsePhase: Math.random() * Math.PI * 2,
  };
}

// Diya flame ember particles
export interface DiyaEmber {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export function createDiyaEmber(x: number, y: number): DiyaEmber {
  const maxLife = 35 + Math.random() * 30;
  return {
    x,
    y,
    vx: (Math.random() - 0.5) * 1.2,
    vy: -1.2 - Math.random() * 1.8,
    size: 1.5 + Math.random() * 2.5,
    life: maxLife,
    maxLife,
    color: Math.random() > 0.4 ? '#FDE047' : '#F97316',
  };
}
