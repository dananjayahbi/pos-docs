# LCC — UI Prototype Plan

## Overview
Build a high-fidelity static HTML/CSS/JS UI prototype for LankaCommerce Cloud (LCC).
This prototype simulates the FULL look and feel of all major screens.
NO backend needed — all data is static mock data in JS.
Tech: Vanilla HTML5, CSS3 (CSS variables for theme), JavaScript ES6+.

## File Structure for UI-Prototype/
```
UI-Prototype/
├── index.html                        → Entry/navigation page (prototype home)
├── assets/
│   ├── css/
│   │   ├── main.css                  → Design system (tokens, reset, typography)
│   │   ├── sidebar.css               → Sidebar + header layout
│   │   ├── dashboard.css             → Dashboard-specific styles
│   │   ├── pos.css                   → POS terminal styles
│   │   └── webstore.css              → Storefront styles
│   ├── js/
│   │   ├── main.js                   → Shared utilities (sidebar toggle, modals)
│   │   ├── mock-data.js              → All mock data for LKR amounts, products etc
│   │   ├── pos.js                    → POS terminal interactions
│   │   └── charts.js                 → Simple SVG charts for dashboard
│   └── img/
│       └── (placeholder images)
│
├── auth/
│   ├── login.html
│   └── register.html
│
├── erp/
│   ├── dashboard.html                → ERP home with KPI cards + charts
│   ├── products/
│   │   ├── list.html                 → Products DataTable
│   │   ├── create.html               → Product form (tabs)
│   │   └── detail.html               → Product view/edit
│   ├── inventory/
│   │   ├── overview.html             → Stock levels grid
│   │   ├── movements.html            → Stock movement log
│   │   └── adjustments.html          → Adjustment form
│   ├── sales/
│   │   ├── orders-list.html          → Orders table
│   │   ├── order-detail.html         → Order detail + timeline
│   │   ├── invoices-list.html        → Invoices table
│   │   ├── invoice-detail.html       → Invoice detail + payment
│   │   └── quotes-list.html          → Quotes table
│   ├── customers/
│   │   ├── list.html                 → Customer table
│   │   └── profile.html              → Customer 360 view
│   ├── vendors/
│   │   ├── list.html                 → Vendor list
│   │   └── purchase-orders.html      → PO list + create
│   ├── hr/
│   │   ├── employees.html            → Employee directory
│   │   ├── attendance.html           → Attendance dashboard/calendar
│   │   ├── leave.html                → Leave management
│   │   └── payroll.html              → Payroll run screen
│   ├── accounting/
│   │   ├── chart-of-accounts.html    → COA tree view
│   │   ├── journals.html             → Journal entries
│   │   └── reconciliation.html       → Bank reconciliation
│   ├── reports/
│   │   └── hub.html                  → Reports navigation hub
│   └── settings/
│       ├── general.html              → General settings
│       ├── integrations.html         → Integrations hub
│       └── webstore.html             → Webstore theme settings
│
├── pos/
│   └── terminal.html                 → Full-screen POS terminal
│
├── webstore/
│   ├── home.html                     → Webstore homepage
│   ├── catalog.html                  → Products catalog + filters
│   ├── product-detail.html           → Product detail page (PDP)
│   ├── cart.html                     → Shopping cart
│   ├── checkout.html                 → 5-step checkout
│   ├── order-confirmation.html       → Thank you page
│   ├── account-dashboard.html        → Customer portal
│   └── order-tracking.html           → Order tracking timeline
│
└── admin/
    └── platform.html                 → Super admin platform dashboard
```

## Build Priority Order
1. Design system (CSS variables, components) — `assets/css/main.css`
2. ERP Layout (sidebar + header) — shared component
3. ERP Dashboard Home — `erp/dashboard.html`
4. POS Terminal — `pos/terminal.html` (most critical)
5. Products List + Detail — `erp/products/`
6. Orders + Invoice Detail — `erp/sales/`
7. Customer Profile — `erp/customers/`
8. Webstore Homepage + Catalog + PDP — `webstore/`
9. Webstore Checkout Flow — `webstore/checkout.html`
10. HR, Accounting, Reports, Settings — remaining ERP pages
11. Super Admin Platform — `admin/`
12. Auth pages — `auth/`

## Key Prototype Requirements
- All amounts in LKR with ₨ symbol and comma formatting
- Phone numbers in +94 format
- Address always shows Province → District → City
- Status badges color-coded per status
- Sidebar collapsible (JS toggle)
- All modals functional (open/close with JS)
- POS: barcode search input functional (types product, simulates add to cart)
- POS: cart calculations work (subtotal, discount, tax, total)
- POS: payment modal with numpad (cash change calculator)
- Webstore: filter sidebar functional (checkbox toggles)
- Checkout: step-by-step navigation works
- Responsive: desktop + mobile views

## Mock Data to Include
- 10 sample products (clothing: T-shirts, Trousers; Food: Rice, Sugar, Milk)
- 5 sample customers (Sri Lankan names, +94 phones, Colombo/Kandy/Galle addresses)
- 5 sample orders (various statuses)
- 3 sample invoices
- 3 sample employees
- Sample payroll run
- Sample chart of accounts (condensed)

## Sri Lanka Mock Data
- Store name: "Perera Boutique" (sample)
- Currency: LKR (₨)
- Sample prices: ₨250–₨15,000 range
- Sample customer: "Kamal Perera", +94 77 123 4567, Colombo 03, Western Province
- Sample employee: "Nimal Silva", EPF/ETF fields
- Sample invoice: SVAT compliant header

## Navigation Structure (Prototype Index)
The `index.html` will be a clickable prototype navigator showing all screens in a grid,
organized by section (ERP, POS, Webstore, Admin, Auth).
Each card links to the corresponding HTML file.
