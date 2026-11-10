import React, { useState, useMemo } from 'react';
import { Download, Check, Copy } from 'lucide-react';
import { useAcademicSystem, SYMBOL_SLOT_COLORS } from '../../core/registry';
import { InlineMath } from '../manuscript/MathAndFormal';

/**
 * ============================================================================
 * L3 PILLAR 4: THE DATAVIS ENGINE (PGFPLOTS × TUFTE × WOLFRAM × OBSERVABLE)
 * ============================================================================
 * Declarative vector SVG coordinate engine, symplectic phase-space quiver
 * plotter, complex s-plane pole-zero root locus, multi-panel publication
 * figures, word-sized Tufte sparklines, siunitx quantities, and booktabs tables.
 */

export interface UnitConversionOption {
  system: 'SI' | 'CGS' | 'Natural';
  formattedValue: string;
  unitLatex: string;
}

export interface UnitValueProps {
  value: string;
  uncertainty?: string;
  unit: string;
  symbolId?: string;
  conversions?: UnitConversionOption[];
}

export const UnitValue: React.FC<UnitValueProps> = ({
  value,
  uncertainty,
  unit,
  symbolId,
  conversions,
}) => {
  const { activeSymbolId, hoverSymbol, togglePinSymbol } = useAcademicSystem();
  const [convIndex, setConvIndex] = useState(0);

  const isHighlighted = symbolId ? activeSymbolId === symbolId : false;
  const activeConv =
    conversions && conversions.length > 0 ? conversions[convIndex] : null;

  const displayVal = activeConv ? activeConv.formattedValue : value;
  const displayUnit = activeConv ? activeConv.unitLatex : unit;

  return (
    <span
      onMouseEnter={() => symbolId && hoverSymbol(symbolId)}
      onMouseLeave={() => symbolId && hoverSymbol(null)}
      onClick={() => {
        if (conversions && conversions.length > 1) {
          setConvIndex((i) => (i + 1) % conversions.length);
        } else if (symbolId) {
          togglePinSymbol(symbolId);
        }
      }}
      title={
        conversions
          ? 'Click to cycle unit system (SI ↔ CGS ↔ Natural)'
          : undefined
      }
      style={{
        display: 'inline-flex',
        alignItems: 'baseline',
        padding: '0 2px',
        margin: '0 0.03em',
        borderRadius: '2px',
        backgroundColor: isHighlighted ? 'oklch(0.93 0.04 255)' : 'transparent',
        borderBottom: conversions
          ? '1px dotted var(--ads-ink-pencil, #82807A)'
          : 'none',
        fontFamily: '"KaTeX_Main", var(--ads-font-prose, serif)',
        fontSize: '0.96em',
        fontVariantNumeric: 'tabular-nums',
        color: 'var(--ads-ink-carbon, #141413)',
        cursor: conversions || symbolId ? 'pointer' : 'default',
      }}
    >
      <span style={{ fontWeight: 500 }}>{displayVal.replace('-', '−')}</span>
      {uncertainty && !activeConv && (
        <span style={{ color: 'var(--ads-ink-pencil, #82807A)', margin: '0 0.14em' }}>
          ±{uncertainty}
        </span>
      )}
      {displayUnit && (
        <span
          style={{
            marginLeft: 'var(--tex-thinspace, 0.16667em)',
            color: 'var(--ads-ink-graphite, #4E4D49)',
          }}
        >
          {displayUnit}
        </span>
      )}
    </span>
  );
};

/**
 * ============================================================================
 * 1. TUFTE WORD-SIZED SPARKLINE PRIMITIVE (<Sparkline />)
 * ============================================================================
 */
export interface SparklineProps {
  data: number[];
  domain?: [number, number];
  width?: number;
  height?: number;
  color?: string;
  fillArea?: boolean;
  showZeroLine?: boolean;
  showMinMax?: boolean;
  showBand?: boolean;
  variant?: 'line' | 'bar';
  highlightIndex?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  domain,
  width = 76,
  height = 20,
  color = 'oklch(0.42 0.16 255)',
  fillArea = true,
  showZeroLine = true,
  showMinMax = false,
  showBand = false,
  variant = 'line',
  highlightIndex,
}) => {
  if (!data || data.length < 2) return null;

  const minVal = domain ? domain[0] : Math.min(...data);
  const maxVal = domain ? domain[1] : Math.max(...data);
  const span = Math.max(1e-6, maxVal - minVal);
  const pad = 2.5;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const mapX = (i: number) => pad + (i / (data.length - 1)) * innerW;
  const mapY = (v: number) =>
    pad + Math.max(0, Math.min(1, (maxVal - v) / span)) * innerH;

  const linePath = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${mapX(i).toFixed(1)},${mapY(v).toFixed(1)}`)
    .join(' ');

  const baselineVal = minVal <= 0 && maxVal >= 0 ? 0 : minVal;
  const zeroY = mapY(baselineVal);
  const areaPath = `${linePath} L${mapX(data.length - 1).toFixed(1)},${zeroY.toFixed(1)} L${mapX(0).toFixed(1)},${zeroY.toFixed(1)} Z`;

  const hiIdx =
    highlightIndex !== undefined
      ? Math.max(0, Math.min(data.length - 1, highlightIndex))
      : data.length - 1;

  // Min / Max indices & IQR band
  let minIdx = 0;
  let maxIdx = 0;
  data.forEach((v, idx) => {
    if (v < data[minIdx]) minIdx = idx;
    if (v > data[maxIdx]) maxIdx = idx;
  });

  const sorted = [...data].sort((a, b) => a - b);
  const q25 = sorted[Math.floor(sorted.length * 0.25)] ?? minVal;
  const q75 = sorted[Math.floor(sorted.length * 0.75)] ?? maxVal;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        display: 'inline-block',
        verticalAlign: 'middle',
        overflow: 'visible',
      }}
    >
      {showBand && (
        <rect
          x={pad}
          y={mapY(q75)}
          width={innerW}
          height={Math.max(1, mapY(q25) - mapY(q75))}
          fill="oklch(0.88 0.02 255 / 0.38)"
          rx={1}
        />
      )}
      {showZeroLine && minVal <= 0 && maxVal >= 0 && (
        <line
          x1={pad}
          y1={zeroY}
          x2={width - pad}
          y2={zeroY}
          stroke="oklch(0.84 0.006 80)"
          strokeWidth={0.75}
          strokeDasharray="1.5 1.5"
        />
      )}
      {variant === 'bar' ? (
        data.map((v, idx) => {
          const bw = Math.max(1.2, innerW / data.length - 1);
          const bx = pad + (idx / data.length) * innerW;
          const yVal = mapY(v);
          const top = Math.min(yVal, zeroY);
          const bh = Math.max(1, Math.abs(zeroY - yVal));
          const isNeg = v < 0;
          return (
            <rect
              key={idx}
              x={bx}
              y={top}
              width={bw}
              height={bh}
              rx={0.6}
              fill={isNeg ? 'oklch(0.55 0.19 32)' : color}
              fillOpacity={idx === hiIdx ? 0.95 : 0.65}
            />
          );
        })
      ) : (
        <>
          {fillArea && (
            <path
              d={areaPath}
              fill={color}
              fillOpacity={0.13}
              style={{ mixBlendMode: 'multiply' }}
            />
          )}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth={1.4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {showMinMax && (
            <>
              <circle
                cx={mapX(minIdx)}
                cy={mapY(data[minIdx])}
                r={1.9}
                fill="oklch(0.55 0.19 32)"
                stroke="#FFFFFF"
                strokeWidth={0.7}
              />
              <circle
                cx={mapX(maxIdx)}
                cy={mapY(data[maxIdx])}
                r={1.9}
                fill="oklch(0.46 0.14 160)"
                stroke="#FFFFFF"
                strokeWidth={0.7}
              />
            </>
          )}
          <circle
            cx={mapX(hiIdx)}
            cy={mapY(data[hiIdx])}
            r={2.2}
            fill={color}
            stroke="#FFFFFF"
            strokeWidth={0.8}
          />
        </>
      )}
    </svg>
  );
};

/**
 * ============================================================================
 * 2. DECLARATIVE 2D CARTESIAN PLOT ENGINE (<CartesianCanvas />)
 * ============================================================================
 * Supports linear & log10 scales, pgfplots boxed vs Tufte range-frame axes,
 * step-after (Kaplan-Meier) & monotone cubic spline interpolation, shaded
 * regime intervals, Pareto scatter markers, integrated legends, and native
 * interactive multi-series crosshair inspection.
 */
export interface PlotSeries {
  id: string;
  label?: string;
  endLabel?: string;
  symbolId?: string;
  color: string;
  strokeWidth?: number;
  dashArray?: string;
  dashed?: boolean;
  interpolation?: 'linear' | 'step-after' | 'monotone';
  censorPoints?: number[];
  points: Array<{ x: number; y: number }>;
  fillToZero?: boolean;
  fillArea?: boolean;
  fillOpacity?: number;
}

export interface PlotConfidenceBand {
  id: string;
  color: string;
  opacity?: number;
  points: Array<{ x: number; upper: number; lower: number }>;
}

export interface PlotErrorPoint {
  x: number;
  y: number;
  yErr: number;
  xErr?: number;
  color?: string;
}

export interface PlotMarker {
  id?: string;
  x: number;
  y: number;
  label?: string;
  sublabel?: string;
  color?: string;
  shape?: 'circle' | 'diamond' | 'square';
  size?: number;
  halo?: boolean;
  labelPosition?: 'top' | 'right' | 'bottom' | 'left';
}

export interface PlotRegion {
  axis: 'x' | 'y';
  from: number;
  to: number;
  label?: string;
  color?: string;
  opacity?: number;
}

export interface PlotThreshold {
  axis: 'x' | 'y';
  value: number;
  label?: string;
  color?: string;
  dashArray?: string;
}

export interface CartesianCanvasProps {
  id?: string;
  width?: number;
  height?: number;
  xDomain: [number, number];
  yDomain: [number, number];
  xScale?: 'linear' | 'log';
  yScale?: 'linear' | 'log';
  xTicks: number[];
  yTicks: number[];
  xTickFormat?: (v: number) => string;
  yTickFormat?: (v: number) => string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  frameStyle?: 'box' | 'range-frame' | 'l-frame';
  showGrid?: boolean;
  showLegend?: boolean;
  interactive?: boolean;
  series: PlotSeries[];
  bands?: PlotConfidenceBand[];
  errorPoints?: PlotErrorPoint[];
  markers?: PlotMarker[];
  regions?: PlotRegion[];
  thresholds?: PlotThreshold[];
  scrubX?: number;
  onScrubX?: (x: number) => void;
  activeReadout?: { x: number; y: number; color?: string; secondaryY?: number };
}

function buildSeriesPath(
  pts: Array<{ sx: number; sy: number }>,
  mode: 'linear' | 'step-after' | 'monotone' = 'linear'
): string {
  if (pts.length === 0) return '';
  if (pts.length === 1) return `M${pts[0].sx.toFixed(1)},${pts[0].sy.toFixed(1)}`;

  if (mode === 'step-after') {
    const cmds: string[] = [`M${pts[0].sx.toFixed(1)},${pts[0].sy.toFixed(1)}`];
    for (let i = 1; i < pts.length; i++) {
      cmds.push(`L${pts[i].sx.toFixed(1)},${pts[i - 1].sy.toFixed(1)}`);
      cmds.push(`L${pts[i].sx.toFixed(1)},${pts[i].sy.toFixed(1)}`);
    }
    return cmds.join(' ');
  }

  if (mode === 'monotone' && pts.length >= 3) {
    const n = pts.length;
    const dx: number[] = [];
    const dy: number[] = [];
    const m: number[] = [];
    for (let i = 0; i < n - 1; i++) {
      dx.push(Math.max(1e-4, pts[i + 1].sx - pts[i].sx));
      dy.push(pts[i + 1].sy - pts[i].sy);
      m.push(dy[i] / dx[i]);
    }
    const tangents: number[] = [m[0]];
    for (let i = 1; i < n - 1; i++) {
      if (m[i - 1] * m[i] <= 0) {
        tangents.push(0);
      } else {
        tangents.push((m[i - 1] + m[i]) * 0.5);
      }
    }
    tangents.push(m[n - 2]);

    const cmds: string[] = [`M${pts[0].sx.toFixed(1)},${pts[0].sy.toFixed(1)}`];
    for (let i = 0; i < n - 1; i++) {
      const h = dx[i] / 3;
      const cp1x = pts[i].sx + h;
      const cp1y = pts[i].sy + tangents[i] * h;
      const cp2x = pts[i + 1].sx - h;
      const cp2y = pts[i + 1].sy - tangents[i + 1] * h;
      cmds.push(
        `C${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${pts[i + 1].sx.toFixed(1)},${pts[i + 1].sy.toFixed(1)}`
      );
    }
    return cmds.join(' ');
  }

  return pts
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'}${p.sx.toFixed(1)},${p.sy.toFixed(1)}`)
    .join(' ');
}

function interpolateSeriesY(
  points: Array<{ x: number; y: number }>,
  targetX: number,
  mode: 'linear' | 'step-after' | 'monotone' = 'linear'
): number | null {
  if (!points || points.length === 0) return null;
  if (targetX <= points[0].x) return points[0].y;
  if (targetX >= points[points.length - 1].x) return points[points.length - 1].y;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i];
    const p1 = points[i + 1];
    if (targetX >= p0.x && targetX <= p1.x) {
      if (mode === 'step-after') return p0.y;
      const t = (targetX - p0.x) / Math.max(1e-9, p1.x - p0.x);
      return p0.y + t * (p1.y - p0.y);
    }
  }
  return points[points.length - 1].y;
}

export const CartesianCanvas: React.FC<CartesianCanvasProps> = ({
  id,
  width = 450,
  height = 240,
  xDomain,
  yDomain,
  xScale = 'linear',
  yScale = 'linear',
  xTicks,
  yTicks,
  xTickFormat,
  yTickFormat,
  xAxisLabel,
  yAxisLabel,
  frameStyle = 'box',
  showGrid = true,
  showLegend = true,
  interactive = true,
  series,
  bands = [],
  errorPoints = [],
  markers = [],
  regions = [],
  thresholds = [],
  scrubX,
  onScrubX,
  activeReadout,
}) => {
  const { activeSymbolId } = useAcademicSystem();
  const [hoverX, setHoverX] = useState<number | null>(null);

  const hasLegend = showLegend && series.some((s) => Boolean(s.label));
  const hasEndLabels = series.some((s) => Boolean(s.endLabel));

  const pad = {
    top: hasLegend ? 30 : 16,
    right: hasEndLabels ? 58 : 18,
    bottom: xAxisLabel ? 40 : 28,
    left: yAxisLabel ? 52 : 40,
  };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const clipId = useMemo(
    () => `ads-clip-${id || Math.random().toString(36).slice(2, 9)}`,
    [id]
  );

  const mapX = (val: number) => {
    if (xScale === 'log') {
      const lMin = Math.log10(Math.max(1e-6, xDomain[0]));
      const lMax = Math.log10(Math.max(1e-5, xDomain[1]));
      const lVal = Math.log10(Math.max(1e-6, val));
      return pad.left + ((lVal - lMin) / (lMax - lMin)) * innerW;
    }
    return pad.left + ((val - xDomain[0]) / (xDomain[1] - xDomain[0])) * innerW;
  };

  const unmapX = (px: number) => {
    const ratio = Math.max(0, Math.min(1, (px - pad.left) / innerW));
    if (xScale === 'log') {
      const lMin = Math.log10(Math.max(1e-6, xDomain[0]));
      const lMax = Math.log10(Math.max(1e-5, xDomain[1]));
      return Math.pow(10, lMin + ratio * (lMax - lMin));
    }
    return xDomain[0] + ratio * (xDomain[1] - xDomain[0]);
  };

  const mapY = (val: number) => {
    if (yScale === 'log') {
      const lMin = Math.log10(Math.max(1e-6, yDomain[0]));
      const lMax = Math.log10(Math.max(1e-5, yDomain[1]));
      const lVal = Math.log10(Math.max(1e-6, val));
      return pad.top + ((lMax - lVal) / (lMax - lMin)) * innerH;
    }
    return pad.top + ((yDomain[1] - val) / (yDomain[1] - yDomain[0])) * innerH;
  };

  const formatNum = (v: number) => {
    if (Math.abs(v) < 1e-9) return '0.0';
    if (Math.abs(v) >= 100) return v.toFixed(0).replace('-', '−');
    return v.toFixed(1).replace('-', '−');
  };

  // Range-frame bounds
  const xSpineMin =
    frameStyle === 'range-frame' && xTicks.length > 1
      ? mapX(xTicks[0])
      : pad.left;
  const xSpineMax =
    frameStyle === 'range-frame' && xTicks.length > 1
      ? mapX(xTicks[xTicks.length - 1])
      : width - pad.right;
  const ySpineMin =
    frameStyle === 'range-frame' && yTicks.length > 1
      ? mapY(yTicks[yTicks.length - 1])
      : pad.top;
  const ySpineMax =
    frameStyle === 'range-frame' && yTicks.length > 1
      ? mapY(yTicks[0])
      : height - pad.bottom;

  // Log minor ticks if xScale === 'log'
  const logMinorXTicks = useMemo(() => {
    if (xScale !== 'log') return [];
    const minors: number[] = [];
    const minExp = Math.floor(Math.log10(Math.max(1e-6, xDomain[0])));
    const maxExp = Math.ceil(Math.log10(Math.max(1e-5, xDomain[1])));
    for (let e = minExp; e <= maxExp; e++) {
      const base = Math.pow(10, e);
      for (let m = 2; m <= 9; m++) {
        const val = m * base;
        if (val >= xDomain[0] && val <= xDomain[1]) {
          minors.push(val);
        }
      }
    }
    return minors;
  }, [xScale, xDomain]);

  // Effective crosshair X (either external scrubX or internal hoverX)
  const effectiveScrubX = hoverX !== null ? hoverX : scrubX;

  const crosshairIntersections = useMemo(() => {
    if (effectiveScrubX === undefined) return [];
    return series
      .map((s) => {
        const yVal = interpolateSeriesY(s.points, effectiveScrubX, s.interpolation);
        if (yVal === null) return null;
        return {
          id: s.id,
          label: s.label || s.id,
          color: s.color,
          x: effectiveScrubX,
          y: yVal,
        };
      })
      .filter(Boolean) as Array<{
      id: string;
      label: string;
      color: string;
      x: number;
      y: number;
    }>;
  }, [effectiveScrubX, series]);

  return (
    <svg
      id={id}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        cursor: interactive || onScrubX ? 'crosshair' : 'default',
        userSelect: 'none',
      }}
      onPointerMove={(e) => {
        if (!interactive && !onScrubX) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width) * width;
        const valX = unmapX(relX);
        if (onScrubX) {
          onScrubX(valX);
        } else if (interactive) {
          setHoverX(valX);
        }
      }}
      onPointerLeave={() => {
        if (hoverX !== null) setHoverX(null);
      }}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={pad.left} y={pad.top} width={innerW} height={innerH} />
        </clipPath>
      </defs>

      {/* Subtle Porcelain Plot Canvas Well */}
      {frameStyle === 'box' && (
        <rect
          x={pad.left}
          y={pad.top}
          width={innerW}
          height={innerH}
          fill="oklch(0.996 0.002 85 / 0.65)"
        />
      )}

      {/* Integrated Top Series Legend Strip */}
      {hasLegend && (
        <g transform={`translate(${pad.left}, 11)`}>
          {series
            .filter((s) => Boolean(s.label))
            .slice(0, 3)
            .map((s, idx) => {
              const offsetX = idx * Math.min(205, Math.floor(innerW / Math.min(3, series.length)));
              const isDash = Boolean(s.dashArray || s.dashed);
              return (
                <g key={`leg-${s.id}`} transform={`translate(${offsetX}, 0)`}>
                  <line
                    x1={0}
                    y1={0}
                    x2={14}
                    y2={0}
                    stroke={s.color}
                    strokeWidth={2}
                    strokeDasharray={s.dashArray || (isDash ? '3 2' : undefined)}
                  />
                  <text
                    x={18}
                    y={3.2}
                    fontSize="9"
                    fontFamily="var(--ads-font-chrome, Inter, sans-serif)"
                    fontWeight={500}
                    fill="#4E4D49"
                  >
                    {s.label && s.label.length > 34 ? `${s.label.slice(0, 33)}…` : s.label}
                  </text>
                </g>
              );
            })}
        </g>
      )}

      {/* Shaded Regime / Interval Regions (Clipped) */}
      <g clipPath={`url(#${clipId})`}>
        {regions.map((reg, idx) => {
          if (reg.axis === 'x') {
            const x1 = Math.min(mapX(reg.from), mapX(reg.to));
            const x2 = Math.max(mapX(reg.from), mapX(reg.to));
            return (
              <g key={`reg-${idx}`}>
                <rect
                  x={x1}
                  y={pad.top}
                  width={Math.max(1, x2 - x1)}
                  height={innerH}
                  fill={reg.color || 'oklch(0.92 0.03 255)'}
                  fillOpacity={reg.opacity ?? 0.25}
                />
                {reg.label && (
                  <text
                    x={(x1 + x2) / 2}
                    y={pad.top + 11}
                    textAnchor="middle"
                    fontSize="8.5"
                    fontFamily="var(--ads-font-mono, monospace)"
                    fill="#6E6C66"
                  >
                    {reg.label}
                  </text>
                )}
              </g>
            );
          } else {
            const y1 = Math.min(mapY(reg.from), mapY(reg.to));
            const y2 = Math.max(mapY(reg.from), mapY(reg.to));
            return (
              <g key={`reg-${idx}`}>
                <rect
                  x={pad.left}
                  y={y1}
                  width={innerW}
                  height={Math.max(1, y2 - y1)}
                  fill={reg.color || 'oklch(0.92 0.03 160)'}
                  fillOpacity={reg.opacity ?? 0.22}
                />
                {reg.label && (
                  <text
                    x={pad.left + 6}
                    y={y1 + 10}
                    fontSize="8.5"
                    fontFamily="var(--ads-font-mono, monospace)"
                    fill="#6E6C66"
                  >
                    {reg.label}
                  </text>
                )}
              </g>
            );
          }
        })}
      </g>

      {/* Gridlines & Y Ticks */}
      {yTicks.map((tick) => {
        const y = mapY(tick);
        const isZero = Math.abs(tick) < 1e-6 && yScale === 'linear';
        return (
          <g key={`ytick-${tick}`}>
            {showGrid && (
              <line
                x1={pad.left}
                y1={y}
                x2={width - pad.right}
                y2={y}
                stroke={
                  isZero
                    ? 'oklch(0.76 0.008 80)'
                    : 'oklch(0.932 0.004 82)'
                }
                strokeWidth={isZero ? 1 : 0.75}
              />
            )}
            {/* Surgical inward tick mark */}
            <line
              x1={pad.left}
              y1={y}
              x2={pad.left + 4.5}
              y2={y}
              stroke="oklch(0.42 0.008 80)"
              strokeWidth={0.9}
            />
            {frameStyle === 'box' && (
              <line
                x1={width - pad.right - 3.5}
                y1={y}
                x2={width - pad.right}
                y2={y}
                stroke="oklch(0.58 0.008 80)"
                strokeWidth={0.8}
              />
            )}
            <text
              x={pad.left - 6}
              y={y + 3.2}
              textAnchor="end"
              fontSize="9"
              fontFamily="var(--ads-font-mono, 'JetBrains Mono', monospace)"
              fill="#65635D"
            >
              {yTickFormat ? yTickFormat(tick) : formatNum(tick)}
            </text>
          </g>
        );
      })}

      {/* X Ticks & Vertical Gridlines */}
      {xTicks.map((tick) => {
        const x = mapX(tick);
        return (
          <g key={`xtick-${tick}`}>
            {showGrid && (
              <line
                x1={x}
                y1={pad.top}
                x2={x}
                y2={height - pad.bottom}
                stroke="oklch(0.945 0.004 82)"
                strokeWidth={0.65}
              />
            )}
            <line
              x1={x}
              y1={height - pad.bottom - 4.5}
              x2={x}
              y2={height - pad.bottom}
              stroke="oklch(0.42 0.008 80)"
              strokeWidth={0.9}
            />
            {frameStyle === 'box' && (
              <line
                x1={x}
                y1={pad.top}
                x2={x}
                y2={pad.top + 3.5}
                stroke="oklch(0.58 0.008 80)"
                strokeWidth={0.8}
              />
            )}
            <text
              x={x}
              y={height - pad.bottom + 14}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--ads-font-mono, 'JetBrains Mono', monospace)"
              fill="#65635D"
            >
              {xTickFormat ? xTickFormat(tick) : `${tick}`}
            </text>
          </g>
        );
      })}

      {/* Log minor ticks */}
      {logMinorXTicks.map((mTick) => {
        const x = mapX(mTick);
        return (
          <line
            key={`logminor-${mTick}`}
            x1={x}
            y1={height - pad.bottom - 2.4}
            x2={x}
            y2={height - pad.bottom}
            stroke="oklch(0.65 0.006 80)"
            strokeWidth={0.7}
          />
        );
      })}

      {/* Clipped Data Layer: Confidence Bands, Series Curves, Area Fills & Error Bars */}
      <g clipPath={`url(#${clipId})`}>
        {/* Confidence Bands */}
        {bands.map((band) => {
          if (band.points.length < 2) return null;
          const d = [
            ...band.points.map(
              (p, idx) =>
                `${idx === 0 ? 'M' : 'L'}${mapX(p.x).toFixed(1)},${mapY(p.upper).toFixed(1)}`
            ),
            ...[...band.points]
              .reverse()
              .map((p) => `L${mapX(p.x).toFixed(1)},${mapY(p.lower).toFixed(1)}`),
            'Z',
          ].join(' ');
          return (
            <path
              key={band.id}
              d={d}
              fill={band.color}
              fillOpacity={band.opacity ?? 0.18}
              style={{ mixBlendMode: 'multiply' }}
            />
          );
        })}

        {/* Series Curves, Step-Functions, Monotone Splines & Shaded Fills */}
        {series.map((s) => {
          if (s.points.length < 2) return null;
          const isHighlighted = s.symbolId && activeSymbolId === s.symbolId;
          const screenPts = s.points.map((p) => ({ sx: mapX(p.x), sy: mapY(p.y) }));
          const pathD = buildSeriesPath(screenPts, s.interpolation);

          const shouldFill = Boolean(s.fillToZero || s.fillArea);
          const baseVal =
            s.fillToZero && yDomain[0] <= 0 && yDomain[1] >= 0 ? 0 : yDomain[0];
          const baseY = mapY(baseVal);
          const areaD = shouldFill
            ? `${pathD} L${screenPts[screenPts.length - 1].sx.toFixed(1)},${baseY.toFixed(1)} L${screenPts[0].sx.toFixed(1)},${baseY.toFixed(1)} Z`
            : undefined;

          const effectiveDash = s.dashArray || (s.dashed ? '4 3' : undefined);

          return (
            <g key={s.id}>
              {areaD && (
                <path
                  d={areaD}
                  fill={s.color}
                  fillOpacity={s.fillOpacity ?? 0.12}
                  style={{ mixBlendMode: 'multiply' }}
                />
              )}
              <path
                d={pathD}
                fill="none"
                stroke={s.color}
                strokeWidth={
                  isHighlighted ? (s.strokeWidth ?? 1.85) + 0.85 : s.strokeWidth ?? 1.85
                }
                strokeDasharray={effectiveDash}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Clinical / Censored Observation Tick Marks (+) */}
              {s.censorPoints &&
                s.censorPoints.map((cxVal, cIdx) => {
                  const cyVal = interpolateSeriesY(s.points, cxVal, s.interpolation);
                  if (cyVal === null) return null;
                  const px = mapX(cxVal);
                  const py = mapY(cyVal);
                  return (
                    <g key={`cens-${s.id}-${cIdx}`}>
                      <line
                        x1={px}
                        y1={py - 3.2}
                        x2={px}
                        y2={py + 3.2}
                        stroke={s.color}
                        strokeWidth={1.25}
                      />
                      <line
                        x1={px - 2.4}
                        y1={py}
                        x2={px + 2.4}
                        y2={py}
                        stroke={s.color}
                        strokeWidth={1.25}
                      />
                    </g>
                  );
                })}
            </g>
          );
        })}

        {/* Empirical Telemetry Points with ±1σ Error Bars */}
        {errorPoints.map((pt, idx) => {
          const cx = mapX(pt.x);
          const cy = mapY(pt.y);
          const yTop = mapY(pt.y + pt.yErr);
          const yBot = mapY(pt.y - pt.yErr);
          const c = pt.color || 'oklch(0.32 0.04 255)';
          return (
            <g key={`errpt-${idx}`} opacity={0.88}>
              <line x1={cx} y1={yTop} x2={cx} y2={yBot} stroke={c} strokeWidth={1.05} />
              <line x1={cx - 2.5} y1={yTop} x2={cx + 2.5} y2={yTop} stroke={c} strokeWidth={1.05} />
              <line x1={cx - 2.5} y1={yBot} x2={cx + 2.5} y2={yBot} stroke={c} strokeWidth={1.05} />
              <circle cx={cx} cy={cy} r={2.3} fill="#FFFFFF" stroke={c} strokeWidth={1.25} />
            </g>
          );
        })}
      </g>

      {/* Direct End-of-Line Series Labels (Tufte Style) */}
      {series.map((s) => {
        if (!s.endLabel || s.points.length === 0) return null;
        const lastPt = s.points[s.points.length - 1];
        const lx = width - pad.right + 5;
        const ly = Math.max(pad.top + 6, Math.min(height - pad.bottom - 4, mapY(lastPt.y)));
        return (
          <text
            key={`endlabel-${s.id}`}
            x={lx}
            y={ly + 3}
            fontSize="9"
            fontFamily="var(--ads-font-mono, monospace)"
            fontWeight={600}
            fill={s.color}
          >
            {s.endLabel}
          </text>
        );
      })}

      {/* Threshold Annotations */}
      {thresholds.map((th, idx) => {
        if (th.axis === 'x') {
          const x = mapX(th.value);
          const alignEnd = x > pad.left + innerW * 0.68;
          return (
            <g key={`th-${idx}`}>
              <line
                x1={x}
                y1={pad.top}
                x2={x}
                y2={height - pad.bottom}
                stroke={th.color || 'oklch(0.55 0.16 32 / 0.65)'}
                strokeWidth={1}
                strokeDasharray={th.dashArray || '3 2'}
              />
              {th.label && (
                <text
                  x={alignEnd ? x - 5 : x + 5}
                  y={pad.top + 11}
                  textAnchor={alignEnd ? 'end' : 'start'}
                  fontSize="8.8"
                  fontFamily="var(--ads-font-mono, Inter, sans-serif)"
                  fontWeight={500}
                  fill={th.color || '#6E6C66'}
                >
                  {th.label}
                </text>
              )}
            </g>
          );
        } else {
          const y = mapY(th.value);
          return (
            <g key={`th-${idx}`}>
              <line
                x1={pad.left}
                y1={y}
                x2={width - pad.right}
                y2={y}
                stroke={th.color || 'oklch(0.55 0.16 32 / 0.65)'}
                strokeWidth={1}
                strokeDasharray={th.dashArray || '3 2'}
              />
              {th.label && (
                <text
                  x={width - pad.right - 5}
                  y={y - 4}
                  textAnchor="end"
                  fontSize="8.8"
                  fontFamily="var(--ads-font-mono, Inter, sans-serif)"
                  fontWeight={500}
                  fill={th.color || '#6E6C66'}
                >
                  {th.label}
                </text>
              )}
            </g>
          );
        }
      })}

      {/* Scatter / Pareto Frontier Landmark Markers */}
      {markers.map((mk, idx) => {
        const cx = mapX(mk.x);
        const cy = mapY(mk.y);
        const r = mk.size ?? 3.6;
        const c = mk.color || 'oklch(0.42 0.16 255)';
        const pos = mk.labelPosition || (cx > pad.left + innerW * 0.72 ? 'left' : 'right');
        const tx = pos === 'left' ? cx - r - 5 : pos === 'right' ? cx + r + 5 : cx;
        const ty =
          pos === 'top'
            ? cy - r - 5
            : pos === 'bottom'
            ? cy + r + 10
            : cy + 3;
        const anchor = pos === 'left' ? 'end' : pos === 'right' ? 'start' : 'middle';

        return (
          <g key={mk.id || `mk-${idx}`}>
            {mk.halo && (
              <circle cx={cx} cy={cy} r={r + 3.5} fill={c} fillOpacity={0.16} />
            )}
            {mk.shape === 'diamond' ? (
              <polygon
                points={`${cx},${cy - r - 0.8} ${cx + r + 0.8},${cy} ${cx},${cy + r + 0.8} ${cx - r - 0.8},${cy}`}
                fill={c}
                stroke="#FFFFFF"
                strokeWidth={1.2}
              />
            ) : mk.shape === 'square' ? (
              <rect
                x={cx - r}
                y={cy - r}
                width={r * 2}
                height={r * 2}
                rx={1}
                fill={c}
                stroke="#FFFFFF"
                strokeWidth={1.2}
              />
            ) : (
              <circle
                cx={cx}
                cy={cy}
                r={r}
                fill={c}
                stroke="#FFFFFF"
                strokeWidth={1.3}
              />
            )}
            {mk.label && (
              <text
                x={tx}
                y={ty}
                textAnchor={anchor}
                fontSize="8.8"
                fontFamily="var(--ads-font-chrome, Inter, sans-serif)"
                fontWeight={600}
                fill="#141413"
                style={{
                  paintOrder: 'stroke',
                  stroke: 'rgba(255, 255, 255, 0.92)',
                  strokeWidth: 2.5,
                  strokeLinejoin: 'round',
                }}
              >
                {mk.label}
              </text>
            )}
          </g>
        );
      })}

      {/* Axis Spines (Box, L-Frame, or Tufte Range-Frame) */}
      <line
        x1={xSpineMin}
        y1={height - pad.bottom}
        x2={xSpineMax}
        y2={height - pad.bottom}
        stroke="oklch(0.38 0.008 80)"
        strokeWidth={1}
      />
      <line
        x1={pad.left}
        y1={ySpineMin}
        x2={pad.left}
        y2={ySpineMax}
        stroke="oklch(0.38 0.008 80)"
        strokeWidth={1}
      />
      {frameStyle === 'box' && (
        <>
          <line
            x1={pad.left}
            y1={pad.top}
            x2={width - pad.right}
            y2={pad.top}
            stroke="oklch(0.66 0.006 80)"
            strokeWidth={0.85}
          />
          <line
            x1={width - pad.right}
            y1={pad.top}
            x2={width - pad.right}
            y2={height - pad.bottom}
            stroke="oklch(0.66 0.006 80)"
            strokeWidth={0.85}
          />
        </>
      )}

      {/* Axis Titles */}
      {xAxisLabel && (
        <text
          x={pad.left + innerW / 2}
          y={height - 5}
          textAnchor="middle"
          fontSize="10.2"
          fontFamily="KaTeX_Main, Newsreader, serif"
          fontStyle="italic"
          fill="#3E3D3A"
        >
          {xAxisLabel}
        </text>
      )}
      {yAxisLabel && (
        <text
          x={13}
          y={pad.top + innerH / 2}
          textAnchor="middle"
          fontSize="10.2"
          fontFamily="KaTeX_Main, Newsreader, serif"
          fontStyle="italic"
          fill="#3E3D3A"
          transform={`rotate(-90, 13, ${pad.top + innerH / 2})`}
        >
          {yAxisLabel}
        </text>
      )}

      {/* Interactive Scrubbed Hairline, Multi-Series Dots & Floating Readout Pill */}
      {effectiveScrubX !== undefined && (
        <g>
          <line
            x1={mapX(effectiveScrubX)}
            y1={pad.top}
            x2={mapX(effectiveScrubX)}
            y2={height - pad.bottom}
            stroke="oklch(0.52 0.18 32 / 0.65)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />

          {activeReadout ? (
            <>
              {activeReadout.secondaryY !== undefined && (
                <circle
                  cx={mapX(activeReadout.x)}
                  cy={mapY(activeReadout.secondaryY)}
                  r={3.2}
                  fill="oklch(0.48 0.14 160)"
                  stroke="#FFFFFF"
                  strokeWidth={1.3}
                />
              )}
              <circle
                cx={mapX(activeReadout.x)}
                cy={mapY(activeReadout.y)}
                r={4}
                fill={activeReadout.color || 'oklch(0.42 0.16 255)'}
                stroke="#FFFFFF"
                strokeWidth={1.5}
              />
            </>
          ) : (
            crosshairIntersections.map((pt) => (
              <circle
                key={`xhair-dot-${pt.id}`}
                cx={mapX(pt.x)}
                cy={mapY(pt.y)}
                r={3.6}
                fill={pt.color}
                stroke="#FFFFFF"
                strokeWidth={1.4}
              />
            ))
          )}

          {/* Floating Telemetry Readout Badge when hovering */}
          {hoverX !== null && crosshairIntersections.length > 0 && (
            <g
              transform={`translate(${
                mapX(hoverX) > pad.left + innerW * 0.58
                  ? Math.max(pad.left + 4, mapX(hoverX) - 118)
                  : Math.min(width - pad.right - 118, mapX(hoverX) + 8)
              }, ${pad.top + 6})`}
            >
              <rect
                x={0}
                y={0}
                width={112}
                height={16 + crosshairIntersections.slice(0, 3).length * 12}
                rx={3.5}
                fill="rgba(255, 255, 255, 0.94)"
                stroke="oklch(0.84 0.008 82)"
                strokeWidth={0.8}
              />
              <text
                x={6}
                y={11}
                fontSize="8.5"
                fontFamily="var(--ads-font-mono, monospace)"
                fontWeight={600}
                fill="#4E4D49"
              >
                x = {xTickFormat ? xTickFormat( Number(hoverX.toFixed(2)) ) : hoverX.toFixed(2)}
              </text>
              {crosshairIntersections.slice(0, 3).map((item, idx) => (
                <g key={`ro-${item.id}`} transform={`translate(6, ${22 + idx * 12})`}>
                  <circle cx={3} cy={-2.5} r={2.5} fill={item.color} />
                  <text
                    x={9}
                    y={0}
                    fontSize="8.5"
                    fontFamily="var(--ads-font-mono, monospace)"
                    fill="#141413"
                  >
                    {item.y.toFixed(2).replace('-', '−')}
                  </text>
                </g>
              ))}
            </g>
          )}
        </g>
      )}
    </svg>
  );
};

/**
 * ============================================================================
 * 3. SYMPLECTIC PHASE-SPACE & VECTOR QUIVER ENGINE (<PhaseSpaceCanvas />)
 * ============================================================================
 * Renders a 2D vector field (dx/dt, dy/dt) with normalized quiver arrows,
 * Hamiltonian iso-energy contours, phase trajectories, instantaneous
 * velocity tangent vector, and interactive click-to-seed RK4 test orbits!
 */
export interface PhaseSpaceCanvasProps {
  width?: number;
  height?: number;
  xDomain: [number, number];
  yDomain: [number, number];
  xAxisLabel?: string;
  yAxisLabel?: string;
  trajectory: Array<{ x: number; y: number }>;
  activePoint?: { x: number; y: number; vx?: number; vy?: number };
  equilibrium?: { x: number; y: number };
  energyRadius?: number;
  showQuiver?: boolean;
  vectorField?: (x: number, y: number) => [number, number];
  contourRadii?: number[];
}

export const PhaseSpaceCanvas: React.FC<PhaseSpaceCanvasProps> = ({
  width = 250,
  height = 240,
  xDomain,
  yDomain,
  xAxisLabel = 'x',
  yAxisLabel = 'v / ω₀',
  trajectory,
  activePoint,
  equilibrium = { x: 0, y: 0 },
  energyRadius,
  showQuiver = true,
  vectorField,
  contourRadii = [0.4, 0.8, 1.1],
}) => {
  const [seededStarts, setSeededStarts] = useState<Array<{ x: number; y: number }>>([]);
  const [hoverCoord, setHoverCoord] = useState<{ x: number; y: number } | null>(null);

  const pad = { top: 16, right: 16, bottom: 38, left: 38 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const clipId = useMemo(
    () => `ads-phase-clip-${Math.random().toString(36).slice(2, 9)}`,
    []
  );

  const mapX = (xVal: number) =>
    pad.left + ((xVal - xDomain[0]) / (xDomain[1] - xDomain[0])) * innerW;
  const mapY = (yVal: number) =>
    pad.top + ((yDomain[1] - yVal) / (yDomain[1] - yDomain[0])) * innerH;

  const unmapX = (px: number) =>
    xDomain[0] + Math.max(0, Math.min(1, (px - pad.left) / innerW)) * (xDomain[1] - xDomain[0]);
  const unmapY = (py: number) =>
    yDomain[1] - Math.max(0, Math.min(1, (py - pad.top) / innerH)) * (yDomain[1] - yDomain[0]);

  const trajPath = trajectory
    .map(
      (p, idx) =>
        `${idx === 0 ? 'M' : 'L'}${mapX(p.x).toFixed(1)},${mapY(p.y).toFixed(1)}`
    )
    .join(' ');

  // Integrate user-seeded test particles via 4th-order Runge-Kutta (RK4)
  const seededOrbits = useMemo(() => {
    if (!vectorField || seededStarts.length === 0) return [];
    const dt = 0.045;
    const steps = 95;
    return seededStarts.map((start) => {
      const pts: Array<{ x: number; y: number }> = [{ x: start.x, y: start.y }];
      let cx = start.x;
      let cy = start.y;
      for (let s = 0; s < steps; s++) {
        const [k1x, k1y] = vectorField(cx, cy);
        const [k2x, k2y] = vectorField(cx + 0.5 * dt * k1x, cy + 0.5 * dt * k1y);
        const [k3x, k3y] = vectorField(cx + 0.5 * dt * k2x, cy + 0.5 * dt * k2y);
        const [k4x, k4y] = vectorField(cx + dt * k3x, cy + dt * k3y);
        cx += (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x);
        cy += (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y);
        if (
          !Number.isFinite(cx) ||
          !Number.isFinite(cy) ||
          Math.abs(cx) > Math.max(20, Math.abs(xDomain[1]) * 3) ||
          Math.abs(cy) > Math.max(20, Math.abs(yDomain[1]) * 3)
        ) {
          break;
        }
        pts.push({ x: cx, y: cy });
      }
      return {
        start,
        path: pts
          .map(
            (p, idx) =>
              `${idx === 0 ? 'M' : 'L'}${mapX(p.x).toFixed(1)},${mapY(p.y).toFixed(1)}`
          )
          .join(' '),
      };
    });
  }, [seededStarts, vectorField, xDomain, yDomain, innerW, innerH]);

  // Generate 2D Quiver Grid
  const quiverArrows = useMemo(() => {
    if (!showQuiver || !vectorField) return [];
    const nx = 9;
    const ny = 9;
    const arrows: Array<{
      x1: number;
      y1: number;
      x2: number;
      y2: number;
      hx1: number;
      hy1: number;
      hx2: number;
      hy2: number;
      magNorm: number;
    }> = [];

    for (let i = 1; i < nx; i++) {
      for (let j = 1; j < ny; j++) {
        const xv = xDomain[0] + (i / nx) * (xDomain[1] - xDomain[0]);
        const yv = yDomain[0] + (j / ny) * (yDomain[1] - yDomain[0]);
        const [dx, dy] = vectorField(xv, yv);
        const mag = Math.hypot(dx, dy);
        if (mag < 1e-5) continue;

        const cx = mapX(xv);
        const cy = mapY(yv);
        const ux = dx / mag;
        const uy = -dy / mag;
        const len = Math.min(11, 5.5 + Math.min(1, mag / 4) * 5.5);

        const x1 = cx - ux * (len * 0.45);
        const y1 = cy - uy * (len * 0.45);
        const x2 = cx + ux * (len * 0.55);
        const y2 = cy + uy * (len * 0.55);

        const wingLen = 3.2;
        const px = -uy;
        const py = ux;
        const hx1 = x2 - ux * wingLen + px * 1.8;
        const hy1 = y2 - uy * wingLen + py * 1.8;
        const hx2 = x2 - ux * wingLen - px * 1.8;
        const hy2 = y2 - uy * wingLen - py * 1.8;

        arrows.push({
          x1,
          y1,
          x2,
          y2,
          hx1,
          hy1,
          hx2,
          hy2,
          magNorm: Math.min(1, mag / 5),
        });
      }
    }
    return arrows;
  }, [showQuiver, vectorField, xDomain, yDomain, innerW, innerH]);

  const eqX = mapX(equilibrium.x);
  const eqY = mapY(equilibrium.y);
  const scaleRx = innerW / (xDomain[1] - xDomain[0]);
  const scaleRy = innerH / (yDomain[1] - yDomain[0]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        cursor: vectorField ? 'crosshair' : 'default',
        userSelect: 'none',
      }}
      onClick={(e) => {
        if (!vectorField) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * width;
        const py = ((e.clientY - rect.top) / rect.height) * height;
        if (px < pad.left || px > width - pad.right || py < pad.top || py > height - pad.bottom) {
          return;
        }
        const sx = unmapX(px);
        const sy = unmapY(py);
        setSeededStarts((prev) => [...prev.slice(-4), { x: sx, y: sy }]);
      }}
      onPointerMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * width;
        const py = ((e.clientY - rect.top) / rect.height) * height;
        if (px >= pad.left && px <= width - pad.right && py >= pad.top && py <= height - pad.bottom) {
          setHoverCoord({ x: unmapX(px), y: unmapY(py) });
        } else {
          setHoverCoord(null);
        }
      }}
      onPointerLeave={() => setHoverCoord(null)}
    >
      <defs>
        <clipPath id={clipId}>
          <rect x={pad.left} y={pad.top} width={innerW} height={innerH} />
        </clipPath>
      </defs>

      {/* Subtle Porcelain Well */}
      <rect
        x={pad.left}
        y={pad.top}
        width={innerW}
        height={innerH}
        fill="oklch(0.996 0.002 85 / 0.65)"
        stroke="oklch(0.66 0.006 80)"
        strokeWidth={0.85}
      />

      <g clipPath={`url(#${clipId})`}>
        {/* Equilibrium Crosshairs */}
        <line
          x1={pad.left}
          y1={eqY}
          x2={width - pad.right}
          y2={eqY}
          stroke="oklch(0.88 0.005 80)"
          strokeWidth={0.85}
        />
        <line
          x1={eqX}
          y1={pad.top}
          x2={eqX}
          y2={height - pad.bottom}
          stroke="oklch(0.88 0.005 80)"
          strokeWidth={0.85}
        />

        {/* Iso-Energy Contours */}
        {contourRadii.map((r, i) => (
          <ellipse
            key={`contour-${i}`}
            cx={eqX}
            cy={eqY}
            rx={r * scaleRx}
            ry={r * scaleRy}
            fill="none"
            stroke="oklch(0.90 0.005 80)"
            strokeWidth={0.75}
            strokeDasharray="2 2"
          />
        ))}

        {/* 2D Vector Quiver Field */}
        {quiverArrows.map((a, idx) => (
          <g key={`q-${idx}`} opacity={0.34 + a.magNorm * 0.3}>
            <line
              x1={a.x1}
              y1={a.y1}
              x2={a.x2}
              y2={a.y2}
              stroke="oklch(0.50 0.04 250)"
              strokeWidth={0.85}
            />
            <polyline
              points={`${a.hx1.toFixed(1)},${a.hy1.toFixed(1)} ${a.x2.toFixed(1)},${a.y2.toFixed(1)} ${a.hx2.toFixed(1)},${a.hy2.toFixed(1)}`}
              fill="none"
              stroke="oklch(0.50 0.04 250)"
              strokeWidth={0.85}
            />
          </g>
        ))}

        {/* Active Instantaneous Lyapunov Energy Shell */}
        {energyRadius !== undefined && energyRadius > 0.01 && (
          <ellipse
            cx={eqX}
            cy={eqY}
            rx={energyRadius * scaleRx}
            ry={energyRadius * scaleRy}
            fill="oklch(0.92 0.04 160 / 0.16)"
            stroke="oklch(0.48 0.14 160 / 0.65)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        )}

        {/* User-Seeded RK4 Test Trajectories */}
        {seededOrbits.map((orb, idx) => (
          <g key={`seed-orb-${idx}`}>
            <path
              d={orb.path}
              fill="none"
              stroke="oklch(0.52 0.17 310)"
              strokeWidth={1.35}
              strokeDasharray="3 1.5"
              opacity={0.82}
            />
            <circle
              cx={mapX(orb.start.x)}
              cy={mapY(orb.start.y)}
              r={2.8}
              fill="oklch(0.52 0.17 310)"
              stroke="#FFFFFF"
              strokeWidth={1}
            />
          </g>
        ))}

        {/* Primary Phase Trajectory */}
        <path
          d={trajPath}
          fill="none"
          stroke="oklch(0.42 0.16 255)"
          strokeWidth={1.85}
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Active Particle & Tangent Velocity Vector */}
        {activePoint && (
          <g>
            {activePoint.vx !== undefined && activePoint.vy !== undefined && (
              <line
                x1={mapX(activePoint.x)}
                y1={mapY(activePoint.y)}
                x2={mapX(activePoint.x) + activePoint.vx * 18}
                y2={mapY(activePoint.y) - activePoint.vy * 18}
                stroke="oklch(0.55 0.19 32)"
                strokeWidth={1.45}
              />
            )}
            <circle
              cx={mapX(activePoint.x)}
              cy={mapY(activePoint.y)}
              r={4.2}
              fill="oklch(0.55 0.19 32)"
              stroke="#FFFFFF"
              strokeWidth={1.5}
            />
          </g>
        )}
      </g>

      {/* Interactive Seed Hint / Coordinate Readout */}
      {hoverCoord ? (
        <text
          x={pad.left + 5}
          y={pad.top + 11}
          fontSize="8.2"
          fontFamily="var(--ads-font-mono, monospace)"
          fill="#4E4D49"
        >
          ({hoverCoord.x.toFixed(2)}, {hoverCoord.y.toFixed(2)}) · Click to seed RK4
        </text>
      ) : seededOrbits.length > 0 ? (
        <text
          x={pad.left + 5}
          y={pad.top + 11}
          fontSize="8.2"
          fontFamily="var(--ads-font-mono, monospace)"
          fill="oklch(0.48 0.16 310)"
          style={{ cursor: 'pointer' }}
          onClick={(e) => {
            e.stopPropagation();
            setSeededStarts([]);
          }}
        >
          {seededOrbits.length} RK4 orbit{seededOrbits.length > 1 ? 's' : ''} · [Reset]
        </text>
      ) : null}

      {/* Axis Labels */}
      <text
        x={pad.left + innerW / 2}
        y={height - 5}
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, Newsreader, serif"
        fontStyle="italic"
        fill="#3E3D3A"
      >
        {xAxisLabel}
      </text>
      <text
        x={12}
        y={pad.top + innerH / 2}
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, Newsreader, serif"
        fontStyle="italic"
        fill="#3E3D3A"
        transform={`rotate(-90, 12, ${pad.top + innerH / 2})`}
      >
        {yAxisLabel}
      </text>
    </svg>
  );
};

/**
 * ============================================================================
 * 4. COMPLEX s-PLANE POLE-ZERO & ROOT LOCUS ENGINE (<ComplexPlaneCanvas />)
 * ============================================================================
 * Visualizes characteristic eigenvalues λ₁,₂ = −ζω₀ ± iω₀√(1−ζ²) in the
 * complex Argand plane with stability boundary Re(s)=0, iso-ω₀ semicircle,
 * damping angle θ = arccos(ζ) arc, and interactive pole telemetry readout.
 */
export interface ComplexPlaneCanvasProps {
  width?: number;
  height?: number;
  zeta: number;
  omega0: number;
}

export const ComplexPlaneCanvas: React.FC<ComplexPlaneCanvasProps> = ({
  width = 250,
  height = 240,
  zeta,
  omega0,
}) => {
  const [hovered, setHovered] = useState(false);

  const pad = { top: 16, right: 16, bottom: 38, left: 38 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const reMin = -Math.max(6.5, omega0 * 1.65);
  const reMax = 1.5;
  const imMax = Math.max(6.0, omega0 * 1.35);

  const mapRe = (re: number) =>
    pad.left + ((re - reMin) / (reMax - reMin)) * innerW;
  const mapIm = (im: number) =>
    pad.top + ((imMax - im) / (2 * imMax)) * innerH;

  const originX = mapRe(0);
  const originY = mapIm(0);

  // Compute current poles
  let p1 = { re: -zeta * omega0, im: 0 };
  let p2 = { re: -zeta * omega0, im: 0 };
  if (zeta < 1.0) {
    const wd = omega0 * Math.sqrt(1 - zeta * zeta);
    p1 = { re: -zeta * omega0, im: wd };
    p2 = { re: -zeta * omega0, im: -wd };
  } else {
    const alpha = omega0 * Math.sqrt(zeta * zeta - 1);
    p1 = { re: -zeta * omega0 + alpha, im: 0 };
    p2 = { re: -zeta * omega0 - alpha, im: 0 };
  }

  // Semicircle path for constant |s| = omega0 in LHP
  const semiPoints: string[] = [];
  for (let k = 0; k <= 40; k++) {
    const theta = Math.PI / 2 + (k / 40) * Math.PI;
    const re = omega0 * Math.cos(theta);
    const im = omega0 * Math.sin(theta);
    semiPoints.push(
      `${k === 0 ? 'M' : 'L'}${mapRe(re).toFixed(1)},${mapIm(im).toFixed(1)}`
    );
  }
  const semiPath = semiPoints.join(' ');

  const qFactor = (1 / (2 * Math.max(0.01, zeta))).toFixed(2);
  const settlingTau = (4 / Math.max(0.05, zeta * omega0)).toFixed(2);
  const dampingDeg =
    zeta < 1 ? ((Math.acos(zeta) * 180) / Math.PI).toFixed(0) : '0';

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        userSelect: 'none',
      }}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Stable LHP shading (Re(s) < 0) */}
      <rect
        x={pad.left}
        y={pad.top}
        width={Math.max(0, originX - pad.left)}
        height={innerH}
        fill="oklch(0.968 0.012 160 / 0.45)"
      />
      {/* Unstable RHP shading (Re(s) > 0) */}
      <rect
        x={originX}
        y={pad.top}
        width={Math.max(0, width - pad.right - originX)}
        height={innerH}
        fill="oklch(0.968 0.015 32 / 0.28)"
      />

      {/* Box Frame */}
      <rect
        x={pad.left}
        y={pad.top}
        width={innerW}
        height={innerH}
        fill="none"
        stroke="oklch(0.66 0.006 80)"
        strokeWidth={0.85}
      />

      {/* Constant Decay Rate Vertical Line Re(s) = -ζω₀ */}
      <line
        x1={mapRe(p1.re)}
        y1={pad.top}
        x2={mapRe(p1.re)}
        y2={height - pad.bottom}
        stroke="oklch(0.48 0.14 160 / 0.4)"
        strokeWidth={0.85}
        strokeDasharray="2 2"
      />

      {/* Real & Imaginary Axes */}
      <line
        x1={pad.left}
        y1={originY}
        x2={width - pad.right}
        y2={originY}
        stroke="oklch(0.74 0.008 80)"
        strokeWidth={0.9}
      />
      <line
        x1={originX}
        y1={pad.top}
        x2={originX}
        y2={height - pad.bottom}
        stroke="oklch(0.55 0.08 32 / 0.65)"
        strokeWidth={1}
        strokeDasharray="3 2"
      />

      {/* Root-Locus Semicircle |s| = ω₀ */}
      <path
        d={semiPath}
        fill="none"
        stroke="oklch(0.42 0.16 255 / 0.48)"
        strokeWidth={1.25}
        strokeDasharray="3 2"
      />

      {/* Real-axis breakaway branch for ζ ≥ 1 */}
      <line
        x1={mapRe(reMin * 0.92)}
        y1={originY}
        x2={originX}
        y2={originY}
        stroke="oklch(0.42 0.16 255 / 0.32)"
        strokeWidth={2}
      />

      {/* Damping angle rays from origin to poles */}
      <line
        x1={originX}
        y1={originY}
        x2={mapRe(p1.re)}
        y2={mapIm(p1.im)}
        stroke="oklch(0.55 0.19 32 / 0.65)"
        strokeWidth={1.05}
      />
      <line
        x1={originX}
        y1={originY}
        x2={mapRe(p2.re)}
        y2={mapIm(p2.im)}
        stroke="oklch(0.55 0.19 32 / 0.65)"
        strokeWidth={1.05}
      />

      {/* Pole Cross Markers (×) for λ₁ and λ₂ */}
      {[p1, p2].map((pole, idx) => {
        const cx = mapRe(pole.re);
        const cy = mapIm(pole.im);
        const s = 4.2;
        return (
          <g key={`pole-${idx}`}>
            <circle cx={cx} cy={cy} r={6.5} fill="oklch(0.52 0.20 32 / 0.12)" />
            <line
              x1={cx - s}
              y1={cy - s}
              x2={cx + s}
              y2={cy + s}
              stroke="oklch(0.52 0.20 32)"
              strokeWidth={2}
            />
            <line
              x1={cx - s}
              y1={cy + s}
              x2={cx + s}
              y2={cy - s}
              stroke="oklch(0.52 0.20 32)"
              strokeWidth={2}
            />
          </g>
        );
      })}

      {/* Annotations & Spectral Readout */}
      <text
        x={pad.left + 5}
        y={pad.top + 11}
        fontSize="8.2"
        fontFamily="var(--ads-font-mono, monospace)"
        fill="#4E4D49"
      >
        {hovered
          ? `Q=${qFactor} · θ=${dampingDeg}° · τ_s≈${settlingTau}s`
          : `LHP Stable · Q=${qFactor}`}
      </text>
      <text
        x={mapRe(-omega0)}
        y={originY + 13}
        textAnchor="middle"
        fontSize="8.5"
        fontFamily="var(--ads-font-mono, monospace)"
        fill="#65635D"
      >
        −ω₀
      </text>

      {/* Axis Titles */}
      <text
        x={pad.left + innerW / 2}
        y={height - 5}
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, Newsreader, serif"
        fontStyle="italic"
        fill="#3E3D3A"
      >
        Re(λ) [s⁻¹]
      </text>
      <text
        x={12}
        y={pad.top + innerH / 2}
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, Newsreader, serif"
        fontStyle="italic"
        fill="#3E3D3A"
        transform={`rotate(-90, 12, ${pad.top + innerH / 2})`}
      >
        Im(λ) [rad·s⁻¹]
      </text>
    </svg>
  );
};

/**
 * ============================================================================
 * 5. MULTI-PANEL SCIENTIFIC WORKBENCH (<ScientificPlot />)
 * ============================================================================
 * Unifies Time-Domain, Phase-Space Quiver, Spectral Bode (Log-Freq), and
 * Complex s-Plane Root Locus across all 3 physical models.
 */
export interface ScientificPlotProps {
  id?: string;
  zeta: number;
  omega0: number;
  model?: 'damped-oscillator' | 'quantum-eigenstates' | 'lotka-volterra';
  quantumN?: number;
  lvAlpha?: number;
  lvBeta?: number;
  showConfidenceBand?: boolean;
  figureNumber?: string;
}

export const ScientificPlot: React.FC<ScientificPlotProps> = ({
  id = 'fig:phase',
  zeta,
  omega0,
  model = 'damped-oscillator',
  quantumN = 2,
  lvAlpha = 1.1,
  lvBeta = 0.4,
  showConfidenceBand = true,
  figureNumber = 'Figure 1.1',
}) => {
  const { activeSymbolId, hoverSymbol, togglePinSymbol } = useAcademicSystem();

  const [scrubTime, setScrubTime] = useState<number>(1.35);
  const [viewMode, setViewMode] = useState<'2-panel' | '3-panel' | 'spectral'>('3-panel');
  const [rightPanelMode, setRightPanelMode] = useState<'bode' | 's-plane'>('s-plane');
  const [enableCI, setEnableCI] = useState<boolean>(showConfidenceBand);
  const [enableEmpirical, setEnableEmpirical] = useState<boolean>(true);
  const [enableQuiver, setEnableQuiver] = useState<boolean>(true);
  const [frameStyle, setFrameStyle] = useState<'box' | 'range-frame'>('box');
  const [copiedTikz, setCopiedTikz] = useState<boolean>(false);

  // 1. Damped Oscillator Trajectory & Telemetry
  const oscData = useMemo(() => {
    const N = 160;
    const tMax = 6.0;
    const points: Array<{
      t: number;
      x: number;
      vNorm: number;
      envPos: number;
      envNeg: number;
      energy: number;
      ciUpper: number;
      ciLower: number;
    }> = [];

    for (let i = 0; i <= N; i++) {
      const t = (i / N) * tMax;
      const decay = Math.exp(-zeta * omega0 * t);
      let x = 0;
      let vNorm = 0;

      if (zeta < 0.999) {
        const omegaD = omega0 * Math.sqrt(1 - zeta * zeta);
        x =
          decay *
          (Math.cos(omegaD * t) +
            (zeta / Math.sqrt(1 - zeta * zeta)) * Math.sin(omegaD * t));
        vNorm = -(decay / Math.sqrt(1 - zeta * zeta)) * Math.sin(omegaD * t);
      } else if (zeta <= 1.001) {
        x = decay * (1 + omega0 * t);
        vNorm = -omega0 * t * decay;
      } else {
        const alpha = omega0 * Math.sqrt(zeta * zeta - 1);
        x =
          decay *
          (Math.cosh(alpha * t) +
            (zeta / Math.sqrt(zeta * zeta - 1)) * Math.sinh(alpha * t));
        vNorm = -(decay / Math.sqrt(zeta * zeta - 1)) * Math.sinh(alpha * t);
      }

      const energy = 0.5 * (x * x + vNorm * vNorm);
      const sigma = 0.11 * Math.exp(-0.35 * zeta * omega0 * t);

      points.push({
        t,
        x,
        vNorm,
        envPos: decay,
        envNeg: -decay,
        energy,
        ciUpper: x + sigma,
        ciLower: x - sigma,
      });
    }
    return points;
  }, [zeta, omega0]);

  // Simulated empirical sensor measurements with deterministic residual offset
  const empiricalSensorPoints = useMemo<PlotErrorPoint[]>(() => {
    if (!enableEmpirical || model !== 'damped-oscillator') return [];
    const sampleIndices = [10, 24, 38, 52, 68, 86, 108, 132];
    return sampleIndices.map((idx, k) => {
      const pt = oscData[idx] || oscData[0];
      const deterministicJitter = ((k % 3) - 1) * 0.035 * Math.exp(-0.25 * pt.t);
      const err = 0.065 * Math.exp(-0.22 * zeta * omega0 * pt.t) + 0.025;
      return {
        x: pt.t,
        y: pt.x + deterministicJitter,
        yErr: err,
      };
    });
  }, [enableEmpirical, model, oscData, zeta, omega0]);

  // Spectral Bode Magnitude |G(iω)| vs Normalized Frequency ω/ω₀ (Log10 scale)
  const bodeData = useMemo(() => {
    const pts: Array<{ x: number; y: number }> = [];
    const N = 120;
    for (let i = 0; i <= N; i++) {
      const logR = -1 + (i / N) * 2; // 0.1 to 10.0
      const r = Math.pow(10, logR);
      const mag = 1 / Math.sqrt(Math.pow(1 - r * r, 2) + Math.pow(2 * zeta * r, 2));
      const magDb = 20 * Math.log10(Math.max(1e-4, mag));
      pts.push({ x: r, y: Math.max(-38, Math.min(24, magDb)) });
    }
    return pts;
  }, [zeta]);

  // 2. Quantum Harmonic Eigenstates Data
  const quantumData = useMemo(() => {
    const hermite = (n: number, x: number): number => {
      if (n === 0) return 1;
      if (n === 1) return 2 * x;
      let h0 = 1;
      let h1 = 2 * x;
      for (let k = 2; k <= n; k++) {
        const hk = 2 * x * h1 - 2 * (k - 1) * h0;
        h0 = h1;
        h1 = hk;
      }
      return h1;
    };
    const factorial = (n: number): number => (n <= 1 ? 1 : n * factorial(n - 1));
    const norm = 1 / Math.sqrt(Math.pow(2, quantumN) * factorial(quantumN) * Math.sqrt(Math.PI));

    const pts: Array<{ x: number; psi: number; prob: number; pot: number }> = [];
    const phaseCircle: Array<{ x: number; y: number }> = [];
    const rTurn = Math.sqrt(2 * quantumN + 1);

    for (let i = 0; i <= 160; i++) {
      const x = -3.8 + (i / 160) * 7.6;
      const psi = norm * Math.exp(-0.5 * x * x) * hermite(quantumN, x);
      pts.push({
        x,
        psi,
        prob: psi * psi * 1.6,
        pot: Math.min(1.35, 0.14 * x * x - 0.8),
      });
      const theta = (i / 160) * 2 * Math.PI;
      phaseCircle.push({
        x: rTurn * Math.cos(theta),
        y: rTurn * Math.sin(theta),
      });
    }
    return { pts, phaseCircle, rTurn };
  }, [quantumN]);

  // 3. Lotka-Volterra Predator-Prey Data
  const lvData = useMemo(() => {
    const pts: Array<{ t: number; prey: number; pred: number }> = [];
    let u = 1.9;
    let v = 1.1;
    const dt = 0.04;
    const gamma = 0.9;
    const delta = 0.4;
    for (let i = 0; i <= 160; i++) {
      const t = i * dt;
      pts.push({ t, prey: u, pred: v });
      const du = lvAlpha * u - lvBeta * u * v;
      const dv = delta * u * v - gamma * v;
      u = Math.max(0.05, u + du * dt);
      v = Math.max(0.05, v + dv * dt);
    }
    return pts;
  }, [lvAlpha, lvBeta]);

  const scrubbedIdx = Math.min(
    oscData.length - 1,
    Math.max(0, Math.round((scrubTime / 6.0) * (oscData.length - 1)))
  );
  const activePt = oscData[scrubbedIdx];

  const isZetaActive = activeSymbolId === 'zeta';
  const isEnergyActive = activeSymbolId === 'energy';
  const isKernelActive = activeSymbolId === 'kernel';

  // Export handlers
  const handleDownloadSvg = () => {
    const svgEl = document.getElementById(`${id}-svg-panel-a`);
    if (!svgEl) return;
    const blob = new Blob([svgEl.outerHTML], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${model}-panel-a.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadCsv = () => {
    const header = 't_sec,x_displacement,v_normalized,envelope_pos,lyapunov_energy\n';
    const body = oscData
      .map(
        (p) =>
          `${p.t.toFixed(4)},${p.x.toFixed(5)},${p.vNorm.toFixed(5)},${p.envPos.toFixed(5)},${p.energy.toFixed(5)}`
      )
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `telemetry-zeta-${zeta.toFixed(2)}-omega-${omega0.toFixed(1)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyTikz = () => {
    const tikz = `\\begin{tikzpicture}
  \\begin{axis}[
    width=0.62\\textwidth, height=0.34\\textwidth,
    xlabel={$t$ (s)}, ylabel={$x(t)$},
    xmin=0, xmax=6, ymin=-1.2, ymax=1.2,
    grid=both, minor tick num=1,
    title={Impulse Response ($\\zeta=${zeta.toFixed(2)},\\, \\omega_0=${omega0.toFixed(2)}$ rad/s)}
  ]
    \\addplot[domain=0:6, samples=200, thick, blue!75!black]
      {exp(-${zeta.toFixed(2)}*${omega0.toFixed(2)}*x) * cos(deg(${(omega0 * Math.sqrt(Math.abs(1 - zeta * zeta))).toFixed(3)}*x))};
    \\addplot[domain=0:6, samples=100, dashed, red!75!black]
      {exp(-${zeta.toFixed(2)}*${omega0.toFixed(2)}*x)};
  \\end{axis}
\\end{tikzpicture}`;
    navigator.clipboard?.writeText(tikz);
    setCopiedTikz(true);
    setTimeout(() => setCopiedTikz(false), 1800);
  };

  return (
    <figure id={id} style={{ margin: 0 }}>
      {/* Top Instrument Control Bar: Legend + Layer Toggles + View Switcher + Export */}
      <div
        className="ads-ui"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          paddingBottom: '10px',
          marginBottom: '12px',
          borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
          fontSize: '11.5px',
          color: 'var(--ads-ink-graphite, #4E4D49)',
        }}
      >
        {/* Left: Symbol-Linked Series Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <button
            type="button"
            onMouseEnter={() => hoverSymbol('kernel')}
            onMouseLeave={() => hoverSymbol(null)}
            onClick={() => togglePinSymbol('kernel')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 6px',
              borderRadius: '3.5px',
              border: 'none',
              backgroundColor: isKernelActive ? SYMBOL_SLOT_COLORS[4].bg : 'transparent',
              cursor: 'pointer',
              fontSize: '11.5px',
              color: 'inherit',
            }}
          >
            <span
              style={{
                width: '12px',
                height: '2px',
                backgroundColor: 'oklch(0.42 0.16 255)',
                display: 'inline-block',
              }}
            />
            <span>
              {model === 'quantum-eigenstates' ? (
                <>
                  Wavefunction <InlineMath latex={`\\psi_${quantumN}(x)`} />
                </>
              ) : model === 'lotka-volterra' ? (
                <>
                  Prey <InlineMath latex="u(t)" />
                </>
              ) : (
                <>
                  Trajectory <InlineMath latex="x(t)" />
                </>
              )}
            </span>
          </button>

          <button
            type="button"
            onMouseEnter={() => hoverSymbol('zeta')}
            onMouseLeave={() => hoverSymbol(null)}
            onClick={() => togglePinSymbol('zeta')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '2px 6px',
              borderRadius: '3.5px',
              border: 'none',
              backgroundColor: isZetaActive ? SYMBOL_SLOT_COLORS[2].bg : 'transparent',
              cursor: 'pointer',
              fontSize: '11.5px',
              color: 'inherit',
            }}
          >
            <span
              style={{
                width: '12px',
                height: '0px',
                borderTop: '2px dashed oklch(0.55 0.19 32)',
                display: 'inline-block',
              }}
            />
            <span>
              {model === 'quantum-eigenstates' ? (
                <>
                  Density <InlineMath latex={`|\\psi_${quantumN}|^2`} />
                </>
              ) : model === 'lotka-volterra' ? (
                <>
                  Predator <InlineMath latex="v(t)" />
                </>
              ) : (
                <>
                  Envelope <InlineMath latex="\pm e^{-\zeta\omega_0 t}" />
                </>
              )}
            </span>
          </button>

          {model === 'damped-oscillator' && (
            <button
              type="button"
              onMouseEnter={() => hoverSymbol('energy')}
              onMouseLeave={() => hoverSymbol(null)}
              onClick={() => togglePinSymbol('energy')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '2px 6px',
                borderRadius: '3.5px',
                border: 'none',
                backgroundColor: isEnergyActive ? SYMBOL_SLOT_COLORS[3].bg : 'transparent',
                cursor: 'pointer',
                fontSize: '11.5px',
                color: 'inherit',
              }}
            >
              <span
                style={{
                  width: '12px',
                  height: '2px',
                  backgroundColor: 'oklch(0.48 0.14 160)',
                  display: 'inline-block',
                }}
              />
              <span>
                Energy <InlineMath latex="\mathcal{H}(t)" />
              </span>
            </button>
          )}
        </div>

        {/* Right: Layer Toggles + Plate Layout + Export Suite */}
        <div
          className="ads-no-print"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            flexWrap: 'wrap',
          }}
        >
          {/* Layer toggles */}
          {model === 'damped-oscillator' && (
            <div className="ads-pill-group">
              <button
                type="button"
                data-active={enableCI ? 'true' : 'false'}
                className="ads-pill-btn"
                onClick={() => setEnableCI((v) => !v)}
              >
                ±1σ Band
              </button>
              <button
                type="button"
                data-active={enableEmpirical ? 'true' : 'false'}
                className="ads-pill-btn"
                onClick={() => setEnableEmpirical((v) => !v)}
              >
                Error Bars
              </button>
              <button
                type="button"
                data-active={enableQuiver ? 'true' : 'false'}
                className="ads-pill-btn"
                onClick={() => setEnableQuiver((v) => !v)}
              >
                Quiver
              </button>
              <button
                type="button"
                data-active={frameStyle === 'range-frame' ? 'true' : 'false'}
                className="ads-pill-btn"
                onClick={() =>
                  setFrameStyle((f) => (f === 'box' ? 'range-frame' : 'box'))
                }
                title="Toggle between pgfplots Boxed Axes and Tufte Range-Frame"
              >
                Range-Frame
              </button>
            </div>
          )}

          {/* Panel Layout Selector */}
          {model === 'damped-oscillator' && (
            <div className="ads-pill-group">
              {(
                [
                  { id: '2-panel', label: '2-Panel' },
                  { id: '3-panel', label: '3-Panel Plate' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  data-active={viewMode === opt.id ? 'true' : 'false'}
                  className="ads-pill-btn"
                  onClick={() => setViewMode(opt.id)}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}

          {/* Export Suite: SVG, CSV, TikZ */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <button
              type="button"
              onClick={handleDownloadSvg}
              title="Export Vector SVG"
              className="ads-btn-instrument"
            >
              <Download size={10} />
              <span>SVG</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCsv}
              title="Download Numerical Telemetry CSV"
              className="ads-btn-instrument"
            >
              <Download size={10} />
              <span>CSV</span>
            </button>
            <button
              type="button"
              data-active={copiedTikz ? 'true' : 'false'}
              onClick={handleCopyTikz}
              title="Copy LaTeX PGFPlots / TikZ Source"
              className="ads-btn-instrument"
            >
              {copiedTikz ? <Check size={10} /> : <Copy size={10} />}
              <span>{copiedTikz ? 'Copied TikZ' : 'TikZ'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================================
          MODEL 1: DAMPED HARMONIC OSCILLATOR (2-PANEL OR 3-PANEL PLATE)
         ==================================================================== */}
      {model === 'damped-oscillator' && (
        <div
          className="ads-subfigure-grid"
          style={{
            display: 'grid',
            gridTemplateColumns:
              viewMode === '3-panel'
                ? 'minmax(0, 1.55fr) minmax(0, 1fr) minmax(0, 1fr)'
                : 'minmax(0, 1.75fr) minmax(0, 1fr)',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          {/* PANEL (a): Time-Domain Trajectory, Envelope, Confidence Band & Error Bars */}
          <div>
            <div
              className="ads-ui"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                color: 'var(--ads-ink-graphite, #4E4D49)',
                marginBottom: '6px',
              }}
            >
              <span>
                <strong style={{ color: 'var(--ads-ink-carbon, #141413)' }}>(a)</strong>{' '}
                Impulse Response <InlineMath latex="x(t)" /> &amp; Envelope
              </span>
              <span
                style={{
                  fontFamily: 'var(--ads-font-chrome)',
                  fontSize: '10.5px',
                  color: 'var(--ads-ink-pencil)',
                }}
              >
                t={activePt.t.toFixed(2)}s · x={activePt.x.toFixed(2).replace('-', '−')}
              </span>
            </div>

            <CartesianCanvas
              id={`${id}-svg-panel-a`}
              width={420}
              height={235}
              xDomain={[0, 6]}
              yDomain={[-1.2, 1.2]}
              xTicks={[0, 1, 2, 3, 4, 5, 6]}
              yTicks={[-1.0, -0.5, 0.0, 0.5, 1.0]}
              xTickFormat={(v) => `${v}s`}
              xAxisLabel="Time t [s]"
              yAxisLabel="Displacement x(t)"
              frameStyle={frameStyle}
              bands={
                enableCI
                  ? [
                      {
                        id: 'ci-band',
                        color: 'oklch(0.72 0.11 250)',
                        opacity: 0.18,
                        points: oscData.map((p) => ({
                          x: p.t,
                          upper: p.ciUpper,
                          lower: p.ciLower,
                        })),
                      },
                    ]
                  : []
              }
              series={[
                {
                  id: 'env-pos',
                  symbolId: 'zeta',
                  color: 'oklch(0.55 0.19 32)',
                  strokeWidth: 1.25,
                  dashArray: '4 3',
                  points: oscData.map((p) => ({ x: p.t, y: p.envPos })),
                },
                {
                  id: 'env-neg',
                  symbolId: 'zeta',
                  color: 'oklch(0.55 0.19 32)',
                  strokeWidth: 1.25,
                  dashArray: '4 3',
                  points: oscData.map((p) => ({ x: p.t, y: p.envNeg })),
                },
                {
                  id: 'energy',
                  symbolId: 'energy',
                  color: 'oklch(0.48 0.14 160)',
                  strokeWidth: 1.5,
                  points: oscData.map((p) => ({ x: p.t, y: p.energy })),
                },
                {
                  id: 'trajectory',
                  symbolId: 'kernel',
                  color: 'oklch(0.42 0.16 255)',
                  strokeWidth: 1.9,
                  points: oscData.map((p) => ({ x: p.t, y: p.x })),
                },
              ]}
              errorPoints={empiricalSensorPoints}
              scrubX={activePt.t}
              onScrubX={setScrubTime}
              activeReadout={{
                x: activePt.t,
                y: activePt.x,
                secondaryY: activePt.energy,
              }}
            />
          </div>

          {/* PANEL (b): Symplectic Phase Portrait with Quiver Vector Field */}
          <div>
            <div
              className="ads-ui"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '11.5px',
                color: 'var(--ads-ink-graphite, #4E4D49)',
                marginBottom: '6px',
              }}
            >
              <span>
                <strong style={{ color: 'var(--ads-ink-carbon, #141413)' }}>(b)</strong>{' '}
                Phase Portrait <InlineMath latex="(x, \dot{x}/\omega_0)" />
              </span>
              <span
                style={{
                  fontFamily: 'var(--ads-font-chrome)',
                  fontSize: '10.5px',
                  color: 'var(--ads-ink-pencil)',
                }}
              >
                ℋ={activePt.energy.toFixed(2)}
              </span>
            </div>

            <PhaseSpaceCanvas
              width={250}
              height={235}
              xDomain={[-1.2, 1.2]}
              yDomain={[-1.2, 1.2]}
              xAxisLabel="Position x"
              yAxisLabel="Velocity v / ω₀"
              trajectory={oscData.map((p) => ({ x: p.x, y: p.vNorm }))}
              activePoint={{
                x: activePt.x,
                y: activePt.vNorm,
                vx: activePt.vNorm,
                vy: -2 * zeta * activePt.vNorm - activePt.x,
              }}
              energyRadius={Math.sqrt(2 * activePt.energy)}
              showQuiver={enableQuiver}
              vectorField={(x, y) => [y, -2 * zeta * y - x]}
            />
          </div>

          {/* PANEL (c): Complex s-Plane Root Locus OR Log-Frequency Bode Response */}
          {viewMode === '3-panel' && (
            <div>
              <div
                className="ads-ui"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  fontSize: '11.5px',
                  color: 'var(--ads-ink-graphite, #4E4D49)',
                  marginBottom: '6px',
                }}
              >
                <span>
                  <strong style={{ color: 'var(--ads-ink-carbon, #141413)' }}>(c)</strong>{' '}
                  {rightPanelMode === 's-plane' ? (
                    <>
                      <InlineMath latex="s" />
                      -Plane Poles <InlineMath latex="\lambda_{1,2}" />
                    </>
                  ) : (
                    <>
                      Bode <InlineMath latex="|\hat{G}(i\omega)|" />
                    </>
                  )}
                </span>
                <button
                  type="button"
                  onClick={() =>
                    setRightPanelMode((m) => (m === 's-plane' ? 'bode' : 's-plane'))
                  }
                  style={{
                    height: '18px',
                    padding: '0 5px',
                    borderRadius: '3px',
                    border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'var(--ads-font-chrome)',
                    fontSize: '9.5px',
                    color: 'var(--ads-ink-graphite)',
                    cursor: 'pointer',
                  }}
                >
                  {rightPanelMode === 's-plane' ? 'Show Bode' : 'Show Poles'}
                </button>
              </div>

              {rightPanelMode === 's-plane' ? (
                <ComplexPlaneCanvas
                  width={250}
                  height={235}
                  zeta={zeta}
                  omega0={omega0}
                />
              ) : (
                <CartesianCanvas
                  width={250}
                  height={235}
                  xDomain={[0.1, 10]}
                  yDomain={[-35, 22]}
                  xScale="log"
                  xTicks={[0.1, 1, 10]}
                  yTicks={[-30, -15, 0, 15]}
                  xTickFormat={(v) => (v === 0.1 ? '10⁻¹' : v === 1 ? '10⁰' : '10¹')}
                  yTickFormat={(v) => `${v}dB`}
                  xAxisLabel="Freq. Ratio ω / ω₀ (log)"
                  yAxisLabel="Gain |G(iω)| [dB]"
                  frameStyle={frameStyle}
                  thresholds={[
                    {
                      axis: 'x',
                      value: 1.0,
                      label: 'ω=ω₀',
                      color: 'oklch(0.55 0.19 32 / 0.6)',
                    },
                  ]}
                  series={[
                    {
                      id: 'bode-mag',
                      symbolId: 'omega0',
                      color: 'oklch(0.42 0.16 255)',
                      strokeWidth: 1.85,
                      points: bodeData,
                    },
                  ]}
                />
              )}
            </div>
          )}
        </div>
      )}

      {/* ====================================================================
          MODEL 2: QUANTUM HARMONIC EIGENSTATES (2-PANEL MULTI-CHART)
         ==================================================================== */}
      {model === 'quantum-eigenstates' && (
        <div
          className="ads-subfigure-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.75fr) minmax(0, 1fr)',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          <div>
            <div
              className="ads-ui"
              style={{
                fontSize: '11.5px',
                color: 'var(--ads-ink-graphite, #4E4D49)',
                marginBottom: '6px',
              }}
            >
              <strong style={{ color: 'var(--ads-ink-carbon, #141413)' }}>(a)</strong>{' '}
              Hermite Eigenstate <InlineMath latex={`\\psi_${quantumN}(x)`} /> &amp; Born Probability Density <InlineMath latex={`|\\psi_${quantumN}(x)|^2`} />
            </div>
            <CartesianCanvas
              id={`${id}-svg-panel-a`}
              width={450}
              height={235}
              xDomain={[-3.8, 3.8]}
              yDomain={[-1.0, 1.4]}
              xTicks={[-3, -2, -1, 0, 1, 2, 3]}
              yTicks={[-0.8, 0.0, 0.8]}
              xTickFormat={(v) => `${v}x₀`}
              xAxisLabel="Position x / √(ℏ/mω₀)"
              yAxisLabel="Amplitude ψₙ(x)"
              thresholds={[
                {
                  axis: 'x',
                  value: quantumData.rTurn,
                  label: '+x_cl',
                  color: 'oklch(0.55 0.19 32 / 0.55)',
                },
                {
                  axis: 'x',
                  value: -quantumData.rTurn,
                  label: '−x_cl',
                  color: 'oklch(0.55 0.19 32 / 0.55)',
                },
              ]}
              series={[
                {
                  id: 'potential',
                  color: 'oklch(0.72 0.01 80)',
                  strokeWidth: 1.2,
                  dashArray: '4 3',
                  points: quantumData.pts.map((p) => ({ x: p.x, y: p.pot })),
                },
                {
                  id: 'prob-density',
                  color: 'oklch(0.55 0.19 32)',
                  strokeWidth: 1.35,
                  dashArray: '3 2',
                  fillToZero: true,
                  fillOpacity: 0.18,
                  points: quantumData.pts.map((p) => ({ x: p.x, y: p.prob })),
                },
                {
                  id: 'psi-wave',
                  color: 'oklch(0.42 0.16 255)',
                  strokeWidth: 2.0,
                  points: quantumData.pts.map((p) => ({ x: p.x, y: p.psi })),
                },
              ]}
            />
          </div>

          <div>
            <div
              className="ads-ui"
              style={{
                fontSize: '11.5px',
                color: 'var(--ads-ink-graphite, #4E4D49)',
                marginBottom: '6px',
              }}
            >
              <strong style={{ color: 'var(--ads-ink-carbon, #141413)' }}>(b)</strong>{' '}
              Quantized Action Shell <InlineMath latex={`E_${quantumN} = ${(quantumN + 0.5).toFixed(1)}\\,\\hbar\\omega_0`} />
            </div>
            <PhaseSpaceCanvas
              width={250}
              height={235}
              xDomain={[-3.6, 3.6]}
              yDomain={[-3.6, 3.6]}
              xAxisLabel="Position x / x₀"
              yAxisLabel="Momentum p / p₀"
              trajectory={quantumData.phaseCircle}
              energyRadius={quantumData.rTurn}
              contourRadii={[1.0, Math.sqrt(3), Math.sqrt(5), Math.sqrt(7), Math.sqrt(9)]}
              showQuiver={true}
              vectorField={(x, y) => [y, -x]}
            />
          </div>
        </div>
      )}

      {/* ====================================================================
          MODEL 3: LOTKA-VOLTERRA SYMPLECTIC KINETICS (2-PANEL MULTI-CHART)
         ==================================================================== */}
      {model === 'lotka-volterra' && (
        <div
          className="ads-subfigure-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1.75fr) minmax(0, 1fr)',
            gap: '16px',
            alignItems: 'start',
          }}
        >
          <div>
            <div
              className="ads-ui"
              style={{
                fontSize: '11.5px',
                color: 'var(--ads-ink-graphite, #4E4D49)',
                marginBottom: '6px',
              }}
            >
              <strong style={{ color: 'var(--ads-ink-carbon, #141413)' }}>(a)</strong>{' '}
              Coupled Population Oscillations <InlineMath latex="u(t)" /> &amp; <InlineMath latex="v(t)" />
            </div>
            <CartesianCanvas
              id={`${id}-svg-panel-a`}
              width={450}
              height={235}
              xDomain={[0, 6.4]}
              yDomain={[0, 5.2]}
              xTicks={[0, 1, 2, 3, 4, 5, 6]}
              yTicks={[0, 1, 2, 3, 4, 5]}
              xTickFormat={(v) => `${v}t₀`}
              xAxisLabel="Time t"
              yAxisLabel="Population Density u, v"
              series={[
                {
                  id: 'lv-prey',
                  color: 'oklch(0.42 0.16 255)',
                  strokeWidth: 1.9,
                  points: lvData.map((p) => ({ x: p.t, y: p.prey })),
                },
                {
                  id: 'lv-pred',
                  color: 'oklch(0.55 0.19 32)',
                  strokeWidth: 1.75,
                  dashArray: '4 2',
                  points: lvData.map((p) => ({ x: p.t, y: p.pred })),
                },
              ]}
            />
          </div>

          <div>
            <div
              className="ads-ui"
              style={{
                fontSize: '11.5px',
                color: 'var(--ads-ink-graphite, #4E4D49)',
                marginBottom: '6px',
              }}
            >
              <strong style={{ color: 'var(--ads-ink-carbon, #141413)' }}>(b)</strong>{' '}
              Symplectic Phase Orbit <InlineMath latex="(u, v)" />
            </div>
            <PhaseSpaceCanvas
              width={250}
              height={235}
              xDomain={[0, 5.2]}
              yDomain={[0, 5.2]}
              xAxisLabel="Prey Density u"
              yAxisLabel="Predator Density v"
              equilibrium={{ x: 0.9 / 0.4, y: lvAlpha / lvBeta }}
              trajectory={lvData.map((p) => ({ x: p.prey, y: p.pred }))}
              activePoint={{
                x: lvData[lvData.length - 1].prey,
                y: lvData[lvData.length - 1].pred,
              }}
              contourRadii={[]}
              showQuiver={true}
              vectorField={(u, v) => [
                lvAlpha * u - lvBeta * u * v,
                0.4 * u * v - 0.9 * v,
              ]}
            />
          </div>
        </div>
      )}

      {/* Publication Caption */}
      <figcaption
        style={{
          marginTop: '12px',
          paddingTop: '10px',
          borderTop: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
          fontFamily: 'var(--ads-font-prose, serif)',
          fontSize: 'var(--ads-secondary-prose-size, 14px)',
          lineHeight: 1.52,
          color: 'var(--ads-ink-graphite, #4E4D49)',
        }}
      >
        <strong style={{ color: 'var(--ads-ink-carbon, #141413)' }}>
          {figureNumber}.
        </strong>{' '}
        {model === 'damped-oscillator' && (
          <>
            <strong>(a)</strong> Impulse response <InlineMath latex="x(t)" /> bounded by{' '}
            <InlineMath latex="\pm e^{-\zeta\omega_0 t}" />, Lyapunov energy{' '}
            <InlineMath latex="\mathcal{H}(t)" />, and empirical telemetry (<InlineMath latex="\pm 1\sigma" /> error bars).{' '}
            <strong>(b)</strong> Symplectic phase-space spiral with normalized direction quiver field{' '}
            <InlineMath latex="\mathbf{F}(x, v)" />.{' '}
            {viewMode === '3-panel' && (
              <>
                <strong>(c)</strong>{' '}
                {rightPanelMode === 's-plane' ? (
                  <>
                    Complex <InlineMath latex="s" />-plane root-locus showing conjugate poles{' '}
                    <InlineMath latex="\lambda_{1,2} = -\zeta\omega_0 \pm i\omega_0\sqrt{1-\zeta^2}" />
                  </>
                ) : (
                  <>
                    Log-frequency Bode magnitude <InlineMath latex="|\hat{G}(i\omega)|" /> in dB
                  </>
                )}{' '}
                at{' '}
              </>
            )}
            <UnitValue symbolId="zeta" value={zeta.toFixed(2)} unit="(ζ)" /> and{' '}
            <UnitValue
              symbolId="omega0"
              value={omega0.toFixed(2)}
              uncertainty="0.02"
              unit="rad·s⁻¹"
              conversions={[
                { system: 'SI', formattedValue: omega0.toFixed(2), unitLatex: 'rad·s⁻¹' },
                {
                  system: 'CGS',
                  formattedValue: (omega0 / (2 * Math.PI)).toFixed(2),
                  unitLatex: 'Hz',
                },
                {
                  system: 'Natural',
                  formattedValue: (omega0 * 6.582e-16).toExponential(2),
                  unitLatex: 'eV',
                },
              ]}
            />
            .
          </>
        )}
        {model === 'quantum-eigenstates' && (
          <>
            <strong>(a)</strong> Normalized Hermite-Gauss eigenfunction <InlineMath latex={`\\psi_${quantumN}(x)`} /> and Born probability density <InlineMath latex={`|\\psi_${quantumN}(x)|^2`} /> bounded by classical turning points <InlineMath latex={`\\pm x_{\\text{cl}} = \\pm\\sqrt{2n+1}`} />.{' '}
            <strong>(b)</strong> Wigner phase-space quantization orbit at energy <InlineMath latex={`E_${quantumN} = ${((quantumN + 0.5) * omega0).toFixed(2)}\\,\\hbar`} />.
          </>
        )}
        {model === 'lotka-volterra' && (
          <>
            <strong>(a)</strong> Coupled nonlinear population oscillations for prey <InlineMath latex="u(t)" /> and predator <InlineMath latex="v(t)" />.{' '}
            <strong>(b)</strong> Closed symplectic orbit around interior fixed point <InlineMath latex={`(u^*, v^*) = (2.25, ${(lvAlpha / lvBeta).toFixed(2)})`} />.
          </>
        )}
      </figcaption>
    </figure>
  );
};

/**
 * ============================================================================
 * 6. BOOKTABS + SIUNITX + THREEPARTTABLE PUBLICATION & TELEMETRY TABLE
 * ============================================================================
 */
export interface BooktabsTableProps {
  id?: string;
  tableNumber?: string;
  caption: React.ReactNode;
  activeZeta?: number;
  omega0?: number;
  onSelectZeta?: (nextZeta: number) => void;
  showLiveRow?: boolean;
}

type SortKey = 'default' | 'zeta' | 'qFactor' | 'tau';

export const BooktabsTable: React.FC<BooktabsTableProps> = ({
  id = 'tab:regimes',
  tableNumber = 'Table 1.1',
  caption,
  activeZeta = 0.25,
  omega0 = 4.0,
  onSelectZeta,
  showLiveRow = true,
}) => {
  const { activeSymbolId, hoverSymbol, togglePinSymbol } = useAcademicSystem();
  const [sortKey, setSortKey] = useState<SortKey>('default');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showUncertainty, setShowUncertainty] = useState<boolean>(true);
  const [showDataBars, setShowDataBars] = useState<boolean>(true);
  const [copiedTex, setCopiedTex] = useState<boolean>(false);

  const handleSortClick = (key: SortKey) => {
    if (sortKey === key) {
      if (sortDir === 'asc') {
        setSortDir('desc');
      } else {
        setSortKey('default');
        setSortDir('asc');
      }
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  // Compute mini waveform samples for each regime's inline Sparkline
  const makeSparkData = (zVal: number) => {
    const samples: number[] = [];
    for (let i = 0; i <= 32; i++) {
      const t = (i / 32) * 4.5;
      const dec = Math.exp(-zVal * omega0 * t);
      if (zVal < 0.999) {
        const wd = omega0 * Math.sqrt(1 - zVal * zVal);
        samples.push(
          dec * (Math.cos(wd * t) + (zVal / Math.sqrt(1 - zVal * zVal)) * Math.sin(wd * t))
        );
      } else if (zVal <= 1.001) {
        samples.push(dec * (1 + omega0 * t));
      } else {
        const a = omega0 * Math.sqrt(zVal * zVal - 1);
        samples.push(
          dec * (Math.cosh(a * t) + (zVal / Math.sqrt(zVal * zVal - 1)) * Math.sinh(a * t))
        );
      }
    }
    return samples;
  };

  // Helper to compute exact spectral properties for any damping ratio z
  const computeRowMetrics = (
    key: string,
    regime: string,
    conditionLatex: string,
    z: number,
    isCurrent: boolean,
    isLiveState?: boolean,
    tnote?: string
  ) => {
    const disc = 1 - z * z;
    const wd = disc > 0 ? omega0 * Math.sqrt(disc) : 0;
    const eigenpoles =
      disc > 0.0005
        ? `−${(z * omega0).toFixed(2)} ± ${wd.toFixed(2)}i`
        : Math.abs(disc) <= 0.0005
        ? `−${(z * omega0).toFixed(2)} (double)`
        : `−${(omega0 * (z - Math.sqrt(-disc))).toFixed(2)}, −${(omega0 * (z + Math.sqrt(-disc))).toFixed(2)}`;
    const qNum = 1 / (2 * z);
    const tauNum =
      disc >= 0
        ? 1 / (2 * z * omega0)
        : 1 / (2 * omega0 * (z - Math.sqrt(-disc)));

    return {
      key,
      regime,
      conditionLatex,
      zetaNum: z,
      zetaVal: z.toFixed(2),
      zetaErr: '0.01',
      eigenpoles,
      wdNum: wd,
      wdStr: disc > 0.0005 ? wd.toFixed(2) : '0.00',
      qNum,
      qFactor: qNum.toFixed(2),
      qErr: (qNum * 0.015).toFixed(2),
      tauNum,
      relaxationTau: tauNum.toFixed(3),
      tauErr: (tauNum * 0.02).toFixed(3),
      isCurrent,
      isLiveState: Boolean(isLiveState),
      tnote,
    };
  };

  const baseRows = useMemo(() => {
    const canonical = [
      computeRowMetrics(
        'under-weak',
        'Sub-critical (High-Q)',
        '0 < \\zeta < 1/\\sqrt{2}',
        0.15,
        activeZeta < 0.5,
        false,
        'a'
      ),
      computeRowMetrics(
        'under-mod',
        'Butterworth (Max-Flat)',
        '\\zeta = 1/\\sqrt{2}',
        0.71,
        activeZeta >= 0.5 && activeZeta < 0.96,
        false
      ),
      computeRowMetrics(
        'critical',
        'Critically Damped',
        '\\zeta = 1',
        1.0,
        activeZeta >= 0.96 && activeZeta <= 1.04,
        false,
        'b'
      ),
      computeRowMetrics(
        'overdamped',
        'Overdamped (Creeping)',
        '\\zeta > 1',
        1.45,
        activeZeta > 1.04,
        false
      ),
    ];

    if (showLiveRow) {
      const liveLabel =
        activeZeta < 0.99
          ? 'Active State (Underdamped)'
          : activeZeta <= 1.01
          ? 'Active State (Critical)'
          : 'Active State (Overdamped)';
      const liveRow = computeRowMetrics(
        'live-state',
        liveLabel,
        `\\zeta = ${activeZeta.toFixed(2)}`,
        activeZeta,
        true,
        true,
        'c'
      );
      return [
        liveRow,
        ...canonical.map((r) => ({ ...r, isCurrent: false })),
      ];
    }

    return canonical;
  }, [activeZeta, omega0, showLiveRow]);

  const sortedRows = useMemo(() => {
    if (sortKey === 'default') return baseRows;
    const copy = [...baseRows];
    copy.sort((a, b) => {
      const valA =
        sortKey === 'zeta' ? a.zetaNum : sortKey === 'qFactor' ? a.qNum : a.tauNum;
      const valB =
        sortKey === 'zeta' ? b.zetaNum : sortKey === 'qFactor' ? b.qNum : b.tauNum;
      return sortDir === 'asc' ? valA - valB : valB - valA;
    });
    return copy;
  }, [baseRows, sortKey, sortDir]);

  const maxQ = Math.max(...sortedRows.map((r) => r.qNum), 3.5);
  const maxTau = Math.max(...sortedRows.map((r) => r.tauNum), 1.0);

  const handleCopyLatex = () => {
    const texLines = sortedRows
      .map(
        (r) =>
          `    ${r.regime} & $${r.conditionLatex}$ & ${r.zetaVal} & $${r.eigenpoles.replace(
            '−',
            '-'
          )}$ & ${r.wdStr} & ${r.qFactor} & ${r.relaxationTau} \\\\`
      )
      .join('\n');

    const latex = `\\begin{threeparttable}[htbp]
  \\centering
  \\caption{Spectral classification of characteristic eigenvalues $\\lambda_{1,2}$, quality factor $Q$, and energy relaxation time $\\tau_E$ at $\\omega_0 = ${omega0.toFixed(
    2
  )}\\text{ rad/s}$.}
  \\label{${id}}
  \\begin{tabular}{ll S[table-format=1.2] c S[table-format=1.2] S[table-format=1.2] S[table-format=1.3]}
    \\toprule
    \\multicolumn{3}{l}{\\textsc{Dynamical Regime \\& Bifurcation}} & \\multicolumn{4}{r}{\\textsc{Spectral \\& Asymptotic Invariants}} \\\\
    \\cmidrule(r){1-3} \\cmidrule(l){4-7}
    {Regime} & {Condition} & {$\\zeta$} & {Eigenpoles $\\lambda_{1,2}$ [s$^{-1}$]} & {$\\omega_d$ [rad/s]} & {$Q(\\zeta)$} & {$\\tau_E$ [s]} \\\\
    \\midrule
${texLines}
    \\midrule
    \\multicolumn{3}{l}{Liouville Invariants ($\\omega_0 = ${omega0.toFixed(
      2
    )}$ rad/s)} & {$\\operatorname{Tr}(\\mathbf{A}) = -${(
      2 *
      activeZeta *
      omega0
    ).toFixed(2)}$ s$^{-1}$} & {$\\det(\\mathbf{A}) = ${(omega0 * omega0).toFixed(
      2
    )}$ s$^{-2}$} & \\multicolumn{2}{r}{$W(t) = W_0 e^{-${(
      2 *
      activeZeta *
      omega0
    ).toFixed(2)}t}$} \\\\
    \\bottomrule
  \\end{tabular}
  \\begin{tablenotes}[para,flushleft]
    \\footnotesize
    \\item[a] Sub-critical oscillatory regime with complex-conjugate poles in $\\mathbb{C}^-$.
    \\item[b] Degenerate Jordan block ($\\omega_d = 0$) yielding fastest non-oscillatory decay.
    \\item[c] Live parameter state coupled to interactive workbench scrubbers.
  \\end{tablenotes}
\\end{threeparttable}`;
    navigator.clipboard?.writeText(latex);
    setCopiedTex(true);
    window.setTimeout(() => setCopiedTex(false), 1600);
  };

  const handleDownloadTableCsv = () => {
    const header =
      'regime,condition,zeta,eigenpoles_s_inv,omega_d_rad_s,quality_factor_Q,relaxation_tau_E_s\n';
    const body = sortedRows
      .map(
        (r) =>
          `"${r.regime}","${r.conditionLatex}",${r.zetaVal},"${r.eigenpoles}",${r.wdStr},${r.qFactor},${r.relaxationTau}`
      )
      .join('\n');
    const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `booktabs-regimes-omega-${omega0.toFixed(1)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const isZetaSymActive = activeSymbolId === 'zeta';
  const isOmegaSymActive = activeSymbolId === 'omega0';
  const isEnergySymActive = activeSymbolId === 'energy';

  return (
    <div id={id} style={{ margin: 0 }}>
      {/* ====================================================================
          TOP PUBLICATION CAPTION & INSTRUMENT TOOLBAR (Above \toprule)
          ==================================================================== */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '8px',
          marginBottom: '8px',
        }}
      >
        <div
          className="ads-prose"
          style={{
            fontSize: 'var(--ads-secondary-prose-size, 13.5px)',
            lineHeight: 1.45,
            color: 'var(--ads-ink-carbon, #141413)',
            flex: '1 1 320px',
          }}
        >
          <strong
            className="ads-smallcaps"
            style={{ fontWeight: 700, letterSpacing: '0.03em', marginRight: '6px' }}
          >
            {tableNumber}.
          </strong>
          <span style={{ color: 'var(--ads-ink-graphite, #4E4D49)' }}>{caption}</span>
        </div>

        {/* Table Instrument Controls: Uncertainty, Data Bars, LaTeX & CSV Export */}
        <div
          className="ads-ui ads-no-print"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            flexWrap: 'wrap',
          }}
        >
          <div className="ads-pill-group">
            <button
              type="button"
              data-active={showUncertainty ? 'true' : 'false'}
              className="ads-pill-btn"
              onClick={() => setShowUncertainty((u) => !u)}
              title="Toggle siunitx ±1σ uncertainty columns"
            >
              ±1σ
            </button>
            <button
              type="button"
              data-active={showDataBars ? 'true' : 'false'}
              className="ads-pill-btn"
              onClick={() => setShowDataBars((b) => !b)}
              title="Toggle inline proportional magnitude bars"
            >
              Bars
            </button>
          </div>

          <button
            type="button"
            data-active={copiedTex ? 'true' : 'false'}
            onClick={handleCopyLatex}
            className="ads-btn-instrument"
            title="Copy booktabs.sty + siunitx LaTeX table source"
          >
            {copiedTex ? <Check size={10} /> : <Copy size={10} />}
            <span>{copiedTex ? 'Copied TeX' : 'TeX'}</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadTableCsv}
            className="ads-btn-instrument"
            title="Download CSV table"
          >
            <Download size={10} />
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* ====================================================================
          BOOKTABS + SIUNITX TABLE (\toprule, \cmidrule, \midrule, \bottomrule)
          ==================================================================== */}
      <div className="ads-booktabs-scroll">
        <table className="ads-booktabs-table">
          <thead>
            {/* Row 1: \cmidrule(lr) Multi-Column Group Spanner Headers */}
            <tr>
              <th colSpan={3} style={{ textAlign: 'left', padding: '6px 10px 2px 10px' }}>
                <span className="ads-cmidrule" style={{ marginRight: '8px' }}>
                  Dynamical Regime &amp; Bifurcation Domain
                </span>
              </th>
              <th colSpan={4} style={{ textAlign: 'right', padding: '6px 10px 2px 10px' }}>
                <span className="ads-cmidrule" style={{ marginLeft: '4px', marginRight: '4px' }}>
                  Spectral &amp; Asymptotic Invariants (ω₀ = {omega0.toFixed(1)} rad/s)
                </span>
              </th>
              <th style={{ textAlign: 'center', padding: '6px 10px 2px 10px' }}>
                <span className="ads-cmidrule" style={{ marginLeft: '6px' }}>
                  Response
                </span>
              </th>
            </tr>

            {/* Row 2: Column Headers with Unit Sub-Labels & Sort Controls */}
            <tr>
              <th style={{ textAlign: 'left', padding: '5px 10px 7px 10px' }}>
                Regime Classification
              </th>
              <th
                style={{
                  textAlign: 'left',
                  padding: '5px 10px 7px 10px',
                  cursor: 'pointer',
                  backgroundColor: isZetaSymActive ? SYMBOL_SLOT_COLORS[2].bg : undefined,
                }}
                onMouseEnter={() => hoverSymbol('zeta')}
                onMouseLeave={() => hoverSymbol(null)}
                onClick={() => togglePinSymbol('zeta')}
                title="Click to pin symbol ζ across document"
              >
                Bifurcation Condition
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '5px 10px 7px 10px',
                  cursor: 'pointer',
                  backgroundColor: isZetaSymActive ? SYMBOL_SLOT_COLORS[2].bg : undefined,
                }}
                onMouseEnter={() => hoverSymbol('zeta')}
                onMouseLeave={() => hoverSymbol(null)}
                onClick={() => handleSortClick('zeta')}
                title="Click to sort by damping ratio ζ"
              >
                <span>
                  Damping <InlineMath latex="\zeta" />
                </span>
                <span style={{ marginLeft: '3px', fontSize: '9.5px', color: 'var(--ads-ink-pencil)' }}>
                  {sortKey === 'zeta' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th style={{ textAlign: 'right', padding: '5px 10px 7px 10px' }}>
                <span>
                  Eigenpoles <InlineMath latex="\lambda_{1,2}" />
                </span>{' '}
                <span style={{ fontWeight: 400, color: 'var(--ads-ink-pencil)', fontSize: '10px' }}>
                  [s⁻¹]
                </span>
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '5px 10px 7px 10px',
                  cursor: 'pointer',
                  backgroundColor: isOmegaSymActive ? SYMBOL_SLOT_COLORS[1].bg : undefined,
                }}
                onMouseEnter={() => hoverSymbol('omega0')}
                onMouseLeave={() => hoverSymbol(null)}
                onClick={() => togglePinSymbol('omega0')}
              >
                <span>
                  <InlineMath latex="\omega_d" />
                </span>{' '}
                <span style={{ fontWeight: 400, color: 'var(--ads-ink-pencil)', fontSize: '10px' }}>
                  [rad/s]
                </span>
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '5px 10px 7px 10px',
                  cursor: 'pointer',
                }}
                onClick={() => handleSortClick('qFactor')}
                title="Click to sort by Quality Factor Q"
              >
                <span>
                  Quality <InlineMath latex="Q" />
                </span>
                <span style={{ marginLeft: '3px', fontSize: '9.5px', color: 'var(--ads-ink-pencil)' }}>
                  {sortKey === 'qFactor' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th
                style={{
                  textAlign: 'right',
                  padding: '5px 10px 7px 10px',
                  cursor: 'pointer',
                  backgroundColor: isEnergySymActive ? SYMBOL_SLOT_COLORS[3].bg : undefined,
                }}
                onMouseEnter={() => hoverSymbol('energy')}
                onMouseLeave={() => hoverSymbol(null)}
                onClick={() => handleSortClick('tau')}
                title="Click to sort by Energy Relaxation Time τ_E"
              >
                <span>
                  Relaxation <InlineMath latex="\tau_E" />
                </span>{' '}
                <span style={{ fontWeight: 400, color: 'var(--ads-ink-pencil)', fontSize: '10px' }}>
                  [s]
                </span>
                <span style={{ marginLeft: '3px', fontSize: '9.5px', color: 'var(--ads-ink-pencil)' }}>
                  {sortKey === 'tau' ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                </span>
              </th>
              <th style={{ textAlign: 'center', padding: '5px 10px 7px 10px' }}>
                <InlineMath latex="x(t)" />
              </th>
            </tr>
          </thead>

          <tbody>
            {sortedRows.map((row) => {
              const qPct = Math.min(100, Math.round((row.qNum / maxQ) * 100));
              const tauPct = Math.min(100, Math.round((row.tauNum / maxTau) * 100));

              return (
                <tr
                  key={row.key}
                  data-active-row={row.isCurrent ? 'true' : 'false'}
                  onClick={() => onSelectZeta?.(Number(row.zetaNum.toFixed(2)))}
                  style={{
                    cursor: onSelectZeta ? 'pointer' : 'default',
                  }}
                  title={
                    onSelectZeta
                      ? `Click to set workbench damping ζ = ${row.zetaVal}`
                      : undefined
                  }
                >
                  {/* Col 1: Regime Name + Footnote Marker */}
                  <td
                    className="ads-cell-text"
                    style={{
                      padding: '6.5px 10px',
                      fontWeight: row.isCurrent ? 600 : 400,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: row.isCurrent
                            ? 'var(--ads-accent-compute, #D63E18)'
                            : 'oklch(0.84 0.008 82)',
                          flexShrink: 0,
                        }}
                      />
                      <span>
                        {row.regime}
                        {row.tnote && <sup className="ads-tnote">{row.tnote}</sup>}
                      </span>
                    </span>
                  </td>

                  {/* Col 2: Mathematical Condition */}
                  <td
                    style={{
                      padding: '6.5px 10px',
                      fontSize: '12.5px',
                      color: 'var(--ads-ink-graphite, #4E4D49)',
                      whiteSpace: 'nowrap',
                      backgroundColor: isZetaSymActive
                        ? 'oklch(0.95 0.03 30 / 0.45)'
                        : undefined,
                    }}
                  >
                    <InlineMath latex={row.conditionLatex} />
                  </td>

                  {/* Col 3: Damping Ratio ζ (siunitx tabular-nums) */}
                  <td
                    className="ads-cell-num"
                    style={{
                      padding: '6.5px 10px',
                      fontWeight: row.isCurrent ? 600 : 400,
                      backgroundColor: isZetaSymActive
                        ? 'oklch(0.95 0.03 30 / 0.45)'
                        : undefined,
                    }}
                  >
                    <span>{row.zetaVal}</span>
                    {showUncertainty && (
                      <span className="ads-cell-uncertainty">±{row.zetaErr}</span>
                    )}
                  </td>

                  {/* Col 4: Spectral Eigenpoles λ₁,₂ */}
                  <td className="ads-cell-num" style={{ padding: '6.5px 10px' }}>
                    {row.eigenpoles}
                  </td>

                  {/* Col 5: Damped Frequency ω_d */}
                  <td
                    className="ads-cell-num"
                    style={{
                      padding: '6.5px 10px',
                      color:
                        row.wdNum === 0
                          ? 'var(--ads-ink-pencil, #82807A)'
                          : 'var(--ads-ink-carbon, #141413)',
                    }}
                  >
                    {row.wdStr}
                  </td>

                  {/* Col 6: Quality Factor Q with Optional Relative Data Bar */}
                  <td className="ads-cell-num" style={{ padding: '6.5px 10px' }}>
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '6px',
                        width: '100%',
                      }}
                    >
                      {showDataBars && (
                        <span
                          aria-hidden="true"
                          style={{
                            width: '34px',
                            height: '4px',
                            borderRadius: '2px',
                            backgroundColor: 'oklch(0.93 0.005 82)',
                            overflow: 'hidden',
                            display: 'inline-flex',
                            justifyContent: 'flex-end',
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              width: `${qPct}%`,
                              height: '100%',
                              backgroundColor: row.isCurrent
                                ? 'var(--ads-accent-compute, #D63E18)'
                                : 'oklch(0.48 0.14 255 / 0.65)',
                            }}
                          />
                        </span>
                      )}
                      <span>
                        {row.qFactor}
                        {showUncertainty && (
                          <span className="ads-cell-uncertainty">±{row.qErr}</span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Col 7: Energy Relaxation Time τ_E with Optional Relative Data Bar */}
                  <td
                    className="ads-cell-num"
                    style={{
                      padding: '6.5px 10px',
                      fontWeight: 500,
                      backgroundColor: isEnergySymActive
                        ? 'oklch(0.95 0.03 160 / 0.45)'
                        : undefined,
                    }}
                  >
                    <div
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'flex-end',
                        gap: '6px',
                        width: '100%',
                      }}
                    >
                      {showDataBars && (
                        <span
                          aria-hidden="true"
                          style={{
                            width: '34px',
                            height: '4px',
                            borderRadius: '2px',
                            backgroundColor: 'oklch(0.93 0.005 82)',
                            overflow: 'hidden',
                            display: 'inline-flex',
                            justifyContent: 'flex-end',
                            flexShrink: 0,
                          }}
                        >
                          <span
                            style={{
                              width: `${tauPct}%`,
                              height: '100%',
                              backgroundColor: row.isCurrent
                                ? 'oklch(0.48 0.14 160)'
                                : 'oklch(0.48 0.14 160 / 0.55)',
                            }}
                          />
                        </span>
                      )}
                      <span>
                        {row.relaxationTau}
                        {showUncertainty && (
                          <span className="ads-cell-uncertainty">±{row.tauErr}</span>
                        )}
                      </span>
                    </div>
                  </td>

                  {/* Col 8: Word-Sized Tufte Sparkline */}
                  <td style={{ padding: '4px 10px', textAlign: 'center' }}>
                    <Sparkline
                      data={makeSparkData(row.zetaNum)}
                      domain={[-1.0, 1.05]}
                      width={66}
                      height={18}
                      color={
                        row.isCurrent
                          ? 'oklch(0.52 0.20 32)'
                          : 'oklch(0.42 0.16 255)'
                      }
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>

          {/* Summary Invariant Footer (\midrule above \bottomrule) */}
          <tfoot>
            <tr>
              <td
                colSpan={3}
                style={{
                  padding: '6px 10px',
                  fontWeight: 600,
                  color: 'var(--ads-ink-carbon, #141413)',
                  whiteSpace: 'nowrap',
                }}
              >
                Liouville &amp; Spectral Sum Rules (ζ = {activeZeta.toFixed(2)})
              </td>
              <td className="ads-cell-num" style={{ padding: '6px 10px' }}>
                <span style={{ color: 'var(--ads-ink-pencil)', marginRight: '4px' }}>
                  Tr(A) =
                </span>
                <strong>−{(2 * activeZeta * omega0).toFixed(2)} s⁻¹</strong>
              </td>
              <td className="ads-cell-num" style={{ padding: '6px 10px' }}>
                <span style={{ color: 'var(--ads-ink-pencil)', marginRight: '4px' }}>
                  det(A) =
                </span>
                <strong>{(omega0 * omega0).toFixed(2)} s⁻²</strong>
              </td>
              <td colSpan={3} className="ads-cell-num" style={{ padding: '6px 10px' }}>
                <span style={{ color: 'var(--ads-ink-pencil)', marginRight: '6px' }}>
                  Wronskian:
                </span>
                <InlineMath
                  latex={`W(t) = W_0\\,e^{-${(2 * activeZeta * omega0).toFixed(2)}t}`}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* ====================================================================
          THREEPARTTABLE FOOTNOTE STRIP (\begin{tablenotes})
          ==================================================================== */}
      <div className="ads-tablenotes">
        <span>
          <sup className="ads-tnote">a</sup>Sub-critical oscillatory regime with conjugate poles in{' '}
          <InlineMath latex="\mathbb{C}^-" />.
        </span>
        <span>
          <sup className="ads-tnote">b</sup>Degenerate Jordan block (<InlineMath latex="\omega_d = 0" />
          ) yielding fastest non-oscillatory return to equilibrium.
        </span>
        <span>
          <sup className="ads-tnote">c</sup>Live parameter row coupled to workbench scrubbers; click any
          canonical row to load its <InlineMath latex="\zeta" /> preset.
        </span>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * 7. 2D MATRIX, CORRELATION & ATTENTION HEATMAP (<HeatmapMatrix />)
 * ============================================================================
 * Perceptually uniform OKLCH colormaps, tabular cell values, interactive
 * row/column crosshair highlighting, marginal summary bars, and colorbar scale.
 */
export type HeatmapColormap =
  | 'cobalt'
  | 'diverging'
  | 'viridis'
  | 'vermilion'
  | 'emerald';

export interface HeatmapMatrixProps {
  title?: string;
  subtitle?: string;
  rowLabels: string[];
  colLabels: string[];
  values: number[][];
  domain?: [number, number];
  colormap?: HeatmapColormap;
  valueFormat?: (val: number) => string;
  unit?: string;
  showValues?: boolean;
  showMarginals?: boolean;
}

function sampleOklchColormap(
  norm: number,
  colormap: HeatmapColormap
): { bg: string; text: string } {
  const t = Math.max(0, Math.min(1, norm));
  if (colormap === 'diverging') {
    // -1 (Cobalt 255) -> 0 (Warm Paper 82) -> +1 (Vermilion 32)
    if (t < 0.5) {
      const s = (0.5 - t) * 2; // 0 to 1 towards negative
      const L = 0.975 - s * 0.44;
      const C = 0.005 + s * 0.155;
      return {
        bg: `oklch(${L.toFixed(3)} ${C.toFixed(3)} 255)`,
        text: L < 0.68 ? '#FFFFFF' : '#141413',
      };
    } else {
      const s = (t - 0.5) * 2; // 0 to 1 towards positive
      const L = 0.975 - s * 0.42;
      const C = 0.005 + s * 0.175;
      return {
        bg: `oklch(${L.toFixed(3)} ${C.toFixed(3)} 32)`,
        text: L < 0.68 ? '#FFFFFF' : '#141413',
      };
    }
  }

  if (colormap === 'viridis') {
    const L = 0.96 - t * 0.52;
    const C = 0.04 + Math.sin(t * Math.PI) * 0.12 + t * 0.04;
    const H = 115 + t * 155; // Warm lime/gold to deep teal/indigo
    return {
      bg: `oklch(${L.toFixed(3)} ${C.toFixed(3)} ${H.toFixed(1)})`,
      text: L < 0.66 ? '#FFFFFF' : '#141413',
    };
  }

  if (colormap === 'vermilion') {
    const L = 0.975 - t * 0.46;
    const C = 0.008 + t * 0.18;
    return {
      bg: `oklch(${L.toFixed(3)} ${C.toFixed(3)} 32)`,
      text: L < 0.67 ? '#FFFFFF' : '#141413',
    };
  }

  if (colormap === 'emerald') {
    const L = 0.975 - t * 0.46;
    const C = 0.008 + t * 0.145;
    return {
      bg: `oklch(${L.toFixed(3)} ${C.toFixed(3)} 160)`,
      text: L < 0.67 ? '#FFFFFF' : '#141413',
    };
  }

  // Default: 'cobalt'
  const L = 0.978 - t * 0.48;
  const C = 0.006 + t * 0.16;
  return {
    bg: `oklch(${L.toFixed(3)} ${C.toFixed(3)} 255)`,
    text: L < 0.67 ? '#FFFFFF' : '#141413',
  };
}

export const HeatmapMatrix: React.FC<HeatmapMatrixProps> = ({
  title,
  subtitle,
  rowLabels,
  colLabels,
  values,
  domain,
  colormap = 'cobalt',
  valueFormat,
  unit = '',
  showValues = true,
  showMarginals = true,
}) => {
  const [activeCell, setActiveCell] = useState<{ r: number; c: number } | null>(null);
  const [activeMap, setActiveMap] = useState<HeatmapColormap>(colormap);

  const flatVals = useMemo(() => values.flat(), [values]);
  const minVal = domain ? domain[0] : Math.min(...flatVals);
  const maxVal = domain ? domain[1] : Math.max(...flatVals);
  const span = Math.max(1e-6, maxVal - minVal);

  const rowMeans = useMemo(
    () =>
      values.map((row) =>
        row.length > 0 ? row.reduce((a, b) => a + b, 0) / row.length : 0
      ),
    [values]
  );

  const fmt = (v: number) =>
    valueFormat ? valueFormat(v) : v.toFixed(2).replace('-', '−');

  return (
    <div className="ads-ui" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {/* Header & Colormap Switcher */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <div>
          {title && (
            <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
              {title}
            </div>
          )}
          {subtitle && (
            <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>{subtitle}</div>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          {activeCell !== null && values[activeCell.r]?.[activeCell.c] !== undefined && (
            <span
              style={{
                fontFamily: 'var(--ads-font-mono)',
                fontSize: '11px',
                padding: '2px 8px',
                borderRadius: '4px',
                backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                border: '1px solid var(--ads-ink-hairline)',
                color: 'var(--ads-ink-carbon)',
              }}
            >
              [{rowLabels[activeCell.r]} × {colLabels[activeCell.c]}] ={' '}
              <strong>
                {fmt(values[activeCell.r][activeCell.c])}
                {unit}
              </strong>
            </span>
          )}

          <div className="ads-pill-group">
            {(
              [
                { id: 'cobalt', label: 'Cobalt' },
                { id: 'diverging', label: 'Diverging' },
                { id: 'viridis', label: 'Viridis' },
                { id: 'vermilion', label: 'Thermal' },
              ] as const
            ).map((cm) => (
              <button
                key={cm.id}
                type="button"
                data-active={activeMap === cm.id ? 'true' : 'false'}
                className="ads-pill-btn"
                onClick={() => setActiveMap(cm.id)}
              >
                {cm.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Matrix Grid + Marginal Summary Bars */}
      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '2px',
            fontSize: '11.5px',
          }}
        >
          <thead>
            <tr>
              <th
                style={{
                  textAlign: 'left',
                  padding: '4px 8px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  color: 'var(--ads-ink-pencil)',
                }}
              >
                Matrix ({rowLabels.length}×{colLabels.length})
              </th>
              {colLabels.map((cLab, cIdx) => {
                const isColHi = activeCell?.c === cIdx;
                return (
                  <th
                    key={`col-${cIdx}`}
                    style={{
                      textAlign: 'center',
                      padding: '4px 6px',
                      fontSize: '11px',
                      fontWeight: isColHi ? 700 : 600,
                      color: isColHi
                        ? 'var(--ads-accent-compute)'
                        : 'var(--ads-ink-graphite)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {cLab}
                  </th>
                );
              })}
              {showMarginals && (
                <th
                  style={{
                    textAlign: 'right',
                    padding: '4px 8px',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: 'var(--ads-ink-pencil)',
                  }}
                >
                  Row Mean
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {rowLabels.map((rLab, rIdx) => {
              const isRowHi = activeCell?.r === rIdx;
              const rMean = rowMeans[rIdx] ?? 0;
              const rMeanPct = Math.max(
                4,
                Math.min(100, ((rMean - minVal) / span) * 100)
              );

              return (
                <tr key={`row-${rIdx}`}>
                  <td
                    style={{
                      padding: '6px 8px',
                      fontWeight: isRowHi ? 700 : 500,
                      color: isRowHi
                        ? 'var(--ads-accent-compute)'
                        : 'var(--ads-ink-carbon)',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {rLab}
                  </td>

                  {(values[rIdx] || []).map((val, cIdx) => {
                    const norm = (val - minVal) / span;
                    const { bg, text } = sampleOklchColormap(norm, activeMap);
                    const isSelected =
                      activeCell?.r === rIdx && activeCell?.c === cIdx;

                    return (
                      <td
                        key={`cell-${rIdx}-${cIdx}`}
                        onMouseEnter={() => setActiveCell({ r: rIdx, c: cIdx })}
                        onMouseLeave={() => setActiveCell(null)}
                        style={{
                          padding: '7px 8px',
                          textAlign: 'center',
                          fontFamily: 'var(--ads-font-mono)',
                          fontVariantNumeric: 'tabular-nums',
                          fontSize: '11px',
                          fontWeight: isSelected ? 700 : 500,
                          backgroundColor: bg,
                          color: text,
                          borderRadius: '3.5px',
                          outline: isSelected
                            ? '2px solid var(--ads-ink-carbon, #141413)'
                            : 'none',
                          cursor: 'crosshair',
                          transition: 'transform 80ms ease',
                        }}
                      >
                        {showValues ? `${fmt(val)}${unit}` : ''}
                      </td>
                    );
                  })}

                  {showMarginals && (
                    <td
                      style={{
                        padding: '4px 8px',
                        textAlign: 'right',
                        fontFamily: 'var(--ads-font-mono)',
                        fontSize: '11px',
                        color: 'var(--ads-ink-graphite)',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <div
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span
                          style={{
                            width: '36px',
                            height: '5px',
                            borderRadius: '2.5px',
                            backgroundColor: 'oklch(0.92 0.005 82)',
                            overflow: 'hidden',
                            display: 'inline-block',
                          }}
                        >
                          <span
                            style={{
                              display: 'block',
                              width: `${rMeanPct}%`,
                              height: '100%',
                              backgroundColor: 'oklch(0.45 0.145 255)',
                            }}
                          />
                        </span>
                        <span>
                          {fmt(rMean)}
                          {unit}
                        </span>
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Continuous Colorbar Scale Footer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          paddingTop: '4px',
          fontSize: '10.5px',
          fontFamily: 'var(--ads-font-mono)',
          color: 'var(--ads-ink-pencil)',
        }}
      >
        <span>
          Scale Domain: [{fmt(minVal)}
          {unit}, {fmt(maxVal)}
          {unit}]
        </span>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span>{fmt(minVal)}</span>
          <div
            style={{
              width: '120px',
              height: '7px',
              borderRadius: '3.5px',
              border: '1px solid var(--ads-ink-hairline)',
              background: `linear-gradient(90deg, ${[0, 0.25, 0.5, 0.75, 1]
                .map((s) => `${sampleOklchColormap(s, activeMap).bg} ${s * 100}%`)
                .join(', ')})`,
            }}
          />
          <span>{fmt(maxVal)}</span>
        </div>
      </div>
    </div>
  );
};

/**
 * ============================================================================
 * 8. RAINCLOUD KDE VIOLIN & FOREST CI PLOT (<DistributionPlot />)
 * ============================================================================
 * Dual-mode statistical distribution & clinical/benchmark effect-size engine:
 * - mode="raincloud": Half-violin Gaussian KDE + median/IQR box + jittered samples
 * - mode="forest": Publication Forest Plot (NEJM/Cochrane standard) with null
 *   reference line, sample-weight squares, 95% CI whiskers, and pooled diamond.
 */
export interface DistributionGroup {
  id: string;
  label: string;
  sublabel?: string;
  color?: string;
  samples?: number[];
  estimate?: number;
  ciLower?: number;
  ciUpper?: number;
  weight?: number;
  pValue?: string;
}

export interface DistributionPlotProps {
  mode?: 'raincloud' | 'forest';
  title?: string;
  xAxisLabel?: string;
  domain?: [number, number];
  nullValue?: number;
  unit?: string;
  groups: DistributionGroup[];
  pooledSummary?: {
    label: string;
    estimate: number;
    ciLower: number;
    ciUpper: number;
  };
}

export const DistributionPlot: React.FC<DistributionPlotProps> = ({
  mode = 'raincloud',
  title,
  xAxisLabel,
  domain,
  nullValue = 1.0,
  unit = '',
  groups,
  pooledSummary,
}) => {
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  // Compute statistics for each group
  const computedGroups = useMemo(() => {
    return groups.map((g, gIdx) => {
      const color =
        g.color ||
        [
          'oklch(0.45 0.15 255)',
          'oklch(0.46 0.14 160)',
          'oklch(0.52 0.18 32)',
          'oklch(0.48 0.16 310)',
          'oklch(0.52 0.14 75)',
        ][gIdx % 5];

      if (g.samples && g.samples.length > 0) {
        const sorted = [...g.samples].sort((a, b) => a - b);
        const n = sorted.length;
        const min = sorted[0];
        const max = sorted[n - 1];
        const q25 = sorted[Math.floor(n * 0.25)];
        const median = sorted[Math.floor(n * 0.5)];
        const q75 = sorted[Math.floor(n * 0.75)];
        const mean = sorted.reduce((a, b) => a + b, 0) / n;
        const std = Math.sqrt(
          sorted.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / Math.max(1, n - 1)
        );
        return {
          ...g,
          color,
          min,
          max,
          q25,
          median,
          q75,
          mean,
          std,
          estimate: g.estimate ?? median,
          ciLower: g.ciLower ?? q25,
          ciUpper: g.ciUpper ?? q75,
        };
      }

      const est = g.estimate ?? 1.0;
      const lo = g.ciLower ?? est - 0.15;
      const hi = g.ciUpper ?? est + 0.15;
      return {
        ...g,
        color,
        min: lo,
        max: hi,
        q25: lo,
        median: est,
        q75: hi,
        mean: est,
        std: Math.max(0.05, (hi - lo) / 3.92),
        estimate: est,
        ciLower: lo,
        ciUpper: hi,
      };
    });
  }, [groups]);

  const xDom: [number, number] = useMemo(() => {
    if (domain) return domain;
    const allMin = Math.min(...computedGroups.map((g) => g.min));
    const allMax = Math.max(...computedGroups.map((g) => g.max));
    const pad = Math.max(0.1, (allMax - allMin) * 0.12);
    return [allMin - pad, allMax + pad];
  }, [domain, computedGroups]);

  const width = 620;
  const rowH = mode === 'raincloud' ? 52 : 36;
  const extraPoolH = pooledSummary && mode === 'forest' ? 38 : 0;
  const pad = {
    top: title ? 28 : 14,
    left: 168,
    right: mode === 'forest' ? 148 : 96,
    bottom: 36,
  };
  const innerW = width - pad.left - pad.right;
  const innerH = computedGroups.length * rowH + extraPoolH;
  const height = pad.top + innerH + pad.bottom;

  const mapX = (v: number) =>
    pad.left + ((v - xDom[0]) / Math.max(1e-6, xDom[1] - xDom[0])) * innerW;

  const ticks = useMemo(() => {
    const count = 5;
    return Array.from(
      { length: count },
      (_, i) => xDom[0] + (i / (count - 1)) * (xDom[1] - xDom[0])
    );
  }, [xDom]);

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{ width: '100%', height: 'auto', display: 'block', userSelect: 'none' }}
    >
      {title && (
        <text
          x={pad.left}
          y={16}
          fontSize="10.5"
          fontFamily="var(--ads-font-chrome, Inter, sans-serif)"
          fontWeight={600}
          fill="#141413"
        >
          {title}
        </text>
      )}

      {/* Plot Well Background */}
      <rect
        x={pad.left}
        y={pad.top}
        width={innerW}
        height={innerH}
        fill="oklch(0.996 0.002 85 / 0.65)"
        stroke="oklch(0.84 0.006 80)"
        strokeWidth={0.8}
      />

      {/* Vertical Gridlines & X Ticks */}
      {ticks.map((tk, idx) => {
        const x = mapX(tk);
        return (
          <g key={`dtk-${idx}`}>
            <line
              x1={x}
              y1={pad.top}
              x2={x}
              y2={pad.top + innerH}
              stroke="oklch(0.935 0.004 82)"
              strokeWidth={0.75}
            />
            <line
              x1={x}
              y1={pad.top + innerH - 4}
              x2={x}
              y2={pad.top + innerH}
              stroke="oklch(0.42 0.008 80)"
              strokeWidth={0.9}
            />
            <text
              x={x}
              y={pad.top + innerH + 14}
              textAnchor="middle"
              fontSize="9"
              fontFamily="var(--ads-font-mono, monospace)"
              fill="#65635D"
            >
              {tk.toFixed(mode === 'forest' ? 2 : 1).replace('-', '−')}
              {unit}
            </text>
          </g>
        );
      })}

      {/* Null-Effect Reference Line (For Forest Plots or Zero Threshold) */}
      {nullValue >= xDom[0] && nullValue <= xDom[1] && (
        <g>
          <line
            x1={mapX(nullValue)}
            y1={pad.top}
            x2={mapX(nullValue)}
            y2={pad.top + innerH}
            stroke="oklch(0.45 0.01 80)"
            strokeWidth={1.1}
            strokeDasharray="3 2"
          />
        </g>
      )}

      {/* Rows */}
      {computedGroups.map((g, idx) => {
        const rowTop = pad.top + idx * rowH;
        const cy = rowTop + rowH * (mode === 'raincloud' ? 0.64 : 0.5);
        const isHi = activeGroupId === g.id;

        // Build Gaussian KDE half-violin curve if mode === 'raincloud'
        let kdePath = '';
        if (mode === 'raincloud') {
          const samples = g.samples && g.samples.length > 0 ? g.samples : [g.q25, g.median, g.q75];
          const bw = Math.max(0.08, g.std * 0.65);
          const nSteps = 36;
          const densities: Array<{ x: number; d: number }> = [];
          let maxD = 1e-6;
          for (let s = 0; s <= nSteps; s++) {
            const xv = xDom[0] + (s / nSteps) * (xDom[1] - xDom[0]);
            let sum = 0;
            for (const sv of samples) {
              const u = (xv - sv) / bw;
              sum += Math.exp(-0.5 * u * u);
            }
            if (sum > maxD) maxD = sum;
            densities.push({ x: xv, d: sum });
          }
          const maxViolinH = rowH * 0.44;
          const curvePts = densities.map(
            (pt, k) =>
              `${k === 0 ? 'M' : 'L'}${mapX(pt.x).toFixed(1)},${(
                cy -
                4 -
                (pt.d / maxD) * maxViolinH
              ).toFixed(1)}`
          );
          kdePath = `${curvePts.join(' ')} L${mapX(xDom[1]).toFixed(1)},${(cy - 4).toFixed(
            1
          )} L${mapX(xDom[0]).toFixed(1)},${(cy - 4).toFixed(1)} Z`;
        }

        return (
          <g
            key={g.id}
            onPointerEnter={() => setActiveGroupId(g.id)}
            onPointerLeave={() => setActiveGroupId(null)}
            style={{ cursor: 'pointer' }}
          >
            {/* Row Hover Highlight */}
            {isHi && (
              <rect
                x={4}
                y={rowTop + 2}
                width={width - 8}
                height={rowH - 4}
                rx={4}
                fill="oklch(0.94 0.02 255 / 0.35)"
              />
            )}

            {/* Row Divider */}
            {idx > 0 && (
              <line
                x1={pad.left}
                y1={rowTop}
                x2={pad.left + innerW}
                y2={rowTop}
                stroke="oklch(0.945 0.004 82)"
                strokeWidth={0.7}
              />
            )}

            {/* Left Group Label */}
            <text
              x={pad.left - 10}
              y={cy - (g.sublabel ? 2 : -3)}
              textAnchor="end"
              fontSize="10"
              fontFamily="var(--ads-font-chrome, Inter, sans-serif)"
              fontWeight={isHi ? 700 : 600}
              fill="#141413"
            >
              {g.label.length > 25 ? `${g.label.slice(0, 24)}…` : g.label}
            </text>
            {g.sublabel && (
              <text
                x={pad.left - 10}
                y={cy + 10}
                textAnchor="end"
                fontSize="8.5"
                fontFamily="var(--ads-font-mono, monospace)"
                fill="#82807A"
              >
                {g.sublabel}
              </text>
            )}

            {mode === 'raincloud' ? (
              <>
                {/* Half-Violin KDE Cloud */}
                <path
                  d={kdePath}
                  fill={g.color}
                  fillOpacity={0.22}
                  stroke={g.color}
                  strokeWidth={1.25}
                />

                {/* Whisker Line [min, max] */}
                <line
                  x1={mapX(g.min)}
                  y1={cy}
                  x2={mapX(g.max)}
                  y2={cy}
                  stroke={g.color}
                  strokeWidth={1.15}
                />

                {/* IQR Box [q25, q75] */}
                <rect
                  x={mapX(g.q25)}
                  y={cy - 3.5}
                  width={Math.max(2, mapX(g.q75) - mapX(g.q25))}
                  height={7}
                  rx={1.5}
                  fill="#FFFFFF"
                  stroke={g.color}
                  strokeWidth={1.4}
                />

                {/* Median Line */}
                <line
                  x1={mapX(g.median)}
                  y1={cy - 4}
                  x2={mapX(g.median)}
                  y2={cy + 4}
                  stroke={g.color}
                  strokeWidth={2.2}
                />

                {/* Deterministic Jittered Raindrop Samples */}
                {(g.samples || []).map((sv, sIdx) => {
                  const jitterY = cy + 8 + ((sIdx * 7) % 7);
                  return (
                    <circle
                      key={`samp-${sIdx}`}
                      cx={mapX(sv)}
                      cy={jitterY}
                      r={1.8}
                      fill={g.color}
                      fillOpacity={0.68}
                    />
                  );
                })}

                {/* Right Summary Readout */}
                <text
                  x={pad.left + innerW + 8}
                  y={cy + 3}
                  fontSize="9.2"
                  fontFamily="var(--ads-font-mono, monospace)"
                  fontWeight={600}
                  fill="#141413"
                >
                  {g.median.toFixed(1)}
                  {unit}{' '}
                  <tspan fontWeight={400} fill="#82807A" fontSize="8.5">
                    ±{g.std.toFixed(1)}
                  </tspan>
                </text>
              </>
            ) : (
              <>
                {/* Forest Plot 95% CI Whisker */}
                <line
                  x1={mapX(g.ciLower)}
                  y1={cy}
                  x2={mapX(g.ciUpper)}
                  y2={cy}
                  stroke={g.color}
                  strokeWidth={1.5}
                />
                <line
                  x1={mapX(g.ciLower)}
                  y1={cy - 3.5}
                  x2={mapX(g.ciLower)}
                  y2={cy + 3.5}
                  stroke={g.color}
                  strokeWidth={1.3}
                />
                <line
                  x1={mapX(g.ciUpper)}
                  y1={cy - 3.5}
                  x2={mapX(g.ciUpper)}
                  y2={cy + 3.5}
                  stroke={g.color}
                  strokeWidth={1.3}
                />

                {/* Proportional Weight Square */}
                {(() => {
                  const sq = Math.max(5, Math.min(10, (g.weight ?? 20) * 0.28));
                  return (
                    <rect
                      x={mapX(g.estimate) - sq / 2}
                      y={cy - sq / 2}
                      width={sq}
                      height={sq}
                      rx={1}
                      fill={g.color}
                      stroke="#FFFFFF"
                      strokeWidth={1}
                    />
                  );
                })()}

                {/* Right Tabular Estimate [95% CI] Readout */}
                <text
                  x={pad.left + innerW + 8}
                  y={cy + 3.2}
                  fontSize="9"
                  fontFamily="var(--ads-font-mono, monospace)"
                  fontWeight={600}
                  fill="#141413"
                >
                  {g.estimate.toFixed(2)}{' '}
                  <tspan fontWeight={400} fill="#6E6C66">
                    [{g.ciLower.toFixed(2)}, {g.ciUpper.toFixed(2)}]
                  </tspan>
                </text>
              </>
            )}
          </g>
        );
      })}

      {/* Pooled Summary Diamond (For Forest Plot) */}
      {pooledSummary && mode === 'forest' && (
        <g transform={`translate(0, ${pad.top + computedGroups.length * rowH})`}>
          <line
            x1={pad.left}
            y1={0}
            x2={pad.left + innerW}
            y2={0}
            stroke="oklch(0.75 0.008 80)"
            strokeWidth={1}
          />
          <text
            x={pad.left - 10}
            y={22}
            textAnchor="end"
            fontSize="10"
            fontFamily="var(--ads-font-chrome, Inter, sans-serif)"
            fontWeight={700}
            fill="#141413"
          >
            {pooledSummary.label}
          </text>
          <polygon
            points={`${mapX(pooledSummary.ciLower)},19 ${mapX(
              pooledSummary.estimate
            )},12 ${mapX(pooledSummary.ciUpper)},19 ${mapX(pooledSummary.estimate)},26`}
            fill="oklch(0.52 0.19 32)"
            stroke="#FFFFFF"
            strokeWidth={1}
          />
          <text
            x={pad.left + innerW + 8}
            y={22}
            fontSize="9.2"
            fontFamily="var(--ads-font-mono, monospace)"
            fontWeight={700}
            fill="oklch(0.48 0.19 32)"
          >
            {pooledSummary.estimate.toFixed(2)} [{pooledSummary.ciLower.toFixed(2)},{' '}
            {pooledSummary.ciUpper.toFixed(2)}]
          </text>
        </g>
      )}

      {/* X Axis Label */}
      {xAxisLabel && (
        <text
          x={pad.left + innerW / 2}
          y={height - 5}
          textAnchor="middle"
          fontSize="10.2"
          fontFamily="KaTeX_Main, Newsreader, serif"
          fontStyle="italic"
          fill="#3E3D3A"
        >
          {xAxisLabel}
        </text>
      )}
    </svg>
  );
};
