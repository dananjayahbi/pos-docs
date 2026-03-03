"""
Copy the Add Tenant modal from admin/index.html to admin/tenants.html
and wire the Add Tenant button with proper id/data-modal-open attributes.
"""
import re, os

ADMIN = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'admin')

def extract_modal(html):
    """Extract the full <!-- ADD TENANT MODAL --> ... <!-- /#addTenantModal --> block."""
    pattern = re.compile(
        r'<!-- =+\s*ADD TENANT MODAL.*?</div><!-- /#addTenantModal -->',
        re.DOTALL | re.IGNORECASE
    )
    m = pattern.search(html)
    return m.group(0) if m else None

def main():
    # Read source
    src = os.path.join(ADMIN, 'index.html')
    with open(src, encoding='utf-8') as f:
        src_html = f.read()

    modal_html = extract_modal(src_html)
    if not modal_html:
        print('[ERROR] Could not find modal block in index.html'); return

    # Read tenants.html
    dest = os.path.join(ADMIN, 'tenants.html')
    with open(dest, encoding='utf-8') as f:
        dest_html = f.read()

    # 1. Wire the Add Tenant button
    dest_html = re.sub(
        r'<button class="btn btn-primary">\s*<i class="fa-solid fa-plus"></i>\s*Add Tenant\s*</button>',
        '<button class="btn btn-primary" id="addTenantBtn" data-modal-open="addTenantModal">'
        '<i class="fa-solid fa-plus"></i> Add Tenant</button>',
        dest_html
    )

    # 2. Inject modal HTML before sidebar-overlay (if not already present)
    if 'addTenantModal' not in dest_html:
        dest_html = dest_html.replace(
            '<div class="sidebar-overlay" id="sidebarOverlay"></div>',
            modal_html + '\n\n<div class="sidebar-overlay" id="sidebarOverlay"></div>'
        )
        print('[OK] Modal HTML injected into tenants.html')
    else:
        print('[SKIP] Modal already present in tenants.html')

    with open(dest, 'w', encoding='utf-8') as f:
        f.write(dest_html)

    print('[OK] tenants.html updated successfully')

if __name__ == '__main__':
    main()
