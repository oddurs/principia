import React, { useState, useRef, useMemo } from 'react';
import katex from 'katex';
import { RotateCcw, Play, Pause, Copy, Check } from 'lucide-react';
import { useAcademicSystem, SYMBOL_SLOT_COLORS } from '../../core/registry';

/**
 * ============================================================================
 * L3: WOLFRAM-GRADE <Manipulate> & VERNIER CALIPER <Scrubber>
 * ============================================================================
 * - Inline in prose: renders via KaTeX Computer Modern upright numerals with
 *   a tactile dashed baseline rule.
 * - In UI inspector rows: renders as a rim-lit instrument readout chip with a
 *   live bottom fill-ratio gauge.
 * - While dragging: pops up a precision Vernier Caliper HUD with a tick reticle
 *   and gear indicator (1× Coarse | 0.1× Fine | 0.01× Vernier).
 */

export interface ScrubberProps {
  symbolId?: string;
  symbolLatex?: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (next: number) => void;
}

export const Scrubber: React.FC<ScrubberProps> = ({
  symbolId,
  symbolLatex,
  value,
  min,
  max,
  step = 0.01,
  unit,
  onChange,
}) => {
  const { symbols, activeSymbolId, hoverSymbol, togglePinSymbol } = useAcademicSystem();
  const [dragging, setDragging] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draftText, setDraftText] = useState('');
  const [gear, setGear] = useState<'1x' | '0.1x' | '0.01x'>('1x');
  const startPos = useRef<{ x: number; y: number; startVal: number }>({
    x: 0,
    y: 0,
    startVal: value,
  });

  const symDef = symbolId ? symbols[symbolId] : undefined;
  const slotColor = symDef ? SYMBOL_SLOT_COLORS[symDef.slot] : SYMBOL_SLOT_COLORS[2];
  const isActive = symbolId ? activeSymbolId === symbolId : false;

  const formattedVal = value.toFixed(gear === '0.01x' ? 4 : 2);
  const fillRatio = Math.max(0, Math.min(1, (value - min) / Math.max(1e-6, max - min)));

  // Render symbolLatex via KaTeX so \zeta and \omega_0 render as true TeX math
  const renderedSymbolHtml = useMemo(() => {
    if (!symbolLatex) return null;
    try {
      return katex.renderToString(`${symbolLatex} =`, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return `${symbolLatex} =`;
    }
  }, [symbolLatex]);

  const handlePointerDown = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (editing) return;
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setGear('1x');
    startPos.current = { x: e.clientX, y: e.clientY, startVal: value };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!dragging) return;
    const dx = e.clientX - startPos.current.x;
    const dy = Math.max(0, e.clientY - startPos.current.y);

    const currentGear = dy > 70 ? '0.01x' : dy > 30 ? '0.1x' : '1x';
    setGear(currentGear);

    const multiplier = currentGear === '0.01x' ? 0.01 : currentGear === '0.1x' ? 0.1 : 1;
    const sensitivity = ((max - min) / 180) * multiplier;
    const rawNext = startPos.current.startVal + dx * sensitivity;
    const effectiveStep = step * multiplier;
    const stepped = Math.round(rawNext / effectiveStep) * effectiveStep;
    const clamped = Math.min(max, Math.max(min, Number(stepped.toFixed(4))));
    onChange(clamped);
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLSpanElement>) => {
    if (!dragging) return;
    e.currentTarget.releasePointerCapture(e.pointerId);
    setDragging(false);
  };

  const commitEdit = () => {
    const parsed = parseFloat(draftText);
    if (!Number.isNaN(parsed)) {
      const clamped = Math.min(max, Math.max(min, Number(parsed.toFixed(4))));
      onChange(clamped);
    }
    setEditing(false);
  };

  const isProseInline = Boolean(symbolLatex);

  if (editing) {
    return (
      <input
        type="number"
        autoFocus
        step={step}
        min={min}
        max={max}
        value={draftText}
        onChange={(e) => setDraftText(e.target.value)}
        onBlur={commitEdit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            commitEdit();
          } else if (e.key === 'Escape') {
            e.preventDefault();
            setEditing(false);
          }
        }}
        style={{
          width: '62px',
          height: '20px',
          padding: '0 4px',
          borderRadius: '3.5px',
          border: `1.5px solid ${slotColor.fg}`,
          backgroundColor: '#FFFFFF',
          color: slotColor.fg,
          fontFamily: 'var(--ads-font-chrome, sans-serif)',
          fontVariantNumeric: 'tabular-nums',
          fontSize: '11.5px',
          fontWeight: 600,
          outline: 'none',
        }}
      />
    );
  }

  return (
    <span
      role="slider"
      tabIndex={0}
      aria-valuemin={min}
      aria-valuemax={max}
      aria-valuenow={value}
      data-symbol-id={symbolId}
      data-symbol-active={isActive ? 'true' : 'false'}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onMouseEnter={() => {
        setHovered(true);
        if (symbolId) hoverSymbol(symbolId);
      }}
      onMouseLeave={() => {
        setHovered(false);
        if (symbolId) hoverSymbol(null);
      }}
      onDoubleClick={(e) => {
        e.stopPropagation();
        if (e.shiftKey && symbolId) {
          togglePinSymbol(symbolId);
        } else {
          setDraftText(value.toString());
          setEditing(true);
        }
      }}
      onKeyDown={(e) => {
        const mult = e.shiftKey ? 10 : e.altKey ? 0.1 : 1;
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          onChange(Math.min(max, Number((value + step * mult).toFixed(4))));
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          onChange(Math.max(min, Number((value - step * mult).toFixed(4))));
        }
      }}
      className="ads-scrubber-token"
      style={{
        position: 'relative',
        display: isProseInline ? 'inline' : 'inline-flex',
        alignItems: isProseInline ? 'baseline' : 'center',
        verticalAlign: 'baseline',
        height: isProseInline ? undefined : '24px',
        padding: isProseInline ? '0 3px' : '0 8px',
        margin: isProseInline ? '0 0.04em' : '0',
        borderRadius: isProseInline ? '3px' : '4.5px',
        backgroundColor: isProseInline
          ? dragging || hovered || isActive
            ? slotColor.bg
            : 'transparent'
          : dragging || hovered || isActive
          ? slotColor.bg
          : '#FFFFFF',
        color: slotColor.fg,
        border: isProseInline
          ? 'none'
          : `1px solid ${
              dragging || hovered || isActive
                ? slotColor.border
                : 'oklch(0.89 0.006 82)'
            }`,
        borderBottom: isProseInline
          ? `1.25px ${dragging ? 'solid' : 'dashed'} ${slotColor.fg}`
          : undefined,
        boxShadow: isProseInline
          ? 'none'
          : 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 1.5px rgba(20,20,19,0.03)',
        fontFamily: isProseInline
          ? '"KaTeX_Main", var(--ads-font-prose, serif)'
          : 'var(--ads-font-chrome, "Inter", sans-serif)',
        fontSize: isProseInline ? '1em' : '12px',
        fontVariantNumeric: 'tabular-nums',
        fontWeight: 500,
        lineHeight: 1,
        cursor: 'ew-resize',
        userSelect: 'none',
        touchAction: 'none',
        transition: 'background-color 110ms ease, border-color 110ms ease',
      }}
      title="Drag horizontally to scrub (pull ↓ for 0.1× / 0.01× Vernier gear). Double-click to type an exact value."
    >
      {renderedSymbolHtml && (
        <span
          className="ads-math-inline"
          style={{ marginRight: '0.22222em', marginLeft: 0 }}
          dangerouslySetInnerHTML={{ __html: renderedSymbolHtml }}
        />
      )}

      <span>{formattedVal.replace('-', '−')}</span>

      {unit && (
        <span
          style={{
            marginLeft: '0.16667em',
            fontFamily: isProseInline
              ? '"KaTeX_Main", var(--ads-font-prose, serif)'
              : 'inherit',
            fontSize: isProseInline ? '0.94em' : '0.9em',
            fontWeight: 400,
            opacity: 0.82,
          }}
        >
          {unit}
        </span>
      )}

      {/* Miniature bottom fill-ratio gauge on UI scrubber chips */}
      {!isProseInline && (
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            left: '2px',
            right: '2px',
            bottom: '1px',
            height: '1.5px',
            borderRadius: '1px',
            backgroundColor: 'oklch(0.93 0.005 82)',
            overflow: 'hidden',
          }}
        >
          <span
            style={{
              display: 'block',
              width: `${(fillRatio * 100).toFixed(1)}%`,
              height: '100%',
              backgroundColor: slotColor.fg,
            }}
          />
        </span>
      )}

      {/* Signature Vernier Caliper HUD during active drag */}
      {dragging && (
        <span
          className="ads-ui"
          style={{
            position: 'absolute',
            bottom: 'calc(100% + 7px)',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--ads-ink-carbon, #141413)',
            color: '#ffffff',
            fontFamily: 'var(--ads-font-chrome, sans-serif)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: '10.5px',
            padding: '4px 8px',
            borderRadius: '4.5px',
            boxShadow: '0 6px 16px rgba(20, 20, 19, 0.22)',
            whiteSpace: 'nowrap',
            zIndex: 40,
            display: 'inline-flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '3px',
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: 'oklch(0.76 0.16 55)', fontWeight: 700 }}>{gear}</span>
            <span style={{ opacity: 0.85 }}>
              {gear === '1x' ? 'pull ↓ for fine' : 'VERNIER LOCK'}
            </span>
            <span style={{ color: 'oklch(0.72 0.01 80)', fontSize: '9.5px' }}>
              ({Math.round(fillRatio * 100)}%)
            </span>
          </span>
          {/* Miniature 9-tick vernier reticle with domain bounds */}
          <span
            aria-hidden="true"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '9px',
              color: 'oklch(0.70 0.01 80)',
            }}
          >
            <span>{min}</span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'flex-end',
                gap: '2.5px',
                height: '5px',
              }}
            >
              {[2, 3, 2, 3, 5, 3, 2, 3, 2].map((h, idx) => (
                <span
                  key={idx}
                  style={{
                    width: '1px',
                    height: `${h}px`,
                    backgroundColor: idx === 4 ? 'oklch(0.76 0.16 55)' : '#FFFFFF',
                  }}
                />
              ))}
            </span>
            <span>{max}</span>
          </span>
        </span>
      )}
    </span>
  );
};

export interface ManipulateParamConfig {
  id: string;
  symbolId?: string;
  symbolLabel: string;
  name: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  presets?: Array<{ label: string; value: number }>;
}

export interface ManipulateProps {
  title?: string;
  parameters: ManipulateParamConfig[];
  onChange: (id: string, value: number) => void;
  onReset: () => void;
  isPlaying?: boolean;
  onTogglePlay?: () => void;
  children: React.ReactNode;
}

export const Manipulate: React.FC<ManipulateProps> = ({
  parameters,
  onChange,
  onReset,
  isPlaying,
  onTogglePlay,
  children,
}) => {
  const { symbols, hoverSymbol } = useAcademicSystem();
  const [copiedState, setCopiedState] = useState(false);

  const stateRuleString = `{${parameters
    .map((p) => `${p.id} -> ${p.value.toFixed(2)}`)
    .join(', ')}}`;

  const handleCopyState = () => {
    navigator.clipboard?.writeText(stateRuleString);
    setCopiedState(true);
    window.setTimeout(() => setCopiedState(false), 1500);
  };

  return (
    <div>
      {/* Parametric Control Strip (Linear-grade compact toolbar well) */}
      <div
        className="ads-ui"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '10px 20px',
          padding: '10px 14px',
          marginBottom: '14px',
          borderRadius: '5px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          border: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
          boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
          fontSize: '12px',
        }}
      >
        <div
          style={{
            flex: 1,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '10px 22px',
          }}
        >
          {parameters.map((param) => {
            let symbolHtml = param.symbolLabel;
            try {
              symbolHtml = katex.renderToString(param.symbolLabel, {
                throwOnError: false,
                displayMode: false,
              });
            } catch {
              // fallback
            }

            const symDef = param.symbolId ? symbols[param.symbolId] : undefined;
            const slotColor = symDef
              ? SYMBOL_SLOT_COLORS[symDef.slot]
              : SYMBOL_SLOT_COLORS[2];
            const pct = Math.max(
              0,
              Math.min(
                100,
                ((param.value - param.min) / Math.max(1e-6, param.max - param.min)) * 100
              )
            );

            return (
              <div
                key={param.id}
                onMouseEnter={() => param.symbolId && hoverSymbol(param.symbolId)}
                onMouseLeave={() => param.symbolId && hoverSymbol(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '5px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <span style={{ color: 'var(--ads-ink-graphite, #4E4D49)', fontWeight: 500 }}>
                    <span
                      className="ads-math-inline"
                      style={{
                        color: 'var(--ads-ink-carbon, #141413)',
                        marginRight: '6px',
                        marginLeft: 0,
                      }}
                      dangerouslySetInnerHTML={{ __html: symbolHtml }}
                    />
                    {param.name}
                  </span>

                  <Scrubber
                    symbolId={param.symbolId}
                    value={param.value}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    unit={param.unit}
                    onChange={(v) => onChange(param.id, v)}
                  />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="range"
                    className="ads-range-slider"
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    value={param.value}
                    onChange={(e) => onChange(param.id, parseFloat(e.target.value))}
                    style={{
                      background: `linear-gradient(90deg, ${slotColor.fg} ${pct.toFixed(
                        1
                      )}%, oklch(0.90 0.006 82) ${pct.toFixed(1)}%)`,
                    }}
                  />

                  {param.presets && (
                    <div className="ads-pill-group" style={{ height: '20px' }}>
                      {param.presets.map((p) => {
                        const isPresetActive = Math.abs(param.value - p.value) < 0.01;
                        return (
                          <button
                            key={p.label}
                            type="button"
                            data-active={isPresetActive ? 'true' : 'false'}
                            className="ads-pill-btn"
                            onClick={() => onChange(param.id, p.value)}
                            style={{
                              height: '15px',
                              fontSize: '10px',
                              fontFamily: 'var(--ads-font-chrome)',
                              padding: '0 5px',
                            }}
                          >
                            {p.label.split(' ')[0]}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <button
            type="button"
            onClick={handleCopyState}
            title={`Copy Wolfram Rule state: ${stateRuleString}`}
            className="ads-btn-instrument"
            style={{ fontFamily: 'var(--ads-font-mono)', fontSize: '10px' }}
          >
            {copiedState ? <Check size={10} color="oklch(0.45 0.14 160)" /> : <Copy size={10} />}
            <span>{copiedState ? 'Copied' : stateRuleString}</span>
          </button>

          {onTogglePlay && (
            <button
              type="button"
              data-active={isPlaying ? 'true' : 'false'}
              className="ads-btn-instrument"
              onClick={onTogglePlay}
            >
              {isPlaying ? <Pause size={11} /> : <Play size={11} />}
              <span>{isPlaying ? 'Pause' : 'Sweep'}</span>
            </button>
          )}
          <button
            type="button"
            onClick={onReset}
            title="Reset parameters"
            className="ads-btn-instrument"
            style={{ width: '22px', padding: 0 }}
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      <div>{children}</div>
    </div>
  );
};
