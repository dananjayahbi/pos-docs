/**
 * new-order-modal.js — Shared New Order Modal
 * LankaCommerce Cloud ERP
 *
 * Injects the New Order modal into the DOM once on DOMContentLoaded.
 * Exposes all modal functions globally on window.
 * Supports window._nomOnConfirm(order, isDraft) for page-specific integration.
 */

// ── Module state ─────────────────────────────────────────────────────────────
let _nomItems     = [];
let _nomCustomer  = null;
let _nomCustomers = [];
let _nomProducts  = [];

// ── Modal HTML ────────────────────────────────────────────────────────────────
const _NOM_HTML = `
<div class="modal-backdrop" id="newOrderModal">
  <div class="modal-box">
    <div class="modal-header">
      <div class="modal-title"><i class="fa-solid fa-plus" style="color:#f97316;margin-right:0.5rem;"></i>New Sales Order</div>
      <button class="modal-close" onclick="closeNewOrderModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group" style="position:relative;">
        <label class="form-label">Customer <span class="req">*</span></label>
        <input type="text" class="form-input" id="customerSearchInput" placeholder="Search customer by name or phone…" autocomplete="off" oninput="searchCustomers(this.value)" />
        <div class="customer-suggestions" id="customerSuggestions"></div>
        <input type="hidden" id="selectedCustomerId" />
        <div id="selectedCustomerInfo" style="display:none;margin-top:0.375rem;padding:0.5rem 0.75rem;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:0.8125rem;">
          <span id="selectedCustomerName" style="font-weight:600;color:#ea580c;"></span>
          <span id="selectedCustomerPhone" style="color:var(--color-neutral-500);margin-left:0.5rem;"></span>
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Source</label>
          <select class="form-select" id="newOrderSource">
            <option value="manual">Manual</option>
            <option value="pos">POS</option>
            <option value="webstore">Webstore</option>
            <option value="whatsapp">WhatsApp</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Payment Method</label>
          <select class="form-select" id="newOrderPayMethod">
            <option value="cash">Cash</option>
            <option value="card">Credit/Debit Card</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="payhere">PayHere</option>
            <option value="webxpay">WebXPay</option>
            <option value="cod">Cash on Delivery</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <label class="form-label">Add Products <span class="req">*</span></label>
        <div class="product-search-wrap">
          <input type="text" class="form-input" id="productSearchInput" placeholder="Search by product name or barcode…" autocomplete="off" oninput="searchProducts(this.value)" />
          <div class="product-suggestions" id="productSuggestions"></div>
        </div>
      </div>
      <div id="newOrderItems" class="new-order-items"></div>
      <div class="form-row" style="margin-top:0.75rem;">
        <div class="form-group">
          <label class="form-label">Discount (LKR)</label>
          <input type="number" class="form-input" id="newOrderDiscount" min="0" value="0" oninput="recalcTotal()" placeholder="0.00" />
        </div>
        <div class="form-group">
          <label class="form-label">Delivery Charge (LKR)</label>
          <input type="number" class="form-input" id="newOrderDelivery" min="0" value="0" oninput="recalcTotal()" placeholder="0.00" />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:0.5rem;">
            <input type="checkbox" id="newOrderTaxEnabled" onchange="recalcTotal()" style="accent-color:#f97316;width:15px;height:15px;" />
            Apply Tax (18% VAT)
          </label>
        </div>
        <div class="form-group">
          <label class="form-label">Order Notes</label>
          <textarea class="form-textarea" id="newOrderNotes" placeholder="Internal notes…" style="min-height:52px;"></textarea>
        </div>
      </div>
      <div class="new-order-summary">
        <div class="new-order-summary-row"><span>Subtotal</span><span id="sumSubtotal">&#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Discount</span><span id="sumDiscount" style="color:#16a34a;">- &#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Tax (VAT)</span><span id="sumTax">&#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Delivery</span><span id="sumDelivery">&#8360; 0.00</span></div>
        <div class="new-order-summary-row total"><span>Total</span><span id="sumTotal" style="color:#f97316;">&#8360; 0.00</span></div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeNewOrderModal()">Cancel</button>
      <button class="btn btn-outline" onclick="saveOrderAsDraft()">
        <i class="fa-solid fa-floppy-disk"></i> Save as Draft
      </button>
      <button class="btn btn-primary" onclick="confirmNewOrder()">
        <i class="fa-solid fa-check"></i> Confirm Order
      </button>
    </div>
  </div>
</div>
`;

// ── Inject modal + wire events on DOM ready ───────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  // Inject modal HTML only once
  if (!document.getElementById('newOrderModal')) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = _NOM_HTML.trim();
    document.body.appendChild(wrapper.firstChild);
  }

  // Close on backdrop click
  const modal = document.getElementById('newOrderModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) closeNewOrderModal();
    });
  }
});

// ── Data loading ──────────────────────────────────────────────────────────────
(async function nomLoad() {
  const base = typeof getBasePath === 'function' ? getBasePath() : '../';
  try {
    const [custData, prodData] = await Promise.all([
      loadData('data/customers.json'),
      loadData('data/products.json')
    ]);
    if (custData) _nomCustomers = custData.customers || [];
    if (prodData) _nomProducts  = prodData.products  || [];
  } catch (e) { /* silent */ }
})();

// ── Toast helper ──────────────────────────────────────────────────────────────
function _nomToast(type, title, msg) {
  if (window.Toast) {
    if (type === 'success') Toast.success(title, msg);
    else if (type === 'warning') Toast.warning(title, msg);
    else Toast.error(title, msg);
    return;
  }
  const tc = document.getElementById('toastContainer');
  if (!tc) return;
  const e = document.createElement('div');
  e.style.cssText = 'background:#fff;border:1px solid #e5e7eb;border-radius:10px;padding:0.875rem 1rem;margin-bottom:0.5rem;display:flex;align-items:flex-start;gap:0.625rem;box-shadow:0 4px 16px rgba(0,0,0,0.1);min-width:260px;max-width:340px;';
  const colors = { success: '#16a34a', warning: '#d97706', error: '#dc2626' };
  const icons  = { success: 'fa-circle-check', warning: 'fa-triangle-exclamation', error: 'fa-circle-xmark' };
  e.innerHTML = `<i class="fa-solid ${icons[type] || icons.success}" style="color:${colors[type] || colors.success};font-size:1rem;margin-top:1px;"></i><div><div style="font-size:0.8rem;font-weight:600;color:#111;">${title}</div>${msg ? `<div style="font-size:0.75rem;color:#6b7280;margin-top:2px;">${msg}</div>` : ''}</div>`;
  tc.appendChild(e);
  setTimeout(() => e.remove(), 4000);
}

// ── LKR formatter helper ──────────────────────────────────────────────────────
function _nomFmt(n) {
  return typeof formatLKR === 'function'
    ? formatLKR(n)
    : '₨ ' + Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });
}

// ── Modal open/close ──────────────────────────────────────────────────────────
function openNewOrderModal() {
  _nomItems    = [];
  _nomCustomer = null;

  const get = id => document.getElementById(id);
  get('customerSearchInput').value               = '';
  get('selectedCustomerId').value                = '';
  get('selectedCustomerInfo').style.display      = 'none';
  get('productSearchInput').value                = '';
  get('productSuggestions').classList.remove('open');
  get('customerSuggestions').classList.remove('open');
  get('newOrderDiscount').value                  = '0';
  get('newOrderDelivery').value                  = '0';
  get('newOrderTaxEnabled').checked              = false;
  get('newOrderNotes').value                     = '';

  renderNewOrderItems();
  recalcTotal();

  get('newOrderModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.openNewOrderModal = openNewOrderModal;

function closeNewOrderModal() {
  document.getElementById('newOrderModal').classList.remove('open');
  document.body.style.overflow = '';
}
window.closeNewOrderModal = closeNewOrderModal;

// ── Customer search ───────────────────────────────────────────────────────────
function searchCustomers(q) {
  const sugg = document.getElementById('customerSuggestions');
  if (!q.trim()) { sugg.classList.remove('open'); return; }

  const matches = _nomCustomers.filter(c => {
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
window.searchCustomers = searchCustomers;

function selectCustomer(id) {
  const c = _nomCustomers.find(x => x.id === id);
  if (!c) return;
  _nomCustomer = c;
  document.getElementById('selectedCustomerId').value         = id;
  document.getElementById('customerSearchInput').value        = c.first_name + ' ' + c.last_name;
  document.getElementById('selectedCustomerName').textContent = c.first_name + ' ' + c.last_name;
  document.getElementById('selectedCustomerPhone').textContent = c.phone;
  document.getElementById('selectedCustomerInfo').style.display = 'block';
  document.getElementById('customerSuggestions').classList.remove('open');
}
window.selectCustomer = selectCustomer;

// ── Product search ────────────────────────────────────────────────────────────
function searchProducts(q) {
  const sugg = document.getElementById('productSuggestions');
  if (!q.trim()) { sugg.classList.remove('open'); return; }

  const matches = _nomProducts.filter(p => {
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
      <span class="sugg-price">${_nomFmt(p.sale_price || p.base_price)}</span>
    </div>
  `).join('');
  sugg.classList.add('open');
}
window.searchProducts = searchProducts;

function addProductToOrder(id) {
  const prod = _nomProducts.find(p => p.id === id);
  if (!prod) return;

  const existing = _nomItems.find(i => i.product_id === id);
  if (existing) {
    existing.qty++;
    existing.line_total = existing.qty * existing.unit_price;
  } else {
    _nomItems.push({
      product_id: id,
      name:       prod.name,
      sku:        prod.sku,
      image:      prod.image,
      unit_price: prod.sale_price || prod.base_price,
      qty:        1,
      line_total: prod.sale_price || prod.base_price,
    });
  }

  document.getElementById('productSearchInput').value = '';
  document.getElementById('productSuggestions').classList.remove('open');
  renderNewOrderItems();
  recalcTotal();
}
window.addProductToOrder = addProductToOrder;

function removeNewOrderItem(idx) {
  _nomItems.splice(idx, 1);
  renderNewOrderItems();
  recalcTotal();
}
window.removeNewOrderItem = removeNewOrderItem;

function updateNewOrderItemQty(idx, delta) {
  _nomItems[idx].qty        = Math.max(1, _nomItems[idx].qty + delta);
  _nomItems[idx].line_total = _nomItems[idx].qty * _nomItems[idx].unit_price;
  renderNewOrderItems();
  recalcTotal();
}
window.updateNewOrderItemQty = updateNewOrderItemQty;

function setNewOrderItemQty(idx, val) {
  const qty = Math.max(1, parseInt(val) || 1);
  _nomItems[idx].qty        = qty;
  _nomItems[idx].line_total = qty * _nomItems[idx].unit_price;
  recalcTotal();
}
window.setNewOrderItemQty = setNewOrderItemQty;

function renderNewOrderItems() {
  const el = document.getElementById('newOrderItems');
  if (!_nomItems.length) {
    el.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--color-neutral-400);font-size:0.8125rem;border:1px dashed var(--color-neutral-200);border-radius:8px;">Search and add products above</div>`;
    return;
  }

  el.innerHTML = _nomItems.map((item, i) => `
    <div class="new-order-item">
      <img class="sugg-img" src="${item.image || ''}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" />
      <div class="new-order-item-name">
        <div>${item.name}</div>
        <div class="new-order-item-sku">${item.sku} · ${_nomFmt(item.unit_price)} each</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="updateNewOrderItemQty(${i}, -1)"><i class="fa-solid fa-minus"></i></button>
        <input type="number" class="qty-input" value="${item.qty}" min="1" onchange="setNewOrderItemQty(${i}, this.value)" />
        <button class="qty-btn" onclick="updateNewOrderItemQty(${i}, 1)"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div style="font-weight:700;font-size:0.8125rem;min-width:72px;text-align:right;">${_nomFmt(item.line_total)}</div>
      <button class="remove-item-btn" onclick="removeNewOrderItem(${i})" title="Remove"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `).join('');
}
window.renderNewOrderItems = renderNewOrderItems;

function recalcTotal() {
  const subtotal   = _nomItems.reduce((s, i) => s + i.line_total, 0);
  const discount   = parseFloat(document.getElementById('newOrderDiscount')?.value  || 0);
  const delivery   = parseFloat(document.getElementById('newOrderDelivery')?.value  || 0);
  const taxEnabled = document.getElementById('newOrderTaxEnabled')?.checked;
  const taxAmt     = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total      = subtotal - discount + taxAmt + delivery;

  document.getElementById('sumSubtotal').textContent = _nomFmt(subtotal);
  document.getElementById('sumDiscount').textContent = `– ${_nomFmt(discount)}`;
  document.getElementById('sumTax').textContent      = _nomFmt(taxAmt);
  document.getElementById('sumDelivery').textContent = _nomFmt(delivery);
  document.getElementById('sumTotal').textContent    = _nomFmt(total);
}
window.recalcTotal = recalcTotal;

function buildNewOrder(status) {
  if (!_nomCustomer) {
    _nomToast('warning', 'Customer Required', 'Please select a customer.');
    return null;
  }
  if (!_nomItems.length) {
    _nomToast('warning', 'Items Required', 'Please add at least one product.');
    return null;
  }

  const subtotal   = _nomItems.reduce((s, i) => s + i.line_total, 0);
  const discount   = parseFloat(document.getElementById('newOrderDiscount').value || 0);
  const delivery   = parseFloat(document.getElementById('newOrderDelivery').value || 0);
  const taxEnabled = document.getElementById('newOrderTaxEnabled').checked;
  const taxAmt     = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total      = subtotal - discount + taxAmt + delivery;

  const id = 'ORD-' + new Date().getFullYear() + '-' + String(Math.floor(Math.random() * 9000) + 1000);
  return {
    id,
    customer_id:    _nomCustomer.id,
    customer_name:  _nomCustomer.first_name + ' ' + _nomCustomer.last_name,
    customer_phone: _nomCustomer.phone,
    source:         document.getElementById('newOrderSource').value,
    status,
    items:          _nomItems.map(i => ({ ...i })),
    subtotal, discount, shipping: delivery, tax: taxAmt, total,
    payment_method: document.getElementById('newOrderPayMethod').value,
    payment_status: 'pending',
    ordered_at:     new Date().toISOString(),
    confirmed_at:   status === 'confirmed' ? new Date().toISOString() : null,
    notes:          document.getElementById('newOrderNotes').value,
  };
}
window.buildNewOrder = buildNewOrder;

function saveOrderAsDraft() {
  const order = buildNewOrder('pending');
  if (!order) return;

  closeNewOrderModal();

  if (typeof window._nomOnConfirm === 'function') {
    window._nomOnConfirm(order, true);
  } else {
    _nomToast('success', 'Draft Saved', `Order ${order.id} saved as draft.`);
  }
}
window.saveOrderAsDraft = saveOrderAsDraft;

function confirmNewOrder() {
  const order = buildNewOrder('confirmed');
  if (!order) return;

  closeNewOrderModal();

  if (typeof window._nomOnConfirm === 'function') {
    window._nomOnConfirm(order, false);
  } else {
    _nomToast('success', 'Order Confirmed', `Order ${order.id} has been confirmed!`);
  }
}
window.confirmNewOrder = confirmNewOrder;

// ── Close dropdowns on outside click ─────────────────────────────────────────
document.addEventListener('click', function (e) {
  if (!e.target.closest('.product-search-wrap')) {
    const ps = document.getElementById('productSuggestions');
    if (ps) ps.classList.remove('open');
  }
  if (!e.target.closest('#customerSearchInput') && !e.target.closest('#customerSuggestions')) {
    const cs = document.getElementById('customerSuggestions');
    if (cs) cs.classList.remove('open');
  }
});
