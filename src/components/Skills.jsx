import { useState, useEffect, useRef } from 'react'
import { skillsList } from '../data/portfolioData'

export default function Skills({ lang, t }) {
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
      { threshold: 0.15 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getSkillTitle = (skill) => {
    if (skill.nameKey) {
      if (skill.customName) {
        return (
          <>
            {skill.baseName} <span className="skill-sub">{t(skill.nameKey)}</span>
          </>
        );
      }
      return t(skill.nameKey);
    }
    return skill.name;
  };

  return (
    <section id="skills" className="skills-section section-padding" ref={sectionRef}>
      <div className="container">
        <div className={`section-header-center ${inView ? 'active' : ''}`}>
          <div className="section-pre-tag">
            <span>// {lang === 'id' ? 'KEAHLIAN SAYA' : 'MY SKILLS'}</span>
          </div>
          <h2 className="section-heading-center">
            {lang === 'id' ? 'Teknologi & Keahlian Saya' : 'Technologies I Work With'}
          </h2>
          <div className="section-header-accent-line"></div>
        </div>

        <div className={`skills-grid-dark ${inView ? 'active' : ''}`}>
          {skillsList.map((skill, idx) => (
            <div key={idx} className="skill-item-card">
              <div className="skill-item-header">
                <div className="skill-icon-box">
                  <i className={`${skill.icon}`} style={{ color: skill.color }}></i>
                </div>
                <div className="skill-name-wrap">
                  <h3 className="skill-title">{getSkillTitle(skill)}</h3>
                  <span className="skill-level-badge">{skill.level}</span>
                </div>
              </div>

              <div className="skill-progress-track">
                <div
                  className="skill-progress-bar"
                  style={{
                    width: inView ? skill.level : '0%',
                    transition: 'width 1.2s cubic-bezier(0.25, 0.8, 0.25, 1)'
                  }}
                >
                  <span className="skill-progress-glow"></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
