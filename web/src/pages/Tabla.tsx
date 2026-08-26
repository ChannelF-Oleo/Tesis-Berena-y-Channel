import { useMemo, useState } from 'react';
import { ChevronDown, ExternalLink, ImageOff, Search, X } from 'lucide-react';
import { Layout } from '../components/Layout';
import { BotonCopiar } from '../components/BotonCopiar';
import { CAMPOS, GRUPOS, TOTAL, formatearFecha, registroATexto, registros, rutaCaptura, valorATexto } from '../lib/datos';
import type { Registro } from '../lib/tipos';
import { contar } from '../lib/estadisticas';

type Tema = 'dark' | 'light';

/** Campos que ya se ven en la fila cerrada y no se repiten en el panel. */
const OMITIR_EN_PANEL: (keyof Registro)[] = ['codigo', 'titular', 'enlace'];

const TEXTOS_LARGOS: (keyof Registro)[] = ['interpretacion', 'observaciones', 'funcionComunicativa'];

export function Tabla() {
  const [busqueda, setBusqueda] = useState('');
  const [seccion, setSeccion] = useState('Todas');
  const [tipo, setTipo] = useState('Todos');
  const [abiertas, setAbiertas] = useState<Set<string>>(new Set());

  const secciones = useMemo(() => ['Todas', ...contar('seccion').map((c) => c.nombre)], []);
  const tipos = useMemo(() => ['Todos', ...contar('tipoEntrada').map((c) => c.nombre)], []);

  const filtrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    return registros.filter((r) => {
      if (seccion !== 'Todas' && r.seccion !== seccion) return false;
      if (tipo !== 'Todos' && r.tipoEntrada !== tipo) return false;
      if (!q) return true;
      return (
        r.codigo.toLowerCase().includes(q) ||
        r.titular.toLowerCase().includes(q) ||
        r.enlace.toLowerCase().includes(q) ||
        r.seccion.toLowerCase().includes(q) ||
        r.modalidad.toLowerCase().includes(q) ||
        r.actoHabla.toLowerCase().includes(q)
      );
    });
  }, [busqueda, seccion, tipo]);

  const alternarFila = (id: string) =>
    setAbiertas((prev) => {
      const s = new Set(prev);
      if (s.has(id)) s.delete(id);
      else s.add(id);
      return s;
    });

  const todasAbiertas = filtrados.length > 0 && filtrados.every((r) => abiertas.has(r.id));

  return (
    <Layout>
      {(tema) => {
        const isDark = tema === 'dark';
        const tenue = isDark ? 'text-neutral-400' : 'text-neutral-600';
        const campo = isDark
          ? 'bg-[#181818] border-white/10 text-white placeholder:text-neutral-600'
          : 'bg-white border-black/10 text-black placeholder:text-neutral-400';

        return (
          <div className="flex flex-col gap-6">
            <header className="flex flex-col gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Tabla de la muestra</h1>
              <p className={`text-sm ${tenue}`}>
                {TOTAL} titulares codificados. Pulsa una fila para desplegar la captura y la ficha completa de análisis;
                cada dato tiene su botón de copiar.
              </p>
            </header>

            {/* Controles */}
            <div className="flex flex-col lg:flex-row lg:items-center gap-3">
              <div className="relative flex-1 min-w-0">
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none ${tenue}`} />
                <input
                  type="search"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  placeholder="Buscar por código, titular, enlace, sección, modalidad…"
                  className={`w-full h-11 pl-10 pr-10 rounded-full border text-sm outline-none transition-all focus:ring-2 ${
                    campo
                  } ${isDark ? 'focus:ring-white/20' : 'focus:ring-black/15'}`}
                />
                {busqueda && (
                  <button
                    type="button"
                    onClick={() => setBusqueda('')}
                    aria-label="Limpiar búsqueda"
                    className={`absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer ${tenue} hover:opacity-70`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Selector valor={seccion} alCambiar={setSeccion} opciones={secciones} etiqueta="Sección" theme={tema} />
                <Selector valor={tipo} alCambiar={setTipo} opciones={tipos} etiqueta="Tipo" theme={tema} />
                <button
                  type="button"
                  onClick={() => setAbiertas(todasAbiertas ? new Set() : new Set(filtrados.map((r) => r.id)))}
                  className={`h-11 px-4 rounded-full border text-[13px] font-medium cursor-pointer transition-all ${
                    isDark
                      ? 'bg-white/5 border-white/10 text-neutral-300 hover:text-white hover:bg-white/10'
                      : 'bg-white border-black/10 text-neutral-700 hover:text-black hover:bg-neutral-50'
                  }`}
                >
                  {todasAbiertas ? 'Contraer todo' : 'Desplegar todo'}
                </button>
              </div>
            </div>

            <div className={`text-[11px] font-mono ${tenue}`}>
              Mostrando {filtrados.length} de {TOTAL} titulares
            </div>

            {/* Tabla */}
            <div
              className={`rounded-[24px] overflow-hidden border ${
                isDark ? 'bg-[#181818] border-white/10' : 'bg-white border-black/10 shadow-[0_4px_20px_rgba(0,0,0,0.04)]'
              }`}
            >
              {/* Encabezado (oculto en móvil, donde las filas se apilan) */}
              <div
                className={`hidden md:grid grid-cols-[120px_1fr_260px] gap-4 px-5 py-3 text-[10px] font-semibold uppercase tracking-wider border-b ${
                  isDark ? 'border-white/10 text-neutral-500 bg-white/[0.02]' : 'border-black/10 text-neutral-500 bg-black/[0.02]'
                }`}
              >
                <span>Código</span>
                <span>Titular</span>
                <span>Enlace</span>
              </div>

              {filtrados.length === 0 ? (
                <div className={`px-5 py-16 text-center text-sm ${tenue}`}>
                  No hay titulares que coincidan con la búsqueda.
                </div>
              ) : (
                filtrados.map((r) => (
                  <Fila
                    key={r.id}
                    registro={r}
                    abierta={abiertas.has(r.id)}
                    alAlternar={() => alternarFila(r.id)}
                    theme={tema}
                  />
                ))
              )}
            </div>
          </div>
        );
      }}
    </Layout>
  );
}

/* ------------------------------------------------------------------ */

function Selector({
  valor,
  alCambiar,
  opciones,
  etiqueta,
  theme,
}: {
  valor: string;
  alCambiar: (v: string) => void;
  opciones: string[];
  etiqueta: string;
  theme: Tema;
}) {
  const isDark = theme === 'dark';
  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">{etiqueta}</span>
      <select
        value={valor}
        onChange={(e) => alCambiar(e.target.value)}
        className={`h-11 pl-4 pr-9 rounded-full border text-[13px] font-medium appearance-none outline-none cursor-pointer transition-all ${
          isDark
            ? 'bg-white/5 border-white/10 text-neutral-300 hover:text-white'
            : 'bg-white border-black/10 text-neutral-700 hover:text-black'
        }`}
      >
        {opciones.map((o) => (
          <option key={o} value={o} className={isDark ? 'bg-[#181818]' : 'bg-white'}>
            {o === 'Todas' || o === 'Todos' ? `${etiqueta}: ${o.toLowerCase()}` : o}
          </option>
        ))}
      </select>
      <ChevronDown className={`absolute right-3 w-3.5 h-3.5 pointer-events-none ${isDark ? 'text-neutral-500' : 'text-neutral-400'}`} />
    </label>
  );
}

function Fila({
  registro,
  abierta,
  alAlternar,
  theme,
}: {
  registro: Registro;
  abierta: boolean;
  alAlternar: () => void;
  theme: Tema;
}) {
  const isDark = theme === 'dark';
  const tenue = isDark ? 'text-neutral-400' : 'text-neutral-600';

  return (
    <div className={`border-b last:border-b-0 ${isDark ? 'border-white/[0.07]' : 'border-black/[0.07]'}`}>
      <div
        role="button"
        tabIndex={0}
        aria-expanded={abierta}
        onClick={alAlternar}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            alAlternar();
          }
        }}
        className={`grid md:grid-cols-[120px_1fr_260px] gap-3 md:gap-4 px-4 sm:px-5 py-3.5 cursor-pointer transition-colors ${
          abierta
            ? isDark ? 'bg-white/[0.04]' : 'bg-black/[0.03]'
            : isDark ? 'hover:bg-white/[0.02]' : 'hover:bg-black/[0.015]'
        }`}
      >
        {/* Código */}
        <div className="flex items-center gap-2">
          <ChevronDown
            className={`w-4 h-4 shrink-0 transition-transform duration-200 ${tenue} ${abierta ? 'rotate-180' : ''}`}
          />
          <span className="font-mono text-[13px] font-semibold tabular-nums">{registro.codigo}</span>
          <BotonCopiar texto={registro.codigo} etiqueta={`el código ${registro.codigo}`} theme={theme} />
        </div>

        {/* Titular */}
        <div className="flex items-start gap-2 min-w-0">
          <p className="text-[13px] sm:text-sm leading-snug min-w-0">{registro.titular}</p>
          <BotonCopiar texto={registro.titular} etiqueta="el titular" theme={theme} className="mt-0.5" />
        </div>

        {/* Enlace: clicable y copiable */}
        <div className="flex items-center gap-2 min-w-0">
          <a
            href={registro.enlace}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            title={registro.enlace}
            className={`inline-flex items-center gap-1.5 min-w-0 text-[12px] font-mono underline underline-offset-2 decoration-dotted transition-colors ${
              isDark ? 'text-neutral-400 hover:text-white' : 'text-neutral-600 hover:text-black'
            }`}
          >
            <ExternalLink className="w-3 h-3 shrink-0" />
            <span className="truncate">{registro.enlace.replace('https://www.instagram.com/', '')}</span>
          </a>
          <BotonCopiar texto={registro.enlace} etiqueta="el enlace" theme={theme} />
        </div>
      </div>

      {abierta && <Panel registro={registro} theme={theme} />}
    </div>
  );
}

function Panel({ registro, theme }: { registro: Registro; theme: Tema }) {
  const isDark = theme === 'dark';
  const tenue = isDark ? 'text-neutral-400' : 'text-neutral-600';

  const campos = CAMPOS.filter((c) => !OMITIR_EN_PANEL.includes(c.clave));

  return (
    <div className={`px-4 sm:px-5 pb-5 pt-1 ${isDark ? 'bg-white/[0.02]' : 'bg-black/[0.015]'}`}>
      <div className="grid lg:grid-cols-[minmax(0,340px)_1fr] gap-5">
        {/* Columna 1: captura del titular */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${tenue}`}>Captura del titular</span>
            <BotonCopiar texto={rutaCaptura(registro.codigo)} etiqueta="la ruta de la captura" theme={theme} />
          </div>
          <Captura codigo={registro.codigo} theme={theme} />
          <div className={`text-[10px] font-mono ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Captura Titulares/{registro.codigo}.png
          </div>
        </div>

        {/* Columna 2: ficha de análisis */}
        <div className="flex flex-col gap-4 min-w-0">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <span className={`text-[10px] font-semibold uppercase tracking-wider ${tenue}`}>Ficha de análisis</span>
            <BotonCopiar
              texto={registroATexto(registro)}
              etiqueta="toda la ficha"
              theme={theme}
              tamano="md"
              conTexto
            />
          </div>

          {GRUPOS.filter((g) => campos.some((c) => c.grupo === g)).map((grupo) => (
            <section key={grupo} className="flex flex-col gap-2">
              <h3 className={`text-[10px] font-mono uppercase tracking-wider ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
                {grupo}
              </h3>
              <div className="grid sm:grid-cols-2 gap-2">
                {campos
                  .filter((c) => c.grupo === grupo)
                  .map((c) => {
                    const texto = c.clave === 'fecha' ? formatearFecha(registro.fecha) : valorATexto(registro[c.clave]);
                    const largo = TEXTOS_LARGOS.includes(c.clave);
                    return (
                      <div
                        key={c.clave}
                        className={`rounded-2xl border p-3 flex flex-col gap-1.5 ${largo ? 'sm:col-span-2' : ''} ${
                          isDark ? 'bg-[#131313] border-white/10' : 'bg-white border-black/[0.07]'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className={`text-[10px] font-semibold uppercase tracking-wider ${tenue}`}>{c.etiqueta}</span>
                          <BotonCopiar texto={texto} etiqueta={c.etiqueta.toLowerCase()} theme={theme} />
                        </div>
                        {Array.isArray(registro[c.clave]) ? (
                          <div className="flex flex-wrap gap-1.5">
                            {(registro[c.clave] as string[]).map((v) => (
                              <span
                                key={v}
                                className={`px-2 py-0.5 rounded-full text-[11px] border ${
                                  isDark ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-black/[0.03] border-black/10 text-neutral-700'
                                }`}
                              >
                                {v}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className={`text-[13px] leading-relaxed ${largo ? 'whitespace-pre-line' : ''}`}>{texto}</p>
                        )}
                      </div>
                    );
                  })}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}

function Captura({ codigo, theme }: { codigo: string; theme: Tema }) {
  const [error, setError] = useState(false);
  const isDark = theme === 'dark';
  const ruta = rutaCaptura(codigo);

  if (error) {
    return (
      <div
        className={`rounded-2xl border border-dashed aspect-4/5 grid place-items-center text-center px-6 ${
          isDark ? 'border-white/15 bg-[#131313]' : 'border-black/15 bg-neutral-50'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <ImageOff className={`w-6 h-6 ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`} />
          <span className={`text-[11px] font-mono ${isDark ? 'text-neutral-500' : 'text-neutral-500'}`}>
            Captura pendiente
          </span>
          <span className={`text-[10px] ${isDark ? 'text-neutral-600' : 'text-neutral-400'}`}>
            Añade {codigo}.png a «Captura Titulares»
          </span>
        </div>
      </div>
    );
  }

  return (
    <a href={ruta} target="_blank" rel="noopener noreferrer" className="block group">
      <img
        src={ruta}
        alt={`Captura del titular ${codigo}`}
        loading="lazy"
        decoding="async"
        onError={() => setError(true)}
        className={`w-full rounded-2xl border object-contain transition-transform group-hover:scale-[1.01] ${
          isDark ? 'border-white/10 bg-[#131313]' : 'border-black/10 bg-white'
        }`}
      />
    </a>
  );
}
