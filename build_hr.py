"""
build_hr.py — LankaCommerce Cloud ERP
Generates / overwrites all HR module files:
  1. UI-Prototype/data/employees.json
  2. UI-Prototype/erp/hr/hr.css
  3. UI-Prototype/erp/hr/hr.js
  4. UI-Prototype/erp/hr/index.html
"""

import json, os, random
from pathlib import Path

ROOT = Path(__file__).parent / "UI-Prototype"

# ─────────────────────────────────────────────────────────────
# 1. DATA:  employees.json
# ─────────────────────────────────────────────────────────────

random.seed(42)

FIRST_NAMES_M = [
    "Nuwan","Ravindra","Pradeep","Chaminda","Saman","Kasun","Thilak",
    "Chinthaka","Mahesh","Dhanuka","Arjuna","Buddika","Hasitha","Janaka",
    "Lakshitha","Malith","Nimal","Roshan","Supun","Tharinda",
]
FIRST_NAMES_F = [
    "Dilani","Samanthi","Amali","Nishani","Ruvini","Sachini","Tharindi",
    "Upeksha","Vindya","Wasana","Chathurika","Dilhani","Eranga","Fathima",
    "Gayani","Hiruni","Ishani","Janani","Kavindya","Lasitha",
]
LAST_NAMES = [
    "Karunaratne","Perera","Fernando","Rajapaksa","Mendis","Wickramasinghe",
    "Silva","Jayawardena","Bandara","Dissanayake","Gunawardena","Herath",
    "Kumara","Liyanage","Madushanka","Nanayakkara","Obeyesekere","Pathirana",
    "Ranaweera","Senanayake","Thilakarathna","Udawatta","Vithanage","Weerasekara",
    "Yatawara","Zoysa","Abeysekera","Bogahawatte","Chandrasekara","Dalugama",
]

DEPT_DESIG = {
    "Sales":          ["Senior Sales Executive","Sales Representative","Sales Manager","Account Executive","Business Development Executive"],
    "Warehouse":      ["Stock Controller","Warehouse Supervisor","Inventory Officer","Receiving Clerk","Dispatch Coordinator"],
    "IT":             ["Systems Administrator","Software Developer","Network Engineer","IT Support Technician","Database Administrator"],
    "Accounting":     ["Finance Manager","Accountant","Accounts Payable Officer","Financial Analyst","Audit Executive"],
    "Administration": ["HR Coordinator","Office Manager","Administrative Assistant","Receptionist","Operations Coordinator"],
    "Delivery":       ["Delivery Driver","Logistics Coordinator","Fleet Manager","Courier Officer","Dispatch Rider"],
    "HR":             ["HR Manager","Recruitment Officer","Training Coordinator","Payroll Officer","HR Executive"],
}

PHONE_PREFIXES = ["70","71","72","74","75","76","77","78"]

def rand_phone():
    prefix = random.choice(PHONE_PREFIXES)
    mid = random.randint(100, 999)
    end = random.randint(1000, 9999)
    return f"+94 {prefix} {mid} {end}"

def rand_nic():
    if random.random() < 0.55:          # 12-digit NIC (new format)
        year = random.randint(1975, 2000)
        day  = random.randint(1, 366)
        seq  = random.randint(0, 9999)
        return f"{year}{str(day).zfill(3)}{str(seq).zfill(4)}"
    else:                               # old 9+V format
        year2 = str(random.randint(75, 99))
        day   = random.randint(1, 366)
        seq   = random.randint(0, 9999)
        return f"{year2}{str(day).zfill(3)}{str(seq).zfill(4)}V"

def rand_date(y_from, y_to):
    year  = random.randint(y_from, y_to)
    month = random.randint(1, 12)
    day   = random.randint(1, 28)
    return f"{year}-{month:02d}-{day:02d}"

# ── First 7 known employees ──
base_employees = [
    {
        "id": "EMP-001",
        "first_name": "Nuwan",   "last_name": "Karunaratne",
        "email": "nuwankarunaratne@lcc.lk",
        "phone": "+94 77 234 5678",
        "nic": "199023401234",
        "gender": "male",
        "dob": "1990-03-14",
        "department": "Sales",
        "designation": "Senior Sales Executive",
        "employment_type": "full-time",
        "status": "active",
        "hire_date": "2022-01-12",
        "basic_salary": 145000,
    },
    {
        "id": "EMP-002",
        "first_name": "Dilani",  "last_name": "Perera",
        "email": "dilaniperera@lcc.lk",
        "phone": "+94 71 345 6789",
        "nic": "198534503456V",
        "gender": "female",
        "dob": "1985-06-20",
        "department": "Accounting",
        "designation": "Finance Manager",
        "employment_type": "full-time",
        "status": "active",
        "hire_date": "2021-03-03",
        "basic_salary": 210000,
    },
    {
        "id": "EMP-003",
        "first_name": "Ravindra", "last_name": "Fernando",
        "email": "ravindfernando@lcc.lk",
        "phone": "+94 76 456 7890",
        "nic": "199256704567",
        "gender": "male",
        "dob": "1992-08-05",
        "department": "IT",
        "designation": "Systems Administrator",
        "employment_type": "full-time",
        "status": "active",
        "hire_date": "2023-06-17",
        "basic_salary": 175000,
    },
    {
        "id": "EMP-004",
        "first_name": "Samanthi","last_name": "Rajapaksa",
        "email": "samanthirajapaksa@lcc.lk",
        "phone": "+94 70 567 8901",
        "nic": "198867805678V",
        "gender": "female",
        "dob": "1988-11-29",
        "department": "Warehouse",
        "designation": "Stock Controller",
        "employment_type": "full-time",
        "status": "on_leave",
        "hire_date": "2022-08-29",
        "basic_salary": 95000,
    },
    {
        "id": "EMP-005",
        "first_name": "Pradeep","last_name": "Mendis",
        "email": "pradeepmendis@lcc.lk",
        "phone": "+94 75 678 9012",
        "nic": "199567806789",
        "gender": "male",
        "dob": "1995-04-12",
        "department": "Sales",
        "designation": "Sales Representative",
        "employment_type": "full-time",
        "status": "active",
        "hire_date": "2024-02-05",
        "basic_salary": 85000,
    },
    {
        "id": "EMP-006",
        "first_name": "Amali","last_name": "Wickramasinghe",
        "email": "amaliwickramasinghe@lcc.lk",
        "phone": "+94 72 789 0123",
        "nic": "198778907890V",
        "gender": "female",
        "dob": "1987-09-18",
        "department": "Administration",
        "designation": "HR Coordinator",
        "employment_type": "full-time",
        "status": "active",
        "hire_date": "2020-11-20",
        "basic_salary": 125000,
    },
    {
        "id": "EMP-007",
        "first_name": "Chaminda","last_name": "Silva",
        "email": "charindasilva@lcc.lk",
        "phone": "+94 78 890 1234",
        "nic": "199389001234",
        "gender": "male",
        "dob": "1993-07-14",
        "department": "Delivery",
        "designation": "Delivery Driver",
        "employment_type": "full-time",
        "status": "inactive",
        "hire_date": "2023-04-14",
        "basic_salary": 65000,
    },
]

# ── Generate 18 more random employees ──
departments = list(DEPT_DESIG.keys())
used_names = {(e["first_name"], e["last_name"]) for e in base_employees}
inactive_count = 1   # EMP-007 already inactive
on_leave_count = 1   # EMP-004 already on_leave

# Pre-decide which slots (8..25) will be non-active to guarantee spec totals
# Target: 2 inactive total, 2 on_leave total → need 1 more inactive, 1 more on_leave
_slots = list(range(8, 26))            # slots 8–25 (18 slots)
random.shuffle(_slots)
_force_inactive = {_slots[0]}          # 1 slot forced inactive
_force_on_leave = {_slots[1]}          # 1 slot forced on_leave

for i in range(8, 26):
    gender = random.choice(["male", "female"])
    fname_pool = FIRST_NAMES_M if gender == "male" else FIRST_NAMES_F
    # pick unique name combo
    for _ in range(200):
        fn = random.choice(fname_pool)
        ln = random.choice(LAST_NAMES)
        if (fn, ln) not in used_names:
            used_names.add((fn, ln))
            break

    dept = random.choice(departments)
    desig = random.choice(DEPT_DESIG[dept])
    emp_type = random.choices(
        ["full-time", "part-time", "contract"],
        weights=[70, 15, 15]
    )[0]

    # Deterministic status assignment to meet spec totals
    if i in _force_inactive:
        status = "inactive"
        inactive_count += 1
    elif i in _force_on_leave:
        status = "on_leave"
        on_leave_count += 1
    else:
        status = "active"

    salary = random.randint(45, 250) * 1000
    # adjust for seniority hints
    if "Manager" in desig or "Senior" in desig or "Supervisor" in desig:
        salary = max(salary, 110000)

    email = (fn + ln).lower().replace(" ", "") + "@lcc.lk"

    base_employees.append({
        "id": f"EMP-{i:03d}",
        "first_name": fn,
        "last_name": ln,
        "email": email,
        "phone": rand_phone(),
        "nic": rand_nic(),
        "gender": gender,
        "dob": rand_date(1975, 2000),
        "department": dept,
        "designation": desig,
        "employment_type": emp_type,
        "status": status,
        "hire_date": rand_date(2018, 2024),
        "basic_salary": salary,
    })

employees_data = {"employees": base_employees}

# ─────────────────────────────────────────────────────────────
# 2. CSS: erp/hr/hr.css
# ─────────────────────────────────────────────────────────────

HR_CSS = r"""/* ================================================================
   hr.css — HR & Payroll page-specific styles
   LankaCommerce Cloud ERP
   ================================================================ */

/* ── KPI Row ── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.kpi-card {
  background: #fff;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  position: relative;
  overflow: hidden;
}
.kpi-icon {
  float: right;
  width: 44px;
  height: 44px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
}
.icon-orange { background: #fff7ed; color: #f97316; }
.icon-green  { background: #f0fdf4; color: #16a34a; }
.icon-yellow { background: #fefce8; color: #ca8a04; }
.icon-blue   { background: #eff6ff; color: #2563eb; }
.icon-red    { background: #fef2f2; color: #dc2626; }
.kpi-label {
  font-size: .75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: .04em;
  color: var(--color-neutral-500);
  margin-bottom: .5rem;
  clear: both;
}
.kpi-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--color-neutral-900);
  line-height: 1;
}
.kpi-sub {
  font-size: .75rem;
  color: var(--color-neutral-500);
  margin-top: .375rem;
}

/* ── Tabs ── */
.tabs-bar {
  display: flex;
  gap: .25rem;
  border-bottom: 2px solid var(--color-neutral-200);
  margin-bottom: 1.25rem;
}
.tab-btn {
  padding: .625rem 1.125rem;
  font-size: .875rem;
  font-weight: 500;
  color: var(--color-neutral-600);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: all .15s;
  white-space: nowrap;
}
.tab-btn:hover { color: var(--primary, #f97316); }
.tab-btn.active {
  color: var(--primary, #f97316);
  border-bottom-color: var(--primary, #f97316);
  font-weight: 600;
}
.tab-panel { display: none; }
.tab-panel.active { display: block; }

/* ── Toolbar ── */
.toolbar {
  display: flex;
  align-items: center;
  gap: .625rem;
  flex-wrap: wrap;
  background: #fff;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: .75rem 1rem;
  margin-bottom: 1rem;
}
.toolbar-search {
  position: relative;
  flex: 1;
  min-width: 220px;
}
.toolbar-search i {
  position: absolute;
  left: .75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-neutral-400);
  font-size: .8125rem;
  pointer-events: none;
}
.toolbar-search input {
  width: 100%;
  padding: .5rem .75rem .5rem 2.25rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius);
  font-size: .875rem;
  color: var(--color-neutral-800);
  background: var(--color-neutral-50);
  outline: none;
  transition: border-color .15s;
}
.toolbar-search input:focus {
  border-color: var(--primary, #f97316);
  background: #fff;
}
.toolbar select {
  padding: .5rem 2rem .5rem .75rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius);
  font-size: .875rem;
  color: var(--color-neutral-700);
  background: var(--color-neutral-50)
    url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236b7280' d='M6 8L1 3h10z'/%3E%3C/svg%3E")
    no-repeat right .6rem center;
  appearance: none;
  outline: none;
  cursor: pointer;
  min-width: 140px;
}
.toolbar select:focus { border-color: var(--primary, #f97316); }

/* ── Data Table ── */
.data-table-wrap {
  background: #fff;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  overflow: hidden;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
}
.data-table thead th {
  background: var(--color-neutral-50);
  padding: .75rem 1rem;
  font-size: .75rem;
  font-weight: 600;
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: .04em;
  text-align: left;
  border-bottom: 1px solid var(--color-neutral-200);
  white-space: nowrap;
}
.data-table tbody tr:hover { background: var(--color-neutral-50); }
.data-table tbody td {
  padding: .875rem 1rem;
  font-size: .875rem;
  color: var(--color-neutral-700);
  border-bottom: 1px solid var(--color-neutral-100);
  vertical-align: middle;
}
.data-table tbody tr:last-child td { border-bottom: none; }

/* ── Employee Cell ── */
.emp-cell { display: flex; align-items: center; gap: .75rem; }
.emp-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: .875rem;
  font-weight: 700;
  color: #fff;
}
.emp-name { font-weight: 600; color: var(--color-neutral-900); font-size: .875rem; }
.emp-email { font-size: .75rem; color: var(--color-neutral-500); margin-top: .1rem; }
.emp-id { font-family: monospace; font-size: .8125rem; color: var(--primary, #f97316); font-weight: 600; }

/* ── Badges ── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: .3rem;
  font-size: .7rem;
  font-weight: 600;
  padding: .2rem .55rem;
  border-radius: 9999px;
  white-space: nowrap;
}
.badge-active   { background: #dcfce7; color: #16a34a; }
.badge-inactive { background: #fee2e2; color: #dc2626; }
.badge-leave    { background: #fef9c3; color: #a16207; }
.badge-contract { background: #dbeafe; color: #1d4ed8; }

/* ── Row Actions ── */
.row-actions { display: flex; align-items: center; gap: .375rem; }
.row-btn {
  width: 30px;
  height: 30px;
  border-radius: var(--radius);
  border: 1px solid var(--color-neutral-200);
  background: #fff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-neutral-500);
  font-size: .8rem;
  transition: all .15s;
}
.row-btn:hover {
  border-color: var(--primary, #f97316);
  color: var(--primary, #f97316);
  background: #fff7ed;
}
.row-btn.danger:hover {
  border-color: #ef4444;
  color: #ef4444;
  background: #fef2f2;
}

/* ── Pagination ── */
.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .75rem 1rem;
  font-size: .83rem;
  color: var(--color-neutral-500);
  background: #fff;
  border-top: 1px solid var(--color-neutral-100);
}
.pagination-btns { display: flex; gap: .3rem; flex-wrap: wrap; }
.pagination-btns button {
  background: #fff;
  border: 1px solid var(--color-neutral-200);
  border-radius: 6px;
  padding: .3rem .65rem;
  font-size: .82rem;
  color: var(--color-neutral-600);
  cursor: pointer;
  transition: border-color .15s, background .15s;
  min-width: 32px;
}
.pagination-btns button:hover {
  border-color: var(--primary, #f97316);
  color: var(--primary, #f97316);
}
.pagination-btns button.page-active {
  background: var(--primary, #f97316);
  color: #fff;
  border-color: var(--primary, #f97316);
  font-weight: 600;
}
.pagination-btns button:disabled { opacity: .4; cursor: not-allowed; }

/* ── Coming Soon ── */
.coming-soon {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: #fff;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  color: var(--color-neutral-400);
  gap: .75rem;
}
.coming-soon i { font-size: 2.5rem; }
.coming-soon p { font-size: .9375rem; font-weight: 500; }

/* ================================================================
   MODAL OVERLAY — Override components.css
   ================================================================ */
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

.modal {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,.18);
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  margin: auto;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: .9rem 1.25rem;
  border-bottom: 1px solid var(--color-neutral-100);
  position: sticky;
  top: 0;
  background: #fff;
  z-index: 1;
}
.modal-title { font-size: 1rem; font-weight: 600; }
.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-500);
  font-size: .9rem;
}
.modal-close:hover { background: var(--color-neutral-100); }
.modal-body { padding: 1.25rem; }
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: .5rem;
  padding: .9rem 1.25rem;
  border-top: 1px solid var(--color-neutral-100);
  position: sticky;
  bottom: 0;
  background: #fff;
}

/* ── Form helpers ── */
.form-section-title {
  font-size: .7rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--color-neutral-400);
  margin: 1rem 0 .75rem;
  padding-bottom: .4rem;
  border-bottom: 1px solid var(--color-neutral-100);
}
.form-group { margin-bottom: .875rem; }
.form-group label {
  display: block;
  font-size: .78rem;
  font-weight: 600;
  color: var(--color-neutral-700);
  margin-bottom: .3rem;
}
.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius);
  padding: .5rem .75rem;
  font-size: .875rem;
  color: var(--color-neutral-800);
  background: #fff;
  outline: none;
  transition: border-color .15s;
  font-family: inherit;
}
.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: var(--primary, #f97316);
  box-shadow: 0 0 0 3px rgba(249,115,22,.1);
}
.form-group textarea { resize: vertical; min-height: 80px; }
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: .75rem; }
.form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: .75rem; }
@media (max-width:640px) {
  .form-grid-2, .form-grid-3 { grid-template-columns: 1fr; }
}

/* ── Radio group ── */
.radio-group { display: flex; gap: .5rem; flex-wrap: wrap; margin-top: .25rem; }
.radio-option {
  display: flex;
  align-items: center;
  gap: .5rem;
  padding: .45rem .75rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: 8px;
  cursor: pointer;
  font-size: .83rem;
  transition: border-color .15s, background .15s;
}
.radio-option:hover { border-color: var(--primary, #f97316); background: #fff7ed; }
.radio-option input[type="radio"] { accent-color: var(--primary, #f97316); }

/* ── Danger button ── */
.btn-danger {
  background: #dc2626;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: .45rem 1rem;
  font-size: .83rem;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: .4rem;
  transition: background .15s;
}
.btn-danger:hover { background: #b91c1c; }

/* ================================================================
   DRAWER OVERLAY
   ================================================================ */
.drawer-overlay {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 490;
  background: rgba(0,0,0,.3);
}
.drawer-overlay.open { display: block; }

/* ── Employee Drawer ── */
.employee-drawer {
  position: fixed;
  right: -500px;
  top: 0;
  bottom: 0;
  width: 480px;
  max-width: 100vw;
  background: #fff;
  box-shadow: -4px 0 24px rgba(0,0,0,.14);
  z-index: 495;
  display: flex;
  flex-direction: column;
  transition: right .28s cubic-bezier(.4,0,.2,1);
  overflow: hidden;
}
.employee-drawer.open { right: 0; }

/* Drawer structural areas */
.vd-header { flex-shrink: 0; }
.vd-body   { flex: 1; overflow-y: auto; }
.vd-footer {
  flex-shrink: 0;
  display: flex;
  gap: .5rem;
  padding: .8rem 1.25rem;
  border-top: 1px solid var(--color-neutral-100);
}

/* Drawer profile strip */
.drawer-profile {
  display: flex;
  align-items: center;
  gap: .9rem;
  padding: 1.2rem 1.25rem 1rem;
  border-bottom: 1px solid var(--color-neutral-100);
}
.emp-drawer-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 700;
  color: #fff;
  flex-shrink: 0;
}
.drawer-emp-id {
  font-size: .75rem;
  color: var(--color-neutral-400);
  margin-top: .1rem;
  font-family: monospace;
}
.drawer-company { font-weight: 600; font-size: .95rem; line-height: 1.3; }
.drawer-close {
  margin-left: auto;
  background: none;
  border: none;
  cursor: pointer;
  width: 30px;
  height: 30px;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-500);
  font-size: .9rem;
  flex-shrink: 0;
}
.drawer-close:hover { background: var(--color-neutral-100); }

/* Drawer tabs */
.drawer-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-neutral-100);
  flex-shrink: 0;
  padding: 0 1.25rem;
}
.dtab {
  background: none;
  border: none;
  cursor: pointer;
  padding: .65rem .85rem;
  font-size: .82rem;
  font-weight: 500;
  color: var(--color-neutral-500);
  border-bottom: 2px solid transparent;
  margin-bottom: -1px;
  transition: color .15s, border-color .15s;
}
.dtab:hover { color: var(--primary, #f97316); }
.dtab.active {
  color: var(--primary, #f97316);
  border-bottom-color: var(--primary, #f97316);
  font-weight: 600;
}

/* Drawer panes */
.dtab-pane { display: none; padding: 1rem 1.25rem; }
.dtab-pane.active { display: block; }

.drawer-section { margin-bottom: 1.2rem; }
.drawer-section-title {
  font-size: .68rem;
  font-weight: 700;
  letter-spacing: .06em;
  text-transform: uppercase;
  color: var(--color-neutral-400);
  margin-bottom: .6rem;
}
.drawer-field {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: .35rem 0;
  border-bottom: 1px solid var(--color-neutral-50);
}
.drawer-field:last-child { border-bottom: none; }
.df-label { font-size: .78rem; color: var(--color-neutral-500); flex-shrink: 0; }
.df-val { font-size: .82rem; font-weight: 500; color: var(--color-neutral-700); text-align: right; word-break: break-word; max-width: 65%; }

/* Drawer KPI mini boxes */
.drawer-kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: .6rem; margin-bottom: 1rem; }
.drawer-kpi-box {
  background: var(--color-neutral-50);
  border-radius: 10px;
  padding: .8rem;
  text-align: center;
}
.drawer-kpi-val { font-size: 1.05rem; font-weight: 700; color: var(--color-neutral-700); }
.drawer-kpi-label { font-size: .7rem; color: var(--color-neutral-400); margin-top: .2rem; }

/* Responsive */
@media (max-width:768px) {
  .kpi-row { grid-template-columns: 1fr 1fr; }
}
@media (max-width:480px) {
  .kpi-row { grid-template-columns: 1fr; }
  .employee-drawer { width: 100vw; }
}
"""

# ─────────────────────────────────────────────────────────────
# 3. JS: erp/hr/hr.js
# ─────────────────────────────────────────────────────────────

HR_JS = r"""/* ================================================================
   hr.js — HR & Payroll Module
   LankaCommerce Cloud ERP
   ================================================================ */
'use strict';

/* ─── State ─── */
let allEmployees      = [];
let filteredEmployees = [];
let editingId         = null;
let deletingId        = null;
let currentPage       = 1;
const PAGE_SIZE       = 8;

/* ─── Constants ─── */
const COLORS = [
  '#f97316','#8b5cf6','#0ea5e9','#22c55e',
  '#ef4444','#f59e0b','#06b6d4','#ec4899','#6366f1'
];

/* ─── Helpers ─── */
const fmtLKR = n => '₨ ' + Number(n).toLocaleString('en-LK');
const fmtDate = d => d ? new Date(d + 'T00:00:00').toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '—';
const empColor = emp => COLORS[parseInt((emp.id||'EMP-000').replace('EMP-',''),10) % COLORS.length];
const empInitials = emp => ((emp.first_name||'?')[0] + (emp.last_name||'?')[0]).toUpperCase();

function statusBadge(status) {
  const map = {
    active:   '<span class="badge badge-active"><i class="fa-solid fa-circle" style="font-size:.45rem;"></i> Active</span>',
    inactive: '<span class="badge badge-inactive"><i class="fa-solid fa-circle" style="font-size:.45rem;"></i> Inactive</span>',
    on_leave: '<span class="badge badge-leave"><i class="fa-solid fa-circle" style="font-size:.45rem;"></i> On Leave</span>',
  };
  return map[status] || `<span class="badge">${status}</span>`;
}

function typeBadge(type) {
  if (type === 'contract') return '<span class="badge badge-contract">Contract</span>';
  if (type === 'part-time') return '<span class="badge" style="background:#f3e8ff;color:#7c3aed;">Part-time</span>';
  return '';
}

/* ─── Load Data ─── */
async function loadEmployees() {
  try {
    const resp = await fetch('../../data/employees.json?v=' + Date.now());
    const data = await resp.json();
    allEmployees = (data.employees || []).map(e => ({ ...e }));
    // Merge localStorage edits / additions
    const saved = JSON.parse(localStorage.getItem('lcc_employees') || '[]');
    saved.forEach(se => {
      const idx = allEmployees.findIndex(e => e.id === se.id);
      if (idx >= 0) allEmployees[idx] = se;
      else allEmployees.push(se);
    });
    applyFilters();
  } catch (err) {
    console.error('Failed to load employees:', err);
    showToast('Failed to load employee data.', 'error');
  }
}

function saveLocal() {
  localStorage.setItem('lcc_employees', JSON.stringify(allEmployees));
}

/* ─── Stats ─── */
function updateStats() {
  const total    = allEmployees.length;
  const active   = allEmployees.filter(e => e.status === 'active').length;
  const onLeave  = allEmployees.filter(e => e.status === 'on_leave').length;
  const payroll  = allEmployees
    .filter(e => e.status === 'active' || e.status === 'on_leave')
    .reduce((s, e) => s + (Number(e.basic_salary) || 0), 0);

  const el = id => document.getElementById(id);
  if (el('statTotalEmployees'))  el('statTotalEmployees').textContent  = total;
  if (el('statActiveEmployees')) el('statActiveEmployees').textContent = active;
  if (el('statOnLeave'))         el('statOnLeave').textContent         = onLeave;
  if (el('statMonthlyPayroll'))  el('statMonthlyPayroll').textContent  = fmtLKR(payroll);
}

/* ─── Filters ─── */
function applyFilters() {
  const q    = (document.getElementById('empSearch').value || '').toLowerCase().trim();
  const dept = document.getElementById('filterDept').value;
  const stat = document.getElementById('filterStatus').value;
  const type = document.getElementById('filterType').value;

  filteredEmployees = allEmployees.filter(e => {
    const fullName = `${e.first_name} ${e.last_name}`.toLowerCase();
    const matchQ    = !q || [fullName, e.id, e.email, e.phone]
                             .some(f => (f||'').toLowerCase().includes(q));
    const matchDept = !dept || e.department === dept;
    const matchStat = !stat || e.status === stat;
    const matchType = !type || e.employment_type === type;
    return matchQ && matchDept && matchStat && matchType;
  });

  currentPage = 1;
  renderTable();
  updateStats();
}

function clearFilters() {
  document.getElementById('empSearch').value     = '';
  document.getElementById('filterDept').value    = '';
  document.getElementById('filterStatus').value  = '';
  document.getElementById('filterType').value    = '';
  applyFilters();
}

/* ─── Render Table ─── */
function renderTable() {
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filteredEmployees.slice(start, start + PAGE_SIZE);
  const tbody = document.getElementById('empBody');

  if (!tbody) return;

  if (page.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2.5rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-users" style="font-size:2rem;display:block;margin-bottom:.6rem;opacity:.25;"></i>
      No employees found matching your filters.
    </td></tr>`;
  } else {
    tbody.innerHTML = page.map(emp => {
      const color    = empColor(emp);
      const initials = empInitials(emp);
      return `<tr>
        <td>
          <div class="emp-cell">
            <div class="emp-avatar" style="background:${color};">${initials}</div>
            <div>
              <div class="emp-name">${emp.first_name} ${emp.last_name}</div>
              <div class="emp-email">${emp.email}</div>
            </div>
          </div>
        </td>
        <td><span class="emp-id">${emp.id}</span></td>
        <td>${emp.department}</td>
        <td>${emp.designation}</td>
        <td style="white-space:nowrap;">${emp.phone}</td>
        <td style="white-space:nowrap;">${fmtDate(emp.hire_date)}</td>
        <td>${statusBadge(emp.status)}</td>
        <td>
          <div class="row-actions">
            <button class="row-btn" title="View" onclick="openEmpDrawer('${emp.id}')">
              <i class="fa-regular fa-eye"></i>
            </button>
            <button class="row-btn" title="Edit" onclick="openEditModal('${emp.id}')">
              <i class="fa-regular fa-pen-to-square"></i>
            </button>
            <button class="row-btn danger" title="Delete" onclick="openDeleteModal('${emp.id}')">
              <i class="fa-regular fa-trash-can"></i>
            </button>
          </div>
        </td>
      </tr>`;
    }).join('');
  }
  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const total = filteredEmployees.length;
  const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end   = Math.min(currentPage * PAGE_SIZE, total);

  const infoEl = document.getElementById('paginationInfo');
  const btnsEl = document.getElementById('paginationBtns');
  if (!infoEl || !btnsEl) return;

  infoEl.textContent = `Showing ${total ? start : 0}–${end} of ${total} employees`;

  let html = `<button ${currentPage <= 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})">
    <i class="fa-solid fa-chevron-left"></i></button>`;

  for (let p = 1; p <= pages; p++) {
    if (pages > 7 && Math.abs(p - currentPage) > 2 && p !== 1 && p !== pages) {
      if (p === 2 || p === pages - 1) html += `<button disabled>…</button>`;
      continue;
    }
    html += `<button class="${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }

  html += `<button ${currentPage >= pages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})">
    <i class="fa-solid fa-chevron-right"></i></button>`;

  btnsEl.innerHTML = html;
}

function goPage(p) {
  const pages = Math.ceil(filteredEmployees.length / PAGE_SIZE);
  if (p < 1 || p > pages) return;
  currentPage = p;
  renderTable();
}

/* ================================================================
   EXPORT MODAL
   ================================================================ */
function openExportModal() {
  document.getElementById('exportModal').classList.add('open');
}
function closeExportModal() {
  document.getElementById('exportModal').classList.remove('open');
}
function doExport() {
  const fmt   = document.querySelector('input[name="exportFmt"]:checked').value;
  const scope = document.querySelector('input[name="exportScope"]:checked').value;
  const list  = scope === 'all' ? allEmployees : filteredEmployees;

  if (fmt === 'csv') {
    const headers = ['id','first_name','last_name','email','phone','nic','gender',
                     'dob','department','designation','employment_type','status',
                     'hire_date','basic_salary'];
    const rows = [headers.join(',')];
    list.forEach(e => rows.push(headers.map(h => `"${(e[h]??'').toString().replace(/"/g,'""')}"`).join(',')));
    downloadFile('employees_export.csv', rows.join('\n'), 'text/csv');
  } else {
    downloadFile('employees_export.json', JSON.stringify(list, null, 2), 'application/json');
  }
  closeExportModal();
  showToast(`Exported ${list.length} employees as ${fmt.toUpperCase()}.`, 'success');
}

function downloadFile(name, content, type) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([content], { type }));
  a.download = name;
  a.click();
  URL.revokeObjectURL(a.href);
}

/* ================================================================
   ADD / EDIT EMPLOYEE MODAL
   ================================================================ */
function openAddModal() {
  editingId = null;
  document.getElementById('empModalTitle').textContent = 'Add Employee';
  document.getElementById('empModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Add Employee';
  document.getElementById('employeeForm').reset();
  document.getElementById('employeeModal').classList.add('open');
}

function openEditModal(id) {
  const emp = allEmployees.find(e => e.id === id);
  if (!emp) return;
  editingId = id;
  document.getElementById('empModalTitle').textContent = 'Edit Employee';
  document.getElementById('empModalSaveBtn').innerHTML = '<i class="fa-solid fa-save"></i> Save Changes';

  const f = fid => document.getElementById(fid);
  f('fFirstName').value       = emp.first_name       || '';
  f('fLastName').value        = emp.last_name        || '';
  f('fEmail').value           = emp.email            || '';
  f('fPhone').value           = emp.phone            || '';
  f('fNIC').value             = emp.nic              || '';
  f('fDOB').value             = emp.dob              || '';
  f('fGender').value          = emp.gender           || '';
  f('fDepartment').value      = emp.department       || '';
  f('fDesignation').value     = emp.designation      || '';
  f('fEmploymentType').value  = emp.employment_type  || 'full-time';
  f('fStatus').value          = emp.status           || 'active';
  f('fHireDate').value        = emp.hire_date        || '';
  f('fBasicSalary').value     = emp.basic_salary     || '';
  f('fNotes').value           = emp.notes            || '';

  document.getElementById('employeeModal').classList.add('open');
}

function closeEmpModal() {
  document.getElementById('employeeModal').classList.remove('open');
}

function saveEmployee(e) {
  e.preventDefault();
  const f = fid => document.getElementById(fid);

  const firstName = f('fFirstName').value.trim();
  const lastName  = f('fLastName').value.trim();
  const dept      = f('fDepartment').value;
  const desig     = f('fDesignation').value.trim();

  if (!firstName)  { showToast('First name is required.', 'warning'); return; }
  if (!lastName)   { showToast('Last name is required.',  'warning'); return; }
  if (!dept)       { showToast('Department is required.', 'warning'); return; }
  if (!desig)      { showToast('Designation is required.','warning'); return; }

  const form = {
    first_name:      firstName,
    last_name:       lastName,
    email:           f('fEmail').value.trim(),
    phone:           f('fPhone').value.trim(),
    nic:             f('fNIC').value.trim(),
    dob:             f('fDOB').value,
    gender:          f('fGender').value,
    department:      dept,
    designation:     desig,
    employment_type: f('fEmploymentType').value,
    status:          f('fStatus').value,
    hire_date:       f('fHireDate').value,
    basic_salary:    parseInt(f('fBasicSalary').value) || 0,
    notes:           f('fNotes').value.trim(),
  };

  if (editingId) {
    const idx = allEmployees.findIndex(e => e.id === editingId);
    if (idx >= 0) allEmployees[idx] = { ...allEmployees[idx], ...form };
    showToast('Employee updated successfully.', 'success');
  } else {
    const maxNum = Math.max(0, ...allEmployees.map(e => parseInt((e.id||'EMP-000').replace('EMP-',''),10)));
    const newId  = 'EMP-' + String(maxNum + 1).padStart(3, '0');
    allEmployees.unshift({ id: newId, ...form });
    showToast('Employee added successfully.', 'success');
  }

  saveLocal();
  closeEmpModal();
  applyFilters();
}

/* ================================================================
   EMPLOYEE DRAWER
   ================================================================ */
function openEmpDrawer(id) {
  const emp = allEmployees.find(e => e.id === id);
  if (!emp) return;

  const color    = empColor(emp);
  const initials = empInitials(emp);
  const fullName = `${emp.first_name} ${emp.last_name}`;

  /* ── Header ── */
  document.getElementById('empDrawerHeader').innerHTML = `
    <div class="vd-header">
      <div class="drawer-profile">
        <div class="emp-drawer-avatar" style="background:${color};">${initials}</div>
        <div style="flex:1;min-width:0;">
          <div class="drawer-company">${fullName}</div>
          <div class="drawer-emp-id">${emp.id}</div>
          <div style="margin-top:.35rem;">${statusBadge(emp.status)}</div>
        </div>
        <button class="drawer-close" onclick="closeEmpDrawer()" title="Close">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>
      <div class="drawer-tabs">
        <button class="dtab active" onclick="switchEmpTab(this,'dpane-details')">Details</button>
        <button class="dtab" onclick="switchEmpTab(this,'dpane-employment')">Employment</button>
        <button class="dtab" onclick="switchEmpTab(this,'dpane-notes')">Notes</button>
      </div>
    </div>
  `;

  /* ── Body ── */
  const genderLabel = emp.gender === 'male' ? 'Male' : emp.gender === 'female' ? 'Female' : (emp.gender || '—');
  document.getElementById('empDrawerBody').innerHTML = `
    <div class="vd-body">

      <div id="dpane-details" class="dtab-pane active">
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-address-card"></i> Personal Information</div>
          <div class="drawer-field"><span class="df-label">Full Name</span><span class="df-val">${fullName}</span></div>
          <div class="drawer-field"><span class="df-label">Gender</span><span class="df-val">${genderLabel}</span></div>
          <div class="drawer-field"><span class="df-label">Date of Birth</span><span class="df-val">${fmtDate(emp.dob)}</span></div>
          <div class="drawer-field"><span class="df-label">NIC</span><span class="df-val" style="font-family:monospace;">${emp.nic || '—'}</span></div>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-envelope"></i> Contact</div>
          <div class="drawer-field"><span class="df-label">Email</span><span class="df-val"><a href="mailto:${emp.email}" style="color:var(--primary,#f97316);">${emp.email || '—'}</a></span></div>
          <div class="drawer-field"><span class="df-label">Phone</span><span class="df-val">${emp.phone || '—'}</span></div>
        </div>
      </div>

      <div id="dpane-employment" class="dtab-pane">
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-briefcase"></i> Employment Details</div>
          <div class="drawer-field"><span class="df-label">Department</span><span class="df-val">${emp.department || '—'}</span></div>
          <div class="drawer-field"><span class="df-label">Designation</span><span class="df-val">${emp.designation || '—'}</span></div>
          <div class="drawer-field"><span class="df-label">Employment Type</span><span class="df-val" style="text-transform:capitalize;">${(emp.employment_type||'—').replace('-',' ')}</span></div>
          <div class="drawer-field"><span class="df-label">Status</span><span class="df-val">${statusBadge(emp.status)}</span></div>
          <div class="drawer-field"><span class="df-label">Hire Date</span><span class="df-val">${fmtDate(emp.hire_date)}</span></div>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-sack-dollar"></i> Salary</div>
          <div class="drawer-kpi-row">
            <div class="drawer-kpi-box">
              <div class="drawer-kpi-val">${fmtLKR(emp.basic_salary || 0)}</div>
              <div class="drawer-kpi-label">Basic Salary / month</div>
            </div>
            <div class="drawer-kpi-box">
              <div class="drawer-kpi-val">${emp.employment_type === 'full-time' ? '160 hrs' : emp.employment_type === 'part-time' ? '80 hrs' : 'Contract'}</div>
              <div class="drawer-kpi-label">Monthly Hours</div>
            </div>
          </div>
        </div>
      </div>

      <div id="dpane-notes" class="dtab-pane">
        <div class="drawer-section">
          <div class="drawer-section-title"><i class="fa-solid fa-note-sticky"></i> Notes</div>
          <p style="font-size:.85rem;color:var(--color-neutral-600);line-height:1.65;">
            ${emp.notes ? emp.notes : 'No additional notes for this employee.'}
          </p>
        </div>
      </div>

    </div>
  `;

  /* ── Footer ── */
  document.getElementById('empDrawerFooter').innerHTML = `
    <div class="vd-footer">
      <button class="btn btn-outline btn-sm" onclick="closeEmpDrawer()">
        <i class="fa-solid fa-xmark"></i> Close
      </button>
      <button class="btn btn-primary btn-sm" onclick="openEditModal('${emp.id}');closeEmpDrawer()">
        <i class="fa-solid fa-pen"></i> Edit
      </button>
      <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;"
        onclick="closeEmpDrawer();openDeleteModal('${emp.id}')">
        <i class="fa-solid fa-trash"></i>
      </button>
    </div>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('employeeDrawer').classList.add('open');
}

function closeEmpDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('employeeDrawer').classList.remove('open');
}

function switchEmpTab(btn, tabId) {
  // tabs inside drawer header
  document.querySelectorAll('#empDrawerHeader .dtab').forEach(b => b.classList.remove('active'));
  // panes inside drawer body
  document.querySelectorAll('#empDrawerBody .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const pane = document.getElementById(tabId);
  if (pane) pane.classList.add('active');
}

/* ================================================================
   DELETE MODAL
   ================================================================ */
function openDeleteModal(id) {
  const emp = allEmployees.find(e => e.id === id);
  if (!emp) return;
  deletingId = id;
  document.getElementById('deleteEmployeeName').textContent =
    `${emp.first_name} ${emp.last_name} (${emp.id})`;
  document.getElementById('deleteEmployeeModal').classList.add('open');
}

function closeDeleteModal() {
  deletingId = null;
  document.getElementById('deleteEmployeeModal').classList.remove('open');
}

function confirmDeleteEmployee() {
  if (!deletingId) return;
  allEmployees = allEmployees.filter(e => e.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Employee deleted.', 'success');
  deletingId = null;
}

/* ================================================================
   TAB NAVIGATION
   ================================================================ */
function switchTab(tabName) {
  document.querySelectorAll('.tab-panel').forEach(p => {
    p.classList.remove('active');
    p.style.display = '';
  });
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  const panel = document.getElementById('tab-' + tabName);
  const btn   = document.querySelector('[data-tab="' + tabName + '"]');
  if (panel) panel.classList.add('active');
  if (btn)   btn.classList.add('active');
}

/* ─── Fallback toast ─── */
function showToast(msg, type) {
  if (typeof window.showToastNotification === 'function') {
    window.showToastNotification(msg, type);
    return;
  }
  const colors = { success:'#16a34a', error:'#dc2626', warning:'#ca8a04', info:'#2563eb' };
  const t = document.createElement('div');
  t.style.cssText = [
    'position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999',
    'background:#fff;border-radius:8px;padding:.7rem 1.1rem',
    `border-left:4px solid ${colors[type]||colors.info}`,
    'box-shadow:0 4px 20px rgba(0,0,0,.14);font-size:.875rem',
    'max-width:340px;opacity:0;transition:opacity .25s',
  ].join(';');
  t.textContent = msg;
  document.body.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; });
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3200);
}

/* ─── Init ─── */
loadEmployees();

/* ─── Event Listeners ─── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddEmployee').addEventListener('click', openAddModal);
document.getElementById('empSearch').addEventListener('input', applyFilters);
document.getElementById('filterDept').addEventListener('change', applyFilters);
document.getElementById('filterStatus').addEventListener('change', applyFilters);
document.getElementById('filterType').addEventListener('change', applyFilters);
document.getElementById('employeeForm').addEventListener('submit', saveEmployee);

// Tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// Backdrop close for modals
document.getElementById('employeeModal').addEventListener('click', function(e) {
  if (e.target === this) closeEmpModal();
});
document.getElementById('exportModal').addEventListener('click', function(e) {
  if (e.target === this) closeExportModal();
});
document.getElementById('deleteEmployeeModal').addEventListener('click', function(e) {
  if (e.target === this) closeDeleteModal();
});
// Drawer overlay
document.getElementById('drawerOverlay').addEventListener('click', closeEmpDrawer);
"""

# ─────────────────────────────────────────────────────────────
# 4. HTML: erp/hr/index.html
# ─────────────────────────────────────────────────────────────

HR_HTML = r"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>HR &amp; Payroll — LankaCommerce Cloud</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"/>
  <link rel="stylesheet" href="../../assets/css/variables.css"/>
  <link rel="stylesheet" href="../../assets/css/base.css"/>
  <link rel="stylesheet" href="../../assets/css/components.css"/>
  <link rel="stylesheet" href="../../assets/css/layout.css"/>
  <link rel="stylesheet" href="../erp.css"/>
  <link rel="stylesheet" href="hr.css"/>
</head>
<body>

<div class="app-shell">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar"></aside>

  <!-- Main Wrapper -->
  <div class="main-wrapper" id="mainWrapper">
    <header class="top-bar" id="erpTopBar" data-page-title="HR &amp; Payroll"></header>

    <!-- ═══════════════ MAIN CONTENT ═══════════════ -->
    <main class="main-content">

      <!-- Page Header -->
      <div class="page-header" style="display:flex;align-items:center;justify-content:space-between;margin-bottom:1.5rem;flex-wrap:wrap;gap:.75rem;">
        <div>
          <h1 class="page-title">Human Resources</h1>
          <p class="page-subtitle">Manage employees, attendance, payroll &amp; leave</p>
        </div>
        <div style="display:flex;gap:.625rem;flex-wrap:wrap;">
          <button class="btn btn-outline" id="btnExport">
            <i class="fa-solid fa-download"></i> Export
          </button>
          <button class="btn btn-primary" id="btnAddEmployee">
            <i class="fa-solid fa-plus"></i> Add Employee
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-icon icon-orange"><i class="fa-solid fa-users"></i></div>
          <div class="kpi-label">Total Employees</div>
          <div class="kpi-value" id="statTotalEmployees">—</div>
          <div class="kpi-sub">All staff</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon icon-green"><i class="fa-solid fa-user-check"></i></div>
          <div class="kpi-label">Active</div>
          <div class="kpi-value" id="statActiveEmployees">—</div>
          <div class="kpi-sub">Currently employed</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon icon-yellow"><i class="fa-regular fa-calendar-xmark"></i></div>
          <div class="kpi-label">On Leave</div>
          <div class="kpi-value" id="statOnLeave">—</div>
          <div class="kpi-sub">Approved absences</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-icon icon-blue"><i class="fa-solid fa-sack-dollar"></i></div>
          <div class="kpi-label">Monthly Payroll</div>
          <div class="kpi-value" id="statMonthlyPayroll" style="font-size:1.35rem;">—</div>
          <div class="kpi-sub">Active + on-leave staff</div>
        </div>
      </div>

      <!-- Tabs Bar -->
      <div class="tabs-bar">
        <button class="tab-btn active" data-tab="employees">
          <i class="fa-solid fa-users" style="margin-right:.4rem;"></i>Employees
        </button>
        <button class="tab-btn" data-tab="attendance">
          <i class="fa-regular fa-clock" style="margin-right:.4rem;"></i>Attendance
        </button>
        <button class="tab-btn" data-tab="payroll">
          <i class="fa-solid fa-money-check-dollar" style="margin-right:.4rem;"></i>Payroll
        </button>
        <button class="tab-btn" data-tab="leave">
          <i class="fa-regular fa-calendar-minus" style="margin-right:.4rem;"></i>Leave Requests
        </button>
      </div>

      <!-- ─────────── TAB: Employees ─────────── -->
      <div id="tab-employees" class="tab-panel active">

        <!-- Filter Toolbar -->
        <div class="toolbar">
          <div class="toolbar-search">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="empSearch" placeholder="Search by name, ID or email…"/>
          </div>
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
          <select id="filterStatus">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="on_leave">On Leave</option>
            <option value="inactive">Inactive</option>
          </select>
          <select id="filterType">
            <option value="">All Types</option>
            <option value="full-time">Full-time</option>
            <option value="part-time">Part-time</option>
            <option value="contract">Contract</option>
          </select>
          <button class="btn btn-outline btn-sm" onclick="clearFilters()" title="Clear filters">
            <i class="fa-solid fa-xmark"></i> Clear
          </button>
        </div>

        <!-- Employee Table -->
        <div class="data-table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>ID</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Phone</th>
                <th>Hire Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="empBody">
              <tr>
                <td colspan="8" style="text-align:center;padding:2rem;color:var(--color-neutral-400);">
                  <i class="fa-solid fa-spinner fa-spin" style="margin-right:.4rem;"></i>Loading employees…
                </td>
              </tr>
            </tbody>
          </table>
          <!-- Pagination -->
          <div class="pagination-bar">
            <span id="paginationInfo">—</span>
            <div class="pagination-btns" id="paginationBtns"></div>
          </div>
        </div>

      </div><!-- /tab-employees -->

      <!-- ─────────── TAB: Attendance ─────────── -->
      <div id="tab-attendance" class="tab-panel">
        <div class="coming-soon">
          <i class="fa-regular fa-clock"></i>
          <p>Attendance Management</p>
          <span style="font-size:.85rem;color:var(--color-neutral-400);max-width:340px;text-align:center;">
            Track employee check-in/check-out, daily attendance records and monthly summaries. Coming soon.
          </span>
        </div>
      </div>

      <!-- ─────────── TAB: Payroll ─────────── -->
      <div id="tab-payroll" class="tab-panel">
        <div class="coming-soon">
          <i class="fa-solid fa-money-check-dollar"></i>
          <p>Payroll Processing</p>
          <span style="font-size:.85rem;color:var(--color-neutral-400);max-width:340px;text-align:center;">
            Generate payslips, manage EPF/ETF contributions and process monthly payroll runs. Coming soon.
          </span>
        </div>
      </div>

      <!-- ─────────── TAB: Leave Requests ─────────── -->
      <div id="tab-leave" class="tab-panel">
        <div class="coming-soon">
          <i class="fa-regular fa-calendar-minus"></i>
          <p>Leave Management</p>
          <span style="font-size:.85rem;color:var(--color-neutral-400);max-width:340px;text-align:center;">
            Submit, approve and track annual, medical and casual leave requests. Coming soon.
          </span>
        </div>
      </div>

    </main><!-- /main-content -->
  </div><!-- /main-wrapper -->
</div><!-- /app-shell -->

<!-- ═══════════════ EXPORT MODAL ═══════════════ -->
<div class="modal-overlay" id="exportModal">
  <div class="modal" style="max-width:440px;">
    <div class="modal-header">
      <span class="modal-title"><i class="fa-solid fa-download" style="margin-right:.5rem;color:var(--primary,#f97316);"></i>Export Employees</span>
      <button class="modal-close" onclick="closeExportModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Export Format</label>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="exportFmt" value="csv" checked/>
            <i class="fa-solid fa-file-csv" style="color:#16a34a;"></i> CSV (.csv)
          </label>
          <label class="radio-option">
            <input type="radio" name="exportFmt" value="json"/>
            <i class="fa-solid fa-file-code" style="color:#2563eb;"></i> JSON (.json)
          </label>
        </div>
      </div>
      <div class="form-group" style="margin-top:.75rem;">
        <label>Scope</label>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="exportScope" value="all" checked/> All Employees
          </label>
          <label class="radio-option">
            <input type="radio" name="exportScope" value="filtered"/> Current Filter
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeExportModal()">Cancel</button>
      <button class="btn btn-primary" onclick="doExport()">
        <i class="fa-solid fa-download"></i> Export
      </button>
    </div>
  </div>
</div>

<!-- ═══════════════ ADD / EDIT EMPLOYEE MODAL ═══════════════ -->
<div class="modal-overlay" id="employeeModal">
  <div class="modal" style="max-width:680px;">
    <div class="modal-header">
      <span class="modal-title" id="empModalTitle">Add Employee</span>
      <button class="modal-close" onclick="closeEmpModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="employeeForm" novalidate>
      <div class="modal-body">

        <!-- Personal Information -->
        <div class="form-section-title">Personal Information</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label for="fFirstName">First Name <span style="color:#ef4444;">*</span></label>
            <input type="text" id="fFirstName" placeholder="e.g. Nuwan" required/>
          </div>
          <div class="form-group">
            <label for="fLastName">Last Name <span style="color:#ef4444;">*</span></label>
            <input type="text" id="fLastName" placeholder="e.g. Karunaratne" required/>
          </div>
        </div>
        <div class="form-grid-2">
          <div class="form-group">
            <label for="fEmail">Email</label>
            <input type="email" id="fEmail" placeholder="name@lcc.lk"/>
          </div>
          <div class="form-group">
            <label for="fPhone">Phone</label>
            <input type="tel" id="fPhone" placeholder="+94 77 XXX XXXX"/>
          </div>
        </div>
        <div class="form-grid-3">
          <div class="form-group">
            <label for="fNIC">NIC Number</label>
            <input type="text" id="fNIC" placeholder="XXXXXXXXXXXX or XXXXXXXXV"/>
          </div>
          <div class="form-group">
            <label for="fDOB">Date of Birth</label>
            <input type="date" id="fDOB"/>
          </div>
          <div class="form-group">
            <label for="fGender">Gender</label>
            <select id="fGender">
              <option value="">Select…</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
        </div>

        <!-- Employment Details -->
        <div class="form-section-title">Employment Details</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label for="fDepartment">Department <span style="color:#ef4444;">*</span></label>
            <select id="fDepartment" required>
              <option value="">Select department…</option>
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
            <label for="fDesignation">Designation <span style="color:#ef4444;">*</span></label>
            <input type="text" id="fDesignation" placeholder="e.g. Sales Executive"/>
          </div>
        </div>
        <div class="form-grid-3">
          <div class="form-group">
            <label for="fEmploymentType">Employment Type</label>
            <select id="fEmploymentType">
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
            </select>
          </div>
          <div class="form-group">
            <label for="fStatus">Status</label>
            <select id="fStatus">
              <option value="active">Active</option>
              <option value="on_leave">On Leave</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
          <div class="form-group">
            <label for="fHireDate">Hire Date</label>
            <input type="date" id="fHireDate"/>
          </div>
        </div>

        <!-- Salary -->
        <div class="form-section-title">Compensation</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label for="fBasicSalary">Basic Salary (LKR)</label>
            <input type="number" id="fBasicSalary" placeholder="e.g. 85000" min="0"/>
          </div>
        </div>

        <!-- Notes -->
        <div class="form-section-title">Additional Notes</div>
        <div class="form-group">
          <label for="fNotes">Notes</label>
          <textarea id="fNotes" rows="3" placeholder="Any additional information…"></textarea>
        </div>

      </div><!-- /modal-body -->
      <div class="modal-footer">
        <button type="button" class="btn btn-outline" onclick="closeEmpModal()">Cancel</button>
        <button type="submit" class="btn btn-primary" id="empModalSaveBtn">
          <i class="fa-solid fa-plus"></i> Add Employee
        </button>
      </div>
    </form>
  </div>
</div>

<!-- ═══════════════ DELETE EMPLOYEE MODAL ═══════════════ -->
<div class="modal-overlay" id="deleteEmployeeModal">
  <div class="modal" style="max-width:420px;">
    <div class="modal-header">
      <span class="modal-title" style="color:#dc2626;">
        <i class="fa-solid fa-triangle-exclamation" style="margin-right:.5rem;"></i>Delete Employee
      </span>
      <button class="modal-close" onclick="closeDeleteModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">
      <p style="font-size:.9rem;color:var(--color-neutral-700);line-height:1.6;">
        Are you sure you want to delete <strong id="deleteEmployeeName"></strong>?
        This action cannot be undone.
      </p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-outline" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn-danger" onclick="confirmDeleteEmployee()">
        <i class="fa-solid fa-trash"></i> Delete Employee
      </button>
    </div>
  </div>
</div>

<!-- ═══════════════ EMPLOYEE DRAWER ═══════════════ -->
<div class="drawer-overlay" id="drawerOverlay"></div>
<aside class="employee-drawer" id="employeeDrawer">
  <div id="empDrawerHeader"></div>
  <div id="empDrawerBody" style="flex:1;overflow-y:auto;"></div>
  <div id="empDrawerFooter"></div>
</aside>

<!-- Sidebar overlay (mobile) -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<!-- Toast container -->
<div id="toastContainer" style="position:fixed;bottom:1.5rem;right:1.5rem;z-index:9999;display:flex;flex-direction:column;gap:.5rem;"></div>

<!-- Scripts -->
<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="../../assets/js/toast.js"></script>
<script src="hr.js"></script>
</body>
</html>
"""

# ─────────────────────────────────────────────────────────────
# WRITE FILES
# ─────────────────────────────────────────────────────────────

def write(path: Path, content: str, mode: str = "w"):
    path.parent.mkdir(parents=True, exist_ok=True)
    with open(path, mode, encoding="utf-8") as fh:
        fh.write(content)
    print(f"  ✓  {path.relative_to(Path(__file__).parent)}")

print("\nBuilding HR module files…")
print("─" * 50)

write(ROOT / "data" / "employees.json",
      json.dumps(employees_data, indent=2, ensure_ascii=False))

write(ROOT / "erp" / "hr" / "hr.css",  HR_CSS)
write(ROOT / "erp" / "hr" / "hr.js",   HR_JS)
write(ROOT / "erp" / "hr" / "index.html", HR_HTML)

print("─" * 50)
print(f"Done — 4 files written.\n")
