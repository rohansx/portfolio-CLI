import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import AppFinal from './App/AppFinal';
import { AppProvider } from './context/AppContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProvider>
      <AppFinal />
    </AppProvider>
  </React.StrictMode>
);
