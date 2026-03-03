"""
Synchronizes the admin sidebar across all admin pages.
Replaces each page's <aside> block with the canonical sidebar from index.html,
setting the correct active nav item per page.
"""

import os
import re

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ADMIN_DIR = os.path.join(BASE_DIR, 'admin')

# Canonical sidebar — {ACTIVE_*} will be replaced per page
SIDEBAR_TEMPLATE = '''  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-brand">
      <div class="sidebar-logo">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      <div class="sidebar-brand-text">
        <span class="brand-name">LCC</span>
        <span class="brand-tagline">Admin Panel</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-section">
        <span class="nav-section-title">Overview</span>
        <a href="index.html" class="nav-item {A_DASHBOARD}" data-tooltip="Dashboard">
          <span class="nav-item-icon"><i class="fa-solid fa-gauge-high"></i></span>
          <span class="nav-item-text">Dashboard</span>
        </a>
      </div>
      <div class="nav-section">
        <span class="nav-section-title">Management</span>
        <a href="tenants.html" class="nav-item {A_TENANTS}" data-tooltip="Tenants">
          <span class="nav-item-icon"><i class="fa-solid fa-store"></i></span>
          <span class="nav-item-text">Tenants / Stores</span>
        </a>
        <a href="users.html" class="nav-item {A_USERS}" data-tooltip="Users">
          <span class="nav-item-icon"><i class="fa-solid fa-users"></i></span>
          <span class="nav-item-text">Users</span>
        </a>
        <a href="billing.html" class="nav-item {A_BILLING}" data-tooltip="Billing">
          <span class="nav-item-icon"><i class="fa-solid fa-credit-card"></i></span>
          <span class="nav-item-text">Billing &amp; Plans</span>
        </a>
      </div>
      <div class="nav-section">
        <span class="nav-section-title">System</span>
        <a href="health.html" class="nav-item {A_HEALTH}" data-tooltip="Health">
          <span class="nav-item-icon"><i class="fa-solid fa-heart-pulse"></i></span>
          <span class="nav-item-text">System Health</span>
        </a>
        <a href="logs.html" class="nav-item {A_LOGS}" data-tooltip="Logs">
          <span class="nav-item-icon"><i class="fa-solid fa-file-lines"></i></span>
          <span class="nav-item-text">Logs &amp; Audit</span>
        </a>
        <a href="settings.html" class="nav-item {A_SETTINGS}" data-tooltip="Settings">
          <span class="nav-item-icon"><i class="fa-solid fa-sliders"></i></span>
          <span class="nav-item-text">Platform Settings</span>
        </a>
      </div>
    </nav>

    <div class="sidebar-footer">
      <a href="../auth/login.html" class="nav-item signout-link" id="signOutBtn" data-tooltip="Sign Out">
        <span class="nav-item-icon"><i class="fa-solid fa-right-from-bracket"></i></span>
        <span class="nav-item-text">Sign Out</span>
      </a>
    </div>
  </aside>'''

# Pages and which nav item should be active
PAGES = {
    'index.html':    'DASHBOARD',
    'tenants.html':  'TENANTS',
    'users.html':    'USERS',
    'billing.html':  'BILLING',
    'health.html':   'HEALTH',
    'logs.html':     'LOGS',
    'settings.html': 'SETTINGS',
}

# CSS files each page must link
REQUIRED_HEAD = [
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter',
    '../assets/css/variables.css',
    '../assets/css/base.css',
    '../assets/css/components.css',
    '../assets/css/layout.css',
    'admin.css',
]

def make_sidebar(active_key):
    """Fill in the active class placeholders."""
    keys = ['DASHBOARD', 'TENANTS', 'USERS', 'BILLING', 'HEALTH', 'LOGS', 'SETTINGS']
    result = SIDEBAR_TEMPLATE
    for k in keys:
        placeholder = '{A_' + k + '}'
        value = 'active' if k == active_key else ''
        result = result.replace(placeholder, value)
    # Clean up double spaces from empty active classes
    result = re.sub(r'class="nav-item  "', 'class="nav-item"', result)
    result = re.sub(r'class="nav-item "', 'class="nav-item"', result)
    return result


def ensure_admin_css(html):
    """Make sure admin.css is linked in <head>."""
    if 'admin.css' not in html:
        html = html.replace('</head>', '  <link rel="stylesheet" href="admin.css"/>\n</head>')
    return html


def ensure_admin_js(html):
    """Make sure admin.js is loaded before </body>."""
    if 'admin.js' not in html:
        html = html.replace('</body>', '  <script src="admin.js"></script>\n</body>')
    return html


def replace_sidebar(html, new_sidebar):
    """Replace the <aside>...</aside> block in the HTML."""
    # Match <aside ...>...</aside> (non-greedy, DOTALL)
    pattern = re.compile(r'\s*<!--\s*Sidebar\s*-->\s*<aside\b[^>]*>.*?</aside>', re.DOTALL | re.IGNORECASE)
    if pattern.search(html):
        html = pattern.sub('\n' + new_sidebar, html, count=1)
    else:
        # Fallback: match just the <aside> block without comment
        pattern2 = re.compile(r'<aside\b[^>]*>.*?</aside>', re.DOTALL | re.IGNORECASE)
        if pattern2.search(html):
            html = pattern2.sub(new_sidebar, html, count=1)
        else:
            print('  [WARN] Could not find <aside> block — skipping sidebar replacement')
    return html


def process_page(filename, active_key):
    filepath = os.path.join(ADMIN_DIR, filename)
    if not os.path.exists(filepath):
        print(f'  [SKIP] {filename} not found')
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    sidebar_html = make_sidebar(active_key)
    html = replace_sidebar(html, sidebar_html)
    html = ensure_admin_css(html)
    html = ensure_admin_js(html)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

    wc = len(html.splitlines())
    print(f'  [OK] {filename:20s} → {wc} lines, active={active_key}')


def main():
    print('=== Admin Sidebar Sync ===\n')
    for filename, active_key in PAGES.items():
        process_page(filename, active_key)
    print('\n=== Done ===')


if __name__ == '__main__':
    main()
