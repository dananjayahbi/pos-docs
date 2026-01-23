# Tasks 25-30: Location & Reference Fields

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** B - Stock Movement Tracking  
> **Document:** 02 of 03  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-24_Movement-Types-Model-Structure.md](01_Tasks-19-24_Movement-Types-Model-Structure.md)
- **→ Next Document:** [03_Tasks-31-36_Meta-Manager-Validation-Admin.md](03_Tasks-31-36_Meta-Manager-Validation-Admin.md)

---

## Document Overview

This document adds location tracking, reference fields for linking movements to source documents, cost tracking, and user auditing to the StockMovement model.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 25 | Add location FKs | Medium |
| 26 | Add reason field | Low |
| 27 | Add reference fields | Medium |
| 28 | Add notes field | Low |
| 29 | Add cost_per_unit field | Low |
| 30 | Add created_by FK | Low |

---

## Task 25: Add Location FKs

### Overview
Add source and destination location foreign keys to enable bin-level tracking of stock movements within warehouses.

### Dependencies
- Task 24: Warehouse FKs exist
- SubPhase-08: WarehouseLocation model exists

### Instructions

1. **Add from_location foreign key**
   - ForeignKey to WarehouseLocation model
   - null=True, blank=True (optional, for bin-level tracking)
   - on_delete=SET_NULL (location deleted, movement history preserved)
   - related_name="outgoing_movements"
   - db_index=True

2. **Add to_location foreign key**
   - ForeignKey to WarehouseLocation model
   - null=True, blank=True
   - on_delete=SET_NULL
   - related_name="incoming_movements"
   - db_index=True

3. **Add help text for both fields**
   - from_location: "Specific location within source warehouse (optional)"
   - to_location: "Specific location within destination warehouse (optional)"

4. **Document location tracking levels**
   - Add comments explaining granularity:
     - NULL location: Warehouse-level tracking only
     - Populated location: Bin/location-level tracking
   - Locations must belong to their respective warehouses

5. **Add location validation notes**
   - from_location must belong to from_warehouse (if both populated)
   - to_location must belong to to_warehouse (if both populated)
   - Validate in service layer or clean() method
   - Cannot have location without corresponding warehouse

6. **Consider location transfer scenarios**
   - Same warehouse, different locations (internal transfer)
   - Different warehouses (inter-warehouse transfer)
   - Warehouse level to location level (receive and bin)
   - Location level to warehouse level (pick and stage)

### Location Tracking Levels

| Tracking Level | Warehouse | Location | Use Case |
|----------------|-----------|----------|----------|
| Warehouse Only | Specified | NULL | General warehouse inventory |
| Bin Level | Specified | Specified | Precise bin tracking |

### Location Validation Rules
```
if from_location is not None:
    assert from_warehouse is not None
    assert from_location.warehouse == from_warehouse

if to_location is not None:
    assert to_warehouse is not None
    assert to_location.warehouse == to_warehouse
```

### Movement Location Scenarios

**Scenario 1: Warehouse-level receipt**
```
STOCK_IN:
- from_warehouse: NULL
- from_location: NULL
- to_warehouse: Main Warehouse
- to_location: NULL (receive to warehouse, not specific bin)
```

**Scenario 2: Bin-level receipt**
```
STOCK_IN:
- from_warehouse: NULL
- from_location: NULL
- to_warehouse: Main Warehouse
- to_location: Bin A1-01 (direct to bin)
```

**Scenario 3: Internal location transfer**
```
TRANSFER:
- from_warehouse: Main Warehouse
- from_location: Bin A1-01
- to_warehouse: Main Warehouse (same warehouse)
- to_location: Bin B2-05
```

**Scenario 4: Inter-warehouse transfer with locations**
```
TRANSFER:
- from_warehouse: Main Warehouse
- from_location: Bin A1-01
- to_warehouse: Store A
- to_location: Bin S-01
```

### Expected Field Additions
```python
# Add to StockMovement model:
# 
# from_location = models.ForeignKey(
#     'warehouse.WarehouseLocation',
#     on_delete=models.SET_NULL,
#     null=True,
#     blank=True,
#     related_name='outgoing_movements',
#     db_index=True,
#     help_text="Specific location within source warehouse (optional)"
# )
# 
# to_location = models.ForeignKey(
#     'warehouse.WarehouseLocation',
#     on_delete=models.SET_NULL,
#     null=True,
#     blank=True,
#     related_name='incoming_movements',
#     db_index=True,
#     help_text="Specific location within destination warehouse (optional)"
# )
```

### Verification Checklist
- [ ] from_location FK added
- [ ] to_location FK added
- [ ] Both fields nullable and optional
- [ ] on_delete=SET_NULL to preserve history
- [ ] Appropriate related_names set
- [ ] db_index=True for both fields
- [ ] Help text explains optional nature
- [ ] Comments document validation logic

---

## Task 26: Add Reason Field

### Overview
Add movement reason field to provide specific explanation for each movement, enhancing audit trail and reporting.

### Dependencies
- Task 20: Movement reason constants defined
- Task 21: StockMovement model exists

### Instructions

1. **Add reason field**
   - CharField with reason choices
   - max_length=30
   - Use MOVEMENT_REASON_CHOICES from constants
   - Required field (not null, not blank)

2. **Add help text**
   - help_text="Specific reason for this movement"
   - Clarifies purpose of field

3. **Document reason-type validation**
   - Add comments explaining valid reason per movement type
   - Example: PURCHASE only valid with STOCK_IN
   - Example: SALE only valid with STOCK_OUT

4. **Add validation in clean method** (plan for Task 33)
   - Note: Will validate reason matches movement_type
   - Use lookup dictionary for allowed combinations
   - Raise ValidationError for invalid combinations

5. **Consider custom reason** (optional)
   - If predefined reasons insufficient
   - Add OTHER constant
   - Require notes field when reason is OTHER

### Reason Field Configuration
```python
# Add to StockMovement model:
# reason = models.CharField(
#     max_length=30,
#     choices=MOVEMENT_REASON_CHOICES,
#     help_text="Specific reason for this movement"
# )
```

### Reason Validation Matrix

| Movement Type | Valid Reasons |
|---------------|---------------|
| STOCK_IN | PURCHASE, RETURN_FROM_CUSTOMER, FOUND, CORRECTION |
| STOCK_OUT | SALE, RETURN_TO_SUPPLIER, DAMAGE, THEFT, EXPIRED, WRITE_OFF |
| TRANSFER | TRANSFER_OUT |
| ADJUSTMENT | DAMAGE, THEFT, EXPIRED, FOUND, CORRECTION, WRITE_OFF |
| RESERVED | ORDER_PLACED |
| RELEASED | ORDER_CANCELLED, ORDER_TIMEOUT, MANUAL_RELEASE |

### Validation Logic
```python
# In clean() method:
# VALID_REASON_COMBINATIONS = {
#     STOCK_IN: [PURCHASE, RETURN_FROM_CUSTOMER, FOUND, CORRECTION],
#     STOCK_OUT: [SALE, RETURN_TO_SUPPLIER, DAMAGE, THEFT, EXPIRED, WRITE_OFF],
#     TRANSFER: [TRANSFER_OUT],
#     # ... etc
# }
# 
# if self.reason not in VALID_REASON_COMBINATIONS.get(self.movement_type, []):
#     raise ValidationError("Invalid reason for this movement type")
```

### Verification Checklist
- [ ] reason CharField added
- [ ] Uses MOVEMENT_REASON_CHOICES
- [ ] max_length=30 is sufficient
- [ ] Field is required (not null/blank)
- [ ] Help text explains purpose
- [ ] Comments document validation rules
- [ ] Validation matrix documented

---

## Task 27: Add Reference Fields

### Overview
Add fields to link stock movements to their source documents (orders, purchase orders, stock takes), enabling traceability and integration.

### Dependencies
- Task 21: StockMovement model exists

### Instructions

1. **Add reference_type field**
   - CharField for document type
   - max_length=50
   - Stores type of source document
   - Examples: ORDER, PURCHASE_ORDER, STOCK_TAKE, ADJUSTMENT, MANUAL

2. **Create reference type constants**
   - Add to constants.py
   - REF_ORDER: "ORDER"
   - REF_PURCHASE_ORDER: "PURCHASE_ORDER"
   - REF_STOCK_TAKE: "STOCK_TAKE"
   - REF_ADJUSTMENT: "ADJUSTMENT"
   - REF_TRANSFER: "TRANSFER"
   - REF_MANUAL: "MANUAL"

3. **Add reference_id field**
   - CharField or PositiveIntegerField
   - Stores ID of source document
   - Can be string for flexibility (order numbers, PO numbers)
   - null=True, blank=True (not all movements have references)

4. **Add reference_number field** (optional)
   - CharField for human-readable reference
   - Example: PO-2026-001, ORD-1234
   - null=True, blank=True
   - Useful for display and searching

5. **Add help text for reference fields**
   - reference_type: "Type of source document (ORDER, PURCHASE_ORDER, etc.)"
   - reference_id: "ID of the source document"
   - reference_number: "Human-readable reference number"

6. **Document reference usage patterns**
   - STOCK_IN from purchase: reference_type=PURCHASE_ORDER, reference_id=PO.id
   - STOCK_OUT from sale: reference_type=ORDER, reference_id=Order.id
   - ADJUSTMENT from stock take: reference_type=STOCK_TAKE, reference_id=StockTake.id
   - Manual movements: reference_type=MANUAL, reference_id=NULL

7. **Consider GenericForeignKey** (advanced alternative)
   - Django's GenericForeignKey for polymorphic references
   - More complex but type-safe
   - Requires ContentType framework
   - May be overkill for this use case

8. **Add reference lookup methods** (plan for manager)
   - Method to get all movements for an order
   - Method to get all movements for a purchase order
   - Filter by reference_type and reference_id

### Reference Fields Configuration
```python
# Add to StockMovement model:
# 
# reference_type = models.CharField(
#     max_length=50,
#     null=True,
#     blank=True,
#     help_text="Type of source document (ORDER, PURCHASE_ORDER, etc.)"
# )
# 
# reference_id = models.CharField(
#     max_length=100,
#     null=True,
#     blank=True,
#     help_text="ID of the source document"
# )
# 
# reference_number = models.CharField(
#     max_length=100,
#     null=True,
#     blank=True,
#     help_text="Human-readable reference number"
# )
```

### Reference Type Constants
```python
# Add to constants.py:
# 
# # Reference Types
# REF_ORDER = 'ORDER'
# REF_PURCHASE_ORDER = 'PURCHASE_ORDER'
# REF_STOCK_TAKE = 'STOCK_TAKE'
# REF_ADJUSTMENT = 'ADJUSTMENT'
# REF_TRANSFER = 'TRANSFER'
# REF_MANUAL = 'MANUAL'
```

### Reference Patterns

| Movement | Reference Type | Reference ID | Reference Number |
|----------|----------------|--------------|------------------|
| Purchase receipt | PURCHASE_ORDER | PO.id | PO-2026-001 |
| Order fulfillment | ORDER | Order.id | ORD-1234 |
| Stock take adjustment | STOCK_TAKE | StockTake.id | ST-2026-01 |
| Manual adjustment | ADJUSTMENT | Adjustment.id | ADJ-001 |
| Manual transfer | TRANSFER | Transfer.id | TRF-001 |
| No reference | MANUAL | NULL | NULL |

### Verification Checklist
- [ ] reference_type CharField added
- [ ] reference_id field added (string for flexibility)
- [ ] reference_number field added (optional)
- [ ] All reference fields nullable
- [ ] Reference type constants defined
- [ ] Help text explains each field
- [ ] Comments document usage patterns

---

## Task 28: Add Notes Field

### Overview
Add a text field for additional notes and explanations about the movement, particularly useful for adjustments and manual operations.

### Dependencies
- Task 21: StockMovement model exists

### Instructions

1. **Add notes field**
   - TextField for free-form text
   - null=True, blank=True (optional)
   - No max_length (unlimited text)
   - Stores additional context and explanations

2. **Add help text**
   - help_text="Additional notes about this movement"
   - Encourages documenting rationale

3. **Document recommended notes usage**
   - Add comments on when notes are important:
     - CORRECTION adjustments: Always explain why
     - DAMAGE: Describe nature of damage
     - THEFT: Incident details
     - MANUAL operations: Explain reason
     - Large quantity movements: Document authorization

4. **Consider notes requirements** (optional)
   - For certain movement types, notes may be mandatory
   - Validate in clean() method
   - Example: CORRECTION reason requires notes
   - Example: Manual adjustments above threshold require notes

5. **Add notes search functionality** (plan for admin)
   - Enable full-text search on notes field
   - Useful for finding specific incidents
   - Include in admin search_fields

### Notes Field Configuration
```python
# Add to StockMovement model:
# notes = models.TextField(
#     null=True,
#     blank=True,
#     help_text="Additional notes about this movement"
# )
```

### Notes Usage Guidelines

| Scenario | Notes Requirement | Example |
|----------|-------------------|---------|
| Correction | Mandatory | "Fixed data entry error from 2026-01-15" |
| Damage | Recommended | "Water damage from warehouse leak" |
| Theft | Recommended | "Incident #2026-001, police report filed" |
| Large adjustment | Recommended | "Approved by manager John Doe" |
| Regular purchase | Optional | "Supplier: ABC Ltd, Invoice: INV-001" |

### Notes Validation Logic (Optional)
```python
# In clean() method:
# NOTES_REQUIRED_REASONS = [CORRECTION, THEFT]
# 
# if self.reason in NOTES_REQUIRED_REASONS:
#     if not self.notes or not self.notes.strip():
#         raise ValidationError({
#             'notes': 'Notes are required for this type of movement'
#         })
```

### Verification Checklist
- [ ] notes TextField added
- [ ] Field is nullable and optional
- [ ] Help text encourages documentation
- [ ] Comments document when notes are important
- [ ] Consider making notes mandatory for certain types
- [ ] Plan for notes search in admin

---

## Task 29: Add Cost Per Unit Field

### Overview
Add cost tracking field to record the cost per unit at the time of movement, enabling inventory valuation and cost analysis.

### Dependencies
- Task 21: StockMovement model exists
- Group A: Understanding of cost tracking

### Instructions

1. **Add cost_per_unit field**
   - DecimalField for currency values
   - max_digits=15, decimal_places=2
   - null=True, blank=True (not all movements have cost)
   - Default to None

2. **Add help text**
   - help_text="Cost per unit in LKR at time of movement"
   - Clarifies currency and timing

3. **Document cost recording rules**
   - Add comments explaining when to record cost:
     - STOCK_IN (purchases): Record purchase cost
     - STOCK_OUT (sales): Record cost from stock level
     - TRANSFER: Record current cost from source
     - ADJUSTMENT: Optional, depends on situation

4. **Create total cost property** (optional)
   - Property: `total_cost`
   - Calculate: `quantity * cost_per_unit`
   - Return None if cost_per_unit is None
   - Useful for reporting and valuation

5. **Add validation for cost**
   - Cost should be >= 0 if provided
   - Validate in clean() method
   - Negative costs likely indicate error

6. **Document cost vs stock level cost**
   - Movement cost is snapshot at movement time
   - StockLevel cost is current weighted average
   - Movement cost enables historical cost analysis
   - Used for COGS (Cost of Goods Sold) calculation

### Cost Field Configuration
```python
# Add to StockMovement model:
# cost_per_unit = models.DecimalField(
#     max_digits=15,
#     decimal_places=2,
#     null=True,
#     blank=True,
#     help_text="Cost per unit in LKR at time of movement"
# )
# 
# @property
# def total_cost(self):
#     """Calculate total cost of movement."""
#     if self.cost_per_unit is None:
#         return None
#     return self.quantity * self.cost_per_unit
```

### Cost Recording Scenarios

| Movement Type | Record Cost? | Source | Purpose |
|---------------|--------------|--------|---------|
| STOCK_IN (purchase) | Yes | Purchase price | Update weighted average |
| STOCK_OUT (sale) | Yes | Current stock level cost | COGS calculation |
| TRANSFER | Yes | Source location cost | Maintain cost at destination |
| ADJUSTMENT (positive) | Optional | If known | Cost tracking |
| ADJUSTMENT (negative) | Optional | Stock level cost | Write-off valuation |
| RESERVED/RELEASED | No | N/A | No cost impact |

### Cost Analysis Use Cases
- **COGS Calculation:** Sum cost of STOCK_OUT movements for period
- **Purchase Analysis:** Track purchase costs over time
- **Inventory Valuation:** Calculate value of movements
- **Variance Analysis:** Compare movement cost to standard cost
- **Supplier Analysis:** Analyze purchase costs by supplier

### Verification Checklist
- [ ] cost_per_unit DecimalField added
- [ ] Appropriate decimal precision (15, 2)
- [ ] Field is nullable (not all movements have cost)
- [ ] Help text mentions currency (LKR)
- [ ] total_cost property added (optional)
- [ ] Validation ensures non-negative cost
- [ ] Comments document cost recording rules

---

## Task 30: Add Created By FK

### Overview
Add user tracking field to record who created/authorized the movement, essential for audit trails and accountability.

### Dependencies
- Task 21: StockMovement model exists
- SubPhase-04: User model exists

### Instructions

1. **Add created_by foreign key**
   - ForeignKey to User model (Django auth or custom)
   - null=True, blank=True (some movements may be system-generated)
   - on_delete=SET_NULL (preserve movement if user deleted)
   - related_name="stock_movements_created"

2. **Add help text**
   - help_text="User who created or authorized this movement"
   - Clarifies field purpose

3. **Document user tracking scenarios**
   - Add comments explaining when to populate:
     - Manual movements: Always record user
     - API movements: User from authentication
     - System movements: NULL (automated processes)
     - Import movements: User who triggered import

4. **Add created_at field** (if not from base model)
   - DateTimeField with auto_now_add=True
   - Records when movement was created
   - Usually from TenantAwareModel base class

5. **Consider approval workflow fields** (optional)
   - approved_by FK to User (for adjustments)
   - approved_at DateTimeField
   - approval_notes TextField
   - Required for movements above threshold

6. **Add user lookup methods** (plan for manager)
   - Method to get movements by user
   - Method to get movements needing approval
   - Useful for user activity reports

7. **Document system vs user movements**
   - System movements: created_by=NULL
   - User movements: created_by populated
   - API determines user from authentication context
   - Celery tasks may use system user

### Created By Field Configuration
```python
# Add to StockMovement model:
# created_by = models.ForeignKey(
#     settings.AUTH_USER_MODEL,
#     on_delete=models.SET_NULL,
#     null=True,
#     blank=True,
#     related_name='stock_movements_created',
#     help_text="User who created or authorized this movement"
# )
```

### Optional Approval Fields
```python
# For adjustment approval workflow:
# approved_by = models.ForeignKey(
#     settings.AUTH_USER_MODEL,
#     on_delete=models.SET_NULL,
#     null=True,
#     blank=True,
#     related_name='stock_movements_approved',
#     help_text="Manager who approved this movement"
# )
# 
# approved_at = models.DateTimeField(
#     null=True,
#     blank=True,
#     help_text="When this movement was approved"
# )
```

### User Tracking Scenarios

| Scenario | created_by | Approval Required? |
|----------|------------|-------------------|
| Manual adjustment | Current user | Yes (if above threshold) |
| Purchase receipt | Receiving clerk | No (from PO) |
| Sale shipment | Warehouse staff | No (from order) |
| System adjustment | NULL or system user | No |
| Stock take completion | Stock counter | Manager approval for variances |
| Import data | Import user | Depends on settings |

### Audit Trail Benefits
- **Accountability:** Know who made changes
- **Activity Tracking:** User productivity reports
- **Error Investigation:** Trace incorrect movements
- **Security:** Detect unauthorized changes
- **Compliance:** Regulatory audit requirements

### Verification Checklist
- [ ] created_by FK to User added
- [ ] Field is nullable (system movements)
- [ ] on_delete=SET_NULL preserves history
- [ ] related_name avoids conflicts
- [ ] Help text explains purpose
- [ ] Comments document usage scenarios
- [ ] Consider approval fields for adjustments

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 25 | Add location FKs | Bin-level tracking support |
| 26 | Add reason field | Specific movement reason |
| 27 | Add reference fields | Link to source documents |
| 28 | Add notes field | Additional context/explanations |
| 29 | Add cost_per_unit field | Cost tracking for valuation |
| 30 | Add created_by FK | User audit trail |

### StockMovement Model - Complete Field List

**Product & Variant:**
- product (FK) - Required
- variant (FK) - Optional

**Movement Details:**
- movement_type (CharField) - Required, choices
- reason (CharField) - Required, choices
- quantity (DecimalField) - Required, positive

**Warehouses & Locations:**
- from_warehouse (FK) - Optional
- from_location (FK) - Optional
- to_warehouse (FK) - Optional
- to_location (FK) - Optional

**References:**
- reference_type (CharField) - Optional
- reference_id (CharField) - Optional
- reference_number (CharField) - Optional

**Additional Info:**
- notes (TextField) - Optional
- cost_per_unit (DecimalField) - Optional

**Audit Trail:**
- created_by (FK to User) - Optional
- movement_date (DateTimeField) - Auto timestamp

**Pending (Next Document):**
- Meta class
- Model manager
- Validation methods
- Reversal support
- Admin interface

### Next Steps
Proceed to [03_Tasks-31-36_Meta-Manager-Validation-Admin.md](03_Tasks-31-36_Meta-Manager-Validation-Admin.md) to complete the StockMovement model with metadata, business logic, and admin configuration.

---

## Notes for AI Agents

1. **Location Validation:** Location must belong to corresponding warehouse
2. **Reason Validation:** Reason must match movement_type (enforce in clean())
3. **Reference Flexibility:** Use string for reference_id to handle various ID formats
4. **Cost Tracking:** Record cost for valuation and COGS, but not all movements have cost
5. **User Tracking:** NULL created_by indicates system-generated movement
6. **Notes Importance:** Encourage notes for adjustments and corrections
7. **Next Document:** Complete with validation, manager methods, and admin
