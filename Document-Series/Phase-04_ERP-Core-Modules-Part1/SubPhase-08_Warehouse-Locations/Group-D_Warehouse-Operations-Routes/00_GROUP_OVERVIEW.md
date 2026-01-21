# Group D: Warehouse Operations & Routes

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement warehouse zones, transfer routes, and capacity management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Location-Barcodes-Scanning](../Group-C_Location-Barcodes-Scanning/)
- **→ Next Group:** [Group-E_Serializers-API-Views](../Group-E_Serializers-API-Views/)

---

## Group Overview

### Key Outcomes
- WarehouseZone model (logical zones within warehouse)
- Zone purpose field (RECEIVING, STORAGE, PICKING, SHIPPING, RETURNS)
- Zone-to-location mapping
- TransferRoute model (paths between warehouses)
- Route fields (source, destination, transit_days)
- Route cost estimation
- Route validation (no duplicates, source ≠ destination)
- Route lookup method
- Multi-hop routing support
- WarehouseCapacity model (utilization tracking)
- Capacity calculation from stock levels
- Capacity alerts (90% threshold)
- Warehouse dashboard data service
- Location utilization tracking
- DefaultWarehouseConfig model (tenant/user defaults)
- POS terminal warehouse mapping

### Technology Context
- **Zones:** Logical grouping of locations
- **Routes:** Directed graph for transfers
- **Multi-hop:** Dijkstra-like routing
- **Capacity:** Real-time utilization tracking

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-51-56_Zones-Routes.md | 51-56 | WarehouseZone, zone purpose, mapping, TransferRoute, fields, cost |
| 02 | 02_Tasks-57-62_Route-Logic-Capacity.md | 57-62 | Route validation, lookup, multi-hop, WarehouseCapacity, calculation, alerts |
| 03 | 03_Tasks-63-66_Dashboard-Defaults.md | 63-66 | Dashboard data, location utilization, DefaultWarehouseConfig, POS mapping |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create WarehouseZone model | Medium | 25 min |
| 52 | Add zone purpose field | Low | 15 min |
| 53 | Create zone-location mapping | Low | 20 min |
| 54 | Create TransferRoute model | Medium | 25 min |
| 55 | Add route fields | Low | 20 min |
| 56 | Add route cost field | Low | 15 min |
| 57 | Add route validation | Low | 20 min |
| 58 | Create route lookup method | Low | 20 min |
| 59 | Add multi-hop routing | High | 30 min |
| 60 | Create WarehouseCapacity model | Medium | 25 min |
| 61 | Add capacity calculation | Medium | 25 min |
| 62 | Add capacity alerts | Low | 20 min |
| 63 | Create warehouse dashboard data | High | 30 min |
| 64 | Add location utilization tracking | Medium | 25 min |
| 65 | Create DefaultWarehouseConfig model | Medium | 25 min |
| 66 | Add POS terminal warehouse mapping | Low | 20 min |

---

## Execution Order

```
Tasks 51-56: Zones & Routes
    │ (WarehouseZone, purpose, mapping, TransferRoute,
    │  fields, cost)
    ▼
Tasks 57-62: Route Logic & Capacity
    │ (validation, lookup, multi-hop, WarehouseCapacity,
    │  calculation, alerts)
    ▼
Tasks 63-66: Dashboard & Defaults
    │ (dashboard data, utilization, DefaultWarehouseConfig,
    │  POS mapping)
```

---

## Expected Deliverables

```
backend/apps/inventory/warehouses/
├── models/
│   ├── __init__.py (updated)
│   ├── warehouse_zone.py (NEW)
│   ├── transfer_route.py (NEW)
│   ├── warehouse_capacity.py (NEW)
│   └── default_config.py (NEW)
├── services/
│   ├── __init__.py (updated)
│   ├── route_finder.py (NEW)
│   └── dashboard.py (NEW)
└── signals.py (updated - capacity alerts)
```

---

## Notes for AI Agents

1. **Zone Purposes:**
   - RECEIVING: Inbound goods
   - STORAGE: Primary storage
   - PICKING: Order fulfillment
   - SHIPPING: Outbound staging
   - RETURNS: RMA processing
2. **Zone-Location Mapping:** FK on StorageLocation to WarehouseZone
3. **TransferRoute Fields:**
   - source_warehouse FK
   - destination_warehouse FK
   - transit_days: PositiveIntegerField
   - estimated_cost: DecimalField (LKR)
   - is_active: Boolean
4. **Route Validation:**
   - source ≠ destination
   - unique_together: (source, destination)
5. **Multi-hop Routing:** Find intermediate warehouses if no direct route
6. **WarehouseCapacity:**
   - max_item_capacity: PositiveIntegerField
   - current_item_count: PositiveIntegerField
   - last_calculated: DateTimeField
7. **Capacity Alert:** Trigger at 90% utilization
8. **Dashboard Data:**
   - location_count, zone_count
   - capacity_percentage
   - recent_movements
   - top_locations_by_activity
9. **DefaultWarehouseConfig:** Tenant-level and user-level settings
10. **POS Mapping:** Link POS terminal ID to warehouse
11. **Next Group:** Serializers & API Views (Group E)
