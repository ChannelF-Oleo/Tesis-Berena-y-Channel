# -*- coding: utf-8 -*-
"""
FASE 3 · Normalización de sinónimos  +  FASE 6 · Modalidad y acto de habla múltiples
        +  nueva variable «acto de habla referido».

Uso:  python3 herramientas/fase3_normalizacion.py [--aplicar]
"""
import json, sys, re
from pathlib import Path

RUTA = Path('Datos/gemini-code-1787586644203.json')

# ── Fase 3 · sección: nombre del instrumento + sección secundaria ──────────
SECCION = {
  'Internacionales':            ('Internacional',    None),
  'Deportes':                   ('Deportiva',        None),
  'Economía':                   ('Económica',        None),
  'Economía/Finanzas':          ('Económica',        'Finanzas'),
  'Economía/Turismo':           ('Económica',        'Turismo'),
  'Educación/Cultura':          ('Educativa',        'Cultural'),
  'Social/Cultura':             ('Social/Comunidad', 'Cultural'),
  'Social/Gremial':             ('Social/Comunidad', 'Gremial'),
  'Social/Humanas':             ('Social/Comunidad', 'Humanas'),
  'Sostenibilidad/Corporativo': ('Ambiental',        'Corporativo'),
  # «Nacionales» se resuelve aparte, en fase8_secciones.py.
}

# ── Fase 6 · modalidad como selección múltiple ────────────────────────────
MODALIDAD = {
  'Enunciativa':               (['Enunciativa'], None),
  'Interrogativa':             (['Interrogativa'], None),
  'Exhortativa':               (['Exhortativa'], None),
  'Enunciativa / Exhortativa': (['Enunciativa', 'Exhortativa'], None),
}

# ── Fase 6 · acto de habla del medio, múltiple y en la nomenclatura de Searle ──
# «Comisivo» y «Compromisorio» traducen el mismo commissive de Searle: se adopta
# la forma del instrumento. Los matices ajenos a la taxonomía pasan a un campo aparte.
ACTO_HABLA = {
  'Asertivo':               (['Asertivo'], None),
  'Directivo':              (['Directivo'], None),
  'Asertivo/Directivo':     (['Asertivo', 'Directivo'], None),
  'Asertivo/Evaluativo':    (['Asertivo'], 'con carga evaluativa'),
  'Asertivo (con valor admonitorio en la segunda proposición)':
                            (['Asertivo'], 'con valor admonitorio en la segunda proposición'),
  'Exhortativo/Provocativo':(['Directivo'], 'exhortativo-provocativo'),
  'Comisivo/Advertitivo':   (['Compromisorio'], 'con valor advertitivo'),
}

# ── Fase 3 · resto de sinónimos ───────────────────────────────────────────
SINONIMOS = {
  'captacion': {'Llamado a la acción (CTA)': 'Llamada a la acción (CTA)'},
  'sintesis':  {'Elipsis de conjunción («que»)': 'Elipsis de nexos/conjunciones',
                'Elipsis de conectores':         'Elipsis de nexos/conjunciones'},
}

# ── Nueva variable · acto de habla de la fuente referida ──────────────────
VERBOS = [
  (r'\b(agradece\w*|celebra\w*|felicita\w*|lamenta\w*|reconoce\w*|homenajea\w*|rinde homenaje)\b', 'Expresivo'),
  (r'\b(juramenta\w*|inviste\w*|designa\w*|nombra\w*|proclama\w*|condena a|sentencia\w*|dicta\w*)\b', 'Declarativo'),
  (r'\b(promete\w*|se compromete\w*|garantiza\w*|devolver[áa]\w*|seguir[áa]n?|mantendr[áa]\w*|continuar[áa]\w*)\b', 'Compromisorio'),
  (r'\b(llama a|pide\w*|piden|exhorta\w*|insta\w*|aboga\w*|demanda\w*|reclama\w*|exige\w*|invita\w*|propone\w*|proponen)\b', 'Directivo'),
  (r'\b(asegura\w*|afirma\w*|aclara\w*|se[ñn]ala\w*|destaca\w*|reitera\w*|informa\w*|confirma\w*|precisa\w*|'
   r'sostiene\w*|revela\w*|denuncia\w*|critica\w*|advierte\w*|expresa\w*|anuncia\w*|dice\w*|explica\w*|'
   r'niega\w*|responde\w*|admite\w*|declara\w*|seg[úu]n)\b', 'Asertivo'),
]
# Cita atribuida: «Fuente: “…”» o «“…”: dice X». Las comillas denominativas
# (nombres de programas, galas) no cuentan como discurso referido.
CITA_ATRIBUIDA = re.compile(r'(:\s*[«“"])|([»”"]\s*[:,]\s*\w)')

# Decisiones que la regla no puede tomar sola.
OVERRIDES = {
  'T037': 'No aplica',   # «Oceanía inaugura el 2026»: uso metafórico, no acto declarativo de una fuente.
  'T032': 'No aplica',   # «La Casa de Alofoke 2»: comillas denominativas, no cita de una fuente.
}

def acto_referido(r):
    if r['codigo'] in OVERRIDES:
        return OVERRIDES[r['codigo']]
    t = r['titular']
    for pat, acto in VERBOS:
        if re.search(pat, t, re.I):
            return acto
    if CITA_ATRIBUIDA.search(t):
        return 'Asertivo'
    return 'No aplica'

def main(aplicar):
    d = json.loads(RUTA.read_text(encoding='utf-8'))
    log = []

    for r in d:
        cod = r['codigo']

        if r['seccion'] in SECCION:
            nueva, sec = SECCION[r['seccion']]
            log.append(f'{cod} seccion: «{r["seccion"]}» → «{nueva}»' + (f' + secundaria «{sec}»' if sec else ''))
            r['seccion'] = nueva
            r['seccionSecundaria'] = sec or ''
        else:
            r.setdefault('seccionSecundaria', '')

        if isinstance(r['modalidad'], str):
            nueva, matiz = MODALIDAD[r['modalidad']]
            if nueva != [r['modalidad']]:
                log.append(f'{cod} modalidad: «{r["modalidad"]}» → {nueva}')
            r['modalidad'] = nueva

        if isinstance(r['actoHabla'], str):
            nueva, matiz = ACTO_HABLA[r['actoHabla']]
            if nueva != [r['actoHabla']] or matiz:
                log.append(f'{cod} actoHabla: «{r["actoHabla"]}» → {nueva}' + (f' + matiz «{matiz}»' if matiz else ''))
            r['actoHabla'] = nueva
            r['actoHablaMatiz'] = matiz or ''

        for campo, mapa in SINONIMOS.items():
            vals = r[campo]
            nuevos = []
            for v in vals:
                nv = mapa.get(v, v)
                if nv != v:
                    log.append(f'{cod} {campo}: «{v}» → «{nv}»')
                if nv not in nuevos:
                    nuevos.append(nv)
            r[campo] = nuevos

        r['actoHablaReferido'] = acto_referido(r)

    print('\n'.join(log))
    print(f'\n{len(log)} normalizaciones')
    import collections
    print('actoHablaReferido:', dict(collections.Counter(r['actoHablaReferido'] for r in d)))
    print('secciones:', dict(collections.Counter(r['seccion'] for r in d)))

    if aplicar:
        RUTA.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding='utf-8')
        print('APLICADO')
    else:
        print('SIMULACIÓN — usa --aplicar')

main('--aplicar' in sys.argv)
