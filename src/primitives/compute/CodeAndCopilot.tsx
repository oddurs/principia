import React, { useState } from 'react';
import {
  Play,
  Keyboard,
  CornerDownLeft,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
} from 'lucide-react';
import { useAcademicSystem, SYMBOL_SLOT_COLORS } from '../../core/registry';
import { Sym, InlineMath } from '../manuscript/MathAndFormal';
import { Cite, CrossRef } from '../manuscript/CitationsAndRefs';

/**
 * ============================================================================
 * L3 PILLARS 5 & 6: COMPUTATIONAL CELLS, OMNIBAR & GROUNDED AI (Polished)
 * ============================================================================
 */

export interface OmniQueryPreset {
  id: string;
  label: string;
  query: string;
  interpretationLatex: string;
  zeta: number;
  omega0: number;
}

export const OMNI_QUERY_PRESETS: OmniQueryPreset[] = [
  {
    id: 'underdamped',
    label: 'Underdamped (ζ = 0.25)',
    query: 'dsolve(x\'\'(t) + 2*zeta*omega_0*x\'(t) + omega_0^2*x(t) == dirac(t), zeta=0.25, omega_0=4.0)',
    interpretationLatex:
      '\\frac{d^2 x}{dt^2} + 2\\zeta\\omega_0\\frac{dx}{dt} + \\omega_0^2 x(t) = \\delta(t) \\quad (\\zeta = 0.25,\\; \\omega_0 = 4.0)',
    zeta: 0.25,
    omega0: 4.0,
  },
  {
    id: 'critical',
    label: 'Critical (ζ = 1.00)',
    query: 'limit(GreensFunction(t, zeta, omega_0), zeta -> 1, omega_0=4.0)',
    interpretationLatex:
      '\\lim_{\\zeta \\to 1^-} G(t; \\zeta, \\omega_0) = \\Theta(t)\\, t\\, e^{-\\omega_0 t}',
    zeta: 1.0,
    omega0: 4.0,
  },
  {
    id: 'overdamped',
    label: 'Overdamped (ζ = 1.45)',
    query: 'phase_portrait(Hamiltonian(q, p), zeta=1.45, omega_0=5.0)',
    interpretationLatex:
      '\\mathcal{H}(q, p) = \\frac{1}{2}p^2 + \\frac{1}{2}\\omega_0^2 q^2,\\quad \\zeta = 1.45 > 1',
    zeta: 1.45,
    omega0: 5.0,
  },
];

const TOUCH_MATH_SYMBOLS = [
  { label: 'ζ', insert: 'zeta' },
  { label: 'ω₀', insert: 'omega_0' },
  { label: '∫', insert: 'integrate(' },
  { label: '∂/∂t', insert: 'diff(x(t), t)' },
  { label: '√', insert: 'sqrt(' },
  { label: '∞', insert: 'oo' },
  { label: 'δ(t)', insert: 'dirac(t)' },
  { label: 'ℋ', insert: 'Hamiltonian(q, p)' },
  { label: '→', insert: ' -> ' },
  { label: '±', insert: ' +- ' },
];

export interface OmniComputeBarProps {
  onSelectPreset?: (preset: OmniQueryPreset) => void;
}

export const OmniComputeBar: React.FC<OmniComputeBarProps> = ({
  onSelectPreset,
}) => {
  const { simulateTouch } = useAcademicSystem();
  const [query, setQuery] = useState(OMNI_QUERY_PRESETS[0].query);
  const [activePreset, setActivePreset] = useState<OmniQueryPreset>(
    OMNI_QUERY_PRESETS[0]
  );
  const [showSymbolRibbon, setShowSymbolRibbon] = useState(false);

  const handlePresetClick = (preset: OmniQueryPreset) => {
    setActivePreset(preset);
    setQuery(preset.query);
    onSelectPreset?.(preset);
  };

  const evaluateCustomQuery = () => {
    // Parse live zeta=... and omega_0=... or omega0=... from user's query string
    const zetaMatch = query.match(/zeta\s*(?:=|->)\s*([0-9]*\.?[0-9]+)/i);
    const omegaMatch = query.match(/omega_?0\s*(?:=|->)\s*([0-9]*\.?[0-9]+)/i);

    const parsedZeta = zetaMatch
      ? Math.max(0.02, Math.min(2.0, parseFloat(zetaMatch[1])))
      : activePreset.zeta;
    const parsedOmega = omegaMatch
      ? Math.max(1.0, Math.min(8.0, parseFloat(omegaMatch[1])))
      : activePreset.omega0;

    const customPreset: OmniQueryPreset = {
      id:
        parsedZeta === activePreset.zeta && parsedOmega === activePreset.omega0
          ? activePreset.id
          : 'custom',
      label: `Custom (ζ = ${parsedZeta.toFixed(2)})`,
      query,
      interpretationLatex: `\\frac{d^2 x}{dt^2} + 2\\zeta\\omega_0\\frac{dx}{dt} + \\omega_0^2 x(t) = \\delta(t) \\quad (\\zeta = ${parsedZeta.toFixed(
        2
      )},\\; \\omega_0 = ${parsedOmega.toFixed(2)})`,
      zeta: parsedZeta,
      omega0: parsedOmega,
    };

    setActivePreset(customPreset);
    onSelectPreset?.(customPreset);
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
        border: '1px solid var(--ads-ink-hairline, #E3E1DB)',
        borderRadius: '7px',
        marginBottom: 'var(--ads-pod-gap, 22px)',
        boxShadow:
          '0 1px 2.5px rgba(20, 20, 19, 0.028), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '10px 16px',
          borderBottom: '1px solid oklch(0.94 0.004 82)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '20px',
            height: '20px',
            borderRadius: '4px',
            backgroundColor: 'oklch(0.975 0.015 32)',
            border: '1px solid oklch(0.90 0.025 32)',
            color: 'var(--ads-accent-compute, #D63E18)',
            fontFamily: 'var(--ads-font-mono)',
            fontWeight: 700,
            fontSize: '12px',
          }}
        >
          =
        </span>

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              evaluateCustomQuery();
            }
          }}
          aria-label="Symbolic or natural language scientific query"
          style={{
            flex: 1,
            border: 'none',
            outline: 'none',
            backgroundColor: 'transparent',
            fontFamily: 'var(--ads-font-mono, JetBrains Mono, monospace)',
            fontSize: '13px',
            color: 'var(--ads-ink-carbon, #141413)',
            minWidth: 0,
          }}
        />

        <button
          type="button"
          data-active={showSymbolRibbon || simulateTouch ? 'true' : 'false'}
          onClick={() => setShowSymbolRibbon((s) => !s)}
          className="ads-btn-instrument ads-interactive-target"
          title="Toggle Math Ribbon"
        >
          <Keyboard size={12} />
          <span>π/∫</span>
        </button>

        <button
          type="button"
          data-variant="compute"
          data-size="xs"
          onClick={evaluateCustomQuery}
          className="ads-btn ads-interactive-target"
          style={{ padding: '0 10px' }}
          title="Evaluate query and update coupled parameters (Enter)"
        >
          <span>Compute</span>
          <CornerDownLeft size={11} />
        </button>
      </div>

      {(showSymbolRibbon || simulateTouch) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            flexWrap: 'wrap',
            padding: '6px 16px',
            backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
            borderBottom: '1px solid oklch(0.94 0.004 82)',
          }}
        >
          {TOUCH_MATH_SYMBOLS.map((sym) => (
            <button
              key={sym.label}
              type="button"
              onClick={() => setQuery((q) => `${q} ${sym.insert}`)}
              className="ads-btn-instrument ads-interactive-target"
              style={{
                fontFamily: 'var(--ads-font-prose, serif)',
                fontSize: '13px',
              }}
            >
              {sym.label}
            </button>
          ))}
        </div>
      )}

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '8px 16px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span className="ads-eyebrow-mono">Interpreted as</span>
          <span style={{ fontSize: '14px' }}>
            <InlineMath latex={activePreset.interpretationLatex} />
          </span>
        </div>

        <div className="ads-pill-group">
          {OMNI_QUERY_PRESETS.map((preset) => {
            const isSelected = preset.id === activePreset.id;
            return (
              <button
                key={preset.id}
                type="button"
                data-active={isSelected ? 'true' : 'false'}
                className="ads-pill-btn"
                onClick={() => handlePresetClick(preset)}
              >
                {preset.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export const TensorBadge: React.FC<{ shape: string; dtype?: string }> = ({
  shape,
  dtype = 'Float64',
}) => (
  <span
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      height: '18px',
      padding: '0 6px',
      borderRadius: '3.5px',
      border: '1px solid oklch(0.91 0.005 82)',
      backgroundColor: '#FFFFFF',
      fontFamily: 'var(--ads-font-chrome)',
      fontVariantNumeric: 'tabular-nums',
      fontSize: '10.5px',
      color: 'var(--ads-ink-pencil, #85837D)',
    }}
  >
    <span style={{ color: 'var(--ads-ink-graphite)', fontWeight: 500 }}>[{shape}]</span>
    <span>·</span>
    <span>{dtype}</span>
  </span>
);

export interface CodeCellProps {
  cellNumber?: number;
  language?: string;
  zeta?: number;
  omega0?: number;
  customCode?: string;
  customOutput?: React.ReactNode;
  tensorShape?: string;
  tensorDtype?: string;
}

type KernelDialect = 'julia' | 'sympy' | 'wolfram';

export const CodeCell: React.FC<CodeCellProps> = ({
  cellNumber = 4,
  language = 'Julia 1.11 · DifferentialEquations.jl',
  zeta = 0.25,
  omega0 = 4.0,
  customCode,
  customOutput,
  tensorShape = '161×2',
  tensorDtype,
}) => {
  const { activeSymbolId, hoverSymbol, togglePinSymbol } = useAcademicSystem();
  const [dialect, setDialect] = useState<KernelDialect>('julia');
  const [runCount, setRunCount] = useState(cellNumber);
  const [runtimeMs, setRuntimeMs] = useState(14.2);
  const [isRunning, setIsRunning] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  const renderSymToken = (symId: string, codeText: string, slot: 1 | 2 | 3 | 4) => {
    const isActive = activeSymbolId === symId;
    const color = SYMBOL_SLOT_COLORS[slot];
    return (
      <span
        data-symbol-id={symId}
        data-symbol-active={isActive ? 'true' : 'false'}
        onMouseEnter={() => hoverSymbol(symId)}
        onMouseLeave={() => hoverSymbol(null)}
        onClick={() => togglePinSymbol(symId)}
        style={{
          backgroundColor: isActive ? color.bg : 'transparent',
          color: color.fg,
          padding: 0,
          margin: 0,
          borderRadius: '2px',
          borderBottom: `1.25px ${isActive ? 'solid' : 'dotted'} ${color.border}`,
          fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        {codeText}
      </span>
    );
  };

  const juliaLines: Array<{ num: number; indent: number; content: React.ReactNode }> = [
    {
      num: 1,
      indent: 0,
      content: (
        <>
          <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>using</span>{' '}
          DifferentialEquations, Symbolics
        </>
      ),
    },
    {
      num: 2,
      indent: 0,
      content: (
        <>
          {renderSymToken('zeta', 'ζ', 2)} ={' '}
          <span style={{ color: 'oklch(0.48 0.18 32)' }}>{zeta.toFixed(2)}</span>;{' '}
          {renderSymToken('omega0', 'ω₀', 1)} ={' '}
          <span style={{ color: 'oklch(0.42 0.16 255)' }}>{omega0.toFixed(2)}</span>;
        </>
      ),
    },
    {
      num: 3,
      indent: 0,
      content: (
        <>
          <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>function</span>{' '}
          {renderSymToken('kernel', 'greens_kernel', 4)}(t, τ)
        </>
      ),
    },
    {
      num: 4,
      indent: 1,
      content: (
        <>
          ω_d = {renderSymToken('omega0', 'ω₀', 1)} * sqrt(complex(1.0 -{' '}
          {renderSymToken('zeta', 'ζ', 2)}^2))
        </>
      ),
    },
    {
      num: 5,
      indent: 1,
      content: (
        <>
          <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>return</span>{' '}
          real(exp(-{renderSymToken('zeta', 'ζ', 2)} * {renderSymToken('omega0', 'ω₀', 1)} * (t - τ)) * sin(ω_d * (t - τ)) / ω_d)
        </>
      ),
    },
    {
      num: 6,
      indent: 0,
      content: (
        <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>end</span>
      ),
    },
    {
      num: 7,
      indent: 0,
      content: (
        <>
          {renderSymToken('energy', 'lyapunov_H', 3)}(x, v) = 0.5 * (v^2 +{' '}
          {renderSymToken('omega0', 'ω₀', 1)}^2 * x^2)
        </>
      ),
    },
  ];

  const sympyLines: Array<{ num: number; indent: number; content: React.ReactNode }> = [
    {
      num: 1,
      indent: 0,
      content: (
        <>
          <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>import</span>{' '}
          sympy <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>as</span> sp
        </>
      ),
    },
    {
      num: 2,
      indent: 0,
      content: (
        <>
          {renderSymToken('zeta', 'zeta', 2)}, {renderSymToken('omega0', 'omega_0', 1)} ={' '}
          <span style={{ color: 'oklch(0.48 0.18 32)' }}>{zeta.toFixed(2)}</span>,{' '}
          <span style={{ color: 'oklch(0.42 0.16 255)' }}>{omega0.toFixed(2)}</span>
        </>
      ),
    },
    {
      num: 3,
      indent: 0,
      content: (
        <>
          <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>def</span>{' '}
          {renderSymToken('kernel', 'greens_kernel', 4)}(t, tau):
        </>
      ),
    },
    {
      num: 4,
      indent: 1,
      content: (
        <>
          omega_d = {renderSymToken('omega0', 'omega_0', 1)} * sp.sqrt(1 -{' '}
          {renderSymToken('zeta', 'zeta', 2)}**2)
        </>
      ),
    },
    {
      num: 5,
      indent: 1,
      content: (
        <>
          <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>return</span>{' '}
          sp.exp(-{renderSymToken('zeta', 'zeta', 2)} * {renderSymToken('omega0', 'omega_0', 1)} * (t - tau)) * sp.sin(omega_d * (t - tau)) / omega_d
        </>
      ),
    },
    {
      num: 6,
      indent: 0,
      content: (
        <>
          {renderSymToken('energy', 'lyapunov_H', 3)} ={' '}
          <span style={{ color: 'oklch(0.45 0.16 310)', fontWeight: 500 }}>lambda</span> q, p: 0.5 * (p**2 +{' '}
          {renderSymToken('omega0', 'omega_0', 1)}**2 * q**2)
        </>
      ),
    },
  ];

  const wolframLines: Array<{ num: number; indent: number; content: React.ReactNode }> = [
    {
      num: 1,
      indent: 0,
      content: (
        <>
          {renderSymToken('zeta', 'ζ', 2)} ={' '}
          <span style={{ color: 'oklch(0.48 0.18 32)' }}>{zeta.toFixed(2)}</span>;{' '}
          {renderSymToken('omega0', 'ω0', 1)} ={' '}
          <span style={{ color: 'oklch(0.42 0.16 255)' }}>{omega0.toFixed(2)}</span>;
        </>
      ),
    },
    {
      num: 2,
      indent: 0,
      content: (
        <>
          {renderSymToken('kernel', 'GreensKernel', 4)}[t_, τ_] := Module[{'{'}ωd ={' '}
          {renderSymToken('omega0', 'ω0', 1)} Sqrt[1 - {renderSymToken('zeta', 'ζ', 2)}^2]{'}'},
        </>
      ),
    },
    {
      num: 3,
      indent: 1,
      content: (
        <>
          UnitStep[t - τ] Exp[-{renderSymToken('zeta', 'ζ', 2)} {renderSymToken('omega0', 'ω0', 1)} (t - τ)] Sin[ωd (t - τ)] / ωd
        </>
      ),
    },
    {
      num: 4,
      indent: 0,
      content: <>]</>,
    },
    {
      num: 5,
      indent: 0,
      content: (
        <>
          {renderSymToken('energy', 'HamiltonianH', 3)}[q_, p_] := (p^2 +{' '}
          {renderSymToken('omega0', 'ω0', 1)}^2 q^2) / 2
        </>
      ),
    },
  ];

  const customParsedLines = customCode
    ? customCode.split('\n').map((lineStr, idx) => ({
        num: idx + 1,
        indent: 0,
        content: <>{lineStr}</>,
      }))
    : null;

  const codeLines =
    customParsedLines ??
    (dialect === 'julia' ? juliaLines : dialect === 'sympy' ? sympyLines : wolframLines);

  const kernelTitle = customCode
    ? language
    : dialect === 'julia'
    ? language
    : dialect === 'sympy'
    ? 'Python 3.12 · SymPy 1.13 CAS'
    : 'Wolfram Kernel 14.1 · Symbolic ODE';

  const handleCopySource = () => {
    const raw =
      customCode ??
      (dialect === 'julia'
        ? `using DifferentialEquations, Symbolics\nζ = ${zeta.toFixed(2)}; ω₀ = ${omega0.toFixed(2)};\nfunction greens_kernel(t, τ)\n  ω_d = ω₀ * sqrt(complex(1.0 - ζ^2))\n  return real(exp(-ζ * ω₀ * (t - τ)) * sin(ω_d * (t - τ)) / ω_d)\nend\nlyapunov_H(x, v) = 0.5 * (v^2 + ω₀^2 * x^2)`
        : dialect === 'sympy'
        ? `import sympy as sp\nzeta, omega_0 = ${zeta.toFixed(2)}, ${omega0.toFixed(2)}\ndef greens_kernel(t, tau):\n    omega_d = omega_0 * sp.sqrt(1 - zeta**2)\n    return sp.exp(-zeta * omega_0 * (t - tau)) * sp.sin(omega_d * (t - tau)) / omega_d\nlyapunov_H = lambda q, p: 0.5 * (p**2 + omega_0**2 * q**2)`
        : `ζ = ${zeta.toFixed(2)}; ω0 = ${omega0.toFixed(2)};\nGreensKernel[t_, τ_] := Module[{ωd = ω0 Sqrt[1 - ζ^2]}, UnitStep[t - τ] Exp[-ζ ω0 (t - τ)] Sin[ωd (t - τ)] / ωd]\nHamiltonianH[q_, p_] := (p^2 + ω0^2 q^2) / 2`);
    navigator.clipboard?.writeText(raw);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 1500);
  };

  return (
    <div
      className="ads-code-block"
      style={{
        borderRadius: '6px',
        backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
        border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.75)',
        overflow: 'hidden',
        fontSize: 'var(--ads-mono-size, 12.5px)',
      }}
    >
      {/* Code Kernel Header (32px Precision Instrument Strip) */}
      <div
        className="ads-ui"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '32px',
          gap: '8px',
          padding: '4px 12px',
          background:
            'linear-gradient(180deg, oklch(0.985 0.003 83) 0%, oklch(0.972 0.004 82) 100%)',
          borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
          fontSize: '11.5px',
          color: 'var(--ads-ink-pencil, #82807A)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'oklch(0.52 0.14 160)',
              boxShadow: '0 0 0 2px oklch(0.52 0.14 160 / 0.16)',
            }}
          />
          <span style={{ color: 'var(--ads-ink-carbon, #141413)', fontWeight: 500 }}>
            {kernelTitle}
          </span>
          <TensorBadge
            shape={tensorShape}
            dtype={
              tensorDtype ??
              (dialect === 'sympy' ? 'SymPy.Expr' : dialect === 'wolfram' ? 'Real64' : 'Float64')
            }
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
          {/* Dialect Switcher (shown when using built-in multi-dialect specimen) */}
          {!customCode && (
            <div className="ads-pill-group">
              {(
                [
                  { id: 'julia', label: 'Julia' },
                  { id: 'sympy', label: 'SymPy' },
                  { id: 'wolfram', label: 'Wolfram' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-active={dialect === item.id ? 'true' : 'false'}
                  className="ads-pill-btn"
                  onClick={() => setDialect(item.id)}
                  style={{ height: '18px', fontSize: '10px', padding: '0 6px' }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}

          <span
            style={{
              fontFamily: 'var(--ads-font-chrome)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '11px',
              color: 'var(--ads-ink-pencil)',
            }}
          >
            {runtimeMs.toFixed(1)} ms
          </span>
          <button
            type="button"
            onClick={handleCopySource}
            title={`Copy ${dialect} source`}
            className="ads-btn-instrument"
            style={{ width: '22px', padding: 0 }}
          >
            {copiedCode ? <Check size={10} color="oklch(0.45 0.14 160)" /> : <Copy size={10} />}
          </button>
          <button
            type="button"
            data-active={isRunning ? 'true' : 'false'}
            className="ads-btn-instrument"
            onClick={() => {
              setIsRunning(true);
              setTimeout(() => {
                setRunCount((c) => c + 1);
                setRuntimeMs(Number((11 + Math.random() * 6).toFixed(1)));
                setIsRunning(false);
              }, 180);
            }}
          >
            <Play size={9} />
            <span>{isRunning ? 'Evaluating…' : 'Run'}</span>
            <span className="ads-kbd" style={{ height: '14px', fontSize: '9px', padding: '0 3px' }}>
              ⌘↵
            </span>
          </button>
        </div>
      </div>

      {/* Code Stage: Structured 2-Column Gutter + Character Grid (Zero Token Shift) */}
      <div
        style={{
          padding: '10px 0',
          overflowX: 'auto',
          color: 'var(--ads-ink-carbon, #141413)',
        }}
      >
        {codeLines.map((ln) => (
          <div
            key={ln.num}
            style={{
              display: 'grid',
              gridTemplateColumns: '38px 1fr',
              alignItems: 'baseline',
              lineHeight: '21px',
              paddingRight: '16px',
            }}
          >
            <span
              style={{
                textAlign: 'right',
                paddingRight: '12px',
                fontSize: '10.5px',
                color: '#A09E97',
                userSelect: 'none',
                borderRight: '1px solid oklch(0.925 0.004 82)',
              }}
            >
              {ln.num}
            </span>
            <span
              style={{
                paddingLeft: `${12 + ln.indent * 24}px`,
                whiteSpace: 'pre',
              }}
            >
              {ln.content}
            </span>
          </div>
        ))}
      </div>

      {/* Output Tray */}
      <div
        style={{
          borderTop: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
          padding: '8px 14px',
          backgroundColor: '#FFFFFF',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <span
            style={{
              fontFamily: 'var(--ads-font-chrome)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '10.5px',
              fontWeight: 500,
              padding: '1px 5px',
              borderRadius: '3px',
              border: '1px solid oklch(0.92 0.005 82)',
              backgroundColor: 'oklch(0.975 0.004 82)',
              color: 'var(--ads-ink-pencil, #82807A)',
            }}
          >
            Out[{runCount}] =
          </span>
          <span style={{ fontFamily: '"KaTeX_Main", var(--ads-font-prose, serif)', fontSize: '14.5px' }}>
            {customOutput ? (
              customOutput
            ) : (
              <InlineMath
                latex={`\\lambda_{1,2} = -${(zeta * omega0).toFixed(2)} ${
                  zeta <= 1
                    ? `\\pm ${(omega0 * Math.sqrt(1 - zeta * zeta)).toFixed(2)}\\mathrm{i}`
                    : `\\pm ${(omega0 * Math.sqrt(zeta * zeta - 1)).toFixed(2)}`
                }, \\qquad \\dot{\\mathcal{H}} = -${(2 * zeta * omega0).toFixed(2)}\\,\\dot{x}^2 \\le 0`}
              />
            )}
          </span>
        </div>

        <span
          style={{
            fontFamily: 'var(--ads-font-chrome)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: '10.5px',
            color: 'var(--ads-ink-pencil, #82807A)',
          }}
        >
          0 allocs · Wronskian err &lt; 10⁻¹⁶ ✓
        </span>
      </div>
    </div>
  );
};

export const GroundedAIChat: React.FC = () => {
  const [traceExpanded, setTraceExpanded] = useState(false);
  const [patchAccepted, setPatchAccepted] = useState(false);
  const [activeCorollary, setActiveCorollary] = useState<'qfactor' | 'wkb'>('qfactor');

  return (
    <div
      className="ads-prose"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
        fontSize: '15.5px',
        lineHeight: 1.62,
        color: 'var(--ads-ink-carbon, #141413)',
      }}
    >
      <div
        className="ads-ui"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          flexWrap: 'wrap',
          fontSize: '12px',
        }}
      >
        <button
          type="button"
          data-active={traceExpanded ? 'true' : 'false'}
          className="ads-btn-instrument"
          onClick={() => setTraceExpanded((v) => !v)}
        >
          {traceExpanded ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
          <span>Verified via SymPy CAS · 3 steps (240 ms)</span>
        </button>

        <div className="ads-pill-group">
          <button
            type="button"
            data-active={activeCorollary === 'qfactor' ? 'true' : 'false'}
            className="ads-pill-btn"
            onClick={() => setActiveCorollary('qfactor')}
            style={{ height: '20px', fontSize: '10.5px' }}
          >
            Cor. 2.1.1 (Q-Factor)
          </button>
          <button
            type="button"
            data-active={activeCorollary === 'wkb' ? 'true' : 'false'}
            className="ads-pill-btn"
            onClick={() => setActiveCorollary('wkb')}
            style={{ height: '20px', fontSize: '10.5px' }}
          >
            Cor. 2.1.2 (Adiabatic Invariant)
          </button>
        </div>
      </div>

      {traceExpanded && (
        <div
          className="ads-ui"
          style={{
            padding: '10px 14px',
            borderRadius: '5px',
            backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
            border: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            fontSize: '12px',
            color: 'var(--ads-ink-graphite, #4E4D49)',
          }}
        >
          <div>1. Matched symplectic dissipation in Arnold (1989), §4.2.</div>
          <div>
            2. Simplified <InlineMath latex="\dot{\mathcal{H}} = -2\zeta\omega_0 \dot{x}^2" />.
          </div>
          <div>
            3. Verified dimensional units <InlineMath latex="[G(t-\tau)] = \text{s}\cdot\text{kg}^{-1}" />.
          </div>
          <div
            style={{
              marginTop: '2px',
              paddingTop: '6px',
              borderTop: '1px dashed oklch(0.90 0.005 82)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              fontFamily: 'var(--ads-font-mono)',
              fontSize: '11px',
              color: 'oklch(0.42 0.14 160)',
            }}
          >
            <span>simplify(diff(H, t) + 2*zeta*omega_0*v**2) == 0</span>
            <span style={{ fontWeight: 600 }}>CAS Residual: 0 ✓</span>
          </div>
        </div>
      )}

      <div>
        Differentiating the Hamiltonian energy functional{' '}
        <Sym id="energy" math="\mathcal{H}(q, p)" /> along trajectories of{' '}
        <CrossRef to="eq:greens" /> shows that phase-space volume contracts at
        constant rate <InlineMath latex="\nabla \cdot \mathbf{F} = -2\zeta\omega_0" />{' '}
        <Cite id="arnold1989" mode="author-year" />.
      </div>

      <div
        style={{
          border: '1px solid var(--ads-ink-hairline, #E3E1DB)',
          borderRadius: '6px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          padding: '12px 14px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontFamily: 'var(--ads-font-chrome, Inter, sans-serif)',
            fontSize: '12px',
          }}
        >
          <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-ink-graphite)' }}>
            Proposed Patch ·{' '}
            {activeCorollary === 'qfactor' ? 'Corollary 2.1.1' : 'Corollary 2.1.2'}
          </span>

          <button
            type="button"
            data-active={patchAccepted ? 'true' : 'false'}
            className="ads-btn-instrument"
            onClick={() => setPatchAccepted((p) => !p)}
          >
            {patchAccepted ? 'Applied ✓' : 'Insert Corollary'}
          </button>
        </div>

        <div
          style={{
            padding: '10px 14px',
            borderRadius: '5px',
            backgroundColor: '#FFFFFF',
            borderLeft: '2.5px solid var(--ads-accent-reference, #1E56A0)',
            fontFamily: 'var(--ads-font-prose, serif)',
            fontSize: '14.5px',
          }}
        >
          {activeCorollary === 'qfactor' ? (
            <>
              <span className="ads-smallcaps" style={{ fontWeight: 700 }}>
                Corollary 2.1.1 (Q-Factor).{' '}
              </span>
              <span style={{ fontStyle: 'italic' }}>
                For weak damping, the resonant quality factor satisfies{' '}
                <InlineMath latex="Q = \frac{1}{2\zeta} = \frac{\omega_0}{\Delta\omega_{\text{FWHM}}}" />.
              </span>
            </>
          ) : (
            <>
              <span className="ads-smallcaps" style={{ fontWeight: 700 }}>
                Corollary 2.1.2 (Damped Action Invariant).{' '}
              </span>
              <span style={{ fontStyle: 'italic' }}>
                Along underdamped orbits, the scaled symplectic action{' '}
                <InlineMath latex="I(t) = e^{2\zeta\omega_0 t}\,\oint p\,dq" /> is
                adiabatically invariant to <InlineMath latex="\mathcal{O}(\zeta^2)" />.
              </span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
