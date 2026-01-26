# Tasks 53-60: Totals Section & Discount

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** D - Discount & Tax Calculations  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Cart-Management/](../Group-C_Cart-Management/)
- **→ Next Document:** [02_Tasks-61-66_Tax-Calculator.md](02_Tasks-61-66_Tax-Calculator.md)

---

## Document Overview

This document covers the cart totals section creation with subtotal display, discount functionality including the discount modal with type selection and reason tracking.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 53 | Create Cart Totals Section | Medium |
| 54 | Create Subtotal Display | Low |
| 55 | Create Discount Section | Low |
| 56 | Create Apply Discount Button | Low |
| 57 | Create Discount Modal | Medium |
| 58 | Create Discount Type Toggle | Low |
| 59 | Create Discount Value Input | Low |
| 60 | Create Discount Reason Select | Low |

---

## Task 53: Create Cart Totals Section

### Overview
Create the cart totals section component that displays all financial calculations at the bottom of the cart panel in a fixed position.

### Dependencies
- Group C, Task 35: Create Cart Container

### Instructions

1. **Create totals section component**
   - Create `CartTotals.tsx` in Cart directory
   - Fixed at bottom of cart panel
   - Container for all calculation rows

2. **Define section structure**
   - Vertical stack of calculation rows
   - Subtotal row (Task 54)
   - Discount row (Task 55)
   - Tax row (Task 61)
   - Grand total row (Task 63)
   - Action buttons at bottom

3. **Add section styling**
   - Background distinct from items
   - Border top separator
   - Padding: 16-20px
   - Fixed position at bottom

4. **Create calculation rows layout**
   - Label on left
   - Amount on right
   - Space-between alignment
   - Consistent row height

5. **Style totals appropriately**
   - Clear typography hierarchy
   - Subtotal: normal weight
   - Discount: lighter, green
   - Tax: normal
   - Grand total: bold, larger

6. **Add visual separators**
   - Thin line above grand total
   - Optional line after subtotal
   - Adequate spacing between rows
   - Professional appearance

7. **Make responsive**
   - Stack properly on narrow widths
   - Maintain readability
   - Touch-friendly spacing
   - Adapt to panel width

### Cart Totals Section Layout
```
┌─────────────────────────────┐
│ Subtotal:      LKR 500.00   │
│ Discount:      LKR -50.00   │
│ Tax (15%):     LKR  67.50   │
│ ───────────────────────────  │
│ Total:         LKR 517.50   │ ← Bold, larger
│                             │
│ [ Pay ]     [ Hold ]        │ ← Actions
└─────────────────────────────┘
```

### Totals Row Structure

| Row | Label | Amount | Style |
|-----|-------|--------|-------|
| Subtotal | Left | Right | Normal |
| Discount | Left | Right | Green, minus sign |
| Tax | Left | Right | Normal |
| Separator | - | - | Thin line |
| Grand Total | Left | Right | Bold, larger |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/CartTotals.tsx

// 'use client' directive
// Imports
// CartTotals component
//   - Section container
//   - SubtotalDisplay
//   - DiscountSection
//   - Tax display (Task 61)
//   - Grand total (Task 63)
//   - Action buttons
```

### Verification Checklist
- [ ] `CartTotals.tsx` created
- [ ] Section fixed at bottom
- [ ] Calculation rows structured
- [ ] Visual hierarchy clear
- [ ] Separators visible
- [ ] Styling professional
- [ ] Responsive layout works
- [ ] Component exported

---

## Task 54: Create Subtotal Display

### Overview
Create the subtotal display component that shows the sum of all cart item line totals before discounts and taxes.

### Dependencies
- Task 53: Create Cart Totals Section
- Group C, Task 46: Cart State Store

### Instructions

1. **Create subtotal component**
   - Create `SubtotalDisplay.tsx` in Cart directory
   - Single calculation row
   - Read from cart store

2. **Calculate subtotal**
   - Sum all item line totals
   - item.unitPrice × item.quantity for each
   - Exclude discounts
   - Exclude tax

3. **Display subtotal**
   - Label: "Subtotal" or "Items Total"
   - Amount: LKR formatted
   - Two decimal places
   - Right-aligned amount

4. **Format currency**
   - Use Intl.NumberFormat or utility
   - Currency: LKR
   - Thousands separator
   - Consistent with system

5. **Add item count**
   - Optional: "(X items)" after label
   - Example: "Subtotal (3 items)"
   - Helpful context
   - Small, lighter text

6. **Style appropriately**
   - Normal font weight
   - Standard size
   - Clear contrast
   - Aligned with other rows

7. **Update reactively**
   - Recalculate on cart changes
   - Subscribe to cart store
   - Efficient re-render
   - No lag or flicker

### Subtotal Display Formats
```
Simple:
Subtotal:          LKR 500.00

With Count:
Subtotal (3 items):  LKR 500.00

Detailed:
Items Total:       LKR 500.00
(3 items)
```

### Calculation Formula
```
Subtotal = Σ (item.unitPrice × item.quantity)

For each item in cart:
  lineTotal = unitPrice × quantity
  
Subtotal = sum of all lineTotals
```

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/SubtotalDisplay.tsx

// Imports
// SubtotalDisplay component
//   - Read cart items from store
//   - Calculate subtotal
//   - Format currency
//   - Render row with label and amount
```

### Verification Checklist
- [ ] `SubtotalDisplay.tsx` created
- [ ] Subtotal calculated correctly
- [ ] Currency formatted properly
- [ ] Label clear
- [ ] Amount right-aligned
- [ ] Updates on cart changes
- [ ] Item count shown (optional)
- [ ] Styling consistent

---

## Task 55: Create Discount Section

### Overview
Create the discount section component that displays applied cart-level discounts and provides access to the discount application modal.

### Dependencies
- Task 53: Create Cart Totals Section

### Instructions

1. **Create discount section component**
   - Create `DiscountSection.tsx` in Cart directory
   - Calculation row with button
   - Show discount amount if applied

2. **Display discount status**
   - No discount: Show apply button only
   - Discount applied: Show amount and edit/remove
   - Discount label: "Discount" or "Cart Discount"
   - Amount with minus sign: "-LKR 50.00"

3. **Show discount details**
   - Discount type (%, fixed)
   - Discount value
   - Reason (if provided)
   - Tooltip with details

4. **Add apply discount button**
   - Button: "Apply Discount" (Task 56)
   - Positioned on right when no discount
   - Opens discount modal (Task 57)
   - Touch-friendly

5. **Add edit/remove options**
   - Edit button: Opens modal with current values
   - Remove button: Clears discount
   - Small, icon buttons
   - Confirm before remove

6. **Style discount row**
   - Green color for savings
   - Minus sign before amount
   - Lighter font weight
   - Aligned with other rows

7. **Calculate discount amount**
   - If percentage: subtotal × (percent / 100)
   - If fixed: discount value
   - Max: subtotal (cannot exceed)
   - Update on subtotal change

### Discount Section States
```
No Discount:
Discount:          [ Apply Discount ]

With Discount:
Discount (10%):    -LKR 50.00  [✏️][×]

With Reason:
Discount (10%)     -LKR 50.00  [✏️][×]
Loyalty Customer
```

### Discount Display

| State | Label | Amount | Actions |
|-------|-------|--------|---------|
| None | Discount | - | Apply button |
| Applied | Discount (10%) | -LKR 50.00 | Edit, Remove |
| With Reason | Discount (reason) | -LKR 50.00 | Edit, Remove |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/DiscountSection.tsx

// Imports
// DiscountSection component
//   - Read discount from store
//   - Calculate discount amount
//   - Display label and amount
//   - Apply button (if no discount)
//   - Edit/Remove buttons (if discount)
```

### Verification Checklist
- [ ] `DiscountSection.tsx` created
- [ ] No discount state correct
- [ ] Applied discount shown
- [ ] Discount calculated correctly
- [ ] Apply button visible
- [ ] Edit/Remove buttons work
- [ ] Green color for amount
- [ ] Tooltip shows details

---

## Task 56: Create Apply Discount Button

### Overview
Create the apply discount button component that opens the discount modal to allow cashiers to apply cart-level discounts.

### Dependencies
- Task 55: Create Discount Section

### Instructions

1. **Create button component**
   - Create `ApplyDiscountButton.tsx` in Cart directory
   - Button to open discount modal
   - Used in DiscountSection

2. **Design button UI**
   - Text: "Apply Discount" or icon + "Discount"
   - Small to medium size
   - Secondary or outline style
   - Touch-friendly (min 44px height)

3. **Add click handler**
   - Open discount modal (Task 57)
   - Pass existing discount data
   - Handle modal open state
   - Focus modal on open

4. **Check authorization**
   - Verify user has discount permission (optional)
   - Manager PIN for high discounts (optional)
   - Show unauthorized message if needed
   - Log discount attempts

5. **Add keyboard shortcut**
   - Shortcut: "/" key
   - Trigger button click
   - Document in help
   - Only when not typing

6. **Style button appropriately**
   - Consistent with other buttons
   - Clear label
   - Icon optional (tag or percent)
   - Hover state

7. **Handle disabled state**
   - Disable if no items in cart
   - Disable during operations
   - Show tooltip explaining why
   - Gray out when disabled

### Button States
```
Normal:
[ Apply Discount ]

Hover:
[ Apply Discount ]  ← Highlighted

Disabled:
[ Apply Discount ]  ← Grayed out

With Icon:
[ 🏷️ Apply Discount ]
```

### Button Behavior

| State | Enabled | Action |
|-------|---------|--------|
| Empty Cart | No | Tooltip: "Add items first" |
| Has Items | Yes | Open discount modal |
| Max Discount | No | Tooltip: "Max discount reached" |
| No Permission | No | Tooltip: "Unauthorized" |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/ApplyDiscountButton.tsx

// Imports
// ApplyDiscountButton component
//   - Button element
//   - Click handler
//   - Authorization check
//   - Disabled state logic
//   - Keyboard shortcut
```

### Verification Checklist
- [ ] `ApplyDiscountButton.tsx` created
- [ ] Button renders correctly
- [ ] Click opens modal
- [ ] Authorization checked (if implemented)
- [ ] Disabled when cart empty
- [ ] Keyboard shortcut works
- [ ] Tooltip shows on disabled
- [ ] Styling consistent

---

## Task 57: Create Discount Modal

### Overview
Create the discount modal component that provides a complete interface for applying cart-level discounts with type selection, value input, and reason tracking.

### Dependencies
- Task 56: Create Apply Discount Button

### Instructions

1. **Create discount modal component**
   - Create `DiscountModal.tsx` in Cart directory
   - Modal dialog component
   - Accept onApply and onCancel props

2. **Define modal structure**
   - Modal overlay (semi-transparent)
   - Modal content container
   - Header with title and close
   - Discount type toggle (Task 58)
   - Value input (Task 59)
   - Reason select (Task 60)
   - Preview section
   - Action buttons

3. **Add modal header**
   - Title: "Apply Cart Discount"
   - Close button (X icon)
   - Fixed at top
   - Clear typography

4. **Create discount form**
   - Type toggle: Percentage / Fixed
   - Value input: Number field
   - Reason select: Dropdown
   - Validation feedback

5. **Add preview section**
   - Show current subtotal
   - Calculate discount amount
   - Display final total
   - Update in real-time

6. **Implement action buttons**
   - Apply button (primary)
   - Cancel button (secondary)
   - Clear button (if editing)
   - Disable apply if invalid

7. **Handle modal state**
   - Open/close state
   - Form values state
   - Validation errors
   - Loading state

8. **Add validation**
   - Percentage: 0-100
   - Fixed: 0 to subtotal
   - Required fields check
   - Show error messages

9. **Implement keyboard support**
   - Escape to close
   - Enter to apply
   - Tab navigation
   - Focus trap

### Discount Modal Layout
```
┌───────────────────────────────────────┐
│ Apply Cart Discount            [×]    │ ← Header
├───────────────────────────────────────┤
│ Discount Type:                        │
│ (•) Percentage  ( ) Fixed             │ ← Type Toggle
│                                       │
│ Discount Value:                       │
│ [ 10.00 ] %                           │ ← Value Input
│                                       │
│ Reason (Optional):                    │
│ [ Loyalty Customer        ▼]          │ ← Reason Select
│                                       │
│ ─────────────────────────────────     │
│ Preview:                              │ ← Preview
│ Subtotal:       LKR 500.00            │
│ Discount (10%): LKR -50.00            │
│ Total:          LKR 450.00            │
│                                       │
│     [ Cancel ] [ Clear ] [ Apply ]    │ ← Actions
└───────────────────────────────────────┘
```

### Form Fields

| Field | Type | Validation | Required |
|-------|------|------------|----------|
| Type | Radio | Percentage/Fixed | Yes |
| Value | Number | 0-100 or 0-subtotal | Yes |
| Reason | Select | Predefined list | No |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/DiscountModal.tsx

// 'use client' directive
// Imports
// DiscountModal props
// DiscountModal component
//   - Modal overlay
//   - Modal content
//   - Header
//   - DiscountTypeToggle
//   - DiscountValueInput
//   - DiscountReasonSelect
//   - Preview section
//   - Action buttons
//   - Validation logic
//   - Keyboard handlers
```

### Verification Checklist
- [ ] `DiscountModal.tsx` created
- [ ] Modal opens/closes correctly
- [ ] Form fields functional
- [ ] Validation works
- [ ] Preview calculates correctly
- [ ] Apply updates cart
- [ ] Cancel closes without changes
- [ ] Keyboard support implemented
- [ ] Focus trapped in modal

---

## Task 58: Create Discount Type Toggle

### Overview
Create the discount type toggle component that allows switching between percentage and fixed amount discount types.

### Dependencies
- Task 57: Create Discount Modal

### Instructions

1. **Create toggle component**
   - Create `DiscountTypeToggle.tsx` in Cart directory
   - Radio buttons or toggle switch
   - Accept value and onChange props

2. **Define toggle options**
   - Option 1: Percentage (%)
   - Option 2: Fixed Amount (LKR)
   - Default: Percentage
   - Single selection only

3. **Implement radio buttons**
   - Two radio inputs
   - Same name attribute
   - Different values ("percentage", "fixed")
   - Clear labels

4. **Style toggle**
   - Horizontal layout
   - Visual selection indicator
   - Large touch targets
   - Clear active state

5. **Handle selection change**
   - Call onChange with new type
   - Update parent state
   - Clear value if needed
   - Update validation rules

6. **Add toggle alternative**
   - Alternative: Segmented control
   - Alternative: Switch component
   - Clear visual states
   - Consistent with design system

7. **Update dependent fields**
   - Change input suffix (% or LKR)
   - Update max value
   - Update validation rules
   - Clear invalid values

### Toggle Options
```
Radio Buttons:
( ) Percentage  (•) Fixed Amount

Segmented Control:
┌─────────────┬─────────────┐
│ Percentage  │ Fixed Amount│
│  (active)   │             │
└─────────────┴─────────────┘

Switch:
Percentage  [====○    ] Fixed
```

### Toggle States

| Type | Active | Label | Input Unit |
|------|--------|-------|------------|
| Percentage | Yes | Bold | % |
| Percentage | No | Normal | % |
| Fixed | Yes | Bold | LKR |
| Fixed | No | Normal | LKR |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/DiscountTypeToggle.tsx

// Imports
// DiscountTypeToggle props
// DiscountTypeToggle component
//   - Radio group or toggle
//   - Percentage option
//   - Fixed option
//   - Change handler
//   - Active state styling
```

### Verification Checklist
- [ ] `DiscountTypeToggle.tsx` created
- [ ] Both options render
- [ ] Selection changes
- [ ] onChange called correctly
- [ ] Active state visible
- [ ] Touch-friendly sizing
- [ ] Accessible labels
- [ ] Parent state updates

---

## Task 59: Create Discount Value Input

### Overview
Create the discount value input component that accepts numeric discount values with validation based on the selected discount type.

### Dependencies
- Task 57: Create Discount Modal

### Instructions

1. **Create value input component**
   - Create `DiscountValueInput.tsx` in Cart directory
   - Number input field
   - Accept value, type, max props

2. **Configure input field**
   - Type: number
   - Step: 0.01 (for decimals)
   - Min: 0
   - Max: Based on type

3. **Add input suffix**
   - Percentage: Show "%" after input
   - Fixed: Show "LKR" before input
   - Update based on type toggle
   - Clear visual indicator

4. **Implement validation**
   - Percentage: 0-100
   - Fixed: 0 to cart subtotal
   - Required field
   - Two decimal places max

5. **Show validation errors**
   - Invalid range: Red border
   - Error message below input
   - Clear error text
   - Show on blur or submit

6. **Handle input changes**
   - Parse to number
   - Validate on change
   - Call onChange handler
   - Debounce calculations (optional)

7. **Style input appropriately**
   - Large, clear input
   - Touch-friendly height
   - Proper padding for suffix
   - Focus state visible

### Input Field Layouts
```
Percentage:
┌──────────────────┐
│ 10.00         %  │
└──────────────────┘

Fixed Amount:
┌──────────────────┐
│ LKR    50.00     │
└──────────────────┘

With Error:
┌──────────────────┐
│ 150.00        %  │ ← Red border
└──────────────────┘
Value must be 0-100
```

### Validation Rules

| Discount Type | Min | Max | Decimals |
|---------------|-----|-----|----------|
| Percentage | 0 | 100 | 2 |
| Fixed | 0 | Subtotal | 2 |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/DiscountValueInput.tsx

// Imports
// DiscountValueInput props
// DiscountValueInput component
//   - Input container
//   - Number input
//   - Suffix display (% or LKR)
//   - Validation logic
//   - Error message
//   - Change handler
```

### Verification Checklist
- [ ] `DiscountValueInput.tsx` created
- [ ] Input renders correctly
- [ ] Suffix shows based on type
- [ ] Validation works
- [ ] Error messages display
- [ ] Min/max enforced
- [ ] onChange called
- [ ] Focus state visible

---

## Task 60: Create Discount Reason Select

### Overview
Create the discount reason select component that allows cashiers to choose from predefined discount reasons for audit and reporting purposes.

### Dependencies
- Task 57: Create Discount Modal

### Instructions

1. **Create reason select component**
   - Create `DiscountReasonSelect.tsx` in Cart directory
   - Dropdown select field
   - Accept value and onChange props

2. **Define reason options**
   - Loyalty Customer
   - Promotional Discount
   - Damaged Item
   - Manager Approval
   - Price Match
   - Other
   - Optional: Custom reason

3. **Create select field**
   - Standard HTML select
   - Or custom dropdown component
   - Placeholder: "Select reason (optional)"
   - Not required field

4. **Handle "Other" option**
   - Show text input when selected
   - Free-form reason entry
   - Validate if "Other" requires text
   - Store custom reason

5. **Style select appropriately**
   - Match other form inputs
   - Clear dropdown arrow
   - Touch-friendly height
   - Consistent padding

6. **Add optional field indicator**
   - Label: "Reason (Optional)"
   - Gray text for placeholder
   - No required asterisk
   - Can be left blank

7. **Store reason with discount**
   - Include in discount object
   - Save to cart store
   - Available for reporting
   - Display in discount section

### Reason Select Layouts
```
Standard:
┌────────────────────────┐
│ Select reason...    ▼  │
└────────────────────────┘

With Selection:
┌────────────────────────┐
│ Loyalty Customer    ▼  │
└────────────────────────┘

"Other" Selected:
┌────────────────────────┐
│ Other               ▼  │
└────────────────────────┘
┌────────────────────────┐
│ Enter reason...        │
└────────────────────────┘
```

### Reason Options

| Option | Usage | Notes |
|--------|-------|-------|
| Loyalty Customer | Regular customer | Common |
| Promotional | Store promotion | Approved |
| Damaged Item | Product defect | Document |
| Manager Approval | Special case | Require auth |
| Price Match | Competitor | Record |
| Other | Custom reason | Text input |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/Cart/DiscountReasonSelect.tsx

// Imports
// DiscountReasonSelect props
// DiscountReasonSelect component
//   - Select dropdown
//   - Reason options
//   - "Other" text input (conditional)
//   - Change handler
//   - Optional styling
```

### Verification Checklist
- [ ] `DiscountReasonSelect.tsx` created
- [ ] Select renders with options
- [ ] All reasons listed
- [ ] Selection changes work
- [ ] "Other" shows text input
- [ ] Optional field (no error if empty)
- [ ] Reason stored correctly
- [ ] Styling consistent

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 53 | Create Cart Totals Section | Totals container component |
| 54 | Create Subtotal Display | Subtotal calculation row |
| 55 | Create Discount Section | Discount display and access |
| 56 | Create Apply Discount Button | Open discount modal button |
| 57 | Create Discount Modal | Complete discount form |
| 58 | Create Discount Type Toggle | Percentage/Fixed toggle |
| 59 | Create Discount Value Input | Value input with validation |
| 60 | Create Discount Reason Select | Reason selection dropdown |

### Current Progress
```
frontend/components/modules/pos/Cart/
├── CartTotals.tsx                   # Task 53 ✓
├── SubtotalDisplay.tsx              # Task 54 ✓
├── DiscountSection.tsx              # Task 55 ✓
├── ApplyDiscountButton.tsx          # Task 56 ✓
├── DiscountModal.tsx                # Task 57 ✓
├── DiscountTypeToggle.tsx           # Task 58 ✓
├── DiscountValueInput.tsx           # Task 59 ✓
├── DiscountReasonSelect.tsx         # Task 60 ✓
└── index.ts
```

### Discount Functionality Status
✓ **Completed Components:**
- Cart totals section with structured layout
- Subtotal calculation and display
- Discount section with apply/edit/remove
- Complete discount modal with validation
- Type toggle (percentage/fixed)
- Value input with validation
- Reason selection for audit trail

⏳ **Pending (Next Document):**
- Tax calculation (Task 61)
- Tax display row (Task 62)
- Grand total display (Task 63)
- Total calculator utility (Task 64)
- Items count display (Task 65)
- Pending amount display (Task 66)

### Next Steps
Proceed to [02_Tasks-61-66_Tax-Calculator.md](02_Tasks-61-66_Tax-Calculator.md) to implement tax calculations and complete the totals section.

---

## Notes for AI Agents

1. **Discount Types:** Support both percentage (0-100%) and fixed amount (LKR) discounts
2. **Validation:** Percentage max 100%, fixed max cart subtotal
3. **Reason Tracking:** Important for audit and reporting, but optional field
4. **Preview Calculations:** Update in real-time as user changes discount values
5. **Authorization:** Consider implementing permission checks for high-value discounts
6. **Color Coding:** Use green for discount amounts to indicate savings
7. **Keyboard Shortcuts:** "/" key for quick discount access
8. **Next Document:** Focus on tax calculations, grand total, and calculator utility
