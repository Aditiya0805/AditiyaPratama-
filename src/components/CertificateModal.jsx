import { useEffect } from 'react'

export default function CertificateModal({ cert, lang, t, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (cert) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cert, onClose]);

  if (!cert) return null;

  const title = cert.titleKey && t ? t(cert.titleKey) : cert.title;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      id="certificate-modal"
      className="modal-overlay active"
      aria-hidden="false"
      onClick={handleBackdropClick}
    >
      <div className="cert-modal-card glass">
        <button
          type="button"
          className="modal-close cert-close"
          aria-label={lang === 'id' ? 'Tutup sertifikat' : 'Close certificate'}
          onClick={onClose}
        >
          &times;
        </button>
        <img src={cert.img} alt={title} />
        <h4>{title}</h4>
      </div>
    </div>
  );
}

