import React, { useState, useEffect, useMemo } from 'react';
import {
  Layers,
  BookOpen,
  Cpu,
  Sparkles,
  Smartphone,
  Tablet,
  Monitor,
  Grid,
  AlignJustify,
  Hand,
  X,
  Pin,
  Sliders,
  ArrowLeft,
  Copy,
  Check,
  Terminal,
  Compass,
} from 'lucide-react';
import {
  useAcademicSystem,
  SYMBOL_SLOT_COLORS,
  DensityMode,
  ChromingMode,
  MaterialPreset,
  VoicePreset,
  DeviceSimulation,
} from '../core/registry';
import { Pod } from '../primitives/pod/Pod';
import { Manipulate, Scrubber } from '../primitives/compute/Manipulate';
import {
  Sym,
  InlineMath,
  EquationBlock,
  FormalBlock,
  FormalVariant,
  ProofBlock,
  AlgorithmBlock,
} from '../primitives/manuscript/MathAndFormal';
import {
  Cite,
  CrossRef,
  MarginSidenoteColumn,
  CitationCard,
} from '../primitives/manuscript/CitationsAndRefs';
import {
  Sparkline,
  ScientificPlot,
  BooktabsTable,
  UnitValue,
} from '../primitives/datavis/ScienceAndVis';
import {
  OmniComputeBar,
  CodeCell,
  GroundedAIChat,
  TensorBadge,
} from '../primitives/compute/CodeAndCopilot';

/**
 * ============================================================================
 * L4: "THE CODEX" — WORLD-CLASS DESIGN SYSTEM SPECIFICATION & WORKBENCH
 * ============================================================================
 * Interactive specification, token atlas, optical typography laboratory, and
 * multi-archetype stress-test suite for `@principia/core`.
 *
 * 4 Live Workbench Modes:
 *   1. 'codex-specimens'  : Design System Specification, Token Atlas & Component Gallery
 *   2. 'wolfram-engine'   : Computable Knowledge Engine (OmniBar + Pods + Manipulate)
 *   3. 'latex-monograph'  : Tufte 3-Column LaTeX Manuscript + Sidenotes + Proofs
 *   4. 'notebook-ide'     : Bracketed Computational Notebook + Grounded AI Copilot
 */

export type ArchetypeView =
  | 'codex-specimens'
  | 'wolfram-engine'
  | 'latex-monograph'
  | 'notebook-ide';

export type SpecimenPillarFilter =
  | 'all'
  | 'foundations'
  | 'hardware-grid'
  | 'pods-manipulate'
  | 'math-formal'
  | 'citations-refs'
  | 'science-datavis'
  | 'code-copilot';

export interface CodexAppProps {
  onBackToPrincipia?: () => void;
  initialArchetype?: ArchetypeView;
  embeddedInPlatform?: boolean;
}

export const CodexApp: React.FC<CodexAppProps> = ({
  onBackToPrincipia,
  initialArchetype = 'codex-specimens',
  embeddedInPlatform = false,
}) => {
  const {
    symbols,
    activeSymbolId,
    pinnedSymbolId,
    hoverSymbol,
    togglePinSymbol,
    crossRefs,
    citations,
    pinnedCitations,
    togglePinCitation,
    activeTouchInspection,
    setActiveTouchInspection,
    density,
    setDensity,
    chroming,
    setChroming,
    material,
    setMaterial,
    voice,
    setVoice,
    deviceSim,
    setDeviceSim,
    simulateTouch,
    setSimulateTouch,
    xrayBaseline,
    setXrayBaseline,
    xrayGrid,
    setXrayGrid,
  } = useAcademicSystem();

  const [archetype, setArchetype] = useState<ArchetypeView>(initialArchetype);
  const [pillarFilter, setPillarFilter] = useState<SpecimenPillarFilter>('all');
  const [copiedToken, setCopiedToken] = useState<string | null>(null);
  const [activeFormalVariant, setActiveFormalVariant] =
    useState<FormalVariant>('theorem');

  useEffect(() => {
    setArchetype(initialArchetype);
    if (initialArchetype === 'wolfram-engine') {
      setChroming('framed');
      setDensity('workbench');
    } else if (initialArchetype === 'latex-monograph') {
      setChroming('seamless');
      setDensity('manuscript');
    } else if (initialArchetype === 'notebook-ide') {
      setChroming('bracketed');
      setDensity('workbench');
    }
  }, [initialArchetype, setChroming, setDensity]);

  // Shared live scientific parameters across Equations, Plots, Tables & Code Cells
  const [zeta, setZeta] = useState<number>(0.25);
  const [omega0, setOmega0] = useState<number>(4.0);
  const [isSweeping, setIsSweeping] = useState<boolean>(false);

  // Parameter sweep animation for <Manipulate>
  useEffect(() => {
    if (!isSweeping) return;
    const id = window.setInterval(() => {
      setZeta((prev) => {
        const next = prev + 0.03;
        return next > 1.5 ? 0.08 : Number(next.toFixed(2));
      });
    }, 90);
    return () => window.clearInterval(id);
  }, [isSweeping]);

  const handleCopyToken = (tokenStr: string) => {
    navigator.clipboard?.writeText(tokenStr);
    setCopiedToken(tokenStr);
    window.setTimeout(() => setCopiedToken(null), 1500);
  };

  // Switch default chroming/density sensibly when user picks an Archetype preset
  const handleSelectArchetype = (next: ArchetypeView) => {
    setArchetype(next);
    if (next === 'wolfram-engine') {
      setChroming('framed');
      setDensity('workbench');
    } else if (next === 'latex-monograph') {
      setChroming('seamless');
      setDensity('manuscript');
    } else if (next === 'notebook-ide') {
      setChroming('bracketed');
      setDensity('workbench');
    } else if (next === 'codex-specimens') {
      setChroming('framed');
    }
  };

  // Sample waveforms for the Sparkline Specimen Gallery
  const sparklineSamples = useMemo(() => {
    const N = 42;
    const underdamped = Array.from({ length: N }, (_, i) => {
      const t = (i / (N - 1)) * 5.5;
      const wd = omega0 * Math.sqrt(Math.max(0.01, 1 - zeta * zeta));
      return Math.exp(-zeta * omega0 * t) * Math.cos(wd * t);
    });
    const critical = Array.from({ length: N }, (_, i) => {
      const t = (i / (N - 1)) * 5.5;
      return (1 + omega0 * t) * Math.exp(-omega0 * t);
    });
    const limitCycle = Array.from({ length: N }, (_, i) => {
      const t = (i / (N - 1)) * 6.28 * 2;
      return 1.2 + 0.65 * Math.sin(t) + 0.22 * Math.cos(2 * t);
    });
    const eigenDensity = Array.from({ length: N }, (_, i) => {
      const x = -2.8 + (i / (N - 1)) * 5.6;
      const h2 = 4 * x * x - 2;
      const psi = h2 * Math.exp(-0.5 * x * x);
      return psi * psi;
    });
    return { underdamped, critical, limitCycle, eigenDensity };
  }, [zeta, omega0]);

  // Compute CSS Custom Properties from active Density, Materiality & Voice axes
  const dynamicRootVars: React.CSSProperties = {
    '--ads-title-size':
      density === 'manuscript' ? '34px' : density === 'workbench' ? '28px' : '24px',
    '--ads-heading-size':
      density === 'manuscript' ? '20px' : density === 'workbench' ? '18px' : '16px',
    '--ads-prose-size':
      density === 'manuscript' ? '17.5px' : density === 'workbench' ? '16px' : '14.5px',
    '--ads-prose-lh':
      density === 'manuscript' ? '1.68' : density === 'workbench' ? '1.62' : '1.56',
    '--ads-secondary-prose-size':
      density === 'manuscript' ? '15px' : density === 'workbench' ? '14px' : '13px',
    '--ads-baseline-step':
      density === 'manuscript' ? '29px' : density === 'workbench' ? '26px' : '23px',
    '--ads-chrome-size':
      density === 'manuscript' ? '13px' : density === 'workbench' ? '12.5px' : '12px',
    '--ads-mono-size':
      density === 'manuscript' ? '13px' : density === 'workbench' ? '12.5px' : '12px',
    '--ads-pod-padding-y':
      density === 'manuscript' ? '24px' : density === 'workbench' ? '20px' : '14px',
    '--ads-pod-padding-x':
      density === 'manuscript' ? '28px' : density === 'workbench' ? '24px' : '18px',
    '--ads-pod-gap':
      density === 'manuscript' ? '22px' : density === 'workbench' ? '18px' : '14px',
    '--ads-pod-radius': chroming === 'seamless' ? '0px' : '8px',

    // Materiality Surface overrides
    '--ads-paper-desk':
      material === 'swiss-lab'
        ? 'oklch(0.968 0.002 250)'
        : material === 'oxford-monograph'
        ? 'oklch(0.945 0.011 78)'
        : 'oklch(0.964 0.004 82)',
    '--ads-paper-canvas':
      material === 'swiss-lab'
        ? 'oklch(0.990 0.001 250)'
        : material === 'oxford-monograph'
        ? 'oklch(0.978 0.008 80)'
        : 'oklch(0.986 0.003 85)',
    '--ads-paper-plate':
      material === 'oxford-monograph' ? 'oklch(0.994 0.004 82)' : '#FFFFFF',
    '--ads-paper-well':
      material === 'swiss-lab'
        ? 'oklch(0.976 0.002 250)'
        : material === 'oxford-monograph'
        ? 'oklch(0.960 0.009 79)'
        : 'oklch(0.974 0.004 83)',
    '--ads-accent-compute':
      material === 'swiss-lab'
        ? 'oklch(0.480 0.165 255)'
        : 'oklch(0.555 0.195 32)',
    '--ads-accent-reference':
      material === 'swiss-lab'
        ? 'oklch(0.420 0.140 210)'
        : 'oklch(0.450 0.145 255)',

    // Typographic Voice (Dual-Register: Newsreader Optical vs Neo-Grotesque Inter)
    '--ads-font-display':
      voice === 'neo-grotesque'
        ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
        : '"Newsreader", "STIX Two Text", Georgia, serif',
    '--ads-font-prose':
      voice === 'neo-grotesque'
        ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
        : '"Newsreader", "STIX Two Text", Georgia, serif',
    '--ads-font-chrome':
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    '--ads-font-mono': '"JetBrains Mono", monospace',
  } as React.CSSProperties;

  const stageMaxWidth =
    deviceSim === 'mobile-375'
      ? '375px'
      : deviceSim === 'tablet-768'
      ? '768px'
      : '100%';

  return (
    <div
      data-xray-baseline={xrayBaseline ? 'true' : 'false'}
      data-xray-grid={xrayGrid ? 'true' : 'false'}
      data-simulate-touch={simulateTouch ? 'true' : 'false'}
      style={{
        ...dynamicRootVars,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--ads-paper-desk)',
        color: 'var(--ads-ink-carbon, #141413)',
      }}
    >
      {/* ====================================================================
          TOP OPTICAL LAB & MULTI-AXIS CONTROL BAR (44px + 36px Instrument Shell)
          ==================================================================== */}
      <header
        className="ads-no-print ads-ui"
        style={{
          position: 'sticky',
          top: embeddedInPlatform ? '44px' : 0,
          zIndex: 35,
          backgroundColor: 'oklch(1 0 0 / 0.94)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '12px',
        }}
      >
        {/* Row 1 (44px): Brand + 4 Universal Archetype Modes + Back to Principia */}
        {!embeddedInPlatform && (
          <div
            style={{
              height: '44px',
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '10px',
              padding: '0 16px',
              borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
            }}
          >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {onBackToPrincipia && (
              <button
                type="button"
                onClick={onBackToPrincipia}
                className="ads-btn-instrument"
                title="Return to Principia Interactive Monograph"
              >
                <ArrowLeft size={11} />
                <span>Principia Studio</span>
              </button>
            )}

            <span className="ads-badge-domain" style={{ fontWeight: 600 }}>
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '2px',
                  backgroundColor: 'var(--ads-accent-compute)',
                }}
              />
              THE CODEX · v2.4
            </span>
            <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--ads-ink-carbon)' }}>
              @principia/core
            </span>
            <span
              style={{
                fontFamily: 'var(--ads-font-display)',
                fontStyle: 'italic',
                color: 'var(--ads-ink-graphite)',
                fontSize: '13.5px',
              }}
            >
              Architecture, Optical Tokens &amp; Component Atlas
            </span>
          </div>

          {/* Universal Archetype Switcher */}
          <div
            role="tablist"
            aria-label="Universal Application Archetypes"
            className="ads-pill-group"
            style={{ height: '25px', padding: '2px' }}
          >
            {(
              [
                {
                  id: 'codex-specimens',
                  label: '1. Design System Atlas',
                  icon: <Layers size={11} />,
                },
                {
                  id: 'wolfram-engine',
                  label: '2. Wolfram Engine',
                  icon: <Cpu size={11} />,
                },
                {
                  id: 'latex-monograph',
                  label: '3. LaTeX Monograph',
                  icon: <BookOpen size={11} />,
                },
                {
                  id: 'notebook-ide',
                  label: '4. Notebook + AI',
                  icon: <Sparkles size={11} />,
                },
              ] as const
            ).map((tab) => {
              const active = archetype === tab.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  data-active={active ? 'true' : 'false'}
                  className="ads-pill-btn"
                  onClick={() => handleSelectArchetype(tab.id)}
                  style={{ height: '19px', padding: '0 8.5px', fontSize: '11.5px' }}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
        )}

        {/* Row 2 (36px): 3 Orthogonal Axes + Device Simulator & X-Ray Lasers */}
        <div
          style={{
            minHeight: '36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '4px 16px',
            backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
            fontSize: '11.5px',
          }}
        >
          {/* Left: 3 Orthogonal Customization Axes */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
            <select
              aria-label="Chroming Axis"
              value={chroming}
              onChange={(e) => setChroming(e.target.value as ChromingMode)}
              className="ads-btn-instrument"
            >
              <option value="framed">Chroming: Framed Plates</option>
              <option value="seamless">Chroming: Seamless Flow</option>
              <option value="bracketed">Chroming: Bracketed Cells</option>
            </select>

            <select
              aria-label="Density Axis"
              value={density}
              onChange={(e) => setDensity(e.target.value as DensityMode)}
              className="ads-btn-instrument"
            >
              <option value="manuscript">Density: 17px Monograph</option>
              <option value="workbench">Density: 15.5px Workbench</option>
              <option value="compact">Density: 14px Compact</option>
            </select>

            <select
              aria-label="Materiality Axis"
              value={material}
              onChange={(e) => setMaterial(e.target.value as MaterialPreset)}
              className="ads-btn-instrument"
            >
              <option value="archival-wolfram">Material: Archival Paper</option>
              <option value="swiss-lab">Material: Swiss Clinical</option>
              <option value="oxford-monograph">Material: Oxford Sepia</option>
            </select>

            <select
              aria-label="Typographic Voice"
              value={voice}
              onChange={(e) => setVoice(e.target.value as VoicePreset)}
              className="ads-btn-instrument"
            >
              <option value="latex-classic">Voice: Newsreader Optical Serif</option>
              <option value="neo-grotesque">Voice: Swiss Inter Sans</option>
            </select>
          </div>

          {/* Right: Device Container Simulator + Optical X-Ray Lasers */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
            {copiedToken && (
              <span
                className="ads-badge-domain"
                style={{
                  borderColor: 'oklch(0.75 0.12 160)',
                  color: 'oklch(0.38 0.12 160)',
                }}
              >
                <Check size={10} />
                Copied {copiedToken}
              </span>
            )}

            <div className="ads-pill-group">
              {(
                [
                  { id: 'responsive', label: 'Full', icon: <Monitor size={11} /> },
                  { id: 'tablet-768', label: '768px', icon: <Tablet size={11} /> },
                  { id: 'mobile-375', label: '375px', icon: <Smartphone size={11} /> },
                ] as const
              ).map((dev) => (
                <button
                  key={dev.id}
                  type="button"
                  data-active={deviceSim === dev.id ? 'true' : 'false'}
                  className="ads-pill-btn"
                  onClick={() => setDeviceSim(dev.id as DeviceSimulation)}
                  title={`Simulate ${dev.label} container width (@container reflows)`}
                >
                  {dev.icon}
                  <span>{dev.label}</span>
                </button>
              ))}
            </div>

            <button
              type="button"
              data-active={simulateTouch ? 'true' : 'false'}
              className="ads-btn-instrument"
              onClick={() => setSimulateTouch(!simulateTouch)}
              title="Simulate Coarse Touch Pointer (40px targets, Math Ribbon, Touch Sheet)"
            >
              <Hand size={11} />
              <span>Touch</span>
            </button>

            <button
              type="button"
              data-active={xrayBaseline ? 'true' : 'false'}
              className="ads-btn-instrument"
              onClick={() => setXrayBaseline(!xrayBaseline)}
              title="Toggle 1rlh Cyan Baseline Rhythm Laser Overlay"
            >
              <AlignJustify size={11} />
              <span>1rlh</span>
            </button>

            <button
              type="button"
              data-active={xrayGrid ? 'true' : 'false'}
              className="ads-btn-instrument"
              onClick={() => setXrayGrid(!xrayGrid)}
              title="Toggle @container Pod & Tufte Grid Track Outlines"
            >
              <Grid size={11} />
              <span>Grid X-Ray</span>
            </button>
          </div>
        </div>
      </header>

      {/* ====================================================================
          MAIN WORKBENCH BODY: [LEFT NAV] + [ADAPTIVE STAGE] + [BUS INSPECTOR]
          ==================================================================== */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: '226px minmax(0, 1fr) 276px',
          alignItems: 'start',
        }}
      >
        {/* ------------------------------------------------------------------
             LEFT RAIL: SPECIMEN & PILLAR NAVIGATION
            ------------------------------------------------------------------ */}
        <nav
          aria-label="Codex Specimen Navigation"
          className="ads-no-print ads-ui"
          style={{
            position: 'sticky',
            top: '80px',
            padding: '14px 12px',
            borderRight: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            fontSize: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          {/* Section 1: Design System Atlas & Pillar Filters */}
          <div>
            <div className="ads-section-label" style={{ padding: '0 8px', marginBottom: '6px' }}>
              I. Design System Atlas
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {(
                [
                  { id: 'all', label: 'Complete System Specification', badge: '7' },
                  { id: 'foundations', label: 'L1. Typography & OKLCH Ink', badge: 'L1' },
                  { id: 'hardware-grid', label: 'L2. Hardware & 4px Grid', badge: 'L2' },
                  { id: 'pods-manipulate', label: 'P1. Pods & Manipulate', badge: 'P1' },
                  { id: 'math-formal', label: 'P2. Math, Proofs & Algos', badge: 'P2' },
                  { id: 'citations-refs', label: 'P3. Citations & CrossRefs', badge: 'P3' },
                  { id: 'science-datavis', label: 'P4. DataVis & Booktabs', badge: 'P4' },
                  { id: 'code-copilot', label: 'P5/6. AST Code & Copilot', badge: 'P5' },
                ] as const
              ).map((pillar) => {
                const isSelected =
                  archetype === 'codex-specimens' && pillarFilter === pillar.id;
                return (
                  <button
                    key={pillar.id}
                    type="button"
                    data-active={isSelected ? 'true' : 'false'}
                    className="ads-nav-item"
                    onClick={() => {
                      setArchetype('codex-specimens');
                      setPillarFilter(pillar.id);
                    }}
                  >
                    <span>{pillar.label}</span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--ads-ink-pencil)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {pillar.badge}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Application Archetypes */}
          <div>
            <div className="ads-section-label" style={{ padding: '0 8px', marginBottom: '6px' }}>
              II. Live Archetype Suites
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {(
                [
                  { id: 'wolfram-engine', label: 'Wolfram Compute Engine' },
                  { id: 'latex-monograph', label: 'LaTeX Monograph (Tufte)' },
                  { id: 'notebook-ide', label: 'Notebook + AI Copilot' },
                ] as const
              ).map((item) => (
                <button
                  key={item.id}
                  type="button"
                  data-active={archetype === item.id ? 'true' : 'false'}
                  className="ads-nav-item"
                  onClick={() => handleSelectArchetype(item.id)}
                >
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Live Parameter Summary in Left Rail */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              fontSize: '11.5px',
            }}
          >
            <div
              style={{
                fontWeight: 600,
                color: 'var(--ads-ink-carbon, #141413)',
                marginBottom: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Sliders size={11} color="var(--ads-accent-compute)" />
              <span>Global Coupled Bus</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <div className="ads-prop-row">
                <span>Damping ζ</span>
                <Scrubber
                  symbolId="zeta"
                  value={zeta}
                  min={0.05}
                  max={1.8}
                  step={0.01}
                  onChange={setZeta}
                />
              </div>
              <div className="ads-prop-row">
                <span>Eigenfreq ω₀</span>
                <Scrubber
                  symbolId="omega0"
                  value={omega0}
                  min={1.0}
                  max={8.0}
                  step={0.1}
                  unit="rad/s"
                  onChange={setOmega0}
                />
              </div>
            </div>
          </div>
        </nav>

        {/* ------------------------------------------------------------------
            CENTER STAGE: ADAPTIVE CONTAINER & ARCHETYPE CANVAS
            ------------------------------------------------------------------ */}
        <main
          className="ads-xray-stage ads-manuscript-container"
          style={{
            padding: '22px 26px 72px 26px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: stageMaxWidth,
              backgroundColor: 'var(--ads-paper-canvas)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              borderRadius: '7px',
              padding:
                deviceSim === 'mobile-375' ? '14px' : '28px 34px',
              boxShadow:
                '0 2px 12px rgba(20, 20, 19, 0.035), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
              transition: 'max-width 220ms ease, padding 220ms ease',
            }}
          >
            {/* ==============================================================
                ARCHETYPE 1 (FLAGSHIP): DESIGN SYSTEM SPECIFICATION & ATLAS
                ============================================================== */}
            {archetype === 'codex-specimens' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* ----------------------------------------------------------
                    HERO MANIFESTO HEADER & DUAL-REGISTER ARCHITECTURE MATRIX
                    ---------------------------------------------------------- */}
                <div
                  style={{
                    paddingBottom: '20px',
                    borderBottom: '1.5px solid var(--ads-ink-carbon, #141413)',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '8px',
                      marginBottom: '10px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="ads-badge-domain">
                        <Compass size={10} color="var(--ads-accent-compute)" />
                        CANONICAL SPECIFICATION
                      </span>
                      <span className="ads-eyebrow-mono">
                        LaTeX · Wolfram Alpha · Linear · Tufte
                      </span>
                    </div>

                    <div className="ads-pill-group">
                      {(
                        [
                          { id: 'all', label: 'All' },
                          { id: 'foundations', label: 'L1 Typography & Ink' },
                          { id: 'hardware-grid', label: 'L2 Hardware' },
                          { id: 'pods-manipulate', label: 'P1 Pods' },
                          { id: 'math-formal', label: 'P2 Math' },
                          { id: 'citations-refs', label: 'P3 Citations' },
                          { id: 'science-datavis', label: 'P4 DataVis' },
                          { id: 'code-copilot', label: 'P5 Code/AI' },
                        ] as const
                      ).map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          data-active={pillarFilter === f.id ? 'true' : 'false'}
                          className="ads-pill-btn"
                          onClick={() => setPillarFilter(f.id)}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <h1 className="ads-display-title" style={{ margin: '0 0 8px 0' }}>
                    The Editorial Monograph × The Precision Instrument
                  </h1>

                  <p
                    className="ads-prose"
                    style={{
                      margin: '0 0 18px 0',
                      color: 'var(--ads-ink-graphite, #4E4D49)',
                      maxWidth: '72ch',
                    }}
                  >
                    <code className="ads-inline-code">@principia/core</code> separates human
                    reading from machine telemetry across two strictly calibrated typographic and
                    spatial registers: <strong>Register I</strong> pairs optical-size variable
                    serifs (<em>Newsreader</em> <InlineMath latex="\text{opsz } 6..72" />,{' '}
                    <em>STIX Two Text</em>) with <InlineMath latex="\KaTeX" /> mathematical
                    typesetting; <strong>Register II</strong> deploys high-density{' '}
                    <em>Inter</em> (<code className="ads-inline-code">tabular-nums</code>) for
                    rim-lit instrument chrome and reserves <em>JetBrains Mono</em> strictly for
                    executable code and symbolic AST inputs.
                  </p>

                  {/* 2-Card Register Comparison Matrix */}
                  <div
                    className="ads-ui"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                        border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                        borderLeft: '3px solid var(--ads-accent-reference, #1E56A0)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)' }}>
                          REGISTER I · EDITORIAL MONOGRAPH
                        </span>
                        <span className="ads-badge-domain">opsz 16–48 · lnum · smcp</span>
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--ads-font-display)',
                          fontSize: '17px',
                          fontWeight: 500,
                          color: 'var(--ads-ink-carbon)',
                          marginBottom: '4px',
                        }}
                      >
                        Newsreader Optical + STIX Two + KaTeX_Main
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--ads-ink-graphite)', lineHeight: 1.45 }}>
                        Governs manuscript titles, section headings, 65ch body prose, italic
                        Theorem/Lemma blocks, upright Definitions, and inline/display formulas.
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                        border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                        borderLeft: '3px solid var(--ads-accent-compute, #D63E18)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          marginBottom: '4px',
                        }}
                      >
                        <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)' }}>
                          REGISTER II · PRECISION INSTRUMENT
                        </span>
                        <span className="ads-badge-domain">cv01..04 · tabular-nums</span>
                      </div>
                      <div
                        style={{
                          fontFamily: 'var(--ads-font-chrome)',
                          fontSize: '14.5px',
                          fontWeight: 600,
                          letterSpacing: '-0.015em',
                          color: 'var(--ads-ink-carbon)',
                          marginBottom: '4px',
                        }}
                      >
                        Inter Tabular UI + JetBrains Mono (Code Only)
                      </div>
                      <div style={{ fontSize: '11.5px', color: 'var(--ads-ink-graphite)', lineHeight: 1.45 }}>
                        Governs 44px/36px shell bars, rim-lit buttons, recessed pill groups,
                        Vernier scrubbers, SVG chart axes, and symbol-linked AST code cells.
                      </div>
                    </div>
                  </div>
                </div>

                {/* ----------------------------------------------------------
                    L1A: DUAL-REGISTER TYPOGRAPHIC SCALE & OPTICAL LAB
                    ---------------------------------------------------------- */}
                {(pillarFilter === 'all' || pillarFilter === 'foundations') && (
                  <Pod
                    title="1. Dual-Register Typographic Scale & Optical Sizing Lab"
                    subtitle="Register I (Editorial Serif) × Register II (Instrument Sans & Code)"
                    domainTag="EXACT"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {/* Booktabs Typographic Scale Table */}
                      <div style={{ overflowX: 'auto' }}>
                        <table
                          className="ads-booktabs-table ads-ui"
                          style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            borderTop: '1.5px solid var(--ads-ink-carbon, #141413)',
                            borderBottom: '1.5px solid var(--ads-ink-carbon, #141413)',
                            fontSize: '12px',
                          }}
                        >
                          <thead>
                            <tr>
                              <th colSpan={2} style={{ textAlign: 'left', padding: '6px 10px 2px 10px' }}>
                                <span className="ads-cmidrule" style={{ marginRight: '8px' }}>
                                  Role &amp; OpenType Axis Contract
                                </span>
                              </th>
                              <th colSpan={2} style={{ textAlign: 'left', padding: '6px 10px 2px 10px' }}>
                                <span className="ads-cmidrule" style={{ marginLeft: '4px' }}>
                                  Calibrated Scale &amp; Live Specimen
                                </span>
                              </th>
                            </tr>
                            <tr
                              style={{
                                borderBottom: '1px solid var(--ads-ink-carbon, #141413)',
                                textAlign: 'left',
                              }}
                            >
                              <th style={{ padding: '5px 10px 7px 10px', fontWeight: 600 }}>Role &amp; Class</th>
                              <th style={{ padding: '5px 10px 7px 10px', fontWeight: 600 }}>Font Stack &amp; Optical Axis</th>
                              <th style={{ padding: '5px 10px 7px 10px', fontWeight: 600, textAlign: 'right' }}>Scale / Rhythm</th>
                              <th style={{ padding: '5px 10px 7px 10px', fontWeight: 600 }}>Live Rendered Specimen</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td style={{ padding: '8px 10px' }}>
                                <code className="ads-inline-code">.ads-display-title</code>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)', marginTop: '2px' }}>
                                  Register I · Monograph H1
                                </div>
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <div>Newsreader Variable</div>
                                <span className="ads-badge-domain" style={{ marginTop: '3px' }}>
                                  opsz 48 · kern · dlig · lnum
                                </span>
                              </td>
                              <td className="ads-cell-num" style={{ padding: '8px 10px' }}>
                                <div>26px / 1.15</div>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)' }}>
                                  tracking −0.022em
                                </div>
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <div className="ads-display-title" style={{ fontSize: '22px' }}>
                                  Spectral Dissipation &amp; Symplectic Flow
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ padding: '8px 10px' }}>
                                <code className="ads-inline-code">.ads-section-heading</code>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)', marginTop: '2px' }}>
                                  Register I · Section &amp; Pod H2/H3
                                </div>
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <div>Newsreader Variable</div>
                                <span className="ads-badge-domain" style={{ marginTop: '3px' }}>
                                  opsz 24 · wt 600 · liga · lnum
                                </span>
                              </td>
                              <td className="ads-cell-num" style={{ padding: '8px 10px' }}>
                                <div>16px / 1.25</div>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)' }}>
                                  tracking −0.014em
                                </div>
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <div className="ads-section-heading">
                                  § 2.1 Lyapunov Phase-Space Contraction Theorem
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ padding: '8px 10px' }}>
                                <code className="ads-inline-code">.ads-prose</code>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)', marginTop: '2px' }}>
                                  Register I · 65ch Body Prose
                                </div>
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <div>Newsreader / STIX Two</div>
                                <span className="ads-badge-domain" style={{ marginTop: '3px' }}>
                                  opsz 16 · calt · lnum
                                </span>
                              </td>
                              <td className="ads-cell-num" style={{ padding: '8px 10px' }}>
                                <div>15.5px / 1.60</div>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)' }}>
                                  measure 65ch
                                </div>
                              </td>
                              <td style={{ padding: '8px 10px' }}>
                                <div className="ads-prose" style={{ fontSize: '15px' }}>
                                  Every trajectory of the damped operator with{' '}
                                  <InlineMath latex="\zeta = 0.25" /> contracts canonical volume at rate{' '}
                                  <InlineMath latex="-2\zeta\omega_0" />.
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ padding: '10px' }}>
                                <code className="ads-inline-code">.ads-smallcaps</code>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)', marginTop: '2px' }}>
                                  Register I · Run-In Theorem Header
                                </div>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <div>Newsreader OpenType</div>
                                <span className="ads-badge-domain" style={{ marginTop: '3px' }}>
                                  smcp · lnum
                                </span>
                              </td>
                              <td style={{ padding: '10px', fontVariantNumeric: 'tabular-nums' }}>
                                <div>1.0em / 1.4</div>
                                <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                                  tracking +0.045em
                                </div>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <span
                                  className="ads-prose ads-smallcaps"
                                  style={{ fontWeight: 700, fontSize: '15px' }}
                                >
                                  Theorem 2.1 (Lyapunov Stability).
                                </span>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ padding: '10px' }}>
                                <code className="ads-inline-code">.ads-ui</code> /{' '}
                                <code className="ads-inline-code">.ads-prop-row</code>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)', marginTop: '2px' }}>
                                  Register II · Instrument Chrome
                                </div>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <div>Inter Variable</div>
                                <span className="ads-badge-domain" style={{ marginTop: '3px' }}>
                                  cv01..04 · ss01 · tabular-nums
                                </span>
                              </td>
                              <td style={{ padding: '10px', fontVariantNumeric: 'tabular-nums' }}>
                                <div>12px / 20px</div>
                                <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                                  tracking −0.011em
                                </div>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                                  <span className="ads-badge-domain">EXACT · −1.00 ± 3.87i</span>
                                  <span className="ads-kbd">⌘K</span>
                                </div>
                              </td>
                            </tr>

                            <tr>
                              <td style={{ padding: '10px' }}>
                                <code className="ads-inline-code">.ads-code-block</code>
                                <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-pencil)', marginTop: '2px' }}>
                                  Register II · Code &amp; Symbolic AST Only
                                </div>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <div>JetBrains Mono</div>
                                <span className="ads-badge-domain" style={{ marginTop: '3px' }}>
                                  zero · ss01 · calt
                                </span>
                              </td>
                              <td style={{ padding: '10px', fontVariantNumeric: 'tabular-nums' }}>
                                <div>12.5px / 1.55</div>
                                <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                                  inline 0.81em
                                </div>
                              </td>
                              <td style={{ padding: '10px' }}>
                                <code className="ads-inline-code">
                                  dsolve(x″ + 2*ζ*ω₀*x′ + ω₀²*x == δ(t))
                                </code>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Quad-Font Optical Baseline Alignment Torture Test */}
                      <div
                        style={{
                          padding: '14px 18px',
                          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                          border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                          borderRadius: '6px',
                          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.8)',
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
                            marginBottom: '8px',
                          }}
                        >
                          <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)' }}>
                            SINGLE-LINE QUAD-FONT &amp; TALL SUMMATION BASELINE TORTURE TEST
                          </span>
                          <button
                            type="button"
                            data-active={xrayBaseline ? 'true' : 'false'}
                            className="ads-btn-instrument"
                            onClick={() => setXrayBaseline(!xrayBaseline)}
                          >
                            <AlignJustify size={10} />
                            <span>{xrayBaseline ? 'Hide 1rlh Laser' : 'Inspect 1rlh Baseline Laser'}</span>
                          </button>
                        </div>

                        <div className="ads-prose">
                          In a single continuous line, <strong>Newsreader Optical Serif</strong>, tall inline{' '}
                          <InlineMath latex="\KaTeX \;\sum_{n=1}^\infty \frac{e^{-\zeta\omega_0 n}}{n^2}" />, live Vernier scrubber{' '}
                          <Scrubber
                            symbolId="zeta"
                            symbolLatex="\zeta"
                            value={zeta}
                            min={0.05}
                            max={1.8}
                            step={0.01}
                            onChange={setZeta}
                          />
                          , inline AST token <code className="ads-inline-code">SymPy.solve(ζ)</code>, and tactile badge{' '}
                          <span className="ads-badge-domain" style={{ verticalAlign: 'baseline' }}>
                            OUT[1] · EXACT
                          </span>{' '}
                          share the exact same baseline without vertical jitter or line-height expansion.
                        </div>
                      </div>
                    </div>
                  </Pod>
                )}

                {/* ----------------------------------------------------------
                    L1B: PERCEPTUAL OKLCH PAPER, CARBON INK & SYMBOL PALETTE
                    ---------------------------------------------------------- */}
                {(pillarFilter === 'all' || pillarFilter === 'foundations') && (
                  <Pod
                    title="2. Perceptual Color Architecture (OKLCH Paper, Carbon Ink & Subtractive Highlights)"
                    subtitle="Click any token card to copy its CSS Custom Property"
                    domainTag="SYMBOLIC"
                  >
                    <div className="ads-ui" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {/* 1. Archival Paper Elevation Hierarchy */}
                      <div>
                        <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
                          I. ARCHIVAL PAPER SURFACE HIERARCHY (WARM OKLCH HUE 80°–85°)
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(155px, 1fr))',
                            gap: '8px',
                          }}
                        >
                          {(
                            [
                              {
                                token: '--ads-paper-desk',
                                name: 'Paper Desk',
                                oklch: 'oklch(0.964 0.004 82)',
                                hex: '#F5F3EE',
                                role: 'App viewport surround',
                              },
                              {
                                token: '--ads-paper-canvas',
                                name: 'Paper Canvas',
                                oklch: 'oklch(0.986 0.003 85)',
                                hex: '#FBF9F6',
                                role: 'Primary manuscript sheet',
                              },
                              {
                                token: '--ads-paper-plate',
                                name: 'Paper Plate',
                                oklch: 'oklch(1.000 0.000 0)',
                                hex: '#FFFFFF',
                                role: 'Elevated Pod & Figure stage',
                              },
                              {
                                token: '--ads-paper-well',
                                name: 'Paper Well',
                                oklch: 'oklch(0.974 0.004 83)',
                                hex: '#F7F5F0',
                                role: 'Recessed code & control tray',
                              },
                              {
                                token: '--ads-paper-lens',
                                name: 'Paper Lens',
                                oklch: 'oklch(0.996 0.002 85 / 96%)',
                                hex: 'Frosted',
                                role: 'Floating citation/ref glass',
                              },
                            ] as const
                          ).map((surf) => (
                            <button
                              key={surf.token}
                              type="button"
                              onClick={() => handleCopyToken(`var(${surf.token})`)}
                              style={{
                                textAlign: 'left',
                                padding: '10px 12px',
                                borderRadius: '6px',
                                backgroundColor: surf.hex === 'Frosted' ? '#FFFFFF' : surf.hex,
                                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                                boxShadow: '0 1px 2px rgba(20,20,19,0.03)',
                                cursor: 'pointer',
                              }}
                              title={`Click to copy var(${surf.token})`}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  fontWeight: 600,
                                  fontSize: '12px',
                                  color: 'var(--ads-ink-carbon)',
                                  marginBottom: '2px',
                                }}
                              >
                                <span>{surf.name}</span>
                                <Copy size={10} color="var(--ads-ink-pencil)" />
                              </div>
                              <div style={{ fontSize: '10.5px', color: 'var(--ads-ink-graphite)', marginBottom: '4px' }}>
                                {surf.role}
                              </div>
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: 'var(--ads-ink-pencil)',
                                  fontVariantNumeric: 'tabular-nums',
                                }}
                              >
                                {surf.oklch}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 2. Carbon Ink & Booktabs Rule Hierarchy */}
                      <div>
                        <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
                          II. CARBON INK &amp; BOOKTABS STRUCTURAL RULES (\toprule · \midrule · \cmidrule)
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                            gap: '8px',
                          }}
                        >
                          {(
                            [
                              {
                                name: 'Carbon Ink (Primary)',
                                token: '--ads-ink-carbon',
                                spec: 'oklch(0.175 0.005 80) · #141413',
                                swatch: '#141413',
                              },
                              {
                                name: 'Graphite Ink (Secondary)',
                                token: '--ads-ink-graphite',
                                spec: 'oklch(0.430 0.007 80) · #4E4D49',
                                swatch: '#4E4D49',
                              },
                              {
                                name: 'Pencil Ink (Metadata)',
                                token: '--ads-ink-pencil',
                                spec: 'oklch(0.600 0.006 80) · #82807A',
                                swatch: '#82807A',
                              },
                              {
                                name: 'Structural Hairline (1px)',
                                token: '--ads-ink-hairline',
                                spec: 'oklch(0.908 0.005 82) · #E4E2DC',
                                swatch: '#E4E2DC',
                              },
                            ] as const
                          ).map((inkItem) => (
                            <button
                              key={inkItem.token}
                              type="button"
                              onClick={() => handleCopyToken(`var(${inkItem.token})`)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                padding: '8px 10px',
                                borderRadius: '5px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid var(--ads-ink-hairline)',
                                textAlign: 'left',
                                cursor: 'pointer',
                              }}
                            >
                              <span
                                style={{
                                  width: '20px',
                                  height: '20px',
                                  borderRadius: '4px',
                                  backgroundColor: inkItem.swatch,
                                  border: '1px solid rgba(20,20,19,0.12)',
                                  flexShrink: 0,
                                }}
                              />
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '11.5px', color: 'var(--ads-ink-carbon)' }}>
                                  {inkItem.name}
                                </div>
                                <div style={{ fontSize: '10px', color: 'var(--ads-ink-pencil)' }}>
                                  {inkItem.spec}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* 3. 8-Slot Subtractive Symbol Palette */}
                      <div>
                        <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
                          III. 8-SLOT SUBTRACTIVE SYMBOL PALETTE (OKLCH + MIX-BLEND-MODE: MULTIPLY)
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
                            gap: '8px',
                          }}
                        >
                          {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((slotNum) => {
                            const c = SYMBOL_SLOT_COLORS[slotNum];
                            const matchingSym = Object.values(symbols).find((s) => s.slot === slotNum);
                            return (
                              <div
                                key={slotNum}
                                onMouseEnter={() => matchingSym && hoverSymbol(matchingSym.id)}
                                onMouseLeave={() => matchingSym && hoverSymbol(null)}
                                onClick={() => matchingSym && togglePinSymbol(matchingSym.id)}
                                style={{
                                  padding: '8px 10px',
                                  borderRadius: '5px',
                                  backgroundColor: c.bg,
                                  border: `1px solid ${c.border}`,
                                  color: c.fg,
                                  cursor: matchingSym ? 'pointer' : 'default',
                                  transition: 'transform 100ms ease',
                                }}
                              >
                                <div
                                  style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    fontWeight: 600,
                                    fontSize: '11.5px',
                                  }}
                                >
                                  <span>
                                    Slot #{slotNum} · {c.label}
                                  </span>
                                  {matchingSym && <InlineMath latex={matchingSym.latex} />}
                                </div>
                                <div style={{ fontSize: '10px', opacity: 0.85, marginTop: '2px' }}>
                                  {matchingSym ? `Linked: ${matchingSym.name}` : 'multiply ink wash'}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Pod>
                )}

                {/* ----------------------------------------------------------
                    L2: TACTILE INSTRUMENT HARDWARE & 4PX SPATIAL GRID
                    ---------------------------------------------------------- */}
                {(pillarFilter === 'all' || pillarFilter === 'hardware-grid') && (
                  <Pod
                    title="3. Tactile Instrument Chrome & 4px Harmonic Sub-Grid"
                    subtitle="Linear × Principia Hardware Surface Physics"
                    domainTag="NUMERICAL"
                  >
                    <div className="ads-ui" style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {/* Interactive Hardware Primitives Matrix */}
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        {/* Card 1: Rim-Lit Tactile Buttons */}
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--ads-paper-well)',
                            border: '1px solid var(--ads-ink-hairline)',
                          }}
                        >
                          <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
                            .ads-btn-instrument (22px Height)
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                            <button type="button" className="ads-btn-instrument">
                              Default Rim-Lit
                            </button>
                            <button type="button" data-active="true" className="ads-btn-instrument">
                              Active Carbon
                            </button>
                            <button type="button" className="ads-btn-instrument">
                              <Terminal size={11} />
                              <span>With Icon</span>
                            </button>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
                            Features <code className="ads-inline-code">inset 0 1px 0 #fff</code> top specular
                            highlight and <code className="ads-inline-code">0.5px</code> active press travel.
                          </div>
                        </div>

                        {/* Card 2: Recessed Segmented Pill Groups */}
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--ads-paper-well)',
                            border: '1px solid var(--ads-ink-hairline)',
                          }}
                        >
                          <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
                            .ads-pill-group &amp; .ads-pill-btn
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                            <div className="ads-pill-group">
                              <button type="button" data-active="true" className="ads-pill-btn">
                                Typeset
                              </button>
                              <button type="button" data-active="false" className="ads-pill-btn">
                                TeX
                              </button>
                              <button type="button" data-active="false" className="ads-pill-btn">
                                Typst
                              </button>
                            </div>
                            <TensorBadge shape="161×2" dtype="Float64" />
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
                            Recessed optical well (<code className="ads-inline-code">inset 0 1px 1.5px</code>)
                            housing a crisp elevated white thumb.
                          </div>
                        </div>

                        {/* Card 3: Epistemic Domain & Keycap Badges */}
                        <div
                          style={{
                            padding: '12px 14px',
                            borderRadius: '6px',
                            backgroundColor: 'var(--ads-paper-well)',
                            border: '1px solid var(--ads-ink-hairline)',
                          }}
                        >
                          <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
                            .ads-badge-domain &amp; .ads-kbd
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '8px' }}>
                            {(['EXACT', 'SYMBOLIC', 'NUMERICAL', 'AI-VERIFIED'] as const).map((tag) => (
                              <span key={tag} className="ads-badge-domain">
                                <span
                                  style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    backgroundColor:
                                      tag === 'EXACT' || tag === 'AI-VERIFIED'
                                        ? 'oklch(0.52 0.14 160)'
                                        : tag === 'SYMBOLIC'
                                        ? 'oklch(0.56 0.19 32)'
                                        : 'oklch(0.48 0.15 255)',
                                  }}
                                />
                                {tag}
                              </span>
                            ))}
                            <span className="ads-kbd">⌘</span>
                            <span className="ads-kbd">K</span>
                          </div>
                          <div style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
                            Communicates epistemic provenance (Exact vs Empirical vs CAS-Verified).
                          </div>
                        </div>
                      </div>

                      {/* 4px Sub-Grid & Control Height Scale Visualiser */}
                      <div
                        style={{
                          padding: '12px 16px',
                          borderRadius: '6px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--ads-ink-hairline)',
                        }}
                      >
                        <div className="ads-eyebrow-mono" style={{ marginBottom: '10px' }}>
                          HARMONIC 4PX VERTICAL RHYTHM &amp; CONTROL HEIGHT SCALE
                        </div>
                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                            gap: '10px',
                            alignItems: 'end',
                          }}
                        >
                          {(
                            [
                              { h: 18, label: '18px · .ads-kbd', role: 'Keycap / Tensor chip' },
                              { h: 20, label: '20px · .ads-badge', role: 'Epistemic domain tag' },
                              { h: 22, label: '22px · .ads-btn', role: 'Instrument button (xs)' },
                              { h: 28, label: '28px · .ads-nav', role: 'Sidebar nav & turnstile' },
                              { h: 36, label: '36px · Sub-Bar', role: 'Toolbar & Pod header' },
                              { h: 44, label: '44px · Shell Bar', role: 'Primary studio header' },
                            ] as const
                          ).map((item) => (
                            <div key={item.h} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                              <div
                                style={{
                                  height: `${item.h}px`,
                                  borderRadius: '4px',
                                  backgroundColor: 'oklch(0.955 0.018 255)',
                                  border: '1px solid oklch(0.82 0.07 255)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  fontSize: '10.5px',
                                  fontWeight: 600,
                                  color: 'var(--ads-accent-reference)',
                                }}
                              >
                                {item.h}px
                              </div>
                              <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                                {item.label}
                              </div>
                              <div style={{ fontSize: '10px', color: 'var(--ads-ink-pencil)' }}>
                                {item.role}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Pod>
                )}

                {/* ----------------------------------------------------------
                    P1: COMPUTABLE <Pod>, <Manipulate> & VERNIER <Scrubber>
                    ---------------------------------------------------------- */}
                {(pillarFilter === 'all' || pillarFilter === 'pods-manipulate') && (
                  <Pod
                    title="4. Pillar P1 — Computable <Pod>, <Manipulate> & 3-Speed Vernier <Scrubber>"
                    subtitle="Switch Chroming Mode live to inspect Framed Fiducials vs Seamless vs Bracketed"
                    domainTag="SYMBOLIC"
                    cellLabel="Out[1]="
                    assumptions={[
                      {
                        id: 'domain',
                        label: 'ζ, ω₀',
                        current: 'real and positive (ℝ⁺)',
                        alternatives: ['complex (ℂ)', 'distributional S′(ℝ)'],
                      },
                    ]}
                    latexSource={`\\text{Manipulate}\\left[\\text{Plot}[G(t; \\zeta, \\omega_0), \\{t, 0, 6\\}], \\{\\zeta, 0.05, 1.8\\}, \\{\\omega_0, 1, 8\\}\\right]`}
                    codeSource={`<Manipulate parameters={[{ id: 'zeta', symbolId: 'zeta', value: zeta, min: 0.05, max: 1.8 }]} />`}
                    headerExtra={
                      <div className="ads-pill-group">
                        {(['framed', 'seamless', 'bracketed'] as const).map((m) => (
                          <button
                            key={m}
                            type="button"
                            data-active={chroming === m ? 'true' : 'false'}
                            className="ads-pill-btn"
                            onClick={() => setChroming(m)}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    }
                  >
                    <Manipulate
                      parameters={[
                        {
                          id: 'zeta',
                          symbolId: 'zeta',
                          symbolLabel: '\\zeta',
                          name: 'Damping Ratio',
                          value: zeta,
                          min: 0.05,
                          max: 1.8,
                          step: 0.01,
                          presets: [
                            { label: '0.15', value: 0.15 },
                            { label: '0.25', value: 0.25 },
                            { label: '1.00', value: 1.0 },
                            { label: '1.45', value: 1.45 },
                          ],
                        },
                        {
                          id: 'omega0',
                          symbolId: 'omega0',
                          symbolLabel: '\\omega_0',
                          name: 'Eigenfrequency',
                          value: omega0,
                          min: 1.0,
                          max: 8.0,
                          step: 0.1,
                          unit: 'rad/s',
                        },
                      ]}
                      onChange={(id, val) =>
                        id === 'zeta' ? setZeta(val) : setOmega0(val)
                      }
                      onReset={() => {
                        setZeta(0.25);
                        setOmega0(4.0);
                      }}
                      isPlaying={isSweeping}
                      onTogglePlay={() => setIsSweeping((s) => !s)}
                    >
                      <div className="ads-prose" style={{ fontSize: '16px' }}>
                        <strong>Dual-Context Vernier Scrubber:</strong> In prose,{' '}
                        <Scrubber
                          symbolId="zeta"
                          symbolLatex="\zeta"
                          value={zeta}
                          min={0.05}
                          max={1.8}
                          step={0.01}
                          onChange={setZeta}
                        />{' '}
                        renders in <InlineMath latex="\KaTeX" /> upright serif numerals with a dashed baseline
                        rule; in toolbars, it renders as a rim-lit <code className="ads-inline-code">Inter</code>{' '}
                        instrument chip with a bottom fill-ratio gauge. Pull your pointer downward while dragging
                        to shift from <strong>1× Coarse</strong> into <strong>0.1× Fine</strong> or{' '}
                        <strong>0.01× Vernier Lock</strong>.
                      </div>
                    </Manipulate>
                  </Pod>
                )}

                {/* ----------------------------------------------------------
                    P2: MATHEMATICAL, FORMAL & ALGORITHMIC ENVIRONMENTS
                    ---------------------------------------------------------- */}
                {(pillarFilter === 'all' || pillarFilter === 'math-formal') && (
                  <Pod
                    title="5. Pillar P2 — <EquationBlock>, <FormalBlock>, <ProofBlock> & <AlgorithmBlock>"
                    subtitle="Hover any equation for 1-click TeX & Typst copy; switch FormalBlock variants below"
                    domainTag="THEOREM"
                    headerExtra={
                      <div className="ads-pill-group">
                        {(
                          ['theorem', 'lemma', 'corollary', 'definition', 'remark'] as const
                        ).map((v) => (
                          <button
                            key={v}
                            type="button"
                            data-active={activeFormalVariant === v ? 'true' : 'false'}
                            className="ads-pill-btn"
                            onClick={() => setActiveFormalVariant(v)}
                          >
                            {v}
                          </button>
                        ))}
                      </div>
                    }
                  >
                    <EquationBlock
                      id="eq:greens"
                      number="2.1"
                      latex={`\\mathcal{H}(q, p) = \\frac{1}{2}p^2 + \\frac{1}{2}\\omega_0^2 q^2 \\implies \\frac{d\\mathcal{H}}{dt} = -2\\zeta\\omega_0 \\dot{q}^2 = -${(2 * zeta * omega0).toFixed(2)}\\,\\dot{q}^2`}
                      referencedSymbols={['zeta', 'omega0', 'energy']}
                      caption="Hover this display equation to reveal constituent symbol pills and 1-click TeX / Typst copy buttons."
                    />

                    <FormalBlock
                      id="thm:lyapunov"
                      variant={activeFormalVariant}
                      number="2.1"
                      title={
                        activeFormalVariant === 'definition'
                          ? 'Causal Green’s Propagator'
                          : activeFormalVariant === 'remark'
                          ? 'Symplectic Shadow Hamiltonian Drift'
                          : 'Exponential Phase-Space Contraction'
                      }
                    >
                      Every trajectory of the damped harmonic operator with{' '}
                      <Sym id="zeta" math="\zeta > 0" /> and natural frequency{' '}
                      <Sym id="omega0" math="\omega_0 > 0" /> contracts canonical phase-space area at rate{' '}
                      <InlineMath latex="-2\zeta\omega_0" />. Notice how{' '}
                      <code className="ads-inline-code">theorem / lemma / corollary</code> typeset in italic
                      serif with a cobalt rule, whereas{' '}
                      <code className="ads-inline-code">definition / remark</code> typeset in upright roman
                      serif with emerald/graphite rules.
                    </FormalBlock>

                    <ProofBlock title="Proof (with auto-aligned Halmos Q.E.D. tombstone)">
                      Differentiating <Sym id="energy" math="\mathcal{H}(q,p)" /> along trajectories of{' '}
                      <CrossRef to="eq:greens" /> yields monotonic energy dissipation{' '}
                      <InlineMath latex="\dot{\mathcal{H}} = -2\zeta\omega_0 p^2 \le 0" />, establishing global
                      asymptotic stability of the origin by LaSalle’s invariance principle <Cite id="arnold1989" />.
                    </ProofBlock>

                    <AlgorithmBlock
                      number="1.1"
                      title="Symplectic Velocity-Verlet Integrator with Exponential Damping"
                      requireText={
                        <span>
                          State <InlineMath latex="(q_0, p_0)" />, step <InlineMath latex="\Delta t" />,
                          parameters <Sym id="zeta" math="\zeta" />, <Sym id="omega0" math="\omega_0" />
                        </span>
                      }
                      ensureText={
                        <span>
                          Trajectory <InlineMath latex="\{(q_k, p_k)\}_{k=1}^N" /> preserving{' '}
                          <InlineMath latex="\mathcal{O}(\Delta t^2)" /> shadow energy
                        </span>
                      }
                      lines={[
                        {
                          line: 1,
                          indent: 0,
                          content: <InlineMath latex="\gamma \gets \exp(-\zeta\omega_0 \Delta t / 2)" />,
                          comment: 'Exact dissipative half-step factor',
                        },
                        {
                          line: 2,
                          indent: 0,
                          content: (
                            <span>
                              <strong>for</strong> <InlineMath latex="k = 0 \text{ to } N-1" /> <strong>do</strong>
                            </span>
                          ),
                        },
                        {
                          line: 3,
                          indent: 1,
                          content: (
                            <InlineMath latex="p_{k+1/2} \gets \gamma \cdot p_k - \frac{\Delta t}{2}\omega_0^2 q_k" />
                          ),
                          comment: 'Momentum kick',
                        },
                        {
                          line: 4,
                          indent: 1,
                          content: <InlineMath latex="q_{k+1} \gets q_k + \Delta t \cdot p_{k+1/2}" />,
                          comment: 'Position drift',
                        },
                        {
                          line: 5,
                          indent: 0,
                          content: <strong>end for</strong>,
                        },
                      ]}
                    />
                  </Pod>
                )}

                {/* ----------------------------------------------------------
                    P3: CITATIONS, NON-JUMPING CROSS-REF LENSES & SIDENOTES
                    ---------------------------------------------------------- */}
                {(pillarFilter === 'all' || pillarFilter === 'citations-refs') && (
                  <Pod
                    title="6. Pillar P3 — <Cite>, <CitationCard> & Non-Jumping <CrossRef> Glass Lenses"
                    subtitle="Hover any reference to inspect in-place without losing scroll position"
                    domainTag="EXACT"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <p className="ads-prose" style={{ margin: 0 }}>
                        Hover over internal cross-references <CrossRef to="thm:lyapunov" />,{' '}
                        <CrossRef to="eq:greens" />, or <CrossRef to="tab:regimes" /> to preview theorems and
                        equations in a frosted archival glass popover (<code className="ads-inline-code">.ads-floating-lens</code>)
                        without jumping the viewport. Citations support both numbered{' '}
                        <Cite id="arnold1989" mode="numeric" /> and author-year{' '}
                        <Cite id="rackauckas2020" mode="author-year" /> conventions with 1-click{' '}
                        <code className="ads-inline-code">BibTeX</code> copy:
                      </p>

                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                          gap: '12px',
                        }}
                      >
                        {['arnold1989', 'rackauckas2020'].map((cid) =>
                          citations[cid] ? (
                            <CitationCard
                              key={cid}
                              entry={citations[cid]}
                              isPinned={pinnedCitations.includes(cid)}
                              onTogglePin={() => togglePinCitation(cid)}
                              compact
                            />
                          ) : null
                        )}
                      </div>
                    </div>
                  </Pod>
                )}

                {/* ----------------------------------------------------------
                    P4: DECLARATIVE SCIENTIFIC DATAVIS ENGINE & BOOKTABS
                    ---------------------------------------------------------- */}
                {(pillarFilter === 'all' || pillarFilter === 'science-datavis') && (
                  <Pod
                    title="7. Pillar P4 — Declarative Scientific DataVis Engine & Booktabs Grammar"
                    subtitle="<Sparkline> · <CartesianCanvas> · <PhaseSpaceCanvas> · <ComplexPlaneCanvas> · <BooktabsTable>"
                    domainTag="EMPIRICAL"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* 1. Tufte Word-Sized Sparkline Specimen Bar */}
                      <div
                        className="ads-ui"
                        style={{
                          padding: '12px 16px',
                          borderRadius: '6px',
                          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                          border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '8px',
                            marginBottom: '10px',
                          }}
                        >
                          <span className="ads-eyebrow-mono">
                            1. TUFTE WORD-SIZED INLINE SPARKLINES (&lt;Sparkline /&gt;) &amp; DIMENSIONAL &lt;UnitValue /&gt;
                          </span>
                          <span style={{ fontSize: '11.5px', color: 'var(--ads-ink-graphite)' }}>
                            Click unit chip to cycle SI ↔ CGS ↔ Natural:{' '}
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
                                  unitLatex: 'Hz (cycles·s⁻¹)',
                                },
                                {
                                  system: 'Natural',
                                  formattedValue: (omega0 * 6.582e-16).toExponential(2),
                                  unitLatex: 'eV (ℏ=1)',
                                },
                              ]}
                            />
                          </span>
                        </div>

                        <div
                          style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(195px, 1fr))',
                            gap: '10px',
                          }}
                        >
                          {(
                            [
                              {
                                label: 'Underdamped Ringdown',
                                formula: `\\zeta = ${zeta.toFixed(2)}`,
                                data: sparklineSamples.underdamped,
                                domain: [-1, 1] as [number, number],
                                color: 'oklch(0.42 0.16 255)',
                              },
                              {
                                label: 'Critically Damped Step',
                                formula: '\\zeta = 1.00',
                                data: sparklineSamples.critical,
                                domain: [-0.2, 1.05] as [number, number],
                                color: 'oklch(0.46 0.14 160)',
                              },
                              {
                                label: 'Lotka–Volterra Cycle',
                                formula: '\\oint p\\,dq',
                                data: sparklineSamples.limitCycle,
                                domain: [0, 2.2] as [number, number],
                                color: 'oklch(0.55 0.19 32)',
                              },
                              {
                                label: 'Eigenstate Density',
                                formula: '|\\psi_2(x)|^2',
                                data: sparklineSamples.eigenDensity,
                                domain: [0, 2.6] as [number, number],
                                color: 'oklch(0.48 0.16 310)',
                              },
                            ] as const
                          ).map((sp) => (
                            <div
                              key={sp.label}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '8px 10px',
                                borderRadius: '5px',
                                backgroundColor: '#FFFFFF',
                                border: '1px solid var(--ads-ink-hairline)',
                              }}
                            >
                              <div>
                                <div style={{ fontWeight: 600, fontSize: '11.5px', color: 'var(--ads-ink-carbon)' }}>
                                  {sp.label}
                                </div>
                                <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                                  <InlineMath latex={sp.formula} />
                                </div>
                              </div>
                              <Sparkline
                                data={sp.data}
                                domain={sp.domain}
                                width={76}
                                height={22}
                                color={sp.color}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* 2. Multi-Panel ScientificPlot Workbench */}
                      <ScientificPlot zeta={zeta} omega0={omega0} />

                      {/* 3. Booktabs Publication Table */}
                      <BooktabsTable
                        caption="Characteristic eigenvalues λ₁,₂, quality factor Q, inline waveform sparklines, and energy relaxation time τ_E across damping regimes."
                        activeZeta={zeta}
                        omega0={omega0}
                        onSelectZeta={setZeta}
                      />
                    </div>
                  </Pod>
                )}

                {/* ----------------------------------------------------------
                    P5 & P6: SYMBOLIC OMNIBAR, AST CODE CELL & GROUNDED AI
                    ---------------------------------------------------------- */}
                {(pillarFilter === 'all' || pillarFilter === 'code-copilot') && (
                  <Pod
                    title="8. Pillars P5 & P6 — <OmniComputeBar>, AST <CodeCell> & Verifiable <GroundedAIChat>"
                    subtitle="Symbol-Linked Julia AST Tokens + SymPy CAS Verification Badges"
                    domainTag="AI-VERIFIED"
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <OmniComputeBar
                        onSelectPreset={(preset) => {
                          setZeta(preset.zeta);
                          setOmega0(preset.omega0);
                        }}
                      />
                      <CodeCell zeta={zeta} omega0={omega0} />
                      <GroundedAIChat />
                    </div>
                  </Pod>
                )}
              </div>
            )}

            {/* ==============================================================
                ARCHETYPE 2: WOLFRAM ALPHA COMPUTATIONAL KNOWLEDGE ENGINE
                ============================================================== */}
            {archetype === 'wolfram-engine' && (
              <div>
                <OmniComputeBar
                  onSelectPreset={(preset) => {
                    setZeta(preset.zeta);
                    setOmega0(preset.omega0);
                  }}
                />

                {/* Pod 1: Exact Symbolic Solution & Green's Function */}
                <Pod
                  title="1. Exact Symbolic Solution & Causal Green’s Kernel"
                  subtitle="Duhamel Spectral Decomposition"
                  domainTag="EXACT"
                  cellLabel="Out[1]="
                  assumptions={[
                    {
                      id: 'domain',
                      label: 'ζ, ω₀',
                      current: 'real and positive (ℝ⁺)',
                      alternatives: ['complex (ℂ)', 'distributional S′(ℝ)'],
                    },
                    {
                      id: 'transform',
                      label: 'Fourier convention',
                      current: 'Unitary (1/√2π)',
                      alternatives: ['Laplace unilateral (s ∈ ℂ)'],
                    },
                  ]}
                  latexSource={`x(t) = \\int_0^t \\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}} \\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right) f(\\tau)\\,d\\tau`}
                  codeSource={`# Wolfram Language / SymPy Equivalent\nDSolve[{x''[t] + 2*zeta*omega0*x'[t] + omega0^2*x[t] == DiracDelta[t], x[0]==0, x'[0]==0}, x[t], t]`}
                  steps={[
                    {
                      stepNumber: 1,
                      title: 'Apply unilateral Laplace transform ℒ{x(t)}(s)',
                      justification:
                        'Map the second-order differential operator into an algebraic transfer function H(s) in the complex frequency plane.',
                      renderedContent: (
                        <InlineMath latex="(s^2 + 2\zeta\omega_0 s + \omega_0^2)\tilde{G}(s) = 1 \implies \tilde{G}(s) = \frac{1}{(s + \zeta\omega_0)^2 + \omega_0^2(1 - \zeta^2)}" />
                      ),
                    },
                    {
                      stepNumber: 2,
                      title: 'Locate characteristic poles in the left half-plane',
                      justification:
                        'For 0 < ζ < 1, the denominator splits into a conjugate pair with real decay rate −ζω₀.',
                      renderedContent: (
                        <InlineMath latex="s_{1,2} = -\zeta\omega_0 \pm i\omega_0\sqrt{1 - \zeta^2}" />
                      ),
                    },
                    {
                      stepNumber: 3,
                      title: 'Invert by Bromwich contour & residue theorem',
                      justification:
                        'Evaluating the residues at s₁,₂ for t > 0 yields the causal damped sinusoid kernel.',
                    },
                  ]}
                >
                  <EquationBlock
                    id="eq:greens"
                    number="1.2"
                    latex={`x(t) = \\int_0^t \\underbrace{\\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right)}_{G(t-\\tau)} f(\\tau)\\,d\\tau`}
                    referencedSymbols={['zeta', 'omega0', 'kernel']}
                    caption="Hover this equation to copy TeX / Typst or filter constituent symbols across all pods."
                  />
                </Pod>

                {/* Pod 2: Interactive Manipulate Phase Portrait & Time Response */}
                <Pod
                  title="2. Parametric Dynamical Response & Phase-Space Portrait"
                  subtitle="Interactive Manipulate[Trajectory, {ζ, ω₀}]"
                  domainTag="NUMERICAL"
                  cellLabel="Out[2]="
                >
                  <Manipulate
                    parameters={[
                      {
                        id: 'zeta',
                        symbolId: 'zeta',
                        symbolLabel: '\\zeta',
                        name: 'Damping Ratio',
                        value: zeta,
                        min: 0.05,
                        max: 1.8,
                        step: 0.01,
                        presets: [
                          { label: '0.15 (Under)', value: 0.15 },
                          { label: '0.25', value: 0.25 },
                          { label: '1.00 (Crit)', value: 1.0 },
                          { label: '1.45 (Over)', value: 1.45 },
                        ],
                      },
                      {
                        id: 'omega0',
                        symbolId: 'omega0',
                        symbolLabel: '\\omega_0',
                        name: 'Natural Frequency',
                        value: omega0,
                        min: 1.0,
                        max: 8.0,
                        step: 0.1,
                        unit: 'rad/s',
                        presets: [
                          { label: '2.0', value: 2.0 },
                          { label: '4.0', value: 4.0 },
                          { label: '6.5', value: 6.5 },
                        ],
                      },
                    ]}
                    onChange={(id, val) => {
                      if (id === 'zeta') setZeta(val);
                      if (id === 'omega0') setOmega0(val);
                    }}
                    onReset={() => {
                      setIsSweeping(false);
                      setZeta(0.25);
                      setOmega0(4.0);
                    }}
                    isPlaying={isSweeping}
                    onTogglePlay={() => setIsSweeping((s) => !s)}
                  >
                    <ScientificPlot zeta={zeta} omega0={omega0} />
                  </Manipulate>
                </Pod>

                {/* Pod 3: Booktabs Bifurcation & Spectral Classification Table */}
                <Pod
                  title="3. Spectral Classification & Asymptotic Decay Regimes"
                  subtitle="Booktabs Publication Grammar"
                  domainTag="SYMBOLIC"
                  cellLabel="Out[3]="
                >
                  <BooktabsTable
                    caption="Characteristic eigenvalues λ₁,₂, quality factor Q, and energy relaxation time τ_E across damping regimes."
                    activeZeta={zeta}
                    omega0={omega0}
                    onSelectZeta={setZeta}
                  />
                </Pod>
              </div>
            )}

            {/* ==============================================================
                ARCHETYPE 3: LATEX MONOGRAPH & TUFTE MARGIN SIDENOTES
                ============================================================== */}
            {archetype === 'latex-monograph' && (
              <article className="ads-tufte-grid">
                {/* Main 65ch LaTeX Prose Column */}
                <div className="ads-prose">
                  <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)', marginBottom: '6px' }}>
                    MONOGRAPH SPECIMEN · ARCHIVAL PAPER &amp; SUBTRACTIVE INK
                  </div>

                  <h1 className="ads-display-title" style={{ margin: '0 0 10px 0' }}>
                    § 1. Spectral Dissipation &amp; Symplectic Contraction in Linear Operators
                  </h1>

                  <div
                    style={{
                      fontSize: '0.88em',
                      color: 'var(--ads-ink-graphite, #4B4A46)',
                      marginBottom: '20px',
                      paddingBottom: '12px',
                      borderBottom: '1.5px solid var(--ads-ink-carbon, #141413)',
                    }}
                  >
                    <span className="ads-smallcaps" style={{ fontWeight: 600 }}>
                      Department of Mathematical Physics
                    </span>{' '}
                    — Drag the inline Vernier scrubbers, hover{' '}
                    <CrossRef to="thm:lyapunov" /> or <CrossRef to="eq:greens" />, or click citations{' '}
                    <Cite id="arnold1989" /> and <Cite id="wolfram2002" />.
                  </div>

                  <p>
                    Consider a one-dimensional dissipative mechanical oscillator governed by the dimensionless{' '}
                    <Sym id="zeta">damping ratio ζ</Sym> (currently dialed to{' '}
                    <Scrubber
                      symbolId="zeta"
                      symbolLatex="\zeta"
                      value={zeta}
                      min={0.05}
                      max={1.8}
                      step={0.01}
                      onChange={setZeta}
                    />
                    ) and undamped natural eigenfrequency{' '}
                    <Sym id="omega0">ω₀</Sym> ={' '}
                    <Scrubber
                      symbolId="omega0"
                      symbolLatex="\omega_0"
                      value={omega0}
                      min={1.0}
                      max={8.0}
                      step={0.1}
                      unit="rad/s"
                      onChange={setOmega0}
                    />
                    . Following classical symplectic mechanics <Cite id="arnold1989" />, the causal impulse response is determined by the Green’s kernel{' '}
                    <Sym id="kernel" math="G(t-\tau)" />:
                  </p>

                  <EquationBlock
                    id="eq:greens"
                    number="1.2"
                    latex={`x(t) = \\int_0^t \\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right) f(\\tau)\\,d\\tau`}
                    referencedSymbols={['zeta', 'omega0', 'kernel']}
                  />

                  <FormalBlock
                    id="thm:lyapunov"
                    variant="theorem"
                    number="2.1"
                    title="Lyapunov Phase-Space Contraction"
                  >
                    For any strictly positive damping ratio <InlineMath latex="\zeta > 0" /> and natural frequency{' '}
                    <InlineMath latex="\omega_0 > 0" />, the canonical Hamiltonian energy functional{' '}
                    <Sym id="energy" math="\mathcal{H}(x,\dot{x}) = \frac{1}{2}\dot{x}^2 + \frac{1}{2}\omega_0^2 x^2" />{' '}
                    is a strict Lyapunov function satisfying monotonic dissipation along all non-trivial solutions of{' '}
                    <CrossRef to="eq:greens" />.
                  </FormalBlock>

                  <ProofBlock title="Proof of Theorem 2.1">
                    Differentiating <Sym id="energy" math="\mathcal{H}(x, \dot{x})" /> with respect to time <InlineMath latex="t" /> along a trajectory and substituting{' '}
                    <InlineMath latex="\ddot{x} = -2\zeta\omega_0\dot{x} - \omega_0^2 x" /> yields:
                    <div style={{ margin: '8px 0' }}>
                      <InlineMath latex={`\\frac{d}{dt}\\mathcal{H}(x,\\dot{x}) = \\dot{x}\\ddot{x} + \\omega_0^2 x\\dot{x} = -2\\zeta\\omega_0\\dot{x}^2 = -${(2 * zeta * omega0).toFixed(2)}\\,\\dot{x}^2 \\le 0.`} />
                    </div>
                    By LaSalle’s invariance principle <Cite id="rackauckas2020" />, the largest invariant subset where{' '}
                    <InlineMath latex="\dot{\mathcal{H}} = 0" /> is the equilibrium origin <InlineMath latex="(x, \dot{x}) = (0, 0)" />.
                  </ProofBlock>

                  <div style={{ margin: '1.5em 0' }}>
                    <ScientificPlot zeta={zeta} omega0={omega0} />
                  </div>

                  <AlgorithmBlock
                    number="1.1"
                    title="Symplectic Velocity-Verlet Integrator with Exponential Damping"
                    requireText={
                      <span>
                        Initial state <InlineMath latex="(x_0, v_0)" />, step <InlineMath latex="\Delta t" />, parameters{' '}
                        <Sym id="zeta" math="\zeta" />, <Sym id="omega0" math="\omega_0" />
                      </span>
                    }
                    ensureText={
                      <span>
                        Phase trajectory <InlineMath latex="\{(x_k, v_k)\}_{k=1}^N" /> preserving energy decay rate <InlineMath latex="-2\zeta\omega_0" />
                      </span>
                    }
                    lines={[
                      {
                        line: 1,
                        indent: 0,
                        content: <InlineMath latex="\gamma \gets \exp(-\zeta\omega_0 \Delta t / 2)" />,
                        comment: 'Half-step dissipative factor',
                      },
                      {
                        line: 2,
                        indent: 0,
                        content: (
                          <span>
                            <strong>for</strong> <InlineMath latex="k = 0 \text{ to } N-1" /> <strong>do</strong>
                          </span>
                        ),
                      },
                      {
                        line: 3,
                        indent: 1,
                        content: (
                          <InlineMath latex="v_{k+1/2} \gets \gamma \cdot v_k - \frac{\Delta t}{2}\omega_0^2 x_k" />
                        ),
                        comment: 'Symplectic momentum kick',
                      },
                      {
                        line: 4,
                        indent: 1,
                        content: <InlineMath latex="x_{k+1} \gets x_k + \Delta t \cdot v_{k+1/2}" />,
                        comment: 'Position drift',
                      },
                      {
                        line: 5,
                        indent: 1,
                        content: (
                          <InlineMath latex="v_{k+1} \gets \gamma \cdot (v_{k+1/2} - \frac{\Delta t}{2}\omega_0^2 x_{k+1})" />
                        ),
                      },
                      {
                        line: 6,
                        indent: 0,
                        content: <strong>end for</strong>,
                      },
                    ]}
                  />
                </div>

                {/* Tufte Gutter */}
                <div className="ads-margin-sidenote-desktop" />

                {/* Right-Hand 28ch Margin Sidenote Column */}
                <div className="ads-margin-sidenote-desktop">
                  <MarginSidenoteColumn
                    sidenotes={[
                      {
                        id: 'sn-1',
                        number: 1,
                        title: 'Dual-Register Optical Lock',
                        content: (
                          <span>
                            Notice how inline code <code className="ads-inline-code">config.zeta</code> and inline math{' '}
                            <InlineMath latex="\zeta \in [0,2]" /> share the exact x-height of the Newsreader body prose without stretching line-height.
                          </span>
                        ),
                      },
                      {
                        id: 'sn-2',
                        number: 2,
                        title: 'Vernier Touch & Mouse Gear',
                        content: (
                          <span>
                            Pull your pointer downward while dragging any inline scrubber to shift from{' '}
                            <strong>1×</strong> into <strong>0.1× Fine</strong> or <strong>0.01× Vernier</strong> precision.
                          </span>
                        ),
                      },
                    ]}
                  />
                </div>
              </article>
            )}

            {/* ==============================================================
                ARCHETYPE 4: COMPUTATIONAL NOTEBOOK & GROUNDED AI WORKBENCH
                ============================================================== */}
            {archetype === 'notebook-ide' && (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
                  gap: '18px',
                  alignItems: 'start',
                }}
              >
                {/* Left Column: Bracketed Notebook Cells */}
                <div>
                  <Pod
                    title="1. Symbolic & Numerical Differential Equation Cell"
                    domainTag="SYMBOLIC"
                    cellLabel="In[4]:="
                  >
                    <CodeCell zeta={zeta} omega0={omega0} />
                  </Pod>

                  <Pod
                    title="2. Live Coupled Phase Portrait Output"
                    domainTag="NUMERICAL"
                    cellLabel="Out[4]="
                  >
                    <ScientificPlot zeta={zeta} omega0={omega0} />
                  </Pod>
                </div>

                {/* Right Column: Grounded AI Research Copilot */}
                <div>
                  <Pod
                    title="3. Grounded AI Research Copilot"
                    subtitle="CAS-Verified & Citation-Linked"
                    domainTag="AI-VERIFIED"
                    cellLabel="AI[1]="
                  >
                    <GroundedAIChat />
                  </Pod>

                  <Pod
                    title="4. Spectral Regime Reference Table"
                    domainTag="EXACT"
                    cellLabel="Out[5]="
                  >
                    <BooktabsTable
                      caption="Real-time spectral pole table synchronized with notebook parameters."
                      activeZeta={zeta}
                      omega0={omega0}
                    />
                  </Pod>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* ------------------------------------------------------------------
            RIGHT RAIL: LIVE SYMBOL REGISTRY BUS & TOKEN INSPECTOR
            ------------------------------------------------------------------ */}
        <aside
          aria-label="Live Symbol Bus & Token Inspector"
          className="ads-no-print ads-ui"
          style={{
            position: 'sticky',
            top: '80px',
            padding: '14px 12px',
            borderLeft: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            fontSize: '11.5px',
            display: 'flex',
            flexDirection: 'column',
            gap: '14px',
          }}
        >
          {/* 1. Live SymbolRegistry Bus Monitor */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '8px',
              }}
            >
              <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)' }}>
                L2 SymbolRegistry Bus
              </span>
              <span className="ads-badge-domain" style={{ height: '18px', fontSize: '9.5px' }}>
                {activeSymbolId ? `ACTIVE: ${activeSymbolId}` : 'IDLE'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {Object.values(symbols).map((sym) => {
                const slot = SYMBOL_SLOT_COLORS[sym.slot];
                const isActive = activeSymbolId === sym.id;
                const isPinned = pinnedSymbolId === sym.id;
                return (
                  <div
                    key={sym.id}
                    onMouseEnter={() => hoverSymbol(sym.id)}
                    onMouseLeave={() => hoverSymbol(null)}
                    onClick={() => togglePinSymbol(sym.id)}
                    style={{
                      padding: '6px 8px',
                      borderRadius: '4.5px',
                      backgroundColor: isActive ? slot.bg : 'var(--ads-paper-well)',
                      border: `1px solid ${isActive ? slot.fg : slot.border}`,
                      cursor: 'pointer',
                      transition: 'all 120ms ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        marginBottom: '2px',
                      }}
                    >
                      <span style={{ fontWeight: 600, color: slot.fg }}>
                        <InlineMath latex={sym.latex} /> — {sym.name}
                      </span>
                      {isPinned && <Pin size={10} color={slot.fg} />}
                    </div>
                    <div
                      style={{
                        fontSize: '10.5px',
                        color: 'var(--ads-ink-pencil, #82807A)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      <span>{sym.usedIn.join(' · ')}</span>
                      <span>Slot #{sym.slot}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Registered Cross-Reference Targets */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)',
            }}
          >
            <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)', marginBottom: '8px' }}>
              L2 DocumentRegistry Targets
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
              {Object.values(crossRefs).map((ref) => (
                <div
                  key={ref.id}
                  onClick={() => {
                    setActiveTouchInspection({ type: 'crossref', id: ref.id });
                    document
                      .getElementById(ref.id)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                  }}
                  style={{
                    padding: '5px 8px',
                    borderRadius: '4px',
                    backgroundColor: 'var(--ads-paper-well)',
                    border: '1px solid var(--ads-ink-hairline)',
                    cursor: 'pointer',
                    fontSize: '11px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontWeight: 600,
                    }}
                  >
                    <span style={{ color: 'var(--ads-accent-reference)' }}>
                      {ref.number}
                    </span>
                    <code className="ads-inline-code" style={{ fontSize: '9.5px' }}>
                      #{ref.id}
                    </code>
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: 'var(--ads-ink-graphite)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      marginTop: '1px',
                    }}
                  >
                    {ref.title}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Active StyleX Token Readout (Inter Tabular Property Rows) */}
          <div
            style={{
              padding: '10px 12px',
              borderRadius: '6px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.85)',
            }}
          >
            <div className="ads-eyebrow-mono" style={{ marginBottom: '6px' }}>
              Active Token Contract
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <div className="ads-prop-row">
                <span>Density Axis</span>
                <code className="ads-inline-code">{density}</code>
              </div>
              <div className="ads-prop-row">
                <span>Chroming Axis</span>
                <code className="ads-inline-code">{chroming}</code>
              </div>
              <div className="ads-prop-row">
                <span>Materiality</span>
                <code className="ads-inline-code">{material}</code>
              </div>
              <div className="ads-prop-row">
                <span>Prose Scale</span>
                <span style={{ fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                  {dynamicRootVars['--ads-prose-size' as keyof React.CSSProperties]} /{' '}
                  {dynamicRootVars['--ads-baseline-step' as keyof React.CSSProperties]}
                </span>
              </div>
              <div className="ads-prop-row">
                <span>Booktabs Rules</span>
                <span style={{ fontSize: '11px', color: 'var(--ads-ink-carbon)' }}>
                  0.08em · 0.05em
                </span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* ====================================================================
          TOUCH / MOBILE ACADEMIC INSPECTION BOTTOM SHEET
          ==================================================================== */}
      {activeTouchInspection && (
        <div
          role="dialog"
          aria-label="Academic Provenance & Symbol Inspection Sheet"
          className="ads-no-print ads-floating-lens ads-ui"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '14px',
            transform: 'translateX(-50%)',
            width: 'min(560px, calc(100vw - 28px))',
            padding: '12px 14px',
            zIndex: 80,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '6px',
            }}
          >
            <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)' }}>
              Inspection Sheet · {activeTouchInspection.type.toUpperCase()}
            </span>
            <button
              type="button"
              onClick={() => setActiveTouchInspection(null)}
              className="ads-btn-instrument"
            >
              <X size={11} />
              <span>Close</span>
            </button>
          </div>

          {activeTouchInspection.type === 'symbol' &&
            symbols[activeTouchInspection.id] && (
              <div>
                <div style={{ fontSize: '14px', fontWeight: 700, marginBottom: '4px' }}>
                  <InlineMath latex={symbols[activeTouchInspection.id].latex} /> —{' '}
                  {symbols[activeTouchInspection.id].name}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ads-ink-graphite)' }}>
                  {symbols[activeTouchInspection.id].description}
                </div>
              </div>
            )}

          {activeTouchInspection.type === 'crossref' &&
            crossRefs[activeTouchInspection.id] && (
              <div>
                <div style={{ fontSize: '13.5px', fontWeight: 700, marginBottom: '3px' }}>
                  {crossRefs[activeTouchInspection.id].number}:{' '}
                  {crossRefs[activeTouchInspection.id].title}
                </div>
                <div style={{ fontSize: '12px', color: 'var(--ads-ink-graphite)', marginBottom: '6px' }}>
                  {crossRefs[activeTouchInspection.id].summary}
                </div>
                {crossRefs[activeTouchInspection.id].latexOrPreview && (
                  <div
                    style={{
                      padding: '6px 8px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--ads-paper-well)',
                      fontSize: '12px',
                    }}
                  >
                    <InlineMath
                      latex={crossRefs[activeTouchInspection.id].latexOrPreview!}
                    />
                  </div>
                )}
              </div>
            )}

          {activeTouchInspection.type === 'citation' &&
            citations[activeTouchInspection.id] && (
              <CitationCard
                entry={citations[activeTouchInspection.id]}
                isPinned={pinnedCitations.includes(activeTouchInspection.id)}
                onTogglePin={() => togglePinCitation(activeTouchInspection.id)}
                compact
              />
            )}
        </div>
      )}
    </div>
  );
};
