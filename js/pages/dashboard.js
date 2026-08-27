import { getState, currency, formatDate, vendorById, categoryById, monthLabel, monthKey, categorySpentThisMonth } from "../store.js";
import { icons } from "../icons.js";
import { statusBadge, showToast } from "../ui.js";
import { runAgent } from "../agent.js";

function shortMoney(n) {
  n = Math.round(n);
  if (Math.abs(n) >= 1000) {
    const k = n / 1000;
    return "$" + (Number.isInteger(k) ? k : k.toFixed(1)) + "k";
  }
  return "$" + n;
}

// Catmull-Rom spline through points -> smooth SVG cubic path
function splinePath(pts) {
  if (pts.length === 0) return "";
  if (pts.length === 1) return `M ${pts[0][0]} ${pts[0][1]}`;
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C ${c1x.toFixed(1)} ${c1y.toFixed(1)}, ${c2x.toFixed(1)} ${c2y.toFixed(1)}, ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

function areaChart(data, { w = 660, h = 210, padL = 46, padR = 18, padT = 16, padB = 30, showAxis = true } = {}) {
  const iw = w - padL - padR;
  const ih = h - padT - padB;
  const max = Math.max(1, ...data.map((d) => d.total));
  const xAt = (i) => padL + (data.length <= 1 ? iw / 2 : (i / (data.length - 1)) * iw);
  const yAt = (v) => padT + ih - (v / max) * ih;
  const pts = data.map((d, i) => [xAt(i), yAt(d.total)]);
  const line = splinePath(pts);
  const baseY = (padT + ih).toFixed(1);
  const area = pts.length
    ? `${line} L ${pts[pts.length - 1][0].toFixed(1)} ${baseY} L ${pts[0][0].toFixed(1)} ${baseY} Z`
    : "";
  const peakIdx = data.reduce((mi, d, i, a) => (d.total > a[mi].total ? i : mi), 0);

  const grid = showAxis
    ? [0, 0.5, 1]
        .map((f) => {
          const gy = padT + ih - f * ih;
          return `<line class="trend-grid-line" x1="${padL}" y1="${gy.toFixed(1)}" x2="${w - padR}" y2="${gy.toFixed(1)}"/>
            <text class="trend-axis-label" x="${padL - 8}" y="${(gy + 3).toFixed(1)}" text-anchor="end">${shortMoney(max * f)}</text>`;
        })
        .join("")
    : "";

  const monthLabels = data
    .map((d, i) => `<text class="trend-month-label" x="${xAt(i).toFixed(1)}" y="${h - 9}" text-anchor="middle">${d.label}</text>`)
    .join("");

  const dots = pts
    .map(
      (p, i) =>
        `<circle class="trend-dot ${i === peakIdx ? "trend-dot-peak" : ""}" cx="${p[0].toFixed(1)}" cy="${p[1].toFixed(1)}" r="${i === peakIdx ? 4.5 : 3.5}"/>`
    )
    .join("");

  const peakTag =
    pts.length && data[peakIdx].total > 0
      ? `<text class="trend-axis-label" x="${pts[peakIdx][0].toFixed(1)}" y="${(pts[peakIdx][1] - 10).toFixed(1)}" text-anchor="middle" style="font-weight:800">${shortMoney(data[peakIdx].total)}</text>`
      : "";

  return `
    <svg class="trend-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Approved spend by month">
      <defs>
        <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.3"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      ${grid}
      ${area ? `<path class="trend-area" d="${area}" fill="url(#trendFill)"/>` : ""}
      ${line ? `<path class="trend-line" d="${line}"/>` : ""}
      ${dots}
      ${peakTag}
      ${monthLabels}
    </svg>`;
}

function sparkline(values, { w = 320, h = 74 } = {}) {
  if (!values.length) return "";
  const padX = 3;
  const padY = 8;
  const max = Math.max(1, ...values);
  const min = Math.min(...values, 0);
  const iw = w - padX * 2;
  const ih = h - padY * 2;
  const xAt = (i) => padX + (values.length <= 1 ? iw / 2 : (i / (values.length - 1)) * iw);
  const yAt = (v) => padY + ih - ((v - min) / (max - min || 1)) * ih;
  const pts = values.map((v, i) => [xAt(i), yAt(v)]);
  const line = splinePath(pts);
  const area = `${line} L ${pts[pts.length - 1][0].toFixed(1)} ${h - padY} L ${pts[0][0].toFixed(1)} ${h - padY} Z`;
  const last = pts[pts.length - 1];
  return `
    <svg class="hero-spark" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--accent)" stop-opacity="0.28"/>
          <stop offset="100%" stop-color="var(--accent)" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="${area}" fill="url(#sparkFill)"/>
      <path class="trend-line" style="animation:none;stroke-dasharray:none" d="${line}" vector-effect="non-scaling-stroke"/>
      <circle cx="${last[0].toFixed(1)}" cy="${last[1].toFixed(1)}" r="3.2" fill="var(--accent)"/>
    </svg>`;
}

export function render(container, ctx) {
  const state = getState();
  const expenses = state.expenses;
  const log = state.agentLog;

  const byStatus = (s) => expenses.filter((e) => e.status === s);
  const sum = (arr) => arr.reduce((a, e) => a + e.amount, 0);

  const approved = byStatus("approved");
  const pending = byStatus("pending");
  const flagged = byStatus("flagged");
  const rejected = byStatus("rejected");

  const totalCount = expenses.length;
  const approvedSpendAll = sum(approved);
  const pendingValue = sum(pending);
  const needsReview = pending.length + flagged.length;

  const autoApproved = log.filter((l) => l.type === "auto-approved").length;
  const agentDecisions = log.filter((l) => l.type === "auto-approved" || l.type === "auto-flagged").length;
  const autoRate = agentDecisions ? Math.round((autoApproved / agentDecisions) * 100) : 0;

  const avgExpense = totalCount ? Math.round(sum(expenses) / totalCount) : 0;
  const largest = expenses.reduce((m, e) => (e.amount > (m ? m.amount : -1) ? e : m), null);
  const largestVendor = largest ? vendorById(largest.vendorId) : null;

  const approvedVendors = state.vendors.filter((v) => v.approved).length;
  const totalVendors = state.vendors.length;

  const monthSpend = state.categories.reduce((a, c) => a + categorySpentThisMonth(c.id), 0);
  const totalBudget = state.categories.reduce((a, c) => a + c.budget, 0);
  const budgetUtil = totalBudget ? Math.round((monthSpend / totalBudget) * 100) : 0;
  const catsOver = state.categories.filter((c) => categorySpentThisMonth(c.id) > c.budget).length;

  const today = new Date();
  const oldestPending = pending.reduce(
    (mx, e) => Math.max(mx, Math.round((today - new Date(e.date)) / 86400000)),
    0
  );

  // Monthly approved-spend trend
  const monthsAll = [...new Set(expenses.map((e) => monthKey(e.date)))].sort();
  const months = monthsAll.slice(-8);
  const monthApproved = (m) => sum(approved.filter((e) => monthKey(e.date) === m));
  const monthTotals = months.map((m) => ({ key: m, label: monthLabel(m + "-01"), total: monthApproved(m) }));
  const lastM = monthTotals[monthTotals.length - 1] || { label: "—", total: 0 };
  const prevM = monthTotals[monthTotals.length - 2] || { label: "—", total: 0 };

  let deltaPct = null;
  let deltaDir = "flat";
  if (prevM.total > 0) {
    deltaPct = Math.round(((lastM.total - prevM.total) / prevM.total) * 100);
    deltaDir = deltaPct > 0 ? "up" : deltaPct < 0 ? "down" : "flat";
  }
  const deltaArrow = deltaDir === "up" ? "▲" : deltaDir === "down" ? "▼" : "→";
  const deltaText =
    deltaPct === null ? "new activity" : `${deltaArrow} ${Math.abs(deltaPct)}% vs ${prevM.label}`;

  const cycleCount = approved.filter((e) => monthKey(e.date) === lastM.key).length;

  // Donut — expense status split
  const statusCounts = { pending: 0, approved: 0, flagged: 0, rejected: 0 };
  expenses.forEach((e) => statusCounts[e.status]++);
  const statusColors = { pending: "var(--blue)", approved: "var(--green)", flagged: "var(--amber)", rejected: "var(--red)" };
  let donutCursor = 0;
  const donutStops = Object.keys(statusCounts)
    .map((key) => {
      const pct = totalCount ? (statusCounts[key] / totalCount) * 100 : 0;
      const start = donutCursor;
      donutCursor += pct;
      return `${statusColors[key]} ${start}% ${donutCursor}%`;
    })
    .join(", ");

  const overBudget = state.categories
    .map((c) => ({ c, spent: categorySpentThisMonth(c.id) }))
    .filter((x) => x.spent / x.c.budget >= 0.75)
    .sort((a, b) => b.spent / b.c.budget - a.spent / a.c.budget)
    .slice(0, 3);

  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  const ledgerRows = [
    { name: "Average expense size", note: `across ${totalCount} submissions`, val: currency(avgExpense) },
    {
      name: "Largest single expense",
      note: `${largestVendor ? largestVendor.name : "—"} · ${largest ? formatDate(largest.date) : "—"}`,
      val: currency(largest ? largest.amount : 0),
    },
    {
      name: "Expenses logged",
      note: `${approved.length} approved · ${flagged.length} flagged · ${pending.length} pending`,
      val: totalCount,
    },
    { name: "Flagged for review", note: "waiting on a human decision", val: flagged.length, tone: "amber" },
    { name: "Rejected outright", note: "declined by a reviewer", val: rejected.length, tone: "red" },
    {
      name: "Approved vendors",
      note: `${totalVendors - approvedVendors} awaiting vetting`,
      val: `${approvedVendors} / ${totalVendors}`,
    },
    {
      name: "Categories over budget",
      note: catsOver ? "trim spend or raise the cap" : "all categories within limits",
      val: catsOver,
      tone: catsOver ? "amber" : "green",
    },
    {
      name: "Active categories",
      note: `${currency(totalBudget)} combined monthly budget`,
      val: state.categories.length,
    },
  ];

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Your expense pipeline at a glance</p>
      </div>
    </div>

    <div class="dash-hero">
      <div class="hero-card hero-primary">
        <div class="hero-eyebrow">Approved spend · ${lastM.label}</div>
        <div class="hero-figure">${currency(lastM.total)}</div>
        <div class="hero-meta">
          <span class="delta ${deltaDir}">${deltaText}</span>
          <span class="hero-note">${cycleCount} payment${cycleCount === 1 ? "" : "s"} cleared · ${currency(approvedSpendAll)} all-time</span>
        </div>
        ${sparkline(monthTotals.map((m) => m.total))}
      </div>
      <div class="hero-side">
        <div class="hero-card hero-metric">
          <div class="ring" style="--pct:${autoRate}">
            <div class="ring-hole"></div>
            <div class="ring-val">${autoRate}%</div>
          </div>
          <div>
            <div class="hero-metric-label">Auto-approval rate</div>
            <div class="hero-metric-sub">${autoApproved} of ${agentDecisions} agent decisions cleared without a human</div>
          </div>
        </div>
        <div class="hero-card hero-metric">
          <div class="mini-stat amber">${currency(pendingValue)}</div>
          <div>
            <div class="hero-metric-label">Awaiting review</div>
            <div class="hero-metric-sub">${needsReview} item${needsReview === 1 ? "" : "s"} in the queue · oldest ${oldestPending}d old</div>
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-title">Approved Spend Trend <span style="font-weight:600;color:var(--text-faint);font-size:12px">last ${monthTotals.length} months</span></div>
        ${areaChart(monthTotals)}
      </div>
      <div class="panel">
        <div class="panel-title">Expense Status</div>
        <div class="donut-wrap">
          <div class="donut-chart" style="background:${totalCount ? `conic-gradient(${donutStops})` : "conic-gradient(var(--border) 0% 100%)"}">
            <div class="donut-hole">
              <div class="donut-total">${totalCount}</div>
              <div class="donut-total-label">Total</div>
            </div>
          </div>
          <div class="donut-legend">
            ${Object.entries(statusCounts)
              .map(
                ([key, count]) => `
              <div class="donut-legend-row">
                <span class="donut-legend-dot" style="background:${statusColors[key]}"></span>
                <span class="donut-legend-name">${key[0].toUpperCase() + key.slice(1)}</span>
                <span class="donut-legend-count">${count}</span>
              </div>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel kpi-ledger">
        <div class="panel-title">Pipeline Metrics</div>
        ${ledgerRows
          .map(
            (r) => `
          <div class="kpi-row">
            <div class="kpi-main">
              <span class="kpi-name">${r.name}</span>
              <span class="kpi-note">${r.note}</span>
            </div>
            <span class="kpi-val ${r.tone || ""}">${r.val}</span>
          </div>`
          )
          .join("")}
      </div>
      <div class="panel">
        <div class="panel-title">Cycle Snapshot</div>
        <div class="snapshot">
          <div class="snap-util">
            <div class="ring ${budgetUtil > 90 ? "amber" : ""}" style="--pct:${Math.min(100, budgetUtil)}">
              <div class="ring-hole"></div>
              <div class="ring-val">${budgetUtil}%</div>
            </div>
            <div>
              <div class="snap-util-label">Budget used this cycle</div>
              <div class="snap-util-sub">${currency(monthSpend)} of ${currency(totalBudget)} across ${state.categories.length} categories</div>
            </div>
          </div>
          <div class="snap-row"><span class="snap-k">This cycle approved</span><span class="snap-v">${currency(lastM.total)}</span></div>
          <div class="snap-row"><span class="snap-k">Previous cycle (${prevM.label})</span><span class="snap-v">${currency(prevM.total)}</span></div>
          <div class="snap-row"><span class="snap-k">Value awaiting review</span><span class="snap-v">${currency(pendingValue)}</span></div>
          <div class="snap-row"><span class="snap-k">Oldest pending item</span><span class="snap-v">${oldestPending} days</span></div>
          <div class="snap-row"><span class="snap-k">Agent decisions logged</span><span class="snap-v">${agentDecisions}</span></div>
        </div>
      </div>
    </div>

    ${
      overBudget.length
        ? `
    <div class="alert-box">
      <div class="alert-box-title">${icons.alert} ${overBudget.length} Budget Alert${overBudget.length > 1 ? "s" : ""}</div>
      ${overBudget
        .map(
          (x) => `
        <div class="alert-row">
          <span>${x.c.name}</span>
          <span class="amt">${currency(x.spent)} / ${currency(x.c.budget)}</span>
        </div>`
        )
        .join("")}
    </div>`
        : ""
    }

    <div class="quick-actions">
      <button class="quick-btn accent" id="qa-run"><span class="quick-btn-icon">${icons.bolt}</span><span class="quick-btn-label">Run Agent Now</span></button>
      <button class="quick-btn primary" id="qa-submit"><span class="quick-btn-icon">${icons.plus}</span><span class="quick-btn-label">Submit Expense</span></button>
      <button class="quick-btn" id="qa-vendor"><span class="quick-btn-icon">${icons.vendors}</span><span class="quick-btn-label">Add Vendor</span></button>
      <button class="quick-btn" id="qa-log"><span class="quick-btn-icon">${icons.log}</span><span class="quick-btn-label">View Agent Log</span></button>
    </div>

    <div class="panel">
      <div class="panel-title">Recent Expenses <a id="view-all">View all →</a></div>
      ${
        recent.length
          ? `
      <table>
        <thead><tr><th>Expense</th><th>Vendor</th><th>Category</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          ${recent
            .map((e) => {
              const v = vendorById(e.vendorId);
              const c = categoryById(e.categoryId);
              return `<tr>
              <td class="cell-mono">${e.id}</td>
              <td class="cell-strong">${v ? v.name : "—"}</td>
              <td>${c ? c.name : "—"}</td>
              <td class="cell-dim">${formatDate(e.date)}</td>
              <td class="cell-strong">${currency(e.amount)}</td>
              <td>${statusBadge(e.status)}</td>
            </tr>`;
            })
            .join("")}
        </tbody>
      </table>`
          : `<div class="empty-state">No expenses yet — submit one to get started.</div>`
      }
    </div>
  `;

  container.querySelector("#qa-run").addEventListener("click", () => {
    const result = runAgent();
    if (result.processed === 0) {
      showToast("No pending expenses to review right now.");
    } else {
      showToast(
        `Agent processed ${result.processed} expense${result.processed > 1 ? "s" : ""} — ${result.approvedCount} approved, ${result.flaggedCount} flagged.`
      );
    }
    ctx.refresh();
  });
  container.querySelector("#qa-submit").addEventListener("click", () => ctx.navigate("submit"));
  container.querySelector("#qa-vendor").addEventListener("click", () => ctx.navigate("vendors", { openAdd: true }));
  container.querySelector("#qa-log").addEventListener("click", () => ctx.navigate("log"));
  container.querySelector("#view-all").addEventListener("click", () => ctx.navigate("approvals"));
}
