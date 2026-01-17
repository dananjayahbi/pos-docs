# SubPhase-08: Warehouse & Locations - Tasks Summary

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 of 10  
> **SubPhase Goal:** Implement multi-warehouse and storage location management system  
> **Total Tasks:** 84 | **Status:** Planning

---

## Navigation

- **↑ Parent:** [Phase-04 Summary](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-07: Product Media](../SubPhase-07_Product-Media/)
- **→ Next SubPhase:** [SubPhase-09: Inventory Management](../SubPhase-09_Inventory-Management/)

---

## SubPhase Overview

This sub-phase implements the complete warehouse and storage location infrastructure for LankaCommerce Cloud. The system supports multiple warehouses per tenant with hierarchical storage locations (zones, aisles, racks, bins), barcode integration for picking operations, and default warehouse designation for POS terminals. This foundation is essential for the inventory management system in SubPhase-09.

### Key Outcomes
- Warehouse model with address, contact info, and operating hours
- StorageLocation model with hierarchical structure
- Location barcode generation and scanning support
- Default warehouse configuration per tenant/POS terminal
- Warehouse zones and bin management
- Transfer routes between warehouses

### Dependencies
- Phase-03: Base models, tenant isolation, TenantAwareModel

---

## Execution Flow Diagram

```
[Group A: Warehouse Model & Configuration]
         │
         ▼
[Group B: Storage Location Hierarchy]
         │
         ▼
[Group C: Location Barcodes & Scanning]
         │
         ▼
[Group D: Warehouse Operations & Routes]
         │
         ▼
[Group E: Serializers & API Views]
         │
         ▼
[Group F: Testing & Documentation]
```

---

## Task Index

### Group A: Warehouse Model & Configuration (Tasks 01-18)

Core warehouse model with configuration and tenant settings.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 01 | Create inventory app structure | Initialize `apps/inventory/` module with __init__, apps.py configuration | 15 min |
| 02 | Create warehouse submodule | Create `apps/inventory/warehouses/` package with __init__.py | 10 min |
| 03 | Define warehouse status constants | Create constants for ACTIVE, INACTIVE, MAINTENANCE statuses | 10 min |
| 04 | Define warehouse type constants | Create constants for MAIN, DISTRIBUTION, RETAIL, RETURNS types | 10 min |
| 05 | Create Warehouse model | Define model with name, code (unique), warehouse_type fields | 30 min |
| 06 | Add warehouse address fields | Add address_line_1, address_line_2, city, postal_code, district fields | 20 min |
| 07 | Add Sri Lanka district choices | Create choices for 25 districts of Sri Lanka | 15 min |
| 08 | Add warehouse contact fields | Add phone, email, manager_name fields | 15 min |
| 09 | Add warehouse status field | Add status field with ACTIVE/INACTIVE/MAINTENANCE choices | 15 min |
| 10 | Add is_default field | Boolean to mark default warehouse for POS operations | 15 min |
| 11 | Add operating hours fields | Add opens_at, closes_at TimeFields for operational hours | 15 min |
| 12 | Add warehouse coordinates | Add latitude, longitude DecimalFields for location mapping | 15 min |
| 13 | Create Warehouse Meta class | Define db_table, indexes on code and status, ordering by name | 15 min |
| 14 | Add Warehouse model manager | Create manager with get_active(), get_default() methods | 25 min |
| 15 | Create is_default constraint | Ensure only one warehouse per tenant can be is_default=True | 25 min |
| 16 | Add set_as_default method | Method to set warehouse as default, unset others | 20 min |
| 17 | Create warehouse validation | Validate code uniqueness within tenant, phone format (+94) | 20 min |
| 18 | Create Warehouse admin | Register admin with list display, filters, search | 25 min |

---

### Group B: Storage Location Hierarchy (Tasks 19-36)

Hierarchical storage locations within warehouses.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 19 | Define location type constants | Create constants for ZONE, AISLE, RACK, SHELF, BIN | 10 min |
| 20 | Create StorageLocation model | Define model with warehouse FK, name, location_type fields | 30 min |
| 21 | Add parent FK for hierarchy | Add parent self-referential FK for location hierarchy | 20 min |
| 22 | Add location code field | Add code field for quick identification (e.g., "A-03-02") | 15 min |
| 23 | Add location barcode field | Add barcode field for scanning operations | 15 min |
| 24 | Add location capacity fields | Add max_weight, max_volume, max_items fields for capacity limits | 20 min |
| 25 | Add is_active field | Boolean for enabling/disabling locations | 10 min |
| 26 | Add is_pickable field | Boolean indicating if location is used for picking | 10 min |
| 27 | Add is_receivable field | Boolean indicating if location can receive goods | 10 min |
| 28 | Create StorageLocation Meta class | Define db_table, indexes on warehouse and code | 15 min |
| 29 | Add StorageLocation manager | Create manager with get_by_warehouse(), get_pickable() methods | 25 min |
| 30 | Create location path property | Return full path: "Zone A > Aisle 3 > Rack 2 > Bin 5" | 20 min |
| 31 | Add location depth property | Calculate depth in hierarchy (0 for zone, 1 for aisle, etc.) | 15 min |
| 32 | Create get_children method | Return all direct children of location | 15 min |
| 33 | Create get_all_descendants method | Return all descendants using recursive query | 25 min |
| 34 | Add location validation | Ensure parent is from same warehouse, valid hierarchy | 25 min |
| 35 | Create bulk location generator | Utility to generate locations: "A1-01" through "A1-50" | 30 min |
| 36 | Create StorageLocation admin | Admin with tree display, filters by warehouse and type | 30 min |

---

### Group C: Location Barcodes & Scanning (Tasks 37-50)

Barcode generation and scanning support for warehouse operations.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 37 | Define barcode format constants | Create constants for barcode prefix, length, check digit | 10 min |
| 38 | Create BarcodeGenerator service | Build service class for generating location barcodes | 25 min |
| 39 | Implement generate_location_barcode | Generate unique barcode for storage location | 20 min |
| 40 | Add barcode validation method | Validate barcode format and check digit | 20 min |
| 41 | Create auto-generate barcode signal | Pre-save signal to generate barcode if not provided | 20 min |
| 42 | Create BarcodeLookup service | Service to find location by barcode scan | 25 min |
| 43 | Add lookup_location method | Find StorageLocation by barcode | 15 min |
| 44 | Add lookup_product_in_location | Find product stock at scanned location | 20 min |
| 45 | Create barcode label generator | Generate printable barcode labels for locations | 30 min |
| 46 | Add QR code support | Generate QR codes for locations with encoded data | 25 min |
| 47 | Create bulk barcode print | Generate PDF with multiple location barcodes | 30 min |
| 48 | Add barcode scan logging | Log all barcode scans for audit trail | 20 min |
| 49 | Create BarcodeScan model | Model to track scan events: location, user, timestamp | 25 min |
| 50 | Add scan analytics | Track scan frequency per location for optimization | 20 min |

---

### Group D: Warehouse Operations & Routes (Tasks 51-66)

Warehouse operational features and inter-warehouse routing.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 51 | Create WarehouseZone model | Define logical zones within warehouse (Receiving, Picking, Shipping) | 25 min |
| 52 | Add zone purpose field | Field for zone purpose: RECEIVING, STORAGE, PICKING, SHIPPING, RETURNS | 15 min |
| 53 | Create zone-location mapping | Link StorageLocation to WarehouseZone | 20 min |
| 54 | Create TransferRoute model | Define valid transfer paths between warehouses | 25 min |
| 55 | Add route fields | Add source_warehouse, destination_warehouse FKs, transit_days | 20 min |
| 56 | Add route cost field | Add estimated_cost for transfer cost calculation | 15 min |
| 57 | Add route validation | Ensure source != destination, no duplicate routes | 20 min |
| 58 | Create route lookup method | Find route between two warehouses | 20 min |
| 59 | Add multi-hop routing | Support transfers via intermediate warehouses | 30 min |
| 60 | Create WarehouseCapacity model | Track total capacity and current utilization | 25 min |
| 61 | Add capacity calculation | Calculate used capacity from stock levels | 25 min |
| 62 | Add capacity alerts | Alert when warehouse reaches 90% capacity | 20 min |
| 63 | Create warehouse dashboard data | Service to provide warehouse summary stats | 30 min |
| 64 | Add location utilization tracking | Track how full each location is | 25 min |
| 65 | Create DefaultWarehouseConfig model | Tenant-level and user-level default warehouse settings | 25 min |
| 66 | Add POS terminal warehouse mapping | Link POS terminals to specific warehouses | 20 min |

---

### Group E: Serializers & API Views (Tasks 67-78)

DRF serializers and viewsets for warehouse management.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 67 | Create WarehouseSerializer | Serializer with all warehouse fields, nested address | 25 min |
| 68 | Add warehouse stats fields | SerializerMethodField for location_count, capacity_used | 20 min |
| 69 | Create StorageLocationSerializer | Serializer with hierarchy info, full path | 25 min |
| 70 | Create LocationTreeSerializer | Nested serializer for hierarchical tree display | 25 min |
| 71 | Create WarehouseZoneSerializer | Serializer for zone configuration | 15 min |
| 72 | Create TransferRouteSerializer | Serializer for route management | 20 min |
| 73 | Create WarehouseViewSet | ModelViewSet with CRUD, set-default action | 30 min |
| 74 | Add warehouse permissions | Ensure only managers can modify warehouses | 20 min |
| 75 | Create StorageLocationViewSet | ViewSet with hierarchy navigation endpoints | 30 min |
| 76 | Add location tree endpoint | GET /warehouses/{id}/location-tree/ for full tree | 25 min |
| 77 | Add barcode lookup endpoint | GET /locations/lookup/{barcode}/ for scan lookup | 20 min |
| 78 | Create bulk location create endpoint | POST /warehouses/{id}/locations/bulk/ for mass creation | 25 min |

---

### Group F: Testing & Documentation (Tasks 79-84)

Comprehensive testing and documentation for warehouse system.

| Task # | Task Name | Description | Est. Time |
|--------|-----------|-------------|-----------|
| 79 | Create Warehouse model tests | Test model creation, is_default constraint, validation | 30 min |
| 80 | Create StorageLocation tests | Test hierarchy, path generation, validation | 30 min |
| 81 | Create barcode generation tests | Test barcode format, uniqueness, validation | 25 min |
| 82 | Create API endpoint tests | Test all ViewSet actions with authentication | 35 min |
| 83 | Write warehouse module documentation | Document all models, services, API endpoints | 40 min |
| 84 | Create warehouse setup guide | User guide for setting up warehouses and locations | 35 min |

---

## Expected File Structure

```
apps/inventory/
├── __init__.py
├── apps.py
├── warehouses/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── warehouse.py              # Tasks 05-17
│   │   ├── storage_location.py       # Tasks 20-35
│   │   ├── warehouse_zone.py         # Tasks 51-53
│   │   ├── transfer_route.py         # Tasks 54-59
│   │   ├── warehouse_capacity.py     # Tasks 60-62
│   │   ├── barcode_scan.py           # Task 49
│   │   └── default_config.py         # Tasks 65-66
│   ├── services/
│   │   ├── __init__.py
│   │   ├── barcode_generator.py      # Tasks 38-41
│   │   ├── barcode_lookup.py         # Tasks 42-44
│   │   ├── label_generator.py        # Tasks 45-47
│   │   ├── route_finder.py           # Tasks 58-59
│   │   └── dashboard.py              # Task 63
│   ├── serializers/
│   │   ├── __init__.py
│   │   ├── warehouse.py              # Tasks 67-68
│   │   ├── storage_location.py       # Tasks 69-70
│   │   └── transfer_route.py         # Task 72
│   ├── views/
│   │   ├── __init__.py
│   │   ├── warehouse.py              # Tasks 73-74
│   │   └── storage_location.py       # Tasks 75-78
│   ├── admin.py                      # Tasks 18, 36
│   ├── urls.py
│   └── constants.py                  # Tasks 03, 04, 19, 37
└── tests/
    └── warehouses/
        ├── __init__.py
        ├── test_models.py            # Tasks 79-80
        ├── test_barcodes.py          # Task 81
        └── test_api.py               # Task 82
```

---

## Progress Tracking

| Group | Description | Tasks | Completed | Status |
|-------|-------------|-------|-----------|--------|
| A | Warehouse Model & Configuration | 18 | 0 | 🔴 Not Started |
| B | Storage Location Hierarchy | 18 | 0 | 🔴 Not Started |
| C | Location Barcodes & Scanning | 14 | 0 | 🔴 Not Started |
| D | Warehouse Operations & Routes | 16 | 0 | 🔴 Not Started |
| E | Serializers & API Views | 12 | 0 | 🔴 Not Started |
| F | Testing & Documentation | 6 | 0 | 🔴 Not Started |
| **Total** | | **84** | **0** | 🔴 |

---

## Notes for AI Agents

### Warehouse Types
| Type | Description | Use Case |
|------|-------------|----------|
| MAIN | Primary storage facility | Main stock storage |
| DISTRIBUTION | Fulfillment center | Order processing |
| RETAIL | Store warehouse | Retail POS stock |
| RETURNS | Returns processing | RMA handling |

### Location Type Hierarchy
```
ZONE (depth: 0)
  └── AISLE (depth: 1)
        └── RACK (depth: 2)
              └── SHELF (depth: 3)
                    └── BIN (depth: 4)
```

### Location Code Format
```
{Zone}{Aisle}-{Rack}-{Shelf}-{Bin}
Example: A03-02-04-01

Where:
- A = Zone letter (A-Z)
- 03 = Aisle number (01-99)
- 02 = Rack number (01-99)
- 04 = Shelf number (01-99)
- 01 = Bin number (01-99)
```

### Sri Lanka Districts (for Warehouse Address)
```python
DISTRICTS = [
    ('colombo', 'Colombo'),
    ('gampaha', 'Gampaha'),
    ('kalutara', 'Kalutara'),
    ('kandy', 'Kandy'),
    ('matale', 'Matale'),
    ('nuwara_eliya', 'Nuwara Eliya'),
    ('galle', 'Galle'),
    ('matara', 'Matara'),
    ('hambantota', 'Hambantota'),
    ('jaffna', 'Jaffna'),
    ('kilinochchi', 'Kilinochchi'),
    ('mannar', 'Mannar'),
    ('mullaitivu', 'Mullaitivu'),
    ('vavuniya', 'Vavuniya'),
    ('trincomalee', 'Trincomalee'),
    ('batticaloa', 'Batticaloa'),
    ('ampara', 'Ampara'),
    ('kurunegala', 'Kurunegala'),
    ('puttalam', 'Puttalam'),
    ('anuradhapura', 'Anuradhapura'),
    ('polonnaruwa', 'Polonnaruwa'),
    ('badulla', 'Badulla'),
    ('monaragala', 'Monaragala'),
    ('ratnapura', 'Ratnapura'),
    ('kegalle', 'Kegalle'),
]
```

### Barcode Format
```
LOC-{TENANT_PREFIX}-{WAREHOUSE_CODE}-{LOCATION_CODE}-{CHECK_DIGIT}
Example: LOC-ABC-WH01-A0301-7

Components:
- LOC: Fixed prefix for location barcodes
- TENANT_PREFIX: 3-char tenant identifier
- WAREHOUSE_CODE: 4-char warehouse code
- LOCATION_CODE: Variable length location code
- CHECK_DIGIT: Luhn algorithm check digit
```

### is_default Constraint Logic
```python
# On save, if is_default=True:
Warehouse.objects.filter(
    tenant=self.tenant,
    is_default=True
).exclude(pk=self.pk).update(is_default=False)
```

### Hierarchy Validation Rules
- ZONE: Must have no parent (root level)
- AISLE: Parent must be ZONE
- RACK: Parent must be AISLE
- SHELF: Parent must be RACK
- BIN: Parent must be SHELF
- All locations in hierarchy must belong to same warehouse

### Transfer Route Example
```
Route: Colombo Main → Kandy Distribution
- source_warehouse: "colombo-main"
- destination_warehouse: "kandy-distribution"
- transit_days: 1
- estimated_cost: 2500.00 (LKR per shipment)
- is_active: True
```

### Capacity Calculation
```python
def calculate_used_capacity(warehouse):
    total_items = StockLevel.objects.filter(
        warehouse=warehouse
    ).aggregate(total=Sum('quantity'))['total'] or 0
    
    max_capacity = warehouse.max_item_capacity
    return (total_items / max_capacity) * 100 if max_capacity else 0
```

---

## Changelog

| Date | Author | Changes |
|------|--------|---------|
| TBD | AI Agent | Initial task summary creation |
