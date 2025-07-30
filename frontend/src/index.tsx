import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// pulls in Matter Sans + Tailwind’s generated CSS
import './styles/globals.css';

ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
