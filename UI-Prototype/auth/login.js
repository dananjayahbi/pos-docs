/* Page-specific scripts — login.html */

function togglePassword() {
    const pwd = document.getElementById('password');
    const icon = document.getElementById('eyeIcon');
    if (pwd.type === 'password') {
      pwd.type = 'text';
      icon.className = 'fa-solid fa-eye-slash';
    } else {
      pwd.type = 'password';
      icon.className = 'fa-solid fa-eye';
    }
  }

  function fillDemo(email, pass) {
    document.getElementById('email').value = email;
    document.getElementById('password').value = pass;
  }

  function handleLogin(e) {
    e.preventDefault();
    const btn = document.getElementById('loginBtn');
    btn.disabled = true;
    btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Signing in…';

    // Simulate auth check
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Valid password for all demo accounts is the role prefix + 123
    let isValid = false;
    let role = '';
    let redirect = '';
    
    if (email === 'superadmin@lcc.lk' && password === 'super123') {
      isValid = true; role = 'Super Admin'; redirect = '../admin/index.html';
    } else if (email.startsWith('admin@') && password === 'admin123') {
      isValid = true; role = 'Tenant Admin'; redirect = '../erp/dashboard.html';
    } else if (email.startsWith('cashier@') && password === 'cash123') {
      isValid = true; role = 'Cashier'; redirect = '../pos/index.html';
    } else if (email.startsWith('stock@') && password === 'stock123') {
      isValid = true; role = 'Stock Manager'; redirect = '../erp/inventory/index.html';
    }

    setTimeout(() => {
      if (isValid) {
        localStorage.setItem('lcc_user', JSON.stringify({
          email, role: role, name: email.split('@')[0].replace('.', ' '),
          tenant: document.getElementById('currentTenantName').textContent, logged_in: true
        }));
        localStorage.setItem('lcc_auth', 'true');
        window.location.href = redirect;
      } else {
        btn.disabled = false;
        btn.innerHTML = '<i class="fa-solid fa-right-to-bracket"></i> Sign In';
        showLoginError('Invalid email or password. Try a demo account above.');
      }
    }, 900);
  }

  function showLoginError(msg) {
    let err = document.querySelector('.login-error');
    if (!err) {
      err = document.createElement('div');
      err.className = 'login-error';
      err.style.cssText = 'background:#fef2f2;border:1px solid #fecaca;color:#dc2626;border-radius:var(--radius);padding:0.75rem 1rem;font-size:0.875rem;display:flex;align-items:center;gap:0.5rem;margin-top:-0.5rem;';
      document.getElementById('loginForm').prepend(err);
    }
    err.innerHTML = '<i class="fa-solid fa-circle-exclamation"></i> ' + msg;
    setTimeout(() => { if (err) err.remove(); }, 5000);
  }

  // Auto-fill from URL params (for demo links)
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('demo')) {
    const demos = { admin: ['admin@sandbox.lcc.lk', 'admin123'], cashier: ['cashier@sandbox.lcc.lk','cash123'] };
    const d = demos[urlParams.get('demo')];
    if (d) fillDemo(d[0], d[1]);
  }

  // Tenant Switching Logic
  function toggleTenantDropdown() {
    document.getElementById('tenantDropdown').classList.toggle('show');
  }

  // Close dropdown when clicking outside
  document.addEventListener('click', function(event) {
    const wrapper = document.querySelector('.tenant-dropdown-wrapper');
    if (!wrapper.contains(event.target)) {
      document.getElementById('tenantDropdown').classList.remove('show');
    }
  });

  function selectTenant(name, domain, avatar) {
    document.getElementById('currentTenantName').textContent = name;
    document.getElementById('currentTenantDomain').textContent = domain;
    document.getElementById('currentTenantAvatar').textContent = avatar;
    
    // Update active class in dropdown
    const options = document.querySelectorAll('.tenant-option');
    options.forEach(opt => {
      if (opt.querySelector('.tenant-name').textContent === name) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
    
    document.getElementById('tenantDropdown').classList.remove('show');
    
    // Render demo accounts for the selected tenant
    renderDemoAccounts(domain);
  }

  function renderDemoAccounts(domain) {
    const container = document.getElementById('demoAccountsList');
    
    const accountsHtml = `
      <div class="demo-account-item">
        <div>
          <div class="demo-role"><i class="fa-solid fa-shield-halved"></i> Super Admin</div>
          <div class="demo-creds">superadmin@lcc.lk</div>
        </div>
        <button type="button" class="btn-use-demo" onclick="fillDemo('superadmin@lcc.lk','super123')">Use</button>
      </div>
      <div class="demo-account-item">
        <div>
          <div class="demo-role"><i class="fa-solid fa-user-gear"></i> Tenant Admin</div>
          <div class="demo-creds">admin@${domain}</div>
        </div>
        <button type="button" class="btn-use-demo" onclick="fillDemo('admin@${domain}','admin123')">Use</button>
      </div>
      <div class="demo-account-item">
        <div>
          <div class="demo-role"><i class="fa-solid fa-cash-register"></i> Cashier</div>
          <div class="demo-creds">cashier@${domain}</div>
        </div>
        <button type="button" class="btn-use-demo" onclick="fillDemo('cashier@${domain}','cash123')">Use</button>
      </div>
      <div class="demo-account-item">
        <div>
          <div class="demo-role"><i class="fa-solid fa-box"></i> Stock Manager</div>
          <div class="demo-creds">stock@${domain}</div>
        </div>
        <button type="button" class="btn-use-demo" onclick="fillDemo('stock@${domain}','stock123')">Use</button>
      </div>
    `;
    
    container.innerHTML = accountsHtml;
    
    // Also auto-fill the admin for this tenant into inputs
    document.getElementById('email').value = `admin@${domain}`;
    document.getElementById('password').value = 'admin123';
  }

  // Initialize with default
  renderDemoAccounts('sandbox.lcc.lk');
