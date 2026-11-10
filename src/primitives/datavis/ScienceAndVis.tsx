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
  highlightIndex?: number;
}

export const Sparkline: React.FC<SparklineProps> = ({
  data,
  domain,
  width = 72,
  height = 20,
  color = 'oklch(0.42 0.16 255)',
  fillArea = true,
  showZeroLine = true,
  highlightIndex,
}) => {
  if (!data || data.length < 2) return null;

  const minVal = domain ? domain[0] : Math.min(...data);
  const maxVal = domain ? domain[1] : Math.max(...data);
  const span = Math.max(1e-6, maxVal - minVal);
  const pad = 2;
  const innerW = width - pad * 2;
  const innerH = height - pad * 2;

  const mapX = (i: number) => pad + (i / (data.length - 1)) * innerW;
  const mapY = (v: number) => pad + ((maxVal - v) / span) * innerH;

  const linePath = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'}${mapX(i).toFixed(1)},${mapY(v).toFixed(1)}`)
    .join(' ');

  const zeroY = mapY(0);
  const areaPath = `${linePath} L${mapX(data.length - 1).toFixed(1)},${zeroY.toFixed(1)} L${mapX(0).toFixed(1)},${zeroY.toFixed(1)} Z`;

  const hiIdx =
    highlightIndex !== undefined
      ? Math.max(0, Math.min(data.length - 1, highlightIndex))
      : data.length - 1;

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
      {showZeroLine && minVal <= 0 && maxVal >= 0 && (
        <line
          x1={pad}
          y1={zeroY}
          x2={width - pad}
          y2={zeroY}
          stroke="oklch(0.86 0.005 80)"
          strokeWidth={0.75}
        />
      )}
      {fillArea && (
        <path
          d={areaPath}
          fill={color}
          fillOpacity={0.12}
          style={{ mixBlendMode: 'multiply' }}
        />
      )}
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth={1.35}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={mapX(hiIdx)}
        cy={mapY(data[hiIdx])}
        r={2}
        fill={color}
      />
    </svg>
  );
};

/**
 * ============================================================================
 * 2. DECLARATIVE 2D CARTESIAN PLOT ENGINE (<CartesianCanvas />)
 * ============================================================================
 * Supports linear & log10 scales, pgfplots boxed vs Tufte range-frame axes,
 * inward surgical ticks, confidence bands, empirical ±1σ error bars,
 * threshold annotations, and interactive crosshair scrubbing.
 */
export interface PlotSeries {
  id: string;
  label?: string;
  symbolId?: string;
  color: string;
  strokeWidth?: number;
  dashArray?: string;
  points: Array<{ x: number; y: number }>;
  fillToZero?: boolean;
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
  series: PlotSeries[];
  bands?: PlotConfidenceBand[];
  errorPoints?: PlotErrorPoint[];
  thresholds?: PlotThreshold[];
  scrubX?: number;
  onScrubX?: (x: number) => void;
  activeReadout?: { x: number; y: number; color?: string; secondaryY?: number };
}

export const CartesianCanvas: React.FC<CartesianCanvasProps> = ({
  id,
  width = 440,
  height = 235,
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
  series,
  bands = [],
  errorPoints = [],
  thresholds = [],
  scrubX,
  onScrubX,
  activeReadout,
}) => {
  const { activeSymbolId } = useAcademicSystem();

  const pad = { top: 16, right: 16, bottom: xAxisLabel ? 38 : 28, left: yAxisLabel ? 48 : 38 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

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

  return (
    <svg
      id={id}
      viewBox={`0 0 ${width} ${height}`}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        cursor: onScrubX ? 'crosshair' : 'default',
        userSelect: 'none',
      }}
      onPointerMove={(e) => {
        if (!onScrubX) return;
        const rect = e.currentTarget.getBoundingClientRect();
        const relX = ((e.clientX - rect.left) / rect.width) * width;
        onScrubX(unmapX(relX));
      }}
    >
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
                    ? 'oklch(0.78 0.006 80)'
                    : 'oklch(0.935 0.004 82)'
                }
                strokeWidth={isZero ? 1 : 0.75}
              />
            )}
            {/* Surgical inward/outward tick mark */}
            <line
              x1={pad.left}
              y1={y}
              x2={pad.left + 4}
              y2={y}
              stroke="oklch(0.45 0.008 80)"
              strokeWidth={0.9}
            />
            {frameStyle === 'box' && (
              <line
                x1={width - pad.right - 3.5}
                y1={y}
                x2={width - pad.right}
                y2={y}
                stroke="oklch(0.60 0.008 80)"
                strokeWidth={0.8}
              />
            )}
            <text
              x={pad.left - 6}
              y={y + 3.5}
              textAnchor="end"
              fontSize="9.5"
              fontFamily="Inter, -apple-system, sans-serif"
              fill="#6E6C66"
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
                stroke="oklch(0.95 0.004 82)"
                strokeWidth={0.65}
              />
            )}
            <line
              x1={x}
              y1={height - pad.bottom - 4}
              x2={x}
              y2={height - pad.bottom}
              stroke="oklch(0.45 0.008 80)"
              strokeWidth={0.9}
            />
            {frameStyle === 'box' && (
              <line
                x1={x}
                y1={pad.top}
                x2={x}
                y2={pad.top + 3.5}
                stroke="oklch(0.60 0.008 80)"
                strokeWidth={0.8}
              />
            )}
            <text
              x={x}
              y={height - pad.bottom + 14}
              textAnchor="middle"
              fontSize="9.5"
              fontFamily="Inter, -apple-system, sans-serif"
              fill="#6E6C66"
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
            y1={height - pad.bottom - 2.2}
            x2={x}
            y2={height - pad.bottom}
            stroke="oklch(0.65 0.006 80)"
            strokeWidth={0.7}
          />
        );
      })}

      {/* Axis Spines (Box, L-Frame, or Tufte Range-Frame) */}
      <line
        x1={xSpineMin}
        y1={height - pad.bottom}
        x2={xSpineMax}
        y2={height - pad.bottom}
        stroke="oklch(0.42 0.008 80)"
        strokeWidth={1}
      />
      <line
        x1={pad.left}
        y1={ySpineMin}
        x2={pad.left}
        y2={ySpineMax}
        stroke="oklch(0.42 0.008 80)"
        strokeWidth={1}
      />
      {frameStyle === 'box' && (
        <>
          <line
            x1={pad.left}
            y1={pad.top}
            x2={width - pad.right}
            y2={pad.top}
            stroke="oklch(0.68 0.006 80)"
            strokeWidth={0.85}
          />
          <line
            x1={width - pad.right}
            y1={pad.top}
            x2={width - pad.right}
            y2={height - pad.bottom}
            stroke="oklch(0.68 0.006 80)"
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
          fontSize="10"
          fontFamily="KaTeX_Main, Newsreader, serif"
          fontStyle="italic"
          fill="#4E4D49"
        >
          {xAxisLabel}
        </text>
      )}
      {yAxisLabel && (
        <text
          x={12}
          y={pad.top + innerH / 2}
          textAnchor="middle"
          fontSize="10"
          fontFamily="KaTeX_Main, Newsreader, serif"
          fontStyle="italic"
          fill="#4E4D49"
          transform={`rotate(-90, 12, ${pad.top + innerH / 2})`}
        >
          {yAxisLabel}
        </text>
      )}

      {/* Threshold Annotations */}
      {thresholds.map((th, idx) => {
        if (th.axis === 'x') {
          const x = mapX(th.value);
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
                  x={x + 4}
                  y={pad.top + 11}
                  fontSize="9"
                  fontFamily="Inter, -apple-system, sans-serif"
                  fill={th.color || '#82807A'}
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
                  x={width - pad.right - 4}
                  y={y - 4}
                  textAnchor="end"
                  fontSize="9"
                  fontFamily="Inter, -apple-system, sans-serif"
                  fill={th.color || '#82807A'}
                >
                  {th.label}
                </text>
              )}
            </g>
          );
        }
      })}

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

      {/* Series Curves & Optional Shaded Fills */}
      {series.map((s) => {
        if (s.points.length < 2) return null;
        const isHighlighted = s.symbolId && activeSymbolId === s.symbolId;
        const pathD = s.points
          .map(
            (p, idx) =>
              `${idx === 0 ? 'M' : 'L'}${mapX(p.x).toFixed(1)},${mapY(p.y).toFixed(1)}`
          )
          .join(' ');

        const zeroY = mapY(0);
        const areaD = s.fillToZero
          ? `${pathD} L${mapX(s.points[s.points.length - 1].x).toFixed(1)},${zeroY.toFixed(1)} L${mapX(s.points[0].x).toFixed(1)},${zeroY.toFixed(1)} Z`
          : undefined;

        return (
          <g key={s.id}>
            {areaD && (
              <path
                d={areaD}
                fill={s.color}
                fillOpacity={s.fillOpacity ?? 0.16}
                style={{ mixBlendMode: 'multiply' }}
              />
            )}
            <path
              d={pathD}
              fill="none"
              stroke={s.color}
              strokeWidth={isHighlighted ? (s.strokeWidth ?? 1.8) + 0.8 : s.strokeWidth ?? 1.8}
              strokeDasharray={s.dashArray}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
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
          <g key={`errpt-${idx}`} opacity={0.85}>
            <line x1={cx} y1={yTop} x2={cx} y2={yBot} stroke={c} strokeWidth={1} />
            <line x1={cx - 2.5} y1={yTop} x2={cx + 2.5} y2={yTop} stroke={c} strokeWidth={1} />
            <line x1={cx - 2.5} y1={yBot} x2={cx + 2.5} y2={yBot} stroke={c} strokeWidth={1} />
            <circle cx={cx} cy={cy} r={2.2} fill="#FFFFFF" stroke={c} strokeWidth={1.2} />
          </g>
        );
      })}

      {/* Interactive Scrubbed Hairline & Active Particle */}
      {scrubX !== undefined && activeReadout && (
        <g>
          <line
            x1={mapX(scrubX)}
            y1={pad.top}
            x2={mapX(scrubX)}
            y2={height - pad.bottom}
            stroke="oklch(0.55 0.19 32 / 0.65)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          {activeReadout.secondaryY !== undefined && (
            <circle
              cx={mapX(activeReadout.x)}
              cy={mapY(activeReadout.secondaryY)}
              r={3}
              fill="oklch(0.48 0.14 160)"
              stroke="#FFFFFF"
              strokeWidth={1.2}
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
 * Hamiltonian iso-energy contours, phase trajectories, and instantaneous
 * velocity tangent vector.
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
  height = 235,
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
  const pad = { top: 16, right: 16, bottom: 38, left: 36 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const mapX = (xVal: number) =>
    pad.left + ((xVal - xDomain[0]) / (xDomain[1] - xDomain[0])) * innerW;
  const mapY = (yVal: number) =>
    pad.top + ((yDomain[1] - yVal) / (yDomain[1] - yDomain[0])) * innerH;

  const trajPath = trajectory
    .map(
      (p, idx) =>
        `${idx === 0 ? 'M' : 'L'}${mapX(p.x).toFixed(1)},${mapY(p.y).toFixed(1)}`
    )
    .join(' ');

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
        // Screen-space direction (invert dy because SVG y is downward)
        const ux = dx / mag;
        const uy = -dy / mag;
        const len = Math.min(11, 5.5 + Math.min(1, mag / 4) * 5.5);

        const x1 = cx - ux * (len * 0.45);
        const y1 = cy - uy * (len * 0.45);
        const x2 = cx + ux * (len * 0.55);
        const y2 = cy + uy * (len * 0.55);

        // Arrowhead wings
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
        userSelect: 'none',
      }}
    >
      {/* Box Frame */}
      <rect
        x={pad.left}
        y={pad.top}
        width={innerW}
        height={innerH}
        fill="none"
        stroke="oklch(0.68 0.006 80)"
        strokeWidth={0.85}
      />

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
          stroke="oklch(0.91 0.005 80)"
          strokeWidth={0.75}
          strokeDasharray="2 2"
        />
      ))}

      {/* 2D Vector Quiver Field */}
      {quiverArrows.map((a, idx) => (
        <g key={`q-${idx}`} opacity={0.32 + a.magNorm * 0.28}>
          <line
            x1={a.x1}
            y1={a.y1}
            x2={a.x2}
            y2={a.y2}
            stroke="oklch(0.52 0.04 250)"
            strokeWidth={0.85}
          />
          <polyline
            points={`${a.hx1.toFixed(1)},${a.hy1.toFixed(1)} ${a.x2.toFixed(1)},${a.y2.toFixed(1)} ${a.hx2.toFixed(1)},${a.hy2.toFixed(1)}`}
            fill="none"
            stroke="oklch(0.52 0.04 250)"
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
          fill="oklch(0.92 0.04 160 / 0.18)"
          stroke="oklch(0.48 0.14 160 / 0.65)"
          strokeWidth={1}
          strokeDasharray="3 2"
        />
      )}

      {/* Phase Trajectory */}
      <path
        d={trajPath}
        fill="none"
        stroke="oklch(0.42 0.16 255)"
        strokeWidth={1.75}
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
              strokeWidth={1.4}
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

      {/* Axis Labels */}
      <text
        x={pad.left + innerW / 2}
        y={height - 5}
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, Newsreader, serif"
        fontStyle="italic"
        fill="#4E4D49"
      >
        {xAxisLabel}
      </text>
      <text
        x={11}
        y={pad.top + innerH / 2}
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, Newsreader, serif"
        fontStyle="italic"
        fill="#4E4D49"
        transform={`rotate(-90, 11, ${pad.top + innerH / 2})`}
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
 * damping angle θ = arccos(ζ), and full root-locus branches.
 */
export interface ComplexPlaneCanvasProps {
  width?: number;
  height?: number;
  zeta: number;
  omega0: number;
}

export const ComplexPlaneCanvas: React.FC<ComplexPlaneCanvasProps> = ({
  width = 250,
  height = 235,
  zeta,
  omega0,
}) => {
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

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      style={{
        width: '100%',
        height: 'auto',
        display: 'block',
        userSelect: 'none',
      }}
    >
      {/* Stable LHP shading (Re(s) < 0) */}
      <rect
        x={pad.left}
        y={pad.top}
        width={Math.max(0, originX - pad.left)}
        height={innerH}
        fill="oklch(0.965 0.012 160 / 0.45)"
      />
      {/* Unstable RHP shading (Re(s) > 0) */}
      <rect
        x={originX}
        y={pad.top}
        width={Math.max(0, width - pad.right - originX)}
        height={innerH}
        fill="oklch(0.965 0.015 32 / 0.28)"
      />

      {/* Box Frame */}
      <rect
        x={pad.left}
        y={pad.top}
        width={innerW}
        height={innerH}
        fill="none"
        stroke="oklch(0.68 0.006 80)"
        strokeWidth={0.85}
      />

      {/* Real & Imaginary Axes */}
      <line
        x1={pad.left}
        y1={originY}
        x2={width - pad.right}
        y2={originY}
        stroke="oklch(0.75 0.008 80)"
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
        stroke="oklch(0.42 0.16 255 / 0.45)"
        strokeWidth={1.2}
        strokeDasharray="3 2"
      />

      {/* Real-axis breakaway branch for ζ ≥ 1 */}
      <line
        x1={mapRe(reMin * 0.92)}
        y1={originY}
        x2={originX}
        y2={originY}
        stroke="oklch(0.42 0.16 255 / 0.35)"
        strokeWidth={2}
      />

      {/* Damping angle rays from origin to poles */}
      <line
        x1={originX}
        y1={originY}
        x2={mapRe(p1.re)}
        y2={mapIm(p1.im)}
        stroke="oklch(0.55 0.19 32 / 0.6)"
        strokeWidth={1}
      />
      <line
        x1={originX}
        y1={originY}
        x2={mapRe(p2.re)}
        y2={mapIm(p2.im)}
        stroke="oklch(0.55 0.19 32 / 0.6)"
        strokeWidth={1}
      />

      {/* Pole Cross Markers (×) for λ₁ and λ₂ */}
      {[p1, p2].map((pole, idx) => {
        const cx = mapRe(pole.re);
        const cy = mapIm(pole.im);
        const s = 4.2;
        return (
          <g key={`pole-${idx}`}>
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

      {/* Annotations */}
      <text
        x={pad.left + 5}
        y={pad.top + 12}
        fontSize="8.5"
        fontFamily="Inter, -apple-system, sans-serif"
        fill="#4E4D49"
      >
        LHP (Stable)
      </text>
      <text
        x={mapRe(-omega0)}
        y={originY + 13}
        textAnchor="middle"
        fontSize="8.5"
        fontFamily="Inter, -apple-system, sans-serif"
        fill="#6E6C66"
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
        fill="#4E4D49"
      >
        Re(λ) [s⁻¹]
      </text>
      <text
        x={11}
        y={pad.top + innerH / 2}
        textAnchor="middle"
        fontSize="10"
        fontFamily="KaTeX_Main, Newsreader, serif"
        fontStyle="italic"
        fill="#4E4D49"
        transform={`rotate(-90, 11, ${pad.top + innerH / 2})`}
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
