/**
 * test_settings_modals.js
 * Opens a VISIBLE (non-headless) browser and tests settings page modals.
 * Run: node test_settings_modals.js
 */
const puppeteer = require('puppeteer');

const BASE_URL = 'http://127.0.0.1:5500/UI-Prototype/erp/settings';

(async () => {
  console.log('Launching visible browser...');
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized', '--no-first-run']
  });

  const page = await browser.newPage();

  // Capture console messages from the page
  page.on('console', msg => console.log('[PAGE LOG]', msg.type(), msg.text()));
  page.on('pageerror', err => console.error('[PAGE ERROR]', err.message));

  // ── 1. General Settings ─────────────────────────────────────────
  console.log('\n== Testing index.html (General Settings) ==');
  await page.goto(BASE_URL + '/index.html', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.waitForTimeout(1500);

  const generalTitle = await page.title();
  console.log('Title:', generalTitle);

  const hasSaveBtn = await page.evaluate(() => {
    const btns = Array.from(document.querySelectorAll('button'));
    return btns.some(b => b.textContent.includes('Save'));
  });
  console.log('Has Save button:', hasSaveBtn);

  // ── 2. Users & Roles ────────────────────────────────────────────
  console.log('\n== Testing users.html (Users & Roles) ==');
  await page.goto(BASE_URL + '/users.html', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.waitForTimeout(1500);

  const hasOpenModal = await page.evaluate(() => typeof openModal === 'function');
  console.log('openModal() defined:', hasOpenModal);

  const hasShowToast = await page.evaluate(() => typeof showToast === 'function');
  console.log('showToast() defined:', hasShowToast);

  // Check modal exists in DOM
  const inviteModalExists = await page.evaluate(() => {
    return document.getElementById('inviteModal') !== null;
  });
  console.log('inviteModal in DOM:', inviteModalExists);

  // Click Invite Member button
  console.log('Clicking Invite Member button...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick*="inviteModal"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(800);

  const inviteOpen = await page.evaluate(() => {
    const m = document.getElementById('inviteModal');
    if (!m) return 'MODAL NOT FOUND';
    const display = window.getComputedStyle(m).display;
    const hasOpenClass = m.classList.contains('open');
    return { hasOpenClass, display };
  });
  console.log('After clicking Invite:', JSON.stringify(inviteOpen));

  // If class was added but display is still none, it's a CSS issue
  // If class was not added, it's a JS issue
  if (inviteOpen && inviteOpen.hasOpenClass && inviteOpen.display !== 'flex') {
    console.log('BUG: .open class added but CSS display is not flex! CSS conflict likely.');
  } else if (inviteOpen && inviteOpen.hasOpenClass) {
    console.log('OK: Modal is visible.');
    await page.waitForTimeout(1000);
    // Close modal
    await page.evaluate(() => {
      const btn = document.querySelector('#inviteModal .modal-close');
      if (btn) btn.click();
    });
    console.log('Modal closed.');
  } else {
    console.log('BUG: openModal() did not add .open class. JS problem.');
    // Check if openModal function body
    const fnText = await page.evaluate(() => {
      return typeof openModal === 'function' ? openModal.toString() : 'NOT DEFINED';
    });
    console.log('openModal source:', fnText.substring(0, 200));
  }

  await page.waitForTimeout(500);

  // Click Edit button for first user
  console.log('Clicking Edit button for Kamal Perera...');
  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick*="editMember"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(800);
  const editOpen = await page.evaluate(() => {
    const m = document.getElementById('editMemberModal');
    if (!m) return false;
    return m.classList.contains('open');
  });
  console.log('Edit modal opened:', editOpen);

  // ── 3. Billing ──────────────────────────────────────────────────
  console.log('\n== Testing billing.html ==');
  await page.goto(BASE_URL + '/billing.html', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.waitForTimeout(1500);

  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick*="upgradeModal"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(800);
  const upgradeOpen = await page.evaluate(() => {
    const m = document.getElementById('upgradeModal');
    return m ? m.classList.contains('open') : false;
  });
  console.log('Upgrade modal opened:', upgradeOpen);

  // ── 4. Integrations ─────────────────────────────────────────────
  console.log('\n== Testing integrations.html ==');
  await page.goto(BASE_URL + '/integrations.html', { waitUntil: 'networkidle2', timeout: 20000 });
  await page.waitForTimeout(1500);

  await page.evaluate(() => {
    const btn = document.querySelector('button[onclick*="openConnectModal"]');
    if (btn) btn.click();
  });
  await page.waitForTimeout(800);
  const connectOpen = await page.evaluate(() => {
    const m = document.getElementById('connectModal');
    return m ? m.classList.contains('open') : false;
  });
  console.log('Connect modal opened:', connectOpen);

  console.log('\n============================');
  console.log('All tests done. Browser stays open for manual inspection.');
  console.log('Navigate via the Settings sub-nav to verify each page.');
  console.log('============================\n');

  // Keep browser open for user inspection
  // browser.close()  <- intentionally commented out
})().catch(err => {
  console.error('Test error:', err.message);
  process.exit(1);
});
