# Tasks 51-59: GRN Models and Fields

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** D - Receiving Workflow & GRN  
> **Document:** 01 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58, 59

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-60-68_Receiving-Service.md](02_Tasks-60-68_Receiving-Service.md)

---

## Document Overview

This document creates the Goods Receipt Note (GRN) models that track received purchase orders, including the GoodsReceipt model for the overall receipt and GRNLineItem for individual items received.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create GoodsReceipt Model | Medium | 25 min |
| 52 | Add GRN Core Fields | Medium | 20 min |
| 53 | Add GRN Delivery Fields | Medium | 20 min |
| 54 | Add GRN Inspection Fields | Medium | 20 min |
| 55 | Create GRN Number Generator | Medium | 25 min |
| 56 | Create GRNLineItem Model | Medium | 25 min |
| 57 | Add GRN Line Fields | Medium | 20 min |
| 58 | Add GRN Line Quality Fields | Medium | 20 min |
| 59 | Run GRN Migrations | Low | 15 min |

---

## Task 51: Create GoodsReceipt Model

### Instructions
1. Create `goods_receipt.py` in `models/` directory
2. Define GoodsReceipt model with TenantMixin
3. Add UUID primary key
4. Add purchase_order ForeignKey (PROTECT)
5. Add grn_number CharField (unique)
6. Add timestamps (created_at, updated_at)
7. Configure Meta class
8. Add __str__ method

### Expected Outcome
- GoodsReceipt model foundation
- Relationship with PurchaseOrder
- Unique GRN numbering support

---

## Task 52: Add GRN Core Fields

### Instructions
1. Add received_by ForeignKey to User (PROTECT)
2. Add received_at DateTimeField
3. Add status CharField (PENDING, COMPLETED, CANCELLED)
4. Add notes TextField
5. Update docstring

### GRN Core Fields
| Field | Type | Purpose |
|-------|------|---------|
| received_by | ForeignKey | User who received |
| received_at | DateTimeField | Receipt timestamp |
| status | CharField | GRN status |
| notes | TextField | General notes |

---

## Task 53: Add GRN Delivery Fields

### Instructions
1. Add delivery_note_number CharField
2. Add carrier CharField
3. Add delivery_date DateField
4. Add delivery_time TimeField (optional)
5. Add driver_name CharField (optional)
6. Add vehicle_number CharField (optional)

### Delivery Tracking
- Link to carrier delivery note
- Track delivery details
- Support audit requirements

---

## Task 54: Add GRN Inspection Fields

### Instructions
1. Add inspection_status CharField (PENDING, PASSED, FAILED)
2. Add inspection_notes TextField
3. Add inspected_by ForeignKey to User (optional)
4. Add inspected_at DateTimeField (optional)
5. Add inspection_passed BooleanField

### Inspection States
| Status | Meaning |
|--------|---------|
| PENDING | Awaiting inspection |
| PASSED | Inspection approved |
| FAILED | Quality issues found |

---

## Task 55: Create GRN Number Generator

### Instructions
1. Create `grn_number_generator.py` in services
2. Implement GRNNumberGenerator class
3. Add generate_grn_number method
4. Use format: GRN-{YEAR}-{SEQUENCE:05d}
5. Handle year rollover
6. Use POSettings for prefix
7. Integrate with GoodsReceipt save method

### GRN Number Format
```
GRN-2026-00001
GRN-2026-00002
...
GRN-2027-00001 (new year)
```

---

## Task 56: Create GRNLineItem Model

### Instructions
1. Create `grn_line_item.py` in models
2. Add UUID primary key
3. Add goods_receipt ForeignKey (CASCADE)
4. Add po_line ForeignKey to POLineItem (PROTECT)
5. Add line_number IntegerField
6. Add timestamps
7. Configure Meta class

### GRNLineItem Purpose
- Track which PO lines received
- Record quantities received per line
- Support partial receiving

---

## Task 57: Add GRN Line Fields

### Instructions
1. Add quantity_received PositiveIntegerField
2. Add quantity_rejected PositiveIntegerField (default=0)
3. Add quantity_accepted property (received - rejected)
4. Add receiving_warehouse ForeignKey (optional)
5. Add receiving_location ForeignKey (optional)
6. Add notes TextField

### Quantity Tracking
```
Ordered: 100
Received: 95
Rejected: 5
Accepted: 90 (to stock)
```

---

## Task 58: Add GRN Line Quality Fields

### Instructions
1. Add condition CharField (GOOD, DAMAGED, DEFECTIVE)
2. Add rejection_reason TextField
3. Add quality_notes TextField  
4. Add requires_followup BooleanField
5. Add images FileField/ImageField (optional)

### Quality Conditions
| Condition | Action |
|-----------|--------|
| GOOD | Add to stock |
| DAMAGED | Reject, notify vendor |
| DEFECTIVE | Reject, return to vendor |

---

## Task 59: Run GRN Migrations

### Instructions
1. Update `models/__init__.py` with GoodsReceipt, GRNLineItem imports
2. Run makemigrations purchases
3. Review migration file (0004_grn.py)
4. Apply to public schema
5. Apply to tenant schemas
6. Verify tables created
7. Test GRN creation

### Expected Tables
- purchases_goodsreceipt
- purchases_grnlineitem

---

## Summary

All GRN models created:
- ✅ GoodsReceipt model (16+ fields)
- ✅ GRN number generation
- ✅ GRNLineItem model (12+ fields)
- ✅ Quality tracking
- ✅ Migrations applied

### Next Steps
- **Document 02**: Implement receiving service and workflows
