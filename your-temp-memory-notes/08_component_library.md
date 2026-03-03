# LCC — Design System & Component Library

## Design Tokens
| Token | Value |
|-------|-------|
| Primary | `#2563eb` (Blue) |
| Secondary | `#64748b` (Slate) |
| Success | `#22c55e` (Green) |
| Warning | `#f59e0b` (Amber) |
| Error | `#ef4444` (Red) |
| Background | `#ffffff` |
| Foreground | `#0f172a` |
| Muted | `#f1f5f9` |
| Border | `#e2e8f0` |
| Sidebar width expanded | 240px |
| Sidebar width collapsed | 64px |
| Header height | 64px |
| Border Radius | 0.5rem (tenant-customizable via CSS var) |
| Font | Inter / system-ui (tenant-customizable) |

## CSS Variables (Tenant-Customizable)
```css
--color-primary: #2563eb;
--color-secondary: #64748b;
--border-radius: 0.5rem;
--font-family: 'Inter', system-ui;
```
Tenants override these via ThemeSettings in ERP Settings → Webstore.

## Component Library (Shadcn/UI + Custom)

### Core UI Components
| Component | Variants | Notes |
|-----------|----------|-------|
| `Button` | primary, secondary, outline, ghost, destructive | sizes: sm/md/lg |
| `Input` | default, disabled, error state | all form inputs |
| `Textarea` | resize-y | multi-line inputs |
| `Select` / `Combobox` | searchable, multi-select | Province/District/City |
| `Card` | default, hover, active | KPI cards, product cards |
| `Modal` / `Dialog` | centered, slide-over | confirmations, forms |
| `Drawer` | slide from right/left | mobile nav, quick views |
| `Table` / `DataTable` | sortable, filterable, paginated, selectable | all list views |
| `Toast` | success/error/warning/info | feedback notifications |
| `Skeleton` | pulse animation | loading placeholders |
| `EmptyState` | illustrated | zero-content placeholders with CTA |
| `Avatar` | with image / fallback initials | users, customers |
| `Badge` | colored by status | status indicators everywhere |
| `Tabs` | horizontal | product form, customer profile, reports |
| `Breadcrumb` | route-derived | all dashboard pages |
| `PageHeader` | title + actions slot | top of each page |
| `Dropdown` | submenu support | UserMenu, QuickActions |
| `Progress` | linear, circular | payroll, revenue bar |
| `Calendar` / `DatePicker` | single, range | attendance, reports |
| `FileUpload` | drag-and-drop | product images, bank slips |
| `Accordion` | controlled | FAQ, section collapsing |
| `Alert` | info/warning/error/success | system alerts |
| `Tooltip` | hover | icon buttons |
| `Popover` | click-triggered | date pickers, color pickers |
| `CommandPalette` | Cmd+K | global search |
| `Separator` | horizontal or vertical | layout dividers |

### Custom Components
| Component | Purpose | Used In |
|-----------|---------|---------|
| `VariantMatrix` | Attribute combination grid (Size × Color) | Product form, POS |
| `POSNumpad` | Numeric input pad | POS payment modal, shift open/close |
| `ReceiptPreview` | Formatted receipt (80mm/58mm style) | POS receipt modal |
| `StatusBadge` | Color-mapped badge per entity status | All list/detail pages |
| `StatusTimeline` | Horizontal progress steps | Order, Quote, PO status |
| `StockIndicator` | Color-coded stock level (in-stock/low/OOS) | Products, Inventory |
| `CurrencyInput` | LKR-formatted input with ₨ prefix | All price fields |
| `PhoneInput` | +94 prefixed Sri Lanka format | Customers, Employees |
| `AddressSelector` | Cascading Province → District → City | Customer, Checkout |
| `KOKOInstallmentDisplay` | 3-payment BNPL split visualization | Webstore checkout, PDP |
| `WaybillCard` | Courier tracking number display | Order detail, delivery |
| `AvatarGroup` | Stacked avatars | Employees, team views |
| `AttendanceCalendar` | Monthly heatmap grid | Employee profile, HR |
| `MiniChart` | Sparkline/small charts | KPI cards |
| `ProductCard` | Webstore product card | Catalog, search results |
| `CartMiniDrawer` | Mini-cart overlay from header | Webstore header |
| `CheckoutStepper` | Step indicator | Webstore checkout |
| `ReviewStars` | Rating display + input | Product reviews |
| `WhatsAppWidget` | Floating chat button | Webstore all pages |
| `AnnouncementBar` | Dismissible top banner | Webstore all pages |
| `FlashSaleCountdown` | Timer component | Sale pages |
| `RecommendationsWidget` | AI product recommendations | Webstore PDP, cart |
| `DemandForecastWidget` | AI forecast display | ERP inventory |
| `OrgChart` | Department tree visualization | HR module |
| `BankReconciliationView` | Side-by-side transaction matching | Accounting |
| `PayslipPreview` | Formatted payslip display | HR payroll |
| `InvoicePDFPreview` | PDF preview of invoice | Invoice detail |
| `POSCategoryTabBar` | Horizontal scrollable category tabs | POS product panel |
| `POSProductButton` | Product quick-add button with image | POS product grid |
| `SplitPaymentInterface` | Multi-method payment allocation | POS payment modal |

## Responsive Breakpoints
| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 768px | Single column; drawer nav; bottom tabs optional |
| Tablet | 768–1024px | 2 column; drawer nav trigger |
| Desktop | 1024px+ | Full sidebar visible; multi-column layouts |

## Typography Scale
- `text-xs`: 12px — labels, captions
- `text-sm`: 14px — secondary text, table data
- `text-base`: 16px — body text
- `text-lg`: 18px — section headings
- `text-xl`: 20px — page titles
- `text-2xl`: 24px — dashboard KPI numbers
- `text-3xl`: 30px — large KPI values (POS total)
- `font-medium`: card titles, nav items
- `font-semibold`: headings
- `font-bold`: KPI values, totals

## Icon Library (Lucide React)
Key icons used:
- `Home` — Dashboard
- `Package` — Products
- `Warehouse` — Inventory
- `ShoppingCart` — Sales/Orders
- `Monitor` — POS
- `Users` — Customers
- `Truck` — Vendors/Couriers
- `Users2` — HR
- `Calculator` — Accounting
- `BarChart` — Reports
- `Settings` — Settings
- `Bell` — Notifications
- `Search` — Search
- `Plus` — Add/Create
- `ChevronDown` — Dropdown
- `ChevronRight` — Expand/Navigate
- `Edit` / `Pencil` — Edit
- `Trash` — Delete
- `Download` — Download/Export
- `Upload` — Upload
- `Printer` — Print
- `Send` — Email/Send
- `Check` — Success/Complete
- `X` — Close/Cancel
- `AlertTriangle` — Warning
- `Info` — Information
- `Eye` — View
- `LogOut` — Logout
- `Lock` — Permissions
- `Globe` — Custom Domain
- `CreditCard` — Payments
- `Receipt` — Receipts
- `FileText` — Invoices/Quotes
- `TrendingUp` / `TrendingDown` — Trends
- `Calendar` — Dates
- `Clock` — Time/Shifts
- `MapPin` — Address/Location
- `Phone` — Phone
- `Mail` — Email
- `MessageSquare` — WhatsApp/Chat

## Key UX Patterns

### Empty States
- Illustrated SVG icons
- Title: "No [entity] found"
- Description: Action prompt
- CTA Button: "Add your first [entity]"

### Loading States
- Skeleton loaders matching content shape
- Shimmer animation

### Error States
- Inline field validation (red border + error message below)
- Form submission errors: top-of-form alert
- Network errors: toast notification

### Feedback
- Success: Green toast bottom-right
- Error: Red toast
- Warning: Amber toast
- All toasts auto-dismiss in 4 seconds

### Confirmation Dialogs
- Destructive actions (delete, cancel, void) always require confirmation
- Dialog: "Are you sure?" + description of consequence + [Cancel] [Confirm/Delete]

### Print Styles
- Sidebar/header hidden (`@media print`)
- Receipt/Invoice/Payslip expanded to full width
- No background colors (print-friendly)
