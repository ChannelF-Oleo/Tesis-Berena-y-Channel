# -*- coding: utf-8 -*-
"""
FASE 2 · Depuración de la unidad de análisis.

Retira de las variables cerradas los valores cuya evidencia está fuera del texto
del titular (copy, comentarios, interfaz) y traslada esa evidencia al campo
«observaciones», donde sigue siendo material válido de contexto.

Uso:  python3 herramientas/fase2_depuracion.py [--aplicar]
"""
import json, sys, re
from pathlib import Path

RUTA = Path('Datos/gemini-code-1787586644203.json')

# codigo -> [(campo, valor exacto a retirar, nota que se traslada a observaciones)]
DEPURACION = {
 'T004': [
   ('densidadEmoji', '1–2 emojis', None),
   ('funcionEmoji', 'Fática', None),
   ('oralidad', 'Tuteo', None),
   ('captacion', 'Llamada a la acción (CTA)', None),
 ],
 'T007': [
   ('densidadEmoji', '3 o más emojis', None),
   ('funcionEmoji', 'Ornamental / Decorativa', None),
   ('captacion', 'Llamada a la acción (carrusel/>>>)', None),
 ],
 'T008': [
   ('oralidad', 'Tuteo', None),
   ('oralidad', 'Imperativos apelativos', None),
 ],
 'T013': [
   ('oralidad', 'Interpelación directa', None),
   ('oralidad', 'Preguntas directas al lector', None),
 ],
 'T017': [('oralidad', 'Uso de intensificadores coloquiales en cita («súper»)', None)],
 'T018': [('oralidad', 'Metáforas/expresiones populares en copy («la lluvia dijo presente»)', None)],
 'T019': [('oralidad', 'Muletillas y deícticos del habla oral en cita («tu ves»)', None)],
 'T022': [('oralidad', 'Uso de expresiones coloquiales en comentarios de usuarios', None)],
 'T027': [
   ('polifonia', 'Discurso referido indirecto (cita atributiva en copy)',
    'Discurso referido indirecto (cita atributiva)'),
   ('oralidad', 'Frases hechas / modismos en cita («ponerse los pantalones», «tomar el toro por los cuernos»)', None),
 ],
 'T032': [
   ('polifonia', 'Discurso referido de espectáculo (cita en copy)',
    'Discurso referido de espectáculo'),
   ('oralidad', 'Léxico coloquial urbano en cita («manin», «relajo»)', None),
 ],
 'T034': [('oralidad', 'Expresiones de orgullo territorial en comentarios de usuarios', None)],
 'T036': [
   ('densidadEmoji', '1', None),
   ('funcionEmoji', 'Directiva / Organizadora', None),
   ('oralidad', 'Frases hechas populares en copy («grito al cielo»)', None),
 ],
 'T043': [('oralidad', 'Jerga popular dominicana («beban una pastilla», «tenemos la coba guardada»)',
           'Jerga popular dominicana («beban una pastilla»)')],
 'T046': [
   ('densidadEmoji', '1–2 emojis', None),
   ('funcionEmoji', 'Fática/Señalizadora (✅ como marca de instrucción en el copy)', None),
   ('captacion', 'Llamada a la acción (CTA)', None),
 ],
}

# Nota que se añade a «observaciones» de cada ficha depurada.
NOTA = {
 'T004': 'El copy incorpora un llamado explícito a la interacción con emoji y tuteo («👉 Y tú, qué opinas?»), rasgos de oralidad fingida y apelación que no se trasladan al texto del titular, restringido al registro estándar.',
 'T007': 'La llamada a deslizar el carrusel es un elemento de interfaz de la publicación, ajeno al enunciado del titular; los emojis aparecen únicamente en el copy.',
 'T008': 'El copy recurre al tuteo y a formas imperativas de apelación directa que el titular, de estructura nominal de presentación, no reproduce.',
 'T013': 'El copy interpela directamente al lector con preguntas; el titular se limita a la cita atributiva de la fuente institucional.',
 'T017': 'En la entrevista y el copy aparecen intensificadores coloquiales («súper») que no llegan al titular.',
 'T018': 'El copy emplea expresiones populares de la crónica deportiva («la lluvia dijo presente») ausentes del titular.',
 'T019': 'La declaración recogida en el copy conserva muletillas del habla oral («tu ves») que el titular depura al citar solo el sintagma valorativo.',
 'T022': 'Las expresiones coloquiales registradas corresponden a los comentarios de los usuarios, no al enunciado del medio.',
 'T027': 'El copy despliega modismos de fuerte anclaje popular («ponerse los pantalones», «tomar el toro por los cuernos») que el titular sustituye por una formulación institucional neutra.',
 'T032': 'La aclaración de que el hecho «forma parte de alguna de las dinámicas del programa» y el léxico urbano («manin», «relajo») están en el copy; el titular mantiene deliberadamente la ambigüedad.',
 'T034': 'Las expresiones de orgullo territorial provienen de los comentarios de los usuarios, no del titular.',
 'T036': 'El copy recurre a una frase hecha popular («grito al cielo») y a un emoji de instrucción que el titular no incorpora.',
 'T043': 'De las dos expresiones de jerga registradas, solo «beban una pastilla» pertenece al titular; «tenemos la coba guardada» aparece en el copy.',
 'T046': 'El copy añade un emoji señalizador y un llamado a la acción ausentes del titular.',
}

def main(aplicar):
    d = json.loads(RUTA.read_text(encoding='utf-8'))
    idx = {r['codigo']: r for r in d}
    cambios = 0

    for cod, ops in DEPURACION.items():
        r = idx[cod]
        for campo, valor, reemplazo in ops:
            actual = r[campo]
            if isinstance(actual, list):
                if valor not in actual:
                    print(f'  ! {cod}.{campo}: no se encontró «{valor}»'); continue
                actual.remove(valor)
                if reemplazo:
                    actual.append(reemplazo)
                if not actual:
                    actual.append('Ninguno evidente' if campo == 'oralidad' else 'Ninguna evidente')
                r[campo] = actual
            else:
                if actual != valor:
                    print(f'  ! {cod}.{campo}: valor actual «{actual}» ≠ «{valor}»'); continue
                if campo == 'densidadEmoji':
                    r[campo] = '0'
                elif campo == 'funcionEmoji':
                    r[campo] = 'No aplica'
                else:
                    r[campo] = reemplazo or actual
            cambios += 1
            print(f'  · {cod}.{campo}: retirado «{valor}»' + (f' → «{reemplazo}»' if reemplazo else ''))

        nota = NOTA[cod]
        if nota not in r['observaciones']:
            r['observaciones'] = r['observaciones'].rstrip() + '\n\n' + nota
            print(f'  + {cod}.observaciones: nota de contexto añadida')

    print(f'\n{cambios} valores depurados en {len(DEPURACION)} fichas')
    if aplicar:
        RUTA.write_text(json.dumps(d, ensure_ascii=False, indent=2), encoding='utf-8')
        print('APLICADO sobre', RUTA)
    else:
        print('SIMULACIÓN — usa --aplicar para escribir')

main('--aplicar' in sys.argv)
