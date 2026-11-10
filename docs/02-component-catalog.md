# 02 — Component Catalog & Domain Primitive Specifications

`@academic-ds/core` provides **28 heavy-duty primitives** organized across **6 domain pillars**. Every primitive respects the 3 orthogonal axes (`chroming`, `density`, `material/voice`) and participates in the L2 `SymbolRegistry` and `DocumentRegistry` buses.

---

## Pillar 1: Universal Pod & Parametric Compute Containers

| Component | File | Responsibilities & Key Props |
| :--- | :--- | :--- |
| **`<Pod>`** | [`src/primitives/pod/Pod.tsx`](../src/primitives/pod/Pod.tsx) | The Wolfram-inspired computable frame. Supports `domainTag` (`SYMBOLIC`, `EXACT`, `NUMERICAL`, `THEOREM`, `EMPIRICAL`, `AI-VERIFIED`), representation switching (`Typeset` \| `LaTeX` \| `Code`), `assumptions`, `steps`, and `chromingOverride` (`framed` \| `seamless` \| `bracketed`). |
| **`<AssumptionStrip>`** | Sub-component of `<Pod>` | Renders epistemic assumptions (*"Assuming $\zeta \in \mathbb{R}^+$ | Use $\zeta \in \mathbb{C}$ instead"*) with interactive one-click domain pivoting. |
| **`<StepByStepDrawer>`** | Sub-component of `<Pod>` | Progressive disclosure drawer showing numbered CAS/proof steps, mathematical justifications, and intermediate expressions. |
| **`<Manipulate>`** | [`src/primitives/compute/Manipulate.tsx`](../src/primitives/compute/Manipulate.tsx) | Wolfram `Manipulate[...]` parametric controller deck. Binds multiple parameters (with sliders, preset regime pills, and sweep animation) to any child visualization or equation. |
| **`<Scrubber>`** | [`src/primitives/compute/Manipulate.tsx`](../src/primitives/compute/Manipulate.tsx) | Bret Victor / Tangle inline draggable number token (`ζ = 0.25`) with **multi-gear Vernier dragging** (pull pointer downward for `0.1×` and `0.01×` precision) and keyboard arrow support. |
| **`<OmniComputeBar>`** | `src/primitives/compute/OmniComputeBar.tsx` | Universal query, natural language, symbolic math, and slash-command input bar with live inline KaTeX preview, domain pills, and a touch math symbol ribbon. |

---

## Pillar 2: Math & Formal LaTeX Environments

| Component | Responsibilities & Key Props |
| :--- | :--- |
| **`<InlineMath>`** | Strut-guarded (`line-height: 0`) inline KaTeX renderer. Supports interactive symbol binding via `symbolId` or `\sym{id}{expr}` macro without altering paragraph leading. |
| **`<EquationBlock>`** | Display math container with hierarchical right-aligned equation numbering `(1.2)`, responsive narrow-container badge reflow, horizontal scroll fade masks, and one-click copy (`LaTeX`, `Typst`, `MathML`). |
| **`<Sym>`** | Inline prose/math variable wrapper (`<Sym id="zeta">damping ratio ζ</Sym>`) that broadcasts hover/pin events across the `SymbolRegistry` bus. |
| **`<FormalBlock>`** | Classical LaTeX environments: `variant="theorem" \| "lemma" \| "proposition" \| "corollary" \| "definition" \| "remark"`. Theorem/Lemma variants use italic serif body with bold small-caps lead-in (`THEOREM 2.1 (Lyapunov Stability).`); Definition/Remark use upright roman body with a `2px` left rule. |
| **`<ProofBlock>`** | Collapsible or expanded mathematical proof block (`Proof.`) with an automatic right-aligned QED tombstone (`∎` / `\blacksquare`) that snaps cleanly to the final line. |
| **`<AlgorithmBlock>`** | Publication-grade `algorithm2e` / CLRS pseudocode block with line numbers, structural scope rules, `Require:` / `Ensure:` headers, and inline math support. |

---

## Pillar 3: Prose, Citations & Cross-References

| Component | Responsibilities & Key Props |
| :--- | :--- |
| **`<ManuscriptGrid>`** | Tufte asymmetric 3-column layout (`65ch` prose + `2.5rem` gutter + `28ch` margin column) with `@container manuscript` responsive collapse below `960px`. |
| **`<Cite>`** | Inline citation trigger (`[1]`, `[1, 3]`, or `(Arnold, 1989)`). Hovering opens `<CitationCard>`; clicking pins the citation into the right-hand margin column (or opens the mobile inspection sheet). |
| **`<CitationCard>`** | High-density bibliographic card showing Title, Authors, Venue, Year, DOI link, 1-sentence TL;DR, pin-to-margin toggle, and `Copy BibTeX` action. |
| **`<CrossRef>`** | Non-jumping internal reference (`Theorem 2.1`, `Eq. (1.2)`, `Figure 1.1`, `Table 1.1`). Resolves labels via `DocumentRegistry` and opens an in-place floating `<CrossRefLens>` on hover/tap so the reader never loses scroll position. |
| **`<Sidenote>`** | Margin note anchored to an inline superscript number; automatically packed vertically on desktop and converted to an inline expandable drawer on narrow containers. |

---

## Pillar 4: Science & Data Visualization

| Component | Responsibilities & Key Props |
| :--- | :--- |
| **`<Figure>` & `<SubfigureGrid>`** | Multi-panel publication figure container with bold geometric panel labels (`a`, `b`, `c`), structured lead-in caption, unit toggles, and export toolbar (`SVG`, `CSV`, `LaTeX`). |
| **`<ScientificPlot>`** | High-precision vector SVG plot engine with tabular-numeral axes, scientific notation ticks, `mix-blend-mode: multiply` confidence bands, synchronized crosshair scrubbers, and live `SymbolRegistry` curve highlighting. |
| **`<BooktabsTable>`** | Enforces strict `booktabs.sty` publication grammar: **zero vertical borders**, `--tex-rule-heavy` (`0.08em`) top/bottom rules, `--tex-rule-light` (`0.05em`) midrules, `\cmidrule` group spanners with horizontal trim, decimal-aligned numerical columns, and sticky first-column on mobile. |
| **`<UnitValue>`** | Semantic scientific quantity (`4.00 ± 0.05 rad·s⁻¹`) with proper `--tex-thinspace`, true Unicode minus, and interactive unit conversion popover (SI ↔ CGS ↔ Natural). |

---

## Pillar 5: Code Editors & Computational Notebooks

| Component | Responsibilities & Key Props |
| :--- | :--- |
| **`<CodeCell>`** | Interactive computational cell with language badge (`Julia`, `Python / SymPy`, `Wolfram`, `Lean 4`), execution counter `[In 4]`, runtime telemetry (`18 ms`), upstream dependency staleness indicator, and symbol-linked AST tokens. |
| **`<CellOutput>`** | Multi-modal output tray rendering symbolic LaTeX derivations, structured DataFrame previews (with column mini-histograms), or stdout streams. |
| **`<TensorBadge>`** | Compact inline shape badge (`[B, H, T, Dₖ]`) with hover broadcasting across named tensor dimensions. |

---

## Pillar 6: Grounded AI / Research Copilot

| Component | Responsibilities & Key Props |
| :--- | :--- |
| **`<GroundedAIChat>`** | Research copilot panel built for scientific provenance rather than consumer chat bubbles. |
| **`<GroundingChip>`** | Inline provenance pill (`[📄 Arnold 1989, §4.2]`, `[🧮 Eq. (1.2)]`, `[⚡ Cell In[4]]`) inside AI responses that highlights or previews the exact source on hover/click. |
| **`<VerificationBadge>`** | Epistemic status indicator distinguishing `CAS / SymPy Verified` and `Lean 4 Formalized` derivations from `Unverified LLM Heuristic`. |
| **`<ReasoningTimeline>`** | Compact collapsible trace of tool calls: literature retrieval, symbolic algebra simplification, dimensional analysis check, and numerical sanity test. |
| **`<ManuscriptPatch>`** | Side-by-side raw LaTeX diff and rendered visual diff card for accepting/rejecting AI-proposed equation or prose revisions. |
