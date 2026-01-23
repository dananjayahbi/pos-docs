# Tasks 45-48: TenantUnique Validator, Export & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** C - Common Validators  
> **Document:** 03 of 03  
> **Tasks Covered:** 45, 46, 47, 48

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-39-44_Numeric-File-Validators.md](02_Tasks-39-44_Numeric-File-Validators.md)
- **→ Next Group:** [../Group-D_DateTime-Helpers/](../Group-D_DateTime-Helpers/)

---

## Document Overview

This document covers the NoHTMLValidator for content sanitization, the critical UniqueForTenantValidator for multi-tenant unique constraints, exporting all validators, and basic validation tests.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 45 | Create NoHTMLValidator | Medium |
| 46 | Create UniqueForTenantValidator | High |
| 47 | Export Validators | Low |
| 48 | Test Validators | Medium |

---

## Task 45: Create NoHTMLValidator

### Overview
Create a validator that ensures text fields do not contain HTML tags, preventing XSS attacks and ensuring plain text content.

### Dependencies
- Task 44: Create JSONValidator

### Instructions

1. **Create NoHTMLValidator class**
   - In common.py file
   - Detect HTML tags in text

2. **Add HTML detection**
   - Use regex or bleach library
   - Detect opening/closing tags
   - Check for script tags specifically

3. **Configure strictness**
   - Parameter for allowed tags (empty by default)
   - Strip HTML option vs. reject

4. **Document security purpose**
   - Prevents XSS attacks
   - Ensures plain text fields stay plain
   - Use cases: usernames, titles, short descriptions

### Implementation Pattern
```python
import re
from django.core.exceptions import ValidationError

class NoHTMLValidator:
    """
    Validates that text contains no HTML tags.
    
    Security: Prevents XSS attacks in plain text fields
    
    Use for:
        - Usernames
        - Product names
        - Short descriptions
        - Comments (without rich text)
    """
    html_pattern = re.compile(r'<[^>]+>')
    
    def __call__(self, value):
        if self.html_pattern.search(value):
            raise ValidationError("HTML tags are not allowed in this field.")
```

### Verification Checklist
- [ ] NoHTMLValidator class defined
- [ ] HTML detection implemented
- [ ] Security purpose documented
- [ ] Error messages clear

---

## Task 46: Create UniqueForTenantValidator

### Overview
Create the UniqueForTenantValidator that ensures a field value is unique within the current tenant's scope, critical for multi-tenant data integrity.

### Dependencies
- Task 45: Create NoHTMLValidator

### Instructions

1. **Create UniqueForTenantValidator class**
   - In common.py file
   - Validate uniqueness within tenant

2. **Configure parameters**
   - `model`: The model class
   - `field_name`: Field to check uniqueness
   - `tenant_field`: Field name for tenant FK (default 'tenant')

3. **Add validation logic**
   - Get current tenant from context
   - Query model filtering by tenant and field value
   - Exclude current instance (for updates)
   - Raise error if duplicate exists

4. **Handle create vs update**
   - For new records: check any existing
   - For updates: exclude current instance by PK

5. **Document critical nature**
   - Essential for tenant isolation
   - Examples: SKU, email within tenant, invoice numbers

### Implementation Pattern
```python
from django.core.exceptions import ValidationError

class UniqueForTenantValidator:
    """
    Validates field uniqueness within tenant scope.
    
    Critical for multi-tenant data integrity.
    
    Parameters:
        model: Model class to check
        field_name: Field to validate uniqueness
        tenant_field: Tenant FK field name (default 'tenant')
    
    Use cases:
        - SKU numbers within tenant
        - Customer emails within tenant
        - Invoice numbers within tenant
    
    Example:
        validator = UniqueForTenantValidator(
            model=Product,
            field_name='sku'
        )
    """
    def __init__(self, model, field_name, tenant_field='tenant'):
        self.model = model
        self.field_name = field_name
        self.tenant_field = tenant_field
    
    def __call__(self, value, instance=None, tenant=None):
        # Validate uniqueness within tenant
        queryset = self.model.objects.filter(
            **{self.tenant_field: tenant, self.field_name: value}
        )
        if instance and instance.pk:
            queryset = queryset.exclude(pk=instance.pk)
        
        if queryset.exists():
            raise ValidationError(
                f"{self.field_name} must be unique within your organization."
            )
```

### Verification Checklist
- [ ] UniqueForTenantValidator class defined
- [ ] Tenant-scoped uniqueness checked
- [ ] Handles create and update scenarios
- [ ] Excludes current instance on update
- [ ] Critical nature documented

---

## Task 47: Export Validators

### Overview
Update the validators module's `__init__.py` to export all validator classes for easy import throughout the project.

### Dependencies
- Task 46: Create UniqueForTenantValidator

### Instructions

1. **Open __init__.py file**
   - Navigate to `backend/apps/core/validators/__init__.py`

2. **Import all validators**
   - From common.py module
   - From files.py module

3. **Update __all__ list**
   - Add all validator class names
   - Organize by category

4. **Update module docstring**
   - List all exported validators with brief descriptions

### Export Pattern
```python
"""
Validators for data validation across LankaCommerce Cloud.
"""

__version__ = '1.0.0'

from .common import (
    EmailValidator,
    URLValidator,
    SlugValidator,
    PositiveNumberValidator,
    DecimalValidator,
    PercentageValidator,
    JSONValidator,
    NoHTMLValidator,
    UniqueForTenantValidator,
)

from .files import (
    FileSizeValidator,
    ImageDimensionValidator,
    FileExtensionValidator,
)

__all__ = [
    # Basic Validators
    'EmailValidator',
    'URLValidator',
    'SlugValidator',
    'PositiveNumberValidator',
    # Numeric Validators
    'DecimalValidator',
    'PercentageValidator',
    # File Validators
    'FileSizeValidator',
    'ImageDimensionValidator',
    'FileExtensionValidator',
    # Content Validators
    'JSONValidator',
    'NoHTMLValidator',
    # Tenant Validators
    'UniqueForTenantValidator',
]
```

### Verification Checklist
- [ ] All validators imported
- [ ] __all__ list complete
- [ ] Module docstring updated
- [ ] Organized by category
- [ ] Imports work without errors

---

## Task 48: Test Validators

### Overview
Create basic validation tests to verify that all validators are properly configured and importable. Full unit tests will be implemented in Group F.

### Dependencies
- Task 47: Export Validators

### Instructions

1. **Verify imports**
   - Test import of all validators
   - No import errors should occur

2. **Manual verification checklist**
   - List all validators
   - Note test scenarios for Group F

3. **Document test scenarios**
   - Each validator's happy path
   - Each validator's failure cases
   - Edge cases

### Manual Validation Checklist

| Validator | Expected Result |
|-----------|----------------|
| Import EmailValidator | No errors |
| Import URLValidator | No errors |
| Import SlugValidator | No errors |
| Import PositiveNumberValidator | No errors |
| Import DecimalValidator | No errors |
| Import PercentageValidator | No errors |
| Import FileSizeValidator | No errors |
| Import ImageDimensionValidator | No errors |
| Import FileExtensionValidator | No errors |
| Import JSONValidator | No errors |
| Import NoHTMLValidator | No errors |
| Import UniqueForTenantValidator | No errors |

### Django Shell Verification
```python
from apps.core.validators import (
    EmailValidator,
    URLValidator,
    SlugValidator,
    PositiveNumberValidator,
    DecimalValidator,
    PercentageValidator,
    FileSizeValidator,
    ImageDimensionValidator,
    FileExtensionValidator,
    JSONValidator,
    NoHTMLValidator,
    UniqueForTenantValidator,
)

print("All validators imported successfully!")
```

### Test Scenarios for Group F

| Validator | Test Cases |
|-----------|-----------|
| **EmailValidator** | Valid email, invalid format, missing @ |
| **URLValidator** | Valid URL, missing protocol, invalid domain |
| **SlugValidator** | Valid slug, uppercase, spaces, special chars |
| **PositiveNumberValidator** | Positive, zero, negative, non-numeric |
| **DecimalValidator** | Valid decimal, too many digits, too many decimals |
| **PercentageValidator** | 0, 50, 100, -10, 150 |
| **FileSizeValidator** | Small file, max size, too large |
| **ImageDimensionValidator** | Valid size, too small, too large |
| **FileExtensionValidator** | Allowed, not allowed, no extension |
| **JSONValidator** | Valid JSON, invalid syntax, empty |
| **NoHTMLValidator** | Plain text, with tags, script injection |
| **UniqueForTenantValidator** | Unique, duplicate, different tenant |

### Verification Checklist
- [ ] All validators import successfully
- [ ] Django shell verification passes
- [ ] Manual test checklist complete
- [ ] Test scenarios documented for Group F

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 45 | Create NoHTMLValidator | HTML content prevention |
| 46 | Create UniqueForTenantValidator | Tenant-scoped uniqueness |
| 47 | Export Validators | Updated `__init__.py` with exports |
| 48 | Test Validators | Manual validation checklist |

### Complete Validators Module Structure
```
backend/apps/core/
└── validators/
    ├── __init__.py              # Exports all validators
    ├── common.py                # Basic & content validators
    │   ├── EmailValidator
    │   ├── URLValidator
    │   ├── SlugValidator
    │   ├── PositiveNumberValidator
    │   ├── DecimalValidator
    │   ├── PercentageValidator
    │   ├── JSONValidator
    │   ├── NoHTMLValidator
    │   └── UniqueForTenantValidator
    └── files.py                 # File validators
        ├── FileSizeValidator
        ├── ImageDimensionValidator
        └── FileExtensionValidator
```

### All Validators Summary

| Category | Validators |
|----------|-----------|
| **Basic** | Email, URL, Slug, PositiveNumber |
| **Numeric** | Decimal, Percentage |
| **Files** | FileSize, ImageDimension, FileExtension |
| **Content** | JSON, NoHTML |
| **Tenant** | UniqueForTenant |

### Group C Completion Status

All 16 tasks in Group C (33-48) are now complete:
- ✅ Validators module created
- ✅ Basic validators (email, URL, slug)
- ✅ Numeric validators (decimal, percentage)
- ✅ File validators (size, dimensions, extensions)
- ✅ Content validators (JSON, NoHTML)
- ✅ Tenant-unique validator
- ✅ All validators exported
- ✅ Basic validation complete

### Next Steps
Proceed to [../Group-D_DateTime-Helpers/](../Group-D_DateTime-Helpers/) to implement:
- Timezone conversion helpers
- Date range utilities
- Sri Lankan date formatting
- Fiscal year helpers

---

## Notes for AI Agents

1. **Group C Complete:** All 16 validator tasks are finished
2. **UniqueForTenantValidator:** Critical for multi-tenant data integrity
3. **NoHTMLValidator:** Important security measure
4. **File Validators:** Require Pillow library for image operations
5. **Testing:** Full automated tests in Group F, Task 82
6. **Usage:** All validators work with Django forms and DRF serializers
7. **Next Group:** Date/time helpers for Sri Lankan timezone
