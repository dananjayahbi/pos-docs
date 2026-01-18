# SubPhase 08: Customer Module - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 08 of 12  
> **SubPhase Goal:** Build comprehensive customer database with profiles, purchase history, and segmentation  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 12-15 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-07_Payment-Recording](../SubPhase-07_Payment-Recording/)
- **→ Next SubPhase:** [SubPhase-09_Customer-Credit-Loyalty](../SubPhase-09_Customer-Credit-Loyalty/)

---

## SubPhase Overview

This sub-phase implements a comprehensive customer management system with support for Sri Lankan address formats, phone numbers, and business structures. Includes customer profiles, multiple contact methods, purchase history tracking, communication logs, customer segmentation, and duplicate detection with CSV import/export capabilities.

### Key Outcomes
- Customer model with individual and business support
- Sri Lanka address format (Province, District, City)
- Multiple phone numbers with +94 format validation
- Multiple addresses per customer
- Purchase history aggregation
- Communication/interaction logging
- Customer segmentation with tags
- Duplicate detection and merge
- CSV import/export for migration

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Search:** Full-text search with PostgreSQL
- **Frontend:** Next.js 14+ with TypeScript
- **Phone Format:** +94 XX XXX XXXX

### Dependencies
- Phase-03: User Model (base user for accounts)

---

## Task Execution Order

```
TASK GROUP A: Customer Model & Profile (Tasks 01-18)
        │
        ▼
TASK GROUP B: Addresses & Contact Information (Tasks 19-34)
        │
        ▼
TASK GROUP C: Customer Services & Search (Tasks 35-50)
        │
        ▼
TASK GROUP D: Communication & History (Tasks 51-64)
        │
        ▼
TASK GROUP E: Segmentation & Duplicate Detection (Tasks 65-78)
        │
        ▼
TASK GROUP F: Import/Export & API (Tasks 79-88)
```

---

## Task Index

### Group A: Customer Model & Profile (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create customers Django App** | Create new Django app for customers module with proper structure | None | 🔴 Not Created |
| 02 | **Register customers App** | Add customers app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define CustomerType Choices** | Create enum: INDIVIDUAL, BUSINESS, GOVERNMENT, NONPROFIT | Task 01 | 🔴 Not Created |
| 04 | **Define CustomerStatus Choices** | Create enum: ACTIVE, INACTIVE, BLOCKED, ARCHIVED | Task 01 | 🔴 Not Created |
| 05 | **Create Customer Model Core Fields** | Define Customer with customer_code, first_name, last_name, display_name | Task 04 | 🔴 Not Created |
| 06 | **Add Customer Type Fields** | Add customer_type, company_name, company_registration | Task 05 | 🔴 Not Created |
| 07 | **Add Customer Contact Fields** | Add email, primary_phone, secondary_phone | Task 05 | 🔴 Not Created |
| 08 | **Add Customer Tax Fields** | Add tax_id, vat_number for business customers | Task 05 | 🔴 Not Created |
| 09 | **Add Customer Date Fields** | Add created_at, updated_at, last_purchase_date, first_purchase_date | Task 05 | 🔴 Not Created |
| 10 | **Add Customer Financial Summary** | Add total_purchases, total_payments, outstanding_balance | Task 05 | 🔴 Not Created |
| 11 | **Add Customer Marketing Fields** | Add accepts_marketing, marketing_email_sent_at | Task 05 | 🔴 Not Created |
| 12 | **Add Customer Notes Fields** | Add notes TextField, internal_notes for staff comments | Task 05 | 🔴 Not Created |
| 13 | **Add Customer Source Field** | Add source: MANUAL, POS, WEBSTORE, IMPORT for tracking | Task 05 | 🔴 Not Created |
| 14 | **Create Customer Code Generator** | Auto-generate customer codes: CUST-{SEQUENCE} | Task 05 | 🔴 Not Created |
| 15 | **Add Customer Profile Image** | Add profile_image field with image upload support | Task 05 | 🔴 Not Created |
| 16 | **Create Customer Model Indexes** | Add indexes for customer_code, email, phone, name | Task 05 | 🔴 Not Created |
| 17 | **Create Customer Model Constraints** | Add unique constraints, email/phone validation | Task 05 | 🔴 Not Created |
| 18 | **Run Initial Customer Migrations** | Generate and apply migrations for Customer model | Task 17 | 🔴 Not Created |

---

### Group B: Addresses & Contact Information (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create CustomerAddress Model** | Model for multiple addresses per customer | Task 18 | 🔴 Not Created |
| 20 | **Define AddressType Choices** | Enum: BILLING, SHIPPING, HOME, WORK, OTHER | Task 19 | 🔴 Not Created |
| 21 | **Add Address Core Fields** | Add address_line_1, address_line_2, city | Task 19 | 🔴 Not Created |
| 22 | **Add Sri Lanka Address Fields** | Add district, province with Sri Lanka options | Task 19 | 🔴 Not Created |
| 23 | **Add Address Postal Fields** | Add postal_code, country (default Sri Lanka) | Task 19 | 🔴 Not Created |
| 24 | **Add Address Default Flag** | Add is_default_billing, is_default_shipping booleans | Task 19 | 🔴 Not Created |
| 25 | **Add Address Validation** | Validate Sri Lanka district-province mapping | Task 24 | 🔴 Not Created |
| 26 | **Run Address Migrations** | Generate and apply migrations for CustomerAddress | Task 25 | 🔴 Not Created |
| 27 | **Create CustomerPhone Model** | Model for multiple phone numbers per customer | Task 18 | 🔴 Not Created |
| 28 | **Define PhoneType Choices** | Enum: MOBILE, LANDLINE, WHATSAPP, WORK, OTHER | Task 27 | 🔴 Not Created |
| 29 | **Add Phone Number Fields** | Add phone_number, phone_type, is_primary | Task 27 | 🔴 Not Created |
| 30 | **Add Phone Validation** | Validate Sri Lanka phone format (+94, 07X) | Task 29 | 🔴 Not Created |
| 31 | **Add WhatsApp Indicator** | Add is_whatsapp boolean for messaging | Task 29 | 🔴 Not Created |
| 32 | **Run Phone Migrations** | Generate and apply migrations for CustomerPhone | Task 31 | 🔴 Not Created |
| 33 | **Create Sri Lanka Provinces List** | Define 9 provinces with districts mapping | Task 18 | 🔴 Not Created |
| 34 | **Create Sri Lanka Districts List** | Define 25 districts with city mappings | Task 33 | 🔴 Not Created |

---

### Group C: Customer Services & Search (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create CustomerService Class** | Main service class for customer operations | Task 34 | 🔴 Not Created |
| 36 | **Implement Customer Creation** | Create customer with addresses and phones | Task 35 | 🔴 Not Created |
| 37 | **Implement Customer Update** | Update customer profile and related data | Task 35 | 🔴 Not Created |
| 38 | **Implement Customer Deactivation** | Soft delete/deactivate customer | Task 35 | 🔴 Not Created |
| 39 | **Implement Customer Search** | Full-text search across name, email, phone, code | Task 35 | 🔴 Not Created |
| 40 | **Create PostgreSQL Search Vector** | Add search_vector field for full-text search | Task 39 | 🔴 Not Created |
| 41 | **Implement Search Vector Update Trigger** | Auto-update search vector on customer change | Task 40 | 🔴 Not Created |
| 42 | **Implement Quick Search** | Fast search by customer code or phone | Task 39 | 🔴 Not Created |
| 43 | **Implement Customer Lookup by Phone** | Find customer by phone number (POS use case) | Task 35 | 🔴 Not Created |
| 44 | **Implement Customer Lookup by Email** | Find customer by email address | Task 35 | 🔴 Not Created |
| 45 | **Create CustomerHistory Model** | Model for tracking customer profile changes | Task 35 | 🔴 Not Created |
| 46 | **Implement History Logging** | Log all customer changes with old/new values | Task 45 | 🔴 Not Created |
| 47 | **Create CustomerSettings Model** | Tenant settings for customer codes, defaults | Task 35 | 🔴 Not Created |
| 48 | **Implement Default Settings** | Apply defaults from CustomerSettings | Task 47 | 🔴 Not Created |
| 49 | **Run Service Layer Migrations** | Generate migrations for History, Settings | Task 48 | 🔴 Not Created |
| 50 | **Create Customer Cache** | Cache frequently accessed customers | Task 35 | 🔴 Not Created |

---

### Group D: Communication & History (Tasks 51-64)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create CustomerCommunication Model** | Model for logging customer interactions | Task 50 | 🔴 Not Created |
| 52 | **Define CommunicationType Choices** | Enum: EMAIL, PHONE_CALL, SMS, VISIT, NOTE, OTHER | Task 51 | 🔴 Not Created |
| 53 | **Add Communication Fields** | Add type, subject, content, contacted_by | Task 51 | 🔴 Not Created |
| 54 | **Add Communication Date Fields** | Add communication_date, follow_up_date | Task 51 | 🔴 Not Created |
| 55 | **Run Communication Migrations** | Generate migrations for CustomerCommunication | Task 54 | 🔴 Not Created |
| 56 | **Implement Log Communication** | Service to log new communication entry | Task 55 | 🔴 Not Created |
| 57 | **Implement Communication Timeline** | Retrieve chronological communication history | Task 56 | 🔴 Not Created |
| 58 | **Create PurchaseHistory Aggregation** | Aggregate orders, invoices, payments per customer | Task 50 | 🔴 Not Created |
| 59 | **Implement Purchase Summary** | Calculate total spent, order count, average order | Task 58 | 🔴 Not Created |
| 60 | **Implement Top Products Bought** | List frequently purchased products per customer | Task 58 | 🔴 Not Created |
| 61 | **Implement Last Purchase Info** | Get last purchase date, amount, products | Task 58 | 🔴 Not Created |
| 62 | **Implement Customer Statistics** | Calculate lifetime value, purchase frequency | Task 58 | 🔴 Not Created |
| 63 | **Create Customer Activity Feed** | Combined feed of all customer activities | Task 57 | 🔴 Not Created |
| 64 | **Implement Activity Feed Pagination** | Paginated activity feed with filters | Task 63 | 🔴 Not Created |

---

### Group E: Segmentation & Duplicate Detection (Tasks 65-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 65 | **Create CustomerTag Model** | Model for customer tags/labels | Task 64 | 🔴 Not Created |
| 66 | **Add Tag Fields** | Add name, color, description | Task 65 | 🔴 Not Created |
| 67 | **Create CustomerTagAssignment** | Many-to-many relationship for customer tags | Task 65 | 🔴 Not Created |
| 68 | **Run Tag Migrations** | Generate migrations for tags | Task 67 | 🔴 Not Created |
| 69 | **Implement Tag Assignment** | Assign/remove tags from customers | Task 68 | 🔴 Not Created |
| 70 | **Implement Tag-based Filtering** | Filter customers by tags | Task 69 | 🔴 Not Created |
| 71 | **Create CustomerSegment Model** | Model for dynamic customer segments | Task 68 | 🔴 Not Created |
| 72 | **Add Segment Rule Fields** | Add rules JSONField for segment criteria | Task 71 | 🔴 Not Created |
| 73 | **Implement Segment Evaluation** | Evaluate customers against segment rules | Task 72 | 🔴 Not Created |
| 74 | **Implement Duplicate Detection** | Detect potential duplicates by email, phone, name | Task 68 | 🔴 Not Created |
| 75 | **Create Duplicate Score Algorithm** | Calculate similarity score for potential matches | Task 74 | 🔴 Not Created |
| 76 | **Implement Customer Merge** | Merge duplicate customers, consolidate data | Task 75 | 🔴 Not Created |
| 77 | **Create Merge History** | Track merged customers for audit | Task 76 | 🔴 Not Created |
| 78 | **Run Segment Migrations** | Generate migrations for Segment, Merge | Task 77 | 🔴 Not Created |

---

### Group F: Import/Export & API (Tasks 79-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Customer CSV Importer** | Service to import customers from CSV | Task 78 | 🔴 Not Created |
| 80 | **Implement Column Mapping** | Map CSV columns to customer fields | Task 79 | 🔴 Not Created |
| 81 | **Implement Import Validation** | Validate data, skip/flag invalid rows | Task 80 | 🔴 Not Created |
| 82 | **Implement Import Progress Tracking** | Track import progress for large files | Task 81 | 🔴 Not Created |
| 83 | **Create Customer CSV Exporter** | Export customers to CSV format | Task 78 | 🔴 Not Created |
| 84 | **Create CustomerSerializer** | DRF serializer for Customer with nested data | Task 78 | 🔴 Not Created |
| 85 | **Create CustomerViewSet** | ViewSet with CRUD, search, import actions | Task 84 | 🔴 Not Created |
| 86 | **Implement Customer Filtering** | Filter by status, type, tags, date range | Task 85 | 🔴 Not Created |
| 87 | **Register Customer API URLs** | Add all customer endpoints to URL configuration | Task 86 | 🔴 Not Created |
| 88 | **Create Customer Module Tests** | Unit and integration tests for models, services, API | Task 87 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/customers/
├── __init__.py
├── admin.py                    # Admin for Customer, Address, Phone
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── customer.py            # Customer model with profile
│   ├── customer_address.py    # CustomerAddress model
│   ├── customer_phone.py      # CustomerPhone model
│   ├── customer_tag.py        # CustomerTag and assignment
│   ├── customer_segment.py    # CustomerSegment for dynamic groups
│   ├── customer_communication.py  # Communication log
│   ├── customer_history.py    # CustomerHistory for audit
│   └── customer_settings.py   # CustomerSettings for tenant
├── services/
│   ├── __init__.py
│   ├── customer_service.py    # Main customer business logic
│   ├── search_service.py      # Full-text search service
│   ├── history_service.py     # Purchase history aggregation
│   ├── duplicate_service.py   # Duplicate detection and merge
│   ├── import_service.py      # CSV import service
│   └── export_service.py      # CSV export service
├── serializers/
│   ├── __init__.py
│   ├── customer_serializer.py # Full customer serializer
│   ├── address_serializer.py
│   ├── phone_serializer.py
│   └── tag_serializer.py
├── views/
│   ├── __init__.py
│   ├── customer_viewset.py    # Customer CRUD ViewSet
│   ├── import_view.py         # CSV import endpoint
│   └── export_view.py         # CSV export endpoint
├── data/
│   ├── provinces.py           # Sri Lanka provinces
│   └── districts.py           # Sri Lanka districts
├── filters.py                  # Customer filtering
├── urls.py                     # URL routing
├── signals.py                  # Customer signals
├── permissions.py              # Customer-specific permissions
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_search.py
│   ├── test_import.py
│   └── test_api.py
└── migrations/
```

---

## Customer Types

| Type | Description | Additional Fields |
|------|-------------|-------------------|
| **INDIVIDUAL** | Personal customer | first_name, last_name |
| **BUSINESS** | Company/business | company_name, company_registration, tax_id |
| **GOVERNMENT** | Government entity | department_name, budget_code |
| **NONPROFIT** | NGO/Charity | organization_name, registration_number |

---

## Sri Lanka Address Structure

```
Address Line 1:  No. 123, Main Street
Address Line 2:  Near Temple Junction (optional)
City:            Colombo
District:        Colombo District
Province:        Western Province
Postal Code:     00100
Country:         Sri Lanka

Provinces (9):
├── Western Province (Colombo, Gampaha, Kalutara)
├── Central Province (Kandy, Matale, Nuwara Eliya)
├── Southern Province (Galle, Matara, Hambantota)
├── Northern Province (Jaffna, Kilinochchi, Mannar, Mullaitivu, Vavuniya)
├── Eastern Province (Batticaloa, Ampara, Trincomalee)
├── North Western Province (Kurunegala, Puttalam)
├── North Central Province (Anuradhapura, Polonnaruwa)
├── Uva Province (Badulla, Monaragala)
└── Sabaragamuwa Province (Ratnapura, Kegalle)
```

---

## Phone Number Format

```
Mobile:    +94 7X XXX XXXX  (e.g., +94 77 123 4567)
Landline:  +94 XX XXX XXXX  (e.g., +94 11 234 5678)

Validation Rules:
- Mobile starts with 7 (70, 71, 72, 75, 76, 77, 78)
- Landline area codes: 11 (Colombo), 21 (Jaffna), 31 (Negombo), etc.
- Total digits: 10 (excluding +94)
```

---

## Customer Code Format

```
CUST-{SEQUENCE}

Examples:
- CUST-00001  (First customer)
- CUST-05432  (5432nd customer)

Alternatively with prefix:
- IND-00001   (Individual)
- BUS-00001   (Business)
```

---

## Duplicate Detection Rules

| Field | Match Score |
|-------|-------------|
| Email (exact) | 100 |
| Phone (exact) | 90 |
| Name + Phone (fuzzy) | 80 |
| Name + Address (fuzzy) | 70 |
| Name only (fuzzy) | 50 |

**Threshold:** Score > 70 triggers duplicate warning

---

## Key Business Rules

1. **Unique Constraints:** Email and primary phone should be unique per tenant
2. **Address Required:** At least one address for business customers
3. **Phone Format:** Validate Sri Lanka phone format
4. **Soft Delete:** Never hard delete, only archive
5. **Merge Priority:** Keep older customer record as primary
6. **Search Vector:** Update on any name/email/phone change
7. **Communication Log:** Required for CRM tracking
8. **Import Validation:** Skip duplicates, log errors

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (customers Django App)

---

## Notes for AI Agents

- Use PostgreSQL full-text search for better performance
- Implement phonetic matching for Sinhala/Tamil names
- Cache hot customers (frequently accessed)
- Consider Elasticsearch for larger customer bases
- Import should handle 10,000+ customers in batch
- Export should support custom field selection
- Segment rules should be JSON-based for flexibility
- Track last_activity_date for engagement metrics
- WhatsApp integration is important for Sri Lankan market

---

*End of SubPhase 08 Tasks Summary*
