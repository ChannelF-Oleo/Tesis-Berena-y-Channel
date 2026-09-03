# -*- coding: utf-8 -*-
"""
FASE 5 · Desdoblamiento de las cinco variables de categoría abierta.

Cada una se separa en una categoría cerrada (la del instrumento, ampliada) y una
especificación libre que conserva el matiz codificado. En «captación» y «función
dominante» la segunda mitad no es una especificación sino un encuadre temático
—macroestructura semántica, van Dijk—, por eso el campo se llama distinto.

Uso:  python3 herramientas/fase5_desdoblamiento.py [--aplicar]
"""
import json, re, sys, collections
from pathlib import Path

RUTA = Path('Datos/gemini-code-1787586644203.json')

# ── ESTRUCTURA SINTÁCTICA ─────────────────────────────────────────────────
DOS_PUNTOS = 'Estructura con dos puntos (planteamiento + resolución)'
YUXTA = 'Bimembre yuxtapuesta (dos proposiciones)'

ESTRUCTURA = {
 'Simple':                                   ('Simple', ''),
 'Simple (estructura canónica)':             ('Simple', 'estructura canónica'),
 'Simple (forma impersonal)':                ('Simple', 'forma impersonal'),
 'Simple descriptiva':                       ('Simple', 'descriptiva'),
 'Simple con elipsis de nexo':               ('Simple', 'con elipsis de nexo'),
 'Simple con anteposición de complemento':   ('Simple', 'con anteposición de complemento'),
 'Simple con atribución pospuesta':          ('Simple', 'con atribución pospuesta'),
 'Simple con cita parcial':                  ('Simple', 'con cita parcial'),
 'Simple con sintagma preposicional atributivo': ('Simple', 'con sintagma preposicional atributivo'),
 'Simple coordinada copulativa':             ('Coordinada', 'copulativa'),
 'Simple con subordinada adjetiva':          ('Subordinada', 'adjetiva'),
 'Simple con subordinada sustantiva':        ('Subordinada', 'sustantiva'),
 'Completa subordinada adjetiva':            ('Subordinada', 'adjetiva'),
 'Estructura nominal de presentación':       ('Nominal (sin verbo)', 'de presentación'),
 'Bimembre con cita directa':                (None, 'con cita directa'),
 'Bimembre con cita directa inicial':        (None, 'con cita directa inicial'),
 'Bimembre con cita directa y antítesis':    (None, 'con cita directa y antítesis'),
 'Bimembre (nominal + interrogativa)':       (None, 'nominal + interrogativa'),
 'Bimembre yuxtapuesta (dos proposiciones)': (None, ''),
 'Bimembre yuxtapuesta (punto y coma)':      (YUXTA, 'punto y coma'),
 'Bimembre yuxtapuesta (dos proposiciones separadas por punto y coma)': (YUXTA, 'punto y coma'),
 'Bimembre yuxtapuesta (proposición declarativa + aposición nominal cuantitativa)':
                                             (YUXTA, 'proposición declarativa + aposición nominal cuantitativa'),
 'Cita directa con atribución en pie de tarjeta': (YUXTA, 'cita directa con atribución en pie de tarjeta'),
}

# ── SÍNTESIS ──────────────────────────────────────────────────────────────
# (base, especificación). Reglas por prefijo cuando la etiqueta lleva paréntesis.
SINTESIS_BASE = [
 (r'^Elipsis nominal',                    'Elipsis nominal'),
 (r'^Elipsis verbal',                     'Elipsis verbal'),
 (r'^Elipsis de nexos',                   'Elipsis de nexos/conjunciones'),
 (r'^Siglas y acrónimos \(EE\. UU\.\)',   'Abreviaturas'),          # abreviatura, no acrónimo
 (r'^Siglas y abreviaturas toponímicas',  'Abreviaturas'),
 (r'^Siglas',                             'Siglas y acrónimos'),
 (r'^Nominalización',                     'Nominalización'),
 (r'^Sustantivación|^Subordinación sustantiva', 'Sustantivación'),
 (r'^Impersonalidad sintáctica',          'Impersonalidad sintáctica'),
 (r'^Citas? directas? (inicial )?entrecomillada|^Citas entrecomilladas|^Tarjeta de cita',
                                          'Cita directa entrecomillada'),
 (r'^Uso de comillas denominativas',      'Comillas denominativas'),
 (r'^Estructura bimembre|^Titulación bimembre', 'Estructura bimembre'),
 (r'^Sintaxis completa regular|^Sintaxis descriptiva directa|^Sintaxis oral popular|^Sintaxis promocional',
                                          'Ninguno evidente'),
 (r'^Yuxtaposición|^Juxtaposición|^Oposición binaria', 'Yuxtaposición'),
 (r'^Personificación',                    'Personificación sintáctica'),
 (r'^Anteposición de complemento',        'Anteposición de complemento'),
 (r'^Modulación modal',                   'Modulación modal'),
 (r'^Sintagma de atribución de fuente|^Atribución explícita|^Verbo dicendi',
                                          'Atribución de fuente'),
 (r'^Uso de títulos honoríficos',         'Títulos honoríficos'),
 (r'^Locución adverbial ponderativa',     'Locución ponderativa'),
 (r'^Uso de catafórico',                  'Uso catafórico'),
 (r'^Participio en función adjetiva',     'Participio en función adjetiva'),
 (r'^Condensación|^Sintagma preposicional de antecedente', 'Condensación'),
 (r'^Síntesis referencial',               'Síntesis referencial mediante nombres propios (hidrónimos/antropónimos)'),
]

# ── POLIFONÍA ─────────────────────────────────────────────────────────────
DRD = 'Discurso referido directo (cita textual)'
DRI = 'Discurso referido indirecto (verbo declarativo)'
COMB = 'Combinación de voces'
POLIFONIA_BASE = [
 (r'^Voz monofónica periodística', 'Voz monofónica periodística'),
 (r'^Voz monofónica institucional', 'Voz monofónica institucional'),
 (r'^Voz (institucional|comunitaria|de la entrevistada) /', COMB),
 (r'^Discurso referido directo e indirecto combinados', COMB),
 (r'^Polifonía coral', COMB),
 (r'^Polifonía interactiva', 'Polifonía interactiva (consulta/sondeo al público)'),
 (r'^Discurso referido directo', DRD),
 (r'^Discurso referido indirecto', DRI),
 (r'^Discurso referido de', DRI),
]

# ── CAPTACIÓN · estrategias cerradas; el resto pasa a encuadre temático ────
CAPTACION_CERRADA = {
 'Referencia informativa directa (sin ocultamiento)', 'Incompleción informativa',
 'Promesa emocional', 'Referencia ambigua', 'Pregunta retórica',
 'Llamada a la acción (CTA)', 'Ninguna evidente',
 # ampliación demostrada por la muestra
 'Oralidad fingida', 'Sensacionalismo', 'Promoción institucional', 'Apelación identitaria',
}
CAPTACION_MAPA = {
 'Sensacionalismo / Clickbaiting':      ('Sensacionalismo', 'clickbaiting'),
 'Sensacionalismo / Virabilidad':       ('Sensacionalismo', 'viralidad'),
 'Orgullo patrio / Apelación identitaria': ('Apelación identitaria', 'orgullo patrio'),
 'Promesa emocional / Nostalgia':       ('Promesa emocional', 'nostalgia'),
 'Referencia a cita parcial':           ('Incompleción informativa', 'referencia a cita parcial'),
 'Adjetivación de prestigio («exclusivo»)': ('Promesa emocional', 'adjetivación de prestigio («exclusivo»)'),
 'Call to Action automatizado (DM Bot)': ('Llamada a la acción (CTA)', 'automatizado (DM bot)'),
}

# ── FUNCIÓN DOMINANTE · funciones cerradas; el resto pasa a encuadre ───────
FUNCION_CERRADA = {'Informativa', 'Apelativa/Conativa', 'Emotiva/Expresiva', 'Fática',
                   'Propagandística/Persuasiva', 'Interactiva (engagement)'}
FUNCION_MAPA = {
 'Promocional/Persuasiva': ('Propagandística/Persuasiva', 'promocional'),
 'Lúdica/Expresiva':       ('Emotiva/Expresiva', 'lúdica'),
}

def base_por_regla(valor, reglas, defecto=None):
    for pat, base in reglas:
        if re.match(pat, valor, re.I):
            return base
    return defecto

def _plano(x):
    return re.sub(r'[^a-záéíóúñü ]+', '', x.lower()).strip()

def especificacion(valor, base):
    """Lo que queda de la etiqueta una vez retirada su categoría base.

    Devuelve cadena vacía si lo que queda ya está contenido en la base: eso
    significa que la etiqueta no añadía matiz alguno.
    """
    m = re.search(r'\(([^)]*)\)\s*$', valor)
    if m and _plano(m.group(1)) not in _plano(base):
        return m.group(1)
    resto = re.sub(r'^' + re.escape(base), '', valor, flags=re.I).strip(' ()–-')
    if not resto:
        return ''
    rp, bp = _plano(resto), _plano(base)
    if rp in bp or bp in rp:
        return ''
    return resto

def main(aplicar):
    d = json.loads(RUTA.read_text(encoding='utf-8'))
    sin_mapear = collections.Counter()

    for r in d:
        t = r['titular']

        # estructura sintáctica
        v = r['estructuraSintactica']
        if v in ESTRUCTURA:
            base, esp = ESTRUCTURA[v]
            if base is None:
                base = DOS_PUNTOS if ':' in t else YUXTA
            r['estructuraSintactica'] = base
            r['estructuraEspecificacion'] = esp
        else:
            sin_mapear[f'estructura::{v}'] += 1
            r.setdefault('estructuraEspecificacion', '')

        # síntesis
        bases, esps = [], []
        for v in r['sintesis']:
            b = base_por_regla(v, SINTESIS_BASE)
            if not b:
                sin_mapear[f'sintesis::{v}'] += 1
                b = 'Ninguno evidente'
            e = especificacion(v, b)
            if b not in bases:
                bases.append(b)
            if e:
                esps.append(e)
        r['sintesis'] = bases or ['Ninguno evidente']
        r['sintesisEspecificacion'] = '; '.join(esps)

        # polifonía
        v = r['polifonia']
        b = base_por_regla(v, POLIFONIA_BASE)
        if not b:
            sin_mapear[f'polifonia::{v}'] += 1
            b = 'Voz monofónica periodística'
        r['polifonia'] = b
        r['polifoniaEspecificacion'] = especificacion(v, b)

        # captación
        cerradas, encuadres = [], []
        for v in r['captacion']:
            if v in CAPTACION_MAPA:
                b, e = CAPTACION_MAPA[v]
                if b not in cerradas: cerradas.append(b)
                if e: encuadres.append(e)
            elif v in CAPTACION_CERRADA:
                if v not in cerradas: cerradas.append(v)
            else:
                encuadres.append(v)
        r['captacion'] = cerradas or ['Ninguna evidente']
        r['captacionEncuadre'] = '; '.join(encuadres)

        # función dominante
        cerradas, encuadres = [], []
        for v in r['funcionDominante']:
            if v in FUNCION_MAPA:
                b, e = FUNCION_MAPA[v]
                if b not in cerradas: cerradas.append(b)
                if e: encuadres.append(e)
            elif v in FUNCION_CERRADA:
                if v not in cerradas: cerradas.append(v)
            else:
                encuadres.append(v)
        r['funcionDominante'] = cerradas or ['Informativa']
        r['funcionEncuadre'] = '; '.join(encuadres)

    if sin_mapear:
        print('SIN MAPEAR:')
        for k, n in sin_mapear.most_common():
            print(f'   {n}× {k}')
    else:
        print('Todas las etiquetas encontraron categoría base.')

    for campo in ('estructuraSintactica', 'sintesis', 'polifonia', 'captacion', 'funcionDominante'):
        c = collections.Counter()
        for r in d:
            v = r[campo]
            for x in (v if isinstance(v, list) else [v]): c[x] += 1
        print(f'\n{campo} → {len(c)} categorías')
        for k, n in c.most_common():
            print(f'   {n:>3}× {k}')

    if aplicar:
        RUTA.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding='utf-8')
        print('\nAPLICADO')
    else:
        print('\nSIMULACIÓN — usa --aplicar')

main('--aplicar' in sys.argv)
