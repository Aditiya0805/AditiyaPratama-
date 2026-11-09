import { useState, useEffect, useRef } from 'react'

export default function About({ lang, t }) {
  const [inView, setInView] = useState(false);
  const [counts, setCounts] = useState({ projects: 0, lines: 0, languages: 0 });
  const sectionRef = useRef(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !animatedRef.current) {
            animatedRef.current = true;
            setInView(true);

            // Animate counters
            const targets = { projects: 10, lines: 1000, languages: 3 };
            const duration = 1800;
            const startTime = performance.now();

            const update = (now) => {
              const elapsed = now - startTime;
              const progress = Math.min(elapsed / duration, 1);

              setCounts({
                projects: Math.floor(progress * targets.projects),
                lines: Math.floor(progress * targets.lines),
                languages: Math.floor(progress * targets.languages)
              });

              if (progress < 1) {
                requestAnimationFrame(update);
              } else {
                setCounts(targets);
              }
            };

            requestAnimationFrame(update);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="about-section section-padding" ref={sectionRef}>
      <div className="container">
        <div className={`about-grid ${inView ? 'active' : ''}`}>
          {/* Left Column: Text & Stats */}
          <div className="about-col-info">
            <div className="section-pre-tag">
              <span>// {lang === 'id' ? 'TENTANG SAYA' : 'ABOUT ME'}</span>
            </div>

            <h2 className="section-heading">
              {lang === 'id' ? (
                <>Mengubah Ide Menjadi <span className="highlight-text">Realitas Interaktif</span></>
              ) : (
                <>Turning Ideas Into <span className="highlight-text">Interactive Reality</span></>
              )}
            </h2>

            <div className="about-bio-texts">
              <p dangerouslySetInnerHTML={{ __html: t('about.p1') }} />
              <p>{t('about.p2')}</p>
            </div>

            {/* Stat Cards from Screenshot */}
            <div className="about-stats-row">
              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon-wrap">
                    <i className="fas fa-folder-open"></i>
                  </div>
                  <h3 className="stat-number">{counts.projects}+</h3>
                </div>
                <p className="stat-label">{t('about.stat_projects')}</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon-wrap">
                    <i className="fas fa-code"></i>
                  </div>
                  <h3 className="stat-number">{counts.lines}+</h3>
                </div>
                <p className="stat-label">{t('about.stat_lines')}</p>
              </div>

              <div className="stat-card">
                <div className="stat-card-top">
                  <div className="stat-icon-wrap">
                    <i className="fas fa-laptop-code"></i>
                  </div>
                  <h3 className="stat-number">{counts.languages}+</h3>
                </div>
                <p className="stat-label">{t('about.stat_languages')}</p>
              </div>
            </div>

            <div className="about-cta">
              <a href="#projects" className="btn-outline-orange">
                <span>{lang === 'id' ? 'LIHAT PORTOFOLIO' : 'MORE ABOUT ME'}</span>
                <i className="fas fa-arrow-up-right-from-square"></i>
              </a>
            </div>
          </div>

          {/* Right Column: Code I Live By IDE Card */}
          <div className="about-col-code">
            <div className="code-editor-card">
              <div className="code-editor-header">
                <div className="code-editor-dots">
                  <span className="dot dot-red"></span>
                  <span className="dot dot-yellow"></span>
                  <span className="dot dot-green"></span>
                </div>
                <div className="code-editor-title">
                  <i className="fas fa-code"></i> // {lang === 'id' ? 'Kode Pedoman Hidup' : 'Code I Live By'}
                </div>
                <div className="code-editor-copy" title={lang === 'id' ? 'Salin kode' : 'Copy code'}>
                  <i className="far fa-copy"></i>
                </div>
              </div>

              <div className="code-editor-body">
                <pre className="code-pre">
                  <code>
                    <span className="code-keyword">const</span> <span className="code-var">developer</span> = &#123;{'\n'}
                    {'  '}<span className="code-prop">name</span>: <span className="code-string">&apos;Aditiya Pratama&apos;</span>,{'\n'}
                    {'  '}<span className="code-prop">role</span>: <span className="code-string">&apos;{lang === 'id' ? 'Mahasiswa Informatika & UI/UX' : 'Informatics Student & UI/UX'}&apos;</span>,{'\n'}
                    {'  '}<span className="code-prop">skills</span>: [<span className="code-string">&apos;React.js&apos;</span>, <span className="code-string">&apos;JavaScript&apos;</span>, <span className="code-string">&apos;Python&apos;</span>, <span className="code-string">&apos;AI&apos;</span>],{'\n'}
                    {'  '}<span className="code-prop">passion</span>: <span className="code-string">&apos;{lang === 'id' ? 'Membangun aplikasi cerdas & berkinerja tinggi' : 'Building smart & high-performance apps'}&apos;</span>,{'\n'}
                    {'  '}<span className="code-prop">focus</span>: <span className="code-string">&apos;{lang === 'id' ? 'Kode Bersih & UI/UX Modern' : 'Clean Code & Modern UI/UX'}&apos;</span>{'\n'}
                    &#125;;{'\n\n'}
                    <span className="code-func">console</span>.<span className="code-method">log</span>(<span className="code-var">developer</span>);
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
