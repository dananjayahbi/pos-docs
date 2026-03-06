/* ================================================================
   hr.js — HR & Payroll Module
   LankaCommerce Cloud ERP
   ================================================================ */
'use strict';

/* ─── State ─── */
let allEmployees      = [];
let filteredEmployees = [];
let editingId         = null;
let deletingId        = null;
let currentPage       = 1;
const PAGE_SIZE       = 8;

/* ─── Constants ─── */
const COLORS = [
  '#f97316','#8b5cf6','#0ea5e9','#22c55e',
  '#ef4444','#f59e0b','#06b6d4','#ec4899','#6366f1'
];

/* ─── Helpers ─── */
const fmtLKR = n => '₨ ' + Number(n).toLocaleString('en-LK');
const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '—';
const empColor = emp => COLORS[parseInt((emp.id||'EMP-000').replace('EMP-',''),10) % COLORS.length];
const empInitials = emp => ((emp.first_name||'?')[0] + (emp.last_name||'?')[0]).toUpperCase();

function statusBadge(status) {
  const map = {
    active:   '<span class="badge badge-active"><i class="fa-solid fa-circle" style="font-size:.45rem;"></i> Active</span>',
    inactive: '<span class="badge badge-inactive"><i class="fa-solid fa-circle" style="font-size:.45rem;"></i> Inactive</span>',
    on_leave: '<span class="badge badge-leave"><i class="fa-solid fa-circle" style="font-size:.45rem;"></i> On Leave</span>',
  };
  return map[status] || `<span class="badge">${status}</span>`;
}

function typeBadge(type) {
  if (type === 'contract') return '<span class="badge badge-contract">Contract</span>';
  if (type === 'part-time') return '<span class="badge" style="background:#f3e8ff;color:#7c3aed;">Part-time</span>';
  return '';
}

/* ─── Load Data ─── */
async function loadEmployees() {
  try {
    const resp = await fetch('../../data/employees.json?v=' + Date.now());
    const data = await resp.json();
    allEmployees = (data.employees || []).map(e => ({ ...e }));
    // Merge localStorage edits / additions
    const saved = JSON.parse(localStorage.getItem('lcc_employees') || '[]');
    saved.forEach(se => {
      const idx = allEmployees.findIndex(e => e.id === se.id);
      if (idx >= 0) allEmployees[idx] = se;
      else allEmployees.push(se);
    });
    applyFilters();
  } catch (err) {
    console.error('Failed to load employees:', err);
    showToast('Failed to load employee data.', 'error');
  }
}

function saveLocal() {
  localStorage.setItem('lcc_employees', JSON.stringify(allEmployees));
}

/* ─── Stats ─── */
function updateStats() {
  const total    = allEmployees.length;
  const active   = allEmployees.filter(e => e.status === 'active').length;
  const onLeave  = allEmployees.filter(e => e.status === 'on_leave').length;
  const payroll  = allEmployees
    .filter(e => e.status === 'active' || e.status === 'on_leave')
    .reduce((s, e) => s + (Number(e.basic_salary) || 0), 0);

  const el = id => document.getElementById(id);
  if (el('statTotalEmployees'))  el('statTotalEmployees').textContent  = total;
  if (el('statActiveEmployees')) el('statActiveEmployees').textContent = active;
  if (el('statOnLeave'))         el('statOnLeave').textContent         = onLeave;
  if (el('statMonthlyPayroll'))  el('statMonthlyPayroll').textContent  = fmtLKR(payroll);
}

/* ─── Filters ─── */
function applyFilters() {
  const q    = (document.getElementById('empSearch').value || '').toLowerCase().trim();
  const dept = document.getElementById('filterDept').value;
  const stat = document.getElementById('filterStatus').value;
  const type = document.getElementById('filterType').value;

  filteredEmployees = allEmployees.filter(e => {
    const fullName = `${e.first_name} ${e.last_name}`.toLowerCase();
    const matchQ    = !q || [fullName, e.id, e.email, e.phone]
                             .some(f => (f||'').toLowerCase().includes(q));
    const matchDept = !dept || e.department === dept;
    const matchStat = !stat || e.status === stat;
    const matchType = !type || e.employment_type === type;
    return matchQ && matchDept && matchStat && matchType;
  });

  currentPage = 1;
  renderTable();
  updateStats();
}

function clearFilters() {
  document.getElementById('empSearch').value     = '';
  document.getElementById('filterDept').value    = '';
  document.getElementById('filterStatus').value  = '';
  document.getElementById('filterType').value    = '';
  applyFilters();
}

/* ─── Render Table ─── */
function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredEmployees.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('empBody');

  if (!tbody) return;

  if (page.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2.5rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-users" style="font-size:2rem;display:block;margin-bottom:.6rem;opacity:.25;"></i>
      No employees found matching your filters.
    </td></tr>`;
  } else {
    tbody.innerHTML = page.map(emp => {
      const color    = empColor(emp);
      const initials = empInitials(emp);
      return `<tr>
        <td>
          <div class="emp-cell">
            <div class="emp-avatar" style="background:${color};">${initials}</div>
            <div>
              <div class="emp-name">${emp.first_name} ${emp.last_name}</div>
              <div class="emp-email">${emp.email}</div>
            </div>
          </div>
        </td>
        <td><span class="emp-id">${emp.id}</span></td>
        <td>${emp.department}</td>
        <td>${emp.designation}</td>
        <td style="white-space:nowrap;">${emp.phone}</td>
        <td style="white-space:nowrap;">${fmtDate(emp.hire_date)}</td>
        <td>${statusBadge(emp.status)}</td>
        <td>
          <div class="row-actions">
            <button class="row-btn" title="View" onclick="openEmpDrawer('${emp.id}')">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button class="row-btn" title="Edit" onclick="openEditModal('${emp.id}')">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="row-btn danger" title="Delete" onclick="openDeleteModal('${emp.id}')">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }
  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const total = filteredEmployees.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  const infoEl = document.getElementById('paginationInfo');
  const btnsEl = document.getElementById('paginationBtns');
  if (!infoEl || !btnsEl) return;

  infoEl.textContent = `Showing ${total ? start : 0}–${end} of ${total} employees`;

  let html = `<button ${currentPage <= 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})">
    <i class="fa-solid fa-chevron-left"></i></button>`;

  for (let p = 1; p <= pages; p++) {
    if (pages > 7 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== pages) {
      if (p === 2 || p === pages - 1) html += `<button disabled>…</button>`;
      continue;
    }
    html += `<button class="${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }

  html += `<button ${currentPage >= pages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})">
    <i class="fa-solid fa-chevron-right"></i></button>`;

  btnsEl.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
}

/* ================================================================
   EXPORT MODAL
   ================================================================ */
function openExportModal() {
  document.getElementById('exportModal').classList.add('open');
}
function closeExportModal() {
  document.getElementById('exportModal').classList.remove('open');
}
function doExport() {
  const fmt   = document.querySelector('input[name="exportFmt"]:checked').value;
  const scope = document.querySelector('input[name="exportScope"]:checked').value;
  const list  = scope === 'all' ? allEmployees : filteredEmployees;

  if (fmt === 'csv') {
    const headers = ['id','first_name','last_name','email','phone','nic','gender',
                     'dob','department','designation','employment_type','status',
                     'hire_date','basic_salary'];
    const rows = [headers.join(',')];
    list.forEach(e => rows.push(headers.map(h => `"${(e[h]??'').toString().replace(/"/g,'""')}"`).join(',')));
    downloadFile('employees_export.csv', rows.join('\n'), 'text/csv');
  } else {
    downloadFile('employees_export.json', JSON.stringify(list, null, 2), 'application/json');
  }
  closeExportModal();
  showToast(`Exported ${list.length} employees as ${fmt.toUpperCase()}.`, 'success');
}

function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ================================================================
   ADD / EDIT EMPLOYEE MODAL
   ================================================================ */
function openAddModal() {
  editingId = null;
  document.getElementById('empModalTitle').textContent = 'Add Employee';
  document.getElementById('empModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Add Employee';
  document.getElementById('employeeForm').reset();
  document.getElementById('employeeModal').classList.add('open');
}

function openEditModal(id) {
  const emp = allEmployees.find(e => e.id === id);
  if (!emp) return;
  editingId = id;
  document.getElementById('empModalTitle').textContent = 'Edit Employee';
  document.getElementById('empModalSaveBtn').innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';

  const f = fid => document.getElementById(fid);
  f('fFirstName').value       = emp.first_name       || '';
  f('fLastName').value        = emp.last_name        || '';
  f('fEmail').value           = emp.email            || '';
  f('fPhone').value           = emp.phone            || '';
  f('fNIC').value             = emp.nic              || '';
  f('fDOB').value             = emp.dob              || '';
  f('fGender').value          = emp.gender           || '';
  f('fDepartment').value      = emp.department       || '';
  f('fDesignation').value     = emp.designation      || '';
  f('fEmploymentType').value  = emp.employment_type  || 'full-time';
  f('fStatus').value          = emp.status           || 'active';
  f('fHireDate').value        = emp.hire_date        || '';
  f('fBasicSalary').value     = emp.basic_salary     || '';
  f('fNotes').value           = emp.notes            || '';

  document.getElementById('employeeModal').classList.add('open');
}

function closeEmpModal() {
  document.getElementById('employeeModal').classList.remove('open');
}

function saveEmployee(e) {
  e.preventDefault();
  const f = fid => document.getElementById(fid);

  const firstName = f('fFirstName').value.trim();
  const lastName  = f('fLastName').value.trim();
  const dept      = f('fDepartment').value;
  const desig     = f('fDesignation').value.trim();

  if (!firstName)  { showToast('First name is required.', 'warning'); return; }
  if (!lastName)   { showToast('Last name is required.',  'warning'); return; }
  if (!dept)       { showToast('Department is required.', 'warning'); return; }
  if (!desig)      { showToast('Designation is required.','warning'); return; }

  const form = {
    first_name:      firstName,
    last_name:       lastName,
    email:           f('fEmail').value.trim(),
    phone:           f('fPhone').value.trim(),
    nic:             f('fNIC').value.trim(),
    dob:             f('fDOB').value,
    gender:          f('fGender').value,
    department:      dept,
    designation:     desig,
    employment_type: f('fEmploymentType').value,
    status:          f('fStatus').value,
    hire_date:       f('fHireDate').value,
    basic_salary:    parseInt(f('fBasicSalary').value) || 0,
    notes:           f('fNotes').value.trim(),
  };

  if (editingId) {
    const idx = allEmployees.findIndex(e => e.id === editingId);
    if (idx >= 0) allEmployees[idx] = { ...allEmployees[idx], ...form };
    showToast('Employee updated successfully.', 'success');
  } else {
    const maxNum = Math.max(0, ...allEmployees.map(e => parseInt((e.id||'EMP-000').replace('EMP-',''),10)));
    const newId  = 'EMP-' + String(maxNum + 1).padStart(3, '0');
    allEmployees.unshift({ id: newId, ...form });
    showToast('Employee added successfully.', 'success');
  }

  saveLocal();
  closeEmpModal();
  applyFilters();
}

/* ================================================================
   EMPLOYEE DRAWER
   ================================================================ */
function openEmpDrawer(id) {
  const emp = allEmployees.find(e => e.id === id);
  if (!emp) return;

  const color    = empColor(emp);
  const initials = empInitials(emp);
  const fullName = `${emp.first_name} ${emp.last_name}`;

  /* ── Header ── */
  document.getElementById('empDrawerHeader').innerHTML = `
    <div class="vd-header">
      <div class="drawer-profile">
        <div class="emp-drawer-avatar" style="background:${color};">${initials}</div>
        <div style="flex:1;min-width:0;">
          <div class="drawer-company">${fullName}</div>
          <div class="drawer-emp-id">${emp.id}</div>
          <div style="margin-top:.35rem;">${statusBadge(emp.status)}</div>
        </div>
        <button class="drawer-close" onclick="closeEmpDrawer()" title="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="drawer-tabs">
        <button class="dtab active" onclick="switchEmpTab(this,'dpane-details')">Details</button>
        <button class="dtab" onclick="switchEmpTab(this,'dpane-employment')">Employment</button>
        <button class="dtab" onclick="switchEmpTab(this,'dpane-notes')">Notes</button>
      </div>
    </div>
  `;

  /* ── Body ── */
  const genderLabel = emp.gender === 'male' ? 'Male' : emp.gender === 'female' ? 'Female' : (emp.gender || '—');
  document.getElementById('empDrawerBody').innerHTML = `
    <div class="vd-body">

      <div id="dpane-details" class="dtab-pane active">
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-address-card"></i> Personal Information</div>
          <div class="drawer-field"><span class="df-label">Full Name</span><span class="df-val">${fullName}</span></div>
          <div class="drawer-field"><span class="df-label">Gender</span><span class="df-val">${genderLabel}</span></div>
          <div class="drawer-field"><span class="df-label">Date of Birth</span><span class="df-val">${fmtDate(emp.dob)}</span></div>
          <div class="drawer-field"><span class="df-label">NIC</span><span class="df-val" style="font-family:monospace;">${emp.nic || '—'}</span></div>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-envelope"></i> Contact</div>
          <div class="drawer-field"><span class="df-label">Email</span><span class="df-val"><a href="mailto:${emp.email}" style="color:var(--primary,#f97316);">${emp.email || '—'}</a></span></div>
          <div class="drawer-field"><span class="df-label">Phone</span><span class="df-val">${emp.phone || '—'}</span></div>
        </div>
      </div>

      <div id="dpane-employment" class="dtab-pane">
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-briefcase"></i> Employment Details</div>
          <div class="drawer-field"><span class="df-label">Department</span><span class="df-val">${emp.department || '—'}</span></div>
          <div class="drawer-field"><span class="df-label">Designation</span><span class="df-val">${emp.designation || '—'}</span></div>
          <div class="drawer-field"><span class="df-label">Employment Type</span><span class="df-val" style="text-transform:capitalize;">${(emp.employment_type||'—').replace('-',' ')}</span></div>
          <div class="drawer-field"><span class="df-label">Status</span><span class="df-val">${statusBadge(emp.status)}</span></div>
          <div class="drawer-field"><span class="df-label">Hire Date</span><span class="df-val">${fmtDate(emp.hire_date)}</span></div>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-sack-dollar"></i> Salary</div>
          <div class="drawer-kpi-row">
            <div class="drawer-kpi-box">
              <div class="drawer-kpi-val">${fmtLKR(emp.basic_salary || 0)}</div>
              <div class="drawer-kpi-label">Basic Salary / month</div>
            </div>
            <div class="drawer-kpi-box">
              <div class="drawer-kpi-val">${emp.employment_type === 'full-time' ? '160 hrs' : emp.employment_type === 'part-time' ? '80 hrs' : 'Contract'}</div>
              <div class="drawer-kpi-label">Monthly Hours</div>
            </div>
          </div>
        </div>
      </div>

      <div id="dpane-notes" class="dtab-pane">
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-note-sticky"></i> Notes</div>
          <p style="font-size:.85rem;color:var(--color-neutral-600);line-height:1.65;">
            ${emp.notes ? emp.notes : 'No additional notes for this employee.'}
          </p>
        </div>
      </div>

    </div>
  `;

  /* ── Footer ── */
  document.getElementById('empDrawerFooter').innerHTML = `
    <div class="vd-footer">
      <button class="btn btn-outline btn-sm" onclick="closeEmpDrawer()">
        <i class="fa-solid fa-xmark"></i> Close
      </button>
      <button class="btn btn-primary btn-sm" onclick="openEditModal('${emp.id}');closeEmpDrawer()">
        <i class="fa-solid fa-pen"></i> Edit
      </button>
      <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;"
        onclick="closeEmpDrawer();openDeleteModal('${emp.id}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('employeeDrawer').classList.add('open');
}

function closeEmpDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('employeeDrawer').classList.remove('open');
}

function switchEmpTab(btn, tabId) {
  // tabs inside drawer header
  document.querySelectorAll('#empDrawerHeader .dtab').forEach(b => b.classList.remove('active'));
  // panes inside drawer body
  document.querySelectorAll('#empDrawerBody .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const pane = document.getElementById(tabId);
  if (pane) pane.classList.add('active');
}

/* ================================================================
   DELETE MODAL
   ================================================================ */
function openDeleteModal(id) {
  const emp = allEmployees.find(e => e.id === id);
  if (!emp) return;
  deletingId = id;
  document.getElementById('deleteEmployeeName').textContent =
    `${emp.first_name} ${emp.last_name} (${emp.id})`;
  document.getElementById('deleteEmployeeModal').classList.add('open');
}

function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deleteEmployeeModal').classList.remove('open');
}

function confirmDeleteEmployee() {
  if (!deletingId) return;
  allEmployees = allEmployees.filter(e => e.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Employee deleted.', 'success');
  deletingId = null;
}

/* ================================================================
   TAB NAVIGATION
   ================================================================ */
function switchTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.remove('active');
    p.style.display = '';
  });
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tab-' + tabName);
  const btn   = document.querySelector('[data-tab="' + tabName + '"]');
  if (panel) panel.classList.add('active');
  if (btn)   btn.classList.add('active');
}

/* ─── Fallback toast ─── */
function showToast(msg, type) {
  if (typeof window.showToastNotification === 'function') {
    window.showToastNotification(msg, type);
    return;
  }
  const colors = { success:'#16a34a', error:'#dc2626', warning:'#ca8a04', info:'#2563eb' };
  const t = document.createElement('div');
  t.style.cssText = [
    'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999',
    'background:#fff;border-radius:8px;padding:.7rem 1.1rem',
    `border-left:4px solid ${colors[type]||colors.info}`,
    'box-shadow:0 4px 20px rgba(0,0,0,.14);font-size:.875rem',
    'max-width:340px;opacity:0;transition:opacity .25s',
  ].join(';');
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; });
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3200);
}

/* ─── Init ─── */
loadEmployees();

/* ─── Event Listeners ─── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddEmployee').addEventListener('click', openAddModal);
document.getElementById('empSearch').addEventListener('input', applyFilters);
document.getElementById('filterDept').addEventListener('change', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterType').addEventListener('change', applyFilters);
document.getElementById('employeeForm').addEventListener('submit', saveEmployee);

// Tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Backdrop close for modals
document.getElementById('employeeModal').addEventListener('click', function(e) {
  if (e.target === this) closeEmpModal();
});
document.getElementById('exportModal').addEventListener('click', function(e) {
  if (e.target === this) closeExportModal();
});
document.getElementById('deleteEmployeeModal').addEventListener('click', function(e) {
  if (e.target === this) closeDeleteModal();
});
// Drawer overlay
document.getElementById('drawerOverlay').addEventListener('click', closeEmpDrawer);
