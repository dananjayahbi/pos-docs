/**
 * new-quotation-modal.js — Shared New Quotation Modal
 * LankaCommerce Cloud ERP
 *
 * Injects the New Quotation modal into the DOM once on DOMContentLoaded.
 * Exposes all modal functions globally on window.
 * Supports window._nqmOnConfirm(quote, isDraft) for page-specific integration.
 */

// ── Module state ─────────────────────────────────────────────────────────────
let _nqmItems     = [];
let _nqmCustomer  = null;
let _nqmCustomers = [];
let _nqmProducts  = [];

// ── Modal HTML ────────────────────────────────────────────────────────────────
const _NQM_HTML = `
<div class="modal-backdrop" id="newQuotationModal">
  <div class="modal-box" style="max-width:720px;">
    <div class="modal-header">
      <div class="modal-title"><i class="fa-solid fa-file-lines" style="color:#4f46e5;margin-right:0.5rem;"></i>New Quotation</div>
      <button class="modal-close" onclick="closeNewQuotationModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">

      <!-- Section 1 — Customer -->
      <div class="form-group" style="position:relative;">
        <label class="form-label">Customer <span class="req">*</span></label>
        <input type="text" class="form-input" id="nqmCustomerSearchInput" placeholder="Search customer by name or phone…" autocomplete="off" oninput="nqmSearchCustomers(this.value)" />
        <div class="customer-suggestions" id="nqmCustomerSuggestions"></div>
        <input type="hidden" id="nqmSelectedCustomerId" />
        <div id="nqmSelectedCustomerInfo" style="display:none;margin-top:0.375rem;padding:0.5rem 0.75rem;background:#eef2ff;border:1px solid #c7d2fe;border-radius:8px;font-size:0.8125rem;">
          <span id="nqmSelectedCustomerName" style="font-weight:600;color:#4f46e5;"></span>
          <span id="nqmSelectedCustomerPhone" style="color:var(--color-neutral-500);margin-left:0.5rem;"></span>
        </div>
      </div>

      <!-- Section 2 — Quotation Details -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Valid Until</label>
          <input type="date" class="form-input" id="nqmValidUntil" />
        </div>
        <div class="form-group">
          <label class="form-label">Reference / PO Number</label>
          <input type="text" class="form-input" id="nqmReference" placeholder="Customer PO # (optional)" />
        </div>
      </div>

      <!-- Section 3 — Add Products -->
      <div class="form-group">
        <label class="form-label">Add Products <span class="req">*</span></label>
        <div class="product-search-wrap">
          <input type="text" class="form-input" id="nqmProductSearchInput" placeholder="Search by product name or barcode…" autocomplete="off" oninput="nqmSearchProducts(this.value)" />
          <div class="product-suggestions" id="nqmProductSuggestions"></div>
        </div>
      </div>
      <div id="nqmQuoteItems" class="new-order-items"></div>

      <!-- Section 4 — Financials -->
      <div class="form-row" style="margin-top:0.75rem;">
        <div class="form-group">
          <label class="form-label">Discount (LKR)</label>
          <input type="number" class="form-input" id="nqmDiscount" min="0" value="0" oninput="nqmRecalc()" placeholder="0.00" />
        </div>
        <div class="form-group">
          <label class="form-label">Shipping Charge (LKR)</label>
          <input type="number" class="form-input" id="nqmShipping" min="0" value="0" oninput="nqmRecalc()" placeholder="0.00" />
        </div>
      </div>

      <!-- Section 5 — Tax toggle + Notes -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:0.5rem;">
            <input type="checkbox" id="nqmTaxEnabled" onchange="nqmRecalc()" style="accent-color:#4f46e5;width:15px;height:15px;" />
            Apply Tax (18% VAT)
          </label>
        </div>
        <div class="form-group">
          <label class="form-label">Notes / Terms</label>
          <textarea class="form-textarea" id="nqmNotes" placeholder="Internal notes or terms…" style="min-height:52px;"></textarea>
        </div>
      </div>

      <!-- Section 6 — Summary -->
      <div class="new-order-summary">
        <div class="new-order-summary-row"><span>Subtotal</span><span id="nqmSumSubtotal">&#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Discount</span><span id="nqmSumDiscount" style="color:#16a34a;">– &#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Tax (VAT)</span><span id="nqmSumTax">&#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Shipping</span><span id="nqmSumShipping">&#8360; 0.00</span></div>
        <div class="new-order-summary-row total"><span>Total</span><span id="nqmSumTotal" style="color:#4f46e5;">&#8360; 0.00</span></div>
      </div>

    </div><!-- /.modal-body -->
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeNewQuotationModal()">Cancel</button>
      <button class="btn btn-outline" onclick="saveQuotationAsDraft()">
        <i class="fa-solid fa-floppy-disk"></i> Save as Draft
      </button>
      <button class="btn btn-primary" style="background:#4f46e5;border-color:#4f46e5;" onclick="confirmNewQuotation()">
        <i class="fa-solid fa-paper-plane"></i> Create &amp; Send
      </button>
    </div>
  </div>
</div>
`;

// ── Inject modal + wire events on DOM ready ───────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('newQuotationModal')) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = _NQM_HTML.trim();
    document.body.appendChild(wrapper.firstChild);
  }

  const modal = document.getElementById('newQuotationModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) closeNewQuotationModal();
    });
  }
});

// ── Data loading ──────────────────────────────────────────────────────────────
(async function nqmLoad() {
  function _nqmLoadData(url) {
    return fetch(url).then(r => r.json()).catch(() => ({}));
  }
  try {
    const [custData, prodData] = await Promise.all([
      _nqmLoadData('../../data/customers.json'),
      _nqmLoadData('../../data/products.json'),
    ]);
    if (custData) _nqmCustomers = custData.customers || [];
    if (prodData) _nqmProducts  = prodData.products  || [];
  } catch (e) { /* silent */ }
})();

// ── Toast helper ──────────────────────────────────────────────────────────────
function _nqmToast(type, title, msg) {
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
function _nqmFmt(n) {
  return typeof formatLKR === 'function'
    ? formatLKR(n)
    : '₨ ' + Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });
}

// ── Modal open/close ──────────────────────────────────────────────────────────
function openNewQuotationModal() {
  _nqmItems    = [];
  _nqmCustomer = null;

  const get = id => document.getElementById(id);

  get('nqmCustomerSearchInput').value              = '';
  get('nqmSelectedCustomerId').value               = '';
  get('nqmSelectedCustomerInfo').style.display     = 'none';
  get('nqmProductSearchInput').value               = '';
  get('nqmProductSuggestions').classList.remove('open');
  get('nqmCustomerSuggestions').classList.remove('open');
  get('nqmValidUntil').value                       = '';
  get('nqmReference').value                        = '';
  get('nqmDiscount').value                         = '0';
  get('nqmShipping').value                         = '0';
  get('nqmTaxEnabled').checked                     = false;
  get('nqmNotes').value                            = '';

  nqmRenderItems();
  nqmRecalc();

  get('newQuotationModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.openNewQuotationModal = openNewQuotationModal;

function closeNewQuotationModal() {
  document.getElementById('newQuotationModal').classList.remove('open');
  document.body.style.overflow = '';
}
window.closeNewQuotationModal = closeNewQuotationModal;

// ── Customer search ───────────────────────────────────────────────────────────
function nqmSearchCustomers(q) {
  const sugg = document.getElementById('nqmCustomerSuggestions');
  if (!q.trim()) { sugg.classList.remove('open'); return; }

  const matches = _nqmCustomers.filter(c => {
    const name = (c.first_name + ' ' + c.last_name).toLowerCase();
    return name.includes(q.toLowerCase()) || (c.phone || '').includes(q);
  }).slice(0, 6);

  if (!matches.length) { sugg.classList.remove('open'); return; }

  sugg.innerHTML = matches.map(c => `
    <div class="cust-sugg-item" onclick="nqmSelectCustomer('${c.id}')">
      <img class="cust-sugg-avatar" src="${c.avatar || ''}" alt="${c.first_name}" onerror="this.style.display='none'" />
      <div>
        <div class="cust-sugg-name">${c.first_name} ${c.last_name}</div>
        <div class="cust-sugg-phone">${c.phone}</div>
      </div>
    </div>
  `).join('');
  sugg.classList.add('open');
}
window.nqmSearchCustomers = nqmSearchCustomers;

function nqmSelectCustomer(id) {
  const c = _nqmCustomers.find(x => x.id === id);
  if (!c) return;
  _nqmCustomer = c;
  document.getElementById('nqmSelectedCustomerId').value           = id;
  document.getElementById('nqmCustomerSearchInput').value          = c.first_name + ' ' + c.last_name;
  document.getElementById('nqmSelectedCustomerName').textContent   = c.first_name + ' ' + c.last_name;
  document.getElementById('nqmSelectedCustomerPhone').textContent  = c.phone;
  document.getElementById('nqmSelectedCustomerInfo').style.display = 'block';
  document.getElementById('nqmCustomerSuggestions').classList.remove('open');
}
window.nqmSelectCustomer = nqmSelectCustomer;

// ── Product search ────────────────────────────────────────────────────────────
function nqmSearchProducts(q) {
  const sugg = document.getElementById('nqmProductSuggestions');
  if (!q.trim()) { sugg.classList.remove('open'); return; }

  const matches = _nqmProducts.filter(p => {
    return p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.barcode || '').includes(q);
  }).slice(0, 8);

  if (!matches.length) { sugg.classList.remove('open'); return; }

  sugg.innerHTML = matches.map(p => `
    <div class="product-suggestion-item" onclick="nqmAddProduct('${p.id}')">
      <img class="sugg-img" src="${p.image || ''}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" />
      <div>
        <div class="sugg-name">${p.name}</div>
        <div class="sugg-sku">${p.sku}</div>
      </div>
      <span class="sugg-price">${_nqmFmt(p.sale_price || p.base_price)}</span>
    </div>
  `).join('');
  sugg.classList.add('open');
}
window.nqmSearchProducts = nqmSearchProducts;

function nqmAddProduct(id) {
  const prod = _nqmProducts.find(p => p.id === id);
  if (!prod) return;

  const existing = _nqmItems.find(i => i.product_id === id);
  if (existing) {
    existing.qty++;
    existing.line_total = existing.qty * existing.unit_price;
  } else {
    _nqmItems.push({
      product_id: id,
      name:       prod.name,
      sku:        prod.sku,
      image:      prod.image,
      unit_price: prod.sale_price || prod.base_price,
      qty:        1,
      line_total: prod.sale_price || prod.base_price,
    });
  }

  document.getElementById('nqmProductSearchInput').value = '';
  document.getElementById('nqmProductSuggestions').classList.remove('open');
  nqmRenderItems();
  nqmRecalc();
}
window.nqmAddProduct = nqmAddProduct;

function nqmRemoveItem(idx) {
  _nqmItems.splice(idx, 1);
  nqmRenderItems();
  nqmRecalc();
}
window.nqmRemoveItem = nqmRemoveItem;

function nqmUpdateQty(idx, delta) {
  _nqmItems[idx].qty        = Math.max(1, _nqmItems[idx].qty + delta);
  _nqmItems[idx].line_total = _nqmItems[idx].qty * _nqmItems[idx].unit_price;
  nqmRenderItems();
  nqmRecalc();
}
window.nqmUpdateQty = nqmUpdateQty;

function nqmSetQty(idx, val) {
  const qty = Math.max(1, parseInt(val) || 1);
  _nqmItems[idx].qty        = qty;
  _nqmItems[idx].line_total = qty * _nqmItems[idx].unit_price;
  nqmRenderItems();
  nqmRecalc();
}
window.nqmSetQty = nqmSetQty;

function nqmRenderItems() {
  const el = document.getElementById('nqmQuoteItems');
  if (!_nqmItems.length) {
    el.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--color-neutral-400);font-size:0.8125rem;border:1px dashed var(--color-neutral-200);border-radius:8px;">Search and add products above</div>`;
    return;
  }

  el.innerHTML = _nqmItems.map((item, i) => `
    <div class="new-order-item">
      <img class="sugg-img" src="${item.image || ''}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" />
      <div class="new-order-item-name">
        <div>${item.name}</div>
        <div class="new-order-item-sku">${item.sku} · ${_nqmFmt(item.unit_price)} each</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="nqmUpdateQty(${i}, -1)"><i class="fa-solid fa-minus"></i></button>
        <input type="number" class="qty-input" value="${item.qty}" min="1" onchange="nqmSetQty(${i}, this.value)" />
        <button class="qty-btn" onclick="nqmUpdateQty(${i}, 1)"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div style="font-weight:700;font-size:0.8125rem;min-width:72px;text-align:right;">${_nqmFmt(item.line_total)}</div>
      <button class="remove-item-btn" onclick="nqmRemoveItem(${i})" title="Remove"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `).join('');
}
window.nqmRenderItems = nqmRenderItems;

function nqmRecalc() {
  const subtotal   = _nqmItems.reduce((s, i) => s + i.line_total, 0);
  const discount   = parseFloat(document.getElementById('nqmDiscount')?.value  || 0);
  const shipping   = parseFloat(document.getElementById('nqmShipping')?.value  || 0);
  const taxEnabled = document.getElementById('nqmTaxEnabled')?.checked;
  const taxAmt     = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total      = subtotal - discount + taxAmt + shipping;

  document.getElementById('nqmSumSubtotal').textContent = _nqmFmt(subtotal);
  document.getElementById('nqmSumDiscount').textContent = `– ${_nqmFmt(discount)}`;
  document.getElementById('nqmSumTax').textContent      = _nqmFmt(taxAmt);
  document.getElementById('nqmSumShipping').textContent = _nqmFmt(shipping);
  document.getElementById('nqmSumTotal').textContent    = _nqmFmt(total);
}
window.nqmRecalc = nqmRecalc;

function buildNewQuotation(status) {
  if (!_nqmCustomer) {
    _nqmToast('warning', 'Customer Required', 'Please select a customer.');
    return null;
  }
  if (!_nqmItems.length) {
    _nqmToast('warning', 'Items Required', 'Please add at least one product.');
    return null;
  }

  const subtotal   = _nqmItems.reduce((s, i) => s + i.line_total, 0);
  const discount   = parseFloat(document.getElementById('nqmDiscount').value  || 0);
  const shipping   = parseFloat(document.getElementById('nqmShipping').value  || 0);
  const taxEnabled = document.getElementById('nqmTaxEnabled').checked;
  const taxAmt     = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total      = subtotal - discount + taxAmt + shipping;

  const year = new Date().getFullYear();
  const id   = 'QUO-' + year + '-' + String(Math.floor(Math.random() * 9000) + 1000);

  return {
    id,
    customer_id:    _nqmCustomer.id,
    customer_name:  _nqmCustomer.first_name + ' ' + _nqmCustomer.last_name,
    customer_phone: _nqmCustomer.phone,
    status,
    created_at:     new Date().toISOString(),
    valid_until:    document.getElementById('nqmValidUntil').value || null,
    reference:      document.getElementById('nqmReference').value.trim() || null,
    items:          _nqmItems.map(i => ({ ...i })),
    subtotal,
    discount,
    shipping,
    tax:            taxAmt,
    total,
    notes:          document.getElementById('nqmNotes').value,
  };
}
window.buildNewQuotation = buildNewQuotation;

function saveQuotationAsDraft() {
  const quote = buildNewQuotation('draft');
  if (!quote) return;

  closeNewQuotationModal();

  if (typeof window._nqmOnConfirm === 'function') {
    window._nqmOnConfirm(quote, true);
  } else {
    _nqmToast('success', 'Draft Saved', `Quote ${quote.id} saved as draft.`);
  }
}
window.saveQuotationAsDraft = saveQuotationAsDraft;

function confirmNewQuotation() {
  const quote = buildNewQuotation('sent');
  if (!quote) return;

  closeNewQuotationModal();

  if (typeof window._nqmOnConfirm === 'function') {
    window._nqmOnConfirm(quote, false);
  } else {
    _nqmToast('success', 'Quotation Sent', `Quotation ${quote.id} created and sent.`);
  }
}
window.confirmNewQuotation = confirmNewQuotation;

// ── Close dropdowns on outside click ─────────────────────────────────────────
document.addEventListener('click', function (e) {
  if (!e.target.closest('#nqmProductSearchInput') && !e.target.closest('#nqmProductSuggestions')) {
    const ps = document.getElementById('nqmProductSuggestions');
    if (ps) ps.classList.remove('open');
  }
  if (!e.target.closest('#nqmCustomerSearchInput') && !e.target.closest('#nqmCustomerSuggestions')) {
    const cs = document.getElementById('nqmCustomerSuggestions');
    if (cs) cs.classList.remove('open');
  }
});
