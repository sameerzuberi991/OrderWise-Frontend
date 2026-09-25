# Faizan — frontend plan

**Role:** Core Engine Lead (proposal §9, Table 2)
**Your frontend touchpoints:** your main work is backend (see
[`faizan.plan.md`](https://github.com/sameerzuberi991/OrderWise-Backend/blob/main/faizan.plan.md) in `OrderWise-Backend`).
The proposal has each member own their module's frontend touchpoints. For the
engine, that means **how decisions and explanations are shown** and an internal
**trace/evaluation view**.

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

Nothing engine-related exists in the UI yet. The app is React + Vite in JavaScript;
Sameer is migrating it to TypeScript in Phase 0. Build your pieces in TypeScript
on top of that.

---

## Phase 1 — Explanation component (Oct – Nov 2026)

- [ ] A shared **`Explanation`** component: a short "Why?" reveal that shows the
      engine's justification next to a suggestion, offer or price
  - Shows the explanation text and, expandable, the key trace facts behind it
    (e.g. "usually orders every 9 days, last order 8 days ago")
  - Links to the trace ID (useful in demos and for evaluation)
- [ ] Hand it to Sameer for the retailer dashboard's offers and reorder suggestions

## Phase 2 — Trace explorer, basic (Dec 2026)

- [ ] Internal, distributor/admin-only **Trace Explorer** page: a list of recent
      engine decisions with filters by action type, retailer and date
- [ ] Decision detail: inputs, rules fired, chosen action/price, explanation, model
      and prompt version
- [ ] Use it during FYP-I integration to debug the engine against real interactions

## Phase 3 — Negotiation visibility (Jan – Feb 2027)

- [ ] Show negotiation rounds in the trace detail: offer → counter → final, with
      the floor marked, to make the "never below floor" guarantee visible
- [ ] Support Sameer's price-floor and offer configuration forms with the
      validation rules the engine expects

## Phase 4 — Evaluation dashboard (Mar – Apr 2027)

- [ ] Extend the Trace Explorer with LLM-as-judge scores: **decision correctness**
      and **explanation faithfulness** per trace
- [ ] Aggregate view: scores by action type and over time, plus the lowest-scoring
      traces for review
- [ ] Use these views for the evaluation chapter figures

## Phase 5 — Wrap up (Apr – May 2027)

- [ ] Polish for the final defense demo (the trace + score view is how the
      contribution gets *shown*)
- [ ] Document the Explanation component and the Trace Explorer in the manuals

---

## Notes

- The Trace Explorer is an internal tool, not a retailer feature. Keep it behind
  the distributor/admin role.
- Use the colour tokens in `src/index.css`; don't hard-code hex values.
