import { useCallback, useEffect, useState } from 'react';

export type Tema = 'dark' | 'light';
const CLAVE = 'tesis-theme';

function leerTema(): Tema {
  if (typeof window === 'undefined') return 'dark';
  const guardado = window.localStorage.getItem(CLAVE);
  return guardado === 'light' ? 'light' : 'dark';
}

/** Tema monocromático compartido por todas las páginas (persistido en localStorage). */
export function useTema(): [Tema, () => void] {
  const [tema, setTema] = useState<Tema>(leerTema);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', tema === 'dark');
    document.documentElement.style.colorScheme = tema;
    try {
      window.localStorage.setItem(CLAVE, tema);
    } catch {
      /* almacenamiento no disponible */
    }
  }, [tema]);

  const alternar = useCallback(() => setTema((t) => (t === 'dark' ? 'light' : 'dark')), []);
  return [tema, alternar];
}
