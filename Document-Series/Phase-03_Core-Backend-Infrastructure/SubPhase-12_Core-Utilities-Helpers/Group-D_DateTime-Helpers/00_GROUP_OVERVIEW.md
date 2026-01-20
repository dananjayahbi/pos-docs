# Group D: Date/Time Helpers

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** D of F  
> **Tasks Covered:** 49-62  
> **Group Goal:** Create date/time utility functions for Sri Lankan timezone

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Common-Validators](../Group-C_Common-Validators/)
- **→ Next Group:** [Group-E_Sri-Lanka-Utilities](../Group-E_Sri-Lanka-Utilities/)

---

## Group Overview

### Key Outcomes
- Timezone conversion helpers for Asia/Colombo
- Date range utilities for reporting
- Sri Lankan date format: DD/MM/YYYY
- UTC conversion for database storage
- Local time display for users

### Technology Context
- Python datetime and pytz libraries
- Sri Lanka timezone: Asia/Colombo (UTC+5:30)
- No daylight saving time changes
- Date format preference: DD/MM/YYYY

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-49-54_DateTime-Module-Timezone.md | 49-54 | Create datetime module and timezone helpers |
| 02 | 02_Tasks-55-62_Date-Utils-Export-Testing.md | 55-62 | Date utilities, formatting, and testing |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 49 | Create datetime Module | Low |
| 50 | Create datetime __init__.py | Low |
| 51 | Create timezone.py File | Low |
| 52 | Add get_local_now Function | Medium |
| 53 | Add convert_to_utc Function | Medium |
| 54 | Add convert_to_local Function | Medium |
| 55 | Create date_utils.py File | Low |
| 56 | Add get_date_range Function | Medium |
| 57 | Add get_month_range Function | Medium |
| 58 | Add get_year_range Function | Medium |
| 59 | Add format_date Function | Low |
| 60 | Add format_datetime Function | Low |
| 61 | Export Date/Time Helpers | Low |
| 62 | Test Date/Time Helpers | Medium |

---

## Execution Order

```
Tasks 49-50: Create datetime Module
    │
    ▼
Tasks 51-54: Timezone Helpers
    │
    ▼
Tasks 55-58: Date Range Utilities
    │
    ▼
Tasks 59-60: Formatting Functions
    │
    ▼
Tasks 61-62: Export & Testing
```

---

## Expected Deliverables

```
backend/apps/core/
└── datetime/
    ├── __init__.py
    ├── timezone.py
    └── date_utils.py
```

---

## Notes for AI Agents

1. Always store dates in UTC in database
2. Convert to Asia/Colombo for display to users
3. Sri Lanka does not observe daylight saving time
4. Date format for display: DD/MM/YYYY
5. Include fiscal year helpers (April-March for Sri Lanka)
