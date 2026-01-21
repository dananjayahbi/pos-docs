# Group A: Warehouse Model & Configuration

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** A of F  
> **Tasks Covered:** 01-18  
> **Group Goal:** Create core warehouse model with address, contact, and tenant configuration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **→ Next Group:** [Group-B_Storage-Location-Hierarchy](../Group-B_Storage-Location-Hierarchy/)

---

## Group Overview

### Key Outcomes
- Inventory app structure initialization
- Warehouses submodule within inventory app
- Warehouse status constants (ACTIVE, INACTIVE, MAINTENANCE)
- Warehouse type constants (MAIN, DISTRIBUTION, RETAIL, RETURNS)
- Warehouse model with name, code (unique), warehouse_type
- Sri Lanka address fields with 25 districts
- Contact fields (phone, email, manager_name)
- Status field with choices
- is_default field for POS operations
- Operating hours (opens_at, closes_at)
- GPS coordinates (latitude, longitude)
- Custom manager with get_active(), get_default()
- is_default constraint (one per tenant)
- Phone format validation (+94)
- Admin configuration

### Technology Context
- **Multi-tenancy:** Tenant-isolated warehouses
- **Address:** Sri Lanka-specific with 25 districts
- **Phone Format:** +94 XX XXX XXXX
- **GPS:** DecimalField for coordinates

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_App-Structure-Model.md | 01-05 | App structure, submodule, constants, Warehouse model |
| 02 | 02_Tasks-06-10_Address-Contact-Status.md | 06-10 | Address fields, districts, contact, status, is_default |
| 03 | 03_Tasks-11-14_Hours-Location-Manager.md | 11-14 | Operating hours, coordinates, Meta, manager |
| 04 | 04_Tasks-15-18_Constraint-Validation-Admin.md | 15-18 | is_default constraint, set_as_default, validation, admin |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create inventory app structure | Low | 15 min |
| 02 | Create warehouse submodule | Low | 10 min |
| 03 | Define warehouse status constants | Low | 10 min |
| 04 | Define warehouse type constants | Low | 10 min |
| 05 | Create Warehouse model | Medium | 30 min |
| 06 | Add warehouse address fields | Low | 20 min |
| 07 | Add Sri Lanka district choices | Low | 15 min |
| 08 | Add warehouse contact fields | Low | 15 min |
| 09 | Add warehouse status field | Low | 15 min |
| 10 | Add is_default field | Low | 15 min |
| 11 | Add operating hours fields | Low | 15 min |
| 12 | Add warehouse coordinates | Low | 15 min |
| 13 | Create Warehouse Meta class | Low | 15 min |
| 14 | Add Warehouse model manager | Medium | 25 min |
| 15 | Create is_default constraint | Medium | 25 min |
| 16 | Add set_as_default method | Low | 20 min |
| 17 | Create warehouse validation | Low | 20 min |
| 18 | Create Warehouse admin | Medium | 25 min |

---

## Execution Order

```
Tasks 01-02: App & Submodule Structure
    │
    ▼
Tasks 03-05: Constants & Model
    │ (status, type constants, Warehouse model)
    ▼
Tasks 06-10: Address & Contact
    │ (address, districts, contact, status, is_default)
    ▼
Tasks 11-14: Hours, Location & Manager
    │ (operating hours, GPS, Meta, manager)
    ▼
Tasks 15-18: Constraints, Validation & Admin
    │ (is_default constraint, set_as_default, validation, admin)
```

---

## Expected Deliverables

```
backend/apps/inventory/
├── __init__.py (NEW)
├── apps.py (NEW)
└── warehouses/
    ├── __init__.py (NEW)
    ├── constants.py (NEW)
    ├── admin.py (NEW)
    ├── models/
    │   ├── __init__.py (NEW)
    │   └── warehouse.py (NEW)
    └── managers/
        └── warehouse_manager.py (NEW)
```

---

## Notes for AI Agents

1. **Warehouse Types:**
   - MAIN: Primary storage
   - DISTRIBUTION: Fulfillment center
   - RETAIL: Store warehouse
   - RETURNS: RMA processing
2. **Status Values:** ACTIVE, INACTIVE, MAINTENANCE
3. **District Choices:** 25 Sri Lanka districts
4. **Phone Format:** +94 followed by 9 digits
5. **is_default Constraint:** Only one per tenant
6. **Operating Hours:** TimeField for opens_at, closes_at
7. **GPS Coordinates:** DecimalField(max_digits=10, decimal_places=7)
8. **Manager Methods:**
   - get_active(): Filter status=ACTIVE
   - get_default(): Get is_default=True warehouse
9. **Code Uniqueness:** Unique within tenant
10. **Next Group:** Storage Location Hierarchy (Group B)
