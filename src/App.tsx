import './App.css'
import Header from './UI/Header'
import MainPage from './pages/Main/MainPage'
import DonationButton from './DonationButton'
import AboutUsPage from './pages/AboutUs/AboutUsPage';
import VolunteerPage from './pages/Volunteer/VolunteerPage';
import EventsPage from './pages/Events/EventsPage';
import DonationPage from './DonationPage';
import Footer from './UI/Footer/Footer';
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
        <Footer />
      </div>
    </Router>
  )
}

export default App
