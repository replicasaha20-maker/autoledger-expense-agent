import { getState, saveState, uid, currency, formatDate, vendorById, categoryById, categorySpentThisMonth } from "./store.js";

function isDuplicate(expense, allExpenses, windowDays) {
  const target = new Date(expense.date).getTime();
  return allExpenses.find((e) => {
    if (e.id === expense.id) return false;
    if (e.vendorId !== expense.vendorId) return false;
    if (Math.abs(e.amount - expense.amount) > 0.005) return false;
    if (e.status === "rejected") return false;
    const diffDays = Math.abs(new Date(e.date).getTime() - target) / 86400000;
    return diffDays <= windowDays;
  });
}

export function evaluateExpense(expense, state) {
  const vendor = vendorById(expense.vendorId);
  const category = categoryById(expense.categoryId);
  const settings = state.settings;

  if (!vendor) {
    return { status: "flagged", reason: "Vendor record could not be found — routed to manual review." };
  }

  if (!vendor.approved) {
    return {
      status: "flagged",
      reason: `"${vendor.name}" is not on the approved vendor list, so this expense needs a manual check before it can be approved.`,
    };
  }

  const dup = isDuplicate(expense, state.expenses, settings.duplicateWindowDays);
  if (dup) {
    return {
      status: "flagged",
      reason: `Looks like a possible duplicate — ${vendor.name} already has a ${currency(expense.amount)} expense dated ${formatDate(dup.date)}, within the ${settings.duplicateWindowDays}-day duplicate window.`,
    };
  }

  if (category) {
    const spent = categorySpentThisMonth(category.id, expense.id);
    const projected = spent + expense.amount;
    if (projected > category.budget) {
      return {
        status: "flagged",
        reason: `This would push "${category.name}" to ${currency(projected)}, over its ${currency(category.budget)} monthly budget (already ${currency(spent)} spent this month).`,
      };
    }
  }

  if (expense.amount > settings.autoApproveLimit) {
    return {
      status: "flagged",
      reason: `Amount ${currency(expense.amount)} is above the ${currency(settings.autoApproveLimit)} auto-approval limit, so it needs a manual sign-off.`,
    };
  }

  const spent = category ? categorySpentThisMonth(category.id, expense.id) : 0;
  return {
    status: "approved",
    reason: `Auto-approved — ${vendor.name} is an approved vendor, ${currency(expense.amount)} is within the ${currency(settings.autoApproveLimit)} limit, and "${category ? category.name : "this category"}" has room left in its budget (${currency(spent)} of ${category ? currency(category.budget) : "—"} used).`,
  };
}

export function runAgent() {
  const state = getState();
  const pending = state.expenses.filter((e) => e.status === "pending");
  let approvedCount = 0;
  let flaggedCount = 0;

  pending.forEach((expense) => {
    const result = evaluateExpense(expense, state);
    expense.status = result.status;
    if (result.status === "approved") approvedCount++;
    else flaggedCount++;

    state.agentLog.unshift({
      id: uid("LOG"),
      expenseId: expense.id,
      type: result.status === "approved" ? "auto-approved" : "auto-flagged",
      reason: result.reason,
      timestamp: new Date().toISOString(),
    });
  });

  saveState();
  return { processed: pending.length, approvedCount, flaggedCount };
}

export function evaluateAndApply(expenseId) {
  const state = getState();
  const expense = state.expenses.find((e) => e.id === expenseId);
  if (!expense) return null;
  const result = evaluateExpense(expense, state);
  expense.status = result.status;
  state.agentLog.unshift({
    id: uid("LOG"),
    expenseId,
    type: result.status === "approved" ? "auto-approved" : "auto-flagged",
    reason: result.reason,
    timestamp: new Date().toISOString(),
  });
  saveState();
  return result;
}

export function previewDecision(partialExpense) {
  const state = getState();
  if (!partialExpense.vendorId || !partialExpense.categoryId || !partialExpense.amount) return null;
  const fakeExpense = { ...partialExpense, id: "__preview__" };
  return evaluateExpense(fakeExpense, state);
}

export function manualOverride(expenseId, decision, note) {
  const state = getState();
  const expense = state.expenses.find((e) => e.id === expenseId);
  if (!expense) return;
  expense.status = decision;
  state.agentLog.unshift({
    id: uid("LOG"),
    expenseId,
    type: decision === "approved" ? "manual-approved" : "manual-rejected",
    reason: note || `Manually ${decision === "approved" ? "approved" : "rejected"} by reviewer, overriding the agent's default handling.`,
    timestamp: new Date().toISOString(),
  });
  saveState();
}
