import { useState, useEffect, useRef } from 'react'

export default function Contact({ lang, t }) {
  const [inView, setInView] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const mailtoUrl = `mailto:adityapratama2292@gmail.com?subject=Pesan%20dari%20${encodeURIComponent(formData.name)}&body=${encodeURIComponent(formData.message)}%0A%0AEmail:%20${encodeURIComponent(formData.email)}`;
    window.location.href = mailtoUrl;

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="contact-section section-padding" ref={sectionRef}>
      <div className="container">
        <div className={`contact-dark-wrapper ${inView ? 'active' : ''}`}>
          {/* Left Column: Contact Info & Status */}
          <div className="contact-info-col">
            <div className="section-pre-tag">
              <span>// {lang === 'id' ? 'HUBUNGI SAYA' : 'GET IN TOUCH'}</span>
            </div>

            <h2 className="section-heading">
              {lang === 'id' ? (
                <>Mari Berkolaborasi &amp; <span className="highlight-text">Ciptakan Karya</span></>
              ) : (
                <>Let&apos;s Build <span className="highlight-text">Something Amazing</span></>
              )}
            </h2>

            <p className="contact-description">
              {t('contact.desc')}
            </p>

            {/* Availability status badge from DevNik screenshot */}
            <div className="availability-badge">
              <span className="pulse-indicator"></span>
              <span>{lang === 'id' ? 'Tersedia untuk proyek freelance & peluang kerja' : 'Available for freelance, project & full-time opportunities'}</span>
            </div>

            <div className="contact-details-list">
              <div className="contact-detail-item">
                <div className="contact-icon-circle">
                  <i className="fas fa-envelope"></i>
                </div>
                <div>
                  <span className="detail-label">Email</span>
                  <a href="mailto:adityapratama2292@gmail.com" className="detail-value">
                    adityapratama2292@gmail.com
                  </a>
                </div>
              </div>

              <div className="contact-detail-item">
                <div className="contact-icon-circle">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div>
                  <span className="detail-label">{lang === 'id' ? 'Lokasi' : 'Location'}</span>
                  <span className="detail-value">{t('contact.location')}</span>
                </div>
              </div>
            </div>

            {/* Radar / World graphic background element */}
            <div className="contact-radar-graphic">
              <div className="radar-ring ring-1"></div>
              <div className="radar-ring ring-2"></div>
              <div className="radar-ring ring-3"></div>
              <div className="radar-pin">
                <i className="fas fa-map-pin"></i>
              </div>
            </div>
          </div>

          {/* Right Column: Sleek Dark Contact Form */}
          <div className="contact-form-col">
            <form className="contact-dark-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-field-group">
                  <label htmlFor="contact-name" className="field-label">
                    {lang === 'id' ? 'Nama Lengkap' : 'Full Name'}
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    className="dark-input"
                    placeholder={t('contact.form_name')}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-field-group">
                  <label htmlFor="contact-email" className="field-label">
                    {lang === 'id' ? 'Alamat Email' : 'Email Address'}
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className="dark-input"
                    placeholder={t('contact.form_email')}
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="form-field-group">
                <label htmlFor="contact-message" className="field-label">
                  {lang === 'id' ? 'Pesan Anda' : 'Your Message'}
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="dark-textarea"
                  placeholder={t('contact.form_message')}
                  rows="5"
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn-send-orange">
                <span>{submitted ? (lang === 'id' ? 'Membuka Email...' : 'Opening Email Client...') : t('contact.form_submit')}</span>
                <i className="fas fa-arrow-right"></i>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
