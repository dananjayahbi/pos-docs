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
  try {
    const res  = await fetch('../../data/products.json');
    const data = await res.json();
    allProducts = data.products || [];
    categories  = data.categories || [];
    saveToStorage(allProducts);
  } catch (e) {
    console.warn('Could not load products.json, using demo data.', e);
    const stored = loadFromStorage();
    if (stored && stored.length > 0) {
      allProducts = stored;
      buildCategoriesFromProducts();
    } else {
      allProducts = DEMO_PRODUCTS || [];
      categories  = DEMO_CATEGORIES || [];
    }
  }
  boot();
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
  const archived  = allProducts.filter(p => p.status === 'archived').length;
  const lowStock  = allProducts.filter(p => {
    const qty = p.stock_total ?? 0;
    return qty > 0 && qty <= (p.low_stock_threshold ?? 10);
  }).length;
  const outOfStock = allProducts.filter(p => (p.stock_total ?? 0) <= 0).length;

  document.getElementById('statTotal').textContent    = total;
  document.getElementById('statActive').textContent   = active;
  document.getElementById('statDraft').textContent    = draft;
  document.getElementById('statLowStock').textContent = lowStock;

  const archivedSub = document.getElementById('statArchivedSub');
  if (archivedSub) archivedSub.textContent = archived > 0 ? `${archived} archived` : 'None archived';

  const activePercent = document.getElementById('statActivePercent');
  if (activePercent) activePercent.textContent = total > 0 ? Math.round((active / total) * 100) + '% of catalog' : '—';

  const lowStockSub = document.getElementById('statLowStockSub');
  if (lowStockSub) lowStockSub.textContent = outOfStock > 0 ? `${outOfStock} out of stock` : 'All in stock';
}

// ── Filter / Sort ─────────────────────────────────────────────────

function applyFilters() {
  const q         = document.getElementById('searchInput').value.trim().toLowerCase();
  const catVal    = document.getElementById('filterCategory').value;
  const typeVal   = document.getElementById('filterType').value;
  const statVal   = document.getElementById('filterStatus').value;
  const stockVal  = document.getElementById('filterStock') ? document.getElementById('filterStock').value : '';

  filtered = allProducts.filter(p => {
    const matchQ    = !q || p.name.toLowerCase().includes(q) || (p.sku||'').toLowerCase().includes(q) || (p.barcode||'').toLowerCase().includes(q);
    const matchCat  = !catVal  || p.category === catVal;
    const matchType = !typeVal || p.product_type === typeVal;
    const matchStat = !statVal || p.status === statVal;
    let matchStock  = true;
    if (stockVal === 'in_stock')     matchStock = (p.stock_total ?? 0) > (p.low_stock_threshold ?? 10);
    if (stockVal === 'low_stock')    matchStock = (p.stock_total ?? 0) > 0 && (p.stock_total ?? 0) <= (p.low_stock_threshold ?? 10);
    if (stockVal === 'out_of_stock') matchStock = (p.stock_total ?? 0) <= 0;
    return matchQ && matchCat && matchType && matchStat && matchStock;
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

  // Show/hide reset button and active filter count badge
  const hasFilter = q || catVal || typeVal || statVal || stockVal;
  const resetBtn  = document.getElementById('btnResetFilters');
  if (resetBtn) resetBtn.style.display = hasFilter ? '' : 'none';

  const activeBadge = document.getElementById('filterActiveCount');
  if (activeBadge) {
    const count = [q, catVal, typeVal, statVal, stockVal].filter(Boolean).length;
    if (count > 0) {
      activeBadge.textContent = count + ' filter' + (count > 1 ? 's' : '') + ' active';
      activeBadge.style.display = '';
    } else {
      activeBadge.style.display = 'none';
    }
  }

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
          <button class="action-btn" title="View Details" onclick="openViewProductModal('${p.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="action-btn edit" title="Edit" onclick="openEditModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
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
        <button class="action-btn" title="View Details" onclick="openViewProductModal('${p.id}')"><i class="fa-solid fa-eye"></i></button>
        <button class="action-btn edit" title="Edit" onclick="openEditModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
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

// ── View product — handled by openViewProductModal below ────────────

// ── Escape HTML ───────────────────────────────────────────────────

function esc(str) {
  return String(str ?? '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

// ── Event binding ─────────────────────────────────────────────────

function bindEvents() {
  // Add Product button
  document.getElementById('btnAddProduct').addEventListener('click', openAddModal);

  // Import / Export
  document.getElementById('btnImport')?.addEventListener('click', openImportModal);
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
  document.getElementById('filterStock')?.addEventListener('change', applyFilters);

  // Reset filters button
  document.getElementById('btnResetFilters')?.addEventListener('click', function() {
    document.getElementById('searchInput').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterType').value = '';
    document.getElementById('filterStatus').value = '';
    const filterStock = document.getElementById('filterStock');
    if (filterStock) filterStock.value = '';
    applyFilters();
  });

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
    if (e.key === 'Escape') {
      closeProductModal();
      closeDeleteModal();
      closeImportModal();
      closeViewProductModal();
    }
  });

  bindImportModalEvents();
  bindViewProductModalEvents();
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

// ── Import Modal ──────────────────────────────────────────────────

let _importStep  = 1;
let _importFile  = null;
let _importRows  = [];

function openImportModal() {
  _importStep = 1;
  _importFile = null;
  _importRows = [];
  showImportStep(1);
  document.getElementById('importFileInput').value = '';
  document.getElementById('importFileName').style.display = 'none';
  document.getElementById('importNextBtn').disabled = true;
  document.getElementById('importNextBtn').innerHTML = '<i class="fa-solid fa-arrow-right"></i> Next';
  document.getElementById('importNextBtn').onclick = null;
  document.getElementById('cancelImportModal').style.display = '';
  document.getElementById('importModalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeImportModal() {
  const backdrop = document.getElementById('importModalBackdrop');
  if (backdrop) { backdrop.classList.remove('open'); }
  document.body.style.overflow = '';
}

function showImportStep(step) {
  _importStep = step;
  [1, 2, 3].forEach(function(s) {
    const panel = document.getElementById('importStep' + s);
    const ind   = document.getElementById('importStep' + s + 'Ind');
    if (panel) panel.style.display = s === step ? '' : 'none';
    if (ind) {
      ind.classList.remove('active', 'done');
      if (s < step) ind.classList.add('done');
      if (s === step) ind.classList.add('active');
    }
  });
}

function downloadImportTemplate(e) {
  e.preventDefault();
  const csv = 'name,sku,category,product_type,status,base_price,sale_price,cost_price,stock_total,description\n' +
    '"Sample Product","SKU-001","Men\'s Clothing","simple","active","1500","1299","600","50","Sample description"\n';
  const blob = new Blob([csv], { type: 'text/csv' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'lcc_products_import_template.csv';
  a.click();
}

function handleImportFileSelect(file) {
  if (!file) return;
  _importFile = file;
  const nameEl = document.getElementById('importFileName');
  nameEl.textContent = '\ud83d\udcc4 ' + file.name + ' (' + (file.size / 1024).toFixed(1) + ' KB)';
  nameEl.style.display = '';
  document.getElementById('importNextBtn').disabled = false;

  const reader = new FileReader();
  reader.onload = function(ev) {
    const lines = ev.target.result.split('\n').filter(Boolean);
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
    _importRows = lines.slice(1).map(function(line) {
      const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const row = {};
      headers.forEach((h, i) => { row[h] = vals[i] || ''; });
      return row;
    }).filter(r => r.name || r.sku);
  };
  reader.readAsText(file);
}

function bindImportModalEvents() {
  const fileInput = document.getElementById('importFileInput');
  fileInput?.addEventListener('change', function() {
    if (this.files[0]) handleImportFileSelect(this.files[0]);
  });

  const dropzone = document.getElementById('importDropzone');
  if (dropzone) {
    dropzone.addEventListener('dragover', function(e) { e.preventDefault(); this.classList.add('drag-over'); });
    dropzone.addEventListener('dragleave', function() { this.classList.remove('drag-over'); });
    dropzone.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('drag-over');
      const file = e.dataTransfer.files[0];
      if (file) { document.getElementById('importFileInput').files = e.dataTransfer.files; handleImportFileSelect(file); }
    });
  }

  document.getElementById('closeImportModal')?.addEventListener('click', closeImportModal);
  document.getElementById('cancelImportModal')?.addEventListener('click', closeImportModal);
  document.getElementById('importModalBackdrop')?.addEventListener('click', function(e) { if (e.target === this) closeImportModal(); });

  document.getElementById('importNextBtn')?.addEventListener('click', function() {
    if (_importStep === 1) {
      const tbody = document.getElementById('importPreviewBody');
      if (_importRows.length > 0 && tbody) {
        tbody.innerHTML = _importRows.slice(0, 10).map(r => `
          <tr>
            <td style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--color-neutral-100);">${r.name || '\u2014'}</td>
            <td style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--color-neutral-100);font-family:monospace;font-size:0.75rem;">${r.sku || '\u2014'}</td>
            <td style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--color-neutral-100);">${r.category || '\u2014'}</td>
            <td style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--color-neutral-100);text-align:right;">\u20a8 ${parseFloat(r.base_price||0).toLocaleString('en-LK')}</td>
            <td style="padding:0.5rem 0.75rem;border-bottom:1px solid var(--color-neutral-100);text-align:center;"><span class="status-badge ${r.status==='active'?'status-active':'status-draft'}">${r.status||'draft'}</span></td>
          </tr>
        `).join('');
        const msgEl = document.getElementById('importPreviewMsg');
        if (msgEl) msgEl.textContent = `${_importRows.length} product(s) ready to import${_importRows.length > 10 ? ' (showing first 10)' : ''}`;
      } else {
        if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="padding:1.5rem;text-align:center;color:var(--color-neutral-400);">No valid rows found in file</td></tr>';
        const msgEl = document.getElementById('importPreviewMsg');
        if (msgEl) {
          msgEl.parentElement.style.background = '#fef2f2';
          msgEl.parentElement.style.borderColor = '#fecaca';
          msgEl.parentElement.style.color = '#b91c1c';
          msgEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="margin-right:0.375rem;"></i>No valid product rows found.';
        }
      }
      showImportStep(2);
      this.innerHTML = '<i class="fa-solid fa-file-import"></i> Confirm Import';
    } else if (_importStep === 2) {
      this.disabled = true;
      this.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Importing\u2026';
      const btn = this;
      setTimeout(() => {
        showImportStep(3);
        document.getElementById('cancelImportModal').style.display = 'none';
        btn.innerHTML = '<i class="fa-solid fa-check"></i> Done';
        btn.disabled = false;
        btn.onclick = closeImportModal;
        if (window.Toast) Toast.success('Import Successful', `${_importRows.length} product(s) imported successfully.`);
        else if (typeof showToast === 'function') showToast(`${_importRows.length} product(s) imported`, 'success');
      }, 1200);
    }
  });
}


// ── View Product Modal ────────────────────────────────────────────

let _viewProductId = null;

function openViewProductModal(id) {
  const p = allProducts.find(pr => pr.id === id);
  if (!p) return;
  _viewProductId = id;

  document.getElementById('viewProductModalTitle').textContent = p.name;
  document.getElementById('viewProductModalSub').textContent   = `SKU: ${p.sku || '\u2014'} \u00b7 ${p.product_type || 'simple'} \u00b7 ${p.category || 'Uncategorized'}`;

  const variantsHTML = p.variants && p.variants.length ? `
    <div style="margin-top:1.25rem;">
      <div style="font-size:0.75rem;font-weight:700;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.05em;margin-bottom:0.625rem;">Variants (${p.variants.length})</div>
      <div style="border:1px solid var(--color-neutral-200);border-radius:var(--radius);overflow:hidden;">
        <table style="width:100%;border-collapse:collapse;font-size:0.78125rem;">
          <thead>
            <tr style="background:var(--color-neutral-50);">
              <th style="padding:0.5rem 0.75rem;text-align:left;font-weight:600;color:var(--color-neutral-500);border-bottom:1px solid var(--color-neutral-200);">SKU</th>
              <th style="padding:0.5rem 0.75rem;text-align:left;font-weight:600;color:var(--color-neutral-500);border-bottom:1px solid var(--color-neutral-200);">Attributes</th>
              <th style="padding:0.5rem 0.75rem;text-align:right;font-weight:600;color:var(--color-neutral-500);border-bottom:1px solid var(--color-neutral-200);">Price</th>
              <th style="padding:0.5rem 0.75rem;text-align:right;font-weight:600;color:var(--color-neutral-500);border-bottom:1px solid var(--color-neutral-200);">Stock</th>
            </tr>
          </thead>
          <tbody>
            ${p.variants.map(v => `
              <tr style="border-bottom:1px solid var(--color-neutral-100);">
                <td style="padding:0.5rem 0.75rem;font-family:monospace;font-size:0.75rem;color:var(--color-neutral-600);">${v.sku || '\u2014'}</td>
                <td style="padding:0.5rem 0.75rem;">${Object.entries(v.attributes||{}).map(([k,val]) => `<span style="background:#f3f4f6;padding:0.1rem 0.4rem;border-radius:3px;font-size:0.7rem;margin-right:0.25rem;">${k}: ${val}</span>`).join('')}</td>
                <td style="padding:0.5rem 0.75rem;text-align:right;font-weight:600;">\u20a8 ${Number(v.price||0).toLocaleString('en-LK')}</td>
                <td style="padding:0.5rem 0.75rem;text-align:right;">${v.stock ?? '\u2014'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    </div>
  ` : '';

  const salePriceDisplay = p.sale_price
    ? '\u20a8 ' + Number(p.sale_price).toLocaleString('en-LK')
    : '<span style="color:var(--color-neutral-400);font-size:0.875rem;">Not set</span>';
  const costPriceDisplay = p.cost_price
    ? '\u20a8 ' + Number(p.cost_price).toLocaleString('en-LK')
    : '<span style="color:var(--color-neutral-400);font-size:0.875rem;">Not set</span>';

  const saleBg     = p.sale_price && p.sale_price < p.base_price ? '#dcfce7' : 'var(--color-neutral-50)';
  const saleBorder = p.sale_price && p.sale_price < p.base_price ? '#bbf7d0' : 'var(--color-neutral-200)';

  document.getElementById('viewProductModalBody').innerHTML = `
    <div style="display:flex;gap:1.25rem;align-items:flex-start;margin-bottom:1.5rem;flex-wrap:wrap;">
      <img src="${imgSrc(p)}" alt="${esc(p.name)}" style="width:96px;height:96px;object-fit:cover;border-radius:10px;flex-shrink:0;border:1px solid var(--color-neutral-200);"
           onerror="this.src='https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=200&h=200&fit=crop';" />
      <div style="flex:1;min-width:160px;">
        <div style="display:flex;align-items:center;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.5rem;">
          <span class="status-badge ${statusBadgeClass(p.status)}">${p.status || 'draft'}</span>
          <span class="type-badge ${typeBadgeClass(p.product_type)}">${p.product_type || 'simple'}</span>
          ${p.tags && p.tags.length ? p.tags.map(t => `<span style="background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;padding:0.15rem 0.5rem;border-radius:99px;font-size:0.7rem;font-weight:600;">${t}</span>`).join('') : ''}
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.375rem 1rem;font-size:0.8125rem;">
          <div><span style="color:var(--color-neutral-400);font-weight:500;">Brand:</span> <span style="color:var(--color-neutral-800);">${p.brand || '\u2014'}</span></div>
          <div><span style="color:var(--color-neutral-400);font-weight:500;">Barcode:</span> <span style="color:var(--color-neutral-800);font-family:monospace;font-size:0.75rem;">${p.barcode || '\u2014'}</span></div>
          <div><span style="color:var(--color-neutral-400);font-weight:500;">Tax Class:</span> <span style="color:var(--color-neutral-800);">${p.tax_class || '\u2014'}</span></div>
          <div><span style="color:var(--color-neutral-400);font-weight:500;">Unit:</span> <span style="color:var(--color-neutral-800);">${p.unit_of_measure || '\u2014'}</span></div>
        </div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1.25rem;">
      <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:var(--radius);padding:0.75rem;text-align:center;">
        <div style="font-size:0.7rem;font-weight:600;color:#c2410c;text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">Base Price</div>
        <div style="font-size:1.25rem;font-weight:800;color:#c2410c;">\u20a8 ${Number(p.base_price||0).toLocaleString('en-LK')}</div>
      </div>
      <div style="background:${saleBg};border:1px solid ${saleBorder};border-radius:var(--radius);padding:0.75rem;text-align:center;">
        <div style="font-size:0.7rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">Sale Price</div>
        <div style="font-size:1.25rem;font-weight:800;color:var(--color-neutral-700);">${salePriceDisplay}</div>
      </div>
      <div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:var(--radius);padding:0.75rem;text-align:center;">
        <div style="font-size:0.7rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">Cost Price</div>
        <div style="font-size:1.25rem;font-weight:800;color:var(--color-neutral-700);">${costPriceDisplay}</div>
      </div>
    </div>

    <div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:var(--radius);padding:0.875rem 1rem;margin-bottom:1.25rem;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
      <div>
        <div style="font-size:0.75rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">Stock</div>
        <div style="font-size:1.5rem;font-weight:800;color:${(p.stock_total||0) <= 0 ? '#dc2626' : (p.stock_total||0) <= (p.low_stock_threshold||10) ? '#d97706' : '#16a34a'};">
          ${p.stock_total ?? 0} <span style="font-size:0.875rem;font-weight:500;color:var(--color-neutral-500);">units</span>
        </div>
      </div>
      <div>
        <div style="font-size:0.75rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">Reorder Point</div>
        <div style="font-size:1.125rem;font-weight:700;color:var(--color-neutral-700);">${p.low_stock_threshold ?? 10} units</div>
      </div>
      <div>
        <div style="font-size:0.75rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">Visibility</div>
        <div style="display:flex;flex-direction:column;gap:0.25rem;">
          <span style="font-size:0.75rem;"><i class="fa-solid fa-cash-register" style="color:${p.is_pos_visible ? '#f97316' : '#d1d5db'};margin-right:0.25rem;"></i>${p.is_pos_visible ? 'Visible on POS' : 'Hidden from POS'}</span>
          <span style="font-size:0.75rem;"><i class="fa-solid fa-globe" style="color:${p.is_webstore_visible ? '#1d4ed8' : '#d1d5db'};margin-right:0.25rem;"></i>${p.is_webstore_visible ? 'Visible on Webstore' : 'Hidden from Webstore'}</span>
        </div>
      </div>
    </div>

    ${p.description ? `<div style="font-size:0.8125rem;color:var(--color-neutral-600);line-height:1.6;margin-bottom:1.25rem;padding:0.75rem 1rem;background:var(--color-neutral-50);border-radius:var(--radius);border:1px solid var(--color-neutral-200);"><span style="font-weight:600;color:var(--color-neutral-700);">Description:</span> ${p.description}</div>` : ''}

    ${variantsHTML}
  `;

  document.getElementById('viewProductModalBackdrop').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeViewProductModal() {
  const backdrop = document.getElementById('viewProductModalBackdrop');
  if (backdrop) backdrop.classList.remove('open');
  document.body.style.overflow = '';
  _viewProductId = null;
}

function bindViewProductModalEvents() {
  document.getElementById('closeViewProductModal')?.addEventListener('click', closeViewProductModal);
  document.getElementById('cancelViewProductModal')?.addEventListener('click', closeViewProductModal);
  document.getElementById('viewProductModalBackdrop')?.addEventListener('click', function(e) { if (e.target === this) closeViewProductModal(); });
  document.getElementById('viewProductEditBtn')?.addEventListener('click', function() {
    closeViewProductModal();
    if (_viewProductId) openEditModal(_viewProductId);
  });
}


// ── Bootstrap ─────────────────────────────────────────────────────
init();
