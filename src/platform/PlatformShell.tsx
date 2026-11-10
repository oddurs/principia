import React, { useState, useEffect } from 'react';
import {
  Compass,
  BookOpen,
  Layers,
  Cpu,
  Search,
  AlignJustify,
} from 'lucide-react';
import {
  useAcademicSystem,
  SYMBOL_SLOT_COLORS,
} from '../core/registry';
import {
  PlatformRoute,
  PlatformSection,
  DocPageId,
  StoryComponentId,
  PrototypeAppId,
  DEFAULT_ROUTE,
  parseHashRoute,
  buildHashUrl,
} from './navigation';
import { MarketingLandingPage } from './MarketingLandingPage';
import { DocsPortalPage } from './DocsPortalPage';
import { StorybookPage } from './StorybookPage';
import { PrincipiaApp } from '../app/PrincipiaApp';
import { CodexApp } from '../codex/CodexApp';
import {
  EvalBenchPrototype,
  MeridianQuantPrototype,
  HelixBioMedPrototype,
} from '../prototypes/DomainPrototypes';
import { InlineMath } from '../primitives/manuscript/MathAndFormal';

export const PlatformShell: React.FC = () => {
  const {
    symbols,
    activeSymbolId,
    pinnedSymbolId,
    hoverSymbol,
    togglePinSymbol,
    density,
    material,
    voice,
    xrayBaseline,
    setXrayBaseline,
  } = useAcademicSystem();

  const [route, setRoute] = useState<PlatformRoute>(() =>
    typeof window !== 'undefined'
      ? parseHashRoute(window.location.hash, DEFAULT_ROUTE)
      : DEFAULT_ROUTE
  );

  const [cmdOpen, setCmdOpen] = useState<boolean>(false);
  const [cmdQuery, setCmdQuery] = useState<string>('');

  // Synchronize URL hash <-> React route state
  useEffect(() => {
    const onHashChange = () => {
      setRoute((prev) => parseHashRoute(window.location.hash, prev));
    };
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const navigate = (next: Partial<PlatformRoute> & { section: PlatformSection }) => {
    setRoute((prev) => {
      const merged: PlatformRoute = { ...prev, ...next };
      const hash = buildHashUrl(merged);
      if (typeof window !== 'undefined' && window.location.hash !== hash) {
        window.history.pushState(null, '', hash);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return merged;
    });
  };

  // Global ⌘K Omnisearch keyboard shortcut
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setCmdOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setCmdOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  // Root CSS Custom Properties for Marketing, Docs & Storybook shells
  const dynamicRootVars: React.CSSProperties = {
    '--ads-title-size':
      density === 'manuscript' ? '34px' : density === 'workbench' ? '28px' : '24px',
    '--ads-heading-size':
      density === 'manuscript' ? '20px' : density === 'workbench' ? '18px' : '16px',
    '--ads-prose-size':
      density === 'manuscript' ? '17.5px' : density === 'workbench' ? '16px' : '14.5px',
    '--ads-prose-lh':
      density === 'manuscript' ? '1.68' : density === 'workbench' ? '1.62' : '1.56',
    '--ads-secondary-prose-size':
      density === 'manuscript' ? '15px' : density === 'workbench' ? '14px' : '13px',
    '--ads-baseline-step':
      density === 'manuscript' ? '29px' : density === 'workbench' ? '26px' : '23px',
    '--ads-pod-padding-y':
      density === 'manuscript' ? '24px' : density === 'workbench' ? '20px' : '14px',
    '--ads-pod-padding-x':
      density === 'manuscript' ? '28px' : density === 'workbench' ? '24px' : '18px',
    '--ads-pod-gap':
      density === 'manuscript' ? '22px' : density === 'workbench' ? '18px' : '14px',
    '--ads-block-margin-y':
      density === 'manuscript' ? '20px' : density === 'workbench' ? '16px' : '12px',
    '--ads-paper-desk':
      material === 'swiss-lab'
        ? 'oklch(0.968 0.002 250)'
        : material === 'oxford-monograph'
        ? 'oklch(0.945 0.011 78)'
        : 'oklch(0.964 0.004 82)',
    '--ads-paper-canvas':
      material === 'swiss-lab'
        ? 'oklch(0.990 0.001 250)'
        : material === 'oxford-monograph'
        ? 'oklch(0.978 0.008 80)'
        : 'oklch(0.986 0.003 85)',
    '--ads-paper-plate':
      material === 'oxford-monograph' ? 'oklch(0.994 0.004 82)' : '#FFFFFF',
    '--ads-paper-well':
      material === 'swiss-lab'
        ? 'oklch(0.976 0.002 250)'
        : material === 'oxford-monograph'
        ? 'oklch(0.960 0.009 79)'
        : 'oklch(0.974 0.004 83)',
    '--ads-font-display':
      voice === 'neo-grotesque'
        ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
        : '"Newsreader", "STIX Two Text", Georgia, serif',
    '--ads-font-prose':
      voice === 'neo-grotesque'
        ? '"Inter", -apple-system, BlinkMacSystemFont, sans-serif'
        : '"Newsreader", "STIX Two Text", Georgia, serif',
    '--ads-font-chrome':
      '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    '--ads-font-mono': '"JetBrains Mono", monospace',
  } as React.CSSProperties;

  const q = cmdQuery.trim().toLowerCase();

  const CMD_DESTINATIONS: Array<{
    id: string;
    category: 'Platform & Prototypes' | 'Documentation' | 'Storybook Components';
    label: string;
    detail: string;
    onTrigger: () => void;
  }> = [
    {
      id: 'nav-overview',
      category: 'Platform & Prototypes',
      label: 'Overview & Vision Landing Page',
      detail: '#/overview',
      onTrigger: () => navigate({ section: 'overview' }),
    },
    {
      id: 'proto-ai-evals',
      category: 'Platform & Prototypes',
      label: 'Concept 1 · EvalBench — AI Model & Verifier Observatory',
      detail: '#/prototypes/ai-evals',
      onTrigger: () => navigate({ section: 'prototypes', prototypeId: 'ai-evals' }),
    },
    {
      id: 'proto-quant-macro',
      category: 'Platform & Prototypes',
      label: 'Concept 2 · Meridian — Quant Macro & Risk Terminal',
      detail: '#/prototypes/quant-macro',
      onTrigger: () => navigate({ section: 'prototypes', prototypeId: 'quant-macro' }),
    },
    {
      id: 'proto-biomed-trials',
      category: 'Platform & Prototypes',
      label: 'Concept 3 · Helix — Clinical Trials & Biostatistics',
      detail: '#/prototypes/biomed-trials',
      onTrigger: () => navigate({ section: 'prototypes', prototypeId: 'biomed-trials' }),
    },
    {
      id: 'proto-principia',
      category: 'Platform & Prototypes',
      label: 'Concept 4 · Principia — Dynamical Systems & Physics Studio',
      detail: '#/prototypes/principia',
      onTrigger: () => navigate({ section: 'prototypes', prototypeId: 'principia' }),
    },
    {
      id: 'proto-wolfram',
      category: 'Platform & Prototypes',
      label: 'Concept 5 · The Codex — Symbolic CAS, Monograph & Notebook',
      detail: '#/prototypes/wolfram',
      onTrigger: () => navigate({ section: 'prototypes', prototypeId: 'wolfram' }),
    },
    {
      id: 'doc-start',
      category: 'Documentation',
      label: '01 · Architecture & Getting Started',
      detail: '#/docs/getting-started',
      onTrigger: () => navigate({ section: 'docs', docPage: 'getting-started' }),
    },
    {
      id: 'doc-type',
      category: 'Documentation',
      label: '02 · Dual-Register Typography & Optical Scale',
      detail: '#/docs/typography',
      onTrigger: () => navigate({ section: 'docs', docPage: 'typography' }),
    },
    {
      id: 'doc-color',
      category: 'Documentation',
      label: '03 · OKLCH Paper, Carbon Ink & Symbol Palette',
      detail: '#/docs/colors-materiality',
      onTrigger: () => navigate({ section: 'docs', docPage: 'colors-materiality' }),
    },
    {
      id: 'doc-grid',
      category: 'Documentation',
      label: '04 · 4px Sub-Grid & Tactile Hardware Chrome',
      detail: '#/docs/grid-hardware',
      onTrigger: () => navigate({ section: 'docs', docPage: 'grid-hardware' }),
    },
    {
      id: 'doc-math',
      category: 'Documentation',
      label: '05 · Mathematical & Formal Grammar',
      detail: '#/docs/math-formal',
      onTrigger: () => navigate({ section: 'docs', docPage: 'math-formal' }),
    },
    {
      id: 'doc-vis',
      category: 'Documentation',
      label: '06 · Scientific DataVis & Booktabs Tables',
      detail: '#/docs/datavis-booktabs',
      onTrigger: () => navigate({ section: 'docs', docPage: 'datavis-booktabs' }),
    },
    {
      id: 'story-buttons',
      category: 'Storybook Components',
      label: '01 · Buttons, Segments & Badges (Generalist Foundation)',
      detail: '#/storybook/buttons-badges',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'buttons-badges' }),
    },
    {
      id: 'story-forms',
      category: 'Storybook Components',
      label: '02 · Inputs, Selects & Form Controls',
      detail: '#/storybook/forms-inputs',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'forms-inputs' }),
    },
    {
      id: 'story-cards',
      category: 'Storybook Components',
      label: '03 · Cards, Metrics, Callouts & Tabs',
      detail: '#/storybook/cards-surfaces',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'cards-surfaces' }),
    },
    {
      id: 'story-datatable',
      category: 'Storybook Components',
      label: '04 · Universal DataTable (Any Dataset)',
      detail: '#/storybook/general-datatable',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'general-datatable' }),
    },
    {
      id: 'story-pod',
      category: 'Storybook Components',
      label: '05 · Computational Pod — Universal Container',
      detail: '#/storybook/pod',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'pod' }),
    },
    {
      id: 'story-manip',
      category: 'Storybook Components',
      label: '06 · Manipulate & Vernier Scrubber',
      detail: '#/storybook/manipulate-scrubber',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'manipulate-scrubber' }),
    },
    {
      id: 'story-eq',
      category: 'Storybook Components',
      label: '07 · Display Equations & Symbols (TeX & Typst)',
      detail: '#/storybook/equation-block',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'equation-block' }),
    },
    {
      id: 'story-plot',
      category: 'Storybook Components',
      label: '11 · Scientific Plotting Suite — DataVis Engine',
      detail: '#/storybook/scientific-plot',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'scientific-plot' }),
    },
    {
      id: 'story-table',
      category: 'Storybook Components',
      label: '13 · Booktabs Publication Table',
      detail: '#/storybook/booktabs-table',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'booktabs-table' }),
    },
    {
      id: 'story-cite',
      category: 'Storybook Components',
      label: '10 · Citations & Reference Lenses',
      detail: '#/storybook/citations-crossref',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'citations-crossref' }),
    },
    {
      id: 'story-code',
      category: 'Storybook Components',
      label: '15 · Notebook Code Cell & AI Copilot',
      detail: '#/storybook/code-cell',
      onTrigger: () => navigate({ section: 'storybook', storyId: 'code-cell' }),
    },
  ];

  const filteredDestinations = CMD_DESTINATIONS.filter(
    (d) =>
      !q ||
      d.label.toLowerCase().includes(q) ||
      d.category.toLowerCase().includes(q) ||
      d.detail.toLowerCase().includes(q)
  );

  const filteredSymbols = Object.values(symbols).filter(
    (s) =>
      !q ||
      s.id.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q)
  );

  return (
    <div
      data-xray-baseline={xrayBaseline ? 'true' : 'false'}
      style={{
        ...dynamicRootVars,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--ads-paper-desk, #F5F3EE)',
        color: 'var(--ads-ink-carbon, #141413)',
      }}
    >
      {/* ====================================================================
          PERSISTENT 52PX GLOBAL PLATFORM NAVIGATION BAR
          ==================================================================== */}
      <nav
        aria-label="Global Platform Navigation"
        className="ads-no-print ads-ui"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          height: '52px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          padding: '0 24px',
          backgroundColor: 'oklch(1 0 0 / 0.95)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          fontSize: '12.5px',
        }}
      >
        {/* Left: Brand Crest & Version */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            type="button"
            onClick={() => navigate({ section: 'overview' })}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              border: 'none',
              background: 'none',
              padding: '4px 6px',
              cursor: 'pointer',
              color: 'var(--ads-ink-carbon, #141413)',
            }}
            title="Return to Platform Overview (#/overview)"
          >
            <img
              src="/favicon.png"
              alt="Principia"
              width={18}
              height={18}
              style={{ display: 'block', userSelect: 'none' }}
            />
            <span style={{ fontWeight: 700, fontSize: '14px', letterSpacing: '-0.015em' }}>
              Principia
            </span>
            <span
              style={{
                fontSize: '12px',
                color: 'var(--ads-ink-pencil, #82807A)',
                fontWeight: 500,
              }}
            >
              @principia/core
            </span>
          </button>

          <span className="ads-badge-domain" style={{ height: '20px', fontSize: '10px' }}>
            v2.4
          </span>
        </div>

        {/* Center: Primary 4-Destination Platform Switcher */}
        <div
          role="tablist"
          aria-label="Platform Sections"
          className="ads-pill-group"
          style={{ height: '32px', padding: '3px' }}
        >
          {(
            [
              {
                id: 'overview' as PlatformSection,
                label: 'Overview',
                icon: <Compass size={12} />,
              },
              {
                id: 'docs' as PlatformSection,
                label: 'Documentation',
                icon: <BookOpen size={12} />,
              },
              {
                id: 'storybook' as PlatformSection,
                label: 'Storybook (16)',
                icon: <Layers size={12} />,
              },
              {
                id: 'prototypes' as PlatformSection,
                label: 'App Concepts (5)',
                icon: <Cpu size={12} />,
              },
            ] as const
          ).map((tab) => {
            const active = route.section === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={active}
                type="button"
                data-active={active ? 'true' : 'false'}
                className="ads-pill-btn"
                onClick={() => navigate({ section: tab.id })}
                style={{ height: '24px', padding: '0 12px', fontSize: '12px' }}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Prototype Sub-Switcher + 1rlh Laser + Global ⌘K Omnisearch */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Instant Prototype Switcher when inside Prototypes */}
          {route.section === 'prototypes' && (
            <div className="ads-pill-group" style={{ height: '30px', padding: '2.5px' }}>
              {(
                [
                  { id: 'ai-evals' as PrototypeAppId, label: 'EvalBench (AI)' },
                  { id: 'quant-macro' as PrototypeAppId, label: 'Meridian (Quant)' },
                  { id: 'biomed-trials' as PrototypeAppId, label: 'Helix (BioMed)' },
                  { id: 'principia' as PrototypeAppId, label: 'Principia (Physics)' },
                  { id: 'wolfram' as PrototypeAppId, label: 'Codex (CAS/IDE)' },
                ] as const
              ).map((p) => {
                const isSelected =
                  route.prototypeId === p.id ||
                  (p.id === 'wolfram' &&
                    (route.prototypeId === 'monograph' ||
                      route.prototypeId === 'notebook'));
                return (
                  <button
                    key={p.id}
                    type="button"
                    data-active={isSelected ? 'true' : 'false'}
                    className="ads-pill-btn"
                    onClick={() =>
                      navigate({ section: 'prototypes', prototypeId: p.id })
                    }
                    style={{ height: '23px', fontSize: '11.5px', padding: '0 9px' }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          )}

          <button
            type="button"
            data-active={xrayBaseline ? 'true' : 'false'}
            onClick={() => setXrayBaseline(!xrayBaseline)}
            className="ads-btn-instrument"
            style={{ height: '28px', padding: '0 10px' }}
            title="Toggle 1rlh Cyan Baseline Rhythm Laser"
          >
            <AlignJustify size={12} />
            <span>1rlh</span>
          </button>

          <button
            type="button"
            onClick={() => setCmdOpen(true)}
            className="ads-btn-instrument"
            style={{ height: '28px', padding: '0 10px', gap: '6px' }}
            title="Open Global Omnisearch & Symbol Palette (⌘K)"
          >
            <Search size={12} />
            <span style={{ color: 'var(--ads-ink-pencil)' }}>Omnisearch</span>
            <span className="ads-kbd" style={{ height: '17px', fontSize: '10px' }}>
              ⌘K
            </span>
          </button>
        </div>
      </nav>

      {/* ====================================================================
          ACTIVE PLATFORM WORKSPACE DESTINATION
          ==================================================================== */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {route.section === 'overview' && (
          <MarketingLandingPage
            onNavigateDoc={(doc: DocPageId) =>
              navigate({ section: 'docs', docPage: doc })
            }
            onNavigateStory={(story: StoryComponentId) =>
              navigate({ section: 'storybook', storyId: story })
            }
            onNavigatePrototype={(proto: PrototypeAppId) =>
              navigate({ section: 'prototypes', prototypeId: proto })
            }
          />
        )}

        {route.section === 'docs' && (
          <DocsPortalPage
            activeDoc={route.docPage}
            onSelectDoc={(doc: DocPageId) =>
              navigate({ section: 'docs', docPage: doc })
            }
            onNavigateStory={(story: StoryComponentId) =>
              navigate({ section: 'storybook', storyId: story })
            }
            onNavigatePrototype={(proto: PrototypeAppId) =>
              navigate({ section: 'prototypes', prototypeId: proto })
            }
          />
        )}

        {route.section === 'storybook' && (
          <StorybookPage
            activeStory={route.storyId}
            onSelectStory={(story: StoryComponentId) =>
              navigate({ section: 'storybook', storyId: story })
            }
          />
        )}

        {route.section === 'prototypes' && (
          <>
            {route.prototypeId === 'ai-evals' && <EvalBenchPrototype />}

            {route.prototypeId === 'quant-macro' && <MeridianQuantPrototype />}

            {route.prototypeId === 'biomed-trials' && <HelixBioMedPrototype />}

            {route.prototypeId === 'principia' && (
              <PrincipiaApp
                embeddedInPlatform
                onOpenCodexStorybook={() =>
                  navigate({ section: 'storybook', storyId: 'buttons-badges' })
                }
              />
            )}

            {route.prototypeId === 'wolfram' && (
              <CodexApp
                embeddedInPlatform
                initialArchetype="wolfram-engine"
                onBackToPrincipia={() =>
                  navigate({ section: 'prototypes', prototypeId: 'principia' })
                }
              />
            )}

            {route.prototypeId === 'monograph' && (
              <CodexApp
                embeddedInPlatform
                initialArchetype="latex-monograph"
                onBackToPrincipia={() =>
                  navigate({ section: 'prototypes', prototypeId: 'principia' })
                }
              />
            )}

            {route.prototypeId === 'notebook' && (
              <CodexApp
                embeddedInPlatform
                initialArchetype="notebook-ide"
                onBackToPrincipia={() =>
                  navigate({ section: 'prototypes', prototypeId: 'principia' })
                }
              />
            )}
          </>
        )}
      </div>

      {/* ====================================================================
          GLOBAL ⌘K OMNISEARCH & MATHEMATICAL SYMBOL COMMAND PALETTE
          ==================================================================== */}
      {cmdOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Global Platform Omnisearch and Symbol Palette"
          onClick={() => setCmdOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 120,
            backgroundColor: 'rgba(20, 20, 19, 0.22)',
            backdropFilter: 'blur(2.5px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '10vh',
          }}
        >
          <div
            className="ads-floating-lens ads-ui"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: 'min(600px, calc(100vw - 32px))',
              overflow: 'hidden',
            }}
          >
            {/* Search Input Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 16px',
                borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              }}
            >
              <Search size={14} color="var(--ads-accent-compute)" />
              <input
                type="text"
                autoFocus
                value={cmdQuery}
                onChange={(e) => setCmdQuery(e.target.value)}
                placeholder="Jump to Overview, Docs, Storybook, Prototypes, or filter mathematical symbols (ζ, ω₀, ℋ)..."
                style={{
                  flex: 1,
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontSize: '13px',
                  color: 'var(--ads-ink-carbon, #141413)',
                }}
              />
              <button
                type="button"
                onClick={() => setCmdOpen(false)}
                className="ads-kbd"
                style={{ cursor: 'pointer' }}
              >
                ESC
              </button>
            </div>

            {/* Results Body */}
            <div
              style={{
                maxHeight: '420px',
                overflowY: 'auto',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
              }}
            >
              {/* 1. Mathematical Symbols */}
              {filteredSymbols.length > 0 && (
                <div>
                  <div className="ads-section-label" style={{ padding: '0 6px', marginBottom: '4px' }}>
                    L2 Mathematical Symbols (Hover to Highlight · Click to Pin)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {filteredSymbols.map((sym) => {
                      const slot = SYMBOL_SLOT_COLORS[sym.slot];
                      const isPin = pinnedSymbolId === sym.id;
                      const isAct = activeSymbolId === sym.id;
                      return (
                        <button
                          key={sym.id}
                          type="button"
                          onMouseEnter={() => hoverSymbol(sym.id)}
                          onMouseLeave={() => hoverSymbol(null)}
                          onClick={() => {
                            togglePinSymbol(sym.id);
                            setCmdOpen(false);
                          }}
                          className="ads-nav-item"
                          data-active={isPin || isAct ? 'true' : 'false'}
                          style={{ height: '32px', padding: '0 10px' }}
                        >
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            <span
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                minWidth: '28px',
                                height: '20px',
                                padding: '0 5px',
                                borderRadius: '4px',
                                backgroundColor: slot.bg,
                                border: `1px solid ${slot.border}`,
                                color: slot.fg,
                              }}
                            >
                              <InlineMath latex={sym.latex} />
                            </span>
                            <span style={{ fontWeight: 500, color: 'var(--ads-ink-carbon)' }}>
                              {sym.name}
                            </span>
                          </span>
                          <span style={{ fontSize: '11px', color: 'var(--ads-ink-pencil)' }}>
                            <InlineMath latex={sym.domain} />
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2. Platform Destinations by Category */}
              {(
                [
                  'Platform & Prototypes',
                  'Documentation',
                  'Storybook Components',
                ] as const
              ).map((cat) => {
                const items = filteredDestinations.filter((d) => d.category === cat);
                if (items.length === 0) return null;
                return (
                  <div key={cat}>
                    <div className="ads-section-label" style={{ padding: '0 6px', marginBottom: '4px' }}>
                      {cat}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      {items.map((dest) => (
                        <button
                          key={dest.id}
                          type="button"
                          onClick={() => {
                            dest.onTrigger();
                            setCmdOpen(false);
                          }}
                          className="ads-nav-item"
                          style={{ height: '30px', padding: '0 10px' }}
                        >
                          <span style={{ fontWeight: 500, color: 'var(--ads-ink-carbon)' }}>
                            {dest.label}
                          </span>
                          <code className="ads-inline-code" style={{ fontSize: '10px' }}>
                            {dest.detail}
                          </code>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
