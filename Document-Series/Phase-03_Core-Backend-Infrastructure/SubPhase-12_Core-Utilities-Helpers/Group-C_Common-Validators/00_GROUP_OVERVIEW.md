# Group C: Common Validators

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Create reusable validators for data validation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Filter-Backends](../Group-B_Filter-Backends/)
- **→ Next Group:** [Group-D_DateTime-Helpers](../Group-D_DateTime-Helpers/)

---

## Group Overview

### Key Outcomes
- Email, URL, and slug validators
- Numeric validators (positive, decimal, percentage)
- File validators (size, dimensions, extensions)
- JSON and HTML content validators
- Tenant-unique constraint validator

### Technology Context
- Django validators integration
- DRF serializer field validators
- File validation with Pillow for image dimensions
- Maximum file size: configurable (default 10MB)

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-33-38_Validators-Module-Basic.md | 33-38 | Create validators module and basic validators |
| 02 | 02_Tasks-39-44_Numeric-File-Validators.md | 39-44 | Decimal, percentage, and file validators |
| 03 | 03_Tasks-45-48_TenantUnique-Export-Testing.md | 45-48 | Tenant uniqueness validator and testing |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 33 | Create validators Module | Low |
| 34 | Create validators __init__.py | Low |
| 35 | Create EmailValidator | Low |
| 36 | Create URLValidator | Low |
| 37 | Create SlugValidator | Low |
| 38 | Create PositiveNumberValidator | Low |
| 39 | Create DecimalValidator | Medium |
| 40 | Create PercentageValidator | Low |
| 41 | Create FileSizeValidator | Medium |
| 42 | Create ImageDimensionValidator | Medium |
| 43 | Create FileExtensionValidator | Medium |
| 44 | Create JSONValidator | Medium |
| 45 | Create NoHTMLValidator | Medium |
| 46 | Create UniqueForTenantValidator | High |
| 47 | Export Validators | Low |
| 48 | Test Validators | Medium |

---

## Execution Order

```
Tasks 33-34: Create validators Module
    │
    ▼
Tasks 35-38: Basic Validators (Email, URL, Slug, Positive)
    │
    ▼
Tasks 39-40: Numeric Validators (Decimal, Percentage)
    │
    ▼
Tasks 41-43: File Validators (Size, Dimensions, Extensions)
    │
    ▼
Tasks 44-45: Content Validators (JSON, NoHTML)
    │
    ▼
Task 46: UniqueForTenantValidator (Critical)
    │
    ▼
Tasks 47-48: Export & Testing
```

---

## Expected Deliverables

```
backend/apps/core/
└── validators/
    ├── __init__.py
    ├── common.py
    └── files.py
```

---

## Notes for AI Agents

1. All validators should provide clear, user-friendly error messages
2. UniqueForTenantValidator must respect tenant isolation
3. ImageDimensionValidator requires Pillow library
4. FileSizeValidator should have configurable max size per file type
5. NoHTMLValidator should use bleach or similar library for sanitization
