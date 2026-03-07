#!/usr/bin/env python3
"""Write all 6 dedicated settings pages for LankaCommerce Cloud ERP prototype."""
import os

BASE = os.path.dirname(os.path.abspath(__file__))

def head(active, page_title):
    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>{page_title} — Settings — LCC</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"/>
  <link rel="preconnect" href="https://fonts.googleapis.com"/>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"/>
  <link rel="stylesheet" href="../../assets/css/variables.css"/>
  <link rel="stylesheet" href="../../assets/css/base.css"/>
  <link rel="stylesheet" href="../../assets/css/components.css"/>
  <link rel="stylesheet" href="../../assets/css/layout.css"/>
  <link rel="stylesheet" href="../erp.css"/>
  <link rel="stylesheet" href="settings.css?v=20250603"/>
</head>
<body>
<div class="app-shell">
  <aside class="sidebar" id="sidebar"></aside>
  <div class="main-wrapper" id="mainWrapper">
    <header class="top-bar" id="erpTopBar" data-page-title="Store Settings"></header>
    <main class="main-content">
      <div class="page-header" style="margin-bottom:0;">
        <div>
          <h1 class="page-title">Settings</h1>
          <p class="page-subtitle">Manage your store configuration, team, billing and integrations.</p>
        </div>
      </div>
      {subnav(active)}"""

SUBNAV_ITEMS = [
    ("index.html",        "fa-sliders",              "General"),
    ("company.html",      "fa-building",             "Company Profile"),
    ("users.html",        "fa-users-gear",           "Users &amp; Roles"),
    ("billing.html",      "fa-credit-card",          "Billing &amp; Plan"),
    ("integrations.html", "fa-plug",                 "Integrations"),
    ("notifications.html","fa-bell",                 "Notifications"),
]

def subnav(active):
    links = ""
    for href, icon, label in SUBNAV_ITEMS:
        cls = ' class="active"' if href == active else ""
        links += f'        <a href="{href}"{cls}><i class="fa-solid {icon}"></i> {label}</a>\n'
    return f'      <div class="settings-subnav">\n{links}      </div>'

def foot(scripts=""):
    return f"""
    </main>
  </div>
</div>
<div class="sidebar-overlay" id="sidebarOverlay"></div>
<div class="toast-container" id="toastContainer"></div>
{scripts}
<script src="../../assets/js/layout.js"></script>
<script src="../erp-header.js"></script>
<script src="../erp.js"></script>
<script src="settings.js?v=20250603"></script>
</body>
</html>"""

# ─────────────────────────────────────────────────────────────
# 1. General Settings  (index.html)
# ─────────────────────────────────────────────────────────────
general_body = """
      <div class="settings-page-card">
        <div class="settings-page-header">
          <i class="fa-solid fa-sliders" style="color:#f97316;"></i>
          <div><h2 class="settings-page-title">General Settings</h2><p class="settings-page-desc">Configure your store's basic information, locale and defaults.</p></div>
        </div>
        <div class="settings-grid-2">
          <div class="form-group"><label class="form-label">Store Name</label><input class="form-control" type="text" value="Demo Store Pvt Ltd"/></div>
          <div class="form-group"><label class="form-label">Store Email</label><input class="form-control" type="email" value="hello@demostore.lk"/></div>
          <div class="form-group"><label class="form-label">Currency</label>
            <select class="form-control"><option selected>LKR — Sri Lankan Rupee</option><option>USD — US Dollar</option><option>EUR — Euro</option></select>
          </div>
          <div class="form-group"><label class="form-label">Timezone</label>
            <select class="form-control"><option selected>Asia/Colombo (UTC+5:30)</option><option>UTC</option></select>
          </div>
          <div class="form-group"><label class="form-label">Language</label>
            <select class="form-control"><option selected>English</option><option>සිංහල (Sinhala)</option><option>Tamil</option></select>
          </div>
          <div class="form-group"><label class="form-label">Date Format</label>
            <select class="form-control"><option selected>DD/MM/YYYY</option><option>MM/DD/YYYY</option><option>YYYY-MM-DD</option></select>
          </div>
          <div class="form-group"><label class="form-label">Fiscal Year Start</label>
            <select class="form-control"><option selected>January</option><option>April</option><option>July</option></select>
          </div>
          <div class="form-group"><label class="form-label">Default Tax Rate (%)</label>
            <input class="form-control" type="number" value="0" min="0" max="100" step="0.5"/>
          </div>
        </div>
        <div class="form-group"><label class="form-label">Store Website</label><input class="form-control" type="url" value="https://demostore.lk" style="max-width:100%;"/></div>
        <div class="settings-page-footer">
          <button class="btn btn-primary btn-sm" onclick="showToast('General settings saved successfully.','success')"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
        </div>
      </div>"""

# ─────────────────────────────────────────────────────────────
# 2. Company Profile  (company.html)
# ─────────────────────────────────────────────────────────────
company_body = """
      <div class="settings-page-card">
        <div class="settings-page-header">
          <i class="fa-solid fa-building" style="color:#f97316;"></i>
          <div><h2 class="settings-page-title">Company Profile</h2><p class="settings-page-desc">Legal name, registration details and business address.</p></div>
        </div>
        <div class="logo-upload-section">
          <div class="logo-preview"><i class="fa-solid fa-store" style="font-size:2rem;color:#f97316;"></i></div>
          <div class="logo-upload-info">
            <div class="logo-upload-label">Company Logo</div>
            <div class="logo-upload-hint">PNG or SVG, max 2&nbsp;MB. Recommended: 200&times;200&nbsp;px</div>
            <button class="btn btn-secondary btn-sm" style="margin-top:.5rem;"><i class="fa-solid fa-upload"></i> Upload Logo</button>
          </div>
        </div>
        <div class="settings-grid-2">
          <div class="form-group"><label class="form-label">Legal Name</label><input class="form-control" type="text" value="Demo Store Private Limited"/></div>
          <div class="form-group"><label class="form-label">Trading Name</label><input class="form-control" type="text" value="Demo Store"/></div>
          <div class="form-group"><label class="form-label">Business Registration No.</label><input class="form-control" type="text" placeholder="PV XXXXX"/></div>
          <div class="form-group"><label class="form-label">VAT / SVAT Number</label><input class="form-control" type="text" placeholder="XXX-XXXX-XXXX-V"/></div>
          <div class="form-group"><label class="form-label">Contact Phone</label><input class="form-control" type="tel" value="+94 77 123 4567"/></div>
          <div class="form-group"><label class="form-label">Contact Email</label><input class="form-control" type="email" value="contact@demostore.lk"/></div>
        </div>
        <div class="form-group"><label class="form-label">Address Line 1</label><input class="form-control" type="text" value="123, Main Street" style="max-width:100%;"/></div>
        <div class="form-group"><label class="form-label">Address Line 2</label><input class="form-control" type="text" placeholder="Apt / Floor / Unit" style="max-width:100%;"/></div>
        <div class="settings-grid-2">
          <div class="form-group"><label class="form-label">City</label><input class="form-control" type="text" value="Colombo"/></div>
          <div class="form-group"><label class="form-label">Postal Code</label><input class="form-control" type="text" value="00300"/></div>
          <div class="form-group"><label class="form-label">Province</label>
            <select class="form-control"><option selected>Western Province</option><option>Central Province</option><option>Southern Province</option><option>Northern Province</option><option>Eastern Province</option></select>
          </div>
          <div class="form-group"><label class="form-label">Country</label>
            <select class="form-control"><option selected>Sri Lanka</option></select>
          </div>
        </div>
        <div class="settings-page-footer">
          <button class="btn btn-primary btn-sm" onclick="showToast('Company profile saved.','success')"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
        </div>
      </div>"""

# ─────────────────────────────────────────────────────────────
# 3. Users & Roles  (users.html)
# ─────────────────────────────────────────────────────────────
users_body = """
      <div class="settings-page-card">
        <div class="settings-page-header">
          <i class="fa-solid fa-users-gear" style="color:#f97316;"></i>
          <div><h2 class="settings-page-title">Users &amp; Roles</h2><p class="settings-page-desc">Manage team members, assign roles and send invitations.</p></div>
          <div style="margin-left:auto;">
            <button class="btn btn-primary btn-sm" onclick="openModal('inviteModal')">
              <i class="fa-solid fa-user-plus"></i> Invite Member
            </button>
          </div>
        </div>
        <div class="users-table-wrap">
          <table class="users-table">
            <thead><tr><th>Member</th><th>Role</th><th>Joined</th><th>Last Active</th><th>Status</th><th></th></tr></thead>
            <tbody>
              <tr>
                <td><div class="user-cell"><div class="user-avatar" style="background:#fee2e2;color:#dc2626;">KP</div><div><div class="user-name">Kamal Perera</div><div class="user-email">kamal@demostore.lk</div></div></div></td>
                <td><span class="role-badge role-owner">Owner</span></td><td>Jan 2024</td><td>Today</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td><button class="btn-icon" onclick="editMember('Kamal Perera','kamal@demostore.lk','owner','active')" title="Edit"><i class="fa-solid fa-pen fa-sm"></i></button></td>
              </tr>
              <tr>
                <td><div class="user-cell"><div class="user-avatar" style="background:#dcfce7;color:#16a34a;">NS</div><div><div class="user-name">Nadeesha Silva</div><div class="user-email">nadeesha@demostore.lk</div></div></div></td>
                <td><span class="role-badge role-manager">Manager</span></td><td>Mar 2024</td><td>Yesterday</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td><button class="btn-icon" onclick="editMember('Nadeesha Silva','nadeesha@demostore.lk','manager','active')" title="Edit"><i class="fa-solid fa-pen fa-sm"></i></button></td>
              </tr>
              <tr>
                <td><div class="user-cell"><div class="user-avatar" style="background:#dbeafe;color:#2563eb;">RF</div><div><div class="user-name">Ruwani Fernando</div><div class="user-email">ruwani@demostore.lk</div></div></div></td>
                <td><span class="role-badge role-cashier">Cashier</span></td><td>Jun 2024</td><td>2 days ago</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td><button class="btn-icon" onclick="editMember('Ruwani Fernando','ruwani@demostore.lk','cashier','active')" title="Edit"><i class="fa-solid fa-pen fa-sm"></i></button></td>
              </tr>
              <tr>
                <td><div class="user-cell"><div class="user-avatar" style="background:#f3e8ff;color:#7c3aed;">AW</div><div><div class="user-name">Ashan Wickrama</div><div class="user-email">ashan@demostore.lk</div></div></div></td>
                <td><span class="role-badge role-staff">Staff</span></td><td>Aug 2024</td><td>1 week ago</td>
                <td><span class="status-badge status-active">Active</span></td>
                <td><button class="btn-icon" onclick="editMember('Ashan Wickrama','ashan@demostore.lk','staff','active')" title="Edit"><i class="fa-solid fa-pen fa-sm"></i></button></td>
              </tr>
              <tr>
                <td><div class="user-cell"><div class="user-avatar" style="background:#fef9c3;color:#a16207;">DM</div><div><div class="user-name">Dilshan Mendis</div><div class="user-email">dilshan@demostore.lk</div></div></div></td>
                <td><span class="role-badge role-staff">Staff</span></td><td>Oct 2024</td><td>Pending</td>
                <td><span class="status-badge status-pending">Invited</span></td>
                <td><button class="btn-icon" onclick="showToast('Invitation resent to Dilshan Mendis.','info')" title="Resend invite"><i class="fa-solid fa-rotate fa-sm"></i></button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- INVITE MODAL -->
      <div class="modal-overlay" id="inviteModal">
        <div class="modal" style="width:440px;max-width:95vw;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-user-plus" style="color:#f97316;margin-right:.5rem;"></i>Invite Team Member</h3>
            <button class="modal-close" onclick="closeModal('inviteModal')"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-group"><label class="form-label">Full Name</label><input id="inviteName" class="form-control" type="text" placeholder="e.g. Kamal Perera" style="max-width:100%;"/></div>
            <div class="form-group"><label class="form-label">Email Address</label><input id="inviteEmail" class="form-control" type="email" placeholder="name@company.lk" style="max-width:100%;"/></div>
            <div class="form-group"><label class="form-label">Role</label>
              <select id="inviteRole" class="form-control" style="max-width:100%;">
                <option value="Manager">Manager</option><option value="Cashier">Cashier</option>
                <option value="Staff" selected>Staff</option><option value="Accountant">Accountant</option>
              </select>
            </div>
            <div style="display:flex;gap:.75rem;margin-top:1.25rem;">
              <button class="btn btn-primary btn-sm" onclick="submitInvite()"><i class="fa-solid fa-paper-plane"></i> Send Invite</button>
              <button class="btn btn-secondary btn-sm" onclick="closeModal('inviteModal')">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- EDIT MEMBER MODAL -->
      <div class="modal-overlay" id="editMemberModal">
        <div class="modal" style="width:440px;max-width:95vw;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-user-pen" style="color:#f97316;margin-right:.5rem;"></i>Edit Member</h3>
            <button class="modal-close" onclick="closeModal('editMemberModal')"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <div class="form-group"><label class="form-label">Full Name</label><input id="editName" class="form-control" type="text" style="max-width:100%;"/></div>
            <div class="form-group"><label class="form-label">Email</label><input id="editEmail" class="form-control" type="email" readonly style="max-width:100%;background:#f8fafc;"/></div>
            <div class="form-group"><label class="form-label">Role</label>
              <select id="editRole" class="form-control" style="max-width:100%;">
                <option value="owner">Owner</option><option value="manager">Manager</option>
                <option value="cashier">Cashier</option><option value="accountant">Accountant</option><option value="staff">Staff</option>
              </select>
            </div>
            <div class="form-group"><label class="form-label">Status</label>
              <select id="editStatus" class="form-control" style="max-width:100%;">
                <option value="active">Active</option><option value="inactive">Inactive</option>
              </select>
            </div>
            <div style="display:flex;gap:.75rem;margin-top:1.25rem;flex-wrap:wrap;">
              <button class="btn btn-primary btn-sm" onclick="saveEdit()"><i class="fa-solid fa-floppy-disk"></i> Save Changes</button>
              <button class="btn btn-secondary btn-sm" onclick="closeModal('editMemberModal')">Cancel</button>
              <button class="btn btn-sm" style="margin-left:auto;border:1px solid #fca5a5;color:#dc2626;background:#fff;" onclick="removeMember()"><i class="fa-solid fa-trash"></i> Remove</button>
            </div>
          </div>
        </div>
      </div>"""

users_scripts = """<script>
function editMember(name,email,role,status){
  document.getElementById('editName').value=name;
  document.getElementById('editEmail').value=email;
  document.getElementById('editRole').value=role;
  document.getElementById('editStatus').value=status;
  openModal('editMemberModal');
}
function submitInvite(){
  const n=document.getElementById('inviteName').value.trim();
  const e=document.getElementById('inviteEmail').value.trim();
  const r=document.getElementById('inviteRole').value;
  if(!n||!e){showToast('Please fill in name and email.','error');return;}
  closeModal('inviteModal');
  showToast('Invitation sent to '+n+' ('+r+').','success');
  document.getElementById('inviteName').value='';
  document.getElementById('inviteEmail').value='';
}
function saveEdit(){
  const n=document.getElementById('editName').value.trim();
  if(!n){showToast('Name cannot be empty.','error');return;}
  closeModal('editMemberModal');
  showToast(n+' has been updated.','success');
}
function removeMember(){
  const n=document.getElementById('editName').value;
  closeModal('editMemberModal');
  showToast(n+' has been removed from the team.','warning');
}
</script>"""

# ─────────────────────────────────────────────────────────────
# 4. Billing & Plan  (billing.html)
# ─────────────────────────────────────────────────────────────
billing_body = """
      <div class="settings-page-card">
        <div class="settings-page-header">
          <i class="fa-solid fa-credit-card" style="color:#f97316;"></i>
          <div><h2 class="settings-page-title">Billing &amp; Plan</h2><p class="settings-page-desc">Manage your subscription plan, usage and invoices.</p></div>
        </div>
        <div class="plan-card">
          <div class="plan-card-header">
            <div>
              <div class="plan-badge">Current Plan</div>
              <div class="plan-name">Starter Plan</div>
              <div class="plan-price">&#8360; 2,990 <span>/ month</span></div>
            </div>
            <div style="display:flex;flex-direction:column;gap:.5rem;align-items:flex-end;">
              <button class="btn btn-primary btn-sm" onclick="openModal('upgradeModal')"><i class="fa-solid fa-rocket"></i> Upgrade Plan</button>
              <span style="font-size:.75rem;color:#fff;opacity:.8;">Renews Apr 1, 2025</span>
            </div>
          </div>
          <div class="plan-features">
            <span><i class="fa-solid fa-check"></i> 2 Users</span>
            <span><i class="fa-solid fa-check"></i> 500 Products</span>
            <span><i class="fa-solid fa-check"></i> 1 Location</span>
            <span><i class="fa-solid fa-check"></i> Basic Reports</span>
            <span><i class="fa-solid fa-check"></i> Email Support</span>
          </div>
        </div>
        <div class="usage-section" style="margin-top:1.5rem;">
          <div class="usage-title">Usage This Month</div>
          <div class="usage-row"><div class="usage-label"><i class="fa-solid fa-users tcolor"></i> Team Members</div><div class="usage-bar-wrap"><div class="usage-bar" style="width:100%;background:linear-gradient(90deg,#dc2626,#ef4444);"></div></div><div class="usage-num">2 / 2</div></div>
          <div class="usage-row"><div class="usage-label"><i class="fa-solid fa-box tcolor"></i> Products</div><div class="usage-bar-wrap"><div class="usage-bar" style="width:56%;"></div></div><div class="usage-num">278 / 500</div></div>
          <div class="usage-row"><div class="usage-label"><i class="fa-solid fa-file-invoice tcolor"></i> Invoices</div><div class="usage-bar-wrap"><div class="usage-bar" style="width:34%;"></div></div><div class="usage-num">340 / 1,000</div></div>
        </div>
        <div class="invoices-section" style="margin-top:1.5rem;">
          <div class="usage-title">Recent Invoices</div>
          <table class="invoice-table">
            <thead><tr><th>Invoice</th><th>Period</th><th>Amount</th><th>Plan</th><th></th></tr></thead>
            <tbody>
              <tr><td style="font-weight:600;">INV-2025-003</td><td>March 2025</td><td style="font-weight:600;">&#8360; 2,990.00</td><td><span class="role-badge role-staff">Starter</span></td><td><button class="btn btn-secondary btn-sm" onclick="downloadInv('INV-2025-003','March 2025')"><i class="fa-solid fa-download"></i> Download</button></td></tr>
              <tr><td style="font-weight:600;">INV-2025-002</td><td>February 2025</td><td style="font-weight:600;">&#8360; 2,990.00</td><td><span class="role-badge role-staff">Starter</span></td><td><button class="btn btn-secondary btn-sm" onclick="downloadInv('INV-2025-002','February 2025')"><i class="fa-solid fa-download"></i> Download</button></td></tr>
              <tr><td style="font-weight:600;">INV-2025-001</td><td>January 2025</td><td style="font-weight:600;">&#8360; 2,990.00</td><td><span class="role-badge role-staff">Starter</span></td><td><button class="btn btn-secondary btn-sm" onclick="downloadInv('INV-2025-001','January 2025')"><i class="fa-solid fa-download"></i> Download</button></td></tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- UPGRADE PLAN MODAL -->
      <div class="modal-overlay" id="upgradeModal">
        <div class="modal" style="width:820px;max-width:96vw;">
          <div class="modal-header">
            <h3 class="modal-title"><i class="fa-solid fa-rocket" style="color:#f97316;margin-right:.5rem;"></i>Choose a Plan</h3>
            <button class="modal-close" onclick="closeModal('upgradeModal')"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <p style="color:#6b7280;font-size:.875rem;margin-bottom:1.5rem;">All plans include a 14-day free trial. No credit card required.</p>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:1rem;">
              <div class="upgrade-plan-card">
                <div class="upc-name">Starter</div>
                <div class="upc-price">&#8360; 2,990<span>/mo</span></div>
                <ul class="upc-features"><li><i class="fa-solid fa-check"></i> 2 Users</li><li><i class="fa-solid fa-check"></i> 500 Products</li><li><i class="fa-solid fa-check"></i> 1 Location</li><li><i class="fa-solid fa-check"></i> Email Support</li></ul>
                <button class="btn btn-secondary btn-sm" style="width:100%;" onclick="selectPlan('Starter')">Current Plan</button>
              </div>
              <div class="upgrade-plan-card featured">
                <div class="upc-badge">Popular</div>
                <div class="upc-name">Business</div>
                <div class="upc-price">&#8360; 7,490<span>/mo</span></div>
                <ul class="upc-features"><li><i class="fa-solid fa-check"></i> 10 Users</li><li><i class="fa-solid fa-check"></i> Unlimited Products</li><li><i class="fa-solid fa-check"></i> 5 Locations</li><li><i class="fa-solid fa-check"></i> Advanced Reports</li><li><i class="fa-solid fa-check"></i> Priority Support</li></ul>
                <button class="btn btn-primary btn-sm" style="width:100%;" onclick="selectPlan('Business')">Upgrade to Business</button>
              </div>
              <div class="upgrade-plan-card">
                <div class="upc-name">Enterprise</div>
                <div class="upc-price">&#8360; 19,990<span>/mo</span></div>
                <ul class="upc-features"><li><i class="fa-solid fa-check"></i> Unlimited Users</li><li><i class="fa-solid fa-check"></i> Unlimited Products</li><li><i class="fa-solid fa-check"></i> Unlimited Locations</li><li><i class="fa-solid fa-check"></i> AI Features</li><li><i class="fa-solid fa-check"></i> Dedicated Support</li></ul>
                <button class="btn btn-primary btn-sm" style="width:100%;" onclick="selectPlan('Enterprise')">Upgrade to Enterprise</button>
              </div>
            </div>
          </div>
        </div>
      </div>"""

billing_scripts = """<script>
function downloadInv(id, period){
  const content='LankaCommerce Cloud\\nInvoice: '+id+'\\nPeriod: '+period+'\\nPlan: Starter\\nAmount: Rs. 2,990.00\\nStatus: PAID';
  const a=document.createElement('a'); a.href='data:text/plain,'+encodeURIComponent(content);
  a.download=id+'.txt'; a.click();
  showToast(id+' downloaded.','success');
}
function selectPlan(name){
  closeModal('upgradeModal');
  showToast('Plan upgrade to '+name+' initiated. Our team will contact you.','success');
}
</script>"""

# ─────────────────────────────────────────────────────────────
# 5. Integrations  (integrations.html)
# ─────────────────────────────────────────────────────────────
integrations_body = """
      <div class="settings-page-card">
        <div class="settings-page-header">
          <i class="fa-solid fa-plug" style="color:#f97316;"></i>
          <div><h2 class="settings-page-title">Integrations</h2><p class="settings-page-desc">Connect payment gateways, logistics providers and messaging services.</p></div>
        </div>

        <div class="integrations-section-label">Payment Gateways</div>
        <div class="integrations-grid" style="margin-bottom:1.75rem;">
          <div class="integ-card connected">
            <div class="integ-icon" style="background:#1a56db1a;color:#1a56db;"><i class="fa-solid fa-credit-card"></i></div>
            <div class="integ-info"><div class="integ-name">PayHere</div><div class="integ-desc">Cards, bank transfer, eZ Cash, mCash</div></div>
            <span class="integ-status connected"><i class="fa-solid fa-circle-check"></i> Connected</span>
            <button class="btn btn-secondary btn-sm" onclick="openManageModal('payhere')">Manage</button>
          </div>
          <div class="integ-card">
            <div class="integ-icon" style="background:#7c3aed1a;color:#7c3aed;"><i class="fa-solid fa-mobile-screen-button"></i></div>
            <div class="integ-info"><div class="integ-name">FriMi Pay</div><div class="integ-desc">FriMi wallet &amp; QR code payments</div></div>
            <span class="integ-status"><i class="fa-solid fa-circle-xmark"></i> Not Connected</span>
            <button class="btn btn-primary btn-sm" onclick="openConnectModal('frimi')">Connect</button>
          </div>
        </div>

        <div class="integrations-section-label">Logistics &amp; Delivery</div>
        <div class="integrations-grid" style="margin-bottom:1.75rem;">
          <div class="integ-card connected">
            <div class="integ-icon" style="background:#16a34a1a;color:#16a34a;"><i class="fa-solid fa-car-side"></i></div>
            <div class="integ-info"><div class="integ-name">PickMe Delivery</div><div class="integ-desc">On-demand &amp; scheduled last-mile delivery</div></div>
            <span class="integ-status connected"><i class="fa-solid fa-circle-check"></i> Connected</span>
            <button class="btn btn-secondary btn-sm" onclick="openManageModal('pickme')">Manage</button>
          </div>
          <div class="integ-card">
            <div class="integ-icon" style="background:#ea580c1a;color:#ea580c;"><i class="fa-solid fa-envelope"></i></div>
            <div class="integ-info"><div class="integ-name">Sri Lanka Post</div><div class="integ-desc">EMS &amp; registered mail tracking</div></div>
            <span class="integ-status"><i class="fa-solid fa-circle-xmark"></i> Not Connected</span>
            <button class="btn btn-primary btn-sm" onclick="openConnectModal('slpost')">Connect</button>
          </div>
        </div>

        <div class="integrations-section-label">Messaging</div>
        <div class="integrations-grid">
          <div class="integ-card connected">
            <div class="integ-icon" style="background:#16a34a1a;color:#16a34a;"><i class="fa-brands fa-whatsapp"></i></div>
            <div class="integ-info"><div class="integ-name">WhatsApp Business</div><div class="integ-desc">Order notifications &amp; customer chat</div></div>
            <span class="integ-status connected"><i class="fa-solid fa-circle-check"></i> Connected</span>
            <button class="btn btn-secondary btn-sm" onclick="openManageModal('whatsapp')">Manage</button>
          </div>
          <div class="integ-card">
            <div class="integ-icon" style="background:#0ea5e91a;color:#0ea5e9;"><i class="fa-solid fa-comment-sms"></i></div>
            <div class="integ-info"><div class="integ-name">Dialog Genie SMS</div><div class="integ-desc">Bulk &amp; transactional SMS alerts</div></div>
            <span class="integ-status"><i class="fa-solid fa-circle-xmark"></i> Not Connected</span>
            <button class="btn btn-primary btn-sm" onclick="openConnectModal('dialogsms')">Connect</button>
          </div>
        </div>
      </div>

      <!-- CONNECT MODAL -->
      <div class="modal-overlay" id="connectModal">
        <div class="modal" style="width:460px;max-width:95vw;">
          <div class="modal-header">
            <h3 class="modal-title" id="connectTitle"><i class="fa-solid fa-plug" style="color:#f97316;margin-right:.5rem;"></i>Connect</h3>
            <button class="modal-close" onclick="closeModal('connectModal')"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body">
            <p style="font-size:.8rem;color:#6b7280;margin-bottom:1rem;">Enter your API credentials from <a id="connectDocLink" href="#" target="_blank" style="color:#f97316;">the provider dashboard</a>.</p>
            <div id="connectFields"></div>
            <div style="display:flex;gap:.75rem;margin-top:1rem;">
              <button class="btn btn-primary btn-sm" onclick="doConnect()"><i class="fa-solid fa-plug"></i> Connect</button>
              <button class="btn btn-secondary btn-sm" onclick="closeModal('connectModal')">Cancel</button>
            </div>
          </div>
        </div>
      </div>

      <!-- MANAGE MODAL -->
      <div class="modal-overlay" id="manageModal">
        <div class="modal" style="width:460px;max-width:95vw;">
          <div class="modal-header">
            <h3 class="modal-title" id="manageTitle"><i class="fa-solid fa-gears" style="color:#f97316;margin-right:.5rem;"></i>Manage</h3>
            <button class="modal-close" onclick="closeModal('manageModal')"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="modal-body" id="manageBody"></div>
        </div>
      </div>"""

integrations_scripts = r"""<script>
const INTEG = {
  frimi:     { name:'FriMi Pay',        doc:'https://frimi.lk/developers',         fields:['API Key','API Secret'] },
  slpost:    { name:'Sri Lanka Post',   doc:'https://slpost.lk/api',               fields:['Client ID','Client Secret','Account No.'] },
  dialogsms: { name:'Dialog Genie SMS', doc:'https://dialoglive.lk',               fields:['Username','Password','Sender ID'] },
  payhere:   { name:'PayHere',          key:'pk_live_XXXX****XXXX',               webhook:'https://demostore.lk/webhooks/payhere' },
  pickme:    { name:'PickMe Delivery',  key:'pm_XXXX****XXXX',                    webhook:'https://demostore.lk/webhooks/pickme' },
  whatsapp:  { name:'WhatsApp Business',key:'wa_XXXX****XXXX',                   webhook:'https://demostore.lk/webhooks/whatsapp' },
};

function openConnectModal(key){
  const info=INTEG[key];
  document.getElementById('connectTitle').innerHTML='<i class="fa-solid fa-plug" style="color:#f97316;margin-right:.5rem;"></i>Connect '+info.name;
  document.getElementById('connectDocLink').href=info.doc||'#';
  document.getElementById('connectFields').innerHTML=info.fields.map(f=>`
    <div class="form-group"><label class="form-label">${f}</label><input class="form-control" type="text" placeholder="Enter ${f}" style="max-width:100%;"/></div>`).join('');
  openModal('connectModal');
}

function doConnect(){
  const title=document.getElementById('connectTitle').textContent.replace('Connect ','');
  closeModal('connectModal');
  showToast(title+' connected successfully.','success');
}

function openManageModal(key){
  const info=INTEG[key];
  document.getElementById('manageTitle').innerHTML='<i class="fa-solid fa-gears" style="color:#f97316;margin-right:.5rem;"></i>Manage '+info.name;
  document.getElementById('manageBody').innerHTML=`
    <div class="form-group"><label class="form-label">API Key</label><input class="form-control" type="text" value="${info.key}" style="max-width:100%;font-family:monospace;"/></div>
    <div class="form-group"><label class="form-label">Webhook URL</label><input class="form-control" type="text" value="${info.webhook}" style="max-width:100%;"/></div>
    <div style="display:flex;align-items:center;gap:.75rem;padding:.75rem 0;border-top:1px solid #f1f5f9;margin-top:.5rem;">
      <span style="font-size:.875rem;font-weight:500;">Integration Enabled</span>
      <label class="toggle" style="margin-left:auto;"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
    </div>
    <div style="display:flex;gap:.75rem;margin-top:1rem;">
      <button class="btn btn-primary btn-sm" onclick="closeModal('manageModal');showToast('${info.name} settings saved.','success')"><i class="fa-solid fa-floppy-disk"></i> Save</button>
      <button class="btn btn-secondary btn-sm" onclick="closeModal('manageModal')">Close</button>
      <button class="btn btn-sm" style="margin-left:auto;border:1px solid #fca5a5;color:#dc2626;background:#fff;" onclick="closeModal('manageModal');showToast('${info.name} disconnected.','warning')"><i class="fa-solid fa-link-slash"></i> Disconnect</button>
    </div>`;
  openModal('manageModal');
}
</script>"""

# ─────────────────────────────────────────────────────────────
# 6. Notifications  (notifications.html)
# ─────────────────────────────────────────────────────────────
notifications_body = """
      <div class="settings-page-card">
        <div class="settings-page-header">
          <i class="fa-solid fa-bell" style="color:#f97316;"></i>
          <div><h2 class="settings-page-title">Notification Preferences</h2><p class="settings-page-desc">Choose how and when you receive alerts for different events.</p></div>
        </div>
        <div class="notif-table-head"><span>Alert Type</span><span>App</span><span>Email</span><span>SMS</span></div>
        <div class="notif-row">
          <div class="notif-label"><div style="font-weight:600;font-size:.875rem;">New Order</div><div style="font-size:.75rem;color:#6b7280;">When a customer places a new order</div></div>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
        </div>
        <div class="notif-row">
          <div class="notif-label"><div style="font-weight:600;font-size:.875rem;">Payment Received</div><div style="font-size:.75rem;color:#6b7280;">When a payment is confirmed</div></div>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
        </div>
        <div class="notif-row">
          <div class="notif-label"><div style="font-weight:600;font-size:.875rem;">Low Stock Alert</div><div style="font-size:.75rem;color:#6b7280;">When product stock falls below threshold</div></div>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
        </div>
        <div class="notif-row">
          <div class="notif-label"><div style="font-weight:600;font-size:.875rem;">New Team Member</div><div style="font-size:.75rem;color:#6b7280;">When someone joins or is invited</div></div>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
        </div>
        <div class="notif-row">
          <div class="notif-label"><div style="font-weight:600;font-size:.875rem;">Invoice Due</div><div style="font-size:.75rem;color:#6b7280;">3 days before an invoice due date</div></div>
          <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
        </div>
        <div class="notif-row">
          <div class="notif-label"><div style="font-weight:600;font-size:.875rem;">System Updates</div><div style="font-size:.75rem;color:#6b7280;">Release notes and scheduled maintenance</div></div>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox" checked/><span class="toggle-slider"></span></label>
          <label class="toggle"><input type="checkbox"/><span class="toggle-slider"></span></label>
        </div>
        <div class="settings-page-footer">
          <button class="btn btn-primary btn-sm" onclick="showToast('Notification preferences saved.','success')"><i class="fa-solid fa-floppy-disk"></i> Save Preferences</button>
        </div>
      </div>"""

# ─────────────────────────────────────────────────────────────
# Build pages
# ─────────────────────────────────────────────────────────────
PAGES = [
    ("index.html",         "index.html",         "General Settings",    general_body,       ""),
    ("company.html",       "company.html",       "Company Profile",     company_body,       ""),
    ("users.html",         "users.html",         "Users & Roles",       users_body,         users_scripts),
    ("billing.html",       "billing.html",       "Billing & Plan",      billing_body,       billing_scripts),
    ("integrations.html",  "integrations.html",  "Integrations",        integrations_body,  integrations_scripts),
    ("notifications.html", "notifications.html", "Notifications",       notifications_body, ""),
]

for fname, active, title, body, extra_scripts in PAGES:
    path = os.path.join(BASE, fname)
    content = head(active, title) + body + foot(extra_scripts)
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"OK - wrote {fname} ({len(content.splitlines())} lines)")

print("\nAll 6 settings pages written successfully!")
