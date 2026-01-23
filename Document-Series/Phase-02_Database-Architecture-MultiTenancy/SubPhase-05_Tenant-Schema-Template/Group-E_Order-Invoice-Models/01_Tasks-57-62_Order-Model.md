# Tasks 57-62: Order Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 05 - Tenant Schema Template  
> **Group:** E - Order & Invoice Models  
> **Document:** 01 of 03  
> **Tasks Covered:** 57, 58, 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-D_Customer-Supplier-Models/00_GROUP_OVERVIEW.md](../Group-D_Customer-Supplier-Models/00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-63-66_Order-Item.md](02_Tasks-63-66_Order-Item.md)

---

## Document Overview

This document defines the Order model and its core fields for tracking customer purchases.

### Tasks in This Document

| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 57 | Create Order Model | Medium |
| 58 | Add Order Number Field | Simple |
| 59 | Add Order Customer FK | Simple |
| 60 | Add Order Status Field | Simple |
| 61 | Add Order Date Field | Simple |
| 62 | Add Order Total Fields | Medium |

---

## Task 57: Create Order Model

### Overview
Create the Order model for tenant purchase workflows.

### Dependencies
- Task 50: Add Customer Credit Limit

### Instructions

1. **Define Order model**
   - Capture order lifecycle needs

2. **Document workflow**
   - Note status progression

### Expected Outcome
- Order model documented

### Verification Checklist
- [ ] Order model documented
- [ ] Workflow noted

---

## Task 58: Add Order Number Field

### Overview
Add an order number field with tenant-specific prefixing.

### Dependencies
- Task 57: Create Order Model

### Instructions

1. **Add order number field**
   - Use TenantSettings prefix plus sequence

2. **Document uniqueness**
   - Note unique per tenant

### Expected Outcome
- Order number documented

### Verification Checklist
- [ ] Order number documented
- [ ] Uniqueness noted

---

## Task 59: Add Order Customer FK

### Overview
Link orders to customers.

### Dependencies
- Task 57: Create Order Model

### Instructions

1. **Add customer foreign key**
   - Link to Customer model

2. **Document usage**
   - Note customer lookups in reports

### Expected Outcome
- Customer FK documented

### Verification Checklist
- [ ] Customer FK documented
- [ ] Usage noted

---

## Task 60: Add Order Status Field

### Overview
Add an order status field for workflow tracking.

### Dependencies
- Task 57: Create Order Model

### Instructions

1. **Add status field**
   - Include pending, confirmed, shipped, delivered, cancelled, returned

2. **Document transitions**
   - Note when status changes occur

### Expected Outcome
- Status field documented

### Verification Checklist
- [ ] Status field documented
- [ ] Transitions noted

---

## Task 61: Add Order Date Field

### Overview
Add an order date field.

### Dependencies
- Task 57: Create Order Model

### Instructions

1. **Add order date field**
   - Capture order creation date

2. **Document usage**
   - Note time zone as Asia/Colombo

### Expected Outcome
- Order date documented

### Verification Checklist
- [ ] Order date documented
- [ ] Time zone noted

---

## Task 62: Add Order Total Fields

### Overview
Add subtotal, tax, discount, and total fields.

### Dependencies
- Task 57: Create Order Model

### Instructions

1. **Add total fields**
   - Include subtotal, tax, discount, total

2. **Document calculation**
   - Note computed via model methods or signals

### Expected Outcome
- Total fields documented

### Verification Checklist
- [ ] Total fields documented
- [ ] Calculation noted

---

## Summary

### Tasks Completed in This Document

| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 57 | Create Order Model | Order model documented |
| 58 | Add Order Number Field | Order number documented |
| 59 | Add Order Customer FK | Customer FK documented |
| 60 | Add Order Status Field | Status field documented |
| 61 | Add Order Date Field | Order date documented |
| 62 | Add Order Total Fields | Totals documented |

### Next Steps
- Continue with [02_Tasks-63-66_Order-Item.md](02_Tasks-63-66_Order-Item.md)

---

## Notes for AI Agents

1. **Execution Order:** Complete tasks 57 through 62 in sequence
2. **Order Number:** Use tenant prefix + sequence
3. **No Code Snippets:** Avoid fenced code blocks in documentation
