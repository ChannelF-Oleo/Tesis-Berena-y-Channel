import type { Registro } from './tipos';

/**
 * Instrumento de análisis del Capítulo III, en su versión ampliada tras la
 * auditoría de la muestra. Las listas cerradas incorporan las categorías que el
 * corpus demostró necesarias; las opciones definidas que no aparecieron en esta
 * muestra se conservan marcadas como no observadas.
 */

export type TipoVariable = 'unica' | 'multiple' | 'libre' | 'criterio' | 'fecha' | 'enlace';

export interface Variable {
  clave?: keyof Registro;
  etiqueta: string;
  tipo: TipoVariable;
  ayuda?: string;
  opciones?: string[];
  /** Opciones del instrumento que ningún titular de la muestra recibió. */
  noObservadas?: string[];
  /** Variable incorporada tras la auditoría. */
  nueva?: boolean;
  excluye?: boolean;
}

export interface SeccionInstrumento {
  numero: number;
  titulo: string;
  descripcion: string;
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

/** Regla que gobierna toda la codificación (Capítulo III). */
export const UNIDAD_ANALISIS = {
  titulo: 'Unidad de análisis',
  cuerpo:
    'Las variables cerradas se codifican únicamente sobre el texto del titular. El copy de la publicación, la imagen y los comentarios pueden citarse en la interpretación y en las observaciones para contextualizar, pero no sostienen por sí solos el valor de una categoría.',
  corolario:
    'Una variable puede resultar constante. Que el medio no emplee emojis en sus titulares no es un vacío del análisis: es un resultado sobre este medio en este periodo.',
};

export const INSTRUMENTO: SeccionInstrumento[] = [
  {
    numero: 1,
    titulo: 'Identificación de la publicación',
    descripcion:
      'Datos de registro que sitúan cada titular en el feed y permiten volver a la publicación original.',
    variables: [
      { clave: 'codigo', etiqueta: 'Código', tipo: 'libre', ayuda: 'Identificador correlativo de la muestra (T001–T050).' },
      { clave: 'fecha', etiqueta: 'Fecha de publicación', tipo: 'fecha' },
      {
        clave: 'tipoEntrada',
        etiqueta: 'Tipo de entrada',
        tipo: 'unica',
        opciones: ['Publicación', 'Reel', 'Carrusel'],
        ayuda: 'La opción «Video» se retiró del instrumento: Instagram fusionó ese formato dentro de Reels en 2022, de modo que no puede darse en el periodo estudiado.',
      },
      {
        clave: 'seccion',
        etiqueta: 'Sección temática dominante',
        tipo: 'unica',
        opciones: [
          'Política', 'Económica', 'Social/Comunidad', 'Judicial', 'Cultural', 'Deportiva',
          'Tecnológica', 'Científica', 'Ambiental', 'Internacional', 'Entretenimiento',
          'Educativa', 'Nacionales', 'Opinión', 'Interés general',
        ],
        noObservadas: ['Cultural', 'Tecnológica', 'Científica', 'Opinión', 'Interés general'],
      },
      {
        clave: 'seccionSecundaria',
        etiqueta: 'Sección temática secundaria',
        tipo: 'unica',
        nueva: true,
        ayuda: 'Se registra cuando la publicación cruza dos ámbitos. Antes se codificaba fundida con la dominante («Economía/Turismo»), lo que impedía agregar por sección.',
        opciones: ['Finanzas', 'Turismo', 'Cultural', 'Gremial', 'Humanas', 'Corporativo'],
      },
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
      { clave: 'tieneTitularClaro', etiqueta: 'Contiene un titular periodístico escrito y claramente identificable', tipo: 'criterio' },
      { clave: 'esRepetidoSinCambios', etiqueta: 'Es una plantilla repetida sin modificaciones relevantes (p. ej. «portada impresa de este…»)', tipo: 'criterio', excluye: true },
      { clave: 'esComunicadoSinEstructura', etiqueta: 'Es un comunicado institucional sin estructura de titular', tipo: 'criterio', excluye: true },
      { clave: 'esPublicitario', etiqueta: 'Es contenido publicitario, promocional o comercial', tipo: 'criterio', excluye: true },
      { clave: 'sinTitularEscrito', etiqueta: 'Es un reel/video sin titular escrito verificable', tipo: 'criterio', excluye: true },
    ],
  },
  {
    numero: 3,
    titulo: 'Recursos léxico-sintácticos',
    descripcion:
      'Cómo se construye y se condensa el enunciado. Opera con la Teoría de la Relevancia: la reducción sintáctica minimiza el esfuerzo cognitivo del lector en el scroll.',
    objetivo: 1,
    variables: [
      {
        clave: 'modalidad',
        etiqueta: 'Modalidad oracional',
        tipo: 'multiple',
        opciones: ['Enunciativa', 'Interrogativa', 'Exclamativa', 'Exhortativa', 'Desiderativa', 'Dubitativa'],
        noObservadas: ['Exclamativa', 'Desiderativa', 'Dubitativa'],
        ayuda: 'Selección múltiple: un titular puede combinar dos modalidades. La exclamativa se reconoce por el signo, por palabra exclamativa (qué, cuánto, cómo, quién, cuán) o por énfasis tipográfico sostenido, no solo por la puntuación.',
      },
      {
        clave: 'estructuraSintactica',
        etiqueta: 'Estructura sintáctica',
        tipo: 'unica',
        opciones: [
          'Simple', 'Coordinada', 'Subordinada', 'Bimembre yuxtapuesta (dos proposiciones)',
          'Estructura con dos puntos (planteamiento + resolución)', 'Nominal (sin verbo)', 'Enumerativa',
        ],
        noObservadas: ['Enumerativa'],
      },
      {
        clave: 'estructuraEspecificacion',
        etiqueta: 'Especificación de la estructura',
        tipo: 'libre',
        nueva: true,
        ayuda: 'Matiz concreto: «con cita directa», «coordinada copulativa», «forma impersonal».',
      },
      {
        clave: 'deixis',
        etiqueta: 'Deixis',
        tipo: 'multiple',
        opciones: [
          'Temporal', 'Espacial', 'Social', 'Institucional', 'Geopolítica', 'Ideológica',
          'Partidaria', 'Penal', 'Valorativa', 'Continental', 'Ninguna evidente',
        ],
        noObservadas: ['Ninguna evidente'],
        ayuda: '«Institucional» y «Geopolítica» se incorporaron tras la auditoría: la primera es la marca deíctica más frecuente de todo el corpus.',
      },
      {
        clave: 'cargaLexica',
        etiqueta: 'Carga léxica',
        tipo: 'multiple',
        opciones: [
          'Estándar', 'Culta', 'Coloquial/Dominicanismo', 'Emocional/Valorativo', 'Sensacionalista',
          'Tecnicismo', 'Técnico-legal', 'Técnico-jurídico', 'Técnico-deportivo',
        ],
      },
      {
        clave: 'adjetivacion',
        etiqueta: 'Adjetivación',
        tipo: 'unica',
        opciones: ['Adjetivos calificativos', 'Adjetivos valorativos', 'Ninguna dominante'],
      },
      { clave: 'adjetivacionEspecificacion', etiqueta: 'Especificación de la adjetivación', tipo: 'libre', nueva: true },
      {
        clave: 'sintesis',
        etiqueta: 'Fenómenos de síntesis',
        tipo: 'multiple',
        opciones: [
          'Elipsis nominal', 'Elipsis verbal', 'Elipsis de nexos/conjunciones', 'Nominalización',
          'Sustantivación', 'Siglas y acrónimos', 'Abreviaturas', 'Apócope/aféresis',
          'Síntesis referencial mediante nombres propios (hidrónimos/antropónimos)',
          'Cita directa entrecomillada', 'Comillas denominativas', 'Estructura bimembre',
          'Yuxtaposición', 'Condensación', 'Anteposición de complemento', 'Impersonalidad sintáctica',
          'Personificación sintáctica', 'Modulación modal', 'Atribución de fuente',
          'Títulos honoríficos', 'Locución ponderativa', 'Uso catafórico',
          'Participio en función adjetiva', 'Sustitución icónica', 'Ninguno evidente',
        ],
        noObservadas: ['Apócope/aféresis', 'Sustitución icónica'],
      },
      {
        clave: 'sintesisEspecificacion',
        etiqueta: 'Especificación de la síntesis',
        tipo: 'libre',
        nueva: true,
        ayuda: 'Instancia concreta: la sigla desarrollada (PLD, USCIS), la palabra elidida, la expresión condensada.',
      },
      {
        clave: 'figuras',
        etiqueta: 'Figuras retóricas',
        tipo: 'multiple',
        opciones: [
          'Metáfora', 'Hipérbole', 'Ironía/Sarcasmo', 'Eufemismo', 'Metonimia',
          'Personificación', 'Antítesis', 'Paradoja', 'Ninguna evidente',
        ],
      },
    ],
  },
  {
    numero: 4,
    titulo: 'Actos de habla y presuposición',
    descripcion:
      'Qué hace el titular como acción verbal y con qué mecanismos orienta la interpretación del lector, según la taxonomía de Austin y Searle.',
    objetivo: 2,
    variables: [
      {
        clave: 'polifonia',
        etiqueta: 'Polifonía',
        tipo: 'unica',
        opciones: [
          'Voz monofónica institucional', 'Voz monofónica periodística',
          'Discurso referido directo (cita textual)', 'Discurso referido indirecto (verbo declarativo)',
          'Polifonía interactiva (consulta/sondeo al público)', 'Combinación de voces',
        ],
      },
      {
        clave: 'polifoniaEspecificacion',
        etiqueta: 'Especificación de la polifonía',
        tipo: 'libre',
        nueva: true,
        ayuda: 'Fuente concreta y verbo empleado: «cita presidencial», «fuente judicial», «agencia internacional (AFP)».',
      },
      {
        clave: 'actoHabla',
        etiqueta: 'Acto de habla del medio',
        tipo: 'multiple',
        opciones: ['Asertivo', 'Directivo', 'Expresivo', 'Compromisorio', 'Declarativo'],
        noObservadas: ['Expresivo', 'Declarativo'],
        ayuda: 'Acto ilocutivo que realiza el periódico al titular. «Comisivo» y «compromisorio» traducen el mismo commissive de Searle; se adopta la forma del instrumento. Es múltiple porque un titular puede realizar dos actos a la vez.',
      },
      {
        clave: 'actoHablaMatiz',
        etiqueta: 'Matiz del acto de habla',
        tipo: 'libre',
        nueva: true,
        ayuda: 'Valor añadido ajeno a la taxonomía de Searle: «con carga evaluativa», «con valor admonitorio».',
      },
      {
        clave: 'actoHablaReferido',
        etiqueta: 'Acto de habla referido',
        tipo: 'unica',
        nueva: true,
        opciones: ['Asertivo', 'Directivo', 'Expresivo', 'Compromisorio', 'Declarativo', 'No aplica'],
        ayuda: 'Acto de la fuente citada, distinto del acto del medio. El periódico siempre informa —es asertivo—, pero la fuente que cita puede prometer, pedir, agradecer o declarar. Sin esta variable, tres de las cinco categorías de Searle quedaban vacías.',
      },
      {
        clave: 'captacion',
        etiqueta: 'Estrategia de captación / presuposición',
        tipo: 'multiple',
        opciones: [
          'Referencia informativa directa (sin ocultamiento)', 'Incompleción informativa',
          'Promesa emocional', 'Referencia ambigua', 'Pregunta retórica', 'Llamada a la acción (CTA)',
          'Sensacionalismo', 'Oralidad fingida', 'Promoción institucional', 'Apelación identitaria',
          'Ninguna evidente',
        ],
        noObservadas: ['Referencia ambigua', 'Ninguna evidente'],
      },
      {
        clave: 'captacionEncuadre',
        etiqueta: 'Encuadre temático de la captación',
        tipo: 'libre',
        nueva: true,
        ayuda: 'Tema con el que se ejerce la estrategia («escándalo político», «rivalidad deportiva»). Es macroestructura semántica del ACD, no una estrategia en sí.',
      },
    ],
  },
  {
    numero: 5,
    titulo: 'Oralidad fingida y coloquialismo',
    descripcion:
      'Marcas de proximidad comunicativa que simulan la conversación, en el sentido de la inmediatez comunicativa de Koch y Oesterreicher.',
    objetivo: 3,
    variables: [
      {
        clave: 'oralidad',
        etiqueta: 'Rasgos de oralidad fingida presentes',
        tipo: 'multiple',
        opciones: [
          'Tuteo', 'Interjecciones/exclamaciones', 'Preguntas directas al lector',
          'Dominicanismos o jerga local', 'Frases hechas', 'Marcadores conversacionales',
          'Léxico coloquial', 'Metáforas del habla popular', 'Sintaxis oral popular', 'Ninguno evidente',
        ],
        noObservadas: ['Tuteo', 'Interjecciones/exclamaciones'],
        ayuda: 'Solo cuentan las marcas presentes en el texto del titular. El medio despliega tuteo y jerga en el copy pero no los traslada a la gráfica: esa separación de registros es un resultado del estudio.',
      },
      {
        clave: 'oralidadEspecificacion',
        etiqueta: 'Especificación de la oralidad',
        tipo: 'libre',
        nueva: true,
        ayuda: 'La expresión concreta registrada: «de milagro», «tarde o temprano».',
      },
    ],
  },
  {
    numero: 6,
    titulo: 'Multimodalidad',
    descripcion:
      'Relación entre el componente lingüístico y los elementos no verbales, en el marco de Kress, van Leeuwen y Yus.',
    objetivo: 4,
    variables: [
      {
        clave: 'densidadEmoji',
        etiqueta: 'Densidad de emojis',
        tipo: 'unica',
        opciones: ['0', '1–2 emojis', '3 o más emojis'],
        noObservadas: ['1–2 emojis', '3 o más emojis'],
        ayuda: 'Emojis en el texto del titular. El resultado es constante en cero para toda la muestra.',
      },
      {
        clave: 'funcionEmoji',
        etiqueta: 'Función del emoji',
        tipo: 'unica',
        opciones: ['Fática', 'Sustitutiva', 'Modalizadora', 'Ornamental/Decorativa', 'No aplica'],
        noObservadas: ['Fática', 'Sustitutiva', 'Modalizadora', 'Ornamental/Decorativa'],
      },
      {
        clave: 'coherencia',
        etiqueta: 'Coherencia texto–imagen',
        tipo: 'unica',
        opciones: ['Convergente', 'Divergente'],
        noObservadas: ['Divergente'],
        ayuda: 'Única variable relacional del instrumento: pone el titular en relación con la gráfica que lo aloja.',
      },
    ],
  },
  {
    numero: 7,
    titulo: 'Interpretación',
    descripcion:
      'Síntesis analítica de cada ficha. Es el único lugar donde el copy, la imagen y los comentarios pueden citarse, siempre como contexto.',
    variables: [
      {
        clave: 'funcionDominante',
        etiqueta: 'Función dominante',
        tipo: 'multiple',
        opciones: [
          'Informativa', 'Apelativa/Conativa', 'Emotiva/Expresiva', 'Fática',
          'Propagandística/Persuasiva', 'Interactiva (engagement)',
        ],
        noObservadas: ['Fática'],
      },
      {
        clave: 'funcionEncuadre',
        etiqueta: 'Encuadre temático',
        tipo: 'libre',
        nueva: true,
        ayuda: 'Tema global bajo el que se ejerce la función: «fiscalización política», «agenda gubernamental». Macroestructura semántica en el sentido de van Dijk.',
      },
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
export const TOTAL_NUEVAS = INSTRUMENTO.reduce((n, s) => n + s.variables.filter((v) => v.nueva).length, 0);
