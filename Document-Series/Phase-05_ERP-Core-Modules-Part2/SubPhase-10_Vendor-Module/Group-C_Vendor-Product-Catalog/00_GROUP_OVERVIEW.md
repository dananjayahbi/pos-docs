# Group C: Vendor Product Catalog

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** C of F  
> **Tasks Covered:** 35-50  
> **Group Goal:** Link products to vendors with pricing, MOQ, and lead times

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group B: Contacts & Bank Details](../Group-B_Contacts-Bank-Details/)
- **→ Next Group:** [Group D: Performance & Communication](../Group-D_Performance-Communication/)

---

## Group Overview

### Key Outcomes

1. **VendorProduct Model** - Link vendors to products they supply
2. **VendorProduct Core Fields** - vendor FK, product FK, vendor_sku
3. **VendorProduct Pricing Fields** - unit_cost, bulk_price, currency
4. **VendorProduct Order Fields** - min_order_qty, order_multiple, lead_time_days
5. **VendorProduct Status Fields** - is_active, is_preferred, last_ordered_date
6. **VendorProduct Migrations** - Apply migrations
7. **VendorPriceList Model** - Price lists with effective dates
8. **Price List Fields** - name, effective_from, effective_to, is_current
9. **VendorPriceListItem Model** - Line items for price lists
10. **Price List Item Fields** - product FK, unit_price, min_qty, notes
11. **Price List Migrations** - Apply migrations
12. **Product Catalog Service** - Service for managing vendor products
13. **Add Product to Vendor** - Link product with pricing
14. **Update Vendor Pricing** - Update vendor-specific pricing
15. **Get Preferred Vendor** - Find best vendor for product
16. **Price Comparison** - Compare prices across vendors

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Product catalog models |
| Service Layer | Catalog business logic |
| Decimal | Precision for pricing |
| Date Range | Price list validity |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-35-40_VendorProduct-Model.md` | 35-40 | VendorProduct model, core/pricing/order/status fields, migrations |
| 02 | `02_Tasks-41-45_Price-List-Models.md` | 41-45 | VendorPriceList, VendorPriceListItem models, migrations |
| 03 | `03_Tasks-46-50_Catalog-Service.md` | 46-50 | CatalogService, add/update, preferred vendor, price comparison |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create VendorProduct Model | Medium | 25 min |
| 36 | Add VendorProduct Core Fields | Medium | 20 min |
| 37 | Add VendorProduct Pricing Fields | Medium | 20 min |
| 38 | Add VendorProduct Order Fields | Medium | 20 min |
| 39 | Add VendorProduct Status Fields | Medium | 20 min |
| 40 | Run VendorProduct Migrations | Low | 15 min |
| 41 | Create VendorPriceList Model | Medium | 25 min |
| 42 | Add Price List Fields | Medium | 20 min |
| 43 | Create VendorPriceListItem Model | Medium | 25 min |
| 44 | Add Price List Item Fields | Medium | 20 min |
| 45 | Run Price List Migrations | Low | 15 min |
| 46 | Implement Product Catalog Service | High | 30 min |
| 47 | Implement Add Product to Vendor | Medium | 25 min |
| 48 | Implement Update Vendor Pricing | Medium | 25 min |
| 49 | Implement Get Preferred Vendor | High | 30 min |
| 50 | Implement Price Comparison | High | 30 min |

---

## Execution Order

```
[Tasks 35-40: VendorProduct model]
         │
         ▼
[Tasks 41-45: Price list models]
         │
         ▼
[Tasks 46-50: Catalog service]
```

---

## Expected Deliverables

```
apps/vendors/
├── models/
│   ├── __init__.py
│   ├── vendor_product.py         # Tasks 35-39
│   └── vendor_price_list.py      # Tasks 41-44
├── services/
│   ├── __init__.py
│   └── catalog_service.py        # Tasks 46-50
└── migrations/
    ├── 0005_vendor_product.py    # Task 40
    └── 0006_price_list.py        # Task 45
```

---

## Notes for AI Agents

### VendorProduct Fields
- vendor: FK to Vendor
- product: FK to Product
- vendor_sku: CharField (vendor's SKU)
- unit_cost: Decimal
- bulk_price: Decimal (quantity discount price)
- bulk_qty: Integer (quantity for bulk price)
- currency: CharField (default LKR)
- min_order_qty: Integer (MOQ)
- order_multiple: Integer (order in multiples of)
- lead_time_days: Integer
- is_active: Boolean
- is_preferred: Boolean
- last_ordered_date: Date

### Unique Constraint
```
(vendor, product) must be unique
```

### VendorPriceList Fields
- vendor: FK to Vendor
- name: CharField
- effective_from: Date
- effective_to: Date (nullable for open-ended)
- is_current: Boolean
- notes: TextField
- created_at: DateTime
- created_by: FK to User

### VendorPriceListItem Fields
- price_list: FK to VendorPriceList
- product: FK to Product
- unit_price: Decimal
- min_qty: Integer (for volume discount)
- notes: CharField

### Vendor Product Catalog Example
```
Vendor: ABC Electronics (VND-00001)
├── Product: Samsung TV 55"
│   ├── Vendor SKU: ABC-TV-55
│   ├── Unit Cost: Rs. 85,000
│   ├── MOQ: 5 units
│   ├── Lead Time: 7 days
│   └── Is Preferred: Yes
│
├── Product: Samsung TV 65"
│   ├── Vendor SKU: ABC-TV-65
│   ├── Unit Cost: Rs. 125,000
│   ├── MOQ: 3 units
│   ├── Lead Time: 10 days
│   └── Is Preferred: Yes
```

### Get Preferred Vendor Criteria
1. Is marked as preferred
2. Lowest unit cost
3. Shortest lead time
4. Has stock (optional)
5. Best rating

### Price Comparison Response
```json
{
  "product": {"id": "uuid", "name": "Samsung TV 55\""},
  "vendors": [
    {
      "vendor_id": "uuid",
      "vendor_name": "ABC Electronics",
      "unit_cost": 85000,
      "lead_time_days": 7,
      "moq": 5,
      "is_preferred": true
    },
    {
      "vendor_id": "uuid",
      "vendor_name": "XYZ Suppliers",
      "unit_cost": 87000,
      "lead_time_days": 5,
      "moq": 3,
      "is_preferred": false
    }
  ],
  "recommended": "ABC Electronics"
}
```

### CatalogService Methods
- add_product_to_vendor(vendor_id, product_id, data)
- update_vendor_product(vendor_product_id, data)
- remove_product_from_vendor(vendor_product_id)
- set_preferred_vendor(product_id, vendor_id)
- get_preferred_vendor(product_id)
- compare_vendor_prices(product_id)
- get_vendor_products(vendor_id)
- get_product_vendors(product_id)
