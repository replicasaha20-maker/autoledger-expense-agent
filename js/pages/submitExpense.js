import { getState, saveState, uid, currency, categorySpentThisMonth } from "../store.js";
import { icons } from "../icons.js";
import { previewDecision, evaluateAndApply } from "../agent.js";
import { showToast } from "../ui.js";

export function render(container, ctx) {
  const state = getState();
  const todayIso = new Date().toISOString().slice(0, 10);

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Submit Expense</h1>
        <p>Create a new expense — the agent reviews it the moment you submit</p>
      </div>
    </div>

    <div class="grid-2">
      <div class="panel">
        <div class="step-label">Expense Details</div>
        <form id="expense-form">
          <div class="form-grid">
            <div class="form-field">
              <label>Vendor *</label>
              <select class="select-input" name="vendorId" id="f-vendor" required>
                <option value="">— Choose a vendor —</option>
                ${state.vendors.map((v) => `<option value="${v.id}">${v.name}${v.approved ? "" : " (unapproved)"}</option>`).join("")}
              </select>
            </div>
            <div class="form-field">
              <label>Category *</label>
              <select class="select-input" name="categoryId" id="f-category" required>
                <option value="">— Choose a category —</option>
                ${state.categories.map((c) => `<option value="${c.id}">${c.name}</option>`).join("")}
              </select>
            </div>
            <div class="form-field">
              <label>Amount ($) *</label>
              <input class="text-input" name="amount" id="f-amount" type="number" min="0.01" step="0.01" required placeholder="0.00" />
            </div>
            <div class="form-field">
              <label>Date *</label>
              <input class="text-input" name="date" id="f-date" type="date" required value="${todayIso}" max="${todayIso}" />
            </div>
            <div class="form-field form-row-full">
              <label>Description</label>
              <textarea name="description" placeholder="What was this for?"></textarea>
            </div>
          </div>
          <button type="submit" class="btn btn-accent" style="width:100%;justify-content:center;padding:11px">${icons.bolt} Submit for Agent Review</button>
        </form>
      </div>

      <div class="panel">
        <div class="panel-title">Agent Preview</div>
        <div id="preview-slot"><div class="preview-box">Fill in vendor, category and amount to see how the agent would likely handle this.</div></div>
        <hr class="summary-divider" />
        <div class="summary-line"><span>Auto-approval limit</span><span>${currency(state.settings.autoApproveLimit)}</span></div>
        <div class="summary-line"><span>Duplicate check window</span><span>${state.settings.duplicateWindowDays} days</span></div>
      </div>
    </div>
  `;

  const form = container.querySelector("#expense-form");
  const previewSlot = container.querySelector("#preview-slot");

  function updatePreview() {
    const vendorId = container.querySelector("#f-vendor").value;
    const categoryId = container.querySelector("#f-category").value;
    const amount = Number(container.querySelector("#f-amount").value);
    const date = container.querySelector("#f-date").value || todayIso;

    if (!vendorId || !categoryId || !amount) {
      previewSlot.innerHTML = `<div class="preview-box">Fill in vendor, category and amount to see how the agent would likely handle this.</div>`;
      return;
    }
    const result = previewDecision({ vendorId, categoryId, amount, date });
    previewSlot.innerHTML = `
      <div class="preview-box ${result.status === "approved" ? "approved" : "flagged"}">
        <strong>${result.status === "approved" ? "Likely: Auto-Approved" : "Likely: Flagged for Review"}</strong>
        ${result.reason}
      </div>`;
  }

  ["f-vendor", "f-category", "f-amount", "f-date"].forEach((id) =>
    container.querySelector(`#${id}`).addEventListener("input", updatePreview)
  );

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const freshState = getState();
    const expense = {
      id: uid("EXP"),
      vendorId: fd.get("vendorId"),
      categoryId: fd.get("categoryId"),
      amount: Number(fd.get("amount")),
      date: fd.get("date"),
      description: fd.get("description") || "",
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    freshState.expenses.push(expense);
    saveState();

    const result = evaluateAndApply(expense.id);
    showToast(
      result.status === "approved"
        ? `Submitted — the agent auto-approved this expense.`
        : `Submitted — the agent flagged this expense for review.`
    );
    ctx.navigate("approvals");
  });
}
