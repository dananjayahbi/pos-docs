# Tasks 15-18: Constraint, Validation & Admin

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 08 - Warehouse & Locations  
> **Group:** A - Warehouse Model & Configuration  
> **Document:** 04 of 04  
> **Tasks Covered:** 15, 16, 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-11-14_Hours-Location-Manager.md](03_Tasks-11-14_Hours-Location-Manager.md)
- **→ Next Group:** [../Group-B_Storage-Location-Hierarchy/](../Group-B_Storage-Location-Hierarchy/)

---

## Document Overview

This document covers database constraint enforcement, default warehouse management, model validation, and Django admin configuration. These final tasks complete the warehouse model implementation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 15 | Create is_default constraint | Medium | 25 min |
| 16 | Add set_as_default method | Low | 20 min |
| 17 | Create warehouse validation | Low | 20 min |
| 18 | Create Warehouse admin | Medium | 25 min |

---

## Task 15: Create is_default Constraint

### Overview
Implement database-level constraint to ensure only one warehouse can be marked as default per tenant. This prevents data inconsistency and ensures reliable default warehouse lookup.

### Dependencies
- Task 10: Add is_default field
- Task 13: Create Warehouse Meta class

### Instructions

1. **Add constraint to Meta class**
   - Open `warehouse.py` model file
   - Locate Meta class

2. **Define UniqueConstraint**
   - Use models.UniqueConstraint
   - Fields: ["tenant", "is_default"]
   - Condition: Q(is_default=True)
   - Name: "unique_default_warehouse_per_tenant"

3. **Add constraint to Meta.constraints**
   - Create constraints list in Meta class
   - Add the unique constraint
   - Ensures database-level enforcement

4. **Document constraint behavior**
   - Add docstring explaining constraint
   - Note that only one is_default=True allowed per tenant
   - Multiple is_default=False entries are allowed

5. **Plan migration**
   - This change requires database migration
   - Migration will create unique partial index
   - Test migration on development environment first

6. **Handle existing data**
   - Before migration, ensure data consistency
   - Check for multiple default warehouses per tenant
   - Fix any violations before applying constraint

### Constraint Logic

The constraint ensures:
```python
# Allowed: Multiple warehouses with is_default=False
tenant_1: warehouse_a (is_default=False)
tenant_1: warehouse_b (is_default=False)

# Allowed: One warehouse with is_default=True
tenant_1: warehouse_c (is_default=True)

# NOT Allowed: Multiple warehouses with is_default=True
tenant_1: warehouse_a (is_default=True)  # ❌
tenant_1: warehouse_b (is_default=True)  # ❌ Constraint violation
```

### PostgreSQL Implementation

The constraint creates a partial unique index:
```sql
CREATE UNIQUE INDEX unique_default_warehouse_per_tenant
ON inventory_warehouses (tenant_id)
WHERE is_default = TRUE;
```

This allows:
- Multiple rows with is_default=False (not indexed)
- Only one row with is_default=True per tenant (indexed)

### Constraint vs Application Logic

**Database Constraint (This Task):**
- ✓ Prevents data corruption
- ✓ Works even with direct SQL
- ✓ Race condition protection
- ✓ Guaranteed data integrity

**Application Logic (Task 16):**
- ✓ User-friendly error messages
- ✓ Automatic old default unset
- ✓ Validation before save
- ✓ Transaction management

Both layers work together for robust enforcement.

### Testing Constraint

Test scenarios:
1. Create first default warehouse - should succeed
2. Create second default warehouse for same tenant - should fail
3. Create default warehouse for different tenant - should succeed
4. Update existing warehouse to is_default=True - should succeed if no other default
5. Concurrent updates to is_default - constraint prevents race conditions

### Expected Outcome
Database constraint preventing multiple default warehouses per tenant.

### Verification Checklist
- [ ] UniqueConstraint defined in Meta.constraints
- [ ] Constraint uses Q object for conditional uniqueness
- [ ] Constraint name is descriptive
- [ ] Documentation explains behavior
- [ ] Migration plan documented
- [ ] Test cases defined

---

## Task 16: Add set_as_default Method

### Overview
Create a model method to safely set a warehouse as default, automatically unsetting the previous default. This method handles the transaction and provides user-friendly interface.

### Dependencies
- Task 10: Add is_default field
- Task 15: Create is_default constraint

### Instructions

1. **Create set_as_default method**
   - Add to Warehouse model
   - Instance method (not class method)
   - No parameters needed

2. **Add status validation**
   - Check if warehouse status is ACTIVE
   - Raise ValidationError if not active
   - Message: "Only active warehouses can be set as default"

3. **Find current default warehouse**
   - Query for existing default in same tenant
   - Use get_default() manager method
   - Handle case where no default exists

4. **Use database transaction**
   - Import transaction from django.db
   - Wrap update operations in atomic transaction
   - Ensures both updates succeed or both fail

5. **Unset old default**
   - If old default exists and is not current instance
   - Set old_default.is_default = False
   - Save old default

6. **Set new default**
   - Set self.is_default = True
   - Save current instance

7. **Add signal or notification**
   - Consider emitting signal after default change
   - Useful for audit logging
   - Cache invalidation if needed

8. **Return confirmation**
   - Return True on success
   - Include log message

### Implementation Pattern

```python
@transaction.atomic
def set_as_default(self):
    """
    Set this warehouse as the default for its tenant.
    Automatically unsets the previous default warehouse.
    """
    # Validation
    if self.status != WAREHOUSE_STATUS_ACTIVE:
        raise ValidationError("Only active warehouses can be set as default")
    
    # Find and unset old default
    try:
        old_default = Warehouse.objects.get_default()
        if old_default.id != self.id:
            old_default.is_default = False
            old_default.save(update_fields=['is_default'])
    except Warehouse.DoesNotExist:
        pass  # No existing default
    
    # Set new default
    self.is_default = True
    self.save(update_fields=['is_default'])
    
    return True
```

### Transaction Safety

The transaction ensures:
- Both updates complete successfully, or neither does
- No intermediate state where two warehouses are default
- No state where no warehouse is default (if one existed)
- Protection against concurrent modifications

### Usage Examples

```python
# Set warehouse as default
warehouse = Warehouse.objects.get(code='WH-CMB-01')
warehouse.set_as_default()

# Try to set inactive warehouse as default
inactive_warehouse = Warehouse.objects.get(code='WH-INACTIVE')
try:
    inactive_warehouse.set_as_default()
except ValidationError as e:
    print(e)  # "Only active warehouses can be set as default"
```

### Error Scenarios

Handle these cases:
1. **Warehouse is INACTIVE:** Raise ValidationError
2. **Warehouse is in MAINTENANCE:** Allow or deny based on business rules
3. **Warehouse already is default:** No-op, return True
4. **Database constraint violation:** Should not happen with transaction, but handle gracefully

### Expected Outcome
Safe method to change default warehouse with automatic cleanup.

### Verification Checklist
- [ ] set_as_default() method created
- [ ] Status validation implemented
- [ ] Old default warehouse unset
- [ ] Wrapped in transaction
- [ ] Returns success indicator
- [ ] Error handling for edge cases
- [ ] Docstring explains behavior

---

## Task 17: Create Warehouse Validation

### Overview
Implement model-level validation using Django's clean() method. Validation ensures data integrity before saving and provides user-friendly error messages.

### Dependencies
- Task 06: Add warehouse address fields
- Task 08: Add warehouse contact fields
- Task 11: Add operating hours fields
- Task 12: Add warehouse coordinates

### Instructions

1. **Create clean method**
   - Override model's clean() method
   - Call super().clean() first
   - Accumulate validation errors

2. **Validate operating hours**
   - If opens_at is set, closes_at must be set
   - closes_at must be after opens_at
   - If is_24_hours=True, ignore opens_at/closes_at
   - Raise ValidationError with field-specific errors

3. **Validate coordinates**
   - If latitude is set, longitude must be set (and vice versa)
   - Both must be None or both must have values
   - Latitude range: -90 to 90
   - Longitude range: -180 to 180
   - For Sri Lanka: lat ~6-10, lng ~79-82

4. **Validate phone format**
   - Must start with +94
   - Must have exactly 9 digits after +94
   - Remove spaces/hyphens before validation
   - Standardize format on save

5. **Validate postal code**
   - If provided, must be 5 digits
   - Sri Lankan format: 00000-99999
   - Optional field

6. **Validate warehouse code**
   - Must be alphanumeric with hyphens only
   - Recommended format: WH-{CITY}-{NUMBER}
   - Convert to uppercase
   - Check uniqueness within tenant (already handled by constraint)

7. **Validate breaks**
   - If breaks_start set, breaks_end must be set
   - breaks_end must be after breaks_start
   - Breaks must be within operating hours

8. **Cross-field validation**
   - Cannot set is_default=True if status=INACTIVE
   - Main warehouse should have coordinates for mapping

### Validation Error Messages

Use clear, actionable error messages:
```python
errors = {}

if self.opens_at and not self.closes_at:
    errors['closes_at'] = "Closing time is required when opening time is set"

if self.latitude and not self.longitude:
    errors['longitude'] = "Longitude is required when latitude is set"

if errors:
    raise ValidationError(errors)
```

### Clean Method Pattern

```python
def clean(self):
    """
    Perform model validation.
    """
    super().clean()
    errors = {}
    
    # Operating hours validation
    if not self.is_24_hours:
        if self.opens_at and not self.closes_at:
            errors['closes_at'] = "Required when opening time is set"
        elif self.closes_at and not self.opens_at:
            errors['opens_at'] = "Required when closing time is set"
        elif self.opens_at and self.closes_at:
            if self.closes_at <= self.opens_at:
                errors['closes_at'] = "Must be after opening time"
    
    # Coordinates validation
    if bool(self.latitude) != bool(self.longitude):
        errors['coordinates'] = "Both latitude and longitude must be set together"
    
    # Phone validation
    if self.phone:
        cleaned_phone = re.sub(r'[\s\-]', '', self.phone)
        if not cleaned_phone.startswith('+94') or len(cleaned_phone) != 12:
            errors['phone'] = "Invalid format. Use: +94 XX XXX XXXX"
    
    if errors:
        raise ValidationError(errors)
```

### Validation Timing

- **clean():** Called by ModelForm.is_valid() and model.full_clean()
- **save():** Not automatically called during save()
- **Admin:** Automatically calls clean() before save
- **API:** DRF serializers should call model.full_clean()

### Expected Outcome
Comprehensive validation preventing invalid warehouse data.

### Verification Checklist
- [ ] clean() method overridden
- [ ] Operating hours validation
- [ ] Coordinates validation
- [ ] Phone format validation
- [ ] Postal code validation
- [ ] Cross-field validation
- [ ] Error messages are user-friendly
- [ ] super().clean() called first

---

## Task 18: Create Warehouse Admin

### Overview
Configure Django admin interface for warehouse management. The admin provides a user-friendly interface for staff to manage warehouses without writing code.

### Dependencies
- All previous tasks in Group A
- Warehouse model complete

### Instructions

1. **Create admin.py file**
   - Create `admin.py` in `warehouses/` directory
   - Import admin and models

2. **Create WarehouseAdmin class**
   - Inherit from admin.ModelAdmin
   - Register with @admin.register(Warehouse)

3. **Configure list display**
   - list_display: name, code, warehouse_type, district, status, is_default
   - Show key fields in list view
   - Make clickable for detail view

4. **Add list filters**
   - list_filter: status, warehouse_type, district, is_default
   - Enable sidebar filtering
   - Improve navigation for many warehouses

5. **Configure search fields**
   - search_fields: name, code, city, address_line_1
   - Enable search box
   - Use __icontains lookup

6. **Set ordering**
   - ordering: ["name"]
   - Default alphabetical sort

7. **Define fieldsets**
   - Group fields logically:
     - Basic Information: name, code, warehouse_type, status
     - Address: address_line_1, address_line_2, city, district, postal_code
     - Contact: phone, email, manager_name
     - Operating Hours: is_24_hours, opens_at, closes_at, breaks_start, breaks_end
     - Location: latitude, longitude
     - Configuration: is_default
     - Metadata: tenant, created_at, updated_at (read-only)

8. **Add readonly fields**
   - readonly_fields: created_at, updated_at, tenant
   - Prevent modification of system fields
   - Show for information only

9. **Configure filters**
   - Add filter for created_at (date hierarchy)
   - date_hierarchy = "created_at"

10. **Add custom actions**
    - Create "Set as default" bulk action
    - Create "Activate warehouse" action
    - Create "Deactivate warehouse" action

11. **Add inline displays (future)**
    - Placeholder for StorageLocation inline
    - Will be added after location model created

12. **Customize form**
    - Add help text for complex fields
    - Use widgets for better UX
    - Consider map widget for coordinates

### Admin Configuration Example

```python
@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ['name', 'code', 'warehouse_type', 'district', 'status', 'is_default']
    list_filter = ['status', 'warehouse_type', 'district', 'is_default']
    search_fields = ['name', 'code', 'city', 'address_line_1']
    ordering = ['name']
    date_hierarchy = 'created_at'
    
    readonly_fields = ['tenant', 'created_at', 'updated_at']
    
    fieldsets = [
        ('Basic Information', {
            'fields': ['name', 'code', 'warehouse_type', 'status']
        }),
        ('Address', {
            'fields': ['address_line_1', 'address_line_2', 'city', 'district', 'postal_code']
        }),
        ('Contact Information', {
            'fields': ['phone', 'email', 'manager_name']
        }),
        ('Operating Hours', {
            'fields': ['is_24_hours', 'opens_at', 'closes_at', 'breaks_start', 'breaks_end']
        }),
        ('Location', {
            'fields': ['latitude', 'longitude'],
            'classes': ['collapse']
        }),
        ('Configuration', {
            'fields': ['is_default']
        }),
        ('Metadata', {
            'fields': ['tenant', 'created_at', 'updated_at'],
            'classes': ['collapse']
        })
    ]
    
    actions = ['set_as_default', 'activate_warehouses', 'deactivate_warehouses']
    
    def set_as_default(self, request, queryset):
        """Set selected warehouse as default"""
        if queryset.count() != 1:
            self.message_user(request, "Please select exactly one warehouse", level='ERROR')
            return
        
        warehouse = queryset.first()
        try:
            warehouse.set_as_default()
            self.message_user(request, f"{warehouse.name} set as default")
        except ValidationError as e:
            self.message_user(request, str(e), level='ERROR')
    
    set_as_default.short_description = "Set as default warehouse"
```

### Custom Admin Actions

**Set as Default:**
- Applies to single warehouse only
- Calls set_as_default() method
- Shows success/error message

**Activate Warehouses:**
- Bulk action
- Sets status to ACTIVE
- Updates multiple warehouses

**Deactivate Warehouses:**
- Bulk action
- Sets status to INACTIVE
- Prevents if warehouse is default

### Admin Permissions

Configure who can access admin:
- View: All staff users
- Add: Warehouse managers
- Change: Warehouse managers
- Delete: Superusers only (prevent accidental deletion)

### Expected Outcome
```
backend/apps/inventory/warehouses/
└── admin.py (NEW - complete admin configuration)
```

### Verification Checklist
- [ ] WarehouseAdmin class created
- [ ] list_display configured
- [ ] list_filter added
- [ ] search_fields defined
- [ ] fieldsets organized logically
- [ ] readonly_fields set
- [ ] Custom actions implemented
- [ ] Registered with admin site
- [ ] Permissions considered

---

## Summary

These final four tasks completed the warehouse model:

1. **is_default constraint** ensures only one default warehouse per tenant with database-level enforcement
2. **set_as_default method** provides safe interface to change default warehouse with transaction protection
3. **Warehouse validation** implements clean() method with comprehensive field validation
4. **Django admin** provides user-friendly interface with list views, filters, search, and custom actions

### Group A Complete

All 18 tasks in Group A are now documented:
- ✓ Inventory app structure created
- ✓ Warehouse submodule initialized
- ✓ Status and type constants defined
- ✓ Warehouse model with all fields
- ✓ Sri Lankan address and contact fields
- ✓ Operating hours and GPS coordinates
- ✓ Custom manager with query methods
- ✓ Database constraint enforcement
- ✓ Model validation and admin interface

### What's Next?

**→ Proceed to Group B:** [Storage Location Hierarchy](../Group-B_Storage-Location-Hierarchy/)

Group B will implement hierarchical storage locations within warehouses (Zone → Aisle → Rack → Shelf → Bin).
