import React, { useState } from 'react';
import {
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useAcademicSystem, ChromingMode } from '../../core/registry';

/**
 * ============================================================================
 * L3: THE UNIVERSAL COMPUTABLE <Pod> PRIMITIVE (Principia Instrument Polish)
 * ============================================================================
 * Unites the Dual-Register Architecture with tactile Linear-grade surface
 * physics and signature Principia optical fiducial registration marks:
 *   - LEFT (Editorial Register): Calibrated section chip (§ 1) + optical-size
 *     Display Serif heading (.ads-section-heading).
 *   - RIGHT (Instrument Register): Tabular monospace cell prompt (Out[1]),
 *     illuminated epistemic domain badge (.ads-badge-domain), recessed
 *     segmented pill group (.ads-pill-group), and tactile instrument buttons.
 */

export type PodRepresentation = 'rendered' | 'latex' | 'typst' | 'symbolic-code';

function convertTexToTypst(tex: string): string {
  return tex
    .replace(/\\underbrace\{([^{}]+)\}_\{([^{}]+)\}/g, 'underbrace($1, $2)')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1) / ($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\int_0\^t/g, 'integral_0^t')
    .replace(/\\zeta/g, 'zeta')
    .replace(/\\omega_0/g, 'omega_0')
    .replace(/\\tau/g, 'tau')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\!|\\,|\\;/g, ' ')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')');
}

export interface PodAssumption {
  id: string;
  label: string;
  current: string;
  alternatives: string[];
}

export interface StepItem {
  stepNumber: number;
  title: string;
  justification: string;
  latex?: string;
  renderedContent?: React.ReactNode;
}

export interface PodProps {
  id?: string;
  title: string;
  subtitle?: string;
  domainTag?: 'SYMBOLIC' | 'EXACT' | 'NUMERICAL' | 'THEOREM' | 'EMPIRICAL' | 'AI-VERIFIED';
  cellLabel?: string;
  chromingOverride?: ChromingMode;
  assumptions?: PodAssumption[];
  onAssumptionChange?: (id: string, nextValue: string) => void;
  latexSource?: string;
  codeSource?: string;
  steps?: StepItem[];
  stepsLabel?: string;
  headerExtra?: React.ReactNode;
  children: React.ReactNode;
}

export const Pod: React.FC<PodProps> = ({
  id,
  title,
  subtitle,
  domainTag,
  cellLabel,
  chromingOverride,
  assumptions,
  onAssumptionChange,
  latexSource,
  codeSource,
  steps,
  stepsLabel = 'Steps',
  headerExtra,
  children,
}) => {
  const { chroming: globalChroming } = useAcademicSystem();
  const mode = chromingOverride ?? globalChroming;

  const [representation, setRepresentation] = useState<PodRepresentation>('rendered');
  const [stepsOpen, setStepsOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSteps, setCopiedSteps] = useState(false);
  const [selectedAssumptions, setSelectedAssumptions] = useState<Record<string, string>>(
    () => {
      const init: Record<string, string> = {};
      assumptions?.forEach((a) => {
        init[a.id] = a.current;
      });
      return init;
    }
  );

  const typstSource = latexSource ? `$ ${convertTexToTypst(latexSource)} $` : undefined;

  const handleCopy = () => {
    const textToCopy =
      representation === 'latex'
        ? latexSource || title
        : representation === 'typst'
        ? typstSource || title
        : representation === 'symbolic-code'
        ? codeSource || title
        : latexSource || codeSource || title;
    navigator.clipboard?.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  };

  const handleCopySteps = () => {
    if (!steps) return;
    const stepLog = steps
      .map((s) => `% Step ${s.stepNumber}: ${s.title}\n% ${s.justification}`)
      .join('\n\n');
    navigator.clipboard?.writeText(stepLog);
    setCopiedSteps(true);
    setTimeout(() => setCopiedSteps(false), 1600);
  };

  const isFramed = mode === 'framed';
  const isBracketed = mode === 'bracketed';
  const isSeamless = mode === 'seamless';

  const dotColor =
    domainTag === 'AI-VERIFIED' || domainTag === 'EXACT'
      ? 'oklch(0.52 0.14 160)'
      : domainTag === 'SYMBOLIC'
      ? 'oklch(0.56 0.19 32)'
      : 'oklch(0.48 0.15 255)';

  const dotGlow =
    domainTag === 'AI-VERIFIED' || domainTag === 'EXACT'
      ? 'oklch(0.52 0.14 160 / 0.18)'
      : domainTag === 'SYMBOLIC'
      ? 'oklch(0.56 0.19 32 / 0.18)'
      : 'oklch(0.48 0.15 255 / 0.18)';

  // Parse leading section numeral like "1. Exact Symbolic..." -> sectionNum="1", cleanTitle="Exact Symbolic..."
  const sectionMatch = title.match(/^(\d+)\.\s+(.*)$/);
  const sectionNum = sectionMatch ? sectionMatch[1] : null;
  const cleanTitle = sectionMatch ? sectionMatch[2] : title;

  return (
    <section
      id={id}
      data-mode={mode}
      className="ads-pod-container"
      style={{
        position: 'relative',
        backgroundColor: isSeamless
          ? 'transparent'
          : 'var(--ads-paper-plate, #FFFFFF)',
        border: isFramed
          ? '1px solid var(--ads-ink-hairline, #E4E2DC)'
          : isBracketed
          ? '1px solid oklch(0.91 0.005 82)'
          : 'none',
        borderRadius: isFramed ? 'var(--ads-pod-radius, 6px)' : '0px',
        marginBottom: 'var(--ads-pod-gap, 18px)',
        boxShadow: isFramed
          ? '0 1px 2.5px rgba(20, 20, 19, 0.028), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
          : 'none',
      }}
    >
      {/* Signature Principia Optical Fiducial Corner Ticks (Framed Mode) */}
      {isFramed && (
        <>
          <span
            aria-hidden="true"
            className="ads-pod-fiducial ads-no-print"
            style={{
              position: 'absolute',
              top: '-1px',
              left: '-1px',
              width: '5px',
              height: '5px',
              borderTop: '1.5px solid oklch(0.62 0.01 80)',
              borderLeft: '1.5px solid oklch(0.62 0.01 80)',
              borderTopLeftRadius: '2px',
              pointerEvents: 'none',
            }}
          />
          <span
            aria-hidden="true"
            className="ads-pod-fiducial ads-no-print"
            style={{
              position: 'absolute',
              top: '-1px',
              right: '-1px',
              width: '5px',
              height: '5px',
              borderTop: '1.5px solid oklch(0.62 0.01 80)',
              borderRight: '1.5px solid oklch(0.62 0.01 80)',
              borderTopRightRadius: '2px',
              pointerEvents: 'none',
            }}
          />
          <span
            aria-hidden="true"
            className="ads-pod-fiducial ads-no-print"
            style={{
              position: 'absolute',
              bottom: '-1px',
              left: '-1px',
              width: '5px',
              height: '5px',
              borderBottom: '1.5px solid oklch(0.62 0.01 80)',
              borderLeft: '1.5px solid oklch(0.62 0.01 80)',
              borderBottomLeftRadius: '2px',
              pointerEvents: 'none',
            }}
          />
          <span
            aria-hidden="true"
            className="ads-pod-fiducial ads-no-print"
            style={{
              position: 'absolute',
              bottom: '-1px',
              right: '-1px',
              width: '5px',
              height: '5px',
              borderBottom: '1.5px solid oklch(0.62 0.01 80)',
              borderRight: '1.5px solid oklch(0.62 0.01 80)',
              borderBottomRightRadius: '2px',
              pointerEvents: 'none',
            }}
          />
        </>
      )}

      {isBracketed && (
        <div
          aria-hidden="true"
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: '-7px',
            width: '4px',
            borderTop: '1.5px solid var(--ads-accent-compute, #D63E18)',
            borderRight: '1.5px solid var(--ads-accent-compute, #D63E18)',
            borderBottom: '1.5px solid var(--ads-accent-compute, #D63E18)',
          }}
        />
      )}

      {/* POD HEADER (Dual-Register: Editorial Serif Left × Precision Instrument Right) */}
      <header
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '42px',
          gap: '10px',
          padding: isSeamless
            ? '6px 0 10px 0'
            : '9px var(--ads-pod-padding-x, 24px)',
          background: isSeamless
            ? 'transparent'
            : 'linear-gradient(180deg, oklch(0.996 0.002 85) 0%, oklch(0.988 0.003 83) 100%)',
          borderTopLeftRadius: isFramed ? 'var(--ads-pod-radius, 8px)' : '0px',
          borderTopRightRadius: isFramed ? 'var(--ads-pod-radius, 8px)' : '0px',
          borderBottom: isSeamless
            ? '1px solid var(--ads-ink-hairline, #E4E2DC)'
            : '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minWidth: 0,
            flexWrap: 'wrap',
          }}
        >
          {sectionNum && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: '18px',
                padding: '0 5.5px',
                borderRadius: '3.5px',
                border: '1px solid oklch(0.90 0.015 32)',
                backgroundColor: 'oklch(0.985 0.008 32)',
                fontFamily: 'var(--ads-font-display)',
                fontStyle: 'italic',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--ads-accent-compute, #D63E18)',
                userSelect: 'none',
              }}
            >
              § {sectionNum}
            </span>
          )}

          <h3
            className="ads-section-heading"
            style={{
              margin: 0,
            }}
          >
            {cleanTitle}
          </h3>

          {subtitle && (
            <span
              className="ads-ui"
              style={{
                color: 'var(--ads-ink-pencil, #82807A)',
                fontSize: '12px',
                fontWeight: 400,
              }}
            >
              · {subtitle}
            </span>
          )}
        </div>

        {/* Right Header Actions (Instrument Register) */}
        <div
          className="ads-pod-header-actions ads-no-print ads-ui"
          style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}
        >
          {(isBracketed || cellLabel) && (
            <span
              style={{
                fontFamily: 'var(--ads-font-chrome)',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '10.5px',
                lineHeight: '18px',
                padding: '0 6px',
                borderRadius: '3.5px',
                border: '1px solid oklch(0.925 0.005 82)',
                backgroundColor: 'oklch(0.972 0.004 82)',
                color: 'var(--ads-ink-pencil, #82807A)',
                fontWeight: 500,
              }}
            >
              {cellLabel ?? 'Out[1]'}
            </span>
          )}

          {domainTag && (
            <span className="ads-badge-domain">
              <span
                style={{
                  width: '5px',
                  height: '5px',
                  borderRadius: '50%',
                  backgroundColor: dotColor,
                  boxShadow: `0 0 0 2px ${dotGlow}`,
                }}
              />
              {domainTag}
            </span>
          )}

          {headerExtra}

          {steps && steps.length > 0 && (
            <button
              type="button"
              onClick={() => setStepsOpen((o) => !o)}
              data-active={stepsOpen ? 'true' : 'false'}
              className="ads-btn-instrument ads-interactive-target"
            >
              {stepsOpen ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
              <span>
                {stepsLabel} ({steps.length})
              </span>
            </button>
          )}

          {(latexSource || codeSource) && (
            <div
              className="ads-pod-secondary-actions"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
            >
              <div
                role="group"
                aria-label="Pod representation mode"
                className="ads-pill-group"
              >
                {(
                  [
                    { id: 'rendered', label: 'Typeset', show: true },
                    { id: 'latex', label: 'TeX', show: Boolean(latexSource) },
                    { id: 'typst', label: 'Typst', show: Boolean(typstSource) },
                    { id: 'symbolic-code', label: 'Code', show: Boolean(codeSource) },
                  ] as const
                )
                  .filter((t) => t.show)
                  .map((tab) => {
                    const active = representation === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        data-active={active ? 'true' : 'false'}
                        className="ads-pill-btn"
                        onClick={() => {
                          setCollapsed(false);
                          setRepresentation(tab.id);
                        }}
                      >
                        {tab.label}
                      </button>
                    );
                  })}
              </div>

              <button
                type="button"
                onClick={handleCopy}
                title="Copy source"
                className="ads-btn-instrument"
                style={{ width: '22px', padding: 0 }}
              >
                {copied ? <Check size={11} color="oklch(0.45 0.14 160)" /> : <Copy size={11} />}
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand pod stage' : 'Collapse pod stage'}
            className="ads-btn-instrument ads-pod-secondary-actions"
            style={{ width: '22px', padding: 0 }}
          >
            {collapsed ? <ChevronRight size={11} /> : <ChevronDown size={11} />}
          </button>
        </div>
      </header>

      {/* ASSUMPTION BAR (28px compact mathematical turnstile strip) */}
      {assumptions && assumptions.length > 0 && (
        <div
          className="ads-ui"
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            minHeight: '28px',
            gap: '8px',
            padding: '4px var(--ads-pod-padding-x, 22px)',
            backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
            borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
            fontSize: '11.5px',
            lineHeight: '20px',
            color: 'var(--ads-ink-pencil, #82807A)',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--ads-font-chrome)',
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--ads-ink-graphite, #4E4D49)',
            }}
          >
            ⊢ Assuming
          </span>
          {assumptions.map((a) => {
            const activeVal = selectedAssumptions[a.id] ?? a.current;
            const allOptions = [a.current, ...a.alternatives.filter((x) => x !== a.current)];
            return (
              <div
                key={a.id}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  flexWrap: 'wrap',
                }}
              >
                <span style={{ fontSize: '11px' }}>{a.label} ∈</span>
                <div className="ads-pill-group" style={{ height: '20px' }}>
                  {allOptions.map((opt) => {
                    const isSelected = opt === activeVal;
                    return (
                      <button
                        key={opt}
                        type="button"
                        data-active={isSelected ? 'true' : 'false'}
                        className="ads-pill-btn"
                        onClick={() => {
                          setSelectedAssumptions((prev) => ({ ...prev, [a.id]: opt }));
                          onAssumptionChange?.(a.id, opt);
                        }}
                        style={{
                          height: '15px',
                          fontFamily: 'var(--ads-font-chrome)',
                          fontSize: '10.5px',
                          padding: '0 6px',
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* POD MAIN STAGE */}
      {!collapsed && (
        <div
          style={{
            padding: isSeamless
              ? '12px 0'
              : 'var(--ads-pod-padding-y, 16px) var(--ads-pod-padding-x, 18px)',
          }}
        >
          {representation === 'rendered' && children}

          {representation === 'latex' && (
            <pre
              style={{
                margin: 0,
                padding: '12px 14px',
                backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                borderRadius: '5px',
                border: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
                fontFamily: 'var(--ads-font-mono, JetBrains Mono, monospace)',
                fontSize: '12px',
                lineHeight: '20px',
                overflowX: 'auto',
                color: 'var(--ads-ink-carbon, #141413)',
              }}
            >
              <code>{latexSource}</code>
            </pre>
          )}

          {representation === 'typst' && (
            <pre
              style={{
                margin: 0,
                padding: '12px 14px',
                backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                borderRadius: '5px',
                border: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
                fontFamily: 'var(--ads-font-mono, JetBrains Mono, monospace)',
                fontSize: '12px',
                lineHeight: '20px',
                overflowX: 'auto',
                color: 'var(--ads-ink-carbon, #141413)',
              }}
            >
              <code>{typstSource}</code>
            </pre>
          )}

          {representation === 'symbolic-code' && (
            <pre
              style={{
                margin: 0,
                padding: '12px 14px',
                backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                borderRadius: '5px',
                border: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
                fontFamily: 'var(--ads-font-mono, JetBrains Mono, monospace)',
                fontSize: '12px',
                lineHeight: '20px',
                overflowX: 'auto',
                color: 'var(--ads-ink-carbon, #141413)',
              }}
            >
              <code>{codeSource}</code>
            </pre>
          )}
        </div>
      )}

      {/* STEP-BY-STEP DERIVATION DRAWER (Vertical Timeline Spine) */}
      {!collapsed && stepsOpen && steps && steps.length > 0 && (
        <div
          style={{
            borderTop: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
            backgroundColor: 'var(--ads-paper-canvas, #FBF9F6)',
            padding: '12px var(--ads-pod-padding-x, 18px)',
          }}
        >
          <div
            className="ads-ui"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--ads-ink-graphite, #4E4D49)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Sparkles size={12} color="var(--ads-accent-compute, #D63E18)" />
              <span>Symbolic Derivation Trace</span>
            </span>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <span className="ads-badge-domain">CAS VERIFIED · SYMPY 1.13</span>
              <button
                type="button"
                onClick={handleCopySteps}
                className="ads-btn-instrument"
                style={{ height: '20px', fontSize: '10px', padding: '0 6px' }}
              >
                {copiedSteps ? <Check size={9} /> : <Copy size={9} />}
                <span>{copiedSteps ? 'Copied Trace' : 'Copy Trace'}</span>
              </button>
            </div>
          </div>

          <ol
            style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
            }}
          >
            {steps.map((step, idx) => (
              <li
                key={step.stepNumber}
                style={{
                  position: 'relative',
                  display: 'grid',
                  gridTemplateColumns: '26px 1fr',
                  gap: '10px',
                  paddingBottom: idx < steps.length - 1 ? '10px' : '0',
                }}
              >
                {/* Connecting vertical timeline hairline */}
                {idx < steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    style={{
                      position: 'absolute',
                      top: '22px',
                      bottom: 0,
                      left: '11px',
                      width: '1px',
                      backgroundColor: 'var(--ads-ink-hairline, #E4E2DC)',
                    }}
                  />
                )}
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '22px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
                    backgroundColor: '#FFFFFF',
                    fontFamily: 'var(--ads-font-chrome)',
                    fontVariantNumeric: 'tabular-nums',
                    fontSize: '10.5px',
                    fontWeight: 600,
                    color: 'var(--ads-ink-graphite, #4E4D49)',
                  }}
                >
                  {step.stepNumber}
                </span>
                <div>
                  <div
                    className="ads-ui"
                    style={{
                      fontSize: '12.5px',
                      fontWeight: 600,
                      color: 'var(--ads-ink-carbon, #141413)',
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    className="ads-prose"
                    style={{
                      fontSize: '14.5px',
                      lineHeight: 1.55,
                      color: 'var(--ads-ink-graphite, #4E4D49)',
                      marginTop: '2px',
                    }}
                  >
                    {step.justification}
                  </div>
                  {step.renderedContent && (
                    <div style={{ marginTop: '8px' }}>{step.renderedContent}</div>
                  )}
                </div>
              </li>
            ))}
          </ol>
        </div>
      )}
    </section>
  );
};
