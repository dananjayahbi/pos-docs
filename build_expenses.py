"""Build the full Expenses page: data, CSS, JS, HTML."""

import os, json, random, datetime

# ── 0. Create directory ────────────────────────────────────
exp_dir = 'e:/tmp/pos-arch/UI-Prototype/erp/expenses'
os.makedirs(exp_dir, exist_ok=True)

# ── 1. Generate data ───────────────────────────────────────
categories = ['Rent', 'Utilities', 'Payroll', 'Supplies', 'Transport', 'Maintenance', 'Marketing', 'Other']
payment_methods = ['cash', 'bank_transfer', 'cheque', 'card']
statuses = ['paid', 'paid', 'paid', 'pending', 'pending', 'approved', 'rejected']

vendors = {
    'Rent':        ['Colombo City Properties Ltd', 'Lanka Realty Holdings', 'Rajapaksa Property Group', 'Perera Real Estate'],
    'Utilities':   ['Ceylon Electricity Board', 'Lanka Electricity Company', 'National Water Supply Board', 'LECO Electricity'],
    'Payroll':     ['PayMaster HR Solutions', 'HNB Payroll Services', 'Sampath Salary Processing', 'BOC Staff Payments'],
    'Supplies':    ['Lanka Office Supplies', 'Cargills Office Mart', 'Keells Office Solutions', 'Abans Stationery'],
    'Transport':   ['Mobitel Fleet Services', 'Lanka Ashok Leyland', 'Dialog Logistics', 'Ideal Motors Pvt Ltd'],
    'Maintenance': ['Fix-It Lanka Solutions', 'Silva Technical Services', 'Fernandopulle Repairs', 'National Engineering Pvt'],
    'Marketing':   ['Leo Burnett Lanka', 'Ogilvy Sri Lanka', 'MullenLowe Lanka', 'Quantum Digital Agency'],
    'Other':       ['Miscellaneous Suppliers Ltd', 'Lanka Petty Cash Vendors', 'General Purchases Co', 'Ad-hoc Services Lanka'],
}

descriptions = {
    'Rent':        ['Office Rent — {m} 2025', 'Warehouse Lease — {m} 2025', 'Retail Space Rent — {m} 2025'],
    'Utilities':   ['Electricity Bill — {m} 2025', 'Water Bill — {m} 2025', 'Internet & Phone — {m} 2025'],
    'Payroll':     ['Staff Salaries — {m} 2025', 'Overtime Payments — {m} 2025', 'Bonus Disbursement — {m} 2025'],
    'Supplies':    ['Office Stationery — {m} 2025', 'Cleaning Supplies — {m} 2025', 'Pantry & Consumables — {m} 2025'],
    'Transport':   ['Vehicle Fuel — {m} 2025', 'Delivery Fleet Costs — {m} 2025', 'Staff Transport — {m} 2025'],
    'Maintenance': ['AC Servicing — {m} 2025', 'Equipment Repair — {m} 2025', 'Building Maintenance — {m} 2025'],
    'Marketing':   ['Social Media Ads — {m} 2025', 'Print Advertising — {m} 2025', 'Digital Marketing — {m} 2025'],
    'Other':       ['Miscellaneous Expenses — {m} 2025', 'Petty Cash Reimbursement — {m} 2025', 'Sundry Expenses — {m} 2025'],
}

amount_ranges = {
    'Rent':        (75000, 550000),
    'Utilities':   (8500,  45000),
    'Payroll':     (120000, 450000),
    'Supplies':    (3500,  25000),
    'Transport':   (5000,  35000),
    'Maintenance': (4500,  60000),
    'Marketing':   (15000, 120000),
    'Other':       (2500,  18000),
}

months = ['January', 'February', 'March', 'April', 'May']
month_nums = [1, 2, 3, 4, 5]

creators = [
    'Ashan Perera', 'Dilrukshi Fernando', 'Kasun Jayawardena',
    'Nimesha Silva', 'Roshan De Silva', 'Tharushi Rajapaksa',
    'Chaminda Bandara', 'Sanduni Wickramasinghe',
]

notes_pool = [
    'Approved by manager.', 'Recurring monthly expense.',
    'One-time payment.', 'Requires CFO approval.',
    '', '', '', 'Paid via company account.', 'Receipt attached.',
    'Pending invoice verification.',
]

random.seed(42)
records = []

for i in range(1, 26):
    cat = random.choice(categories)
    mo_idx = random.randint(0, 4)
    mo_num = month_nums[mo_idx]
    mo_name = months[mo_idx]
    day = random.randint(1, 28)
    date_str = datetime.date(2025, mo_num, day).isoformat()
    vendor = random.choice(vendors[cat])
    desc_tmpl = random.choice(descriptions[cat])
    desc = desc_tmpl.replace('{m}', mo_name)
    amt_min, amt_max = amount_ranges[cat]
    amount = random.randint(amt_min, amt_max)
    pay_method = random.choice(payment_methods)
    status = random.choice(statuses)
    ref_prefix = random.choice(['BILL', 'PAY'])
    reference = f'{ref_prefix}-{random.randint(1000, 9999)}'
    notes = random.choice(notes_pool)
    created_by = random.choice(creators)

    records.append({
        'id':             f'EXP-{str(i).zfill(4)}',
        'date':           date_str,
        'category':       cat,
        'vendor_name':    vendor,
        'reference':      reference,
        'description':    desc,
        'amount':         amount,
        'payment_method': pay_method,
        'status':         status,
        'notes':          notes,
        'created_by':     created_by,
    })

data_path = 'e:/tmp/pos-arch/UI-Prototype/data/expenses.json'
with open(data_path, 'w', encoding='utf-8') as f:
    json.dump({'expenses': records}, f, indent=2, ensure_ascii=False)
print(f'Data: {len(records)} records written to {data_path}')


# ── 2. CSS ─────────────────────────────────────────────────
css = r"""/* ════════════════════════════════
   Expenses — expenses.css
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
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; flex-shrink: 0;
}
.kpi-icon.blue   { background: #dbeafe; color: #2563eb; }
.kpi-icon.green  { background: #dcfce7; color: #16a34a; }
.kpi-icon.orange { background: #ffedd5; color: #ea580c; }
.kpi-icon.red    { background: #fee2e2; color: #dc2626; }
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
.search-wrap i { position: absolute; left: .7rem; top: 50%; transform: translateY(-50%); color: var(--color-neutral-400); font-size: .85rem; }
.search-wrap input { width: 100%; padding: .45rem .75rem .45rem 2rem; border: 1px solid var(--color-neutral-200); border-radius: 8px; font-size: .85rem; }
.filter-bar select { padding: .45rem .7rem; border: 1px solid var(--color-neutral-200); border-radius: 8px; font-size: .83rem; color: var(--color-neutral-700); cursor: pointer; }

/* Table */
.table-card {
  background: #fff; border-radius: 12px;
  box-shadow: 0 1px 4px rgba(0,0,0,.06); overflow: hidden;
  margin-bottom: 1rem;
}
.data-table { width: 100%; border-collapse: collapse; }
.data-table th { padding: .7rem 1rem; font-size: .75rem; font-weight: 600; text-transform: uppercase; letter-spacing: .05em; color: var(--color-neutral-500); background: var(--color-neutral-50,#f9fafb); border-bottom: 1px solid var(--color-neutral-100); text-align: left; }
.data-table td { padding: .7rem 1rem; font-size: .83rem; color: var(--color-neutral-700); border-bottom: 1px solid var(--color-neutral-50); }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: var(--color-neutral-50,#f9fafb); }
.exp-id { font-weight: 600; color: var(--color-primary-600,#2563eb); font-family: monospace; font-size: .82rem; }

/* Badges */
.badge { display: inline-flex; align-items: center; padding: .2rem .55rem; border-radius: 6px; font-size: .72rem; font-weight: 600; line-height: 1.3; white-space: nowrap; }
.badge.paid     { background: #dcfce7; color: #15803d; }
.badge.pending  { background: #fef9c3; color: #a16207; }
.badge.approved { background: #dbeafe; color: #1d4ed8; }
.badge.rejected { background: #fee2e2; color: #dc2626; }
.badge-blue   { background: #dbeafe; color: #1d4ed8; }
.badge-green  { background: #dcfce7; color: #15803d; }
.badge-orange { background: #ffedd5; color: #c2410c; }
.badge-gray   { background: #f1f5f9; color: #64748b; }
.badge-red    { background: #fee2e2; color: #dc2626; }

/* Actions */
.actions { display: flex; gap: .35rem; }
.btn-icon {
  width: 30px; height: 30px; border: none; background: none;
  border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  font-size: .8rem; color: var(--color-neutral-500);
  transition: background .15s, color .15s;
}
.btn-icon:hover { background: var(--color-neutral-100); color: var(--color-neutral-700); }
.btn-icon.btn-icon-danger:hover { background: #fee2e2; color: #dc2626; }

/* Pagination */
.pagination-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1rem; font-size: .83rem; color: var(--color-neutral-500);
}
.pagination-btns { display: flex; gap: .3rem; flex-wrap: wrap; }
.pagination-btns button {
  background: #fff; border: 1px solid var(--color-neutral-200);
  border-radius: 6px; padding: .3rem .65rem;
  font-size: .82rem; color: var(--color-neutral-600);
  cursor: pointer; transition: border-color .15s, background .15s; min-width: 32px;
}
.pagination-btns button:hover { border-color: var(--color-primary-400); color: var(--color-primary-600); }
.pagination-btns button.page-active { background: var(--color-primary-500); color: #fff; border-color: var(--color-primary-500); font-weight: 600; }
.pagination-btns button:disabled { opacity: .4; cursor: not-allowed; }

/* Modal Overlay — override components.css opacity/visibility — CRITICAL */
.modal-overlay {
  display: none;
  opacity: 1;
  visibility: visible;
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,.45); backdrop-filter: blur(2px);
  justify-content: center; align-items: flex-start;
  padding: 2rem 1rem; overflow-y: auto;
}
.modal-overlay.open { display: flex; }

/* Modal */
.modal {
  background: #fff; border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,.18);
  width: 100%; max-height: 90vh; overflow-y: auto; margin: auto;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: .9rem 1.25rem; border-bottom: 1px solid var(--color-neutral-100);
}
.modal-title { font-size: 1rem; font-weight: 600; }
.modal-close {
  background: none; border: none; cursor: pointer;
  width: 28px; height: 28px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-neutral-500);
}
.modal-close:hover { background: var(--color-neutral-100); }
.modal-body { padding: 1.25rem; }
.modal-footer {
  display: flex; align-items: center; justify-content: flex-end;
  gap: .5rem; padding: .9rem 1.25rem;
  border-top: 1px solid var(--color-neutral-100);
}

/* Form helpers */
.form-section-title {
  font-size: .7rem; font-weight: 700; letter-spacing: .06em;
  text-transform: uppercase; color: var(--color-neutral-400);
  margin-bottom: .75rem;
}
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .75rem; }
@media(max-width:600px){ .form-grid-2,.form-grid-3 { grid-template-columns: 1fr; } }

/* Radio group */
.radio-group { display: flex; flex-direction: column; gap: .4rem; margin-top: .25rem; }
.radio-option {
  display: flex; align-items: center; gap: .6rem;
  padding: .5rem .75rem; border: 1px solid var(--color-neutral-200);
  border-radius: 8px; cursor: pointer; font-size: .85rem;
  transition: border-color .15s, background .15s;
}
.radio-option:hover { border-color: var(--color-primary-400); background: var(--color-primary-50,#eff6ff); }
.radio-option input { accent-color: var(--color-primary-500); }

/* Danger button */
.btn-danger {
  background: #dc2626; color: #fff; border: none;
  border-radius: 8px; padding: .45rem 1rem;
  font-size: .83rem; font-weight: 500; cursor: pointer;
  display: inline-flex; align-items: center; gap: .4rem;
  transition: background .15s;
}
.btn-danger:hover { background: #b91c1c; }

/* Drawer overlay */
.drawer-overlay {
  display: none; position: fixed; inset: 0; z-index: 490;
  background: rgba(0,0,0,.3);
}
.drawer-overlay.open { display: block; }

/* Drawer — right-based NOT transform */
.expense-drawer {
  position: fixed; right: -460px; top: 0; bottom: 0;
  width: 440px; max-width: 100vw;
  background: #fff; box-shadow: -4px 0 24px rgba(0,0,0,.14);
  z-index: 495; display: flex; flex-direction: column;
  transition: right .28s cubic-bezier(.4,0,.2,1); overflow: hidden;
}
.expense-drawer.open { right: 0; }

/* Drawer scaffold */
.vd-header { flex-shrink: 0; }
.vd-body   { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; }
.vd-footer {
  flex-shrink: 0; display: flex; gap: .5rem;
  padding: .8rem 1.25rem; border-top: 1px solid var(--color-neutral-100);
}

/* Drawer sub-components */
.drawer-profile { display: flex; align-items: center; gap: .9rem; padding: 1.2rem 1.25rem 1rem; border-bottom: 1px solid var(--color-neutral-100); }
.drawer-avatar { width: 46px; height: 46px; border-radius: 10px; background: var(--color-primary-100,#dbeafe); color: var(--color-primary-600,#2563eb); display: flex; align-items: center; justify-content: center; font-size: 1rem; font-weight: 700; flex-shrink: 0; }
.drawer-exp-id { font-size: .75rem; color: var(--color-neutral-400); margin-top: .15rem; font-family: monospace; }
.drawer-title  { font-weight: 600; font-size: .93rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 220px; }
.drawer-close { margin-left: auto; background: none; border: none; cursor: pointer; width: 30px; height: 30px; border-radius: 7px; display: flex; align-items: center; justify-content: center; color: var(--color-neutral-500); font-size: .85rem; flex-shrink: 0; }
.drawer-close:hover { background: var(--color-neutral-100); }
.drawer-tabs { display: flex; border-bottom: 1px solid var(--color-neutral-100); padding: 0 1.25rem; flex-shrink: 0; }
.dtab { background: none; border: none; cursor: pointer; padding: .65rem .85rem; font-size: .82rem; font-weight: 500; color: var(--color-neutral-500); border-bottom: 2px solid transparent; transition: color .15s, border-color .15s; }
.dtab.active { color: var(--color-primary-600,#2563eb); border-bottom-color: var(--color-primary-500); }
.dtab-pane { display: none; }
.dtab-pane.active { display: block; }
.drawer-section { margin-bottom: 1.2rem; }
.drawer-section-title { font-size: .68rem; font-weight: 700; letter-spacing: .06em; text-transform: uppercase; color: var(--color-neutral-400); margin-bottom: .6rem; }
.drawer-field { display: flex; justify-content: space-between; align-items: flex-start; padding: .35rem 0; border-bottom: 1px solid var(--color-neutral-50); }
.drawer-field:last-child { border-bottom: none; }
.df-label { font-size: .78rem; color: var(--color-neutral-500); flex-shrink: 0; }
.df-val { font-size: .82rem; font-weight: 500; color: var(--color-neutral-700); text-align: right; word-break: break-word; }
.drawer-kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; margin-bottom: 1rem; }
.drawer-kpi-box { background: var(--color-neutral-50); border-radius: 10px; padding: .7rem; text-align: center; }
.drawer-kpi-val { font-size: 1rem; font-weight: 700; color: var(--color-neutral-700); }
.drawer-kpi-label { font-size: .68rem; color: var(--color-neutral-400); margin-top: .15rem; }
"""

css_path = os.path.join(exp_dir, 'expenses.css')
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print(f'CSS written: {css_path}')


# ── 3. HTML ─────────────────────────────────────────────────
html = '''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Expenses \u2014 LankaCommerce Cloud</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"/>
  <link rel="stylesheet" href="../../assets/css/variables.css"/>
  <link rel="stylesheet" href="../../assets/css/base.css"/>
  <link rel="stylesheet" href="../../assets/css/components.css"/>
  <link rel="stylesheet" href="../../assets/css/layout.css"/>
  <link rel="stylesheet" href="../erp.css"/>
  <link rel="stylesheet" href="expenses.css"/>
</head>
<body>

<div class="app-shell">
  <aside class="sidebar" id="sidebar"></aside>

  <div class="main-wrapper" id="mainWrapper">
    <header class="top-bar" id="erpTopBar" data-page-title="Expenses"></header>

    <main class="main-content">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Expenses</h1>
          <p class="page-subtitle">Track and manage business expenses \u00b7 LKR</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" id="btnExport"><i class="fa-solid fa-file-export"></i> Export</button>
          <button class="btn btn-primary btn-sm" id="btnAddExpense"><i class="fa-solid fa-plus"></i> New Expense</button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon blue"><i class="fa-solid fa-receipt"></i></div>
          <div>
            <div class="kpi-label">Total Expenses</div>
            <div class="kpi-value" id="statTotalExpenses">\u2014</div>
            <div class="kpi-sub">All-time spend</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon green"><i class="fa-solid fa-calendar-check"></i></div>
          <div>
            <div class="kpi-label">This Month</div>
            <div class="kpi-value" id="statThisMonth">\u2014</div>
            <div class="kpi-sub">Current month spend</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon orange"><i class="fa-solid fa-hourglass-half"></i></div>
          <div>
            <div class="kpi-label">Pending / Approved</div>
            <div class="kpi-value" id="statPending">\u2014</div>
            <div class="kpi-sub">Awaiting settlement</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon red"><i class="fa-solid fa-circle-check"></i></div>
          <div>
            <div class="kpi-label">Paid Amount</div>
            <div class="kpi-value" id="statPaid">\u2014</div>
            <div class="kpi-sub">Settled expenses</div>
          </div>
        </div>
      </div>

      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="search-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="searchInput" placeholder="Search by ID, vendor or description\u2026"/>
        </div>
        <select id="filterStatus">
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
        </select>
        <select id="filterCategory">
          <option value="">All Categories</option>
          <option value="Rent">Rent</option>
          <option value="Utilities">Utilities</option>
          <option value="Payroll">Payroll</option>
          <option value="Supplies">Supplies</option>
          <option value="Transport">Transport</option>
          <option value="Maintenance">Maintenance</option>
          <option value="Marketing">Marketing</option>
          <option value="Other">Other</option>
        </select>
        <select id="filterPayment">
          <option value="">All Methods</option>
          <option value="cash">Cash</option>
          <option value="bank_transfer">Bank Transfer</option>
          <option value="cheque">Cheque</option>
          <option value="card">Card</option>
        </select>
        <button class="btn btn-ghost btn-sm" onclick="clearFilters()"><i class="fa-solid fa-xmark"></i> Clear</button>
      </div>

      <!-- Table -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Category</th>
              <th>Vendor</th>
              <th>Description</th>
              <th>Amount (LKR)</th>
              <th>Method</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="expBody">
            <tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">Loading\u2026</td></tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination-bar">
        <span id="paginationInfo">Showing 0\u20130 of 0 expenses</span>
        <div class="pagination-btns" id="paginationBtns"></div>
      </div>

    </main>
  </div>
</div>

<!-- ========== EXPORT MODAL ========== -->
<div class="modal-overlay" id="exportModal">
  <div class="modal" style="max-width:420px;">
    <div class="modal-header">
      <h3 class="modal-title"><i class="fa-solid fa-file-export" style="color:var(--color-primary-500);"></i> Export Expenses</h3>
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
          <label class="radio-option"><input type="radio" name="exportScope" value="all"/><span>All expenses</span></label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost btn-sm" onclick="closeExportModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="doExport()"><i class="fa-solid fa-download"></i> Download</button>
    </div>
  </div>
</div>

<!-- ========== ADD / EDIT EXPENSE MODAL ========== -->
<div class="modal-overlay" id="expenseModal">
  <div class="modal" style="max-width:580px;">
    <div class="modal-header">
      <h3 class="modal-title" id="expenseModalTitle">New Expense</h3>
      <button class="modal-close" onclick="closeExpenseModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="expenseForm">
      <div class="modal-body">
        <div class="form-section-title">Expense Details</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Date</label>
            <input type="date" id="fDate" class="form-control" required/>
          </div>
          <div class="form-group">
            <label class="form-label required">Vendor / Payee</label>
            <input type="text" id="fVendorName" class="form-control" placeholder="e.g. Ceylon Electricity Board" required/>
          </div>
        </div>
        <div class="form-grid-2" style="margin-top:.75rem;">
          <div class="form-group">
            <label class="form-label">Category</label>
            <select id="fCategory" class="form-control">
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="Payroll">Payroll</option>
              <option value="Supplies">Supplies</option>
              <option value="Transport">Transport</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Marketing">Marketing</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Reference</label>
            <input type="text" id="fReference" class="form-control" placeholder="e.g. BILL-1234"/>
          </div>
        </div>
        <div class="form-group" style="margin-top:.75rem;">
          <label class="form-label">Description</label>
          <input type="text" id="fDescription" class="form-control" placeholder="e.g. Office Rent — March 2025"/>
        </div>
        <div class="form-section-title" style="margin-top:1rem;">Payment</div>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Amount (LKR)</label>
            <input type="number" id="fAmount" class="form-control" placeholder="e.g. 45000" min="0" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Payment Method</label>
            <select id="fPaymentMethod" class="form-control">
              <option value="cash">Cash</option>
              <option value="bank_transfer">Bank Transfer</option>
              <option value="cheque">Cheque</option>
              <option value="card">Card</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select id="fStatus" class="form-control">
              <option value="pending" selected>Pending</option>
              <option value="approved">Approved</option>
              <option value="paid">Paid</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
        <div class="form-section-title" style="margin-top:1rem;">Notes</div>
        <div class="form-group">
          <textarea id="fNotes" class="form-control" rows="2" placeholder="Additional notes\u2026"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost btn-sm" onclick="closeExpenseModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" id="expenseModalSaveBtn"><i class="fa-solid fa-plus"></i> Add Expense</button>
      </div>
    </form>
  </div>
</div>

<!-- ========== DELETE MODAL ========== -->
<div class="modal-overlay" id="deleteExpenseModal">
  <div class="modal" style="max-width:400px;">
    <div class="modal-header">
      <h3 class="modal-title" style="color:#dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Delete Expense</h3>
      <button class="modal-close" onclick="closeDeleteModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body" style="text-align:center;padding:1.5rem 1.25rem;">
      <div style="width:52px;height:52px;border-radius:50%;background:#fef2f2;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin:0 auto 1rem;"><i class="fa-solid fa-trash"></i></div>
      <p style="font-size:.88rem;color:var(--color-neutral-600);line-height:1.6;">
        Are you sure you want to delete<br/>
        <strong id="deleteExpenseRef">this expense</strong>?<br/>
        <span style="font-size:.75rem;color:var(--color-neutral-400);">This cannot be undone.</span>
      </p>
    </div>
    <div class="modal-footer" style="justify-content:center;gap:.75rem;">
      <button class="btn btn-ghost btn-sm" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn btn-danger btn-sm" onclick="confirmDeleteExpense()"><i class="fa-solid fa-trash"></i> Delete</button>
    </div>
  </div>
</div>

<!-- ========== EXPENSE DETAIL DRAWER ========== -->
<div class="drawer-overlay" id="drawerOverlay" onclick="closeExpenseDrawer()"></div>
<div class="expense-drawer" id="expenseDrawer">
  <div class="vd-header" id="expDrawerHeader"></div>
  <div class="vd-body" id="expDrawerBody"></div>
  <div class="vd-footer" id="expDrawerFooter"></div>
</div>

<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="toast-container" id="toastContainer"></div>

<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="../../assets/js/toast.js"></script>
<script src="expenses.js"></script>
</body>
</html>'''

html_path = os.path.join(exp_dir, 'index.html')
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print(f'HTML written: {html_path}, lines={html.count(chr(10))}')


# ── 4. JS ─────────────────────────────────────────────────
js = r"""/* ══════════════════════════════════════════════════
   Expenses — expenses.js
   ══════════════════════════════════════════════════ */
'use strict';

let allExpenses      = [];
let filteredExpenses = [];
let editingId        = null;
let deletingId       = null;
let currentPage      = 1;
const PAGE_SIZE      = 8;

const fmtLKR = n => '\u20a8 ' + Number(n).toLocaleString('en-LK');

const catIcons = {
  Rent:        'fa-building',
  Utilities:   'fa-bolt',
  Payroll:     'fa-users',
  Supplies:    'fa-boxes-stacked',
  Transport:   'fa-truck',
  Maintenance: 'fa-wrench',
  Marketing:   'fa-bullhorn',
  Other:       'fa-receipt'
};

const catColors = {
  Rent:        '#3b82f6',
  Utilities:   '#f59e0b',
  Payroll:     '#8b5cf6',
  Supplies:    '#14b8a6',
  Transport:   '#f97316',
  Maintenance: '#64748b',
  Marketing:   '#ec4899',
  Other:       '#6b7280'
};

function statusBadge(s) {
  return `<span class="badge ${s}">${s.charAt(0).toUpperCase() + s.slice(1)}</span>`;
}

function methodBadge(m) {
  const map = {
    cash:          'badge-green',
    bank_transfer: 'badge-blue',
    cheque:        'badge-orange',
    card:          'badge-gray'
  };
  const labels = {
    cash:          'Cash',
    bank_transfer: 'Bank Transfer',
    cheque:        'Cheque',
    card:          'Card'
  };
  return `<span class="badge ${map[m] || 'badge-gray'}">${labels[m] || m}</span>`;
}

function catBadge(c) {
  return `<span class="badge badge-gray">${c}</span>`;
}

/* ─── Load ─── */
async function loadExpenses() {
  try {
    const resp = await fetch('../../data/expenses.json?v=' + Date.now());
    const data = await resp.json();
    allExpenses = (data.expenses || []).map(e => ({ ...e }));
    const saved = JSON.parse(localStorage.getItem('lcc_expenses') || '[]');
    saved.forEach(se => {
      const idx = allExpenses.findIndex(e => e.id === se.id);
      if (idx >= 0) allExpenses[idx] = se;
      else allExpenses.push(se);
    });
    applyFilters();
  } catch (err) {
    console.error('Failed to load expenses:', err);
    showToast('Failed to load expense data.', 'error');
  }
}

function saveLocal() {
  localStorage.setItem('lcc_expenses', JSON.stringify(allExpenses));
}

/* ─── Stats ─── */
function updateStats() {
  const totalAmt = allExpenses.reduce((s, e) => s + (e.amount || 0), 0);
  const now = new Date();
  const thisMonthAmt = allExpenses
    .filter(e => {
      if (!e.date) return false;
      const d = new Date(e.date + 'T00:00');
      return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
    })
    .reduce((s, e) => s + (e.amount || 0), 0);
  const pendingCount = allExpenses.filter(e => e.status === 'pending' || e.status === 'approved').length;
  const paidAmt = allExpenses
    .filter(e => e.status === 'paid')
    .reduce((s, e) => s + (e.amount || 0), 0);

  document.getElementById('statTotalExpenses').textContent = fmtLKR(totalAmt);
  document.getElementById('statThisMonth').textContent     = fmtLKR(thisMonthAmt);
  document.getElementById('statPending').textContent       = pendingCount;
  document.getElementById('statPaid').textContent          = fmtLKR(paidAmt);
}

/* ─── Filters ─── */
function applyFilters() {
  const q       = (document.getElementById('searchInput').value || '').toLowerCase().trim();
  const stFilt  = document.getElementById('filterStatus').value;
  const catFilt = document.getElementById('filterCategory').value;
  const payFilt = document.getElementById('filterPayment').value;

  filteredExpenses = allExpenses.filter(e => {
    const mQ   = !q       || [e.id, e.vendor_name, e.description].some(f => (f || '').toLowerCase().includes(q));
    const mS   = !stFilt  || e.status === stFilt;
    const mC   = !catFilt || e.category === catFilt;
    const mP   = !payFilt || e.payment_method === payFilt;
    return mQ && mS && mC && mP;
  });
  currentPage = 1;
  renderTable();
  updateStats();
}

function clearFilters() {
  document.getElementById('searchInput').value   = '';
  document.getElementById('filterStatus').value  = '';
  document.getElementById('filterCategory').value = '';
  document.getElementById('filterPayment').value  = '';
  applyFilters();
}

/* ─── Table ─── */
function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredExpenses.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('expBody');

  if (!page.length) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-receipt" style="font-size:2rem;display:block;margin-bottom:.5rem;opacity:.3;"></i>
      No expenses found.</td></tr>`;
  } else {
    tbody.innerHTML = page.map(e => {
      const dateStr = e.date
        ? new Date(e.date + 'T00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
        : '\u2014';
      return `
        <tr>
          <td>
            <div style="font-weight:500;font-size:.84rem;">${dateStr}</div>
            <div style="font-size:.72rem;color:var(--color-neutral-400);font-family:monospace;">${e.id}</div>
          </td>
          <td>${catBadge(e.category)}</td>
          <td>
            <div style="font-weight:500;font-size:.84rem;">${e.vendor_name || '\u2014'}</div>
            <div style="font-size:.72rem;color:var(--color-neutral-400);">${e.reference || ''}</div>
          </td>
          <td style="max-width:200px;">
            <div style="font-size:.82rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:200px;" title="${(e.description || '').replace(/"/g, '&quot;')}">${e.description || '\u2014'}</div>
          </td>
          <td style="font-weight:600;white-space:nowrap;">${fmtLKR(e.amount || 0)}</td>
          <td>${methodBadge(e.payment_method)}</td>
          <td>${statusBadge(e.status)}</td>
          <td>
            <div class="actions">
              <button class="btn-icon" title="View" onclick="openExpenseDrawer('${e.id}')"><i class="fa-solid fa-eye"></i></button>
              <button class="btn-icon" title="Edit" onclick="openEditModal('${e.id}')"><i class="fa-solid fa-pen"></i></button>
              <button class="btn-icon btn-icon-danger" title="Delete" onclick="openDeleteModal('${e.id}')"><i class="fa-solid fa-trash"></i></button>
            </div>
          </td>
        </tr>`;
    }).join('');
  }
  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const total = filteredExpenses.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  document.getElementById('paginationInfo').textContent =
    `Showing ${total ? start : 0}\u2013${end} of ${total} expenses`;

  const btns = document.getElementById('paginationBtns');
  let html = `<button class="btn-icon" ${currentPage <= 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let p = 1; p <= pages; p++) {
    if (pages > 7 && p !== 1 && p !== pages && Math.abs(p - currentPage) > 2) {
      if (p === 2 || p === pages - 1) html += `<button class="btn-icon" disabled>\u2026</button>`;
      continue;
    }
    html += `<button class="${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button class="btn-icon" ${currentPage >= pages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  btns.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(filteredExpenses.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
}

/* ── EXPORT ── */
function openExportModal()  { document.getElementById('exportModal').classList.add('open'); }
function closeExportModal() { document.getElementById('exportModal').classList.remove('open'); }

function doExport() {
  const fmt   = document.querySelector('input[name="exportFmt"]:checked').value;
  const scope = document.querySelector('input[name="exportScope"]:checked').value;
  const list  = scope === 'all' ? allExpenses : filteredExpenses;
  if (fmt === 'csv') {
    const keys = ['id', 'date', 'category', 'vendor_name', 'reference', 'description', 'amount', 'payment_method', 'status'];
    const rows = [keys.join(',')];
    list.forEach(e => rows.push(keys.map(k => `"${(e[k] ?? '').toString().replace(/"/g, '""')}"`).join(',')));
    downloadFile('expenses.csv', rows.join('\n'), 'text/csv');
  } else {
    downloadFile('expenses.json', JSON.stringify(list, null, 2), 'application/json');
  }
  closeExportModal();
  showToast(`Exported ${list.length} expenses as ${fmt.toUpperCase()}.`, 'success');
}

function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ── ADD / EDIT ── */
function openAddModal() {
  editingId = null;
  document.getElementById('expenseModalTitle').textContent = 'New Expense';
  document.getElementById('expenseModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Add Expense';
  document.getElementById('expenseForm').reset();
  document.getElementById('fDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('expenseModal').classList.add('open');
}

function openEditModal(id) {
  const e = allExpenses.find(e => e.id === id);
  if (!e) return;
  editingId = id;
  document.getElementById('expenseModalTitle').textContent = `Edit \u2014 ${id}`;
  document.getElementById('expenseModalSaveBtn').innerHTML = '<i class="fa-solid fa-check"></i> Save Changes';
  const f = fid => document.getElementById(fid);
  f('fDate').value          = e.date || '';
  f('fVendorName').value    = e.vendor_name || '';
  f('fCategory').value      = e.category || 'Other';
  f('fReference').value     = e.reference || '';
  f('fDescription').value   = e.description || '';
  f('fAmount').value        = e.amount || 0;
  f('fPaymentMethod').value = e.payment_method || 'cash';
  f('fStatus').value        = e.status || 'pending';
  f('fNotes').value         = e.notes || '';
  document.getElementById('expenseModal').classList.add('open');
}

function closeExpenseModal() {
  document.getElementById('expenseModal').classList.remove('open');
}

function saveExpense(ev) {
  ev.preventDefault();
  const f = fid => document.getElementById(fid);
  const vendor = f('fVendorName').value.trim();
  const amount = parseFloat(f('fAmount').value);
  const date   = f('fDate').value;

  if (!vendor) { showToast('Vendor / Payee name is required.', 'warning'); return; }
  if (!amount || amount <= 0) { showToast('A valid amount is required.', 'warning'); return; }
  if (!date)   { showToast('Date is required.', 'warning'); return; }

  const form = {
    date:           date,
    vendor_name:    vendor,
    category:       f('fCategory').value,
    reference:      f('fReference').value.trim(),
    description:    f('fDescription').value.trim(),
    amount:         amount,
    payment_method: f('fPaymentMethod').value,
    status:         f('fStatus').value,
    notes:          f('fNotes').value.trim(),
  };

  if (editingId) {
    const idx = allExpenses.findIndex(e => e.id === editingId);
    if (idx >= 0) allExpenses[idx] = { ...allExpenses[idx], ...form };
    showToast('Expense updated.', 'success');
  } else {
    const nums = allExpenses.map(e => parseInt((e.id || '').split('-')[1]) || 0);
    const next = (Math.max(0, ...nums) + 1).toString().padStart(4, '0');
    allExpenses.unshift({ id: `EXP-${next}`, created_by: 'Admin', ...form });
    showToast('Expense added.', 'success');
  }
  saveLocal();
  closeExpenseModal();
  applyFilters();
}

/* ── VIEW DRAWER ── */
function openExpenseDrawer(id) {
  const e = allExpenses.find(e => e.id === id);
  if (!e) return;

  const icon  = catIcons[e.category] || 'fa-receipt';
  const color = catColors[e.category] || '#6b7280';
  const dateStr = e.date
    ? new Date(e.date + 'T00:00').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
    : '\u2014';
  const shortDesc = (e.description || e.id).length > 32
    ? (e.description || e.id).slice(0, 32) + '\u2026'
    : (e.description || e.id);

  document.getElementById('expDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar" style="background:${color}22; color:${color};">
        <i class="fa-solid ${icon}"></i>
      </div>
      <div style="min-width:0;flex:1;">
        <div class="drawer-title">${shortDesc}</div>
        <div class="drawer-exp-id">${e.id}</div>
        ${statusBadge(e.status)}
      </div>
      <button class="drawer-close" onclick="closeExpenseDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchExpTab(this,'dtab-details')">Details</button>
      <button class="dtab" onclick="switchExpTab(this,'dtab-amount')">Amount</button>
      <button class="dtab" onclick="switchExpTab(this,'dtab-notes')">Notes</button>
    </div>
  `;

  document.getElementById('expDrawerBody').innerHTML = `
    <div id="dtab-details" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-tag"></i> Expense Info</div>
        <div class="drawer-field"><span class="df-label">Expense ID</span><span class="df-val" style="font-family:monospace;">${e.id}</span></div>
        <div class="drawer-field"><span class="df-label">Date</span><span class="df-val">${dateStr}</span></div>
        <div class="drawer-field"><span class="df-label">Category</span><span class="df-val">${catBadge(e.category)}</span></div>
        <div class="drawer-field"><span class="df-label">Reference</span><span class="df-val" style="font-family:monospace;">${e.reference || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">Description</span><span class="df-val">${e.description || '\u2014'}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-building"></i> Vendor</div>
        <div class="drawer-field"><span class="df-label">Vendor / Payee</span><span class="df-val">${e.vendor_name || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">Created By</span><span class="df-val">${e.created_by || '\u2014'}</span></div>
      </div>
    </div>

    <div id="dtab-amount" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-money-bill-wave"></i> Financial Details</div>
        <div class="drawer-kpi-row">
          <div class="drawer-kpi-box">
            <div class="drawer-kpi-val">${fmtLKR(e.amount || 0)}</div>
            <div class="drawer-kpi-label">Amount</div>
          </div>
          <div class="drawer-kpi-box">
            <div class="drawer-kpi-val">${statusBadge(e.status)}</div>
            <div class="drawer-kpi-label">Status</div>
          </div>
        </div>
        <div class="drawer-field"><span class="df-label">Payment Method</span><span class="df-val">${methodBadge(e.payment_method)}</span></div>
        <div class="drawer-field"><span class="df-label">Reference</span><span class="df-val" style="font-family:monospace;">${e.reference || '\u2014'}</span></div>
      </div>
    </div>

    <div id="dtab-notes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-note-sticky"></i> Notes</div>
        <p style="font-size:.85rem;color:var(--color-neutral-600);line-height:1.6;">${e.notes || 'No notes for this expense.'}</p>
      </div>
    </div>
  `;

  document.getElementById('expDrawerFooter').innerHTML = `
    <button class="btn btn-outline btn-sm" onclick="closeExpenseDrawer()"><i class="fa-solid fa-xmark"></i> Close</button>
    <button class="btn btn-primary btn-sm" onclick="openEditModal('${e.id}'); closeExpenseDrawer();"><i class="fa-solid fa-pen"></i> Edit</button>
    <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;" onclick="closeExpenseDrawer(); openDeleteModal('${e.id}');"><i class="fa-solid fa-trash"></i></button>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('expenseDrawer').classList.add('open');
}

function closeExpenseDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('expenseDrawer').classList.remove('open');
}

function switchExpTab(btn, tabId) {
  document.querySelectorAll('#expDrawerHeader .dtab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#expDrawerBody .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById(tabId).classList.add('active');
}

/* ── DELETE ── */
function openDeleteModal(id) {
  const e = allExpenses.find(e => e.id === id);
  if (!e) return;
  deletingId = id;
  document.getElementById('deleteExpenseRef').textContent = `${e.vendor_name || id} \u2014 ${id}`;
  document.getElementById('deleteExpenseModal').classList.add('open');
}

function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deleteExpenseModal').classList.remove('open');
}

function confirmDeleteExpense() {
  if (!deletingId) return;
  allExpenses = allExpenses.filter(e => e.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Expense deleted.', 'success');
  deletingId = null;
}

/* ── Toast fallback ── */
function showToast(msg, type = 'success') {
  if (window.LCC && window.LCC.showToast) { window.LCC.showToast(msg, type); return; }
  const el = document.createElement('div');
  const bg = type === 'success' ? '#16a34a' : type === 'warning' ? '#d97706' : type === 'info' ? '#2563eb' : '#dc2626';
  el.style.cssText = `position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;background:${bg};color:#fff;padding:.75rem 1.25rem;border-radius:8px;font-size:.875rem;box-shadow:0 4px 16px rgba(0,0,0,.2);`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ── Event Listeners ── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddExpense').addEventListener('click', openAddModal);
document.getElementById('searchInput').addEventListener('input', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterCategory').addEventListener('change', applyFilters);
document.getElementById('filterPayment').addEventListener('change', applyFilters);
document.getElementById('expenseForm').addEventListener('submit', saveExpense);
document.getElementById('expenseModal').addEventListener('click', e => { if (e.target === document.getElementById('expenseModal')) closeExpenseModal(); });
document.getElementById('exportModal').addEventListener('click', e => { if (e.target === document.getElementById('exportModal')) closeExportModal(); });
document.getElementById('deleteExpenseModal').addEventListener('click', e => { if (e.target === document.getElementById('deleteExpenseModal')) closeDeleteModal(); });

/* ── Init ── */
loadExpenses();
"""

js_path = os.path.join(exp_dir, 'expenses.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print(f'JS written: {js_path}, lines={js.count(chr(10))}')

print('\nAll 4 files created successfully.')
