import { getState, saveState, uid, currency, categorySpentThisMonth } from "../store.js";
import { icons } from "../icons.js";
import { openModal, closeModal, showToast } from "../ui.js";

function categoryForm(existing) {
  return `
    <h2>${existing ? "Edit Category" : "Add Category"}</h2>
    <p class="modal-sub">Set a monthly budget. The agent flags expenses that would exceed it.</p>
    <form id="category-form">
      <div class="form-field">
        <label>Category name</label>
        <input class="text-input" name="name" required value="${existing ? existing.name : ""}" placeholder="e.g. Marketing" />
      </div>
      <div class="form-field">
        <label>Monthly budget ($)</label>
        <input class="text-input" name="budget" type="number" min="0" step="1" required value="${existing ? existing.budget : ""}" placeholder="400" />
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="cancel-category">Cancel</button>
        <button type="submit" class="btn btn-accent">${existing ? "Save Changes" : "Add Category"}</button>
      </div>
    </form>
  `;
}

function openCategoryForm(ctx, existing) {
  openModal(categoryForm(existing), {
    onMount: (overlay) => {
      overlay.querySelector("#cancel-category").addEventListener("click", closeModal);
      overlay.querySelector("#category-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const state = getState();
        if (existing) {
          existing.name = fd.get("name");
          existing.budget = Number(fd.get("budget"));
          showToast(`Updated ${existing.name}.`);
        } else {
          const c = { id: uid("C"), name: fd.get("name"), budget: Number(fd.get("budget")), createdAt: new Date().toISOString() };
          state.categories.push(c);
          showToast(`Added category ${c.name}.`);
        }
        saveState();
        closeModal();
        ctx.refresh();
      });
    },
  });
}

export function render(container, ctx) {
  const state = getState();
  const rows = state.categories.map((c) => {
    const spent = categorySpentThisMonth(c.id);
    const pct = Math.min(100, (spent / c.budget) * 100);
    const over = spent > c.budget;
    const color = over ? "#d64545" : pct >= 75 ? "#b7791f" : "#1ba672";
    return { c, spent, pct, over, color };
  });

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Budgets</h1>
        <p>${state.categories.length} expense categories · monthly limits the agent checks against</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" id="add-category">${icons.plus} Add Category</button>
      </div>
    </div>

    <div class="panel" style="padding:0">
      <table>
        <thead><tr><th style="padding-left:22px">Category</th><th>Monthly Budget</th><th>Spent (this month)</th><th>Level</th><th>Status</th><th></th></tr></thead>
        <tbody>
          ${rows.map(({ c, spent, pct, over, color }) => `
            <tr>
              <td style="padding-left:22px" class="cell-strong">${c.name}</td>
              <td>${currency(c.budget)}</td>
              <td style="color:${over ? "var(--red)" : "inherit"}">${currency(spent)}</td>
              <td><div class="level-bar"><div class="level-bar-fill" style="width:${pct}%;background:${color}"></div></div></td>
              <td><span class="badge ${over ? "red" : pct >= 75 ? "amber" : "green"}"><span class="badge-dot" style="background:currentColor"></span>${over ? "Over Budget" : pct >= 75 ? "Near Limit" : "Healthy"}</span></td>
              <td>
                <button class="btn-icon edit-cat" data-id="${c.id}" title="Edit">${icons.edit}</button>
                <button class="btn-icon delete-cat" data-id="${c.id}" title="Delete">${icons.trash}</button>
              </td>
            </tr>`).join("")}
        </tbody>
      </table>
    </div>
  `;

  container.querySelector("#add-category").addEventListener("click", () => openCategoryForm(ctx));
  container.querySelectorAll(".edit-cat").forEach((btn) =>
    btn.addEventListener("click", () => openCategoryForm(ctx, state.categories.find((x) => x.id === btn.dataset.id)))
  );
  container.querySelectorAll(".delete-cat").forEach((btn) =>
    btn.addEventListener("click", () => {
      const c = state.categories.find((x) => x.id === btn.dataset.id);
      if (!confirm(`Delete category "${c.name}"? Existing expenses will keep this category on record.`)) return;
      state.categories = state.categories.filter((x) => x.id !== c.id);
      saveState();
      showToast(`Deleted ${c.name}.`);
      ctx.refresh();
    })
  );
}
