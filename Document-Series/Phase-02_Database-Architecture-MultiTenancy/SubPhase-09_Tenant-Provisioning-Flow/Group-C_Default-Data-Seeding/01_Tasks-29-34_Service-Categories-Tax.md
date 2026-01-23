# Tasks 29-34: Service, Categories & Tax

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 09 - Tenant Provisioning Flow  
> **Group:** C - Default Data Seeding  
> **Document:** 01 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_Schema-Creation-Migrations/00_GROUP_OVERVIEW.md](../Group-B_Schema-Creation-Migrations/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-35-40_Settings-Sequences-Roles.md](02_Tasks-35-40_Settings-Sequences-Roles.md)

---

## Document Overview

This document defines the tenant data seeding service, interface, and the initial default datasets for categories, tax rates, payment methods, and units.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create Data Seeding Service | Medium |
| 30 | Define Seeding Interface | Simple |
| 31 | Create Default Categories | Medium |
| 32 | Create Default Tax Rates | Simple |
| 33 | Create Default Payment Methods | Simple |
| 34 | Create Default Units | Simple |

---

## Task 29: Create Data Seeding Service

### Overview
Create a service responsible for seeding default tenant data.

### Dependencies
- Task 28: Document Schema Provisioning Steps

### Instructions

1. **Define the seeding service scope**
   - Cover categories, tax rates, payment methods, units, settings, roles, sequences, locations, and templates

2. **Document service responsibilities**
   - Note idempotent behavior and tenant schema isolation

### Expected Outcome
- Seeding service documented

### Verification Checklist
- [ ] Service scope documented
- [ ] Idempotency noted

---

## Task 30: Define Seeding Interface

### Overview
Define the interface for data seeding steps.

### Dependencies
- Task 29: Create Data Seeding Service

### Instructions

1. **Define standard seeding steps**
   - Ensure a consistent order for default data creation

2. **Document execution order**
   - Note dependency ordering between data sets

### Expected Outcome
- Seeding interface documented

### Verification Checklist
- [ ] Interface documented
- [ ] Execution order noted

---

## Task 31: Create Default Categories

### Overview
Define default product categories for new tenants.

### Dependencies
- Task 30: Define Seeding Interface

### Instructions

1. **Define default categories**
   - Provide a base set for common retail use

2. **Document localization notes**
   - Ensure category names support English, Sinhala, and Sinhaglish

### Expected Outcome
- Default categories documented

### Verification Checklist
- [ ] Categories documented
- [ ] Localization notes included

---

## Task 32: Create Default Tax Rates

### Overview
Define default tax rates for Sri Lanka.

### Dependencies
- Task 30: Define Seeding Interface

### Instructions

1. **Define Sri Lankan tax rates**
   - Include VAT 18% and zero tax

2. **Document currency**
   - Note LKR usage in tenant settings

### Expected Outcome
- Default tax rates documented

### Verification Checklist
- [ ] Tax rates documented
- [ ] LKR noted

---

## Task 33: Create Default Payment Methods

### Overview
Define default payment methods.

### Dependencies
- Task 30: Define Seeding Interface

### Instructions

1. **Define payment methods**
   - Include cash, card, and bank transfer

2. **Document activation rules**
   - Note which are enabled by default

### Expected Outcome
- Default payment methods documented

### Verification Checklist
- [ ] Payment methods documented
- [ ] Activation rules noted

---

## Task 34: Create Default Units

### Overview
Define default measurement units.

### Dependencies
- Task 30: Define Seeding Interface

### Instructions

1. **Define default units**
   - Include pieces, kilograms, liters

2. **Document formatting**
   - Ensure unit symbols display correctly

### Expected Outcome
- Default units documented

### Verification Checklist
- [ ] Units documented
- [ ] Formatting notes included

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create Data Seeding Service | Seeding service documented |
| 30 | Define Seeding Interface | Interface documented |
| 31 | Create Default Categories | Categories documented |
| 32 | Create Default Tax Rates | Tax rates documented |
| 33 | Create Default Payment Methods | Payment methods documented |
| 34 | Create Default Units | Units documented |

### Next Steps
- Continue with [02_Tasks-35-40_Settings-Sequences-Roles.md](02_Tasks-35-40_Settings-Sequences-Roles.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 29 through 34 in sequence
2. **Sri Lanka:** Use LKR and VAT 18%
3. **No Code Snippets:** Avoid fenced code blocks in documentation
