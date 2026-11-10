import * as stylex from '@stylexjs/stylex';
import { paper, ink, accent, fonts, density } from './tokens.stylex';

/**
 * ============================================================================
 * L2: MULTI-AXIS ADAPTIVE THEMING ENGINE (Linear Density & Vertical Rhythm)
 * ============================================================================
 */

export const densityManuscript = stylex.createTheme(density, {
  titleSize: '1.875rem', // 30px
  titleLineHeight: '1.22',
  headingSize: '0.875rem', // 14px
  proseSize: '1.125rem', // 18px
  proseLineHeight: '1.65',
  secondaryProseSize: '0.9375rem', // 15px
  baselineStep: '28px',
  chromeSize: '0.78125rem', // 12.5px
  metaSize: '0.71875rem', // 11.5px
  monoSize: '0.8125rem', // 13px
  podPaddingY: '22px',
  podPaddingX: '24px',
  podPadding: '22px 24px',
  podGap: '20px',
  blockMarginY: '20px',
  podRadius: '6px',
  proseMeasure: '65ch',
  marginMeasure: '26ch',
  marginGutter: '2.5rem',
  hitTarget: '28px',
});

export const densityWorkbench = stylex.createTheme(density, {
  titleSize: '1.625rem', // 26px
  titleLineHeight: '1.22',
  headingSize: '0.84375rem', // 13.5px
  proseSize: '1.03125rem', // 16.5px
  proseLineHeight: '1.58',
  secondaryProseSize: '0.875rem', // 14px
  baselineStep: '26px',
  chromeSize: '0.78125rem', // 12.5px
  metaSize: '0.71875rem', // 11.5px
  monoSize: '0.78125rem', // 12.5px
  podPaddingY: '18px',
  podPaddingX: '20px',
  podPadding: '18px 20px',
  podGap: '16px',
  blockMarginY: '16px',
  podRadius: '6px',
  proseMeasure: '65ch',
  marginMeasure: '25ch',
  marginGutter: '2rem',
  hitTarget: '28px',
});

export const densityCompact = stylex.createTheme(density, {
  titleSize: '1.375rem', // 22px
  titleLineHeight: '1.2',
  headingSize: '0.8125rem', // 13px
  proseSize: '0.9375rem', // 15px
  proseLineHeight: '1.52',
  secondaryProseSize: '0.8125rem', // 13px
  baselineStep: '22px',
  chromeSize: '0.75rem', // 12px
  metaSize: '0.6875rem', // 11px
  monoSize: '0.75rem', // 12px
  podPaddingY: '14px',
  podPaddingX: '16px',
  podPadding: '14px 16px',
  podGap: '12px',
  blockMarginY: '12px',
  podRadius: '5px',
  proseMeasure: '62ch',
  marginMeasure: '22ch',
  marginGutter: '1.5rem',
  hitTarget: '26px',
});

export const materialArchivalWolfram = stylex.createTheme(paper, {
  desk: 'oklch(0.964 0.004 82)',
  canvas: 'oklch(0.986 0.003 85)',
  plate: 'oklch(1.000 0.000 0)',
  well: 'oklch(0.974 0.004 83)',
  lens: 'oklch(0.995 0.002 85 / 0.96)',
  wash: 'oklch(0.948 0.008 82)',
});

export const materialSwissLab = stylex.createTheme(paper, {
  desk: 'oklch(0.968 0.002 250)',
  canvas: 'oklch(0.990 0.001 250)',
  plate: 'oklch(1.000 0.000 0)',
  well: 'oklch(0.976 0.002 250)',
  lens: 'oklch(0.998 0.001 250 / 0.96)',
  wash: 'oklch(0.955 0.003 250)',
});

export const materialSwissLabInk = stylex.createTheme(ink, {
  carbon: 'oklch(0.145 0.005 250)',
  graphite: 'oklch(0.410 0.008 250)',
  pencil: 'oklch(0.580 0.006 250)',
  hairline: 'oklch(0.910 0.004 250)',
  whisper: 'oklch(0.945 0.003 250)',
  borderStrong: 'oklch(0.750 0.010 250)',
});

export const materialSwissLabAccent = stylex.createTheme(accent, {
  compute: 'oklch(0.480 0.165 255)',
  computeSurface: 'oklch(0.960 0.020 255)',
  computeBorder: 'oklch(0.840 0.060 255)',
  reference: 'oklch(0.420 0.140 210)',
  referenceSurface: 'oklch(0.960 0.020 210)',
  referenceBorder: 'oklch(0.850 0.050 210)',
  verified: 'oklch(0.480 0.130 160)',
  verifiedSurface: 'oklch(0.965 0.025 160)',
  assumption: 'oklch(0.580 0.145 75)',
  assumptionSurface: 'oklch(0.972 0.025 80)',
  contradiction: 'oklch(0.510 0.190 22)',
  contradictionSurface: 'oklch(0.962 0.025 22)',
});

export const materialOxfordMonograph = stylex.createTheme(paper, {
  desk: 'oklch(0.945 0.011 78)',
  canvas: 'oklch(0.978 0.008 80)',
  plate: 'oklch(0.994 0.004 82)',
  well: 'oklch(0.960 0.009 79)',
  lens: 'oklch(0.988 0.006 80 / 0.96)',
  wash: 'oklch(0.935 0.012 78)',
});

export const voiceClassicalSerif = stylex.createTheme(fonts, {
  prose:
    '"NewComputerModern10-Book", "NewComputerModern", "Latin Modern Roman", "CMU Serif", Georgia, serif',
  math: '"KaTeX_Main", "NewComputerModernMath", "Latin Modern Math", serif',
  chrome: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", "JuliaMono", monospace',
});

export const voiceStixTwo = stylex.createTheme(fonts, {
  prose: '"STIX Two Text", "NewComputerModern10-Book", Georgia, serif',
  math: '"STIX Two Math", "KaTeX_Main", serif',
  chrome: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", monospace',
});

export const voiceNeoGrotesque = stylex.createTheme(fonts, {
  prose: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  math: '"KaTeX_Main", "STIX Two Math", serif',
  chrome: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  mono: '"JetBrains Mono", monospace',
});
