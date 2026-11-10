import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  BookOpen,
  Layers,
  Cpu,
  Sparkles,
  Copy,
  Check,
  Compass,
  Terminal,
  Eye,
} from 'lucide-react';
import {
  useAcademicSystem,
  SYMBOL_SLOT_COLORS,
  ChromingMode,
  DensityMode,
  MaterialPreset,
} from '../core/registry';
import {
  DocPageId,
  StoryComponentId,
  PrototypeAppId,
} from './navigation';
import { Scrubber } from '../primitives/compute/Manipulate';
import {
  Sym,
  InlineMath,
  EquationBlock,
  FormalBlock,
} from '../primitives/manuscript/MathAndFormal';
import { Cite, CrossRef } from '../primitives/manuscript/CitationsAndRefs';
import {
  Sparkline,
  PhaseSpaceCanvas,
  ComplexPlaneCanvas,
  UnitValue,
} from '../primitives/datavis/ScienceAndVis';

export interface MarketingLandingPageProps {
  onNavigateDoc: (doc: DocPageId) => void;
  onNavigateStory: (story: StoryComponentId) => void;
  onNavigatePrototype: (proto: PrototypeAppId) => void;
}

export const MarketingLandingPage: React.FC<MarketingLandingPageProps> = ({
  onNavigateDoc,
  onNavigateStory,
  onNavigatePrototype,
}) => {
  const {
    symbols,
    activeSymbolId,
    hoverSymbol,
    togglePinSymbol,
    chroming,
    setChroming,
    density,
    setDensity,
    material,
    setMaterial,
    xrayBaseline,
    setXrayBaseline,
  } = useAcademicSystem();

  const [zeta, setZeta] = useState<number>(0.22);
  const [omega0, setOmega0] = useState<number>(4.2);
  const [opticalSizeDemo, setOpticalSizeDemo] = useState<number>(42);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  const handleCopyCli = () => {
    navigator.clipboard?.writeText(
      'bun add @principia/core katex @stylexjs/stylex'
    );
    setCopiedCli(true);
    window.setTimeout(() => setCopiedCli(false), 1600);
  };

  // Compute live phase-space spiral and complex poles for the Hero Interactive Workbench
  const heroDynamics = useMemo(() => {
    const N = 140;
    const tMax = 6.0;
    const disc = 1 - zeta * zeta;
    const wd = omega0 * Math.sqrt(Math.max(0.001, Math.abs(disc)));
    const trajectory: Array<{ x: number; y: number }> = [];
    const waveform: number[] = [];

    for (let i = 0; i < N; i++) {
      const t = (i / (N - 1)) * tMax;
      const env = Math.exp(-zeta * omega0 * t);
      const x =
        zeta < 1
          ? env * (Math.cos(wd * t) + (zeta / Math.sqrt(disc)) * Math.sin(wd * t))
          : env * (1 + omega0 * t);
      const v =
        zeta < 1
          ? -env * ((omega0 / Math.sqrt(disc)) * Math.sin(wd * t))
          : -omega0 * omega0 * t * env;
      trajectory.push({ x, y: v / omega0 });
      if (i % 3 === 0) waveform.push(x);
    }

    const poles =
      zeta < 1
        ? [
            { re: -zeta * omega0, im: wd, label: 's₁' },
            { re: -zeta * omega0, im: -wd, label: 's₂' },
          ]
        : [
            { re: -omega0 * (zeta - Math.sqrt(zeta * zeta - 1)), im: 0, label: 's₁' },
            { re: -omega0 * (zeta + Math.sqrt(zeta * zeta - 1)), im: 0, label: 's₂' },
          ];

    return { trajectory, waveform, poles };
  }, [zeta, omega0]);

  return (
    <div style={{ width: '100%' }}>
      {/* ====================================================================
          SECTION 1: HERO — EDITORIAL MONOGRAPH × PRECISION INSTRUMENT
          ==================================================================== */}
      <section
        style={{
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.995 0.004 82) 0%, var(--ads-paper-canvas, #FBF9F6) 100%)',
          padding: '48px 32px 56px 32px',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          {/* Top Eyebrow Strip */}
          <div
            className="ads-ui"
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              <span className="ads-badge-domain" style={{ height: '22px', padding: '0 8px' }}>
                <span
                  style={{
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--ads-accent-compute, #D63E18)',
                    boxShadow: '0 0 0 2px oklch(0.55 0.19 32 / 0.18)',
                  }}
                />
                PRINCIPIA DESIGN SYSTEM · @principia/core v2.4
              </span>
              <span className="ads-eyebrow-mono">
                LaTeX · Wolfram Alpha · Linear · Tufte
              </span>
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={handleCopyCli}
                className="ads-btn-instrument"
                style={{ height: '24px', padding: '0 10px' }}
                title="Copy install command"
              >
                <Terminal size={11} color="var(--ads-accent-compute)" />
                <code
                  style={{
                    fontFamily: 'var(--ads-font-mono)',
                    fontSize: '11px',
                    color: 'var(--ads-ink-carbon)',
                  }}
                >
                  bun add @principia/core katex @stylexjs/stylex
                </code>
                {copiedCli ? (
                  <Check size={11} color="oklch(0.45 0.14 160)" />
                ) : (
                  <Copy size={11} color="var(--ads-ink-pencil)" />
                )}
              </button>
            </div>
          </div>

          {/* Hero Split Layout: Left Editorial Pitch + Right Live Interactive Workbench */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
              gap: '40px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Sculptural Headline & Primary CTAs */}
            <div>
              <h1
                className="ads-display-title"
                style={{
                  fontSize: 'clamp(32px, 3.5vw, 44px)',
                  lineHeight: 1.12,
                  letterSpacing: '-0.025em',
                  margin: '0 0 18px 0',
                }}
              >
                Where the editorial monograph meets the precision instrument.
              </h1>

              <p
                className="ads-prose"
                style={{
                  fontSize: '16.5px',
                  lineHeight: 1.65,
                  color: 'var(--ads-ink-graphite, #4E4D49)',
                  margin: '0 0 26px 0',
                }}
              >
                An opinionated, light-mode universal design system engineered for scientific
                computing, mathematical manuscripts, high-density data visualization, and
                CAS-verified AI research workbenches. Built on a strict{' '}
                <strong>Dual-Register Typographic Architecture</strong> that pairs optical-size
                variable serifs with tactile Linear-grade hardware controls.
              </p>

              {/* Primary Navigation CTAs */}
              <div
                className="ads-ui"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '32px',
                }}
              >
                <button
                  type="button"
                  data-variant="primary"
                  data-size="md"
                  onClick={() => onNavigatePrototype('ai-evals')}
                  className="ads-btn"
                >
                  <span>Explore App Prototypes (5)</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  type="button"
                  data-variant="secondary"
                  data-size="md"
                  onClick={() => onNavigateDoc('getting-started')}
                  className="ads-btn"
                >
                  <BookOpen size={13} color="var(--ads-accent-reference)" />
                  <span>Design System Docs</span>
                </button>

                <button
                  type="button"
                  data-variant="secondary"
                  data-size="md"
                  onClick={() => onNavigateStory('buttons-badges')}
                  className="ads-btn"
                >
                  <Layers size={13} color="var(--ads-accent-compute)" />
                  <span>Component Storybook (16)</span>
                </button>
              </div>

              {/* Quick Telemetry Metrics Strip */}
              <div
                className="ads-ui"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: '12px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                }}
              >
                {[
                  { k: '2 Registers', v: 'Editorial × Instrument' },
                  { k: '4px Sub-Grid', v: '18px–44px Controls' },
                  { k: '8 OKLCH Slots', v: 'Multiply Ink Bus' },
                  { k: '12 Primitives', v: 'Pods, Plots & Proofs' },
                ].map((stat) => (
                  <div key={stat.k}>
                    <div
                      style={{
                        fontSize: '13px',
                        fontWeight: 600,
                        color: 'var(--ads-ink-carbon)',
                      }}
                    >
                      {stat.k}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                      {stat.v}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Live Interactive Coupled Hero Instrument */}
            <div
              className="ads-pod-container"
              data-mode="framed"
              style={{
                position: 'relative',
                backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                borderRadius: '7px',
                boxShadow:
                  '0 10px 30px -8px rgba(20, 20, 19, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.9)',
                overflow: 'hidden',
              }}
            >
              {/* Live Hero Instrument Header */}
              <div
                className="ads-ui"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '8px 16px',
                  background:
                    'linear-gradient(180deg, oklch(0.996 0.002 85) 0%, oklch(0.986 0.003 83) 100%)',
                  borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span className="ads-badge-domain">
                    <span
                      style={{
                        width: '5px',
                        height: '5px',
                        borderRadius: '50%',
                        backgroundColor: 'oklch(0.52 0.14 160)',
                      }}
                    />
                    INTERACTIVE SPECIMEN
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                    Coupled Prose ↔ Math ↔ Symplectic Phase Space
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Sparkline
                    data={heroDynamics.waveform}
                    domain={[-1, 1]}
                    width={64}
                    height={18}
                    color="oklch(0.42 0.16 255)"
                  />
                  <span className="ads-badge-domain">60 FPS</span>
                </div>
              </div>

              {/* Hero Specimen Stage */}
              <div style={{ padding: '14px 16px' }}>
                <div className="ads-prose" style={{ fontSize: '14.5px', marginBottom: '8px' }}>
                  Drag the inline Vernier scrubbers for damping ratio{' '}
                  <Scrubber
                    symbolId="zeta"
                    symbolLatex="\zeta"
                    value={zeta}
                    min={0.05}
                    max={1.5}
                    step={0.01}
                    onChange={setZeta}
                  />{' '}
                  and eigenfrequency{' '}
                  <Scrubber
                    symbolId="omega0"
                    symbolLatex="\omega_0"
                    value={omega0}
                    min={1.5}
                    max={7.5}
                    step={0.1}
                    unit="rad/s"
                    onChange={setOmega0}
                  />{' '}
                  or hover any symbol (<Sym id="zeta" math="\zeta" />,{' '}
                  <Sym id="omega0" math="\omega_0" />,{' '}
                  <Sym id="energy" math="\mathcal{H}(q,p)" />) to witness cross-representation
                  highlighting <Cite id="arnold1989" />:
                </div>

                <EquationBlock
                  id="eq:greens"
                  number="1.1"
                  latex={`\\frac{d}{dt}\\mathcal{H}(q,p) = -2\\zeta\\omega_0 p^2 = -${(
                    2 *
                    zeta *
                    omega0
                  ).toFixed(2)}\\,p^2 \\le 0`}
                  referencedSymbols={['zeta', 'omega0', 'energy']}
                />

                {/* Dual Canvas Row: Symplectic Phase Portrait + Complex s-Plane */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                    gap: '10px',
                    marginTop: '10px',
                  }}
                >
                  <div
                    style={{
                      padding: '8px',
                      borderRadius: '5px',
                      backgroundColor: 'var(--ads-paper-canvas)',
                      border: '1px solid var(--ads-ink-whisper)',
                    }}
                  >
                    <div
                      className="ads-ui"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        color: 'var(--ads-ink-graphite)',
                        marginBottom: '4px',
                      }}
                    >
                      <span>a. Phase Space (q, p/ω₀)</span>
                      <span style={{ color: 'var(--ads-ink-pencil)' }}>Quiver F(q,p)</span>
                    </div>
                    <PhaseSpaceCanvas
                      width={235}
                      height={175}
                      xDomain={[-1.25, 1.25]}
                      yDomain={[-1.25, 1.25]}
                      xAxisLabel="q(t)"
                      yAxisLabel="p / ω₀"
                      trajectory={heroDynamics.trajectory}
                      activePoint={heroDynamics.trajectory[18]}
                      showQuiver
                      vectorField={(x, y) => [y, -x - 2 * zeta * y]}
                    />
                  </div>

                  <div
                    style={{
                      padding: '8px',
                      borderRadius: '5px',
                      backgroundColor: 'var(--ads-paper-canvas)',
                      border: '1px solid var(--ads-ink-whisper)',
                    }}
                  >
                    <div
                      className="ads-ui"
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '10.5px',
                        fontWeight: 600,
                        color: 'var(--ads-ink-graphite)',
                        marginBottom: '4px',
                      }}
                    >
                      <span>b. Complex s-Plane Poles</span>
                      <span style={{ color: 'var(--ads-ink-pencil)' }}>
                        Re(λ) = −{(zeta * omega0).toFixed(2)}
                      </span>
                    </div>
                    <ComplexPlaneCanvas
                      width={235}
                      height={175}
                      zeta={zeta}
                      omega0={omega0}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 2: 4-PILLAR ARCHITECTURAL BENTO GRID
          ==================================================================== */}
      <section
        style={{
          padding: '52px 32px',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          backgroundColor: 'var(--ads-paper-desk, #F5F3EE)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ marginBottom: '28px' }}>
            <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)', marginBottom: '6px' }}>
              ARCHITECTURAL FOUNDATIONS
            </div>
            <h2
              className="ads-display-title"
              style={{ fontSize: '26px', margin: '0 0 6px 0' }}
            >
              Four pillars of a scientific design system.
            </h2>
            <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
              Every token, optical size axis, and interactive primitive in{' '}
              <code className="ads-inline-code">@principia/core</code> is purpose-built for
              symbolic, empirical, and formal reasoning.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
              gap: '22px',
            }}
          >
            {/* BENTO 1: Dual-Register Typography & Live Optical Size Lab */}
            <div
              style={{
                padding: '22px 24px',
                borderRadius: '7px',
                backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                boxShadow: '0 1px 3px rgba(20,20,19,0.03), inset 0 1px 0 #FFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div
                  className="ads-ui"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)' }}>
                    01 · DUAL-REGISTER TYPOGRAPHY
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateDoc('typography')}
                    className="ads-btn-instrument"
                  >
                    <span>Typography Spec</span>
                    <ArrowRight size={10} />
                  </button>
                </div>

                <h3 className="ads-section-heading" style={{ margin: '0 0 6px 0' }}>
                  Optical-Size Editorial Serif × Tabular Instrument Sans
                </h3>
                <p className="ads-prose" style={{ fontSize: '15px', color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  We eliminate the anti-pattern of using monospace fonts for UI chrome.{' '}
                  <strong>Register I</strong> pairs <em>Newsreader</em> (<code className="ads-inline-code">opsz 6..72</code>)
                  with <InlineMath latex="\KaTeX" />; <strong>Register II</strong> uses{' '}
                  <em>Inter</em> (<code className="ads-inline-code">tabular-nums</code>) for
                  instrument readouts and restricts <em>JetBrains Mono</em> to executable code.
                </p>
              </div>

              {/* Interactive Optical Size Slider Specimen */}
              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                  border: '1px solid var(--ads-ink-whisper)',
                }}
              >
                <div
                  className="ads-ui"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '8px',
                    fontSize: '11.5px',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>
                    Interactive Variable Optical Axis (<code className="ads-inline-code">opsz {opticalSizeDemo}</code>)
                  </span>
                  <input
                    type="range"
                    className="ads-range-slider"
                    style={{ width: '120px' }}
                    min={12}
                    max={60}
                    step={2}
                    value={opticalSizeDemo}
                    onChange={(e) => setOpticalSizeDemo(Number(e.target.value))}
                  />
                </div>
                <div
                  style={{
                    fontFamily: 'var(--ads-font-display)',
                    fontVariationSettings: `'opsz' ${opticalSizeDemo}`,
                    fontSize: `${Math.max(17, Math.min(30, opticalSizeDemo * 0.62))}px`,
                    lineHeight: 1.2,
                    color: 'var(--ads-ink-carbon)',
                    transition: 'font-size 80ms ease',
                  }}
                >
                  § 1. Spectral Dissipation &amp; Hamiltonian Flow{' '}
                  <InlineMath latex="\mathcal{H}(q,p)" />
                </div>
              </div>
            </div>

            {/* BENTO 2: Coupled L2 SymbolRegistry Bus & 8-Slot Subtractive Ink */}
            <div
              style={{
                padding: '22px 24px',
                borderRadius: '7px',
                backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                boxShadow: '0 1px 3px rgba(20,20,19,0.03), inset 0 1px 0 #FFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div
                  className="ads-ui"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)' }}>
                    02 · L2 COUPLED SYMBOL REGISTRY BUS
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateDoc('symbol-bus')}
                    className="ads-btn-instrument"
                  >
                    <span>Symbol Bus Spec</span>
                    <ArrowRight size={10} />
                  </button>
                </div>

                <h3 className="ads-section-heading" style={{ margin: '0 0 6px 0' }}>
                  8-Slot Subtractive OKLCH Washes Across Prose, Math &amp; AST Code
                </h3>
                <p className="ads-prose" style={{ fontSize: '15px', color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  Hovering or pinning any variable broadcasts its ID across the{' '}
                  <code className="ads-inline-code">SymbolRegistry</code> bus, illuminating matching
                  tokens in prose, <InlineMath latex="\KaTeX" /> display blocks, SVG curves, and
                  Julia/SymPy AST cells using <code className="ads-inline-code">mix-blend-mode: multiply</code>.
                </p>
              </div>

              <div
                className="ads-ui"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
                  gap: '6px',
                }}
              >
                {Object.values(symbols).map((sym) => {
                  const slot = SYMBOL_SLOT_COLORS[sym.slot];
                  const isAct = activeSymbolId === sym.id;
                  return (
                    <button
                      key={sym.id}
                      type="button"
                      onMouseEnter={() => hoverSymbol(sym.id)}
                      onMouseLeave={() => hoverSymbol(null)}
                      onClick={() => togglePinSymbol(sym.id)}
                      style={{
                        padding: '8px',
                        borderRadius: '5px',
                        backgroundColor: slot.bg,
                        border: `1px solid ${isAct ? slot.fg : slot.border}`,
                        color: slot.fg,
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '13px' }}>
                        <InlineMath latex={sym.latex} />
                      </div>
                      <div style={{ fontSize: '10.5px', fontWeight: 600, marginTop: '2px' }}>
                        {sym.name}
                      </div>
                      <div style={{ fontSize: '9.5px', opacity: 0.8 }}>
                        Slot #{sym.slot} · {slot.label}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BENTO 3: 3 Orthogonal Customization Axes */}
            <div
              style={{
                padding: '22px 24px',
                borderRadius: '7px',
                backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                boxShadow: '0 1px 3px rgba(20,20,19,0.03), inset 0 1px 0 #FFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div
                  className="ads-ui"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)' }}>
                    03 · ORTHOGONAL CUSTOMIZATION MATRIX
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateDoc('colors-materiality')}
                    className="ads-btn-instrument"
                  >
                    <span>Tokens &amp; Axes</span>
                    <ArrowRight size={10} />
                  </button>
                </div>

                <h3 className="ads-section-heading" style={{ margin: '0 0 6px 0' }}>
                  Chroming × Density × Materiality (27 Live Configurations)
                </h3>
                <p className="ads-prose" style={{ fontSize: '15px', color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  A single React component tree morphs cleanly between a Wolfram computational
                  sheet (<code className="ads-inline-code">framed</code>), an arXiv monograph (
                  <code className="ads-inline-code">seamless</code>), or a Mathematica notebook (
                  <code className="ads-inline-code">bracketed</code>). Test them live across the
                  entire app:
                </p>
              </div>

              <div
                className="ads-ui"
                style={{
                  padding: '10px 12px',
                  borderRadius: '6px',
                  backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                  border: '1px solid var(--ads-ink-whisper)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                }}
              >
                <div className="ads-prop-row">
                  <span style={{ fontWeight: 500 }}>Chroming Axis</span>
                  <div className="ads-pill-group">
                    {(['framed', 'seamless', 'bracketed'] as const).map((c) => (
                      <button
                        key={c}
                        type="button"
                        data-active={chroming === c ? 'true' : 'false'}
                        className="ads-pill-btn"
                        onClick={() => setChroming(c as ChromingMode)}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ads-prop-row">
                  <span style={{ fontWeight: 500 }}>Density Scale</span>
                  <div className="ads-pill-group">
                    {(['manuscript', 'workbench', 'compact'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        data-active={density === d ? 'true' : 'false'}
                        className="ads-pill-btn"
                        onClick={() => setDensity(d as DensityMode)}
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="ads-prop-row">
                  <span style={{ fontWeight: 500 }}>Paper Materiality</span>
                  <div className="ads-pill-group">
                    {(
                      [
                        { id: 'archival-wolfram', label: 'Archival' },
                        { id: 'swiss-lab', label: 'Swiss' },
                        { id: 'oxford-monograph', label: 'Oxford Sepia' },
                      ] as const
                    ).map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        data-active={material === m.id ? 'true' : 'false'}
                        className="ads-pill-btn"
                        onClick={() => setMaterial(m.id as MaterialPreset)}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* BENTO 4: Formal Environments, Non-Jumping Lenses & Dimensional Units */}
            <div
              style={{
                padding: '22px 24px',
                borderRadius: '7px',
                backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                boxShadow: '0 1px 3px rgba(20,20,19,0.03), inset 0 1px 0 #FFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: '14px',
              }}
            >
              <div>
                <div
                  className="ads-ui"
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '8px',
                  }}
                >
                  <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)' }}>
                    04 · FORMAL ENVIRONMENTS &amp; PROVENANCE LENSES
                  </span>
                  <button
                    type="button"
                    onClick={() => onNavigateStory('formal-proof')}
                    className="ads-btn-instrument"
                  >
                    <span>Open in Storybook</span>
                    <ArrowRight size={10} />
                  </button>
                </div>

                <h3 className="ads-section-heading" style={{ margin: '0 0 6px 0' }}>
                  First-Class Theorems, Halmos Proofs &amp; Dimensional Unit Cyclers
                </h3>
                <p className="ads-prose" style={{ fontSize: '15px', color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  Hovering <CrossRef to="eq:greens" /> or <Cite id="arnold1989" /> opens a frosted
                  archival glass lens without losing scroll context. Click dimensional quantities
                  like{' '}
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
                        unitLatex: 'eV (ℏ=1)',
                      },
                    ]}
                  />{' '}
                  to cycle unit systems inline.
                </p>
              </div>

              <FormalBlock
                variant="theorem"
                number="2.1"
                title="Symplectic Area Contraction"
              >
                Every trajectory of the dissipative harmonic flow with{' '}
                <Sym id="zeta" math="\zeta > 0" /> contracts canonical phase-space volume at exact
                rate <InlineMath latex={`-2\\zeta\\omega_0 = -${(2 * zeta * omega0).toFixed(2)}\\text{ s}^{-1}`} />.
              </FormalBlock>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: LIVE INTERACTIVE PROTOTYPE SUITE LAUNCHPAD (4 APPS)
          ==================================================================== */}
      <section
        style={{
          padding: '52px 32px',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          backgroundColor: 'var(--ads-paper-canvas, #FBF9F6)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-end',
              justifyContent: 'space-between',
              gap: '16px',
              marginBottom: '28px',
            }}
          >
            <div>
              <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)', marginBottom: '6px' }}>
                MULTI-DOMAIN APPLICATION PROTOTYPES
              </div>
              <h2 className="ads-display-title" style={{ fontSize: '26px', margin: '0 0 6px 0' }}>
                Five distinct industry application concepts. One design system.
              </h2>
              <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                Launch any of the five production-grade application concepts below—spanning AI Evaluation SaaS,
                Quantitative Macro Finance, Clinical Biostatistics, Physics Simulation, and Symbolic CAS—all built on{' '}
                <code className="ads-inline-code">@principia/core</code>.
              </p>
            </div>

            <button
              type="button"
              data-active={xrayBaseline ? 'true' : 'false'}
              onClick={() => setXrayBaseline(!xrayBaseline)}
              className="ads-btn-instrument"
            >
              <Eye size={11} />
              <span>{xrayBaseline ? 'Disable 1rlh X-Ray' : 'Preview 1rlh Baseline Laser'}</span>
            </button>
          </div>

          <div
            className="ads-ui"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(225px, 1fr))',
              gap: '14px',
            }}
          >
            {(
              [
                {
                  id: 'ai-evals' as PrototypeAppId,
                  badge: 'AI ENGINEERING SAAS',
                  title: '1. EvalBench AI Observatory',
                  subtitle: 'Frontier Model Benchmarking & Compute Pareto',
                  axes: 'Generalist Foundation + Pareto Canvas + Trace Inspector',
                  description:
                    'Compare frontier LLMs across MMLU-Pro, GPQA Diamond, and MATH-500 with live test-time compute scaling curves and formal Lean 4 verifier logs.',
                  accent: 'var(--ads-accent-compute, #D63E18)',
                  icon: <Cpu size={14} color="var(--ads-accent-compute)" />,
                },
                {
                  id: 'quant-macro' as PrototypeAppId,
                  badge: 'FINTECH & MACRO QUANT',
                  title: '2. Meridian Risk Terminal',
                  subtitle: 'Yield Curve Fitting, Greeks & Stress Var',
                  axes: 'Nelson–Siegel Curve + Rate Shock Scrubbers + Booktabs',
                  description:
                    'Interactive sovereign Treasury yield curve desk with instantaneous parallel rate shocks, VIX volatility regimes, and multi-asset DV01 / CVaR attribution.',
                  accent: 'oklch(0.45 0.145 255)',
                  icon: <Layers size={14} color="oklch(0.45 0.145 255)" />,
                },
                {
                  id: 'biomed-trials' as PrototypeAppId,
                  badge: 'CLINICAL BIOSTATISTICS',
                  title: '3. Helix Phase III Studio',
                  subtitle: 'Kaplan–Meier Survival & Subgroup Stratification',
                  axes: 'Survival Curves + Cox Proportional Hazards + NEJM Ledger',
                  description:
                    'Oncology clinical trial workbench with 36-month progression-free survival curves, PD-L1 biomarker cohort filters, and log-rank significance verification.',
                  accent: 'oklch(0.46 0.14 160)',
                  icon: <Sparkles size={14} color="oklch(0.46 0.14 160)" />,
                },
                {
                  id: 'principia' as PrototypeAppId,
                  badge: 'PHYSICS SIMULATION',
                  title: '4. Principia Dynamical Lab',
                  subtitle: 'Damped Oscillator, Quantum Wells & Lotka–Volterra',
                  axes: 'Hybrid Monograph + Parameter Deck + AI Copilot',
                  description:
                    'Interactive physical systems treatise with live phase-space portraits, eigenvalue solvers, and CAS-verified symbolic corollary insertion.',
                  accent: 'oklch(0.48 0.16 310)',
                  icon: <Compass size={14} color="oklch(0.48 0.16 310)" />,
                },
                {
                  id: 'wolfram' as PrototypeAppId,
                  badge: 'SYMBOLIC CAS & IDE',
                  title: '5. The Codex (3 Archetypes)',
                  subtitle: 'Wolfram Engine · Tufte Monograph · Julia IDE',
                  axes: '3-in-1 Switchable Computational Publishing Suite',
                  description:
                    'Switch seamlessly between a Wolfram-style Pod Engine, a borderless 65ch + 28ch Tufte LaTeX Monograph, and a bracketed Julia/SymPy Notebook IDE.',
                  accent: 'oklch(0.52 0.14 75)',
                  icon: <BookOpen size={14} color="oklch(0.52 0.14 75)" />,
                },
              ] as const
            ).map((proto) => (
              <div
                key={proto.id}
                onClick={() => onNavigatePrototype(proto.id)}
                style={{
                  padding: '18px 20px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                  border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                  borderTop: `3px solid ${proto.accent}`,
                  boxShadow: '0 2px 6px rgba(20,20,19,0.03), inset 0 1px 0 #FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '14px',
                  cursor: 'pointer',
                  transition: 'transform 120ms ease, box-shadow 120ms ease',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '10px',
                    }}
                  >
                    <span className="ads-badge-domain">{proto.badge}</span>
                    {proto.icon}
                  </div>

                  <h3
                    className="ads-section-heading"
                    style={{ fontSize: '18px', margin: '0 0 3px 0' }}
                  >
                    {proto.title}
                  </h3>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 500,
                      color: 'var(--ads-ink-pencil)',
                      marginBottom: '10px',
                    }}
                  >
                    {proto.subtitle}
                  </div>
                  <p
                    style={{
                      fontSize: '12.5px',
                      lineHeight: 1.5,
                      color: 'var(--ads-ink-graphite)',
                      margin: '0 0 12px 0',
                    }}
                  >
                    {proto.description}
                  </p>
                </div>

                <div>
                  <div
                    style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--ads-paper-well)',
                      fontSize: '10.5px',
                      color: 'var(--ads-ink-graphite)',
                      marginBottom: '10px',
                    }}
                  >
                    {proto.axes}
                  </div>
                  <button
                    type="button"
                    data-variant="tonal"
                    data-size="sm"
                    className="ads-btn"
                    style={{ width: '100%', justifyContent: 'space-between', padding: '0 10px' }}
                  >
                    <span>Open Live Prototype</span>
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: COMPONENT DIRECTORY & SITEMAP FOOTER
          ==================================================================== */}
      <footer
        className="ads-ui"
        style={{
          padding: '40px 28px 56px 28px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          fontSize: '12px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
            gap: '28px',
          }}
        >
          {/* Col 1: Brand Summary */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="ads-badge-domain" style={{ fontWeight: 700 }}>
                PRINCIPIA
              </span>
              <span style={{ fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                @principia/core v2.4
              </span>
            </div>
            <p style={{ fontSize: '11.5px', lineHeight: 1.5, color: 'var(--ads-ink-graphite)', margin: '0 0 10px 0' }}>
              The Editorial Monograph × The Precision Instrument. Engineered with React 19, TypeScript,
              StyleX token contracts, and KaTeX mathematical typesetting.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
              <span>Press</span>
              <span className="ads-kbd">⌘K</span>
              <span>anywhere for Omnisearch</span>
            </div>
          </div>

          {/* Col 2: Documentation Chapters */}
          <div>
            <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
              DESIGN SYSTEM DOCS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(
                [
                  { id: 'getting-started', label: '1. Architecture & Getting Started' },
                  { id: 'typography', label: '2. Dual-Register Typography & Scale' },
                  { id: 'colors-materiality', label: '3. OKLCH Paper, Ink & Symbol Palette' },
                  { id: 'grid-hardware', label: '4. 4px Sub-Grid & Tactile Hardware' },
                  { id: 'math-formal', label: '5. Mathematical & Formal Grammar' },
                  { id: 'datavis-booktabs', label: '6. Scientific DataVis & Booktabs' },
                  { id: 'symbol-bus', label: '7. L2 Symbol & Document Registry Bus' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onNavigateDoc(d.id)}
                  className="ads-nav-item"
                  style={{ height: '24px', fontSize: '11.5px' }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 3: Storybook Primitives */}
          <div>
            <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
              COMPONENT STORYBOOK
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(
                [
                  { id: 'buttons-badges', label: '1. Buttons, Segments & Badges' },
                  { id: 'forms-inputs', label: '2. Inputs, Selects & Form Controls' },
                  { id: 'cards-surfaces', label: '3. Cards, Metrics, Callouts & Tabs' },
                  { id: 'general-datatable', label: '4. Universal DataTable (Any Dataset)' },
                  { id: 'pod', label: '5. Computational Pod' },
                  { id: 'manipulate-scrubber', label: '6. Manipulate & Vernier Scrubber' },
                  { id: 'scientific-plot', label: '7. Scientific Plotting Suite' },
                  { id: 'code-cell', label: '8. Notebook Code Cell & Copilot' },
                ] as const
              ).map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => onNavigateStory(s.id)}
                  className="ads-nav-item"
                  style={{ height: '24px', fontSize: '11.5px' }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Col 4: Live Prototypes */}
          <div>
            <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
              LIVE APP CONCEPTS
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(
                [
                  { id: 'ai-evals', label: '1. EvalBench · AI Model Observatory' },
                  { id: 'quant-macro', label: '2. Meridian · Quant Risk Terminal' },
                  { id: 'biomed-trials', label: '3. Helix · Clinical Trials Studio' },
                  { id: 'principia', label: '4. Principia · Physics Dynamical Lab' },
                  { id: 'wolfram', label: '5. The Codex · Symbolic CAS & IDE' },
                ] as const
              ).map((p) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onNavigatePrototype(p.id)}
                  className="ads-nav-item"
                  style={{ height: '24px', fontSize: '11.5px' }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
