/* Page-specific scripts — orders.html */


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

const ORDER_STATUS = {
  pending:    { label: 'Pending',    cls: 'badge-pending',    icon: 'fa-clock' },
  confirmed:  { label: 'Confirmed',  cls: 'badge-confirmed',  icon: 'fa-circle-check' },
  processing: { label: 'Processing', cls: 'badge-processing', icon: 'fa-gear' },
  shipped:    { label: 'Shipped',    cls: 'badge-shipped',    icon: 'fa-truck' },
  delivered:  { label: 'Delivered',  cls: 'badge-delivered',  icon: 'fa-circle-check' },
  completed:  { label: 'Delivered',  cls: 'badge-completed',  icon: 'fa-circle-check' },
  cancelled:  { label: 'Cancelled',  cls: 'badge-cancelled',  icon: 'fa-ban' },
  returned:   { label: 'Returned',   cls: 'badge-returned',   icon: 'fa-rotate-left' },
};

const PAY_CONFIG = {
  paid:           { label: 'Paid',     cls: 'badge-pay-paid' },
  partially_paid: { label: 'Partial',  cls: 'badge-pay-partial' },
  pending:        { label: 'Pending',  cls: 'badge-pay-pending' },
};

const SOURCE_ICONS = {
  pos:       { icon: 'fa-solid fa-cash-register', label: 'POS',       cls: 'pos' },
  webstore:  { icon: 'fa-solid fa-globe',         label: 'Webstore',  cls: 'webstore' },
  manual:    { icon: 'fa-solid fa-pen',            label: 'Manual',    cls: 'manual' },
  whatsapp:  { icon: 'fa-brands fa-whatsapp',      label: 'WhatsApp',  cls: 'whatsapp' },
};

function statusBadgeHtml(status) {
  const s = ORDER_STATUS[status] || { label: status, cls: 'badge-pending', icon: 'fa-circle' };
  return `<span class="badge ${s.cls}">${s.label}</span>`;
}

function payBadgeHtml(status) {
  const p = PAY_CONFIG[status] || PAY_CONFIG['pending'];
  return `<span class="badge ${p.cls}">${p.label}</span>`;
}

// ── State ─────────────────────────────────────────────────────────────────────

let allOrders = [];
let allCustomers = [];
let allProducts  = [];
let filteredOrders = [];
let currentTab = 'all';
let currentPage = 1;
const PAGE_SIZE = 15;
let sortKey = 'date';
let sortDir = 'desc';
let selectedOrderIds = new Set();
let currentDetailOrder = null;

// Modal state
let _cancelOrderId = null;
let _editOrderId   = null;

// New order state
let newOrderItems = [];
let newOrderCustomer = null;

// ── Load Data ─────────────────────────────────────────────────────────────────

async function init() {
  try {
    const [ordersData, customersData, productsData] = await Promise.all([
      loadData('data/orders.json'),
      loadData('data/customers.json'),
      loadData('data/products.json'),
    ]);

    // Merge with localStorage overrides
    const stored = JSON.parse(localStorage.getItem('lcc_orders') || '[]');
    const baseOrders = ordersData?.orders || [];
    const merged = [...baseOrders];

    stored.forEach(so => {
      const idx = merged.findIndex(o => o.id === so.id);
      if (idx >= 0) merged[idx] = { ...merged[idx], ...so };
      else merged.unshift(so);
    });

    allOrders    = merged;
    allCustomers = customersData?.customers || [];
    allProducts  = productsData?.products  || [];

    updateTabCounts();
    renderKPICards();
    applyFilters();
    updateSubtitle();

    // Check URL param for auto-open new order
    if (new URLSearchParams(location.search).get('new') === '1') {
      openNewOrderModal();
    }

    // Check URL param for auto-open order detail
    const idParam = new URLSearchParams(location.search).get('id');
    if (idParam) {
      const order = allOrders.find(o => o.id === idParam);
      if (order) openDetail(order);
    }

  } catch (e) {
    console.error('Failed to load orders data', e);
    document.getElementById('ordersTableBody').innerHTML = `
      <tr><td colspan="10">
        <div class="empty-state">
          <i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i>
          <div class="empty-state-title">Failed to load orders</div>
          <div class="empty-state-sub">Check your data/orders.json file</div>
        </div>
      </td></tr>`;
  }
}

// ── KPI Cards (dashboard-style) ───────────────────────────────────────────────

function renderKPICards() {
  const now = new Date();
  const todayStr = now.toDateString();
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);
  const monthAgo = new Date(now); monthAgo.setMonth(now.getMonth() - 1);

  const todayOrders      = allOrders.filter(o => new Date(o.ordered_at).toDateString() === todayStr);
  const weekOrders       = allOrders.filter(o => new Date(o.ordered_at) >= weekAgo);
  const pendingOrders    = allOrders.filter(o => o.status === 'pending');
  const processingOrders = allOrders.filter(o => o.status === 'processing');
  const monthOrders      = allOrders.filter(o => new Date(o.ordered_at) >= monthAgo);

  const todayRevenue   = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const monthRevenue   = monthOrders.reduce((s, o) => s + (o.total || 0), 0);
  const weekRevenue    = weekOrders.reduce((s, o)  => s + (o.total || 0), 0);
  const avgOrderValue  = allOrders.length ? (allOrders.reduce((s, o) => s + (o.total || 0), 0) / allOrders.length) : 0;

  const cards = [
    {
      icon: 'fa-solid fa-money-bill-wave', iconClass: 'orange',
      value: formatLKRShort(monthRevenue),
      label: "Monthly Revenue",
      sub: `${monthOrders.length} orders this month`,
      change: fmtLKR(todayRevenue) + ' today',
      changeType: 'up',
    },
    {
      icon: 'fa-solid fa-bag-shopping', iconClass: 'blue',
      value: allOrders.length.toString(),
      label: 'Total Orders',
      sub: 'All time',
      change: weekOrders.length + ' this week',
      changeType: 'up',
    },
    {
      icon: 'fa-solid fa-clock', iconClass: 'amber',
      value: pendingOrders.length.toString(),
      label: 'Pending Orders',
      sub: 'Need attention',
      change: processingOrders.length + ' processing',
      changeType: pendingOrders.length > 5 ? 'down' : 'up',
    },
    {
      icon: 'fa-solid fa-chart-line', iconClass: 'green',
      value: formatLKRShort(avgOrderValue),
      label: 'Avg. Order Value',
      sub: 'All time average',
      change: formatLKRShort(weekRevenue / (weekOrders.length || 1)) + ' avg/week',
      changeType: 'up',
    },
  ];

  document.getElementById('kpiGrid').innerHTML = cards.map(c => `
    <div class="kpi-card">
      <div class="kpi-header">
        <div class="kpi-icon ${c.iconClass}"><i class="${c.icon}"></i></div>
        <span class="kpi-badge ${c.changeType}">${c.changeType === 'up'
          ? '<i class="fa-solid fa-arrow-trend-up"></i>'
          : '<i class="fa-solid fa-arrow-trend-down"></i>'} ${c.change}</span>
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
  const tabs = ['all','pending','confirmed','processing','shipped','delivered','cancelled','returned'];
  const statusMap = { delivered: ['delivered','completed'] };

  tabs.forEach(tab => {
    let count;
    if (tab === 'all') {
      count = allOrders.length;
    } else if (statusMap[tab]) {
      count = allOrders.filter(o => statusMap[tab].includes(o.status)).length;
    } else {
      count = allOrders.filter(o => o.status === tab).length;
    }
    const el = document.getElementById('tabCount-' + tab);
    if (el) el.textContent = count;
  });
}

// ── Filters & Sorting ─────────────────────────────────────────────────────────

function applyFilters() {
  const search  = (document.getElementById('searchInput')?.value || '').toLowerCase().trim();
  const source  = document.getElementById('sourceFilter')?.value || '';
  const dateFrom = document.getElementById('dateFrom')?.value;
  const dateTo   = document.getElementById('dateTo')?.value;
  const payment  = document.getElementById('paymentFilter')?.value || '';

  filteredOrders = allOrders.filter(o => {
    // Tab filter
    if (currentTab !== 'all') {
      if (currentTab === 'delivered') {
        if (!['delivered','completed'].includes(o.status)) return false;
      } else {
        if (o.status !== currentTab) return false;
      }
    }

    // Search
    if (search) {
      const haystack = ((o.id || '') + (o.customer_name || '')).toLowerCase();
      if (!haystack.includes(search)) return false;
    }

    // Source
    if (source && o.source !== source) return false;

    // Date range
    if (dateFrom) {
      if (new Date(o.ordered_at) < new Date(dateFrom)) return false;
    }
    if (dateTo) {
      const end = new Date(dateTo); end.setHours(23,59,59,999);
      if (new Date(o.ordered_at) > end) return false;
    }

    // Payment
    if (payment && o.payment_status !== payment) return false;

    return true;
  });

  // Sort
  filteredOrders.sort((a, b) => {
    let av, bv;
    if (sortKey === 'id')    { av = a.id || ''; bv = b.id || ''; return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av); }
    if (sortKey === 'total') { av = a.total || 0; bv = b.total || 0; }
    else                     { av = new Date(a.ordered_at || 0).getTime(); bv = new Date(b.ordered_at || 0).getTime(); }
    return sortDir === 'asc' ? av - bv : bv - av;
  });

  currentPage = 1;
  selectedOrderIds.clear();
  document.getElementById('selectAll').checked = false;
  renderTable();
  updateBulkBar();
}

function sortBy(key) {
  if (sortKey === key) sortDir = sortDir === 'asc' ? 'desc' : 'asc';
  else { sortKey = key; sortDir = key === 'date' ? 'desc' : 'asc'; }
  applyFilters();
}

function handleSearch() {
  clearTimeout(window._searchTimer);
  window._searchTimer = setTimeout(applyFilters, 220);
}

function clearFilters() {
  document.getElementById('searchInput').value = '';
  document.getElementById('sourceFilter').value = '';
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  document.getElementById('paymentFilter').value = '';
  applyFilters();
}

// ── Tab Switching ─────────────────────────────────────────────────────────────

document.getElementById('orderTabs').addEventListener('click', function(e) {
  const tab = e.target.closest('.order-tab');
  if (!tab) return;
  document.querySelectorAll('.order-tab').forEach(t => t.classList.remove('active'));
  tab.classList.add('active');
  currentTab = tab.dataset.tab;
  applyFilters();
});

// ── Render Table ──────────────────────────────────────────────────────────────

function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageData = filteredOrders.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('ordersTableBody');

  if (!pageData.length) {
    tbody.innerHTML = `
      <tr><td colspan="10">
        <div class="empty-state">
          <i class="fa-solid fa-bag-shopping"></i>
          <div class="empty-state-title">No orders found</div>
          <div class="empty-state-sub">Try adjusting your filters or create a new order</div>
        </div>
      </td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = pageData.map(o => {
    const src    = SOURCE_ICONS[o.source] || SOURCE_ICONS.manual;
    const isChecked = selectedOrderIds.has(o.id);
    const cust   = allCustomers.find(c => c.id === o.customer_id);
    const avatar = cust?.avatar
      ? `<img class="cust-avatar" src="${cust.avatar}" alt="${o.customer_name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" /><div class="cust-avatar-initials" style="display:none;">${initials(o.customer_name)}</div>`
      : `<div class="cust-avatar-initials">${initials(o.customer_name)}</div>`;

    const itemCount = o.items ? o.items.reduce((s, i) => s + (i.qty || 1), 0) : 0;

    return `
    <tr data-id="${o.id}" onclick="handleRowClick(event,'${o.id}')">
      <td onclick="event.stopPropagation()">
        <input type="checkbox" class="form-checkbox row-checkbox" value="${o.id}"
          ${isChecked ? 'checked' : ''}
          onchange="toggleSelect('${o.id}', this.checked)" />
      </td>
      <td>
        <a class="order-id-link" href="#" onclick="event.preventDefault();event.stopPropagation();openDetailById('${o.id}')">${o.id}</a>
        <div style="font-size:0.7rem;color:var(--color-neutral-400);margin-top:1px;">${fmtDate(o.ordered_at)}</div>
      </td>
      <td>
        <div class="customer-cell">
          ${avatar}
          <div class="cust-name">${o.customer_name || '—'}</div>
        </div>
      </td>
      <td>
        <span class="source-icon ${src.cls}" title="${src.label}">
          <i class="${src.icon}"></i>
          <span style="font-size:0.75rem;margin-left:0.25rem;">${src.label}</span>
        </span>
      </td>
      <td style="white-space:nowrap;">${fmtDateTime(o.ordered_at)}</td>
      <td style="text-align:center;">
        <span style="font-weight:600;color:var(--color-neutral-700);">${itemCount}</span>
      </td>
      <td><span class="order-total">${fmtLKR(o.total)}</span></td>
      <td>${payBadgeHtml(o.payment_status)}</td>
      <td>${statusBadgeHtml(o.status)}</td>
      <td onclick="event.stopPropagation()">
        <div class="actions-cell" style="justify-content:flex-end;">
          <button class="action-btn primary" onclick="openDetailById('${o.id}')">
            <i class="fa-solid fa-eye"></i> View
          </button>
          <button class="action-btn" onclick="editOrderById('${o.id}')">
            <i class="fa-solid fa-pen"></i>
          </button>
          <div class="three-dot-wrap">
            <button class="three-dot-btn" onclick="toggleMenu('menu-${o.id}', event)">
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
            <div class="three-dot-menu" id="menu-${o.id}">
              <a href="#" onclick="event.preventDefault();cancelOrderPrompt('${o.id}')">
                <i class="fa-solid fa-ban" style="color:#dc2626;width:14px;"></i> Cancel Order
              </a>
              <a href="#" onclick="event.preventDefault();generateInvoice('${o.id}')">
                <i class="fa-solid fa-file-invoice" style="width:14px;color:#1d4ed8;"></i> Generate Invoice
              </a>
              <a href="#" onclick="event.preventDefault();printOrderById('${o.id}')">
                <i class="fa-solid fa-print" style="width:14px;color:#6b7280;"></i> Print Order
              </a>
            </div>
          </div>
        </div>
      </td>
    </tr>`;
  }).join('');

  renderPagination();
  updateSubtitle();
}

// ── Pagination ────────────────────────────────────────────────────────────────

function renderPagination() {
  const total = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = (currentPage - 1) * PAGE_SIZE + 1;
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent =
    total ? `Showing ${start}–${end} of ${total} orders` : 'No orders found';

  const btns = document.getElementById('paginationBtns');
  let html = `<button class="page-btn" onclick="goPage(${currentPage-1})" ${currentPage===1?'disabled':''}><i class="fa-solid fa-chevron-left"></i></button>`;

  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 7 && p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 1) {
      if (p === 3 || p === totalPages - 2) html += `<span style="padding:0 6px;color:var(--color-neutral-400);align-self:center;">…</span>`;
      continue;
    }
    html += `<button class="page-btn ${p===currentPage?'active':''}" onclick="goPage(${p})">${p}</button>`;
  }

  html += `<button class="page-btn" onclick="goPage(${currentPage+1})" ${currentPage===totalPages?'disabled':''}><i class="fa-solid fa-chevron-right"></i></button>`;
  btns.innerHTML = html;
}

function goPage(p) {
  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTable();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Subtitle ──────────────────────────────────────────────────────────────────

function updateSubtitle() {
  document.getElementById('ordersSubtitle').textContent =
    `${allOrders.length} total orders · ${filteredOrders.length} shown · Last updated ${fmtDateTime(new Date())}`;
}

// ── Select / Bulk ─────────────────────────────────────────────────────────────

function toggleSelect(id, checked) {
  if (checked) selectedOrderIds.add(id);
  else selectedOrderIds.delete(id);
  updateBulkBar();
  updateSelectAll();
}

function toggleSelectAll(cb) {
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageIds = filteredOrders.slice(start, start + PAGE_SIZE).map(o => o.id);
  pageIds.forEach(id => cb.checked ? selectedOrderIds.add(id) : selectedOrderIds.delete(id));
  document.querySelectorAll('.row-checkbox').forEach(c => c.checked = cb.checked);
  updateBulkBar();
}

function updateSelectAll() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const pageIds = filteredOrders.slice(start, start + PAGE_SIZE).map(o => o.id);
  document.getElementById('selectAll').checked = pageIds.length > 0 && pageIds.every(id => selectedOrderIds.has(id));
}

function updateBulkBar() {
  const bar = document.getElementById('bulkActionsBar');
  const count = selectedOrderIds.size;
  document.getElementById('bulkCount').textContent = count;
  if (count > 0) bar.classList.add('visible');
  else bar.classList.remove('visible');
}

function clearSelection() {
  selectedOrderIds.clear();
  document.querySelectorAll('.row-checkbox').forEach(c => c.checked = false);
  document.getElementById('selectAll').checked = false;
  updateBulkBar();
}

function applyBulkStatus() {
  const status = document.getElementById('bulkStatusSelect').value;
  if (!status || !selectedOrderIds.size) { showToast('warning','Select a status and at least one order.'); return; }
  selectedOrderIds.forEach(id => updateStoredOrder(id, { status }));
  selectedOrderIds.forEach(id => {
    const o = allOrders.find(x => x.id === id);
    if (o) o.status = status;
  });
  updateTabCounts();
  renderKPICards();
  applyFilters();
  clearSelection();
  showToast('success', 'Bulk Update', `${selectedOrderIds.size || 'Selected'} orders updated to "${status}"`);
}

function exportSelected() {
  const ids = [...selectedOrderIds].join(', ');
  showToast('info','Export','Exporting selected orders: ' + ids);
}

function exportOrders() {
  showToast('info','Export','Exporting all visible orders to CSV…');
}

// ── 3-dot Menu ────────────────────────────────────────────────────────────────

function toggleMenu(id, e) {
  e.stopPropagation();
  const menu = document.getElementById(id);
  const wasOpen = menu.classList.contains('open');
  document.querySelectorAll('.three-dot-menu').forEach(m => m.classList.remove('open'));
  if (!wasOpen) menu.classList.add('open');
}

document.addEventListener('click', () => {
  document.querySelectorAll('.three-dot-menu').forEach(m => m.classList.remove('open'));
});

function cancelOrderPrompt(id) {
  _cancelOrderId = id;
  const order = allOrders.find(o => o.id === id);
  document.getElementById('cancelModalSubtitle').textContent =
    `Order ${id}${order ? ' · ' + order.customer_name : ''}`;
  document.getElementById('cancelReason').value = '';
  document.getElementById('cancelNote').value = '';
  document.getElementById('cancelOrderModal').classList.add('open');
}

function closeCancelModal() {
  document.getElementById('cancelOrderModal').classList.remove('open');
  _cancelOrderId = null;
}

function confirmCancelOrder() {
  if (!_cancelOrderId) return;
  const id = _cancelOrderId;
  updateStoredOrder(id, { status: 'cancelled' });
  const o = allOrders.find(x => x.id === id);
  if (o) o.status = 'cancelled';
  updateTabCounts(); renderKPICards(); applyFilters();
  // Refresh slide-over if it's showing this order
  if (currentDetailOrder?.id === id) {
    currentDetailOrder.status = 'cancelled';
    document.getElementById('detailStatusBadge').innerHTML = statusBadgeHtml('cancelled');
    const sel = document.getElementById('detailStatusSelect');
    if (sel) sel.value = 'cancelled';
  }
  closeCancelModal();
  showToast('success', 'Order Cancelled', `Order ${id} has been cancelled.`);
}

function generateInvoice(id) {
  const order = allOrders.find(o => o.id === id);
  if (!order) return;

  const invoiceNum = 'INV-' + order.id.replace('ORD-', '');
  const addr = order.shipping_address;
  const addrHtml = addr
    ? `${addr.line1 || ''}${addr.city ? ', ' + addr.city : ''}${addr.district ? ', ' + addr.district : ''}${addr.province ? ', ' + addr.province : ''}`
    : '';

  const itemsHtml = (order.items || []).map(item => `
    <tr>
      <td style="padding:0.625rem 0;border-bottom:1px solid var(--color-neutral-100);">
        <div style="font-weight:500;color:var(--color-neutral-900);">${item.name}</div>
        ${item.variant ? `<div style="font-size:0.75rem;color:var(--color-neutral-500);margin-top:1px;">${item.variant}</div>` : ''}
      </td>
      <td style="text-align:center;padding:0.625rem 0;border-bottom:1px solid var(--color-neutral-100);color:var(--color-neutral-600);">${item.qty}</td>
      <td style="text-align:right;padding:0.625rem 0;border-bottom:1px solid var(--color-neutral-100);color:var(--color-neutral-600);">${fmtLKR(item.unit_price)}</td>
      <td style="text-align:right;padding:0.625rem 0;border-bottom:1px solid var(--color-neutral-100);font-weight:600;color:var(--color-neutral-900);">${fmtLKR(item.line_total)}</td>
    </tr>`).join('');

  const statusBadge = statusBadgeHtml(order.status);
  const payStatusColor = order.payment_status === 'paid' ? '#16a34a'
    : order.payment_status === 'partially_paid' ? '#d97706' : '#6b7280';
  const payStatusLabel = (order.payment_status || 'pending').replace(/_/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());

  document.getElementById('invoiceModalBody').innerHTML = `
    <div id="invoicePrintArea" style="font-family:inherit;font-size:0.875rem;line-height:1.5;">

      <!-- Header -->
      <div style="display:flex;justify-content:space-between;align-items:flex-start;padding-bottom:1.25rem;margin-bottom:1.25rem;border-bottom:2px solid var(--color-neutral-200);">
        <div>
          <div style="font-size:1.5rem;font-weight:800;color:#f97316;line-height:1;">LankaCommerce</div>
          <div style="font-size:0.8125rem;color:var(--color-neutral-500);margin-top:0.25rem;">Cloud ERP · Thennakoon Textiles Pvt Ltd</div>
          <div style="font-size:0.8125rem;color:var(--color-neutral-500);">No. 42, Galle Road, Colombo 03, Sri Lanka</div>
          <div style="font-size:0.8125rem;color:var(--color-neutral-500);">+94 11 234 5678 · billing@thennakoon.lk</div>
        </div>
        <div style="text-align:right;">
          <div style="font-size:1.125rem;font-weight:700;color:var(--color-neutral-300);letter-spacing:0.05em;">INVOICE</div>
          <div style="font-size:1.125rem;font-weight:700;color:#1d4ed8;margin-top:0.125rem;">${invoiceNum}</div>
          <div style="font-size:0.8125rem;color:var(--color-neutral-500);margin-top:0.25rem;">Order: <span style="font-weight:600;color:var(--color-neutral-700);">${order.id}</span></div>
          <div style="font-size:0.8125rem;color:var(--color-neutral-500);">Date: <span style="font-weight:500;">${fmtDate(order.ordered_at)}</span></div>
        </div>
      </div>

      <!-- Bill To + Order Info -->
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.5rem;margin-bottom:1.5rem;">
        <div style="background:var(--color-neutral-50);border-radius:10px;padding:0.875rem 1rem;">
          <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-neutral-400);margin-bottom:0.5rem;">Bill To</div>
          <div style="font-weight:700;color:var(--color-neutral-900);font-size:0.9375rem;">${order.customer_name || '—'}</div>
          <div style="color:var(--color-neutral-600);font-size:0.8125rem;">${order.customer_phone || ''}</div>
          ${addrHtml ? `<div style="color:var(--color-neutral-600);font-size:0.8125rem;margin-top:0.25rem;">${addrHtml}</div>` : ''}
        </div>
        <div style="background:var(--color-neutral-50);border-radius:10px;padding:0.875rem 1rem;">
          <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-neutral-400);margin-bottom:0.5rem;">Order Info</div>
          <div style="display:flex;justify-content:space-between;font-size:0.8125rem;padding:0.1875rem 0;"><span style="color:var(--color-neutral-500);">Source</span><span style="font-weight:500;text-transform:capitalize;">${order.source || '—'}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:0.8125rem;padding:0.1875rem 0;"><span style="color:var(--color-neutral-500);">Fulfillment</span><span style="font-weight:500;text-transform:capitalize;">${order.fulfillment_type || '—'}</span></div>
          <div style="display:flex;justify-content:space-between;font-size:0.8125rem;padding:0.1875rem 0;"><span style="color:var(--color-neutral-500);">Payment</span><span style="font-weight:500;text-transform:capitalize;">${(order.payment_method || '').replace(/_/g,' ')}</span></div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8125rem;padding:0.1875rem 0;"><span style="color:var(--color-neutral-500);">Status</span>${statusBadge}</div>
          <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.8125rem;padding:0.1875rem 0;"><span style="color:var(--color-neutral-500);">Payment Status</span><span style="font-weight:600;color:${payStatusColor};">${payStatusLabel}</span></div>
        </div>
      </div>

      <!-- Items Table -->
      <div style="margin-bottom:1.25rem;">
        <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.07em;color:var(--color-neutral-400);margin-bottom:0.625rem;">Order Items</div>
        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr style="border-bottom:2px solid var(--color-neutral-200);">
              <th style="text-align:left;font-size:0.75rem;font-weight:700;color:var(--color-neutral-500);padding:0.375rem 0;text-transform:uppercase;letter-spacing:0.04em;">Item</th>
              <th style="text-align:center;font-size:0.75rem;font-weight:700;color:var(--color-neutral-500);padding:0.375rem 0;text-transform:uppercase;letter-spacing:0.04em;width:60px;">Qty</th>
              <th style="text-align:right;font-size:0.75rem;font-weight:700;color:var(--color-neutral-500);padding:0.375rem 0;text-transform:uppercase;letter-spacing:0.04em;width:110px;">Unit Price</th>
              <th style="text-align:right;font-size:0.75rem;font-weight:700;color:var(--color-neutral-500);padding:0.375rem 0;text-transform:uppercase;letter-spacing:0.04em;width:110px;">Total</th>
            </tr>
          </thead>
          <tbody>${itemsHtml}</tbody>
        </table>
      </div>

      <!-- Totals -->
      <div style="display:flex;justify-content:flex-end;margin-bottom:1.25rem;">
        <table style="width:240px;font-size:0.875rem;">
          <tr><td style="padding:0.25rem 0;color:var(--color-neutral-500);">Subtotal</td><td style="text-align:right;padding:0.25rem 0;">${fmtLKR(order.subtotal)}</td></tr>
          ${order.discount ? `<tr><td style="padding:0.25rem 0;color:#16a34a;">Discount</td><td style="text-align:right;padding:0.25rem 0;color:#16a34a;font-weight:600;">- ${fmtLKR(order.discount)}</td></tr>` : ''}
          ${order.shipping ? `<tr><td style="padding:0.25rem 0;color:var(--color-neutral-500);">Shipping</td><td style="text-align:right;padding:0.25rem 0;">${fmtLKR(order.shipping)}</td></tr>` : ''}
          ${order.tax ? `<tr><td style="padding:0.25rem 0;color:var(--color-neutral-500);">Tax (VAT)</td><td style="text-align:right;padding:0.25rem 0;">${fmtLKR(order.tax)}</td></tr>` : ''}
          <tr style="border-top:2px solid var(--color-neutral-900);">
            <td style="padding:0.625rem 0;font-weight:700;color:var(--color-neutral-900);font-size:0.9375rem;">Total</td>
            <td style="text-align:right;padding:0.625rem 0;font-weight:800;font-size:1rem;color:#f97316;">${fmtLKR(order.total)}</td>
          </tr>
        </table>
      </div>

      ${order.notes ? `
      <div style="padding:0.75rem 1rem;background:var(--color-neutral-50);border-left:3px solid var(--color-neutral-300);border-radius:0 6px 6px 0;font-size:0.8125rem;color:var(--color-neutral-600);">
        <strong style="color:var(--color-neutral-700);">Notes:</strong> ${order.notes}
      </div>` : ''}

      <!-- Footer -->
      <div style="margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--color-neutral-200);display:flex;justify-content:space-between;align-items:center;">
        <div style="font-size:0.75rem;color:var(--color-neutral-400);">Generated by LankaCommerce Cloud ERP</div>
        <div style="font-size:0.75rem;color:var(--color-neutral-400);">Thank you for your business</div>
      </div>

    </div>
  `;

  document.getElementById('invoiceModal').classList.add('open');
}

function closeInvoiceModal() {
  document.getElementById('invoiceModal').classList.remove('open');
}

function printInvoice() {
  const content = document.getElementById('invoicePrintArea')?.innerHTML;
  if (!content) return;
  const w = window.open('', '_blank', 'width=820,height=960');
  w.document.write(`<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { font-family: 'Inter', sans-serif; padding: 2.5rem; max-width: 760px; margin: 0 auto; color: #111; }
    table { border-collapse: collapse; }
    @media print { body { padding: 1.5rem; } @page { margin: 1cm; } }
  </style>
</head>
<body>${content}</body>
</html>`);
  w.document.close();
  w.focus();
  setTimeout(() => { w.print(); }, 600);
}

function downloadInvoice() {
  showToast('info', 'PDF Download', 'PDF export integration coming soon.');
}

function printOrderById(id)  { showToast('info', 'Print', `Preparing print view for ${id}…`); }

// ── Edit Order Modal ──────────────────────────────────────────────────────────

function editOrderById(id) {
  const order = allOrders.find(o => o.id === id);
  if (!order) { showToast('error', 'Not Found', `Order ${id} not found.`); return; }
  openEditOrderModal(order);
}

function openEditOrderModal(order) {
  _editOrderId = order.id;
  document.getElementById('editOrderModalSubtitle').textContent =
    `${order.id} · ${order.customer_name || ''}`;

  const hasCourier = order.fulfillment_type === 'delivery';

  document.getElementById('editOrderModalBody').innerHTML = `
    <!-- Status row -->
    <div class="form-row" style="margin-bottom:1rem;">
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Order Status</label>
        <select class="form-select" id="editStatus">
          ${Object.entries(ORDER_STATUS).map(([val, cfg]) =>
            `<option value="${val}" ${order.status === val ? 'selected' : ''}>${cfg.label}</option>`
          ).join('')}
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Payment Status</label>
        <select class="form-select" id="editPaymentStatus">
          <option value="paid"           ${order.payment_status === 'paid'           ? 'selected' : ''}>Paid</option>
          <option value="partially_paid" ${order.payment_status === 'partially_paid' ? 'selected' : ''}>Partially Paid</option>
          <option value="pending"        ${order.payment_status === 'pending'        ? 'selected' : ''}>Pending</option>
        </select>
      </div>
    </div>

    <!-- Customer row -->
    <div class="form-row" style="margin-bottom:1rem;">
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Customer Name</label>
        <input class="form-input" id="editCustomerName" value="${order.customer_name || ''}" placeholder="Full name" />
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Customer Phone</label>
        <input class="form-input" id="editCustomerPhone" value="${order.customer_phone || ''}" placeholder="+94 XX XXX XXXX" />
      </div>
    </div>

    <!-- Fulfillment + Payment Method row -->
    <div class="form-row" style="margin-bottom:1rem;">
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Fulfillment Type</label>
        <select class="form-select" id="editFulfillment" onchange="toggleCourierFields(this.value)">
          <option value="delivery" ${order.fulfillment_type === 'delivery' ? 'selected' : ''}>Delivery</option>
          <option value="pickup"   ${order.fulfillment_type === 'pickup'   ? 'selected' : ''}>Pickup</option>
        </select>
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Payment Method</label>
        <select class="form-select" id="editPaymentMethod">
          ${['cash','card','payhere','bank_transfer','cod','credit'].map(m =>
            `<option value="${m}" ${order.payment_method === m ? 'selected' : ''}>${m.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase())}</option>`
          ).join('')}
        </select>
      </div>
    </div>

    <!-- Shipping address (delivery only) -->
    ${order.shipping_address ? `
    <div class="form-group" id="editAddrGroup" style="${order.fulfillment_type === 'pickup' ? 'display:none;' : ''}">
      <label class="form-label">Shipping Address</label>
      <input class="form-input" id="editAddrLine1" value="${order.shipping_address.line1 || ''}" placeholder="Street address" style="margin-bottom:0.5rem;" />
      <div class="form-row">
        <input class="form-input" id="editAddrCity" value="${order.shipping_address.city || ''}" placeholder="City" />
        <input class="form-input" id="editAddrDistrict" value="${order.shipping_address.district || ''}" placeholder="District" />
      </div>
    </div>` : ''}

    <!-- Courier fields (delivery only) -->
    <div id="editCourierGroup" style="${!hasCourier || order.fulfillment_type === 'pickup' ? 'display:none;' : ''}">
      <div class="form-row" style="margin-bottom:1rem;">
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Courier</label>
          <input class="form-input" id="editCourier" value="${order.courier || ''}" placeholder="Koombiyo, RajaYana…" />
        </div>
        <div class="form-group" style="margin-bottom:0;">
          <label class="form-label">Waybill Number</label>
          <input class="form-input" id="editWaybill" value="${order.waybill_number || ''}" placeholder="Tracking number" />
        </div>
      </div>
    </div>

    <!-- Financials row -->
    <div class="form-row" style="margin-bottom:1rem;">
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Discount (₨)</label>
        <input class="form-input" id="editDiscount" type="number" min="0" value="${order.discount || 0}" />
      </div>
      <div class="form-group" style="margin-bottom:0;">
        <label class="form-label">Shipping Fee (₨)</label>
        <input class="form-input" id="editShipping" type="number" min="0" value="${order.shipping || 0}" />
      </div>
    </div>

    <!-- Notes -->
    <div class="form-group" style="margin-bottom:0;">
      <label class="form-label">Notes</label>
      <textarea class="form-textarea" id="editNotes" rows="3" placeholder="Internal order notes…">${order.notes || ''}</textarea>
    </div>
  `;

  document.getElementById('editOrderModal').classList.add('open');
}

function toggleCourierFields(fulfillment) {
  const courierGroup = document.getElementById('editCourierGroup');
  const addrGroup    = document.getElementById('editAddrGroup');
  const isDelivery   = fulfillment === 'delivery';
  if (courierGroup) courierGroup.style.display = isDelivery ? '' : 'none';
  if (addrGroup)    addrGroup.style.display    = isDelivery ? '' : 'none';
}

function closeEditOrderModal() {
  document.getElementById('editOrderModal').classList.remove('open');
  _editOrderId = null;
}

function saveEditedOrder() {
  if (!_editOrderId) return;
  const id = _editOrderId;
  const origin = allOrders.find(x => x.id === id);
  if (!origin) return;

  const updates = {
    status:          document.getElementById('editStatus').value,
    payment_status:  document.getElementById('editPaymentStatus').value,
    customer_name:   document.getElementById('editCustomerName').value.trim(),
    customer_phone:  document.getElementById('editCustomerPhone').value.trim(),
    fulfillment_type:document.getElementById('editFulfillment').value,
    payment_method:  document.getElementById('editPaymentMethod').value,
    notes:           document.getElementById('editNotes').value.trim(),
    discount:        parseFloat(document.getElementById('editDiscount').value) || 0,
    shipping:        parseFloat(document.getElementById('editShipping').value) || 0,
  };

  // Recalculate total
  updates.total = (origin.subtotal || 0) - updates.discount + updates.shipping + (origin.tax || 0);

  // Shipping address
  const addrLine1    = document.getElementById('editAddrLine1');
  const addrCity     = document.getElementById('editAddrCity');
  const addrDistrict = document.getElementById('editAddrDistrict');
  if (addrLine1 && origin.shipping_address) {
    updates.shipping_address = {
      ...origin.shipping_address,
      line1:    addrLine1.value.trim(),
      city:     addrCity    ? addrCity.value.trim()     : origin.shipping_address.city,
      district: addrDistrict ? addrDistrict.value.trim() : origin.shipping_address.district,
    };
  }

  // Courier / waybill
  const courierEl = document.getElementById('editCourier');
  const waybillEl = document.getElementById('editWaybill');
  if (courierEl) updates.courier        = courierEl.value.trim();
  if (waybillEl) updates.waybill_number = waybillEl.value.trim();

  // Persist
  updateStoredOrder(id, updates);
  Object.assign(origin, updates);

  updateTabCounts(); renderKPICards(); applyFilters();
  showToast('success', 'Order Updated', `Order ${id} has been saved.`);

  // Refresh slide-over if currently showing this order
  if (currentDetailOrder?.id === id) openDetail(allOrders.find(x => x.id === id));

  closeEditOrderModal();
}

// ── Row Click ─────────────────────────────────────────────────────────────────

function handleRowClick(e, id) {
  if (e.target.closest('input,button,a,select,.three-dot-wrap')) return;
  openDetailById(id);
}

// ── Order Detail Slide-Over ───────────────────────────────────────────────────

function openDetailById(id) {
  const order = allOrders.find(o => o.id === id);
  if (!order) return;
  openDetail(order);
}

function openDetail(order) {
  currentDetailOrder = order;

  document.getElementById('detailOrderNum').textContent = order.id;
  document.getElementById('detailOrderMeta').textContent =
    `${fmtDateTime(order.ordered_at)} · ${order.fulfillment_type || 'delivery'}`;
  document.getElementById('detailStatusBadge').innerHTML = statusBadgeHtml(order.status);
  document.getElementById('detailStatusSelect').value = (order.status === 'completed' ? 'delivered' : order.status) || 'pending';

  const cust = allCustomers.find(c => c.id === order.customer_id) || {};
  const addr = order.shipping_address;

  // Build timeline
  const timelineSteps = [
    { key: 'ordered_at',   label: 'Order Placed',   always: true },
    { key: 'confirmed_at', label: 'Confirmed' },
    { key: 'processed_at', label: 'Processing Started' },
    { key: 'shipped_at',   label: 'Shipped' },
    { key: 'delivered_at', label: 'Delivered' },
    { key: 'cancelled_at', label: 'Cancelled' },
    { key: 'returned_at',  label: 'Returned' },
  ];

  const statusOrder = ['pending','confirmed','processing','shipped','delivered','cancelled','returned'];
  const currentIdx  = statusOrder.indexOf(order.status === 'completed' ? 'delivered' : order.status);

  const timelineHtml = timelineSteps.map((step, idx) => {
    const ts = order[step.key];
    if (!ts && !step.always) return '';
    const dotCls = ts ? 'done' : (idx <= currentIdx ? 'active' : 'pending');
    return `
      <div class="timeline-item">
        <div class="timeline-dot ${dotCls}"><i class="fa-solid ${dotCls === 'done' ? 'fa-check' : (dotCls === 'active' ? 'fa-spinner fa-spin' : 'fa-minus')}"></i></div>
        <div class="timeline-content">
          <div class="timeline-title">${step.label}</div>
          <div class="timeline-time">${ts ? fmtDateTime(ts) : 'Pending'}</div>
        </div>
      </div>`;
  }).join('');

  // Items table
  const itemsHtml = (order.items || []).map(item => {
    const prod = allProducts.find(p => p.id === item.product_id);
    const img  = prod?.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop';
    return `
      <tr>
        <td><img class="item-img" src="${img}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" /></td>
        <td>
          <div class="item-name">${item.name}</div>
          ${item.variant ? `<div class="item-variant">${item.variant}</div>` : ''}
          <div class="item-variant">SKU: ${prod?.sku || item.product_id}</div>
        </td>
        <td style="text-align:center;">${item.qty}</td>
        <td style="text-align:right;">${fmtLKR(item.unit_price)}</td>
        <td style="text-align:right;font-weight:600;">${fmtLKR(item.line_total)}</td>
      </tr>`;
  }).join('');

  document.getElementById('detailBody').innerHTML = `
    <!-- Customer Info -->
    <div class="detail-section">
      <div class="detail-section-title"><i class="fa-solid fa-user" style="margin-right:0.4rem;"></i>Customer</div>
      <div class="detail-row">
        <span class="detail-key">Name</span>
        <span class="detail-val" style="font-weight:600;">${order.customer_name || '—'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Phone</span>
        <span class="detail-val">${order.customer_phone || cust.phone || '—'}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Email</span>
        <span class="detail-val">${cust.email || '—'}</span>
      </div>
      ${addr ? `
      <div class="detail-row">
        <span class="detail-key">Address</span>
        <span class="detail-val">${addr.line1}, ${addr.city}, ${addr.district}</span>
      </div>` : ''}
    </div>

    <!-- Order Items -->
    <div class="detail-section">
      <div class="detail-section-title"><i class="fa-solid fa-box" style="margin-right:0.4rem;"></i>Order Items</div>
      <table class="items-table">
        <thead>
          <tr>
            <th style="width:46px;"></th>
            <th>Product</th>
            <th style="text-align:center;">Qty</th>
            <th style="text-align:right;">Unit Price</th>
            <th style="text-align:right;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>
    </div>

    <!-- Order Summary -->
    <div class="detail-section">
      <div class="detail-section-title"><i class="fa-solid fa-calculator" style="margin-right:0.4rem;"></i>Order Summary</div>
      <table class="summary-table">
        <tr><td>Subtotal</td><td>${fmtLKR(order.subtotal)}</td></tr>
        ${order.discount ? `<tr><td style="color:#16a34a;">Discount</td><td style="color:#16a34a;">– ${fmtLKR(order.discount)}</td></tr>` : ''}
        ${order.tax ? `<tr><td>Tax (VAT)</td><td>${fmtLKR(order.tax)}</td></tr>` : ''}
        ${order.shipping ? `<tr><td>Delivery</td><td>${fmtLKR(order.shipping)}</td></tr>` : ''}
        <tr class="total-row"><td>Total</td><td style="color:#f97316;">${fmtLKR(order.total)}</td></tr>
      </table>
    </div>

    <!-- Payment Info -->
    <div class="detail-section">
      <div class="detail-section-title"><i class="fa-solid fa-credit-card" style="margin-right:0.4rem;"></i>Payment</div>
      <div class="detail-row">
        <span class="detail-key">Method</span>
        <span class="detail-val">${(order.payment_method || '—').replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Status</span>
        <span class="detail-val">${payBadgeHtml(order.payment_status)}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Paid Amount</span>
        <span class="detail-val" style="color:#16a34a;font-weight:600;">${order.payment_status === 'paid' ? fmtLKR(order.total) : (order.payment_status === 'partially_paid' ? fmtLKR(order.total * 0.55) : '₨ 0.00')}</span>
      </div>
      <div class="detail-row">
        <span class="detail-key">Balance Due</span>
        <span class="detail-val" style="color:#dc2626;font-weight:600;">${order.payment_status === 'paid' ? '₨ 0.00' : fmtLKR(order.total)}</span>
      </div>
      ${order.waybill_number ? `
      <div class="detail-row">
        <span class="detail-key">Waybill #</span>
        <span class="detail-val">${order.waybill_number}${order.courier ? ' · ' + order.courier : ''}</span>
      </div>` : ''}
    </div>

    <!-- Timeline -->
    <div class="detail-section">
      <div class="detail-section-title"><i class="fa-solid fa-timeline" style="margin-right:0.4rem;"></i>Order Timeline</div>
      <div class="timeline">${timelineHtml}</div>
    </div>

    <!-- Notes -->
    <div class="detail-section">
      <div class="detail-section-title"><i class="fa-solid fa-note-sticky" style="margin-right:0.4rem;"></i>Notes</div>
      <textarea class="notes-textarea" id="detailNotes" placeholder="Add internal notes…">${order.notes || ''}</textarea>
      <button class="btn btn-sm btn-outline" style="margin-top:0.5rem;" onclick="saveNotes()">
        <i class="fa-solid fa-floppy-disk"></i> Save Notes
      </button>
    </div>
  `;

  document.getElementById('detailOverlay').classList.add('open');
  document.getElementById('detailPanel').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeDetail() {
  document.getElementById('detailOverlay').classList.remove('open');
  document.getElementById('detailPanel').classList.remove('open');
  document.body.style.overflow = '';
  currentDetailOrder = null;
}

function updateOrderStatus() {
  if (!currentDetailOrder) return;
  const newStatus = document.getElementById('detailStatusSelect').value;
  currentDetailOrder.status = newStatus;
  updateStoredOrder(currentDetailOrder.id, { status: newStatus });
  document.getElementById('detailStatusBadge').innerHTML = statusBadgeHtml(newStatus);
  const o = allOrders.find(x => x.id === currentDetailOrder.id);
  if (o) o.status = newStatus;
  updateTabCounts(); renderKPICards(); applyFilters();
  showToast('success','Status Updated',`Order ${currentDetailOrder.id} → ${newStatus}`);
}

function editCurrentOrder() {
  if (!currentDetailOrder) return;
  openEditOrderModal(currentDetailOrder);
}
function printOrder()       { showToast('info','Print',`Preparing print for ${currentDetailOrder?.id}…`); }

function saveNotes() {
  if (!currentDetailOrder) return;
  const notes = document.getElementById('detailNotes').value;
  currentDetailOrder.notes = notes;
  updateStoredOrder(currentDetailOrder.id, { notes });
  const o = allOrders.find(x => x.id === currentDetailOrder.id);
  if (o) o.notes = notes;
  showToast('success','Notes Saved','Order notes have been updated.');
}

// ── localStorage persistence ──────────────────────────────────────────────────

function updateStoredOrder(id, changes) {
  let stored = JSON.parse(localStorage.getItem('lcc_orders') || '[]');
  const idx = stored.findIndex(o => o.id === id);
  if (idx >= 0) stored[idx] = { ...stored[idx], ...changes };
  else stored.push({ id, ...changes });
  localStorage.setItem('lcc_orders', JSON.stringify(stored));
}

// ── New Order Modal ───────────────────────────────────────────────────────────

function persistNewOrder(order) {
  allOrders.unshift(order);
  updateStoredOrder(order.id, order);
  updateTabCounts();
  renderKPICards();
  applyFilters();
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(type, title, message) {
  if (window.Toast) {
    if (type === 'success') Toast.success(title, message);
    else if (type === 'warning') Toast.warning(title, message);
    else if (type === 'info') Toast.info(title, message);
    else Toast.error(title, message);
    return;
  }

  const icons = { success:'fa-circle-check', warning:'fa-triangle-exclamation', info:'fa-circle-info', error:'fa-circle-xmark' };
  const colors = { success:'#16a34a', warning:'#d97706', info:'#1d4ed8', error:'#dc2626' };
  const el = document.createElement('div');
  el.style.cssText = `background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:0.875rem 1rem;margin-bottom:0.5rem;display:flex;align-items:flex-start;gap:0.625rem;box-shadow:0 4px 16px rgba(0,0,0,0.1);min-width:260px;max-width:340px;`;
  el.innerHTML = `<i class="fa-solid ${icons[type]||icons.info}" style="color:${colors[type]||colors.info};font-size:1rem;margin-top:1px;"></i><div><div style="font-size:0.8rem;font-weight:600;color:#111;">${title || ''}</div>${message?`<div style="font-size:0.75rem;color:#6b7280;margin-top:2px;">${message}</div>`:''}</div>`;
  const container = document.getElementById('toastContainer');
  container.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// Close dropdowns
document.addEventListener('click', (e) => {
  if (!e.target.closest('.product-search-wrap')) document.getElementById('productSuggestions').classList.remove('open');
  if (!e.target.closest('#customerSearchInput') && !e.target.closest('#customerSuggestions')) document.getElementById('customerSuggestions').classList.remove('open');
  if (!e.target.closest('.header-avatar') && !e.target.closest('.dropdown-menu')) {
    document.querySelectorAll('.dropdown-menu').forEach(d => d.style.display = 'none');
  }
});

// ── Init ──────────────────────────────────────────────────────────────────────

init();

// Wire new order modal callback
window._nomOnConfirm = function(order, isDraft) { persistNewOrder(order); };
