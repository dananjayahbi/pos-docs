/* settings.js — Platform Settings page logic — LCC Admin */
/* Handles: Maintenance mode toggle intercept with type-to-confirm modal */

(function () {
  'use strict';

  /* ── Refs populated on DOMContentLoaded ─── */
  let toggle, confirmInput, confirmBtn, activeBanner;

  /* ── Toast helper ───────────────────────── */
  function showToast(msg, type) {
    const bg = type === 'warning' ? '#b45309' : '#16a34a';
    const t = document.createElement('div');
    t.style.cssText = [
      'position:fixed', 'bottom:1.5rem', 'right:1.5rem', 'z-index:9999',
      'background:' + bg, 'color:#fff', 'border-radius:10px',
      'padding:0.75rem 1.25rem', 'font-size:0.875rem', 'font-weight:500',
      'box-shadow:0 4px 16px rgba(0,0,0,.18)',
      'display:flex', 'align-items:center', 'gap:0.5rem',
      'animation:toastIn .25s ease',
    ].join(';');
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 4000);
  }

  /* ── Clear confirm input ─────────────────── */
  function clearMMInput() {
    if (!confirmInput) return;
    confirmInput.value = '';
    confirmInput.classList.remove('mm-input-valid');
    if (confirmBtn) confirmBtn.disabled = true;
    const hint = document.getElementById('mmInputHint');
    if (hint) hint.textContent = '';
  }

  /* ── Show/hide active banner ─────────────── */
  function setMaintenanceBanner(active) {
    const panel = document.getElementById('maintenance');
    if (!panel) return;
    let banner = panel.querySelector('.maintenance-active-banner');
    if (active) {
      if (!banner) {
        banner = document.createElement('div');
        banner.className = 'maintenance-active-banner';
        banner.innerHTML =
          '<i class="fa-solid fa-triangle-exclamation"></i>' +
          '<span><strong>Maintenance Mode is ON.</strong> All tenant storefronts are currently unreachable.</span>' +
          '<button class="btn-mm-disable" id="disableMaintenanceBtn" title="Disable maintenance mode">' +
          '<i class="fa-solid fa-circle-xmark"></i> Disable</button>';
        // Insert after panel-head
        const head = panel.querySelector('.panel-head');
        if (head) head.insertAdjacentElement('afterend', banner);
        else panel.prepend(banner);
      }
      banner.style.display = 'flex';
      // Wire the inline disable button
      const disBtn = banner.querySelector('#disableMaintenanceBtn');
      if (disBtn) {
        disBtn.addEventListener('click', function () {
          toggle.checked = false;
          setMaintenanceBanner(false);
          showToast('Maintenance mode disabled', 'success');
        });
      }
    } else {
      if (banner) banner.style.display = 'none';
    }
  }

  /* ── DOM Ready ───────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    toggle       = document.getElementById('maintenanceModeToggle');
    confirmInput = document.getElementById('maintenanceConfirmInput');
    confirmBtn   = document.getElementById('maintenanceConfirmBtn');

    if (!toggle) return;

    /* ── Intercept toggle enable ─────────── */
    toggle.addEventListener('change', function () {
      if (this.checked) {
        // Immediately revert — user must go through modal
        this.checked = false;
        clearMMInput();
        if (typeof openModal === 'function') openModal('maintenanceModeModal');
      } else {
        // Disabling doesn't need confirmation
        setMaintenanceBanner(false);
        showToast('Maintenance mode disabled', 'success');
      }
    });

    /* ── Confirm input watcher ───────────── */
    if (confirmInput) {
      confirmInput.addEventListener('input', function () {
        const val = this.value.toLowerCase().trim();
        const ok  = val === 'confirm';
        if (confirmBtn) confirmBtn.disabled = !ok;
        this.classList.toggle('mm-input-valid', ok);
        const hint = document.getElementById('mmInputHint');
        if (hint) {
          hint.textContent = ok ? '' : (this.value.length > 0 ? 'Keep typing… must be exactly "confirm"' : '');
          hint.className   = ok ? 'mm-input-hint mm-hint-ok' : 'mm-input-hint';
        }
      });
    }

    /* ── Confirm button click ────────────── */
    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        if (this.disabled) return;
        // Actually enable maintenance mode
        toggle.checked = true;
        clearMMInput();
        if (typeof closeModal === 'function') closeModal('maintenanceModeModal');
        setMaintenanceBanner(true);
        showToast('Maintenance mode is now enabled', 'warning');
      });
    }

    /* ── Cancel / close resets state ──────── */
    const mmCancel   = document.getElementById('mmCancelBtn');
    const mmCloseBtn = document.getElementById('mmModalCloseBtn');

    function onCancel() {
      toggle.checked = false;
      clearMMInput();
    }

    if (mmCancel)   mmCancel.addEventListener('click',   onCancel);
    if (mmCloseBtn) mmCloseBtn.addEventListener('click', onCancel);

    // Also handle Enter key shortcut when input is valid
    if (confirmInput) {
      confirmInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !confirmBtn.disabled) {
          confirmBtn.click();
        }
      });
    }

    /* ── Settings nav smooth scroll ────────── */
    document.querySelectorAll('.settings-nav-item').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.settings-nav-item').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  });

})();
