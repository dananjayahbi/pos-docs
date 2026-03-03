/** LCC Admin — Dashboard Controller */
document.addEventListener("DOMContentLoaded", () => {

  // Date subtitle
  const el = document.getElementById("pageDate");
  if (el) el.textContent = new Date().toLocaleDateString("en-LK",
    { weekday: "long", year: "numeric", month: "long", day: "numeric" });

  // Sidebar collapse
  const sidebar = document.getElementById("sidebar");
  const wrapper = document.getElementById("mainWrapper");
  const topBar = document.querySelector(".top-bar");
  const overlay = document.getElementById("sidebarOverlay");
  const KEY = "lcc_sidebar_collapsed";

  function applyCollapse(val) {
    const c = val === true || val === "true";
    if (window.innerWidth > 1024) {
      sidebar?.classList.toggle("collapsed", c);
      wrapper?.classList.toggle("sidebar-collapsed", c);
      topBar?.classList.toggle("sidebar-collapsed", c);
      localStorage.setItem(KEY, c);
    } else {
      sidebar?.classList.toggle("mobile-open", !c);
      overlay?.classList.toggle("active", !c);
    }
  }

  applyCollapse(localStorage.getItem(KEY));

  document.getElementById("sidebarToggle")?.addEventListener("click", () => {
    if (window.innerWidth > 1024) applyCollapse(localStorage.getItem(KEY) !== "true");
    else applyCollapse(sidebar?.classList.contains("mobile-open"));
  });

  overlay?.addEventListener("click", () => {
    sidebar?.classList.remove("mobile-open");
    overlay.classList.remove("active");
  });

  window.addEventListener("resize", () => applyCollapse(localStorage.getItem(KEY)));

  // Sign-out
  document.getElementById("signOutBtn")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.clear(); sessionStorage.clear();
    window.location.href = "../auth/login.html";
  });

  // Active nav
  const page = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-item[href]").forEach(l =>
    l.classList.toggle("active", l.getAttribute("href") === page));

  // ──────────────────────────────────────────────
  // NOTIFICATION PANEL
  // ──────────────────────────────────────────────
  function getNotifEls() {
    return {
      btn:      document.getElementById("notificationsBtn"),
      panel:    document.getElementById("notifPanel"),
      backdrop: document.getElementById("notifBackdrop"),
      badge:    document.getElementById("notifBadge"),
      markAll:  document.getElementById("notifMarkAll"),
      clearAll: document.getElementById("notifClearAll"),
      list:     document.getElementById("notifList"),
    };
  }

  function openNotifPanel() {
    document.body.classList.add("notif-panel-open");
    const { btn } = getNotifEls();
    btn?.setAttribute("aria-expanded", "true");
  }

  function closeNotifPanel() {
    document.body.classList.remove("notif-panel-open");
    const { btn } = getNotifEls();
    btn?.setAttribute("aria-expanded", "false");
  }

  function updateBadge() {
    const { list, badge } = getNotifEls();
    if (!list || !badge) return;
    const count = list.querySelectorAll(".notif-item:not(.notif-read)").length;
    badge.textContent = count > 0 ? count : "";
    badge.style.display = count > 0 ? "" : "none";
  }

  // Delegate: attach to body since el injected after DOMContentLoaded
  document.body.addEventListener("click", (e) => {
    // Bell toggle
    if (e.target.closest("#notificationsBtn")) {
      if (document.body.classList.contains("notif-panel-open")) {
        closeNotifPanel();
      } else {
        openNotifPanel();
      }
      return;
    }
    // Backdrop close
    if (e.target.id === "notifBackdrop") { closeNotifPanel(); return; }
    // Mark all read
    if (e.target.id === "notifMarkAll" || e.target.closest("#notifMarkAll")) {
      const { list, badge } = getNotifEls();
      list?.querySelectorAll(".notif-item").forEach(item => {
        item.classList.add("notif-read");
        item.querySelector(".notif-unread-dot")?.remove();
      });
      if (badge) { badge.textContent = ""; badge.style.display = "none"; }
      document.querySelector(".notif-count-pill")?.remove();
      return;
    }
    // Clear all
    if (e.target.id === "notifClearAll" || e.target.closest("#notifClearAll")) {
      const { list, badge } = getNotifEls();
      if (list) list.innerHTML = '<div class="notif-empty"><i class="fa-regular fa-bell-slash fa-lg"></i><br>No notifications</div>';
      if (badge) { badge.textContent = ""; badge.style.display = "none"; }
      document.querySelector(".notif-count-pill")?.remove();
      return;
    }
    // Single item mark read
    const item = e.target.closest(".notif-item");
    if (item) {
      item.classList.add("notif-read");
      item.querySelector(".notif-unread-dot")?.remove();
      updateBadge();
    }
  });

  // Close on ESC
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.body.classList.contains("notif-panel-open")) {
      closeNotifPanel();
    }
  });

  // ──────────────────────────────────────────────
  // ADD TENANT MODAL
  // (modal open/close handled by layout.js globals)
  // ──────────────────────────────────────────────
  const tenantModal = document.getElementById("addTenantModal");
  const tenantForm  = document.getElementById("addTenantForm");
  const planSelect  = tenantForm?.querySelector("[name='plan']");
  const planHintTxt = document.getElementById("planHintText");
  const submitBtn   = document.getElementById("submitAddTenant");

  const PLAN_HINTS = {
    FREE:       "Free: 2 users, 100 products, 1 location. No monthly fee.",
    STARTER:    "Starter: up to 5 users, 1,000 products, 2 locations — ₨2,999/mo.",
    PRO:        "Pro: up to 20 users, 10,000 products, 5 locations — ₨9,999/mo.",
    ENTERPRISE: "Enterprise: Unlimited users, products & locations — ₨29,999/mo.",
  };

  const STATUS_CLASSES = { ACTIVE: "status-active", TRIAL: "status-trial", SUSPENDED: "status-suspended" };
  const STATUS_DOTS    = { ACTIVE: "dot-green",      TRIAL: "dot-orange",   SUSPENDED: "dot-red"          };

  // Reset form when modal is closed via layout.js close/cancel buttons
  function resetTenantModal() {
    tenantForm?.reset();
    clearErrors();
  }
  document.getElementById("cancelAddTenant")?.addEventListener("click", resetTenantModal);
  document.getElementById("closeAddTenantModal")?.addEventListener("click", resetTenantModal);

  // Plan hint update
  planSelect?.addEventListener("change", () => {
    if (planHintTxt) planHintTxt.textContent = PLAN_HINTS[planSelect.value] || "";
  });

  // Field validation helpers
  function setError(input, msg) {
    input.classList.add("error");
    let hint = input.parentNode.querySelector(".field-err");
    if (!hint) {
      hint = document.createElement("span");
      hint.className = "field-err";
      hint.style.cssText = "font-size:11px;color:var(--color-error-500);margin-top:2px;";
      input.parentNode.appendChild(hint);
    }
    hint.textContent = msg;
  }
  function clearErrors() {
    tenantForm?.querySelectorAll(".error").forEach(el => el.classList.remove("error"));
    tenantForm?.querySelectorAll(".field-err").forEach(el => el.remove());
  }

  function validateForm() {
    clearErrors();
    let valid = true;
    const required = ["name", "business_type", "contact_email", "contact_phone", "address_line1", "city", "province", "plan"];
    required.forEach(key => {
      const input = tenantForm.querySelector(`[name='${key}']`);
      if (!input || !input.value.trim()) {
        if (input) setError(input, "This field is required.");
        valid = false;
      }
    });
    return valid;
  }

  // Insert new row at top of Recent Tenants table
  function addTenantToTable(data) {
    const tbody = document.querySelector(".data-table tbody");
    if (!tbody) return;
    const planSlug    = data.plan.toLowerCase();
    const planLabel   = data.plan.charAt(0) + data.plan.slice(1).toLowerCase();
    const statusClass = STATUS_CLASSES[data.status] || "status-active";
    const dotClass    = STATUS_DOTS[data.status]    || "dot-green";
    const statusLabel = (data.status || "ACTIVE").charAt(0) + (data.status || "ACTIVE").slice(1).toLowerCase();
    const today       = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td><strong>${escHtml(data.name)}</strong></td>
      <td><span class="plan-badge plan-${planSlug}">${planLabel}</span></td>
      <td><span class="status-pill ${statusClass}"><span class="status-dot ${dotClass}"></span>${statusLabel}</span></td>
      <td>${today}</td>
      <td>—</td>`;
    tbody.insertBefore(tr, tbody.firstChild);
  }

  function escHtml(s) {
    return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  }

  function showAdminToast(msg, type) {
    const bg = (type === "error") ? "#dc2626" : "#16a34a";
    const t = Object.assign(document.createElement("div"), { textContent: msg });
    Object.assign(t.style, {
      position:"fixed", bottom:"24px", right:"24px", padding:"12px 20px",
      borderRadius:"8px", fontSize:"14px", fontWeight:"500", zIndex:"9999",
      background: bg, color:"#fff", boxShadow:"0 4px 12px rgba(0,0,0,0.18)",
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

  submitBtn?.addEventListener("click", () => {
    if (!tenantForm) return;
    if (!validateForm()) { showAdminToast("Please fill all required fields.", "error"); return; }

    const data = Object.fromEntries(new FormData(tenantForm).entries());

    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Creating…';

    setTimeout(() => {
      addTenantToTable(data);
      // Use layout.js global closeModal
      if (typeof closeModal === "function") closeModal("addTenantModal");
      resetTenantModal();
      showAdminToast(`Tenant "${data.name}" created successfully.`);
      submitBtn.disabled  = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-plus"></i> Create Tenant';
    }, 900);
  });

});