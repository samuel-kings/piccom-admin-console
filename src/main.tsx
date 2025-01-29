import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext';
import { CacheProvider } from './contexts/CacheContext';
import { ToastProvider } from './contexts/ToastContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <CacheProvider>
        <ThemeProvider>
          <ToastProvider>
          <App />
          </ToastProvider>
        </ThemeProvider>
      </CacheProvider>
    </BrowserRouter>
  </StrictMode>
);