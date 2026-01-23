# Tasks 25-30: Flags, Manager & Properties

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** B - Storage Location Hierarchy  
> **Document:** 02 of 03  
> **Tasks Covered:** 25, 26, 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-24_Location-Model-Setup.md](01_Tasks-19-24_Location-Model-Setup.md)
- **→ Next Document:** [03_Tasks-31-36_Hierarchy-Methods-Admin.md](03_Tasks-31-36_Hierarchy-Methods-Admin.md)

---

## Document Overview

This document covers operational boolean flags, Meta class configuration, custom model manager, and computed properties for location paths and hierarchy depth. These features enable location filtering and hierarchy navigation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 25 | Add is_active field | Low | 10 min |
| 26 | Add is_pickable field | Low | 10 min |
| 27 | Add is_receivable field | Low | 10 min |
| 28 | Create StorageLocation Meta class | Low | 15 min |
| 29 | Add StorageLocation manager | Medium | 25 min |
| 30 | Create location path property | Low | 20 min |

---

## Task 25: Add is_active Field

### Overview
Add boolean flag to enable or disable locations without deleting them. Inactive locations are hidden from normal operations but preserved for historical reporting.

### Dependencies
- Task 20: Create StorageLocation model

### Instructions

1. **Add is_active field**
   - **is_active:** BooleanField
   - Verbose name: "Active"
   - Default value: True
   - Indexed field (db_index=True)
   - Help text: "Location is operational and can be used"

2. **Add deactivation behavior**
   - Inactive locations excluded from location selection
   - Inventory counts still visible (read-only)
   - Cannot add new stock to inactive location
   - Existing stock remains visible

3. **Document cascade behavior**
   - Consider: Should deactivating parent deactivate children?
   - Option 1: Auto-deactivate children (cascade)
   - Option 2: Prevent if children active
   - Option 3: Allow independent status
   - Recommend Option 2 for safety

4. **Add manager query method**
   - active() method in manager (Task 29)
   - Filter is_active=True
   - Default queryset for operations

5. **Plan reactivation rules**
   - Can reactivate if parent is active
   - Cannot reactivate if warehouse inactive
   - Validation in clean() method

### Active vs Inactive Location Behavior

| Operation | Active Location | Inactive Location |
|-----------|----------------|-------------------|
| **Stock Receipt** | ✓ Allowed | ✗ Blocked |
| **Stock Picking** | ✓ Allowed | ✗ Blocked |
| **Stock Transfer In** | ✓ Allowed | ✗ Blocked |
| **Stock Transfer Out** | ✓ Allowed | ⚠ Allowed to clear |
| **Inventory Count** | ✓ Allowed | ✓ Read-only |
| **View Stock** | ✓ Visible | ✓ Visible (marked) |
| **Location Edit** | ✓ Allowed | ✓ Allowed |
| **Location Delete** | ⚠ If empty | ⚠ If empty |

### Deactivation Use Cases

**Temporary Closure:**
- Maintenance or repair in progress
- Structural inspection required
- Equipment malfunction
- Pest control treatment

**Permanent Closure:**
- Location repurposed
- Warehouse reorganization
- Reduced storage capacity
- Zone elimination

**Seasonal Deactivation:**
- Seasonal product storage areas
- Peak season locations
- Off-season consolidation

### Expected Outcome
StorageLocation model with is_active flag for operational control.

### Verification Checklist
- [ ] is_active field added (BooleanField)
- [ ] Default value: True
- [ ] Field indexed
- [ ] Behavior documented
- [ ] Cascade rules defined
- [ ] Reactivation rules planned

---

## Task 26: Add is_pickable Field

### Overview
Add flag to designate locations suitable for order picking operations. Picking locations are optimized for fast access and high-frequency retrieval.

### Dependencies
- Task 20: Create StorageLocation model

### Instructions

1. **Add is_pickable field**
   - **is_pickable:** BooleanField
   - Verbose name: "Pickable"
   - Default value: True
   - Indexed field (db_index=True)
   - Help text: "Location can be used for order picking"

2. **Define pickable location criteria**
   - Easily accessible (not requiring equipment)
   - Ground level or low shelves preferred
   - High-traffic areas
   - Fast-moving products typically stored here

3. **Document picking optimization**
   - Picking zones separate from bulk storage
   - Shorter travel distance for pickers
   - Better ergonomics (waist-level shelves)
   - Popular items in pickable locations

4. **Add manager query method**
   - pickable() method in manager
   - Filter is_pickable=True
   - Used for pick list generation

5. **Plan picking workflow**
   - Order picker receives pick list
   - System shows only pickable locations
   - Non-pickable locations require special handling
   - Warehouse manager can designate pickable areas

### Pickable vs Non-Pickable Locations

**Pickable Locations:**
- Picking zone shelves (chest/waist height)
- Bin locations with direct access
- First shelf level on racks
- Ground-level pallet positions for fast movers
- Aisle-facing locations

**Non-Pickable Locations:**
- High-rack storage (requires forklift)
- Deep storage behind other items
- Bulk storage areas
- Reserve stock locations
- Overhead storage

### Picking Strategy Example

```
Warehouse Layout:
┌─────────────────────────────────┐
│  RECEIVING ZONE (not pickable)  │
├─────────────────────────────────┤
│  BULK STORAGE (not pickable)    │
│  High racks, requires forklift  │
├─────────────────────────────────┤
│  PICKING ZONE (pickable)        │  ← Fast movers, easy access
│  Low shelves, ground level      │
├─────────────────────────────────┤
│  PACKING ZONE                   │
├─────────────────────────────────┤
│  SHIPPING ZONE                  │
└─────────────────────────────────┘
```

### Picking Zone Optimization

**Fast-Moving Products (ABC Analysis):**
- A-items (20% products, 80% picks): Pickable locations, closest to packing
- B-items (30% products, 15% picks): Pickable locations, medium distance
- C-items (50% products, 5% picks): Non-pickable bulk storage, refill to picking as needed

**Refill Process:**
- Monitor pickable location stock levels
- Transfer from bulk storage to picking bins
- Maintain minimum quantity in pickable locations
- Overnight refill for high movers

### Expected Outcome
StorageLocation model with is_pickable flag for picking optimization.

### Verification Checklist
- [ ] is_pickable field added (BooleanField)
- [ ] Default value: True
- [ ] Field indexed
- [ ] Pickable criteria documented
- [ ] Picking strategy explained
- [ ] Use cases provided

---

## Task 27: Add is_receivable Field

### Overview
Add flag to designate locations suitable for receiving incoming goods. Receiving locations are designed for temporary staging and inspection before moving to permanent storage.

### Dependencies
- Task 20: Create StorageLocation model

### Instructions

1. **Add is_receivable field**
   - **is_receivable:** BooleanField
   - Verbose name: "Receivable"
   - Default value: True
   - Indexed field (db_index=True)
   - Help text: "Location can receive incoming goods"

2. **Define receivable location purpose**
   - Temporary holding during inspection
   - Quality check staging areas
   - Inbound dock locations
   - Quarantine areas for inspection

3. **Document receiving workflow**
   - Goods arrive at receiving dock
   - Placed in receivable location
   - Inspection and quality control performed
   - Transferred to permanent storage location

4. **Add manager query method**
   - receivable() method in manager
   - Filter is_receivable=True
   - Used for receiving operations

5. **Plan receiving zone organization**
   - Dedicated receiving locations
   - Separate from main storage
   - Close to receiving docks
   - Adequate space for pallets/shipments

### Receivable Location Types

**Primary Receiving:**
- Receiving dock staging
- Immediate unload area
- Pallet positions near dock doors
- High turnover locations

**Inspection Areas:**
- Quality control stations
- Sample inspection zones
- Quarantine for questionable goods
- Hold areas pending approval

**Cross-Dock Locations:**
- For immediate redistribution
- No permanent storage
- Quick transfer to shipping

**Non-Receivable Areas:**
- Picking zones (only for permanent stock)
- Shipping zones (outbound only)
- Office areas
- Equipment storage

### Receiving Process Flow

```
1. DELIVERY ARRIVAL
   ↓
2. SCAN INTO RECEIVABLE LOCATION
   (Receiving Zone A, Bay 1)
   ↓
3. INSPECTION & COUNT
   (Verify quantity, check quality)
   ↓
4. DECISION POINT
   ├─ ACCEPT → Transfer to permanent storage
   ├─ REJECT → Mark for return, hold in receivable
   └─ HOLD → Keep in quarantine (receivable)
   ↓
5. TRANSFER TO STORAGE
   (Move to pickable/storage locations)
```

### Zone Configuration Example

```
RECEIVING ZONE:
├─ Bay 1 (is_receivable=True, is_pickable=False)
├─ Bay 2 (is_receivable=True, is_pickable=False)
├─ Bay 3 (is_receivable=True, is_pickable=False)
└─ Inspection Area (is_receivable=True, is_pickable=False)

STORAGE ZONE:
├─ Aisle A (is_receivable=False, is_pickable=True)
├─ Aisle B (is_receivable=False, is_pickable=True)
└─ Bulk Area (is_receivable=False, is_pickable=False)

SHIPPING ZONE:
└─ Staging (is_receivable=False, is_pickable=False)
```

### Flag Combinations

| is_receivable | is_pickable | Use Case |
|---------------|-------------|----------|
| True | False | **Receiving Zone** - Inbound staging |
| False | True | **Picking Zone** - Order fulfillment |
| False | False | **Bulk Storage** - Reserve stock |
| True | True | **Flexible Zone** - Multi-purpose (rare) |

### Expected Outcome
StorageLocation model with is_receivable flag for receiving operations.

### Verification Checklist
- [ ] is_receivable field added (BooleanField)
- [ ] Default value: True
- [ ] Field indexed
- [ ] Receiving workflow documented
- [ ] Zone organization explained
- [ ] Flag combinations documented

---

## Task 28: Create StorageLocation Meta Class

### Overview
Configure Meta class for database optimization, indexing, ordering, and constraints. Proper Meta configuration ensures efficient queries and maintains data integrity.

### Dependencies
- All StorageLocation fields complete

### Instructions

1. **Create Meta inner class**
   - Inside StorageLocation model
   - Standard Django Meta configuration

2. **Set verbose names**
   - verbose_name: "Storage Location"
   - verbose_name_plural: "Storage Locations"
   - Used in admin and messages

3. **Configure database table name**
   - db_table: "inventory_storage_locations"
   - Explicit naming for clarity

4. **Set default ordering**
   - ordering: ["warehouse", "code"]
   - Group by warehouse, then alphabetical by code
   - Ensures consistent display order

5. **Add database indexes**
   - Composite index: (tenant, warehouse, code)
   - Index on location_type for type filtering
   - Index on parent for hierarchy queries
   - Index on barcode for scanning lookups
   - Index on (is_active, is_pickable, is_receivable) for filtering

6. **Define unique constraints**
   - Unique: (tenant, warehouse, code)
   - Unique: (tenant, barcode) where barcode not null
   - Prevents duplicate codes and barcodes

7. **Add permissions**
   - default_permissions: ["add", "change", "delete", "view"]
   - Custom permission: "can_deactivate_location"
   - Custom permission: "can_bulk_create_locations"

### Index Strategy

```python
class Meta:
    verbose_name = "Storage Location"
    verbose_name_plural = "Storage Locations"
    db_table = "inventory_storage_locations"
    ordering = ["warehouse", "code"]
    
    indexes = [
        models.Index(
            fields=["tenant", "warehouse", "code"],
            name="idx_loc_tenant_wh_code"
        ),
        models.Index(
            fields=["location_type"],
            name="idx_loc_type"
        ),
        models.Index(
            fields=["parent"],
            name="idx_loc_parent"
        ),
        models.Index(
            fields=["barcode"],
            name="idx_loc_barcode"
        ),
        models.Index(
            fields=["is_active", "is_pickable"],
            name="idx_loc_flags"
        ),
    ]
    
    constraints = [
        models.UniqueConstraint(
            fields=["tenant", "warehouse", "code"],
            name="unique_location_code"
        ),
        models.UniqueConstraint(
            fields=["tenant", "barcode"],
            condition=Q(barcode__isnull=False),
            name="unique_location_barcode"
        ),
    ]
```

### Query Optimization Benefits

| Index | Query Pattern | Benefit |
|-------|---------------|---------|
| tenant+warehouse+code | Location lookup | Fast code search |
| location_type | Filter by type | Type-based reports |
| parent | Hierarchy navigation | Child location queries |
| barcode | Scanning operations | Instant barcode lookup |
| is_active+is_pickable | Operational filtering | Pick list generation |

### Expected Outcome
Optimized Meta configuration for storage location queries.

### Verification Checklist
- [ ] Meta class created
- [ ] verbose_name set
- [ ] db_table explicit
- [ ] ordering configured
- [ ] Indexes defined
- [ ] Constraints added
- [ ] Permissions documented

---

## Task 29: Add StorageLocation Manager

### Overview
Create custom model manager with query methods for common location operations. The manager simplifies filtering by warehouse, type, status, and operational flags.

### Dependencies
- Task 20: Create StorageLocation model
- Task 25-27: Boolean flag fields

### Instructions

1. **Create manager file**
   - Create `location_manager.py` in `warehouses/managers/`
   - Add module docstring

2. **Create LocationQuerySet class**
   - Inherit from models.QuerySet
   - Chainable query methods

3. **Add active() method**
   - Filter is_active=True
   - Returns operational locations

4. **Add inactive() method**
   - Filter is_active=False
   - Returns disabled locations

5. **Add pickable() method**
   - Filter is_pickable=True
   - Filter is_active=True (must be active to pick)
   - Returns locations suitable for picking

6. **Add receivable() method**
   - Filter is_receivable=True
   - Filter is_active=True
   - Returns locations for receiving

7. **Add by_warehouse() method**
   - Accepts warehouse parameter (object or ID)
   - Filters locations in specific warehouse

8. **Add by_type() method**
   - Accepts location_type parameter
   - Filters by ZONE, AISLE, RACK, etc.

9. **Add by_parent() method**
   - Accepts parent location
   - Returns child locations

10. **Add root_locations() method**
    - Filter parent__isnull=True
    - Returns zone-level locations

11. **Create LocationManager class**
    - Inherit from models.Manager
    - Set LocationQuerySet as queryset class

12. **Add get_by_code() method**
    - Lookup by warehouse and code
    - Returns single location or None

13. **Add get_by_barcode() method**
    - Lookup by barcode
    - Returns single location or None
    - Used for scanning operations

14. **Attach manager to model**
    - Set as objects attribute

### Manager Usage Examples

```python
# Get all active pickable locations
Location.objects.active().pickable()

# Get locations in specific warehouse
Location.objects.by_warehouse(warehouse).active()

# Get all racks in an aisle
Location.objects.by_parent(aisle).by_type(LOCATION_TYPE_RACK)

# Get root zones in warehouse
Location.objects.by_warehouse(warehouse).root_locations()

# Lookup by barcode (scanning)
location = Location.objects.get_by_barcode('LOC-ABC-WH01-A0301-7')

# Chain multiple filters
picking_locations = (
    Location.objects
    .by_warehouse(warehouse)
    .active()
    .pickable()
    .by_type(LOCATION_TYPE_BIN)
)
```

### QuerySet Methods (Chainable)

```python
class LocationQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)
    
    def inactive(self):
        return self.filter(is_active=False)
    
    def pickable(self):
        return self.filter(is_pickable=True, is_active=True)
    
    def receivable(self):
        return self.filter(is_receivable=True, is_active=True)
    
    def by_warehouse(self, warehouse):
        if isinstance(warehouse, int):
            return self.filter(warehouse_id=warehouse)
        return self.filter(warehouse=warehouse)
    
    def by_type(self, location_type):
        return self.filter(location_type=location_type)
    
    def by_parent(self, parent):
        return self.filter(parent=parent)
    
    def root_locations(self):
        return self.filter(parent__isnull=True)
```

### Manager Methods (Terminal)

```python
class LocationManager(models.Manager):
    def get_queryset(self):
        return LocationQuerySet(self.model, using=self._db)
    
    def active(self):
        return self.get_queryset().active()
    
    def pickable(self):
        return self.get_queryset().pickable()
    
    def receivable(self):
        return self.get_queryset().receivable()
    
    def get_by_code(self, warehouse, code):
        try:
            return self.get(warehouse=warehouse, code=code)
        except self.model.DoesNotExist:
            return None
    
    def get_by_barcode(self, barcode):
        try:
            return self.get(barcode=barcode)
        except self.model.DoesNotExist:
            return None
```

### Expected Outcome
```
backend/apps/inventory/warehouses/managers/
├── __init__.py (updated)
├── warehouse_manager.py (existing)
└── location_manager.py (NEW)
```

### Verification Checklist
- [ ] location_manager.py created
- [ ] LocationQuerySet defined
- [ ] Chainable methods implemented
- [ ] LocationManager defined
- [ ] Terminal methods implemented
- [ ] Manager attached to model
- [ ] Usage examples in docstrings

---

## Task 30: Create Location Path Property

### Overview
Add computed property that returns the full hierarchical path of a location. The path property provides human-readable location identification showing the complete hierarchy.

### Dependencies
- Task 21: Add parent FK for hierarchy

### Instructions

1. **Add location_path property**
   - Use @property decorator
   - Returns string representing full path
   - Format: "Zone A > Aisle 3 > Rack 2 > Shelf 1 > Bin 5"

2. **Implement path generation logic**
   - Start from current location
   - Traverse up parent chain
   - Collect names in order
   - Reverse to show root-to-leaf

3. **Use separator**
   - Default separator: " > "
   - Shows hierarchy clearly
   - Consistent with breadcrumb navigation

4. **Add recursive traversal**
   - Follow parent references
   - Stop at root (parent=None)
   - Handle circular references (shouldn't happen)

5. **Cache path calculation**
   - Consider caching for performance
   - Recalculate on save if parent changes
   - Optional: Store in cached_path field

6. **Add short_path property (optional)**
   - Returns only last N levels
   - Example: "Rack 2 > Shelf 1 > Bin 5"
   - Useful for compact display

7. **Update __str__ method**
   - Use location_path property
   - Fallback to name if path unavailable

### Path Generation Algorithm

```python
@property
def location_path(self):
    """
    Returns full hierarchical path of location.
    Example: "Zone A > Aisle 3 > Rack 2 > Shelf 1 > Bin 5"
    """
    path_parts = []
    current = self
    
    # Traverse up the hierarchy
    while current is not None:
        path_parts.append(current.name)
        current = current.parent
    
    # Reverse to show root-to-leaf
    path_parts.reverse()
    
    return " > ".join(path_parts)

@property
def location_path_with_warehouse(self):
    """
    Returns path including warehouse name.
    Example: "WH-CMB-01 > Zone A > Aisle 3 > Rack 2"
    """
    return f"{self.warehouse.name} > {self.location_path}"

@property
def short_path(self):
    """
    Returns last 3 levels of path.
    Example: "Rack 2 > Shelf 1 > Bin 5"
    """
    parts = self.location_path.split(" > ")
    return " > ".join(parts[-3:])
```

### Path Display Examples

**Full Path:**
```
Zone: "Storage Zone A"
Path: "Storage Zone A"

Aisle: "Aisle 3"
Path: "Storage Zone A > Aisle 3"

Rack: "Rack 2"
Path: "Storage Zone A > Aisle 3 > Rack 2"

Shelf: "Shelf 1"
Path: "Storage Zone A > Aisle 3 > Rack 2 > Shelf 1"

Bin: "Bin 5"
Path: "Storage Zone A > Aisle 3 > Rack 2 > Shelf 1 > Bin 5"
```

**With Codes:**
```
If using code instead of name:
"A > A03 > R02 > S01 > B05"

If using both:
"Zone A (A) > Aisle 3 (A03) > Rack 2 (R02)"
```

### Path Usage Scenarios

1. **Admin Interface:** Display location path in list view
2. **Pick Lists:** Show full path to picker
3. **Stock Inquiries:** Show where product is located
4. **Reports:** Location identification in reports
5. **API Responses:** Include path for frontend display
6. **Breadcrumb Navigation:** Use path parts for UI breadcrumbs

### Performance Considerations

**Without Caching:**
- Traverse parent chain on each access
- N database queries for N-level hierarchy
- Acceptable for occasional use

**With Caching:**
- Store path in cached_path field
- Update on save if parent changes
- Signal to update children if name changes
- Better for frequent access

**Optimization Strategy:**
```python
# Option 1: Select related
locations = Location.objects.select_related(
    'parent', 
    'parent__parent',
    'parent__parent__parent'
)

# Option 2: Cached field
cached_path = models.CharField(max_length=500, blank=True)

def save(self, *args, **kwargs):
    self.cached_path = self.location_path
    super().save(*args, **kwargs)
```

### Expected Outcome
StorageLocation model with location_path property showing full hierarchy.

### Verification Checklist
- [ ] location_path property added
- [ ] Recursive traversal implemented
- [ ] Separator used (" > ")
- [ ] __str__ method updated
- [ ] Optional short_path added
- [ ] Performance notes documented
- [ ] Usage examples provided

---

## Summary

These six tasks enhanced the storage location model with operational features:

1. **is_active flag** for enabling/disabling locations (default: True)
2. **is_pickable flag** for designating picking-optimized locations
3. **is_receivable flag** for receiving zone locations
4. **Meta class** with indexes, constraints, and permissions
5. **Custom manager** with active(), pickable(), receivable(), by_warehouse() methods
6. **location_path property** showing full hierarchical path ("Zone A > Aisle 3 > Rack 2")

### What's Next?

The next document covers hierarchy navigation methods (children, descendants), validation, bulk location generator, and Django admin.

**→ Continue to:** [03_Tasks-31-36_Hierarchy-Methods-Admin.md](03_Tasks-31-36_Hierarchy-Methods-Admin.md)
