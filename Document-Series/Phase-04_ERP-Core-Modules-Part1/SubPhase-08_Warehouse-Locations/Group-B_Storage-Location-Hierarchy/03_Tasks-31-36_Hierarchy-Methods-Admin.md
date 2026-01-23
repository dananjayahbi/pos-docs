# Tasks 31-36: Hierarchy Methods & Admin

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** B - Storage Location Hierarchy  
> **Document:** 03 of 03  
> **Tasks Covered:** 31, 32, 33, 34, 35, 36

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-25-30_Flags-Manager-Properties.md](02_Tasks-25-30_Flags-Manager-Properties.md)
- **→ Next Group:** [../Group-C_Location-Barcodes-Scanning/](../Group-C_Location-Barcodes-Scanning/)

---

## Document Overview

This document covers hierarchy navigation methods, depth calculation, validation rules, bulk location generator utility, and Django admin configuration. These complete the storage location hierarchy implementation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 31 | Add location depth property | Low | 15 min |
| 32 | Create get_children method | Low | 15 min |
| 33 | Create get_all_descendants method | Medium | 25 min |
| 34 | Add location validation | Medium | 25 min |
| 35 | Create bulk location generator | High | 30 min |
| 36 | Create StorageLocation admin | High | 30 min |

---

## Task 31: Add Location Depth Property

### Overview
Add computed property that returns the depth level of a location in the hierarchy. Depth values (0-4) correspond to location types and enable level-based operations.

### Dependencies
- Task 21: Add parent FK for hierarchy
- Task 19: Define location type constants

### Instructions

1. **Add depth property**
   - Use @property decorator
   - Returns integer representing hierarchy depth
   - Zone=0, Aisle=1, Rack=2, Shelf=3, Bin=4

2. **Implement depth calculation**
   - Option 1: Use LOCATION_DEPTH_MAP constant
   - Option 2: Count parent chain length
   - Recommendation: Use constant for consistency

3. **Add depth from LOCATION_DEPTH_MAP**
   - Import LOCATION_DEPTH_MAP from constants
   - Return depth based on location_type
   - Fast O(1) lookup

4. **Alternative: Calculate from parent chain**
   - Count number of parents
   - Handles flexible hierarchies
   - More flexible but slower

5. **Add level_name property**
   - Returns human-readable level name
   - Example: "Level 0 (Zone)", "Level 3 (Shelf)"

6. **Use depth for queries**
   - Filter locations by depth
   - Useful for reports and visualization

### Depth Calculation Methods

**Method 1: Using LOCATION_DEPTH_MAP (Recommended)**
```python
@property
def depth(self):
    """
    Returns hierarchy depth level.
    0=Zone, 1=Aisle, 2=Rack, 3=Shelf, 4=Bin
    """
    from .constants import LOCATION_DEPTH_MAP
    return LOCATION_DEPTH_MAP.get(self.location_type, 0)

@property
def level_name(self):
    """Returns human-readable level name."""
    depth_names = {
        0: "Zone",
        1: "Aisle",
        2: "Rack",
        3: "Shelf",
        4: "Bin"
    }
    return depth_names.get(self.depth, "Unknown")
```

**Method 2: Counting Parent Chain**
```python
@property
def depth_calculated(self):
    """
    Calculate depth by counting parents.
    More flexible but requires database queries.
    """
    depth = 0
    current = self.parent
    
    while current is not None:
        depth += 1
        current = current.parent
        
        # Safety check for circular reference
        if depth > 10:
            raise ValueError("Circular reference detected in hierarchy")
    
    return depth
```

### Depth-Based Operations

**Filter by Depth:**
```python
# Get all locations at depth 2 (Racks)
racks = Location.objects.filter(location_type=LOCATION_TYPE_RACK)

# Using depth in queries (if storing depth field)
depth_2_locations = Location.objects.filter(depth=2)
```

**Hierarchy Visualization:**
```
Depth 0: ■ Zone A
Depth 1:   ├─ □ Aisle 1
Depth 2:   │   ├─ ○ Rack 1
Depth 3:   │   │   ├─ △ Shelf 1
Depth 4:   │   │   │   ├─ ◇ Bin 1
Depth 4:   │   │   │   └─ ◇ Bin 2
Depth 3:   │   │   └─ △ Shelf 2
Depth 2:   │   └─ ○ Rack 2
Depth 1:   └─ □ Aisle 2
```

### Use Cases for Depth

1. **Tree Rendering:** Indent based on depth for visual hierarchy
2. **Breadcrumb Display:** Show depth-appropriate crumbs
3. **Permission Levels:** Different access by depth
4. **Report Grouping:** Aggregate by depth level
5. **Validation:** Ensure depth matches parent depth + 1
6. **Navigation:** Navigate up/down specific depth levels

### Expected Outcome
StorageLocation model with depth property returning 0-4 based on type.

### Verification Checklist
- [ ] depth property added
- [ ] Returns 0 for ZONE, 4 for BIN
- [ ] Uses LOCATION_DEPTH_MAP
- [ ] level_name property added (optional)
- [ ] Documentation explains depth values
- [ ] Usage examples provided

---

## Task 32: Create get_children Method

### Overview
Add method to retrieve direct child locations. This method simplifies navigation to the next level in the hierarchy without writing manual queries.

### Dependencies
- Task 21: Add parent FK for hierarchy

### Instructions

1. **Add get_children method**
   - Instance method (not property)
   - Returns QuerySet of child locations
   - Direct children only (not grandchildren)

2. **Use reverse relationship**
   - Access via self.children reverse FK
   - Already defined by related_name="children"

3. **Add active-only variant**
   - get_children(active_only=True)
   - Parameter to filter active children
   - Default to False (show all)

4. **Add type-specific methods**
   - get_aisles() for zones
   - get_racks() for aisles
   - get_shelves() for racks
   - get_bins() for shelves

5. **Return ordered queryset**
   - Order by code or name
   - Consistent child ordering

6. **Handle no children case**
   - Return empty queryset (not None)
   - Allows chaining

### get_children Implementation

```python
def get_children(self, active_only=False):
    """
    Get direct child locations.
    
    Args:
        active_only: If True, return only active children
        
    Returns:
        QuerySet of child StorageLocation objects
    """
    queryset = self.children.all()
    
    if active_only:
        queryset = queryset.filter(is_active=True)
    
    return queryset.order_by('code')

def get_child_count(self):
    """Returns count of direct children."""
    return self.children.count()

def has_children(self):
    """Returns True if location has any children."""
    return self.children.exists()
```

### Type-Specific Helper Methods

```python
def get_aisles(self, active_only=True):
    """Get child aisles (for Zones only)."""
    if self.location_type != LOCATION_TYPE_ZONE:
        return self.__class__.objects.none()
    return self.get_children(active_only).filter(
        location_type=LOCATION_TYPE_AISLE
    )

def get_racks(self, active_only=True):
    """Get child racks (for Aisles only)."""
    if self.location_type != LOCATION_TYPE_AISLE:
        return self.__class__.objects.none()
    return self.get_children(active_only).filter(
        location_type=LOCATION_TYPE_RACK
    )

def get_shelves(self, active_only=True):
    """Get child shelves (for Racks only)."""
    if self.location_type != LOCATION_TYPE_RACK:
        return self.__class__.objects.none()
    return self.get_children(active_only).filter(
        location_type=LOCATION_TYPE_SHELF
    )

def get_bins(self, active_only=True):
    """Get child bins (for Shelves only)."""
    if self.location_type != LOCATION_TYPE_SHELF:
        return self.__class__.objects.none()
    return self.get_children(active_only).filter(
        location_type=LOCATION_TYPE_BIN
    )
```

### Usage Examples

```python
# Get all children
zone = Location.objects.get(code='A')
children = zone.get_children()

# Get only active children
active_children = zone.get_children(active_only=True)

# Get specific type
aisles = zone.get_aisles()

# Check if has children
if zone.has_children():
    print(f"{zone.name} has {zone.get_child_count()} children")

# Iterate through children
for aisle in zone.get_aisles():
    print(f"Aisle: {aisle.name}")
    for rack in aisle.get_racks():
        print(f"  Rack: {rack.name}")
```

### Expected Outcome
Methods to easily retrieve and navigate to child locations.

### Verification Checklist
- [ ] get_children() method added
- [ ] active_only parameter implemented
- [ ] get_child_count() method added
- [ ] has_children() method added
- [ ] Type-specific methods added
- [ ] Returns ordered queryset
- [ ] Documentation and examples

---

## Task 33: Create get_all_descendants Method

### Overview
Add method to retrieve all descendant locations recursively. This method returns the entire subtree below a location, useful for bulk operations and reporting.

### Dependencies
- Task 21: Add parent FK for hierarchy
- Task 32: Create get_children method

### Instructions

1. **Add get_all_descendants method**
   - Instance method
   - Returns QuerySet or list of all descendants
   - Includes children, grandchildren, etc.

2. **Implement recursive approach**
   - Option 1: Recursive Python function
   - Option 2: Database recursive CTE query
   - Recommendation: Recursive CTE for performance

3. **Add active_only parameter**
   - Filter to only active descendants
   - Useful for operational queries

4. **Add depth_limit parameter**
   - Limit recursion depth
   - Example: depth_limit=2 gets children and grandchildren only

5. **Optimize query**
   - Use select_related to reduce queries
   - Consider prefetch_related for related data

6. **Add descendant count method**
   - get_descendant_count()
   - Returns total count without fetching all

### Recursive Descendants Implementation

**Option 1: Python Recursion (Simple)**
```python
def get_all_descendants(self, active_only=False, depth_limit=None):
    """
    Get all descendant locations recursively.
    
    Args:
        active_only: Only return active locations
        depth_limit: Maximum depth to traverse (None = unlimited)
        
    Returns:
        List of descendant StorageLocation objects
    """
    descendants = []
    
    def collect_descendants(location, current_depth=0):
        # Check depth limit
        if depth_limit and current_depth >= depth_limit:
            return
        
        # Get children
        children = location.get_children(active_only=active_only)
        
        for child in children:
            descendants.append(child)
            collect_descendants(child, current_depth + 1)
    
    collect_descendants(self)
    return descendants

def get_descendant_count(self, active_only=False):
    """Returns count of all descendants."""
    return len(self.get_all_descendants(active_only=active_only))
```

**Option 2: PostgreSQL Recursive CTE (Efficient)**
```python
def get_all_descendants_optimized(self):
    """
    Get all descendants using PostgreSQL recursive CTE.
    More efficient for large hierarchies.
    """
    from django.db import connection
    
    with connection.cursor() as cursor:
        cursor.execute("""
            WITH RECURSIVE descendants AS (
                -- Base case: direct children
                SELECT id, parent_id, name, code, location_type
                FROM inventory_storage_locations
                WHERE parent_id = %s
                
                UNION ALL
                
                -- Recursive case: children of children
                SELECT l.id, l.parent_id, l.name, l.code, l.location_type
                FROM inventory_storage_locations l
                INNER JOIN descendants d ON l.parent_id = d.id
            )
            SELECT id FROM descendants;
        """, [self.id])
        
        descendant_ids = [row[0] for row in cursor.fetchall()]
    
    return self.__class__.objects.filter(id__in=descendant_ids)
```

### Bulk Operations on Descendants

**Deactivate Entire Subtree:**
```python
def deactivate_tree(self):
    """
    Deactivate this location and all descendants.
    Useful for closing an entire zone or aisle.
    """
    # Deactivate self
    self.is_active = False
    self.save(update_fields=['is_active'])
    
    # Deactivate all descendants
    descendants = self.get_all_descendants()
    for descendant in descendants:
        descendant.is_active = False
        descendant.save(update_fields=['is_active'])
```

**Count Stock in Subtree:**
```python
def get_total_stock_in_tree(self):
    """
    Get total stock count including all descendants.
    Requires StockLevel model (future implementation).
    """
    location_ids = [self.id]
    location_ids.extend([d.id for d in self.get_all_descendants()])
    
    # Will be implemented when StockLevel model exists
    # total = StockLevel.objects.filter(
    #     location_id__in=location_ids
    # ).aggregate(Sum('quantity'))['quantity__sum'] or 0
    # return total
    pass
```

### Tree Traversal Patterns

**Breadth-First Traversal:**
```python
def get_descendants_by_level(self):
    """
    Returns descendants grouped by depth level.
    Returns dict: {depth: [locations]}
    """
    from collections import defaultdict
    by_level = defaultdict(list)
    
    descendants = self.get_all_descendants()
    for desc in descendants:
        by_level[desc.depth].append(desc)
    
    return dict(by_level)
```

**Depth-First Traversal:**
```python
def traverse_tree(self, visitor_func):
    """
    Depth-first traversal with custom visitor function.
    visitor_func is called for each node.
    """
    # Visit this node
    visitor_func(self)
    
    # Recursively visit children
    for child in self.get_children():
        child.traverse_tree(visitor_func)
```

### Expected Outcome
Methods to retrieve and operate on entire location subtrees.

### Verification Checklist
- [ ] get_all_descendants() method added
- [ ] Recursive implementation works
- [ ] active_only parameter supported
- [ ] depth_limit parameter supported
- [ ] get_descendant_count() method added
- [ ] Performance optimization considered
- [ ] Usage examples documented

---

## Task 34: Add Location Validation

### Overview
Implement comprehensive validation rules using clean() method. Validation ensures hierarchy integrity, enforces business rules, and prevents data inconsistencies.

### Dependencies
- All previous StorageLocation fields and methods

### Instructions

1. **Override clean method**
   - Add to StorageLocation model
   - Call super().clean() first
   - Accumulate all validation errors

2. **Validate parent-type relationship**
   - Check parent location type matches rules
   - AISLE parent must be ZONE
   - RACK parent must be AISLE
   - Use LOCATION_PARENT_RULES constant

3. **Validate depth consistency**
   - Child depth must be parent depth + 1
   - Validate using depth property
   - Prevent hierarchy violations

4. **Validate warehouse consistency**
   - Parent must be in same warehouse
   - All hierarchy members share warehouse
   - Prevent cross-warehouse hierarchies

5. **Validate capacity constraints**
   - If capacity fields set, must be positive
   - Child capacity shouldn't exceed parent capacity
   - Validate weight, volume, items

6. **Validate code format**
   - Alphanumeric with hyphens only
   - Convert to uppercase
   - Check uniqueness (handled by constraint)

7. **Validate barcode format**
   - If provided, check format
   - Will be auto-generated if empty
   - Validate check digit

8. **Validate circular references**
   - Parent cannot be self
   - Parent cannot be descendant
   - Prevents infinite loops

### Validation Implementation

```python
def clean(self):
    """
    Perform model validation.
    """
    from django.core.exceptions import ValidationError
    super().clean()
    
    errors = {}
    
    # Validate parent-type relationship
    if self.parent:
        expected_parent_type = LOCATION_PARENT_RULES.get(self.location_type)
        
        if expected_parent_type is None:
            errors['parent'] = f"{self.get_location_type_display()} cannot have a parent"
        elif self.parent.location_type != expected_parent_type:
            errors['parent'] = (
                f"{self.get_location_type_display()} parent must be "
                f"{expected_parent_type}, not {self.parent.location_type}"
            )
        
        # Validate warehouse consistency
        if self.warehouse_id != self.parent.warehouse_id:
            errors['warehouse'] = "Location must be in same warehouse as parent"
        
        # Validate not self-referential
        if self.pk and self.parent_id == self.pk:
            errors['parent'] = "Location cannot be its own parent"
        
        # Validate depth consistency
        expected_depth = self.parent.depth + 1
        if self.depth != expected_depth:
            errors['location_type'] = (
                f"Type mismatch: expected depth {expected_depth}, "
                f"but {self.location_type} has depth {self.depth}"
            )
    
    else:
        # No parent - must be ZONE
        if self.location_type != LOCATION_TYPE_ZONE:
            errors['parent'] = f"{self.get_location_type_display()} must have a parent"
    
    # Validate capacity fields
    if self.max_weight is not None and self.max_weight <= 0:
        errors['max_weight'] = "Must be positive"
    
    if self.max_volume is not None and self.max_volume <= 0:
        errors['max_volume'] = "Must be positive"
    
    if self.max_items is not None and self.max_items <= 0:
        errors['max_items'] = "Must be positive"
    
    # Validate code format
    if self.code:
        import re
        if not re.match(r'^[A-Z0-9-]+$', self.code.upper()):
            errors['code'] = "Code must be alphanumeric with hyphens only"
        self.code = self.code.upper()
    
    if errors:
        raise ValidationError(errors)
```

### Parent-Type Rules Validation

```python
# From constants.py
LOCATION_PARENT_RULES = {
    LOCATION_TYPE_ZONE: None,              # No parent (root)
    LOCATION_TYPE_AISLE: LOCATION_TYPE_ZONE,
    LOCATION_TYPE_RACK: LOCATION_TYPE_AISLE,
    LOCATION_TYPE_SHELF: LOCATION_TYPE_RACK,
    LOCATION_TYPE_BIN: LOCATION_TYPE_SHELF,
}
```

### Circular Reference Prevention

```python
def validate_no_circular_reference(self):
    """
    Ensure parent is not a descendant of self.
    Prevents circular hierarchies.
    """
    if not self.parent or not self.pk:
        return True
    
    current = self.parent
    visited = set()
    
    while current:
        if current.pk == self.pk:
            raise ValidationError({
                'parent': "Circular reference detected: parent cannot be a descendant"
            })
        
        if current.pk in visited:
            raise ValidationError({
                'parent': "Circular reference detected in hierarchy"
            })
        
        visited.add(current.pk)
        current = current.parent
    
    return True
```

### Expected Outcome
Comprehensive validation preventing invalid location hierarchies.

### Verification Checklist
- [ ] clean() method overridden
- [ ] Parent-type validation implemented
- [ ] Warehouse consistency validated
- [ ] Capacity validation added
- [ ] Code format validation
- [ ] Circular reference prevention
- [ ] Error messages clear and actionable
- [ ] All rules from constants used

---

## Task 35: Create Bulk Location Generator

### Overview
Create utility to generate multiple locations at once using patterns. This tool dramatically speeds up warehouse setup by creating hundreds of locations from simple specifications.

### Dependencies
- StorageLocation model complete
- Validation implemented

### Instructions

1. **Create utility file**
   - Create `bulk_generator.py` in `warehouses/utils/`
   - Add module docstring explaining purpose

2. **Create BulkLocationGenerator class**
   - Service class for bulk generation
   - Methods for different generation patterns

3. **Implement pattern-based generation**
   - Accept pattern like "A{01-10}-R{01-05}"
   - Parse pattern and generate combinations
   - Example: Creates A01-R01 through A10-R05

4. **Add generate_from_pattern method**
   - Parse pattern string
   - Identify variable ranges
   - Generate all combinations
   - Create locations in database

5. **Add sequential generation method**
   - Generate N locations with sequential codes
   - Example: Generate bins B01 through B50

6. **Add template-based generation**
   - Copy structure from existing location
   - Create mirror hierarchy in new zone
   - Useful for replicating successful layouts

7. **Add batch creation**
   - Use bulk_create for performance
   - Create many locations in single query
   - Validate before bulk insert

8. **Add progress callback**
   - Optional callback for progress updates
   - Useful for UI progress bars
   - Report creation status

### Pattern Syntax

**Range Syntax:**
```
{start-end}         : Numeric range (01-50)
{A-Z}              : Letter range (A to Z)
{prefix|suffix}    : Alternatives
```

**Pattern Examples:**
```
"A{01-10}"                    → A01, A02, ..., A10
"Zone {A-C}"                  → Zone A, Zone B, Zone C
"A{01-05}-R{01-03}"          → A01-R01, A01-R02, A01-R03, A02-R01, ...
"PICK-{01-20}-{L|R}"         → PICK-01-L, PICK-01-R, PICK-02-L, ...
"{RCV|STG|PCK}-{01-10}"      → RCV-01, RCV-02, ..., STG-01, ..., PCK-10
```

### Implementation Example

```python
class BulkLocationGenerator:
    """
    Utility for bulk creation of storage locations.
    """
    
    def __init__(self, warehouse):
        self.warehouse = warehouse
        self.created_count = 0
        self.errors = []
    
    def generate_from_pattern(
        self,
        pattern,
        location_type,
        parent=None,
        capacity_params=None,
        **kwargs
    ):
        """
        Generate locations from pattern.
        
        Args:
            pattern: Code pattern like "A{01-10}-R{01-05}"
            location_type: ZONE, AISLE, RACK, SHELF, or BIN
            parent: Parent location (None for zones)
            capacity_params: Dict of capacity values
            **kwargs: Additional field values
            
        Returns:
            List of created locations
        """
        import re
        from itertools import product
        
        # Parse pattern
        codes = self._parse_pattern(pattern)
        
        # Prepare locations for bulk creation
        locations = []
        for code in codes:
            location = StorageLocation(
                warehouse=self.warehouse,
                location_type=location_type,
                parent=parent,
                code=code,
                name=f"{location_type.title()} {code}",
                **kwargs
            )
            
            # Add capacity if provided
            if capacity_params:
                location.max_weight = capacity_params.get('max_weight')
                location.max_volume = capacity_params.get('max_volume')
                location.max_items = capacity_params.get('max_items')
            
            # Validate
            try:
                location.full_clean()
                locations.append(location)
            except ValidationError as e:
                self.errors.append(f"Code {code}: {e}")
        
        # Bulk create
        if locations:
            created = StorageLocation.objects.bulk_create(
                locations,
                batch_size=100
            )
            self.created_count += len(created)
            return created
        
        return []
    
    def _parse_pattern(self, pattern):
        """
        Parse pattern string into list of codes.
        
        Example: "A{01-10}" → ["A01", "A02", ..., "A10"]
        """
        import re
        
        # Find all range expressions
        ranges = re.findall(r'\{([^}]+)\}', pattern)
        
        if not ranges:
            return [pattern]
        
        # Expand each range
        expanded_ranges = []
        for range_expr in ranges:
            if '-' in range_expr and range_expr[0].isdigit():
                # Numeric range: 01-10
                start, end = range_expr.split('-')
                width = len(start)
                expanded = [
                    str(i).zfill(width)
                    for i in range(int(start), int(end) + 1)
                ]
            elif '-' in range_expr and range_expr[0].isalpha():
                # Letter range: A-Z
                start, end = range_expr.split('-')
                expanded = [
                    chr(i)
                    for i in range(ord(start), ord(end) + 1)
                ]
            elif '|' in range_expr:
                # Alternatives: L|R
                expanded = range_expr.split('|')
            else:
                expanded = [range_expr]
            
            expanded_ranges.append(expanded)
        
        # Generate all combinations
        from itertools import product
        codes = []
        for combo in product(*expanded_ranges):
            code = pattern
            for i, value in enumerate(combo):
                code = code.replace(f'{{{ranges[i]}}}', value, 1)
            codes.append(code)
        
        return codes
    
    def generate_full_hierarchy(
        self,
        zone_code,
        aisles_count=10,
        racks_per_aisle=5,
        shelves_per_rack=4,
        bins_per_shelf=2
    ):
        """
        Generate complete hierarchical structure.
        """
        # Create zone
        zone = StorageLocation.objects.create(
            warehouse=self.warehouse,
            location_type=LOCATION_TYPE_ZONE,
            code=zone_code,
            name=f"Zone {zone_code}"
        )
        
        # Generate aisles
        aisles = self.generate_from_pattern(
            f"{zone_code}{{01-{aisles_count:02d}}}",
            LOCATION_TYPE_AISLE,
            parent=zone
        )
        
        # Generate racks for each aisle
        for aisle in aisles:
            racks = self.generate_from_pattern(
                f"{aisle.code}-R{{01-{racks_per_aisle:02d}}}",
                LOCATION_TYPE_RACK,
                parent=aisle
            )
            
            # Generate shelves for each rack
            for rack in racks:
                shelves = self.generate_from_pattern(
                    f"{rack.code}-S{{01-{shelves_per_rack:02d}}}",
                    LOCATION_TYPE_SHELF,
                    parent=rack
                )
                
                # Generate bins for each shelf
                for shelf in shelves:
                    self.generate_from_pattern(
                        f"{shelf.code}-B{{01-{bins_per_shelf:02d}}}",
                        LOCATION_TYPE_BIN,
                        parent=shelf
                    )
        
        return zone
```

### Usage Examples

```python
# Create bulk generator
generator = BulkLocationGenerator(warehouse=my_warehouse)

# Generate 50 bins in a shelf
bins = generator.generate_from_pattern(
    pattern="A01-R02-S03-B{01-50}",
    location_type=LOCATION_TYPE_BIN,
    parent=shelf,
    capacity_params={'max_items': 10, 'max_weight': 50.0}
)

# Generate complete zone
zone = generator.generate_full_hierarchy(
    zone_code="A",
    aisles_count=10,
    racks_per_aisle=5,
    shelves_per_rack=4,
    bins_per_shelf=10
)

print(f"Created {generator.created_count} locations")
```

### Expected Outcome
```
backend/apps/inventory/warehouses/utils/
├── __init__.py (NEW)
└── bulk_generator.py (NEW)
```

### Verification Checklist
- [ ] bulk_generator.py created
- [ ] BulkLocationGenerator class defined
- [ ] Pattern parsing implemented
- [ ] generate_from_pattern() method works
- [ ] generate_full_hierarchy() method works
- [ ] Validation before bulk insert
- [ ] Error handling and reporting
- [ ] Usage examples documented

---

## Task 36: Create StorageLocation Admin

### Overview
Configure comprehensive Django admin interface for storage location management. The admin should display hierarchy visually and provide bulk operations.

### Dependencies
- StorageLocation model complete
- All methods implemented

### Instructions

1. **Create admin configuration**
   - Add to `admin.py` in warehouses module
   - Register StorageLocation model

2. **Configure list display**
   - Show: location_path, code, location_type, warehouse, is_active, is_pickable
   - Use indentation to show hierarchy
   - Make location_path clickable

3. **Add list filters**
   - Filter by: warehouse, location_type, is_active, is_pickable, is_receivable
   - Add custom parent filter
   - Add depth filter

4. **Configure search**
   - Search by: code, name, barcode
   - Enable quick lookup

5. **Define fieldsets**
   - Group: Basic Info, Hierarchy, Address/Position, Capacity, Flags, Metadata

6. **Add readonly fields**
   - tenant, created_at, updated_at, depth, location_path
   - Computed fields readonly

7. **Create custom admin actions**
   - Activate locations
   - Deactivate locations
   - Generate barcodes
   - Print labels
   - Export hierarchy

8. **Add hierarchy visualization**
   - Custom list display with indentation
   - Tree-style display using depth
   - Collapse/expand functionality (advanced)

9. **Configure inline for Warehouse**
   - Show locations inline in Warehouse admin
   - Quick view of warehouse structure

10. **Add custom admin views**
    - Bulk generation form
    - Hierarchy tree view
    - Capacity report view

### Admin Configuration

```python
from django.contrib import admin
from django.utils.html import format_html
from .models import StorageLocation

@admin.register(StorageLocation)
class StorageLocationAdmin(admin.ModelAdmin):
    list_display = [
        'indented_name',
        'code',
        'location_type',
        'warehouse',
        'active_status',
        'pickable_status',
        'capacity_summary'
    ]
    
    list_filter = [
        'warehouse',
        'location_type',
        'is_active',
        'is_pickable',
        'is_receivable',
        'created_at'
    ]
    
    search_fields = ['code', 'name', 'barcode']
    
    readonly_fields = [
        'tenant',
        'depth',
        'location_path',
        'get_child_count',
        'created_at',
        'updated_at'
    ]
    
    fieldsets = [
        ('Basic Information', {
            'fields': ['warehouse', 'location_type', 'code', 'name', 'description']
        }),
        ('Hierarchy', {
            'fields': ['parent', 'depth', 'location_path', 'get_child_count']
        }),
        ('Identification', {
            'fields': ['barcode'],
            'classes': ['collapse']
        }),
        ('Capacity', {
            'fields': ['max_weight', 'max_volume', 'max_items', 'max_pallets', 'capacity_notes'],
            'classes': ['collapse']
        }),
        ('Operational Flags', {
            'fields': ['is_active', 'is_pickable', 'is_receivable']
        }),
        ('Metadata', {
            'fields': ['tenant', 'created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]
    
    actions = [
        'activate_locations',
        'deactivate_locations',
        'generate_barcodes',
        'export_hierarchy'
    ]
    
    date_hierarchy = 'created_at'
    ordering = ['warehouse', 'code']
    
    def indented_name(self, obj):
        """Display name with indentation based on depth."""
        indent = '&nbsp;&nbsp;&nbsp;&nbsp;' * obj.depth
        icon = self._get_type_icon(obj.location_type)
        return format_html(
            '{}{} {}',
            format_html(indent),
            icon,
            obj.name
        )
    indented_name.short_description = 'Location'
    
    def _get_type_icon(self, location_type):
        """Return icon for location type."""
        icons = {
            'zone': '📦',
            'aisle': '🛤',
            'rack': '🏗',
            'shelf': '📚',
            'bin': '📥'
        }
        return icons.get(location_type, '📍')
    
    def active_status(self, obj):
        """Display active status with color."""
        if obj.is_active:
            return format_html(
                '<span style="color: green;">●</span> Active'
            )
        return format_html(
            '<span style="color: red;">●</span> Inactive'
        )
    active_status.short_description = 'Status'
    
    def pickable_status(self, obj):
        """Display pickable status."""
        return '✓' if obj.is_pickable else '✗'
    pickable_status.short_description = 'Pickable'
    
    def capacity_summary(self, obj):
        """Display capacity summary."""
        parts = []
        if obj.max_items:
            parts.append(f"{obj.max_items} items")
        if obj.max_weight:
            parts.append(f"{obj.max_weight}kg")
        return ', '.join(parts) if parts else '-'
    capacity_summary.short_description = 'Capacity'
    
    # Custom Actions
    
    def activate_locations(self, request, queryset):
        """Activate selected locations."""
        updated = queryset.update(is_active=True)
        self.message_user(
            request,
            f"{updated} location(s) activated"
        )
    activate_locations.short_description = "Activate selected locations"
    
    def deactivate_locations(self, request, queryset):
        """Deactivate selected locations."""
        updated = queryset.update(is_active=False)
        self.message_user(
            request,
            f"{updated} location(s) deactivated"
        )
    deactivate_locations.short_description = "Deactivate selected locations"
    
    def generate_barcodes(self, request, queryset):
        """Generate barcodes for locations without them."""
        # Will be implemented with barcode generation service
        count = 0
        for location in queryset:
            if not location.barcode:
                # Generate barcode (implemented in Group C)
                count += 1
        
        self.message_user(
            request,
            f"Generated barcodes for {count} location(s)"
        )
    generate_barcodes.short_description = "Generate missing barcodes"
    
    def export_hierarchy(self, request, queryset):
        """Export hierarchy to CSV."""
        # Implement CSV export
        self.message_user(
            request,
            "Hierarchy export functionality will be implemented"
        )
    export_hierarchy.short_description = "Export hierarchy to CSV"
```

### Tree Display Rendering

For better visual hierarchy in admin:
```python
def get_queryset(self, request):
    """Order by hierarchy for tree display."""
    qs = super().get_queryset(request)
    return qs.select_related('warehouse', 'parent')

def get_list_display_links(self, request, list_display):
    """Make location name clickable."""
    return ['indented_name']
```

### Expected Outcome
Feature-rich admin interface with hierarchy visualization and bulk operations.

### Verification Checklist
- [ ] StorageLocationAdmin class created
- [ ] list_display with indentation
- [ ] list_filter configured
- [ ] search_fields defined
- [ ] fieldsets organized
- [ ] readonly_fields set
- [ ] Custom display methods added
- [ ] Bulk actions implemented
- [ ] Tree visualization works
- [ ] Icons/colors enhance usability

---

## Summary

These final six tasks completed the storage location hierarchy:

1. **depth property** returns 0-4 based on location type using LOCATION_DEPTH_MAP
2. **get_children() method** retrieves direct child locations with active filtering
3. **get_all_descendants() method** recursively returns entire subtree (Python or CTE)
4. **Location validation** enforces parent-type rules, prevents circular references
5. **Bulk location generator** creates hundreds of locations from patterns like "A{01-10}-R{01-05}"
6. **Django admin** with hierarchy visualization, indentation, filters, and bulk actions

### Group B Complete

All 18 tasks in Group B are now documented:
- ✓ Five-level location hierarchy (Zone → Aisle → Rack → Shelf → Bin)
- ✓ Self-referential parent FK with CASCADE
- ✓ Code, barcode, and capacity fields
- ✓ Operational flags (is_active, is_pickable, is_receivable)
- ✓ Custom manager with filtering methods
- ✓ location_path property showing full hierarchy
- ✓ depth property and navigation methods
- ✓ Comprehensive validation
- ✓ Bulk generation utility
- ✓ Feature-rich admin interface

### What's Next?

**→ Proceed to Group C:** [Location Barcodes & Scanning](../Group-C_Location-Barcodes-Scanning/)

Group C will implement barcode generation, scanning support, QR codes, label printing, and scan logging.
