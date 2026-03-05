"""
build_accounting.py
──────────────────────────────────────────────────────────────────────────
Creates / overwrites the accounting module files:
  1. UI-Prototype/data/transactions.json
  2. UI-Prototype/erp/accounting/accounting.css
  3. UI-Prototype/erp/accounting/accounting.js
  4. UI-Prototype/erp/accounting/index.html
──────────────────────────────────────────────────────────────────────────
Run:  python build_accounting.py
"""
import json, os, random
from datetime import date, timedelta

BASE = os.path.join(os.path.dirname(__file__), 'UI-Prototype')
DATA_DIR = os.path.join(BASE, 'data')
ACC_DIR  = os.path.join(BASE, 'erp', 'accounting')
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(ACC_DIR,  exist_ok=True)


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  1. TRANSACTIONS JSON                                               ║
# ╚══════════════════════════════════════════════════════════════════════╝

random.seed(42)

SL_NAMES = [
    'Kamal Perera','Nimal Silva','Saman Kumara','Priya Jayasuriya','Ruwan Fernando',
    'Dilshan Wickramasinghe','Amara Dissanayake','Chamari Rathnayake','Janith Bandara',
    'Thilini Senanayake','Hasitha Rajapaksa','Malith Gunasekara','Ishara Mendis',
    'Sajith Pathiranage','Kavindra Liyanage',
]

INCOME_DESC = [
    ('Sales','Sales — Invoice {ref} ({client})','Sales','INV-2025-{n:04d}'),
    ('Sales','Sales — POS Settlement {ref} ({client})','Sales','POS-{n:04d}'),
    ('Sales','Sales — Invoice {ref} ({client})','Sales','INV-2025-{n:04d}'),
    ('HR','Staff Advance Recovery {ref}','HR','ADV-{n:04d}'),
    ('Other','Miscellaneous Income — {ref}','Other','MIS-{n:04d}'),
]
EXPENSE_DESC = [
    ('Supplier Payment','Supplier Payment — {client} ({ref})','Supplier Payment','PO-2025-{n:03d}'),
    ('Payroll','Staff Payroll — {ref} Disbursement','Payroll','PAY-{n:04d}'),
    ('Rent','Rent — {client} ({ref})','Rent','RENT-{n:03d}'),
    ('Utilities','Utility Bill — {client} ({ref})','Utilities','UTIL-{n:03d}'),
    ('Other','Office Expense — {ref}','Other','EXP-{n:04d}'),
]
CLIENTS = [
    'Sampath Electronics','Lanka Hospitals PLC','Dialog Axiata PLC',
    'Keells Super Kandy','Ceylon Biscuits Ltd','MAS Holdings',
    'Colombo Trade Imports','Hemas Holdings','John Keells Holdings',
    'Loadstar (Pvt) Ltd','Brandix Lanka','Softlogic Holdings',
    'Colombo 03 Warehouse','Ceylon Electricity Board','LECO Gampaha',
    'SLT Mobitel','Metropolitan Water','National Water Supply',
]

start_date = date(2025, 1, 5)
balance = 1_000_000.0
transactions = []

for i in range(1, 31):
    day_offset = random.randint(0, 119)
    d = start_date + timedelta(days=day_offset)
    txn_id = f'TXN-{d.strftime("%Y%m%d")}-{i:03d}'

    txn_type = random.choices(['income', 'expense'], weights=[55, 45])[0]
    client = random.choice(CLIENTS)
    ref_n  = random.randint(100, 999)

    if txn_type == 'income':
        tpl = random.choice(INCOME_DESC)
        cat, desc_tpl, cat_label, ref_tpl = tpl
        ref = ref_tpl.format(n=ref_n)
        desc = desc_tpl.format(ref=ref, client=client, n=ref_n)
        amount = round(random.uniform(15000, 850000), 2)
        balance = round(balance + amount, 2)
    else:
        tpl = random.choice(EXPENSE_DESC)
        cat, desc_tpl, cat_label, ref_tpl = tpl
        ref = ref_tpl.format(n=ref_n)
        desc = desc_tpl.format(ref=ref, client=client, n=ref_n)
        amount = round(random.uniform(5000, 540000), 2)
        balance = round(balance - amount, 2)

    status = random.choices(
        ['cleared', 'pending', 'voided'],
        weights=[75, 20, 5]
    )[0]

    notes_pool = [
        'Approved by finance manager.',
        'Bank transfer completed.',
        'Cheque payment processed.',
        'Pending bank confirmation.',
        'Verified against PO.',
        'Auto-matched against invoice.',
        '',
        '',
        '',
    ]
    notes = random.choice(notes_pool)

    transactions.append({
        'id': txn_id,
        'date': d.isoformat(),
        'reference': ref,
        'description': desc,
        'type': txn_type,
        'category': cat_label,
        'amount': amount,
        'balance': balance,
        'status': status,
        'notes': notes,
        'created_by': random.choice(SL_NAMES),
    })

txn_path = os.path.join(DATA_DIR, 'transactions.json')
with open(txn_path, 'w', encoding='utf-8') as f:
    json.dump({'transactions': transactions}, f, indent=2, ensure_ascii=False)
print(f'JSON written : {txn_path}  ({len(transactions)} records)')


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  2. CSS                                                             ║
# ╚══════════════════════════════════════════════════════════════════════╝

css = """\
/* ============================================================
   ACCOUNTING — accounting.css
   Page-specific styles for erp/accounting/index.html
   ============================================================ */

/* ── KPI Grid ── */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.25rem;
}
@media (max-width: 1100px) { .kpi-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 600px)  { .kpi-grid { grid-template-columns: 1fr; } }

.kpi-card {
  background: #fff;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: 1.25rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.625rem;
  transition: box-shadow 0.2s, border-color 0.2s;
}
.kpi-card:hover { box-shadow: var(--shadow-md); border-color: #fed7aa; }

.kpi-row {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}
.kpi-icon {
  width: 44px; height: 44px; border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem;
}
.kpi-icon.orange { background: #ffedd5; color: #ea580c; }
.kpi-icon.red    { background: #fee2e2; color: #dc2626; }
.kpi-icon.green  { background: #dcfce7; color: #16a34a; }
.kpi-icon.blue   { background: #dbeafe; color: #1d4ed8; }

.kpi-badge {
  font-size: 0.75rem; font-weight: 600;
  padding: 0.2rem 0.5rem; border-radius: 20px;
}
.kpi-badge.up   { background: #dcfce7; color: #16a34a; }
.kpi-badge.down { background: #fee2e2; color: #dc2626; }

.kpi-value {
  font-size: 1.55rem; font-weight: 700;
  color: var(--color-neutral-900);
  letter-spacing: -0.03em; line-height: 1;
}
.kpi-label {
  font-size: 0.8125rem;
  color: var(--color-neutral-500);
  font-weight: 500;
}

/* ── Tab Bar ── */
.tab-bar {
  display: flex; gap: 0.25rem;
  border-bottom: 2px solid var(--color-neutral-200);
  margin: 1.25rem 0 0;
}
.tab-btn {
  padding: 0.6rem 1.1rem;
  font-size: 0.875rem; font-weight: 500;
  color: var(--color-neutral-500);
  background: none; border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px; cursor: pointer;
  transition: color 0.2s, border-color 0.2s;
}
.tab-btn:hover { color: var(--color-neutral-800); }
.tab-btn.active {
  color: var(--primary, #f97316);
  border-bottom-color: var(--primary, #f97316);
  font-weight: 600;
}
.tab-panel { display: none; padding-top: 1.25rem; }
.tab-panel.active { display: block; }

/* ── Filter Bar ── */
.filter-bar {
  display: flex; gap: 0.75rem; flex-wrap: wrap;
  align-items: center; margin-bottom: 1rem;
}
.filter-bar input,
.filter-bar select {
  height: 2.25rem;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  padding: 0 0.75rem;
  font-size: 0.875rem; color: var(--color-neutral-700);
  background: #fff; outline: none;
}
.filter-bar input:focus,
.filter-bar select:focus { border-color: var(--primary, #f97316); }
.filter-bar .search-wrap {
  position: relative; flex: 1; min-width: 200px;
}
.filter-bar .search-wrap i {
  position: absolute; left: 0.65rem; top: 50%;
  transform: translateY(-50%);
  color: var(--color-neutral-400); font-size: 0.8rem;
}
.filter-bar .search-wrap input {
  width: 100%; padding-left: 2rem;
}

/* ── Table ── */
.table-wrap { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; font-size: 0.875rem; }
.data-table thead th {
  text-align: left; padding: 0.625rem 0.875rem;
  font-size: 0.75rem; font-weight: 600;
  color: var(--color-neutral-500); text-transform: uppercase;
  letter-spacing: 0.04em; border-bottom: 2px solid var(--color-neutral-100);
  white-space: nowrap;
}
.data-table tbody tr:hover { background: var(--color-neutral-50); }
.data-table tbody td {
  padding: 0.75rem 0.875rem; color: var(--color-neutral-700);
  border-bottom: 1px solid var(--color-neutral-100);
}

/* ── Badges ── */
.badge {
  display: inline-flex; align-items: center; gap: 0.3rem;
  font-size: 0.75rem; font-weight: 600;
  padding: 0.2rem 0.625rem; border-radius: 20px;
}
.badge-income  { background: #dbeafe; color: #1d4ed8; }
.badge-expense { background: #fee2e2; color: #dc2626; }
.badge-cleared { background: #dcfce7; color: #16a34a; }
.badge-pending { background: #fef9c3; color: #a16207; }
.badge-voided  { background: #f3f4f6; color: #6b7280; }

/* ── Ref Link ── */
.ref-link {
  font-family: 'Courier New', monospace;
  font-weight: 600; font-size: 0.8125rem;
  color: var(--primary, #f97316);
  cursor: pointer;
}
.ref-link:hover { text-decoration: underline; }

/* ── Action Buttons ── */
.btn-icon {
  background: none; border: 1px solid var(--color-neutral-200);
  border-radius: 7px; width: 30px; height: 30px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.78rem; cursor: pointer; color: var(--color-neutral-500);
  transition: background 0.15s, border-color 0.15s, color 0.15s;
}
.btn-icon:hover { background: var(--color-neutral-100); border-color: var(--color-neutral-300); color: var(--color-neutral-800); }
.btn-icon-danger {
  background: none; border: 1px solid #fecaca;
  border-radius: 7px; width: 30px; height: 30px;
  display: inline-flex; align-items: center; justify-content: center;
  font-size: 0.78rem; cursor: pointer; color: #dc2626;
  transition: background 0.15s, border-color 0.15s;
}
.btn-icon-danger:hover { background: #fef2f2; border-color: #f87171; }
.action-btns { display: flex; gap: 0.3rem; }

/* ── Pagination ── */
.pagination-bar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.75rem 1rem; font-size: 0.83rem; color: var(--color-neutral-500);
}
.pagination-btns { display: flex; gap: 0.3rem; flex-wrap: wrap; }
.pagination-btns button {
  background: #fff; border: 1px solid var(--color-neutral-200);
  border-radius: 6px; padding: 0.3rem 0.65rem;
  font-size: 0.82rem; color: var(--color-neutral-600);
  cursor: pointer; transition: border-color 0.15s, background 0.15s;
  min-width: 32px;
}
.pagination-btns button:hover { border-color: var(--color-primary-400, #fb923c); color: var(--primary, #f97316); }
.pagination-btns button.page-active {
  background: var(--primary, #f97316); color: #fff;
  border-color: var(--primary, #f97316); font-weight: 600;
}
.pagination-btns button:disabled { opacity: 0.4; cursor: not-allowed; }

/* ── Coming Soon Placeholders ── */
.coming-soon {
  text-align: center; padding: 4rem 1rem;
  color: var(--color-neutral-400);
}
.coming-soon i { font-size: 2.5rem; margin-bottom: 0.75rem; display: block; }
.coming-soon p { font-size: 0.9375rem; font-weight: 500; }

/* ── Modal Overlay — CRITICAL: override components.css opacity/visibility ── */
.modal-overlay {
  display: none;
  opacity: 1;           /* CRITICAL: override components.css */
  visibility: visible;  /* CRITICAL: override components.css */
  position: fixed; inset: 0; z-index: 500;
  background: rgba(0,0,0,.45); backdrop-filter: blur(2px);
  justify-content: center; align-items: flex-start;
  padding: 2rem 1rem; overflow-y: auto;
}
.modal-overlay.open { display: flex; }

/* ── Modal ── */
.modal {
  background: #fff; border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0,0,0,.18);
  width: 100%; max-height: 90vh; overflow-y: auto; margin: auto;
}
.modal-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 0.9rem 1.25rem; border-bottom: 1px solid var(--color-neutral-100);
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
  gap: 0.5rem; padding: 0.9rem 1.25rem;
  border-top: 1px solid var(--color-neutral-100);
}

/* ── Form Helpers ── */
.form-section-title {
  font-size: 0.7rem; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--color-neutral-400);
  margin-bottom: 0.75rem;
}
.form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem; }
@media (max-width: 600px) { .form-grid-2 { grid-template-columns: 1fr; } }
.radio-group { display: flex; flex-direction: column; gap: 0.4rem; margin-top: 0.25rem; }
.radio-option {
  display: flex; align-items: center; gap: 0.6rem;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-neutral-200); border-radius: 8px;
  cursor: pointer; font-size: 0.85rem;
  transition: border-color 0.15s, background 0.15s;
}
.radio-option:hover { border-color: var(--primary, #f97316); background: #fff7ed; }
.radio-option input { accent-color: var(--primary, #f97316); }

/* ── Danger Button ── */
.btn-danger {
  background: #dc2626; color: #fff; border: none;
  border-radius: 8px; padding: 0.45rem 1rem;
  font-size: 0.83rem; font-weight: 500; cursor: pointer;
  display: inline-flex; align-items: center; gap: 0.4rem;
  transition: background 0.15s;
}
.btn-danger:hover { background: #b91c1c; }

/* ── Drawer Overlay ── */
.drawer-overlay {
  display: none; position: fixed; inset: 0; z-index: 490;
  background: rgba(0,0,0,.3);
}
.drawer-overlay.open { display: block; }

/* ── Transaction Drawer — CRITICAL: right-based, NOT transform ── */
.txn-drawer {
  position: fixed; right: -460px; top: 0; bottom: 0;
  width: 440px; max-width: 100vw;
  background: #fff; box-shadow: -4px 0 24px rgba(0,0,0,.14);
  z-index: 495; display: flex; flex-direction: column;
  transition: right .28s cubic-bezier(.4,0,.2,1); overflow: hidden;
}
.txn-drawer.open { right: 0; }

/* ── Drawer Sections ── */
.vd-header { flex-shrink: 0; }
.vd-body { flex: 1; overflow-y: auto; padding: 1rem 1.25rem; }
.vd-footer {
  flex-shrink: 0; display: flex; gap: 0.5rem;
  padding: 0.8rem 1.25rem; border-top: 1px solid var(--color-neutral-100);
}

/* ── Drawer Sub-components ── */
.drawer-profile {
  display: flex; align-items: center; gap: 0.9rem;
  padding: 1.2rem 1.25rem 1rem;
  border-bottom: 1px solid var(--color-neutral-100);
}
.drawer-avatar {
  width: 46px; height: 46px; border-radius: 10px;
  background: #fff7ed; color: #f97316;
  display: flex; align-items: center; justify-content: center;
  font-size: 1.1rem; font-weight: 700; flex-shrink: 0;
}
.drawer-avatar.expense { background: #fef2f2; color: #dc2626; }
.drawer-txn-id {
  font-size: 0.72rem; color: var(--color-neutral-400);
  margin-top: 0.15rem; font-family: monospace;
}
.drawer-desc { font-weight: 600; font-size: 0.9rem; line-height: 1.35; }
.drawer-close {
  margin-left: auto; background: none; border: none; cursor: pointer;
  width: 30px; height: 30px; border-radius: 7px;
  display: flex; align-items: center; justify-content: center;
  color: var(--color-neutral-500); font-size: 0.85rem;
}
.drawer-close:hover { background: var(--color-neutral-100); }
.drawer-tabs {
  display: flex; border-bottom: 1px solid var(--color-neutral-100);
  padding: 0 1.25rem; flex-shrink: 0;
}
.dtab {
  background: none; border: none; cursor: pointer;
  padding: 0.65rem 0.85rem; font-size: 0.82rem; font-weight: 500;
  color: var(--color-neutral-500);
  border-bottom: 2px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.dtab.active { color: var(--primary, #f97316); border-bottom-color: var(--primary, #f97316); }
.dtab-pane { display: none; }
.dtab-pane.active { display: block; }
.drawer-section { margin-bottom: 1.2rem; }
.drawer-section-title {
  font-size: 0.68rem; font-weight: 700; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--color-neutral-400);
  margin-bottom: 0.6rem;
}
.drawer-field {
  display: flex; justify-content: space-between; align-items: flex-start;
  padding: 0.35rem 0; border-bottom: 1px solid var(--color-neutral-50);
}
.drawer-field:last-child { border-bottom: none; }
.df-label { font-size: 0.78rem; color: var(--color-neutral-500); flex-shrink: 0; }
.df-val {
  font-size: 0.82rem; font-weight: 500; color: var(--color-neutral-700);
  text-align: right; word-break: break-word;
}
.drawer-kpi-row { display: grid; grid-template-columns: 1fr 1fr; gap: 0.6rem; margin-bottom: 1rem; }
.drawer-kpi-box {
  background: var(--color-neutral-50); border-radius: 10px;
  padding: 0.75rem; text-align: center;
}
.drawer-kpi-val { font-size: 1rem; font-weight: 700; color: var(--color-neutral-700); }
.drawer-kpi-label { font-size: 0.68rem; color: var(--color-neutral-400); margin-top: 0.15rem; }
.drawer-notes-box {
  background: var(--color-neutral-50); border-radius: 8px;
  padding: 0.85rem 1rem; font-size: 0.83rem; color: var(--color-neutral-600);
  line-height: 1.6; min-height: 64px;
  border: 1px solid var(--color-neutral-100);
}
"""

css_path = os.path.join(ACC_DIR, 'accounting.css')
with open(css_path, 'w', encoding='utf-8') as f:
    f.write(css)
print(f'CSS written  : {css_path}')


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  3. JavaScript                                                      ║
# ╚══════════════════════════════════════════════════════════════════════╝

js = r"""/* ══════════════════════════════════════════════════════════════
   Accounting — accounting.js
   ══════════════════════════════════════════════════════════════ */
'use strict';

let allTxns      = [];
let filteredTxns = [];
let editingId    = null;
let deletingId   = null;
let currentPage  = 1;
const PAGE_SIZE  = 8;

/* ─── Formatters ─── */
const fmtLKR  = n  => '₨ ' + Number(n).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const fmtDate = ds => { const d = new Date(ds + 'T00:00:00'); return d.toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' }); };

/* ─── Load ─── */
async function loadTransactions() {
  try {
    const resp = await fetch('../../data/transactions.json?v=' + Date.now());
    const data = await resp.json();
    allTxns = (data.transactions || []).map(t => ({ ...t }));
    const saved = JSON.parse(localStorage.getItem('lcc_transactions') || '[]');
    saved.forEach(st => {
      const idx = allTxns.findIndex(t => t.id === st.id);
      if (idx >= 0) allTxns[idx] = st; else allTxns.push(st);
    });
    updateStats();
    applyFilters();
  } catch (e) {
    console.error('Failed to load transactions:', e);
    showToast('Failed to load transaction data.', 'error');
  }
}

function saveLocal() {
  localStorage.setItem('lcc_transactions', JSON.stringify(allTxns));
}

/* ─── Stats ─── */
function updateStats() {
  const revenue      = allTxns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const expenses     = allTxns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netProfit    = revenue - expenses;
  const receivables  = allTxns.filter(t => t.type === 'income' && t.status === 'pending').reduce((s, t) => s + t.amount, 0);

  document.getElementById('statRevenue').textContent    = fmtLKR(revenue);
  document.getElementById('statExpenses').textContent   = fmtLKR(expenses);
  document.getElementById('statNetProfit').textContent  = fmtLKR(netProfit);
  document.getElementById('statReceivables').textContent = fmtLKR(receivables);
}

/* ─── Filters ─── */
function applyFilters() {
  const q      = (document.getElementById('txnSearch').value || '').toLowerCase().trim();
  const type   = document.getElementById('txnTypeFilter').value;
  const status = document.getElementById('txnStatusFilter').value;
  const from   = document.getElementById('txnDateFrom').value;
  const to     = document.getElementById('txnDateTo').value;

  filteredTxns = allTxns.filter(t => {
    if (q && !['id','description','reference'].some(k => (t[k]||'').toLowerCase().includes(q))) return false;
    if (type   && t.type   !== type)   return false;
    if (status && t.status !== status) return false;
    if (from   && t.date < from)       return false;
    if (to     && t.date > to)         return false;
    return true;
  });

  currentPage = 1;
  renderTransactions();
}

function clearFilters() {
  document.getElementById('txnSearch').value      = '';
  document.getElementById('txnTypeFilter').value  = '';
  document.getElementById('txnStatusFilter').value = '';
  document.getElementById('txnDateFrom').value    = '';
  document.getElementById('txnDateTo').value      = '';
  applyFilters();
}

/* ─── Render Table ─── */
function renderTransactions() {
  const tbody = document.getElementById('txnBody');
  const start = (currentPage - 1) * PAGE_SIZE;
  const slice = filteredTxns.slice(start, start + PAGE_SIZE);

  if (!slice.length) {
    tbody.innerHTML = `<tr><td colspan="9" style="text-align:center;padding:2.5rem;color:var(--color-neutral-400);">
      <i class="fa-solid fa-inbox" style="font-size:1.5rem;display:block;margin-bottom:.5rem;"></i>No transactions found.</td></tr>`;
    renderPagination();
    return;
  }

  tbody.innerHTML = slice.map(t => {
    const isIncome = t.type === 'income';
    const typeLabel  = isIncome ? 'Income' : 'Expense';
    const amtColor   = isIncome ? '#16a34a' : '#dc2626';
    const amtPrefix  = isIncome ? '+' : '−';
    const statusBadge = `<span class="badge badge-${t.status}">${t.status.charAt(0).toUpperCase()+t.status.slice(1)}</span>`;
    return `<tr>
      <td><span class="ref-link" onclick="openTxnDrawer('${t.id}')">${t.id}</span></td>
      <td>${fmtDate(t.date)}</td>
      <td><span class="ref-link">${t.reference}</span></td>
      <td style="max-width:240px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${t.description}">${t.description}</td>
      <td><span class="badge badge-${t.type}">${typeLabel}</span></td>
      <td style="color:${amtColor};font-weight:600;white-space:nowrap;">${amtPrefix} ${fmtLKR(t.amount)}</td>
      <td style="white-space:nowrap;">${fmtLKR(t.balance)}</td>
      <td>${statusBadge}</td>
      <td>
        <div class="action-btns">
          <button class="btn-icon" title="View Details" onclick="openTxnDrawer('${t.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="btn-icon" title="Edit" onclick="openEditModal('${t.id}')"><i class="fa-solid fa-pen-to-square"></i></button>
          <button class="btn-icon-danger" title="Delete" onclick="openDeleteModal('${t.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>`;
  }).join('');

  renderPagination();
}

/* ─── Pagination ─── */
function renderPagination() {
  const totalPages = Math.max(1, Math.ceil(filteredTxns.length / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, filteredTxns.length);
  const end   = Math.min(currentPage * PAGE_SIZE, filteredTxns.length);

  const info = document.getElementById('paginationInfo');
  if (info) info.textContent = `Showing ${start}–${end} of ${filteredTxns.length} transactions`;

  const btns = document.getElementById('paginationBtns');
  if (!btns) return;

  let html = `<button ${currentPage === 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let p = 1; p <= totalPages; p++) {
    html += `<button class="${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  btns.innerHTML = html;
}

function goPage(p) {
  const totalPages = Math.ceil(filteredTxns.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTransactions();
}

/* ─── Export Modal ─── */
function openExportModal() {
  document.getElementById('exportModal').classList.add('open');
}
function closeExportModal() {
  document.getElementById('exportModal').classList.remove('open');
}
function doExport() {
  const fmt   = document.querySelector('input[name="exportFmt"]:checked')?.value   || 'csv';
  const scope = document.querySelector('input[name="exportScope"]:checked')?.value || 'filtered';
  const data  = scope === 'all' ? allTxns : filteredTxns;

  let content, filename, mime;
  if (fmt === 'json') {
    content  = JSON.stringify({ transactions: data }, null, 2);
    filename = 'transactions.json';
    mime     = 'application/json';
  } else {
    const headers = ['id','date','reference','description','type','category','amount','balance','status','notes','created_by'];
    const rows = data.map(t => headers.map(h => `"${String(t[h]||'').replace(/"/g,'""')}"`).join(','));
    content  = [headers.join(','), ...rows].join('\n');
    filename = 'transactions.csv';
    mime     = 'text/csv';
  }

  const blob = new Blob([content], { type: mime });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  closeExportModal();
  showToast(`Exported ${data.length} records as ${fmt.toUpperCase()}.`, 'success');
}

/* ─── Add / Edit Modal ─── */
function openAddModal() {
  editingId = null;
  document.getElementById('txnModalTitle').textContent = 'New Transaction';
  document.getElementById('txnModalSaveBtn').innerHTML = '<i class="fa-solid fa-plus"></i> Create';
  document.getElementById('txnForm').reset();
  document.getElementById('fDate').value = new Date().toISOString().split('T')[0];
  document.getElementById('txnModal').classList.add('open');
}

function openEditModal(id) {
  const txn = allTxns.find(t => t.id === id);
  if (!txn) return;
  editingId = id;
  document.getElementById('txnModalTitle').textContent = 'Edit Transaction';
  document.getElementById('txnModalSaveBtn').innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Save';

  document.getElementById('fDate').value        = txn.date;
  document.getElementById('fReference').value   = txn.reference;
  document.getElementById('fDescription').value = txn.description;
  document.getElementById('fType').value        = txn.type;
  document.getElementById('fCategory').value    = txn.category;
  document.getElementById('fAmount').value      = txn.amount;
  document.getElementById('fStatus').value      = txn.status;
  document.getElementById('fNotes').value       = txn.notes || '';

  document.getElementById('txnModal').classList.add('open');
}

function closeTxnModal() {
  document.getElementById('txnModal').classList.remove('open');
}

function saveTxn(e) {
  e.preventDefault();
  const date        = document.getElementById('fDate').value;
  const reference   = document.getElementById('fReference').value.trim();
  const description = document.getElementById('fDescription').value.trim();
  const type        = document.getElementById('fType').value;
  const category    = document.getElementById('fCategory').value;
  const amount      = parseFloat(document.getElementById('fAmount').value);
  const status      = document.getElementById('fStatus').value;
  const notes       = document.getElementById('fNotes').value.trim();

  if (!date || !reference || !description || !type || isNaN(amount) || amount <= 0) {
    showToast('Please fill in all required fields.', 'error');
    return;
  }

  if (editingId) {
    const idx = allTxns.findIndex(t => t.id === editingId);
    if (idx >= 0) {
      allTxns[idx] = { ...allTxns[idx], date, reference, description, type, category, amount, status, notes };
      showToast('Transaction updated.', 'success');
    }
  } else {
    const d   = new Date(date + 'T00:00:00');
    const newId = `TXN-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}-${String(allTxns.length + 1).padStart(3,'0')}`;
    const lastBalance = allTxns.length ? allTxns[allTxns.length - 1].balance : 0;
    const newBalance  = type === 'income' ? lastBalance + amount : lastBalance - amount;
    allTxns.push({ id: newId, date, reference, description, type, category, amount, balance: newBalance, status, notes, created_by: 'Admin' });
    showToast('Transaction created.', 'success');
  }

  saveLocal();
  updateStats();
  applyFilters();
  closeTxnModal();
}

/* ─── Transaction Drawer ─── */
function openTxnDrawer(id) {
  const txn = allTxns.find(t => t.id === id);
  if (!txn) return;

  const isIncome  = txn.type === 'income';
  const typeLabel = isIncome ? 'Income' : 'Expense';
  const amtColor  = isIncome ? '#16a34a' : '#dc2626';
  const amtPrefix = isIncome ? '+' : '−';
  const statusBadge = `<span class="badge badge-${txn.status}">${txn.status.charAt(0).toUpperCase()+txn.status.slice(1)}</span>`;
  const typeBadge   = `<span class="badge badge-${txn.type}">${typeLabel}</span>`;
  const avatarIcon  = isIncome ? 'fa-arrow-down-to-line' : 'fa-arrow-up-from-line';
  const avatarClass = isIncome ? '' : ' expense';

  document.getElementById('txnDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar${avatarClass}"><i class="fa-solid ${avatarIcon}"></i></div>
      <div>
        <div class="drawer-desc">${txn.description.length > 50 ? txn.description.slice(0,50)+'…' : txn.description}</div>
        <div class="drawer-txn-id">${txn.id} &nbsp;·&nbsp; ${fmtDate(txn.date)}</div>
        <div style="margin-top:.3rem;">${typeBadge} &nbsp; ${statusBadge}</div>
      </div>
      <button class="drawer-close" onclick="closeTxnDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchTxnTab(this,'dtab-details')">Details</button>
      <button class="dtab" onclick="switchTxnTab(this,'dtab-amount')">Amount</button>
      <button class="dtab" onclick="switchTxnTab(this,'dtab-notes')">Notes</button>
    </div>`;

  document.getElementById('txnDrawerBody').innerHTML = `
    <div class="dtab-pane active" id="dtab-details">
      <div class="drawer-section" style="margin-top:.75rem;">
        <div class="drawer-section-title">Transaction Details</div>
        <div class="drawer-field"><span class="df-label">Reference</span><span class="df-val" style="font-family:monospace;">${txn.reference}</span></div>
        <div class="drawer-field"><span class="df-label">Date</span><span class="df-val">${fmtDate(txn.date)}</span></div>
        <div class="drawer-field"><span class="df-label">Category</span><span class="df-val">${txn.category}</span></div>
        <div class="drawer-field"><span class="df-label">Type</span><span class="df-val">${typeBadge}</span></div>
        <div class="drawer-field"><span class="df-label">Status</span><span class="df-val">${statusBadge}</span></div>
        <div class="drawer-field"><span class="df-label">Created By</span><span class="df-val">${txn.created_by || '—'}</span></div>
      </div>
    </div>
    <div class="dtab-pane" id="dtab-amount">
      <div style="margin-top:.75rem;">
        <div class="drawer-kpi-row">
          <div class="drawer-kpi-box">
            <div class="drawer-kpi-val" style="color:${amtColor};">${amtPrefix} ${fmtLKR(txn.amount)}</div>
            <div class="drawer-kpi-label">Transaction Amount</div>
          </div>
          <div class="drawer-kpi-box">
            <div class="drawer-kpi-val">${fmtLKR(txn.balance)}</div>
            <div class="drawer-kpi-label">Running Balance</div>
          </div>
        </div>
        <div class="drawer-section">
          <div class="drawer-section-title">Financial Summary</div>
          <div class="drawer-field"><span class="df-label">Amount (LKR)</span><span class="df-val" style="color:${amtColor};font-weight:700;">${amtPrefix} ${fmtLKR(txn.amount)}</span></div>
          <div class="drawer-field"><span class="df-label">Balance After</span><span class="df-val">${fmtLKR(txn.balance)}</span></div>
          <div class="drawer-field"><span class="df-label">Direction</span><span class="df-val">${typeLabel}</span></div>
        </div>
      </div>
    </div>
    <div class="dtab-pane" id="dtab-notes">
      <div style="margin-top:.75rem;">
        <div class="drawer-section-title">Transaction Notes</div>
        <div class="drawer-notes-box">${txn.notes || '<em style="color:var(--color-neutral-400);">No notes for this transaction.</em>'}</div>
        <div style="margin-top:1rem;">
          <div class="drawer-section-title">Full Description</div>
          <div class="drawer-notes-box">${txn.description}</div>
        </div>
      </div>
    </div>`;

  document.getElementById('txnDrawerFooter').innerHTML = `
    <button class="btn btn-ghost btn-sm" onclick="closeTxnDrawer()">Close</button>
    <button class="btn btn-outline btn-sm" onclick="closeTxnDrawer();openEditModal('${txn.id}')"><i class="fa-solid fa-pen-to-square"></i> Edit</button>
    <button class="btn btn-danger btn-sm" onclick="closeTxnDrawer();openDeleteModal('${txn.id}')"><i class="fa-solid fa-trash"></i> Delete</button>`;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('txnDrawer').classList.add('open');
}

function closeTxnDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('txnDrawer').classList.remove('open');
}

function switchTxnTab(btn, tabId) {
  document.querySelectorAll('#txnDrawer .dtab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('#txnDrawer .dtab-pane').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  const pane = document.getElementById(tabId);
  if (pane) pane.classList.add('active');
}

/* ─── Delete ─── */
function openDeleteModal(id) {
  const txn = allTxns.find(t => t.id === id);
  if (!txn) return;
  deletingId = id;
  const el = document.getElementById('deleteTxnRef');
  if (el) el.textContent = txn.id;
  document.getElementById('deleteTxnModal').classList.add('open');
}

function closeDeleteModal() {
  document.getElementById('deleteTxnModal').classList.remove('open');
  deletingId = null;
}

function confirmDeleteTxn() {
  if (!deletingId) return;
  allTxns = allTxns.filter(t => t.id !== deletingId);
  saveLocal();
  updateStats();
  applyFilters();
  closeDeleteModal();
  showToast('Transaction deleted.', 'success');
}

/* ─── Tab Switcher (page tabs: Transactions / Invoices / Expenses / Reports) ─── */
function switchTab(id, btn) {
  document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('tab-' + id).classList.add('active');
  btn.classList.add('active');
}

/* ─── Toast Fallback ─── */
function showToast(msg, type) {
  if (typeof window.LCCToast !== 'undefined') { window.LCCToast.show(msg, type); return; }
  const c = document.getElementById('toastContainer');
  if (!c) { console.log('[toast]', msg); return; }
  const t = document.createElement('div');
  const colors = { success: '#16a34a', error: '#dc2626', info: '#1d4ed8' };
  t.style.cssText = `background:${colors[type]||'#1e293b'};color:#fff;padding:.65rem 1rem;border-radius:8px;font-size:.84rem;box-shadow:0 4px 12px rgba(0,0,0,.18);opacity:0;transition:opacity .3s;`;
  t.textContent = msg;
  c.appendChild(t);
  requestAnimationFrame(() => { t.style.opacity = '1'; });
  setTimeout(() => { t.style.opacity = '0'; setTimeout(() => t.remove(), 300); }, 3000);
}

/* ─── Init ─── */
loadTransactions();

/* ─── Event Listeners ─── */
document.getElementById('btnExport').addEventListener('click', openExportModal);
document.getElementById('btnAddTxn').addEventListener('click', openAddModal);
document.getElementById('txnSearch').addEventListener('input', applyFilters);
document.getElementById('txnTypeFilter').addEventListener('change', applyFilters);
document.getElementById('txnStatusFilter').addEventListener('change', applyFilters);
document.getElementById('txnDateFrom').addEventListener('change', applyFilters);
document.getElementById('txnDateTo').addEventListener('change', applyFilters);
document.getElementById('txnForm').addEventListener('submit', saveTxn);
"""

js_path = os.path.join(ACC_DIR, 'accounting.js')
with open(js_path, 'w', encoding='utf-8') as f:
    f.write(js)
print(f'JS written   : {js_path}')


# ╔══════════════════════════════════════════════════════════════════════╗
# ║  4. HTML                                                            ║
# ╚══════════════════════════════════════════════════════════════════════╝

html = """\
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Accounting \u2014 LankaCommerce Cloud</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"/>
  <link rel="stylesheet" href="../../assets/css/variables.css"/>
  <link rel="stylesheet" href="../../assets/css/base.css"/>
  <link rel="stylesheet" href="../../assets/css/components.css"/>
  <link rel="stylesheet" href="../../assets/css/layout.css"/>
  <link rel="stylesheet" href="../erp.css"/>
  <link rel="stylesheet" href="accounting.css"/>
</head>
<body>

<div class="app-shell">
  <aside class="sidebar" id="sidebar"></aside>

  <div class="main-wrapper" id="mainWrapper">
    <header class="top-bar" id="erpTopBar" data-page-title="Accounting"></header>

    <div class="page-content">

      <!-- Page Header -->
      <div class="page-header">
        <div>
          <h1 class="page-title">Accounting</h1>
          <p class="page-subtitle">Manage transactions, invoices, expenses and financial reports \u00b7 LKR</p>
        </div>
        <div class="page-actions">
          <button class="btn btn-outline btn-sm" id="btnExport">
            <i class="fa-solid fa-file-export"></i> Export
          </button>
          <button class="btn btn-primary btn-sm" id="btnAddTxn">
            <i class="fa-solid fa-plus"></i> New Transaction
          </button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-row">
            <div class="kpi-icon orange"><i class="fa-solid fa-arrow-trend-up"></i></div>
            <span class="kpi-badge up"><i class="fa-solid fa-arrow-up"></i> 12.4%</span>
          </div>
          <div class="kpi-value" id="statRevenue">\u2014</div>
          <div class="kpi-label">Total Revenue (LKR)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-row">
            <div class="kpi-icon red"><i class="fa-solid fa-arrow-trend-down"></i></div>
            <span class="kpi-badge down"><i class="fa-solid fa-arrow-down"></i> 5.1%</span>
          </div>
          <div class="kpi-value" id="statExpenses">\u2014</div>
          <div class="kpi-label">Total Expenses (LKR)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-row">
            <div class="kpi-icon green"><i class="fa-solid fa-sack-dollar"></i></div>
            <span class="kpi-badge up"><i class="fa-solid fa-arrow-up"></i> 18.7%</span>
          </div>
          <div class="kpi-value" id="statNetProfit">\u2014</div>
          <div class="kpi-label">Net Profit (LKR)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-row">
            <div class="kpi-icon blue"><i class="fa-solid fa-hourglass-half"></i></div>
            <span class="kpi-badge down"><i class="fa-solid fa-arrow-down"></i> 3.2%</span>
          </div>
          <div class="kpi-value" id="statReceivables">\u2014</div>
          <div class="kpi-label">Outstanding Receivables (LKR)</div>
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="tab-bar">
        <button class="tab-btn active" onclick="switchTab('transactions',this)"><i class="fa-solid fa-list"></i> Transactions</button>
        <button class="tab-btn" onclick="switchTab('invoices',this)"><i class="fa-solid fa-file-invoice"></i> Invoices</button>
        <button class="tab-btn" onclick="switchTab('expenses',this)"><i class="fa-solid fa-receipt"></i> Expenses</button>
        <button class="tab-btn" onclick="switchTab('rpts',this)"><i class="fa-solid fa-chart-bar"></i> Reports</button>
      </div>

      <!-- ══ TAB: Transactions ══ -->
      <div class="tab-panel active" id="tab-transactions">

        <!-- Filter Bar -->
        <div class="filter-bar">
          <div class="search-wrap">
            <i class="fa-solid fa-magnifying-glass"></i>
            <input type="text" id="txnSearch" placeholder="Search by ID, reference, description\u2026"/>
          </div>
          <select id="txnTypeFilter">
            <option value="">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select id="txnStatusFilter">
            <option value="">All Statuses</option>
            <option value="cleared">Cleared</option>
            <option value="pending">Pending</option>
            <option value="voided">Voided</option>
          </select>
          <input type="date" id="txnDateFrom" title="From date"/>
          <input type="date" id="txnDateTo" title="To date"/>
          <button class="btn btn-ghost btn-sm" onclick="clearFilters()">
            <i class="fa-solid fa-xmark"></i> Clear
          </button>
        </div>

        <!-- Table -->
        <div class="table-wrap">
          <table class="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Date</th>
                <th>Reference</th>
                <th>Description</th>
                <th>Type</th>
                <th>Amount (LKR)</th>
                <th>Balance (LKR)</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody id="txnBody">
              <tr><td colspan="9" style="text-align:center;padding:2.5rem;color:var(--color-neutral-400);">Loading\u2026</td></tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div class="pagination-bar">
          <span id="paginationInfo">Showing 0\u20130 of 0 transactions</span>
          <div class="pagination-btns" id="paginationBtns"></div>
        </div>

      </div><!-- /tab-transactions -->

      <!-- ══ TAB: Invoices ══ -->
      <div class="tab-panel" id="tab-invoices">
        <div class="coming-soon">
          <i class="fa-solid fa-file-invoice-dollar"></i>
          <p>Invoices management coming soon</p>
          <p style="font-size:.8rem;margin-top:.3rem;color:var(--color-neutral-400);">Create, track and manage customer invoices from here.</p>
        </div>
      </div>

      <!-- ══ TAB: Expenses ══ -->
      <div class="tab-panel" id="tab-expenses">
        <div class="coming-soon">
          <i class="fa-solid fa-receipt"></i>
          <p>Expenses tracker coming soon</p>
          <p style="font-size:.8rem;margin-top:.3rem;color:var(--color-neutral-400);">Record and categorise all business expenses in one place.</p>
        </div>
      </div>

      <!-- ══ TAB: Reports ══ -->
      <div class="tab-panel" id="tab-rpts">
        <div class="coming-soon">
          <i class="fa-solid fa-chart-pie"></i>
          <p>Financial reports coming soon</p>
          <p style="font-size:.8rem;margin-top:.3rem;color:var(--color-neutral-400);">Profit &amp; loss, balance sheet, cash flow and more.</p>
        </div>
      </div>

    </div><!-- /page-content -->
  </div><!-- /main-wrapper -->
</div><!-- /app-shell -->


<!-- ══════════════════════════════════════════════════════ -->
<!--  EXPORT MODAL                                         -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal-overlay" id="exportModal">
  <div class="modal" style="max-width:420px;">
    <div class="modal-header">
      <h3 class="modal-title"><i class="fa-solid fa-file-export" style="color:var(--primary,#f97316);"></i> Export Transactions</h3>
      <button class="modal-close" onclick="closeExportModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label class="form-label">Format</label>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="exportFmt" value="csv" checked/>
            <span><i class="fa-solid fa-file-csv"></i> CSV (Excel compatible)</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="exportFmt" value="json"/>
            <span><i class="fa-solid fa-code"></i> JSON</span>
          </label>
        </div>
      </div>
      <div class="form-group" style="margin-top:.75rem;">
        <label class="form-label">Scope</label>
        <div class="radio-group">
          <label class="radio-option">
            <input type="radio" name="exportScope" value="filtered" checked/>
            <span>Current filter results</span>
          </label>
          <label class="radio-option">
            <input type="radio" name="exportScope" value="all"/>
            <span>All transactions</span>
          </label>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-ghost btn-sm" onclick="closeExportModal()">Cancel</button>
      <button class="btn btn-primary btn-sm" onclick="doExport()"><i class="fa-solid fa-download"></i> Download</button>
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════════ -->
<!--  ADD / EDIT TRANSACTION MODAL                         -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal-overlay" id="txnModal">
  <div class="modal" style="max-width:560px;">
    <div class="modal-header">
      <h3 class="modal-title" id="txnModalTitle">New Transaction</h3>
      <button class="modal-close" onclick="closeTxnModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <form id="txnForm">
      <div class="modal-body">

        <div class="form-section-title">Transaction Info</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Date</label>
            <input type="date" id="fDate" class="form-control" required/>
          </div>
          <div class="form-group">
            <label class="form-label required">Reference</label>
            <input type="text" id="fReference" class="form-control" placeholder="e.g. INV-2025-0042" required/>
          </div>
        </div>

        <div class="form-group" style="margin-top:.75rem;">
          <label class="form-label required">Description</label>
          <input type="text" id="fDescription" class="form-control" placeholder="Describe this transaction\u2026" required/>
        </div>

        <div class="form-section-title" style="margin-top:1rem;">Classification</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Type</label>
            <select id="fType" class="form-control" required>
              <option value="">Select type</option>
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>
          </div>
          <div class="form-group">
            <label class="form-label">Category</label>
            <select id="fCategory" class="form-control">
              <option value="Sales">Sales</option>
              <option value="Supplier Payment">Supplier Payment</option>
              <option value="Payroll">Payroll</option>
              <option value="Rent">Rent</option>
              <option value="Utilities">Utilities</option>
              <option value="HR">HR</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div class="form-section-title" style="margin-top:1rem;">Financials &amp; Status</div>
        <div class="form-grid-2">
          <div class="form-group">
            <label class="form-label required">Amount (LKR)</label>
            <input type="number" id="fAmount" class="form-control" placeholder="e.g. 125000" min="1" step="0.01" required/>
          </div>
          <div class="form-group">
            <label class="form-label">Status</label>
            <select id="fStatus" class="form-control">
              <option value="cleared">Cleared</option>
              <option value="pending" selected>Pending</option>
              <option value="voided">Voided</option>
            </select>
          </div>
        </div>

        <div class="form-group" style="margin-top:.75rem;">
          <label class="form-label">Notes</label>
          <textarea id="fNotes" class="form-control" rows="2" placeholder="Optional notes\u2026"></textarea>
        </div>

      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-ghost btn-sm" onclick="closeTxnModal()">Cancel</button>
        <button type="submit" class="btn btn-primary btn-sm" id="txnModalSaveBtn">
          <i class="fa-solid fa-plus"></i> Create
        </button>
      </div>
    </form>
  </div>
</div>


<!-- ══════════════════════════════════════════════════════ -->
<!--  DELETE CONFIRMATION MODAL                            -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="modal-overlay" id="deleteTxnModal">
  <div class="modal" style="max-width:400px;">
    <div class="modal-header">
      <h3 class="modal-title" style="color:#dc2626;">
        <i class="fa-solid fa-triangle-exclamation"></i> Delete Transaction
      </h3>
      <button class="modal-close" onclick="closeDeleteModal()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="modal-body" style="text-align:center;padding:1.5rem 1.25rem;">
      <div style="width:52px;height:52px;border-radius:50%;background:#fef2f2;color:#dc2626;display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin:0 auto 1rem;">
        <i class="fa-solid fa-trash"></i>
      </div>
      <p style="font-size:.88rem;color:var(--color-neutral-600);line-height:1.6;">
        Are you sure you want to delete<br/>
        <strong id="deleteTxnRef">this transaction</strong>?<br/>
        <span style="font-size:.75rem;color:var(--color-neutral-400);">This action cannot be undone.</span>
      </p>
    </div>
    <div class="modal-footer" style="justify-content:center;gap:.75rem;">
      <button class="btn btn-ghost btn-sm" onclick="closeDeleteModal()">Cancel</button>
      <button class="btn btn-danger btn-sm" onclick="confirmDeleteTxn()">
        <i class="fa-solid fa-trash"></i> Delete
      </button>
    </div>
  </div>
</div>


<!-- ══════════════════════════════════════════════════════ -->
<!--  TRANSACTION DETAIL DRAWER                            -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="drawer-overlay" id="drawerOverlay" onclick="closeTxnDrawer()"></div>
<div class="txn-drawer" id="txnDrawer">
  <div class="vd-header" id="txnDrawerHeader"></div>
  <div class="vd-body"   id="txnDrawerBody"></div>
  <div class="vd-footer" id="txnDrawerFooter"></div>
</div>


<!-- ══════════════════════════════════════════════════════ -->
<!--  GLOBAL OVERLAYS                                      -->
<!-- ══════════════════════════════════════════════════════ -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="toast-container"  id="toastContainer"></div>

<script src="../../assets/js/utils.js"></script>
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="../../assets/js/toast.js"></script>
<script src="accounting.js"></script>
</body>
</html>
"""

html_path = os.path.join(ACC_DIR, 'index.html')
with open(html_path, 'w', encoding='utf-8') as f:
    f.write(html)
print(f'HTML written : {html_path}  (lines={html.count(chr(10))})')

print('\nDone. All 4 files written successfully.')
