import { useState, useEffect, useRef } from 'react'
import { astronautQuotes } from '../data/portfolioData'

export default function AstronautCompanion({ lang }) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [bubbleVisible, setBubbleVisible] = useState(false);
  const containerRef = useRef(null);
  const svgContainerRef = useRef(null);
  const bubbleTimerRef = useRef(null);

  const quotes = astronautQuotes[lang] || astronautQuotes.id;

  useEffect(() => {
    let animId = null;
    let currentX = 0;
    let targetX = 0;
    let lastX = 0;
    let scrollTilt = 0;
    let lastScrollY = window.scrollY;
    let tiltTimer = null;
    let currentFlip = 1;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const delta = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      scrollTilt = Math.max(Math.min(delta * 0.4, 25), -25);

      if (tiltTimer) clearTimeout(tiltTimer);
      tiltTimer = setTimeout(() => {
        scrollTilt = 0;
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);

    const updatePatrol = () => {
      const time = Date.now() * 0.0006;
      const maxWidth = Math.min(window.innerWidth - 140, 750);
      const maxScroll = (document.documentElement.scrollHeight - window.innerHeight) || 1;
      const scrollRatio = window.scrollY / maxScroll;

      const sineWave = (Math.sin(time) + 1) / 2;
      const patrolProgress = sineWave * 0.6 + scrollRatio * 0.4;

      targetX = patrolProgress * maxWidth;
      currentX += (targetX - currentX) * 0.04;

      const moveDelta = currentX - lastX;
      lastX = currentX;

      if (containerRef.current && svgContainerRef.current) {
        if (moveDelta > 0.05) {
          currentFlip = 1;
        } else if (moveDelta < -0.05) {
          currentFlip = -1;
        }

        containerRef.current.style.transform = `translate3d(-${currentX}px, 0px, 0px)`;
        svgContainerRef.current.style.transform = `scaleX(${currentFlip}) rotate(${scrollTilt}deg)`;
      }

      animId = requestAnimationFrame(updatePatrol);
    };

    animId = requestAnimationFrame(updatePatrol);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (animId) cancelAnimationFrame(animId);
      if (tiltTimer) clearTimeout(tiltTimer);
    };
  }, []);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    setQuoteIndex((prev) => (prev + 1) % quotes.length);
    setBubbleVisible(true);

    if (bubbleTimerRef.current) clearTimeout(bubbleTimerRef.current);
    bubbleTimerRef.current = setTimeout(() => {
      setBubbleVisible(false);
    }, 3000);
  };

  return (
    <div
      id="astronaut-companion"
      ref={containerRef}
      className="astronaut-companion"
      title={lang === 'id' ? 'Klik astronot untuk kembali ke atas!' : 'Click astronaut to scroll to top!'}
      onClick={handleClick}
    >
      <div className={`astronaut-bubble glass ${bubbleVisible ? 'show' : ''}`}>
        <span className="bubble-text">{quotes[quoteIndex % quotes.length]}</span>
        <div className="bubble-arrow"></div>
      </div>

      <div className="astronaut-svg-container" ref={svgContainerRef}>
        <svg className="astronaut-svg" viewBox="0 0 120 150" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="visor-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffaa00" />
              <stop offset="50%" stopColor="#ff6b00" />
              <stop offset="100%" stopColor="#e04000" />
            </linearGradient>
            <linearGradient id="suit-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#cbd5e1" />
            </linearGradient>
            <linearGradient id="flame-grad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffcc00" />
              <stop offset="50%" stopColor="#ff6b00" />
              <stop offset="100%" stopColor="#ff2200" stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Jetpack Thruster Flame */}
          <path className="jetpack-flame" d="M 45 105 Q 50 135 55 105 Z" fill="url(#flame-grad)" opacity="0.9" />
          <path className="jetpack-flame" d="M 65 105 Q 70 135 75 105 Z" fill="url(#flame-grad)" opacity="0.9" />

          {/* Jetpack */}
          <rect x="38" y="55" width="44" height="42" rx="8" fill="#475569" stroke="#1e293b" strokeWidth="2" />
          <rect x="42" y="60" width="16" height="32" rx="4" fill="#64748b" />
          <rect x="62" y="60" width="16" height="32" rx="4" fill="#64748b" />

          {/* Astronaut Body / Suit */}
          <ellipse cx="60" cy="78" rx="22" ry="24" fill="url(#suit-grad)" stroke="#94a3b8" strokeWidth="2" />

          {/* Chest Controls & Badge */}
          <rect x="50" y="68" width="20" height="14" rx="3" fill="#1e293b" />
          <circle cx="56" cy="75" r="2.5" fill="#06b6d4" className="pulse-led" />
          <circle cx="64" cy="75" r="2.5" fill="#ff3366" />

          {/* Left Arm */}
          <path d="M 40 68 Q 24 75 28 88" fill="none" stroke="url(#suit-grad)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="27" cy="89" r="5" fill="#6366f1" />

          {/* Right Arm (Waving gesture) */}
          <path className="astronaut-arm-wave" d="M 80 68 Q 98 62 94 48" fill="none" stroke="url(#suit-grad)" strokeWidth="9" strokeLinecap="round" />
          <circle cx="94" cy="47" r="5" fill="#6366f1" />

          {/* Legs */}
          <path d="M 48 98 Q 44 118 42 124" fill="none" stroke="url(#suit-grad)" strokeWidth="10" strokeLinecap="round" />
          <path d="M 72 98 Q 76 118 78 124" fill="none" stroke="url(#suit-grad)" strokeWidth="10" strokeLinecap="round" />
          <ellipse cx="40" cy="126" rx="6" ry="4" fill="#475569" />
          <ellipse cx="80" cy="126" rx="6" ry="4" fill="#475569" />

          {/* Helmet Head */}
          <circle cx="60" cy="38" r="24" fill="url(#suit-grad)" stroke="#cbd5e1" strokeWidth="2" />

          {/* Visor */}
          <ellipse cx="60" cy="38" rx="17" ry="14" fill="url(#visor-grad)" filter="url(#glow)" />
          {/* Visor Shine Reflection */}
          <path d="M 50 30 Q 64 27 70 33 Q 62 31 52 35 Z" fill="#ffffff" opacity="0.6" />
          <circle cx="70" cy="42" r="1.5" fill="#ffffff" opacity="0.7" />

          {/* Floating Star Particles */}
          <circle cx="12" cy="30" r="1.5" fill="#06b6d4" className="star-p1" />
          <circle cx="105" cy="80" r="2" fill="#8b5cf6" className="star-p2" />
          <circle cx="20" cy="110" r="1" fill="#ffffff" className="star-p3" />
        </svg>
      </div>
    </div>
  );
}

