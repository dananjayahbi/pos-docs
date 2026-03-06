/* Page-specific scripts — index.html */

function switchTab(tab, anchor) {
    document.querySelectorAll('.settings-nav li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.panel-card').forEach(p => p.classList.remove('active'));
    anchor.closest('li').classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
}

function showToast(msg, type) {
    const tc = document.getElementById('toastContainer'); if (!tc) return;
    const C = { success:'#16a34a', warning:'#d97706', error:'#dc2626', info:'#2563eb' };
    const t = document.createElement('div');
    t.style.cssText = 'background:' + (C[type] || C.info) + ';color:#fff;padding:.625rem 1rem;border-radius:8px;font-size:.875rem;box-shadow:0 4px 12px rgba(0,0,0,.15);';
    t.textContent = msg; tc.appendChild(t); setTimeout(() => t.remove(), 3500);
}
