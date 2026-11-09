import { useState, useEffect } from 'react'
import { typingWords } from '../data/portfolioData'
import profilePhoto from '../assets/adit.JPG'
import Hero3DCore from './Hero3DCore'

export default function Hero({ lang, t }) {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    const words = typingWords[lang] || typingWords.id;
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let timer = null;

    const tick = () => {
      const currentWord = words[wordIndex % words.length];

      if (isDeleting) {
        setTypedText(currentWord.substring(0, charIndex - 1));
        charIndex--;
      } else {
        setTypedText(currentWord.substring(0, charIndex + 1));
        charIndex++;
      }

      let speed = isDeleting ? 45 : 90;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = 2200;
        isDeleting = true;
      } else if (isDeleting && charIndex <= 0) {
        isDeleting = false;
        wordIndex = (wordIndex + 1) % words.length;
        speed = 500;
      }

      timer = setTimeout(tick, speed);
    };

    timer = setTimeout(() => {
      setTypedText('');
      tick();
    }, 150);

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [lang]);

  const scrollTo = (e, id) => {
    e.preventDefault();
    const elem = document.querySelector(id);
    if (elem) {
      const headerOffset = 80;
      const elementPosition = elem.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section id="home" className="hero-section">
      <div className="container hero-container">
        {/* Left Content Column */}
        <div className="hero-content">
          <div className="hero-tag-badge">
            <span className="dash">—</span>
            <span>{lang === 'id' ? 'MAHASISWA INFORMATIKA & DEVELOPER' : 'INFORMATICS STUDENT & DEVELOPER'}</span>
          </div>

          <h1 className="hero-title">
            <span className="hero-greeting">{t('hero.greeting')}</span>
            <span className="hero-name">Aditiya Pratama</span>
          </h1>

          <div className="hero-subheadline">
            <span className="role-prefix">{t('hero.role_prefix')}</span>{' '}
            <span className="role-typed">{typedText}</span>
            <span className="role-cursor">_</span>
          </div>

          <p className="hero-description">
            {t('hero.description')}
          </p>

          <div className="hero-actions">
            <a
              href="#projects"
              className="btn-primary-orange"
              onClick={(e) => scrollTo(e, '#projects')}
            >
              <span>{t('hero.btn_projects')}</span>
              <i className="fas fa-arrow-right"></i>
            </a>
            <a
              href="#contact"
              className="btn-secondary-dark"
              onClick={(e) => scrollTo(e, '#contact')}
            >
              <span>{t('hero.btn_contact')}</span>
              <i className="fas fa-paper-plane"></i>
            </a>
          </div>
        </div>

        {/* Right Visual Column (DevNik Style Neon Poly Frame) */}
        <div className="hero-visual">
          <div className="hero-poly-backdrop">
            {/* Ambient orange glow */}
            <div className="poly-glow-radial"></div>

            {/* Neon Orange Angled Polygonal Frame from screenshot */}
            <div className="poly-neon-frame">
              <svg viewBox="0 0 400 460" className="poly-svg" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="orangeGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ff9900" />
                    <stop offset="50%" stopColor="#ff6b00" />
                    <stop offset="100%" stopColor="#ff3b00" />
                  </linearGradient>
                  <filter id="neonFilter" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="6" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                </defs>
                <polygon
                  points="120,20 370,40 340,430 40,380"
                  fill="none"
                  stroke="url(#orangeGlowGrad)"
                  strokeWidth="3.5"
                  filter="url(#neonFilter)"
                  className="poly-polygon"
                />
              </svg>
            </div>

            {/* Code Watermark </ > in the background */}
            <div className="hero-code-watermark">&lt;/&gt;</div>

            {/* Profile Cutout Image with Bottom Fade */}
            <div className="hero-photo-wrapper">
              <img
                src={profilePhoto}
                alt="Aditiya Pratama"
                className="hero-photo"
              />
              <div className="hero-photo-bottom-fade"></div>
            </div>

            {/* Interactive 3D Holographic AI Core */}
            <Hero3DCore lang={lang} />

            {/* Floating Tech Badges */}
            <div className="hero-float-badge float-badge-1" title="HTML5">
              <i className="fab fa-html5"></i>
            </div>
            <div className="hero-float-badge float-badge-2" title="CSS3">
              <i className="fab fa-css3-alt"></i>
            </div>
            <div className="hero-float-badge float-badge-3" title="JavaScript">
              <i className="fab fa-js"></i>
            </div>
            <div className="hero-float-badge float-badge-4" title="Flutter">
              <i className="fab fa-flutter"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Diagonal Cut Section Divider */}
      <div className="hero-diagonal-divider">
        <div className="diagonal-line"></div>
      </div>
    </section>
  );
}
