# AutoLedger — Expense Approval Agent

A small business expense/invoice approval tool with a self-functioning
automation agent built in. It's a static, client-side app — no backend,
no database, no API keys. All data lives in the browser's
`localStorage`, seeded with sample data on first load.

## What it does

Employees submit expenses. Instead of a human reviewing every single
one, a rule-based **agent** perceives each pending expense, reasons
about it against the business's policies, and acts — auto-approving it
or flagging it for manual review — then logs a plain-English
explanation of why.

Agent rules (see [js/agent.js](js/agent.js)):
1. Vendor must be on the approved vendor list.
2. Not a likely duplicate (same vendor + amount within the configured window).
3. Must not push the expense category over its monthly budget.
4. Must be under the auto-approval dollar limit.
5. Otherwise: auto-approved.

Every decision — automatic or a manual override — is written to the
**Agent Log** with a timestamp and the reasoning behind it, so the
whole pipeline is auditable.

## Pages

- **Dashboard** — totals, spend-by-month, status breakdown, budget alerts, quick actions
- **Vendors** — approved/unapproved vendor directory
- **Budgets** — expense categories with monthly limits and live spend tracking
- **Submit Expense** — new expense form with a live "Agent Preview" of the likely decision
- **Approvals** — the full queue, batch "Run Agent" button, manual approve/reject overrides
- **Agent Log** — full audit trail of every automated and manual decision

## Running it locally

No build step, no dependencies. Just serve the folder statically, e.g.:

```bash
python3 -m http.server 8934
```

Then open `http://localhost:8934`.

(Opening `index.html` directly via `file://` won't work — browsers
block ES module imports over `file://`, so it needs to be served over
`http://`.)

## Resetting the sample data

The app seeds sample vendors/categories/expenses once, on first load.
To wipe everything and reseed, open the browser console on the page and run:

```js
localStorage.removeItem("autoledger_state_v1"); location.reload();
```

## Deploying to GitHub Pages (free)

1. Create a new GitHub repository (public, no README/template needed).
2. From this project folder:
   ```bash
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git branch -M main
   git push -u origin main
   ```
3. On GitHub: **Settings → Pages → Build and deployment → Source: "Deploy from a branch"**, branch `main`, folder `/ (root)`, then Save.
4. GitHub gives you a URL like `https://<your-username>.github.io/<repo-name>/` within a minute or two.

No further configuration needed — there's no build step and no secrets to set.
