import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import AppNew2 from './App/AppNew2';
import { AppProvider } from './context/AppContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AppProvider>
      <AppNew2 />
    </AppProvider>
  </React.StrictMode>
);
