import { getState, saveState, uid, formatDate } from "../store.js";
import { icons } from "../icons.js";
import { openModal, closeModal, showToast } from "../ui.js";

let searchTerm = "";

function vendorForm(existing) {
  return `
    <h2>${existing ? "Edit Vendor" : "Add Vendor"}</h2>
    <p class="modal-sub">${existing ? "Update this vendor's details." : "New vendors start unapproved until reviewed."}</p>
    <form id="vendor-form">
      <div class="form-field">
        <label>Vendor name</label>
        <input class="text-input" name="name" required value="${existing ? existing.name : ""}" placeholder="e.g. Acme Supply Co" />
      </div>
      <div class="form-field">
        <label>Email</label>
        <input class="text-input" name="email" type="email" required value="${existing ? existing.email : ""}" placeholder="billing@vendor.com" />
      </div>
      <div class="form-field">
        <label>Phone</label>
        <input class="text-input" name="phone" required value="${existing ? existing.phone : ""}" placeholder="+1 555-000-0000" />
      </div>
      <div class="form-field">
        <label class="checkbox-field"><input type="checkbox" name="approved" ${existing && existing.approved ? "checked" : ""} /> Approved vendor (agent can auto-approve their expenses)</label>
      </div>
      <div class="modal-actions">
        <button type="button" class="btn btn-outline" id="cancel-vendor">Cancel</button>
        <button type="submit" class="btn btn-accent">${existing ? "Save Changes" : "Add Vendor"}</button>
      </div>
    </form>
  `;
}

function openVendorForm(ctx, existing) {
  openModal(vendorForm(existing), {
    onMount: (overlay) => {
      overlay.querySelector("#cancel-vendor").addEventListener("click", closeModal);
      overlay.querySelector("#vendor-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const fd = new FormData(e.target);
        const state = getState();
        if (existing) {
          existing.name = fd.get("name");
          existing.email = fd.get("email");
          existing.phone = fd.get("phone");
          existing.approved = fd.get("approved") === "on";
          showToast(`Updated ${existing.name}.`);
        } else {
          const v = {
            id: uid("V"),
            name: fd.get("name"),
            email: fd.get("email"),
            phone: fd.get("phone"),
            approved: fd.get("approved") === "on",
            createdAt: new Date().toISOString(),
          };
          state.vendors.push(v);
          showToast(`Added vendor ${v.name}.`);
        }
        saveState();
        closeModal();
        ctx.refresh();
      });
    },
  });
}

export function render(container, ctx, opts = {}) {
  const state = getState();
  const term = searchTerm.toLowerCase();
  const list = state.vendors.filter(
    (v) => v.name.toLowerCase().includes(term) || v.email.toLowerCase().includes(term) || v.phone.includes(term)
  );

  container.innerHTML = `
    <div class="page-header">
      <div>
        <h1>Vendors</h1>
        <p>${state.vendors.length} on file · agents only auto-approve expenses from approved vendors</p>
      </div>
      <div class="page-header-actions">
        <button class="btn btn-primary" id="add-vendor">${icons.plus} Add Vendor</button>
      </div>
    </div>

    <div class="toolbar">
      <input class="search-input" id="search" placeholder="Search by name, email or phone…" value="${searchTerm}" />
    </div>

    <div class="panel" style="padding:0">
      ${list.length ? `
      <table>
        <thead><tr><th style="padding-left:22px">Vendor</th><th>Contact</th><th>Status</th><th>Expenses</th><th>Added</th><th></th></tr></thead>
        <tbody>
          ${list.map((v) => {
            const count = state.expenses.filter((e) => e.vendorId === v.id).length;
            return `<tr>
              <td style="padding-left:22px" class="cell-strong">${v.name}</td>
              <td><div>${v.email}</div><div class="cell-dim">${v.phone}</div></td>
              <td><span class="badge ${v.approved ? "green" : "gray"}"><span class="badge-dot" style="background:currentColor"></span>${v.approved ? "Approved" : "Unapproved"}</span></td>
              <td>${count}</td>
              <td class="cell-dim">${formatDate(v.createdAt)}</td>
              <td>
                <button class="btn-icon toggle-approve" data-id="${v.id}" title="Toggle approval">${v.approved ? icons.x : icons.check}</button>
                <button class="btn-icon edit-vendor" data-id="${v.id}" title="Edit">${icons.edit}</button>
                <button class="btn-icon delete-vendor" data-id="${v.id}" title="Delete">${icons.trash}</button>
              </td>
            </tr>`;
          }).join("")}
        </tbody>
      </table>` : `<div class="empty-state">No vendors match "${searchTerm}".</div>`}
    </div>
  `;

  container.querySelector("#add-vendor").addEventListener("click", () => openVendorForm(ctx));
  container.querySelector("#search").addEventListener("input", (e) => {
    searchTerm = e.target.value;
    ctx.refresh();
  });

  container.querySelectorAll(".toggle-approve").forEach((btn) =>
    btn.addEventListener("click", () => {
      const v = state.vendors.find((x) => x.id === btn.dataset.id);
      v.approved = !v.approved;
      saveState();
      showToast(`${v.name} is now ${v.approved ? "approved" : "unapproved"}.`);
      ctx.refresh();
    })
  );
  container.querySelectorAll(".edit-vendor").forEach((btn) =>
    btn.addEventListener("click", () => openVendorForm(ctx, state.vendors.find((x) => x.id === btn.dataset.id)))
  );
  container.querySelectorAll(".delete-vendor").forEach((btn) =>
    btn.addEventListener("click", () => {
      const v = state.vendors.find((x) => x.id === btn.dataset.id);
      if (!confirm(`Delete vendor "${v.name}"? Their existing expenses will stay on record.`)) return;
      state.vendors = state.vendors.filter((x) => x.id !== v.id);
      saveState();
      showToast(`Deleted ${v.name}.`);
      ctx.refresh();
    })
  );

  if (opts.openAdd) openVendorForm(ctx);
}
