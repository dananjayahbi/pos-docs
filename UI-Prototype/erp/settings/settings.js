/**
 * settings.js — Shared utilities for all settings sub-pages.
 * Page-specific logic lives inline in each page's <script> block.
 */

/* ── MODAL helpers ───────────────────────────────────────────────── */
function openModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.add('open');
}
function closeModal(id) {
  const m = document.getElementById(id);
  if (m) m.classList.remove('open');
}

/* Close modal when clicking the dark overlay (outside the white box) */
document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

/* Close modal on Escape key */
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(function (m) {
      m.classList.remove('open');
    });
  }
});

/* ── TOAST helper ────────────────────────────────────────────────── */
function showToast(msg, type) {
  type = type || 'success';
  const container = document.getElementById('toastContainer');
  if (!container) return;

  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', warning: 'fa-triangle-exclamation', info: 'fa-circle-info' };
  const colors = { success: '#16a34a', error: '#dc2626', warning: '#d97706', info: '#2563eb' };

  const toast = document.createElement('div');
  toast.style.cssText = [
    'display:flex;align-items:center;gap:.625rem;',
    'background:#fff;border-radius:8px;padding:.625rem .875rem;',
    'box-shadow:0 4px 16px rgba(0,0,0,.12);',
    'font-size:.8rem;font-weight:500;color:#1f2937;',
    'border-left:3px solid ' + (colors[type] || colors.success) + ';',
    'min-width:240px;max-width:340px;'
  ].join('');

  toast.innerHTML =
    '<i class="fa-solid ' + (icons[type] || icons.success) + '" style="color:' + (colors[type] || colors.success) + ';flex-shrink:0;"></i>' +
    '<span>' + msg + '</span>';

  container.appendChild(toast);

  setTimeout(function () {
    toast.style.transition = 'opacity .3s';
    toast.style.opacity = '0';
    setTimeout(function () { if (toast.parentNode) toast.parentNode.removeChild(toast); }, 300);
  }, 3000);
}
