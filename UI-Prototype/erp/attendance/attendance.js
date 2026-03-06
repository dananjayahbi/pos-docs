'use strict';

let allAtt = [];
let filteredAtt = [];
let editingId = null;
let deletingId = null;
let currentPage = 1;
const PAGE_SIZE = 10;

// ── Load ────────────────────────────────────────────────────────────────────
async function loadAttendance() {
  try {
    const res = await fetch('../../data/attendance.json?v=' + Date.now());
    const data = await res.json();
    allAtt = data.attendance || [];
    const local = JSON.parse(localStorage.getItem('lcc_attendance') || '[]');
    local.forEach(loc => {
      const idx = allAtt.findIndex(a => a.id === loc.id);
      if (idx > -1) allAtt[idx] = loc; else allAtt.push(loc);
    });
  } catch (e) {
    allAtt = JSON.parse(localStorage.getItem('lcc_attendance') || '[]');
    console.warn('Attendance fetch failed, using localStorage', e);
  }
  applyFilters();
}

function saveLocal() {
  localStorage.setItem('lcc_attendance', JSON.stringify(allAtt));
}

// ── Stats ───────────────────────────────────────────────────────────────────
function updateStats() {
  const el = id => document.getElementById(id);
  el('statTotalRecords').textContent = allAtt.length;
  el('statPresent').textContent = allAtt.filter(a => a.status === 'present').length;
  el('statAbsent').textContent = allAtt.filter(a => a.status === 'absent').length;
  el('statLate').textContent = allAtt.filter(a => a.status === 'late').length;
}

// ── Filters ─────────────────────────────────────────────────────────────────
function applyFilters() {
  const q = (document.getElementById('attSearch')?.value || '').toLowerCase();
  const st = document.getElementById('filterStatus')?.value || '';
  const dt = document.getElementById('filterDate')?.value || '';

  filteredAtt = allAtt.filter(a => {
    const matchQ = !q || a.id.toLowerCase().includes(q) || a.employee_name.toLowerCase().includes(q) || a.employee_id.toLowerCase().includes(q);
    const matchSt = !st || a.status === st;
    const matchDt = !dt || a.date === dt;
    return matchQ && matchSt && matchDt;
  });

  currentPage = 1;
  updateStats();
  renderTable();
  renderPagination();
}

function clearFilters() {
  ['attSearch', 'filterStatus', 'filterDate'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
  applyFilters();
}

// ── Table ───────────────────────────────────────────────────────────────────
function badgeHtml(status) {
  const cls = {
    present: 'badge-present', absent: 'badge-absent',
    late: 'badge-late', half_day: 'badge-half_day'
  };
  const label = status === 'half_day' ? 'Half Day' : status.charAt(0).toUpperCase() + status.slice(1);
  return `<span class="badge ${cls[status] || ''}">${label}</span>`;
}

function renderTable() {
  const tbody = document.getElementById('attBody');
  if (!tbody) return;
  const start = (currentPage - 1) * PAGE_SIZE;
  const page = filteredAtt.slice(start, start + PAGE_SIZE);

  if (!page.length) {
    tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;padding:2rem;color:#9ca3af;">No records found.</td></tr>';
    return;
  }

  tbody.innerHTML = page.map(a => `
    <tr>
      <td>
        <div style="font-weight:600;color:#111827;">${a.employee_name}</div>
        <div style="font-size:.75rem;color:#6b7280;">${a.employee_id} · ${a.id}</div>
      </td>
      <td>${a.date}</td>
      <td>${a.clock_in ?? '<span style="color:#9ca3af;">—</span>'}</td>
      <td>${a.clock_out ?? '<span style="color:#9ca3af;">—</span>'}</td>
      <td>${badgeHtml(a.status)}</td>
      <td>${a.work_hours > 0 ? a.work_hours + ' h' : '<span style="color:#9ca3af;">—</span>'}</td>
      <td>
        <div class="actions">
          <button class="btn-icon" title="View" onclick="openAttDrawer('${a.id}')"><i class="fa-solid fa-eye"></i></button>
          <button class="btn-icon" title="Edit" onclick="openEditModal('${a.id}')"><i class="fa-solid fa-pen"></i></button>
          <button class="btn-icon btn-icon-danger" title="Delete" onclick="openDeleteModal('${a.id}')"><i class="fa-solid fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');
}

// ── Pagination ──────────────────────────────────────────────────────────────
function renderPagination() {
  const infoEl = document.getElementById('paginationInfo');
  const btnsEl = document.getElementById('paginationBtns');
  const total = filteredAtt.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const start = Math.min((currentPage - 1) * PAGE_SIZE + 1, total);
  const end = Math.min(currentPage * PAGE_SIZE, total);

  if (infoEl) infoEl.textContent = `Showing ${start}–${end} of ${total} records`;

  if (!btnsEl) return;
  let html = `<button class="btn-icon" ${currentPage <= 1 ? 'disabled' : ''} onclick="goPage(${currentPage - 1})"><i class="fa-solid fa-chevron-left"></i></button>`;
  for (let p = 1; p <= totalPages; p++) {
    if (totalPages > 7 && p > 2 && p < totalPages - 1 && Math.abs(p - currentPage) > 1) {
      if (p === 3 || p === totalPages - 2) html += '<button class="btn-icon" disabled>…</button>';
      continue;
    }
    html += `<button class="${p === currentPage ? 'page-active' : ''}" onclick="goPage(${p})">${p}</button>`;
  }
  html += `<button class="btn-icon" ${currentPage >= totalPages ? 'disabled' : ''} onclick="goPage(${currentPage + 1})"><i class="fa-solid fa-chevron-right"></i></button>`;
  btnsEl.innerHTML = html;
}

function goPage(p) {
  const totalPages = Math.ceil(filteredAtt.length / PAGE_SIZE);
  if (p < 1 || p > totalPages) return;
  currentPage = p;
  renderTable();
  renderPagination();
}

// ── Export ──────────────────────────────────────────────────────────────────
function openExportModal() {
  document.getElementById('exportModal')?.classList.add('open');
}
function closeExportModal() {
  document.getElementById('exportModal')?.classList.remove('open');
}
function doExport() {
  const fmt = document.querySelector('input[name="exportFmt"]:checked')?.value || 'csv';
  const data = filteredAtt.length ? filteredAtt : allAtt;
  let content, mime, ext;
  if (fmt === 'json') {
    content = JSON.stringify({ attendance: data }, null, 2);
    mime = 'application/json'; ext = 'json';
  } else {
    const header = 'ID,Employee,Employee ID,Date,Clock In,Clock Out,Status,Work Hours,Notes';
    const rows = data.map(a =>
      [a.id, `"${a.employee_name}"`, a.employee_id, a.date, a.clock_in ?? '', a.clock_out ?? '', a.status, a.work_hours, `"${a.notes}"`].join(',')
    );
    content = [header, ...rows].join('\n');
    mime = 'text/csv'; ext = 'csv';
  }
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = Object.assign(document.createElement('a'), { href: url, download: `attendance_export.${ext}` });
  a.click(); URL.revokeObjectURL(url);
  closeExportModal();
}

// ── Add / Edit Modal ─────────────────────────────────────────────────────────
function openAddModal() {
  editingId = null;
  document.getElementById('attModalTitle').textContent = 'Add Attendance Record';
  document.getElementById('attModalSaveBtn').textContent = 'Save Record';
  document.getElementById('attForm').reset();
  document.getElementById('fDate').value = new Date().toISOString().slice(0, 10);
  document.getElementById('attModal').classList.add('open');
}

function openEditModal(id) {
  const rec = allAtt.find(a => a.id === id);
  if (!rec) return;
  editingId = id;
  document.getElementById('attModalTitle').textContent = 'Edit Attendance Record';
  document.getElementById('attModalSaveBtn').textContent = 'Update Record';
  document.getElementById('fEmpName').value = rec.employee_name;
  document.getElementById('fEmpId').value = rec.employee_id;
  document.getElementById('fDate').value = rec.date;
  document.getElementById('fClockIn').value = rec.clock_in ?? '';
  document.getElementById('fClockOut').value = rec.clock_out ?? '';
  document.getElementById('fStatus').value = rec.status;
  document.getElementById('fNotes').value = rec.notes ?? '';
  document.getElementById('attModal').classList.add('open');
}

function closeAttModal() {
  document.getElementById('attModal')?.classList.remove('open');
  editingId = null;
}

function saveAttendance(e) {
  e.preventDefault();
  const empName = document.getElementById('fEmpName').value.trim();
  const empId = document.getElementById('fEmpId').value.trim();
  const date = document.getElementById('fDate').value;
  const clockIn = document.getElementById('fClockIn').value || null;
  const clockOut = document.getElementById('fClockOut').value || null;
  const status = document.getElementById('fStatus').value;
  const notes = document.getElementById('fNotes').value.trim();

  if (!empName || !empId || !date || !status) {
    showToast('Please fill all required fields.', 'error'); return;
  }

  let workHours = 0;
  if (clockIn && clockOut) {
    const [ih, im] = clockIn.split(':').map(Number);
    const [oh, om] = clockOut.split(':').map(Number);
    workHours = Math.round(((oh + om / 60) - (ih + im / 60)) * 100) / 100;
  }

  if (editingId) {
    const idx = allAtt.findIndex(a => a.id === editingId);
    if (idx > -1) allAtt[idx] = { ...allAtt[idx], employee_name: empName, employee_id: empId, date, clock_in: clockIn, clock_out: clockOut, status, notes, work_hours: workHours };
    showToast('Record updated.', 'success');
  } else {
    const newId = 'ATT-' + String(allAtt.length + 1).padStart(4, '0');
    allAtt.push({ id: newId, employee_name: empName, employee_id: empId, date, clock_in: clockIn, clock_out: clockOut, status, notes, work_hours: workHours });
    showToast('Record added.', 'success');
  }
  saveLocal();
  closeAttModal();
  applyFilters();
}

// ── Drawer ───────────────────────────────────────────────────────────────────
function openAttDrawer(id) {
  const rec = allAtt.find(a => a.id === id);
  if (!rec) return;

  const initials = rec.employee_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const label = rec.status === 'half_day' ? 'Half Day' : rec.status.charAt(0).toUpperCase() + rec.status.slice(1);
  const badgeCls = { present: 'badge-present', absent: 'badge-absent', late: 'badge-late', half_day: 'badge-half_day' };

  document.getElementById('attDrawerHeader').innerHTML = `
    <div class="drawer-profile">
      <div class="drawer-avatar">${initials}</div>
      <div>
        <div class="drawer-title">${rec.employee_name}</div>
        <div class="drawer-rec-id">${rec.employee_id} &middot; ${rec.id}</div>
      </div>
      <span class="badge ${badgeCls[rec.status] || ''}" style="margin-left:auto;">${label}</span>
      <button class="drawer-close" onclick="closeAttDrawer()"><i class="fa-solid fa-xmark"></i></button>
    </div>
    <div class="drawer-tabs">
      <button class="dtab active" onclick="switchAttTab(this,'paneDetails')">Details</button>
      <button class="dtab" onclick="switchAttTab(this,'paneHours')">Hours</button>
      <button class="dtab" onclick="switchAttTab(this,'paneNotes')">Notes</button>
    </div>
  `;

  document.getElementById('attDrawerBody').innerHTML = `
    <div id="paneDetails" class="dtab-pane active">
      <div class="drawer-section">
        <div class="drawer-section-title">Attendance Info</div>
        <div class="drawer-field"><span class="df-label">Record ID</span><span class="df-val">${rec.id}</span></div>
        <div class="drawer-field"><span class="df-label">Employee</span><span class="df-val">${rec.employee_name}</span></div>
        <div class="drawer-field"><span class="df-label">Employee ID</span><span class="df-val">${rec.employee_id}</span></div>
        <div class="drawer-field"><span class="df-label">Date</span><span class="df-val">${rec.date}</span></div>
        <div class="drawer-field"><span class="df-label">Status</span><span class="df-val"><span class="badge ${badgeCls[rec.status] || ''}">${label}</span></span></div>
      </div>
    </div>
    <div id="paneHours" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title">Time Details</div>
        <div class="drawer-field"><span class="df-label">Clock In</span><span class="df-val">${rec.clock_in ?? '—'}</span></div>
        <div class="drawer-field"><span class="df-label">Clock Out</span><span class="df-val">${rec.clock_out ?? '—'}</span></div>
        <div class="drawer-field"><span class="df-label">Work Hours</span><span class="df-val">${rec.work_hours > 0 ? rec.work_hours + ' h' : '—'}</span></div>
      </div>
    </div>
    <div id="paneNotes" class="dtab-pane">
      <div class="drawer-section">
        <div class="drawer-section-title">Notes</div>
        <p style="font-size:.875rem;color:#374151;">${rec.notes || '<span style="color:#9ca3af;">No notes.</span>'}</p>
      </div>
    </div>
  `;

  document.getElementById('attDrawerFooter').innerHTML = `
    <button class="btn btn-ghost btn-sm" onclick="closeAttDrawer()"><i class="fa-solid fa-xmark"></i> Close</button>
    <button class="btn btn-primary btn-sm" onclick="openEditModal('${rec.id}'); closeAttDrawer()"><i class="fa-solid fa-pen"></i> Edit</button>
    <button class="btn btn-sm" style="background:#fee2e2;color:#dc2626;border:1px solid #fca5a5;" onclick="closeAttDrawer(); openDeleteModal('${rec.id}')"><i class="fa-solid fa-trash"></i></button>
  `;

  document.getElementById('drawerOverlay')?.classList.add('open');
  document.getElementById('attDrawer')?.classList.add('open');
}

function closeAttDrawer() {
  document.getElementById('drawerOverlay')?.classList.remove('open');
  document.getElementById('attDrawer')?.classList.remove('open');
}

function switchAttTab(btn, tabId) {
  btn.closest('.vd-header, .att-drawer').querySelectorAll('.dtab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.dtab-pane').forEach(p => p.classList.remove('active'));
  document.getElementById(tabId)?.classList.add('active');
}

// ── Delete ───────────────────────────────────────────────────────────────────
function openDeleteModal(id) {
  const rec = allAtt.find(a => a.id === id);
  if (!rec) return;
  deletingId = id;
  document.getElementById('deleteAttRef').textContent = `${rec.id} — ${rec.employee_name} (${rec.date})`;
  document.getElementById('deleteAttModal').classList.add('open');
}
function closeDeleteModal() {
  document.getElementById('deleteAttModal')?.classList.remove('open');
  deletingId = null;
}
function confirmDeleteAtt() {
  if (!deletingId) return;
  allAtt = allAtt.filter(a => a.id !== deletingId);
  saveLocal();
  closeDeleteModal();
  applyFilters();
  showToast('Record deleted.', 'success');
}

// ── Toast fallback ────────────────────────────────────────────────────────────
function showToast(msg, type = 'info') {
  if (typeof window.showToast === 'function' && window.showToast !== showToast) {
    window.showToast(msg, type); return;
  }
  const c = document.getElementById('toastContainer');
  if (!c) { alert(msg); return; }
  const t = document.createElement('div');
  t.className = `toast toast-${type}`;
  t.style.cssText = 'padding:.75rem 1rem;border-radius:8px;margin-bottom:.5rem;background:#111827;color:#fff;font-size:.875rem;box-shadow:0 4px 12px rgba(0,0,0,.2);';
  t.textContent = msg;
  c.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

// ── Init ─────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadAttendance();

  document.getElementById('btnExport')?.addEventListener('click', openExportModal);
  document.getElementById('btnAddAtt')?.addEventListener('click', openAddModal);
  document.getElementById('attSearch')?.addEventListener('input', applyFilters);
  document.getElementById('filterStatus')?.addEventListener('change', applyFilters);
  document.getElementById('filterDate')?.addEventListener('change', applyFilters);
  document.getElementById('attForm')?.addEventListener('submit', saveAttendance);

  // backdrop close
  document.getElementById('exportModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('exportModal')) closeExportModal();
  });
  document.getElementById('attModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('attModal')) closeAttModal();
  });
  document.getElementById('deleteAttModal')?.addEventListener('click', e => {
    if (e.target === document.getElementById('deleteAttModal')) closeDeleteModal();
  });
  document.getElementById('drawerOverlay')?.addEventListener('click', closeAttDrawer);
});
