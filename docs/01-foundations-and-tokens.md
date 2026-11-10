# 01 — Foundations, Typography & Token Specifications

This document details the L1 foundational layer located in [`src/tokens/tokens.stylex.ts`](../src/tokens/tokens.stylex.ts) and [`src/styles/foundation.css`](../src/styles/foundation.css).

---

## 1. The Opinionated Quad-Font Optical Stack

Academic web apps must harmonize four distinct typographic roles that frequently appear **on the exact same line of text**:

> *"For damping parameter $\zeta \in [0, 2]$ passed as `config.zeta` (**DEFAULT** `0.25`), the energy decays exponentially."*

If these four fonts have mismatched x-heights or stroke weights, the line jitters visually.

### Font Role Matrix

| Role | Token | Primary Typeface | Optical Calibration & OpenType Features |
| :--- | :--- | :--- | :--- |
| **1. Manuscript Prose** | `fonts.prose` | **NewComputerModern Book** (`450` weight) / `STIX Two Text` fallback | Engineered specifically to fix the thin `0.4pt` hairlines of phototypeset `cmr10` on modern screens. Uses `liga`, `kern`, `onum` (in prose), and `smcp` (true small caps for theorem lead-ins). Base x-height ≈ `0.44em`. |
| **2. Mathematical Typesetting** | `fonts.math` | **KaTeX_Main** / **NewComputerModern Math** | 1:1 stroke modulation, serif geometry, and italic slant angle (`14°`) with `fonts.prose`. Wrapped in `.ads-math-inline` (`line-height: 0`, `font-size: 1.03em`) so inline integrals or fractions never expand paragraph leading. |
| **3. Workbench Chrome & Axes** | `fonts.chrome` | **Inter** (`400`, `500`, `600`) | Paired with Computer Modern following the Swiss scientific publishing tradition (Modern vertical-axis serif + tight neo-grotesque sans). Configured with `cv05`, `ss01`, `ss03`, and `tnum` (tabular numerals). Restricted to `11px–13px`. |
| **4. Code & Symbolic Mono** | `fonts.mono` | **JetBrains Mono** + **JuliaMono** fallback | `JetBrains Mono` provides razor-sharp code legibility (`zero` slashed zero, `ss01`); `JuliaMono` guarantees glyph coverage for every Unicode mathematical operator (`∀ ∃ ∈ ∇ ∂ ⊗ λ ℝ ℤ`). Scaled to `0.85em` in inline prose to match `NewCM Book`'s x-height. |

### Numeric Discipline Rules
* **Body Prose (`.ads-num-prose`):** `font-variant-numeric: oldstyle-nums proportional-nums` so numbers blend into lowercase serif ascenders/descenders.
* **Tables, Matrices, Plot Axes & Scrubbers (`.ads-num-data`):** `font-variant-numeric: tabular-nums lining-nums slashed-zero` so decimal points and columns align to the pixel.
* **True Minus & SI Unit Spacing:** Negative values always render Unicode minus (`U+2212` `−`, matching the width and vertical bar height of `+`), never a hyphen (`-`). Values and SI units are separated by `--tex-thinspace` (`0.16667em`, e.g., `9.81 m·s⁻²`).

---

## 2. Authentic LaTeX Spatial & Rule Grammar (`tex` Tokens)

Instead of arbitrary pixel values, structural spacing inside equations, theorems, and tables uses classical TeX `em` proportions:

```ts
export const tex = stylex.defineVars({
  thinspace: '0.16667em',  // \,  — Number-to-unit & differential spacing: f(x)\,dx
  medspace: '0.22222em',   // \:  — Binary relation spacing
  thickspace: '0.27778em', // \;  — Relational operator spacing
  quad: '1em',             // \quad
  qquad: '2em',            // \qquad
  parindent: '1.5em',      // Classical TeX paragraph indent
  ruleHeavy: '0.08em',     // \toprule and \bottomrule (booktabs.sty exact weight)
  ruleLight: '0.05em',     // \midrule and header dividers
  ruleCmid: '0.035em',     // \cmidrule sub-column spanner weight
});
```

---

## 3. Light-Mode Materiality: Archival Paper & Subtractive Ink (OKLCH)

By designing exclusively for Light Mode, we avoid the muddy mid-tone compromises of dual-theme systems and model physical paper tiers:

### Surface Hierarchy (`paper` Contract)

| Token | OKLCH Value | Hex Approx | Physical Role |
| :--- | :--- | :--- | :--- |
| `paper.desk` | `oklch(0.952 0.007 82)` | `#F1EFE9` | Recessed workbench background, sidebar wells, and outer Codex stage. |
| `paper.canvas` | `oklch(0.984 0.004 85)` | `#FAF8F5` | Warm archival cotton rag paper for long-form reading—eliminates harsh blue-white glare. |
| `paper.plate` | `oklch(1.000 0.000 0)` | `#FFFFFF` | Pure white elevated plate for framed `<Pod>`s, `<Figure>` canvases, and `<CodeCell>` editors. Pops cleanly against `paper.canvas` without heavy drop shadows. |
| `paper.well` | `oklch(0.966 0.006 83)` | `#F5F3EE` | Pod header bars, `<Manipulate>` control decks, inactive code gutters, and table summary rows. |
| `paper.lens` | `oklch(0.992 0.003 85 / 0.94)` | `rgba(...)` | Frosted archival glass for floating `<CrossRefLens>` popovers and touch inspection sheets. |

### Carbon & Graphite Ink Scale (`ink` Contract)

| Token | OKLCH Value | Hex Approx | Typographic Role |
| :--- | :--- | :--- | :--- |
| `ink.carbon` | `oklch(0.175 0.005 80)` | `#141413` | Primary prose, display math, `\toprule`/`\bottomrule` strokes, active axis lines. |
| `ink.graphite` | `oklch(0.410 0.008 80)` | `#4B4A46` | Margin sidenotes, figure captions, proof headers, table subheaders, pod titles. |
| `ink.pencil` | `oklch(0.585 0.008 80)` | `#7A7872` | Equation numbers `(2.1)`, code line numbers, minor axis ticks, QED tombstones (`∎`). |
| `ink.hairline` | `oklch(0.865 0.007 82)` | `#D8D5CE` | `1px` pod borders, `\midrule` table dividers, cell brackets, and grid hairlines. |

---

## 4. Semantic, Symbolic & DataVis Palettes

### A. Computational & Epistemic Accents (`accent` Contract)
* **`accent.compute` (`oklch(0.555 0.195 32)` — Wolfram Vermilion):** Query execution, active `<Manipulate>` scrubbers, `In[n]:=/Out[n]=` cell brackets, and step-by-step derivation badges.
* **`accent.reference` (`oklch(0.450 0.145 255)` — Prussian Lab Blue):** `<Cite>` links, `<CrossRef>` triggers, DOI badges, and assumption alternatives.
* **`accent.verified` (`oklch(0.480 0.130 160)` — Viridian Emerald):** CAS/SymPy/Lean symbolic verification pass badges.
* **`accent.assumption` (`oklch(0.580 0.145 75)` — Amber Ochre):** Epistemic assumption alerts and stale notebook cell indicators.

### B. The 8-Slot Cross-Modal Symbolic Palette (`symbols` Contract)
Used by `SymbolRegistry` to color-code mathematical variables across equations, prose, code, and plots. Every slot pairs a high-contrast foreground ink (`L ≈ 0.44`) with a translucent wash (`L ≈ 0.92`) applied via `mix-blend-mode: multiply`:

1. **Slot 1 — Cobalt (`oklch(0.42 0.16 255)`):** Frequencies, primary parameters ($\omega_0, \theta$).
2. **Slot 2 — Vermilion (`oklch(0.48 0.18 32)`):** Damping, learning rates, step sizes ($\zeta, \eta$).
3. **Slot 3 — Viridian (`oklch(0.43 0.14 160)`):** Hamiltonians, energy functionals, loss ($\mathcal{H}, \mathcal{L}$).
4. **Slot 4 — Tyrian Purple (`oklch(0.45 0.16 310)`):** Operators, Green's kernels, gradients ($G(t-\tau), \nabla$).
5. **Slot 5 — Ochre Gold (`oklch(0.48 0.14 75)`):** Variance, noise, temperature ($\sigma^2, T$).
6. **Slot 6 — Cerulean (`oklch(0.44 0.13 200)`):** Temporal/spatial coordinates ($t, x$).
7. **Slot 7 — Carmine (`oklch(0.46 0.17 350)`):** Eigenvalues, Lagrange multipliers ($\lambda, \mu$).
8. **Slot 8 — Olive Sage (`oklch(0.40 0.10 125)`):** Partition functions, constants ($Z, C$).
