import React from 'react';
import './Header.css';
import logo from "../assets/logo.png";
import loginIcon from "../assets/login.svg";

const Header: React.FC = () => {
  return (
    <header className="header-desktop">
      <div className="header-content">
        <div className="logo-section">
          <img src={logo} className="logo" alt="Nevromangfold logo" />
          <span className="logo-text">Nevromangfold</span>
        </div>
        <nav className="navigation">
          <ul>
            <li><a href="#">Bli Medlem!</a></li>
            <li><a href="#">Kontakt Oss</a></li>
            <li><a href="#">Styret</a></li>
            <li><a href="#">Innlegg</a></li>
            <li><a href="#">Arkiv</a></li>
          </ul>
        </nav>
        <div className="user-section">
          <div className="login-button">
            <img src={loginIcon} alt="Login" className="login-icon" />
            <span>Logg Inn</span>
          </div>
          <div className="language-switcher">
            <img src="/src/assets/languageswitcher/norwegian-flag.png" alt="Norwegian Flag" className="flag-icon" />
            <span>Norsk</span>
            <span className="dropdown-arrow"></span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;