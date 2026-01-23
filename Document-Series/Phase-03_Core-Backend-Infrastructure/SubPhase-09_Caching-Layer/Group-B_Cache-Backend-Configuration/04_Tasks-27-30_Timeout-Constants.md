# Tasks 27-30: Timeout Constants

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** B - Cache Backend Configuration  
> **Document:** 04 of 04  
> **Tasks Covered:** 27, 28, 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-24-26_Session-Configuration.md](03_Tasks-24-26_Session-Configuration.md)
- **→ Next Group:** [../Group-C_Tenant-Scoped-Caching/](../Group-C_Tenant-Scoped-Caching/)

---

## Document Overview

This document covers creation of cache timeout constants for consistent TTL management across the application. These constants standardize cache durations for different data types.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 27 | Create Cache Timeouts Constants | Simple |
| 28 | Define SHORT_CACHE (5 min) | Simple |
| 29 | Define MEDIUM_CACHE (1 hour) | Simple |
| 30 | Define LONG_CACHE (1 day) | Simple |

---

## Task 27: Create Cache Timeouts Constants

### Overview
Create a constants module for cache timeout values to maintain consistency and make timeout management easier.

### Dependencies
- Task 26: Configure SESSION_COOKIE_AGE

### Instructions

1. **Create constants module**
   - Create apps/core/cache/ directory
   - Create apps/core/cache/__init__.py
   - Create apps/core/cache/constants.py

2. **Add module docstring**
   - Describe purpose: cache timeout constants
   - Document usage: import and use in cache.set() calls
   - List available constants

3. **Plan timeout tiers**
   - SHORT_CACHE: 5 minutes (volatile data)
   - MEDIUM_CACHE: 1 hour (standard data)
   - LONG_CACHE: 1 day (stable data)

4. **Document usage guidelines**
   - When to use each tier
   - Examples of data types per tier
   - How to override when needed

### Module Structure
```
apps/core/cache/
├── __init__.py           # Exports constants
└── constants.py          # Timeout definitions
```

### Verification
- cache module created
- constants.py file exists
- Module structure documented

---

## Task 28: Define SHORT_CACHE (5 min)

### Overview
Define SHORT_CACHE constant for volatile data that changes frequently.

### Dependencies
- Task 27: Create Cache Timeouts Constants

### Instructions

1. **Add SHORT_CACHE constant**
   - Value: 300 seconds (5 minutes)
   - For frequently changing data

2. **Document use cases**
   - Real-time dashboard statistics
   - Active session counts
   - Current inventory counts
   - Rate limiting counters
   - Live search suggestions

3. **Add inline comment**
   - Explain 5-minute duration choice
   - Note data volatility

### Use Cases for SHORT_CACHE
| Data Type | Reason |
|-----------|--------|
| **Dashboard stats** | Updates every few minutes |
| **Inventory counts** | Changes with each sale |
| **Active users** | User activity changes rapidly |
| **Search suggestions** | Trends change quickly |

### Verification
- SHORT_CACHE defined (300)
- Use cases documented
- Constant available for import

---

## Task 29: Define MEDIUM_CACHE (1 hour)

### Overview
Define MEDIUM_CACHE constant for standard data that updates periodically.

### Dependencies
- Task 28: Define SHORT_CACHE

### Instructions

1. **Add MEDIUM_CACHE constant**
   - Value: 3600 seconds (1 hour)
   - For moderately stable data

2. **Document use cases**
   - Product lists
   - Category trees
   - Search results
   - User permissions
   - Configuration settings
   - API responses

3. **Add inline comment**
   - Explain 1-hour balance between freshness and performance

### Use Cases for MEDIUM_CACHE
| Data Type | Reason |
|-----------|--------|
| **Product lists** | Inventory stable for hours |
| **Categories** | Rarely restructured |
| **User permissions** | Don't change often |
| **API responses** | Balance freshness vs load |

### Verification
- MEDIUM_CACHE defined (3600)
- Use cases documented

---

## Task 30: Define LONG_CACHE (1 day)

### Overview
Define LONG_CACHE constant for stable data that rarely changes.

### Dependencies
- Task 29: Define MEDIUM_CACHE

### Instructions

1. **Add LONG_CACHE constant**
   - Value: 86400 seconds (1 day)
   - For stable reference data

2. **Document use cases**
   - Country/currency lists
   - Tax rate configurations
   - Payment method settings
   - Static translations
   - System configurations
   - Reference data

3. **Export all constants**
   - Export from __init__.py
   - Make easy to import throughout app

4. **Create usage examples**
   - Show how to import constants
   - Demonstrate cache.set() with constants
   - Show decorator usage with constants

### Use Cases for LONG_CACHE
| Data Type | Reason |
|-----------|--------|
| **Country lists** | Static reference data |
| **Tax rates** | Change infrequently |
| **System config** | Rarely modified |
| **Translations** | Updated on deployment only |

### Constant Summary
| Constant | Value | Duration | Use Case |
|----------|-------|----------|----------|
| **SHORT_CACHE** | 300 | 5 minutes | Volatile data |
| **MEDIUM_CACHE** | 3600 | 1 hour | Standard data |
| **LONG_CACHE** | 86400 | 1 day | Stable data |

### Usage Examples
```
Importing:
from apps.core.cache.constants import SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE

Using in cache.set():
cache.set('products:list', products, timeout=MEDIUM_CACHE)

Using with decorator:
@cache_response(timeout=SHORT_CACHE)
def get_dashboard_stats(request):
    ...
```

### Verification
- LONG_CACHE defined (86400)
- All constants exported
- Usage examples documented

---

## Expected Outcome After This Document

```
backend/apps/core/
├── cache/
│   ├── __init__.py           # Exports SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE
│   └── constants.py          # Constant definitions
```

### constants.py Content
```
Contains:
├── Module docstring
├── SHORT_CACHE = 300
├── MEDIUM_CACHE = 3600
├── LONG_CACHE = 86400
└── Usage documentation
```

---

## Sri Lanka-Specific Considerations

- **Network Speeds:** SHORT_CACHE appropriate for Sri Lankan network latencies
- **Data Freshness:** Balance cache duration with local user expectations
- **Peak Hours:** Consider Sri Lankan business hours when setting timeouts

---

## Notes for AI Agents

1. **Consistency:** Always use these constants instead of hardcoded values
2. **Flexibility:** Can override per use case when needed
3. **Documentation:** Well-documented constants improve code maintainability
4. **Imports:** Export from __init__.py for easy importing
5. **Testing:** Easy to adjust all related timeouts by changing constant
6. **Git Commit:** Commit constants module completion

---

## Validation Checklist

Before proceeding to the next group:

- [ ] cache module created
- [ ] constants.py file created
- [ ] SHORT_CACHE defined (300)
- [ ] MEDIUM_CACHE defined (3600)
- [ ] LONG_CACHE defined (86400)
- [ ] Constants exported in __init__.py
- [ ] Usage documentation complete
- [ ] Examples provided
- [ ] Django imports constants successfully
- [ ] Changes committed to Git
- [ ] Group B complete

---

## Next Steps

After completing Group B:
1. **Git Commit:** Commit all cache backend configuration
2. **Proceed to Group C:** [Tenant-Scoped Caching](../Group-C_Tenant-Scoped-Caching/)
3. Implement TenantCache class for tenant isolation
