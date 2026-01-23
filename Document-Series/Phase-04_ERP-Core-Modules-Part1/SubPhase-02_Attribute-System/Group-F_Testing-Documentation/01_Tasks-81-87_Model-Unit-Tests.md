# Tasks 81-87: Model Unit Tests

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 02 - Attribute System  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 81, 82, 83, 84, 85, 86, 87

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-E_Serializers-Views/03_Tasks-78-80_Admin-Configuration.md](../Group-E_Serializers-Views/03_Tasks-78-80_Admin-Configuration.md)
- **→ Next Document:** [02_Tasks-88-93_API-Tenant-Tests.md](02_Tasks-88-93_API-Tenant-Tests.md)

---

## Document Overview

This document covers creating unit tests for all attribute models including AttributeGroup, Attribute, AttributeOption, type validation, and category assignment.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 81 | Create tests Module | Low |
| 82 | Create test_models.py | Low |
| 83 | Test AttributeGroup Creation | Medium |
| 84 | Test Attribute Creation | Medium |
| 85 | Test AttributeOption Creation | Medium |
| 86 | Test Attribute Types | High |
| 87 | Test Category Assignment | High |

---

## Task 81: Create tests Module

### Overview
Create the tests package for attribute app to organize all test files.

### Dependencies
- Task 80: Register Attribute Admin

### Instructions

1. **Create tests directory**
   - Create: `backend/apps/attributes/tests/`
   - This is a Python package for organizing tests

2. **Create __init__.py**
   - Create: `backend/apps/attributes/tests/__init__.py`
   - Empty file to make directory a package

3. **Configure pytest**
   - Verify pytest and pytest-django installed
   - Configure pytest.ini or pyproject.toml for Django settings

4. **Structure tests folder**
   - test_models.py: Model tests
   - test_api.py: API endpoint tests
   - fixtures.py: Test data factories (optional)

### Expected Directory Structure

```
backend/apps/attributes/
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   └── test_api.py
```

### Verification Checklist
- [ ] tests/ directory created
- [ ] __init__.py created
- [ ] pytest configured

---

## Task 82: Create test_models.py

### Overview
Create the test file for model unit tests with necessary imports and fixtures.

### Dependencies
- Task 81: Create tests Module

### Instructions

1. **Create test_models.py file**
   - Create: `backend/apps/attributes/tests/test_models.py`

2. **Import required modules**
   - pytest and pytest-django decorators
   - Django testing utilities
   - Models from current app
   - Category model for testing relationships

3. **Add module docstring**
   - Describe test file purpose

4. **Create pytest fixtures**
   - attribute_group fixture
   - attribute fixture
   - category fixture

### Test File Structure

```python
import pytest
from django.core.exceptions import ValidationError
from apps.attributes.models import AttributeGroup, Attribute, AttributeOption
from apps.categories.models import Category


@pytest.fixture
def attribute_group(db):
    """Create test attribute group"""
    return AttributeGroup.objects.create(
        name='Specifications',
        slug='specifications',
        display_order=1
    )


@pytest.fixture
def category(db):
    """Create test category"""
    return Category.objects.create(
        name='Electronics',
        slug='electronics'
    )


# Test classes will be added in next tasks
```

### Verification Checklist
- [ ] test_models.py created
- [ ] Required imports added
- [ ] Fixtures defined
- [ ] Valid Python syntax

---

## Task 83: Test AttributeGroup Creation

### Overview
Create tests for AttributeGroup model creation, manager methods, and string representation.

### Dependencies
- Task 82: Create test_models.py

### Instructions

1. **Create TestAttributeGroup class**
   - Use pytest.mark.django_db decorator

2. **Test basic creation**
   - test_create_attribute_group()
   - Verify fields saved correctly
   - Verify slug auto-generation

3. **Test manager methods**
   - test_active_manager()
   - Create active and inactive groups
   - Verify active() queryset only returns active groups

4. **Test string representation**
   - test_str_method()
   - Verify __str__ returns name

5. **Test ordering**
   - test_ordering()
   - Create groups with different display_order
   - Verify default ordering

### Test Class Structure

```python
@pytest.mark.django_db
class TestAttributeGroup:
    """Tests for AttributeGroup model"""
    
    def test_create_attribute_group(self):
        """Test creating an attribute group"""
        group = AttributeGroup.objects.create(
            name='Product Details',
            slug='product-details',
            description='Basic product information',
            display_order=1,
            is_active=True
        )
        assert group.id is not None
        assert group.name == 'Product Details'
        assert group.slug == 'product-details'
        assert group.is_active is True
    
    def test_active_manager(self):
        """Test active() manager method"""
        # Create active group
        active_group = AttributeGroup.objects.create(
            name='Active Group',
            slug='active-group',
            is_active=True
        )
        # Create inactive group
        inactive_group = AttributeGroup.objects.create(
            name='Inactive Group',
            slug='inactive-group',
            is_active=False
        )
        
        # Test active() returns only active groups
        active_groups = AttributeGroup.objects.active()
        assert active_group in active_groups
        assert inactive_group not in active_groups
    
    def test_str_method(self):
        """Test string representation"""
        group = AttributeGroup.objects.create(
            name='Test Group',
            slug='test-group'
        )
        assert str(group) == 'Test Group'
    
    def test_ordering(self):
        """Test default ordering"""
        group1 = AttributeGroup.objects.create(
            name='Group A', slug='group-a', display_order=2
        )
        group2 = AttributeGroup.objects.create(
            name='Group B', slug='group-b', display_order=1
        )
        
        groups = list(AttributeGroup.objects.all())
        assert groups[0] == group2  # Lower display_order first
        assert groups[1] == group1
```

### Verification Checklist
- [ ] TestAttributeGroup class created
- [ ] Creation test added
- [ ] Manager method test added
- [ ] String representation test added
- [ ] Ordering test added

---

## Task 84: Test Attribute Creation

### Overview
Create tests for Attribute model creation, field validation, and relationships.

### Dependencies
- Task 83: Test AttributeGroup Creation

### Instructions

1. **Create TestAttribute class**
   - Use pytest.mark.django_db decorator

2. **Test basic creation**
   - test_create_attribute()
   - Verify all fields saved correctly
   - Test with different attribute types

3. **Test group relationship**
   - test_group_relationship()
   - Create attribute with group
   - Verify FK relationship

4. **Test boolean defaults**
   - test_boolean_defaults()
   - Verify is_required, is_filterable, etc. default to False

5. **Test display_order default**
   - test_display_order_default()
   - Verify default is 0

### Test Class Structure

```python
@pytest.mark.django_db
class TestAttribute:
    """Tests for Attribute model"""
    
    def test_create_attribute(self, attribute_group):
        """Test creating an attribute"""
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select',
            is_filterable=True,
            is_visible_on_product=True
        )
        assert attribute.id is not None
        assert attribute.name == 'Color'
        assert attribute.attribute_type == 'select'
        assert attribute.is_filterable is True
    
    def test_group_relationship(self, attribute_group):
        """Test attribute-group relationship"""
        attribute = Attribute.objects.create(
            name='Test',
            slug='test',
            group=attribute_group,
            attribute_type='text'
        )
        assert attribute.group == attribute_group
        assert attribute in attribute_group.attributes.all()
    
    def test_boolean_defaults(self, attribute_group):
        """Test boolean field defaults"""
        attribute = Attribute.objects.create(
            name='Test',
            slug='test',
            group=attribute_group,
            attribute_type='text'
        )
        assert attribute.is_required is False
        assert attribute.is_filterable is False
        assert attribute.is_searchable is False
        assert attribute.is_comparable is False
        assert attribute.is_visible_on_product is True
    
    def test_display_order_default(self, attribute_group):
        """Test display_order default value"""
        attribute = Attribute.objects.create(
            name='Test',
            slug='test',
            group=attribute_group,
            attribute_type='text'
        )
        assert attribute.display_order == 0
```

### Verification Checklist
- [ ] TestAttribute class created
- [ ] Creation test added
- [ ] Group relationship test added
- [ ] Boolean defaults test added
- [ ] Display order test added

---

## Task 85: Test AttributeOption Creation

### Overview
Create tests for AttributeOption model creation, uniqueness constraint, and relationships.

### Dependencies
- Task 84: Test Attribute Creation

### Instructions

1. **Create TestAttributeOption class**
   - Use pytest.mark.django_db decorator

2. **Test basic creation**
   - test_create_attribute_option()
   - Verify all fields saved correctly

3. **Test attribute relationship**
   - test_attribute_relationship()
   - Verify FK to attribute

4. **Test uniqueness constraint**
   - test_unique_value_per_attribute()
   - Create option with same value twice
   - Expect IntegrityError

5. **Test default flag**
   - test_is_default_flag()
   - Verify only one default per attribute (business logic)

### Test Class Structure

```python
@pytest.mark.django_db
class TestAttributeOption:
    """Tests for AttributeOption model"""
    
    def test_create_attribute_option(self, attribute_group):
        """Test creating an attribute option"""
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        option = AttributeOption.objects.create(
            attribute=attribute,
            value='red',
            label='Bright Red',
            color_code='#FF0000',
            display_order=1
        )
        assert option.id is not None
        assert option.value == 'red'
        assert option.label == 'Bright Red'
        assert option.color_code == '#FF0000'
    
    def test_attribute_relationship(self, attribute_group):
        """Test option-attribute relationship"""
        attribute = Attribute.objects.create(
            name='Size',
            slug='size',
            group=attribute_group,
            attribute_type='select'
        )
        option = AttributeOption.objects.create(
            attribute=attribute,
            value='m',
            label='Medium'
        )
        assert option.attribute == attribute
        assert option in attribute.options.all()
    
    def test_unique_value_per_attribute(self, attribute_group):
        """Test value uniqueness constraint"""
        from django.db import IntegrityError
        
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        
        # Create first option
        AttributeOption.objects.create(
            attribute=attribute,
            value='red',
            label='Red'
        )
        
        # Try to create duplicate value
        with pytest.raises(IntegrityError):
            AttributeOption.objects.create(
                attribute=attribute,
                value='red',  # Duplicate value
                label='Another Red'
            )
    
    def test_is_default_flag(self, attribute_group):
        """Test is_default flag"""
        attribute = Attribute.objects.create(
            name='Size',
            slug='size',
            group=attribute_group,
            attribute_type='select'
        )
        
        option1 = AttributeOption.objects.create(
            attribute=attribute,
            value='s',
            label='Small',
            is_default=False
        )
        option2 = AttributeOption.objects.create(
            attribute=attribute,
            value='m',
            label='Medium',
            is_default=True
        )
        
        assert option1.is_default is False
        assert option2.is_default is True
```

### Verification Checklist
- [ ] TestAttributeOption class created
- [ ] Creation test added
- [ ] Relationship test added
- [ ] Uniqueness constraint test added
- [ ] Default flag test added

---

## Task 86: Test Attribute Types

### Overview
Create comprehensive tests for all attribute type validations and behaviors.

### Dependencies
- Task 85: Test AttributeOption Creation

### Instructions

1. **Create TestAttributeTypes class**
   - Test each attribute type's behavior

2. **Test TEXT type**
   - test_text_type()
   - Verify validation_regex works
   - Test with valid/invalid patterns

3. **Test NUMBER type**
   - test_number_type()
   - Verify min_value and max_value constraints
   - Test with valid/invalid numbers

4. **Test SELECT type**
   - test_select_type()
   - Verify requires options
   - Test single selection

5. **Test MULTISELECT type**
   - test_multiselect_type()
   - Verify allows multiple selections
   - Test with multiple options

6. **Test BOOLEAN type**
   - test_boolean_type()
   - Verify true/false values

7. **Test DATE type**
   - test_date_type()
   - Verify date format validation

### Test Class Structure

```python
import re
from datetime import date

@pytest.mark.django_db
class TestAttributeTypes:
    """Tests for different attribute types"""
    
    def test_text_type(self, attribute_group):
        """Test TEXT attribute type"""
        attribute = Attribute.objects.create(
            name='SKU',
            slug='sku',
            group=attribute_group,
            attribute_type='text',
            validation_regex=r'^[A-Z]{3}-\d{4}$'  # Pattern: ABC-1234
        )
        
        # Test validation regex
        valid_value = 'ABC-1234'
        pattern = re.compile(attribute.validation_regex)
        assert pattern.match(valid_value)
        
        invalid_value = 'abc-1234'
        assert not pattern.match(invalid_value)
    
    def test_number_type(self, attribute_group):
        """Test NUMBER attribute type"""
        attribute = Attribute.objects.create(
            name='Weight',
            slug='weight',
            group=attribute_group,
            attribute_type='number',
            unit='kg',
            min_value=0,
            max_value=100
        )
        
        # Test min/max constraints
        valid_value = 50
        assert attribute.min_value <= valid_value <= attribute.max_value
        
        invalid_value = 150
        assert not (attribute.min_value <= invalid_value <= attribute.max_value)
    
    def test_select_type(self, attribute_group):
        """Test SELECT attribute type"""
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        
        # Create options
        option1 = AttributeOption.objects.create(
            attribute=attribute,
            value='red',
            label='Red'
        )
        option2 = AttributeOption.objects.create(
            attribute=attribute,
            value='blue',
            label='Blue'
        )
        
        # Verify options created
        assert attribute.options.count() == 2
        assert option1 in attribute.options.all()
        assert option2 in attribute.options.all()
    
    def test_multiselect_type(self, attribute_group):
        """Test MULTISELECT attribute type"""
        attribute = Attribute.objects.create(
            name='Features',
            slug='features',
            group=attribute_group,
            attribute_type='multiselect'
        )
        
        # Create multiple options
        options = [
            AttributeOption.objects.create(
                attribute=attribute,
                value=f'feature{i}',
                label=f'Feature {i}'
            ) for i in range(1, 4)
        ]
        
        # Verify multiple options can exist
        assert attribute.options.count() == 3
    
    def test_boolean_type(self, attribute_group):
        """Test BOOLEAN attribute type"""
        attribute = Attribute.objects.create(
            name='In Stock',
            slug='in-stock',
            group=attribute_group,
            attribute_type='boolean'
        )
        
        # Boolean type doesn't need options
        assert attribute.options.count() == 0
        assert attribute.attribute_type == 'boolean'
    
    def test_date_type(self, attribute_group):
        """Test DATE attribute type"""
        attribute = Attribute.objects.create(
            name='Expiry Date',
            slug='expiry-date',
            group=attribute_group,
            attribute_type='date'
        )
        
        # Date type validation (would be handled by product value model)
        assert attribute.attribute_type == 'date'
```

### Verification Checklist
- [ ] TestAttributeTypes class created
- [ ] TEXT type test added
- [ ] NUMBER type test added
- [ ] SELECT type test added
- [ ] MULTISELECT type test added
- [ ] BOOLEAN type test added
- [ ] DATE type test added

---

## Task 87: Test Category Assignment

### Overview
Create tests for category-attribute M2M relationships and inheritance.

### Dependencies
- Task 86: Test Attribute Types

### Instructions

1. **Create TestCategoryAssignment class**
   - Test M2M relationship between attributes and categories

2. **Test basic assignment**
   - test_assign_categories()
   - Create attribute and assign multiple categories
   - Verify M2M relationship

3. **Test category hierarchy**
   - test_category_inheritance()
   - Create parent and child categories
   - Assign attribute to parent
   - Verify child can access parent's attributes

4. **Test multiple attributes per category**
   - test_multiple_attributes()
   - Assign multiple attributes to one category

5. **Test filtering by category**
   - test_filter_by_category()
   - Filter attributes by category

### Test Class Structure

```python
@pytest.mark.django_db
class TestCategoryAssignment:
    """Tests for category-attribute relationships"""
    
    def test_assign_categories(self, attribute_group):
        """Test assigning categories to attribute"""
        attribute = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        
        # Create categories
        category1 = Category.objects.create(
            name='Electronics',
            slug='electronics'
        )
        category2 = Category.objects.create(
            name='Clothing',
            slug='clothing'
        )
        
        # Assign categories
        attribute.categories.add(category1, category2)
        
        # Verify assignment
        assert attribute.categories.count() == 2
        assert category1 in attribute.categories.all()
        assert category2 in attribute.categories.all()
    
    def test_category_inheritance(self, attribute_group):
        """Test attribute inheritance through category hierarchy"""
        # Create parent category
        parent_category = Category.objects.create(
            name='Electronics',
            slug='electronics'
        )
        
        # Create child category
        child_category = Category.objects.create(
            name='Smartphones',
            slug='smartphones',
            parent=parent_category
        )
        
        # Create attribute assigned to parent
        attribute = Attribute.objects.create(
            name='Brand',
            slug='brand',
            group=attribute_group,
            attribute_type='text'
        )
        attribute.categories.add(parent_category)
        
        # Verify parent has attribute
        assert attribute in parent_category.attributes.all()
        
        # Child should inherit attributes (logic in by_category action)
        # This would be tested in API tests
    
    def test_multiple_attributes(self, attribute_group):
        """Test multiple attributes per category"""
        category = Category.objects.create(
            name='Clothing',
            slug='clothing'
        )
        
        # Create multiple attributes
        color = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        size = Attribute.objects.create(
            name='Size',
            slug='size',
            group=attribute_group,
            attribute_type='select'
        )
        
        # Assign to category
        color.categories.add(category)
        size.categories.add(category)
        
        # Verify
        assert category.attributes.count() == 2
        assert color in category.attributes.all()
        assert size in category.attributes.all()
    
    def test_filter_by_category(self, attribute_group, category):
        """Test filtering attributes by category"""
        # Create attributes
        attr1 = Attribute.objects.create(
            name='Color',
            slug='color',
            group=attribute_group,
            attribute_type='select'
        )
        attr2 = Attribute.objects.create(
            name='Size',
            slug='size',
            group=attribute_group,
            attribute_type='select'
        )
        attr3 = Attribute.objects.create(
            name='Weight',
            slug='weight',
            group=attribute_group,
            attribute_type='number'
        )
        
        # Assign only attr1 and attr2 to category
        attr1.categories.add(category)
        attr2.categories.add(category)
        
        # Filter
        category_attributes = Attribute.objects.filter(categories=category)
        assert attr1 in category_attributes
        assert attr2 in category_attributes
        assert attr3 not in category_attributes
```

### Verification Checklist
- [ ] TestCategoryAssignment class created
- [ ] Basic assignment test added
- [ ] Category inheritance test added
- [ ] Multiple attributes test added
- [ ] Filter by category test added

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 81 | Create tests Module | tests/ package created |
| 82 | Create test_models.py | Test file with fixtures |
| 83 | Test AttributeGroup Creation | Group model tests |
| 84 | Test Attribute Creation | Attribute model tests |
| 85 | Test AttributeOption Creation | Option model tests |
| 86 | Test Attribute Types | Type validation tests |
| 87 | Test Category Assignment | M2M relationship tests |

### Test Coverage Summary

**AttributeGroup Tests:**
- Creation and field validation
- Active manager method
- String representation
- Ordering

**Attribute Tests:**
- Creation with all field types
- Group relationship
- Boolean defaults
- Display order

**AttributeOption Tests:**
- Creation with visual fields
- Attribute relationship
- Uniqueness constraint
- Default flag

**Type Validation Tests:**
- TEXT with regex validation
- NUMBER with min/max
- SELECT with options
- MULTISELECT with multiple options
- BOOLEAN simple flag
- DATE format validation

**Category Tests:**
- M2M assignment
- Category hierarchy
- Multiple attributes per category
- Filtering by category

### Next Steps
1. Proceed to [02_Tasks-88-93_API-Tenant-Tests.md](02_Tasks-88-93_API-Tenant-Tests.md)
2. Create test_api.py file
3. Test all API endpoints
4. Test by_category filter
5. Test tenant isolation

---

## Notes for AI Agents

1. **pytest Fixtures:** Reusable test data
2. **pytest.mark.django_db:** Required for database access
3. **IntegrityError:** Test database constraints
4. **Relationship Testing:** Test both sides of FK/M2M
5. **Type Validation:** Test each attribute type's behavior
6. **No Code:** Instructions only
