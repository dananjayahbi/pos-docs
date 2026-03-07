/* ═══════════════════════════════════════════════════════════════════
   LCC POS Terminal  —  pos.js
═══════════════════════════════════════════════════════════════════ */

'use strict';

// ─── Product Data ──────────────────────────────────────────────────
const PRODUCTS = [
  { id:1,  name:"Milo 400g",           price:680,  cat:"food",        sku:"FOOD-001", stock:24,
    img:"https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:2,  name:"Anchor Milk 1L",      price:420,  cat:"food",        sku:"FOOD-002", stock:0,
    img:"https://images.unsplash.com/photo-1550583724-b2692b85b150?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:3,  name:"Maliban Crackers",    price:195,  cat:"food",        sku:"FOOD-003", stock:48,
    img:"https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:4,  name:"Munchee Biscuits",    price:95,   cat:"food",        sku:"FOOD-004", stock:3,
    img:"https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:5,  name:"Ceylon Tea 100g",     price:320,  cat:"food",        sku:"FOOD-005", stock:32,
    img:"https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:6,  name:"Coca-Cola 330ml",     price:120,  cat:"food",        sku:"FOOD-006", stock:50,
    img:"https://images.unsplash.com/photo-1554866585-cd94860890b7?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:7,  name:"Dialog SIM Card",     price:100,  cat:"electronics", sku:"ELEC-001", stock:12,
    img:"https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:8,  name:"Singer Table Fan",    price:4800, cat:"electronics", sku:"ELEC-002", stock:3,
    img:"https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:9,  name:"USB Type-C Charger",  price:750,  cat:"electronics", sku:"ELEC-003", stock:15,
    img:"https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:10, name:"Dettol Soap 100g",    price:220,  cat:"household",   sku:"HOME-001", stock:36,
    img:"https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:11, name:"Hemas Shampoo 200ml", price:350,  cat:"household",   sku:"HOME-002", stock:18,
    img:"https://images.unsplash.com/photo-1535585209359-c975e0ddb523?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:12, name:"Comfort 450ml",       price:280,  cat:"household",   sku:"HOME-003", stock:22,
    img:"https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:13, name:"Plain T-Shirt (S/M/L)",price:1200,cat:"clothing",    sku:"CLTH-001", stock:8,
    img:"https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:14, name:"Lakmé Body Lotion",   price:550,  cat:"clothing",    sku:"CLTH-002", stock:14,
    img:"https://images.unsplash.com/photo-1556228852-80b57e87a59e?w=300&h=220&fit=crop&auto=format&q=80" },
  { id:15, name:"Cotton Ankle Socks",  price:280,  cat:"clothing",    sku:"CLTH-003", stock:25,
    img:"https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=300&h=220&fit=crop&auto=format&q=80" },
];

// ─── State ─────────────────────────────────────────────────────────
let shiftSalesCount = 0;
let shiftRevenue    = 0;
const shiftStartTime = new Date();

let cart          = [];            // [{id, name, sku, price, qty, itemDiscount:{type,value}}]
let cartDiscount  = null;          // {type:'pct'|'lkr', value:number, reason:string, scope:'cart'|'item', itemId?}
let heldSales     = [];            // [{cart, customer, customerVal, ts, label}]
let currentCat    = 'all';
let currentPayMethod = 'cash';
let grandTotal    = 0;
let lastReceipt   = null;
let receiptCounter = 1000 + Math.floor(Math.random() * 400);

// ─── Utility: Format Currency ──────────────────────────────────────
function fmt(n) {
  const abs = Math.abs(n);
  const s = abs.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return '₨ ' + s;
}

// ─── Clock ─────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  const hh = String(now.getHours()).padStart(2,'0');
  const mm = String(now.getMinutes()).padStart(2,'0');
  const ss = String(now.getSeconds()).padStart(2,'0');
  const te = document.getElementById('pos-time');
  if (te) te.textContent = `${hh}:${mm}:${ss}`;

  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const de = document.getElementById('pos-date');
  if (de) de.textContent = `${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
}

// ─── Toast ─────────────────────────────────────────────────────────
function showToast(msg, type = 'success') {
  const icons = { success:'fa-check-circle', warning:'fa-exclamation-triangle', error:'fa-times-circle', info:'fa-info-circle' };
  const tc = document.getElementById('toastContainer');
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.innerHTML = `<i class="fa ${icons[type]||'fa-info-circle'}"></i> ${msg}`;
  tc.appendChild(t);
  setTimeout(() => { t.style.animation = 'toastOut .3s ease forwards'; setTimeout(() => t.remove(), 300); }, 2800);
}

// ─── Render Products ───────────────────────────────────────────────
function renderProducts(list) {
  const grid = document.getElementById('productGrid');
  if (!list || list.length === 0) {
    grid.innerHTML = `<div class="pos-no-results">
      <i class="fa fa-search"></i><p>No products found</p></div>`;
    return;
  }
  grid.innerHTML = list.map(p => {
    const oos = p.stock === 0;
    const low = p.stock > 0 && p.stock <= 5;
    let stockBadge = '';
    if (oos) stockBadge = `<span class="stock-badge stock-oos">Out of Stock</span>`;
    else if (low) stockBadge = `<span class="stock-badge stock-low">Low: ${p.stock}</span>`;
    else stockBadge = `<span class="stock-badge stock-ok">In Stock</span>`;

    return `<div class="prod-card${oos?' oos':''}" id="pcard-${p.id}" onclick="addToCart(${p.id})">
      <div class="prod-img-wrap">
        <img src="${p.img}" alt="${p.name}" loading="lazy" onerror="this.src='data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'220\' fill=\'%23f1f5f9\'%3E%3Crect width=\'300\' height=\'220\'/%3E%3Ctext x=\'50%25\' y=\'50%25\' font-size=\'30\' fill=\'%2394a3b8\' text-anchor=\'middle\' dy=\'.3em\'%3E🏷%3C/text%3E%3C/svg%3E'" />
        ${oos ? '<div class="oos-overlay"><span>OUT OF STOCK</span></div>' : ''}
      </div>
      <div class="prod-body">
        <div class="prod-name">${p.name}</div>
        <div class="prod-sku">${p.sku}</div>
        <div class="prod-footer">
          <span class="prod-price">${fmt(p.price)}</span>
          ${stockBadge}
        </div>
      </div>
    </div>`;
  }).join('');
}

// ─── Category Filter ───────────────────────────────────────────────
function filterCat(btn, cat) {
  currentCat = cat;
  document.querySelectorAll('.pos-cat-pill').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  filterProducts();
}

// ─── Combined Filter ───────────────────────────────────────────────
function filterProducts() {
  const q = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  const clearBtn = document.getElementById('searchClear');
  if (clearBtn) clearBtn.classList.toggle('visible', q.length > 0);

  let list = PRODUCTS;
  if (currentCat !== 'all') list = list.filter(p => p.cat === currentCat);
  if (q) list = list.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.sku.toLowerCase().includes(q)
  );
  renderProducts(list);
}

// ─── Clear Search ──────────────────────────────────────────────────
function clearSearch() {
  const si = document.getElementById('searchInput');
  si.value = '';
  si.focus();
  filterProducts();
}

// ─── Add to Cart ───────────────────────────────────────────────────
function addToCart(id) {
  const p = PRODUCTS.find(x => x.id === id);
  if (!p || p.stock === 0) return;

  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ id: p.id, name: p.name, sku: p.sku, price: p.price, qty: 1, itemDiscount: null });
  }

  // Card animation
  const card = document.getElementById(`pcard-${id}`);
  if (card) {
    card.classList.add('adding');
    setTimeout(() => card.classList.remove('adding'), 300);
  }

  renderCart();
  showToast(`${p.name} added to cart`, 'success');
}

// ─── Change Quantity ───────────────────────────────────────────────
function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    removeItem(id);
    return;
  }
  renderCart();
}

// ─── Remove Item ───────────────────────────────────────────────────
function removeItem(id) {
  cart = cart.filter(c => c.id !== id);
  renderCart();
}

// ─── Render Cart ───────────────────────────────────────────────────
function renderCart() {
  const area = document.getElementById('cartItems');
  const empty = document.getElementById('cartEmpty');
  const badge = document.getElementById('cartCountBadge');

  const totalItems = cart.reduce((s,c) => s + c.qty, 0);
  if (badge) badge.textContent = totalItems;

  if (cart.length === 0) {
    area.innerHTML = '';
    area.appendChild(empty || createEmptyEl());
    if (empty) empty.style.display = 'flex';
    recalc();
    return;
  }

  if (empty) empty.style.display = 'none';

  area.innerHTML = cart.map(item => {
    const lineTotal = item.price * item.qty;
    let discBadgeHtml = '';
    if (item.itemDiscount) {
      const dLabel = item.itemDiscount.type === 'pct'
        ? `${item.itemDiscount.value}% off`
        : `₨${item.itemDiscount.value} off`;
      discBadgeHtml = `<span class="cart-item-disc-badge">🏷 ${dLabel}</span>`;
    }
    return `<div class="cart-item" id="citem-${item.id}">
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-sku">${item.sku}</div>
        ${discBadgeHtml}
      </div>
      <div class="qty-stepper">
        <button class="qty-btn" onclick="changeQty(${item.id},-1)">−</button>
        <span class="qty-val">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${item.id},1)">+</button>
      </div>
      <div class="cart-item-price">${fmt(item.price)}</div>
      <div class="cart-item-total">${fmt(lineTotal)}</div>
      <button class="cart-remove-btn" onclick="removeItem(${item.id})" title="Remove">
        <i class="fa fa-trash-alt"></i>
      </button>
    </div>`;
  }).join('');

  recalc();
}

// ─── Recalculate Totals ────────────────────────────────────────────
function recalc() {
  let subtotal = cart.reduce((s, item) => {
    let linePrice = item.price * item.qty;
    // Per-item discount
    if (item.itemDiscount) {
      if (item.itemDiscount.type === 'pct') {
        linePrice -= linePrice * (item.itemDiscount.value / 100);
      } else {
        linePrice -= item.itemDiscount.value * item.qty;
      }
    }
    return s + Math.max(0, linePrice);
  }, 0);

  let discAmount = 0;
  const discRow = document.getElementById('discountRow');
  const discDisplay = document.getElementById('discountDisplay');
  const discBadge = document.getElementById('discBadge');

  if (cartDiscount && cartDiscount.scope === 'cart') {
    if (cartDiscount.type === 'pct') {
      discAmount = subtotal * (cartDiscount.value / 100);
      if (discBadge) discBadge.textContent = `${cartDiscount.value}%`;
    } else {
      discAmount = cartDiscount.value;
      if (discBadge) discBadge.textContent = `₨${cartDiscount.value}`;
    }
    discAmount = Math.min(discAmount, subtotal);
  }

  const hasDiscount = discAmount > 0 || cart.some(i => i.itemDiscount);
  if (discRow) discRow.style.display = hasDiscount ? 'flex' : 'none';
  if (discDisplay) discDisplay.textContent = `−${fmt(discAmount)}`;

  const taxable = subtotal - discAmount;
  const tax = taxable * 0.15;
  grandTotal = taxable + tax;

  document.getElementById('subtotalDisplay').textContent  = fmt(subtotal);
  document.getElementById('taxDisplay').textContent       = fmt(tax);
  document.getElementById('grandTotalDisplay').textContent = fmt(grandTotal);
}

// ─── Open Payment Modal ────────────────────────────────────────────
function openPaymentModal() {
  if (cart.length === 0) { showToast('Cart is empty!', 'warning'); return; }
  recalc();
  document.getElementById('payTotalDisplay').textContent = fmt(grandTotal);
  document.getElementById('tenderedInput').value = '';
  document.getElementById('changeAmount').textContent = '₨ 0.00';
  const cd = document.getElementById('changeDisplay');
  cd.className = 'pay-change-display';

  // Default to cash
  setPayMethod(document.getElementById('meth-cash'), 'cash');
  openModal('paymentModal');
  updateCompleteSaleBtn();
}

// ─── Set Pay Method ────────────────────────────────────────────────
function setPayMethod(btn, method) {
  currentPayMethod = method;
  document.querySelectorAll('.pay-method-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  document.getElementById('cashSection').style.display = method === 'cash' ? 'block' : 'none';
  document.getElementById('cardSection').style.display = method === 'card' ? 'block' : 'none';
  document.getElementById('qrSection').style.display   = method === 'qr'   ? 'block' : 'none';
  updateCompleteSaleBtn();
}

// ─── Numpad ────────────────────────────────────────────────────────
function numpadPress(val) {
  const inp = document.getElementById('tenderedInput');
  let cur = inp.value.replace(/[^0-9]/g, '');
  if (val === '⌫' || val === '←') {
    cur = cur.slice(0, -1);
  } else if (val === '00') {
    cur = cur + '00';
  } else {
    cur = cur + val;
  }
  // Max 7 digits
  if (cur.length > 7) cur = cur.slice(0, 7);
  // Display as decimal
  const num = parseInt(cur || '0', 10) / 100;
  inp.value = num === 0 ? '' : num.toFixed(2);
  calcChange();
}

// ─── Quick Cash ────────────────────────────────────────────────────
function setQuickCash(amount) {
  const inp = document.getElementById('tenderedInput');
  if (amount === 'exact') {
    inp.value = grandTotal.toFixed(2);
  } else {
    inp.value = Number(amount).toFixed(2);
  }
  calcChange();
}

// ─── Calculate Change ──────────────────────────────────────────────
function calcChange() {
  const tendered = parseFloat(document.getElementById('tenderedInput').value) || 0;
  const change = tendered - grandTotal;
  const el = document.getElementById('changeAmount');
  const cd = document.getElementById('changeDisplay');

  if (tendered === 0) {
    el.textContent = '₨ 0.00';
    cd.className = 'pay-change-display';
  } else if (change < 0) {
    el.textContent = `−₨ ${Math.abs(change).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    cd.className = 'pay-change-display negative';
  } else if (change === 0) {
    el.textContent = '₨ 0.00';
    cd.className = 'pay-change-display exact';
  } else {
    el.textContent = `₨ ${change.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    cd.className = 'pay-change-display positive';
  }

  updateCompleteSaleBtn();
}

function updateCompleteSaleBtn() {
  const btn = document.getElementById('completeSaleBtn');
  if (!btn) return;
  if (currentPayMethod === 'cash') {
    const tendered = parseFloat(document.getElementById('tenderedInput').value) || 0;
    btn.disabled = tendered < grandTotal;
  } else {
    btn.disabled = false;
  }
}

// ─── Complete Sale ─────────────────────────────────────────────────
function completeSale() {
  if (cart.length === 0) return;
  if (currentPayMethod === 'cash') {
    const tendered = parseFloat(document.getElementById('tenderedInput').value) || 0;
    if (tendered < grandTotal) { showToast('Insufficient cash tendered', 'error'); return; }
  }

  receiptCounter++;
  const now = new Date();
  const tendered = parseFloat(document.getElementById('tenderedInput').value) || grandTotal;
  const change   = currentPayMethod === 'cash' ? (tendered - grandTotal) : 0;

  lastReceipt = {
    receiptNo: receiptCounter,
    date: now.toLocaleDateString('en-GB'),
    time: now.toLocaleTimeString('en-GB'),
    cashier: 'Kasun Perera',
    customer: document.getElementById('customerSelect').options[document.getElementById('customerSelect').selectedIndex].text,
    items: cart.map(i => ({ ...i })),
    subtotal: cart.reduce((s,i) => s + i.price * i.qty, 0),
    discAmount: getCartDiscountAmount(),
    tax: 0,
    grandTotal,
    tendered,
    change,
    payMethod: currentPayMethod
  };
  lastReceipt.tax = (lastReceipt.subtotal - lastReceipt.discAmount) * 0.15;

  // Track shift stats
  shiftSalesCount++;
  shiftRevenue += grandTotal;

  closeModal('paymentModal');
  buildReceipt(lastReceipt);
  openModal('receiptModal');

  showToast('Sale completed successfully!', 'success');
}

function getCartDiscountAmount() {
  let subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  if (!cartDiscount || cartDiscount.scope !== 'cart') return 0;
  if (cartDiscount.type === 'pct') return Math.min(subtotal * cartDiscount.value / 100, subtotal);
  return Math.min(cartDiscount.value, subtotal);
}

// ─── Build Receipt ─────────────────────────────────────────────────
function buildReceipt(r) {
  const paper = document.getElementById('receiptPaper');
  const payMethodLabel = { cash:'Cash', card:'Card', qr:'QR Pay' }[r.payMethod] || r.payMethod;

  const itemsHtml = r.items.map(i =>
    `<div class="receipt-item">
      <span class="receipt-item-name">${i.name}</span>
      <span class="receipt-item-qty">×${i.qty}</span>
      <span class="receipt-item-price">${fmt(i.price * i.qty)}</span>
    </div>`
  ).join('');

  paper.innerHTML = `
    <div class="receipt-store-name">Demo Store</div>
    <div class="receipt-store-sub">
      No. 42, Galle Road, Colombo 07<br>
      Tel: +94 11 234 5678 &nbsp; VAT Reg: 123456789
    </div>
    <hr class="receipt-divider" />
    <div class="receipt-meta">
      <div><span>Receipt #</span><span>${r.receiptNo}</span></div>
      <div><span>Date</span><span>${r.date}</span></div>
      <div><span>Time</span><span>${r.time}</span></div>
      <div><span>Cashier</span><span>${r.cashier}</span></div>
      <div><span>Customer</span><span>${r.customer}</span></div>
      <div><span>Payment</span><span>${payMethodLabel}</span></div>
    </div>
    <hr class="receipt-divider" />
    <div class="receipt-items-header">
      <span>Item</span><span>Qty</span><span>Amount</span>
    </div>
    ${itemsHtml}
    <hr class="receipt-divider" />
    <div class="receipt-totals">
      <div><span>Subtotal</span><span>${fmt(r.subtotal)}</span></div>
      ${r.discAmount > 0 ? `<div><span>Discount</span><span>−${fmt(r.discAmount)}</span></div>` : ''}
      <div><span>VAT (15%)</span><span>${fmt(r.tax)}</span></div>
      <div class="receipt-total-grand"><span>TOTAL</span><span>${fmt(r.grandTotal)}</span></div>
      ${r.payMethod === 'cash' ? `<div><span>Cash Paid</span><span>${fmt(r.tendered)}</span></div>` : ''}
      ${r.payMethod === 'cash' ? `<div><span>Change</span><span>${fmt(r.change)}</span></div>` : ''}
    </div>
    <hr class="receipt-divider" />
    <div class="receipt-footer">
      Thank you for your purchase!<br>
      Powered by LankaCommerce Cloud
    </div>`;
}

// ─── Print Receipt ─────────────────────────────────────────────────
function printReceipt() {
  const content = document.getElementById('receiptPaper').innerHTML;
  const win = window.open('','_blank','width=400,height=600');
  win.document.write(`
    <html><head><title>Receipt</title>
    <style>
      body{font-family:'Courier New',monospace;font-size:12px;margin:16px;color:#000;}
      hr{border:none;border-top:1px dashed #000;margin:6px 0;}
      .receipt-store-name{font-size:14px;font-weight:bold;text-align:center;text-transform:uppercase;}
      .receipt-store-sub{text-align:center;font-size:10px;margin-bottom:8px;}
      .receipt-meta div,.receipt-totals div{display:flex;justify-content:space-between;}
      .receipt-items-header{display:flex;justify-content:space-between;font-weight:bold;font-size:10px;text-transform:uppercase;}
      .receipt-item{display:flex;justify-content:space-between;}
      .receipt-item-qty{width:28px;text-align:center;}
      .receipt-item-price{width:70px;text-align:right;}
      .receipt-total-grand{font-weight:bold;font-size:13px;border-top:2px solid #000;padding-top:3px;margin-top:3px;}
      .receipt-footer{text-align:center;margin-top:8px;font-size:10px;}
    </style></head><body>${content}</body></html>`);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 400);
}

// ─── WhatsApp Receipt ──────────────────────────────────────────────
function whatsappReceipt() {
  if (!lastReceipt) return;
  const lines = lastReceipt.items.map(i => `${i.name} x${i.qty} — ${fmt(i.price*i.qty)}`).join('\n');
  const msg = `*Demo Store Receipt*\n\nReceipt #${lastReceipt.receiptNo}\nDate: ${lastReceipt.date} ${lastReceipt.time}\n\n${lines}\n\nTotal: ${fmt(lastReceipt.grandTotal)}\n\nThank you!`;
  window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
}

// ─── New Sale ──────────────────────────────────────────────────────
function newSale() {
  closeModal('receiptModal');
  cart = [];
  cartDiscount = null;
  lastReceipt = null;
  document.getElementById('customerSelect').value = 'walkin';
  renderCart();
  showToast('Ready for new sale', 'info');
}

// ─── Discount Modal ────────────────────────────────────────────────
let discType  = 'pct';
let discScope = 'cart';

function openDiscountModal() {
  if (cart.length === 0) { showToast('Cart is empty!', 'warning'); return; }
  discType  = 'pct';
  discScope = 'cart';
  document.querySelector('input[name=discScope][value=cart]').checked = true;
  document.getElementById('discItemSelector').style.display = 'none';
  document.getElementById('discTypePct').classList.add('active');
  document.getElementById('discTypeLkr').classList.remove('active');
  document.getElementById('discPrefix').textContent = '%';
  document.getElementById('discValue').value = '';
  document.getElementById('discReason').value = '';
  document.getElementById('discPreview').textContent = 'Enter a value to see preview';
  document.getElementById('discPreview').className = 'disc-preview';

  // Populate item selector
  const sel = document.getElementById('discItemSelect');
  sel.innerHTML = cart.map(i => `<option value="${i.id}">${i.name} (${fmt(i.price)} × ${i.qty})</option>`).join('');

  openModal('discountModal');
}

function discScopeChange() {
  discScope = document.querySelector('input[name=discScope]:checked').value;
  document.getElementById('discItemSelector').style.display = discScope === 'item' ? 'block' : 'none';
  updateDiscPreview();
}

function setDiscType(btn, type) {
  discType = type;
  document.querySelectorAll('.disc-type-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('discPrefix').textContent = type === 'pct' ? '%' : '₨';
  const inp = document.getElementById('discValue');
  if (type === 'pct') { inp.max = 100; } else { inp.removeAttribute('max'); }
  updateDiscPreview();
}

function updateDiscPreview() {
  const val = parseFloat(document.getElementById('discValue').value) || 0;
  const prev = document.getElementById('discPreview');
  if (val <= 0) {
    prev.innerHTML = '<i class="fa fa-info-circle"></i> Enter a value to see preview';
    prev.className = 'disc-preview';
    return;
  }

  let baseAmount = 0;
  if (discScope === 'cart') {
    baseAmount = cart.reduce((s,i) => s + i.price * i.qty, 0);
  } else {
    const selId = parseInt(document.getElementById('discItemSelect').value, 10);
    const item = cart.find(i => i.id === selId);
    if (item) baseAmount = item.price * item.qty;
  }

  let discAmt = 0;
  if (discType === 'pct') {
    if (val > 100) {
      prev.innerHTML = '<i class="fa fa-exclamation-triangle"></i> Percentage cannot exceed 100%';
      prev.className = 'disc-preview warn';
      return;
    }
    discAmt = baseAmount * (val / 100);
  } else {
    discAmt = val;
    if (discAmt > baseAmount) {
      prev.innerHTML = `<i class="fa fa-exclamation-triangle"></i> Discount (${fmt(discAmt)}) exceeds amount (${fmt(baseAmount)})`;
      prev.className = 'disc-preview warn';
      return;
    }
  }

  prev.innerHTML = `<i class="fa fa-check-circle"></i> Discount: <strong>${fmt(discAmt)}</strong> will be applied`;
  prev.className = 'disc-preview';
}

function applyDiscount() {
  const val = parseFloat(document.getElementById('discValue').value);
  if (!val || val <= 0) { showToast('Enter a valid discount value', 'warning'); return; }
  if (discType === 'pct' && val > 100) { showToast('Percentage cannot exceed 100%', 'warning'); return; }

  if (discScope === 'cart') {
    cartDiscount = { scope: 'cart', type: discType, value: val };
    showToast(`Cart discount applied!`, 'success');
  } else {
    const selId = parseInt(document.getElementById('discItemSelect').value, 10);
    const item  = cart.find(i => i.id === selId);
    if (item) {
      item.itemDiscount = { type: discType, value: val };
      showToast(`Discount applied to ${item.name}`, 'success');
    }
  }

  closeModal('discountModal');
  renderCart();
}

// ─── Hold Sale ─────────────────────────────────────────────────────
function holdSale() {
  if (cart.length === 0) { showToast('Cart is empty — nothing to hold', 'warning'); return; }
  const sel = document.getElementById('customerSelect');
  const customerLabel = sel.options[sel.selectedIndex].text;
  heldSales.push({
    cart: cart.map(i => ({ ...i })),
    cartDiscount: cartDiscount ? { ...cartDiscount } : null,
    customer: customerLabel,
    customerVal: sel.value,
    ts: new Date(),
    label: `${customerLabel} — ${cart.length} item${cart.length>1?'s':''}`,
  });
  cart = [];
  cartDiscount = null;
  renderCart();
  updateHeldBadge();
  showToast('Sale held successfully', 'success');
}

function updateHeldBadge() {
  const hc = document.getElementById('heldCount');
  if (!hc) return;
  hc.textContent = heldSales.length;
  hc.style.display = heldSales.length > 0 ? 'flex' : 'none';
}

// ─── Held Modal ────────────────────────────────────────────────────
function openHeldModal() {
  const list = document.getElementById('heldSalesList');
  if (heldSales.length === 0) {
    list.innerHTML = `<div class="held-empty">
      <i class="fa fa-clipboard"></i>
      <p>No held sales</p>
    </div>`;
  } else {
    list.innerHTML = heldSales.map((h, idx) => {
      const t = h.ts instanceof Date ? h.ts : new Date(h.ts);
      const timeStr = t.toLocaleTimeString('en-LK', { hour:'2-digit', minute:'2-digit' });
      const total = h.cart.reduce((s,i) => s + i.price * i.qty, 0);
      return `<div class="held-sale-row">
        <div class="held-sale-info">
          <div class="held-sale-customer"><i class="fa fa-user"></i> ${h.customer}</div>
          <div class="held-sale-meta">
            <span>${h.cart.length} item${h.cart.length>1?'s':''}</span>
            <span>${fmt(total)}</span>
            <span>${timeStr}</span>
          </div>
        </div>
        <div class="held-sale-actions">
          <button class="btn-resume-held" onclick="resumeHeld(${idx})">
            <i class="fa fa-play"></i> Resume
          </button>
          <button class="btn-delete-held" onclick="deleteHeld(${idx})">
            <i class="fa fa-trash"></i>
          </button>
        </div>
      </div>`;
    }).join('');
  }
  openModal('heldModal');
}

function resumeHeld(idx) {
  const h = heldSales[idx];
  if (!h) return;
  if (cart.length > 0) {
    if (!confirm('Current cart will be replaced. Continue?')) return;
  }
  cart = h.cart.map(i => ({ ...i }));
  cartDiscount = h.cartDiscount ? { ...h.cartDiscount } : null;
  document.getElementById('customerSelect').value = h.customerVal;
  heldSales.splice(idx, 1);
  closeModal('heldModal');
  renderCart();
  updateHeldBadge();
  showToast(`Sale resumed for ${h.customer}`, 'success');
}

function deleteHeld(idx) {
  if (!confirm('Delete this held sale?')) return;
  heldSales.splice(idx, 1);
  updateHeldBadge();
  openHeldModal(); // Re-render
}

// ─── Clear Cart ────────────────────────────────────────────────────
function clearCart() {
  if (cart.length === 0) { showToast('Cart is already empty', 'info'); return; }
  if (!confirm(`Clear all ${cart.length} item${cart.length>1?'s':''} from cart?`)) return;
  cart = [];
  cartDiscount = null;
  renderCart();
  showToast('Cart cleared', 'warning');
}

// ─── Customer ──────────────────────────────────────────────────────
function setCustomer() {
  // reserved for future loyalty / pricing logic
}

// ─── Sync / End Shift ──────────────────────────────────────────────
function syncData() {
  showToast('Sync initiated… (demo mode)', 'info');
}
function exitPOS() {
  const warning = document.getElementById('exitPOSCartWarning');
  if (warning) warning.style.display = cart.length > 0 ? 'block' : 'none';
  openModal('exitPOSModal');
}
function confirmExitPOS() {
  window.location.href = '../erp/dashboard.html';
}
function endShift() {
  // Populate shift summary before showing modal
  const startEl = document.getElementById('shiftStartDisplay');
  const salesEl = document.getElementById('shiftSalesDisplay');
  const revEl   = document.getElementById('shiftRevenueDisplay');
  if (startEl) startEl.textContent = shiftStartTime.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' });
  if (salesEl) salesEl.textContent = shiftSalesCount + ' transaction' + (shiftSalesCount !== 1 ? 's' : '');
  if (revEl)   revEl.textContent = '\u20A8\u00A0' + shiftRevenue.toLocaleString('en-LK', { minimumFractionDigits: 2 });
  openModal('endShiftModal');
}
function confirmEndShift() {
  const role = getUserRole();
  // Save shift summary so leave.html can display it
  try {
    localStorage.setItem('lcc_last_shift', JSON.stringify({
      startTime: shiftStartTime.toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }),
      endTime: new Date().toLocaleTimeString('en-LK', { hour: '2-digit', minute: '2-digit' }),
      date: new Date().toLocaleDateString('en-LK', { weekday:'long', year:'numeric', month:'long', day:'numeric' }),
      salesCount: shiftSalesCount,
      revenue: shiftRevenue
    }));
  } catch(e) {}
  if (role === 'Cashier') {
    // Cashiers have no ERP access — go to shift-end leave page
    window.location.href = 'leave.html';
  } else {
    window.location.href = '../erp/dashboard.html';
  }
}
function printZReport() {
  showToast('Z-Report sent to printer (demo mode)', 'info');
}

// ─── Modal Helpers ─────────────────────────────────────────────────
function openModal(id) {
  const el = document.getElementById(id);
  if (el) { el.style.display = 'flex'; document.body.style.overflow = 'hidden'; }
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
  // Only restore if no other modals are open
  const open = document.querySelectorAll('.modal-overlay[style*="flex"]');
  if (open.length === 0) document.body.style.overflow = '';
}
function modalOverlayClick(e, id) {
  if (e.target === e.currentTarget) closeModal(id);
}

// ─── Keyboard Shortcuts ────────────────────────────────────────────
document.addEventListener('keydown', e => {
  const tag = (e.target.tagName || '').toLowerCase();
  const inInput = tag === 'input' || tag === 'textarea' || tag === 'select';

  if (e.key === 'Escape') {
    ['paymentModal','discountModal','heldModal','receiptModal','exitPOSModal','endShiftModal'].forEach(id => closeModal(id));
    return;
  }
  if (e.key === 'F1')  { e.preventDefault(); document.getElementById('searchInput')?.focus(); }
  if (e.key === 'F2')  { e.preventDefault(); openDiscountModal(); }
  if (e.key === 'F4')  { e.preventDefault(); holdSale(); }
  if (e.key === 'F5')  { e.preventDefault(); openHeldModal(); }
  if (e.key === 'F10') { e.preventDefault(); openPaymentModal(); }
});

// ─── Role Helpers ─────────────────────────────────────────────────
function getUserRole() {
  try {
    const user = JSON.parse(localStorage.getItem('lcc_user') || '{}');
    return user.role || '';
  } catch(e) { return ''; }
}

function applyRoleRestrictions() {
  const role = getUserRole();
  if (role === 'Cashier') {
    // Cashiers cannot navigate back to ERP — hide Exit POS button
    const exitBtn = document.getElementById('posExitBtn');
    if (exitBtn) exitBtn.style.display = 'none';
  }
}

// ─── Init ──────────────────────────────────────────────────────────
(function init() {
  updateClock();
  setInterval(updateClock, 1000);
  renderProducts(PRODUCTS);
  renderCart();
  applyRoleRestrictions();
})();
