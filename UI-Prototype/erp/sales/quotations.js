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

let _viewQuoteId        = null;
let _convertToOrderId   = null;
let _sendQuoteId        = null;
let _rejectQuoteId      = null;
let _duplicateQuoteId   = null;

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

// ── View Quote Modal ──────────────────────────────────────────────────────────

function viewQuote(id) {
  const q = allQuotations.find(i => i.id === id);
  if (!q) return;
  _viewQuoteId = id;

  const sub = document.getElementById('viewQuoteSubtitle');
  if (sub) sub.textContent = `${q.id} · ${fmtDate(q.created_at)} · Valid until ${fmtDate(q.valid_until)}`;

  const itemsHTML = (q.items || []).map(item => `
    <tr>
      <td style="padding:0.625rem 0.75rem;font-size:0.8125rem;">${item.name}${item.variant ? `<div style="font-size:0.7rem;color:var(--color-neutral-400);">${item.variant}</div>` : ''}</td>
      <td style="padding:0.625rem 0.75rem;text-align:center;font-size:0.8125rem;">${item.qty}</td>
      <td style="padding:0.625rem 0.75rem;text-align:right;font-size:0.8125rem;">${fmtLKR(item.unit_price)}</td>
      <td style="padding:0.625rem 0.75rem;text-align:right;font-size:0.8125rem;font-weight:600;">${fmtLKR(item.line_total)}</td>
    </tr>
  `).join('');

  const body = document.getElementById('viewQuoteBody');
  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:1px solid var(--color-neutral-200);">
      <div>
        <div style="font-size:1.25rem;font-weight:700;color:var(--color-neutral-900);">${q.id}</div>
        <div style="margin-top:0.25rem;">${statusBadgeHtml(q.status)}</div>
      </div>
      <div style="text-align:right;font-size:0.8125rem;color:var(--color-neutral-600);">
        <div><span style="font-weight:600;">Created:</span> ${fmtDate(q.created_at)}</div>
        ${q.valid_until ? `<div><span style="font-weight:600;">Valid Until:</span> ${fmtDate(q.valid_until)}</div>` : ''}
        ${q.reference ? `<div><span style="font-weight:600;">PO Ref:</span> ${q.reference}</div>` : ''}
      </div>
    </div>

    <div style="margin-bottom:1.25rem;">
      <div style="font-size:0.75rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Quote For</div>
      <div style="font-weight:600;font-size:0.9375rem;color:var(--color-neutral-900);">${q.customer_name || '—'}</div>
      <div style="font-size:0.8125rem;color:var(--color-neutral-500);">${q.customer_phone || ''}</div>
    </div>

    <div style="border:1px solid var(--color-neutral-200);border-radius:8px;overflow:hidden;margin-bottom:1.25rem;">
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:var(--color-neutral-50);">
            <th style="padding:0.625rem 0.75rem;text-align:left;font-size:0.75rem;font-weight:600;color:var(--color-neutral-500);border-bottom:1px solid var(--color-neutral-200);">Item</th>
            <th style="padding:0.625rem 0.75rem;text-align:center;font-size:0.75rem;font-weight:600;color:var(--color-neutral-500);border-bottom:1px solid var(--color-neutral-200);">Qty</th>
            <th style="padding:0.625rem 0.75rem;text-align:right;font-size:0.75rem;font-weight:600;color:var(--color-neutral-500);border-bottom:1px solid var(--color-neutral-200);">Unit Price</th>
            <th style="padding:0.625rem 0.75rem;text-align:right;font-size:0.75rem;font-weight:600;color:var(--color-neutral-500);border-bottom:1px solid var(--color-neutral-200);">Total</th>
          </tr>
        </thead>
        <tbody>${itemsHTML}</tbody>
      </table>
    </div>

    <div style="margin-left:auto;max-width:280px;margin-bottom:1rem;">
      <div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem;"><span style="color:var(--color-neutral-500);">Subtotal</span><span style="font-weight:500;">${fmtLKR(q.subtotal)}</span></div>
      ${q.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem;"><span style="color:var(--color-neutral-500);">Discount</span><span style="font-weight:500;color:#16a34a;">– ${fmtLKR(q.discount)}</span></div>` : ''}
      ${q.shipping > 0 ? `<div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem;"><span style="color:var(--color-neutral-500);">Shipping</span><span style="font-weight:500;">${fmtLKR(q.shipping)}</span></div>` : ''}
      ${q.tax > 0 ? `<div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem;"><span style="color:var(--color-neutral-500);">Tax (VAT)</span><span style="font-weight:500;">${fmtLKR(q.tax)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:0.5rem 0;font-size:0.9375rem;font-weight:700;border-top:2px solid var(--color-neutral-900);margin-top:0.25rem;"><span>Total</span><span style="color:#4f46e5;">${fmtLKR(q.total)}</span></div>
    </div>

    ${q.notes ? `<div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:8px;padding:0.75rem 1rem;font-size:0.8125rem;color:var(--color-neutral-600);"><span style="font-weight:600;">Notes / Terms:</span> ${q.notes}</div>` : ''}
  `;

  document.getElementById('viewQuoteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeViewQuoteModal() {
  document.getElementById('viewQuoteModal').classList.remove('open');
  document.body.style.overflow = '';
  _viewQuoteId = null;
}

function printQuoteModal() {
  const q = allQuotations.find(i => i.id === _viewQuoteId);
  if (!q) return;
  const w = window.open('', '_blank', 'width=700,height=800');
  const body = document.getElementById('viewQuoteBody')?.innerHTML || '';
  w.document.write(`<!DOCTYPE html><html><head><title>${q.id}</title><style>body{font-family:Inter,sans-serif;padding:2rem;max-width:680px;margin:0 auto;}@media print{body{padding:0;}}</style></head><body><h2 style="margin-bottom:1rem;">${q.id}</h2>${body}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

function convertToOrderFromView() {
  closeViewQuoteModal();
  if (_viewQuoteId) convertToOrder(_viewQuoteId);
}

// ── Convert to Order Modal ────────────────────────────────────────────────────

function convertToOrder(id) {
  const q = allQuotations.find(i => i.id === id);
  if (!q) return;
  if (q.status === 'rejected' || q.status === 'expired') {
    if (window.Toast) Toast.warning('Cannot Convert', `This quotation has status "${q.status}" and cannot be converted.`);
    else if (typeof showToast === 'function') showToast(`Cannot convert a ${q.status} quotation`, 'warning');
    return;
  }
  _convertToOrderId = id;

  document.getElementById('ctoQuoteId').textContent     = q.id;
  document.getElementById('ctoCustomerName').textContent = q.customer_name || '—';
  document.getElementById('ctoFulfillment').value       = 'delivery';
  document.getElementById('ctoAddress').value           = '';
  document.getElementById('ctoNotes').value             = q.notes || '';
  document.getElementById('ctoAddressGroup').style.display = '';

  document.getElementById('convertToOrderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeConvertToOrderModal() {
  document.getElementById('convertToOrderModal').classList.remove('open');
  document.body.style.overflow = '';
  _convertToOrderId = null;
}

function confirmConvertToOrder() {
  const q = allQuotations.find(i => i.id === _convertToOrderId);
  if (!q) return;

  q.status = 'accepted';

  closeConvertToOrderModal();
  updateTabCounts();
  renderKPICards();
  applyFilters();

  const orderId = 'ORD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  if (window.Toast) Toast.success('Order Created', `Quote ${q.id} converted to order ${orderId}.`);
  else if (typeof showToast === 'function') showToast(`Quote ${q.id} converted to ${orderId}`, 'success');
}

// ── Send to Customer Modal ────────────────────────────────────────────────────

function sendToCustomer(id) {
  const q = allQuotations.find(i => i.id === id);
  if (!q) return;
  _sendQuoteId = id;

  document.getElementById('sqToEmail').value    = '';
  document.getElementById('sqCCEmail').value    = '';
  document.getElementById('sqSubject').value    = `Quotation ${q.id} from LankaCommerce`;
  document.getElementById('sqMessage').value    = `Dear ${q.customer_name || 'Customer'},\n\nPlease find your quotation ${q.id} for ${fmtLKR(q.total)} attached.\n\n${q.valid_until ? `This quote is valid until ${fmtDate(q.valid_until)}.` : ''}\n\nThank you for the opportunity.\n\nLankaCommerce Cloud`;
  document.getElementById('sqAttachPDF').checked = true;

  document.getElementById('sendQuoteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSendQuoteModal() {
  document.getElementById('sendQuoteModal').classList.remove('open');
  document.body.style.overflow = '';
  _sendQuoteId = null;
}

function confirmSendQuote() {
  const toEmail = document.getElementById('sqToEmail').value.trim();
  if (!toEmail) {
    if (window.Toast) Toast.warning('Email Required', 'Please enter a recipient email address.');
    else if (typeof showToast === 'function') showToast('Please enter a recipient email', 'warning');
    return;
  }

  const q = allQuotations.find(i => i.id === _sendQuoteId);
  if (q && q.status === 'draft') {
    q.status = 'sent';
    updateTabCounts();
    renderKPICards();
    applyFilters();
  }

  closeSendQuoteModal();
  const msg = `Quote ${_sendQuoteId || ''} sent to ${toEmail}`;
  if (window.Toast) Toast.success('Quote Sent', msg);
  else if (typeof showToast === 'function') showToast(msg, 'success');
}

// ── Reject Quote Modal ────────────────────────────────────────────────────────

function rejectQuote(id) {
  const q = allQuotations.find(i => i.id === id);
  if (!q || q.status === 'rejected') {
    if (window.Toast) Toast.info('Already Rejected', `Quote ${id} is already rejected.`);
    else if (typeof showToast === 'function') showToast(`Quote ${id} is already rejected`, 'info');
    return;
  }
  _rejectQuoteId = id;

  const label = document.getElementById('rejectQuoteIdLabel');
  if (label) label.textContent = id;

  document.getElementById('rejectQuoteReason').value = '';
  document.getElementById('rejectQuoteNotes').value  = '';

  document.getElementById('rejectQuoteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRejectQuoteModal() {
  document.getElementById('rejectQuoteModal').classList.remove('open');
  document.body.style.overflow = '';
  _rejectQuoteId = null;
}

function confirmRejectQuote() {
  const reason = document.getElementById('rejectQuoteReason').value;
  if (!reason) {
    if (window.Toast) Toast.warning('Reason Required', 'Please select a reason for rejection.');
    else if (typeof showToast === 'function') showToast('Please select a rejection reason', 'warning');
    return;
  }
  const q = allQuotations.find(i => i.id === _rejectQuoteId);
  if (q) q.status = 'rejected';
  closeRejectQuoteModal();
  updateTabCounts();
  renderKPICards();
  applyFilters();
  if (window.Toast) Toast.success('Quote Rejected', `Quote ${_rejectQuoteId} has been marked as rejected.`);
  else if (typeof showToast === 'function') showToast(`Quote ${_rejectQuoteId} rejected`, 'success');
}

// ── Duplicate Quote Modal ─────────────────────────────────────────────────────

function duplicateQuote(id) {
  const q = allQuotations.find(i => i.id === id);
  if (!q) return;
  _duplicateQuoteId = id;

  document.getElementById('dupQuoteIdLabel').textContent  = id;
  document.getElementById('dupCustomerLabel').textContent = q.customer_name || '—';

  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  document.getElementById('dupValidUntil').value = defaultDate.toISOString().split('T')[0];
  document.getElementById('dupNotes').value = q.notes || '';

  document.getElementById('duplicateQuoteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDuplicateQuoteModal() {
  document.getElementById('duplicateQuoteModal').classList.remove('open');
  document.body.style.overflow = '';
  _duplicateQuoteId = null;
}

function confirmDuplicateQuote() {
  const orig = allQuotations.find(i => i.id === _duplicateQuoteId);
  if (!orig) return;

  const newId = 'QUO-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  const dup = {
    ...orig,
    id: newId,
    status: 'draft',
    created_at: new Date().toISOString(),
    valid_until: document.getElementById('dupValidUntil').value || orig.valid_until,
    notes: document.getElementById('dupNotes').value || orig.notes,
    items: orig.items.map(it => ({ ...it })),
  };

  allQuotations.unshift(dup);
  closeDuplicateQuoteModal();
  updateTabCounts();
  renderKPICards();
  applyFilters();
  updateSubtitle();

  if (window.Toast) Toast.success('Duplicated', `Quote ${newId} created as a draft copy of ${orig.id}.`);
  else if (typeof showToast === 'function') showToast(`Duplicated as ${newId}`, 'success');
}

// ── newQuotation (opens modal) ────────────────────────────────────────────────

function newQuotation() {
  if (typeof openNewQuotationModal === 'function') {
    window._nqmOnConfirm = function(quote, isDraft) {
      allQuotations.unshift(quote);
      updateTabCounts();
      renderKPICards();
      applyFilters();
      updateSubtitle();
      const msg = isDraft ? `Draft quote ${quote.id} saved.` : `Quotation ${quote.id} created and sent.`;
      if (window.Toast) isDraft ? Toast.info('Draft Saved', msg) : Toast.success('Quote Sent', msg);
      else if (typeof showToast === 'function') showToast(msg, isDraft ? 'info' : 'success');
    };
    openNewQuotationModal();
  }
}

function exportQuotations() {
  if (window.Toast) Toast.info('Export', 'Export feature coming in the full system.');
  else if (typeof showToast === 'function') showToast('Export coming in full system', 'info');
}

// ── Modal backdrop-click-to-close ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  [
    ['viewQuoteModal',       closeViewQuoteModal],
    ['convertToOrderModal',  closeConvertToOrderModal],
    ['sendQuoteModal',       closeSendQuoteModal],
    ['rejectQuoteModal',     closeRejectQuoteModal],
    ['duplicateQuoteModal',  closeDuplicateQuoteModal],
  ].forEach(function([modalId, closeFn]) {
    const el = document.getElementById(modalId);
    if (el) el.addEventListener('click', function(e) {
      if (e.target === this) closeFn();
    });
  });
});

// ── Boot ──────────────────────────────────────────────────────────────────────
init();
