# Tasks 19-24: Location Model Setup

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** B - Storage Location Hierarchy  
> **Document:** 01 of 03  
> **Tasks Covered:** 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-25-30_Flags-Manager-Properties.md](02_Tasks-25-30_Flags-Manager-Properties.md)

---

## Document Overview

This document covers the creation of the hierarchical storage location system. Storage locations provide granular inventory positioning within warehouses, from zones down to individual bin locations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Define location type constants | Low | 10 min |
| 20 | Create StorageLocation model | Medium | 30 min |
| 21 | Add parent FK for hierarchy | Low | 20 min |
| 22 | Add location code field | Low | 15 min |
| 23 | Add location barcode field | Low | 15 min |
| 24 | Add location capacity fields | Low | 20 min |

---

## Task 19: Define Location Type Constants

### Overview
Define constants for storage location types that form the warehouse hierarchy. The five-level system (Zone → Aisle → Rack → Shelf → Bin) provides flexible and scalable location management.

### Dependencies
- Group A: Warehouse model complete
- Constants file exists

### Instructions

1. **Open constants.py file**
   - Navigate to `inventory/warehouses/constants.py`
   - Add new section for location types

2. **Add section header comment**
   - Comment: "Storage Location Type Constants"
   - Explain five-level hierarchy

3. **Define location type constants**
   - Create LOCATION_TYPE_ZONE = 'zone'
   - Create LOCATION_TYPE_AISLE = 'aisle'
   - Create LOCATION_TYPE_RACK = 'rack'
   - Create LOCATION_TYPE_SHELF = 'shelf'
   - Create LOCATION_TYPE_BIN = 'bin'

4. **Create location type choices tuple**
   - Define LOCATION_TYPE_CHOICES
   - Format: (value, display_label)
   - Order from largest to smallest
   - Use proper capitalization

5. **Add depth mapping dictionary**
   - Create LOCATION_DEPTH_MAP
   - Maps type to depth level (0-4)
   - ZONE: 0, AISLE: 1, RACK: 2, SHELF: 3, BIN: 4

6. **Add parent type rules dictionary**
   - Create LOCATION_PARENT_RULES
   - Maps each type to allowed parent type
   - ZONE: None (root), AISLE: ZONE, RACK: AISLE, etc.

7. **Add documentation comments**
   - Explain each level's purpose
   - Provide example codes for each level
   - Note that hierarchy is flexible but recommended

### Location Hierarchy Structure

```
WAREHOUSE
    │
    ├── ZONE (e.g., "Receiving", "Storage A", "Picking")
    │       │
    │       ├── AISLE (e.g., "A01", "A02", "A03")
    │       │       │
    │       │       ├── RACK (e.g., "R01", "R02")
    │       │       │       │
    │       │       │       ├── SHELF (e.g., "S01", "S02", "S03")
    │       │       │       │       │
    │       │       │       │       ├── BIN (e.g., "B01", "B02")
```

### Level Descriptions

| Level | Depth | Purpose | Example Code | Typical Count |
|-------|-------|---------|--------------|---------------|
| **ZONE** | 0 | Logical warehouse area | "STORAGE-A" | 5-10 per warehouse |
| **AISLE** | 1 | Physical walkway/corridor | "A03" | 10-50 per zone |
| **RACK** | 2 | Vertical storage structure | "R02" | 5-20 per aisle |
| **SHELF** | 3 | Horizontal level on rack | "S04" | 3-8 per rack |
| **BIN** | 4 | Smallest storage unit | "B01" | 1-10 per shelf |

### Warehouse Layout Example

**Small Warehouse (Sri Lankan Retail Shop):**
- 2 Zones (Storage, Display)
- 10 Aisles per zone
- 5 Racks per aisle
- 4 Shelves per rack
- 2 Bins per shelf
- **Total:** ~800 bin locations

**Large Distribution Center:**
- 5 Zones (Receiving, Storage, Picking, Packing, Shipping)
- 30 Aisles per zone
- 15 Racks per aisle
- 6 Shelves per rack
- 4 Bins per shelf
- **Total:** ~54,000 bin locations

### Expected Outcome
Constants file with location type definitions and hierarchy rules.

### Verification Checklist
- [ ] Five location type constants defined
- [ ] LOCATION_TYPE_CHOICES tuple created
- [ ] LOCATION_DEPTH_MAP dictionary defined
- [ ] LOCATION_PARENT_RULES dictionary defined
- [ ] Documentation explains hierarchy
- [ ] Examples provided for each level

---

## Task 20: Create StorageLocation Model

### Overview
Create the StorageLocation model to represent individual storage positions within warehouses. The model uses self-referential foreign key to build the hierarchy.

### Dependencies
- Task 19: Define location type constants
- Group A: Warehouse model complete

### Instructions

1. **Create storage_location.py file**
   - Create in `warehouses/models/` directory
   - Add comprehensive module docstring

2. **Import required dependencies**
   - Django models and fields
   - Base mixins (TenantMixin, TimestampMixin)
   - Location constants
   - Warehouse model

3. **Define StorageLocation model**
   - Inherit from TenantMixin, TimestampMixin, models.Model
   - Add docstring explaining hierarchical structure
   - Note multi-tenant isolation

4. **Add warehouse foreign key**
   - **warehouse:** ForeignKey to Warehouse
   - on_delete: CASCADE (if warehouse deleted, locations deleted)
   - related_name: "storage_locations"
   - db_index: True for fast lookups
   - Help text: "Warehouse containing this location"

5. **Add location type field**
   - **location_type:** CharField(max_length=20)
   - Choices from LOCATION_TYPE_CHOICES
   - Indexed field (db_index=True)
   - Required field
   - Help text: "Location level in hierarchy"

6. **Add name field**
   - **name:** CharField(max_length=100)
   - Verbose name: "Location Name"
   - Help text: "Human-readable location name"
   - Example: "Storage Zone A", "Aisle 3", "Rack 2"

7. **Add description field**
   - **description:** TextField
   - Optional field (blank=True, null=True)
   - Help text: "Additional location details"
   - Useful for special instructions

8. **Add __str__ method**
   - Return location path (implemented later)
   - Format: "WH-CMB-01 > Zone A > Aisle 3 > Rack 2"
   - Fallback to name if path not available

9. **Add __repr__ method**
   - Technical representation
   - Include id, warehouse_code, location_type, name

### Multi-Tenant Considerations

Each storage location is:
- Isolated by tenant (via TenantMixin)
- Scoped to a specific warehouse
- Part of tenant-specific hierarchy
- No cross-tenant location references

### Location Naming Conventions

**Zone Names:**
- Functional: "Receiving", "Storage", "Picking", "Shipping"
- Alphabetical: "Zone A", "Zone B", "Zone C"
- Purpose-based: "Cold Storage", "Dry Goods", "Returns"

**Aisle Names:**
- Alphanumeric: "A01", "A02", "B01"
- Numeric: "1", "2", "3"
- Letter + Number: "A-1", "B-3"

**Rack/Shelf/Bin Names:**
- Sequential: "R01", "S01", "B01"
- Grid-based: "R1-S2-B3"
- Position-based: "L-M-T" (Left-Middle-Top)

### Storage Location Hierarchy Rules

1. **Zone (Level 0):**
   - No parent (root level)
   - Logical warehouse divisions
   - Can contain aisles or be directly subdivided

2. **Aisle (Level 1):**
   - Parent must be Zone
   - Physical walkways
   - Contains racks on both sides typically

3. **Rack (Level 2):**
   - Parent must be Aisle
   - Vertical storage structures
   - Contains multiple shelf levels

4. **Shelf (Level 3):**
   - Parent must be Rack
   - Horizontal storage levels
   - Divided into bins

5. **Bin (Level 4):**
   - Parent must be Shelf
   - Smallest addressable location
   - Actual product storage position

### Expected Outcome
```
backend/apps/inventory/warehouses/models/
├── __init__.py (updated)
├── warehouse.py (existing)
└── storage_location.py (NEW)
```

### Verification Checklist
- [ ] storage_location.py file created
- [ ] StorageLocation model defined
- [ ] warehouse FK added with CASCADE
- [ ] location_type field with choices
- [ ] name and description fields
- [ ] Proper inheritance (TenantMixin, TimestampMixin)
- [ ] __str__ and __repr__ methods
- [ ] Docstring explains hierarchy

---

## Task 21: Add Parent FK for Hierarchy

### Overview
Add self-referential foreign key to create the parent-child relationship that enables hierarchical structure. This allows locations to be nested under other locations.

### Dependencies
- Task 20: Create StorageLocation model

### Instructions

1. **Add parent foreign key field**
   - **parent:** ForeignKey to 'self'
   - on_delete: CASCADE (if parent deleted, children deleted)
   - related_name: "children"
   - Optional field (null=True, blank=True)
   - db_index: True
   - Help text: "Parent location in hierarchy"

2. **Add null constraint meaning**
   - parent=None means this is a root-level location (Zone)
   - All zones have parent=None
   - All other types must have parent

3. **Add validation for parent type**
   - Will be implemented in validation (later task)
   - Document expected parent types
   - AISLE parent must be ZONE, etc.

4. **Add recursive deletion behavior**
   - CASCADE ensures children are deleted with parent
   - Document that deleting a zone deletes all nested locations
   - Consider soft-delete for production safety

5. **Update model imports**
   - Ensure 'self' reference is quoted in ForeignKey
   - No circular import issues

### Hierarchy Relationships

```python
# Example hierarchy creation
zone = StorageLocation(
    warehouse=warehouse,
    location_type='zone',
    name='Storage A',
    parent=None  # Root level
)

aisle = StorageLocation(
    warehouse=warehouse,
    location_type='aisle',
    name='Aisle 3',
    parent=zone  # Child of zone
)

rack = StorageLocation(
    warehouse=warehouse,
    location_type='rack',
    name='Rack 2',
    parent=aisle  # Child of aisle
)
```

### Parent-Child Query Examples

```python
# Get all children of a zone
zone.children.all()  # Returns all aisles in this zone

# Get parent of a location
rack.parent  # Returns the aisle

# Get siblings (same parent, same level)
rack.parent.children.filter(location_type='rack')

# Check if location is root
if location.parent is None:
    # This is a zone
```

### Cascade Deletion Impact

Deleting locations cascades down the hierarchy:
```
Delete Zone
    → Deletes all Aisles in zone
        → Deletes all Racks in aisles
            → Deletes all Shelves in racks
                → Deletes all Bins in shelves
```

**Safety Considerations:**
- Warn users before deleting high-level locations
- Check for inventory before allowing deletion
- Consider soft-delete (is_deleted flag) for production
- Log all deletions for audit trail

### Expected Outcome
StorageLocation model with parent FK enabling hierarchical structure.

### Verification Checklist
- [ ] parent FK added (self-referential)
- [ ] related_name set to "children"
- [ ] on_delete set to CASCADE
- [ ] null=True, blank=True (optional field)
- [ ] db_index=True for queries
- [ ] Documentation explains cascade behavior
- [ ] Comments note validation rules

---

## Task 22: Add Location Code Field

### Overview
Add unique code field for programmatic location identification. Codes provide a compact, scannable identifier that's easier to work with than database IDs or full names.

### Dependencies
- Task 20: Create StorageLocation model

### Instructions

1. **Add code field**
   - **code:** CharField(max_length=50)
   - Verbose name: "Location Code"
   - Help text: "Unique code like 'A03-02-04-01'"
   - Indexed field (db_index=True)
   - Required field

2. **Add uniqueness constraint**
   - Unique within warehouse (not just tenant)
   - Use unique_together or UniqueConstraint
   - Format: (tenant, warehouse, code)

3. **Define code format standards**
   - Document recommended format
   - Zone: Single letter or short code (A, B, RECV, PICK)
   - Aisle: A01, A02, B01
   - Rack: Aisle + number (A01-R02)
   - Shelf: Rack + shelf (A01-R02-S03)
   - Bin: Full path (A01-R02-S03-B01)

4. **Add code generation helper**
   - Create helper method (or utility function)
   - generate_code(location_type, parent_code, sequence)
   - Returns properly formatted code

5. **Add code validation**
   - Alphanumeric with hyphens only
   - Convert to uppercase
   - Maximum 50 characters
   - Pattern validation in clean() method

6. **Consider auto-generation**
   - Option to auto-generate code from hierarchy
   - Use parent code + sequence number
   - Or allow manual entry for custom schemes

### Code Format Examples

**Simple Numeric:**
```
Zone: 1, 2, 3
Aisle: 1-1, 1-2, 2-1
Rack: 1-1-1, 1-1-2
Shelf: 1-1-1-1, 1-1-1-2
Bin: 1-1-1-1-1, 1-1-1-1-2
```

**Alphanumeric (Recommended):**
```
Zone: A, B, C
Aisle: A01, A02, B01
Rack: A01-R01, A01-R02
Shelf: A01-R01-S01, A01-R01-S02
Bin: A01-R01-S01-B01, A01-R01-S01-B02
```

**Functional Naming:**
```
Zone: RCV (Receiving), STG (Storage), PCK (Picking), SHP (Shipping)
Aisle: STG-A01, STG-A02
Rack: STG-A01-R01
Shelf: STG-A01-R01-S01
Bin: STG-A01-R01-S01-B01
```

### Code Generation Strategy

**Option 1: Hierarchical Concatenation**
- Zone code: "A"
- Aisle code: Parent code + sequential number = "A01"
- Rack code: Parent code + identifier = "A01-R02"
- Full path encoded in code

**Option 2: Independent Codes**
- Each level has independent code
- Zone: "A", Aisle: "03", Rack: "R02"
- Relationship only via parent FK
- Shorter codes, less redundancy

**Option 3: Hybrid Approach**
- Zones: Functional names
- Aisles: Zone letter + number
- Lower levels: Numeric sequence
- Balance readability and brevity

### Expected Outcome
StorageLocation model with code field and format documentation.

### Verification Checklist
- [ ] code field added (CharField 50)
- [ ] Uniqueness constraint planned
- [ ] Code format documented
- [ ] Examples provided
- [ ] Uppercase conversion planned
- [ ] Validation strategy defined
- [ ] Auto-generation considered

---

## Task 23: Add Location Barcode Field

### Overview
Add barcode field for scanning-based location identification. Barcodes enable quick, accurate location lookup during warehouse operations like receiving, picking, and inventory counts.

### Dependencies
- Task 20: Create StorageLocation model

### Instructions

1. **Add barcode field**
   - **barcode:** CharField(max_length=100)
   - Verbose name: "Barcode"
   - Help text: "Scannable barcode for this location"
   - Optional initially (blank=True, null=True)
   - Indexed field (db_index=True) for fast lookups
   - Unique within tenant

2. **Add uniqueness constraint**
   - Unique across entire tenant
   - Use UniqueConstraint with tenant scope
   - Prevent duplicate barcodes

3. **Define barcode format**
   - Document format: LOC-{TENANT}-{WAREHOUSE}-{CODE}-{CHECK}
   - Example: LOC-ABC-WH01-A0301-7
   - Check digit for validation
   - Will be generated automatically (later task)

4. **Plan barcode generation**
   - Auto-generate if not provided
   - Use pre_save signal (implemented in Group C)
   - Based on tenant, warehouse, and location code

5. **Add barcode lookup method**
   - Add to manager (later task)
   - Quick lookup by scanned barcode
   - Return location or None

6. **Document barcode usage**
   - Printed on labels and attached to physical locations
   - Scanned during inventory operations
   - Links physical world to database records

### Barcode Format Specification

```
Format: LOC-{TENANT_PREFIX}-{WAREHOUSE_CODE}-{LOCATION_CODE}-{CHECK}

Components:
- LOC: Fixed prefix for location barcodes
- TENANT_PREFIX: 3-letter tenant identifier
- WAREHOUSE_CODE: Warehouse code (e.g., WH01)
- LOCATION_CODE: Location code without hyphens
- CHECK: Luhn check digit

Example:
  Location: Warehouse WH-CMB-01, Location A03-R02-S01-B05
  Tenant: ABC Company
  Barcode: LOC-ABC-WHCMB01-A03R02S01B05-7
  
Shortened Display: A03R02S01B05 (for compact labels)
```

### Barcode Types Support

**Linear Barcodes (1D):**
- Code 128: Good for alphanumeric
- Code 39: Widely compatible
- EAN-13: For standardization

**2D Barcodes:**
- QR Code: Can store more data (full URL, JSON)
- Data Matrix: Compact, good for small labels
- PDF417: High data capacity

**Recommendation:** Use Code 128 for primary barcode + QR code for mobile scanning

### Barcode Label Design

```
┌─────────────────────────┐
│  Warehouse: WH-CMB-01   │
│  Zone A > Aisle 3       │
│  ┌──────────────────┐   │
│  │  █ █ █  █ ███ █  │   │ ← Code 128 Barcode
│  │  █  █ ██  █ █ █  │   │
│  └──────────────────┘   │
│    A03-R02-S01-B05      │ ← Human-readable code
│  [QR]                   │ ← QR code with details
└─────────────────────────┘
```

### Scanning Workflow

1. **Receiving Goods:**
   - Scan location barcode
   - System identifies storage location
   - Record stock placement

2. **Picking Orders:**
   - System shows location code
   - Worker scans location to confirm
   - Ensures correct picking location

3. **Inventory Count:**
   - Scan location barcode
   - Count products at location
   - Record count against location

4. **Stock Transfer:**
   - Scan source location
   - Scan destination location
   - Record transfer movement

### Expected Outcome
StorageLocation model with barcode field ready for scanning operations.

### Verification Checklist
- [ ] barcode field added (CharField 100)
- [ ] Optional field (blank=True, null=True)
- [ ] Indexed for fast lookup
- [ ] Uniqueness constraint planned
- [ ] Barcode format documented
- [ ] Usage scenarios documented
- [ ] Label design considered

---

## Task 24: Add Location Capacity Fields

### Overview
Add capacity tracking fields to manage storage limits and prevent overloading. Capacity fields enable capacity planning, utilization reporting, and automated location selection.

### Dependencies
- Task 20: Create StorageLocation model

### Instructions

1. **Add max_weight field**
   - **max_weight:** DecimalField
   - Verbose name: "Maximum Weight (kg)"
   - max_digits: 10, decimal_places: 2
   - Optional field (blank=True, null=True)
   - Help text: "Maximum weight capacity in kilograms"
   - Positive values only

2. **Add max_volume field**
   - **max_volume:** DecimalField
   - Verbose name: "Maximum Volume (m³)"
   - max_digits: 10, decimal_places: 3
   - Optional field (blank=True, null=True)
   - Help text: "Maximum volume capacity in cubic meters"
   - Positive values only

3. **Add max_items field**
   - **max_items:** PositiveIntegerField
   - Verbose name: "Maximum Items"
   - Optional field (blank=True, null=True)
   - Help text: "Maximum number of items/SKUs"
   - Used for item count limits

4. **Add max_pallets field**
   - **max_pallets:** PositiveSmallIntegerField
   - Verbose name: "Maximum Pallets"
   - Optional field (blank=True, null=True)
   - Help text: "Maximum number of pallets"
   - Useful for pallet rack locations

5. **Add capacity notes field**
   - **capacity_notes:** TextField
   - Optional field (blank=True, null=True)
   - Help text: "Additional capacity constraints or notes"
   - Special handling requirements

6. **Plan utilization calculation**
   - Will calculate current usage vs max capacity
   - Requires StockLevel model (future)
   - Percentage utilization for reporting

### Capacity Management Strategy

**Weight-Based Capacity:**
- Calculate from product weights
- Useful for heavy items
- Safety consideration for rack strength
- Example: Rack max weight = 1000 kg

**Volume-Based Capacity:**
- Calculate from product dimensions
- Useful for bulky items
- Physical space constraint
- Example: Bin volume = 0.5 m³

**Item Count Capacity:**
- Simple count of SKUs or items
- Useful for small items
- Easy to manage
- Example: Bin holds max 20 items

**Pallet Capacity:**
- For pallet storage locations
- Each pallet position counted
- Standard pallet size: 1.2m × 1.0m
- Example: Floor location holds 100 pallets

### Capacity Types by Location Level

| Level | Weight | Volume | Items | Pallets | Notes |
|-------|--------|--------|-------|---------|-------|
| **Zone** | Aggregate | Aggregate | Aggregate | ✓ | Total zone capacity |
| **Aisle** | Aggregate | Aggregate | - | ✓ | Aisle capacity |
| **Rack** | ✓ | - | - | ✓ | Rack weight limit critical |
| **Shelf** | ✓ | ✓ | ✓ | - | Most specific capacity |
| **Bin** | ✓ | ✓ | ✓ | - | Smallest unit capacity |

### Capacity Constraint Scenarios

**Example 1: Small Bin**
```
Location: A03-R02-S01-B05
max_weight: 50.00 kg
max_volume: 0.25 m³
max_items: 10
Suitable for: Small parts, tools, accessories
```

**Example 2: Pallet Rack**
```
Location: A01-R01-S01
max_weight: 1000.00 kg
max_pallets: 2
Suitable for: Palletized goods
```

**Example 3: Floor Storage Zone**
```
Location: Zone BULK
max_weight: 50000.00 kg
max_volume: 500.000 m³
max_pallets: 200
Suitable for: Bulk storage, large items
```

### Capacity Validation Rules

1. **Current Usage ≤ Max Capacity**
   - Prevent overfilling locations
   - Check before adding stock
   - Warning at 90% capacity

2. **Child Capacity ≤ Parent Capacity**
   - Sum of child capacities shouldn't exceed parent
   - Validation at hierarchy level

3. **Multiple Constraint Checks**
   - Check weight AND volume AND items
   - All constraints must pass
   - Use most restrictive constraint

### Expected Outcome
StorageLocation model with comprehensive capacity tracking fields.

### Verification Checklist
- [ ] max_weight field added (DecimalField)
- [ ] max_volume field added (DecimalField)
- [ ] max_items field added (PositiveIntegerField)
- [ ] max_pallets field added
- [ ] capacity_notes field added
- [ ] All fields optional (null=True, blank=True)
- [ ] Positive validation for numeric fields
- [ ] Help text explains units
- [ ] Usage examples documented

---

## Summary

These first six tasks established the storage location model foundation:

1. **Location type constants** defined five-level hierarchy (ZONE, AISLE, RACK, SHELF, BIN)
2. **StorageLocation model** created with warehouse FK and location_type field
3. **Parent FK** added for self-referential hierarchy with CASCADE deletion
4. **Code field** for unique location identification with format standards
5. **Barcode field** for scanning operations with format specification
6. **Capacity fields** for weight, volume, item, and pallet limits

### What's Next?

The next document covers boolean flags, Meta class, custom manager, and hierarchy properties (path and depth).

**→ Continue to:** [02_Tasks-25-30_Flags-Manager-Properties.md](02_Tasks-25-30_Flags-Manager-Properties.md)
