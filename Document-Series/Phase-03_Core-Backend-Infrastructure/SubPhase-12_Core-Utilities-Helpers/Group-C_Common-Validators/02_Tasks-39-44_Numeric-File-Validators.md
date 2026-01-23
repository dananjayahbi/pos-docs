# Tasks 39-44: Numeric & File Validators

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** C - Common Validators  
> **Document:** 02 of 03  
> **Tasks Covered:** 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-33-38_Validators-Module-Basic.md](01_Tasks-33-38_Validators-Module-Basic.md)
- **→ Next Document:** [03_Tasks-45-48_TenantUnique-Export-Testing.md](03_Tasks-45-48_TenantUnique-Export-Testing.md)

---

## Document Overview

This document covers numeric validators for decimals and percentages, plus file validators for size, dimensions, and extensions.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 39 | Create DecimalValidator | Medium |
| 40 | Create PercentageValidator | Low |
| 41 | Create FileSizeValidator | Medium |
| 42 | Create ImageDimensionValidator | Medium |
| 43 | Create FileExtensionValidator | Medium |
| 44 | Create JSONValidator | Medium |

---

## Task 39: Create DecimalValidator

### Overview
Create a validator for decimal fields with configurable precision (max digits and decimal places), commonly used for prices, percentages, and measurements.

### Dependencies
- Task 38: Create PositiveNumberValidator

### Instructions

1. **Create DecimalValidator class**
   - In common.py file
   - Validate decimal precision

2. **Configure parameters**
   - `max_digits`: Total digits (default 10)
   - `decimal_places`: Decimal places (default 2)
   - Example: 99999999.99 (10 digits, 2 decimal)

3. **Add validation rules**
   - Check total digit count
   - Check decimal place count
   - Handle Decimal type conversion

4. **Document use cases**
   - Prices: max_digits=10, decimal_places=2
   - Percentages: max_digits=5, decimal_places=2
   - Quantities: max_digits=10, decimal_places=3

### Implementation Pattern
```python
from decimal import Decimal, InvalidOperation
from django.core.exceptions import ValidationError

class DecimalValidator:
    """
    Validates decimal precision.
    
    Parameters:
        max_digits: Total number of digits (default 10)
        decimal_places: Decimal places (default 2)
    
    Use cases:
        - Prices: (10, 2) → 99999999.99
        - Rates: (5, 2) → 999.99
        - Quantities: (10, 3) → 9999999.999
    """
    def __init__(self, max_digits=10, decimal_places=2):
        self.max_digits = max_digits
        self.decimal_places = decimal_places
    
    def __call__(self, value):
        # Validate decimal format and precision
        pass
```

### Verification Checklist
- [ ] DecimalValidator class defined
- [ ] max_digits parameter supported
- [ ] decimal_places parameter supported
- [ ] Use cases documented

---

## Task 40: Create PercentageValidator

### Overview
Create a validator for percentage values (0-100), with optional decimal support.

### Dependencies
- Task 39: Create DecimalValidator

### Instructions

1. **Create PercentageValidator class**
   - In common.py file
   - Validate value is 0-100

2. **Add validation rules**
   - Minimum: 0
   - Maximum: 100
   - Optional: allow decimals (99.5%)

3. **Document use cases**
   - Discount percentages
   - Tax rates
   - Completion percentages

### Implementation Pattern
```python
class PercentageValidator:
    """
    Validates percentage (0-100).
    
    Use for:
        - Discounts
        - Tax rates
        - Completion indicators
    """
    def __call__(self, value):
        try:
            num = Decimal(str(value))
            if num < 0 or num > 100:
                raise ValidationError("Percentage must be between 0 and 100.")
        except (ValueError, TypeError):
            raise ValidationError("Invalid percentage format.")
```

### Verification Checklist
- [ ] PercentageValidator class defined
- [ ] Range 0-100 validated
- [ ] Error messages clear

---

## Task 41: Create FileSizeValidator

### Overview
Create a validator for file upload size limits with configurable maximum size.

### Dependencies
- Task 40: Create PercentageValidator

### Instructions

1. **Create files.py file**
   - Create new file for file validators
   - Location: `backend/apps/core/validators/files.py`

2. **Create FileSizeValidator class**
   - Validate file size against limit

3. **Configure max size**
   - Parameter in bytes or MB
   - Default: 10MB
   - Common limits: 5MB (images), 50MB (documents)

4. **Add helpful error messages**
   - Show file size and limit in human-readable format

### Implementation Pattern
```python
from django.core.exceptions import ValidationError

class FileSizeValidator:
    """
    Validates file size.
    
    Parameters:
        max_size_mb: Maximum file size in megabytes (default 10)
    
    Use cases:
        - Images: 5MB
        - Documents: 50MB
        - Videos: 100MB
    """
    def __init__(self, max_size_mb=10):
        self.max_size_bytes = max_size_mb * 1024 * 1024
        self.max_size_mb = max_size_mb
    
    def __call__(self, file):
        if file.size > self.max_size_bytes:
            raise ValidationError(
                f"File too large. Max size: {self.max_size_mb}MB"
            )
```

### Verification Checklist
- [ ] files.py file created
- [ ] FileSizeValidator class defined
- [ ] Configurable max size
- [ ] Human-readable error messages

---

## Task 42: Create ImageDimensionValidator

### Overview
Create a validator for image dimensions (width and height), ensuring uploaded images meet size requirements.

### Dependencies
- Task 41: Create FileSizeValidator

### Instructions

1. **Create ImageDimensionValidator class**
   - In files.py file
   - Validate image width and height

2. **Configure parameters**
   - `min_width`, `max_width`
   - `min_height`, `max_height`
   - Optional: aspect ratio validation

3. **Use Pillow library**
   - Import from PIL
   - Open image and get dimensions
   - Validate against limits

4. **Document common use cases**
   - Product images: 800x800 to 2000x2000
   - Thumbnails: 100x100 to 300x300
   - Banners: 1920x400

### Implementation Pattern
```python
from PIL import Image
from django.core.exceptions import ValidationError

class ImageDimensionValidator:
    """
    Validates image dimensions.
    
    Parameters:
        min_width, max_width: Width range (pixels)
        min_height, max_height: Height range (pixels)
    
    Requires: Pillow library
    
    Use cases:
        - Product images: (800, 2000, 800, 2000)
        - Thumbnails: (100, 300, 100, 300)
    """
    def __init__(self, min_width=None, max_width=None, 
                 min_height=None, max_height=None):
        self.min_width = min_width
        self.max_width = max_width
        self.min_height = min_height
        self.max_height = max_height
    
    def __call__(self, file):
        # Validate dimensions using Pillow
        pass
```

### Verification Checklist
- [ ] ImageDimensionValidator class defined
- [ ] Width validation supported
- [ ] Height validation supported
- [ ] Pillow integration noted

---

## Task 43: Create FileExtensionValidator

### Overview
Create a validator that checks file extensions against an allowed list.

### Dependencies
- Task 42: Create ImageDimensionValidator

### Instructions

1. **Create FileExtensionValidator class**
   - In files.py file
   - Validate file extension

2. **Configure allowed extensions**
   - List parameter: `['pdf', 'docx', 'jpg']`
   - Case-insensitive matching

3. **Add validation logic**
   - Extract extension from filename
   - Check against allowed list
   - Clear error message listing allowed types

4. **Document common extension sets**
   - Images: jpg, jpeg, png, gif, webp
   - Documents: pdf, doc, docx, xls, xlsx
   - Archives: zip, rar, tar, gz

### Implementation Pattern
```python
class FileExtensionValidator:
    """
    Validates file extension.
    
    Parameters:
        allowed_extensions: List of allowed extensions
    
    Example:
        validator = FileExtensionValidator(['pdf', 'docx', 'jpg'])
    
    Common sets:
        - Images: ['jpg', 'jpeg', 'png', 'gif', 'webp']
        - Documents: ['pdf', 'doc', 'docx', 'xls', 'xlsx']
    """
    def __init__(self, allowed_extensions):
        self.allowed_extensions = [ext.lower() for ext in allowed_extensions]
    
    def __call__(self, file):
        # Extract and validate extension
        pass
```

### Verification Checklist
- [ ] FileExtensionValidator class defined
- [ ] Allowed list parameter
- [ ] Case-insensitive matching
- [ ] Common extension sets documented

---

## Task 44: Create JSONValidator

### Overview
Create a validator that ensures a string contains valid JSON, useful for JSONField validation and API inputs.

### Dependencies
- Task 43: Create FileExtensionValidator

### Instructions

1. **Create JSONValidator class**
   - In common.py file
   - Validate JSON syntax

2. **Add validation logic**
   - Parse JSON string
   - Catch JSON parsing errors
   - Return clear error message

3. **Optional schema validation**
   - Parameter for JSON schema
   - Validate structure matches schema

4. **Document use cases**
   - API configuration fields
   - Metadata storage
   - Settings JSONField

### Implementation Pattern
```python
import json
from django.core.exceptions import ValidationError

class JSONValidator:
    """
    Validates JSON syntax.
    
    Use for:
        - JSONField validation
        - API configuration
        - Metadata fields
    
    Optional: schema parameter for structure validation
    """
    def __call__(self, value):
        try:
            json.loads(value)
        except json.JSONDecodeError as e:
            raise ValidationError(f"Invalid JSON: {str(e)}")
```

### Verification Checklist
- [ ] JSONValidator class defined
- [ ] JSON parsing implemented
- [ ] Error messages clear
- [ ] Use cases documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 39 | Create DecimalValidator | Decimal precision validation |
| 40 | Create PercentageValidator | 0-100 range validation |
| 41 | Create FileSizeValidator | File size limits |
| 42 | Create ImageDimensionValidator | Image dimension validation |
| 43 | Create FileExtensionValidator | Extension whitelisting |
| 44 | Create JSONValidator | JSON syntax validation |

### Module Structure After This Document
```
backend/apps/core/
└── validators/
    ├── __init__.py
    ├── common.py
    │   ├── EmailValidator
    │   ├── URLValidator
    │   ├── SlugValidator
    │   ├── PositiveNumberValidator
    │   ├── DecimalValidator
    │   ├── PercentageValidator
    │   └── JSONValidator
    └── files.py              # New file
        ├── FileSizeValidator
        ├── ImageDimensionValidator
        └── FileExtensionValidator
```

### Next Steps
Proceed to [03_Tasks-45-48_TenantUnique-Export-Testing.md](03_Tasks-45-48_TenantUnique-Export-Testing.md) to implement:
- NoHTMLValidator
- UniqueForTenantValidator
- Export all validators
- Testing

---

## Notes for AI Agents

1. **File Validators:** Require Pillow for image dimension validation
2. **Decimal Precision:** Important for financial calculations
3. **Security:** File validators prevent upload abuse
4. **Testing:** Unit tests in Group F, Task 82
5. **Reusability:** All validators work with Django & DRF
