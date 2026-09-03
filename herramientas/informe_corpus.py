#!/usr/bin/env python3
"""Genera el informe del corpus: resultados agregados y las cincuenta fichas.

Lee el corpus y el instrumento —el mismo que usa la auditoría— y produce un
documento HTML autocontenido con tres partes: el resultado de los datos
variable por variable, el índice de los cincuenta titulares y la matriz de
análisis completa de cada uno, con su interpretación y sus observaciones.

Uso:  python3 herramientas/informe_corpus.py [destino.html]
"""
import html
import json
import pathlib
import re
import sys
from collections import Counter

from auditoria import CORPUS, cargar_instrumento

DESTINO_POR_DEFECTO = pathlib.Path('informe-corpus.html')

MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio',
         'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']


def e(t) -> str:
    return html.escape(str(t if t is not None else ''))


def fecha_larga(iso: str) -> str:
    a, m, d = iso.split('-')
    return f'{int(d)} de {MESES[int(m) - 1]} de {a}'


def fecha_corta(iso: str) -> str:
    a, m, d = iso.split('-')
    return f'{int(d)} {MESES[int(m) - 1][:3]} {a}'


def valores(ficha: dict, clave: str) -> list[str]:
    v = ficha.get(clave)
    if v is None or v == '':
        return []
    if isinstance(v, bool):
        return ['Sí' if v else 'No']
    return [str(x) for x in v] if isinstance(v, list) else [str(v)]


def conteo(fichas: list, clave: str) -> list[tuple[str, int]]:
    c = Counter()
    for f in fichas:
        c.update(valores(f, clave))
    return sorted(c.items(), key=lambda kv: (-kv[1], kv[0]))


def raices(fichas: list, clave: str) -> list[tuple[str, int]]:
    c = Counter()
    for f in fichas:
        bruto = str(f.get(clave) or '').strip()
        if not bruto:
            continue
        cabeza = re.split(r'[/;]', bruto)[0].strip().split()[0]
        c[cabeza[0].upper() + cabeza[1:]] += 1
    return sorted(c.items(), key=lambda kv: (-kv[1], kv[0]))


def barras(datos: list[tuple[str, int]], total: int, pie: str = '') -> str:
    if not datos:
        return ''
    tope = max(v for _, v in datos)
    filas = []
    for nombre, valor in datos:
        pct = round(valor / total * 100)
        filas.append(
            f'<div class="fila"><span class="clave">{e(nombre)}</span>'
            f'<span class="pista"><i style="width:{max(valor / tope * 100, 2):.1f}%"></i></span>'
            f'<span class="cifra">{valor}</span><span class="pct">{pct}%</span></div>'
        )
    cola = f'<p class="pie">{e(pie)}</p>' if pie else ''
    return f'<div class="barras">{"".join(filas)}</div>{cola}'


def bloque_resultado(titulo: str, cuerpo: str, sumario: str = '') -> str:
    intro = f'<p class="sumario">{sumario}</p>' if sumario else ''
    return f'<div class="resultado"><h3>{e(titulo)}</h3>{intro}{cuerpo}</div>'


def matriz_ficha(ficha: dict, instrumento: list) -> str:
    secciones = []
    for bloque in instrumento:
        filas = []
        for var in bloque['variables']:
            clave = var.get('clave')
            if not clave or clave in ('codigo', 'fecha', 'titular', 'enlace',
                                      'interpretacion', 'observaciones'):
                continue
            vals = valores(ficha, clave)
            if var['tipo'] == 'criterio':
                marca = 'sí' if ficha.get(clave) else 'no'
                cumple = bool(ficha.get(clave))
                signo = '✓' if cumple == (not var.get('excluye')) else '✗'
                filas.append(
                    f'<dt>{e(var["etiqueta"])}</dt>'
                    f'<dd class="criterio"><span class="marca">{signo}</span> {marca}</dd>'
                )
                continue
            if not vals:
                filas.append(f'<dt>{e(var["etiqueta"])}</dt><dd class="vacio">—</dd>')
                continue
            if var['tipo'] in ('unica', 'multiple'):
                fichas_val = ''.join(f'<span class="valor">{e(v)}</span>' for v in vals)
            else:
                fichas_val = f'<span class="libre">{e(vals[0])}</span>'
            filas.append(f'<dt>{e(var["etiqueta"])}</dt><dd>{fichas_val}</dd>')
        if filas:
            secciones.append(
                f'<div class="grupo"><h4>{bloque["numero"]} · {e(bloque["titulo"])}</h4>'
                f'<dl>{"".join(filas)}</dl></div>'
            )
    return ''.join(secciones)


def parrafos(texto: str) -> str:
    return ''.join(f'<p>{e(p)}</p>' for p in str(texto).split('\n\n') if p.strip())


def construir(fichas: list, instrumento: list) -> str:
    total = len(fichas)
    desde, hasta = min(f['fecha'] for f in fichas), max(f['fecha'] for f in fichas)

    # ---------------------------------------------------------- resultados
    res = []
    res.append(bloque_resultado(
        'Sección temática',
        barras(conteo(fichas, 'seccion'), total)
        + barras(conteo(fichas, 'seccionSecundaria'), total,
                 f'Ámbito secundario, registrado en {sum(1 for f in fichas if f["seccionSecundaria"])} titulares.'),
        'Materia del hecho narrado. La sección secundaria solo se anota cuando el titular cruza dos ámbitos.'))
    res.append(bloque_resultado('Tipo de entrada', barras(conteo(fichas, 'tipoEntrada'), total)))
    res.append(bloque_resultado(
        'Modalidad oracional', barras(conteo(fichas, 'modalidad'), total),
        'Ni un solo titular del corpus emplea la modalidad exclamativa, la desiderativa o la dubitativa.'))
    res.append(bloque_resultado('Estructura sintáctica', barras(conteo(fichas, 'estructuraSintactica'), total)))
    res.append(bloque_resultado(
        'Fenómenos de síntesis', barras(conteo(fichas, 'sintesis'), total),
        'Selección múltiple: los porcentajes indican en cuántos de los cincuenta titulares aparece cada fenómeno.'))
    res.append(bloque_resultado('Deixis', barras(conteo(fichas, 'deixis'), total)))
    res.append(bloque_resultado('Carga léxica', barras(conteo(fichas, 'cargaLexica'), total)))
    res.append(bloque_resultado('Adjetivación', barras(conteo(fichas, 'adjetivacion'), total)))
    res.append(bloque_resultado('Figuras retóricas', barras(conteo(fichas, 'figuras'), total)))
    res.append(bloque_resultado(
        'Polifonía', barras(conteo(fichas, 'polifonia'), total),
        'Quién asume el enunciado. Solo cuentan las marcas presentes en el titular: una fuente citada en el copy no basta.'))
    res.append(bloque_resultado(
        'Actos de habla',
        barras(conteo(fichas, 'actoHabla'), total, 'Acto ilocutivo del medio.')
        + barras(conteo(fichas, 'actoHablaReferido'), total, 'Acto de la fuente citada.'),
        'El periódico casi siempre informa; la fuente a la que da voz promete, pide, agradece o declara.'))
    res.append(bloque_resultado('Estrategia de captación', barras(conteo(fichas, 'captacion'), total)))
    res.append(bloque_resultado(
        'Oralidad fingida', barras(conteo(fichas, 'oralidad'), total),
        'El medio despliega tuteo y jerga en el copy y no los traslada a la gráfica del titular.'))
    res.append(bloque_resultado(
        'Multimodalidad',
        barras(conteo(fichas, 'densidadEmoji'), total, 'Densidad de emojis en el texto del titular.')
        + barras(conteo(fichas, 'coherencia'), total, 'Relación entre el titular y la imagen que lo aloja.'),
        'Dos resultados constantes: ningún emoji y ninguna divergencia entre texto e imagen.'))
    res.append(bloque_resultado('Función dominante', barras(conteo(fichas, 'funcionDominante'), total)))
    res.append(bloque_resultado(
        'Encuadre temático',
        barras(raices(fichas, 'funcionEncuadre'),
               sum(1 for f in fichas if f['funcionEncuadre']),
               'Agrupado por la raíz de la etiqueta, sobre los titulares que llevan encuadre declarado.'),
        'Macroestructura semántica: el tema global bajo el que se ejerce la función.'))

    # ------------------------------------------------------------- índice
    indice = ''.join(
        f'<a href="#{f["codigo"]}"><span class="cod">{f["codigo"]}</span>'
        f'<span class="tit">{e(f["titular"])}</span></a>'
        for f in fichas)

    # ------------------------------------------------------------- fichas
    piezas = []
    for f in fichas:
        secundaria = (f'<span class="chip chip-sec">{e(f["seccionSecundaria"])}</span>'
                      if f['seccionSecundaria'] else '')
        piezas.append(f'''
    <article class="ficha" id="{f["codigo"]}">
      <div class="cabecera">
        <div class="rotulos">
          <span class="chip">{e(f["seccion"])}</span>{secundaria}
        </div>
        <h3 class="titular"><span class="tarjeta">{e(f["titular"])}</span></h3>
        <div class="meta">
          <span class="cod">{f["codigo"]}</span>
          <span>{e(fecha_larga(f["fecha"]))}</span>
          <span>{e(f["tipoEntrada"])}</span>
          <a href="{e(f["enlace"])}" target="_blank" rel="noopener">Ver publicación</a>
        </div>
      </div>
      <div class="matriz">{matriz_ficha(f, instrumento)}</div>
      <div class="prosa">
        <h4>Interpretación</h4>
        {parrafos(f["interpretacion"])}
        <h4>Observaciones críticas</h4>
        {parrafos(f["observaciones"])}
      </div>
    </article>''')

    return PLANTILLA.format(
        total=total,
        desde=fecha_corta(desde),
        hasta=fecha_corta(hasta),
        variables=sum(len(b['variables']) for b in instrumento),
        bloques=len(instrumento),
        resultados=''.join(res),
        indice=indice,
        fichas=''.join(piezas),
    )


PLANTILLA = '''<title>Corpus de titulares de El Nuevo Diario</title>
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700&family=Spectral:ital,wght@0,400;0,600;1,400&family=IBM+Plex+Mono:wght@400;500&display=swap">
<style>
  :root{{
    --papel:#FBFAF7; --tinta:#14120F; --tenue:#6B6560; --muy-tenue:#9A938B;
    --rojo:#CE1F27; --regla:#E6E1D8; --realce:#F2EFE8; --chip:#14120F; --chip-tinta:#FBFAF7;
  }}
  @media (prefers-color-scheme: dark){{
    :root:not([data-theme="light"]){{
      --papel:#121110; --tinta:#EFEAE1; --tenue:#948D84; --muy-tenue:#6E6862;
      --rojo:#F0605A; --regla:#2C2926; --realce:#1B1917; --chip:#EFEAE1; --chip-tinta:#121110;
    }}
  }}
  :root[data-theme="dark"]{{
    --papel:#121110; --tinta:#EFEAE1; --tenue:#948D84; --muy-tenue:#6E6862;
    --rojo:#F0605A; --regla:#2C2926; --realce:#1B1917; --chip:#EFEAE1; --chip-tinta:#121110;
  }}
  *{{box-sizing:border-box}}
  body{{
    background:var(--papel); color:var(--tinta); margin:0;
    font-family:"Spectral",Georgia,serif; font-size:16.5px; line-height:1.62;
    padding:clamp(26px,4vw,64px) clamp(18px,4vw,40px) 110px;
    -webkit-font-smoothing:antialiased;
  }}
  main{{max-width:47rem; margin:0 auto; display:flex; flex-direction:column; gap:3.5rem}}
  p{{margin:0}}
  a{{color:inherit}}
  .mono,.cod,.cifra,.pct{{font-family:"IBM Plex Mono",ui-monospace,Menlo,monospace}}
  .rotulo{{
    font-family:"Archivo",system-ui,sans-serif; font-size:10.5px; font-weight:600;
    letter-spacing:.16em; text-transform:uppercase; color:var(--tenue);
  }}

  /* ------------------------------------------------ portada */
  header{{display:flex; flex-direction:column; gap:1rem}}
  h1{{
    font-family:"Archivo",system-ui,sans-serif; font-weight:700;
    font-size:clamp(2rem,5.4vw,3rem); line-height:1.04; letter-spacing:-.025em;
    margin:0; text-wrap:balance;
  }}
  .subtitulo{{font-size:1.08rem; color:var(--tenue); max-width:36rem; margin:0}}
  .autoras{{font-size:.95rem}}
  .cifras{{
    display:grid; grid-template-columns:repeat(auto-fit,minmax(8.5rem,1fr));
    gap:1px; background:var(--regla); border-top:1px solid var(--regla); border-bottom:1px solid var(--regla);
  }}
  .cifras div{{background:var(--papel); padding:.8rem .2rem .9rem; display:flex; flex-direction:column; gap:.1rem}}
  .cifras b{{font-family:"IBM Plex Mono",monospace; font-size:1.45rem; font-weight:500; font-variant-numeric:tabular-nums}}
  .cifras .periodo{{font-size:.92rem; line-height:1.5}}

  /* ------------------------------------------------ secciones */
  section{{display:flex; flex-direction:column; gap:1.4rem}}
  h2{{
    font-family:"Archivo",system-ui,sans-serif; font-weight:700; font-size:1.5rem;
    letter-spacing:-.015em; margin:0; padding-bottom:.5rem; border-bottom:2px solid var(--tinta);
  }}
  .entradilla{{color:var(--tenue); max-width:38rem}}

  /* ------------------------------------------------ resultados */
  .resultados{{display:flex; flex-direction:column; gap:1.9rem}}
  .resultado h3{{
    font-family:"Archivo",system-ui,sans-serif; font-size:1.02rem; font-weight:600;
    margin:0 0 .3rem; letter-spacing:-.005em;
  }}
  .sumario{{font-size:.92rem; color:var(--tenue); margin:0 0 .7rem; max-width:38rem}}
  .barras{{display:flex; flex-direction:column; gap:.28rem; margin-bottom:.35rem}}
  .fila{{display:grid; grid-template-columns:minmax(0,15rem) 1fr 2.1rem 2.6rem; align-items:center; gap:.6rem; font-size:13.5px}}
  .fila .clave{{overflow-wrap:anywhere}}
  .pista{{display:block; height:7px; background:var(--realce); border-radius:1px; overflow:hidden}}
  .pista i{{display:block; height:100%; background:var(--rojo)}}
  .cifra{{text-align:right; font-variant-numeric:tabular-nums; font-size:12.5px}}
  .pct{{text-align:right; font-variant-numeric:tabular-nums; font-size:11.5px; color:var(--muy-tenue)}}
  .pie{{font-size:12px; color:var(--muy-tenue); margin:.1rem 0 .5rem}}

  /* ------------------------------------------------ índice */
  .indice{{display:flex; flex-direction:column; border-top:1px solid var(--regla)}}
  .indice a{{
    display:grid; grid-template-columns:3.4rem 1fr; gap:.7rem; padding:.42rem .1rem;
    border-bottom:1px solid var(--regla); text-decoration:none; font-size:14.5px;
  }}
  .indice a:hover .tit{{text-decoration:underline}}
  .indice .cod{{color:var(--rojo); font-size:12px}}

  /* ------------------------------------------------ fichas */
  .fichas{{display:flex; flex-direction:column; gap:3.2rem}}
  .ficha{{display:flex; flex-direction:column; gap:1.1rem; scroll-margin-top:1rem}}
  .cabecera{{display:flex; flex-direction:column; gap:.5rem; align-items:flex-start}}
  .rotulos{{display:flex; flex-wrap:wrap; gap:.35rem}}
  .chip{{
    display:inline-block; background:var(--chip); color:var(--chip-tinta);
    font-family:"Archivo",system-ui,sans-serif; font-weight:700; font-size:10.5px;
    letter-spacing:.13em; text-transform:uppercase; padding:.26rem .55rem;
  }}
  .chip-sec{{background:none; color:var(--tenue); border:1px solid var(--regla)}}
  .titular{{margin:0; max-width:32rem}}
  .tarjeta{{
    display:inline; background:var(--rojo); color:#fff;
    font-family:"Archivo",system-ui,sans-serif; font-weight:600; font-size:clamp(1.12rem,2.7vw,1.42rem);
    line-height:1.62; letter-spacing:-.01em; padding:.16em .42em;
    box-decoration-break:clone; -webkit-box-decoration-break:clone;
  }}
  .meta{{display:flex; flex-wrap:wrap; gap:.3rem 1.1rem; font-size:12px; color:var(--tenue); font-family:"IBM Plex Mono",monospace}}
  .meta .cod{{color:var(--rojo)}}
  .meta a{{color:var(--tenue)}}

  .matriz{{display:flex; flex-direction:column; gap:1.05rem; border-left:2px solid var(--regla); padding-left:1.05rem}}
  .grupo h4{{
    font-family:"Archivo",system-ui,sans-serif; font-size:10.5px; font-weight:600;
    letter-spacing:.15em; text-transform:uppercase; color:var(--tenue); margin:0 0 .4rem;
  }}
  .grupo dl{{display:grid; grid-template-columns:minmax(0,13rem) 1fr; gap:.3rem .9rem; margin:0; font-size:13.5px}}
  .grupo dt{{color:var(--tenue); overflow-wrap:anywhere}}
  .grupo dd{{margin:0; display:flex; flex-wrap:wrap; gap:.25rem; align-items:baseline}}
  .valor{{background:var(--realce); padding:.06rem .42rem; border-radius:2px}}
  .libre{{font-style:italic}}
  .vacio{{color:var(--muy-tenue)}}
  .criterio .marca{{font-family:"IBM Plex Mono",monospace; color:var(--rojo)}}

  .prosa h4{{
    font-family:"Archivo",system-ui,sans-serif; font-size:10.5px; font-weight:600;
    letter-spacing:.15em; text-transform:uppercase; color:var(--tenue);
    margin:1.1rem 0 .35rem;
  }}
  .prosa h4:first-child{{margin-top:0}}
  .prosa p{{margin:0 0 .6rem}}
  .prosa p:last-child{{margin-bottom:0}}

  footer{{border-top:1px solid var(--regla); padding-top:1rem; color:var(--tenue); font-size:12.5px}}

  @media (max-width:640px){{
    .fila{{grid-template-columns:minmax(0,9.5rem) 1fr 2rem 2.4rem}}
    .grupo dl{{grid-template-columns:1fr; gap:.1rem}}
    .grupo dt{{margin-top:.4rem}}
  }}
</style>

<main>
  <header>
    <span class="rotulo">Informe del corpus · Capítulo IV</span>
    <h1>Corpus de titulares de El Nuevo Diario</h1>
    <p class="subtitulo">Matriz de análisis, observaciones y resultado de los datos de los {total} titulares publicados en el feed de Instagram del periódico.</p>
    <p class="autoras">Berena Lisbeth Figuereo Fortuna y Channel Feliz de Oleo · Universidad Autónoma de Santo Domingo</p>
    <div class="cifras">
      <div><span class="rotulo">Titulares</span><b>{total}</b></div>
      <div><span class="rotulo">Variables</span><b>{variables}</b></div>
      <div><span class="rotulo">Bloques</span><b>{bloques}</b></div>
      <div><span class="rotulo">Periodo</span><b class="periodo">{desde} – {hasta}</b></div>
    </div>
    <p class="entradilla">La unidad de análisis es el texto del titular. El copy de la publicación, la imagen y los comentarios se citan en la interpretación y en las observaciones para dar contexto, pero no sostienen por sí solos el valor de ninguna categoría cerrada.</p>
  </header>

  <section>
    <h2>Resultado de los datos</h2>
    <p class="entradilla">Distribución de cada variable sobre los {total} titulares. En las de selección múltiple el porcentaje indica presencia, no reparto, de modo que la suma excede el cien por ciento.</p>
    <div class="resultados">{resultados}</div>
  </section>

  <section>
    <h2>Los {total} titulares</h2>
    <nav class="indice">{indice}</nav>
  </section>

  <section>
    <h2>Matriz de análisis</h2>
    <p class="entradilla">Cada ficha reproduce la codificación completa, agrupada por los bloques del instrumento, seguida de la interpretación y las observaciones críticas.</p>
    <div class="fichas">{fichas}</div>
  </section>

  <footer>
    Análisis de las estrategias lingüísticas y pragmáticas en los titulares del periódico El Nuevo Diario:
    el caso de su feed de Instagram (julio 2025 – febrero 2026).
    Asesora: Mtra. Alma Rosa Mejía.
  </footer>
</main>
'''


def main() -> None:
    destino = pathlib.Path(sys.argv[1]) if len(sys.argv) > 1 else DESTINO_POR_DEFECTO
    fichas = json.loads(CORPUS.read_text(encoding='utf-8'))
    destino.write_text(construir(fichas, cargar_instrumento()), encoding='utf-8')
    print(f'{destino} · {len(fichas)} fichas · {destino.stat().st_size // 1024} KB')


if __name__ == '__main__':
    main()
