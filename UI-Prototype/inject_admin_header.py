"""
Replaces the full <header class="top-bar">...</header> in every admin page
with a thin data-driven marker, and adds admin-header.js to the script chain.
"""
import os
import re

ADMIN_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'admin')

PAGE_TITLES = {
    'index.html':    'Platform Administration',
    'tenants.html':  'Tenants / Stores',
    'users.html':    'Platform Users',
    'billing.html':  'Billing &amp; Plans',
    'health.html':   'System Health',
    'logs.html':     'Logs &amp; Audit',
    'settings.html': 'Platform Settings',
}

THIN_HEADER_TEMPLATE = '    <header class="top-bar" id="adminTopBar" data-page-title="{TITLE}"></header>'


def replace_header_block(html, thin_header):
    """Replace <header class="top-bar">...</header> with the thin marker."""
    pattern = re.compile(
        r'[ \t]*<header\b[^>]*class="[^"]*top-bar[^"]*"[^>]*>.*?</header>',
        re.DOTALL | re.IGNORECASE
    )
    if pattern.search(html):
        return pattern.sub(thin_header, html, count=1)
    print('  [WARN] Could not find <header class="top-bar"> block')
    return html


def ensure_header_js(html):
    """Add admin-header.js before admin.js if not already present."""
    if 'admin-header.js' in html:
        return html
    return html.replace(
        '<script src="admin.js"></script>',
        '<script src="admin-header.js"></script>\n  <script src="admin.js"></script>'
    )


def process_page(filename, title):
    filepath = os.path.join(ADMIN_DIR, filename)
    if not os.path.exists(filepath):
        print(f'  [SKIP] {filename} not found')
        return

    with open(filepath, 'r', encoding='utf-8') as f:
        html = f.read()

    thin = THIN_HEADER_TEMPLATE.format(TITLE=title)
    html = replace_header_block(html, thin)
    html = ensure_header_js(html)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(html)

    print(f'  [OK] {filename:20s} → title="{title}"')


def main():
    print('=== Admin Header Component Injection ===\n')
    for filename, title in PAGE_TITLES.items():
        process_page(filename, title)
    print('\n=== Done ===')


if __name__ == '__main__':
    main()
