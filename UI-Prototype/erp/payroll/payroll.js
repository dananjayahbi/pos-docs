'use strict';

let allPayroll = [];
let filteredPayroll = [];
let editingId = null;
let deletingId = null;
let currentPage = 1;
const PAGE_SIZE = 8;

const fmtLKR = n => '\u20a8 ' + Number(n).toLocaleString('en-LK');

// ── Load ────────────────────────────────────────────────────────────────────
async function loadPayroll() {
  try {
    const res = await fetch('../../data/payroll.json?v=' + Date.now());
    const data = await res.json();
    allPayroll = data.payroll || [];
    const local = JSON.parse(localStorage.getItem('lcc_payroll') || '[]');
    local.forEach(loc => {
      const idx = allPayroll.findIndex(p => p.id === loc.id);
      if (idx > -1) allPayroll[idx] = loc; else allPayroll.push(loc);
    });
  } catch (e) {
    allPayroll = JSON.parse(localStorage.getItem('lcc_payroll') || '[]');
    console.warn('Payroll fetch failed, using localStorage', e);
  }
  applyFilters();
}

function saveLocal() {
  localStorage.setItem('lcc_payroll', JSON.stringify(allPayroll));
}

// ── Stats ───────────────────────────────────────────────────────────────────
function updateStats() {
  const el = id => document.getElementById(id);

  const totalNet = allPayroll.reduce((s, p) => s + (p.net_pay || 0), 0);
  el('statTotalPayroll').textContent = fmtLKR(totalNet);

  el('statPaid').textContent = allPayroll.filter(p => p.status === 'paid').length;
  el('statPending').textContent = allPayroll.filter(p => p.status === 'pending' || p.status === 'draft').length;

  // Last period net (find the most recent period alphabetically)
  const periods = [...new Set(allPayroll.map(p => p.period))].sort();
  const lastPeriod = periods[periods.length - 1];
  const lastNet = allPayroll.filter(p => p.period === lastPeriod).reduce((s, p) => s + (p.net_pay || 0), 0);
  el('statNetThisMonth').textContent = fmtLKR(lastNet);
}

// ── Filters ─────────────────────────────────────────────────────────────────
function applyFilters() {
  const q = (document.getElementById('paySearch')?.value || '').toLowerCase();
  const st = document.getElementById('filterStatus')?.value || '';
  const period = document.getElementById('filterPeriod')?.value || '';
  const dept = document.getElementById('filterDept')?.value || '';

  filteredPayroll = allPayroll.filter(p => {
    const matchQ = !q || p.id.toLowerCase().includes(q) || p.employee_name.toLowerCase().includes(q) || p.employee_id.toLowerCase().includes(q);
    const matchSt = !st || p.status === st;
    const matchPeriod = !period || p.period === period;
    const matchDept = !dept || p.department === dept;
    return matchQ && matchSt && matchPeriod && matchDept;
  });

  currentPage = 1;
  updateStats();
  renderTable();
  renderPagination();
}

function clearFilters() {
  ['paySearch', 'filterStatus', 'filterPeriod', 'filterDept'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  applyFilters();
}

// ── Table ───────────────────────────────────────────────────────────────────
function badgeHtml(status) {
  const cls = { paid: 'badge-paid', pending: 'badge-pending', draft: 'badge-draft' };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="badge ${cls[status] || ''}">${label}</span>`;
}

function renderTable() {
  const tbody = document.getElementById('payBody');
  if (!tbody) return;
  const start = (currentPage - 1) * PAGE_SIZE;
  const page = filteredPayroll.slice(start, start + PAGE_SIZE);

  if (!page.length) {
    tbody.innerHTML = '<tr><td colspan="9" style="text-align:center;padding:2rem;color:#9ca3af;">No payslips found.</td></tr>';
    return;
  }

  tbody.innerHTML = page.map(p => `
    <tr>
      <td>
        <div style="font-weight:600;color:#111827;">${p.employee_name}</div>
        <div style="font-size:.75rem;color:#6b7280;">${p.employee_id} · ${p.id}</div>
      </td>
      <td>${p.department}</td>
      <td>${p.period}</td>
      <td style="font-size:.85rem;">${fmtLKR(p.basic_salary)}</td>
      <td style="font-size:.85rem;">${fmtLKR(p.gross_pay)}</td>
      <td style="font-size:.85rem;color:#6b7280;">${fmtLKR(p.epf_employee)}</td>
      <td style="font-size:.875rem;font-weight:600;color:#15803d;">${fmtLKR(p.net_pay)}</td>
      <td>${badgeHtml(p.status)}</td>
      <td>
        <div class="actions">
          <button class="btn-icon" title="View" onclick="openPayDrawer('${p.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="btn-icon" title="Edit" onclick="openEditModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-icon-danger" title="Delete" onclick="openDeleteModal('${p.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Pagination ──────────────────────────────────────────────────────────────
function renderPagination() {
  const infoEl = document.getElementById('paginationInfo');
  const btnsEl = document.getElementById('paginationBtns');
  const total = filteredPayroll.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end = Math.min(currentPage * PAGE_SIZE, total);

  if (infoEl) infoEl.textContent = `Showing ${start}–${end} of ${total} payslips`;
  if (!btnsEl) return;

  let html = `<button class="btn-icon" ${currentPage <= 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 7 && p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 1) {
      if (p === 3 || p === totalPages - 2) html += '<button class="btn-icon" disabled>…</button>';
      continue;
    }
    html += `<button class="${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button class="btn-icon" ${currentPage >= totalPages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  btnsEl.innerHTML = html;
}

function goPage(p) {
  const totalPages = Math.ceil(filteredPayroll.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTable();
  renderPagination();
}

// ── Export ──────────────────────────────────────────────────────────────────
function openExportModal() {
  document.getElementById('exportModal')?.classList.add('open');
}
function closeExportModal() {
  document.getElementById('exportModal')?.classList.remove('open');
}
function doExport() {
  const fmt = document.querySelector('input[name="exportFmt"]:checked')?.value || 'csv';
  const data = filteredPayroll.length ? filteredPayroll : allPayroll;
  let content, mime, ext;
  if (fmt === 'json') {
    content = JSON.stringify({ payroll: data }, null, 2);
    mime = 'application/json'; ext = 'json';
  } else {
    const header = 'ID,Employee,Employee ID,Department,Period,Basic Salary,Allowances,Gross Pay,EPF(8%),ETF(3%),Other Deductions,Net Pay,Status,Payment Date';
    const rows = data.map(p =>
      [p.id, `"${p.employee_name}"`, p.employee_id, p.department, `"${p.period}"`,
       p.basic_salary, p.allowances, p.gross_pay, p.epf_employee, p.etf,
       p.other_deductions, p.net_pay, p.status, p.payment_date ?? ''].join(',')
    );
    content = [header, ...rows].join('\n');
    mime = 'text/csv'; ext = 'csv';
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: `payroll_export.${ext}` });
  a.click(); URL.revokeObjectURL(url);
  closeExportModal();
}

// ── Auto-compute ─────────────────────────────────────────────────────────────
function recomputePayModal() {
  const basic = parseFloat(document.getElementById('fBasicSalary')?.value) || 0;
  const allow = parseFloat(document.getElementById('fAllowances')?.value) || 0;
  const deduct = parseFloat(document.getElementById('fOtherDeductions')?.value) || 0;
  const gross = basic + allow;
  const epf = Math.round(gross * 0.08);
  const etf = Math.round(gross * 0.03);
  const net = gross - epf - deduct;
  const el = document.getElementById('payComputed');
  if (!el) return;
  el.innerHTML = `
    <div class="pc-row"><span class="pc-label">Gross Pay</span><span>${fmtLKR(gross)}</span></div>
    <div class="pc-row"><span class="pc-label">EPF (8%)</span><span style="color:#ef4444;">- ${fmtLKR(epf)}</span></div>
    <div class="pc-row"><span class="pc-label">ETF (3% employer)</span><span style="color:#6b7280;">${fmtLKR(etf)}</span></div>
    <div class="pc-row"><span class="pc-label">Other Deductions</span><span style="color:#ef4444;">- ${fmtLKR(deduct)}</span></div>
    <div class="pc-row"><span class="pc-label">Net Pay</span><span style="color:#15803d;">${fmtLKR(net)}</span></div>
  `;
}

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
function openAddModal() {
  editingId = null;
  document.getElementById('payModalTitle').textContent = 'Add Payslip';
  document.getElementById('payModalSaveBtn').textContent = 'Save Payslip';
  document.getElementById('payForm').reset();
  recomputePayModal();
  document.getElementById('payModal').classList.add('open');
}

function openEditModal(id) {
  const rec = allPayroll.find(p => p.id === id);
  if (!rec) return;
  editingId = id;
  document.getElementById('payModalTitle').textContent = 'Edit Payslip';
  document.getElementById('payModalSaveBtn').textContent = 'Update Payslip';
  document.getElementById('fEmpName').value = rec.employee_name;
  document.getElementById('fEmpId').value = rec.employee_id;
  document.getElementById('fDepartment').value = rec.department;
  document.getElementById('fPeriod').value = rec.period;
  document.getElementById('fBasicSalary').value = rec.basic_salary;
  document.getElementById('fAllowances').value = rec.allowances;
  document.getElementById('fOtherDeductions').value = rec.other_deductions;
  document.getElementById('fPaymentDate').value = rec.payment_date ?? '';
  document.getElementById('fStatus').value = rec.status;
  document.getElementById('fNotes').value = rec.notes ?? '';
  recomputePayModal();
  document.getElementById('payModal').classList.add('open');
}

function closePayModal() {
  document.getElementById('payModal')?.classList.remove('open');
  editingId = null;
}

function savePayslip(e) {
  e.preventDefault();
  const empName = document.getElementById('fEmpName').value.trim();
  const empId = document.getElementById('fEmpId').value.trim();
  const dept = document.getElementById('fDepartment').value;
  const period = document.getElementById('fPeriod').value.trim();
  const basic = parseFloat(document.getElementById('fBasicSalary').value) || 0;
  const allow = parseFloat(document.getElementById('fAllowances').value) || 0;
  const deduct = parseFloat(document.getElementById('fOtherDeductions').value) || 0;
  const payDate = document.getElementById('fPaymentDate').value || null;
  const status = document.getElementById('fStatus').value;
  const notes = document.getElementById('fNotes').value.trim();

  if (!empName || !empId || !period || !status) {
    showToast('Please fill all required fields.', 'error'); return;
  }

  const gross = basic + allow;
  const epf = Math.round(gross * 0.08);
  const etf = Math.round(gross * 0.03);
  const net = gross - epf - deduct;

  const payload = {
    employee_name: empName, employee_id: empId, department: dept,
    period, basic_salary: basic, allowances: allow, gross_pay: gross,
    epf_employee: epf, etf, other_deductions: deduct, net_pay: net,
    status, payment_date: payDate, notes,
  };

  if (editingId) {
    const idx = allPayroll.findIndex(p => p.id === editingId);
    if (idx > -1) allPayroll[idx] = { ...allPayroll[idx], ...payload };
    showToast('Payslip updated.', 'success');
  } else {
    const newId = 'PAY-' + String(allPayroll.length + 1).padStart(4, '0');
    allPayroll.push({ id: newId, ...payload });
    showToast('Payslip added.', 'success');
  }
  saveLocal();
  closePayModal();
  applyFilters();
}

// ── Drawer ───────────────────────────────────────────────────────────────────
function openPayDrawer(id) {
  const rec = allPayroll.find(p => p.id === id);
  if (!rec) return;

  const initials = rec.employee_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const badgeCls = { paid: 'badge-paid', pending: 'badge-pending', draft: 'badge-draft' };
  const label = rec.status.charAt(0).toUpperCase() + rec.status.slice(1);

  document.getElementById('payDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar">${initials}</div>
      <div>
        <div class="drawer-title">${rec.employee_name}</div>
        <div class="drawer-rec-id">${rec.employee_id} &middot; ${rec.id}</div>
      </div>
      <span class="badge ${badgeCls[rec.status] || ''}" style="margin-left:auto;">${label}</span>
      <button class="drawer-close" onclick="closePayDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchPayTab(this,'pPayDetails')">Details</button>
      <button class="dtab" onclick="switchPayTab(this,'pPayBreakdown')">Breakdown</button>
      <button class="dtab" onclick="switchPayTab(this,'pPayNotes')">Notes</button>
    </div>
  `;

  document.getElementById('payDrawerBody').innerHTML = `
    <div id="pPayDetails" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title">Payslip Info</div>
        <div class="drawer-field"><span class="df-label">Payslip ID</span><span class="df-val">${rec.id}</span></div>
        <div class="drawer-field"><span class="df-label">Employee</span><span class="df-val">${rec.employee_name}</span></div>
        <div class="drawer-field"><span class="df-label">Employee ID</span><span class="df-val">${rec.employee_id}</span></div>
        <div class="drawer-field"><span class="df-label">Department</span><span class="df-val">${rec.department}</span></div>
        <div class="drawer-field"><span class="df-label">Period</span><span class="df-val">${rec.period}</span></div>
        <div class="drawer-field"><span class="df-label">Status</span><span class="df-val"><span class="badge ${badgeCls[rec.status] || ''}">${label}</span></span></div>
        <div class="drawer-field"><span class="df-label">Payment Date</span><span class="df-val">${rec.payment_date ?? '—'}</span></div>
      </div>
    </div>
    <div id="pPayBreakdown" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title">Salary Breakdown</div>
        <table class="breakdown-table">
          <tr><td class="bt-label">Basic Salary</td><td class="bt-val">${fmtLKR(rec.basic_salary)}</td></tr>
          <tr><td class="bt-label">Allowances</td><td class="bt-val bt-pos">+ ${fmtLKR(rec.allowances)}</td></tr>
          <tr><td class="bt-label" style="font-weight:600;">Gross Pay</td><td class="bt-val" style="font-weight:600;">${fmtLKR(rec.gross_pay)}</td></tr>
          <tr><td class="bt-label">EPF (Employee 8%)</td><td class="bt-val bt-neg">- ${fmtLKR(rec.epf_employee)}</td></tr>
          <tr><td class="bt-label">ETF (Employer 3%)</td><td class="bt-val" style="color:#6b7280;">${fmtLKR(rec.etf)}</td></tr>
          <tr><td class="bt-label">Other Deductions</td><td class="bt-val bt-neg">- ${fmtLKR(rec.other_deductions)}</td></tr>
          <tr><td class="bt-label bt-pos">Net Pay</td><td class="bt-val bt-pos">${fmtLKR(rec.net_pay)}</td></tr>
        </table>
      </div>
    </div>
    <div id="pPayNotes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title">Notes</div>
        <p style="font-size:.875rem;color:#374151;">${rec.notes || '<span style="color:#9ca3af;">No notes.</span>'}</p>
      </div>
    </div>
  `;

  document.getElementById('payDrawerFooter').innerHTML = `
    <button class="btn btn-ghost btn-sm" onclick="closePayDrawer()"><i class="fa-solid fa-xmark"></i> Close</button>
    <button class="btn btn-primary btn-sm" onclick="openEditModal('${rec.id}'); closePayDrawer()"><i class="fa-solid fa-pen"></i> Edit</button>
    <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;" onclick="closePayDrawer(); openDeleteModal('${rec.id}')"><i class="fa-solid fa-trash"></i></button>
  `;

  document.getElementById('drawerOverlay')?.classList.add('open');
  document.getElementById('payDrawer')?.classList.add('open');
}

function closePayDrawer() {
  document.getElementById('drawerOverlay')?.classList.remove('open');
  document.getElementById('payDrawer')?.classList.remove('open');
}

function switchPayTab(btn, tabId) {
  const drawer = btn.closest('.vd-header, .pay-drawer');
  drawer?.querySelectorAll('.dtab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.dtab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
}

// ── Delete ───────────────────────────────────────────────────────────────────
function openDeleteModal(id) {
  const rec = allPayroll.find(p => p.id === id);
  if (!rec) return;
  deletingId = id;
  document.getElementById('deletePayRef').textContent = `${rec.id} — ${rec.employee_name} (${rec.period})`;
  document.getElementById('deletePayModal').classList.add('open');
}
function closeDeleteModal() {
  document.getElementById('deletePayModal')?.classList.remove('open');
  deletingId = null;
}
function confirmDeletePayslip() {
  if (!deletingId) return;
  allPayroll = allPayroll.filter(p => p.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Payslip deleted.', 'success');
}

// ── Toast fallback ────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  if (typeof window.showToast === 'function' && window.showToast !== showToast) {
    window.showToast(msg, type); return;
  }
  const c = document.getElementById('toastContainer');
  if (!c) { alert(msg); return; }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.style.cssText = 'padding:.75rem 1rem;border-radius:8px;margin-bottom:.5rem;background:#111827;color:#fff;font-size:.875rem;box-shadow:0 4px 12px rgba(0,0,0,.2);';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadPayroll();

  document.getElementById('btnExport')?.addEventListener('click', openExportModal);
  document.getElementById('btnRunPayroll')?.addEventListener('click', openAddModal);
  document.getElementById('paySearch')?.addEventListener('input', applyFilters);
  document.getElementById('filterStatus')?.addEventListener('change', applyFilters);
  document.getElementById('filterPeriod')?.addEventListener('change', applyFilters);
  document.getElementById('filterDept')?.addEventListener('change', applyFilters);
  document.getElementById('payForm')?.addEventListener('submit', savePayslip);

  // Auto-compute listeners
  ['fBasicSalary', 'fAllowances', 'fOtherDeductions'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', recomputePayModal);
  });

  // Backdrop close
  document.getElementById('exportModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('exportModal')) closeExportModal();
  });
  document.getElementById('payModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('payModal')) closePayModal();
  });
  document.getElementById('deletePayModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('deletePayModal')) closeDeleteModal();
  });
  document.getElementById('drawerOverlay')?.addEventListener('click', closePayDrawer);
});
