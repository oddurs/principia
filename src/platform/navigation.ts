/**
 * ============================================================================
 * UNIVERSAL PLATFORM ROUTER & NAVIGATION SCHEMA (@principia/core)
 * ============================================================================
 * Synchronizes URL hash routes (`#/overview`, `#/docs/typography`,
 * `#/storybook/scientific-plot`, `#/prototypes/principia`) with React state
 * so browser Back/Forward, deep links, and the Global ⌘K Command Palette work
 * seamlessly across the entire ecosystem.
 */

export type PlatformSection = 'overview' | 'docs' | 'storybook' | 'prototypes';

export type DocPageId =
  | 'getting-started'
  | 'typography'
  | 'colors-materiality'
  | 'grid-hardware'
  | 'math-formal'
  | 'datavis-booktabs'
  | 'symbol-bus';

export type StoryComponentId =
  | 'buttons-badges'
  | 'forms-inputs'
  | 'cards-surfaces'
  | 'general-datatable'
  | 'pod'
  | 'manipulate-scrubber'
  | 'equation-block'
  | 'formal-proof'
  | 'algorithm-block'
  | 'scientific-plot'
  | 'sparkline-unit'
  | 'booktabs-table'
  | 'citations-crossref'
  | 'omni-compute-bar'
  | 'code-cell'
  | 'grounded-ai'
  | 'agentic-workflow';

export type PrototypeAppId =
  | 'ai-evals'
  | 'quant-macro'
  | 'biomed-trials'
  | 'agent-workflow'
  | 'principia'
  | 'wolfram'
  | 'monograph'
  | 'notebook';

export interface PlatformRoute {
  section: PlatformSection;
  docPage: DocPageId;
  storyId: StoryComponentId;
  prototypeId: PrototypeAppId;
}

export const DEFAULT_ROUTE: PlatformRoute = {
  section: 'overview',
  docPage: 'getting-started',
  storyId: 'buttons-badges',
  prototypeId: 'ai-evals',
};

export function parseHashRoute(
  hash: string,
  prev: PlatformRoute = DEFAULT_ROUTE
): PlatformRoute {
  const cleaned = hash.replace(/^#\/?/, '').trim();
  if (!cleaned) return { ...prev, section: 'overview' };

  const [seg0, seg1] = cleaned.split('/');

  if (seg0 === 'overview') {
    return { ...prev, section: 'overview' };
  }

  if (seg0 === 'docs') {
    const validDocs: DocPageId[] = [
      'getting-started',
      'typography',
      'colors-materiality',
      'grid-hardware',
      'math-formal',
      'datavis-booktabs',
      'symbol-bus',
    ];
    const docPage = validDocs.includes(seg1 as DocPageId)
      ? (seg1 as DocPageId)
      : prev.docPage;
    return { ...prev, section: 'docs', docPage };
  }

  if (seg0 === 'storybook') {
    const validStories: StoryComponentId[] = [
      'buttons-badges',
      'forms-inputs',
      'cards-surfaces',
      'general-datatable',
      'pod',
      'manipulate-scrubber',
      'equation-block',
      'formal-proof',
      'algorithm-block',
      'scientific-plot',
      'sparkline-unit',
      'booktabs-table',
      'citations-crossref',
      'omni-compute-bar',
      'code-cell',
      'grounded-ai',
      'agentic-workflow',
    ];
    const storyId = validStories.includes(seg1 as StoryComponentId)
      ? (seg1 as StoryComponentId)
      : prev.storyId;
    return { ...prev, section: 'storybook', storyId };
  }

  if (seg0 === 'prototypes') {
    const validProtos: PrototypeAppId[] = [
      'ai-evals',
      'quant-macro',
      'biomed-trials',
      'agent-workflow',
      'principia',
      'wolfram',
      'monograph',
      'notebook',
    ];
    const prototypeId = validProtos.includes(seg1 as PrototypeAppId)
      ? (seg1 as PrototypeAppId)
      : prev.prototypeId;
    return { ...prev, section: 'prototypes', prototypeId };
  }

  return prev;
}

export function buildHashUrl(route: Partial<PlatformRoute> & { section: PlatformSection }): string {
  switch (route.section) {
    case 'overview':
      return '#/overview';
    case 'docs':
      return `#/docs/${route.docPage ?? 'getting-started'}`;
    case 'storybook':
      return `#/storybook/${route.storyId ?? 'pod'}`;
    case 'prototypes':
      return `#/prototypes/${route.prototypeId ?? 'principia'}`;
  }
}
