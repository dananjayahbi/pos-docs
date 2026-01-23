# Tasks 35-40: VendorProduct Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** C - Vendor Product Catalog  
> **Document:** 01 of 03  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-41-45_Price-List-Models.md](02_Tasks-41-45_Price-List-Models.md)

---

## Document Overview

This document creates the VendorProduct model to link vendors with products they supply, including pricing, minimum order quantities, and lead times.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create VendorProduct Model | Medium | 25 min |
| 36 | Add VendorProduct Core Fields | Medium | 20 min |
| 37 | Add VendorProduct Pricing Fields | Medium | 20 min |
| 38 | Add VendorProduct Order Fields | Medium | 20 min |
| 39 | Add VendorProduct Status Fields | Medium | 20 min |
| 40 | Run VendorProduct Migrations | Low | 15 min |

---

## Task 35: Create VendorProduct Model

### Overview
Create VendorProduct model to link products to vendors with vendor-specific details like SKU, pricing, and availability.

### Dependencies
- Group B completed: VendorService exists
- Product model exists from inventory module

### Instructions

1. **Create vendor_product.py file**
   - Create at `apps/vendors/models/vendor_product.py`

2. **Define VendorProduct model**
   - UUIDField primary key
   - ForeignKey to Vendor (CASCADE, related_name='products')
   - ForeignKey to Product (CASCADE, related_name='vendor_products')

3. **Add unique constraint**
   - (vendor, product) must be unique

4. **Configure Meta class**
   - Ordering: ['vendor', 'product']

### Expected Outcome
- VendorProduct model linking vendors and products

### Verification Checklist
- [ ] Model created with vendor and product FKs
- [ ] Unique constraint on (vendor, product)

---

## Task 36: Add VendorProduct Core Fields

### Overview
Add core identification fields including vendor SKU.

### Dependencies
- Task 35: Create VendorProduct Model

### Instructions

1. **Add vendor_sku field**
   - CharField(100)
   - Vendor's product SKU/code
   - Optional

2. **Add vendor_product_name field**
   - CharField(255)
   - Vendor's name for product
   - Optional (may differ from our product name)

3. **Add description field**
   - TextField
   - Vendor's product description
   - Optional

### Core Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| vendor_sku | CharField(100) | Vendor's SKU |
| vendor_product_name | CharField(255) | Vendor's product name |
| description | TextField | Vendor's description |

### Expected Outcome
- Vendor-specific product identification

### Verification Checklist
- [ ] Core identification fields added

---

## Task 37: Add VendorProduct Pricing Fields

### Overview
Add pricing fields including unit cost, bulk pricing, and currency.

### Dependencies
- Task 36: Add VendorProduct Core Fields

### Instructions

1. **Add unit_cost field**
   - DecimalField(15, 2)
   - Required
   - Vendor's unit price

2. **Add bulk_price field**
   - DecimalField(15, 2)
   - Optional
   - Price for bulk orders

3. **Add bulk_qty field**
   - IntegerField
   - Optional
   - Quantity threshold for bulk_price

4. **Add currency field**
   - CharField(3)
   - Default: "LKR"
   - ISO 4217 code

### Pricing Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| unit_cost | DecimalField(15,2) | Unit price |
| bulk_price | DecimalField(15,2) | Bulk price |
| bulk_qty | IntegerField | Bulk threshold |
| currency | CharField(3) | Currency code |

### Pricing Logic
```
Quantity < bulk_qty: Use unit_cost
Quantity >= bulk_qty: Use bulk_price
```

### Expected Outcome
- Flexible pricing support
- Bulk discount capability

### Verification Checklist
- [ ] Pricing fields added
- [ ] Currency support included

---

## Task 38: Add VendorProduct Order Fields

### Overview
Add order requirement fields: MOQ, order multiple, and lead time.

### Dependencies
- Task 37: Add VendorProduct Pricing Fields

### Instructions

1. **Add min_order_qty field**
   - IntegerField
   - Default: 1
   - Minimum order quantity

2. **Add order_multiple field**
   - IntegerField
   - Optional
   - Must order in multiples

3. **Add lead_time_days field**
   - IntegerField
   - Default: 7
   - Product-specific lead time

### Order Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| min_order_qty | IntegerField | MOQ |
| order_multiple | IntegerField | Order multiple |
| lead_time_days | IntegerField | Lead time |

### Order Validation
```
Order qty >= min_order_qty
Order qty % order_multiple == 0 (if multiple specified)
```

### Expected Outcome
- Order requirement enforcement
- Lead time tracking

### Verification Checklist
- [ ] MOQ and order multiple added
- [ ] Lead time field added

---

## Task 39: Add VendorProduct Status Fields

### Overview
Add status and tracking fields.

### Dependencies
- Task 38: Add VendorProduct Order Fields

### Instructions

1. **Add is_active field**
   - BooleanField
   - Default: True
   - Product still available from vendor

2. **Add is_preferred field**
   - BooleanField
   - Default: False
   - Mark as preferred vendor for this product

3. **Add last_ordered_date field**
   - DateField
   - Optional
   - Track last order date

4. **Add last_cost field**
   - DecimalField(15, 2)
   - Optional
   - Track cost changes

5. **Add notes and timestamps**
   - notes: TextField
   - created_at, updated_at

### Status Fields Summary

| Field | Type | Purpose |
|-------|------|---------|
| is_active | BooleanField | Available |
| is_preferred | BooleanField | Preferred vendor |
| last_ordered_date | DateField | Last order |
| last_cost | DecimalField | Previous cost |

### Expected Outcome
- Status tracking
- Preferred vendor designation
- Historical data

### Verification Checklist
- [ ] Status fields added
- [ ] Tracking fields added

---

## Task 40: Run VendorProduct Migrations

### Overview
Generate and apply migrations for VendorProduct model.

### Dependencies
- Task 39: Add VendorProduct Status Fields

### Instructions

1. **Generate migration**
   - Run makemigrations vendors

2. **Apply migration**
   - Run migrate vendors

3. **Test vendor product operations**
   - Create vendor-product link
   - Test pricing logic
   - Test MOQ validation

### Expected Outcome
- VendorProduct table created
- All fields operational

### Verification Checklist
- [ ] Migration applied
- [ ] Table created
- [ ] Test vendor product created

---

## Notes for AI Agents

### Preferred Vendor Logic
Only one vendor can be marked is_preferred per product. When setting new preferred, unset others automatically.

### Cost Tracking
Update last_cost field when creating new PO to track price changes over time.

### MOQ Validation
Validate order quantity meets minimum and multiple requirements before creating PO.
