# Tasks 01-02: Middleware Directory Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 06 - Core Middleware Stack  
> **Group:** A - Middleware Infrastructure  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** None (First Document)
- **→ Next Document:** [02_Tasks-03-06_Base-Middleware-Class.md](02_Tasks-03-06_Base-Middleware-Class.md)

---

## Document Overview

This document covers the creation of the middleware package structure within the core app. This establishes the foundation for all custom middleware components in the Django application.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Create middleware Directory | Simple |
| 02 | Create middleware __init__.py | Simple |

---

## Task 01: Create middleware Directory

### Overview
Create the middleware directory within the core app to house all custom middleware classes. This directory will contain the base middleware class, utility functions, and all specialized middleware implementations.

### Dependencies
- Core app structure (apps/core/) must exist

### Instructions

1. **Navigate to core app directory**
   - Change to the `backend/apps/core/` directory
   - Verify that the core app exists

2. **Create the middleware directory**
   - Create directory named `middleware`
   - Ensure proper naming convention (lowercase, singular)

3. **Verify directory structure**
   - Check that the middleware directory is at the correct location
   - Confirm parent directories exist

### Directory Purpose

| Aspect | Description |
|--------|-------------|
| **Location** | `backend/apps/core/middleware/` |
| **Purpose** | Container for all middleware components |
| **Contents** | Base classes, utilities, middleware implementations |
| **Pattern** | Django package structure |

### Middleware Directory Contents
The middleware package will eventually contain:
- `base.py` - Base middleware abstract class
- `utils.py` - Utility functions for middleware
- Individual middleware implementation files
- `__init__.py` - Package initialization and exports

### Expected Outcome
```
backend/apps/core/
├── __init__.py
├── apps.py
├── models.py
├── views.py
└── middleware/              # New directory
```

### Verification Checklist
- [ ] `middleware/` directory exists in `apps/core/`
- [ ] Directory path is `backend/apps/core/middleware/`
- [ ] Directory is empty and ready for files
- [ ] Parent directory structure is intact

---

## Task 02: Create middleware __init__.py

### Overview
Create the `__init__.py` file to mark the middleware directory as a Python package. This file will export all middleware classes for convenient importing throughout the application.

### Dependencies
- Task 01: Create middleware Directory

### Instructions

1. **Create the __init__.py file**
   - Create file named `__init__.py` in the middleware directory
   - File can start empty or with docstring

2. **Add package docstring**
   - Add module-level docstring describing the package
   - Document the purpose of the middleware package
   - Include examples of what middleware will be included

3. **Prepare export structure**
   - Add placeholder comment for future imports
   - Document the export pattern to be used
   - Follow Django middleware conventions

4. **Add future import statements**
   - Prepare structure for importing middleware classes
   - Use `__all__` list for explicit exports
   - Document which middleware will be exported

### File Structure

```python
"""
Core Middleware Package

This package contains all custom middleware for the LankaCommerce Cloud platform.

Middleware Classes:
- BaseMiddleware: Abstract base class for all middleware
- TenantMiddleware: Multi-tenancy support
- RequestLoggingMiddleware: Request/response logging
- PerformanceMiddleware: Performance monitoring
- SecurityMiddleware: Additional security headers
- CORSMiddleware: CORS policy enforcement

Usage:
    from apps.core.middleware import TenantMiddleware, RequestLoggingMiddleware
    
    # Middleware is configured in settings.MIDDLEWARE list
"""

# Middleware exports will be added as classes are created
__all__ = [
    # 'BaseMiddleware',
    # 'TenantMiddleware',
    # 'RequestLoggingMiddleware',
    # 'PerformanceMiddleware',
    # 'SecurityMiddleware',
    # 'CORSMiddleware',
]

# Future imports:
# from .base import BaseMiddleware
# from .tenant import TenantMiddleware
# from .logging import RequestLoggingMiddleware
# from .performance import PerformanceMiddleware
# from .security import SecurityMiddleware
# from .cors import CORSMiddleware
```

### Export Pattern

| Aspect | Implementation |
|--------|----------------|
| **Import Style** | From-import for classes |
| **Export List** | Use `__all__` for explicit control |
| **Documentation** | Module-level docstring with usage |
| **Conventions** | Follow Django middleware patterns |

### Django Middleware Conventions
- Middleware classes follow new-style middleware (Django 1.10+)
- Each middleware has `__init__(get_response)` method
- Each middleware has `__call__(request)` method
- Optional: `process_view`, `process_exception`, `process_template_response`
- Middleware is registered in `settings.MIDDLEWARE` list
- Order matters - middleware is executed top-to-bottom for requests

### Package Benefits
| Benefit | Description |
|---------|-------------|
| **Organization** | Logical grouping of related middleware |
| **Encapsulation** | Clean namespace separation |
| **Discoverability** | Central location for all middleware |
| **Reusability** | Easy importing across the application |
| **Maintainability** | Clear structure for future additions |

### Expected Outcome
```
backend/apps/core/middleware/
├── __init__.py              # Package marker with exports
```

### Verification Checklist
- [ ] `__init__.py` file exists in `middleware/` directory
- [ ] File contains module-level docstring
- [ ] `__all__` list is defined (even if empty/commented)
- [ ] File documents middleware classes to be created
- [ ] File follows Django middleware conventions
- [ ] Import pattern is documented for future use
- [ ] Python can recognize `middleware` as a package

---

## Group Progress

### Completed Tasks
- [x] Task 01: Create middleware Directory
- [x] Task 02: Create middleware __init__.py

### Upcoming Tasks
- [ ] Task 03: Create Base Middleware Class
- [ ] Task 04: Add process_request Method
- [ ] Task 05: Add process_response Method
- [ ] Task 06: Add process_exception Method
- [ ] Task 07: Create Middleware Utilities
- [ ] Task 08: Add get_client_ip Utility
- [ ] Task 09: Add get_user_agent Utility
- [ ] Task 10: Add generate_request_id
- [ ] Task 11: Create Middleware Settings
- [ ] Task 12: Define Middleware Constants
- [ ] Task 13: Document Middleware Order
- [ ] Task 14: Test Base Infrastructure

---

## Final Structure After These Tasks

```
backend/apps/core/
├── __init__.py
├── apps.py
├── models.py
├── views.py
└── middleware/
    └── __init__.py          # Package initialization with exports
```

---

## Next Steps

1. **Continue to Next Document:** [02_Tasks-03-06_Base-Middleware-Class.md](02_Tasks-03-06_Base-Middleware-Class.md)
   - Create BaseMiddleware abstract class
   - Implement process_request hook
   - Implement process_response hook
   - Implement process_exception hook

2. **Reference Documentation:**
   - Django Middleware Documentation: https://docs.djangoproject.com/en/stable/topics/http/middleware/
   - Python Package Structure: https://docs.python.org/3/tutorial/modules.html#packages

---

## Notes

- The middleware package follows Django's new-style middleware pattern (MIDDLEWARE setting)
- All custom middleware will inherit from BaseMiddleware for consistency
- Middleware order in settings.MIDDLEWARE is critical for proper execution
- This directory structure supports future expansion with multiple middleware files
- The `__init__.py` file makes importing clean: `from apps.core.middleware import ClassName`

---

**Document Status:** ✅ Complete  
**Last Updated:** 2026-01-23
