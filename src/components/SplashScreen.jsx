import { useState, useEffect, useRef, useCallback } from 'react'

const statusStages = [
  { threshold: 25, text: "INITIALIZING SYSTEM CORE..." },
  { threshold: 55, text: "CALIBRATING AI & GRAPHICS..." },
  { threshold: 85, text: "LOADING INTERFACE MODULES..." },
  { threshold: 99, text: "FINALIZING ENVIRONMENT..." },
  { threshold: 100, text: "SYSTEM READY • WELCOME" }
];

export default function SplashScreen() {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState("INITIALIZING SYSTEM CORE...");
  const [isFinished, setIsFinished] = useState(false);
  const [isRemoved, setIsRemoved] = useState(false);
  const intervalRef = useRef(null);
  const dismissedRef = useRef(false);

  const triggerDismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    if (intervalRef.current) clearInterval(intervalRef.current);

    setPercent(100);
    setStatusText("SYSTEM READY • WELCOME");

    setTimeout(() => {
      setIsFinished(true);
      document.body.classList.remove('splash-active');

      setTimeout(() => {
        setIsRemoved(true);
      }, 850);
    }, 350);
  }, []);

  useEffect(() => {
    document.body.classList.add('splash-active');

    let current = 0;
    let isWindowLoaded = false;

    const timer = setInterval(() => {
      if (dismissedRef.current) {
        clearInterval(timer);
        return;
      }

      if (isWindowLoaded) {
        current += Math.ceil((100 - current) * 0.3) + 2;
      } else {
        if (current < 88) {
          current += Math.floor(Math.random() * 4) + 1;
        }
      }

      if (current >= 100) {
        current = 100;
        clearInterval(timer);
        triggerDismiss();
      }

      setPercent(current);

      const stage = statusStages.find(s => current <= s.threshold) || statusStages[statusStages.length - 1];
      setStatusText(stage.text);
    }, 40);

    intervalRef.current = timer;

    const handleLoad = () => {
      setTimeout(() => {
        isWindowLoaded = true;
      }, 400);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    // Safety fallback
    const fallbackTimer = setTimeout(() => {
      isWindowLoaded = true;
    }, 2200);

    return () => {
      clearInterval(timer);
      clearTimeout(fallbackTimer);
      window.removeEventListener('load', handleLoad);
      document.body.classList.remove('splash-active');
    };
  }, [triggerDismiss]);

  if (isRemoved) return null;

  return (
    <div
      id="splash-screen"
      className={`splash-screen ${isFinished ? 'splash-finished' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Loading Screen"
    >
      <div className="splash-backdrop">
        <div className="splash-glow splash-glow-1"></div>
        <div className="splash-glow splash-glow-2"></div>
        <div className="splash-grid"></div>
        <div className="splash-particles">
          <span className="sp-dot sp-1"></span>
          <span className="sp-dot sp-2"></span>
          <span className="sp-dot sp-3"></span>
          <span className="sp-dot sp-4"></span>
          <span className="sp-dot sp-5"></span>
          <span className="sp-dot sp-6"></span>
        </div>
      </div>

      <div className="splash-container">
        {/* Orbiting Holographic Rings & Core Badge */}
        <div className="splash-loader-wrapper">
          <div className="splash-orbit splash-orbit-1"></div>
          <div className="splash-orbit splash-orbit-2"></div>
          <div className="splash-orbit splash-orbit-3"></div>
          <div className="splash-pulse-ring"></div>
          <div className="splash-core-badge">
            <div className="splash-core-inner">
              <span className="splash-tag">&lt;AP /&gt;</span>
            </div>
          </div>
        </div>

        {/* Branding & Title */}
        <div className="splash-brand">
          <h1 className="splash-logo">Aditiya<span>.dev</span></h1>
          <div className="splash-pills">
            <span className="splash-pill"><i className="fas fa-code"></i> Informatics</span>
            <span className="splash-pill"><i className="fas fa-palette"></i> UI/UX</span>
            <span className="splash-pill"><i className="fas fa-brain"></i> AI Tech</span>
          </div>
        </div>

        {/* Progress Bar & Status */}
        <div className="splash-progress-container">
          <div className="splash-status-row">
            <div className="splash-status-wrapper">
              <span className="splash-status-dot"></span>
              <span id="splash-status-text" className="splash-status-text">{statusText}</span>
            </div>
            <span id="splash-percent" className="splash-percent">{percent}%</span>
          </div>
          <div className="splash-progress-track">
            <div
              id="splash-progress-bar"
              className="splash-progress-bar"
              style={{ width: `${percent}%` }}
            >
              <span className="splash-progress-glow"></span>
            </div>
          </div>
        </div>

        {/* Skip Option */}
        <button
          id="splash-skip-btn"
          className="splash-skip-btn"
          type="button"
          aria-label="Lewati intro"
          onClick={triggerDismiss}
        >
          <span>Skip Intro</span>
          <i className="fas fa-forward"></i>
        </button>
      </div>
    </div>
  );
}
