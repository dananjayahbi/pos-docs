# Tasks 73-78: ViewSets & Endpoints

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** E - Serializers & API Views  
> **Document:** 02 of 02  
> **Tasks Covered:** 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-67-72_Serializers.md](01_Tasks-67-72_Serializers.md)
- **→ Next Group:** [../Group-F_Testing-Documentation/](../Group-F_Testing-Documentation/)

---

## Document Overview

This document covers DRF viewsets and API endpoints for warehouse management with permissions and custom actions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 73 | Create WarehouseViewSet | High | 35 min |
| 74 | Create StorageLocationViewSet | High | 40 min |
| 75 | Add location tree endpoint | Medium | 30 min |
| 76 | Add barcode lookup endpoint | Medium | 25 min |
| 77 | Add bulk location creation endpoint | High | 35 min |
| 78 | Register API routes | Low | 20 min |

---

## Task 73: Create WarehouseViewSet

Create DRF viewset for Warehouse with full CRUD and custom actions.

**Instructions:**
1. Create views.py in api/
2. Add WarehouseViewSet (ModelViewSet)
3. Set queryset with tenant filtering
4. Set serializer_class to WarehouseSerializer
5. Add permission_classes (IsAuthenticated, WarehousePermission)
6. Add filterset_fields: code, city, district, is_active, is_default
7. Add search_fields: code, name, city, district
8. Add ordering_fields: code, name, created_at
9. Override get_queryset to filter by tenant
10. Add @action for dashboard (GET /warehouses/{id}/dashboard/)
11. Add @action for set_default (POST /warehouses/{id}/set_default/)
12. Add @action for capacity_report (GET /warehouses/{id}/capacity/)
13. Cache list view for 5 minutes
14. Return 404 if warehouse not in user's tenant

**Custom Actions:**
- `dashboard` - Returns warehouse statistics (uses Task 63 service)
- `set_default` - Sets warehouse as tenant default
- `capacity_report` - Returns capacity summary by zone

---

## Task 74: Create StorageLocationViewSet

Create viewset for StorageLocation with hierarchy operations.

**Instructions:**
1. Add StorageLocationViewSet (ModelViewSet)
2. Set queryset with select_related('warehouse', 'parent')
3. Set serializer_class to StorageLocationSerializer
4. Add permission_classes (IsAuthenticated, LocationPermission)
5. Add filterset_fields: warehouse, location_type, parent, is_active, is_pickable, is_receivable
6. Add search_fields: code, name, barcode
7. Add ordering_fields: code, name, created_at
8. Override perform_create to set tenant from warehouse
9. Add @action for children (GET /locations/{id}/children/)
10. Add @action for ancestors (GET /locations/{id}/ancestors/)
11. Add @action for descendants (GET /locations/{id}/descendants/)
12. Add @action for siblings (GET /locations/{id}/siblings/)
13. Add validation for hierarchy rules (Task 68)
14. Support depth query parameter for descendants

**Custom Actions:**
- `children` - Returns direct children only
- `ancestors` - Returns parent chain to root warehouse
- `descendants` - Returns all nested children (with max depth)
- `siblings` - Returns locations with same parent

---

## Task 75: Add Location Tree Endpoint

Create endpoint to retrieve full location hierarchy tree.

**Instructions:**
1. Add tree @action to StorageLocationViewSet
2. Route: GET /locations/tree/?warehouse={id}
3. Use LocationTreeSerializer from Task 69
4. Filter by warehouse query parameter (required)
5. Support location_type filter (e.g., only show ZONEs)
6. Support max_depth parameter (default 10)
7. Return root locations (parent=None) with nested children
8. Optimize with prefetch_related('children__children__children')
9. Cache tree for 10 minutes per warehouse
10. Return 400 if warehouse parameter missing

**Query Parameters:**
- `warehouse` (required) - Warehouse ID
- `location_type` (optional) - Filter root by type
- `max_depth` (optional) - Max recursion depth (1-10)

**Example Response:**
```json
[
  {
    "id": 100,
    "code": "WH-CMB-01-Z01",
    "name": "Receiving Zone",
    "location_type": "ZONE",
    "children": [
      {
        "id": 101,
        "code": "WH-CMB-01-Z01-A01",
        "name": "Aisle 1",
        "location_type": "AISLE",
        "children": [...]
      }
    ]
  }
]
```

---

## Task 76: Add Barcode Lookup Endpoint

Create endpoint to find locations by barcode or QR code.

**Instructions:**
1. Add barcode_lookup @action to StorageLocationViewSet
2. Route: GET /locations/barcode/{barcode}/
3. Use BarcodeLookup service from Task 42
4. Support both Code 128 barcodes and QR codes
5. Return StorageLocationSerializer data
6. Log scan event (BarcodeScan model from Task 49)
7. Return 404 if barcode not found
8. Return 400 if barcode format invalid
9. Add response metadata: scan_timestamp, lookup_time_ms

**Example Response:**
```json
{
  "location": {
    "id": 150,
    "code": "WH-CMB-01-Z02-A03-R05",
    "name": "Rack 5",
    "location_type": "RACK",
    "barcode": "LOC-TENT001-WH001-LOC150-8"
  },
  "metadata": {
    "scan_timestamp": "2025-01-15T10:30:00Z",
    "lookup_time_ms": 45
  }
}
```

---

## Task 77: Add Bulk Location Creation Endpoint

Create endpoint to generate multiple locations at once.

**Instructions:**
1. Add bulk_create @action to StorageLocationViewSet
2. Route: POST /locations/bulk_create/
3. Accept JSON payload with:
   - warehouse_id
   - parent_id (optional, for nested creation)
   - location_type
   - name_template (e.g., "Bin {number}")
   - count (max 100)
   - start_number (default 1)
4. Use BulkLocationGenerator from Task 35
5. Generate barcodes automatically (Task 39 signal)
6. Return list of created locations
7. Validate count ≤ 100
8. Run in database transaction
9. Return 400 if validation fails

**Example Payload:**
```json
{
  "warehouse_id": 1,
  "parent_id": 150,
  "location_type": "BIN",
  "name_template": "Bin {number}",
  "count": 50,
  "start_number": 1
}
```

**Result:** Creates bins: "Bin 1", "Bin 2", ..., "Bin 50"

---

## Task 78: Register API Routes

Register all viewsets with Django REST Framework router.

**Instructions:**
1. Create urls.py in api/
2. Import DefaultRouter from rest_framework.routers
3. Create router instance
4. Register WarehouseViewSet at 'warehouses'
5. Register StorageLocationViewSet at 'locations'
6. Register WarehouseZoneViewSet at 'zones'
7. Register TransferRouteViewSet at 'routes'
8. Register WarehouseCapacityViewSet at 'capacity'
9. Include router.urls in urlpatterns
10. Add warehouse API prefix: /api/v1/warehouse/

**URL Structure:**
```
/api/v1/warehouse/warehouses/
/api/v1/warehouse/warehouses/{id}/
/api/v1/warehouse/warehouses/{id}/dashboard/
/api/v1/warehouse/warehouses/{id}/set_default/
/api/v1/warehouse/locations/
/api/v1/warehouse/locations/tree/
/api/v1/warehouse/locations/barcode/{barcode}/
/api/v1/warehouse/locations/bulk_create/
/api/v1/warehouse/locations/{id}/
/api/v1/warehouse/locations/{id}/children/
/api/v1/warehouse/zones/
/api/v1/warehouse/routes/
/api/v1/warehouse/capacity/
```

---

## Summary

These six tasks completed the warehouse API layer:

1. **WarehouseViewSet** - CRUD with dashboard, set_default, capacity_report actions
2. **StorageLocationViewSet** - CRUD with children, ancestors, descendants, siblings actions
3. **Location tree endpoint** - Full hierarchy tree with nested children
4. **Barcode lookup endpoint** - Scan-and-find with logging
5. **Bulk creation endpoint** - Generate up to 100 locations at once
6. **API routes** - Registered all endpoints with /api/v1/warehouse/ prefix

### Group E Complete

All 12 tasks in Group E documented:
- ✓ Six serializers (Warehouse, StorageLocation, Tree, Zone, Route, Capacity)
- ✓ Two main viewsets with permissions and filtering
- ✓ Custom actions: dashboard, set_default, children, ancestors, descendants, siblings
- ✓ Tree endpoint with recursion and caching
- ✓ Barcode lookup with scan logging
- ✓ Bulk creation endpoint
- ✓ Complete API route structure

**→ Proceed to Group F:** [Testing & Documentation](../Group-F_Testing-Documentation/)

Group F will create pytest tests and user-facing documentation.
