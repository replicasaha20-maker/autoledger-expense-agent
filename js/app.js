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
const menuToggleEl = document.getElementById("menu-toggle");
const themeToggleEl = document.getElementById("theme-toggle");

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
    btn.addEventListener("click", () => {
      closeMobileMenu();
      navigate(btn.dataset.page);
    })
  );
}

function closeMobileMenu() {
  navEl.classList.remove("open");
  menuToggleEl.setAttribute("aria-expanded", "false");
  menuToggleEl.innerHTML = icons.menu;
}

menuToggleEl.innerHTML = icons.menu;
menuToggleEl.addEventListener("click", () => {
  const open = navEl.classList.toggle("open");
  menuToggleEl.setAttribute("aria-expanded", String(open));
  menuToggleEl.innerHTML = open ? icons.x : icons.menu;
});

function currentTheme() {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

function renderThemeToggle() {
  const t = currentTheme();
  themeToggleEl.innerHTML = t === "dark" ? icons.sun : icons.moon;
  themeToggleEl.title = t === "dark" ? "Switch to light mode" : "Switch to dark mode";
}

themeToggleEl.addEventListener("click", () => {
  const next = currentTheme() === "dark" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try { localStorage.setItem("autoledger_theme", next); } catch {}
  renderThemeToggle();
});
renderThemeToggle();

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
