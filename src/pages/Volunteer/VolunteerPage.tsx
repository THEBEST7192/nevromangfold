import React, { useState } from 'react';
import './VolunteerPage.css';

const VolunteerPage: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interests: '',
    experience: '',
    message: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name) newErrors.name = 'Navn er påkrevd.';
    if (!formData.email) {
      newErrors.email = 'E-post er påkrevd.';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(formData.email)) {
      newErrors.email = 'Ugyldig e-postadresse.';
    }
    if (!formData.interests) newErrors.interests = 'Vennligst velg et interesseområde.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prevErrors => {
        const updatedErrors = { ...prevErrors };
        delete updatedErrors[name];
        return updatedErrors;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setLoading(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        interests: '',
        experience: '',
        message: ''
      });
      setErrors({});
    }, 1500);
  };

  return (
    <div className="volunteer-container">
      <div className="volunteer-content">
        <h1>Bli Frivillig</h1>
        
        <section className="volunteer-info">
          <h2>Hvorfor bli frivillig?</h2>
          <p>
            Som frivillig i Nevromangfold Norge får du muligheten til å bidra til viktig arbeid for nevrodivergente 
            personer i Norge. Du blir en del av et engasjert fellesskap og får verdifull erfaring innen 
            organisasjonsarbeid, samtidig som du bidrar til å skape et mer inkluderende samfunn.
          </p>
          
          <h2>Hva kan du bidra med?</h2>
          <div className="volunteer-options">
            <div className="volunteer-option">
              <h3>Arrangementer</h3>
              <p>Hjelp til med planlegging og gjennomføring av arrangementer, webinarer og konferanser.</p>
            </div>
            <div className="volunteer-option">
              <h3>Informasjonsarbeid</h3>
              <p>Bidra til å skrive artikler, lage informasjonsmateriell eller holde foredrag.</p>
            </div>
            <div className="volunteer-option">
              <h3>Støttegrupper</h3>
              <p>Vær med å lede eller assistere i støttegrupper for nevrodivergente personer og deres familier.</p>
            </div>
            <div className="volunteer-option">
              <h3>Administrativt arbeid</h3>
              <p>Hjelp til med organisasjonens daglige drift, medlemshåndtering eller økonomi.</p>
            </div>
          </div>
        </section>
        
        {!submitted ? (
          <section className="volunteer-form-section">
            <h2>Registrer deg som frivillig</h2>
            <form className="volunteer-form" onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="name">Navn *</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                  {errors.name && <p className="error-message">{errors.name}</p>}
                </div>
                
                <div className="form-group half-width">
                  <label htmlFor="email">E-post *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                  {errors.email && <p className="error-message">{errors.email}</p>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group half-width">
                  <label htmlFor="phone">Telefon</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    name="phone" 
                    value={formData.phone} 
                    onChange={handleChange} 
                  />
                </div>
                
                <div className="form-group half-width">
                  <label htmlFor="interests">Hva er du interessert i å bidra med? *</label>
                  <select 
                    id="interests" 
                    name="interests" 
                    value={formData.interests} 
                    onChange={handleChange} 
                    required
                  >
                    <option value="">Velg et alternativ</option>
                    <option value="events">Arrangementer</option>
                    <option value="information">Informasjonsarbeid</option>
                    <option value="support">Støttegrupper</option>
                    <option value="admin">Administrativt arbeid</option>
                    <option value="other">Annet</option>
                  </select>
                  {errors.interests && <p className="error-message">{errors.interests}</p>}
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">Tidligere erfaring</label>
                <textarea 
                  id="experience" 
                  name="experience" 
                  value={formData.experience} 
                  onChange={handleChange} 
                  rows={3}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="message">Melding</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message} 
                  onChange={handleChange} 
                  rows={5}
                />
              </div>
              
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? 'Sender inn...' : 'Send inn'}
              </button>
            </form>
          </section>
        ) : (
          <section className="thank-you-section">
            <h2>Takk for din interesse!</h2>
            <p>Vi har mottatt din henvendelse og vil kontakte deg snart for å diskutere hvordan du kan bidra.</p>
            <button onClick={() => setSubmitted(false)} className="back-button">Tilbake til skjemaet</button>
          </section>
        )}
      </div>
    </div>
  );
};

export default VolunteerPage;