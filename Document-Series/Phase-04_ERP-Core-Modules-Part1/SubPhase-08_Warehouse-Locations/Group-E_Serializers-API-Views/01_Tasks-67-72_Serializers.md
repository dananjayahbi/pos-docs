# Tasks 67-72: Serializers

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** E - Serializers & API Views  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Warehouse-Operations-Routes/](../Group-D_Warehouse-Operations-Routes/)
- **→ Next Document:** [02_Tasks-73-78_ViewSets-Endpoints.md](02_Tasks-73-78_ViewSets-Endpoints.md)

---

## Document Overview

This document covers Django REST Framework serializers for warehouse and location API endpoints.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create WarehouseSerializer | Medium | 25 min |
| 68 | Create StorageLocationSerializer | High | 30 min |
| 69 | Create LocationTreeSerializer | High | 35 min |
| 70 | Create WarehouseZoneSerializer | Low | 20 min |
| 71 | Create TransferRouteSerializer | Medium | 25 min |
| 72 | Create WarehouseCapacitySerializer | Low | 20 min |

---

## Task 67: Create WarehouseSerializer

Create DRF serializer for Warehouse model with full CRUD support.

**Instructions:**
1. Create serializers.py in api/
2. Add WarehouseSerializer (ModelSerializer)
3. Include all fields from Warehouse model
4. Add read_only_fields: id, tenant, created_at, updated_at
5. Add nested address_display (formatted Sri Lankan address)
6. Add location_count calculated field (child locations)
7. Add capacity_summary calculated field
8. Add operating_hours_display formatted string
9. Validate phone_number format (+94XXXXXXXXX)
10. Validate district choices (25 Sri Lankan districts)
11. Validate is_default (only one per tenant)

**Calculated Fields:**
- `address_display`: "{street}, {city}, {district}, {postal_code}"
- `location_count`: Total StorageLocation count
- `capacity_summary`: "{used}/{total} ({percentage}%)"

---

## Task 68: Create StorageLocationSerializer

Create serializer for StorageLocation with hierarchy support.

**Instructions:**
1. Add StorageLocationSerializer (ModelSerializer)
2. Include all fields from StorageLocation model
3. Add parent_code read-only field
4. Add warehouse_name read-only field
5. Add location_path calculated field (full hierarchy path)
6. Add children_count calculated field
7. Add depth calculated field
8. Add capacity_percentage calculated field
9. Add has_stock boolean field
10. Validate location_type choices
11. Validate parent warehouse matches child warehouse
12. Validate parent location_type (hierarchy rules)
13. Prevent circular parent references

**Hierarchy Validation:**
```
ZONE → can have children: AISLE
AISLE → can have children: RACK
RACK → can have children: SHELF
SHELF → can have children: BIN
BIN → cannot have children (leaf node)
```

---

## Task 69: Create LocationTreeSerializer

Create specialized serializer for hierarchical tree view.

**Instructions:**
1. Add LocationTreeSerializer (ModelSerializer)
2. Add recursive children field (SerializerMethodField)
3. Use get_children method to retrieve direct children
4. Include: id, code, name, location_type, barcode
5. Add location_count_recursive (total descendants)
6. Add capacity_total_recursive
7. Add is_leaf boolean (no children)
8. Optimize with select_related and prefetch_related
9. Support max_depth parameter (prevent deep recursion)
10. Return tree structure with nested children arrays

**Tree Structure Example:**
```json
{
  "id": 123,
  "code": "WH-CMB-01-Z01",
  "name": "Receiving Zone",
  "location_type": "ZONE",
  "children": [
    {
      "id": 124,
      "code": "WH-CMB-01-Z01-A01",
      "name": "Aisle 1",
      "location_type": "AISLE",
      "children": [...]
    }
  ]
}
```

---

## Task 70: Create WarehouseZoneSerializer

Create serializer for WarehouseZone model.

**Instructions:**
1. Add WarehouseZoneSerializer (ModelSerializer)
2. Include all fields from WarehouseZone model
3. Add warehouse_code read-only field
4. Add location_code read-only field (if location FK exists)
5. Add location_count (total locations in zone)
6. Add capacity_summary
7. Add is_active boolean (based on location status)
8. Validate zone_purpose choices
9. Validate location belongs to same warehouse

---

## Task 71: Create TransferRouteSerializer

Create serializer for TransferRoute model with cost calculation.

**Instructions:**
1. Add TransferRouteSerializer (ModelSerializer)
2. Include all fields from TransferRoute model
3. Add from_zone_name read-only field
4. Add to_zone_name read-only field
5. Add warehouse_code read-only field
6. Add distance_display formatted string (e.g., "25.5 m")
7. Add estimated_cost calculated field (based on time_minutes)
8. Add is_bidirectional boolean field
9. Validate from_zone ≠ to_zone
10. Validate both zones belong to same warehouse

---

## Task 72: Create WarehouseCapacitySerializer

Create serializer for WarehouseCapacity model with utilization metrics.

**Instructions:**
1. Add WarehouseCapacitySerializer (ModelSerializer)
2. Include all fields from WarehouseCapacity model
3. Add warehouse_code read-only field
4. Add location_code read-only field (if applicable)
5. Add capacity_percentage calculated field
6. Add available_capacity calculated field (total - used)
7. Add utilization_status (LOW, MEDIUM, HIGH, CRITICAL)
8. Add needs_alert boolean (>90% usage)
9. Format weight_capacity with UOM (kg)
10. Format volume_capacity with UOM (m³)

**Utilization Status:**
```
LOW: < 50%
MEDIUM: 50-75%
HIGH: 75-90%
CRITICAL: > 90%
```

---

## Summary

These six tasks created all DRF serializers for the warehouse API:

1. **WarehouseSerializer** - Full CRUD with address formatting and location count
2. **StorageLocationSerializer** - Hierarchy validation and capacity calculations
3. **LocationTreeSerializer** - Recursive tree structure with nested children
4. **WarehouseZoneSerializer** - Zone details with location counts
5. **TransferRouteSerializer** - Route cost estimation and distance display
6. **WarehouseCapacitySerializer** - Utilization metrics with alert status

All serializers include:
- Read-only calculated fields
- Validation rules specific to warehouse domain
- Sri Lankan context (districts, phone format, address display)
- Optimized queries with select_related/prefetch_related hints

**→ Next:** [ViewSets & Endpoints](02_Tasks-73-78_ViewSets-Endpoints.md)

Tasks 73-78 will create DRF viewsets and API endpoints.
