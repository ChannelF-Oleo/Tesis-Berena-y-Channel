# -*- coding: utf-8 -*-
"""
FASE 5b · Desdoblamiento de oralidad y adjetivación (mismo patrón del paréntesis)
          y recuperación de los falsos negativos confirmados en la auditoría.

Uso:  python3 herramientas/fase5b_oralidad_adjetivacion.py [--aplicar]
"""
import json, sys
from pathlib import Path

RUTA = Path('Datos/gemini-code-1787586644203.json')

ORALIDAD = {
 'Frases hechas / modismos («de milagro»)':            ('Frases hechas', 'de milagro'),
 'Jerga popular dominicana («beban una pastilla»)':    ('Dominicanismos o jerga local', 'beban una pastilla'),
 'Léxico coloquial en cita («invento»)':               ('Léxico coloquial', 'invento'),
 'Sintaxis oral popular en cita («donde quiera que está»)': ('Sintaxis oral popular', 'donde quiera que está'),
 'Metáforas del habla popular':                        ('Metáforas del habla popular', ''),
 'Marcadores conversacionales':                        ('Marcadores conversacionales', ''),
 'Preguntas directas al lector':                       ('Preguntas directas al lector', ''),
 'Dominicanismos o jerga local':                       ('Dominicanismos o jerga local', ''),
 'Ninguno evidente':                                   ('Ninguno evidente', ''),
}

ADJETIVACION = {
 'Adjetivos calificativos':              ('Adjetivos calificativos', ''),
 'Adjetivos y participios':              ('Adjetivos calificativos', 'con participios en función adjetiva'),
 'Adjetivos y sintagmas modificadores':  ('Adjetivos calificativos', 'con sintagmas modificadores'),
 'Ninguna dominante':                    ('Ninguna dominante', ''),
}

# Falsos negativos confirmados contra el texto del titular en la auditoría.
RECUPERADOS = {
 'T048': [('oralidad', 'Frases hechas', 'tarde o temprano')],   # locución fija, estaba «Ninguno evidente»
 'T016': [('adjetivacion', 'Adjetivos valorativos', 'exclusivo')],
 'T030': [('adjetivacion', 'Adjetivos valorativos', 'Excelencia')],
 'T037': [('adjetivacion', 'Adjetivos valorativos', 'masivas')],
}

def main(aplicar):
    d = json.loads(RUTA.read_text(encoding='utf-8'))
    idx = {r['codigo']: r for r in d}
    log = []

    for r in d:
        bases, esps = [], []
        for v in r['oralidad']:
            b, e = ORALIDAD.get(v, (v, ''))
            if b != v:
                log.append(f'{r["codigo"]} oralidad: «{v}» → «{b}»' + (f' + esp «{e}»' if e else ''))
            if b not in bases: bases.append(b)
            if e: esps.append(e)
        r['oralidad'] = bases
        r['oralidadEspecificacion'] = '; '.join(esps)

        v = r['adjetivacion']
        b, e = ADJETIVACION.get(v, (v, ''))
        if b != v:
            log.append(f'{r["codigo"]} adjetivacion: «{v}» → «{b}» + esp «{e}»')
        r['adjetivacion'] = b
        r['adjetivacionEspecificacion'] = e

    for cod, ops in RECUPERADOS.items():
        r = idx[cod]
        for campo, valor, esp in ops:
            if campo == 'oralidad':
                if 'Ninguno evidente' in r['oralidad']:
                    r['oralidad'].remove('Ninguno evidente')
                if valor not in r['oralidad']:
                    r['oralidad'].append(valor)
                r['oralidadEspecificacion'] = '; '.join(filter(None, [r['oralidadEspecificacion'], esp]))
            else:
                r[campo] = valor
                r['adjetivacionEspecificacion'] = esp
            log.append(f'{cod} {campo}: recuperado «{valor}» (esp. «{esp}»)')

    print('\n'.join(log))
    print(f'\n{len(log)} cambios')
    import collections
    print('oralidad:', dict(collections.Counter(x for r in d for x in r['oralidad'])))
    print('adjetivacion:', dict(collections.Counter(r['adjetivacion'] for r in d)))

    if aplicar:
        RUTA.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding='utf-8')
        print('APLICADO')
    else:
        print('SIMULACIÓN')

main('--aplicar' in sys.argv)
