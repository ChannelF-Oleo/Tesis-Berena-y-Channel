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
  modalidad: string;
  estructuraSintactica: string;
  sintesis: string[];
  deixis: string[];
  cargaLexica: string[];
  adjetivacion: string;
  figuras: string[];
  polifonia: string;
  actoHabla: string;
  captacion: string[];
  oralidad: string[];
  densidadEmoji: string;
  funcionEmoji: string;
  coherencia: string;
  funcionDominante: string[];
  funcionComunicativa: string;
  interpretacion: string;
  observaciones: string;
}

/** Definición de un campo del registro para renderizarlo y copiarlo de forma genérica. */
export interface CampoDef {
  clave: keyof Registro;
  etiqueta: string;
  grupo: string;
}
