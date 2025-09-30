import React from 'react';
import "./MainPage.css";
import mainPageImage from "../../assets/mainpage.jpg";
import blueVector from "../../assets/blue.svg";
import yellowVector from "../../assets/yellow.svg";
import { Link } from 'react-router-dom';

const MainPage: React.FC = () => {
  return (
    <div className="main-page-container">
      <div className="main-page-content">
        <div className="text-section">
          <h1>Velkommen til Nevromangfold Norge</h1>
          <p>
            Nevromangfold Norge (NevNo) er en landsdekkende frivillig
            organisasjon som sprer kunnskap om nevromangfold og kjemper for
            nevrodivergentes rett til å være seg selv. Vi jobber for full
            inkludering og likestilling i skole, arbeidsliv og samfunn, samt
            motarbeider anvendt adferdsanalyse. NevNo ble stiftet 31. Mars 2021.
          </p>
          {/* Desktop Buttons */}
          <div className="cta-buttons cta-desktop">
            <Link to="/about" className="cta-button about">Les mer om oss</Link>
            <Link to="/volunteer" className="cta-button volunteer">Bli frivillig</Link>
            <Link to="/donate" className="cta-button donate">Støtt vårt arbeid</Link>
          </div>
        </div>
        <div className="image-section">
          <img src={mainPageImage} alt="Autistic Image" className="main-image" />
          <p className="image-title">Title: Natüürmort triikrauga Creator: Vahtra, Jaan (autor) Date: 1923 Providing institution: Tartu Art Museum Aggregator</p>
          {/* Mobile Buttons */}
          <div className="cta-buttons cta-mobile">
            <Link to="/about" className="cta-button about">Les mer om oss</Link>
            <Link to="/volunteer" className="cta-button volunteer">Bli frivillig</Link>
            <Link to="/donate" className="cta-button donate">Støtt vårt arbeid</Link>
          </div>
        </div>
      </div>
      <img src={blueVector} alt="Blue Vector" className="blue-vector" />
      <img src={yellowVector} alt="Yellow Vector" className="yellow-vector" />
    </div>
  );
};

export default MainPage;