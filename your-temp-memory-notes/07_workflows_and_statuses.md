# LCC — Workflows and Status Reference

## All Entity Statuses

| Entity | Status Values |
|--------|--------------|
| Product | `draft`, `active`, `archived` |
| Quote | `draft` → `sent` → `accepted`/`rejected`/`expired` → `converted` |
| Order | `pending` → `confirmed` → `processing` → `shipped` → `delivered` → `completed`/`returned`/`cancelled` |
| Invoice | `draft` → `issued` → `partially_paid` → `paid`/`overdue`/`void` |
| Payment | `recorded`, `reversed` |
| Purchase Order | `draft` → `sent` → `acknowledged` → `partially_received` → `fully_received` → `billed`/`cancelled` |
| Vendor Bill | `pending` → `partially_paid` → `paid`/`overdue` |
| Leave Request | `pending` → `approved`/`rejected` |
| Employee | `active`, `inactive`, `terminated` |
| Payroll Run | `draft` → `processing` → `approved` → `paid`/`reversed` |
| Journal Entry | `draft` → `posted`/`reversed` |
| POS Shift | `open`, `closed` |
| Bank Reconciliation | `in_progress`, `completed` |
| Attendance | `present`, `absent`, `late`, `half-day` |
| Stock Movement | `stock_in`, `stock_out`, `transfer`, `adjustment`, `stock_take`, `damage`, `write_off` |
| WebstoreOrder | Tracking: `placed`, `confirmed`, `shipped`, `out_for_delivery`, `delivered` |
| Payment Link | `active`, `used`, `expired` |
| Custom Domain | `pending_verification`, `active`, `failed` |

---

## Major User Workflows

### 1. Tenant Onboarding
1. Super Admin creates Tenant → schema auto-provisioned → seed data loaded
2. Welcome email sent to Tenant Admin
3. Admin logs in → Store Setup wizard: name, logo, theme, payment gateways, shipping zones
4. Admin invites Staff users with role assignment

### 2. POS Sale (Standard)
1. Cashier opens POS session (Enter opening cash)
2. Scan barcode / search by name / browse categories
3. Add items → adjust qty → apply per-item discount if needed
4. Assign customer (Walk-in or search existing)
5. Apply cart-level discount or coupon code
6. Choose payment: Cash / Card / Bank Transfer / Split
7. Complete → Receipt (print 80mm / Email / WhatsApp)
8. Inventory auto-decremented; invoice auto-generated; journal entry auto-posted
9. End of day: Close session → enter closing cash → Z-report generated

### 3. POS Offline Mode
1. Browser detects no internet → switch to offline mode
2. Product catalog + customer data loaded from IndexedDB (pre-cached)
3. Sales queued in IndexedDB pending queue
4. Internet restored → Service Worker uploads pending sales
5. Conflicts resolved (first-to-sync wins OR flagged for Admin review)
6. Inventory updated; local queue cleared

### 4. Social Selling (WhatsApp Order)
1. Customer messages on WhatsApp
2. Staff creates Draft Order in ERP → selects/creates customer → adds products
3. Payment Link generated (e.g. `pay.mystore.lk/order/abc123`)
4. Staff sends link via WhatsApp
5. Customer pays online → order auto-confirmed → inventory deducted → invoice generated → fulfillment triggered

### 5. Quote → Invoice Flow
1. Create Quote → select customer → add products → set validity → send PDF
2. Customer accepts → Convert Quote to Order
3. Confirm Order → fulfillment flow starts
4. Generate Invoice → record partial/full payments
5. Invoice marked paid

### 6. Purchase Order Workflow
1. Low stock alert → Create PO → select vendor → add items → expected delivery date
2. Send PO (email/PDF) → vendor acknowledges
3. Goods arrive → GRN (Goods Receipt Note): mark received qty per line
4. Status: partially_received or fully_received
5. Record Vendor Bill → set due date
6. Pay bill → vendor payment recorded → accounts payable updated

### 7. Webstore Checkout (5 Steps)
1. Cart Review (items, qtys, coupon)
2. Customer Info (guest or login; name, phone, email)
3. Shipping (Province/District/City; shipping method + rate)
4. Payment (PayHere / WebXPay / KOKO BNPL / Bank Transfer Upload / COD)
5. Confirm → Order number shown → WhatsApp notification sent

### 8. Inventory Replenishment
1. Stock drops below threshold → dashboard alert + email (+ optional WhatsApp)
2. Staff creates PO or uses one-click "Create PO" from alert
3. Goods received → stock level updated
4. Webstore availability auto-synced

### 9. Payroll Processing
1. Setup Salary Structures per employee/designation
2. Run attendance + leave integration for period
3. Open Payroll Run → system auto-calculates: Gross = Basic + Allowances + OT + Commission
4. Deductions: EPF (8% employee), advance, loan, no-pay deductions
5. Net = Gross − deductions
6. Preview per employee → approve
7. Generate payslips (PDF bulk email)
8. Post journal entries (auto)
9. Generate EPF/ETF returns report

### 10. ERP ↔ Webstore Sync Events
| Event | Auto Actions |
|-------|-------------|
| Product created in ERP | Synced to webstore; indexed for search |
| Stock changed | Webstore availability updated; low-stock alert if threshold |
| Price updated | Webstore display updated; promotions recalculated |
| Webstore order placed | ERP invoice created; inventory deducted; courier booking; WhatsApp notification |
| Payment received | Order confirmed; courier booking triggered |
| Order shipped | Tracking number updated; customer notified via WhatsApp |

### 11. Custom Domain Setup
1. Tenant enters custom domain in Settings
2. System provides DNS instructions: CNAME: → `shops.lankacommerce.lk`, TXT verification token
3. Tenant configures DNS at registrar
4. Background job polls DNS, verifies TXT record
5. Domain activated; SSL certificate auto-provisioned (Let's Encrypt)
6. Status indicator: pending_verification → active

### 12. Return/Refund Workflow
1. Customer requests return
2. Staff creates return order (select items, qty, reason)
3. Items received (for physical return)
4. Refund method: Original payment method / Store credit
5. Credit note issued; invoice updated
6. Inventory restocked (if applicable)

---

## Color Coding for Status Badges (UI)
| Status | Badge Color |
|--------|------------|
| draft | gray |
| active / confirmed / paid / approved | green |
| pending / issued / processing | blue |
| sent / shipped / out_for_delivery | cyan/light-blue |
| partially_paid / partially_received | yellow/amber |
| overdue / late | orange |
| cancelled / void / rejected | red |
| archived / closed / terminated | dark gray |
