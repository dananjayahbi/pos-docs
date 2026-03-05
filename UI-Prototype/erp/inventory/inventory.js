/* ================================================================
   LCC Inventory Page — Main Controller
   ================================================================ */

const INV_PAGE_SIZE = 12;

let allInventory    = [];
let filteredInv     = [];
let invCurrentPage  = 1;
let _viewItemId     = null;
let _editItemId     = null;

// ── Demo Data (18 items for pagination demo) ──────────────────────

const WAREHOUSES = ['Colombo Main', 'Kandy Branch', 'Galle Store'];

allInventory = [
  { id: 'INV-001', product: 'Maliban Cream Cracker 200g',     category: 'Food & Beverage', sku: 'SKU-00124', warehouse: 'Colombo Main', location: 'A1-R3', on_hand: 540,  reserved: 60,  min_stock: 100, unit_cost: 120  },
  { id: 'INV-002', product: 'Dialog 4G WiFi Router',          category: 'Electronics',     sku: 'SKU-00287', warehouse: 'Colombo Main', location: 'C2-R1', on_hand: 18,   reserved: 5,   min_stock: 20,  unit_cost: 8500 },
  { id: 'INV-003', product: 'Hemas Baby Lotion 200ml',        category: 'Household',       sku: 'SKU-00391', warehouse: 'Kandy Branch', location: 'B4-R2', on_hand: 0,    reserved: 0,   min_stock: 50,  unit_cost: 380  },
  { id: 'INV-004', product: 'Batik Sarong — Blue Stripe',     category: 'Clothing',        sku: 'SKU-00452', warehouse: 'Galle Store',  location: 'D1-R5', on_hand: 210,  reserved: 30,  min_stock: 40,  unit_cost: 750  },
  { id: 'INV-005', product: 'Elephant House Ginger Beer 330ml', category: 'Food & Beverage', sku: 'SKU-00503', warehouse: 'Colombo Main', location: 'A3-R1', on_hand: 1200, reserved: 150, min_stock: 200, unit_cost: 85   },
  { id: 'INV-006', product: 'Singer Ceiling Fan 56"',         category: 'Electronics',     sku: 'SKU-00617', warehouse: 'Kandy Branch', location: 'E2-R3', on_hand: 14,   reserved: 3,   min_stock: 15,  unit_cost: 12500},
  { id: 'INV-007', product: 'Munchee Chocolate Puff 100g',    category: 'Food & Beverage', sku: 'SKU-00742', warehouse: 'Colombo Main', location: 'A2-R4', on_hand: 875,  reserved: 100, min_stock: 150, unit_cost: 95   },
  { id: 'INV-008', product: 'Kandyan Handloom Cushion Cover', category: 'Household',       sku: 'SKU-00881', warehouse: 'Galle Store',  location: 'D3-R2', on_hand: 62,   reserved: 10,  min_stock: 25,  unit_cost: 1200 },
  { id: 'INV-009', product: 'Classic White Cotton T-Shirt M', category: 'Clothing',        sku: 'TSH-WHT-M', warehouse: 'Colombo Main', location: 'F1-R1', on_hand: 40,   reserved: 5,   min_stock: 15,  unit_cost: 600  },
  { id: 'INV-010', product: 'Siddhalepa Balm 25g',            category: 'Household',       sku: 'SKU-01022', warehouse: 'Kandy Branch', location: 'B2-R4', on_hand: 320,  reserved: 40,  min_stock: 60,  unit_cost: 220  },
  { id: 'INV-011', product: 'Lanka Tiles Floor Tile 60x60',   category: 'Household',       sku: 'SKU-01105', warehouse: 'Colombo Main', location: 'G4-R1', on_hand: 8,    reserved: 0,   min_stock: 20,  unit_cost: 1800 },
  { id: 'INV-012', product: 'Dialog Prepaid SIM Starter Pack', category: 'Electronics',   sku: 'SKU-01234', warehouse: 'Galle Store',  location: 'C1-R3', on_hand: 450,  reserved: 50,  min_stock: 80,  unit_cost: 100  },
  { id: 'INV-013', product: "Men's Slim Fit Trouser — Black 32", category: 'Clothing',    sku: 'TRS-BLK-32', warehouse: 'Kandy Branch', location: 'F3-R2', on_hand: 25,   reserved: 3,   min_stock: 10,  unit_cost: 1400 },
  { id: 'INV-014', product: 'Anchor Full Cream Milk Powder 1kg', category: 'Food & Beverage', sku: 'SKU-01387', warehouse: 'Colombo Main', location: 'A4-R2', on_hand: 0, reserved: 0,   min_stock: 30,  unit_cost: 2400 },
  { id: 'INV-015', product: 'SriTex Bath Towel — White',      category: 'Household',       sku: 'SKU-01456', warehouse: 'Galle Store',  location: 'D2-R1', on_hand: 130,  reserved: 20,  min_stock: 25,  unit_cost: 650  },
  { id: 'INV-016', product: "Women's Batik Blouse — Medium",  category: 'Clothing',        sku: 'BLO-BAT-M', warehouse: 'Colombo Main', location: 'F2-R3', on_hand: 7,    reserved: 2,   min_stock: 10,  unit_cost: 1100 },
  { id: 'INV-017', product: 'Nescafe Gold 200g Tin',          category: 'Food & Beverage', sku: 'SKU-01589', warehouse: 'Kandy Branch', location: 'A1-R5', on_hand: 0,    reserved: 0,   min_stock: 20,  unit_cost: 1850 },
  { id: 'INV-018', product: 'Abans Electric Iron 1000W',      category: 'Electronics',     sku: 'SKU-01672', warehouse: 'Colombo Main', location: 'C3-R2', on_hand: 35,   reserved: 5,   min_stock: 10,  unit_cost: 3200 },
];

// ── Derived Fields ────────────────────────────────────────────────

function computeItem(item) {
  const available = Math.max(0, item.on_hand - item.reserved);
  let status = 'In Stock';
  if (item.on_hand <= 0) status = 'Out of Stock';
  else if (item.on_hand <= item.min_stock) status = 'Low Stock';
  return { ...item, available, status };
}

function getAllComputed() {
  return allInventory.map(computeItem);
}

// ── KPI Cards ────────────────────────────────────────────────────

function updateKPIs() {
  const computed = getAllComputed();
  const total      = computed.length;
  const lowStock   = computed.filter(i => i.status === 'Low Stock').length;
  const outOfStock = computed.filter(i => i.status === 'Out of Stock').length;
  const totalValue = computed.reduce((sum, i) => sum + (i.on_hand * (i.unit_cost || 0)), 0);

  setEl('kpiTotalSKUs', total);
  setEl('kpiLowStock', lowStock);
  setEl('kpiOutOfStock', outOfStock);

  let valStr;
  if (totalValue >= 1000000) valStr = '\u20a8 ' + (totalValue / 1000000).toFixed(1) + 'M';
  else if (totalValue >= 1000) valStr = '\u20a8 ' + (totalValue / 1000).toFixed(0) + 'K';
  else valStr = '\u20a8 ' + totalValue.toLocaleString('en-LK');
  setEl('kpiTotalValue', valStr);

  const sub1 = document.getElementById('kpiTotalSub');
  if (sub1) sub1.textContent = WAREHOUSES.length + ' warehouse' + (WAREHOUSES.length > 1 ? 's' : '');
  const sub2 = document.getElementById('kpiLowStockSub');
  if (sub2) sub2.textContent = lowStock > 0 ? 'Need restocking soon' : 'All items stocked';
  const sub3 = document.getElementById('kpiOutOfStockSub');
  if (sub3) sub3.textContent = outOfStock > 0 ? 'Require urgent attention' : 'None out of stock';
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Filter & Render ───────────────────────────────────────────────

function applyFilters() {
  const q   = (document.getElementById('searchInput')?.value || '').trim().toLowerCase();
  const wh  = document.getElementById('warehouseFilter')?.value || '';
  const cat = document.getElementById('categoryFilter')?.value  || '';
  const st  = document.getElementById('statusFilter')?.value    || '';

  const computed = getAllComputed();
  filteredInv = computed.filter(item => {
    const matchQ   = !q  || item.product.toLowerCase().includes(q) || item.sku.toLowerCase().includes(q);
    const matchWH  = !wh || item.warehouse === wh;
    const matchCat = !cat|| item.category === cat;
    const matchSt  = !st || item.status === st;
    return matchQ && matchWH && matchCat && matchSt;
  });

  invCurrentPage = 1;
  renderTable();
  renderPagination();

  const hasFilter = q || wh || cat || st;
  const resetBtn = document.getElementById('btnResetFilters');
  if (resetBtn) resetBtn.classList.toggle('visible', !!hasFilter);
}

function getStatusBadge(status) {
  if (status === 'In Stock')     return '<span class="badge badge-green">In Stock</span>';
  if (status === 'Low Stock')    return '<span class="badge badge-yellow">Low Stock</span>';
  if (status === 'Out of Stock') return '<span class="badge badge-red">Out of Stock</span>';
  return '<span class="badge">' + status + '</span>';
}

function renderTable() {
  const tbody = document.getElementById('invTableBody');
  if (!tbody) return;

  const total = filteredInv.length;
  const start = (invCurrentPage - 1) * INV_PAGE_SIZE;
  const slice = filteredInv.slice(start, start + INV_PAGE_SIZE);

  const emptyState     = document.getElementById('invEmptyState');
  const paginationWrap = document.getElementById('invPaginationWrap');

  if (total === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.style.display = '';
    if (paginationWrap) paginationWrap.style.display = 'none';
    setEl('invPaginationInfo', 'Showing 0 of 0 items');
    return;
  }
  if (emptyState) emptyState.style.display = 'none';
  if (paginationWrap) paginationWrap.style.display = '';

  const showing = Math.min(start + INV_PAGE_SIZE, total);
  setEl('invPaginationInfo', 'Showing ' + (start + 1) + '\u2013' + showing + ' of ' + total + ' items');

  tbody.innerHTML = slice.map(item => `
    <tr>
      <td>
        <strong>${item.product}</strong><br />
        <small style="color:var(--color-neutral-500);">${item.category}</small>
      </td>
      <td class="sku-code" style="font-family:monospace;font-size:0.8rem;">${item.sku}</td>
      <td>${item.warehouse}</td>
      <td>${item.location}</td>
      <td style="font-weight:600;">${item.on_hand.toLocaleString()}</td>
      <td style="color:var(--color-neutral-500);">${item.reserved.toLocaleString()}</td>
      <td style="font-weight:600;color:${item.available <= 0 ? '#dc2626' : 'inherit'};">${item.available.toLocaleString()}</td>
      <td>${item.min_stock.toLocaleString()}</td>
      <td style="font-size:0.8rem;color:var(--color-neutral-600);">&#8360; ${Number(item.unit_cost || 0).toLocaleString('en-LK')}</td>
      <td>${getStatusBadge(item.status)}</td>
      <td>
        <button class="act-btn" title="Edit" onclick="openEditItemModal('${item.id}')">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="act-btn" title="View" onclick="openViewItemModal('${item.id}')">
          <i class="fa-solid fa-eye"></i>
        </button>
      </td>
    </tr>
  `).join('');
}

function renderPagination() {
  const total      = filteredInv.length;
  const totalPages = Math.ceil(total / INV_PAGE_SIZE);
  const ctrl       = document.getElementById('invPaginationControls');
  if (!ctrl) return;

  if (totalPages <= 1) { ctrl.innerHTML = ''; return; }

  const btns = [];
  btns.push(`<button class="inv-page-btn" onclick="invGoPage(${invCurrentPage - 1})" ${invCurrentPage === 1 ? 'disabled' : ''}><i class="fa-solid fa-chevron-left"></i></button>`);
  for (let p = 1; p <= totalPages; p++) {
    btns.push(`<button class="inv-page-btn ${p === invCurrentPage ? 'active' : ''}" onclick="invGoPage(${p})">${p}</button>`);
  }
  btns.push(`<button class="inv-page-btn" onclick="invGoPage(${invCurrentPage + 1})" ${invCurrentPage === totalPages ? 'disabled' : ''}><i class="fa-solid fa-chevron-right"></i></button>`);
  ctrl.innerHTML = btns.join('');
}

function invGoPage(p) {
  const totalPages = Math.ceil(filteredInv.length / INV_PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  invCurrentPage = p;
  renderTable();
  renderPagination();
}

// ── Populate product selects ──────────────────────────────────────

function populateProductSelects() {
  const options = allInventory.map(i => `<option value="${i.id}">${i.product} (${i.sku})</option>`).join('');
  ['siProduct', 'soProduct', 'adjProduct'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.innerHTML = '<option value="">— Select Product —</option>' + options;
  });
}

// ── Stock In Modal ────────────────────────────────────────────────

function openStockInModal() {
  populateProductSelects();
  document.getElementById('siProduct').value   = '';
  document.getElementById('siWarehouse').value = 'Colombo Main';
  document.getElementById('siQty').value       = 1;
  document.getElementById('siUnitCost').value  = '';
  document.getElementById('siDate').value      = new Date().toISOString().split('T')[0];
  document.getElementById('siReference').value = '';
  document.getElementById('siNotes').value     = '';
  document.getElementById('stockInModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStockInModal() {
  document.getElementById('stockInModal').classList.remove('open');
  document.body.style.overflow = '';
}

function confirmStockIn() {
  const productId = document.getElementById('siProduct').value;
  const qty       = parseInt(document.getElementById('siQty').value);
  if (!productId) { showToastMsg('Please select a product', 'warning'); return; }
  if (!qty || qty <= 0) { showToastMsg('Please enter a valid quantity', 'warning'); return; }

  const item = allInventory.find(i => i.id === productId);
  if (item) {
    item.on_hand += qty;
    const unitCost = parseFloat(document.getElementById('siUnitCost').value);
    if (!isNaN(unitCost) && unitCost > 0) item.unit_cost = unitCost;
  }

  closeStockInModal();
  updateKPIs();
  applyFilters();
  showToastMsg('Stock In recorded: +' + qty + ' units for ' + (item ? item.product : productId), 'success');
}

// ── Stock Out Modal ───────────────────────────────────────────────

function openStockOutModal() {
  populateProductSelects();
  document.getElementById('soProduct').value   = '';
  document.getElementById('soWarehouse').value = 'Colombo Main';
  document.getElementById('soQty').value       = 1;
  document.getElementById('soReason').value    = '';
  document.getElementById('soDate').value      = new Date().toISOString().split('T')[0];
  document.getElementById('soReference').value = '';
  document.getElementById('soNotes').value     = '';
  document.getElementById('stockOutModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeStockOutModal() {
  document.getElementById('stockOutModal').classList.remove('open');
  document.body.style.overflow = '';
}

function confirmStockOut() {
  const productId = document.getElementById('soProduct').value;
  const qty       = parseInt(document.getElementById('soQty').value);
  const reason    = document.getElementById('soReason').value;
  if (!productId) { showToastMsg('Please select a product', 'warning'); return; }
  if (!qty || qty <= 0) { showToastMsg('Please enter a valid quantity', 'warning'); return; }
  if (!reason) { showToastMsg('Please select a reason', 'warning'); return; }

  const item = allInventory.find(i => i.id === productId);
  if (item) {
    if (qty > item.on_hand) {
      showToastMsg('Insufficient stock. Only ' + item.on_hand + ' units available.', 'warning');
      return;
    }
    item.on_hand -= qty;
  }

  closeStockOutModal();
  updateKPIs();
  applyFilters();
  showToastMsg('Stock Out recorded: -' + qty + ' units for ' + (item ? item.product : productId), 'success');
}

// ── Adjust Stock Modal ────────────────────────────────────────────

let _adjItemId = null;

function openAdjustStockModal(itemId) {
  populateProductSelects();
  _adjItemId = itemId;

  if (itemId) {
    const item = allInventory.find(i => i.id === itemId);
    if (item) {
      document.getElementById('adjProduct').value             = itemId;
      document.getElementById('adjWarehouse').value           = item.warehouse;
      document.getElementById('adjCurrentStock').textContent  = item.on_hand + ' units';
      document.getElementById('adjQty').value                 = item.on_hand;
      document.getElementById('adjDelta').textContent         = '0 (no change)';
    }
  } else {
    document.getElementById('adjProduct').value             = '';
    document.getElementById('adjCurrentStock').textContent  = '—';
    document.getElementById('adjQty').value                 = '';
    document.getElementById('adjDelta').textContent         = '—';
  }

  document.getElementById('adjType').value      = 'adjustment';
  document.getElementById('adjDate').value      = new Date().toISOString().split('T')[0];
  document.getElementById('adjReference').value = '';
  document.getElementById('adjNotes').value     = '';

  document.getElementById('adjProduct').onchange = function() {
    const it = allInventory.find(i => i.id === this.value);
    const cs = document.getElementById('adjCurrentStock');
    if (it) {
      cs.textContent = it.on_hand + ' units';
      document.getElementById('adjQty').value = it.on_hand;
      adjUpdateDelta();
    } else {
      cs.textContent = '—';
    }
  };

  document.getElementById('adjustStockModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeAdjustStockModal() {
  document.getElementById('adjustStockModal').classList.remove('open');
  document.body.style.overflow = '';
  _adjItemId = null;
}

function adjUpdateDelta() {
  const productId = document.getElementById('adjProduct').value;
  const newQty    = parseInt(document.getElementById('adjQty').value);
  const item      = allInventory.find(i => i.id === productId);
  const deltaEl   = document.getElementById('adjDelta');
  if (!deltaEl) return;
  if (item && !isNaN(newQty)) {
    const delta = newQty - item.on_hand;
    deltaEl.textContent = (delta >= 0 ? '+' : '') + delta + ' units';
    deltaEl.style.color = delta > 0 ? '#16a34a' : delta < 0 ? '#dc2626' : 'var(--color-neutral-700)';
  } else {
    deltaEl.textContent = '—';
    deltaEl.style.color = '';
  }
}

function confirmAdjustStock() {
  const productId = document.getElementById('adjProduct').value;
  const newQty    = parseInt(document.getElementById('adjQty').value);
  const notes     = document.getElementById('adjNotes').value.trim();
  if (!productId) { showToastMsg('Please select a product', 'warning'); return; }
  if (isNaN(newQty) || newQty < 0) { showToastMsg('Please enter a valid adjusted quantity', 'warning'); return; }
  if (!notes) { showToastMsg('Please enter a reason for this adjustment', 'warning'); return; }

  const item = allInventory.find(i => i.id === productId);
  if (item) {
    const oldQty = item.on_hand;
    item.on_hand = newQty;
    closeAdjustStockModal();
    updateKPIs();
    applyFilters();
    const delta = newQty - oldQty;
    showToastMsg('Stock adjusted: ' + item.product + ' \u2014 ' + oldQty + ' \u2192 ' + newQty + ' (' + (delta >= 0 ? '+' : '') + delta + ')', 'success');
  }
}

// ── View Item Modal ───────────────────────────────────────────────

function openViewItemModal(id) {
  const item = getAllComputed().find(i => i.id === id);
  if (!item) return;
  _viewItemId = id;

  setEl('viewItemTitle', item.product);
  setEl('viewItemSub', item.sku + ' \u00b7 ' + item.warehouse + ' \u00b7 ' + item.location);

  const stockColor = item.status === 'Out of Stock' ? '#dc2626' : item.status === 'Low Stock' ? '#d97706' : '#16a34a';
  const body = document.getElementById('viewItemBody');
  body.innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0.75rem;margin-bottom:1.25rem;">
      <div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:8px;padding:0.75rem;text-align:center;">
        <div style="font-size:0.7rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">On Hand</div>
        <div style="font-size:1.75rem;font-weight:800;color:${stockColor};">${item.on_hand.toLocaleString()}</div>
        <div style="font-size:0.7rem;color:var(--color-neutral-400);">units</div>
      </div>
      <div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:8px;padding:0.75rem;text-align:center;">
        <div style="font-size:0.7rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">Reserved</div>
        <div style="font-size:1.75rem;font-weight:800;color:var(--color-neutral-700);">${item.reserved.toLocaleString()}</div>
        <div style="font-size:0.7rem;color:var(--color-neutral-400);">units</div>
      </div>
      <div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:8px;padding:0.75rem;text-align:center;">
        <div style="font-size:0.7rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.25rem;">Available</div>
        <div style="font-size:1.75rem;font-weight:800;color:${item.available <= 0 ? '#dc2626' : '#16a34a'};">${item.available.toLocaleString()}</div>
        <div style="font-size:0.7rem;color:var(--color-neutral-400);">units</div>
      </div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:0.75rem;margin-bottom:1.25rem;">
      <div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:8px;padding:0.75rem;">
        <div style="font-size:0.7rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.5rem;">Product Info</div>
        <div style="font-size:0.8125rem;display:grid;gap:0.25rem;">
          <div><span style="color:var(--color-neutral-500);">Category:</span> <strong>${item.category}</strong></div>
          <div><span style="color:var(--color-neutral-500);">SKU:</span> <code style="background:#f3f4f6;padding:0.1rem 0.4rem;border-radius:3px;font-size:0.75rem;">${item.sku}</code></div>
          <div><span style="color:var(--color-neutral-500);">Status:</span> ${getStatusBadge(item.status)}</div>
        </div>
      </div>
      <div style="background:var(--color-neutral-50);border:1px solid var(--color-neutral-200);border-radius:8px;padding:0.75rem;">
        <div style="font-size:0.7rem;font-weight:600;color:var(--color-neutral-400);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:0.5rem;">Location &amp; Cost</div>
        <div style="font-size:0.8125rem;display:grid;gap:0.25rem;">
          <div><span style="color:var(--color-neutral-500);">Warehouse:</span> <strong>${item.warehouse}</strong></div>
          <div><span style="color:var(--color-neutral-500);">Location:</span> <strong>${item.location}</strong></div>
          <div><span style="color:var(--color-neutral-500);">Min Stock:</span> <strong>${item.min_stock} units</strong></div>
          <div><span style="color:var(--color-neutral-500);">Unit Cost:</span> <strong>&#8360; ${Number(item.unit_cost || 0).toLocaleString('en-LK')}</strong></div>
        </div>
      </div>
    </div>

    <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;padding:0.75rem 1rem;font-size:0.8125rem;display:flex;justify-content:space-between;align-items:center;">
      <div><span style="color:#92400e;font-weight:600;">Total Stock Value:</span></div>
      <div style="font-size:1.125rem;font-weight:800;color:#c2410c;">&#8360; ${(item.on_hand * (item.unit_cost || 0)).toLocaleString('en-LK')}</div>
    </div>
  `;

  document.getElementById('viewItemModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeViewItemModal() {
  document.getElementById('viewItemModal').classList.remove('open');
  document.body.style.overflow = '';
  _viewItemId = null;
}

function editItemFromView() {
  const id = _viewItemId;
  closeViewItemModal();
  if (id) openEditItemModal(id);
}

function adjustFromView() {
  const id = _viewItemId;
  closeViewItemModal();
  if (id) openAdjustStockModal(id);
}

// ── Edit Item Modal ───────────────────────────────────────────────

function openEditItemModal(id) {
  const item = allInventory.find(i => i.id === id);
  if (!item) return;
  _editItemId = id;

  document.getElementById('editItemId').value        = id;
  document.getElementById('editItemProduct').value   = item.product;
  document.getElementById('editItemSku').value       = item.sku;
  document.getElementById('editItemWarehouse').value = item.warehouse;
  document.getElementById('editItemLocation').value  = item.location;
  document.getElementById('editItemMinStock').value  = item.min_stock;
  document.getElementById('editItemReserved').value  = item.reserved;
  document.getElementById('editItemUnitCost').value  = item.unit_cost || 0;

  document.getElementById('editItemModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeEditItemModal() {
  document.getElementById('editItemModal').classList.remove('open');
  document.body.style.overflow = '';
  _editItemId = null;
}

function confirmEditItem() {
  const id   = document.getElementById('editItemId').value;
  const item = allInventory.find(i => i.id === id);
  if (!item) return;

  item.sku       = document.getElementById('editItemSku').value.trim()        || item.sku;
  item.warehouse = document.getElementById('editItemWarehouse').value;
  item.location  = document.getElementById('editItemLocation').value.trim()   || item.location;
  item.min_stock = parseInt(document.getElementById('editItemMinStock').value) || item.min_stock;
  item.reserved  = parseInt(document.getElementById('editItemReserved').value) || 0;
  item.unit_cost = parseFloat(document.getElementById('editItemUnitCost').value) || item.unit_cost;

  closeEditItemModal();
  updateKPIs();
  applyFilters();
  showToastMsg(item.product + ' updated successfully', 'success');
}

// ── Toast helper ──────────────────────────────────────────────────

function showToastMsg(msg, type) {
  if (window.Toast) {
    const t = type || 'info';
    if (t === 'success')      Toast.success('Success', msg);
    else if (t === 'warning') Toast.warning('Warning', msg);
    else if (t === 'error')   Toast.error('Error', msg);
    else                      Toast.info('Info', msg);
  } else if (typeof showToast === 'function') {
    showToast(msg, type || 'info');
  }
}

// ── Bind Events & Init ────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function() {
  // Filter events
  document.getElementById('searchInput')?.addEventListener('input', applyFilters);
  document.getElementById('warehouseFilter')?.addEventListener('change', applyFilters);
  document.getElementById('categoryFilter')?.addEventListener('change', applyFilters);
  document.getElementById('statusFilter')?.addEventListener('change', applyFilters);
  document.getElementById('btnResetFilters')?.addEventListener('click', function() {
    document.getElementById('searchInput').value     = '';
    document.getElementById('warehouseFilter').value = '';
    document.getElementById('categoryFilter').value  = '';
    document.getElementById('statusFilter').value    = '';
    applyFilters();
  });

  // Modal backdrop-click-to-close
  ['stockInModal', 'stockOutModal', 'adjustStockModal', 'viewItemModal', 'editItemModal'].forEach(function(id) {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', function(e) {
      if (e.target === this) {
        const closeFns = {
          stockInModal:     closeStockInModal,
          stockOutModal:    closeStockOutModal,
          adjustStockModal: closeAdjustStockModal,
          viewItemModal:    closeViewItemModal,
          editItemModal:    closeEditItemModal
        };
        if (closeFns[id]) closeFns[id]();
      }
    });
  });

  // Initial render
  updateKPIs();
  applyFilters();
});
