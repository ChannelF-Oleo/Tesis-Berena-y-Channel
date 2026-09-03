#!/usr/bin/env python3
"""Fase 8 — Retiro de la rúbrica «Nacionales» de la sección temática.

«Nacionales» no es una materia: es el rótulo con que la gráfica del periódico
encabeza la tarjeta. En un diario de circulación nacional, todo lo que no sea
internacional es nacional, de modo que la etiqueta no discrimina nada y rompía
la agregación por sección. Las dos fichas que la llevaban se reasignan por
contenido; ambas proceden de la misma rueda de prensa del Ministerio de
Interior y Policía y comparten el ámbito cruzado de la seguridad ciudadana.

  T045  cifras de homicidios .................. Judicial · Seguridad ciudadana
  T046  ruido, bocinas y convivencia vecinal ... Social/Comunidad · Seguridad ciudadana

Idempotente: puede ejecutarse varias veces sin efecto adicional.
"""
import json
import pathlib

CORPUS = pathlib.Path(__file__).resolve().parent.parent / 'Datos' / 'gemini-code-1787586644203.json'

REASIGNACION = {
    'T045': ('Judicial', 'Seguridad ciudadana'),
    'T046': ('Social/Comunidad', 'Seguridad ciudadana'),
}


def main() -> None:
    fichas = json.loads(CORPUS.read_text(encoding='utf-8'))
    cambios = 0
    for ficha in fichas:
        destino = REASIGNACION.get(ficha['codigo'])
        if destino and (ficha['seccion'], ficha.get('seccionSecundaria', '')) != destino:
            ficha['seccion'], ficha['seccionSecundaria'] = destino
            cambios += 1
    restantes = [f['codigo'] for f in fichas if f['seccion'] == 'Nacionales']
    CORPUS.write_text(json.dumps(fichas, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{cambios} ficha(s) reasignada(s); «Nacionales» restantes: {restantes or "ninguna"}')




# --- Addendum: normalización de una deixis compuesta detectada por la auditoría.
# «Crítica/Ideológica» funde dos marcas que el instrumento ya distingue: la
# orientación ideológica del enunciado y su carga valorativa.
DEIXIS_COMPUESTA = {'Crítica/Ideológica': ['Ideológica', 'Valorativa']}


def normalizar_deixis() -> None:
    fichas = json.loads(CORPUS.read_text(encoding='utf-8'))
    cambios = 0
    for ficha in fichas:
        original = ficha.get('deixis', [])
        nueva, tocada = [], False
        for valor in original:
            if valor in DEIXIS_COMPUESTA:
                tocada = True
                nueva.extend(v for v in DEIXIS_COMPUESTA[valor] if v not in nueva)
            elif valor not in nueva:
                nueva.append(valor)
        if tocada:
            ficha['deixis'] = nueva
            cambios += 1
    if cambios:
        CORPUS.write_text(json.dumps(fichas, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{cambios} ficha(s) con deixis compuesta desdoblada')


if __name__ == '__main__':
    main()
    normalizar_deixis()
