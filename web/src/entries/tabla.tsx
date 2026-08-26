import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Tabla } from '../pages/Tabla';
import '../styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Tabla />
  </StrictMode>,
);
