import { useState, useEffect, useRef } from 'react'
import { projectDetails } from '../data/portfolioData'

const filters = [
  { key: 'all', labelKey: 'projects.filter_all' },
  { key: 'web', labelKey: 'projects.filter_web' },
  { key: 'mobile', labelKey: 'projects.filter_mobile' },
  { key: 'design', labelKey: 'projects.filter_design' },
  { key: 'ai', labelKey: 'projects.filter_ai' }
];

const projectKeys = ['pesisir_barat', 'yohebemi', 'sigapin', 'krui', 'cybervision'];

export default function Projects({ lang, t, onOpenProject }) {
  const [activeFilter, setActiveFilter] = useState('all');
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

  const handleCardMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -6;
    const rotateY = ((x - centerX) / centerX) * 6;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  };

  const handleCardMouseLeave = (e) => {
    const card = e.currentTarget;
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  };

  const getProjectTitle = (key, item) => {
    const keyMap = {
      pesisir_barat: 'projects.p5_title',
      yohebemi: 'projects.p1_title',
      sigapin: 'projects.p2_title',
      krui: 'projects.p3_title',
      cybervision: 'projects.p4_title'
    };
    if (keyMap[key] && t(keyMap[key])) return t(keyMap[key]);
    if (typeof item.title === 'object') return item.title[lang] || item.title.id;
    return item.title;
  };

  const getProjectDesc = (key, item) => {
    const keyMap = {
      pesisir_barat: 'projects.p5_desc',
      yohebemi: 'projects.p1_desc',
      sigapin: 'projects.p2_desc',
      krui: 'projects.p3_desc',
      cybervision: 'projects.p4_desc'
    };
    if (keyMap[key] && t(keyMap[key])) return t(keyMap[key]);
    return item.desc[lang] || item.desc.id;
  };

  return (
    <section id="projects" className="projects-section section-padding" ref={sectionRef}>
      <div className="container">
        {/* Section Header */}
        <div className={`projects-header-row ${inView ? 'active' : ''}`}>
          <div>
            <div className="section-pre-tag">
              <span>// {lang === 'id' ? 'PROYEK TERPILIH' : 'SELECTED PROJECTS'}</span>
            </div>
            <h2 className="section-heading">
              {lang === 'id' ? (
                <>Karya &amp; <span className="highlight-text">Proyek Unggulan</span></>
              ) : (
                <>Featured <span className="highlight-text">Work &amp; Projects</span></>
              )}
            </h2>
          </div>

          {/* Filter Tabs in DevNik Style */}
          <div className="projects-filter-pills">
            {filters.map((f) => (
              <button
                key={f.key}
                type="button"
                className={`filter-pill-btn ${activeFilter === f.key ? 'active' : ''}`}
                onClick={() => setActiveFilter(f.key)}
              >
                {t(f.labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Project Cards Grid */}
        <div className="projects-dark-grid">
          {projectKeys.map((key) => {
            const item = projectDetails[key];
            const isHidden = activeFilter !== 'all' && item.filterCategory !== activeFilter;

            return (
              <div
                key={key}
                className={`project-dark-card ${isHidden ? 'hidden-card' : ''}`}
                onMouseMove={handleCardMouseMove}
                onMouseLeave={handleCardMouseLeave}
              >
                {/* Image Container */}
                <div className="project-thumb-box">
                  <img src={item.img} alt={getProjectTitle(key, item)} className="project-thumb-img" />
                  <div className="project-thumb-overlay"></div>

                  <span className="project-category-tag">
                    {item.category[lang] || item.category.id}
                  </span>

                  {item.featured && (
                    <span className="project-featured-badge">
                      <i className="fas fa-bolt"></i> {lang === 'id' ? 'Unggulan' : 'Featured'}
                    </span>
                  )}
                </div>

                {/* Content */}
                <div className="project-card-details">
                  <h3 className="project-card-title">{getProjectTitle(key, item)}</h3>
                  <p className="project-card-description">{getProjectDesc(key, item)}</p>

                  <div className="project-tech-tags">
                    {(Array.isArray(item.displayTags) ? item.displayTags : (item.displayTags[lang] || item.displayTags.id)).map((tag, tIdx) => (
                      <span key={tIdx} className="tech-tag-pill">{tag}</span>
                    ))}
                  </div>

                  <div className="project-card-actions">
                    <button
                      type="button"
                      className="btn-card-detail"
                      onClick={() => onOpenProject(key)}
                    >
                      <span>{t('projects.btn_detail')}</span>
                      <i className="fas fa-arrow-right"></i>
                    </button>

                    {item.link && (
                      <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-card-demo"
                      >
                        <i className="fas fa-arrow-up-right-from-square"></i> Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
