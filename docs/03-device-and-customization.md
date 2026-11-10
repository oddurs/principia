# 03 — Device Compatibility, Touch Choreography & Customization Guide

Academic interfaces historically treat anything smaller than a 27-inch monitor as an afterthought: equations overflow the viewport, wide tables break horizontal scrolling, hover-only citations fail on iPads/phones, and tiny sliders cannot be manipulated accurately with a finger.

`@academic-ds/core` solves device compatibility at the **container and pointer level**.

---

## 1. Container-Query Driven Layout (`@container` Everywhere)

Instead of relying on global `@media (max-width: ...)` viewport queries, every [`<Pod>`](../src/primitives/pod/Pod.tsx) declares `container-type: inline-size; container-name: pod`, and every manuscript surface declares `container-name: manuscript` ([`src/styles/foundation.css`](../src/styles/foundation.css)).

Why this matters: A `<Pod>` rendered inside a `380px` docked right-hand inspector rail on a 4K desktop monitor automatically uses the exact same compact reflow rules as a `<Pod>` rendered on a `380px` mobile phone.

### Container Reflow Matrix

| Primitive | Wide Container (`> 580px`) | Narrow / Mobile Container (`<= 520px–580px`) |
| :--- | :--- | :--- |
| **`<ManuscriptGrid>`** | 3-column asymmetric Tufte grid (`65ch` prose + `2.5rem` gap + `28ch` right margin sidenotes). | Collapses (`< 960px`) to single column; margin sidenotes and pinned citations transform into inline expandable drawers. |
| **`<EquationBlock>`** | Inline 2-column grid (`[Math Expression] [Eq. (1.2)]`). | Equation number `(1.2)` moves to a top-right corner pill badge; math viewport gains horizontal touch momentum scrolling with `12px` left/right gradient fade masks (`mask-image`). |
| **`<BooktabsTable>`** | Full horizontal table with `\cmidrule` group spanners. | Enables horizontal touch scrolling while locking the first column (`th:first-child, td:first-child { position: sticky; left: 0 }`) with a subtle drop shadow so row identifiers never scroll out of view. |
| **`<SubfigureGrid>`** | Multi-column horizontal grid (`Panel a | Panel b`). | Reflows to a vertical `1fr` stack while keeping synchronized crosshairs and shared parameter scrubbers linked. |
| **`<Pod>` Header** | Single-row header with title on left, action rail (`Step-by-step`, `Typeset|LaTeX|Code`, `Copy`) on right. | Wraps action rail cleanly onto a secondary toolbar strip with touch-sized buttons. |

---

## 2. Pointer & Input Parity (`pointer: fine` vs. `pointer: coarse`)

### A. Multi-Gear Vernier Touch & Mouse Scrubbing
Standard HTML `<input type="range">` sliders are too coarse on mobile touchscreens to dial in scientific values like $\zeta = 0.0725$.

Our [`<Scrubber>`](../src/primitives/compute/Manipulate.tsx) implements **Vernier Gear Shifting** using Pointer Events (`setPointerCapture`):
1. **Gear 1 (`1×` Coarse):** Touch and drag horizontally left/right to sweep across the full parameter range.
2. **Gear 2 (`0.1×` Fine):** While holding your finger/mouse down, pull **downward by `30px`**, then drag horizontally for $10\times$ finer resolution.
3. **Gear 3 (`0.01×` Vernier):** Pull **downward by `70px`** while dragging for $100\times$ ultra-fine micro-stepping. A live HUD pill above your finger displays the active gear.

### B. Hover Lens vs. Touch Inspection Sheet
* **Desktop (`pointer: fine`):** Hovering `<Sym>`, `<Cite>`, or `<CrossRef>` triggers immediate cross-modal highlighting and floating preview lenses.
* **Touch (`pointer: coarse` or Simulated Touch Mode):**
  * Interactive hit targets expand (`min-height: 40px`).
  * Tapping any symbol, citation, or cross-reference opens the docked **Academic Inspection Bottom Sheet**, displaying the full theorem/equation preview, symbol definition, unit metadata, and `Pin` / `Copy LaTeX` controls without obscuring the reading canvas.

---

## 3. Customization Architecture (StyleX Theme Recipes)

Out of the box, `@academic-ds/core` enforces an opinionated **Archival Paper + Wolfram Vermilion + LaTeX Computer Modern** aesthetic. However, because every primitive consumes decoupled token contracts from [`src/tokens/tokens.stylex.ts`](../src/tokens/tokens.stylex.ts), you can customize the system for any product in a few lines of code:

### Example 1: Creating a Custom Brand & Surface Theme
```tsx
import * as stylex from '@stylexjs/stylex';
import { paper, accent, fonts } from '@academic-ds/core/tokens';

// Customizing for a Quantitative Finance or Bio-Informatics Workbench:
export const quantWorkbenchTheme = stylex.createTheme(accent, {
  compute: 'oklch(0.46 0.15 165)',        // Deep Emerald compute accent
  computeSurface: 'oklch(0.95 0.03 165)',
  computeBorder: 'oklch(0.82 0.07 165)',
  reference: 'oklch(0.45 0.14 255)',      // Prussian Blue citations
  referenceSurface: 'oklch(0.95 0.02 255)',
  referenceBorder: 'oklch(0.83 0.06 255)',
  verified: 'oklch(0.48 0.13 160)',
  verifiedSurface: 'oklch(0.95 0.03 160)',
  assumption: 'oklch(0.58 0.14 75)',
  assumptionSurface: 'oklch(0.96 0.03 80)',
  contradiction: 'oklch(0.51 0.19 22)',
  contradictionSurface: 'oklch(0.95 0.03 22)',
});
```

### Example 2: Mixing Densities & Chroming Within One Application
```tsx
{/* Center Column: Seamless LaTeX Monograph at Manuscript Density */}
<main className={stylex(densityManuscript)} data-chroming="seamless">
  <ManuscriptArticle />
</main>

{/* Right Rail: Framed Wolfram Pods at Compact Density */}
<aside className={stylex(densityCompact)} data-chroming="framed">
  <GroundedAICopilot />
  <SymbolGlossaryPod />
</aside>
```
