/* ══════════════════════════════════════════════════
   Vendors — vendors.js
   Features: load, filter, paginate, modals (add/edit/view/export/delete)
   ══════════════════════════════════════════════════ */

'use strict';

/* ─── State ─── */
let allVendors    = [];
let filteredVendors = [];
let editingId     = null;
let deletingId    = null;
let currentPage   = 1;
const PAGE_SIZE   = 8;

/* ─── Helpers ─── */
const fmtLKR = n => '₨ ' + Number(n).toLocaleString('en-LK');

function paymentTermsBadge(terms) {
  const map = {
    'COD':   'badge-blue',
    'Net15': 'badge-green',
    'Net30': 'badge-teal',
    'Net45': 'badge-orange',
    'Net60': 'badge-red',
  };
  return `<span class="badge ${map[terms] || 'badge-blue'}">${terms}</span>`;
}

function categoryIcon(cat) {
  const map = {
    'Electronics':     'fa-microchip',
    'FMCG':           'fa-box-open',
    'Textiles':        'fa-shirt',
    'Stationery':      'fa-pen-ruler',
    'Food & Beverages':'fa-bowl-food',
    'Hardware':        'fa-screwdriver-wrench',
    'Healthcare':      'fa-kit-medical',
    'Accessories':     'fa-gem',
  };
  return `<i class="fa-solid ${map[cat] || 'fa-building'}" style="margin-right:.35rem;opacity:.65;font-size:.8rem;"></i>`;
}

/* ─── Load Data ─── */
async function loadVendors() {
  try {
    const resp = await fetch('../../data/vendors.json?v=' + Date.now());
    const data = await resp.json();
    allVendors = (data.vendors || []).map(v => ({ ...v }));
    // Merge localStorage edits
    const saved = JSON.parse(localStorage.getItem('lcc_vendors') || '[]');
    saved.forEach(sv => {
      const idx = allVendors.findIndex(v => v.id === sv.id);
      if (idx >= 0) allVendors[idx] = sv;
      else allVendors.push(sv);
    });
    applyFilters();
  } catch (e) {
    console.error('Failed to load vendors:', e);
    showToast('Failed to load vendor data.', 'error');
  }
}

function saveLocal() {
  localStorage.setItem('lcc_vendors', JSON.stringify(allVendors));
}

/* ─── Stats ─── */
function updateStats() {
  const total   = allVendors.length;
  const active  = allVendors.filter(v => v.status === 'active').length;
  const pending = allVendors.reduce((s, v) => s + (v.pending_balance || 0), 0);
  const thisMonthSpent = allVendors.reduce((s, v) => s + Math.round((v.total_spent || 0) * 0.041), 0); // ~4.1% as monthly estimate

  const el = id => document.getElementById(id);
  el('statTotalVendors').textContent = total;
  el('statActiveVendors').textContent = active;
  el('statPendingPayments').textContent = fmtLKR(pending);
  el('statMonthPurchases').textContent = fmtLKR(thisMonthSpent);
}

/* ─── Filters ─── */
function applyFilters() {
  const q      = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  const status = document.getElementById('filterStatus').value;
  const cat    = document.getElementById('filterCategory').value;

  filteredVendors = allVendors.filter(v => {
    const matchQ  = !q || [v.company_name, v.contact_person, v.email, v.id]
                          .some(f => (f || '').toLowerCase().includes(q));
    const matchS  = !status || v.status === status;
    const matchC  = !cat    || v.category === cat;
    return matchQ && matchS && matchC;
  });

  currentPage = 1;
  renderTable();
  updateStats();
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterStatus').value = '';
  document.getElementById('filterCategory').value = '';
  applyFilters();
}

/* ─── Render Table ─── */
function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredVendors.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('vendorBody');

  if (page.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-truck" style="font-size:2rem;display:block;margin-bottom:.5rem;opacity:.3;"></i>
      No vendors found matching your filters.</td></tr>`;
  } else {
    tbody.innerHTML = page.map(v => {
      const balance = v.pending_balance || 0;
      const balanceStyle = balance > 0 ? 'font-weight:600;color:#dc2626' : 'font-weight:600;color:var(--color-neutral-500)';
      return `
      <tr>
        <td>
          <div class="vendor-name">${v.company_name}</div>
          <div style="font-size:.72rem;color:var(--color-neutral-400)">${v.id}</div>
        </td>
        <td>${v.contact_person}</td>
        <td>${v.phone}</td>
        <td>${v.email}</td>
        <td>${categoryIcon(v.category)}${v.category}</td>
        <td style="${balanceStyle}">${fmtLKR(balance)}</td>
        <td><span class="badge ${v.status}">${v.status.charAt(0).toUpperCase() + v.status.slice(1)}</span></td>
        <td>
          <div class="actions">
            <button class="btn-icon" title="View" onclick="openViewDrawer('${v.id}')"><i class="fa-solid fa-eye"></i></button>
            <button class="btn-icon" title="Edit" onclick="openEditModal('${v.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-icon btn-icon-danger" title="Delete" onclick="openDeleteModal('${v.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }
  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const total = filteredVendors.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent = `Showing ${total ? start : 0}–${end} of ${total} vendors`;

  const btns = document.getElementById('paginationBtns');
  let html = `<button class="btn-icon" ${currentPage <= 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})">
    <i class="fa-solid fa-chevron-left"></i></button>`;

  for (let p = 1; p <= pages; p++) {
    if (pages > 7) {
      if (p !== 1 && p !== pages && Math.abs(p - currentPage) > 2) {
        if (p === 2 || p === pages - 1) html += `<button class="btn-icon" disabled>…</button>`;
        continue;
      }
    }
    html += `<button class="btn-icon ${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }

  html += `<button class="btn-icon" ${currentPage >= pages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})">
    <i class="fa-solid fa-chevron-right"></i></button>`;

  btns.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(filteredVendors.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
}

/* ══════════════ EXPORT MODAL ══════════════ */
function openExportModal() {
  document.getElementById('exportModal').classList.add('open');
}
function closeExportModal() {
  document.getElementById('exportModal').classList.remove('open');
}
function doExport() {
  const fmt  = document.querySelector('input[name="exportFmt"]:checked').value;
  const scope = document.querySelector('input[name="exportScope"]:checked').value;
  const list  = scope === 'all' ? allVendors : filteredVendors;

  if (fmt === 'csv') {
    const headers = ['id','company_name','contact_person','email','phone','category',
                     'province','city','payment_terms','currency','tax_id',
                     'lead_time','total_orders','total_spent','pending_balance','status'];
    const rows = [headers.join(',')];
    list.forEach(v => rows.push(headers.map(h => `"${(v[h] ?? '').toString().replace(/"/g,'""')}"`).join(',')));
    downloadFile('vendors_export.csv', rows.join('\n'), 'text/csv');
  } else {
    downloadFile('vendors_export.json', JSON.stringify(list, null, 2), 'application/json');
  }
  closeExportModal();
  showToast(`Exported ${list.length} vendors as ${fmt.toUpperCase()}.`, 'success');
}
function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ══════════════ ADD / EDIT VENDOR MODAL ══════════════ */
function openAddModal() {
  editingId = null;
  document.getElementById('vendorModalTitle').textContent = 'Add Vendor';
  document.getElementById('vendorModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Add Vendor';
  document.getElementById('vendorForm').reset();
  document.getElementById('vendorModal').classList.add('open');
}
function closeVendorModal() {
  document.getElementById('vendorModal').classList.remove('open');
}

function openEditModal(id) {
  const v = allVendors.find(v => v.id === id);
  if (!v) return;
  editingId = id;
  document.getElementById('vendorModalTitle').textContent = 'Edit Vendor';
  document.getElementById('vendorModalSaveBtn').innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';
  // Fill form
  const f = id => document.getElementById(id);
  f('fCompanyName').value      = v.company_name   || '';
  f('fContactPerson').value    = v.contact_person || '';
  f('fEmail').value            = v.email          || '';
  f('fPhone').value            = v.phone          || '';
  f('fCategory').value         = v.category       || '';
  f('fProvince').value         = v.province       || '';
  f('fDistrict').value         = v.district       || '';
  f('fCity').value             = v.city           || '';
  f('fAddressLine1').value     = v.address_line1  || '';
  f('fPaymentTerms').value     = v.payment_terms  || 'Net30';
  f('fCurrency').value         = v.currency       || 'LKR';
  f('fTaxId').value            = v.tax_id         || '';
  f('fBankName').value         = v.bank_name      || '';
  f('fBankAccount').value      = v.bank_account   || '';
  f('fLeadTime').value         = v.lead_time      || '';
  f('fStatus').value           = v.status         || 'active';
  f('fNotes').value            = v.notes          || '';
  document.getElementById('vendorModal').classList.add('open');
}

function saveVendor(e) {
  e.preventDefault();
  const f = id => document.getElementById(id);
  const form = {
    company_name:   f('fCompanyName').value.trim(),
    contact_person: f('fContactPerson').value.trim(),
    email:          f('fEmail').value.trim(),
    phone:          f('fPhone').value.trim(),
    category:       f('fCategory').value,
    province:       f('fProvince').value,
    district:       f('fDistrict').value.trim(),
    city:           f('fCity').value.trim(),
    address_line1:  f('fAddressLine1').value.trim(),
    payment_terms:  f('fPaymentTerms').value,
    currency:       f('fCurrency').value,
    tax_id:         f('fTaxId').value.trim(),
    bank_name:      f('fBankName').value.trim(),
    bank_account:   f('fBankAccount').value.trim(),
    lead_time:      parseInt(f('fLeadTime').value) || 7,
    status:         f('fStatus').value,
    notes:          f('fNotes').value.trim(),
  };

  if (!form.company_name) { showToast('Company name is required.', 'warning'); return; }
  if (!form.contact_person) { showToast('Contact person is required.', 'warning'); return; }
  if (!form.email) { showToast('Email is required.', 'warning'); return; }

  if (editingId) {
    const idx = allVendors.findIndex(v => v.id === editingId);
    if (idx >= 0) allVendors[idx] = { ...allVendors[idx], ...form };
    showToast('Vendor updated successfully.', 'success');
  } else {
    const newId = 'VND-' + String(Math.max(0, ...allVendors.map(v => parseInt(v.id.split('-')[1]) || 0)) + 1).padStart(4, '0');
    allVendors.unshift({
      id: newId,
      total_orders: 0, total_spent: 0, pending_balance: 0,
      created_date: new Date().toISOString().slice(0, 10),
      ...form,
    });
    showToast('Vendor added successfully.', 'success');
  }

  saveLocal();
  closeVendorModal();
  applyFilters();
}

/* ══════════════ VIEW DRAWER ══════════════ */
function openViewDrawer(id) {
  const v = allVendors.find(v => v.id === id);
  if (!v) return;

  const ini = v.company_name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const colorsArr = ['#f97316','#3b82f6','#8b5cf6','#14b8a6','#ec4899','#f59e0b'];
  const color = colorsArr[parseInt(id.replace(/\D/g,'')) % colorsArr.length];
  const purchasePct = v.total_spent > 0 ? Math.min(100, Math.round((v.pending_balance / v.total_spent) * 100)) : 0;

  /* ── Header: profile + tabs ── */
  document.getElementById('vendorDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar" style="background:${color};">${ini}</div>
      <div class="drawer-profile-info">
        <div class="drawer-company">${v.company_name}</div>
        <div class="drawer-id">${v.id}</div>
        <span class="badge ${v.status}">${v.status.charAt(0).toUpperCase() + v.status.slice(1)}</span>
      </div>
      <button class="drawer-close" onclick="closeVendorDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchDrawerTab(this,'dtab-overview')">Overview</button>
      <button class="dtab" onclick="switchDrawerTab(this,'dtab-financial')">Financial</button>
      <button class="dtab" onclick="switchDrawerTab(this,'dtab-notes')">Notes</button>
    </div>
  `;

  /* ── Body: scrollable tab content ── */
  document.getElementById('vendorDrawerBody').innerHTML = `
    <div id="dtab-overview" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-address-card"></i> Contact</div>
        <div class="drawer-field"><span class="df-label">Contact Person</span><span class="df-val">${v.contact_person}</span></div>
        <div class="drawer-field"><span class="df-label">Email</span><span class="df-val"><a href="mailto:${v.email}">${v.email}</a></span></div>
        <div class="drawer-field"><span class="df-label">Phone</span><span class="df-val">${v.phone}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-location-dot"></i> Address</div>
        <div class="drawer-field"><span class="df-label">Address</span><span class="df-val">${v.address_line1 || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">City/District</span><span class="df-val">${v.city}, ${v.district}</span></div>
        <div class="drawer-field"><span class="df-label">Province</span><span class="df-val">${v.province}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-boxes-stacked"></i> Supply Info</div>
        <div class="drawer-field"><span class="df-label">Category</span><span class="df-val">${categoryIcon(v.category)}${v.category}</span></div>
        <div class="drawer-field"><span class="df-label">Lead Time</span><span class="df-val">${v.lead_time || '\u2014'} days</span></div>
        <div class="drawer-field"><span class="df-label">Currency</span><span class="df-val">${v.currency}</span></div>
        <div class="drawer-field"><span class="df-label">Payment Terms</span><span class="df-val">${paymentTermsBadge(v.payment_terms)}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-building-columns"></i> Banking</div>
        <div class="drawer-field"><span class="df-label">Bank</span><span class="df-val">${v.bank_name || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">Account</span><span class="df-val">${v.bank_account || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">Tax / VAT ID</span><span class="df-val">${v.tax_id || 'Not registered'}</span></div>
      </div>
    </div>

    <div id="dtab-financial" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-chart-line"></i> Purchase Summary</div>
        <div class="drawer-kpi-row">
          <div class="drawer-kpi-box"><div class="drawer-kpi-val">${v.total_orders}</div><div class="drawer-kpi-label">Total POs</div></div>
          <div class="drawer-kpi-box"><div class="drawer-kpi-val">${fmtLKR(v.total_spent)}</div><div class="drawer-kpi-label">Total Spent</div></div>
        </div>
        <div class="drawer-field" style="margin-top:.75rem;">
          <span class="df-label">Pending Balance</span>
          <span class="df-val" style="font-weight:700;color:${v.pending_balance > 0 ? '#dc2626' : '#16a34a'}">${fmtLKR(v.pending_balance)}</span>
        </div>
        <div style="margin-top:.75rem;">
          <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--color-neutral-500);margin-bottom:.3rem;">
            <span>Balance vs. Total Spent</span><span>${purchasePct}%</span>
          </div>
          <div class="drawer-progress-bar"><div class="drawer-progress-fill" style="width:${purchasePct}%;background:${purchasePct > 50 ? '#dc2626' : '#f97316'};"></div></div>
        </div>
        <div class="drawer-field" style="margin-top:.5rem;">
          <span class="df-label">Avg. Order Value</span>
          <span class="df-val">${v.total_orders > 0 ? fmtLKR(Math.round(v.total_spent / v.total_orders)) : '\u20a8 0'}</span>
        </div>
        <div class="drawer-field">
          <span class="df-label">Vendor Since</span>
          <span class="df-val">${v.created_date ? new Date(v.created_date).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '\u2014'}</span>
        </div>
      </div>
    </div>

    <div id="dtab-notes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-note-sticky"></i> Vendor Notes</div>
        <p style="font-size:.85rem;color:var(--color-neutral-600);line-height:1.6;">${v.notes || 'No notes for this vendor.'}</p>
      </div>
    </div>
  `;

  /* ── Footer: action buttons ── */
  document.getElementById('vendorDrawerFooter').innerHTML = `
    <button class="btn btn-outline btn-sm" onclick="closeVendorDrawer()"><i class="fa-solid fa-xmark"></i> Close</button>
    <button class="btn btn-primary btn-sm" onclick="openEditModal('${v.id}');closeVendorDrawer()"><i class="fa-solid fa-pen"></i> Edit Vendor</button>
    <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;" onclick="closeVendorDrawer();openDeleteModal('${v.id}')"><i class="fa-solid fa-trash"></i></button>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('vendorDrawer').classList.add('open');
}

function closeVendorDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('vendorDrawer').classList.remove('open');
}

function switchDrawerTab(btn, tabId) {
  document.querySelectorAll('#vendorDrawerHeader .dtab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#vendorDrawerBody .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

/* ══════════════ DELETE MODAL ══════════════ */
function openDeleteModal(id) {
  const v = allVendors.find(v => v.id === id);
  if (!v) return;
  deletingId = id;
  document.getElementById('deleteVendorName').textContent = `${v.company_name} (${v.id})`;
  document.getElementById('deleteVendorModal').classList.add('open');
}
function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deleteVendorModal').classList.remove('open');
}
function confirmDeleteVendor() {
  if (!deletingId) return;
  allVendors = allVendors.filter(v => v.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Vendor deleted.', 'success');
  deletingId = null;
}

/* ─── Event Listeners ─── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddVendor').addEventListener('click', openAddModal);
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterCategory').addEventListener('change', applyFilters);

document.getElementById('vendorForm').addEventListener('submit', saveVendor);

// Close modals on overlay click
document.getElementById('vendorModal').addEventListener('click', function(e) {
  if (e.target === this) closeVendorModal();
});
document.getElementById('exportModal').addEventListener('click', function(e) {
  if (e.target === this) closeExportModal();
});
document.getElementById('deleteVendorModal').addEventListener('click', function(e) {
  if (e.target === this) closeDeleteModal();
});

/* ─── Init ─── */
loadVendors();
