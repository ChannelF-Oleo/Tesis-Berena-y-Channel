#!/usr/bin/env python3
"""Auditoría de coherencia entre el instrumento y el corpus codificado.

Compila `web/src/lib/instrumento.ts` con esbuild, lo lee como fuente de verdad
y contrasta contra él las 50 fichas de `Datos/`. Comprueba cuatro cosas:

  A. Conformidad de valores   — todo valor cerrado existe en su lista.
  B. Conformidad de tipos     — múltiple = lista, única = cadena, sin repetidos.
  C. Opciones no observadas   — que la marca del instrumento coincide con el uso real.
  D. Unidad de análisis       — que cada marca tiene su evidencia en el titular.

Uso:  python3 herramientas/auditoria.py [--json]
"""
import json
import pathlib
import re
import subprocess
import sys
import tempfile
import unicodedata
from collections import Counter, defaultdict

RAIZ = pathlib.Path(__file__).resolve().parent.parent
CORPUS = RAIZ / 'Datos' / 'gemini-code-1787586644203.json'
FUENTE = RAIZ / 'web' / 'src' / 'lib' / 'instrumento.ts'


# ---------------------------------------------------------------- instrumento
def cargar_instrumento() -> list:
    with tempfile.TemporaryDirectory() as tmp:
        mjs = pathlib.Path(tmp) / 'instrumento.mjs'
        subprocess.run(
            ['npx', '--prefix', str(RAIZ / 'web'), 'esbuild', str(FUENTE),
             '--format=esm', f'--outfile={mjs}'],
            check=True, capture_output=True,
        )
        salida = subprocess.run(
            ['node', '-e',
             f'import({json.dumps(mjs.as_uri())}).then(m=>console.log(JSON.stringify(m.INSTRUMENTO)))'],
            check=True, capture_output=True, text=True,
        )
    return json.loads(salida.stdout)


def variables(instrumento) -> dict:
    return {v['clave']: v for s in instrumento for v in s['variables'] if v.get('clave')}


# ------------------------------------------------------------------ utilidades
EMOJI = re.compile(
    '[\U0001F000-\U0001FAFF☀-➿⬀-⯿️←-⇿⌀-⏿]'
)
COMILLAS = '"“”«»‘’\''
EXCLAMATIVAS = re.compile(r'\b(qu[ée]|cu[áa]nto?s?|c[óo]mo|qui[ée]n|cu[áa]n)\b', re.I)
SIGLA = re.compile(r'\b[A-ZÁÉÍÓÚÑ]{2,}\b')
# Siglas lexicalizadas que el medio escribe en caja mixta y que, por tanto,
# ningún patrón de mayúsculas puede reconocer (Minerd, Mescyt, Intrant…).
SIGLAS_MIXTAS = re.compile(r'\b(Minerd|Mescyt|Codessd|Intrant|Senasa|Indotel|Digesett|Inabie|Edeeste|Edesur|Edenorte)\b')
DECLARATIVO = re.compile(
    r'\b(dice|dijo|afirma|asegura|sostiene|se[ñn]ala|advierte|destaca|reitera|informa|'
    r'anuncia|explica|declara|aclara|revela|denuncia|pide|propone|critica|niega|'
    r'confirma|admite|considera|estima|augura|promete|llama|aboga|expresa|seg[úu]n)\w*\b', re.I)


def plano(t: str) -> str:
    return ''.join(c for c in unicodedata.normalize('NFD', t.lower()) if unicodedata.category(c) != 'Mn')


def lista(v) -> list:
    if v is None or v == '':
        return []
    return v if isinstance(v, list) else [v]


# ------------------------------------------------------------------ auditoría
def auditar(fichas, vars_) -> dict:
    hallazgos = defaultdict(list)
    uso = defaultdict(Counter)

    for f in fichas:
        cod = f['codigo']
        titular = f.get('titular', '')
        tit = plano(titular)

        # --- A y B: conformidad de valores y de tipos
        for clave, var in vars_.items():
            if var['tipo'] not in ('unica', 'multiple'):
                continue
            bruto = f.get(clave)
            valores = lista(bruto)
            if var['tipo'] == 'multiple' and bruto not in (None, '') and not isinstance(bruto, list):
                hallazgos['tipo'].append(f'{cod} · {clave}: selección múltiple codificada como cadena')
            if var['tipo'] == 'unica' and isinstance(bruto, list) and len(bruto) > 1:
                hallazgos['tipo'].append(f'{cod} · {clave}: selección única con {len(bruto)} valores')
            if len(valores) != len(set(valores)):
                hallazgos['tipo'].append(f'{cod} · {clave}: valor repetido')
            for v in valores:
                uso[clave][v] += 1
                if var.get('opciones') and v not in var['opciones']:
                    hallazgos['fuera'].append(f'{cod} · {clave}: «{v}» no figura en el instrumento')

        # --- D: unidad de análisis, cada marca contra el texto del titular
        if f.get('densidadEmoji') != '0' and not EMOJI.search(titular):
            hallazgos['unidad'].append(f'{cod}: densidad de emojis sin emoji en el titular')
        if f.get('densidadEmoji') == '0' and EMOJI.search(titular):
            hallazgos['unidad'].append(f'{cod}: hay emoji en el titular y la densidad está en cero')
        if (f.get('funcionEmoji') == 'No aplica') != (f.get('densidadEmoji') == '0'):
            hallazgos['unidad'].append(f'{cod}: función del emoji incoherente con la densidad')
        if 'Interrogativa' in lista(f.get('modalidad')) and '?' not in titular and '¿' not in titular:
            hallazgos['unidad'].append(f'{cod}: modalidad interrogativa sin signo de interrogación')
        if 'Exclamativa' not in lista(f.get('modalidad')) and (
                '!' in titular or '¡' in titular):
            hallazgos['unidad'].append(f'{cod}: hay signo de exclamación sin modalidad exclamativa')
        pol = f.get('polifonia', '')
        if re.search(r'(?<!in)directo', plano(pol)) and not any(c in titular for c in COMILLAS):
            hallazgos['unidad'].append(f'{cod}: discurso referido directo sin comillas en el titular')
        if 'indirecto' in plano(pol) and not DECLARATIVO.search(titular):
            hallazgos['unidad'].append(f'{cod}: discurso referido indirecto sin verbo declarativo')
        if ('Siglas y acrónimos' in lista(f.get('sintesis'))
                and not SIGLA.search(titular) and not SIGLAS_MIXTAS.search(titular)):
            hallazgos['unidad'].append(f'{cod}: siglas marcadas sin sigla en el titular')
        if 'Cita directa entrecomillada' in lista(f.get('sintesis')) and not any(c in titular for c in COMILLAS):
            hallazgos['unidad'].append(f'{cod}: cita entrecomillada sin comillas en el titular')
        if 'Preguntas directas al lector' in lista(f.get('oralidad')) and '¿' not in titular:
            hallazgos['unidad'].append(f'{cod}: pregunta al lector sin interrogación en el titular')
        for rasgo in lista(f.get('oralidad')):
            if rasgo == 'Ninguno evidente':
                continue
            esp = plano(f.get('oralidadEspecificacion', ''))
            if esp and esp.split('«')[0] and not any(p in tit for p in re.findall(r'\w+', esp) if len(p) > 4):
                hallazgos['unidad'].append(
                    f'{cod}: la especificación de oralidad «{f["oralidadEspecificacion"]}» no aparece en el titular')
                break

        # --- E: criterios de exclusión
        if not f.get('tieneTitularClaro', True):
            hallazgos['corpus'].append(f'{cod}: sin titular claramente identificable')
        for crit in ('esRepetidoSinCambios', 'esComunicadoSinEstructura', 'esPublicitario', 'sinTitularEscrito'):
            if f.get(crit):
                hallazgos['corpus'].append(f'{cod}: cumple el criterio de exclusión «{crit}»')

        # --- F: campos vacíos
        for clave, var in vars_.items():
            if var['tipo'] in ('criterio',):
                continue
            if clave in ('seccionSecundaria', 'estructuraEspecificacion', 'sintesisEspecificacion',
                         'polifoniaEspecificacion', 'actoHablaMatiz', 'captacionEncuadre',
                         'funcionEncuadre', 'oralidadEspecificacion', 'adjetivacionEspecificacion'):
                continue
            if not f.get(clave):
                hallazgos['vacio'].append(f'{cod} · {clave}: sin valor')

    # --- C: opciones declaradas frente a opciones usadas
    for clave, var in vars_.items():
        if not var.get('opciones'):
            continue
        sin_uso = [o for o in var['opciones'] if uso[clave][o] == 0]
        declaradas = var.get('noObservadas') or []
        for o in sin_uso:
            if o not in declaradas:
                hallazgos['no_observadas'].append(f'{clave}: «{o}» sin uso y sin marcar como no observada')
        for o in declaradas:
            if uso[clave][o]:
                hallazgos['no_observadas'].append(
                    f'{clave}: «{o}» marcada como no observada pero usada {uso[clave][o]} vez/veces')

    return {'hallazgos': dict(hallazgos), 'uso': {k: dict(v) for k, v in uso.items()}}


def main() -> None:
    fichas = json.loads(CORPUS.read_text(encoding='utf-8'))
    vars_ = variables(cargar_instrumento())
    res = auditar(fichas, vars_)
    if '--json' in sys.argv:
        print(json.dumps(res, ensure_ascii=False, indent=2))
        return
    titulos = {
        'fuera': 'A · Valores fuera del instrumento',
        'tipo': 'B · Conformidad de tipo',
        'no_observadas': 'C · Opciones no observadas',
        'unidad': 'D · Unidad de análisis (evidencia en el titular)',
        'corpus': 'E · Criterios de validación del corpus',
        'vacio': 'F · Campos obligatorios vacíos',
    }
    total = 0
    for clave, titulo in titulos.items():
        items = res['hallazgos'].get(clave, [])
        total += len(items)
        print(f'\n{titulo} — {len(items)}')
        for i in items:
            print(f'  · {i}')
    print(f'\n{len(fichas)} fichas · {len(vars_)} variables · {total} hallazgo(s)')


if __name__ == '__main__':
    main()
