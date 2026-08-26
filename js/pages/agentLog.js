import { getState, formatDateTime, vendorById, currency } from "../store.js";
import { icons } from "../icons.js";

let typeFilter = "all";

const typeMeta = {
  "auto-approved": { label: "Auto-Approved", icon: "check", cls: "green" },
  "auto-flagged": { label: "Auto-Flagged", icon: "alert", cls: "amber" },
  "manual-approved": { label: "Manually Approved", icon: "check", cls: "blue" },
  "manual-rejected": { label: "Manually Rejected", icon: "x", cls: "red" },
};

export function render(container, ctx) {
  const state = getState();
  const counts = { "auto-approved": 0, "auto-flagged": 0, "manual-approved": 0, "manual-rejected": 0 };
  state.agentLog.forEach((l) => { if (counts[l.type] !== undefined) counts[l.type]++; });
  const manualOverrides = counts["manual-approved"] + counts["manual-rejected"];

  let list = [...state.agentLog];
  if (typeFilter !== "all") list = list.filter((l) => l.type === typeFilter);

  const filters = [
    { key: "all", label: "All" },
    { key: "auto-approved", label: "Auto-Approved" },
    { key: "auto-flagged", label: "Auto-Flagged" },
    { key: "manual-approved", label: "Manual Approvals" },
    { key: "manual-rejected", label: "Manual Rejections" },
  ];

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Agent Log</h1>
        <p>Full audit trail of every automated and manual decision</p>
      </div>
    </div>

    <div class="stat-grid">
      <div class="stat-card">
        <div class="stat-card-top"><span class="stat-label">Auto-Approved</span><span class="stat-icon">${icons.robot}</span></div>
        <div class="stat-value green">${counts["auto-approved"]}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top"><span class="stat-label">Auto-Flagged</span><span class="stat-icon">${icons.alert}</span></div>
        <div class="stat-value amber">${counts["auto-flagged"]}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top"><span class="stat-label">Manual Overrides</span><span class="stat-icon">${icons.edit}</span></div>
        <div class="stat-value">${manualOverrides}</div>
      </div>
      <div class="stat-card">
        <div class="stat-card-top"><span class="stat-label">Total Decisions</span><span class="stat-icon">${icons.log}</span></div>
        <div class="stat-value">${state.agentLog.length}</div>
      </div>
    </div>

    <div class="toolbar">
      <div class="chip-group">
        ${filters.map((f) => `<div class="chip ${typeFilter === f.key ? "active" : ""}" data-filter="${f.key}">${f.label}</div>`).join("")}
      </div>
    </div>

    <div class="panel">
      ${list.length ? list.map((l) => {
        const expense = state.expenses.find((e) => e.id === l.expenseId);
        const v = expense ? vendorById(expense.vendorId) : null;
        const meta = typeMeta[l.type] || { label: l.type, icon: "log", cls: "gray" };
        return `
          <div class="log-entry">
            <div class="log-icon ${meta.cls}">${icons[meta.icon]}</div>
            <div class="log-body">
              <div class="log-top">
                <div class="log-title">${meta.label} — ${l.expenseId}${v ? ` · ${v.name}` : ""}${expense ? ` · ${currency(expense.amount)}` : ""}</div>
                <div class="log-time">${formatDateTime(l.timestamp)}</div>
              </div>
              <div class="log-reason">${l.reason}</div>
            </div>
          </div>`;
      }).join("") : `<div class="empty-state">No agent activity yet.</div>`}
    </div>
  `;

  container.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      typeFilter = chip.dataset.filter;
      ctx.refresh();
    })
  );
}
