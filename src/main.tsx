import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppRouter from './components/Router.tsx';
import './index.css';
import { initializeErrorSuppression } from './utils/errorSuppression';

// Inicializar supressão de erros de serviços externos
initializeErrorSuppression();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppRouter />
  </StrictMode>
);
