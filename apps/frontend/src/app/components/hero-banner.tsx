import React from 'react';
import covidLogo from '../../assets/covid-logo.png';

export const HeroBanner: React.FC = () => {
  return (
    <div className="hero-banner hero-banner--emerald-yellow ">
      <div className="hero-banner__logo">
        <img className="hero-banner__image" src={covidLogo} alt="Covid logo" />
      </div>
      <h1 className="hero-banner__headline">Track Covid Cases</h1>
      <p className="hero-banner__description">
        Sign up to log your status and view the covid stats across the{' '}
        <strong>world</strong>
      </p>
    </div>
  );
};
