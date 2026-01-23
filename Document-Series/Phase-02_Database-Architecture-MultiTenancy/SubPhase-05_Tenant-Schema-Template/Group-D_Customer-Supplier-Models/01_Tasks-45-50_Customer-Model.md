# Tasks 45-50: Customer Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** D - Customer & Supplier Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-C_Inventory-Stock-Models/00_GROUP_OVERVIEW.md](../Group-C_Inventory-Stock-Models/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-51-56_Supplier-Model.md](02_Tasks-51-56_Supplier-Model.md)

---

## Document Overview

This document defines the Customer model and its core fields for customer management.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 45 | Create Customer Model | Medium |
| 46 | Add Customer Name Fields | Simple |
| 47 | Add Customer Contact Fields | Simple |
| 48 | Add Customer Address Fields | Medium |
| 49 | Add Customer Type Field | Simple |
| 50 | Add Customer Credit Limit | Simple |

---

## Task 45: Create Customer Model

### Overview
Create the Customer model for tenant customer records.

### Dependencies
- Task 11: Register in TENANT_APPS

### Instructions

1. **Define Customer model**
   - Capture customer profile needs

2. **Document types**
   - Note individual, business, wholesale, VIP

### Expected Outcome
- Customer model documented

### Verification Checklist
- [ ] Customer model documented
- [ ] Types noted

---

## Task 46: Add Customer Name Fields

### Overview
Add fields for customer names.

### Dependencies
- Task 45: Create Customer Model

### Instructions

1. **Add name fields**
   - Include first, last, and business name

2. **Document usage**
   - Note which fields apply per customer type

### Expected Outcome
- Name fields documented

### Verification Checklist
- [ ] Name fields documented
- [ ] Usage noted

---

## Task 47: Add Customer Contact Fields

### Overview
Add contact fields for phone, email, and mobile.

### Dependencies
- Task 45: Create Customer Model

### Instructions

1. **Add contact fields**
   - Capture phone, email, and mobile

2. **Document validation**
   - Note +94 XX XXX XXXX format for phone

### Expected Outcome
- Contact fields documented

### Verification Checklist
- [ ] Contact fields documented
- [ ] Phone format noted

---

## Task 48: Add Customer Address Fields

### Overview
Add billing and shipping address fields.

### Dependencies
- Task 45: Create Customer Model

### Instructions

1. **Add address fields**
   - Separate billing and shipping addresses

2. **Document structure**
   - Note optional vs required fields

### Expected Outcome
- Address fields documented

### Verification Checklist
- [ ] Address fields documented
- [ ] Structure noted

---

## Task 49: Add Customer Type Field

### Overview
Add a customer type field.

### Dependencies
- Task 45: Create Customer Model

### Instructions

1. **Add type field**
   - Include individual, business, wholesale, VIP

2. **Document usage**
   - Note how type affects credit limits

### Expected Outcome
- Type field documented

### Verification Checklist
- [ ] Type field documented
- [ ] Usage noted

---

## Task 50: Add Customer Credit Limit

### Overview
Add a credit limit field for business customers.

### Dependencies
- Task 45: Create Customer Model

### Instructions

1. **Add credit limit field**
   - Use currency-based limit

2. **Document usage**
   - Note that limits are in LKR (₨)

### Expected Outcome
- Credit limit documented

### Verification Checklist
- [ ] Credit limit documented
- [ ] Currency noted as LKR

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 45 | Create Customer Model | Customer model documented |
| 46 | Add Customer Name Fields | Name fields documented |
| 47 | Add Customer Contact Fields | Contact fields documented |
| 48 | Add Customer Address Fields | Address fields documented |
| 49 | Add Customer Type Field | Type field documented |
| 50 | Add Customer Credit Limit | Credit limit documented |

### Next Steps
- Continue with [02_Tasks-51-56_Supplier-Model.md](02_Tasks-51-56_Supplier-Model.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 45 through 50 in sequence
2. **Addressing:** Consider a separate address structure
3. **No Code Snippets:** Avoid fenced code blocks in documentation
