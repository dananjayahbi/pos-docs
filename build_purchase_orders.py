"""Build the full purchase-orders page: data, CSS, JS, HTML."""

import os, json, random, datetime

# ── 0. Create directory ────────────────────────────────────
po_dir = 'e:/tmp/pos-arch/UI-Prototype/erp/purchase-orders'
os.makedirs(po_dir, exist_ok=True)

# ── 1. Generate data ───────────────────────────────────────
vendors = [
    ('VND-0041', 'Silva Electronics Ltd'),
    ('VND-0042', 'Perera FMCG Distributors'),
    ('VND-0043', 'Kandy Textile Suppliers'),
    ('VND-0044', 'Colombo Stationery Co'),
    ('VND-0045', 'Gampaha Food Importers'),
    ('VND-0046', 'Matale Hardware Hub'),
    ('VND-0047', 'Nugegoda Healthcare Pvt'),
    ('VND-0048', 'Ratnapura Accessories'),
]
statuses = ['pending', 'approved', 'received', 'cancelled', 'draft']
pay_statuses = ['unpaid', 'partial', 'paid']

records = []
random.seed(42)
base_date = datetime.date(2024, 6, 1)

for i in range(1, 25):
    vid, vname = random.choice(vendors)
    order_date = base_date + datetime.timedelta(days=random.randint(0, 300))
    expected = order_date + datetime.timedelta(days=random.randint(5, 45))
    status = random.choice(statuses)
    total = random.randint(25000, 850000)
    if status == 'received':
        pay_st = random.choice(['partial', 'paid'])
        paid = int(total * (0.5 if pay_st == 'partial' else 1.0))
    elif status in ('cancelled', 'draft'):
        pay_st = 'unpaid'
        paid = 0
    else:
        pay_st = random.choice(pay_statuses)
        paid = 0 if pay_st == 'unpaid' else int(total * 0.5) if pay_st == 'partial' else total

    records.append({
        'id': f'PO-{str(i).zfill(4)}',
        'vendor_id': vid,
        'vendor_name': vname,
        'order_date': order_date.isoformat(),
        'expected_date': expected.isoformat(),
        'items_count': random.randint(1, 15),
        'total_amount': total,
        'paid_amount': paid,
        'balance': total - paid,
        'status': status,
        'payment_status': pay_st,
        'notes': random.choice([
            'Urgent delivery required.', 'Standard terms apply.', '',
            'Check quality before acceptance.', 'Partial delivery agreed.',
            'Bulk discount negotiated.',
        ]),
        'created_date': order_date.isoformat(),
    })

data_path = 'e:/tmp/pos-arch/UI-Prototype/data/purchase-orders.json'
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump({'purchase_orders': records}, f, indent=2, ensure_ascii=False)
print(f'Data: {len(records)} records written to {data_path}')


# ── 2. CSS ─────────────────────────────────────────────────
css = r"""/* ════════════════════════════════
   Purchase Orders — purchase-orders.css
   ════════════════════════════════ */

/* KPI Grid */
.kpi-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 1rem; margin-bottom: 1.5rem; }
@media(max-width:900px){ .kpi-grid{ grid-template-columns: repeat(2,1fr); } }
.kpi-card {
  background: #fff; border-radius: 12px;
  padding: 1.1rem 1.25rem;
  display: flex; align-items: flex-start; gap: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,.06);
}
.kpi-icon {
  width: 42px; height: 42px; border-radius: 10px;
  display:flex; align-items:center; justify-content:center;
  font-size: 1.1rem; flex-shrink: 0;
}
.kpi-icon.blue   { background:#dbeafe; color:#2563eb; }
.kpi-icon.green  { background:#dcfce7; color:#16a34a; }
.kpi-icon.orange { background:#ffedd5; color:#ea580c; }
.kpi-icon.red    { background:#fee2e2; color:#dc2626; }
.kpi-label { font-size: .75rem; color: var(--color-neutral-500); font-weight: 500; }
.kpi-value { font-size: 1.35rem; font-weight: 700; color: var(--color-neutral-800); line-height: 1.2; margin: .1rem 0; }
.kpi-sub   { font-size: .72rem; color: var(--color-neutral-400); }

/* Filter Bar */
.filter-bar {
  display: flex; gap: .65rem; align-items: center;
  padding: .75rem 1rem; background: #fff;
  border-radius: 10px; margin-bottom: 1rem;
  box-shadow: 0 1px 4px rgba(0,0,0,.06); flex-wrap: wrap;
}
.search-wrap { position: relative; flex: 1; min-width: 200px; }
.search-wrap i { position:absolute; left:.7rem; top:50%; transform:translateY(-50%); color:var(--color-neutral-400); font-size:.85rem; }
.search-wrap input { width:100%; padding:.45rem .75rem .45rem 2rem; border:1px solid var(--color-neutral-200); border-radius:8px; font-size:.85rem; }
.filter-bar select { padding:.45rem .7rem; border:1px solid var(--color-neutral-200); border-radius:8px; font-size:.83rem; color:var(--color-neutral-700); cursor:pointer; }

/* Table */
.table-card {
  background: #fff; border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden;
  margin-bottom: 1rem;
}
.data-table { width:100%; border-collapse:collapse; }
.data-table th { padding:.7rem 1rem; font-size:.75rem; font-weight:600; text-transform:uppercase; letter-spacing:.05em; color:var(--color-neutral-500); background:var(--color-neutral-50,#f9fafb); border-bottom:1px solid var(--color-neutral-100); text-align:left; }
.data-table td { padding:.7rem 1rem; font-size:.83rem; color:var(--color-neutral-700); border-bottom:1px solid var(--color-neutral-50); }
.data-table tr:last-child td { border-bottom:none; }
.data-table tr:hover td { background:var(--color-neutral-50,#f9fafb); }
.po-id { font-weight:600; color:var(--color-primary-600,#2563eb); font-family:monospace; font-size:.82rem; }

/* Badges */
.badge { display:inline-flex; align-items:center; padding:.2rem .55rem; border-radius:6px; font-size:.72rem; font-weight:600; line-height:1.3; white-space:nowrap; }
.badge.active, .badge.approved  { background:#dcfce7; color:#15803d; }
.badge.pending                  { background:#fef9c3; color:#a16207; }
.badge.received                 { background:#dbeafe; color:#1d4ed8; }
.badge.draft                    { background:#f1f5f9; color:#64748b; }
.badge.cancelled                { background:#fee2e2; color:#dc2626; }
.badge.paid                     { background:#dcfce7; color:#15803d; }
.badge.partial                  { background:#ffedd5; color:#c2410c; }
.badge.unpaid                   { background:#fee2e2; color:#dc2626; }
.badge-blue   { background:#dbeafe; color:#1d4ed8; }
.badge-green  { background:#dcfce7; color:#15803d; }
.badge-orange { background:#ffedd5; color:#c2410c; }
.badge-red    { background:#fee2e2; color:#dc2626; }
.badge-gray   { background:#f1f5f9; color:#64748b; }

/* Actions */
.actions { display:flex; gap:.35rem; }
.btn-icon {
  width:30px; height:30px; border:none; background:none;
  border-radius:6px; cursor:pointer;
  display:flex; align-items:center; justify-content:center;
  font-size:.8rem; color:var(--color-neutral-500);
  transition:background .15s, color .15s;
}
.btn-icon:hover { background:var(--color-neutral-100); color:var(--color-neutral-700); }
.btn-icon.btn-icon-danger:hover { background:#fee2e2; color:#dc2626; }

/* Pagination */
.pagination-bar {
  display:flex; align-items:center; justify-content:space-between;
  padding:.75rem 1rem; font-size:.83rem; color:var(--color-neutral-500);
}
.pagination-btns { display:flex; gap:.3rem; flex-wrap:wrap; }
.pagination-btns button {
  background:#fff; border:1px solid var(--color-neutral-200);
  border-radius:6px; padding:.3rem .65rem;
  font-size:.82rem; color:var(--color-neutral-600);
  cursor:pointer; transition:border-color .15s,background .15s; min-width:32px;
}
.pagination-btns button:hover { border-color:var(--color-primary-400); color:var(--color-primary-600); }
.pagination-btns button.page-active { background:var(--color-primary-500); color:#fff; border-color:var(--color-primary-500); font-weight:600; }
.pagination-btns button:disabled { opacity:.4; cursor:not-allowed; }

/* Modal Overlay — override components.css opacity/visibility */
.modal-overlay {
  display:none; position:fixed; inset:0; z-index:500;
  background:rgba(0,0,0,.45); backdrop-filter:blur(2px);
  justify-content:center; align-items:flex-start;
  padding:2rem 1rem; overflow-y:auto;
  opacity:1; visibility:visible;
}
.modal-overlay.open { display:flex; }

/* Modal */
.modal {
  background:#fff; border-radius:12px;
  box-shadow:0 20px 60px rgba(0,0,0,.18);
  width:100%; max-height:90vh; overflow-y:auto; margin:auto;
}
.modal-header {
  display:flex; align-items:center; justify-content:space-between;
  padding:.9rem 1.25rem; border-bottom:1px solid var(--color-neutral-100);
}
.modal-title { font-size:1rem; font-weight:600; }
.modal-close {
  background:none; border:none; cursor:pointer;
  width:28px; height:28px; border-radius:6px;
  display:flex; align-items:center; justify-content:center;
  color:var(--color-neutral-500);
}
.modal-close:hover { background:var(--color-neutral-100); }
.modal-body { padding:1.25rem; }
.modal-footer {
  display:flex; align-items:center; justify-content:flex-end;
  gap:.5rem; padding:.9rem 1.25rem;
  border-top:1px solid var(--color-neutral-100);
}

/* Form helpers */
.form-section-title {
  font-size:.7rem; font-weight:700; letter-spacing:.06em;
  text-transform:uppercase; color:var(--color-neutral-400);
  margin-bottom:.75rem;
}
.form-grid-2 { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
.form-grid-3 { display:grid; grid-template-columns:1fr 1fr 1fr; gap:.75rem; }
@media(max-width:600px){ .form-grid-2,.form-grid-3 { grid-template-columns:1fr; } }

/* Radio group */
.radio-group { display:flex; flex-direction:column; gap:.4rem; margin-top:.25rem; }
.radio-option {
  display:flex; align-items:center; gap:.6rem;
  padding:.5rem .75rem; border:1px solid var(--color-neutral-200);
  border-radius:8px; cursor:pointer; font-size:.85rem;
  transition:border-color .15s,background .15s;
}
.radio-option:hover { border-color:var(--color-primary-400); background:var(--color-primary-50,#eff6ff); }
.radio-option input { accent-color:var(--color-primary-500); }

/* Danger button */
.btn-danger {
  background:#dc2626; color:#fff; border:none;
  border-radius:8px; padding:.45rem 1rem;
  font-size:.83rem; font-weight:500; cursor:pointer;
  display:inline-flex; align-items:center; gap:.4rem;
  transition:background .15s;
}
.btn-danger:hover { background:#b91c1c; }

/* Drawer */
.drawer-overlay {
  display:none; position:fixed; inset:0; z-index:490;
  background:rgba(0,0,0,.3);
}
.drawer-overlay.open { display:block; }
.po-drawer {
  position:fixed; right:-460px; top:0; bottom:0;
  width:440px; max-width:100vw;
  background:#fff; box-shadow:-4px 0 24px rgba(0,0,0,.14);
  z-index:495; display:flex; flex-direction:column;
  transition:right .28s cubic-bezier(.4,0,.2,1); overflow:hidden;
}
.po-drawer.open { right:0; }
.vd-header { flex-shrink:0; }
.vd-body   { flex:1; overflow-y:auto; padding:1rem 1.25rem; }
.vd-footer {
  flex-shrink:0; display:flex; gap:.5rem;
  padding:.8rem 1.25rem; border-top:1px solid var(--color-neutral-100);
}

/* Drawer sub-components */
.drawer-profile { display:flex; align-items:center; gap:.9rem; padding:1.2rem 1.25rem 1rem; border-bottom:1px solid var(--color-neutral-100); }
.drawer-avatar { width:46px; height:46px; border-radius:10px; background:var(--color-primary-100,#dbeafe); color:var(--color-primary-600,#2563eb); display:flex; align-items:center; justify-content:center; font-size:1rem; font-weight:700; flex-shrink:0; }
.drawer-po-id  { font-size:.75rem; color:var(--color-neutral-400); margin-top:.15rem; font-family:monospace; }
.drawer-company { font-weight:600; font-size:.93rem; }
.drawer-close { margin-left:auto; background:none; border:none; cursor:pointer; width:30px; height:30px; border-radius:7px; display:flex; align-items:center; justify-content:center; color:var(--color-neutral-500); font-size:.85rem; }
.drawer-close:hover { background:var(--color-neutral-100); }
.drawer-tabs { display:flex; border-bottom:1px solid var(--color-neutral-100); padding:0 1.25rem; flex-shrink:0; }
.dtab { background:none; border:none; cursor:pointer; padding:.65rem .85rem; font-size:.82rem; font-weight:500; color:var(--color-neutral-500); border-bottom:2px solid transparent; transition:color .15s,border-color .15s; }
.dtab.active { color:var(--color-primary-600,#2563eb); border-bottom-color:var(--color-primary-500); }
.dtab-pane { display:none; }
.dtab-pane.active { display:block; }
.drawer-section { margin-bottom:1.2rem; }
.drawer-section-title { font-size:.68rem; font-weight:700; letter-spacing:.06em; text-transform:uppercase; color:var(--color-neutral-400); margin-bottom:.6rem; }
.drawer-field { display:flex; justify-content:space-between; align-items:flex-start; padding:.35rem 0; border-bottom:1px solid var(--color-neutral-50); }
.drawer-field:last-child { border-bottom:none; }
.df-label { font-size:.78rem; color:var(--color-neutral-500); flex-shrink:0; }
.df-val { font-size:.82rem; font-weight:500; color:var(--color-neutral-700); text-align:right; word-break:break-word; }
.drawer-kpi-row { display:grid; grid-template-columns:1fr 1fr 1fr; gap:.6rem; margin-bottom:1rem; }
.drawer-kpi-box { background:var(--color-neutral-50); border-radius:10px; padding:.7rem; text-align:center; }
.drawer-kpi-val { font-size:1rem; font-weight:700; color:var(--color-neutral-700); }
.drawer-kpi-label { font-size:.68rem; color:var(--color-neutral-400); margin-top:.15rem; }
.drawer-progress-bar { background:var(--color-neutral-100); border-radius:4px; height:6px; overflow:hidden; margin-top:.4rem; }
.drawer-progress-fill { height:100%; border-radius:4px; background:var(--color-primary-500,#3b82f6); transition:width .4s ease; }
"""

css_path = os.path.join(po_dir, 'purchase-orders.css')
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print(f'CSS written: {css_path}')


# ── 3. HTML ─────────────────────────────────────────────────
html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Purchase Orders \u2014 LankaCommerce Cloud</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"/>
  <link rel="stylesheet" href="../../assets/css/variables.css"/>
  <link rel="stylesheet" href="../../assets/css/base.css"/>
  <link rel="stylesheet" href="../../assets/css/components.css"/>
  <link rel="stylesheet" href="../../assets/css/layout.css"/>
  <link rel="stylesheet" href="../erp.css"/>
  <link rel="stylesheet" href="purchase-orders.css"/>
</head>
<body>

<div class="app-shell">
  <aside class="sidebar" id="sidebar"></aside>

  <div class="main-wrapper" id="mainWrapper">
    <header class="top-bar" id="erpTopBar" data-page-title="Purchase Orders"></header>

    <main class="main-content">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Purchase Orders</h1>
          <p class="page-subtitle">Manage supplier purchase orders and payments</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" id="btnExport"><i class="fa-solid fa-file-export"></i> Export</button>
          <button class="btn btn-primary btn-sm" id="btnAddPO"><i class="fa-solid fa-plus"></i> New PO</button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon blue"><i class="fa-solid fa-cart-flatbed"></i></div>
          <div>
            <div class="kpi-label">Total POs</div>
            <div class="kpi-value" id="statTotalPO">\u2014</div>
            <div class="kpi-sub">All purchase orders</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon orange"><i class="fa-solid fa-hourglass-half"></i></div>
          <div>
            <div class="kpi-label">Pending / Approved</div>
            <div class="kpi-value" id="statPendingPO">\u2014</div>
            <div class="kpi-sub">Awaiting processing</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon red"><i class="fa-solid fa-clock-rotate-left"></i></div>
          <div>
            <div class="kpi-label">Outstanding Balance</div>
            <div class="kpi-value" id="statBalance">\u2014</div>
            <div class="kpi-sub">Unpaid + partial</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div>
            <div class="kpi-label">Total Order Value</div>
            <div class="kpi-value" id="statTotalValue">\u2014</div>
            <div class="kpi-sub">All-time PO value</div>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="search-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="searchInput" placeholder="Search by PO ID or vendor name\u2026"/>
        </div>
        <select id="filterStatus">
          <option value="">All Statuses</option>
          <option value="draft">Draft</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="received">Received</option>
          <option value="cancelled">Cancelled</option>
        </select>
        <select id="filterPayment">
          <option value="">All Payments</option>
          <option value="unpaid">Unpaid</option>
          <option value="partial">Partial</option>
          <option value="paid">Paid</option>
        </select>
        <button class="btn btn-ghost btn-sm" onclick="clearFilters()"><i class="fa-solid fa-xmark"></i> Clear</button>
      </div>

      <!-- PO Table -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>PO ID</th>
              <th>Vendor</th>
              <th>Order Date</th>
              <th>Expected Date</th>
              <th>Items</th>
              <th>Total (LKR)</th>
              <th>Status</th>
              <th>Payment</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="poBody">
            <tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">Loading\u2026</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar">
        <span id="paginationInfo">Showing 0\u20130 of 0 orders</span>
        <div class="pagination-btns" id="paginationBtns"></div>
      </div>

    </main>
  </div>
</div>

<!-- ========== EXPORT MODAL ========== -->
<div class="modal-overlay" id="exportModal">
  <div class="modal" style="max-width:420px;">
    <div class="modal-header">
      <h3 class="modal-title"><i class="fa-solid fa-file-export" style="color:var(--color-primary-500);"></i> Export Purchase Orders</h3>
      <button class="modal-close" onclick="closeExportModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Format</label>
        <div class="radio-group">
          <label class="radio-option"><input type="radio" name="exportFmt" value="csv" checked/><span><i class="fa-solid fa-file-csv"></i> CSV (Excel)</span></label>
          <label class="radio-option"><input type="radio" name="exportFmt" value="json"/><span><i class="fa-solid fa-code"></i> JSON</span></label>
        </div>
      </div>
      <div class="form-group" style="margin-top:.75rem;">
        <label class="form-label">Scope</label>
        <div class="radio-group">
          <label class="radio-option"><input type="radio" name="exportScope" value="filtered" checked/><span>Current filter results</span></label>
          <label class="radio-option"><input type="radio" name="exportScope" value="all"/><span>All purchase orders</span></label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost btn-sm" onclick="closeExportModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="doExport()"><i class="fa-solid fa-download"></i> Download</button>
    </div>
  </div>
</div>

<!-- ========== ADD / EDIT PO MODAL ========== -->
<div class="modal-overlay" id="poModal">
  <div class="modal" style="max-width:580px;">
    <div class="modal-header">
      <h3 class="modal-title" id="poModalTitle">New Purchase Order</h3>
      <button class="modal-close" onclick="closePOModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="poForm">
      <div class="modal-body">
        <div class="form-section-title">Vendor &amp; Dates</div>
        <div class="form-group"><label class="form-label required">Vendor Name</label><input type="text" id="fVendorName" class="form-control" placeholder="e.g. Silva Electronics Ltd" required/></div>
        <div class="form-grid-2" style="margin-top:.75rem;">
          <div class="form-group"><label class="form-label required">Order Date</label><input type="date" id="fOrderDate" class="form-control" required/></div>
          <div class="form-group"><label class="form-label">Expected Delivery</label><input type="date" id="fExpectedDate" class="form-control"/></div>
        </div>
        <div class="form-section-title" style="margin-top:1rem;">Order Details</div>
        <div class="form-grid-3">
          <div class="form-group"><label class="form-label">Items Count</label><input type="number" id="fItemsCount" class="form-control" placeholder="e.g. 5" min="1"/></div>
          <div class="form-group"><label class="form-label required">Total Amount (LKR)</label><input type="number" id="fTotalAmount" class="form-control" placeholder="e.g. 125000" min="0" required/></div>
          <div class="form-group"><label class="form-label">Paid Amount (LKR)</label><input type="number" id="fPaidAmount" class="form-control" placeholder="0" min="0" value="0"/></div>
        </div>
        <div class="form-grid-2" style="margin-top:.75rem;">
          <div class="form-group"><label class="form-label">Status</label>
            <select id="fStatus" class="form-control">
              <option value="draft">Draft</option><option value="pending" selected>Pending</option>
              <option value="approved">Approved</option><option value="received">Received</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="form-group"><label class="form-label">Payment Status</label>
            <select id="fPaymentStatus" class="form-control">
              <option value="unpaid" selected>Unpaid</option>
              <option value="partial">Partial</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        <div class="form-section-title" style="margin-top:1rem;">Notes</div>
        <div class="form-group"><textarea id="fNotes" class="form-control" rows="2" placeholder="Additional notes\u2026"></textarea></div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost btn-sm" onclick="closePOModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" id="poModalSaveBtn"><i class="fa-solid fa-plus"></i> Create PO</button>
      </div>
    </form>
  </div>
</div>

<!-- ========== DELETE MODAL ========== -->
<div class="modal-overlay" id="deletePOModal">
  <div class="modal" style="max-width:400px;">
    <div class="modal-header">
      <h3 class="modal-title" style="color:#dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Delete Purchase Order</h3>
      <button class="modal-close" onclick="closeDeleteModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body" style="text-align:center;padding:1.5rem 1.25rem;">
      <div style="width:52px;height:52px;border-radius:50%;background:#fef2f2;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin:0 auto 1rem;"><i class="fa-solid fa-trash"></i></div>
      <p style="font-size:.88rem;color:var(--color-neutral-600);line-height:1.6;">Are you sure you want to delete<br/><strong id="deletePOId">this order</strong>?<br/><span style="font-size:.75rem;color:var(--color-neutral-400);">This cannot be undone.</span></p>
    </div>
    <div class="modal-footer" style="justify-content:center;gap:.75rem;">
      <button class="btn btn-ghost btn-sm" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn btn-danger btn-sm" onclick="confirmDeletePO()"><i class="fa-solid fa-trash"></i> Delete</button>
    </div>
  </div>
</div>

<!-- ========== PO DETAIL DRAWER ========== -->
<div class="drawer-overlay" id="drawerOverlay" onclick="closePODrawer()"></div>
<div class="po-drawer" id="poDrawer">
  <div class="vd-header" id="poDrawerHeader"></div>
  <div class="vd-body" id="poDrawerBody"></div>
  <div class="vd-footer" id="poDrawerFooter"></div>
</div>

<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="toast-container" id="toastContainer"></div>

<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="../../assets/js/toast.js"></script>
<script src="purchase-orders.js"></script>
</body>
</html>'''

html_path = os.path.join(po_dir, 'index.html')
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print(f'HTML written: {html_path}, lines={html.count(chr(10))}')


# ── 4. JS ─────────────────────────────────────────────────
js = r"""/* ══════════════════════════════════════════════════
   Purchase Orders — purchase-orders.js
   ══════════════════════════════════════════════════ */
'use strict';

let allPOs      = [];
let filteredPOs = [];
let editingId   = null;
let deletingId  = null;
let currentPage = 1;
const PAGE_SIZE = 8;

const fmtLKR = n => '\u20a8 ' + Number(n).toLocaleString('en-LK');

function statusBadge(s) {
  return `<span class="badge ${s}">${s.charAt(0).toUpperCase()+s.slice(1)}</span>`;
}
function payBadge(s) {
  const map = { unpaid:'badge-red', partial:'badge-orange', paid:'badge-green' };
  return `<span class="badge ${map[s]||''}">${s.charAt(0).toUpperCase()+s.slice(1)}</span>`;
}

/* ─── Load ─── */
async function loadPOs() {
  try {
    const resp = await fetch('../../data/purchase-orders.json?v=' + Date.now());
    const data = await resp.json();
    allPOs = (data.purchase_orders || []).map(p => ({ ...p }));
    const saved = JSON.parse(localStorage.getItem('lcc_purchase_orders') || '[]');
    saved.forEach(sp => {
      const idx = allPOs.findIndex(p => p.id === sp.id);
      if (idx >= 0) allPOs[idx] = sp; else allPOs.push(sp);
    });
    applyFilters();
  } catch (e) {
    console.error('Failed to load POs:', e);
    showToast('Failed to load purchase order data.', 'error');
  }
}
function saveLocal() {
  localStorage.setItem('lcc_purchase_orders', JSON.stringify(allPOs));
}

/* ─── Stats ─── */
function updateStats() {
  const total   = allPOs.length;
  const pending = allPOs.filter(p => p.status === 'pending' || p.status === 'approved').length;
  const balance = allPOs.reduce((s, p) => s + (p.balance || 0), 0);
  const totalVal = allPOs.reduce((s, p) => s + (p.total_amount || 0), 0);

  document.getElementById('statTotalPO').textContent    = total;
  document.getElementById('statPendingPO').textContent  = pending;
  document.getElementById('statBalance').textContent    = fmtLKR(balance);
  document.getElementById('statTotalValue').textContent = fmtLKR(totalVal);
}

/* ─── Filters ─── */
function applyFilters() {
  const q   = (document.getElementById('searchInput').value||'').toLowerCase().trim();
  const st  = document.getElementById('filterStatus').value;
  const pay = document.getElementById('filterPayment').value;

  filteredPOs = allPOs.filter(p => {
    const mQ  = !q  || [p.id, p.vendor_name].some(f => (f||'').toLowerCase().includes(q));
    const mS  = !st  || p.status === st;
    const mP  = !pay || p.payment_status === pay;
    return mQ && mS && mP;
  });
  currentPage = 1;
  renderTable();
  updateStats();
}
function clearFilters() {
  document.getElementById('searchInput').value  = '';
  document.getElementById('filterStatus').value = '';
  document.getElementById('filterPayment').value = '';
  applyFilters();
}

/* ─── Table ─── */
function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredPOs.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('poBody');

  if (!page.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-cart-flatbed" style="font-size:2rem;display:block;margin-bottom:.5rem;opacity:.3;"></i>
      No purchase orders found.</td></tr>`;
  } else {
    tbody.innerHTML = page.map(p => `
      <tr>
        <td><span class="po-id">${p.id}</span></td>
        <td>
          <div style="font-weight:500;font-size:.84rem;">${p.vendor_name}</div>
          <div style="font-size:.72rem;color:var(--color-neutral-400);">${p.vendor_id||''}</div>
        </td>
        <td>${p.order_date ? new Date(p.order_date+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'}</td>
        <td>${p.expected_date ? new Date(p.expected_date+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}) : '—'}</td>
        <td style="text-align:center;">${p.items_count||0}</td>
        <td style="font-weight:600;">${fmtLKR(p.total_amount||0)}</td>
        <td>${statusBadge(p.status)}</td>
        <td>${payBadge(p.payment_status)}</td>
        <td>
          <div class="actions">
            <button class="btn-icon" title="View" onclick="openPODrawer('${p.id}')"><i class="fa-solid fa-eye"></i></button>
            <button class="btn-icon" title="Edit" onclick="openEditModal('${p.id}')"><i class="fa-solid fa-pen"></i></button>
            <button class="btn-icon btn-icon-danger" title="Delete" onclick="openDeleteModal('${p.id}')"><i class="fa-solid fa-trash"></i></button>
          </div>
        </td>
      </tr>`).join('');
  }
  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const total = filteredPOs.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage-1)*PAGE_SIZE+1, total);
  const end   = Math.min(currentPage*PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent = `Showing ${total?start:0}\u2013${end} of ${total} orders`;

  const btns = document.getElementById('paginationBtns');
  let html = `<button class="btn-icon" ${currentPage<=1?'disabled':''} onclick="goPage(${currentPage-1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let p=1; p<=pages; p++) {
    if (pages>7 && p!==1 && p!==pages && Math.abs(p-currentPage)>2) {
      if (p===2||p===pages-1) html += `<button class="btn-icon" disabled>\u2026</button>`;
      continue;
    }
    html += `<button class="btn-icon ${p===currentPage?'page-active':''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button class="btn-icon" ${currentPage>=pages?'disabled':''} onclick="goPage(${currentPage+1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  btns.innerHTML = html;
}
function goPage(p) {
  const pages = Math.ceil(filteredPOs.length / PAGE_SIZE);
  if (p<1||p>pages) return;
  currentPage = p;
  renderTable();
}

/* ──  EXPORT ── */
function openExportModal()  { document.getElementById('exportModal').classList.add('open'); }
function closeExportModal() { document.getElementById('exportModal').classList.remove('open'); }
function doExport() {
  const fmt   = document.querySelector('input[name="exportFmt"]:checked').value;
  const scope = document.querySelector('input[name="exportScope"]:checked').value;
  const list  = scope==='all' ? allPOs : filteredPOs;
  if (fmt==='csv') {
    const keys = ['id','vendor_name','order_date','expected_date','items_count','total_amount','paid_amount','balance','status','payment_status'];
    const rows = [keys.join(',')];
    list.forEach(p => rows.push(keys.map(k => `"${(p[k]??'').toString().replace(/"/g,'""')}"`).join(',')));
    downloadFile('purchase_orders.csv', rows.join('\n'), 'text/csv');
  } else {
    downloadFile('purchase_orders.json', JSON.stringify(list,null,2), 'application/json');
  }
  closeExportModal();
  showToast(`Exported ${list.length} orders as ${fmt.toUpperCase()}.`, 'success');
}
function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content],{type}));
  a.download = name; a.click(); URL.revokeObjectURL(a.href);
}

/* ── ADD / EDIT ── */
function openAddModal() {
  editingId = null;
  document.getElementById('poModalTitle').textContent = 'New Purchase Order';
  document.getElementById('poModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Create PO';
  document.getElementById('poForm').reset();
  document.getElementById('fOrderDate').value = new Date().toISOString().slice(0,10);
  document.getElementById('poModal').classList.add('open');
}
function openEditModal(id) {
  const p = allPOs.find(p => p.id===id);
  if (!p) return;
  editingId = id;
  document.getElementById('poModalTitle').textContent = `Edit — ${id}`;
  document.getElementById('poModalSaveBtn').innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
  const f = id2 => document.getElementById(id2);
  f('fVendorName').value     = p.vendor_name||'';
  f('fOrderDate').value      = p.order_date||'';
  f('fExpectedDate').value   = p.expected_date||'';
  f('fItemsCount').value     = p.items_count||'';
  f('fTotalAmount').value    = p.total_amount||0;
  f('fPaidAmount').value     = p.paid_amount||0;
  f('fStatus').value         = p.status||'pending';
  f('fPaymentStatus').value  = p.payment_status||'unpaid';
  f('fNotes').value          = p.notes||'';
  document.getElementById('poModal').classList.add('open');
}
function closePOModal() {
  document.getElementById('poModal').classList.remove('open');
}
function savePO(e) {
  e.preventDefault();
  const f = id => document.getElementById(id);
  const totalAmt = parseFloat(f('fTotalAmount').value)||0;
  const paidAmt  = parseFloat(f('fPaidAmount').value)||0;
  const form = {
    vendor_name:    f('fVendorName').value.trim(),
    order_date:     f('fOrderDate').value,
    expected_date:  f('fExpectedDate').value,
    items_count:    parseInt(f('fItemsCount').value)||1,
    total_amount:   totalAmt,
    paid_amount:    paidAmt,
    balance:        Math.max(0, totalAmt - paidAmt),
    status:         f('fStatus').value,
    payment_status: f('fPaymentStatus').value,
    notes:          f('fNotes').value.trim(),
  };
  if (!form.vendor_name) { showToast('Vendor name is required.','warning'); return; }
  if (!form.order_date)  { showToast('Order date is required.','warning'); return; }

  if (editingId) {
    const idx = allPOs.findIndex(p => p.id===editingId);
    if (idx>=0) allPOs[idx] = { ...allPOs[idx], ...form };
    showToast('Purchase order updated.','success');
  } else {
    const newId = 'PO-' + String(Math.max(0,...allPOs.map(p=>parseInt(p.id.split('-')[1])||0))+1).padStart(4,'0');
    allPOs.unshift({ id:newId, vendor_id:'', created_date:form.order_date, ...form });
    showToast('Purchase order created.','success');
  }
  saveLocal(); closePOModal(); applyFilters();
}

/* ── VIEW DRAWER ── */
function openPODrawer(id) {
  const p = allPOs.find(p => p.id===id);
  if (!p) return;

  const colorsArr = ['#3b82f6','#f97316','#8b5cf6','#14b8a6','#ec4899'];
  const color = colorsArr[parseInt(id.replace(/\D/g,''))%colorsArr.length];
  const paidPct = p.total_amount>0 ? Math.min(100,Math.round((p.paid_amount/p.total_amount)*100)) : 0;

  document.getElementById('poDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar" style="background:${color};"><i class="fa-solid fa-cart-flatbed" style="color:#fff;font-size:.9rem;"></i></div>
      <div>
        <div class="drawer-company">${p.vendor_name}</div>
        <div class="drawer-po-id">${p.id}</div>
        ${statusBadge(p.status)}
      </div>
      <button class="drawer-close" onclick="closePODrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchPOTab(this,'dtab-details')">Details</button>
      <button class="dtab" onclick="switchPOTab(this,'dtab-payment')">Payment</button>
      <button class="dtab" onclick="switchPOTab(this,'dtab-notes')">Notes</button>
    </div>
  `;

  document.getElementById('poDrawerBody').innerHTML = `
    <div id="dtab-details" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-truck"></i> Vendor</div>
        <div class="drawer-field"><span class="df-label">Vendor Name</span><span class="df-val">${p.vendor_name}</span></div>
        <div class="drawer-field"><span class="df-label">Vendor ID</span><span class="df-val">${p.vendor_id||'—'}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-calendar"></i> Dates & Items</div>
        <div class="drawer-field"><span class="df-label">Order Date</span><span class="df-val">${p.order_date?new Date(p.order_date+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—'}</span></div>
        <div class="drawer-field"><span class="df-label">Expected Delivery</span><span class="df-val">${p.expected_date?new Date(p.expected_date+'T00:00').toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}):'—'}</span></div>
        <div class="drawer-field"><span class="df-label">Items Count</span><span class="df-val">${p.items_count||0} items</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-tag"></i> Status</div>
        <div class="drawer-field"><span class="df-label">Order Status</span><span class="df-val">${statusBadge(p.status)}</span></div>
        <div class="drawer-field"><span class="df-label">Payment Status</span><span class="df-val">${payBadge(p.payment_status)}</span></div>
      </div>
    </div>

    <div id="dtab-payment" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-money-bill-wave"></i> Financials</div>
        <div class="drawer-kpi-row">
          <div class="drawer-kpi-box"><div class="drawer-kpi-val">${fmtLKR(p.total_amount||0)}</div><div class="drawer-kpi-label">Total</div></div>
          <div class="drawer-kpi-box"><div class="drawer-kpi-val">${fmtLKR(p.paid_amount||0)}</div><div class="drawer-kpi-label">Paid</div></div>
          <div class="drawer-kpi-box"><div class="drawer-kpi-val" style="color:${(p.balance||0)>0?'#dc2626':'#16a34a'}">${fmtLKR(p.balance||0)}</div><div class="drawer-kpi-label">Balance</div></div>
        </div>
        <div style="margin-top:.75rem;">
          <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--color-neutral-500);margin-bottom:.3rem;">
            <span>Payment Progress</span><span>${paidPct}%</span>
          </div>
          <div class="drawer-progress-bar"><div class="drawer-progress-fill" style="width:${paidPct}%;background:${paidPct>=100?'#16a34a':paidPct>50?'#f59e0b':'#dc2626'};"></div></div>
        </div>
      </div>
    </div>

    <div id="dtab-notes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-note-sticky"></i> Notes</div>
        <p style="font-size:.85rem;color:var(--color-neutral-600);line-height:1.6;">${p.notes||'No notes for this order.'}</p>
      </div>
    </div>
  `;

  document.getElementById('poDrawerFooter').innerHTML = `
    <button class="btn btn-outline btn-sm" onclick="closePODrawer()"><i class="fa-solid fa-xmark"></i> Close</button>
    <button class="btn btn-primary btn-sm" onclick="openEditModal('${p.id}');closePODrawer()"><i class="fa-solid fa-pen"></i> Edit</button>
    <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;" onclick="closePODrawer();openDeleteModal('${p.id}')"><i class="fa-solid fa-trash"></i></button>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('poDrawer').classList.add('open');
}
function closePODrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('poDrawer').classList.remove('open');
}
function switchPOTab(btn, tabId) {
  document.querySelectorAll('#poDrawerHeader .dtab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#poDrawerBody .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

/* ── DELETE ── */
function openDeleteModal(id) {
  const p = allPOs.find(p => p.id===id);
  if (!p) return;
  deletingId = id;
  document.getElementById('deletePOId').textContent = `${p.vendor_name} — ${id}`;
  document.getElementById('deletePOModal').classList.add('open');
}
function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deletePOModal').classList.remove('open');
}
function confirmDeletePO() {
  if (!deletingId) return;
  allPOs = allPOs.filter(p => p.id!==deletingId);
  saveLocal(); closeDeleteModal(); applyFilters();
  showToast('Purchase order deleted.','success');
  deletingId = null;
}

/* ── Event Listeners ── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddPO').addEventListener('click', openAddModal);
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterPayment').addEventListener('change', applyFilters);
document.getElementById('poForm').addEventListener('submit', savePO);
document.getElementById('poModal').addEventListener('click', function(e){ if(e.target===this) closePOModal(); });
document.getElementById('exportModal').addEventListener('click', function(e){ if(e.target===this) closeExportModal(); });
document.getElementById('deletePOModal').addEventListener('click', function(e){ if(e.target===this) closeDeleteModal(); });

/* ── Toast fallback ── */
function showToast(msg, type='success') {
  if (window.LCC && window.LCC.showToast) { window.LCC.showToast(msg,type); return; }
  const el = document.createElement('div');
  const bg = type==='success'?'#16a34a':type==='warning'?'#d97706':type==='info'?'#2563eb':'#dc2626';
  el.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;background:${bg};color:#fff;padding:.75rem 1.25rem;border-radius:8px;font-size:.875rem;box-shadow:0 4px 16px rgba(0,0,0,.2);`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ── Init ── */
loadPOs();
"""

js_path = os.path.join(po_dir, 'purchase-orders.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print(f'JS written: {js_path}, lines={js.count(chr(10))}')

print('\nAll files created successfully.')
