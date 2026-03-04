/**
 * new-invoice-modal.js — Shared New Invoice Modal
 * LankaCommerce Cloud ERP
 *
 * Injects the New Invoice modal into the DOM once on DOMContentLoaded.
 * Exposes all modal functions globally on window.
 * Supports window._nimOnConfirm(invoice, isDraft) for page-specific integration.
 */

// ── Module state ─────────────────────────────────────────────────────────────
let _nimItems     = [];
let _nimCustomer  = null;
let _nimCustomers = [];
let _nimProducts  = [];

// ── Modal HTML ────────────────────────────────────────────────────────────────
const _NIM_HTML = `
<div class="modal-backdrop" id="newInvoiceModal">
  <div class="modal-box" style="max-width:740px;">
    <div class="modal-header">
      <div class="modal-title"><i class="fa-solid fa-file-invoice" style="color:#f97316;margin-right:0.5rem;"></i>New Invoice</div>
      <button class="modal-close" onclick="closeNewInvoiceModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">

      <!-- Section 1 — Customer -->
      <div class="form-group" style="position:relative;">
        <label class="form-label">Customer <span class="req">*</span></label>
        <input type="text" class="form-input" id="nimCustomerSearchInput" placeholder="Search customer by name or phone…" autocomplete="off" oninput="nimSearchCustomers(this.value)" />
        <div class="customer-suggestions" id="nimCustomerSuggestions"></div>
        <input type="hidden" id="nimSelectedCustomerId" />
        <div id="nimSelectedCustomerInfo" style="display:none;margin-top:0.375rem;padding:0.5rem 0.75rem;background:#fff7ed;border:1px solid #fed7aa;border-radius:8px;font-size:0.8125rem;">
          <span id="nimSelectedCustomerName" style="font-weight:600;color:#ea580c;"></span>
          <span id="nimSelectedCustomerPhone" style="color:var(--color-neutral-500);margin-left:0.5rem;"></span>
        </div>
      </div>

      <!-- Section 2 — Invoice Details -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Invoice Type</label>
          <select class="form-select" id="nimInvoiceType">
            <option value="standard">Standard Invoice</option>
            <option value="svat">SVAT Invoice</option>
            <option value="credit_note">Credit Note</option>
            <option value="debit_note">Debit Note</option>
          </select>
        </div>
        <div class="form-group">
          <label class="form-label">Payment Terms</label>
          <select class="form-select" id="nimPaymentTerms">
            <option value="COD">Cash on Delivery (COD)</option>
            <option value="net15">Net 15 Days</option>
            <option value="net30">Net 30 Days</option>
          </select>
        </div>
      </div>

      <!-- Section 3 — References -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">Order Reference</label>
          <input type="text" class="form-input" id="nimOrderRef" placeholder="ORD-2026-XXXX (optional)" />
        </div>
        <div class="form-group">
          <label class="form-label">Due Date</label>
          <input type="date" class="form-input" id="nimDueDate" />
        </div>
      </div>

      <!-- Section 4 — Business Details -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label">BRN</label>
          <input type="text" class="form-input" id="nimBRN" placeholder="Business Registration Number (optional)" />
        </div>
        <div class="form-group">
          <label class="form-label">VAT Reg Number</label>
          <input type="text" class="form-input" id="nimVATReg" placeholder="VAT Registration No. (optional)" />
        </div>
      </div>

      <!-- Section 5 — Add Products -->
      <div class="form-group">
        <label class="form-label">Add Products <span class="req">*</span></label>
        <div class="product-search-wrap">
          <input type="text" class="form-input" id="nimProductSearchInput" placeholder="Search by product name or barcode…" autocomplete="off" oninput="nimSearchProducts(this.value)" />
          <div class="product-suggestions" id="nimProductSuggestions"></div>
        </div>
      </div>
      <div id="nimInvoiceItems" class="new-order-items"></div>

      <!-- Section 6 — Financials -->
      <div class="form-row" style="margin-top:0.75rem;">
        <div class="form-group">
          <label class="form-label">Discount (LKR)</label>
          <input type="number" class="form-input" id="nimDiscount" min="0" value="0" oninput="nimRecalc()" placeholder="0.00" />
        </div>
        <div class="form-group">
          <label class="form-label">Shipping Charge (LKR)</label>
          <input type="number" class="form-input" id="nimShipping" min="0" value="0" oninput="nimRecalc()" placeholder="0.00" />
        </div>
      </div>

      <!-- Section 7 — Tax toggle + Notes -->
      <div class="form-row">
        <div class="form-group">
          <label class="form-label" style="display:flex;align-items:center;gap:0.5rem;">
            <input type="checkbox" id="nimTaxEnabled" onchange="nimRecalc()" style="accent-color:#f97316;width:15px;height:15px;" />
            Apply Tax (18% VAT)
          </label>
        </div>
        <div class="form-group">
          <label class="form-label">Order Notes</label>
          <textarea class="form-textarea" id="nimNotes" placeholder="Internal notes or terms…" style="min-height:52px;"></textarea>
        </div>
      </div>

      <!-- Section 8 — Summary -->
      <div class="new-order-summary">
        <div class="new-order-summary-row"><span>Subtotal</span><span id="nimSumSubtotal">&#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Discount</span><span id="nimSumDiscount" style="color:#16a34a;">– &#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Tax (VAT)</span><span id="nimSumTax">&#8360; 0.00</span></div>
        <div class="new-order-summary-row"><span>Shipping</span><span id="nimSumShipping">&#8360; 0.00</span></div>
        <div class="new-order-summary-row total"><span>Total</span><span id="nimSumTotal" style="color:#f97316;">&#8360; 0.00</span></div>
      </div>

    </div><!-- /.modal-body -->
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeNewInvoiceModal()">Cancel</button>
      <button class="btn btn-outline" onclick="saveInvoiceAsDraft()">
        <i class="fa-solid fa-floppy-disk"></i> Save as Draft
      </button>
      <button class="btn btn-primary" onclick="confirmNewInvoice()">
        <i class="fa-solid fa-check"></i> Create Invoice
      </button>
    </div>
  </div>
</div>
`;

// ── Inject modal + wire events on DOM ready ───────────────────────────────────
document.addEventListener('DOMContentLoaded', function () {
  if (!document.getElementById('newInvoiceModal')) {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = _NIM_HTML.trim();
    document.body.appendChild(wrapper.firstChild);
  }

  const modal = document.getElementById('newInvoiceModal');
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target === this) closeNewInvoiceModal();
    });
  }
});

// ── Data loading ──────────────────────────────────────────────────────────────
(async function nimLoad() {
  function _nimLoadData(url) {
    return fetch(url).then(r => r.json()).catch(() => ({}));
  }
  try {
    const [custData, prodData] = await Promise.all([
      _nimLoadData('../../data/customers.json'),
      _nimLoadData('../../data/products.json'),
    ]);
    if (custData) _nimCustomers = custData.customers || [];
    if (prodData) _nimProducts  = prodData.products  || [];
  } catch (e) { /* silent */ }
})();

// ── Toast helper ──────────────────────────────────────────────────────────────
function _nimToast(type, title, msg) {
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
function _nimFmt(n) {
  return typeof formatLKR === 'function'
    ? formatLKR(n)
    : '₨ ' + Number(n || 0).toLocaleString('en-LK', { minimumFractionDigits: 2 });
}

// ── Modal open/close ──────────────────────────────────────────────────────────
function openNewInvoiceModal() {
  _nimItems    = [];
  _nimCustomer = null;

  const get = id => document.getElementById(id);

  get('nimCustomerSearchInput').value              = '';
  get('nimSelectedCustomerId').value               = '';
  get('nimSelectedCustomerInfo').style.display     = 'none';
  get('nimProductSearchInput').value               = '';
  get('nimProductSuggestions').classList.remove('open');
  get('nimCustomerSuggestions').classList.remove('open');
  get('nimInvoiceType').value                      = 'standard';
  get('nimPaymentTerms').value                     = 'COD';
  get('nimOrderRef').value                         = '';
  get('nimDueDate').value                          = '';
  get('nimBRN').value                              = '';
  get('nimVATReg').value                           = '';
  get('nimDiscount').value                         = '0';
  get('nimShipping').value                         = '0';
  get('nimTaxEnabled').checked                     = false;
  get('nimNotes').value                            = '';

  nimRenderItems();
  nimRecalc();

  get('newInvoiceModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.openNewInvoiceModal = openNewInvoiceModal;

function closeNewInvoiceModal() {
  document.getElementById('newInvoiceModal').classList.remove('open');
  document.body.style.overflow = '';
}
window.closeNewInvoiceModal = closeNewInvoiceModal;

// ── Customer search ───────────────────────────────────────────────────────────
function nimSearchCustomers(q) {
  const sugg = document.getElementById('nimCustomerSuggestions');
  if (!q.trim()) { sugg.classList.remove('open'); return; }

  const matches = _nimCustomers.filter(c => {
    const name = (c.first_name + ' ' + c.last_name).toLowerCase();
    return name.includes(q.toLowerCase()) || (c.phone || '').includes(q);
  }).slice(0, 6);

  if (!matches.length) { sugg.classList.remove('open'); return; }

  sugg.innerHTML = matches.map(c => `
    <div class="cust-sugg-item" onclick="nimSelectCustomer('${c.id}')">
      <img class="cust-sugg-avatar" src="${c.avatar || ''}" alt="${c.first_name}" onerror="this.style.display='none'" />
      <div>
        <div class="cust-sugg-name">${c.first_name} ${c.last_name}</div>
        <div class="cust-sugg-phone">${c.phone}</div>
      </div>
    </div>
  `).join('');
  sugg.classList.add('open');
}
window.nimSearchCustomers = nimSearchCustomers;

function nimSelectCustomer(id) {
  const c = _nimCustomers.find(x => x.id === id);
  if (!c) return;
  _nimCustomer = c;
  document.getElementById('nimSelectedCustomerId').value           = id;
  document.getElementById('nimCustomerSearchInput').value          = c.first_name + ' ' + c.last_name;
  document.getElementById('nimSelectedCustomerName').textContent   = c.first_name + ' ' + c.last_name;
  document.getElementById('nimSelectedCustomerPhone').textContent  = c.phone;
  document.getElementById('nimSelectedCustomerInfo').style.display = 'block';
  document.getElementById('nimCustomerSuggestions').classList.remove('open');
}
window.nimSelectCustomer = nimSelectCustomer;

// ── Product search ────────────────────────────────────────────────────────────
function nimSearchProducts(q) {
  const sugg = document.getElementById('nimProductSuggestions');
  if (!q.trim()) { sugg.classList.remove('open'); return; }

  const matches = _nimProducts.filter(p => {
    return p.name.toLowerCase().includes(q.toLowerCase()) ||
      (p.sku || '').toLowerCase().includes(q.toLowerCase()) ||
      (p.barcode || '').includes(q);
  }).slice(0, 8);

  if (!matches.length) { sugg.classList.remove('open'); return; }

  sugg.innerHTML = matches.map(p => `
    <div class="product-suggestion-item" onclick="nimAddProduct('${p.id}')">
      <img class="sugg-img" src="${p.image || ''}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" />
      <div>
        <div class="sugg-name">${p.name}</div>
        <div class="sugg-sku">${p.sku}</div>
      </div>
      <span class="sugg-price">${_nimFmt(p.sale_price || p.base_price)}</span>
    </div>
  `).join('');
  sugg.classList.add('open');
}
window.nimSearchProducts = nimSearchProducts;

function nimAddProduct(id) {
  const prod = _nimProducts.find(p => p.id === id);
  if (!prod) return;

  const existing = _nimItems.find(i => i.product_id === id);
  if (existing) {
    existing.qty++;
    existing.line_total = existing.qty * existing.unit_price;
  } else {
    _nimItems.push({
      product_id: id,
      name:       prod.name,
      sku:        prod.sku,
      image:      prod.image,
      unit_price: prod.sale_price || prod.base_price,
      qty:        1,
      line_total: prod.sale_price || prod.base_price,
    });
  }

  document.getElementById('nimProductSearchInput').value = '';
  document.getElementById('nimProductSuggestions').classList.remove('open');
  nimRenderItems();
  nimRecalc();
}
window.nimAddProduct = nimAddProduct;

function nimRemoveItem(idx) {
  _nimItems.splice(idx, 1);
  nimRenderItems();
  nimRecalc();
}
window.nimRemoveItem = nimRemoveItem;

function nimUpdateQty(idx, delta) {
  _nimItems[idx].qty        = Math.max(1, _nimItems[idx].qty + delta);
  _nimItems[idx].line_total = _nimItems[idx].qty * _nimItems[idx].unit_price;
  nimRenderItems();
  nimRecalc();
}
window.nimUpdateQty = nimUpdateQty;

function nimSetQty(idx, val) {
  const qty = Math.max(1, parseInt(val) || 1);
  _nimItems[idx].qty        = qty;
  _nimItems[idx].line_total = qty * _nimItems[idx].unit_price;
  nimRenderItems();
  nimRecalc();
}
window.nimSetQty = nimSetQty;

function nimRenderItems() {
  const el = document.getElementById('nimInvoiceItems');
  if (!_nimItems.length) {
    el.innerHTML = `<div style="text-align:center;padding:1.5rem;color:var(--color-neutral-400);font-size:0.8125rem;border:1px dashed var(--color-neutral-200);border-radius:8px;">Search and add products above</div>`;
    return;
  }

  el.innerHTML = _nimItems.map((item, i) => `
    <div class="new-order-item">
      <img class="sugg-img" src="${item.image || ''}" alt="${item.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" />
      <div class="new-order-item-name">
        <div>${item.name}</div>
        <div class="new-order-item-sku">${item.sku} · ${_nimFmt(item.unit_price)} each</div>
      </div>
      <div class="qty-control">
        <button class="qty-btn" onclick="nimUpdateQty(${i}, -1)"><i class="fa-solid fa-minus"></i></button>
        <input type="number" class="qty-input" value="${item.qty}" min="1" onchange="nimSetQty(${i}, this.value)" />
        <button class="qty-btn" onclick="nimUpdateQty(${i}, 1)"><i class="fa-solid fa-plus"></i></button>
      </div>
      <div style="font-weight:700;font-size:0.8125rem;min-width:72px;text-align:right;">${_nimFmt(item.line_total)}</div>
      <button class="remove-item-btn" onclick="nimRemoveItem(${i})" title="Remove"><i class="fa-solid fa-xmark"></i></button>
    </div>
  `).join('');
}
window.nimRenderItems = nimRenderItems;

function nimRecalc() {
  const subtotal   = _nimItems.reduce((s, i) => s + i.line_total, 0);
  const discount   = parseFloat(document.getElementById('nimDiscount')?.value  || 0);
  const shipping   = parseFloat(document.getElementById('nimShipping')?.value  || 0);
  const taxEnabled = document.getElementById('nimTaxEnabled')?.checked;
  const taxAmt     = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total      = subtotal - discount + taxAmt + shipping;

  document.getElementById('nimSumSubtotal').textContent = _nimFmt(subtotal);
  document.getElementById('nimSumDiscount').textContent = `– ${_nimFmt(discount)}`;
  document.getElementById('nimSumTax').textContent      = _nimFmt(taxAmt);
  document.getElementById('nimSumShipping').textContent = _nimFmt(shipping);
  document.getElementById('nimSumTotal').textContent    = _nimFmt(total);
}
window.nimRecalc = nimRecalc;

function buildNewInvoice(status) {
  if (!_nimCustomer) {
    _nimToast('warning', 'Customer Required', 'Please select a customer.');
    return null;
  }
  if (!_nimItems.length) {
    _nimToast('warning', 'Items Required', 'Please add at least one product.');
    return null;
  }

  const subtotal   = _nimItems.reduce((s, i) => s + i.line_total, 0);
  const discount   = parseFloat(document.getElementById('nimDiscount').value  || 0);
  const shipping   = parseFloat(document.getElementById('nimShipping').value  || 0);
  const taxEnabled = document.getElementById('nimTaxEnabled').checked;
  const taxAmt     = taxEnabled ? (subtotal - discount) * 0.18 : 0;
  const total      = subtotal - discount + taxAmt + shipping;

  const year = new Date().getFullYear();
  const id   = 'INV-' + year + '-' + String(Math.floor(Math.random() * 9000) + 1000);

  return {
    id,
    order_id:       document.getElementById('nimOrderRef').value.trim() || null,
    customer_id:    _nimCustomer.id,
    customer_name:  _nimCustomer.first_name + ' ' + _nimCustomer.last_name,
    customer_phone: _nimCustomer.phone,
    type:           document.getElementById('nimInvoiceType').value,
    payment_terms:  document.getElementById('nimPaymentTerms').value,
    brn:            document.getElementById('nimBRN').value.trim(),
    vat_reg:        document.getElementById('nimVATReg').value.trim(),
    status,
    issued_date:    new Date().toISOString(),
    due_date:       document.getElementById('nimDueDate').value || null,
    items:          _nimItems.map(i => ({ ...i })),
    subtotal,
    discount,
    shipping,
    tax:            taxAmt,
    total,
    amount_paid:    0,
    balance_due:    total,
    notes:          document.getElementById('nimNotes').value,
  };
}
window.buildNewInvoice = buildNewInvoice;

function saveInvoiceAsDraft() {
  const invoice = buildNewInvoice('draft');
  if (!invoice) return;

  closeNewInvoiceModal();

  if (typeof window._nimOnConfirm === 'function') {
    window._nimOnConfirm(invoice, true);
  } else {
    _nimToast('success', 'Draft Saved', `Invoice ${invoice.id} saved as draft.`);
  }
}
window.saveInvoiceAsDraft = saveInvoiceAsDraft;

function confirmNewInvoice() {
  const invoice = buildNewInvoice('issued');
  if (!invoice) return;

  closeNewInvoiceModal();

  if (typeof window._nimOnConfirm === 'function') {
    window._nimOnConfirm(invoice, false);
  } else {
    _nimToast('success', 'Invoice Created', `Invoice ${invoice.id} has been created!`);
  }
}
window.confirmNewInvoice = confirmNewInvoice;

// ── Close dropdowns on outside click ─────────────────────────────────────────
document.addEventListener('click', function (e) {
  if (!e.target.closest('.product-search-wrap')) {
    const ps = document.getElementById('nimProductSuggestions');
    if (ps) ps.classList.remove('open');
  }
  if (!e.target.closest('#nimCustomerSearchInput') && !e.target.closest('#nimCustomerSuggestions')) {
    const cs = document.getElementById('nimCustomerSuggestions');
    if (cs) cs.classList.remove('open');
  }
});
