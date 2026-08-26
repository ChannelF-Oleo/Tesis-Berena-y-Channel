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
| `Captura Titulares/`| Capturas de pantalla de cada publicación, nombradas por código (`T001.png`).   |
| `web/`              | Plataforma web en React para consultar la muestra y sus métricas.              |

El documento de la tesis no forma parte de este repositorio.

## La plataforma web

```bash
cd web
npm install
npm run dev     # http://localhost:5173
```

Tres vistas: **Inicio** (presentación de la investigación), **Tabla** (los 50 titulares con filas
desplegables que muestran la captura junto a la ficha completa de análisis, con todos los datos
copiables) y **Métricas** (dashboard de estadística descriptiva).

Detalles de arquitectura, cómo actualizar la muestra y cómo añadir capturas: [`web/README.md`](web/README.md).
