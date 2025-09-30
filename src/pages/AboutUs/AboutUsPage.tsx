import React from 'react';
import './AboutUsPage.css';

const AboutUsPage: React.FC = () => {
  return (
    <div className="about-us-container">
      <div className="about-us-content">
        <h1>Om oss</h1>
        
        <section className="about-section">
          <h2>Vårt formål</h2>
          <p>
            Nevromangfold Norge (NevNo) er en landsdekkende frivillig organisasjon som jobber for å fremme forståelse, 
            aksept og inkludering av nevrodivergente personer i det norske samfunnet. Vi består av nevrodivergente 
            personer og våre støttespillere som sammen arbeider for å skape et mer inkluderende samfunn.
          </p>
        </section>
        
        <section className="about-section">
          <h2>Våre kjerneverdier</h2>
          <ul className="values-list">
            <li><strong>Inkludering:</strong> Vi jobber for full inkludering og likestilling i skole, arbeidsliv og annen samfunnsdeltakelse.</li>
            <li><strong>Aksept:</strong> Vi fremmer sosial aksept av nevrodivergente tilstander og motarbeider stigmatisering.</li>
            <li><strong>Kunnskap:</strong> Vi sprer kunnskap om nevromangfold og ulike nevrodivergente tilstander.</li>
            <li><strong>Rettigheter:</strong> Vi kjemper for nevrodivergentes rett til å være seg selv og bli møtt med respekt.</li>
          </ul>
        </section>
        
        <section className="about-section">
          <h2>Våre aktiviteter</h2>
          <div className="activities-grid">
            <div className="activity-card">
              <h3>Informasjonsarbeid</h3>
              <p>Vi holder foredrag, skriver artikler og deltar i debatter for å øke kunnskapen om nevromangfold i samfunnet.</p>
            </div>
            <div className="activity-card">
              <h3>Støttegrupper</h3>
              <p>Vi organiserer støttegrupper og sosiale sammenkomster for nevrodivergente personer og deres familier.</p>
            </div>
            <div className="activity-card">
              <h3>Politisk påvirkning</h3>
              <p>Vi jobber opp mot politikere og beslutningstakere for å sikre bedre rettigheter og tilrettelegging.</p>
            </div>
            <div className="activity-card">
              <h3>Arrangementer</h3>
              <p>Vi arrangerer konferanser, webinarer og workshops om temaer relatert til nevromangfold.</p>
            </div>
          </div>
        </section>
        
        <section className="about-section">
          <h2>Vår historie</h2>
          <p>
            Nevromangfold Norge ble stiftet 31. mars 2021 og er offisielt registrert i enhets- og frivillighetsregisteret. 
            Organisasjonen ble startet av en gruppe engasjerte nevrodivergente personer som så behovet for en 
            organisasjon som kunne representere deres interesser og arbeide for et mer inkluderende samfunn.
          </p>
        </section>
      </div>
    </div>
  );
};

export default AboutUsPage;