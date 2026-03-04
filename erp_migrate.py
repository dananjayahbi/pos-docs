"""
ERP page migrator v2: Updates all ERP HTML pages to use the standardised
super-admin-style sidebar (injected by erp-header.js) + top-bar header.
Run:  python erp_migrate.py
"""
import os, re

ERP_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "UI-Prototype", "erp")

PAGE_TITLES = {
    ("erp",         "dashboard.html"): "Dashboard",
    ("sales",       "orders.html"):    "Sales Orders",
    ("products",    "index.html"):     "Products",
    ("inventory",   "index.html"):     "Inventory",
    ("customers",   "index.html"):     "Customers",
    ("vendors",     "index.html"):     "Vendors",
    ("accounting",  "index.html"):     "Accounting",
    ("hr",          "index.html"):     "HR &amp; Payroll",
    ("reports",     "index.html"):     "Reports",
    ("settings",    "index.html"):     "Store Settings",
}

def get_title(fp):
    folder = os.path.basename(os.path.dirname(fp))
    fname  = os.path.basename(fp)
    return PAGE_TITLES.get((folder, fname), "ERP Dashboard")

def base_prefix(fp):
    rel = os.path.relpath(os.path.dirname(fp), os.path.normpath(ERP_DIR))
    if rel == ".": return ""
    depth = len([p for p in rel.replace("\\","/").split("/") if p and p!="."])
    return "../" * depth

def migrate(fp):
    src = open(fp, encoding="utf-8").read()

    head = re.search(r"(<!DOCTYPE[^>]*>.*?</head>)", src, re.DOTALL|re.I)
    if not head: print(f"  SKIP {fp}"); return

    mw = re.search(r'<(?:main|div)[^>]+class="[^"]*main-wrapper[^"]*"[^>]*>', src, re.DOTALL)
    if not mw: print(f"  SKIP (no mw) {fp}"); return

    after = src[mw.end():]

    # Split content from scripts/footer
    sc = re.search(r'(?:<!-- Toast|<script\s)', after, re.DOTALL)
    if sc:
        inner = after[:sc.start()]
        scripts = after[sc.start():]
    else:
        end = re.search(r'</(?:main|body)>', after, re.I)
        inner = after[:end.start()] if end else after
        scripts = after[end.start():] if end else ""

    # Strip trailing </main> or </div> from inner
    inner = re.sub(r'\s*</(?:main|div)>\s*$','',inner).strip()

    # Strip stray closing tags from start of scripts
    scripts = re.sub(r'^\s*</(?:main|div)>','',scripts).strip()
    if not re.search(r'</body>\s*</html>', scripts, re.I):
        scripts = scripts.rstrip() + "\n</body>\n</html>"

    b = base_prefix(fp)
    t = get_title(fp)

    erph = f'<script src="{b}erp-header.js"></script>'
    erpj = f'<script src="{b}erp.js"></script>'

    if "erp-header.js" not in scripts:
        scripts = re.sub(r'(<script[^>]+layout\.js[^>]*></script>)', r'\1\n'+erph, scripts)
    if "erp.js" not in scripts and "erp-header.js" in scripts:
        scripts = re.sub(r'(<script[^>]+erp-header\.js[^>]*></script>)', r'\1\n'+erpj, scripts)

    out = f"""{head.group(1)}
<body>

<div class="app-shell">
  <aside class="sidebar" id="sidebar"></aside>

  <div class="main-wrapper" id="mainWrapper">
    <header class="top-bar" id="erpTopBar" data-page-title="{t}"></header>

{inner}

  </div><!-- /.main-wrapper -->
</div><!-- /.app-shell -->

<div class="sidebar-overlay" id="sidebarOverlay"></div>

{scripts}
"""
    open(fp, "w", encoding="utf-8", newline="\n").write(out)
    print(f"  OK  {os.path.relpath(fp, ERP_DIR)}")

files = []
for root,_,fnames in os.walk(ERP_DIR):
    for f in fnames:
        if f.endswith(".html"): files.append(os.path.join(root,f))

print(f"\nMigrating {len(files)} ERP pages ...\n")
for fp in files: migrate(fp)
print("\nDone.")
