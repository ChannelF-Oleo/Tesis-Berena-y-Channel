import { registros, TOTAL } from './datos';
import type { Registro } from './tipos';

export interface Conteo {
  nombre: string;
  valor: number;
  porcentaje: number;
}

const colador = (a: Conteo, b: Conteo) => b.valor - a.valor || a.nombre.localeCompare(b.nombre, 'es');

/** Frecuencia de un campo simple (string). */
export function contar(clave: keyof Registro, base = TOTAL): Conteo[] {
  const mapa = new Map<string, number>();
  for (const r of registros) {
    const v = String(r[clave] ?? '').trim();
    if (!v) continue;
    mapa.set(v, (mapa.get(v) ?? 0) + 1);
  }
  return [...mapa].map(([nombre, valor]) => ({
    nombre,
    valor,
    porcentaje: Math.round((valor / base) * 1000) / 10,
  })).sort(colador);
}

/** Frecuencia de un campo de opción múltiple (array). El porcentaje es sobre el total de titulares. */
export function contarMultiple(clave: keyof Registro, base = TOTAL): Conteo[] {
  const mapa = new Map<string, number>();
  for (const r of registros) {
    const lista = r[clave];
    if (!Array.isArray(lista)) continue;
    for (const v of lista) {
      const t = String(v).trim();
      if (!t) continue;
      mapa.set(t, (mapa.get(t) ?? 0) + 1);
    }
  }
  return [...mapa].map(([nombre, valor]) => ({
    nombre,
    valor,
    porcentaje: Math.round((valor / base) * 1000) / 10,
  })).sort(colador);
}

/** Cuenta cuántos registros cumplen un criterio booleano. */
export function contarBooleano(clave: keyof Registro): number {
  return registros.filter((r) => r[clave] === true).length;
}

export function porcentaje(n: number, base = TOTAL): number {
  return base === 0 ? 0 : Math.round((n / base) * 1000) / 10;
}

/** Serie temporal: publicaciones por fecha, ordenada cronológicamente. */
export function serieTemporal(): { label: string; valor: number }[] {
  const mapa = new Map<string, number>();
  for (const r of registros) mapa.set(r.fecha, (mapa.get(r.fecha) ?? 0) + 1);
  return [...mapa]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([fecha, valor]) => ({ label: fecha.slice(5).replace('-', '/'), valor }));
}

/** Tabla cruzada entre dos campos simples, lista para un gráfico apilado. */
export function cruzar(
  claveEje: keyof Registro,
  claveCapa: keyof Registro,
): { datos: Record<string, string | number>[]; capas: string[] } {
  const ejes = new Map<string, Map<string, number>>();
  const capas = new Set<string>();
  for (const r of registros) {
    const eje = String(r[claveEje] ?? '').trim();
    const capa = String(r[claveCapa] ?? '').trim();
    if (!eje || !capa) continue;
    capas.add(capa);
    if (!ejes.has(eje)) ejes.set(eje, new Map());
    const fila = ejes.get(eje)!;
    fila.set(capa, (fila.get(capa) ?? 0) + 1);
  }
  const listaCapas = [...capas].sort((a, b) => a.localeCompare(b, 'es'));
  const datos = [...ejes]
    .map(([eje, fila]) => {
      const punto: Record<string, string | number> = { label: eje };
      let total = 0;
      for (const capa of listaCapas) {
        const v = fila.get(capa) ?? 0;
        punto[capa] = v;
        total += v;
      }
      punto.__total = total;
      return punto;
    })
    .sort((a, b) => Number(b.__total) - Number(a.__total));
  return { datos, capas: listaCapas };
}

/** Matriz de frecuencias entre un campo simple y uno múltiple, para el mapa de calor. */
export function matriz(
  claveFila: keyof Registro,
  claveColumna: keyof Registro,
  maxFilas = 6,
  maxColumnas = 5,
): { filas: string[]; columnas: string[]; celdas: number[][]; max: number } {
  const filasTop = contar(claveFila).slice(0, maxFilas).map((c) => c.nombre);
  const colsTop = contar(claveColumna).slice(0, maxColumnas).map((c) => c.nombre);
  const celdas = filasTop.map((f) =>
    colsTop.map((c) => registros.filter((r) => r[claveFila] === f && r[claveColumna] === c).length),
  );
  const max = Math.max(1, ...celdas.flat());
  return { filas: filasTop, columnas: colsTop, celdas, max };
}

/** Longitud media de los titulares en palabras y caracteres. */
export function metricasTitular() {
  const palabras = registros.map((r) => r.titular.trim().split(/\s+/).filter(Boolean).length);
  const caracteres = registros.map((r) => r.titular.trim().length);
  const media = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
  return {
    palabrasMedia: Math.round(media(palabras) * 10) / 10,
    caracteresMedia: Math.round(media(caracteres)),
    palabrasMin: Math.min(...palabras),
    palabrasMax: Math.max(...palabras),
  };
}

export function rangoFechas(): { desde: string; hasta: string } {
  const fechas = registros.map((r) => r.fecha).sort();
  return { desde: fechas[0], hasta: fechas[fechas.length - 1] };
}
