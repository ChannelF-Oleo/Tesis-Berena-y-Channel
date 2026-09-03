import { CheckSquare, ChevronRight, Square } from 'lucide-react';
import { Layout } from '../components/Layout';
import { BotonCopiar } from '../components/BotonCopiar';
import { ETIQUETA_TIPO, INSTRUMENTO, TOTAL_VARIABLES } from '../lib/instrumento';
import type { SeccionInstrumento, Variable } from '../lib/instrumento';
import { TOTAL } from '../lib/datos';

type Tema = 'dark' | 'light';

/** Serializa el instrumento completo para el botón de copiar. */
function instrumentoATexto(): string {
  return INSTRUMENTO.map((s) => {
    const cabecera = `${s.numero} · ${s.titulo.toUpperCase()}\n${s.descripcion}`;
    const variables = s.variables
      .map((v) => {
        const partes = [`  - ${v.etiqueta} [${ETIQUETA_TIPO[v.tipo]}]`];
        if (v.ayuda) partes.push(`    ${v.ayuda}`);
        if (v.opciones) partes.push(`    Opciones: ${v.opciones.join(' · ')}`);
        return partes.join('\n');
      })
      .join('\n');
    return `${cabecera}\n${variables}`;
  }).join('\n\n');
}

export function Instrumento() {
  return (
    <Layout>
      {(tema) => {
        const isDark = tema === 'dark';
        const tenue = isDark ? 'text-neutral-400' : 'text-neutral-600';
        const muyTenue = isDark ? 'text-neutral-500' : 'text-neutral-500';
        const tarjeta = isDark
          ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]'
          : 'bg-white border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)]';

        return (
          <div className="flex flex-col gap-8">
            <header className="flex flex-col gap-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex flex-col gap-2 max-w-3xl">
                  <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Instrumento de análisis</h1>
                  <p className={`text-sm leading-relaxed ${tenue}`}>
                    Matriz de codificación del Capítulo III, aplicada a cada una de las {TOTAL} publicaciones del
                    corpus. Reúne {TOTAL_VARIABLES} variables organizadas en {INSTRUMENTO.length} bloques: identificación,
                    validación del corpus, las cuatro categorías de análisis que operativizan los objetivos específicos
                    y el cierre interpretativo.
                  </p>
                </div>
                <BotonCopiar
                  texto={instrumentoATexto()}
                  etiqueta="el instrumento completo"
                  theme={tema}
                  tamano="md"
                  conTexto
                />
              </div>

              <div className={`flex flex-wrap gap-x-6 gap-y-2 text-[11px] font-mono ${muyTenue}`}>
                <span>Unidad de análisis: el titular de cada publicación</span>
                <span>{TOTAL_VARIABLES} variables</span>
                <span>{TOTAL} fichas codificadas</span>
              </div>
            </header>

            <div className="flex flex-col gap-4 sm:gap-5">
              {INSTRUMENTO.map((seccion) => (
                <Bloque key={seccion.numero} seccion={seccion} theme={tema} tarjeta={tarjeta} />
              ))}
            </div>

            <a
              href="/tabla.html"
              className={`rounded-[24px] p-6 no-underline flex items-center justify-between gap-4 transition-all duration-300 hover:scale-[1.005] ${tarjeta} ${
                isDark ? 'text-white hover:bg-[#202020]' : 'text-black hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)]'
              }`}
            >
              <span className="min-w-0">
                <span className="block text-base font-bold tracking-tight">Ver el instrumento aplicado</span>
                <span className={`block mt-1 text-sm ${tenue}`}>
                  Cada fila de la tabla despliega la ficha de las {TOTAL_VARIABLES} variables para ese titular, junto a
                  su captura.
                </span>
              </span>
              <ChevronRight className={`w-5 h-5 shrink-0 ${muyTenue}`} />
            </a>
          </div>
        );
      }}
    </Layout>
  );
}

function Bloque({
  seccion,
  theme,
  tarjeta,
}: {
  seccion: SeccionInstrumento;
  theme: Tema;
  tarjeta: string;
}) {
  const isDark = theme === 'dark';
  const tenue = isDark ? 'text-neutral-400' : 'text-neutral-600';
  const muyTenue = isDark ? 'text-neutral-500' : 'text-neutral-500';

  return (
    <section className={`rounded-[24px] p-5 sm:p-7 ${tarjeta}`}>
      <div className="flex items-start gap-4">
        <span
          className={`w-9 h-9 shrink-0 rounded-xl grid place-items-center text-sm font-black tabular-nums ${
            isDark ? 'bg-white text-black' : 'bg-black text-white'
          }`}
        >
          {seccion.numero}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold tracking-tight">{seccion.titulo}</h2>
            {seccion.objetivo && (
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono border ${
                  isDark ? 'bg-white/10 text-white border-white/20' : 'bg-black/5 text-black border-black/10'
                }`}
              >
                Objetivo específico {seccion.objetivo}
              </span>
            )}
          </div>
          <p className={`mt-1 text-sm leading-relaxed ${tenue}`}>{seccion.descripcion}</p>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-3">
        {seccion.variables.map((v) => (
          <VariableFicha key={v.etiqueta} variable={v} theme={theme} />
        ))}
      </div>

      {seccion.numero === 2 && (
        <p className={`mt-4 text-[11px] leading-snug ${muyTenue}`}>
          El primer criterio debe cumplirse; los cuatro siguientes son causales de exclusión. Las {TOTAL} fichas del
          corpus superan la validación.
        </p>
      )}
    </section>
  );
}

function VariableFicha({ variable, theme }: { variable: Variable; theme: Tema }) {
  const isDark = theme === 'dark';
  const tenue = isDark ? 'text-neutral-400' : 'text-neutral-600';
  const muyTenue = isDark ? 'text-neutral-500' : 'text-neutral-500';
  const esCriterio = variable.tipo === 'criterio';

  return (
    <div
      className={`rounded-2xl border p-3.5 ${
        isDark ? 'bg-[#131313] border-white/10' : 'bg-[#fafafa] border-black/[0.07]'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2 min-w-0">
          {esCriterio &&
            (variable.excluye ? (
              <Square className={`w-4 h-4 mt-0.5 shrink-0 ${muyTenue}`} />
            ) : (
              <CheckSquare className={`w-4 h-4 mt-0.5 shrink-0 ${isDark ? 'text-white' : 'text-black'}`} />
            ))}
          <div className="min-w-0">
            <h3 className="text-[13px] font-semibold leading-snug">{variable.etiqueta}</h3>
            {variable.ayuda && <p className={`mt-1 text-[11px] leading-snug ${tenue}`}>{variable.ayuda}</p>}
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <span className={`text-[10px] font-mono whitespace-nowrap ${muyTenue}`}>
            {esCriterio && variable.excluye ? 'Excluye' : ETIQUETA_TIPO[variable.tipo]}
          </span>
          <BotonCopiar
            texto={
              variable.opciones
                ? `${variable.etiqueta}: ${variable.opciones.join(' · ')}`
                : variable.etiqueta
            }
            etiqueta={`la variable ${variable.etiqueta.toLowerCase()}`}
            theme={theme}
          />
        </div>
      </div>

      {variable.opciones && (
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {variable.opciones.map((o) => (
            <span
              key={o}
              className={`px-2 py-0.5 rounded-full text-[11px] border ${
                isDark ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-white border-black/10 text-neutral-700'
              }`}
            >
              {o}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
