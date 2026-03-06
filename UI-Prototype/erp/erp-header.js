/**
 * LCC Tenant ERP — Reusable Sidebar + Header Component
 *
 * Mirrors the super-admin admin-header.js pattern:
 *  • Injects the sidebar into  <aside class="sidebar" id="sidebar">
 *  • Injects the top-bar into  <header class="top-bar" id="erpTopBar">
 *  • Sets the active nav item automatically based on page URL
 *  • Includes a notification panel identical in structure to the admin one
 *
 * Load BEFORE erp.js.
 */
(function () {
  'use strict';

  /* ── Path prefix helper ──────────────────────────────────────
   * All ERP pages are at either:
   *   erp/dashboard.html           (depth 0)
   *   erp/<module>/index.html      (depth 1)
   * We detect depth after the /erp/ segment.
   */
  function getBase() {
    const path  = window.location.pathname;
    const match = path.match(/\/erp\/(.*)/);
    if (!match) return '';
    const after  = match[1]; // e.g. "sales/orders.html" or "dashboard.html"
    const slashes = (after.match(/\//g) || []).length;
    return slashes > 0 ? '../'.repeat(slashes) : '';
  }

  const base = getBase(); // '' for dashboard.html, '../' for sales/orders.html

  /* ── Page-title map ──────────────────────────────────────────*/
  const PAGE_TITLES = {
    'dashboard.html':       'Dashboard',
    'orders.html':          'Sales Orders',
    'invoices.html':        'Invoices',
    'quotations.html':      'Quotations',
    'index.html':           'Overview',
    // Module-specific (matched by folder)
  };

  const FOLDER_TITLES = {
    'products':   'Products',
    'inventory':  'Inventory',
    'customers':  'Customers',
    'vendors':          'Vendors',
    'purchase-orders':  'Purchase Orders',
    'accounting': 'Accounting',
    'expenses':   'Expenses',
    'hr':         'HR &amp; Payroll',
    'attendance': 'Attendance',
    'payroll':    'Payroll',
    'reports':    'Reports',
    'settings':   'Store Settings',
    'sales':      'Sales Orders',
  };

  function getPageTitle(el) {
    if (el && el.getAttribute('data-page-title'))
      return el.getAttribute('data-page-title');
    const parts  = window.location.pathname.split('/').filter(Boolean);
    const file   = parts[parts.length - 1] || 'index.html';
    const folder = parts[parts.length - 2] || '';
    return FOLDER_TITLES[folder] || PAGE_TITLES[file] || 'ERP Dashboard';
  }

  /* ── Sidebar nav HTML ────────────────────────────────────────
   * CSS classes EXACTLY match the super-admin sidebar so that
   * the shared layout.css / admin.css rules apply.
   */
  function buildSidebar() {
    const b = base; // relative prefix

    function item(href, icon, label, badge, navKey) {
      const badgeHtml = badge
        ? `<span class="nav-badge${badge === 'error' ? ' badge-error' : ''}">${badge === 'error' ? '!' : badge}</span>`
        : '';
      return `
        <a href="${b}${href}" class="nav-item" data-nav-key="${navKey}" data-tooltip="${label}">
          <span class="nav-item-icon"><i class="fa-solid ${icon}"></i></span>
          <span class="nav-item-text">${label}</span>
          ${badgeHtml}
        </a>`;
    }

    return `
    <div class="sidebar-brand">
      <div class="sidebar-logo">
        <i class="fa-solid fa-store"></i>
      </div>
      <div class="sidebar-brand-text">
        <span class="brand-name">LankaCommerce</span>
        <span class="brand-tagline">Tenant ERP</span>
      </div>
    </div>

    <nav class="sidebar-nav" id="erpSidebarNav">

      <div class="nav-section">
        <span class="nav-section-title">Overview</span>
        ${item('dashboard.html', 'fa-chart-pie', 'Dashboard', null, 'dashboard')}
      </div>

      <div class="nav-section">
        <span class="nav-section-title">Commerce</span>
        ${item('sales/orders.html', 'fa-bag-shopping', 'Orders',           null, 'orders')}
        ${item('sales/invoices.html',   'fa-file-invoice', 'Invoices',   null, 'invoices')}
        ${item('sales/quotations.html', 'fa-file-lines',  'Quotations', null, 'quotations')}
      </div>

      <div class="nav-section">
        <span class="nav-section-title">Catalog</span>
        ${item('products/index.html',  'fa-box',           'Products',   null, 'products')}
        ${item('inventory/index.html', 'fa-boxes-stacked', 'Inventory',  null, 'inventory')}
        ${item('products/categories/index.html',  'fa-tags',  'Categories', null, 'categories')}
      </div>

      <div class="nav-section">
        <span class="nav-section-title">Relationships</span>
        ${item('customers/index.html', 'fa-users',          'Customers',        null, 'customers')}
        ${item('vendors/index.html',   'fa-truck-ramp-box', 'Vendors',           null, 'vendors')}
        ${item('purchase-orders/index.html',   'fa-cart-flatbed',   'Purchase Orders',   null, 'purchase-orders')}
      </div>

      <div class="nav-section">
        <span class="nav-section-title">Finance</span>
        ${item('accounting/index.html', 'fa-calculator', 'Accounting', null, 'accounting')}
        ${item('expenses/index.html',    'fa-receipt',    'Expenses',    null, 'expenses')}
      </div>

      <div class="nav-section">
        <span class="nav-section-title">HR</span>
        ${item('hr/index.html',         'fa-id-card',           'Employees',  null, 'employees')}
        ${item('attendance/index.html',  'fa-clock',              'Attendance', null, 'attendance')}
        ${item('payroll/index.html',     'fa-money-check-dollar', 'Payroll',    null, 'payroll')}
      </div>

      <div class="nav-section">
        <span class="nav-section-title">Insights</span>
        ${item('reports/index.html', 'fa-chart-column', 'Reports', null, 'reports')}
      </div>

      <div class="nav-section">
        <span class="nav-section-title">Admin</span>
        ${item('settings/index.html', 'fa-gear', 'Store Settings', null, 'settings')}
      </div>

    </nav>

    <div class="sidebar-footer">
      <a href="${b}../pos/index.html" class="nav-item" data-tooltip="Open POS">
        <span class="nav-item-icon"><i class="fa-solid fa-cash-register"></i></span>
        <span class="nav-item-text">Open POS</span>
      </a>
      <a href="${b}../webstore/index.html" class="nav-item" data-tooltip="Webstore" target="_blank">
        <span class="nav-item-icon"><i class="fa-solid fa-globe"></i></span>
        <span class="nav-item-text">Webstore</span>
      </a>
      <a href="${b}../auth/login.html" class="nav-item signout-link" id="erpSignOutBtn" data-tooltip="Sign Out">
        <span class="nav-item-icon"><i class="fa-solid fa-right-from-bracket"></i></span>
        <span class="nav-item-text">Sign Out</span>
      </a>
    </div>`;
  }

  /* ── Top-bar HTML ────────────────────────────────────────────*/
  function buildTopBar(title) {
    return `
      <div class="top-bar-left">
        <button class="btn btn-ghost btn-icon header-toggle-btn" id="sidebarToggle" title="Toggle Sidebar">
          <i class="fa-solid fa-bars"></i>
        </button>
        <span class="top-bar-title">${title}</span>
      </div>
      <div class="top-bar-right">
        <button class="btn btn-ghost btn-icon notif-bell" id="erpNotifBtn"
                title="Notifications" aria-haspopup="true" aria-expanded="false">
          <i class="fa-solid fa-bell"></i>
          <span class="notif-badge" id="erpNotifBadge">2</span>
        </button>
        <div class="top-bar-user">
          <div class="avatar-circle">TA</div>
          <span class="top-bar-username">Store Admin</span>
        </div>
      </div>`;
  }

  /* ── Notification panel ──────────────────────────────────────*/
  const MOCK_NOTIFS = [
    { type: 'warning', icon: 'fa-triangle-exclamation', title: 'Low stock alert',           body: '3 products are below re-order level.',                    time: '10 min ago',  read: false },
    { type: 'info',    icon: 'fa-bag-shopping',         title: 'New order received',         body: 'Order #LCC-2847 placed by Nimal Perera — ₨ 14,500.',      time: '25 min ago',  read: false },
    { type: 'success', icon: 'fa-circle-check',         title: 'Invoice paid',               body: 'Invoice #INV-0931 has been marked as paid.',              time: '2 hrs ago',   read: true  },
    { type: 'info',    icon: 'fa-user-plus',            title: 'New customer registered',    body: 'Sumudu Rathnayake signed up via webstore.',               time: '1 day ago',   read: true  },
  ];

  function buildNotifPanel() {
    const unread = MOCK_NOTIFS.filter(n => !n.read).length;
    const items = MOCK_NOTIFS.map((n, i) => `
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
        <button class="notif-dismiss" title="Dismiss" aria-label="Dismiss">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>`).join('');

    return `
    <div class="notif-panel" id="erpNotifPanel" role="dialog" aria-label="Notifications">
      <div class="notif-panel-header">
        <span class="notif-panel-title">Notifications
          ${unread > 0 ? `<span class="notif-count-pill">${unread} new</span>` : ''}
        </span>
        <button class="notif-mark-all btn btn-ghost btn-sm" id="erpNotifMarkAll">Mark all read</button>
      </div>
      <div class="notif-list" id="erpNotifList">${items}</div>
      <div class="notif-panel-footer">
        <button class="btn btn-ghost btn-sm" id="erpNotifClearAll">Clear all</button>
      </div>
    </div>
    <div class="notif-backdrop" id="erpNotifBackdrop"></div>`;
  }

  /* ── URL → default nav-key map ─────────────────────────────
   * Used when user navigates to a page directly (no click stored).
   * Each rule returns the nav-key of the PRIMARY item for that URL.
   */
  const URL_NAV_RULES = [
    { test: function(p){ return p.endsWith('/dashboard.html'); },  key: 'dashboard'       },
    { test: function(p){ return p.endsWith('/orders.html');    },  key: 'orders'          },
    { test: function(p){ return p.endsWith('/invoices.html');   },  key: 'invoices'        },
    { test: function(p){ return p.endsWith('/quotations.html'); },  key: 'quotations'      },
    { test: function(p){ return /\/products\/categories\//i.test(p); },  key: 'categories'  },
    { test: function(p){ return /\/products\//i.test(p);     },  key: 'products'        },
    { test: function(p){ return /\/inventory\//i.test(p);    },  key: 'inventory'       },
    { test: function(p){ return /\/customers\//i.test(p);    },  key: 'customers'       },
    { test: function(p){ return /\/vendors\//i.test(p);      },  key: 'vendors'         },
    { test: function(p){ return /\/purchase-orders\//i.test(p); },  key: 'purchase-orders' },
    { test: function(p){ return /\/accounting\//i.test(p);   },  key: 'accounting'      },
    { test: function(p){ return /\/expenses\//i.test(p);    },  key: 'expenses'        },
    { test: function(p){ return /\/hr\//i.test(p);           },  key: 'employees'       },
    { test: function(p){ return /\/attendance\//i.test(p);  },  key: 'attendance'      },
    { test: function(p){ return /\/payroll\//i.test(p);     },  key: 'payroll'         },
    { test: function(p){ return /\/reports\//i.test(p);      },  key: 'reports'         },
    { test: function(p){ return /\/settings\//i.test(p);     },  key: 'settings'        },
    { test: function(p){ return /\/sales\//i.test(p);        },  key: 'orders'          },
  ];

  function resolveKeyFromUrl() {
    const p = window.location.pathname;
    for (var i = 0; i < URL_NAV_RULES.length; i++) {
      if (URL_NAV_RULES[i].test(p)) return URL_NAV_RULES[i].key;
    }
    return 'dashboard';
  }

  /* ── Set active nav item ─────────────────────────────────────
   * Strategy:
   *  1. Check sessionStorage for a previously-clicked nav key
   *     scoped to this exact path (so clicking Invoices on
   *     orders.html persists across reloads of that same page).
   *  2. Fall back to URL-based rule (only ONE key per URL).
   */
  function setActiveNav() {
    var activeKey = null;
    var currentPath = window.location.pathname;

    try {
      var stored = JSON.parse(sessionStorage.getItem('erp_nav_state') || 'null');
      if (stored && stored.path === currentPath) {
        activeKey = stored.key;
      }
    } catch (e) {}

    if (!activeKey) {
      activeKey = resolveKeyFromUrl();
    }

    document.querySelectorAll('#sidebar .nav-item[data-nav-key]').forEach(function (link) {
      link.classList.toggle('active', link.dataset.navKey === activeKey);
    });
  }

  /* ── Track clicked nav item ──────────────────────────────────
   * When the user clicks a nav item, store its key + resolved
   * destination path so setActiveNav() can restore it on load.
   */
  function wireNavState() {
    var nav = document.getElementById('erpSidebarNav');
    if (!nav) return;
    nav.addEventListener('click', function (e) {
      var navItem = e.target.closest('.nav-item[data-nav-key]');
      if (!navItem) return;
      var key = navItem.dataset.navKey;
      var href = navItem.getAttribute('href');
      if (!href) return;
      // Resolve href to an absolute pathname for storage
      var a = document.createElement('a');
      a.href = href;
      var targetPath = a.pathname;
      try {
        sessionStorage.setItem('erp_nav_state', JSON.stringify({ path: targetPath, key: key }));
      } catch (ignore) {}
    });
  }

  /* ── Wire notification panel behaviour ──────────────────────*/
  function wireNotifPanel() {
    const btn      = document.getElementById('erpNotifBtn');
    const panel    = document.getElementById('erpNotifPanel');
    const backdrop = document.getElementById('erpNotifBackdrop');
    const badge    = document.getElementById('erpNotifBadge');
    const markAll  = document.getElementById('erpNotifMarkAll');
    const clearAll = document.getElementById('erpNotifClearAll');
    const list     = document.getElementById('erpNotifList');

    if (!btn || !panel) return;

    let notifications = [...MOCK_NOTIFS];

    function updateBadge() {
      const u = notifications.filter(n => !n.read).length;
      if (badge) {
        badge.textContent = u;
        badge.style.display = u > 0 ? '' : 'none';
      }
    }

    function openPanel() {
      document.body.classList.add('notif-panel-open');
      btn.setAttribute('aria-expanded', 'true');
    }

    function closePanel() {
      document.body.classList.remove('notif-panel-open');
      btn.setAttribute('aria-expanded', 'false');
    }

    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      document.body.classList.contains('notif-panel-open') ? closePanel() : openPanel();
    });

    backdrop && backdrop.addEventListener('click', closePanel);

    list && list.addEventListener('click', function (e) {
      const dismiss = e.target.closest('.notif-dismiss');
      if (dismiss) {
        const item = dismiss.closest('.notif-item');
        const idx = parseInt(item.dataset.index, 10);
        notifications.splice(idx, 1);
        item.remove();
        updateBadge();
      }
    });

    if (markAll) {
      markAll.addEventListener('click', function () {
        notifications.forEach(n => n.read = true);
        list && list.querySelectorAll('.notif-item').forEach(el => {
          el.classList.add('notif-read');
          el.querySelector('.notif-unread-dot')?.remove();
        });
        updateBadge();
      });
    }

    if (clearAll) {
      clearAll.addEventListener('click', function () {
        notifications = [];
        if (list) list.innerHTML = '<p style="padding:1.5rem;text-align:center;color:#9ca3af;font-size:0.875rem;">No notifications</p>';
        updateBadge();
      });
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closePanel();
    });

    updateBadge();
  }

  /* ── Main inject function ────────────────────────────────────*/
  function injectERP() {
    // 1. Sidebar
    const sidebarEl = document.getElementById('sidebar');
    if (sidebarEl) sidebarEl.innerHTML = buildSidebar();

    // 2. Top-bar header
    const topBarEl = document.getElementById('erpTopBar');
    if (topBarEl) {
      const title = getPageTitle(topBarEl);
      topBarEl.innerHTML = buildTopBar(title);
    }

    // 3. Notification panel (appended to body)
    const panelWrapper = document.createElement('div');
    panelWrapper.id = 'erpNotifPanelWrapper';
    panelWrapper.innerHTML = buildNotifPanel();
    document.body.appendChild(panelWrapper);

    // 4. Active nav
    setActiveNav();

    // 5. Track nav clicks (must be before wireNotifPanel)
    wireNavState();

    // 6. Wire notifications
    wireNotifPanel();

    // 7. Sign-out handler
    document.getElementById('erpSignOutBtn')?.addEventListener('click', function (e) {
      e.preventDefault();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = base + '../auth/login.html';
    });
  }

  // Run as soon as DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectERP);
  } else {
    injectERP();
  }

})();
