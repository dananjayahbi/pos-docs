# Tasks 23-28: Manager, Migration & Export

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** B - AttributeGroup Model  
> **Document:** 02 of 02  
> **Tasks Covered:** 23, 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-22_AttributeGroup-Model-Fields.md](01_Tasks-15-22_AttributeGroup-Model-Fields.md)
- **→ Next Group:** [../Group-C_Attribute-Model/](../Group-C_Attribute-Model/)

---

## Document Overview

This document covers the completion of the AttributeGroup model by adding Meta class configuration, custom manager with query optimization methods, model export, and migration generation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 23 | Add Meta Class | Low |
| 24 | Create GroupManager | Medium |
| 25 | Add active Method | Low |
| 26 | Add with_attributes Method | Medium |
| 27 | Export AttributeGroup | Low |
| 28 | Create Initial Migration | Low |

---

## Task 23: Add Meta Class

### Overview
Add a Meta class to configure model-level options including ordering, verbose names, and database constraints.

### Dependencies
- Task 22: Add __str__ Method

### Instructions

1. **Create Meta inner class**
   - Add nested Meta class inside AttributeGroup
   - Configure model-level options
   - Set ordering, verbose names, and constraints

2. **Set ordering**
   - Primary: display_order (ascending)
   - Secondary: name (ascending, alphabetical)
   - Ensures consistent ordering across queries

3. **Set verbose_name and verbose_name_plural**
   - verbose_name: "Attribute Group"
   - verbose_name_plural: "Attribute Groups"
   - Used in Django admin interface

4. **Add db_table (optional)**
   - Explicitly name the table if needed
   - Format: attributes_attributegroup
   - Django generates this by default

5. **Add indexes**
   - Composite index on (is_active, display_order)
   - Optimizes common filtered + ordered queries
   - Improves API performance

6. **Add unique_together or constraints**
   - Slug should be unique within tenant
   - Use UniqueConstraint with condition
   - Name should be unique within tenant

### Meta Class Configuration

| Option | Value | Purpose |
|--------|-------|---------|
| **ordering** | `['display_order', 'name']` | Default sort order |
| **verbose_name** | `'Attribute Group'` | Admin singular name |
| **verbose_name_plural** | `'Attribute Groups'` | Admin plural name |
| **indexes** | Composite index | Query optimization |
| **constraints** | Unique slug per tenant | Data integrity |

### Ordering Strategy

Default ordering ensures:
- Groups appear in logical order (by display_order)
- Groups with same display_order sort alphabetically
- Consistent order in admin, API, and UI
- No need to specify order_by() in most queries

### Unique Constraints

**Slug Uniqueness:**
- Slug must be unique within tenant
- Different tenants can have same slug
- Use unique constraint on (tenant, slug) if tenant field exists
- Otherwise rely on application-level validation

**Name Uniqueness:**
- Consider making name unique within tenant
- Prevents duplicate group names
- Improves data quality
- Can be enforced or just validated

### Index Strategy

**Single Indexes (from field definitions):**
- name (db_index=True)
- slug (db_index=True)
- display_order (db_index=True)
- is_active (db_index=True)

**Composite Indexes:**
- (is_active, display_order) - Most common query pattern
- (slug,) - Already indexed via SlugField

### Expected Meta Structure
```python
class Meta:
    ordering = ['display_order', 'name']
    verbose_name = 'Attribute Group'
    verbose_name_plural = 'Attribute Groups'
    indexes = [
        models.Index(fields=['is_active', 'display_order']),
    ]
```

### Multi-Tenant Considerations

If using django-tenants with automatic tenant filtering:
- Tenant field added by TenantMixin or BaseModel
- Unique constraints include tenant field
- Indexes may include tenant field

### Expected Outcome
```python
class AttributeGroup(BaseModel):
    # ... fields ...
    
    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Attribute Group'
        verbose_name_plural = 'Attribute Groups'
```

### Verification Checklist
- [ ] Meta class added inside model
- [ ] ordering set to ['display_order', 'name']
- [ ] verbose_name set appropriately
- [ ] verbose_name_plural set appropriately
- [ ] indexes configured for optimization
- [ ] unique constraints considered

---

## Task 24: Create GroupManager

### Overview
Create a custom manager class to provide convenient query methods for AttributeGroup filtering and optimization.

### Dependencies
- Task 23: Add Meta Class

### Instructions

1. **Create GroupQuerySet class**
   - Inherit from models.QuerySet
   - Add custom query methods
   - Place above AttributeGroup class

2. **Create GroupManager class**
   - Inherit from models.Manager
   - Override get_queryset() to return GroupQuerySet
   - Enables chaining of custom methods

3. **Attach manager to model**
   - Set `objects = GroupManager()` in AttributeGroup
   - Replaces default manager
   - All queries use custom manager

4. **Document manager pattern**
   - QuerySet defines chainable methods
   - Manager provides initial queryset
   - Enables: `AttributeGroup.objects.active().with_attributes()`

### Manager Pattern Structure

| Component | Purpose |
|-----------|---------|
| **QuerySet** | Defines custom filter methods |
| **Manager** | Provides QuerySet instance |
| **Model.objects** | Entry point for queries |

### QuerySet vs Manager

**QuerySet Methods:**
- Chainable with other QuerySet methods
- Return QuerySet instances
- Can be combined: `.active().with_attributes()`

**Manager Methods:**
- Start point for queries
- Return QuerySet
- Can include non-QuerySet methods (like bulk operations)

### Custom Manager Benefits

**Code Reusability:**
- Centralize common query logic
- Avoid repeating filter conditions
- Consistent query patterns

**Performance:**
- Optimize with prefetch/select_related
- Reduce N+1 query problems
- Consistent optimization across codebase

**Readability:**
- Semantic method names: `active()` vs `filter(is_active=True)`
- Self-documenting queries
- Easier to maintain

### Expected Structure
```python
class GroupQuerySet(models.QuerySet):
    """Custom QuerySet for AttributeGroup"""
    # Methods added in tasks 25-26
    pass

class GroupManager(models.Manager):
    """Custom manager for AttributeGroup"""
    def get_queryset(self):
        return GroupQuerySet(self.model, using=self._db)

class AttributeGroup(BaseModel):
    # ... fields ...
    
    objects = GroupManager()
    
    # ... methods ...
```

### Verification Checklist
- [ ] GroupQuerySet class created
- [ ] Inherits from models.QuerySet
- [ ] GroupManager class created
- [ ] Inherits from models.Manager
- [ ] get_queryset() returns GroupQuerySet
- [ ] objects = GroupManager() set in model

---

## Task 25: Add active Method

### Overview
Add an `active()` method to the GroupQuerySet that filters for active attribute groups.

### Dependencies
- Task 24: Create GroupManager

### Instructions

1. **Add active() method to GroupQuerySet**
   - Return filtered queryset: `filter(is_active=True)`
   - Method is chainable
   - Add docstring explaining purpose

2. **Method signature**
   - No parameters needed
   - Returns self (QuerySet) for chaining
   - Filters current queryset

3. **Usage examples**
   - `AttributeGroup.objects.active()` - All active groups
   - `AttributeGroup.objects.active().order_by('name')` - Chainable
   - `group.attributes.active()` - If used in related manager

4. **Document filtering behavior**
   - Filters is_active=True
   - Excludes inactive groups
   - Maintains other filters

### Method Implementation
```python
class GroupQuerySet(models.QuerySet):
    def active(self):
        """Return only active attribute groups"""
        return self.filter(is_active=True)
```

### Usage Patterns

**Basic Usage:**
```python
# Get all active groups
active_groups = AttributeGroup.objects.active()

# Get active groups ordered by name
active_groups = AttributeGroup.objects.active().order_by('name')

# Chain with other filters
tech_groups = AttributeGroup.objects.active().filter(name__icontains='technical')
```

**In Views:**
```python
# List active groups
def list_groups(request):
    groups = AttributeGroup.objects.active()
    return render(request, 'groups.html', {'groups': groups})
```

**In Serializers:**
```python
class AttributeSerializer(serializers.ModelSerializer):
    def get_queryset(self):
        return AttributeGroup.objects.active()
```

### Filter vs Manager Method

| Approach | Code |
|----------|------|
| **Direct Filter** | `AttributeGroup.objects.filter(is_active=True)` |
| **Manager Method** | `AttributeGroup.objects.active()` |

Manager method advantages:
- Shorter, more readable
- Semantic naming
- Centralized logic
- Easier to modify filtering logic later

### Expected Outcome
- active() method in GroupQuerySet
- Returns filtered queryset
- Chainable with other methods

### Verification Checklist
- [ ] active() method added to GroupQuerySet
- [ ] Returns self.filter(is_active=True)
- [ ] Method is chainable
- [ ] Docstring explains purpose

---

## Task 26: Add with_attributes Method

### Overview
Add a `with_attributes()` method that uses prefetch_related to optimize loading of related attributes.

### Dependencies
- Task 25: Add active Method

### Instructions

1. **Add with_attributes() method to GroupQuerySet**
   - Use prefetch_related('attributes')
   - Optimizes loading of related Attribute objects
   - Prevents N+1 query problem

2. **Configure prefetch**
   - Prefetch related attributes
   - Can optionally filter prefetched attributes
   - Use Prefetch object for advanced cases

3. **Document optimization**
   - Reduces database queries
   - Loads attributes in single query
   - Essential for list views

4. **Consider active-only option**
   - Could accept parameter to filter active attributes
   - For now, prefetch all attributes
   - Can enhance in future

### Method Implementation
```python
class GroupQuerySet(models.QuerySet):
    def active(self):
        """Return only active attribute groups"""
        return self.filter(is_active=True)
    
    def with_attributes(self):
        """Prefetch related attributes for performance"""
        return self.prefetch_related('attributes')
```

### N+1 Query Problem

**Without prefetch:**
```python
groups = AttributeGroup.objects.active()  # 1 query
for group in groups:
    attrs = group.attributes.all()  # N queries (one per group)
```
Total: 1 + N queries

**With prefetch:**
```python
groups = AttributeGroup.objects.active().with_attributes()  # 2 queries
for group in groups:
    attrs = group.attributes.all()  # No additional queries
```
Total: 2 queries (fixed)

### Usage Patterns

**List View with Attributes:**
```python
# Efficient loading
groups = AttributeGroup.objects.active().with_attributes()
for group in groups:
    print(f"{group.name}: {group.attributes.count()} attributes")
# Only 2 database queries total
```

**API Endpoint:**
```python
# Nested serializer
class GroupViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        return AttributeGroup.objects.active().with_attributes()
```

**Template Rendering:**
```html
{% for group in groups %}
  <h3>{{ group.name }}</h3>
  <ul>
    {% for attribute in group.attributes.all %}
      <li>{{ attribute.name }}</li>
    {% endfor %}
  </ul>
{% endfor %}
```

### Advanced Prefetch

Future enhancement with filtered prefetch:
```python
def with_active_attributes(self):
    from django.db.models import Prefetch
    from .attribute import Attribute
    
    return self.prefetch_related(
        Prefetch(
            'attributes',
            queryset=Attribute.objects.filter(is_active=True)
        )
    )
```

### Performance Impact

| Scenario | Without Prefetch | With Prefetch | Improvement |
|----------|------------------|---------------|-------------|
| **10 groups, 5 attrs each** | 11 queries | 2 queries | 81% reduction |
| **50 groups, 10 attrs each** | 51 queries | 2 queries | 96% reduction |
| **100 groups, 20 attrs each** | 101 queries | 2 queries | 98% reduction |

### Expected Outcome
- with_attributes() method in GroupQuerySet
- Uses prefetch_related
- Chainable with other methods

### Verification Checklist
- [ ] with_attributes() method added
- [ ] Uses prefetch_related('attributes')
- [ ] Method is chainable
- [ ] Docstring explains optimization
- [ ] Can chain with active(): `.active().with_attributes()`

---

## Task 27: Export AttributeGroup

### Overview
Export the AttributeGroup model from the models module for easy importing.

### Dependencies
- Task 26: Add with_attributes Method

### Instructions

1. **Open models/__init__.py**
   - Edit `backend/apps/attributes/models/__init__.py`
   - Add import and export statements

2. **Import AttributeGroup**
   - Import from .attribute_group module
   - Use relative import: `from .attribute_group import AttributeGroup`

3. **Add to __all__**
   - Create or update __all__ list
   - Include 'AttributeGroup'
   - Controls what's exported from package

4. **Verify import pattern**
   - Enables: `from apps.attributes.models import AttributeGroup`
   - Instead of: `from apps.attributes.models.attribute_group import AttributeGroup`
   - Cleaner and more maintainable

### Export Pattern

```python
# backend/apps/attributes/models/__init__.py

from .attribute_group import AttributeGroup

__all__ = [
    'AttributeGroup',
]
```

### Import Usage

**In other modules:**
```python
# Serializers
from apps.attributes.models import AttributeGroup

# Views
from apps.attributes.models import AttributeGroup

# Admin
from apps.attributes.models import AttributeGroup
```

### __all__ Purpose

| Aspect | Effect |
|--------|--------|
| **from models import \*** | Imports only items in __all__ |
| **IDE autocomplete** | Shows available exports |
| **Documentation** | Clear public API |
| **Maintainability** | Explicit exports |

### Future Model Additions

As new models are added:
```python
from .attribute_group import AttributeGroup
from .attribute import Attribute
from .attribute_option import AttributeOption

__all__ = [
    'AttributeGroup',
    'Attribute',
    'AttributeOption',
]
```

### Expected Outcome
```
backend/apps/attributes/models/
├── __init__.py              # Updated with export
└── attribute_group.py       # AttributeGroup model
```

### Verification Checklist
- [ ] models/__init__.py updated
- [ ] AttributeGroup imported from .attribute_group
- [ ] __all__ list includes 'AttributeGroup'
- [ ] Import works: `from apps.attributes.models import AttributeGroup`

---

## Task 28: Create Initial Migration

### Overview
Generate the initial database migration for the AttributeGroup model.

### Dependencies
- Task 27: Export AttributeGroup

### Instructions

1. **Run makemigrations command**
   - Execute: `python manage.py makemigrations attributes`
   - Django generates migration file
   - Migration includes AttributeGroup table creation

2. **Review migration file**
   - Check generated migration in `attributes/migrations/`
   - Verify all fields present
   - Confirm indexes and constraints

3. **Name migration appropriately**
   - Django auto-generates name
   - Format: `0001_initial.py`
   - Descriptive name based on changes

4. **Do not run migration yet**
   - Only generate migration file
   - Migration will be run after all models created
   - Ensures consistent schema

5. **Verify migration contents**
   - Check field types match model
   - Verify indexes created
   - Confirm constraints applied

### Migration Generation

**Command:**
```bash
python manage.py makemigrations attributes
```

**Expected output:**
```
Migrations for 'attributes':
  attributes/migrations/0001_initial.py
    - Create model AttributeGroup
```

### Migration File Structure

```python
# attributes/migrations/0001_initial.py
class Migration(migrations.Migration):
    initial = True
    
    dependencies = [
        ('core', '0001_initial'),  # BaseModel dependency
    ]
    
    operations = [
        migrations.CreateModel(
            name='AttributeGroup',
            fields=[
                # BaseModel fields
                # AttributeGroup fields
            ],
            options={
                'ordering': ['display_order', 'name'],
                'verbose_name': 'Attribute Group',
                'verbose_name_plural': 'Attribute Groups',
            },
        ),
        # Indexes
        # Constraints
    ]
```

### Migration Verification

| Check | What to Verify |
|-------|----------------|
| **Fields** | All fields present with correct types |
| **Options** | Meta options (ordering, verbose_name) |
| **Indexes** | Composite indexes created |
| **Constraints** | Unique constraints applied |
| **Dependencies** | Correct dependencies listed |

### Multi-Tenant Migration

- Migration runs in tenant schemas (TENANT_APPS)
- Each tenant gets own AttributeGroup table
- Shared migration file, per-tenant execution
- Use: `python manage.py migrate_schemas` (django-tenants)

### When to Run Migration

**Not yet - Wait until:**
- All attribute models created (Attribute, AttributeOption)
- All migrations generated
- Ready to set up complete schema

**Run migrations together:**
```bash
# After all models are ready
python manage.py migrate_schemas --shared
python manage.py migrate_schemas
```

### Expected Outcome
```
backend/apps/attributes/migrations/
├── __init__.py
└── 0001_initial.py          # Generated migration
```

### Verification Checklist
- [ ] Migration file generated
- [ ] Named 0001_initial.py
- [ ] All fields present in migration
- [ ] Meta options included
- [ ] Indexes created
- [ ] Dependencies correct
- [ ] Migration NOT run yet

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 23 | Add Meta Class | Model configuration and ordering |
| 24 | Create GroupManager | Custom manager infrastructure |
| 25 | Add active Method | Filter for active groups |
| 26 | Add with_attributes Method | Prefetch optimization |
| 27 | Export AttributeGroup | Model export from package |
| 28 | Create Initial Migration | Database migration file |

### Complete AttributeGroup Model
```python
class GroupQuerySet(models.QuerySet):
    def active(self):
        return self.filter(is_active=True)
    
    def with_attributes(self):
        return self.prefetch_related('attributes')

class GroupManager(models.Manager):
    def get_queryset(self):
        return GroupQuerySet(self.model, using=self._db)

class AttributeGroup(BaseModel):
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, blank=True)
    description = models.TextField(blank=True, null=True)
    display_order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    objects = GroupManager()
    
    class Meta:
        ordering = ['display_order', 'name']
        verbose_name = 'Attribute Group'
        verbose_name_plural = 'Attribute Groups'
    
    def __str__(self):
        return self.name
```

### Manager Usage Examples

```python
# Get all active groups
AttributeGroup.objects.active()

# Get active groups with prefetched attributes
AttributeGroup.objects.active().with_attributes()

# Chain with additional filters
AttributeGroup.objects.active().filter(name__icontains='tech')

# Order differently
AttributeGroup.objects.active().order_by('name')
```

### File Structure After Group B
```
backend/apps/attributes/
├── __init__.py
├── apps.py
├── constants.py
├── models/
│   ├── __init__.py          # Exports AttributeGroup
│   └── attribute_group.py   # Complete model
└── migrations/
    ├── __init__.py
    └── 0001_initial.py      # Generated migration
```

### Group B Complete

All 14 tasks in Group B are now complete (Tasks 15-28):
- ✅ AttributeGroup model created with all fields
- ✅ Custom manager with active() and with_attributes() methods
- ✅ Meta class with ordering and configuration
- ✅ Model exported from models module
- ✅ Initial migration generated

### Next Steps
1. Proceed to [../Group-C_Attribute-Model/](../Group-C_Attribute-Model/) to create the Attribute model
2. Attribute model will reference AttributeGroup via ForeignKey
3. Attribute model will have type field using constants from Group A

---

## Notes for AI Agents

1. **Manager Pattern:** QuerySet for chainable methods, Manager for initialization
2. **Prefetch:** Essential for avoiding N+1 queries
3. **Migration:** Generated but not run yet
4. **Export Pattern:** Clean imports from models package
5. **Meta Ordering:** Default ordering improves consistency
6. **Active Filter:** Use active() method, not direct filter
7. **No Code:** Instructions only, no actual code generation
8. **Multi-Tenant:** Model stored in tenant schemas, migration runs per tenant
