# LCC — POS Terminal (Detailed Spec)

## Layout (Full-Screen, No Sidebar/Header)
```
┌─────────────────────────────────────────────────────────────┐
│ POS HEADER                                                  │
│ [← Exit POS]  [Store Name]     [Shift: OPEN #123]  [⚡ Sync]│
│ ─────────────────────────────────────────────────────────── │
│ [OFFLINE BANNER: ⚠️ Offline Mode — 3 sales pending sync]    │
├──────────────────────────┬──────────────────────────────────┤
│  PRODUCT PANEL (left)    │  CART PANEL (right)              │
│  60% width               │  40% width                      │
│                          │                                  │
│  [🔍 Search or scan      │  Customer: [Walk-in ▼ / Search] │
│      barcode...  F1]     │                                  │
│                          │  ┌──────────────────────────┐   │
│  CATEGORY TABS           │  │ T-Shirt (Red, M)  ₨1,500 │   │
│  [All][Food][Clothing][+]│  │        [-] 2 [+]  [🗑]   │   │
│                          │  │ [%Disc] per item           │   │
│  PRODUCT QUICK GRID      │  ├──────────────────────────┤   │
│  4 columns grid          │  │ Trousers (32)     ₨3,000 │   │
│  ┌──────┐ ┌──────┐       │  └──────────────────────────┘   │
│  │[img] │ │[img] │       │                                  │
│  │Rice  │ │Sugar │       │  ────────────────────────────   │
│  │₨ 250 │ │₨ 180 │       │  Subtotal          ₨ 9,000      │
│  └──────┘ └──────┘       │  Discount (10%)    ₨ -900       │
│  ┌──────┐ ┌──────┐       │  Tax (VAT 0%)      ₨ 0          │
│  │[OOS] │ │[img] │       │  ══════════════════════════     │
│  │Milk  │ │ Tea  │       │  TOTAL             ₨ 8,100      │
│  │Out   │ │₨ 120 │       │                                  │
│  └──────┘ └──────┘       │  [Apply Discount F2]             │
│                          │  [Apply Coupon]                  │
│                          │                                  │
│                          │  [💳 PAY  F10]  [🗑 Clear Cart]  │
│                          │  [⏸ Hold F4]    [📋 Held F5]    │
└──────────────────────────┴──────────────────────────────────┘
```

## POS Component Hierarchy
```
(pos)/layout.tsx
└── POSTerminal
    ├── POSHeader
    │   ├── ExitPOSButton + ConfirmationDialog
    │   ├── ShiftStatusDisplay
    │   └── OfflineModeIndicator (badge + banner)
    ├── ProductPanel (left 60%)
    │   ├── ProductSearch (barcode handler, auto-focus)
    │   ├── CategoryTabs (horizontal scrollable)
    │   ├── ProductGrid
    │   │   └── ProductButton (img, name, price, OOS state)
    │   └── VariantSelectionModal
    └── CartPanel (right 40%)
        ├── CustomerSelector (Walk-in / Search / Create)
        ├── CartItemsList (scrollable)
        │   └── CartItemRow
        │       ├── ItemName + variant info
        │       ├── QtyControls (+/-)
        │       ├── UnitPrice + LineTotal
        │       ├── RemoveButton
        │       └── PerItemDiscountTrigger
        ├── EmptyCartState
        ├── CartSummary
        │   ├── SubtotalDisplay
        │   ├── DiscountSection
        │   ├── TaxDisplay
        │   └── GrandTotal (large, LKR formatted)
        └── CartActions
            ├── PayButton → PaymentModal (F10)
            ├── ApplyDiscountButton (F2)
            ├── ApplyCouponButton
            ├── HoldSaleButton (F4)
            └── ClearCartButton
```

## POS Modals

### Shift Open Modal
- Fields: Opening Cash Amount (numpad), Timer auto-start
- Actions: [Begin Shift]

### Shift Close Modal
- Display: Expected cash, Actual cash entry, Variance
- Summary: Total sales, payment method breakdown
- Actions: [Close Shift] [Print Z-Report]

### Variant Selection Modal
- Triggered: When adding a product with variants
- Shows: Attribute matrix (Size × Color grid)
- Each combination shows: stock qty, price, SKU
- Actions: [Select] / disabled if out-of-stock

### Discount Modal
- Toggle: % Discount | Fixed Amount
- Input: Value
- Reason selector (dropdown): Staff Discount, Customer Loyalty, Damaged Goods, Clearance, Other
- Scope: Per-item | Cart Total
- Actions: [Apply] [Cancel]

### Payment Modal
```
┌────────────────────────────────────┐
│ TOTAL TO PAY: ₨ 8,100              │
│                                    │
│ Payment Method:                    │
│ [💵 Cash] [💳 Card] [🏦 Transfer]  │
│ [Split Payment]                    │
│                                    │
│ [CASH PAYMENT]                     │
│ Amount Tendered:                   │
│ [₨ ____________] NUMPAD            │
│ Quick: [₨500] [₨1000] [₨2000]     │
│                                    │
│ Change: ₨ 900                      │
│ [Complete Sale F10]                │
└────────────────────────────────────┘
```

### Split Payment Interface
- List of payment rows: Method + Amount
- [+ Add Payment Method]
- Running total: Paid / Remaining
- Validate: Paid >= Total before allowing confirm

### Receipt Modal (Post-Sale)
```
┌────────────────────────────────┐
│     [STORE LOGO]               │
│  STORE NAME                    │
│  Address Line, City            │
│  +94 XX XXX XXXX               │
│                                │
│ Receipt #: RCP-20240115-001    │
│ Date: Jan 15, 2026 10:45 AM   │
│ Cashier: Admin                 │
│ ─────────────────────────────  │
│ T-Shirt Red M   x2  ₨ 3,000  │
│ Trousers 32     x1  ₨ 3,000  │
│ ─────────────────────────────  │
│ Subtotal:          ₨ 9,000   │
│ Discount (10%):   -₨   900   │
│ Total:             ₨ 8,100   │
│ Paid (Cash):       ₨ 9,000   │
│ Change:            ₨   900   │
│ ─────────────────────────────  │
│ Thank you for your purchase!  │
│ WhatsApp: wa.me/94XXXXXXXX    │
│                                │
│ [🖨 Print 80mm] [📧 Email]     │
│ [💬 WhatsApp] [New Sale]      │
└────────────────────────────────┘
```

### Held Orders List
- List of held carts with: customer name (or "Walk-in"), item count, timestamp
- Actions: [Resume] [Delete]

## Keyboard Shortcuts
| Key | Action |
|-----|--------|
| F1 | Focus product search |
| F2 | Open discount modal |
| F3 | Customer lookup |
| F4 | Hold current sale |
| F5 | View held sales |
| F10 | Process payment |
| F12 | Open/Close shift |
| Esc | Cancel / Close modal |
| Enter | Add scanned/selected item |

## POS Settings (from Settings page, not in POS UI)
- Terminal Name
- Printer: Type (58mm / 80mm), Connection (USB / BT / LAN)
- Default Warehouse
- Receipt footer message
- Display second screen (Enterprise)

## Offline Mode
- Service Worker manages offline detection
- IndexedDB: cached product catalog, customer list, pending sales queue
- Offline Banner: "⚠️ Offline Mode — X sales queued for sync"
- On reconnect: auto-sync → inventory updated → conflicts flagged
- Sync indicator button in POS header
