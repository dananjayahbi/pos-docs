/* Page-specific scripts — index.html */

// Check if already logged in
    const isLoggedIn = localStorage.getItem('lcc_auth') === 'true';
    const user = JSON.parse(localStorage.getItem('lcc_user') || '{}');

    const statusEl = document.getElementById('statusText');

    if (isLoggedIn && user.logged_in) {
      statusEl.textContent = `Welcome back, ${user.name || 'User'}. Redirecting…`;
      // Route based on role
      const roleRedirects = {
        'Super Admin':    'admin/index.html',
        'Cashier':        'pos/index.html',
        'Stock Manager':  'erp/inventory/index.html',
        'Tenant Admin':   'erp/dashboard.html',
      };
      const dest = roleRedirects[user.role] || 'erp/dashboard.html';
      setTimeout(() => { window.location.href = dest; }, 800);
    } else {
      statusEl.textContent = 'Redirecting to login…';
      setTimeout(() => { window.location.href = 'auth/login.html'; }, 1000);
    }

    // Show manual cards if redirect takes too long
    setTimeout(() => {
      document.getElementById('spinner').style.display = 'none';
      document.getElementById('statusText').textContent = 'Choose where to go:';
      document.getElementById('appCards').style.display = 'grid';
    }, 2200);
