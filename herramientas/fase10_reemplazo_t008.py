#!/usr/bin/env python3
"""Fase 10 — Sustitución de T008.

La ficha anterior de T008 («EDUARDO RAMOS. Representante Asociación Dominicana
de Administradoras de Riesgos de Salud (ADARS)») era la tarjeta de un programa
del propio periódico: autopromoción editorial, y por tanto un caso limítrofe
con el cuarto criterio de exclusión. Se sustituye por una pieza de cobertura de
agenda institucional que conserva el mismo tipo de objeto —entidad como agente,
función propagandística secundaria— sin que el medio se promueva a sí mismo.

Nueva T008: «Codessd celebra su tradicional encuentro navideño», 22/12/2025.

Idempotente.
"""
import json
import pathlib

CORPUS = pathlib.Path(__file__).resolve().parent.parent / 'Datos' / 'gemini-code-1787586644203.json'

FICHA = {
    "id": "3f5a0c21-9d64-4e18-b7ac-52c0e1f9a7d3",
    "codigo": "T008",
    "fecha": "2025-12-22",
    "tipoEntrada": "Reel",
    "seccion": "Social/Comunidad",
    "titular": "Codessd celebra su tradicional encuentro navideño",
    "enlace": "https://www.instagram.com/reels/DSkjyC6DrZS/",
    "tieneTitularClaro": True,
    "esRepetidoSinCambios": False,
    "esComunicadoSinEstructura": False,
    "esPublicitario": False,
    "sinTitularEscrito": False,
    "modalidad": ["Enunciativa"],
    "estructuraSintactica": "Simple",
    "sintesis": ["Siglas y acrónimos", "Personificación sintáctica"],
    "deixis": ["Institucional", "Temporal"],
    "cargaLexica": ["Estándar"],
    "adjetivacion": "Adjetivos calificativos",
    "figuras": ["Metonimia", "Personificación"],
    "polifonia": "Voz monofónica periodística",
    "actoHabla": ["Asertivo"],
    "captacion": ["Promoción institucional", "Incompleción informativa"],
    "oralidad": ["Ninguno evidente"],
    "densidadEmoji": "0",
    "funcionEmoji": "No aplica",
    "coherencia": "Convergente",
    "funcionDominante": ["Informativa", "Propagandística/Persuasiva"],
    "funcionComunicativa": (
        "Informativa de agenda institucional / persuasiva secundaria "
        "(legitimación por tradición y proyección de cohesión gremial)"
    ),
    "interpretacion": (
        "El titular reproduce el patrón de la cobertura de agenda institucional: sujeto "
        "colectivo, verbo de acción en presente y complemento que nombra el acto sin "
        "describirlo. La estructura es simple y no hay verbo declarativo ni marca de "
        "atribución dentro de la unidad de análisis, de modo que el medio asume el enunciado "
        "en voz propia y la responsabilidad enunciativa recae íntegramente en el periódico.\n\n"
        "La sigla «Codessd» concentra la operación de síntesis. Siete letras sustituyen a "
        "«Consejo de Desarrollo Económico y Social de Santo Domingo», y con ellas el titular da "
        "por conocido un referente institucional que nunca desarrolla: en los términos de la "
        "Teoría de la Relevancia, apuesta a que recuperar el referente cueste al lector menos "
        "esfuerzo que procesar el nombre completo. El sujeto así abreviado actúa además como "
        "agente de un verbo que solo ejecutan personas —«celebra»—, lo que produce la "
        "personificación sintáctica de la entidad y, por metonimia, hace que el consejo ocupe "
        "el lugar de sus miembros.\n\n"
        "El adjetivo «tradicional» es la pieza persuasiva del enunciado: no describe el "
        "encuentro, lo legitima. Al presentarlo como repetición de una costumbre establecida, "
        "convierte un acto puntual en continuidad institucional y aporta el matiz de prestigio "
        "que sostiene la función propagandística secundaria."
    ),
    "observaciones": (
        "La pieza ilustra la cobertura de agenda que el medio dedica a organismos y gremios: el "
        "titular no informa de un hecho noticioso en sentido estricto, sino que registra la "
        "actividad social de una institución. El encuadre resultante, en el sentido de van Dijk, "
        "es de cohesión gremial: la macroestructura no es «hubo un coctel» sino «el consejo "
        "mantiene y renueva sus vínculos».\n\n"
        "Conviene precisar por qué la ficha no cae bajo el cuarto criterio de exclusión. El "
        "contenido es promocional en su efecto, porque proyecta la imagen de una entidad, pero "
        "no es publicidad: no hay contraprestación visible, la pieza está firmada por la "
        "redacción y el organismo promovido es un tercero y no el propio periódico. El criterio "
        "excluye la publicidad y la promoción comercial, no la cobertura de agenda "
        "institucional, que es precisamente uno de los usos del titular que esta investigación "
        "se propone describir.\n\n"
        "En el plano multimodal la coherencia entre texto e imagen es convergente: el rótulo "
        "«NOVEDADES» sobre franja negra encabeza la tarjeta roja del titular y el Reel muestra "
        "el salón del encuentro con el logotipo del Codessd sobre la puerta y los asistentes "
        "saludándose, de modo que la gráfica documenta el mismo acto que el texto nombra.\n\n"
        "Como contexto, y fuera de la unidad de análisis, el copy amplía con la cita textual que "
        "el propio Codessd publicó en sus redes («Fue una hermosa ocasión para reunir a nuestros "
        "miembros y aliados estratégicos…»), voz institucional que el titular no reproduce."
    ),
    "seccionSecundaria": "Gremial",
    "actoHablaMatiz": "",
    "actoHablaReferido": "No aplica",
    "estructuraEspecificacion": "sujeto institucional + predicado transitivo",
    "sintesisEspecificacion": "Codessd (Consejo de Desarrollo Económico y Social de Santo Domingo)",
    "polifoniaEspecificacion": "[Fuente contextual: comunicación institucional del Codessd]",
    "captacionEncuadre": "Cohesión gremial / imagen institucional",
    "funcionEncuadre": "Agenda institucional",
    "oralidadEspecificacion": "",
    "adjetivacionEspecificacion": "tradicional (matiz legitimador); navideño",
}


def main() -> None:
    fichas = json.loads(CORPUS.read_text(encoding='utf-8'))
    orden = list(fichas[0].keys())
    for i, ficha in enumerate(fichas):
        if ficha['codigo'] == 'T008':
            fichas[i] = {clave: FICHA[clave] for clave in orden}
            break
    else:
        raise SystemExit('no se encontró T008')
    CORPUS.write_text(json.dumps(fichas, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print('T008 sustituida:', FICHA['titular'])


if __name__ == '__main__':
    main()
