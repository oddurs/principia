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
  GitBranch,
  Sliders,
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
} from '../primitives/manuscript/MathAndFormal';
import { Cite } from '../primitives/manuscript/CitationsAndRefs';
import {
  Sparkline,
  PhaseSpaceCanvas,
  ComplexPlaneCanvas,
} from '../primitives/datavis/ScienceAndVis';
import { Badge } from '../primitives/general/GeneralFoundation';

export interface MarketingLandingPageProps {
  onNavigateDoc: (doc: DocPageId) => void;
  onNavigateStory: (story: StoryComponentId) => void;
  onNavigatePrototype: (proto: PrototypeAppId) => void;
}

const COMPONENT_PILLARS: Array<{
  title: string;
  badge: string;
  description: string;
  items: Array<{
    id: StoryComponentId;
    num: string;
    title: string;
    exportsText: string;
  }>;
}> = [
  {
    title: '1. Generalist UI Foundation',
    badge: 'PILLAR I · SAAS & APP UI',
    description: 'Zero-black tactile keycap buttons, form controls, KPI cards, and dataset-agnostic tables.',
    items: [
      { id: 'buttons-badges', num: '01', title: 'Buttons, Segments & Badges', exportsText: 'Button · SegmentedControl · Badge' },
      { id: 'forms-inputs', num: '02', title: 'Inputs, Selects & Form Controls', exportsText: 'FormField · Input · Select · Switch' },
      { id: 'cards-surfaces', num: '03', title: 'Cards, Metrics, Callouts & Tabs', exportsText: 'Card · MetricCard · Callout · Tabs' },
      { id: 'general-datatable', num: '04', title: 'Universal DataTable', exportsText: 'DataTable (Search, Sort, TeX/CSV)' },
    ],
  },
  {
    title: '2. Agentic Workflow & Compute',
    badge: 'PILLAR II · AGENTS & NOTEBOOKS',
    description: 'Multi-agent DAG graphs, MCP tool inspectors, reasoning traces, approval gates, and code cells.',
    items: [
      { id: 'agentic-workflow', num: '17', title: 'Agentic Workflow & Orchestration', exportsText: 'AgentPipelineGraph · ToolCallCard · HumanApprovalGate' },
      { id: 'omni-compute-bar', num: '14', title: 'Symbolic Compute OmniBar', exportsText: 'OmniComputeBar' },
      { id: 'code-cell', num: '15', title: 'Notebook Code Cell', exportsText: 'CodeCell · TensorBadge' },
      { id: 'grounded-ai', num: '16', title: 'Grounded AI Copilot', exportsText: 'GroundedAIChat' },
    ],
  },
  {
    title: '3. Pods, Scrubbers & Math',
    badge: 'PILLAR III · FORMAL MANUSCRIPT',
    description: 'Computable containers, 3-speed Vernier scrubbers, display equations, theorems, and citations.',
    items: [
      { id: 'pod', num: '05', title: 'Computational Pod', exportsText: 'Pod (Framed, Seamless, Bracketed)' },
      { id: 'manipulate-scrubber', num: '06', title: 'Manipulate & Vernier Scrubber', exportsText: 'Manipulate · Scrubber' },
      { id: 'equation-block', num: '07', title: 'Display Equations & Symbols', exportsText: 'EquationBlock · Sym · InlineMath' },
      { id: 'formal-proof', num: '08', title: 'Theorems & Formal Proofs', exportsText: 'FormalBlock · ProofBlock' },
      { id: 'algorithm-block', num: '09', title: 'Algorithmic Pseudocode', exportsText: 'AlgorithmBlock' },
      { id: 'citations-crossref', num: '10', title: 'Citations & Reference Lenses', exportsText: 'Cite · CrossRef · CitationCard' },
    ],
  },
  {
    title: '4. Scientific DataVis & Tabular',
    badge: 'PILLAR IV · DATAVIS ENGINE',
    description: 'Vector Cartesian & RK4 phase-space canvases, 2D OKLCH heatmaps, Raincloud KDE & Forest plots, sparklines, and booktabs tables.',
    items: [
      { id: 'scientific-plot', num: '11', title: 'Scientific Plotting Suite', exportsText: 'ScientificPlot · CartesianCanvas · HeatmapMatrix · DistributionPlot' },
      { id: 'sparkline-unit', num: '12', title: 'Sparklines & Dimensional Units', exportsText: 'Sparkline · UnitValue' },
      { id: 'booktabs-table', num: '13', title: 'Booktabs Publication Table', exportsText: 'BooktabsTable' },
    ],
  },
];

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
  } = useAcademicSystem();

  const [zeta, setZeta] = useState<number>(0.22);
  const [omega0, setOmega0] = useState<number>(4.2);
  const [copiedCli, setCopiedCli] = useState<boolean>(false);

  const handleCopyCli = () => {
    navigator.clipboard?.writeText(
      'bun add @principia/core katex @stylexjs/stylex'
    );
    setCopiedCli(true);
    window.setTimeout(() => setCopiedCli(false), 1600);
  };

  // Compute live phase-space spiral for the Hero Interactive Specimen
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

    return { trajectory, waveform };
  }, [zeta, omega0]);

  return (
    <div style={{ width: '100%' }}>
      {/* ====================================================================
          SECTION 1: CLEAN HERO & LIVE INTERACTIVE SPECIMEN
          ==================================================================== */}
      <section
        style={{
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, oklch(0.995 0.004 82) 0%, var(--ads-paper-canvas, #FBF9F6) 100%)',
          padding: '56px 36px 64px 36px',
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
              marginBottom: '28px',
            }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
              <Badge tone="compute" dot>
                PRINCIPIA DESIGN SYSTEM · @principia/core v2.4
              </Badge>
              <span className="ads-eyebrow-mono">
                Generalist UI · Agentic Workflows · Scientific Computing
              </span>
            </div>

            <button
              type="button"
              onClick={handleCopyCli}
              className="ads-btn-instrument"
              style={{ height: '28px', padding: '0 12px' }}
              title="Copy install command"
            >
              <Terminal size={11} color="var(--ads-accent-compute)" />
              <code
                style={{
                  fontFamily: 'var(--ads-font-mono)',
                  fontSize: '11.5px',
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

          {/* Hero Split Layout */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
              gap: '48px',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Clear Headline & Primary Navigation */}
            <div>
              <h1
                className="ads-display-title"
                style={{
                  fontSize: 'clamp(32px, 3.6vw, var(--ads-hero-size, 40px))',
                  lineHeight: 1.15,
                  letterSpacing: '-0.022em',
                  margin: '0 0 20px 0',
                }}
              >
                Where the editorial monograph meets the precision instrument.
              </h1>

              <p
                className="ads-prose"
                style={{
                  color: 'var(--ads-ink-graphite, #4E4D49)',
                  margin: '0 0 28px 0',
                  maxWidth: '58ch',
                }}
              >
                A light-mode React 19 + TypeScript design system uniting{' '}
                <strong>Linear-grade generalist controls</strong>,{' '}
                <strong>multi-agent DAG workflow orchestration</strong>,{' '}
                <strong>LaTeX/KaTeX formal manuscripts</strong>, and{' '}
                <strong>Wolfram-style scientific plotting</strong> under one cohesive token architecture.
              </p>

              {/* 3 Primary Navigation CTAs */}
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
                  onClick={() => onNavigateStory('buttons-badges')}
                  className="ads-btn"
                >
                  <Layers size={13} />
                  <span>Browse Components (17)</span>
                  <ArrowRight size={13} />
                </button>

                <button
                  type="button"
                  data-variant="compute"
                  data-size="md"
                  onClick={() => onNavigatePrototype('agent-workflow')}
                  className="ads-btn"
                >
                  <Cpu size={13} />
                  <span>Launch App Concepts (5)</span>
                </button>

                <button
                  type="button"
                  data-variant="secondary"
                  data-size="md"
                  onClick={() => onNavigateDoc('getting-started')}
                  className="ads-btn"
                >
                  <BookOpen size={13} color="var(--ads-accent-reference)" />
                  <span>Documentation (7)</span>
                </button>
              </div>

              {/* Quick Architecture Summary */}
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
                  { k: '17 Components', v: '4 Core Pillars' },
                  { k: '5 App Concepts', v: 'Agentic, AI, Quant, Bio, Physics' },
                  { k: 'Zero-Black UI', v: '3D Tactile Keycaps' },
                  { k: '8 OKLCH Slots', v: 'Coupled Symbol Bus' },
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

            {/* Right Column: Live Interactive Coupled Specimen */}
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
                  <Badge tone="success" dot>
                    LIVE SPECIMEN
                  </Badge>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                    Coupled Prose ↔ Math ↔ Phase Space
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

              <div style={{ padding: '14px 16px' }}>
                <div className="ads-prose" style={{ fontSize: '14.5px', marginBottom: '8px' }}>
                  Drag damping{' '}
                  <Scrubber
                    symbolId="zeta"
                    symbolLatex="\zeta"
                    value={zeta}
                    min={0.05}
                    max={1.5}
                    step={0.01}
                    onChange={setZeta}
                  />{' '}
                  or frequency{' '}
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
                  or hover symbols (<Sym id="zeta" math="\zeta" />,{' '}
                  <Sym id="omega0" math="\omega_0" />,{' '}
                  <Sym id="energy" math="\mathcal{H}(q,p)" />) <Cite id="arnold1989" />:
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
                      height={165}
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
                      height={165}
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
          SECTION 2: 5 INTERACTIVE APPLICATION CONCEPTS (LAUNCHPAD)
          ==================================================================== */}
      <section
        style={{
          padding: '56px 36px',
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
                LIVE REFERENCE WORKBENCHES
              </div>
              <h2
                className="ads-display-title"
                style={{
                  fontSize: 'var(--ads-h2-size, 23px)',
                  lineHeight: 1.25,
                  margin: '0 0 8px 0',
                }}
              >
                Five Reference Application Concepts
              </h2>
              <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                Click any application concept below to explore a complete domain workbench built on{' '}
                <code className="ads-inline-code">@principia/core</code>.
              </p>
            </div>
          </div>

          <div
            className="ads-ui"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(225px, 1fr))',
              gap: '16px',
            }}
          >
            {(
              [
                {
                  id: 'agent-workflow' as PrototypeAppId,
                  badge: '01 · AGENTIC WORKFLOW',
                  title: 'Nexus Orchestrator',
                  subtitle: 'Multi-Agent DAG, MCP Tools & Human Gate',
                  description:
                    'Orchestrate parallel subagents, inspect MCP sandbox diffs, verify Lean 4 proofs, and approve ChangeSets.',
                  accent: 'var(--ads-accent-compute, #D63E18)',
                  icon: <GitBranch size={14} color="var(--ads-accent-compute)" />,
                },
                {
                  id: 'ai-evals' as PrototypeAppId,
                  badge: '02 · AI OBSERVATORY',
                  title: 'EvalBench Studio',
                  subtitle: 'Frontier Model Benchmarks & Compute Pareto',
                  description:
                    'Compare frontier LLMs across MMLU-Pro, GPQA Diamond, and MATH-500 with live test-time compute scaling curves.',
                  accent: 'oklch(0.55 0.185 32)',
                  icon: <Cpu size={14} color="var(--ads-accent-compute)" />,
                },
                {
                  id: 'quant-macro' as PrototypeAppId,
                  badge: '03 · MACRO QUANT',
                  title: 'Meridian Terminal',
                  subtitle: 'Yield Curve Fitting, Rate Shocks & VaR',
                  description:
                    'Interactive sovereign Treasury yield curve desk with instantaneous parallel rate shocks and DV01 attribution.',
                  accent: 'oklch(0.45 0.145 255)',
                  icon: <Layers size={14} color="oklch(0.45 0.145 255)" />,
                },
                {
                  id: 'biomed-trials' as PrototypeAppId,
                  badge: '04 · BIOSTATISTICS',
                  title: 'Helix Phase III',
                  subtitle: 'Kaplan–Meier Survival & Subgroup Hazard',
                  description:
                    'Oncology clinical trial workbench with 36-month progression-free survival curves and biomarker stratification.',
                  accent: 'oklch(0.46 0.14 160)',
                  icon: <Sparkles size={14} color="oklch(0.46 0.14 160)" />,
                },
                {
                  id: 'principia' as PrototypeAppId,
                  badge: '05 · PHYSICS & CAS',
                  title: 'Principia Lab',
                  subtitle: 'Dynamical Systems, Proofs & Symbolic CAS',
                  description:
                    'Coupled harmonic oscillator, quantum eigenstates, and Lotka–Volterra phase portraits with formal proofs.',
                  accent: 'oklch(0.48 0.16 310)',
                  icon: <Compass size={14} color="oklch(0.48 0.16 310)" />,
                },
              ] as const
            ).map((proto) => (
              <div
                key={proto.id}
                onClick={() => onNavigatePrototype(proto.id)}
                style={{
                  padding: '16px 18px',
                  borderRadius: '7px',
                  backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                  border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                  borderTop: `3px solid ${proto.accent}`,
                  boxShadow: '0 2px 6px rgba(20,20,19,0.03), inset 0 1px 0 #FFF',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  cursor: 'pointer',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '8px',
                    }}
                  >
                    <span className="ads-badge-domain">{proto.badge}</span>
                    {proto.icon}
                  </div>

                  <h3
                    className="ads-section-heading"
                    style={{ fontSize: '17px', margin: '0 0 2px 0' }}
                  >
                    {proto.title}
                  </h3>
                  <div
                    style={{
                      fontSize: '11.5px',
                      fontWeight: 500,
                      color: 'var(--ads-ink-pencil)',
                      marginBottom: '8px',
                    }}
                  >
                    {proto.subtitle}
                  </div>
                  <p
                    style={{
                      fontSize: '12.5px',
                      lineHeight: 1.48,
                      color: 'var(--ads-ink-graphite)',
                      margin: 0,
                    }}
                  >
                    {proto.description}
                  </p>
                </div>

                <button
                  type="button"
                  data-variant="tonal"
                  data-size="sm"
                  className="ads-btn"
                  style={{ width: '100%', justifyContent: 'space-between', padding: '0 10px' }}
                >
                  <span>Launch Concept</span>
                  <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 3: COMPLETE 17-COMPONENT DIRECTORY BY PILLAR
          ==================================================================== */}
      <section
        style={{
          padding: '56px 36px',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          backgroundColor: 'var(--ads-paper-desk, #F5F3EE)',
        }}
      >
        <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
          <div style={{ marginBottom: '28px' }}>
            <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)', marginBottom: '6px' }}>
              COMPONENT STORYBOOK DIRECTORY
            </div>
            <h2
              className="ads-display-title"
              style={{
                fontSize: 'var(--ads-h2-size, 23px)',
                lineHeight: 1.25,
                margin: '0 0 8px 0',
              }}
            >
              All 17 Components Organized into Four Pillars
            </h2>
            <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
              Select any component below to inspect its live interactive scenarios, JSX code, and TypeScript props in Storybook.
            </p>
          </div>

          <div
            className="ads-ui"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
              gap: '20px',
            }}
          >
            {COMPONENT_PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                style={{
                  padding: '24px',
                  borderRadius: '8px',
                  backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                  border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <span className="ads-badge-domain" style={{ marginBottom: '8px' }}>
                    {pillar.badge}
                  </span>
                  <h3 className="ads-section-heading" style={{ margin: '6px 0 6px 0' }}>
                    {pillar.title}
                  </h3>
                  <p style={{ fontSize: '13.5px', lineHeight: '20px', color: 'var(--ads-ink-graphite)', margin: 0 }}>
                    {pillar.description}
                  </p>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {pillar.items.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => onNavigateStory(item.id)}
                      className="ads-nav-item"
                      style={{
                        height: '36px',
                        padding: '0 12px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                        border: '1px solid var(--ads-ink-whisper)',
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                        <span
                          style={{
                            fontFamily: 'var(--ads-font-mono)',
                            fontSize: '11px',
                            fontWeight: 600,
                            color: 'var(--ads-accent-compute)',
                          }}
                        >
                          {item.num}
                        </span>
                        <span style={{ fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                          {item.title}
                        </span>
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--ads-font-mono)',
                          fontSize: '10.5px',
                          color: 'var(--ads-ink-pencil)',
                        }}
                      >
                        {item.exportsText} →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================================
          SECTION 4: SYSTEM AXES, SYMBOL REGISTRY & DOCUMENTATION SITEMAP
          ==================================================================== */}
      <section
        className="ads-ui"
        style={{
          padding: '40px 32px 56px 32px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          fontSize: '12px',
        }}
      >
        <div
          style={{
            maxWidth: '1240px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          {/* Card 1: Live Orthogonal System Axes */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '7px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <Sliders size={13} color="var(--ads-accent-compute)" />
              <span style={{ fontWeight: 700, fontSize: '13px' }}>
                3 Orthogonal Customization Axes
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div className="ads-prop-row">
                <span style={{ fontWeight: 500 }}>Chroming</span>
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
                <span style={{ fontWeight: 500 }}>Density</span>
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
                <span style={{ fontWeight: 500 }}>Paper Material</span>
                <div className="ads-pill-group">
                  {(
                    [
                      { id: 'archival-wolfram', label: 'Archival' },
                      { id: 'swiss-lab', label: 'Swiss' },
                      { id: 'oxford-monograph', label: 'Sepia' },
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

          {/* Card 2: 8-Slot Subtractive OKLCH Symbol Bus */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '7px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontWeight: 700, fontSize: '13px' }}>
                L2 Coupled SymbolRegistry Bus
              </span>
              <span style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                Hover or click to highlight
              </span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
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
                      padding: '6px 8px',
                      borderRadius: '5px',
                      backgroundColor: slot.bg,
                      border: `1px solid ${isAct ? slot.fg : slot.border}`,
                      color: slot.fg,
                      textAlign: 'left',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span style={{ fontWeight: 600, fontSize: '12px' }}>
                      <InlineMath latex={sym.latex} /> · {sym.name}
                    </span>
                    <span style={{ fontSize: '10px', opacity: 0.8 }}>#{sym.slot}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Card 3: 7 Documentation Chapters */}
          <div
            style={{
              padding: '16px 18px',
              borderRadius: '7px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
              <BookOpen size={13} color="var(--ads-accent-reference)" />
              <span style={{ fontWeight: 700, fontSize: '13px' }}>
                Design System Documentation (7 Chapters)
              </span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
              {(
                [
                  { id: 'getting-started', label: '01 · Architecture & Getting Started' },
                  { id: 'typography', label: '02 · Dual-Register Typography & Scale' },
                  { id: 'colors-materiality', label: '03 · OKLCH Paper, Ink & Symbol Palette' },
                  { id: 'grid-hardware', label: '04 · 4px Sub-Grid & Tactile Hardware' },
                  { id: 'math-formal', label: '05 · Mathematical & Formal Grammar' },
                  { id: 'datavis-booktabs', label: '06 · Scientific DataVis & Booktabs' },
                  { id: 'symbol-bus', label: '07 · L2 Symbol & Document Registry Bus' },
                ] as const
              ).map((d) => (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => onNavigateDoc(d.id)}
                  className="ads-nav-item"
                  style={{ height: '24px', fontSize: '11.5px' }}
                >
                  <span>{d.label}</span>
                  <ArrowRight size={10} />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
