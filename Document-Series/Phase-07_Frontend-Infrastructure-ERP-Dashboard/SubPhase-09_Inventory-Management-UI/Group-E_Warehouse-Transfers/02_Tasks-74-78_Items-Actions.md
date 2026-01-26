# Tasks 74-78: Transfer Items & Actions

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 09 - Inventory Management UI  
> **Group:** E - Warehouse Transfers  
> **Document:** 02 of 02  
> **Tasks Covered:** 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-65-73_List-WarehouseSelects.md](01_Tasks-65-73_List-WarehouseSelects.md)

---

## Document Overview

This document covers the transfer items section where users select products to transfer, check stock availability at the source warehouse, input transfer quantities, submit the transfer, and receive transfers at the destination warehouse.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 74 | Create Transfer Items Section | Medium | 30 min |
| 75 | Create Stock Availability Check | Medium | 30 min |
| 76 | Create Transfer Quantity Input | Low | 20 min |
| 77 | Create Submit Transfer | Medium | 30 min |
| 78 | Create Receive Transfer Action | Medium | 30 min |

---

## Task 74: Create Transfer Items Section

### Overview
Create the main items section container where users can add multiple products to the transfer with quantity validation and stock availability checks.

### Dependencies
- Task 70: Create New Transfer Page
- Task 71: Create Transfer Form Schema

### Instructions

1. **Create component file:** Create `TransferItems.tsx` in Transfers directory
2. **Import form dependencies:** React Hook Form, useFieldArray
3. **Define component props:** Accept form control, register, errors, sourceWarehouseId
4. **Set up field array:** Use useFieldArray for dynamic items
5. **Create section layout:** Header with add button, items list
6. **Add empty state:** Show message when no items added
7. **Implement add item:** Add new row to field array
8. **Implement remove item:** Remove row from field array
9. **Calculate totals:** Sum of all quantities and total items
10. **Validate source:** Require source warehouse before adding items
11. **Style section:** Card layout with proper spacing
12. **Export component:** Export with types

### Section Structure
```
┌────────────────────────────────────────────────────────┐
│  Transfer Items                    [+ Add Product]     │
├────────────────────────────────────────────────────────┤
│  Product       │ Available │ Transfer │ Actions        │
├────────────────────────────────────────────────────────┤
│  [Search/Select]│     -    │    -     │  [Remove]      │
│                                                        │
│  Product A     │   100    │   [20]   │  [Remove]      │
│  SKU: ABC-001  │   units  │  units   │                │
│                                                        │
│  Product B     │    50    │   [15]   │  [Remove]      │
│  SKU: XYZ-002  │   units  │  units   │                │
├────────────────────────────────────────────────────────┤
│  Total: 2 products │ Total Quantity: 35 units          │
└────────────────────────────────────────────────────────┘
```

### Section Features

| Feature | Description | Behavior |
|---------|-------------|----------|
| Add Product | Button to add item row | Opens product search |
| Item Rows | Dynamic list of products | Can be removed |
| Available Qty | Stock at source warehouse | Read-only, from API |
| Transfer Qty | Input for quantity to transfer | User enters, validated |
| Remove | Delete item button | Confirms before removing |

### Empty State
```
┌────────────────────────────────────────┐
│  Transfer Items                        │
├────────────────────────────────────────┤
│                                        │
│  ⚠️  Select source warehouse first     │
│                                        │
│      Before adding products, you       │
│      must select a source warehouse    │
│                                        │
└────────────────────────────────────────┘

After source selected:
┌────────────────────────────────────────┐
│  Transfer Items                        │
├────────────────────────────────────────┤
│                                        │
│         No products added              │
│                                        │
│         Click "Add Product" to         │
│         add items to transfer          │
│                                        │
│         [+ Add Product]                │
│                                        │
└────────────────────────────────────────┘
```

### Validation Requirements

| Rule | Check | Error |
|------|-------|-------|
| Source Required | Source warehouse selected | "Select source warehouse first" |
| Min Items | At least 1 item | "Add at least one product" |
| Unique Products | No duplicate product_id | "Product already added" |
| Valid Quantity | transfer_qty > 0 | "Quantity must be greater than 0" |
| Stock Available | transfer_qty <= available_qty | "Exceeds available stock" |

### Totals Display

| Metric | Calculation | Display |
|--------|-------------|---------|
| Products | Count of items | "2 products" |
| Total Quantity | Sum all transfer quantities | "35 units" |
| Total Value | Sum of item values | "LKR 125,000" |

### Expected Outcome
- Dynamic items section
- Add/remove functionality
- Stock validation
- Totals calculation

### Verification
- [ ] Can add items
- [ ] Can remove items
- [ ] Stock checks work
- [ ] Totals calculate correctly

---

## Task 75: Create Stock Availability Check

### Overview
Create a component that checks and displays real-time stock availability at the source warehouse for selected products.

### Dependencies
- Task 74: Create Transfer Items Section

### Instructions

1. **Create component file:** Create `StockAvailability.tsx`
2. **Define component props:** Accept productId, warehouseId, onStockLoaded
3. **Create API hook:** Fetch stock data for product at warehouse
4. **Display availability:** Show current stock level
5. **Add loading state:** Show skeleton while loading
6. **Add error handling:** Display error if stock check fails
7. **Show status indicator:** Color-coded availability status
8. **Add refresh button:** Manual refresh of stock data
9. **Implement auto-refresh:** Optional periodic refresh
10. **Style component:** Clean, inline display
11. **Export component:** Export with types

### Availability Display
```
Available at Main Warehouse:
┌────────────────────────────────────────┐
│  ✓ 100 units available                 │
│  Last updated: 2 minutes ago    [↻]    │
└────────────────────────────────────────┘

Low stock:
┌────────────────────────────────────────┐
│  ⚠️ Only 5 units available             │
│  Last updated: 2 minutes ago    [↻]    │
└────────────────────────────────────────┘

Out of stock:
┌────────────────────────────────────────┐
│  ✗ Out of stock                        │
│  Last updated: 2 minutes ago    [↻]    │
└────────────────────────────────────────┘

Loading:
┌────────────────────────────────────────┐
│  Loading availability...               │
└────────────────────────────────────────┘
```

### Availability Levels

| Stock Level | Color | Icon | Text | Status |
|-------------|-------|------|------|--------|
| > 100 | Green | CheckCircle | "N units available" | Good |
| 11-100 | Yellow | AlertCircle | "N units available" | Adequate |
| 1-10 | Orange | AlertTriangle | "Only N units" | Low |
| 0 | Red | XCircle | "Out of stock" | Unavailable |

### Component Features

| Feature | Description |
|---------|-------------|
| Real-time Check | Query API for current stock |
| Color Coding | Visual stock level indication |
| Last Updated | Timestamp of stock data |
| Refresh Button | Manual stock refresh |
| Auto-refresh | Optional 30s interval |
| Error Handling | Display connection errors |

### API Integration
```
Endpoint: GET /api/inventory/stock
Query params:
  - product_id: UUID
  - warehouse_id: UUID
  
Response:
{
  product_id: "uuid",
  warehouse_id: "uuid",
  quantity: 100,
  reserved: 10,
  available: 90,
  unit: "units",
  updated_at: "2026-01-26T10:30:00Z"
}
```

### Availability Calculation
```
Available = Quantity - Reserved
Example: 100 - 10 = 90 units available

If Available >= TransferQty: OK
If Available < TransferQty: Error
```

### Loading States

| State | Display |
|-------|---------|
| Loading | Skeleton with animation |
| Success | Stock info with color |
| Error | Error message + retry |
| Stale | Gray indicator + refresh |

### Expected Outcome
- Real-time stock availability
- Visual status indicators
- Refresh capability
- Error handling

### Verification
- [ ] Stock data loads
- [ ] Colors match levels
- [ ] Refresh works
- [ ] Errors display

---

## Task 76: Create Transfer Quantity Input

### Overview
Create a specialized quantity input component with validation, increment/decrement controls, and max value based on available stock.

### Dependencies
- Task 74: Create Transfer Items Section
- Task 75: Create Stock Availability Check

### Instructions

1. **Create component file:** Create `TransferQuantityInput.tsx`
2. **Define component props:** Accept value, onChange, availableQty, unit, error
3. **Create input field:** Number input with validation
4. **Add control buttons:** +/-, +10/-10 quick controls
5. **Set max value:** Limit to available quantity
6. **Show validation:** Display errors inline
7. **Add visual feedback:** Highlight on validation error
8. **Implement quick set:** "Max" button to set to available
9. **Format display:** Show unit after value
10. **Style component:** Integrated control design
11. **Export component:** Export with types

### Input Layout
```
┌────────────────────────────────────────┐
│  Transfer Quantity *                   │
│  [-10] [-1] [ 20 ] units [+1] [+10]    │
│           [Max: 100]                   │
│                                        │
│  ✓ Valid quantity                      │
└────────────────────────────────────────┘

Error state:
┌────────────────────────────────────────┐
│  Transfer Quantity *                   │
│  [-10] [-1] [ 150 ] units [+1] [+10]   │
│           [Max: 100]                   │
│                                        │
│  ✗ Exceeds available stock (100 units) │
└────────────────────────────────────────┘
```

### Control Buttons

| Button | Action | Enabled When |
|--------|--------|--------------|
| -10 | Decrease by 10 | value >= 11 |
| -1 | Decrease by 1 | value >= 2 |
| Input | Manual entry | Always |
| +1 | Increase by 1 | value < available |
| +10 | Increase by 10 | value < available - 9 |
| Max | Set to available | value < available |

### Input Validation

| Rule | Check | Error Message |
|------|-------|---------------|
| Required | value > 0 | "Quantity is required" |
| Positive | value > 0 | "Must be greater than 0" |
| Max Stock | value <= available | "Exceeds available: N units" |
| Integer | No decimals | "Must be whole number" |

### Quick Set Feature
```
[Max] button sets value to available quantity
Example: Available = 100
Click [Max] → Input = 100
```

### Visual States

| State | Border | Background | Text |
|-------|--------|------------|------|
| Default | Gray | White | Black |
| Focus | Blue | White | Black |
| Valid | Green | White | Black |
| Error | Red | Red-50 | Red-700 |
| Disabled | Gray | Gray-50 | Gray-400 |

### Component Features

| Feature | Implementation |
|---------|----------------|
| Type | Number input |
| Min | 1 |
| Max | Available quantity |
| Step | 1 |
| Controls | Quick +/- buttons |
| Max Button | Set to available |
| Validation | Real-time |
| Unit Display | After value |

### Expected Outcome
- Functional quantity input
- Quick control buttons
- Max value enforcement
- Clear validation feedback

### Verification
- [ ] Input accepts numbers
- [ ] Controls work
- [ ] Max enforced
- [ ] Validation displays

---

## Task 77: Create Submit Transfer

### Overview
Create the submission logic for processing the completed transfer form, including validation, API call, and success handling.

### Dependencies
- Task 74: Create Transfer Items Section
- Task 71: Create Transfer Form Schema

### Instructions

1. **Create submission handler:** In TransferForm component
2. **Import API functions:** Create transfer API endpoint
3. **Validate form:** Ensure all fields pass Zod validation
4. **Validate warehouses:** Ensure source != destination
5. **Validate items:** Check at least one item, stock available
6. **Show confirmation:** Optional confirmation dialog
7. **Prepare payload:** Format data for API
8. **Call API:** Submit transfer data
9. **Handle loading:** Show loading state during submission
10. **Handle success:** Show success message, navigate to list
11. **Handle errors:** Display error messages appropriately
12. **Implement retry:** Allow retry on network errors
13. **Track analytics:** Log transfer creation event

### Submission Flow
```
1. User clicks "Create Transfer"
   ↓
2. Validate form data
   ↓
3. Check stock availability (final)
   ↓
4. Show loading state
   ↓
5. Call API endpoint
   ↓
6. Success: Navigate to list + success message
   Error: Show error + retry option
```

### Validation Checklist

| Check | Validation | Error Message |
|-------|------------|---------------|
| Source | Required, valid UUID | "Select source warehouse" |
| Destination | Required, != source | "Select destination (different from source)" |
| Items | Min 1 item | "Add at least one product" |
| Quantities | All > 0, <= available | "Invalid quantities" |
| Unique Products | No duplicates | "Product already added" |

### API Payload Structure
```
{
  reference: "TRF-2026-001",
  source_warehouse_id: "uuid",
  destination_warehouse_id: "uuid",
  expected_date: "2026-01-30",  // optional
  notes: "Optional transfer notes",
  items: [
    {
      product_id: "uuid",
      transfer_quantity: 20,
      unit: "units"
    }
  ],
  status: "pending"
}
```

### Loading States

| State | Button | Message |
|-------|--------|---------|
| Idle | "Create Transfer" | - |
| Validating | "Validating..." | Disabled button |
| Checking Stock | "Checking stock..." | Disabled button |
| Submitting | "Creating..." | Disabled, spinner |
| Success | "Success!" | 2s then redirect |
| Error | "Create Transfer" | Error message below |

### Success Handling

| Action | Description |
|--------|-------------|
| Show Toast | "Transfer created successfully" |
| Update State | Mark form as submitted |
| Navigate | Redirect to transfers list |
| Refresh | Update list with new transfer |
| Clear Form | Reset form state |

### Error Handling

| Error Type | Message | Action |
|------------|---------|--------|
| Validation | Field-specific errors | Show inline |
| Stock Check | "Insufficient stock: N units short" | Highlight items |
| Network | "Connection error. Please retry." | Retry button |
| Server | Server error message | Contact support |
| Duplicate | "Transfer reference exists" | Generate new ref |
| Warehouse | "Warehouse validation failed" | Re-check selection |

### Stock Validation (Final Check)
```
Before submission:
- Re-query stock for all items
- Ensure quantities still available
- Show warning if stock changed
- Allow user to adjust or proceed
```

### Expected Outcome
- Complete submission flow
- Proper validation
- Stock verification
- Error handling
- Success navigation

### Verification
- [ ] Validation works
- [ ] Stock checks pass
- [ ] API call succeeds
- [ ] Success redirects
- [ ] Errors display properly

---

## Task 78: Create Receive Transfer Action

### Overview
Create the action for destination warehouse staff to confirm receipt of transferred items, updating transfer status and stock levels.

### Dependencies
- Task 67: Create Transfers Table
- Transfers list with In Transit status

### Instructions

1. **Add receive button:** In table actions column, for In Transit transfers
2. **Create receive dialog:** Confirmation dialog with transfer details
3. **Show items list:** Display all items in the transfer
4. **Add quantity verification:** Allow adjusting received quantities
5. **Add condition notes:** Optional notes about item condition
6. **Implement receive API:** Call receive endpoint
7. **Update status:** Change transfer to Received
8. **Update stock:** Increase destination warehouse stock
9. **Handle discrepancies:** Log if received != transferred
10. **Show success message:** Confirm successful receipt
11. **Refresh table:** Update transfer list
12. **Export component:** Export dialog component

### Receive Button Display

| Transfer Status | Button Shown | Button Text | Icon |
|----------------|--------------|-------------|------|
| Pending | No | - | - |
| In Transit | Yes | "Receive" | PackageCheck |
| Received | No | - | - |
| Cancelled | No | - | - |

### Receive Dialog
```
┌────────────────────────────────────────┐
│  Receive Transfer - TRF-2026-001   [✕] │
├────────────────────────────────────────┤
│  From: Main Warehouse                  │
│  To: Branch 1                          │
│  Sent: Jan 26, 2026                    │
│                                        │
│  Items to Receive:                     │
│  ┌──────────────────────────────────┐  │
│  │ Product    │ Sent │ Received    │  │
│  │ Product A  │  20  │ [20] units  │  │
│  │ Product B  │  15  │ [15] units  │  │
│  └──────────────────────────────────┘  │
│                                        │
│  Condition Notes (Optional):           │
│  [All items in good condition]         │
│                                        │
│  [Cancel]        [Confirm Receipt →]   │
└────────────────────────────────────────┘
```

### Items Verification Table

| Column | Display | Editable |
|--------|---------|----------|
| Product | Name + SKU | No |
| Sent | Original quantity | No |
| Received | Input field | Yes |
| Difference | Calculated | No |
| Condition | Notes field | Yes |

### Quantity Adjustment
```
If Received != Sent:
┌────────────────────────────────────────┐
│  ⚠️ Quantity Mismatch                  │
│                                        │
│  Product A:                            │
│  Expected: 20 units                    │
│  Received: 18 units                    │
│  Difference: -2 units                  │
│                                        │
│  Please provide reason:                │
│  [2 units damaged during transit]      │
└────────────────────────────────────────┘
```

### API Payload
```
{
  transfer_id: "uuid",
  received_at: "2026-01-26T14:30:00Z",
  items: [
    {
      product_id: "uuid",
      transferred_quantity: 20,
      received_quantity: 18,
      condition_notes: "2 units damaged"
    }
  ],
  general_notes: "All items received",
  received_by: "current_user_id"
}
```

### Receive Flow
```
1. User clicks "Receive" on transfer
   ↓
2. Dialog opens with transfer details
   ↓
3. User verifies/adjusts quantities
   ↓
4. User adds condition notes (if needed)
   ↓
5. User clicks "Confirm Receipt"
   ↓
6. API updates transfer status to Received
   ↓
7. Stock updated at destination warehouse
   ↓
8. If discrepancy: Create adjustment record
   ↓
9. Success message + table refresh
```

### Discrepancy Handling

| Case | Action |
|------|--------|
| Received = Sent | Normal completion |
| Received < Sent | Create loss adjustment at source |
| Received > Sent | Not allowed, cap at sent |
| Damaged | Create damage adjustment |

### Success Handling

| Action | Description |
|--------|-------------|
| Update Status | Transfer marked as Received |
| Update Stock | Add quantities to destination |
| Create Record | Receipt record created |
| Notify | Optional notification to sender |
| Log | Activity logged |
| Refresh | Table updates |

### Expected Outcome
- Functional receive action
- Quantity verification
- Discrepancy handling
- Stock updates
- Status changes

### Verification
- [ ] Receive button shows for In Transit
- [ ] Dialog displays correctly
- [ ] Quantities can be adjusted
- [ ] API call succeeds
- [ ] Stock updates
- [ ] Status changes to Received

---

## Summary

This document completed the warehouse transfers functionality, including:

✓ Dynamic items section with stock checks  
✓ Real-time stock availability display  
✓ Quantity input with validation and controls  
✓ Complete submission workflow with stock verification  
✓ Receive transfer action for destination warehouse  
✓ Quantity verification and discrepancy handling  
✓ Stock updates at both warehouses  

The warehouse transfer feature is now complete with a comprehensive workflow from creation to receipt, including real-time stock validation and proper handling of discrepancies.

---

**Completion Checklist:**
- [ ] Items section working
- [ ] Stock checks functioning
- [ ] Quantity inputs validated
- [ ] Submission processing
- [ ] Receive action working
- [ ] Status updates correctly
- [ ] Stock levels update
- [ ] Discrepancies handled
- [ ] Error handling implemented
- [ ] Success notifications showing

**Group E Complete!** Ready for Group F: Warehouse Management & Testing.
