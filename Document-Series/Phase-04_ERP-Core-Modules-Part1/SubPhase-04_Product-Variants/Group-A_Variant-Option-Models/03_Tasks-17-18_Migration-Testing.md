# Tasks 17-18: Migration and Testing

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 04 - Product Variants  
> **Group:** A - Variant Option Models  
> **Document:** 03 of 03  
> **Tasks Covered:** 17, 18

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-09-16_VariantOptionValue-Model.md](02_Tasks-09-16_VariantOptionValue-Model.md)
- **→ Next Group:** [../Group-B_ProductVariant-Model/](../Group-B_ProductVariant-Model/)

---

## Document Overview

This document covers creating the database migration for the variant option models and implementing comprehensive tests to verify functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Create Option Migration | Low |
| 18 | Test Option Models | Medium |

---

## Task 17: Create Option Migration

### Overview
Generate and verify the Django migration file for VariantOptionType and VariantOptionValue models.

### Dependencies
- Tasks 01-16: Both models completely defined

### Instructions

1. **Generate migration file**
   - Run Django makemigrations command
   - Specify products app
   - Review generated migration file

2. **Verify migration contents**
   - Check all fields are included
   - Verify field types and constraints
   - Check unique_together constraints
   - Verify indexes
   - Confirm ForeignKey relationships

3. **Add migration dependencies**
   - Ensure proper migration order
   - Depend on previous products migrations
   - List any external app dependencies

4. **Test migration**
   - Run migration on development database
   - Verify tables created correctly
   - Check indexes in database
   - Verify constraints work

5. **Test migration rollback**
   - Roll back migration
   - Verify tables removed
   - Roll forward again
   - Confirm no issues

6. **Document migration**
   - Add comments explaining purpose
   - Document any custom operations
   - Note any data transformations

### Migration File Structure

The migration should create:

**Tables Created:**
- `products_variantoptiontype`
- `products_variantoptionvalue`

**VariantOptionType Table:**

| Column | Type | Constraints |
|--------|------|-------------|
| id | BigAutoField | Primary Key |
| tenant_id | ForeignKey | NOT NULL, Index |
| created_at | DateTimeField | auto_now_add |
| updated_at | DateTimeField | auto_now |
| name | CharField(100) | NOT NULL |
| slug | SlugField(100) | NOT NULL |
| display_order | PositiveIntegerField | Default 0 |
| is_color_swatch | BooleanField | Default False |
| is_image_swatch | BooleanField | Default False |

**VariantOptionValue Table:**

| Column | Type | Constraints |
|--------|------|-------------|
| id | BigAutoField | Primary Key |
| tenant_id | ForeignKey | NOT NULL, Index |
| created_at | DateTimeField | auto_now_add |
| updated_at | DateTimeField | auto_now |
| option_type_id | ForeignKey | NOT NULL, CASCADE, Index |
| value | CharField(100) | NOT NULL |
| label | CharField(150) | NOT NULL |
| color_code | CharField(7) | NULL, Blank |
| image | CloudinaryField | NULL, Blank |
| display_order | PositiveIntegerField | Default 0 |

**Constraints:**

| Table | Constraint Type | Fields |
|-------|-----------------|--------|
| variantoptiontype | unique_together | ['tenant', 'slug'] |
| variantoptiontype | unique_together | ['tenant', 'name'] |
| variantoptionvalue | unique_together | ['tenant', 'option_type', 'value'] |

**Indexes:**

| Table | Index Fields | Purpose |
|-------|--------------|---------|
| variantoptiontype | ['tenant', 'slug'] | Fast lookups by slug |
| variantoptiontype | ['tenant', 'name'] | Fast lookups by name |
| variantoptiontype | ['tenant', 'display_order'] | Ordered queries |
| variantoptionvalue | ['tenant', 'option_type'] | Filter by type |
| variantoptionvalue | ['tenant', 'value'] | Filter by value |
| variantoptionvalue | ['option_type', 'display_order'] | Ordered type values |

### Migration Command Reference

**Generate migration:**
```bash
python manage.py makemigrations products
```

**Expected output:**
```
Migrations for 'products':
  products/migrations/0004_variantoptiontype_variantoptionvalue.py
    - Create model VariantOptionType
    - Create model VariantOptionValue
```

**Apply migration:**
```bash
python manage.py migrate products
```

**Expected output:**
```
Running migrations:
  Applying products.0004_variantoptiontype_variantoptionvalue... OK
```

**Check migration status:**
```bash
python manage.py showmigrations products
```

### Multi-Tenant Considerations

**Schema Creation:**
- Migration must run on public schema
- Migration must run on all tenant schemas
- Use django-tenants migration command if needed

**Tenant Schema Application:**
```bash
# Apply to public schema
python manage.py migrate_schemas --schema=public

# Apply to all tenant schemas
python manage.py migrate_schemas
```

### Database Verification

After migration, verify in PostgreSQL:

**Check tables exist:**
```sql
\dt products_variant*
-- Should show:
-- products_variantoptiontype
-- products_variantoptionvalue
```

**Check constraints:**
```sql
\d products_variantoptiontype
\d products_variantoptionvalue
-- Verify unique constraints and indexes
```

**Check indexes:**
```sql
SELECT indexname, indexdef 
FROM pg_indexes 
WHERE tablename LIKE 'products_variant%';
```

### Migration Rollback Testing

**Rollback one migration:**
```bash
python manage.py migrate products 0003
```

**Verify tables removed:**
```sql
\dt products_variant*
-- Should show no tables
```

**Reapply migration:**
```bash
python manage.py migrate products
```

### Common Migration Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Constraint violation** | Existing data conflicts | Clean data or add data migration |
| **Index creation failure** | Duplicate index name | Rename index |
| **ForeignKey error** | Referenced table missing | Check migration dependencies |
| **Tenant schema error** | Schema not created | Run migrate_schemas |

### Verification Checklist
- [ ] Migration file generated successfully
- [ ] All fields included in migration
- [ ] Constraints defined correctly
- [ ] Indexes created
- [ ] ForeignKey relationships correct
- [ ] Migration applied successfully
- [ ] Tables visible in database
- [ ] Constraints working (test with data)
- [ ] Rollback works correctly
- [ ] Can reapply migration
- [ ] Multi-tenant schemas updated

---

## Task 18: Test Option Models

### Overview
Create comprehensive tests for VariantOptionType and VariantOptionValue models.

### Dependencies
- Task 17: Migration applied successfully

### Instructions

1. **Create test file**
   - File: `backend/apps/products/tests/test_variant_options.py`
   - Import necessary test utilities
   - Import models
   - Import test mixins

2. **Create test fixtures**
   - Tenant fixture
   - User fixture
   - Option type fixtures
   - Option value fixtures

3. **Test VariantOptionType creation**
   - Test basic creation
   - Test slug auto-generation
   - Test field validation
   - Test uniqueness constraints
   - Test swatch type validation

4. **Test VariantOptionType methods**
   - Test __str__ method
   - Test save method
   - Test clean validation

5. **Test VariantOptionValue creation**
   - Test basic creation
   - Test ForeignKey relationship
   - Test field validation
   - Test uniqueness constraints

6. **Test VariantOptionValue methods**
   - Test __str__ method
   - Test save method (label generation)
   - Test clean validation
   - Test property methods

7. **Test color swatch functionality**
   - Test color_code validation
   - Test color_code requirement
   - Test hex format validation

8. **Test image swatch functionality**
   - Test image upload
   - Test image requirement
   - Test image field

9. **Test ordering**
   - Test display_order sorting
   - Test default ordering
   - Test query ordering

10. **Test multi-tenant isolation**
    - Test tenant filtering
    - Test uniqueness per tenant
    - Test cross-tenant access prevention

11. **Test edge cases**
    - Test empty fields
    - Test maximum lengths
    - Test special characters in names
    - Test duplicate detection

### Test File Structure

```python
# test_variant_options.py structure

class VariantOptionTypeModelTest(TestCase):
    """Tests for VariantOptionType model"""
    
class VariantOptionValueModelTest(TestCase):
    """Tests for VariantOptionValue model"""
    
class VariantOptionOrderingTest(TestCase):
    """Tests for display ordering"""
    
class VariantOptionMultiTenantTest(TenantTestCase):
    """Tests for multi-tenant isolation"""
    
class ColorSwatchTest(TestCase):
    """Tests for color swatch functionality"""
    
class ImageSwatchTest(TestCase):
    """Tests for image swatch functionality"""
```

### Test Case Examples

**Test 1: Basic VariantOptionType Creation**

Test that option type can be created with required fields:
- Create tenant
- Create option type with name
- Verify slug auto-generated
- Verify display_order defaults to 0
- Verify swatch flags default to False

**Expected Result:**
- Object created successfully
- slug = slugified name
- All defaults applied

**Test 2: Slug Auto-Generation**

Test slug generation from name:
- Create option type: name="Screen Size"
- Verify slug="screen-size"
- Create option type: name="RAM Memory"
- Verify slug="ram-memory"

**Expected Result:**
- Slugs generated correctly
- Lowercase, hyphenated format

**Test 3: Uniqueness Constraint (slug)**

Test that duplicate slugs are prevented per tenant:
- Create option type: slug="size"
- Attempt to create another with slug="size"
- Should raise IntegrityError

**Expected Result:**
- First creation succeeds
- Second creation fails with IntegrityError

**Test 4: Swatch Type Validation**

Test that both swatch types cannot be True:
- Create option type
- Set is_color_swatch=True
- Set is_image_swatch=True
- Call clean() or save()
- Should raise ValidationError

**Expected Result:**
- ValidationError raised
- Error message: "Cannot be both color and image swatch"

**Test 5: VariantOptionValue Creation**

Test creating option value:
- Create option type: "Size"
- Create option value: value="m", label="Medium"
- Verify relationship to option type
- Verify display_order defaults to 0

**Expected Result:**
- Value created successfully
- Linked to option type
- Defaults applied

**Test 6: Label Auto-Generation**

Test label generation from value:
- Create value with value="extra-large", label=""
- Save
- Verify label="Extra Large"

**Expected Result:**
- Label auto-generated
- Proper title case

**Test 7: Color Code Validation**

Test color code format validation:
- Valid: "#FF0000" → passes
- Invalid: "FF0000" → ValidationError (missing #)
- Invalid: "#FFF" → ValidationError (too short)
- Invalid: "#GGGGGG" → ValidationError (invalid hex)

**Expected Result:**
- Valid codes accepted
- Invalid codes rejected

**Test 8: Color Code Requirement**

Test color code required when is_color_swatch:
- Create option type with is_color_swatch=True
- Create value without color_code
- Should raise ValidationError

**Expected Result:**
- ValidationError raised
- Error message: "Color code required for color swatches"

**Test 9: Display Order Sorting**

Test values ordered by display_order:
- Create Size option type
- Create values: L(30), S(10), M(20), XL(40), XS(0)
- Query values
- Verify order: XS, S, M, L, XL

**Expected Result:**
- Values returned in display_order sequence
- Regardless of creation order

**Test 10: Multi-Tenant Isolation**

Test tenant data separation:
- Create Tenant A with Size option
- Create Tenant B with Size option
- Query from Tenant A context
- Should only see Tenant A's Size

**Expected Result:**
- Each tenant sees only their data
- No cross-tenant data leakage

### Test Data Examples

**Option Type Test Data:**

| name | slug | is_color_swatch | is_image_swatch |
|------|------|-----------------|-----------------|
| Size | size | False | False |
| Color | color | True | False |
| Pattern | pattern | False | True |
| Material | material | False | False |

**Option Value Test Data (Size):**

| value | label | display_order |
|-------|-------|---------------|
| xs | Extra Small | 0 |
| s | Small | 10 |
| m | Medium | 20 |
| l | Large | 30 |
| xl | Extra Large | 40 |

**Option Value Test Data (Color):**

| value | label | color_code | display_order |
|-------|-------|------------|---------------|
| red | Red | #FF0000 | 0 |
| blue | Blue | #0000FF | 10 |
| green | Green | #00FF00 | 20 |
| black | Black | #000000 | 30 |

### Test Assertions

**Model Creation Assertions:**
- `assertIsNotNone(option_type.id)`
- `assertEqual(option_type.name, "Size")`
- `assertEqual(option_type.slug, "size")`
- `assertFalse(option_type.is_color_swatch)`

**Relationship Assertions:**
- `assertEqual(value.option_type, size_type)`
- `assertIn(value, size_type.values.all())`

**Validation Assertions:**
- `assertRaises(ValidationError, option_type.clean)`
- `assertIn("color code", str(error))`

**Ordering Assertions:**
- `assertEqual(values[0].value, "xs")`
- `assertEqual(values[1].value, "s")`
- `assertEqual(list(values.values_list('value', flat=True)), ['xs', 's', 'm', 'l', 'xl'])`

### Test Coverage Goals

| Component | Target Coverage |
|-----------|-----------------|
| **Models** | 100% |
| **Methods** | 100% |
| **Validation** | 100% |
| **Properties** | 100% |
| **Edge Cases** | 90%+ |

### Running Tests

**Run all product tests:**
```bash
pytest backend/apps/products/tests/
```

**Run variant option tests only:**
```bash
pytest backend/apps/products/tests/test_variant_options.py
```

**Run with coverage:**
```bash
pytest --cov=backend/apps/products backend/apps/products/tests/test_variant_options.py
```

**Run specific test class:**
```bash
pytest backend/apps/products/tests/test_variant_options.py::VariantOptionTypeModelTest
```

### Test Output Example

```
test_variant_options.py::VariantOptionTypeModelTest::test_create_option_type PASSED
test_variant_options.py::VariantOptionTypeModelTest::test_slug_auto_generation PASSED
test_variant_options.py::VariantOptionTypeModelTest::test_unique_slug_per_tenant PASSED
test_variant_options.py::VariantOptionTypeModelTest::test_swatch_type_validation PASSED
test_variant_options.py::VariantOptionValueModelTest::test_create_option_value PASSED
test_variant_options.py::VariantOptionValueModelTest::test_label_auto_generation PASSED
test_variant_options.py::ColorSwatchTest::test_color_code_validation PASSED
test_variant_options.py::ColorSwatchTest::test_color_code_requirement PASSED
test_variant_options.py::VariantOptionOrderingTest::test_display_order_sorting PASSED
test_variant_options.py::VariantOptionMultiTenantTest::test_tenant_isolation PASSED

========== 10 passed in 2.45s ==========
```

### Common Test Issues

| Issue | Cause | Solution |
|-------|-------|----------|
| **Tenant not found** | Fixture not created | Create tenant in setUp |
| **IntegrityError** | Duplicate test data | Use unique values or clear between tests |
| **Import error** | Model not exported | Check __init__.py exports |
| **ValidationError not raised** | clean() not called | Call full_clean() or clean() |

### Sri Lankan Context Tests

**Test Sinhala Option Type Names:**
- Create option type with Sinhala name: "පරිමාව"
- Verify slug generation (transliteration)
- Verify Unicode handling

**Test LKR Pricing Context:**
- Create weight options: 100g, 500g, 1kg
- Verify ordering
- Test with price calculations (in later tests)

**Test Local Product Options:**
- Rice types: Basmati, Samba, Nadu
- Spice grinds: Whole, Coarse, Fine
- Verify all create correctly

### Verification Checklist
- [ ] Test file created
- [ ] All test classes defined
- [ ] Fixtures created
- [ ] Creation tests pass
- [ ] Validation tests pass
- [ ] Uniqueness tests pass
- [ ] Ordering tests pass
- [ ] Multi-tenant tests pass
- [ ] Color swatch tests pass
- [ ] Image swatch tests pass
- [ ] Edge case tests pass
- [ ] 100% model coverage
- [ ] All tests passing
- [ ] No database errors
- [ ] Test documentation clear

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Create Option Migration | Database migration file |
| 18 | Test Option Models | Comprehensive test suite |

### Group A Complete

All tasks in Group A (Variant Option Models) are now complete:
- ✅ VariantOptionType model
- ✅ VariantOptionValue model
- ✅ Database migration
- ✅ Comprehensive tests

### Models Created

**VariantOptionType:**
- Defines types of options (Size, Color, etc.)
- Supports color and image swatches
- Display ordering
- Tenant isolation

**VariantOptionValue:**
- Stores specific values (S, M, L, Red, Blue)
- Color code support
- Image upload support
- Display ordering
- Auto-label generation

### Testing Coverage

Tests cover:
- Model creation and validation
- Slug auto-generation
- Uniqueness constraints
- Color swatch validation
- Image swatch functionality
- Display ordering
- Multi-tenant isolation
- Edge cases

### Next Steps
1. Proceed to [Group-B_ProductVariant-Model](../Group-B_ProductVariant-Model/) to create ProductVariant model
2. ProductVariant will use these option types and values

---

## Notes for AI Agents

1. **Migration Order:** Ensure this migration runs before ProductVariant migration
2. **Test Isolation:** Use transaction test cases for clean database state
3. **Fixtures:** Create reusable fixtures for common test data
4. **Coverage:** Aim for 100% model coverage before proceeding
5. **Multi-Tenant:** Test all queries filter by tenant correctly
6. **Validation:** Test both model-level and database-level constraints
7. **Performance:** Add indexes tested with explain queries
8. **Documentation:** Keep test docstrings clear for future developers
