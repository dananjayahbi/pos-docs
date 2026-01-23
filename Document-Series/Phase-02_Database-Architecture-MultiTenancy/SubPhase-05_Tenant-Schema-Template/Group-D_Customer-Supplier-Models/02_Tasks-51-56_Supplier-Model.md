# Tasks 51-56: Supplier Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** D - Customer & Supplier Models  
> **Document:** 02 of 02  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-45-50_Customer-Model.md](01_Tasks-45-50_Customer-Model.md)
- **→ Next Group:** [../Group-E_Order-Invoice-Models/00_GROUP_OVERVIEW.md](../Group-E_Order-Invoice-Models/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document defines the Supplier model and its core fields for supplier management.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 51 | Create Supplier Model | Medium |
| 52 | Add Supplier Name Field | Simple |
| 53 | Add Supplier Contact Fields | Simple |
| 54 | Add Supplier Address Fields | Medium |
| 55 | Add Supplier Tax ID Field | Simple |
| 56 | Add Supplier Payment Terms | Simple |

---

## Task 51: Create Supplier Model

### Overview
Create the Supplier model for tenant supplier records.

### Dependencies
- Task 45: Create Customer Model

### Instructions

1. **Define Supplier model**
   - Capture supplier profile needs

2. **Document relationships**
   - Note supplier linkage to products or orders

### Expected Outcome
- Supplier model documented

### Verification Checklist
- [ ] Supplier model documented
- [ ] Relationships noted

---

## Task 52: Add Supplier Name Field

### Overview
Add a supplier name field.

### Dependencies
- Task 51: Create Supplier Model

### Instructions

1. **Add name field**
   - Store legal or trading name

2. **Document usage**
   - Note uniqueness rules per tenant

### Expected Outcome
- Name field documented

### Verification Checklist
- [ ] Name field documented
- [ ] Usage noted

---

## Task 53: Add Supplier Contact Fields

### Overview
Add contact fields for supplier communication.

### Dependencies
- Task 51: Create Supplier Model

### Instructions

1. **Add contact fields**
   - Include phone, email, mobile, and contact person

2. **Document validation**
   - Use +94 XX XXX XXXX for phone

### Expected Outcome
- Contact fields documented

### Verification Checklist
- [ ] Contact fields documented
- [ ] Phone format noted

---

## Task 54: Add Supplier Address Fields

### Overview
Add supplier address fields.

### Dependencies
- Task 51: Create Supplier Model

### Instructions

1. **Add address fields**
   - Capture billing or business address

2. **Document structure**
   - Note required fields

### Expected Outcome
- Address fields documented

### Verification Checklist
- [ ] Address fields documented
- [ ] Structure noted

---

## Task 55: Add Supplier Tax ID Field

### Overview
Add a tax ID field for Sri Lankan business registration.

### Dependencies
- Task 51: Create Supplier Model

### Instructions

1. **Add tax ID field**
   - Store Sri Lankan business registration number

2. **Document validation**
   - Note expected format or source

### Expected Outcome
- Tax ID documented

### Verification Checklist
- [ ] Tax ID documented
- [ ] Validation noted

---

## Task 56: Add Supplier Payment Terms

### Overview
Add a payment terms field for supplier agreements.

### Dependencies
- Task 51: Create Supplier Model

### Instructions

1. **Add payment terms field**
   - Include immediate, NET_15, NET_30, NET_60, COD

2. **Document usage**
   - Note default terms and overrides

### Expected Outcome
- Payment terms documented

### Verification Checklist
- [ ] Payment terms documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 51 | Create Supplier Model | Supplier model documented |
| 52 | Add Supplier Name Field | Name field documented |
| 53 | Add Supplier Contact Fields | Contact fields documented |
| 54 | Add Supplier Address Fields | Address fields documented |
| 55 | Add Supplier Tax ID Field | Tax ID documented |
| 56 | Add Supplier Payment Terms | Payment terms documented |

### Next Steps
- Proceed to [Group-E_Order-Invoice-Models](../Group-E_Order-Invoice-Models/00_GROUP_OVERVIEW.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 51 through 56 in sequence
2. **Tax ID:** Use Sri Lankan business registration format
3. **No Code Snippets:** Avoid fenced code blocks in documentation
