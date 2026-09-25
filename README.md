# OrderWise — web

Role-based web dashboards for OrderWise (FYP, FAST-NUCES Karachi, 2026–27). The
API lives in [`OrderWise-Backend`](https://github.com/sameerzuberi991/OrderWise-Backend).

> **Status:** React + Vite (JavaScript) prototype. Per the proposal, this will
> move to TypeScript.

## Team plans

Per-member plans for this repo (phases, order, and who does what, from the
approved proposal):

- [Unaiza](unaiza.plan.md): WhatsApp / NLU Lead
- [Sameer](sameer.plan.md): Apps & Reconciliation Lead
- [Faizan](faizan.plan.md): Core Engine Lead

## Setup

Run the backend first (`orderwise-backend`, default `http://localhost:3001`).

```bash
npm install
cp .env.example .env      # VITE_API_URL — base URL of the backend
npm run dev               # http://localhost:5173
```

`npm run build` outputs a static site to `dist/`.

## Pages

| Route | What |
|---|---|
| `/retailer` | WhatsApp chat simulator — posts to the backend webhook, no WhatsApp needed |
| `/distributor` | Incoming orders grouped by area, fulfil action, stock sidebar |
| `/inventory` | Stock room: add items, edit price/stock/due date, remove expired |
| `/brand` | Sales analytics (out of scope in the proposal — to be folded into the distributor dashboard) |

## Deploying

Any static host (e.g. Vercel, framework preset *Vite*). Set `VITE_API_URL` to
the deployed backend URL at build time.
