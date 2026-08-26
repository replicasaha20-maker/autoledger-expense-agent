import { getState, currency, formatDate, vendorById, categoryById } from "../store.js";
import { icons } from "../icons.js";
import { statusBadge, openModal, closeModal, showToast } from "../ui.js";
import { runAgent, manualOverride } from "../agent.js";

let searchTerm = "";
let statusFilter = "all";

function latestLog(state, expenseId) {
  return state.agentLog.find((l) => l.expenseId === expenseId);
}

function openReasoning(state, expense) {
  const v = vendorById(expense.vendorId);
  const c = categoryById(expense.categoryId);
  const log = latestLog(state, expense.id);
  openModal(`
    <h2>${expense.id}</h2>
    <p class="modal-sub">${v ? v.name : "—"} · ${c ? c.name : "—"} · ${currency(expense.amount)} · ${formatDate(expense.date)}</p>
    ${expense.description ? `<div class="reason-row" style="border-left-color:var(--border);margin-bottom:12px">${expense.description}</div>` : ""}
    <div style="font-size:12.5px;font-weight:700;color:var(--text-dim);margin-bottom:6px">Agent Reasoning</div>
    <div class="reason-row">${log ? log.reason : "This expense hasn't been reviewed by the agent yet. Click \"Run Agent\" to process it."}</div>
    <div class="modal-actions">
      <button type="button" class="btn btn-outline" id="close-reasoning">Close</button>
    </div>
  `, {
    onMount: (overlay) => overlay.querySelector("#close-reasoning").addEventListener("click", closeModal),
  });
}

export function render(container, ctx) {
  const state = getState();
  const term = searchTerm.toLowerCase();

  let list = [...state.expenses].sort((a, b) => new Date(b.date) - new Date(a.date));
  if (statusFilter !== "all") list = list.filter((e) => e.status === statusFilter);
  if (term) {
    list = list.filter((e) => {
      const v = vendorById(e.vendorId);
      return e.id.toLowerCase().includes(term) || (v && v.name.toLowerCase().includes(term));
    });
  }

  const pendingCount = state.expenses.filter((e) => e.status === "pending").length;
  const filters = ["all", "pending", "approved", "flagged", "rejected"];

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Approvals</h1>
        <p>${state.expenses.length} total expenses · ${pendingCount} awaiting the agent</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-accent" id="run-agent" ${pendingCount === 0 ? "disabled" : ""}>${icons.bolt} Run Agent${pendingCount ? ` (${pendingCount})` : ""}</button>
      </div>
    </div>

    <div class="toolbar">
      <input class="search-input" id="search" placeholder="Search by expense ID or vendor…" value="${searchTerm}" />
      <div class="chip-group">
        ${filters.map((f) => `<div class="chip ${statusFilter === f ? "active" : ""}" data-filter="${f}">${f[0].toUpperCase() + f.slice(1)}</div>`).join("")}
      </div>
    </div>

    <div class="panel" style="padding:0">
      ${list.length ? `
      <table>
        <thead><tr><th style="padding-left:22px">Expense</th><th>Vendor</th><th>Category</th><th>Date</th><th>Amount</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${list.map((e) => {
            const v = vendorById(e.vendorId);
            const c = categoryById(e.categoryId);
            return `<tr>
              <td style="padding-left:22px" class="cell-mono">${e.id}</td>
              <td class="cell-strong">${v ? v.name : "—"}</td>
              <td>${c ? c.name : "—"}</td>
              <td class="cell-dim">${formatDate(e.date)}</td>
              <td class="cell-strong">${currency(e.amount)}</td>
              <td>${statusBadge(e.status)}</td>
              <td style="white-space:nowrap">
                <button class="btn-icon view-reason" data-id="${e.id}" title="View reasoning">${icons.eye}</button>
                ${e.status === "pending" || e.status === "flagged" ? `
                  <button class="btn-icon approve-btn" data-id="${e.id}" title="Approve" style="color:var(--green)">${icons.check}</button>
                  <button class="btn-icon reject-btn" data-id="${e.id}" title="Reject" style="color:var(--red)">${icons.x}</button>
                ` : ""}
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>` : `<div class="empty-state">No expenses match your filters.</div>`}
    </div>
  `;

  container.querySelector("#run-agent").addEventListener("click", () => {
    const result = runAgent();
    showToast(result.processed === 0
      ? "Nothing pending to review."
      : `Processed ${result.processed} expense${result.processed > 1 ? "s" : ""} — ${result.approvedCount} approved, ${result.flaggedCount} flagged.`);
    ctx.refresh();
  });

  container.querySelector("#search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    ctx.refresh();
  });

  container.querySelectorAll(".chip").forEach((chip) =>
    chip.addEventListener("click", () => {
      statusFilter = chip.dataset.filter;
      ctx.refresh();
    })
  );

  container.querySelectorAll(".view-reason").forEach((btn) =>
    btn.addEventListener("click", () => openReasoning(state, state.expenses.find((e) => e.id === btn.dataset.id)))
  );
  container.querySelectorAll(".approve-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const e = state.expenses.find((x) => x.id === btn.dataset.id);
      manualOverride(e.id, "approved");
      showToast(`${e.id} manually approved.`);
      ctx.refresh();
    })
  );
  container.querySelectorAll(".reject-btn").forEach((btn) =>
    btn.addEventListener("click", () => {
      const e = state.expenses.find((x) => x.id === btn.dataset.id);
      manualOverride(e.id, "rejected");
      showToast(`${e.id} manually rejected.`);
      ctx.refresh();
    })
  );
}
