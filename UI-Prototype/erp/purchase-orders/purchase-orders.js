/* ══════════════════════════════════════════════════
   Purchase Orders — purchase-orders.js
   ══════════════════════════════════════════════════ */
'use strict';

let allPOs      = [];
let filteredPOs = [];
let editingId   = null;
let deletingId  = null;
let currentPage = 1;
const PAGE_SIZE = 8;

const fmtLKR = n => '\u20a8 ' + Number(n).toLocaleString('en-LK');

function statusBadge(s) {
  return `<span class="badge ${s}">${s.charAt(0).toUpperCase()+s.slice(1)}</span>`;
}
function payBadge(s) {
  const map = { unpaid:'badge-red', partial:'badge-orange', paid:'badge-green' };
  return `<span class="badge ${map[s]||''}">${s.charAt(0).toUpperCase()+s.slice(1)}</span>`;
}

/* ─── Load ─── */
async function loadPOs() {
  try {
    const resp = await fetch('../../data/purchase-orders.json?v=' + Date.now());
    const data = await resp.json();
    allPOs = (data.purchase_orders || []).map(p => ({ ...p }));
    const saved = JSON.parse(localStorage.getItem('lcc_purchase_orders') || '[]');
    saved.forEach(sp => {
      const idx = allPOs.findIndex(p => p.id === sp.id);
      if (idx >= 0) allPOs[idx] = sp; else allPOs.push(sp);
    });
    applyFilters();
  } catch (e) {
    console.error('Failed to load POs:', e);
    showToast('Failed to load purchase order data.', 'error');
  }
}
function saveLocal() {
  localStorage.setItem('lcc_purchase_orders', JSON.stringify(allPOs));
}

/* ─── Stats ─── */
function updateStats() {
  const total   = allPOs.length;
  const pending = allPOs.filter(p => p.status === 'pending' || p.status === 'approved').length;
  const balance = allPOs.reduce((s, p) => s + (p.balance || 0), 0);
  const totalVal = allPOs.reduce((s, p) => s + (p.total_amount || 0), 0);

  document.getElementById('statTotalPO').textContent    = total;
  document.getElementById('statPendingPO').textContent  = pending;
  document.getElementById('statBalance').textContent    = fmtLKR(balance);
  document.getElementById('statTotalValue').textContent = fmtLKR(totalVal);
}

/* ─── Filters ─── */
function applyFilters() {
  const q   = (document.getElementById('searchInput').value||'').toLowerCase().trim();
  const st  = document.getElementById('filterStatus').value;
  const pay = document.getElementById('filterPayment').value;

  filteredPOs = allPOs.filter(p => {
    const mQ  = !q  || [p.id, p.vendor_name].some(f => (f||'').toLowerCase().includes(q));
    const mS  = !st  || p.status === st;
    const mP  = !pay || p.payment_status === pay;
    return mQ && mS && mP;
  });
  currentPage = 1;
  renderTable();
  updateStats();
}
function clearFilters() {
  document.getElementById('searchInput').value  = '';
  document.getElementById('filterStatus').value = '';
  document.getElementById('filterPayment').value = '';
  applyFilters();
}

/* ─── Table ─── */
function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredPOs.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('poBody');

  if (!page.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-cart-flatbed" style="font-size:2rem;display:block;margin-bottom:.5rem;opacity:.3;"></i>
      No purchase orders found.</td></tr>`;
  } else {
    tbody.innerHTML = page.map(p => `
      <tr>
        <td><span class="po-id">${p.id}</span></td>
        <td>
          <div style="font-weight:500;font-size:.84rem;">${p.vendor_name}</div>
          <div style="font-size:.72rem;color:var(--color-neutral-400);">${p.vendor_id||''}</div>
        </td>
        <td>${p.order_date ? new Date(p.order_date+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'}</td>
        <td>${p.expected_date ? new Date(p.expected_date+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'}</td>
        <td style="text-align:center;">${p.items_count||0}</td>
        <td style="font-weight:600;">${fmtLKR(p.total_amount||0)}</td>
        <td>${statusBadge(p.status)}</td>
        <td>${payBadge(p.payment_status)}</td>
        <td>
          <div class="actions">
            <button class="btn-icon" title="View" onclick="openPODrawer('${p.id}')"><i class="fa-solid fa-eye"></i></button>
            <button class="btn-icon" title="Edit" onclick="openEditModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-icon btn-icon-danger" title="Delete" onclick="openDeleteModal('${p.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');
  }
  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const total = filteredPOs.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage-1)*PAGE_SIZE+1, total);
  const end   = Math.min(currentPage*PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent = `Showing ${total?start:0}\u2013${end} of ${total} orders`;

  const btns = document.getElementById('paginationBtns');
  let html = `<button class="btn-icon" ${currentPage<=1?'disabled':''} onclick="goPage(${currentPage-1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let p=1; p<=pages; p++) {
    if (pages>7 && p!==1 && p!==pages && Math.abs(p-currentPage)>2) {
      if (p===2||p===pages-1) html += `<button class="btn-icon" disabled>\u2026</button>`;
      continue;
    }
    html += `<button class="btn-icon ${p===currentPage?'page-active':''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button class="btn-icon" ${currentPage>=pages?'disabled':''} onclick="goPage(${currentPage+1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  btns.innerHTML = html;
}
function goPage(p) {
  const pages = Math.ceil(filteredPOs.length / PAGE_SIZE);
  if (p<1||p>pages) return;
  currentPage = p;
  renderTable();
}

/* ──  EXPORT ── */
function openExportModal()  { document.getElementById('exportModal').classList.add('open'); }
function closeExportModal() { document.getElementById('exportModal').classList.remove('open'); }
function doExport() {
  const fmt   = document.querySelector('input[name="exportFmt"]:checked').value;
  const scope = document.querySelector('input[name="exportScope"]:checked').value;
  const list  = scope==='all' ? allPOs : filteredPOs;
  if (fmt==='csv') {
    const keys = ['id','vendor_name','order_date','expected_date','items_count','total_amount','paid_amount','balance','status','payment_status'];
    const rows = [keys.join(',')];
    list.forEach(p => rows.push(keys.map(k => `"${(p[k]??'').toString().replace(/"/g,'""')}"`).join(',')));
    downloadFile('purchase_orders.csv', rows.join('\n'), 'text/csv');
  } else {
    downloadFile('purchase_orders.json', JSON.stringify(list,null,2), 'application/json');
  }
  closeExportModal();
  showToast(`Exported ${list.length} orders as ${fmt.toUpperCase()}.`, 'success');
}
function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content],{type}));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}

/* ── ADD / EDIT ── */
function openAddModal() {
  editingId = null;
  document.getElementById('poModalTitle').textContent = 'New Purchase Order';
  document.getElementById('poModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Create PO';
  document.getElementById('poForm').reset();
  document.getElementById('fOrderDate').value = new Date().toISOString().slice(0,10);
  document.getElementById('poModal').classList.add('open');
}
function openEditModal(id) {
  const p = allPOs.find(p => p.id===id);
  if (!p) return;
  editingId = id;
  document.getElementById('poModalTitle').textContent = `Edit — ${id}`;
  document.getElementById('poModalSaveBtn').innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
  const f = id2 => document.getElementById(id2);
  f('fVendorName').value     = p.vendor_name||'';
  f('fOrderDate').value      = p.order_date||'';
  f('fExpectedDate').value   = p.expected_date||'';
  f('fItemsCount').value     = p.items_count||'';
  f('fTotalAmount').value    = p.total_amount||0;
  f('fPaidAmount').value     = p.paid_amount||0;
  f('fStatus').value         = p.status||'pending';
  f('fPaymentStatus').value  = p.payment_status||'unpaid';
  f('fNotes').value          = p.notes||'';
  document.getElementById('poModal').classList.add('open');
}
function closePOModal() {
  document.getElementById('poModal').classList.remove('open');
}
function savePO(e) {
  e.preventDefault();
  const f = id => document.getElementById(id);
  const totalAmt = parseFloat(f('fTotalAmount').value)||0;
  const paidAmt  = parseFloat(f('fPaidAmount').value)||0;
  const form = {
    vendor_name:    f('fVendorName').value.trim(),
    order_date:     f('fOrderDate').value,
    expected_date:  f('fExpectedDate').value,
    items_count:    parseInt(f('fItemsCount').value)||1,
    total_amount:   totalAmt,
    paid_amount:    paidAmt,
    balance:        Math.max(0, totalAmt - paidAmt),
    status:         f('fStatus').value,
    payment_status: f('fPaymentStatus').value,
    notes:          f('fNotes').value.trim(),
  };
  if (!form.vendor_name) { showToast('Vendor name is required.','warning'); return; }
  if (!form.order_date)  { showToast('Order date is required.','warning'); return; }

  if (editingId) {
    const idx = allPOs.findIndex(p => p.id===editingId);
    if (idx>=0) allPOs[idx] = { ...allPOs[idx], ...form };
    showToast('Purchase order updated.','success');
  } else {
    const newId = 'PO-' + String(Math.max(0,...allPOs.map(p=>parseInt(p.id.split('-')[1])||0))+1).padStart(4,'0');
    allPOs.unshift({ id:newId, vendor_id:'', created_date:form.order_date, ...form });
    showToast('Purchase order created.','success');
  }
  saveLocal(); closePOModal(); applyFilters();
}

/* ── VIEW DRAWER ── */
function openPODrawer(id) {
  const p = allPOs.find(p => p.id===id);
  if (!p) return;

  const colorsArr = ['#3b82f6','#f97316','#8b5cf6','#14b8a6','#ec4899'];
  const color = colorsArr[parseInt(id.replace(/\D/g,''))%colorsArr.length];
  const paidPct = p.total_amount>0 ? Math.min(100,Math.round((p.paid_amount/p.total_amount)*100)) : 0;

  document.getElementById('poDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar" style="background:${color};"><i class="fa-solid fa-cart-flatbed" style="color:#fff;font-size:.9rem;"></i></div>
      <div>
        <div class="drawer-company">${p.vendor_name}</div>
        <div class="drawer-po-id">${p.id}</div>
        ${statusBadge(p.status)}
      </div>
      <button class="drawer-close" onclick="closePODrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchPOTab(this,'dtab-details')">Details</button>
      <button class="dtab" onclick="switchPOTab(this,'dtab-payment')">Payment</button>
      <button class="dtab" onclick="switchPOTab(this,'dtab-notes')">Notes</button>
    </div>
  `;

  document.getElementById('poDrawerBody').innerHTML = `
    <div id="dtab-details" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-truck"></i> Vendor</div>
        <div class="drawer-field"><span class="df-label">Vendor Name</span><span class="df-val">${p.vendor_name}</span></div>
        <div class="drawer-field"><span class="df-label">Vendor ID</span><span class="df-val">${p.vendor_id||'—'}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-calendar"></i> Dates & Items</div>
        <div class="drawer-field"><span class="df-label">Order Date</span><span class="df-val">${p.order_date?new Date(p.order_date+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—'}</span></div>
        <div class="drawer-field"><span class="df-label">Expected Delivery</span><span class="df-val">${p.expected_date?new Date(p.expected_date+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—'}</span></div>
        <div class="drawer-field"><span class="df-label">Items Count</span><span class="df-val">${p.items_count||0} items</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-tag"></i> Status</div>
        <div class="drawer-field"><span class="df-label">Order Status</span><span class="df-val">${statusBadge(p.status)}</span></div>
        <div class="drawer-field"><span class="df-label">Payment Status</span><span class="df-val">${payBadge(p.payment_status)}</span></div>
      </div>
    </div>

    <div id="dtab-payment" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-money-bill-wave"></i> Financials</div>
        <div class="drawer-kpi-row">
          <div class="drawer-kpi-box"><div class="drawer-kpi-val">${fmtLKR(p.total_amount||0)}</div><div class="drawer-kpi-label">Total</div></div>
          <div class="drawer-kpi-box"><div class="drawer-kpi-val">${fmtLKR(p.paid_amount||0)}</div><div class="drawer-kpi-label">Paid</div></div>
          <div class="drawer-kpi-box"><div class="drawer-kpi-val" style="color:${(p.balance||0)>0?'#dc2626':'#16a34a'}">${fmtLKR(p.balance||0)}</div><div class="drawer-kpi-label">Balance</div></div>
        </div>
        <div style="margin-top:.75rem;">
          <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--color-neutral-500);margin-bottom:.3rem;">
            <span>Payment Progress</span><span>${paidPct}%</span>
          </div>
          <div class="drawer-progress-bar"><div class="drawer-progress-fill" style="width:${paidPct}%;background:${paidPct>=100?'#16a34a':paidPct>50?'#f59e0b':'#dc2626'};"></div></div>
        </div>
      </div>
    </div>

    <div id="dtab-notes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-note-sticky"></i> Notes</div>
        <p style="font-size:.85rem;color:var(--color-neutral-600);line-height:1.6;">${p.notes||'No notes for this order.'}</p>
      </div>
    </div>
  `;

  document.getElementById('poDrawerFooter').innerHTML = `
    <button class="btn btn-outline btn-sm" onclick="closePODrawer()"><i class="fa-solid fa-xmark"></i> Close</button>
    <button class="btn btn-primary btn-sm" onclick="openEditModal('${p.id}');closePODrawer()"><i class="fa-solid fa-pen"></i> Edit</button>
    <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;" onclick="closePODrawer();openDeleteModal('${p.id}')"><i class="fa-solid fa-trash"></i></button>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('poDrawer').classList.add('open');
}
function closePODrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('poDrawer').classList.remove('open');
}
function switchPOTab(btn, tabId) {
  document.querySelectorAll('#poDrawerHeader .dtab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#poDrawerBody .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

/* ── DELETE ── */
function openDeleteModal(id) {
  const p = allPOs.find(p => p.id===id);
  if (!p) return;
  deletingId = id;
  document.getElementById('deletePOId').textContent = `${p.vendor_name} — ${id}`;
  document.getElementById('deletePOModal').classList.add('open');
}
function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deletePOModal').classList.remove('open');
}
function confirmDeletePO() {
  if (!deletingId) return;
  allPOs = allPOs.filter(p => p.id!==deletingId);
  saveLocal(); closeDeleteModal(); applyFilters();
  showToast('Purchase order deleted.','success');
  deletingId = null;
}

/* ── Event Listeners ── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddPO').addEventListener('click', openAddModal);
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterPayment').addEventListener('change', applyFilters);
document.getElementById('poForm').addEventListener('submit', savePO);
document.getElementById('poModal').addEventListener('click', function(e){ if(e.target===this) closePOModal(); });
document.getElementById('exportModal').addEventListener('click', function(e){ if(e.target===this) closeExportModal(); });
document.getElementById('deletePOModal').addEventListener('click', function(e){ if(e.target===this) closeDeleteModal(); });

/* ── Toast fallback ── */
function showToast(msg, type='success') {
  if (window.LCC && window.LCC.showToast) { window.LCC.showToast(msg,type); return; }
  const el = document.createElement('div');
  const bg = type==='success'?'#16a34a':type==='warning'?'#d97706':type==='info'?'#2563eb':'#dc2626';
  el.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;background:${bg};color:#fff;padding:.75rem 1.25rem;border-radius:8px;font-size:.875rem;box-shadow:0 4px 16px rgba(0,0,0,.2);`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ── Init ── */
loadPOs();
