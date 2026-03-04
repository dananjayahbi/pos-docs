/* Page-specific scripts — dashboard.html */

// Greeting
(function() {
  const h = new Date().getHours();
  const greeting = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const user = JSON.parse(localStorage.getItem('lcc_user') || '{}');
  const name = user.role || 'Admin';
  const now = new Date();
  const days = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  document.getElementById('greetingText').textContent =
    `${greeting}, ${name} · Today is ${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`;
})();

// ── Load Dashboard Data ──
async function loadDashboard() {
  const [dashboardData, ordersData, productsData] = await Promise.all([
    loadData('data/dashboard.json'),
    loadData('data/orders.json'),
    loadData('data/products.json'),
  ]);

  if (dashboardData) {
    renderKPIs(dashboardData);
    renderCharts(dashboardData);
    renderActivity(dashboardData.dashboard?.recent_activities);
  }

  if (ordersData) renderRecentOrders(ordersData.orders.slice(0, 10));
  if (productsData) renderLowStock(productsData.products.filter(p => p.stock_total <= p.low_stock_threshold));
}

// ── KPI Cards ──
function renderKPIs(data) {
  const kpiData = data.dashboard?.today || {};
  const lowStockCount = data.dashboard?.low_stock_alerts?.length || 3;
  const cards = [
    {
      icon: 'fa-solid fa-money-bill-wave', iconClass: 'orange',
      value: formatLKRShort(kpiData.revenue || 124500),
      label: "Today's Revenue",
      sub: "All channels",
      change: (kpiData.revenue_change != null ? (kpiData.revenue_change >= 0 ? '+' : '') + kpiData.revenue_change + '%' : '+12.4%'),
      changeType: (kpiData.revenue_change != null ? (kpiData.revenue_change >= 0 ? 'up' : 'down') : 'up'),
    },
    {
      icon: 'fa-solid fa-bag-shopping', iconClass: 'blue',
      value: (kpiData.orders || 34).toString(),
      label: "Today's Orders",
      sub: "ERP + POS + Webstore",
      change: (kpiData.orders_change != null ? (kpiData.orders_change >= 0 ? '+' : '') + kpiData.orders_change : '+5'),
      changeType: (kpiData.orders_change != null ? (kpiData.orders_change >= 0 ? 'up' : 'down') : 'up'),
    },
    {
      icon: 'fa-solid fa-users', iconClass: 'green',
      value: (kpiData.new_customers || 7).toString(),
      label: 'New Customers',
      sub: 'Today',
      change: (kpiData.pending_approvals != null ? kpiData.pending_approvals + ' pending' : '+2'),
      changeType: 'up',
    },
    {
      icon: 'fa-solid fa-boxes-stacked', iconClass: 'red',
      value: lowStockCount.toString(),
      label: 'Low Stock Items',
      sub: 'Need reorder',
      change: lowStockCount + ' critical', changeType: 'down',
    },
  ];

  document.getElementById('kpiGrid').innerHTML = cards.map(c => `
    <div class="kpi-card">
      <div class="kpi-header">
        <div class="kpi-icon ${c.iconClass}"><i class="${c.icon}"></i></div>
        <span class="kpi-badge ${c.changeType}">${c.changeType === 'up' ? '<i class="fa-solid fa-arrow-trend-up"></i>' : '<i class="fa-solid fa-arrow-trend-down"></i>'} ${c.change}</span>
      </div>
      <div>
        <div class="kpi-value">${c.value}</div>
        <div class="kpi-label">${c.label}</div>
        <div class="kpi-sub">${c.sub}</div>
      </div>
    </div>
  `).join('');
}

// ── Revenue Chart ──
function renderCharts(data) {
  const labels = data.dashboard?.revenue_chart?.labels || ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const revenue = data.dashboard?.revenue_chart?.values || [45000, 67000, 82000, 55000, 90000, 110000, 95000];
  const orders  = data.dashboard?.revenue_chart?.orders  || [18, 24, 31, 22, 35, 42, 38];

  const ctx1 = document.getElementById('revenueChart').getContext('2d');
  new Chart(ctx1, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Revenue (₨)',
          data: revenue,
          backgroundColor: 'rgba(249,115,22,0.85)',
          borderRadius: 6,
          borderSkipped: false,
          yAxisID: 'y',
        },
        {
          label: 'Orders',
          data: orders,
          type: 'line',
          borderColor: '#1d4ed8',
          backgroundColor: 'rgba(29,78,216,0.08)',
          borderWidth: 2,
          pointRadius: 4,
          pointBackgroundColor: '#1d4ed8',
          yAxisID: 'y1',
          tension: 0.4,
          fill: true,
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: { legend: { display: false } },
      scales: {
        y:  { position: 'left',  beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { callback: v => '₨' + (v/1000).toFixed(0) + 'k', font: { size: 11 } } },
        y1: { position: 'right', beginAtZero: true, grid: { drawOnChartArea: false }, ticks: { font: { size: 11 } } },
        x:  { grid: { display: false }, ticks: { font: { size: 11 } } }
      }
    }
  });

  // Orders by source donut
  const src = data.orders_by_source || { POS: 45, Webstore: 28, Manual: 12, WhatsApp: 15 };
  const srcColors = ['#f97316','#1d4ed8','#10b981','#8b5cf6'];
  const ctx2 = document.getElementById('sourceChart').getContext('2d');
  new Chart(ctx2, {
    type: 'doughnut',
    data: {
      labels: Object.keys(src),
      datasets: [{ data: Object.values(src), backgroundColor: srcColors, borderWidth: 2, borderColor: '#fff', hoverOffset: 6 }]
    },
    options: {
      responsive: true, maintainAspectRatio: false, cutout: '65%',
      plugins: { legend: { display: false } }
    }
  });

  // Custom legend
  const legendEl = document.getElementById('sourceChartLegend');
  Object.entries(src).forEach(([k, v], i) => {
    const total = Object.values(src).reduce((a, b) => a + b, 0);
    const pct = Math.round(v / total * 100);
    legendEl.innerHTML += `
      <div style="display:flex;align-items:center;justify-content:space-between;font-size:0.75rem;">
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${srcColors[i]};"></span>
          <span style="color:var(--color-neutral-700);">${k}</span>
        </div>
        <div style="display:flex;align-items:center;gap:0.5rem;">
          <span style="font-weight:600;color:var(--color-neutral-900);">${v}</span>
          <span style="color:var(--color-neutral-400);">${pct}%</span>
        </div>
      </div>`;
  });
}

// ── Recent Orders Table ──
function renderRecentOrders(orders) {
  const sourceIcon = { pos: 'fa-cash-register', webstore: 'fa-globe', manual: 'fa-pen', whatsapp: 'fa-whatsapp' };
  document.getElementById('recentOrdersBody').innerHTML = orders.map(o => `
    <tr>
      <td>
        <a href="sales/orders.html?id=${o.id}" class="order-id">${o.id}</a>
        <div style="font-size:0.7rem;color:var(--color-neutral-400);margin-top:1px;">
          <i class="fa-solid ${sourceIcon[o.source] || 'fa-bag-shopping'}"></i> ${o.source}
        </div>
      </td>
      <td style="max-width:130px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${o.customer_name}</td>
      <td style="font-weight:600;">${formatLKR(o.total)}</td>
      <td>${statusBadge(o.status)}</td>
    </tr>
  `).join('');
}

// ── Low Stock ──
function renderLowStock(products) {
  const list = products.slice(0, 6);
  document.getElementById('lowStockCount').textContent = `${products.length} item${products.length !== 1 ? 's' : ''} need attention`;
  if (!list.length) {
    document.getElementById('lowStockList').innerHTML = `<div style="padding:1.5rem;text-align:center;color:var(--color-success-600,#16a34a);font-size:0.875rem;"><i class="fa-solid fa-circle-check"></i> All stock levels are healthy</div>`;
    return;
  }
  document.getElementById('lowStockList').innerHTML = list.map(p => `
    <div class="stock-alert-item">
      <img class="stock-img" src="${p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'}" alt="${p.name}" onerror="this.src='https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop'" />
      <div class="stock-info">
        <div class="stock-name">${p.name}</div>
        <div class="stock-sku">${p.sku}</div>
      </div>
      <div class="stock-qty ${p.stock_total === 0 ? 'zero' : 'low'}">${p.stock_total === 0 ? 'Out' : p.stock_total + ' left'}</div>
    </div>
  `).join('');
}

// ── Activity Feed ──
function renderActivity(feed) {
  if (!feed || !feed.length) return;
  document.getElementById('activityFeed').innerHTML = feed.map(item => `
    <div class="activity-item">
      <div class="activity-dot ${item.type || 'system'}"></div>
      <div>
        <div class="activity-text">${item.text}</div>
        <div class="activity-time">${timeAgo(item.time)}</div>
      </div>
    </div>
  `).join('');
}

// Init
loadDashboard();

// Simulate real-time notification
setTimeout(() => {
  if (window.Toast) Toast.success('New Order', 'Order #LCC-00142 received from Webstore', 5000);
}, 3000);
