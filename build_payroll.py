"""
build_payroll.py
Generates Payroll module files for LankaCommerce Cloud ERP UI Prototype.
"""
import os, json, random

BASE = os.path.join(os.path.dirname(__file__), 'UI-Prototype')

def makedirs(*parts):
    path = os.path.join(BASE, *parts)
    os.makedirs(path, exist_ok=True)
    return path

# ---------------------------------------------------------------------------
# 1. data/payroll.json
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

    departments = ["Sales", "Warehouse", "IT", "Accounting", "Administration", "Delivery", "HR"]
    periods = ["Jan 2025", "Feb 2025", "Mar 2025", "Apr 2025", "May 2025"]
    statuses = ["paid", "paid", "paid", "pending", "draft"]

    records = []
    for i in range(1, 21):
        emp = random.choice(employees)
        dept = random.choice(departments)
        period = random.choice(periods)
        basic_salary = random.randint(45, 250) * 1000  # 45000–250000
        allowances = random.randint(0, 25) * 1000  # 0–25000
        gross_pay = basic_salary + allowances
        epf_employee = round(gross_pay * 0.08)
        etf = round(gross_pay * 0.03)
        other_deductions = random.randint(0, 5) * 1000  # 0–5000
        net_pay = gross_pay - epf_employee - other_deductions
        status = random.choice(statuses)

        if status == "paid":
            # generate a payment date in 2025
            month_map = {
                "Jan 2025": 1, "Feb 2025": 2, "Mar 2025": 3,
                "Apr 2025": 4, "May 2025": 5,
            }
            m = month_map.get(period, 1)
            payment_date = f"2025-{m:02d}-{random.randint(25, 28):02d}"
        else:
            payment_date = None

        records.append({
            "id": f"PAY-{i:04d}",
            "employee_id": emp[0],
            "employee_name": emp[1],
            "period": period,
            "department": dept,
            "basic_salary": basic_salary,
            "allowances": allowances,
            "gross_pay": gross_pay,
            "epf_employee": epf_employee,
            "etf": etf,
            "other_deductions": other_deductions,
            "net_pay": net_pay,
            "status": status,
            "payment_date": payment_date,
        })

    data_dir = makedirs("data")
    out_path = os.path.join(data_dir, "payroll.json")
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump({"payroll": records}, f, indent=2)
    print(f"  Created: {out_path}")

# ---------------------------------------------------------------------------
# 2. erp/payroll/payroll.css
# ---------------------------------------------------------------------------
CSS = """\
/* ============================================================
   Payroll Module — LankaCommerce Cloud
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
.kpi-icon.yellow { background: #fefce8; color: #eab308; }
.kpi-icon.purple { background: #faf5ff; color: #a855f7; }
.kpi-info { min-width: 0; }
.kpi-info .kpi-val {
  font-size: 1.5rem; font-weight: 700;
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

.filter-bar select {
  padding: .5rem .75rem;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: .875rem;
  outline: none;
  background: #fff;
  cursor: pointer;
  transition: border-color .15s;
}
.filter-bar select:focus { border-color: #3b82f6; }

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
.badge-paid    { background: #dcfce7; color: #15803d; }
.badge-pending { background: #fef9c3; color: #a16207; }
.badge-draft   { background: #f3f4f6; color: #6b7280; }

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
  max-width: 560px;
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

/* ── Pay Computed Summary ── */
#payComputed {
  background: #f0fdf4;
  border: 1px solid #bbf7d0;
  border-radius: 10px;
  padding: .75rem 1rem;
  margin-top: .75rem;
  font-size: .8rem;
  color: #374151;
}
#payComputed .pc-row {
  display: flex; justify-content: space-between;
  padding: .25rem 0;
  border-bottom: 1px solid #dcfce7;
}
#payComputed .pc-row:last-child { border-bottom: none; font-weight: 700; color: #15803d; }
#payComputed .pc-label { color: #6b7280; }

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
.form-group textarea { resize: vertical; min-height: 70px; }

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
.btn-primary   { background: #3b82f6; color: #fff; }
.btn-secondary { background: #f3f4f6; color: #374151; border: 1px solid #e5e7eb; }
.btn-danger    { background: #ef4444; color: #fff; }
.btn-outline   { background: #fff; color: #374151; border: 1px solid #d1d5db; }
.btn-success   { background: #22c55e; color: #fff; }

/* ── Payroll Drawer (CRITICAL) ── */
.pay-drawer {
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
.pay-drawer.open { right: 0; }

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

/* Breakdown Financial Table */
.breakdown-table { width: 100%; border-collapse: collapse; font-size: .8rem; }
.breakdown-table tr td { padding: .5rem .25rem; border-bottom: 1px solid #f3f4f6; }
.breakdown-table tr:last-child td { border-bottom: 2px solid #e5e7eb; font-weight: 700; font-size: .9rem; }
.breakdown-table .bt-label { color: #6b7280; }
.breakdown-table .bt-val { text-align: right; color: #111827; }
.breakdown-table .bt-neg { color: #ef4444; }
.breakdown-table .bt-pos { color: #15803d; }

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
    css_dir = makedirs("erp", "payroll")
    out_path = os.path.join(css_dir, "payroll.css")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(CSS)
    print(f"  Created: {out_path}")

# ---------------------------------------------------------------------------
# 3. erp/payroll/payroll.js
# ---------------------------------------------------------------------------
JS = """\
'use strict';

let allPayroll = [];
let filteredPayroll = [];
let editingId = null;
let deletingId = null;
let currentPage = 1;
const PAGE_SIZE = 8;

const fmtLKR = n => '\\u20a8 ' + Number(n).toLocaleString('en-LK');

// ── Load ────────────────────────────────────────────────────────────────────
async function loadPayroll() {
  try {
    const res = await fetch('../../data/payroll.json?v=' + Date.now());
    const data = await res.json();
    allPayroll = data.payroll || [];
    const local = JSON.parse(localStorage.getItem('lcc_payroll') || '[]');
    local.forEach(loc => {
      const idx = allPayroll.findIndex(p => p.id === loc.id);
      if (idx > -1) allPayroll[idx] = loc; else allPayroll.push(loc);
    });
  } catch (e) {
    allPayroll = JSON.parse(localStorage.getItem('lcc_payroll') || '[]');
    console.warn('Payroll fetch failed, using localStorage', e);
  }
  applyFilters();
}

function saveLocal() {
  localStorage.setItem('lcc_payroll', JSON.stringify(allPayroll));
}

// ── Stats ───────────────────────────────────────────────────────────────────
function updateStats() {
  const el = id => document.getElementById(id);

  const totalNet = allPayroll.reduce((s, p) => s + (p.net_pay || 0), 0);
  el('statTotalPayroll').textContent = fmtLKR(totalNet);

  el('statPaid').textContent = allPayroll.filter(p => p.status === 'paid').length;
  el('statPending').textContent = allPayroll.filter(p => p.status === 'pending' || p.status === 'draft').length;

  // Last period net (find the most recent period alphabetically)
  const periods = [...new Set(allPayroll.map(p => p.period))].sort();
  const lastPeriod = periods[periods.length - 1];
  const lastNet = allPayroll.filter(p => p.period === lastPeriod).reduce((s, p) => s + (p.net_pay || 0), 0);
  el('statNetThisMonth').textContent = fmtLKR(lastNet);
}

// ── Filters ─────────────────────────────────────────────────────────────────
function applyFilters() {
  const q = (document.getElementById('paySearch')?.value || '').toLowerCase();
  const st = document.getElementById('filterStatus')?.value || '';
  const period = document.getElementById('filterPeriod')?.value || '';
  const dept = document.getElementById('filterDept')?.value || '';

  filteredPayroll = allPayroll.filter(p => {
    const matchQ = !q || p.id.toLowerCase().includes(q) || p.employee_name.toLowerCase().includes(q) || p.employee_id.toLowerCase().includes(q);
    const matchSt = !st || p.status === st;
    const matchPeriod = !period || p.period === period;
    const matchDept = !dept || p.department === dept;
    return matchQ && matchSt && matchPeriod && matchDept;
  });

  currentPage = 1;
  updateStats();
  renderTable();
  renderPagination();
}

function clearFilters() {
  ['paySearch', 'filterStatus', 'filterPeriod', 'filterDept'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  applyFilters();
}

// ── Table ───────────────────────────────────────────────────────────────────
function badgeHtml(status) {
  const cls = { paid: 'badge-paid', pending: 'badge-pending', draft: 'badge-draft' };
  const label = status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="badge ${cls[status] || ''}">${label}</span>`;
}

function renderTable() {
  const tbody = document.getElementById('payBody');
  if (!tbody) return;
  const start = (currentPage - 1) * PAGE_SIZE;
  const page = filteredPayroll.slice(start, start + PAGE_SIZE);

  if (!page.length) {
    tbody.innerHTML = '<tr><td colspan="8" style="text-align:center;padding:2rem;color:#9ca3af;">No payslips found.</td></tr>';
    return;
  }

  tbody.innerHTML = page.map(p => `
    <tr>
      <td>
        <div style="font-weight:600;color:#111827;">${p.employee_name}</div>
        <div style="font-size:.75rem;color:#6b7280;">${p.employee_id} · ${p.id}</div>
      </td>
      <td>${p.department}</td>
      <td>${p.period}</td>
      <td style="font-size:.85rem;">${fmtLKR(p.gross_pay)}</td>
      <td style="font-size:.85rem;color:#6b7280;">${fmtLKR(p.epf_employee)}</td>
      <td style="font-size:.875rem;font-weight:600;color:#15803d;">${fmtLKR(p.net_pay)}</td>
      <td>${badgeHtml(p.status)}</td>
      <td>
        <div class="actions">
          <button class="btn-icon" title="View" onclick="openPayDrawer('${p.id}')">👁</button>
          <button class="btn-icon" title="Edit" onclick="openEditModal('${p.id}')">✏️</button>
          <button class="btn-icon danger" title="Delete" onclick="openDeleteModal('${p.id}')">🗑</button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Pagination ──────────────────────────────────────────────────────────────
function renderPagination() {
  const infoEl = document.getElementById('paginationInfo');
  const btnsEl = document.getElementById('paginationBtns');
  const total = filteredPayroll.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end = Math.min(currentPage * PAGE_SIZE, total);

  if (infoEl) infoEl.textContent = `Showing ${start}–${end} of ${total} payslips`;
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
  const totalPages = Math.ceil(filteredPayroll.length / PAGE_SIZE);
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
  const data = filteredPayroll.length ? filteredPayroll : allPayroll;
  let content, mime, ext;
  if (fmt === 'json') {
    content = JSON.stringify({ payroll: data }, null, 2);
    mime = 'application/json'; ext = 'json';
  } else {
    const header = 'ID,Employee,Employee ID,Department,Period,Basic Salary,Allowances,Gross Pay,EPF(8%),ETF(3%),Other Deductions,Net Pay,Status,Payment Date';
    const rows = data.map(p =>
      [p.id, `"${p.employee_name}"`, p.employee_id, p.department, `"${p.period}"`,
       p.basic_salary, p.allowances, p.gross_pay, p.epf_employee, p.etf,
       p.other_deductions, p.net_pay, p.status, p.payment_date ?? ''].join(',')
    );
    content = [header, ...rows].join('\\n');
    mime = 'text/csv'; ext = 'csv';
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: `payroll_export.${ext}` });
  a.click(); URL.revokeObjectURL(url);
  closeExportModal();
}

// ── Auto-compute ─────────────────────────────────────────────────────────────
function recomputePayModal() {
  const basic = parseFloat(document.getElementById('fBasicSalary')?.value) || 0;
  const allow = parseFloat(document.getElementById('fAllowances')?.value) || 0;
  const deduct = parseFloat(document.getElementById('fOtherDeductions')?.value) || 0;
  const gross = basic + allow;
  const epf = Math.round(gross * 0.08);
  const etf = Math.round(gross * 0.03);
  const net = gross - epf - deduct;
  const el = document.getElementById('payComputed');
  if (!el) return;
  el.innerHTML = `
    <div class="pc-row"><span class="pc-label">Gross Pay</span><span>${fmtLKR(gross)}</span></div>
    <div class="pc-row"><span class="pc-label">EPF (8%)</span><span style="color:#ef4444;">- ${fmtLKR(epf)}</span></div>
    <div class="pc-row"><span class="pc-label">ETF (3% employer)</span><span style="color:#6b7280;">${fmtLKR(etf)}</span></div>
    <div class="pc-row"><span class="pc-label">Other Deductions</span><span style="color:#ef4444;">- ${fmtLKR(deduct)}</span></div>
    <div class="pc-row"><span class="pc-label">Net Pay</span><span style="color:#15803d;">${fmtLKR(net)}</span></div>
  `;
}

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
function openAddModal() {
  editingId = null;
  document.getElementById('payModalTitle').textContent = 'Add Payslip';
  document.getElementById('payModalSaveBtn').textContent = 'Save Payslip';
  document.getElementById('payForm').reset();
  recomputePayModal();
  document.getElementById('payModal').classList.add('open');
}

function openEditModal(id) {
  const rec = allPayroll.find(p => p.id === id);
  if (!rec) return;
  editingId = id;
  document.getElementById('payModalTitle').textContent = 'Edit Payslip';
  document.getElementById('payModalSaveBtn').textContent = 'Update Payslip';
  document.getElementById('fEmpName').value = rec.employee_name;
  document.getElementById('fEmpId').value = rec.employee_id;
  document.getElementById('fDepartment').value = rec.department;
  document.getElementById('fPeriod').value = rec.period;
  document.getElementById('fBasicSalary').value = rec.basic_salary;
  document.getElementById('fAllowances').value = rec.allowances;
  document.getElementById('fOtherDeductions').value = rec.other_deductions;
  document.getElementById('fPaymentDate').value = rec.payment_date ?? '';
  document.getElementById('fStatus').value = rec.status;
  document.getElementById('fNotes').value = rec.notes ?? '';
  recomputePayModal();
  document.getElementById('payModal').classList.add('open');
}

function closePayModal() {
  document.getElementById('payModal')?.classList.remove('open');
  editingId = null;
}

function savePayslip(e) {
  e.preventDefault();
  const empName = document.getElementById('fEmpName').value.trim();
  const empId = document.getElementById('fEmpId').value.trim();
  const dept = document.getElementById('fDepartment').value;
  const period = document.getElementById('fPeriod').value.trim();
  const basic = parseFloat(document.getElementById('fBasicSalary').value) || 0;
  const allow = parseFloat(document.getElementById('fAllowances').value) || 0;
  const deduct = parseFloat(document.getElementById('fOtherDeductions').value) || 0;
  const payDate = document.getElementById('fPaymentDate').value || null;
  const status = document.getElementById('fStatus').value;
  const notes = document.getElementById('fNotes').value.trim();

  if (!empName || !empId || !period || !status) {
    showToast('Please fill all required fields.', 'error'); return;
  }

  const gross = basic + allow;
  const epf = Math.round(gross * 0.08);
  const etf = Math.round(gross * 0.03);
  const net = gross - epf - deduct;

  const payload = {
    employee_name: empName, employee_id: empId, department: dept,
    period, basic_salary: basic, allowances: allow, gross_pay: gross,
    epf_employee: epf, etf, other_deductions: deduct, net_pay: net,
    status, payment_date: payDate, notes,
  };

  if (editingId) {
    const idx = allPayroll.findIndex(p => p.id === editingId);
    if (idx > -1) allPayroll[idx] = { ...allPayroll[idx], ...payload };
    showToast('Payslip updated.', 'success');
  } else {
    const newId = 'PAY-' + String(allPayroll.length + 1).padStart(4, '0');
    allPayroll.push({ id: newId, ...payload });
    showToast('Payslip added.', 'success');
  }
  saveLocal();
  closePayModal();
  applyFilters();
}

// ── Drawer ───────────────────────────────────────────────────────────────────
function openPayDrawer(id) {
  const rec = allPayroll.find(p => p.id === id);
  if (!rec) return;

  const initials = rec.employee_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const badgeCls = { paid: 'badge-paid', pending: 'badge-pending', draft: 'badge-draft' };
  const label = rec.status.charAt(0).toUpperCase() + rec.status.slice(1);

  document.getElementById('payDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar">${initials}</div>
      <div class="drawer-profile-info">
        <div class="drawer-profile-name">${rec.employee_name}</div>
        <div class="drawer-profile-sub">${rec.employee_id} &middot; ${rec.id}</div>
      </div>
      <span class="badge ${badgeCls[rec.status] || ''}" style="margin-left:auto;">${label}</span>
      <button class="drawer-close-btn" onclick="closePayDrawer()">✕</button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchPayTab(this,'pPayDetails')">Details</button>
      <button class="dtab" onclick="switchPayTab(this,'pPayBreakdown')">Breakdown</button>
      <button class="dtab" onclick="switchPayTab(this,'pPayNotes')">Notes</button>
    </div>
  `;

  document.getElementById('payDrawerBody').innerHTML = `
    <div id="pPayDetails" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title">Payslip Info</div>
        <div class="drawer-field"><span class="df-label">Payslip ID</span><span class="df-val">${rec.id}</span></div>
        <div class="drawer-field"><span class="df-label">Employee</span><span class="df-val">${rec.employee_name}</span></div>
        <div class="drawer-field"><span class="df-label">Employee ID</span><span class="df-val">${rec.employee_id}</span></div>
        <div class="drawer-field"><span class="df-label">Department</span><span class="df-val">${rec.department}</span></div>
        <div class="drawer-field"><span class="df-label">Period</span><span class="df-val">${rec.period}</span></div>
        <div class="drawer-field"><span class="df-label">Status</span><span class="df-val"><span class="badge ${badgeCls[rec.status] || ''}">${label}</span></span></div>
        <div class="drawer-field"><span class="df-label">Payment Date</span><span class="df-val">${rec.payment_date ?? '—'}</span></div>
      </div>
    </div>
    <div id="pPayBreakdown" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title">Salary Breakdown</div>
        <table class="breakdown-table">
          <tr><td class="bt-label">Basic Salary</td><td class="bt-val">${fmtLKR(rec.basic_salary)}</td></tr>
          <tr><td class="bt-label">Allowances</td><td class="bt-val bt-pos">+ ${fmtLKR(rec.allowances)}</td></tr>
          <tr><td class="bt-label" style="font-weight:600;">Gross Pay</td><td class="bt-val" style="font-weight:600;">${fmtLKR(rec.gross_pay)}</td></tr>
          <tr><td class="bt-label">EPF (Employee 8%)</td><td class="bt-val bt-neg">- ${fmtLKR(rec.epf_employee)}</td></tr>
          <tr><td class="bt-label">ETF (Employer 3%)</td><td class="bt-val" style="color:#6b7280;">${fmtLKR(rec.etf)}</td></tr>
          <tr><td class="bt-label">Other Deductions</td><td class="bt-val bt-neg">- ${fmtLKR(rec.other_deductions)}</td></tr>
          <tr><td class="bt-label bt-pos">Net Pay</td><td class="bt-val bt-pos">${fmtLKR(rec.net_pay)}</td></tr>
        </table>
      </div>
    </div>
    <div id="pPayNotes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title">Notes</div>
        <p style="font-size:.875rem;color:#374151;">${rec.notes || '<span style="color:#9ca3af;">No notes.</span>'}</p>
      </div>
    </div>
  `;

  document.getElementById('payDrawerFooter').innerHTML = `
    <button class="btn btn-secondary" onclick="closePayDrawer()">Close</button>
    <button class="btn btn-primary" onclick="closePayDrawer();openEditModal('${rec.id}')">Edit</button>
    <button class="btn btn-danger" onclick="closePayDrawer();openDeleteModal('${rec.id}')">Delete</button>
  `;

  document.getElementById('drawerOverlay')?.classList.add('open');
  document.getElementById('payDrawer')?.classList.add('open');
}

function closePayDrawer() {
  document.getElementById('drawerOverlay')?.classList.remove('open');
  document.getElementById('payDrawer')?.classList.remove('open');
}

function switchPayTab(btn, tabId) {
  const drawer = btn.closest('.vd-header, .pay-drawer');
  drawer?.querySelectorAll('.dtab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.dtab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
}

// ── Delete ───────────────────────────────────────────────────────────────────
function openDeleteModal(id) {
  const rec = allPayroll.find(p => p.id === id);
  if (!rec) return;
  deletingId = id;
  document.getElementById('deletePayRef').textContent = `${rec.id} — ${rec.employee_name} (${rec.period})`;
  document.getElementById('deletePayModal').classList.add('open');
}
function closeDeleteModal() {
  document.getElementById('deletePayModal')?.classList.remove('open');
  deletingId = null;
}
function confirmDeletePayslip() {
  if (!deletingId) return;
  allPayroll = allPayroll.filter(p => p.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Payslip deleted.', 'success');
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
  loadPayroll();

  document.getElementById('btnExport')?.addEventListener('click', openExportModal);
  document.getElementById('btnRunPayroll')?.addEventListener('click', openAddModal);
  document.getElementById('paySearch')?.addEventListener('input', applyFilters);
  document.getElementById('filterStatus')?.addEventListener('change', applyFilters);
  document.getElementById('filterPeriod')?.addEventListener('change', applyFilters);
  document.getElementById('filterDept')?.addEventListener('change', applyFilters);
  document.getElementById('payForm')?.addEventListener('submit', savePayslip);

  // Auto-compute listeners
  ['fBasicSalary', 'fAllowances', 'fOtherDeductions'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', recomputePayModal);
  });

  // Backdrop close
  document.getElementById('exportModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('exportModal')) closeExportModal();
  });
  document.getElementById('payModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('payModal')) closePayModal();
  });
  document.getElementById('deletePayModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('deletePayModal')) closeDeleteModal();
  });
  document.getElementById('drawerOverlay')?.addEventListener('click', closePayDrawer);
});
"""

def build_js():
    js_dir = makedirs("erp", "payroll")
    out_path = os.path.join(js_dir, "payroll.js")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(JS)
    print(f"  Created: {out_path}")

# ---------------------------------------------------------------------------
# 4. erp/payroll/index.html
# ---------------------------------------------------------------------------
HTML = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Payroll — LankaCommerce Cloud</title>
  <link rel="stylesheet" href="../../assets/css/variables.css" />
  <link rel="stylesheet" href="../../assets/css/base.css" />
  <link rel="stylesheet" href="../../assets/css/components.css" />
  <link rel="stylesheet" href="../../assets/css/layout.css" />
  <link rel="stylesheet" href="../erp.css" />
  <link rel="stylesheet" href="payroll.css" />
</head>
<body>

<!-- Sidebar -->
<aside id="sidebar" class="sidebar"></aside>
<div id="sidebarOverlay" class="sidebar-overlay"></div>

<!-- Main Wrapper -->
<div id="mainWrapper" class="main-wrapper">

  <!-- Top Bar -->
  <header id="erpTopBar" class="erp-top-bar" data-page-title="Payroll"></header>

  <!-- Page Content -->
  <main class="page-content">

    <!-- Page Header -->
    <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:.75rem;">
      <div>
        <h1 style="font-size:1.4rem;font-weight:700;color:#111827;margin:0;">Payroll</h1>
        <p style="font-size:.875rem;color:#6b7280;margin:.25rem 0 0;">Manage employee payslips and salary runs</p>
      </div>
      <div style="display:flex;gap:.75rem;">
        <button id="btnExport" class="btn btn-outline">⬇ Export</button>
        <button id="btnRunPayroll" class="btn btn-primary">+ Add Payslip</button>
      </div>
    </div>

    <!-- KPI Grid -->
    <div class="kpi-grid">
      <div class="kpi-card">
        <div class="kpi-icon blue">💰</div>
        <div class="kpi-info">
          <div class="kpi-val" id="statTotalPayroll" style="font-size:1.15rem;">₨ 0</div>
          <div class="kpi-label">Total Net Payroll</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon green">✅</div>
        <div class="kpi-info">
          <div class="kpi-val" id="statPaid">0</div>
          <div class="kpi-label">Paid</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon yellow">⏳</div>
        <div class="kpi-info">
          <div class="kpi-val" id="statPending">0</div>
          <div class="kpi-label">Pending / Draft</div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon purple">📅</div>
        <div class="kpi-info">
          <div class="kpi-val" id="statNetThisMonth" style="font-size:1.15rem;">₨ 0</div>
          <div class="kpi-label">Last Period Net</div>
        </div>
      </div>
    </div>

    <!-- Filter Bar -->
    <div class="filter-bar">
      <div class="search-wrap">
        <span class="search-icon">🔍</span>
        <input type="text" id="paySearch" placeholder="Search by name or ID…" />
      </div>
      <select id="filterStatus">
        <option value="">All Statuses</option>
        <option value="paid">Paid</option>
        <option value="pending">Pending</option>
        <option value="draft">Draft</option>
      </select>
      <select id="filterPeriod">
        <option value="">All Periods</option>
        <option value="Jan 2025">Jan 2025</option>
        <option value="Feb 2025">Feb 2025</option>
        <option value="Mar 2025">Mar 2025</option>
        <option value="Apr 2025">Apr 2025</option>
        <option value="May 2025">May 2025</option>
      </select>
      <select id="filterDept">
        <option value="">All Departments</option>
        <option value="Sales">Sales</option>
        <option value="Warehouse">Warehouse</option>
        <option value="IT">IT</option>
        <option value="Accounting">Accounting</option>
        <option value="Administration">Administration</option>
        <option value="Delivery">Delivery</option>
        <option value="HR">HR</option>
      </select>
      <button class="btn-clear-filter" onclick="clearFilters()">✕ Clear</button>
    </div>

    <!-- Table Card -->
    <div class="table-card">
      <table class="data-table">
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Period</th>
            <th>Gross Pay</th>
            <th>EPF (8%)</th>
            <th>Net Pay</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody id="payBody">
          <tr><td colspan="8" style="text-align:center;padding:2rem;color:#9ca3af;">Loading…</td></tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div class="pagination-bar">
      <span id="paginationInfo">Showing 0–0 of 0 payslips</span>
      <div class="pagination-btns" id="paginationBtns"></div>
    </div>

  </main>
</div><!-- /mainWrapper -->

<!-- ══════════════════════════════════════════════════════ EXPORT MODAL -->
<div id="exportModal" class="modal-overlay">
  <div class="modal-box" style="max-width:380px;">
    <div class="modal-header">
      <h3>Export Payroll</h3>
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

<!-- ══════════════════════════════════════════════════════ ADD/EDIT PAYSLIP MODAL -->
<div id="payModal" class="modal-overlay">
  <div class="modal-box" style="max-width:600px;">
    <div class="modal-header">
      <h3 id="payModalTitle">Add Payslip</h3>
      <button class="modal-close" onclick="closePayModal()">✕</button>
    </div>
    <form id="payForm" onsubmit="savePayslip(event)">
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
            <label for="fDepartment">Department</label>
            <select id="fDepartment">
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
            <label for="fPeriod">Period *</label>
            <input type="text" id="fPeriod" placeholder="e.g. Jan 2025" required />
          </div>
          <div class="form-group">
            <label for="fBasicSalary">Basic Salary (₨)</label>
            <input type="number" id="fBasicSalary" placeholder="e.g. 85000" min="0" step="500" />
          </div>
          <div class="form-group">
            <label for="fAllowances">Allowances (₨)</label>
            <input type="number" id="fAllowances" placeholder="e.g. 5000" min="0" step="500" value="0" />
          </div>
          <div class="form-group">
            <label for="fOtherDeductions">Other Deductions (₨)</label>
            <input type="number" id="fOtherDeductions" placeholder="e.g. 1000" min="0" step="500" value="0" />
          </div>
          <div class="form-group">
            <label for="fPaymentDate">Payment Date</label>
            <input type="date" id="fPaymentDate" />
          </div>
          <div class="form-group">
            <label for="fStatus">Status *</label>
            <select id="fStatus" required>
              <option value="">Select status</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div class="form-group full">
            <label for="fNotes">Notes</label>
            <textarea id="fNotes" placeholder="Optional notes…"></textarea>
          </div>
          <!-- Auto-computed summary -->
          <div class="form-group full">
            <label>Computed Summary</label>
            <div id="payComputed">
              <div class="pc-row"><span class="pc-label">Gross Pay</span><span>₨ 0</span></div>
              <div class="pc-row"><span class="pc-label">EPF (8%)</span><span style="color:#ef4444;">- ₨ 0</span></div>
              <div class="pc-row"><span class="pc-label">ETF (3% employer)</span><span style="color:#6b7280;">₨ 0</span></div>
              <div class="pc-row"><span class="pc-label">Other Deductions</span><span style="color:#ef4444;">- ₨ 0</span></div>
              <div class="pc-row"><span class="pc-label">Net Pay</span><span style="color:#15803d;">₨ 0</span></div>
            </div>
          </div>
        </div>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" onclick="closePayModal()">Cancel</button>
        <button type="submit" id="payModalSaveBtn" class="btn btn-primary">Save Payslip</button>
      </div>
    </form>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════ DELETE MODAL -->
<div id="deletePayModal" class="modal-overlay">
  <div class="modal-box" style="max-width:420px;">
    <div class="modal-header">
      <h3>Delete Payslip</h3>
      <button class="modal-close" onclick="closeDeleteModal()">✕</button>
    </div>
    <div class="modal-body">
      <p style="font-size:.875rem;color:#374151;">Are you sure you want to delete this payslip?</p>
      <p style="font-size:.8rem;color:#6b7280;margin-top:.5rem;font-weight:600;" id="deletePayRef"></p>
      <p style="font-size:.8rem;color:#ef4444;margin-top:.75rem;">This action cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn btn-danger" onclick="confirmDeletePayslip()">Delete</button>
    </div>
  </div>
</div>

<!-- ══════════════════════════════════════════════════════ DRAWER OVERLAY -->
<div id="drawerOverlay" class="drawer-overlay"></div>

<!-- ══════════════════════════════════════════════════════ PAYROLL DRAWER -->
<div id="payDrawer" class="pay-drawer">
  <div class="vd-header" id="payDrawerHeader"></div>
  <div class="vd-body" id="payDrawerBody"></div>
  <div class="vd-footer" id="payDrawerFooter"></div>
</div>

<!-- Toast Container -->
<div id="toastContainer" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;min-width:280px;"></div>

<!-- Scripts -->
<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="../../assets/js/toast.js"></script>
<script src="payroll.js"></script>
</body>
</html>
"""

def build_html():
    html_dir = makedirs("erp", "payroll")
    out_path = os.path.join(html_dir, "index.html")
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(HTML)
    print(f"  Created: {out_path}")

# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    print("Building Payroll module…")
    build_json()
    build_css()
    build_js()
    build_html()
    print("Done.")
