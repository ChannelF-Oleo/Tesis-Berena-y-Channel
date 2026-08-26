import { ArrowRight, BarChart3, Quote, Table2 } from 'lucide-react';
import { Layout } from '../components/Layout';
import { TOTAL, formatearFecha } from '../lib/datos';
import { contar, contarBooleano, metricasTitular, porcentaje, rangoFechas } from '../lib/estadisticas';

const SUSTENTANTES = [
  { nombre: 'Channel Feliz de Oleo', matricula: '100521408', iniciales: 'CF' },
  { nombre: 'Berena Lisbeth Figuereo Fortuna', matricula: '100437101', iniciales: 'BF' },
];

const OBJETIVOS = [
  'Clasificar los recursos léxico-sintácticos predominantes en los titulares publicados en la cuenta de Instagram del periódico.',
  'Determinar los actos de habla y los mecanismos de presuposición empleados para orientar la interpretación del lector y potenciar el engagement.',
  'Identificar los rasgos de oralidad fingida y de escritura coloquial usados como estrategia de proximidad comunicativa.',
  'Explicar la interacción entre los elementos no verbales (emojis, diseño gráfico y tipografía) y el componente lingüístico.',
];

export function Inicio() {
  const secciones = contar('seccion');
  const { desde, hasta } = rangoFechas();
  const titular = metricasTitular();
  const claros = porcentaje(contarBooleano('tieneTitularClaro'));

  const cifras = [
    { valor: String(TOTAL), etiqueta: 'titulares analizados' },
    { valor: String(secciones.length), etiqueta: 'secciones temáticas' },
    { valor: `${titular.palabrasMedia}`, etiqueta: 'palabras por titular (media)' },
    { valor: `${claros}%`, etiqueta: 'con titular claro' },
  ];

  return (
    <Layout>
      {(tema) => {
        const isDark = tema === 'dark';
        const tarjeta = isDark
          ? 'bg-[#181818] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)] hover:bg-[#202020]'
          : 'bg-white border border-neutral-100 shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_6px_24px_rgba(0,0,0,0.06)]';
        const tenue = isDark ? 'text-neutral-400' : 'text-neutral-600';
        const muyTenue = isDark ? 'text-neutral-500' : 'text-neutral-500';

        return (
          <div className="flex flex-col gap-12 sm:gap-16">
            {/* Portada */}
            <section className="flex flex-col gap-6 max-w-3xl">
              <span
                className={`inline-flex items-center self-start gap-2 px-3 py-1 rounded-full text-[11px] font-mono border ${
                  isDark ? 'bg-white/5 border-white/10 text-neutral-300' : 'bg-black/[0.03] border-black/10 text-neutral-700'
                }`}
              >
                UASD · Escuela de Letras · Licenciatura en Letras Puras
              </span>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-[1.08]">
                Análisis de las estrategias lingüísticas y pragmáticas en los titulares del periódico{' '}
                <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>El Nuevo Diario</span>
              </h1>

              <p className={`text-base sm:text-lg leading-relaxed ${tenue}`}>
                El caso de su feed de Instagram (julio 2025 – febrero 2026). Esta plataforma reúne la muestra
                codificada de la investigación: {TOTAL} titulares publicados entre el {formatearFecha(desde)} y el{' '}
                {formatearFecha(hasta)}, analizados en sus niveles sintáctico, léxico-semántico, pragmático y multimodal.
              </p>

              <div className={`flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 ${tenue}`}>
                <span className={`text-[11px] font-semibold uppercase tracking-wider ${muyTenue}`}>
                  Sustentantes
                </span>
                <p className={`text-base sm:text-lg font-semibold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                  Channel Feliz de Oleo
                  <span className={`mx-2 font-normal ${muyTenue}`}>·</span>
                  Berena Lisbeth Figuereo Fortuna
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/tabla.html"
                  className={`inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold no-underline transition-all hover:scale-[1.03] ${
                    isDark ? 'bg-white text-black hover:bg-neutral-200' : 'bg-black text-white hover:bg-neutral-800'
                  }`}
                >
                  <Table2 className="w-4 h-4" />
                  Ver la muestra
                  <ArrowRight className="w-4 h-4" />
                </a>
                <a
                  href="/metricas.html"
                  className={`inline-flex items-center gap-2 h-11 px-5 rounded-full text-sm font-semibold no-underline border transition-all hover:scale-[1.03] ${
                    isDark
                      ? 'bg-white/5 text-white border-white/15 hover:bg-white/10'
                      : 'bg-white text-black border-black/10 hover:bg-neutral-50'
                  }`}
                >
                  <BarChart3 className="w-4 h-4" />
                  Dashboard de métricas
                </a>
              </div>
            </section>

            {/* Cifras */}
            <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {cifras.map((c) => (
                <div key={c.etiqueta} className={`rounded-[24px] p-5 transition-all duration-300 ${tarjeta}`}>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums">{c.valor}</div>
                  <div className={`mt-1 text-[11px] font-mono leading-tight ${muyTenue}`}>{c.etiqueta}</div>
                </div>
              ))}
            </section>

            {/* Objetivo general + específicos */}
            <section className="grid lg:grid-cols-[1.1fr_1fr] gap-4 sm:gap-6">
              <div className={`rounded-[24px] p-6 sm:p-8 transition-all duration-300 ${tarjeta}`}>
                <div className="flex items-center gap-2 mb-4">
                  <Quote className={`w-4 h-4 ${muyTenue}`} />
                  <span className={`text-xs font-semibold tracking-wider uppercase ${tenue}`}>Objetivo general</span>
                </div>
                <p className="text-lg sm:text-xl font-medium leading-relaxed tracking-tight">
                  Identificar las principales estrategias lingüísticas y pragmáticas que configuran el discurso de los
                  titulares en el feed de Instagram del periódico El Nuevo Diario, durante el periodo julio 2025 –
                  febrero 2026.
                </p>
                <div className={`mt-6 pt-4 border-t text-[11px] font-mono ${isDark ? 'border-white/10' : 'border-black/10'} ${muyTenue}`}>
                  Periodo analizado: julio 2025 – febrero 2026
                </div>
              </div>

              <div className={`rounded-[24px] p-6 sm:p-8 transition-all duration-300 ${tarjeta}`}>
                <span className={`text-xs font-semibold tracking-wider uppercase ${tenue}`}>Objetivos específicos</span>
                <ol className="mt-4 flex flex-col gap-4">
                  {OBJETIVOS.map((o, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        className={`shrink-0 w-6 h-6 rounded-full grid place-items-center text-[11px] font-mono font-bold ${
                          isDark ? 'bg-white/10 text-white' : 'bg-black/5 text-black'
                        }`}
                      >
                        {i + 1}
                      </span>
                      <span className={`text-sm leading-relaxed ${tenue}`}>{o}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </section>

            {/* Autoría */}
            <section className="flex flex-col gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-sm font-semibold uppercase tracking-wider">Autoría</h2>
                <span className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {SUSTENTANTES.map((persona) => (
                  <div key={persona.matricula} className={`rounded-[24px] p-6 flex items-center gap-4 transition-all duration-300 ${tarjeta}`}>
                    <span
                      className={`w-14 h-14 shrink-0 rounded-2xl grid place-items-center text-lg font-black tracking-tighter ${
                        isDark ? 'bg-white text-black' : 'bg-black text-white'
                      }`}
                    >
                      {persona.iniciales}
                    </span>
                    <div className="min-w-0">
                      <div className="text-lg font-bold tracking-tight leading-tight">{persona.nombre}</div>
                      <div className={`mt-1 text-[11px] font-mono ${muyTenue}`}>
                        Sustentante · Matrícula {persona.matricula}
                      </div>
                    </div>
                  </div>
                ))}

                <div className={`rounded-[24px] p-6 flex items-center gap-4 transition-all duration-300 ${tarjeta}`}>
                  <span
                    className={`w-14 h-14 shrink-0 rounded-2xl grid place-items-center text-lg font-black tracking-tighter border ${
                      isDark ? 'border-white/20 text-white' : 'border-black/15 text-black'
                    }`}
                  >
                    AM
                  </span>
                  <div className="min-w-0">
                    <div className="text-lg font-bold tracking-tight leading-tight">Mtra. Alma Rosa Mejía</div>
                    <div className={`mt-1 text-[11px] font-mono ${muyTenue}`}>Asesora de la investigación</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Cómo leer la plataforma */}
            <section className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <a href="/tabla.html" className={`rounded-[24px] p-6 sm:p-8 no-underline block transition-all duration-300 hover:scale-[1.01] ${tarjeta} ${isDark ? 'text-white' : 'text-black'}`}>
                <Table2 className={`w-5 h-5 mb-3 ${muyTenue}`} />
                <h2 className="text-lg font-bold tracking-tight">Tabla de la muestra</h2>
                <p className={`mt-2 text-sm leading-relaxed ${tenue}`}>
                  Los {TOTAL} titulares con su código, enlace original y captura. Cada fila se despliega para mostrar la
                  ficha completa de análisis y todos los datos se pueden copiar al portapapeles.
                </p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-[11px] font-mono ${muyTenue}`}>
                  Abrir tabla <ArrowRight className="w-3 h-3" />
                </span>
              </a>

              <a href="/metricas.html" className={`rounded-[24px] p-6 sm:p-8 no-underline block transition-all duration-300 hover:scale-[1.01] ${tarjeta} ${isDark ? 'text-white' : 'text-black'}`}>
                <BarChart3 className={`w-5 h-5 mb-3 ${muyTenue}`} />
                <h2 className="text-lg font-bold tracking-tight">Dashboard de métricas</h2>
                <p className={`mt-2 text-sm leading-relaxed ${tenue}`}>
                  Distribuciones por sección, modalidad, actos de habla, figuras retóricas, marcas de oralidad y
                  coherencia texto-imagen, visualizadas con Mono Charts.
                </p>
                <span className={`mt-4 inline-flex items-center gap-1.5 text-[11px] font-mono ${muyTenue}`}>
                  Abrir dashboard <ArrowRight className="w-3 h-3" />
                </span>
              </a>
            </section>
          </div>
        );
      }}
    </Layout>
  );
}
