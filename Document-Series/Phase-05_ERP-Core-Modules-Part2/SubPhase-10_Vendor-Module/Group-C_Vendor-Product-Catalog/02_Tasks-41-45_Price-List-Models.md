# Tasks 41-45: Price List Models

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** C - Vendor Product Catalog  
> **Document:** 02 of 03  
> **Tasks Covered:** 41, 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-40_VendorProduct-Model.md](01_Tasks-35-40_VendorProduct-Model.md)
- **→ Next Document:** [03_Tasks-46-50_Catalog-Service.md](03_Tasks-46-50_Catalog-Service.md)

---

## Document Overview

This document creates VendorPriceList and VendorPriceListItem models for managing vendor price lists with effective dates.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 41 | Create VendorPriceList Model | Medium | 25 min |
| 42 | Add Price List Fields | Medium | 20 min |
| 43 | Create VendorPriceListItem Model | Medium | 25 min |
| 44 | Add Price List Item Fields | Medium | 20 min |
| 45 | Run Price List Migrations | Low | 15 min |

---

## Task 41: Create VendorPriceList Model

### Overview
Create VendorPriceList model for managing vendor price lists with date ranges.

### Dependencies
- Task 40: Run VendorProduct Migrations

### Instructions

1. **Create vendor_price_list.py file**
   - Create at `apps/vendors/models/vendor_price_list.py`

2. **Define VendorPriceList model**
   - UUIDField primary key
   - ForeignKey to Vendor (CASCADE, related_name='price_lists')

3. **Configure Meta**
   - Ordering: ['-is_current', '-effective_from']

### Expected Outcome
- VendorPriceList model structure

### Verification Checklist
- [ ] Model created with vendor FK

---

## Task 42: Add Price List Fields

### Overview
Add fields for price list identification, date ranges, and current status.

### Dependencies
- Task 41: Create VendorPriceList Model

### Instructions

1. **Add name field**
   - CharField(200)
   - Price list name/title

2. **Add effective_from field**
   - DateField
   - When price list becomes active

3. **Add effective_to field**
   - DateField
   - Optional
   - When price list expires (null = open-ended)

4. **Add is_current field**
   - BooleanField
   - Default: False
   - Mark as current active price list

5. **Add notes field**
   - TextField

6. **Add audit fields**
   - created_at, updated_at
   - created_by: FK to User

### Price List Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| name | CharField(200) | Price list name |
| effective_from | DateField | Start date |
| effective_to | DateField | End date (optional) |
| is_current | BooleanField | Currently active |
| notes | TextField | Notes |

### Expected Outcome
- Complete price list header

### Verification Checklist
- [ ] All fields added
- [ ] Date range support

---

## Task 43: Create VendorPriceListItem Model

### Overview
Create VendorPriceListItem model for individual product prices in price lists.

### Dependencies
- Task 42: Add Price List Fields

### Instructions

1. **Define VendorPriceListItem model**
   - UUIDField primary key
   - ForeignKey to VendorPriceList (CASCADE, related_name='items')
   - ForeignKey to Product (PROTECT)

2. **Add unique constraint**
   - (price_list, product) unique

3. **Configure Meta**
   - Ordering: ['product']

### Expected Outcome
- Price list line items model

### Verification Checklist
- [ ] Model created with FKs
- [ ] Unique constraint added

---

## Task 44: Add Price List Item Fields

### Overview
Add pricing and quantity fields to price list items.

### Dependencies
- Task 43: Create VendorPriceListItem Model

### Instructions

1. **Add unit_price field**
   - DecimalField(15, 2)
   - Required
   - Price for this product

2. **Add min_qty field**
   - IntegerField
   - Default: 1
   - Minimum quantity for this price

3. **Add max_qty field**
   - IntegerField
   - Optional
   - Maximum quantity (for tiered pricing)

4. **Add notes field**
   - CharField(255)
   - Optional

### Item Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| unit_price | DecimalField(15,2) | Unit price |
| min_qty | IntegerField | Min quantity |
| max_qty | IntegerField | Max quantity |
| notes | CharField(255) | Item notes |

### Tiered Pricing Example
```
Product: Samsung TV 55"
├── 1-10 units: Rs. 95,000
├── 11-50 units: Rs. 92,000
└── 51+ units: Rs. 89,000
```

### Expected Outcome
- Tiered pricing support
- Quantity-based pricing

### Verification Checklist
- [ ] Pricing fields added
- [ ] Quantity tiers supported

---

## Task 45: Run Price List Migrations

### Overview
Generate and apply migrations for price list models.

### Dependencies
- Task 44: Add Price List Item Fields

### Instructions

1. **Generate migration**
   - Run makemigrations vendors

2. **Apply migration**
   - Run migrate vendors

3. **Test price list operations**
   - Create price list
   - Add items
   - Test date validation
   - Test current price list logic

### Expected Outcome
- Price list tables created
- All relationships functional

### Verification Checklist
- [ ] Migration applied
- [ ] Tables created
- [ ] Test price list created

---

## Notes for AI Agents

### Current Price List Logic
Only one is_current=True per vendor. When activating new price list, deactivate previous current list.

### Date Range Validation
- effective_from <= current_date
- effective_to >= current_date (if set)
- effective_from < effective_to

### Price Selection
For a given product and quantity, find applicable price from current price list based on quantity tiers.
