// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './app.module.css';

import { Route, Routes, Link } from 'react-router-dom';

import React, { useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { PageLoader } from './components/page-loader';
import { HomePage } from './pages/home-page';
import { AuthenticationGuard } from './components/authentication-guard';
import { ProfilePage } from './pages/profile-page';
import { Dashboard } from './pages/dashboard';
import { CallbackPage } from './pages/callback-page';
import { NotFoundPage } from './pages/not-found-page';

const LoginButton = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button className="login-button" onClick={() => loginWithRedirect()}>
      Log In
    </button>
  );
};

const LogoutButton = () => {
  const { logout } = useAuth0();

  return (
    <button
      className="logout-button"
      onClick={() =>
        logout({ logoutParams: { returnTo: window.location.origin } })
      }
    >
      Log Out
    </button>
  );
};

const WelcomeMessage = () => {
  const { isAuthenticated, isLoading, user } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return isAuthenticated && user ? (
    <h2 className="welcome">Welcome, {user.name}!</h2>
  ) : (
    <h2 className="welcome">Welcome!</h2>
  );
};

export function App() {
  const { isLoading } = useAuth0();
  if (isLoading) {
    return (
      <div className="page-layout">
        <PageLoader />
      </div>
    );
  }
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route
        path="/profile"
        element={<AuthenticationGuard component={ProfilePage} />}
      />
      <Route
        path="/dashboard"
        element={<AuthenticationGuard component={Dashboard} />}
      />

      <Route path="/callback" element={<CallbackPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
