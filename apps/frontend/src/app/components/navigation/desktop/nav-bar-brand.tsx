import React from 'react';
import { NavLink } from 'react-router-dom';
import covidLogo from '../../../../assets/covid-logo.png';
export const NavBarBrand: React.FC = () => {
  return (
    <div className="nav-bar__brand">
      <NavLink to="/">
        <img
          className="nav-bar__logo"
          src={covidLogo}
          alt="Auth0 shield logo"
          width="50"
          height="50"
        />
      </NavLink>
    </div>
  );
};
