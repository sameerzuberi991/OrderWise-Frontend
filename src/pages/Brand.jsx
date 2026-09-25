import { useEffect, useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
} from 'recharts';
import { api } from '../api.js';
import { Kicker, LiveDot, Skeleton, ErrorBanner } from '../components/ui.jsx';

const PKR = (n) => `Rs ${Math.round(n).toLocaleString('en-PK')}`;

// OrderWise palette (mirrors the tokens in index.css), validated for contrast on paper.
const BRAND = '#087e4d';
const TEAL = '#0e7266';
const GRID = 'rgba(113, 129, 126, 0.16)';
const MUTED = '#71817e';
const INK = '#0c2626';

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8e5',
  borderRadius: '0.6rem',
  color: INK,
  fontSize: '0.8rem',
  fontFamily: '"Geist Mono", monospace',
  boxShadow: '0 12px 28px -12px rgba(12,38,38,0.18)',
};

export default function Brand() {
  const [summary, setSummary] = useState(null);
  const [perDay, setPerDay] = useState(null);
  const [topProducts, setTopProducts] = useState(null);
  const [byArea, setByArea] = useState(null);
  const [error, setError] = useState(null);

  async function load() {
    try {
      const [s, d, t, a] = await Promise.all([
        api('/analytics/summary'),
        api('/analytics/orders-per-day'),
        api('/analytics/top-products'),
        api('/analytics/by-area'),
      ]);
      setSummary(s);
      setPerDay(d.map((x) => ({ ...x, label: x.day.slice(5) })));
      setTopProducts(t);
      setByArea(a);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  // DEMO: poll so the charts visibly move after a new order is placed on stage.
  useEffect(() => {
    load();
    const t = setInterval(load, 10000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>Sell-through analytics</Kicker>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
            What Karachi is buying
          </h1>
          <p className="mt-1.5 flex items-center gap-2 text-[15px] text-muted">
            General trade
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            live from distributor orders
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            <LiveDot label="10s" />
          </p>
        </div>
        <ErrorBanner message={error} />
      </header>

      {/* Ledger stat strip. */}
      <div className="mt-8 grid grid-cols-1 divide-y divide-line border-y border-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
        <Stat label="Orders this week" value={summary?.ordersThisWeek} />
        <Stat label="Order value this week" value={summary && PKR(summary.valueThisWeek)} />
        <Stat label="Active retailers" value={summary?.activeRetailers} />
      </div>

      <div className="mt-9 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <Panel title="Orders per day" sub="last 14 days" className="lg:col-span-3">
          {!perDay ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={272}>
              <AreaChart data={perDay} margin={{ top: 10, right: 12, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="ordFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={BRAND} stopOpacity={0.22} />
                    <stop offset="100%" stopColor={BRAND} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke={GRID} vertical={false} />
                <XAxis dataKey="label" tick={{ fill: MUTED, fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis allowDecimals={false} tick={{ fill: MUTED, fontSize: 11 }} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltipStyle} cursor={{ stroke: MUTED, strokeDasharray: '3 3' }} />
                <Area
                  type="monotone" dataKey="orders" name="Orders"
                  stroke={BRAND} strokeWidth={2} fill="url(#ordFill)"
                  activeDot={{ r: 4, fill: BRAND, stroke: '#ffffff', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </Panel>

        <Panel title="Top products" sub="units, last 6 weeks" className="lg:col-span-2">
          {!topProducts ? (
            <ChartSkeleton />
          ) : (
            <ResponsiveContainer width="100%" height={272}>
              <BarChart data={topProducts} layout="vertical" margin={{ top: 8, right: 34, left: 8, bottom: 0 }} barSize={16}>
                <CartesianGrid stroke={GRID} horizontal={false} />
                <XAxis type="number" tick={{ fill: MUTED, fontSize: 11 }} tickLine={false} axisLine={{ stroke: GRID }} />
                <YAxis
                  type="category" dataKey="name" width={150}
                  tick={{ fill: INK, fontSize: 11 }} tickLine={false} axisLine={false}
                />
                <Tooltip contentStyle={tooltipStyle} cursor={{ fill: 'rgba(140,132,122,0.08)' }} />
                <Bar dataKey="quantity" name="Units" fill={TEAL} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Panel>
      </div>

      <div className="mt-6">
        <Panel title="Sell-through by area" sub="last 6 weeks">
          {!byArea ? (
            <div className="space-y-2 py-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full" />
              ))}
            </div>
          ) : (
            <table className="w-full text-left text-[15px]">
              <thead>
                <tr className="border-b border-line text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
                  <th className="py-2.5 pr-4 font-semibold">Area</th>
                  <th className="py-2.5 pr-4 text-right font-semibold">Orders</th>
                  <th className="py-2.5 pr-4 text-right font-semibold">Fulfilled</th>
                  <th className="py-2.5 text-right font-semibold">Value</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {byArea.map((a, idx) => (
                  <tr key={a.area} style={{ '--i': idx }} className="rise">
                    <td className="py-3 pr-4 font-medium text-ink">{a.area}</td>
                    <td className="tnum py-3 pr-4 text-right text-ink-soft">{a.orders}</td>
                    <td className="tnum py-3 pr-4 text-right text-ink-soft">{a.fulfilled}</td>
                    <td className="tnum py-3 text-right font-medium text-ink">{PKR(a.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Panel>
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="px-5 py-4 first:pl-0">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</div>
      {value === undefined || value === null ? (
        <Skeleton className="mt-2 h-9 w-24" />
      ) : (
        <div className="tnum mt-1.5 text-3xl font-semibold text-ink">{value}</div>
      )}
    </div>
  );
}

function Panel({ title, sub, children, className = '' }) {
  return (
    <div className={`rounded-xl border border-line bg-surface p-6 ${className}`}>
      <div className="mb-5 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold tracking-tight text-ink">{title}</h2>
        <span className="text-[11px] uppercase tracking-[0.12em] text-muted">{sub}</span>
      </div>
      {children}
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex h-[272px] items-end gap-2">
      {[62, 40, 78, 52, 88, 46, 70, 58, 92, 50, 74, 64].map((h, i) => (
        <Skeleton key={i} className="flex-1" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}
