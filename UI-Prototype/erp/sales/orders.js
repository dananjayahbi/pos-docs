/* Page-specific scripts — orders.html */

const { formatLKR, formatDate, timeAgo, loadData, avatarInitials } = window.LCC || {};

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

const STATUS_CONFIG = {
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
  const s = STATUS_CONFIG[status] || { label: status, cls: 'badge-pending', icon: 'fa-circle' };
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

// New order state
let newOrderItems = [];
let newOrderCustomer = null;

// ── Load Data ─────────────────────────────────────────────────────────────────

async function init() {
  try {
    const [ordersData, customersData, productsData] = await Promise.all([
      loadData('../../data/orders.json'),
      loadData('../../data/customers.json'),
      loadData('../../data/products.json'),
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
    renderKPIChips();
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

// ── KPI Chips ─────────────────────────────────────────────────────────────────

function renderKPIChips() {
  const now = new Date();
  const todayStr = now.toDateString();
  const weekAgo = new Date(now); weekAgo.setDate(now.getDate() - 7);

  const todayOrders    = allOrders.filter(o => new Date(o.ordered_at).toDateString() === todayStr);
  const weekOrders     = allOrders.filter(o => new Date(o.ordered_at) >= weekAgo);
  const pendingOrders  = allOrders.filter(o => o.status === 'pending');
  const processingOrders = allOrders.filter(o => o.status === 'processing');
  const cancelledOrders = allOrders.filter(o => o.status === 'cancelled');

  const todayTotal   = todayOrders.reduce((s, o) => s + (o.total || 0), 0);
  const weekTotal    = weekOrders.reduce((s, o) => s + (o.total || 0), 0);

  const chips = [
    {
      icon: 'fa-solid fa-calendar-day', cls: 'orange',
      value: todayOrders.length.toString(), sub: fmtLKR(todayTotal),
      label: 'Today',
    },
    {
      icon: 'fa-solid fa-calendar-week', cls: 'blue',
      value: weekOrders.length.toString(), sub: fmtLKR(weekTotal),
      label: 'This Week',
    },
    {
      icon: 'fa-solid fa-clock', cls: 'amber',
      value: pendingOrders.length.toString(), sub: 'Need action',
      label: 'Pending',
    },
    {
      icon: 'fa-solid fa-gear', cls: 'indigo',
      value: processingOrders.length.toString(), sub: 'In progress',
      label: 'Processing',
    },
    {
      icon: 'fa-solid fa-ban', cls: 'red',
      value: cancelledOrders.length.toString(), sub: 'Last 30 days',
      label: 'Cancelled',
    },
  ];

  document.getElementById('kpiChips').innerHTML = chips.map(c => `
    <div class="kpi-chip">
      <div class="kpi-chip-icon ${c.cls}"><i class="${c.icon}"></i></div>
      <div class="kpi-chip-info">
        <div class="kpi-chip-value">${c.value}</div>
        <div class="kpi-chip-label">${c.label}</div>
        <div class="kpi-chip-sub">${c.sub}</div>
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
  renderKPIChips();
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
  if (!confirm(`Cancel order ${id}? This cannot be undone.`)) return;
  updateStoredOrder(id, { status: 'cancelled' });
  const o = allOrders.find(x => x.id === id);
  if (o) o.status = 'cancelled';
  updateTabCounts(); renderKPIChips(); applyFilters();
  showToast('success','Order Cancelled',`Order ${id} has been cancelled.`);
}

function generateInvoice(id) { showToast('info','Invoice',`Generating invoice for ${id}…`); }
function printOrderById(id)  { showToast('info','Print',`Preparing print for ${id}…`); }
function editOrderById(id)   { showToast('info','Edit',`Opening editor for ${id}…`); }

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
  updateTabCounts(); renderKPIChips(); applyFilters();
  showToast('success','Status Updated',`Order ${currentDetailOrder.id} → ${newStatus}`);
}

function editCurrentOrder() { showToast('info','Edit',`Opening full editor for ${currentDetailOrder?.id}…`); }
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

function openNewOrderModal() {
  newOrderItems = [];
  newOrderCustomer = null;
  document.getElementById('customerSearchInput').value = '';
  document.getElementById('selectedCustomerId').value = '';
  document.getElementById('selectedCustomerInfo').style.display = 'none';
  document.getElementById('productSearchInput').value = '';
  document.getElementById('productSuggestions').classList.remove('open');
  document.getElementById('customerSuggestions').classList.remove('open');
  document.getElementById('newOrderDiscount').value = '0';
  document.getElementById('newOrderDelivery').value = '0';
  document.getElementById('newOrderTaxEnabled').checked = false;
  document.getElementById('newOrderNotes').value = '';
  renderNewOrderItems();
  recalcTotal();
  document.getElementById('newOrderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeNewOrderModal() {
  document.getElementById('newOrderModal').classList.remove('open');
  document.body.style.overflow = '';
}

// Close modal on backdrop click
document.getElementById('newOrderModal').addEventListener('click', function(e) {
  if (e.target === this) closeNewOrderModal();
});

function searchCustomers(q) {
  const sugg = document.getElementById('customerSuggestions');
  if (!q.trim()) { sugg.classList.remove('open'); return; }
  const matches = allCustomers.filter(c => {
    const name = (c.first_name + ' ' + c.last_name).toLowerCase();
    return name.includes(q.toLowerCase()) || (c.phone || '').includes(q);
  }).slice(0, 6);

  if (!matches.length) { sugg.classList.remove('open'); return; }

  sugg.innerHTML = matches.map(c => `
    <div class="cust-sugg-item" onclick="selectCustomer('${c.id}')">
      <img class="cust-sugg-avatar" src="${c.avatar || ''}" alt="${c.first_name}" onerror="this.style.display='none'" />
      <div>
        <div class="cust-sugg-name">${c.first_name} ${c.last_name}</div>
        <div class="cust-sugg-phone">${c.phone}</div>
      </div>
    </div>
  `).join('');
  sugg.classList.add('open');
}

function selectCustomer(id) {
  const c = allCustomers.find(x => x.id === id);
  if (!c) return;
  newOrderCustomer = c;
  document.getElementById('selectedCustomerId').value = id;
  document.getElementById('customerSearchInput').value = c.first_name + ' ' + c.last_name;
  document.getElementById('selectedCustomerName').textContent = c.first_name + ' ' + c.last_name;
  document.getElementById('selectedCustomerPhone').textContent = c.phone;
  document.getElementById('selectedCustomerInfo').style.display = 'block';
  document.getElementById('customerSuggestions').classList.remove('open');
}

function searchProducts(q) {
  const sugg = document.getElementById('productSuggestions');
  if (!q.trim()) { sugg.classList.remove('open'); return; }
  const matches = allProducts.filter(p => {
    return p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.barcode || '').includes(q);
  }).slice(0, 8);

  if (!matches.length) { sugg.classList.remove('open'); return; }

  sugg.innerHTML = matches.map(p => `
    <div class="product-suggestion-item" onclick="addProductToOrder('${p.id}')">
      <img class="sugg-img" src="${p.image || ''}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" />
      <div>
        <div class="sugg-name">${p.name}</div>
        <div class="sugg-sku">${p.sku}</div>
      </div>
      <span class="sugg-price">${fmtLKR(p.sale_price || p.base_price)}</span>
    </div>
  `).join('');
  sugg.classList.add('open');
}

function addProductToOrder(id) {
  const prod = allProducts.find(p => p.id === id);
  if (!prod) return;

  const existing = newOrderItems.find(i => i.product_id === id);
  if (existing) {
    existing.qty++;
    existing.line_total = existing.qty * existing.unit_price;
  } else {
    newOrderItems.push({
      product_id: id,
      name: prod.name,
      sku: prod.sku,
      image: prod.image,
      unit_price: prod.sale_price || prod.base_price,
      qty: 1,
      line_total: prod.sale_price || prod.base_price,
    });
  }

  document.getElementById('productSearchInput').value = '';
  document.getElementById('productSuggestions').classList.remove('open');
  renderNewOrderItems();
  recalcTotal();
}

function removeNewOrderItem(idx) {
  newOrderItems.splice(idx, 1);
  renderNewOrderItems();
  recalcTotal();
}

function updateNewOrderItemQty(idx, delta) {
  newOrderItems[idx].qty = Math.max(1, newOrderItems[idx].qty + delta);
  newOrderItems[idx].line_total = newOrderItems[idx].qty * newOrderItems[idx].unit_price;
  renderNewOrderItems();
  recalcTotal();
}

function setNewOrderItemQty(idx, val) {
  const qty = Math.max(1, parseInt(val) || 1);
  newOrderItems[idx].qty = qty;
  newOrderItems[idx].line_total = qty * newOrderItems[idx].unit_price;
  recalcTotal();
}

function renderNewOrderItems() {
  const el = document.getElementById('newOrderItems');
  if (!newOrderItems.length) {
    el.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--color-neutral-400);font-size:0.8125rem;border:1px dashed var(--color-neutral-200);border-radius:8px;">Search and add products above</div>`;
    return;
  }

  el.innerHTML = newOrderItems.map((item, i) => `
    <div class="new-order-item">
      <img class="sugg-img" src="${item.image || ''}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" />
      <div class="new-order-item-name">
        <div>${item.name}</div>
        <div class="new-order-item-sku">${item.sku} · ${fmtLKR(item.unit_price)} each</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateNewOrderItemQty(${i}, -1)"><i class="fa-solid fa-minus"></i></button>
        <input type="number" class="qty-input" value="${item.qty}" min="1" onchange="setNewOrderItemQty(${i}, this.value)" />
        <button class="qty-btn" onclick="updateNewOrderItemQty(${i}, 1)"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div style="font-weight:700;font-size:0.8125rem;min-width:72px;text-align:right;">${fmtLKR(item.line_total)}</div>
      <button class="remove-item-btn" onclick="removeNewOrderItem(${i})" title="Remove"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `).join('');
}

function recalcTotal() {
  const subtotal  = newOrderItems.reduce((s, i) => s + i.line_total, 0);
  const discount  = parseFloat(document.getElementById('newOrderDiscount')?.value || 0);
  const delivery  = parseFloat(document.getElementById('newOrderDelivery')?.value || 0);
  const taxEnabled = document.getElementById('newOrderTaxEnabled')?.checked;
  const taxRate   = taxEnabled ? 0.18 : 0;
  const taxAmt    = (subtotal - discount) * taxRate;
  const total     = subtotal - discount + taxAmt + delivery;

  document.getElementById('sumSubtotal').textContent = fmtLKR(subtotal);
  document.getElementById('sumDiscount').textContent = `– ${fmtLKR(discount)}`;
  document.getElementById('sumTax').textContent      = fmtLKR(taxAmt);
  document.getElementById('sumDelivery').textContent = fmtLKR(delivery);
  document.getElementById('sumTotal').textContent    = fmtLKR(total);
}

function buildNewOrder(status) {
  if (!newOrderCustomer) { showToast('warning','Customer Required','Please select a customer.'); return null; }
  if (!newOrderItems.length) { showToast('warning','Items Required','Please add at least one product.'); return null; }

  const subtotal  = newOrderItems.reduce((s, i) => s + i.line_total, 0);
  const discount  = parseFloat(document.getElementById('newOrderDiscount').value || 0);
  const delivery  = parseFloat(document.getElementById('newOrderDelivery').value || 0);
  const taxEnabled = document.getElementById('newOrderTaxEnabled').checked;
  const taxAmt    = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total     = subtotal - discount + taxAmt + delivery;

  const id = 'ORD-' + new Date().getFullYear() + '-' + String(allOrders.length + 100).padStart(4, '0');
  return {
    id,
    customer_id:     newOrderCustomer.id,
    customer_name:   newOrderCustomer.first_name + ' ' + newOrderCustomer.last_name,
    customer_phone:  newOrderCustomer.phone,
    source:          document.getElementById('newOrderSource').value,
    status,
    items:           newOrderItems.map(i => ({ ...i })),
    subtotal, discount, shipping: delivery, tax: taxAmt, total,
    payment_method:  document.getElementById('newOrderPayMethod').value,
    payment_status:  'pending',
    ordered_at:      new Date().toISOString(),
    confirmed_at:    status === 'confirmed' ? new Date().toISOString() : null,
    notes:           document.getElementById('newOrderNotes').value,
  };
}

function saveOrderAsDraft() {
  const order = buildNewOrder('pending');
  if (!order) return;
  persistNewOrder(order);
  closeNewOrderModal();
  showToast('success','Draft Saved',`Order ${order.id} saved as draft.`);
}

function confirmNewOrder() {
  const order = buildNewOrder('confirmed');
  if (!order) return;
  persistNewOrder(order);
  closeNewOrderModal();
  showToast('success','Order Confirmed',`Order ${order.id} has been confirmed!`);
}

function persistNewOrder(order) {
  allOrders.unshift(order);
  updateStoredOrder(order.id, order);
  updateTabCounts();
  renderKPIChips();
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
