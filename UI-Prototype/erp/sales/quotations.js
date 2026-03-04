/* Page-specific scripts — quotations.html */

// ── Helpers ──────────────────────────────────────────────────────────────────

function fmtLKR(n) {
  if (typeof formatLKR === 'function') return formatLKR(n);
  return '₨ ' + Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function fmtDateTime(d) {
  if (!d) return '—';
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) +
    ' ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function initials(name) {
  if (!name) return '?';
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();
}

// ── Status Config ─────────────────────────────────────────────────────────────

const QUOTE_STATUS = {
  draft:    { label: 'Draft',    cls: 'badge-pending',    icon: 'fa-pen' },
  sent:     { label: 'Sent',     cls: 'badge-processing', icon: 'fa-paper-plane' },
  accepted: { label: 'Accepted', cls: 'badge-delivered',  icon: 'fa-circle-check' },
  rejected: { label: 'Rejected', cls: 'badge-cancelled',  icon: 'fa-ban' },
  expired:  { label: 'Expired',  cls: 'badge-returned',   icon: 'fa-clock' },
};

function statusBadgeHtml(status) {
  const s = QUOTE_STATUS[status] || { label: status, cls: 'badge-pending', icon: 'fa-circle' };
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

// ── State ─────────────────────────────────────────────────────────────────────

let allQuotations = [];
let filteredItems = [];
let currentTab = 'all';
let currentPage = 1;
const PAGE_SIZE = 15;
let sortKey = 'created';
let sortDir = 'desc';

// ── Load Data ─────────────────────────────────────────────────────────────────

function loadData(url) {
  return fetch(url).then(r => r.json()).catch(() => ({}));
}

async function init() {
  try {
    const data = await loadData('../../data/quotations.json');
    allQuotations = data?.quotations || [];
    updateTabCounts();
    renderKPICards();
    applyFilters();
    updateSubtitle();
  } catch (e) {
    console.error('Failed to load quotations data', e);
    document.getElementById('quotationsTableBody').innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i>
          <div class="empty-state-title">Failed to load quotations</div>
          <div class="empty-state-sub">Check your data/quotations.json file</div>
        </div>
      </td></tr>`;
  }
}

// ── KPI Cards ─────────────────────────────────────────────────────────────────

function renderKPICards() {
  const total        = allQuotations.length;
  const acceptedList = allQuotations.filter(q => q.status === 'accepted');
  const sentList     = allQuotations.filter(q => q.status === 'sent');
  const pendingList  = allQuotations.filter(q => ['sent', 'draft'].includes(q.status));
  const convRate     = sentList.length > 0
    ? Math.round((acceptedList.length / (acceptedList.length + allQuotations.filter(q => q.status === 'rejected').length || 1)) * 100)
    : 0;

  const cards = [
    {
      iconClass: 'indigo',
      icon: 'fa-solid fa-file-lines',
      value: total.toString(),
      label: 'Total Quotes',
      sub: 'All time',
      change: `${sentList.length} currently sent`,
      changeType: 'up',
      indigoStyle: true,
    },
    {
      iconClass: 'green',
      icon: 'fa-solid fa-circle-check',
      value: acceptedList.length.toString(),
      label: 'Accepted',
      sub: 'Converted to orders',
      change: typeof formatLKRShort === 'function'
        ? formatLKRShort(acceptedList.reduce((s, q) => s + (q.total || 0), 0))
        : fmtLKR(acceptedList.reduce((s, q) => s + (q.total || 0), 0)),
      changeType: 'up',
    },
    {
      iconClass: 'amber',
      icon: 'fa-solid fa-clock',
      value: pendingList.length.toString(),
      label: 'Pending',
      sub: 'Sent + Draft',
      change: `${sentList.length} awaiting response`,
      changeType: pendingList.length > 3 ? 'down' : 'up',
    },
    {
      iconClass: 'orange',
      icon: 'fa-solid fa-chart-line',
      value: convRate + '%',
      label: 'Conversion Rate',
      sub: 'Accepted vs. responded',
      change: `${acceptedList.length} of ${acceptedList.length + allQuotations.filter(q => q.status === 'rejected').length} responded`,
      changeType: convRate >= 50 ? 'up' : 'down',
    },
  ];

  document.getElementById('kpiGrid').innerHTML = cards.map(c => {
    const iconStyle  = c.indigoStyle ? ' style="background:#e0e7ff;"' : '';
    const iStyle     = c.indigoStyle ? ' style="color:#4f46e5;"' : '';
    return `
    <div class="kpi-card">
      <div class="kpi-header">
        <div class="kpi-icon ${c.indigoStyle ? '' : c.iconClass}"${iconStyle}><i class="${c.icon}"${iStyle}></i></div>
        <span class="kpi-badge ${c.changeType}">
          ${c.changeType === 'up'
            ? '<i class="fa-solid fa-arrow-trend-up"></i>'
            : '<i class="fa-solid fa-arrow-trend-down"></i>'}
          ${c.change}
        </span>
      </div>
      <div>
        <div class="kpi-value">${c.value}</div>
        <div class="kpi-label">${c.label}</div>
        <div class="kpi-sub">${c.sub}</div>
      </div>
    </div>`;
  }).join('');
}

// ── Tab Counts ────────────────────────────────────────────────────────────────

function updateTabCounts() {
  const tabs = ['all', 'sent', 'accepted', 'rejected', 'expired', 'draft'];
  tabs.forEach(tab => {
    const count = tab === 'all' ? allQuotations.length : allQuotations.filter(q => q.status === tab).length;
    const el = document.getElementById('tabCount-' + tab);
    if (el) el.textContent = count;
  });
}

// ── Tab Switching ─────────────────────────────────────────────────────────────

function switchTab(tab) {
  document.querySelectorAll('#statusTabs .order-tab').forEach(t => t.classList.remove('active'));
  const activeTab = document.querySelector(`#statusTabs [data-tab="${tab}"]`);
  if (activeTab) activeTab.classList.add('active');
  currentTab = tab;
  currentPage = 1;
  applyFilters();
}

// ── Filters & Sorting ─────────────────────────────────────────────────────────

function applyFilters() {
  const search = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();

  filteredItems = allQuotations.filter(q => {
    if (currentTab !== 'all' && q.status !== currentTab) return false;
    if (search) {
      const haystack = ((q.id || '') + (q.customer_name || '')).toLowerCase();
      if (!haystack.includes(search)) return false;
    }
    return true;
  });

  // Sort
  filteredItems.sort((a, b) => {
    let av, bv;
    if (sortKey === 'id') {
      av = a.id || ''; bv = b.id || '';
      return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
    }
    if (sortKey === 'total') { av = a.total || 0; bv = b.total || 0; }
    else { av = new Date(a.created_at || 0).getTime(); bv = new Date(b.created_at || 0).getTime(); }
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  currentPage = 1;
  renderTable();
  updateSubtitle();
}

function sortBy(key) {
  if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  else { sortKey = key; sortDir = 'desc'; }
  applyFilters();
}

function handleSearch() {
  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(applyFilters, 220);
}

function clearFilters() {
  const inp = document.getElementById('searchInput');
  if (inp) inp.value = '';
  applyFilters();
}

// ── Render Table ──────────────────────────────────────────────────────────────

function renderTable() {
  const start    = (currentPage - 1) * PAGE_SIZE;
  const pageData = filteredItems.slice(start, start + PAGE_SIZE);
  const tbody    = document.getElementById('quotationsTableBody');

  if (!pageData.length) {
    tbody.innerHTML = `
      <tr><td colspan="7">
        <div class="empty-state">
          <i class="fa-solid fa-file-lines"></i>
          <div class="empty-state-title">No quotations found</div>
          <div class="empty-state-sub">Try adjusting your filters or create a new quotation</div>
        </div>
      </td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = pageData.map(q => {
    const isExpiringSoon = q.status === 'sent' && q.valid_until && new Date(q.valid_until) <= new Date(Date.now() + 5 * 86400000);
    const validHtml = q.valid_until
      ? `<span style="${isExpiringSoon ? 'color:#d97706;font-weight:600;' : ''}">${fmtDate(q.valid_until)}</span>`
      : '—';

    return `
    <tr>
      <td>
        <span class="order-id-link" style="cursor:default;">${q.id}</span>
        <div style="font-size:0.7rem;color:var(--color-neutral-400);margin-top:1px;">${fmtDate(q.created_at)}</div>
      </td>
      <td>
        <div class="customer-cell">
          <div class="cust-avatar-initials">${initials(q.customer_name)}</div>
          <div>
            <div class="cust-name">${q.customer_name || '—'}</div>
            <div style="font-size:0.75rem;color:var(--color-neutral-400);">${q.customer_phone || ''}</div>
          </div>
        </div>
      </td>
      <td style="white-space:nowrap;">${fmtDateTime(q.created_at)}</td>
      <td style="white-space:nowrap;">${validHtml}</td>
      <td><span class="order-total">${fmtLKR(q.total)}</span></td>
      <td>${statusBadgeHtml(q.status)}</td>
      <td onclick="event.stopPropagation()">
        <div class="actions-cell" style="justify-content:flex-end;">
          <div class="three-dot-wrap">
            <button class="three-dot-btn" onclick="toggleMenu('menu-${q.id}', event)">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="three-dot-menu" id="menu-${q.id}">
              <a href="#" onclick="event.preventDefault();viewQuote('${q.id}')">
                <i class="fa-solid fa-eye" style="width:14px;color:#1d4ed8;"></i> View Quote
              </a>
              <a href="#" onclick="event.preventDefault();convertToOrder('${q.id}')">
                <i class="fa-solid fa-cart-plus" style="width:14px;color:#16a34a;"></i> Convert to Order
              </a>
              <a href="#" onclick="event.preventDefault();sendToCustomer('${q.id}')">
                <i class="fa-solid fa-paper-plane" style="width:14px;color:#4f46e5;"></i> Send to Customer
              </a>
              <a href="#" onclick="event.preventDefault();rejectQuote('${q.id}')" style="${q.status === 'rejected' ? 'opacity:0.4;pointer-events:none;' : ''}color:#dc2626;">
                <i class="fa-solid fa-ban" style="width:14px;color:#dc2626;"></i> Reject
              </a>
              <a href="#" onclick="event.preventDefault();duplicateQuote('${q.id}')">
                <i class="fa-solid fa-copy" style="width:14px;color:#6b7280;"></i> Duplicate
              </a>
            </div>
          </div>
        </div>
      </td>
    </tr>`;
  }).join('');

  renderPagination();
}

// ── Pagination ────────────────────────────────────────────────────────────────

function renderPagination() {
  const total      = filteredItems.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start      = (currentPage - 1) * PAGE_SIZE + 1;
  const end        = Math.min(currentPage * PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent =
    total ? `Showing ${start}–${end} of ${total} quotations` : 'No quotations found';

  const btns = document.getElementById('paginationBtns');
  let html = `<button class="page-btn" onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`;

  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 7 && p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 1) {
      if (p === 3 || p === totalPages - 2) html += `<span style="padding:0 6px;color:var(--color-neutral-400);align-self:center;">…</span>`;
      continue;
    }
    html += `<button class="page-btn ${p === currentPage ? 'active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }

  html += `<button class="page-btn" onclick="goPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`;
  btns.innerHTML = html;
}

function goPage(p) {
  const totalPages = Math.ceil(filteredItems.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTable();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Subtitle ──────────────────────────────────────────────────────────────────

function updateSubtitle() {
  const el = document.getElementById('pageSubtitle');
  if (!el) return;
  const total    = allQuotations.length;
  const accepted = allQuotations.filter(q => q.status === 'accepted').length;
  const pending  = allQuotations.filter(q => ['sent', 'draft'].includes(q.status)).length;
  let text = `${total} quotation${total !== 1 ? 's' : ''} total`;
  if (pending > 0) text += ` · ${pending} pending`;
  if (accepted > 0) text += ` · ${accepted} accepted`;
  el.textContent = text;
}

// ── Three-dot Menu ────────────────────────────────────────────────────────────

function toggleMenu(id, e) {
  e.stopPropagation();
  document.querySelectorAll('.three-dot-menu.open').forEach(m => {
    if (m.id !== id) m.classList.remove('open');
  });
  const menu = document.getElementById(id);
  if (menu) menu.classList.toggle('open');
}

document.addEventListener('click', () => {
  document.querySelectorAll('.three-dot-menu.open').forEach(m => m.classList.remove('open'));
});

// ── Actions ───────────────────────────────────────────────────────────────────

function viewQuote(id) {
  if (typeof showToast === 'function') showToast('Quote preview coming soon', 'info');
}

function convertToOrder(id) {
  if (typeof showToast === 'function') showToast('Convert to order coming soon', 'info');
}

function sendToCustomer(id) {
  if (typeof showToast === 'function') showToast('Send to customer coming soon', 'info');
}

function rejectQuote(id) {
  const q = allQuotations.find(item => item.id === id);
  if (!q || q.status === 'rejected') return;
  q.status = 'rejected';
  updateTabCounts();
  renderKPICards();
  applyFilters();
  if (typeof showToast === 'function') showToast(`Quotation ${id} marked as rejected`, 'success');
}

function duplicateQuote(id) {
  if (typeof showToast === 'function') showToast('Duplicate quotation coming soon', 'info');
}

function exportQuotations() {
  if (typeof showToast === 'function') showToast('Export coming soon', 'info');
}

function newQuotation() {
  if (typeof showToast === 'function') showToast('Quotation creation coming soon', 'info');
}

// ── Boot ──────────────────────────────────────────────────────────────────────
init();
