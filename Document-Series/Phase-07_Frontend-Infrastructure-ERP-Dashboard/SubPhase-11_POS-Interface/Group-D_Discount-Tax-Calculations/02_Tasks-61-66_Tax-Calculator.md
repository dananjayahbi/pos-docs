# Tasks 61-66: Tax Calculation & Grand Total

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** D - Discount & Tax Calculations  
> **Document:** 02 of 02  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-53-60_Totals-Discount.md](01_Tasks-53-60_Totals-Discount.md)
- **→ Next Group:** [../Group-E_Payment-Processing/](../Group-E_Payment-Processing/)

---

## Document Overview

This document covers tax calculation with display, grand total computation, total calculator utility functions, items count display, and pending amount tracking.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 61 | Create Tax Calculation Logic | Medium |
| 62 | Create Tax Display Row | Low |
| 63 | Create Grand Total Display | Low |
| 64 | Create Total Calculator Utility | Medium |
| 65 | Create Items Count Display | Low |
| 66 | Create Pending Amount Display | Low |

---

## Task 61: Create Tax Calculation Logic

### Overview
Create the tax calculation logic that computes tax amounts based on the taxable total (subtotal minus discounts) and applicable tax rates.

### Dependencies
- Task 54: Create Subtotal Display
- Task 55: Create Discount Section

### Instructions

1. **Create tax calculation utility**
   - Create `calculateTax.ts` in Cart utils directory
   - Pure function for calculations
   - Accept taxable amount and tax rate

2. **Define tax calculation method**
   - Calculate on: (Subtotal - Discount)
   - Tax amount = taxableTotal × (taxRate / 100)
   - Round to 2 decimal places
   - Return tax amount

3. **Get tax rate**
   - From tenant settings
   - Default rate: 15% (Sri Lanka VAT)
   - Support multiple tax rates
   - Zero rate option

4. **Handle item-level taxes**
   - Check if items have individual tax rates
   - Some items tax-exempt
   - Some items different rates
   - Sum all item taxes

5. **Create tax configuration**
   - Tax enabled: boolean
   - Tax rate: number
   - Tax-inclusive pricing: boolean
   - Tax name: string (VAT, GST, etc.)

6. **Implement tax methods**
   - calculateTaxAmount: Get tax for amount
   - calculateTaxableTotal: Get base for tax
   - getTaxRate: Get applicable rate
   - isTaxExempt: Check exemption

7. **Add tax rounding**
   - Round half up
   - Two decimal places
   - Consistent with currency
   - No penny discrepancies

### Tax Calculation Flow
```
┌─────────────────┐
│ Cart Items      │
│ - Item A: 100   │
│ - Item B: 200   │
│ - Item C: 200   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Subtotal: 500   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Apply Discount  │
│ -50 (10%)       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Taxable: 450    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Calculate Tax   │
│ 450 × 15%       │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Tax Amount:     │
│ 67.50           │
└─────────────────┘
```

### Tax Calculation Examples

| Subtotal | Discount | Taxable | Tax Rate | Tax Amount | Grand Total |
|----------|----------|---------|----------|------------|-------------|
| 1000.00 | 0 | 1000.00 | 15% | 150.00 | 1150.00 |
| 1000.00 | 100 | 900.00 | 15% | 135.00 | 1035.00 |
| 500.00 | 50 | 450.00 | 15% | 67.50 | 517.50 |
| 200.00 | 20 | 180.00 | 0% | 0.00 | 180.00 |

### Expected Utility Structure
```typescript
// File: frontend/utils/pos/calculateTax.ts

// Tax calculation types
// calculateTaxAmount function
//   - Input: taxableAmount, taxRate
//   - Output: taxAmount

// calculateTaxableTotal function
//   - Input: subtotal, discountAmount
//   - Output: taxableTotal

// getTaxRate function
//   - Input: tenantSettings
//   - Output: taxRate

// isTaxExempt function
//   - Input: product or category
//   - Output: boolean
```

### Verification Checklist
- [ ] `calculateTax.ts` created
- [ ] Tax amount calculated correctly
- [ ] Taxable total computed
- [ ] Tax rate retrieved
- [ ] Rounding implemented
- [ ] Tax exemption handled
- [ ] Functions documented
- [ ] Edge cases tested

---

## Task 62: Create Tax Display Row

### Overview
Create the tax display row component that shows the calculated tax amount in the cart totals section.

### Dependencies
- Task 61: Create Tax Calculation Logic
- Task 53: Create Cart Totals Section

### Instructions

1. **Create tax display component**
   - Create `TaxDisplay.tsx` in Cart directory
   - Calculation row in totals section
   - Read cart data and settings

2. **Calculate tax amount**
   - Use tax calculation utility (Task 61)
   - Get subtotal from store
   - Get discount from store
   - Calculate taxable total
   - Apply tax rate

3. **Display tax row**
   - Label: "Tax" or "VAT (15%)"
   - Show tax rate in label
   - Amount: LKR formatted
   - Right-aligned

4. **Handle zero tax**
   - Hide row if tax is 0 and not enabled
   - Show row if tax enabled but 0 amount
   - Clear indication
   - No confusion

5. **Show tax rate**
   - Include rate in label
   - Example: "VAT (15%)"
   - Alternative: "Tax @ 15%"
   - Clear what rate applied

6. **Update reactively**
   - Recalculate on subtotal change
   - Recalculate on discount change
   - Subscribe to cart store
   - Efficient updates

7. **Style appropriately**
   - Normal font weight
   - Standard size
   - Aligned with other rows
   - Clear contrast

### Tax Display Formats
```
Standard:
Tax (15%):         LKR 67.50

Alternative:
VAT @ 15%:         LKR 67.50

Zero Tax:
Tax (15%):         LKR 0.00

Tax Disabled:
(Row hidden)
```

### Tax Display States

| Tax Enabled | Tax Amount | Display | Notes |
|-------------|------------|---------|-------|
| Yes | > 0 | Show row | Normal |
| Yes | 0 | Show row | All items exempt |
| No | - | Hide row | Tax disabled |
| Yes | > 0 | Show with rate | Include % in label |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/TaxDisplay.tsx

// Imports
// TaxDisplay component
//   - Read cart store
//   - Get tax settings
//   - Calculate tax amount
//   - Format currency
//   - Render row with label and amount
//   - Conditional rendering
```

### Verification Checklist
- [ ] `TaxDisplay.tsx` created
- [ ] Tax calculated correctly
- [ ] Tax rate shown in label
- [ ] Currency formatted
- [ ] Updates reactively
- [ ] Zero tax handled
- [ ] Hidden when disabled
- [ ] Styling consistent

---

## Task 63: Create Grand Total Display

### Overview
Create the grand total display component that shows the final amount due including all calculations (subtotal minus discounts plus tax).

### Dependencies
- Task 54: Create Subtotal Display
- Task 55: Create Discount Section
- Task 62: Create Tax Display Row

### Instructions

1. **Create grand total component**
   - Create `GrandTotalDisplay.tsx` in Cart directory
   - Final calculation row
   - Most prominent display

2. **Calculate grand total**
   - Formula: Subtotal - Discount + Tax
   - Sum all calculations
   - Round to 2 decimals
   - Always positive

3. **Display grand total**
   - Label: "Total" or "Grand Total"
   - Large, bold text
   - LKR formatted with currency
   - Right-aligned amount

4. **Add visual emphasis**
   - Separator line above
   - Larger font size (18-24px)
   - Bold font weight (700)
   - Higher contrast color

5. **Style distinctly**
   - Different from other rows
   - Most important number
   - Prominent positioning
   - Eye-catching

6. **Show payment status**
   - If paying: Show total
   - If paid: Show change due
   - If split: Show remaining
   - Dynamic label

7. **Update in real-time**
   - Recalculate on any change
   - Subscribe to all dependencies
   - No calculation lag
   - Smooth updates

### Grand Total Display Formats
```
Standard:
────────────────────────
Total:         LKR 517.50  ← Bold, large

Emphasized:
═══════════════════════════
TOTAL:         LKR 517.50
═══════════════════════════

With Payment:
────────────────────────
Total:         LKR 517.50
Paid:          LKR 500.00
Change:        LKR -17.50
```

### Grand Total Calculation

| Component | Amount | Operation |
|-----------|--------|-----------|
| Subtotal | 500.00 | + |
| Discount | -50.00 | - |
| Tax | 67.50 | + |
| **Grand Total** | **517.50** | **=** |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/GrandTotalDisplay.tsx

// Imports
// GrandTotalDisplay component
//   - Read cart store
//   - Calculate grand total
//   - Format currency
//   - Render emphasized row
//   - Visual separator
//   - Large, bold styling
```

### Verification Checklist
- [ ] `GrandTotalDisplay.tsx` created
- [ ] Total calculated correctly
- [ ] Formula: Subtotal - Discount + Tax
- [ ] Bold, large text
- [ ] Separator line above
- [ ] Currency formatted
- [ ] Updates in real-time
- [ ] Most prominent display

---

## Task 64: Create Total Calculator Utility

### Overview
Create a comprehensive total calculator utility that provides all calculation functions used across the cart totals section.

### Dependencies
- Task 61: Create Tax Calculation Logic

### Instructions

1. **Create calculator utility**
   - Create `totalCalculator.ts` in utils directory
   - Collection of pure functions
   - Reusable calculations

2. **Implement calculateSubtotal**
   - Input: Array of cart items
   - Sum: item.unitPrice × item.quantity
   - Return: Subtotal amount
   - Handle empty cart

3. **Implement calculateDiscount**
   - Input: Subtotal, discount type, discount value
   - Percentage: subtotal × (value / 100)
   - Fixed: discount value
   - Max: subtotal
   - Return: Discount amount

4. **Implement calculateTax**
   - Input: Taxable total, tax rate
   - Calculate: taxableTotal × (rate / 100)
   - Round to 2 decimals
   - Return: Tax amount

5. **Implement calculateGrandTotal**
   - Input: Subtotal, discount, tax
   - Formula: subtotal - discount + tax
   - Ensure positive
   - Return: Grand total

6. **Add calculateChange**
   - Input: Grand total, amount paid
   - Calculate: paid - total
   - Can be negative (more to pay)
   - Return: Change or balance

7. **Add utility helpers**
   - roundToCurrency: Round to 2 decimals
   - formatCurrency: Format LKR with symbol
   - isValidAmount: Validate positive number
   - clampAmount: Ensure within min/max

8. **Create calculator class**
   - Alternative: Class with methods
   - Maintain calculation state
   - Chainable calculations
   - Cached results

### Calculator Functions
```
calculateSubtotal(items)
  → Sum of all item line totals

calculateDiscount(subtotal, type, value)
  → Discount amount

calculateTax(taxableTotal, rate)
  → Tax amount

calculateGrandTotal(subtotal, discount, tax)
  → Final amount due

calculateChange(total, paid)
  → Change or balance

Helper Functions:
- roundToCurrency(amount)
- formatCurrency(amount)
- isValidAmount(amount)
- clampAmount(amount, min, max)
```

### Calculation Dependencies
```
items → calculateSubtotal → subtotal
                              ↓
discount → calculateDiscount → discountAmount
                              ↓
subtotal - discount → taxableTotal
                              ↓
taxableTotal → calculateTax → taxAmount
                              ↓
subtotal - discount + tax → calculateGrandTotal → grandTotal
                              ↓
grandTotal, paid → calculateChange → change
```

### Expected Utility Structure
```typescript
// File: frontend/utils/pos/totalCalculator.ts

// Types for calculator
// calculateSubtotal function
// calculateDiscount function
// calculateTax function
// calculateGrandTotal function
// calculateChange function
// roundToCurrency helper
// formatCurrency helper
// isValidAmount helper
// clampAmount helper

// Optional: TotalCalculator class
//   - constructor
//   - calculation methods
//   - getters for results
```

### Verification Checklist
- [ ] `totalCalculator.ts` created
- [ ] All calculation functions implemented
- [ ] Subtotal calculates correctly
- [ ] Discount calculates correctly
- [ ] Tax calculates correctly
- [ ] Grand total calculates correctly
- [ ] Change calculates correctly
- [ ] Helpers implemented
- [ ] Functions documented
- [ ] Edge cases handled
- [ ] Tests written

---

## Task 65: Create Items Count Display

### Overview
Create the items count display component that shows the total number of items in the cart including quantities.

### Dependencies
- Group C, Task 46: Cart State Store

### Instructions

1. **Create items count component**
   - Create `ItemsCountDisplay.tsx` in Cart directory
   - Small display element
   - Can be in header or totals

2. **Calculate items count**
   - Option 1: Total unique items
   - Option 2: Sum of all quantities
   - Recommended: Sum of quantities
   - Count all items

3. **Display count**
   - Text: "X items" or "X items in cart"
   - Small, secondary text
   - Gray color
   - Subtle display

4. **Position appropriately**
   - Near cart header
   - Or in totals section
   - Or near subtotal
   - Clear but not prominent

5. **Update reactively**
   - Recalculate on cart changes
   - Subscribe to cart store
   - Instant updates
   - No lag

6. **Handle singular/plural**
   - 1 item vs 2 items
   - Proper grammar
   - Clear messaging
   - Professional

7. **Add to subtotal row**
   - Option: Show in subtotal label
   - "Subtotal (3 items)"
   - Integrates smoothly
   - Saves space

### Items Count Display Locations
```
In Header:
┌─────────────────────────┐
│ Cart           3 items  │ ← Header
├─────────────────────────┤
│ [Cart Items]            │
│                         │
└─────────────────────────┘

In Subtotal:
Subtotal (3 items):  LKR 500.00

As Separate Row:
┌─────────────────────────┐
│ 3 items                 │ ← Above totals
│ ─────────────────────   │
│ Subtotal:   LKR 500.00  │
│ Discount:   LKR -50.00  │
└─────────────────────────┘
```

### Count Calculation Examples

| Cart Items | Unique Items | Total Quantity | Display |
|------------|--------------|----------------|---------|
| A(1), B(1) | 2 | 2 | 2 items |
| A(2), B(1) | 2 | 3 | 3 items |
| A(1) | 1 | 1 | 1 item |
| Empty | 0 | 0 | 0 items |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/ItemsCountDisplay.tsx

// Imports
// ItemsCountDisplay component
//   - Read cart items from store
//   - Calculate total quantity
//   - Handle singular/plural
//   - Render count text
//   - Subtle styling
```

### Verification Checklist
- [ ] `ItemsCountDisplay.tsx` created
- [ ] Count calculated correctly
- [ ] Sum of quantities
- [ ] Singular/plural handled
- [ ] Updates reactively
- [ ] Positioned appropriately
- [ ] Styled subtly
- [ ] Clear display

---

## Task 66: Create Pending Amount Display

### Overview
Create the pending amount display component that shows remaining balance during split payments or partial payments.

### Dependencies
- Task 63: Create Grand Total Display
- Group E: Payment Processing (future)

### Instructions

1. **Create pending amount component**
   - Create `PendingAmountDisplay.tsx` in Cart directory
   - Shows remaining balance
   - Used during payment flow

2. **Calculate pending amount**
   - Formula: Grand Total - Total Paid
   - Initially equals grand total
   - Decreases as payments added
   - Zero when fully paid

3. **Display pending amount**
   - Label: "Remaining" or "Balance Due"
   - Amount in bold, red if > 0
   - Green if overpaid (change due)
   - LKR formatted

4. **Show during payment**
   - Hidden when not paying
   - Visible when payment modal open
   - Visible during split payment
   - Updates in real-time

5. **Handle payment states**
   - Not started: Hide or show total
   - In progress: Show remaining
   - Fully paid: Show "Paid in full"
   - Overpaid: Show change due

6. **Style for urgency**
   - Red text if balance due
   - Normal if zero
   - Green if change due
   - Bold, prominent

7. **Update dynamically**
   - Recalculate on payment added
   - Recalculate on payment removed
   - Subscribe to payment store
   - Instant updates

### Pending Amount Display States
```
No Payment:
(Hidden or shows total)

Partial Payment:
Remaining:     LKR 217.50  ← Red, bold

Fully Paid:
Paid in Full   ✓           ← Green

Overpaid:
Change Due:    LKR 32.50   ← Green
```

### Pending Amount Flow
```
Initial:
Grand Total: 517.50
Paid: 0
Pending: 517.50

After First Payment:
Grand Total: 517.50
Paid: 300.00
Pending: 217.50

After Second Payment:
Grand Total: 517.50
Paid: 517.50
Pending: 0.00 (Paid in full)

Overpaid:
Grand Total: 517.50
Paid: 550.00
Pending: -32.50 (Change due)
```

### Payment States

| Total | Paid | Pending | Display | Color |
|-------|------|---------|---------|-------|
| 517.50 | 0 | 517.50 | Balance Due | Red |
| 517.50 | 300 | 217.50 | Remaining | Red |
| 517.50 | 517.50 | 0 | Paid in Full | Green |
| 517.50 | 550 | -32.50 | Change Due | Green |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/PendingAmountDisplay.tsx

// Imports
// PendingAmountDisplay component
//   - Read grand total
//   - Read total paid
//   - Calculate pending
//   - Determine state
//   - Render with appropriate styling
//   - Color coding
//   - Conditional rendering
```

### Verification Checklist
- [ ] `PendingAmountDisplay.tsx` created
- [ ] Pending amount calculated
- [ ] Formula: Total - Paid
- [ ] Updates on payments
- [ ] Color coding implemented
- [ ] States handled correctly
- [ ] "Paid in full" shown when zero
- [ ] Change due shown when overpaid
- [ ] Hidden when not paying

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 61 | Create Tax Calculation Logic | Tax calculation utility |
| 62 | Create Tax Display Row | Tax display component |
| 63 | Create Grand Total Display | Grand total with emphasis |
| 64 | Create Total Calculator Utility | Complete calculator utility |
| 65 | Create Items Count Display | Items count component |
| 66 | Create Pending Amount Display | Pending balance tracker |

### Current Progress
```
frontend/
├── components/modules/pos/Cart/
│   ├── TaxDisplay.tsx               # Task 62 ✓
│   ├── GrandTotalDisplay.tsx        # Task 63 ✓
│   ├── ItemsCountDisplay.tsx        # Task 65 ✓
│   ├── PendingAmountDisplay.tsx     # Task 66 ✓
│   └── index.ts
└── utils/pos/
    ├── calculateTax.ts              # Task 61 ✓
    ├── totalCalculator.ts           # Task 64 ✓
    └── index.ts
```

### Group D Complete - Discount & Tax Calculations Status
✓ **All Tasks Completed:**
- Cart totals section with layout (Doc 1)
- Subtotal calculation and display (Doc 1)
- Discount section with modal (Doc 1)
- Discount type toggle and validation (Doc 1)
- Tax calculation logic (Doc 2)
- Tax display row (Doc 2)
- Grand total with emphasis (Doc 2)
- Total calculator utility (Doc 2)
- Items count display (Doc 2)
- Pending amount tracker (Doc 2)

⏳ **Next Group: E - Payment Processing**
- Payment modal and interface (Tasks 67-75)
- Payment methods and split payments (Tasks 76-82)

### Next Steps
Proceed to [../Group-E_Payment-Processing/](../Group-E_Payment-Processing/) to implement the payment interface and processing flow.

---

## Notes for AI Agents

1. **Tax Calculation:** Based on taxable total (subtotal minus discount), not on original subtotal
2. **Grand Total Formula:** Subtotal - Discount + Tax (in that order)
3. **Rounding:** All amounts rounded to 2 decimal places using half-up rounding
4. **Pending Amount:** Used for split payments, shown during payment flow
5. **Items Count:** Sum of all quantities, not unique item count
6. **Visual Emphasis:** Grand total must be most prominent display element
7. **Calculator Utility:** Centralized calculations for consistency across components
8. **Next Group:** Payment processing with multiple payment methods and split payments
