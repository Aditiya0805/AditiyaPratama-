import { useState, useEffect, useCallback } from 'react'
import { translations } from './data/portfolioData'
import SplashScreen from './components/SplashScreen'
import CustomCursor from './components/CustomCursor'
import SpaceCanvas from './components/SpaceCanvas'
import SocialDock from './components/SocialDock'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import CyberLab3D from './components/CyberLab3D'
import Projects from './components/Projects'
import Achievements from './components/Achievements'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AstronautCompanion from './components/AstronautCompanion'
import ProjectModal from './components/ProjectModal'
import CertificateModal from './components/CertificateModal'

export default function App() {
  const [lang, setLang] = useState(() => {
    const saved = localStorage.getItem('preferred_lang');
    if (saved && (saved === 'id' || saved === 'en')) return saved;
    if (typeof navigator !== 'undefined' && navigator.language && navigator.language.startsWith('id')) {
      return 'id';
    }
    return 'en';
  });

  const [activeProjectKey, setActiveProjectKey] = useState(null);
  const [activeCert, setActiveCert] = useState(null);

  useEffect(() => {
    localStorage.setItem('preferred_lang', lang);
    document.documentElement.lang = lang;

    const currentTrans = translations[lang] || translations.id;
    if (currentTrans.page_title) {
      document.title = currentTrans.page_title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && currentTrans.meta_desc) {
      metaDesc.setAttribute('content', currentTrans.meta_desc);
    }
  }, [lang]);

  const t = useCallback(
    (key) => {
      const currentTrans = translations[lang] || translations.id;
      return currentTrans[key] !== undefined ? currentTrans[key] : key;
    },
    [lang]
  );

  return (
    <>
      {/* Cyber Cosmic Splash Screen */}
      <SplashScreen />

      {/* Glowing Neon Space Cursor */}
      <CustomCursor />

      {/* Interactive Space Particle Canvas & Orange Glow Shapes */}
      <SpaceCanvas />

      {/* Floating Vertical Social Dock */}
      <SocialDock />

      {/* Top Navbar */}
      <Navbar lang={lang} setLang={setLang} t={t} />

      {/* Page Sections */}
      <main className="main-content-flow">
        <Hero lang={lang} t={t} />
        <About lang={lang} t={t} />
        <Skills lang={lang} t={t} />
        <CyberLab3D lang={lang} />
        <Projects lang={lang} t={t} onOpenProject={setActiveProjectKey} />
        <Achievements lang={lang} t={t} onOpenCert={setActiveCert} />
        <Contact lang={lang} t={t} />
      </main>

      {/* Footer */}
      <Footer lang={lang} t={t} />

      {/* Interactive Astronaut Space Companion */}
      <AstronautCompanion lang={lang} />

      {/* Lightbox Modals */}
      <ProjectModal
        projectKey={activeProjectKey}
        lang={lang}
        t={t}
        onClose={() => setActiveProjectKey(null)}
      />

      <CertificateModal
        cert={activeCert}
        lang={lang}
        t={t}
        onClose={() => setActiveCert(null)}
      />
    </>
  );
}
