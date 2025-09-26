import React from 'react';
import './DonationButton.css';

const DonationButton: React.FC = () => {
  return (
    <a
      href="https://ffmpreg.org/"
      target="_blank"
      rel="noopener noreferrer"
      className="donation-button"
    >
      Doner
    </a>
  );
};

export default DonationButton;