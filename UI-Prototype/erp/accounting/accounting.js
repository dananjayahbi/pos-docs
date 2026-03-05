/* ══════════════════════════════════════════════════════════════
   Accounting — accounting.js
   ══════════════════════════════════════════════════════════════ */
'use strict';

let allTxns      = [];
let filteredTxns = [];
let editingId    = null;
let deletingId   = null;
let currentPage  = 1;
const PAGE_SIZE  = 8;

/* ─── Formatters ─── */
const fmtLKR  = n  => '₨ ' + Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = ds => { const d = new Date(ds + 'T00:00:00'); return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }); };

/* ─── Load ─── */
async function loadTransactions() {
  try {
    const resp = await fetch('../../data/transactions.json?v=' + Date.now());
    const data = await resp.json();
    allTxns = (data.transactions || []).map(t => ({ ...t }));
    const saved = JSON.parse(localStorage.getItem('lcc_transactions') || '[]');
    saved.forEach(st => {
      const idx = allTxns.findIndex(t => t.id === st.id);
      if (idx >= 0) allTxns[idx] = st; else allTxns.push(st);
    });
    updateStats();
    applyFilters();
  } catch (e) {
    console.error('Failed to load transactions:', e);
    showToast('Failed to load transaction data.', 'error');
  }
}

function saveLocal() {
  localStorage.setItem('lcc_transactions', JSON.stringify(allTxns));
}

/* ─── Stats ─── */
function updateStats() {
  const revenue      = allTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses     = allTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit    = revenue - expenses;
  const receivables  = allTxns.filter(t => t.type === 'income' && t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  document.getElementById('statRevenue').textContent    = fmtLKR(revenue);
  document.getElementById('statExpenses').textContent   = fmtLKR(expenses);
  document.getElementById('statNetProfit').textContent  = fmtLKR(netProfit);
  document.getElementById('statReceivables').textContent = fmtLKR(receivables);
}

/* ─── Filters ─── */
function applyFilters() {
  const q      = (document.getElementById('txnSearch').value || '').toLowerCase().trim();
  const type   = document.getElementById('txnTypeFilter').value;
  const status = document.getElementById('txnStatusFilter').value;
  const from   = document.getElementById('txnDateFrom').value;
  const to     = document.getElementById('txnDateTo').value;

  filteredTxns = allTxns.filter(t => {
    if (q && !['id','description','reference'].some(k => (t[k]||'').toLowerCase().includes(q))) return false;
    if (type   && t.type   !== type)   return false;
    if (status && t.status !== status) return false;
    if (from   && t.date < from)       return false;
    if (to     && t.date > to)         return false;
    return true;
  });

  currentPage = 1;
  renderTransactions();
}

function clearFilters() {
  document.getElementById('txnSearch').value      = '';
  document.getElementById('txnTypeFilter').value  = '';
  document.getElementById('txnStatusFilter').value = '';
  document.getElementById('txnDateFrom').value    = '';
  document.getElementById('txnDateTo').value      = '';
  applyFilters();
}

/* ─── Render Table ─── */
function renderTransactions() {
  const tbody = document.getElementById('txnBody');
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = filteredTxns.slice(start, start + PAGE_SIZE);

  if (!slice.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2.5rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-inbox" style="font-size:1.5rem;display:block;margin-bottom:.5rem;"></i>No transactions found.</td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = slice.map(t => {
    const isIncome = t.type === 'income';
    const typeLabel  = isIncome ? 'Income' : 'Expense';
    const amtColor   = isIncome ? '#16a34a' : '#dc2626';
    const amtPrefix  = isIncome ? '+' : '−';
    const statusBadge = `<span class="badge badge-${t.status}">${t.status.charAt(0).toUpperCase()+t.status.slice(1)}</span>`;
    return `<tr>
      <td><span class="ref-link" onclick="openTxnDrawer('${t.id}')">${t.id}</span></td>
      <td>${fmtDate(t.date)}</td>
      <td><span class="ref-link">${t.reference}</span></td>
      <td style="max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${t.description}">${t.description}</td>
      <td><span class="badge badge-${t.type}">${typeLabel}</span></td>
      <td style="color:${amtColor};font-weight:600;white-space:nowrap;">${amtPrefix} ${fmtLKR(t.amount)}</td>
      <td style="white-space:nowrap;">${fmtLKR(t.balance)}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" title="View Details" onclick="openTxnDrawer('${t.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="btn-icon" title="Edit" onclick="openEditModal('${t.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn-icon-danger" title="Delete" onclick="openDeleteModal('${t.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');

  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(filteredTxns.length / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredTxns.length);
  const end   = Math.min(currentPage * PAGE_SIZE, filteredTxns.length);

  const info = document.getElementById('paginationInfo');
  if (info) info.textContent = `Showing ${start}–${end} of ${filteredTxns.length} transactions`;

  const btns = document.getElementById('paginationBtns');
  if (!btns) return;

  let html = `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  btns.innerHTML = html;
}

function goPage(p) {
  const totalPages = Math.ceil(filteredTxns.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTransactions();
}

/* ─── Export Modal ─── */
function openExportModal() {
  document.getElementById('exportModal').classList.add('open');
}
function closeExportModal() {
  document.getElementById('exportModal').classList.remove('open');
}
function doExport() {
  const fmt   = document.querySelector('input[name="exportFmt"]:checked')?.value   || 'csv';
  const scope = document.querySelector('input[name="exportScope"]:checked')?.value || 'filtered';
  const data  = scope === 'all' ? allTxns : filteredTxns;

  let content, filename, mime;
  if (fmt === 'json') {
    content  = JSON.stringify({ transactions: data }, null, 2);
    filename = 'transactions.json';
    mime     = 'application/json';
  } else {
    const headers = ['id','date','reference','description','type','category','amount','balance','status','notes','created_by'];
    const rows = data.map(t => headers.map(h => `"${String(t[h]||'').replace(/"/g,'""')}"`).join(','));
    content  = [headers.join(','), ...rows].join('\n');
    filename = 'transactions.csv';
    mime     = 'text/csv';
  }

  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  closeExportModal();
  showToast(`Exported ${data.length} records as ${fmt.toUpperCase()}.`, 'success');
}

/* ─── Add / Edit Modal ─── */
function openAddModal() {
  editingId = null;
  document.getElementById('txnModalTitle').textContent = 'New Transaction';
  document.getElementById('txnModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Create';
  document.getElementById('txnForm').reset();
  document.getElementById('fDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('txnModal').classList.add('open');
}

function openEditModal(id) {
  const txn = allTxns.find(t => t.id === id);
  if (!txn) return;
  editingId = id;
  document.getElementById('txnModalTitle').textContent = 'Edit Transaction';
  document.getElementById('txnModalSaveBtn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';

  document.getElementById('fDate').value        = txn.date;
  document.getElementById('fReference').value   = txn.reference;
  document.getElementById('fDescription').value = txn.description;
  document.getElementById('fType').value        = txn.type;
  document.getElementById('fCategory').value    = txn.category;
  document.getElementById('fAmount').value      = txn.amount;
  document.getElementById('fStatus').value      = txn.status;
  document.getElementById('fNotes').value       = txn.notes || '';

  document.getElementById('txnModal').classList.add('open');
}

function closeTxnModal() {
  document.getElementById('txnModal').classList.remove('open');
}

function saveTxn(e) {
  e.preventDefault();
  const date        = document.getElementById('fDate').value;
  const reference   = document.getElementById('fReference').value.trim();
  const description = document.getElementById('fDescription').value.trim();
  const type        = document.getElementById('fType').value;
  const category    = document.getElementById('fCategory').value;
  const amount      = parseFloat(document.getElementById('fAmount').value);
  const status      = document.getElementById('fStatus').value;
  const notes       = document.getElementById('fNotes').value.trim();

  if (!date || !reference || !description || !type || isNaN(amount) || amount <= 0) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (editingId) {
    const idx = allTxns.findIndex(t => t.id === editingId);
    if (idx >= 0) {
      allTxns[idx] = { ...allTxns[idx], date, reference, description, type, category, amount, status, notes };
      showToast('Transaction updated.', 'success');
    }
  } else {
    const d   = new Date(date + 'T00:00:00');
    const newId = `TXN-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(allTxns.length + 1).padStart(3,'0')}`;
    const lastBalance = allTxns.length ? allTxns[allTxns.length - 1].balance : 0;
    const newBalance  = type === 'income' ? lastBalance + amount : lastBalance - amount;
    allTxns.push({ id: newId, date, reference, description, type, category, amount, balance: newBalance, status, notes, created_by: 'Admin' });
    showToast('Transaction created.', 'success');
  }

  saveLocal();
  updateStats();
  applyFilters();
  closeTxnModal();
}

/* ─── Transaction Drawer ─── */
function openTxnDrawer(id) {
  const txn = allTxns.find(t => t.id === id);
  if (!txn) return;

  const isIncome  = txn.type === 'income';
  const typeLabel = isIncome ? 'Income' : 'Expense';
  const amtColor  = isIncome ? '#16a34a' : '#dc2626';
  const amtPrefix = isIncome ? '+' : '−';
  const statusBadge = `<span class="badge badge-${txn.status}">${txn.status.charAt(0).toUpperCase()+txn.status.slice(1)}</span>`;
  const typeBadge   = `<span class="badge badge-${txn.type}">${typeLabel}</span>`;
  const avatarIcon  = isIncome ? 'fa-arrow-down-to-line' : 'fa-arrow-up-from-line';
  const avatarClass = isIncome ? '' : ' expense';

  document.getElementById('txnDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar${avatarClass}"><i class="fa-solid ${avatarIcon}"></i></div>
      <div>
        <div class="drawer-desc">${txn.description.length > 50 ? txn.description.slice(0,50)+'…' : txn.description}</div>
        <div class="drawer-txn-id">${txn.id} &nbsp;·&nbsp; ${fmtDate(txn.date)}</div>
        <div style="margin-top:.3rem;">${typeBadge} &nbsp; ${statusBadge}</div>
      </div>
      <button class="drawer-close" onclick="closeTxnDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchTxnTab(this,'dtab-details')">Details</button>
      <button class="dtab" onclick="switchTxnTab(this,'dtab-amount')">Amount</button>
      <button class="dtab" onclick="switchTxnTab(this,'dtab-notes')">Notes</button>
    </div>`;

  document.getElementById('txnDrawerBody').innerHTML = `
    <div class="dtab-pane active" id="dtab-details">
      <div class="drawer-section" style="margin-top:.75rem;">
        <div class="drawer-section-title">Transaction Details</div>
        <div class="drawer-field"><span class="df-label">Reference</span><span class="df-val" style="font-family:monospace;">${txn.reference}</span></div>
        <div class="drawer-field"><span class="df-label">Date</span><span class="df-val">${fmtDate(txn.date)}</span></div>
        <div class="drawer-field"><span class="df-label">Category</span><span class="df-val">${txn.category}</span></div>
        <div class="drawer-field"><span class="df-label">Type</span><span class="df-val">${typeBadge}</span></div>
        <div class="drawer-field"><span class="df-label">Status</span><span class="df-val">${statusBadge}</span></div>
        <div class="drawer-field"><span class="df-label">Created By</span><span class="df-val">${txn.created_by || '—'}</span></div>
      </div>
    </div>
    <div class="dtab-pane" id="dtab-amount">
      <div style="margin-top:.75rem;">
        <div class="drawer-kpi-row">
          <div class="drawer-kpi-box">
            <div class="drawer-kpi-val" style="color:${amtColor};">${amtPrefix} ${fmtLKR(txn.amount)}</div>
            <div class="drawer-kpi-label">Transaction Amount</div>
          </div>
          <div class="drawer-kpi-box">
            <div class="drawer-kpi-val">${fmtLKR(txn.balance)}</div>
            <div class="drawer-kpi-label">Running Balance</div>
          </div>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title">Financial Summary</div>
          <div class="drawer-field"><span class="df-label">Amount (LKR)</span><span class="df-val" style="color:${amtColor};font-weight:700;">${amtPrefix} ${fmtLKR(txn.amount)}</span></div>
          <div class="drawer-field"><span class="df-label">Balance After</span><span class="df-val">${fmtLKR(txn.balance)}</span></div>
          <div class="drawer-field"><span class="df-label">Direction</span><span class="df-val">${typeLabel}</span></div>
        </div>
      </div>
    </div>
    <div class="dtab-pane" id="dtab-notes">
      <div style="margin-top:.75rem;">
        <div class="drawer-section-title">Transaction Notes</div>
        <div class="drawer-notes-box">${txn.notes || '<em style="color:var(--color-neutral-400);">No notes for this transaction.</em>'}</div>
        <div style="margin-top:1rem;">
          <div class="drawer-section-title">Full Description</div>
          <div class="drawer-notes-box">${txn.description}</div>
        </div>
      </div>
    </div>`;

  document.getElementById('txnDrawerFooter').innerHTML = `
    <button class="btn btn-ghost btn-sm" onclick="closeTxnDrawer()">Close</button>
    <button class="btn btn-outline btn-sm" onclick="closeTxnDrawer();openEditModal('${txn.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
    <button class="btn btn-danger btn-sm" onclick="closeTxnDrawer();openDeleteModal('${txn.id}')"><i class="fa-solid fa-trash"></i> Delete</button>`;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('txnDrawer').classList.add('open');
}

function closeTxnDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('txnDrawer').classList.remove('open');
}

function switchTxnTab(btn, tabId) {
  document.querySelectorAll('#txnDrawer .dtab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#txnDrawer .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const pane = document.getElementById(tabId);
  if (pane) pane.classList.add('active');
}

/* ─── Delete ─── */
function openDeleteModal(id) {
  const txn = allTxns.find(t => t.id === id);
  if (!txn) return;
  deletingId = id;
  const el = document.getElementById('deleteTxnRef');
  if (el) el.textContent = txn.id;
  document.getElementById('deleteTxnModal').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('deleteTxnModal').classList.remove('open');
  deletingId = null;
}

function confirmDeleteTxn() {
  if (!deletingId) return;
  allTxns = allTxns.filter(t => t.id !== deletingId);
  saveLocal();
  updateStats();
  applyFilters();
  closeDeleteModal();
  showToast('Transaction deleted.', 'success');
}

/* ─── Tab Switcher (page tabs: Transactions / Invoices / Expenses / Reports) ─── */
function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

/* ─── Toast Fallback ─── */
function showToast(msg, type) {
  if (typeof window.LCCToast !== 'undefined') { window.LCCToast.show(msg, type); return; }
  const c = document.getElementById('toastContainer');
  if (!c) { console.log('[toast]', msg); return; }
  const t = document.createElement('div');
  const colors = { success: '#16a34a', error: '#dc2626', info: '#1d4ed8' };
  t.style.cssText = `background:${colors[type]||'#1e293b'};color:#fff;padding:.65rem 1rem;border-radius:8px;font-size:.84rem;box-shadow:0 4px 12px rgba(0,0,0,.18);opacity:0;transition:opacity .3s;`;
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; });
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

/* ─── Init ─── */
loadTransactions();

/* ─── Event Listeners ─── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddTxn').addEventListener('click', openAddModal);
document.getElementById('txnSearch').addEventListener('input', applyFilters);
document.getElementById('txnTypeFilter').addEventListener('change', applyFilters);
document.getElementById('txnStatusFilter').addEventListener('change', applyFilters);
document.getElementById('txnDateFrom').addEventListener('change', applyFilters);
document.getElementById('txnDateTo').addEventListener('change', applyFilters);
document.getElementById('txnForm').addEventListener('submit', saveTxn);
