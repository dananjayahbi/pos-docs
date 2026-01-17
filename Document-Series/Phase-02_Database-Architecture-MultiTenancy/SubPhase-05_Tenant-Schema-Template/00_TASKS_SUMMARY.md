# SubPhase 05: Tenant Schema Template - Tasks Summary

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase Index:** 05 of 10  
> **SubPhase Goal:** Define the complete schema template that each tenant receives  
> **Total Tasks:** 94 | **Status:** Planning  
> **Estimated Duration:** 7-8 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_Tenant-Model-Domain-Model](../SubPhase-04_Tenant-Model-Domain-Model/)
- **→ Next SubPhase:** [SubPhase-06_Tenant-Middleware-Configuration](../SubPhase-06_Tenant-Middleware-Configuration/)

---

## SubPhase Overview

This sub-phase defines the complete database schema template that every new tenant receives. Each tenant gets their own isolated PostgreSQL schema with tables for products, inventory, customers, orders, invoices, employees, accounting, and more.

### Key Outcomes
- Complete tenant schema structure defined
- All tenant-specific Django apps created
- Base models for all business entities
- Model relationships established
- TENANT_APPS list finalized
- Schema template ready for migration

### Tenant Schema Structure
```
tenant_xxx/
├── products            # Product catalog
├── categories          # Product categories
├── inventory           # Stock management
├── stock_locations     # Warehouse/store locations
├── customers           # Customer database
├── suppliers           # Supplier management
├── orders              # Order management
├── order_items         # Order line items
├── invoices            # Billing documents
├── payments            # Payment records
├── employees           # Staff management
├── accounting          # Financial records
├── settings            # Tenant-specific settings
└── audit_log           # Tenant activity log
```

### Dependencies
- **Requires:** SubPhase-04 (Tenant Model & Domain Model)
- **Tenant and Domain models must be complete**

---

## Task Execution Order

```
TASK GROUP A: Tenant Apps Structure (Tasks 01-14)
        │
        ▼
TASK GROUP B: Product & Category Models (Tasks 15-30)
        │
        ▼
TASK GROUP C: Inventory & Stock Models (Tasks 31-44)
        │
        ▼
TASK GROUP D: Customer & Supplier Models (Tasks 45-56)
        │
        ▼
TASK GROUP E: Order & Invoice Models (Tasks 57-72)
        │
        ▼
TASK GROUP F: Employee & Accounting Models (Tasks 73-84)
        │
        ▼
TASK GROUP G: Configuration & Verification (Tasks 85-94)
```

---

## Task Index

### Group A: Tenant Apps Structure (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create products App** | apps/products Django app | SubPhase-04 | 🔴 Not Created |
| 02 | **Create inventory App** | apps/inventory Django app | Task 01 | 🔴 Not Created |
| 03 | **Create customers App** | apps/customers Django app | Task 01 | 🔴 Not Created |
| 04 | **Create suppliers App** | apps/suppliers Django app | Task 01 | 🔴 Not Created |
| 05 | **Create orders App** | apps/orders Django app | Task 01 | 🔴 Not Created |
| 06 | **Create invoices App** | apps/invoices Django app | Task 01 | 🔴 Not Created |
| 07 | **Create employees App** | apps/employees Django app | Task 01 | 🔴 Not Created |
| 08 | **Create accounting App** | apps/accounting Django app | Task 01 | 🔴 Not Created |
| 09 | **Create pos App** | apps/pos Django app (Point of Sale) | Task 01 | 🔴 Not Created |
| 10 | **Create App Config Classes** | AppConfig for each app | Task 09 | 🔴 Not Created |
| 11 | **Register in TENANT_APPS** | Add all apps to TENANT_APPS | Task 10 | 🔴 Not Created |
| 12 | **Create Base Model Mixins** | Shared model mixins for tenant apps | Task 01 | 🔴 Not Created |
| 13 | **Create UUID Mixin** | UUID primary key for tenant models | Task 12 | 🔴 Not Created |
| 14 | **Create Audit Mixin** | Created/updated tracking | Task 12 | 🔴 Not Created |

---

### Group B: Product & Category Models (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Category Model** | Product category model | Task 11 | 🔴 Not Created |
| 16 | **Add Category Parent Field** | Self-referential FK for hierarchy | Task 15 | 🔴 Not Created |
| 17 | **Add Category Name Field** | Category name | Task 15 | 🔴 Not Created |
| 18 | **Add Category Slug Field** | URL-safe identifier | Task 15 | 🔴 Not Created |
| 19 | **Add Category Image Field** | Category image | Task 15 | 🔴 Not Created |
| 20 | **Add Category Active Field** | Is category active | Task 15 | 🔴 Not Created |
| 21 | **Create Product Model** | Product catalog model | Task 20 | 🔴 Not Created |
| 22 | **Add Product Name Field** | Product name | Task 21 | 🔴 Not Created |
| 23 | **Add Product SKU Field** | Stock keeping unit | Task 21 | 🔴 Not Created |
| 24 | **Add Product Barcode Field** | Barcode/UPC | Task 21 | 🔴 Not Created |
| 25 | **Add Product Category FK** | Link to category | Task 21 | 🔴 Not Created |
| 26 | **Add Product Pricing Fields** | Cost, selling price, MRP | Task 21 | 🔴 Not Created |
| 27 | **Add Product Tax Fields** | Tax category, rate | Task 21 | 🔴 Not Created |
| 28 | **Add Product Status Field** | Active, inactive, draft | Task 21 | 🔴 Not Created |
| 29 | **Create ProductImage Model** | Multiple images per product | Task 28 | 🔴 Not Created |
| 30 | **Create ProductVariant Model** | Product variants (size, color) | Task 28 | 🔴 Not Created |

---

### Group C: Inventory & Stock Models (Tasks 31-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create StockLocation Model** | Warehouse/store location | Task 11 | 🔴 Not Created |
| 32 | **Add Location Name Field** | Location name | Task 31 | 🔴 Not Created |
| 33 | **Add Location Type Field** | Warehouse, store, etc. | Task 31 | 🔴 Not Created |
| 34 | **Add Location Address Fields** | Location address | Task 31 | 🔴 Not Created |
| 35 | **Add Location Active Field** | Is location active | Task 31 | 🔴 Not Created |
| 36 | **Create Stock Model** | Stock levels per product/location | Task 35 | 🔴 Not Created |
| 37 | **Add Stock Product FK** | Link to product | Task 36 | 🔴 Not Created |
| 38 | **Add Stock Location FK** | Link to location | Task 36 | 🔴 Not Created |
| 39 | **Add Stock Quantity Field** | Current quantity | Task 36 | 🔴 Not Created |
| 40 | **Add Stock Reorder Level** | Reorder alert threshold | Task 36 | 🔴 Not Created |
| 41 | **Create StockMovement Model** | Stock transfer records | Task 40 | 🔴 Not Created |
| 42 | **Add Movement Type Field** | In, out, transfer, adjustment | Task 41 | 🔴 Not Created |
| 43 | **Add Movement Quantity Field** | Quantity moved | Task 41 | 🔴 Not Created |
| 44 | **Add Movement Reference Field** | Order/invoice reference | Task 41 | 🔴 Not Created |

---

### Group D: Customer & Supplier Models (Tasks 45-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Create Customer Model** | Customer database model | Task 11 | 🔴 Not Created |
| 46 | **Add Customer Name Fields** | First name, last name, business name | Task 45 | 🔴 Not Created |
| 47 | **Add Customer Contact Fields** | Phone, email, mobile | Task 45 | 🔴 Not Created |
| 48 | **Add Customer Address Fields** | Billing and shipping address | Task 45 | 🔴 Not Created |
| 49 | **Add Customer Type Field** | Individual, business, wholesale | Task 45 | 🔴 Not Created |
| 50 | **Add Customer Credit Limit** | Maximum credit allowed | Task 45 | 🔴 Not Created |
| 51 | **Create Supplier Model** | Supplier management model | Task 45 | 🔴 Not Created |
| 52 | **Add Supplier Name Field** | Company/supplier name | Task 51 | 🔴 Not Created |
| 53 | **Add Supplier Contact Fields** | Contact person, phone, email | Task 51 | 🔴 Not Created |
| 54 | **Add Supplier Address Fields** | Supplier address | Task 51 | 🔴 Not Created |
| 55 | **Add Supplier Tax ID Field** | VAT/Tax registration | Task 51 | 🔴 Not Created |
| 56 | **Add Supplier Payment Terms** | Net 30, Net 60, etc. | Task 51 | 🔴 Not Created |

---

### Group E: Order & Invoice Models (Tasks 57-72)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Create Order Model** | Sales order model | Task 50 | 🔴 Not Created |
| 58 | **Add Order Number Field** | Unique order number | Task 57 | 🔴 Not Created |
| 59 | **Add Order Customer FK** | Link to customer | Task 57 | 🔴 Not Created |
| 60 | **Add Order Status Field** | Pending, confirmed, shipped, etc. | Task 57 | 🔴 Not Created |
| 61 | **Add Order Date Field** | Order date timestamp | Task 57 | 🔴 Not Created |
| 62 | **Add Order Total Fields** | Subtotal, tax, discount, total | Task 57 | 🔴 Not Created |
| 63 | **Create OrderItem Model** | Order line items | Task 62 | 🔴 Not Created |
| 64 | **Add OrderItem Product FK** | Link to product | Task 63 | 🔴 Not Created |
| 65 | **Add OrderItem Quantity Field** | Quantity ordered | Task 63 | 🔴 Not Created |
| 66 | **Add OrderItem Price Fields** | Unit price, line total | Task 63 | 🔴 Not Created |
| 67 | **Create Invoice Model** | Billing document model | Task 66 | 🔴 Not Created |
| 68 | **Add Invoice Number Field** | Unique invoice number | Task 67 | 🔴 Not Created |
| 69 | **Add Invoice Order FK** | Link to order | Task 67 | 🔴 Not Created |
| 70 | **Add Invoice Status Field** | Draft, sent, paid, overdue | Task 67 | 🔴 Not Created |
| 71 | **Create Payment Model** | Payment records | Task 70 | 🔴 Not Created |
| 72 | **Add Payment Method Field** | Cash, card, bank transfer | Task 71 | 🔴 Not Created |

---

### Group F: Employee & Accounting Models (Tasks 73-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 73 | **Create Employee Model** | Staff management model | Task 11 | 🔴 Not Created |
| 74 | **Add Employee User FK** | Link to auth user | Task 73 | 🔴 Not Created |
| 75 | **Add Employee Role Field** | Role in organization | Task 73 | 🔴 Not Created |
| 76 | **Add Employee Contact Fields** | Phone, emergency contact | Task 73 | 🔴 Not Created |
| 77 | **Add Employee Status Field** | Active, on leave, terminated | Task 73 | 🔴 Not Created |
| 78 | **Create Account Model** | Chart of accounts | Task 11 | 🔴 Not Created |
| 79 | **Add Account Code Field** | Account code (e.g., 1000) | Task 78 | 🔴 Not Created |
| 80 | **Add Account Type Field** | Asset, liability, equity, etc. | Task 78 | 🔴 Not Created |
| 81 | **Create JournalEntry Model** | Accounting journal entries | Task 80 | 🔴 Not Created |
| 82 | **Add Entry Debit/Credit Fields** | Debit and credit amounts | Task 81 | 🔴 Not Created |
| 83 | **Create TenantAuditLog Model** | Tenant activity log | Task 11 | 🔴 Not Created |
| 84 | **Add Audit Log Fields** | Action, actor, timestamp, details | Task 83 | 🔴 Not Created |

---

### Group G: Configuration & Verification (Tasks 85-94)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 85 | **Verify TENANT_APPS List** | All apps registered correctly | Task 84 | 🔴 Not Created |
| 86 | **Create Model Signals** | Auto-create related records | Task 85 | 🔴 Not Created |
| 87 | **Create Model Managers** | Custom querysets for each model | Task 85 | 🔴 Not Created |
| 88 | **Document Model Relationships** | ERD documentation | Task 87 | 🔴 Not Created |
| 89 | **Create Migrations** | makemigrations for all apps | Task 87 | 🔴 Not Created |
| 90 | **Review Migration Files** | Verify generated SQL | Task 89 | 🔴 Not Created |
| 91 | **Test Schema Creation** | Create test tenant schema | Task 90 | 🔴 Not Created |
| 92 | **Verify Table Isolation** | Confirm tables in tenant schema | Task 91 | 🔴 Not Created |
| 93 | **Create Schema Docs** | Document tenant schema | Task 92 | 🔴 Not Created |
| 94 | **Create Initial Commit** | Commit all tenant apps | Task 93 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
├── apps/
│   ├── products/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   └── migrations/
│   ├── inventory/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   └── migrations/
│   ├── customers/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   └── migrations/
│   ├── suppliers/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   └── migrations/
│   ├── orders/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   └── migrations/
│   ├── invoices/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   └── migrations/
│   ├── employees/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   └── migrations/
│   ├── accounting/
│   │   ├── __init__.py
│   │   ├── apps.py
│   │   ├── models.py
│   │   └── migrations/
│   └── pos/
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py
│       └── migrations/
└── docs/
    └── schema-template/
        ├── overview.md
        ├── products-inventory.md
        ├── orders-invoices.md
        └── erd-diagram.png
```

---

## Model Relationships Summary

```
Category (self-referential) ──► Product ◄── ProductVariant
                                    │
                                    ▼
Stock ◄── StockLocation         StockMovement
   │
   ▼
Customer ──► Order ──► OrderItem ──► Product
                │
                ▼
            Invoice ──► Payment

Supplier ──► PurchaseOrder (future)

Employee ──► User (auth)

Account ──► JournalEntry
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 94 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 94 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **TENANT_APPS Only:** All models here go in tenant schemas
3. **Isolation Guaranteed:** Each tenant has own schema/tables
4. **UUID Keys:** Use UUIDs for primary keys
5. **Soft Deletes:** Implement soft delete for most models
6. **Audit Trail:** Track created_by, updated_by fields
7. **Sri Lankan Context:** LKR currency, local tax rates
8. **Hierarchy Support:** Categories support parent-child
9. **Stock Tracking:** Every stock change logged in StockMovement
