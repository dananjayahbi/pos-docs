"""
Separates inline <style> and <script> blocks in HTML pages into
companion .css and .js files, then updates the HTML to reference them.

Run from: e:/tmp/pos-arch/UI-Prototype/
Usage:    python separate_assets.py
"""

import os
import re
import sys

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Pages to process: (html_path, css_output_name, js_output_name)
PAGES = [
    ('auth/login.html',              'auth/login.css',              'auth/login.js'),
    ('erp/dashboard.html',           'erp/dashboard.css',           'erp/dashboard.js'),
    ('erp/inventory/index.html',     'erp/inventory/inventory.css', 'erp/inventory/inventory.js'),
    ('erp/vendors/index.html',       'erp/vendors/vendors.css',     'erp/vendors/vendors.js'),
    ('erp/hr/index.html',            'erp/hr/hr.css',               'erp/hr/hr.js'),
    ('erp/accounting/index.html',    'erp/accounting/accounting.css','erp/accounting/accounting.js'),
    ('erp/reports/index.html',       'erp/reports/reports.css',     'erp/reports/reports.js'),
    ('erp/settings/index.html',      'erp/settings/settings.css',   'erp/settings/settings.js'),
    ('erp/products/index.html',      'erp/products/products.css',   'erp/products/products.js'),
    ('erp/sales/orders.html',        'erp/sales/orders.css',        'erp/sales/orders.js'),
    ('erp/customers/index.html',     'erp/customers/customers.css', 'erp/customers/customers.js'),
    ('pos/index.html',               'pos/pos.css',                 'pos/pos.js'),
    ('webstore/index.html',          'webstore/webstore.css',       'webstore/webstore.js'),
    ('admin/index.html',             'admin/admin.css',             'admin/admin.js'),
    ('index.html',                   'index.css',                   'index.js'),
]


def extract_inline_styles(html):
    """Extract content of ALL <style>...</style> blocks, return (cleaned_html, css_content)."""
    style_blocks = re.findall(r'<style[^>]*>(.*?)</style>', html, re.DOTALL)
    if not style_blocks:
        return html, ''
    css_content = '\n\n'.join(block.strip() for block in style_blocks if block.strip())
    # Remove all <style> blocks from html
    cleaned = re.sub(r'\s*<style[^>]*>.*?</style>', '', html, flags=re.DOTALL)
    return cleaned, css_content


def extract_inline_scripts(html):
    """
    Extract content of inline <script> blocks (no src attribute),
    skipping empty or trivial ones.
    Returns (cleaned_html, js_content).
    """
    # Match <script> blocks WITHOUT src attribute
    inline_pattern = re.compile(r'<script(?![^>]*\bsrc\b)[^>]*>(.*?)</script>', re.DOTALL)
    blocks = inline_pattern.findall(html)
    js_parts = [b.strip() for b in blocks if b.strip()]
    if not js_parts:
        return html, ''
    js_content = '\n\n'.join(js_parts)
    # Remove from HTML
    cleaned = inline_pattern.sub('', html)
    return cleaned, js_content


def insert_link_before_closing_head(html, link_tag):
    """Insert a <link> tag just before </head>."""
    return html.replace('</head>', f'  {link_tag}\n</head>', 1)


def insert_script_before_closing_body(html, script_tag):
    """Insert a <script> tag just before </body>."""
    return html.replace('</body>', f'  {script_tag}\n</body>', 1)


def process_page(html_rel, css_rel, js_rel):
    html_path = os.path.join(BASE_DIR, html_rel)
    css_path  = os.path.join(BASE_DIR, css_rel)
    js_path   = os.path.join(BASE_DIR, js_rel)

    if not os.path.exists(html_path):
        print(f'  [SKIP] {html_rel} — not found')
        return

    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()

    # 1. Extract styles
    html, css_content = extract_inline_styles(html)

    # 2. Extract scripts
    html, js_content = extract_inline_scripts(html)

    # 3. Write companion CSS file (even if empty, for completeness)
    os.makedirs(os.path.dirname(css_path), exist_ok=True)
    if css_content:
        with open(css_path, 'w', encoding='utf-8') as f:
            f.write(f'/* Page-specific styles — {os.path.basename(html_rel)} */\n\n')
            f.write(css_content)
            f.write('\n')
        # Add link to HTML
        css_filename = os.path.basename(css_rel)
        html = insert_link_before_closing_head(html, f'<link rel="stylesheet" href="{css_filename}" />')
        print(f'  [CSS] {css_rel}  ({len(css_content)} chars)')
    else:
        print(f'  [CSS] {css_rel}  (no inline styles found)')

    # 4. Write companion JS file
    if js_content:
        with open(js_path, 'w', encoding='utf-8') as f:
            f.write(f'/* Page-specific scripts — {os.path.basename(html_rel)} */\n\n')
            f.write(js_content)
            f.write('\n')
        # Add script to HTML
        js_filename = os.path.basename(js_rel)
        html = insert_script_before_closing_body(html, f'<script src="{js_filename}"></script>')
        print(f'  [JS]  {js_rel}  ({len(js_content)} chars)')
    else:
        print(f'  [JS]  {js_rel}  (no inline scripts found)')

    # 5. Write updated HTML
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f'  [HTML] {html_rel}  updated\n')


def main():
    print('=== LCC UI Prototype — Separating inline assets ===\n')
    for html_rel, css_rel, js_rel in PAGES:
        print(f'Processing: {html_rel}')
        process_page(html_rel, css_rel, js_rel)
    print('=== Done ===')


if __name__ == '__main__':
    main()
