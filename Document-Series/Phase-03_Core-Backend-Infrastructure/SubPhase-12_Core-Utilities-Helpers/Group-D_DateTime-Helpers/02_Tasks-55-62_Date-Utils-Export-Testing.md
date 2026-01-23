# Tasks 55-62: Date Utils, Export & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** D - Date/Time Helpers  
> **Document:** 02 of 02  
> **Tasks Covered:** 55, 56, 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-49-54_DateTime-Module-Timezone.md](01_Tasks-49-54_DateTime-Module-Timezone.md)
- **→ Next Group:** [../Group-E_Sri-Lanka-Utilities/](../Group-E_Sri-Lanka-Utilities/)

---

## Document Overview

This document covers date range utilities, Sri Lankan date formatting functions, exporting all datetime helpers, and validation testing.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 55 | Create date_utils.py File | Low |
| 56 | Add get_date_range Function | Medium |
| 57 | Add get_month_range Function | Medium |
| 58 | Add get_year_range Function | Medium |
| 59 | Add format_date Function | Low |
| 60 | Add format_datetime Function | Low |
| 61 | Export Date/Time Helpers | Low |
| 62 | Test Date/Time Helpers | Medium |

---

## Task 55: Create date_utils.py File

### Overview
Create the date_utils.py file for date range helpers and formatting functions.

### Dependencies
- Task 54: Add convert_to_local Function

### Instructions

1. **Create date_utils.py file**
   - In datetime/ directory

2. **Add file docstring**
   - Document date utilities purpose
   - Note Sri Lankan date format

3. **Import dependencies**
   - Import datetime, timedelta
   - Import timezone utilities

### File Structure
```python
"""
Date utilities for LankaCommerce Cloud.

Sri Lankan date format: DD/MM/YYYY
Fiscal year: April to March
"""

from datetime import datetime, timedelta, date
from .timezone import SL_TIMEZONE, get_local_now, convert_to_local
```

### Verification Checklist
- [ ] date_utils.py file created
- [ ] File docstring present
- [ ] Required imports added

---

## Task 56: Add get_date_range Function

### Overview
Create a function that returns the start and end datetime for a given date, useful for filtering records by day.

### Dependencies
- Task 55: Create date_utils.py File

### Instructions

1. **Create get_date_range function**
   - Parameter: date object (optional, defaults to today)
   - Returns: tuple (start_datetime, end_datetime)

2. **Implementation logic**
   - Get start of day (00:00:00)
   - Get end of day (23:59:59.999999)
   - Return as Sri Lankan timezone

3. **Document use cases**
   - Daily reports
   - "Today's orders"
   - Filter by specific date

### Implementation Pattern
```python
def get_date_range(target_date=None):
    """
    Get start and end datetime for a specific date.
    
    Args:
        target_date: date object (default: today in SL timezone)
    
    Returns:
        tuple: (start_datetime, end_datetime) in SL timezone
    
    Example:
        >>> start, end = get_date_range(date(2026, 1, 23))
        >>> # Returns: 2026-01-23 00:00:00+05:30, 2026-01-23 23:59:59+05:30
    
    Use for:
        - Daily reports
        - "Today's sales"
        - Filter by specific date
    """
    if target_date is None:
        target_date = get_local_now().date()
    
    start = datetime.combine(target_date, datetime.min.time())
    end = datetime.combine(target_date, datetime.max.time())
    
    start = SL_TIMEZONE.localize(start)
    end = SL_TIMEZONE.localize(end)
    
    return start, end
```

### Verification Checklist
- [ ] get_date_range function defined
- [ ] Returns start and end datetime
- [ ] Sri Lankan timezone applied
- [ ] Use cases documented

---

## Task 57: Add get_month_range Function

### Overview
Create a function that returns the start and end datetime for a given month and year.

### Dependencies
- Task 56: Add get_date_range Function

### Instructions

1. **Create get_month_range function**
   - Parameters: year, month
   - Returns: tuple (start_datetime, end_datetime)

2. **Implementation logic**
   - First day of month at 00:00:00
   - Last day of month at 23:59:59.999999
   - Handle different month lengths

3. **Document use cases**
   - Monthly reports
   - "This month's revenue"
   - Month-based filtering

### Implementation Pattern
```python
from calendar import monthrange

def get_month_range(year, month):
    """
    Get start and end datetime for a specific month.
    
    Args:
        year: Year (int)
        month: Month (1-12)
    
    Returns:
        tuple: (start_datetime, end_datetime) in SL timezone
    
    Example:
        >>> start, end = get_month_range(2026, 1)
        >>> # Returns: 2026-01-01 00:00:00+05:30, 2026-01-31 23:59:59+05:30
    
    Use for:
        - Monthly reports
        - "This month's sales"
        - Month-based analytics
    """
    first_day = date(year, month, 1)
    last_day_num = monthrange(year, month)[1]
    last_day = date(year, month, last_day_num)
    
    start = datetime.combine(first_day, datetime.min.time())
    end = datetime.combine(last_day, datetime.max.time())
    
    start = SL_TIMEZONE.localize(start)
    end = SL_TIMEZONE.localize(end)
    
    return start, end
```

### Verification Checklist
- [ ] get_month_range function defined
- [ ] Handles all month lengths correctly
- [ ] Returns timezone-aware datetimes
- [ ] Use cases documented

---

## Task 58: Add get_year_range Function

### Overview
Create a function that returns the start and end datetime for a given year, supporting both calendar year and Sri Lankan fiscal year (April-March).

### Dependencies
- Task 57: Add get_month_range Function

### Instructions

1. **Create get_year_range function**
   - Parameters: year, fiscal (default False)
   - Returns: tuple (start_datetime, end_datetime)

2. **Implementation logic**
   - If fiscal=False: Jan 1 to Dec 31
   - If fiscal=True: April 1 to March 31 next year
   - Apply Sri Lankan timezone

3. **Document fiscal year**
   - Sri Lankan fiscal year: April to March
   - Used for financial reporting

### Implementation Pattern
```python
def get_year_range(year, fiscal=False):
    """
    Get start and end datetime for a specific year.
    
    Args:
        year: Year (int)
        fiscal: If True, use fiscal year (April-March)
    
    Returns:
        tuple: (start_datetime, end_datetime) in SL timezone
    
    Sri Lankan Fiscal Year: April 1 to March 31
    
    Examples:
        >>> # Calendar year
        >>> start, end = get_year_range(2026)
        >>> # Returns: 2026-01-01 to 2026-12-31
        
        >>> # Fiscal year
        >>> start, end = get_year_range(2026, fiscal=True)
        >>> # Returns: 2026-04-01 to 2027-03-31
    """
    if fiscal:
        # Fiscal year: April to March
        start_date = date(year, 4, 1)
        end_date = date(year + 1, 3, 31)
    else:
        # Calendar year: January to December
        start_date = date(year, 1, 1)
        end_date = date(year, 12, 31)
    
    start = datetime.combine(start_date, datetime.min.time())
    end = datetime.combine(end_date, datetime.max.time())
    
    start = SL_TIMEZONE.localize(start)
    end = SL_TIMEZONE.localize(end)
    
    return start, end
```

### Verification Checklist
- [ ] get_year_range function defined
- [ ] Supports calendar year
- [ ] Supports fiscal year (April-March)
- [ ] Fiscal year documented

---

## Task 59: Add format_date Function

### Overview
Create a function to format dates in Sri Lankan format (DD/MM/YYYY).

### Dependencies
- Task 58: Add get_year_range Function

### Instructions

1. **Create format_date function**
   - Parameter: date or datetime object
   - Returns: formatted string

2. **Implementation**
   - Convert to DD/MM/YYYY format
   - Handle both date and datetime objects

3. **Document format**
   - Sri Lankan standard: DD/MM/YYYY
   - Example: 23/01/2026

### Implementation Pattern
```python
def format_date(dt):
    """
    Format date in Sri Lankan format (DD/MM/YYYY).
    
    Args:
        dt: date or datetime object
    
    Returns:
        str: Formatted date string
    
    Example:
        >>> dt = date(2026, 1, 23)
        >>> format_date(dt)
        '23/01/2026'
    """
    if isinstance(dt, datetime):
        dt = dt.date()
    return dt.strftime('%d/%m/%Y')
```

### Verification Checklist
- [ ] format_date function defined
- [ ] Returns DD/MM/YYYY format
- [ ] Handles date and datetime objects

---

## Task 60: Add format_datetime Function

### Overview
Create a function to format datetimes in Sri Lankan format with time (DD/MM/YYYY HH:MM).

### Dependencies
- Task 59: Add format_date Function

### Instructions

1. **Create format_datetime function**
   - Parameter: datetime object
   - Returns: formatted string with time

2. **Implementation**
   - Convert to DD/MM/YYYY HH:MM format
   - Optionally show seconds

3. **Document format**
   - Standard: DD/MM/YYYY HH:MM
   - Example: 23/01/2026 14:30

### Implementation Pattern
```python
def format_datetime(dt, show_seconds=False):
    """
    Format datetime in Sri Lankan format.
    
    Args:
        dt: datetime object
        show_seconds: Include seconds (default False)
    
    Returns:
        str: Formatted datetime string
    
    Examples:
        >>> dt = datetime(2026, 1, 23, 14, 30)
        >>> format_datetime(dt)
        '23/01/2026 14:30'
        
        >>> format_datetime(dt, show_seconds=True)
        '23/01/2026 14:30:00'
    """
    if show_seconds:
        return dt.strftime('%d/%m/%Y %H:%M:%S')
    return dt.strftime('%d/%m/%Y %H:%M')
```

### Verification Checklist
- [ ] format_datetime function defined
- [ ] Returns DD/MM/YYYY HH:MM format
- [ ] Supports seconds parameter

---

## Task 61: Export Date/Time Helpers

### Overview
Update the datetime module's `__init__.py` to export all functions.

### Dependencies
- Task 60: Add format_datetime Function

### Instructions

1. **Open __init__.py file**
   - Navigate to datetime/__init__.py

2. **Import all functions**
   - From timezone.py
   - From date_utils.py

3. **Update __all__ list**
   - Add all function names

### Export Pattern
```python
"""
Date and time utilities for LankaCommerce Cloud.
"""

__version__ = '1.0.0'

from .timezone import (
    SL_TIMEZONE,
    get_local_now,
    convert_to_utc,
    convert_to_local,
)

from .date_utils import (
    get_date_range,
    get_month_range,
    get_year_range,
    format_date,
    format_datetime,
)

__all__ = [
    'SL_TIMEZONE',
    'get_local_now',
    'convert_to_utc',
    'convert_to_local',
    'get_date_range',
    'get_month_range',
    'get_year_range',
    'format_date',
    'format_datetime',
]
```

### Verification Checklist
- [ ] All functions imported
- [ ] __all__ list complete
- [ ] Exports work correctly

---

## Task 62: Test Date/Time Helpers

### Overview
Verify all datetime helpers work correctly. Full unit tests in Group F.

### Dependencies
- Task 61: Export Date/Time Helpers

### Instructions

1. **Manual verification checklist**
2. **Document test scenarios for Group F**

### Manual Validation Checklist

| Function | Test |
|----------|------|
| get_local_now | Returns current SL time |
| convert_to_utc | Converts SL to UTC |
| convert_to_local | Converts UTC to SL |
| get_date_range | Returns day boundaries |
| get_month_range | Returns month boundaries |
| get_year_range | Returns year boundaries |
| format_date | Returns DD/MM/YYYY |
| format_datetime | Returns DD/MM/YYYY HH:MM |

### Verification Checklist
- [ ] All functions import successfully
- [ ] Manual tests pass
- [ ] Test scenarios documented

---

## Summary

### Tasks Completed in This Document
All 8 tasks (55-62) complete.

### Complete Datetime Module
```
backend/apps/core/
└── datetime/
    ├── __init__.py          # Exports
    ├── timezone.py          # Timezone functions
    └── date_utils.py        # Date range & formatting
```

### All Functions Summary
- **Timezone:** get_local_now, convert_to_utc, convert_to_local
- **Ranges:** get_date_range, get_month_range, get_year_range
- **Formatting:** format_date, format_datetime

### Group D Completion
All 14 tasks (49-62) complete:
- ✅ Datetime module created
- ✅ Timezone conversion (UTC ↔ SL)
- ✅ Date range helpers
- ✅ Sri Lankan date formatting
- ✅ Fiscal year support
- ✅ All functions exported

### Next Steps
Proceed to [../Group-E_Sri-Lanka-Utilities/](../Group-E_Sri-Lanka-Utilities/) for:
- LKR currency formatting
- Sri Lankan phone validation
- NIC validation
- Provinces and districts

---

## Notes for AI Agents

1. **Group D Complete:** All date/time helpers finished
2. **Sri Lankan Format:** DD/MM/YYYY standard
3. **Fiscal Year:** April to March
4. **Testing:** Full tests in Group F, Task 83
5. **Next Group:** Sri Lanka-specific utilities
