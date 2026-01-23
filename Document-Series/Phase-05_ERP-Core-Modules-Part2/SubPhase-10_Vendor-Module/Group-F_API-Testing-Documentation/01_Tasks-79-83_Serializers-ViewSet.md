# Tasks 79-83: Serializers, ViewSet, and Filtering

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** F - API, Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-84-86_URLs-Tests-Docs.md](02_Tasks-84-86_URLs-Tests-Docs.md)

---

## Document Overview

This document creates DRF serializers for vendors and related models, implements the VendorViewSet with CRUD operations, and adds filtering capabilities.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create VendorSerializer | Medium | 30 min |
| 80 | Create VendorContactSerializer | Medium | 25 min |
| 81 | Create VendorProductSerializer | Medium | 25 min |
| 82 | Create VendorViewSet | High | 35 min |
| 83 | Implement Vendor Filtering | Medium | 25 min |

---

## Task 79: Create VendorSerializer

### Overview
Create DRF serializer for Vendor model with nested relationships.

### Dependencies
- Group E completed
- Django REST Framework installed

### Instructions

1. **Create vendor_serializer.py**
   - At `apps/vendors/serializers/vendor_serializer.py`

2. **Define VendorSerializer class**
   - Inherit from ModelSerializer
   - Meta class with Vendor model
   - Include all relevant fields

3. **Add nested serializers**
   - contacts: VendorContactSerializer(many=True, read_only=True)
   - addresses: VendorAddressSerializer(many=True, read_only=True)
   - bank_accounts: VendorBankAccountSerializer(many=True, read_only=True)

4. **Add computed fields**
   - products_count: SerializerMethodField
   - latest_performance: SerializerMethodField
   - contact_email: SerializerMethodField (primary contact email)

5. **Add validation**
   - Validate vendor_type choices
   - Validate email format
   - Validate credit_limit positive
   - Validate rating range (0-5)

### Vendor Serializer Fields
```
- All Vendor model fields
- contacts (nested)
- addresses (nested)
- bank_accounts (nested)
- products_count (computed)
- latest_performance (computed)
```

### Expected Outcome
- Complete vendor serialization
- Nested relationships
- Validation

### Verification Checklist
- [ ] VendorSerializer created
- [ ] Nested serializers added
- [ ] Validation implemented

---

## Task 80: Create VendorContactSerializer

### Overview
Create serializer for VendorContact model.

### Dependencies
- Task 79: Create VendorSerializer

### Instructions

1. **Create contact_serializer.py**
   - At `apps/vendors/serializers/contact_serializer.py`

2. **Define VendorContactSerializer**
   - Include all contact fields
   - Add full_name read-only field
   - Validate email or phone required

3. **Add nested serializer for creation**
   - Support creating contacts with vendor
   - Validate is_primary uniqueness

### Contact Serializer Fields
```
- first_name, last_name
- email, phone, mobile, whatsapp
- role, department, job_title
- is_primary, is_active
- full_name (read-only)
```

### Expected Outcome
- Contact serialization
- Creation support

### Verification Checklist
- [ ] ContactSerializer created
- [ ] Validation added

---

## Task 81: Create VendorProductSerializer

### Overview
Create serializer for VendorProduct model.

### Dependencies
- Task 80: Create VendorContactSerializer

### Instructions

1. **Create product_serializer.py**
   - At `apps/vendors/serializers/product_serializer.py`

2. **Define VendorProductSerializer**
   - Include product details (nested)
   - Include pricing fields
   - Include MOQ and lead time
   - Add is_preferred, is_active

3. **Add computed fields**
   - product_name (from Product)
   - product_sku (from Product)
   - total_cost (quantity × unit_cost)

### Vendor Product Fields
```
- vendor (read-only)
- product (nested details)
- vendor_sku
- unit_cost, bulk_price, bulk_qty
- min_order_qty, order_multiple
- lead_time_days
- is_preferred, is_active
```

### Expected Outcome
- Vendor product serialization
- Product details included

### Verification Checklist
- [ ] VendorProductSerializer created
- [ ] Product nested

---

## Task 82: Create VendorViewSet

### Overview
Create ViewSet for vendor CRUD operations with custom actions.

### Dependencies
- Task 81: Create VendorProductSerializer

### Instructions

1. **Create vendor_viewset.py**
   - At `apps/vendors/views/vendor_viewset.py`

2. **Define VendorViewSet class**
   - Inherit from ModelViewSet
   - Set queryset: Vendor.objects.all()
   - Set serializer_class: VendorSerializer
   - Add permission_classes

3. **Implement standard actions**
   - list(): List vendors with pagination
   - retrieve(): Get vendor detail
   - create(): Create new vendor
   - update(): Update vendor
   - partial_update(): Partial update
   - destroy(): Delete vendor (or deactivate)

4. **Add custom actions**
   - @action contacts(): List/add contacts
   - @action addresses(): List/add addresses
   - @action bank_accounts(): List/add bank accounts
   - @action products(): List vendor products
   - @action performance(): Get performance metrics
   - @action communications(): Get communication timeline
   - @action documents(): List/upload documents

5. **Add bulk actions**
   - @action bulk_activate(): Activate multiple vendors
   - @action bulk_deactivate(): Deactivate multiple

### ViewSet Actions

#### Standard CRUD
```
GET /vendors/ - List
POST /vendors/ - Create
GET /vendors/{id}/ - Retrieve
PUT /vendors/{id}/ - Update
PATCH /vendors/{id}/ - Partial update
DELETE /vendors/{id}/ - Delete
```

#### Custom Actions
```
GET /vendors/{id}/contacts/
POST /vendors/{id}/contacts/
GET /vendors/{id}/products/
GET /vendors/{id}/performance/
POST /vendors/{id}/communications/
GET /vendors/{id}/documents/
POST /vendors/import/ - CSV import
GET /vendors/export/ - CSV export
```

### Expected Outcome
- Complete API endpoints
- CRUD operations
- Custom actions

### Verification Checklist
- [ ] ViewSet created
- [ ] CRUD implemented
- [ ] Custom actions added

---

## Task 83: Implement Vendor Filtering

### Overview
Add filtering, search, and ordering capabilities.

### Dependencies
- Task 82: Create VendorViewSet

### Instructions

1. **Create filters.py**
   - At `apps/vendors/filters.py`

2. **Define VendorFilter class**
   - Inherit from django_filters.FilterSet
   - Add filters for common fields

3. **Add field filters**
   - status: Exact match
   - vendor_type: Exact match
   - province: Exact match
   - district: Exact match
   - is_preferred_vendor: Boolean
   - rating_min: Min rating
   - rating_max: Max rating
   - created_after: Date range
   - created_before: Date range

4. **Add search fields**
   - company_name (contains)
   - vendor_code (exact/contains)
   - primary_email (contains)
   - tags (JSON contains)

5. **Add ordering fields**
   - company_name
   - vendor_code
   - rating
   - total_orders
   - total_spend
   - created_at

6. **Configure in ViewSet**
   - Set filter_backends
   - Set filterset_class
   - Set search_fields
   - Set ordering_fields

### Filter Examples
```
GET /vendors/?status=ACTIVE
GET /vendors/?vendor_type=MANUFACTURER
GET /vendors/?rating_min=4.0
GET /vendors/?province=Western
GET /vendors/?search=electronics
GET /vendors/?ordering=-rating
GET /vendors/?is_preferred_vendor=true
GET /vendors/?tags=premium
```

### Expected Outcome
- Comprehensive filtering
- Search capability
- Flexible ordering

### Verification Checklist
- [ ] Filter class created
- [ ] All filters implemented
- [ ] Search configured
- [ ] Ordering configured

---

## Notes for AI Agents

### Serializer Best Practices
- Use nested serializers for read
- Use separate create/update serializers for writes
- Validate all user input
- Use SerializerMethodField for computed data
- Return proper error messages

### ViewSet Permissions
- IsAuthenticated for all actions
- IsAdminUser for delete/bulk actions
- Custom permissions for sensitive data
- Tenant-aware queries

### Performance Optimization
- Use select_related() for ForeignKeys
- Use prefetch_related() for Many relationships
- Paginate large result sets
- Cache frequently accessed data
- Add database indexes

### API Response Format
Follow consistent format:
```json
{
  "count": 100,
  "next": "url",
  "previous": "url",
  "results": [...]
}
```

### Error Handling
Return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad request
- 404: Not found
- 500: Server error
