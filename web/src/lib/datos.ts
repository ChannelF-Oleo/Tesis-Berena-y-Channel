import type { CampoDef, Registro } from './tipos';

/**
 * La muestra vive en `../Datos` (enlazada simbólicamente como `src/data/muestra.json`),
 * así que basta con reemplazar ese archivo para actualizar toda la web.
 */
import muestraJson from '../data/muestra.json';

export const registros: Registro[] = (muestraJson as Registro[])
  .slice()
  .sort((a, b) => a.codigo.localeCompare(b.codigo, 'es', { numeric: true }));

export const TOTAL = registros.length;

/** Campos que se muestran en el panel desplegable, agrupados por dimensión de análisis. */
export const CAMPOS: CampoDef[] = [
  { clave: 'codigo', etiqueta: 'Código', grupo: 'Identificación' },
  { clave: 'fecha', etiqueta: 'Fecha', grupo: 'Identificación' },
  { clave: 'tipoEntrada', etiqueta: 'Tipo de entrada', grupo: 'Identificación' },
  { clave: 'seccion', etiqueta: 'Sección', grupo: 'Identificación' },
  { clave: 'seccionSecundaria', etiqueta: 'Sección secundaria', grupo: 'Identificación' },
  { clave: 'titular', etiqueta: 'Titular', grupo: 'Identificación' },
  { clave: 'enlace', etiqueta: 'Enlace', grupo: 'Identificación' },

  { clave: 'tieneTitularClaro', etiqueta: 'Tiene titular claro', grupo: 'Criterios de inclusión' },
  { clave: 'esRepetidoSinCambios', etiqueta: 'Repetido sin cambios', grupo: 'Criterios de inclusión' },
  { clave: 'esComunicadoSinEstructura', etiqueta: 'Comunicado sin estructura', grupo: 'Criterios de inclusión' },
  { clave: 'esPublicitario', etiqueta: 'Publicitario', grupo: 'Criterios de inclusión' },
  { clave: 'sinTitularEscrito', etiqueta: 'Sin titular escrito', grupo: 'Criterios de inclusión' },

  { clave: 'modalidad', etiqueta: 'Modalidad', grupo: 'Nivel sintáctico' },
  { clave: 'estructuraSintactica', etiqueta: 'Estructura sintáctica', grupo: 'Nivel sintáctico' },
  { clave: 'estructuraEspecificacion', etiqueta: 'Especificación de la estructura', grupo: 'Nivel sintáctico' },
  { clave: 'sintesis', etiqueta: 'Mecanismos de síntesis', grupo: 'Nivel sintáctico' },
  { clave: 'sintesisEspecificacion', etiqueta: 'Especificación de la síntesis', grupo: 'Nivel sintáctico' },

  { clave: 'deixis', etiqueta: 'Deixis', grupo: 'Nivel léxico-semántico' },
  { clave: 'cargaLexica', etiqueta: 'Carga léxica', grupo: 'Nivel léxico-semántico' },
  { clave: 'adjetivacion', etiqueta: 'Adjetivación', grupo: 'Nivel léxico-semántico' },
  { clave: 'adjetivacionEspecificacion', etiqueta: 'Especificación de la adjetivación', grupo: 'Nivel léxico-semántico' },
  { clave: 'figuras', etiqueta: 'Figuras retóricas', grupo: 'Nivel léxico-semántico' },

  { clave: 'polifonia', etiqueta: 'Polifonía', grupo: 'Nivel pragmático' },
  { clave: 'polifoniaEspecificacion', etiqueta: 'Especificación de la polifonía', grupo: 'Nivel pragmático' },
  { clave: 'actoHabla', etiqueta: 'Acto de habla del medio', grupo: 'Nivel pragmático' },
  { clave: 'actoHablaMatiz', etiqueta: 'Matiz del acto de habla', grupo: 'Nivel pragmático' },
  { clave: 'actoHablaReferido', etiqueta: 'Acto de habla referido', grupo: 'Nivel pragmático' },
  { clave: 'captacion', etiqueta: 'Estrategias de captación', grupo: 'Nivel pragmático' },
  { clave: 'captacionEncuadre', etiqueta: 'Encuadre de la captación', grupo: 'Nivel pragmático' },
  { clave: 'oralidad', etiqueta: 'Marcas de oralidad', grupo: 'Nivel pragmático' },
  { clave: 'oralidadEspecificacion', etiqueta: 'Especificación de la oralidad', grupo: 'Nivel pragmático' },

  { clave: 'densidadEmoji', etiqueta: 'Densidad de emojis', grupo: 'Multimodalidad' },
  { clave: 'funcionEmoji', etiqueta: 'Función del emoji', grupo: 'Multimodalidad' },
  { clave: 'coherencia', etiqueta: 'Coherencia texto-imagen', grupo: 'Multimodalidad' },

  { clave: 'funcionDominante', etiqueta: 'Funciones dominantes', grupo: 'Función comunicativa' },
  { clave: 'funcionEncuadre', etiqueta: 'Encuadre temático', grupo: 'Función comunicativa' },
  { clave: 'funcionComunicativa', etiqueta: 'Función comunicativa', grupo: 'Función comunicativa' },
  { clave: 'interpretacion', etiqueta: 'Interpretación', grupo: 'Análisis' },
  { clave: 'observaciones', etiqueta: 'Observaciones', grupo: 'Análisis' },
];

export const GRUPOS = CAMPOS.reduce<string[]>((acc, c) => {
  if (!acc.includes(c.grupo)) acc.push(c.grupo);
  return acc;
}, []);

/** Devuelve el valor de un campo como texto plano listo para copiar. */
export function valorATexto(valor: Registro[keyof Registro]): string {
  if (Array.isArray(valor)) return valor.join(', ');
  if (typeof valor === 'boolean') return valor ? 'Sí' : 'No';
  return String(valor ?? '');
}

/** Serializa un registro completo para el botón «copiar toda la fila». */
export function registroATexto(r: Registro): string {
  return CAMPOS.map((c) => `${c.etiqueta}: ${valorATexto(r[c.clave])}`).join('\n');
}

/** Ruta de la captura del titular. Las imágenes se sirven desde «Captura Titulares». */
export function rutaCaptura(codigo: string): string {
  return `/capturas/${codigo}.png`;
}

export function formatearFecha(iso: string): string {
  const [a, m, d] = iso.split('-').map(Number);
  if (!a || !m || !d) return iso;
  const meses = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
  return `${d} de ${meses[m - 1]} de ${a}`;
}
