# Tasks 01-02: Exception Module Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** A - Exception Infrastructure  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** None (First Document)
- **→ Next Document:** [02_Tasks-03-08_Base-Exception-Class.md](02_Tasks-03-08_Base-Exception-Class.md)

---

## Document Overview

This document covers the setup of the exceptions module within the core Django app. We'll create the package structure that will house all exception classes, handlers, and utilities.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create exceptions Module | Simple |
| 02 | Create exceptions __init__.py | Simple |

---

## Task 01: Create exceptions Module

### Overview
Create the exceptions package directory within the core Django app. This module will contain all custom exception classes, handlers, and related utilities.

### Dependencies
- Core Django app exists at `backend/apps/core/`

### Instructions

1. **Navigate to the core app directory**
   ```bash
   cd backend/apps/core/
   ```

2. **Create the exceptions directory**
   ```bash
   mkdir exceptions
   ```

3. **Verify directory creation**
   ```bash
   ls -la exceptions/
   ```

### Expected Outcome
```
backend/apps/core/
├── __init__.py
├── models.py
├── views.py
└── exceptions/           # New directory
```

### Verification Checklist
- [ ] `exceptions/` directory exists under `apps/core/`
- [ ] Directory is at correct path: `backend/apps/core/exceptions/`
- [ ] Directory is empty and ready for module files

---

## Task 02: Create exceptions __init__.py

### Overview
Create the `__init__.py` file that makes the exceptions directory a Python package. This file will also serve as the central export point for all exception classes, making imports cleaner throughout the application.

### Dependencies
- Task 01: exceptions module directory exists

### Instructions

1. **Create the __init__.py file**
   - Create file named `__init__.py` in the exceptions directory
   - File path: `backend/apps/core/exceptions/__init__.py`

2. **Add module docstring**
   ```python
   """
   Exception Handling Module
   
   This module provides custom exception classes and handlers for the
   LankaCommerce Cloud API. All exceptions inherit from APIException base class.
   
   Usage:
       from apps.core.exceptions import ValidationException
       
       raise ValidationException(
           message="Invalid input data",
           details={"field": "email"}
       )
   """
   ```

3. **Add imports placeholder comment**
   ```python
   # Exception classes will be imported here as they are created
   # Example:
   # from .base import APIException
   # from .api_exceptions import ValidationException, NotFoundException
   # from .handlers import custom_exception_handler
   # from .response import ErrorResponse
   ```

4. **Add __all__ placeholder**
   ```python
   __all__ = [
       # Will be populated as exception classes are created
   ]
   ```

5. **Add version information**
   ```python
   __version__ = '1.0.0'
   ```

### File Content Structure

| Section | Purpose |
|---------|---------|
| **Module Docstring** | Describes the module and usage examples |
| **Imports** | Centralized imports of all exception classes |
| **__all__** | Explicitly defines public API |
| **Version** | Module version for tracking |

### Expected Outcome
```
backend/apps/core/exceptions/
└── __init__.py              # Package initialization file
```

### Complete File Example
```python
"""
Exception Handling Module

This module provides custom exception classes and handlers for the
LankaCommerce Cloud API. All exceptions inherit from APIException base class.

Usage:
    from apps.core.exceptions import ValidationException
    
    raise ValidationException(
        message="Invalid input data",
        details={"field": "email"}
    )
"""

# Exception classes will be imported here as they are created
# Example:
# from .base import APIException
# from .api_exceptions import ValidationException, NotFoundException
# from .handlers import custom_exception_handler
# from .response import ErrorResponse

__all__ = [
    # Will be populated as exception classes are created
]

__version__ = '1.0.0'
```

### Verification Checklist
- [ ] `__init__.py` file exists in exceptions directory
- [ ] File contains module docstring
- [ ] File contains import placeholder comments
- [ ] File contains __all__ list
- [ ] File contains version information
- [ ] File is a valid Python file (no syntax errors)

---

## Integration Notes

### Import Pattern
Once exception classes are created, they will be imported following this pattern:
```python
from apps.core.exceptions import (
    ValidationException,
    AuthenticationException,
    PermissionDeniedException,
    NotFoundException,
)
```

### Benefits of Central Exports
1. **Cleaner Imports:** Single import location for all exceptions
2. **Encapsulation:** Internal module structure hidden from consumers
3. **Flexibility:** Can reorganize internal files without breaking imports
4. **Discoverability:** __all__ list shows available exceptions

### Module Organization
The exceptions module will eventually contain:
- `base.py` - Base exception class (APIException)
- `error_codes.py` - Error code constants and mappings
- `api_exceptions.py` - Custom exception classes
- `handlers.py` - Global exception handler
- `response.py` - ErrorResponse formatting class
- `logging.py` - Error logging utilities

---

## Common Issues and Solutions

### Issue: ModuleNotFoundError
**Problem:** Cannot import from exceptions module
**Solution:** Ensure __init__.py exists and Python can find the package

### Issue: Circular Import
**Problem:** Exceptions import from modules that import exceptions
**Solution:** Use late imports or restructure to avoid circular dependencies

### Issue: Import Path Not Found
**Problem:** `from apps.core.exceptions import ...` fails
**Solution:** Ensure `backend/` is in PYTHONPATH and apps.core is in INSTALLED_APPS

---

## Next Steps

After completing these tasks, proceed to:
1. **Task 03-08:** Create the APIException base class in `base.py`
2. **Task 09-11:** Define error code constants in `error_codes.py`
3. **Task 12-14:** Create exception registry and tests

The module structure is now ready to house the exception infrastructure.

---

## Notes for AI Agents

- **Package Init:** The __init__.py is intentionally minimal at this stage
- **Export Pattern:** Use __all__ to control public API surface
- **Documentation:** Include usage examples in docstrings
- **Version Tracking:** Increment version when making breaking changes
- **Import Order:** Will import base classes before derived classes
- **Circular Imports:** Keep imports in __init__.py only, avoid in other files
- **Testing:** Module should be importable: `import apps.core.exceptions`
