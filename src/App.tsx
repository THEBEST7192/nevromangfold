import './App.css'
import Header from './UI/Header'
import MainPage from './MainPage'
import DonationButton from './DonationButton'
import AboutUsPage from './AboutUsPage';
import VolunteerPage from './VolunteerPage';
import EventsPage from './EventsPage';
import DonationPage from './DonationPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {

  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/volunteer" element={<VolunteerPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/donate" element={<DonationPage />} />
        </Routes>
        <DonationButton />
      </div>
    </Router>
  )
}

export default App
