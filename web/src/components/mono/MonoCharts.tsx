import React, { useState } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { MonoCard, ejeTick, rejilla, tintaPrincipal, tono } from './MonoCard';
import { MonoTooltip } from './MonoTooltip';
import { useIsMobile } from '../../hooks/useIsMobile';
import type { Conteo } from '../../lib/estadisticas';

type Tema = 'dark' | 'light';

interface BaseProps {
  theme?: Tema;
  eyebrow: string;
  badge?: string;
  valor: React.ReactNode;
  unidad?: string;
  pieIzquierda?: string;
  pieDerecha?: string;
  /** Aclaración metodológica bajo el gráfico. */
  nota?: string;
  ancho?: boolean;
}

/** Acorta etiquetas largas para que quepan en los ejes. */
const corto = (s: string, n = 16) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/* ------------------------------------------------------------------ */
/*  Pilares redondeados — Mono Rounded Pill Pillars                    */
/* ------------------------------------------------------------------ */

export function MonoBarras({ datos, altura = 200, ...props }: BaseProps & { datos: Conteo[]; altura?: number }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const isMobile = useIsMobile();
  const [layout, setLayout] = useState<'vertical' | 'horizontal'>('horizontal');
  const isHorizontal = layout === 'horizontal';

  const datosGrafico = datos.map((d) => ({ ...d, etiqueta: corto(d.nombre, isHorizontal ? 26 : 12) }));

  return (
    <MonoCard
      {...props}
      acciones={
        <div
          className={`p-0.5 rounded-full border flex items-center gap-0.5 shrink-0 ${
            isDark ? 'bg-white/5 border-white/10' : 'bg-neutral-100 border-neutral-200'
          }`}
        >
          {(['vertical', 'horizontal'] as const).map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => setLayout(l)}
              aria-label={l === 'vertical' ? 'Columnas' : 'Filas'}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                layout === l
                  ? isDark
                    ? 'bg-white text-black font-semibold shadow-sm'
                    : 'bg-black text-white font-semibold shadow-sm'
                  : isDark
                    ? 'text-neutral-400 hover:text-white'
                    : 'text-neutral-600 hover:text-black'
              }`}
            >
              {l === 'vertical' ? 'Col' : 'Fila'}
            </button>
          ))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={altura}>
        <BarChart
          data={datosGrafico}
          layout={isHorizontal ? 'vertical' : 'horizontal'}
          margin={{ top: 12, right: 16, left: isHorizontal ? 20 : -22, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke={rejilla(isDark)} />
          {isHorizontal ? (
            <>
              <XAxis type="number" hide />
              <YAxis
                dataKey="etiqueta"
                type="category"
                width={136}
                interval={0}
                tickLine={false}
                axisLine={false}
                tick={{ ...ejeTick(isDark), fontSize: 9 }}
              />
            </>
          ) : (
            <>
              <XAxis dataKey="etiqueta" tickLine={false} axisLine={false} tick={ejeTick(isDark)} interval={0} angle={-18} textAnchor="end" height={44} />
              <YAxis tickLine={false} axisLine={false} tick={ejeTick(isDark)} allowDecimals={false} />
            </>
          )}
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
            content={(p: any) => (
              <MonoTooltip
                {...p}
                theme={props.theme}
                indicator="dot"
                label={p?.payload?.[0]?.payload?.nombre}
                formatter={(v: number, _n: string) => `${v} (${p?.payload?.[0]?.payload?.porcentaje}%)`}
              />
            )}
          />
          <Bar
            dataKey="valor"
            name="Titulares"
            radius={isHorizontal ? [0, 8, 8, 0] : [8, 8, 8, 8]}
            barSize={isHorizontal ? 12 : 16}
            isAnimationActive={!isMobile}
            animationDuration={isMobile ? 0 : 800}
          >
            {datosGrafico.map((_, i) => (
              <Cell key={i} fill={tono(isDark, i, datosGrafico.length + 2)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Dona redondeada — Mono Rounded Donut Ring                          */
/* ------------------------------------------------------------------ */

export function MonoDona({ datos, ...props }: BaseProps & { datos: Conteo[] }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const isMobile = useIsMobile();
  const [hover, setHover] = useState<number | null>(null);

  return (
    <MonoCard {...props}>
      <div className="relative w-full h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={180}>
          <PieChart>
            <Tooltip
              content={(p: any) => (
                <MonoTooltip {...p} theme={props.theme} indicator="dot" formatter={(v: number) => `${v} titulares`} />
              )}
            />
            <Pie
              data={datos}
              dataKey="valor"
              nameKey="nombre"
              cx="50%"
              cy="50%"
              innerRadius={52}
              outerRadius={76}
              paddingAngle={6}
              cornerRadius={8}
              strokeLinecap="round"
              onMouseEnter={(_, idx) => setHover(idx)}
              onMouseLeave={() => setHover(null)}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 900}
            >
              {datos.map((_, i) => (
                <Cell
                  key={i}
                  fill={tono(isDark, i, datos.length + 1)}
                  stroke={isDark ? '#131313' : '#f4f4f6'}
                  strokeWidth={2}
                  style={{
                    transform: hover === i ? 'scale(1.05)' : 'scale(1)',
                    transformOrigin: 'center center',
                    transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none px-8 text-center">
          <span className="text-sm font-bold tabular-nums font-sans">
            {hover !== null ? `${datos[hover].porcentaje}%` : '100%'}
          </span>
          <span className={`text-[10px] leading-tight ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
            {hover !== null ? corto(datos[hover].nombre, 18) : 'de la muestra'}
          </span>
        </div>
      </div>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Área curva — Mono Curved Wave Area                                 */
/* ------------------------------------------------------------------ */

export function MonoArea({
  datos,
  idGradiente,
  ...props
}: BaseProps & { datos: { label: string; valor: number }[]; idGradiente: string }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const isMobile = useIsMobile();
  const tinta = tintaPrincipal(isDark);

  return (
    <MonoCard {...props}>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={datos} margin={{ top: 12, right: 12, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id={idGradiente} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={tinta} stopOpacity={0.32} />
              <stop offset="100%" stopColor={tinta} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke={rejilla(isDark)} />
          <XAxis dataKey="label" tickLine={false} axisLine={false} tick={ejeTick(isDark)} minTickGap={12} />
          <YAxis tickLine={false} axisLine={false} tick={ejeTick(isDark)} allowDecimals={false} />
          <Tooltip content={(p: any) => <MonoTooltip {...p} theme={props.theme} indicator="line" />} />
          <Area
            type="monotone"
            dataKey="valor"
            name="Publicaciones"
            stroke={tinta}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill={`url(#${idGradiente})`}
            isAnimationActive={!isMobile}
            animationDuration={isMobile ? 0 : 900}
            dot={{ r: 2.5, fill: tinta, strokeWidth: 0 }}
            activeDot={{ r: 4, fill: tinta, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Barras apiladas — Mono Stacked Tones                               */
/* ------------------------------------------------------------------ */

export function MonoApiladas({
  datos,
  capas,
  ...props
}: BaseProps & { datos: Record<string, string | number>[]; capas: string[] }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const isMobile = useIsMobile();
  const datosGrafico = datos.map((d) => ({ ...d, etiqueta: corto(String(d.label), 14) }));

  return (
    <MonoCard {...props}>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={datosGrafico} margin={{ top: 12, right: 12, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 2" vertical={false} stroke={rejilla(isDark)} />
          <XAxis dataKey="etiqueta" tickLine={false} axisLine={false} tick={ejeTick(isDark)} interval={0} angle={-18} textAnchor="end" height={44} />
          <YAxis tickLine={false} axisLine={false} tick={ejeTick(isDark)} allowDecimals={false} />
          <Tooltip
            cursor={{ fill: isDark ? 'rgba(255,255,255,0.04)' : 'rgba(0,0,0,0.04)' }}
            content={(p: any) => (
              <MonoTooltip {...p} theme={props.theme} indicator="dot" label={p?.payload?.[0]?.payload?.label} />
            )}
          />
          {capas.map((capa, i) => (
            <Bar
              key={capa}
              dataKey={capa}
              name={capa}
              stackId="a"
              fill={tono(isDark, i, capas.length + 1)}
              barSize={20}
              radius={i === 0 ? [0, 0, 8, 8] : i === capas.length - 1 ? [8, 8, 0, 0] : undefined}
              isAnimationActive={!isMobile}
              animationDuration={isMobile ? 0 : 800}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Radar — Mono Polygon Web                                           */
/* ------------------------------------------------------------------ */

export function MonoRadar({ datos, ...props }: BaseProps & { datos: Conteo[] }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const tinta = tintaPrincipal(isDark);
  const datosGrafico = datos.map((d) => ({ subject: corto(d.nombre, 14), metric: d.porcentaje, nombre: d.nombre, valor: d.valor }));

  return (
    <MonoCard {...props}>
      <div className="w-full h-full flex items-center justify-center">
        <ResponsiveContainer width="100%" height={200}>
          <RadarChart cx="50%" cy="50%" outerRadius={68} data={datosGrafico}>
            <PolarGrid stroke={isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'} />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 9, fill: isDark ? '#71717A' : '#A1A1AA' }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Tooltip
              content={(p: any) => (
                <MonoTooltip
                  {...p}
                  theme={props.theme}
                  indicator="dot"
                  label={p?.payload?.[0]?.payload?.nombre}
                  formatter={(v: number) => `${v}%`}
                />
              )}
            />
            <Radar
              name="Presencia"
              dataKey="metric"
              stroke={tinta}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={isDark ? 'rgba(255,255,255,0.15)' : 'rgba(9,9,11,0.15)'}
              animationDuration={800}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Treemap de mosaicos — Mono Tile Treemap                            */
/* ------------------------------------------------------------------ */

const DISPOSICION = [
  'col-span-2 row-span-2',
  'col-span-1 row-span-2',
  'col-span-2 row-span-1',
  'col-span-1 row-span-1',
  'col-span-1 row-span-1',
  'col-span-2 row-span-1',
];

export function MonoMosaico({ datos, ...props }: BaseProps & { datos: Conteo[] }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const mosaicos = datos.slice(0, DISPOSICION.length);
  const maximo = Math.max(1, ...mosaicos.map((m) => m.valor));

  return (
    <MonoCard {...props}>
      <div className="w-full h-full grid grid-cols-3 auto-rows-fr gap-1.5 min-h-[200px]">
        {mosaicos.map((tile, idx) => {
          const opacidad = 0.16 + (tile.valor / maximo) * 0.84;
          return (
            <div
              key={tile.nombre}
              title={`${tile.nombre}: ${tile.valor} (${tile.porcentaje}%)`}
              className={`${DISPOSICION[idx]} rounded-xl p-2 flex flex-col justify-between transition-all hover:scale-[1.02] cursor-default border overflow-hidden ${
                isDark ? 'border-white/10' : 'border-black/10'
              }`}
              style={{
                backgroundColor: isDark ? `rgba(255,255,255,${opacidad})` : `rgba(9,9,11,${opacidad})`,
                color: isDark ? (opacidad > 0.5 ? '#000000' : '#FFFFFF') : opacidad > 0.5 ? '#FFFFFF' : '#000000',
              }}
            >
              <span className="text-[11px] font-bold tracking-tight font-sans leading-tight line-clamp-3">{tile.nombre}</span>
              <span className="text-[10px] font-mono opacity-80">{tile.porcentaje}%</span>
            </div>
          );
        })}
      </div>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Medidor de arco — Mono Arc Meter                                   */
/* ------------------------------------------------------------------ */

export function MonoMedidor({
  porcentajeValor,
  etiquetaCentral,
  ...props
}: BaseProps & { porcentajeValor: number; etiquetaCentral?: string }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const datos = [
    { name: 'Presente', value: porcentajeValor },
    { name: 'Restante', value: Math.max(0, 100 - porcentajeValor) },
  ];

  return (
    <MonoCard {...props}>
      <div className="relative w-full h-full flex flex-col items-center justify-center">
        <ResponsiveContainer width="100%" height={170}>
          <PieChart>
            <Pie
              data={datos}
              dataKey="value"
              cx="50%"
              cy="72%"
              startAngle={180}
              endAngle={0}
              innerRadius={58}
              outerRadius={80}
              cornerRadius={6}
              paddingAngle={2}
              isAnimationActive
              animationDuration={900}
            >
              <Cell fill={tintaPrincipal(isDark)} />
              <Cell fill={isDark ? 'rgba(255,255,255,0.12)' : 'rgba(9,9,11,0.10)'} />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-x-0 bottom-6 flex flex-col items-center pointer-events-none">
          <span className="text-2xl font-extrabold tabular-nums font-sans">{porcentajeValor}%</span>
          {etiquetaCentral && (
            <span className={`text-[10px] ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>{etiquetaCentral}</span>
          )}
        </div>
      </div>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Mapa de calor — Mono Activity Heatmap                              */
/* ------------------------------------------------------------------ */

export function MonoMapaCalor({
  filas,
  columnas,
  celdas,
  max,
  ...props
}: BaseProps & { filas: string[]; columnas: string[]; celdas: number[][]; max: number }) {
  const isDark = (props.theme ?? 'dark') === 'dark';

  // Permite el corte de línea después de las barras de las etiquetas compuestas
  // («Asertivo/Directivo») en lugar de recortarlas.
  const divisible = (s: string) => s.replace(/\//g, '/\u200B');

  return (
    <MonoCard {...props} crecer>
      <div className="w-full h-full overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="grid gap-1.5 items-end" style={{ gridTemplateColumns: `128px repeat(${columnas.length}, minmax(0,1fr))` }}>
            <span />
            {columnas.map((c) => (
              <span
                key={c}
                title={c}
                className={`text-[9px] font-mono leading-tight text-center break-words hyphens-none pb-0.5 ${
                  isDark ? 'text-neutral-500' : 'text-neutral-500'
                }`}
              >
                {divisible(c)}
              </span>
            ))}

            {filas.map((f, i) => (
              <React.Fragment key={f}>
                <span
                  title={f}
                  className={`text-[10px] font-medium leading-tight break-words self-center pr-1 ${
                    isDark ? 'text-neutral-400' : 'text-neutral-600'
                  }`}
                >
                  {divisible(f)}
                </span>
                {columnas.map((c, j) => {
                  const v = celdas[i][j];
                  const op = v === 0 ? 0.04 : 0.18 + (v / max) * 0.82;
                  return (
                    <div
                      key={`${f}-${c}`}
                      title={`${f} × ${c}: ${v}`}
                      className={`h-9 rounded-lg border flex items-center justify-center text-[10px] font-mono transition-all hover:scale-[1.04] ${
                        isDark ? 'border-white/10' : 'border-black/10'
                      }`}
                      style={{
                        backgroundColor: isDark ? `rgba(255,255,255,${op})` : `rgba(9,9,11,${op})`,
                        color: isDark ? (op > 0.5 ? '#000' : '#fff') : op > 0.5 ? '#fff' : '#000',
                      }}
                    >
                      {v > 0 ? v : ''}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Ranking de barras — para etiquetas largas                          */
/* ------------------------------------------------------------------ */

export function MonoRanking({ datos, ...props }: BaseProps & { datos: Conteo[] }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const maximo = Math.max(1, ...datos.map((d) => d.valor));

  return (
    <MonoCard {...props} crecer>
      <div className="w-full h-full min-h-[180px] flex flex-col justify-center gap-2.5 py-1">
        {datos.map((d, i) => (
          <div key={d.nombre} className="flex flex-col gap-1">
            <div className="flex items-baseline justify-between gap-3">
              <span className={`text-[11px] leading-tight truncate ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`} title={d.nombre}>
                {d.nombre}
              </span>
              <span className="text-[11px] font-mono tabular-nums shrink-0">
                {d.valor} <span className="opacity-60">· {d.porcentaje}%</span>
              </span>
            </div>
            <div className={`h-2 w-full rounded-full overflow-hidden ${isDark ? 'bg-white/5' : 'bg-black/5'}`}>
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{ width: `${(d.valor / maximo) * 100}%`, backgroundColor: tono(isDark, i, datos.length + 2) }}
              />
            </div>
          </div>
        ))}
      </div>
    </MonoCard>
  );
}

/* ------------------------------------------------------------------ */
/*  Tarjeta KPI con chispa — Mono KPI Stat Card                        */
/* ------------------------------------------------------------------ */

export function MonoKpi({
  datos,
  idGradiente,
  ...props
}: BaseProps & { datos: { valor: number }[]; idGradiente: string }) {
  const isDark = (props.theme ?? 'dark') === 'dark';
  const tinta = tintaPrincipal(isDark);

  return (
    <MonoCard {...props}>
      <div className="w-full h-full flex flex-col justify-end">
        <ResponsiveContainer width="100%" height="100%" minHeight={120}>
          <AreaChart data={datos} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id={idGradiente} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={tinta} stopOpacity={0.3} />
                <stop offset="100%" stopColor={tinta} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="valor"
              stroke={tinta}
              strokeWidth={2.5}
              strokeLinecap="round"
              fill={`url(#${idGradiente})`}
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </MonoCard>
  );
}
