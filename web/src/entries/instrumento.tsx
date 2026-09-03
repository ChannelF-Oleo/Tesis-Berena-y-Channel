import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Instrumento } from '../pages/Instrumento';
import '../styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Instrumento />
  </StrictMode>,
);
