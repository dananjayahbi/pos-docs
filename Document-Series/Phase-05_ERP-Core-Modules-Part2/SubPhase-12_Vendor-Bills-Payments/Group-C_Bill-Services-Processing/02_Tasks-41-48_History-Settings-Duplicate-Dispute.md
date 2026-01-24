# Tasks 41-48: History, Settings, Duplication & Dispute

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** C - Bill Services & Processing  
> **Document:** 02 of 02  
> **Tasks Covered:** 41, 42, 43, 44, 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-40_Bill-Service-Creation.md](01_Tasks-33-40_Bill-Service-Creation.md)
- **→ Next Group:** [Group D: Payment Recording & Scheduling](../Group-D_Payment-Recording-Scheduling/)

---

## Document Overview

This document covers the implementation of bill audit tracking, tenant-specific settings, bill duplication for recurring purchases, dispute workflows, and calculation services. These components provide comprehensive bill management capabilities including full audit trails, configurable approval workflows, and accurate financial calculations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Create BillHistory model | Medium | 25 min |
| 42 | Implement history logging | Medium | 25 min |
| 43 | Create BillSettings model | Medium | 25 min |
| 44 | Implement approval threshold | Medium | 20 min |
| 45 | Run bill service migrations | Low | 15 min |
| 46 | Implement bill duplication | Medium | 20 min |
| 47 | Implement bill dispute workflow | Medium | 25 min |
| 48 | Implement bill calculation service | Medium | 25 min |

---

## Task 41: Create BillHistory Model

### Overview
Create a comprehensive audit trail model that tracks all changes and state transitions for vendor bills. This model maintains a complete history of who did what and when, with snapshots of bill data at each point in time for compliance and debugging purposes.

### Dependencies
- VendorBill model exists
- User model is available
- JSONField support in PostgreSQL

### Instructions

1. **Create bill_history.py file**
   - Navigate to `apps/vendor_bills/models/` directory
   - Create new file named `bill_history.py`
   - This will contain the BillHistory model

2. **Import required modules**
   - Import models from Django
   - Import timezone utilities for timestamps
   - Import User model for change tracking
   - Import JSONField for data snapshots

3. **Add model docstring**
   - Document the purpose of audit trail
   - Explain usage for compliance
   - Note immutability of history records

4. **Create BillHistory model class**
   - Inherit from Django's Model base class
   - Include comprehensive docstring
   - Will track all bill changes

5. **Add vendor_bill foreign key field**
   - Reference to VendorBill
   - Cascade deletion (if bill deleted, history deleted)
   - Indexed for fast queries
   - Related name: 'history'

6. **Add action field**
   - CharField with choices for action types
   - Max length: 20 characters
   - Required field (null=False)
   - Indexed for filtering by action type

7. **Define action type choices**
   - CREATED: Initial bill creation
   - UPDATED: Any field modifications
   - SUBMITTED: Draft submitted for approval
   - APPROVED: Bill approved for payment
   - DISPUTED: Issues raised with bill
   - CANCELLED: Bill cancelled
   - PAID: Payment recorded
   - PARTIAL_PAID: Partial payment recorded

8. **Add changed_by foreign key field**
   - Reference to User model
   - SET_NULL on user deletion (keep history)
   - Tracks who made the change
   - Nullable for system-generated changes

9. **Add changed_at timestamp field**
   - DateTimeField with auto_now_add
   - Automatically set when record created
   - Indexed for chronological queries
   - Immutable after creation

10. **Add old_status field**
    - CharField to store previous status
    - Max length: 20 characters
    - Nullable for initial creation
    - Used for transition tracking

11. **Add new_status field**
    - CharField to store new status
    - Max length: 20 characters
    - Required field
    - Records the status after change

12. **Add notes text field**
    - TextField for detailed notes
    - Nullable and optional
    - Used for approval comments, dispute reasons
    - Unlimited length for detailed explanations

13. **Add data_snapshot field**
    - JSONField to store bill state
    - Stores complete bill data at change time
    - Nullable for simple actions
    - Enables point-in-time recovery

14. **Add ip_address field**
    - GenericIPAddressField for audit
    - Nullable and optional
    - Tracks source of change
    - Useful for security audits

15. **Configure model Meta options**
    - Set verbose_name to "Bill History"
    - Set verbose_name_plural to "Bill Histories"
    - Order by changed_at descending (newest first)
    - Add composite index on (vendor_bill, changed_at)

16. **Add string representation method**
    - Return format: "[Action] on Bill [number] by [user]"
    - Example: "APPROVED on Bill BILL-2026-00001 by john@example.com"
    - Handle null user gracefully

17. **Update models package initialization**
    - Open `apps/vendor_bills/models/__init__.py`
    - Import BillHistory from bill_history module
    - Add to __all__ list for exports

### BillHistory Model Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      BillHistory                             │
├─────────────────────────────────────────────────────────────┤
│ PK │ id              │ BigAutoField                          │
│ FK │ vendor_bill     │ → VendorBill (CASCADE)                │
│ FK │ changed_by      │ → User (SET_NULL, nullable)           │
│    │ action          │ CharField(20) [choices]               │
│    │ changed_at      │ DateTimeField (auto_now_add)          │
│    │ old_status      │ CharField(20, nullable)               │
│    │ new_status      │ CharField(20)                         │
│    │ notes           │ TextField (nullable)                  │
│    │ data_snapshot   │ JSONField (nullable)                  │
│    │ ip_address      │ GenericIPAddressField (nullable)      │
├─────────────────────────────────────────────────────────────┤
│ Indexes:                                                     │
│ - vendor_bill (FK index)                                     │
│ - action (filter index)                                      │
│ - changed_at (sort index)                                    │
│ - (vendor_bill, changed_at) composite                        │
└─────────────────────────────────────────────────────────────┘
```

### Action Type Reference

| Action Code | Display Name | When Used | Requires Notes |
|-------------|--------------|-----------|----------------|
| CREATED | Created | Bill initially created | No |
| UPDATED | Updated | Field values modified | Optional |
| SUBMITTED | Submitted | Draft → Pending transition | Optional |
| APPROVED | Approved | Pending → Approved transition | Recommended |
| DISPUTED | Disputed | Marked as disputed | Yes (reason) |
| CANCELLED | Cancelled | Bill cancelled | Yes (reason) |
| PAID | Paid | Full payment recorded | Optional |
| PARTIAL_PAID | Partially Paid | Partial payment recorded | Optional |

### Data Snapshot Example

```json
{
  "bill_number": "BILL-2026-00015",
  "vendor": {
    "id": 123,
    "name": "ABC Suppliers Pvt Ltd"
  },
  "bill_date": "2026-01-20",
  "due_date": "2026-02-20",
  "status": "PENDING",
  "currency": "LKR",
  "subtotal": "125000.00",
  "tax_amount": "18750.00",
  "total": "143750.00",
  "line_items": [
    {
      "product": "Premium Rice 5kg",
      "quantity": 100,
      "unit_price": "1250.00",
      "total": "125000.00"
    }
  ]
}
```

### Audit Trail Timeline Visualization

```
Bill Creation → Updates → Submit → Approval → Payment
     │            │          │         │          │
     ▼            ▼          ▼         ▼          ▼
┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐  ┌─────────┐
│ CREATED │  │ UPDATED │  │SUBMITTED│  │APPROVED │  │  PAID   │
├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤  ├─────────┤
│Jan 15   │  │Jan 16   │  │Jan 17   │  │Jan 18   │  │Jan 25   │
│10:30 AM │  │02:15 PM │  │09:45 AM │  │11:20 AM │  │03:30 PM │
│User: A  │  │User: A  │  │User: A  │  │User: B  │  │User: C  │
│Status:  │  │Status:  │  │Old:DRAFT│  │Old:PEND │  │Old:APPR │
│DRAFT    │  │DRAFT    │  │New:PEND │  │New:APPR │  │New:PAID │
└─────────┘  └─────────┘  └─────────┘  └─────────┘  └─────────┘
```

### Expected Outcome
- Complete audit trail for all bill changes
- Immutable history records
- User attribution for all actions
- Point-in-time data snapshots
- Compliance-ready audit logs

### Verification Checklist
- [ ] `bill_history.py` file created
- [ ] BillHistory model class defined
- [ ] vendor_bill FK field added
- [ ] action field with choices added
- [ ] changed_by FK field added
- [ ] changed_at timestamp field added
- [ ] old_status and new_status fields added
- [ ] notes TextField added
- [ ] data_snapshot JSONField added
- [ ] ip_address field added
- [ ] Model Meta configured with indexes
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 42: Implement History Logging

### Overview
Implement comprehensive history logging functionality that automatically records all bill changes and state transitions. This includes creating utility functions to log actions, capture data snapshots, and integrate with the BillService methods.

### Dependencies
- Task 41: BillHistory model created
- BillService class exists
- VendorBill model with status field

### Instructions

1. **Create history_logger.py utility file**
   - Navigate to `apps/vendor_bills/services/` directory
   - Create new file named `history_logger.py`
   - This will contain history logging utilities

2. **Import required modules**
   - Import BillHistory model
   - Import timezone utilities
   - Import serializers for data capture
   - Import logging for error handling

3. **Add module docstring**
   - Document purpose of history logging
   - Explain usage in service layer
   - Note best practices for logging

4. **Create log_bill_action function**
   - Accept parameters: bill, action, user, notes, old_status, new_status
   - Create BillHistory record
   - Return created history instance

5. **Implement data snapshot capture**
   - Create helper function to serialize bill data
   - Include bill fields, line items, totals
   - Handle related objects properly
   - Convert Decimals to strings for JSON

6. **Add IP address capture utility**
   - Create function to extract IP from request
   - Handle proxy headers (X-Forwarded-For)
   - Return None if request unavailable
   - Used in history records

7. **Integrate with BillService.create_from_po**
   - After bill creation
   - Call log_bill_action with action='CREATED'
   - Pass creating user
   - Set new_status to 'DRAFT'

8. **Integrate with BillService.create_manual**
   - After manual bill creation
   - Log CREATED action
   - Include notes about manual creation
   - Capture initial data snapshot

9. **Integrate with BillService.update_bill**
   - Before updating fields
   - Capture old values
   - After update
   - Log UPDATED action with changes

10. **Integrate with BillService.submit_bill**
    - Capture old status (DRAFT)
    - Update status to PENDING
    - Log SUBMITTED action
    - Include submission timestamp

11. **Integrate with BillService.approve_bill**
    - Capture old status (PENDING)
    - Update status to APPROVED
    - Log APPROVED action
    - Include approver notes

12. **Integrate with BillService.dispute_bill**
    - Capture old status
    - Update status to DISPUTED
    - Log DISPUTED action
    - Include dispute reason in notes (required)

13. **Integrate with BillService.cancel_bill**
    - Capture old status
    - Update status to CANCELLED
    - Log CANCELLED action
    - Include cancellation reason (required)

14. **Add bulk logging for payment recording**
    - When payment recorded
    - Log PARTIAL_PAID or PAID action
    - Include payment amount in notes
    - Link to payment record

15. **Create history query helper functions**
    - get_bill_history(bill_id): Get all history for bill
    - get_user_actions(user_id): Get all actions by user
    - get_recent_changes(days=7): Get recent changes
    - get_status_transitions(bill_id): Get status changes only

16. **Add history filtering utilities**
    - Filter by action type
    - Filter by date range
    - Filter by user
    - Filter by status transitions

### History Logging Flow

```
┌────────────────────────────────────────────────────────────┐
│                  Bill Service Action                        │
│              (create, update, submit, etc.)                 │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Capture Old Values   │
         │  (status, data)       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Perform Bill Action  │
         │  (update DB)          │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Capture New Values   │
         │  (status, data)       │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Create BillHistory   │
         │  Record               │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Return Success       │
         └───────────────────────┘
```

### Usage Examples

#### Logging Bill Creation
```
Step 1: Create bill object
Step 2: Save to database
Step 3: Call log_bill_action(
  bill=new_bill,
  action='CREATED',
  user=request.user,
  notes='Created from PO-2026-00001',
  old_status=None,
  new_status='DRAFT'
)
```

#### Logging Status Transition
```
Step 1: Get current bill status
  old_status = bill.status  # 'PENDING'
Step 2: Update status
  bill.status = 'APPROVED'
  bill.save()
Step 3: Log action
  log_bill_action(
    bill=bill,
    action='APPROVED',
    user=request.user,
    notes='All items verified',
    old_status='PENDING',
    new_status='APPROVED'
  )
```

#### Logging Field Updates
```
Step 1: Capture changed fields
  changes = {
    'due_date': {
      'old': bill.due_date,
      'new': new_due_date
    }
  }
Step 2: Update bill
  bill.due_date = new_due_date
  bill.save()
Step 3: Log update
  log_bill_action(
    bill=bill,
    action='UPDATED',
    user=request.user,
    notes=f'Changed due date to {new_due_date}',
    old_status=bill.status,
    new_status=bill.status
  )
```

### History Query Patterns

| Query Type | Method | Use Case |
|------------|--------|----------|
| Full bill history | bill.history.all() | View all changes |
| Status changes only | bill.history.filter(action__in=['SUBMITTED', 'APPROVED', 'DISPUTED']) | Track approvals |
| By specific user | bill.history.filter(changed_by=user) | User audit |
| Recent changes | bill.history.filter(changed_at__gte=last_week) | Recent activity |
| Action timeline | bill.history.order_by('changed_at') | Chronological view |

### Audit Report Example

```
Bill: BILL-2026-00015
Vendor: ABC Suppliers Pvt Ltd
Total: LKR 143,750.00

═══════════════════════════════════════════════════════════════
AUDIT TRAIL
═══════════════════════════════════════════════════════════════

1. CREATED on 2026-01-15 10:30 AM by alice@example.com
   Status: → DRAFT
   Notes: Created from PO-2026-00023

2. UPDATED on 2026-01-16 02:15 PM by alice@example.com
   Status: DRAFT → DRAFT
   Notes: Updated due date to 2026-02-20

3. SUBMITTED on 2026-01-17 09:45 AM by alice@example.com
   Status: DRAFT → PENDING
   Notes: Submitted for approval

4. APPROVED on 2026-01-18 11:20 AM by bob@example.com
   Status: PENDING → APPROVED
   Notes: All items verified against GRN-2026-00012

5. PAID on 2026-01-25 03:30 PM by charlie@example.com
   Status: APPROVED → PAID
   Notes: Payment CHQ-2026-00045 processed

═══════════════════════════════════════════════════════════════
```

### Expected Outcome
- Automatic history logging for all bill actions
- Comprehensive audit trail
- User attribution for changes
- Data snapshots for compliance
- Query utilities for reporting

### Verification Checklist
- [ ] `history_logger.py` file created
- [ ] log_bill_action function implemented
- [ ] Data snapshot capture function created
- [ ] IP address utility added
- [ ] Integrated with create_from_po
- [ ] Integrated with create_manual
- [ ] Integrated with update_bill
- [ ] Integrated with submit_bill
- [ ] Integrated with approve_bill
- [ ] Integrated with dispute_bill
- [ ] Integrated with cancel_bill
- [ ] Payment logging implemented
- [ ] History query helpers created
- [ ] Filtering utilities added

---

## Task 43: Create BillSettings Model

### Overview
Create a tenant-specific settings model that controls bill numbering, approval requirements, tolerance thresholds, and other configurable parameters. This allows each tenant to customize bill workflows according to their business requirements.

### Dependencies
- Tenant model exists (django-tenants)
- OneToOne relationship support
- Decimal field support for currency

### Instructions

1. **Create bill_settings.py file**
   - Navigate to `apps/vendor_bills/models/` directory
   - Create new file named `bill_settings.py`
   - This will contain the BillSettings model

2. **Import required modules**
   - Import models from Django
   - Import Decimal and DecimalField
   - Import validators for decimal ranges
   - Import Tenant model

3. **Add model docstring**
   - Document purpose of tenant settings
   - Explain configuration options
   - Note one-per-tenant relationship

4. **Create BillSettings model class**
   - Inherit from Django's Model
   - Include comprehensive docstring
   - One settings instance per tenant

5. **Add tenant OneToOne field**
   - Reference to Tenant model
   - Primary key (primary_key=True)
   - Cascade deletion with tenant
   - Related name: 'bill_settings'

6. **Add bill_number_prefix field**
   - CharField for prefix customization
   - Max length: 10 characters
   - Default: "BILL"
   - Used in bill number generation

7. **Add bill_number_sequence field**
   - PositiveIntegerField for counter
   - Default: 1 (first bill)
   - Auto-incremented on each bill creation
   - Resets yearly (optional)

8. **Add bill_number_padding field**
   - PositiveSmallIntegerField
   - Default: 5 (00001, 00002, etc.)
   - Controls zero-padding length
   - Min: 3, Max: 8

9. **Add include_year_in_number field**
   - BooleanField for year inclusion
   - Default: True
   - Format: BILL-2026-00001 vs BILL-00001
   - Helps with annual organization

10. **Add require_approval field**
    - BooleanField for approval workflow
    - Default: True
    - If True, bills must be approved before payment
    - Can be overridden by approval threshold

11. **Add approval_threshold field**
    - DecimalField for amount threshold
    - Max digits: 12, Decimal places: 2
    - Default: 0.00 (approve all)
    - Bills above this amount require approval

12. **Add auto_approve_matched field**
    - BooleanField for auto-approval
    - Default: False
    - If True, perfectly matched bills auto-approve
    - Requires 100% match with PO/GRN

13. **Add quantity_tolerance_percentage field**
    - DecimalField for quantity variance
    - Max digits: 5, Decimal places: 2
    - Default: 5.00 (5% tolerance)
    - Used in bill-to-PO matching

14. **Add price_tolerance_percentage field**
    - DecimalField for price variance
    - Max digits: 5, Decimal places: 2
    - Default: 2.00 (2% tolerance)
    - Used in price verification

15. **Add default_payment_terms field**
    - PositiveIntegerField for days
    - Default: 30 (Net 30)
    - Auto-fills due date on new bills
    - Can be overridden per bill

16. **Add allow_early_payment_discount field**
    - BooleanField for discount feature
    - Default: False
    - Enables early payment discount tracking
    - Requires additional discount fields

17. **Add early_payment_discount_percentage field**
    - DecimalField for discount rate
    - Max digits: 5, Decimal places: 2
    - Default: 0.00
    - Nullable (only if early payment allowed)

18. **Add early_payment_discount_days field**
    - PositiveIntegerField
    - Default: 10 (within 10 days)
    - Nullable
    - Payment deadline for discount

19. **Add require_po_reference field**
    - BooleanField for PO requirement
    - Default: False
    - If True, manual bills require PO reference
    - Enforces purchase order workflow

20. **Add enable_dispute_workflow field**
    - BooleanField for dispute feature
    - Default: True
    - Enables bill dispute functionality
    - Can be disabled per tenant

21. **Add created_at timestamp field**
    - DateTimeField with auto_now_add
    - Tracks when settings created
    - Immutable after creation

22. **Add updated_at timestamp field**
    - DateTimeField with auto_now
    - Tracks last settings update
    - Auto-updated on save

23. **Configure model Meta options**
    - Set verbose_name to "Bill Settings"
    - Set verbose_name_plural to "Bill Settings"
    - No ordering needed (one per tenant)

24. **Add string representation method**
    - Return format: "Bill Settings for [tenant_name]"
    - Example: "Bill Settings for Acme Corporation"

25. **Add get_next_bill_number method**
    - Generate next bill number
    - Increment sequence
    - Apply padding and prefix
    - Include year if configured

26. **Add is_approval_required method**
    - Accept bill total amount
    - Check require_approval flag
    - Compare against approval_threshold
    - Return True if approval needed

27. **Add calculate_early_discount method**
    - Accept bill total
    - Calculate discount amount
    - Return discount if applicable
    - Return 0 if not enabled

28. **Update models package initialization**
    - Open `apps/vendor_bills/models/__init__.py`
    - Import BillSettings from bill_settings module
    - Add to __all__ list

### BillSettings Model Structure

```
┌─────────────────────────────────────────────────────────────┐
│                      BillSettings                            │
├─────────────────────────────────────────────────────────────┤
│ PK │ tenant                 │ → Tenant (OneToOne, CASCADE)   │
├─────────────────────────────────────────────────────────────┤
│ Numbering                                                    │
│    │ bill_number_prefix     │ CharField(10) = "BILL"         │
│    │ bill_number_sequence   │ PositiveIntegerField = 1       │
│    │ bill_number_padding    │ PositiveSmallIntegerField = 5  │
│    │ include_year_in_number │ BooleanField = True            │
├─────────────────────────────────────────────────────────────┤
│ Approval                                                     │
│    │ require_approval       │ BooleanField = True            │
│    │ approval_threshold     │ Decimal(12,2) = 0.00           │
│    │ auto_approve_matched   │ BooleanField = False           │
├─────────────────────────────────────────────────────────────┤
│ Tolerances                                                   │
│    │ quantity_tolerance_pct │ Decimal(5,2) = 5.00           │
│    │ price_tolerance_pct    │ Decimal(5,2) = 2.00           │
├─────────────────────────────────────────────────────────────┤
│ Payment Terms                                                │
│    │ default_payment_terms  │ PositiveIntegerField = 30      │
│    │ allow_early_discount   │ BooleanField = False           │
│    │ early_discount_pct     │ Decimal(5,2, nullable)         │
│    │ early_discount_days    │ PositiveIntegerField (nullable)│
├─────────────────────────────────────────────────────────────┤
│ Workflow                                                     │
│    │ require_po_reference   │ BooleanField = False           │
│    │ enable_dispute_workflow│ BooleanField = True            │
├─────────────────────────────────────────────────────────────┤
│ Timestamps                                                   │
│    │ created_at             │ DateTimeField (auto_now_add)   │
│    │ updated_at             │ DateTimeField (auto_now)       │
└─────────────────────────────────────────────────────────────┘
```

### Bill Number Generation Logic

```
┌────────────────────────────────────────────────────────────┐
│              Bill Number Generation Flow                    │
└────────────────────────────────────────────────────────────┘

Step 1: Get tenant settings
  settings = tenant.bill_settings

Step 2: Get current sequence number
  seq = settings.bill_number_sequence
  
Step 3: Increment sequence
  settings.bill_number_sequence += 1
  settings.save()

Step 4: Apply padding
  padded = str(seq).zfill(settings.bill_number_padding)
  # Example: 1 → "00001" (padding=5)

Step 5: Build number
  if settings.include_year_in_number:
    number = f"{prefix}-{year}-{padded}"
    # Example: "BILL-2026-00001"
  else:
    number = f"{prefix}-{padded}"
    # Example: "BILL-00001"

Step 6: Return generated number
```

### Bill Number Format Examples

| Configuration | Output Format | Example |
|---------------|---------------|---------|
| prefix="BILL", year=True, pad=5 | BILL-YYYY-NNNNN | BILL-2026-00001 |
| prefix="INV", year=True, pad=6 | INV-YYYY-NNNNNN | INV-2026-000001 |
| prefix="BILL", year=False, pad=4 | BILL-NNNN | BILL-0001 |
| prefix="VB", year=True, pad=3 | VB-YYYY-NNN | VB-2026-001 |

### Approval Threshold Logic

```
┌────────────────────────────────────────────────────────────┐
│           Approval Requirement Determination                │
└────────────────────────────────────────────────────────────┘

Input: bill_total = LKR 250,000.00

Check 1: Is approval globally required?
  if not settings.require_approval:
    return False  # No approval needed

Check 2: Is there a threshold?
  if settings.approval_threshold == 0:
    return True  # All bills require approval

Check 3: Compare against threshold
  if bill_total >= settings.approval_threshold:
    return True  # Bill exceeds threshold
  else:
    return False  # Below threshold

Example Scenarios:
┌────────────────────────────────────────────────────────────┐
│ Scenario 1: require_approval=True, threshold=100,000       │
│ Bill total: LKR 75,000    → No approval (below threshold)  │
│ Bill total: LKR 150,000   → Approval required (above)      │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Scenario 2: require_approval=True, threshold=0             │
│ Bill total: Any amount    → Approval required (all bills)  │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│ Scenario 3: require_approval=False                         │
│ Bill total: Any amount    → No approval (disabled)         │
└────────────────────────────────────────────────────────────┘
```

### Tolerance Calculation Examples

#### Quantity Tolerance (5%)
```
PO Quantity: 100 units
Tolerance: 5%
Acceptable Range: 95 to 105 units

Bill Quantity: 98 units  → MATCH (within tolerance)
Bill Quantity: 107 units → MISMATCH (outside tolerance)
```

#### Price Tolerance (2%)
```
PO Unit Price: LKR 1,000.00
Tolerance: 2%
Acceptable Range: LKR 980.00 to LKR 1,020.00

Bill Price: LKR 995.00  → MATCH (within tolerance)
Bill Price: LKR 1,025.00 → MISMATCH (outside tolerance)
```

### Early Payment Discount Example

```
Settings:
- allow_early_payment_discount = True
- early_payment_discount_percentage = 2.00
- early_payment_discount_days = 10

Bill:
- Bill Date: 2026-01-15
- Due Date: 2026-02-15 (Net 30)
- Total: LKR 100,000.00

Discount Calculation:
- If paid by: 2026-01-25 (within 10 days)
- Discount: LKR 100,000 × 2% = LKR 2,000
- Amount Due: LKR 98,000

Timeline:
┌─────────────────────────────────────────────────────────────┐
│ Jan 15        Jan 25           Feb 15                       │
│ Bill Date     Discount Ends    Due Date                     │
│    │             │                 │                        │
│    ▼             ▼                 ▼                        │
│ ┌────────────┬─────────────────┬──────────┐                │
│ │Pay: 98,000 │ Pay: 100,000    │Pay: 100k │                │
│ │(2% disc)   │ (no discount)   │(no disc) │                │
│ └────────────┴─────────────────┴──────────┘                │
└─────────────────────────────────────────────────────────────┘
```

### Settings Configuration Table

| Setting | Purpose | Default | Impact |
|---------|---------|---------|--------|
| bill_number_prefix | Bill number prefix | "BILL" | Appears in all bill numbers |
| bill_number_sequence | Next bill number | 1 | Auto-increments |
| bill_number_padding | Zero padding | 5 | Controls number length |
| include_year_in_number | Include year | True | BILL-2026-00001 format |
| require_approval | Approval required | True | Bills need approval |
| approval_threshold | Approval amount | 0.00 | Bills above need approval |
| auto_approve_matched | Auto-approve matches | False | Skip approval if perfect match |
| quantity_tolerance_pct | Qty variance % | 5.00 | Matching tolerance |
| price_tolerance_pct | Price variance % | 2.00 | Price matching tolerance |
| default_payment_terms | Payment days | 30 | Auto-fills due date |
| allow_early_discount | Early payment disc | False | Enables discount feature |
| require_po_reference | PO required | False | Manual bills need PO |
| enable_dispute_workflow | Dispute feature | True | Enables disputes |

### Expected Outcome
- Per-tenant bill configuration
- Customizable bill numbering
- Flexible approval workflows
- Tolerance-based matching
- Early payment discount support

### Verification Checklist
- [ ] `bill_settings.py` file created
- [ ] BillSettings model class defined
- [ ] tenant OneToOne field added
- [ ] Numbering fields added (prefix, sequence, padding, year)
- [ ] Approval fields added (require, threshold, auto)
- [ ] Tolerance fields added (quantity, price)
- [ ] Payment term fields added
- [ ] Early discount fields added
- [ ] Workflow fields added (PO required, dispute enabled)
- [ ] Timestamp fields added
- [ ] Meta options configured
- [ ] __str__ method implemented
- [ ] get_next_bill_number method added
- [ ] is_approval_required method added
- [ ] calculate_early_discount method added
- [ ] Model imported in __init__.py

---

## Task 44: Implement Approval Threshold

### Overview
Implement the approval threshold logic that determines whether a bill requires approval based on its total amount and tenant settings. This includes automatic threshold checking, approval requirement flags, and integration with the bill workflow.

### Dependencies
- Task 43: BillSettings model created
- VendorBill model with requires_approval field
- BillService class for workflow

### Instructions

1. **Add requires_approval field to VendorBill**
   - Open `apps/vendor_bills/models/vendor_bill.py`
   - Add BooleanField named requires_approval
   - Default: False
   - Indexed for filtering bills awaiting approval

2. **Add approval_required_reason field**
   - CharField to explain why approval needed
   - Max length: 200 characters
   - Nullable and optional
   - Examples: "Exceeds threshold", "Manual review required"

3. **Create threshold checker utility**
   - Navigate to `apps/vendor_bills/services/`
   - Create file `approval_checker.py`
   - Contains threshold checking logic

4. **Implement check_approval_required function**
   - Accept parameters: bill, settings
   - Return tuple: (is_required, reason)
   - Check multiple approval conditions
   - Prioritize reasons clearly

5. **Check global approval requirement**
   - If settings.require_approval is False
   - Return (False, "Approval disabled")
   - Skip all other checks

6. **Check approval threshold**
   - Get bill total amount
   - Compare against settings.approval_threshold
   - If threshold is 0, approve all
   - If bill >= threshold, approval required

7. **Check auto-approve for matched bills**
   - If settings.auto_approve_matched is True
   - Check if bill is perfectly matched to PO
   - If matched, skip approval
   - Return (False, "Auto-approved - perfect match")

8. **Check manual review flags**
   - If bill has discrepancies flagged
   - Require approval regardless of threshold
   - Return (True, "Manual review required")

9. **Set approval requirement on bill creation**
   - In BillService.create_from_po
   - After calculating totals
   - Call check_approval_required
   - Set bill.requires_approval flag

10. **Set approval requirement on bill updates**
    - In BillService.update_bill
    - If total amount changes
    - Recalculate approval requirement
    - Update flag if changed

11. **Prevent payment without approval**
    - In payment recording logic
    - Check bill.requires_approval flag
    - If True and status != APPROVED
    - Raise validation error

12. **Add approval status to bill queryset**
    - Create custom manager method
    - pending_approval(): Filter requires_approval=True, status=PENDING
    - Returns bills awaiting approval

13. **Add approval notification logic**
    - When bill requires approval
    - Notify approvers (email/system notification)
    - Include bill details and reason
    - Link to approval page

14. **Create approval dashboard helper**
    - Function to get approval statistics
    - Count bills pending approval
    - Sum total amounts awaiting approval
    - Group by vendor or urgency

15. **Add threshold change handler**
    - When settings.approval_threshold updated
    - Recalculate approval for PENDING bills
    - Update requires_approval flags
    - Notify affected users

16. **Document threshold business rules**
    - Create documentation in service docstrings
    - Explain threshold logic clearly
    - Provide configuration examples
    - Note best practices

### Approval Threshold Flow

```
┌────────────────────────────────────────────────────────────┐
│                Bill Approval Requirement Check              │
└────────────────────────────────────────────────────────────┘

Bill Created/Updated
       │
       ▼
┌─────────────────┐
│ Get Tenant      │
│ Settings        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐       NO
│ require_approval├──────────→ Skip Approval
│ = True?         │             requires_approval = False
└────────┬────────┘
         │ YES
         ▼
┌─────────────────┐       NO (threshold = 0)
│ Check Threshold ├──────────→ Approval Required
│ approval_thresh │             requires_approval = True
│ > 0?            │             reason = "All bills require approval"
└────────┬────────┘
         │ YES
         ▼
┌─────────────────┐       NO
│ bill.total >=   ├──────────→ Skip Approval
│ threshold?      │             requires_approval = False
└────────┬────────┘             reason = "Below threshold"
         │ YES
         ▼
┌─────────────────┐       YES
│ auto_approve_   ├──────────→ Check Perfect Match
│ matched = True? │                    │
└────────┬────────┘                    │
         │ NO                          ▼
         │                    ┌─────────────────┐
         │                    │ Is Perfect      │  YES
         │                    │ Match?          ├────→ Skip Approval
         │                    └────────┬────────┘      Auto-approved
         │                             │ NO
         │                             │
         └─────────────────────────────┘
                     │
                     ▼
         ┌───────────────────┐
         │ Approval Required │
         │ requires_approval │
         │ = True            │
         │ reason = "Exceeds │
         │ threshold"        │
         └───────────────────┘
```

### Threshold Scenarios

#### Scenario 1: Standard Threshold (LKR 100,000)
```
Settings:
- require_approval: True
- approval_threshold: 100,000.00
- auto_approve_matched: False

Bills:
┌────────────────┬─────────────┬─────────────┬────────────────┐
│ Bill Number    │ Total       │ Approval?   │ Reason         │
├────────────────┼─────────────┼─────────────┼────────────────┤
│ BILL-2026-0001 │ 75,000.00   │ NO          │ Below threshold│
│ BILL-2026-0002 │ 100,000.00  │ YES         │ At threshold   │
│ BILL-2026-0003 │ 125,000.00  │ YES         │ Above threshold│
│ BILL-2026-0004 │ 50,000.00   │ NO          │ Below threshold│
└────────────────┴─────────────┴─────────────┴────────────────┘
```

#### Scenario 2: Zero Threshold (Approve All)
```
Settings:
- require_approval: True
- approval_threshold: 0.00

Bills:
┌────────────────┬─────────────┬─────────────┬────────────────┐
│ Bill Number    │ Total       │ Approval?   │ Reason         │
├────────────────┼─────────────┼─────────────┼────────────────┤
│ BILL-2026-0001 │ 1,000.00    │ YES         │ All require    │
│ BILL-2026-0002 │ 50,000.00   │ YES         │ All require    │
│ BILL-2026-0003 │ 500,000.00  │ YES         │ All require    │
└────────────────┴─────────────┴─────────────┴────────────────┘
```

#### Scenario 3: Auto-Approve Matched
```
Settings:
- require_approval: True
- approval_threshold: 100,000.00
- auto_approve_matched: True

Bills:
┌────────────────┬─────────────┬──────────┬──────────┬────────────────┐
│ Bill Number    │ Total       │ Matched? │Approval? │ Reason         │
├────────────────┼─────────────┼──────────┼──────────┼────────────────┤
│ BILL-2026-0001 │ 125,000.00  │ YES      │ NO       │ Auto-approved  │
│ BILL-2026-0002 │ 125,000.00  │ NO       │ YES      │ Above threshold│
│ BILL-2026-0003 │ 75,000.00   │ NO       │ NO       │ Below threshold│
└────────────────┴─────────────┴──────────┴──────────┴────────────────┘
```

### Approval Required Flag Usage

#### In Bill List View
```
Filter: Show only bills requiring approval
Query: VendorBill.objects.filter(
  requires_approval=True,
  status='PENDING'
)

Display:
┌────────────────┬─────────────┬────────────────────────────────┐
│ Bill Number    │ Total       │ Reason                         │
├────────────────┼─────────────┼────────────────────────────────┤
│ BILL-2026-0005 │ 150,000.00  │ Exceeds threshold (100,000)    │
│ BILL-2026-0007 │ 125,000.00  │ Exceeds threshold (100,000)    │
│ BILL-2026-0009 │ 50,000.00   │ Manual review required         │
└────────────────┴─────────────┴────────────────────────────────┘
```

#### In Payment Validation
```
Attempt to pay bill BILL-2026-0005:

Step 1: Check requires_approval flag
  if bill.requires_approval == True:
    
Step 2: Check approval status
  if bill.status != 'APPROVED':
    
Step 3: Raise error
  "Cannot process payment. Bill requires approval."
  "Current status: PENDING"
  "Reason: Exceeds approval threshold"
```

### Approval Statistics Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│              Bills Pending Approval                         │
├─────────────────────────────────────────────────────────────┤
│ Total Bills:           12                                   │
│ Total Amount:          LKR 2,450,000.00                     │
│ Avg Amount:            LKR 204,166.67                       │
│ Oldest:                5 days                               │
├─────────────────────────────────────────────────────────────┤
│ By Vendor:                                                  │
│ - ABC Suppliers        3 bills    LKR 650,000.00           │
│ - XYZ Trading          5 bills    LKR 1,200,000.00         │
│ - Global Imports       4 bills    LKR 600,000.00           │
├─────────────────────────────────────────────────────────────┤
│ By Reason:                                                  │
│ - Exceeds threshold    10 bills                             │
│ - Manual review        2 bills                              │
└─────────────────────────────────────────────────────────────┘
```

### Notification Template Example

```
Subject: Bill Approval Required - BILL-2026-00015

Hello Approval Team,

A vendor bill requires your approval:

Bill Number: BILL-2026-00015
Vendor: ABC Suppliers Pvt Ltd
Bill Date: 2026-01-20
Total Amount: LKR 150,000.00
Due Date: 2026-02-20

Approval Required: Exceeds approval threshold (LKR 100,000.00)

Purchase Order: PO-2026-00023
GRN Reference: GRN-2026-00012

Line Items:
- Premium Rice 5kg: 100 units @ LKR 1,250.00 = LKR 125,000.00
- Dhal 1kg: 50 units @ LKR 500.00 = LKR 25,000.00

Please review and approve or dispute the bill.

[Approve Bill] [View Details] [Dispute]

Thank you,
ERP System
```

### Expected Outcome
- Automatic approval requirement detection
- Threshold-based approval routing
- Auto-approval for matched bills
- Payment blocking without approval
- Approval dashboard and notifications

### Verification Checklist
- [ ] requires_approval field added to VendorBill
- [ ] approval_required_reason field added
- [ ] `approval_checker.py` file created
- [ ] check_approval_required function implemented
- [ ] Global approval check added
- [ ] Threshold comparison logic added
- [ ] Auto-approve matched logic added
- [ ] Manual review flag check added
- [ ] Integrated with create_from_po
- [ ] Integrated with update_bill
- [ ] Payment validation added
- [ ] pending_approval queryset method added
- [ ] Approval notifications configured
- [ ] Approval dashboard helper created
- [ ] Threshold change handler added
- [ ] Business rules documented

---

## Task 45: Run Bill Service Migrations

### Overview
Create and apply Django migrations for the BillHistory and BillSettings models, along with any related field additions to VendorBill. This task ensures all database schema changes are properly tracked and applied across all tenant schemas.

### Dependencies
- Task 41: BillHistory model created
- Task 43: BillSettings model created
- Task 44: Approval fields added to VendorBill
- Django migration system configured

### Instructions

1. **Review model changes**
   - Open all modified model files
   - Verify all fields properly defined
   - Check field types and constraints
   - Ensure imports are correct

2. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Navigate to project directory
   - Run makemigrations command for vendor_bills app

3. **Name migration appropriately**
   - Use descriptive migration name
   - Example: "0004_history_settings"
   - Or: "add_bill_history_and_settings"
   - Reflects purpose clearly

4. **Review generated migration**
   - Open migration file in editor
   - Check CreateModel operations for BillHistory
   - Check CreateModel operations for BillSettings
   - Verify AddField operations for VendorBill

5. **Verify BillHistory migration operations**
   - CreateModel with all fields
   - Foreign key to VendorBill
   - Foreign key to User (nullable)
   - JSONField for data_snapshot
   - Index on vendor_bill, action, changed_at
   - Composite index on (vendor_bill, changed_at)

6. **Verify BillSettings migration operations**
   - CreateModel with all fields
   - OneToOneField to Tenant (primary key)
   - All configuration fields
   - Default values set correctly
   - Decimal fields with precision

7. **Verify VendorBill field additions**
   - AddField for requires_approval
   - AddField for approval_required_reason
   - Both fields nullable (existing records)
   - Index on requires_approval

8. **Add data migration for default settings**
   - Create RunPython operation
   - For each existing tenant
   - Create BillSettings instance
   - Use default values from model

9. **Test migration on development database**
   - Apply migration to public schema
   - Verify no errors in execution
   - Check tables created correctly
   - Verify indexes created

10. **Test migration on tenant schemas**
    - Create test tenant if needed
    - Apply migration to tenant schema
    - Verify models accessible
    - Test model operations

11. **Create rollback migration if needed**
    - Plan reverse migration steps
    - Test backward compatibility
    - Document any data loss risks
    - Prepare rollback script

12. **Update model imports**
    - Verify __init__.py includes new models
    - Check admin.py imports
    - Update any service imports
    - Ensure no circular imports

13. **Run migration checks**
    - Use Django's migrate --check command
    - Verify no pending migrations
    - Check for migration conflicts
    - Resolve any warnings

14. **Document migration notes**
    - Create MIGRATION_NOTES.md if needed
    - Document schema changes
    - Note any manual steps required
    - Include rollback instructions

15. **Apply migration to staging environment**
    - Deploy migration to staging
    - Monitor for errors
    - Test all bill operations
    - Verify data integrity

16. **Prepare production migration plan**
    - Schedule maintenance window if needed
    - Prepare rollback plan
    - Notify stakeholders
    - Document deployment steps

### Migration Command Sequence

```
┌────────────────────────────────────────────────────────────┐
│            Migration Generation & Application               │
└────────────────────────────────────────────────────────────┘

Step 1: Generate Migration
  $ python manage.py makemigrations vendor_bills
  
  Output:
  Migrations for 'vendor_bills':
    vendor_bills/migrations/0004_history_settings.py
      - Create model BillHistory
      - Create model BillSettings
      - Add field requires_approval to vendorbill
      - Add field approval_required_reason to vendorbill

Step 2: Review Migration File
  $ cat apps/vendor_bills/migrations/0004_history_settings.py
  
  Verify:
  - Model definitions correct
  - Field types match models
  - Indexes defined
  - Default values set

Step 3: Check Migration
  $ python manage.py migrate --check
  
  Output:
  System check identified no issues (0 silenced).

Step 4: Apply to Public Schema
  $ python manage.py migrate_schemas --schema=public
  
  Output:
  Running migrations:
    Applying vendor_bills.0004_history_settings... OK

Step 5: Apply to All Tenants
  $ python manage.py migrate_schemas --shared
  
  Output:
  Running migrations for tenant: tenant1
    Applying vendor_bills.0004_history_settings... OK
  Running migrations for tenant: tenant2
    Applying vendor_bills.0004_history_settings... OK

Step 6: Verify Tables Created
  $ python manage.py dbshell
  
  SQL:
  \dt vendor_bills*
  
  Expected tables:
  - vendor_bills_billhistory
  - vendor_bills_billsettings
```

### Migration File Structure

```python
# File: apps/vendor_bills/migrations/0004_history_settings.py

"""
Migration overview:
1. Creates BillHistory model for audit trail
2. Creates BillSettings model for tenant configuration
3. Adds approval fields to VendorBill
4. Creates necessary indexes
5. Populates default settings for existing tenants
"""

operations = [
    # Operation 1: Create BillHistory
    migrations.CreateModel(
        name='BillHistory',
        fields=[
            # All fields from model definition
        ],
        options={
            'verbose_name': 'Bill History',
            'verbose_name_plural': 'Bill Histories',
            'ordering': ['-changed_at'],
        },
    ),
    
    # Operation 2: Create BillSettings
    migrations.CreateModel(
        name='BillSettings',
        fields=[
            # All fields from model definition
        ],
        options={
            'verbose_name': 'Bill Settings',
        },
    ),
    
    # Operation 3: Add approval fields to VendorBill
    migrations.AddField(
        model_name='vendorbill',
        name='requires_approval',
        field=models.BooleanField(default=False),
    ),
    migrations.AddField(
        model_name='vendorbill',
        name='approval_required_reason',
        field=models.CharField(max_length=200, null=True, blank=True),
    ),
    
    # Operation 4: Create indexes
    migrations.AddIndex(
        model_name='billhistory',
        index=models.Index(fields=['vendor_bill', 'changed_at']),
    ),
    migrations.AddIndex(
        model_name='billhistory',
        index=models.Index(fields=['action']),
    ),
    migrations.AddIndex(
        model_name='vendorbill',
        index=models.Index(fields=['requires_approval']),
    ),
    
    # Operation 5: Data migration for default settings
    migrations.RunPython(
        create_default_settings,
        reverse_code=migrations.RunPython.noop,
    ),
]
```

### Data Migration Function

```
Function: create_default_settings

Purpose:
Create BillSettings instance for each existing tenant

Process:
1. Get all Tenant objects
2. For each tenant:
   a. Check if BillSettings exists
   b. If not, create with defaults:
      - bill_number_prefix = "BILL"
      - bill_number_sequence = 1
      - require_approval = True
      - approval_threshold = 0.00
      - etc.
3. Log creation
4. Continue even if errors (don't fail migration)

Pseudocode:
  for tenant in Tenant.objects.all():
      if not hasattr(tenant, 'bill_settings'):
          BillSettings.objects.create(
              tenant=tenant,
              # ... all default fields
          )
```

### Migration Verification Steps

| Check | Command | Expected Result |
|-------|---------|-----------------|
| Tables exist | `\dt vendor_bills*` | Lists all vendor_bills tables |
| BillHistory table | `\d vendor_bills_billhistory` | Shows table structure |
| BillSettings table | `\d vendor_bills_billsettings` | Shows table structure |
| Indexes created | `\di vendor_bills*` | Lists all indexes |
| Settings populated | Query BillSettings | One per tenant |
| Foreign keys | Check constraints | All FKs valid |

### Database Schema After Migration

```
┌────────────────────────────────────────────────────────────┐
│                  vendor_bills_billhistory                   │
├────────────────────────────────────────────────────────────┤
│ id (PK), vendor_bill_id (FK), changed_by_id (FK),          │
│ action, changed_at, old_status, new_status, notes,         │
│ data_snapshot, ip_address                                   │
├────────────────────────────────────────────────────────────┤
│ Indexes:                                                    │
│ - billhistory_vendor_bill_id_idx                           │
│ - billhistory_action_idx                                   │
│ - billhistory_changed_at_idx                               │
│ - billhistory_vendor_bill_changed_at_idx (composite)       │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  vendor_bills_billsettings                  │
├────────────────────────────────────────────────────────────┤
│ tenant_id (PK, FK), bill_number_prefix, sequence,          │
│ padding, include_year, require_approval, threshold,        │
│ auto_approve_matched, quantity_tolerance,                  │
│ price_tolerance, payment_terms, early_discount fields,     │
│ require_po, enable_dispute, created_at, updated_at         │
└────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────┐
│                  vendor_bills_vendorbill                    │
│                     (existing, updated)                     │
├────────────────────────────────────────────────────────────┤
│ ... existing fields ...                                     │
│ + requires_approval (new)                                   │
│ + approval_required_reason (new)                            │
├────────────────────────────────────────────────────────────┤
│ Indexes:                                                    │
│ ... existing indexes ...                                    │
│ + vendorbill_requires_approval_idx (new)                   │
└────────────────────────────────────────────────────────────┘
```

### Rollback Plan

```
If migration needs to be rolled back:

Step 1: Roll back migration
  $ python manage.py migrate vendor_bills 0003_previous_migration

Step 2: This will:
  - Drop vendor_bills_billhistory table
  - Drop vendor_bills_billsettings table
  - Remove requires_approval field
  - Remove approval_required_reason field
  - Drop all related indexes

Step 3: Data loss:
  - All BillHistory records lost
  - All BillSettings configurations lost
  - Approval flags on existing bills lost

Step 4: To preserve data before rollback:
  - Export BillSettings to JSON
  - Export BillHistory to CSV
  - Backup database
```

### Multi-Tenancy Considerations

```
┌────────────────────────────────────────────────────────────┐
│                   Multi-Tenancy Notes                       │
└────────────────────────────────────────────────────────────┘

BillSettings:
- Lives in public schema
- One instance per tenant
- OneToOne with Tenant model
- Shared across all tenant operations

BillHistory:
- Lives in tenant schemas
- Separate history per tenant
- No cross-tenant access
- Isolated audit trails

Migration Process:
1. Apply to public schema first
   - Creates BillSettings table
   - Creates default settings

2. Apply to each tenant schema
   - Creates BillHistory table
   - Updates VendorBill table
   - No settings in tenant schemas
```

### Expected Outcome
- BillHistory model in database
- BillSettings model in database
- Approval fields added to VendorBill
- Default settings for all tenants
- All indexes created
- Migration reversible

### Verification Checklist
- [ ] Migration file generated
- [ ] Migration named appropriately
- [ ] BillHistory CreateModel operation correct
- [ ] BillSettings CreateModel operation correct
- [ ] VendorBill AddField operations correct
- [ ] Indexes defined in migration
- [ ] Data migration for default settings
- [ ] Tested on development database
- [ ] Tested on tenant schemas
- [ ] Rollback plan documented
- [ ] Model imports updated
- [ ] Migration checks pass
- [ ] Applied to staging environment
- [ ] Production migration plan ready

---

## Task 46: Implement Bill Duplication

### Overview
Implement functionality to duplicate an existing bill, creating a new draft bill with the same line items and details. This is useful for recurring purchases from the same vendor, allowing users to quickly create similar bills without re-entering data.

### Dependencies
- VendorBill model fully functional
- BillLineItem model exists
- BillService class created
- History logging implemented

### Instructions

1. **Add duplicate_bill method to BillService**
   - Open `apps/vendor_bills/services/bill_service.py`
   - Add new method: duplicate_bill
   - Accept parameters: bill_id, user
   - Return new bill instance

2. **Validate source bill exists**
   - Query VendorBill by bill_id
   - Use tenant-aware queryset
   - Raise error if not found
   - Check user has permission to view

3. **Get source bill data**
   - Retrieve all bill fields
   - Get all line items with details
   - Get vendor information
   - Get tax settings

4. **Create new bill instance**
   - Initialize new VendorBill
   - Set status to DRAFT
   - Set created_by to current user
   - Set tenant from source bill

5. **Copy basic bill fields**
   - vendor: Same vendor
   - currency: Same currency
   - bill_date: Today's date (not copied)
   - due_date: Calculate from today + payment terms
   - notes: Copy with "Duplicated from [number]" prefix

6. **Skip non-duplicatable fields**
   - bill_number: Generate new number
   - status: Always DRAFT
   - submitted_at: Null
   - approved_at: Null
   - paid_at: Null
   - requires_approval: Recalculate
   - payment references: Not copied

7. **Copy line items**
   - Get all line items from source bill
   - For each line item:
     - Create new BillLineItem instance
     - Copy product/description
     - Copy quantity, unit_price
     - Copy tax rate
     - Link to new bill (not source)
     - Clear PO/GRN links (optional)

8. **Decide on PO/GRN link copying**
   - Option A: Clear all PO/GRN links (manual bill)
   - Option B: Keep links for reference only
   - Recommended: Clear links (new independent bill)
   - Document decision in docstring

9. **Recalculate totals**
   - Call CalculationService on new bill
   - Calculate subtotal from line items
   - Calculate tax amounts
   - Calculate total
   - Set all amount fields

10. **Check approval requirement**
    - Get tenant settings
    - Call check_approval_required
    - Set requires_approval flag
    - Set approval_required_reason

11. **Generate new bill number**
    - Get tenant BillSettings
    - Call get_next_bill_number
    - Assign to new bill
    - Ensure uniqueness

12. **Save new bill**
    - Save bill instance to database
    - Save all line items
    - Commit transaction
    - Handle errors gracefully

13. **Log duplication action**
    - Call history logger
    - Action: CREATED
    - Notes: "Duplicated from [source_bill_number]"
    - Reference source bill ID

14. **Add source reference to new bill**
    - Optional: Add duplicated_from field to VendorBill
    - Or: Store in notes/metadata
    - Helps track bill relationships
    - Useful for auditing

15. **Return new bill instance**
    - Return newly created bill
    - Include success message
    - Include new bill number
    - Ready for editing

16. **Add duplicate permission check**
    - Check user has "can_create_bill" permission
    - Check user can access source bill
    - Log permission denied attempts
    - Return appropriate error

### Bill Duplication Flow

```
┌────────────────────────────────────────────────────────────┐
│                  Bill Duplication Process                   │
└────────────────────────────────────────────────────────────┘

User selects bill to duplicate (e.g., BILL-2026-00010)
                     │
                     ▼
         ┌───────────────────────┐
         │ Validate Source Bill  │
         │ - Exists?             │
         │ - User has access?    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Create New Bill       │
         │ - Status: DRAFT       │
         │ - New bill number     │
         │ - Today's date        │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Copy Bill Fields      │
         │ - Vendor              │
         │ - Currency            │
         │ - Notes (modified)    │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Copy Line Items       │
         │ - For each item:      │
         │   * Product/Desc      │
         │   * Qty, Price        │
         │   * Tax Rate          │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Calculate Totals      │
         │ - Subtotal            │
         │ - Tax                 │
         │ - Total               │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Check Approval        │
         │ Requirements          │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Save New Bill         │
         │ & Line Items          │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Log History           │
         │ "Duplicated from..."  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Return New Bill       │
         │ (BILL-2026-00025)     │
         └───────────────────────┘
```

### Duplication Example

#### Source Bill (BILL-2026-00010)
```
┌────────────────────────────────────────────────────────────┐
│                  BILL-2026-00010 (PAID)                     │
├────────────────────────────────────────────────────────────┤
│ Vendor: ABC Suppliers Pvt Ltd                              │
│ Bill Date: 2026-01-10                                      │
│ Due Date: 2026-02-10                                       │
│ Status: PAID                                               │
│ Currency: LKR                                              │
├────────────────────────────────────────────────────────────┤
│ Line Items:                                                │
│ 1. Premium Rice 5kg    100 × 1,250.00 = 125,000.00        │
│ 2. Dhal 1kg             50 × 500.00   =  25,000.00        │
├────────────────────────────────────────────────────────────┤
│ Subtotal:              LKR 150,000.00                      │
│ Tax (15%):             LKR  22,500.00                      │
│ Total:                 LKR 172,500.00                      │
└────────────────────────────────────────────────────────────┘
```

#### Duplicated Bill (BILL-2026-00025)
```
┌────────────────────────────────────────────────────────────┐
│                  BILL-2026-00025 (DRAFT)                    │
├────────────────────────────────────────────────────────────┤
│ Vendor: ABC Suppliers Pvt Ltd            ← Same vendor     │
│ Bill Date: 2026-01-24                    ← Today's date    │
│ Due Date: 2026-02-24                     ← Today + 30 days │
│ Status: DRAFT                            ← Always DRAFT    │
│ Currency: LKR                            ← Same currency   │
│ Notes: Duplicated from BILL-2026-00010   ← Added note     │
├────────────────────────────────────────────────────────────┤
│ Line Items:                              ← Copied items    │
│ 1. Premium Rice 5kg    100 × 1,250.00 = 125,000.00        │
│ 2. Dhal 1kg             50 × 500.00   =  25,000.00        │
├────────────────────────────────────────────────────────────┤
│ Subtotal:              LKR 150,000.00    ← Recalculated   │
│ Tax (15%):             LKR  22,500.00    ← Recalculated   │
│ Total:                 LKR 172,500.00    ← Recalculated   │
└────────────────────────────────────────────────────────────┘
```

### Field Copy Matrix

| Field | Copied? | Notes |
|-------|---------|-------|
| vendor | ✅ Yes | Same vendor |
| bill_number | ❌ No | Generate new |
| bill_date | ❌ No | Use today |
| due_date | ⚠️ Modified | Calculate from today |
| status | ❌ No | Always DRAFT |
| currency | ✅ Yes | Same currency |
| subtotal | ⚠️ Recalculated | From line items |
| tax_amount | ⚠️ Recalculated | From line items |
| total | ⚠️ Recalculated | From line items |
| notes | ⚠️ Modified | Add duplication note |
| purchase_order | ❌ No | Clear reference |
| submitted_at | ❌ No | Null |
| approved_at | ❌ No | Null |
| paid_at | ❌ No | Null |
| requires_approval | ⚠️ Recalculated | Based on total |
| created_by | ⚠️ Modified | Current user |
| Line items | ✅ Yes | All copied |
| PO/GRN links | ❌ No | Optional, recommend clear |

### Use Cases for Bill Duplication

#### Use Case 1: Monthly Recurring Purchase
```
Scenario:
- Monthly order from same vendor
- Same items, same quantities
- Prices occasionally change

Process:
1. Find last month's bill
2. Duplicate bill
3. Review/update prices if changed
4. Submit for approval
5. Pay when due

Benefit: Saves 5-10 minutes per recurring bill
```

#### Use Case 2: Seasonal Stock Replenishment
```
Scenario:
- Quarterly bulk purchase
- Similar items, varying quantities
- Vendor terms unchanged

Process:
1. Duplicate previous quarter's bill
2. Adjust quantities based on inventory
3. Remove items not needed
4. Add new items if necessary
5. Submit for approval

Benefit: Template for regular purchases
```

#### Use Case 3: Correcting Cancelled Bill
```
Scenario:
- Bill was cancelled due to error
- Need to recreate with corrections

Process:
1. Duplicate cancelled bill
2. Fix errors (dates, amounts, items)
3. Submit as new bill
4. Original remains cancelled

Benefit: Preserve original for audit
```

### Duplication Validation Rules

| Validation | Rule | Action if Fails |
|------------|------|-----------------|
| Source bill exists | Must exist in DB | Raise NotFound error |
| User permission | Can view source | Raise PermissionDenied |
| Tenant match | Same tenant | Raise ValidationError |
| Source bill valid | Not corrupted | Raise IntegrityError |
| Line items exist | At least 1 item | Raise ValidationError |
| Vendor active | Vendor not deleted | Raise ValidationError |

### Duplication History Log

```
Bill History for BILL-2026-00025:

1. CREATED on 2026-01-24 10:15 AM by alice@example.com
   Status: → DRAFT
   Notes: Duplicated from BILL-2026-00010
   Data Snapshot: {
     "source_bill": "BILL-2026-00010",
     "source_bill_id": 12345,
     "duplication_date": "2026-01-24T10:15:00Z",
     "line_items_copied": 2
   }
```

### API Response Example

```json
{
  "success": true,
  "message": "Bill duplicated successfully",
  "source_bill": "BILL-2026-00010",
  "new_bill": {
    "id": 67890,
    "bill_number": "BILL-2026-00025",
    "status": "DRAFT",
    "vendor": "ABC Suppliers Pvt Ltd",
    "total": "172500.00",
    "currency": "LKR",
    "bill_date": "2026-01-24",
    "due_date": "2026-02-24",
    "line_items_count": 2,
    "requires_approval": true,
    "approval_reason": "Exceeds approval threshold"
  }
}
```

### Expected Outcome
- Duplicate bill functionality in BillService
- New DRAFT bill with copied data
- Line items duplicated
- Totals recalculated
- Approval requirements checked
- History logged

### Verification Checklist
- [ ] duplicate_bill method added to BillService
- [ ] Source bill validation implemented
- [ ] Bill data retrieval working
- [ ] New bill instance creation works
- [ ] Basic fields copied correctly
- [ ] Non-duplicatable fields handled
- [ ] Line items copied successfully
- [ ] PO/GRN link decision implemented
- [ ] Totals recalculated
- [ ] Approval requirement checked
- [ ] New bill number generated
- [ ] New bill saved to database
- [ ] Duplication action logged
- [ ] Source reference stored
- [ ] New bill returned
- [ ] Permission check added

---

## Task 47: Implement Bill Dispute Workflow

### Overview
Implement a comprehensive dispute workflow that allows users to mark bills as disputed when discrepancies are found, track dispute reasons and resolution, and manage the dispute lifecycle from identification to resolution.

### Dependencies
- VendorBill model with status field
- BillHistory for dispute tracking
- BillService class created
- Status transition validation

### Instructions

1. **Add dispute fields to VendorBill model**
   - Open `apps/vendor_bills/models/vendor_bill.py`
   - Add is_disputed BooleanField
   - Add disputed_at DateTimeField (nullable)
   - Add disputed_by ForeignKey to User (nullable)
   - Add dispute_reason TextField
   - Add dispute_resolved_at DateTimeField (nullable)
   - Add dispute_resolution TextField (nullable)

2. **Add DISPUTED status to status choices**
   - Verify DISPUTED in STATUS_CHOICES
   - Between PENDING and CANCELLED
   - Display name: "Disputed"
   - Used when discrepancies found

3. **Create dispute_bill method in BillService**
   - Add method to BillService class
   - Accept parameters: bill_id, reason, user
   - Validate dispute eligibility
   - Update bill status

4. **Validate bill can be disputed**
   - Check bill status
   - Only PENDING or APPROVED bills can be disputed
   - DRAFT bills should be edited instead
   - PAID bills cannot be disputed (must use different process)

5. **Capture old status**
   - Store current status before change
   - Needed for history logging
   - Used in status transition tracking

6. **Update bill to disputed state**
   - Set status to 'DISPUTED'
   - Set is_disputed to True
   - Set disputed_at to current timestamp
   - Set disputed_by to current user
   - Set dispute_reason from parameter
   - Save bill instance

7. **Log dispute action**
   - Call log_bill_action
   - Action: 'DISPUTED'
   - Include reason in notes
   - Capture old and new status
   - Store data snapshot

8. **Send dispute notifications**
   - Notify bill creator
   - Notify vendor (optional)
   - Notify approval team
   - Include dispute reason
   - Link to bill details

9. **Create resolve_dispute method**
   - Add method to BillService
   - Accept parameters: bill_id, resolution, new_status, user
   - Validate resolution eligibility
   - Update bill state

10. **Validate dispute can be resolved**
    - Check bill is currently disputed
    - Check user has resolve permission
    - Validate new_status is appropriate
    - Must be PENDING or CANCELLED

11. **Update bill after resolution**
    - Set status to new_status (PENDING or CANCELLED)
    - Set is_disputed to False
    - Set dispute_resolved_at to current timestamp
    - Set dispute_resolution from parameter
    - Keep original dispute data (don't clear)
    - Save bill instance

12. **Log resolution action**
    - Call log_bill_action
    - Action: 'UPDATED' (or 'RESOLVED')
    - Notes: Include resolution text
    - Old status: DISPUTED
    - New status: PENDING or CANCELLED

13. **Send resolution notifications**
    - Notify dispute initiator
    - Notify approvers if PENDING
    - Notify vendor if appropriate
    - Include resolution details
    - Next steps information

14. **Add dispute query methods**
    - disputed_bills(): Get all disputed bills
    - resolved_disputes(): Get bills with resolved disputes
    - pending_disputes(): Get unresolved disputes
    - Filter by tenant automatically

15. **Create dispute statistics helper**
    - Count active disputes
    - Average resolution time
    - Common dispute reasons
    - Dispute rate by vendor

16. **Add dispute workflow validation**
    - Ensure reason is required
    - Validate reason length (min 10 chars)
    - Ensure resolution required when resolving
    - Prevent resolving non-disputed bills

### Bill Dispute Status Flow

```
┌────────────────────────────────────────────────────────────┐
│                   Dispute Workflow                          │
└────────────────────────────────────────────────────────────┘

Normal Flow:
DRAFT → PENDING → APPROVED → PAID

Dispute Flow:
                PENDING
                   │
                   │ dispute_bill()
                   │ (discrepancy found)
                   ▼
                DISPUTED
                   │
                   │ resolve_dispute()
                   │
         ┌─────────┴─────────┐
         │                   │
         ▼                   ▼
      PENDING            CANCELLED
         │
         │ (re-approve if needed)
         ▼
      APPROVED
         │
         ▼
       PAID
```

### Dispute Lifecycle Diagram

```
┌────────────────────────────────────────────────────────────┐
│               Dispute Identification                        │
│  User finds discrepancy while reviewing bill                │
└────────────────────┬───────────────────────────────────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Mark as DISPUTED     │
         │  - Set status         │
         │  - Record reason      │
         │  - Timestamp          │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Notify Stakeholders  │
         │  - Creator            │
         │  - Approvers          │
         │  - Vendor (optional)  │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Investigation        │
         │  - Review bill        │
         │  - Check PO/GRN       │
         │  - Contact vendor     │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Resolution Decision  │
         │  - Fix and continue   │
         │  - Cancel bill        │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Resolve Dispute      │
         │  - Update status      │
         │  - Record resolution  │
         │  - Timestamp          │
         └───────────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │  Notify Resolution    │
         │  - Inform all parties │
         │  - Next steps         │
         └───────────────────────┘
```

### Dispute Reason Categories

| Category | Example Reasons |
|----------|-----------------|
| **Quantity Mismatch** | "Bill quantity 150 units, but GRN shows only 100 units received" |
| **Price Discrepancy** | "Unit price LKR 1,500 on bill, but PO shows LKR 1,250" |
| **Missing Items** | "Bill includes 50 units of Product X never ordered or received" |
| **Quality Issues** | "Received damaged goods, should be credited or replaced" |
| **Calculation Error** | "Total incorrectly calculated, should be LKR 125,000 not LKR 135,000" |
| **Tax Error** | "VAT rate should be 8% for this product category, not 15%" |
| **Duplicate Bill** | "This appears to be duplicate of BILL-2026-00018" |
| **Missing Documentation** | "Bill provided without supporting delivery note" |
| **Terms Mismatch** | "Payment terms should be Net 60, not Net 30 as per agreement" |

### Dispute Example Scenario

#### Initial Bill State
```
BILL-2026-00020 - PENDING

Vendor: XYZ Trading Company
Bill Date: 2026-01-22
Total: LKR 225,000.00

Line Items:
1. Widget A: 100 units @ LKR 1,500 = LKR 150,000.00
2. Widget B: 150 units @ LKR 500 = LKR 75,000.00

Purchase Order: PO-2026-00030
GRN: GRN-2026-00015
```

#### Discrepancy Found
```
During review, approver notices:
- GRN-2026-00015 shows only 120 units of Widget B received
- Bill shows 150 units
- Difference: 30 units × LKR 500 = LKR 15,000 overbilled
```

#### Dispute Action
```
User clicks "Dispute Bill"

Dispute Reason:
"Quantity mismatch on Widget B. Bill shows 150 units but GRN-2026-00015
confirms only 120 units were actually received. Overbilled by 30 units
(LKR 15,000). Vendor should issue credit note or corrected bill."

Status: PENDING → DISPUTED
Disputed By: bob@example.com
Disputed At: 2026-01-23 14:30
```

#### Investigation & Resolution
```
Actions taken:
1. Contact vendor XYZ Trading
2. Vendor confirms error
3. Vendor agrees to issue credit note
4. Credit note CN-2026-005 issued for LKR 15,000

Resolution:
"Vendor confirmed quantity error and issued credit note CN-2026-005
for LKR 15,000. Proceeding with original bill payment of LKR 225,000,
then applying credit note. Bill approved for payment."

Status: DISPUTED → PENDING (for re-approval)
Resolved At: 2026-01-24 10:15
Resolution By: bob@example.com
```

### Dispute Notification Templates

#### Dispute Created Notification
```
Subject: Bill Disputed - BILL-2026-00020 - Action Required

A vendor bill has been disputed and requires investigation:

Bill Number: BILL-2026-00020
Vendor: XYZ Trading Company
Total: LKR 225,000.00
Disputed By: bob@example.com
Disputed On: 2026-01-23 14:30

Dispute Reason:
"Quantity mismatch on Widget B. Bill shows 150 units but GRN-2026-00015
confirms only 120 units were actually received. Overbilled by 30 units
(LKR 15,000)."

Action Required:
- Review bill details and supporting documents
- Contact vendor if necessary
- Resolve dispute with appropriate action

[View Bill] [Contact Vendor] [Resolve Dispute]
```

#### Dispute Resolved Notification
```
Subject: Bill Dispute Resolved - BILL-2026-00020

The dispute for bill BILL-2026-00020 has been resolved:

Bill Number: BILL-2026-00020
Vendor: XYZ Trading Company
Original Status: DISPUTED
New Status: PENDING (awaiting approval)

Resolution:
"Vendor confirmed quantity error and issued credit note CN-2026-005
for LKR 15,000. Proceeding with original bill payment of LKR 225,000,
then applying credit note."

Resolved By: bob@example.com
Resolved On: 2026-01-24 10:15

Next Steps:
- Bill returned to PENDING status
- Requires re-approval before payment
- Credit note will be applied separately

[View Bill] [Approve Bill] [View Credit Note]
```

### Dispute Statistics Dashboard

```
┌─────────────────────────────────────────────────────────────┐
│                   Dispute Analytics                         │
├─────────────────────────────────────────────────────────────┤
│ Active Disputes:           5                                │
│ Resolved This Month:       12                               │
│ Avg Resolution Time:       2.3 days                         │
│ Dispute Rate:              4.2% of bills                    │
├─────────────────────────────────────────────────────────────┤
│ Common Dispute Reasons:                                     │
│ - Quantity Mismatch        45%                              │
│ - Price Discrepancy        28%                              │
│ - Calculation Error        15%                              │
│ - Missing Items            12%                              │
├─────────────────────────────────────────────────────────────┤
│ By Vendor:                                                  │
│ - ABC Suppliers           1 active, 3 resolved              │
│ - XYZ Trading             2 active, 5 resolved              │
│ - Global Imports          2 active, 4 resolved              │
└─────────────────────────────────────────────────────────────┘
```

### Dispute Field Usage

| Field | When Set | When Cleared | Purpose |
|-------|----------|--------------|---------|
| is_disputed | On dispute | On resolution | Quick filter |
| disputed_at | On dispute | Never | Timestamp |
| disputed_by | On dispute | Never | User tracking |
| dispute_reason | On dispute | Never | Audit trail |
| dispute_resolved_at | On resolution | Never | Resolution time |
| dispute_resolution | On resolution | Never | Resolution details |

### Expected Outcome
- Complete dispute workflow implementation
- Bill dispute and resolution methods
- Dispute tracking fields
- Notification system
- Dispute analytics and reporting

### Verification Checklist
- [ ] Dispute fields added to VendorBill
- [ ] DISPUTED status verified in choices
- [ ] dispute_bill method created
- [ ] Bill dispute validation implemented
- [ ] Old status captured before dispute
- [ ] Bill updated to disputed state
- [ ] Dispute action logged
- [ ] Dispute notifications sent
- [ ] resolve_dispute method created
- [ ] Resolution validation implemented
- [ ] Bill updated after resolution
- [ ] Resolution action logged
- [ ] Resolution notifications sent
- [ ] Dispute query methods added
- [ ] Statistics helper created
- [ ] Workflow validation added

---

## Task 48: Implement Bill Calculation Service

### Overview
Create a dedicated calculation service that handles all bill amount calculations including subtotals, tax calculations, total amounts, and discount applications. This service ensures consistent and accurate financial calculations across all bill operations.

### Dependencies
- VendorBill model with amount fields
- BillLineItem model with pricing
- Decimal precision configured
- Tax calculation logic defined

### Instructions

1. **Create calculation_service.py file**
   - Navigate to `apps/vendor_bills/services/` directory
   - Create new file named `calculation_service.py`
   - This will contain all calculation logic

2. **Import required modules**
   - Import Decimal from decimal module
   - Import models (VendorBill, BillLineItem)
   - Import ROUND_HALF_UP for rounding
   - Import logging for error tracking

3. **Add module docstring**
   - Document calculation rules
   - Explain rounding strategies
   - Note precision requirements
   - Reference accounting standards

4. **Create CalculationService class**
   - Main service class for calculations
   - Static methods for reusability
   - No instance state needed
   - Pure calculation functions

5. **Implement calculate_line_total method**
   - Accept: quantity, unit_price, tax_rate
   - Calculate: quantity × unit_price
   - Calculate: tax amount
   - Return: (line_subtotal, line_tax, line_total)
   - Use Decimal throughout

6. **Implement calculate_bill_totals method**
   - Accept: bill_id or bill instance
   - Get all line items
   - Sum all line subtotals
   - Sum all line tax amounts
   - Calculate total
   - Return: (subtotal, tax, total)

7. **Handle decimal precision**
   - Use Decimal type for all amounts
   - Set precision to 2 decimal places
   - Use ROUND_HALF_UP rounding mode
   - Avoid floating point arithmetic

8. **Implement tax calculation**
   - Get tax rate from line item or product
   - Calculate: subtotal × (tax_rate / 100)
   - Round to 2 decimal places
   - Support multiple tax rates per bill

9. **Support discount calculations**
   - Line-level discounts (if applicable)
   - Bill-level discounts
   - Early payment discounts
   - Calculate before and after discount

10. **Implement update_bill_amounts method**
    - Accept: bill_id
    - Calculate all totals
    - Update bill fields:
      - bill.subtotal
      - bill.tax_amount
      - bill.discount_amount (if applicable)
      - bill.total
    - Save bill instance
    - Return updated bill

11. **Add validation logic**
    - Ensure no negative amounts
    - Check quantity > 0
    - Validate unit_price >= 0
    - Verify tax_rate in valid range (0-100)

12. **Handle rounding differences**
    - Calculate line-by-line totals
    - Sum rounded line totals
    - Compare to bill total
    - Handle penny differences gracefully

13. **Support multi-currency (future)**
    - Prepare for currency conversion
    - Store amounts in bill currency
    - Use exchange rates table
    - Round according to currency rules

14. **Add calculation verification method**
    - Recalculate totals from line items
    - Compare with stored totals
    - Return any discrepancies
    - Used in data integrity checks

15. **Create bulk calculation method**
    - Accept: list of bill IDs
    - Calculate totals for all bills
    - Update all at once
    - Use for batch operations

16. **Add calculation logging**
    - Log calculation inputs
    - Log calculation results
    - Track rounding adjustments
    - Useful for debugging

17. **Integrate with BillService**
    - Call after line item changes
    - Call when tax rates updated
    - Call before status transitions
    - Ensure totals always current

### Calculation Flow

```
┌────────────────────────────────────────────────────────────┐
│              Bill Calculation Process                       │
└────────────────────────────────────────────────────────────┘

Bill with Line Items
       │
       ▼
┌──────────────────┐
│ For Each Line    │
│ Item:            │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate Line   │
│ Subtotal:        │
│ qty × unit_price │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate Line   │
│ Tax:             │
│ subtotal × rate  │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Calculate Line   │
│ Total:           │
│ subtotal + tax   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Sum All Lines:   │
│ - Total Subtotal │
│ - Total Tax      │
│ - Total Amount   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Apply Bill-Level │
│ Adjustments:     │
│ - Discounts      │
│ - Rounding       │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Update Bill:     │
│ - bill.subtotal  │
│ - bill.tax_amt   │
│ - bill.total     │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Save & Return    │
└──────────────────┘
```

### Calculation Example

#### Input: Line Items
```
Line 1:
- Product: Premium Rice 5kg
- Quantity: 100
- Unit Price: LKR 1,250.00
- Tax Rate: 0% (essential food item)

Line 2:
- Product: Cooking Oil 1L
- Quantity: 50
- Unit Price: LKR 800.00
- Tax Rate: 8%

Line 3:
- Product: Biscuits Assorted
- Quantity: 75
- Unit Price: LKR 150.00
- Tax Rate: 15%
```

#### Step-by-Step Calculation

**Line 1 Calculation:**
```
Subtotal = 100 × 1,250.00 = 125,000.00
Tax = 125,000.00 × (0 / 100) = 0.00
Line Total = 125,000.00 + 0.00 = 125,000.00
```

**Line 2 Calculation:**
```
Subtotal = 50 × 800.00 = 40,000.00
Tax = 40,000.00 × (8 / 100) = 3,200.00
Line Total = 40,000.00 + 3,200.00 = 43,200.00
```

**Line 3 Calculation:**
```
Subtotal = 75 × 150.00 = 11,250.00
Tax = 11,250.00 × (15 / 100) = 1,687.50
Line Total = 11,250.00 + 1,687.50 = 12,937.50
```

**Bill Totals:**
```
Subtotal = 125,000.00 + 40,000.00 + 11,250.00 = 176,250.00
Tax Amount = 0.00 + 3,200.00 + 1,687.50 = 4,887.50
Total = 176,250.00 + 4,887.50 = 181,137.50
```

#### Output: Updated Bill
```
bill.subtotal = Decimal('176250.00')
bill.tax_amount = Decimal('4887.50')
bill.total = Decimal('181137.50')
```

### Decimal Precision Rules

| Value Type | Precision | Example |
|------------|-----------|---------|
| Unit Price | 2 decimals | 1250.00 |
| Quantity | 2 decimals | 100.00 or 100.50 |
| Tax Rate | 2 decimals | 8.00%, 15.00% |
| Subtotal | 2 decimals | 125000.00 |
| Tax Amount | 2 decimals | 3200.00 |
| Total | 2 decimals | 181137.50 |

### Rounding Strategy

```
Python Decimal Rounding:

from decimal import Decimal, ROUND_HALF_UP

amount = Decimal('1687.505')
rounded = amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
# Result: Decimal('1687.51')

amount = Decimal('1687.504')
rounded = amount.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
# Result: Decimal('1687.50')

Rule: Round to nearest cent, 0.5 rounds up
```

### Tax Calculation Table

| Subtotal | Tax Rate | Tax Calculation | Tax Amount | Total |
|----------|----------|-----------------|------------|-------|
| 100.00 | 0% | 100.00 × 0.00 | 0.00 | 100.00 |
| 100.00 | 5% | 100.00 × 0.05 | 5.00 | 105.00 |
| 100.00 | 8% | 100.00 × 0.08 | 8.00 | 108.00 |
| 100.00 | 15% | 100.00 × 0.15 | 15.00 | 115.00 |
| 1250.00 | 8% | 1250.00 × 0.08 | 100.00 | 1350.00 |
| 1250.00 | 15% | 1250.00 × 0.15 | 187.50 | 1437.50 |

### Multi-Rate Bill Example

```
Bill with multiple tax rates:

┌────────────────────────────────────────────────────────────┐
│                   BILL-2026-00030                           │
├────────────────────────────────────────────────────────────┤
│ Item                    Qty  Price    Tax%   Subtotal   Tax│
├────────────────────────────────────────────────────────────┤
│ Rice (Essential)        100  1250.00  0%    125,000.00  0.00│
│ Oil (Reduced Rate)       50   800.00  8%     40,000.00 3200│
│ Biscuits (Standard)      75   150.00 15%     11,250.00 1688│
├────────────────────────────────────────────────────────────┤
│ Subtotal:                                    176,250.00     │
│ Tax (Mixed Rates):                             4,887.50     │
│ Total:                                       181,137.50     │
└────────────────────────────────────────────────────────────┘
```

### Calculation Verification

```
Verification Process:

1. Recalculate from scratch
   actual_subtotal = sum(line.quantity × line.unit_price for line in lines)
   actual_tax = sum(line.tax_amount for line in lines)
   actual_total = actual_subtotal + actual_tax

2. Compare with stored values
   subtotal_match = (actual_subtotal == bill.subtotal)
   tax_match = (actual_tax == bill.tax_amount)
   total_match = (actual_total == bill.total)

3. Report discrepancies
   if not all([subtotal_match, tax_match, total_match]):
       report_calculation_error(bill)

4. Auto-fix if configured
   if settings.auto_fix_calculation_errors:
       update_bill_amounts(bill)
```

### Discount Application Example

```
Original Totals:
- Subtotal: LKR 100,000.00
- Tax (15%): LKR 15,000.00
- Total: LKR 115,000.00

Apply 5% Line Discount:
- Subtotal: LKR 95,000.00 (100,000 × 0.95)
- Tax (15%): LKR 14,250.00 (tax on discounted amount)
- Total: LKR 109,250.00

Apply Early Payment Discount (2%):
- Original Total: LKR 115,000.00
- Early Discount: LKR 2,300.00 (115,000 × 0.02)
- Amount Due: LKR 112,700.00
```

### Calculation Service Integration

```
Integration Points:

1. Bill Creation (from PO):
   bill = BillService.create_from_po(po_id)
   CalculationService.update_bill_amounts(bill.id)

2. Line Item Added:
   line = BillLineItem.objects.create(...)
   CalculationService.update_bill_amounts(line.vendor_bill_id)

3. Line Item Updated:
   line.quantity = new_quantity
   line.save()
   CalculationService.update_bill_amounts(line.vendor_bill_id)

4. Before Status Transition:
   CalculationService.update_bill_amounts(bill.id)
   if bill.total >= threshold:
       bill.requires_approval = True

5. Batch Recalculation:
   bill_ids = VendorBill.objects.filter(status='DRAFT').values_list('id')
   CalculationService.bulk_calculate(bill_ids)
```

### Expected Outcome
- Accurate decimal-based calculations
- Consistent rounding strategies
- Multi-rate tax support
- Discount application
- Calculation verification
- Integration with bill workflow

### Verification Checklist
- [ ] `calculation_service.py` file created
- [ ] Required modules imported
- [ ] Module docstring added
- [ ] CalculationService class created
- [ ] calculate_line_total method implemented
- [ ] calculate_bill_totals method implemented
- [ ] Decimal precision handled correctly
- [ ] Tax calculation implemented
- [ ] Discount calculations supported
- [ ] update_bill_amounts method added
- [ ] Validation logic included
- [ ] Rounding differences handled
- [ ] Multi-currency support prepared
- [ ] Calculation verification method added
- [ ] Bulk calculation method created
- [ ] Calculation logging added
- [ ] Integrated with BillService

---

## Summary

This document covered the implementation of advanced bill management features including audit tracking, tenant settings, duplication, dispute workflow, and financial calculations.

### Completed Features

1. **BillHistory Model (Task 41)**
   - ✅ Complete audit trail for all bill changes
   - ✅ Action tracking (CREATED, UPDATED, APPROVED, DISPUTED, etc.)
   - ✅ User attribution with timestamps
   - ✅ Point-in-time data snapshots in JSON
   - ✅ Immutable history records

2. **History Logging (Task 42)**
   - ✅ Automatic history recording for all actions
   - ✅ Integration with all BillService methods
   - ✅ Data snapshot capture utilities
   - ✅ History query and filtering helpers
   - ✅ Audit report capabilities

3. **BillSettings Model (Task 43)**
   - ✅ Per-tenant bill configuration
   - ✅ Customizable bill numbering
   - ✅ Approval workflow settings
   - ✅ Tolerance percentages for matching
   - ✅ Payment terms and early discounts

4. **Approval Threshold (Task 44)**
   - ✅ Automatic approval requirement detection
   - ✅ Threshold-based routing
   - ✅ Auto-approval for perfect matches
   - ✅ Payment blocking without approval
   - ✅ Approval dashboard and notifications

5. **Migrations (Task 45)**
   - ✅ BillHistory model in database
   - ✅ BillSettings model in database
   - ✅ Approval fields added to VendorBill
   - ✅ All indexes created
   - ✅ Default settings for tenants

6. **Bill Duplication (Task 46)**
   - ✅ Duplicate existing bills
   - ✅ Create new DRAFT from template
   - ✅ Copy line items automatically
   - ✅ Recalculate totals
   - ✅ Useful for recurring purchases

7. **Dispute Workflow (Task 47)**
   - ✅ Mark bills as disputed
   - ✅ Track dispute reasons
   - ✅ Resolution management
   - ✅ Status transitions (DISPUTED ↔ PENDING/CANCELLED)
   - ✅ Dispute analytics

8. **Calculation Service (Task 48)**
   - ✅ Accurate decimal calculations
   - ✅ Multi-rate tax support
   - ✅ Discount applications
   - ✅ Rounding strategies
   - ✅ Calculation verification

### Key Achievements

| Feature | Impact | Benefit |
|---------|--------|---------|
| History Tracking | Full audit trail | Compliance & transparency |
| Tenant Settings | Customization | Flexible workflows per tenant |
| Approval Threshold | Risk management | Control over large payments |
| Bill Duplication | Efficiency | Faster recurring bill entry |
| Dispute Workflow | Issue management | Handle discrepancies systematically |
| Calculation Service | Accuracy | Precise financial calculations |

### Next Steps

Proceed to **Group D: Payment Recording & Scheduling** to implement:
- Payment model and methods
- Payment allocation
- Partial payments
- Payment schedules
- Payment history

---

**Document Status:** ✅ Complete  
**Total Tasks:** 8  
**Complexity:** Medium-High  
**Total Estimated Time:** ~3.0 hours