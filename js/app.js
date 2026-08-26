import { loadState, saveState, getState } from "./store.js";
import { seed } from "./seed.js";
import { icons } from "./icons.js";
import * as dashboard from "./pages/dashboard.js";
import * as vendors from "./pages/vendors.js";
import * as budgets from "./pages/budgets.js";
import * as submitExpense from "./pages/submitExpense.js";
import * as approvals from "./pages/approvals.js";
import * as agentLog from "./pages/agentLog.js";

const state = loadState();
if (state.vendors.length === 0) {
  seed(state);
  saveState();
}

const pages = {
  dashboard: { label: "Dashboard", icon: "dashboard", module: dashboard },
  vendors: { label: "Vendors", icon: "vendors", module: vendors },
  budgets: { label: "Budgets", icon: "budgets", module: budgets },
  submit: { label: "Submit Expense", icon: "submit", module: submitExpense },
  approvals: { label: "Approvals", icon: "approvals", module: approvals },
  log: { label: "Agent Log", icon: "log", module: agentLog },
};

let currentPage = "dashboard";

const navEl = document.getElementById("nav");
const mainEl = document.getElementById("main");

function renderNav() {
  const pendingCount = getState().expenses.filter((e) => e.status === "pending").length;
  navEl.innerHTML = Object.entries(pages)
    .map(([key, p]) => `
      <button class="nav-item ${key === currentPage ? "active" : ""}" data-page="${key}">
        ${icons[p.icon]}
        <span>${p.label}</span>
        ${key === "approvals" && pendingCount > 0 ? `<span class="nav-badge">${pendingCount}</span>` : ""}
      </button>
    `)
    .join("");
  navEl.querySelectorAll(".nav-item").forEach((btn) =>
    btn.addEventListener("click", () => navigate(btn.dataset.page))
  );
}

const ctx = {
  refresh: () => renderPage(currentPage, {}),
  navigate: (page, opts) => navigate(page, opts),
};

function renderPage(page, opts = {}) {
  currentPage = page;
  renderNav();
  pages[page].module.render(mainEl, ctx, opts);
  window.scrollTo(0, 0);
}

function navigate(page, opts = {}) {
  renderPage(page, opts);
}

renderPage("dashboard");
