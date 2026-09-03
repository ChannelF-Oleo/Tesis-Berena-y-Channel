import type { Registro } from './tipos';

/**
 * Instrumento de análisis del Capítulo III, transcrito desde la matriz de
 * codificación (`matriz_titulares_end.jsx`) con la que se levantó la muestra.
 * Las listas de opciones son las del instrumento cerrado, no las etiquetas
 * finalmente registradas: para eso está el dashboard de métricas.
 */

export type TipoVariable = 'unica' | 'multiple' | 'libre' | 'criterio' | 'fecha' | 'enlace';

export interface Variable {
  /** Campo correspondiente en la muestra codificada, si lo tiene. */
  clave?: keyof Registro;
  etiqueta: string;
  tipo: TipoVariable;
  ayuda?: string;
  opciones?: string[];
  /** Para los criterios de inclusión: si marcarlo excluye el titular del corpus. */
  excluye?: boolean;
}

export interface SeccionInstrumento {
  numero: number;
  titulo: string;
  descripcion: string;
  /** Objetivo específico de la tesis que operativiza esta sección. */
  objetivo?: number;
  variables: Variable[];
}

export const ETIQUETA_TIPO: Record<TipoVariable, string> = {
  unica: 'Selección única',
  multiple: 'Selección múltiple',
  libre: 'Texto libre',
  criterio: 'Criterio dicotómico',
  fecha: 'Fecha',
  enlace: 'URL',
};

const TIPOS_ENTRADA = ['Publicación', 'Reel', 'Carrusel', 'Video'];
const SECCIONES = [
  'Política', 'Económica', 'Social/Comunidad', 'Judicial', 'Cultural', 'Deportiva',
  'Tecnológica', 'Científica', 'Ambiental', 'Internacional', 'Entretenimiento',
  'Opinión', 'Interés general',
];
const MODALIDAD = ['Enunciativa', 'Interrogativa', 'Exclamativa', 'Exhortativa', 'Desiderativa', 'Dubitativa'];
const ESTRUCTURA_SINTACTICA = [
  'Simple',
  'Bimembre yuxtapuesta (dos proposiciones)',
  'Estructura con dos puntos (planteamiento + resolución)',
  'Coordinada',
  'Subordinada',
  'Enumerativa',
];
const SINTESIS = [
  'Elipsis verbal', 'Elipsis nominal', 'Elipsis de nexos/conjunciones',
  'Nominalización extrema', 'Siglas y acrónimos',
  'Síntesis referencial mediante nombres propios (hidrónimos/antropónimos)',
  'Apócope/aféresis', 'Abreviaturas', 'Sustitución icónica', 'Ninguno evidente',
];
const DEIXIS = ['Temporal', 'Espacial', 'Social', 'Ninguna evidente'];
const CARGA_LEXICA = ['Estándar', 'Coloquial/Dominicanismo', 'Tecnicismo', 'Emocional/Valorativo'];
const ADJETIVACION = ['Adjetivos calificativos', 'Adjetivos valorativos', 'Ninguna dominante'];
const FIGURAS = ['Metáfora', 'Hipérbole', 'Ironía/Sarcasmo', 'Eufemismo', 'Metonimia', 'Personificación', 'Ninguna evidente'];
const POLIFONIA = [
  'Voz monofónica institucional',
  'Voz monofónica periodística',
  'Discurso referido directo (cita textual)',
  'Discurso referido indirecto (verbo declarativo: asegura, afirma…)',
  'Polifonía interactiva (consulta/sondeo al público)',
  'Combinación de voces',
];
const ACTO_HABLA = ['Asertivo', 'Directivo', 'Expresivo', 'Compromisorio', 'Declarativo'];
const CAPTACION = [
  'Referencia informativa directa (sin ocultamiento)',
  'Incompleción informativa',
  'Promesa emocional',
  'Referencia ambigua',
  'Pregunta retórica',
  'Llamada a la acción (CTA)',
  'Ninguna evidente',
];
const ORALIDAD = [
  'Tuteo', 'Interjecciones/exclamaciones', 'Preguntas directas al lector',
  'Dominicanismos o jerga local', 'Frases hechas', 'Marcadores conversacionales', 'Ninguno evidente',
];
const DENSIDAD_EMOJI = ['0', '1–2 emojis', '3 o más emojis'];
const FUNCION_EMOJI = ['Fática', 'Sustitutiva', 'Modalizadora', 'Ornamental/Decorativa', 'No aplica'];
const COHERENCIA = ['Convergente', 'Divergente'];
const FUNCION_DOMINANTE = [
  'Informativa', 'Apelativa/Conativa', 'Emotiva/Expresiva', 'Fática',
  'Propagandística/Persuasiva', 'Interactiva (engagement)',
];

export const INSTRUMENTO: SeccionInstrumento[] = [
  {
    numero: 1,
    titulo: 'Identificación de la publicación',
    descripcion:
      'Datos de registro que sitúan cada titular en el feed y permiten volver a la publicación original.',
    variables: [
      { clave: 'codigo', etiqueta: 'Código', tipo: 'libre', ayuda: 'Identificador correlativo de la muestra (T001–T050).' },
      { clave: 'fecha', etiqueta: 'Fecha de publicación', tipo: 'fecha' },
      { clave: 'tipoEntrada', etiqueta: 'Tipo de entrada', tipo: 'unica', opciones: TIPOS_ENTRADA },
      { clave: 'seccion', etiqueta: 'Sección temática dominante', tipo: 'unica', opciones: SECCIONES },
      { clave: 'enlace', etiqueta: 'Enlace directo (Instagram)', tipo: 'enlace' },
      {
        clave: 'titular',
        etiqueta: 'Titular / texto principal analizado',
        tipo: 'libre',
        ayuda: 'Copia el texto exacto que funciona como titular, no la descripción genérica de la publicación.',
      },
    ],
  },
  {
    numero: 2,
    titulo: 'Validación del corpus',
    descripcion:
      'Criterios de inclusión y exclusión del Capítulo III. Un titular entra en el corpus si es claramente identificable y no cae en ninguno de los cuatro supuestos de exclusión.',
    variables: [
      {
        clave: 'tieneTitularClaro',
        etiqueta: 'Contiene un titular periodístico escrito y claramente identificable',
        tipo: 'criterio',
      },
      {
        clave: 'esRepetidoSinCambios',
        etiqueta: 'Es una plantilla repetida sin modificaciones relevantes (p. ej. «portada impresa de este…»)',
        tipo: 'criterio',
        excluye: true,
      },
      {
        clave: 'esComunicadoSinEstructura',
        etiqueta: 'Es un comunicado institucional sin estructura de titular',
        tipo: 'criterio',
        excluye: true,
      },
      {
        clave: 'esPublicitario',
        etiqueta: 'Es contenido publicitario, promocional o comercial',
        tipo: 'criterio',
        excluye: true,
      },
      {
        clave: 'sinTitularEscrito',
        etiqueta: 'Es un reel/video sin titular escrito verificable',
        tipo: 'criterio',
        excluye: true,
      },
    ],
  },
  {
    numero: 3,
    titulo: 'Recursos léxico-sintácticos',
    descripcion: 'Cómo se construye y se condensa el enunciado del titular.',
    objetivo: 1,
    variables: [
      { clave: 'modalidad', etiqueta: 'Modalidad oracional', tipo: 'unica', opciones: MODALIDAD },
      {
        clave: 'estructuraSintactica',
        etiqueta: 'Estructura sintáctica',
        tipo: 'unica',
        opciones: ESTRUCTURA_SINTACTICA,
        ayuda: 'Ej.: «Shakira vuelve a creer en el amor: confirma romance…» = bimembre yuxtapuesta con dos puntos.',
      },
      {
        clave: 'deixis',
        etiqueta: 'Deixis',
        tipo: 'multiple',
        opciones: DEIXIS,
        ayuda: 'Temporal (presente histórico, ya, ahora…), espacial (RD, aquí…) o social (los jóvenes, las autoridades…).',
      },
      { clave: 'cargaLexica', etiqueta: 'Carga léxica', tipo: 'multiple', opciones: CARGA_LEXICA },
      { clave: 'adjetivacion', etiqueta: 'Adjetivación', tipo: 'unica', opciones: ADJETIVACION },
      { clave: 'sintesis', etiqueta: 'Fenómenos de síntesis', tipo: 'multiple', opciones: SINTESIS },
      { clave: 'figuras', etiqueta: 'Figuras retóricas', tipo: 'multiple', opciones: FIGURAS },
    ],
  },
  {
    numero: 4,
    titulo: 'Actos de habla y presuposición',
    descripcion: 'Qué hace el titular como acción verbal y con qué mecanismos orienta la interpretación del lector.',
    objetivo: 2,
    variables: [
      { clave: 'polifonia', etiqueta: 'Polifonía', tipo: 'unica', opciones: POLIFONIA },
      { clave: 'actoHabla', etiqueta: 'Acto de habla', tipo: 'unica', opciones: ACTO_HABLA },
      {
        clave: 'captacion',
        etiqueta: 'Estrategia de captación / presuposición',
        tipo: 'multiple',
        opciones: CAPTACION,
      },
    ],
  },
  {
    numero: 5,
    titulo: 'Oralidad fingida y coloquialismo',
    descripcion: 'Marcas de proximidad comunicativa que simulan la conversación con el usuario.',
    objetivo: 3,
    variables: [
      { clave: 'oralidad', etiqueta: 'Rasgos de oralidad fingida presentes', tipo: 'multiple', opciones: ORALIDAD },
    ],
  },
  {
    numero: 6,
    titulo: 'Multimodalidad',
    descripcion: 'Relación entre el componente lingüístico y los elementos no verbales de la publicación.',
    objetivo: 4,
    variables: [
      { clave: 'densidadEmoji', etiqueta: 'Densidad de emojis', tipo: 'unica', opciones: DENSIDAD_EMOJI },
      { clave: 'funcionEmoji', etiqueta: 'Función del emoji', tipo: 'unica', opciones: FUNCION_EMOJI },
      { clave: 'coherencia', etiqueta: 'Coherencia texto–imagen', tipo: 'unica', opciones: COHERENCIA },
    ],
  },
  {
    numero: 7,
    titulo: 'Interpretación',
    descripcion: 'Síntesis analítica de cada ficha, donde se integra lo observado en las categorías anteriores.',
    variables: [
      { clave: 'funcionDominante', etiqueta: 'Función dominante', tipo: 'multiple', opciones: FUNCION_DOMINANTE },
      {
        clave: 'funcionComunicativa',
        etiqueta: 'Matiz / función comunicativa',
        tipo: 'libre',
        ayuda: 'Ej.: «Informativa y apelativa (captación referencial)».',
      },
      { clave: 'interpretacion', etiqueta: 'Interpretación', tipo: 'libre' },
      { clave: 'observaciones', etiqueta: 'Observaciones críticas', tipo: 'libre' },
    ],
  },
];

export const TOTAL_VARIABLES = INSTRUMENTO.reduce((n, s) => n + s.variables.length, 0);
