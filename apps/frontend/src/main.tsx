import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './app/styles/styles.css';

import App from './app/app';
import { Auth0ProviderWithNavigate } from './app/auth0-provider-with-navigate';
import { StoreProvider } from './app/store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <StrictMode>
    <BrowserRouter>
      <Auth0ProviderWithNavigate>
        <StoreProvider>
          <App />
        </StoreProvider>
      </Auth0ProviderWithNavigate>
    </BrowserRouter>
  </StrictMode>
);
