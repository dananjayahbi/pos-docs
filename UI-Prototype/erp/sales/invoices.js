/* Page-specific scripts — invoices.html */

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

const INVOICE_STATUS = {
  paid:      { label: 'Paid',      cls: 'badge-pay-paid',    icon: 'fa-circle-check' },
  issued:    { label: 'Issued',    cls: 'badge-processing',  icon: 'fa-file-invoice' },
  overdue:   { label: 'Overdue',   cls: '',                  icon: 'fa-triangle-exclamation', style: 'background:#fee2e2;color:#dc2626;' },
  draft:     { label: 'Draft',     cls: 'badge-pending',     icon: 'fa-pen' },
  cancelled: { label: 'Cancelled', cls: 'badge-cancelled',   icon: 'fa-ban' },
};

function statusBadgeHtml(status) {
  const s = INVOICE_STATUS[status] || { label: status, cls: 'badge-pending', icon: 'fa-circle', style: '' };
  const styleAttr = s.style ? ` style="${s.style}"` : '';
  return `<span class="badge ${s.cls}"${styleAttr}>${s.label}</span>`;
}

function isOverdue(inv) {
  if (inv.status !== 'overdue') return false;
  return true;
}

// ── State ─────────────────────────────────────────────────────────────────────

let allInvoices = [];
let filteredItems = [];
let currentTab = 'all';
let currentPage = 1;
const PAGE_SIZE = 15;
let sortKey = 'issued';
let sortDir = 'desc';

let _viewInvoiceId       = null;
let _recordPaymentId     = null;
let _sendEmailId         = null;
let _cancelInvoiceId     = null;

// ── Load Data ─────────────────────────────────────────────────────────────────

function loadData(url) {
  return fetch(url).then(r => r.json()).catch(() => ({}));
}

async function init() {
  try {
    const data = await loadData('../../data/invoices.json');
    allInvoices = data?.invoices || [];
    updateTabCounts();
    renderKPICards();
    applyFilters();
    updateSubtitle();
  } catch (e) {
    console.error('Failed to load invoices data', e);
    document.getElementById('invoicesTableBody').innerHTML = `
      <tr><td colspan="9">
        <div class="empty-state">
          <i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i>
          <div class="empty-state-title">Failed to load invoices</div>
          <div class="empty-state-sub">Check your data/invoices.json file</div>
        </div>
      </td></tr>`;
  }
}

// ── KPI Cards ─────────────────────────────────────────────────────────────────

function renderKPICards() {
  const totalInvoiced   = allInvoices.reduce((s, i) => s + (i.total || 0), 0);
  const collected       = allInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + (i.amount_paid || 0), 0);
  const outstanding     = allInvoices.filter(i => ['issued', 'overdue'].includes(i.status)).reduce((s, i) => s + (i.balance_due || 0), 0);
  const overdueTotal    = allInvoices.filter(i => i.status === 'overdue').reduce((s, i) => s + (i.total || 0), 0);

  const paidCount       = allInvoices.filter(i => i.status === 'paid').length;
  const issuedCount     = allInvoices.filter(i => i.status === 'issued').length;
  const overdueCount    = allInvoices.filter(i => i.status === 'overdue').length;

  const cards = [
    {
      iconClass: 'blue',
      icon: 'fa-solid fa-file-invoice',
      value: typeof formatLKRShort === 'function' ? formatLKRShort(totalInvoiced) : fmtLKR(totalInvoiced),
      label: 'Total Invoiced',
      sub: `${allInvoices.length} invoices total`,
      change: `${paidCount} paid`,
      changeType: 'up',
    },
    {
      iconClass: 'green',
      icon: 'fa-solid fa-circle-check',
      value: typeof formatLKRShort === 'function' ? formatLKRShort(collected) : fmtLKR(collected),
      label: 'Collected',
      sub: `${paidCount} paid invoices`,
      change: fmtLKR(collected / (paidCount || 1)) + ' avg',
      changeType: 'up',
    },
    {
      iconClass: 'amber',
      icon: 'fa-solid fa-clock',
      value: typeof formatLKRShort === 'function' ? formatLKRShort(outstanding) : fmtLKR(outstanding),
      label: 'Outstanding',
      sub: `${issuedCount} issued invoices`,
      change: `${issuedCount + overdueCount} pending`,
      changeType: outstanding > 0 ? 'down' : 'up',
    },
    {
      iconClass: 'red',
      icon: 'fa-solid fa-triangle-exclamation',
      value: typeof formatLKRShort === 'function' ? formatLKRShort(overdueTotal) : fmtLKR(overdueTotal),
      label: 'Overdue',
      sub: `${overdueCount} overdue invoices`,
      change: overdueCount > 0 ? 'Requires follow-up' : 'All clear',
      changeType: overdueCount > 0 ? 'down' : 'up',
    },
  ];

  document.getElementById('kpiGrid').innerHTML = cards.map(c => `
    <div class="kpi-card">
      <div class="kpi-header">
        <div class="kpi-icon ${c.iconClass}"><i class="${c.icon}"></i></div>
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
    </div>
  `).join('');
}

// ── Tab Counts ────────────────────────────────────────────────────────────────

function updateTabCounts() {
  const tabs = ['all', 'paid', 'issued', 'overdue', 'draft', 'cancelled'];
  tabs.forEach(tab => {
    const count = tab === 'all' ? allInvoices.length : allInvoices.filter(i => i.status === tab).length;
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

  filteredItems = allInvoices.filter(inv => {
    if (currentTab !== 'all' && inv.status !== currentTab) return false;
    if (search) {
      const haystack = ((inv.id || '') + (inv.customer_name || '') + (inv.order_id || '')).toLowerCase();
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
    else { av = new Date(a.issued_date || 0).getTime(); bv = new Date(b.issued_date || 0).getTime(); }
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
  const tbody    = document.getElementById('invoicesTableBody');

  if (!pageData.length) {
    tbody.innerHTML = `
      <tr><td colspan="9">
        <div class="empty-state">
          <i class="fa-solid fa-file-invoice"></i>
          <div class="empty-state-title">No invoices found</div>
          <div class="empty-state-sub">Try adjusting your filters or create a new invoice</div>
        </div>
      </td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = pageData.map(inv => {
    const isDueSoon = inv.status === 'issued' && inv.due_date && new Date(inv.due_date) <= new Date(Date.now() + 3 * 86400000);
    const dueDateHtml = inv.due_date
      ? `<span style="${isDueSoon ? 'color:#d97706;font-weight:600;' : ''}">${fmtDate(inv.due_date)}</span>`
      : '—';

    const balanceHtml = inv.balance_due > 0
      ? `<span style="font-weight:600;color:${inv.status === 'overdue' ? '#dc2626' : '#d97706'};">${fmtLKR(inv.balance_due)}</span>`
      : `<span style="color:var(--color-neutral-400);">—</span>`;

    const orderRefHtml = inv.order_id
      ? `<span style="font-size:0.8125rem;color:var(--color-neutral-600);">${inv.order_id}</span>`
      : `<span style="color:var(--color-neutral-400);font-size:0.8125rem;">—</span>`;

    return `
    <tr>
      <td>
        <span class="order-id-link" style="cursor:default;">${inv.id}</span>
        <div style="font-size:0.7rem;color:var(--color-neutral-400);margin-top:1px;">${fmtDate(inv.issued_date)}</div>
      </td>
      <td>
        <div class="customer-cell">
          <div class="cust-avatar-initials">${initials(inv.customer_name)}</div>
          <div>
            <div class="cust-name">${inv.customer_name || '—'}</div>
            <div style="font-size:0.75rem;color:var(--color-neutral-400);">${inv.customer_phone || ''}</div>
          </div>
        </div>
      </td>
      <td>${orderRefHtml}</td>
      <td style="white-space:nowrap;">${fmtDate(inv.issued_date)}</td>
      <td style="white-space:nowrap;">${dueDateHtml}</td>
      <td><span class="order-total">${fmtLKR(inv.total)}</span></td>
      <td>${balanceHtml}</td>
      <td>${statusBadgeHtml(inv.status)}</td>
      <td onclick="event.stopPropagation()">
        <div class="actions-cell" style="justify-content:flex-end;">
          <div class="three-dot-wrap">
            <button class="three-dot-btn" onclick="toggleMenu('menu-${inv.id}', event)">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="three-dot-menu" id="menu-${inv.id}">
              <a href="#" onclick="event.preventDefault();viewInvoice('${inv.id}')">
                <i class="fa-solid fa-eye" style="width:14px;color:#1d4ed8;"></i> View Invoice
              </a>
              <a href="#" onclick="event.preventDefault();recordPayment('${inv.id}')">
                <i class="fa-solid fa-credit-card" style="width:14px;color:#16a34a;"></i> Record Payment
              </a>
              <a href="#" onclick="event.preventDefault();sendEmail('${inv.id}')">
                <i class="fa-solid fa-envelope" style="width:14px;color:#6b7280;"></i> Send Email
              </a>
              <a href="#" onclick="event.preventDefault();downloadPDF('${inv.id}')">
                <i class="fa-solid fa-download" style="width:14px;color:#6b7280;"></i> Download PDF
              </a>
              ${['draft', 'issued'].includes(inv.status) ? `
              <a href="#" onclick="event.preventDefault();cancelInvoice('${inv.id}')" style="color:#dc2626;">
                <i class="fa-solid fa-ban" style="width:14px;color:#dc2626;"></i> Cancel Invoice
              </a>` : ''}
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
    total ? `Showing ${start}–${end} of ${total} invoices` : 'No invoices found';

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
  const total     = allInvoices.length;
  const overdue   = allInvoices.filter(i => i.status === 'overdue').length;
  let text = `${total} invoice${total !== 1 ? 's' : ''} total`;
  if (overdue > 0) text += ` · ${overdue} overdue`;
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

// ── View Invoice Modal ────────────────────────────────────────────────────────

function viewInvoice(id) {
  const inv = allInvoices.find(i => i.id === id);
  if (!inv) return;
  _viewInvoiceId = id;

  // Set subtitle
  const sub = document.getElementById('viewInvoiceSubtitle');
  if (sub) sub.textContent = `${inv.id} · ${fmtDate(inv.issued_date)}`;

  // Build body HTML
  const itemsHTML = (inv.items || []).map(item => `
    <tr>
      <td style="padding:0.625rem 0.75rem;font-size:0.8125rem;">${item.name}${item.variant ? `<div style="font-size:0.7rem;color:var(--color-neutral-400);">${item.variant}</div>` : ''}</td>
      <td style="padding:0.625rem 0.75rem;text-align:center;font-size:0.8125rem;">${item.qty}</td>
      <td style="padding:0.625rem 0.75rem;text-align:right;font-size:0.8125rem;">${fmtLKR(item.unit_price)}</td>
      <td style="padding:0.625rem 0.75rem;text-align:right;font-size:0.8125rem;font-weight:600;">${fmtLKR(item.line_total)}</td>
    </tr>
  `).join('');

  const statusHTML = statusBadgeHtml(inv.status);

  const body = document.getElementById('viewInvoiceBody');
  body.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:1rem;margin-bottom:1.5rem;padding-bottom:1.25rem;border-bottom:1px solid var(--color-neutral-200);">
      <div>
        <div style="font-size:1.25rem;font-weight:700;color:var(--color-neutral-900);">${inv.id}</div>
        <div style="margin-top:0.25rem;">${statusHTML}</div>
      </div>
      <div style="text-align:right;font-size:0.8125rem;color:var(--color-neutral-600);">
        <div><span style="font-weight:600;">Issued:</span> ${fmtDate(inv.issued_date)}</div>
        ${inv.due_date ? `<div><span style="font-weight:600;">Due:</span> ${fmtDate(inv.due_date)}</div>` : ''}
        ${inv.order_id ? `<div><span style="font-weight:600;">Order:</span> ${inv.order_id}</div>` : ''}
        ${inv.payment_method ? `<div><span style="font-weight:600;">Payment:</span> ${inv.payment_method.replace(/_/g,' ')}</div>` : ''}
      </div>
    </div>

    <div style="margin-bottom:1.25rem;">
      <div style="font-size:0.75rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.5rem;">Bill To</div>
      <div style="font-weight:600;font-size:0.9375rem;color:var(--color-neutral-900);">${inv.customer_name || '—'}</div>
      <div style="font-size:0.8125rem;color:var(--color-neutral-500);">${inv.customer_phone || ''}</div>
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

    <div style="margin-left:auto;max-width:300px;margin-bottom:1rem;">
      <div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem;"><span style="color:var(--color-neutral-500);">Subtotal</span><span style="font-weight:500;">${fmtLKR(inv.subtotal)}</span></div>
      ${inv.discount > 0 ? `<div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem;"><span style="color:var(--color-neutral-500);">Discount</span><span style="font-weight:500;color:#16a34a;">– ${fmtLKR(inv.discount)}</span></div>` : ''}
      ${inv.tax > 0 ? `<div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem;"><span style="color:var(--color-neutral-500);">Tax (VAT)</span><span style="font-weight:500;">${fmtLKR(inv.tax)}</span></div>` : ''}
      <div style="display:flex;justify-content:space-between;padding:0.5rem 0;font-size:0.9375rem;font-weight:700;border-top:2px solid var(--color-neutral-900);margin-top:0.25rem;"><span>Total</span><span style="color:#f97316;">${fmtLKR(inv.total)}</span></div>
      ${inv.amount_paid > 0 ? `<div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.8125rem;"><span style="color:#16a34a;font-weight:500;">Amount Paid</span><span style="font-weight:500;color:#16a34a;">${fmtLKR(inv.amount_paid)}</span></div>` : ''}
      ${inv.balance_due > 0 ? `<div style="display:flex;justify-content:space-between;padding:0.375rem 0;font-size:0.875rem;font-weight:700;"><span style="color:#d97706;">Balance Due</span><span style="color:#d97706;">${fmtLKR(inv.balance_due)}</span></div>` : ''}
    </div>

    ${inv.notes ? `<div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:8px;padding:0.75rem 1rem;font-size:0.8125rem;color:var(--color-neutral-600);"><span style="font-weight:600;">Notes:</span> ${inv.notes}</div>` : ''}
  `;

  document.getElementById('viewInvoiceModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeViewInvoiceModal() {
  document.getElementById('viewInvoiceModal').classList.remove('open');
  document.body.style.overflow = '';
  _viewInvoiceId = null;
}

function printInvoiceModal() {
  const inv = allInvoices.find(i => i.id === _viewInvoiceId);
  if (!inv) return;
  const w = window.open('', '_blank', 'width=700,height=800');
  const body = document.getElementById('viewInvoiceBody')?.innerHTML || '';
  w.document.write(`<!DOCTYPE html><html><head><title>${inv.id}</title><style>body{font-family:Inter,sans-serif;padding:2rem;max-width:680px;margin:0 auto;}@media print{body{padding:0;}}</style></head><body><h2 style="margin-bottom:1rem;">${inv.id}</h2>${body}</body></html>`);
  w.document.close();
  w.focus();
  setTimeout(() => w.print(), 300);
}

function downloadInvoicePDF() {
  if (window.Toast) Toast.info('Download', 'PDF download is available in the full system.');
  else if (typeof showToast === 'function') showToast('PDF download coming in full system', 'info');
}

// ── Record Payment Modal ──────────────────────────────────────────────────────

function recordPayment(id) {
  const inv = allInvoices.find(i => i.id === id);
  if (!inv) return;
  if (inv.status === 'paid') {
    if (window.Toast) Toast.info('Already Paid', `Invoice ${id} is fully paid.`);
    else if (typeof showToast === 'function') showToast(`Invoice ${id} is already paid`, 'info');
    return;
  }
  _recordPaymentId = id;

  document.getElementById('rpInvoiceId').textContent    = inv.id;
  document.getElementById('rpCustomerName').textContent = inv.customer_name || '—';
  document.getElementById('rpInvoiceTotal').textContent = fmtLKR(inv.total);
  document.getElementById('rpBalanceDue').textContent   = fmtLKR(inv.balance_due);

  document.getElementById('rpAmount').value        = inv.balance_due || '';
  document.getElementById('rpMethod').value        = 'cash';
  document.getElementById('rpDate').value          = new Date().toISOString().split('T')[0];
  document.getElementById('rpReceiptNumber').value = '';
  document.getElementById('rpNotes').value         = '';

  document.getElementById('recordPaymentModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeRecordPaymentModal() {
  document.getElementById('recordPaymentModal').classList.remove('open');
  document.body.style.overflow = '';
  _recordPaymentId = null;
}

function confirmRecordPayment() {
  const inv = allInvoices.find(i => i.id === _recordPaymentId);
  if (!inv) return;

  const amount  = parseFloat(document.getElementById('rpAmount').value) || 0;
  if (amount <= 0) {
    if (window.Toast) Toast.warning('Invalid Amount', 'Please enter a valid payment amount.');
    else if (typeof showToast === 'function') showToast('Please enter a valid amount', 'warning');
    return;
  }

  const reason = document.getElementById('cancelInvoiceReason')?.value;

  // Update invoice state
  inv.amount_paid  = (inv.amount_paid || 0) + amount;
  inv.balance_due  = Math.max(0, (inv.balance_due || 0) - amount);
  if (inv.balance_due <= 0) {
    inv.status = 'paid';
    inv.balance_due = 0;
  } else {
    inv.status = 'partially_paid';
  }

  closeRecordPaymentModal();
  updateTabCounts();
  renderKPICards();
  applyFilters();

  const msg = inv.status === 'paid' ? `Invoice ${inv.id} marked as fully paid.` : `Payment of ${fmtLKR(amount)} recorded. Balance: ${fmtLKR(inv.balance_due)}`;
  if (window.Toast) Toast.success('Payment Recorded', msg);
  else if (typeof showToast === 'function') showToast(msg, 'success');
}

// ── Send Email Modal ──────────────────────────────────────────────────────────

function sendEmail(id) {
  const inv = allInvoices.find(i => i.id === id);
  if (!inv) return;
  _sendEmailId = id;

  document.getElementById('seToEmail').value  = '';
  document.getElementById('seCCEmail').value  = '';
  document.getElementById('seSubject').value  = `Invoice ${inv.id} from LankaCommerce`;
  document.getElementById('seMessage').value  = `Dear ${inv.customer_name || 'Customer'},\n\nPlease find your invoice ${inv.id} for ${fmtLKR(inv.total)} attached.\n\n${inv.due_date ? `Payment is due by ${fmtDate(inv.due_date)}.` : ''}\n\nThank you for your business.\n\nLankaCommerce Cloud`;
  document.getElementById('seAttachPDF').checked = true;

  document.getElementById('sendEmailModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeSendEmailModal() {
  document.getElementById('sendEmailModal').classList.remove('open');
  document.body.style.overflow = '';
  _sendEmailId = null;
}

function confirmSendEmail() {
  const toEmail = document.getElementById('seToEmail').value.trim();
  if (!toEmail) {
    if (window.Toast) Toast.warning('Email Required', 'Please enter a recipient email address.');
    else if (typeof showToast === 'function') showToast('Please enter a recipient email', 'warning');
    return;
  }
  closeSendEmailModal();
  const msg = `Invoice ${_sendEmailId || ''} sent to ${toEmail}`;
  if (window.Toast) Toast.success('Email Sent', msg);
  else if (typeof showToast === 'function') showToast(msg, 'success');
}

// ── Cancel Invoice Modal ──────────────────────────────────────────────────────

function cancelInvoice(id) {
  const inv = allInvoices.find(i => i.id === id);
  if (!inv) return;
  _cancelInvoiceId = id;

  const label = document.getElementById('cancelInvoiceIdLabel');
  if (label) label.textContent = id;

  document.getElementById('cancelInvoiceReason').value = '';
  document.getElementById('cancelInvoiceNotes').value  = '';

  document.getElementById('cancelInvoiceModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCancelInvoiceModal() {
  document.getElementById('cancelInvoiceModal').classList.remove('open');
  document.body.style.overflow = '';
  _cancelInvoiceId = null;
}

function confirmCancelInvoice() {
  const reason = document.getElementById('cancelInvoiceReason').value;
  if (!reason) {
    if (window.Toast) Toast.warning('Reason Required', 'Please select a reason for cancellation.');
    else if (typeof showToast === 'function') showToast('Please select a cancellation reason', 'warning');
    return;
  }
  const inv = allInvoices.find(i => i.id === _cancelInvoiceId);
  if (inv) {
    inv.status      = 'cancelled';
    inv.balance_due = 0;
  }
  closeCancelInvoiceModal();
  updateTabCounts();
  renderKPICards();
  applyFilters();
  if (window.Toast) Toast.success('Invoice Cancelled', `Invoice ${_cancelInvoiceId} has been cancelled.`);
  else if (typeof showToast === 'function') showToast(`Invoice ${_cancelInvoiceId} cancelled`, 'success');
}

// ── New Invoice (opens modal from new-invoice-modal.js) ───────────────────────
function newInvoice() {
  if (typeof openNewInvoiceModal === 'function') {
    // Wire callback to add new invoice to the list
    window._nimOnConfirm = function(invoice, isDraft) {
      allInvoices.unshift(invoice);
      updateTabCounts();
      renderKPICards();
      applyFilters();
      updateSubtitle();
      const msg = isDraft ? `Draft invoice ${invoice.id} saved.` : `Invoice ${invoice.id} created successfully.`;
      if (window.Toast) isDraft ? Toast.info('Draft Saved', msg) : Toast.success('Invoice Created', msg);
      else if (typeof showToast === 'function') showToast(msg, isDraft ? 'info' : 'success');
    };
    openNewInvoiceModal();
  }
}

function exportInvoices() {
  if (typeof showToast === 'function') showToast('Export coming soon', 'info');
}

function downloadPDF(id) {
  if (window.Toast) Toast.info('Download', 'PDF download is available in the full system.');
  else if (typeof showToast === 'function') showToast('PDF download coming in full system', 'info');
}

// ── Modal backdrop-click-to-close ─────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', function() {
  ['viewInvoiceModal','recordPaymentModal','sendEmailModal','cancelInvoiceModal'].forEach(function(modalId) {
    const el = document.getElementById(modalId);
    if (el) el.addEventListener('click', function(e) {
      if (e.target === this) {
        if (modalId === 'viewInvoiceModal')     closeViewInvoiceModal();
        if (modalId === 'recordPaymentModal')   closeRecordPaymentModal();
        if (modalId === 'sendEmailModal')       closeSendEmailModal();
        if (modalId === 'cancelInvoiceModal')   closeCancelInvoiceModal();
      }
    });
  });
});

// ── Boot ──────────────────────────────────────────────────────────────────────
init();
