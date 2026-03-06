import os

BASE = os.path.join(os.path.dirname(__file__), 'UI-Prototype')
OUT  = os.path.join(BASE, 'erp', 'payroll', 'index.html')
os.makedirs(os.path.dirname(OUT), exist_ok=True)

HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Payroll — LankaCommerce Cloud</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"/>
  <link rel="stylesheet" href="../../assets/css/variables.css"/>
  <link rel="stylesheet" href="../../assets/css/base.css"/>
  <link rel="stylesheet" href="../../assets/css/components.css"/>
  <link rel="stylesheet" href="../../assets/css/layout.css"/>
  <link rel="stylesheet" href="../erp.css"/>
  <link rel="stylesheet" href="payroll.css"/>
</head>
<body>

<div class="app-shell">
  <aside class="sidebar" id="sidebar"></aside>

  <div class="main-wrapper" id="mainWrapper">
    <header class="top-bar" id="erpTopBar" data-page-title="Payroll"></header>

    <main class="main-content">

      <!-- PAGE HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Payroll</h1>
          <p class="page-subtitle">Manage employee payslips and salary runs &middot; LKR</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" id="btnExport"><i class="fa-solid fa-file-export"></i> Export</button>
          <button class="btn btn-primary btn-sm" id="btnRunPayroll"><i class="fa-solid fa-plus"></i> Add Payslip</button>
        </div>
      </div>

      <!-- KPI CARDS -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon blue"><i class="fa-solid fa-money-bill-wave"></i></div>
          <div>
            <div class="kpi-label">Total Net Payroll</div>
            <div class="kpi-value" id="statTotalPayroll">&#8212;</div>
            <div class="kpi-sub">All payslips</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div>
            <div class="kpi-label">Paid</div>
            <div class="kpi-value" id="statPaid">&#8212;</div>
            <div class="kpi-sub">Processed payslips</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon yellow"><i class="fa-solid fa-hourglass-half"></i></div>
          <div>
            <div class="kpi-label">Pending / Draft</div>
            <div class="kpi-value" id="statPending">&#8212;</div>
            <div class="kpi-sub">Awaiting processing</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon purple"><i class="fa-solid fa-calendar-check"></i></div>
          <div>
            <div class="kpi-label">This Month Net</div>
            <div class="kpi-value" id="statNetThisMonth">&#8212;</div>
            <div class="kpi-sub">Current period</div>
          </div>
        </div>
      </div>

      <!-- FILTER BAR -->
      <div class="filter-bar">
        <div class="search-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="paySearch" placeholder="Search by employee name or ID&hellip;"/>
        </div>
        <select id="filterStatus" class="form-control">
          <option value="">All Statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="draft">Draft</option>
        </select>
        <select id="filterPeriod" class="form-control">
          <option value="">All Periods</option>
          <option value="Jan 2025">Jan 2025</option>
          <option value="Feb 2025">Feb 2025</option>
          <option value="Mar 2025">Mar 2025</option>
          <option value="Apr 2025">Apr 2025</option>
          <option value="May 2025">May 2025</option>
        </select>
        <select id="filterDept" class="form-control">
          <option value="">All Departments</option>
          <option value="Sales">Sales</option>
          <option value="Warehouse">Warehouse</option>
          <option value="IT">IT</option>
          <option value="Accounting">Accounting</option>
          <option value="Administration">Administration</option>
          <option value="Delivery">Delivery</option>
          <option value="HR">HR</option>
        </select>
        <button class="btn btn-ghost btn-sm" onclick="clearFilters()"><i class="fa-solid fa-xmark"></i> Clear</button>
      </div>

      <!-- TABLE -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Department</th>
              <th>Period</th>
              <th>Basic</th>
              <th>Gross</th>
              <th>EPF (8%)</th>
              <th>Net Pay</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="payBody">
            <tr><td colspan="9" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">Loading&hellip;</td></tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="pagination-bar">
        <span id="paginationInfo">Showing 0&ndash;0 of 0 records</span>
        <div class="pagination-btns" id="paginationBtns"></div>
      </div>

    </main>
  </div>
</div>

<!-- EXPORT MODAL -->
<div class="modal-overlay" id="exportModal">
  <div class="modal" style="max-width:420px;">
    <div class="modal-header">
      <h3 class="modal-title"><i class="fa-solid fa-file-export" style="color:var(--color-primary-500);"></i> Export Payroll</h3>
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
          <label class="radio-option"><input type="radio" name="exportScope" value="all"/><span>All records</span></label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost btn-sm" onclick="closeExportModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="doExport()"><i class="fa-solid fa-download"></i> Download</button>
    </div>
  </div>
</div>

<!-- ADD/EDIT MODAL -->
<div class="modal-overlay" id="payModal">
  <div class="modal" style="max-width:580px;">
    <div class="modal-header">
      <h3 class="modal-title" id="payModalTitle">New Record</h3>
      <button class="modal-close" onclick="closePayModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="payForm">
      <div class="modal-body">

        <div class="form-section-title">Employee</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Employee Name</label>
            <input type="text" id="fEmpName" class="form-control" placeholder="Full name" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Employee ID</label>
            <input type="text" id="fEmpId" class="form-control" placeholder="EMP-001"/>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Department</label>
            <select id="fDepartment" class="form-control">
              <option value="">Select department</option>
              <option value="Sales">Sales</option>
              <option value="Warehouse">Warehouse</option>
              <option value="IT">IT</option>
              <option value="Accounting">Accounting</option>
              <option value="Administration">Administration</option>
              <option value="Delivery">Delivery</option>
              <option value="HR">HR</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Period</label>
            <select id="fPeriod" class="form-control">
              <option value="">Select period</option>
              <option value="Jan 2025">Jan 2025</option>
              <option value="Feb 2025">Feb 2025</option>
              <option value="Mar 2025">Mar 2025</option>
              <option value="Apr 2025">Apr 2025</option>
              <option value="May 2025">May 2025</option>
            </select>
          </div>
        </div>

        <div class="form-section-title">Salary</div>
        <div class="form-grid-3">
          <div class="form-group">
            <label class="form-label required">Basic Salary (LKR)</label>
            <input type="number" id="fBasicSalary" class="form-control" min="0" step="0.01" placeholder="0.00" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Allowances (LKR)</label>
            <input type="number" id="fAllowances" class="form-control" min="0" step="0.01" placeholder="0.00"/>
          </div>
          <div class="form-group">
            <label class="form-label">Other Deductions (LKR)</label>
            <input type="number" id="fOtherDeductions" class="form-control" min="0" step="0.01" placeholder="0.00"/>
          </div>
        </div>

        <div id="payComputed" class="computed-summary" style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:.75rem 1rem;margin-top:.75rem;display:none;">
          <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.3rem;"><span style="color:#6b7280;">Gross Pay</span><span id="pcGross" style="font-weight:600;">&#8360; 0</span></div>
          <div style="display:flex;justify-content:space-between;font-size:.8rem;margin-bottom:.3rem;"><span style="color:#6b7280;">EPF (Employee 8%)</span><span id="pcEpf" style="color:#ef4444;">- &#8360; 0</span></div>
          <div style="display:flex;justify-content:space-between;font-size:.8rem;padding-top:.4rem;border-top:1px solid #e2e8f0;"><span style="font-weight:600;color:#111827;">Net Pay</span><span id="pcNet" style="font-weight:700;color:#16a34a;">&#8360; 0</span></div>
        </div>

        <div class="form-grid-2" style="margin-top:.75rem;">
          <div class="form-group">
            <label class="form-label">Payment Date</label>
            <input type="date" id="fPaymentDate" class="form-control"/>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select id="fStatus" class="form-control">
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea id="fNotes" class="form-control" rows="2" placeholder="Optional notes&hellip;"></textarea>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost btn-sm" onclick="closePayModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" id="payModalSaveBtn"><i class="fa-solid fa-plus"></i> Add Record</button>
      </div>
    </form>
  </div>
</div>

<!-- DELETE MODAL -->
<div class="modal-overlay" id="deletePayModal">
  <div class="modal" style="max-width:400px;">
    <div class="modal-header">
      <h3 class="modal-title" style="color:#dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Delete Record</h3>
      <button class="modal-close" onclick="closeDeleteModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body" style="text-align:center;padding:1.5rem 1.25rem;">
      <div style="width:52px;height:52px;border-radius:50%;background:#fef2f2;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin:0 auto 1rem;"><i class="fa-solid fa-trash"></i></div>
      <p style="font-size:.88rem;color:var(--color-neutral-600);line-height:1.6;">
        Are you sure you want to delete<br/>
        <strong id="deletePayRef">this record</strong>?<br/>
        <span style="font-size:.75rem;color:var(--color-neutral-400);">This cannot be undone.</span>
      </p>
    </div>
    <div class="modal-footer" style="justify-content:center;gap:.75rem;">
      <button class="btn btn-ghost btn-sm" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn btn-danger btn-sm" onclick="confirmDeletePayslip()"><i class="fa-solid fa-trash"></i> Delete</button>
    </div>
  </div>
</div>

<!-- DRAWER -->
<div class="drawer-overlay" id="drawerOverlay" onclick="closePayDrawer()"></div>
<div class="pay-drawer" id="payDrawer">
  <div class="vd-header" id="payDrawerHeader"></div>
  <div class="vd-body" id="payDrawerBody"></div>
  <div class="vd-footer" id="payDrawerFooter"></div>
</div>

<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="toast-container" id="toastContainer"></div>

<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="../../assets/js/toast.js"></script>
<script src="payroll.js"></script>
</body>
</html>
"""

open(OUT, 'w', encoding='utf-8').write(HTML)
print(f"Written: {OUT}")
print("Done.")
