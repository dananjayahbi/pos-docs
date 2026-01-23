# Tasks 11-14: Operating Hours, Location & Manager

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** A - Warehouse Model & Configuration  
> **Document:** 03 of 04  
> **Tasks Covered:** 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-10_Address-Contact-Status.md](02_Tasks-06-10_Address-Contact-Status.md)
- **→ Next Document:** [04_Tasks-15-18_Constraint-Validation-Admin.md](04_Tasks-15-18_Constraint-Validation-Admin.md)

---

## Document Overview

This document covers warehouse operating hours, GPS coordinates for location tracking, Meta class configuration, and custom model manager implementation. These features enable scheduling, mapping, and advanced query capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 11 | Add operating hours fields | Low | 15 min |
| 12 | Add warehouse coordinates | Low | 15 min |
| 13 | Create Warehouse Meta class | Low | 15 min |
| 14 | Add Warehouse model manager | Medium | 25 min |

---

## Task 11: Add Operating Hours Fields

### Overview
Add fields to track warehouse operating hours. This enables delivery scheduling, staff planning, and operational time windows for receiving and shipping activities.

### Dependencies
- Task 05: Create Warehouse model

### Instructions

1. **Add opens_at field**
   - **opens_at:** TimeField
   - Verbose name: Opens At
   - Help text: "Warehouse opening time (Asia/Colombo)"
   - Optional field (blank=True, null=True)
   - Default to None (24-hour operation if not set)

2. **Add closes_at field**
   - **closes_at:** TimeField
   - Verbose name: Closes At
   - Help text: "Warehouse closing time (Asia/Colombo)"
   - Optional field (blank=True, null=True)
   - Default to None

3. **Add breaks_start field (optional)**
   - **breaks_start:** TimeField
   - For lunch/break periods
   - Optional field (blank=True, null=True)

4. **Add breaks_end field (optional)**
   - **breaks_end:** TimeField
   - End of break period
   - Optional field (blank=True, null=True)

5. **Add is_24_hours field**
   - **is_24_hours:** BooleanField
   - Verbose name: 24-Hour Operation
   - Default: False
   - If True, opens_at/closes_at ignored

6. **Create helper method: is_open_at()**
   - Method accepts datetime parameter
   - Returns True if warehouse is open at given time
   - Check is_24_hours first
   - Compare time component against opens_at/closes_at
   - Account for break periods

### Operating Hours Patterns

**Common Sri Lankan Warehouse Hours:**
- Standard: 8:00 AM - 6:00 PM
- Extended: 7:00 AM - 9:00 PM
- Distribution Centers: 24-hour operations
- Retail Warehouses: 9:00 AM - 8:00 PM

**Break Periods:**
- Lunch: 12:00 PM - 1:00 PM
- Tea Break: Optional 3:00 PM - 3:15 PM

### Time Zone Considerations

All times stored and displayed in Asia/Colombo timezone:
- UTC offset: +5:30
- No daylight saving time
- Consistent year-round
- All warehouse operations use local time

### Scheduling Use Cases

1. **Receiving Appointments:** Check if warehouse accepts deliveries at requested time
2. **Shipping Cutoffs:** Last pickup time for same-day processing
3. **Staff Scheduling:** Align workforce with operating hours
4. **System Maintenance:** Schedule during off-hours
5. **Delivery Windows:** Coordinate with warehouse availability

### Expected Outcome
```python
# Example usage
warehouse.opens_at = time(8, 0)  # 8:00 AM
warehouse.closes_at = time(18, 0)  # 6:00 PM
warehouse.is_open_at(datetime.now())  # True/False
```

### Verification Checklist
- [ ] opens_at field added (TimeField)
- [ ] closes_at field added (TimeField)
- [ ] is_24_hours field added
- [ ] Break period fields added (optional)
- [ ] is_open_at() method implemented
- [ ] Time zone documented

---

## Task 12: Add Warehouse Coordinates

### Overview
Add GPS coordinates to enable mapping, distance calculation, and route optimization. Coordinates support delivery planning and warehouse location visualization.

### Dependencies
- Task 05: Create Warehouse model

### Instructions

1. **Add latitude field**
   - **latitude:** DecimalField
   - Verbose name: Latitude
   - max_digits: 10
   - decimal_places: 7
   - Help text: "GPS latitude coordinate"
   - Optional field (blank=True, null=True)
   - Validators: Range -90.0 to 90.0

2. **Add longitude field**
   - **longitude:** DecimalField
   - Verbose name: Longitude
   - max_digits: 10
   - decimal_places: 7
   - Help text: "GPS longitude coordinate"
   - Optional field (blank=True, null=True)
   - Validators: Range -180.0 to 180.0

3. **Add coordinate validators**
   - Create validator for latitude range
   - Create validator for longitude range
   - Ensure both provided or both null

4. **Create helper method: get_coordinates()**
   - Returns tuple (latitude, longitude)
   - Returns None if coordinates not set

5. **Create helper method: get_maps_url()**
   - Generate Google Maps URL
   - Format: https://maps.google.com/?q={lat},{lng}
   - Useful for quick navigation

6. **Add distance calculation placeholder**
   - Document that distance calculation will use Haversine formula
   - Note integration with route planning in future

### Sri Lankan Geographic Context

**Country Bounds:**
- Latitude: 5.9° N to 9.9° N
- Longitude: 79.7° E to 81.9° E

**Major City Coordinates (Reference):**
- Colombo: 6.9271° N, 79.8612° E
- Kandy: 7.2906° N, 80.6337° E
- Galle: 6.0535° N, 80.2210° E
- Jaffna: 9.6615° N, 80.0255° E

### Decimal Precision

With 7 decimal places:
- Precision: ~1.1 cm accuracy
- Sufficient for warehouse location
- Format: 6.9271000, 79.8612000

### Use Cases for Coordinates

1. **Map Display:** Show warehouses on interactive map
2. **Distance Calculation:** Find nearest warehouse to customer
3. **Route Planning:** Optimize delivery routes
4. **Geofencing:** Trigger actions when entering warehouse area
5. **Analytics:** Visualize warehouse distribution
6. **Mobile Apps:** Enable GPS-based warehouse check-in

### Distance Calculation (Haversine Formula)

```
Formula for distance between two points:
a = sin²(Δlat/2) + cos(lat1) × cos(lat2) × sin²(Δlon/2)
c = 2 × atan2(√a, √(1−a))
distance = R × c (where R = Earth radius = 6371 km)
```

### Expected Outcome
Warehouse model with GPS fields and helper methods for mapping integration.

### Verification Checklist
- [ ] latitude field added (DecimalField 10,7)
- [ ] longitude field added (DecimalField 10,7)
- [ ] Range validators added
- [ ] get_coordinates() method implemented
- [ ] get_maps_url() method implemented
- [ ] Documentation includes Sri Lankan bounds

---

## Task 13: Create Warehouse Meta Class

### Overview
Configure the Meta class for proper database organization, ordering, indexing, and permissions. Meta options ensure efficient queries and user-friendly admin interface.

### Dependencies
- Task 05: Create Warehouse model
- All previous field additions complete

### Instructions

1. **Create Meta inner class**
   - Inside Warehouse model
   - Standard Django Meta configuration

2. **Set verbose names**
   - verbose_name: "Warehouse"
   - verbose_name_plural: "Warehouses"
   - Used in admin interface and messages

3. **Configure database table name**
   - db_table: "inventory_warehouses"
   - Explicit table naming for clarity
   - Follows app_model convention

4. **Set default ordering**
   - ordering: ["name"]
   - Alphabetical by warehouse name
   - Secondary sort by code if needed

5. **Add database indexes**
   - Composite index on (tenant, code) for uniqueness
   - Index on status for filtering active warehouses
   - Index on warehouse_type for type-based queries
   - Index on district for regional reporting
   - Index on is_default for default lookup

6. **Define unique constraints**
   - Note: Detailed constraint added in Task 15
   - Document tenant-scoped uniqueness for code

7. **Set permissions**
   - default_permissions: ["add", "change", "delete", "view"]
   - Custom permissions if needed:
     - "can_set_default_warehouse"
     - "can_deactivate_warehouse"

8. **Add indexes list**
   - Use models.Index for composite indexes
   - Name indexes descriptively
   - Example: "idx_warehouse_tenant_code"

### Meta Configuration Best Practices

```python
class Meta:
    verbose_name = "Warehouse"
    verbose_name_plural = "Warehouses"
    db_table = "inventory_warehouses"
    ordering = ["name"]
    indexes = [
        models.Index(fields=["tenant", "code"], name="idx_wh_tenant_code"),
        models.Index(fields=["status"], name="idx_wh_status"),
        models.Index(fields=["warehouse_type"], name="idx_wh_type"),
        models.Index(fields=["district"], name="idx_wh_district"),
        models.Index(fields=["is_default"], name="idx_wh_default"),
    ]
```

### Index Strategy

| Index | Purpose | Query Benefit |
|-------|---------|---------------|
| tenant + code | Uniqueness lookup | Fast warehouse retrieval |
| status | Active/inactive filtering | Operational queries |
| warehouse_type | Type-based reporting | Warehouse categorization |
| district | Regional analysis | Geographic reports |
| is_default | Default warehouse lookup | POS operations |

### Expected Outcome
Properly configured Meta class for optimized database performance and admin usability.

### Verification Checklist
- [ ] Meta class created inside model
- [ ] verbose_name and verbose_name_plural set
- [ ] db_table explicitly named
- [ ] ordering configured
- [ ] Indexes defined
- [ ] Permissions documented

---

## Task 14: Add Warehouse Model Manager

### Overview
Create a custom model manager to provide convenient query methods for common warehouse operations. The manager simplifies filtering and retrieval patterns used throughout the application.

### Dependencies
- Task 05: Create Warehouse model
- Task 09: Add warehouse status field
- Task 10: Add is_default field

### Instructions

1. **Create manager file**
   - Create `warehouse_manager.py` in `warehouses/managers/` directory
   - Add module docstring

2. **Import required modules**
   - Import Django models and Q objects
   - Import base manager if using custom base

3. **Create WarehouseQuerySet class**
   - Inherit from models.QuerySet
   - Add chainable query methods
   - Enable method chaining

4. **Add active() method**
   - Filter warehouses with status=ACTIVE
   - Returns queryset of operational warehouses
   - Chainable method

5. **Add inactive() method**
   - Filter warehouses with status=INACTIVE
   - Returns queryset of deactivated warehouses

6. **Add by_type() method**
   - Accepts warehouse_type parameter
   - Filters by warehouse type
   - Example: by_type(WAREHOUSE_TYPE_DISTRIBUTION)

7. **Add by_district() method**
   - Accepts district parameter
   - Filters warehouses in specific district
   - Used for regional reporting

8. **Add with_default() method**
   - Annotate queryset with default status
   - Useful for list displays

9. **Create WarehouseManager class**
   - Inherit from models.Manager
   - Set WarehouseQuerySet as _queryset_class
   - Add non-chainable methods

10. **Add get_active() method**
    - Return active warehouses queryset
    - Convenience method for common query

11. **Add get_default() method**
    - Return the default warehouse for current tenant
    - Raise exception if no default set
    - Handle multi-tenant context

12. **Add get_by_code() method**
    - Lookup warehouse by code
    - Tenant-aware lookup
    - Return single object or None

13. **Attach manager to model**
    - Set as objects attribute in Warehouse model
    - Replace default manager

### Manager Usage Examples

```python
# Get all active warehouses
Warehouse.objects.active()

# Get distribution centers only
Warehouse.objects.active().by_type(WAREHOUSE_TYPE_DISTRIBUTION)

# Get warehouses in Colombo district
Warehouse.objects.by_district('colombo')

# Get default warehouse
default_wh = Warehouse.objects.get_default()

# Chain methods
colombo_warehouses = Warehouse.objects.active().by_district('colombo')
```

### QuerySet vs Manager Methods

**QuerySet Methods (Chainable):**
- active()
- inactive()
- by_type()
- by_district()
- Returns QuerySet for further filtering

**Manager Methods (Terminal):**
- get_default()
- get_by_code()
- Returns single object or raises exception

### Multi-Tenant Awareness

All manager methods must respect tenant isolation:
- Queries automatically filtered by current tenant
- get_default() returns default for current tenant only
- get_by_code() searches within tenant scope
- No cross-tenant queries allowed

### Expected Outcome
```
backend/apps/inventory/warehouses/managers/
├── __init__.py
└── warehouse_manager.py (NEW)
```

### Verification Checklist
- [ ] warehouse_manager.py created
- [ ] WarehouseQuerySet class defined
- [ ] Chainable methods implemented
- [ ] WarehouseManager class defined
- [ ] get_default() method implemented
- [ ] get_by_code() method implemented
- [ ] Manager attached to Warehouse model
- [ ] Multi-tenant awareness documented
- [ ] Usage examples in docstrings

---

## Summary

These four tasks enhanced the warehouse model with operational capabilities:

1. **Operating hours** with opens_at, closes_at, and is_open_at() helper (Asia/Colombo timezone)
2. **GPS coordinates** with latitude/longitude fields and mapping URL generation
3. **Meta class** with indexes, ordering, and permissions for optimized queries
4. **Custom manager** with active(), get_default(), and district filtering methods

### What's Next?

The next document covers the is_default constraint enforcement, set_as_default method, validation logic, and Django admin configuration.

**→ Continue to:** [04_Tasks-15-18_Constraint-Validation-Admin.md](04_Tasks-15-18_Constraint-Validation-Admin.md)
