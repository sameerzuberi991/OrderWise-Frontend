import { useEffect, useRef, useState } from 'react';
import { api } from '../api.js';
import { Icon, Kicker } from '../components/ui.jsx';

// DEMO: fallback chat simulator. Sends the exact Meta webhook payload shape to
// POST /webhook, so the whole bot flow works on stage even without WhatsApp.
const DEMO_PHONE = '923001111111';

const STEPS = [
  { k: 'salaam', title: 'Say salaam', body: 'The bot greets them and offers four ways to order.' },
  { k: '1', title: '“1” — last order · “3” — usual basket', body: 'Repeat their most recent order, or the basket they buy most often.' },
  { k: '2', title: '“2” — browse & build', body: 'A numbered catalogue with live stock. They reply “3” or “3 x 5” to add items.' },
  { k: 'cart', title: '“cart” · “remove 2” · “done”', body: 'Review the running total, drop a line, then finish. Over-orders are capped at available stock.' },
  { k: 'confirm', title: 'Reply “confirm”', body: 'The order is placed and the distributor is notified instantly.' },
];

const QUICK = ['salaam', '1', '2', '3 x 5', 'cart', 'done', 'confirm'];

export default function Retailer() {
  const [phone, setPhone] = useState(DEMO_PHONE);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'This is the WhatsApp simulator. Say salaam to start.' },
  ]);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  async function sendText(text) {
    if (!text || sending) return;
    setDraft('');
    setMessages((m) => [...m, { from: 'me', text }]);
    setSending(true);
    try {
      const data = await api('/webhook', {
        method: 'POST',
        body: JSON.stringify({
          entry: [{ changes: [{ value: { messages: [{ from: phone, type: 'text', text: { body: text } }] } }] }],
        }),
      });
      const replies = data.replies || [];
      setMessages((m) => [...m, ...replies.map((t) => ({ from: 'bot', text: t }))]);
    } catch (err) {
      setMessages((m) => [...m, { from: 'bot', text: `Server unreachable: ${err.message}` }]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_minmax(340px,400px)] lg:gap-16">
        {/* Narrative — left, anti-center. */}
        <div className="max-w-xl">
          <Kicker>Retailer channel</Kicker>
          <h1 className="mt-3 text-4xl font-semibold leading-[1.05] tracking-tight text-ink sm:text-5xl">
            Reordering stock,
            <br />
            in one message.
          </h1>
          <p className="mt-5 max-w-md text-[17px] leading-relaxed text-ink-soft">
            No app to install, no catalogue to scroll. A kiryana store owner reorders
            their usual stock over the WhatsApp they already use all day.
          </p>

          <ol className="mt-10 space-y-0">
            {STEPS.map((s, i) => (
              <li key={s.k} className="relative flex gap-4 pb-8 last:pb-0">
                {i < STEPS.length - 1 && (
                  <span className="absolute left-[15px] top-9 h-full w-px bg-line-strong" />
                )}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-line-strong bg-surface text-[13px] font-semibold text-brand">
                  {i + 1}
                </span>
                <div className="pt-0.5">
                  <button
                    onClick={() => sendText(s.k)}
                    className="text-[15px] font-semibold text-ink underline decoration-line-strong decoration-2 underline-offset-4 transition-colors hover:decoration-brand"
                  >
                    {s.title}
                  </button>
                  <p className="mt-1 text-[15px] leading-relaxed text-muted">{s.body}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="mt-10 flex max-w-xs flex-col gap-2">
            <label htmlFor="phone" className="text-[11px] font-semibold uppercase tracking-[0.14em] text-muted">
              Simulated retailer number
            </label>
            <input
              id="phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value.trim())}
              className="tnum rounded-lg border border-line bg-surface px-3.5 py-2.5 text-[15px] text-ink outline-none transition-colors focus:border-brand"
            />
            <p className="text-[13px] text-muted">Must match a seeded retailer to place a live order.</p>
          </div>
        </div>

        {/* Phone-framed WhatsApp chat — right. */}
        <div className="mx-auto w-full max-w-[400px] lg:sticky lg:top-24">
          <div className="rounded-[2.6rem] border border-line-strong bg-ink p-2.5 shadow-[0_30px_60px_-24px_rgba(12,38,38,0.35)]">
            <div className="relative overflow-hidden rounded-[2.1rem] bg-[#0b141a]">
              <span className="absolute left-1/2 top-2 z-10 h-1.5 w-16 -translate-x-1/2 rounded-full bg-black/40" />

              {/* WhatsApp header (authentic dark WhatsApp styling). */}
              <div className="flex items-center gap-3 bg-[#1f2c34] px-4 pb-3 pt-6">
                <img
                  src="/brand/orderwise-mark.png"
                  alt=""
                  className="h-9 w-9 rounded-full bg-white p-1"
                />
                <div className="leading-tight">
                  <div className="text-[15px] font-semibold text-white">OrderWise</div>
                  <div className="flex items-center gap-1.5 text-[12px] text-emerald-400">
                    <span className="live-dot h-1.5 w-1.5 rounded-full bg-emerald-400" />
                    online
                  </div>
                </div>
              </div>

              {/* Messages. */}
              <div className="flex h-[26rem] flex-col gap-1.5 overflow-y-auto px-3.5 py-4">
                {messages.map((m, i) => (
                  <div key={i} className={`flex ${m.from === 'me' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`fade max-w-[82%] whitespace-pre-wrap rounded-xl px-3 py-2 text-[14px] leading-relaxed shadow-sm ${
                        m.from === 'me'
                          ? 'rounded-br-sm bg-[#005c4b] text-white'
                          : 'rounded-bl-sm bg-[#1f2c34] text-slate-100'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                {sending && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-1 rounded-xl rounded-bl-sm bg-[#1f2c34] px-3.5 py-3">
                      {[0, 1, 2].map((d) => (
                        <span
                          key={d}
                          className="h-1.5 w-1.5 rounded-full bg-slate-400"
                          style={{ animation: `blink 1.2s ${d * 0.18}s ease-in-out infinite` }}
                        />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Quick replies + input. */}
              <div className="bg-[#1f2c34] px-3 pb-3 pt-2.5">
                <div className="mb-2.5 flex flex-wrap gap-1.5">
                  {QUICK.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendText(q)}
                      disabled={sending}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[12px] font-medium text-slate-200 transition-colors hover:bg-white/10 disabled:opacity-40"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    sendText(draft.trim());
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    placeholder="Type a message"
                    className="min-w-0 flex-1 rounded-full bg-[#2a3942] px-4 py-2.5 text-[14px] text-white placeholder-slate-500 outline-none"
                  />
                  <button
                    type="submit"
                    disabled={sending || !draft.trim()}
                    aria-label="Send"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25d366] text-[#0b141a] transition-all hover:brightness-105 active:scale-95 disabled:opacity-40"
                  >
                    <Icon name="send" className="h-[18px] w-[18px]" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
