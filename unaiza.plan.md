# Unaiza — frontend plan

**Role:** WhatsApp / NLU Lead (proposal §9, Table 2)
**Your frontend touchpoints:** your main work is backend (see
[`unaiza.plan.md`](https://github.com/sameerzuberi991/OrderWise-Backend/blob/main/unaiza.plan.md) in `OrderWise-Backend`).
The retailer's real interface is WhatsApp itself. In this repo you own the **WhatsApp
simulator** used for development, testing and demos, plus NLU debugging views.

---

## Project phases (whole team)

| # | Phase | When | Goal |
|---|-------|------|------|
| 0 | Foundation | Aug – Sep 2026 | Proposal defended, literature review, SRS/SDS, FastAPI + TypeScript skeletons, shared interfaces agreed |
| 1 | Retailer slice build | Oct – Nov 2026 | Each module's v1 built in isolation against agreed interfaces |
| 2 | Integration & FYP-I defense | Dec 2026 | Retailer vertical slice working end-to-end, live demo |
| 3 | Negotiation & distributor | Jan – Feb 2027 | Engine v2 (negotiation), distributor features |
| 4 | Mobile, robustness, evaluation | Mar – Apr 2027 | Mobile app + offline sync, code-switch hardening, LLM-as-judge built |
| 5 | Prove it & wrap up | Apr – May 2027 | Run evaluation, testing, manuals, final report, final defense |

---

## Where the code is today

- `src/pages/Retailer.jsx` is a **phone-framed WhatsApp chat simulator**. It posts to
  the backend webhook as a simulated retailer number and renders the replies, with
  quick-reply chips for the numbered-menu flow.
- It's JavaScript; Sameer migrates the app to TypeScript in Phase 0.
- Once Sameer builds the real retailer dashboard, the simulator moves off the
  retailer tab to its own internal route.

---

## Phase 1 — Simulator on the new stack (Oct – Nov 2026)

- [ ] Move the simulator to its own internal route (e.g. `/dev/whatsapp`) behind
      the distributor/admin role, so it stops occupying the retailer tab
- [ ] Point it at the FastAPI webhook and keep it working with Redis-backed sessions
- [ ] Let it pick any seeded retailer number (for testing different histories)

## Phase 2 — NLU debug panel + FYP-I (Dec 2026)

- [ ] Side panel beside the chat showing, per message: the **detected language/script**,
      the **structured `Intent`**, resolved products (with pgvector match scores), and
      the engine's decision + trace ID
- [ ] Quick-reply chips updated for code-switched examples (Roman Urdu, Urdu script,
      mixed) instead of just menu numbers
- [ ] Rehearse the FYP-I demo through it as a backup in case the real WhatsApp
      number or network fails on the day

## Phase 3 — Negotiation in the simulator (Jan – Feb 2027)

- [ ] Show the negotiation state (round, current offer, accepted/rejected) in the
      debug panel during multi-turn bargaining

## Phase 4 — Robustness test runner (Mar – Apr 2027)

- [ ] Page to run your labelled code-switch test set against the live NLU, showing
      pass/fail per message and overall intent/item accuracy
- [ ] Use it to track robustness improvements across the phase

## Phase 5 — Wrap up (Apr – May 2027)

- [ ] Final demo polish, and screenshots for the Testing Manual (NLU accuracy results)

---

## Notes

- Keep the simulator's authentic WhatsApp dark styling. Everything else uses the
  tokens in `src/index.css`.
