# Group B: Storage Location Hierarchy

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** B of F  
> **Tasks Covered:** 19-36  
> **Group Goal:** Implement hierarchical storage locations within warehouses

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Warehouse-Model-Configuration](../Group-A_Warehouse-Model-Configuration/)
- **→ Next Group:** [Group-C_Location-Barcodes-Scanning](../Group-C_Location-Barcodes-Scanning/)

---

## Group Overview

### Key Outcomes
- Location type constants (ZONE, AISLE, RACK, SHELF, BIN)
- StorageLocation model with warehouse FK
- Self-referential parent FK for hierarchy
- Location code field (e.g., "A-03-02")
- Location barcode field
- Capacity fields (max_weight, max_volume, max_items)
- Active, pickable, receivable boolean flags
- Custom manager (get_by_warehouse, get_pickable)
- location_path property (full hierarchy path)
- depth property (0 for zone, 1 for aisle, etc.)
- get_children and get_all_descendants methods
- Hierarchy validation (parent type rules)
- Bulk location generator utility
- Admin with tree display

### Technology Context
- **Hierarchy:** Self-referential FK for parent-child
- **Depth Levels:** Zone(0) → Aisle(1) → Rack(2) → Shelf(3) → Bin(4)
- **Code Format:** A03-02-04-01

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-19-24_Location-Model-Setup.md | 19-24 | Constants, model, parent FK, code, barcode, capacity |
| 02 | 02_Tasks-25-30_Flags-Manager-Properties.md | 25-30 | Boolean flags, Meta, manager, path property, depth |
| 03 | 03_Tasks-31-36_Hierarchy-Methods-Admin.md | 31-36 | Children, descendants, validation, bulk generator, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Define location type constants | Low | 10 min |
| 20 | Create StorageLocation model | Medium | 30 min |
| 21 | Add parent FK for hierarchy | Low | 20 min |
| 22 | Add location code field | Low | 15 min |
| 23 | Add location barcode field | Low | 15 min |
| 24 | Add location capacity fields | Low | 20 min |
| 25 | Add is_active field | Low | 10 min |
| 26 | Add is_pickable field | Low | 10 min |
| 27 | Add is_receivable field | Low | 10 min |
| 28 | Create StorageLocation Meta class | Low | 15 min |
| 29 | Add StorageLocation manager | Medium | 25 min |
| 30 | Create location path property | Low | 20 min |
| 31 | Add location depth property | Low | 15 min |
| 32 | Create get_children method | Low | 15 min |
| 33 | Create get_all_descendants method | Medium | 25 min |
| 34 | Add location validation | Medium | 25 min |
| 35 | Create bulk location generator | High | 30 min |
| 36 | Create StorageLocation admin | High | 30 min |

---

## Execution Order

```
Tasks 19-24: Model Setup
    │ (constants, model, parent FK, code, barcode, capacity)
    ▼
Tasks 25-30: Flags & Properties
    │ (active, pickable, receivable, Meta, manager, path, depth)
    ▼
Tasks 31-36: Hierarchy & Admin
    │ (children, descendants, validation, bulk generator, admin)
```

---

## Expected Deliverables

```
backend/apps/inventory/warehouses/
├── constants.py (updated)
├── admin.py (updated)
├── models/
│   ├── __init__.py (updated)
│   └── storage_location.py (NEW)
├── managers/
│   └── location_manager.py (NEW)
└── utils/
    └── bulk_generator.py (NEW)
```

---

## Notes for AI Agents

1. **Location Types:** ZONE, AISLE, RACK, SHELF, BIN
2. **Hierarchy Rules:**
   - ZONE: No parent (root)
   - AISLE: Parent must be ZONE
   - RACK: Parent must be AISLE
   - SHELF: Parent must be RACK
   - BIN: Parent must be SHELF
3. **Code Format:** {Zone}{Aisle}-{Rack}-{Shelf}-{Bin} (e.g., A03-02-04-01)
4. **Capacity Fields:**
   - max_weight: DecimalField (kg)
   - max_volume: DecimalField (m³)
   - max_items: PositiveIntegerField
5. **Boolean Flags:**
   - is_active: Location enabled/disabled
   - is_pickable: Used for order picking
   - is_receivable: Can receive incoming goods
6. **path Property:** "Zone A > Aisle 3 > Rack 2 > Bin 5"
7. **depth Property:** 0=zone, 1=aisle, 2=rack, 3=shelf, 4=bin
8. **get_all_descendants:** Recursive CTE or loop query
9. **Bulk Generator:** Create A1-01 through A1-50 format
10. **Next Group:** Location Barcodes & Scanning (Group C)
