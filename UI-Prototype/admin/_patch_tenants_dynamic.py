"""
Patch tenants.html filter/search/table/pagination IDs and
replace tenants.js with dynamic filtering + pagination JS.
"""
import pathlib, re

BASE = pathlib.Path(__file__).parent

# ─────────────────────────────────────────────────────────────────────────────
# 1. Patch tenants.html
# ─────────────────────────────────────────────────────────────────────────────
tenants_path = BASE / "tenants.html"
html = tenants_path.read_text(encoding="utf-8")

PATCHES = [
    # search input
    ('class="search-input"',
     'class="search-input" id="tenantSearchInput"'),
    # plan filter (first filter-select without an id)
    ('<select class="filter-select">\n          <option value="">All Plans</option>',
     '<select class="filter-select" id="planFilterSelect">\n          <option value="">All Plans</option>'),
    # status filter
    ('<select class="filter-select">\n          <option value="">All Status</option>',
     '<select class="filter-select" id="statusFilterSelect">\n          <option value="">All Status</option>'),
    # clear button
    ('<button class="btn btn-outline btn-sm"><i class="fa-solid fa-filter-circle-xmark"></i> Clear</button>',
     '<button class="btn btn-outline btn-sm" id="clearFiltersBtn"><i class="fa-solid fa-filter-circle-xmark"></i> Clear</button>'),
    # table-count span
    ('<span class="table-count">Showing 8 of 142 tenants</span>',
     '<span class="table-count" id="tableCountLabel">Showing 8 of 142 tenants</span>'),
    # pagination info
    ('<span class="pagination-info">Page 1 of 18 &nbsp;·&nbsp; 142 total records</span>',
     '<span class="pagination-info" id="paginationInfo">Page 1 of 18 &nbsp;·&nbsp; 142 total records</span>'),
    # pagination wrapper
    ('<div class="pagination">',
     '<div class="pagination" id="paginationControls">'),
    # tbody
    ('<tbody>',
     '<tbody id="tenantTableBody">'),
    # stat cards
    ('<div class="stat-value">142</div><div class="stat-label">Total Tenants</div>',
     '<div class="stat-value" id="statTotal">142</div><div class="stat-label">Total Tenants</div>'),
    ('<div class="stat-value text-success">128</div><div class="stat-label">Active</div>',
     '<div class="stat-value text-success" id="statActive">128</div><div class="stat-label">Active</div>'),
    ('<div class="stat-value text-warning">9</div><div class="stat-label">Trial</div>',
     '<div class="stat-value text-warning" id="statTrial">9</div><div class="stat-label">Trial</div>'),
    ('<div class="stat-value text-danger">5</div><div class="stat-label">Suspended</div>',
     '<div class="stat-value text-danger" id="statSuspended">5</div><div class="stat-label">Suspended</div>'),
]

for old, new in PATCHES:
    if old in html:
        html = html.replace(old, new, 1)
        print(f"[OK] Patched: {old[:60]}…")
    else:
        print(f"[SKIP] Not found: {old[:60]}…")

tenants_path.write_text(html, encoding="utf-8")
print("[OK] tenants.html patched with IDs\n")

# ─────────────────────────────────────────────────────────────────────────────
# 2. Replace tenants.js
# ─────────────────────────────────────────────────────────────────────────────
TENANTS_JS = r"""/* ============================================================
   tenants.js — Tenants page: dynamic filtering, pagination,
                View / Edit / Confirm action modals
   ============================================================ */

// ── Dataset (42 tenants) ────────────────────────────────────────────────────
const TENANTS = [
  { id:'T-00142', name:'Keells Super Kandy',           domain:'keells-kandy.lcc.lk',    init:'KS', color:'si-blue',    plan:'ENTERPRISE', status:'ACTIVE',    emp:48, su:7.2, sm:10, rev:184500, date:'2024-01-12' },
  { id:'T-00138', name:'Cargills Food City Gampaha',   domain:'cargills-gampaha.lcc.lk',init:'CF', color:'si-green',   plan:'PRO',        status:'ACTIVE',    emp:24, su:2.2, sm:5,  rev:92000,  date:'2024-02-03' },
  { id:'T-00131', name:'Sampath Retail Nugegoda',      domain:'sampath-retail.lcc.lk',  init:'SR', color:'si-purple',  plan:'PRO',        status:'TRIAL',     emp:12, su:0.9, sm:5,  rev:0,      date:'2025-02-18' },
  { id:'T-00127', name:'Lanka Mart Matara',            domain:'lankamart-matara.lcc.lk',init:'LM', color:'si-orange',  plan:'STARTER',    status:'ACTIVE',    emp:6,  su:0.6, sm:2,  rev:14900,  date:'2024-03-22' },
  { id:'T-00119', name:'Nandini Fashion Colombo 03',   domain:'nandini-fashion.lcc.lk', init:'NF', color:'si-red',     plan:'ENTERPRISE', status:'SUSPENDED', emp:31, su:8.8, sm:10, rev:0,      date:'2023-06-05' },
  { id:'T-00115', name:'Ridgeway Hardware Jaffna',     domain:'ridgeway-jaffna.lcc.lk', init:'RH', color:'si-teal',    plan:'STARTER',    status:'ACTIVE',    emp:8,  su:0.4, sm:2,  rev:14900,  date:'2024-07-11' },
  { id:'T-00108', name:'De Silva Pharmacy Kurunegala', domain:'desilva-pharm.lcc.lk',   init:'DS', color:'si-indigo',  plan:'FREE',       status:'TRIAL',     emp:3,  su:0.1, sm:1,  rev:0,      date:'2026-01-27' },
  { id:'T-00099', name:'Perera Bakery & Café Negombo', domain:'perera-bakery.lcc.lk',   init:'PB', color:'si-pink',    plan:'PRO',        status:'ACTIVE',    emp:16, su:2.7, sm:5,  rev:54900,  date:'2023-09-15' },
  { id:'T-00093', name:'Lak Supermart Batticaloa',     domain:'lak-supermart.lcc.lk',   init:'LS', color:'si-blue',    plan:'PRO',        status:'ACTIVE',    emp:20, su:3.1, sm:5,  rev:78400,  date:'2023-11-02' },
  { id:'T-00087', name:'Sithara Electronics Kandy',    domain:'sithara-elec.lcc.lk',    init:'SE', color:'si-green',   plan:'ENTERPRISE', status:'ACTIVE',    emp:35, su:5.5, sm:10, rev:145000, date:'2023-04-17' },
  { id:'T-00082', name:'Blue Ocean Seafood Negombo',   domain:'blueocean-sea.lcc.lk',   init:'BO', color:'si-teal',    plan:'STARTER',    status:'ACTIVE',    emp:9,  su:0.8, sm:2,  rev:14900,  date:'2024-05-28' },
  { id:'T-00078', name:'Malsha Boutique Colombo 07',   domain:'malsha-boutique.lcc.lk', init:'MB', color:'si-pink',    plan:'STARTER',    status:'SUSPENDED', emp:5,  su:0.5, sm:2,  rev:0,      date:'2024-01-09' },
  { id:'T-00074', name:'Royal Cafe Galle',             domain:'royal-cafe-galle.lcc.lk',init:'RC', color:'si-orange',  plan:'PRO',        status:'ACTIVE',    emp:14, su:1.9, sm:5,  rev:47200,  date:'2024-06-14' },
  { id:'T-00069', name:'Alpha Wholesale Colombo',      domain:'alpha-wholesale.lcc.lk', init:'AW', color:'si-purple',  plan:'ENTERPRISE', status:'ACTIVE',    emp:52, su:9.1, sm:10, rev:230000, date:'2022-12-01' },
  { id:'T-00065', name:'Sunrise Supermart Anuradhapura',domain:'sunrise-super.lcc.lk',  init:'SS', color:'si-blue',    plan:'PRO',        status:'TRIAL',     emp:11, su:0.7, sm:5,  rev:0,      date:'2025-03-05' },
  { id:'T-00060', name:'Vijaya Textiles Colombo 10',   domain:'vijaya-textiles.lcc.lk', init:'VT', color:'si-red',     plan:'STARTER',    status:'ACTIVE',    emp:7,  su:0.9, sm:2,  rev:14900,  date:'2024-08-19' },
  { id:'T-00058', name:'Devi Ayurveda Ratnapura',      domain:'devi-ayur.lcc.lk',        init:'DA', color:'si-green',   plan:'FREE',       status:'TRIAL',     emp:2,  su:0.05,sm:1,  rev:0,      date:'2025-06-10' },
  { id:'T-00054', name:'Tech Hub Solution Centre',     domain:'techub-sol.lcc.lk',       init:'TH', color:'si-indigo',  plan:'STARTER',    status:'ACTIVE',    emp:10, su:1.1, sm:2,  rev:14900,  date:'2024-04-03' },
  { id:'T-00051', name:'Gem Plus Jewellery Colombo',   domain:'gemplus-jwl.lcc.lk',      init:'GP', color:'si-orange',  plan:'ENTERPRISE', status:'ACTIVE',    emp:22, su:4.3, sm:10, rev:115000, date:'2023-07-22' },
  { id:'T-00047', name:'Harbor Fresh Trincomalee',     domain:'harbor-fresh.lcc.lk',     init:'HF', color:'si-teal',    plan:'STARTER',    status:'ACTIVE',    emp:6,  su:0.3, sm:2,  rev:14900,  date:'2024-09-30' },
  { id:'T-00043', name:'Smart Bazaar Vavuniya',        domain:'smart-bazaar.lcc.lk',     init:'SB', color:'si-purple',  plan:'FREE',       status:'ACTIVE',    emp:4,  su:0.2, sm:1,  rev:0,      date:'2025-01-15' },
  { id:'T-00040', name:'Nalini Fashion House',         domain:'nalini-fashion.lcc.lk',   init:'NF', color:'si-pink',    plan:'PRO',        status:'SUSPENDED', emp:18, su:3.8, sm:5,  rev:0,      date:'2023-10-07' },
  { id:'T-00037', name:'Mega Pharmacy Colombo 05',     domain:'mega-pharm.lcc.lk',       init:'MP', color:'si-blue',    plan:'PRO',        status:'ACTIVE',    emp:15, su:2.1, sm:5,  rev:67300,  date:'2023-08-14' },
  { id:'T-00034', name:'Sarath Auto Parts Kandy',      domain:'sarath-auto.lcc.lk',      init:'SA', color:'si-green',   plan:'STARTER',    status:'ACTIVE',    emp:8,  su:0.7, sm:2,  rev:14900,  date:'2024-02-27' },
  { id:'T-00031', name:'Colombo Book Centre',          domain:'colombo-books.lcc.lk',    init:'CB', color:'si-red',     plan:'FREE',       status:'TRIAL',     emp:3,  su:0.15,sm:1,  rev:0,      date:'2025-04-08' },
  { id:'T-00028', name:'Peak Health Club Colombo',     domain:'peak-health.lcc.lk',      init:'PH', color:'si-orange',  plan:'PRO',        status:'ACTIVE',    emp:12, su:1.4, sm:5,  rev:42000,  date:'2023-12-20' },
  { id:'T-00025', name:'Island Spice Restaurant Galle',domain:'island-spice.lcc.lk',     init:'IS', color:'si-teal',    plan:'STARTER',    status:'ACTIVE',    emp:9,  su:0.6, sm:2,  rev:14900,  date:'2024-07-05' },
  { id:'T-00022', name:'Ruchika Homeware Kurunegala',  domain:'ruchika-home.lcc.lk',     init:'RH', color:'si-indigo',  plan:'FREE',       status:'ACTIVE',    emp:2,  su:0.08,sm:1,  rev:0,      date:'2025-02-22' },
  { id:'T-00019', name:'Olympus Hardware Matara',      domain:'olympus-hw.lcc.lk',       init:'OH', color:'si-purple',  plan:'STARTER',    status:'SUSPENDED', emp:5,  su:0.4, sm:2,  rev:0,      date:'2024-03-11' },
  { id:'T-00016', name:'EduTech Pvt Ltd Colombo 03',   domain:'edutech-lk.lcc.lk',       init:'ET', color:'si-blue',    plan:'PRO',        status:'ACTIVE',    emp:20, su:2.8, sm:5,  rev:85000,  date:'2023-05-19' },
  { id:'T-00013', name:'Shankar Medical Jaffna',       domain:'shankar-med.lcc.lk',      init:'SM', color:'si-green',   plan:'ENTERPRISE', status:'ACTIVE',    emp:40, su:6.2, sm:10, rev:161000, date:'2022-09-30' },
  { id:'T-00010', name:'Nippon Electronics Colombo',   domain:'nippon-elec.lcc.lk',      init:'NE', color:'si-red',     plan:'ENTERPRISE', status:'SUSPENDED', emp:28, su:7.9, sm:10, rev:0,      date:'2023-02-14' },
  { id:'T-00008', name:'Yasiru Supermarket Negombo',   domain:'yasiru-super.lcc.lk',     init:'YS', color:'si-pink',    plan:'PRO',        status:'TRIAL',     emp:10, su:1.0, sm:5,  rev:0,      date:'2025-05-29' },
  { id:'T-00006', name:'Green Valley Organics',        domain:'greenvalley.lcc.lk',      init:'GV', color:'si-teal',    plan:'STARTER',    status:'ACTIVE',    emp:6,  su:0.5, sm:2,  rev:14900,  date:'2024-10-17' },
  { id:'T-00004', name:'Diligent Stationery Gampaha',  domain:'diligent-sta.lcc.lk',     init:'DS', color:'si-orange',  plan:'FREE',       status:'ACTIVE',    emp:2,  su:0.06,sm:1,  rev:0,      date:'2025-07-01' },
  { id:'T-00003', name:'Serendib Travels Colombo',     domain:'serendib-tvl.lcc.lk',     init:'ST', color:'si-purple',  plan:'PRO',        status:'ACTIVE',    emp:8,  su:1.2, sm:5,  rev:38900,  date:'2023-11-30' },
  { id:'T-00002', name:'Prime Livestock Anuradhapura', domain:'prime-live.lcc.lk',       init:'PL', color:'si-indigo',  plan:'FREE',       status:'TRIAL',     emp:1,  su:0.04,sm:1,  rev:0,      date:'2025-06-15' },
  { id:'T-00001', name:'Lotus Pharmacy Colombo 06',    domain:'lotus-pharm.lcc.lk',      init:'LP', color:'si-blue',    plan:'ENTERPRISE', status:'ACTIVE',    emp:33, su:5.0, sm:10, rev:126000, date:'2022-08-10' },
  { id:'T-00142A',name:'Crown Bakery Galle',           domain:'crown-bakery.lcc.lk',     init:'CB', color:'si-pink',    plan:'STARTER',    status:'ACTIVE',    emp:7,  su:0.6, sm:2,  rev:14900,  date:'2024-04-25' },
  { id:'T-00141', name:'Sunitha Textiles Badulla',     domain:'sunitha-txt.lcc.lk',      init:'ST', color:'si-green',   plan:'STARTER',    status:'SUSPENDED', emp:4,  su:0.3, sm:2,  rev:0,      date:'2024-08-08' },
  { id:'T-00140', name:'Pacific Auto Colombo 15',      domain:'pacific-auto.lcc.lk',     init:'PA', color:'si-red',     plan:'PRO',        status:'ACTIVE',    emp:17, su:2.4, sm:5,  rev:71200,  date:'2023-09-01' },
  { id:'T-00139', name:'Zoom Digital Kandy',           domain:'zoom-digital.lcc.lk',     init:'ZD', color:'si-indigo',  plan:'ENTERPRISE', status:'ACTIVE',    emp:44, su:8.3, sm:10, rev:198000, date:'2022-11-12' },
];

const PAGE_SIZE = 10;
let currentPage = 1;

// ── Filter state ────────────────────────────────────────────────────────────
function getFiltered() {
  const q      = (document.getElementById('tenantSearchInput')?.value || '').toLowerCase();
  const plan   = (document.getElementById('planFilterSelect')?.value  || '').toUpperCase();
  const status = (document.getElementById('statusFilterSelect')?.value|| '').toUpperCase();

  return TENANTS.filter(t => {
    const matchQ      = !q || t.name.toLowerCase().includes(q) || t.id.toLowerCase().includes(q) || t.domain.toLowerCase().includes(q);
    const matchPlan   = !plan   || t.plan   === plan;
    const matchStatus = !status || t.status === status;
    return matchQ && matchPlan && matchStatus;
  });
}

// ── Rendering ───────────────────────────────────────────────────────────────
function planBadge(p) {
  const map = { FREE:'badge-free', STARTER:'badge-starter', PRO:'badge-pro', ENTERPRISE:'badge-enterprise' };
  const lbl = { FREE:'Free', STARTER:'Starter', PRO:'Pro', ENTERPRISE:'Enterprise' };
  return `<span class="badge ${map[p] || ''}">${lbl[p] || p}</span>`;
}

function statusBadge(s) {
  const map = { ACTIVE:'badge-active', TRIAL:'badge-trial', SUSPENDED:'badge-suspended' };
  const lbl = { ACTIVE:'Active', TRIAL:'Trial', SUSPENDED:'Suspended' };
  return `<span class="badge ${map[s] || ''}">${lbl[s] || s}</span>`;
}

function storageBar(used, max) {
  const pct = Math.round((used / max) * 100);
  const warn = pct >= 80 ? ' warn' : '';
  return `<div class="storage-bar"><div class="storage-fill${warn}" style="width:${pct}%"></div></div>`
       + `<span class="storage-text">${used} / ${max} GB</span>`;
}

function fmtDate(iso) {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${String(d.getDate()).padStart(2,'0')} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function fmtLKR(n) {
  return n === 0 ? '₨ 0' : '₨ ' + n.toLocaleString('en-LK');
}

function actionBtns(t) {
  const suspendBtn = t.status === 'SUSPENDED'
    ? `<button class="icon-btn-sm text-success" title="Activate"><i class="fa-solid fa-circle-check"></i></button>`
    : `<button class="icon-btn-sm text-danger" title="Suspend"><i class="fa-solid fa-ban"></i></button>`;
  return `<div class="action-btns">
    <button class="icon-btn-sm" title="View"><i class="fa-solid fa-eye"></i></button>
    <button class="icon-btn-sm" title="Edit"><i class="fa-solid fa-pen"></i></button>
    ${suspendBtn}
  </div>`;
}

function buildRow(t) {
  return `<tr data-tenant-id="${t.id}">
    <td><input type="checkbox"/></td>
    <td><div class="store-cell"><div class="store-icon ${t.color}">${t.init}</div><div>
      <div class="store-name">${escH(t.name)}</div>
      <div class="store-domain">${escH(t.domain)}</div>
    </div></div></td>
    <td><code class="tenant-id">${t.id}</code></td>
    <td>${planBadge(t.plan)}</td>
    <td>${statusBadge(t.status)}</td>
    <td>${t.emp}</td>
    <td>${storageBar(t.su, t.sm)}</td>
    <td class="text-right fw-600">${fmtLKR(t.rev)}</td>
    <td class="text-muted">${fmtDate(t.date)}</td>
    <td>${actionBtns(t)}</td>
  </tr>`;
}

function escH(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function renderPagination(total, page, pagesEl) {
  if (!pagesEl) return;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const pages = [];

  // Build page number windows
  function addPage(n) {
    if (n < 1 || n > totalPages) return;
    if (pages.at(-1) === '…' && pages.at(-2) === n - 1) return; // avoid dup
    const last = pages.at(-1);
    if (typeof last === 'number' && n > last + 1) pages.push('…');
    pages.push(n);
  }
  addPage(1);
  for (let i = Math.max(2, page - 2); i <= Math.min(totalPages - 1, page + 2); i++) addPage(i);
  if (totalPages > 1) addPage(totalPages);

  let html = `<button class="page-btn" data-action="prev" ${page <= 1 ? 'disabled' : ''}>
    <i class="fa-solid fa-chevron-left"></i></button>`;

  pages.forEach(p => {
    if (p === '…') {
      html += `<span class="page-ellipsis">…</span>`;
    } else {
      html += `<button class="page-btn ${p === page ? 'active' : ''}" data-page="${p}">${p}</button>`;
    }
  });

  html += `<button class="page-btn" data-action="next" ${page >= totalPages ? 'disabled' : ''}>
    <i class="fa-solid fa-chevron-right"></i></button>`;

  pagesEl.innerHTML = html;
}

function renderTable(data, page) {
  const tbody       = document.getElementById('tenantTableBody');
  const countLabel  = document.getElementById('tableCountLabel');
  const pageInfo    = document.getElementById('paginationInfo');
  const pagination  = document.getElementById('paginationControls');

  const total       = data.length;
  const totalPages  = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage    = Math.min(Math.max(1, page), totalPages);
  currentPage       = safePage;

  const start = (safePage - 1) * PAGE_SIZE;
  const end   = Math.min(start + PAGE_SIZE, total);
  const slice = data.slice(start, end);

  if (tbody) tbody.innerHTML = slice.map(buildRow).join('');

  if (countLabel) {
    countLabel.textContent = total === 0
      ? 'No tenants found'
      : `Showing ${start + 1}–${end} of ${total} tenant${total !== 1 ? 's' : ''}`;
  }

  if (pageInfo) {
    pageInfo.textContent = `Page ${safePage} of ${totalPages} · ${total} total record${total !== 1 ? 's' : ''}`;
  }

  renderPagination(total, safePage, pagination);
  updateStats();
}

// ── Stats summary ────────────────────────────────────────────────────────────
function updateStats() {
  const filtered = getFiltered();
  const active    = filtered.filter(t => t.status === 'ACTIVE').length;
  const trial     = filtered.filter(t => t.status === 'TRIAL').length;
  const suspended = filtered.filter(t => t.status === 'SUSPENDED').length;
  setText('statTotal',     String(filtered.length));
  setText('statActive',    String(active));
  setText('statTrial',     String(trial));
  setText('statSuspended', String(suspended));
}

function applyFilters() {
  const data = getFiltered();
  renderTable(data, 1);
}

// ── Pagination click handler ─────────────────────────────────────────────────
document.getElementById('paginationControls')?.addEventListener('click', e => {
  const btn = e.target.closest('[data-page],[data-action]');
  if (!btn) return;
  const data = getFiltered();
  const totalPages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));

  if (btn.dataset.action === 'prev') renderTable(data, currentPage - 1);
  else if (btn.dataset.action === 'next') renderTable(data, currentPage + 1);
  else renderTable(data, parseInt(btn.dataset.page, 10));
});

// ── Filter event listeners ───────────────────────────────────────────────────
document.getElementById('tenantSearchInput')?.addEventListener('input', applyFilters);
document.getElementById('planFilterSelect')?.addEventListener('change', applyFilters);
document.getElementById('statusFilterSelect')?.addEventListener('change', applyFilters);
document.getElementById('clearFiltersBtn')?.addEventListener('click', () => {
  const s = document.getElementById('tenantSearchInput');
  const p = document.getElementById('planFilterSelect');
  const st = document.getElementById('statusFilterSelect');
  if (s) s.value = '';
  if (p) p.value = '';
  if (st) st.value = '';
  applyFilters();
});

// ── "Add Tenant to table" integration ───────────────────────────────────────
// Override addTenantToTable from admin.js to push into TENANTS array
window.TENANTS_push = function(data) {
  const id = 'T-' + String(Date.now()).slice(-5);
  const init = data.name.split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase();
  const colors = ['si-blue','si-green','si-purple','si-orange','si-teal','si-indigo','si-pink','si-red'];
  const color = colors[TENANTS.length % colors.length];
  const planMap = { free:'FREE', starter:'STARTER', pro:'PRO', enterprise:'ENTERPRISE' };
  TENANTS.unshift({
    id, name: data.name, domain: (data.name.toLowerCase().replace(/\s+/g,'-').slice(0,20)) + '.lcc.lk',
    init, color,
    plan: planMap[data.plan?.toLowerCase()] || 'PRO',
    status: data.status?.toUpperCase() || 'ACTIVE',
    emp: 1, su: 0, sm: 1, rev: 0,
    date: new Date().toISOString().slice(0, 10),
  });
  renderTable(getFiltered(), 1);
};

// ── View / Edit / Confirm modal logic ────────────────────────────────────────
function rowData(row) {
  // Find tenant in TENANTS array by id
  const id = row.dataset.tenantId;
  const t = TENANTS.find(x => x.id === id);
  if (t) return t;
  // Fallback: read from DOM
  return {
    name:    row.querySelector('.store-name')?.textContent.trim()  || '—',
    domain:  row.querySelector('.store-domain')?.textContent.trim() || '—',
    id:      row.querySelector('.tenant-id')?.textContent.trim()   || '—',
    plan:    row.cells[3]?.querySelector('.badge')?.textContent.trim() || '—',
    status:  row.cells[4]?.querySelector('.badge')?.textContent.trim() || '—',
    emp:     row.cells[5]?.textContent.trim() || '—',
    su:      '—', sm: '—', rev: '—',
    date:    row.cells[8]?.textContent.trim() || '—',
  };
}

function populateView(t) {
  setTextEl('viewTenantNameTitle',     t.name);
  setTextEl('viewTenantDomainSubtitle',t.domain);
  setTextEl('viewTenantId',            t.id);
  setTextEl('viewTenantRegDate',       typeof t.date === 'string' && t.date.includes('-') ? fmtDate(t.date) : t.date);
  setTextEl('viewTenantEmployees',     String(t.emp));
  setTextEl('viewTenantStorage',       `${t.su} / ${t.sm} GB`);
  setTextEl('viewTenantRevenue',       fmtLKR(t.rev));
  setTextEl('viewTenantDomainField',   t.domain);

  const planEl = document.getElementById('viewTenantPlan');
  if (planEl) planEl.innerHTML = planBadge(t.plan);

  const statusEl = document.getElementById('viewTenantStatus');
  if (statusEl) statusEl.innerHTML = statusBadge(t.status);
}

function populateEdit(t) {
  setTextEl('editTenantSubtitle', t.domain);
  setValEl('editName',  t.name);
  setValEl('editEmail', '');
  setValEl('editPhone', '');
  const planMap2 = { FREE:'FREE', STARTER:'STARTER', PRO:'PRO', ENTERPRISE:'ENTERPRISE' };
  setSelectEl('editPlan',   planMap2[t.plan]   || 'PRO');
  setSelectEl('editStatus', t.status || 'ACTIVE');
}

let _activeTenant = null;
let _activeRow    = null;
let _confirmCb    = null;

document.getElementById('viewToEditBtn')?.addEventListener('click', () => {
  if (_activeTenant) {
    populateEdit(_activeTenant);
    if (typeof closeModal === 'function') closeModal('viewTenantModal');
    if (typeof openModal  === 'function') openModal('editTenantModal');
  }
});

document.getElementById('submitEditTenant')?.addEventListener('click', () => {
  const nameInput = document.getElementById('editName');
  if (!nameInput?.value.trim()) {
    nameInput?.classList.add('input-error');
    return;
  }
  nameInput?.classList.remove('input-error');

  if (_activeTenant) {
    _activeTenant.name = nameInput.value.trim();
    const planSel   = document.getElementById('editPlan');
    const statusSel = document.getElementById('editStatus');
    if (planSel)   _activeTenant.plan   = planSel.value;
    if (statusSel) _activeTenant.status = statusSel.value;
    renderTable(getFiltered(), currentPage);
  }

  if (typeof closeModal === 'function') closeModal('editTenantModal');
  showTenantsToast('Tenant updated successfully.');
  _activeTenant = null;
});

document.getElementById('confirmModalBtn')?.addEventListener('click', () => {
  if (typeof _confirmCb === 'function') _confirmCb();
  if (typeof closeModal === 'function') closeModal('confirmActionModal');
  _confirmCb = null;
});

function setupConfirm({ title, msg, btnLabel, btnClass, icon, cb }) {
  setTextEl('confirmModalTitle', title);
  setTextEl('confirmModalMsg',   msg);
  const btn = document.getElementById('confirmModalBtn');
  if (btn) { btn.textContent = btnLabel; btn.className = `btn ${btnClass}`; }
  const iconEl = document.getElementById('confirmModalIcon');
  if (iconEl) iconEl.innerHTML = `<i class="fa-solid ${icon}"></i>`;
  _confirmCb = cb;
}

// Table row action delegation
document.getElementById('tenantTableBody')?.addEventListener('click', e => {
  const row       = e.target.closest('tr');
  if (!row) return;

  const viewBtn    = e.target.closest('[title="View"]');
  const editBtn    = e.target.closest('[title="Edit"]');
  const suspendBtn = e.target.closest('[title="Suspend"]');
  const activateBtn= e.target.closest('[title="Activate"]');

  if (viewBtn) {
    _activeTenant = rowData(row);
    _activeRow    = row;
    populateView(_activeTenant);
    if (typeof openModal === 'function') openModal('viewTenantModal');
  }
  if (editBtn) {
    _activeTenant = rowData(row);
    _activeRow    = row;
    populateEdit(_activeTenant);
    if (typeof openModal === 'function') openModal('editTenantModal');
  }
  if (suspendBtn) {
    const t = rowData(row);
    setupConfirm({
      title: 'Suspend Tenant', icon: 'fa-ban',
      msg: `Suspend "${t.name}"? They lose platform access immediately.`,
      btnLabel: 'Suspend', btnClass: 'btn-danger',
      cb: () => {
        t.status = 'SUSPENDED';
        renderTable(getFiltered(), currentPage);
        showTenantsToast(`"${t.name}" suspended.`, 'warn');
      },
    });
    if (typeof openModal === 'function') openModal('confirmActionModal');
  }
  if (activateBtn) {
    const t = rowData(row);
    setupConfirm({
      title: 'Activate Tenant', icon: 'fa-circle-check',
      msg: `Re-activate "${t.name}"? They will regain full access.`,
      btnLabel: 'Activate', btnClass: 'btn-success',
      cb: () => {
        t.status = 'ACTIVE';
        renderTable(getFiltered(), currentPage);
        showTenantsToast(`"${t.name}" activated.`);
      },
    });
    if (typeof openModal === 'function') openModal('confirmActionModal');
  }
});

// ── Utilities ─────────────────────────────────────────────────────────────────
function setTextEl(id, val) { const el = document.getElementById(id); if (el) el.textContent = val; }
function setValEl(id, val)  { const el = document.getElementById(id); if (el) el.value = val; }
function setSelectEl(id, val){ const el = document.getElementById(id); if (el) el.value = val; }
function setText(id, val)   { setTextEl(id, val); }

function showTenantsToast(msg, type = 'success') {
  const colors = { success: '#16a34a', warn: '#d97706', error: '#dc2626' };
  const t = Object.assign(document.createElement('div'), { textContent: msg });
  Object.assign(t.style, {
    position: 'fixed', bottom: '24px', right: '24px',
    padding: '12px 20px', borderRadius: '8px', fontSize: '14px',
    fontWeight: '500', zIndex: '9999',
    background: colors[type] || colors.success,
    color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
  });
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ── Initial render ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  renderTable(TENANTS, 1);
});
"""

js_path = BASE / "tenants.js"
js_path.write_text(TENANTS_JS, encoding="utf-8")
print("[OK] tenants.js rewritten with 42 tenants, dynamic filtering + pagination")

print("\n=== Done ===")
