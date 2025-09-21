import React from 'react';
import './MainPage.css';
import mainPageImage from "./assets/mainpage.jpg";
import blueVector from "./assets/blue.svg";
import yellowVector from "./assets/yellow.svg";

const MainPage: React.FC = () => {
  return (
    <div className="main-page-container">
      <div className="main-page-content">
        <div className="text-section">
          <p>
            &laquo;Nevromangfold Norge&raquo; (NevNo) er en landsdekkende frivillig
            organisasjon bestående av nevrodivergente og støttespillerne
            våre som jobber med å spre kunnskap om nevromangfold og kjemper for
            nevrodivergentes rett til å være seg selv. NevNo skal jobbe for full
            inkludering og likestilling i skole, arbeidsliv og annen
            samfunnsdeltakelse, universell utforming og sosial aksept av ND-
            tilstander, samt motarbeide anvendt adferdsanalyse. NevNo ble stiftet 31.
            Mars 2021 og er offisielt registrert i enhets- og frivillighetsregisteret.
          </p>
          <img src={blueVector} alt="Blue Vector" className="blue-vector" />
        </div>
        <div className="image-section">
          <img src={mainPageImage} alt="Natüürmort triikrauga" className="main-image" />
          <p className="image-title">Title: Natüürmort triikrauga Creator: Vahtra, Jaan (autor) Date: 1923 Providing institution: Tartu Art Museum Aggregator</p>
          <img src={yellowVector} alt="Yellow Vector" className="yellow-vector" />
        </div>
      </div>
    </div>
  );
};

export default MainPage;