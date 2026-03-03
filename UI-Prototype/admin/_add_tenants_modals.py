"""
Injects Add Tenant, View Tenant, Edit Tenant, and Confirm Action modals
into tenants.html, and creates tenants.js for the modal interaction logic.
"""
import re, pathlib

BASE = pathlib.Path(__file__).parent

# ── 1. Modal HTML ─────────────────────────────────────────────────────────────
ADD_TENANT_MODAL = '''
<!-- ============================================================
     ADD TENANT MODAL
     ============================================================ -->
<div class="modal-overlay" id="addTenantModal" role="dialog" aria-modal="true" aria-labelledby="modalTitle">
  <div class="modal-dialog modal-lg">
    <div class="modal-header">
      <div class="modal-title-area">
        <div class="modal-icon"><i class="fa-solid fa-store"></i></div>
        <div>
          <h2 class="modal-title" id="modalTitle">Add New Tenant</h2>
          <p class="modal-subtitle">Register a new store / business on the platform</p>
        </div>
      </div>
      <button class="modal-close-btn modal-close" id="closeAddTenantModal" title="Close" data-modal-close>
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="addTenantForm" novalidate>
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-building"></i> Business Identity</h3>
          <div class="form-grid-2">
            <div class="form-group form-col-full">
              <label class="form-label">Business Name <span class="req">*</span></label>
              <input type="text" class="form-input" name="name" placeholder="e.g. Perera Mart" required>
            </div>
            <div class="form-group">
              <label class="form-label">Business Type <span class="req">*</span></label>
              <select class="form-input" name="business_type" required>
                <option value="">— Select Type —</option>
                <option value="RETAIL">Retail</option><option value="WHOLESALE">Wholesale</option>
                <option value="RESTAURANT">Restaurant</option><option value="PHARMACY">Pharmacy</option>
                <option value="SUPERMARKET">Supermarket</option><option value="BOUTIQUE">Boutique</option>
                <option value="ELECTRONICS">Electronics</option><option value="HARDWARE">Hardware</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Business Reg. Number</label>
              <input type="text" class="form-input" name="business_reg" placeholder="SL BR number (optional)">
            </div>
            <div class="form-group">
              <label class="form-label">VAT / Tax ID</label>
              <input type="text" class="form-input" name="tax_id" placeholder="VAT Reg. No. (optional)">
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-address-card"></i> Contact Details</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Contact Email <span class="req">*</span></label>
              <input type="email" class="form-input" name="contact_email" placeholder="owner@store.lk" required>
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone <span class="req">*</span></label>
              <input type="tel" class="form-input" name="contact_phone" placeholder="+94 77 123 4567" required>
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-location-dot"></i> Address</h3>
          <div class="form-grid-2">
            <div class="form-group form-col-full">
              <label class="form-label">Address Line 1 <span class="req">*</span></label>
              <input type="text" class="form-input" name="address_line1" placeholder="Street address" required>
            </div>
            <div class="form-group form-col-full">
              <label class="form-label">Address Line 2</label>
              <input type="text" class="form-input" name="address_line2" placeholder="Apartment, suite, floor, etc.">
            </div>
            <div class="form-group">
              <label class="form-label">City <span class="req">*</span></label>
              <input type="text" class="form-input" name="city" placeholder="e.g. Colombo" required>
            </div>
            <div class="form-group">
              <label class="form-label">Province <span class="req">*</span></label>
              <select class="form-input" name="province" required>
                <option value="">— Select Province —</option>
                <option value="WP">Western Province</option><option value="CP">Central Province</option>
                <option value="SP">Southern Province</option><option value="NP">Northern Province</option>
                <option value="EP">Eastern Province</option><option value="NW">North Western Province</option>
                <option value="NC">North Central Province</option><option value="UV">Uva Province</option>
                <option value="SB">Sabaragamuwa Province</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Postal Code</label>
              <input type="text" class="form-input" name="postal_code" placeholder="Optional">
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-credit-card"></i> Subscription Plan</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Plan <span class="req">*</span></label>
              <select class="form-input" name="plan" required>
                <option value="FREE">Free — ₨0 / mo</option>
                <option value="STARTER">Starter — ₨2,999 / mo</option>
                <option value="PRO" selected>Pro — ₨9,999 / mo</option>
                <option value="ENTERPRISE">Enterprise — ₨29,999 / mo</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Billing Cycle</label>
              <select class="form-input" name="billing_cycle">
                <option value="MONTHLY">Monthly</option>
                <option value="ANNUAL">Annual (≈17% off)</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Initial Status</label>
              <select class="form-input" name="status">
                <option value="TRIAL">Trial</option>
                <option value="ACTIVE" selected>Active</option>
              </select>
            </div>
          </div>
          <div class="plan-hint" id="planHint">
            <i class="fa-solid fa-circle-info"></i>
            <span id="planHintText">Pro: up to 20 users, 10,000 products, 5 locations.</span>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" id="cancelAddTenant" data-modal-close>Cancel</button>
      <button type="button" class="btn btn-primary" id="submitAddTenant">
        <i class="fa-solid fa-plus"></i> Create Tenant
      </button>
    </div>
  </div>
</div>
'''

VIEW_TENANT_MODAL = '''
<!-- ============================================================
     VIEW TENANT MODAL
     ============================================================ -->
<div class="modal-overlay" id="viewTenantModal" role="dialog" aria-modal="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-header">
      <div class="modal-title-area">
        <div class="modal-icon modal-icon--view"><i class="fa-solid fa-eye"></i></div>
        <div>
          <h2 class="modal-title" id="viewTenantNameTitle">Tenant Details</h2>
          <p class="modal-subtitle" id="viewTenantDomainSubtitle">—</p>
        </div>
      </div>
      <button class="modal-close-btn modal-close" title="Close" data-modal-close>
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="modal-body">
      <!-- Top strip: ID + Plan + Status -->
      <div class="view-meta-strip">
        <div class="view-meta-item">
          <span class="view-meta-label"><i class="fa-solid fa-fingerprint"></i> Tenant ID</span>
          <code class="tenant-id" id="viewTenantId">—</code>
        </div>
        <div class="view-meta-item">
          <span class="view-meta-label"><i class="fa-solid fa-layer-group"></i> Plan</span>
          <span id="viewTenantPlan">—</span>
        </div>
        <div class="view-meta-item">
          <span class="view-meta-label"><i class="fa-solid fa-circle-dot"></i> Status</span>
          <span id="viewTenantStatus">—</span>
        </div>
        <div class="view-meta-item">
          <span class="view-meta-label"><i class="fa-solid fa-calendar"></i> Registered</span>
          <span id="viewTenantRegDate">—</span>
        </div>
      </div>
      <!-- Detail rows -->
      <div class="view-detail-grid">
        <div class="view-detail-section">
          <h4 class="view-section-title"><i class="fa-solid fa-users"></i> Team &amp; Usage</h4>
          <div class="view-field-list">
            <div class="view-field"><span class="vf-label">Employees</span><span class="vf-value" id="viewTenantEmployees">—</span></div>
            <div class="view-field"><span class="vf-label">Storage Used</span><span class="vf-value" id="viewTenantStorage">—</span></div>
            <div class="view-field"><span class="vf-label">Monthly Revenue</span><span class="vf-value" id="viewTenantRevenue">—</span></div>
          </div>
        </div>
        <div class="view-detail-section">
          <h4 class="view-section-title"><i class="fa-solid fa-globe"></i> Domain &amp; Settings</h4>
          <div class="view-field-list">
            <div class="view-field"><span class="vf-label">Subdomain</span><span class="vf-value" id="viewTenantDomainField">—</span></div>
            <div class="view-field"><span class="vf-label">Business Type</span><span class="vf-value">Retail</span></div>
            <div class="view-field"><span class="vf-label">Timezone</span><span class="vf-value">Asia/Colombo</span></div>
          </div>
        </div>
      </div>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-modal-close>Close</button>
      <button type="button" class="btn btn-outline" id="viewToEditBtn">
        <i class="fa-solid fa-pen"></i> Edit Tenant
      </button>
    </div>
  </div>
</div>
'''

EDIT_TENANT_MODAL = '''
<!-- ============================================================
     EDIT TENANT MODAL
     ============================================================ -->
<div class="modal-overlay" id="editTenantModal" role="dialog" aria-modal="true">
  <div class="modal-dialog modal-lg">
    <div class="modal-header">
      <div class="modal-title-area">
        <div class="modal-icon modal-icon--edit"><i class="fa-solid fa-pen"></i></div>
        <div>
          <h2 class="modal-title">Edit Tenant</h2>
          <p class="modal-subtitle" id="editTenantSubtitle">Update store information</p>
        </div>
      </div>
      <button class="modal-close-btn modal-close" title="Close" data-modal-close>
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="editTenantForm" novalidate>
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-building"></i> Business Identity</h3>
          <div class="form-grid-2">
            <div class="form-group form-col-full">
              <label class="form-label">Business Name <span class="req">*</span></label>
              <input type="text" class="form-input" name="name" id="editName" required>
            </div>
            <div class="form-group">
              <label class="form-label">Business Type</label>
              <select class="form-input" name="business_type" id="editBusinessType">
                <option value="RETAIL">Retail</option><option value="WHOLESALE">Wholesale</option>
                <option value="RESTAURANT">Restaurant</option><option value="PHARMACY">Pharmacy</option>
                <option value="SUPERMARKET">Supermarket</option><option value="BOUTIQUE">Boutique</option>
                <option value="ELECTRONICS">Electronics</option><option value="HARDWARE">Hardware</option>
                <option value="OTHER">Other</option>
              </select>
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-address-card"></i> Contact Details</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Contact Email <span class="req">*</span></label>
              <input type="email" class="form-input" name="contact_email" id="editEmail" required>
            </div>
            <div class="form-group">
              <label class="form-label">Contact Phone</label>
              <input type="tel" class="form-input" name="contact_phone" id="editPhone" placeholder="+94 77 123 4567">
            </div>
          </div>
        </div>
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-credit-card"></i> Subscription</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Plan</label>
              <select class="form-input" name="plan" id="editPlan">
                <option value="FREE">Free — ₨0 / mo</option>
                <option value="STARTER">Starter — ₨2,999 / mo</option>
                <option value="PRO">Pro — ₨9,999 / mo</option>
                <option value="ENTERPRISE">Enterprise — ₨29,999 / mo</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Status</label>
              <select class="form-input" name="status" id="editStatus">
                <option value="ACTIVE">Active</option>
                <option value="TRIAL">Trial</option>
                <option value="SUSPENDED">Suspended</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-modal-close>Cancel</button>
      <button type="button" class="btn btn-primary" id="submitEditTenant">
        <i class="fa-solid fa-floppy-disk"></i> Save Changes
      </button>
    </div>
  </div>
</div>
'''

CONFIRM_MODAL = '''
<!-- ============================================================
     CONFIRM ACTION MODAL
     ============================================================ -->
<div class="modal-overlay" id="confirmActionModal" role="dialog" aria-modal="true">
  <div class="modal-dialog modal-sm">
    <div class="modal-header">
      <div class="modal-title-area">
        <div class="modal-icon" id="confirmModalIcon"><i class="fa-solid fa-triangle-exclamation"></i></div>
        <div>
          <h2 class="modal-title" id="confirmModalTitle">Confirm Action</h2>
        </div>
      </div>
      <button class="modal-close-btn modal-close" title="Close" data-modal-close>
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="modal-body">
      <p class="confirm-modal-msg" id="confirmModalMsg">Are you sure you want to proceed?</p>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-modal-close>Cancel</button>
      <button type="button" class="btn btn-danger" id="confirmModalBtn">
        <i class="fa-solid fa-check"></i> Confirm
      </button>
    </div>
  </div>
</div>

<div class="sidebar-overlay" id="sidebarOverlay"></div>
'''

ALL_MODALS = ADD_TENANT_MODAL + VIEW_TENANT_MODAL + EDIT_TENANT_MODAL + CONFIRM_MODAL

# ── 2. Patch tenants.html ─────────────────────────────────────────────────────
tenants_path = BASE / "tenants.html"
html = tenants_path.read_text(encoding="utf-8")

# Check each modal
for mid in ["addTenantModal", "viewTenantModal", "editTenantModal", "confirmActionModal"]:
    if f'id="{mid}"' in html:
        print(f"[INFO] {mid} already present — skipping full inject")
        # Still inject missing ones by removing from ALL_MODALS? For safety, full replace.
        break
else:
    print("[INFO] No modals present — fresh inject")

# Insert ALL_MODALS before the first <script src
SCRIPT_ANCHOR = '<script src="../assets/js/layout.js">'
if SCRIPT_ANCHOR not in html:
    print("[ERR] Cannot find script anchor in tenants.html")
    exit(1)

# Remove any existing modal HTML (clean slate)
for mid in ["addTenantModal", "viewTenantModal", "editTenantModal", "confirmActionModal"]:
    # Remove entire div block if present
    pattern = rf'<!-- ===+\s+{mid.upper().replace("-","[\\s\\S]*?")}[\s\S]*?<\/div><!--\s*\/#{re.escape(mid)}'
    html = re.sub(pattern, '', html)

# Remove old sidebar-overlay if present
html = re.sub(r'\n?<div class="sidebar-overlay"[^>]*></div>', '', html)

# Insert modals before layout.js script
html = html.replace(SCRIPT_ANCHOR, ALL_MODALS + SCRIPT_ANCHOR)

# Add tenants.js script reference (after admin.js)
if 'tenants.js' not in html:
    html = html.replace(
        '<script src="admin.js"></script>',
        '<script src="admin.js"></script>\n  <script src="tenants.js"></script>'
    )

tenants_path.write_text(html, encoding="utf-8")
print("[OK] tenants.html updated — all 4 modals injected")

# ── 3. Create tenants.js ──────────────────────────────────────────────────────
TENANTS_JS = r"""/* ============================================================
   tenants.js — Tenants page specific interactivity
   Handles: View / Edit / Confirm action modals in tenants.html
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  // ── Helper: read tenant data from a table row ──────────────────
  function rowData(row) {
    return {
      name:      row.querySelector('.store-name')?.textContent.trim()  || '—',
      domain:    row.querySelector('.store-domain')?.textContent.trim() || '—',
      tenantId:  row.querySelector('.tenant-id')?.textContent.trim()   || '—',
      plan:      row.cells[3]?.querySelector('.badge')?.textContent.trim() || '—',
      planClass: row.cells[3]?.querySelector('.badge')?.className || '',
      status:    row.cells[4]?.querySelector('.badge')?.textContent.trim() || '—',
      statusClass: row.cells[4]?.querySelector('.badge')?.className || '',
      employees: row.cells[5]?.textContent.trim() || '—',
      storage:   row.querySelector('.storage-text')?.textContent.trim() || '—',
      revenue:   row.cells[7]?.textContent.trim() || '—',
      regDate:   row.cells[8]?.textContent.trim() || '—',
    };
  }

  // ── VIEW MODAL ─────────────────────────────────────────────────
  function populateView(t) {
    setText('viewTenantNameTitle',    t.name);
    setText('viewTenantDomainSubtitle', t.domain);
    setText('viewTenantId',           t.tenantId);
    setText('viewTenantRegDate',      t.regDate);
    setText('viewTenantEmployees',    t.employees);
    setText('viewTenantStorage',      t.storage);
    setText('viewTenantRevenue',      t.revenue);
    setText('viewTenantDomainField',  t.domain);

    const planEl = document.getElementById('viewTenantPlan');
    if (planEl) { planEl.className = ''; planEl.innerHTML = `<span class="${t.planClass}">${t.plan}</span>`; }

    const statusEl = document.getElementById('viewTenantStatus');
    if (statusEl) { statusEl.className = ''; statusEl.innerHTML = `<span class="${t.statusClass}">${t.status}</span>`; }
  }

  // ── EDIT MODAL ─────────────────────────────────────────────────
  function populateEdit(t) {
    setText('editTenantSubtitle', t.domain);
    setVal('editName',  t.name);
    setVal('editEmail', '');       // not available from DOM — leave blank
    setVal('editPhone', '');       // not available from DOM — leave blank

    // Set plan select
    const planMap = { 'Free': 'FREE', 'Starter': 'STARTER', 'Pro': 'PRO', 'Enterprise': 'ENTERPRISE' };
    setSelect('editPlan', planMap[t.plan] || 'PRO');

    // Set status select
    const statusMap = { 'Active': 'ACTIVE', 'Trial': 'TRIAL', 'Suspended': 'SUSPENDED' };
    setSelect('editStatus', statusMap[t.status] || 'ACTIVE');
  }

  // ── CONFIRM MODAL ───────────────────────────────────────────────
  let _confirmCallback = null;

  function setupConfirm({ title, msg, btnLabel, btnClass, icon, callback }) {
    setText('confirmModalTitle', title);
    setText('confirmModalMsg',   msg);

    const btn = document.getElementById('confirmModalBtn');
    if (btn) {
      btn.textContent = btnLabel;
      btn.className   = `btn ${btnClass}`;
    }

    const iconEl = document.getElementById('confirmModalIcon');
    if (iconEl) iconEl.innerHTML = `<i class="fa-solid ${icon}"></i>`;

    _confirmCallback = callback;
  }

  document.getElementById('confirmModalBtn')?.addEventListener('click', () => {
    if (typeof _confirmCallback === 'function') _confirmCallback();
    if (typeof closeModal === 'function') closeModal('confirmActionModal');
    _confirmCallback = null;
  });

  // ── VIEW → EDIT shortcut ────────────────────────────────────────
  let _activeRowRef = null;

  document.getElementById('viewToEditBtn')?.addEventListener('click', () => {
    if (_activeRowRef) {
      populateEdit(rowData(_activeRowRef));
      if (typeof closeModal === 'function') closeModal('viewTenantModal');
      if (typeof openModal  === 'function') openModal('editTenantModal');
    }
  });

  // ── EDIT SUBMIT ─────────────────────────────────────────────────
  document.getElementById('submitEditTenant')?.addEventListener('click', () => {
    const nameInput = document.getElementById('editName');
    if (!nameInput?.value.trim()) {
      nameInput?.classList.add('input-error');
      return;
    }
    nameInput?.classList.remove('input-error');

    // Update row in table (optimistic UI)
    if (_activeRowRef) {
      const nameCell = _activeRowRef.querySelector('.store-name');
      if (nameCell) nameCell.textContent = nameInput.value.trim();
    }

    if (typeof closeModal === 'function') closeModal('editTenantModal');
    showTenantsToast('Tenant updated successfully.');
    _activeRowRef = null;
  });

  // ── TABLE ROW ACTIONS ───────────────────────────────────────────
  document.querySelector('.data-table tbody')?.addEventListener('click', e => {
    const viewBtn    = e.target.closest('[title="View"]');
    const editBtn    = e.target.closest('[title="Edit"]');
    const suspendBtn = e.target.closest('[title="Suspend"]');
    const activateBtn= e.target.closest('[title="Activate"]');

    if (viewBtn) {
      const row = viewBtn.closest('tr');
      _activeRowRef = row;
      populateView(rowData(row));
      if (typeof openModal === 'function') openModal('viewTenantModal');
    }

    if (editBtn) {
      const row = editBtn.closest('tr');
      _activeRowRef = row;
      populateEdit(rowData(row));
      if (typeof openModal === 'function') openModal('editTenantModal');
    }

    if (suspendBtn) {
      const row = suspendBtn.closest('tr');
      const t   = rowData(row);
      setupConfirm({
        title:    'Suspend Tenant',
        msg:      `Are you sure you want to suspend "${t.name}"? They will lose access to the platform immediately.`,
        btnLabel: 'Suspend',
        btnClass: 'btn-danger',
        icon:     'fa-ban',
        callback: () => {
          // Toggle badge and button in UI
          const statusBadge = row.cells[4]?.querySelector('.badge');
          if (statusBadge) { statusBadge.className = 'badge badge-suspended'; statusBadge.textContent = 'Suspended'; }
          suspendBtn.title = 'Activate';
          suspendBtn.innerHTML = '<i class="fa-solid fa-circle-check"></i>';
          suspendBtn.classList.remove('text-danger');
          suspendBtn.classList.add('text-success');
          showTenantsToast(`"${t.name}" suspended.`, 'warn');
        },
      });
      if (typeof openModal === 'function') openModal('confirmActionModal');
    }

    if (activateBtn) {
      const row = activateBtn.closest('tr');
      const t   = rowData(row);
      setupConfirm({
        title:    'Activate Tenant',
        msg:      `Re-activate "${t.name}"? They will regain full platform access.`,
        btnLabel: 'Activate',
        btnClass: 'btn-success',
        icon:     'fa-circle-check',
        callback: () => {
          const statusBadge = row.cells[4]?.querySelector('.badge');
          if (statusBadge) { statusBadge.className = 'badge badge-active'; statusBadge.textContent = 'Active'; }
          activateBtn.title = 'Suspend';
          activateBtn.innerHTML = '<i class="fa-solid fa-ban"></i>';
          activateBtn.classList.remove('text-success');
          activateBtn.classList.add('text-danger');
          showTenantsToast(`"${t.name}" activated.`);
        },
      });
      if (typeof openModal === 'function') openModal('confirmActionModal');
    }
  });

  // ── Utilities ───────────────────────────────────────────────────
  function setText(id, val) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
  function setVal(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }
  function setSelect(id, val) {
    const el = document.getElementById(id);
    if (el) el.value = val;
  }

  function showTenantsToast(msg, type = 'success') {
    const colors = { success: '#16a34a', warn: '#d97706', error: '#dc2626' };
    const t = Object.assign(document.createElement('div'), { textContent: msg });
    Object.assign(t.style, {
      position: 'fixed', bottom: '24px', right: '24px',
      padding: '12px 20px', borderRadius: '8px',
      fontSize: '14px', fontWeight: '500', zIndex: '9999',
      background: colors[type] || colors.success,
      color: '#fff', boxShadow: '0 4px 12px rgba(0,0,0,0.18)',
    });
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3200);
  }

});
"""

tenants_js_path = BASE / "tenants.js"
tenants_js_path.write_text(TENANTS_JS, encoding="utf-8")
print("[OK] tenants.js created")

# ── 4. Patch tenants.css with new modal styles ────────────────────────────────
TENANTS_CSS_ADDON = """

/* ── VIEW MODAL STYLES ── */
.modal-icon--view { background: var(--color-info-100, #dbeafe); color: var(--color-info-600, #2563eb); }
.modal-icon--edit { background: var(--color-warning-100, #fef3c7); color: var(--color-warning-600, #d97706); }
.modal-sm .modal-dialog { max-width: 460px; }

.view-meta-strip {
  display: flex; flex-wrap: wrap; gap: 1rem;
  background: var(--color-surface-alt, #f9fafb);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: 10px; padding: 1rem 1.25rem; margin-bottom: 1.25rem;
}
.view-meta-item { display: flex; flex-direction: column; gap: 3px; min-width: 120px; flex: 1; }
.view-meta-label { font-size: 0.72rem; text-transform: uppercase; letter-spacing: 0.05em; color: var(--color-text-muted, #6b7280); display: flex; align-items: center; gap: 4px; }
.view-meta-label i { font-size: 10px; }

.view-detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
@media (max-width: 600px) { .view-detail-grid { grid-template-columns: 1fr; } }

.view-detail-section { background: var(--color-surface, #fff); border: 1px solid var(--color-border, #e5e7eb); border-radius: 10px; padding: 1rem 1.25rem; }
.view-section-title { font-size: 0.82rem; font-weight: 600; color: var(--color-text-secondary, #374151); display: flex; align-items: center; gap: 6px; margin: 0 0 0.75rem 0; }
.view-field-list { display: flex; flex-direction: column; gap: 0.6rem; }
.view-field { display: flex; justify-content: space-between; align-items: center; font-size: 0.875rem; }
.vf-label { color: var(--color-text-muted, #6b7280); }
.vf-value { font-weight: 500; color: var(--color-text-primary, #111827); }

/* ── CONFIRM MODAL STYLES ── */
.confirm-modal-msg { font-size: 0.95rem; color: var(--color-text-secondary, #374151); line-height: 1.6; margin: 0; }
.btn-success { background: var(--color-success-600, #16a34a); color: #fff; border: none; }
.btn-success:hover { background: var(--color-success-700, #15803d); }

/* ── INPUT ERROR STATE ── */
.input-error { border-color: var(--color-error-500, #ef4444) !important; box-shadow: 0 0 0 2px rgba(239,68,68,0.15); }
"""

tenants_css_path = BASE / "tenants.css"
css = tenants_css_path.read_text(encoding="utf-8")
if "VIEW MODAL STYLES" not in css:
    tenants_css_path.write_text(css + TENANTS_CSS_ADDON, encoding="utf-8")
    print("[OK] tenants.css updated with modal styles")
else:
    print("[INFO] tenants.css already has modal styles")

print("\nDone!")
