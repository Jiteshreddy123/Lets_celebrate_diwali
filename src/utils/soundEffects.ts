// Web Audio API Festive Sound Synthesizer
// Zero external audio files required - works offline, instantaneous, highly optimized.

class SoundSynthesizer {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private sparklerInterval: number | null = null;

  constructor() {
    // Check localStorage for saved sound preference (default to unmuted)
    const saved = localStorage.getItem('diwali_sound_muted');
    this.isMuted = saved === 'true';
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    localStorage.setItem('diwali_sound_muted', String(muted));
    if (muted) {
      this.stopPhuljadiCrackle();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  // Play match strike / diya flame ignition
  public playDiyaIgnite() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Warm bell chime
    const bellOsc = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bellOsc.type = 'sine';
    bellOsc.frequency.setValueAtTime(587.33, now); // D5
    bellOsc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.15); // D6
    bellOsc.frequency.exponentialRampToValueAtTime(880, now + 1.2); // A5

    bellGain.gain.setValueAtTime(0, now);
    bellGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

    bellOsc.connect(bellGain);
    bellGain.connect(this.ctx.destination);
    bellOsc.start(now);
    bellOsc.stop(now + 1.5);

    // 2. Flame ignition gentle whoosh (filtered white noise)
    const bufferSize = this.ctx.sampleRate * 0.4;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, now);
    filter.Q.setValueAtTime(3, now);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0, now);
    noiseGain.gain.linearRampToValueAtTime(0.2, now + 0.04);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    whiteNoise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    whiteNoise.start(now);
    whiteNoise.stop(now + 0.4);
  }

  // Play continuous phuljadi sparkle crackle
  public startPhuljadiCrackle() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || this.sparklerInterval) return;

    // Trigger intermittent randomized micro-crackles
    this.sparklerInterval = window.setInterval(() => {
      if (this.isMuted || !this.ctx) return;
      this.playMicroSparks();
    }, 45);
  }

  private playMicroSparks() {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // Pop/spark click
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = Math.random() > 0.5 ? 'triangle' : 'sawtooth';
    // Random high frequencies characteristic of sparkler sparks
    const freq = 1800 + Math.random() * 4500;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + 0.025);

    gain.gain.setValueAtTime(0.04 + Math.random() * 0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  public stopPhuljadiCrackle() {
    if (this.sparklerInterval) {
      clearInterval(this.sparklerInterval);
      this.sparklerInterval = null;
    }
  }

  // Single spark burst sound
  public playSparkBurst() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 7; i++) {
      const delay = Math.random() * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(2400 + Math.random() * 3000, now + delay);
      osc.frequency.exponentialRampToValueAtTime(800, now + delay + 0.04);

      gain.gain.setValueAtTime(0.07, now + delay);
      gain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + delay);
      osc.stop(now + delay + 0.05);
    }
  }

  // Firework launch sound (whoosh going up)
  public playFireworkLaunch() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.55);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // Firework explosion sound (deep boom + crackles)
  public playFireworkExplosion(type: 'grand' | 'normal' | 'soft' = 'normal') {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const intensity = type === 'grand' ? 0.35 : type === 'soft' ? 0.12 : 0.22;

    // 1. Low bass boom
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

    gain.gain.setValueAtTime(intensity, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);

    // 2. Glittering sparkle tail pops
    const sparkleCount = type === 'grand' ? 12 : 6;
    for (let i = 0; i < sparkleCount; i++) {
      const delay = 0.05 + Math.random() * 0.4;
      const sOsc = this.ctx.createOscillator();
      const sGain = this.ctx.createGain();

      sOsc.type = 'sine';
      sOsc.frequency.setValueAtTime(1200 + Math.random() * 2000, now + delay);
      sGain.gain.setValueAtTime(0.04, now + delay);
      sGain.gain.exponentialRampToValueAtTime(0.001, now + delay + 0.06);

      sOsc.connect(sGain);
      sGain.connect(this.ctx.destination);

      sOsc.start(now + delay);
      sOsc.stop(now + delay + 0.07);
    }
  }

  // Festive celebration chime
  public playCelebrationChime() {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    const now = this.ctx.currentTime;

    notes.forEach((freq, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const startTime = now + idx * 0.1;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.12, startTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + 0.85);
    });
  }
}

export const soundEffects = new SoundSynthesizer();
