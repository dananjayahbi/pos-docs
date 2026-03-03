/* Page-specific scripts — index.html */

function switchTab(tab, anchor) {
    document.querySelectorAll('.settings-nav li').forEach(li => li.classList.remove('active'));
    document.querySelectorAll('.panel-card').forEach(p => p.classList.remove('active'));
    anchor.closest('li').classList.add('active');
    document.getElementById('tab-' + tab).classList.add('active');
  }
