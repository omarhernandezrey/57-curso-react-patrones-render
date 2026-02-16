import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './AppModern/index.js';
import { ErrorBoundary } from './AppModern/ErrorBoundary';
import './styles/error-boundary.css';
import './index.css';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);
