/**
 * LCC Tenant ERP — Layout Controller
 *
 * Mirrors admin.js sidebar collapse/toggle behaviour for ERP pages.
 * Expects erp-header.js to have already injected:
 *   - #sidebar          (the aside element)
 *   - #erpTopBar        (the .top-bar header)
 *   - #sidebarToggle    (the hamburger button inside the top-bar)
 *   - #sidebarOverlay   (the mobile backdrop)
 *   - #mainWrapper      (the main content wrapper)
 */
document.addEventListener('DOMContentLoaded', function () {
  'use strict';

  const sidebar  = document.getElementById('sidebar');
  const wrapper  = document.getElementById('mainWrapper');
  const topBar   = document.getElementById('erpTopBar');
  const overlay  = document.getElementById('sidebarOverlay');
  const KEY      = 'lcc_erp_sidebar_collapsed';

  /* ── Collapse / expand ──────────────────────────────────── */
  function applyCollapse(collapsed) {
    const c = collapsed === true || collapsed === 'true';
    if (window.innerWidth > 1024) {
      sidebar  && sidebar.classList.toggle('collapsed', c);
      wrapper  && wrapper.classList.toggle('sidebar-collapsed', c);
      topBar   && topBar.classList.toggle('sidebar-collapsed', c);
      localStorage.setItem(KEY, String(c));
    } else {
      // Mobile: slide-in panel
      sidebar  && sidebar.classList.toggle('mobile-open', !c);
      overlay  && overlay.classList.toggle('active', !c);
    }
  }

  // Restore last state
  applyCollapse(localStorage.getItem(KEY));

  /* ── Toggle button (injected by erp-header.js) ───────────── */
  // Use event delegation since the button is injected after this script may load
  document.addEventListener('click', function (e) {
    if (e.target.closest('#sidebarToggle')) {
      if (window.innerWidth > 1024) {
        applyCollapse(localStorage.getItem(KEY) !== 'true');
      } else {
        // Mobile: toggle open
        applyCollapse(sidebar ? sidebar.classList.contains('mobile-open') : false);
      }
    }
  });

  /* ── Mobile overlay close ────────────────────────────────── */
  if (overlay) {
    overlay.addEventListener('click', function () {
      sidebar  && sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
  }

  /* ── Resize handler ──────────────────────────────────────── */
  window.addEventListener('resize', function () {
    applyCollapse(localStorage.getItem(KEY));
  });

});
