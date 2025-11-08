import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import AppNew from './App/AppNew';
import { AppProvider } from './context/AppContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProvider>
      <AppNew />
    </AppProvider>
  </React.StrictMode>
);
