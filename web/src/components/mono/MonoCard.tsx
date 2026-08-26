import React from 'react';

export interface MonoCardProps {
  theme?: 'dark' | 'light';
  /** Etiqueta superior en versalitas. */
  eyebrow: string;
  /** Píldora de categoría a la derecha del eyebrow. */
  badge?: string;
  /** Cifra destacada. */
  valor: React.ReactNode;
  /** Texto pequeño junto a la cifra. */
  unidad?: string;
  /** Pie izquierdo y derecho de la tarjeta. */
  pieIzquierda?: string;
  pieDerecha?: string;
  /** Aclaración metodológica bajo el gráfico. */
  nota?: string;
  /** Ocupa dos columnas de la retícula. */
  ancho?: boolean;
  /** Deja que el escenario crezca con el contenido en vez de recortarlo. */
  crecer?: boolean;
  acciones?: React.ReactNode;
  children: React.ReactNode;
}

/**
 * Carcasa de tarjeta de Mono Charts: radio 24px, fondo #181818 / blanco,
 * escenario interno #131313 / #f4f4f6 y pie monoespaciado.
 */
export function MonoCard({
  theme = 'dark',
  eyebrow,
  badge,
  valor,
  unidad,
  pieIzquierda,
  pieDerecha,
  nota,
  ancho = false,
  crecer = false,
  acciones,
  children,
}: MonoCardProps) {
  const isDark = theme === 'dark';

  return (
    <div
      className={`relative w-full rounded-[24px] transition-all duration-300 group flex flex-col justify-between overflow-hidden p-4 sm:p-5 min-h-[290px] ${
        ancho ? 'lg:col-span-2' : ''
      } ${
        isDark
          ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020] text-white'
          : 'bg-white shadow-[0_4px_20px_rgba(0,0,0,0.04)] border border-neutral-100 text-black hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)]'
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold tracking-wider uppercase ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
              {eyebrow}
            </span>
            {badge && (
              <span
                className={`inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-mono border ${
                  isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/5 text-black border-black/10'
                }`}
              >
                {badge}
              </span>
            )}
          </div>
          <div className="text-xl font-bold tracking-tight tabular-nums mt-0.5 font-sans">
            {valor}
            {unidad && <span className="text-xs font-normal opacity-70 ml-1">{unidad}</span>}
          </div>
        </div>
        {acciones}
      </div>

      <div
        className={`relative w-full flex-1 rounded-[14px] p-2 transition-colors duration-300 touch-pan-y ${
          crecer ? 'overflow-visible' : 'overflow-hidden'
        } ${isDark ? 'bg-[#131313]' : 'bg-[#f4f4f6]'}`}
      >
        {children}
      </div>

      {nota && (
        <p
          className={`mt-3 flex gap-1.5 text-[10px] leading-snug ${
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          }`}
        >
          <span aria-hidden="true" className="shrink-0 font-mono">
            †
          </span>
          <span>{nota}</span>
        </p>
      )}

      {(pieIzquierda || pieDerecha) && (
        <div
          className={`flex items-center justify-between gap-3 mt-3 pt-1 border-t text-[11px] font-mono ${
            isDark ? 'border-white/5' : 'border-black/5'
          }`}
        >
          <span className={`truncate ${isDark ? 'text-neutral-400' : 'text-neutral-600'}`}>{pieIzquierda}</span>
          <span className={`shrink-0 ${isDark ? 'text-white font-medium' : 'text-black font-medium'}`}>{pieDerecha}</span>
        </div>
      )}
    </div>
  );
}

/** Escala monocromática usada por todos los gráficos. */
export function tono(isDark: boolean, indice: number, total: number): string {
  const pasos = Math.max(total, 1);
  const opacidad = 1 - (indice / pasos) * 0.82;
  return isDark
    ? `rgba(255,255,255,${opacidad.toFixed(3)})`
    : `rgba(9,9,11,${opacidad.toFixed(3)})`;
}

export const ejeTick = (isDark: boolean) => ({ fontSize: 10, fill: isDark ? '#71717A' : '#A1A1AA' });
export const rejilla = (isDark: boolean) => (isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)');
export const tintaPrincipal = (isDark: boolean) => (isDark ? '#FFFFFF' : '#09090B');
