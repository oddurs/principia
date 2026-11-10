import React, { useState, useMemo, useEffect } from 'react';
import {
  BookOpen,
  Cpu,
  Code2,
  BookmarkPlus,
  Send,
  Sliders,
  Layers,
  Printer,
  AlignJustify,
  Search,
} from 'lucide-react';
import {
  useAcademicSystem,
  DensityMode,
  MaterialPreset,
} from '../core/registry';
import { Pod } from '../primitives/pod/Pod';
import { Scrubber } from '../primitives/compute/Manipulate';
import {
  Sym,
  InlineMath,
  EquationBlock,
  FormalBlock,
  ProofBlock,
} from '../primitives/manuscript/MathAndFormal';
import {
  Cite,
  CrossRef,
  CitationCard,
  MarginSidenoteColumn,
} from '../primitives/manuscript/CitationsAndRefs';
import {
  ScientificPlot,
  BooktabsTable,
  UnitValue,
} from '../primitives/datavis/ScienceAndVis';
import { CodeCell } from '../primitives/compute/CodeAndCopilot';

/**
 * ============================================================================
 * PRINCIPIA STUDIO — DUAL-REGISTER TYPOGRAPHIC ARCHITECTURE
 * ============================================================================
 * "The Editorial Monograph × The Precision Instrument"
 * - Register I (Editorial Monograph): Newsreader optical-size variable serif
 *   (opsz 48 display title, opsz 24 section headings, opsz 16 body prose) +
 *   STIX Two Text + KaTeX mathematical typesetting.
 * - Register II (Precision Instrument): Inter (cv01..cv04, ss01) + JetBrains Mono
 *   (zero, ss01, tabular-nums) across the 44px shell bar, 36px sub-bars, and
 *   property inspector.
 */

export type ScientificModelId =
  | 'damped-oscillator'
  | 'quantum-eigenstates'
  | 'lotka-volterra';

export type WorkspaceLayoutMode =
  | 'hybrid-studio'
  | 'wolfram-pods'
  | 'latex-paper'
  | 'notebook-cells';

export type EditorialVoiceId =
  | 'newsreader-monograph'
  | 'stix-scientific'
  | 'swiss-technical';

export interface ParameterSnapshot {
  id: string;
  timestamp: string;
  model: ScientificModelId;
  zeta: number;
  omega0: number;
  quantumN: number;
  eigenpoleText: string;
  energyDecayRate: string;
}

export interface CopilotMessage {
  id: string;
  role: 'user' | 'assistant';
  verifiedTag?: string;
  reasoningSteps?: string[];
  content: React.ReactNode;
  patch?: {
    id: string;
    title: string;
    corollaryNumber: string;
    corollaryTitle: string;
    corollaryLatex: string;
  };
}

export const PrincipiaApp: React.FC<{
  onOpenCodexStorybook: () => void;
  embeddedInPlatform?: boolean;
}> = ({ onOpenCodexStorybook, embeddedInPlatform = false }) => {
  const {
    symbols,
    hoverSymbol,
    togglePinSymbol,
    citations,
    pinnedCitations,
    togglePinCitation,
    density,
    setDensity,
    setChroming,
    material,
    setMaterial,
    xrayBaseline,
    setXrayBaseline,
  } = useAcademicSystem();

  const [activeModel, setActiveModel] =
    useState<ScientificModelId>('damped-oscillator');
  const [layoutMode, setLayoutMode] =
    useState<WorkspaceLayoutMode>('hybrid-studio');
  const [editorialVoice, setEditorialVoice] =
    useState<EditorialVoiceId>('newsreader-monograph');
  const [cmdPaletteOpen, setCmdPaletteOpen] = useState<boolean>(false);
  const [cmdFilter, setCmdFilter] = useState<string>('');

  useEffect(() => {
    if (embeddedInPlatform) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdPaletteOpen((v) => !v);
      } else if (e.key === 'Escape') {
        setCmdPaletteOpen(false);
      } else if ((e.metaKey || e.ctrlKey) && e.key === '1') {
        e.preventDefault();
        setActiveModel('damped-oscillator');
      } else if ((e.metaKey || e.ctrlKey) && e.key === '2') {
        e.preventDefault();
        setActiveModel('quantum-eigenstates');
      } else if ((e.metaKey || e.ctrlKey) && e.key === '3') {
        e.preventDefault();
        setActiveModel('lotka-volterra');
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [embeddedInPlatform]);

  const [zeta, setZeta] = useState<number>(0.25);
  const [omega0, setOmega0] = useState<number>(4.0);
  const [quantumN, setQuantumN] = useState<number>(2);
  const [lvAlpha, setLvAlpha] = useState<number>(1.1);
  const [lvBeta, setLvBeta] = useState<number>(0.4);

  const [omniQuery, setOmniQuery] = useState<string>(
    'dsolve(x″ + 2ζω₀x′ + ω₀²x = δ(t), ζ=0.25, ω₀=4.0)'
  );

  const [snapshots, setSnapshots] = useState<ParameterSnapshot[]>([
    {
      id: 'snap-1',
      timestamp: 'Run #1',
      model: 'damped-oscillator',
      zeta: 0.15,
      omega0: 4.0,
      quantumN: 1,
      eigenpoleText: '−0.60 ± 3.95i',
      energyDecayRate: '1.20 s⁻¹',
    },
    {
      id: 'snap-2',
      timestamp: 'Run #2',
      model: 'damped-oscillator',
      zeta: 1.0,
      omega0: 4.0,
      quantumN: 2,
      eigenpoleText: '−4.00 (double)',
      energyDecayRate: '8.00 s⁻¹',
    },
  ]);

  const [acceptedPatches, setAcceptedPatches] = useState<
    Array<{
      id: string;
      corollaryNumber: string;
      corollaryTitle: string;
      corollaryLatex: string;
    }>
  >([]);

  const [rightRailTab, setRightRailTab] = useState<
    'copilot' | 'bibliography' | 'symbols'
  >('copilot');
  const [customPrompt, setCustomPrompt] = useState('');

  const [copilotHistory, setCopilotHistory] = useState<CopilotMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      verifiedTag: 'SymPy CAS Verified',
      content: (
        <span>
          At <Sym id="zeta" math={`\\zeta = ${zeta.toFixed(2)}`} /> and{' '}
          <Sym id="omega0" math={`\\omega_0 = ${omega0.toFixed(1)}\\text{ rad/s}`} />, phase-space volume contracts at rate{' '}
          <InlineMath latex={`2\\zeta\\omega_0 = ${(2 * zeta * omega0).toFixed(2)}\\text{ s}^{-1}`} />. You can insert the resonant quality factor corollary directly into <strong>§ 1</strong>.
        </span>
      ),
      patch: {
        id: 'patch-qfactor',
        title: 'Corollary 2.1.1 · Quality Factor & Bandwidth',
        corollaryNumber: '2.1.1',
        corollaryTitle: 'Spectral Quality Factor',
        corollaryLatex: `Q(\\zeta) = \\frac{1}{2\\zeta} = ${(1 / (2 * zeta)).toFixed(2)}, \\qquad \\frac{\\Delta\\omega_{\\text{FWHM}}}{\\omega_0} = 2\\zeta = ${(2 * zeta).toFixed(2)}`,
      },
    },
  ]);

  const eigenpoleSummary = useMemo(() => {
    const disc = 1 - zeta * zeta;
    if (disc > 0) {
      return `−${(zeta * omega0).toFixed(2)} ± ${(omega0 * Math.sqrt(disc)).toFixed(2)}i`;
    }
    if (disc === 0) {
      return `−${(zeta * omega0).toFixed(2)} (double)`;
    }
    return `−${(omega0 * (zeta - Math.sqrt(-disc))).toFixed(2)}, −${(omega0 * (zeta + Math.sqrt(-disc))).toFixed(2)}`;
  }, [zeta, omega0]);

  const handleRecordSnapshot = () => {
    const nextSnap: ParameterSnapshot = {
      id: `snap-${Date.now()}`,
      timestamp: `Run #${snapshots.length + 1}`,
      model: activeModel,
      zeta,
      omega0,
      quantumN,
      eigenpoleText: eigenpoleSummary,
      energyDecayRate: `${(2 * zeta * omega0).toFixed(2)} s⁻¹`,
    };
    setSnapshots((prev) => [nextSnap, ...prev]);
  };

  const handleRunCopilotPrompt = (
    promptText: string,
    presetType?: 'wkb' | 'symplectic' | 'custom'
  ) => {
    if (!promptText.trim()) return;

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: <span>{promptText}</span>,
    };

    let assistantReply: CopilotMessage;

    if (presetType === 'wkb') {
      assistantReply = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        verifiedTag: 'WKB Action Integral Verified',
        content: (
          <span>
            For eigenstate <InlineMath latex={`n = ${quantumN}`} /> at{' '}
            <Sym id="omega0" math={`\\omega_0 = ${omega0.toFixed(1)}\\text{ rad/s}`} />, the Bohr–Sommerfeld action integral yields the exact eigenvalue{' '}
            <InlineMath latex={`E_{${quantumN}} = \\hbar\\omega_0(${quantumN} + \\tfrac{1}{2}) = ${((quantumN + 0.5) * omega0).toFixed(2)}\\,\\hbar`} />.
          </span>
        ),
        patch: {
          id: `patch-wkb-${Date.now()}`,
          title: 'Corollary 2.1.2 · WKB Exactness for Quadratic Potentials',
          corollaryNumber: `2.1.${acceptedPatches.length + 2}`,
          corollaryTitle: 'WKB Semiclassical Exactness',
          corollaryLatex: `\\frac{1}{2\\pi}\\oint \\sqrt{2m\\left(E_n - \\frac{1}{2}m\\omega_0^2 x^2\\right)}\\,dx = \\hbar\\!\\left(n + \\frac{1}{2}\\right) \\implies E_{${quantumN}} = ${((quantumN + 0.5) * omega0).toFixed(2)}\\,\\hbar`,
        },
      };
    } else {
      assistantReply = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        verifiedTag: 'Symplectic Shadow Analysis',
        content: (
          <span>
            For <em>“{promptText}”</em>: under Velocity-Verlet splitting with{' '}
            <Sym id="zeta" math={`\\zeta = ${zeta.toFixed(2)}`} />, the modified shadow Hamiltonian{' '}
            <Sym id="energy" math="\\tilde{\\mathcal{H}}" /> remains bounded within <InlineMath latex="\\mathcal{O}(\\Delta t^2)" /> of <CrossRef to="eq:greens" />.
          </span>
        ),
      };
    }

    setCopilotHistory((prev) => [...prev, userMsg, assistantReply]);
    setCustomPrompt('');
  };

  const selectedFontStack =
    editorialVoice === 'newsreader-monograph'
      ? '"Newsreader", "STIX Two Text", Georgia, serif'
      : editorialVoice === 'stix-scientific'
      ? '"STIX Two Text", "Newsreader", Georgia, serif'
      : '"Inter", -apple-system, BlinkMacSystemFont, sans-serif';

  const dynamicStyleVars: React.CSSProperties = {
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
    '--ads-pod-padding-y':
      density === 'manuscript' ? '24px' : density === 'workbench' ? '20px' : '14px',
    '--ads-pod-padding-x':
      density === 'manuscript' ? '28px' : density === 'workbench' ? '24px' : '18px',
    '--ads-pod-gap':
      density === 'manuscript' ? '22px' : density === 'workbench' ? '18px' : '14px',
    '--ads-block-margin-y':
      density === 'manuscript' ? '20px' : density === 'workbench' ? '16px' : '12px',
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
    '--ads-font-display': selectedFontStack,
    '--ads-font-prose': selectedFontStack,
    '--ads-font-chrome':
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    '--ads-font-mono': '"JetBrains Mono", monospace',
  } as React.CSSProperties;

  return (
    <div
      data-xray-baseline={xrayBaseline ? 'true' : 'false'}
      style={{
        ...dynamicStyleVars,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--ads-paper-canvas)',
        color: 'var(--ads-ink-carbon, #141413)',
      }}
    >
      {/* ====================================================================
          APPLICATION TOP BAR (Exact 44px height, Instrument Register)
          ==================================================================== */}
      <header
        className="ads-no-print ads-ui"
        style={{
          position: 'sticky',
          top: embeddedInPlatform ? '44px' : 0,
          zIndex: 35,
          height: embeddedInPlatform ? '38px' : '44px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '0 16px',
          backgroundColor: embeddedInPlatform
            ? 'var(--ads-paper-well, #F7F5F0)'
            : 'oklch(1 0 0 / 0.92)',
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '12px',
        }}
      >
        {/* Left: Brand, Breadcrumb & Active Kernel Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          <span
            style={{
              fontWeight: 600,
              fontSize: '13px',
              letterSpacing: '-0.015em',
              color: 'var(--ads-ink-carbon, #141413)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '7px',
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '2px',
                backgroundColor: 'var(--ads-accent-compute)',
              }}
            />
            Principia
          </span>

          <span style={{ color: 'var(--ads-ink-hairline, #E4E2DC)' }}>/</span>

          <span
            style={{
              fontFamily: 'var(--ads-font-display)',
              fontStyle: 'italic',
              color: 'var(--ads-ink-graphite, #4E4D49)',
              fontSize: '14px',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {activeModel === 'damped-oscillator'
              ? 'Spectral Green’s Operators'
              : activeModel === 'quantum-eigenstates'
              ? 'Hermite Quantum Eigenstates'
              : 'Symplectic Phase Orbits'}
          </span>
        </div>

        {/* Center: Segmented Workspace Switcher */}
        <div
          role="tablist"
          aria-label="Principia Workspace Modes"
          className="ads-pill-group"
          style={{ height: '25px', padding: '2px' }}
        >
          {(
            [
              { id: 'hybrid-studio', label: 'Studio', icon: <Layers size={11} /> },
              { id: 'wolfram-pods', label: 'Pods', icon: <Cpu size={11} /> },
              { id: 'latex-paper', label: 'Manuscript', icon: <BookOpen size={11} /> },
              { id: 'notebook-cells', label: 'Notebook', icon: <Code2 size={11} /> },
            ] as const
          ).map((m) => {
            const active = layoutMode === m.id;
            return (
              <button
                key={m.id}
                type="button"
                data-active={active ? 'true' : 'false'}
                className="ads-pill-btn"
                onClick={() => {
                  setLayoutMode(m.id);
                  if (m.id === 'latex-paper') {
                    setChroming('seamless');
                    setDensity('manuscript');
                  } else if (m.id === 'notebook-cells') {
                    setChroming('bracketed');
                    setDensity('workbench');
                  } else {
                    setChroming('framed');
                  }
                }}
                style={{ height: '19px', padding: '0 8.5px', fontSize: '11.5px' }}
              >
                {m.icon}
                <span>{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Command Palette, Typographic Voice, Material, Scale & Codex Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          <button
            type="button"
            onClick={() => setCmdPaletteOpen(true)}
            className="ads-btn-instrument"
            title="Open Command & Symbol Palette (⌘K)"
            style={{ height: '24px', padding: '0 7px', gap: '6px' }}
          >
            <Search size={11} />
            <span style={{ color: 'var(--ads-ink-pencil)' }}>Jump / Symbols</span>
            <span className="ads-kbd" style={{ height: '15px', fontSize: '9.5px' }}>
              ⌘K
            </span>
          </button>

          <select
            aria-label="Typographic Voice"
            value={editorialVoice}
            onChange={(e) => setEditorialVoice(e.target.value as EditorialVoiceId)}
            className="ads-btn-instrument"
            style={{ height: '24px', padding: '0 6px' }}
          >
            <option value="newsreader-monograph">Voice: Newsreader (Optical)</option>
            <option value="stix-scientific">Voice: AMS STIX Two</option>
            <option value="swiss-technical">Voice: Swiss Inter</option>
          </select>

          <select
            aria-label="Theme Materiality"
            value={material}
            onChange={(e) => setMaterial(e.target.value as MaterialPreset)}
            className="ads-btn-instrument"
            style={{ height: '24px', padding: '0 6px' }}
          >
            <option value="archival-wolfram">Archival Paper</option>
            <option value="swiss-lab">Swiss White</option>
            <option value="oxford-monograph">Oxford Sepia</option>
          </select>

          <select
            aria-label="Density Mode"
            value={density}
            onChange={(e) => setDensity(e.target.value as DensityMode)}
            className="ads-btn-instrument"
            style={{ height: '24px', padding: '0 6px' }}
          >
            <option value="manuscript">17px Monograph</option>
            <option value="workbench">15.5px Workbench</option>
            <option value="compact">14px Compact</option>
          </select>

          <button
            type="button"
            data-active={xrayBaseline ? 'true' : 'false'}
            className="ads-btn-instrument"
            onClick={() => setXrayBaseline(!xrayBaseline)}
            title="Toggle 1rlh vertical rhythm baseline grid"
            style={{
              height: '24px',
              fontFamily: 'var(--ads-font-chrome)',
              fontSize: '11px',
            }}
          >
            <AlignJustify size={11} />
            <span>1rlh</span>
          </button>

          <button
            type="button"
            className="ads-btn-instrument"
            onClick={() => window.print()}
            title="Export PDF"
            style={{ width: '24px', height: '24px', padding: 0 }}
          >
            <Printer size={11} />
          </button>

          <button
            type="button"
            className="ads-btn-instrument"
            onClick={onOpenCodexStorybook}
            style={{ height: '24px', padding: '0 9px' }}
          >
            <Sliders size={11} />
            <span>Codex</span>
          </button>
        </div>
      </header>

      {/* ====================================================================
          ⌘K COMMAND & MATHEMATICAL SYMBOL PALETTE (Frosted Archival Lens)
          ==================================================================== */}
      {cmdPaletteOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Principia Command and Symbol Palette"
          onClick={() => setCmdPaletteOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(20, 20, 19, 0.18)',
            backdropFilter: 'blur(2px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '11vh',
          }}
        >
          <div
            className="ads-floating-lens ads-ui"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%',
              maxWidth: '520px',
              overflow: 'hidden',
              fontSize: '12.5px',
            }}
          >
            {/* Search Input Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 14px',
                borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              }}
            >
              <Search size={14} color="var(--ads-ink-pencil)" />
              <input
                type="text"
                autoFocus
                value={cmdFilter}
                onChange={(e) => setCmdFilter(e.target.value)}
                placeholder="Jump to section, pin mathematical symbol, or switch voice..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontSize: '13px',
                  color: 'var(--ads-ink-carbon)',
                }}
              />
              <span className="ads-kbd">ESC</span>
            </div>

            <div
              style={{
                maxHeight: '360px',
                overflowY: 'auto',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
              }}
            >
              {/* Group 1: Mathematical Symbols */}
              <div>
                <div className="ads-section-label" style={{ padding: '0 8px 4px 8px' }}>
                  Mathematical Symbols (Click to Pin &amp; Highlight)
                </div>
                {Object.values(symbols)
                  .filter(
                    (s) =>
                      !cmdFilter ||
                      s.name.toLowerCase().includes(cmdFilter.toLowerCase()) ||
                      s.id.toLowerCase().includes(cmdFilter.toLowerCase())
                  )
                  .map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      className="ads-nav-item"
                      onMouseEnter={() => hoverSymbol(s.id)}
                      onMouseLeave={() => hoverSymbol(null)}
                      onClick={() => {
                        togglePinSymbol(s.id);
                        setCmdPaletteOpen(false);
                      }}
                    >
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ width: '28px', textAlign: 'center' }}>
                          <InlineMath latex={s.latex} />
                        </span>
                        <span style={{ fontWeight: 500, color: 'var(--ads-ink-carbon)' }}>
                          {s.name}
                        </span>
                      </span>
                      <span style={{ fontSize: '11.5px', color: 'var(--ads-ink-pencil)' }}>
                        <InlineMath latex={s.domain} />
                      </span>
                    </button>
                  ))}
              </div>

              {/* Group 2: Physical Models */}
              <div>
                <div className="ads-section-label" style={{ padding: '0 8px 4px 8px' }}>
                  Physical Models
                </div>
                {(
                  [
                    {
                      id: 'damped-oscillator',
                      label: 'Damped Harmonic Oscillator — Green’s Propagator',
                      kbd: '⌘1',
                    },
                    {
                      id: 'quantum-eigenstates',
                      label: 'Quantum Harmonic Oscillator — Hermite Eigenstates',
                      kbd: '⌘2',
                    },
                    {
                      id: 'lotka-volterra',
                      label: 'Lotka–Volterra — Symplectic Predator–Prey Orbits',
                      kbd: '⌘3',
                    },
                  ] as const
                )
                  .filter(
                    (m) =>
                      !cmdFilter ||
                      m.label.toLowerCase().includes(cmdFilter.toLowerCase())
                  )
                  .map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      data-active={activeModel === m.id ? 'true' : 'false'}
                      className="ads-nav-item"
                      onClick={() => {
                        setActiveModel(m.id);
                        setCmdPaletteOpen(false);
                      }}
                    >
                      <span>{m.label}</span>
                      <span className="ads-kbd">{m.kbd}</span>
                    </button>
                  ))}
              </div>

              {/* Group 3: Manuscript Sections */}
              <div>
                <div className="ads-section-label" style={{ padding: '0 8px 4px 8px' }}>
                  Manuscript Sections
                </div>
                {[
                  { id: 'sec-query', idx: '§ 1', label: 'Exact Symbolic Formulation & Stability' },
                  { id: 'thm:lyapunov', idx: 'Thm 2.1', label: 'Lyapunov Phase-Space Contraction' },
                  { id: 'fig:phase', idx: '§ 2', label: 'Impulse Response, Phase Portrait & Root Locus' },
                  { id: 'sec-snapshots', idx: '§ 3', label: 'Spectral Classification & Booktabs Table' },
                  { id: 'sec-code', idx: '§ 4', label: 'Julia Symbolic-Numerical Verification' },
                ]
                  .filter(
                    (sec) =>
                      !cmdFilter ||
                      sec.label.toLowerCase().includes(cmdFilter.toLowerCase())
                  )
                  .map((sec) => (
                    <button
                      key={sec.id}
                      type="button"
                      className="ads-nav-item"
                      onClick={() => {
                        setCmdPaletteOpen(false);
                        document
                          .getElementById(sec.id)
                          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }}
                    >
                      <span>{sec.label}</span>
                      <span
                        style={{
                          fontFamily: 'var(--ads-font-display)',
                          fontStyle: 'italic',
                          fontSize: '12px',
                          color: 'var(--ads-ink-pencil)',
                        }}
                      >
                        {sec.idx}
                      </span>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ====================================================================
          MAIN 3-PANE FLUSH HAIRLINE WORKSPACE
          ==================================================================== */}
      <div
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns:
            layoutMode === 'latex-paper'
              ? '216px minmax(0, 1fr)'
              : '216px minmax(0, 1fr) 284px',
          alignItems: 'start',
        }}
      >
        {/* ------------------------------------------------------------------
            LEFT PANE: FLUSH SIDEBAR & PROPERTY INSPECTOR (216px width)
            ------------------------------------------------------------------ */}
        <aside
          className="ads-no-print ads-ui"
          style={{
            position: 'sticky',
            top: embeddedInPlatform ? '82px' : '44px',
            height: embeddedInPlatform ? 'calc(100vh - 82px)' : 'calc(100vh - 44px)',
            overflowY: 'auto',
            backgroundColor: 'var(--ads-paper-desk)',
            borderRight: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Section 1: Physical Models */}
          <div
            style={{
              padding: '12px',
              borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            }}
          >
            <div
              className="ads-section-label"
              style={{ padding: '0 8px', marginBottom: '6px' }}
            >
              Models
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {(
                [
                  {
                    id: 'damped-oscillator',
                    title: 'Damped Oscillator',
                    shortcut: '⌘1',
                  },
                  {
                    id: 'quantum-eigenstates',
                    title: 'Quantum Eigenstates',
                    shortcut: '⌘2',
                  },
                  {
                    id: 'lotka-volterra',
                    title: 'Lotka–Volterra Orbit',
                    shortcut: '⌘3',
                  },
                ] as const
              ).map((m) => {
                const active = activeModel === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    data-active={active ? 'true' : 'false'}
                    className="ads-nav-item"
                    onClick={() => setActiveModel(m.id)}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '7px',
                        minWidth: 0,
                      }}
                    >
                      <span
                        style={{
                          width: '5px',
                          height: '5px',
                          borderRadius: '50%',
                          backgroundColor: active
                            ? 'var(--ads-accent-compute)'
                            : 'var(--ads-ink-hairline)',
                          flexShrink: 0,
                        }}
                      />
                      <span
                        style={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {m.title}
                      </span>
                    </span>
                    <span className="ads-kbd">{m.shortcut}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 2: Linear-Style Parameter Property List */}
          <div
            style={{
              padding: '12px',
              borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 4px',
                marginBottom: '10px',
              }}
            >
              <span className="ads-section-label">Parameters</span>
              <button
                type="button"
                onClick={handleRecordSnapshot}
                title="Save parameter snapshot to Table"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  height: '20px',
                  padding: '0 6px',
                  borderRadius: '3.5px',
                  border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                  backgroundColor: '#FFFFFF',
                  color: 'var(--ads-ink-graphite, #4E4D49)',
                  fontSize: '10.5px',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                <BookmarkPlus size={10} />
                Snapshot
              </button>
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                padding: '0 4px',
              }}
            >
              <div>
                <div className="ads-prop-row" style={{ marginBottom: '4px' }}>
                  <span>
                    Damping <InlineMath latex="\zeta" />
                  </span>
                  <Scrubber
                    symbolId="zeta"
                    value={zeta}
                    min={0.05}
                    max={1.8}
                    step={0.01}
                    onChange={setZeta}
                  />
                </div>
                <input
                  type="range"
                  className="ads-range-slider"
                  min={0.05}
                  max={1.8}
                  step={0.01}
                  value={zeta}
                  onChange={(e) => setZeta(parseFloat(e.target.value))}
                />
              </div>

              <div>
                <div className="ads-prop-row" style={{ marginBottom: '4px' }}>
                  <span>
                    Frequency <InlineMath latex="\omega_0" />
                  </span>
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
                <input
                  type="range"
                  className="ads-range-slider"
                  min={1.0}
                  max={8.0}
                  step={0.1}
                  value={omega0}
                  onChange={(e) => setOmega0(parseFloat(e.target.value))}
                />
              </div>

              {activeModel === 'quantum-eigenstates' && (
                <div>
                  <div className="ads-prop-row" style={{ marginBottom: '4px' }}>
                    <span>
                      Eigenstate <InlineMath latex="n" />
                    </span>
                    <span
                      style={{
                        fontFamily: 'var(--ads-font-chrome)',
                        fontSize: '11.5px',
                        fontWeight: 500,
                        color: 'var(--ads-ink-carbon)',
                      }}
                    >
                      n = {quantumN}
                    </span>
                  </div>
                  <div className="ads-pill-group" style={{ width: '100%' }}>
                    {[0, 1, 2, 3, 4, 5].map((nLvl) => (
                      <button
                        key={nLvl}
                        type="button"
                        data-active={quantumN === nLvl ? 'true' : 'false'}
                        className="ads-pill-btn"
                        onClick={() => setQuantumN(nLvl)}
                        style={{ flex: 1 }}
                      >
                        {nLvl}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeModel === 'lotka-volterra' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <div className="ads-prop-row">
                    <span>Prey growth α</span>
                    <Scrubber
                      value={lvAlpha}
                      min={0.4}
                      max={2.2}
                      step={0.05}
                      onChange={setLvAlpha}
                    />
                  </div>
                  <div className="ads-prop-row">
                    <span>Predation β</span>
                    <Scrubber
                      value={lvBeta}
                      min={0.1}
                      max={1.2}
                      step={0.05}
                      onChange={setLvBeta}
                    />
                  </div>
                </div>
              )}

              {/* Compact Readout Summary Rows */}
              <div
                style={{
                  marginTop: '2px',
                  paddingTop: '8px',
                  borderTop: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px',
                }}
              >
                <div className="ads-prop-row">
                  <span style={{ color: 'var(--ads-ink-pencil)' }}>Poles λ₁,₂</span>
                  <span
                    style={{
                      fontFamily: 'var(--ads-font-chrome)',
                      fontSize: '11.5px',
                      fontWeight: 500,
                      color: 'var(--ads-ink-carbon)',
                    }}
                  >
                    {eigenpoleSummary}
                  </span>
                </div>
                <div className="ads-prop-row">
                  <span style={{ color: 'var(--ads-ink-pencil)' }}>Decay 2ζω₀</span>
                  <span
                    style={{
                      fontFamily: 'var(--ads-font-chrome)',
                      fontSize: '11.5px',
                      fontWeight: 500,
                      color: 'var(--ads-ink-carbon)',
                    }}
                  >
                    {(2 * zeta * omega0).toFixed(2)} s⁻¹
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Document Outline */}
          <div style={{ padding: '12px' }}>
            <div
              className="ads-section-label"
              style={{ padding: '0 8px', marginBottom: '6px' }}
            >
              Contents
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {[
                { id: 'sec-query', idx: '§ 1', label: 'Symbolic Formulation' },
                { id: 'thm:lyapunov', idx: '2.1', label: 'Lyapunov Contraction' },
                { id: 'fig:phase', idx: '§ 2', label: 'Phase Portrait' },
                { id: 'sec-snapshots', idx: '§ 3', label: 'Spectral Regimes' },
                { id: 'sec-code', idx: '§ 4', label: 'Julia Verification' },
              ].map((sec) => (
                <button
                  key={sec.id}
                  type="button"
                  className="ads-nav-item"
                  onClick={() =>
                    document
                      .getElementById(sec.id)
                      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                  }
                  style={{ height: '26px', justifyContent: 'flex-start', gap: '8px' }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--ads-font-display)',
                      fontStyle: 'italic',
                      fontSize: '12px',
                      width: '22px',
                      color: 'var(--ads-ink-pencil)',
                    }}
                  >
                    {sec.idx}
                  </span>
                  <span>{sec.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* ------------------------------------------------------------------
            CENTER PANE: FLUSH COMMAND SUB-BAR + MONOGRAPH STAGE
            ------------------------------------------------------------------ */}
        <main
          className="ads-xray-stage ads-manuscript-container"
          style={{
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Sticky 36px Symbolic Command Sub-Bar (Aligns with Right Pane Tab Bar) */}
          <div
            id="sec-query"
            className="ads-no-print ads-ui"
            style={{
              position: 'sticky',
              top: embeddedInPlatform ? '82px' : '44px',
              zIndex: 30,
              height: '36px',
              padding: '0 20px',
              backgroundColor: 'oklch(0.996 0.001 85 / 0.94)',
              backdropFilter: 'blur(8px)',
              borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                flex: 1,
                minWidth: 0,
              }}
            >
              <span
                style={{
                  color: 'var(--ads-accent-compute)',
                  fontFamily: 'var(--ads-font-mono)',
                  fontSize: '13.5px',
                  fontWeight: 700,
                }}
              >
                =
              </span>
              <input
                type="text"
                value={omniQuery}
                onChange={(e) => setOmniQuery(e.target.value)}
                aria-label="Symbolic expression input"
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  background: 'transparent',
                  fontFamily: 'var(--ads-font-mono)',
                  fontSize: '12px',
                  color: 'var(--ads-ink-carbon)',
                  minWidth: 0,
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {(
                [
                  {
                    id: 'damped-oscillator',
                    label: 'Green’s Kernel',
                    q: 'dsolve(x″ + 2ζω₀x′ + ω₀²x = δ(t), ζ=0.25, ω₀=4.0)',
                  },
                  {
                    id: 'quantum-eigenstates',
                    label: 'Quantum ψₙ(x)',
                    q: 'eigenstates -ℏ²/(2m) ψ″ + ½mω₀²x²ψ = Eₙψ',
                  },
                  {
                    id: 'lotka-volterra',
                    label: 'Phase Orbit',
                    q: 'phase_orbit u̇ = αu - βuv, v̇ = δuv - γv',
                  },
                ] as const
              ).map((preset) => {
                const active = activeModel === preset.id;
                return (
                  <button
                    key={preset.id}
                    type="button"
                    onClick={() => {
                      setActiveModel(preset.id);
                      setOmniQuery(preset.q);
                    }}
                    style={{
                      height: '22px',
                      padding: '0 8px',
                      borderRadius: '4px',
                      border: active
                        ? '1px solid var(--ads-ink-hairline, #E4E2DC)'
                        : '1px solid transparent',
                      backgroundColor: active ? '#FFFFFF' : 'transparent',
                      color: active
                        ? 'var(--ads-ink-carbon)'
                        : 'var(--ads-ink-pencil)',
                      fontWeight: active ? 500 : 400,
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Focused Monograph & Pod Column */}
          <div
            style={{
              width: '100%',
              maxWidth: '800px',
              margin: '0 auto',
              padding: '22px 26px 64px 26px',
            }}
          >
            {/* ==============================================================
                MONOGRAPH FRONTMATTER MASTHEAD & ABSTRACT LEDGER
                ============================================================== */}
            <header
              style={{
                marginBottom: '24px',
              }}
            >
              {/* Double-Rule Journal Masthead Strip */}
              <div
                className="ads-eyebrow-mono"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  padding: '6px 0',
                  borderTop: '1.5px solid var(--ads-ink-carbon, #141413)',
                  borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                  marginBottom: '18px',
                }}
              >
                <span>PRINCIPIA MATHEMATICA · VOL. IV, NO. 2</span>
                <span>COMPUTATIONAL & SYMPLECTIC MECHANICS</span>
                <span>DOI: 10.1103/PhysRevX.14.02104</span>
              </div>

              {/* Sculptural Optical-Size Display Headline (H1) */}
              <h1
                className="ads-display-title"
                style={{
                  margin: '0 0 12px 0',
                }}
              >
                {activeModel === 'damped-oscillator' && (
                  <>
                    Spectral <em>Green’s Operators</em> &amp; <em>Lyapunov Contraction</em> in Dissipative Mechanics
                  </>
                )}
                {activeModel === 'quantum-eigenstates' && (
                  <>
                    Canonical Quantization &amp; <em>Hermite Eigenstates</em> of the Harmonic Potential
                  </>
                )}
                {activeModel === 'lotka-volterra' && (
                  <>
                    <em>Symplectic Invariants</em> &amp; Nonlinear Phase Orbits in Predator–Prey Kinetics
                  </>
                )}
              </h1>

              {/* Author & Affiliation Byline */}
              <div
                className="ads-prose"
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'baseline',
                  justifyContent: 'space-between',
                  gap: '8px',
                  fontSize: '15px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                  marginBottom: '16px',
                }}
              >
                <div>
                  <span className="ads-smallcaps" style={{ fontWeight: 600 }}>
                    E. Noether
                  </span>
                  <sup>1</sup>,{' '}
                  <span className="ads-smallcaps" style={{ fontWeight: 600 }}>
                    V. I. Arnold
                  </span>
                  <sup>2</sup>, and{' '}
                  <span className="ads-smallcaps" style={{ fontWeight: 600 }}>
                    S. Wolfram
                  </span>
                  <sup>3</sup>
                  <span
                    style={{
                      color: 'var(--ads-ink-pencil, #82807A)',
                      fontStyle: 'italic',
                      marginLeft: '10px',
                      fontSize: '14px',
                    }}
                  >
                    ¹Göttingen · ²Steklov Institute · ³Principia Symbolic Lab
                  </span>
                </div>

                <div style={{ fontSize: '14px', color: 'var(--ads-ink-graphite)' }}>
                  Refs. <Cite id="arnold1989" />, <Cite id="wolfram2002" />,{' '}
                  <Cite id="rackauckas2020" />
                </div>
              </div>

              {/* 2-Column Editorial Abstract & Live Invariant Ledger */}
              <div
                className="ads-abstract-grid"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'minmax(0, 1.75fr) minmax(220px, 1fr)',
                  gap: '20px',
                  paddingBottom: '18px',
                  borderBottom: '0.08em solid var(--ads-ink-carbon, #141413)',
                }}
              >
                <div
                  className="ads-prose"
                  style={{
                    fontSize: 'var(--ads-secondary-prose-size, 14.5px)',
                    lineHeight: 1.6,
                    color: 'var(--ads-ink-graphite, #4E4D49)',
                  }}
                >
                  <span
                    className="ads-smallcaps"
                    style={{
                      fontWeight: 700,
                      color: 'var(--ads-ink-carbon, #141413)',
                      marginRight: '0.4em',
                    }}
                  >
                    Abstract —
                  </span>
                  We construct exact spectral propagators and phase-space volume invariants across parametrized dynamical regimes. Scrubbing dissipation{' '}
                  <Scrubber
                    symbolId="zeta"
                    symbolLatex="\zeta"
                    value={zeta}
                    min={0.05}
                    max={1.8}
                    step={0.01}
                    onChange={setZeta}
                  />{' '}
                  or natural frequency{' '}
                  <Scrubber
                    symbolId="omega0"
                    symbolLatex="\omega_0"
                    value={omega0}
                    min={1.0}
                    max={8.0}
                    step={0.1}
                    unit="rad/s"
                    onChange={setOmega0}
                  />{' '}
                  updates the analytical poles, phase portraits, and symbolic verification cells in real time.
                </div>

                <div
                  style={{
                    borderLeft: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                    paddingLeft: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    gap: '4px',
                  }}
                >
                  <div className="ads-eyebrow-mono" style={{ marginBottom: '2px' }}>
                    Live Spectral Invariants
                  </div>
                  <div className="ads-prop-row">
                    <span style={{ fontFamily: 'var(--ads-font-prose)', fontStyle: 'italic' }}>
                      Characteristic poles <InlineMath latex="\lambda_{1,2}" />
                    </span>
                    <span
                      style={{
                        fontFamily: '"KaTeX_Main", var(--ads-font-prose, serif)',
                        fontVariantNumeric: 'tabular-nums',
                        fontSize: '12.5px',
                        fontWeight: 500,
                        color: 'var(--ads-ink-carbon)',
                      }}
                    >
                      {eigenpoleSummary}
                    </span>
                  </div>
                  <div className="ads-prop-row">
                    <span style={{ fontFamily: 'var(--ads-font-prose)', fontStyle: 'italic' }}>
                      Quality factor <InlineMath latex="Q(\zeta)" />
                    </span>
                    <UnitValue value={(1 / (2 * zeta)).toFixed(2)} unit="" />
                  </div>
                  <div className="ads-prop-row">
                    <span style={{ fontFamily: 'var(--ads-font-prose)', fontStyle: 'italic' }}>
                      Phase contraction <InlineMath latex="2\zeta\omega_0" />
                    </span>
                    <UnitValue value={(2 * zeta * omega0).toFixed(2)} unit="s⁻¹" />
                  </div>
                </div>
              </div>
            </header>

            {/* POD 1: SYMBOLIC FORMULATION & THEOREMS */}
            <Pod
              title="1. Exact Symbolic Formulation & Stability"
              domainTag="EXACT"
              cellLabel="Out[1]"
              assumptions={[
                {
                  id: 'Hilbert',
                  label: 'domain',
                  current: 'Sobolev H²(ℝ⁺)',
                  alternatives: ['Schwartz S′(ℝ)', 'L²(ℝ)'],
                },
              ]}
              latexSource={
                activeModel === 'quantum-eigenstates'
                  ? `\\psi_n(x) = \\frac{1}{\\sqrt{2^n n!}}\\left(\\frac{m\\omega_0}{\\pi\\hbar}\\right)^{1/4} e^{-\\frac{m\\omega_0 x^2}{2\\hbar}} H_n\\!\\left(\\sqrt{\\frac{m\\omega_0}{\\hbar}}x\\right)`
                  : `x(t) = \\int_0^t \\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right) f(\\tau)\\,d\\tau`
              }
            >
              <div className="ads-prose">
                <p>
                  For dimensionless dissipation parameter{' '}
                  <Scrubber
                    symbolId="zeta"
                    symbolLatex="\zeta"
                    value={zeta}
                    min={0.05}
                    max={1.8}
                    step={0.01}
                    onChange={setZeta}
                  />{' '}
                  and natural frequency{' '}
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
                  , following <Cite id="arnold1989" /> and <CrossRef to="fig:phase" />, the causal evolution operator takes the closed spectral form:
                </p>

                {activeModel === 'damped-oscillator' && (
                  <EquationBlock
                    id="eq:greens"
                    number="1.2"
                    latex={`x(t) = \\int_0^t \\underbrace{\\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right)}_{G(t-\\tau)} f(\\tau)\\,d\\tau`}
                    referencedSymbols={['zeta', 'omega0', 'kernel']}
                  />
                )}

                {activeModel === 'quantum-eigenstates' && (
                  <EquationBlock
                    id="eq:greens"
                    number="1.2"
                    latex={`\\psi_{${quantumN}}(x) = \\frac{1}{\\sqrt{2^{${quantumN}} ${quantumN}!}}\\left(\\frac{m\\omega_0}{\\pi\\hbar}\\right)^{\\!1/4} e^{-\\frac{m\\omega_0 x^2}{2\\hbar}} H_{${quantumN}}\\!\\left(\\sqrt{\\frac{m\\omega_0}{\\hbar}}\\,x\\right), \\quad E_{${quantumN}} = ${((quantumN + 0.5) * omega0).toFixed(2)}\\,\\hbar`}
                    referencedSymbols={['omega0', 'energy']}
                  />
                )}

                {activeModel === 'lotka-volterra' && (
                  <EquationBlock
                    id="eq:greens"
                    number="1.2"
                    latex={`\\mathcal{H}_{\\text{LV}}(u, v) = \\delta u - \\gamma \\ln u + \\beta v - \\alpha \\ln v = \\text{const}, \\quad (u^*, v^*) = \\left(\\frac{\\gamma}{\\delta}, \\frac{${lvAlpha.toFixed(2)}}{${lvBeta.toFixed(2)}}\\right)`}
                    referencedSymbols={['zeta', 'energy']}
                  />
                )}

                <FormalBlock
                  id="thm:lyapunov"
                  variant="theorem"
                  number="2.1"
                  title="Lyapunov Phase-Space Contraction"
                >
                  Along any trajectory of <CrossRef to="eq:greens" />, the canonical energy functional{' '}
                  <Sym id="energy" math="\mathcal{H}(q, p)" /> decays monotonically at rate{' '}
                  <InlineMath latex={`\\dot{\\mathcal{H}} = -2\\zeta\\omega_0 \\dot{q}^2 = -${(2 * zeta * omega0).toFixed(2)}\\,\\dot{q}^2 \\le 0`} />.
                </FormalBlock>

                {acceptedPatches.map((patch) => (
                  <FormalBlock
                    key={patch.id}
                    variant="corollary"
                    number={patch.corollaryNumber}
                    title={patch.corollaryTitle}
                  >
                    <InlineMath latex={patch.corollaryLatex} />.
                  </FormalBlock>
                ))}

                <ProofBlock title="Proof of Theorem 2.1" defaultExpanded={false}>
                  Applying Liouville’s divergence theorem <Cite id="arnold1989" /> to{' '}
                  <InlineMath latex="\mathbf{F}(x, v) = (v, -2\zeta\omega_0 v - \omega_0^2 x)" /> gives{' '}
                  <InlineMath latex="\nabla \cdot \mathbf{F} = -2\zeta\omega_0 < 0" />, contracting phase volume as <InlineMath latex="|\Omega_t| = |\Omega_0|e^{-2\zeta\omega_0 t}" />.
                </ProofBlock>
              </div>
            </Pod>

            {/* POD 2: INTERACTIVE VISUALIZATION */}
            <Pod
              title={
                activeModel === 'quantum-eigenstates'
                  ? `2. Hermite Wavefunction & Quantized Phase Orbit`
                  : activeModel === 'lotka-volterra'
                  ? '2. Predator–Prey Kinetics & Symplectic Phase Orbit'
                  : '2. Impulse Response, Phase Portrait & Spectral Root Locus'
              }
              domainTag="NUMERICAL"
              cellLabel="Out[2]"
            >
              <ScientificPlot
                zeta={zeta}
                omega0={omega0}
                model={activeModel}
                quantumN={quantumN}
                lvAlpha={lvAlpha}
                lvBeta={lvBeta}
              />
            </Pod>

            {/* POD 3: BOOKTABS TABLES */}
            <div id="sec-snapshots">
              <Pod
                title="3. Spectral Classification & Recorded Runs"
                domainTag="EMPIRICAL"
                cellLabel="Out[3]"
              >
                <BooktabsTable
                  caption={
                    <span>
                      Analytical classification of characteristic eigenvalues{' '}
                      <InlineMath latex="\lambda_{1,2}" /> and energy relaxation time{' '}
                      <InlineMath latex="\tau_E" />.
                    </span>
                  }
                  activeZeta={zeta}
                  omega0={omega0}
                  onSelectZeta={setZeta}
                />

                {snapshots.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        marginBottom: '8px',
                      }}
                    >
                      <div
                        className="ads-prose"
                        style={{
                          fontSize: 'var(--ads-secondary-prose-size, 13.5px)',
                          color: 'var(--ads-ink-carbon, #141413)',
                        }}
                      >
                        <strong className="ads-smallcaps" style={{ fontWeight: 700, marginRight: '6px' }}>
                          Table 1.2.
                        </strong>
                        <span style={{ color: 'var(--ads-ink-graphite, #4E4D49)' }}>
                          Recorded parameter snapshot ledger (click any row to restore state).
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleRecordSnapshot}
                        className="ads-btn-instrument ads-no-print"
                      >
                        <BookmarkPlus size={10} />
                        <span>Record Current Run</span>
                      </button>
                    </div>

                    <div className="ads-booktabs-scroll">
                      <table className="ads-booktabs-table">
                        <thead>
                          <tr>
                            <th colSpan={3} style={{ textAlign: 'left', padding: '6px 10px 2px 10px' }}>
                              <span className="ads-cmidrule" style={{ marginRight: '8px' }}>
                                Run Identification &amp; Parameters
                              </span>
                            </th>
                            <th colSpan={3} style={{ textAlign: 'right', padding: '6px 10px 2px 10px' }}>
                              <span className="ads-cmidrule" style={{ marginLeft: '4px' }}>
                                Computed Spectral Telemetry
                              </span>
                            </th>
                          </tr>
                          <tr>
                            <th style={{ textAlign: 'left', padding: '5px 10px 7px 10px' }}>Run ID</th>
                            <th style={{ textAlign: 'right', padding: '5px 10px 7px 10px' }}>
                              Damping <InlineMath latex="\zeta" />
                            </th>
                            <th style={{ textAlign: 'right', padding: '5px 10px 7px 10px' }}>
                              <InlineMath latex="\omega_0" />{' '}
                              <span style={{ fontWeight: 400, color: 'var(--ads-ink-pencil)', fontSize: '10px' }}>
                                [rad/s]
                              </span>
                            </th>
                            <th style={{ textAlign: 'right', padding: '5px 10px 7px 10px' }}>
                              Poles <InlineMath latex="\lambda_{1,2}" />{' '}
                              <span style={{ fontWeight: 400, color: 'var(--ads-ink-pencil)', fontSize: '10px' }}>
                                [s⁻¹]
                              </span>
                            </th>
                            <th style={{ textAlign: 'right', padding: '5px 10px 7px 10px' }}>
                              Quality <InlineMath latex="Q" />
                            </th>
                            <th style={{ textAlign: 'right', padding: '5px 10px 7px 10px' }}>
                              Contraction <InlineMath latex="2\zeta\omega_0" />
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {snapshots.map((s) => {
                            const isRowActive =
                              Math.abs(s.zeta - zeta) < 0.005 &&
                              Math.abs(s.omega0 - omega0) < 0.05;
                            return (
                              <tr
                                key={s.id}
                                data-active-row={isRowActive ? 'true' : 'false'}
                                onClick={() => {
                                  setZeta(s.zeta);
                                  setOmega0(s.omega0);
                                }}
                                style={{ cursor: 'pointer' }}
                                title="Click to restore this parameter snapshot"
                              >
                                <td
                                  className="ads-cell-text"
                                  style={{
                                    padding: '6.5px 10px',
                                    fontWeight: isRowActive ? 600 : 500,
                                  }}
                                >
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                    <span
                                      style={{
                                        width: '5px',
                                        height: '5px',
                                        borderRadius: '50%',
                                        backgroundColor: isRowActive
                                          ? 'var(--ads-accent-compute)'
                                          : 'oklch(0.84 0.008 82)',
                                      }}
                                    />
                                    <span>{s.timestamp}</span>
                                  </span>
                                </td>
                                <td className="ads-cell-num" style={{ padding: '6.5px 10px' }}>
                                  {s.zeta.toFixed(2)}
                                </td>
                                <td className="ads-cell-num" style={{ padding: '6.5px 10px' }}>
                                  {s.omega0.toFixed(2)}
                                </td>
                                <td className="ads-cell-num" style={{ padding: '6.5px 10px' }}>
                                  {s.eigenpoleText}
                                </td>
                                <td className="ads-cell-num" style={{ padding: '6.5px 10px' }}>
                                  {(1 / (2 * s.zeta)).toFixed(2)}
                                </td>
                                <td
                                  className="ads-cell-num"
                                  style={{ padding: '6.5px 10px', fontWeight: 500 }}
                                >
                                  {s.energyDecayRate}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </Pod>
            </div>

            {/* POD 4: EXECUTABLE CODE CELL */}
            <div id="sec-code">
              <Pod
                title="4. Symbolic & Numerical Verification"
                domainTag="SYMBOLIC"
                cellLabel="In[4]"
              >
                <CodeCell zeta={zeta} omega0={omega0} />
              </Pod>
            </div>
          </div>
        </main>

        {/* ------------------------------------------------------------------
            RIGHT PANE: RESEARCH COPILOT & INSPECTOR (284px width)
            ------------------------------------------------------------------ */}
        {layoutMode !== 'latex-paper' && (
          <aside
            className="ads-no-print ads-ui"
            style={{
              position: 'sticky',
              top: embeddedInPlatform ? '82px' : '44px',
              height: embeddedInPlatform ? 'calc(100vh - 82px)' : 'calc(100vh - 44px)',
              display: 'flex',
              flexDirection: 'column',
              borderLeft: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              fontSize: '12px',
            }}
          >
            {/* Right Pane Sub-Tabs (Exact 36px height aligned with Center Sub-Bar) */}
            <div
              style={{
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '0 16px',
                borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                backgroundColor: 'oklch(0.996 0.001 85)',
              }}
            >
              {(
                [
                  { id: 'copilot', label: 'Assistant' },
                  { id: 'bibliography', label: `References (${Object.keys(citations).length})` },
                  { id: 'symbols', label: 'Symbols' },
                ] as const
              ).map((t) => {
                const active = rightRailTab === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setRightRailTab(t.id)}
                    style={{
                      height: '36px',
                      padding: 0,
                      border: 'none',
                      borderBottom: active
                        ? '2px solid var(--ads-ink-carbon, #141413)'
                        : '2px solid transparent',
                      backgroundColor: 'transparent',
                      fontWeight: active ? 600 : 400,
                      fontSize: '12px',
                      color: active
                        ? 'var(--ads-ink-carbon, #141413)'
                        : 'var(--ads-ink-pencil, #82807A)',
                      cursor: 'pointer',
                    }}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: COPILOT */}
            {rightRailTab === 'copilot' && (
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    overflowY: 'auto',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                  }}
                >
                  {copilotHistory.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        paddingBottom: '14px',
                        borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '5px',
                          fontSize: '10.5px',
                          fontFamily: 'var(--ads-font-mono)',
                          fontWeight: 500,
                          color:
                            msg.role === 'user'
                              ? 'var(--ads-ink-carbon)'
                              : 'var(--ads-accent-verified, #1B7F5A)',
                          marginBottom: '5px',
                        }}
                      >
                        <span
                          style={{
                            width: '5px',
                            height: '5px',
                            borderRadius: '50%',
                            backgroundColor:
                              msg.role === 'user'
                                ? 'var(--ads-ink-carbon)'
                                : 'oklch(0.52 0.14 160)',
                          }}
                        />
                        {msg.role === 'user' ? 'USER QUERY' : msg.verifiedTag ?? 'VERIFIED'}
                      </div>

                      <div
                        className="ads-prose"
                        style={{
                          fontSize: '14.5px',
                          lineHeight: 1.56,
                          color: 'var(--ads-ink-carbon)',
                        }}
                      >
                        {msg.content}
                      </div>

                      {msg.patch && (
                        <div
                          style={{
                            marginTop: '10px',
                            padding: '10px 12px',
                            borderRadius: '5px',
                            backgroundColor: 'var(--ads-paper-well)',
                            border: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '11.5px',
                              fontWeight: 600,
                              marginBottom: '6px',
                              color: 'var(--ads-ink-graphite)',
                            }}
                          >
                            {msg.patch.title}
                          </div>
                          <div
                            style={{
                              padding: '8px 10px',
                              borderRadius: '4px',
                              backgroundColor: '#FFFFFF',
                              border: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
                              marginBottom: '8px',
                              fontSize: '12.5px',
                              overflowX: 'auto',
                            }}
                          >
                            <InlineMath latex={msg.patch.corollaryLatex} />
                          </div>
                          <button
                            type="button"
                            disabled={acceptedPatches.some((p) => p.id === msg.patch!.id)}
                            onClick={() => {
                              if (!msg.patch) return;
                              setAcceptedPatches((prev) => [
                                ...prev,
                                {
                                  id: msg.patch!.id,
                                  corollaryNumber: msg.patch!.corollaryNumber,
                                  corollaryTitle: msg.patch!.corollaryTitle,
                                  corollaryLatex: msg.patch!.corollaryLatex,
                                },
                              ]);
                              document
                                .getElementById('thm:lyapunov')
                                ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }}
                            style={{
                              width: '100%',
                              height: '26px',
                              borderRadius: '4px',
                              border: 'none',
                              backgroundColor: acceptedPatches.some(
                                (p) => p.id === msg.patch!.id
                              )
                                ? 'var(--ads-paper-well)'
                                : 'var(--ads-ink-carbon)',
                              color: acceptedPatches.some(
                                (p) => p.id === msg.patch!.id
                              )
                                ? 'var(--ads-ink-pencil)'
                                : '#FFFFFF',
                              fontSize: '11.5px',
                              fontWeight: 500,
                              cursor: 'pointer',
                            }}
                          >
                            {acceptedPatches.some((p) => p.id === msg.patch!.id)
                              ? 'Inserted in § 1'
                              : 'Insert Corollary into Manuscript'}
                          </button>
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Suggested Prompts */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <span className="ads-section-label" style={{ marginBottom: '2px' }}>
                      Suggestions
                    </span>
                    <button
                      type="button"
                      className="ads-nav-item"
                      onClick={() =>
                        handleRunCopilotPrompt(
                          `Derive WKB quantization for n=${quantumN}, ω₀=${omega0.toFixed(1)}`,
                          'wkb'
                        )
                      }
                      style={{ height: '26px', fontSize: '11.5px' }}
                    >
                      <span>Derive WKB Eigenvalue Corollary</span>
                      <span style={{ color: 'var(--ads-ink-pencil)' }}>→</span>
                    </button>
                    <button
                      type="button"
                      className="ads-nav-item"
                      onClick={() =>
                        handleRunCopilotPrompt(
                          `Verify Velocity-Verlet symplectic shadow error at ζ=${zeta.toFixed(2)}`,
                          'symplectic'
                        )
                      }
                      style={{ height: '26px', fontSize: '11.5px' }}
                    >
                      <span>Check Verlet Shadow Hamiltonian</span>
                      <span style={{ color: 'var(--ads-ink-pencil)' }}>→</span>
                    </button>
                  </div>
                </div>

                {/* Prompt Input */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleRunCopilotPrompt(customPrompt, 'custom');
                  }}
                  style={{
                    padding: '10px 12px',
                    borderTop: '1px solid var(--ads-ink-hairline)',
                    display: 'flex',
                    gap: '6px',
                  }}
                >
                  <input
                    type="text"
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Ask to derive or verify..."
                    style={{
                      flex: 1,
                      height: '28px',
                      padding: '0 10px',
                      borderRadius: '4px',
                      border: '1px solid var(--ads-ink-hairline)',
                      backgroundColor: 'var(--ads-paper-well)',
                      fontSize: '12px',
                      outline: 'none',
                    }}
                  />
                  <button
                    type="submit"
                    data-variant="primary"
                    data-size="sm"
                    className="ads-btn"
                    style={{
                      width: '28px',
                      height: '28px',
                      padding: 0,
                    }}
                  >
                    <Send size={12} />
                  </button>
                </form>
              </div>
            )}

            {/* TAB 2: BIBLIOGRAPHY */}
            {rightRailTab === 'bibliography' && (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {Object.values(citations).map((entry) => (
                  <CitationCard
                    key={entry.id}
                    entry={entry}
                    isPinned={pinnedCitations.includes(entry.id)}
                    onTogglePin={() => togglePinCitation(entry.id)}
                    compact
                  />
                ))}
              </div>
            )}

            {/* TAB 3: SYMBOLS */}
            {rightRailTab === 'symbols' && (
              <div style={{ flex: 1, overflowY: 'auto', padding: '14px' }}>
                <MarginSidenoteColumn />
              </div>
            )}
          </aside>
        )}
      </div>
    </div>
  );
};
