import React from 'react';
import './EventsPage.css';

interface Event {
  id: number;
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
  type: 'webinar' | 'conference' | 'meeting' | 'workshop';
}

const UPCOMING_EVENTS: Event[] = [
  {
    id: 1,
    title: 'Webinar: Nevromangfold i arbeidslivet',
    date: '30. september 2025',
    time: '18:00 - 19:30',
    location: 'Zoom',
    description: 'Et webinar om hvordan arbeidsplasser kan tilrettelegge for nevrodivergente ansatte og skape et inkluderende arbeidsmiljø.',
    type: 'webinar'
  },
  {
    id: 2,
    title: 'Årskonferanse 2025: Nevromangfold i fokus',
    date: '10. - 11. oktober 2025',
    time: '09:00 - 16:00',
    location: 'Digitalt arrangement',
    description: 'Vår årlige konferanse med fokus på nevromangfold i samfunnet. Foredrag, workshops og nettverksbygging.',
    type: 'conference'
  },
  {
    id: 3,
    title: 'Erfaringsdeling: Nettverkstreff',
    date: '25. november 2025',
    time: '17:00 - 19:00',
    location: 'Online (Discord)',
    description: 'En uformell samling for nevrodivergente og deres allierte for å dele erfaringer og bygge nettverk.',
    type: 'meeting'
  },
  {
    id: 4,
    title: 'Workshop: Kreativt verksted',
    date: '5. desember 2025',
    time: '14:00 - 17:00',
    location: 'Kulturhuset, Trondheim',
    description: 'En praktisk workshop for å utforske kreativitet og uttrykk i et trygt og inkluderende miljø.',
    type: 'workshop'
  }
];

const EventsPage: React.FC = () => {
  return (
    <div className="events-container">
      <div className="events-content">
        <h1>Arrangementer og Kalender</h1>
        
        <section className="events-intro">
          <p>
            Nevromangfold Norge arrangerer jevnlig webinarer, konferanser, workshops og støttegrupper. 
            Her finner du en oversikt over våre kommende arrangementer. Alle våre arrangementer er 
            tilrettelagt for nevrodivergente personer med rolige omgivelser, pauser og mulighet for 
            sensoriske hjelpemidler.
          </p>
        </section>
        
        <section className="events-list">
          <h2>Kommende arrangementer</h2>
          
          <div className="events-grid">
            {UPCOMING_EVENTS.map(event => (
              <div key={event.id} className={`event-card ${event.type}`}>
                <div className="event-header">
                  <span className="event-type">{event.type}</span>
                  <h3>{event.title}</h3>
                </div>
                <div className="event-details">
                  <p className="event-date"><strong>Dato:</strong> {event.date}</p>
                  <p className="event-time"><strong>Tid:</strong> {event.time}</p>
                  <p className="event-location"><strong>Sted:</strong> {event.location}</p>
                  <p className="event-description">{event.description}</p>
                </div>
                <button className="register-button">Meld deg på</button>
              </div>
            ))}
          </div>
        </section>
        
        <section className="calendar-section">
          <h2>Årskalender</h2>
          <p>
            Vi oppdaterer jevnlig vår kalender med nye arrangementer. Følg med på våre 
            sosiale medier eller meld deg på vårt nyhetsbrev for å holde deg oppdatert 
            om kommende arrangementer.
          </p>
          <a href="https://ffmpreg.org/" className="calendar-button">Abonner på kalender</a>
        </section>
        
        <section className="past-events">
          <h2>Tidligere arrangementer</h2>
          <p>
            Mange av våre tidligere webinarer og foredrag er tilgjengelige som opptak. 
            Besøk vår YouTube-kanal for å se opptak av tidligere arrangementer.
          </p>
          <a href="https://ffmpreg.org/" target="_blank" rel="noopener noreferrer" className="youtube-button">Se opptak på YouTube</a>
        </section>
      </div>
    </div>
  );
};

export default EventsPage;