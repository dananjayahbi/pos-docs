import os

BASE = os.path.join(os.path.dirname(__file__), 'UI-Prototype')
OUT  = os.path.join(BASE, 'erp', 'attendance', 'index.html')
os.makedirs(os.path.dirname(OUT), exist_ok=True)

HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Attendance — LankaCommerce Cloud</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"/>
  <link rel="stylesheet" href="../../assets/css/variables.css"/>
  <link rel="stylesheet" href="../../assets/css/base.css"/>
  <link rel="stylesheet" href="../../assets/css/components.css"/>
  <link rel="stylesheet" href="../../assets/css/layout.css"/>
  <link rel="stylesheet" href="../erp.css"/>
  <link rel="stylesheet" href="attendance.css"/>
</head>
<body>

<div class="app-shell">
  <aside class="sidebar" id="sidebar"></aside>

  <div class="main-wrapper" id="mainWrapper">
    <header class="top-bar" id="erpTopBar" data-page-title="Attendance"></header>

    <main class="main-content">

      <!-- PAGE HEADER -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Attendance</h1>
          <p class="page-subtitle">Track employee attendance records &middot; 2025</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" id="btnExport"><i class="fa-solid fa-file-export"></i> Export</button>
          <button class="btn btn-primary btn-sm" id="btnAddAtt"><i class="fa-solid fa-plus"></i> New Record</button>
        </div>
      </div>

      <!-- KPI CARDS -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-icon blue"><i class="fa-solid fa-clipboard-list"></i></div>
          <div>
            <div class="kpi-label">Total Records</div>
            <div class="kpi-value" id="statTotalRecords">&#8212;</div>
            <div class="kpi-sub">All time records</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon green"><i class="fa-solid fa-circle-check"></i></div>
          <div>
            <div class="kpi-label">Present</div>
            <div class="kpi-value" id="statPresent">&#8212;</div>
            <div class="kpi-sub">Marked present</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon red"><i class="fa-solid fa-circle-xmark"></i></div>
          <div>
            <div class="kpi-label">Absent</div>
            <div class="kpi-value" id="statAbsent">&#8212;</div>
            <div class="kpi-sub">Marked absent</div>
          </div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon yellow"><i class="fa-solid fa-clock"></i></div>
          <div>
            <div class="kpi-label">Late</div>
            <div class="kpi-value" id="statLate">&#8212;</div>
            <div class="kpi-sub">Late arrivals</div>
          </div>
        </div>
      </div>

      <!-- FILTER BAR -->
      <div class="filter-bar">
        <div class="search-wrap">
          <i class="fa-solid fa-magnifying-glass"></i>
          <input type="text" id="attSearch" placeholder="Search by employee name or ID&hellip;"/>
        </div>
        <select id="filterStatus" class="form-control">
          <option value="">All Statuses</option>
          <option value="present">Present</option>
          <option value="absent">Absent</option>
          <option value="late">Late</option>
          <option value="half_day">Half Day</option>
        </select>
        <input type="date" id="filterDate" class="form-control"/>
        <button class="btn btn-ghost btn-sm" onclick="clearFilters()"><i class="fa-solid fa-xmark"></i> Clear</button>
      </div>

      <!-- TABLE -->
      <div class="table-card">
        <table class="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Date</th>
              <th>Clock In</th>
              <th>Clock Out</th>
              <th>Hours</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody id="attBody">
            <tr><td colspan="7" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">Loading&hellip;</td></tr>
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
      <h3 class="modal-title"><i class="fa-solid fa-file-export" style="color:var(--color-primary-500);"></i> Export Attendance</h3>
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
<div class="modal-overlay" id="attModal">
  <div class="modal" style="max-width:580px;">
    <div class="modal-header">
      <h3 class="modal-title" id="attModalTitle">New Record</h3>
      <button class="modal-close" onclick="closeAttModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="attForm">
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

        <div class="form-section-title">Attendance</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Date</label>
            <input type="date" id="fDate" class="form-control" required/>
          </div>
          <div class="form-group">
            <label class="form-label required">Status</label>
            <select id="fStatus" class="form-control" required>
              <option value="">Select status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label">Clock In</label>
            <input type="time" id="fClockIn" class="form-control"/>
          </div>
          <div class="form-group">
            <label class="form-label">Clock Out</label>
            <input type="time" id="fClockOut" class="form-control"/>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Notes</label>
          <textarea id="fNotes" class="form-control" rows="2" placeholder="Optional notes&hellip;"></textarea>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost btn-sm" onclick="closeAttModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" id="attModalSaveBtn"><i class="fa-solid fa-plus"></i> Add Record</button>
      </div>
    </form>
  </div>
</div>

<!-- DELETE MODAL -->
<div class="modal-overlay" id="deleteAttModal">
  <div class="modal" style="max-width:400px;">
    <div class="modal-header">
      <h3 class="modal-title" style="color:#dc2626;"><i class="fa-solid fa-triangle-exclamation"></i> Delete Record</h3>
      <button class="modal-close" onclick="closeDeleteModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body" style="text-align:center;padding:1.5rem 1.25rem;">
      <div style="width:52px;height:52px;border-radius:50%;background:#fef2f2;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin:0 auto 1rem;"><i class="fa-solid fa-trash"></i></div>
      <p style="font-size:.88rem;color:var(--color-neutral-600);line-height:1.6;">
        Are you sure you want to delete<br/>
        <strong id="deleteAttRef">this record</strong>?<br/>
        <span style="font-size:.75rem;color:var(--color-neutral-400);">This cannot be undone.</span>
      </p>
    </div>
    <div class="modal-footer" style="justify-content:center;gap:.75rem;">
      <button class="btn btn-ghost btn-sm" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn btn-danger btn-sm" onclick="confirmDeleteAtt()"><i class="fa-solid fa-trash"></i> Delete</button>
    </div>
  </div>
</div>

<!-- DRAWER -->
<div class="drawer-overlay" id="drawerOverlay" onclick="closeAttDrawer()"></div>
<div class="att-drawer" id="attDrawer">
  <div class="vd-header" id="attDrawerHeader"></div>
  <div class="vd-body" id="attDrawerBody"></div>
  <div class="vd-footer" id="attDrawerFooter"></div>
</div>

<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="toast-container" id="toastContainer"></div>

<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="../../assets/js/toast.js"></script>
<script src="attendance.js"></script>
</body>
</html>
"""

open(OUT, 'w', encoding='utf-8').write(HTML)
print(f"Written: {OUT}")
print("Done.")
