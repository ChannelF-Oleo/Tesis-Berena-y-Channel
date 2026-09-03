#!/usr/bin/env python3
"""Fase 7 — Anclaje teórico y reescritura de T004.

La auditoría mostró que los marcos del Capítulo II estaban repartidos de forma
desigual en las fichas: la multimodalidad aparecía en 49 de 50 y la Teoría de
la Relevancia en 3, pese a sostener el objetivo específico 1. El desequilibrio
era de redacción, no de análisis: las fichas describían la elipsis y la
economía expresiva sin nombrar a Sperber y Wilson, y la oralidad fingida sin
nombrar a Koch y Oesterreicher.

Este paso nombra el marco allí donde el fenómeno ya estaba descrito y no añade
ningún dato nuevo. Además reescribe T004, la única ficha por debajo del
estándar del corpus, y corrige dos valores suyos que la relectura del titular
no sostiene.

Idempotente: el texto solo se añade si no está ya presente.
"""
import json
import pathlib

CORPUS = pathlib.Path(__file__).resolve().parent.parent / 'Datos' / 'gemini-code-1787586644203.json'

# Teoría de la Relevancia (Sperber y Wilson) — objetivo específico 1.
RELEVANCIA = {
    'T002':
        'Desde la Teoría de la Relevancia (Sperber y Wilson), la elipsis del sujeto en el '
        'segundo miembro y la supresión del nexo abaratan el procesamiento: el lector '
        'recupera el referente sin coste apreciable y el enunciado reserva para la posición '
        'final el supuesto de mayor efecto cognitivo, el nombre del actor.',
    'T007':
        'Leído desde la Teoría de la Relevancia (Sperber y Wilson), el sintagma preposicional '
        'sin verbo ni nexo entrega en cuatro palabras un trayecto biográfico completo: el '
        'lector infiere el proceso de transformación sin que el titular lo enuncie, y el '
        'esfuerzo ahorrado se reinvierte en la pregunta que le sigue.',
    'T022':
        'La nominalización condensa en un solo sustantivo la acción, sus participantes y su '
        'duración. En los términos de Sperber y Wilson, el titular alcanza así el equilibrio '
        'que define la relevancia: esfuerzo de procesamiento mínimo y efecto contextual —aquí, '
        'emotivo— máximo.',
    'T026':
        'La tercera persona del plural sin sujeto explícito ahorra al lector la identificación '
        'de un agente irrelevante para el hecho y concentra el efecto cognitivo en el '
        'desenlace. Es la economía que describe la Teoría de la Relevancia: se retienen los '
        'supuestos que rinden y se descartan los que cuestan más de lo que aportan.',
    'T033':
        'La Teoría de la Relevancia explica esta selección: el titular conserva únicamente los '
        'supuestos que producen efecto contextual —hay rescate, hay víctimas, hay lugar— y '
        'delega en el copy aquellos cuyo procesamiento exigiría al lector más esfuerzo del que '
        'compensa en el desplazamiento del feed.',
    'T036':
        'La anteposición de la cifra al verbo altera el orden no marcado para situar en primera '
        'posición el dato de mayor rendimiento cognitivo. En los términos de Sperber y Wilson, '
        'el titular ordena sus supuestos por relevancia y no por sintaxis.',
    'T041':
        '«Por segunda ocasión» comprime un antecedente completo —una primera elección y un '
        'mandato cumplido— en tres palabras cuya inferencia el lector realiza sin coste '
        'apreciable. La relación entre esfuerzo y efecto que formulan Sperber y Wilson opera '
        'aquí como principio de redacción.',
    'T042':
        'La cadena de complementos sin nexos subordinantes entrega la medida completa en una '
        'sola lectura. Desde la Teoría de la Relevancia, el titular maximiza el efecto '
        'contextual —cuánto, a quién y cuándo— y traslada al copy el mecanismo fiscal, cuyo '
        'procesamiento resultaría más costoso que rentable en la gráfica.',
}

# Variación lingüística: inmediatez y distancia comunicativa (Koch y Oesterreicher) — OE 3.
VARIACION = {
    'T005':
        'Koch y Oesterreicher permiten situar el enunciado en el polo de la inmediatez '
        'comunicativa: «otra vez» es un marcador propio de la conversación y la personificación '
        'del dólar «con sueño» procede del habla cotidiana. Ambos rasgos, trasladados a un '
        'soporte gráfico y planificado, son la definición misma de la oralidad fingida.',
    'T013':
        'La cita conserva el registro de la inmediatez comunicativa en el sentido de Koch y '
        'Oesterreicher: «calma» e «invento» pertenecen al intercambio cara a cara, y el titular '
        'los preserva en lugar de reformularlos en el registro de distancia que corresponde al '
        'discurso institucional que los enmarca.',
    'T015':
        '«De milagro» es una locución del habla cotidiana incrustada en un enunciado por lo '
        'demás construido según la norma escrita. En el continuo de Koch y Oesterreicher, esa '
        'sola expresión desplaza el titular hacia la inmediatez y aporta la valoración que la '
        'sintaxis, impersonal, evita formular.',
    'T021':
        'La sintaxis de la cita —tópico antepuesto y concordancia libre— reproduce la '
        'construcción oral sin corregirla. En el continuo de Koch y Oesterreicher, el discurso '
        'referido directo funciona como una ventana de inmediatez comunicativa abierta dentro '
        'de un formato escrito de distancia.',
    'T043':
        'La jerga deportiva de la cita pertenece de lleno al polo de la inmediatez comunicativa '
        'de Koch y Oesterreicher. El medio no la traduce ni la atenúa: la conserva entrecomillada, '
        'de modo que la proximidad léxica queda atribuida al hablante y no al periódico.',
    'T046':
        '«Bocinas», dominicanismo por altavoces, introduce una marca de proximidad léxica en un '
        'enunciado de fuente institucional. Koch y Oesterreicher permiten leer esa mezcla como '
        'un punto intermedio del continuo: el titular administra la distancia del comunicado y '
        'la inmediatez del término con que la comunidad nombra el objeto.',
    'T048':
        'La locución «tarde o temprano» y el uso de «caer» en su acepción popular pertenecen al '
        'repertorio de la inmediatez comunicativa que describen Koch y Oesterreicher. Su '
        'entrecomillado traslada al hablante la responsabilidad del registro y permite al medio '
        'conservar la fuerza admonitoria sin asumirla.',
}

# Macroestructura semántica y encuadre (van Dijk) — eje transversal del ACD.
ENCUADRE = {
    'T010':
        'En términos de van Dijk, el titular no resume la noticia: construye su macroestructura '
        'semántica. Al elegir el desacuerdo —y no el proyecto de fusión— como proposición '
        'dominante, fija el encuadre de fiscalización política desde el que se leerá todo lo '
        'demás.',
    'T025':
        'La selección de la proposición dominante es, en el sentido de van Dijk, un acto de '
        'encuadre: el titular podría haber tematizado el debate migratorio y tematiza en cambio '
        'la crítica al organismo, con lo que la macroestructura resultante es de fiscalización '
        'y no de política pública.',
    'T029':
        'La macroestructura semántica que propone el titular, en el sentido de van Dijk, no es '
        'la del endeudamiento como fenómeno económico sino la de su atribución partidaria. El '
        'encuadre convierte un dato de finanzas públicas en un enunciado de confrontación '
        'política.',
    'T035':
        'El encuadre, en el sentido de van Dijk, se decide en la ordenación: el soborno ocupa la '
        'posición temática y la designación oficial queda subordinada a él. La macroestructura '
        'resultante inscribe el caso en el marco de la corrupción institucional antes de que el '
        'lector acceda a un solo detalle del expediente.',
}

T004_INTERPRETACION = (
    'Único titular del corpus que interpela a la audiencia en lugar de informarla. La modalidad '
    'interrogativa rompe el patrón enunciativo que domina la muestra —47 de 50 titulares— y '
    'convierte la tarjeta en una consulta abierta cuyo destinatario es el propio lector y no una '
    'fuente citada. De ahí que la polifonía sea interactiva y que el acto de habla del medio, por '
    'una sola vez en toda la muestra, no sea asertivo sino directivo: la pregunta pide respuesta.\n\n'
    'El núcleo de la operación está en «adictos». El término traslada al terreno del juicio moral '
    'una conducta que el enunciado no describe ni mide, y su carácter hiperbólico funciona como '
    'presuposición: la pregunta no interroga si existe adicción, sino que la instala como marco y '
    'deja al lector la tarea de confirmarla o rebatirla. La sigla «RD» aporta el anclaje deíctico '
    'espacial al mínimo coste, y la estructura copulativa simple mantiene el enunciado en el '
    'umbral de esfuerzo que la Teoría de la Relevancia atribuye al titular de feed: el efecto '
    'cognitivo no procede de la información aportada, que es nula, sino de la posición que el '
    'lector se ve empujado a tomar.'
)

T004_OBSERVACIONES = (
    'El titular no reporta un hecho: propone un tema. Es la única pieza de la muestra que opera '
    'como sondeo, y explica por qué la variable de polifonía registra un solo caso de consulta al '
    'público. La pregunta abierta sustituye aquí a la incompleción informativa como mecanismo de '
    'captación, sin necesidad de ocultar ningún dato.\n\n'
    'En el plano multimodal la coherencia entre texto e imagen es convergente: el formato Reel '
    'vertical muestra una encuesta de calle con micrófono corporativo, de modo que la gráfica '
    'anticipa visualmente el tipo de respuesta que el titular solicita.\n\n'
    'Como contexto, y fuera de la unidad de análisis, el copy sí despliega los rasgos de '
    'proximidad que el titular no reproduce: emoji señalizador, tuteo y llamada explícita a '
    'comentar («👉 Y tú, qué opinas?»). Esa separación de registros entre el copy y la gráfica se '
    'repite en todo el corpus.'
)


def main() -> None:
    fichas = json.loads(CORPUS.read_text(encoding='utf-8'))
    añadidos = 0
    for ficha in fichas:
        for mapa in (RELEVANCIA, VARIACION, ENCUADRE):
            parrafo = mapa.get(ficha['codigo'])
            if parrafo and parrafo not in ficha['interpretacion']:
                ficha['interpretacion'] = ficha['interpretacion'].rstrip() + '\n\n' + parrafo
                añadidos += 1
        if ficha['codigo'] == 'T004':
            ficha['interpretacion'] = T004_INTERPRETACION
            ficha['observaciones'] = T004_OBSERVACIONES
            # La relectura del titular no sostiene el dominicanismo: «RD» es una sigla,
            # no una marca de habla local. «Adictos» sí es valorativo y no meramente
            # calificativo, por lo que se reclasifica y se especifica.
            ficha['cargaLexica'] = ['Estándar', 'Emocional/Valorativo']
            ficha['adjetivacion'] = 'Adjetivos valorativos'
            ficha['adjetivacionEspecificacion'] = 'adictos'
    CORPUS.write_text(json.dumps(fichas, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'{añadidos} párrafo(s) de anclaje teórico añadido(s); T004 reescrita')


if __name__ == '__main__':
    main()
