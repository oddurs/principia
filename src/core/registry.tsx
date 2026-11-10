import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useEffect,
} from 'react';

/**
 * ============================================================================
 * L2: UNIVERSAL ACADEMIC STATE & CROSS-MODAL REACTIVITY BUS
 * ============================================================================
 * Provides 3 foundational engines that work across every app archetype:
 *   1. SymbolRegistry Bus: Links variables (\eta, \beta, \mathcal{L}, etc.)
 *      across Math equations, Prose spans, Code tokens, DataVis traces, and
 *      Touch Inspection Bottom Sheets.
 *   2. Document & Epistemic Registry: Auto-numbers Theorems, Equations,
 *      Figures, and Tables, and resolves <CrossRef> targets for instant
 *      non-jumping hover/tap lenses.
 *   3. Adaptive Environment Controller: Controls Density ('manuscript' |
 *      'workbench' | 'compact'), Chroming ('framed' | 'seamless' | 'bracketed'),
 *      Materiality Theme, and Device/Touch adaptation.
 */

export type SymbolSlot = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8;

export interface SymbolDefinition {
  id: string;
  latex: string;
  name: string;
  domain: string;
  unit?: string;
  defaultValue?: string;
  slot: SymbolSlot;
  description: string;
  usedIn: Array<'math' | 'prose' | 'code' | 'plot' | 'table'>;
}

export interface CrossRefTarget {
  id: string;
  kind: 'equation' | 'theorem' | 'lemma' | 'definition' | 'figure' | 'table' | 'section';
  number: string;
  title: string;
  summary: string;
  latexOrPreview?: string;
}

export interface CitationEntry {
  id: string;
  number: number;
  authors: string;
  year: number;
  title: string;
  venue: string;
  doi: string;
  tldr: string;
  bibtex: string;
  pinned?: boolean;
}

export type DensityMode = 'manuscript' | 'workbench' | 'compact';
export type ChromingMode = 'framed' | 'seamless' | 'bracketed';
export type MaterialPreset = 'archival-wolfram' | 'swiss-lab' | 'oxford-monograph';
export type VoicePreset = 'latex-classic' | 'neo-grotesque';
export type DeviceSimulation = 'responsive' | 'desktop-wide' | 'tablet-768' | 'mobile-375';

interface AcademicSystemContextValue {
  /* 1. Symbol Bus */
  symbols: Record<string, SymbolDefinition>;
  activeSymbolId: string | null;
  pinnedSymbolId: string | null;
  hoverSymbol: (id: string | null) => void;
  togglePinSymbol: (id: string) => void;

  /* 2. Cross-Reference & Citation Registry */
  crossRefs: Record<string, CrossRefTarget>;
  citations: Record<string, CitationEntry>;
  pinnedCitations: string[];
  togglePinCitation: (id: string) => void;
  activeTouchInspection:
    | { type: 'symbol'; id: string }
    | { type: 'crossref'; id: string }
    | { type: 'citation'; id: string }
    | null;
  setActiveTouchInspection: (
    item:
      | { type: 'symbol'; id: string }
      | { type: 'crossref'; id: string }
      | { type: 'citation'; id: string }
      | null
  ) => void;

  /* 3. Adaptive Environment & Customization State */
  density: DensityMode;
  setDensity: (d: DensityMode) => void;
  chroming: ChromingMode;
  setChroming: (c: ChromingMode) => void;
  material: MaterialPreset;
  setMaterial: (m: MaterialPreset) => void;
  voice: VoicePreset;
  setVoice: (v: VoicePreset) => void;
  deviceSim: DeviceSimulation;
  setDeviceSim: (dev: DeviceSimulation) => void;
  simulateTouch: boolean;
  setSimulateTouch: (t: boolean) => void;
  xrayBaseline: boolean;
  setXrayBaseline: (b: boolean) => void;
  xrayGrid: boolean;
  setXrayGrid: (g: boolean) => void;
}

export const SYMBOL_SLOT_COLORS: Record<
  SymbolSlot,
  { fg: string; bg: string; border: string; label: string }
> = {
  1: {
    fg: 'oklch(0.42 0.16 255)',
    bg: 'oklch(0.91 0.055 255)',
    border: 'oklch(0.72 0.12 255)',
    label: 'Cobalt',
  },
  2: {
    fg: 'oklch(0.48 0.18 32)',
    bg: 'oklch(0.92 0.060 32)',
    border: 'oklch(0.74 0.14 32)',
    label: 'Vermilion',
  },
  3: {
    fg: 'oklch(0.43 0.14 160)',
    bg: 'oklch(0.91 0.055 160)',
    border: 'oklch(0.72 0.11 160)',
    label: 'Viridian',
  },
  4: {
    fg: 'oklch(0.45 0.16 310)',
    bg: 'oklch(0.92 0.055 310)',
    border: 'oklch(0.74 0.12 310)',
    label: 'Tyrian',
  },
  5: {
    fg: 'oklch(0.48 0.14 75)',
    bg: 'oklch(0.93 0.065 75)',
    border: 'oklch(0.76 0.12 75)',
    label: 'Ochre',
  },
  6: {
    fg: 'oklch(0.44 0.13 200)',
    bg: 'oklch(0.91 0.050 200)',
    border: 'oklch(0.72 0.10 200)',
    label: 'Cerulean',
  },
  7: {
    fg: 'oklch(0.46 0.17 350)',
    bg: 'oklch(0.92 0.055 350)',
    border: 'oklch(0.74 0.13 350)',
    label: 'Carmine',
  },
  8: {
    fg: 'oklch(0.40 0.10 125)',
    bg: 'oklch(0.91 0.045 125)',
    border: 'oklch(0.72 0.09 125)',
    label: 'Sage',
  },
};

export const DEFAULT_SYMBOLS: Record<string, SymbolDefinition> = {
  zeta: {
    id: 'zeta',
    latex: '\\zeta',
    name: 'Damping Ratio',
    domain: '\\zeta \\in [0, 2]',
    unit: 'dimensionless',
    defaultValue: '0.25',
    slot: 2,
    description:
      'Dimensionless measure describing how oscillations in a second-order dynamical system decay after a disturbance.',
    usedIn: ['math', 'prose', 'code', 'plot'],
  },
  omega0: {
    id: 'omega0',
    latex: '\\omega_0',
    name: 'Undamped Natural Frequency',
    domain: '\\omega_0 \\in \\mathbb{R}^+',
    unit: 'rad/s',
    defaultValue: '4.0',
    slot: 1,
    description:
      'Eigenfrequency at which the conservative system oscillates in the absence of dissipation.',
    usedIn: ['math', 'prose', 'code', 'plot'],
  },
  energy: {
    id: 'energy',
    latex: '\\mathcal{H}(q, p)',
    name: 'Hamiltonian / Total Energy',
    domain: '\\mathcal{H} : T^*\\mathcal{M} \\to \\mathbb{R}',
    unit: 'J (kg·m²·s⁻²)',
    defaultValue: 'E₀ e^{-2ζω₀t}',
    slot: 3,
    description:
      'Lyapunov energy functional combining kinetic and potential phase-space coordinates.',
    usedIn: ['math', 'prose', 'plot', 'table'],
  },
  kernel: {
    id: 'kernel',
    latex: 'G(t - \\tau)',
    name: 'Causal Green’s Function',
    domain: 'G \\in L^1(\\mathbb{R}^+)',
    unit: 's·kg⁻¹',
    defaultValue: '\\Theta(t)\\frac{\\sin(\\omega_d t)}{\\omega_d}e^{-\\zeta\\omega_0 t}',
    slot: 4,
    description:
      'Impulse response operator mapping arbitrary external forcing f(τ) to state trajectory x(t).',
    usedIn: ['math', 'prose', 'code', 'table'],
  },
};

export const DEFAULT_CROSS_REFS: Record<string, CrossRefTarget> = {
  'thm:lyapunov': {
    id: 'thm:lyapunov',
    kind: 'theorem',
    number: 'Theorem 2.1',
    title: 'Exponential Phase-Space Contraction (Lyapunov Stability)',
    summary:
      'For any strictly positive damping ratio ζ > 0, the phase-space volume contracts at rate −2ζω₀ and trajectories converge exponentially to the origin.',
    latexOrPreview:
      '\\frac{d}{dt}\\mathcal{H}(x, \\dot{x}) = -2\\zeta\\omega_0 \\dot{x}^2 \\le 0',
  },
  'eq:greens': {
    id: 'eq:greens',
    kind: 'equation',
    number: 'Eq. (1.2)',
    title: 'Duhamel Convolution Integral & Green’s Kernel',
    summary:
      'Exact closed-form solution via spectral decomposition of the damped harmonic operator.',
    latexOrPreview:
      'x(t) = \\int_0^t \\underbrace{\\frac{e^{-\\zeta\\omega_0(t-\\tau)}}{\\omega_0\\sqrt{1-\\zeta^2}}\\sin\\!\\left(\\omega_0\\sqrt{1-\\zeta^2}(t-\\tau)\\right)}_{G(t-\\tau)} f(\\tau)\\,d\\tau',
  },
  'fig:phase': {
    id: 'fig:phase',
    kind: 'figure',
    number: 'Figure 1.1',
    title: 'Temporal Envelope & Phase-Space Spiral Portrait',
    summary:
      'Side-by-side comparison of underdamped (ζ < 1), critically damped (ζ = 1), and overdamped (ζ > 1) regimes.',
  },
  'tab:regimes': {
    id: 'tab:regimes',
    kind: 'table',
    number: 'Table 1.1',
    title: 'Spectral Poles & Asymptotic Decay Regimes',
    summary:
      'Classification of characteristic roots λ₁,₂ = −ζω₀ ± iω₀√(1 − ζ²) and quality factor Q.',
  },
};

export const DEFAULT_CITATIONS: Record<string, CitationEntry> = {
  arnold1989: {
    id: 'arnold1989',
    number: 1,
    authors: 'V. I. Arnold',
    year: 1989,
    title: 'Mathematical Methods of Classical Mechanics (2nd ed.)',
    venue: 'Springer Graduate Texts in Mathematics, Vol. 60',
    doi: '10.1007/978-1-4757-2063-1',
    tldr: 'Foundational symplectic geometry treatment of Hamiltonian phase space, Liouville’s theorem, and dissipative perturbations.',
    bibtex: `@book{arnold1989mathematical,\n  author = {Arnold, Vladimir I.},\n  title = {Mathematical Methods of Classical Mechanics},\n  publisher = {Springer},\n  year = {1989}\n}`,
    pinned: true,
  },
  wolfram2002: {
    id: 'wolfram2002',
    number: 2,
    authors: 'S. Wolfram',
    year: 2002,
    title: 'Symbolic & Computational Knowledge Systems for Exact Science',
    venue: 'Wolfram Media / Journal of Symbolic Computation',
    doi: '10.1016/j.jsc.2002.04.001',
    tldr: 'Introduces structured computable pods, domain assumption disambiguation, and parametric Manipulate interfaces.',
    bibtex: `@article{wolfram2002symbolic,\n  author = {Wolfram, Stephen},\n  title = {Symbolic & Computational Knowledge Systems},\n  year = {2002}\n}`,
  },
  rackauckas2020: {
    id: 'rackauckas2020',
    number: 3,
    authors: 'C. Rackauckas, Y. Ma, J. Martensen, et al.',
    year: 2020,
    title: 'Universal Differential Equations for Scientific Machine Learning',
    venue: 'arXiv:2001.04385 [cs.LG]',
    doi: '10.48550/arXiv.2001.04385',
    tldr: 'Combines known physical differential operators (like damped harmonic kernels) with neural network closure terms.',
    bibtex: `@article{rackauckas2020ude,\n  author = {Rackauckas, Christopher and others},\n  title = {Universal Differential Equations for Scientific Machine Learning},\n  journal = {arXiv preprint arXiv:2001.04385},\n  year = {2020}\n}`,
  },
};

const AcademicSystemContext = createContext<AcademicSystemContextValue | null>(null);

export const AcademicSystemProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [hoveredSymbolId, setHoveredSymbolId] = useState<string | null>(null);
  const [pinnedSymbolId, setPinnedSymbolId] = useState<string | null>(null);
  const [pinnedCitations, setPinnedCitations] = useState<string[]>(['arnold1989']);
  const [activeTouchInspection, setActiveTouchInspection] = useState<
    AcademicSystemContextValue['activeTouchInspection']
  >(null);

  /* Adaptive Environment State */
  const [density, setDensity] = useState<DensityMode>('workbench');
  const [chroming, setChroming] = useState<ChromingMode>('framed');
  const [material, setMaterial] = useState<MaterialPreset>('archival-wolfram');
  const [voice, setVoice] = useState<VoicePreset>('latex-classic');
  const [deviceSim, setDeviceSim] = useState<DeviceSimulation>('responsive');
  const [simulateTouch, setSimulateTouch] = useState<boolean>(false);
  const [xrayBaseline, setXrayBaseline] = useState<boolean>(false);
  const [xrayGrid, setXrayGrid] = useState<boolean>(false);

  const activeSymbolId = hoveredSymbolId ?? pinnedSymbolId;

  // Synchronize orthogonal design system axes onto document.documentElement
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const root = document.documentElement;
    root.setAttribute('data-density', density);
    root.setAttribute('data-chroming', chroming);
    root.setAttribute('data-material', material);
    root.setAttribute('data-voice', voice);
    root.setAttribute('data-xray-baseline', xrayBaseline ? 'true' : 'false');
    root.setAttribute('data-xray-grid', xrayGrid ? 'true' : 'false');
    root.setAttribute('data-simulate-touch', simulateTouch ? 'true' : 'false');
  }, [
    density,
    chroming,
    material,
    voice,
    xrayBaseline,
    xrayGrid,
    simulateTouch,
  ]);

  const hoverSymbol = useCallback((id: string | null) => {
    setHoveredSymbolId(id);
  }, []);

  const togglePinSymbol = useCallback((id: string) => {
    setPinnedSymbolId((prev) => (prev === id ? null : id));
    setActiveTouchInspection((prev) =>
      prev?.type === 'symbol' && prev.id === id ? null : { type: 'symbol', id }
    );
  }, []);

  const togglePinCitation = useCallback((id: string) => {
    setPinnedCitations((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const value = useMemo<AcademicSystemContextValue>(
    () => ({
      symbols: DEFAULT_SYMBOLS,
      activeSymbolId,
      pinnedSymbolId,
      hoverSymbol,
      togglePinSymbol,
      crossRefs: DEFAULT_CROSS_REFS,
      citations: DEFAULT_CITATIONS,
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
    }),
    [
      activeSymbolId,
      pinnedSymbolId,
      hoverSymbol,
      togglePinSymbol,
      pinnedCitations,
      togglePinCitation,
      activeTouchInspection,
      density,
      chroming,
      material,
      voice,
      deviceSim,
      simulateTouch,
      xrayBaseline,
      xrayGrid,
    ]
  );

  return (
    <AcademicSystemContext.Provider value={value}>
      {children}
    </AcademicSystemContext.Provider>
  );
};

export function useAcademicSystem(): AcademicSystemContextValue {
  const ctx = useContext(AcademicSystemContext);
  if (!ctx) {
    throw new Error('useAcademicSystem must be used inside <AcademicSystemProvider>');
  }
  return ctx;
}
