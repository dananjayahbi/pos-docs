# SubPhase 11: POS Interface - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 11 of 14  
> **SubPhase Goal:** Build the Point of Sale terminal interface for retail transactions  
> **Total Tasks:** 98 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-10_Sales-Orders-UI](../SubPhase-10_Sales-Orders-UI/)
- **→ Next SubPhase:** [SubPhase-12_Customer-Vendor-UI](../SubPhase-12_Customer-Vendor-UI/)

---

## SubPhase Overview

This sub-phase creates the complete Point of Sale (POS) terminal interface for retail transactions. It includes product search, barcode scanning, cart management, payment processing, and receipt printing. The POS is designed for high-speed retail operations.

### Key Outcomes
- Full-screen POS terminal interface
- Product search with barcode support
- Quick add buttons grid
- Shopping cart with quantity management
- Discount application (item/cart level)
- Multiple payment methods
- Receipt printing
- Shift management (open/close)
- Offline mode indicator

### Technology Context
- **Layout:** Full-screen dedicated interface
- **Keyboard:** Keyboard shortcuts for speed
- **Barcode:** Scanner input support
- **State:** Local state for cart, sync on complete
- **Print:** Thermal receipt printing

### POS Layout Reference
```
┌─────────────────────────────────────────────────────────────┐
│ [Exit POS]                              [Shift: OPEN #123]  │
├─────────────────────────────────┬───────────────────────────┤
│ PRODUCT SEARCH                  │ CART                      │
│ [🔍 Search or scan barcode...] │                           │
│                                 │ Item 1         ₨ 1,500    │
│ [Quick Buttons Grid]           │ Item 2 x 2     ₨ 3,000    │
│ ┌───────┐ ┌───────┐ ┌───────┐ │ Item 3         ₨ 500      │
│ │ Rice  │ │ Sugar │ │ Milk  │ │ ─────────────────────────  │
│ └───────┘ └───────┘ └───────┘ │ Subtotal       ₨ 5,000    │
│ ┌───────┐ ┌───────┐ ┌───────┐ │ Discount       ₨ -500     │
│ │ Tea   │ │Coffee │ │ Bread │ │ Tax            ₨ 450      │
│ └───────┘ └───────┘ └───────┘ │ ═════════════════════════  │
│                                 │ TOTAL          ₨ 4,950    │
│                                 │                           │
│                                 │ [💳 Pay] [🗑️ Clear]       │
└─────────────────────────────────┴───────────────────────────┘
```

---

## Task Execution Order

```
TASK GROUP A: POS Routes & Layout Structure (Tasks 01-16)
        │
        ▼
TASK GROUP B: Product Search & Quick Buttons (Tasks 17-34)
        │
        ▼
TASK GROUP C: Cart Management (Tasks 35-52)
        │
        ▼
TASK GROUP D: Discount & Tax Calculations (Tasks 53-66)
        │
        ▼
TASK GROUP E: Payment Processing (Tasks 67-82)
        │
        ▼
TASK GROUP F: Receipt, Shift & Testing (Tasks 83-98)
```

---

## Task Index

### Group A: POS Routes & Layout Structure (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create POS Route Directory** | Set up app/(pos)/ directory | SubPhase-07 | 🔴 Not Created |
| 02 | **Create POS Layout** | Full-screen layout without sidebar | Task 01 | 🔴 Not Created |
| 03 | **Create POS Page Route** | Create pos/page.tsx main terminal | Task 01 | 🔴 Not Created |
| 04 | **Create POS Loading State** | Loading screen for POS | Task 01 | 🔴 Not Created |
| 05 | **Create POS Error Boundary** | Error handling for POS | Task 01 | 🔴 Not Created |
| 06 | **Create POS Header Component** | Top bar with exit, shift info | Task 02 | 🔴 Not Created |
| 07 | **Create Exit POS Button** | Exit to dashboard with confirmation | Task 06 | 🔴 Not Created |
| 08 | **Create Shift Status Display** | Show current shift number/status | Task 06 | 🔴 Not Created |
| 09 | **Create POS Main Container** | Two-column layout container | Task 02 | 🔴 Not Created |
| 10 | **Create Product Panel** | Left panel for products | Task 09 | 🔴 Not Created |
| 11 | **Create Cart Panel** | Right panel for cart | Task 09 | 🔴 Not Created |
| 12 | **Create POS Context Provider** | Context for POS state | Task 03 | 🔴 Not Created |
| 13 | **Create POS State Types** | TypeScript types for POS | Task 12 | 🔴 Not Created |
| 14 | **Create Offline Mode Indicator** | Show offline status banner | Task 02 | 🔴 Not Created |
| 15 | **Create POS Keyboard Shortcuts** | Set up keyboard handlers | Task 03 | 🔴 Not Created |
| 16 | **Verify POS Route Structure** | Test POS route is accessible | Task 15 | 🔴 Not Created |

---

### Group B: Product Search & Quick Buttons (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create Product Search Bar** | Search input with barcode icon | Task 10 | 🔴 Not Created |
| 18 | **Create Search Input Component** | Auto-focus search input | Task 17 | 🔴 Not Created |
| 19 | **Create Barcode Scanner Handler** | Detect barcode scanner input | Task 17 | 🔴 Not Created |
| 20 | **Create Search Results Dropdown** | Show matching products | Task 18 | 🔴 Not Created |
| 21 | **Create Search Result Item** | Single product result display | Task 20 | 🔴 Not Created |
| 22 | **Create Add from Search** | Add product to cart from search | Task 21 | 🔴 Not Created |
| 23 | **Create Quick Buttons Container** | Grid container for quick buttons | Task 10 | 🔴 Not Created |
| 24 | **Create Quick Button Component** | Single quick add button | Task 23 | 🔴 Not Created |
| 25 | **Create Quick Button Grid** | Responsive grid of buttons | Task 24 | 🔴 Not Created |
| 26 | **Create Category Tabs** | Category filter for quick buttons | Task 23 | 🔴 Not Created |
| 27 | **Create Category Tab Item** | Single category tab | Task 26 | 🔴 Not Created |
| 28 | **Create Quick Button Action** | Add product on button click | Task 25 | 🔴 Not Created |
| 29 | **Create Product Image Display** | Show product image in button | Task 24 | 🔴 Not Created |
| 30 | **Create Out of Stock Indicator** | Disable button if no stock | Task 24 | 🔴 Not Created |
| 31 | **Create Price Display in Button** | Show price on quick button | Task 24 | 🔴 Not Created |
| 32 | **Load Quick Button Products** | API call for quick products | Task 28 | 🔴 Not Created |
| 33 | **Create Variant Selection Modal** | Modal for variant products | Task 28 | 🔴 Not Created |
| 34 | **Connect Product Search to API** | Use product search API | Task 32 | 🔴 Not Created |

---

### Group C: Cart Management (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Cart Container** | Container for cart panel | Task 11 | 🔴 Not Created |
| 36 | **Create Cart Items List** | Scrollable list of cart items | Task 35 | 🔴 Not Created |
| 37 | **Create Cart Item Row** | Single item row component | Task 36 | 🔴 Not Created |
| 38 | **Create Item Name Display** | Product name and variant | Task 37 | 🔴 Not Created |
| 39 | **Create Item Quantity Controls** | +/- buttons for quantity | Task 37 | 🔴 Not Created |
| 40 | **Create Quantity Input Field** | Direct quantity input | Task 39 | 🔴 Not Created |
| 41 | **Create Item Price Display** | Line item price (qty × unit) | Task 37 | 🔴 Not Created |
| 42 | **Create Remove Item Button** | Remove item from cart | Task 37 | 🔴 Not Created |
| 43 | **Create Item Options Button** | Menu for item actions | Task 37 | 🔴 Not Created |
| 44 | **Create Item Discount Input** | Apply discount to line item | Task 43 | 🔴 Not Created |
| 45 | **Create Empty Cart State** | Display when cart is empty | Task 36 | 🔴 Not Created |
| 46 | **Create Cart State Store** | Zustand store for cart | Task 35 | 🔴 Not Created |
| 47 | **Create Add to Cart Action** | Add product to cart | Task 46 | 🔴 Not Created |
| 48 | **Create Update Quantity Action** | Update item quantity | Task 46 | 🔴 Not Created |
| 49 | **Create Remove from Cart Action** | Remove item from cart | Task 46 | 🔴 Not Created |
| 50 | **Create Clear Cart Action** | Clear all items with confirm | Task 46 | 🔴 Not Created |
| 51 | **Create Clear Cart Dialog** | Confirmation for clear cart | Task 50 | 🔴 Not Created |
| 52 | **Create Cart Persistence** | Persist cart in localStorage | Task 46 | 🔴 Not Created |

---

### Group D: Discount & Tax Calculations (Tasks 53-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create Cart Totals Section** | Section showing all totals | Task 35 | 🔴 Not Created |
| 54 | **Create Subtotal Display** | Sum of line items before discount | Task 53 | 🔴 Not Created |
| 55 | **Create Discount Section** | Cart-level discount display | Task 53 | 🔴 Not Created |
| 56 | **Create Apply Discount Button** | Button to open discount modal | Task 55 | 🔴 Not Created |
| 57 | **Create Discount Modal** | Modal for applying discount | Task 56 | 🔴 Not Created |
| 58 | **Create Discount Type Toggle** | Percentage vs Fixed amount | Task 57 | 🔴 Not Created |
| 59 | **Create Discount Value Input** | Input discount value | Task 57 | 🔴 Not Created |
| 60 | **Create Discount Reason Select** | Optional reason for discount | Task 57 | 🔴 Not Created |
| 61 | **Create Tax Calculation** | Calculate applicable taxes | Task 53 | 🔴 Not Created |
| 62 | **Create Tax Display Row** | Show tax amount | Task 61 | 🔴 Not Created |
| 63 | **Create Grand Total Display** | Final total with styling | Task 53 | 🔴 Not Created |
| 64 | **Create Total Calculator Utility** | Calculate all totals | Task 63 | 🔴 Not Created |
| 65 | **Create Items Count Display** | Show number of items | Task 53 | 🔴 Not Created |
| 66 | **Create Pending Amount Display** | Amount due after partial pay | Task 53 | 🔴 Not Created |

---

### Group E: Payment Processing (Tasks 67-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create Cart Action Buttons** | Pay and Clear buttons | Task 35 | 🔴 Not Created |
| 68 | **Create Pay Button** | Large prominent pay button | Task 67 | 🔴 Not Created |
| 69 | **Create Payment Modal** | Full payment processing modal | Task 68 | 🔴 Not Created |
| 70 | **Create Payment Amount Display** | Show amount to pay | Task 69 | 🔴 Not Created |
| 71 | **Create Payment Methods Grid** | Grid of payment options | Task 69 | 🔴 Not Created |
| 72 | **Create Cash Payment Option** | Cash payment with numpad | Task 71 | 🔴 Not Created |
| 73 | **Create Cash Amount Numpad** | Numeric keypad for amount | Task 72 | 🔴 Not Created |
| 74 | **Create Cash Quick Amounts** | Quick buttons (exact, round) | Task 72 | 🔴 Not Created |
| 75 | **Create Change Calculator** | Calculate and display change | Task 72 | 🔴 Not Created |
| 76 | **Create Card Payment Option** | Card payment option | Task 71 | 🔴 Not Created |
| 77 | **Create Bank Transfer Option** | Bank transfer option | Task 71 | 🔴 Not Created |
| 78 | **Create Split Payment Toggle** | Enable split payment | Task 69 | 🔴 Not Created |
| 79 | **Create Split Payment Interface** | Multiple payment entry | Task 78 | 🔴 Not Created |
| 80 | **Create Customer Selection** | Attach customer to sale | Task 69 | 🔴 Not Created |
| 81 | **Create Complete Sale Action** | Process and complete sale | Task 80 | 🔴 Not Created |
| 82 | **Create Sale Completion API Call** | Submit sale to backend | Task 81 | 🔴 Not Created |

---

### Group F: Receipt, Shift & Testing (Tasks 83-98)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Receipt Modal** | Show receipt after sale | Task 82 | 🔴 Not Created |
| 84 | **Create Receipt Content** | Format receipt layout | Task 83 | 🔴 Not Created |
| 85 | **Create Print Receipt Button** | Print thermal receipt | Task 83 | 🔴 Not Created |
| 86 | **Create Email Receipt Button** | Email receipt to customer | Task 83 | 🔴 Not Created |
| 87 | **Create New Sale Button** | Start new sale after receipt | Task 83 | 🔴 Not Created |
| 88 | **Create Shift Open Modal** | Modal to open new shift | Task 08 | 🔴 Not Created |
| 89 | **Create Opening Cash Input** | Enter opening cash amount | Task 88 | 🔴 Not Created |
| 90 | **Create Shift Close Modal** | Modal to close shift | Task 08 | 🔴 Not Created |
| 91 | **Create Shift Summary Display** | Show shift totals | Task 90 | 🔴 Not Created |
| 92 | **Create Cash Count Input** | Enter actual cash count | Task 90 | 🔴 Not Created |
| 93 | **Create Shift Variance Display** | Show expected vs actual | Task 92 | 🔴 Not Created |
| 94 | **Create Close Shift Action** | Complete shift closure | Task 93 | 🔴 Not Created |
| 95 | **Create Hold Sale Feature** | Put sale on hold | Task 35 | 🔴 Not Created |
| 96 | **Create Retrieve Hold Feature** | Retrieve held sale | Task 95 | 🔴 Not Created |
| 97 | **Create POS Module Documentation** | Document all POS components | Task 96 | 🔴 Not Created |
| 98 | **Final Verification & Testing** | Test complete POS module | Task 97 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (pos)/
│       ├── layout.tsx            # Full-screen POS layout
│       └── pos/
│           ├── page.tsx          # POS terminal
│           ├── loading.tsx
│           └── error.tsx
├── components/
│   └── modules/
│       └── pos/
│           ├── POSLayout/
│           │   ├── POSLayout.tsx
│           │   ├── POSHeader.tsx
│           │   ├── POSContainer.tsx
│           │   └── index.ts
│           ├── ProductPanel/
│           │   ├── ProductPanel.tsx
│           │   ├── ProductSearch.tsx
│           │   ├── QuickButtons.tsx
│           │   ├── QuickButton.tsx
│           │   ├── CategoryTabs.tsx
│           │   ├── VariantModal.tsx
│           │   └── index.ts
│           ├── Cart/
│           │   ├── CartPanel.tsx
│           │   ├── CartItems.tsx
│           │   ├── CartItem.tsx
│           │   ├── CartTotals.tsx
│           │   ├── DiscountModal.tsx
│           │   └── index.ts
│           ├── Payment/
│           │   ├── PaymentModal.tsx
│           │   ├── PaymentMethods.tsx
│           │   ├── CashPayment.tsx
│           │   ├── CardPayment.tsx
│           │   ├── Numpad.tsx
│           │   ├── SplitPayment.tsx
│           │   └── index.ts
│           ├── Receipt/
│           │   ├── ReceiptModal.tsx
│           │   ├── ReceiptContent.tsx
│           │   ├── PrintReceipt.tsx
│           │   └── index.ts
│           ├── Shift/
│           │   ├── ShiftOpenModal.tsx
│           │   ├── ShiftCloseModal.tsx
│           │   ├── ShiftSummary.tsx
│           │   └── index.ts
│           └── index.ts
├── store/
│   └── pos/
│       ├── cart.ts               # Cart state store
│       ├── shift.ts              # Shift state store
│       └── index.ts
└── lib/
    └── pos/
        ├── calculator.ts         # Total calculations
        ├── barcode.ts            # Barcode handling
        └── print.ts              # Receipt printing
```

---

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| F1 | Focus search |
| F2 | Apply discount |
| F3 | Customer lookup |
| F4 | Hold sale |
| F5 | Retrieve hold |
| F10 | Process payment |
| F12 | Open/Close shift |
| Esc | Cancel/Close modal |
| Enter | Add selected item |

---

## Payment Methods

| Method | Icon | Features |
|--------|------|----------|
| Cash | 💵 | Numpad, quick amounts, change |
| Card | 💳 | Reference number input |
| Bank Transfer | 🏦 | Reference number input |
| Mobile Payment | 📱 | Future integration |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 98 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 98 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Full-Screen:** POS uses dedicated full-screen layout, no sidebar
3. **Keyboard Focus:** Always return focus to search after actions
4. **Barcode Scanner:** Treat rapid keystrokes as barcode input
5. **LKR Currency:** All amounts in Sri Lankan Rupees (₨)
6. **Speed:** Optimize for fast retail operations
7. **Offline Capable:** Cart should persist locally
8. **Shift Required:** Sale requires open shift
9. **Dependencies:** This sub-phase depends on SubPhase-07 and Phase-05 POS APIs
10. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
11. **Receipt Format:** Design for 80mm thermal printer
12. **Touch Support:** Buttons should be touch-friendly for tablet POS
