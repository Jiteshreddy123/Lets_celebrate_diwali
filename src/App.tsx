import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Phuljadi } from './components/Phuljadi';
import { Fireworks } from './components/Fireworks';
import { Dedication, DedicationItem } from './components/Dedication';
import { DiyaWall } from './components/DiyaWall';
import { ShareCelebration } from './components/ShareCelebration';
import { Footer } from './components/Footer';
import { RightDiyaCounter } from './components/RightDiyaCounter';
import { soundEffects } from './utils/soundEffects';

export const App: React.FC = () => {
  // Diya Lit Counter: Start with auspicious baseline (e.g. 1008) + user's local actions
  const [litCount, setLitCount] = useState<number>(() => {
    const saved = localStorage.getItem('diwali_lit_count');
    return saved ? parseInt(saved, 10) : 1008;
  });

  // Hero Diya lit state
  const [heroDiyaLit, setHeroDiyaLit] = useState<boolean>(false);

  // Dedicated Diyas list (stored in localStorage)
  const [dedications, setDedications] = useState<DedicationItem[]>(() => {
    const saved = localStorage.getItem('diwali_dedications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return [];
      }
    }
    return [];
  });

  // Track active section for nav highlight
  const [activeSection, setActiveSection] = useState('hero');

  // Periodic subtle live community activity (simulating members worldwide celebrating together)
  useEffect(() => {
    const interval = setInterval(() => {
      setLitCount((prev) => {
        const next = prev + 1;
        localStorage.setItem('diwali_lit_count', String(next));
        return next;
      });
    }, 14000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id || 'hero');
          }
        });
      },
      { threshold: 0.3 }
    );

    const sections = document.querySelectorAll('section[id]');
    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, []);

  // Increment Diya Counter
  const handleDiyaLit = () => {
    setLitCount((prev) => {
      const next = prev + 1;
      localStorage.setItem('diwali_lit_count', String(next));
      return next;
    });
  };

  // Handle Hero Diya Click
  const handleHeroDiyaClick = () => {
    soundEffects.playDiyaIgnite();
    if (!heroDiyaLit) {
      setHeroDiyaLit(true);
      handleDiyaLit();
    }
  };

  // Add new Dedication
  const handleDedicationAdded = (item: DedicationItem) => {
    const updated = [item, ...dedications];
    setDedications(updated);
    localStorage.setItem('diwali_dedications', JSON.stringify(updated));
    handleDiyaLit();
  };

  // Heart a diya on the wall
  const handleHeartDiya = (_id: string) => {
    handleDiyaLit();
  };

  // Enter celebration (scroll smoothly to Phuljadi sparkler section)
  const handleEnterCelebration = () => {
    soundEffects.playDiyaIgnite();
    if (!heroDiyaLit) {
      setHeroDiyaLit(true);
      handleDiyaLit();
    }
    const phuljadiSection = document.getElementById('phuljadi');
    if (phuljadiSection) {
      phuljadiSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Grand Finale celebration trigger
  const handleFinaleTrigger = () => {
    handleDiyaLit();
    // Scroll to fireworks or trigger burst
    const fireworksSection = document.getElementById('fireworks');
    if (fireworksSection) {
      fireworksSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-festive-dark text-slate-100 selection:bg-amber-500 selection:text-festive-darker relative overflow-x-hidden">
      
      {/* Floating Header Navbar */}
      <Navbar litCount={litCount} activeSection={activeSection} />

      {/* Persistent Floating Right-Side Diya Counter Widget */}
      <RightDiyaCounter litCount={litCount} onQuickLight={handleDiyaLit} />

      {/* Main Sections */}
      <main>
        {/* 1. Hero Section */}
        <Hero
          onEnter={handleEnterCelebration}
          onDiyaClick={handleHeroDiyaClick}
          heroDiyaLit={heroDiyaLit}
        />

        {/* 2. Phuljadi Interaction (Handheld Indian Sparkler) */}
        <Phuljadi />

        {/* 4. Fireworks Interactive Night Sky */}
        <Fireworks />

        {/* 5. Dedicate a Diya */}
        <Dedication onDedicationAdded={handleDedicationAdded} />

        {/* 6. The Shared Diya Wall */}
        <DiyaWall
          dedications={dedications}
          onHeartDiya={handleHeartDiya}
        />

        {/* 7. Share The Celebration */}
        <ShareCelebration />
      </main>

      {/* 8. Final Greeting & Footer */}
      <Footer onFinaleTrigger={handleFinaleTrigger} />

    </div>
  );
};
