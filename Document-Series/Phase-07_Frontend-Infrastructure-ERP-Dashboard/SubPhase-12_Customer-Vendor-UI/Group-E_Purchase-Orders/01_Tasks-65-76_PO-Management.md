# Tasks 65-76: PO Management

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** E - Purchase Orders  
> **Document:** 01 of 02  
> **Tasks Covered:** 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-77-80_PO-Receiving.md](02_Tasks-77-80_PO-Receiving.md)

---

## Document Overview

This document covers the creation of purchase order (PO) listing page, PO details page with line items, and receiving functionality for tracking inventory receipt.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create PO List Page | Low | 20 min |
| 68 | Create PO Header | Low | 15 min |
| 69 | Create PO Filters | Low | 20 min |
| 70 | Create PO Table | Medium | 30 min |
| 71 | Define PO Table Columns | Medium | 25 min |
| 72 | Create PO Status Badge | Low | 15 min |
| 73 | Create PO Details Page | Medium | 25 min |
| 74 | Create PO Header Section | Low | 20 min |
| 75 | Create PO Items Table | Medium | 30 min |
| 76 | Create Receive Items Action | Medium | 30 min |

---

## Task 67: Create PO List Page

### Overview
Create POList component for purchase orders listing page showing all POs with filters.

### Dependencies
- Group A (Task 08): PO route exists

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/PurchaseOrders/` directory
   - Create new file `POList.tsx`

2. **Set up component structure:**
   - POHeader (Task 68)
   - POFilters (Task 69)
   - POTable (Task 70)

3. **Manage filter state:**
   - vendorFilter, statusFilter, dateRangeFilter

4. **Fetch PO data:**
   - Use usePurchaseOrders hook
   - Apply filters

### Expected Outcome
- PO list page container created
- Layout structure established

### Verification Checklist
- [ ] POList.tsx file created
- [ ] Component renders correctly
- [ ] Layout organized properly

---

## Task 68: Create PO Header

### Overview
Create POHeader component with title and "Create PO" button.

### Dependencies
- Task 67: PO List Page created

### Instructions

1. **Create component file**
   - Create new file `POHeader.tsx`

2. **Implement header:**
   - Title: "Purchase Orders"
   - Action button: "Create PO" (navigate to /purchase-orders/new)

### Expected Outcome
- Header displays correctly
- Create button navigates

### Verification Checklist
- [ ] POHeader.tsx file created
- [ ] Navigation works

---

## Task 69: Create PO Filters

### Overview
Create POFilters toolbar with vendor, status, and date filters.

### Dependencies
- Task 68: PO Header created

### Instructions

1. **Create component file**
   - Create new file `POFilters.tsx`

2. **Add filters:**
   - **Vendor**: Search select (autocomplete)
   - **Status**: Dropdown (All, Draft, Sent, Partial, Received, Cancelled)
   - **Date Range**: Date picker (from/to dates)

3. **Add clear filters button**

### Filter Layout

```
┌─────────────────────────────────────────────┐
│ [Vendor Search▼] [Status▼] [Date Range▼]   │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Filters display and work correctly
- Vendor search autocompletes

### Verification Checklist
- [ ] POFilters.tsx file created
- [ ] All filters functional

---

## Task 70: Create PO Table

### Overview
Create POTable component using TanStack Table for displaying purchase orders.

### Dependencies
- Task 69: PO Filters created

### Instructions

1. **Create component file**
   - Create new file `POTable.tsx`

2. **Initialize TanStack Table:**
   - Configure columns (Task 71)
   - Set up sorting and pagination

3. **Create table structure:**
   - Table header
   - Table rows
   - Empty state

### Expected Outcome
- PO table displays data
- Sorting and pagination work

### Verification Checklist
- [ ] POTable.tsx file created
- [ ] Table renders data
- [ ] Pagination functional

---

## Task 71: Define PO Table Columns

### Overview
Define column configuration for PO table including PO number, vendor, date, items, total, and status.

### Dependencies
- Task 70: PO Table created

### Instructions

1. **Create column definitions file**
   - Create new file `POTableColumns.tsx`

2. **Define PurchaseOrder interface**

3. **Create columns:**
   - **PO #**: Link to details, format: PO-XXXX
   - **Vendor**: Vendor name, link to vendor profile
   - **Date**: Order date, formatted
   - **Items**: Count of line items
   - **Total (LKR)**: Formatted currency
   - **Status**: Badge component (Task 72)
   - **Actions**: View details

### Column Layout

```
┌──────────────────────────────────────────────────────┐
│ PO #     Vendor      Date      Items  Total   Status│
├──────────────────────────────────────────────────────┤
│ PO-001   ABC Supply  Jan 15   5      ₨125K [Received]│
│ PO-002   XYZ Traders Jan 12   3      ₨85K  [Partial] │
└──────────────────────────────────────────────────────┘
```

### Expected Outcome
- All columns defined correctly
- Links navigate properly

### Verification Checklist
- [ ] POTableColumns.tsx file created
- [ ] All columns render
- [ ] Links functional

---

## Task 72: Create PO Status Badge

### Overview
Create POStatusBadge component for displaying purchase order status with appropriate colors.

### Dependencies
- Task 71: PO columns defined

### Instructions

1. **Create component file**
   - Create new file `POStatusBadge.tsx`

2. **Define status configurations:**
   - **Draft**: Gray - Not sent to vendor
   - **Sent**: Blue - Sent, awaiting receipt
   - **Partial**: Yellow - Some items received
   - **Received**: Green - Fully received
   - **Cancelled**: Red - Cancelled order

3. **Implement badge component:**
   - Accept status prop
   - Return Badge with appropriate color

### Status Badge Styles

| Status | Color | Description |
|--------|-------|-------------|
| Draft | Gray | Not yet sent |
| Sent | Blue | Sent to vendor |
| Partial | Yellow | Partially received |
| Received | Green | Fully received |
| Cancelled | Red | Cancelled |

### Expected Outcome
- Status badges display correctly
- Colors match status

### Verification Checklist
- [ ] POStatusBadge.tsx file created
- [ ] All statuses render
- [ ] Colors correct

---

## Task 73: Create PO Details Page

### Overview
Create PODetails component showing purchase order details with line items and receiving status.

### Dependencies
- Group A (Task 09): PO details route exists

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/PurchaseOrders/PODetails/` directory
   - Create new file `PODetails.tsx`

2. **Fetch PO data:**
   - Use usePurchaseOrder(id) hook
   - Handle loading and errors

3. **Create page layout:**
   - POHeaderSection (Task 74)
   - POItemsTable (Task 75)
   - Order notes section
   - Receiving history

4. **Add action buttons:**
   - Receive Items (Task 76)
   - Edit PO (if draft)
   - Cancel PO

### Expected Outcome
- PO details page displays information
- Data fetches correctly

### Verification Checklist
- [ ] PODetails.tsx file created
- [ ] Data fetches and displays
- [ ] Layout organized

---

## Task 74: Create PO Header Section

### Overview
Create POHeaderSection component displaying PO number, vendor, status, and key dates.

### Dependencies
- Task 73: PO Details Page created

### Instructions

1. **Create component file**
   - Create new file `POHeaderSection.tsx`

2. **Display PO information:**
   - PO number (large, prominent)
   - Vendor name (link to vendor)
   - Status badge
   - Order date
   - Expected delivery date
   - Total amount

3. **Add action buttons:**
   - Receive Items button (if not fully received)
   - Edit button (if draft)
   - More options dropdown

### Header Layout

```
┌─────────────────────────────────────────────┐
│ ← Back                                      │
│                                             │
│ PO-001                     [Receive Items]  │
│ ABC Suppliers Ltd          [⋮ More]         │
│ Status: [Partial]                           │
│                                             │
│ Order Date: Jan 15, 2024                    │
│ Expected: Jan 25, 2024                      │
│ Total: ₨125,000                            │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Header displays PO key information
- Action buttons functional

### Verification Checklist
- [ ] POHeaderSection.tsx file created
- [ ] PO info displays correctly
- [ ] Buttons work

---

## Task 75: Create PO Items Table

### Overview
Create POItemsTable component displaying line items with quantities ordered, received, and pending.

### Dependencies
- Task 74: PO Header Section created

### Instructions

1. **Create component file**
   - Create new file `POItemsTable.tsx`

2. **Create items table columns:**
   - **Product**: Name and SKU
   - **Ordered**: Quantity ordered
   - **Received**: Quantity received so far
   - **Pending**: Remaining (calculated)
   - **Unit Cost**: Price per unit
   - **Total**: Line total

3. **Calculate totals:**
   - Subtotal
   - Tax (if applicable)
   - Total amount

4. **Add receiving status indicators:**
   - Green checkmark for fully received items
   - Yellow indicator for partial
   - Gray for not received

### Items Table Layout

```
┌──────────────────────────────────────────────────────┐
│ Product      SKU     Ordered Recv'd Pending Cost Total│
├──────────────────────────────────────────────────────┤
│ Widget A     WA-001  100     80     20    ₨1K  ₨100K│
│ ✓ Partial                                            │
│ Widget B     WB-002  50      0      50    ₨2K  ₨100K│
│ ○ Pending                                            │
├──────────────────────────────────────────────────────┤
│ Subtotal:                                   ₨200,000 │
│ Tax (18%):                                   ₨36,000 │
│ Total:                                      ₨236,000 │
└──────────────────────────────────────────────────────┘
```

### Expected Outcome
- Items table displays line items
- Calculations correct
- Status indicators show

### Verification Checklist
- [ ] POItemsTable.tsx file created
- [ ] Items display correctly
- [ ] Calculations accurate
- [ ] Status indicators work

---

## Task 76: Create Receive Items Action

### Overview
Create ReceiveItemsModal component for marking items as received and updating inventory.

### Dependencies
- Task 75: PO Items Table created

### Instructions

1. **Create component file**
   - Create new file `ReceiveItemsModal.tsx`

2. **Create receiving form:**
   - Display each line item
   - Show ordered quantity
   - Show previously received
   - Input for receiving now
   - Notes field

3. **Validate receiving quantities:**
   - Cannot exceed pending quantity
   - Must be positive number
   - At least one item must have quantity

4. **Implement partial receiving:**
   - Allow receiving partial quantities
   - Update received quantities
   - Recalculate pending
   - Update PO status

5. **Add receiving notes:**
   - General notes field
   - Item-specific notes
   - Condition notes (damaged, etc.)

6. **Handle submission:**
   - Validate quantities
   - Call receive API
   - Update PO data
   - Show success message
   - Update inventory

### Receive Modal Layout

```
┌─────────────────────────────────────────────┐
│ Receive Items - PO-001                [✕]   │
├─────────────────────────────────────────────┤
│                                             │
│ Widget A (SKU: WA-001)                      │
│ Ordered: 100  |  Received: 80  |  Pending: 20
│                                             │
│ Receiving Now:                              │
│ ┌─────────┐                                 │
│ │   20    │  (Max: 20)                      │
│ └─────────┘                                 │
│                                             │
│ ────────────────────────────────────────────│
│                                             │
│ Widget B (SKU: WB-002)                      │
│ Ordered: 50  |  Received: 0  |  Pending: 50 │
│                                             │
│ Receiving Now:                              │
│ ┌─────────┐                                 │
│ │   25    │  (Max: 50)                      │
│ └─────────┘                                 │
│                                             │
│ ────────────────────────────────────────────│
│                                             │
│ Notes                                       │
│ ┌─────────────────────────────────────┐    │
│ │ All items in good condition         │    │
│ └─────────────────────────────────────┘    │
│                                             │
│              [Cancel]    [Receive Items]    │
└─────────────────────────────────────────────┘
```

### Receiving Logic

```
Receiving Process:
1. Display pending items
2. User enters quantities
3. Validate against pending
4. Submit to API
5. Update inventory
6. Update PO status
7. Refresh PO data
```

### Expected Outcome
- Receive modal allows partial receiving
- Quantities validated correctly
- Submission updates PO and inventory
- Success message shows

### Verification Checklist
- [ ] ReceiveItemsModal.tsx file created
- [ ] Modal displays line items
- [ ] Quantity inputs work
- [ ] Validation functional
- [ ] Submission works
- [ ] PO status updates
- [ ] Inventory updated
- [ ] Success message displays

---

## Summary

This document created purchase order management with listing, details, and receiving functionality. The following were implemented:

### PO List
- POList - Main container
- POHeader - Title and actions
- POFilters - Vendor, status, date filters
- POTable - Data table
- POTableColumns - Column definitions
- POStatusBadge - Status display with colors

### PO Details
- PODetails - Details page
- POHeaderSection - PO information
- POItemsTable - Line items with receiving status
- ReceiveItemsModal - Partial receiving functionality

### Features
- Filter POs by vendor, status, date
- View detailed PO information
- Track receiving status per item
- Partial receiving support
- Inventory updates on receipt

The next document will complete PO functionality with the creation form and API integration.
