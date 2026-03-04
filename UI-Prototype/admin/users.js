/* users.js — Platform Users page logic — LCC Admin */
/* Handles: Invite User modal, dynamic filtering, pagination */

(function () {
  'use strict';

  /* ── Dataset ─────────────────────────────── */
  const USERS = [
    { id:'UID-001', name:'Kavinda Perera',        email:'k.perera@lcc.lk',           role:'SUPER_ADMIN', status:'ACTIVE',   phone:'+94 77 234 5678', dept:'Platform',        lastLogin:'Today, 09:14',      init:'KP', color:'ua-red'    },
    { id:'UID-002', name:'Nuwani Fernando',        email:'n.fernando@lcc.lk',         role:'SUPER_ADMIN', status:'ACTIVE',   phone:'+94 71 345 6789', dept:'Platform',        lastLogin:'Today, 08:55',      init:'NF', color:'ua-blue'   },
    { id:'UID-003', name:'Charith Bandara',        email:'c.bandara@lcc.lk',          role:'SUPER_ADMIN', status:'ACTIVE',   phone:'+94 76 456 7890', dept:'Platform',        lastLogin:'Yesterday, 22:10',  init:'CB', color:'ua-indigo' },
    { id:'UID-004', name:'Dilini Senanayake',      email:'d.senanayake@lcc.lk',       role:'SUPER_ADMIN', status:'INACTIVE', phone:'+94 70 567 8901', dept:'Platform',        lastLogin:'12 Jan 2026',       init:'DS', color:'ua-purple' },
    { id:'UID-005', name:'Sandun Rathnayake',      email:'s.rathnayake@lcc.lk',       role:'SUPPORT',     status:'ACTIVE',   phone:'+94 77 678 9012', dept:'Customer Support',lastLogin:'Yesterday, 17:32',  init:'SR', color:'ua-green'  },
    { id:'UID-006', name:'Harsha Wijesinghe',      email:'h.wijesinghe@lcc.lk',       role:'SUPPORT',     status:'ACTIVE',   phone:'+94 71 789 0123', dept:'Technical Support',lastLogin:'Today, 06:55',     init:'HW', color:'ua-teal'   },
    { id:'UID-007', name:'Dinusha Wickramasinghe', email:'d.wickramasinghe@lcc.lk',   role:'SUPPORT',     status:'ACTIVE',   phone:'+94 76 890 1234', dept:'Onboarding',      lastLogin:'2 Mar 2026',        init:'DW', color:'ua-purple' },
    { id:'UID-008', name:'Amali Gunawardena',      email:'a.gunawardena@lcc.lk',      role:'SUPPORT',     status:'ACTIVE',   phone:'+94 70 901 2345', dept:'Customer Support',lastLogin:'Today, 11:02',      init:'AG', color:'ua-orange' },
    { id:'UID-009', name:'Chathura Mendis',        email:'c.mendis@lcc.lk',           role:'SUPPORT',     status:'INACTIVE', phone:'+94 77 012 3456', dept:'Technical Support',lastLogin:'15 Feb 2026',      init:'CM', color:'ua-red'    },
    { id:'UID-010', name:'Sachini Dias',           email:'s.dias@lcc.lk',             role:'SUPPORT',     status:'PENDING',  phone:'+94 71 123 4567', dept:'Onboarding',      lastLogin:'— Never —',         init:'SD', color:'ua-blue'   },
    { id:'UID-011', name:'Tharushi Jayawardena',   email:'t.jayawardena@lcc.lk',      role:'BILLING',     status:'ACTIVE',   phone:'+94 76 234 5678', dept:'Finance',         lastLogin:'Today, 07:44',      init:'TJ', color:'ua-orange' },
    { id:'UID-012', name:'Roshan Kumara',          email:'r.kumara@lcc.lk',           role:'BILLING',     status:'ACTIVE',   phone:'+94 70 345 6789', dept:'Finance',         lastLogin:'Today, 09:30',      init:'RK', color:'ua-green'  },
    { id:'UID-013', name:'Nadeesha Perera',        email:'n.perera@lcc.lk',           role:'BILLING',     status:'ACTIVE',   phone:'+94 77 456 7890', dept:'Finance',         lastLogin:'Yesterday, 14:21',  init:'NP', color:'ua-teal'   },
    { id:'UID-014', name:'Pradeep Silva',          email:'p.silva@lcc.lk',            role:'BILLING',     status:'ACTIVE',   phone:'+94 71 567 8901', dept:'Finance',         lastLogin:'Today, 10:15',      init:'PS', color:'ua-indigo' },
    { id:'UID-015', name:'Thilina Madushanka',     email:'t.madushanka@lcc.lk',       role:'BILLING',     status:'INACTIVE', phone:'+94 76 678 9012', dept:'Finance',         lastLogin:'8 Jan 2026',        init:'TM', color:'ua-red'    },
    { id:'UID-016', name:'Roshani De Silva',       email:'r.desilva@lcc.lk',          role:'BILLING',     status:'INACTIVE', phone:'+94 70 789 0123', dept:'Finance',         lastLogin:'28 Feb 2026',       init:'RD', color:'ua-teal'   },
    { id:'UID-017', name:'Malshani Jayasekara',    email:'m.jayasekara@lcc.lk',       role:'SUPPORT',     status:'ACTIVE',   phone:'+94 77 890 1234', dept:'Customer Support',lastLogin:'Today, 08:00',      init:'MJ', color:'ua-purple' },
    { id:'UID-018', name:'Gayan Pathirana',        email:'g.pathirana@lcc.lk',        role:'SUPPORT',     status:'ACTIVE',   phone:'+94 71 901 2345', dept:'Technical Support',lastLogin:'Yesterday, 21:45', init:'GP', color:'ua-blue'   },
    { id:'UID-019', name:'Isuri Ranasinghe',       email:'i.ranasinghe@lcc.lk',       role:'SUPPORT',     status:'PENDING',  phone:'+94 76 012 3456', dept:'Onboarding',      lastLogin:'— Never —',         init:'IR', color:'ua-green'  },
    { id:'UID-020', name:'Shehan Weerasinghe',     email:'s.weerasinghe@lcc.lk',      role:'BILLING',     status:'ACTIVE',   phone:'+94 70 123 4567', dept:'Finance',         lastLogin:'Today, 07:10',      init:'SW', color:'ua-orange' },
    { id:'UID-021', name:'Kalani Abeywickrama',    email:'k.abeywickrama@lcc.lk',     role:'SUPPORT',     status:'ACTIVE',   phone:'+94 77 234 5679', dept:'Customer Support',lastLogin:'Today, 12:00',      init:'KA', color:'ua-red'    },
    { id:'UID-022', name:'Malith Kumara',          email:'m.kumara@lcc.lk',           role:'SUPPORT',     status:'PENDING',  phone:'+94 71 345 6780', dept:'Onboarding',      lastLogin:'— Never —',         init:'MK', color:'ua-indigo' },
    { id:'UID-023', name:'Udara Samarakoon',       email:'u.samarakoon@lcc.lk',       role:'BILLING',     status:'ACTIVE',   phone:'+94 76 456 7891', dept:'Finance',         lastLogin:'Yesterday, 18:55',  init:'US', color:'ua-teal'   },
    { id:'UID-024', name:'Lahiru Dissanayake',     email:'l.dissanayake@lcc.lk',      role:'SUPER_ADMIN', status:'ACTIVE',   phone:'+94 70 567 8902', dept:'Platform',        lastLogin:'Today, 05:30',      init:'LD', color:'ua-green'  },
  ];

  const PAGE_SIZE = 10;
  let currentPage = 1;

  /* ── Helpers ─────────────────────────────── */
  function roleBadge(r) {
    const map = {
      SUPER_ADMIN: '<span class="badge badge-superadmin">Super Admin</span>',
      SUPPORT:     '<span class="badge badge-support">Support</span>',
      BILLING:     '<span class="badge badge-billing">Billing</span>',
    };
    return map[r] || r;
  }

  function statusBadge(s) {
    const map = {
      ACTIVE:   '<span class="badge badge-active">Active</span>',
      INACTIVE: '<span class="badge badge-inactive">Inactive</span>',
      PENDING:  '<span class="badge badge-pending">Pending</span>',
    };
    return map[s] || s;
  }

  function actionBtns(u) {
    if (u.status === 'PENDING') {
      return `<div class="action-btns">
        <button class="icon-btn-sm" title="Resend Invite" data-action="resend" data-uid="${u.id}"><i class="fa-solid fa-paper-plane"></i></button>
        <button class="icon-btn-sm" title="Edit" data-action="edit" data-uid="${u.id}"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn-sm text-danger" title="Revoke" data-action="revoke" data-uid="${u.id}"><i class="fa-solid fa-trash"></i></button>
      </div>`;
    }
    const toggleBtn = u.status === 'ACTIVE'
      ? `<button class="icon-btn-sm text-danger" title="Deactivate" data-action="deactivate" data-uid="${u.id}"><i class="fa-solid fa-user-slash"></i></button>`
      : `<button class="icon-btn-sm text-success" title="Activate"   data-action="activate"   data-uid="${u.id}"><i class="fa-solid fa-user-check"></i></button>`;
    return `<div class="action-btns">
      <button class="icon-btn-sm" title="View" data-action="view" data-uid="${u.id}"><i class="fa-solid fa-eye"></i></button>
      <button class="icon-btn-sm" title="Edit" data-action="edit" data-uid="${u.id}"><i class="fa-solid fa-pen"></i></button>
      ${toggleBtn}
    </div>`;
  }

  function buildRow(u) {
    return `<tr data-uid="${u.id}">
      <td><input type="checkbox"/></td>
      <td><div class="user-cell">
        <div class="user-avatar ${u.color}">${u.init}</div>
        <div><div class="user-name">${u.name}</div><div class="user-id">${u.id}</div></div>
      </div></td>
      <td class="text-muted">${u.email}</td>
      <td>${roleBadge(u.role)}</td>
      <td><span class="text-muted fst-italic">— Platform —</span></td>
      <td class="text-muted">${u.lastLogin}</td>
      <td>${statusBadge(u.status)}</td>
      <td>${actionBtns(u)}</td>
    </tr>`;
  }

  /* ── Filter ──────────────────────────────── */
  function getFiltered() {
    const q    = (document.getElementById('userSearchInput')?.value || '').toLowerCase().trim();
    const role = document.getElementById('roleFilterSelect')?.value  || '';
    const st   = document.getElementById('statusFilterSelect')?.value || '';
    return USERS.filter(u => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.id.toLowerCase().includes(q)) return false;
      if (role && u.role !== role) return false;
      if (st   && u.status !== st) return false;
      return true;
    });
  }

  /* ── Pagination ──────────────────────────── */
  function renderPagination(total, page, el) {
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    let html = '';
    const prevDis = page <= 1 ? ' disabled' : '';
    const nextDis = page >= pages ? ' disabled' : '';
    html += `<button class="page-btn"${prevDis} data-action="prev"><i class="fa-solid fa-chevron-left"></i></button>`;
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) html += `<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`;
    } else {
      const show = new Set([1, pages, page, page - 1, page + 1].filter(x => x >= 1 && x <= pages));
      let prev = 0;
      [...show].sort((a, b) => a - b).forEach(p => {
        if (prev && p - prev > 1) html += '<span class="page-ellipsis">…</span>';
        html += `<button class="page-btn${p === page ? ' active' : ''}" data-page="${p}">${p}</button>`;
        prev = p;
      });
    }
    html += `<button class="page-btn"${nextDis} data-action="next"><i class="fa-solid fa-chevron-right"></i></button>`;
    el.innerHTML = html;
  }

  /* ── Render Table ────────────────────────── */
  function renderTable(data, page) {
    currentPage = page;
    const tbody  = document.getElementById('userTableBody');
    const countEl   = document.getElementById('tableCountLabel');
    const pageInfoEl = document.getElementById('paginationInfo');
    const paginEl   = document.getElementById('paginationControls');
    if (!tbody) return;

    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > pages) currentPage = pages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = data.slice(start, start + PAGE_SIZE);

    tbody.innerHTML = slice.length
      ? slice.map(buildRow).join('')
      : '<tr><td colspan="8" style="text-align:center;padding:2rem;color:#9ca3af">No users found.</td></tr>';

    if (countEl) countEl.textContent = `Showing ${Math.min(start + 1, total)}–${Math.min(start + slice.length, total)} of ${total} users`;
    if (pageInfoEl) pageInfoEl.innerHTML = `Page ${currentPage} of ${pages} &nbsp;·&nbsp; ${total} total records`;
    if (paginEl) renderPagination(total, currentPage, paginEl);

    updateStats(data);
  }

  /* ── Stats ───────────────────────────────── */
  function updateStats(data) {
    const set = id => el => { const e = document.getElementById(id); if (e) e.textContent = el; };
    const all = data || getFiltered();
    set('statTotalUsers')(all.length);
    set('statSuperAdmins')(all.filter(u => u.role === 'SUPER_ADMIN').length);
    set('statSupportStaff')(all.filter(u => u.role === 'SUPPORT').length);
    set('statBillingAgents')(all.filter(u => u.role === 'BILLING').length);
  }

  /* ── Filter Events ───────────────────────── */
  function applyFilters() { renderTable(getFiltered(), 1); }

  document.getElementById('userSearchInput')?.addEventListener('input', applyFilters);
  document.getElementById('roleFilterSelect')?.addEventListener('change', applyFilters);
  document.getElementById('statusFilterSelect')?.addEventListener('change', applyFilters);
  document.getElementById('clearFiltersBtn')?.addEventListener('click', function () {
    const s = document.getElementById('userSearchInput'); if (s) s.value = '';
    const r = document.getElementById('roleFilterSelect'); if (r) r.value = '';
    const st = document.getElementById('statusFilterSelect'); if (st) st.value = '';
    applyFilters();
  });

  /* ── Pagination click handler ────────────── */
  document.getElementById('paginationControls')?.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-page],[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const data = getFiltered();
    const pages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    if (action === 'prev') { if (currentPage > 1) renderTable(data, currentPage - 1); }
    else if (action === 'next') { if (currentPage < pages) renderTable(data, currentPage + 1); }
    else if (btn.dataset.page) { renderTable(data, parseInt(btn.dataset.page)); }
  });

  /* ── Role hint map ───────────────────────── */
  const ROLE_HINTS = {
    SUPER_ADMIN: 'Full platform access — can manage tenants, billing, platform settings, and all admin users.',
    SUPPORT:     'Can view tenant data, manage tickets, and assist tenants. Cannot access billing or platform config.',
    BILLING:     'Can manage subscription plans, invoices, and payment records. No access to tenant operational data.',
  };

  document.getElementById('inviteRole')?.addEventListener('change', function () {
    const box  = document.getElementById('roleHintBox');
    const text = document.getElementById('roleHintText');
    if (!box || !text) return;
    if (this.value && ROLE_HINTS[this.value]) {
      text.textContent = ROLE_HINTS[this.value];
      box.style.display = 'flex';
    } else {
      box.style.display = 'none';
    }
  });

  /* ── Invite User modal submit ────────────── */
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'invite-toast';
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  function clearInviteForm() {
    const form = document.getElementById('inviteUserForm');
    if (form) form.reset();
    document.getElementById('roleHintBox')?.style && (document.getElementById('roleHintBox').style.display = 'none');
    document.querySelectorAll('#inviteUserForm .input-error').forEach(el => el.classList.remove('input-error'));
  }

  document.getElementById('submitInviteUser')?.addEventListener('click', function () {
    const nameEl  = document.getElementById('inviteFullName');
    const emailEl = document.getElementById('inviteEmail');
    const roleEl  = document.getElementById('inviteRole');
    let valid = true;

    [nameEl, emailEl, roleEl].forEach(el => el?.classList.remove('input-error'));

    if (!nameEl?.value.trim())  { nameEl?.classList.add('input-error');  valid = false; }
    if (!emailEl?.value.trim()) { emailEl?.classList.add('input-error'); valid = false; }
    if (!roleEl?.value)         { roleEl?.classList.add('input-error');  valid = false; }
    if (!valid) return;

    const statusEl = document.getElementById('inviteStatus');
    const newUser = {
      id:        'UID-' + String(USERS.length + 1).padStart(3, '0'),
      name:      nameEl.value.trim(),
      email:     emailEl.value.trim().toLowerCase(),
      role:      roleEl.value,
      status:    statusEl?.value || 'PENDING',
      phone:     document.getElementById('invitePhone')?.value.trim() || '',
      dept:      document.getElementById('inviteDept')?.value.trim()  || '',
      lastLogin: '— Never —',
      init:      nameEl.value.trim().split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join(''),
      color:     ['ua-red','ua-blue','ua-green','ua-purple','ua-orange','ua-teal','ua-indigo'][USERS.length % 7],
    };

    USERS.push(newUser);
    renderTable(getFiltered(), 1);

    // close modal
    if (typeof closeModal === 'function') closeModal('inviteUserModal');
    clearInviteForm();
    showToast(`Invitation sent to ${newUser.email}`);
  });

  // Reset form when modal closes
  document.getElementById('cancelInviteUser')?.addEventListener('click', clearInviteForm);
  document.querySelector('#inviteUserModal [data-modal-close]')?.addEventListener('click', clearInviteForm);

  /* ── View / Edit / Confirm action modal state ─────────── */
  let _activeUser = null;
  let _confirmCb  = null;

  /* ── Role label ──────────────────────────── */
  function roleLabel(r) {
    return { SUPER_ADMIN: 'Super Admin', SUPPORT: 'Support Staff', BILLING: 'Billing Agent' }[r] || r;
  }

  /* ── Open View User Modal ────────────────── */
  function openUserView(u) {
    _activeUser = u;
    const set = (id, val) => { const e = document.getElementById(id); if (e) e.innerHTML = val; };
    document.getElementById('viewUserNameTitle').textContent = u.name;
    document.getElementById('viewUserIdSubtitle').textContent = u.id;
    set('viewUserRole',      roleBadge(u.role));
    set('viewUserStatus',    statusBadge(u.status));
    set('viewUserLastLogin', u.lastLogin);
    set('viewUserEmail',     u.email || '—');
    set('viewUserPhone',     u.phone  || '—');
    set('viewUserDept',      u.dept   || '—');
    if (typeof openModal === 'function') openModal('viewUserModal');
  }

  /* ── Open Edit User Modal ────────────────── */
  function openUserEdit(u) {
    _activeUser = u;
    document.getElementById('editUserSubtitle').textContent = u.name + ' (' + u.id + ')';
    document.getElementById('editUserName').value   = u.name  || '';
    document.getElementById('editUserEmail').value  = u.email || '';
    document.getElementById('editUserPhone').value  = u.phone || '';
    document.getElementById('editUserDept').value   = u.dept  || '';
    document.getElementById('editUserRole').value   = u.role  || '';
    document.getElementById('editUserStatus').value = u.status || '';
    if (typeof openModal === 'function') openModal('editUserModal');
  }

  /* ── View → Edit cross-modal ─────────────── */
  document.getElementById('viewToEditUserBtn')?.addEventListener('click', function () {
    if (_activeUser) {
      if (typeof closeModal === 'function') closeModal('viewUserModal');
      setTimeout(() => openUserEdit(_activeUser), 80);
    }
  });

  /* ── Submit Edit User ────────────────────── */
  document.getElementById('submitEditUser')?.addEventListener('click', function () {
    if (!_activeUser) return;
    const nameEl  = document.getElementById('editUserName');
    const emailEl = document.getElementById('editUserEmail');
    [nameEl, emailEl].forEach(el => el?.classList.remove('input-error'));
    let valid = true;
    if (!nameEl?.value.trim())  { nameEl?.classList.add('input-error');  valid = false; }
    if (!emailEl?.value.trim()) { emailEl?.classList.add('input-error'); valid = false; }
    if (!valid) return;

    // Update record in USERS array
    const idx = USERS.findIndex(u => u.id === _activeUser.id);
    if (idx !== -1) {
      USERS[idx].name   = nameEl.value.trim();
      USERS[idx].email  = emailEl.value.trim().toLowerCase();
      USERS[idx].role   = document.getElementById('editUserRole')?.value  || USERS[idx].role;
      USERS[idx].status = document.getElementById('editUserStatus')?.value || USERS[idx].status;
      USERS[idx].phone  = document.getElementById('editUserPhone')?.value.trim()  || '';
      USERS[idx].dept   = document.getElementById('editUserDept')?.value.trim()   || '';
      _activeUser = USERS[idx];
    }
    renderTable(getFiltered(), currentPage);
    if (typeof closeModal === 'function') closeModal('editUserModal');
    showToast(`${nameEl.value.trim()} updated successfully`);
  });

  /* ── Confirm Action Modal ────────────────── */
  function openConfirm(title, msg, iconClass, btnClass, btnLabel, cb) {
    const iconEl  = document.getElementById('confirmUserModalIcon');
    const titleEl = document.getElementById('confirmUserModalTitle');
    const msgEl   = document.getElementById('confirmUserModalMsg');
    const btnEl   = document.getElementById('confirmUserModalBtn');
    if (iconEl)  iconEl.className  = 'modal-icon ' + iconClass;
    if (titleEl) titleEl.textContent = title;
    if (msgEl)   msgEl.textContent   = msg;
    if (btnEl) {
      btnEl.className = 'btn ' + btnClass;
      btnEl.innerHTML = `<i class="fa-solid fa-check"></i> ${btnLabel}`;
    }
    _confirmCb = cb;
    if (typeof openModal === 'function') openModal('confirmUserActionModal');
  }

  document.getElementById('confirmUserModalBtn')?.addEventListener('click', function () {
    if (_confirmCb) { _confirmCb(); _confirmCb = null; }
    if (typeof closeModal === 'function') closeModal('confirmUserActionModal');
  });

  /* ── Table action delegation ─────────────── */
  document.getElementById('userTableBody')?.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-action][data-uid]');
    if (!btn) return;
    const action = btn.dataset.action;
    const uid    = btn.dataset.uid;
    const u      = USERS.find(x => x.id === uid);
    if (!u) return;

    if (action === 'view') {
      openUserView(u);

    } else if (action === 'edit') {
      openUserEdit(u);

    } else if (action === 'deactivate') {
      openConfirm(
        'Deactivate User',
        `Are you sure you want to deactivate "${u.name}"? They will lose access to the platform immediately.`,
        'modal-icon--warn',
        'btn btn-danger',
        'Deactivate',
        () => {
          const idx = USERS.findIndex(x => x.id === uid);
          if (idx !== -1) USERS[idx].status = 'INACTIVE';
          renderTable(getFiltered(), currentPage);
          showToast(`${u.name} has been deactivated`);
        }
      );

    } else if (action === 'activate') {
      openConfirm(
        'Activate User',
        `Activate "${u.name}"? They will regain full access based on their assigned role.`,
        'modal-icon--ok',
        'btn btn-success',
        'Activate',
        () => {
          const idx = USERS.findIndex(x => x.id === uid);
          if (idx !== -1) USERS[idx].status = 'ACTIVE';
          renderTable(getFiltered(), currentPage);
          showToast(`${u.name} has been activated`);
        }
      );

    } else if (action === 'revoke') {
      openConfirm(
        'Revoke Invitation',
        `Revoke the pending invitation for "${u.name}" (${u.email})?`,
        'modal-icon--warn',
        'btn btn-danger',
        'Revoke',
        () => {
          const idx = USERS.findIndex(x => x.id === uid);
          if (idx !== -1) USERS.splice(idx, 1);
          renderTable(getFiltered(), currentPage);
          showToast(`Invitation for ${u.email} revoked`);
        }
      );

    } else if (action === 'resend') {
      showToast(`Invitation resent to ${u.email}`);
    }
  });

  /* ── Init ────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    renderTable(USERS, 1);
  });

})();

