/**
 * LankaCommerce Cloud — Layout Controller
 * Handles sidebar toggle, mobile menu, dropdowns, active nav state
 */

document.addEventListener('DOMContentLoaded', function () {

  // ── Sidebar Toggle ──
  const sidebar = document.querySelector('.sidebar');
  const header = document.querySelector('.header');
  const mainWrapper = document.querySelector('.main-wrapper');
  const toggleBtn = document.querySelector('.header-toggle-btn');
  const mobileOverlay = document.querySelector('.sidebar-overlay');

  const COLLAPSED_KEY = 'lcc_sidebar_collapsed';
  let isCollapsed = localStorage.getItem(COLLAPSED_KEY) === 'true';

  function applyCollapsedState() {
    if (!sidebar) return;
    if (window.innerWidth > 1024) {
      sidebar.classList.toggle('collapsed', isCollapsed);
      header && header.classList.toggle('sidebar-collapsed', isCollapsed);
      mainWrapper && mainWrapper.classList.toggle('sidebar-collapsed', isCollapsed);
    } else {
      sidebar.classList.remove('collapsed');
    }
  }

  applyCollapsedState();

  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      if (window.innerWidth > 1024) {
        isCollapsed = !isCollapsed;
        localStorage.setItem(COLLAPSED_KEY, isCollapsed);
        applyCollapsedState();
      } else {
        sidebar && sidebar.classList.toggle('mobile-open');
        mobileOverlay && mobileOverlay.classList.toggle('active');
      }
    });
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => {
      sidebar && sidebar.classList.remove('mobile-open');
      mobileOverlay.classList.remove('active');
    });
  }

  window.addEventListener('resize', applyCollapsedState);

  // ── Active Nav Item ──
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item[href]').forEach(item => {
    const href = item.getAttribute('href');
    if (href && currentPath.includes(href.replace('../', '').replace('.html', ''))) {
      item.classList.add('active');
    }
  });

  // ── Dropdown Menus ──
  document.querySelectorAll('[data-dropdown]').forEach(trigger => {
    const menuId = trigger.getAttribute('data-dropdown');
    const menu = document.getElementById(menuId) || trigger.nextElementSibling;
    if (!menu) return;

    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      closeAllDropdowns();
      if (!isOpen) menu.classList.add('show');
    });
  });

  function closeAllDropdowns() {
    document.querySelectorAll('.dropdown-menu.show').forEach(m => m.classList.remove('show'));
  }

  document.addEventListener('click', closeAllDropdowns);

  // ── Modals ──
  // Open modal
  document.querySelectorAll('[data-modal-open]').forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.getAttribute('data-modal-open');
      openModal(id);
    });
  });

  // Close modal
  document.querySelectorAll('[data-modal-close], .modal-close').forEach(btn => {
    btn.addEventListener('click', function () {
      const overlay = this.closest('.modal-overlay');
      if (overlay) closeModal(overlay.id);
    });
  });

  // Close on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) closeModal(this.id);
    });
  });

  // ESC key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      const open = document.querySelector('.modal-overlay.show');
      if (open) closeModal(open.id);
    }
  });

  // ── Tabs ──
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      const group = this.closest('[data-tab-group]') || this.closest('.tabs')?.nextElementSibling;
      const tabId = this.getAttribute('data-tab');

      // Update active button
      const container = this.closest('.tab-list') || this.parentElement;
      container.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');

      // Show tab content
      const parentSection = this.closest('.tabs-section') || document;
      parentSection.querySelectorAll('.tab-content').forEach(panel => {
        panel.classList.toggle('active', panel.getAttribute('data-tab') === tabId);
      });
    });
  });

  // Activate first tab by default
  document.querySelectorAll('.tab-list').forEach(list => {
    const firstActive = list.querySelector('.tab-btn.active');
    if (!firstActive) {
      const first = list.querySelector('.tab-btn');
      if (first) first.click();
    }
  });

  // ── Confirm Dialogs ──
  document.querySelectorAll('[data-confirm]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const msg = this.getAttribute('data-confirm') || 'Are you sure?';
      if (!confirm(msg)) e.preventDefault();
    });
  });

  // ── Auto-dismiss alerts ──
  document.querySelectorAll('.alert[data-auto-close]').forEach(alert => {
    const delay = parseInt(alert.getAttribute('data-auto-close')) || 5000;
    setTimeout(() => {
      alert.style.opacity = '0';
      alert.style.transition = 'opacity 0.3s';
      setTimeout(() => alert.remove(), 300);
    }, delay);
  });

});

// ── Global Modal Functions ──
function openModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.add('show');
    document.body.style.overflow = 'hidden';
    // Focus first input
    setTimeout(() => {
      const first = overlay.querySelector('input:not([type=hidden]), select, textarea');
      if (first) first.focus();
    }, 150);
  }
}

function closeModal(id) {
  const overlay = document.getElementById(id);
  if (overlay) {
    overlay.classList.remove('show');
    document.body.style.overflow = '';
  }
}

// ── Global confirm helper ──
function confirmAction(message, onConfirm) {
  // Check if custom confirm modal exists
  const confirmModal = document.getElementById('confirmModal');
  if (confirmModal) {
    document.getElementById('confirmMessage').textContent = message;
    openModal('confirmModal');
    const yesBtn = document.getElementById('confirmYesBtn');
    const handler = function () {
      closeModal('confirmModal');
      onConfirm();
      yesBtn.removeEventListener('click', handler);
    };
    yesBtn.addEventListener('click', handler);
  } else {
    if (confirm(message)) onConfirm();
  }
}
