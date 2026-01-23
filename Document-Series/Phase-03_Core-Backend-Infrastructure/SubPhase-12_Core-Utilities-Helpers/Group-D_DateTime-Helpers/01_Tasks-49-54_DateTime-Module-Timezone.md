# Tasks 49-54: DateTime Module & Timezone Helpers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** D - Date/Time Helpers  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Common-Validators/](../Group-C_Common-Validators/)
- **→ Next Document:** [02_Tasks-55-62_Date-Utils-Export-Testing.md](02_Tasks-55-62_Date-Utils-Export-Testing.md)

---

## Document Overview

This document covers the creation of the datetime module and timezone conversion helpers specifically for Sri Lankan timezone (Asia/Colombo, UTC+5:30).

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Create datetime Module | Low |
| 50 | Create datetime __init__.py | Low |
| 51 | Create timezone.py File | Low |
| 52 | Add get_local_now Function | Medium |
| 53 | Add convert_to_utc Function | Medium |
| 54 | Add convert_to_local Function | Medium |

---

## Task 49: Create datetime Module

### Overview
Create the datetime module directory within the core app to house timezone utilities and date helper functions for Sri Lankan context.

### Dependencies
- Group C: Common Validators (completed)

### Instructions

1. **Navigate to core app directory**
   - Go to `backend/apps/core/` directory

2. **Create datetime directory**
   - Create new directory named `datetime`
   - Note: Different from Python's datetime module

3. **Plan module organization**
   - `timezone.py`: Timezone conversion functions
   - `date_utils.py`: Date range and formatting utilities
   - `__init__.py`: Package initialization

### Expected Structure
```
backend/apps/core/
├── pagination/
├── filters/
├── validators/
└── datetime/                # New directory
```

### Verification Checklist
- [ ] datetime/ directory created
- [ ] Directory at correct location
- [ ] Ready for utility files

---

## Task 50: Create datetime __init__.py

### Overview
Create the `__init__.py` file to make datetime a Python package and prepare for exports.

### Dependencies
- Task 49: Create datetime Module

### Instructions

1. **Create __init__.py file**
   - In datetime/ directory

2. **Add module docstring**
   - Document timezone: Asia/Colombo (UTC+5:30)
   - List utility categories

3. **Add version and __all__**
   - Set version to '1.0.0'
   - Prepare empty __all__ list

### File Structure
```python
"""
Date and time utilities for LankaCommerce Cloud.

Sri Lankan timezone: Asia/Colombo (UTC+5:30)
No daylight saving time

Utilities:
    - Timezone conversion (UTC ↔ Asia/Colombo)
    - Date range helpers
    - Date formatting (DD/MM/YYYY)
    - Fiscal year helpers (April-March)
"""

__version__ = '1.0.0'

__all__ = []  # Will populate in Task 61
```

### Verification Checklist
- [ ] __init__.py file created
- [ ] Module docstring present
- [ ] Sri Lankan timezone documented
- [ ] Version attribute defined

---

## Task 51: Create timezone.py File

### Overview
Create the timezone.py file that will contain timezone conversion functions for Sri Lankan timezone.

### Dependencies
- Task 50: Create datetime __init__.py

### Instructions

1. **Create timezone.py file**
   - In datetime/ directory
   - Location: `backend/apps/core/datetime/timezone.py`

2. **Add file docstring**
   - Explain timezone conversion purpose
   - Note Sri Lankan timezone details

3. **Import required dependencies**
   - Import `datetime`, `timezone` from Python
   - Import `pytz` for timezone handling
   - Import Django's timezone utilities

4. **Define timezone constant**
   - `SL_TIMEZONE = pytz.timezone('Asia/Colombo')`
   - Central constant for all conversions

### File Structure
```python
"""
Timezone utilities for Sri Lankan context.

Timezone: Asia/Colombo (UTC+5:30)
No daylight saving time changes
"""

import pytz
from datetime import datetime
from django.utils import timezone as django_tz

# Sri Lankan timezone constant
SL_TIMEZONE = pytz.timezone('Asia/Colombo')
```

### Sri Lankan Timezone Details

| Property | Value |
|----------|-------|
| **Timezone Name** | Asia/Colombo |
| **UTC Offset** | +5:30 |
| **Daylight Saving** | None (fixed offset) |
| **Format** | YYYY-MM-DD HH:MM:SS+05:30 |

### Verification Checklist
- [ ] timezone.py file created
- [ ] File docstring present
- [ ] Required imports added
- [ ] SL_TIMEZONE constant defined

---

## Task 52: Add get_local_now Function

### Overview
Create a function that returns the current date/time in Sri Lankan timezone, useful for displaying current time to users.

### Dependencies
- Task 51: Create timezone.py File

### Instructions

1. **Create get_local_now function**
   - In timezone.py file
   - No parameters needed
   - Returns timezone-aware datetime

2. **Implementation logic**
   - Get current UTC time
   - Convert to Asia/Colombo timezone
   - Return timezone-aware datetime object

3. **Add function docstring**
   - Explain return value
   - Show example usage

### Implementation Pattern
```python
def get_local_now():
    """
    Get current date/time in Sri Lankan timezone.
    
    Returns:
        datetime: Current datetime in Asia/Colombo timezone
    
    Example:
        >>> local_now = get_local_now()
        >>> print(local_now)
        2026-01-23 14:30:00+05:30
    """
    return django_tz.now().astimezone(SL_TIMEZONE)
```

### Use Cases

| Scenario | Usage |
|----------|-------|
| **Display current time** | Show "Current time: 2:30 PM" |
| **Default timestamps** | Default value for datetime fields |
| **Activity logs** | "Action performed at..." |
| **System time display** | Dashboard clocks |

### Verification Checklist
- [ ] get_local_now function defined
- [ ] Returns timezone-aware datetime
- [ ] Docstring with example
- [ ] Use cases clear

---

## Task 53: Add convert_to_utc Function

### Overview
Create a function that converts a Sri Lankan local datetime to UTC for database storage.

### Dependencies
- Task 52: Add get_local_now Function

### Instructions

1. **Create convert_to_utc function**
   - In timezone.py file
   - Parameter: local_datetime (Sri Lankan time)
   - Returns: UTC datetime

2. **Implementation logic**
   - If already timezone-aware: convert to UTC
   - If naive: localize to SL_TIMEZONE first, then convert to UTC
   - Handle both aware and naive datetimes

3. **Add function docstring**
   - Document parameter and return value
   - Show example usage
   - Note database storage best practice

### Implementation Pattern
```python
def convert_to_utc(local_datetime):
    """
    Convert Sri Lankan local datetime to UTC.
    
    Use for: Database storage (always store in UTC)
    
    Args:
        local_datetime: Datetime in Asia/Colombo or naive
    
    Returns:
        datetime: Timezone-aware datetime in UTC
    
    Example:
        >>> sl_time = datetime(2026, 1, 23, 14, 30)
        >>> utc_time = convert_to_utc(sl_time)
        >>> print(utc_time)
        2026-01-23 09:00:00+00:00
    """
    if local_datetime.tzinfo is None:
        # Naive datetime, assume Sri Lankan time
        local_datetime = SL_TIMEZONE.localize(local_datetime)
    
    return local_datetime.astimezone(pytz.UTC)
```

### Best Practice: Database Storage

| Storage Location | Timezone |
|-----------------|----------|
| **Database** | Always UTC |
| **API Response** | UTC or local (client converts) |
| **Display to User** | Asia/Colombo |
| **Logs** | UTC (for correlation) |

### Use Cases

| Scenario | Example |
|----------|---------|
| **Save to DB** | Convert user input to UTC before saving |
| **API input** | Convert received local time to UTC |
| **Audit logs** | Store action time in UTC |

### Verification Checklist
- [ ] convert_to_utc function defined
- [ ] Handles aware datetimes
- [ ] Handles naive datetimes
- [ ] Docstring with examples
- [ ] Best practices documented

---

## Task 54: Add convert_to_local Function

### Overview
Create a function that converts UTC datetime to Sri Lankan local time for display to users.

### Dependencies
- Task 53: Add convert_to_utc Function

### Instructions

1. **Create convert_to_local function**
   - In timezone.py file
   - Parameter: utc_datetime
   - Returns: Asia/Colombo datetime

2. **Implementation logic**
   - Convert UTC to Asia/Colombo timezone
   - Handle naive datetimes (assume UTC)
   - Return timezone-aware local datetime

3. **Add function docstring**
   - Document parameter and return value
   - Show example usage
   - Note display use cases

### Implementation Pattern
```python
def convert_to_local(utc_datetime):
    """
    Convert UTC datetime to Sri Lankan local time.
    
    Use for: Displaying dates/times to users
    
    Args:
        utc_datetime: Datetime in UTC or naive (assumed UTC)
    
    Returns:
        datetime: Timezone-aware datetime in Asia/Colombo
    
    Example:
        >>> utc_time = datetime(2026, 1, 23, 9, 0, tzinfo=pytz.UTC)
        >>> local_time = convert_to_local(utc_time)
        >>> print(local_time)
        2026-01-23 14:30:00+05:30
    """
    if utc_datetime.tzinfo is None:
        # Naive datetime, assume UTC
        utc_datetime = pytz.UTC.localize(utc_datetime)
    
    return utc_datetime.astimezone(SL_TIMEZONE)
```

### Use Cases

| Scenario | Example |
|----------|---------|
| **API Response** | Convert DB time to local for response |
| **Display timestamp** | Show "Created at: 23 Jan 2026, 2:30 PM" |
| **Reports** | Display report data in local time |
| **Email notifications** | Time references in emails |

### Conversion Examples

| UTC Time | Sri Lankan Time | Difference |
|----------|----------------|------------|
| 00:00 UTC | 05:30 IST | +5:30 |
| 09:00 UTC | 14:30 IST | +5:30 |
| 18:30 UTC | 00:00 IST (next day) | +5:30 |
| 23:00 UTC | 04:30 IST (next day) | +5:30 |

### Verification Checklist
- [ ] convert_to_local function defined
- [ ] Handles aware datetimes
- [ ] Handles naive datetimes
- [ ] Docstring with examples
- [ ] Use cases documented

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 49 | Create datetime Module | datetime/ directory |
| 50 | Create datetime __init__.py | Package initialization |
| 51 | Create timezone.py File | Timezone utilities file |
| 52 | Add get_local_now Function | Current Sri Lankan time |
| 53 | Add convert_to_utc Function | Local to UTC conversion |
| 54 | Add convert_to_local Function | UTC to local conversion |

### Module Structure After This Document
```
backend/apps/core/
└── datetime/
    ├── __init__.py          # Package initialization
    └── timezone.py          # Timezone functions
        ├── SL_TIMEZONE constant
        ├── get_local_now()
        ├── convert_to_utc()
        └── convert_to_local()
```

### Timezone Functions Summary

| Function | Input | Output | Use Case |
|----------|-------|--------|----------|
| `get_local_now()` | None | Current SL time | Display current time |
| `convert_to_utc(dt)` | SL datetime | UTC datetime | Database storage |
| `convert_to_local(dt)` | UTC datetime | SL datetime | Display to users |

### Sri Lankan Timezone Reference
- **Timezone:** Asia/Colombo
- **UTC Offset:** +5:30 (fixed, no DST)
- **Date Format:** DD/MM/YYYY (Task 59-60)
- **Fiscal Year:** April to March (Task 56-58)

### Next Steps
Proceed to [02_Tasks-55-62_Date-Utils-Export-Testing.md](02_Tasks-55-62_Date-Utils-Export-Testing.md) to implement:
- Date range helpers (day, month, year)
- Date formatting (DD/MM/YYYY)
- Datetime formatting
- Export and testing

---

## Notes for AI Agents

1. **Critical:** Always store UTC in database, convert to local for display
2. **No DST:** Sri Lanka has fixed UTC+5:30 offset year-round
3. **pytz Required:** Ensure pytz is in requirements
4. **Django Integration:** Works with Django's timezone utilities
5. **Testing:** Full tests in Group F, Task 83
6. **Next Document:** Date range and formatting helpers
