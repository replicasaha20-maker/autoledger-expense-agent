import { icons } from "./icons.js";

export function openModal(innerHtml, { onMount } = {}) {
  closeModal();
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";
  overlay.id = "active-modal";
  overlay.innerHTML = `<div class="modal">${innerHtml}</div>`;
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });
  document.body.appendChild(overlay);
  if (onMount) onMount(overlay);
  return overlay;
}

export function closeModal() {
  const el = document.getElementById("active-modal");
  if (el) el.remove();
}

export function showToast(message) {
  const stack = document.getElementById("toast-stack");
  const el = document.createElement("div");
  el.className = "toast";
  el.innerHTML = `${icons.check}<span>${message}</span>`;
  stack.appendChild(el);
  setTimeout(() => {
    el.style.transition = "opacity 0.25s ease";
    el.style.opacity = "0";
    setTimeout(() => el.remove(), 250);
  }, 2600);
}

export function statusMeta(status) {
  const map = {
    pending: { label: "Pending", cls: "blue" },
    approved: { label: "Approved", cls: "green" },
    flagged: { label: "Flagged", cls: "amber" },
    rejected: { label: "Rejected", cls: "red" },
  };
  return map[status] || { label: status, cls: "gray" };
}

export function statusBadge(status) {
  const m = statusMeta(status);
  return `<span class="badge ${m.cls}"><span class="badge-dot" style="background:currentColor"></span>${m.label}</span>`;
}

export function el(html) {
  const t = document.createElement("template");
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
