# Group B: Tenant Business Information

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 04 - Tenant Model & Domain Model  
> **Group:** B of F  
> **Tasks Covered:** 17-30  
> **Group Goal:** Add business information fields to Tenant model

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-A_Tenant-Model-Foundation/](../Group-A_Tenant-Model-Foundation/)
- **→ Next Group:** [../Group-C_Domain-Model-Implementation/](../Group-C_Domain-Model-Implementation/)

---

## Group Overview

This group adds business information fields to the Tenant model including business registration, contact details, address, branding, and localization settings specific to Sri Lankan businesses.

### Key Outcomes
- Business type field (retail, wholesale, etc.)
- Business registration number (Sri Lanka BR)
- Tax ID field (VAT registration)
- Contact email and phone fields
- Address fields (line 1, line 2, city, province, postal)
- Logo upload field
- Timezone field (default: Asia/Colombo)
- Currency field (default: LKR)
- Locale field (default: en-lk)

### Technology Context
- **Location:** Sri Lanka focused
- **Currency:** LKR (Sri Lankan Rupee)
- **Timezone:** Asia/Colombo
- **Provinces:** All 9 Sri Lankan provinces
- **BR Format:** Sri Lanka business registration format

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-17-21_Business-Type-Contact.md | 17-21 | Business type, BR number, tax ID, contact email, phone |
| 02 | 02_Tasks-22-26_Address-Fields.md | 22-26 | Address line 1 & 2, city, province, postal code |
| 03 | 03_Tasks-27-30_Branding-Localization.md | 27-30 | Logo, timezone, currency, locale |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 17 | Add Business Type Field | Task 01 | Simple |
| 18 | Add Business Registration | Task 01 | Simple |
| 19 | Add Tax ID Field | Task 01 | Simple |
| 20 | Add Contact Email | Task 01 | Simple |
| 21 | Add Contact Phone | Task 01 | Simple |
| 22 | Add Address Line 1 | Task 01 | Simple |
| 23 | Add Address Line 2 | Task 01 | Simple |
| 24 | Add City Field | Task 01 | Simple |
| 25 | Add Province Field | Task 01 | Simple |
| 26 | Add Postal Code | Task 01 | Simple |
| 27 | Add Logo Field | Task 01 | Simple |
| 28 | Add Timezone Field | Task 01 | Simple |
| 29 | Add Currency Field | Task 01 | Simple |
| 30 | Add Locale Field | Task 01 | Simple |

---

## Execution Order

```
01_Tasks-17-21_Business-Type-Contact.md
        │
        ▼
02_Tasks-22-26_Address-Fields.md
        │
        ▼
03_Tasks-27-30_Branding-Localization.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── tenants/
        ├── models/
        │   └── tenant.py        # Updated with business fields
        └── constants.py         # Business types, provinces
```

---

## Sri Lankan Provinces

| Code | Province |
|------|----------|
| WP | Western Province |
| CP | Central Province |
| SP | Southern Province |
| NP | Northern Province |
| EP | Eastern Province |
| NW | North Western Province |
| NC | North Central Province |
| UV | Uva Province |
| SB | Sabaragamuwa Province |

---

## Business Types

| Code | Type |
|------|------|
| RETAIL | Retail Store |
| WHOLESALE | Wholesale |
| RESTAURANT | Restaurant/Cafe |
| PHARMACY | Pharmacy |
| SUPERMARKET | Supermarket |
| BOUTIQUE | Boutique/Fashion |
| ELECTRONICS | Electronics |
| HARDWARE | Hardware Store |
| OTHER | Other |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group A complete (Tenant model exists)
2. **Sri Lankan Focus:** Use Sri Lankan provinces, LKR, Asia/Colombo
3. **BR Number:** Validate Sri Lankan business registration format
4. **Logo Storage:** Use tenant-specific storage path
5. **Timezone:** Use pytz for timezone choices
6. **Git Commit:** Commit after completing this group

