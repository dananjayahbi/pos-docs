# Tasks 35-42: PO Service, Creation, and Status Transitions

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** C - PO Creation & Sending  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-43-48_Approval-History-Settings.md](02_Tasks-43-48_Approval-History-Settings.md)

---

## Document Overview

This document implements the POService class that handles purchase order business operations, including manual PO creation, automated creation from reorder suggestions and low stock reports, PO duplication, editing, and status transitions with validation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create POService Class | High | 30 min |
| 36 | Implement Manual PO Creation | Medium | 25 min |
| 37 | Implement PO from Reorder Suggestions | High | 35 min |
| 38 | Implement PO from Low Stock Report | Medium | 25 min |
| 39 | Implement PO Duplication | Medium | 20 min |
| 40 | Implement PO Editing | Medium | 25 min |
| 41 | Implement PO Status Transitions | High | 30 min |
| 42 | Add Status Transition Validation | Medium | 25 min |

---

## Task 35: Create POService Class

### Overview
Create the main POService class that encapsulates all purchase order business logic and operations. This service layer separates business rules from models and provides a clean API for PO operations.

### Dependencies
- Group A: PurchaseOrder model complete
- Group B: POLineItem model and calculations complete

### Instructions

1. **Create po_service.py file**
   - Navigate to `apps/purchases/services/` directory
   - Create `po_service.py` file
   - Add comprehensive module docstring

2. **Import required dependencies**
   - Import Django transaction module
   - Import PurchaseOrder, POLineItem models
   - Import Vendor, Product models
   - Import User model
   - Import POCalculationService
   - Import timezone utilities

3. **Define POService class**
   - Create class with class methods or instance methods
   - Add detailed class docstring
   - Explain service purpose and responsibilities

4. **Add service initialization**
   - Define __init__ if using instance methods
   - Accept tenant parameter if needed
   - Set up any required service state

5. **Define method structure**
   - Plan methods for creation, editing, transitions
   - Use consistent naming conventions
   - Add type hints for parameters

6. **Add error handling base**
   - Create custom exceptions for PO operations
   - PONotEditableError, InvalidStatusTransitionError
   - InvalidDataError

7. **Add logging setup**
   - Import Python logging module
   - Create logger for POService
   - Log all major operations

8. **Update services __init__.py**
   - Import POService class
   - Export for use across application

### POService Class Structure

```
POService
├── Creation Methods
│   ├── create_manual_po(vendor_id, lines, user, **kwargs)
│   ├── create_from_reorder_suggestions(suggestions, user)
│   ├── create_from_low_stock(products, user)
│   └── duplicate_po(po_id, user)
│
├── Editing Methods
│   ├── update_po(po_id, data, user)
│   ├── add_line_item(po_id, line_data, user)
│   └── remove_line_item(line_id, user)
│
├── Status Transition Methods
│   ├── send_po(po_id, user)
│   ├── acknowledge_po(po_id, vendor_reference, user)
│   ├── cancel_po(po_id, reason, user)
│   └── close_po(po_id, user)
│
├── Advanced Operations
│   ├── split_by_vendor(products, user)
│   └── consolidate_pos(po_ids, user)
│
└── Validation Methods
    ├── validate_status_transition(po, new_status)
    └── can_edit_po(po)
```

### Service Responsibilities

| Responsibility | Description |
|----------------|-------------|
| Business Logic | Encapsulate PO rules |
| Validation | Validate operations before execution |
| Transactions | Ensure data consistency |
| Calculations | Trigger recalculations |
| History | Log all changes |
| Notifications | Trigger events |

### Custom Exceptions

```python
class POServiceException(Exception):
    """Base exception for PO service"""
    pass

class PONotEditableError(POServiceException):
    """PO cannot be edited in current status"""
    pass

class InvalidStatusTransitionError(POServiceException):
    """Invalid status transition attempted"""
    pass

class POValidationError(POServiceException):
    """PO data validation failed"""
    pass
```

### Expected Outcome
- Centralized PO business logic
- Clean service API
- Proper error handling
- Consistent operations

### Verification Checklist
- [ ] po_service.py file created
- [ ] POService class defined
- [ ] Custom exceptions created
- [ ] Logging configured
- [ ] Service exported in __init__.py

---

## Task 36: Implement Manual PO Creation

### Overview
Implement manual purchase order creation that allows users to create POs from scratch with vendor selection, line items, and all PO details.

### Dependencies
- Task 35: Create POService Class

### Instructions

1. **Implement create_manual_po method**
   - Accept vendor_id, line_items, user, and optional kwargs
   - Validate vendor exists and is active
   - Create PurchaseOrder instance
   - Create POLineItem instances
   - Return created PO

2. **Validate input data**
   - Check vendor_id is valid UUID
   - Ensure vendor is active
   - Validate line_items list not empty
   - Check required line item fields

3. **Create PurchaseOrder**
   - Set vendor foreign key
   - Set created_by to user
   - Set status to DRAFT
   - Set order_date to today
   - Apply optional kwargs (shipping, payment terms, etc.)
   - Generate po_number automatically

4. **Create line items**
   - Iterate through line_items list
   - Create POLineItem for each
   - Set line_number sequentially
   - Link to created PO
   - Calculate line totals

5. **Apply default values**
   - Set default payment terms from vendor
   - Set default shipping method
   - Set default receiving warehouse
   - Calculate expected delivery from vendor lead time

6. **Trigger calculations**
   - Call POCalculationService.recalculate_po()
   - Ensure all totals computed
   - Save final PO state

7. **Log creation**
   - Create POHistory entry
   - Log CREATED action
   - Store user information

8. **Return result**
   - Return PurchaseOrder instance
   - Include success message
   - Provide po_number for reference

### Create Manual PO Flow

```
Input Data:
├── vendor_id: UUID
├── line_items: [
│     {product_id, quantity, unit_price},
│     {product_id, quantity, unit_price},
│   ]
├── user: User instance
└── kwargs: {shipping_method, payment_terms, notes, ...}

Process:
1. Validate vendor
2. Create PurchaseOrder (status=DRAFT)
3. Generate PO number
4. Create POLineItems
5. Calculate totals
6. Log history
7. Return PO
```

### Line Item Structure

```python
line_items = [
    {
        'product_id': 'uuid',
        'variant_id': 'uuid',  # optional
        'quantity_ordered': 10,
        'unit_price': 85000.00,
        'discount_percentage': 5.0,
        'tax_rate': 18.0,
        'vendor_sku': 'ABC-TV-55',  # optional
    },
    # ... more items
]
```

### Default Value Application

| Field | Default Source | Example |
|-------|----------------|---------|
| payment_terms | Vendor default | Net 30 |
| expected_delivery_date | order_date + vendor.lead_time | Today + 10 days |
| receiving_warehouse | Company default | Main Warehouse |
| currency | Tenant default | LKR |

### Validation Rules

| Rule | Check |
|------|-------|
| Vendor active | vendor.is_active = True |
| Vendor not deleted | vendor exists |
| Line items present | len(line_items) > 0 |
| Valid quantities | quantity > 0 |
| Valid prices | unit_price >= 0 |

### Expected Outcome
- PO created successfully
- All line items added
- Totals calculated
- Status set to DRAFT

### Verification Checklist
- [ ] create_manual_po method implemented
- [ ] Input validation added
- [ ] PurchaseOrder creation logic complete
- [ ] Line items creation working
- [ ] Default values applied
- [ ] Calculations triggered
- [ ] History logged

---

## Task 37: Implement PO from Reorder Suggestions

### Overview
Implement automated PO creation from reorder suggestions generated by the inventory system. This groups products by preferred vendor and creates appropriate POs.

### Dependencies
- Task 36: Implement Manual PO Creation
- Reorder suggestion system exists (from inventory)

### Instructions

1. **Implement create_from_reorder_suggestions method**
   - Accept list of reorder suggestions
   - Accept user parameter
   - Group suggestions by preferred vendor
   - Create separate PO for each vendor
   - Return list of created POs

2. **Validate reorder suggestions**
   - Ensure suggestions list not empty
   - Check each suggestion has required fields
   - Validate product exists
   - Confirm preferred vendor set

3. **Group by vendor**
   - Create dictionary grouped by vendor_id
   - Collect products for each vendor
   - Maintain quantities and specifications

4. **Create POs for each vendor**
   - Iterate through vendor groups
   - Call create_manual_po for each vendor
   - Include all products for that vendor
   - Use suggested quantities

5. **Apply reorder logic**
   - Use reorder_quantity from suggestion
   - Calculate quantity to reach reorder level
   - Consider economic order quantity if available

6. **Set PO details**
   - Add notes mentioning reorder source
   - Mark as auto-generated
   - Set expected delivery based on urgency

7. **Handle missing preferred vendor**
   - Use alternative vendor if available
   - Skip product if no vendor available
   - Log warnings for manual review

8. **Return results**
   - Return list of created POs
   - Include summary of items per PO
   - Report any skipped items

### Reorder Suggestion Structure

```python
suggestions = [
    {
        'product_id': 'uuid',
        'product_name': 'Samsung TV 55"',
        'current_stock': 5,
        'reorder_level': 20,
        'reorder_quantity': 50,
        'preferred_vendor_id': 'uuid',
        'preferred_vendor_name': 'ABC Electronics',
        'suggested_unit_price': 85000.00,
    },
    # ... more suggestions
]
```

### Grouping by Vendor Logic

```
Reorder Suggestions:
├── Product A → Vendor ABC
├── Product B → Vendor ABC
├── Product C → Vendor XYZ
└── Product D → Vendor ABC

Grouped:
├── Vendor ABC:
│   ├── Product A (Qty: 50)
│   ├── Product B (Qty: 30)
│   └── Product D (Qty: 20)
│
└── Vendor XYZ:
    └── Product C (Qty: 40)

Result:
├── PO-2026-00001 (Vendor ABC, 3 items, 100 total units)
└── PO-2026-00002 (Vendor XYZ, 1 item, 40 units)
```

### Reorder Quantity Calculation

| Scenario | Calculation |
|----------|-------------|
| Below reorder level | reorder_quantity |
| At reorder level | reorder_quantity |
| Economic order quantity | Use EOQ if set |
| Minimum order | max(reorder_qty, vendor_minimum) |

### PO Notes for Reorder

```
notes = "Auto-generated from reorder suggestions"
internal_notes = f"Created from {len(suggestions)} reorder suggestions"
```

### Expected Outcome
- Multiple POs created automatically
- Products grouped by vendor
- Appropriate quantities ordered
- Efficient procurement process

### Verification Checklist
- [ ] create_from_reorder_suggestions implemented
- [ ] Vendor grouping logic added
- [ ] PO creation for each vendor
- [ ] Reorder quantities applied
- [ ] Missing vendor handling
- [ ] Results summary returned

---

## Task 38: Implement PO from Low Stock Report

### Overview
Implement PO creation from low stock reports that identify products needing immediate restock. Similar to reorder suggestions but may include different prioritization.

### Dependencies
- Task 36: Implement Manual PO Creation

### Instructions

1. **Implement create_from_low_stock method**
   - Accept list of low stock products
   - Accept user parameter
   - Group by preferred vendor
   - Create POs with appropriate quantities
   - Return created POs

2. **Validate low stock data**
   - Ensure product list not empty
   - Validate each product exists
   - Check current stock levels
   - Confirm vendor availability

3. **Calculate order quantities**
   - Use product reorder_quantity if set
   - Calculate to reach target stock level
   - Consider minimum order quantities
   - Apply lead time considerations

4. **Prioritize urgent items**
   - Sort by criticality if provided
   - Handle out-of-stock vs low stock differently
   - Set expedited shipping for urgent items

5. **Group by vendor**
   - Same logic as reorder suggestions
   - Create one PO per vendor
   - Optimize for vendor minimums

6. **Set urgency flags**
   - Mark POs as urgent if needed
   - Add priority notes
   - Request faster delivery

7. **Return results**
   - List of created POs
   - Urgency indicators
   - Items requiring attention

### Low Stock Data Structure

```python
low_stock_products = [
    {
        'product_id': 'uuid',
        'product_name': 'Critical Item',
        'current_stock': 0,  # OUT OF STOCK
        'target_stock': 50,
        'preferred_vendor_id': 'uuid',
        'urgency': 'critical',  # critical, high, medium
    },
    # ... more products
]
```

### Quantity Calculation

```
Order Quantity = target_stock - current_stock + safety_buffer

Example:
Current: 5
Target: 50
Safety: 10
Order: 50 - 5 + 10 = 55 units
```

### Urgency Handling

| Urgency | Action |
|---------|--------|
| Critical (out of stock) | Expedited shipping, note in PO |
| High (< 10% of target) | Priority delivery, urgent flag |
| Medium (< 30% of target) | Standard delivery |

### Expected Outcome
- Quick PO creation for low stock
- Appropriate quantities ordered
- Urgency properly flagged
- Stock replenishment initiated

### Verification Checklist
- [ ] create_from_low_stock implemented
- [ ] Quantity calculation logic added
- [ ] Urgency handling included
- [ ] Vendor grouping working
- [ ] Priority flags set

---

## Task 39: Implement PO Duplication

### Overview
Implement PO duplication that creates a new draft PO based on an existing PO, copying all line items and details while resetting status and dates.

### Dependencies
- Task 36: Implement Manual PO Creation

### Instructions

1. **Implement duplicate_po method**
   - Accept po_id to duplicate
   - Accept user performing duplication
   - Load source PO with line items
   - Create new PO as copy
   - Return new draft PO

2. **Load source PO**
   - Query PurchaseOrder by ID
   - Prefetch line_items for efficiency
   - Validate PO exists

3. **Create new PO**
   - Copy vendor, shipping, payment terms
   - Copy notes (except internal notes)
   - Reset status to DRAFT
   - Set new order_date to today
   - Clear po_number (will be auto-generated)
   - Set created_by to current user

4. **Copy line items**
   - Iterate through source line_items
   - Create new POLineItem for each
   - Copy product, quantities, prices
   - Reset received quantities to 0
   - Reset status to PENDING
   - Maintain line_number sequence

5. **Reset fields**
   - Clear acknowledged_at, received_at
   - Clear approved_at, approved_by
   - Clear PDF file reference
   - Clear vendor_reference

6. **Calculate new totals**
   - Trigger recalculation
   - Ensure totals match source

7. **Add duplication note**
   - Add to internal_notes
   - Reference source PO number
   - Note duplication date and user

8. **Return new PO**
   - Return duplicated PurchaseOrder
   - Include new po_number

### Duplication Mapping

| Source Field | Duplicate Field | Action |
|--------------|-----------------|--------|
| vendor | vendor | Copy |
| line_items | line_items | Copy (new instances) |
| payment_terms | payment_terms | Copy |
| shipping_method | shipping_method | Copy |
| status | status | Set to DRAFT |
| po_number | po_number | Generate new |
| order_date | order_date | Set to today |
| created_by | created_by | Set to current user |
| quantity_received | quantity_received | Reset to 0 |

### Duplication Flow

```
Source PO: PO-2026-00001
├── Vendor: ABC Electronics
├── Line Items: 3
├── Status: RECEIVED
└── Total: Rs. 1,200,000

Duplicate:
├── Vendor: ABC Electronics (copied)
├── Line Items: 3 (new instances)
├── Status: DRAFT (reset)
├── PO Number: PO-2026-00050 (new)
└── Total: Rs. 1,200,000 (recalculated)
```

### Expected Outcome
- New draft PO created
- All line items copied
- Status and dates reset
- Ready for editing and sending

### Verification Checklist
- [ ] duplicate_po method implemented
- [ ] Source PO loaded correctly
- [ ] New PO created with copies
- [ ] Line items duplicated
- [ ] Fields reset appropriately
- [ ] Totals recalculated

---

## Task 40: Implement PO Editing

### Overview
Implement PO editing capability that allows modifications to draft POs while preventing changes to sent or received POs. Support adding, updating, and removing line items.

### Dependencies
- Task 35: Create POService Class

### Instructions

1. **Implement update_po method**
   - Accept po_id and update data dictionary
   - Accept user parameter
   - Validate PO is editable
   - Apply updates
   - Return updated PO

2. **Check editability**
   - Verify status is DRAFT
   - Confirm not approved (if requires approval)
   - Check user has permission
   - Raise PONotEditableError if not editable

3. **Validate update data**
   - Check allowed fields being updated
   - Validate data types and values
   - Ensure business rules maintained

4. **Apply updates**
   - Update allowed fields on PO
   - Trigger recalculation if financial fields changed
   - Save PurchaseOrder

5. **Implement add_line_item method**
   - Accept po_id and line item data
   - Validate PO is editable
   - Create new POLineItem
   - Assign next line_number
   - Trigger recalculation

6. **Implement update_line_item method**
   - Accept line_id and update data
   - Validate parent PO is editable
   - Update line item fields
   - Recalculate if quantities/prices changed

7. **Implement remove_line_item method**
   - Accept line_id to remove
   - Validate parent PO is editable
   - Delete POLineItem
   - Trigger PO recalculation

8. **Log all changes**
   - Create POHistory entries
   - Record what changed
   - Store user and timestamp

### Editable Status Check

```python
def can_edit_po(po):
    """Check if PO can be edited"""
    if po.status != 'DRAFT':
        return False
    if po.requires_approval and po.approved_at:
        return False
    return True
```

### Allowed Updates by Status

| Status | Can Update PO | Can Add/Remove Lines | Can Change Quantities |
|--------|---------------|----------------------|----------------------|
| DRAFT | ✓ All fields | ✓ Yes | ✓ Yes |
| SENT | ✗ No | ✗ No | ✗ No |
| ACKNOWLEDGED | ✗ No | ✗ No | ✗ No |
| RECEIVED | ✗ No | ✗ No | ✗ No |

### Update Flow

```
Update PO Request:
1. Load PurchaseOrder
2. Check can_edit_po()
3. If not editable → Raise error
4. Validate update data
5. Apply updates
6. Recalculate if needed
7. Log history
8. Return updated PO
```

### Expected Outcome
- Draft POs can be edited
- Non-draft POs protected
- Line items manageable
- All changes logged

### Verification Checklist
- [ ] update_po method implemented
- [ ] Editability check added
- [ ] add_line_item method working
- [ ] update_line_item functional
- [ ] remove_line_item implemented
- [ ] Changes logged

---

## Task 41: Implement PO Status Transitions

### Overview
Implement status transition methods that move POs through their lifecycle: send to vendor, acknowledge receipt, receive goods, cancel, and close.

### Dependencies
- Task 35: Create POService Class

### Instructions

1. **Implement send_po method**
   - Change status from DRAFT to SENT
   - Validate PO is complete
   - Check approval if required
   - Generate PDF if not exists
   - Update sent timestamps

2. **Implement acknowledge_po method**
   - Change status from SENT to ACKNOWLEDGED
   - Accept vendor_reference parameter
   - Store vendor's order number
   - Update acknowledged_at timestamp
   - Log acknowledgment

3. **Implement cancel_po method**
   - Change status to CANCELLED
   - Accept cancellation reason
   - Validate cancellation allowed
   - Store reason in notes
   - Update cancelled_at timestamp

4. **Implement close_po method**
   - Change status to CLOSED
   - Validate all items received or cancelled
   - Final status, no further changes
   - Update closed_at timestamp

5. **Add transition validation**
   - Check current status allows transition
   - Verify prerequisites met
   - Ensure data completeness

6. **Update timestamps**
   - Set appropriate timestamp fields
   - Track when transitions occur
   - Maintain audit trail

7. **Log transitions**
   - Create POHistory entry for each
   - Store old and new status
   - Record user and reason

8. **Trigger notifications**
   - Send email on send_po
   - Notify on acknowledgment
   - Alert on cancellation

### Status Transition Methods

| Method | From Status | To Status | Validation |
|--------|-------------|-----------|------------|
| send_po | DRAFT | SENT | Complete, approved if required |
| acknowledge_po | SENT | ACKNOWLEDGED | Vendor reference provided |
| cancel_po | DRAFT, SENT, ACKNOWLEDGED | CANCELLED | Reason required |
| close_po | RECEIVED | CLOSED | All complete |

### send_po Implementation

```python
def send_po(po_id, user):
    """Send PO to vendor"""
    po = PurchaseOrder.objects.get(id=po_id)
    
    # Validate
    if po.status != 'DRAFT':
        raise InvalidStatusTransitionError("Can only send DRAFT POs")
    
    if po.requires_approval and not po.approved_at:
        raise POValidationError("PO requires approval first")
    
    # Transition
    po.status = 'SENT'
    po.sent_at = timezone.now()
    po.sent_by = user
    po.save()
    
    # Generate PDF
    generate_po_pdf(po)
    
    # Send email
    send_po_email(po)
    
    # Log
    log_history(po, 'SENT', user)
    
    return po
```

### Status Transition Diagram

```
DRAFT ──send_po──→ SENT ──acknowledge_po──→ ACKNOWLEDGED
  │                  │                          │
  │                  │                          ├──→ PARTIAL_RECEIVED
  │                  │                          │
  │                  └──cancel_po──→ CANCELLED │
  │                                             └──→ RECEIVED ──close_po──→ CLOSED
  │
  └──cancel_po──→ CANCELLED
```

### Expected Outcome
- Proper status transitions
- Validation enforced
- Timestamps recorded
- History logged

### Verification Checklist
- [ ] send_po method implemented
- [ ] acknowledge_po method implemented
- [ ] cancel_po method implemented
- [ ] close_po method implemented
- [ ] Validation added to each
- [ ] Timestamps updated
- [ ] History logged

---

## Task 42: Add Status Transition Validation

### Overview
Implement comprehensive validation for status transitions to ensure only valid transitions are allowed and all prerequisites are met before changing status.

### Dependencies
- Task 41: Implement PO Status Transitions

### Instructions

1. **Create validation method**
   - Define validate_status_transition method
   - Accept PO and target status
   - Return validation result with errors
   - Raise exception if invalid

2. **Define transition rules**
   - Create STATUS_TRANSITIONS dictionary
   - Map current status to allowed next statuses
   - Include prerequisites for each transition

3. **Implement validation checks**
   - Check transition is allowed
   - Verify prerequisites met
   - Validate data completeness
   - Check user permissions

4. **Add prerequisite checks**
   - Draft to Sent: Has line items, approved if needed
   - Sent to Acknowledged: Valid vendor reference
   - To Cancelled: Has cancellation reason
   - To Closed: All items processed

5. **Validate data completeness**
   - Required fields populated
   - Line items present
   - Totals calculated
   - Vendor active

6. **Add permission checks**
   - User has permission for transition
   - Approver for approval transitions
   - Receiver for receiving transitions

7. **Return validation results**
   - Boolean valid/invalid
   - List of error messages
   - Suggestions for correction

8. **Use in transition methods**
   - Call validate before each transition
   - Raise exception if invalid
   - Provide clear error messages

### Status Transition Rules

```python
STATUS_TRANSITIONS = {
    'DRAFT': {
        'allowed': ['SENT', 'CANCELLED'],
        'prerequisites': {
            'SENT': ['has_line_items', 'is_approved_if_required', 'vendor_active'],
            'CANCELLED': ['has_reason'],
        }
    },
    'SENT': {
        'allowed': ['ACKNOWLEDGED', 'CANCELLED'],
        'prerequisites': {
            'ACKNOWLEDGED': ['has_vendor_reference'],
            'CANCELLED': ['has_reason'],
        }
    },
    'ACKNOWLEDGED': {
        'allowed': ['PARTIAL_RECEIVED', 'RECEIVED', 'CANCELLED'],
        'prerequisites': {
            'PARTIAL_RECEIVED': ['has_grn'],
            'RECEIVED': ['has_grn', 'all_received'],
            'CANCELLED': ['has_reason', 'nothing_received'],
        }
    },
    # ... more rules
}
```

### Validation Method Structure

```python
def validate_status_transition(po, new_status):
    """Validate if status transition is allowed"""
    current = po.status
    
    # Check if transition allowed
    if new_status not in STATUS_TRANSITIONS[current]['allowed']:
        return False, f"Cannot transition from {current} to {new_status}"
    
    # Check prerequisites
    prerequisites = STATUS_TRANSITIONS[current]['prerequisites'][new_status]
    errors = []
    
    for prereq in prerequisites:
        if not check_prerequisite(po, prereq):
            errors.append(f"Prerequisite failed: {prereq}")
    
    if errors:
        return False, errors
    
    return True, None
```

### Prerequisite Checks

| Prerequisite | Check | Purpose |
|--------------|-------|---------|
| has_line_items | len(po.line_items) > 0 | Can't send empty PO |
| is_approved_if_required | Check approval | Governance |
| vendor_active | vendor.is_active | Valid vendor |
| has_vendor_reference | vendor_reference not blank | Tracking |
| has_grn | GRN exists | Receiving proof |
| all_received | All quantities received | Completeness |
| has_reason | reason field populated | Documentation |

### Error Messages

| Validation Failure | Error Message |
|-------------------|---------------|
| No line items | "Cannot send PO without line items" |
| Not approved | "PO requires approval before sending" |
| Invalid transition | "Cannot transition from {current} to {new}" |
| Missing vendor ref | "Vendor reference required for acknowledgment" |
| Incomplete receiving | "Not all items received, cannot close" |

### Expected Outcome
- Robust transition validation
- Clear error messages
- Prevented invalid states
- Enforced business rules

### Verification Checklist
- [ ] validate_status_transition method implemented
- [ ] STATUS_TRANSITIONS rules defined
- [ ] Prerequisite checks added
- [ ] Error messages clear
- [ ] Used in all transition methods
- [ ] Business rules enforced

---

## Summary

This document implemented PO service layer and status management:

| Accomplishment | Impact |
|----------------|--------|
| POService Class | Centralized business logic |
| Manual PO Creation | User-driven creation |
| Automated Creation | Reorder and low stock |
| PO Duplication | Quick reordering |
| PO Editing | Draft modifications |
| Status Transitions | Lifecycle management |
| Validation | Business rule enforcement |

### Next Steps
- **Document 02**: Implement approval workflow, history tracking, and settings
- Add governance and audit capabilities
- Complete Group C

---

## Validation Points

Before proceeding to the next document:
- [ ] All 8 tasks completed
- [ ] POService class functional
- [ ] All creation methods working
- [ ] Status transitions implemented
- [ ] Validation comprehensive
- [ ] History logging added
- [ ] Ready for approval workflow
