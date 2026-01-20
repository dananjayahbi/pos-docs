# Group F: Validators & Utilities

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 03 - Base Models & Mixins  
> **Group:** F of F  
> **Tasks Covered:** 75-94  
> **Group Goal:** Create custom validators, fields, and utility functions

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-E_UUID-TenantScoped-Models/](../Group-E_UUID-TenantScoped-Models/)
- **→ Next SubPhase:** [../../SubPhase-04_User-Model-Authentication/](../../SubPhase-04_User-Model-Authentication/)

---

## Group Overview

This group creates Sri Lankan-specific validators, custom model fields for common use cases, and utility functions for the platform.

### Key Outcomes
- Create validators.py file
- Create PhoneNumberValidator (Sri Lankan format)
- Create NICValidator (National ID Card)
- Create BRNValidator (Business Registration)
- Create PositiveDecimalValidator
- Create PercentageValidator
- Create fields.py file
- Create MoneyField with precision
- Create PercentageField
- Create PhoneNumberField
- Create SlugField with auto-generation
- Create utils.py file
- Create generate_unique_code function
- Create get_current_tenant function
- Create get_current_user function
- Export all validators and fields
- Create initial migrations
- Create full test suite
- Document all utilities

### Technology Context
- **Validators:** Django field validators
- **Custom Fields:** Subclass model fields
- **Sri Lankan Formats:** NIC, phone numbers

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-75-80_Validators.md | 75-80 | validators.py, phone, NIC, BRN, positive decimal, percentage |
| 02 | 02_Tasks-81-85_Custom-Fields.md | 81-85 | fields.py, MoneyField, PercentageField, PhoneField, SlugField |
| 03 | 03_Tasks-86-90_Utils-Exports.md | 86-90 | utils.py, unique code, current tenant/user, exports |
| 04 | 04_Tasks-91-94_Migrations-Tests-Docs.md | 91-94 | Export all, migrations, full tests, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 75 | Create validators.py File | Task 74 | Simple |
| 76 | Create PhoneNumberValidator | Task 75 | Medium |
| 77 | Create NICValidator | Task 76 | Medium |
| 78 | Create BRNValidator | Task 77 | Medium |
| 79 | Create PositiveDecimalValidator | Task 78 | Simple |
| 80 | Create PercentageValidator | Task 79 | Simple |
| 81 | Create fields.py File | Task 80 | Simple |
| 82 | Create MoneyField | Task 81 | Medium |
| 83 | Create PercentageField | Task 82 | Medium |
| 84 | Create PhoneNumberField | Task 83 | Medium |
| 85 | Create SlugField with Auto | Task 84 | Medium |
| 86 | Create utils.py File | Task 85 | Simple |
| 87 | Create generate_unique_code | Task 86 | Medium |
| 88 | Create get_current_tenant | Task 87 | Simple |
| 89 | Create get_current_user | Task 88 | Medium |
| 90 | Export All Validators | Task 89 | Simple |
| 91 | Export All Fields | Task 90 | Simple |
| 92 | Create Initial Migration | Task 91 | Medium |
| 93 | Create Full Test Suite | Task 92 | Medium |
| 94 | Document All Base Models | Task 93 | Medium |

---

## Execution Order

```
01_Tasks-75-80_Validators.md
        │
        ▼
02_Tasks-81-85_Custom-Fields.md
        │
        ▼
03_Tasks-86-90_Utils-Exports.md
        │
        ▼
04_Tasks-91-94_Migrations-Tests-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/apps/core/
├── validators/
│   ├── __init__.py
│   └── validators.py
├── fields/
│   ├── __init__.py
│   └── fields.py
├── utils/
│   ├── __init__.py
│   └── utils.py
├── tests/
│   ├── test_validators.py
│   ├── test_fields.py
│   └── test_utils.py
└── migrations/
    └── 0001_initial.py
```

---

## Sri Lankan Validators

```python
# apps/core/validators/validators.py
import re
from django.core.exceptions import ValidationError

class PhoneNumberValidator:
    """
    Validate Sri Lankan phone numbers.
    Formats: 07XXXXXXXX, +947XXXXXXXX, 947XXXXXXXX
    """
    regex = r'^(?:\+94|94|0)?7[0-9]{8}$'
    
    def __call__(self, value):
        if not re.match(self.regex, str(value)):
            raise ValidationError(
                'Enter a valid Sri Lankan mobile number.'
            )

class NICValidator:
    """
    Validate Sri Lankan National ID Card numbers.
    Old format: 9 digits + V/X
    New format: 12 digits
    """
    old_regex = r'^[0-9]{9}[VvXx]$'
    new_regex = r'^[0-9]{12}$'
    
    def __call__(self, value):
        value = str(value).strip()
        if not (re.match(self.old_regex, value) or 
                re.match(self.new_regex, value)):
            raise ValidationError(
                'Enter a valid NIC number (old: 9 digits + V/X, new: 12 digits).'
            )

class BRNValidator:
    """Validate Sri Lankan Business Registration Number."""
    regex = r'^[A-Z]{2}[0-9]+$'
    
    def __call__(self, value):
        if not re.match(self.regex, str(value).upper()):
            raise ValidationError(
                'Enter a valid Business Registration Number.'
            )
```

---

## Custom Fields

```python
# apps/core/fields/fields.py
from django.db import models
from decimal import Decimal

class MoneyField(models.DecimalField):
    """Field for monetary values with proper precision."""
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_digits', 15)
        kwargs.setdefault('decimal_places', 2)
        kwargs.setdefault('default', Decimal('0.00'))
        super().__init__(*args, **kwargs)

class PercentageField(models.DecimalField):
    """Field for percentage values (0-100)."""
    def __init__(self, *args, **kwargs):
        kwargs.setdefault('max_digits', 5)
        kwargs.setdefault('decimal_places', 2)
        kwargs.setdefault('default', Decimal('0.00'))
        super().__init__(*args, **kwargs)
```

---

## Utility Functions

```python
# apps/core/utils/utils.py
import secrets
from django.db import connection

def generate_unique_code(prefix='', length=8):
    """Generate a unique alphanumeric code."""
    code = secrets.token_hex(length // 2).upper()
    return f"{prefix}{code}" if prefix else code

def get_current_tenant():
    """Get the current tenant from connection."""
    return getattr(connection, 'tenant', None)

def get_current_user():
    """Get the current user from thread-local storage."""
    from threading import local
    _thread_locals = local()
    return getattr(_thread_locals, 'user', None)
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group E complete
2. **Sri Lankan:** Phone, NIC, BRN validators
3. **MoneyField:** 2 decimal places for LKR
4. **Thread-Local:** For current user access
5. **Migrations:** Generate after all models done
6. **Final Group:** Complete documentation
7. **Git Commit:** Commit after completing SubPhase-03

