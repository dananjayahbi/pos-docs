/**
 * LankaCommerce Cloud — Core Utilities
 * All shared formatting, helpers, data loading functions
 */

// ── Currency Formatting ──
function formatLKR(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return '₨ 0.00';
  return '₨ ' + Number(amount).toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

function formatLKRShort(amount) {
  if (!amount) return '₨ 0';
  if (amount >= 1000000) return '₨ ' + (amount / 1000000).toFixed(1) + 'M';
  if (amount >= 1000) return '₨ ' + (amount / 1000).toFixed(1) + 'k';
  return '₨ ' + Math.round(amount).toLocaleString('en-LK');
}

// ── Date Formatting ──
function formatDate(dateStr, format = 'default') {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  const options = {
    default:    { year: 'numeric', month: 'short',  day: 'numeric' },
    short:      { year: 'numeric', month: 'short',  day: 'numeric' },
    long:       { year: 'numeric', month: 'long',   day: 'numeric', weekday: 'short' },
    datetime:   { year: 'numeric', month: 'short',  day: 'numeric', hour: '2-digit', minute: '2-digit' },
    time:       { hour: '2-digit', minute: '2-digit' },
  };
  return d.toLocaleDateString('en-LK', options[format] || options.default);
}

function timeAgo(dateStr) {
  if (!dateStr) return '';
  const now = new Date();
  const past = new Date(dateStr);
  const diff = Math.floor((now - past) / 1000);
  if (diff < 60) return diff + ' sec ago';
  if (diff < 3600) return Math.floor(diff / 60) + ' min ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hr ago';
  return Math.floor(diff / 86400) + ' days ago';
}

// ── Status Badge ──
const STATUS_CONFIG = {
  // Product
  active:    { label: 'Active',    cls: 'badge-success' },
  draft:     { label: 'Draft',     cls: 'badge-neutral' },
  archived:  { label: 'Archived',  cls: 'badge-neutral' },
  // Order
  pending:   { label: 'Pending',   cls: 'badge-warning' },
  confirmed: { label: 'Confirmed', cls: 'badge-info' },
  processing:{ label: 'Processing',cls: 'badge-info' },
  shipped:   { label: 'Shipped',   cls: 'badge-brand' },
  delivered: { label: 'Delivered', cls: 'badge-success' },
  completed: { label: 'Completed', cls: 'badge-success' },
  returned:  { label: 'Returned',  cls: 'badge-warning' },
  cancelled: { label: 'Cancelled', cls: 'badge-error' },
  // Invoice / Bill
  issued:          { label: 'Issued',          cls: 'badge-info' },
  partially_paid:  { label: 'Partial',         cls: 'badge-warning' },
  paid:            { label: 'Paid',            cls: 'badge-success' },
  overdue:         { label: 'Overdue',         cls: 'badge-error' },
  void:            { label: 'Void',            cls: 'badge-neutral' },
  // PO
  sent:            { label: 'Sent',            cls: 'badge-info' },
  acknowledged:    { label: 'Acknowledged',    cls: 'badge-brand' },
  partially_received: { label: 'Partial',      cls: 'badge-warning' },
  fully_received:  { label: 'Received',        cls: 'badge-success' },
  billed:          { label: 'Billed',          cls: 'badge-success' },
  // Stock
  in_stock:         { label: 'In Stock',       cls: 'badge-success' },
  low_stock:        { label: 'Low Stock',      cls: 'badge-warning' },
  out_of_stock:     { label: 'Out of Stock',   cls: 'badge-error' },
  // HR
  approved:  { label: 'Approved',  cls: 'badge-success' },
  rejected:  { label: 'Rejected',  cls: 'badge-error' },
  // Leave
  open:      { label: 'Open',      cls: 'badge-success' },
  closed:    { label: 'Closed',    cls: 'badge-neutral' },
  // General
  enabled:   { label: 'Enabled',   cls: 'badge-success' },
  disabled:  { label: 'Disabled',  cls: 'badge-neutral' },
};

function statusBadge(status) {
  const cfg = STATUS_CONFIG[status] || { label: status, cls: 'badge-neutral' };
  return `<span class="badge ${cfg.cls}"><span class="badge-dot"></span>${cfg.label}</span>`;
}

// ── Stock Indicator ──
function stockIndicator(qty, threshold) {
  if (qty === 0) return `<span class="badge badge-error"><span class="badge-dot"></span>Out of Stock</span>`;
  if (qty <= threshold) return `<span class="badge badge-warning"><span class="badge-dot"></span>${qty} (Low)</span>`;
  return `<span style="color:var(--color-success-600);font-size:var(--text-sm);font-weight:500">${qty.toLocaleString()}</span>`;
}

// ── Phone Format ──
function formatPhone(phone) {
  if (!phone) return '—';
  const digits = phone.replace(/\D/g, '');
  if (digits.startsWith('94') && digits.length === 11) {
    return '+94 ' + digits.slice(2, 4) + ' ' + digits.slice(4, 7) + ' ' + digits.slice(7);
  }
  return phone;
}

// ── Truncate Text ──
function truncate(str, n = 40) {
  if (!str) return '—';
  return str.length > n ? str.slice(0, n) + '…' : str;
}

// ── Generate ID ──
function generateId(prefix = '') {
  return prefix + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 6).toUpperCase();
}

// ── Deep Clone ──
function deepClone(obj) { return JSON.parse(JSON.stringify(obj)); }

// ── Debounce ──
function debounce(fn, ms = 300) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

// ── QueryString helpers ──
function getParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

// ── Data Loading (async JSON fetch with cache) ──
const dataCache = {};

async function loadData(path) {
  if (dataCache[path]) return dataCache[path];
  try {
    const base = getBasePath();
    const res = await fetch(base + path);
    if (!res.ok) throw new Error('Network error: ' + res.status);
    const data = await res.json();
    dataCache[path] = data;
    return data;
  } catch (e) {
    console.error('loadData error:', path, e);
    return null;
  }
}

function getBasePath() {
  // Compute relative path to root depending on nesting level
  const parts = window.location.pathname.split('/');
  let depth = parts.length - 1;
  // If running via file:// protocol, find depths from UI-Prototype
  const idx = parts.indexOf('UI-Prototype');
  if (idx !== -1) depth = parts.length - idx - 2;
  if (depth <= 0) return './';
  return '../'.repeat(depth);
}

// ── LocalStorage CRUD helpers ──
function lsGet(key, fallback = null) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
  catch { return fallback; }
}

function lsSet(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); return true; }
  catch { return false; }
}

function lsRemove(key) { localStorage.removeItem(key); }

// ── Table Sort ──
function sortTable(data, key, dir = 'asc') {
  return [...data].sort((a, b) => {
    const av = a[key] ?? '', bv = b[key] ?? '';
    if (typeof av === 'number') return dir === 'asc' ? av - bv : bv - av;
    return dir === 'asc' ? String(av).localeCompare(String(bv)) : String(bv).localeCompare(String(av));
  });
}

// ── Filter helper ──
function filterData(data, query, fields) {
  if (!query || !query.trim()) return data;
  const q = query.toLowerCase();
  return data.filter(item => fields.some(f => {
    const val = String(item[f] ?? '').toLowerCase();
    return val.includes(q);
  }));
}

// ── Avatar initials ──
function avatarInitials(name) {
  if (!name) return 'U';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0].slice(0, 2).toUpperCase();
}

// ── Export these globally ──
window.LCC = {
  formatLKR, formatLKRShort, formatDate, timeAgo,
  statusBadge, stockIndicator, formatPhone, truncate,
  generateId, deepClone, debounce, getParam,
  loadData, getBasePath, lsGet, lsSet, lsRemove,
  sortTable, filterData, avatarInitials
};
