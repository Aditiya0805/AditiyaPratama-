import { useState, useEffect, useRef } from 'react'
import { achievementsList } from '../data/portfolioData'

export default function Achievements({ lang, t, onOpenCert }) {
  const [inView, setInView] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section id="achievements" className="achievements-section section-padding" ref={sectionRef}>
      <div className="container">
        <div className={`section-header-center ${inView ? 'active' : ''}`}>
          <div className="section-pre-tag">
            <span>// {lang === 'id' ? 'PENGHARGAAN & PRESTASI' : 'AWARDS & RECOGNITION'}</span>
          </div>
          <h2 className="section-heading-center">
            {lang === 'id' ? (
              <>Prestasi &amp; <span className="highlight-text">Pencapaian Kompetisi</span></>
            ) : (
              <>Awards &amp; <span className="highlight-text">Achievements</span></>
            )}
          </h2>
          <div className="section-header-accent-line"></div>
        </div>

        <div className="achievements-dark-grid">
          {achievementsList.map((item) => (
            <div
              key={item.id}
              className={`achievement-dark-card ${inView ? 'active' : ''}`}
              onClick={() => onOpenCert({ img: item.img, titleKey: item.titleKey, title: t(item.titleKey) })}
            >
              <div className="achievement-thumb-wrapper">
                <img src={item.img} alt={t(item.titleKey)} className="achievement-thumb-img" />
                <div className="achievement-zoom-overlay">
                  <div className="zoom-circle">
                    <i className="fas fa-magnifying-glass-plus"></i>
                  </div>
                </div>
                <span className="achievement-badge-pill">{t(item.badgeKey)}</span>
              </div>

              <div className="achievement-card-info">
                <div className="achievement-date-row">
                  <i className="far fa-calendar-alt"></i>
                  <span>{t(item.dateKey)}</span>
                </div>
                <h3 className="achievement-title">{t(item.titleKey)}</h3>
                <p className="achievement-description">{t(item.descKey)}</p>
                <div className="achievement-view-btn">
                  <span>{lang === 'id' ? 'Lihat Bukti Sertifikat' : 'View Certificate'}</span>
                  <i className="fas fa-arrow-right"></i>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
