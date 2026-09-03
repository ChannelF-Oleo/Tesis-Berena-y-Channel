# Titulares en Instagram — plataforma de la tesis

Sitio en React que presenta la muestra codificada de la tesis *«Análisis de las estrategias
lingüísticas y pragmáticas en los titulares del periódico El Nuevo Diario: el caso de su feed de
Instagram (julio 2025 – febrero 2026)»*.

## Puesta en marcha

```bash
cd web
npm install     # solo la primera vez
npm run dev     # http://localhost:5173
npm run build   # genera dist/ para publicar
npm run preview # sirve dist/ en http://localhost:4173
```

## Vistas

| Ruta             | Contenido                                                                       |
| ---------------- | ------------------------------------------------------------------------------- |
| `/`              | Inicio: título, objetivo general, objetivos específicos y cifras de la muestra.  |
| `/tabla.html`    | Tabla de los 50 titulares. Filas desplegables con captura + ficha de análisis.   |
| `/metricas.html` | Dashboard de estadística descriptiva con **Mono Charts**.                        |
| `/instrumento.html` | Matriz de codificación del Capítulo III: 29 variables en 7 bloques.          |

### Navegación instantánea

Es un sitio **multipágina** (una entrada HTML por vista). Cada `<head>` incluye
`<script type="speculationrules">` que **prerenderiza** de inmediato las dos vistas hermanas más
probables y, con `eagerness: moderate`, cualquier otra al pasar el cursor por su enlace, así que al pulsar el navbar la página ya está lista. En navegadores sin soporte
(Firefox, Safari) la navegación es la normal, sin degradación visual.

## Actualizar los datos

- **Muestra:** el archivo real vive en `../Datos/gemini-code-*.json` y está enlazado como
  `src/data/muestra.json`. Si cambias el nombre del JSON, recrea el enlace:

  ```bash
  ln -sfn ../../../Datos/NUEVO-ARCHIVO.json src/data/muestra.json
  ```

- **Capturas:** guarda cada imagen como `CÓDIGO.png` (por ejemplo `T004.png`) dentro de
  `../Captura Titulares/`, que está enlazada como `public/capturas`. Las filas cuya captura aún no
  existe muestran el aviso «Captura pendiente»; en cuanto añadas el archivo aparecerá sola.

> Como el proyecto usa enlaces simbólicos hacia `Datos/` y `Captura Titulares/`, **no muevas esas
> dos carpetas** de la raíz del repositorio.

## Copiado

Todos los datos son copiables: código, titular, enlace y cada campo de la ficha tienen su botón
de copiar, y el botón «Copiar» de la cabecera de la ficha lleva el registro completo al
portapapeles. El enlace, además, es un `<a>` real que abre la publicación en Instagram.

## Gráficos — Mono Charts

Los gráficos son los componentes **Mono Charts** de [Amicro](https://amicro.vercel.app/mono-charts)
(Subhan-code), construidos sobre Recharts. Los originales traen datos de ejemplo fijos, así que se
vendorizaron en `src/components/mono/` y se adaptaron para recibir los datos de la tesis por props,
conservando la estética monocromática (radio 24 px, píldoras redondeadas, tipografía mono en los pies).

- `MonoCard` — carcasa común de tarjeta.
- `MonoBarras`, `MonoDona`, `MonoArea`, `MonoApiladas`, `MonoRadar`, `MonoMosaico`,
  `MonoMedidor`, `MonoMapaCalor`, `MonoRanking`, `MonoKpi`.

Las estadísticas se calculan en `src/lib/estadisticas.ts` a partir del JSON: los porcentajes de las
variables de opción múltiple se calculan sobre el total de titulares y por eso pueden sumar más de 100 %.

## Estructura

```
web/
├── index.html · tabla.html · metricas.html   entradas MPA + speculation rules
├── public/capturas -> ../../Captura Titulares
└── src/
    ├── entries/     puntos de montaje de React (uno por página)
    ├── pages/       Inicio · Tabla · Metricas · Instrumento
    ├── components/  Layout, BotonCopiar y mono/ (Mono Charts adaptados)
    ├── hooks/       useTema, useCopiar, useIsMobile
    ├── lib/         datos.ts (carga y campos), estadisticas.ts, instrumento.ts, tipos.ts
    └── data/muestra.json -> ../../../Datos/gemini-code-*.json
```
