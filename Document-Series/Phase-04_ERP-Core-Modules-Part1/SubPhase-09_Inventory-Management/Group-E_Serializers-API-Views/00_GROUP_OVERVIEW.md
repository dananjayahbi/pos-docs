# Group E: Serializers & API Views

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 09 - Inventory Management  
> **Group:** E of F  
> **Tasks Covered:** 73-84  
> **Group Goal:** Create DRF serializers and viewsets for inventory management API

---

## Navigation

- **↑ Parent:** [SubPhase-09 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group D: Stock Take & Adjustments](../Group-D_Stock-Take-Adjustments/)
- **→ Next Group:** [Group F: Testing & Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes

1. **StockLevelSerializer** - Product info, quantities, status display
2. **Available Stock Field** - SerializerMethodField for calculated availability
3. **StockMovementSerializer** - Movement details with reference info
4. **StockOperationSerializer** - Write serializer for stock operations
5. **StockTakeSerializer** - Nested serializer for stock take with items
6. **StockLevelViewSet** - ReadOnly ViewSet with filters
7. **StockMovementViewSet** - ReadOnly ViewSet for movement history
8. **Stock Operation Endpoints** - POST endpoints for in, out, transfer, adjust
9. **StockTakeViewSet** - ViewSet with start, count, complete actions
10. **Bulk Count Endpoint** - Batch counting for stock takes
11. **Stock Availability Endpoint** - Product availability across warehouses
12. **Stock History Endpoint** - Movement history with date filters

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django REST Framework | Serializers, ViewSets, routers |
| django-filter | Filter backends for stock queries |
| Nested Serializers | Stock take with items, movements with references |
| Custom Actions | ViewSet actions for stock operations |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-73-77_Serializers.md` | 73-77 | StockLevel, StockMovement, StockOperation, StockTake serializers |
| 02 | `02_Tasks-78-81_ViewSets.md` | 78-81 | StockLevel, StockMovement, StockOperation, StockTake viewsets |
| 03 | `03_Tasks-82-84_Additional-Endpoints.md` | 82-84 | Bulk count, availability, history endpoints |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create StockLevelSerializer | Medium | 25 min |
| 74 | Add available stock field | Low | 15 min |
| 75 | Create StockMovementSerializer | Medium | 25 min |
| 76 | Create StockOperationSerializer | Medium | 25 min |
| 77 | Create StockTakeSerializer | High | 30 min |
| 78 | Create StockLevelViewSet | Medium | 25 min |
| 79 | Create StockMovementViewSet | Medium | 25 min |
| 80 | Create stock operation endpoints | High | 35 min |
| 81 | Create StockTakeViewSet | High | 35 min |
| 82 | Add bulk count endpoint | Medium | 25 min |
| 83 | Add stock availability endpoint | Medium | 25 min |
| 84 | Add stock history endpoint | Medium | 25 min |

---

## Execution Order

```
[Tasks 73-74: StockLevelSerializer with available stock]
         │
         ▼
[Tasks 75-76: StockMovementSerializer and StockOperationSerializer]
         │
         ▼
[Task 77: StockTakeSerializer with nested items]
         │
         ▼
[Tasks 78-79: StockLevel and StockMovement ViewSets]
         │
         ▼
[Tasks 80-81: Stock operation and StockTake ViewSets]
         │
         ▼
[Tasks 82-84: Additional endpoints]
```

---

## Expected Deliverables

```
apps/inventory/stock/
├── serializers/
│   ├── __init__.py
│   ├── stock_level.py            # Tasks 73-74
│   ├── stock_movement.py         # Task 75
│   ├── stock_operation.py        # Task 76
│   └── stock_take.py             # Task 77
├── views/
│   ├── __init__.py
│   ├── stock_level.py            # Task 78
│   ├── stock_movement.py         # Task 79
│   ├── stock_operations.py       # Task 80
│   └── stock_take.py             # Task 81
└── urls.py                       # All routes
```

---

## Notes for AI Agents

### API Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/stock-levels/ | List stock levels with filters |
| GET | /api/stock-movements/ | List movement history |
| POST | /api/stock/in/ | Stock in operation |
| POST | /api/stock/out/ | Stock out operation |
| POST | /api/stock/transfer/ | Transfer between warehouses |
| POST | /api/stock/adjust/ | Stock adjustment |
| GET/POST | /api/stock-takes/ | List/create stock takes |
| POST | /api/stock-takes/{id}/start/ | Start counting session |
| POST | /api/stock-takes/{id}/count/ | Record single count |
| POST | /api/stock-takes/{id}/bulk-count/ | Record multiple counts |
| POST | /api/stock-takes/{id}/complete/ | Complete stock take |
| GET | /api/products/{id}/availability/ | Stock by warehouse |
| GET | /api/products/{id}/movements/ | Movement history |

### Filter Options
- StockLevel: product, warehouse, location, status
- StockMovement: product, warehouse, movement_type, date range
- StockTake: warehouse, status, date range

### StockOperationSerializer Fields
- product_id (required)
- variant_id (optional)
- warehouse_id (required)
- location_id (optional)
- quantity (required, > 0)
- reason (required for adjustments)
- reference_type (optional)
- reference_id (optional)
- notes (optional)

### Permissions
- StockLevel: Read-only for staff, managers
- StockOperations: Write requires inventory permissions
- StockTake: Create/complete requires manager role
