import { useCallback, useEffect, useRef, useState } from 'react';

/** Copia texto al portapapeles con respaldo para contextos sin permiso de clipboard. */
export function useCopiar(duracion = 1600): [boolean, (texto: string) => void] {
  const [copiado, setCopiado] = useState(false);
  const timer = useRef<number | null>(null);

  useEffect(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  const copiar = useCallback(
    (texto: string) => {
      const marcar = () => {
        setCopiado(true);
        if (timer.current) window.clearTimeout(timer.current);
        timer.current = window.setTimeout(() => setCopiado(false), duracion);
      };

      if (navigator.clipboard?.writeText) {
        navigator.clipboard.writeText(texto).then(marcar).catch(() => respaldo(texto, marcar));
      } else {
        respaldo(texto, marcar);
      }
    },
    [duracion],
  );

  return [copiado, copiar];
}

function respaldo(texto: string, alCopiar: () => void) {
  const area = document.createElement('textarea');
  area.value = texto;
  area.setAttribute('readonly', '');
  area.style.position = 'fixed';
  area.style.opacity = '0';
  document.body.appendChild(area);
  area.select();
  try {
    document.execCommand('copy');
    alCopiar();
  } finally {
    document.body.removeChild(area);
  }
}
