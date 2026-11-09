import { useState, useEffect } from 'react'

export default function Navbar({ lang, setLang, t }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, targetId) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    if (!targetId || targetId === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const elem = document.querySelector(targetId);
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
    <header className={`navbar-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="container nav-container">
        {/* Brand Logo in DevNik style */}
        <a href="#" className="logo" onClick={(e) => handleLinkClick(e, '#home')}>
          DEV<span className="logo-accent">⚡</span>ADIT
        </a>

        {/* Center Nav Links */}
        <nav className={`nav-menu ${mobileMenuOpen ? 'active' : ''}`}>
          <ul className="nav-links">
            <li>
              <a href="#home" onClick={(e) => handleLinkClick(e, '#home')}>
                {t('nav.home')}
              </a>
            </li>
            <li>
              <a href="#about" onClick={(e) => handleLinkClick(e, '#about')}>
                {t('nav.about')}
              </a>
            </li>
            <li>
              <a href="#skills" onClick={(e) => handleLinkClick(e, '#skills')}>
                {t('nav.skills')}
              </a>
            </li>
            <li>
              <a href="#lab3d" onClick={(e) => handleLinkClick(e, '#lab3d')}>
                <span style={{ color: 'var(--primary)', fontWeight: 800 }}>3D</span> LAB
              </a>
            </li>
            <li>
              <a href="#projects" onClick={(e) => handleLinkClick(e, '#projects')}>
                {t('nav.projects')}
              </a>
            </li>
            <li>
              <a href="#achievements" onClick={(e) => handleLinkClick(e, '#achievements')}>
                {t('nav.achievements')}
              </a>
            </li>
            <li>
              <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')}>
                {t('nav.contact')}
              </a>
            </li>
          </ul>

          {/* Language Switcher */}
          <div className="lang-switcher">
            <button
              type="button"
              className={`lang-btn ${lang === 'id' ? 'active' : ''}`}
              onClick={() => setLang('id')}
              aria-label="Bahasa Indonesia"
            >
              ID
            </button>
            <span className="lang-divider">|</span>
            <button
              type="button"
              className={`lang-btn ${lang === 'en' ? 'active' : ''}`}
              onClick={() => setLang('en')}
              aria-label="English"
            >
              EN
            </button>
          </div>
        </nav>

        {/* Right CTA Button: LET'S TALK / HUBUNGI SAYA */}
        <div className="nav-actions">
          <a
            href="#contact"
            className="btn-talk"
            onClick={(e) => handleLinkClick(e, '#contact')}
          >
            <span>{lang === 'id' ? 'HUBUNGI SAYA' : "LET'S TALK"}</span>
            <i className="fas fa-arrow-up-right-from-square"></i>
          </a>

          {/* Hamburger for mobile */}
          <button
            type="button"
            className="hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
          >
            <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
          </button>
        </div>
      </div>
    </header>
  );
}
