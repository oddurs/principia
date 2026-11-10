# 📖 Principia (`@principia/core`)

**Where the editorial monograph meets the precision instrument.**

**Principia** (`@principia/core`) is an open-source, light-mode universal design system and component library engineered for scientific computing, AI engineering terminals, quantitative finance, clinical biostatistics, mathematical manuscripts, and high-density technical software. It syntheses the typographic rigor of **LaTeX (`booktabs`, `siunitx`, `amsthm`)**, the computable pod architecture of **Wolfram Alpha & Mathematica**, the analytical graphics of **Edward Tufte**, and the tactile hardware precision of **Linear & Dieter Rams**.

---

## ✨ Key Architectural Highlights

1. **Dual-Register Typographic Architecture**
   - **Register I — The Editorial Monograph:** Variable optical-size *Newsreader* (`opsz 6..72`) and *STIX Two Text* paired seamlessly with **KaTeX** mathematical typesetting, true OpenType small-caps (`smcp`), and lining numerals (`lnum`).
   - **Register II — The Precision Instrument:** *Inter* (`cv01..cv04`, `tabular-nums`) for all UI chrome, buttons, badges, and numerical table readouts; *JetBrains Mono* strictly reserved for executable code cells and symbolic queries.
2. **Zero-Black Tactile Hardware Keycap System**
   - Light-mode-native 3D keycap hierarchy (`primary` Archival Cobalt, `compute` Braun Signal Vermilion, `tonal` Cobalt Wash, `secondary` Warm Ceramic Alabaster, `instrument` Latched Cobalt Toggle, `ghost`, and `danger`) with specular top highlights and directional bottom bevels.
3. **Generalist UI Foundation + 6 Scientific Component Pillars (16 Story Groups)**
   - **Generalist UI Foundation (`L3.0`):** `Button`, `SegmentedControl`, `Badge`, `FormField`, `Input`, `Select`, `Switch`, `Card`, `MetricCard`, `Callout`, `KeyValueList`, `Tabs`, `Accordion`, and dataset-agnostic `DataTable<T>`.
   - **Domain Pillars (`L3.1–L3.6`):** `<Pod>`, `<AssumptionStrip>`, `<StepByStepDrawer>`, `<Manipulate>`, `<Scrubber>` (multi-gear Vernier caliper physics), `<InlineMath>`, `<EquationBlock>` (LaTeX + Typst export), `<FormalBlock>`, `<ProofBlock>`, `<AlgorithmBlock>` (interactive line-by-line stepping), `<Cite>`, `<CrossRef>`, `<ScientificPlot>`, `<CartesianCanvas>`, `<Sparkline>`, `<UnitValue>`, `<BooktabsTable>`, `<OmniComputeBar>`, `<CodeCell>`, and `<GroundedAIChat>`.
4. **Cross-Modal `SymbolRegistry` Bus (`L2`)**
   - Mathematical symbols ($\zeta$, $\omega_0$, $x(t)$, $\mathcal{H}$) are first-class reactive entities. Hovering or pinning a symbol in an equation highlights its occurrences in prose, binds to its identifier in code cells, illuminates its curve in SVG plots, and surfaces its formal definition and units.
5. **Five Multi-Domain Flagship Application Concepts (`L4`)**
   - **EvalBench (`#/prototypes/ai-evals`):** Frontier AI & LLM Evaluation Observatory (Pareto compute scaling canvas, Lean 4 verifier trace inspector, MMLU-Pro / GPQA / MATH-500 leaderboard).
   - **Meridian (`#/prototypes/quant-macro`):** Quantitative Macro, Nelson–Siegel Yield Curve & Multi-Asset Risk Terminal.
   - **Helix (`#/prototypes/biomed-trials`):** Phase III Oncology Clinical Trials & Kaplan–Meier Survival Biostatistics Studio.
   - **Principia Dynamical Lab (`#/prototypes/principia`):** Damped Harmonic Oscillator, 1D Quantum Potential Well & Lotka–Volterra Ecological Dynamics Workbench.
   - **The Codex (`#/prototypes/wolfram`):** 3-in-1 Switchable Wolfram Pod Engine, Tufte 65ch+28ch Monograph, and Julia/SymPy Notebook IDE.

---

## 🚀 Quickstart

```bash
# Install dependencies
bun install

# Start the Vite development server
bun run dev

# Or build the production bundle and start the Gzip/ETag HTTP web server (http://localhost:3000)
bun run serve
```

---

## 📦 Package Usage

```tsx
import '@principia/core/styles/foundation.css';
import {
  AcademicSystemProvider,
  Button,
  MetricCard,
  DataTable,
  Pod,
  EquationBlock,
  ScientificPlot,
} from '@principia/core';

export function App() {
  return (
    <AcademicSystemProvider>
      <Pod title="1. Damped Harmonic Response" domainTag="EXACT">
        <EquationBlock
          number="1.1"
          latex="\ddot{x} + 2\zeta\omega_0\dot{x} + \omega_0^2 x = \delta(t)"
        />
        <ScientificPlot zeta={0.25} omega0={4.0} />
      </Pod>
    </AcademicSystemProvider>
  );
}
```

---

## 🗂️ Repository Structure

```text
principia/
├── public/                             # Native macOS Book (📖) favicons & touch icons
├── src/
│   ├── tokens/                         # L1 StyleX token contracts & multi-axis themes
│   ├── styles/foundation.css           # Dual-register typography, keycap buttons & booktabs rules
│   ├── core/registry.tsx               # L2 SymbolRegistry & DocumentRegistry bus
│   ├── primitives/
│   │   ├── general/                    # L3.0 Generalist UI Foundation (Button, Card, DataTable, etc.)
│   │   ├── pod/                        # L3.1 <Pod>, <AssumptionStrip>, <StepByStepDrawer>
│   │   ├── compute/                    # L3.2 <Manipulate>, <Scrubber>, <OmniComputeBar>, <CodeCell>
│   │   ├── manuscript/                 # L3.3 <EquationBlock>, <FormalBlock>, <AlgorithmBlock>, <Cite>
│   │   └── datavis/                    # L3.4 <ScientificPlot>, <CartesianCanvas>, <BooktabsTable>
│   ├── prototypes/DomainPrototypes.tsx # EvalBench (AI), Meridian (Quant) & Helix (BioMed) apps
│   ├── app/PrincipiaApp.tsx            # Principia Dynamical Physics Studio
│   ├── codex/CodexApp.tsx              # Wolfram Engine / Tufte Monograph / Julia IDE
│   └── platform/                       # Unified router, Overview, Docs Portal & Storybook (16)
├── server.ts                           # Bun.serve production HTTP server (Gzip, ETag, Cache-Control)
└── package.json
```

---

## 📄 License

Released under the [MIT License](./LICENSE).
