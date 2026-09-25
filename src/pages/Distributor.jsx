import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { PKR, fmtDate, expiryStatus } from '../format.js';
import { Icon, Kicker, LiveDot, Skeleton, EmptyState, ErrorBanner } from '../components/ui.jsx';

const STOCK_TONE = {
  brick: 'bg-brick-tint text-brick-deep',
  ochre: 'bg-[#f2e4cb] text-[#8a5e17]',
};

export default function Distributor() {
  const [orders, setOrders] = useState(null);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  async function load() {
    try {
      const [o, p] = await Promise.all([api('/orders'), api('/orders/products')]);
      setOrders(o);
      setProducts(p);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  // DEMO: 5-second polling — new WhatsApp orders appear "live" on the projector.
  useEffect(() => {
    load();
    const t = setInterval(load, 5000);
    return () => clearInterval(t);
  }, []);

  async function fulfill(id) {
    await api(`/orders/${id}/fulfill`, { method: 'POST' });
    load();
  }

  const list = orders || [];
  const byArea = {};
  for (const o of list) (byArea[o.area] ||= []).push(o);
  const pending = list.filter((o) => o.status === 'pending');
  const fulfilled = list.filter((o) => o.status !== 'pending');
  const pendingValue = pending.reduce((s, o) => s + o.total, 0);

  return (
    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>Fulfilment desk</Kicker>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">
            Incoming orders
          </h1>
          <p className="mt-1.5 flex items-center gap-2 text-[15px] text-muted">
            Grouped by delivery route
            <span className="h-1 w-1 rounded-full bg-line-strong" />
            <LiveDot label="refreshes 5s" />
          </p>
        </div>
        <ErrorBanner message={error} />
      </header>

      {/* Ledger stat strip — no boxes, hairline dividers. */}
      <div className="mt-8 grid grid-cols-3 divide-x divide-line border-y border-line">
        <Stat label="Pending" value={orders ? pending.length : null} tone="brick" />
        <Stat label="Fulfilled" value={orders ? fulfilled.length : null} tone="pine" />
        <Stat label="Pending value" value={orders ? PKR(pendingValue) : null} />
      </div>

      <div className="mt-9 grid grid-cols-1 gap-10 lg:grid-cols-[1fr_19rem]">
        <div className="space-y-9">
          {orders === null && <OrdersSkeleton />}

          {orders?.length === 0 && (
            <EmptyState
              icon="truck"
              title="No orders yet"
              hint="When a retailer confirms a reorder on WhatsApp, it lands here in real time. Try it from the Retailer tab."
            />
          )}

          {Object.entries(byArea).map(([area, areaOrders]) => (
            <section key={area}>
              <div className="mb-3 flex items-center gap-2.5">
                <Icon name="pin" className="h-4 w-4 text-brand" />
                <h2 className="text-sm font-semibold tracking-tight text-ink">{area}</h2>
                <span className="text-sm text-muted">· {areaOrders.length}</span>
                <span className="ml-1 h-px flex-1 bg-line" />
              </div>

              <div className="overflow-hidden rounded-xl border border-line bg-surface">
                <div className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 border-b border-line px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted sm:grid-cols-[3.5rem_9rem_1fr_7rem_auto]">
                  <span>Order</span>
                  <span>Retailer</span>
                  <span className="hidden sm:block">Items</span>
                  <span className="hidden text-right sm:block">Total</span>
                  <span className="text-right">Status</span>
                </div>

                <div className="divide-y divide-line">
                  {areaOrders.map((o, idx) => (
                    <div
                      key={o.id}
                      style={{ '--i': idx }}
                      className={`rise grid grid-cols-[3.5rem_1fr_auto] items-center gap-4 px-5 py-3.5 text-[15px] sm:grid-cols-[3.5rem_9rem_1fr_7rem_auto] ${
                        o.status === 'pending' ? 'bg-brick-tint/25' : ''
                      }`}
                    >
                      <span className="tnum text-[13px] text-muted">#{o.id}</span>
                      <div className="min-w-0">
                        <div className="truncate font-medium text-ink">{o.retailer}</div>
                        <div className="tnum text-[12px] text-muted sm:hidden">{PKR(o.total)}</div>
                      </div>
                      <span className="hidden min-w-0 truncate text-ink-soft sm:block">
                        {o.items.map((i) => `${i.name} ×${i.quantity}`).join(', ')}
                      </span>
                      <span className="tnum hidden text-right font-medium text-ink sm:block">
                        {PKR(o.total)}
                      </span>
                      <div className="flex justify-end">
                        {o.status === 'pending' ? (
                          <button
                            onClick={() => fulfill(o.id)}
                            className="rounded-lg bg-ink px-3.5 py-1.5 text-[13px] font-medium text-paper transition-all hover:bg-ink-soft active:translate-y-px"
                          >
                            Fulfil
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-pine-tint px-2.5 py-1 text-[12px] font-medium text-pine">
                            <Icon name="check" className="h-3.5 w-3.5" />
                            Done
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <StockPanel products={products} loading={orders === null} />
      </div>
    </div>
  );
}

function Stat({ label, value, tone }) {
  const color = tone === 'brick' ? 'text-brick' : tone === 'pine' ? 'text-pine' : 'text-ink';
  return (
    <div className="px-5 py-4 first:pl-0">
      <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">{label}</div>
      {value === null ? (
        <Skeleton className="mt-2 h-8 w-20" />
      ) : (
        <div className={`tnum mt-1.5 text-3xl font-semibold ${color}`}>{value}</div>
      )}
    </div>
  );
}

function StockPanel({ products, loading }) {
  const max = Math.max(1, ...products.map((p) => p.stock_level));
  return (
    <aside className="h-fit lg:sticky lg:top-24">
      <div className="mb-3 flex items-center gap-2">
        <Icon name="box" className="h-4 w-4 text-ink-soft" />
        <Kicker>Warehouse stock</Kicker>
      </div>
      <div className="rounded-xl border border-line bg-surface p-5">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full" />
            ))}
          </div>
        ) : (
          <ul className="space-y-4">
            {products.map((p) => {
              const low = p.stock_level < 50;
              const status = expiryStatus(p.expiry_date);
              const flag = status.key === 'expired' || status.key === 'soon';
              return (
                <li key={p.id}>
                  <div className="flex items-start justify-between gap-2 text-sm">
                    <div className="min-w-0">
                      <div className="truncate text-ink-soft">{p.name}</div>
                      {p.expiry_date && (
                        <div className="mt-0.5 flex items-center gap-1 text-[11px] text-muted">
                          <Icon name="calendar" className="h-3 w-3" />
                          {fmtDate(p.expiry_date)}
                        </div>
                      )}
                    </div>
                    <div className="flex shrink-0 flex-col items-end gap-1">
                      <span className={`tnum text-[13px] ${low ? 'text-brick' : 'text-ink'}`}>
                        {p.stock_level}
                      </span>
                      {flag && (
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${STOCK_TONE[status.tone]}`}>
                          {status.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mt-1.5 h-1 overflow-hidden rounded-full bg-line">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${low ? 'bg-brick' : 'bg-pine'}`}
                      style={{ width: `${Math.max(6, (p.stock_level / max) * 100)}%` }}
                    />
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}

function OrdersSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-4 w-32" />
      <div className="space-y-2 rounded-xl border border-line bg-surface p-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  );
}
