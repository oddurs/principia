import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  AlignJustify,
  Pin,
} from 'lucide-react';
import {
  useAcademicSystem,
  SYMBOL_SLOT_COLORS,
  ChromingMode,
  DensityMode,
  MaterialPreset,
} from '../core/registry';
import { DocPageId, StoryComponentId, PrototypeAppId } from './navigation';
import { Pod } from '../primitives/pod/Pod';
import { Scrubber } from '../primitives/compute/Manipulate';
import {
  Sym,
  InlineMath,
  EquationBlock,
  FormalBlock,
  ProofBlock,
  AlgorithmBlock,
} from '../primitives/manuscript/MathAndFormal';
import { Cite, CrossRef } from '../primitives/manuscript/CitationsAndRefs';
import {
  ScientificPlot,
  BooktabsTable,
} from '../primitives/datavis/ScienceAndVis';
import { TensorBadge } from '../primitives/compute/CodeAndCopilot';
import {
  Button,
  Badge,
  Input,
  MetricCard,
  Callout,
} from '../primitives/general/GeneralFoundation';

export interface DocsPortalPageProps {
  activeDoc: DocPageId;
  onSelectDoc: (doc: DocPageId) => void;
  onNavigateStory: (story: StoryComponentId) => void;
  onNavigatePrototype: (proto: PrototypeAppId) => void;
}

const DOC_CHAPTERS: Array<{
  id: DocPageId;
  num: string;
  title: string;
  category: string;
}> = [
  {
    id: 'getting-started',
    num: '01',
    title: 'Architecture & Getting Started',
    category: 'Foundations',
  },
  {
    id: 'typography',
    num: '02',
    title: 'Dual-Register Typography',
    category: 'Foundations',
  },
  {
    id: 'colors-materiality',
    num: '03',
    title: 'OKLCH Paper & Ink Tokens',
    category: 'Foundations',
  },
  {
    id: 'grid-hardware',
    num: '04',
    title: '4px Grid & Hardware Chrome',
    category: 'Foundations',
  },
  {
    id: 'math-formal',
    num: '05',
    title: 'Mathematical & Formal Grammar',
    category: 'Domain Pillars',
  },
  {
    id: 'datavis-booktabs',
    num: '06',
    title: 'Scientific DataVis & Booktabs',
    category: 'Domain Pillars',
  },
  {
    id: 'symbol-bus',
    num: '07',
    title: 'L2 Symbol & Document Bus',
    category: 'Domain Pillars',
  },
];

export const DocsPortalPage: React.FC<DocsPortalPageProps> = ({
  activeDoc,
  onSelectDoc,
  onNavigateStory,
  onNavigatePrototype,
}) => {
  const {
    symbols,
    activeSymbolId,
    pinnedSymbolId,
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

  const [zeta, setZeta] = useState<number>(0.25);
  const [omega0] = useState<number>(4.0);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const handleCopy = (str: string) => {
    navigator.clipboard?.writeText(str);
    setCopiedToken(str);
    window.setTimeout(() => setCopiedToken(null), 1500);
  };

  const currentIdx = DOC_CHAPTERS.findIndex((c) => c.id === activeDoc);
  const prevChapter = currentIdx > 0 ? DOC_CHAPTERS[currentIdx - 1] : null;
  const nextChapter =
    currentIdx < DOC_CHAPTERS.length - 1 ? DOC_CHAPTERS[currentIdx + 1] : null;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '240px minmax(0, 1fr) 268px',
        alignItems: 'start',
        minHeight: 'calc(100vh - 52px)',
      }}
    >
      {/* ====================================================================
          LEFT RAIL: DOCUMENTATION CHAPTER NAVIGATION
          ==================================================================== */}
      <aside
        aria-label="Documentation Chapters"
        className="ads-ui"
        style={{
          position: 'sticky',
          top: '52px',
          height: 'calc(100vh - 52px)',
          overflowY: 'auto',
          padding: '20px 14px',
          borderRight: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          backgroundColor: 'var(--ads-paper-desk, #F5F3EE)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0 8px',
              marginBottom: '12px',
            }}
          >
            <BookOpen size={13} color="var(--ads-accent-reference)" />
            <span style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--ads-ink-carbon)' }}>
              System Specification
            </span>
          </div>

          {(['Foundations', 'Domain Pillars'] as const).map((cat) => (
            <div key={cat} style={{ marginBottom: '16px' }}>
              <div className="ads-section-label" style={{ padding: '0 8px', marginBottom: '4px' }}>
                {cat}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {DOC_CHAPTERS.filter((c) => c.category === cat).map((chap) => (
                  <button
                    key={chap.id}
                    type="button"
                    data-active={activeDoc === chap.id ? 'true' : 'false'}
                    className="ads-nav-item"
                    onClick={() => onSelectDoc(chap.id)}
                  >
                    <span>{chap.title}</span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: 'var(--ads-ink-pencil)',
                        fontVariantNumeric: 'tabular-nums',
                      }}
                    >
                      {chap.num}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Quick-Jump to Storybook */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
            border: '1px solid var(--ads-ink-hairline)',
          }}
        >
          <div style={{ fontSize: '11px', fontWeight: 600, marginBottom: '4px' }}>
            Interactive Component Lab
          </div>
          <div style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)', marginBottom: '8px' }}>
            Inspect all 12 primitives in isolation with live prop controls.
          </div>
          <button
            type="button"
            onClick={() => onNavigateStory('pod')}
            className="ads-btn-instrument"
            style={{ width: '100%', justifyContent: 'space-between', padding: '0 8px' }}
          >
            <span>Open Storybook</span>
            <ArrowRight size={11} />
          </button>
        </div>
      </aside>

      {/* ====================================================================
          CENTER STAGE: DOCUMENTATION ARTICLE SHEET
          ==================================================================== */}
      <main
        className="ads-xray-stage ads-manuscript-container"
        style={{
          padding: '32px 36px 80px 36px',
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <article
          style={{
            width: '100%',
            maxWidth: '860px',
            backgroundColor: 'var(--ads-paper-canvas, #FBF9F6)',
            border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            borderRadius: '8px',
            padding: '36px 44px',
            boxShadow:
              '0 2px 12px rgba(20, 20, 19, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
          }}
        >
          {copiedToken && (
            <div
              className="ads-ui ads-floating-lens"
              style={{
                position: 'fixed',
                bottom: '20px',
                right: '24px',
                zIndex: 90,
                padding: '8px 12px',
                borderRadius: '6px',
                color: 'var(--ads-ink-carbon, #141413)',
                fontSize: '11.5px',
                fontWeight: 500,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <Check size={12} color="oklch(0.45 0.14 160)" />
              <span>Copied: {copiedToken}</span>
            </div>
          )}

          {/* ----------------------------------------------------------------
              CHAPTER 01: ARCHITECTURE & GETTING STARTED
              ---------------------------------------------------------------- */}
          {activeDoc === 'getting-started' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1.5px solid var(--ads-ink-carbon)', paddingBottom: '16px' }}>
                <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)', marginBottom: '6px' }}>
                  CHAPTER 01 · SYSTEM ARCHITECTURE
                </div>
                <h1 className="ads-display-title" style={{ margin: '0 0 8px 0' }}>
                  Architecture &amp; Getting Started
                </h1>
                <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  <code className="ads-inline-code">@principia/core</code> is structured as a
                  4-layer generalist &amp; scientific user interface engine uniting <InlineMath latex="\LaTeX" />{' '}
                  typography, Wolfram Alpha computable pods, Edward Tufte’s analytical graphics,
                  and Linear’s high-density instrument chrome.
                </p>
              </div>

              {/* 4-Layer Architecture Diagram Table */}
              <Pod
                title="1. The Four-Layer Architectural Stack (L1–L4)"
                subtitle="Strict separation between tokens, reactive symbol state, primitives, and archetypes"
                domainTag="EXACT"
              >
                <div className="ads-ui" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {[
                    {
                      layer: 'L4 · Application Archetypes',
                      files: 'PrincipiaApp.tsx · CodexApp.tsx',
                      desc: 'Complete domain workbenches: Hybrid Research Studio, Wolfram Compute Engine, Tufte LaTeX Monograph, and Bracketed Notebook IDE.',
                      accent: 'var(--ads-accent-compute)',
                    },
                    {
                      layer: 'L3 · Six Domain Component Pillars',
                      files: 'Pod · Manipulate · MathAndFormal · CitationsAndRefs · ScienceAndVis · CodeAndCopilot',
                      desc: '12 composable React primitives supporting @container queries, hover-reveal TeX/Typst copy, and declarative SVG plotting.',
                      accent: 'var(--ads-accent-reference)',
                    },
                    {
                      layer: 'L2 · Coupled Symbol & Document Registry Bus',
                      files: 'src/core/registry.tsx (<AcademicSystemProvider />)',
                      desc: 'Zero-latency cross-highlighting of mathematical variables (ζ, ω₀, ℋ, G), non-jumping cross-reference lenses, and bibliography pinning.',
                      accent: 'oklch(0.46 0.14 160)',
                    },
                    {
                      layer: 'L1 · Universal Foundation & StyleX Tokens',
                      files: 'src/tokens/tokens.stylex.ts · src/styles/foundation.css',
                      desc: 'Dual-Register typography (Newsreader Optical + Inter Tabular + JetBrains Mono), OKLCH archival paper surfaces, and 4px harmonic rhythm.',
                      accent: 'oklch(0.48 0.16 310)',
                    },
                  ].map((item) => (
                    <div
                      key={item.layer}
                      style={{
                        padding: '12px 14px',
                        borderRadius: '6px',
                        backgroundColor: 'var(--ads-paper-well)',
                        border: '1px solid var(--ads-ink-hairline)',
                        borderLeft: `3px solid ${item.accent}`,
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                        <span style={{ fontWeight: 600, fontSize: '12.5px', color: 'var(--ads-ink-carbon)' }}>
                          {item.layer}
                        </span>
                        <code className="ads-inline-code" style={{ fontSize: '10.5px' }}>
                          {item.files}
                        </code>
                      </div>
                      <div style={{ fontSize: '12px', color: 'var(--ads-ink-graphite)', lineHeight: 1.45 }}>
                        {item.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </Pod>

              {/* Installation & Provider Setup */}
              <Pod
                title="2. Installation & Provider Bootstrap"
                subtitle="Wrap your application root in AcademicSystemProvider"
                domainTag="SYMBOLIC"
              >
                <pre
                  className="ads-code-block"
                  style={{
                    margin: 0,
                    padding: '14px 16px',
                    borderRadius: '6px',
                    backgroundColor: 'var(--ads-paper-well)',
                    border: '1px solid var(--ads-ink-hairline)',
                    fontSize: '12px',
                    lineHeight: 1.55,
                    overflowX: 'auto',
                  }}
                >
                  <code>{`import '@principia/core/styles/foundation.css';
import { AcademicSystemProvider, Pod, EquationBlock, ScientificPlot } from '@principia/core';

export function App() {
  return (
    <AcademicSystemProvider>
      <Pod title="1. Damped Harmonic Response" domainTag="EXACT">
        <EquationBlock number="1.1" latex="\\ddot{x} + 2\\zeta\\omega_0\\dot{x} + \\omega_0^2 x = \\delta(t)" />
        <ScientificPlot zeta={0.25} omega0={4.0} />
      </Pod>
    </AcademicSystemProvider>
  );
}`}</code>
                </pre>
              </Pod>
            </div>
          )}

          {/* ----------------------------------------------------------------
              CHAPTER 02: DUAL-REGISTER TYPOGRAPHY & OPTICAL SCALE
              ---------------------------------------------------------------- */}
          {activeDoc === 'typography' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1.5px solid var(--ads-ink-carbon)', paddingBottom: '16px' }}>
                <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)', marginBottom: '6px' }}>
                  CHAPTER 02 · TYPOGRAPHIC ARCHITECTURE
                </div>
                <h1 className="ads-display-title" style={{ margin: '0 0 8px 0' }}>
                  Dual-Register Typography &amp; Optical Sizing
                </h1>
                <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  Scientific interfaces often fail by overusing monospace fonts for UI labels or
                  pairing incompatible sans-serif prose with <InlineMath latex="\LaTeX" /> formulas.
                  We solve this with a strict <strong>Two-Register Typographic Contract</strong>.
                </p>
              </div>

              <Pod
                title="1. Typographic Token & Optical Axis Specification"
                subtitle="Newsreader (opsz 6..72) + STIX Two Text + Inter (tabular-nums) + JetBrains Mono"
                domainTag="EXACT"
                headerExtra={
                  <button
                    type="button"
                    data-active={xrayBaseline ? 'true' : 'false'}
                    onClick={() => setXrayBaseline(!xrayBaseline)}
                    className="ads-btn-instrument"
                  >
                    <AlignJustify size={10} />
                    <span>{xrayBaseline ? 'Hide 1rlh Laser' : 'Toggle 1rlh Laser'}</span>
                  </button>
                }
              >
                <div className="ads-booktabs-scroll">
                  <table className="ads-booktabs-table">
                    <thead>
                      <tr>
                        <th colSpan={2} style={{ textAlign: 'left', padding: '6px 10px 2px 10px' }}>
                          <span className="ads-cmidrule" style={{ marginRight: '8px' }}>
                            Register &amp; OpenType Contract
                          </span>
                        </th>
                        <th colSpan={2} style={{ textAlign: 'left', padding: '6px 10px 2px 10px' }}>
                          <span className="ads-cmidrule" style={{ marginLeft: '4px' }}>
                            Calibrated Scale &amp; Live Specimen
                          </span>
                        </th>
                      </tr>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '5px 10px 7px 10px' }}>CSS Class</th>
                        <th style={{ textAlign: 'left', padding: '5px 10px 7px 10px' }}>
                          Typeface &amp; OpenType Features
                        </th>
                        <th style={{ textAlign: 'right', padding: '5px 10px 7px 10px' }}>
                          Default Scale
                        </th>
                        <th style={{ textAlign: 'left', padding: '5px 10px 7px 10px' }}>
                          Live Rendered Specimen
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 10px' }}>
                          <code className="ads-inline-code">.ads-display-title</code>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--ads-ink-graphite)' }}>
                          Newsreader · opsz 48 · dlig · lnum
                        </td>
                        <td className="ads-cell-num" style={{ padding: '8px 10px' }}>
                          26px / 1.15 (−0.022em)
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span className="ads-display-title" style={{ fontSize: '21px' }}>
                            Symplectic Mechanics
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 10px' }}>
                          <code className="ads-inline-code">.ads-section-heading</code>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--ads-ink-graphite)' }}>
                          Newsreader · opsz 24 · wt 600 · lnum
                        </td>
                        <td className="ads-cell-num" style={{ padding: '8px 10px' }}>
                          16px / 1.25 (−0.014em)
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span className="ads-section-heading">§ 1.2 Green’s Propagator</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 10px' }}>
                          <code className="ads-inline-code">.ads-prose</code>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--ads-ink-graphite)' }}>
                          Newsreader · opsz 16 · calt · lnum
                        </td>
                        <td className="ads-cell-num" style={{ padding: '8px 10px' }}>
                          15.5px / 1.60 (65ch)
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span className="ads-prose" style={{ fontSize: '15px' }}>
                            For <InlineMath latex="\zeta = 0.25" />, energy decays at{' '}
                            <InlineMath latex="-2\zeta\omega_0" />.
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 10px' }}>
                          <code className="ads-inline-code">.ads-ui</code>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--ads-ink-graphite)' }}>
                          Inter · cv01..04 · tabular-nums
                        </td>
                        <td className="ads-cell-num" style={{ padding: '8px 10px' }}>
                          12px / 20px (−0.011em)
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <span className="ads-badge-domain">EXACT · −1.00 ± 3.87i</span>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 10px' }}>
                          <code className="ads-inline-code">.ads-inline-code</code>
                        </td>
                        <td style={{ padding: '8px 10px', fontSize: '12px', color: 'var(--ads-ink-graphite)' }}>
                          JetBrains Mono · zero · ss01
                        </td>
                        <td className="ads-cell-num" style={{ padding: '8px 10px' }}>
                          0.81em (baseline locked)
                        </td>
                        <td style={{ padding: '8px 10px' }}>
                          <code className="ads-inline-code">SymPy.dsolve(eq, x(t))</code>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Pod>

              <Pod
                title="2. Single-Line Quad-Font & Tall Summation Baseline Torture Test"
                subtitle="Zero line-height expansion via .ads-math-inline line-height: 0 strut guard"
                domainTag="THEOREM"
              >
                <div className="ads-prose">
                  In a single continuous paragraph, <strong>Newsreader Optical Serif</strong>, tall
                  inline summation{' '}
                  <InlineMath latex="\sum_{n=1}^\infty \frac{e^{-\zeta\omega_0 n}}{n^2} = \text{Li}_2(e^{-\zeta\omega_0})" />,
                  interactive Vernier scrubber{' '}
                  <Scrubber
                    symbolId="zeta"
                    symbolLatex="\zeta"
                    value={zeta}
                    min={0.05}
                    max={1.8}
                    step={0.01}
                    onChange={setZeta}
                  />
                  , inline code <code className="ads-inline-code">config.zeta</code>, and instrument
                  badge <span className="ads-badge-domain">OUT[1]</span> coexist on the exact same
                  baseline without stretching paragraph leading.
                </div>
              </Pod>
            </div>
          )}

          {/* ----------------------------------------------------------------
              CHAPTER 03: OKLCH PAPER, INK & SYMBOL PALETTE
              ---------------------------------------------------------------- */}
          {activeDoc === 'colors-materiality' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1.5px solid var(--ads-ink-carbon)', paddingBottom: '16px' }}>
                <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)', marginBottom: '6px' }}>
                  CHAPTER 03 · PERCEPTUAL COLOR &amp; MATERIALITY
                </div>
                <h1 className="ads-display-title" style={{ margin: '0 0 8px 0' }}>
                  OKLCH Paper Surfaces, Carbon Ink &amp; Symbol Palette
                </h1>
                <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  All surfaces and inks are specified in the perceptual{' '}
                  <code className="ads-inline-code">OKLCH</code> color space along warm paper hue
                  angles (<InlineMath latex="78^\circ\text{–}85^\circ" />). Click any swatch below
                  to copy its CSS variable.
                </p>
              </div>

              <Pod
                title="1. Archival Paper Surface Tokens (--ads-paper-*)"
                subtitle="Click any card to copy CSS custom property"
                domainTag="EXACT"
              >
                <div
                  className="ads-ui"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '10px',
                  }}
                >
                  {[
                    { token: '--ads-paper-desk', hex: '#F5F3EE', oklch: 'oklch(0.964 0.004 82)', role: 'Viewport surround' },
                    { token: '--ads-paper-canvas', hex: '#FBF9F6', oklch: 'oklch(0.986 0.003 85)', role: 'Manuscript sheet' },
                    { token: '--ads-paper-plate', hex: '#FFFFFF', oklch: 'oklch(1.000 0.000 0)', role: 'Elevated Pod stage' },
                    { token: '--ads-paper-well', hex: '#F7F5F0', oklch: 'oklch(0.974 0.004 83)', role: 'Recessed control tray' },
                  ].map((s) => (
                    <button
                      key={s.token}
                      type="button"
                      onClick={() => handleCopy(`var(${s.token})`)}
                      style={{
                        padding: '12px',
                        borderRadius: '6px',
                        backgroundColor: s.hex,
                        border: '1px solid var(--ads-ink-hairline)',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, fontSize: '11.5px' }}>
                        <span>{s.token}</span>
                        <Copy size={10} />
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)', margin: '4px 0' }}>
                        {s.role}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--ads-ink-pencil)' }}>{s.oklch}</div>
                    </button>
                  ))}
                </div>
              </Pod>

              <Pod
                title="2. 8-Slot Subtractive Symbol Palette (mix-blend-mode: multiply)"
                subtitle="Equal perceptual lightness (L ≈ 0.93 bg / L ≈ 0.45 fg) prevents visual bias"
                domainTag="SYMBOLIC"
              >
                <div
                  className="ads-ui"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '8px',
                  }}
                >
                  {([1, 2, 3, 4, 5, 6, 7, 8] as const).map((slotNum) => {
                    const c = SYMBOL_SLOT_COLORS[slotNum];
                    return (
                      <div
                        key={slotNum}
                        onClick={() => handleCopy(c.fg)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '5px',
                          backgroundColor: c.bg,
                          border: `1px solid ${c.border}`,
                          color: c.fg,
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 700, fontSize: '12px' }}>
                          Slot #{slotNum} · {c.label}
                        </div>
                        <div style={{ fontSize: '10.5px', opacity: 0.85, marginTop: '2px' }}>
                          {c.fg}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Pod>
            </div>
          )}

          {/* ----------------------------------------------------------------
              CHAPTER 04: 4PX SUB-GRID & TACTILE HARDWARE CHROME
              ---------------------------------------------------------------- */}
          {activeDoc === 'grid-hardware' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1.5px solid var(--ads-ink-carbon)', paddingBottom: '16px' }}>
                <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)', marginBottom: '6px' }}>
                  CHAPTER 04 · SPATIAL RHYTHM &amp; HARDWARE
                </div>
                <h1 className="ads-display-title" style={{ margin: '0 0 8px 0' }}>
                  4px Harmonic Sub-Grid &amp; Tactile Instrument Chrome
                </h1>
                <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  Controls follow a strict 4px sub-grid (<code className="ads-inline-code">18px</code> keycaps,{' '}
                  <code className="ads-inline-code">20px</code> badges,{' '}
                  <code className="ads-inline-code">22px</code> buttons,{' '}
                  <code className="ads-inline-code">28px</code> nav rows,{' '}
                  <code className="ads-inline-code">36px</code> sub-bars,{' '}
                  <code className="ads-inline-code">44px</code> shell headers) with rim-lit surface
                  physics.
                </p>
              </div>

              <Pod
                title="1. Generalist UI Foundation & Tactile Hardware Primitives"
                subtitle="Buttons, Badges, Inputs, Metric Cards, and Callouts engineered on the 4px harmonic sub-grid"
                domainTag="NUMERICAL"
                headerExtra={
                  <button
                    type="button"
                    onClick={() => onNavigateStory('buttons-badges')}
                    className="ads-btn-instrument"
                  >
                    <span>Open Foundation Storybook</span>
                    <ArrowRight size={10} />
                  </button>
                }
              >
                <div className="ads-ui" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                    <Button variant="primary" size="sm" kbd="⌘↵">
                      Primary Action
                    </Button>
                    <Button variant="compute" size="sm">
                      Compute Action
                    </Button>
                    <Button variant="secondary" size="sm">
                      Secondary
                    </Button>
                    <Button variant="ghost" size="sm">
                      Ghost
                    </Button>
                    <Button variant="danger" size="sm">
                      Danger
                    </Button>
                    <Badge tone="success" dot>
                      99.98% Healthy
                    </Badge>
                    <Badge tone="reference" dot>
                      v2.4 Core
                    </Badge>
                    <TensorBadge shape="161×2" dtype="Float64" />
                  </div>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    <MetricCard
                      label="P99 Query Latency"
                      value="14.2"
                      unit="ms"
                      delta="-18.4%"
                      deltaTrend="up"
                      sparklineData={[24, 21, 19, 17, 16, 15, 14.2]}
                      footnote="Sub-25ms SLA verified across 12 PoPs"
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <Input
                        prefixSlot="https://"
                        suffixSlot=":8443"
                        defaultValue="api.principia.systems"
                      />
                      <Callout tone="info" title="Generalist + Technical Foundation">
                        Use the same token contract for SaaS dashboards, forms, and generic{' '}
                        <code className="ads-inline-code">DataTable</code> grids.
                      </Callout>
                    </div>
                  </div>
                </div>
              </Pod>
            </div>
          )}

          {/* ----------------------------------------------------------------
              CHAPTER 05: MATHEMATICAL & FORMAL GRAMMAR
              ---------------------------------------------------------------- */}
          {activeDoc === 'math-formal' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1.5px solid var(--ads-ink-carbon)', paddingBottom: '16px' }}>
                <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)', marginBottom: '6px' }}>
                  CHAPTER 05 · MATHEMATICAL &amp; FORMAL ENVIRONMENTS
                </div>
                <h1 className="ads-display-title" style={{ margin: '0 0 8px 0' }}>
                  Equations, Theorems, Proofs &amp; Algorithms
                </h1>
                <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  First-class React equivalents for <code className="ads-inline-code">\begin&#123;equation&#125;</code>,{' '}
                  <code className="ads-inline-code">amsthm</code> theorem/definition environments,
                  collapsible Halmos proofs, and <code className="ads-inline-code">algorithm2e</code>{' '}
                  pseudocode.
                </p>
              </div>

              <Pod
                title="1. Display Equations with Multi-Format Copy (TeX & Typst)"
                subtitle="Hover the equation below to test TeX and Typst clipboard export"
                domainTag="THEOREM"
                headerExtra={
                  <button
                    type="button"
                    onClick={() => onNavigateStory('equation-block')}
                    className="ads-btn-instrument"
                  >
                    <span>Open in Storybook</span>
                    <ArrowRight size={10} />
                  </button>
                }
              >
                <EquationBlock
                  id="eq:greens"
                  number="5.1"
                  latex={`x(t) = \\int_0^t \\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right) f(\\tau)\\,d\\tau`}
                  referencedSymbols={['zeta', 'omega0', 'kernel']}
                />
                <FormalBlock id="thm:lyapunov" variant="theorem" number="5.1" title="Lyapunov Stability">
                  For any <Sym id="zeta" math="\zeta > 0" />, the canonical energy{' '}
                  <Sym id="energy" math="\mathcal{H}(q,p)" /> decreases monotonically along solutions
                  of <CrossRef to="eq:greens" />.
                </FormalBlock>
                <ProofBlock title="Proof of Theorem 5.1">
                  Direct differentiation yields{' '}
                  <InlineMath latex="\dot{\mathcal{H}} = -2\zeta\omega_0 p^2 \le 0" />.
                </ProofBlock>
                <AlgorithmBlock
                  number="5.1"
                  title="Symplectic Velocity-Verlet Step"
                  lines={[
                    {
                      line: 1,
                      indent: 0,
                      content: <InlineMath latex="\gamma \gets \exp(-\zeta\omega_0 \Delta t / 2)" />,
                      comment: 'Dissipative factor',
                    },
                    {
                      line: 2,
                      indent: 0,
                      content: <InlineMath latex="q_{k+1} \gets q_k + \Delta t \cdot p_{k+1/2}" />,
                      comment: 'Drift',
                    },
                  ]}
                />
              </Pod>
            </div>
          )}

          {/* ----------------------------------------------------------------
              CHAPTER 06: SCIENTIFIC DATAVIS & BOOKTABS GRAMMAR
              ---------------------------------------------------------------- */}
          {activeDoc === 'datavis-booktabs' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1.5px solid var(--ads-ink-carbon)', paddingBottom: '16px' }}>
                <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)', marginBottom: '6px' }}>
                  CHAPTER 06 · DATAVIS ENGINE &amp; BOOKTABS
                </div>
                <h1 className="ads-display-title" style={{ margin: '0 0 8px 0' }}>
                  Declarative Scientific DataVis &amp; Booktabs Tables
                </h1>
                <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  Combines <code className="ads-inline-code">pgfplots</code> inward surgical ticks,
                  Tufte Range-Frame axes, symplectic vector quiver fields, and strict{' '}
                  <code className="ads-inline-code">booktabs.sty</code> tables (zero vertical rules).
                </p>
              </div>

              <Pod
                title="1. Multi-Panel Scientific Plots & Booktabs Tables"
                subtitle="Toggle 3-Panel Bode, Quiver, Range-Frame, or export TikZ / PGFPlots"
                domainTag="EMPIRICAL"
                headerExtra={
                  <button
                    type="button"
                    onClick={() => onNavigateStory('scientific-plot')}
                    className="ads-btn-instrument"
                  >
                    <span>Open DataVis Storybook</span>
                    <ArrowRight size={10} />
                  </button>
                }
              >
                <ScientificPlot zeta={zeta} omega0={omega0} />
                <div style={{ marginTop: '18px' }}>
                  <BooktabsTable
                    caption="Spectral classification table following strict booktabs.sty, siunitx.sty, and threeparttable.sty rules."
                    activeZeta={zeta}
                    omega0={omega0}
                    onSelectZeta={setZeta}
                  />
                </div>
              </Pod>
            </div>
          )}

          {/* ----------------------------------------------------------------
              CHAPTER 07: L2 SYMBOL & DOCUMENT REGISTRY BUS
              ---------------------------------------------------------------- */}
          {activeDoc === 'symbol-bus' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ borderBottom: '1.5px solid var(--ads-ink-carbon)', paddingBottom: '16px' }}>
                <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-reference)', marginBottom: '6px' }}>
                  CHAPTER 07 · REACTIVE SEMANTIC BUS
                </div>
                <h1 className="ads-display-title" style={{ margin: '0 0 8px 0' }}>
                  L2 SymbolRegistry &amp; DocumentRegistry Bus
                </h1>
                <p className="ads-prose" style={{ color: 'var(--ads-ink-graphite)', margin: 0 }}>
                  Every <code className="ads-inline-code">&lt;Sym&gt;</code>,{' '}
                  <code className="ads-inline-code">&lt;Scrubber&gt;</code>,{' '}
                  <code className="ads-inline-code">&lt;EquationBlock&gt;</code>,{' '}
                  <code className="ads-inline-code">&lt;CrossRef&gt;</code>, and{' '}
                  <code className="ads-inline-code">&lt;Cite&gt;</code> subscribes to the L2 context
                  bus for zero-jump inspection and cross-representation highlighting.
                </p>
              </div>

              <Pod
                title="1. Live Interactive Symbol & Cross-Reference Bus Demo"
                subtitle="Hover or click any symbol in the right rail or inline below"
                domainTag="EXACT"
              >
                <p className="ads-prose">
                  Hovering <Sym id="zeta">damping ratio ζ</Sym>,{' '}
                  <Sym id="omega0">natural eigenfrequency ω₀</Sym>,{' '}
                  <Sym id="energy">Hamiltonian ℋ(q,p)</Sym>, or{' '}
                  <Sym id="kernel">Green’s propagator G(t−τ)</Sym> highlights every occurrence across
                  equations, plots, and AST code. Hovering <CrossRef to="thm:lyapunov" /> or{' '}
                  <Cite id="arnold1989" /> opens an in-place glass lens.
                </p>
              </Pod>
            </div>
          )}

          {/* ----------------------------------------------------------------
              PREVIOUS / NEXT CHAPTER FOOTER PAGINATION
              ---------------------------------------------------------------- */}
          <div
            className="ads-ui"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: '32px',
              paddingTop: '16px',
              borderTop: '1px solid var(--ads-ink-hairline)',
            }}
          >
            {prevChapter ? (
              <button
                type="button"
                onClick={() => onSelectDoc(prevChapter.id)}
                className="ads-btn-instrument"
                style={{ height: '28px', padding: '0 10px' }}
              >
                <ArrowLeft size={11} />
                <span>
                  {prevChapter.num}. {prevChapter.title}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextChapter ? (
              <button
                type="button"
                onClick={() => onSelectDoc(nextChapter.id)}
                className="ads-btn-instrument"
                style={{ height: '28px', padding: '0 10px' }}
              >
                <span>
                  {nextChapter.num}. {nextChapter.title}
                </span>
                <ArrowRight size={11} />
              </button>
            ) : (
              <button
                type="button"
                data-active="true"
                onClick={() => onNavigateStory('pod')}
                className="ads-btn-instrument"
                style={{ height: '28px', padding: '0 12px' }}
              >
                <span>Continue to Component Storybook</span>
                <ArrowRight size={11} />
              </button>
            )}
          </div>
        </article>
      </main>

      {/* ====================================================================
          RIGHT RAIL: LIVE TOKEN & SYMBOL REGISTRY INSPECTOR
          ==================================================================== */}
      <aside
        aria-label="Live Token & Symbol Inspector"
        className="ads-ui"
        style={{
          position: 'sticky',
          top: '44px',
          padding: '18px 12px',
          borderLeft: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '11.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Live Axis Switcher */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
            border: '1px solid var(--ads-ink-hairline)',
          }}
        >
          <div className="ads-eyebrow-mono" style={{ marginBottom: '8px' }}>
            Live System Axes
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
            <div className="ads-prop-row">
              <span>Chroming</span>
              <select
                value={chroming}
                onChange={(e) => setChroming(e.target.value as ChromingMode)}
                className="ads-btn-instrument"
              >
                <option value="framed">framed</option>
                <option value="seamless">seamless</option>
                <option value="bracketed">bracketed</option>
              </select>
            </div>
            <div className="ads-prop-row">
              <span>Density</span>
              <select
                value={density}
                onChange={(e) => setDensity(e.target.value as DensityMode)}
                className="ads-btn-instrument"
              >
                <option value="manuscript">manuscript</option>
                <option value="workbench">workbench</option>
                <option value="compact">compact</option>
              </select>
            </div>
            <div className="ads-prop-row">
              <span>Material</span>
              <select
                value={material}
                onChange={(e) => setMaterial(e.target.value as MaterialPreset)}
                className="ads-btn-instrument"
              >
                <option value="archival-wolfram">archival</option>
                <option value="swiss-lab">swiss-lab</option>
                <option value="oxford-monograph">oxford-sepia</option>
              </select>
            </div>
          </div>
        </div>

        {/* Live SymbolRegistry Bus */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
            border: '1px solid var(--ads-ink-hairline)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '8px',
            }}
          >
            <span className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)' }}>
              SymbolRegistry Bus
            </span>
            <span className="ads-badge-domain" style={{ height: '18px', fontSize: '9.5px' }}>
              {activeSymbolId ? activeSymbolId : 'IDLE'}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {Object.values(symbols).map((sym) => {
              const slot = SYMBOL_SLOT_COLORS[sym.slot];
              const isAct = activeSymbolId === sym.id;
              const isPin = pinnedSymbolId === sym.id;
              return (
                <div
                  key={sym.id}
                  onMouseEnter={() => hoverSymbol(sym.id)}
                  onMouseLeave={() => hoverSymbol(null)}
                  onClick={() => togglePinSymbol(sym.id)}
                  style={{
                    padding: '5px 8px',
                    borderRadius: '4px',
                    backgroundColor: isAct ? slot.bg : 'var(--ads-paper-well)',
                    border: `1px solid ${isAct ? slot.fg : slot.border}`,
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontWeight: 600, color: slot.fg }}>
                    <InlineMath latex={sym.latex} /> — {sym.name}
                  </span>
                  {isPin && <Pin size={10} color={slot.fg} />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Prototype Quick Launcher */}
        <div
          style={{
            padding: '10px 12px',
            borderRadius: '6px',
            backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
            border: '1px solid var(--ads-ink-hairline)',
          }}
        >
          <div className="ads-eyebrow-mono" style={{ marginBottom: '6px' }}>
            Launch App Concept
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(
              [
                { id: 'agent-workflow', label: 'Nexus (Agentic Workflow)' },
                { id: 'ai-evals', label: 'EvalBench (AI Observatory)' },
                { id: 'quant-macro', label: 'Meridian (Quant Terminal)' },
                { id: 'biomed-trials', label: 'Helix (Clinical BioMed)' },
                { id: 'principia', label: 'Principia (Physics Lab)' },
                { id: 'wolfram', label: 'The Codex (CAS / Monograph)' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => onNavigatePrototype(p.id)}
                className="ads-nav-item"
                style={{ height: '24px', fontSize: '11.5px' }}
              >
                <span>{p.label}</span>
                <ArrowRight size={10} />
              </button>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
};
