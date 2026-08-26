import React from 'react';
import { BarChart3, Home, Moon, Sun, Table2 } from 'lucide-react';
import { useTema } from '../hooks/useTema';
import type { Tema } from '../hooks/useTema';

const ENLACES = [
  { href: '/', etiqueta: 'Inicio', icono: Home },
  { href: '/tabla.html', etiqueta: 'Tabla', icono: Table2 },
  { href: '/metricas.html', etiqueta: 'Métricas', icono: BarChart3 },
];

function esActivo(href: string): boolean {
  const ruta = window.location.pathname;
  if (href === '/') return ruta === '/' || ruta === '/index.html';
  return ruta === href;
}

interface LayoutProps {
  children: (tema: Tema) => React.ReactNode;
}

/**
 * Cascarón común de las tres vistas. La navegación usa enlaces reales para que
 * las reglas de especulación (prerender) del <head> las sirvan de forma instantánea.
 */
export function Layout({ children }: LayoutProps) {
  const [tema, alternarTema] = useTema();
  const isDark = tema === 'dark';

  return (
    <div className={`min-h-screen flex flex-col ${isDark ? 'bg-[#0b0b0b] text-white' : 'bg-[#fafafa] text-black'}`}>
      <header
        className={`sticky top-0 z-40 backdrop-blur-xl border-b ${
          isDark ? 'bg-[#0b0b0b]/80 border-white/10' : 'bg-white/80 border-black/10'
        }`}
      >
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-2.5 min-w-0 no-underline group">
            <span
              className={`w-8 h-8 shrink-0 rounded-xl grid place-items-center text-[13px] font-black tracking-tighter transition-transform group-hover:scale-105 ${
                isDark ? 'bg-white text-black' : 'bg-black text-white'
              }`}
            >
              TI
            </span>
            <span className="min-w-0 hidden sm:block">
              <span className={`block text-[13px] font-semibold leading-tight truncate ${isDark ? 'text-white' : 'text-black'}`}>
                Titulares en Instagram
              </span>
              <span className={`block text-[10px] font-mono leading-tight ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
                Análisis lingüístico-discursivo
              </span>
            </span>
          </a>

          <div className="flex items-center gap-1.5">
            <div
              className={`p-0.5 rounded-full border flex items-center gap-0.5 ${
                isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
              }`}
            >
              {ENLACES.map(({ href, etiqueta, icono: Icono }) => {
                const activo = esActivo(href);
                return (
                  <a
                    key={href}
                    href={href}
                    aria-current={activo ? 'page' : undefined}
                    className={`inline-flex items-center gap-1.5 px-3 h-8 rounded-full text-[13px] font-medium no-underline transition-all ${
                      activo
                        ? isDark
                          ? 'bg-white text-black font-semibold shadow-sm'
                          : 'bg-black text-white font-semibold shadow-sm'
                        : isDark
                          ? 'text-neutral-400 hover:text-white hover:bg-white/5'
                          : 'text-neutral-600 hover:text-black hover:bg-black/5'
                    }`}
                  >
                    <Icono className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">{etiqueta}</span>
                  </a>
                );
              })}
            </div>

            <button
              type="button"
              onClick={alternarTema}
              aria-label={isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
              title={isDark ? 'Tema claro' : 'Tema oscuro'}
              className={`w-9 h-9 grid place-items-center rounded-full border transition-all cursor-pointer ${
                isDark
                  ? 'bg-white/5 border-white/10 text-neutral-400 hover:text-white hover:bg-white/10'
                  : 'bg-neutral-100 border-neutral-200 text-neutral-600 hover:text-black'
              }`}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">{children(tema)}</main>

      <footer className={`border-t ${isDark ? 'border-white/10' : 'border-black/10'}`}>
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono ${
            isDark ? 'text-neutral-500' : 'text-neutral-500'
          }`}
        >
          <span>Tesis de grado · Análisis de titulares periodísticos en Instagram</span>
          <span>Muestra de 50 publicaciones · Datos propios</span>
        </div>
      </footer>
    </div>
  );
}
