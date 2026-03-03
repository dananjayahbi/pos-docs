/**
 * LCC Admin — Reusable Header Component
 * Reads data-page-title from <header id="adminTopBar">
 * and injects the canonical top-bar HTML.
 *
 * Load this BEFORE admin.js.
 */
(function () {
  "use strict";

  // Page title map (fallback if data-page-title not set)
  const PAGE_TITLES = {
    "index.html":    "Platform Administration",
    "tenants.html":  "Tenants / Stores",
    "users.html":    "Platform Users",
    "billing.html":  "Billing & Plans",
    "health.html":   "System Health",
    "logs.html":     "Logs & Audit",
    "settings.html": "Platform Settings",
  };

  function getPageTitle(el) {
    if (el && el.getAttribute("data-page-title"))
      return el.getAttribute("data-page-title");
    const page = window.location.pathname.split("/").pop() || "index.html";
    return PAGE_TITLES[page] || "Admin Panel";
  }

  function buildTopBar(title) {
    return `
      <div class="top-bar-left">
        <button class="btn btn-ghost btn-icon header-toggle-btn" id="sidebarToggle" title="Toggle Sidebar">
          <i class="fa-solid fa-bars"></i>
        </button>
        <span class="top-bar-title">${title}</span>
      </div>
      <div class="top-bar-right">
        <button class="btn btn-ghost btn-icon notif-bell" id="notificationsBtn" title="Notifications" aria-haspopup="true" aria-expanded="false">
          <i class="fa-solid fa-bell"></i>
          <span class="notif-badge" id="notifBadge">3</span>
        </button>
        <div class="top-bar-user">
          <div class="avatar-circle">SA</div>
          <span class="top-bar-username">Super Admin</span>
        </div>
      </div>`;
  }

  const MOCK_NOTIFICATIONS = [
    { type: "success", icon: "fa-store",         title: "New tenant registered",               body: "Perera Mart (Colombo) just signed up on the Pro plan.",     time: "5 min ago",  read: false },
    { type: "warning", icon: "fa-triangle-exclamation", title: "Subscription expiring soon",   body: "Akbar Stores — subscription expires in 3 days.",          time: "1 hr ago",   read: false },
    { type: "error",   icon: "fa-heart-pulse",   title: "Health check failed",                 body: "Redis connection timeout detected on worker node 2.",       time: "2 hrs ago",  read: false },
    { type: "info",    icon: "fa-file-invoice",  title: "Billing report ready",                body: "Monthly revenue report for November 2025 is ready.",       time: "1 day ago",  read: true  },
    { type: "info",    icon: "fa-user-clock",    title: "Pending activations",                 body: "2 tenants are awaiting account activation.",               time: "2 days ago", read: true  },
  ];

  function buildNotifPanel() {
    const unread = MOCK_NOTIFICATIONS.filter(n => !n.read).length;
    const items  = MOCK_NOTIFICATIONS.map((n, i) => `
      <div class="notif-item ${n.read ? 'notif-read' : ''}" data-index="${i}">
        <div class="notif-dot-wrap">
          <div class="notif-type-icon notif-icon-${n.type}"><i class="fa-solid ${n.icon}"></i></div>
          ${!n.read ? '<span class="notif-unread-dot"></span>' : ''}
        </div>
        <div class="notif-content">
          <p class="notif-title">${n.title}</p>
          <p class="notif-body">${n.body}</p>
          <span class="notif-time">${n.time}</span>
        </div>
      </div>`).join('');

    return `
    <div class="notif-panel" id="notifPanel" role="dialog" aria-label="Notifications">
      <div class="notif-panel-header">
        <span class="notif-panel-title">Notifications
          ${unread > 0 ? `<span class="notif-count-pill">${unread} new</span>` : ''}
        </span>
        <button class="notif-mark-all btn btn-ghost btn-sm" id="notifMarkAll">Mark all read</button>
      </div>
      <div class="notif-list" id="notifList">${items}</div>
      <div class="notif-panel-footer">
        <button class="btn btn-ghost btn-sm" id="notifClearAll">Clear all</button>
      </div>
    </div>
    <div class="notif-backdrop" id="notifBackdrop"></div>`;
  }

  function injectHeader() {
    const el = document.getElementById("adminTopBar");
    if (!el) return;
    const title = getPageTitle(el);
    el.innerHTML = buildTopBar(title);
    // Inject notification panel into body
    const panelWrapper = document.createElement("div");
    panelWrapper.id = "notifPanelWrapper";
    panelWrapper.innerHTML = buildNotifPanel();
    document.body.appendChild(panelWrapper);
  }

  // Run immediately if DOM is ready, else wait
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", injectHeader);
  } else {
    injectHeader();
  }
})();
