import React, { useState } from 'react';
import {
  CheckCircle2,
  Terminal,
  ChevronDown,
  ChevronRight,
  GitBranch,
  ShieldAlert,
  Sparkles,
  RotateCcw,
  Check,
  X,
} from 'lucide-react';
import { Button, Badge } from '../general/GeneralFoundation';

/**
 * ============================================================================
 * L3 PILLAR 7: AGENTIC WORKFLOW & ORCHESTRATION (@principia/core)
 * ============================================================================
 * First-class primitives for multi-agent DAG pipelines, chronological reasoning
 * & tool-call traces, MCP / sandbox invocation cards, and human-in-the-loop
 * governance gates.
 */

export type AgentNodeStatus =
  | 'completed'
  | 'running'
  | 'awaiting-approval'
  | 'queued'
  | 'failed';

export interface AgentPipelineNode {
  id: string;
  role: string;
  title: string;
  model: string;
  status: AgentNodeStatus;
  tokensUsed: number;
  latencyMs: number;
  confidence?: number;
  column: number; // 0-indexed topological stage column
  row: number; // 0-indexed vertical lane in that column
  summary: string;
}

export interface AgentPipelineEdge {
  from: string;
  to: string;
  label?: string;
  active?: boolean;
}

export interface AgentPipelineGraphProps {
  nodes: AgentPipelineNode[];
  edges: AgentPipelineEdge[];
  selectedNodeId?: string;
  onSelectNode?: (id: string) => void;
}

const STATUS_META: Record<
  AgentNodeStatus,
  {
    label: string;
    tone: 'success' | 'compute' | 'warning' | 'neutral' | 'danger';
    border: string;
    bg: string;
    dotColor: string;
  }
> = {
  completed: {
    label: 'Verified',
    tone: 'success',
    border: 'oklch(0.76 0.08 160)',
    bg: 'oklch(0.985 0.008 160)',
    dotColor: 'oklch(0.45 0.14 160)',
  },
  running: {
    label: 'Executing',
    tone: 'compute',
    border: 'oklch(0.68 0.14 32)',
    bg: 'oklch(0.982 0.014 32)',
    dotColor: 'oklch(0.55 0.185 32)',
  },
  'awaiting-approval': {
    label: 'Human Gate',
    tone: 'warning',
    border: 'oklch(0.75 0.11 75)',
    bg: 'oklch(0.982 0.016 78)',
    dotColor: 'oklch(0.52 0.14 75)',
  },
  queued: {
    label: 'Queued',
    tone: 'neutral',
    border: 'var(--ads-ink-hairline, #E3E1DB)',
    bg: 'var(--ads-paper-plate, #FFFFFF)',
    dotColor: 'var(--ads-ink-pencil, #85837D)',
  },
  failed: {
    label: 'Halted',
    tone: 'danger',
    border: 'oklch(0.76 0.10 25)',
    bg: 'oklch(0.982 0.012 25)',
    dotColor: 'oklch(0.46 0.18 25)',
  },
};

export const AgentPipelineGraph: React.FC<AgentPipelineGraphProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
}) => {
  // Compute SVG coordinate layout from (column, row)
  const colWidth = 228;
  const rowHeight = 114;
  const nodeW = 186;
  const nodeH = 84;
  const padX = 20;
  const padY = 20;

  const maxCol = Math.max(0, ...nodes.map((n) => n.column));
  const maxRow = Math.max(0, ...nodes.map((n) => n.row));

  const colRowCounts = new Map<number, number>();
  nodes.forEach((n) => {
    colRowCounts.set(n.column, Math.max(colRowCounts.get(n.column) ?? 0, n.row + 1));
  });
  const totalRows = maxRow + 1;

  const getNodeCoords = (n: AgentPipelineNode) => {
    const countInCol = colRowCounts.get(n.column) ?? 1;
    const verticalOffset = ((totalRows - countInCol) * rowHeight) / 2;
    const x = padX + n.column * colWidth;
    const y = padY + verticalOffset + n.row * rowHeight;
    return { x, y };
  };

  const nodeMap = new Map<string, AgentPipelineNode & { x: number; y: number }>();
  nodes.forEach((n) => {
    const { x, y } = getNodeCoords(n);
    nodeMap.set(n.id, { ...n, x, y });
  });

  const svgWidth = padX * 2 + maxCol * colWidth + nodeW;
  const svgHeight = padY * 2 + totalRows * rowHeight - (rowHeight - nodeH);

  return (
    <div
      className="ads-ui"
      style={{
        width: '100%',
        overflowX: 'auto',
        padding: '14px',
        borderRadius: '7px',
        backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
        border: '1px solid var(--ads-ink-hairline, #E3E1DB)',
      }}
    >
      <div
        style={{
          position: 'relative',
          width: `${svgWidth}px`,
          height: `${svgHeight}px`,
          margin: '0 auto',
        }}
      >
        {/* Directed Edges SVG Layer */}
        <svg
          width={svgWidth}
          height={svgHeight}
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            overflow: 'visible',
          }}
        >
          <defs>
            <marker
              id="ads-agent-arrow"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="oklch(0.62 0.01 80)" />
            </marker>
            <marker
              id="ads-agent-arrow-active"
              viewBox="0 0 10 10"
              refX="7"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="oklch(0.45 0.145 255)" />
            </marker>
          </defs>

          {edges.map((edge, idx) => {
            const src = nodeMap.get(edge.from);
            const dst = nodeMap.get(edge.to);
            if (!src || !dst) return null;

            const x1 = src.x + nodeW;
            const y1 = src.y + nodeH / 2;
            const x2 = dst.x;
            const y2 = dst.y + nodeH / 2;
            const cx1 = x1 + (x2 - x1) * 0.48;
            const cx2 = x2 - (x2 - x1) * 0.48;
            const pathD = `M ${x1} ${y1} C ${cx1} ${y1}, ${cx2} ${y2}, ${x2} ${y2}`;

            return (
              <g key={`${edge.from}-${edge.to}-${idx}`}>
                <path
                  d={pathD}
                  fill="none"
                  stroke={
                    edge.active
                      ? 'oklch(0.45 0.145 255)'
                      : 'oklch(0.78 0.008 80)'
                  }
                  strokeWidth={edge.active ? 1.75 : 1.25}
                  strokeDasharray={edge.active ? undefined : '4 3'}
                  markerEnd={
                    edge.active
                      ? 'url(#ads-agent-arrow-active)'
                      : 'url(#ads-agent-arrow)'
                  }
                />
                {edge.label && (
                  <text
                    x={(x1 + x2) / 2}
                    y={(y1 + y2) / 2 - 6}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontWeight={500}
                    fill="var(--ads-ink-pencil, #85837D)"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Interactive Agent Nodes Layer */}
        {Array.from(nodeMap.values()).map((node) => {
          const meta = STATUS_META[node.status];
          const isSelected = selectedNodeId === node.id;

          return (
            <button
              key={node.id}
              type="button"
              onClick={() => onSelectNode?.(node.id)}
              style={{
                position: 'absolute',
                left: `${node.x}px`,
                top: `${node.y}px`,
                width: `${nodeW}px`,
                height: `${nodeH}px`,
                padding: '9px 11px',
                borderRadius: '7px',
                backgroundColor: isSelected ? '#FFFFFF' : meta.bg,
                border: isSelected
                  ? '1.5px solid oklch(0.45 0.145 255)'
                  : `1px solid ${meta.border}`,
                boxShadow: isSelected
                  ? '0 4px 12px oklch(0.45 0.145 255 / 0.15), inset 0 1px 0 #FFF'
                  : '0 1px 2.5px rgba(20, 20, 19, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                textAlign: 'left',
                cursor: onSelectNode ? 'pointer' : 'default',
                transition: 'transform 100ms ease, box-shadow 100ms ease, border-color 100ms ease',
              }}
            >
              {/* Top Row: Role + Status Dot */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '6px',
                  width: '100%',
                }}
              >
                <span
                  style={{
                    fontSize: '9.5px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    color: 'var(--ads-ink-pencil, #85837D)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {node.role}
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '9.5px',
                    fontWeight: 600,
                    color: meta.dotColor,
                  }}
                >
                  <span
                    style={{
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      backgroundColor: meta.dotColor,
                    }}
                  />
                  {meta.label}
                </span>
              </div>

              {/* Middle Row: Node Title */}
              <div
                style={{
                  fontSize: '12.5px',
                  fontWeight: 600,
                  color: 'var(--ads-ink-carbon, #141413)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {node.title}
              </div>

              {/* Bottom Row: Model + Telemetry */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  fontSize: '10.5px',
                  color: 'var(--ads-ink-graphite, #4E4D49)',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--ads-font-mono)',
                    fontSize: '10px',
                    color: 'var(--ads-ink-pencil)',
                  }}
                >
                  {node.model}
                </span>
                <span>
                  {(node.tokensUsed / 1000).toFixed(1)}k tok · {(node.latencyMs / 1000).toFixed(1)}s
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 2. STRUCTURED TOOL CALL & MCP INVOCATION CARD (<ToolCallCard />)           */
/* -------------------------------------------------------------------------- */

export interface ToolCallCardProps {
  toolName: string;
  server: string;
  status: 'success' | 'running' | 'error';
  durationMs: number;
  argsJson: string;
  outputPreview: string;
  diffMode?: boolean;
  defaultExpanded?: boolean;
}

export const ToolCallCard: React.FC<ToolCallCardProps> = ({
  toolName,
  server,
  status,
  durationMs,
  argsJson,
  outputPreview,
  diffMode = false,
  defaultExpanded = true,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div
      className="ads-ui"
      style={{
        borderRadius: '6px',
        border: '1px solid var(--ads-ink-hairline, #E3E1DB)',
        backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
        overflow: 'hidden',
      }}
    >
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '8px 12px',
          border: 'none',
          background:
            'linear-gradient(180deg, oklch(0.995 0.002 85) 0%, oklch(0.982 0.004 82) 100%)',
          borderBottom: expanded
            ? '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))'
            : 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
          {expanded ? (
            <ChevronDown size={13} color="var(--ads-ink-pencil)" />
          ) : (
            <ChevronRight size={13} color="var(--ads-ink-pencil)" />
          )}
          <Terminal size={12} color="var(--ads-accent-reference)" />
          <code
            style={{
              fontFamily: 'var(--ads-font-mono)',
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--ads-ink-carbon, #141413)',
            }}
          >
            {toolName}
          </code>
          <span className="ads-badge-domain">{server}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          <span
            style={{
              fontSize: '11px',
              color: 'var(--ads-ink-pencil)',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {durationMs} ms
          </span>
          <Badge
            tone={
              status === 'success'
                ? 'success'
                : status === 'running'
                ? 'compute'
                : 'danger'
            }
            dot
          >
            {status === 'success' ? 'exit 0' : status === 'running' ? 'running' : 'exit 1'}
          </Badge>
        </div>
      </button>

      {expanded && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1px',
            backgroundColor: 'var(--ads-ink-whisper, oklch(0.942 0.004 82))',
          }}
        >
          {/* Input Arguments */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--ads-ink-pencil)',
                marginBottom: '4px',
              }}
            >
              Arguments (JSON)
            </div>
            <pre
              style={{
                margin: 0,
                fontFamily: 'var(--ads-font-mono)',
                fontSize: '11.5px',
                lineHeight: 1.45,
                color: 'var(--ads-ink-carbon)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {argsJson}
            </pre>
          </div>

          {/* Output / Diff Preview */}
          <div
            style={{
              padding: '10px 12px',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div
              style={{
                fontSize: '10px',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                color: 'var(--ads-ink-pencil)',
                marginBottom: '4px',
              }}
            >
              {diffMode ? 'Sandbox Patch / Verification Diff' : 'Structured Return Payload'}
            </div>
            <pre
              style={{
                margin: 0,
                fontFamily: 'var(--ads-font-mono)',
                fontSize: '11.5px',
                lineHeight: 1.45,
                color: diffMode ? 'oklch(0.38 0.13 160)' : 'var(--ads-ink-graphite)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {outputPreview}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 3. CHRONOLOGICAL AGENT REASONING & TRACE TIMELINE (<AgentTraceTimeline />) */
/* -------------------------------------------------------------------------- */

export type TraceStepKind = 'reasoning' | 'tool-call' | 'verifier' | 'subagent';

export interface AgentTraceStep {
  id: string;
  stepNum: number;
  kind: TraceStepKind;
  agentRole: string;
  title: string;
  detail: string;
  codeOrPayload?: string;
  durationMs: number;
  tokens: number;
  status: 'verified' | 'completed' | 'running' | 'warning';
}

export interface AgentTraceTimelineProps {
  steps: AgentTraceStep[];
  onReplayFromStep?: (stepNum: number) => void;
}

const STEP_KIND_META: Record<
  TraceStepKind,
  { badge: string; tone: 'reference' | 'compute' | 'success' | 'neutral'; icon: React.ReactNode }
> = {
  reasoning: {
    badge: 'REASONING',
    tone: 'neutral',
    icon: <Sparkles size={12} color="var(--ads-ink-graphite)" />,
  },
  'tool-call': {
    badge: 'TOOL CALL',
    tone: 'reference',
    icon: <Terminal size={12} color="var(--ads-accent-reference)" />,
  },
  verifier: {
    badge: 'FORMAL VERIFIER',
    tone: 'success',
    icon: <CheckCircle2 size={12} color="oklch(0.45 0.14 160)" />,
  },
  subagent: {
    badge: 'SUBAGENT HANDOFF',
    tone: 'compute',
    icon: <GitBranch size={12} color="var(--ads-accent-compute)" />,
  },
};

export const AgentTraceTimeline: React.FC<AgentTraceTimelineProps> = ({
  steps,
  onReplayFromStep,
}) => {
  const maxDuration = Math.max(100, ...steps.map((s) => s.durationMs));

  return (
    <div className="ads-ui" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      {steps.map((step) => {
        const meta = STEP_KIND_META[step.kind];
        const barPct = Math.min(100, Math.max(8, (step.durationMs / maxDuration) * 100));

        return (
          <div
            key={step.id}
            style={{
              padding: '12px 14px',
              borderRadius: '7px',
              backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
              border: '1px solid var(--ads-ink-hairline, #E3E1DB)',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {/* Header Row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                <span
                  style={{
                    fontFamily: 'var(--ads-font-mono)',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: 'var(--ads-ink-pencil)',
                  }}
                >
                  #{String(step.stepNum).padStart(2, '0')}
                </span>
                {meta.icon}
                <Badge tone={meta.tone}>{meta.badge}</Badge>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: 600,
                    color: 'var(--ads-ink-carbon, #141413)',
                  }}
                >
                  {step.title}
                </span>
                <span style={{ fontSize: '11.5px', color: 'var(--ads-ink-pencil)' }}>
                  · {step.agentRole}
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Proportional Latency Waterfall Bar */}
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '11px',
                    color: 'var(--ads-ink-graphite)',
                    fontVariantNumeric: 'tabular-nums',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '5px',
                      borderRadius: '3px',
                      backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${barPct}%`,
                        height: '100%',
                        backgroundColor:
                          step.kind === 'verifier'
                            ? 'oklch(0.45 0.14 160)'
                            : 'oklch(0.45 0.145 255)',
                      }}
                    />
                  </div>
                  <span>{step.durationMs} ms</span>
                  <span style={{ color: 'var(--ads-ink-pencil)' }}>· {step.tokens} tok</span>
                </div>

                {onReplayFromStep && (
                  <button
                    type="button"
                    onClick={() => onReplayFromStep(step.stepNum)}
                    className="ads-btn-instrument"
                    style={{ height: '22px', padding: '0 7px', fontSize: '10.5px' }}
                    title="Fork & replay trajectory from this step"
                  >
                    <RotateCcw size={10} />
                    <span>Fork</span>
                  </button>
                )}
              </div>
            </div>

            {/* Step Narrative Detail */}
            <div
              style={{
                fontSize: '12.5px',
                lineHeight: 1.52,
                color: 'var(--ads-ink-graphite, #4E4D49)',
              }}
            >
              {step.detail}
            </div>

            {/* Optional Code / Verifier Output */}
            {step.codeOrPayload && (
              <pre
                style={{
                  margin: 0,
                  padding: '8px 10px',
                  borderRadius: '5px',
                  backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                  border: '1px solid var(--ads-ink-whisper)',
                  fontFamily: 'var(--ads-font-mono)',
                  fontSize: '11.5px',
                  lineHeight: 1.45,
                  color: 'var(--ads-ink-carbon)',
                  overflowX: 'auto',
                }}
              >
                {step.codeOrPayload}
              </pre>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. HUMAN-IN-THE-LOOP APPROVAL & POLICY GATE (<HumanApprovalGate />)        */
/* -------------------------------------------------------------------------- */

export interface HumanApprovalGateProps {
  gateId: string;
  agentName: string;
  actionTitle: string;
  rationale: string;
  riskLevel: 'low' | 'medium' | 'high';
  scopesRequested: string[];
  payloadPreview: string;
  decision?: 'pending' | 'approved' | 'rejected';
  onApprove?: () => void;
  onReject?: () => void;
}

export const HumanApprovalGate: React.FC<HumanApprovalGateProps> = ({
  gateId,
  agentName,
  actionTitle,
  rationale,
  riskLevel,
  scopesRequested,
  payloadPreview,
  decision = 'pending',
  onApprove,
  onReject,
}) => {
  return (
    <div
      className="ads-ui"
      style={{
        borderRadius: '8px',
        border:
          decision === 'approved'
            ? '1px solid var(--ads-status-success-border)'
            : decision === 'rejected'
            ? '1px solid var(--ads-status-danger-border)'
            : '1px solid oklch(0.76 0.11 75)',
        backgroundColor:
          decision === 'approved'
            ? 'var(--ads-status-success-bg)'
            : decision === 'rejected'
            ? 'var(--ads-status-danger-bg)'
            : 'oklch(0.985 0.015 80)',
        padding: '16px 18px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      {/* Top Gate Banner */}
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
          <ShieldAlert
            size={15}
            color={
              decision === 'approved'
                ? 'var(--ads-status-success-fg)'
                : decision === 'rejected'
                ? 'var(--ads-status-danger-fg)'
                : 'oklch(0.48 0.14 75)'
            }
          />
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              color: 'var(--ads-ink-graphite)',
            }}
          >
            HUMAN-IN-THE-LOOP GATE · {gateId}
          </span>
          <Badge
            tone={
              riskLevel === 'high'
                ? 'danger'
                : riskLevel === 'medium'
                ? 'warning'
                : 'reference'
            }
          >
            Risk: {riskLevel.toUpperCase()}
          </Badge>
        </div>

        <Badge
          tone={
            decision === 'approved'
              ? 'success'
              : decision === 'rejected'
              ? 'danger'
              : 'warning'
          }
          dot
        >
          {decision === 'approved'
            ? 'Approved & Committed'
            : decision === 'rejected'
            ? 'Held / Rejected'
            : 'Awaiting Operator Decision'}
        </Badge>
      </div>

      {/* Action Title & Rationale */}
      <div>
        <div
          style={{
            fontSize: '14px',
            fontWeight: 600,
            color: 'var(--ads-ink-carbon, #141413)',
            marginBottom: '4px',
          }}
        >
          {actionTitle}{' '}
          <span style={{ fontWeight: 400, fontSize: '12px', color: 'var(--ads-ink-pencil)' }}>
            (requested by {agentName})
          </span>
        </div>
        <div style={{ fontSize: '12.5px', lineHeight: 1.5, color: 'var(--ads-ink-graphite)' }}>
          {rationale}
        </div>
      </div>

      {/* Requested Capability Scopes */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '11px', fontWeight: 600, color: 'var(--ads-ink-pencil)' }}>
          Scopes:
        </span>
        {scopesRequested.map((sc) => (
          <code key={sc} className="ads-inline-code" style={{ fontSize: '11px' }}>
            {sc}
          </code>
        ))}
      </div>

      {/* Proposed ChangeSet / Command Preview */}
      <pre
        style={{
          margin: 0,
          padding: '10px 12px',
          borderRadius: '6px',
          backgroundColor: '#FFFFFF',
          border: '1px solid var(--ads-ink-hairline, #E3E1DB)',
          fontFamily: 'var(--ads-font-mono)',
          fontSize: '11.5px',
          lineHeight: 1.45,
          color: 'var(--ads-ink-carbon)',
          overflowX: 'auto',
        }}
      >
        {payloadPreview}
      </pre>

      {/* Operator Decision Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '10px',
          paddingTop: '4px',
        }}
      >
        <span style={{ fontSize: '11.5px', color: 'var(--ads-ink-pencil)' }}>
          Nothing mutates production state until an operator explicitly approves this ChangeSet.
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Button
            variant="danger"
            size="sm"
            iconLeft={<X size={12} />}
            onClick={onReject}
            disabled={decision === 'rejected'}
          >
            Hold / Reject
          </Button>
          <Button
            variant="primary"
            size="sm"
            iconLeft={<Check size={12} />}
            kbd="⌘↵"
            onClick={onApprove}
            disabled={decision === 'approved'}
          >
            Approve &amp; Execute
          </Button>
        </div>
      </div>
    </div>
  );
};
