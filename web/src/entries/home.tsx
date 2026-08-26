import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Inicio } from '../pages/Inicio';
import '../styles.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Inicio />
  </StrictMode>,
);
