/** Registro de una publicación analizada en la muestra de la tesis. */
export interface Registro {
  id: string;
  codigo: string;
  fecha: string;
  tipoEntrada: string;
  seccion: string;
  titular: string;
  enlace: string;
  tieneTitularClaro: boolean;
  esRepetidoSinCambios: boolean;
  esComunicadoSinEstructura: boolean;
  esPublicitario: boolean;
  sinTitularEscrito: boolean;
  modalidad: string[];
  estructuraSintactica: string;
  sintesis: string[];
  deixis: string[];
  cargaLexica: string[];
  adjetivacion: string;
  figuras: string[];
  polifonia: string;
  actoHabla: string[];
  captacion: string[];
  oralidad: string[];
  densidadEmoji: string;
  funcionEmoji: string;
  coherencia: string;
  funcionDominante: string[];
  funcionComunicativa: string;
  interpretacion: string;
  observaciones: string;
  /** Sección temática secundaria, cuando la publicación cruza dos ámbitos. */
  seccionSecundaria: string;
  /** Matiz del acto de habla ajeno a la taxonomía de Searle. */
  actoHablaMatiz: string;
  /** Acto de habla de la fuente citada, distinto del acto del medio. */
  actoHablaReferido: string;
  estructuraEspecificacion: string;
  sintesisEspecificacion: string;
  polifoniaEspecificacion: string;
  oralidadEspecificacion: string;
  adjetivacionEspecificacion: string;
  /** Encuadre temático de la estrategia de captación (macroestructura, van Dijk). */
  captacionEncuadre: string;
  /** Encuadre temático de la función dominante. */
  funcionEncuadre: string;
}

/** Definición de un campo del registro para renderizarlo y copiarlo de forma genérica. */
export interface CampoDef {
  clave: keyof Registro;
  etiqueta: string;
  grupo: string;
}
