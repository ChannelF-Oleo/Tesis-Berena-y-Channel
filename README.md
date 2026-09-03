# Tesis · Titulares de El Nuevo Diario en Instagram

Repositorio de la tesis de grado **«Análisis de las estrategias lingüísticas y pragmáticas en los
titulares del periódico El Nuevo Diario: el caso de su feed de Instagram (julio 2025 – febrero
2026)»**, presentada en la Escuela de Letras de la Facultad de Humanidades de la Universidad
Autónoma de Santo Domingo (UASD) para optar por el título de Licenciatura en Letras Puras.

**Sustentantes:** Channel Feliz de Oleo · Berena Lisbeth Figuereo Fortuna
**Asesora:** Mtra. Alma Rosa Mejía

## Contenido

| Carpeta             | Descripción                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| `Datos/`            | Muestra codificada: 50 titulares (T001–T050) con sus 30 variables de análisis. |
| `Captura Titulares/`| Captura de pantalla de cada publicación, nombrada por código (`T001.png`–`T050.png`). |
| `matriz_titulares_end.jsx` | Matriz de codificación con la que se levantó la muestra.                |
| `web/`              | Plataforma web en React para consultar la muestra y sus métricas.              |

El documento de la tesis no forma parte de este repositorio.

## La plataforma web

```bash
cd web
npm install
npm run dev     # http://localhost:5173
```

Cuatro vistas: **Inicio** (presentación de la investigación), **Tabla** (los 50 titulares con filas
desplegables que muestran la captura junto a la ficha completa de análisis, con todos los datos
copiables), **Métricas** (dashboard de estadística descriptiva) e **Instrumento** (la matriz de
codificación del Capítulo III con sus 29 variables).

Detalles de arquitectura, cómo actualizar la muestra y cómo añadir capturas: [`web/README.md`](web/README.md).
