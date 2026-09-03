import React, { useState, useEffect, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, LabelList,
} from "recharts";
import {
  Plus, X, Search, Trash2, Pencil, Download, LayoutDashboard, Table2,
  AlertTriangle, CheckCircle2, XCircle, Copy, Upload, RotateCcw, ChevronDown, ChevronUp,
} from "lucide-react";

/* ---------------------------------------------------------------------- */
/*  Diccionario de variables (idéntico al instrumento del Capítulo III)   */
/* ---------------------------------------------------------------------- */

const TIPOS_ENTRADA = ["Publicación", "Reel", "Carrusel", "Video"];
const SECCIONES = [
  "Política", "Económica", "Social/Comunidad", "Judicial", "Cultural", "Deportiva",
  "Tecnológica", "Científica", "Ambiental", "Internacional", "Entretenimiento",
  "Opinión", "Interés general",
];
const MODALIDAD = ["Enunciativa", "Interrogativa", "Exclamativa", "Exhortativa", "Desiderativa", "Dubitativa"];
const ESTRUCTURA_SINTACTICA = [
  "Simple",
  "Bimembre yuxtapuesta (dos proposiciones)",
  "Estructura con dos puntos (planteamiento + resolución)",
  "Coordinada",
  "Subordinada",
  "Enumerativa",
];
const SINTESIS = [
  "Elipsis verbal", "Elipsis nominal", "Elipsis de nexos/conjunciones",
  "Nominalización extrema", "Siglas y acrónimos",
  "Síntesis referencial mediante nombres propios (hidrónimos/antropónimos)",
  "Apócope/aféresis", "Abreviaturas", "Sustitución icónica", "Ninguno evidente",
];
const DEIXIS = ["Temporal", "Espacial", "Social", "Ninguna evidente"];
const CARGA_LEXICA = ["Estándar", "Coloquial/Dominicanismo", "Tecnicismo", "Emocional/Valorativo"];
const ADJETIVACION = ["Adjetivos calificativos", "Adjetivos valorativos", "Ninguna dominante"];
const FIGURAS = ["Metáfora", "Hipérbole", "Ironía/Sarcasmo", "Eufemismo", "Metonimia", "Personificación", "Ninguna evidente"];
const POLIFONIA = [
  "Voz monofónica institucional",
  "Voz monofónica periodística",
  "Discurso referido directo (cita textual)",
  "Discurso referido indirecto (verbo declarativo: asegura, afirma…)",
  "Polifonía interactiva (consulta/sondeo al público)",
  "Combinación de voces",
];
const ACTO_HABLA = ["Asertivo", "Directivo", "Expresivo", "Compromisorio", "Declarativo"];
const CAPTACION = [
  "Referencia informativa directa (sin ocultamiento)",
  "Incompleción informativa",
  "Promesa emocional",
  "Referencia ambigua",
  "Pregunta retórica",
  "Llamada a la acción (CTA)",
  "Ninguna evidente",
];
const ORALIDAD = ["Tuteo", "Interjecciones/exclamaciones", "Preguntas directas al lector", "Dominicanismos o jerga local", "Frases hechas", "Marcadores conversacionales", "Ninguno evidente"];
const DENSIDAD_EMOJI = ["0", "1–2 emojis", "3 o más emojis"];
const FUNCION_EMOJI = ["Fática", "Sustitutiva", "Modalizadora", "Ornamental/Decorativa", "No aplica"];
const COHERENCIA = ["Convergente", "Divergente"];
const FUNCION_DOMINANTE = ["Informativa", "Apelativa/Conativa", "Emotiva/Expresiva", "Fática", "Propagandística/Persuasiva", "Interactiva (engagement)"];

const emptyEntry = () => ({
  id: "",
  codigo: "",
  fecha: "",
  tipoEntrada: TIPOS_ENTRADA[0],
  seccion: SECCIONES[2],
  titular: "",
  enlace: "",
  // checklist de validación (Cap. III, 3.5)
  tieneTitularClaro: true,
  esRepetidoSinCambios: false,
  esComunicadoSinEstructura: false,
  esPublicitario: false,
  sinTitularEscrito: false,
  // categoría 1
  modalidad: MODALIDAD[0],
  estructuraSintactica: ESTRUCTURA_SINTACTICA[0],
  sintesis: [],
  deixis: [],
  cargaLexica: [],
  adjetivacion: ADJETIVACION[2],
  figuras: [],
  // categoría 2
  polifonia: POLIFONIA[0],
  actoHabla: ACTO_HABLA[0],
  captacion: [],
  // categoría 3
  oralidad: [],
  // categoría 4
  densidadEmoji: DENSIDAD_EMOJI[0],
  funcionEmoji: FUNCION_EMOJI[4],
  coherencia: COHERENCIA[0],
  // cierre
  funcionDominante: [],
  funcionComunicativa: "",
  interpretacion: "",
  observaciones: "",
});

function isValido(e) {
  return (
    e.tieneTitularClaro &&
    !e.esRepetidoSinCambios &&
    !e.esComunicadoSinEstructura &&
    !e.esPublicitario &&
    !e.sinTitularEscrito
  );
}

function exclusionReasons(e) {
  const r = [];
  if (!e.tieneTitularClaro) r.push("No tiene titular escrito claramente identificable");
  if (e.esRepetidoSinCambios) r.push("Publicación repetida sin cambios relevantes");
  if (e.esComunicadoSinEstructura) r.push("Comunicado institucional sin estructura de titular");
  if (e.esPublicitario) r.push("Contenido publicitario o comercial");
  if (e.sinTitularEscrito) r.push("Reel/video sin titular escrito");
  return r;
}

function nextCodigo(entries) {
  const nums = entries
    .map((e) => parseInt((e.codigo || "").replace(/\D/g, ""), 10))
    .filter((n) => !isNaN(n));
  const next = (nums.length ? Math.max(...nums) : 0) + 1;
  return "T" + String(next).padStart(3, "0");
}

const STORAGE_KEY = "matriz-titulares-v1";

/* ---------------------------------------------------------------------- */
/*  Pequeños helpers de UI                                                */
/* ---------------------------------------------------------------------- */

function Field({ label, children, hint }) {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className="input" value={value} onChange={(ev) => onChange(ev.target.value)}>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

function CheckGroup({ value, onChange, options }) {
  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };
  return (
    <div className="check-grid">
      {options.map((opt) => (
        <label key={opt} className={"chip " + (value.includes(opt) ? "chip-on" : "")}>
          <input
            type="checkbox"
            checked={value.includes(opt)}
            onChange={() => toggle(opt)}
            style={{ display: "none" }}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

function StatCard({ label, value, tone }) {
  return (
    <div className={"stat-card " + (tone || "")}>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Gráfico de distribución (recharts)                                    */
/* ---------------------------------------------------------------------- */

function DistChart({ title, data, colorVar }) {
  if (!data.length) return null;
  const total = data.reduce((a, b) => a + b.value, 0);
  return (
    <div className="chart-card">
      <div className="chart-title">{title}</div>
      <ResponsiveContainer width="100%" height={Math.max(120, data.length * 34)}>
        <BarChart data={data} layout="vertical" margin={{ top: 4, right: 28, left: 0, bottom: 4 }}>
          <CartesianGrid strokeDasharray="2 4" stroke="var(--rule)" horizontal={false} />
          <XAxis type="number" hide />
          <YAxis
            type="category"
            dataKey="name"
            width={170}
            tick={{ fontSize: 12, fill: "var(--ink-soft)" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            formatter={(v) => [`${v} (${((v / total) * 100).toFixed(1)}%)`, "n"]}
            contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--rule)" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={18}>
            {data.map((_, i) => (
              <Cell key={i} fill={colorVar} />
            ))}
            <LabelList dataKey="value" position="right" style={{ fontSize: 11, fill: "var(--ink-soft)" }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function countBy(entries, key, { multi = false } = {}) {
  const map = new Map();
  entries.forEach((e) => {
    const v = e[key];
    const vals = multi ? (Array.isArray(v) ? v : []) : [v];
    vals.forEach((val) => {
      if (!val) return;
      map.set(val, (map.get(val) || 0) + 1);
    });
  });
  return Array.from(map.entries())
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

/* ---------------------------------------------------------------------- */
/*  Formulario modal                                                      */
/* ---------------------------------------------------------------------- */

function EntryForm({ initial, onSave, onClose }) {
  const [data, setData] = useState(initial);
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  const valido = isValido(data);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">Ficha de codificación</div>
            <h2 className="modal-title">{data.codigo || "Nuevo titular"}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>

        <div className="modal-body">
          {/* Identificación */}
          <section className="form-section">
            <h3 className="section-title">1 · Identificación de la publicación</h3>
            <div className="grid-3">
              <Field label="Código">
                <input className="input" value={data.codigo} onChange={(e) => set("codigo")(e.target.value)} />
              </Field>
              <Field label="Fecha de publicación">
                <input type="date" className="input" value={data.fecha} onChange={(e) => set("fecha")(e.target.value)} />
              </Field>
              <Field label="Tipo de entrada">
                <Select value={data.tipoEntrada} onChange={set("tipoEntrada")} options={TIPOS_ENTRADA} />
              </Field>
            </div>
            <div className="grid-2">
              <Field label="Sección temática dominante">
                <Select value={data.seccion} onChange={set("seccion")} options={SECCIONES} />
              </Field>
              <Field label="Enlace directo (Instagram)">
                <input className="input" placeholder="https://instagram.com/p/..." value={data.enlace} onChange={(e) => set("enlace")(e.target.value)} />
              </Field>
            </div>
            <Field label="Titular / texto principal analizado" hint="Copia el texto exacto que funciona como titular, no la descripción genérica de la publicación.">
              <textarea className="input textarea" rows={3} value={data.titular} onChange={(e) => set("titular")(e.target.value)} />
            </Field>
          </section>

          {/* Validación */}
          <section className={"form-section validation " + (valido ? "validation-ok" : "validation-bad")}>
            <h3 className="section-title">2 · Validación del corpus (criterios de inclusión/exclusión, Cap. III)</h3>
            <label className="check-row">
              <input type="checkbox" checked={data.tieneTitularClaro} onChange={(e) => set("tieneTitularClaro")(e.target.checked)} />
              Contiene un titular periodístico escrito y claramente identificable
            </label>
            <label className="check-row">
              <input type="checkbox" checked={data.esRepetidoSinCambios} onChange={(e) => set("esRepetidoSinCambios")(e.target.checked)} />
              Es una plantilla repetida sin modificaciones relevantes (p. ej. "portada impresa de este…")
            </label>
            <label className="check-row">
              <input type="checkbox" checked={data.esComunicadoSinEstructura} onChange={(e) => set("esComunicadoSinEstructura")(e.target.checked)} />
              Es un comunicado institucional sin estructura de titular
            </label>
            <label className="check-row">
              <input type="checkbox" checked={data.esPublicitario} onChange={(e) => set("esPublicitario")(e.target.checked)} />
              Es contenido publicitario, promocional o comercial
            </label>
            <label className="check-row">
              <input type="checkbox" checked={data.sinTitularEscrito} onChange={(e) => set("sinTitularEscrito")(e.target.checked)} />
              Es un reel/video sin titular escrito verificable
            </label>
            <div className={"validation-result " + (valido ? "ok" : "bad")}>
              {valido ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
              {valido ? "Cumple los criterios: titular válido para el corpus" : "No cumple los criterios: excluir del corpus"}
            </div>
          </section>

          {/* Categoría 1 */}
          <section className="form-section">
            <h3 className="section-title">3 · Recursos léxico-sintácticos</h3>
            <div className="grid-2">
              <Field label="Modalidad oracional"><Select value={data.modalidad} onChange={set("modalidad")} options={MODALIDAD} /></Field>
              <Field label="Estructura sintáctica" hint="Ej.: 'Shakira vuelve a creer en el amor: confirma romance…' = bimembre yuxtapuesta con dos puntos.">
                <Select value={data.estructuraSintactica} onChange={set("estructuraSintactica")} options={ESTRUCTURA_SINTACTICA} />
              </Field>
            </div>
            <Field label="Deixis (varias posibles)" hint="Temporal (presente histórico, ya, ahora…), espacial (RD, aquí…) o social (los jóvenes, las autoridades…).">
              <CheckGroup value={data.deixis} onChange={set("deixis")} options={DEIXIS} />
            </Field>
            <Field label="Carga léxica (varias posibles)">
              <CheckGroup value={data.cargaLexica} onChange={set("cargaLexica")} options={CARGA_LEXICA} />
            </Field>
            <Field label="Adjetivación"><Select value={data.adjetivacion} onChange={set("adjetivacion")} options={ADJETIVACION} /></Field>
            <Field label="Fenómenos de síntesis (varios posibles)">
              <CheckGroup value={data.sintesis} onChange={set("sintesis")} options={SINTESIS} />
            </Field>
            <Field label="Figuras retóricas (varias posibles)">
              <CheckGroup value={data.figuras} onChange={set("figuras")} options={FIGURAS} />
            </Field>
          </section>

          {/* Categoría 2 */}
          <section className="form-section">
            <h3 className="section-title">4 · Actos de habla y presuposición</h3>
            <div className="grid-2">
              <Field label="Polifonía"><Select value={data.polifonia} onChange={set("polifonia")} options={POLIFONIA} /></Field>
              <Field label="Acto de habla"><Select value={data.actoHabla} onChange={set("actoHabla")} options={ACTO_HABLA} /></Field>
            </div>
            <Field label="Estrategia de captación / presuposición (varias posibles)">
              <CheckGroup value={data.captacion} onChange={set("captacion")} options={CAPTACION} />
            </Field>
          </section>

          {/* Categoría 3 */}
          <section className="form-section">
            <h3 className="section-title">5 · Oralidad fingida y coloquialismo</h3>
            <Field label="Rasgos de oralidad fingida presentes (varios posibles)">
              <CheckGroup value={data.oralidad} onChange={set("oralidad")} options={ORALIDAD} />
            </Field>
          </section>

          {/* Categoría 4 */}
          <section className="form-section">
            <h3 className="section-title">6 · Multimodalidad</h3>
            <div className="grid-3">
              <Field label="Densidad de emojis"><Select value={data.densidadEmoji} onChange={set("densidadEmoji")} options={DENSIDAD_EMOJI} /></Field>
              <Field label="Función del emoji"><Select value={data.funcionEmoji} onChange={set("funcionEmoji")} options={FUNCION_EMOJI} /></Field>
              <Field label="Coherencia texto–imagen"><Select value={data.coherencia} onChange={set("coherencia")} options={COHERENCIA} /></Field>
            </div>
          </section>

          {/* Cierre */}
          <section className="form-section">
            <h3 className="section-title">7 · Interpretación</h3>
            <Field label="Función dominante (varias posibles)">
              <CheckGroup value={data.funcionDominante} onChange={set("funcionDominante")} options={FUNCION_DOMINANTE} />
            </Field>
            <Field label="Matiz / función comunicativa (texto libre)" hint="Ej.: 'Informativa y apelativa (captación referencial)'.">
              <input className="input" value={data.funcionComunicativa} onChange={(e) => set("funcionComunicativa")(e.target.value)} />
            </Field>
            <Field label="Interpretación">
              <textarea className="input textarea" rows={2} value={data.interpretacion} onChange={(e) => set("interpretacion")(e.target.value)} />
            </Field>
            <Field label="Observaciones críticas">
              <textarea className="input textarea" rows={2} value={data.observaciones} onChange={(e) => set("observaciones")(e.target.value)} />
            </Field>
          </section>
        </div>

        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button
            className="btn btn-primary"
            onClick={() => onSave(data)}
            disabled={!data.titular.trim()}
          >
            Guardar titular
          </button>
        </div>
      </div>
    </div>
  );
}

function TextExportModal({ title, content, onClose }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      setCopied(false);
    }
  };
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ width: "min(760px,100%)" }}>
        <div className="modal-head">
          <div>
            <div className="modal-eyebrow">Respaldo manual</div>
            <h2 className="modal-title">{title}</h2>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Cerrar"><X size={18} /></button>
        </div>
        <div className="modal-body">
          <p style={{ fontSize: 12.5, color: "var(--ink-soft)", marginBottom: 10 }}>
            Si la descarga automática no funcionó en este dispositivo, copia todo el texto de abajo y pégalo en un archivo nuevo (.json o .csv según corresponda).
          </p>
          <textarea
            readOnly
            value={content}
            onFocus={(e) => e.target.select()}
            className="input textarea"
            style={{ fontFamily: "var(--mono)", fontSize: 11.5, height: "50vh" }}
          />
        </div>
        <div className="modal-foot">
          <button className="btn btn-ghost" onClick={onClose}>Cerrar</button>
          <button className="btn btn-primary" onClick={copy}>
            <Copy size={14} /> {copied ? "¡Copiado!" : "Copiar todo"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  App principal                                                         */
/* ---------------------------------------------------------------------- */

export default function App() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saveError, setSaveError] = useState(false);
  const [tab, setTab] = useState("tabla");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("todos"); // todos | validos | excluidos
  const [expanded, setExpanded] = useState(null);
  const [targetN, setTargetN] = useState(70);
  const [textExport, setTextExport] = useState(null); // { title, content } | null

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get(STORAGE_KEY);
        if (res && res.value) {
          const parsed = JSON.parse(res.value);
          // migración: versiones anteriores guardaban deixis/cargaLexica como texto simple
          const toArr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
          const migrated = (parsed.entries || []).map((e) => ({
            ...emptyEntry(),
            ...e,
            deixis: toArr(e.deixis),
            cargaLexica: toArr(e.cargaLexica),
            funcionDominante: toArr(e.funcionDominante),
          }));
          setEntries(migrated);
          setTargetN(parsed.targetN || 70);
        }
      } catch (e) {
        // no existe todavía, arrancamos vacío
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const persist = async (nextEntries, nextTarget) => {
    setEntries(nextEntries);
    try {
      const result = await window.storage.set(
        STORAGE_KEY,
        JSON.stringify({ entries: nextEntries, targetN: nextTarget ?? targetN })
      );
      setSaveError(!result);
    } catch (e) {
      setSaveError(true);
    }
  };

  const openNew = () => {
    setEditing({ ...emptyEntry(), id: crypto.randomUUID(), codigo: nextCodigo(entries) });
    setFormOpen(true);
  };
  const openEdit = (entry) => {
    setEditing(entry);
    setFormOpen(true);
  };
  const handleSave = (data) => {
    const exists = entries.some((e) => e.id === data.id);
    const next = exists ? entries.map((e) => (e.id === data.id ? data : e)) : [...entries, data];
    persist(next);
    setFormOpen(false);
    setEditing(null);
  };
  const handleDelete = (id) => {
    if (!confirm("¿Eliminar este titular del corpus?")) return;
    persist(entries.filter((e) => e.id !== id));
  };
  const handleReset = () => {
    if (!confirm("Esto borrará TODOS los titulares guardados en este dispositivo. ¿Continuar?")) return;
    persist([]);
  };

  const duplicates = useMemo(() => {
    const norm = (s) => (s || "").trim().toLowerCase().replace(/\s+/g, " ");
    const map = new Map();
    entries.forEach((e) => {
      const k = norm(e.titular);
      if (!k) return;
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(e.codigo || e.id);
    });
    return Array.from(map.values()).filter((codes) => codes.length > 1);
  }, [entries]);

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      if (filter === "validos" && !isValido(e)) return false;
      if (filter === "excluidos" && isValido(e)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          (e.titular || "").toLowerCase().includes(q) ||
          (e.codigo || "").toLowerCase().includes(q) ||
          (e.seccion || "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [entries, filter, search]);

  const validCount = entries.filter(isValido).length;
  const excludedCount = entries.length - validCount;

  const buildJSONText = () => JSON.stringify(entries, null, 2);

  const buildCSVText = () => {
    const cols = [
      "codigo", "fecha", "tipoEntrada", "seccion", "titular", "enlace", "valido", "motivoExclusion",
      "modalidad", "estructuraSintactica", "sintesis", "deixis", "cargaLexica", "adjetivacion", "figuras",
      "polifonia", "actoHabla", "captacion", "oralidad",
      "densidadEmoji", "funcionEmoji", "coherencia",
      "funcionDominante", "funcionComunicativa", "interpretacion", "observaciones",
    ];
    const esc = (v) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const rows = entries.map((e) => {
      const row = {
        ...e,
        sintesis: (e.sintesis || []).join("; "),
        deixis: (e.deixis || []).join("; "),
        cargaLexica: (e.cargaLexica || []).join("; "),
        figuras: (e.figuras || []).join("; "),
        captacion: (e.captacion || []).join("; "),
        oralidad: (e.oralidad || []).join("; "),
        funcionDominante: (e.funcionDominante || []).join("; "),
        valido: isValido(e) ? "Sí" : "No",
        motivoExclusion: exclusionReasons(e).join(" | "),
      };
      return cols.map((c) => esc(row[c])).join(",");
    });
    return [cols.join(","), ...rows].join("\n");
  };

  const tryDownload = (content, filename, mime) => {
    try {
      const blob = new Blob([mime.includes("csv") ? "\uFEFF" + content : content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  const exportJSON = () => {
    const content = buildJSONText();
    tryDownload(content, "matriz_titulares_END.json", "application/json");
    setTextExport({ title: "JSON del corpus", content });
  };

  const exportCSV = () => {
    const content = buildCSVText();
    tryDownload(content, "matriz_titulares_END.csv", "text/csv;charset=utf-8;");
    setTextExport({ title: "CSV del corpus", content });
  };

  const importJSON = (ev) => {
    const file = ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        if (!Array.isArray(parsed)) throw new Error("formato inválido");
        const toArr = (v) => (Array.isArray(v) ? v : v ? [v] : []);
        const withIds = parsed.map((e) => ({
          ...emptyEntry(), ...e, id: e.id || crypto.randomUUID(),
          deixis: toArr(e.deixis), cargaLexica: toArr(e.cargaLexica), funcionDominante: toArr(e.funcionDominante),
        }));
        persist(withIds);
      } catch (e) {
        alert("No se pudo leer el archivo. Verifica que sea un JSON exportado desde este mismo sistema.");
      }
    };
    reader.readAsText(file);
    ev.target.value = "";
  };

  const validPct = entries.length ? Math.round((validCount / entries.length) * 100) : 0;

  return (
    <div className="app">
      <style>{`
        :root{
          --paper:#f6f4ee; --paper-raised:#ffffff; --ink:#20242b; --ink-soft:#5c6270;
          --rule:#dedad0; --accent:#245b5b; --accent-soft:#e4efee; --bad:#a3401f; --bad-soft:#f6e6e0;
          --good:#245b5b; --good-soft:#e4efee; --amber:#a9791f; --amber-soft:#f6efdf;
          --mono: 'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, monospace;
          --serif: Georgia, 'Iowan Old Style', 'Times New Roman', serif;
          --sans: -apple-system, BlinkMacSystemFont, 'Inter', Segoe UI, sans-serif;
        }
        *{box-sizing:border-box;}
        .app{ font-family:var(--sans); color:var(--ink); background:var(--paper); min-height:100%;
          padding:20px; border-radius:12px; }
        .header{ display:flex; justify-content:space-between; align-items:flex-start; gap:16px;
          flex-wrap:wrap; margin-bottom:18px; border-bottom:2px solid var(--ink); padding-bottom:14px;}
        .brand-eyebrow{ font-family:var(--mono); font-size:11px; letter-spacing:.08em; text-transform:uppercase;
          color:var(--ink-soft); }
        .brand-title{ font-family:var(--serif); font-size:26px; margin:2px 0 0; }
        .brand-sub{ font-size:13px; color:var(--ink-soft); margin-top:4px; }
        .header-actions{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; }

        .btn{ font-family:var(--sans); font-size:13px; font-weight:600; padding:9px 14px; border-radius:8px;
          border:1px solid var(--ink); background:var(--paper-raised); color:var(--ink); cursor:pointer;
          display:inline-flex; align-items:center; gap:6px; transition:transform .05s ease; }
        .btn:hover{ transform:translateY(-1px); }
        .btn:disabled{ opacity:.45; cursor:not-allowed; transform:none; }
        .btn-primary{ background:var(--ink); color:var(--paper); border-color:var(--ink); }
        .btn-ghost{ border-color:var(--rule); }
        .btn-accent{ background:var(--accent); border-color:var(--accent); color:white; }
        .icon-btn{ border:none; background:transparent; cursor:pointer; color:var(--ink-soft); padding:6px; border-radius:6px; }
        .icon-btn:hover{ background:var(--rule); }

        .stats-row{ display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px; }
        .stat-card{ background:var(--paper-raised); border:1px solid var(--rule); border-radius:10px;
          padding:10px 16px; min-width:110px; }
        .stat-value{ font-family:var(--serif); font-size:24px; line-height:1; }
        .stat-label{ font-size:11px; color:var(--ink-soft); margin-top:4px; text-transform:uppercase; letter-spacing:.04em;}
        .stat-card.good .stat-value{ color:var(--good); }
        .stat-card.bad .stat-value{ color:var(--bad); }

        .tabs{ display:flex; gap:4px; margin-bottom:14px; background:var(--rule); padding:3px; border-radius:9px; width:fit-content;}
        .tab{ padding:7px 14px; border-radius:7px; font-size:13px; font-weight:600; cursor:pointer; color:var(--ink-soft);
          display:flex; align-items:center; gap:6px; }
        .tab.active{ background:var(--paper-raised); color:var(--ink); }

        .toolbar{ display:flex; gap:8px; flex-wrap:wrap; align-items:center; margin-bottom:14px; }
        .search-wrap{ position:relative; flex:1; min-width:200px; }
        .search-wrap input{ width:100%; padding:9px 10px 9px 32px; border-radius:8px; border:1px solid var(--rule);
          background:var(--paper-raised); font-size:13px; }
        .search-wrap svg{ position:absolute; left:9px; top:9px; color:var(--ink-soft); }
        .filter-select{ padding:9px 10px; border-radius:8px; border:1px solid var(--rule); background:var(--paper-raised); font-size:13px; }

        .table-wrap{ background:var(--paper-raised); border:1px solid var(--rule); border-radius:10px; overflow:hidden; }
        table{ width:100%; border-collapse:collapse; font-size:13px; }
        thead th{ text-align:left; font-family:var(--mono); font-size:10.5px; text-transform:uppercase; letter-spacing:.05em;
          color:var(--ink-soft); padding:10px 12px; border-bottom:1px solid var(--rule); background:#faf9f5; }
        tbody td{ padding:10px 12px; border-bottom:1px solid var(--rule); vertical-align:top; }
        tbody tr:last-child td{ border-bottom:none; }
        tbody tr:hover{ background:#faf9f5; }
        .code-cell{ font-family:var(--mono); font-size:12px; white-space:nowrap; }
        .titular-cell{ max-width:360px; }
        .badge{ display:inline-flex; align-items:center; gap:4px; padding:3px 8px; border-radius:100px; font-size:11px; font-weight:700; }
        .badge-good{ background:var(--good-soft); color:var(--good); }
        .badge-bad{ background:var(--bad-soft); color:var(--bad); }
        .row-actions{ display:flex; gap:4px; }
        .detail-row td{ background:#faf9f5; padding:14px 18px; }
        .detail-grid{ display:grid; grid-template-columns:repeat(auto-fill,minmax(190px,1fr)); gap:10px; font-size:12.5px; }
        .detail-grid dt{ color:var(--ink-soft); font-size:10.5px; text-transform:uppercase; letter-spacing:.04em; }
        .detail-grid dd{ margin:2px 0 0; }

        .empty{ text-align:center; padding:48px 20px; color:var(--ink-soft); }
        .empty h3{ font-family:var(--serif); color:var(--ink); margin-bottom:6px; }

        .dup-banner{ background:var(--amber-soft); border:1px solid var(--amber); color:#6b4e14; border-radius:10px;
          padding:12px 14px; font-size:13px; margin-bottom:16px; display:flex; gap:10px; }
        .dup-banner b{ display:block; margin-bottom:4px; }

        .charts-grid{ display:grid; grid-template-columns:repeat(auto-fit,minmax(320px,1fr)); gap:16px; }
        .chart-card{ background:var(--paper-raised); border:1px solid var(--rule); border-radius:10px; padding:14px; }
        .chart-title{ font-size:12.5px; font-weight:700; margin-bottom:8px; color:var(--ink); }
        .progress-wrap{ background:var(--paper-raised); border:1px solid var(--rule); border-radius:10px; padding:14px 16px; margin-bottom:16px; }
        .progress-bar{ height:10px; background:var(--rule); border-radius:100px; overflow:hidden; margin-top:8px; }
        .progress-fill{ height:100%; background:var(--accent); }

        .overlay{ position:fixed; inset:0; background:rgba(20,22,26,.5); display:flex; align-items:center;
          justify-content:center; z-index:50; padding:20px; }
        .modal{ background:var(--paper-raised); width:min(720px,100%); max-height:88vh; border-radius:14px;
          display:flex; flex-direction:column; overflow:hidden; box-shadow:0 20px 60px rgba(0,0,0,.3); }
        .modal-head{ display:flex; justify-content:space-between; align-items:flex-start; padding:18px 20px;
          border-bottom:1px solid var(--rule); }
        .modal-eyebrow{ font-family:var(--mono); font-size:10.5px; text-transform:uppercase; letter-spacing:.06em; color:var(--ink-soft); }
        .modal-title{ font-family:var(--serif); font-size:20px; margin:2px 0 0; }
        .modal-body{ padding:18px 20px; overflow-y:auto; flex:1; }
        .modal-foot{ display:flex; justify-content:flex-end; gap:8px; padding:14px 20px; border-top:1px solid var(--rule); }

        .form-section{ margin-bottom:22px; padding-bottom:18px; border-bottom:1px dashed var(--rule); }
        .form-section:last-child{ border-bottom:none; }
        .section-title{ font-size:13px; font-weight:700; margin-bottom:10px; color:var(--accent); }
        .grid-2{ display:grid; grid-template-columns:1fr 1fr; gap:12px; }
        .grid-3{ display:grid; grid-template-columns:1fr 1fr 1fr; gap:12px; }
        @media (max-width:560px){ .grid-2,.grid-3{ grid-template-columns:1fr; } }
        .field{ display:block; margin-bottom:12px; }
        .field-label{ display:block; font-size:12px; font-weight:600; margin-bottom:5px; color:var(--ink); }
        .field-hint{ display:block; font-size:11px; color:var(--ink-soft); margin-top:3px; }
        .input{ width:100%; padding:8px 10px; border:1px solid var(--rule); border-radius:7px; font-size:13px;
          font-family:var(--sans); background:var(--paper-raised); color:var(--ink); }
        .textarea{ resize:vertical; font-family:var(--serif); font-size:14px; }
        .check-grid{ display:flex; flex-wrap:wrap; gap:6px; }
        .chip{ font-size:12px; padding:6px 10px; border-radius:100px; border:1px solid var(--rule); cursor:pointer;
          background:var(--paper-raised); color:var(--ink-soft); }
        .chip-on{ background:var(--accent); border-color:var(--accent); color:white; }
        .check-row{ display:flex; align-items:center; gap:8px; font-size:13px; margin-bottom:8px; }
        .validation{ border:1px solid var(--rule); border-radius:10px; padding:14px; }
        .validation-ok{ background:var(--good-soft); }
        .validation-bad{ background:var(--bad-soft); }
        .validation-result{ display:flex; align-items:center; gap:6px; font-weight:700; font-size:13px; margin-top:6px; }
        .validation-result.ok{ color:var(--good); }
        .validation-result.bad{ color:var(--bad); }
      `}</style>

      <header className="header">
        <div>
          <div className="brand-eyebrow">Corpus lingüístico-pragmático · El Nuevo Diario / Instagram</div>
          <h1 className="brand-title">Matriz de codificación de titulares</h1>
          <div className="brand-sub">Cada fila es un titular verificado; el formulario aplica el mismo instrumento del Capítulo III.</div>
        </div>
        <div className="header-actions">
          <label className="btn btn-ghost" style={{ cursor: "pointer" }}>
            <Upload size={14} /> Importar JSON
            <input type="file" accept="application/json" onChange={importJSON} style={{ display: "none" }} />
          </label>
          <button className="btn btn-ghost" onClick={exportCSV}><Download size={14} /> CSV</button>
          <button className="btn btn-ghost" onClick={exportJSON}><Download size={14} /> JSON</button>
          <button className="btn btn-accent" onClick={openNew}><Plus size={15} /> Nuevo titular</button>
        </div>
      </header>

      <div className="stats-row">
        <StatCard label="Total registrado" value={entries.length} />
        <StatCard label="Válidos" value={validCount} tone="good" />
        <StatCard label="Excluidos" value={excludedCount} tone="bad" />
        <StatCard label="Duplicados exactos" value={duplicates.length} tone={duplicates.length ? "bad" : ""} />
        {saveError && (
          <div className="stat-card bad"><div className="stat-value">⚠</div><div className="stat-label">Error al guardar</div></div>
        )}
      </div>

      <div className="progress-wrap">
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, color: "var(--ink-soft)" }}>
          <span>Avance del corpus válido frente a la muestra objetivo</span>
          <span>
            {validCount} / <input
              type="number"
              value={targetN}
              onChange={(e) => { const n = Number(e.target.value) || 0; setTargetN(n); persist(entries, n); }}
              style={{ width: 48, border: "none", borderBottom: "1px solid var(--rule)", background: "transparent", textAlign: "right", fontWeight: 700 }}
            /> ({targetN ? Math.round((validCount / targetN) * 100) : 0}%)
          </span>
        </div>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${targetN ? Math.min(100, (validCount / targetN) * 100) : 0}%` }} />
        </div>
      </div>

      {duplicates.length > 0 && (
        <div className="dup-banner">
          <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 2 }} />
          <div>
            <b>Posibles titulares duplicados o plantillas repetidas</b>
            {duplicates.map((codes, i) => (
              <div key={i}>{codes.join(", ")} — mismo texto exacto. Revisa si deben excluirse por el criterio de "publicación repetida sin cambios relevantes".</div>
            ))}
          </div>
        </div>
      )}

      <div className="tabs">
        <div className={"tab " + (tab === "tabla" ? "active" : "")} onClick={() => setTab("tabla")}>
          <Table2 size={14} /> Tabla
        </div>
        <div className={"tab " + (tab === "dashboard" ? "active" : "")} onClick={() => setTab("dashboard")}>
          <LayoutDashboard size={14} /> Dashboard
        </div>
      </div>

      {tab === "tabla" && (
        <>
          <div className="toolbar">
            <div className="search-wrap">
              <Search size={14} />
              <input placeholder="Buscar por texto, código o sección…" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="todos">Todos</option>
              <option value="validos">Solo válidos</option>
              <option value="excluidos">Solo excluidos</option>
            </select>
            {entries.length > 0 && (
              <button className="btn btn-ghost" onClick={handleReset}><RotateCcw size={13} /> Borrar todo</button>
            )}
          </div>

          {loading ? (
            <div className="empty">Cargando corpus…</div>
          ) : filtered.length === 0 ? (
            <div className="empty">
              <h3>{entries.length === 0 ? "Aún no hay titulares" : "Sin resultados"}</h3>
              <p>{entries.length === 0 ? "Usa “Nuevo titular” para empezar a codificar el corpus." : "Ajusta la búsqueda o el filtro."}</p>
            </div>
          ) : (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Código</th>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Titular</th>
                    <th>Estado</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((e) => {
                    const ok = isValido(e);
                    const isOpen = expanded === e.id;
                    return (
                      <React.Fragment key={e.id}>
                        <tr>
                          <td className="code-cell">{e.codigo}</td>
                          <td>{e.fecha || "—"}</td>
                          <td>{e.tipoEntrada}</td>
                          <td className="titular-cell">{e.titular || <em style={{ color: "var(--ink-soft)" }}>Sin texto</em>}</td>
                          <td>
                            <span className={"badge " + (ok ? "badge-good" : "badge-bad")}>
                              {ok ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                              {ok ? "Válido" : "Excluido"}
                            </span>
                          </td>
                          <td>
                            <div className="row-actions">
                              <button className="icon-btn" onClick={() => setExpanded(isOpen ? null : e.id)} title="Detalle">
                                {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                              </button>
                              <button className="icon-btn" onClick={() => openEdit(e)} title="Editar"><Pencil size={15} /></button>
                              <button className="icon-btn" onClick={() => handleDelete(e.id)} title="Eliminar"><Trash2 size={15} /></button>
                            </div>
                          </td>
                        </tr>
                        {isOpen && (
                          <tr className="detail-row">
                            <td colSpan={6}>
                              {!ok && (
                                <p style={{ color: "var(--bad)", fontSize: 12.5, marginBottom: 10 }}>
                                  Motivo de exclusión: {exclusionReasons(e).join("; ")}
                                </p>
                              )}
                              <dl className="detail-grid">
                                <div><dt>Sección</dt><dd>{e.seccion}</dd></div>
                                <div><dt>Modalidad</dt><dd>{e.modalidad}</dd></div>
                                <div><dt>Estructura sintáctica</dt><dd>{e.estructuraSintactica || "—"}</dd></div>
                                <div><dt>Deixis</dt><dd>{(e.deixis || []).join(", ") || "—"}</dd></div>
                                <div><dt>Carga léxica</dt><dd>{(e.cargaLexica || []).join(", ") || "—"}</dd></div>
                                <div><dt>Adjetivación</dt><dd>{e.adjetivacion}</dd></div>
                                <div><dt>Síntesis</dt><dd>{(e.sintesis || []).join(", ") || "—"}</dd></div>
                                <div><dt>Figuras retóricas</dt><dd>{(e.figuras || []).join(", ") || "—"}</dd></div>
                                <div><dt>Polifonía</dt><dd>{e.polifonia}</dd></div>
                                <div><dt>Acto de habla</dt><dd>{e.actoHabla}</dd></div>
                                <div><dt>Captación</dt><dd>{(e.captacion || []).join(", ") || "—"}</dd></div>
                                <div><dt>Oralidad fingida</dt><dd>{(e.oralidad || []).join(", ") || "—"}</dd></div>
                                <div><dt>Densidad emoji</dt><dd>{e.densidadEmoji}</dd></div>
                                <div><dt>Función emoji</dt><dd>{e.funcionEmoji}</dd></div>
                                <div><dt>Coherencia texto-imagen</dt><dd>{e.coherencia}</dd></div>
                                <div><dt>Función dominante</dt><dd>{(e.funcionDominante || []).join(", ") || "—"}</dd></div>
                                <div><dt>Matiz comunicativo</dt><dd>{e.funcionComunicativa || "—"}</dd></div>
                              </dl>
                              {e.interpretacion && <p style={{ marginTop: 10, fontSize: 12.5 }}><b>Interpretación:</b> {e.interpretacion}</p>}
                              {e.observaciones && <p style={{ marginTop: 6, fontSize: 12.5 }}><b>Observaciones:</b> {e.observaciones}</p>}
                              {e.enlace && <p style={{ marginTop: 6, fontSize: 12.5 }}><b>Enlace:</b> {e.enlace}</p>}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      {tab === "dashboard" && (
        <>
          {entries.length === 0 ? (
            <div className="empty"><h3>Todavía no hay datos para mostrar</h3><p>Agrega titulares en la pestaña Tabla.</p></div>
          ) : (
            <>
              <div className="charts-grid" style={{ marginBottom: 16 }}>
                <DistChart title="Estado de validación" data={[{ name: "Válidos", value: validCount }, { name: "Excluidos", value: excludedCount }]} colorVar="var(--accent)" />
                <DistChart title="Tipo de entrada" data={countBy(entries, "tipoEntrada")} colorVar="var(--accent)" />
                <DistChart title="Sección temática" data={countBy(entries.filter(isValido), "seccion")} colorVar="var(--accent)" />
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, margin: "18px 0 10px" }}>Objetivo 1 — Léxico-sintáctico</h3>
              <div className="charts-grid" style={{ marginBottom: 16 }}>
                <DistChart title="Modalidad oracional" data={countBy(entries.filter(isValido), "modalidad")} colorVar="var(--accent)" />
                <DistChart title="Estructura sintáctica" data={countBy(entries.filter(isValido), "estructuraSintactica")} colorVar="var(--accent)" />
                <DistChart title="Fenómenos de síntesis" data={countBy(entries.filter(isValido), "sintesis", { multi: true })} colorVar="var(--accent)" />
                <DistChart title="Deixis" data={countBy(entries.filter(isValido), "deixis", { multi: true })} colorVar="var(--accent)" />
                <DistChart title="Carga léxica" data={countBy(entries.filter(isValido), "cargaLexica", { multi: true })} colorVar="var(--accent)" />
                <DistChart title="Adjetivación" data={countBy(entries.filter(isValido), "adjetivacion")} colorVar="var(--accent)" />
                <DistChart title="Figuras retóricas" data={countBy(entries.filter(isValido), "figuras", { multi: true })} colorVar="var(--accent)" />
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, margin: "18px 0 10px" }}>Objetivo 2 — Actos de habla y presuposición</h3>
              <div className="charts-grid" style={{ marginBottom: 16 }}>
                <DistChart title="Polifonía" data={countBy(entries.filter(isValido), "polifonia")} colorVar="var(--accent)" />
                <DistChart title="Acto de habla" data={countBy(entries.filter(isValido), "actoHabla")} colorVar="var(--accent)" />
                <DistChart title="Estrategia de captación" data={countBy(entries.filter(isValido), "captacion", { multi: true })} colorVar="var(--accent)" />
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, margin: "18px 0 10px" }}>Objetivo 3 — Oralidad fingida</h3>
              <div className="charts-grid" style={{ marginBottom: 16 }}>
                <DistChart title="Rasgos de oralidad fingida" data={countBy(entries.filter(isValido), "oralidad", { multi: true })} colorVar="var(--accent)" />
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, margin: "18px 0 10px" }}>Objetivo 4 — Multimodalidad</h3>
              <div className="charts-grid" style={{ marginBottom: 16 }}>
                <DistChart title="Densidad de emojis" data={countBy(entries.filter(isValido), "densidadEmoji")} colorVar="var(--accent)" />
                <DistChart title="Función del emoji" data={countBy(entries.filter(isValido), "funcionEmoji")} colorVar="var(--accent)" />
                <DistChart title="Coherencia texto–imagen" data={countBy(entries.filter(isValido), "coherencia")} colorVar="var(--accent)" />
              </div>
              <h3 style={{ fontFamily: "var(--serif)", fontSize: 17, margin: "18px 0 10px" }}>Función comunicativa dominante</h3>
              <div className="charts-grid">
                <DistChart title="Función dominante" data={countBy(entries.filter(isValido), "funcionDominante", { multi: true })} colorVar="var(--accent)" />
              </div>
            </>
          )}
        </>
      )}

      {formOpen && editing && (
        <EntryForm
          initial={editing}
          onSave={handleSave}
          onClose={() => { setFormOpen(false); setEditing(null); }}
        />
      )}

      {textExport && (
        <TextExportModal
          title={textExport.title}
          content={textExport.content}
          onClose={() => setTextExport(null)}
        />
      )}
    </div>
  );
}
