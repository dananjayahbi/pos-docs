"""Remove page description paragraphs from admin pages."""
import re, os

admin = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'admin')
pages = ['index.html','tenants.html','users.html','billing.html','health.html','logs.html','settings.html']
# Remove p.page-subtitle BUT keep the one with id="pageDate" (shows dynamic date)
pattern = re.compile(r'[ \t]*<p class="page-subtitle"(?! id="pageDate")>.*?</p>\n', re.IGNORECASE|re.DOTALL)

for p in pages:
    fp = os.path.join(admin, p)
    html = open(fp, encoding='utf-8').read()
    new_html, count = pattern.subn('', html)
    open(fp, 'w', encoding='utf-8').write(new_html)
    print(f'  {p}: removed {count} subtitle(s)')
print('Done')
