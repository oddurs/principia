import React, { useState } from 'react';
import {
  Pin,
  Copy,
  Check,
  ExternalLink,
  CornerDownRight,
} from 'lucide-react';
import {
  useAcademicSystem,
  CitationEntry,
} from '../../core/registry';
import { InlineMath } from './MathAndFormal';

/**
 * ============================================================================
 * L3 PILLAR 3: CITATIONS, CROSS-REFERENCE LENSES & MARGIN SIDENOTES
 * ============================================================================
 * - <Cite> and <CrossRef> read like clean hyperref LaTeX links in prose.
 * - Hovering opens a frosted archival glass lens (.ads-floating-lens) with
 *   a seamless pointer hover-bridge, tracked eyebrow headers, and tactile
 *   .ads-btn-instrument actions (Pin, BibTeX copy, and Jump-with-Flash).
 */

export interface CitationCardProps {
  entry: CitationEntry;
  isPinned: boolean;
  onTogglePin: () => void;
  compact?: boolean;
}

export const CitationCard: React.FC<CitationCardProps> = ({
  entry,
  isPinned,
  onTogglePin,
  compact = false,
}) => {
  const [copiedBib, setCopiedBib] = useState(false);
  const [showBibSource, setShowBibSource] = useState(false);

  const handleCopyBib = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(entry.bibtex);
    setCopiedBib(true);
    setTimeout(() => setCopiedBib(false), 1500);
  };

  return (
    <div
      className={compact ? undefined : 'ads-floating-lens'}
      style={{
        backgroundColor: compact ? 'var(--ads-paper-plate, #FFFFFF)' : undefined,
        border: compact
          ? `1px solid ${
              isPinned
                ? 'oklch(0.78 0.08 255)'
                : 'var(--ads-ink-hairline, #E3E1DB)'
            }`
          : undefined,
        borderRadius: compact ? '6px' : undefined,
        padding: compact ? '10px 12px' : '12px 14px',
        fontFamily: 'var(--ads-font-chrome, Inter, sans-serif)',
        fontSize: '12px',
        lineHeight: 1.48,
        color: 'var(--ads-ink-carbon, #141413)',
        boxShadow: compact
          ? '0 1px 2px rgba(20, 20, 19, 0.025), inset 0 1px 0 rgba(255, 255, 255, 0.85)'
          : undefined,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '6px',
          paddingBottom: '6px',
          marginBottom: '6px',
          borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
        }}
      >
        <span
          className="ads-eyebrow-mono"
          style={{
            color: 'var(--ads-accent-reference, #1E56A0)',
            fontWeight: 600,
          }}
        >
          REF [{entry.number}] · {entry.year}
        </span>

        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <button
            type="button"
            data-active={isPinned ? 'true' : 'false'}
            className="ads-btn-instrument"
            onClick={(e) => {
              e.stopPropagation();
              onTogglePin();
            }}
            style={{ height: '19px', fontSize: '10px', padding: '0 6px' }}
          >
            <Pin size={9} />
            <span>{isPinned ? 'Pinned' : 'Pin'}</span>
          </button>

          <button
            type="button"
            data-active={showBibSource ? 'true' : 'false'}
            className="ads-btn-instrument"
            onClick={(e) => {
              e.stopPropagation();
              setShowBibSource((v) => !v);
            }}
            style={{ height: '19px', fontSize: '10px', padding: '0 6px' }}
            title="Inspect raw .bib entry"
          >
            <span>.bib</span>
          </button>

          <button
            type="button"
            className="ads-btn-instrument"
            onClick={handleCopyBib}
            style={{ height: '19px', fontSize: '10px', padding: '0 6px' }}
          >
            {copiedBib ? (
              <Check size={9} color="oklch(0.45 0.14 160)" />
            ) : (
              <Copy size={9} />
            )}
            <span>BibTeX</span>
          </button>
        </div>
      </div>

      <div
        style={{
          fontFamily: 'var(--ads-font-prose, serif)',
          fontSize: '14px',
          fontWeight: 600,
          color: 'var(--ads-ink-carbon, #141413)',
          marginBottom: '3px',
          lineHeight: 1.35,
        }}
      >
        {entry.title}
      </div>

      <div
        style={{
          fontSize: '11px',
          color: 'var(--ads-ink-pencil, #85837D)',
          marginBottom: '6px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <span style={{ fontWeight: 500, color: 'var(--ads-ink-graphite)' }}>
          {entry.authors}
        </span>
        <span>·</span>
        <span style={{ fontStyle: 'italic' }}>{entry.venue}</span>
        <span>·</span>
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '2px',
            fontFamily: 'var(--ads-font-chrome)',
            fontVariantNumeric: 'tabular-nums',
            fontSize: '10.5px',
          }}
        >
          {entry.doi} <ExternalLink size={9} />
        </span>
      </div>

      <div
        style={{
          fontSize: '11.5px',
          lineHeight: 1.48,
          color: 'var(--ads-ink-graphite, #4E4D49)',
        }}
      >
        {entry.tldr}
      </div>

      {showBibSource && (
        <pre
          onClick={(e) => e.stopPropagation()}
          style={{
            marginTop: '8px',
            marginBottom: 0,
            padding: '7px 9px',
            borderRadius: '4px',
            backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
            border: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
            fontFamily: 'var(--ads-font-mono)',
            fontSize: '10px',
            lineHeight: 1.42,
            color: 'var(--ads-ink-carbon, #141413)',
            overflowX: 'auto',
            whiteSpace: 'pre-wrap',
          }}
        >
          {entry.bibtex}
        </pre>
      )}
    </div>
  );
};

export interface CiteProps {
  id: string;
  mode?: 'numeric' | 'author-year';
}

export const Cite: React.FC<CiteProps> = ({ id, mode = 'numeric' }) => {
  const {
    citations,
    pinnedCitations,
    togglePinCitation,
    simulateTouch,
    setActiveTouchInspection,
  } = useAcademicSystem();
  const [hovered, setHovered] = useState(false);

  const entry = citations[id];
  if (!entry) return <span>[{id}]</span>;

  const isPinned = pinnedCitations.includes(id);
  const label =
    mode === 'numeric'
      ? `[${entry.number}]`
      : `(${entry.authors.split(',')[0]}, ${entry.year})`;

  return (
    <span
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => !simulateTouch && setHovered(true)}
      onMouseLeave={() => !simulateTouch && setHovered(false)}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          togglePinCitation(id);
          setActiveTouchInspection({ type: 'citation', id });
        }}
        style={{
          display: 'inline',
          padding: '0 2px',
          margin: 0,
          border: 'none',
          borderRadius: '2.5px',
          backgroundColor:
            isPinned || hovered ? 'oklch(0.95 0.025 255)' : 'transparent',
          color: 'var(--ads-accent-reference, #1E56A0)',
          fontFamily: 'inherit',
          fontVariantNumeric: 'lining-nums',
          fontSize: '0.96em',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background-color 100ms ease',
        }}
      >
        {label}
      </button>

      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingBottom: '7px',
            width: '332px',
            zIndex: 65,
            textAlign: 'left',
            fontStyle: 'normal',
            fontWeight: 400,
          }}
        >
          <CitationCard
            entry={entry}
            isPinned={isPinned}
            onTogglePin={() => togglePinCitation(id)}
          />
        </div>
      )}
    </span>
  );
};

export interface CrossRefProps {
  to: string;
}

export const CrossRef: React.FC<CrossRefProps> = ({ to }) => {
  const { crossRefs, simulateTouch, setActiveTouchInspection } =
    useAcademicSystem();
  const [hovered, setHovered] = useState(false);
  const [copiedCref, setCopiedCref] = useState(false);

  const target = crossRefs[to];
  if (!target) return <span>{to}</span>;

  const handleScrollToTarget = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setActiveTouchInspection({ type: 'crossref', id: to });
    const el = document.getElementById(to);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.classList.remove('ads-target-highlight');
      void el.offsetWidth;
      el.classList.add('ads-target-highlight');
    }
    setHovered(false);
  };

  const handleCopyCref = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(`\\cref{${target.id}}`);
    setCopiedCref(true);
    setTimeout(() => setCopiedCref(false), 1500);
  };

  return (
    <span
      style={{ position: 'relative', display: 'inline' }}
      onMouseEnter={() => !simulateTouch && setHovered(true)}
      onMouseLeave={() => !simulateTouch && setHovered(false)}
    >
      <button
        type="button"
        onClick={handleScrollToTarget}
        style={{
          display: 'inline',
          padding: '0 2px',
          border: 'none',
          borderRadius: '2px',
          borderBottom: '1px dotted oklch(0.65 0.12 255)',
          backgroundColor: hovered ? 'oklch(0.95 0.025 255)' : 'transparent',
          color: 'var(--ads-accent-reference, #1E56A0)',
          fontFamily: 'inherit',
          fontSize: '1em',
          fontWeight: 500,
          cursor: 'pointer',
          transition: 'background-color 100ms ease',
        }}
      >
        {target.number}
      </button>

      {hovered && (
        <div
          style={{
            position: 'absolute',
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            paddingBottom: '8px',
            width: '352px',
            zIndex: 65,
            textAlign: 'left',
            fontStyle: 'normal',
            fontWeight: 400,
          }}
        >
          <div
            className="ads-floating-lens"
            style={{
              padding: '12px 14px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '6px',
                marginBottom: '6px',
                borderBottom:
                  '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
              }}
            >
              <span
                className="ads-eyebrow-mono"
                style={{
                  color: 'var(--ads-accent-reference, #1E56A0)',
                  fontWeight: 600,
                }}
              >
                {target.number} · #{target.id}
              </span>

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                <button
                  type="button"
                  onClick={handleCopyCref}
                  className="ads-btn-instrument"
                  style={{ height: '19px', fontSize: '10px', padding: '0 6px' }}
                  title="Copy cleveref LaTeX macro"
                >
                  {copiedCref ? (
                    <Check size={9} color="oklch(0.45 0.14 160)" />
                  ) : (
                    <Copy size={9} />
                  )}
                  <span>\cref</span>
                </button>

                <button
                  type="button"
                  onClick={handleScrollToTarget}
                  className="ads-btn-instrument"
                  style={{ height: '19px', fontSize: '10px', padding: '0 6px' }}
                >
                  <CornerDownRight size={9} />
                  <span>Jump to §</span>
                </button>
              </div>
            </div>

            <div
              style={{
                fontFamily: 'var(--ads-font-prose, serif)',
                fontSize: '14.5px',
                fontWeight: 600,
                color: 'var(--ads-ink-carbon, #141413)',
                marginBottom: '4px',
              }}
            >
              {target.title}
            </div>

            <div
              style={{
                fontFamily: 'var(--ads-font-prose, serif)',
                fontSize: '13.5px',
                lineHeight: 1.5,
                color: 'var(--ads-ink-graphite, #4E4D49)',
              }}
            >
              {target.summary}
            </div>

            {target.latexOrPreview && (
              <div
                style={{
                  marginTop: '9px',
                  padding: '7px 10px',
                  borderRadius: '5px',
                  border:
                    '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
                  backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
                  fontSize: '13px',
                  overflowX: 'auto',
                }}
              >
                <InlineMath latex={target.latexOrPreview} />
              </div>
            )}
          </div>
        </div>
      )}
    </span>
  );
};

export interface SidenoteItem {
  id: string;
  number: number;
  title: string;
  content: React.ReactNode;
}

export interface MarginSidenoteColumnProps {
  sidenotes?: SidenoteItem[];
}

export const MarginSidenoteColumn: React.FC<MarginSidenoteColumnProps> = ({
  sidenotes = [],
}) => {
  const {
    citations,
    pinnedCitations,
    togglePinCitation,
    symbols,
    activeSymbolId,
    pinnedSymbolId,
    togglePinSymbol,
  } = useAcademicSystem();

  const activeSym = activeSymbolId ? symbols[activeSymbolId] : null;

  return (
    <aside
      aria-label="Margin Sidenotes and Pinned References"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        fontFamily: 'var(--ads-font-chrome, Inter, sans-serif)',
        fontSize: '13px',
      }}
    >
      {activeSym && (
        <div
          style={{
            padding: '12px 14px',
            borderRadius: '6px',
            backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
            border: '1px solid var(--ads-ink-hairline, #E3E1DB)',
            boxShadow:
              '0 1px 2.5px rgba(20, 20, 19, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.85)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '6px',
              marginBottom: '6px',
              borderBottom:
                '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
            }}
          >
            <span
              className="ads-eyebrow-mono"
              style={{
                color: 'var(--ads-accent-compute, #D63E18)',
                fontWeight: 600,
              }}
            >
              Active Symbol
            </span>
            {pinnedSymbolId === activeSym.id && (
              <button
                type="button"
                className="ads-btn-instrument"
                onClick={() => togglePinSymbol(activeSym.id)}
                style={{ height: '18px', fontSize: '10px', padding: '0 5px' }}
              >
                Unpin
              </button>
            )}
          </div>

          <div style={{ marginBottom: '4px' }}>
            <strong
              style={{
                fontFamily: 'var(--ads-font-prose, serif)',
                fontSize: '14.5px',
                color: 'var(--ads-ink-carbon, #141413)',
              }}
            >
              <InlineMath latex={activeSym.latex} /> — {activeSym.name}
            </strong>
          </div>

          <div
            style={{
              fontFamily: 'var(--ads-font-chrome)',
              fontSize: '11.5px',
              color: 'var(--ads-ink-pencil, #85837D)',
              marginBottom: '6px',
            }}
          >
            <InlineMath latex={activeSym.domain} />
          </div>

          <div
            style={{
              fontFamily: 'var(--ads-font-prose, serif)',
              fontSize: '13.5px',
              lineHeight: 1.5,
              color: 'var(--ads-ink-graphite, #4E4D49)',
            }}
          >
            {activeSym.description}
          </div>
        </div>
      )}

      {sidenotes.map((note) => (
        <div
          key={note.id}
          style={{
            paddingLeft: '12px',
            borderLeft: '1.5px solid var(--ads-ink-hairline, #E3E1DB)',
            fontFamily: 'var(--ads-font-prose, serif)',
            fontSize: '14px',
            lineHeight: 1.54,
            color: 'var(--ads-ink-graphite, #4E4D49)',
          }}
        >
          <div
            style={{
              fontFamily: 'var(--ads-font-chrome, Inter, sans-serif)',
              fontSize: '11.5px',
              fontWeight: 600,
              color: 'var(--ads-ink-carbon, #141413)',
              marginBottom: '3px',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--ads-font-chrome)',
                fontVariantNumeric: 'tabular-nums',
                fontSize: '10.5px',
                color: 'var(--ads-accent-compute)',
                marginRight: '4px',
              }}
            >
              [{note.number}]
            </span>
            {note.title}
          </div>
          {note.content}
        </div>
      ))}

      {pinnedCitations.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div className="ads-section-label">
            Pinned References ({pinnedCitations.length})
          </div>
          {pinnedCitations.map((cid) => {
            const entry = citations[cid];
            if (!entry) return null;
            return (
              <CitationCard
                key={cid}
                entry={entry}
                isPinned={true}
                onTogglePin={() => togglePinCitation(cid)}
                compact
              />
            );
          })}
        </div>
      )}
    </aside>
  );
};
