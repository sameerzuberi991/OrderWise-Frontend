import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { fmtDate, expiryStatus } from '../format.js';
import { Icon, Kicker, Skeleton, EmptyState, ErrorBanner } from '../components/ui.jsx';

const TONE = {
  brick: 'bg-brick-tint text-brick-deep',
  ochre: 'bg-[#f2e4cb] text-[#8a5e17]',
  pine: 'bg-pine-tint text-pine',
  muted: 'bg-line/70 text-muted',
};

function StatusBadge({ date }) {
  const s = expiryStatus(date);
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-[12px] font-medium ${TONE[s.tone]}`}>
      {s.label}
    </span>
  );
}

const EMPTY_FORM = { name: '', sku: '', unit_price: '', stock_level: '', expiry_date: '' };

export default function Inventory() {
  const [items, setItems] = useState(null);
  const [error, setError] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState(null);

  async function load() {
    try {
      setItems(await api('/inventory'));
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function addItem(e) {
    e.preventDefault();
    setBusy(true);
    setFormError(null);
    try {
      await api('/inventory', { method: 'POST', body: JSON.stringify(form) });
      setForm(EMPTY_FORM);
      setNotice(`Added ${form.name.trim()}.`);
      await load();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function patchItem(id, patch) {
    const updated = await api(`/inventory/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });
    setItems((list) => list.map((p) => (p.id === id ? updated : p)));
  }

  async function removeItem(id) {
    await api(`/inventory/${id}`, { method: 'DELETE' });
    setItems((list) => list.filter((p) => p.id !== id));
  }

  async function removeExpired() {
    setBusy(true);
    try {
      const { removed } = await api('/inventory/remove-expired', { method: 'POST' });
      setNotice(removed ? `Removed ${removed} expired item${removed > 1 ? 's' : ''}.` : 'Nothing expired to remove.');
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const list = items || [];
  const expired = list.filter((p) => expiryStatus(p.expiry_date).key === 'expired').length;
  const expiring = list.filter((p) => expiryStatus(p.expiry_date).key === 'soon').length;

  return (
    <div className="mx-auto max-w-7xl px-5 py-9 sm:px-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <Kicker>Inventory</Kicker>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-ink">Stock room</h1>
          <p className="mt-1.5 flex flex-wrap items-center gap-2 text-[15px] text-muted">
            <span>{items ? `${list.length} items` : 'Loading…'}</span>
            {expiring > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span className="text-[#8a5e17]">{expiring} expiring soon</span>
              </>
            )}
            {expired > 0 && (
              <>
                <span className="h-1 w-1 rounded-full bg-line-strong" />
                <span className="text-brick">{expired} expired</span>
              </>
            )}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ErrorBanner message={error} />
          <button
            onClick={removeExpired}
            disabled={busy || expired === 0}
            className="inline-flex items-center gap-2 rounded-lg border border-brick/30 bg-brick-tint/50 px-3.5 py-2 text-[13px] font-medium text-brick-deep transition-all hover:bg-brick-tint active:translate-y-px disabled:opacity-40"
          >
            <Icon name="trash" className="h-4 w-4" />
            Remove expired{expired > 0 ? ` (${expired})` : ''}
          </button>
        </div>
      </header>

      {notice && (
        <div className="fade mt-5 inline-flex items-center gap-2 rounded-lg border border-pine/25 bg-pine-tint/60 px-3 py-2 text-sm text-pine">
          <Icon name="check" className="h-4 w-4" />
          {notice}
        </div>
      )}

      {/* Add new stock. */}
      <section className="mt-7 rounded-xl border border-line bg-surface p-6">
        <div className="mb-4 flex items-center gap-2">
          <Icon name="plus" className="h-4 w-4 text-brand" />
          <Kicker>Add stock</Kicker>
        </div>
        <form onSubmit={addItem} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_0.8fr_0.7fr_1fr_auto]">
          <Field label="Item name">
            <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="e.g. National Salt 800g" className={inputCls} />
          </Field>
          <Field label="SKU">
            <input required value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })}
              placeholder="NF-SLT-800" className={`${inputCls} font-mono`} />
          </Field>
          <Field label="Unit price (Rs)">
            <input type="number" min="1" required value={form.unit_price}
              onChange={(e) => setForm({ ...form, unit_price: e.target.value })} placeholder="120" className={`${inputCls} tnum`} />
          </Field>
          <Field label="Stock">
            <input type="number" min="0" value={form.stock_level}
              onChange={(e) => setForm({ ...form, stock_level: e.target.value })} placeholder="100" className={`${inputCls} tnum`} />
          </Field>
          <Field label="Due date">
            <input type="date" value={form.expiry_date}
              onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} className={inputCls} />
          </Field>
          <div className="flex items-end">
            <button type="submit" disabled={busy}
              className="h-[42px] w-full rounded-lg bg-ink px-5 text-[14px] font-medium text-paper transition-all hover:bg-ink-soft active:translate-y-px disabled:opacity-50 sm:w-auto">
              Add
            </button>
          </div>
        </form>
        {formError && <p className="mt-3 text-sm text-brick">{formError}</p>}
      </section>

      {/* Stock table. */}
      <section className="mt-8">
        {items === null ? (
          <div className="space-y-2 rounded-xl border border-line bg-surface p-5">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-11 w-full" />)}
          </div>
        ) : list.length === 0 ? (
          <EmptyState icon="box" title="No stock yet" hint="Add your first item using the form above." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="grid grid-cols-[1.7fr_0.9fr_1fr_1.1fr_1fr_auto] items-center gap-4 border-b border-line px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">
              <span>Item</span>
              <span className="text-right">Price (Rs)</span>
              <span className="text-right">In stock</span>
              <span>Due date</span>
              <span>Status</span>
              <span className="text-right">Remove</span>
            </div>
            <div className="divide-y divide-line">
              {list.map((p, idx) => (
                <Row key={p.id} p={p} idx={idx} onPatch={patchItem} onRemove={removeItem} />
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

const inputCls =
  'w-full rounded-lg border border-line bg-paper px-3 py-2.5 text-[14px] text-ink outline-none transition-colors placeholder:text-muted/70 focus:border-brand';

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-muted">{label}</span>
      {children}
    </label>
  );
}

function Row({ p, idx, onPatch, onRemove }) {
  const [stock, setStock] = useState(String(p.stock_level));
  const [price, setPrice] = useState(String(p.unit_price));
  const [saving, setSaving] = useState(false);

  useEffect(() => setStock(String(p.stock_level)), [p.stock_level]);
  useEffect(() => setPrice(String(p.unit_price)), [p.unit_price]);

  async function commit(field, raw, current, parse) {
    const n = parse(raw);
    if (n === null || n === current) {
      setStock(String(p.stock_level));
      setPrice(String(p.unit_price));
      return;
    }
    setSaving(true);
    try {
      await onPatch(p.id, { [field]: n });
    } finally {
      setSaving(false);
    }
  }

  const parseStock = (s) => {
    const n = parseInt(s, 10);
    return Number.isFinite(n) && n >= 0 ? n : null;
  };
  const parsePrice = (s) => {
    const n = parseFloat(s);
    return Number.isFinite(n) && n > 0 ? n : null;
  };

  return (
    <div
      style={{ '--i': idx }}
      className="rise grid grid-cols-[1.7fr_0.9fr_1fr_1.1fr_1fr_auto] items-center gap-4 px-5 py-3.5 text-[15px]"
    >
      <div className="min-w-0">
        <div className="truncate font-medium text-ink">{p.name}</div>
        <div className="font-mono text-[11px] uppercase tracking-wide text-muted">{p.sku}</div>
      </div>
      <div className="flex items-center justify-end gap-1">
        <span className="text-[12px] text-muted">Rs</span>
        <input
          value={price}
          onChange={(e) => setPrice(e.target.value.replace(/[^\d.]/g, ''))}
          onBlur={() => commit('unit_price', price, p.unit_price, parsePrice)}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          disabled={saving}
          className="tnum w-20 rounded-md border border-line bg-paper px-2 py-1 text-right text-ink outline-none transition-colors focus:border-brand disabled:opacity-50"
        />
      </div>
      <div className="flex justify-end">
        <input
          value={stock}
          onChange={(e) => setStock(e.target.value.replace(/[^\d]/g, ''))}
          onBlur={() => commit('stock_level', stock, p.stock_level, parseStock)}
          onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
          disabled={saving}
          className="tnum w-20 rounded-md border border-line bg-paper px-2 py-1 text-right text-ink outline-none transition-colors focus:border-brand disabled:opacity-50"
        />
      </div>
      <input
        type="date"
        value={p.expiry_date || ''}
        onChange={(e) => onPatch(p.id, { expiry_date: e.target.value })}
        className="rounded-md border border-line bg-paper px-2 py-1 text-[13px] text-ink outline-none transition-colors focus:border-brand"
      />
      <span><StatusBadge date={p.expiry_date} /></span>
      <div className="flex justify-end">
        <RemoveButton onConfirm={() => onRemove(p.id)} />
      </div>
    </div>
  );
}

// Two-tap remove so a stray click can't pull stock off the shelf.
function RemoveButton({ onConfirm }) {
  const [armed, setArmed] = useState(false);
  const timer = useRef(null);

  useEffect(() => () => clearTimeout(timer.current), []);

  function click() {
    if (armed) {
      clearTimeout(timer.current);
      onConfirm();
      return;
    }
    setArmed(true);
    timer.current = setTimeout(() => setArmed(false), 3000);
  }

  return (
    <button
      onClick={click}
      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[13px] font-medium transition-all active:translate-y-px ${
        armed ? 'bg-brick text-white' : 'text-muted hover:bg-brick-tint/50 hover:text-brick-deep'
      }`}
    >
      <Icon name="trash" className="h-4 w-4" />
      {armed ? 'Confirm' : ''}
    </button>
  );
}
