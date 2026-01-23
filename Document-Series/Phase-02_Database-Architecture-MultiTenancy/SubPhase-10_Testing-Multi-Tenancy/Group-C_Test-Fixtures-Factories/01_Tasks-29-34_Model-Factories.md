# Tasks 29-34: Model Factories

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 10 - Testing Multi-Tenancy  
> **Group:** C - Test Fixtures & Factories  
> **Document:** 01 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-B_TenantTestCase-Base-Class/00_GROUP_OVERVIEW.md](../Group-B_TenantTestCase-Base-Class/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-35-40_User-Fixtures.md](02_Tasks-35-40_User-Fixtures.md)

---

## Document Overview

This document defines core model factories for tenant, domain, product, category, customer, and order models.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create TenantFactory | Medium |
| 30 | Create DomainFactory | Simple |
| 31 | Create ProductFactory | Medium |
| 32 | Create CategoryFactory | Simple |
| 33 | Create CustomerFactory | Medium |
| 34 | Create OrderFactory | Medium |

---

## Task 29: Create TenantFactory

### Overview
Create a factory for tenant models.

### Dependencies
- Task 28: Document TenantTestCase

### Instructions

1. **Define tenant factory defaults**
   - Include schema name and domain fields

2. **Document tenant context**
   - Ensure factories respect tenant context

### Expected Outcome
- Tenant factory documented

### Verification Checklist
- [ ] Tenant factory documented
- [ ] Tenant context noted

---

## Task 30: Create DomainFactory

### Overview
Create a factory for domain models.

### Dependencies
- Task 29: Create TenantFactory

### Instructions

1. **Define domain factory defaults**
   - Include domain name and is_primary

2. **Document associations**
   - Link to tenant factory

### Expected Outcome
- Domain factory documented

### Verification Checklist
- [ ] Domain factory documented
- [ ] Associations noted

---

## Task 31: Create ProductFactory

### Overview
Create a factory for product models.

### Dependencies
- Task 29: Create TenantFactory

### Instructions

1. **Define product defaults**
   - Include SKU, price, and quantity

2. **Document category linkage**
   - Use CategoryFactory

### Expected Outcome
- Product factory documented

### Verification Checklist
- [ ] Product factory documented
- [ ] Category linkage noted

---

## Task 32: Create CategoryFactory

### Overview
Create a factory for category models.

### Dependencies
- Task 31: Create ProductFactory

### Instructions

1. **Define category defaults**
   - Include name and status

2. **Document ordering**
   - Note dependency before products

### Expected Outcome
- Category factory documented

### Verification Checklist
- [ ] Category factory documented
- [ ] Ordering noted

---

## Task 33: Create CustomerFactory

### Overview
Create a factory for customer models.

### Dependencies
- Task 29: Create TenantFactory

### Instructions

1. **Define customer defaults**
   - Include name and contact fields

2. **Document phone format**
   - Use +94 XX XXX XXXX

### Expected Outcome
- Customer factory documented

### Verification Checklist
- [ ] Customer factory documented
- [ ] Phone format noted

---

## Task 34: Create OrderFactory

### Overview
Create a factory for order models.

### Dependencies
- Task 33: Create CustomerFactory

### Instructions

1. **Define order defaults**
   - Include order number and totals

2. **Document relationships**
   - Link to customer and products

### Expected Outcome
- Order factory documented

### Verification Checklist
- [ ] Order factory documented
- [ ] Relationships noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create TenantFactory | Tenant factory documented |
| 30 | Create DomainFactory | Domain factory documented |
| 31 | Create ProductFactory | Product factory documented |
| 32 | Create CategoryFactory | Category factory documented |
| 33 | Create CustomerFactory | Customer factory documented |
| 34 | Create OrderFactory | Order factory documented |

### Next Steps
- Continue with [02_Tasks-35-40_User-Fixtures.md](02_Tasks-35-40_User-Fixtures.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 29 through 34 in sequence
2. **Factories:** Respect tenant context
3. **No Code Snippets:** Avoid fenced code blocks in documentation
