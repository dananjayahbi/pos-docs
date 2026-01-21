# Group E: Serializers & API Views

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** E of F  
> **Tasks Covered:** 67-78  
> **Group Goal:** Create DRF serializers and viewsets for warehouse management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Warehouse-Operations-Routes](../Group-D_Warehouse-Operations-Routes/)
- **→ Next Group:** [Group-F_Testing-Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes
- WarehouseSerializer with all fields and nested address
- Warehouse stats fields (location_count, capacity_used)
- StorageLocationSerializer with hierarchy info
- LocationTreeSerializer (nested tree display)
- WarehouseZoneSerializer
- TransferRouteSerializer
- WarehouseViewSet with CRUD and set-default action
- Warehouse permissions (managers only for modify)
- StorageLocationViewSet with hierarchy navigation
- Location tree endpoint
- Barcode lookup endpoint
- Bulk location create endpoint

### Technology Context
- **Framework:** Django REST Framework 3.15+
- **Tree Serializer:** Recursive nested structure
- **Permissions:** Manager-level for modifications

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-67-72_Serializers.md | 67-72 | Warehouse, stats, StorageLocation, tree, zone, route serializers |
| 02 | 02_Tasks-73-78_ViewSets-Endpoints.md | 73-78 | WarehouseViewSet, permissions, StorageLocationViewSet, tree, lookup, bulk |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create WarehouseSerializer | Medium | 25 min |
| 68 | Add warehouse stats fields | Low | 20 min |
| 69 | Create StorageLocationSerializer | Medium | 25 min |
| 70 | Create LocationTreeSerializer | Medium | 25 min |
| 71 | Create WarehouseZoneSerializer | Low | 15 min |
| 72 | Create TransferRouteSerializer | Low | 20 min |
| 73 | Create WarehouseViewSet | High | 30 min |
| 74 | Add warehouse permissions | Low | 20 min |
| 75 | Create StorageLocationViewSet | High | 30 min |
| 76 | Add location tree endpoint | Medium | 25 min |
| 77 | Add barcode lookup endpoint | Low | 20 min |
| 78 | Create bulk location create endpoint | Medium | 25 min |

---

## Execution Order

```
Tasks 67-72: Serializers
    │ (Warehouse, stats, StorageLocation, tree, zone, route)
    ▼
Tasks 73-78: ViewSets & Endpoints
    │ (WarehouseViewSet, permissions, StorageLocationViewSet,
    │  tree, barcode lookup, bulk create)
```

---

## Expected Deliverables

```
backend/apps/inventory/warehouses/
├── serializers/
│   ├── __init__.py (NEW)
│   ├── warehouse.py (NEW)
│   ├── storage_location.py (NEW)
│   └── transfer_route.py (NEW)
├── views/
│   ├── __init__.py (NEW)
│   ├── warehouse.py (NEW)
│   └── storage_location.py (NEW)
└── urls.py (NEW)
```

---

## Notes for AI Agents

1. **WarehouseSerializer Fields:**
   - id, name, code, warehouse_type, status
   - address (nested: line_1, line_2, city, district, postal_code)
   - contact (phone, email, manager_name)
   - is_default, opens_at, closes_at
   - latitude, longitude
2. **Stats Fields (SerializerMethodField):**
   - location_count: Count of StorageLocation
   - capacity_used: Percentage utilization
3. **LocationTreeSerializer:** Recursive children field
4. **API Endpoints:**
   - GET/POST /warehouses/
   - GET/PUT/DELETE /warehouses/{id}/
   - POST /warehouses/{id}/set-default/
   - GET /warehouses/{id}/location-tree/
   - GET /locations/lookup/{barcode}/
   - POST /warehouses/{id}/locations/bulk/
5. **Permissions:**
   - View: All authenticated users
   - Create/Update/Delete: Manager permission
6. **Bulk Create Format:**
   ```json
   {"pattern": "A{01-10}-{01-05}", "location_type": "BIN"}
   ```
7. **Tree Endpoint:** Returns full nested hierarchy
8. **Barcode Lookup:** Return location details by barcode
9. **Filter Options:** status, warehouse_type, district
10. **Next Group:** Testing & Documentation (Group F)
