# LCC — MASTER REFERENCE INDEX

## Notes Files Summary
| File | Contents |
|------|----------|
| 01_project_overview.md | Project description, tech stack, multitenant arch, phases, LK specifics |
| 02_modules_and_entities.md | All modules by plan tier + complete database entity reference |
| 03_ui_pages_and_screens.md | All routes and pages for ERP, POS, Webstore, Super Admin |
| 04_erp_dashboard_structure.md | ERP layout, sidebar nav, dashboard, key page layouts |
| 05_pos_terminal.md | Full POS screen spec, modals, keyboard shortcuts, offline |
| 06_webstore_structure.md | Webstore layout, PDP, catalog, checkout flow, customer portal |
| 07_workflows_and_statuses.md | All entity statuses + all major user workflows |
| 08_component_library.md | Design tokens, components, responsive, icons |
| 09_roles_and_permissions.md | Role hierarchy, permission matrix, plan gating |
| 10_integrations_and_ai.md | Payments, couriers, WhatsApp, SMS, AI features |
| 11_ui_prototype_plan.md | Full file structure + build priority for the HTML prototype |

## Quick Reference — Critical UI Facts

### Design Tokens
- Primary: `#2563eb` | Success: `#22c55e` | Error: `#ef4444` | Warning: `#f59e0b`
- Sidebar: 240px expanded, 64px collapsed | Header: 64px
- Currency: ₨ (LKR) | Phone: +94 XX XXX XXXX

### Application Sections
1. **Auth** — Login, Register, Reset Password
2. **ERP Dashboard** — sidebar + header layout (Next.js (dashboard) route group)  
3. **POS Terminal** — full-screen, no sidebar (Next.js (pos) route group)
4. **Webstore** — customer-facing SSR (Next.js (storefront) route group)
5. **Super Admin** — platform management

### ERP Sidebar Menu (in order)
Dashboard → Products → Inventory → Sales → POS → Customers → Vendors → HR → Accounting → Reports → Settings

### POS Layout
Left 60%: ProductPanel (search + category tabs + product grid)
Right 40%: CartPanel (customer select + items + totals + pay button)

### Webstore Checkout Steps
1. Account (guest/login/register)
2. Shipping Address (Province → District → City)
3. Shipping Method (Standard/Express/Pickup)
4. Payment (PayHere/WebXPay/KOKO/Bank Transfer/COD)
5. Review + Confirm

### Status Badge Colors
green: active/paid/approved | blue: pending/confirmed | amber: partial/late
red: cancelled/overdue/rejected | gray: draft/archived | cyan: shipped

### Key Modules (36 total)
Products (7) | Inventory (4) | POS | Sales (5) | CRM (4) | Vendors (4)
HR (6) | Accounting (3) | Reports (5) | Webstore (8) | Integrations (12) | AI (4)

## Prototype Build Status
- [ ] Design system CSS
- [ ] ERP Layout template
- [ ] ERP Dashboard
- [ ] POS Terminal
- [ ] Products module
- [ ] Sales/Orders module
- [ ] Customer module
- [ ] Vendors/PO module
- [ ] HR module
- [ ] Accounting module
- [ ] Reports hub
- [ ] Settings pages
- [ ] Webstore homepage
- [ ] Webstore catalog + PDP
- [ ] Webstore checkout
- [ ] Customer portal
- [ ] Super admin platform
- [ ] Auth pages
