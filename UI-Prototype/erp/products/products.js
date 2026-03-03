/* Page-specific scripts — index.html */

/* ================================================================
   LCC Products Page — Main Controller
   ================================================================ */

const LS_KEY = 'lcc_products';
const PAGE_SIZE = 10;

let allProducts = [];
let categories  = [];
let filtered    = [];
let currentPage = 1;
let sortField   = 'name';
let sortDir     = 'asc';
let currentView = 'list';
let selectedIds = new Set();
let deleteTargetId = null;

// ── Helpers ──────────────────────────────────────────────────────

function formatLKR(amount) {
  if (amount == null || isNaN(amount)) return '—';
  return '₨ ' + Number(amount).toLocaleString('en-LK');
}

function getStockClass(product) {
  const qty = product.stock_total ?? 0;
  if (qty <= 0) return 'zero';
  if (qty <= (product.low_stock_threshold ?? 10)) return 'low';
  return 'ok';
}

function getStockLabel(product) {
  const qty = product.stock_total ?? 0;
  if (qty <= 0) return 'Out';
  if (qty <= (product.low_stock_threshold ?? 10)) return 'Low · ' + qty;
  return qty;
}

function typeBadgeClass(type) {
  const map = { simple: 'type-simple', variable: 'type-variable', bundle: 'type-bundle', composite: 'type-composite' };
  return map[type] || 'type-simple';
}

function statusBadgeClass(status) {
  const map = { active: 'status-active', draft: 'status-draft', archived: 'status-archived' };
  return map[status] || 'status-draft';
}

function imgSrc(product) {
  return product.image || 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format';
}

function generateId() {
  return 'PRD-' + Date.now().toString(36).toUpperCase();
}

function generateSku() {
  return 'SKU-' + Math.random().toString(36).substring(2,6).toUpperCase() + '-' + Date.now().toString(36).slice(-3).toUpperCase();
}

// ── Storage ──────────────────────────────────────────────────────

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveToStorage(products) {
  localStorage.setItem(LS_KEY, JSON.stringify(products));
}

// ── Boot ─────────────────────────────────────────────────────────

async function init() {
  const stored = loadFromStorage();

  if (stored && stored.length > 0) {
    allProducts = stored;
    // Categories from products
    buildCategoriesFromProducts();
    boot();
  } else {
    try {
      const res  = await fetch('../../data/products.json');
      const data = await res.json();
      allProducts = data.products || [];
      categories  = data.categories || [];
      saveToStorage(allProducts);
    } catch (e) {
      console.warn('Could not load products.json, using demo data.', e);
      allProducts = DEMO_PRODUCTS;
      categories  = DEMO_CATEGORIES;
      saveToStorage(allProducts);
    }
    boot();
  }
}

function buildCategoriesFromProducts() {
  const catMap = {};
  allProducts.forEach(p => {
    if (p.category && !catMap[p.category]) {
      catMap[p.category] = { id: p.category_id || p.category, name: p.category };
    }
  });
  categories = Object.values(catMap);
}

function boot() {
  if (!categories.length) buildCategoriesFromProducts();
  populateCategoryFilters();
  updateStats();
  applyFilters();
  bindEvents();
}

// ── Category dropdowns ───────────────────────────────────────────

function populateCategoryFilters() {
  const filterSel  = document.getElementById('filterCategory');
  const fieldSel   = document.getElementById('fieldCategory');

  categories.forEach(cat => {
    const opt1 = new Option(cat.name, cat.name);
    filterSel.appendChild(opt1);

    const opt2 = new Option(cat.name, cat.name);
    fieldSel.appendChild(opt2);
  });
}

// ── Stats ─────────────────────────────────────────────────────────

function updateStats() {
  const total     = allProducts.length;
  const active    = allProducts.filter(p => p.status === 'active').length;
  const draft     = allProducts.filter(p => p.status === 'draft').length;
  const lowStock  = allProducts.filter(p => {
    const qty = p.stock_total ?? 0;
    return qty <= (p.low_stock_threshold ?? 10);
  }).length;

  document.getElementById('statTotal').textContent    = total;
  document.getElementById('statActive').textContent   = active;
  document.getElementById('statDraft').textContent    = draft;
  document.getElementById('statLowStock').textContent = lowStock;
}

// ── Filter / Sort ─────────────────────────────────────────────────

function applyFilters() {
  const q        = document.getElementById('searchInput').value.trim().toLowerCase();
  const catVal   = document.getElementById('filterCategory').value;
  const typeVal  = document.getElementById('filterType').value;
  const statVal  = document.getElementById('filterStatus').value;

  filtered = allProducts.filter(p => {
    const matchQ    = !q || p.name.toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q);
    const matchCat  = !catVal  || p.category === catVal;
    const matchType = !typeVal || p.product_type === typeVal;
    const matchStat = !statVal || p.status === statVal;
    return matchQ && matchCat && matchType && matchStat;
  });

  // Sort
  filtered.sort((a, b) => {
    let va = a[sortField], vb = b[sortField];
    if (typeof va === 'string') va = va.toLowerCase();
    if (typeof vb === 'string') vb = vb.toLowerCase();
    if (va < vb) return sortDir === 'asc' ? -1 : 1;
    if (va > vb) return sortDir === 'asc' ? 1 : -1;
    return 0;
  });

  currentPage = 1;
  selectedIds.clear();
  updateBulkBar();
  renderView();
}

// ── Render ────────────────────────────────────────────────────────

function renderView() {
  if (currentView === 'list') {
    renderTable();
  } else {
    renderGrid();
  }
  renderPagination();
  syncSelectAllCheckbox();
}

function getPageSlice() {
  const start = (currentPage - 1) * PAGE_SIZE;
  return filtered.slice(start, start + PAGE_SIZE);
}

// TABLE
function renderTable() {
  const tbody = document.getElementById('productsTableBody');
  const empty = document.getElementById('emptyStateList');
  const items = getPageSlice();

  if (!filtered.length) {
    tbody.innerHTML = '';
    empty.style.display = 'block';
    return;
  }
  empty.style.display = 'none';

  tbody.innerHTML = items.map(p => {
    const stockCls   = getStockClass(p);
    const stockLbl   = getStockLabel(p);
    const typeCls    = typeBadgeClass(p.product_type);
    const statusCls  = statusBadgeClass(p.status);
    const checked    = selectedIds.has(p.id) ? 'checked' : '';
    const price      = formatLKR(p.sale_price && p.sale_price !== p.base_price ? p.sale_price : p.base_price);
    const cost       = p.cost_price ? formatLKR(p.cost_price) : '—';

    return `
    <tr data-id="${p.id}">
      <td><input type="checkbox" class="row-checkbox" data-id="${p.id}" ${checked} style="cursor:pointer;accent-color:var(--primary,#f97316);" /></td>
      <td>
        <div class="product-cell">
          <img class="product-img" src="${imgSrc(p)}" alt="${esc(p.name)}"
               onerror="this.src='https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=80&h=80&fit=crop&auto=format'" />
          <div>
            <div class="product-name">${esc(p.name)}</div>
            <div class="product-sku">${esc(p.sku || '')}</div>
          </div>
        </div>
      </td>
      <td>${esc(p.category || '—')}</td>
      <td><span class="type-badge ${typeCls}">${esc(p.product_type || 'simple')}</span></td>
      <td>
        <div class="price-main">${price}</div>
        <div class="price-sub">Cost: ${cost}</div>
      </td>
      <td><span class="stock-badge stock-${stockCls}">${stockLbl}</span></td>
      <td><span class="status-badge ${statusCls}">${esc(p.status || 'draft')}</span></td>
      <td>
        <div class="row-actions">
          <button class="action-btn edit" title="Edit" onclick="openEditModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="action-btn" title="View" onclick="viewProduct('${p.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="action-btn delete" title="Delete" onclick="openDeleteModal('${p.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');

  // Row checkbox binding
  tbody.querySelectorAll('.row-checkbox').forEach(cb => {
    cb.addEventListener('change', e => {
      const id = e.target.dataset.id;
      if (e.target.checked) selectedIds.add(id);
      else selectedIds.delete(id);
      updateBulkBar();
      syncSelectAllCheckbox();
    });
  });
}

// GRID
function renderGrid() {
  const gridEl  = document.getElementById('gridView');
  const emptyEl = document.getElementById('emptyStateGrid');
  const items   = getPageSlice();

  if (!filtered.length) {
    gridEl.innerHTML = '';
    gridEl.classList.remove('visible');
    emptyEl.style.display = 'block';
    return;
  }
  emptyEl.style.display = 'none';
  gridEl.classList.add('visible');

  gridEl.innerHTML = items.map(p => {
    const stockCls  = getStockClass(p);
    const stockLbl  = getStockLabel(p);
    const statusCls = statusBadgeClass(p.status);
    const price     = formatLKR(p.sale_price && p.sale_price !== p.base_price ? p.sale_price : p.base_price);

    return `
    <div class="product-card">
      <img class="product-card-img" src="${imgSrc(p)}" alt="${esc(p.name)}"
           onerror="this.src='https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=400&h=400&fit=crop&auto=format'" />
      <div class="product-card-body">
        <div class="product-card-name">${esc(p.name)}</div>
        <div class="product-card-sku">${esc(p.sku || '')}</div>
        <div class="product-card-footer">
          <span class="product-card-price">${price}</span>
          <span class="stock-badge stock-${stockCls}" style="font-size:0.7rem;">${stockLbl}</span>
        </div>
        <div style="margin-top:0.5rem;">
          <span class="status-badge ${statusCls}">${esc(p.status || 'draft')}</span>
        </div>
      </div>
      <div class="product-card-actions">
        <button class="action-btn edit" title="Edit" onclick="openEditModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="action-btn" title="View" onclick="viewProduct('${p.id}')"><i class="fa-solid fa-eye"></i></button>
        <button class="action-btn delete" title="Delete" onclick="openDeleteModal('${p.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    </div>`;
  }).join('');
}

// PAGINATION
function renderPagination() {
  const total      = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start      = total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  const end        = Math.min(currentPage * PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent =
    `Showing ${start}–${end} of ${total} product${total !== 1 ? 's' : ''}`;

  const ctrl = document.getElementById('paginationControls');
  ctrl.innerHTML = '';

  // Prev
  const prev = document.createElement('button');
  prev.className = 'page-btn';
  prev.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  prev.disabled  = currentPage <= 1;
  prev.addEventListener('click', () => { currentPage--; renderView(); });
  ctrl.appendChild(prev);

  // Pages
  const range = pageRange(currentPage, totalPages);
  range.forEach(pg => {
    const btn = document.createElement('button');
    btn.className = 'page-btn' + (pg === currentPage ? ' active' : '');
    btn.textContent = pg === '...' ? '…' : pg;
    if (pg !== '...') {
      btn.addEventListener('click', () => { currentPage = pg; renderView(); });
    } else {
      btn.disabled = true;
      btn.style.cursor = 'default';
    }
    ctrl.appendChild(btn);
  });

  // Next
  const next = document.createElement('button');
  next.className = 'page-btn';
  next.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
  next.disabled  = currentPage >= totalPages;
  next.addEventListener('click', () => { currentPage++; renderView(); });
  ctrl.appendChild(next);
}

function pageRange(current, total) {
  if (total <= 7) return Array.from({length: total}, (_, i) => i + 1);
  if (current <= 4) return [1,2,3,4,5,'...',total];
  if (current >= total - 3) return [1,'...',total-4,total-3,total-2,total-1,total];
  return [1,'...',current-1,current,current+1,'...',total];
}

// ── Bulk select ───────────────────────────────────────────────────

function syncSelectAllCheckbox() {
  const all = document.getElementById('selectAll');
  if (!all) return;
  const pageIds = getPageSlice().map(p => p.id);
  const allChecked = pageIds.length > 0 && pageIds.every(id => selectedIds.has(id));
  all.checked = allChecked;
  all.indeterminate = !allChecked && pageIds.some(id => selectedIds.has(id));
}

function updateBulkBar() {
  const bar   = document.getElementById('bulkBar');
  const label = document.getElementById('bulkLabel');
  const count = selectedIds.size;
  if (count > 0) {
    bar.classList.add('visible');
    label.textContent = count + ' selected';
  } else {
    bar.classList.remove('visible');
  }
}

// ── Sorting ───────────────────────────────────────────────────────

function updateSortHeaders() {
  document.querySelectorAll('.products-table thead th[data-sort]').forEach(th => {
    th.classList.remove('sort-asc', 'sort-desc');
    if (th.dataset.sort === sortField) {
      th.classList.add(sortDir === 'asc' ? 'sort-asc' : 'sort-desc');
    }
  });
}

// ── Modal: Add/Edit ───────────────────────────────────────────────

function openAddModal() {
  document.getElementById('productModalTitle').textContent = 'Add Product';
  document.getElementById('fieldId').value          = '';
  document.getElementById('fieldName').value        = '';
  document.getElementById('fieldSku').value         = '';
  document.getElementById('fieldBarcode').value     = '';
  document.getElementById('fieldCategory').value    = '';
  document.getElementById('fieldType').value        = 'simple';
  document.getElementById('fieldStatus').value      = 'active';
  document.getElementById('fieldBasePrice').value   = '';
  document.getElementById('fieldSalePrice').value   = '';
  document.getElementById('fieldCostPrice').value   = '';
  document.getElementById('fieldStock').value       = '';
  document.getElementById('fieldReorder').value     = '';
  document.getElementById('fieldDescription').value = '';
  document.getElementById('fieldPosVisible').checked       = true;
  document.getElementById('fieldWebstoreVisible').checked  = true;
  document.getElementById('productModalBackdrop').classList.add('open');
  document.getElementById('fieldName').focus();
}

function openEditModal(id) {
  const p = allProducts.find(x => x.id === id);
  if (!p) return;
  document.getElementById('productModalTitle').textContent = 'Edit Product';
  document.getElementById('fieldId').value          = p.id;
  document.getElementById('fieldName').value        = p.name || '';
  document.getElementById('fieldSku').value         = p.sku || '';
  document.getElementById('fieldBarcode').value     = p.barcode || '';
  document.getElementById('fieldCategory').value    = p.category || '';
  document.getElementById('fieldType').value        = p.product_type || 'simple';
  document.getElementById('fieldStatus').value      = p.status || 'active';
  document.getElementById('fieldBasePrice').value   = p.base_price || '';
  document.getElementById('fieldSalePrice').value   = p.sale_price || '';
  document.getElementById('fieldCostPrice').value   = p.cost_price || '';
  document.getElementById('fieldStock').value       = p.stock_total ?? '';
  document.getElementById('fieldReorder').value     = p.low_stock_threshold ?? '';
  document.getElementById('fieldDescription').value = p.description || '';
  document.getElementById('fieldPosVisible').checked      = p.is_pos_visible !== false;
  document.getElementById('fieldWebstoreVisible').checked = p.is_webstore_visible !== false;
  document.getElementById('productModalBackdrop').classList.add('open');
  document.getElementById('fieldName').focus();
}

function closeProductModal() {
  document.getElementById('productModalBackdrop').classList.remove('open');
}

function saveProduct() {
  const name = document.getElementById('fieldName').value.trim();
  if (!name) {
    document.getElementById('fieldName').focus();
    showToastError && showToastError('Product name is required.');
    return;
  }

  const id = document.getElementById('fieldId').value;
  const isEdit = !!id;

  const obj = {
    id:                  isEdit ? id : generateId(),
    name:                name,
    sku:                 document.getElementById('fieldSku').value.trim(),
    barcode:             document.getElementById('fieldBarcode').value.trim(),
    category:            document.getElementById('fieldCategory').value,
    product_type:        document.getElementById('fieldType').value,
    status:              document.getElementById('fieldStatus').value,
    base_price:          parseFloat(document.getElementById('fieldBasePrice').value) || 0,
    sale_price:          parseFloat(document.getElementById('fieldSalePrice').value) || null,
    cost_price:          parseFloat(document.getElementById('fieldCostPrice').value) || 0,
    stock_total:         parseInt(document.getElementById('fieldStock').value) || 0,
    low_stock_threshold: parseInt(document.getElementById('fieldReorder').value) || 10,
    description:         document.getElementById('fieldDescription').value.trim(),
    is_pos_visible:      document.getElementById('fieldPosVisible').checked,
    is_webstore_visible: document.getElementById('fieldWebstoreVisible').checked,
    image:               isEdit ? (allProducts.find(p => p.id === id)?.image || '') : '',
    created_at:          isEdit ? (allProducts.find(p => p.id === id)?.created_at || new Date().toISOString()) : new Date().toISOString(),
    updated_at:          new Date().toISOString(),
  };

  if (isEdit) {
    const idx = allProducts.findIndex(p => p.id === id);
    if (idx >= 0) allProducts[idx] = obj;
  } else {
    allProducts.unshift(obj);
  }

  saveToStorage(allProducts);
  updateStats();
  buildCategoriesFromProducts();
  applyFilters();
  closeProductModal();

  if (typeof showToast !== 'undefined') {
    showToast(isEdit ? 'Product updated.' : 'Product added.', 'success');
  }
}

function autoGenerateSku() {
  document.getElementById('fieldSku').value = generateSku();
}

// ── Modal: Delete ─────────────────────────────────────────────────

function openDeleteModal(id) {
  const p = allProducts.find(x => x.id === id);
  deleteTargetId = id;
  document.getElementById('deleteModalMsg').textContent =
    `Are you sure you want to delete "${p ? p.name : id}"? This action cannot be undone.`;
  document.getElementById('deleteModalBackdrop').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('deleteModalBackdrop').classList.remove('open');
  deleteTargetId = null;
}

function confirmDelete() {
  if (!deleteTargetId) return;
  allProducts = allProducts.filter(p => p.id !== deleteTargetId);
  saveToStorage(allProducts);
  updateStats();
  applyFilters();
  closeDeleteModal();
  if (typeof showToast !== 'undefined') showToast('Product deleted.', 'error');
}

// ── Bulk delete ───────────────────────────────────────────────────

function bulkDelete() {
  if (!selectedIds.size) return;
  if (!confirm(`Delete ${selectedIds.size} selected product(s)?`)) return;
  allProducts = allProducts.filter(p => !selectedIds.has(p.id));
  selectedIds.clear();
  saveToStorage(allProducts);
  updateStats();
  updateBulkBar();
  applyFilters();
  if (typeof showToast !== 'undefined') showToast('Selected products deleted.', 'error');
}

// ── View product (stub) ───────────────────────────────────────────

function viewProduct(id) {
  const p = allProducts.find(x => x.id === id);
  if (p) alert(`Viewing: ${p.name}\nSKU: ${p.sku || '—'}\nPrice: ${formatLKR(p.base_price)}\nStock: ${p.stock_total}`);
}

// ── Escape HTML ───────────────────────────────────────────────────

function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Event binding ─────────────────────────────────────────────────

function bindEvents() {
  // Add Product button
  document.getElementById('btnAddProduct').addEventListener('click', openAddModal);

  // Import / Export stubs
  document.getElementById('btnImport').addEventListener('click', () => {
    alert('Import feature coming soon. Accepts CSV / XLSX files.');
  });
  document.getElementById('btnExport').addEventListener('click', () => {
    const csv = productsToCSV(filtered);
    downloadCSV(csv, 'lcc-products.csv');
    if (typeof showToast !== 'undefined') showToast('Products exported as CSV.', 'success');
  });

  // Modal buttons
  document.getElementById('saveProductBtn').addEventListener('click', saveProduct);
  document.getElementById('cancelProductModal').addEventListener('click', closeProductModal);
  document.getElementById('closeProductModal').addEventListener('click', closeProductModal);
  document.getElementById('productModalBackdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('productModalBackdrop')) closeProductModal();
  });

  document.getElementById('confirmDeleteBtn').addEventListener('click', confirmDelete);
  document.getElementById('cancelDeleteModal').addEventListener('click', closeDeleteModal);
  document.getElementById('deleteModalBackdrop').addEventListener('click', e => {
    if (e.target === document.getElementById('deleteModalBackdrop')) closeDeleteModal();
  });

  // Search & filters
  document.getElementById('searchInput').addEventListener('input', debounce(applyFilters, 250));
  document.getElementById('filterCategory').addEventListener('change', applyFilters);
  document.getElementById('filterType').addEventListener('change', applyFilters);
  document.getElementById('filterStatus').addEventListener('change', applyFilters);

  // Sort columns
  document.querySelectorAll('.products-table thead th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      if (sortField === field) {
        sortDir = sortDir === 'asc' ? 'desc' : 'asc';
      } else {
        sortField = field;
        sortDir   = 'asc';
      }
      updateSortHeaders();
      applyFilters();
    });
  });

  // Select All
  document.getElementById('selectAll').addEventListener('change', e => {
    const pageIds = getPageSlice().map(p => p.id);
    pageIds.forEach(id => {
      if (e.target.checked) selectedIds.add(id);
      else selectedIds.delete(id);
    });
    // Update row checkboxes
    document.querySelectorAll('.row-checkbox').forEach(cb => {
      cb.checked = selectedIds.has(cb.dataset.id);
    });
    updateBulkBar();
  });

  // Bulk actions
  document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDelete);
  document.getElementById('bulkClearBtn').addEventListener('click', () => {
    selectedIds.clear();
    updateBulkBar();
    renderView();
  });
  document.getElementById('bulkStatusBtn').addEventListener('click', () => {
    if (!selectedIds.size) return;
    const newStatus = prompt('Enter new status (active / draft / archived):');
    if (!newStatus || !['active','draft','archived'].includes(newStatus.trim().toLowerCase())) return;
    allProducts.forEach(p => {
      if (selectedIds.has(p.id)) p.status = newStatus.trim().toLowerCase();
    });
    saveToStorage(allProducts);
    updateStats();
    selectedIds.clear();
    updateBulkBar();
    applyFilters();
    if (typeof showToast !== 'undefined') showToast('Status updated for selected products.', 'success');
  });

  // View toggle
  document.getElementById('viewListBtn').addEventListener('click', () => switchView('list'));
  document.getElementById('viewGridBtn').addEventListener('click', () => switchView('grid'));

  // Keyboard close
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeProductModal(); closeDeleteModal(); }
  });
}

// ── View switch ───────────────────────────────────────────────────

function switchView(mode) {
  currentView = mode;
  const listEl = document.getElementById('listView');
  const gridEl = document.getElementById('gridView');
  const emptyGrid = document.getElementById('emptyStateGrid');
  const paginationWrap = document.getElementById('paginationWrap');

  if (mode === 'list') {
    listEl.style.display = 'block';
    gridEl.classList.remove('visible');
    gridEl.innerHTML = '';
    emptyGrid.style.display = 'none';
    paginationWrap.style.display = 'flex';
    document.getElementById('viewListBtn').classList.add('active');
    document.getElementById('viewGridBtn').classList.remove('active');
  } else {
    listEl.style.display = 'none';
    paginationWrap.style.display = 'none';
    document.getElementById('viewGridBtn').classList.add('active');
    document.getElementById('viewListBtn').classList.remove('active');
    gridEl.style.display = '';
  }
  renderView();
}

// ── CSV Export ────────────────────────────────────────────────────

function productsToCSV(products) {
  const headers = ['ID','Name','SKU','Barcode','Category','Type','Status','Base Price','Sale Price','Cost Price','Stock','Reorder Point'];
  const rows = products.map(p => [
    p.id, p.name, p.sku||'', p.barcode||'', p.category||'', p.product_type||'',
    p.status||'', p.base_price||0, p.sale_price||'', p.cost_price||0,
    p.stock_total||0, p.low_stock_threshold||0
  ].map(v => `"${String(v).replace(/"/g,'""')}"`).join(','));
  return [headers.join(','), ...rows].join('\n');
}

function downloadCSV(csv, filename) {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.style.display = 'none';
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
}

// ── Debounce ──────────────────────────────────────────────────────

function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

// ── Toast fallback ────────────────────────────────────────────────
function showToastError(msg) {
  if (typeof showToast !== 'undefined') showToast(msg, 'error');
  else console.warn(msg);
}

// ── Demo data (fallback if fetch fails) ──────────────────────────

const DEMO_CATEGORIES = [
  { id: 'CAT-001', name: "Men's Clothing" },
  { id: 'CAT-002', name: "Women's Clothing" },
  { id: 'CAT-003', name: 'Groceries' },
  { id: 'CAT-004', name: 'Furniture' },
  { id: 'CAT-005', name: 'Electronics' }
];

const DEMO_PRODUCTS = [
  {
    id: 'PRD-001', name: 'Classic White Cotton T-Shirt', sku: 'TSH-WHT-001', barcode: '6911234567890',
    category: "Men's Clothing", category_id: 'CAT-001', product_type: 'variable', status: 'active',
    is_webstore_visible: true, is_pos_visible: true,
    base_price: 1500, sale_price: 1299, cost_price: 600,
    stock_total: 145, low_stock_threshold: 10,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&auto=format',
    created_at: '2025-11-15T08:00:00Z'
  },
  {
    id: 'PRD-002', name: "Men's Slim Fit Trousers", sku: 'TRS-BLK-001',
    category: "Men's Clothing", category_id: 'CAT-001', product_type: 'variable', status: 'active',
    is_webstore_visible: true, is_pos_visible: true,
    base_price: 3500, sale_price: 3500, cost_price: 1400,
    stock_total: 80, low_stock_threshold: 10,
    image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&auto=format',
    created_at: '2025-11-20T08:00:00Z'
  },
  {
    id: 'PRD-003', name: 'Basmati Rice Premium 5kg', sku: 'RICE-PRM-5KG',
    category: 'Groceries', category_id: 'CAT-003', product_type: 'simple', status: 'active',
    is_webstore_visible: true, is_pos_visible: true,
    base_price: 1450, sale_price: 1350, cost_price: 1000,
    stock_total: 8, low_stock_threshold: 20,
    image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop&auto=format',
    created_at: '2025-12-01T08:00:00Z'
  },
  {
    id: 'PRD-004', name: 'Ceylon Tea Black 250g', sku: 'TEA-BLK-250',
    category: 'Groceries', category_id: 'CAT-003', product_type: 'simple', status: 'active',
    is_webstore_visible: true, is_pos_visible: true,
    base_price: 450, sale_price: 450, cost_price: 300,
    stock_total: 0, low_stock_threshold: 15,
    image: 'https://images.unsplash.com/photo-1597318181409-cf64d0b5d8a2?w=400&h=400&fit=crop&auto=format',
    created_at: '2025-12-05T08:00:00Z'
  },
  {
    id: 'PRD-005', name: "Women's Floral Saree", sku: 'SAR-FLR-001',
    category: "Women's Clothing", category_id: 'CAT-002', product_type: 'variable', status: 'active',
    is_webstore_visible: true, is_pos_visible: true,
    base_price: 8500, sale_price: 7200, cost_price: 3500,
    stock_total: 22, low_stock_threshold: 5,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=400&fit=crop&auto=format',
    created_at: '2025-12-10T08:00:00Z'
  },
  {
    id: 'PRD-006', name: 'Lanka Coconut Oil 500ml', sku: 'OIL-CCN-500',
    category: 'Groceries', category_id: 'CAT-003', product_type: 'simple', status: 'active',
    is_webstore_visible: true, is_pos_visible: true,
    base_price: 680, sale_price: 680, cost_price: 440,
    stock_total: 35, low_stock_threshold: 10,
    image: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&auto=format',
    created_at: '2025-12-15T08:00:00Z'
  },
  {
    id: 'PRD-007', name: 'Office Chair Ergonomic', sku: 'FRN-CHR-001',
    category: 'Furniture', category_id: 'CAT-004', product_type: 'simple', status: 'active',
    is_webstore_visible: true, is_pos_visible: false,
    base_price: 45000, sale_price: 38500, cost_price: 22000,
    stock_total: 12, low_stock_threshold: 3,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop&auto=format',
    created_at: '2025-12-20T08:00:00Z'
  },
  {
    id: 'PRD-008', name: 'Wireless Bluetooth Headphones', sku: 'ELC-HPH-001',
    category: 'Electronics', category_id: 'CAT-005', product_type: 'simple', status: 'active',
    is_webstore_visible: true, is_pos_visible: true,
    base_price: 12500, sale_price: 9999, cost_price: 5500,
    stock_total: 18, low_stock_threshold: 5,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format',
    created_at: '2026-01-05T08:00:00Z'
  }
];

// ── Bootstrap ─────────────────────────────────────────────────────
init();
