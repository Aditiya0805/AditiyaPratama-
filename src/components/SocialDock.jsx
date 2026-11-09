export default function SocialDock() {
  return (
    <aside className="social-dock" aria-label="Social media links">
      <div className="social-dock-line top-line"></div>
      <div className="social-dock-icons">
        <a
          href="https://github.com/Aditiya0805"
          target="_blank"
          rel="noopener noreferrer"
          className="dock-icon-btn"
          aria-label="GitHub"
          title="GitHub"
        >
          <i className="fab fa-github"></i>
        </a>
        <a
          href="https://www.linkedin.com/in/aditiya-pratama-mahasiswa-8a6184338?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
          target="_blank"
          rel="noopener noreferrer"
          className="dock-icon-btn"
          aria-label="LinkedIn"
          title="LinkedIn"
        >
          <i className="fab fa-linkedin-in"></i>
        </a>
        <a
          href="https://www.instagram.com/_adttyaprtmaa?igsh=bTlleGw2ZmNvczNq&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          className="dock-icon-btn"
          aria-label="Instagram"
          title="Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>
        <a
          href="mailto:adityapratama2292@gmail.com"
          className="dock-icon-btn"
          aria-label="Email"
          title="Email"
        >
          <i className="fas fa-envelope"></i>
        </a>
      </div>
      <div className="social-dock-line bottom-line"></div>
    </aside>
  );
}

