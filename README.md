# 📖 Principia (`@principia/core`)

**Where the editorial monograph meets the precision instrument.**

**Principia** (`@principia/core`) is an open-source, light-mode universal design system and component library engineered for generalist SaaS applications, autonomous multi-agent workflows, AI evaluation observatories, quantitative finance, clinical biostatistics, mathematical manuscripts, and scientific computing. It synthesizes the typographic rigor of **LaTeX (`booktabs`, `siunitx`, `amsthm`)**, the computable pod architecture of **Wolfram Alpha & Mathematica**, the analytical graphics of **Edward Tufte**, and the tactile hardware precision of **Linear & Dieter Rams**.

---

## ✨ Key Architectural Highlights

1. **Dual-Register Typographic Architecture**
   - **Register I — The Editorial Monograph:** Variable optical-size *Newsreader* (`opsz 6..72`) and *STIX Two Text* paired seamlessly with **KaTeX** mathematical typesetting, true OpenType small-caps (`smcp`), and lining numerals (`lnum`).
   - **Register II — The Precision Instrument:** *Inter* (`cv01..cv04`, `tabular-nums`) for all UI chrome, buttons, badges, and numerical table readouts; *JetBrains Mono* strictly reserved for executable code cells, MCP tool payloads, and symbolic queries.
2. **Zero-Black Tactile Hardware Keycap System**
   - Light-mode-native 3D keycap hierarchy (`primary` Archival Cobalt, `compute` Braun Signal Vermilion, `tonal` Cobalt Wash, `secondary` Warm Ceramic Alabaster, `instrument` Latched Cobalt Toggle, `ghost`, and `danger`) with specular top highlights and directional bottom bevels.
3. **17 Component Groups Organized into 4 Pillars**
   - **Pillar I — Generalist UI Foundation (`01–04`):** `Button`, `SegmentedControl`, `Badge`, `FormField`, `Input`, `Select`, `Switch`, `Card`, `MetricCard`, `Callout`, `KeyValueList`, `Tabs`, `Accordion`, and dataset-agnostic `DataTable<T>`.
   - **Pillar II — Agentic Workflow & Compute (`14–17`):** `AgentPipelineGraph` (multi-agent DAG), `ToolCallCard` (MCP sandbox inspector), `AgentTraceTimeline` (reasoning & verifier waterfall), `HumanApprovalGate` (operator governance gate), `OmniComputeBar`, `CodeCell`, `TensorBadge`, and `GroundedAIChat`.
   - **Pillar III — Pods, Scrubbers & Formal Manuscript (`05–10`):** `Pod`, `Manipulate`, `Scrubber` (3-gear Vernier caliper), `InlineMath`, `Sym`, `EquationBlock` (LaTeX + Typst export), `FormalBlock`, `ProofBlock`, `AlgorithmBlock`, `Cite`, `CrossRef`, and `CitationCard`.
   - **Pillar IV — Scientific DataVis & Tabular (`11–13`):** `ScientificPlot`, `CartesianCanvas`, `PhaseSpaceCanvas`, `ComplexPlaneCanvas`, `Sparkline`, `UnitValue`, and `BooktabsTable`.
4. **Cross-Modal `SymbolRegistry` Bus (`L2`)**
   - Mathematical symbols ($\zeta$, $\omega_0$, $x(t)$, $\mathcal{H}$) are first-class reactive entities. Hovering or pinning a symbol highlights its occurrences across prose, equations, code cells, and SVG plots.
5. **Five Multi-Domain Reference Application Concepts (`L4`)**
   - **01 · Nexus (`#/prototypes/agent-workflow`):** Autonomous Multi-Agent DAG Orchestrator, MCP Tool Inspector & Human Approval Gate.
   - **02 · EvalBench (`#/prototypes/ai-evals`):** Frontier AI & LLM Evaluation Observatory (Pareto compute scaling canvas, Lean 4 verifier trace inspector, MMLU-Pro / GPQA / MATH-500 leaderboard).
   - **03 · Meridian (`#/prototypes/quant-macro`):** Quantitative Macro, Nelson–Siegel Yield Curve & Multi-Asset Risk Terminal.
   - **04 · Helix (`#/prototypes/biomed-trials`):** Phase III Oncology Clinical Trials & Kaplan–Meier Survival Biostatistics Studio.
   - **05 · Principia Lab (`#/prototypes/principia`):** Coupled Dynamical Systems, Symplectic Phase Space, Formal Proofs & Symbolic CAS Workbench.

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

## 🗂️ Simplified Repository Structure

```text
principia/
├── public/                             # Native macOS Book (📖) favicons & touch icons
├── src/
│   ├── tokens/                         # L1 StyleX token contracts & multi-axis themes
│   ├── styles/foundation.css           # Dual-register typography, keycap buttons & booktabs rules
│   ├── core/registry.tsx               # L2 SymbolRegistry & DocumentRegistry bus
│   ├── primitives/                     # L3 Component Library (17 Storybook Groups)
│   │   ├── general/                    # Buttons, Badges, Forms, Cards, Tabs, DataTable
│   │   ├── agentic/                    # AgentPipelineGraph, ToolCallCard, Trace, ApprovalGate
│   │   ├── pod/                        # Universal Computational Pod (Framed/Seamless/Bracketed)
│   │   ├── compute/                    # Manipulate, Scrubber, OmniComputeBar, CodeCell, Copilot
│   │   ├── manuscript/                 # EquationBlock, FormalBlock, ProofBlock, Algorithm, Cite
│   │   └── datavis/                    # ScientificPlot, CartesianCanvas, Sparkline, BooktabsTable
│   ├── prototypes/DomainPrototypes.tsx # L4 All 5 Reference App Concepts (Nexus, EvalBench, Meridian, Helix, Principia)
│   ├── platform/                       # Navigation Router, Overview, Storybook (17) & Docs (7)
│   ├── index.ts                        # Public @principia/core barrel export
│   └── main.tsx                        # Web application entrypoint
├── server.ts                           # Bun.serve production HTTP server (Gzip, ETag, Cache-Control)
└── package.json
```

---

## 📄 License

Released under the [MIT License](./LICENSE).
