import React, { useState, useMemo } from 'react';
import {
  Check,
  Copy,
  Download,
  Search,
  ChevronDown,
  ChevronRight,
  Info,
  CheckCircle2,
  AlertTriangle,
  AlertOctagon,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Sparkline } from '../datavis/ScienceAndVis';

/**
 * ============================================================================
 * L3 PILLAR 0: UNIVERSAL GENERALIST UI FOUNDATION (@principia/core)
 * ============================================================================
 * Makes the Principia design system broadly usable across general software
 * applications, SaaS dashboards, analytics terminals, settings forms,
 * documentation sites, and technical tools—while sharing the exact same
 * tactile Linear × Archival Paper × Tufte booktabs precision as our
 * scientific primitives.
 */

/* -------------------------------------------------------------------------- */
/* 1. BUTTON, SEGMENTED CONTROL & BADGE                                       */
/* -------------------------------------------------------------------------- */

export type ButtonVariant =
  | 'primary'
  | 'compute'
  | 'tonal'
  | 'secondary'
  | 'instrument'
  | 'ghost'
  | 'danger';

export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  active?: boolean;
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  kbd?: string;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'secondary',
  size = 'sm',
  active = false,
  iconLeft,
  iconRight,
  kbd,
  children,
  className = '',
  style,
  ...rest
}) => {
  return (
    <button
      type="button"
      data-variant={variant}
      data-size={size}
      data-active={active ? 'true' : undefined}
      className={`ads-btn ${className}`.trim()}
      style={style}
      {...rest}
    >
      {iconLeft && (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {iconLeft}
        </span>
      )}
      {children && <span>{children}</span>}
      {iconRight && (
        <span style={{ display: 'inline-flex', alignItems: 'center' }}>
          {iconRight}
        </span>
      )}
      {kbd && (
        <span
          className="ads-kbd"
          style={{
            marginLeft: '2px',
            height: size === 'xs' ? '14px' : '16px',
            fontSize: size === 'xs' ? '9.5px' : '10px',
            padding: '0 4px',
            backgroundColor:
              variant === 'primary' || variant === 'compute'
                ? 'rgba(255, 255, 255, 0.16)'
                : undefined,
            color:
              variant === 'primary' || variant === 'compute'
                ? '#FFFFFF'
                : undefined,
            borderColor:
              variant === 'primary' || variant === 'compute'
                ? 'rgba(255, 255, 255, 0.24)'
                : undefined,
          }}
        >
          {kbd}
        </span>
      )}
    </button>
  );
};

export interface SegmentedOption<T extends string = string> {
  id: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  count?: number | string;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentedOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
}

export function SegmentedControl<T extends string = string>({
  options,
  value,
  onChange,
  size = 'sm',
}: SegmentedControlProps<T>) {
  return (
    <div
      role="tablist"
      className="ads-pill-group"
      style={{
        padding: size === 'md' ? '2px' : '1.5px',
      }}
    >
      {options.map((opt) => {
        const isActive = opt.id === value;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            data-active={isActive ? 'true' : 'false'}
            className="ads-pill-btn"
            onClick={() => onChange(opt.id)}
            style={{
              height: size === 'md' ? '25px' : '21px',
              padding: size === 'md' ? '0 10px' : '0 8px',
              fontSize: size === 'md' ? '12px' : '11px',
            }}
          >
            {opt.icon}
            <span>{opt.label}</span>
            {opt.count !== undefined && (
              <span
                style={{
                  fontSize: '10px',
                  opacity: 0.7,
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                {opt.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export type BadgeTone =
  | 'neutral'
  | 'compute'
  | 'reference'
  | 'success'
  | 'warning'
  | 'danger';

export interface BadgeProps {
  tone?: BadgeTone;
  dot?: boolean;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const BADGE_DOT_COLORS: Record<BadgeTone, string> = {
  neutral: 'oklch(0.55 0.01 80)',
  compute: 'oklch(0.55 0.185 32)',
  reference: 'oklch(0.48 0.15 255)',
  success: 'oklch(0.52 0.15 160)',
  warning: 'oklch(0.62 0.15 75)',
  danger: 'oklch(0.54 0.19 25)',
};

export const Badge: React.FC<BadgeProps> = ({
  tone = 'neutral',
  dot = false,
  children,
  style,
}) => (
  <span className="ads-badge" data-tone={tone} style={style}>
    {dot && (
      <span
        style={{
          width: '5.5px',
          height: '5.5px',
          borderRadius: '50%',
          backgroundColor: BADGE_DOT_COLORS[tone],
        }}
      />
    )}
    <span>{children}</span>
  </span>
);

/* -------------------------------------------------------------------------- */
/* 2. PRECISION FORM CONTROLS (INPUT, SELECT, TEXTAREA, SWITCH, FIELD)        */
/* -------------------------------------------------------------------------- */

export interface FormFieldProps {
  label: React.ReactNode;
  hint?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  hint,
  description,
  error,
  children,
}) => (
  <div
    className="ads-ui"
    style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '8px',
      }}
    >
      <label
        style={{
          fontSize: '12px',
          fontWeight: 600,
          color: 'var(--ads-ink-carbon, #141413)',
        }}
      >
        {label}
      </label>
      {hint && (
        <span
          style={{
            fontSize: '11px',
            color: 'var(--ads-ink-pencil, #85837D)',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {hint}
        </span>
      )}
    </div>
    {children}
    {error ? (
      <div
        style={{
          fontSize: '11px',
          color: 'var(--ads-status-danger-fg)',
          fontWeight: 500,
        }}
      >
        {error}
      </div>
    ) : description ? (
      <div
        style={{
          fontSize: '11px',
          color: 'var(--ads-ink-pencil, #85837D)',
          lineHeight: 1.4,
        }}
      >
        {description}
      </div>
    ) : null}
  </div>
);

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  prefixSlot?: React.ReactNode;
  suffixSlot?: React.ReactNode;
  invalid?: boolean;
}

export const Input: React.FC<InputProps> = ({
  prefixSlot,
  suffixSlot,
  invalid = false,
  style,
  ...rest
}) => {
  if (!prefixSlot && !suffixSlot) {
    return (
      <input
        data-invalid={invalid ? 'true' : 'false'}
        className="ads-input"
        style={style}
        {...rest}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        height: '32px',
        padding: '0 10px',
        borderRadius: '5px',
        backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
        border: `1px solid ${
          invalid
            ? 'var(--ads-status-danger-fg)'
            : 'var(--ads-ink-hairline, #E3E1DB)'
        }`,
        boxShadow: 'inset 0 1px 2px rgba(20, 20, 19, 0.03)',
        ...style,
      }}
    >
      {prefixSlot && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: 'var(--ads-ink-pencil, #85837D)',
            fontSize: '11.5px',
          }}
        >
          {prefixSlot}
        </span>
      )}
      <input
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          fontFamily: 'var(--ads-font-chrome)',
          fontSize: '12.5px',
          color: 'var(--ads-ink-carbon, #141413)',
          minWidth: 0,
        }}
        {...rest}
      />
      {suffixSlot && (
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            color: 'var(--ads-ink-pencil, #85837D)',
            fontSize: '11px',
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {suffixSlot}
        </span>
      )}
    </div>
  );
};

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ options, style, ...rest }) => (
  <select className="ads-select" style={style} {...rest}>
    {options.map((opt) => (
      <option key={opt.value} value={opt.value}>
        {opt.label}
      </option>
    ))}
  </select>
);

export interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  label,
  description,
}) => (
  <div
    className="ads-ui"
    onClick={() => onChange(!checked)}
    style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      cursor: 'pointer',
      userSelect: 'none',
    }}
  >
    {(label || description) && (
      <div>
        {label && (
          <div
            style={{
              fontSize: '12.5px',
              fontWeight: 500,
              color: 'var(--ads-ink-carbon, #141413)',
            }}
          >
            {label}
          </div>
        )}
        {description && (
          <div
            style={{
              fontSize: '11px',
              color: 'var(--ads-ink-pencil, #85837D)',
            }}
          >
            {description}
          </div>
        )}
      </div>
    )}
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      data-checked={checked ? 'true' : 'false'}
      className="ads-switch"
      onClick={(e) => {
        e.stopPropagation();
        onChange(!checked);
      }}
    >
      <span className="ads-switch-thumb" />
    </button>
  </div>
);

/* -------------------------------------------------------------------------- */
/* 3. GENERALIST CARDS, METRIC TELEMETRY, CALLOUTS, TABS & KEY-VALUE LISTS    */
/* -------------------------------------------------------------------------- */

export interface CardProps {
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerRight?: React.ReactNode;
  footer?: React.ReactNode;
  padding?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  headerRight,
  footer,
  padding = '20px 22px',
  children,
  style,
}) => (
  <div className="ads-card" style={style}>
    {(title || headerRight) && (
      <div
        className="ads-ui"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '13px 22px',
          background:
            'linear-gradient(180deg, oklch(0.996 0.002 85) 0%, oklch(0.986 0.003 83) 100%)',
          borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
        }}
      >
        <div>
          {title && (
            <div
              style={{
                fontSize: '14px',
                fontWeight: 600,
                color: 'var(--ads-ink-carbon, #141413)',
              }}
            >
              {title}
            </div>
          )}
          {subtitle && (
            <div
              style={{
                fontSize: '12px',
                marginTop: '2px',
                color: 'var(--ads-ink-pencil, #85837D)',
              }}
            >
              {subtitle}
            </div>
          )}
        </div>
        {headerRight && <div>{headerRight}</div>}
      </div>
    )}
    <div style={{ padding }}>{children}</div>
    {footer && (
      <div
        className="ads-ui"
        style={{
          padding: '11px 22px',
          backgroundColor: 'var(--ads-paper-well, #F7F5F0)',
          borderTop: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
          fontSize: '12px',
          color: 'var(--ads-ink-graphite, #4E4D49)',
        }}
      >
        {footer}
      </div>
    )}
  </div>
);

export interface MetricCardProps {
  label: string;
  value: string;
  unit?: string;
  delta?: string;
  deltaTrend?: 'up' | 'down' | 'neutral';
  sparklineData?: number[];
  sparklineColor?: string;
  footnote?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  unit,
  delta,
  deltaTrend = 'up',
  sparklineData,
  sparklineColor = 'oklch(0.42 0.16 255)',
  footnote,
}) => (
  <div
    className="ads-card ads-ui"
    style={{
      padding: '18px 20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      gap: '10px',
    }}
  >
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
      }}
    >
      <span
        style={{
          fontSize: '11.5px',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          color: 'var(--ads-ink-pencil, #85837D)',
        }}
      >
        {label}
      </span>
      {delta && (
        <Badge
          tone={
            deltaTrend === 'up'
              ? 'success'
              : deltaTrend === 'down'
              ? 'danger'
              : 'neutral'
          }
        >
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '2px',
            }}
          >
            {deltaTrend === 'up' ? (
              <ArrowUpRight size={10} />
            ) : deltaTrend === 'down' ? (
              <ArrowDownRight size={10} />
            ) : null}
            {delta}
          </span>
        </Badge>
      )}
    </div>

    <div
      style={{
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between',
        gap: '12px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px' }}>
        <span
          style={{
            fontSize: '26px',
            fontWeight: 700,
            letterSpacing: '-0.025em',
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--ads-ink-carbon, #141413)',
          }}
        >
          {value}
        </span>
        {unit && (
          <span
            style={{
              fontSize: '12.5px',
              color: 'var(--ads-ink-pencil, #85837D)',
              fontWeight: 500,
            }}
          >
            {unit}
          </span>
        )}
      </div>

      {sparklineData && sparklineData.length > 1 && (
        <Sparkline
          data={sparklineData}
          width={80}
          height={24}
          color={sparklineColor}
        />
      )}
    </div>

    {footnote && (
      <div
        style={{
          fontSize: '11.5px',
          color: 'var(--ads-ink-pencil, #85837D)',
          borderTop: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
          paddingTop: '8px',
        }}
      >
        {footnote}
      </div>
    )}
  </div>
);

export type CalloutTone = 'neutral' | 'info' | 'success' | 'warning' | 'danger';

export interface CalloutProps {
  tone?: CalloutTone;
  title?: React.ReactNode;
  children: React.ReactNode;
  action?: React.ReactNode;
}

export const Callout: React.FC<CalloutProps> = ({
  tone = 'neutral',
  title,
  children,
  action,
}) => {
  const iconMap: Record<CalloutTone, React.ReactNode> = {
    neutral: <Info size={14} color="var(--ads-ink-graphite)" />,
    info: <Info size={14} color="var(--ads-status-info-fg)" />,
    success: <CheckCircle2 size={14} color="var(--ads-status-success-fg)" />,
    warning: <AlertTriangle size={14} color="var(--ads-status-warning-fg)" />,
    danger: <AlertOctagon size={14} color="var(--ads-status-danger-fg)" />,
  };

  return (
    <div className="ads-callout" data-tone={tone}>
      <span style={{ marginTop: '2px', flexShrink: 0 }}>{iconMap[tone]}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        {title && (
          <div
            style={{
              fontWeight: 600,
              fontSize: '12.5px',
              marginBottom: '2px',
              color: 'var(--ads-ink-carbon, #141413)',
            }}
          >
            {title}
          </div>
        )}
        <div
          style={{
            fontSize: '12px',
            color: 'var(--ads-ink-graphite, #4E4D49)',
            lineHeight: 1.48,
          }}
        >
          {children}
        </div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  );
};

export interface KeyValueItem {
  label: React.ReactNode;
  value: React.ReactNode;
  mono?: boolean;
}

export const KeyValueList: React.FC<{ items: KeyValueItem[]; columns?: 1 | 2 | 3 }> = ({
  items,
  columns = 2,
}) => (
  <dl
    className="ads-ui"
    style={{
      margin: 0,
      display: 'grid',
      gridTemplateColumns:
        columns === 1
          ? '1fr'
          : `repeat(auto-fit, minmax(${columns === 3 ? '160px' : '220px'}, 1fr))`,
      gap: '8px 18px',
    }}
  >
    {items.map((item, idx) => (
      <div
        key={idx}
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          gap: '10px',
          padding: '5px 0',
          borderBottom: '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))',
        }}
      >
        <dt
          style={{
            fontSize: '11.5px',
            color: 'var(--ads-ink-pencil, #85837D)',
            fontWeight: 500,
          }}
        >
          {item.label}
        </dt>
        <dd
          style={{
            margin: 0,
            fontSize: '12px',
            fontWeight: 600,
            fontFamily: item.mono ? 'var(--ads-font-mono)' : 'var(--ads-font-chrome)',
            fontVariantNumeric: 'tabular-nums',
            color: 'var(--ads-ink-carbon, #141413)',
            textAlign: 'right',
          }}
        >
          {item.value}
        </dd>
      </div>
    ))}
  </dl>
);

export interface TabItem {
  id: string;
  label: React.ReactNode;
  badge?: string | number;
  content: React.ReactNode;
}

export const Tabs: React.FC<{
  tabs: TabItem[];
  defaultTabId?: string;
}> = ({ tabs, defaultTabId }) => {
  const [activeId, setActiveId] = useState(defaultTabId ?? tabs[0]?.id ?? '');
  const activeTab = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <div className="ads-ui">
      <div
        role="tablist"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: '1px solid var(--ads-ink-hairline, #E4E2DC)',
          marginBottom: '14px',
        }}
      >
        {tabs.map((tab) => {
          const isSelected = tab.id === activeId;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setActiveId(tab.id)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 2px',
                background: 'none',
                border: 'none',
                borderBottom: isSelected
                  ? '2px solid var(--ads-ink-carbon, #141413)'
                  : '2px solid transparent',
                marginBottom: '-1px',
                fontFamily: 'var(--ads-font-chrome)',
                fontSize: '12.5px',
                fontWeight: isSelected ? 600 : 500,
                color: isSelected
                  ? 'var(--ads-ink-carbon, #141413)'
                  : 'var(--ads-ink-pencil, #85837D)',
                cursor: 'pointer',
              }}
            >
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span
                  style={{
                    fontSize: '10px',
                    padding: '0 5px',
                    borderRadius: '999px',
                    backgroundColor: isSelected
                      ? 'var(--ads-ink-carbon)'
                      : 'var(--ads-paper-well)',
                    color: isSelected ? '#FFFFFF' : 'var(--ads-ink-graphite)',
                  }}
                >
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div>{activeTab?.content}</div>
    </div>
  );
};

export interface AccordionItem {
  id: string;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  content: React.ReactNode;
}

export const Accordion: React.FC<{
  items: AccordionItem[];
  defaultOpenIds?: string[];
}> = ({ items, defaultOpenIds = [] }) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenIds);

  const toggle = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <div
      className="ads-card ads-ui"
      style={{ display: 'flex', flexDirection: 'column' }}
    >
      {items.map((item, idx) => {
        const isOpen = openIds.includes(item.id);
        return (
          <div
            key={item.id}
            style={{
              borderBottom:
                idx < items.length - 1
                  ? '1px solid var(--ads-ink-whisper, oklch(0.942 0.004 82))'
                  : 'none',
            }}
          >
            <button
              type="button"
              onClick={() => toggle(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '10px',
                padding: '10px 14px',
                background: isOpen ? 'var(--ads-paper-well, #F7F5F0)' : 'transparent',
                border: 'none',
                textAlign: 'left',
                fontFamily: 'var(--ads-font-chrome)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {isOpen ? (
                  <ChevronDown size={13} color="var(--ads-ink-graphite)" />
                ) : (
                  <ChevronRight size={13} color="var(--ads-ink-pencil)" />
                )}
                <span
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 600,
                    color: 'var(--ads-ink-carbon, #141413)',
                  }}
                >
                  {item.title}
                </span>
              </div>
              {item.subtitle && (
                <span
                  style={{
                    fontSize: '11px',
                    color: 'var(--ads-ink-pencil, #85837D)',
                  }}
                >
                  {item.subtitle}
                </span>
              )}
            </button>
            {isOpen && (
              <div
                style={{
                  padding: '10px 16px 12px 35px',
                  fontSize: '12.5px',
                  lineHeight: 1.52,
                  color: 'var(--ads-ink-graphite, #4E4D49)',
                }}
              >
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* 4. UNIVERSAL BOOKTABS DATA TABLE (<DataTable<T>>)                          */
/* -------------------------------------------------------------------------- */

export interface DataTableColumn<T> {
  key: string;
  header: React.ReactNode;
  /** Optional \cmidrule(lr) group spanner header */
  group?: string;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  /** Numeric extractor for sorting & proportional magnitude bar fill */
  numericValue?: (row: T) => number;
  /** Max value for Tufte proportional cell bar fill */
  barMax?: number;
  barColor?: string;
  render?: (row: T, rowIndex: number) => React.ReactNode;
}

export interface DataTableProps<T> {
  title?: React.ReactNode;
  caption?: React.ReactNode;
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T, index: number) => string;
  activeRowKey?: string;
  onRowClick?: (row: T) => void;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchFilter?: (row: T, query: string) => boolean;
  summaryRow?: Record<string, React.ReactNode>;
  footnotes?: Array<{ mark: string; text: React.ReactNode }>;
  defaultShowBars?: boolean;
}

export function DataTable<T>({
  title,
  caption,
  columns,
  data,
  rowKey,
  activeRowKey,
  onRowClick,
  searchable = true,
  searchPlaceholder = 'Filter rows…',
  searchFilter,
  summaryRow,
  footnotes,
  defaultShowBars = true,
}: DataTableProps<T>) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [showBars, setShowBars] = useState(defaultShowBars);
  const [copiedFormat, setCopiedFormat] = useState<'csv' | 'tex' | null>(null);

  const hasBarColumns = columns.some((c) => c.barMax !== undefined);
  const hasGroups = columns.some((c) => Boolean(c.group));

  const groupSpans = useMemo(() => {
    if (!hasGroups) return [];
    const spans: Array<{ label: string; colSpan: number }> = [];
    for (const col of columns) {
      const g = col.group ?? '';
      const last = spans[spans.length - 1];
      if (last && last.label === g) {
        last.colSpan += 1;
      } else {
        spans.push({ label: g, colSpan: 1 });
      }
    }
    return spans;
  }, [columns, hasGroups]);

  const processedRows = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = data;
    if (q) {
      list = list.filter((row) => {
        if (searchFilter) return searchFilter(row, q);
        return JSON.stringify(row).toLowerCase().includes(q);
      });
    }
    if (sortKey) {
      const col = columns.find((c) => c.key === sortKey);
      if (col) {
        list = [...list].sort((a, b) => {
          if (col.numericValue) {
            const va = col.numericValue(a);
            const vb = col.numericValue(b);
            return sortDir === 'asc' ? va - vb : vb - va;
          }
          const sa = String((a as Record<string, unknown>)[col.key] ?? '');
          const sb = String((b as Record<string, unknown>)[col.key] ?? '');
          return sortDir === 'asc' ? sa.localeCompare(sb) : sb.localeCompare(sa);
        });
      }
    }
    return list;
  }, [data, query, searchFilter, sortKey, sortDir, columns]);

  const handleSort = (col: DataTableColumn<T>) => {
    if (!col.sortable && !col.numericValue) return;
    if (sortKey === col.key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(col.key);
      setSortDir('desc');
    }
  };

  const handleExport = (fmt: 'csv' | 'tex') => {
    const headers = columns.map((c) =>
      typeof c.header === 'string' ? c.header : c.key
    );
    const bodyLines = processedRows.map((row) =>
      columns.map((c) => {
        const raw = (row as Record<string, unknown>)[c.key];
        return raw !== undefined && raw !== null ? String(raw) : '';
      })
    );

    if (fmt === 'csv') {
      const csv = [
        headers.join(','),
        ...bodyLines.map((r) => r.map((cell) => `"${cell}"`).join(',')),
      ].join('\n');
      navigator.clipboard?.writeText(csv);
    } else {
      const alignSpec = columns
        .map((c) => (c.align === 'right' ? 'r' : c.align === 'center' ? 'c' : 'l'))
        .join('');
      const tex = [
        '\\begin{table}[htbp]',
        '  \\centering',
        `  \\caption{${typeof caption === 'string' ? caption : title ?? 'Dataset'}}`,
        `  \\begin{tabular}{@{}${alignSpec}@{}}`,
        '    \\toprule',
        `    ${headers.join(' & ')} \\\\`,
        '    \\midrule',
        ...bodyLines.map((r) => `    ${r.join(' & ')} \\\\`),
        '    \\bottomrule',
        '  \\end{tabular}',
        '\\end{table}',
      ].join('\n');
      navigator.clipboard?.writeText(tex);
    }
    setCopiedFormat(fmt);
    setTimeout(() => setCopiedFormat(null), 1500);
  };

  return (
    <figure style={{ margin: 0 }}>
      {/* Top Toolbar: Caption/Title + Search + Bar Toggle + CSV/TeX Export */}
      <div
        className="ads-ui"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          gap: '10px',
          marginBottom: '8px',
        }}
      >
        <div style={{ maxWidth: '68ch' }}>
          {title && (
            <div
              style={{
                fontSize: '13px',
                fontWeight: 600,
                color: 'var(--ads-ink-carbon, #141413)',
                marginBottom: caption ? '2px' : 0,
              }}
            >
              {title}
            </div>
          )}
          {caption && (
            <div
              className="ads-prose"
              style={{
                fontSize: '13px',
                lineHeight: 1.45,
                color: 'var(--ads-ink-graphite, #4E4D49)',
              }}
            >
              {caption}
            </div>
          )}
        </div>

        <div
          className="ads-no-print"
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px' }}
        >
          {searchable && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                height: '22px',
                padding: '0 7px',
                borderRadius: '4px',
                backgroundColor: 'var(--ads-paper-plate, #FFFFFF)',
                border: '1px solid var(--ads-ink-hairline, #E4E2DC)',
              }}
            >
              <Search size={10} color="var(--ads-ink-pencil)" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                style={{
                  width: '115px',
                  border: 'none',
                  outline: 'none',
                  backgroundColor: 'transparent',
                  fontFamily: 'var(--ads-font-chrome)',
                  fontSize: '11px',
                  color: 'var(--ads-ink-carbon)',
                }}
              />
            </div>
          )}

          {hasBarColumns && (
            <button
              type="button"
              data-active={showBars ? 'true' : 'false'}
              onClick={() => setShowBars((b) => !b)}
              className="ads-btn-instrument"
              style={{ height: '22px', fontSize: '10.5px', padding: '0 7px' }}
            >
              <span>Bars</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => handleExport('tex')}
            className="ads-btn-instrument"
            style={{ height: '22px', fontSize: '10.5px', padding: '0 7px' }}
            title="Copy LaTeX booktabs table"
          >
            {copiedFormat === 'tex' ? (
              <Check size={9} color="oklch(0.45 0.14 160)" />
            ) : (
              <Copy size={9} />
            )}
            <span>TeX</span>
          </button>

          <button
            type="button"
            onClick={() => handleExport('csv')}
            className="ads-btn-instrument"
            style={{ height: '22px', fontSize: '10.5px', padding: '0 7px' }}
            title="Copy CSV data"
          >
            {copiedFormat === 'csv' ? (
              <Check size={9} color="oklch(0.45 0.14 160)" />
            ) : (
              <Download size={9} />
            )}
            <span>CSV</span>
          </button>
        </div>
      </div>

      {/* Booktabs Table Stage */}
      <div className="ads-booktabs-scroll">
        <table className="ads-booktabs-table">
          <thead>
            {hasGroups && (
              <tr>
                {groupSpans.map((g, idx) => (
                  <th
                    key={idx}
                    colSpan={g.colSpan}
                    style={{ textAlign: 'left', padding: '5px 10px 2px 10px' }}
                  >
                    {g.label ? (
                      <span
                        className="ads-cmidrule"
                        style={{
                          marginRight: idx < groupSpans.length - 1 ? '6px' : 0,
                        }}
                      >
                        {g.label}
                      </span>
                    ) : null}
                  </th>
                ))}
              </tr>
            )}
            <tr>
              {columns.map((col) => {
                const isSortable = Boolean(col.sortable || col.numericValue);
                const isSorted = sortKey === col.key;
                return (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col)}
                    style={{
                      textAlign: col.align ?? 'left',
                      padding: '6px 10px 7px 10px',
                      cursor: isSortable ? 'pointer' : 'default',
                      color: isSorted ? 'var(--ads-ink-carbon)' : undefined,
                    }}
                  >
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      <span>{col.header}</span>
                      {isSortable && (
                        <span
                          style={{
                            fontSize: '9px',
                            opacity: isSorted ? 1 : 0.35,
                            color: isSorted
                              ? 'var(--ads-accent-compute)'
                              : 'inherit',
                          }}
                        >
                          {isSorted ? (sortDir === 'asc' ? '↑' : '↓') : '↕'}
                        </span>
                      )}
                    </span>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {processedRows.map((row, rIdx) => {
              const rKey = rowKey(row, rIdx);
              const isRowActive = activeRowKey !== undefined && activeRowKey === rKey;
              return (
                <tr
                  key={rKey}
                  data-active-row={isRowActive ? 'true' : 'false'}
                  onClick={() => onRowClick?.(row)}
                  style={{ cursor: onRowClick ? 'pointer' : 'default' }}
                >
                  {columns.map((col) => {
                    const numVal = col.numericValue ? col.numericValue(row) : undefined;
                    const barPct =
                      showBars && col.barMax && numVal !== undefined
                        ? Math.max(0, Math.min(100, (numVal / col.barMax) * 100))
                        : 0;
                    const barFill = col.barColor ?? 'oklch(0.45 0.145 255 / 0.10)';

                    return (
                      <td
                        key={col.key}
                        className={col.align === 'right' ? 'ads-cell-num' : undefined}
                        style={{
                          padding: '7.5px 10px',
                          textAlign: col.align ?? 'left',
                          fontFamily:
                            col.align === 'right'
                              ? 'var(--ads-font-chrome)'
                              : 'var(--ads-font-chrome)',
                          fontSize: '12px',
                          backgroundImage:
                            barPct > 0
                              ? `linear-gradient(90deg, transparent ${
                                  100 - barPct
                                }%, ${barFill} ${100 - barPct}%)`
                              : undefined,
                        }}
                      >
                        {col.render
                          ? col.render(row, rIdx)
                          : String((row as Record<string, unknown>)[col.key] ?? '')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>

          {summaryRow && (
            <tfoot>
              <tr>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={col.align === 'right' ? 'ads-cell-num' : undefined}
                    style={{
                      padding: '6px 10px',
                      textAlign: col.align ?? 'left',
                      fontWeight: 600,
                    }}
                  >
                    {summaryRow[col.key] ?? ''}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {footnotes && footnotes.length > 0 && (
        <div className="ads-tablenotes">
          {footnotes.map((fn) => (
            <span key={fn.mark}>
              <sup className="ads-tnote" style={{ marginRight: '3px' }}>
                {fn.mark}
              </sup>
              {fn.text}
            </span>
          ))}
        </div>
      )}
    </figure>
  );
}
