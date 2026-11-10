/**
 * ============================================================================
 * @principia/core — PUBLIC PACKAGE BARREL EXPORT
 * ============================================================================
 */

// L1 Tokens
export * from './tokens/tokens.stylex';

// L2 Reactive Symbol & Document Registry Bus
export * from './core/registry';

// L3 Generalist UI Foundation & Six Domain Component Pillars
export * from './primitives/general/GeneralFoundation';
export * from './primitives/pod/Pod';
export * from './primitives/compute/Manipulate';
export * from './primitives/manuscript/MathAndFormal';
export * from './primitives/manuscript/CitationsAndRefs';
export * from './primitives/datavis/ScienceAndVis';
export * from './primitives/compute/CodeAndCopilot';

// L4 Flagship Application Archetypes & Unified Platform Shell
export * from './prototypes/DomainPrototypes';
export * from './app/PrincipiaApp';
export * from './codex/CodexApp';
export * from './platform/PlatformShell';
export * from './platform/navigation';
