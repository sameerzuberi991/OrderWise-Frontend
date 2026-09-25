# Sameer — frontend plan

**Role:** Apps & Reconciliation Lead (proposal §9, Table 2)
**You own:** the role-based **Web App** (React + TypeScript) and the role-based
**Mobile App** (React Native). Each renders both the retailer and distributor
dashboards. You also own the reconciliation UI and the mobile offline queue.
**Backend counterpart:** [`sameer.plan.md`](https://github.com/sameerzuberi991/OrderWise-Backend/blob/main/sameer.plan.md) in `OrderWise-Backend`.

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

Phases run in this order. Phase 2 cannot start until each member's Phase 1
interfaces are stable.

---

## Where the code is today

The app is React + Vite in **JavaScript**, with Tailwind v4 and the OrderWise brand
tokens in `src/index.css`. It has **no login and no roles**: four tabs, and anyone
sees everything.

| Page | Today | Becomes |
|------|-------|---------|
| `Retailer.jsx` | WhatsApp chat simulator | Unaiza's dev/test tool (see her plan). The retailer *dashboard* is new. |
| `Distributor.jsx` | Incoming orders by route, fulfil button, stock sidebar | Distributor order-intake view (Phase 3) |
| `Inventory.jsx` | Product CRUD, restock, expiry | Distributor inventory + prices, **price floors**, offers (Phase 3) |
| `Brand.jsx` | Brand analytics | **Brand persona is out of scope.** Reuse its charts for the distributor's demand overview, then delete it. |

---

## Phase 0 — Foundation (Aug – Sep 2026)

- [x] Proposal finalization & defense (Aug)
- [ ] Literature review: OCR / invoice matching, offline sync (Sep)
- [ ] Write the **Web/Mobile app** sections of the SRS/SDS: screens per role,
      navigation, offline behaviour
- [ ] **Migrate to TypeScript** (`.jsx` → `.tsx`, strict mode) and type the API client
- [ ] Login screen and role-based routing (`/retailer/*` vs `/distributor/*`),
      driven by the backend's RBAC
- [ ] Remove the Brand tab from navigation (keep `Brand.jsx` until Phase 3 reuses it)

## Phase 1 — Retailer Web App + dashboard + khata (Oct – Nov 2026)

- [ ] Order history and live order status, plus **one-tap reorder** from a past order
- [ ] **Khata:** current balance and statement of dues to the distributor
- [ ] **Active offers** that apply to this retailer
- [ ] **Reorder suggestions** ahead of predicted stock-outs, each with a "Why?"
      explanation (use Faizan's shared `Explanation` component)
- [ ] Empty, loading and error states for every panel (the existing `ui.jsx`
      primitives cover this)
- [ ] Mobile-width layout. Retailers will open this on phones.

## Phase 2 — Reconciliation v1 UI, retailer side + FYP-I (Dec 2026)

- [ ] Invoice capture: photo/file upload, plus a manual line-item entry form
- [ ] Processing state while the OCR job runs (it's async on the backend)
- [ ] Result view: matched lines vs flagged lines, with the plain-language
      explanation for each discrepancy
- [ ] FYP-I demo walkthrough: order → reminder/discount → reconcile an invoice

**FYP-I deliverable:** the retailer Web App and dashboard (orders, khata, offers,
reorder suggestions) plus the reconciliation v1 UI.

## Phase 3 — Distributor dashboard + reconciliation v2 (Jan – Feb 2027)

- [ ] **Order intake:** incoming and in-progress orders across all retailers, on one
      view. Evolve `Distributor.jsx`.
- [ ] **Inventory & configuration:** stock levels, products, prices, **price floors**,
      offers and discount rules. Evolve `Inventory.jsx`, and validate that a floor
      never exceeds the price.
- [ ] **Receivables:** khata per retailer (who owes what)
- [ ] **Reconciliation status per retailer**, and the cross-retailer view
- [ ] **Demand overview:** order volume across retailers and top-selling products.
      Reuse the `Brand.jsx` charts, then delete `Brand.jsx`.

## Phase 4 — Mobile App + offline sync (Mar – Apr 2027)

> **Decide first:** a separate `OrderWise-Mobile` repo, or a `mobile/` folder here
> sharing types with the web app. The proposal doesn't say. A shared types package
> is the main argument for keeping it in this repo.

- [ ] React Native app with both personas' dashboards, reusing the web app's
      API client and types
- [ ] **SQLite offline cache and order queue**. Retailers can place orders with no
      connectivity.
- [ ] **Sync on reconnect.** Replay the queue with client-generated IDs (idempotent),
      and show conflicts the server returns (stock gone, price changed, offer expired)
      for the user to resolve
- [ ] Clear online/offline/syncing indicator

## Phase 5 — Testing & docs (Apr – May 2027)

- [ ] UI tests for the key flows (login, reorder, reconcile, offline order → sync)
- [ ] Bug fixes and a pass over accessibility and phone layouts
- [ ] **User Manual** for retailers and distributors (screenshots from both apps)
- [ ] Your parts of the Testing Manual and final report, and the final defense demo

---

## Interfaces

**You depend on:**
- Your own backend APIs (orders, khata, reconciliation, sync, auth)
- **Faizan:** the `Explanation` component and the offers/suggestions data
- **Unaiza:** nothing in the UI directly. The WhatsApp simulator page is hers to maintain.

## Notes

- Keep brand colours to the tokens in `src/index.css`: green for brand, brick red
  only for warnings. Don't hard-code hex values in components.
