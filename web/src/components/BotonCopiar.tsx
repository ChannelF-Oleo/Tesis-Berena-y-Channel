import { Check, Copy } from 'lucide-react';
import { useCopiar } from '../hooks/useCopiar';

interface BotonCopiarProps {
  texto: string;
  /** Se anuncia a lectores de pantalla: «Copiar {etiqueta}». */
  etiqueta: string;
  theme?: 'dark' | 'light';
  tamano?: 'sm' | 'md';
  /** Muestra la palabra «Copiar» junto al icono. */
  conTexto?: boolean;
  className?: string;
}

/** Botón de copiado reutilizable: cualquier dato de la tabla se lleva al portapapeles. */
export function BotonCopiar({
  texto,
  etiqueta,
  theme = 'dark',
  tamano = 'sm',
  conTexto = false,
  className = '',
}: BotonCopiarProps) {
  const [copiado, copiar] = useCopiar();
  const isDark = theme === 'dark';
  const px = tamano === 'sm' ? 'h-6 min-w-6 px-1.5' : 'h-8 min-w-8 px-2.5';
  const icono = tamano === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5';

  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        copiar(texto);
      }}
      title={copiado ? '¡Copiado!' : `Copiar ${etiqueta}`}
      aria-label={copiado ? 'Copiado' : `Copiar ${etiqueta}`}
      className={`inline-flex items-center justify-center gap-1 shrink-0 rounded-full border text-[11px] font-medium transition-all cursor-pointer ${px} ${
        copiado
          ? isDark
            ? 'bg-white text-black border-white'
            : 'bg-black text-white border-black'
          : isDark
            ? 'bg-white/5 text-neutral-400 border-white/10 hover:text-white hover:bg-white/10'
            : 'bg-black/[0.03] text-neutral-500 border-black/10 hover:text-black hover:bg-black/[0.06]'
      } ${className}`}
    >
      {copiado ? <Check className={icono} /> : <Copy className={icono} />}
      {conTexto && <span>{copiado ? 'Copiado' : 'Copiar'}</span>}
    </button>
  );
}
