// Shared visual primitives for OrderWise — kept tiny and dependency-free.
// All icons are inline SVG at strokeWidth 1.5 (no emoji, no icon library).

const ic = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

export function Icon({ name, className = 'h-5 w-5' }) {
  const paths = {
    store: (
      <>
        <path d="M4 9.5 5.2 4.5h13.6L20 9.5" />
        <path d="M4 9.5c0 1.4 1 2.5 2.3 2.5S8.6 10.9 8.6 9.5c0 1.4 1 2.5 2.3 2.5s2.3-1.1 2.3-2.5c0 1.4 1 2.5 2.3 2.5s2.3-1.1 2.3-2.5" />
        <path d="M5.5 12v7.5h13V12" />
        <path d="M10 19.5V15h4v4.5" />
      </>
    ),
    truck: (
      <>
        <path d="M2.5 6.5h11v9h-11z" />
        <path d="M13.5 9.5H18l3 3v3h-7.5" />
        <circle cx="6.5" cy="17" r="1.8" />
        <circle cx="16.5" cy="17" r="1.8" />
      </>
    ),
    chart: (
      <>
        <path d="M3.5 3.5v17h17" />
        <path d="M7 15l3.2-4 3 2.4L20 6.5" />
      </>
    ),
    check: <path d="M4.5 12.5 9 17l10.5-11" />,
    box: (
      <>
        <path d="M12 3.5 20 8v8l-8 4.5L4 16V8z" />
        <path d="M4 8l8 4.5L20 8" />
        <path d="M12 12.5V20.5" />
      </>
    ),
    pin: (
      <>
        <path d="M12 21s6.5-5.6 6.5-10.5A6.5 6.5 0 0 0 5.5 10.5C5.5 15.4 12 21 12 21z" />
        <circle cx="12" cy="10.3" r="2.3" />
      </>
    ),
    alert: (
      <>
        <path d="M12 4 22 20H2z" />
        <path d="M12 10v4.5" />
        <circle cx="12" cy="17.4" r="0.4" fill="currentColor" stroke="none" />
      </>
    ),
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    send: <path d="M4 12 20 4l-6 16-3.5-6.5z" />,
    plus: <path d="M12 5v14M5 12h14" />,
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" />
        <path d="M6 7l1 12.5A1.5 1.5 0 0 0 8.5 21h7a1.5 1.5 0 0 0 1.5-1.5L18 7" />
      </>
    ),
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="16" rx="2.5" />
        <path d="M3.5 9.5h17M8 3.5v3M16 3.5v3" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" className={className} {...ic} aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

// OrderWise logo: the icon alone on small screens, the full lockup from sm up.
export function BrandMark() {
  return (
    <span className="flex items-center">
      <img src="/brand/orderwise-mark.png" alt="OrderWise" className="h-8 w-8 sm:hidden" />
      <img
        src="/brand/orderwise-logo-web.png"
        alt="OrderWise"
        className="hidden h-8 w-auto sm:block"
      />
    </span>
  );
}

// Breathing status dot with label.
export function LiveDot({ label = 'live', tone = 'pine' }) {
  const c = tone === 'brick' ? 'bg-brick' : 'bg-pine';
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.14em] text-muted">
      <span className={`live-dot h-1.5 w-1.5 rounded-full ${c}`} />
      {label}
    </span>
  );
}

// Small all-caps section label.
export function Kicker({ children, className = '' }) {
  return (
    <div className={`text-[11px] font-semibold uppercase tracking-[0.18em] text-muted ${className}`}>
      {children}
    </div>
  );
}

export function Skeleton({ className = '', style }) {
  return <div style={style} className={`skeleton rounded ${className}`} />;
}

// Composed empty state — never a bare "no data" line.
export function EmptyState({ icon = 'box', title, hint }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong px-6 py-16 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-line/60 text-muted">
        <Icon name={icon} className="h-6 w-6" />
      </span>
      <p className="mt-4 text-sm font-medium text-ink">{title}</p>
      {hint && <p className="mt-1 max-w-xs text-sm text-muted">{hint}</p>}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="flex items-center gap-2 rounded-lg border border-brick/25 bg-brick-tint/60 px-3 py-2 text-sm text-brick-deep">
      <Icon name="alert" className="h-4 w-4 shrink-0" />
      <span className="truncate">{message}</span>
    </div>
  );
}
