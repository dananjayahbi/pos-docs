/* ================================================================
   LCC Categories Page — Main Controller
   ================================================================ */

let allCategories = [];
let filteredCats  = [];
let _deleteCatId  = null;
let _editCatId    = null;
let catViewMode   = 'grid'; // 'grid' | 'table'

// ── Data (loaded on init, same source as products.json) ──────────

const CATEGORIES_DATA = [
  { id: 'CAT-001', name: "Men's Clothing",   slug: 'mens-clothing',    parent: null, product_count: 25, is_active: true,  description: "Clothing and apparel for men, including shirts, trousers, and formal wear.",                            image: 'https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?w=300&h=200&fit=crop&auto=format', created_at: '2025-10-12T08:00:00Z' },
  { id: 'CAT-002', name: "Women's Clothing", slug: 'womens-clothing',   parent: null, product_count: 18, is_active: true,  description: "Apparel and fashion pieces for women, including dresses, blouses, and ethnic wear.",                   image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&auto=format', created_at: '2025-10-12T08:00:00Z' },
  { id: 'CAT-003', name: 'Groceries',        slug: 'groceries',         parent: null, product_count: 45, is_active: true,  description: "Everyday household grocery items including rice, tea, spices, and beverages.",                        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=200&fit=crop&auto=format', created_at: '2025-10-14T08:00:00Z' },
  { id: 'CAT-004', name: 'Furniture',        slug: 'furniture',         parent: null, product_count: 8,  is_active: true,  description: "Home and office furniture including chairs, tables, and shelving units.",                             image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=200&fit=crop&auto=format', created_at: '2025-10-18T08:00:00Z' },
  { id: 'CAT-005', name: 'Electronics',      slug: 'electronics',       parent: null, product_count: 12, is_active: true,  description: "Consumer electronics, phones, routers, fans, and electrical appliances.",                            image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=300&h=200&fit=crop&auto=format', created_at: '2025-10-20T08:00:00Z' },
  { id: 'CAT-006', name: "Children's Wear",  slug: 'childrens-wear',    parent: null, product_count: 5,  is_active: true,  description: "Comfortable and colourful clothing for children of all ages.",                                        image: 'https://images.unsplash.com/photo-1519457431-44ccd64a579b?w=300&h=200&fit=crop&auto=format', created_at: '2025-11-02T08:00:00Z' },
  { id: 'CAT-007', name: 'Traditional Wear', slug: 'traditional-wear',  parent: null, product_count: 8,  is_active: true,  description: "Sri Lankan traditional attire including sarees, batik sarongs, and Kandyan dress.",                  image: 'https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=300&h=200&fit=crop&auto=format', created_at: '2025-11-05T08:00:00Z' },
  { id: 'CAT-008', name: 'Sportswear',       slug: 'sportswear',        parent: null, product_count: 10, is_active: false, description: "Activewear, sports shoes, gym gear, and outdoor clothing.",                                          image: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=300&h=200&fit=crop&auto=format', created_at: '2025-11-10T08:00:00Z' },
];

// ── KPI ────────────────────────────────────────────────────────

function updateKPIs() {
  const total    = allCategories.length;
  const active   = allCategories.filter(c => c.is_active).length;
  const products = allCategories.reduce((s, c) => s + (c.product_count || 0), 0);

  // recently added = created in last 30 days
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const recent = allCategories.filter(c => new Date(c.created_at) > thirtyDaysAgo).length;

  setText('kpiTotal', total);
  setText('kpiActive', active);
  setText('kpiProducts', products);
  setText('kpiRecent', recent);
  setText('kpiTotalSub', (total - active) + ' inactive');
}

function setText(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

// ── Filter & Sort ──────────────────────────────────────────────

function applyFilters() {
  const q      = (document.getElementById('catSearch')?.value || '').trim().toLowerCase();
  const status = document.getElementById('catStatusFilter')?.value || '';
  const sort   = document.getElementById('catSortBy')?.value || 'name';

  filteredCats = allCategories.filter(c => {
    const matchQ  = !q || c.name.toLowerCase().includes(q) || c.slug.includes(q);
    const matchSt = !status
      || (status === 'active' && c.is_active)
      || (status === 'inactive' && !c.is_active);
    return matchQ && matchSt;
  });

  // Sort
  filteredCats.sort((a, b) => {
    if (sort === 'name')          return a.name.localeCompare(b.name);
    if (sort === 'products_desc') return (b.product_count || 0) - (a.product_count || 0);
    if (sort === 'products_asc')  return (a.product_count || 0) - (b.product_count || 0);
    if (sort === 'newest')        return new Date(b.created_at) - new Date(a.created_at);
    return 0;
  });

  const hasFilter = q || status;
  const resetBtn = document.getElementById('btnCatReset');
  if (resetBtn) resetBtn.classList.toggle('visible', !!hasFilter);

  setText('catResultsLabel', `Showing ${filteredCats.length} of ${allCategories.length} categories`);

  renderCats();
}

function resetFilters() {
  const s = document.getElementById('catSearch');
  if (s) s.value = '';
  const sf = document.getElementById('catStatusFilter');
  if (sf) sf.value = '';
  applyFilters();
}

// ── Render ─────────────────────────────────────────────────────

function renderCats() {
  if (catViewMode === 'grid') {
    renderCards();
    document.getElementById('catCardsContainer').style.display = '';
    document.getElementById('catTableContainer').style.display = 'none';
  } else {
    renderTable();
    document.getElementById('catCardsContainer').style.display = 'none';
    document.getElementById('catTableContainer').style.display = '';
  }

  const empty = document.getElementById('catEmptyState');
  if (empty) empty.style.display = filteredCats.length === 0 ? '' : 'none';
}

function renderCards() {
  const container = document.getElementById('catCardsContainer');
  if (!container) return;

  container.innerHTML = filteredCats.map(cat => {
    const imgHtml = cat.image
      ? `<img class="cat-card-img" src="${cat.image}" alt="${cat.name}" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';" />
         <div class="cat-card-img-placeholder" style="display:none;"><i class="fa-solid fa-folder"></i></div>`
      : `<div class="cat-card-img-placeholder"><i class="fa-solid fa-folder"></i></div>`;

    const statusBadge = cat.is_active
      ? '<span class="badge badge-active">Active</span>'
      : '<span class="badge badge-inactive">Inactive</span>';

    return `
      <div class="cat-card">
        ${imgHtml}
        <div class="cat-card-body">
          <div class="cat-card-name">${cat.name}</div>
          <div class="cat-card-slug">/${cat.slug}/</div>
          <div class="cat-card-meta">
            <div class="cat-card-count"><i class="fa-solid fa-box" style="margin-right:0.25rem;font-size:0.75rem;"></i><strong>${cat.product_count || 0}</strong> products</div>
            ${statusBadge}
          </div>
        </div>
        <div class="cat-card-footer">
          <button class="act-btn" title="Edit" onclick="openEditCatModal('${cat.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="act-btn danger" title="Delete" onclick="openDeleteCatModal('${cat.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </div>
    `;
  }).join('');
}

function renderTable() {
  const tbody = document.getElementById('catTableBody');
  if (!tbody) return;

  const parentMap = {};
  allCategories.forEach(c => { parentMap[c.id] = c.name; });

  tbody.innerHTML = filteredCats.map(cat => {
    const parentName  = cat.parent ? (parentMap[cat.parent] || cat.parent) : '—';
    const statusBadge = cat.is_active
      ? '<span class="badge badge-active">Active</span>'
      : '<span class="badge badge-inactive">Inactive</span>';
    const created = cat.created_at ? new Date(cat.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric' }) : '—';

    return `
      <tr>
        <td>
          ${cat.image ? `<img src="${cat.image}" alt="${cat.name}" style="width:36px;height:36px;border-radius:6px;object-fit:cover;margin-right:0.625rem;vertical-align:middle;" />` : ''}
          <strong>${cat.name}</strong>
        </td>
        <td style="font-family:monospace;font-size:0.8rem;color:var(--color-neutral-500);">/${cat.slug}/</td>
        <td>${parentName}</td>
        <td>${cat.product_count || 0}</td>
        <td>${statusBadge}</td>
        <td style="font-size:0.8rem;color:var(--color-neutral-500);">${created}</td>
        <td>
          <button class="act-btn" title="Edit" onclick="openEditCatModal('${cat.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="act-btn danger" title="Delete" onclick="openDeleteCatModal('${cat.id}')"><i class="fa-solid fa-trash"></i></button>
        </td>
      </tr>
    `;
  }).join('');
}

// ── View Toggle ────────────────────────────────────────────────

function toggleCatView() {
  catViewMode = catViewMode === 'grid' ? 'table' : 'grid';
  const icon = document.getElementById('viewToggleIcon');
  if (icon) {
    icon.className = catViewMode === 'grid'
      ? 'fa-solid fa-table-cells'
      : 'fa-solid fa-list';
  }
  renderCats();
}

// ── Populate parent select ─────────────────────────────────────

function populateParentSelect(excludeId) {
  const sel = document.getElementById('catFormParent');
  if (!sel) return;
  const opts = allCategories
    .filter(c => c.id !== excludeId)
    .map(c => `<option value="${c.id}">${c.name}</option>`)
    .join('');
  sel.innerHTML = '<option value="">— None (Top Level) —</option>' + opts;
}

// ── Slug helpers ───────────────────────────────────────────────

function slugify(str) {
  return str.toLowerCase()
    .replace(/[''`]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function autofillSlug(force) {
  const nameEl = document.getElementById('catFormName');
  const slugEl = document.getElementById('catFormSlug');
  if (!nameEl || !slugEl) return;
  if (force || !slugEl.dataset.edited) {
    slugEl.value = slugify(nameEl.value);
  }
}

function previewCatImage() {
  const url     = document.getElementById('catFormImage')?.value.trim();
  const preview = document.getElementById('catImgPreview');
  const img     = document.getElementById('catImgPreviewImg');
  if (preview && img) {
    if (url) { img.src = url; preview.style.display = ''; }
    else { preview.style.display = 'none'; }
  }
}

// ── Add / Edit Modal ───────────────────────────────────────────

function openAddCatModal() {
  _editCatId = null;
  document.getElementById('catFormId').value     = '';
  document.getElementById('catFormName').value   = '';
  document.getElementById('catFormSlug').value   = '';
  document.getElementById('catFormImage').value  = '';
  document.getElementById('catFormDesc').value   = '';
  document.getElementById('catFormStatus').value = 'true';
  const slugEl = document.getElementById('catFormSlug');
  if (slugEl) delete slugEl.dataset.edited;
  document.getElementById('catImgPreview').style.display = 'none';
  populateParentSelect(null);
  document.getElementById('catModalTitle').innerHTML    = '<i class="fa-solid fa-folder-plus" style="color:#4f46e5;margin-right:0.5rem;"></i>Add Category';
  document.getElementById('catSaveBtnText').textContent = 'Add Category';
  document.getElementById('catFormModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function openEditCatModal(id) {
  const cat = allCategories.find(c => c.id === id);
  if (!cat) return;
  _editCatId = id;

  document.getElementById('catFormId').value     = id;
  document.getElementById('catFormName').value   = cat.name;
  document.getElementById('catFormSlug').value   = cat.slug;
  document.getElementById('catFormImage').value  = cat.image || '';
  document.getElementById('catFormDesc').value   = cat.description || '';
  document.getElementById('catFormStatus').value = String(cat.is_active);
  const slugEl = document.getElementById('catFormSlug');
  if (slugEl) slugEl.dataset.edited = '1'; // don't override existing slug
  previewCatImage();
  populateParentSelect(id);
  const parentSel = document.getElementById('catFormParent');
  if (parentSel) parentSel.value = cat.parent || '';
  document.getElementById('catModalTitle').innerHTML    = `<i class="fa-solid fa-pen-to-square" style="color:#4f46e5;margin-right:0.5rem;"></i>Edit: ${cat.name}`;
  document.getElementById('catSaveBtnText').textContent = 'Save Changes';
  document.getElementById('catFormModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCatModal() {
  document.getElementById('catFormModal').classList.remove('open');
  document.body.style.overflow = '';
}

function saveCatForm() {
  const name   = document.getElementById('catFormName').value.trim();
  const slug   = document.getElementById('catFormSlug').value.trim();
  const image  = document.getElementById('catFormImage').value.trim();
  const desc   = document.getElementById('catFormDesc').value.trim();
  const active = document.getElementById('catFormStatus').value === 'true';
  const parent = document.getElementById('catFormParent').value || null;

  if (!name) { showCatToast('Category name is required', 'warning'); return; }
  if (!slug) { showCatToast('Slug is required', 'warning'); return; }

  if (_editCatId) {
    const cat = allCategories.find(c => c.id === _editCatId);
    if (cat) {
      cat.name        = name;
      cat.slug        = slug;
      cat.image       = image;
      cat.description = desc;
      cat.is_active   = active;
      cat.parent      = parent;
    }
    showCatToast(name + ' updated successfully', 'success');
  } else {
    const newId = 'CAT-' + String(allCategories.length + 1).padStart(3, '0');
    allCategories.push({
      id: newId, name, slug, image, description: desc,
      is_active: active, parent,
      product_count: 0,
      created_at: new Date().toISOString()
    });
    showCatToast(name + ' added successfully', 'success');
  }

  closeCatModal();
  updateKPIs();
  applyFilters();
}

// ── Delete Modal ───────────────────────────────────────────────

function openDeleteCatModal(id) {
  _deleteCatId = id;
  const cat = allCategories.find(c => c.id === id);
  const nameEl = document.getElementById('catDeleteName');
  if (nameEl && cat) nameEl.textContent = '"' + cat.name + '"';
  document.getElementById('catDeleteModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeCatDeleteModal() {
  document.getElementById('catDeleteModal').classList.remove('open');
  document.body.style.overflow = '';
  _deleteCatId = null;
}

function confirmDeleteCat() {
  if (!_deleteCatId) return;
  const cat  = allCategories.find(c => c.id === _deleteCatId);
  const name = cat ? cat.name : _deleteCatId;
  allCategories = allCategories.filter(c => c.id !== _deleteCatId);
  closeCatDeleteModal();
  updateKPIs();
  applyFilters();
  showCatToast('"' + name + '" deleted', 'success');
}

// ── Toast ─────────────────────────────────────────────────────

function showCatToast(msg, type) {
  if (window.Toast) {
    const t = type || 'info';
    if (t === 'success')      Toast.success('Success', msg);
    else if (t === 'warning') Toast.warning('Warning', msg);
    else if (t === 'error')   Toast.error('Error', msg);
    else                      Toast.info('Info', msg);
  } else if (typeof showToast === 'function') {
    showToast(msg, type || 'info');
  }
}

// ── Init ──────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  // Try to load from products.json; fall back to CATEGORIES_DATA
  fetch('../../../data/products.json')
    .then(r => r.json())
    .then(data => {
      if (data.categories && data.categories.length) {
        // Merge with CATEGORIES_DATA for extra fields (description, is_active, etc.)
        const extraMap = {};
        CATEGORIES_DATA.forEach(c => { extraMap[c.id] = c; });
        allCategories = data.categories.map(c => ({
          is_active: true,
          description: '',
          created_at: '2025-10-12T08:00:00Z',
          ...extraMap[c.id],
          ...c
        }));
      } else {
        allCategories = [...CATEGORIES_DATA];
      }
    })
    .catch(() => {
      allCategories = [...CATEGORIES_DATA];
    })
    .finally(() => {
      updateKPIs();
      applyFilters();
    });

  // Slug edit marking
  const slugEl = document.getElementById('catFormSlug');
  if (slugEl) slugEl.addEventListener('input', () => { slugEl.dataset.edited = '1'; });

  // Backdrop-click to close modals
  ['catFormModal', 'catDeleteModal'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', function (e) {
      if (e.target === this) {
        if (id === 'catFormModal')   closeCatModal();
        if (id === 'catDeleteModal') closeCatDeleteModal();
      }
    });
  });
});
