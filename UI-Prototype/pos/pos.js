/* Page-specific scripts — index.html */

const PRODUCTS = [
      { id:1, name:"Milo 400g",      price:680,  cat:"food",        bg:"#fef3c7", icon:"☕" },
      { id:2, name:"Anchor Milk 1L", price:420,  cat:"food",        bg:"#eff6ff", icon:"🥛" },
      { id:3, name:"Maliban Crackers",price:195, cat:"food",        bg:"#fefce8", icon:"🍪" },
      { id:4, name:"Dialog SIM",     price:100,  cat:"electronics", bg:"#f0f9ff", icon:"📱" },
      { id:5, name:"Munchee Biscuit",price:95,   cat:"food",        bg:"#fff7ed", icon:"🍫" },
      { id:6, name:"Dettol Soap",    price:220,  cat:"household",   bg:"#f0fdf4", icon:"🧼" },
      { id:7, name:"Singer Fan",     price:4800, cat:"electronics", bg:"#faf5ff", icon:"💨" },
      { id:8, name:"Hemas Shampoo",  price:350,  cat:"household",   bg:"#fdf2f8", icon:"🧴" },
      { id:9, name:"Lakmé Lotion",   price:550,  cat:"clothing",    bg:"#fff1f2", icon:"💅" },
    ];
    let cart = [
      { id:1, name:"Milo 400g",       price:680, qty:2 },
      { id:2, name:"Anchor Milk 1L",  price:420, qty:1 },
      { id:6, name:"Dettol Soap",     price:220, qty:3 },
    ];
    let activeCat = "all";

    function renderProducts(list) {
      const g = document.getElementById("prod-grid");
      g.innerHTML = list.map(p => `
        <div class="prod-card" onclick="addToCart(${p.id})">
          <div class="prod-img" style="background:${p.bg}">${p.icon}</div>
          <div class="prod-name">${p.name}</div>
          <div class="prod-footer">
            <span class="prod-price">₨${p.price.toLocaleString()}</span>
            <button class="prod-add" onclick="event.stopPropagation();addToCart(${p.id})"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>`).join("");
    }

    function filterCat(btn, cat) {
      document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active"); activeCat = cat; filterProducts();
    }
    function filterProducts() {
      const q = document.getElementById("prod-search").value.toLowerCase();
      const list = PRODUCTS.filter(p => (activeCat === "all" || p.cat === activeCat) && p.name.toLowerCase().includes(q));
      renderProducts(list);
    }
    function clearSearch() { document.getElementById("prod-search").value = ""; filterProducts(); }

    function addToCart(id) {
      const p = PRODUCTS.find(x => x.id === id);
      const ex = cart.find(x => x.id === id);
      if (ex) ex.qty++; else cart.push({ id: p.id, name: p.name, price: p.price, qty: 1 });
      renderCart();
    }
    function changeQty(id, delta) {
      const it = cart.find(x => x.id === id);
      if (!it) return;
      it.qty += delta;
      if (it.qty <= 0) cart = cart.filter(x => x.id !== id);
      renderCart();
    }
    function removeItem(id) { cart = cart.filter(x => x.id !== id); renderCart(); }

    function renderCart() {
      const el = document.getElementById("cart-items");
      el.innerHTML = cart.map(it => `
        <div class="cart-item">
          <div class="ci-name">${it.name}</div>
          <div class="ci-stepper">
            <button onclick="changeQty(${it.id},-1)">−</button>
            <span class="ci-qty">${it.qty}</span>
            <button onclick="changeQty(${it.id},1)">+</button>
          </div>
          <div class="ci-price">₨${it.price.toLocaleString()}</div>
          <div class="ci-total">₨${(it.price*it.qty).toLocaleString()}</div>
          <i class="fa-solid fa-trash ci-remove" onclick="removeItem(${it.id})"></i>
        </div>`).join("") || `<div style="text-align:center;padding:30px;color:#94a3b8;font-size:13px;"><i class="fa-solid fa-cart-shopping" style="font-size:32px;margin-bottom:8px;display:block;"></i>Cart is empty</div>`;
      document.getElementById("item-count").textContent = `(${cart.length} item${cart.length!==1?"s":""})`;
      recalc();
    }

    function recalc() {
      const sub = cart.reduce((s, i) => s + i.price * i.qty, 0);
      const dv = parseFloat(document.getElementById("discount-val").value) || 0;
      const dt = document.getElementById("discount-type").value;
      const disc = dt === "pct" ? sub * dv / 100 : Math.min(dv, sub);
      const taxable = sub - disc;
      const tax = taxable * 0.15;
      const total = taxable + tax;
      document.getElementById("subtotal").textContent = `LKR ${sub.toLocaleString("en-LK",{minimumFractionDigits:2})}`;
      document.getElementById("tax-val").textContent = `LKR ${tax.toLocaleString("en-LK",{minimumFractionDigits:2})}`;
      document.getElementById("grand-total").textContent = `LKR ${total.toLocaleString("en-LK",{minimumFractionDigits:2})}`;
      calcChange();
    }

    function calcChange() {
      const totalText = document.getElementById("grand-total").textContent.replace(/[^0-9.]/g, "");
      const total = parseFloat(totalText) || 0;
      const tendered = parseFloat(document.getElementById("cash-tendered").value) || 0;
      const change = Math.max(0, tendered - total);
      document.getElementById("change-display").textContent = `LKR ${change.toLocaleString("en-LK",{minimumFractionDigits:2})}`;
    }

    function setPayMethod(btn, method) {
      document.querySelectorAll(".pay-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    }

    function processPayment() {
      if (!cart.length) { alert("Cart is empty. Add products first."); return; }
      alert("✅ Payment processed successfully!\nReceipt printing…");
      cart = []; document.getElementById("cash-tendered").value = "";
      document.getElementById("discount-val").value = "0";
      renderCart();
    }

    function updateClock() {
      const n = new Date();
      document.getElementById("pos-time").textContent = n.toLocaleTimeString("en-LK",{hour:"2-digit",minute:"2-digit"});
    }

    // Init
    renderProducts(PRODUCTS);
    renderCart();
    updateClock();
    setInterval(updateClock, 30000);
