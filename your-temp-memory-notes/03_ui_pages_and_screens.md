# LCC — All UI Pages and Screens Reference

## AUTH Pages `(auth)/`
| Route | Page | Key Elements |
|-------|------|-------------|
| `/login` | Tenant Login | Email/password, Remember Me, Forgot Password link, Brand logo |
| `/register` | New Tenant Registration | Business name, email, phone, password |
| `/forgot-password` | Password Reset Request | Email field |
| `/reset-password` | Reset Password | New password + confirm |
| `/verify-email` | Email Verification | OTP / link confirmation |

---

## ERP DASHBOARD Pages `(dashboard)/`

### Main Structure
- Sidebar (240px expanded, 64px collapsed) + Header (64px) + Main Content

### Dashboard Home `/`
- KPI Cards: Today's Revenue, Today's Orders, Low Stock Alerts, Pending Tasks/Approvals
- Revenue chart (line/bar, last 7/30 days)
- Quick Actions grid: [+Product] [+Order] [Open POS] [+Invoice]
- Recent Activity Feed
- Alerts Panel (low stock, pending approvals)

### PRODUCTS
| Route | Screen |
|-------|--------|
| `/products` | ProductList — DataTable, filter by type/category/status, search, bulk actions, import/export |
| `/products/new` | ProductCreate — multi-tab form (Basic, Variants, Images, Pricing, Inventory, SEO) |
| `/products/[id]` | ProductEdit — same tabs |
| `/products/[id]/variants` | VariantManager — Attribute combination matrix grid, per-variant SKU/price/stock |
| `/categories` | CategoryTree — Hierarchical drag-and-drop tree, add/edit/delete |
| `/attributes` | AttributeManager — Attribute groups, types, values |

### INVENTORY
| Route | Screen |
|-------|--------|
| `/inventory` | StockOverview — per product/variant/warehouse, visual low-stock indicators |
| `/inventory/movements` | StockMovementLog — filterable history (type, date, warehouse, product) |
| `/inventory/adjustments` | StockAdjustmentForm — product picker, variant, qty change (+/-), reason |
| `/inventory/transfers` | StockTransferForm — from/to warehouse, items list |
| `/inventory/stocktake` | StockTakeSheet — enter physical counts, variance report |
| `/inventory/alerts` | ReorderAlertsDashboard — products below threshold, one-click create PO |
| `/warehouses` | WarehouseManager — list + CRUD + StorageLocations |

### SALES
| Route | Screen |
|-------|--------|
| `/orders` | OrderList — filter by status/source/date, quick-view drawer |
| `/orders/new` | OrderCreate (Manual) — customer picker, products, shipping |
| `/orders/[id]` | OrderDetail — status timeline, fulfillment actions, invoice link |
| `/orders/[id]/fulfill` | FulfillmentScreen — mark items shipped, tracking #, partial fulfillment |
| `/orders/[id]/return` | Return/Refund Screen — select items, reason, refund method |
| `/invoices` | InvoiceList — status badges (draft/issued/paid/overdue), bulk PDF download |
| `/invoices/new` | InvoiceCreate — line items editor, tax selector, customer picker |
| `/invoices/[id]` | InvoiceDetail — payment history, outstanding balance, send button |
| `/quotes` | QuoteList — status filter |
| `/quotes/new` | QuoteCreate — product lines, validity date, discount, notes |
| `/quotes/[id]` | QuoteDetail — PDF preview, Accept/Reject workflow, convert-to-order |
| `/payments` | PaymentList — filter by method/date/customer |
| `/payments/record` | RecordPayment — invoice lookup, amount, method, date, reference |
| `/payments/outstanding` | OutstandingInvoices — AR aging view (0-30, 31-60, 60-90, 90+ days) |

### CUSTOMERS
| Route | Screen |
|-------|--------|
| `/customers` | CustomerList — search, filter by type/group/tag, export CSV |
| `/customers/new` | CustomerCreate — personal info, address, business details, tags, notes |
| `/customers/[id]` | CustomerProfile — 360 view: purchase history timeline, credit limit, loyalty points, communication log |
| `/customer-groups` | CustomerGroups — group management, pricing rule assignment |
| `/loyalty` | LoyaltyDashboard — points balance, tier status, redemption |

### VENDORS
| Route | Screen |
|-------|--------|
| `/vendors` | VendorList — search, performance indicators |
| `/vendors/new` | VendorCreate — contact info, payment terms, bank details, lead time |
| `/vendors/[id]` | VendorProfile — PO history, bills, payment history, product catalog |
| `/purchase-orders` | POList — filter by status/vendor/date |
| `/purchase-orders/new` | POCreate — vendor picker, product lines, expected delivery |
| `/purchase-orders/[id]` | PODetail — status timeline, items received per line, GRN entry |
| `/vendor-bills` | BillList — filter by status/vendor |
| `/vendor-bills/[id]` | BillDetail — record payment, aging info |

### HR
| Route | Screen |
|-------|--------|
| `/employees` | EmployeeDirectory — search, filter by dept/status/type; card/list view |
| `/employees/new` | EmployeeCreate — personal, contact, identity, job details, bank |
| `/employees/[id]` | EmployeeProfile — docs, attendance heatmap, payslips history, leave balances |
| `/org-chart` | OrgChart — visual department/designation tree |
| `/departments` | DepartmentManager — dept hierarchy, designations |
| `/attendance` | AttendanceDashboard — daily: present/absent/late/half-day counts |
| `/attendance/clock` | ClockInOut — employee select or PIN, timestamp |
| `/attendance/sheet` | AttendanceSheet — monthly grid per employee, edit entries |
| `/leave/requests` | LeaveRequests — leave request form |
| `/leave/queue` | LeaveApprovalQueue — manager view: pending list, approve/reject |
| `/leave/calendar` | LeaveCalendar — team calendar showing who is on leave |
| `/leave/balances` | LeaveBalances — per employee, per type, remaining days |
| `/payroll` | PayrollList — payroll runs history |
| `/payroll/new` | PayrollRunScreen — period picker, auto-calculate, preview per employee, approve |
| `/payroll/[id]` | PayrollDetail — payslips for this run |
| `/payroll/[id]/payslip/[eid]` | PayslipViewer — individual payslip PDF |
| `/salary-structures` | SalaryStructureBuilder — earnings/deductions templates |

### ACCOUNTING
| Route | Screen |
|-------|--------|
| `/accounting/accounts` | ChartOfAccounts — tree view (1000-5999), add/edit |
| `/accounting/journals` | JournalEntryList — status filter, date range |
| `/accounting/journals/new` | JournalEntryForm — multi-line debit/credit editor, balance validation |
| `/accounting/journals/[id]` | JournalEntryDetail — view + reverse |
| `/accounting/ledger` | GeneralLedger — account drill-down |
| `/accounting/reconciliation` | BankReconciliation — match transactions side-by-side, import CSV |
| `/accounting/ar-aging` | ARAgingReport — outstanding customer invoices by age |
| `/accounting/ap-aging` | APAgingReport — outstanding vendor bills by age |

### REPORTS
| Route | Screen |
|-------|--------|
| `/reports` | ReportsHub — category cards |
| `/reports/profit-loss` | P&L Statement — date range, comparative, export |
| `/reports/balance-sheet` | Balance Sheet — as-of date, drill-down |
| `/reports/cash-flow` | Cash Flow Statement |
| `/reports/trial-balance` | Trial Balance |
| `/reports/vat-return` | VAT Return — monthly/quarterly, SVAT export |
| `/reports/paye` | PAYE Report |
| `/reports/sales` | SalesAnalytics — by product/category/customer/date |
| `/reports/inventory` | InventoryAnalytics — stock value, fast movers, dead stock |
| `/reports/customers` | CustomerAnalytics — new vs returning, top customers |
| `/reports/purchases` | PurchaseAnalytics — by vendor, category |
| `/reports/hr` | HRAnalytics — attendance rate, leave utilisation |

### SETTINGS
| Route | Screen |
|-------|--------|
| `/settings` | GeneralSettings — business info, timezone, date format |
| `/settings/company` | CompanyProfile — logo upload, BRN, VAT number |
| `/settings/users` | UserManagement — invite staff, role assignment |
| `/settings/roles` | RolePermissionMatrix — granular permissions per role |
| `/settings/integrations` | IntegrationsHub — payment gateways, couriers, WhatsApp, SMS |
| `/settings/billing` | SubscriptionBilling — current plan, upgrade CTA, invoice history |
| `/settings/webstore` | WebstoreSettings — theme engine (color pickers, font, border-radius, logo, banner) |
| `/settings/webstore/domain` | CustomDomainSetup — DNS instructions, CNAME, TXT verification status |
| `/settings/shipping` | ShippingZoneBuilder — Province/District multi-select + rates |
| `/settings/coupons` | CouponManager — create/edit: type/value/conditions/expiry |

---

## POS TERMINAL `(pos)/`
| Route | Screen |
|-------|--------|
| `/pos` | Main POS Screen — ProductPanel (left) + CartPanel (right) |
| Modals | ShiftOpen, ShiftClose, VariantSelect, DiscountModal, PaymentModal, ReceiptModal, HoldSale, RetrieveHold |

---

## WEBSTORE `(storefront)/`
| Route | Page |
|-------|------|
| `/` | Homepage — Hero banner, featured products, category grid |
| `/products` | All Products — grid + filters + sort |
| `/products/category/[slug]` | Category Page — products + filter sidebar |
| `/products/[slug]` | Product Detail — gallery, variants, Add to Cart |
| `/search` | Search Results — fuzzy/Sinhala-glish results + filters |
| `/cart` | Shopping Cart — items, coupon, order summary |
| `/checkout` | Checkout Flow (5 steps) |
| `/checkout/confirmation` | Order Confirmation |
| `/account/login` | Customer Login |
| `/account/register` | Customer Registration |
| `/account` | Customer Portal Dashboard |
| `/account/orders` | Order History |
| `/account/orders/[id]` | Order Detail + Tracking Timeline |
| `/account/addresses` | Saved Addresses |
| `/account/wishlist` | Wishlist |
| `/account/reviews` | My Reviews |
| `/account/settings` | Account Settings |
| `/about` | About Us (static) |
| `/contact` | Contact Us (form) |
| `/faq` | FAQ (accordion) |
| `/blog` | Blog listing |
| `/blog/[slug]` | Blog post detail |
| `/pages/[slug]` | Dynamic CMS pages |

---

## SUPER ADMIN (Platform)
| Route | Screen |
|-------|--------|
| `/platform` | Platform Dashboard — MRR, tenants, revenue chart |
| `/platform/tenants` | Tenants List — plan/status/revenue/search |
| `/platform/tenants/[id]` | Tenant Detail — info, usage stats, suspend/delete |
| `/platform/plans` | Subscription Plans CRUD |
| `/platform/billing` | Transaction fee ledger per tenant |
| `/platform/analytics` | Growth/churn/revenue charts |
| `/platform/broadcasts` | Compose + send platform-wide notifications |
| `/platform/feature-flags` | Toggle features per plan/tenant |
