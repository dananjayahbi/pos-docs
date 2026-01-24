# Tasks 49-50: Multi-Vendor Split and PO Consolidation

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 11 - Purchase Orders  
> **Group:** C - PO Creation & Sending  
> **Document:** 03 of 03  
> **Tasks Covered:** 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-43-48_Approval-History-Settings.md](02_Tasks-43-48_Approval-History-Settings.md)

---

## Document Overview

This document implements advanced PO operations: splitting reorder suggestions into separate POs by vendor, and consolidating multiple draft POs to the same vendor into a single PO.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Implement Multi-Vendor PO Split | High | 30 min |
| 50 | Implement PO Consolidation | Medium | 25 min |

---

## Task 49: Implement Multi-Vendor PO Split

### Overview
Implement splitting of product lists into separate purchase orders based on each product's preferred vendor, optimizing procurement efficiency.

### Instructions

1. **Add split_by_vendor method to POService**
   - Accept list of products with quantities
   - Accept user parameter
   - Group products by preferred_vendor
   - Create separate PO for each vendor
   - Return list of created POs

2. **Group products by vendor**
   - Create dictionary keyed by vendor_id
   - Collect products for each vendor
   - Maintain quantities and details

3. **Create PO for each vendor group**
   - Iterate through vendor groups
   - Call create_manual_po for each
   - Include all products for that vendor

4. **Handle products without preferred vendor**
   - Skip or assign to default vendor
   - Log warnings for manual review
   - Return list of skipped products

5. **Optimize vendor minimums**
   - Check vendor minimum order quantities
   - Adjust quantities if needed
   - Suggest combining with other products

6. **Add transaction wrapping**
   - Use database transaction
   - Rollback all if any fails
   - Ensure atomicity

### Multi-Vendor Split Logic

```
Input: Mixed product list
├── Product A: Preferred Vendor ABC
├── Product B: Preferred Vendor ABC  
├── Product C: Preferred Vendor XYZ
└── Product D: No preferred vendor

Processing:
├── Group by vendor:
│   ├── ABC: [Product A, Product B]
│   └── XYZ: [Product C]
├── Skipped: [Product D]

Output:
├── PO-2026-00001 (ABC): 2 products
├── PO-2026-00002 (XYZ): 1 product
└── Skipped products report
```

### Expected Outcome
- Efficient vendor grouping
- Multiple POs created automatically
- Vendor minimums respected
- Skipped products reported

### Verification Checklist
- [ ] split_by_vendor method implemented
- [ ] Vendor grouping logic working
- [ ] POs created for each vendor
- [ ] Missing vendor handling added
- [ ] Transaction safety ensured

---

## Task 50: Implement PO Consolidation

### Overview
Implement consolidation of multiple draft POs to the same vendor into a single PO, reducing administrative overhead and potentially qualifying for volume discounts.

### Instructions

1. **Add consolidate_pos method to POService**
   - Accept list of PO IDs to consolidate
   - Accept user parameter
   - Validate all POs are draft and same vendor
   - Create new consolidated PO
   - Mark original POs as cancelled/consolidated

2. **Validate consolidation eligibility**
   - All POs must be in DRAFT status
   - All POs must have same vendor
   - All POs must belong to same tenant
   - No approved POs can be consolidated

3. **Create consolidated PO**
   - Create new PurchaseOrder
   - Use vendor from original POs
   - Combine all line items
   - Merge notes and specifications

4. **Merge line items**
   - Combine same products
   - Sum quantities
   - Recalculate totals
   - Maintain individual line details if different prices

5. **Handle original POs**
   - Mark as CANCELLED with reason "Consolidated"
   - Link to new consolidated PO
   - Maintain history trail

6. **Recalculate consolidated PO**
   - Call calculation service
   - Update all totals
   - Apply vendor discounts

7. **Log consolidation**
   - Create history entries
   - Reference all original POs
   - Note consolidation benefit

### Consolidation Flow

```
Input: Multiple draft POs
├── PO-2026-00015 (Vendor ABC): Rs. 500,000
├── PO-2026-00018 (Vendor ABC): Rs. 300,000
└── PO-2026-00021 (Vendor ABC): Rs. 450,000

Validation:
├── All DRAFT: ✓
├── Same vendor: ✓
└── Eligible for consolidation: ✓

Process:
├── Create new PO-2026-00025
├── Combine line items (10 total)
├── Total: Rs. 1,250,000
├── Cancel original POs
└── Link to consolidated PO

Output:
├── New PO: PO-2026-00025 (Rs. 1,250,000)
└── Cancelled: PO-00015, PO-00018, PO-00021
```

### Line Item Merging

| Scenario | Action |
|----------|--------|
| Same product, same price | Combine quantities |
| Same product, different price | Keep separate lines |
| Different products | All lines included |

### Expected Outcome
- Multiple POs consolidated
- Reduced administrative work
- Better vendor pricing
- Clear audit trail

### Verification Checklist
- [ ] consolidate_pos method implemented
- [ ] Validation rules enforced
- [ ] New PO created correctly
- [ ] Line items merged properly
- [ ] Original POs marked
- [ ] History logged

---

## Summary

Group C Complete - All 16 tasks:
- ✅ POService class
- ✅ All creation methods
- ✅ Status transitions
- ✅ Approval workflow
- ✅ History tracking
- ✅ Settings configuration
- ✅ Advanced operations

### Next Steps
- **Group D**: Implement GRN and receiving workflow

---

## Validation Points

- [ ] All Group C tasks completed
- [ ] Split and consolidation working
- [ ] All service methods tested
- [ ] Ready for Group D (Receiving)
