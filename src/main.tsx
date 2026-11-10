import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/foundation.css';
import { AcademicSystemProvider } from './core/registry';
import { PlatformShell } from './platform/PlatformShell';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AcademicSystemProvider>
      <PlatformShell />
    </AcademicSystemProvider>
  </React.StrictMode>
);
