# Tasks 67-72: Invoice & Payment

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** E - Order & Invoice Models  
> **Document:** 03 of 03  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-63-66_Order-Item.md](02_Tasks-63-66_Order-Item.md)
- **→ Next Group:** [../Group-F_Employee-Accounting-Models/00_GROUP_OVERVIEW.md](../Group-F_Employee-Accounting-Models/00_GROUP_OVERVIEW.md)

---

## Document Overview

This document defines the Invoice and Payment models plus their status and method fields.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Create Invoice Model | Medium |
| 68 | Add Invoice Number Field | Simple |
| 69 | Add Invoice Order FK | Simple |
| 70 | Add Invoice Status Field | Simple |
| 71 | Create Payment Model | Medium |
| 72 | Add Payment Method Field | Simple |

---

## Task 67: Create Invoice Model

### Overview
Create the Invoice model for billing.

### Dependencies
- Task 66: Add OrderItem Price Fields

### Instructions

1. **Define Invoice model**
   - Capture invoice lifecycle needs

2. **Document relationships**
   - Note optional link to Order

### Expected Outcome
- Invoice model documented

### Verification Checklist
- [ ] Invoice model documented
- [ ] Relationships noted

---

## Task 68: Add Invoice Number Field

### Overview
Add an invoice number field.

### Dependencies
- Task 67: Create Invoice Model

### Instructions

1. **Add invoice number field**
   - Use tenant-specific prefix if applicable

2. **Document uniqueness**
   - Note unique per tenant

### Expected Outcome
- Invoice number documented

### Verification Checklist
- [ ] Invoice number documented
- [ ] Uniqueness noted

---

## Task 69: Add Invoice Order FK

### Overview
Link invoices to orders where applicable.

### Dependencies
- Task 67: Create Invoice Model

### Instructions

1. **Add order foreign key**
   - Allow optional link to Order

2. **Document usage**
   - Note when invoices are order-linked

### Expected Outcome
- Invoice order FK documented

### Verification Checklist
- [ ] Order FK documented
- [ ] Usage noted

---

## Task 70: Add Invoice Status Field

### Overview
Add status tracking for invoice lifecycle.

### Dependencies
- Task 67: Create Invoice Model

### Instructions

1. **Add status field**
   - Include draft, sent, paid, overdue

2. **Document transitions**
   - Note key state changes

### Expected Outcome
- Invoice status documented

### Verification Checklist
- [ ] Invoice status documented
- [ ] Transitions noted

---

## Task 71: Create Payment Model

### Overview
Create the Payment model for invoice transactions.

### Dependencies
- Task 70: Add Invoice Status Field

### Instructions

1. **Define Payment model**
   - Capture payment details and linkage

2. **Document partial payments**
   - Note multiple payments per invoice

### Expected Outcome
- Payment model documented

### Verification Checklist
- [ ] Payment model documented
- [ ] Partial payment support noted

---

## Task 72: Add Payment Method Field

### Overview
Add payment method field for transaction types.

### Dependencies
- Task 71: Create Payment Model

### Instructions

1. **Add payment method field**
   - Include cash, card, bank transfer, cheque, mobile

2. **Document usage**
   - Note method selection rules

### Expected Outcome
- Payment method documented

### Verification Checklist
- [ ] Payment method documented
- [ ] Usage noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 67 | Create Invoice Model | Invoice model documented |
| 68 | Add Invoice Number Field | Invoice number documented |
| 69 | Add Invoice Order FK | Order FK documented |
| 70 | Add Invoice Status Field | Status documented |
| 71 | Create Payment Model | Payment model documented |
| 72 | Add Payment Method Field | Payment method documented |

### Next Steps
- Proceed to [Group-F_Employee-Accounting-Models](../Group-F_Employee-Accounting-Models/00_GROUP_OVERVIEW.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 67 through 72 in sequence
2. **Payments:** Support partial payments
3. **No Code Snippets:** Avoid fenced code blocks in documentation
