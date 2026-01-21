# Group C: PO Creation & Sending

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Implement PO creation workflows, status transitions, and approval

---

## Navigation

- **↑ Parent:** [SubPhase-11 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: PO Line Items & Calculations](../Group-B_PO-Line-Items-Calculations/)
- **→ Next Group:** [Group D: Receiving Workflow & GRN](../Group-D_Receiving-Workflow-GRN/)

---

## Group Overview

### Key Outcomes

1. **POService Class** - Main service for PO business operations
2. **Manual PO Creation** - Create PO manually with line items
3. **PO from Reorder Suggestions** - Create from stock reorder suggestions
4. **PO from Low Stock Report** - Create based on low stock alerts
5. **PO Duplication** - Duplicate existing PO as new draft
6. **PO Editing** - Edit PO in DRAFT status
7. **PO Status Transitions** - send(), acknowledge(), cancel()
8. **Status Transition Validation** - Validate allowed transitions
9. **PO Approval Workflow** - Optional approval before sending
10. **POHistory Model** - Track PO changes
11. **History Logging** - Log all actions with user, timestamp
12. **POSettings Model** - Tenant settings for numbering, approval
13. **Approval Threshold** - Require approval above threshold
14. **PO Service Migrations** - Apply migrations
15. **Multi-Vendor PO Split** - Split reorder into separate POs
16. **PO Consolidation** - Combine multiple small orders

### Technology Context

| Technology | Purpose |
|------------|---------|
| Service Layer | PO business logic |
| State Machine | Status transitions |
| History Tracking | Audit trail |
| Settings | Tenant configuration |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-42_PO-Service-Creation.md` | 35-42 | POService, creation methods, status transitions, validation |
| 02 | `02_Tasks-43-48_Approval-History-Settings.md` | 43-48 | Approval workflow, POHistory, POSettings, migrations |
| 03 | `03_Tasks-49-50_Split-Consolidation.md` | 49-50 | Multi-vendor split, PO consolidation |

---

## Task Summary

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
| 43 | Implement PO Approval Workflow | Medium | 25 min |
| 44 | Create POHistory Model | Medium | 25 min |
| 45 | Implement History Logging | Medium | 25 min |
| 46 | Create POSettings Model | Medium | 25 min |
| 47 | Implement Approval Threshold | Medium | 20 min |
| 48 | Run PO Service Migrations | Low | 15 min |
| 49 | Implement Multi-Vendor PO Split | High | 30 min |
| 50 | Implement PO Consolidation | Medium | 25 min |

---

## Execution Order

```
[Tasks 35-42: POService, creation, transitions]
         │
         ▼
[Tasks 43-48: Approval, history, settings]
         │
         ▼
[Tasks 49-50: Split and consolidation]
```

---

## Expected Deliverables

```
apps/purchases/
├── models/
│   ├── __init__.py
│   ├── po_history.py             # Task 44
│   └── po_settings.py            # Task 46
├── services/
│   ├── __init__.py
│   └── po_service.py             # Tasks 35-50
└── migrations/
    └── 0003_history_settings.py  # Task 48
```

---

## Notes for AI Agents

### POService Methods
- create_manual_po(vendor_id, lines, user)
- create_from_reorder_suggestions(suggestions, user)
- create_from_low_stock(products, user)
- duplicate_po(po_id, user)
- update_po(po_id, data, user)
- send_po(po_id, user)
- acknowledge_po(po_id, vendor_reference, user)
- cancel_po(po_id, reason, user)
- approve_po(po_id, notes, user)
- split_by_vendor(products, user)
- consolidate_pos(po_ids, user)

### Status Transition Rules
| Current Status | Allowed Transitions |
|----------------|---------------------|
| DRAFT | SENT, CANCELLED |
| SENT | ACKNOWLEDGED, CANCELLED |
| ACKNOWLEDGED | PARTIAL_RECEIVED, RECEIVED, CANCELLED |
| PARTIAL_RECEIVED | RECEIVED, CLOSED |
| RECEIVED | CLOSED |
| CANCELLED | (none) |
| CLOSED | (none) |

### PO from Reorder Suggestions
```
Input: List of reorder suggestions
├── Product A: Need 50, Preferred Vendor: ABC
├── Product B: Need 30, Preferred Vendor: ABC
└── Product C: Need 20, Preferred Vendor: XYZ

Output: 2 POs
├── PO-2026-00001 (ABC): Products A, B
└── PO-2026-00002 (XYZ): Product C
```

### POHistory Fields
- purchase_order: FK to PurchaseOrder
- action: Choice (CREATED, UPDATED, SENT, ACKNOWLEDGED, RECEIVED, CANCELLED, CLOSED)
- changed_by: FK to User
- changed_at: DateTime
- old_status: CharField
- new_status: CharField
- notes: TextField
- data_snapshot: JSONField

### POSettings Fields
- tenant: OneToOne to Tenant
- po_number_prefix: CharField (default "PO")
- po_number_sequence: Integer
- require_approval: Boolean
- approval_threshold: Decimal
- default_payment_terms: Integer (days)
- default_shipping_method: CharField
- grn_number_prefix: CharField (default "GRN")

### Approval Threshold Logic
```
if po.total >= settings.approval_threshold:
    po.requires_approval = True
    po.status = DRAFT (until approved)
```

### Multi-Vendor Split
```
Given products with different preferred vendors:
1. Group products by preferred vendor
2. Create separate PO for each vendor
3. Return list of created POs
```

### PO Consolidation
```
Given multiple draft POs to same vendor:
1. Create new consolidated PO
2. Combine all line items
3. Mark original POs as cancelled
4. Return consolidated PO
```
