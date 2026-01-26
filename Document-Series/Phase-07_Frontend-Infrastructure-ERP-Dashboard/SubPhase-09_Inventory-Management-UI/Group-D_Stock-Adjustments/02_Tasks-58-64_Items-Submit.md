# Tasks 58-64: Adjustment Items & Submission

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** D - Stock Adjustments  
> **Document:** 02 of 02  
> **Tasks Covered:** 58, 59, 60, 61, 62, 63, 64

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-57_List-HeaderForm.md](01_Tasks-49-57_List-HeaderForm.md)

---

## Document Overview

This document covers the items section of the adjustment form where users search and add products, specify new quantities, view calculated differences, add item notes, and submit the adjustment with confirmation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 58 | Create Adjustment Items Section | Medium | 30 min |
| 59 | Create Product Search for Adjustment | Medium | 30 min |
| 60 | Create Adjustment Item Row | Medium | 30 min |
| 61 | Create Quantity Difference Display | Low | 20 min |
| 62 | Create Notes Input | Low | 15 min |
| 63 | Create Submit Adjustment | Medium | 30 min |
| 64 | Create Adjustment Confirmation | Low | 20 min |

---

## Task 58: Create Adjustment Items Section

### Overview
Create the main items section container where users can add multiple products to the adjustment with quantities and notes.

### Dependencies
- Task 54: Create New Adjustment Page
- Task 55: Create Adjustment Form Schema

### Instructions

1. **Create component file:** Create `AdjustmentItems.tsx` in Adjustments directory
2. **Import form dependencies:** React Hook Form, useFieldArray
3. **Define component props:** Accept form control, register, errors
4. **Set up field array:** Use useFieldArray for dynamic items
5. **Create section layout:** Header with add button, items list
6. **Add empty state:** Show message when no items added
7. **Implement add item:** Add new row to field array
8. **Implement remove item:** Remove row from field array
9. **Calculate totals:** Sum of all differences
10. **Style section:** Card layout with proper spacing
11. **Export component:** Export with types

### Section Structure
```
┌────────────────────────────────────────────────────────┐
│  Adjustment Items                    [+ Add Product]   │
├────────────────────────────────────────────────────────┤
│  Product          │ Current │ New  │ Diff │ Actions   │
├────────────────────────────────────────────────────────┤
│  [Search/Select]  │    -    │  -   │  -   │  [Remove] │
│                                                        │
│  Product A        │   100   │  95  │  -5  │  [Notes]  │
│  SKU: ABC-001     │   units │      │      │  [Remove] │
│                                                        │
│  Product B        │    50   │  55  │  +5  │  [Notes]  │
│  SKU: XYZ-002     │   units │      │      │  [Remove] │
├────────────────────────────────────────────────────────┤
│  Total Adjustments: 2 products │ Net Change: 0 units  │
└────────────────────────────────────────────────────────┘
```

### Section Features

| Feature | Description | Behavior |
|---------|-------------|----------|
| Add Product | Button to add item row | Opens product search |
| Item Rows | Dynamic list of products | Can be removed |
| Current Qty | Shows existing stock | Read-only, from API |
| New Qty | Input for adjusted quantity | User enters value |
| Difference | Calculated field | Auto-updates |
| Notes | Optional per-item notes | Expandable field |
| Remove | Delete item button | Confirms before removing |

### Empty State
```
┌────────────────────────────────────────┐
│  Adjustment Items                      │
├────────────────────────────────────────┤
│                                        │
│         No products added              │
│                                        │
│         Click "Add Product" to         │
│         start your adjustment          │
│                                        │
│         [+ Add Product]                │
│                                        │
└────────────────────────────────────────┘
```

### Totals Display

| Metric | Calculation | Display |
|--------|-------------|---------|
| Products | Count of items | "2 products" |
| Increases | Sum positive diffs | "+10 units" |
| Decreases | Sum negative diffs | "-5 units" |
| Net Change | Sum all differences | "+5 units" |

### Expected Outcome
- Dynamic items section
- Add/remove functionality
- Automatic calculations
- Totals summary

### Verification
- [ ] Can add items
- [ ] Can remove items
- [ ] Totals calculate correctly
- [ ] Empty state displays

---

## Task 59: Create Product Search for Adjustment

### Overview
Create product search/select component that allows users to find and add products to the adjustment with warehouse-specific stock information.

### Dependencies
- Task 58: Create Adjustment Items Section

### Instructions

1. **Create component file:** Create `ProductSearchAdjustment.tsx`
2. **Import dependencies:** Combobox, API hooks
3. **Define component props:** Accept onSelect, warehouseId, excludeIds
4. **Create search state:** Manage query and results
5. **Implement search API:** Query products with debounce
6. **Filter by warehouse:** Show only products in selected warehouse
7. **Display stock info:** Show current stock level for each product
8. **Handle selection:** Call onSelect with product data
9. **Show variants:** Display product variants if applicable
10. **Style component:** Dropdown with proper search UX
11. **Export component:** Export with types

### Search Interface
```
┌────────────────────────────────────────┐
│  🔍 Search products...                 │
└────────────────────────────────────────┘
     ↓ (typing)
┌────────────────────────────────────────┐
│  Results for "widget"                  │
├────────────────────────────────────────┤
│  Widget A                              │
│  SKU: WID-001 • Stock: 100 units       │
├────────────────────────────────────────┤
│  Widget B (Red)                        │
│  SKU: WID-002-RED • Stock: 50 units    │
├────────────────────────────────────────┤
│  Widget B (Blue)                       │
│  SKU: WID-002-BLU • Stock: 75 units    │
└────────────────────────────────────────┘
```

### Search Features

| Feature | Implementation |
|---------|----------------|
| Debounce | 300ms delay |
| Min Characters | 2 characters |
| Results Limit | 20 products |
| Search Fields | Name, SKU, barcode |
| Filtering | By selected warehouse |
| Exclusion | Hide already added products |
| Stock Display | Show current quantity |
| Keyboard Nav | Arrow keys + Enter |

### Result Item Structure
```
Product Name
SKU: [SKU Code] • Stock: [Quantity] units
[Variant info if applicable]
```

### Stock Display Rules

| Stock Level | Display | Color |
|-------------|---------|-------|
| > 100 | "Stock: N units" | Green |
| 1-100 | "Stock: N units" | Yellow |
| 0 | "Out of stock" | Red |

### Search Behavior

| Action | Result |
|--------|--------|
| Type in search | Debounced API call |
| Click result | Add to items list |
| Press Escape | Close dropdown |
| Press Enter | Select highlighted |
| No results | Show "No products found" |

### Expected Outcome
- Functional product search
- Warehouse-filtered results
- Stock information display
- Smooth selection flow

### Verification
- [ ] Search returns results
- [ ] Warehouse filter works
- [ ] Stock displays correctly
- [ ] Selection adds item

---

## Task 60: Create Adjustment Item Row

### Overview
Create the row component for displaying individual adjustment items with current quantity, new quantity input, and action buttons.

### Dependencies
- Task 58: Create Adjustment Items Section

### Instructions

1. **Create component file:** Create `AdjustmentItemRow.tsx`
2. **Define component props:** Accept item, index, onUpdate, onRemove
3. **Create row layout:** Grid with product, quantities, difference, actions
4. **Display product info:** Name, SKU, image thumbnail
5. **Show current quantity:** Read-only display with unit
6. **Create quantity input:** Number input for new quantity
7. **Add quantity controls:** +/- buttons for easy adjustment
8. **Show difference:** Use QuantityDiff component
9. **Add notes button:** Toggle for notes field
10. **Add remove button:** Confirm deletion
11. **Implement validation:** Prevent negative quantities
12. **Style row:** Hover effects and proper spacing
13. **Export component:** Export with types

### Row Layout
```
┌────────────────────────────────────────────────────────┐
│ [IMG] Product Name                                     │
│       SKU: ABC-001                                     │
│                                                        │
│       Current: 100 units                               │
│       New: [ 95 ] [+] [-]                             │
│       Difference: -5 units (5% decrease) ⬇️            │
│                                                        │
│       [💬 Add Notes] [🗑️ Remove]                      │
└────────────────────────────────────────────────────────┘
```

### Grid Structure (Desktop)

| Column | Width | Content |
|--------|-------|---------|
| Product | 40% | Image, Name, SKU |
| Current Qty | 15% | Read-only value |
| New Qty | 20% | Input + controls |
| Difference | 15% | Calculated display |
| Actions | 10% | Notes, Remove |

### Quantity Input Features

| Feature | Description |
|---------|-------------|
| Type | Number input |
| Min | 0 |
| Max | 999999 |
| Step | 1 |
| Controls | +1, -1, +10, -10 buttons |
| Validation | Prevent negative |

### Quantity Control Buttons
```
[-10] [-1] [Input: 95] [+1] [+10]
```

### Product Display

| Element | Content |
|---------|---------|
| Thumbnail | 40x40px image |
| Name | Product name (truncate) |
| SKU | Secondary text |
| Unit | Display unit (pcs, kg, etc) |

### Expected Outcome
- Complete item row component
- Quantity input with controls
- Difference calculation
- Actions working

### Verification
- [ ] Product info displays
- [ ] Quantity input works
- [ ] Controls function
- [ ] Difference updates

---

## Task 61: Create Quantity Difference Display

### Overview
Create a visual component that shows the calculated difference between current and new quantities with color coding and percentage change.

### Dependencies
- Task 60: Create Adjustment Item Row

### Instructions

1. **Create component file:** Create `QuantityDiff.tsx`
2. **Define component props:** Accept currentQty, newQty, unit
3. **Calculate difference:** newQty - currentQty
4. **Calculate percentage:** (difference / currentQty) * 100
5. **Determine direction:** Increase, decrease, or no change
6. **Select color:** Green for increase, red for decrease, gray for same
7. **Select icon:** Up arrow, down arrow, or equal sign
8. **Format display:** Show difference with +/- sign
9. **Add tooltip:** Show detailed calculation on hover
10. **Style component:** Badge style with color variants
11. **Export component:** Export with types

### Display Variations

**Increase:**
```
+15 units (15% increase) ⬆️
Color: Green (bg-green-100, text-green-700)
```

**Decrease:**
```
-10 units (10% decrease) ⬇️
Color: Red (bg-red-100, text-red-700)
```

**No Change:**
```
No change ➖
Color: Gray (bg-gray-100, text-gray-700)
```

### Component Structure
```
┌──────────────────────────────┐
│ [Icon] ±N units (X% change)  │
└──────────────────────────────┘
```

### Calculation Examples

| Current | New | Difference | Percentage | Display |
|---------|-----|------------|------------|---------|
| 100 | 95 | -5 | -5% | -5 units (5% decrease) ⬇️ |
| 50 | 60 | +10 | +20% | +10 units (20% increase) ⬆️ |
| 75 | 75 | 0 | 0% | No change ➖ |
| 0 | 10 | +10 | N/A | +10 units (new stock) ⬆️ |
| 10 | 0 | -10 | -100% | -10 units (depleted) ⬇️ |

### Color Coding

| Type | Background | Text | Icon | Border |
|------|------------|------|------|--------|
| Increase | bg-green-50 | text-green-700 | ArrowUp | border-green-200 |
| Decrease | bg-red-50 | text-red-700 | ArrowDown | border-red-200 |
| No Change | bg-gray-50 | text-gray-700 | Minus | border-gray-200 |

### Tooltip Content
```
Current Quantity: 100 units
New Quantity: 95 units
Difference: -5 units
Change: -5%
```

### Special Cases

| Case | Handling |
|------|----------|
| Current = 0 | Show "New stock" instead of percentage |
| New = 0 | Show "Depleted" |
| Very large % | Cap display at ±999% |
| Decimal units | Round to 2 decimal places |

### Expected Outcome
- Visual difference display
- Color-coded indicators
- Percentage calculations
- Intuitive icons

### Verification
- [ ] Difference calculates correctly
- [ ] Colors match direction
- [ ] Percentage displays
- [ ] Icons show properly

---

## Task 62: Create Notes Input

### Overview
Create an optional notes input field for individual adjustment items, allowing users to provide context for specific product adjustments.

### Dependencies
- Task 60: Create Adjustment Item Row

### Instructions

1. **Create component file:** Create `AdjustmentItemNotes.tsx` (or integrate into ItemRow)
2. **Define component props:** Accept value, onChange, itemName
3. **Create toggle button:** Show/hide notes field
4. **Create textarea:** Multi-line input for notes
5. **Add character counter:** Show remaining characters (max 200)
6. **Add placeholder:** Helpful placeholder text
7. **Implement auto-expand:** Textarea grows with content
8. **Style component:** Clean, integrated design
9. **Export component:** Export if standalone

### Notes Field UI
```
Collapsed State:
┌────────────────────────────────────────┐
│ [💬 Add Notes]                         │
└────────────────────────────────────────┘

Expanded State:
┌────────────────────────────────────────┐
│ Notes for Product A              [✕]   │
│ ┌────────────────────────────────────┐ │
│ │ Explain the reason for this       │ │
│ │ adjustment...                     │ │
│ │                                   │ │
│ └────────────────────────────────────┘ │
│ 125 / 200 characters                   │
└────────────────────────────────────────┘
```

### Field Specifications

| Property | Value |
|----------|-------|
| Type | Textarea |
| Max Length | 200 characters |
| Min Rows | 2 |
| Max Rows | 4 |
| Required | No |
| Auto-resize | Yes |

### Placeholder Examples
```
- "Explain why this quantity is being adjusted..."
- "Reason for this adjustment"
- "Optional notes about this item"
```

### Character Counter

| Remaining | Display | Color |
|-----------|---------|-------|
| 50+ | "N / 200" | Gray |
| 20-49 | "N / 200" | Yellow |
| 0-19 | "N / 200" | Red |

### Toggle Button States

| State | Label | Icon | Action |
|-------|-------|------|--------|
| Collapsed | "Add Notes" | MessageSquare | Expand field |
| Expanded | "Remove Notes" | X | Collapse & clear |
| Has Content | "Edit Notes" | MessageSquare (filled) | Expand field |

### Behavior

| Action | Result |
|--------|--------|
| Click Add Notes | Expand textarea, focus cursor |
| Click Remove | Collapse, clear value, confirm if content |
| Type over limit | Prevent input |
| Press Escape | Collapse field |

### Expected Outcome
- Optional notes field
- Character limit enforced
- Smooth expand/collapse
- Clear visual feedback

### Verification
- [ ] Toggle works
- [ ] Character limit enforced
- [ ] Content saves
- [ ] Clear button works

---

## Task 63: Create Submit Adjustment

### Overview
Create the submission logic for processing the completed adjustment form, including validation, API call, and success handling.

### Dependencies
- Task 58: Create Adjustment Items Section
- Task 55: Create Adjustment Form Schema

### Instructions

1. **Create submission handler:** In AdjustmentForm component
2. **Import API functions:** Create adjustment API endpoint
3. **Validate form:** Ensure all fields pass Zod validation
4. **Validate items:** Check at least one item exists
5. **Validate quantities:** Ensure no negative stock (if configured)
6. **Show confirmation:** Open confirmation dialog before submit
7. **Prepare payload:** Format data for API
8. **Call API:** Submit adjustment data
9. **Handle loading:** Show loading state during submission
10. **Handle success:** Show success message, navigate to list
11. **Handle errors:** Display error messages appropriately
12. **Implement retry:** Allow retry on network errors
13. **Track analytics:** Log adjustment creation event

### Submission Flow
```
1. User clicks "Submit Adjustment"
   ↓
2. Validate form data
   ↓
3. Show confirmation dialog
   ↓
4. User confirms
   ↓
5. Show loading state
   ↓
6. Call API endpoint
   ↓
7. Success: Navigate to list + success message
   Error: Show error + retry option
```

### Validation Checklist

| Check | Validation | Error Message |
|-------|------------|---------------|
| Warehouse | Required, valid UUID | "Select a warehouse" |
| Reason | Required, valid enum | "Select a reason code" |
| Items | Min 1 item | "Add at least one product" |
| Quantities | All >= 0 | "Quantities cannot be negative" |
| Unique Products | No duplicates | "Product already added" |

### API Payload Structure
```
{
  reference: "ADJ-2026-001",
  warehouse_id: "uuid",
  reason_code: "DAMAGE",
  notes: "Optional general notes",
  items: [
    {
      product_id: "uuid",
      current_quantity: 100,
      new_quantity: 95,
      difference: -5,
      notes: "Optional item notes"
    }
  ],
  status: "draft"  // or "pending" if auto-submit
}
```

### Loading States

| State | Button | Message |
|-------|--------|---------|
| Idle | "Submit Adjustment" | - |
| Validating | "Validating..." | Disabled button |
| Submitting | "Submitting..." | Disabled, spinner |
| Success | "Success!" | 2s then redirect |
| Error | "Submit Adjustment" | Error message below |

### Success Handling

| Action | Description |
|--------|-------------|
| Show Toast | "Adjustment created successfully" |
| Update State | Mark form as submitted |
| Navigate | Redirect to adjustments list |
| Refresh | Update list with new adjustment |

### Error Handling

| Error Type | Message | Action |
|------------|---------|--------|
| Validation | Field-specific errors | Show inline |
| Network | "Connection error. Please retry." | Retry button |
| Server | Server error message | Contact support |
| Duplicate | "Adjustment reference exists" | Generate new ref |
| Stock | "Insufficient stock" | Highlight items |

### Expected Outcome
- Complete submission flow
- Proper validation
- Error handling
- Success navigation

### Verification
- [ ] Validation works
- [ ] API call succeeds
- [ ] Success redirects
- [ ] Errors display properly

---

## Task 64: Create Adjustment Confirmation

### Overview
Create a confirmation dialog that summarizes the adjustment details before final submission, giving users a chance to review and confirm.

### Dependencies
- Task 63: Create Submit Adjustment

### Instructions

1. **Create component file:** Create `ConfirmAdjustmentDialog.tsx`
2. **Define component props:** Accept adjustment data, onConfirm, onCancel
3. **Create dialog structure:** Modal with header, content, actions
4. **Display summary:** Show warehouse, reason, items count
5. **Show items list:** Table of products with differences
6. **Calculate totals:** Show net change summary
7. **Add warning:** If large adjustments or negative stock
8. **Create action buttons:** Cancel and Confirm
9. **Handle confirmation:** Call onConfirm callback
10. **Style dialog:** Clear, scannable layout
11. **Export component:** Export with types

### Dialog Layout
```
┌────────────────────────────────────────┐
│  Confirm Stock Adjustment          [✕] │
├────────────────────────────────────────┤
│                                        │
│  Reference: ADJ-2026-001               │
│  Warehouse: Main Warehouse             │
│  Reason: Damaged Goods                 │
│                                        │
│  Adjusting 3 products:                 │
│                                        │
│  Product A: 100 → 95 (-5)              │
│  Product B: 50 → 55 (+5)               │
│  Product C: 25 → 0 (-25)               │
│                                        │
│  Net Change: -25 units                 │
│                                        │
│  ⚠️ Warning: Product C will be         │
│  depleted to zero stock.               │
│                                        │
│  [Cancel]          [Confirm Adjust →]  │
└────────────────────────────────────────┘
```

### Summary Sections

**Header Section:**
| Field | Display |
|-------|---------|
| Reference | ADJ-YYYY-NNN |
| Warehouse | Warehouse name |
| Reason | Reason label |
| Date | Current date/time |

**Items Section:**
| Column | Display |
|--------|---------|
| Product | Product name |
| Change | Current → New (±diff) |
| Icon | ⬆️ or ⬇️ |

**Totals Section:**
| Metric | Calculation |
|--------|-------------|
| Products | Count of items |
| Net Change | Sum of differences |
| Increases | Sum positive diffs |
| Decreases | Sum negative diffs |

### Warning Conditions

| Condition | Warning Message |
|-----------|----------------|
| Depletion | "N products will be depleted to zero" |
| Large Decrease | "Large decrease of N units (>50%)" |
| Many Items | "Adjusting N products (>20)" |
| High Value | "Total value adjustment: LKR N" |

### Warning Display
```
⚠️ Product C will be depleted to zero stock.
⚠️ Large adjustment of 500 units (75% decrease).
⚠️ This will affect 25 products.
```

### Action Buttons

| Button | Style | Action |
|--------|-------|--------|
| Cancel | Secondary | Close dialog, no action |
| Confirm | Primary (Red) | Submit adjustment |

### Confirmation Flow

| Step | Action |
|------|--------|
| 1 | User clicks Submit in form |
| 2 | Dialog opens with summary |
| 3 | User reviews details |
| 4 | User clicks Confirm |
| 5 | Dialog shows loading |
| 6 | API call executed |
| 7 | Dialog closes on success |

### Expected Outcome
- Clear confirmation dialog
- Complete summary display
- Warning for critical actions
- Cancel option available

### Verification
- [ ] Dialog displays correctly
- [ ] Summary is accurate
- [ ] Warnings show when needed
- [ ] Confirm triggers submission

---

## Summary

This document completed the stock adjustments functionality, including:

✓ Dynamic items section with add/remove  
✓ Product search with warehouse filtering  
✓ Item rows with quantity controls  
✓ Visual difference display with colors  
✓ Optional per-item notes  
✓ Complete submission workflow  
✓ Confirmation dialog with summary  

The adjustment feature is now complete with a user-friendly wizard that guides users through creating accurate stock adjustments with proper validation and confirmation.

---

**Completion Checklist:**
- [ ] Items section working
- [ ] Product search functioning
- [ ] Quantity inputs validated
- [ ] Differences calculating correctly
- [ ] Notes optional and working
- [ ] Submission processing
- [ ] Confirmation dialog displaying
- [ ] Success navigation working
- [ ] Error handling implemented
- [ ] Loading states showing

**Group D Complete!** Ready for Group E: Warehouse Transfers.
