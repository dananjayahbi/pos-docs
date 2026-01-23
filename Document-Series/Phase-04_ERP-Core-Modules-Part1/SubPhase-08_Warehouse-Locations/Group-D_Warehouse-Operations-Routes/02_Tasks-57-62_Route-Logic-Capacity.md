# Tasks 57-62: Route Logic & Capacity

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** D - Warehouse Operations & Routes  
> **Document:** 02 of 03  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-51-56_Zones-Routes.md](01_Tasks-51-56_Zones-Routes.md)
- **→ Next Document:** [03_Tasks-63-66_Dashboard-Defaults.md](03_Tasks-63-66_Dashboard-Defaults.md)

---

## Document Overview

This document covers route validation, route lookup service, multi-hop routing, warehouse capacity tracking, capacity calculation, and capacity alerts.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 57 | Add route validation | Low | 20 min |
| 58 | Create route lookup method | Low | 20 min |
| 59 | Add multi-hop routing | High | 30 min |
| 60 | Create WarehouseCapacity model | Medium | 25 min |
| 61 | Add capacity calculation | Medium | 25 min |
| 62 | Add capacity alerts | Low | 20 min |

---

## Task 57: Add Route Validation

Implement validation rules for transfer routes.

**Instructions:**
1. Add clean() method to TransferRoute model
2. Validate source ≠ destination
3. Validate both warehouses in same tenant
4. Validate no duplicate routes (handled by constraint)
5. Validate transit_days > 0
6. Validate cost values are positive
7. Check both warehouses are ACTIVE status

---

## Task 58: Create Route Lookup Method

Create service to find routes between warehouses.

**Instructions:**
1. Create route_finder.py in services/
2. Add RouteFinder class
3. Implement find_route(source, destination) method
4. Return active route or None
5. Prioritize is_preferred routes
6. Cache frequently used routes
7. Add get_all_routes(warehouse) for route listing

---

## Task 59: Add Multi-Hop Routing

Implement routing algorithm to find multi-warehouse paths when no direct route exists.

**Instructions:**
1. Add find_multi_hop_route method to RouteFinder
2. Use Dijkstra's algorithm or breadth-first search
3. Find shortest path (by transit_days or cost)
4. Limit maximum hops (e.g., 3 intermediate warehouses)
5. Return list of route segments
6. Calculate total cost and transit time
7. Cache complex route calculations

**Example:** Colombo → Kandy → Jaffna (no direct Colombo-Jaffna route)

---

## Task 60: Create WarehouseCapacity Model

Create model to track warehouse utilization and capacity limits.

**Instructions:**
1. Create warehouse_capacity.py in models/
2. Add WarehouseCapacity model with OneToOne to Warehouse
3. Add max_item_capacity PositiveIntegerField
4. Add current_item_count PositiveIntegerField
5. Add max_weight_capacity DecimalField
6. Add current_weight DecimalField
7. Add max_volume_capacity DecimalField
8. Add current_volume DecimalField
9. Add last_calculated DateTimeField
10. Add utilization_percentage property

---

## Task 61: Add Capacity Calculation

Implement methods to calculate current warehouse utilization.

**Instructions:**
1. Add calculate_capacity method to WarehouseCapacity
2. Sum StockLevel quantities for current_item_count (requires StockLevel model)
3. Sum product weights for current_weight
4. Sum product volumes for current_volume
5. Update last_calculated timestamp
6. Create scheduled task to recalculate hourly
7. Add manual recalculate action in admin

---

## Task 62: Add Capacity Alerts

Implement alerting when warehouse approaches capacity limits.

**Instructions:**
1. Define alert thresholds (80%, 90%, 95%, 100%)
2. Create check_capacity_alerts method
3. Trigger warnings at 90% utilization
4. Send notifications to warehouse managers
5. Block new receipts at 100% capacity
6. Log capacity events
7. Add capacity dashboard widget

**Alert Levels:**
- **Green:** < 80% capacity
- **Yellow:** 80-90% capacity
- **Orange:** 90-95% capacity
- **Red:** > 95% capacity
- **Critical:** 100% capacity (block operations)

---

## Summary

These six tasks added routing logic and capacity management:

1. **Route validation** prevents invalid route configurations
2. **Route lookup** finds active routes between warehouses
3. **Multi-hop routing** finds paths through intermediate warehouses (Dijkstra's algorithm)
4. **WarehouseCapacity model** tracks utilization (items, weight, volume)
5. **Capacity calculation** sums stock levels for current usage
6. **Capacity alerts** warn at 90%+ utilization thresholds

**→ Continue to:** [03_Tasks-63-66_Dashboard-Defaults.md](03_Tasks-63-66_Dashboard-Defaults.md)
