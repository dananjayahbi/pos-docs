# Group C: Bill Services & Processing

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 12 - Vendor Bills & Payments  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Implement bill creation workflows, status transitions, and approval

---

## Navigation

- **↑ Parent:** [SubPhase-12 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Bill Line Items & Matching](../Group-B_Bill-Line-Items-Matching/)
- **→ Next Group:** [Group D: Payment Recording & Scheduling](../Group-D_Payment-Recording-Scheduling/)

---

## Group Overview

### Key Outcomes

1. **BillService Class** - Main service for bill business operations
2. **Create Bill from PO** - Auto-create bill from completed PO with GRN
3. **Auto-Fill from PO** - Auto-fill line items from PO/GRN data
4. **Manual Bill Creation** - Create bill without PO reference
5. **Bill Editing** - Edit bill in DRAFT or PENDING status
6. **Bill Status Transitions** - submit(), approve(), dispute(), cancel()
7. **Status Transition Validation** - Validate allowed transitions
8. **Bill Approval Workflow** - Optional approval before payment
9. **BillHistory Model** - Track bill changes
10. **History Logging** - Log all actions with user, timestamp
11. **BillSettings Model** - Tenant settings for numbering, approval
12. **Approval Threshold** - Require approval above threshold
13. **Bill Service Migrations** - Apply migrations
14. **Bill Duplication** - Duplicate bill for recurring purchases
15. **Bill Dispute Workflow** - Mark as disputed, track resolution
16. **Bill Calculation Service** - Calculate subtotal, tax, total

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | Bill business logic |
| State Machine | Status transitions |
| History Tracking | Audit trail |
| Settings | Tenant configuration |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-33-40_Bill-Service-Creation.md` | 33-40 | BillService, creation methods, status transitions, approval |
| 02 | `02_Tasks-41-48_History-Settings-Duplicate-Dispute.md` | 41-48 | BillHistory, BillSettings, duplication, dispute, calculations |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 33 | Create BillService Class | High | 30 min |
| 34 | Implement Create Bill from PO | High | 30 min |
| 35 | Implement Auto-Fill from PO | Medium | 25 min |
| 36 | Implement Manual Bill Creation | Medium | 25 min |
| 37 | Implement Bill Editing | Medium | 25 min |
| 38 | Implement Bill Status Transitions | High | 30 min |
| 39 | Add Status Transition Validation | Medium | 25 min |
| 40 | Implement Bill Approval Workflow | Medium | 25 min |
| 41 | Create BillHistory Model | Medium | 25 min |
| 42 | Implement History Logging | Medium | 25 min |
| 43 | Create BillSettings Model | Medium | 25 min |
| 44 | Implement Approval Threshold | Medium | 20 min |
| 45 | Run Bill Service Migrations | Low | 15 min |
| 46 | Implement Bill Duplication | Medium | 20 min |
| 47 | Implement Bill Dispute Workflow | Medium | 25 min |
| 48 | Implement Bill Calculation Service | Medium | 25 min |

---

## Execution Order

```
[Tasks 33-40: BillService, creation, transitions, approval]
         │
         ▼
[Tasks 41-48: History, settings, duplication, dispute, calculations]
```

---

## Expected Deliverables

```
apps/vendor_bills/
├── models/
│   ├── __init__.py
│   ├── bill_history.py           # Task 41
│   └── bill_settings.py          # Task 43
├── services/
│   ├── __init__.py
│   ├── bill_service.py           # Tasks 33-40, 46-47
│   └── calculation_service.py    # Task 48
└── migrations/
    └── 0004_history_settings.py  # Task 45
```

---

## Notes for AI Agents

### BillService Methods
- create_from_po(po_id, data, user)
- create_manual(vendor_id, lines, user)
- update_bill(bill_id, data, user)
- submit_bill(bill_id, user)
- approve_bill(bill_id, notes, user)
- dispute_bill(bill_id, reason, user)
- resolve_dispute(bill_id, resolution, user)
- cancel_bill(bill_id, reason, user)
- duplicate_bill(bill_id, user)
- calculate_totals(bill_id)

### Status Transition Rules
| Current Status | Allowed Transitions |
|----------------|---------------------|
| DRAFT | PENDING, CANCELLED |
| PENDING | APPROVED, DISPUTED, CANCELLED |
| APPROVED | PARTIAL_PAID, PAID |
| PARTIAL_PAID | PAID |
| DISPUTED | PENDING (after resolution), CANCELLED |
| CANCELLED | (none) |
| PAID | (none) |

### Bill Status Flow
```
                    ┌───────────────┐
                    │     DRAFT     │ ← Initial state
                    └───────┬───────┘
                            │ submit()
                            ▼
                    ┌───────────────┐
                    │    PENDING    │ ← Awaiting approval
                    └───────┬───────┘
                            │ approve()
          ┌─────────────────┼─────────────────┐
          │                 │                 │
          ▼                 ▼                 ▼
  ┌───────────────┐ ┌───────────────┐ ┌───────────────┐
  │   APPROVED    │ │   DISPUTED    │ │   CANCELLED   │
  └───────┬───────┘ └───────────────┘ └───────────────┘
          │
          │ pay()
          ▼
  ┌───────────────┐
  │ PARTIAL_PAID  │ ← Partial payment
  └───────┬───────┘
          │ pay_remaining()
          ▼
  ┌───────────────┐
  │     PAID      │ ← Fully paid
  └───────────────┘
```

### Create Bill from PO
```
Input: PO-2026-00001 (status: RECEIVED)

Process:
1. Get PO with lines
2. Get associated GRN(s)
3. Create VendorBill (DRAFT)
4. For each PO line:
   - Create BillLineItem
   - Set quantity from GRN received
   - Set unit_price from PO
   - Link to po_line and grn_line
5. Calculate totals
6. Return bill
```

### BillHistory Fields
- vendor_bill: FK to VendorBill
- action: Choice (CREATED, UPDATED, SUBMITTED, APPROVED, DISPUTED, CANCELLED, PAID)
- changed_by: FK to User
- changed_at: DateTime
- old_status: CharField
- new_status: CharField
- notes: TextField
- data_snapshot: JSONField

### BillSettings Fields
- tenant: OneToOne to Tenant
- bill_number_prefix: CharField (default "BILL")
- bill_number_sequence: Integer
- require_approval: Boolean
- approval_threshold: Decimal
- auto_approve_matched: Boolean
- quantity_tolerance_percentage: Decimal
- price_tolerance_percentage: Decimal

### Approval Threshold Logic
```
if bill.total >= settings.approval_threshold:
    bill.requires_approval = True
    # Cannot pay until approved
```

### Dispute Workflow
```
1. Mark bill as DISPUTED
2. Set dispute_reason
3. Notify vendor (optional)
4. Track resolution
5. Resolve: → PENDING (review) or CANCELLED
```
