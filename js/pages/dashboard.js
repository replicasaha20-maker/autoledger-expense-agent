import { getState, currency, formatDate, vendorById, categoryById, monthLabel, monthKey, categorySpentThisMonth } from "../store.js";
import { icons } from "../icons.js";
import { statusBadge, showToast, openModal, closeModal } from "../ui.js";
import { runAgent } from "../agent.js";

export function render(container, ctx) {
  const state = getState();
  const expenses = state.expenses;

  const totalExpenses = expenses.length;
  const totalSpend = expenses.filter((e) => e.status === "approved").reduce((s, e) => s + e.amount, 0);
  const needsReview = expenses.filter((e) => e.status === "pending" || e.status === "flagged").length;
  const autoApproved = state.agentLog.filter((l) => l.type === "auto-approved").length;

  const statusCounts = { pending: 0, approved: 0, flagged: 0, rejected: 0 };
  expenses.forEach((e) => statusCounts[e.status]++);
  const statusColors = { pending: "#3b6fd6", approved: "#1ba672", flagged: "#b7791f", rejected: "#d64545" };
  const maxStatus = Math.max(1, ...Object.values(statusCounts));

  const months = [...new Set(expenses.map((e) => monthKey(e.date)))].sort().slice(-4);
  const monthTotals = months.map((m) => ({
    label: monthLabel(m + "-01"),
    total: expenses.filter((e) => monthKey(e.date) === m && (e.status === "approved" || e.status === "flagged")).reduce((s, e) => s + e.amount, 0),
  }));
  const maxMonth = Math.max(1, ...monthTotals.map((m) => m.total));

  const overBudget = state.categories
    .map((c) => ({ c, spent: categorySpentThisMonth(c.id) }))
    .filter((x) => x.spent / x.c.budget >= 0.75)
    .sort((a, b) => b.spent / b.c.budget - a.spent / a.c.budget)
    .slice(0, 3);

  const recent = [...expenses].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 6);

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Dashboard</h1>
        <p>Your expense pipeline at a glance</p>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-top"><span class="stat-label">Total Expenses</span><span class="stat-icon">${icons.budgets}</span></div>
        <div class="stat-value">${totalExpenses}</div>
        <div class="stat-sub">${expenses.filter((e) => monthKey(e.date) === monthKey(new Date().toISOString())).length} this month</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top"><span class="stat-label">Total Spend</span><span class="stat-icon">${icons.bolt}</span></div>
        <div class="stat-value">${currency(totalSpend)}</div>
        <div class="stat-sub">approved total</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top"><span class="stat-label">Needs Review</span><span class="stat-icon">${icons.alert}</span></div>
        <div class="stat-value amber">${needsReview}</div>
        <div class="stat-sub">action required</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top"><span class="stat-label">Auto-Approved</span><span class="stat-icon">${icons.robot}</span></div>
        <div class="stat-value green">${autoApproved}</div>
        <div class="stat-sub">handled without a human</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="panel-title">Spend by Month</div>
        <div class="bars">
          ${monthTotals.map((m) => `
            <div class="bar-col">
              <div style="font-size:11px;color:var(--text-faint)">${m.total > 0 ? currency(m.total) : ""}</div>
              <div class="bar" style="height:${Math.max(6, (m.total / maxMonth) * 130)}px"></div>
              <div class="bar-month">${m.label}</div>
            </div>`).join("")}
        </div>
      </div>
      <div class="panel">
        <div class="panel-title">Expense Status</div>
        <div class="status-rows">
          ${Object.entries(statusCounts).map(([key, count]) => `
            <div class="status-row">
              <span class="status-dot" style="background:${statusColors[key]}"></span>
              <span class="status-name">${key[0].toUpperCase() + key.slice(1)}</span>
              <span class="status-count">${count}</span>
              <div class="status-track"><div class="status-track-fill" style="width:${(count / maxStatus) * 100}%;background:${statusColors[key]}"></div></div>
            </div>`).join("")}
        </div>
      </div>
    </div>

    ${overBudget.length ? `
    <div class="alert-box">
      <div class="alert-box-title">${icons.alert} ${overBudget.length} Budget Alert${overBudget.length > 1 ? "s" : ""}</div>
      ${overBudget.map((x) => `
        <div class="alert-row">
          <span>${x.c.name}</span>
          <span class="amt">${currency(x.spent)} / ${currency(x.c.budget)}</span>
        </div>`).join("")}
    </div>` : ""}

    <div class="quick-actions">
      <button class="quick-btn accent" id="qa-run">${icons.bolt} Run Agent Now</button>
      <button class="quick-btn primary" id="qa-submit">${icons.plus} Submit Expense</button>
      <button class="quick-btn" id="qa-vendor">${icons.vendors} Add Vendor</button>
      <button class="quick-btn" id="qa-log">${icons.log} View Agent Log</button>
    </div>

    <div class="panel">
      <div class="panel-title">Recent Expenses <a id="view-all">View all →</a></div>
      ${recent.length ? `
      <table>
        <thead><tr><th>Expense</th><th>Vendor</th><th>Category</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
        <tbody>
          ${recent.map((e) => {
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
          }).join("")}
        </tbody>
      </table>` : `<div class="empty-state">No expenses yet — submit one to get started.</div>`}
    </div>
  `;

  container.querySelector("#qa-run").addEventListener("click", () => {
    const result = runAgent();
    if (result.processed === 0) {
      showToast("No pending expenses to review right now.");
    } else {
      showToast(`Agent processed ${result.processed} expense${result.processed > 1 ? "s" : ""} — ${result.approvedCount} approved, ${result.flaggedCount} flagged.`);
    }
    ctx.refresh();
  });
  container.querySelector("#qa-submit").addEventListener("click", () => ctx.navigate("submit"));
  container.querySelector("#qa-vendor").addEventListener("click", () => ctx.navigate("vendors", { openAdd: true }));
  container.querySelector("#qa-log").addEventListener("click", () => ctx.navigate("log"));
  container.querySelector("#view-all").addEventListener("click", () => ctx.navigate("approvals"));
}
