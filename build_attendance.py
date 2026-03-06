"""
build_attendance.py
Generates Attendance module files for LankaCommerce Cloud ERP UI Prototype.
"""
import os, json, random

BASE = os.path.join(os.path.dirname(__file__), 'UI-Prototype')

def makedirs(*parts):
    path = os.path.join(BASE, *parts)
    os.makedirs(path, exist_ok=True)
    return path

# ---------------------------------------------------------------------------
# 1. data/attendance.json
# ---------------------------------------------------------------------------
def build_json():
    random.seed(42)

    employees = [
        ("EMP-001", "Kamal Perera"),
        ("EMP-002", "Nimal Silva"),
        ("EMP-003", "Saman Kumara"),
        ("EMP-004", "Priya Fernando"),
        ("EMP-005", "Dilshan Jayawardena"),
        ("EMP-006", "Chamari Wickramasinghe"),
        ("EMP-007", "Ruwan Bandara"),
        ("EMP-008", "Nilufar Rasheed"),
        ("EMP-009", "Tharaka Dissanayake"),
        ("EMP-010", "Madhavi Senanayake"),
        ("EMP-011", "Asanka Rathnayake"),
        ("EMP-012", "Ishara Gunawardena"),
        ("EMP-013", "Buddhika Jayasooriya"),
        ("EMP-014", "Sachini Marasinghe"),
        ("EMP-015", "Lahiru Mendis"),
        ("EMP-016", "Kasun Weerasinghe"),
        ("EMP-017", "Nadeesha Alwis"),
        ("EMP-018", "Roshan Liyanage"),
        ("EMP-019", "Sumudu Pathirana"),
        ("EMP-020", "Harsha Rajapaksha"),
        ("EMP-021", "Dinusha Gunasekara"),
        ("EMP-022", "Chathura Wijesekara"),
        ("EMP-023", "Imasha Karunarathna"),
        ("EMP-024", "Vimukthi De Silva"),
        ("EMP-025", "Anjali Thilakaratne"),
    ]

    months = {1: 31, 2: 28, 3: 31, 4: 30, 5: 31}
    statuses = ["present", "present", "present", "present", "absent", "late", "half_day"]
    notes_pool = [
        "", "", "", "",
        "Left early due to medical appointment",
        "Late due to traffic",
        "Work from home approved",
        "Overtime logged",
        "Half day — personal reason",
        "Doctor visit",
    ]

    records = []
    for i in range(1, 41):
        emp = random.choice(employees)
        month = random.choice(list(months.keys()))
        day = random.randint(1, months[month])
        date_str = f"2025-{month:02d}-{day:02d}"
        status = random.choice(statuses)

        if status == "absent":
            clock_in = None
            clock_out = None
            work_hours = 0.0
        elif status == "half_day":
            ci_h = random.choice([8, 9])
            ci_m = random.choice([0, 15, 30, 45])
            clock_in = f"{ci_h:02d}:{ci_m:02d}"
            co_h = ci_h + random.randint(4, 5)
            clock_out = f"{co_h:02d}:{ci_m:02d}"
            work_hours = round(co_h - ci_h + (0 if ci_m == 0 else ci_m / 60), 2)
        elif status == "late":
            ci_h = random.choice([9, 10])
            ci_m = random.choice([15, 30, 45])
            clock_in = f"{ci_h:02d}:{ci_m:02d}"
            clock_out = f"{random.choice([17, 18]):02d}:{random.choice([0, 30]):02d}"
            co_h, co_m = int(clock_out[:2]), int(clock_out[3:])
            work_hours = round((co_h + co_m / 60) - (ci_h + ci_m / 60), 2)
        else:
            ci_h = random.choice([8, 8, 8, 9])
            ci_m = random.choice([0, 0, 15, 30])
            clock_in = f"{ci_h:02d}:{ci_m:02d}"
            co_h = random.choice([17, 17, 18])
            co_m = random.choice([0, 0, 30])
            clock_out = f"{co_h:02d}:{co_m:02d}"
            work_hours = round((co_h + co_m / 60) - (ci_h + ci_m / 60), 2)

        records.append({
            "id": f"ATT-{i:04d}",
            "employee_id": emp[0],
            "employee_name": emp[1],
            "date": date_str,
            "clock_in": clock_in,
            "clock_out": clock_out,
            "work_hours": work_hours,
            "status": status,
            "notes": random.choice(notes_pool),
        })

    data_dir = makedirs("data")
    out_path = os.path.join(data_dir, "attendance.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"attendance": records}, f, indent=2)
    print(f"  Created: {out_path}")

# ---------------------------------------------------------------------------
# 2. erp/attendance/attendance.css
# ---------------------------------------------------------------------------
CSS = """\
/* ============================================================
   Attendance Module — LankaCommerce Cloud
   ============================================================ */

/* ── KPI Grid ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
@media (max-width: 900px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 520px) { .kpi-grid { grid-template-columns: 1fr; } }

.kpi-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
}
.kpi-icon {
  width: 48px; height: 48px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.35rem;
  flex-shrink: 0;
}
.kpi-icon.blue   { background: #eff6ff; color: #3b82f6; }
.kpi-icon.green  { background: #f0fdf4; color: #22c55e; }
.kpi-icon.red    { background: #fef2f2; color: #ef4444; }
.kpi-icon.yellow { background: #fefce8; color: #eab308; }
.kpi-info { min-width: 0; }
.kpi-info .kpi-val {
  font-size: 1.6rem; font-weight: 700;
  color: #111827; line-height: 1;
}
.kpi-info .kpi-label {
  font-size: 0.8rem; color: #6b7280;
  margin-top: 0.25rem;
}

/* ── Filter Bar ── */
.filter-bar {
  display: flex; flex-wrap: wrap; gap: .75rem;
  align-items: center;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  margin-bottom: 1rem;
}
.search-wrap {
  position: relative; flex: 1 1 200px;
}
.search-wrap .search-icon {
  position: absolute; left: .75rem; top: 50%;
  transform: translateY(-50%);
  color: #9ca3af; pointer-events: none;
}
.search-wrap input {
  width: 100%;
  padding: .5rem .75rem .5rem 2.25rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: .875rem;
  outline: none;
  transition: border-color .15s;
}
.search-wrap input:focus { border-color: #3b82f6; }

.filter-bar select,
.filter-bar input[type="date"] {
  padding: .5rem .75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: .875rem;
  outline: none;
  background: #fff;
  cursor: pointer;
  transition: border-color .15s;
}
.filter-bar select:focus,
.filter-bar input[type="date"]:focus { border-color: #3b82f6; }

.btn-clear-filter {
  padding: .5rem 1rem;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  font-size: .875rem;
  color: #374151;
  cursor: pointer;
  transition: background .15s;
}
.btn-clear-filter:hover { background: #f3f4f6; }

/* ── Table Card ── */
.table-card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0,0,0,.06);
  margin-bottom: 1rem;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: .875rem;
}
.data-table thead th {
  padding: .75rem 1rem;
  text-align: left;
  font-weight: 600;
  color: #374151;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}
.data-table tbody td {
  padding: .75rem 1rem;
  border-bottom: 1px solid #f3f4f6;
  color: #374151;
}
.data-table tbody tr:last-child td { border-bottom: none; }
.data-table tbody tr:hover { background: #fafafa; }

/* ── Badges ── */
.badge {
  display: inline-flex; align-items: center;
  padding: .25rem .7rem;
  border-radius: 999px;
  font-size: .75rem; font-weight: 600;
  text-transform: capitalize;
  white-space: nowrap;
}
.badge-present  { background: #dcfce7; color: #15803d; }
.badge-absent   { background: #fee2e2; color: #b91c1c; }
.badge-late     { background: #fef9c3; color: #a16207; }
.badge-half_day { background: #ffedd5; color: #c2410c; }

/* ── Actions ── */
.actions { display: flex; gap: .35rem; }
.btn-icon {
  width: 32px; height: 32px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  display: inline-flex; align-items: center; justify-content: center;
  cursor: pointer;
  font-size: .9rem;
  color: #6b7280;
  transition: background .15s, color .15s;
  padding: 0;
}
.btn-icon:hover { background: #f3f4f6; color: #111827; }
.btn-icon.danger:hover { background: #fef2f2; color: #ef4444; border-color: #fecaca; }

/* ── Pagination ── */
.pagination-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: .75rem 1.25rem;
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  font-size: .875rem;
  color: #6b7280;
}
.pagination-btns { display: flex; gap: .35rem; }
.pagination-btns button {
  width: 34px; height: 34px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
  font-size: .875rem;
  color: #374151;
  transition: background .15s;
}
.pagination-btns button:hover,
.pagination-btns button.active { background: #3b82f6; color: #fff; border-color: #3b82f6; }
.pagination-btns button:disabled { opacity: .4; pointer-events: none; }

/* ── Modal Overlay (CRITICAL) ── */
.modal-overlay {
  display: none;
  opacity: 1;
  visibility: visible;
  position: fixed;
  inset: 0;
  z-index: 500;
  background: rgba(0,0,0,.45);
  backdrop-filter: blur(2px);
  justify-content: center;
  align-items: flex-start;
  padding: 2rem 1rem;
  overflow-y: auto;
}
.modal-overlay.open { display: flex; }

/* ── Modal Box ── */
.modal-box {
  background: #fff;
  border-radius: 16px;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 20px 60px rgba(0,0,0,.18);
  overflow: hidden;
  margin: auto;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}
.modal-header h3 { font-size: 1.1rem; font-weight: 600; color: #111827; }
.modal-close {
  width: 32px; height: 32px;
  border: none; background: none;
  border-radius: 8px;
  cursor: pointer; font-size: 1.1rem; color: #6b7280;
  display: flex; align-items: center; justify-content: center;
  transition: background .15s;
}
.modal-close:hover { background: #f3f4f6; }
.modal-body { padding: 1.5rem; }
.modal-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex; justify-content: flex-end; gap: .75rem;
}

/* ── Form Helpers ── */
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.form-group { display: flex; flex-direction: column; gap: .4rem; }
.form-group.full { grid-column: 1 / -1; }
.form-group label { font-size: .8rem; font-weight: 600; color: #374151; }
.form-group input,
.form-group select,
.form-group textarea {
  padding: .55rem .75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: .875rem;
  outline: none;
  transition: border-color .15s;
  background: #fff;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus { border-color: #3b82f6; }
.form-group textarea { resize: vertical; min-height: 80px; }

/* ── Buttons ── */
.btn {
  padding: .55rem 1.2rem;
  border-radius: 8px;
  font-size: .875rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: opacity .15s, background .15s;
}
.btn:hover { opacity: .9; }
.btn-primary { background: #3b82f6; color: #fff; }
.btn-secondary { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
.btn-danger { background: #ef4444; color: #fff; }
.btn-outline { background: #fff; color: #374151; border: 1px solid #d1d5db; }

/* ── Attendance Drawer (CRITICAL) ── */
.att-drawer {
  position: fixed;
  right: -460px;
  top: 0; bottom: 0;
  width: 440px;
  max-width: 100vw;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0,0,0,.14);
  z-index: 495;
  display: flex;
  flex-direction: column;
  transition: right .28s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
}
.att-drawer.open { right: 0; }

/* Drawer Overlay */
.drawer-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 490;
  background: rgba(0,0,0,.3);
}
.drawer-overlay.open { display: block; }

/* Drawer Header */
.vd-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  background: #fff;
}
.drawer-profile {
  display: flex; align-items: center; gap: 1rem;
  margin-bottom: 1rem;
}
.drawer-avatar {
  width: 52px; height: 52px;
  border-radius: 50%;
  background: #3b82f6;
  color: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.2rem; font-weight: 700;
  flex-shrink: 0;
}
.drawer-profile-info { flex: 1; min-width: 0; }
.drawer-profile-name { font-size: 1rem; font-weight: 600; color: #111827; }
.drawer-profile-sub { font-size: .8rem; color: #6b7280; margin-top: .1rem; }
.drawer-close-btn {
  width: 32px; height: 32px;
  border: none; background: none;
  border-radius: 8px;
  cursor: pointer; font-size: 1.1rem; color: #6b7280;
  display: flex; align-items: center; justify-content: center;
  margin-left: auto;
}
.drawer-close-btn:hover { background: #f3f4f6; }

/* Drawer Tabs */
.drawer-tabs {
  display: flex; gap: .25rem;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0;
  margin-top: .75rem;
}
.dtab {
  padding: .5rem 1rem;
  border: none; background: none;
  font-size: .85rem; color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: color .15s, border-color .15s;
  font-weight: 500;
}
.dtab.active { color: #3b82f6; border-bottom-color: #3b82f6; }

/* Drawer Body */
.vd-body {
  flex: 1; overflow-y: auto;
  padding: 1.25rem 1.5rem;
}
.dtab-pane { display: none; }
.dtab-pane.active { display: block; }

.drawer-section { margin-bottom: 1.5rem; }
.drawer-section-title {
  font-size: .75rem; font-weight: 700;
  text-transform: uppercase; letter-spacing: .05em;
  color: #9ca3af;
  margin-bottom: .75rem;
}
.drawer-field {
  display: flex; justify-content: space-between;
  padding: .5rem 0;
  border-bottom: 1px solid #f3f4f6;
  gap: 1rem;
}
.drawer-field:last-child { border-bottom: none; }
.df-label { font-size: .8rem; color: #6b7280; flex-shrink: 0; }
.df-val { font-size: .875rem; color: #111827; font-weight: 500; text-align: right; }

/* Drawer Footer */
.vd-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  display: flex; gap: .75rem;
  flex-shrink: 0;
}
.vd-footer .btn { flex: 1; text-align: center; }
"""

def build_css():
    css_dir = makedirs("erp", "attendance")
    out_path = os.path.join(css_dir, "attendance.css")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(CSS)
    print(f"  Created: {out_path}")

# ---------------------------------------------------------------------------
# 3. erp/attendance/attendance.js
# ---------------------------------------------------------------------------
JS = """\
'use strict';

let allAtt = [];
let filteredAtt = [];
let editingId = null;
let deletingId = null;
let currentPage = 1;
const PAGE_SIZE = 10;

// ── Load ────────────────────────────────────────────────────────────────────
async function loadAttendance() {
  try {
    const res = await fetch('../../data/attendance.json?v=' + Date.now());
    const data = await res.json();
    allAtt = data.attendance || [];
    const local = JSON.parse(localStorage.getItem('lcc_attendance') || '[]');
    local.forEach(loc => {
      const idx = allAtt.findIndex(a => a.id === loc.id);
      if (idx > -1) allAtt[idx] = loc; else allAtt.push(loc);
    });
  } catch (e) {
    allAtt = JSON.parse(localStorage.getItem('lcc_attendance') || '[]');
    console.warn('Attendance fetch failed, using localStorage', e);
  }
  applyFilters();
}

function saveLocal() {
  localStorage.setItem('lcc_attendance', JSON.stringify(allAtt));
}

// ── Stats ───────────────────────────────────────────────────────────────────
function updateStats() {
  const el = id => document.getElementById(id);
  el('statTotalRecords').textContent = allAtt.length;
  el('statPresent').textContent = allAtt.filter(a => a.status === 'present').length;
  el('statAbsent').textContent = allAtt.filter(a => a.status === 'absent').length;
  el('statLate').textContent = allAtt.filter(a => a.status === 'late').length;
}

// ── Filters ─────────────────────────────────────────────────────────────────
function applyFilters() {
  const q = (document.getElementById('attSearch')?.value || '').toLowerCase();
  const st = document.getElementById('filterStatus')?.value || '';
  const dt = document.getElementById('filterDate')?.value || '';

  filteredAtt = allAtt.filter(a => {
    const matchQ = !q || a.id.toLowerCase().includes(q) || a.employee_name.toLowerCase().includes(q) || a.employee_id.toLowerCase().includes(q);
    const matchSt = !st || a.status === st;
    const matchDt = !dt || a.date === dt;
    return matchQ && matchSt && matchDt;
  });

  currentPage = 1;
  updateStats();
  renderTable();
  renderPagination();
}

function clearFilters() {
  ['attSearch', 'filterStatus', 'filterDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  applyFilters();
}

// ── Table ───────────────────────────────────────────────────────────────────
function badgeHtml(status) {
  const cls = {
    present: 'badge-present', absent: 'badge-absent',
    late: 'badge-late', half_day: 'badge-half_day'
  };
  const label = status === 'half_day' ? 'Half Day' : status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="badge ${cls[status] || ''}">${label}</span>`;
}

function renderTable() {
  const tbody = document.getElementById('attBody');
  if (!tbody) return;
  const start = (currentPage - 1) * PAGE_SIZE;
  const page = filteredAtt.slice(start, start + PAGE_SIZE);

  if (!page.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#9ca3af;">No records found.</td></tr>';
    return;
  }

  tbody.innerHTML = page.map(a => `
    <tr>
      <td>
        <div style="font-weight:600;color:#111827;">${a.employee_name}</div>
        <div style="font-size:.75rem;color:#6b7280;">${a.employee_id} · ${a.id}</div>
      </td>
      <td>${a.date}</td>
      <td>${a.clock_in ?? '<span style="color:#9ca3af;">—</span>'}</td>
      <td>${a.clock_out ?? '<span style="color:#9ca3af;">—</span>'}</td>
      <td>${badgeHtml(a.status)}</td>
      <td>${a.work_hours > 0 ? a.work_hours + ' h' : '<span style="color:#9ca3af;">—</span>'}</td>
      <td>
        <div class="actions">
          <button class="btn-icon" title="View" onclick="openAttDrawer('${a.id}')">👁</button>
          <button class="btn-icon" title="Edit" onclick="openEditModal('${a.id}')">✏️</button>
          <button class="btn-icon danger" title="Delete" onclick="openDeleteModal('${a.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Pagination ──────────────────────────────────────────────────────────────
function renderPagination() {
  const infoEl = document.getElementById('paginationInfo');
  const btnsEl = document.getElementById('paginationBtns');
  const total = filteredAtt.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end = Math.min(currentPage * PAGE_SIZE, total);

  if (infoEl) infoEl.textContent = `Showing ${start}–${end} of ${total} records`;

  if (!btnsEl) return;
  let html = `<button onclick="goPage(${currentPage - 1})" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 7 && p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 1) {
      if (p === 3 || p === totalPages - 2) html += '<button disabled>…</button>';
      continue;
    }
    html += `<button class="${p === currentPage ? 'active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button onclick="goPage(${currentPage + 1})" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
  btnsEl.innerHTML = html;
}

function goPage(p) {
  const totalPages = Math.ceil(filteredAtt.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTable();
  renderPagination();
}

// ── Export ──────────────────────────────────────────────────────────────────
function openExportModal() {
  document.getElementById('exportModal')?.classList.add('open');
}
function closeExportModal() {
  document.getElementById('exportModal')?.classList.remove('open');
}
function doExport() {
  const fmt = document.querySelector('input[name="exportFmt"]:checked')?.value || 'csv';
  const data = filteredAtt.length ? filteredAtt : allAtt;
  let content, mime, ext;
  if (fmt === 'json') {
    content = JSON.stringify({ attendance: data }, null, 2);
    mime = 'application/json'; ext = 'json';
  } else {
    const header = 'ID,Employee,Employee ID,Date,Clock In,Clock Out,Status,Work Hours,Notes';
    const rows = data.map(a =>
      [a.id, `"${a.employee_name}"`, a.employee_id, a.date, a.clock_in ?? '', a.clock_out ?? '', a.status, a.work_hours, `"${a.notes}"`].join(',')
    );
    content = [header, ...rows].join('\\n');
    mime = 'text/csv'; ext = 'csv';
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: `attendance_export.${ext}` });
  a.click(); URL.revokeObjectURL(url);
  closeExportModal();
}

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
function openAddModal() {
  editingId = null;
  document.getElementById('attModalTitle').textContent = 'Add Attendance Record';
  document.getElementById('attModalSaveBtn').textContent = 'Save Record';
  document.getElementById('attForm').reset();
  document.getElementById('fDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('attModal').classList.add('open');
}

function openEditModal(id) {
  const rec = allAtt.find(a => a.id === id);
  if (!rec) return;
  editingId = id;
  document.getElementById('attModalTitle').textContent = 'Edit Attendance Record';
  document.getElementById('attModalSaveBtn').textContent = 'Update Record';
  document.getElementById('fEmpName').value = rec.employee_name;
  document.getElementById('fEmpId').value = rec.employee_id;
  document.getElementById('fDate').value = rec.date;
  document.getElementById('fClockIn').value = rec.clock_in ?? '';
  document.getElementById('fClockOut').value = rec.clock_out ?? '';
  document.getElementById('fStatus').value = rec.status;
  document.getElementById('fNotes').value = rec.notes ?? '';
  document.getElementById('attModal').classList.add('open');
}

function closeAttModal() {
  document.getElementById('attModal')?.classList.remove('open');
  editingId = null;
}

function saveAttendance(e) {
  e.preventDefault();
  const empName = document.getElementById('fEmpName').value.trim();
  const empId = document.getElementById('fEmpId').value.trim();
  const date = document.getElementById('fDate').value;
  const clockIn = document.getElementById('fClockIn').value || null;
  const clockOut = document.getElementById('fClockOut').value || null;
  const status = document.getElementById('fStatus').value;
  const notes = document.getElementById('fNotes').value.trim();

  if (!empName || !empId || !date || !status) {
    showToast('Please fill all required fields.', 'error'); return;
  }

  let workHours = 0;
  if (clockIn && clockOut) {
    const [ih, im] = clockIn.split(':').map(Number);
    const [oh, om] = clockOut.split(':').map(Number);
    workHours = Math.round(((oh + om / 60) - (ih + im / 60)) * 100) / 100;
  }

  if (editingId) {
    const idx = allAtt.findIndex(a => a.id === editingId);
    if (idx > -1) allAtt[idx] = { ...allAtt[idx], employee_name: empName, employee_id: empId, date, clock_in: clockIn, clock_out: clockOut, status, notes, work_hours: workHours };
    showToast('Record updated.', 'success');
  } else {
    const newId = 'ATT-' + String(allAtt.length + 1).padStart(4, '0');
    allAtt.push({ id: newId, employee_name: empName, employee_id: empId, date, clock_in: clockIn, clock_out: clockOut, status, notes, work_hours: workHours });
    showToast('Record added.', 'success');
  }
  saveLocal();
  closeAttModal();
  applyFilters();
}

// ── Drawer ───────────────────────────────────────────────────────────────────
function openAttDrawer(id) {
  const rec = allAtt.find(a => a.id === id);
  if (!rec) return;

  const initials = rec.employee_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const label = rec.status === 'half_day' ? 'Half Day' : rec.status.charAt(0).toUpperCase() + rec.status.slice(1);
  const badgeCls = { present: 'badge-present', absent: 'badge-absent', late: 'badge-late', half_day: 'badge-half_day' };

  document.getElementById('attDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar">${initials}</div>
      <div class="drawer-profile-info">
        <div class="drawer-profile-name">${rec.employee_name}</div>
        <div class="drawer-profile-sub">${rec.employee_id} &middot; ${rec.id}</div>
      </div>
      <span class="badge ${badgeCls[rec.status] || ''}" style="margin-left:auto;">${label}</span>
      <button class="drawer-close-btn" onclick="closeAttDrawer()">✕</button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchAttTab(this,'paneDetails')">Details</button>
      <button class="dtab" onclick="switchAttTab(this,'paneHours')">Hours</button>
      <button class="dtab" onclick="switchAttTab(this,'paneNotes')">Notes</button>
    </div>
  `;

  document.getElementById('attDrawerBody').innerHTML = `
    <div id="paneDetails" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title">Attendance Info</div>
        <div class="drawer-field"><span class="df-label">Record ID</span><span class="df-val">${rec.id}</span></div>
        <div class="drawer-field"><span class="df-label">Employee</span><span class="df-val">${rec.employee_name}</span></div>
        <div class="drawer-field"><span class="df-label">Employee ID</span><span class="df-val">${rec.employee_id}</span></div>
        <div class="drawer-field"><span class="df-label">Date</span><span class="df-val">${rec.date}</span></div>
        <div class="drawer-field"><span class="df-label">Status</span><span class="df-val"><span class="badge ${badgeCls[rec.status] || ''}">${label}</span></span></div>
      </div>
    </div>
    <div id="paneHours" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title">Time Details</div>
        <div class="drawer-field"><span class="df-label">Clock In</span><span class="df-val">${rec.clock_in ?? '—'}</span></div>
        <div class="drawer-field"><span class="df-label">Clock Out</span><span class="df-val">${rec.clock_out ?? '—'}</span></div>
        <div class="drawer-field"><span class="df-label">Work Hours</span><span class="df-val">${rec.work_hours > 0 ? rec.work_hours + ' h' : '—'}</span></div>
      </div>
    </div>
    <div id="paneNotes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title">Notes</div>
        <p style="font-size:.875rem;color:#374151;">${rec.notes || '<span style="color:#9ca3af;">No notes.</span>'}</p>
      </div>
    </div>
  `;

  document.getElementById('attDrawerFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closeAttDrawer()">Close</button>
    <button class="btn btn-primary" onclick="closeAttDrawer();openEditModal('${rec.id}')">Edit</button>
    <button class="btn btn-danger" onclick="closeAttDrawer();openDeleteModal('${rec.id}')">Delete</button>
  `;

  document.getElementById('drawerOverlay')?.classList.add('open');
  document.getElementById('attDrawer')?.classList.add('open');
}

function closeAttDrawer() {
  document.getElementById('drawerOverlay')?.classList.remove('open');
  document.getElementById('attDrawer')?.classList.remove('open');
}

function switchAttTab(btn, tabId) {
  btn.closest('.vd-header, .att-drawer').querySelectorAll('.dtab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.dtab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
}

// ── Delete ───────────────────────────────────────────────────────────────────
function openDeleteModal(id) {
  const rec = allAtt.find(a => a.id === id);
  if (!rec) return;
  deletingId = id;
  document.getElementById('deleteAttRef').textContent = `${rec.id} — ${rec.employee_name} (${rec.date})`;
  document.getElementById('deleteAttModal').classList.add('open');
}
function closeDeleteModal() {
  document.getElementById('deleteAttModal')?.classList.remove('open');
  deletingId = null;
}
function confirmDeleteAtt() {
  if (!deletingId) return;
  allAtt = allAtt.filter(a => a.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Record deleted.', 'success');
}

// ── Toast fallback ────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  if (typeof window.showToast === 'function' && window.showToast !== showToast) {
    window.showToast(msg, type); return;
  }
  const c = document.getElementById('toastContainer');
  if (!c) { alert(msg); return; }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.style.cssText = 'padding:.75rem 1rem;border-radius:8px;margin-bottom:.5rem;background:#111827;color:#fff;font-size:.875rem;box-shadow:0 4px 12px rgba(0,0,0,.2);';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadAttendance();

  document.getElementById('btnExport')?.addEventListener('click', openExportModal);
  document.getElementById('btnAddAtt')?.addEventListener('click', openAddModal);
  document.getElementById('attSearch')?.addEventListener('input', applyFilters);
  document.getElementById('filterStatus')?.addEventListener('change', applyFilters);
  document.getElementById('filterDate')?.addEventListener('change', applyFilters);
  document.getElementById('attForm')?.addEventListener('submit', saveAttendance);

  // backdrop close
  document.getElementById('exportModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('exportModal')) closeExportModal();
  });
  document.getElementById('attModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('attModal')) closeAttModal();
  });
  document.getElementById('deleteAttModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('deleteAttModal')) closeDeleteModal();
  });
  document.getElementById('drawerOverlay')?.addEventListener('click', closeAttDrawer);
});
"""

def build_js():
    js_dir = makedirs("erp", "attendance")
    out_path = os.path.join(js_dir, "attendance.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(JS)
    print(f"  Created: {out_path}")

# ---------------------------------------------------------------------------
# 4. erp/attendance/index.html
# ---------------------------------------------------------------------------
HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Attendance — LankaCommerce Cloud</title>
  <link rel="stylesheet" href="../../assets/css/variables.css" />
  <link rel="stylesheet" href="../../assets/css/base.css" />
  <link rel="stylesheet" href="../../assets/css/components.css" />
  <link rel="stylesheet" href="../../assets/css/layout.css" />
  <link rel="stylesheet" href="../erp.css" />
  <link rel="stylesheet" href="attendance.css" />
</head>
<body>

<!-- Sidebar -->
<aside id="sidebar" class="sidebar"></aside>
<div id="sidebarOverlay" class="sidebar-overlay"></div>

<!-- Main Wrapper -->
<div id="mainWrapper" class="main-wrapper">

  <!-- Top Bar -->
  <header id="erpTopBar" class="erp-top-bar" data-page-title="Attendance"></header>

  <!-- Page Content -->
  <main class="page-content">

    <!-- Page Header -->
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:.75rem;">
      <div>
        <h1 style="font-size:1.4rem;font-weight:700;color:#111827;margin:0;">Attendance</h1>
        <p style="font-size:.875rem;color:#6b7280;margin:.25rem 0 0;">Track employee attendance records</p>
      </div>
      <div style="display:flex;gap:.75rem;">
        <button id="btnExport" class="btn btn-outline">⬇ Export</button>
        <button id="btnAddAtt" class="btn btn-primary">+ Add Record</button>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon blue">📋</div>
        <div class="kpi-info">
          <div class="kpi-val" id="statTotalRecords">0</div>
          <div class="kpi-label">Total Records</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon green">✅</div>
        <div class="kpi-info">
          <div class="kpi-val" id="statPresent">0</div>
          <div class="kpi-label">Present</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon red">❌</div>
        <div class="kpi-info">
          <div class="kpi-val" id="statAbsent">0</div>
          <div class="kpi-label">Absent</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon yellow">⏰</div>
        <div class="kpi-info">
          <div class="kpi-val" id="statLate">0</div>
          <div class="kpi-label">Late</div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="attSearch" placeholder="Search by name or ID…" />
      </div>
      <select id="filterStatus">
        <option value="">All Statuses</option>
        <option value="present">Present</option>
        <option value="absent">Absent</option>
        <option value="late">Late</option>
        <option value="half_day">Half Day</option>
      </select>
      <input type="date" id="filterDate" title="Filter by date" />
      <button class="btn-clear-filter" onclick="clearFilters()">✕ Clear</button>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Clock In</th>
            <th>Clock Out</th>
            <th>Status</th>
            <th>Hours</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="attBody">
          <tr><td colspan="7" style="text-align:center;padding:2rem;color:#9ca3af;">Loading…</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-bar">
      <span id="paginationInfo">Showing 0–0 of 0 records</span>
      <div class="pagination-btns" id="paginationBtns"></div>
    </div>

  </main>
</div><!-- /mainWrapper -->

<!-- ══════════════════════════════════════════════════════ EXPORT MODAL -->
<div id="exportModal" class="modal-overlay">
  <div class="modal-box" style="max-width:380px;">
    <div class="modal-header">
      <h3>Export Attendance</h3>
      <button class="modal-close" onclick="closeExportModal()">✕</button>
    </div>
    <div class="modal-body">
      <p style="font-size:.875rem;color:#6b7280;margin-bottom:1rem;">Choose format to export current filtered data.</p>
      <label style="display:flex;align-items:center;gap:.5rem;margin-bottom:.75rem;cursor:pointer;">
        <input type="radio" name="exportFmt" value="csv" checked /> CSV
      </label>
      <label style="display:flex;align-items:center;gap:.5rem;cursor:pointer;">
        <input type="radio" name="exportFmt" value="json" /> JSON
      </label>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeExportModal()">Cancel</button>
      <button class="btn btn-primary" onclick="doExport()">Export</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════ ADD/EDIT MODAL -->
<div id="attModal" class="modal-overlay">
  <div class="modal-box">
    <div class="modal-header">
      <h3 id="attModalTitle">Add Attendance Record</h3>
      <button class="modal-close" onclick="closeAttModal()">✕</button>
    </div>
    <form id="attForm" onsubmit="saveAttendance(event)">
      <div class="modal-body">
        <div class="form-grid">
          <div class="form-group">
            <label for="fEmpName">Employee Name *</label>
            <input type="text" id="fEmpName" placeholder="e.g. Kamal Perera" required />
          </div>
          <div class="form-group">
            <label for="fEmpId">Employee ID *</label>
            <input type="text" id="fEmpId" placeholder="e.g. EMP-001" required />
          </div>
          <div class="form-group">
            <label for="fDate">Date *</label>
            <input type="date" id="fDate" required />
          </div>
          <div class="form-group">
            <label for="fStatus">Status *</label>
            <select id="fStatus" required>
              <option value="">Select status</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
              <option value="late">Late</option>
              <option value="half_day">Half Day</option>
            </select>
          </div>
          <div class="form-group">
            <label for="fClockIn">Clock In</label>
            <input type="time" id="fClockIn" />
          </div>
          <div class="form-group">
            <label for="fClockOut">Clock Out</label>
            <input type="time" id="fClockOut" />
          </div>
          <div class="form-group full">
            <label for="fNotes">Notes</label>
            <textarea id="fNotes" placeholder="Optional notes…"></textarea>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closeAttModal()">Cancel</button>
        <button type="submit" id="attModalSaveBtn" class="btn btn-primary">Save Record</button>
      </div>
    </form>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════ DELETE MODAL -->
<div id="deleteAttModal" class="modal-overlay">
  <div class="modal-box" style="max-width:420px;">
    <div class="modal-header">
      <h3>Delete Record</h3>
      <button class="modal-close" onclick="closeDeleteModal()">✕</button>
    </div>
    <div class="modal-body">
      <p style="font-size:.875rem;color:#374151;">Are you sure you want to delete this record?</p>
      <p style="font-size:.8rem;color:#6b7280;margin-top:.5rem;font-weight:600;" id="deleteAttRef"></p>
      <p style="font-size:.8rem;color:#ef4444;margin-top:.75rem;">This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn btn-danger" onclick="confirmDeleteAtt()">Delete</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════ DRAWER OVERLAY -->
<div id="drawerOverlay" class="drawer-overlay"></div>

<!-- ══════════════════════════════════════════════════════ ATTENDANCE DRAWER -->
<div id="attDrawer" class="att-drawer">
  <div class="vd-header" id="attDrawerHeader"></div>
  <div class="vd-body" id="attDrawerBody"></div>
  <div class="vd-footer" id="attDrawerFooter"></div>
</div>

<!-- Toast Container -->
<div id="toastContainer" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;min-width:280px;"></div>

<!-- Scripts -->
<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="../../assets/js/toast.js"></script>
<script src="attendance.js"></script>
</body>
</html>
"""

def build_html():
    html_dir = makedirs("erp", "attendance")
    out_path = os.path.join(html_dir, "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(HTML)
    print(f"  Created: {out_path}")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("Building Attendance module…")
    build_json()
    build_css()
    build_js()
    build_html()
    print("Done.")
