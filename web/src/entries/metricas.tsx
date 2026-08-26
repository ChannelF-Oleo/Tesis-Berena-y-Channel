import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Metricas } from '../pages/Metricas';
import '../styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Metricas />
  </StrictMode>,
);
