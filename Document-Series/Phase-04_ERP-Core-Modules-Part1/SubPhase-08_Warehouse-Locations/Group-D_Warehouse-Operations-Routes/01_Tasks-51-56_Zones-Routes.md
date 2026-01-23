# Tasks 51-56: Zones & Routes

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** D - Warehouse Operations & Routes  
> **Document:** 01 of 03  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-57-62_Route-Logic-Capacity.md](02_Tasks-57-62_Route-Logic-Capacity.md)

---

## Document Overview

This document covers warehouse zones for logical area organization, zone purposes, zone-to-location mapping, transfer routes between warehouses, route fields, and cost estimation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create WarehouseZone model | Medium | 25 min |
| 52 | Add zone purpose field | Low | 15 min |
| 53 | Create zone-location mapping | Low | 20 min |
| 54 | Create TransferRoute model | Medium | 25 min |
| 55 | Add route fields | Low | 20 min |
| 56 | Add route cost field | Low | 15 min |

---

## Task 51: Create WarehouseZone Model

Create WarehouseZone model for logical area grouping within warehouses. Zones organize locations by function (receiving, storage, picking, shipping).

**Instructions:**
1. Create warehouse_zone.py in warehouses/models/
2. Add WarehouseZone model with TenantMixin, TimestampMixin
3. Add warehouse FK with CASCADE delete
4. Add name field (e.g., "Receiving Zone", "Cold Storage")
5. Add code field (unique per warehouse)
6. Add description TextField (optional)
7. Add is_active BooleanField

---

## Task 52: Add Zone Purpose Field

Add zone purpose field to categorize zones by operational function.

**Instructions:**
1. Define zone purpose constants (RECEIVING, STORAGE, PICKING, SHIPPING, RETURNS, QUARANTINE)
2. Add purpose CharField with choices
3. Index field for filtering by purpose
4. Document each purpose type
5. Use in workflow logic (e.g., receiving operations target RECEIVING zones)

**Zone Purposes:**
- **RECEIVING:** Inbound staging area
- **STORAGE:** Primary bulk storage
- **PICKING:** Order fulfillment area
- **SHIPPING:** Outbound staging
- **RETURNS:** RMA processing
- **QUARANTINE:** Hold/inspection area

---

## Task 53: Create Zone-Location Mapping

Link storage locations to warehouse zones for organizational reporting.

**Instructions:**
1. Add zone FK to StorageLocation model (optional, nullable)
2. Allow locations to exist without zone assignment
3. Add related_name="locations" for reverse queries
4. Update location admin to show zone
5. Filter locations by zone in queries
6. Generate zone utilization reports

**Usage:** `zone.locations.all()` returns all locations in zone

---

## Task 54: Create TransferRoute Model

Create model to track inter-warehouse transfer routes with transit times and costs.

**Instructions:**
1. Create transfer_route.py in warehouses/models/
2. Add TransferRoute model with TenantMixin
3. Add source_warehouse FK
4. Add destination_warehouse FK
5. Add is_active BooleanField
6. Add validation: source ≠ destination
7. Add unique constraint: (tenant, source, destination)

---

## Task 55: Add Route Fields

Add fields for route details and operational parameters.

**Instructions:**
1. Add transit_days PositiveIntegerField (estimated delivery time)
2. Add distance_km DecimalField (route distance)
3. Add primary_carrier CharField (transport company)
4. Add notes TextField for special instructions
5. Add is_preferred BooleanField (default route flag)
6. Index on source and destination for lookups

---

## Task 56: Add Route Cost Field

Add cost estimation field for transfer route pricing.

**Instructions:**
1. Add estimated_cost DecimalField (LKR currency)
2. Add cost_per_kg DecimalField for weight-based pricing
3. Add cost_per_m3 DecimalField for volume-based pricing
4. Add minimum_cost DecimalField (fixed minimum charge)
5. Create calculate_transfer_cost method accepting weight/volume
6. Consider fuel surcharges and seasonal adjustments

**Cost Calculation Example:**
```
base_cost = max(estimated_cost, minimum_cost)
weight_cost = weight_kg * cost_per_kg
volume_cost = volume_m3 * cost_per_m3
total = base_cost + max(weight_cost, volume_cost)
```

---

## Summary

These six tasks established warehouse zones and transfer routes:

1. **WarehouseZone model** for logical area organization
2. **Zone purpose** field (RECEIVING, STORAGE, PICKING, SHIPPING, RETURNS, QUARANTINE)
3. **Zone-location mapping** via optional FK on StorageLocation
4. **TransferRoute model** linking source and destination warehouses
5. **Route fields** including transit_days, distance, carrier
6. **Route cost** fields for transfer pricing estimation

**→ Continue to:** [02_Tasks-57-62_Route-Logic-Capacity.md](02_Tasks-57-62_Route-Logic-Capacity.md)
