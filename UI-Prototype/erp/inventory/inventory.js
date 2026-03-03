/* Page-specific scripts — index.html */

// Live search filter
  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const warehouseFilter = document.getElementById('warehouseFilter');
  const rows = document.querySelectorAll('#invTable tbody tr');

  function applyFilters() {
    const q = searchInput.value.toLowerCase();
    const st = statusFilter.value.toLowerCase();
    const wh = warehouseFilter.value.toLowerCase();
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      const show = (!q || text.includes(q)) &&
                   (!st || text.includes(st)) &&
                   (!wh || text.includes(wh));
      row.style.display = show ? '' : 'none';
    });
  }

  searchInput.addEventListener('input', applyFilters);
  statusFilter.addEventListener('change', applyFilters);
  warehouseFilter.addEventListener('change', applyFilters);
