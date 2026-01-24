# Tasks 33-40: Bill Service Creation & Status Management

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** C - Bill Services & Processing  
> **Document:** 01 of 02  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [Group-B Document 02](../Group-B_Bill-Line-Items-Matching/02_Tasks-26-32_Matching-Service.md)
- **→ Next Document:** [02_Tasks-41-48_History-Settings-Duplicate-Dispute.md](02_Tasks-41-48_History-Settings-Duplicate-Dispute.md)

---

## Document Overview

This document covers the creation and implementation of the BillService class, which orchestrates all bill business logic and workflows. It includes methods for creating bills from purchase orders, manual bill creation, bill editing, status transitions, and approval workflows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create BillService Class | High | 30 min |
| 34 | Implement Create Bill from PO | High | 30 min |
| 35 | Implement Auto-Fill from PO/GRN | Medium | 25 min |
| 36 | Implement Manual Bill Creation | Medium | 25 min |
| 37 | Implement Bill Editing | Medium | 25 min |
| 38 | Implement Bill Status Transitions | High | 30 min |
| 39 | Add Status Transition Validation | Medium | 25 min |
| 40 | Implement Bill Approval Workflow | Medium | 25 min |

---

## Task 33: Create BillService Class

### Overview
Create the BillService class that serves as the central service layer for all bill-related business operations. This service will handle bill creation, updates, status transitions, approval workflows, and maintain data consistency through transaction handling.

### Dependencies
- VendorBill model exists (from Group A)
- BillLineItem model exists (from Group B)
- PurchaseOrder model available
- GoodsReceivedNote model available
- Django transaction support configured

### Instructions

1. **Create services directory structure**
   - Navigate to `apps/vendor_bills/` directory
   - Create new directory named `services`
   - Create `__init__.py` in `services/` directory

2. **Create bill_service.py file**
   - Create file at `apps/vendor_bills/services/bill_service.py`
   - Add module docstring explaining service purpose

3. **Import required modules**
   - Import Django transaction utilities
   - Import timezone utilities
   - Import VendorBill and BillLineItem models
   - Import PurchaseOrder and GoodsReceivedNote models
   - Import User model
   - Import exceptions (ValidationError, ObjectDoesNotExist)
   - Import Decimal for currency calculations
   - Import typing hints

4. **Define BillService class**
   - Create class BillService with comprehensive docstring
   - Document class responsibility: bill business logic
   - Note tenant-aware operations requirement

5. **Add initialization method**
   - Accept optional tenant parameter
   - Store tenant for filtering operations
   - Validate tenant exists if provided

6. **Add _get_queryset helper method**
   - Return VendorBill queryset filtered by tenant
   - Include select_related for vendor, purchase_order
   - Include prefetch_related for line_items
   - Optimize database queries

7. **Add _validate_bill_editable helper method**
   - Accept bill instance parameter
   - Check bill status is DRAFT or PENDING
   - Raise ValidationError if not editable
   - Return True if editable

8. **Add _validate_user_permissions helper method**
   - Accept user and action parameters
   - Check user has appropriate permissions
   - Validate user belongs to tenant
   - Raise PermissionDenied if not authorized

9. **Add _calculate_line_total helper method**
   - Accept quantity and unit_price parameters
   - Calculate line total (quantity × unit_price)
   - Round to 2 decimal places
   - Return Decimal value

10. **Add service registration to __init__.py**
    - Import BillService in services/__init__.py
    - Add to __all__ list
    - Make service easily importable

### BillService Class Structure

```
┌──────────────────────────────────────────────────────┐
│              BillService Architecture                │
├──────────────────────────────────────────────────────┤
│                                                      │
│  Core Methods:                                       │
│   • create_from_po()        - Auto-create from PO   │
│   • create_manual()         - Manual creation       │
│   • update_bill()           - Edit bill data        │
│   • submit_bill()           - Submit for approval   │
│   • approve_bill()          - Approve bill          │
│   • dispute_bill()          - Mark as disputed      │
│   • cancel_bill()           - Cancel bill           │
│                                                      │
│  Helper Methods:                                     │
│   • _get_queryset()         - Tenant-aware queries  │
│   • _validate_bill_editable() - Edit validation     │
│   • _validate_user_permissions() - Auth checks      │
│   • _calculate_line_total() - Line calculations     │
│                                                      │
│  Transaction Handling:                               │
│   • All mutations wrapped in atomic()               │
│   • Rollback on any error                           │
│   • Maintain data consistency                       │
│                                                      │
└──────────────────────────────────────────────────────┘
```

### Service Layer Architecture

```
┌────────────────┐
│   API Views    │  ← Controllers
└────────┬───────┘
         │
         ▼
┌────────────────┐
│  BillService   │  ← Business Logic Layer (This Task)
└────────┬───────┘
         │
         ├──────────────┬─────────────────┬──────────────┐
         ▼              ▼                 ▼              ▼
┌──────────────┐ ┌────────────┐ ┌─────────────┐ ┌──────────┐
│ VendorBill   │ │BillLineItem│ │PurchaseOrder│ │   GRN    │
│    Model     │ │   Model    │ │   Model     │ │  Model   │
└──────────────┘ └────────────┘ └─────────────┘ └──────────┘
```

### Directory Structure

```
apps/vendor_bills/
├── models/
│   ├── __init__.py
│   ├── vendor_bill.py
│   └── bill_line_item.py
├── services/                      # NEW
│   ├── __init__.py               # Task 33
│   └── bill_service.py           # Task 33
└── views/
    └── ...
```

### Service Initialization Pattern

| Usage | Purpose |
|-------|---------|
| BillService() | Service without tenant filter |
| BillService(tenant=request.tenant) | Tenant-scoped service |
| BillService(tenant=bill.tenant) | Use bill's tenant |

### Helper Method Purposes

| Method | Purpose | Returns |
|--------|---------|---------|
| _get_queryset() | Tenant-filtered bills with optimized loading | QuerySet |
| _validate_bill_editable() | Check if bill can be modified | Boolean |
| _validate_user_permissions() | Verify user authorization | Boolean or raises |
| _calculate_line_total() | Calculate line item total | Decimal |

### Transaction Safety

```
Transaction Flow for Bill Operations
═════════════════════════════════════

BEGIN TRANSACTION
  │
  ├─► Validate input data
  │
  ├─► Create/Update VendorBill
  │
  ├─► Create/Update BillLineItems
  │
  ├─► Calculate totals
  │
  ├─► Update related records (PO, GRN)
  │
  └─► COMMIT on success
      ROLLBACK on any error
```

### Expected Outcome
- Functional BillService class with core structure
- Tenant-aware operations support
- Helper methods for common validations
- Foundation for bill workflow methods
- Transaction-safe operations framework

### Verification Checklist
- [ ] services/ directory created
- [ ] services/__init__.py exists
- [ ] bill_service.py file created
- [ ] BillService class defined
- [ ] __init__ method implemented
- [ ] _get_queryset method added
- [ ] _validate_bill_editable method added
- [ ] _validate_user_permissions method added
- [ ] _calculate_line_total method added
- [ ] Service imports configured in __init__.py
- [ ] Module docstrings added
- [ ] Type hints used where appropriate

---

## Task 34: Implement Create Bill from PO

### Overview
Implement the create_from_po method that automatically creates a vendor bill from a completed purchase order. This method retrieves PO data, associated GRN information, creates the bill with matching line items, and links everything together for traceability.

### Dependencies
- Task 33: Create BillService Class
- PurchaseOrder model with RECEIVED status
- GoodsReceivedNote model with line items
- BillLineItem with PO/GRN linking

### Instructions

1. **Define create_from_po method signature**
   - Accept po_id parameter (PO identifier)
   - Accept bill_data dictionary (optional additional fields)
   - Accept user parameter (performing user)
   - Add comprehensive docstring

2. **Add method decorator**
   - Wrap entire method with transaction.atomic()
   - Ensure all operations commit or rollback together
   - Maintain data consistency

3. **Retrieve and validate purchase order**
   - Get PO by ID using tenant-aware query
   - Validate PO exists (raise ObjectDoesNotExist if not)
   - Validate PO status is RECEIVED
   - Validate PO has not already been billed
   - Check vendor information is complete

4. **Retrieve associated GRN records**
   - Query GoodsReceivedNote filtered by purchase_order
   - Get GRN with status COMPLETED
   - Validate at least one GRN exists
   - Prefetch GRN line items for efficiency

5. **Prepare bill header data**
   - Extract vendor from PO
   - Extract bill_date from bill_data or use today
   - Extract due_date from bill_data or calculate from payment terms
   - Extract bill_number if provided
   - Set purchase_order reference
   - Set status to DRAFT
   - Set currency from PO

6. **Create VendorBill instance**
   - Create new VendorBill with prepared data
   - Set tenant from PO
   - Set created_by to user
   - Save bill to database

7. **Create line items from PO and GRN**
   - Iterate through PO line items
   - For each PO line, find matching GRN lines
   - Get received quantity from GRN
   - Get unit price from PO
   - Create BillLineItem with:
     - vendor_bill reference
     - product reference
     - description from PO line
     - quantity from GRN received_quantity
     - unit_price from PO line
     - line_total calculated
     - purchase_order_line reference
     - goods_received_note_line reference
   - Save each line item

8. **Calculate bill totals**
   - Sum all line_totals for subtotal
   - Calculate tax_amount (if applicable)
   - Calculate total_amount (subtotal + tax)
   - Update bill with calculated totals

9. **Update PO billing status**
   - Set PO is_billed flag to True
   - Update PO billing_date
   - Save PO

10. **Return created bill**
    - Return the created VendorBill instance
    - Include success message in response
    - Log bill creation action

### Create Bill from PO Workflow

```
┌─────────────────────────────────────────────────────────────┐
│         Create Bill from Purchase Order Workflow            │
└─────────────────────────────────────────────────────────────┘

Input: PO-2026-00001

Step 1: Validate Purchase Order
├─► PO exists and accessible?
├─► PO status = RECEIVED?
├─► PO not already billed?
└─► Vendor info complete?
        │
        ▼
Step 2: Retrieve GRN Data
├─► Query GRNs for this PO
├─► Status = COMPLETED
├─► At least one GRN exists?
└─► Load GRN line items
        │
        ▼
Step 3: Create Bill Header
├─► Set vendor from PO
├─► Set bill_date (today or provided)
├─► Calculate due_date (payment terms)
├─► Set status = DRAFT
└─► Link to PO
        │
        ▼
Step 4: Create Line Items
├─► For each PO line:
│   ├─► Find matching GRN line(s)
│   ├─► Get received quantity
│   ├─► Get unit price from PO
│   ├─► Create BillLineItem
│   └─► Link to PO line and GRN line
        │
        ▼
Step 5: Calculate Totals
├─► Sum line totals = subtotal
├─► Calculate tax
├─► Calculate total
└─► Update bill
        │
        ▼
Step 6: Update PO Status
├─► Set is_billed = True
├─► Set billing_date
└─► Save PO
        │
        ▼
Output: BILL-2026-00001 (DRAFT)
```

### Data Flow Diagram

```
┌──────────────────┐
│ PurchaseOrder    │
│  PO-2026-00001   │
│  Status: RECEIVED│
└────────┬─────────┘
         │
         │ has
         ▼
┌──────────────────┐
│ GoodsReceivedNote│
│  GRN-2026-00001  │
│  Status: COMPLETE│
└────────┬─────────┘
         │
         │ create_from_po()
         ▼
┌──────────────────┐
│   VendorBill     │
│  BILL-2026-00001 │
│  Status: DRAFT   │
└────────┬─────────┘
         │
         │ has
         ▼
┌──────────────────┐
│  BillLineItem    │
│  Line 1, 2, 3... │
│  (from GRN qty)  │
└──────────────────┘
```

### Line Item Mapping Example

| PO Line | Product | Ordered Qty | GRN Received | Unit Price | Bill Line Qty | Bill Line Total |
|---------|---------|-------------|--------------|------------|---------------|-----------------|
| 1 | Widget A | 100 | 100 | 150.00 | 100 | 15,000.00 |
| 2 | Widget B | 50 | 48 | 200.00 | 48 | 9,600.00 |
| 3 | Widget C | 75 | 75 | 300.00 | 75 | 22,500.00 |
| **Total** | | **225** | **223** | | **223** | **47,100.00** |

### Due Date Calculation Logic

```
Payment Terms Application
═════════════════════════

Net 30:
  bill_date = 2026-01-24
  due_date = 2026-02-23 (bill_date + 30 days)

Net 15:
  bill_date = 2026-01-24
  due_date = 2026-02-08 (bill_date + 15 days)

Net 60:
  bill_date = 2026-01-24
  due_date = 2026-03-25 (bill_date + 60 days)

If no payment terms:
  due_date = bill_date + 30 days (default)
```

### Bill-PO-GRN Relationship

```
┌─────────────────┐
│ PurchaseOrder   │
│ • order_number  │
│ • vendor        │
│ • total_amount  │
└────────┬────────┘
         │ 1
         │
         │ N
    ┌────┴────────┐
    │             │
    ▼ 1       1:N ▼
┌─────────────────┐   ┌────────────────┐
│   VendorBill    │   │GoodsReceivedNote│
│ • bill_number   │   │ • grn_number    │
│ • purchase_order│   │ • purchase_order│
│ • total_amount  │   │ • received_date │
└────────┬────────┘   └────────┬───────┘
         │ 1                   │ 1
         │                     │
         │ N                   │ N
         ▼                     ▼
┌─────────────────┐   ┌────────────────┐
│  BillLineItem   │   │  GRNLineItem   │
│ • po_line       │◄──┤ • po_line      │
│ • grn_line      │───┤ • quantity     │
│ • quantity      │   │ • received     │
└─────────────────┘   └────────────────┘
```

### Validation Rules

| Validation | Check | Error Message |
|------------|-------|---------------|
| PO Exists | ObjectDoesNotExist | "Purchase order not found" |
| PO Status | status == RECEIVED | "PO must be in RECEIVED status" |
| Already Billed | is_billed == False | "Bill already exists for this PO" |
| GRN Exists | GRN.count() > 0 | "No completed GRN found for this PO" |
| Vendor Data | vendor is not None | "PO must have a valid vendor" |
| Line Items | po_lines.count() > 0 | "PO has no line items" |

### Expected Outcome
- Functional create_from_po method
- Automatic bill creation from PO
- Line items populated from GRN data
- PO-Bill-GRN linkage established
- Totals automatically calculated
- Transaction-safe operation

### Verification Checklist
- [ ] create_from_po method defined
- [ ] Method signature correct (po_id, bill_data, user)
- [ ] transaction.atomic() decorator applied
- [ ] PO retrieval and validation implemented
- [ ] GRN retrieval logic added
- [ ] Bill header creation implemented
- [ ] Line item creation loop added
- [ ] PO-line to GRN-line mapping correct
- [ ] Total calculation implemented
- [ ] PO is_billed flag updated
- [ ] Method returns created bill
- [ ] Error handling for all validations

---

## Task 35: Implement Auto-Fill from PO/GRN

### Overview
Implement the _auto_fill_from_po_grn helper method that retrieves and structures data from purchase orders and goods received notes. This method is used by create_from_po to prepare line item data efficiently.

### Dependencies
- Task 34: Implement Create Bill from PO
- PurchaseOrderLine model
- GRNLine model with quantity tracking

### Instructions

1. **Define _auto_fill_from_po_grn method signature**
   - Accept purchase_order parameter
   - Accept goods_received_notes parameter (list)
   - Return structured line item data
   - Add docstring explaining data structure

2. **Initialize data structure**
   - Create empty list for line item data
   - Prepare dictionary for GRN line lookup
   - Index GRN lines by PO line reference

3. **Build GRN line mapping**
   - Iterate through all GRNs
   - For each GRN, iterate through its lines
   - Map each GRN line to its corresponding PO line
   - Handle multiple GRNs for same PO line (partial deliveries)
   - Sum received quantities per PO line

4. **Process PO lines**
   - Iterate through PO line items
   - For each PO line:
     - Get product information
     - Get description from PO line
     - Get unit price from PO line
     - Get UOM (unit of measure)
     - Retrieve matched GRN data
     - Calculate received quantity
     - Determine billable quantity

5. **Handle partial receipts**
   - Check if received quantity < ordered quantity
   - For partial receipts, use received quantity for bill
   - Add note indicating partial receipt
   - Maintain reference to original ordered quantity

6. **Calculate line amounts**
   - Calculate line total (quantity × unit_price)
   - Include any line-level discounts
   - Calculate line tax if applicable
   - Round to appropriate decimal places

7. **Prepare line item dictionary**
   - Structure data for BillLineItem creation:
     - product_id
     - description
     - quantity (from GRN received)
     - unit_price (from PO)
     - line_total
     - purchase_order_line_id
     - goods_received_note_line_id
     - uom
     - notes (if partial)
   - Add to line items list

8. **Return prepared data**
   - Return list of line item dictionaries
   - Include metadata (total lines, total quantity)
   - Ready for batch creation

### Auto-Fill Data Flow

```
┌────────────────────────────────────────────────────────────┐
│            Auto-Fill from PO/GRN Data Flow                 │
└────────────────────────────────────────────────────────────┘

Input: PO + List of GRNs

Step 1: Build GRN Line Index
┌─────────────────────────────┐
│ GRN Lines by PO Line        │
├─────────────────────────────┤
│ PO Line 1 → [GRN Line 1]    │
│ PO Line 2 → [GRN Line 2,3]  │  ← Multiple GRNs
│ PO Line 3 → [GRN Line 4]    │
└─────────────────────────────┘
        │
        ▼
Step 2: Process Each PO Line
┌─────────────────────────────┐
│ PO Line 1:                  │
│  • Product: Widget A        │
│  • Ordered: 100             │
│  • Price: 150.00            │
│  • GRN Received: 100        │
│  → Bill Qty: 100            │
│  → Line Total: 15,000.00    │
└─────────────────────────────┘
        │
        ▼
Step 3: Handle Partial Receipts
┌─────────────────────────────┐
│ PO Line 2:                  │
│  • Product: Widget B        │
│  • Ordered: 50              │
│  • Price: 200.00            │
│  • GRN Received: 48         │  ← Partial
│  → Bill Qty: 48             │
│  → Line Total: 9,600.00     │
│  → Note: "Partial receipt"  │
└─────────────────────────────┘
        │
        ▼
Output: List of Line Item Dicts
[
  {product_id, description, quantity, unit_price, ...},
  {product_id, description, quantity, unit_price, ...},
  ...
]
```

### GRN Line Aggregation

```
Multiple GRNs for Same PO Line
═══════════════════════════════

PO Line: 100 units ordered

GRN-001:
  └─► Received: 60 units

GRN-002:
  └─► Received: 40 units

Aggregation:
  Total Received: 100 units
  Bill Quantity: 100 units

─────────────────────────────

Partial Case:

PO Line: 100 units ordered

GRN-001:
  └─► Received: 60 units

GRN-002:
  └─► Received: 35 units

Aggregation:
  Total Received: 95 units
  Bill Quantity: 95 units ← Partial
  Note: "Partial receipt: 95 of 100 ordered"
```

### Line Item Data Structure

```
Line Item Dictionary Schema
════════════════════════════

{
  "product_id": UUID or Integer,
  "description": String,
  "quantity": Decimal,
  "unit_price": Decimal,
  "line_total": Decimal,
  "purchase_order_line_id": UUID or Integer,
  "goods_received_note_line_id": UUID or Integer,
  "uom": String (e.g., "PCS", "KG"),
  "tax_rate": Decimal (optional),
  "discount_percentage": Decimal (optional),
  "notes": String (optional),
  "is_partial": Boolean
}
```

### GRN Line Mapping Example

| PO Line ID | Product | Ordered | GRN-001 | GRN-002 | Total Received | Billable Qty |
|------------|---------|---------|---------|---------|----------------|--------------|
| PO-L-001 | Widget A | 100 | 100 | - | 100 | 100 (Full) |
| PO-L-002 | Widget B | 50 | 30 | 18 | 48 | 48 (Partial) |
| PO-L-003 | Widget C | 75 | 75 | - | 75 | 75 (Full) |
| PO-L-004 | Widget D | 40 | - | 40 | 40 | 40 (Full) |

### Quantity Calculation Logic

```
Billable Quantity Determination
════════════════════════════════

Rule: Bill only what was received

Case 1: Full Receipt
  Ordered: 100
  Received: 100
  → Bill: 100

Case 2: Partial Receipt
  Ordered: 100
  Received: 85
  → Bill: 85 (note: partial)

Case 3: Over Receipt (if allowed)
  Ordered: 100
  Received: 105
  → Bill: 105 (note: over-receipt)

Case 4: Multiple Deliveries
  Ordered: 100
  GRN-1: 60
  GRN-2: 40
  → Bill: 100 (sum of all GRNs)
```

### Price and Amount Calculations

| Field | Source | Calculation |
|-------|--------|-------------|
| unit_price | PO Line | Direct from PO |
| quantity | GRN Lines | Sum of received quantities |
| line_subtotal | Calculated | quantity × unit_price |
| discount_amount | PO Line (optional) | line_subtotal × discount_percentage |
| line_net | Calculated | line_subtotal - discount_amount |
| tax_amount | Tax rules | line_net × tax_rate |
| line_total | Calculated | line_net + tax_amount |

### Partial Receipt Notification

```
╔═══════════════════════════════════════════════════╗
║             Partial Receipt Alert                 ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  Product: Industrial Bearing Set                  ║
║  Ordered: 100 units                               ║
║  Received: 85 units                               ║
║                                                   ║
║  ⚠ Partial Delivery                              ║
║  Outstanding: 15 units                            ║
║                                                   ║
║  This bill covers the 85 units received.         ║
║  Additional bill may be needed upon full          ║
║  delivery of remaining 15 units.                  ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

### Expected Outcome
- Efficient data retrieval from PO and GRNs
- Proper aggregation of multiple GRN lines
- Correct handling of partial receipts
- Structured data ready for line item creation
- Clear indication of partial vs. full receipts

### Verification Checklist
- [ ] _auto_fill_from_po_grn method defined
- [ ] Method signature correct
- [ ] GRN line mapping implemented
- [ ] PO line iteration added
- [ ] Quantity aggregation logic correct
- [ ] Partial receipt detection working
- [ ] Line amount calculations implemented
- [ ] Line item dictionary structure correct
- [ ] Method returns list of dicts
- [ ] Handles multiple GRNs correctly
- [ ] Handles missing GRN data gracefully

---

## Task 36: Implement Manual Bill Creation

### Overview
Implement the create_manual method that allows users to create vendor bills manually without a purchase order reference. This is used for direct purchases, utility bills, service invoices, and other expenses not tied to a PO.

### Dependencies
- Task 33: Create BillService Class
- VendorBill model
- BillLineItem model
- Vendor model available

### Instructions

1. **Define create_manual method signature**
   - Accept vendor_id parameter
   - Accept bill_data dictionary (bill header fields)
   - Accept line_items_data list (line item details)
   - Accept user parameter
   - Return created bill
   - Add comprehensive docstring

2. **Add transaction decorator**
   - Wrap method with transaction.atomic()
   - Ensure atomicity of bill and line creation
   - Rollback on any error

3. **Validate vendor**
   - Retrieve vendor by vendor_id
   - Validate vendor exists
   - Validate vendor is active
   - Validate vendor belongs to tenant
   - Raise ValidationError if invalid

4. **Validate bill data**
   - Check required fields present:
     - bill_number or auto-generate
     - bill_date (default to today)
     - due_date (calculate from terms or provide)
   - Validate date logic (due_date >= bill_date)
   - Validate currency code
   - Check for duplicate bill_number

5. **Prepare bill header**
   - Extract bill_number (or generate)
   - Extract bill_date
   - Extract due_date
   - Extract description/notes
   - Extract payment_terms
   - Set status to DRAFT
   - Set vendor reference
   - Set tenant from user or context
   - Set created_by to user

6. **Create VendorBill instance**
   - Create bill with prepared header data
   - Set purchase_order to null (no PO reference)
   - Set is_manual flag to True
   - Save bill to database

7. **Validate line items data**
   - Check line_items_data is not empty
   - Validate each line has required fields:
     - product_id or description
     - quantity
     - unit_price
   - Validate quantities are positive
   - Validate prices are non-negative

8. **Create line items**
   - Iterate through line_items_data
   - For each line:
     - Create BillLineItem instance
     - Set vendor_bill reference
     - Set product (if product_id provided)
     - Set description
     - Set quantity
     - Set unit_price
     - Calculate line_total
     - Set tax_rate if provided
     - Set uom (unit of measure)
     - Save line item

9. **Calculate bill totals**
   - Sum all line totals for subtotal
   - Calculate total tax amount
   - Calculate discount if applicable
   - Calculate final total_amount
   - Update bill with totals

10. **Return created bill**
    - Return VendorBill instance
    - Log creation action
    - Ready for further processing (submit, approve, pay)

### Manual Bill Creation Workflow

```
┌─────────────────────────────────────────────────────────────┐
│            Manual Bill Creation Workflow                    │
└─────────────────────────────────────────────────────────────┘

Input: vendor_id, bill_data, line_items_data

Step 1: Validate Vendor
├─► Vendor exists?
├─► Vendor active?
├─► Vendor in tenant?
└─► Vendor has payment terms?
        │
        ▼
Step 2: Validate Bill Header Data
├─► bill_number unique?
├─► bill_date valid?
├─► due_date >= bill_date?
└─► Currency code valid?
        │
        ▼
Step 3: Create Bill Header
├─► Set vendor
├─► Set bill_number
├─► Set dates
├─► Set status = DRAFT
├─► Set is_manual = True
├─► No PO reference
└─► Set created_by
        │
        ▼
Step 4: Validate Line Items
├─► At least one line?
├─► Required fields present?
├─► Quantities positive?
└─► Prices non-negative?
        │
        ▼
Step 5: Create Line Items
├─► For each line_data:
│   ├─► Create BillLineItem
│   ├─► Set quantity, unit_price
│   ├─► Calculate line_total
│   └─► Save line item
        │
        ▼
Step 6: Calculate Totals
├─► Sum line totals
├─► Calculate tax
├─► Apply discounts
└─► Update bill total
        │
        ▼
Output: BILL-2026-00050 (DRAFT, Manual)
```

### Manual vs. PO-Based Bill Comparison

| Aspect | PO-Based Bill | Manual Bill |
|--------|---------------|-------------|
| Creation Method | create_from_po() | create_manual() |
| PO Reference | Required | None (null) |
| GRN Reference | Required | None |
| Line Item Source | Auto-filled from PO/GRN | Manually entered |
| Matching | Auto-matched to PO | Not applicable |
| Use Cases | Inventory purchases | Services, utilities, misc expenses |
| is_manual Flag | False | True |

### Manual Bill Use Cases

```
╔═══════════════════════════════════════════════════╗
║           Manual Bill Use Cases                   ║
╠═══════════════════════════════════════════════════╣
║                                                   ║
║  1. Utility Bills                                 ║
║     • Electricity, water, internet               ║
║     • No PO, direct from vendor                   ║
║                                                   ║
║  2. Professional Services                         ║
║     • Consulting fees, legal services            ║
║     • Time-based billing                          ║
║                                                   ║
║  3. Subscription Services                         ║
║     • Software licenses, cloud services          ║
║     • Recurring monthly charges                   ║
║                                                   ║
║  4. Miscellaneous Expenses                        ║
║     • Office supplies (small purchases)          ║
║     • Repairs and maintenance                     ║
║                                                   ║
║  5. Service Invoices                              ║
║     • Cleaning, security services                ║
║     • No physical goods received                  ║
║                                                   ║
╚═══════════════════════════════════════════════════╝
```

### Line Items Data Structure

```
Line Items Input Format
════════════════════════

line_items_data = [
  {
    "product_id": null,  # Optional for services
    "description": "Internet Service - January 2026",
    "quantity": 1,
    "unit_price": 15000.00,
    "uom": "Month",
    "tax_rate": 0.00,
    "account_code": "5200"  # Expense account
  },
  {
    "product_id": 123,  # Optional product reference
    "description": "Office Supplies",
    "quantity": 5,
    "unit_price": 350.00,
    "uom": "PCS",
    "tax_rate": 15.00,
    "account_code": "5100"
  }
]
```

### Bill Number Generation

```
Bill Number Auto-Generation
════════════════════════════

Pattern: {PREFIX}-{YEAR}-{SEQUENCE}

Examples:
  BILL-2026-00001
  BILL-2026-00002
  INV-2026-00123
  EXP-2026-00050

If bill_number provided:
  Use provided number (validate uniqueness)

If bill_number not provided:
  Generate from settings:
    - Get tenant BillSettings
    - Get bill_number_prefix (default: "BILL")
    - Get next sequence number
    - Format: {prefix}-{year}-{seq:05d}
    - Increment sequence
```

### Validation Rules Table

| Field | Validation | Error Message |
|-------|------------|---------------|
| vendor_id | Vendor exists & active | "Invalid or inactive vendor" |
| bill_number | Unique per tenant | "Bill number already exists" |
| bill_date | Valid date | "Invalid bill date" |
| due_date | >= bill_date | "Due date must be after bill date" |
| line_items | Not empty | "At least one line item required" |
| quantity | > 0 | "Quantity must be positive" |
| unit_price | >= 0 | "Unit price cannot be negative" |

### Date Calculation Helper

```
Due Date Calculation
════════════════════

If due_date provided:
  Use provided due_date

If payment_terms provided:
  Extract days from terms:
    "Net 30" → 30 days
    "Net 15" → 15 days
    "Net 60" → 60 days
  Calculate: bill_date + days

If neither provided:
  Use vendor default payment terms
  Fallback: bill_date + 30 days
```

### Sample Manual Bill Creation

```
Input Data:
───────────
vendor_id: 456
bill_data: {
  "bill_number": "ELECT-JAN-2026",
  "bill_date": "2026-01-24",
  "due_date": "2026-02-08",
  "payment_terms": "Net 15",
  "description": "January Electricity Bill"
}
line_items_data: [
  {
    "description": "Electricity Consumption",
    "quantity": 1,
    "unit_price": 25000.00,
    "uom": "Month"
  }
]

Created Bill:
─────────────
ELECT-JAN-2026
Vendor: Sri Lanka Electricity Board
Date: 2026-01-24
Due: 2026-02-08
Status: DRAFT
Line Items: 1
Total: 25,000.00 LKR
```

### Expected Outcome
- Functional create_manual method
- Manual bill creation without PO
- Flexible line item entry
- Automatic bill number generation
- Proper validation and error handling
- Transaction-safe operation

### Verification Checklist
- [ ] create_manual method defined
- [ ] Method signature correct
- [ ] transaction.atomic() applied
- [ ] Vendor validation implemented
- [ ] Bill header validation added
- [ ] Bill creation logic implemented
- [ ] Line items validation added
- [ ] Line item creation loop implemented
- [ ] Total calculation working
- [ ] Bill number generation (if needed)
- [ ] is_manual flag set to True
- [ ] Error handling for all validations
- [ ] Method returns created bill

---

## Task 37: Implement Bill Editing

### Overview
Implement the update_bill method that allows editing of bills in DRAFT or PENDING status. This method validates editability, updates bill header fields and line items, recalculates totals, and maintains audit trail.

### Dependencies
- Task 33: Create BillService Class
- Task 36: Implement Manual Bill Creation
- VendorBill and BillLineItem models

### Instructions

1. **Define update_bill method signature**
   - Accept bill_id parameter
   - Accept update_data dictionary (fields to update)
   - Accept user parameter
   - Return updated bill
   - Add docstring with update rules

2. **Add transaction decorator**
   - Wrap method with transaction.atomic()
   - Ensure atomic updates
   - Rollback on validation failure

3. **Retrieve and validate bill**
   - Get bill by bill_id with tenant filter
   - Validate bill exists
   - Validate bill status using _validate_bill_editable()
   - Only DRAFT or PENDING can be edited
   - Raise ValidationError if not editable

4. **Validate user permissions**
   - Check user has bill.edit permission
   - Use _validate_user_permissions() helper
   - Verify user belongs to same tenant
   - Raise PermissionDenied if not authorized

5. **Update header fields**
   - Extract updatable header fields from update_data:
     - bill_number (if not auto-generated)
     - bill_date
     - due_date
     - payment_terms
     - description
     - notes
   - Validate each field
   - Apply updates to bill instance

6. **Handle line items updates**
   - Check if 'line_items' in update_data
   - If present, process line item changes:
     - Identify lines to add (no line_id)
     - Identify lines to update (has line_id)
     - Identify lines to delete (not in update)
   - Validate line item data

7. **Update existing line items**
   - For each line with line_id:
     - Retrieve BillLineItem
     - Update quantity, unit_price, description
     - Recalculate line_total
     - Save line item

8. **Add new line items**
   - For lines without line_id:
     - Create new BillLineItem
     - Set bill reference
     - Set line data
     - Calculate line_total
     - Save new line

9. **Delete removed line items**
   - Identify lines not in update but exist in DB
   - Delete those BillLineItem records
   - Maintain referential integrity

10. **Recalculate bill totals**
    - Sum all line totals
    - Recalculate tax
    - Recalculate total_amount
    - Update bill with new totals

11. **Update audit fields**
    - Set updated_by to user
    - Update updated_at timestamp (automatic)
    - Log the update action (future task)

12. **Return updated bill**
    - Return refreshed VendorBill instance
    - Include success message

### Bill Update Workflow

```
┌─────────────────────────────────────────────────────────────┐
│               Bill Update Workflow                          │
└─────────────────────────────────────────────────────────────┘

Input: bill_id, update_data, user

Step 1: Retrieve and Validate
├─► Bill exists?
├─► Status = DRAFT or PENDING?
├─► User has edit permission?
└─► User in same tenant?
        │
        ▼
Step 2: Update Header Fields
├─► Update bill_date?
├─► Update due_date?
├─► Update payment_terms?
├─► Update description?
└─► Validate all updates
        │
        ▼
Step 3: Process Line Item Changes
├─► Identify new lines (no line_id)
├─► Identify updated lines (has line_id)
├─► Identify deleted lines (not in update)
└─► Validate all line changes
        │
        ▼
Step 4: Apply Line Item Changes
├─► Create new lines
├─► Update existing lines
├─► Delete removed lines
└─► Maintain consistency
        │
        ▼
Step 5: Recalculate Totals
├─► Sum line totals
├─► Calculate tax
├─► Calculate total
└─► Update bill
        │
        ▼
Step 6: Update Audit Fields
├─► Set updated_by
├─► Timestamp updated
└─► Log action (if history enabled)
        │
        ▼
Output: Updated Bill
```

### Editable Status States

```
Bill Status Edit Matrix
═══════════════════════

Status      │ Can Edit? │ Notes
────────────┼───────────┼─────────────────────────
DRAFT       │ ✓ Yes     │ Full edit capability
PENDING     │ ✓ Yes     │ Full edit capability
APPROVED    │ ✗ No      │ Cannot edit after approval
PARTIAL_PAID│ ✗ No      │ Payment in progress
PAID        │ ✗ No      │ Fully paid, locked
DISPUTED    │ ✗ No      │ Under dispute review
CANCELLED   │ ✗ No      │ Cancelled, archived
```

### Line Item Update Operations

```
Line Item Change Detection
══════════════════════════

Current Lines in DB:
┌──────────┬────────────────────┬─────────┐
│ Line ID  │ Description        │ Amount  │
├──────────┼────────────────────┼─────────┤
│ 101      │ Product A          │ 1000.00 │
│ 102      │ Product B          │ 2000.00 │
│ 103      │ Product C          │ 1500.00 │
└──────────┴────────────────────┴─────────┘

Update Data:
┌──────────┬────────────────────┬─────────┬──────────┐
│ Line ID  │ Description        │ Amount  │ Action   │
├──────────┼────────────────────┼─────────┼──────────┤
│ 101      │ Product A (updated)│ 1200.00 │ UPDATE   │
│ 102      │ Product B          │ 2000.00 │ NO CHANGE│
│ (none)   │ Product D          │ 800.00  │ ADD      │
└──────────┴────────────────────┴─────────┴──────────┘

Result:
- Line 101: Updated (new amount, description)
- Line 102: No change
- Line 103: Deleted (not in update)
- Line (new): Added (Product D)
```

### Update Data Structure

```
Header Update Format
════════════════════

update_data = {
  "bill_date": "2026-01-25",  # Changed
  "due_date": "2026-02-24",   # Changed
  "description": "Updated description",
  "notes": "Additional notes"
}

Header + Line Items Update
════════════════════════════

update_data = {
  "bill_date": "2026-01-25",
  "due_date": "2026-02-24",
  "line_items": [
    {
      "line_id": 101,  # Existing line to update
      "quantity": 12,  # Changed from 10
      "unit_price": 100.00
    },
    {
      "line_id": 102,  # Existing line, no change
      "quantity": 5,
      "unit_price": 400.00
    },
    {
      # No line_id = new line
      "description": "New item",
      "quantity": 3,
      "unit_price": 250.00
    }
  ]
}

Note: Line 103 not in update → will be deleted
```

### Validation During Update

| Validation | Check | Error Message |
|------------|-------|---------------|
| Bill Status | DRAFT or PENDING | "Cannot edit bill in {status} status" |
| User Permission | Has 'edit_bill' | "User not authorized to edit bills" |
| Due Date | >= bill_date | "Due date must be after bill date" |
| Line Quantity | > 0 | "Line quantity must be positive" |
| Line Price | >= 0 | "Line price cannot be negative" |
| Line Items | At least one | "Bill must have at least one line item" |

### Total Recalculation Flow

```
After Line Item Changes
═══════════════════════

Step 1: Get all current line items
  └─► BillLineItem.objects.filter(vendor_bill=bill)

Step 2: Calculate subtotal
  └─► Sum of all line_totals

Step 3: Calculate tax
  └─► Sum of (line_total × tax_rate) for each line

Step 4: Calculate discount
  └─► bill.discount_amount (if any)

Step 5: Calculate total
  └─► total = subtotal + tax - discount

Step 6: Update bill
  └─► bill.subtotal = subtotal
  └─► bill.tax_amount = tax
  └─► bill.total_amount = total
  └─► bill.save()
```

### Audit Trail Updates

```
What Gets Logged
════════════════

Before Update:
┌────────────────────────────────┐
│ Bill: BILL-2026-00001          │
│ Bill Date: 2026-01-20          │
│ Due Date: 2026-02-19           │
│ Total: 45,000.00               │
│ Line Items: 3                  │
└────────────────────────────────┘

After Update:
┌────────────────────────────────┐
│ Bill: BILL-2026-00001          │
│ Bill Date: 2026-01-25          │ ← Changed
│ Due Date: 2026-02-24           │ ← Changed
│ Total: 47,200.00               │ ← Changed
│ Line Items: 4                  │ ← Changed
└────────────────────────────────┘

Logged Changes:
• bill_date: 2026-01-20 → 2026-01-25
• due_date: 2026-02-19 → 2026-02-24
• Line 101: quantity 10 → 12
• Line 103: deleted
• Line (new): added
• total_amount: 45,000.00 → 47,200.00
• updated_by: user@example.com
• updated_at: 2026-01-24 14:30:00
```

### Expected Outcome
- Functional update_bill method
- Safe editing of DRAFT/PENDING bills
- Line item add/update/delete support
- Automatic total recalculation
- Audit trail maintenance
- Transaction-safe updates

### Verification Checklist
- [ ] update_bill method defined
- [ ] Method signature correct
- [ ] transaction.atomic() applied
- [ ] Bill retrieval and validation
- [ ] Status editability check
- [ ] User permission validation
- [ ] Header field updates implemented
- [ ] Line item update logic added
- [ ] New line creation handled
- [ ] Line deletion handled
- [ ] Total recalculation working
- [ ] Audit fields updated
- [ ] Error handling complete
- [ ] Method returns updated bill

---

## Task 38: Implement Bill Status Transitions

### Overview
Implement the status transition methods (submit_bill, approve_bill, dispute_bill, cancel_bill) that move bills through their lifecycle. Each method validates the current status, performs necessary checks, updates the status, and triggers any related actions.

### Dependencies
- Task 33: Create BillService Class
- Task 37: Implement Bill Editing
- Bill status constants defined

### Instructions

1. **Define submit_bill method**
   - Accept bill_id and user parameters
   - Validate bill in DRAFT status
   - Transition bill to PENDING status
   - Set submitted_at timestamp
   - Set submitted_by to user

2. **Implement submit validation**
   - Check bill has at least one line item
   - Validate all required fields present
   - Validate total_amount > 0
   - Validate vendor is active
   - Raise ValidationError if invalid

3. **Define approve_bill method**
   - Accept bill_id, notes, user parameters
   - Validate bill in PENDING status
   - Check user has approval permission
   - Transition bill to APPROVED status
   - Set approved_at timestamp
   - Set approved_by to user
   - Save approval notes

4. **Implement approval validation**
   - Check user has 'approve_bill' permission
   - Validate approval authority (amount limits)
   - Check if approval required (threshold)
   - Log approval action

5. **Define dispute_bill method**
   - Accept bill_id, reason, user parameters
   - Validate bill in PENDING or APPROVED status
   - Transition bill to DISPUTED status
   - Set dispute_reason
   - Set disputed_at timestamp
   - Set disputed_by to user
   - Notify relevant parties

6. **Implement dispute validation**
   - Require dispute reason (not empty)
   - Check bill not already paid
   - Validate user can dispute bills
   - Log dispute action

7. **Define cancel_bill method**
   - Accept bill_id, reason, user parameters
   - Validate bill not in PAID status
   - Transition bill to CANCELLED status
   - Set cancellation_reason
   - Set cancelled_at timestamp
   - Set cancelled_by to user
   - Reverse any related records

8. **Implement cancellation validation**
   - Require cancellation reason
   - Check bill has no payments
   - Validate user can cancel bills
   - Log cancellation action

9. **Add status change logging**
   - Log old status and new status
   - Log user performing action
   - Log timestamp of change
   - Log reason/notes if provided

10. **Add related record updates**
    - Update PO if bill cancelled
    - Update payment records if needed
    - Update inventory if applicable
    - Maintain data consistency

### Bill Status Lifecycle

```
┌──────────────────────────────────────────────────────────────┐
│                Bill Status State Machine                     │
└──────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │    DRAFT    │  ← Initial creation
                    └──────┬──────┘
                           │
                           │ submit_bill()
                           ▼
                    ┌─────────────┐
         ┌──────────┤   PENDING   │  ← Awaiting approval
         │          └──────┬──────┘
         │                 │
         │                 │ approve_bill()
         │                 ▼
         │          ┌─────────────┐
         │          │  APPROVED   │  ← Ready for payment
         │          └──────┬──────┘
         │                 │
         │                 │ record_payment()
         │                 ▼
dispute_ │          ┌─────────────┐
bill()   │    ┌────►│PARTIAL_PAID │  ← Partially paid
         │    │     └──────┬──────┘
         │    │            │
         │    │            │ pay_remaining()
         │    │            ▼
         │    │     ┌─────────────┐
         │    │     │    PAID     │  ← Fully paid (terminal)
         │    │     └─────────────┘
         │    │
         ▼    │
    ┌─────────────┐
    │  DISPUTED   │  ← Issue raised
    └──────┬──────┘
           │
           │ resolve_dispute()
           ▼
    ┌─────────────┐
    │  CANCELLED  │  ← Cancelled (terminal)
    └─────────────┘

    cancel_bill() can be called from:
    DRAFT, PENDING, DISPUTED → CANCELLED
```

### State Transition Rules

| Current Status | submit() | approve() | dispute() | cancel() | pay() |
|---------------|----------|-----------|-----------|----------|-------|
| DRAFT | ✓ PENDING | ✗ | ✗ | ✓ CANCELLED | ✗ |
| PENDING | ✗ | ✓ APPROVED | ✓ DISPUTED | ✓ CANCELLED | ✗ |
| APPROVED | ✗ | ✗ | ✓ DISPUTED | ✗ | ✓ PARTIAL_PAID |
| PARTIAL_PAID | ✗ | ✗ | ✗ | ✗ | ✓ PAID |
| DISPUTED | ✗ | ✗ | ✗ | ✓ CANCELLED | ✗ |
| PAID | ✗ | ✗ | ✗ | ✗ | ✗ |
| CANCELLED | ✗ | ✗ | ✗ | ✗ | ✗ |

### Submit Bill Workflow

```
submit_bill(bill_id, user)
══════════════════════════

Preconditions:
  ├─► Bill status = DRAFT
  ├─► At least one line item
  ├─► Total amount > 0
  └─► Vendor is active

Actions:
  ├─► Set status = PENDING
  ├─► Set submitted_at = now()
  ├─► Set submitted_by = user
  ├─► Log status change
  └─► Trigger approval workflow (if needed)

Postconditions:
  ├─► Bill status = PENDING
  ├─► Bill awaits approval
  └─► Approval notifications sent
```

### Approve Bill Workflow

```
approve_bill(bill_id, notes, user)
══════════════════════════════════

Preconditions:
  ├─► Bill status = PENDING
  ├─► User has approval permission
  ├─► User approval authority sufficient
  └─► All validations passed

Actions:
  ├─► Set status = APPROVED
  ├─► Set approved_at = now()
  ├─► Set approved_by = user
  ├─► Save approval_notes
  ├─► Log status change
  └─► Notify accounts payable team

Postconditions:
  ├─► Bill status = APPROVED
  ├─► Bill ready for payment
  └─► Approval recorded in history
```

### Dispute Bill Workflow

```
dispute_bill(bill_id, reason, user)
═══════════════════════════════════

Preconditions:
  ├─► Bill status = PENDING or APPROVED
  ├─► Dispute reason provided
  ├─► Bill not paid
  └─► User can dispute bills

Actions:
  ├─► Set status = DISPUTED
  ├─► Set dispute_reason
  ├─► Set disputed_at = now()
  ├─► Set disputed_by = user
  ├─► Log status change
  ├─► Notify vendor (optional)
  └─► Notify approver/submitter

Postconditions:
  ├─► Bill status = DISPUTED
  ├─► Payment blocked
  ├─► Requires resolution
  └─► Investigation initiated
```

### Cancel Bill Workflow

```
cancel_bill(bill_id, reason, user)
══════════════════════════════════

Preconditions:
  ├─► Bill status != PAID
  ├─► Cancellation reason provided
  ├─► No payments recorded
  └─► User can cancel bills

Actions:
  ├─► Set status = CANCELLED
  ├─► Set cancellation_reason
  ├─► Set cancelled_at = now()
  ├─► Set cancelled_by = user
  ├─► If from PO: reset PO.is_billed
  ├─► Log status change
  └─► Notify stakeholders

Postconditions:
  ├─► Bill status = CANCELLED
  ├─► Bill archived
  ├─► PO available for new bill
  └─► No further actions possible
```

### Status Field Updates

| Status | Fields Set | Timestamp Field | User Field |
|--------|------------|-----------------|------------|
| PENDING | status = PENDING | submitted_at | submitted_by |
| APPROVED | status = APPROVED | approved_at | approved_by |
| DISPUTED | status = DISPUTED, dispute_reason | disputed_at | disputed_by |
| CANCELLED | status = CANCELLED, cancellation_reason | cancelled_at | cancelled_by |

### Transition Validation Errors

```
Error Messages by Transition
═════════════════════════════

submit_bill():
  • "Bill is not in DRAFT status"
  • "Bill has no line items"
  • "Bill total amount is zero"
  • "Vendor is inactive"

approve_bill():
  • "Bill is not in PENDING status"
  • "User does not have approval permission"
  • "User approval limit exceeded"
  • "Bill requires senior approval"

dispute_bill():
  • "Bill is not in PENDING or APPROVED status"
  • "Dispute reason is required"
  • "Bill is already paid"
  • "User cannot dispute bills"

cancel_bill():
  • "Bill is already paid"
  • "Cancellation reason is required"
  • "Bill has recorded payments"
  • "User cannot cancel bills"
```

### Related Record Updates

```
On Bill Cancellation
════════════════════

If Bill created from PO:
  ├─► Update PO.is_billed = False
  ├─► Clear PO.billing_date
  └─► Allow PO to be billed again

If Bill has draft payments:
  ├─► Delete draft payment records
  └─► Clear payment allocations

Inventory impact:
  └─► None (GRN already updated inventory)

Accounting impact:
  └─► No journal entries yet (only after payment)
```

### Expected Outcome
- Four status transition methods implemented
- Proper validation for each transition
- Status-specific field updates
- Audit trail for all changes
- Related record updates
- Clear error messages

### Verification Checklist
- [ ] submit_bill method defined
- [ ] Submit validation implemented
- [ ] approve_bill method defined
- [ ] Approval validation implemented
- [ ] dispute_bill method defined
- [ ] Dispute validation implemented
- [ ] cancel_bill method defined
- [ ] Cancellation validation implemented
- [ ] Status change logging added
- [ ] Related record updates handled
- [ ] Error messages clear and helpful
- [ ] All transitions transaction-safe

---

## Task 39: Add Status Transition Validation

### Overview
Create a comprehensive validation system for status transitions that checks preconditions before allowing state changes. This includes the _validate_status_transition helper method and status-specific validation logic to ensure only valid transitions occur.

### Dependencies
- Task 38: Implement Bill Status Transitions
- Bill status constants defined
- Status transition rules documented

### Instructions

1. **Define allowed transitions mapping**
   - Create ALLOWED_TRANSITIONS constant
   - Define dictionary mapping each status to allowed next statuses
   - Include all valid state transitions
   - Document transition rules

2. **Define _validate_status_transition method**
   - Accept bill and new_status parameters
   - Check if transition is allowed
   - Raise ValidationError if not allowed
   - Return True if valid

3. **Implement transition permission checks**
   - Check current_status → new_status is in allowed transitions
   - Provide clear error message showing:
     - Current status
     - Attempted new status
     - List of allowed transitions
   - Reference transition diagram

4. **Add terminal status checks**
   - Identify terminal statuses (PAID, CANCELLED)
   - Prevent any transitions from terminal statuses
   - Raise clear error for terminal status modification
   - Log unauthorized transition attempts

5. **Implement precondition validation**
   - For PENDING: validate has line items, totals calculated
   - For APPROVED: validate submitted first, user has permission
   - For PARTIAL_PAID: validate approved first
   - For PAID: validate payment amount matches total
   - For DISPUTED: validate not already paid
   - For CANCELLED: validate no payments exist

6. **Add business rule validation**
   - Check vendor is still active for approvals
   - Check payment terms valid for submissions
   - Check user authorization level for approvals
   - Check dispute can only occur before full payment
   - Validate cancellation only for non-paid bills

7. **Create validation helper for line items**
   - _validate_has_line_items method
   - Check bill has at least one line
   - Check all lines have quantity > 0
   - Check all lines have unit_price >= 0
   - Return validation result with errors

8. **Create validation helper for totals**
   - _validate_totals_calculated method
   - Check subtotal matches sum of lines
   - Check tax_amount calculated
   - Check total_amount = subtotal + tax
   - Raise error if totals inconsistent

9. **Add payment validation helper**
   - _validate_no_payments method
   - Check bill has no payment records
   - Required before cancellation
   - Required before disputed → cancelled

10. **Integrate validation into transition methods**
    - Call _validate_status_transition in each transition method
    - Call specific validators as needed
    - Ensure all checks pass before state change
    - Provide helpful error messages

### Allowed Transitions Map

```
ALLOWED_TRANSITIONS Constant
═════════════════════════════

ALLOWED_TRANSITIONS = {
    'DRAFT': [
        'PENDING',    # Submit for approval
        'CANCELLED'   # Cancel before submission
    ],
    'PENDING': [
        'APPROVED',   # Approve bill
        'DISPUTED',   # Raise issue
        'CANCELLED'   # Cancel
    ],
    'APPROVED': [
        'PARTIAL_PAID',  # Record first payment
        'DISPUTED'       # Dispute after approval
    ],
    'PARTIAL_PAID': [
        'PAID'        # Complete payment
    ],
    'DISPUTED': [
        'PENDING',    # Resolve and return to pending
        'CANCELLED'   # Cancel after dispute
    ],
    'PAID': [],       # Terminal status - no transitions
    'CANCELLED': []   # Terminal status - no transitions
}
```

### Transition Validation Flow

```
┌──────────────────────────────────────────────────────────────┐
│         Status Transition Validation Process                │
└──────────────────────────────────────────────────────────────┘

Request: Transition bill from DRAFT to APPROVED

Step 1: Validate Current Status
├─► Current status = DRAFT
└─► Status is not terminal ✓

Step 2: Check Allowed Transitions
├─► Get allowed transitions for DRAFT
├─► Allowed: [PENDING, CANCELLED]
└─► APPROVED not in list ✗

Step 3: Raise Validation Error
├─► Message: "Cannot transition from DRAFT to APPROVED"
├─► Hint: "Allowed transitions: PENDING, CANCELLED"
└─► Suggestion: "Submit bill first (DRAFT → PENDING)"

Result: Transition BLOCKED

─────────────────────────────────────────────────────────────

Request: Transition bill from DRAFT to PENDING

Step 1: Validate Current Status
├─► Current status = DRAFT
└─► Status is not terminal ✓

Step 2: Check Allowed Transitions
├─► Get allowed transitions for DRAFT
├─► Allowed: [PENDING, CANCELLED]
└─► PENDING in list ✓

Step 3: Validate Preconditions
├─► Has line items? ✓
├─► Totals calculated? ✓
├─► Vendor active? ✓
└─► All checks passed ✓

Step 4: Allow Transition
└─► Proceed with status change

Result: Transition ALLOWED
```

### Precondition Validation Matrix

| Transition | Preconditions | Validation Method |
|------------|---------------|-------------------|
| DRAFT → PENDING | • Has line items<br>• Totals > 0<br>• Vendor active | _validate_has_line_items()<br>_validate_totals_calculated() |
| PENDING → APPROVED | • User has permission<br>• Within approval limit<br>• All data valid | _validate_user_permissions()<br>_validate_approval_authority() |
| APPROVED → PARTIAL_PAID | • Payment amount valid<br>• Payment < total | _validate_payment_amount() |
| PARTIAL_PAID → PAID | • Payment total = bill total<br>• All payments recorded | _validate_payment_complete() |
| Any → DISPUTED | • Not paid<br>• Reason provided | _validate_no_payments()<br>_validate_dispute_reason() |
| Any → CANCELLED | • No payments<br>• Reason provided | _validate_no_payments()<br>_validate_cancellation_reason() |

### Validation Error Messages

```
Error Message Examples
══════════════════════

Terminal Status Violation:
╔════════════════════════════════════════════════╗
║ Cannot modify bill in PAID status             ║
║                                                ║
║ Bill BILL-2026-00001 is in a terminal state.  ║
║ No further transitions are allowed.           ║
╚════════════════════════════════════════════════╝

Invalid Transition:
╔════════════════════════════════════════════════╗
║ Invalid status transition                     ║
║                                                ║
║ Cannot transition from DRAFT to APPROVED      ║
║                                                ║
║ Current status: DRAFT                          ║
║ Attempted status: APPROVED                     ║
║                                                ║
║ Allowed transitions from DRAFT:               ║
║  • PENDING (submit for approval)              ║
║  • CANCELLED (cancel before submission)       ║
║                                                ║
║ Hint: Submit the bill first (DRAFT→PENDING),  ║
║       then approve it (PENDING→APPROVED).     ║
╚════════════════════════════════════════════════╝

Precondition Failed:
╔════════════════════════════════════════════════╗
║ Cannot submit bill                            ║
║                                                ║
║ Bill has no line items.                       ║
║ Add at least one line item before submission. ║
╚════════════════════════════════════════════════╝
```

### Line Items Validation

```
_validate_has_line_items(bill)
══════════════════════════════

Checks:
1. Bill has line_items
   └─► line_items.count() > 0

2. Each line has valid quantity
   └─► line.quantity > 0

3. Each line has valid price
   └─► line.unit_price >= 0

4. Each line has calculated total
   └─► line.line_total = quantity × unit_price

Returns:
  True if all checks pass
  Raises ValidationError with details if failed

Example Error:
  "Bill has no line items. Add items before submission."
  "Line 2 has invalid quantity (0). Remove or update."
```

### Totals Validation

```
_validate_totals_calculated(bill)
═════════════════════════════════

Checks:
1. Subtotal matches line totals sum
   actual_subtotal = sum(line.line_total for all lines)
   └─► bill.subtotal == actual_subtotal

2. Tax amount calculated
   └─► bill.tax_amount >= 0

3. Total amount correct
   └─► bill.total_amount == bill.subtotal + bill.tax_amount

Tolerance: ±0.01 (for rounding)

Example Error:
  "Bill totals inconsistent. Subtotal mismatch."
  "Expected: 45,000.00, Found: 44,500.00"
  "Recalculate totals before submission."
```

### Payment Validation

```
_validate_no_payments(bill)
═══════════════════════════

Checks:
1. No payment records exist
   └─► Payment.objects.filter(bill=bill).count() == 0

2. Amount paid is zero
   └─► bill.amount_paid == 0

Required before:
  • Cancellation
  • Disputed → Cancelled transition
  • Bill deletion

Example Error:
  "Cannot cancel bill with recorded payments."
  "Bill has 2 payment(s) totaling 15,000.00 LKR."
```

### Validation Integration

```
Example: submit_bill with Validation
═════════════════════════════════════

def submit_bill(self, bill_id, user):
    with transaction.atomic():
        # 1. Get bill
        bill = self._get_queryset().get(id=bill_id)
        
        # 2. Validate transition allowed
        self._validate_status_transition(bill, 'PENDING')
        
        # 3. Validate preconditions
        self._validate_has_line_items(bill)
        self._validate_totals_calculated(bill)
        
        # 4. Check vendor active
        if not bill.vendor.is_active:
            raise ValidationError("Vendor is inactive")
        
        # 5. Check user permission
        self._validate_user_permissions(user, 'submit_bill')
        
        # 6. All validations passed - apply transition
        bill.status = 'PENDING'
        bill.submitted_at = timezone.now()
        bill.submitted_by = user
        bill.save()
        
        return bill
```

### Expected Outcome
- Robust status transition validation
- Clear validation error messages
- Prevention of invalid state changes
- Protection of terminal statuses
- Precondition enforcement
- Helpful user guidance

### Verification Checklist
- [ ] ALLOWED_TRANSITIONS constant defined
- [ ] _validate_status_transition method created
- [ ] Terminal status checks implemented
- [ ] Precondition validators added
- [ ] _validate_has_line_items method created
- [ ] _validate_totals_calculated method created
- [ ] _validate_no_payments method created
- [ ] Error messages clear and helpful
- [ ] All transition methods use validation
- [ ] Invalid transitions blocked
- [ ] Valid transitions allowed
- [ ] Terminal statuses protected

---

## Task 40: Implement Bill Approval Workflow

### Overview
Implement the bill approval workflow system that determines when bills require approval, checks approval authority, enforces approval thresholds, and manages multi-level approval processes. This ensures proper authorization before payment processing.

### Dependencies
- Task 38: Implement Bill Status Transitions
- Task 39: Add Status Transition Validation
- BillSettings model (from next document)
- User permissions system

### Instructions

1. **Define _requires_approval method**
   - Accept bill parameter
   - Check BillSettings for tenant
   - Determine if bill requires approval based on:
     - require_approval setting
     - approval_threshold amount
     - bill.total_amount
   - Return boolean result

2. **Implement approval threshold logic**
   - Get tenant's approval_threshold from BillSettings
   - Compare bill.total_amount with threshold
   - If total >= threshold, require approval
   - If total < threshold, may auto-approve (configurable)
   - Handle case where threshold not set

3. **Define _check_approval_authority method**
   - Accept user and bill parameters
   - Check user's approval authority level
   - Validate user can approve bills of this amount
   - Consider user role and approval limits
   - Return validation result

4. **Implement approval authority levels**
   - Define approval levels (e.g., Manager, Director, CFO)
   - Map levels to maximum approval amounts
   - Store in user profile or permission system
   - Check user's level against bill amount

5. **Add _set_requires_approval flag**
   - Called during bill creation
   - Called when bill amount changes
   - Set bill.requires_approval based on threshold check
   - Update bill automatically

6. **Implement auto-approval for matched bills**
   - Check auto_approve_matched setting
   - If bill matches PO exactly (quantity, price)
   - If bill amount below threshold
   - Auto-approve without manual review
   - Log auto-approval action

7. **Add approval notification system**
   - Identify approvers for bill amount
   - Send notification when bill submitted
   - Include bill details in notification
   - Provide approval link/action
   - Track notification sent

8. **Implement approval delegation**
   - Allow approvers to delegate authority
   - Define delegation rules
   - Track delegated approvals
   - Maintain audit trail of delegation

9. **Add approval comments/notes**
   - Allow approver to add notes
   - Store approval_notes field
   - Display notes in bill history
   - Include in audit trail

10. **Integrate with approve_bill method**
    - Check requires_approval before allowing approval
    - Validate user has authority
    - Record approval details
    - Update bill status
    - Trigger post-approval actions

### Approval Workflow Logic

```
┌──────────────────────────────────────────────────────────────┐
│              Bill Approval Workflow                          │
└──────────────────────────────────────────────────────────────┘

Bill Created/Updated
        │
        ▼
┌─────────────────┐
│ Calculate Total │
└────────┬────────┘
         │
         ▼
┌──────────────────────────┐
│ Get Approval Threshold   │  ← From BillSettings
└────────┬─────────────────┘
         │
         ▼
    ╔═══════════════════════════════╗
    ║ total >= threshold?           ║
    ╚═══╤═══════════════════════╤═══╝
        │ YES                   │ NO
        ▼                       ▼
┌──────────────────┐   ┌──────────────────┐
│requires_approval │   │ No approval      │
│= True            │   │ required         │
└────────┬─────────┘   └────────┬─────────┘
         │                      │
         │                      ▼
         │              ┌──────────────────┐
         │              │ Can proceed to   │
         │              │ payment directly │
         │              └──────────────────┘
         │
         ▼
┌─────────────────┐
│ Submit for      │
│ Approval        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Notify Approver │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Await Approval  │
│ Status: PENDING │
└────────┬────────┘
         │
         ▼
    ╔═══════════════╗
    ║ Approved?     ║
    ╚═══╤═══════╤═══╝
        │ YES   │ NO
        ▼       ▼
┌───────────┐ ┌────────────┐
│ APPROVED  │ │ DISPUTED / │
│           │ │ CANCELLED  │
└───────────┘ └────────────┘
```

### Approval Threshold Configuration

```
BillSettings Example
════════════════════

Tenant: ABC Company

Settings:
├─► require_approval = True
├─► approval_threshold = 100,000.00 LKR
├─► auto_approve_matched = True
└─► approval_levels = {
    "Manager": 100,000.00,
    "Director": 500,000.00,
    "CFO": Unlimited
}

Application:
───────────
Bill Amount: 75,000.00 LKR
  └─► Below threshold
  └─► No approval required ✓

Bill Amount: 150,000.00 LKR
  └─► Above threshold
  └─► Approval required
  └─► Notify Manager ✓

Bill Amount: 450,000.00 LKR
  └─► Above Manager limit
  └─► Notify Director ✓

Bill Amount: 2,000,000.00 LKR
  └─► Above Director limit
  └─► Notify CFO ✓
```

### Approval Authority Levels

| Level | Max Approval Amount | User Roles |
|-------|---------------------|------------|
| **Supervisor** | 50,000 LKR | Team Lead, Supervisor |
| **Manager** | 100,000 LKR | Department Manager |
| **Director** | 500,000 LKR | Director, Senior Manager |
| **CFO** | 2,000,000 LKR | CFO, Finance Director |
| **CEO** | Unlimited | CEO, MD |

### Approval Authority Validation

```
_check_approval_authority(user, bill)
═════════════════════════════════════

Step 1: Get user's approval level
  └─► user.profile.approval_level
      e.g., "Manager"

Step 2: Get user's approval limit
  └─► user.profile.approval_limit
      e.g., 100,000.00 LKR

Step 3: Compare with bill total
  └─► bill.total_amount = 150,000.00 LKR

Step 4: Validate
  └─► 150,000.00 > 100,000.00
  └─► User CANNOT approve ✗

Result:
  ValidationError: "Your approval limit is 100,000.00 LKR.
                    This bill requires Director approval."

─────────────────────────────────────

Example: Sufficient Authority

User: Director
Approval Limit: 500,000.00 LKR
Bill Amount: 325,000.00 LKR

Validation:
  └─► 325,000.00 < 500,000.00 ✓
  └─► User CAN approve ✓
```

### Auto-Approval Logic

```
Auto-Approval Conditions
════════════════════════

Condition 1: Setting Enabled
  └─► BillSettings.auto_approve_matched = True

Condition 2: Bill from PO
  └─► bill.purchase_order is not null

Condition 3: Perfect Match
  ├─► All line quantities match GRN exactly
  ├─► All line prices match PO exactly
  └─► No discrepancies

Condition 4: Below Threshold
  └─► bill.total_amount < approval_threshold

If ALL conditions met:
  ├─► Auto-approve bill
  ├─► Set status = APPROVED
  ├─► Set approved_by = System
  ├─► Set approved_at = now()
  └─► Log auto-approval

Example:
───────
PO-2026-00001 → BILL-2026-00100
• PO Line 1: 100 units @ 150.00 = 15,000.00
• GRN Line 1: 100 units received
• Bill Line 1: 100 units @ 150.00 = 15,000.00
  └─► Perfect match ✓
• Total: 15,000.00 < 100,000.00 threshold ✓
  └─► AUTO-APPROVED ✓
```

### Approval Notification

```
Notification Details
════════════════════

To: approver@company.com
Subject: Bill Approval Required - BILL-2026-00050

Body:
╔══════════════════════════════════════════════════╗
║       Bill Approval Required                     ║
╠══════════════════════════════════════════════════╣
║                                                  ║
║ Bill Number: BILL-2026-00050                     ║
║ Vendor: ABC Suppliers Ltd.                       ║
║ Date: 2026-01-24                                 ║
║ Due Date: 2026-02-23                             ║
║ Total Amount: 325,000.00 LKR                     ║
║                                                  ║
║ Purchase Order: PO-2026-00015                    ║
║ Submitted By: john.doe@company.com               ║
║ Submitted At: 2026-01-24 10:30 AM                ║
║                                                  ║
║ Line Items: 8                                    ║
║ Subtotal: 300,000.00 LKR                         ║
║ Tax (8%): 25,000.00 LKR                          ║
║ Total: 325,000.00 LKR                            ║
║                                                  ║
║ [View Bill] [Approve] [Request Changes]         ║
║                                                  ║
╚══════════════════════════════════════════════════╝
```

### Approval Delegation

```
Delegation Scenario
═══════════════════

Primary Approver: Jane Smith (Director)
Delegate: Bob Jones (Senior Manager)

Delegation Settings:
├─► Effective From: 2026-01-20
├─► Effective To: 2026-01-30
├─► Max Amount: 300,000.00 LKR
└─► Reason: "On business trip"

During delegation period:
  Bills requiring Director approval (≤300K)
    └─► Routed to Bob Jones
    └─► Bob can approve on behalf of Jane
    └─► Recorded as: "Approved by Bob Jones 
                      (delegated by Jane Smith)"

After delegation period:
  └─► Automatic revert to Jane Smith
```

### Approval with Comments

```
approve_bill(bill_id, notes, user)
══════════════════════════════════

Input:
  bill_id = "BILL-2026-00050"
  notes = "Verified with PO. Prices correct.
           Approved for payment."
  user = director@company.com

Process:
  1. Validate user authority
  2. Change status to APPROVED
  3. Set approved_by = user
  4. Set approved_at = now()
  5. Save approval_notes = notes
  6. Log approval with notes

Result:
  Bill BILL-2026-00050 approved
  
  Approval Details:
    Approved By: Jane Smith (Director)
    Approved At: 2026-01-24 14:45:00
    Notes: "Verified with PO. Prices correct.
            Approved for payment."
```

### Expected Outcome
- Functional approval workflow system
- Threshold-based approval requirement
- Approval authority validation
- Auto-approval for matched bills
- Notification system for approvers
- Delegation support
- Approval comments/notes
- Complete audit trail

### Verification Checklist
- [ ] _requires_approval method defined
- [ ] Approval threshold logic implemented
- [ ] _check_approval_authority method added
- [ ] Approval authority levels defined
- [ ] _set_requires_approval flag implemented
- [ ] Auto-approval logic added
- [ ] Approval notifications implemented
- [ ] Approval delegation supported
- [ ] Approval comments/notes added
- [ ] Integration with approve_bill complete
- [ ] All approval rules enforced
- [ ] Audit trail complete

---

## Summary

This document established the BillService class and core bill creation and status management workflows:

### Completed Infrastructure
- ✅ BillService class with helper methods
- ✅ Create bill from PO workflow
- ✅ Auto-fill line items from PO/GRN data
- ✅ Manual bill creation (no PO)
- ✅ Bill editing (DRAFT/PENDING only)
- ✅ Status transitions (submit, approve, dispute, cancel)
- ✅ Status transition validation
- ✅ Bill approval workflow with thresholds

### Key Achievements
1. **Service Layer Architecture** - Centralized business logic
2. **Automated Bill Creation** - From PO and GRN data
3. **Flexible Manual Entry** - For non-PO expenses
4. **State Machine** - Robust status lifecycle management
5. **Validation Framework** - Prevents invalid state transitions
6. **Approval System** - Threshold-based with authority levels
7. **Transaction Safety** - All mutations are atomic
8. **Audit Trail** - User and timestamp tracking

### Status Transitions Implemented

```
DRAFT → PENDING → APPROVED → PARTIAL_PAID → PAID
  │       │          │
  │       │          └──► DISPUTED
  │       │
  │       └──► DISPUTED → CANCELLED
  │
  └──► CANCELLED
```

### Next Steps
Proceed to [02_Tasks-41-48_History-Settings-Duplicate-Dispute.md](02_Tasks-41-48_History-Settings-Duplicate-Dispute.md) to implement:
- BillHistory model for audit trail
- BillSettings model for tenant configuration
- Bill duplication functionality
- Bill dispute workflow details
- Bill calculation service

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8 (Tasks 33-40)  
**Estimated Time:** 3.5 hours  
**Total Lines:** ~1390
