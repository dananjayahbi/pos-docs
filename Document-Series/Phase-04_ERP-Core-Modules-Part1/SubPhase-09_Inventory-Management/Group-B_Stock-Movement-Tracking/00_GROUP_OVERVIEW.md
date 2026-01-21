# Group B: Stock Movement Tracking

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** B of F  
> **Tasks Covered:** 19-36  
> **Group Goal:** Implement complete stock movement history for full audit trail

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Stock Level Models](../Group-A_Stock-Level-Models/)
- **→ Next Group:** [Group C: Stock Operations Services](../Group-C_Stock-Operations-Services/)

---

## Group Overview

### Key Outcomes

1. **Movement Type Constants** - STOCK_IN, STOCK_OUT, TRANSFER, ADJUSTMENT, RESERVED, RELEASED
2. **Movement Reason Constants** - PURCHASE, SALE, RETURN, DAMAGE, THEFT, CORRECTION, EXPIRED
3. **StockMovement Model** - Complete audit trail for all stock changes
4. **Warehouse References** - Source and destination warehouse FKs with location tracking
5. **Reference Fields** - Link movements to orders, POs, adjustments
6. **Movement Manager** - Filter methods by type, date range, product
7. **Movement Validation** - Validate quantity, warehouse requirements per type
8. **Reversal Support** - Ability to reverse movements for corrections
9. **Movement Admin** - Admin interface with filters and read-only fields

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | StockMovement model with comprehensive indexes |
| PostgreSQL | Indexes on product, warehouse, created_at for fast queries |
| Django Admin | Movement history with date and type filters |
| GenericForeignKey | Reference type/ID for linking to various source documents |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-24_Movement-Types-Model-Structure.md` | 19-24 | Movement/reason constants, StockMovement model, warehouse FKs |
| 02 | `02_Tasks-25-30_Location-Reference-Fields.md` | 25-30 | Location FKs, reference fields, notes, cost, created_by |
| 03 | `03_Tasks-31-36_Meta-Manager-Validation-Admin.md` | 31-36 | Meta class, manager, validation, reversal, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Define movement type constants | Low | 10 min |
| 20 | Define movement reason constants | Low | 15 min |
| 21 | Create StockMovement model | Medium | 30 min |
| 22 | Add variant FK | Low | 15 min |
| 23 | Add source warehouse FK | Low | 15 min |
| 24 | Add destination warehouse FK | Low | 15 min |
| 25 | Add location FKs | Medium | 20 min |
| 26 | Add reason field | Low | 15 min |
| 27 | Add reference fields | Medium | 20 min |
| 28 | Add notes field | Low | 10 min |
| 29 | Add cost_per_unit field | Low | 15 min |
| 30 | Add created_by FK | Low | 15 min |
| 31 | Create StockMovement Meta class | Medium | 15 min |
| 32 | Add StockMovement manager | Medium | 25 min |
| 33 | Create movement validation | Medium | 25 min |
| 34 | Add movement reversal support | High | 30 min |
| 35 | Create movement summary methods | Medium | 20 min |
| 36 | Create StockMovement admin | Medium | 25 min |

---

## Execution Order

```
[Tasks 19-20: Movement type and reason constants]
         │
         ▼
[Tasks 21-24: StockMovement model with warehouse FKs]
         │
         ▼
[Tasks 25-28: Location FKs, reference fields, notes]
         │
         ▼
[Tasks 29-30: Cost tracking and created_by]
         │
         ▼
[Tasks 31-32: Meta class and manager]
         │
         ▼
[Tasks 33-35: Validation, reversal, summary methods]
         │
         ▼
[Task 36: Admin interface]
```

---

## Expected Deliverables

```
apps/inventory/stock/
├── models/
│   ├── __init__.py
│   └── stock_movement.py         # Tasks 21-35
├── constants.py                  # Tasks 19-20 (added to existing)
└── admin.py                      # Task 36 (added to existing)
```

---

## Notes for AI Agents

### Movement Types
| Type | Description | From WH | To WH |
|------|-------------|---------|-------|
| STOCK_IN | Receiving goods | None | ✓ |
| STOCK_OUT | Selling/shipping | ✓ | None |
| TRANSFER | Between warehouses | ✓ | ✓ |
| ADJUSTMENT | Correction | ✓ or None | ✓ or None |
| RESERVED | Reserved for order | N/A | N/A |
| RELEASED | Released reservation | N/A | N/A |

### Movement Reasons
| Reason | Description | Movement Types |
|--------|-------------|----------------|
| PURCHASE | Goods from supplier | STOCK_IN |
| SALE | Goods to customer | STOCK_OUT |
| RETURN | Customer/supplier returns | STOCK_IN, STOCK_OUT |
| DAMAGE | Damaged goods | ADJUSTMENT |
| THEFT | Theft/loss | ADJUSTMENT |
| CORRECTION | Manual correction | ADJUSTMENT |
| EXPIRED | Expired goods | ADJUSTMENT |
| TRANSFER | Warehouse transfer | TRANSFER |

### Validation Rules
- quantity must be > 0 for all movements
- STOCK_IN requires to_warehouse, from_warehouse must be NULL
- STOCK_OUT requires from_warehouse, to_warehouse must be NULL
- TRANSFER requires both from_warehouse and to_warehouse

### Reference Fields
- reference_type: ORDER, PURCHASE_ORDER, ADJUSTMENT, STOCK_TAKE
- reference_id: ID of the source document
- Use GenericForeignKey or simple type/id pattern

### Movement Reversal
- Create opposite movement with negated quantity
- Link reversal to original movement
- Include reversal reason in notes
