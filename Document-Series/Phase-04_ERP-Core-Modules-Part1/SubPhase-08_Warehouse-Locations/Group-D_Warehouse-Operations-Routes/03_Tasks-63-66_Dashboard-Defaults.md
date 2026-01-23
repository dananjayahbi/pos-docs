# Tasks 63-66: Dashboard & Defaults

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** D - Warehouse Operations & Routes  
> **Document:** 03 of 03  
> **Tasks Covered:** 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-57-62_Route-Logic-Capacity.md](02_Tasks-57-62_Route-Logic-Capacity.md)
- **→ Next Group:** [../Group-E_Serializers-API-Views/](../Group-E_Serializers-API-Views/)

---

## Document Overview

This document covers warehouse dashboard data service, location utilization tracking, default warehouse configuration, and POS terminal warehouse mapping.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create warehouse dashboard data | High | 30 min |
| 64 | Add location utilization tracking | Medium | 25 min |
| 65 | Create DefaultWarehouseConfig model | Medium | 25 min |
| 66 | Add POS terminal warehouse mapping | Low | 20 min |

---

## Task 63: Create Warehouse Dashboard Data

Create service to aggregate warehouse statistics for dashboard display.

**Instructions:**
1. Create dashboard.py service in services/
2. Add WarehouseDashboard class
3. Implement get_warehouse_stats method returning:
   - Total location count
   - Zone count
   - Capacity percentage
   - Active locations vs inactive
   - Recent stock movements (top 10)
   - Top locations by activity (scan frequency)
   - Alerts (capacity warnings, inactive zones)
4. Add get_zone_breakdown method
5. Add get_capacity_trend method (historical data)
6. Cache dashboard data for 5-15 minutes
7. Return JSON-serializable dictionary

---

## Task 64: Add Location Utilization Tracking

Track which locations are actively used vs empty or underutilized.

**Instructions:**
1. Add utilization_status field to StorageLocation (EMPTY, PARTIAL, FULL)
2. Calculate based on stock levels (requires StockLevel model)
3. Add last_activity_at DateTimeField (last stock movement)
4. Create update_utilization method
5. Generate utilization report by zone
6. Identify unused locations (no activity for 90+ days)
7. Add utilization heatmap data for visualization

**Utilization Calculation:**
```
EMPTY: No stock present
PARTIAL: Stock < 80% capacity
FULL: Stock >= 80% capacity
OVERCAPACITY: Stock > 100% capacity (error state)
```

---

## Task 65: Create DefaultWarehouseConfig Model

Create model to store default warehouse preferences for users and tenants.

**Instructions:**
1. Create default_config.py in models/
2. Add DefaultWarehouseConfig model
3. Add user FK (optional, nullable for tenant-level defaults)
4. Add default_warehouse FK
5. Add default_receiving_zone FK (optional)
6. Add default_picking_zone FK (optional)
7. Add scope field (TENANT_DEFAULT, USER_DEFAULT)
8. Add unique constraint per user
9. Create get_default_warehouse(user) utility function
10. Fallback: user default → tenant default → warehouse.is_default=True

---

## Task 66: Add POS Terminal Warehouse Mapping

Map POS terminals to specific warehouses for automatic stock deduction.

**Instructions:**
1. Add terminal_warehouse_mapping JSONField to DefaultWarehouseConfig or create POSWarehouseMapping model
2. Store mapping: {terminal_id: warehouse_id}
3. Create get_warehouse_for_terminal(terminal_id) method
4. Use in POS sales to determine source warehouse
5. Allow multiple terminals per warehouse
6. Add terminal location field (physical location of POS device)
7. Update POS sales logic to use mapped warehouse

**Example Mapping:**
```json
{
  "POS-TERM-001": "WH-CMB-01",
  "POS-TERM-002": "WH-KANDY-01",
  "POS-MOBILE-001": "WH-CMB-01"
}
```

---

## Summary

These final four tasks completed warehouse operations:

1. **Dashboard data service** aggregates statistics (capacity, zones, activity)
2. **Location utilization** tracks EMPTY/PARTIAL/FULL status per location
3. **DefaultWarehouseConfig** stores user and tenant warehouse preferences
4. **POS terminal mapping** links POS devices to warehouses for sales

### Group D Complete

All 16 tasks in Group D documented:
- ✓ WarehouseZone model with purposes (RECEIVING, STORAGE, PICKING, etc.)
- ✓ Zone-location mapping
- ✓ TransferRoute model with cost estimation
- ✓ Multi-hop routing (Dijkstra's algorithm)
- ✓ WarehouseCapacity tracking with alerts
- ✓ Dashboard statistics
- ✓ Utilization tracking
- ✓ Default configuration and POS mapping

**→ Proceed to Group E:** [Serializers & API Views](../Group-E_Serializers-API-Views/)

Group E will create DRF serializers and viewsets for the warehouse API.
