/* ============================================================
   tenants.js — Tenants page specific interactivity
   Handles: View / Edit / Confirm action modals in tenants.html
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ── Helper: read tenant data from a table row ──────────────────
  function rowData(row) {
    return {
      name:      row.querySelector('.store-name')?.textContent.trim()  || '—',
      domain:    row.querySelector('.store-domain')?.textContent.trim() || '—',
      tenantId:  row.querySelector('.tenant-id')?.textContent.trim()   || '—',
      plan:      row.cells[3]?.querySelector('.badge')?.textContent.trim() || '—',
      planClass: row.cells[3]?.querySelector('.badge')?.className || '',
      status:    row.cells[4]?.querySelector('.badge')?.textContent.trim() || '—',
      statusClass: row.cells[4]?.querySelector('.badge')?.className || '',
      employees: row.cells[5]?.textContent.trim() || '—',
      storage:   row.querySelector('.storage-text')?.textContent.trim() || '—',
      revenue:   row.cells[7]?.textContent.trim() || '—',
      regDate:   row.cells[8]?.textContent.trim() || '—',
    };
  }

  // ── VIEW MODAL ─────────────────────────────────────────────────
  function populateView(t) {
    setText('viewTenantNameTitle',    t.name);
    setText('viewTenantDomainSubtitle', t.domain);
    setText('viewTenantId',           t.tenantId);
    setText('viewTenantRegDate',      t.regDate);
    setText('viewTenantEmployees',    t.employees);
    setText('viewTenantStorage',      t.storage);
    setText('viewTenantRevenue',      t.revenue);
    setText('viewTenantDomainField',  t.domain);

    const planEl = document.getElementById('viewTenantPlan');
    if (planEl) { planEl.className = ''; planEl.innerHTML = `<span class="${t.planClass}">${t.plan}</span>`; }

    const statusEl = document.getElementById('viewTenantStatus');
    if (statusEl) { statusEl.className = ''; statusEl.innerHTML = `<span class="${t.statusClass}">${t.status}</span>`; }
  }

  // ── EDIT MODAL ─────────────────────────────────────────────────
  function populateEdit(t) {
    setText('editTenantSubtitle', t.domain);
    setVal('editName',  t.name);
    setVal('editEmail', '');       // not available from DOM — leave blank
    setVal('editPhone', '');       // not available from DOM — leave blank

    // Set plan select
    const planMap = { 'Free': 'FREE', 'Starter': 'STARTER', 'Pro': 'PRO', 'Enterprise': 'ENTERPRISE' };
    setSelect('editPlan', planMap[t.plan] || 'PRO');

    // Set status select
    const statusMap = { 'Active': 'ACTIVE', 'Trial': 'TRIAL', 'Suspended': 'SUSPENDED' };
    setSelect('editStatus', statusMap[t.status] || 'ACTIVE');
  }

  // ── CONFIRM MODAL ───────────────────────────────────────────────
  let _confirmCallback = null;

  function setupConfirm({ title, msg, btnLabel, btnClass, icon, callback }) {
    setText('confirmModalTitle', title);
    setText('confirmModalMsg',   msg);

    const btn = document.getElementById('confirmModalBtn');
    if (btn) {
      btn.textContent = btnLabel;
      btn.className   = `btn ${btnClass}`;
    }

    const iconEl = document.getElementById('confirmModalIcon');
    if (iconEl) iconEl.innerHTML = `<i class="fa-solid ${icon}"></i>`;

    _confirmCallback = callback;
  }

  document.getElementById('confirmModalBtn')?.addEventListener('click', () => {
    if (typeof _confirmCallback === 'function') _confirmCallback();
    if (typeof closeModal === 'function') closeModal('confirmActionModal');
    _confirmCallback = null;
  });

  // ── VIEW → EDIT shortcut ────────────────────────────────────────
  let _activeRowRef = null;

  document.getElementById('viewToEditBtn')?.addEventListener('click', () => {
    if (_activeRowRef) {
      populateEdit(rowData(_activeRowRef));
      if (typeof closeModal === 'function') closeModal('viewTenantModal');
      if (typeof openModal  === 'function') openModal('editTenantModal');
    }
  });

  // ── EDIT SUBMIT ─────────────────────────────────────────────────
  document.getElementById('submitEditTenant')?.addEventListener('click', () => {
    const nameInput = document.getElementById('editName');
    if (!nameInput?.value.trim()) {
      nameInput?.classList.add('input-error');
      return;
    }
    nameInput?.classList.remove('input-error');

    // Update row in table (optimistic UI)
    if (_activeRowRef) {
      const nameCell = _activeRowRef.querySelector('.store-name');
      if (nameCell) nameCell.textContent = nameInput.value.trim();
    }

    if (typeof closeModal === 'function') closeModal('editTenantModal');
    showTenantsToast('Tenant updated successfully.');
    _activeRowRef = null;
  });

  // ── TABLE ROW ACTIONS ───────────────────────────────────────────
  document.querySelector('.data-table tbody')?.addEventListener('click', e => {
    const viewBtn    = e.target.closest('[title="View"]');
    const editBtn    = e.target.closest('[title="Edit"]');
    const suspendBtn = e.target.closest('[title="Suspend"]');
    const activateBtn= e.target.closest('[title="Activate"]');

    if (viewBtn) {
      const row = viewBtn.closest('tr');
      _activeRowRef = row;
      populateView(rowData(row));
      if (typeof openModal === 'function') openModal('viewTenantModal');
    }

    if (editBtn) {
      const row = editBtn.closest('tr');
      _activeRowRef = row;
      populateEdit(rowData(row));
      if (typeof openModal === 'function') openModal('editTenantModal');
    }

    if (suspendBtn) {
      const row = suspendBtn.closest('tr');
      const t   = rowData(row);
      setupConfirm({
        title:    'Suspend Tenant',
        msg:      `Are you sure you want to suspend "${t.name}"? They will lose access to the platform immediately.`,
        btnLabel: 'Suspend',
        btnClass: 'btn-danger',
        icon:     'fa-ban',
        callback: () => {
          // Toggle badge and button in UI
          const statusBadge = row.cells[4]?.querySelector('.badge');
          if (statusBadge) { statusBadge.className = 'badge badge-suspended'; statusBadge.textContent = 'Suspended'; }
          suspendBtn.title = 'Activate';
          suspendBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          suspendBtn.classList.remove('text-danger');
          suspendBtn.classList.add('text-success');
          showTenantsToast(`"${t.name}" suspended.`, 'warn');
        },
      });
      if (typeof openModal === 'function') openModal('confirmActionModal');
    }

    if (activateBtn) {
      const row = activateBtn.closest('tr');
      const t   = rowData(row);
      setupConfirm({
        title:    'Activate Tenant',
        msg:      `Re-activate "${t.name}"? They will regain full platform access.`,
        btnLabel: 'Activate',
        btnClass: 'btn-success',
        icon:     'fa-circle-check',
        callback: () => {
          const statusBadge = row.cells[4]?.querySelector('.badge');
          if (statusBadge) { statusBadge.className = 'badge badge-active'; statusBadge.textContent = 'Active'; }
          activateBtn.title = 'Suspend';
          activateBtn.innerHTML = '<i class="fa-solid fa-ban"></i>';
          activateBtn.classList.remove('text-success');
          activateBtn.classList.add('text-danger');
          showTenantsToast(`"${t.name}" activated.`);
        },
      });
      if (typeof openModal === 'function') openModal('confirmActionModal');
    }
  });

  // ── Utilities ───────────────────────────────────────────────────
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
  function setSelect(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function showTenantsToast(msg, type = 'success') {
    const colors = { success: '#16a34a', warn: '#d97706', error: '#dc2626' };
    const t = Object.assign(document.createElement('div'), { textContent: msg });
    Object.assign(t.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      padding: '12px 20px', borderRadius: '8px',
      fontSize: '14px', fontWeight: '500', zIndex: '9999',
      background: colors[type] || colors.success,
      color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

});
