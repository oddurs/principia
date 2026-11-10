import React, { useMemo, useState } from 'react';
import katex from 'katex';
import { Copy, Check, ChevronDown, ChevronRight, Pin } from 'lucide-react';
import { useAcademicSystem, SYMBOL_SLOT_COLORS } from '../../core/registry';

/**
 * ============================================================================
 * L3 PILLAR 2: MATH & FORMAL LATEX ENVIRONMENTS (Authentic TeX Typography)
 * ============================================================================
 * - <Sym> & <InlineMath>: TeX \mathsurround (0.05em) optical spacing, zero
 *   vertical line-height expansion, 1:1 KaTeX_Main match, and in-place
 *   floating Symbol Definition & Dimensionality Lens (.ads-floating-lens).
 * - <EquationBlock>: \abovedisplayskip / \belowdisplayskip vertical rhythm
 *   with flush-right upright equation numbering (1.2), optional editorial
 *   caption, and hover-reveal TeX / Typst copy tools.
 * - <FormalBlock>: AMS-LaTeX (amsthm) run-in header (\textsc{Theorem 2.1} (Title).)
 *   followed by \enspace (0.55em), italic/roman body, and hover Copy TeX action.
 * - <ProofBlock>: AMS-LaTeX run-in italic header (\textit{Proof.}) + \enspace
 *   and flush-right Halmos Q.E.D. tombstone (∎).
 * - <AlgorithmBlock>: Publication algorithm2e grammar with 1-click LaTeX copy.
 */

export interface SymProps {
  id: string;
  math?: string;
  showLens?: boolean;
  children?: React.ReactNode;
}

export const Sym: React.FC<SymProps> = ({
  id,
  math,
  showLens = true,
  children,
}) => {
  const {
    symbols,
    activeSymbolId,
    pinnedSymbolId,
    hoverSymbol,
    togglePinSymbol,
    simulateTouch,
    setActiveTouchInspection,
  } = useAcademicSystem();

  const [lensOpen, setLensOpen] = useState(false);

  const def = symbols[id];
  const slotColor = def ? SYMBOL_SLOT_COLORS[def.slot] : SYMBOL_SLOT_COLORS[1];
  const isActive = activeSymbolId === id;
  const isPinned = pinnedSymbolId === id;

  const renderedMath = useMemo(() => {
    if (!math) return null;
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return math;
    }
  }, [math]);

  const renderedGlyph = useMemo(() => {
    if (!def) return null;
    try {
      return katex.renderToString(def.latex, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return def.latex;
    }
  }, [def]);

  const renderedDomain = useMemo(() => {
    if (!def) return null;
    try {
      return katex.renderToString(def.domain, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return def.domain;
    }
  }, [def]);

  return (
    <span
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => {
        if (!simulateTouch) {
          hoverSymbol(id);
          setLensOpen(true);
        }
      }}
      onMouseLeave={() => {
        if (!simulateTouch) {
          hoverSymbol(null);
          setLensOpen(false);
        }
      }}
    >
      <span
        data-symbol-id={id}
        data-symbol-active={isActive ? 'true' : 'false'}
        onClick={(e) => {
          e.stopPropagation();
          togglePinSymbol(id);
          setActiveTouchInspection({ type: 'symbol', id });
        }}
        style={{
          display: 'inline',
          padding: '0 2px',
          margin: '0 0.03em',
          borderRadius: '2.5px',
          backgroundColor: isActive || isPinned ? slotColor.bg : 'transparent',
          color: isActive || isPinned ? slotColor.fg : 'inherit',
          borderBottom: `1.25px ${
            isActive || isPinned ? 'solid' : 'dotted'
          } ${slotColor.border}`,
          mixBlendMode: 'multiply',
          cursor: 'pointer',
          transition: 'all 120ms ease',
        }}
      >
        {renderedMath ? (
          <span
            className="ads-math-inline"
            style={{ margin: 0 }}
            dangerouslySetInnerHTML={{ __html: renderedMath }}
          />
        ) : (
          children
        )}
      </span>

      {/* Floating Symbol Definition & Dimensionality Lens */}
      {showLens && lensOpen && def && (
        <span
          role="tooltip"
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingBottom: '7px',
            width: '286px',
            zIndex: 65,
            textAlign: 'left',
            fontStyle: 'normal',
            fontWeight: 400,
          }}
        >
          <span
            className="ads-floating-lens ads-ui"
            style={{
              display: 'block',
              padding: '10px 12px',
              fontSize: '11.5px',
              lineHeight: 1.45,
              color: 'var(--ads-ink-carbon, #141413)',
            }}
          >
            {/* Header Row: Slot Badge + Pin Button */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '5px',
                marginBottom: '6px',
                borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
              }}
            >
              <span
                className="ads-eyebrow-mono"
                style={{ color: slotColor.fg, fontWeight: 700, fontSize: '10px' }}
              >
                SLOT #{def.slot} · {slotColor.label.toUpperCase()}
              </span>
              <button
                type="button"
                data-active={isPinned ? 'true' : 'false'}
                className="ads-btn-instrument"
                onClick={(e) => {
                  e.stopPropagation();
                  togglePinSymbol(id);
                }}
                style={{ height: '18px', fontSize: '9.5px', padding: '0 6px' }}
              >
                <Pin size={9} />
                <span>{isPinned ? 'Pinned' : 'Pin Symbol'}</span>
              </button>
            </span>

            {/* Symbol Name & KaTeX Glyph */}
            <span
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                gap: '6px',
                marginBottom: '4px',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--ads-font-prose, serif)',
                  fontSize: '13.5px',
                  fontWeight: 600,
                  color: 'var(--ads-ink-carbon)',
                }}
              >
                { renderedGlyph && (
                  <span
                    className="ads-math-inline"
                    style={{ color: slotColor.fg, marginRight: '4px' }}
                    dangerouslySetInnerHTML={{ __html: renderedGlyph }}
                  />
                )}
                — {def.name}
              </span>
            </span>

            {/* Domain & Physical Unit */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '3px 7px',
                marginBottom: '6px',
                borderRadius: '4px',
                backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                border: '1px solid var(--ads-ink-whisper)',
                fontSize: '11px',
              }}
            >
              {renderedDomain && (
                <span
                  className="ads-math-inline"
                  dangerouslySetInnerHTML={{ __html: renderedDomain }}
                />
              )}
              {def.unit && (
                <span style={{ color: 'var(--ads-ink-pencil)', fontSize: '10.5px' }}>
                  [{def.unit}]
                </span>
              )}
            </span>

            {/* Description */}
            <span
              style={{
                display: 'block',
                fontSize: '11px',
                color: 'var(--ads-ink-graphite, #4E4D49)',
                marginBottom: '6px',
              }}
            >
              {def.description}
            </span>

            {/* Coupled Representations Footer */}
            <span
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '10px',
                color: 'var(--ads-ink-pencil)',
              }}
            >
              <span>Coupled in:</span>
              <span style={{ fontWeight: 500, color: 'var(--ads-ink-graphite)' }}>
                {def.usedIn.join(' · ')}
              </span>
            </span>
          </span>
        </span>
      )}
    </span>
  );
};

export interface InlineMathProps {
  latex: string;
  symbolId?: string;
}

export const InlineMath: React.FC<InlineMathProps> = ({ latex, symbolId }) => {
  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: false,
      });
    } catch {
      return latex;
    }
  }, [latex]);

  if (symbolId) {
    return <Sym id={symbolId} math={latex} />;
  }

  return (
    <span
      className="ads-math-inline"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export interface EquationBlockProps {
  id?: string;
  number?: string;
  latex: string;
  referencedSymbols?: string[];
  caption?: string;
}

// Convert LaTeX display math into clean, idiomatic Typst math syntax
function latexToTypst(tex: string): string {
  return tex
    .replace(/\\underbrace\{([^{}]+)\}_\{([^{}]+)\}/g, 'underbrace($1, $2)')
    .replace(/\\frac\{([^{}]+)\}\{([^{}]+)\}/g, '($1) / ($2)')
    .replace(/\\sqrt\{([^{}]+)\}/g, 'sqrt($1)')
    .replace(/\\mathcal\{([A-Z])\}/g, 'cal($1)')
    .replace(/\\dot\{([a-zA-Z])\}/g, 'dot($1)')
    .replace(/\\ddot\{([a-zA-Z])\}/g, 'dot.double($1)')
    .replace(/\\int_0\^t/g, 'integral_0^t')
    .replace(/\\implies/g, '==>')
    .replace(/\\le/g, '<=')
    .replace(/\\ge/g, '>=')
    .replace(/\\pm/g, 'plus.minus')
    .replace(/\\infty/g, 'oo')
    .replace(/\\zeta/g, 'zeta')
    .replace(/\\omega_0/g, 'omega_0')
    .replace(/\\tau/g, 'tau')
    .replace(/\\sin/g, 'sin')
    .replace(/\\cos/g, 'cos')
    .replace(/\\!|\\,|\\;/g, ' ')
    .replace(/\\left\(/g, '(')
    .replace(/\\right\)/g, ')');
}

export const EquationBlock: React.FC<EquationBlockProps> = ({
  id,
  number,
  latex,
  referencedSymbols = [],
  caption,
}) => {
  const {
    symbols,
    activeSymbolId,
    hoverSymbol,
    togglePinSymbol,
  } = useAcademicSystem();
  const [copiedMode, setCopiedMode] = useState<'tex' | 'typst' | null>(null);

  const html = useMemo(() => {
    try {
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: true,
      });
    } catch {
      return latex;
    }
  }, [latex]);

  const isHighlightedBySymbol =
    activeSymbolId !== null && referencedSymbols.includes(activeSymbolId);
  const activeSymDef = activeSymbolId ? symbols[activeSymbolId] : undefined;
  const activeColor = activeSymDef
    ? SYMBOL_SLOT_COLORS[activeSymDef.slot]
    : undefined;

  const handleCopy = (mode: 'tex' | 'typst') => {
    const out = mode === 'typst' ? `$ ${latexToTypst(latex)} $` : latex;
    navigator.clipboard?.writeText(out);
    setCopiedMode(mode);
    setTimeout(() => setCopiedMode(null), 1500);
  };

  return (
    <div
      id={id}
      className="ads-equation-container"
      style={{
        position: 'relative',
        margin: '16px 0',
        padding: '12px 16px',
        borderRadius: '6px',
        borderLeft: isHighlightedBySymbol
          ? `2.5px solid ${activeColor?.fg}`
          : '2.5px solid transparent',
        backgroundColor: isHighlightedBySymbol
          ? activeColor?.bg
          : 'transparent',
        transition: 'background-color 140ms ease, border-color 140ms ease',
      }}
    >
      <div className="ads-equation-layout">
        <div
          className="ads-math-display ads-equation-scroll"
          dangerouslySetInnerHTML={{ __html: html }}
        />

        {/* Classical LaTeX Equation Number (1.2) + Hover-Only Instrument Tools */}
        <div
          className="ads-equation-number"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: '"KaTeX_Main", var(--ads-font-prose, serif)',
            fontSize: '0.96em',
            fontStyle: 'normal',
            color: 'var(--ads-ink-carbon, #141413)',
            userSelect: 'none',
          }}
        >
          <div
            className="ads-equation-hover-tools ads-no-print ads-ui"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
            }}
          >
            {referencedSymbols.map((symId) => {
              const sym = symbols[symId];
              if (!sym) return null;
              const slot = SYMBOL_SLOT_COLORS[sym.slot];
              const isSymActive = activeSymbolId === symId;
              return (
                <button
                  key={symId}
                  type="button"
                  onMouseEnter={() => hoverSymbol(symId)}
                  onMouseLeave={() => hoverSymbol(null)}
                  onClick={() => togglePinSymbol(symId)}
                  title={`Highlight ${sym.name}`}
                  className="ads-btn-instrument"
                  style={{
                    height: '20px',
                    padding: '0 6px',
                    borderColor: isSymActive ? slot.border : undefined,
                    background: isSymActive ? slot.bg : undefined,
                    color: slot.fg,
                  }}
                >
                  <InlineMath latex={sym.latex} />
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => handleCopy('tex')}
              title="Copy LaTeX source"
              className="ads-btn-instrument"
              style={{ height: '20px', padding: '0 6px', fontSize: '10px' }}
            >
              {copiedMode === 'tex' ? (
                <Check size={10} color="oklch(0.45 0.14 160)" />
              ) : (
                <Copy size={10} />
              )}
              <span>TeX</span>
            </button>

            <button
              type="button"
              onClick={() => handleCopy('typst')}
              title="Copy Typst math source"
              className="ads-btn-instrument"
              style={{ height: '20px', padding: '0 6px', fontSize: '10px' }}
            >
              {copiedMode === 'typst' ? (
                <Check size={10} color="oklch(0.45 0.14 160)" />
              ) : (
                <Copy size={10} />
              )}
              <span>Typst</span>
            </button>
          </div>

          {number && <span>({number})</span>}
        </div>
      </div>

      {caption && (
        <div
          className="ads-ui"
          style={{
            marginTop: '6px',
            paddingTop: '5px',
            borderTop: '1px dashed var(--ads-ink-whisper, oklch(0.942 0.004 82))',
            fontSize: '11px',
            color: 'var(--ads-ink-pencil, #82807A)',
            textAlign: 'center',
          }}
        >
          {caption}
        </div>
      )}
    </div>
  );
};

export type FormalVariant =
  | 'theorem'
  | 'lemma'
  | 'proposition'
  | 'corollary'
  | 'definition'
  | 'remark';

export interface FormalBlockProps {
  id?: string;
  variant: FormalVariant;
  number: string;
  title?: string;
  children: React.ReactNode;
}

const VARIANT_LABELS: Record<FormalVariant, string> = {
  theorem: 'Theorem',
  lemma: 'Lemma',
  proposition: 'Proposition',
  corollary: 'Corollary',
  definition: 'Definition',
  remark: 'Remark',
};

export const FormalBlock: React.FC<FormalBlockProps> = ({
  id,
  variant,
  number,
  title,
  children,
}) => {
  const [copiedTex, setCopiedTex] = useState(false);

  const isItalicBody =
    variant === 'theorem' ||
    variant === 'lemma' ||
    variant === 'proposition' ||
    variant === 'corollary';

  const borderColor =
    variant === 'theorem' || variant === 'lemma' || variant === 'corollary'
      ? 'var(--ads-accent-reference, #1E56A0)'
      : variant === 'definition'
      ? 'var(--ads-accent-verified, oklch(0.48 0.13 160))'
      : 'var(--ads-ink-pencil, #82807A)';

  const handleCopyEnvTex = () => {
    const texSnippet = `\\begin{${variant}}${title ? `[${title}]` : ''}${
      id ? `\\label{${id}}` : ''
    }\n  % ${VARIANT_LABELS[variant]} ${number}\n\\end{${variant}}`;
    navigator.clipboard?.writeText(texSnippet);
    setCopiedTex(true);
    setTimeout(() => setCopiedTex(false), 1500);
  };

  return (
    <aside
      id={id}
      className="ads-prose ads-equation-container"
      style={{
        position: 'relative',
        margin: 'var(--ads-block-margin-y, 20px) 0',
        padding: '14px 18px',
        backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
        borderTop: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
        borderRight: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
        borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
        borderLeft: `3px solid ${borderColor}`,
        borderRadius: '0 6px 6px 0',
        boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
      }}
    >
      {/* Hover-only Formal Environment Copy & Label Bar */}
      <div
        className="ads-equation-hover-tools ads-no-print ads-ui"
        style={{
          position: 'absolute',
          top: '6px',
          right: '8px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '4px',
        }}
      >
        {id && (
          <code className="ads-inline-code" style={{ fontSize: '9.5px' }}>
            #{id}
          </code>
        )}
        <button
          type="button"
          onClick={handleCopyEnvTex}
          className="ads-btn-instrument"
          style={{ height: '19px', padding: '0 6px', fontSize: '10px' }}
          title={`Copy \\begin{${variant}} LaTeX template`}
        >
          {copiedTex ? (
            <Check size={9} color="oklch(0.45 0.14 160)" />
          ) : (
            <Copy size={9} />
          )}
          <span>TeX</span>
        </button>
      </div>

      {/* AMS-LaTeX (amsthm) Run-in Header: \textsc{Theorem 2.1} (Title).\enspace */}
      <span style={{ marginRight: '0.55em', fontStyle: 'normal' }}>
        <strong
          className="ads-smallcaps"
          style={{
            fontWeight: 700,
            color: 'var(--ads-ink-carbon, #141413)',
          }}
        >
          {VARIANT_LABELS[variant]} {number}
        </strong>
        {title && (
          <span
            style={{
              fontWeight: 500,
              color: 'var(--ads-ink-graphite, #4E4D49)',
            }}
          >
            {' '}
            ({title})
          </span>
        )}
        <strong style={{ fontWeight: 700 }}>.</strong>
      </span>

      <span style={{ fontStyle: isItalicBody ? 'italic' : 'normal' }}>
        {children}
      </span>
    </aside>
  );
};

export interface ProofBlockProps {
  title?: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}

export const ProofBlock: React.FC<ProofBlockProps> = ({
  title = 'Proof',
  defaultExpanded = true,
  children,
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [copiedProof, setCopiedProof] = useState(false);

  const handleCopyProofTex = (e: React.MouseEvent) => {
    e.stopPropagation();
    const tex = `\\begin{proof}[${title}]\n  % Formal AMS-LaTeX derivation\n\\end{proof}`;
    navigator.clipboard?.writeText(tex);
    setCopiedProof(true);
    setTimeout(() => setCopiedProof(false), 1500);
  };

  return (
    <div
      className="ads-prose ads-equation-container"
      style={{
        margin: '12px 0 6px 0',
        paddingLeft: '14px',
        borderLeft: '1.5px solid var(--ads-ink-hairline, #E4E2DC)',
      }}
    >
      {!expanded ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <button
            type="button"
            onClick={() => setExpanded(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              background: 'none',
              border: 'none',
              padding: 0,
              fontFamily: 'inherit',
              fontSize: '0.96em',
              fontStyle: 'italic',
              color: 'var(--ads-ink-graphite, #4E4D49)',
              cursor: 'pointer',
            }}
          >
            <ChevronRight size={13} />
            <span>{title}.</span>
          </button>

          <button
            type="button"
            onClick={() => setExpanded(true)}
            className="ads-btn-instrument"
            style={{ height: '19px', fontSize: '10px', padding: '0 6px' }}
          >
            <span>Expand proof · Q.E.D. ∎</span>
          </button>
        </div>
      ) : (
        <div style={{ position: 'relative' }}>
          {/* AMS-LaTeX Run-in Proof Header: \textit{Proof of Theorem 2.1.}\enspace */}
          <button
            type="button"
            onClick={() => setExpanded(false)}
            style={{
              display: 'inline',
              verticalAlign: 'baseline',
              background: 'none',
              border: 'none',
              padding: 0,
              marginRight: '0.5em',
              fontFamily: 'inherit',
              fontSize: '1em',
              fontStyle: 'italic',
              fontWeight: 500,
              color: 'var(--ads-ink-carbon, #141413)',
              cursor: 'pointer',
            }}
            title="Click to collapse proof"
          >
            <ChevronDown
              size={13}
              style={{
                display: 'inline',
                verticalAlign: '-0.12em',
                marginRight: '3px',
              }}
            />
            <span>{title}.</span>
          </button>
          <span>{children}</span>
          <span
            style={{
              float: 'right',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginLeft: '0.75em',
              lineHeight: 'inherit',
            }}
          >
            <button
              type="button"
              onClick={handleCopyProofTex}
              className="ads-equation-hover-tools ads-no-print ads-btn-instrument"
              style={{ height: '17px', padding: '0 5px', fontSize: '9.5px' }}
              title="Copy AMS-LaTeX proof environment"
            >
              {copiedProof ? (
                <Check size={8} color="oklch(0.45 0.14 160)" />
              ) : (
                <Copy size={8} />
              )}
              <span>TeX</span>
            </button>
            <span
              aria-label="Q.E.D."
              title="Quod Erat Demonstrandum"
              style={{
                fontSize: '0.85em',
                color: 'var(--ads-ink-graphite, #4E4D49)',
                userSelect: 'none',
              }}
            >
              ∎
            </span>
          </span>
          <div style={{ clear: 'both' }} />
        </div>
      )}
    </div>
  );
};

export interface AlgorithmLine {
  line: number;
  indent: number;
  content: React.ReactNode;
  comment?: string;
}

export interface AlgorithmBlockProps {
  number: string;
  title: string;
  requireText?: React.ReactNode;
  ensureText?: React.ReactNode;
  lines: AlgorithmLine[];
}

export const AlgorithmBlock: React.FC<AlgorithmBlockProps> = ({
  number,
  title,
  requireText,
  ensureText,
  lines,
}) => {
  const [copiedAlgo, setCopiedAlgo] = useState(false);
  const [activeStepLine, setActiveStepLine] = useState<number | null>(null);

  const handleCopyAlgo = () => {
    const tex = `\\begin{algorithm}[H]\n  \\caption{${title}}\n  \\label{alg:${number}}\n  % ${lines.length} steps\n\\end{algorithm}`;
    navigator.clipboard?.writeText(tex);
    setCopiedAlgo(true);
    setTimeout(() => setCopiedAlgo(false), 1500);
  };

  const handleAdvanceStep = () => {
    if (lines.length === 0) return;
    if (activeStepLine === null) {
      setActiveStepLine(lines[0].line);
      return;
    }
    const idx = lines.findIndex((l) => l.line === activeStepLine);
    if (idx === -1 || idx + 1 >= lines.length) {
      setActiveStepLine(null);
    } else {
      setActiveStepLine(lines[idx + 1].line);
    }
  };

  return (
    <div
      className="ads-prose ads-equation-container"
      style={{
        margin: 'var(--ads-block-margin-y, 16px) 0',
        backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
        borderTop: '0.08em solid var(--ads-ink-carbon, #141413)',
        borderBottom: '0.08em solid var(--ads-ink-carbon, #141413)',
        fontSize: '0.94em',
        lineHeight: 1.55,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
          padding: '6px 12px',
          borderBottom: '0.05em solid var(--ads-ink-carbon, #141413)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span>
            <strong className="ads-smallcaps" style={{ fontWeight: 700 }}>
              Algorithm {number}
            </strong>{' '}
            <span>{title}</span>
          </span>
          <span
            style={{
              fontFamily: 'var(--ads-font-chrome)',
              fontVariantNumeric: 'tabular-nums',
              fontSize: '10px',
              padding: '0 5px',
              borderRadius: '3px',
              backgroundColor: 'oklch(0.968 0.004 82)',
              border: '1px solid oklch(0.91 0.005 82)',
              color: 'var(--ads-ink-pencil, #82807A)',
            }}
            title="Asymptotic time complexity & symplectic order"
          >
            𝒪(N) · 2nd-order Symplectic
          </span>
        </div>

        <div
          className="ads-no-print"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
        >
          <button
            type="button"
            data-active={activeStepLine !== null ? 'true' : 'false'}
            onClick={handleAdvanceStep}
            className="ads-btn-instrument"
            style={{ height: '19px', padding: '0 6px', fontSize: '10px' }}
            title="Step through algorithm execution line-by-line"
          >
            <span>
              {activeStepLine === null ? 'Step ▸' : `Line ${activeStepLine} ▸`}
            </span>
          </button>

          {activeStepLine !== null && (
            <button
              type="button"
              onClick={() => setActiveStepLine(null)}
              className="ads-btn-instrument"
              style={{ height: '19px', padding: '0 5px', fontSize: '10px' }}
              title="Reset execution trace"
            >
              <span>Reset</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleCopyAlgo}
            className="ads-equation-hover-tools ads-btn-instrument"
            style={{ height: '19px', padding: '0 6px', fontSize: '10px' }}
            title="Copy algorithm2e LaTeX block"
          >
            {copiedAlgo ? (
              <Check size={9} color="oklch(0.45 0.14 160)" />
            ) : (
              <Copy size={9} />
            )}
            <span>TeX</span>
          </button>
        </div>
      </div>

      {(requireText || ensureText) && (
        <div
          style={{
            padding: '6px 12px',
            borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
            backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
            fontSize: '0.94em',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}
        >
          {requireText && (
            <div>
              <strong className="ads-smallcaps">Require: </strong>
              {requireText}
            </div>
          )}
          {ensureText && (
            <div>
              <strong className="ads-smallcaps">Ensure: </strong>
              {ensureText}
            </div>
          )}
        </div>
      )}

      <div style={{ padding: '6px 0' }}>
        {lines.map((item) => {
          const isCurrentStep = activeStepLine === item.line;
          return (
            <div
              key={item.line}
              onClick={() =>
                setActiveStepLine((curr) => (curr === item.line ? null : item.line))
              }
              style={{
                display: 'grid',
                gridTemplateColumns: '28px 1fr auto',
                alignItems: 'baseline',
                gap: '10px',
                padding: '2.5px 12px',
                cursor: 'pointer',
                backgroundColor: isCurrentStep
                  ? 'oklch(0.962 0.016 32 / 0.42)'
                  : 'transparent',
                borderLeft: isCurrentStep
                  ? '2px solid var(--ads-accent-compute, #D63E18)'
                  : '2px solid transparent',
                transition: 'background-color 90ms ease',
              }}
              title="Click line to inspect step"
            >
              <span
                style={{
                  fontFamily: 'var(--ads-font-chrome)',
                  fontSize: '10.5px',
                  fontWeight: isCurrentStep ? 700 : 400,
                  color: isCurrentStep
                    ? 'var(--ads-accent-compute, #D63E18)'
                    : 'var(--ads-ink-pencil, #82807A)',
                  textAlign: 'right',
                  fontVariantNumeric: 'tabular-nums',
                  userSelect: 'none',
                }}
              >
                {isCurrentStep ? `▸${item.line}` : item.line}
              </span>

              <div
                style={{
                  paddingLeft: `${item.indent * 1.25}rem`,
                  borderLeft:
                    item.indent > 0
                      ? '1px solid oklch(0.91 0.005 82)'
                      : 'none',
                }}
              >
                {item.content}
              </div>

              {item.comment && (
                <span
                  style={{
                    fontStyle: 'italic',
                    fontSize: '0.92em',
                    color: isCurrentStep
                      ? 'var(--ads-ink-graphite, #4E4D49)'
                      : 'var(--ads-ink-pencil, #82807A)',
                  }}
                >
                  ▷ {item.comment}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
