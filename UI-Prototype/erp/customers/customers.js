/* Page-specific scripts — index.html */

/* ════════════════════════════════════════════════════
   LANKACOMMERCE CLOUD — CUSTOMERS PAGE
   ════════════════════════════════════════════════════ */
const { formatLKR, statusBadge, loadData, avatarInitials } = window.LCC || {};

/* ─── Province → District map ─── */
const PROVINCE_DISTRICTS = {
  'Western Province':       ['Colombo','Gampaha','Kalutara'],
  'Central Province':       ['Kandy','Matale','Nuwara Eliya'],
  'Southern Province':      ['Galle','Matara','Hambantota'],
  'Northern Province':      ['Jaffna','Kilinochchi','Mannar','Mullaitivu','Vavuniya'],
  'Eastern Province':       ['Ampara','Batticaloa','Trincomalee'],
  'North Western Province': ['Kurunegala','Puttalam'],
  'North Central Province': ['Anuradhapura','Polonnaruwa'],
  'Uva Province':           ['Badulla','Monaragala'],
  'Sabaragamuwa Province':  ['Ratnapura','Kegalle'],
};

/* ─── State ─── */
let allCustomers = [];
let filteredCustomers = [];
let currentPage = 1;
const PAGE_SIZE = 10;
let editingId = null;
let selectedIds = new Set();

/* ─── Helpers ─── */
function fmtPhone(p) {
  if (!p) return '—';
  const d = p.replace(/\D/g,'');
  if (d.length === 11 && d.startsWith('94')) {
    return `+94 ${d.slice(2,4)} ${d.slice(4,7)} ${d.slice(7)}`;
  }
  return p;
}

function tierBadge(tier) {
  const map = {
    'Bronze':   'badge-bronze',
    'Silver':   'badge-silver',
    'Gold':     'badge-gold',
    'Platinum': 'badge-platinum',
  };
  const icon = tier === 'Platinum' ? '★' : tier === 'Gold' ? '◆' : '';
  return `<span class="badge ${map[tier] || 'badge-regular'}">${icon ? icon+' ' : ''}${tier || 'Regular'}</span>`;
}

function initials(first, last) {
  return ((first||'')[0]||'') + ((last||'')[0]||'');
}

function fmtLKR(n) {
  if (typeof formatLKR === 'function') return formatLKR(n);
  return '₨ ' + (n||0).toLocaleString('en-LK');
}

/* ─── Load data ─── */
async function loadCustomers() {
  try {
    const data = await fetch('../../data/customers.json').then(r => r.json());
    const base = (data.customers || []).map(c => ({...c, _source:'json'}));
    const local = JSON.parse(localStorage.getItem('lcc_customers') || '[]');
    // merge: local additions + overrides
    const jsonIds = new Set(base.map(c => c.id));
    const localNew = local.filter(c => !jsonIds.has(c.id));
    const merged = base.map(c => {
      const override = local.find(l => l.id === c.id);
      return override ? {...c, ...override} : c;
    });
    allCustomers = [...merged, ...localNew];
    applyFilters();
    updateStats();
  } catch(e) {
    console.error('Failed to load customers:', e);
    allCustomers = JSON.parse(localStorage.getItem('lcc_customers') || '[]');
    applyFilters();
    updateStats();
  }
}

/* ─── Save to localStorage ─── */
function saveLocal() {
  localStorage.setItem('lcc_customers', JSON.stringify(allCustomers));
}

/* ─── Stats ─── */
function updateStats() {
  document.getElementById('statTotal').textContent  = allCustomers.length;
  document.getElementById('statActive').textContent = allCustomers.filter(c => !c.status || c.status === 'active').length;
  document.getElementById('statVip').textContent    = allCustomers.filter(c => c.loyalty_tier === 'Platinum' || c.loyalty_tier === 'Gold').length;
  document.getElementById('statOverdue').textContent= allCustomers.filter(c => (c.credit_used||0) > 0).length;
  const sub = `${allCustomers.length} customers · as of ${new Date().toLocaleDateString('en-LK',{dateStyle:'medium'})}`;
  document.getElementById('custSubtitle').textContent = sub;
}

/* ─── Filter / Search ─── */
function applyFilters() {
  const q        = document.getElementById('searchInput').value.toLowerCase().trim();
  const tier     = document.getElementById('filterTier').value;
  const type     = document.getElementById('filterType').value;
  const province = document.getElementById('filterProvince').value;

  filteredCustomers = allCustomers.filter(c => {
    const name = `${c.first_name} ${c.last_name}`.toLowerCase();
    const matchQ = !q || name.includes(q) || (c.phone||'').includes(q) || (c.email||'').toLowerCase().includes(q);
    const matchTier     = !tier     || c.loyalty_tier === tier;
    const matchType     = !type     || c.customer_type === type;
    const matchProvince = !province || c.province === province;
    return matchQ && matchTier && matchType && matchProvince;
  });

  currentPage = 1;
  renderTable();
  renderPagination();
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('filterTier').value = '';
  document.getElementById('filterType').value = '';
  document.getElementById('filterProvince').value = '';
  applyFilters();
}

/* ─── Render Table ─── */
function renderTable() {
  const tbody = document.getElementById('custTableBody');
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredCustomers.slice(start, start + PAGE_SIZE);

  if (!page.length) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><i class="fa-solid fa-users-slash"></i><p>No customers found. Try adjusting your filters.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = page.map(c => {
    const fullName  = `${c.first_name} ${c.last_name}`;
    const ini       = initials(c.first_name, c.last_name).toUpperCase();
    const avatarHtml = c.avatar
      ? `<img src="${c.avatar}" alt="${ini}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <span style="display:none;width:38px;height:38px;border-radius:50%;background:var(--primary,#f97316);color:#fff;align-items:center;justify-content:center;font-weight:700;font-size:0.875rem;">${ini}</span>`
      : ``;
    const owing   = c.credit_used || 0;
    const status  = (!c.status || c.status === 'active') ? 'active' : 'inactive';
    const checked = selectedIds.has(c.id) ? 'checked' : '';

    return `
    <tr>
      <td style="width:40px;padding:0.875rem 0.75rem 0.875rem 1rem;">
        <input type="checkbox" data-id="${c.id}" class="row-cb" ${checked} onchange="toggleSelect('${c.id}',this.checked)" />
      </td>
      <td>
        <div class="cust-cell">
          <div class="cust-avatar">${avatarHtml || ini}</div>
          <div>
            <div class="cust-name">${fullName}</div>
            <div class="cust-email">${c.email || '—'}</div>
          </div>
        </div>
      </td>
      <td style="white-space:nowrap;">${fmtPhone(c.phone)}</td>
      <td>${tierBadge(c.loyalty_tier)}</td>
      <td style="text-align:center;">${c.total_orders || 0}</td>
      <td style="white-space:nowrap;">${fmtLKR(c.total_spent || 0)}</td>
      <td style="white-space:nowrap;">${owing > 0
        ? `<span class="amount-owing">${fmtLKR(owing)}</span>`
        : `<span class="amount-zero">—</span>`}
      </td>
      <td><span class="badge ${status === 'active' ? 'badge-active' : 'badge-inactive'}">${status === 'active' ? 'Active' : 'Inactive'}</span></td>
      <td>
        <div class="row-actions">
          <button class="row-btn" title="View details" onclick="openSlideOver('${c.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="row-btn" title="Edit customer" onclick="openEditModal('${c.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
          <div class="action-dropdown">
            <button class="row-btn" title="More actions" onclick="toggleDropdown(this)"><i class="fa-solid fa-ellipsis-vertical"></i></button>
            <div class="action-dropdown-menu">
              <button class="action-dropdown-item" onclick="addNote('${c.id}')"><i class="fa-solid fa-note-sticky"></i> Add Note</button>
              <button class="action-dropdown-item" onclick="sendSMS('${c.id}')"><i class="fa-solid fa-comment-sms"></i> Send SMS</button>
              <button class="action-dropdown-item danger" onclick="deleteCustomer('${c.id}')"><i class="fa-solid fa-trash"></i> Delete</button>
            </div>
          </div>
        </div>
      </td>
    </tr>`;
  }).join('');
}

/* ─── Pagination ─── */
function renderPagination() {
  const total = filteredCustomers.length;
  const pages = Math.ceil(total / PAGE_SIZE);
  const start = Math.min((currentPage-1)*PAGE_SIZE + 1, total);
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent = total
    ? `Showing ${start}–${end} of ${total} customers`
    : 'No results';

  const btnsEl = document.getElementById('paginationBtns');
  if (pages <= 1) { btnsEl.innerHTML = ''; return; }

  let html = `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let i = 1; i <= pages; i++) {
    if (i === 1 || i === pages || Math.abs(i - currentPage) <= 1) {
      html += `<button class="page-btn ${i===currentPage?'active':''}" onclick="goPage(${i})">${i}</button>`;
    } else if (Math.abs(i - currentPage) === 2) {
      html += `<span style="display:flex;align-items:center;padding:0 4px;color:var(--color-neutral-400);">…</span>`;
    }
  }
  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===pages?'disabled':''}><i class="fa-solid fa-chevron-right"></i></button>`;
  btnsEl.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(filteredCustomers.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
  renderPagination();
}

/* ─── Select / Bulk ─── */
function toggleSelect(id, checked) {
  checked ? selectedIds.add(id) : selectedIds.delete(id);
  updateBulkBar();
}

function updateBulkBar() {
  const btn = document.getElementById('btnBulkDelete');
  document.getElementById('bulkCount').textContent = selectedIds.size;
  btn.style.display = selectedIds.size > 0 ? '' : 'none';
}

document.getElementById('selectAll').addEventListener('change', function() {
  const page = filteredCustomers.slice((currentPage-1)*PAGE_SIZE, currentPage*PAGE_SIZE);
  page.forEach(c => this.checked ? selectedIds.add(c.id) : selectedIds.delete(c.id));
  updateBulkBar();
  renderTable();
});

document.getElementById('btnBulkDelete').addEventListener('click', function() {
  if (!selectedIds.size) return;
  if (!confirm(`Delete ${selectedIds.size} selected customer(s)?`)) return;
  allCustomers = allCustomers.filter(c => !selectedIds.has(c.id));
  selectedIds.clear();
  saveLocal();
  applyFilters();
  updateStats();
  updateBulkBar();
  showToast('Customers deleted.', 'success');
});

/* ─── Dropdown toggling ─── */
function toggleDropdown(btn) {
  document.querySelectorAll('.action-dropdown-menu.show').forEach(m => m.classList.remove('show'));
  const menu = btn.nextElementSibling;
  menu.classList.toggle('show');
}
document.addEventListener('click', e => {
  if (!e.target.closest('.action-dropdown')) {
    document.querySelectorAll('.action-dropdown-menu.show').forEach(m => m.classList.remove('show'));
  }
});

/* ─── Province → District cascade ─── */
function cascadeDistrict() {
  const prov = document.getElementById('fProvince').value;
  const sel  = document.getElementById('fDistrict');
  const dists = PROVINCE_DISTRICTS[prov] || [];
  sel.innerHTML = dists.length
    ? dists.map(d => `<option>${d}</option>`).join('')
    : '<option value="">Select Province first</option>';
}

/* ─── Open Add Modal ─── */
document.getElementById('btnAddCustomer').addEventListener('click', () => {
  editingId = null;
  document.getElementById('modalTitle').textContent = 'Add Customer';
  document.getElementById('modalSaveBtn').innerHTML = '<i class="fa-solid fa-user-plus"></i> Save Customer';
  document.getElementById('customerForm').reset();
  document.getElementById('fTier').value = 'Bronze';
  document.getElementById('customerModal').classList.add('open');
});

/* ─── Open Edit Modal ─── */
function openEditModal(id) {
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  editingId = id;
  document.getElementById('modalTitle').textContent = `Edit — ${c.first_name} ${c.last_name}`;
  document.getElementById('modalSaveBtn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save Changes';

  document.getElementById('fFirstName').value  = c.first_name  || '';
  document.getElementById('fLastName').value   = c.last_name   || '';
  document.getElementById('fEmail').value      = c.email       || '';
  document.getElementById('fPhone').value      = (c.phone||'').replace(/^\+94/,'').replace(/\s/g,'');
  document.getElementById('fDob').value        = c.dob         || '';
  document.getElementById('fCustType').value   = c.customer_type || 'individual';
  document.getElementById('fAddr1').value      = c.address_line1 || '';
  document.getElementById('fProvince').value   = c.province   || '';
  cascadeDistrict();
  document.getElementById('fDistrict').value   = c.district   || '';
  document.getElementById('fCity').value       = c.city       || '';
  document.getElementById('fCompany').value    = c.business_name || '';
  document.getElementById('fTaxId').value      = c.tax_id     || '';
  document.getElementById('fTier').value       = c.loyalty_tier || 'Bronze';
  document.getElementById('fCreditLimit').value= c.credit_limit || '';
  document.getElementById('fPayTerms').value   = c.payment_terms || 'Immediate';
  document.getElementById('fNotes').value      = c.notes      || '';

  document.getElementById('customerModal').classList.add('open');
}

/* ─── Close Modal ─── */
function closeModal() {
  document.getElementById('customerModal').classList.remove('open');
  editingId = null;
}
document.getElementById('customerModal').addEventListener('click', e => {
  if (e.target === document.getElementById('customerModal')) closeModal();
});

/* ─── Form Submit ─── */
document.getElementById('customerForm').addEventListener('submit', e => {
  e.preventDefault();
  const phoneRaw = document.getElementById('fPhone').value.replace(/\s/g,'');
  const phone    = '+94' + phoneRaw;
  const rec = {
    first_name:    document.getElementById('fFirstName').value.trim(),
    last_name:     document.getElementById('fLastName').value.trim(),
    email:         document.getElementById('fEmail').value.trim(),
    phone,
    dob:           document.getElementById('fDob').value,
    customer_type: document.getElementById('fCustType').value,
    address_line1: document.getElementById('fAddr1').value.trim(),
    province:      document.getElementById('fProvince').value,
    district:      document.getElementById('fDistrict').value,
    city:          document.getElementById('fCity').value.trim(),
    business_name: document.getElementById('fCompany').value.trim(),
    tax_id:        document.getElementById('fTaxId').value.trim(),
    loyalty_tier:  document.getElementById('fTier').value,
    credit_limit:  parseFloat(document.getElementById('fCreditLimit').value) || 0,
    payment_terms: document.getElementById('fPayTerms').value,
    notes:         document.getElementById('fNotes').value.trim(),
    status: 'active',
  };

  if (editingId) {
    const idx = allCustomers.findIndex(c => c.id === editingId);
    if (idx > -1) allCustomers[idx] = {...allCustomers[idx], ...rec};
    showToast(`${rec.first_name} ${rec.last_name} updated.`, 'success');
  } else {
    rec.id            = 'CUS-' + String(Date.now()).slice(-6);
    rec.total_orders  = 0;
    rec.total_spent   = 0;
    rec.credit_used   = 0;
    rec.loyalty_points= 0;
    rec.customer_since= new Date().toISOString().split('T')[0];
    allCustomers.push(rec);
    showToast(`${rec.first_name} ${rec.last_name} added!`, 'success');
  }

  saveLocal();
  applyFilters();
  updateStats();
  closeModal();
});

/* ─── Delete ─── */
function deleteCustomer(id) {
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  if (!confirm(`Delete ${c.first_name} ${c.last_name}? This cannot be undone.`)) return;
  allCustomers = allCustomers.filter(x => x.id !== id);
  saveLocal();
  applyFilters();
  updateStats();
  showToast('Customer deleted.', 'warning');
}

/* ─── Add Note & SMS ─── */
function addNote(id) {
  openSlideOver(id, 'notes');
}
function sendSMS(id) {
  const c = allCustomers.find(x => x.id === id);
  showToast(`SMS to ${fmtPhone(c?.phone||'')} queued. (Demo)`, 'info');
}

/* ─── Slide-Over ─── */
function openSlideOver(id, tab = 'overview') {
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;

  const ini    = initials(c.first_name, c.last_name).toUpperCase();
  const owing  = c.credit_used || 0;
  const status = (!c.status || c.status === 'active') ? 'active' : 'inactive';
  const notes  = (c.notes || '').trim();

  const html = `
    <div class="profile-header">
      <div class="profile-avatar-lg">${c.avatar
        ? `<img src="${c.avatar}" alt="${ini}" onerror="this.outerHTML='<span style=\\"font-size:1.25rem;font-weight:700;\\">${ini}</span>'" />`
        : ini}</div>
      <div>
        <div class="profile-name">${c.first_name} ${c.last_name}</div>
        <div style="display:flex;align-items:center;gap:0.5rem;margin-top:0.35rem;">
          ${tierBadge(c.loyalty_tier)}
          <span class="badge ${status === 'active' ? 'badge-active' : 'badge-inactive'}">${status}</span>
        </div>
        <div class="profile-id">${c.id} · Since ${c.customer_since || '—'}</div>
      </div>
    </div>

    <div class="so-stats-grid">
      <div class="so-stat">
        <div class="so-stat-val">${c.total_orders || 0}</div>
        <div class="so-stat-lbl">Total Orders</div>
      </div>
      <div class="so-stat">
        <div class="so-stat-val">${fmtLKR(c.total_spent || 0)}</div>
        <div class="so-stat-lbl">Total Spent</div>
      </div>
      <div class="so-stat">
        <div class="so-stat-val ${owing > 0 ? 'amount-owing' : ''}">${owing > 0 ? fmtLKR(owing) : '—'}</div>
        <div class="so-stat-lbl">Outstanding</div>
      </div>
      <div class="so-stat">
        <div class="so-stat-val">${c.loyalty_points || 0}</div>
        <div class="so-stat-lbl">Loyalty Points</div>
      </div>
    </div>

    <div class="tab-bar" id="soTabBar">
      <button class="tab-btn ${tab==='overview'?'active':''}" onclick="soTab('overview',this)">Overview</button>
      <button class="tab-btn ${tab==='orders'?'active':''}"   onclick="soTab('orders',this)">Orders</button>
      <button class="tab-btn ${tab==='notes'?'active':''}"    onclick="soTab('notes',this)">Notes</button>
    </div>

    <div class="tab-panel ${tab==='overview'?'active':''}" id="soOverview">
      <div class="info-row"><span class="info-label">Phone</span><span class="info-value">${fmtPhone(c.phone)}</span></div>
      <div class="info-row"><span class="info-label">Email</span><span class="info-value">${c.email || '—'}</span></div>
      <div class="info-row"><span class="info-label">Address</span><span class="info-value">${[c.address_line1, c.city, c.district, c.province].filter(Boolean).join(', ') || '—'}</span></div>
      <div class="info-row"><span class="info-label">Customer Type</span><span class="info-value">${c.customer_type === 'business' ? 'Business' : 'Individual'}</span></div>
      ${c.business_name ? `<div class="info-row"><span class="info-label">Company</span><span class="info-value">${c.business_name}</span></div>` : ''}
      ${c.tax_id        ? `<div class="info-row"><span class="info-label">Tax ID</span><span class="info-value">${c.tax_id}</span></div>` : ''}
      <div class="info-row"><span class="info-label">Credit Limit</span><span class="info-value">${fmtLKR(c.credit_limit || 0)}</span></div>
      <div class="info-row"><span class="info-label">Credit Used</span><span class="info-value ${owing>0?'amount-owing':''}">${fmtLKR(owing)}</span></div>
      <div class="info-row"><span class="info-label">Avg Order</span><span class="info-value">${fmtLKR(c.avg_order_value || 0)}</span></div>
    </div>

    <div class="tab-panel ${tab==='orders'?'active':''}" id="soOrders">
      <div style="color:var(--color-neutral-400);font-size:0.8125rem;text-align:center;padding:2rem;">
        <i class="fa-solid fa-bag-shopping" style="font-size:1.5rem;display:block;margin-bottom:0.5rem;"></i>
        Order history integration coming soon.<br>
        <a href="../sales/orders.html?customer=${c.id}" style="color:var(--primary);font-weight:500;margin-top:0.5rem;display:inline-block;">View in Orders →</a>
      </div>
    </div>

    <div class="tab-panel ${tab==='notes'?'active':''}" id="soNotes">
      <div id="notesList">
        ${notes
          ? `<div class="note-item">${notes}</div>`
          : `<div style="color:var(--color-neutral-400);font-size:0.8125rem;">No notes yet.</div>`}
      </div>
      <div class="note-add-form">
        <textarea class="form-control" id="newNoteInput" placeholder="Add a note…" rows="2"></textarea>
        <button class="btn btn-primary btn-sm" style="align-self:flex-end;" onclick="saveNote('${c.id}')">
          <i class="fa-solid fa-plus"></i> Add
        </button>
      </div>
    </div>

    <div style="margin-top:1.5rem;display:flex;gap:0.625rem;flex-wrap:wrap;">
      <button class="btn btn-primary btn-sm" onclick="closeSlideOver();openEditModal('${c.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
      <button class="btn btn-outline btn-sm" onclick="sendSMS('${c.id}')"><i class="fa-solid fa-comment-sms"></i> Send SMS</button>
      <button class="btn btn-outline btn-sm danger" onclick="closeSlideOver();deleteCustomer('${c.id}')"><i class="fa-solid fa-trash"></i> Delete</button>
    </div>
  `;

  document.getElementById('slideoverBody').innerHTML = html;
  document.getElementById('slideoverOverlay').classList.add('open');
  document.getElementById('slideover').classList.add('open');
}

function soTab(tabId, btn) {
  document.querySelectorAll('#slideoverBody .tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#slideoverBody .tab-panel').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('so' + tabId.charAt(0).toUpperCase() + tabId.slice(1))?.classList.add('active');
}

function closeSlideOver() {
  document.getElementById('slideoverOverlay').classList.remove('open');
  document.getElementById('slideover').classList.remove('open');
}

function saveNote(id) {
  const txt = (document.getElementById('newNoteInput')?.value || '').trim();
  if (!txt) return;
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  c.notes = c.notes ? c.notes + '\n' + txt : txt;
  saveLocal();
  showToast('Note saved.', 'success');
  openSlideOver(id, 'notes');
}

/* ─── Export ─── */
document.getElementById('btnExport').addEventListener('click', () => {
  const rows = [['ID','First Name','Last Name','Email','Phone','Tier','Type','Province','Total Orders','Total Spent','Credit Used','Status']];
  allCustomers.forEach(c => rows.push([
    c.id, c.first_name, c.last_name, c.email, c.phone,
    c.loyalty_tier, c.customer_type, c.province,
    c.total_orders||0, c.total_spent||0, c.credit_used||0,
    c.status||'active'
  ]));
  const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = 'customers_' + new Date().toISOString().split('T')[0] + '.csv';
  a.click();
  showToast('Customers exported to CSV.', 'success');
});

document.getElementById('btnImport').addEventListener('click', () => {
  showToast('CSV import coming soon.', 'info');
});

/* ─── URL param: auto-open add modal ─── */
if (new URLSearchParams(location.search).get('new') === '1') {
  document.getElementById('btnAddCustomer').click();
}

/* ─── Toast helper (fallback) ─── */
function showToast(msg, type='success') {
  if (window.LCC?.showToast) { window.LCC.showToast(msg, type); return; }
  const el = document.createElement('div');
  el.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;background:${type==='success'?'#16a34a':type==='warning'?'#d97706':type==='info'?'#2563eb':'#dc2626'};color:#fff;padding:0.75rem 1.25rem;border-radius:8px;font-size:0.875rem;box-shadow:0 4px 16px rgba(0,0,0,.2);animation:fadeIn .2s;`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ─── Event listeners ─── */
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('filterTier').addEventListener('change', applyFilters);
document.getElementById('filterType').addEventListener('change', applyFilters);
document.getElementById('filterProvince').addEventListener('change', applyFilters);

/* ─── Init ─── */
loadCustomers();
