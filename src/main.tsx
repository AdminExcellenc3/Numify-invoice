import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initDb } from './lib/db';

// Initialize the database before rendering the app
initDb().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}).catch(error => {
  console.error('Failed to initialize the application:', error);
  // Show a user-friendly error message
  document.getElementById('root')!.innerHTML = `
    <div style="padding: 20px; text-align: center;">
      <h1>Application Error</h1>
      <p>Failed to initialize the application. Please try refreshing the page.</p>
    </div>
  `;
});