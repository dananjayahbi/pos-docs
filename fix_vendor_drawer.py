"""Fix vendor drawer HTML structure and JS openViewDrawer function."""

import os

# ── 1. Update index.html ────────────────────────────────────────────────────
html_path = 'e:/tmp/pos-arch/UI-Prototype/erp/vendors/index.html'
with open(html_path, encoding='utf-8') as f:
    html = f.read()

old_drawer = (
    '<!-- ========== VENDOR DETAIL DRAWER ========== -->\n'
    '<div class="drawer-overlay" id="drawerOverlay" onclick="closeVendorDrawer()"></div>\n'
    '<div class="vendor-drawer" id="vendorDrawer">\n'
    '  <div id="vendorDrawerBody"><!-- Populated by JS --></div>\n'
    '</div>'
)
new_drawer = (
    '<!-- ========== VENDOR DETAIL DRAWER ========== -->\n'
    '<div class="drawer-overlay" id="drawerOverlay" onclick="closeVendorDrawer()"></div>\n'
    '<div class="vendor-drawer" id="vendorDrawer">\n'
    '  <div class="vd-header" id="vendorDrawerHeader"></div>\n'
    '  <div class="vd-body" id="vendorDrawerBody"></div>\n'
    '  <div class="vd-footer" id="vendorDrawerFooter"></div>\n'
    '</div>'
)

if old_drawer in html:
    html = html.replace(old_drawer, new_drawer)
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print('HTML: drawer sections added OK')
else:
    print('HTML: OLD pattern not found, checking context...')
    idx = html.find('vendorDrawerBody')
    if idx >= 0:
        print('Context:', repr(html[max(0, idx - 150):idx + 250]))
    else:
        print('vendorDrawerBody not found in HTML at all')


# ── 2. Update vendors.js  openViewDrawer ──────────────────────────────────
js_path = 'e:/tmp/pos-arch/UI-Prototype/erp/vendors/vendors.js'
with open(js_path, encoding='utf-8') as f:
    js = f.read()

# Find the openViewDrawer function and replace its body
OLD_FUNC_START = "/* ══════════════ VIEW DRAWER ══════════════ */\nfunction openViewDrawer(id) {"
if OLD_FUNC_START not in js:
    print('JS: openViewDrawer marker not found')
else:
    # Find extent of the function (ends before /* ══ DELETE ══ */)
    start = js.index(OLD_FUNC_START)
    end_marker = "\n/* ══════════════ DELETE MODAL ══════════════ */"
    end = js.index(end_marker, start)
    old_func = js[start:end]

    new_func = r"""/* ══════════════ VIEW DRAWER ══════════════ */
function openViewDrawer(id) {
  const v = allVendors.find(v => v.id === id);
  if (!v) return;

  const ini = v.company_name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const colorsArr = ['#f97316','#3b82f6','#8b5cf6','#14b8a6','#ec4899','#f59e0b'];
  const color = colorsArr[parseInt(id.replace(/\D/g,'')) % colorsArr.length];
  const purchasePct = v.total_spent > 0 ? Math.min(100, Math.round((v.pending_balance / v.total_spent) * 100)) : 0;

  /* ── Header: profile + tabs ── */
  document.getElementById('vendorDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar" style="background:${color};">${ini}</div>
      <div class="drawer-profile-info">
        <div class="drawer-company">${v.company_name}</div>
        <div class="drawer-id">${v.id}</div>
        <span class="badge ${v.status}">${v.status.charAt(0).toUpperCase() + v.status.slice(1)}</span>
      </div>
      <button class="drawer-close" onclick="closeVendorDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchDrawerTab(this,'dtab-overview')">Overview</button>
      <button class="dtab" onclick="switchDrawerTab(this,'dtab-financial')">Financial</button>
      <button class="dtab" onclick="switchDrawerTab(this,'dtab-notes')">Notes</button>
    </div>
  `;

  /* ── Body: scrollable tab content ── */
  document.getElementById('vendorDrawerBody').innerHTML = `
    <div id="dtab-overview" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-address-card"></i> Contact</div>
        <div class="drawer-field"><span class="df-label">Contact Person</span><span class="df-val">${v.contact_person}</span></div>
        <div class="drawer-field"><span class="df-label">Email</span><span class="df-val"><a href="mailto:${v.email}">${v.email}</a></span></div>
        <div class="drawer-field"><span class="df-label">Phone</span><span class="df-val">${v.phone}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-location-dot"></i> Address</div>
        <div class="drawer-field"><span class="df-label">Address</span><span class="df-val">${v.address_line1 || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">City/District</span><span class="df-val">${v.city}, ${v.district}</span></div>
        <div class="drawer-field"><span class="df-label">Province</span><span class="df-val">${v.province}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-boxes-stacked"></i> Supply Info</div>
        <div class="drawer-field"><span class="df-label">Category</span><span class="df-val">${categoryIcon(v.category)}${v.category}</span></div>
        <div class="drawer-field"><span class="df-label">Lead Time</span><span class="df-val">${v.lead_time || '\u2014'} days</span></div>
        <div class="drawer-field"><span class="df-label">Currency</span><span class="df-val">${v.currency}</span></div>
        <div class="drawer-field"><span class="df-label">Payment Terms</span><span class="df-val">${paymentTermsBadge(v.payment_terms)}</span></div>
      </div>
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-building-columns"></i> Banking</div>
        <div class="drawer-field"><span class="df-label">Bank</span><span class="df-val">${v.bank_name || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">Account</span><span class="df-val">${v.bank_account || '\u2014'}</span></div>
        <div class="drawer-field"><span class="df-label">Tax / VAT ID</span><span class="df-val">${v.tax_id || 'Not registered'}</span></div>
      </div>
    </div>

    <div id="dtab-financial" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-chart-line"></i> Purchase Summary</div>
        <div class="drawer-kpi-row">
          <div class="drawer-kpi-box"><div class="drawer-kpi-val">${v.total_orders}</div><div class="drawer-kpi-label">Total POs</div></div>
          <div class="drawer-kpi-box"><div class="drawer-kpi-val">${fmtLKR(v.total_spent)}</div><div class="drawer-kpi-label">Total Spent</div></div>
        </div>
        <div class="drawer-field" style="margin-top:.75rem;">
          <span class="df-label">Pending Balance</span>
          <span class="df-val" style="font-weight:700;color:${v.pending_balance > 0 ? '#dc2626' : '#16a34a'}">${fmtLKR(v.pending_balance)}</span>
        </div>
        <div style="margin-top:.75rem;">
          <div style="display:flex;justify-content:space-between;font-size:.72rem;color:var(--color-neutral-500);margin-bottom:.3rem;">
            <span>Balance vs. Total Spent</span><span>${purchasePct}%</span>
          </div>
          <div class="drawer-progress-bar"><div class="drawer-progress-fill" style="width:${purchasePct}%;background:${purchasePct > 50 ? '#dc2626' : '#f97316'};"></div></div>
        </div>
        <div class="drawer-field" style="margin-top:.5rem;">
          <span class="df-label">Avg. Order Value</span>
          <span class="df-val">${v.total_orders > 0 ? fmtLKR(Math.round(v.total_spent / v.total_orders)) : '\u20a8 0'}</span>
        </div>
        <div class="drawer-field">
          <span class="df-label">Vendor Since</span>
          <span class="df-val">${v.created_date ? new Date(v.created_date).toLocaleDateString('en-GB', {day:'2-digit',month:'short',year:'numeric'}) : '\u2014'}</span>
        </div>
      </div>
    </div>

    <div id="dtab-notes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title"><i class="fa-solid fa-note-sticky"></i> Vendor Notes</div>
        <p style="font-size:.85rem;color:var(--color-neutral-600);line-height:1.6;">${v.notes || 'No notes for this vendor.'}</p>
      </div>
    </div>
  `;

  /* ── Footer: action buttons ── */
  document.getElementById('vendorDrawerFooter').innerHTML = `
    <button class="btn btn-outline btn-sm" onclick="closeVendorDrawer()"><i class="fa-solid fa-xmark"></i> Close</button>
    <button class="btn btn-primary btn-sm" onclick="openEditModal('${v.id}');closeVendorDrawer()"><i class="fa-solid fa-pen"></i> Edit Vendor</button>
    <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;" onclick="closeVendorDrawer();openDeleteModal('${v.id}')"><i class="fa-solid fa-trash"></i></button>
  `;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('vendorDrawer').classList.add('open');
}

"""

    js = js[:start] + new_func + js[end:]
    with open(js_path, 'w', encoding='utf-8') as f:
        f.write(js)
    print('JS: openViewDrawer updated OK')

print('Done.')
