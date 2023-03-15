// eslint-disable-next-line @typescript-eslint/no-unused-vars

import { Route, Routes } from 'react-router-dom';

import { useAuth0 } from '@auth0/auth0-react';
import { PageLoader } from './components/page-loader';
import { HomePage } from './pages/home-page';
import { AuthenticationGuard } from './components/authentication-guard';
import { ProfilePage } from './pages/profile-page';
import { Dashboard } from './pages/dashboard';
import { CallbackPage } from './pages/callback-page';
import { NotFoundPage } from './pages/not-found-page';

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
