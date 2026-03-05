/* ══════════════════════════════════════════════════
   Expenses — expenses.js
   ══════════════════════════════════════════════════ */
'use strict';

let allExpenses      = [];
let filteredExpenses = [];
let editingId        = null;
let deletingId       = null;
let currentPage      = 1;
const PAGE_SIZE      = 8;

const fmtLKR = n => '\u20a8 ' + Number(n).toLocaleString('en-LK');

const catIcons = {
  Rent:        'fa-building',
  Utilities:   'fa-bolt',
  Payroll:     'fa-users',
  Supplies:    'fa-boxes-stacked',
  Transport:   'fa-truck',
  Maintenance: 'fa-wrench',
  Marketing:   'fa-bullhorn',
  Other:       'fa-receipt'
};

const catColors = {
  Rent:        '#3b82f6',
  Utilities:   '#f59e0b',
  Payroll:     '#8b5cf6',
  Supplies:    '#14b8a6',
  Transport:   '#f97316',
  Maintenance: '#64748b',
  Marketing:   '#ec4899',
  Other:       '#6b7280'
};

function statusBadge(s) {
  return `<span class="badge ${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</span>`;
}

function methodBadge(m) {
  const map = {
    cash:          'badge-green',
    bank_transfer: 'badge-blue',
    cheque:        'badge-orange',
    card:          'badge-gray'
  };
  const labels = {
    cash:          'Cash',
    bank_transfer: 'Bank Transfer',
    cheque:        'Cheque',
    card:          'Card'
  };
  return `<span class="badge ${map[m] || 'badge-gray'}">${labels[m] || m}</span>`;
}

function catBadge(c) {
  return `<span class="badge badge-gray">${c}</span>`;
}

/* ─── Load ─── */
async function loadExpenses() {
  try {
    const resp = await fetch('../../data/expenses.json?v=' + Date.now());
    const data = await resp.json();
    allExpenses = (data.expenses || []).map(e => ({ ...e }));
    const saved = JSON.parse(localStorage.getItem('lcc_expenses') || '[]');
    saved.forEach(se => {
      const idx = allExpenses.findIndex(e => e.id === se.id);
      if (idx >= 0) allExpenses[idx] = se;
      else allExpenses.push(se);
    });
    applyFilters();
  } catch (err) {
    console.error('Failed to load expenses:', err);
    showToast('Failed to load expense data.', 'error');
  }
}

function saveLocal() {
  localStorage.setItem('lcc_expenses', JSON.stringify(allExpenses));
}

/* ─── Stats ─── */
function updateStats() {
  const totalAmt = allExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const now = new Date();
  const thisMonthAmt = allExpenses
    .filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date + 'T00:00');
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((s, e) => s + (e.amount || 0), 0);
  const pendingCount = allExpenses.filter(e => e.status === 'pending' || e.status === 'approved').length;
  const paidAmt = allExpenses
    .filter(e => e.status === 'paid')
    .reduce((s, e) => s + (e.amount || 0), 0);

  document.getElementById('statTotalExpenses').textContent = fmtLKR(totalAmt);
  document.getElementById('statThisMonth').textContent     = fmtLKR(thisMonthAmt);
  document.getElementById('statPending').textContent       = pendingCount;
  document.getElementById('statPaid').textContent          = fmtLKR(paidAmt);
}

/* ─── Filters ─── */
function applyFilters() {
  const q       = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  const stFilt  = document.getElementById('filterStatus').value;
  const catFilt = document.getElementById('filterCategory').value;
  const payFilt = document.getElementById('filterPayment').value;

  filteredExpenses = allExpenses.filter(e => {
    const mQ   = !q       || [e.id, e.vendor_name, e.description].some(f => (f || '').toLowerCase().includes(q));
    const mS   = !stFilt  || e.status === stFilt;
    const mC   = !catFilt || e.category === catFilt;
    const mP   = !payFilt || e.payment_method === payFilt;
    return mQ && mS && mC && mP;
  });
  currentPage = 1;
  renderTable();
  updateStats();
}

function clearFilters() {
  document.getElementById('searchInput').value   = '';
  document.getElementById('filterStatus').value  = '';
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterPayment').value  = '';
  applyFilters();
}

/* ─── Table ─── */
function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredExpenses.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('expBody');

  if (!page.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-receipt" style="font-size:2rem;display:block;margin-bottom:.5rem;opacity:.3;"></i>
      No expenses found.</td></tr>`;
  } else {
    tbody.innerHTML = page.map(e => {
      const dateStr = e.date
        ? new Date(e.date + 'T00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '\u2014';
      return `
        <tr>
          <td>
            <div style="font-weight:500;font-size:.84rem;">${dateStr}</div>
            <div style="font-size:.72rem;color:var(--color-neutral-400);font-family:monospace;">${e.id}</div>
          </td>
          <td>${catBadge(e.category)}</td>
          <td>
            <div style="font-weight:500;font-size:.84rem;">${e.vendor_name || '\u2014'}</div>
            <div style="font-size:.72rem;color:var(--color-neutral-400);">${e.reference || ''}</div>
          </td>
          <td style="max-width:200px;">
            <div style="font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;" title="${(e.description || '').replace(/"/g, '&quot;')}">${e.description || '\u2014'}</div>
          </td>
          <td style="font-weight:600;white-space:nowrap;">${fmtLKR(e.amount || 0)}</td>
          <td>${methodBadge(e.payment_method)}</td>
          <td>${statusBadge(e.status)}</td>
          <td>
            <div class="actions">
              <button class="btn-icon" title="View" onclick="openExpenseDrawer('${e.id}')"><i class="fa-solid fa-eye"></i></button>
              <button class="btn-icon" title="Edit" onclick="openEditModal('${e.id}')"><i class="fa-solid fa-pen"></i></button>
              <button class="btn-icon btn-icon-danger" title="Delete" onclick="openDeleteModal('${e.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }
  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const total = filteredExpenses.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent =
    `Showing ${total ? start : 0}\u2013${end} of ${total} expenses`;

  const btns = document.getElementById('paginationBtns');
  let html = `<button class="btn-icon" ${currentPage <= 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let p = 1; p <= pages; p++) {
    if (pages > 7 && p !== 1 && p !== pages && Math.abs(p - currentPage) > 2) {
      if (p === 2 || p === pages - 1) html += `<button class="btn-icon" disabled>\u2026</button>`;
      continue;
    }
    html += `<button class="${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button class="btn-icon" ${currentPage >= pages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  btns.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(filteredExpenses.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
}

/* ── EXPORT ── */
function openExportModal()  { document.getElementById('exportModal').classList.add('open'); }
function closeExportModal() { document.getElementById('exportModal').classList.remove('open'); }

function doExport() {
  const fmt   = document.querySelector('input[name="exportFmt"]:checked').value;
  const scope = document.querySelector('input[name="exportScope"]:checked').value;
  const list  = scope === 'all' ? allExpenses : filteredExpenses;
  if (fmt === 'csv') {
    const keys = ['id', 'date', 'category', 'vendor_name', 'reference', 'description', 'amount', 'payment_method', 'status'];
    const rows = [keys.join(',')];
    list.forEach(e => rows.push(keys.map(k => `"${(e[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')));
    downloadFile('expenses.csv', rows.join('\n'), 'text/csv');
  } else {
    downloadFile('expenses.json', JSON.stringify(list, null, 2), 'application/json');
  }
  closeExportModal();
  showToast(`Exported ${list.length} expenses as ${fmt.toUpperCase()}.`, 'success');
}

function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ── ADD / EDIT ── */
function openAddModal() {
  editingId = null;
  document.getElementById('expenseModalTitle').textContent = 'New Expense';
  document.getElementById('expenseModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Add Expense';
  document.getElementById('expenseForm').reset();
  document.getElementById('fDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('expenseModal').classList.add('open');
}

function openEditModal(id) {
  const e = allExpenses.find(e => e.id === id);
  if (!e) return;
  editingId = id;
  document.getElementById('expenseModalTitle').textContent = `Edit \u2014 ${id}`;
  document.getElementById('expenseModalSaveBtn').innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
  const f = fid => document.getElementById(fid);
  f('fDate').value          = e.date || '';
  f('fVendorName').value    = e.vendor_name || '';
  f('fCategory').value      = e.category || 'Other';
  f('fReference').value     = e.reference || '';
  f('fDescription').value   = e.description || '';
  f('fAmount').value        = e.amount || 0;
  f('fPaymentMethod').value = e.payment_method || 'cash';
  f('fStatus').value        = e.status || 'pending';
  f('fNotes').value         = e.notes || '';
  document.getElementById('expenseModal').classList.add('open');
}

function closeExpenseModal() {
  document.getElementById('expenseModal').classList.remove('open');
}

function saveExpense(ev) {
  ev.preventDefault();
  const f = fid => document.getElementById(fid);
  const vendor = f('fVendorName').value.trim();
  const amount = parseFloat(f('fAmount').value);
  const date   = f('fDate').value;

  if (!vendor) { showToast('Vendor / Payee name is required.', 'warning'); return; }
  if (!amount || amount <= 0) { showToast('A valid amount is required.', 'warning'); return; }
  if (!date)   { showToast('Date is required.', 'warning'); return; }

  const form = {
    date:           date,
    vendor_name:    vendor,
    category:       f('fCategory').value,
    reference:      f('fReference').value.trim(),
    description:    f('fDescription').value.trim(),
    amount:         amount,
    payment_method: f('fPaymentMethod').value,
    status:         f('fStatus').value,
    notes:          f('fNotes').value.trim(),
  };

  if (editingId) {
    const idx = allExpenses.findIndex(e => e.id === editingId);
    if (idx >= 0) allExpenses[idx] = { ...allExpenses[idx], ...form };
    showToast('Expense updated.', 'success');
  } else {
    const nums = allExpenses.map(e => parseInt((e.id || '').split('-')[1]) || 0);
    const next = (Math.max(0, ...nums) + 1).toString().padStart(4, '0');
    allExpenses.unshift({ id: `EXP-${next}`, created_by: 'Admin', ...form });
    showToast('Expense added.', 'success');
  }
  saveLocal();
  closeExpenseModal();
  applyFilters();
}

/* ── VIEW DRAWER ── */
function openExpenseDrawer(id) {
  const e = allExpenses.find(e => e.id === id);
  if (!e) return;

  const icon  = catIcons[e.category] || 'fa-receipt';
  const color = catColors[e.category] || '#6b7280';
  const dateStr = e.date
    ? new Date(e.date + 'T00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '\u2014';
  const shortDesc = (e.description || e.id).length > 32
    ? (e.description || e.id).slice(0, 32) + '\u2026'
    : (e.description || e.id);

  document.getElementById('expDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar" style="background:${color}22; color:${color};">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div style="min-width:0;flex:1;">
        <div class="drawer-title">${shortDesc}</div>
        <div class="drawer-exp-id">${e.id}</div>
        ${statusBadge(e.status)}
      </div>
      <button class="drawer-close" onclick="closeExpenseDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchExpTab(this,'dtab-details')">Details</button>
      <button class="dtab" onclick="switchExpTab(this,'dtab-amount')">Amount</button>
      <button class="dtab" onclick="switchExpTab(this,'dtab-notes')">Notes</button>
    </div>
  `;

  document.getElementById('expDrawerBody').innerHTML = `
    <div id="dtab-details" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-tag"></i> Expense Info</div>
        <div class="drawer-field"><span class="df-label">Expense ID</span><span class="df-val" style="font-family:monospace;">${e.id}</span></div>
        <div class="drawer-field"><span class="df-label">Date</span><span class="df-val">${dateStr}</span></div>
        <div class="drawer-field"><span class="df-label">Category</span><span class="df-val">${catBadge(e.category)}</span></div>
        <div class="drawer-field"><span class="df-label">Reference</span><span class="df-val" style="font-family:monospace;">${e.reference || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">Description</span><span class="df-val">${e.description || '\u2014'}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-building"></i> Vendor</div>
        <div class="drawer-field"><span class="df-label">Vendor / Payee</span><span class="df-val">${e.vendor_name || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">Created By</span><span class="df-val">${e.created_by || '\u2014'}</span></div>
      </div>
    </div>

    <div id="dtab-amount" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-money-bill-wave"></i> Financial Details</div>
        <div class="drawer-kpi-row">
          <div class="drawer-kpi-box">
            <div class="drawer-kpi-val">${fmtLKR(e.amount || 0)}</div>
            <div class="drawer-kpi-label">Amount</div>
          </div>
          <div class="drawer-kpi-box">
            <div class="drawer-kpi-val">${statusBadge(e.status)}</div>
            <div class="drawer-kpi-label">Status</div>
          </div>
        </div>
        <div class="drawer-field"><span class="df-label">Payment Method</span><span class="df-val">${methodBadge(e.payment_method)}</span></div>
        <div class="drawer-field"><span class="df-label">Reference</span><span class="df-val" style="font-family:monospace;">${e.reference || '\u2014'}</span></div>
      </div>
    </div>

    <div id="dtab-notes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-note-sticky"></i> Notes</div>
        <p style="font-size:.85rem;color:var(--color-neutral-600);line-height:1.6;">${e.notes || 'No notes for this expense.'}</p>
      </div>
    </div>
  `;

  document.getElementById('expDrawerFooter').innerHTML = `
    <button class="btn btn-outline btn-sm" onclick="closeExpenseDrawer()"><i class="fa-solid fa-xmark"></i> Close</button>
    <button class="btn btn-primary btn-sm" onclick="openEditModal('${e.id}'); closeExpenseDrawer();"><i class="fa-solid fa-pen"></i> Edit</button>
    <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;" onclick="closeExpenseDrawer(); openDeleteModal('${e.id}');"><i class="fa-solid fa-trash"></i></button>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('expenseDrawer').classList.add('open');
}

function closeExpenseDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('expenseDrawer').classList.remove('open');
}

function switchExpTab(btn, tabId) {
  document.querySelectorAll('#expDrawerHeader .dtab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#expDrawerBody .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

/* ── DELETE ── */
function openDeleteModal(id) {
  const e = allExpenses.find(e => e.id === id);
  if (!e) return;
  deletingId = id;
  document.getElementById('deleteExpenseRef').textContent = `${e.vendor_name || id} \u2014 ${id}`;
  document.getElementById('deleteExpenseModal').classList.add('open');
}

function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deleteExpenseModal').classList.remove('open');
}

function confirmDeleteExpense() {
  if (!deletingId) return;
  allExpenses = allExpenses.filter(e => e.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Expense deleted.', 'success');
  deletingId = null;
}

/* ── Toast fallback ── */
function showToast(msg, type = 'success') {
  if (window.LCC && window.LCC.showToast) { window.LCC.showToast(msg, type); return; }
  const el = document.createElement('div');
  const bg = type === 'success' ? '#16a34a' : type === 'warning' ? '#d97706' : type === 'info' ? '#2563eb' : '#dc2626';
  el.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;background:${bg};color:#fff;padding:.75rem 1.25rem;border-radius:8px;font-size:.875rem;box-shadow:0 4px 16px rgba(0,0,0,.2);`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ── Event Listeners ── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddExpense').addEventListener('click', openAddModal);
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterCategory').addEventListener('change', applyFilters);
document.getElementById('filterPayment').addEventListener('change', applyFilters);
document.getElementById('expenseForm').addEventListener('submit', saveExpense);
document.getElementById('expenseModal').addEventListener('click', e => { if (e.target === document.getElementById('expenseModal')) closeExpenseModal(); });
document.getElementById('exportModal').addEventListener('click', e => { if (e.target === document.getElementById('exportModal')) closeExportModal(); });
document.getElementById('deleteExpenseModal').addEventListener('click', e => { if (e.target === document.getElementById('deleteExpenseModal')) closeDeleteModal(); });

/* ── Init ── */
loadExpenses();
