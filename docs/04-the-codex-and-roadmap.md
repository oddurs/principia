# 04 — "The Codex" (Custom Storybook) & Implementation Roadmap

Stock component sandboxes (like default Storybook) isolate UI widgets inside blank boxes. That approach fails for an academic design system where the hardest problems are **relational and optical**:
* *Does inline math $\sum_{i=1}^n x_i^2$ warp paragraph line-height?*
* *Does the QED tombstone `∎` collide with an equation number `(2.1)` at the end of a proof?*
* *When I hover $\zeta$ in an equation, does the corresponding trace in the SVG plot and identifier in the code cell highlight simultaneously?*
* *How does a `<Pod>` reflow when squeezed into a `375px` mobile container vs. a `65ch` LaTeX monograph?*

To test, document, and showcase these capabilities, we build **"The Codex"** (`src/codex/`)—our custom interactive workbench built with `@academic-ds/core`.

---

## 1. Architecture of "The Codex"

```
┌──────────────────────────────────────────────────────────────────────────────────────────┐
│  THE CODEX • Academic Design System      [Archetype ▾] [Density ▾] [Chroming ▾] [Theme ▾]│
│  OPTICAL LAB BAR:  [Viewport: Full | 768px | 375px]  [Touch Sim]  [Baseline 1rlh] [Grid] │
├────────────────────┬───────────────────────────────────────────────────┬─────────────────┤
│  CATALOG NAV       │  INTERACTIVE STAGE                                │  LIVE INSPECTOR │
│                    │                                                   │                 │
│  I. ARCHETYPES     │  Mode 1: Full Wolfram Compute Engine              │  SYMBOL BUS     │
│  • Compute Engine  │    OmniComputeBar + AssumptionStrip +             │  Hovered: ζ     │
│  • LaTeX Monograph │    Manipulate Pod + Step-by-Step Derivation       │  Slot #2        │
│  • Notebook + AI   │                                                   │  4 bound nodes  │
│                    │  Mode 2: LaTeX Monograph & Tufte Sidenotes        │                 │
│  II. PILLARS       │    §1 Introduction, Theorem 2.1, Proof (∎),       │  CROSS-REF BUS  │
│  • 1. Pods & Macro │    CrossRef Hover Lenses & Margin Citations       │  4 registered   │
│  • 2. Math/Formal  │                                                   │  targets        │
│  • 3. Citations    │  Mode 3: Isolated Component Specimens & Torture   │                 │
│  • 4. DataVis      │    Interactive prop controls + JSX ↔ LaTeX code   │  TOKEN CONTRACT │
│  • 5. Code Cells   │                                                   │  Live OKLCH &   │
│  • 6. AI Copilot   │                                                   │  TeX em values  │
└────────────────────┴───────────────────────────────────────────────────┴─────────────────┘
```

### Signature Diagnostic Capabilities in The Codex
1. **Archetype Switcher (Instant Universal Proof):**
   Switch the stage with a single click between:
   * **Wolfram Compute Engine View:** Query bar + computable result pods + interactive `<Manipulate>` phase portrait + step-by-step symbolic CAS trace.
   * **LaTeX Monograph View:** Continuous archival paper essay with numbered theorems, collapsible proofs (`∎`), Tufte margin citations, and non-jumping `<CrossRef>` lenses.
   * **Computational Notebook & AI Copilot View:** Bracketed `In[n]/Out[n]` code cells, Booktabs data tables, and a grounded AI research assistant with provenance chips (`[📄 Arnold 1989]`, `[🧮 Eq. (1.2)]`).
   * **Component Specimen & Token Matrix View:** Focused documentation and interactive torture tests for each individual primitive.
2. **Container & Device Simulator:**
   Resize the stage container live between `Full Workstation`, `Tablet (768px)`, and `Mobile (375px)` + toggle `Coarse Touch Pointer Simulation` to test `@container` reflows, sticky Booktabs columns, equation scroll masks, and the Touch Inspection Bottom Sheet.
3. **Optical X-Ray Lasers:**
   * **Baseline Grid Laser (`1rlh`):** Overlays horizontal cyan hairlines across the canvas to verify vertical rhythm and math strut containment.
   * **Container & Tufte Grid X-Ray:** Highlights `@container pod` boundaries and `65ch` / `28ch` manuscript columns.
4. **Live `SymbolRegistry` & `JSX ↔ LaTeX` Inspector:**
   Real-time monitor showing the currently hovered/pinned mathematical symbol, its 8-slot color token, all bound DOM consumers (`math`, `prose`, `code`, `plot`), and side-by-side React JSX vs. LaTeX source code.

---

## 2. Phased Implementation Plan

### Phase 1: Foundation, Tokens & Core State Bus (Completed)
- [x] `package.json` & project configuration
- [x] `src/tokens/tokens.stylex.ts` — Materiality (`paper`, `ink`), Brand (`accent`), Quad-Font (`fonts`), TeX grammar (`tex`), Orthogonal `density`, 8-Slot `symbols`, and `datavis` contracts
- [x] `src/tokens/themes.stylex.ts` — `manuscript` / `workbench` / `compact` densities + `archival-wolfram` / `swiss-lab` / `oxford-monograph` themes + `latex-classic` / `neo-grotesque` voices
- [x] `src/styles/foundation.css` — Optical font locks, math struts, `@container pod/manuscript` queries, touch pointer rules, X-ray overlays, and `@media print`
- [x] `src/core/registry.tsx` — `AcademicSystemProvider`, `SymbolRegistry`, `DocumentRegistry`, and environment state
- [x] `src/primitives/pod/Pod.tsx` & `src/primitives/compute/Manipulate.tsx` — Universal `<Pod>` and multi-gear Vernier `<Scrubber>` / `<Manipulate>`

### Phase 2: Domain Primitives Across All 6 Pillars (Completed)
- [x] **Math & Formal (`src/primitives/manuscript/MathAndFormal.tsx`):**
  - `<InlineMath>` & `<EquationBlock>` (KaTeX rendering + interactive `\sym{id}{expr}` binding)
  - `<Sym>` (prose symbol token)
  - `<FormalBlock>` (`theorem`, `lemma`, `definition`, `remark`), `<ProofBlock>` (with auto-aligned `∎`), and `<AlgorithmBlock>`
- [x] **Prose, Citations & Cross-Refs (`src/primitives/manuscript/CitationsAndRefs.tsx`):**
  - `<Cite>`, `<CitationCard>`, `<MarginSidenoteColumn>`, and `<CrossRef>` with floating `<CrossRefLens>`
- [x] **Science & DataVis (`src/primitives/datavis/ScienceAndVis.tsx`):**
  - `<ScientificPlot>` (interactive dual-panel Damped Harmonic Oscillator temporal envelope + phase-space portrait bound to $\zeta$ and $\omega_0$ and `SymbolRegistry`)
  - `<BooktabsTable>` (publication table with `\toprule`, `\midrule`, `\cmidrule`, `\bottomrule`, and sticky mobile column)
  - `<UnitValue>` (interactive SI/CGS unit badge)
- [x] **Compute & Grounded AI (`src/primitives/compute/CodeAndCopilot.tsx`):**
  - `<OmniComputeBar>` (Wolfram-style query/symbolic input with touch math ribbon)
  - `<CodeCell>` (syntax-highlighted Julia/SymPy cell with `SymbolRegistry` token linking and execution gutter)
  - `<GroundedAIChat>` (`<GroundingChip>`, `<VerificationBadge>`, `<ReasoningTimeline>`, and `<ManuscriptPatch>`)

### Phase 3: "The Codex" Interactive Workbench & Verification (Completed)
- [x] Build `src/codex/CodexApp.tsx` with the top Optical Lab Bar (Archetype, Density, Chroming, Theme, Device Width, Touch Sim, Baseline & Grid X-Ray toggles), Left Catalog Navigation, Center Stage, Right Live Inspector, and Mobile Touch Inspection Bottom Sheet.
- [x] Wire `index.html`, `vite.config.ts`, and `src/main.tsx`, install dependencies, and verify zero TypeScript/build errors.
