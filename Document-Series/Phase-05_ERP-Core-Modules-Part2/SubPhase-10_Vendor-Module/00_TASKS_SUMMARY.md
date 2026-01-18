# SubPhase 10: Vendor Module - Tasks Summary

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase Index:** 10 of 12  
> **SubPhase Goal:** Build comprehensive vendor/supplier database with product catalogs, pricing, and performance tracking  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-09_Customer-Credit-Loyalty](../SubPhase-09_Customer-Credit-Loyalty/)
- **→ Next SubPhase:** [SubPhase-11_Purchase-Orders](../SubPhase-11_Purchase-Orders/)

---

## SubPhase Overview

This sub-phase implements a comprehensive vendor/supplier management system for B2B procurement. Supports vendor profiles with contact information, payment terms, bank details for payments, product catalogs per vendor with pricing, lead time tracking, and vendor performance metrics.

### Key Outcomes
- Vendor model with company and contact details
- Multiple contacts per vendor
- Bank details for payment processing
- Product catalog per vendor with vendor-specific pricing
- Lead time and minimum order quantity tracking
- Vendor performance scoring
- Communication/interaction logging
- Vendor document storage (contracts, certifications)
- CSV import/export for vendor migration

### Technology Context
- **Backend:** Django 5.x with DRF for API
- **Search:** Full-text search with PostgreSQL
- **Frontend:** Next.js 14+ with TypeScript
- **Vendor Code Format:** `VND-{SEQUENCE}`

### Dependencies
- Phase-03: User Model (for contact accounts)
- Phase-04: Product Module (for product catalog linking)

---

## Task Execution Order

```
TASK GROUP A: Vendor Model & Profile (Tasks 01-18)
        │
        ▼
TASK GROUP B: Contacts & Bank Details (Tasks 19-34)
        │
        ▼
TASK GROUP C: Vendor Product Catalog (Tasks 35-50)
        │
        ▼
TASK GROUP D: Performance & Communication (Tasks 51-66)
        │
        ▼
TASK GROUP E: Documents & Import/Export (Tasks 67-78)
        │
        ▼
TASK GROUP F: API, Testing & Documentation (Tasks 79-86)
```

---

## Task Index

### Group A: Vendor Model & Profile (Tasks 01-18)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create vendors Django App** | Create new Django app for vendors module with proper structure | None | 🔴 Not Created |
| 02 | **Register vendors App** | Add vendors app to TENANT_APPS in Django settings | Task 01 | 🔴 Not Created |
| 03 | **Define VendorStatus Choices** | Create enum: ACTIVE, INACTIVE, BLOCKED, PENDING_APPROVAL | Task 01 | 🔴 Not Created |
| 04 | **Define VendorType Choices** | Create enum: MANUFACTURER, DISTRIBUTOR, WHOLESALER, IMPORTER, SERVICE | Task 01 | 🔴 Not Created |
| 05 | **Create Vendor Model Core Fields** | Define Vendor with vendor_code, company_name, display_name | Task 04 | 🔴 Not Created |
| 06 | **Add Vendor Type Fields** | Add vendor_type, business_registration, tax_id | Task 05 | 🔴 Not Created |
| 07 | **Add Vendor Address Fields** | Add address_line_1, address_line_2, city, district, province, postal_code, country | Task 05 | 🔴 Not Created |
| 08 | **Add Vendor Contact Fields** | Add primary_email, primary_phone, website, fax | Task 05 | 🔴 Not Created |
| 09 | **Add Vendor Terms Fields** | Add payment_terms_days, credit_limit, currency | Task 05 | 🔴 Not Created |
| 10 | **Add Vendor Lead Time Fields** | Add default_lead_time_days, minimum_order_value | Task 05 | 🔴 Not Created |
| 11 | **Add Vendor Notes Fields** | Add notes, internal_notes, tags JSONField | Task 05 | 🔴 Not Created |
| 12 | **Add Vendor Rating Fields** | Add rating, total_orders, total_spend | Task 05 | 🔴 Not Created |
| 13 | **Add Vendor Date Fields** | Add created_at, updated_at, first_order_date, last_order_date | Task 05 | 🔴 Not Created |
| 14 | **Create Vendor Code Generator** | Auto-generate vendor codes: VND-{SEQUENCE} | Task 05 | 🔴 Not Created |
| 15 | **Add Vendor Logo Field** | Add logo ImageField for vendor branding | Task 05 | 🔴 Not Created |
| 16 | **Create Vendor Model Indexes** | Add indexes for vendor_code, company_name, status | Task 05 | 🔴 Not Created |
| 17 | **Create Vendor Model Constraints** | Add unique constraints, validation | Task 05 | 🔴 Not Created |
| 18 | **Run Initial Vendor Migrations** | Generate and apply migrations for Vendor model | Task 17 | 🔴 Not Created |

---

### Group B: Contacts & Bank Details (Tasks 19-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 19 | **Create VendorContact Model** | Model for multiple contacts per vendor | Task 18 | 🔴 Not Created |
| 20 | **Define ContactRole Choices** | Enum: SALES, ACCOUNTS, LOGISTICS, MANAGER, SUPPORT, OTHER | Task 19 | 🔴 Not Created |
| 21 | **Add Contact Core Fields** | Add first_name, last_name, email, phone, mobile | Task 19 | 🔴 Not Created |
| 22 | **Add Contact Role Fields** | Add role, is_primary, department, job_title | Task 19 | 🔴 Not Created |
| 23 | **Run Contact Migrations** | Generate and apply migrations for VendorContact | Task 22 | 🔴 Not Created |
| 24 | **Create VendorBankAccount Model** | Model for vendor bank details for payments | Task 18 | 🔴 Not Created |
| 25 | **Add Bank Core Fields** | Add bank_name, branch_name, account_name, account_number | Task 24 | 🔴 Not Created |
| 26 | **Add Bank Routing Fields** | Add swift_code, branch_code, is_default | Task 24 | 🔴 Not Created |
| 27 | **Add Bank Currency Field** | Add currency for multi-currency vendors | Task 24 | 🔴 Not Created |
| 28 | **Run Bank Account Migrations** | Generate and apply migrations for VendorBankAccount | Task 27 | 🔴 Not Created |
| 29 | **Create VendorAddress Model** | Model for multiple addresses (shipping, billing) | Task 18 | 🔴 Not Created |
| 30 | **Define AddressType Choices** | Enum: MAIN, WAREHOUSE, BILLING, SHIPPING | Task 29 | 🔴 Not Created |
| 31 | **Add Vendor Address Fields** | Add address fields with type | Task 29 | 🔴 Not Created |
| 32 | **Run Address Migrations** | Generate and apply migrations for VendorAddress | Task 31 | 🔴 Not Created |
| 33 | **Create VendorService Class** | Main service for vendor operations | Task 32 | 🔴 Not Created |
| 34 | **Implement Vendor CRUD** | Create, update, deactivate vendors | Task 33 | 🔴 Not Created |

---

### Group C: Vendor Product Catalog (Tasks 35-50)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create VendorProduct Model** | Model linking vendors to products they supply | Task 34 | 🔴 Not Created |
| 36 | **Add VendorProduct Core Fields** | Add vendor FK, product FK, vendor_sku | Task 35 | 🔴 Not Created |
| 37 | **Add VendorProduct Pricing Fields** | Add unit_cost, bulk_price, currency | Task 35 | 🔴 Not Created |
| 38 | **Add VendorProduct Order Fields** | Add min_order_qty, order_multiple, lead_time_days | Task 35 | 🔴 Not Created |
| 39 | **Add VendorProduct Status Fields** | Add is_active, is_preferred, last_ordered_date | Task 35 | 🔴 Not Created |
| 40 | **Run VendorProduct Migrations** | Generate and apply migrations for VendorProduct | Task 39 | 🔴 Not Created |
| 41 | **Create VendorPriceList Model** | Model for vendor price lists with effective dates | Task 40 | 🔴 Not Created |
| 42 | **Add Price List Fields** | Add name, effective_from, effective_to, is_current | Task 41 | 🔴 Not Created |
| 43 | **Create VendorPriceListItem Model** | Line items for price lists | Task 41 | 🔴 Not Created |
| 44 | **Add Price List Item Fields** | Add product FK, unit_price, min_qty, notes | Task 43 | 🔴 Not Created |
| 45 | **Run Price List Migrations** | Generate and apply migrations for price lists | Task 44 | 🔴 Not Created |
| 46 | **Implement Product Catalog Service** | Service for managing vendor products | Task 45 | 🔴 Not Created |
| 47 | **Implement Add Product to Vendor** | Link product to vendor with pricing | Task 46 | 🔴 Not Created |
| 48 | **Implement Update Vendor Pricing** | Update vendor-specific pricing | Task 46 | 🔴 Not Created |
| 49 | **Implement Get Preferred Vendor** | Get best vendor for product based on criteria | Task 46 | 🔴 Not Created |
| 50 | **Implement Price Comparison** | Compare prices across vendors for a product | Task 46 | 🔴 Not Created |

---

### Group D: Performance & Communication (Tasks 51-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 51 | **Create VendorPerformance Model** | Model for tracking vendor performance metrics | Task 50 | 🔴 Not Created |
| 52 | **Add Performance Metrics** | Add on_time_delivery_rate, quality_score, response_time | Task 51 | 🔴 Not Created |
| 53 | **Add Performance Period Fields** | Add period_start, period_end for time-based metrics | Task 51 | 🔴 Not Created |
| 54 | **Run Performance Migrations** | Generate and apply migrations for VendorPerformance | Task 53 | 🔴 Not Created |
| 55 | **Create PerformanceService Class** | Service for calculating vendor performance | Task 54 | 🔴 Not Created |
| 56 | **Implement Delivery Rate Calculator** | Calculate on-time delivery percentage | Task 55 | 🔴 Not Created |
| 57 | **Implement Quality Score Calculator** | Calculate quality based on returns/defects | Task 55 | 🔴 Not Created |
| 58 | **Implement Response Time Tracker** | Track vendor response time to orders | Task 55 | 🔴 Not Created |
| 59 | **Implement Overall Rating Calculator** | Calculate overall vendor rating | Task 55 | 🔴 Not Created |
| 60 | **Create VendorCommunication Model** | Model for logging vendor interactions | Task 54 | 🔴 Not Created |
| 61 | **Define CommunicationType Choices** | Enum: EMAIL, PHONE, MEETING, SITE_VISIT, OTHER | Task 60 | 🔴 Not Created |
| 62 | **Add Communication Fields** | Add type, subject, content, contacted_by, contact_date | Task 60 | 🔴 Not Created |
| 63 | **Add Communication Follow-up** | Add follow_up_date, follow_up_notes | Task 60 | 🔴 Not Created |
| 64 | **Run Communication Migrations** | Generate and apply migrations for VendorCommunication | Task 63 | 🔴 Not Created |
| 65 | **Implement Log Communication** | Service to log new communication | Task 64 | 🔴 Not Created |
| 66 | **Implement Communication Timeline** | Get chronological communication history | Task 65 | 🔴 Not Created |

---

### Group E: Documents & Import/Export (Tasks 67-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create VendorDocument Model** | Model for storing vendor documents | Task 66 | 🔴 Not Created |
| 68 | **Define DocumentType Choices** | Enum: CONTRACT, CERTIFICATE, PRICE_LIST, LICENSE, OTHER | Task 67 | 🔴 Not Created |
| 69 | **Add Document Fields** | Add type, name, file, expiry_date, uploaded_by | Task 67 | 🔴 Not Created |
| 70 | **Run Document Migrations** | Generate and apply migrations for VendorDocument | Task 69 | 🔴 Not Created |
| 71 | **Implement Document Upload** | Service to upload and store vendor documents | Task 70 | 🔴 Not Created |
| 72 | **Implement Document Expiry Alert** | Celery task for expiring document alerts | Task 71 | 🔴 Not Created |
| 73 | **Create Vendor CSV Importer** | Service to import vendors from CSV | Task 70 | 🔴 Not Created |
| 74 | **Implement Column Mapping** | Map CSV columns to vendor fields | Task 73 | 🔴 Not Created |
| 75 | **Implement Import Validation** | Validate data, skip/flag invalid rows | Task 74 | 🔴 Not Created |
| 76 | **Create Vendor CSV Exporter** | Export vendors to CSV format | Task 70 | 🔴 Not Created |
| 77 | **Create VendorHistory Model** | Model for tracking vendor profile changes | Task 70 | 🔴 Not Created |
| 78 | **Run History Migrations** | Generate and apply migrations for VendorHistory | Task 77 | 🔴 Not Created |

---

### Group F: API, Testing & Documentation (Tasks 79-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create VendorSerializer** | DRF serializer for Vendor with nested data | Task 78 | 🔴 Not Created |
| 80 | **Create VendorContactSerializer** | DRF serializer for contacts | Task 79 | 🔴 Not Created |
| 81 | **Create VendorProductSerializer** | DRF serializer for vendor products | Task 79 | 🔴 Not Created |
| 82 | **Create VendorViewSet** | ViewSet with CRUD, search, performance actions | Task 81 | 🔴 Not Created |
| 83 | **Implement Vendor Filtering** | Filter by status, type, rating, tags | Task 82 | 🔴 Not Created |
| 84 | **Register Vendor API URLs** | Add all vendor endpoints to URL configuration | Task 83 | 🔴 Not Created |
| 85 | **Create Vendor Module Tests** | Unit and integration tests for all modules | Task 84 | 🔴 Not Created |
| 86 | **Create Vendor Module Documentation** | API docs, vendor management guide | Task 85 | 🔴 Not Created |

---

## Expected File Structure

```
backend/apps/vendors/
├── __init__.py
├── admin.py                    # Admin for Vendor, Contact, Products
├── apps.py                     # App configuration
├── models/
│   ├── __init__.py
│   ├── vendor.py              # Vendor model with profile
│   ├── vendor_contact.py      # VendorContact model
│   ├── vendor_address.py      # VendorAddress model
│   ├── vendor_bank.py         # VendorBankAccount model
│   ├── vendor_product.py      # VendorProduct model
│   ├── vendor_price_list.py   # VendorPriceList models
│   ├── vendor_performance.py  # VendorPerformance model
│   ├── vendor_communication.py # VendorCommunication model
│   ├── vendor_document.py     # VendorDocument model
│   └── vendor_history.py      # VendorHistory model
├── services/
│   ├── __init__.py
│   ├── vendor_service.py      # Main vendor business logic
│   ├── catalog_service.py     # Product catalog service
│   ├── performance_service.py # Performance calculation
│   ├── import_service.py      # CSV import service
│   └── export_service.py      # CSV export service
├── serializers/
│   ├── __init__.py
│   ├── vendor_serializer.py   # Full vendor serializer
│   ├── contact_serializer.py
│   ├── product_serializer.py
│   └── performance_serializer.py
├── views/
│   ├── __init__.py
│   ├── vendor_viewset.py      # Vendor CRUD ViewSet
│   ├── catalog_views.py       # Product catalog endpoints
│   └── import_export_views.py # Import/Export endpoints
├── tasks/
│   ├── __init__.py
│   └── document_tasks.py      # Document expiry alerts
├── filters.py                  # Vendor filtering
├── urls.py                     # URL routing
├── signals.py                  # Vendor signals
├── permissions.py              # Vendor-specific permissions
├── tests/
│   ├── __init__.py
│   ├── test_models.py
│   ├── test_services.py
│   ├── test_catalog.py
│   └── test_api.py
└── migrations/
```

---

## Vendor Types

| Type | Description |
|------|-------------|
| **MANUFACTURER** | Produces goods directly |
| **DISTRIBUTOR** | Authorized distribution of brands |
| **WHOLESALER** | Bulk supplier with competitive pricing |
| **IMPORTER** | Imports goods from overseas |
| **SERVICE** | Service provider (not goods) |

---

## Vendor Code Format

```
VND-{SEQUENCE}

Examples:
- VND-00001  (First vendor)
- VND-00150  (150th vendor)

Alternatively with type prefix:
- MFR-00001  (Manufacturer)
- DIS-00001  (Distributor)
- WHS-00001  (Wholesaler)
```

---

## Vendor Performance Metrics

| Metric | Calculation | Weight |
|--------|-------------|--------|
| **On-Time Delivery** | Orders delivered on/before due date ÷ Total orders × 100 | 40% |
| **Quality Score** | (1 - Defective items ÷ Total items) × 100 | 30% |
| **Response Time** | Average time to respond to inquiries | 15% |
| **Price Competitiveness** | Comparison with market prices | 15% |

**Overall Rating:** Weighted average of all metrics (1-5 stars)

---

## Payment Terms

| Term | Days | Description |
|------|------|-------------|
| **CIA** | 0 | Cash in Advance |
| **COD** | 0 | Cash on Delivery |
| **Net 15** | 15 | Payment within 15 days |
| **Net 30** | 30 | Payment within 30 days |
| **Net 45** | 45 | Payment within 45 days |
| **Net 60** | 60 | Payment within 60 days |

---

## Vendor Product Catalog Structure

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
│
└── Product: LG Soundbar
    ├── Vendor SKU: ABC-SB-01
    ├── Unit Cost: Rs. 15,000
    ├── MOQ: 10 units
    ├── Lead Time: 5 days
    └── Is Preferred: No (other vendor preferred)
```

---

## Key Business Rules

1. **Unique Vendor Code:** Auto-generated, unique per tenant
2. **Primary Contact:** Each vendor must have one primary contact
3. **Default Bank:** One bank account should be marked as default
4. **Preferred Vendor:** One vendor can be marked preferred per product
5. **Performance Tracking:** Calculate monthly performance metrics
6. **Document Expiry:** Alert 30 days before document expiry
7. **Lead Time:** Consider in reorder point calculations
8. **Price Lists:** Support multiple with effective dates

---

## Sri Lanka Specific Considerations

- **Currency:** Default LKR, support USD for importers
- **Tax ID:** Business Registration Number (BRN)
- **Banks:** Local banks (Commercial Bank, HNB, BOC, etc.)
- **Import Vendors:** Customs clearance lead time
- **Payment:** Bank transfer (CEFT, SLIPS) common

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 86 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Completion Percentage | 0% |

**Last Updated:** 2026-01-17  
**Next Action:** Create Task 01 (vendors Django App)

---

## Notes for AI Agents

- Vendor and Customer modules have similar structure (consider shared base)
- Performance metrics should update automatically on order completion
- Price lists enable bulk pricing updates with effective dates
- Consider vendor portal for self-service (future phase)
- Document expiry is critical for compliance (licenses, certifications)
- Lead time integration with inventory reorder calculations
- Support multi-currency for international vendors
- Bank details are sensitive - consider encryption

---

*End of SubPhase 10 Tasks Summary*
