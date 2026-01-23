# Tasks 33-38: Validators Module & Basic Validators

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** C - Common Validators  
> **Document:** 01 of 03  
> **Tasks Covered:** 33, 34, 35, 36, 37, 38

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Filter-Backends/](../Group-B_Filter-Backends/)
- **→ Next Document:** [02_Tasks-39-44_Numeric-File-Validators.md](02_Tasks-39-44_Numeric-File-Validators.md)

---

## Document Overview

This document covers the creation of the validators module and implementation of basic validators for emails, URLs, slugs, and positive numbers.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create validators Module | Low |
| 34 | Create validators __init__.py | Low |
| 35 | Create EmailValidator | Low |
| 36 | Create URLValidator | Low |
| 37 | Create SlugValidator | Low |
| 38 | Create PositiveNumberValidator | Low |

---

## Task 33: Create validators Module

### Overview
Create the validators module directory within the core app to house all custom validators used for data validation across the application.

### Dependencies
- Group B: Filter Backends (completed)

### Instructions

1. **Navigate to core app directory**
   - Go to `backend/apps/core/` directory

2. **Create validators directory**
   - Create new directory named `validators`

3. **Plan module organization**
   - `common.py`: Basic validators (email, URL, slug, numbers)
   - `files.py`: File-related validators (size, dimensions, extensions)
   - `__init__.py`: Package initialization and exports

### Expected Structure
```
backend/apps/core/
├── pagination/
├── filters/
└── validators/              # New directory
```

### Verification Checklist
- [ ] validators/ directory created
- [ ] Directory at correct location
- [ ] Ready for validator files

---

## Task 34: Create validators __init__.py

### Overview
Create the `__init__.py` file in the validators module to make it a Python package and prepare for exports.

### Dependencies
- Task 33: Create validators Module

### Instructions

1. **Create __init__.py file**
   - Create file in validators/ directory

2. **Add module docstring**
   - Document validator categories
   - List common validation types

3. **Add version information**
   - Set `__version__ = '1.0.0'`

4. **Prepare __all__ list**
   - Empty list, will populate in Task 47

### File Structure
```python
"""
Validators for data validation across LankaCommerce Cloud.

Categories:
- Basic: Email, URL, Slug, Positive Number
- Numeric: Decimal, Percentage
- Files: Size, Dimensions, Extensions
- Content: JSON, NoHTML
- Tenant: UniqueForTenant
"""

__version__ = '1.0.0'

__all__ = []  # Will populate in Task 47
```

### Verification Checklist
- [ ] __init__.py file created
- [ ] Module docstring present
- [ ] Version attribute defined
- [ ] __all__ list prepared

---

## Task 35: Create EmailValidator

### Overview
Create a custom EmailValidator that validates email addresses with additional rules for business contexts, including preventing disposable email domains.

### Dependencies
- Task 34: Create validators __init__.py

### Instructions

1. **Create common.py file**
   - Create file named `common.py` in validators/ directory

2. **Import required dependencies**
   - Import Django's core validators
   - Import ValidationError
   - Import regex for pattern matching

3. **Create EmailValidator class**
   - Extend or wrap Django's EmailValidator
   - Add custom error messages
   - Add Sri Lankan domain validation (optional)

4. **Add disposable email check (optional)**
   - Block common disposable email domains
   - List: tempmail, guerrillamail, etc.

5. **Document validation rules**
   - RFC 5322 compliant
   - Length limits
   - Domain requirements

### Implementation Pattern
```python
from django.core.validators import EmailValidator as DjangoEmailValidator
from django.core.exceptions import ValidationError

class EmailValidator(DjangoEmailValidator):
    """
    Email validator with business rules.
    
    - Standard email format validation
    - Optional: Block disposable email domains
    - Length limit: 254 characters
    """
    message = "Enter a valid email address."
    
    def __call__(self, value):
        super().__call__(value)
        # Add custom validation logic
```

### Verification Checklist
- [ ] common.py file created
- [ ] EmailValidator class defined
- [ ] Custom error messages
- [ ] Docstring explains rules

---

## Task 36: Create URLValidator

### Overview
Create a custom URLValidator that validates URLs with support for both HTTP/HTTPS protocols and optional local development URLs.

### Dependencies
- Task 35: Create EmailValidator

### Instructions

1. **Create URLValidator class**
   - In common.py file
   - Extend Django's URLValidator

2. **Support protocols**
   - http:// and https://
   - Optionally support localhost for development

3. **Add validation rules**
   - Protocol required
   - Domain format validation
   - Path validation

4. **Document usage**
   - When to use (website URLs, API endpoints)
   - Valid/invalid examples

### Implementation Pattern
```python
from django.core.validators import URLValidator as DjangoURLValidator

class URLValidator(DjangoURLValidator):
    """
    URL validator for HTTP/HTTPS URLs.
    
    Supports: http://, https://
    Development: Also validates localhost URLs
    """
    message = "Enter a valid URL."
```

### Verification Checklist
- [ ] URLValidator class defined
- [ ] Supports HTTP/HTTPS
- [ ] Error messages clear
- [ ] Usage documented

---

## Task 37: Create SlugValidator

### Overview
Create a SlugValidator for URL-friendly strings, commonly used for SEO-friendly URLs and identifiers.

### Dependencies
- Task 36: Create URLValidator

### Instructions

1. **Create SlugValidator class**
   - In common.py file
   - Validate slug format

2. **Define slug rules**
   - Lowercase letters, numbers, hyphens only
   - Must start/end with alphanumeric
   - No consecutive hyphens
   - Length limits (max 100 characters)

3. **Add regex pattern**
   - Pattern: `^[a-z0-9]+(?:-[a-z0-9]+)*$`

4. **Document slug format**
   - Valid examples: "product-name", "category-123"
   - Invalid examples: "-product", "product--name", "Product Name"

### Implementation Pattern
```python
import re
from django.core.exceptions import ValidationError

class SlugValidator:
    """
    Validates slug format for URLs.
    
    Rules:
    - Lowercase letters, numbers, hyphens only
    - Must start/end with alphanumeric
    - No consecutive hyphens
    - Max length: 100 characters
    
    Valid: "product-name", "category-123"
    Invalid: "-product", "product--name", "Product Name"
    """
    pattern = re.compile(r'^[a-z0-9]+(?:-[a-z0-9]+)*$')
    message = "Enter a valid slug (lowercase letters, numbers, hyphens)."
    
    def __call__(self, value):
        if not self.pattern.match(value):
            raise ValidationError(self.message)
        if len(value) > 100:
            raise ValidationError("Slug too long (max 100 characters).")
```

### Verification Checklist
- [ ] SlugValidator class defined
- [ ] Regex pattern correct
- [ ] Length validation included
- [ ] Examples in docstring

---

## Task 38: Create PositiveNumberValidator

### Overview
Create a PositiveNumberValidator to ensure numeric values are greater than zero, commonly used for prices, quantities, and counts.

### Dependencies
- Task 37: Create SlugValidator

### Instructions

1. **Create PositiveNumberValidator class**
   - In common.py file
   - Validate number is positive

2. **Support numeric types**
   - int, float, Decimal
   - Handle string representations

3. **Add validation rules**
   - Must be > 0
   - Optional: allow zero with flag
   - Clear error messages

4. **Document use cases**
   - Prices (must be positive)
   - Quantities (must be positive)
   - Stock levels

### Implementation Pattern
```python
from django.core.exceptions import ValidationError
from decimal import Decimal

class PositiveNumberValidator:
    """
    Validates that number is positive (> 0).
    
    Use for:
    - Prices
    - Quantities
    - Stock levels
    - Counts
    
    Set allow_zero=True to accept 0 as valid.
    """
    def __init__(self, allow_zero=False):
        self.allow_zero = allow_zero
        self.message = "Value must be positive." if not allow_zero else "Value must be zero or positive."
    
    def __call__(self, value):
        try:
            num = Decimal(str(value))
            if self.allow_zero:
                if num < 0:
                    raise ValidationError(self.message)
            else:
                if num <= 0:
                    raise ValidationError(self.message)
        except (ValueError, TypeError):
            raise ValidationError("Invalid number format.")
```

### Verification Checklist
- [ ] PositiveNumberValidator class defined
- [ ] Handles numeric types
- [ ] allow_zero parameter supported
- [ ] Use cases documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 33 | Create validators Module | validators/ directory |
| 34 | Create validators __init__.py | Package initialization |
| 35 | Create EmailValidator | Email validation |
| 36 | Create URLValidator | URL validation |
| 37 | Create SlugValidator | Slug format validation |
| 38 | Create PositiveNumberValidator | Positive number validation |

### Module Structure After This Document
```
backend/apps/core/
└── validators/
    ├── __init__.py          # Package initialization
    └── common.py            # Basic validators
        ├── EmailValidator
        ├── URLValidator
        ├── SlugValidator
        └── PositiveNumberValidator
```

### Next Steps
Proceed to [02_Tasks-39-44_Numeric-File-Validators.md](02_Tasks-39-44_Numeric-File-Validators.md) to implement:
- DecimalValidator
- PercentageValidator
- FileSizeValidator
- ImageDimensionValidator
- FileExtensionValidator
- JSONValidator

---

## Notes for AI Agents

1. **Execution Order:** Tasks 33-38 must be executed in sequence
2. **Error Messages:** Make error messages clear and user-friendly
3. **Reusability:** These validators will be used across all apps
4. **Testing:** Full unit tests in Group F, Task 82
5. **Django Integration:** All validators compatible with Django forms and DRF serializers
