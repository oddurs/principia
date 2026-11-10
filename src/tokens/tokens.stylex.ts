import * as stylex from '@stylexjs/stylex';

/**
 * ============================================================================
 * L1: UNIVERSAL ACADEMIC DESIGN SYSTEM TOKENS (Linear Density & Vertical Rhythm)
 * ============================================================================
 * Engineered around a strict 4px sub-grid and 24px/26px harmonic baseline unit:
 * - Shell Bars: 44px top bar, 36px sub-header / pod header bar
 * - Controls: 22px (xs), 26px (sm), 28px (md), 34px (lg)
 * - Prose Rhythm: 16.5px / 26px (1.58) in Workbench; 18px / 28px in Manuscript
 * - Chrome Rhythm: 12.5px / 20px with -0.011em tracking
 */

export const paper = stylex.defineVars({
  desk: 'oklch(0.964 0.004 82)', // #F5F3EE
  canvas: 'oklch(0.986 0.003 85)', // #FBF9F6
  plate: 'oklch(1.000 0.000 0)', // #FFFFFF
  well: 'oklch(0.974 0.004 83)', // #F7F5F0
  lens: 'oklch(0.995 0.002 85 / 0.96)',
  wash: 'oklch(0.948 0.008 82)',
});

export const ink = stylex.defineVars({
  carbon: 'oklch(0.175 0.005 80)', // #141413
  graphite: 'oklch(0.430 0.007 80)', // #4E4D49
  pencil: 'oklch(0.600 0.006 80)', // #82807A
  hairline: 'oklch(0.908 0.005 82)', // #E4E2DC
  whisper: 'oklch(0.942 0.004 82)', // Subtle internal row/header divider
  borderStrong: 'oklch(0.780 0.008 80)',
});

export const accent = stylex.defineVars({
  compute: 'oklch(0.555 0.195 32)', // #D63E18
  computeSurface: 'oklch(0.962 0.025 35)',
  computeBorder: 'oklch(0.850 0.070 33)',

  reference: 'oklch(0.450 0.145 255)', // #1E56A0
  referenceSurface: 'oklch(0.962 0.020 255)',
  referenceBorder: 'oklch(0.860 0.055 255)',

  verified: 'oklch(0.480 0.130 160)',
  verifiedSurface: 'oklch(0.965 0.025 160)',

  assumption: 'oklch(0.580 0.145 75)',
  assumptionSurface: 'oklch(0.972 0.025 80)',

  contradiction: 'oklch(0.510 0.190 22)',
  contradictionSurface: 'oklch(0.962 0.025 22)',
});

export const fonts = stylex.defineVars({
  display: '"Newsreader", "STIX Two Text", Georgia, serif',
  prose: '"Newsreader", "STIX Two Text", Georgia, serif',
  math: '"KaTeX_Main", "KaTeX_Math", "STIX Two Math", serif',
  chrome:
    '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"JetBrains Mono", "JuliaMono", "Commit Mono", "Fira Code", monospace',
});

export const tex = stylex.defineVars({
  thinspace: '0.16667em',
  medspace: '0.22222em',
  thickspace: '0.27778em',
  quad: '1em',
  qquad: '2em',
  parindent: '1.5em',
  ruleHeavy: '0.08em',
  ruleLight: '0.05em',
  ruleCmid: '0.035em',
});

/**
 * 5. LINEAR-GRADE DENSITY & VERTICAL RHYTHM CONTRACT
 */
export const density = stylex.defineVars({
  /** Document Title (H1) */
  titleSize: '1.625rem', // 26px
  titleLineHeight: '1.15',
  /** Pod / Section Header (H2/H3) */
  headingSize: '1rem', // 16px
  /** Primary Manuscript Prose */
  proseSize: '0.96875rem', // 15.5px
  proseLineHeight: '1.60',
  /** Secondary Prose (Captions, Sidenotes, Copilot) */
  secondaryProseSize: '0.84375rem', // 13.5px
  /** Computed 1rlh baseline grid step */
  baselineStep: '25px',
  /** UI Chrome / Navigation / Controls */
  chromeSize: '0.75rem', // 12px
  /** Small Metadata / Badges / Ticks */
  metaSize: '0.6875rem', // 11px
  /** Code / Symbolic Cell Font Size */
  monoSize: '0.75rem', // 12px
  /** Pod Internal Stage Padding */
  podPaddingY: '16px',
  podPaddingX: '18px',
  podPadding: '16px 18px',
  /** Vertical Rhythm Between Pods / Sections */
  podGap: '14px',
  /** Vertical Rhythm Around Display Equations & Theorems */
  blockMarginY: '12px',
  /** Pod Corner Radius */
  podRadius: '6px',
  /** Optimal Prose Line Measure */
  proseMeasure: '65ch',
  /** Right-Hand Tufte Sidenote Margin Width */
  marginMeasure: '26ch',
  /** Gutter Between Prose and Margin Column */
  marginGutter: '2rem',
  /** Minimum Interactive Hit Target */
  hitTarget: '28px',
});

export const symbols = stylex.defineVars({
  sym1Fg: 'oklch(0.44 0.16 255)',
  sym1Bg: 'oklch(0.93 0.045 255)',
  sym2Fg: 'oklch(0.50 0.18 30)',
  sym2Bg: 'oklch(0.94 0.045 30)',
  sym3Fg: 'oklch(0.46 0.14 160)',
  sym3Bg: 'oklch(0.93 0.045 160)',
  sym4Fg: 'oklch(0.48 0.16 310)',
  sym4Bg: 'oklch(0.94 0.045 310)',
  sym5Fg: 'oklch(0.52 0.15 75)',
  sym5Bg: 'oklch(0.95 0.050 75)',
  sym6Fg: 'oklch(0.46 0.13 200)',
  sym6Bg: 'oklch(0.93 0.040 200)',
  sym7Fg: 'oklch(0.48 0.17 350)',
  sym7Bg: 'oklch(0.94 0.045 350)',
  sym8Fg: 'oklch(0.42 0.10 120)',
  sym8Bg: 'oklch(0.93 0.035 120)',
});

export const datavis = stylex.defineVars({
  cat1: 'oklch(0.48 0.15 250)',
  cat2: 'oklch(0.62 0.18 45)',
  cat3: 'oklch(0.55 0.14 165)',
  cat4: 'oklch(0.52 0.15 325)',
  cat5: 'oklch(0.68 0.14 230)',
  cat6: 'oklch(0.78 0.16 85)',
  gridline: 'oklch(0.93 0.004 82)',
  axisLine: 'oklch(0.35 0.006 80)',
  ci50Alpha: '0.24',
  ci95Alpha: '0.12',
});
