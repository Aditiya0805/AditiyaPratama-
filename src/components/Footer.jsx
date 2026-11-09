const CURRENT_YEAR = new Date().getFullYear();

export default function Footer({ lang, t }) {
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

  const getNavLabel = (key, fallbackId, fallbackEn) => {
    if (t) return t(key);
    return lang === 'id' ? fallbackId : fallbackEn;
  };

  return (
    <footer className="footer-dark">
      <div className="container footer-container">
        <div className="footer-top-row">
          <div className="footer-brand-col">
            <a href="#" className="footer-logo" onClick={(e) => scrollTo(e, '#home')}>
              DEV<span className="logo-accent">⚡</span>ADIT
            </a>
            <p className="footer-tagline">
              {lang === 'id'
                ? 'Membangun solusi web, perancangan UI/UX, dan aplikasi AI modern dengan performa tinggi.'
                : 'Building fast, responsive, and intelligent web & AI experiences.'}
            </p>
          </div>

          <div className="footer-links-col">
            <h4 className="footer-links-title">{lang === 'id' ? 'Tautan Cepat' : 'Quick Links'}</h4>
            <ul className="footer-links-list">
              <li><a href="#home" onClick={(e) => scrollTo(e, '#home')}>{getNavLabel('nav.home', 'Beranda', 'Home')}</a></li>
              <li><a href="#about" onClick={(e) => scrollTo(e, '#about')}>{getNavLabel('nav.about', 'Tentang', 'About')}</a></li>
              <li><a href="#skills" onClick={(e) => scrollTo(e, '#skills')}>{getNavLabel('nav.skills', 'Keahlian', 'Skills')}</a></li>
              <li><a href="#projects" onClick={(e) => scrollTo(e, '#projects')}>{getNavLabel('nav.projects', 'Proyek', 'Projects')}</a></li>
              <li><a href="#achievements" onClick={(e) => scrollTo(e, '#achievements')}>{getNavLabel('nav.achievements', 'Prestasi', 'Achievements')}</a></li>
              <li><a href="#contact" onClick={(e) => scrollTo(e, '#contact')}>{getNavLabel('nav.contact', 'Kontak', 'Contact')}</a></li>
            </ul>
          </div>

          <div className="footer-social-col">
            <h4 className="footer-links-title">{lang === 'id' ? 'Media Sosial' : 'Connect'}</h4>
            <div className="footer-social-icons">
              <a href="https://github.com/Aditiya0805" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
              <a href="https://www.linkedin.com/in/aditiya-pratama-mahasiswa-8a6184338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a href="https://www.instagram.com/_adttyaprtmaa?igsh=bTlleGw2ZmNvczNq&utm_source=qr" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>
        </div>

        <div className="footer-bottom-divider"></div>

        <div className="footer-bottom-row">
          <p className="footer-copy">
            &copy; {CURRENT_YEAR} Aditiya Pratama. {lang === 'id' ? 'Hak cipta dilindungi undang-undang.' : 'All rights reserved.'}
          </p>
          <p className="footer-love">
            {lang === 'id' ? 'Dirancang & Dibuat dengan ' : 'Designed & Coded with '}<i className="fas fa-heart" style={{ color: '#ff6b00' }}></i>{lang === 'id' ? ' oleh Aditiya' : ' by Aditiya'}
          </p>
        </div>
      </div>
    </footer>
  );
}
