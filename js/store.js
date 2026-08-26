const KEY = "autoledger_state_v1";

const listeners = new Set();

function defaultState() {
  return {
    vendors: [],
    categories: [],
    expenses: [],
    agentLog: [],
    settings: { autoApproveLimit: 200, duplicateWindowDays: 7 },
  };
}

let state = null;

export function loadState() {
  if (state) return state;
  try {
    const raw = localStorage.getItem(KEY);
    state = raw ? JSON.parse(raw) : defaultState();
  } catch {
    state = defaultState();
  }
  return state;
}

export function saveState() {
  localStorage.setItem(KEY, JSON.stringify(state));
  listeners.forEach((fn) => fn(state));
}

export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function getState() {
  return loadState();
}

export function resetAllData(seedFn) {
  localStorage.removeItem(KEY);
  state = defaultState();
  if (seedFn) seedFn(state);
  saveState();
}

export function uid(prefix) {
  const n = Math.floor(Math.random() * 900000 + 100000);
  return `${prefix}-${n}`;
}

export function currency(n) {
  return `$${Number(n).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

export function formatDateTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" }) + " · " +
    d.toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" });
}

export function monthKey(iso) {
  return iso.slice(0, 7);
}

export function monthLabel(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, { month: "short", year: "2-digit" });
}

export function vendorById(id) {
  return loadState().vendors.find((v) => v.id === id);
}

export function categoryById(id) {
  return loadState().categories.find((c) => c.id === id);
}

export function categorySpentThisMonth(categoryId, excludeExpenseId = null) {
  const s = loadState();
  const now = monthKey(new Date().toISOString());
  return s.expenses
    .filter((e) => e.categoryId === categoryId && e.id !== excludeExpenseId)
    .filter((e) => e.status === "approved" || e.status === "flagged")
    .filter((e) => monthKey(e.date) === now)
    .reduce((sum, e) => sum + e.amount, 0);
}
