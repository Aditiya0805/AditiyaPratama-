import { useEffect } from 'react'
import { projectDetails } from '../data/portfolioData'

export default function ProjectModal({ projectKey, lang, t, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (projectKey) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [projectKey, onClose]);

  if (!projectKey) return null;

  const data = projectDetails[projectKey];
  if (!data) return null;

  const categoryName = data.category[lang] || data.category.id;
  const description = data.desc[lang] || data.desc.id;
  const featuresList = data.features[lang] || data.features.id;
  const projectTitle = typeof data.title === 'object' ? (data.title[lang] || data.title.id) : data.title;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="project-modal"
      className="modal-overlay active"
      aria-hidden="false"
      onClick={handleBackdropClick}
    >
      <div className="modal-card glass">
        <button
          type="button"
          className="modal-close"
          aria-label={lang === 'id' ? 'Tutup modal' : 'Close modal'}
          onClick={onClose}
        >
          &times;
        </button>

        <div className="modal-header">
          <span className="modal-badge">{categoryName}</span>
          <h3>{projectTitle}</h3>
        </div>

        <div className="modal-body">
          <div className="modal-image-container">
            <img src={data.img} alt={projectTitle} />
          </div>

          <div className="modal-details">
            <p>{description}</p>

            <div className="modal-section">
              <h4>{t('modal.tech_header')}</h4>
              <div className="project-tech-tags" style={{ marginTop: '8px' }}>
                {data.tags.map((tag, idx) => (
                  <span key={idx} className="tech-tag-pill">{tag}</span>
                ))}
              </div>
            </div>

            <div className="modal-section">
              <h4>{t('modal.features_header')}</h4>
              <ul className="modal-features-list">
                {featuresList.map((feat, idx) => (
                  <li key={idx}>{feat}</li>
                ))}
              </ul>
            </div>

            {data.link && (
              <div className="modal-section" style={{ marginTop: '20px' }}>
                <a
                  href={data.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-orange"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    textDecoration: 'none'
                  }}
                >
                  <i className="fas fa-external-link-alt"></i>{' '}
                  <span>{t('modal.btn_demo')}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

