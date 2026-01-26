# Tasks 77-80: PO Form and API Integration

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** E - Purchase Orders  
> **Document:** 02 of 02  
> **Tasks Covered:** 77, 78, 79, 80

---

## Navigation

- **← Previous Document:** [01_Tasks-65-76_PO-Management.md](01_Tasks-65-76_PO-Management.md)
- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Group:** [../Group-F_Import-Export-Testing/00_GROUP_OVERVIEW.md](../Group-F_Import-Export-Testing/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document covers the creation of the purchase order form, API integration, and complete PO workflow implementation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 77 | Create New PO Page | Medium | 25 min |
| 78 | Create PO Form Schema | Medium | 30 min |
| 79 | Create PO Items Section | High | 40 min |
| 80 | Connect POs to API | Medium | 30 min |

---

## Task 77: Create New PO Page

### Overview
Create new purchase order page with vendor selection and line items.

### Dependencies
- Group A (Task 10): New PO route exists
- Group D: Vendor data available

### Instructions

1. **Create component file**
   - Navigate to `frontend/components/modules/crm/PurchaseOrders/` directory
   - Create new file `POForm.tsx`

2. **Set up React Hook Form:**
   - Use useForm with Zod schema (Task 78)
   - Configure form state

3. **Create form layout:**
   - Page header with title "Create Purchase Order"
   - VendorSelectForPO (vendor selector)
   - Expected delivery date picker
   - POItemsSection (Task 79)
   - Notes textarea
   - Action buttons (Save Draft, Submit)

4. **Handle form submission:**
   - Validate all fields
   - Calculate totals
   - Submit to API (Task 80)
   - Navigate to PO details on success

### Form Layout

```
┌─────────────────────────────────────────────┐
│ ← Back to Purchase Orders                   │
│                                             │
│ Create Purchase Order                       │
│                                             │
│ Vendor *                                    │
│ ┌─────────────────────────────────────┐    │
│ │ Select vendor...                  ▼ │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Expected Delivery Date                      │
│ ┌─────────────────────────────────────┐    │
│ │ MM/DD/YYYY                        📅 │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Line Items *                                │
│ [Items Section - Task 79]                   │
│                                             │
│ Notes                                       │
│ ┌─────────────────────────────────────┐    │
│ │                                     │    │
│ │                                     │    │
│ └─────────────────────────────────────┘    │
│                                             │
│           [Save Draft]  [Create PO]         │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- New PO form renders correctly
- Form validation works
- Submit creates PO

### Verification Checklist
- [ ] POForm.tsx file created
- [ ] Form renders properly
- [ ] Validation functional
- [ ] Submit works

---

## Task 78: Create PO Form Schema

### Overview
Create Zod validation schema for purchase order form with vendor, dates, and items validation.

### Dependencies
- Task 77: PO Form created

### Instructions

1. **Create schema file**
   - Create new file `po-schema.ts` in schemas directory

2. **Define POItem schema:**
   - product_id (required)
   - product_name (for display)
   - sku (for display)
   - quantity (min: 1, required)
   - unit_cost (min: 0, required)
   - line_total (calculated field)

3. **Define PurchaseOrder schema:**
   - vendor_id (required)
   - expected_delivery_date (required, must be future date)
   - items (array of POItem, min length: 1)
   - notes (optional, max 1000 chars)
   - subtotal (calculated)
   - tax_amount (calculated)
   - total_amount (calculated)

4. **Add custom validations:**
   - At least one line item required
   - Expected date must be in future
   - Quantities must be positive
   - Costs must be non-negative

### Schema Structure

```
PurchaseOrderSchema:
- vendor_id: string (required)
- expected_delivery_date: date (required, future)
- items: array (min: 1)
  - product_id: string (required)
  - product_name: string
  - sku: string
  - quantity: number (min: 1)
  - unit_cost: number (min: 0)
  - line_total: number
- notes: string (max: 1000)
- subtotal: number
- tax_amount: number
- total_amount: number
```

### Validation Rules

| Field | Rule | Message |
|-------|------|---------|
| vendor_id | Required | "Vendor is required" |
| expected_delivery_date | Required, Future | "Expected delivery date must be in the future" |
| items | Min 1 item | "At least one line item is required" |
| items.quantity | Min 1 | "Quantity must be at least 1" |
| items.unit_cost | Min 0 | "Unit cost must be non-negative" |
| notes | Max 1000 chars | "Notes cannot exceed 1000 characters" |

### Expected Outcome
- Schema validates PO data correctly
- Error messages display properly

### Verification Checklist
- [ ] po-schema.ts file created
- [ ] All fields validated
- [ ] Custom rules work
- [ ] Error messages clear

---

## Task 79: Create PO Items Section

### Overview
Create POItemsSection component for managing line items with product search, quantities, and automatic total calculations.

### Dependencies
- Task 78: PO Schema created

### Instructions

1. **Create component file**
   - Create new file `POItemsSection.tsx`

2. **Implement line items management:**
   - Display array of line items
   - Add item button
   - Remove item button per line

3. **Create line item row:**
   - Product search/select (searchable dropdown)
   - Quantity input (number)
   - Unit cost input (LKR)
   - Line total (calculated, read-only)
   - Remove button

4. **Implement product search:**
   - Searchable dropdown
   - Display product name and SKU
   - Filter by vendor's products
   - Show product's default cost

5. **Calculate line totals:**
   - Line total = quantity × unit cost
   - Update on quantity or cost change

6. **Calculate PO totals:**
   - Subtotal = sum of all line totals
   - Tax = subtotal × tax rate (18%)
   - Total = subtotal + tax
   - Display in summary section

7. **Handle empty state:**
   - Show "Add Item" button when no items
   - Minimum one item required

### Items Section Layout

```
┌─────────────────────────────────────────────┐
│ Line Items *                    [+ Add Item]│
├─────────────────────────────────────────────┤
│                                             │
│ Item 1                                  [✕] │
│ Product *                                   │
│ ┌─────────────────────────────────────┐    │
│ │ Search products...              ▼   │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Quantity *        Unit Cost (LKR) *         │
│ ┌─────────┐      ┌─────────────────┐       │
│ │   100   │      │    1,000        │       │
│ └─────────┘      └─────────────────┘       │
│                                             │
│ Line Total: ₨100,000                        │
│                                             │
│ ────────────────────────────────────────────│
│                                             │
│ Item 2                                  [✕] │
│ Product *                                   │
│ ┌─────────────────────────────────────┐    │
│ │ Widget B - WB-002               ▼   │    │
│ └─────────────────────────────────────┘    │
│                                             │
│ Quantity *        Unit Cost (LKR) *         │
│ ┌─────────┐      ┌─────────────────┐       │
│ │    50   │      │    2,000        │       │
│ └─────────┘      └─────────────────┘       │
│                                             │
│ Line Total: ₨100,000                        │
│                                             │
├─────────────────────────────────────────────┤
│ Subtotal:                        ₨200,000  │
│ Tax (18%):                        ₨36,000  │
│ ────────────────────────────────────────────│
│ Total:                           ₨236,000  │
└─────────────────────────────────────────────┘
```

### Item Management Logic

```
Add Item:
1. Click "+ Add Item"
2. New empty row appears
3. Focus on product search

Remove Item:
1. Click "✕" button on row
2. Confirm removal
3. Remove from array
4. Recalculate totals

Product Selection:
1. Type to search products
2. Filter by current vendor
3. Select product
4. Auto-fill SKU and default cost
5. Focus on quantity

Calculate Totals:
1. On quantity change → recalc line total
2. On cost change → recalc line total
3. On any line change → recalc subtotal
4. Recalc tax (18% of subtotal)
5. Recalc total (subtotal + tax)
```

### Expected Outcome
- Line items can be added/removed
- Product search filters by vendor
- Totals calculate automatically
- Validation works correctly

### Verification Checklist
- [ ] POItemsSection.tsx file created
- [ ] Add/remove items works
- [ ] Product search functional
- [ ] Calculations accurate
- [ ] Totals update automatically
- [ ] Validation displays errors

---

## Task 80: Connect POs to API

### Overview
Create React Query hooks for purchase order CRUD operations and receiving functionality.

### Dependencies
- Task 79: PO Items Section created
- SubPhase 05: TanStack Query configured

### Instructions

1. **Create hooks file**
   - Create new file `usePurchaseOrders.ts` in hooks directory

2. **Create query hooks:**
   - **usePurchaseOrders**: Get all POs with filters
   - **usePurchaseOrder**: Get single PO by ID
   - **usePOStats**: Get PO statistics

3. **Create mutation hooks:**
   - **useCreatePO**: Create new PO
   - **useUpdatePO**: Update draft PO
   - **useDeletePO**: Delete draft PO
   - **useReceiveItems**: Mark items as received

4. **Configure query keys:**
   - `['purchase-orders']` - All POs
   - `['purchase-orders', filters]` - Filtered POs
   - `['purchase-orders', id]` - Single PO
   - `['purchase-orders', 'stats']` - Statistics

5. **Handle optimistic updates:**
   - Update PO list on create
   - Update PO details on receive
   - Invalidate related queries

6. **Add error handling:**
   - Network errors
   - Validation errors
   - Authorization errors

### API Endpoints

| Hook | Method | Endpoint | Description |
|------|--------|----------|-------------|
| usePurchaseOrders | GET | `/api/purchase-orders/` | Get all POs |
| usePurchaseOrder | GET | `/api/purchase-orders/{id}/` | Get PO details |
| usePOStats | GET | `/api/purchase-orders/stats/` | Get statistics |
| useCreatePO | POST | `/api/purchase-orders/` | Create new PO |
| useUpdatePO | PUT | `/api/purchase-orders/{id}/` | Update PO |
| useDeletePO | DELETE | `/api/purchase-orders/{id}/` | Delete PO |
| useReceiveItems | POST | `/api/purchase-orders/{id}/receive/` | Receive items |

### Query Configuration

```
usePurchaseOrders:
- Query key: ['purchase-orders', filters]
- Stale time: 30 seconds
- Refetch on window focus
- Invalidate on mutations

usePurchaseOrder:
- Query key: ['purchase-orders', id]
- Stale time: 1 minute
- Enabled: !!id
- Invalidate on receive/update

useCreatePO:
- Invalidates: ['purchase-orders']
- Success: Navigate to PO details
- Error: Show toast

useReceiveItems:
- Invalidates: ['purchase-orders', id]
- Invalidates: ['inventory'] (if exists)
- Success: Show success toast
- Update: PO status, received quantities
```

### Hook Usage Examples

```
List POs:
const { data: pos, isLoading } = usePurchaseOrders({
  vendor: vendorFilter,
  status: statusFilter,
  date_from: startDate,
  date_to: endDate
});

Get PO:
const { data: po } = usePurchaseOrder(poId);

Create PO:
const createPO = useCreatePO();
createPO.mutate({
  vendor_id: "vendor123",
  expected_delivery_date: "2024-02-15",
  items: [
    { product_id: "prod1", quantity: 100, unit_cost: 1000 }
  ],
  notes: "Rush order"
});

Receive Items:
const receiveItems = useReceiveItems(poId);
receiveItems.mutate({
  items: [
    { line_item_id: "item1", quantity_received: 50 }
  ],
  notes: "Partial delivery"
});
```

### Expected Outcome
- All PO CRUD operations work
- Receiving updates inventory
- Queries invalidate correctly
- Optimistic updates display

### Verification Checklist
- [ ] usePurchaseOrders.ts file created
- [ ] All query hooks functional
- [ ] All mutation hooks functional
- [ ] Query invalidation works
- [ ] Optimistic updates display
- [ ] Error handling works
- [ ] Loading states show

---

## Summary

This document completed purchase order functionality with form creation and API integration. The following were implemented:

### PO Form
- POForm - New PO page with vendor and items
- PO validation schema with comprehensive rules
- POItemsSection - Dynamic line items with calculations

### Features
- Vendor selection with product filtering
- Dynamic line items (add/remove)
- Product search within vendor catalog
- Automatic total calculations
- Draft saving support
- Complete validation

### API Integration
- usePurchaseOrders - List with filters
- usePurchaseOrder - Get details
- usePOStats - Statistics
- useCreatePO - Create new PO
- useUpdatePO - Update draft
- useDeletePO - Delete draft
- useReceiveItems - Receive and update inventory

### Workflow
1. Create PO → Select vendor → Add items → Calculate totals → Submit
2. View PO → Track receiving status → Receive items → Update inventory
3. Filter POs by vendor, status, date range

Purchase order management is now complete. The next group covers import/export functionality and final testing.
