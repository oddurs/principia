import React, { useState, useMemo } from 'react';
import {
  Layers,
  Monitor,
  Tablet,
  Smartphone,
  AlignJustify,
  Grid,
  Hand,
  Copy,
  Check,
  Sliders,
  Code2,
  Search,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import {
  useAcademicSystem,
  SYMBOL_SLOT_COLORS,
  ChromingMode,
  DeviceSimulation,
  DensityMode,
} from '../core/registry';
import { StoryComponentId } from './navigation';
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
import {
  Button,
  SegmentedControl,
  Badge,
  FormField,
  Input,
  Select,
  Switch,
  Card,
  MetricCard,
  Callout,
  KeyValueList,
  Tabs,
  Accordion,
  DataTable,
} from '../primitives/general/GeneralFoundation';
import {
  AgentPipelineGraph,
  ToolCallCard,
  AgentTraceTimeline,
  HumanApprovalGate,
} from '../primitives/agentic/AgenticWorkflow';

export interface StorybookPageProps {
  activeStory: StoryComponentId;
  onSelectStory: (story: StoryComponentId) => void;
}

interface StoryScenario {
  id: string;
  label: string;
}

interface StoryMeta {
  id: StoryComponentId;
  num: string;
  title: string;
  exports: string[];
  pillar: string;
  summary: string;
  anatomyNotes: string[];
  scenarios: StoryScenario[];
  jsxSnippet: string;
  propsSpec: Array<{
    prop: string;
    type: string;
    defaultVal: string;
    description: string;
  }>;
}

const STORY_CATALOG: StoryMeta[] = [
  {
    id: 'buttons-badges',
    num: '01',
    title: 'Buttons, Segments & Badges',
    exports: ['Button', 'SegmentedControl', 'Badge'],
    pillar: 'Generalist Foundation',
    summary:
      'Zero-black light-mode tactile hardware button system across 7 semantic variants (primary cobalt, compute vermilion, tonal wash, secondary ceramic, instrument toggle, ghost, danger) and 4 harmonic sizes (22px xs to 40px lg), paired with generic segmented controls and status badges.',
    anatomyNotes: [
      'Buttons follow the strict 4px sub-grid (22px xs, 28px sm, 34px md, 40px lg) with directional 3D keycap bevels, rim-lit top highlights, and 0.5px active press feedback—with zero harsh black fills.',
      'Optional kbd prop renders a hardware keycap shortcut badge inside any button variant; active prop latches instrument/secondary buttons into a tinted cobalt key state.',
      'Badge supports 6 perceptual OKLCH semantic tones with optional live status indicator dots.',
    ],
    scenarios: [
      { id: 'variants-sizes', label: 'Variants & Size Scale' },
      { id: 'segmented-badges', label: 'Segmented Controls & Badges' },
      { id: 'toolbar-composition', label: 'Application Toolbar Strip' },
    ],
    jsxSnippet: `import { Button, SegmentedControl, Badge } from '@principia/core';

<Button variant="primary" size="sm" kbd="⌘↵">
  Deploy Release
</Button>
<Button variant="compute" size="sm">
  Run Evaluation
</Button>
<Button variant="tonal" size="sm">
  Inspect Trace
</Button>
<Badge tone="success" dot>
  99.98% Uptime
</Badge>`,
    propsSpec: [
      { prop: 'variant (Button)', type: "'primary' | 'compute' | 'tonal' | 'secondary' | 'instrument' | 'ghost' | 'danger'", defaultVal: "'secondary'", description: 'Zero-black tactile keycap hierarchy: Cobalt Primary, Vermilion Compute, Tonal Wash, Ceramic Secondary, Ghost, or Crimson Danger.' },
      { prop: 'size (Button)', type: "'xs' | 'sm' | 'md' | 'lg'", defaultVal: "'sm'", description: 'Maps height to 22px, 28px, 34px, or 40px.' },
      { prop: 'active (Button)', type: 'boolean', defaultVal: 'false', description: 'Latches secondary/instrument buttons into an illuminated cobalt key state.' },
      { prop: 'kbd (Button)', type: 'string', defaultVal: 'undefined', description: 'Optional keyboard shortcut keycap rendered on the trailing edge.' },
      { prop: 'tone (Badge)', type: "'neutral' | 'compute' | 'reference' | 'success' | 'warning' | 'danger'", defaultVal: "'neutral'", description: 'Perceptual OKLCH status tone.' },
    ],
  },
  {
    id: 'forms-inputs',
    num: '02',
    title: 'Inputs, Selects & Form Controls',
    exports: ['FormField', 'Input', 'Select', 'Switch'],
    pillar: 'Generalist Foundation',
    summary:
      'Precision-machined form controls with prefix/suffix unit slots, tabular numeric alignment, validation states, tactile toggle switches, and structured field labels.',
    anatomyNotes: [
      'Inputs feature a recessed 1px inner top shadow and a crisp 2.5px cobalt focus ring (--ads-focus-ring).',
      'Prefix and suffix slots allow embedding currency symbols, units (ms, GB, rad/s), or search icons without layout shift.',
    ],
    scenarios: [
      { id: 'settings-form', label: 'Workspace Settings Form' },
      { id: 'validation-states', label: 'Prefix/Suffix & Validation' },
    ],
    jsxSnippet: `import { FormField, Input, Select, Switch } from '@principia/core';

<FormField label="Cluster Endpoint" hint="Required" description="Primary regional inference router.">
  <Input prefixSlot="https://" suffixSlot=":8443" defaultValue="us-east.principia.compute" />
</FormField>
<Switch checked={enabled} onChange={setEnabled} label="Deterministic Execution" />`,
    propsSpec: [
      { prop: 'label / hint (FormField)', type: 'ReactNode', defaultVal: 'required', description: 'Primary label and right-aligned metadata hint.' },
      { prop: 'prefixSlot / suffixSlot (Input)', type: 'ReactNode', defaultVal: 'undefined', description: 'Inline adornments rendered inside the input frame.' },
      { prop: 'invalid (Input)', type: 'boolean', defaultVal: 'false', description: 'Applies crimson validation border and focus ring.' },
      { prop: 'checked / onChange (Switch)', type: 'boolean', defaultVal: 'required', description: 'Controlled state for tactile toggle switch.' },
    ],
  },
  {
    id: 'cards-surfaces',
    num: '03',
    title: 'Cards, Metrics, Callouts & Tabs',
    exports: ['Card', 'MetricCard', 'Callout', 'Tabs', 'Accordion', 'KeyValueList'],
    pillar: 'Generalist Foundation',
    summary:
      'General-purpose surface containers, KPI telemetry cards with embedded Tufte sparklines, semantic callout banners, underlined tab strips, collapsible accordions, and key-value inspector lists.',
    anatomyNotes: [
      'MetricCard pairs tabular-nums headline figures with delta trend badges and word-sized SVG sparklines.',
      'Callout provides 5 semantic tones (neutral, info, success, warning, danger) with optional action buttons.',
    ],
    scenarios: [
      { id: 'kpi-metrics', label: 'KPI Telemetry & Sparkline Cards' },
      { id: 'callouts-tabs', label: 'Semantic Callouts & Tabs' },
      { id: 'accordion-kv', label: 'Accordion & Key-Value Inspector' },
    ],
    jsxSnippet: `import { MetricCard, Callout, Card, Tabs } from '@principia/core';

<MetricCard
  label="P99 Inference Latency"
  value="14.2"
  unit="ms"
  delta="-18.4%"
  deltaTrend="up"
  sparklineData={[22, 19, 18, 16, 15, 14.2]}
/>`,
    propsSpec: [
      { prop: 'label / value (MetricCard)', type: 'string', defaultVal: 'required', description: 'KPI metric title and tabular headline readout.' },
      { prop: 'sparklineData (MetricCard)', type: 'number[]', defaultVal: 'undefined', description: 'Optional numeric series rendered as a Tufte sparkline.' },
      { prop: 'tone (Callout)', type: "'neutral' | 'info' | 'success' | 'warning' | 'danger'", defaultVal: "'neutral'", description: 'Controls border, background tint, and leading icon.' },
    ],
  },
  {
    id: 'general-datatable',
    num: '04',
    title: 'Universal DataTable (Any Dataset)',
    exports: ['DataTable'],
    pillar: 'Generalist Foundation',
    summary:
      'Dataset-agnostic booktabs.sty data grid accepting any typed columns and rows array—complete with instant search filtering, column sorting, \\cmidrule group spanners, proportional bars, and 1-click CSV & LaTeX export.',
    anatomyNotes: [
      'Decouples our booktabs.sty + siunitx tabular architecture from physics models so any SaaS, ML, or financial dataset can use it.',
      'Supports multi-column \\cmidrule(lr) group headers via the column group property.',
      'Includes built-in row search, column sorting, proportional magnitude bars, summary footers, and TeX/CSV export.',
    ],
    scenarios: [
      { id: 'ml-benchmarks', label: 'AI / ML Model Benchmarks' },
      { id: 'cloud-nodes', label: 'Cloud Infrastructure Telemetry' },
      { id: 'quant-ledger', label: 'Quantitative Asset Ledger' },
    ],
    jsxSnippet: `import { DataTable } from '@principia/core';

<DataTable
  title="Foundation Model Evaluation Suite"
  columns={[
    { key: 'model', header: 'Model Architecture', group: 'Identity' },
    { key: 'mmlu', header: 'MMLU-Pro (%)', group: 'Benchmarks', align: 'right', numericValue: (r) => r.mmlu, barMax: 100 },
    { key: 'latency', header: 'P95 Latency (ms)', group: 'Telemetry', align: 'right', numericValue: (r) => r.latency },
  ]}
  data={rows}
  rowKey={(r) => r.id}
/>`,
    propsSpec: [
      { prop: 'columns', type: 'DataTableColumn<T>[]', defaultVal: 'required', description: 'Column definitions with optional group spanner, align, numericValue, and custom render.' },
      { prop: 'data', type: 'T[]', defaultVal: 'required', description: 'Array of arbitrary typed data objects.' },
      { prop: 'searchable', type: 'boolean', defaultVal: 'true', description: 'Renders instant client-side row filter input in the table toolbar.' },
      { prop: 'summaryRow', type: 'Record<string, ReactNode>', defaultVal: 'undefined', description: 'Optional tfoot aggregate row rendered above \\bottomrule.' },
    ],
  },
  {
    id: 'pod',
    num: '05',
    title: 'Computational Pod',
    exports: ['Pod'],
    pillar: 'Pods & Controls',
    summary:
      'Universal computable container supporting Framed (optical fiducial ticks), Seamless (LaTeX flow), and Bracketed (Mathematica cell) chroming modes, assumption turnstiles, multi-representation tabs (Typeset, TeX, Typst, Code), and step-by-step derivation traces.',
    anatomyNotes: [
      'Auto-extracts leading section numerals (e.g. "1. Title") into a tabular § badge.',
      'Automatically generates a Typst representation tab whenever latexSource is supplied.',
      'Header chevron folds/unfolds the stage while keeping title & provenance visible.',
    ],
    scenarios: [
      { id: 'greens', label: 'Green’s Kernel (EXACT)' },
      { id: 'eigenvalues', label: 'Spectral Poles (SYMBOLIC)' },
      { id: 'minimal', label: 'Minimal Seamless Pod' },
    ],
    jsxSnippet: `import { Pod, EquationBlock } from '@principia/core';

<Pod
  title="1. Exact Symbolic Green's Function"
  subtitle="Duhamel Spectral Decomposition"
  domainTag="EXACT"
  cellLabel="Out[1]="
  assumptions={[{ id: 'domain', label: 'ζ, ω₀', current: 'ℝ⁺', alternatives: ['ℂ'] }]}
  latexSource="G(t) = \\frac{e^{-\\zeta\\omega_0 t}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin(\\omega_d t)"
>
  <EquationBlock
    number="1.1"
    latex="G(t) = \\frac{e^{-\\zeta\\omega_0 t}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin(\\omega_d t)"
  />
</Pod>`,
    propsSpec: [
      { prop: 'title', type: 'string', defaultVal: 'required', description: 'Section heading; auto-extracts leading numeral into a § chip.' },
      { prop: 'domainTag', type: "'EXACT' | 'SYMBOLIC' | 'NUMERICAL' | 'THEOREM' | 'EMPIRICAL' | 'AI-VERIFIED'", defaultVal: 'undefined', description: 'Epistemic provenance badge with status indicator dot.' },
      { prop: 'chromingOverride', type: "'framed' | 'seamless' | 'bracketed'", defaultVal: 'global', description: 'Overrides global Chroming Axis for this specific pod.' },
      { prop: 'assumptions', type: 'PodAssumption[]', defaultVal: '[]', description: 'Renders the 28px ⊢ Assuming turnstile bar with clickable domain alternatives.' },
      { prop: 'steps', type: 'StepItem[]', defaultVal: '[]', description: 'Collapsible CAS derivation timeline drawer with 1-click TeX trace copy.' },
    ],
  },
  {
    id: 'manipulate-scrubber',
    num: '06',
    title: 'Manipulate & Vernier Scrubber',
    exports: ['Manipulate', 'Scrubber'],
    pillar: 'Pods & Controls',
    summary:
      'Wolfram Manipulate parameter controller paired with a dual-context 3-speed Vernier Caliper Scrubber (1× Coarse, 0.1× Fine, 0.01× Vernier Lock) and slot-colored progress tracks.',
    anatomyNotes: [
      'Pull pointer downward while dragging a Scrubber to shift gear into 0.1× Fine or 0.01× Vernier Lock.',
      'Keyboard arrows step 1×; Shift+Arrow steps 10× coarse; Alt+Arrow steps 0.1× fine.',
      'Header includes 1-click Wolfram rule state export ({zeta -> 0.25, omega0 -> 4.00}).',
    ],
    scenarios: [
      { id: 'coupled', label: 'Coupled Parameter Deck' },
      { id: 'prose-scrubbers', label: 'Inline Prose Scrubbers' },
      { id: 'single-axis', label: 'Compact Damping Strip' },
    ],
    jsxSnippet: `import { Manipulate, Scrubber } from '@principia/core';

<Scrubber
  symbolId="zeta"
  symbolLatex="\\zeta"
  value={zeta}
  min={0.05}
  max={1.8}
  step={0.01}
  onChange={setZeta}
/>`,
    propsSpec: [
      { prop: 'symbolId', type: 'string', defaultVal: 'undefined', description: 'Links scrubber to the L2 SymbolRegistry bus and OKLCH slot color.' },
      { prop: 'symbolLatex', type: 'string', defaultVal: 'undefined', description: 'Renders symbol prefix inline in prose using KaTeX serif.' },
      { prop: 'value / min / max', type: 'number', defaultVal: 'required', description: 'Numeric parameter state and domain bounds.' },
      { prop: 'unit', type: 'string', defaultVal: 'undefined', description: 'Optional physical unit suffix (e.g. rad/s).' },
    ],
  },
  {
    id: 'equation-block',
    num: '07',
    title: 'Display Equations & Symbols',
    exports: ['EquationBlock', 'Sym', 'InlineMath'],
    pillar: 'Mathematics & Proofs',
    summary:
      'Numbered display equation environment with TeX \\abovedisplayskip rhythm, responsive scroll containers, floating symbol dimensionality lenses, and 1-click TeX & Typst copy.',
    anatomyNotes: [
      'Inline symbols include 0.05em TeX \\mathsurround optical breathing room and zero vertical line-height expansion.',
      'Hovering any symbol opens a non-jumping dimensionality lens and highlights all coupled equations, code tokens, and plots.',
    ],
    scenarios: [
      { id: 'hamiltonian', label: 'Hamiltonian Dissipation' },
      { id: 'duhamel', label: 'Duhamel Convolution' },
      { id: 'inline-prose', label: 'Inline Symbol Lenses' },
    ],
    jsxSnippet: `import { EquationBlock, Sym } from '@principia/core';

<EquationBlock
  id="eq:greens"
  number="2.1"
  latex="\\mathcal{H}(q, p) = \\frac{1}{2}p^2 + \\frac{1}{2}\\omega_0^2 q^2"
  referencedSymbols={['zeta', 'omega0', 'energy']}
/>`,
    propsSpec: [
      { prop: 'latex', type: 'string', defaultVal: 'required', description: 'Display-mode LaTeX math string; automatically converted for Typst export.' },
      { prop: 'number', type: 'string', defaultVal: 'undefined', description: 'Flush-right upright equation number, e.g. (2.1).' },
      { prop: 'referencedSymbols', type: 'string[]', defaultVal: '[]', description: 'Symbol IDs that illuminate this equation when hovered or pinned.' },
      { prop: 'caption', type: 'ReactNode', defaultVal: 'undefined', description: 'Optional editorial annotation rendered beneath the display math.' },
    ],
  },
  {
    id: 'formal-proof',
    num: '08',
    title: 'Theorems & Formal Proofs',
    exports: ['FormalBlock', 'ProofBlock'],
    pillar: 'Mathematics & Proofs',
    summary:
      'AMS-LaTeX (amsthm) run-in Theorem, Lemma, Corollary, Definition, and Remark environments paired with collapsible proofs, TeX export, and flush-right Halmos Q.E.D. tombstones (∎).',
    anatomyNotes: [
      'Theorems, Lemmas, and Corollaries set body prose in classical LaTeX italic serif; Definitions and Remarks use upright Roman.',
      'Run-in small-caps header is followed by an exact 0.55em \\enspace gap.',
    ],
    scenarios: [
      { id: 'theorem', label: 'Theorem & Halmos Proof' },
      { id: 'definition', label: 'Definition (Upright Body)' },
      { id: 'collapsed', label: 'Corollary & Folded Proof' },
    ],
    jsxSnippet: `import { FormalBlock, ProofBlock, Sym, InlineMath } from '@principia/core';

<FormalBlock variant="theorem" number="2.1" title="Lyapunov Contraction">
  Every trajectory with <Sym id="zeta" math="\\zeta > 0" /> contracts symplectic volume.
</FormalBlock>
<ProofBlock title="Proof of Theorem 2.1">
  Differentiating yields <InlineMath latex="\\dot{\\mathcal{H}} = -2\\zeta\\omega_0 p^2 \\le 0" />.
</ProofBlock>`,
    propsSpec: [
      { prop: 'variant', type: "'theorem' | 'lemma' | 'corollary' | 'definition' | 'remark'", defaultVal: "'theorem'", description: 'Controls italic vs upright body serif and semantic left border rule.' },
      { prop: 'number', type: 'string', defaultVal: 'required', description: 'Environment numbering rendered in OpenType small-caps (.ads-smallcaps).' },
      { prop: 'defaultExpanded', type: 'boolean', defaultVal: 'true', description: 'Controls initial expansion state of the accompanying ProofBlock.' },
    ],
  },
  {
    id: 'algorithm-block',
    num: '09',
    title: 'Algorithmic Pseudocode',
    exports: ['AlgorithmBlock'],
    pillar: 'Mathematics & Proofs',
    summary:
      'Publication-grade algorithm2e / algorithmicx listing with top/bottom heavy rules, interactive line-by-line execution stepping (Step ▸), complexity badge, and right-aligned comments.',
    anatomyNotes: [
      'Click "Step ▸" in the header or click any pseudocode line directly to highlight the active execution pointer (▸).',
      '1-click TeX button exports a ready-to-compile \\begin{algorithm}[H] environment.',
    ],
    scenarios: [
      { id: 'verlet', label: 'Symplectic Velocity-Verlet' },
      { id: 'rk4', label: 'Classical RK4 Integrator' },
    ],
    jsxSnippet: `import { AlgorithmBlock, InlineMath } from '@principia/core';

<AlgorithmBlock
  number="1.1"
  title="Symplectic Velocity-Verlet Step"
  lines={[
    { line: 1, indent: 0, content: <InlineMath latex="\\gamma \\gets \\exp(-\\zeta\\omega_0\\Delta t/2)" /> }
  ]}
/>`,
    propsSpec: [
      { prop: 'number / title', type: 'string', defaultVal: 'required', description: 'Algorithm header set in OpenType small-caps.' },
      { prop: 'requireText / ensureText', type: 'ReactNode', defaultVal: 'undefined', description: 'Preconditions (Require:) and postconditions (Ensure:) header band.' },
      { prop: 'lines', type: 'AlgorithmLine[]', defaultVal: 'required', description: 'Indented pseudocode lines with optional right-aligned ▷ comments.' },
    ],
  },
  {
    id: 'citations-crossref',
    num: '10',
    title: 'Citations & Reference Lenses',
    exports: ['Cite', 'CrossRef', 'CitationCard'],
    pillar: 'Citations & Provenance',
    summary:
      'Non-jumping hyperref links that preview theorems, equations, and bibliographic cards inside a frosted archival glass lens with inline .bib inspection and \\cref copy.',
    anatomyNotes: [
      'Hovering a citation or equation reference previews the target in-place without losing reading scroll position.',
      'Toggle ".bib" inside any CitationCard to inspect raw BibTeX fields or pin the reference to the margin rail.',
    ],
    scenarios: [
      { id: 'inline-lenses', label: 'Inline Prose & Hover Lenses' },
      { id: 'bib-card', label: 'Standalone Reference Card' },
    ],
    jsxSnippet: `import { Cite, CrossRef } from '@principia/core';

<p className="ads-prose">
  By <CrossRef to="thm:lyapunov" /> and Arnold <Cite id="arnold1989" mode="numeric" />...
</p>`,
    propsSpec: [
      { prop: 'id (Cite)', type: 'string', defaultVal: 'required', description: 'Bibliography key registered in L2 DocumentRegistry.' },
      { prop: 'mode (Cite)', type: "'numeric' | 'author-year'", defaultVal: "'numeric'", description: 'Switches between [1] and (Arnold, 1989) formatting.' },
      { prop: 'to (CrossRef)', type: 'string', defaultVal: 'required', description: 'Target ID (e.g. thm:lyapunov, eq:greens) for in-place lens preview.' },
    ],
  },
  {
    id: 'scientific-plot',
    num: '11',
    title: 'Scientific Plotting Suite',
    exports: ['ScientificPlot', 'CartesianCanvas', 'PhaseSpaceCanvas', 'ComplexPlaneCanvas'],
    pillar: 'DataVis & Tabular',
    summary:
      'Multi-panel vector scientific plotting workbench combining Cartesian trajectories, symplectic phase-space quiver fields, complex s-plane root loci, Bode response, and pgfplots TikZ export.',
    anatomyNotes: [
      'Supports 3 physical models out of the box: Damped Harmonic Oscillator, Quantum Eigenstates, and Lotka–Volterra.',
      'Includes inward metrological ticks, click-to-lock coordinate crosshairs, and 1-click SVG / TikZ export.',
    ],
    scenarios: [
      { id: 'oscillator', label: 'Damped Oscillator' },
      { id: 'quantum', label: 'Quantum Eigenstates' },
      { id: 'lotka', label: 'Lotka–Volterra Orbits' },
    ],
    jsxSnippet: `import { ScientificPlot } from '@principia/core';

<ScientificPlot
  model="damped-oscillator"
  zeta={0.25}
  omega0={4.0}
/>`,
    propsSpec: [
      { prop: 'model', type: "'damped-oscillator' | 'quantum-eigenstates' | 'lotka-volterra'", defaultVal: "'damped-oscillator'", description: 'Selects physical model and coupled differential equations.' },
      { prop: 'zeta / omega0', type: 'number', defaultVal: '0.25 / 4.0', description: 'Live parameters driving time-domain, phase portrait, and s-plane poles.' },
    ],
  },
  {
    id: 'sparkline-unit',
    num: '12',
    title: 'Sparklines & Dimensional Units',
    exports: ['Sparkline', 'UnitValue'],
    pillar: 'DataVis & Tabular',
    summary:
      'Tufte word-sized inline SVG graphics with shaded area envelopes, paired with interactive dimensional unit cyclers (SI ↔ CGS ↔ Natural ℏ = 1).',
    anatomyNotes: [
      'Sparklines sit on the text baseline with a subtle zero-axis hairline and terminal value marker.',
      'Clicking any UnitValue chip cycles through SI, CGS, and Natural Planck units with live conversion factors.',
    ],
    scenarios: [
      { id: 'prose-inline', label: 'Inline Prose Telemetry' },
      { id: 'regime-strip', label: 'Multi-Regime Sparkline Strip' },
    ],
    jsxSnippet: `import { Sparkline, UnitValue } from '@principia/core';

<Sparkline data={waveform} domain={[-1, 1]} width={76} height={22} />
<UnitValue value="4.00" uncertainty="0.02" unit="rad·s⁻¹" conversions={...} />`,
    propsSpec: [
      { prop: 'data (Sparkline)', type: 'number[]', defaultVal: 'required', description: 'Numeric array plotted inline with zero-line and terminal dot.' },
      { prop: 'conversions (UnitValue)', type: 'UnitConversionOption[]', defaultVal: '[]', description: 'Dimensional unit systems cycled on click (SI, CGS, Natural).' },
    ],
  },
  {
    id: 'booktabs-table',
    num: '13',
    title: 'Booktabs Publication Table',
    exports: ['BooktabsTable'],
    pillar: 'DataVis & Tabular',
    summary:
      'Strict LaTeX booktabs.sty + siunitx.sty + threeparttable.sty table (\\toprule 0.08em, \\cmidrule(lr) 0.035em, \\midrule 0.05em, \\bottomrule 0.08em, zero vertical rules) with live sorting, ±1σ uncertainties, and TeX/CSV export.',
    anatomyNotes: [
      'Click any regime row in the table to synchronize the active damping ratio ζ across the entire workbench.',
      'Toggle "±1σ" for standard uncertainties or "Bars" for Tufte proportional magnitude fills.',
    ],
    scenarios: [
      { id: 'interactive-ledger', label: 'Interactive Spectral Ledger' },
      { id: 'critical-focus', label: 'Critical Damping Focus (ζ = 1.0)' },
    ],
    jsxSnippet: `import { BooktabsTable } from '@principia/core';

<BooktabsTable
  caption="Spectral eigenvalues and relaxation times across damping regimes."
  activeZeta={zeta}
  omega0={omega0}
  onSelectZeta={setZeta}
/>`,
    propsSpec: [
      { prop: 'caption', type: 'string', defaultVal: 'required', description: 'Publication table caption rendered above \\toprule.' },
      { prop: 'activeZeta / omega0', type: 'number', defaultVal: '0.25 / 4.0', description: 'Highlights active regime row and computes live eigenvalues.' },
      { prop: 'onSelectZeta', type: '(zeta: number) => void', defaultVal: 'undefined', description: 'Fires when a user clicks a regime row to couple parameters.' },
    ],
  },
  {
    id: 'omni-compute-bar',
    num: '14',
    title: 'Symbolic Compute OmniBar',
    exports: ['OmniComputeBar'],
    pillar: 'Compute & Copilot',
    summary:
      'Wolfram-grade symbolic and natural-language query bar with live parameter parsing (zeta=..., omega_0=...), KaTeX "Interpreted as" confirmation, and touch π/∫ math ribbon.',
    anatomyNotes: [
      'Edit zeta=0.25 or omega_0=4.0 directly in the query input and press Enter to drive all coupled plots and equations.',
      'Click π/∫ to reveal the touch-friendly symbolic operator insertion ribbon.',
    ],
    scenarios: [
      { id: 'default-omni', label: 'Symbolic ODE Query' },
      { id: 'custom-tip', label: 'Live Parameter Parsing' },
    ],
    jsxSnippet: `import { OmniComputeBar } from '@principia/core';

<OmniComputeBar
  onSelectPreset={(preset) => {
    setZeta(preset.zeta);
    setOmega0(preset.omega0);
  }}
/>`,
    propsSpec: [
      { prop: 'onSelectPreset', type: '(preset: OmniQueryPreset) => void', defaultVal: 'undefined', description: 'Callback fired when a preset or custom query is evaluated.' },
    ],
  },
  {
    id: 'code-cell',
    num: '15',
    title: 'Notebook Code Cell',
    exports: ['CodeCell', 'TensorBadge'],
    pillar: 'Compute & Copilot',
    summary:
      'Executable code & notebook cell supporting custom source strings (TypeScript, Rust, SQL, Python) as well as multi-dialect scientific kernels (Julia, SymPy, Wolfram).',
    anatomyNotes: [
      'Pass customCode and customOutput to render any general-purpose programming language or query result.',
      'Switch seamlessly between Julia, SymPy, and Wolfram dialects when using the coupled symbol-bus mode.',
    ],
    scenarios: [
      { id: 'notebook-cell', label: 'Multi-Dialect CAS Cell' },
      { id: 'custom-ts', label: 'Generalist TypeScript / Edge' },
      { id: 'tensor-badges', label: 'Tensor Shape & Dtype Badges' },
    ],
    jsxSnippet: `import { CodeCell, TensorBadge } from '@principia/core';

<CodeCell
  language="Julia 1.11 · DifferentialEquations.jl"
  zeta={zeta}
  omega0={omega0}
/>`,
    propsSpec: [
      { prop: 'language', type: 'string', defaultVal: "'Julia 1.11'", description: 'Default kernel label displayed in the 32px header strip.' },
      { prop: 'zeta / omega0', type: 'number', defaultVal: 'required', description: 'Live numeric bindings injected into AST tokens and output eigenvalues.' },
    ],
  },
  {
    id: 'grounded-ai',
    num: '16',
    title: 'Grounded AI Copilot',
    exports: ['GroundedAIChat'],
    pillar: 'Compute & Copilot',
    summary:
      'Verifiable research copilot featuring collapsible reasoning traces, SymPy CAS equivalence verification (LHS − RHS == 0 ✓), and interactive corollary patch insertion.',
    anatomyNotes: [
      'Switch between Corollary 2.1.1 (Q-Factor) and Corollary 2.1.2 (Adiabatic Invariant) to inspect CAS-verified manuscript patches.',
      'Expand the SymPy CAS trace to inspect the symbolic zero-residual check.',
    ],
    scenarios: [
      { id: 'copilot-default', label: 'CAS-Verified Corollary Patch' },
    ],
    jsxSnippet: `import { GroundedAIChat } from '@principia/core';

<GroundedAIChat />`,
    propsSpec: [
      { prop: 'verifiedBadge', type: 'string', defaultVal: "'SymPy CAS Verified'", description: 'Displays epistemic verification status of symbolic claims.' },
    ],
  },
  {
    id: 'agentic-workflow',
    num: '17',
    title: 'Agentic Workflow & Orchestration',
    exports: ['AgentPipelineGraph', 'ToolCallCard', 'AgentTraceTimeline', 'HumanApprovalGate'],
    pillar: 'Compute & Copilot',
    summary:
      'Multi-agent DAG orchestration topology, MCP / sandbox tool-call inspectors, chronological reasoning & formal verifier trace waterfalls, and human-in-the-loop ChangeSet approval gates.',
    anatomyNotes: [
      'AgentPipelineGraph renders an interactive topological DAG with parallel subagent lanes, Bézier directional connectors, live token/latency telemetry, and click-to-inspect node focus.',
      'AgentTraceTimeline combines Chain-of-Thought reasoning, MCP tool invocations, subagent handoffs, and Lean 4 / SymPy verifier checks with proportional latency bars and 1-click Fork replay.',
      'HumanApprovalGate enforces explicit operator sign-off with capability scope chips, risk badges, and unified diff inspection before mutating state.',
    ],
    scenarios: [
      { id: 'dag-pipeline', label: 'Multi-Agent DAG Topology' },
      { id: 'trace-tools', label: 'Trace Waterfall & MCP Tool Calls' },
      { id: 'human-gate', label: 'Human-in-the-Loop Approval Gate' },
    ],
    jsxSnippet: `import {
  AgentPipelineGraph,
  ToolCallCard,
  AgentTraceTimeline,
  HumanApprovalGate,
} from '@principia/core';

<AgentPipelineGraph
  nodes={pipelineNodes}
  edges={pipelineEdges}
  selectedNodeId={selectedNode}
  onSelectNode={setSelectedNode}
/>
<HumanApprovalGate
  gateId="GATE-402"
  agentName="Synthesizer & Patcher"
  actionTitle="Commit Verified Lean 4 Corollary & Manuscript Patch"
  riskLevel="medium"
  scopesRequested={['fs.write:src/manuscript', 'git.commit:branch/lean-proof']}
  payloadPreview={diffString}
/>`,
    propsSpec: [
      { prop: 'nodes / edges (AgentPipelineGraph)', type: 'AgentPipelineNode[] / AgentPipelineEdge[]', defaultVal: 'required', description: 'Topological column/row nodes and directed Bézier edges for multi-agent orchestration.' },
      { prop: 'steps (AgentTraceTimeline)', type: 'AgentTraceStep[]', defaultVal: 'required', description: 'Chronological reasoning, tool-call, subagent, and formal verifier steps with latency waterfall bars.' },
      { prop: 'toolName / server (ToolCallCard)', type: 'string', defaultVal: 'required', description: 'MCP tool identifier, server badge, JSON input arguments, and diff/payload preview.' },
      { prop: 'riskLevel / decision (HumanApprovalGate)', type: "'low' | 'medium' | 'high'", defaultVal: "'pending'", description: 'Human-in-the-loop governance gate with Approve & Execute (⌘↵) and Hold / Reject actions.' },
    ],
  },
];

export const StorybookPage: React.FC<StorybookPageProps> = ({
  activeStory,
  onSelectStory,
}) => {
  const {
    symbols,
    activeSymbolId,
    hoverSymbol,
    togglePinSymbol,
    citations,
    pinnedCitations,
    togglePinCitation,
    chroming,
    setChroming,
    density,
    setDensity,
    deviceSim,
    setDeviceSim,
    simulateTouch,
    setSimulateTouch,
    xrayBaseline,
    setXrayBaseline,
    xrayGrid,
    setXrayGrid,
  } = useAcademicSystem();

  const [zeta, setZeta] = useState<number>(0.25);
  const [omega0, setOmega0] = useState<number>(4.0);
  const [formalVariant, setFormalVariant] = useState<FormalVariant>('theorem');
  const [podDomainTag, setPodDomainTag] = useState<
    'EXACT' | 'SYMBOLIC' | 'NUMERICAL' | 'THEOREM' | 'EMPIRICAL' | 'AI-VERIFIED'
  >('EXACT');
  const [filterQuery, setFilterQuery] = useState<string>('');
  const [activeScenarioMap, setActiveScenarioMap] = useState<Record<string, string>>({});
  const [copiedJsx, setCopiedJsx] = useState<boolean>(false);
  const [copiedImport, setCopiedImport] = useState<boolean>(false);

  // Interactive state for Generalist Foundation stories
  const [segView, setSegView] = useState<'realtime' | '24h' | '7d' | '30d'>('24h');
  const [formSwitchA, setFormSwitchA] = useState<boolean>(true);
  const [formSwitchB, setFormSwitchB] = useState<boolean>(false);
  const [selectedTableRowId, setSelectedTableRowId] = useState<string>('claude-4-sonnet');
  const [selectedAgentNode, setSelectedAgentNode] = useState<string>('verifier');
  const [storyGateDecision, setStoryGateDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const currentIndex = Math.max(
    0,
    STORY_CATALOG.findIndex((s) => s.id === activeStory)
  );
  const currentStory = STORY_CATALOG[currentIndex] ?? STORY_CATALOG[0];
  const prevStory = currentIndex > 0 ? STORY_CATALOG[currentIndex - 1] : null;
  const nextStory =
    currentIndex < STORY_CATALOG.length - 1 ? STORY_CATALOG[currentIndex + 1] : null;

  const activeScenarioId =
    activeScenarioMap[currentStory.id] ?? currentStory.scenarios[0]?.id ?? 'default';

  const setActiveScenario = (scenarioId: string) => {
    setActiveScenarioMap((prev) => ({ ...prev, [currentStory.id]: scenarioId }));
    // Apply helpful state presets when switching scenarios
    if (currentStory.id === 'formal-proof') {
      if (scenarioId === 'theorem') setFormalVariant('theorem');
      if (scenarioId === 'definition') setFormalVariant('definition');
      if (scenarioId === 'collapsed') setFormalVariant('corollary');
    } else if (currentStory.id === 'pod') {
      if (scenarioId === 'greens') setPodDomainTag('EXACT');
      if (scenarioId === 'eigenvalues') setPodDomainTag('SYMBOLIC');
    } else if (currentStory.id === 'booktabs-table') {
      if (scenarioId === 'critical-focus') setZeta(1.0);
      if (scenarioId === 'interactive-ledger') setZeta(0.25);
    }
  };

  const importStatement = `import { ${currentStory.exports.join(', ')} } from '@principia/core';`;

  const handleCopyJsx = () => {
    navigator.clipboard?.writeText(currentStory.jsxSnippet);
    setCopiedJsx(true);
    window.setTimeout(() => setCopiedJsx(false), 1500);
  };

  const handleCopyImport = () => {
    navigator.clipboard?.writeText(importStatement);
    setCopiedImport(true);
    window.setTimeout(() => setCopiedImport(false), 1500);
  };

  const sparklineSample = useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => {
      const t = (i / 39) * 5.5;
      const wd = omega0 * Math.sqrt(Math.max(0.01, 1 - zeta * zeta));
      return Math.exp(-zeta * omega0 * t) * Math.cos(wd * t);
    });
  }, [zeta, omega0]);

  const stageMaxWidth =
    deviceSim === 'mobile-375'
      ? '375px'
      : deviceSim === 'tablet-768'
      ? '768px'
      : '100%';

  const filteredCatalog = useMemo(() => {
    const q = filterQuery.trim().toLowerCase();
    if (!q) return STORY_CATALOG;
    return STORY_CATALOG.filter(
      (s) =>
        s.title.toLowerCase().includes(q) ||
        s.pillar.toLowerCase().includes(q) ||
        s.exports.some((ex) => ex.toLowerCase().includes(q)) ||
        s.summary.toLowerCase().includes(q)
    );
  }, [filterQuery]);

  const pillars = Array.from(new Set(filteredCatalog.map((s) => s.pillar)));

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '252px minmax(0, 1fr) 280px',
        alignItems: 'start',
        minHeight: 'calc(100vh - 52px)',
      }}
    >
      {/* ====================================================================
          LEFT RAIL: CLEAN EDITORIAL COMPONENT DIRECTORY + FILTER
          ==================================================================== */}
      <aside
        aria-label="Component Storybook Navigation"
        className="ads-ui"
        style={{
          position: 'sticky',
          top: '52px',
          height: 'calc(100vh - 52px)',
          overflowY: 'auto',
          padding: '18px 14px 28px 14px',
          borderRight: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          backgroundColor: 'var(--ads-paper-desk, #F5F3EE)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 6px',
            marginBottom: '10px',
          }}
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              fontSize: '12px',
              color: 'var(--ads-ink-carbon)',
            }}
          >
            <Layers size={13} color="var(--ads-accent-compute)" />
            <span>Components</span>
          </span>
          <span
            style={{
              fontFamily: 'var(--ads-font-chrome)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '10.5px',
              color: 'var(--ads-ink-pencil)',
            }}
          >
            {filteredCatalog.length} / {STORY_CATALOG.length}
          </span>
        </div>

        {/* Instant Component Filter Input */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '0 8px',
            height: '26px',
            marginBottom: '14px',
            borderRadius: '5px',
            backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
            border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            boxShadow: 'inset 0 1px 1.5px rgba(20, 20, 19, 0.02)',
          }}
        >
          <Search size={11} color="var(--ads-ink-pencil)" />
          <input
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Filter components…"
            aria-label="Filter components"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              backgroundColor: 'transparent',
              fontFamily: 'var(--ads-font-chrome)',
              fontSize: '11.5px',
              color: 'var(--ads-ink-carbon)',
              minWidth: 0,
            }}
          />
          {filterQuery && (
            <button
              type="button"
              onClick={() => setFilterQuery('')}
              style={{
                border: 'none',
                background: 'none',
                padding: 0,
                fontSize: '10px',
                color: 'var(--ads-ink-pencil)',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
          )}
        </div>

        {pillars.map((pillarName) => (
          <div key={pillarName} style={{ marginBottom: '14px' }}>
            <div
              className="ads-section-label"
              style={{ padding: '0 6px', marginBottom: '4px', fontSize: '10px' }}
            >
              {pillarName}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {filteredCatalog
                .filter((s) => s.pillar === pillarName)
                .map((story) => {
                  const isSelected = activeStory === story.id;
                  return (
                    <button
                      key={story.id}
                      type="button"
                      data-active={isSelected ? 'true' : 'false'}
                      className="ads-nav-item"
                      onClick={() => onSelectStory(story.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '6px',
                        padding: '0 8px',
                        height: '27px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {story.title}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--ads-font-chrome)',
                          fontVariantNumeric: 'tabular-nums',
                          fontSize: '10px',
                          color: isSelected
                            ? 'var(--ads-accent-compute)'
                            : 'var(--ads-ink-pencil)',
                          opacity: isSelected ? 0.95 : 0.65,
                        }}
                      >
                        {story.num}
                      </span>
                    </button>
                  );
                })}
            </div>
          </div>
        ))}
      </aside>

      {/* ====================================================================
          CENTER STAGE: STORYBOOK TOOLBAR + SCENARIO STAGE + SPEC DECK
          ==================================================================== */}
      <main
        style={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
        }}
      >
        {/* 36px Storybook Canvas Instrument Sub-Bar */}
        <div
          className="ads-ui"
          style={{
            minHeight: '36px',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '8px',
            padding: '4px 24px',
            backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
            borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            fontSize: '11.5px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--ads-ink-pencil)', fontWeight: 500 }}>
              {currentStory.pillar}
            </span>
            <span style={{ color: 'var(--ads-ink-pencil)' }}>/</span>
            <strong style={{ color: 'var(--ads-ink-carbon)', fontWeight: 600 }}>
              {currentStory.title}
            </strong>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}>
            {/* Container Width Simulator */}
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
            >
              <Hand size={11} />
              <span>Touch</span>
            </button>

            <button
              type="button"
              data-active={xrayBaseline ? 'true' : 'false'}
              className="ads-btn-instrument"
              onClick={() => setXrayBaseline(!xrayBaseline)}
            >
              <AlignJustify size={11} />
              <span>1rlh</span>
            </button>

            <button
              type="button"
              data-active={xrayGrid ? 'true' : 'false'}
              className="ads-btn-instrument"
              onClick={() => setXrayGrid(!xrayGrid)}
            >
              <Grid size={11} />
              <span>Grid X-Ray</span>
            </button>
          </div>
        </div>

        {/* Storybook Content Body */}
        <div
          className="ads-xray-stage"
          style={{
            padding: '22px 28px 56px 28px',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
          }}
        >
          {/* Story Title, Export Pills & Import Copy Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              gap: '12px',
            }}
          >
            <div style={{ maxWidth: '72ch' }}>
              <div
                className="ads-ui"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                  marginBottom: '6px',
                }}
              >
                <span className="ads-badge-domain">
                  COMPONENT {currentStory.num}
                </span>
                {currentStory.exports.map((expName) => (
                  <span
                    key={expName}
                    style={{
                      fontFamily: 'var(--ads-font-mono)',
                      fontSize: '11px',
                      fontWeight: 500,
                      padding: '1px 7px',
                      borderRadius: '4px',
                      backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                      border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                      color: 'var(--ads-ink-graphite, #4E4D49)',
                    }}
                  >
                    {expName}
                  </span>
                ))}
              </div>

              <h1
                className="ads-display-title"
                style={{ fontSize: '25px', margin: '0 0 6px 0' }}
              >
                {currentStory.title}
              </h1>

              <p
                className="ads-prose"
                style={{
                  fontSize: '15px',
                  lineHeight: 1.58,
                  color: 'var(--ads-ink-graphite)',
                  margin: 0,
                }}
              >
                {currentStory.summary}
              </p>
            </div>

            {/* 1-Click ES Module Import Chip */}
            <div className="ads-ui">
              <button
                type="button"
                onClick={handleCopyImport}
                className="ads-btn-instrument"
                style={{
                  height: '26px',
                  padding: '0 10px',
                  gap: '7px',
                  fontFamily: 'var(--ads-font-mono)',
                  fontSize: '11px',
                }}
                title="Copy ES module import statement"
              >
                <span style={{ color: 'var(--ads-ink-graphite)' }}>
                  {importStatement}
                </span>
                {copiedImport ? (
                  <Check size={11} color="oklch(0.45 0.14 160)" />
                ) : (
                  <Copy size={11} />
                )}
              </button>
            </div>
          </div>

          {/* LIVE INTERACTIVE CANVAS WORKBENCH (WITH SCENARIO TABS) */}
          <div
            style={{
              borderRadius: '7px',
              backgroundColor: 'var(--ads-paper-desk, #F5F3EE)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              boxShadow: 'inset 0 1px 3px rgba(20, 20, 19, 0.035)',
              overflow: 'hidden',
            }}
          >
            {/* Scenario Switcher & Stage Telemetry Strip */}
            <div
              className="ads-ui"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
                padding: '7px 14px',
                backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                fontSize: '11px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontWeight: 600,
                    color: 'var(--ads-ink-pencil)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    fontSize: '10px',
                  }}
                >
                  Scenario
                </span>
                <div className="ads-pill-group">
                  {currentStory.scenarios.map((scen) => (
                    <button
                      key={scen.id}
                      type="button"
                      data-active={activeScenarioId === scen.id ? 'true' : 'false'}
                      className="ads-pill-btn"
                      onClick={() => setActiveScenario(scen.id)}
                    >
                      {scen.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--ads-ink-pencil)' }}>
                <span>
                  ζ = <strong style={{ color: 'var(--ads-ink-carbon)' }}>{zeta.toFixed(2)}</strong> · ω₀ ={' '}
                  <strong style={{ color: 'var(--ads-ink-carbon)' }}>{omega0.toFixed(1)}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setZeta(0.25);
                    setOmega0(4.0);
                    setFormalVariant('theorem');
                    setPodDomainTag('EXACT');
                  }}
                  className="ads-btn-instrument"
                  style={{ height: '19px', padding: '0 6px', fontSize: '10px' }}
                  title="Reset specimen parameters"
                >
                  <RotateCcw size={9} />
                  <span>Reset</span>
                </button>
              </div>
            </div>

            {/* Canvas Specimen Viewport */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                padding: '28px',
              }}
            >
              <div
                className="ads-manuscript-container"
                style={{
                  width: '100%',
                  maxWidth: stageMaxWidth,
                  backgroundColor: 'var(--ads-paper-canvas, #FBF9F6)',
                  border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                  borderRadius: '8px',
                  padding: deviceSim === 'mobile-375' ? '16px' : '28px 32px',
                  boxShadow: '0 2px 10px rgba(20, 20, 19, 0.04)',
                  transition: 'max-width 200ms ease, padding 200ms ease',
                }}
              >
                {/* ============================================================
                    GENERALIST STORY 01: Buttons, Segments & Badges
                    ============================================================ */}
                {activeStory === 'buttons-badges' && activeScenarioId === 'variants-sizes' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <div className="ads-section-label" style={{ marginBottom: '8px' }}>
                        Zero-Black Tactile Keycap Hierarchy (Default 28px Small)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <Button variant="primary" kbd="⌘↵">
                          Primary Cobalt
                        </Button>
                        <Button variant="compute" kbd="⇧↵">
                          Compute Vermilion
                        </Button>
                        <Button variant="tonal">Tonal Cobalt</Button>
                        <Button variant="secondary">Secondary Ceramic</Button>
                        <Button variant="instrument" active>
                          Latched Active
                        </Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="danger">Revoke Token</Button>
                        <Button variant="secondary" disabled>
                          Disabled
                        </Button>
                      </div>
                    </div>

                    <div>
                      <div className="ads-section-label" style={{ marginBottom: '8px' }}>
                        4px Harmonic Size Scale (xs · sm · md · lg)
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <Button variant="secondary" size="xs">
                          22px Extra Small
                        </Button>
                        <Button variant="secondary" size="sm">
                          28px Small
                        </Button>
                        <Button variant="secondary" size="md">
                          34px Medium
                        </Button>
                        <Button variant="primary" size="lg" kbd="↵">
                          40px Large Action
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {activeStory === 'buttons-badges' && activeScenarioId === 'segmented-badges' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <div className="ads-section-label" style={{ marginBottom: '8px' }}>
                        Generic Segmented Control
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
                        <SegmentedControl
                          value={segView}
                          onChange={setSegView}
                          options={[
                            { id: 'realtime', label: 'Realtime', count: '60Hz' },
                            { id: '24h', label: '24 Hours' },
                            { id: '7d', label: '7 Days' },
                            { id: '30d', label: '30 Days', count: 12 },
                          ]}
                        />
                        <SegmentedControl
                          size="md"
                          value={segView}
                          onChange={setSegView}
                          options={[
                            { id: 'realtime', label: 'Overview' },
                            { id: '24h', label: 'Metrics' },
                            { id: '7d', label: 'Audit Log' },
                          ]}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="ads-section-label" style={{ marginBottom: '8px' }}>
                        Perceptual OKLCH Status Badges
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
                        <Badge tone="neutral" dot>
                          Idle · v2.4.0
                        </Badge>
                        <Badge tone="compute" dot>
                          Evaluating Kernel
                        </Badge>
                        <Badge tone="reference" dot>
                          Indexed · 1,420 docs
                        </Badge>
                        <Badge tone="success" dot>
                          99.98% Healthy
                        </Badge>
                        <Badge tone="warning" dot>
                          High Memory (84%)
                        </Badge>
                        <Badge tone="danger" dot>
                          Rate Limit Exceeded
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}

                {activeStory === 'buttons-badges' && activeScenarioId === 'toolbar-composition' && (
                  <Card
                    title="Production Deployment Pipeline"
                    subtitle="us-east-1 · Cluster 04"
                    headerRight={<Badge tone="success" dot>All Checks Passing</Badge>}
                    footer={
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span>Last deployed 14 minutes ago · SHA 9f8a21c</span>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <Button variant="ghost" size="xs">
                            View Logs
                          </Button>
                          <Button variant="primary" size="xs" kbd="⌘P">
                            Promote to Prod
                          </Button>
                        </div>
                      </div>
                    }
                  >
                    <div className="ads-ui" style={{ fontSize: '12.5px', color: 'var(--ads-ink-graphite)' }}>
                      Composing <code className="ads-inline-code">Card</code>,{' '}
                      <code className="ads-inline-code">Badge</code>, and{' '}
                      <code className="ads-inline-code">Button</code> creates high-density SaaS and
                      infrastructure control panels with zero custom CSS.
                    </div>
                  </Card>
                )}

                {/* ============================================================
                    GENERALIST STORY 02: Inputs, Selects & Form Controls
                    ============================================================ */}
                {activeStory === 'forms-inputs' && activeScenarioId === 'settings-form' && (
                  <Card
                    title="Inference Router & Execution Settings"
                    subtitle="Configure regional endpoints, concurrency limits, and deterministic seeds"
                    headerRight={<Badge tone="reference">Workspace Config</Badge>}
                    footer={
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                        <Button variant="secondary" size="sm">
                          Discard
                        </Button>
                        <Button variant="primary" size="sm" kbd="⌘S">
                          Save Configuration
                        </Button>
                      </div>
                    }
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                          gap: '14px',
                        }}
                      >
                        <FormField
                          label="Gateway Endpoint"
                          hint="TLS 1.3"
                          description="Primary regional API hostname."
                        >
                          <Input
                            prefixSlot="https://"
                            suffixSlot=":8443"
                            defaultValue="router.principia.systems"
                          />
                        </FormField>

                        <FormField
                          label="Execution Precision"
                          hint="IEEE 754"
                          description="Select floating-point arithmetic precision."
                        >
                          <Select
                            defaultValue="fp64"
                            options={[
                              { value: 'fp64', label: 'Float64 (Double Precision)' },
                              { value: 'fp32', label: 'Float32 (Single Precision)' },
                              { value: 'bf16', label: 'BFloat16 (Tensor Core)' },
                            ]}
                          />
                        </FormField>
                      </div>

                      <div
                        style={{
                          paddingTop: '10px',
                          borderTop: '1px solid var(--ads-ink-whisper)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px',
                        }}
                      >
                        <Switch
                          checked={formSwitchA}
                          onChange={setFormSwitchA}
                          label="Deterministic PRNG Seed Lock"
                          description="Forces reproducible trajectory integration across worker nodes."
                        />
                        <Switch
                          checked={formSwitchB}
                          onChange={setFormSwitchB}
                          label="Strict Schema Validation"
                          description="Reject payloads with unverified dimensional unit annotations."
                        />
                      </div>
                    </div>
                  </Card>
                )}

                {activeStory === 'forms-inputs' && activeScenarioId === 'validation-states' && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                      gap: '16px',
                    }}
                  >
                    <FormField
                      label="Max Request Timeout"
                      hint="50 – 30,000 ms"
                      description="Requests exceeding this bound are aborted."
                    >
                      <Input prefixSlot="⏱" suffixSlot="ms" defaultValue="2500" />
                    </FormField>

                    <FormField
                      label="API Signing Secret"
                      hint="Invalid format"
                      error="Secret must begin with the prefix pk_live_ or sk_live_."
                    >
                      <Input invalid defaultValue="invalid_key_9921" />
                    </FormField>
                  </div>
                )}

                {/* ============================================================
                    GENERALIST STORY 03: Cards, Metrics, Callouts & Tabs
                    ============================================================ */}
                {activeStory === 'cards-surfaces' && activeScenarioId === 'kpi-metrics' && (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                      gap: '14px',
                    }}
                  >
                    <MetricCard
                      label="P99 Query Latency"
                      value="14.2"
                      unit="ms"
                      delta="-18.4%"
                      deltaTrend="up"
                      sparklineData={[24, 22, 19, 20, 17, 16, 15, 14.2]}
                      sparklineColor="oklch(0.45 0.14 160)"
                      footnote="Target SLA < 25.0 ms across 12 edge PoPs"
                    />
                    <MetricCard
                      label="Throughput"
                      value="48,920"
                      unit="req/s"
                      delta="+12.1%"
                      deltaTrend="up"
                      sparklineData={[31, 34, 36, 39, 42, 45, 47, 48.9]}
                      sparklineColor="oklch(0.42 0.16 255)"
                      footnote="Zero dropped packets in last 24h"
                    />
                    <MetricCard
                      label="Error Rate (5xx)"
                      value="0.012"
                      unit="%"
                      delta="+0.004%"
                      deltaTrend="down"
                      sparklineData={[0.008, 0.009, 0.008, 0.01, 0.011, 0.012]}
                      sparklineColor="oklch(0.48 0.18 32)"
                      footnote="2 transient timeouts on us-west-2"
                    />
                  </div>
                )}

                {activeStory === 'cards-surfaces' && activeScenarioId === 'callouts-tabs' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Tabs
                      tabs={[
                        {
                          id: 'info',
                          label: 'System Callouts',
                          badge: 3,
                          content: (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <Callout
                                tone="info"
                                title="Index Snapshot Scheduled"
                                action={<Button size="xs" variant="secondary">Inspect</Button>}
                              >
                                Incremental vector index compaction will run at 02:00 UTC with zero
                                read downtime.
                              </Callout>
                              <Callout tone="success" title="All Replicas Synchronized">
                                Consensus state verified across 5 availability zones (raft index #994,120).
                              </Callout>
                              <Callout tone="warning" title="Memory Pressure Threshold">
                                Worker pool 03 is operating at 86% heap allocation. Consider scaling
                                horizontal replicas.
                              </Callout>
                            </div>
                          ),
                        },
                        {
                          id: 'spec',
                          label: 'Inspector Metadata',
                          content: (
                            <KeyValueList
                              items={[
                                { label: 'Cluster ID', value: 'prd-us-east-04', mono: true },
                                { label: 'Runtime Engine', value: 'Rust 1.84 · Tokio' },
                                { label: 'TLS Cipher', value: 'TLS_AES_256_GCM_SHA384', mono: true },
                                { label: 'Memory Footprint', value: '1.42 GB / 8.00 GB' },
                              ]}
                            />
                          ),
                        },
                      ]}
                    />
                  </div>
                )}

                {activeStory === 'cards-surfaces' && activeScenarioId === 'accordion-kv' && (
                  <Accordion
                    defaultOpenIds={['acc-1']}
                    items={[
                      {
                        id: 'acc-1',
                        title: '1. Zero-Copy Arrow IPC Serialization',
                        subtitle: 'Enabled · 12.4 GB/s',
                        content:
                          'Streams tabular and tensor payloads directly between worker processes over shared memory without JSON serialization overhead.',
                      },
                      {
                        id: 'acc-2',
                        title: '2. Deterministic Replay & Audit Trail',
                        subtitle: 'SHA-256 Content-Addressed',
                        content:
                          'Every state transition is logged with its input parameter vector and cryptographic digest for instant reproducibility.',
                      },
                      {
                        id: 'acc-3',
                        title: '3. Role-Based Access Control (RBAC)',
                        subtitle: '4 Active Policies',
                        content:
                          'Fine-grained read/write permissions scoped by project namespace, environment tag, and API token.',
                      },
                    ]}
                  />
                )}

                {/* ============================================================
                    GENERALIST STORY 04: Universal DataTable (Any Dataset)
                    ============================================================ */}
                {activeStory === 'general-datatable' && activeScenarioId === 'ml-benchmarks' && (
                  <DataTable
                    title="Table 1: Frontier Model Evaluation & Latency Benchmark"
                    caption="General-purpose booktabs.sty data grid with client-side filtering, column sorting, proportional bars, and 1-click CSV / LaTeX export."
                    activeRowKey={selectedTableRowId}
                    onRowClick={(r) => setSelectedTableRowId(r.id)}
                    rowKey={(r) => r.id}
                    columns={[
                      {
                        key: 'name',
                        header: 'Model Architecture',
                        group: 'Model Identity',
                        sortable: true,
                        render: (r) => (
                          <span style={{ fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                            {r.name}
                          </span>
                        ),
                      },
                      {
                        key: 'params',
                        header: 'Active Params',
                        group: 'Model Identity',
                        align: 'right',
                      },
                      {
                        key: 'mmlu',
                        header: 'MMLU-Pro (%)',
                        group: 'Accuracy Benchmarks',
                        align: 'right',
                        numericValue: (r) => r.mmlu,
                        barMax: 100,
                        barColor: 'oklch(0.45 0.145 255 / 0.12)',
                        render: (r) => `${r.mmlu.toFixed(1)}%`,
                      },
                      {
                        key: 'gpqa',
                        header: 'GPQA Diamond (%)',
                        group: 'Accuracy Benchmarks',
                        align: 'right',
                        numericValue: (r) => r.gpqa,
                        barMax: 100,
                        barColor: 'oklch(0.46 0.14 160 / 0.12)',
                        render: (r) => `${r.gpqa.toFixed(1)}%`,
                      },
                      {
                        key: 'ttft',
                        header: 'TTFT (ms)',
                        group: 'Serving Telemetry',
                        align: 'right',
                        numericValue: (r) => r.ttft,
                        render: (r) => `${r.ttft} ms`,
                      },
                      {
                        key: 'status',
                        header: 'Status',
                        group: 'Serving Telemetry',
                        align: 'right',
                        render: (r) => <Badge tone={r.tone} dot>{r.status}</Badge>,
                      },
                    ]}
                    data={[
                      {
                        id: 'claude-4-sonnet',
                        name: 'Principia-Reasoner-v3 (MoE)',
                        params: '37B / 405B',
                        mmlu: 89.4,
                        gpqa: 74.8,
                        ttft: 142,
                        status: 'Production',
                        tone: 'success' as const,
                      },
                      {
                        id: 'sym-coder-70b',
                        name: 'SymCoder-70B-Instruct',
                        params: '70B Dense',
                        mmlu: 86.2,
                        gpqa: 69.5,
                        ttft: 218,
                        status: 'Production',
                        tone: 'success' as const,
                      },
                      {
                        id: 'verlet-fast-8b',
                        name: 'Verlet-Edge-8B (FP8)',
                        params: '8.2B Dense',
                        mmlu: 76.8,
                        gpqa: 54.2,
                        ttft: 38,
                        status: 'Edge PoP',
                        tone: 'reference' as const,
                      },
                      {
                        id: 'euler-preview',
                        name: 'Euler-Zero-Preview',
                        params: '120B MoE',
                        mmlu: 91.1,
                        gpqa: 78.4,
                        ttft: 310,
                        status: 'Staging',
                        tone: 'compute' as const,
                      },
                    ]}
                    summaryRow={{
                      name: 'Fleet Mean / Aggregate',
                      params: '4 Models',
                      mmlu: '85.9%',
                      gpqa: '69.2%',
                      ttft: '177 ms',
                      status: '99.98% SLA',
                    }}
                    footnotes={[
                      { mark: 'a', text: 'Evaluated zero-shot with 5-seed majority voting.' },
                      { mark: 'b', text: 'Time-to-first-token (TTFT) measured at P95 under 64 concurrent streams.' },
                    ]}
                  />
                )}

                {activeStory === 'general-datatable' && activeScenarioId !== 'ml-benchmarks' && (
                  <DataTable
                    title={
                      activeScenarioId === 'cloud-nodes'
                        ? 'Table 2: Regional Compute Cluster Telemetry'
                        : 'Table 3: Multi-Asset Quantitative Portfolio Ledger'
                    }
                    caption="Click any column header to sort or use the filter box to query rows."
                    rowKey={(r) => r.region}
                    columns={[
                      { key: 'region', header: 'Region / Instrument', sortable: true },
                      { key: 'nodes', header: 'Active Units', align: 'right', numericValue: (r) => r.nodes },
                      {
                        key: 'utilization',
                        header: 'Utilization (%)',
                        align: 'right',
                        numericValue: (r) => r.utilization,
                        barMax: 100,
                        render: (r) => `${r.utilization.toFixed(1)}%`,
                      },
                      { key: 'p99', header: 'P99 Latency', align: 'right' },
                    ]}
                    data={[
                      { region: 'us-east-1 (N. Virginia)', nodes: 128, utilization: 84.2, p99: '11.4 ms' },
                      { region: 'eu-central-1 (Frankfurt)', nodes: 96, utilization: 76.5, p99: '14.8 ms' },
                      { region: 'ap-northeast-1 (Tokyo)', nodes: 64, utilization: 91.0, p99: '18.2 ms' },
                      { region: 'us-west-2 (Oregon)', nodes: 80, utilization: 68.4, p99: '12.9 ms' },
                    ]}
                  />
                )}

                {/* STORY 5: Computational Pod */}
                {activeStory === 'pod' && activeScenarioId === 'greens' && (
                  <Pod
                    title="1. Exact Symbolic Solution & Causal Green’s Kernel"
                    subtitle="Duhamel Spectral Decomposition"
                    domainTag={podDomainTag}
                    cellLabel="Out[1]="
                    assumptions={[
                      {
                        id: 'domain',
                        label: 'ζ, ω₀',
                        current: 'real and positive (ℝ⁺)',
                        alternatives: ['complex (ℂ)', 'distributional S′(ℝ)'],
                      },
                    ]}
                    latexSource={`x(t) = \\int_0^t \\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}} \\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right) f(\\tau)\\,d\\tau`}
                    codeSource={`DSolve[{x''[t] + 2*zeta*omega0*x'[t] + omega0^2*x[t] == DiracDelta[t]}, x[t], t]`}
                    steps={[
                      {
                        stepNumber: 1,
                        title: 'Apply unilateral Laplace transform ℒ{x(t)}(s)',
                        justification:
                          'Map the differential operator into an algebraic transfer function in the complex s-plane.',
                        renderedContent: (
                          <InlineMath latex="\tilde{G}(s) = \frac{1}{(s + \zeta\omega_0)^2 + \omega_0^2(1 - \zeta^2)}" />
                        ),
                      },
                      {
                        stepNumber: 2,
                        title: 'Invert by Bromwich residue theorem',
                        justification:
                          'Evaluate residues at conjugate poles s₁,₂ in the left half-plane.',
                      },
                    ]}
                  >
                    <EquationBlock
                      id="eq:greens"
                      number="1.1"
                      latex={`x(t) = \\int_0^t \\underbrace{\\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right)}_{G(t-\\tau)} f(\\tau)\\,d\\tau`}
                      referencedSymbols={['zeta', 'omega0', 'kernel']}
                    />
                  </Pod>
                )}

                {activeStory === 'pod' && activeScenarioId === 'eigenvalues' && (
                  <Pod
                    title="2. Characteristic Spectral Roots & Phase Velocity"
                    subtitle="Conjugate Pole Pair in Left Half-Plane"
                    domainTag="SYMBOLIC"
                    cellLabel="Out[2]="
                    latexSource={`s_{1,2} = -\\zeta\\omega_0 \\pm \\mathrm{i}\\omega_0\\sqrt{1-\\zeta^2} = -${(
                      zeta * omega0
                    ).toFixed(2)} \\pm ${(
                      omega0 * Math.sqrt(Math.max(0, 1 - zeta * zeta))
                    ).toFixed(2)}\\mathrm{i}`}
                  >
                    <EquationBlock
                      number="1.2"
                      latex={`s_{1,2} = -\\zeta\\omega_0 \\pm \\mathrm{i}\\omega_0\\sqrt{1-\\zeta^2} = -${(
                        zeta * omega0
                      ).toFixed(2)} \\pm ${(
                        omega0 * Math.sqrt(Math.max(0, 1 - zeta * zeta))
                      ).toFixed(2)}\\mathrm{i}`}
                      referencedSymbols={['zeta', 'omega0']}
                    />
                  </Pod>
                )}

                {activeStory === 'pod' && activeScenarioId === 'minimal' && (
                  <Pod
                    title="3. Seamless Monograph Section Pod"
                    subtitle="Zero-box borderless chroming override"
                    domainTag="THEOREM"
                    chromingOverride="seamless"
                  >
                    <p className="ads-prose" style={{ margin: 0 }}>
                      When <code className="ads-inline-code">chromingOverride=&quot;seamless&quot;</code> is
                      active, the pod dissolves its card border and blends into an archival LaTeX
                      monograph flow while keeping its representation controls intact.
                    </p>
                  </Pod>
                )}

                {/* STORY 2: Manipulate & Vernier Scrubber */}
                {activeStory === 'manipulate-scrubber' && activeScenarioId === 'coupled' && (
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
                        name: 'Natural Frequency',
                        value: omega0,
                        min: 1.0,
                        max: 8.0,
                        step: 0.1,
                        unit: 'rad/s',
                      },
                    ]}
                    onChange={(id, v) => (id === 'zeta' ? setZeta(v) : setOmega0(v))}
                    onReset={() => {
                      setZeta(0.25);
                      setOmega0(4.0);
                    }}
                  >
                    <div className="ads-prose">
                      Inline prose scrubbers:{' '}
                      <Scrubber
                        symbolId="zeta"
                        symbolLatex="\zeta"
                        value={zeta}
                        min={0.05}
                        max={1.8}
                        step={0.01}
                        onChange={setZeta}
                      />{' '}
                      and{' '}
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
                      . Pull downward while dragging to engage <strong>0.1× Fine</strong> and{' '}
                      <strong>0.01× Vernier Lock</strong>.
                    </div>
                  </Manipulate>
                )}

                {activeStory === 'manipulate-scrubber' && activeScenarioId === 'prose-scrubbers' && (
                  <div className="ads-prose" style={{ fontSize: '16px', lineHeight: 1.7 }}>
                    In an active manuscript following Bret Victor’s <em>Explorable Explanations</em>,
                    numeric constants are replaced by live Vernier scrubbers: for damping ratio{' '}
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
                    , the quality factor evaluates immediately to{' '}
                    <InlineMath latex={`Q = \\frac{1}{2\\zeta} = ${(1 / (2 * zeta)).toFixed(2)}`} />.
                  </div>
                )}

                {activeStory === 'manipulate-scrubber' && activeScenarioId === 'single-axis' && (
                  <Manipulate
                    title="Single-Parameter Bifurcation Controller"
                    parameters={[
                      {
                        id: 'zeta',
                        symbolId: 'zeta',
                        symbolLabel: '\\zeta',
                        name: 'Damping Bifurcation Parameter',
                        value: zeta,
                        min: 0.05,
                        max: 1.8,
                        step: 0.01,
                        presets: [
                          { label: 'Underdamped (0.25)', value: 0.25 },
                          { label: 'Critical (1.00)', value: 1.0 },
                          { label: 'Overdamped (1.45)', value: 1.45 },
                        ],
                      },
                    ]}
                    onChange={(_, v) => setZeta(v)}
                    onReset={() => setZeta(0.25)}
                  >
                    <div className="ads-prose">
                      Regime classification:{' '}
                      <strong>
                        {zeta < 0.98
                          ? 'Underdamped (Complex Conjugate Poles)'
                          : zeta <= 1.02
                          ? 'Critically Damped (Repeated Real Pole)'
                          : 'Overdamped (Distinct Real Poles)'}
                      </strong>
                    </div>
                  </Manipulate>
                )}

                {/* STORY 3: Display Equations & Symbols */}
                {activeStory === 'equation-block' && activeScenarioId === 'hamiltonian' && (
                  <div>
                    <p className="ads-prose">
                      Hover over <Sym id="zeta">damping ratio ζ</Sym>,{' '}
                      <Sym id="omega0">eigenfrequency ω₀</Sym>, or{' '}
                      <Sym id="energy">Hamiltonian ℋ(q,p)</Sym> to illuminate the equation below, or
                      hover the equation to copy <strong>TeX</strong> or <strong>Typst</strong>:
                    </p>
                    <EquationBlock
                      id="eq:greens"
                      number="2.1"
                      latex={`\\mathcal{H}(q, p) = \\frac{1}{2}p^2 + \\frac{1}{2}\\omega_0^2 q^2 \\implies \\frac{d\\mathcal{H}}{dt} = -2\\zeta\\omega_0 \\dot{q}^2 = -${(
                        2 *
                        zeta *
                        omega0
                      ).toFixed(2)}\\,\\dot{q}^2`}
                      referencedSymbols={['zeta', 'omega0', 'energy']}
                      caption="Numbered display equation with @container scroll mask and TeX/Typst clipboard export."
                    />
                  </div>
                )}

                {activeStory === 'equation-block' && activeScenarioId === 'duhamel' && (
                  <EquationBlock
                    number="1.2"
                    latex={`G(t-\\tau) = \\Theta(t-\\tau)\\,\\frac{\\exp\\!\\left(-${(
                      zeta * omega0
                    ).toFixed(2)}(t-\\tau)\\right)}{${(
                      omega0 * Math.sqrt(Math.max(0.001, Math.abs(1 - zeta * zeta)))
                    ).toFixed(2)}}\\sin\\!\\left(${(
                      omega0 * Math.sqrt(Math.max(0.001, Math.abs(1 - zeta * zeta)))
                    ).toFixed(2)}(t-\\tau)\\right)`}
                    referencedSymbols={['zeta', 'omega0', 'kernel']}
                    caption="Causal Green's kernel evaluated dynamically at the current parameter state."
                  />
                )}

                {activeStory === 'equation-block' && activeScenarioId === 'inline-prose' && (
                  <p className="ads-prose" style={{ margin: 0 }}>
                    Every inline mathematical entity—including <Sym id="zeta" math="\zeta" />,{' '}
                    <Sym id="omega0" math="\omega_0" />, the propagator{' '}
                    <Sym id="kernel" math="G(t,\tau)" />, and the Lyapunov energy{' '}
                    <Sym id="energy" math="\mathcal{H}(q,p)" />—is bound to the L2{' '}
                    <code className="ads-inline-code">SymbolRegistry</code>. Hover or click any symbol
                    to inspect its domain, SI units, and cross-document occurrences.
                  </p>
                )}

                {/* STORY 4: Theorems & Formal Proofs */}
                {activeStory === 'formal-proof' && (
                  <div>
                    <FormalBlock
                      id="thm:lyapunov"
                      variant={formalVariant}
                      number="2.1"
                      title={
                        formalVariant === 'definition'
                          ? 'Canonical Symplectic 2-Form'
                          : formalVariant === 'corollary'
                          ? 'Exponential Phase-Space Volume Decay'
                          : 'Lyapunov Phase-Space Contraction'
                      }
                    >
                      {formalVariant === 'definition' ? (
                        <>
                          On the cotangent bundle <InlineMath latex="T^*\mathcal{Q} \cong \mathbb{R}^2" />,
                          the canonical symplectic form is given by{' '}
                          <InlineMath latex="\omega = dq \wedge dp" /> with Hamiltonian energy{' '}
                          <Sym id="energy" math="\mathcal{H}(q,p)" />.
                        </>
                      ) : (
                        <>
                          For any strictly positive damping ratio <Sym id="zeta" math="\zeta > 0" /> and
                          eigenfrequency <Sym id="omega0" math="\omega_0 > 0" />, the canonical energy{' '}
                          <Sym id="energy" math="\mathcal{H}(q,p)" /> is a strict Lyapunov function.
                        </>
                      )}
                    </FormalBlock>
                    <ProofBlock
                      key={activeScenarioId}
                      title="Proof of Theorem 2.1"
                      defaultExpanded={activeScenarioId !== 'collapsed'}
                    >
                      Differentiating along trajectories yields{' '}
                      <InlineMath latex="\dot{\mathcal{H}} = -2\zeta\omega_0 p^2 \le 0" />, completing
                      the proof by LaSalle’s invariance principle.
                    </ProofBlock>
                  </div>
                )}

                {/* STORY 5: Algorithmic Pseudocode */}
                {activeStory === 'algorithm-block' && activeScenarioId === 'verlet' && (
                  <AlgorithmBlock
                    number="1.1"
                    title="Symplectic Velocity-Verlet Integrator with Exponential Damping"
                    requireText={
                      <span>
                        Initial state <InlineMath latex="(q_0, p_0)" />, step{' '}
                        <InlineMath latex="\Delta t" />, parameters <Sym id="zeta" math="\zeta" />,{' '}
                        <Sym id="omega0" math="\omega_0" />
                      </span>
                    }
                    ensureText={
                      <span>
                        Trajectory <InlineMath latex="\{(q_k, p_k)\}_{k=1}^N" /> preserving{' '}
                        <InlineMath latex="\mathcal{O}(\Delta t^2)" /> shadow Hamiltonian
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
                            <strong>for</strong> <InlineMath latex="k = 0 \text{ to } N-1" />{' '}
                            <strong>do</strong>
                          </span>
                        ),
                      },
                      {
                        line: 3,
                        indent: 1,
                        content: (
                          <InlineMath latex="p_{k+1/2} \gets \gamma \cdot p_k - \frac{\Delta t}{2}\omega_0^2 q_k" />
                        ),
                        comment: 'Symplectic kick',
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
                )}

                {activeStory === 'algorithm-block' && activeScenarioId === 'rk4' && (
                  <AlgorithmBlock
                    number="1.2"
                    title="Classical Fourth-Order Runge–Kutta Step (RK4)"
                    requireText={
                      <span>
                        Vector field <InlineMath latex="\mathbf{F}(y)" />, state{' '}
                        <InlineMath latex="y_k" />, step <InlineMath latex="h" />
                      </span>
                    }
                    lines={[
                      {
                        line: 1,
                        indent: 0,
                        content: <InlineMath latex="k_1 \gets \mathbf{F}(y_k),\quad k_2 \gets \mathbf{F}(y_k + \tfrac{h}{2}k_1)" />,
                        comment: 'Midpoint stage predictors',
                      },
                      {
                        line: 2,
                        indent: 0,
                        content: <InlineMath latex="k_3 \gets \mathbf{F}(y_k + \tfrac{h}{2}k_2),\quad k_4 \gets \mathbf{F}(y_k + h k_3)" />,
                        comment: 'Terminal stage evaluation',
                      },
                      {
                        line: 3,
                        indent: 0,
                        content: <InlineMath latex="y_{k+1} \gets y_k + \tfrac{h}{6}(k_1 + 2k_2 + 2k_3 + k_4)" />,
                        comment: 'Simpson quadrature update',
                      },
                    ]}
                  />
                )}

                {/* STORY 6: Citations & Reference Lenses */}
                {activeStory === 'citations-crossref' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeScenarioId === 'inline-lenses' && (
                      <p className="ads-prose" style={{ margin: 0 }}>
                        Hover over cross-references <CrossRef to="thm:lyapunov" /> or{' '}
                        <CrossRef to="eq:greens" />, or inspect bibliographic citations in numeric mode{' '}
                        <Cite id="arnold1989" mode="numeric" /> and author-year mode{' '}
                        <Cite id="rackauckas2020" mode="author-year" />:
                      </p>
                    )}
                    {citations['arnold1989'] && (
                      <CitationCard
                        entry={citations['arnold1989']}
                        isPinned={pinnedCitations.includes('arnold1989')}
                        onTogglePin={() => togglePinCitation('arnold1989')}
                        compact
                      />
                    )}
                  </div>
                )}

                {/* STORY 7: Scientific Plotting Suite */}
                {activeStory === 'scientific-plot' && (
                  <ScientificPlot
                    model={
                      activeScenarioId === 'quantum'
                        ? 'quantum-eigenstates'
                        : activeScenarioId === 'lotka'
                        ? 'lotka-volterra'
                        : 'damped-oscillator'
                    }
                    zeta={zeta}
                    omega0={omega0}
                  />
                )}

                {/* STORY 8: Sparklines & Dimensional Units */}
                {activeStory === 'sparkline-unit' && activeScenarioId === 'prose-inline' && (
                  <div className="ads-prose" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      Word-sized Tufte sparkline inline in prose:{' '}
                      <Sparkline
                        data={sparklineSample}
                        domain={[-1, 1]}
                        width={84}
                        height={22}
                        color="oklch(0.42 0.16 255)"
                      />{' '}
                      showing damped ringdown at <InlineMath latex={`\\zeta = ${zeta.toFixed(2)}`} />.
                    </div>
                    <div>
                      Interactive dimensional unit cycler (click chip to cycle SI ↔ CGS ↔ Natural
                      units):{' '}
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
                    </div>
                  </div>
                )}

                {activeStory === 'sparkline-unit' && activeScenarioId === 'regime-strip' && (
                  <div
                    className="ads-ui"
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                      gap: '12px',
                    }}
                  >
                    {[
                      { label: 'Underdamped (ζ = 0.15)', z: 0.15, color: 'oklch(0.42 0.16 255)' },
                      { label: 'Critical (ζ = 1.00)', z: 1.0, color: 'oklch(0.46 0.14 160)' },
                      { label: 'Overdamped (ζ = 1.45)', z: 1.45, color: 'oklch(0.48 0.18 32)' },
                    ].map((item) => {
                      const wf = Array.from({ length: 36 }, (_, i) => {
                        const t = (i / 35) * 5.0;
                        return item.z < 1
                          ? Math.exp(-item.z * omega0 * t) *
                              Math.cos(omega0 * Math.sqrt(1 - item.z * item.z) * t)
                          : (1 + omega0 * t) * Math.exp(-item.z * omega0 * t);
                      });
                      return (
                        <div
                          key={item.label}
                          style={{
                            padding: '10px 12px',
                            borderRadius: '5px',
                            backgroundColor: '#FFFFFF',
                            border: '1px solid var(--ads-ink-hairline)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <span style={{ fontSize: '11.5px', fontWeight: 500 }}>{item.label}</span>
                          <Sparkline data={wf} domain={[-1, 1]} width={68} height={20} color={item.color} />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* STORY 9: Booktabs Publication Table */}
                {activeStory === 'booktabs-table' && (
                  <BooktabsTable
                    caption="Characteristic eigenvalues λ₁,₂, quality factor Q, and energy relaxation time τ_E across damping regimes."
                    activeZeta={zeta}
                    omega0={omega0}
                    onSelectZeta={setZeta}
                  />
                )}

                {/* STORY 10: Symbolic Compute OmniBar */}
                {activeStory === 'omni-compute-bar' && (
                  <OmniComputeBar
                    onSelectPreset={(preset) => {
                      setZeta(preset.zeta);
                      setOmega0(preset.omega0);
                    }}
                  />
                )}

                {/* STORY 15: Notebook Code Cell */}
                {activeStory === 'code-cell' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {activeScenarioId === 'tensor-badges' ? (
                      <div
                        className="ads-ui"
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '12px',
                          borderRadius: '6px',
                          backgroundColor: '#FFFFFF',
                          border: '1px solid var(--ads-ink-hairline)',
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: '12px' }}>
                          Dimension &amp; Dtype Pills:
                        </span>
                        <TensorBadge shape="161×2" dtype="Float64" />
                        <TensorBadge shape="4×4×128" dtype="ComplexF64" />
                        <TensorBadge shape="1024×1024" dtype="SymPy.Matrix" />
                        <TensorBadge shape="3×3" dtype="StaticMatrix" />
                      </div>
                    ) : activeScenarioId === 'custom-ts' ? (
                      <CodeCell
                        language="TypeScript 5.8 · Bun Runtime"
                        tensorShape="200 OK"
                        tensorDtype="application/json"
                        customCode={`import { createRouter, z } from '@principia/edge';\n\nexport const telemetryRoute = createRouter()\n  .query('metrics.summary', {\n    input: z.object({ window: z.enum(['1h', '24h', '7d']) }),\n    resolve: async ({ input, ctx }) => {\n      return ctx.clickhouse.selectP99Latency(input.window);\n    },\n  });`}
                        customOutput={
                          <span
                            style={{
                              fontFamily: 'var(--ads-font-mono)',
                              fontSize: '12px',
                              color: 'oklch(0.42 0.14 160)',
                            }}
                          >
                            {`{ status: 200, p99_ms: 14.2, region: "us-east-1" }`}
                          </span>
                        }
                      />
                    ) : (
                      <CodeCell zeta={zeta} omega0={omega0} />
                    )}
                  </div>
                )}

                {/* STORY 16: Grounded AI Copilot */}
                {activeStory === 'grounded-ai' && <GroundedAIChat />}

                {/* STORY 17: Agentic Workflow & Orchestration */}
                {activeStory === 'agentic-workflow' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {activeScenarioId === 'trace-tools' ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <ToolCallCard
                          toolName="mcp.lean4.verify_proof_obligation"
                          server="lean4-kernel-v4.12"
                          status="success"
                          durationMs={640}
                          diffMode
                          argsJson={JSON.stringify(
                            {
                              theorem: 'lyapunov_spectral_contraction',
                              assumptions: ['zeta > 0', 'omega_0 > 0'],
                              tactic_timeout_ms: 2000,
                            },
                            null,
                            2
                          )}
                          outputPreview={`+ theorem lyapunov_spectral_contraction (ζ ω₀ : ℝ) (hζ : 0 < ζ) (hω : 0 < ω₀) :\n+   ∀ t ≥ 0, deriv H t = -2 * ζ * ω₀ * (p t)^2 ∧ deriv H t ≤ 0 := by\n+   intro t ht; nlinarith [sq_nonneg (p t)]\n✓ Goals accomplished (0 sorry, kernel typecheck passed in 640 ms)`}
                        />
                        <AgentTraceTimeline
                          steps={[
                            {
                              id: 'st-1',
                              stepNum: 1,
                              kind: 'reasoning',
                              agentRole: 'Orchestrator Planner',
                              title: 'Decompose Lyapunov Stability Proof & Symbolic Check',
                              detail:
                                'Partitioning task into two parallel subagents: (1) SymPy symbolic Jacobian eigenvalue verification and (2) Lean 4 formal tactic synthesis.',
                              durationMs: 380,
                              tokens: 610,
                              status: 'completed',
                            },
                            {
                              id: 'st-2',
                              stepNum: 2,
                              kind: 'subagent',
                              agentRole: 'SymPy CAS Worker',
                              title: 'Spawn Isolated CAS Sandbox & Compute Hurwitz Determinants',
                              detail:
                                'Dispatched subagent to verify trace(J) = -2ζω₀ < 0 and det(J) = ω₀² > 0 across ℝ⁺.',
                              codeOrPayload: `sympy.simplify(H.diff(t)) -> -2*zeta*omega_0*p**2 <= 0 [VERIFIED]`,
                              durationMs: 520,
                              tokens: 940,
                              status: 'verified',
                            },
                            {
                              id: 'st-3',
                              stepNum: 3,
                              kind: 'verifier',
                              agentRole: 'Lean 4 Formal Verifier',
                              title: 'Discharge Non-Linear Arithmetic Obligation via nlinarith',
                              detail:
                                'Zero-residual proof term accepted by the Lean 4 kernel with zero sorry axioms.',
                              durationMs: 640,
                              tokens: 1120,
                              status: 'verified',
                            },
                          ]}
                        />
                      </div>
                    ) : activeScenarioId === 'human-gate' ? (
                      <HumanApprovalGate
                        gateId="GATE-402"
                        agentName="Synthesizer & Patcher"
                        actionTitle="Commit Verified Lean 4 Corollary & Manuscript Patch"
                        rationale="Both SymPy CAS equivalence and Lean 4 kernel verification succeeded with 0 unresolved obligations. Requesting operator sign-off to write Corollary 2.1.3 into the primary manuscript."
                        riskLevel="medium"
                        scopesRequested={[
                          'fs.write:src/manuscript/ch2.tex',
                          'git.commit:branch/lean-verified',
                          'cas.cert:sha256-9f8a2b',
                        ]}
                        payloadPreview={`@@ -142,4 +142,10 @@\n \\begin{corollary}[Exponential Phase-Volume Contraction]\n+  For any underdamped trajectory with $\\zeta \\in (0,1)$, the symplectic phase volume\n+  contracts at the exact rate $\\Omega(t) = \\Omega(0)\\exp(-2\\zeta\\omega_0 t)$.\n \\end{corollary}`}
                        decision={storyGateDecision}
                        onApprove={() => setStoryGateDecision('approved')}
                        onReject={() => setStoryGateDecision('rejected')}
                      />
                    ) : (
                      <AgentPipelineGraph
                        selectedNodeId={selectedAgentNode}
                        onSelectNode={setSelectedAgentNode}
                        nodes={[
                          {
                            id: 'planner',
                            role: 'ORCHESTRATOR',
                            title: 'Task Decomposer',
                            model: 'claude-4-opus',
                            status: 'completed',
                            tokensUsed: 1240,
                            latencyMs: 410,
                            column: 0,
                            row: 0,
                            summary: 'Decomposes research goal into symbolic & formal sub-tasks.',
                          },
                          {
                            id: 'sympy-worker',
                            role: 'SUBAGENT · CAS',
                            title: 'SymPy Symbolic Solver',
                            model: 'o3-mini-high',
                            status: 'completed',
                            tokensUsed: 2180,
                            latencyMs: 680,
                            column: 1,
                            row: 0,
                            summary: 'Derives exact Green’s kernel & Hurwitz stability bounds.',
                          },
                          {
                            id: 'lit-worker',
                            role: 'SUBAGENT · RAG',
                            title: 'ArXiv Citation Grounder',
                            model: 'gemini-2.5-pro',
                            status: 'completed',
                            tokensUsed: 1890,
                            latencyMs: 540,
                            column: 1,
                            row: 1,
                            summary: 'Cross-checks theorem numbering against Arnold (1989).',
                          },
                          {
                            id: 'verifier',
                            role: 'VERIFIER',
                            title: 'Lean 4 Proof Kernel',
                            model: 'lean4-v4.12',
                            status: 'running',
                            tokensUsed: 3420,
                            latencyMs: 890,
                            column: 2,
                            row: 0,
                            summary: 'Discharging tactic obligations for Lyapunov contraction.',
                          },
                          {
                            id: 'gate',
                            role: 'GOVERNANCE',
                            title: 'Human Approval Gate',
                            model: 'operator-signoff',
                            status: 'awaiting-approval',
                            tokensUsed: 320,
                            latencyMs: 120,
                            column: 3,
                            row: 0,
                            summary: 'Awaiting operator ⌘↵ approval to commit manuscript patch.',
                          },
                        ]}
                        edges={[
                          { from: 'planner', to: 'sympy-worker', label: 'ODE AST', active: true },
                          { from: 'planner', to: 'lit-worker', label: 'BibTeX Keys', active: true },
                          { from: 'sympy-worker', to: 'verifier', label: 'LHS-RHS=0', active: true },
                          { from: 'lit-worker', to: 'verifier', label: 'Citations', active: true },
                          { from: 'verifier', to: 'gate', label: 'Q.E.D. Cert', active: true },
                        ]}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ==================================================================
              ANATOMY & ERGONOMICS HIGHLIGHTS BAR
              ================================================================== */}
          <div
            className="ads-ui"
            style={{
              padding: '12px 16px',
              borderRadius: '6px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              display: 'flex',
              flexDirection: 'column',
              gap: '6px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 600,
                fontSize: '11.5px',
                color: 'var(--ads-ink-carbon)',
              }}
            >
              <Sparkles size={12} color="var(--ads-accent-compute)" />
              <span>Design Anatomy &amp; Interaction Details</span>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '10px',
                fontSize: '11.5px',
                lineHeight: 1.48,
                color: 'var(--ads-ink-graphite)',
              }}
            >
              {currentStory.anatomyNotes.map((note, idx) => (
                <div key={idx} style={{ display: 'flex', gap: '6px' }}>
                  <span style={{ color: 'var(--ads-accent-compute)', fontWeight: 700 }}>·</span>
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ==================================================================
              JSX SOURCE & PROPS API SPECIFICATION
              ================================================================== */}
          <div
            className="ads-ui"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
              gap: '18px',
            }}
          >
            {/* JSX Source Card */}
            <div
              style={{
                borderRadius: '6px',
                backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 14px',
                  backgroundColor: 'var(--ads-paper-well)',
                  borderBottom: '1px solid var(--ads-ink-whisper)',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: 600,
                    fontSize: '11.5px',
                  }}
                >
                  <Code2 size={12} color="var(--ads-accent-compute)" />
                  <span>Usage Specimen</span>
                </span>
                <button
                  type="button"
                  onClick={handleCopyJsx}
                  className="ads-btn-instrument"
                >
                  {copiedJsx ? <Check size={10} color="oklch(0.45 0.14 160)" /> : <Copy size={10} />}
                  <span>{copiedJsx ? 'Copied' : 'Copy Code'}</span>
                </button>
              </div>
              <pre
                className="ads-code-block"
                style={{
                  margin: 0,
                  padding: '14px 16px',
                  fontSize: '12px',
                  lineHeight: 1.55,
                  overflowX: 'auto',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <code>{currentStory.jsxSnippet}</code>
              </pre>
            </div>

            {/* Props API Reference Table */}
            <div
              style={{
                borderRadius: '6px',
                backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 14px',
                  backgroundColor: 'var(--ads-paper-well)',
                  borderBottom: '1px solid var(--ads-ink-whisper)',
                  fontWeight: 600,
                  fontSize: '11.5px',
                }}
              >
                <span>Props Contract — {currentStory.title}</span>
                <span className="ads-badge-domain">TypeScript Strict</span>
              </div>
              <div className="ads-booktabs-scroll" style={{ padding: '10px 12px' }}>
                <table className="ads-booktabs-table">
                  <thead>
                    <tr>
                      <th colSpan={2} style={{ textAlign: 'left', padding: '4px 8px 2px 8px' }}>
                        <span className="ads-cmidrule" style={{ marginRight: '6px' }}>
                          Property &amp; Type Signature
                        </span>
                      </th>
                      <th colSpan={2} style={{ textAlign: 'left', padding: '4px 8px 2px 8px' }}>
                        <span className="ads-cmidrule" style={{ marginLeft: '4px' }}>
                          Default &amp; Semantic Contract
                        </span>
                      </th>
                    </tr>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '5px 8px 6px 8px' }}>Prop</th>
                      <th style={{ textAlign: 'left', padding: '5px 8px 6px 8px' }}>Type</th>
                      <th style={{ textAlign: 'right', padding: '5px 8px 6px 8px' }}>Default</th>
                      <th style={{ textAlign: 'left', padding: '5px 8px 6px 8px' }}>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStory.propsSpec.map((p) => (
                      <tr key={p.prop}>
                        <td style={{ padding: '7px 8px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                          <code className="ads-inline-code">{p.prop}</code>
                        </td>
                        <td
                          style={{
                            padding: '7px 8px',
                            fontFamily: 'var(--ads-font-mono)',
                            fontSize: '10.5px',
                            color: 'var(--ads-accent-reference, #1E56A0)',
                          }}
                        >
                          {p.type}
                        </td>
                        <td className="ads-cell-num" style={{ padding: '7px 8px' }}>
                          <code className="ads-inline-code" style={{ fontSize: '10px' }}>
                            {p.defaultVal}
                          </code>
                        </td>
                        <td
                          style={{
                            padding: '7px 8px',
                            fontSize: '11.5px',
                            lineHeight: 1.45,
                            color: 'var(--ads-ink-graphite)',
                          }}
                        >
                          {p.description}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* ==================================================================
              PREVIOUS / NEXT COMPONENT PAGINATION FOOTER
              ================================================================== */}
          <div
            className="ads-ui"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingTop: '14px',
              borderTop: '1px solid var(--ads-ink-hairline, #E4E2DC)',
            }}
          >
            {prevStory ? (
              <button
                type="button"
                onClick={() => onSelectStory(prevStory.id)}
                className="ads-btn-instrument"
                style={{ height: '28px', padding: '0 12px', gap: '6px' }}
              >
                <ArrowLeft size={12} />
                <span>
                  {prevStory.num}. {prevStory.title}
                </span>
              </button>
            ) : (
              <div />
            )}

            {nextStory ? (
              <button
                type="button"
                onClick={() => onSelectStory(nextStory.id)}
                className="ads-btn-instrument"
                style={{ height: '28px', padding: '0 12px', gap: '6px' }}
              >
                <span>
                  {nextStory.num}. {nextStory.title}
                </span>
                <ArrowRight size={12} />
              </button>
            ) : (
              <div />
            )}
          </div>
        </div>
      </main>

      {/* ====================================================================
          RIGHT RAIL: STORYBOOK KNOBS & LIVE SYMBOL BUS
          ==================================================================== */}
      <aside
        aria-label="Storybook Controls & Knobs"
        className="ads-ui"
        style={{
          position: 'sticky',
          top: '44px',
          padding: '14px 12px',
          borderLeft: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '11.5px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
        }}
      >
        {/* Interactive Story Knobs */}
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
            border: '1px solid var(--ads-ink-hairline)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontWeight: 600,
              marginBottom: '10px',
            }}
          >
            <Sliders size={12} color="var(--ads-accent-compute)" />
            <span>Interactive Parameters</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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

            {activeStory === 'pod' && (
              <div className="ads-prop-row">
                <span>Domain Tag</span>
                <select
                  value={podDomainTag}
                  onChange={(e) =>
                    setPodDomainTag(
                      e.target.value as typeof podDomainTag
                    )
                  }
                  className="ads-btn-instrument"
                >
                  <option value="EXACT">EXACT</option>
                  <option value="SYMBOLIC">SYMBOLIC</option>
                  <option value="NUMERICAL">NUMERICAL</option>
                  <option value="THEOREM">THEOREM</option>
                  <option value="EMPIRICAL">EMPIRICAL</option>
                  <option value="AI-VERIFIED">AI-VERIFIED</option>
                </select>
              </div>
            )}

            {activeStory === 'formal-proof' && (
              <div className="ads-prop-row">
                <span>Environment</span>
                <select
                  value={formalVariant}
                  onChange={(e) =>
                    setFormalVariant(e.target.value as FormalVariant)
                  }
                  className="ads-btn-instrument"
                >
                  <option value="theorem">theorem</option>
                  <option value="lemma">lemma</option>
                  <option value="corollary">corollary</option>
                  <option value="definition">definition</option>
                  <option value="remark">remark</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Live SymbolRegistry Bus */}
        <div
          style={{
            padding: '12px',
            borderRadius: '6px',
            backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
            border: '1px solid var(--ads-ink-hairline)',
          }}
        >
          <div className="ads-eyebrow-mono" style={{ color: 'var(--ads-accent-compute)', marginBottom: '8px' }}>
            Coupled SymbolRegistry Bus
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            {Object.values(symbols).map((sym) => {
              const slot = SYMBOL_SLOT_COLORS[sym.slot];
              const isAct = activeSymbolId === sym.id;
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
                    color: slot.fg,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  <InlineMath latex={sym.latex} /> — {sym.name}
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
};
