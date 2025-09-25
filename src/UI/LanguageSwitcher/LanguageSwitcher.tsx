import React, { useState, useEffect, useRef } from 'react';
import './LanguageSwitcher.css';

const LanguageSwitcher: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(localStorage.getItem('selectedLanguage') || 'norwegian'); // Default language
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languageFlags: { [key: string]: string } = {
    norwegian: '/src/assets/LanguageSwitcher/norwegian-flag.png',
    english: '/src/assets/LanguageSwitcher/uk-flag.png',
    greek: '/src/assets/LanguageSwitcher/greek-flag.png',
    french: '/src/assets/LanguageSwitcher/french-flag.png',
  };

  const languages = Object.keys(languageFlags).map(lang => ({
    name: lang,
    flag: languageFlags[lang]
  }));

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleLanguageSelect = (language: string) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    setIsOpen(false);
    console.log(`Selected language: ${language}`);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const currentLanguage = languages.find(lang => lang.name === selectedLanguage);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <div className="language-switcher-toggle" onClick={toggleDropdown}>
        {currentLanguage && <img src={currentLanguage.flag} alt={currentLanguage.name} className="flag-icon" />}
        <span>{selectedLanguage.charAt(0).toUpperCase() + selectedLanguage.slice(1)}</span>
        <div className="dropdown-arrow"></div>
      </div>
      <div className={`language-switcher-dropdown-menu ${isOpen ? 'open' : 'closed'}`}>
        {languages.map((lang) => (
          <div key={lang.name} className="dropdown-item" onClick={() => handleLanguageSelect(lang.name)}>
            <img src={lang.flag} alt={lang.name} className="flag-icon" />
            {lang.name.charAt(0).toUpperCase() + lang.name.slice(1)}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageSwitcher;