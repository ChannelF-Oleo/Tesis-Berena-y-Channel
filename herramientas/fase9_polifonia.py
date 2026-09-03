#!/usr/bin/env python3
"""Fase 9 — Polifonía sin verbo declarativo en el titular.

La auditoría detectó siete fichas codificadas como «Discurso referido
indirecto (verbo declarativo)» cuyo titular no contiene verbo declarativo
alguno. La fuente existe —AFP, la Policía, el expediente judicial— pero vive
en el copy o en el pie de la publicación, no en la unidad de análisis. Bajo la
regla del Capítulo III, esos titulares hablan con voz propia del medio.

Se recodifican como «Voz monofónica periodística» y la fuente se conserva en
la especificación, marcada como contextual para que se lea como lo que es:
información de apoyo ajena al titular.

Idempotente.
"""
import json
import pathlib

CORPUS = pathlib.Path(__file__).resolve().parent.parent / 'Datos' / 'gemini-code-1787586644203.json'

DESTINO = 'Voz monofónica periodística'

FUENTE_CONTEXTUAL = {
    'T014': '',
    'T032': '[Fuente contextual: espectáculo]',
    'T036': '[Fuente contextual: vox populi]',
    'T037': '[Fuente contextual: AFP]',
    'T039': '[Fuente contextual: fuente policial]',
    'T049': '[Fuente contextual: AFP]',
    'T050': '[Fuente contextual: fuente judicial]',
}


def main() -> None:
    fichas = json.loads(CORPUS.read_text(encoding='utf-8'))
    cambios = 0
    for ficha in fichas:
        marca = FUENTE_CONTEXTUAL.get(ficha['codigo'])
        if marca is None:
            continue
        if ficha['polifonia'] != DESTINO or ficha.get('polifoniaEspecificacion', '') != marca:
            ficha['polifonia'] = DESTINO
            ficha['polifoniaEspecificacion'] = marca
            cambios += 1
    CORPUS.write_text(json.dumps(fichas, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    reparto = {}
    for f in fichas:
        reparto[f['polifonia']] = reparto.get(f['polifonia'], 0) + 1
    print(f'{cambios} ficha(s) recodificada(s)')
    for k, v in sorted(reparto.items(), key=lambda x: -x[1]):
        print(f'  {v:>2}  {k}')


if __name__ == '__main__':
    main()
