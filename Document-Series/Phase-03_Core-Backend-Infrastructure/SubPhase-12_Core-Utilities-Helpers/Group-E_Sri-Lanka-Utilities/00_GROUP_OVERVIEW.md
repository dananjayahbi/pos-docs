# Group E: Sri Lanka Specific Utilities

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 12 - Core Utilities & Helpers  
> **Group:** E of F  
> **Tasks Covered:** 63-78  
> **Group Goal:** Create Sri Lanka-specific utilities for localization

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_DateTime-Helpers](../Group-D_DateTime-Helpers/)
- **→ Next Group:** [Group-F_Testing-Documentation](../Group-F_Testing-Documentation/)

---

## Group Overview

### Key Outcomes
- LKR currency formatting and parsing
- Sri Lankan phone number validation (+94 format)
- NIC (National Identity Card) validation
- Administrative divisions (provinces, districts)
- Local business number formats

### Technology Context
- Currency: LKR (Sri Lankan Rupee) - Symbol: Rs.
- Phone: +94 XX XXX XXXX format
- NIC: Old (9 digits + V/X) and New (12 digits) formats
- 9 Provinces, 25 Districts

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-63-68_SriLanka-Module-Currency.md | 63-68 | Create srilanka module and currency helpers |
| 02 | 02_Tasks-69-74_Phone-NIC-Validation.md | 69-74 | Phone number and NIC validation |
| 03 | 03_Tasks-75-78_Administrative-Divisions.md | 75-78 | Provinces and districts constants |

---

## Task Summary

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 63 | Create srilanka Module | Low |
| 64 | Create srilanka __init__.py | Low |
| 65 | Create currency.py File | Low |
| 66 | Add format_lkr Function | Medium |
| 67 | Add parse_lkr Function | Medium |
| 68 | Add convert_currency Function | High |
| 69 | Create phone.py File | Low |
| 70 | Add validate_sl_phone Function | Medium |
| 71 | Add format_sl_phone Function | Medium |
| 72 | Add normalize_sl_phone Function | Medium |
| 73 | Create nic.py File | Low |
| 74 | Add validate_nic Function | High |
| 75 | Add parse_nic_dob Function | High |
| 76 | Create provinces.py File | Low |
| 77 | Add PROVINCES Constant | Low |
| 78 | Add DISTRICTS Constant | Low |

---

## Execution Order

```
Tasks 63-64: Create srilanka Module
    │
    ▼
Tasks 65-68: Currency Helpers
    │
    ▼
Tasks 69-72: Phone Helpers
    │
    ▼
Tasks 73-75: NIC Helpers
    │
    ▼
Tasks 76-78: Administrative Divisions
```

---

## Expected Deliverables

```
backend/apps/core/
└── srilanka/
    ├── __init__.py
    ├── currency.py
    ├── phone.py
    ├── nic.py
    └── provinces.py
```

---

## Notes for AI Agents

1. Currency format: Rs. 1,500.00 (2 decimal places)
2. Valid mobile prefixes: 70, 71, 72, 74, 75, 76, 77, 78
3. Old NIC: 9 digits + V (male) or X (female), e.g., 881234567V
4. New NIC: 12 digits, e.g., 198812345678
5. NIC contains: birth year, day of year (+ 500 for females), serial
6. The 9 provinces: Western, Central, Southern, Northern, Eastern, North Western, North Central, Uva, Sabaragamuwa
