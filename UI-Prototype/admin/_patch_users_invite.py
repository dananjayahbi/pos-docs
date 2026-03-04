"""
_patch_users_invite.py
─────────────────────
Patches users.html to:
  1. Remove the top page-header div (Invite User button there)
  2. Rebuild table-header with Invite User button + IDs on controls
  3. Add IDs to stat cards, filter controls, table body, pagination
  4. Inject inviteUserModal HTML + sidebar overlay
  5. Link users.js script
Creates / updates:
  - users.js  (invite user modal handler + dynamic filter/pagination)
  - users.css (modal + table-header-actions styles appended)
"""

import re, os

BASE = os.path.dirname(os.path.abspath(__file__))
HTML = os.path.join(BASE, "users.html")
CSS  = os.path.join(BASE, "users.css")
JS   = os.path.join(BASE, "users.js")

# ──────────────────────────────────────────────
# 1. Load HTML
# ──────────────────────────────────────────────
with open(HTML, encoding="utf-8") as f:
    src = f.read()

patches_applied = []

# ──────────────────────────────────────────────
# 2. Remove page-header div block
# ──────────────────────────────────────────────
old_page_header = '''      <div class="page-header">
        <div class="page-header-left">
        </div>
        <div class="page-header-actions">
          <button class="btn btn-primary"><i class="fa-solid fa-envelope"></i> Invite User</button>
        </div>
      </div>'''
if old_page_header in src:
    src = src.replace(old_page_header, "")
    patches_applied.append("[OK] Removed page-header div")
else:
    patches_applied.append("[SKIP] page-header not found (already removed?)")

# ──────────────────────────────────────────────
# 3. Add IDs to stat cards
# ──────────────────────────────────────────────
old_stats = '''      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card"><div class="stat-value">24</div><div class="stat-label">Total Users</div></div>
        <div class="stat-card"><div class="stat-value text-danger">4</div><div class="stat-label">Super Admins</div></div>
        <div class="stat-card"><div class="stat-value text-primary">11</div><div class="stat-label">Support Staff</div></div>
        <div class="stat-card"><div class="stat-value text-warning">9</div><div class="stat-label">Billing Agents</div></div>
      </div>'''
new_stats = '''      <!-- Stats Row -->
      <div class="stats-row">
        <div class="stat-card"><div class="stat-value" id="statTotalUsers">24</div><div class="stat-label">Total Users</div></div>
        <div class="stat-card"><div class="stat-value text-danger" id="statSuperAdmins">4</div><div class="stat-label">Super Admins</div></div>
        <div class="stat-card"><div class="stat-value text-primary" id="statSupportStaff">11</div><div class="stat-label">Support Staff</div></div>
        <div class="stat-card"><div class="stat-value text-warning" id="statBillingAgents">9</div><div class="stat-label">Billing Agents</div></div>
      </div>'''
if old_stats in src:
    src = src.replace(old_stats, new_stats)
    patches_applied.append("[OK] Added IDs to stat cards")
else:
    patches_applied.append("[SKIP] Stat cards already patched")

# ──────────────────────────────────────────────
# 4. Add IDs to filter controls
# ──────────────────────────────────────────────
old_filter = '''      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" class="search-input" placeholder="Search name or email…"/>
        </div>
        <select class="filter-select">
          <option value="">All Roles</option>
          <option>Super Admin</option>
          <option>Support</option>
          <option>Billing</option>
        </select>
        <select class="filter-select">
          <option value="">All Status</option>
          <option>Active</option>
          <option>Inactive</option>
          <option>Pending</option>
        </select>
        <button class="btn btn-outline btn-sm"><i class="fa-solid fa-filter-circle-xmark"></i> Clear</button>
      </div>'''
new_filter = '''      <!-- Filter Bar -->
      <div class="filter-bar">
        <div class="search-box">
          <i class="fa-solid fa-magnifying-glass search-icon"></i>
          <input type="text" class="search-input" id="userSearchInput" placeholder="Search name or email…"/>
        </div>
        <select class="filter-select" id="roleFilterSelect">
          <option value="">All Roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="SUPPORT">Support</option>
          <option value="BILLING">Billing</option>
        </select>
        <select class="filter-select" id="statusFilterSelect">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
          <option value="PENDING">Pending</option>
        </select>
        <button class="btn btn-outline btn-sm" id="clearFiltersBtn"><i class="fa-solid fa-filter-circle-xmark"></i> Clear</button>
      </div>'''
if old_filter in src:
    src = src.replace(old_filter, new_filter)
    patches_applied.append("[OK] Added IDs to filter controls")
else:
    patches_applied.append("[SKIP] Filter controls already patched")

# ──────────────────────────────────────────────
# 5. Update table-header — add Invite User btn + IDs
# ──────────────────────────────────────────────
old_table_header = '''      <!-- Users Table -->
      <div class="table-card">
        <div class="table-header">
          <span class="table-count">Showing 7 of 24 users</span>
          <button class="btn btn-outline btn-sm"><i class="fa-solid fa-download"></i> Export</button>
        </div>'''
new_table_header = '''      <!-- Users Table -->
      <div class="table-card">
        <div class="table-header">
          <span class="table-count" id="tableCountLabel">Showing 7 of 24 users</span>
          <div class="table-header-actions">
            <button class="btn btn-outline btn-sm"><i class="fa-solid fa-download"></i> Export</button>
            <button class="btn btn-primary btn-sm" id="inviteUserBtn" data-modal-open="inviteUserModal">
              <i class="fa-solid fa-envelope"></i> Invite User
            </button>
          </div>
        </div>'''
if old_table_header in src:
    src = src.replace(old_table_header, new_table_header)
    patches_applied.append("[OK] Moved Invite User button into table-header")
else:
    patches_applied.append("[SKIP] table-header already patched")

# ──────────────────────────────────────────────
# 6. Add id to <tbody>
# ──────────────────────────────────────────────
old_tbody = "            <tbody>"
new_tbody = '            <tbody id="userTableBody">'
if old_tbody in src:
    src = src.replace(old_tbody, new_tbody, 1)
    patches_applied.append("[OK] Added id to tbody")
else:
    patches_applied.append("[SKIP] tbody id already present")

# ──────────────────────────────────────────────
# 7. Add IDs to table-footer (pagination info + controls)
# ──────────────────────────────────────────────
old_footer = '''        <div class="table-footer">
          <span class="pagination-info">Page 1 of 3 &nbsp;·&nbsp; 24 total records</span>
          <div class="pagination">
            <button class="page-btn" disabled><i class="fa-solid fa-chevron-left"></i></button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>'''
new_footer = '''        <div class="table-footer">
          <span class="pagination-info" id="paginationInfo">Page 1 of 3 &nbsp;·&nbsp; 24 total records</span>
          <div class="pagination" id="paginationControls">
            <button class="page-btn" disabled><i class="fa-solid fa-chevron-left"></i></button>
            <button class="page-btn active">1</button>
            <button class="page-btn">2</button>
            <button class="page-btn">3</button>
            <button class="page-btn"><i class="fa-solid fa-chevron-right"></i></button>
          </div>
        </div>'''
if old_footer in src:
    src = src.replace(old_footer, new_footer)
    patches_applied.append("[OK] Added IDs to table-footer pagination")
else:
    patches_applied.append("[SKIP] table-footer already patched")

# ──────────────────────────────────────────────
# 8. Inject modal HTML + sidebar overlay + users.js script
# ──────────────────────────────────────────────
MODAL_HTML = '''
<!-- ============================================================
     SIDEBAR OVERLAY (mobile)
     ============================================================ -->
<div class="sidebar-overlay" id="sidebarOverlay"></div>

<!-- ============================================================
     INVITE USER MODAL
     ============================================================ -->
<div class="modal-overlay" id="inviteUserModal" role="dialog" aria-modal="true" aria-labelledby="inviteUserModalTitle">
  <div class="modal-dialog modal-md">
    <div class="modal-header">
      <div class="modal-title-area">
        <div class="modal-icon modal-icon--invite"><i class="fa-solid fa-envelope-open-text"></i></div>
        <div>
          <h2 class="modal-title" id="inviteUserModalTitle">Invite Platform User</h2>
          <p class="modal-subtitle">Send an invitation to a new admin or support member</p>
        </div>
      </div>
      <button class="modal-close-btn" title="Close" data-modal-close>
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>
    <div class="modal-body">
      <form id="inviteUserForm" novalidate>

        <!-- Section 1: Identity -->
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-user"></i> User Identity</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Full Name <span class="req">*</span></label>
              <input type="text" class="form-input" id="inviteFullName" name="full_name"
                     placeholder="e.g. Kavinda Perera" required autocomplete="off"/>
            </div>
            <div class="form-group">
              <label class="form-label">Email Address <span class="req">*</span></label>
              <input type="email" class="form-input" id="inviteEmail" name="email"
                     placeholder="user@lcc.lk" required autocomplete="off"/>
            </div>
          </div>
        </div>

        <!-- Section 2: Role & Access -->
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-shield-halved"></i> Role &amp; Access</h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Platform Role <span class="req">*</span></label>
              <select class="form-input" id="inviteRole" name="role" required>
                <option value="">— Select Role —</option>
                <option value="SUPER_ADMIN">Super Admin</option>
                <option value="SUPPORT">Support Staff</option>
                <option value="BILLING">Billing Agent</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label">Initial Status</label>
              <select class="form-input" id="inviteStatus" name="status">
                <option value="PENDING" selected>Pending (awaits acceptance)</option>
                <option value="ACTIVE">Active (direct access)</option>
              </select>
            </div>
          </div>
          <!-- Role hint card -->
          <div class="role-hint" id="roleHintBox" style="display:none">
            <i class="fa-solid fa-circle-info"></i>
            <span id="roleHintText"></span>
          </div>
        </div>

        <!-- Section 3: Contact (optional) -->
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-phone"></i> Contact <span class="optional-label">(Optional)</span></h3>
          <div class="form-grid-2">
            <div class="form-group">
              <label class="form-label">Phone Number</label>
              <input type="tel" class="form-input" id="invitePhone" name="phone"
                     placeholder="+94 77 123 4567"/>
            </div>
            <div class="form-group">
              <label class="form-label">Department / Team</label>
              <input type="text" class="form-input" id="inviteDept" name="department"
                     placeholder="e.g. Customer Support"/>
            </div>
          </div>
        </div>

        <!-- Section 4: Invite Message (optional) -->
        <div class="form-section">
          <h3 class="form-section-title"><i class="fa-solid fa-message"></i> Invitation Message <span class="optional-label">(Optional)</span></h3>
          <div class="form-group">
            <textarea class="form-input form-textarea" id="inviteMessage" name="message"
                      rows="3" placeholder="Add a personal note to the invitation email…"></textarea>
          </div>
        </div>

      </form>
    </div>
    <div class="modal-footer">
      <button type="button" class="btn btn-ghost" data-modal-close id="cancelInviteUser">Cancel</button>
      <button type="button" class="btn btn-primary" id="submitInviteUser">
        <i class="fa-solid fa-paper-plane"></i> Send Invitation
      </button>
    </div>
  </div>
</div>
'''

old_script_block = '''<script src="../assets/js/layout.js"></script>
  <script src="admin-header.js"></script>
  <script src="admin.js"></script>
</body>'''
new_script_block = '''<script src="../assets/js/layout.js"></script>
  <script src="admin-header.js"></script>
  <script src="admin.js"></script>
  <script src="users.js"></script>
</body>'''

if "inviteUserModal" not in src:
    # Insert modals before </body>
    src = src.replace(
        old_script_block,
        MODAL_HTML + new_script_block
    )
    patches_applied.append("[OK] Injected inviteUserModal + sidebar overlay")
    patches_applied.append("[OK] Linked users.js")
else:
    patches_applied.append("[SKIP] inviteUserModal already present")
    # Still ensure users.js is linked
    if "users.js" not in src:
        src = src.replace(old_script_block, new_script_block)
        patches_applied.append("[OK] Linked users.js")

with open(HTML, "w", encoding="utf-8") as f:
    f.write(src)
patches_applied.append("[OK] users.html saved")

# ──────────────────────────────────────────────
# 9. Append CSS for modal + table-header-actions
# ──────────────────────────────────────────────
CSS_ADDITIONS = """

/* ── Invite User Modal ─────────────────────── */
.table-header-actions { display: flex; align-items: center; gap: 0.5rem; }

/* Modal icon colour — invite */
.modal-icon--invite { background: #ede9fe; color: #7c3aed; }

/* Role hint card inside modal */
.role-hint {
  display: flex; align-items: flex-start; gap: 0.5rem;
  background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 8px;
  padding: 0.625rem 0.875rem; margin-top: 0.625rem;
  font-size: 0.82rem; color: #0369a1; line-height: 1.5;
}
.role-hint i { margin-top: 0.125rem; flex-shrink: 0; }

/* Optional label in section title */
.optional-label { font-size: 0.75rem; font-weight: 400; color: var(--color-text-muted,#9ca3af); margin-left: 0.375rem; }

/* Textarea in modal */
.form-textarea { resize: vertical; min-height: 80px; font-family: inherit; }

/* Input error highlight */
.input-error { border-color: #ef4444 !important; box-shadow: 0 0 0 3px rgba(239,68,68,.12) !important; }

/* Invite success toast (injected by JS) */
.invite-toast {
  position: fixed; bottom: 1.5rem; right: 1.5rem; z-index: 9999;
  background: #16a34a; color: #fff; border-radius: 10px;
  padding: 0.75rem 1.25rem; font-size: 0.875rem; font-weight: 500;
  box-shadow: 0 4px 16px rgba(0,0,0,.18);
  display: flex; align-items: center; gap: 0.5rem;
  animation: toastIn .25s ease;
}
@keyframes toastIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
"""

with open(CSS, encoding="utf-8") as f:
    css_src = f.read()

if ".table-header-actions" not in css_src:
    with open(CSS, "a", encoding="utf-8") as f:
        f.write(CSS_ADDITIONS)
    patches_applied.append("[OK] users.css updated with modal + table-header-actions styles")
else:
    patches_applied.append("[SKIP] users.css already has table-header-actions")

# ──────────────────────────────────────────────
# 10. Write users.js
# ──────────────────────────────────────────────
USERS_JS = r"""/* users.js — Platform Users page logic — LCC Admin */
/* Handles: Invite User modal, dynamic filtering, pagination */

(function () {
  'use strict';

  /* ── Dataset ─────────────────────────────── */
  const USERS = [
    { id:'UID-001', name:'Kavinda Perera',        email:'k.perera@lcc.lk',           role:'SUPER_ADMIN', status:'ACTIVE',   phone:'+94 77 234 5678', dept:'Platform',        lastLogin:'Today, 09:14',      init:'KP', color:'ua-red'    },
    { id:'UID-002', name:'Nuwani Fernando',        email:'n.fernando@lcc.lk',         role:'SUPER_ADMIN', status:'ACTIVE',   phone:'+94 71 345 6789', dept:'Platform',        lastLogin:'Today, 08:55',      init:'NF', color:'ua-blue'   },
    { id:'UID-003', name:'Charith Bandara',        email:'c.bandara@lcc.lk',          role:'SUPER_ADMIN', status:'ACTIVE',   phone:'+94 76 456 7890', dept:'Platform',        lastLogin:'Yesterday, 22:10',  init:'CB', color:'ua-indigo' },
    { id:'UID-004', name:'Dilini Senanayake',      email:'d.senanayake@lcc.lk',       role:'SUPER_ADMIN', status:'INACTIVE', phone:'+94 70 567 8901', dept:'Platform',        lastLogin:'12 Jan 2026',       init:'DS', color:'ua-purple' },
    { id:'UID-005', name:'Sandun Rathnayake',      email:'s.rathnayake@lcc.lk',       role:'SUPPORT',     status:'ACTIVE',   phone:'+94 77 678 9012', dept:'Customer Support',lastLogin:'Yesterday, 17:32',  init:'SR', color:'ua-green'  },
    { id:'UID-006', name:'Harsha Wijesinghe',      email:'h.wijesinghe@lcc.lk',       role:'SUPPORT',     status:'ACTIVE',   phone:'+94 71 789 0123', dept:'Technical Support',lastLogin:'Today, 06:55',     init:'HW', color:'ua-teal'   },
    { id:'UID-007', name:'Dinusha Wickramasinghe', email:'d.wickramasinghe@lcc.lk',   role:'SUPPORT',     status:'ACTIVE',   phone:'+94 76 890 1234', dept:'Onboarding',      lastLogin:'2 Mar 2026',        init:'DW', color:'ua-purple' },
    { id:'UID-008', name:'Amali Gunawardena',      email:'a.gunawardena@lcc.lk',      role:'SUPPORT',     status:'ACTIVE',   phone:'+94 70 901 2345', dept:'Customer Support',lastLogin:'Today, 11:02',      init:'AG', color:'ua-orange' },
    { id:'UID-009', name:'Chathura Mendis',        email:'c.mendis@lcc.lk',           role:'SUPPORT',     status:'INACTIVE', phone:'+94 77 012 3456', dept:'Technical Support',lastLogin:'15 Feb 2026',      init:'CM', color:'ua-red'    },
    { id:'UID-010', name:'Sachini Dias',           email:'s.dias@lcc.lk',             role:'SUPPORT',     status:'PENDING',  phone:'+94 71 123 4567', dept:'Onboarding',      lastLogin:'— Never —',         init:'SD', color:'ua-blue'   },
    { id:'UID-011', name:'Tharushi Jayawardena',   email:'t.jayawardena@lcc.lk',      role:'BILLING',     status:'ACTIVE',   phone:'+94 76 234 5678', dept:'Finance',         lastLogin:'Today, 07:44',      init:'TJ', color:'ua-orange' },
    { id:'UID-012', name:'Roshan Kumara',          email:'r.kumara@lcc.lk',           role:'BILLING',     status:'ACTIVE',   phone:'+94 70 345 6789', dept:'Finance',         lastLogin:'Today, 09:30',      init:'RK', color:'ua-green'  },
    { id:'UID-013', name:'Nadeesha Perera',        email:'n.perera@lcc.lk',           role:'BILLING',     status:'ACTIVE',   phone:'+94 77 456 7890', dept:'Finance',         lastLogin:'Yesterday, 14:21',  init:'NP', color:'ua-teal'   },
    { id:'UID-014', name:'Pradeep Silva',          email:'p.silva@lcc.lk',            role:'BILLING',     status:'ACTIVE',   phone:'+94 71 567 8901', dept:'Finance',         lastLogin:'Today, 10:15',      init:'PS', color:'ua-indigo' },
    { id:'UID-015', name:'Thilina Madushanka',     email:'t.madushanka@lcc.lk',       role:'BILLING',     status:'INACTIVE', phone:'+94 76 678 9012', dept:'Finance',         lastLogin:'8 Jan 2026',        init:'TM', color:'ua-red'    },
    { id:'UID-016', name:'Roshani De Silva',       email:'r.desilva@lcc.lk',          role:'BILLING',     status:'INACTIVE', phone:'+94 70 789 0123', dept:'Finance',         lastLogin:'28 Feb 2026',       init:'RD', color:'ua-teal'   },
    { id:'UID-017', name:'Malshani Jayasekara',    email:'m.jayasekara@lcc.lk',       role:'SUPPORT',     status:'ACTIVE',   phone:'+94 77 890 1234', dept:'Customer Support',lastLogin:'Today, 08:00',      init:'MJ', color:'ua-purple' },
    { id:'UID-018', name:'Gayan Pathirana',        email:'g.pathirana@lcc.lk',        role:'SUPPORT',     status:'ACTIVE',   phone:'+94 71 901 2345', dept:'Technical Support',lastLogin:'Yesterday, 21:45', init:'GP', color:'ua-blue'   },
    { id:'UID-019', name:'Isuri Ranasinghe',       email:'i.ranasinghe@lcc.lk',       role:'SUPPORT',     status:'PENDING',  phone:'+94 76 012 3456', dept:'Onboarding',      lastLogin:'— Never —',         init:'IR', color:'ua-green'  },
    { id:'UID-020', name:'Shehan Weerasinghe',     email:'s.weerasinghe@lcc.lk',      role:'BILLING',     status:'ACTIVE',   phone:'+94 70 123 4567', dept:'Finance',         lastLogin:'Today, 07:10',      init:'SW', color:'ua-orange' },
    { id:'UID-021', name:'Kalani Abeywickrama',    email:'k.abeywickrama@lcc.lk',     role:'SUPPORT',     status:'ACTIVE',   phone:'+94 77 234 5679', dept:'Customer Support',lastLogin:'Today, 12:00',      init:'KA', color:'ua-red'    },
    { id:'UID-022', name:'Malith Kumara',          email:'m.kumara@lcc.lk',           role:'SUPPORT',     status:'PENDING',  phone:'+94 71 345 6780', dept:'Onboarding',      lastLogin:'— Never —',         init:'MK', color:'ua-indigo' },
    { id:'UID-023', name:'Udara Samarakoon',       email:'u.samarakoon@lcc.lk',       role:'BILLING',     status:'ACTIVE',   phone:'+94 76 456 7891', dept:'Finance',         lastLogin:'Yesterday, 18:55',  init:'US', color:'ua-teal'   },
    { id:'UID-024', name:'Lahiru Dissanayake',     email:'l.dissanayake@lcc.lk',      role:'SUPER_ADMIN', status:'ACTIVE',   phone:'+94 70 567 8902', dept:'Platform',        lastLogin:'Today, 05:30',      init:'LD', color:'ua-green'  },
  ];

  const PAGE_SIZE = 10;
  let currentPage = 1;

  /* ── Helpers ─────────────────────────────── */
  function roleBadge(r) {
    const map = {
      SUPER_ADMIN: '<span class="badge badge-superadmin">Super Admin</span>',
      SUPPORT:     '<span class="badge badge-support">Support</span>',
      BILLING:     '<span class="badge badge-billing">Billing</span>',
    };
    return map[r] || r;
  }

  function statusBadge(s) {
    const map = {
      ACTIVE:   '<span class="badge badge-active">Active</span>',
      INACTIVE: '<span class="badge badge-inactive">Inactive</span>',
      PENDING:  '<span class="badge badge-pending">Pending</span>',
    };
    return map[s] || s;
  }

  function actionBtns(u) {
    if (u.status === 'PENDING') {
      return `<div class="action-btns">
        <button class="icon-btn-sm" title="Resend Invite" data-action="resend" data-uid="${u.id}"><i class="fa-solid fa-paper-plane"></i></button>
        <button class="icon-btn-sm" title="Edit" data-action="edit" data-uid="${u.id}"><i class="fa-solid fa-pen"></i></button>
        <button class="icon-btn-sm text-danger" title="Revoke" data-action="revoke" data-uid="${u.id}"><i class="fa-solid fa-trash"></i></button>
      </div>`;
    }
    const toggleBtn = u.status === 'ACTIVE'
      ? `<button class="icon-btn-sm text-danger" title="Deactivate" data-action="deactivate" data-uid="${u.id}"><i class="fa-solid fa-user-slash"></i></button>`
      : `<button class="icon-btn-sm text-success" title="Activate"   data-action="activate"   data-uid="${u.id}"><i class="fa-solid fa-user-check"></i></button>`;
    return `<div class="action-btns">
      <button class="icon-btn-sm" title="View" data-action="view" data-uid="${u.id}"><i class="fa-solid fa-eye"></i></button>
      <button class="icon-btn-sm" title="Edit" data-action="edit" data-uid="${u.id}"><i class="fa-solid fa-pen"></i></button>
      ${toggleBtn}
    </div>`;
  }

  function buildRow(u) {
    return `<tr data-uid="${u.id}">
      <td><input type="checkbox"/></td>
      <td><div class="user-cell">
        <div class="user-avatar ${u.color}">${u.init}</div>
        <div><div class="user-name">${u.name}</div><div class="user-id">${u.id}</div></div>
      </div></td>
      <td class="text-muted">${u.email}</td>
      <td>${roleBadge(u.role)}</td>
      <td><span class="text-muted fst-italic">— Platform —</span></td>
      <td class="text-muted">${u.lastLogin}</td>
      <td>${statusBadge(u.status)}</td>
      <td>${actionBtns(u)}</td>
    </tr>`;
  }

  /* ── Filter ──────────────────────────────── */
  function getFiltered() {
    const q    = (document.getElementById('userSearchInput')?.value || '').toLowerCase().trim();
    const role = document.getElementById('roleFilterSelect')?.value  || '';
    const st   = document.getElementById('statusFilterSelect')?.value || '';
    return USERS.filter(u => {
      if (q && !u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q) && !u.id.toLowerCase().includes(q)) return false;
      if (role && u.role !== role) return false;
      if (st   && u.status !== st) return false;
      return true;
    });
  }

  /* ── Pagination ──────────────────────────── */
  function renderPagination(total, page, el) {
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    let html = '';
    const prevDis = page <= 1 ? ' disabled' : '';
    const nextDis = page >= pages ? ' disabled' : '';
    html += `<button class="page-btn"${prevDis} data-action="prev"><i class="fa-solid fa-chevron-left"></i></button>`;
    if (pages <= 7) {
      for (let i = 1; i <= pages; i++) html += `<button class="page-btn${i === page ? ' active' : ''}" data-page="${i}">${i}</button>`;
    } else {
      const show = new Set([1, pages, page, page - 1, page + 1].filter(x => x >= 1 && x <= pages));
      let prev = 0;
      [...show].sort((a, b) => a - b).forEach(p => {
        if (prev && p - prev > 1) html += '<span class="page-ellipsis">…</span>';
        html += `<button class="page-btn${p === page ? ' active' : ''}" data-page="${p}">${p}</button>`;
        prev = p;
      });
    }
    html += `<button class="page-btn"${nextDis} data-action="next"><i class="fa-solid fa-chevron-right"></i></button>`;
    el.innerHTML = html;
  }

  /* ── Render Table ────────────────────────── */
  function renderTable(data, page) {
    currentPage = page;
    const tbody  = document.getElementById('userTableBody');
    const countEl   = document.getElementById('tableCountLabel');
    const pageInfoEl = document.getElementById('paginationInfo');
    const paginEl   = document.getElementById('paginationControls');
    if (!tbody) return;

    const total = data.length;
    const pages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    if (currentPage > pages) currentPage = pages;

    const start = (currentPage - 1) * PAGE_SIZE;
    const slice = data.slice(start, start + PAGE_SIZE);

    tbody.innerHTML = slice.length
      ? slice.map(buildRow).join('')
      : '<tr><td colspan="8" style="text-align:center;padding:2rem;color:#9ca3af">No users found.</td></tr>';

    if (countEl) countEl.textContent = `Showing ${Math.min(start + 1, total)}–${Math.min(start + slice.length, total)} of ${total} users`;
    if (pageInfoEl) pageInfoEl.innerHTML = `Page ${currentPage} of ${pages} &nbsp;·&nbsp; ${total} total records`;
    if (paginEl) renderPagination(total, currentPage, paginEl);

    updateStats(data);
  }

  /* ── Stats ───────────────────────────────── */
  function updateStats(data) {
    const set = id => el => { const e = document.getElementById(id); if (e) e.textContent = el; };
    const all = data || getFiltered();
    set('statTotalUsers')(all.length);
    set('statSuperAdmins')(all.filter(u => u.role === 'SUPER_ADMIN').length);
    set('statSupportStaff')(all.filter(u => u.role === 'SUPPORT').length);
    set('statBillingAgents')(all.filter(u => u.role === 'BILLING').length);
  }

  /* ── Filter Events ───────────────────────── */
  function applyFilters() { renderTable(getFiltered(), 1); }

  document.getElementById('userSearchInput')?.addEventListener('input', applyFilters);
  document.getElementById('roleFilterSelect')?.addEventListener('change', applyFilters);
  document.getElementById('statusFilterSelect')?.addEventListener('change', applyFilters);
  document.getElementById('clearFiltersBtn')?.addEventListener('click', function () {
    const s = document.getElementById('userSearchInput'); if (s) s.value = '';
    const r = document.getElementById('roleFilterSelect'); if (r) r.value = '';
    const st = document.getElementById('statusFilterSelect'); if (st) st.value = '';
    applyFilters();
  });

  /* ── Pagination click handler ────────────── */
  document.getElementById('paginationControls')?.addEventListener('click', function (e) {
    const btn = e.target.closest('[data-page],[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    const data = getFiltered();
    const pages = Math.max(1, Math.ceil(data.length / PAGE_SIZE));
    if (action === 'prev') { if (currentPage > 1) renderTable(data, currentPage - 1); }
    else if (action === 'next') { if (currentPage < pages) renderTable(data, currentPage + 1); }
    else if (btn.dataset.page) { renderTable(data, parseInt(btn.dataset.page)); }
  });

  /* ── Role hint map ───────────────────────── */
  const ROLE_HINTS = {
    SUPER_ADMIN: 'Full platform access — can manage tenants, billing, platform settings, and all admin users.',
    SUPPORT:     'Can view tenant data, manage tickets, and assist tenants. Cannot access billing or platform config.',
    BILLING:     'Can manage subscription plans, invoices, and payment records. No access to tenant operational data.',
  };

  document.getElementById('inviteRole')?.addEventListener('change', function () {
    const box  = document.getElementById('roleHintBox');
    const text = document.getElementById('roleHintText');
    if (!box || !text) return;
    if (this.value && ROLE_HINTS[this.value]) {
      text.textContent = ROLE_HINTS[this.value];
      box.style.display = 'flex';
    } else {
      box.style.display = 'none';
    }
  });

  /* ── Invite User modal submit ────────────── */
  function showToast(msg) {
    const t = document.createElement('div');
    t.className = 'invite-toast';
    t.innerHTML = `<i class="fa-solid fa-circle-check"></i> ${msg}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), 3500);
  }

  function clearInviteForm() {
    const form = document.getElementById('inviteUserForm');
    if (form) form.reset();
    document.getElementById('roleHintBox')?.style && (document.getElementById('roleHintBox').style.display = 'none');
    document.querySelectorAll('#inviteUserForm .input-error').forEach(el => el.classList.remove('input-error'));
  }

  document.getElementById('submitInviteUser')?.addEventListener('click', function () {
    const nameEl  = document.getElementById('inviteFullName');
    const emailEl = document.getElementById('inviteEmail');
    const roleEl  = document.getElementById('inviteRole');
    let valid = true;

    [nameEl, emailEl, roleEl].forEach(el => el?.classList.remove('input-error'));

    if (!nameEl?.value.trim())  { nameEl?.classList.add('input-error');  valid = false; }
    if (!emailEl?.value.trim()) { emailEl?.classList.add('input-error'); valid = false; }
    if (!roleEl?.value)         { roleEl?.classList.add('input-error');  valid = false; }
    if (!valid) return;

    const statusEl = document.getElementById('inviteStatus');
    const newUser = {
      id:        'UID-' + String(USERS.length + 1).padStart(3, '0'),
      name:      nameEl.value.trim(),
      email:     emailEl.value.trim().toLowerCase(),
      role:      roleEl.value,
      status:    statusEl?.value || 'PENDING',
      phone:     document.getElementById('invitePhone')?.value.trim() || '',
      dept:      document.getElementById('inviteDept')?.value.trim()  || '',
      lastLogin: '— Never —',
      init:      nameEl.value.trim().split(' ').slice(0, 2).map(w => w[0].toUpperCase()).join(''),
      color:     ['ua-red','ua-blue','ua-green','ua-purple','ua-orange','ua-teal','ua-indigo'][USERS.length % 7],
    };

    USERS.push(newUser);
    renderTable(getFiltered(), 1);

    // close modal
    if (typeof closeModal === 'function') closeModal('inviteUserModal');
    clearInviteForm();
    showToast(`Invitation sent to ${newUser.email}`);
  });

  // Reset form when modal closes
  document.getElementById('cancelInviteUser')?.addEventListener('click', clearInviteForm);
  document.querySelector('#inviteUserModal [data-modal-close]')?.addEventListener('click', clearInviteForm);

  /* ── Init ────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    renderTable(USERS, 1);
  });

})();
"""

with open(JS, "w", encoding="utf-8") as f:
    f.write(USERS_JS)
patches_applied.append("[OK] users.js created with 24 users, filtering, pagination, invite modal handler")

# ──────────────────────────────────────────────
# Summary
# ──────────────────────────────────────────────
print("\n".join(patches_applied))
print("\n✅ All patches applied successfully.")
