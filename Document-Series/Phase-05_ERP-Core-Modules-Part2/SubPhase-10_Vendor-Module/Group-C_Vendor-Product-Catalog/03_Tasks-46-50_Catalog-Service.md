# Tasks 46-50: Catalog Service

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** C - Vendor Product Catalog  
> **Document:** 03 of 03  
> **Tasks Covered:** 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-41-45_Price-List-Models.md](02_Tasks-41-45_Price-List-Models.md)

---

## Document Overview

This document implements the CatalogService for managing vendor products, pricing, and vendor selection logic.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 46 | Implement Product Catalog Service | High | 30 min |
| 47 | Implement Add Product to Vendor | Medium | 25 min |
| 48 | Implement Update Vendor Pricing | Medium | 25 min |
| 49 | Implement Get Preferred Vendor | High | 30 min |
| 50 | Implement Price Comparison | High | 30 min |

---

## Task 46: Implement Product Catalog Service

### Overview
Create CatalogService class to manage vendor product catalog operations.

### Dependencies
- Task 45: Run Price List Migrations

### Instructions

1. **Create catalog_service.py file**
   - Create at `apps/vendors/services/catalog_service.py`

2. **Define CatalogService class**
   - Import VendorProduct, VendorPriceList models
   - Add static or class methods

3. **Add service method stubs**
   - add_product_to_vendor()
   - update_vendor_product()
   - remove_product_from_vendor()
   - get_vendor_products()
   - get_product_vendors()

### Expected Outcome
- CatalogService structure

### Verification Checklist
- [ ] Service class created
- [ ] Method stubs defined

---

## Task 47: Implement Add Product to Vendor

### Overview
Implement method to link product to vendor with pricing and order details.

### Dependencies
- Task 46: Implement Product Catalog Service

### Instructions

1. **Implement add_product_to_vendor method**
   - Parameters: vendor_id, product_id, data dict
   - Validate vendor and product exist
   - Check if already linked
   - Create VendorProduct record
   - Set pricing, MOQ, lead time
   - Return created vendor_product

2. **Add validation**
   - Vendor must be ACTIVE
   - Product must exist
   - unit_cost required
   - MOQ must be positive

3. **Handle duplicates**
   - Check (vendor, product) uniqueness
   - Update if exists or raise error

### Expected Outcome
- Product-vendor linking functionality

### Verification Checklist
- [ ] Method implemented
- [ ] Validation added
- [ ] Duplicate handling

---

## Task 48: Implement Update Vendor Pricing

### Overview
Implement method to update vendor-specific product pricing and terms.

### Dependencies
- Task 47: Implement Add Product to Vendor

### Instructions

1. **Implement update_vendor_product method**
   - Parameters: vendor_product_id, update_data
   - Load VendorProduct instance
   - Update allowed fields (unit_cost, MOQ, lead_time, etc.)
   - Track previous cost in last_cost
   - Save changes
   - Return updated vendor_product

2. **Track price changes**
   - Before updating unit_cost, save current cost to last_cost
   - Log price change for audit

3. **Validate updates**
   - Positive pricing
   - Valid MOQ and multiples

### Expected Outcome
- Pricing update functionality
- Price change tracking

### Verification Checklist
- [ ] Update method implemented
- [ ] Price tracking added
- [ ] Validation included

---

## Task 49: Implement Get Preferred Vendor

### Overview
Implement logic to find preferred vendor for a product based on multiple criteria.

### Dependencies
- Task 48: Implement Update Vendor Pricing

### Instructions

1. **Implement get_preferred_vendor method**
   - Parameter: product_id
   - Query VendorProduct for product
   - Filter is_active=True
   - Check multiple criteria

2. **Selection criteria (in order)**
   - First: is_preferred=True
   - Second: Lowest unit_cost
   - Third: Shortest lead_time
   - Fourth: Vendor rating
   - Fifth: Most recent orders

3. **Return vendor data**
   - Vendor instance
   - VendorProduct data (price, MOQ, lead time)
   - Reason for selection

4. **Handle no vendors**
   - Return None if no vendors supply product
   - Raise exception or return empty

### Preferred Vendor Logic
```
1. Check is_preferred flag
2. If multiple preferred, compare:
   - Unit cost (lower better)
   - Lead time (shorter better)
   - Vendor rating (higher better)
3. Return best match
```

### Expected Outcome
- Intelligent vendor selection
- Multi-criteria evaluation

### Verification Checklist
- [ ] Method implemented
- [ ] Criteria logic added
- [ ] No-vendor handling

---

## Task 50: Implement Price Comparison

### Overview
Implement method to compare prices across all vendors for a product.

### Dependencies
- Task 49: Implement Get Preferred Vendor

### Instructions

1. **Implement compare_vendor_prices method**
   - Parameter: product_id
   - Query all VendorProduct for product
   - Filter is_active=True
   - Collect vendor data

2. **Build comparison data**
   - Vendor name and ID
   - Unit cost
   - Bulk pricing
   - MOQ
   - Lead time
   - Vendor rating
   - is_preferred flag

3. **Sort results**
   - Primary: unit_cost (ascending)
   - Secondary: lead_time (ascending)
   - Tertiary: rating (descending)

4. **Add recommendation**
   - Mark recommended vendor
   - Show savings vs others
   - Highlight preferred vendors

### Price Comparison Response
```python
{
    "product": {...},
    "vendors": [
        {
            "vendor_id": "uuid",
            "vendor_name": "ABC Electronics",
            "unit_cost": 85000,
            "lead_time_days": 7,
            "moq": 5,
            "is_preferred": true,
            "rating": 4.5
        },
        # More vendors...
    ],
    "recommended": "ABC Electronics",
    "savings": 2000  # vs next cheapest
}
```

### Expected Outcome
- Complete price comparison
- Vendor ranking
- Cost savings identification

### Verification Checklist
- [ ] Method implemented
- [ ] Comparison data complete
- [ ] Recommendation logic added

---

## Notes for AI Agents

### Catalog Service Usage
- Used by procurement module
- Used by PO creation
- Used by product sourcing
- Used by pricing reports

### Performance Optimization
- Cache preferred vendors
- Index VendorProduct for product queries
- Prefetch related vendor data

### Business Rules
- Always check is_active status
- Respect MOQ requirements
- Consider lead times for urgent orders
- Factor in vendor ratings
- Prefer local vendors for fast delivery
