import React, { useState } from 'react';
import './DonationPage.css';

const DonationPage: React.FC = () => {
  const [donationAmount, setDonationAmount] = useState<string>('');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [donorInfo, setDonorInfo] = useState({
    name: '',
    email: ''
  });

  const handleAmountSelect = (amount: string) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^0-9]/g, '');
    if (value.length > 1 && value.startsWith('0')) {
      value = value.substring(1);
    }
    setCustomAmount(value.slice(0, 6));
  };

  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setDonorInfo(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalAmount = donationAmount === 'custom' ? customAmount : donationAmount;

    if (parseInt(finalAmount) === 0) {
      alert('Donasjonsbeløpet kan ikke være 0. Vennligst velg et beløp over 0.');
      return;
    }

    console.log('Donation submitted:', {
      amount: finalAmount,
      ...donorInfo
    });
    alert('Takk for din støtte! Dette er en demoversjon, ingen betaling er gjennomført.');
  };

  return (
    <div className="donation-container">
      <div className="donation-content">
        <h1>Støtt vårt arbeid</h1>
        
        <section className="donation-intro">
          <p>
            Nevromangfold Norge er avhengig av donasjoner for å kunne fortsette vårt viktige arbeid. 
            Din støtte bidrar til at vi kan arrangere aktiviteter, drive informasjonsarbeid og 
            jobbe politisk for å bedre situasjonen for nevrodivergente personer i Norge.
          </p>
          <div className="impact-info">
            <span className="shield-icon">$</span>
            <div>
              <h3>Din støtte gjør en forskjell</h3>
              <p>Alle donasjoner, store og små, hjelper oss å nå våre mål om et mer inkluderende samfunn.</p>
            </div>
          </div>
        </section>
        
        <section className="donation-options">
          <h2>Hvordan du kan støtte oss</h2>
          
          <div className="donation-methods">
            <div className="donation-method">
              <h3>Enkeltdonasjon</h3>
              <p>Støtt oss med et engangsbeløp som passer for deg.</p>
              <form className="donation-form" onSubmit={handleSubmit}>
                <div className="amount-options">
                  <button 
                    type="button" 
                    className={donationAmount === '100' ? 'amount-btn selected' : 'amount-btn'}
                    onClick={() => handleAmountSelect('100')}
                  >
                    100 kr
                  </button>
                  <button 
                    type="button" 
                    className={donationAmount === '200' ? 'amount-btn selected' : 'amount-btn'}
                    onClick={() => handleAmountSelect('200')}
                  >
                    200 kr
                  </button>
                  <button 
                    type="button" 
                    className={donationAmount === '500' ? 'amount-btn selected' : 'amount-btn'}
                    onClick={() => handleAmountSelect('500')}
                  >
                    500 kr
                  </button>
          <div className="custom-amount">
            <div className="input-wrapper">
              <input
                type="text"
                placeholder="Annet beløp"
                value={customAmount || ''}
                onChange={handleCustomAmountChange}
                onFocus={() => setDonationAmount('custom')}
                className={customAmount ? 'hidden-input' : ''}
                maxLength={6}
              />
              {customAmount && <div className="currency-text">{customAmount} kr</div>}
            </div>
          </div>
                </div>
                
                <div className="donor-info">
                  <div className="form-group">
                    <label htmlFor="name">Navn (valgfritt)</label>
                    <input 
                      type="text" 
                      id="name" 
                      name="name" 
                      value={donorInfo.name}
                      onChange={handleInfoChange}
                    />
                  </div>
                  
                  <div className="form-group">
                    <label htmlFor="email">E-post (for kvittering)</label>
                    <input 
                      type="email" 
                      id="email" 
                      name="email" 
                      value={donorInfo.email}
                      onChange={handleInfoChange}
                    />
                  </div>
                  

                </div>
                
                <button 
                  type="submit" 
                  className="donate-button"
                  disabled={!donationAmount || (donationAmount === 'custom' && !customAmount)}
                >
                  Doner nå
                </button>
              </form>
            </div>
            
            <div className="donation-method">
                <h3>Andre måter å støtte på</h3>
                <ul className="other-methods">
                  <li>
                    <strong>Vipps:</strong> Støtt oss enkelt med et valgfritt beløp via Vipps til nummer 12345. Din donasjon bidrar direkte til vårt arbeid!
                  </li>
                  <li>
                    <strong>Bankoverføring:</strong> Foretrekker du bankoverføring? Du kan sende din støtte til vårt kontonummer: 1234.56.78910. Hver krone teller!
                  </li>
                  <li>
                    <strong>Frivillig arbeid:</strong> Har du tid og kompetanse du ønsker å bidra med? Vi trenger alltid engasjerte frivillige! Kontakt oss for å høre mer om hvordan du kan hjelpe.
                  </li>
                </ul>
              </div>
          </div>
        </section>
        
        <section className="donation-transparency">
          <h2>Åpenhet om bruk av midler</h2>
          <p>
            Nevromangfold Norge er opptatt av åpenhet og transparens. Alle donasjoner går direkte til vårt arbeid, 
            og vi publiserer årlig regnskap som viser hvordan midlene er brukt. Våre administrative kostnader 
            holdes så lave som mulig for å sikre at mest mulig av donasjonene går direkte til formålet.
          </p>
          <a href="#" className="transparency-link">Se vårt siste årsregnskap</a>
        </section>
      </div>
    </div>
  );
};

export default DonationPage;