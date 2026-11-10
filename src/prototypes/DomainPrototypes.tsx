import React, { useState, useMemo } from 'react';
import { Pod } from '../primitives/pod/Pod';
import {
  AgentPipelineGraph,
  ToolCallCard,
  AgentTraceTimeline,
  HumanApprovalGate,
  AgentPipelineNode,
} from '../primitives/agentic/AgenticWorkflow';
import { Scrubber } from '../primitives/compute/Manipulate';
import {
  Sym,
  InlineMath,
  EquationBlock,
  FormalBlock,
  ProofBlock,
} from '../primitives/manuscript/MathAndFormal';
import { Cite, CrossRef } from '../primitives/manuscript/CitationsAndRefs';
import {
  CartesianCanvas,
  ScientificPlot,
  BooktabsTable,
} from '../primitives/datavis/ScienceAndVis';
import {
  OmniComputeBar,
  CodeCell,
  GroundedAIChat,
} from '../primitives/compute/CodeAndCopilot';
import {
  Button,
  SegmentedControl,
  Badge,
  Card,
  MetricCard,
  Callout,
  KeyValueList,
  Tabs,
  Accordion,
  DataTable,
} from '../primitives/general/GeneralFoundation';

/**
 * ============================================================================
 * MULTI-DOMAIN APPLICATION PROTOTYPES (@principia/core)
 * ============================================================================
 * Demonstrates the generalist + technical versatility of the design system
 * across three distinct industry application concepts:
 *   1. EvalBench — Frontier AI & Model Evaluation Observatory (AI Engineering SaaS)
 *   2. Meridian  — Quantitative Macro, Yield Curve & Risk Terminal (FinTech / Quant)
 *   3. Helix     — Phase III Clinical Trials & Survival Biostatistics (BioMed / NEJM)
 */

/* ========================================================================== */
/* PROTOTYPE 1: EVALBENCH — FRONTIER AI & MODEL EVALUATION OBSERVATORY        */
/* ========================================================================== */

interface EvalModelRow {
  id: string;
  name: string;
  provider: string;
  arch: string;
  mmlu: number;
  gpqa: number;
  math500: number;
  humaneval: number;
  ttftMs: number;
  costPer1M: number;
  status: 'Production' | 'Staging' | 'Edge PoP';
  tone: 'success' | 'compute' | 'reference';
  sampleTrace: string;
  verifierExpr: string;
}

const EVAL_MODELS: EvalModelRow[] = [
  {
    id: 'principia-r3',
    name: 'Principia-Reasoner-v3',
    provider: 'Principia Labs',
    arch: '37B / 405B MoE',
    mmlu: 90.4,
    gpqa: 76.8,
    math500: 94.2,
    humaneval: 92.6,
    ttftMs: 142,
    costPer1M: 3.0,
    status: 'Production',
    tone: 'success',
    sampleTrace: `// Step 1: Decompose non-autonomous Hamiltonian H(q,p,t)\nconst dH_dt = simplify("p*(d_p) + omega_0^2*q*(d_q) + 2*zeta*omega_0*p^2");\n// Step 2: Invoke SymPy verifier on asymptotic Lyapunov bound\nassert(sympy.is_nonpositive(dH_dt, { zeta: ">0", omega_0: ">0" }) === true);`,
    verifierExpr: 'simplify(LHS - RHS) == 0 · Verified in 18.4 ms',
  },
  {
    id: 'claude-4-sonnet',
    name: 'Claude-4-Sonnet-Thinking',
    provider: 'Anthropic',
    arch: 'Dense Frontier',
    mmlu: 89.1,
    gpqa: 74.2,
    math500: 91.8,
    humaneval: 93.4,
    ttftMs: 168,
    costPer1M: 3.0,
    status: 'Production',
    tone: 'success',
    sampleTrace: `def verify_spectral_gap(A_matrix, tol=1e-12):\n    eigenvalues = np.linalg.eigvalsh(A_matrix)\n    gap = float(eigenvalues[1] - eigenvalues[0])\n    return {"spectral_gap": round(gap, 6), "certified": gap > tol}`,
    verifierExpr: 'Spectral gap λ₂ − λ₁ = 2.414214 > 0 ✓',
  },
  {
    id: 'symcoder-70b',
    name: 'SymCoder-70B-Instruct',
    provider: 'OpenWeights',
    arch: '70B Dense FP8',
    mmlu: 86.2,
    gpqa: 68.9,
    math500: 89.5,
    humaneval: 90.1,
    ttftMs: 112,
    costPer1M: 0.9,
    status: 'Production',
    tone: 'reference',
    sampleTrace: `SELECT model_id, AVG(pass_at_1) AS accuracy, PERCENTILE_CONT(0.95) WITHIN GROUP (ORDER BY latency_ms) AS p95_ms\nFROM eval_traces WHERE suite = 'GPQA-Diamond' GROUP BY model_id;`,
    verifierExpr: 'SQL AST & Schema Typecheck: 0 warnings ✓',
  },
  {
    id: 'euler-zero',
    name: 'Euler-Zero-Preview',
    provider: 'Principia Labs',
    arch: '120B Formal MoE',
    mmlu: 91.8,
    gpqa: 80.4,
    math500: 96.7,
    humaneval: 94.0,
    ttftMs: 285,
    costPer1M: 6.5,
    status: 'Staging',
    tone: 'compute',
    sampleTrace: `theorem lyapunov_stability (ζ ω₀ : ℝ) (hζ : 0 < ζ) (hω : 0 < ω₀) :\n  ∀ t ≥ 0, deriv Energy t ≤ 0 := by\n  intro t ht; linarith [mul_pos hζ hω, sq_nonneg (deriv q t)]`,
    verifierExpr: 'Lean 4 Kernel Typecheck: Goals accomplished ∎',
  },
  {
    id: 'verlet-edge-8b',
    name: 'Verlet-Edge-8B',
    provider: 'Principia Labs',
    arch: '8.2B Distilled INT4',
    mmlu: 78.4,
    gpqa: 56.2,
    math500: 81.0,
    humaneval: 84.5,
    ttftMs: 34,
    costPer1M: 0.15,
    status: 'Edge PoP',
    tone: 'reference',
    sampleTrace: `export const edgeClassifier = (tokens: Float32Array) => {\n  const logits = matmulFp8(W_proj, tokens);\n  return argmax(logits);\n};`,
    verifierExpr: 'P99 Edge PoP Latency: 34.0 ms (0 allocs)',
  },
];

export const EvalBenchPrototype: React.FC = () => {
  const [viewMode, setViewMode] = useState<'overview' | 'leaderboard' | 'inspector'>('overview');
  const [temperature, setTemperature] = useState<number>(0.2);
  const [thinkingBudget, setThinkingBudget] = useState<number>(16); // k tokens
  const [selectedModelId, setSelectedModelId] = useState<string>('principia-r3');

  const selectedModel =
    EVAL_MODELS.find((m) => m.id === selectedModelId) ?? EVAL_MODELS[0];

  // Compute dynamic accuracy scaling based on reasoning token budget B_think and temperature
  const paretoSeries = useMemo(() => {
    const tempPenalty = Math.abs(temperature - 0.15) * 2.4;
    const budgetBoost = Math.log2(Math.max(1, thinkingBudget)) * 1.15;

    const frontierCurve = Array.from({ length: 45 }, (_, i) => {
      const x = 0.5 + (i / 44) * 31.5; // Reasoning compute budget (k tokens)
      const acc =
        72 +
        19.5 * (1 - Math.exp(-0.18 * x)) +
        budgetBoost * 0.35 -
        tempPenalty;
      return { x, y: Math.min(98.5, Math.max(55, acc)) };
    });

    const baselineCurve = Array.from({ length: 45 }, (_, i) => {
      const x = 0.5 + (i / 44) * 31.5;
      const acc = 66 + 15.0 * (1 - Math.exp(-0.14 * x)) - tempPenalty * 1.2;
      return { x, y: Math.min(92.0, Math.max(50, acc)) };
    });

    return [
      {
        id: 'frontier',
        label: 'Principia-Reasoner-v3 (With Symbolic Verifier)',
        color: 'oklch(0.45 0.15 255)',
        points: frontierCurve,
        fillArea: true,
      },
      {
        id: 'baseline',
        label: 'Unverified Standard CoT Baseline',
        color: 'oklch(0.55 0.18 32)',
        points: baselineCurve,
        dashed: true,
      },
    ];
  }, [temperature, thinkingBudget]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 44px)' }}>
      {/* 36px App Concept Sub-Bar */}
      <div
        className="ads-ui"
        style={{
          minHeight: '38px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '6px 24px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Badge tone="compute" dot>
            APP CONCEPT 01 · AI ENGINEERING
          </Badge>
          <strong style={{ fontSize: '13px', color: 'var(--ads-ink-carbon)' }}>
            EvalBench · Frontier Model &amp; Verifier Observatory
          </strong>
          <span style={{ color: 'var(--ads-ink-pencil)', fontSize: '11.5px' }}>
            Run #2026-11-v4 · 5 Models · 14,200 Prompts
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
              Temp τ:
            </span>
            <Scrubber
              value={temperature}
              min={0.0}
              max={1.2}
              step={0.05}
              onChange={setTemperature}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
              Reasoning Budget:
            </span>
            <Scrubber
              value={thinkingBudget}
              min={2}
              max={32}
              step={2}
              unit="k tok"
              onChange={setThinkingBudget}
            />
          </div>

          <SegmentedControl
            value={viewMode}
            onChange={setViewMode}
            options={[
              { id: 'overview', label: 'Full Observatory' },
              { id: 'leaderboard', label: 'Benchmark Grid', count: 5 },
              { id: 'inspector', label: 'Trace Inspector' },
            ]}
          />
        </div>
      </div>

      {/* Main Workspace Container */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '28px 32px 64px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* 4-Column KPI Telemetry Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '18px',
          }}
        >
          <MetricCard
            label="MMLU-Pro Pass@1 (Selected)"
            value={`${(
              selectedModel.mmlu +
              Math.log2(thinkingBudget / 8) * 0.6 -
              Math.abs(temperature - 0.15) * 1.4
            ).toFixed(1)}%`}
            delta="+3.2%"
            deltaTrend="up"
            sparklineData={[82.1, 84.0, 85.6, 87.2, 88.5, 89.4, selectedModel.mmlu]}
            sparklineColor="oklch(0.45 0.15 255)"
            footnote={`Active: ${selectedModel.name} (${selectedModel.arch})`}
          />
          <MetricCard
            label="MATH-500 Formal Pass Rate"
            value={`${selectedModel.math500.toFixed(1)}%`}
            delta="+5.8%"
            deltaTrend="up"
            sparklineData={[79.0, 83.4, 86.1, 89.0, 91.5, selectedModel.math500]}
            sparklineColor="oklch(0.46 0.14 160)"
            footnote="Verified via SymPy & Lean 4 equivalence check"
          />
          <MetricCard
            label="P95 Time-To-First-Token"
            value={`${selectedModel.ttftMs}`}
            unit="ms"
            delta="-18 ms"
            deltaTrend="up"
            sparklineData={[210, 195, 180, 165, 152, selectedModel.ttftMs]}
            sparklineColor="oklch(0.48 0.18 32)"
            footnote="Measured at 64 concurrent streaming clients"
          />
          <MetricCard
            label="Inference Cost Efficiency"
            value={`$${selectedModel.costPer1M.toFixed(2)}`}
            unit="/ 1M tok"
            delta="-22%"
            deltaTrend="up"
            sparklineData={[5.2, 4.8, 4.1, 3.6, 3.2, selectedModel.costPer1M]}
            sparklineColor="oklch(0.48 0.16 310)"
            footnote="Includes speculative decoding & KV-cache hits"
          />
        </div>

        {/* 2-Column Analytical Stage (Pareto Frontier + Live Trace Inspector) */}
        {viewMode !== 'leaderboard' && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                viewMode === 'inspector'
                  ? '1fr'
                  : 'repeat(auto-fit, minmax(460px, 1fr))',
              gap: '18px',
              alignItems: 'start',
            }}
          >
            {viewMode === 'overview' && (
              <Pod
                title="1. Test-Time Compute Scaling & Accuracy Pareto Frontier"
                subtitle="Scrub Reasoning Budget (k tokens) or Temperature τ in the top bar to project scaling laws"
                domainTag="EMPIRICAL"
                cellLabel="Eval[1]="
              >
                <CartesianCanvas
                  xAxisLabel="Test-Time Reasoning Budget B_think (×10³ tokens)"
                  yAxisLabel="Pass@1 Accuracy (%)"
                  xDomain={[0, 32]}
                  yDomain={[55, 100]}
                  xTicks={[0, 8, 16, 24, 32]}
                  yTicks={[60, 70, 80, 90, 100]}
                  series={paretoSeries}
                  scrubX={thinkingBudget}
                  thresholds={[
                    {
                      axis: 'x',
                      value: thinkingBudget,
                      label: `Budget (${thinkingBudget}k tok)`,
                      color: 'oklch(0.45 0.15 255)',
                    },
                  ]}
                />
              </Pod>
            )}

            <Card
              title={`2. Verifier Trace & Completion Inspector — ${selectedModel.name}`}
              subtitle={`${selectedModel.provider} · ${selectedModel.arch} · Click any row in table below to switch`}
              headerRight={
                <Badge tone={selectedModel.tone} dot>
                  {selectedModel.status}
                </Badge>
              }
            >
              <Tabs
                tabs={[
                  {
                    id: 'trace',
                    label: 'Verifier Code & CoT Trace',
                    badge: 'CAS',
                    content: (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Callout tone="success" title={selectedModel.verifierExpr}>
                          Symbolic post-condition verified with zero hallucinations or unit
                          mismatches across 5 majority-vote rollouts.
                        </Callout>
                        <CodeCell
                          language={`${selectedModel.name} · Formal Verification Trace`}
                          tensorShape={`${thinkingBudget}k tok`}
                          tensorDtype={`τ = ${temperature.toFixed(2)}`}
                          customCode={selectedModel.sampleTrace}
                          customOutput={
                            <span
                              style={{
                                fontFamily: 'var(--ads-font-mono)',
                                fontSize: '12px',
                                color: 'oklch(0.42 0.14 160)',
                              }}
                            >
                              {selectedModel.verifierExpr}
                            </span>
                          }
                        />
                      </div>
                    ),
                  },
                  {
                    id: 'telemetry',
                    label: 'Serving & KV-Cache Telemetry',
                    content: (
                      <KeyValueList
                        columns={2}
                        items={[
                          { label: 'Model Identifier', value: selectedModel.id, mono: true },
                          { label: 'Architecture', value: selectedModel.arch },
                          { label: 'MMLU-Pro (0-shot)', value: `${selectedModel.mmlu.toFixed(1)}%` },
                          { label: 'GPQA Diamond', value: `${selectedModel.gpqa.toFixed(1)}%` },
                          { label: 'MATH-500 Level 5', value: `${selectedModel.math500.toFixed(1)}%` },
                          { label: 'HumanEval Coding', value: `${selectedModel.humaneval.toFixed(1)}%` },
                          { label: 'P95 TTFT Latency', value: `${selectedModel.ttftMs} ms`, mono: true },
                          { label: 'Price / 1M Tokens', value: `$${selectedModel.costPer1M.toFixed(2)}`, mono: true },
                        ]}
                      />
                    ),
                  },
                ]}
              />
            </Card>
          </div>
        )}

        {/* Full Booktabs Evaluation Leaderboard DataTable */}
        {viewMode !== 'inspector' && (
          <Card
            title="3. Frontier Model Evaluation Leaderboard (Interactive Booktabs DataTable)"
            subtitle="Click any model row to load its verification trace above, or sort by any benchmark column"
            headerRight={
              <Button
                variant="secondary"
                size="xs"
                onClick={() => {
                  setTemperature(0.2);
                  setThinkingBudget(16);
                }}
              >
                Reset Run Filters
              </Button>
            }
          >
            <DataTable
              caption="Zero-shot evaluation across MMLU-Pro, GPQA Diamond, MATH-500, and HumanEval with P95 streaming telemetry."
              rowKey={(r) => r.id}
              activeRowKey={selectedModelId}
              onRowClick={(r) => setSelectedModelId(r.id)}
              searchPlaceholder="Filter models…"
              columns={[
                {
                  key: 'name',
                  header: 'Model & Provider',
                  group: 'Model Identity',
                  sortable: true,
                  render: (r) => (
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                        {r.name}
                      </div>
                      <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                        {r.provider} · {r.arch}
                      </div>
                    </div>
                  ),
                },
                {
                  key: 'mmlu',
                  header: 'MMLU-Pro (%)',
                  group: 'Reasoning & STEM Benchmarks',
                  align: 'right',
                  numericValue: (r) => r.mmlu,
                  barMax: 100,
                  barColor: 'oklch(0.45 0.145 255 / 0.12)',
                  render: (r) => <strong>{r.mmlu.toFixed(1)}%</strong>,
                },
                {
                  key: 'gpqa',
                  header: 'GPQA Diamond (%)',
                  group: 'Reasoning & STEM Benchmarks',
                  align: 'right',
                  numericValue: (r) => r.gpqa,
                  barMax: 100,
                  barColor: 'oklch(0.46 0.14 160 / 0.12)',
                  render: (r) => `${r.gpqa.toFixed(1)}%`,
                },
                {
                  key: 'math500',
                  header: 'MATH-500 (%)',
                  group: 'Reasoning & STEM Benchmarks',
                  align: 'right',
                  numericValue: (r) => r.math500,
                  barMax: 100,
                  barColor: 'oklch(0.48 0.16 310 / 0.12)',
                  render: (r) => `${r.math500.toFixed(1)}%`,
                },
                {
                  key: 'ttftMs',
                  header: 'P95 TTFT',
                  group: 'Serving Economics',
                  align: 'right',
                  numericValue: (r) => r.ttftMs,
                  render: (r) => `${r.ttftMs} ms`,
                },
                {
                  key: 'costPer1M',
                  header: 'Cost / 1M',
                  group: 'Serving Economics',
                  align: 'right',
                  numericValue: (r) => r.costPer1M,
                  render: (r) => `$${r.costPer1M.toFixed(2)}`,
                },
                {
                  key: 'status',
                  header: 'Deployment',
                  group: 'Serving Economics',
                  align: 'right',
                  render: (r) => (
                    <Badge tone={r.tone} dot>
                      {r.status}
                    </Badge>
                  ),
                },
              ]}
              data={EVAL_MODELS}
              summaryRow={{
                name: 'Suite Mean / Frontier Best',
                mmlu: '87.2% (Best: 91.8%)',
                gpqa: '71.3% (Best: 80.4%)',
                math500: '90.6% (Best: 96.7%)',
                ttftMs: '148 ms',
                costPer1M: '$2.71 / 1M',
                status: '100% Reproducible',
              }}
              footnotes={[
                {
                  mark: 'a',
                  text: 'Evaluated under deterministic seed lock with formal SymPy / Lean 4 equivalence post-verification.',
                },
              ]}
            />
          </Card>
        )}
      </div>
    </div>
  );
};

/* ========================================================================== */
/* PROTOTYPE 2: MERIDIAN — QUANTITATIVE MACRO & RISK TERMINAL                 */
/* ========================================================================== */

interface QuantPositionRow {
  id: string;
  instrument: string;
  assetClass: string;
  notionalM: number;
  weightPct: number;
  sharpe: number;
  var99M: number;
  dv01K: number;
  regimeStatus: 'Hedged' | 'ConvexLong' | 'DurationShort';
}

const QUANT_POSITIONS: QuantPositionRow[] = [
  {
    id: 'ust-10y',
    instrument: 'US Treasury 10Y Benchmark Note (4.25% Nov 2036)',
    assetClass: 'Sovereign Rates',
    notionalM: 145.0,
    weightPct: 33.8,
    sharpe: 1.42,
    var99M: 2.18,
    dv01K: -118.4,
    regimeStatus: 'DurationShort',
  },
  {
    id: 'tips-5y',
    instrument: 'US TIPS 5Y Inflation Breakeven Swap',
    assetClass: 'Inflation Linked',
    notionalM: 92.5,
    weightPct: 21.6,
    sharpe: 1.88,
    var99M: 1.12,
    dv01K: +44.2,
    regimeStatus: 'Hedged',
  },
  {
    id: 'spx-dispersion',
    instrument: 'S&P 500 Variance Dispersion Basket (Top-50 Constituents)',
    assetClass: 'Equity Volatility',
    notionalM: 84.0,
    weightPct: 19.6,
    sharpe: 2.34,
    var99M: 1.95,
    dv01K: +12.0,
    regimeStatus: 'ConvexLong',
  },
  {
    id: 'ig-cdx',
    instrument: 'CDX.NA.IG Series 43 5Y Credit Default Protection',
    assetClass: 'Credit Derivatives',
    notionalM: 64.0,
    weightPct: 14.9,
    sharpe: 1.65,
    var99M: 0.94,
    dv01K: -19.5,
    regimeStatus: 'Hedged',
  },
  {
    id: 'jpy-fx-basis',
    instrument: 'USD/JPY 3Y Cross-Currency Basis Arbitrage',
    assetClass: 'FX & Macro Basis',
    notionalM: 43.1,
    weightPct: 10.1,
    sharpe: 2.11,
    var99M: 0.68,
    dv01K: +8.4,
    regimeStatus: 'ConvexLong',
  },
];

export const MeridianQuantPrototype: React.FC = () => {
  const [regime, setRegime] = useState<'baseline' | 'steepener' | 'stagflation'>('baseline');
  const [rateShockBps, setRateShockBps] = useState<number>(25); // -150 to +200 bps
  const [vixLevel, setVixLevel] = useState<number>(18.5); // 11 to 45

  const handleRegimePreset = (next: 'baseline' | 'steepener' | 'stagflation') => {
    setRegime(next);
    if (next === 'baseline') {
      setRateShockBps(25);
      setVixLevel(18.5);
    } else if (next === 'steepener') {
      setRateShockBps(-75);
      setVixLevel(26.0);
    } else {
      setRateShockBps(135);
      setVixLevel(34.0);
    }
  };

  // Nelson-Siegel parametric yield curve y(tau)
  const yieldCurveSeries = useMemo(() => {
    const beta0 = 4.45 + rateShockBps / 100; // Long-run level
    const beta1 = -0.55 + (rateShockBps / 100) * 0.35; // Short-long slope
    const beta2 = 0.65 + (vixLevel - 18.5) * 0.04; // Medium-term curvature
    const lambda = 0.62;

    const shockedPoints = Array.from({ length: 50 }, (_, i) => {
      const tau = 0.25 + (i / 49) * 29.75; // 3m to 30Y maturity
      const x = lambda * tau;
      const factor1 = (1 - Math.exp(-x)) / x;
      const factor2 = factor1 - Math.exp(-x);
      const y = beta0 + beta1 * factor1 + beta2 * factor2;
      return { x: tau, y };
    });

    const basePoints = Array.from({ length: 50 }, (_, i) => {
      const tau = 0.25 + (i / 49) * 29.75;
      const x = lambda * tau;
      const factor1 = (1 - Math.exp(-x)) / x;
      const factor2 = factor1 - Math.exp(-x);
      const y = 4.45 - 0.55 * factor1 + 0.65 * factor2;
      return { x: tau, y };
    });

    return [
      {
        id: 'shocked-curve',
        label: `Shocked Nelson–Siegel Curve (Δr = ${rateShockBps >= 0 ? '+' : ''}${rateShockBps} bps)`,
        color: 'oklch(0.45 0.15 255)',
        points: shockedPoints,
        fillArea: true,
      },
      {
        id: 'base-curve',
        label: 'FOMC Baseline Par Yield Curve',
        color: 'oklch(0.55 0.18 32)',
        points: basePoints,
        dashed: true,
      },
    ];
  }, [rateShockBps, vixLevel]);

  const portfolioVar99 = (6.87 * (vixLevel / 18.5) * (1 + Math.abs(rateShockBps) / 400)).toFixed(2);
  const portfolioSharpe = Math.max(
    0.65,
    1.92 - (vixLevel - 18.5) * 0.025 - Math.abs(rateShockBps) * 0.0015
  ).toFixed(2);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 44px)' }}>
      {/* 36px App Concept Sub-Bar */}
      <div
        className="ads-ui"
        style={{
          minHeight: '38px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '6px 24px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Badge tone="reference" dot>
            APP CONCEPT 02 · QUANTITATIVE FINANCE
          </Badge>
          <strong style={{ fontSize: '13px', color: 'var(--ads-ink-carbon)' }}>
            Meridian · Macro Yield Curve &amp; Multi-Asset Risk Terminal
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
              Rate Shock Δr₀:
            </span>
            <Scrubber
              value={rateShockBps}
              min={-150}
              max={200}
              step={5}
              unit="bps"
              onChange={setRateShockBps}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
              Implied Vol σ_VIX:
            </span>
            <Scrubber
              value={vixLevel}
              min={11}
              max={45}
              step={0.5}
              unit="%"
              onChange={setVixLevel}
            />
          </div>

          <SegmentedControl
            value={regime}
            onChange={handleRegimePreset}
            options={[
              { id: 'baseline', label: 'Baseline (+25 bps)' },
              { id: 'steepener', label: 'Bull Steepener (−75 bps)' },
              { id: 'stagflation', label: 'Stagflation (+135 bps)' },
            ]}
          />
        </div>
      </div>

      {/* Main Workspace Container */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '28px 32px 64px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* 4-Column Quant Telemetry Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '18px',
          }}
        >
          <MetricCard
            label="Net Asset Value (NAV)"
            value="$428.6"
            unit="M"
            delta="+1.84% MTD"
            deltaTrend="up"
            sparklineData={[412, 415, 419, 418, 422, 425, 428.6]}
            sparklineColor="oklch(0.46 0.14 160)"
            footnote="5 Global Macro & Relative-Value books"
          />
          <MetricCard
            label="Stress-Adjusted Sharpe Ratio"
            value={portfolioSharpe}
            unit="ann."
            delta={Number(portfolioSharpe) >= 1.7 ? 'Optimal' : 'Elevated Vol'}
            deltaTrend={Number(portfolioSharpe) >= 1.7 ? 'up' : 'down'}
            sparklineData={[1.65, 1.72, 1.81, 1.89, 1.94, Number(portfolioSharpe)]}
            sparklineColor="oklch(0.45 0.15 255)"
            footnote={`Evaluated at σ_VIX = ${vixLevel.toFixed(1)}%`}
          />
          <MetricCard
            label="99% 1-Day Parametric VaR"
            value={`$${portfolioVar99}`}
            unit="M"
            delta={`${((Number(portfolioVar99) / 428.6) * 100).toFixed(2)}% NAV`}
            deltaTrend={Number(portfolioVar99) < 8.5 ? 'up' : 'down'}
            sparklineData={[5.8, 6.1, 6.4, 6.7, 6.9, Number(portfolioVar99)]}
            sparklineColor="oklch(0.48 0.18 32)"
            footnote="Cornish–Fisher tail-kurtosis adjusted"
          />
          <MetricCard
            label="Net Portfolio DV01"
            value="-$73.3"
            unit="k / bp"
            delta="Duration Hedged"
            deltaTrend="up"
            sparklineData={[-95, -88, -82, -79, -75, -73.3]}
            sparklineColor="oklch(0.48 0.16 310)"
            footnote="Net dollar value of a 1 bps parallel shift"
          />
        </div>

        {/* 2-Column Yield Curve Canvas + Stochastic Term-Structure Model */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '18px',
            alignItems: 'start',
          }}
        >
          <Pod
            title="1. Nelson–Siegel–Svensson Parametric Yield Curve"
            subtitle="Scrub Rate Shock Δr₀ (bps) or Implied Volatility σ_VIX in the top bar"
            domainTag="NUMERICAL"
            cellLabel="Curve[1]="
          >
            <CartesianCanvas
              xAxisLabel="Maturity Horizon τ (Years)"
              yAxisLabel="Annualized Par Yield y(τ) (%)"
              xDomain={[0, 30]}
              yDomain={[2.0, 7.0]}
              xTicks={[0, 5, 10, 15, 20, 25, 30]}
              yTicks={[2, 3, 4, 5, 6, 7]}
              series={yieldCurveSeries}
              thresholds={[
                {
                  axis: 'x',
                  value: 10,
                  label: `10Y Benchmark (${(4.33 + rateShockBps / 100).toFixed(2)}%)`,
                  color: 'oklch(0.45 0.15 255)',
                },
              ]}
            />
          </Pod>

          <Pod
            title="2. Arbitrage-Free Term Structure & Kelly Risk Allocation"
            subtitle="Continuous-Time Cox–Ingersoll–Ross / Nelson–Siegel Specification"
            domainTag="EXACT"
            cellLabel="SDE[2]="
            latexSource="y(\tau) = \beta_0 + \beta_1\left(\frac{1 - e^{-\lambda\tau}}{\lambda\tau}\right) + \beta_2\left(\frac{1 - e^{-\lambda\tau}}{\lambda\tau} - e^{-\lambda\tau}\right)"
          >
            <EquationBlock
              number="2.1"
              latex={`y(\\tau) = \\beta_0 + \\beta_1\\!\\left(\\frac{1 - e^{-\\lambda\\tau}}{\\lambda\\tau}\\right) + \\beta_2\\!\\left(\\frac{1 - e^{-\\lambda\\tau}}{\\lambda\\tau} - e^{-\\lambda\\tau}\\right)`}
              caption="Nelson–Siegel parametric yield curve decomposition into level β₀, slope β₁, and curvature β₂."
            />
            <FormalBlock variant="theorem" number="2.1" title="Sub-Additive Tail Conditional VaR">
              Under elliptical jump-diffusion returns with implied volatility{' '}
              <InlineMath latex={`\\sigma_{\\text{VIX}} = ${vixLevel.toFixed(1)}\\%`} />, the
              expected shortfall at confidence <InlineMath latex="\alpha = 0.99" /> is bounded by{' '}
              <InlineMath latex={`\\text{CVaR}_{0.99} = \\$${(Number(portfolioVar99) * 1.18).toFixed(2)}\\text{M}`} />.
            </FormalBlock>
          </Pod>
        </div>

        {/* Positions & Greeks Ledger DataTable */}
        <Card
          title="3. Multi-Asset Positions, Greeks & Stress-Test Ledger"
          subtitle="Strict booktabs.sty financial ledger with \\cmidrule column groups and proportional exposure bars"
        >
          <DataTable
            caption="Portfolio holdings, notional weights, annualized Sharpe ratios, 99% Value-at-Risk, and DV01 rate sensitivity."
            rowKey={(r) => r.id}
            searchPlaceholder="Filter positions…"
            columns={[
              {
                key: 'instrument',
                header: 'Instrument & Tenor',
                group: 'Book & Strategy',
                sortable: true,
                render: (r) => (
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                      {r.instrument}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                      {r.assetClass}
                    </div>
                  </div>
                ),
              },
              {
                key: 'notionalM',
                header: 'Notional ($M)',
                group: 'Capital Allocation',
                align: 'right',
                numericValue: (r) => r.notionalM,
                barMax: 160,
                barColor: 'oklch(0.45 0.145 255 / 0.12)',
                render: (r) => <strong>${r.notionalM.toFixed(1)}M</strong>,
              },
              {
                key: 'weightPct',
                header: 'NAV Weight',
                group: 'Capital Allocation',
                align: 'right',
                numericValue: (r) => r.weightPct,
                render: (r) => `${r.weightPct.toFixed(1)}%`,
              },
              {
                key: 'sharpe',
                header: 'Sharpe',
                group: 'Risk & Greeks',
                align: 'right',
                numericValue: (r) => r.sharpe,
                render: (r) => r.sharpe.toFixed(2),
              },
              {
                key: 'var99M',
                header: '99% VaR ($M)',
                group: 'Risk & Greeks',
                align: 'right',
                numericValue: (r) => r.var99M,
                barMax: 3.0,
                barColor: 'oklch(0.48 0.18 32 / 0.14)',
                render: (r) => `$${r.var99M.toFixed(2)}M`,
              },
              {
                key: 'dv01K',
                header: 'DV01 ($k/bp)',
                group: 'Risk & Greeks',
                align: 'right',
                numericValue: (r) => r.dv01K,
                render: (r) => (
                  <span
                    style={{
                      color:
                        r.dv01K < 0
                          ? 'var(--ads-accent-compute)'
                          : 'oklch(0.42 0.14 160)',
                      fontWeight: 600,
                    }}
                  >
                    {r.dv01K > 0 ? `+${r.dv01K.toFixed(1)}` : r.dv01K.toFixed(1)}
                  </span>
                ),
              },
            ]}
            data={QUANT_POSITIONS}
            summaryRow={{
              instrument: 'Total Portfolio Aggregate (Net Diversified)',
              notionalM: '$428.6M',
              weightPct: '100.0%',
              sharpe: portfolioSharpe,
              var99M: `$${portfolioVar99}M`,
              dv01K: '-73.3 k/bp',
            }}
          />
        </Card>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* PROTOTYPE 3: HELIX — CLINICAL TRIALS & SURVIVAL BIOSTATISTICS              */
/* ========================================================================== */

interface ClinicalSubgroupRow {
  id: string;
  subgroup: string;
  category: string;
  eventsTrt: string;
  eventsCtrl: string;
  medianPfsMonths: string;
  hazardRatio: number;
  ci95: string;
  pValue: string;
}

const CLINICAL_SUBGROUPS: ClinicalSubgroupRow[] = [
  {
    id: 'itt-all',
    subgroup: 'Intention-To-Treat (All Randomized Patients)',
    category: 'Primary Endpoint',
    eventsTrt: '142 / 620 (22.9%)',
    eventsCtrl: '238 / 620 (38.4%)',
    medianPfsMonths: '28.4 vs. 16.2',
    hazardRatio: 0.56,
    ci95: '0.45 – 0.69',
    pValue: '< 0.0001',
  },
  {
    id: 'pdl1-high',
    subgroup: 'PD-L1 Tumor Proportion Score ≥ 50%',
    category: 'Biomarker Stratum',
    eventsTrt: '58 / 310 (18.7%)',
    eventsCtrl: '114 / 308 (37.0%)',
    medianPfsMonths: '32.1 vs. 15.8',
    hazardRatio: 0.48,
    ci95: '0.35 – 0.66',
    pValue: '< 0.0001',
  },
  {
    id: 'ctdna-neg',
    subgroup: 'Post-Surgical ctDNA Minimal Residual Disease Cleared',
    category: 'Molecular Response',
    eventsTrt: '34 / 245 (13.9%)',
    eventsCtrl: '82 / 240 (34.2%)',
    medianPfsMonths: 'Not Reached vs. 18.4',
    hazardRatio: 0.39,
    ci95: '0.26 – 0.58',
    pValue: '< 0.0001',
  },
  {
    id: 'tmb-high',
    subgroup: 'High Tumor Mutational Burden (≥ 10 mut/Mb)',
    category: 'Genomic Signature',
    eventsTrt: '49 / 218 (22.5%)',
    eventsCtrl: '88 / 222 (39.6%)',
    medianPfsMonths: '29.0 vs. 14.9',
    hazardRatio: 0.52,
    ci95: '0.37 – 0.73',
    pValue: '0.0002',
  },
  {
    id: 'stage-iiic',
    subgroup: 'Stage IIIC Resected High-Risk Cohort',
    category: 'Clinical Staging',
    eventsTrt: '64 / 210 (30.5%)',
    eventsCtrl: '96 / 212 (45.3%)',
    medianPfsMonths: '22.6 vs. 13.1',
    hazardRatio: 0.63,
    ci95: '0.46 – 0.86',
    pValue: '0.0034',
  },
];

export const HelixBioMedPrototype: React.FC = () => {
  const [cohortFilter, setCohortFilter] = useState<'itt' | 'pdl1' | 'ctdna'>('itt');
  const [hazardRatio, setHazardRatio] = useState<number>(0.56);
  const [controlLambda, setControlLambda] = useState<number>(0.032); // Monthly baseline hazard

  const handleSelectCohort = (c: 'itt' | 'pdl1' | 'ctdna') => {
    setCohortFilter(c);
    if (c === 'itt') setHazardRatio(0.56);
    if (c === 'pdl1') setHazardRatio(0.48);
    if (c === 'ctdna') setHazardRatio(0.39);
  };

  // Kaplan-Meier / Weibull Survival S(t) over 36 months
  const survivalSeries = useMemo(() => {
    const kShape = 1.15;
    const trtPoints = Array.from({ length: 37 }, (_, m) => {
      const sCtrl = Math.exp(-Math.pow(controlLambda * m, kShape));
      const sTrt = Math.pow(sCtrl, hazardRatio);
      return { x: m, y: sTrt * 100 };
    });

    const ctrlPoints = Array.from({ length: 37 }, (_, m) => {
      const sCtrl = Math.exp(-Math.pow(controlLambda * m, kShape));
      return { x: m, y: sCtrl * 100 };
    });

    return [
      {
        id: 'treatment-arm',
        label: `mRNA-4157 + Pembrolizumab (HR = ${hazardRatio.toFixed(2)})`,
        color: 'oklch(0.45 0.15 255)',
        points: trtPoints,
        fillArea: true,
      },
      {
        id: 'control-arm',
        label: 'Control Monotherapy Arm (Placebo + Pembrolizumab)',
        color: 'oklch(0.55 0.18 32)',
        points: ctrlPoints,
        dashed: true,
      },
    ];
  }, [hazardRatio, controlLambda]);

  const surv24Trt = survivalSeries[0].points[24]?.y ?? 72.4;
  const surv24Ctrl = survivalSeries[1].points[24]?.y ?? 51.8;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 44px)' }}>
      {/* 36px App Concept Sub-Bar */}
      <div
        className="ads-ui"
        style={{
          minHeight: '38px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '6px 24px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Badge tone="success" dot>
            APP CONCEPT 03 · CLINICAL BIOSTATISTICS
          </Badge>
          <strong style={{ fontSize: '13px', color: 'var(--ads-ink-carbon)' }}>
            Helix · Phase III Oncology Survival &amp; Biomarker Registry
          </strong>
          <span style={{ color: 'var(--ads-ink-pencil)', fontSize: '11.5px' }}>
            NCT0649210 · N = 1,240 Randomized
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
              Hazard Ratio HR:
            </span>
            <Scrubber
              value={hazardRatio}
              min={0.25}
              max={0.95}
              step={0.02}
              onChange={setHazardRatio}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--ads-ink-graphite)' }}>
              Baseline Hazard λ₀:
            </span>
            <Scrubber
              value={controlLambda}
              min={0.015}
              max={0.055}
              step={0.002}
              unit="mo⁻¹"
              onChange={setControlLambda}
            />
          </div>

          <SegmentedControl
            value={cohortFilter}
            onChange={handleSelectCohort}
            options={[
              { id: 'itt', label: 'All Randomized (ITT)' },
              { id: 'pdl1', label: 'PD-L1 ≥ 50%' },
              { id: 'ctdna', label: 'ctDNA Cleared' },
            ]}
          />
        </div>
      </div>

      {/* Main Workspace Container */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '28px 32px 64px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* 4-Column Clinical Endpoints Row */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '18px',
          }}
        >
          <MetricCard
            label="Stratified Hazard Ratio (HR)"
            value={hazardRatio.toFixed(2)}
            unit="p < 0.0001"
            delta={`-${((1 - hazardRatio) * 100).toFixed(0)}% Risk`}
            deltaTrend="up"
            sparklineData={[0.72, 0.68, 0.63, 0.59, 0.57, hazardRatio]}
            sparklineColor="oklch(0.45 0.15 255)"
            footnote="Cox proportional hazards model stratified by stage"
          />
          <MetricCard
            label="24-Month Recurrence-Free Survival"
            value={`${surv24Trt.toFixed(1)}%`}
            unit={`vs. ${surv24Ctrl.toFixed(1)}%`}
            delta={`+${(surv24Trt - surv24Ctrl).toFixed(1)}% Abs.`}
            deltaTrend="up"
            sparklineData={[94, 88, 83, 79, 75, surv24Trt]}
            sparklineColor="oklch(0.46 0.14 160)"
            footnote="Kaplan–Meier product-limit estimate at 24 months"
          />
          <MetricCard
            label="Enrolled Sample Size (ITT)"
            value="1,240"
            unit="patients"
            delta="1:1 Randomized"
            deltaTrend="up"
            sparklineData={[210, 480, 760, 990, 1150, 1240]}
            sparklineColor="oklch(0.48 0.16 310)"
            footnote="620 Treatment Arm · 620 Control Arm (48 sites)"
          />
          <MetricCard
            label="DSMB Stopping Boundary"
            value="Z = 4.62"
            unit="> 2.96 α-bound"
            delta="Efficacy Met ✓"
            deltaTrend="up"
            sparklineData={[1.2, 2.1, 2.8, 3.4, 4.1, 4.62]}
            sparklineColor="oklch(0.46 0.14 160)"
            footnote="Lan–DeMets O’Brien–Fleming spending function"
          />
        </div>

        {/* 2-Column Kaplan-Meier Canvas + Cox Model & Protocol */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '18px',
            alignItems: 'start',
          }}
        >
          <Pod
            title="1. Kaplan–Meier Recurrence-Free Survival Estimator S(t)"
            subtitle="Scrub Hazard Ratio HR or switch molecular biomarker cohorts in the top bar"
            domainTag="EMPIRICAL"
            cellLabel="KM[1]="
          >
            <CartesianCanvas
              xAxisLabel="Time Since Randomization t (Months)"
              yAxisLabel="Recurrence-Free Survival S(t) (%)"
              xDomain={[0, 36]}
              yDomain={[25, 100]}
              xTicks={[0, 6, 12, 18, 24, 30, 36]}
              yTicks={[25, 50, 75, 100]}
              series={survivalSeries}
              thresholds={[
                {
                  axis: 'x',
                  value: 24,
                  label: `24m Landmark (Δ+${(surv24Trt - surv24Ctrl).toFixed(1)}%)`,
                  color: 'oklch(0.45 0.15 255)',
                },
              ]}
            />
          </Pod>

          <Pod
            title="2. Cox Proportional Hazards & CONSORT Trial Governance"
            subtitle="Semi-Parametric Partial Likelihood & Interim Safety Monitoring"
            domainTag="THEOREM"
            cellLabel="Cox[2]="
            latexSource="\lambda(t \mid \mathbf{X}_i) = \lambda_0(t)\exp\!\left(\boldsymbol{\beta}^\top \mathbf{X}_i\right)"
          >
            <EquationBlock
              number="3.1"
              latex={`\\lambda(t \\mid \\mathbf{X}_i) = \\lambda_0(t)\\exp\\!\\left(\\boldsymbol{\\beta}^\\top \\mathbf{X}_i\\right), \\qquad \\text{HR} = e^{\\beta_{\\text{trt}}} = ${hazardRatio.toFixed(
                2
              )}`}
              caption="Cox proportional hazards model relating covariate vector X_i to baseline hazard λ₀(t)."
            />
            <Accordion
              defaultOpenIds={['consort-1']}
              items={[
                {
                  id: 'consort-1',
                  title: 'Primary Endpoint & Schoenfeld Residual Check',
                  subtitle: 'Proportionality p = 0.74 (Valid)',
                  content:
                    'Global Schoenfeld residual test confirms no violation of the proportional hazards assumption across the 36-month follow-up window.',
                },
                {
                  id: 'consort-2',
                  title: 'Independent DSMB Interim Analysis Charter',
                  subtitle: 'Two-Sided α = 0.0042 Spent',
                  content:
                    'Triggered after 380 primary recurrence events. Crossed pre-specified Lan–DeMets efficacy boundary with 99.6% statistical power.',
                },
              ]}
            />
          </Pod>
        </div>

        {/* NEJM-Grade Subgroup Stratification Table */}
        <Card
          title="3. Prespecified Subgroup & Biomarker Stratification Table (NEJM Booktabs Format)"
          subtitle="Click any subgroup row to load its Hazard Ratio into the survival curve above"
        >
          <DataTable
            caption="Subgroup efficacy analysis of recurrence-free survival by PD-L1 expression, ctDNA clearance, and tumor mutational burden."
            rowKey={(r) => r.id}
            onRowClick={(r) => setHazardRatio(r.hazardRatio)}
            searchPlaceholder="Filter subgroups…"
            columns={[
              {
                key: 'subgroup',
                header: 'Patient Subgroup / Biomarker Stratum',
                group: 'Cohort Stratification',
                sortable: true,
                render: (r) => (
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--ads-ink-carbon)' }}>
                      {r.subgroup}
                    </div>
                    <div style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                      {r.category}
                    </div>
                  </div>
                ),
              },
              {
                key: 'eventsTrt',
                header: 'mRNA-4157 Arm (n/N)',
                group: 'Event Incidence',
                align: 'right',
              },
              {
                key: 'eventsCtrl',
                header: 'Control Arm (n/N)',
                group: 'Event Incidence',
                align: 'right',
              },
              {
                key: 'medianPfsMonths',
                header: 'Median RFS (mo)',
                group: 'Survival Metrics',
                align: 'right',
              },
              {
                key: 'hazardRatio',
                header: 'Hazard Ratio',
                group: 'Survival Metrics',
                align: 'right',
                numericValue: (r) => r.hazardRatio,
                barMax: 1.0,
                barColor: 'oklch(0.45 0.145 255 / 0.12)',
                render: (r) => <strong>{r.hazardRatio.toFixed(2)}</strong>,
              },
              {
                key: 'ci95',
                header: '95% CI',
                group: 'Survival Metrics',
                align: 'right',
              },
              {
                key: 'pValue',
                header: 'Log-Rank p',
                group: 'Survival Metrics',
                align: 'right',
                render: (r) => (
                  <Badge tone="success">
                    {r.pValue}
                  </Badge>
                ),
              },
            ]}
            data={CLINICAL_SUBGROUPS}
            footnotes={[
              {
                mark: 'a',
                text: 'Hazard ratios < 1.00 favor adjuvant mRNA-4157 + pembrolizumab over control monotherapy.',
              },
              {
                mark: 'b',
                text: 'Confidence intervals calculated via profile likelihood in stratified Cox regression.',
              },
            ]}
          />
        </Card>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* PROTOTYPE 4: NEXUS — AGENTIC WORKFLOW & MULTI-AGENT ORCHESTRATOR           */
/* ========================================================================== */

interface AgentRunLedgerRow {
  id: string;
  runId: string;
  mission: string;
  subagents: number;
  toolCalls: number;
  verifierPassRate: number;
  tokensK: number;
  durationSec: number;
  gateStatus: 'Approved' | 'Awaiting Gate' | 'Auto-Verified';
}

const AGENT_RUN_LEDGER: AgentRunLedgerRow[] = [
  {
    id: 'run-1',
    runId: 'wf-984b-lean',
    mission: 'Formalize Spectral Gap Bound in Lean 4 + Mathlib',
    subagents: 5,
    toolCalls: 18,
    verifierPassRate: 100.0,
    tokensK: 42.8,
    durationSec: 19.4,
    gateStatus: 'Awaiting Gate',
  },
  {
    id: 'run-2',
    runId: 'wf-981a-perf',
    mission: 'SIMD Vectorize Symplectic RK4 Kernel & Run Criterion',
    subagents: 4,
    toolCalls: 14,
    verifierPassRate: 100.0,
    tokensK: 31.2,
    durationSec: 14.8,
    gateStatus: 'Approved',
  },
  {
    id: 'run-3',
    runId: 'wf-979c-lit',
    mission: 'Harvest & Audit 42 ArXiv Papers on Diffusion Bridges',
    subagents: 6,
    toolCalls: 29,
    verifierPassRate: 96.4,
    tokensK: 68.5,
    durationSec: 28.1,
    gateStatus: 'Auto-Verified',
  },
  {
    id: 'run-4',
    runId: 'wf-975d-sql',
    mission: 'Synthesize Idempotent Ledger Migration & Property Tests',
    subagents: 4,
    toolCalls: 11,
    verifierPassRate: 100.0,
    tokensK: 24.0,
    durationSec: 11.2,
    gateStatus: 'Approved',
  },
];

export const NexusAgentWorkflowPrototype: React.FC = () => {
  const [missionPreset, setMissionPreset] = useState<'lean-proof' | 'code-patch' | 'lit-harvest'>('lean-proof');
  const [activeStageIdx, setActiveStageIdx] = useState<number>(3);
  const [selectedNodeId, setSelectedNodeId] = useState<string>('critic-gate');
  const [maxParallel, setMaxParallel] = useState<number>(4);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(0.92);
  const [gateDecision, setGateDecision] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const pipelineNodes: AgentPipelineNode[] = useMemo(() => {
    const getStatus = (col: number, isGate = false) => {
      if (gateDecision === 'approved') return 'completed';
      if (gateDecision === 'rejected' && col >= 2) return 'failed';
      if (col < activeStageIdx) return 'completed';
      if (col === activeStageIdx) return isGate ? 'awaiting-approval' : 'running';
      return 'queued';
    };

    if (missionPreset === 'code-patch') {
      return [
        {
          id: 'planner',
          role: 'Lead Architect',
          title: '1. AST & Bottleneck Planner',
          model: 'principia-r3',
          status: getStatus(0),
          tokensUsed: 6400,
          latencyMs: 2100,
          column: 0,
          row: 0,
          summary: 'Decomposes hot-loop allocation bottlenecks across 4 modules and assigns isolated git worktrees.',
        },
        {
          id: 'retriever',
          role: 'Codebase Researcher',
          title: '2A. Call-Graph & Type Indexer',
          model: 'principia-flash',
          status: getStatus(1),
          tokensUsed: 8200,
          latencyMs: 1850,
          column: 1,
          row: 0,
          summary: 'Maps all references to RK4Integrator::step and extracts zero-copy Float64Array invariants.',
        },
        {
          id: 'prover',
          role: 'Patch Synthesizer',
          title: '2B. Worktree Patch Generator',
          model: 'principia-r3',
          status: getStatus(1),
          tokensUsed: 14900,
          latencyMs: 4600,
          column: 1,
          row: 1,
          summary: 'Synthesizes unrolled 4-stage symplectic integrator in isolated branch worktree.',
        },
        {
          id: 'sandbox',
          role: 'Verification Runner',
          title: '3. Criterion & Property Test Suite',
          model: 'sandbox-bun',
          status: getStatus(2),
          tokensUsed: 4100,
          latencyMs: 3200,
          column: 2,
          row: 0,
          summary: 'Executes 1,000 randomized Hamiltonian conservation property tests (+2.84x throughput speedup).',
        },
        {
          id: 'critic-gate',
          role: 'Governance Gate',
          title: '4. ChangeSet Approval Gate',
          model: 'human-gate',
          status: getStatus(3, true),
          tokensUsed: 1900,
          latencyMs: 650,
          column: 3,
          row: 0,
          summary: 'Holds merge to main until operator verifies zero regression in energy drift ΔE/E₀ < 10⁻¹².',
        },
      ];
    }

    if (missionPreset === 'lit-harvest') {
      return [
        {
          id: 'planner',
          role: 'Field Strategist',
          title: '1. Seed Citation Expander',
          model: 'principia-r3',
          status: getStatus(0),
          tokensUsed: 7800,
          latencyMs: 2400,
          column: 0,
          row: 0,
          summary: 'Expands 8 seed papers across 2-hop citation graph and ranks by SPECTER2 embedding cosine similarity.',
        },
        {
          id: 'retriever',
          role: 'LaTeX Extractor',
          title: '2A. ArXiv TeX Source Parser',
          model: 'principia-flash',
          status: getStatus(1),
          tokensUsed: 19400,
          latencyMs: 3900,
          column: 1,
          row: 0,
          summary: 'Extracts theorem environments, assumptions, and empirical tables directly from ArXiv e-print tarballs.',
        },
        {
          id: 'prover',
          role: 'Claim Auditor',
          title: '2B. Exact-Quote Grounding Judge',
          model: 'principia-r3',
          status: getStatus(1),
          tokensUsed: 16200,
          latencyMs: 5100,
          column: 1,
          row: 1,
          summary: 'Cross-checks every extracted assertion against verbatim passage spans with zero hallucination tolerance.',
        },
        {
          id: 'sandbox',
          role: 'Meta-Analysis Engine',
          title: '3. Effect-Size Reconciliation',
          model: 'sympy-cas',
          status: getStatus(2),
          tokensUsed: 8400,
          latencyMs: 2900,
          column: 2,
          row: 0,
          summary: 'Normalizes reported perplexity & pass@1 metrics across 42 papers to a unified compute-matched scale.',
        },
        {
          id: 'critic-gate',
          role: 'Publication Gate',
          title: '4. Dossier Commit Gate',
          model: 'human-gate',
          status: getStatus(3, true),
          tokensUsed: 3100,
          latencyMs: 920,
          column: 3,
          row: 0,
          summary: 'Awaits principal investigator sign-off before committing 18 verified claims to the field ledger.',
        },
      ];
    }

    // Default: lean-proof
    return [
      {
        id: 'planner',
        role: 'Orchestrator Agent',
        title: '1. Conjecture Decomposer',
        model: 'principia-r3',
        status: getStatus(0),
        tokensUsed: 7200,
        latencyMs: 2300,
        column: 0,
        row: 0,
        summary: 'Splits the spectral gap theorem into 3 orthogonal lemmas and dispatches parallel subagents.',
      },
      {
        id: 'retriever',
        role: 'Mathlib Retriever',
        title: '2A. Premise & Lemma Search',
        model: 'principia-flash',
        status: getStatus(1),
        tokensUsed: 9400,
        latencyMs: 1950,
        column: 1,
        row: 0,
        summary: 'Retrieves 14 relevant self-adjoint operator lemmas from Mathlib4 via semantic type-signature search.',
      },
      {
        id: 'prover',
        role: 'Formal Prover Agent',
        title: '2B. Lean 4 Tactic Synthesizer',
        model: 'principia-r3',
        status: getStatus(1),
        tokensUsed: 18600,
        latencyMs: 6400,
        column: 1,
        row: 1,
        summary: 'Generates tactic proof tree using linarith, positivity, and MeasureTheory.integral_mono.',
      },
      {
        id: 'sandbox',
        role: 'Kernel Verifier',
        title: '3. Lean 4 + SymPy Equivalence',
        model: 'lean4-kernel',
        status: getStatus(2),
        tokensUsed: 5200,
        latencyMs: 2800,
        column: 2,
        row: 0,
        summary: 'Compiles full proof term with zero sorry axioms and verifies symbolic asymptotic residue in SymPy.',
      },
      {
        id: 'critic-gate',
        role: 'Governance Gate',
        title: '4. Monograph Commit Gate',
        model: 'human-gate',
        status: getStatus(3, true),
        tokensUsed: 2400,
        latencyMs: 780,
        column: 3,
        row: 0,
        summary: 'Stages Theorem 4.2 and machine-checked proof block for insertion into the manuscript ledger.',
      },
    ];
  }, [missionPreset, activeStageIdx, gateDecision]);

  const pipelineEdges = useMemo(
    () => [
      { from: 'planner', to: 'retriever', label: 'spawn', active: activeStageIdx >= 1 },
      { from: 'planner', to: 'prover', label: 'spawn', active: activeStageIdx >= 1 },
      { from: 'retriever', to: 'sandbox', label: '14 lemmas', active: activeStageIdx >= 2 },
      { from: 'prover', to: 'sandbox', label: 'proof AST', active: activeStageIdx >= 2 },
      { from: 'sandbox', to: 'critic-gate', label: 'exit 0 ✓', active: activeStageIdx >= 3 },
    ],
    [activeStageIdx]
  );

  const selectedNode =
    pipelineNodes.find((n) => n.id === selectedNodeId) ?? pipelineNodes[0];

  const traceSteps = useMemo(
    () => [
      {
        id: 'st-1',
        stepNum: 1,
        kind: 'reasoning' as const,
        agentRole: 'Orchestrator Agent',
        title: 'Decompose target theorem into sub-goals & assign subagent worktrees',
        detail: `Partitioned dissipative spectral bound into (i) coercive quadratic form lemma and (ii) compact resolvent trace inequality with confidence threshold τ ≥ ${confidenceThreshold.toFixed(2)}.`,
        durationMs: 840,
        tokens: 1420,
        status: 'completed' as const,
      },
      {
        id: 'st-2',
        stepNum: 2,
        kind: 'subagent' as const,
        agentRole: 'Parallel Dispatch (2 Subagents)',
        title: 'Invoke Mathlib Retriever & Lean 4 Tactic Synthesizer concurrently',
        detail: `Spawned ${maxParallel} parallel worker threads across isolated git worktrees with read-only MCP access to Mathlib4 and ArXiv.`,
        durationMs: 1120,
        tokens: 2680,
        status: 'completed' as const,
      },
      {
        id: 'st-3',
        stepNum: 3,
        kind: 'tool-call' as const,
        agentRole: 'Formal Prover Agent',
        title: 'mcp://lean4-lsp/check_proof_state',
        detail: 'Submitted 28-line tactic script to Lean 4.14.0 language server; discharged all 3 remaining subgoals with zero sorry axioms.',
        codeOrPayload: `theorem damped_energy_decay (ζ ω₀ : ℝ) (hζ : 0 < ζ) (hω : 0 < ω₀) :\n    deriv (fun t => E t) t = -2 * ζ * ω₀ * (deriv x t)^2 := by\n  unfold E; ring_nf; linarith [hζ, hω]\n-- Lean 4 Kernel: Goals accomplished! (0 sorry, 284ms)`,
        durationMs: 2180,
        tokens: 4920,
        status: 'verified' as const,
      },
      {
        id: 'st-4',
        stepNum: 4,
        kind: 'verifier' as const,
        agentRole: 'Kernel Verifier',
        title: 'Symbolic CAS & Property Equivalence Audit Passed',
        detail: 'Cross-checked symbolic Lyapunov derivative against 10,000 randomized Float64 phase-space states; max residual |ΔR| = 1.42e-16.',
        durationMs: 960,
        tokens: 1840,
        status: 'verified' as const,
      },
    ],
    [confidenceThreshold, maxParallel]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 52px)' }}>
      {/* App Concept Sub-Bar */}
      <div
        className="ads-ui"
        style={{
          minHeight: '44px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '8px 28px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <Badge tone="compute" dot>
            APP CONCEPT 04 · AGENTIC WORKFLOW
          </Badge>
          <strong style={{ fontSize: '13.5px', color: 'var(--ads-ink-carbon)' }}>
            Nexus · Multi-Agent DAG, Verifier Trace &amp; Governance Control Plane
          </strong>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--ads-ink-graphite)' }}>
              Max Subagents:
            </span>
            <Scrubber
              value={maxParallel}
              min={1}
              max={8}
              step={1}
              unit="agents"
              onChange={setMaxParallel}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11.5px', color: 'var(--ads-ink-graphite)' }}>
              Verifier Gate τ:
            </span>
            <Scrubber
              value={confidenceThreshold}
              min={0.75}
              max={0.99}
              step={0.01}
              onChange={setConfidenceThreshold}
            />
          </div>

          <SegmentedControl
            value={missionPreset}
            onChange={(val) => {
              setMissionPreset(val);
              setGateDecision('pending');
              setActiveStageIdx(3);
            }}
            options={[
              { id: 'lean-proof', label: 'Lean 4 Theorem Prover' },
              { id: 'code-patch', label: 'Codebase Worktree Patch' },
              { id: 'lit-harvest', label: 'ArXiv Citation Harvest' },
            ]}
          />
        </div>
      </div>

      {/* Main Workspace Container */}
      <div
        style={{
          maxWidth: '1360px',
          width: '100%',
          margin: '0 auto',
          padding: '28px 32px 64px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* 4-Column Agentic Telemetry Strip */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '18px',
          }}
        >
          <MetricCard
            label="Active Subagent Fleet"
            value={`${maxParallel}`}
            unit="isolated worktrees"
            delta="Zero Lock Contention"
            deltaTrend="up"
            sparklineData={[2, 3, 4, 4, 5, maxParallel]}
            sparklineColor="oklch(0.45 0.15 255)"
            footnote="Each subagent runs in an ephemeral git worktree + sandbox"
          />
          <MetricCard
            label="Formal Verifier Pass Rate"
            value="100.0%"
            unit="Lean 4 + SymPy"
            delta="0 sorry axioms"
            deltaTrend="up"
            sparklineData={[91.2, 94.5, 97.0, 98.8, 100.0, 100.0]}
            sparklineColor="oklch(0.46 0.14 160)"
            footnote={`Gated at epistemic confidence threshold τ ≥ ${confidenceThreshold.toFixed(2)}`}
          />
          <MetricCard
            label="End-to-End DAG Latency"
            value="14.1"
            unit="sec"
            delta="-38% via Parallel"
            deltaTrend="up"
            sparklineData={[24.5, 21.0, 18.4, 16.2, 15.0, 14.1]}
            sparklineColor="oklch(0.48 0.18 32)"
            footnote="42.8k total reasoning + tool-call tokens consumed"
          />
          <MetricCard
            label="Human Governance State"
            value={
              gateDecision === 'approved'
                ? 'Committed'
                : gateDecision === 'rejected'
                ? 'Held'
                : 'Awaiting Gate'
            }
            unit="ADR-0043"
            delta={gateDecision === 'approved' ? 'Merged ✓' : '1 ChangeSet Pending'}
            deltaTrend={gateDecision === 'rejected' ? 'down' : 'up'}
            sparklineData={[1, 1, 2, 1, 1, gateDecision === 'approved' ? 0 : 1]}
            sparklineColor="oklch(0.48 0.16 310)"
            footnote="No autonomous mutation occurs without explicit gate sign-off"
          />
        </div>

        {/* Interactive Multi-Agent DAG Pipeline Pod */}
        <Pod
          title="1. Multi-Agent Directed Acyclic Execution Graph (Click Any Agent Node to Inspect)"
          subtitle="Topological orchestration across Planner, Parallel Retriever/Synthesizer Subagents, Kernel Verifier, and Human Governance Gate"
          domainTag="AI-VERIFIED"
          cellLabel="DAG[1]="
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <Badge tone="reference">Selected Node: {selectedNode.title}</Badge>
                <span style={{ fontSize: '12.5px', color: 'var(--ads-ink-graphite)' }}>
                  {selectedNode.summary}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Button
                  variant="secondary"
                  size="xs"
                  onClick={() => {
                    setGateDecision('pending');
                    setActiveStageIdx((i) => (i + 1) % 4);
                  }}
                >
                  Step Pipeline Stage ({activeStageIdx + 1}/4) ▸
                </Button>
                <Button
                  variant="tonal"
                  size="xs"
                  onClick={() => {
                    setActiveStageIdx(3);
                    setGateDecision('pending');
                  }}
                >
                  Reset to Gate
                </Button>
              </div>
            </div>

            <AgentPipelineGraph
              nodes={pipelineNodes}
              edges={pipelineEdges}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          </div>
        </Pod>

        {/* 2-Column Split: Chronological Reasoning/Tool Trace + Human Approval Gate */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(460px, 1fr))',
            gap: '22px',
            alignItems: 'start',
          }}
        >
          <Card
            title="2. Chronological Agent Reasoning, Subagent & Tool-Call Trace"
            subtitle="Every thought, MCP tool invocation, and formal kernel verification step with proportional latency bars"
            headerRight={<Badge tone="success" dot>4 Steps Verified</Badge>}
          >
            <AgentTraceTimeline
              steps={traceSteps}
              onReplayFromStep={(stepNum) => {
                setActiveStageIdx(Math.max(0, stepNum - 1));
                setGateDecision('pending');
              }}
            />
          </Card>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <Card
              title="3. Human-in-the-Loop Governance & ChangeSet Gate"
              subtitle="Propose changes as a verifiable ChangeSet — a person applies the ChangeSet, or holds it"
            >
              <HumanApprovalGate
                gateId="GATE-0043"
                agentName="Formal Prover Agent (principia-r3)"
                actionTitle={
                  missionPreset === 'code-patch'
                    ? 'Merge Unrolled Symplectic RK4 Kernel into src/core/integrator.ts'
                    : missionPreset === 'lit-harvest'
                    ? 'Commit 18 Grounded Literature Assertions to Field Ledger'
                    : 'Insert Machine-Checked Theorem 4.2 & Lean 4 Proof into Manuscript'
                }
                rationale="All 3 formal verification gates (Lean 4.14.0 typechecker, SymPy asymptotic residue check, and 10,000-trial invariant test suite) exited with code 0."
                riskLevel="medium"
                scopesRequested={['manuscript:propose', 'lean4:verify', 'ledger:commit']}
                payloadPreview={`@@ -142,4 +142,11 @@ section SpectralDissipation\n+ @[VerifiedBy "Lean 4.14.0 + SymPy 1.13"]\n+ theorem damped_energy_contraction (ζ ω₀ : ℝ) (hζ : ζ > 0) :\n+   ∀ t ≥ 0, E(t) ≤ E(0) * Real.exp (-2 * ζ * ω₀ * t) := by\n+   exact symplectic_lyapunov_bound ζ ω₀ hζ`}
                decision={gateDecision}
                onApprove={() => setGateDecision('approved')}
                onReject={() => setGateDecision('rejected')}
              />
            </Card>

            <Card
              title="4. Latest Sandbox MCP Tool Invocation"
              subtitle="Click to expand/collapse structured JSON input arguments and return diff"
            >
              <ToolCallCard
                toolName="mcp://lean4-kernel/verify_changeset"
                server="lean4-sandbox"
                status="success"
                durationMs={284}
                argsJson={`{\n  "module": "Principia.Spectral.DampedOscillator",\n  "theorem": "damped_energy_contraction",\n  "allowSorry": false,\n  "timeoutMs": 5000\n}`}
                outputPreview={`+ Lean 4.14.0 Kernel Check: PASS (0 axioms violated)\n+ Symbolic Residue |LHS - RHS|: 0.00000000e+00\n+ Ready for operator gate sign-off.`}
                diffMode
              />
            </Card>
          </div>
        </div>

        {/* Multi-Run Agent Execution Ledger DataTable */}
        <Card
          title="5. Autonomous Workflow Execution Ledger"
          subtitle="Historical multi-agent runs across theorem proving, codebase optimization, and literature harvesting"
        >
          <DataTable<AgentRunLedgerRow>
            caption="Table 1: Multi-Agent Workflow Telemetry & Verification Ledger"
            rowKey={(r) => r.id}
            searchPlaceholder="Filter runs by ID, mission, or gate status…"
            columns={[
              {
                key: 'runId',
                header: 'Run ID',
                render: (r) => (
                  <code className="ads-inline-code" style={{ fontWeight: 600 }}>
                    {r.runId}
                  </code>
                ),
              },
              {
                key: 'mission',
                header: 'Agentic Mission Objective',
                render: (r) => <strong>{r.mission}</strong>,
              },
              {
                key: 'subagents',
                header: 'Subagents',
                group: 'Orchestration',
                align: 'right',
                numericValue: (r) => r.subagents,
              },
              {
                key: 'toolCalls',
                header: 'MCP Tool Calls',
                group: 'Orchestration',
                align: 'right',
                numericValue: (r) => r.toolCalls,
              },
              {
                key: 'verifierPassRate',
                header: 'Verifier Pass (%)',
                group: 'Telemetry',
                align: 'right',
                numericValue: (r) => r.verifierPassRate,
                barMax: 100,
                barColor: 'oklch(0.46 0.14 160 / 0.14)',
                render: (r) => <strong>{r.verifierPassRate.toFixed(1)}%</strong>,
              },
              {
                key: 'tokensK',
                header: 'Tokens (k)',
                group: 'Telemetry',
                align: 'right',
                numericValue: (r) => r.tokensK,
                render: (r) => `${r.tokensK.toFixed(1)}k`,
              },
              {
                key: 'durationSec',
                header: 'Wall Time (s)',
                group: 'Telemetry',
                align: 'right',
                numericValue: (r) => r.durationSec,
                render: (r) => `${r.durationSec.toFixed(1)}s`,
              },
              {
                key: 'gateStatus',
                header: 'Governance Gate',
                align: 'right',
                render: (r) => (
                  <Badge
                    tone={
                      r.gateStatus === 'Approved' || r.gateStatus === 'Auto-Verified'
                        ? 'success'
                        : 'warning'
                    }
                    dot
                  >
                    {r.gateStatus}
                  </Badge>
                ),
              },
            ]}
            data={AGENT_RUN_LEDGER}
          />
        </Card>
      </div>
    </div>
  );
};

/* ========================================================================== */
/* PROTOTYPE 5: PRINCIPIA — DYNAMICAL SYSTEMS, SYMBOLIC CAS & MONOGRAPH LAB   */
/* ========================================================================== */

export const PrincipiaPhysicsPrototype: React.FC = () => {
  const [model, setModel] = useState<'damped-oscillator' | 'quantum-eigenstates' | 'lotka-volterra'>(
    'damped-oscillator'
  );
  const [zeta, setZeta] = useState<number>(0.25);
  const [omega0, setOmega0] = useState<number>(4.0);
  const [quantumN] = useState<number>(2);

  const dampedFreq = useMemo(() => {
    const disc = 1 - zeta * zeta;
    return disc > 0 ? omega0 * Math.sqrt(disc) : 0;
  }, [zeta, omega0]);

  const regimeLabel =
    zeta < 0.99 ? 'Underdamped (ζ < 1)' : zeta <= 1.01 ? 'Critical (ζ = 1)' : 'Overdamped (ζ > 1)';

  return (
    <div style={{ backgroundColor: 'var(--ads-paper-desk, #F2F0EA)', minHeight: 'calc(100vh - 94px)' }}>
      {/* Top Physics & CAS Control Bar */}
      <div
        className="ads-ui"
        style={{
          padding: '12px 28px',
          backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
          borderBottom: '1px solid var(--ads-ink-hairline, #E3E1DB)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <Badge tone="reference" dot>
            PRINCIPIA DYNAMICAL &amp; CAS LAB
          </Badge>
          <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--ads-ink-carbon)' }}>
            Coupled Symbolic Mathematics, Symplectic Phase Space &amp; Formal Proofs
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
          <SegmentedControl
            size="sm"
            value={model}
            onChange={setModel}
            options={[
              { id: 'damped-oscillator', label: 'Damped Oscillator' },
              { id: 'quantum-eigenstates', label: 'Quantum Well ψₙ(x)' },
              { id: 'lotka-volterra', label: 'Lotka–Volterra Orbits' },
            ]}
          />

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: 'var(--ads-ink-graphite)', fontWeight: 500 }}>Damping ζ:</span>
            <Scrubber
              symbolId="zeta"
              symbolLatex="\zeta"
              value={zeta}
              min={0.05}
              max={1.6}
              step={0.01}
              onChange={setZeta}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
            <span style={{ color: 'var(--ads-ink-graphite)', fontWeight: 500 }}>Frequency ω₀:</span>
            <Scrubber
              symbolId="omega0"
              symbolLatex="\omega_0"
              value={omega0}
              min={1.0}
              max={8.0}
              step={0.1}
              unit="rad/s"
              onChange={setOmega0}
            />
          </div>
        </div>
      </div>

      {/* Main Content Container */}
      <div
        style={{
          maxWidth: '1320px',
          margin: '0 auto',
          padding: '28px 32px 64px 32px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
        }}
      >
        {/* Symbolic OmniComputeBar */}
        <OmniComputeBar
          onSelectPreset={(preset) => {
            setZeta(preset.zeta);
            setOmega0(preset.omega0);
          }}
        />

        {/* 4 Coupled Physical Telemetry Readouts */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
            gap: '16px',
          }}
        >
          <MetricCard
            label="Spectral Regime"
            value={regimeLabel}
            delta={`ζ = ${zeta.toFixed(2)}`}
            deltaTrend={zeta < 1 ? 'up' : 'neutral'}
            footnote="Critical bifurcation boundary at ζ = 1.00"
          />
          <MetricCard
            label="Characteristic Roots s₁,₂"
            value={`−${(zeta * omega0).toFixed(2)}`}
            unit={zeta < 1 ? `± i·${dampedFreq.toFixed(2)}` : 'rad/s'}
            delta="Hurwitz Stable"
            deltaTrend="up"
            footnote="Poles reside strictly in the open left half-plane"
          />
          <MetricCard
            label="Symplectic Area Contraction"
            value={`−${(2 * zeta * omega0).toFixed(2)}`}
            unit="s⁻¹"
            delta="Liouville Rate"
            deltaTrend="neutral"
            sparklineData={[1.0, 0.72, 0.51, 0.36, 0.25, 0.18, 0.12]}
            footnote="d/dt Vol(Ω) = −2ζω₀ Vol(Ω)"
          />
          <MetricCard
            label="Quality Factor Q"
            value={(1 / (2 * Math.max(0.05, zeta))).toFixed(2)}
            unit="dimensionless"
            delta={`ω₀ = ${omega0.toFixed(1)} rad/s`}
            deltaTrend="up"
            footnote="Energy stored per radian vs. thermal dissipation"
          />
        </div>

        {/* Split Row: Multi-Panel Scientific Plot + Formal Manuscript & Theorem */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
            gap: '22px',
            alignItems: 'start',
          }}
        >
          <Pod
            title="1. Multi-Panel Trajectory, Phase Portrait & Complex Root Locus"
            subtitle="Coupled in real time to damping ratio ζ and natural frequency ω₀"
            domainTag="EXACT"
          >
            <ScientificPlot
              model={model}
              zeta={zeta}
              omega0={omega0}
              quantumN={quantumN}
            />
          </Pod>

          <Pod
            title="2. Formal Monograph & Green’s Propagator Derivation"
            subtitle="Hover any mathematical symbol to trigger cross-representation highlighting"
            domainTag="THEOREM"
            latexSource="G(t-\tau) = \frac{e^{-\zeta\omega_0(t-\tau)}}{\omega_0\sqrt{1-\zeta^2}}\sin\!\left(\omega_0\sqrt{1-\zeta^2}(t-\tau)\right)"
          >
            <p className="ads-prose" style={{ margin: '0 0 12px 0' }}>
              Consider the canonical dissipative harmonic flow governed by damping ratio{' '}
              <Sym id="zeta" math="\zeta" /> and natural eigenfrequency{' '}
              <Sym id="omega0" math="\omega_0" />. Following Arnold <Cite id="arnold1989" /> and
              Duhamel’s principle <CrossRef to="eq:greens" />, the impulse response kernel{' '}
              <Sym id="kernel" math="G(t-\tau)" /> takes the closed form:
            </p>

            <EquationBlock
              id="eq:greens"
              number="1.1"
              latex="G(t-\tau) = \frac{e^{-\zeta\omega_0(t-\tau)}}{\omega_0\sqrt{1-\zeta^2}}\sin\!\left(\omega_0\sqrt{1-\zeta^2}(t-\tau)\right)\Theta(t-\tau)"
              referencedSymbols={['zeta', 'omega0', 'kernel']}
            />

            <FormalBlock
              id="thm:lyapunov"
              variant="theorem"
              number="1.1"
              title="Lyapunov Spectral Contraction"
            >
              For every trajectory with <Sym id="zeta" math="\zeta > 0" /> and{' '}
              <Sym id="omega0" math="\omega_0 > 0" />, the canonical Hamiltonian energy{' '}
              <Sym id="energy" math="\mathcal{H}(q,p)" /> is a strict Lyapunov function satisfying{' '}
              <InlineMath
                latex={`\\dot{\\mathcal{H}}(q,p) = -2\\zeta\\omega_0 p^2 = -${(
                  2 *
                  zeta *
                  omega0
                ).toFixed(2)}\\,p^2 \\le 0`}
              />.
            </FormalBlock>

            <ProofBlock title="Proof of Theorem 1.1 (Halmos Q.E.D.)">
              Differentiating <InlineMath latex="\mathcal{H}(q,p) = \frac{1}{2}p^2 + \frac{1}{2}\omega_0^2 q^2" />{' '}
              along the vector field <InlineMath latex="(\dot{q}, \dot{p}) = (p, -\omega_0^2 q - 2\zeta\omega_0 p)" />{' '}
              cancels the conservative cross-terms <InlineMath latex="\omega_0^2 q p" />, leaving{' '}
              <InlineMath latex="\dot{\mathcal{H}} = -2\zeta\omega_0 p^2 \le 0" />. By LaSalle’s
              Invariance Principle, the origin is globally asymptotically stable.
            </ProofBlock>
          </Pod>
        </div>

        {/* Bottom Split: Booktabs Spectral Ledger + Multi-Dialect Code Cell & AI Copilot */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(480px, 1fr))',
            gap: '22px',
            alignItems: 'start',
          }}
        >
          <Pod
            title="3. Spectral Classification Ledger (booktabs.sty)"
            subtitle="Click any regime row to synchronize damping ratio ζ across all plots and equations"
            domainTag="EMPIRICAL"
          >
            <BooktabsTable
              caption="Table 1: Eigenvalues, Q-factors, and relaxation times across canonical damping regimes."
              activeZeta={zeta}
              omega0={omega0}
              onSelectZeta={setZeta}
            />
          </Pod>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <CodeCell
              language="Julia 1.11 · DifferentialEquations.jl"
              zeta={zeta}
              omega0={omega0}
            />
            <GroundedAIChat />
          </div>
        </div>
      </div>
    </div>
  );
};
