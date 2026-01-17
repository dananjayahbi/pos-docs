# SubPhase 12: Core Utilities & Helpers - Tasks Summary

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase Index:** 12 of 12 (Final SubPhase)  
> **SubPhase Goal:** Create common utilities used across the application  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 7-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-11_API-Documentation](../SubPhase-11_API-Documentation/)
- **→ Next Phase:** [Phase-04_Multi-Tenant-Core-Implementation](../../Phase-04_Multi-Tenant-Core-Implementation/)

---

## SubPhase Overview

This sub-phase creates the common utilities and helper functions used throughout the LankaCommerce Cloud platform. Includes Sri Lanka-specific utilities like LKR currency formatting and local phone validation.

### Key Outcomes
- Custom pagination classes
- Filter backends
- Common validators
- Date/time helpers
- Currency formatting (LKR)
- Phone number validation (Sri Lanka)
- Reusable utility functions

### Sri Lanka Specific
```
Currency: LKR (Sri Lankan Rupee)
Phone Format: +94 XX XXX XXXX
Date Format: DD/MM/YYYY
Time Zone: Asia/Colombo (UTC+5:30)
```

### Dependencies
- **Requires:** SubPhase-02 (API Framework Setup)
- **Requires:** SubPhase-03 (Base Models & Mixins)

---

## Task Execution Order

```
TASK GROUP A: Pagination Classes (Tasks 01-16)
        │
        ▼
TASK GROUP B: Filter Backends (Tasks 17-32)
        │
        ▼
TASK GROUP C: Common Validators (Tasks 33-48)
        │
        ▼
TASK GROUP D: Date/Time Helpers (Tasks 49-62)
        │
        ▼
TASK GROUP E: Sri Lanka Specific Utilities (Tasks 63-78)
        │
        ▼
TASK GROUP F: Testing & Documentation (Tasks 79-94)
```

---

## Task Index

### Group A: Pagination Classes (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create pagination Module** | apps/core/pagination/ | SubPhase-02 | 🔴 Not Created |
| 02 | **Create pagination __init__.py** | Export classes | Task 01 | 🔴 Not Created |
| 03 | **Create StandardPagination Class** | Default pagination | Task 02 | 🔴 Not Created |
| 04 | **Configure PAGE_SIZE** | Default 20 items | Task 03 | 🔴 Not Created |
| 05 | **Configure MAX_PAGE_SIZE** | Max 100 items | Task 04 | 🔴 Not Created |
| 06 | **Add page_size Query Param** | Override page size | Task 05 | 🔴 Not Created |
| 07 | **Create CursorPagination Class** | Cursor-based | Task 06 | 🔴 Not Created |
| 08 | **Configure Cursor Ordering** | Default ordering | Task 07 | 🔴 Not Created |
| 09 | **Create LimitOffsetPagination** | Limit/offset style | Task 08 | 🔴 Not Created |
| 10 | **Configure Default Limit** | 20 items | Task 09 | 🔴 Not Created |
| 11 | **Configure Max Limit** | 100 items | Task 10 | 🔴 Not Created |
| 12 | **Add Total Count to Response** | Include count | Task 11 | 🔴 Not Created |
| 13 | **Add Page Info to Response** | Page metadata | Task 12 | 🔴 Not Created |
| 14 | **Create NoPagination Class** | Disable pagination | Task 13 | 🔴 Not Created |
| 15 | **Export Pagination Classes** | In __init__.py | Task 14 | 🔴 Not Created |
| 16 | **Test Pagination Classes** | Unit tests | Task 15 | 🔴 Not Created |

---

### Group B: Filter Backends (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Install django-filter** | pip install django-filter | Task 16 | 🔴 Not Created |
| 18 | **Pin django-filter Version** | Add to requirements.txt | Task 17 | 🔴 Not Created |
| 19 | **Add to INSTALLED_APPS** | django_filters | Task 18 | 🔴 Not Created |
| 20 | **Create filters Module** | apps/core/filters/ | Task 19 | 🔴 Not Created |
| 21 | **Create filters __init__.py** | Export classes | Task 20 | 🔴 Not Created |
| 22 | **Create TenantFilterBackend** | Tenant-aware filter | Task 21 | 🔴 Not Created |
| 23 | **Create DateRangeFilter** | Date range filtering | Task 22 | 🔴 Not Created |
| 24 | **Create SearchFilter** | Full-text search | Task 23 | 🔴 Not Created |
| 25 | **Create OrderingFilter** | Dynamic ordering | Task 24 | 🔴 Not Created |
| 26 | **Create IsActiveFilter** | Active/inactive | Task 25 | 🔴 Not Created |
| 27 | **Create CreatedByFilter** | Filter by creator | Task 26 | 🔴 Not Created |
| 28 | **Create ModifiedAtFilter** | Modified date | Task 27 | 🔴 Not Created |
| 29 | **Create BaseFilterSet Class** | Reusable filterset | Task 28 | 🔴 Not Created |
| 30 | **Add Common Filter Fields** | is_active, dates | Task 29 | 🔴 Not Created |
| 31 | **Export Filter Classes** | In __init__.py | Task 30 | 🔴 Not Created |
| 32 | **Test Filter Backends** | Unit tests | Task 31 | 🔴 Not Created |

---

### Group C: Common Validators (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create validators Module** | apps/core/validators/ | Task 32 | 🔴 Not Created |
| 34 | **Create validators __init__.py** | Export validators | Task 33 | 🔴 Not Created |
| 35 | **Create EmailValidator** | Email validation | Task 34 | 🔴 Not Created |
| 36 | **Create URLValidator** | URL validation | Task 35 | 🔴 Not Created |
| 37 | **Create SlugValidator** | Slug validation | Task 36 | 🔴 Not Created |
| 38 | **Create PositiveNumberValidator** | Positive numbers | Task 37 | 🔴 Not Created |
| 39 | **Create DecimalValidator** | Decimal precision | Task 38 | 🔴 Not Created |
| 40 | **Create PercentageValidator** | 0-100 range | Task 39 | 🔴 Not Created |
| 41 | **Create FileSizeValidator** | Max file size | Task 40 | 🔴 Not Created |
| 42 | **Create ImageDimensionValidator** | Image dimensions | Task 41 | 🔴 Not Created |
| 43 | **Create FileExtensionValidator** | Allowed extensions | Task 42 | 🔴 Not Created |
| 44 | **Create JSONValidator** | Valid JSON | Task 43 | 🔴 Not Created |
| 45 | **Create NoHTMLValidator** | Strip HTML | Task 44 | 🔴 Not Created |
| 46 | **Create UniqueForTenantValidator** | Tenant uniqueness | Task 45 | 🔴 Not Created |
| 47 | **Export Validators** | In __init__.py | Task 46 | 🔴 Not Created |
| 48 | **Test Validators** | Unit tests | Task 47 | 🔴 Not Created |

---

### Group D: Date/Time Helpers (Tasks 49-62)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create datetime Module** | apps/core/datetime/ | Task 48 | 🔴 Not Created |
| 50 | **Create datetime __init__.py** | Export helpers | Task 49 | 🔴 Not Created |
| 51 | **Create timezone.py File** | Timezone helpers | Task 50 | 🔴 Not Created |
| 52 | **Add get_local_now Function** | Local current time | Task 51 | 🔴 Not Created |
| 53 | **Add convert_to_utc Function** | UTC conversion | Task 52 | 🔴 Not Created |
| 54 | **Add convert_to_local Function** | Local conversion | Task 53 | 🔴 Not Created |
| 55 | **Create date_utils.py File** | Date utilities | Task 54 | 🔴 Not Created |
| 56 | **Add get_date_range Function** | Date range helper | Task 55 | 🔴 Not Created |
| 57 | **Add get_month_range Function** | Month boundaries | Task 56 | 🔴 Not Created |
| 58 | **Add get_year_range Function** | Year boundaries | Task 57 | 🔴 Not Created |
| 59 | **Add format_date Function** | Format DD/MM/YYYY | Task 58 | 🔴 Not Created |
| 60 | **Add format_datetime Function** | Format with time | Task 59 | 🔴 Not Created |
| 61 | **Export Date/Time Helpers** | In __init__.py | Task 60 | 🔴 Not Created |
| 62 | **Test Date/Time Helpers** | Unit tests | Task 61 | 🔴 Not Created |

---

### Group E: Sri Lanka Specific Utilities (Tasks 63-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 63 | **Create srilanka Module** | apps/core/srilanka/ | Task 62 | 🔴 Not Created |
| 64 | **Create srilanka __init__.py** | Export utilities | Task 63 | 🔴 Not Created |
| 65 | **Create currency.py File** | Currency helpers | Task 64 | 🔴 Not Created |
| 66 | **Add format_lkr Function** | LKR formatting | Task 65 | 🔴 Not Created |
| 67 | **Add parse_lkr Function** | Parse LKR string | Task 66 | 🔴 Not Created |
| 68 | **Add convert_currency Function** | USD/LKR convert | Task 67 | 🔴 Not Created |
| 69 | **Create phone.py File** | Phone helpers | Task 68 | 🔴 Not Created |
| 70 | **Add validate_sl_phone Function** | SL phone validation | Task 69 | 🔴 Not Created |
| 71 | **Add format_sl_phone Function** | SL phone format | Task 70 | 🔴 Not Created |
| 72 | **Add normalize_sl_phone Function** | Normalize format | Task 71 | 🔴 Not Created |
| 73 | **Create nic.py File** | NIC helpers | Task 72 | 🔴 Not Created |
| 74 | **Add validate_nic Function** | NIC validation | Task 73 | 🔴 Not Created |
| 75 | **Add parse_nic_dob Function** | Extract DOB from NIC | Task 74 | 🔴 Not Created |
| 76 | **Create provinces.py File** | Province data | Task 75 | 🔴 Not Created |
| 77 | **Add PROVINCES Constant** | 9 provinces list | Task 76 | 🔴 Not Created |
| 78 | **Add DISTRICTS Constant** | 25 districts list | Task 77 | 🔴 Not Created |

---

### Group F: Testing & Documentation (Tasks 79-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Utils Test Module** | Test structure | Task 78 | 🔴 Not Created |
| 80 | **Test Pagination Classes** | Pagination tests | Task 79 | 🔴 Not Created |
| 81 | **Test Filter Backends** | Filter tests | Task 80 | 🔴 Not Created |
| 82 | **Test Validators** | Validator tests | Task 81 | 🔴 Not Created |
| 83 | **Test Date/Time Helpers** | DateTime tests | Task 82 | 🔴 Not Created |
| 84 | **Test Currency Formatting** | LKR format tests | Task 83 | 🔴 Not Created |
| 85 | **Test Phone Validation** | SL phone tests | Task 84 | 🔴 Not Created |
| 86 | **Test NIC Validation** | NIC tests | Task 85 | 🔴 Not Created |
| 87 | **Create Utilities README** | Usage documentation | Task 86 | 🔴 Not Created |
| 88 | **Document Pagination** | Pagination guide | Task 87 | 🔴 Not Created |
| 89 | **Document Filters** | Filters guide | Task 88 | 🔴 Not Created |
| 90 | **Document Validators** | Validators guide | Task 89 | 🔴 Not Created |
| 91 | **Document SL Utilities** | SL helpers guide | Task 90 | 🔴 Not Created |
| 92 | **Create Example Usage** | Usage examples | Task 91 | 🔴 Not Created |
| 93 | **Verify Full Integration** | End-to-end test | Task 92 | 🔴 Not Created |
| 94 | **Phase 03 Complete Verification** | All subphases done | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/apps/core/
├── pagination/
│   ├── __init__.py
│   └── paginators.py
├── filters/
│   ├── __init__.py
│   ├── backends.py
│   └── filtersets.py
├── validators/
│   ├── __init__.py
│   ├── common.py
│   └── files.py
├── datetime/
│   ├── __init__.py
│   ├── timezone.py
│   └── date_utils.py
├── srilanka/
│   ├── __init__.py
│   ├── currency.py
│   ├── phone.py
│   ├── nic.py
│   └── provinces.py
├── tests/
│   └── test_utils/
│       ├── __init__.py
│       ├── test_pagination.py
│       ├── test_filters.py
│       ├── test_validators.py
│       ├── test_datetime.py
│       └── test_srilanka.py
└── docs/
    └── utilities/
        ├── overview.md
        ├── pagination.md
        ├── filters.md
        ├── validators.md
        └── srilanka.md
```

---

## Sri Lanka Specific Reference

```
┌─────────────────────────────────────────────────────┐
│           SRI LANKA SPECIFIC UTILITIES              │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Currency (LKR):                                    │
│  ┌─────────────────────────────────────────────┐   │
│  │ Symbol: Rs. or LKR                          │   │
│  │ Format: Rs. 1,500.00                        │   │
│  │ Decimal Places: 2                           │   │
│  │ Thousand Separator: ,                       │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Phone Numbers:                                     │
│  ┌─────────────────────────────────────────────┐   │
│  │ Country Code: +94                           │   │
│  │ Mobile Format: +94 7X XXX XXXX              │   │
│  │ Landline: +94 XX XXX XXXX                   │   │
│  │ Valid Mobile Prefixes: 70-79                │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  NIC (National Identity Card):                      │
│  ┌─────────────────────────────────────────────┐   │
│  │ Old Format: 9 digits + V/X (e.g., 881234567V)│   │
│  │ New Format: 12 digits (e.g., 198812345678)  │   │
│  │ Contains: DOB + Gender + Serial             │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Time Zone:                                         │
│  ┌─────────────────────────────────────────────┐   │
│  │ Zone: Asia/Colombo                          │   │
│  │ Offset: UTC+5:30                            │   │
│  │ No Daylight Saving                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
│  Administrative Divisions:                          │
│  ┌─────────────────────────────────────────────┐   │
│  │ Provinces: 9                                │   │
│  │ Districts: 25                               │   │
│  │ DS Divisions: 332                           │   │
│  └─────────────────────────────────────────────┘   │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Pagination Response Format

```
┌─────────────────────────────────────────────────────┐
│           PAGINATION RESPONSE FORMAT                │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Standard Pagination:                               │
│  {                                                  │
│    "count": 150,                                   │
│    "page": 1,                                      │
│    "page_size": 20,                                │
│    "total_pages": 8,                               │
│    "next": "/api/products/?page=2",                │
│    "previous": null,                               │
│    "results": [...]                                │
│  }                                                  │
│                                                     │
│  Cursor Pagination:                                 │
│  {                                                  │
│    "next": "/api/products/?cursor=xyz",            │
│    "previous": null,                               │
│    "results": [...]                                │
│  }                                                  │
│                                                     │
│  Limit/Offset Pagination:                           │
│  {                                                  │
│    "count": 150,                                   │
│    "limit": 20,                                    │
│    "offset": 0,                                    │
│    "next": "/api/products/?limit=20&offset=20",    │
│    "previous": null,                               │
│    "results": [...]                                │
│  }                                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 94 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Phase 03 Completion Summary

Upon completion of this sub-phase, Phase 03 will be complete:

| SubPhase | Name | Tasks |
|----------|------|-------|
| 01 | Django Apps Structure | 92 |
| 02 | API Framework Setup | 88 |
| 03 | Base Models & Mixins | 94 |
| 04 | User Model & Authentication | 96 |
| 05 | Role & Permission System | 92 |
| 06 | Core Middleware Stack | 88 |
| 07 | Exception Handling | 86 |
| 08 | Celery Task Queue | 90 |
| 09 | Caching Layer | 88 |
| 10 | File Storage Configuration | 86 |
| 11 | API Documentation | 82 |
| 12 | Core Utilities & Helpers | 94 |
| **Total** | **12 SubPhases** | **1,076** |

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **SL Specific:** Prioritize LKR and phone validation
3. **Timezone:** Always use Asia/Colombo
4. **NIC Parsing:** Support both old and new formats
5. **Pagination:** Default 20, max 100
6. **Filters:** Always tenant-aware
7. **Validators:** Reusable across modules
8. **Phase Complete:** Task 94 marks Phase 03 done
9. **Next Phase:** Phase-04 Multi-Tenant Core
