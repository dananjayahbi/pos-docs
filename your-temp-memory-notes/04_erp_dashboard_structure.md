# LCC — ERP Dashboard Structure (Detailed)

## Layout Structure
```
┌────────────────────────────────────────────────────────┐
│ HEADER 64px                                            │
│ [≡] [Logo] [Global Search Cmd+K] [+New] [🔔] [👤 ▼]   │
├──────────────┬─────────────────────────────────────────┤
│ SIDEBAR 240px│  MAIN CONTENT AREA                      │
│              │  Breadcrumb                             │
│ [Nav Items]  │  Content                                │
│              │                                         │
└──────────────┴─────────────────────────────────────────┘
```

## Sidebar Navigation
| Menu Item | Icon | Route | Sub-Items |
|-----------|------|-------|-----------|
| Dashboard | Home | `/` | — |
| Products | Package | `/products` | List, Create New, Categories, Attributes |
| Inventory | Warehouse | `/inventory` | Stock Levels, Movements, Adjustments, Transfers, Warehouses |
| Sales | ShoppingCart | `/sales` | Orders, Invoices, Quotes, Payments |
| POS | Monitor | `/pos` | Launches full-screen POS |
| Customers | Users | `/customers` | Customer List, Customer Groups, Loyalty |
| Vendors | Truck | `/vendors` | Vendor List, Purchase Orders, Bills |
| HR | Users2 | `/hr` | Employees, Attendance, Leave, Payroll |
| Accounting | Calculator | `/accounting` | Chart of Accounts, Journals, Reconciliation |
| Reports | BarChart | `/reports` | Sales, Inventory, Financial, HR |
| Settings | Settings | `/settings` | General, Company, Users, Roles, Integrations, Billing, Webstore |

## Sidebar Behaviors
- Collapsible: 240px → 64px (icon-only + tooltip on hover)
- Smooth CSS transition
- Mobile (<1024px): hidden, opens as slide-out drawer overlay
- Active route highlighted with primary color accent
- Role-based: menu items filtered by user permissions
- Keyboard navigable (arrow keys)

## Header Components
| Component | Detail |
|-----------|--------|
| GlobalSearch | Cmd+K shortcut, command palette overlay |
| QuickActionsButton | `+ New` → quick create dropdown |
| NotificationBell | Badge count; dropdown with notification list |
| UserMenu | Avatar + dropdown: Profile, Theme Toggle, Logout |
| MobileMenuToggle | Hamburger visible on <1024px |

## Dashboard Home Page Layout
```
┌────────────────────────────────────────────────────────────┐
│ Welcome, [Name]!                                           │
├────────────┬────────────┬────────────┬─────────────────────┤
│ ₨ Today's  │ 📦 Orders  │ ⚠️Low Stock │ ✅ Pending Tasks   │
│ Revenue    │  12 Today  │  5 Items   │  3 Approvals       │
│ ₨45,000    │   +3 ▲     │  Badge     │                    │
│ +12% ▲     │            │            │                    │
├────────────┴────────────┴────────────┴─────────────────────┤
│ SALES CHART (Line/Bar — Last 7 days / Last 30 days toggle) │
├───────────────────────────────┬────────────────────────────┤
│  QUICK ACTIONS                │  RECENT ACTIVITY FEED      │
│  [+ Product] [+ Order]        │  John created order...     │
│  [Open POS]  [+ Invoice]      │  Stock low: Red T-Shirt    │
│  [+ Customer] [+ PO]          │  Invoice #INV-0042 paid    │
└───────────────────────────────┴────────────────────────────┘
```

## Product Create/Edit Form — Tab Structure
1. **Basic Info**: Name, Slug (auto), SKU, Barcode, Product Type (simple/variable/bundle/composite), Category, Brand, Status, Webstore visible toggle, POS visible toggle, Unit of Measure, Tax Class
2. **Variants** (if variable): Attribute selection → generate variant matrix → per-variant SKU/price/stock/barcode
3. **Bundle** (if bundle): Component product picker + quantity
4. **Recipe** (if composite): Ingredient list + quantity + unit
5. **Images**: Drag-and-drop upload, set primary, reorder, alt text
6. **Pricing**: Base price, Sale price, Cost price, Wholesale price; Tiered pricing table (qty break → price)
7. **Inventory**: Per-warehouse stock, low_stock_threshold, reorder_point, reorder_quantity
8. **SEO**: Title, description, meta keywords

## Order Detail Page Layout
```
┌────────────────────────────────────────────────┐
│ Order #ORD-2024-0042          [Edit] [Cancel]   │
│ Source: POS / Webstore / WhatsApp              │
│ Status: [PENDING] → [CONFIRMED] → [PROCESSING] │
│         → [SHIPPED] → [DELIVERED] ← timeline  │
├──────────────────────┬─────────────────────────┤
│ ITEMS                │ CUSTOMER                │
│ Product Name   qty   │ John Perera             │
│ Variant info   price │ +94 77 123 4567         │
│ Total          LKR   │ Colombo, Western        │
│                      │ [View Profile]          │
├──────────────────────┴─────────────────────────┤
│ PAYMENT STATUS                                 │
│ Total: ₨4,500 | Paid: ₨4,500 | Outstanding: ₨0│
│ [Generate Invoice] [Mark Paid] [Send WhatsApp] │
├────────────────────────────────────────────────┤
│ FULFILLMENT                                    │
│ [Generate Waybill] [Mark Shipped] [Track]      │
└────────────────────────────────────────────────┘
```

## Invoice Detail Page Layout
```
┌──────────────────────────────────────────────────────┐
│ INVOICE #INV-2024-0042    Status: [ISSUED/PAID/...]  │
│ Date: Jan 15, 2026  Due: Jan 30, 2026                │
│ [Edit] [Send PDF Email] [Send WhatsApp] [Download]   │
├──────────────────────────────────────────────────────┤
│ Bill To: Customer Name                               │
│ BRN: [xxx] VAT: [xxx]                               │
├──────────────────────────────────────────────────────┤
│ # | Description | Qty | Rate | Tax | Amount          │
│ 1 | Product A   |  2  |₨1000 | 0%  | ₨2,000         │
├──────────────────────────────────────────────────────┤
│ Subtotal: ₨5,000 | Discount: ₨500 | VAT: ₨324        │
│ TOTAL: ₨4,824                                        │
├──────────────────────────────────────────────────────┤
│ PAYMENTS                                             │
│ Jan 16 — Cash — ₨4,824 — [Reverse]                  │
│ Outstanding: ₨0                                      │
│ [Record Payment] [Issue Credit Note]                 │
└──────────────────────────────────────────────────────┘
```

## Customer 360 Profile Layout
```
┌──────────────────────────────────────────────────────┐
│ [Avatar] John Perera                                 │
│ Individual | +94 77 123 4567 | john@email.com        │
│ Customer since: Jan 2024                             │
├──────────────────────────────────────────────────────┤
│ 📊 Stats:                                            │
│ 12 Orders | ₨45,000 Total Spent | ₨3,750 Avg        │
│ Credit Limit: ₨50,000 | Used: ₨10,000 | Available: ₨40,000│
│ Loyalty Points: 450 | Tier: Gold                    │
├──────────────────────────────────────────────────────┤
│ TABS: Orders | Invoices | Payments | Addresses | Notes│
└──────────────────────────────────────────────────────┘
```

## Payroll Run Screen
```
┌──────────────────────────────────────────────────────┐
│ Payroll Run: January 2026              [Save Draft]  │
│ [Run Calculations] [Approve All] [Generate Payslips] │
├──────────────────────────────────────────────────────┤
│ Employee     | Basic  | Allowances | EPF | Net Pay   │
│ John Perera  |₨40,000 |  ₨5,000   |₨3,600|₨39,400  │
│ Mary Silva   |₨35,000 |  ₨3,000   |₨3,040|₨35,600  │
├──────────────────────────────────────────────────────┤
│ Summary:                                             │
│ Gross: ₨90,000 | EPF: ₨7,200 | ETF: ₨2,400 | Net: ₨83,400│
│ [Export Excel] [Generate EPF Return] [Email Payslips]│
└──────────────────────────────────────────────────────┘
```

## Chart of Accounts (Tree View)
```
├── 1000 Current Assets
│   ├── 1100 Cash & Bank
│   │   ├── 1110 Petty Cash
│   │   └── 1120 Bank Account
│   ├── 1200 Accounts Receivable
│   └── 1300 Inventory
├── 2000 Liabilities
│   ├── 2100 Accounts Payable
│   └── 2200 Customer Advances
├── 3000 Equity
├── 4000 Revenue
│   └── 4100 Sales Revenue
└── 5000 Expenses
    ├── 5100 Cost of Goods Sold
    └── 5200 Operating Expenses
```
