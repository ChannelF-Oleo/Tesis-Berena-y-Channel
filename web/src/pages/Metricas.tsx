import React from 'react';
import { Layout } from '../components/Layout';
import {
  MonoApiladas,
  MonoArea,
  MonoBarras,
  MonoDona,
  MonoKpi,
  MonoMapaCalor,
  MonoMedidor,
  MonoMosaico,
  MonoRadar,
  MonoRanking,
} from '../components/mono/MonoCharts';
import { TOTAL } from '../lib/datos';
import {
  contar,
  contarAgrupado,
  contarBooleano,
  contarMultiple,
  cruzar,
  matriz,
  metricasTitular,
  porcentaje,
  rangoFechas,
  serieTemporal,
} from '../lib/estadisticas';

export function Metricas() {
  const serie = serieTemporal();
  const secciones = contar('seccion');
  const tipos = contar('tipoEntrada');
  const modalidades = contarMultiple('modalidad');
  const estructuras = contar('estructuraSintactica');
  const sintesis = contarMultiple('sintesis');
  const deixis = contarMultiple('deixis');
  const cargaLexica = contarMultiple('cargaLexica');
  const figuras = contarMultiple('figuras');
  const adjetivacion = contar('adjetivacion');
  const polifonia = contar('polifonia');
  const actos = contarMultiple('actoHabla');
  const actosReferidos = contar('actoHablaReferido');
  const captacion = contarMultiple('captacion');
  const oralidad = contarMultiple('oralidad');
  const emojis = contar('densidadEmoji');
  const funcionEmoji = contar('funcionEmoji');
  const coherencia = contar('coherencia');
  const funciones = contarMultiple('funcionDominante');

  const convergentes = porcentaje(coherencia.find((c) => c.nombre === 'Convergente')?.valor ?? 0);
  const claros = porcentaje(contarBooleano('tieneTitularClaro'));
  const sinEmoji = porcentaje(emojis.find((c) => c.nombre === '0')?.valor ?? 0);
  const titular = metricasTitular();
  const { desde, hasta } = rangoFechas();
  const cruce = cruzar('seccion', 'coherencia');
  const calor = matriz('seccion', 'actoHablaReferido', 6, 5);

  return (
    <Layout>
      {(tema) => (
        <div className="flex flex-col gap-10">
          <header className="flex flex-col gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Dashboard de métricas</h1>
            <p className={`text-sm ${tema === 'dark' ? 'text-neutral-400' : 'text-neutral-600'}`}>
              Estadística descriptiva de los {TOTAL} titulares codificados ({desde} → {hasta}). Los porcentajes de las
              variables de opción múltiple se calculan sobre el total de titulares, por lo que pueden sumar más de 100 %.
            </p>
          </header>

          <Seccion titulo="Panorama de la muestra" tema={tema}>
            <MonoKpi
              theme={tema}
              eyebrow="Corpus analizado"
              badge="Muestra"
              valor={TOTAL}
              unidad="titulares"
              datos={serie.map((s) => ({ valor: s.valor }))}
              idGradiente="kpiCorpus"
              pieIzquierda={`${titular.palabrasMedia} palabras de media`}
              pieDerecha={`${titular.caracteresMedia} caracteres`}
            />

            <MonoArea
              theme={tema}
              eyebrow="Distribución temporal"
              badge="Serie"
              valor={serie.length}
              unidad="días con publicación"
              datos={serie}
              idGradiente="areaTemporal"
              pieIzquierda="Publicaciones por fecha"
              pieDerecha={`${desde} → ${hasta}`}
              ancho
            />

            <MonoBarras
              theme={tema}
              eyebrow="Secciones temáticas"
              badge="Cobertura"
              valor={secciones.length}
              unidad="secciones"
              datos={secciones}
              altura={280}
              pieIzquierda={`Predominio: ${secciones[0]?.nombre ?? '—'}`}
              pieDerecha={`${secciones[0]?.porcentaje ?? 0}%`}
              ancho
            />

            <MonoDona
              theme={tema}
              eyebrow="Tipo de entrada"
              badge="Formato"
              valor={tipos[0]?.porcentaje ?? 0}
              unidad={`% ${tipos[0]?.nombre ?? ''}`}
              datos={tipos}
              pieIzquierda="Formato de la publicación"
              pieDerecha={`${tipos.length} formatos`}
            />
          </Seccion>

          <Seccion titulo="Nivel sintáctico" tema={tema}>
            <MonoDona
              theme={tema}
              eyebrow="Modalidad oracional"
              badge="Sintaxis"
              valor={modalidades[0]?.porcentaje ?? 0}
              unidad={`% ${modalidades[0]?.nombre ?? ''}`}
              datos={modalidades}
              pieIzquierda="Enunciativa · interrogativa · exclamativa"
              pieDerecha={`${modalidades.length} modalidades`}
            />

            <MonoRanking
              theme={tema}
              eyebrow="Estructura sintáctica"
              badge="Ranking"
              valor={estructuras[0]?.valor ?? 0}
              unidad={`titulares ${(estructuras[0]?.nombre ?? '').toLowerCase()}`}
              datos={estructuras.slice(0, 6)}
              pieIzquierda="Frecuencia absoluta y relativa"
              pieDerecha={`${estructuras.length} tipos`}
            />

            <MonoRanking
              theme={tema}
              eyebrow="Mecanismos de síntesis"
              badge="Opción múltiple"
              valor={sintesis[0]?.porcentaje ?? 0}
              unidad="% elipsis dominante"
              datos={sintesis.slice(0, 7)}
              pieIzquierda="Economía lingüística del titular"
              pieDerecha={`${sintesis.length} mecanismos`}
              ancho
            />
          </Seccion>

          <Seccion titulo="Nivel léxico-semántico" tema={tema}>
            <MonoRanking
              theme={tema}
              eyebrow="Carga léxica"
              badge="Registro"
              valor={cargaLexica[0]?.porcentaje ?? 0}
              unidad={`% ${cargaLexica[0]?.nombre ?? ''}`}
              datos={cargaLexica}
              pieIzquierda="Estándar · coloquial · tecnicismo"
              pieDerecha={`${cargaLexica.length} registros`}
            />

            <MonoRanking
              theme={tema}
              eyebrow="Deixis"
              badge="Anclaje"
              valor={deixis[0]?.porcentaje ?? 0}
              unidad={`% ${deixis[0]?.nombre ?? ''}`}
              datos={deixis}
              pieIzquierda="Anclaje temporal, espacial y social"
              pieDerecha={`${deixis.length} tipos`}
            />

            <MonoMosaico
              theme={tema}
              eyebrow="Figuras retóricas"
              badge="Mosaico"
              valor={figuras[0]?.porcentaje ?? 0}
              unidad={`% ${figuras[0]?.nombre ?? ''}`}
              datos={figuras}
              pieIzquierda="Área proporcional a la frecuencia"
              pieDerecha={`${figuras.length} figuras`}
            />

            <MonoDona
              theme={tema}
              eyebrow="Adjetivación"
              badge="Valoración"
              valor={adjetivacion[0]?.porcentaje ?? 0}
              unidad={`% ${adjetivacion[0]?.nombre ?? ''}`}
              datos={adjetivacion}
              pieIzquierda="Calificativa vs. valorativa"
              pieDerecha={`${adjetivacion.length} categorías`}
            />
          </Seccion>

          <Seccion titulo="Nivel pragmático" tema={tema}>
            <MonoBarras
              theme={tema}
              eyebrow="Actos de habla"
              badge="Pragmática"
              valor={actos[0]?.porcentaje ?? 0}
              unidad={`% ${actos[0]?.nombre ?? ''}`}
              datos={actos}
              altura={200}
              pieIzquierda="Searle: asertivo, directivo, expresivo…"
              pieDerecha={`${actos.length} actos`}
            />

            <MonoBarras
              theme={tema}
              eyebrow="Acto de habla referido"
              badge="Searle"
              valor={actosReferidos[0]?.porcentaje ?? 0}
              unidad={`% ${actosReferidos[0]?.nombre ?? ''}`}
              datos={actosReferidos}
              altura={200}
              nota="El acto del medio es casi siempre asertivo porque informa; esta variable registra el acto de la fuente citada, que es donde se distribuyen las cinco categorías de Searle."
              pieIzquierda="Acto de la fuente citada en el titular"
              pieDerecha={`${actosReferidos.length} valores`}
            />

            <MonoRanking
              theme={tema}
              eyebrow="Estrategias de captación"
              badge="Engagement"
              valor={captacion[0]?.porcentaje ?? 0}
              unidad="% estrategia dominante"
              datos={captacion.slice(0, 7)}
              pieIzquierda="Incompleción, CTA, promesa emocional…"
              pieDerecha={`${captacion.length} estrategias`}
            />

            <MonoRanking
              theme={tema}
              eyebrow="Polifonía"
              badge="Voces"
              valor={polifonia[0]?.porcentaje ?? 0}
              unidad="% voz dominante"
              datos={polifonia.slice(0, 6)}
              pieIzquierda="Voces que enuncian el titular"
              pieDerecha={`${polifonia.length} configuraciones`}
            />

            <MonoRanking
              theme={tema}
              eyebrow="Marcas de oralidad"
              badge="Proximidad"
              valor={oralidad[0]?.porcentaje ?? 0}
              unidad={`% ${oralidad[0]?.nombre ?? ''}`}
              datos={oralidad.slice(0, 7)}
              pieIzquierda="Oralidad fingida y escritura coloquial"
              pieDerecha={`${oralidad.length} marcas`}
            />

            <MonoMapaCalor
              theme={tema}
              eyebrow="Sección × acto referido"
              badge="Mapa de calor"
              valor={calor.max}
              unidad="máximo por celda"
              filas={calor.filas}
              columnas={calor.columnas}
              celdas={calor.celdas}
              max={calor.max}
              pieIzquierda="Top 6 secciones × top 5 actos de la fuente"
              pieDerecha="Frecuencia cruzada"
              ancho
            />
          </Seccion>

          <Seccion titulo="Multimodalidad y función comunicativa" tema={tema}>
            <MonoMedidor
              theme={tema}
              eyebrow="Coherencia texto-imagen"
              badge="Convergencia"
              valor={`${convergentes}%`}
              unidad="convergentes"
              porcentajeValor={convergentes}
              etiquetaCentral="titulares convergentes"
              pieIzquierda="Relación entre gráfica y texto"
              pieDerecha={`${100 - convergentes}% divergentes`}
            />

            <MonoMedidor
              theme={tema}
              eyebrow="Claridad del titular"
              badge="Criterio"
              valor={`${claros}%`}
              unidad="con titular claro"
              porcentajeValor={claros}
              etiquetaCentral="cumplen el criterio"
              pieIzquierda="Criterio de inclusión de la muestra"
              pieDerecha={`${contarBooleano('tieneTitularClaro')}/${TOTAL}`}
            />

            <MonoDona
              theme={tema}
              eyebrow="Densidad de emojis"
              badge="Resultado constante"
              valor={sinEmoji}
              unidad="% sin emojis"
              datos={emojis}
              nota="Ningún titular del corpus incorpora emojis. El medio sí los emplea en el copy de la publicación, pero no los traslada a la gráfica del titular, que es la unidad de análisis."
              pieIzquierda="Emojis en el texto del titular"
              pieDerecha="0 de 50"
            />

            <MonoRanking
              theme={tema}
              eyebrow="Función del emoji"
              badge="Semiótica"
              valor={funcionEmoji[0]?.porcentaje ?? 0}
              unidad={`% ${funcionEmoji[0]?.nombre ?? ''}`}
              datos={funcionEmoji}
              pieIzquierda="Fática, sustitutiva, modalizadora…"
              pieDerecha={`${funcionEmoji.length} funciones`}
            />

            <MonoRadar
              theme={tema}
              eyebrow="Funciones dominantes"
              badge="Jakobson"
              valor={funciones[0]?.porcentaje ?? 0}
              unidad={`% ${funciones[0]?.nombre ?? ''}`}
              datos={funciones.slice(0, 6)}
              pieIzquierda="Presencia sobre el total de titulares"
              pieDerecha={`${funciones.length} funciones`}
            />

            <MonoApiladas
              theme={tema}
              eyebrow="Coherencia por sección"
              badge="Cruce"
              valor={cruce.datos.length}
              unidad="secciones cruzadas"
              datos={cruce.datos}
              capas={cruce.capas}
              pieIzquierda="Convergente vs. divergente"
              pieDerecha="Apilado por sección"
              ancho
            />
          </Seccion>
        </div>
      )}
    </Layout>
  );
}

function Seccion({
  titulo,
  tema,
  children,
}: {
  titulo: string;
  tema: 'dark' | 'light';
  children: React.ReactNode;
}) {
  const isDark = tema === 'dark';
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider">{titulo}</h2>
        <span className={`flex-1 h-px ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />
      </div>
      <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}
