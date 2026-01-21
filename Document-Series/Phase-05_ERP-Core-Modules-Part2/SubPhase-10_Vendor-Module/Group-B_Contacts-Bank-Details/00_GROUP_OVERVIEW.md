# Group B: Contacts & Bank Details

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** B of F  
> **Tasks Covered:** 19-34  
> **Group Goal:** Implement vendor contacts, bank accounts, addresses, and basic service

---

## Navigation

- **↑ Parent:** [SubPhase-10 Summary](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group A: Vendor Model & Profile](../Group-A_Vendor-Model-Profile/)
- **→ Next Group:** [Group C: Vendor Product Catalog](../Group-C_Vendor-Product-Catalog/)

---

## Group Overview

### Key Outcomes

1. **VendorContact Model** - Multiple contacts per vendor
2. **ContactRole Choices** - SALES, ACCOUNTS, LOGISTICS, MANAGER, SUPPORT, OTHER
3. **Contact Core Fields** - first_name, last_name, email, phone, mobile
4. **Contact Role Fields** - role, is_primary, department, job_title
5. **Contact Migrations** - Apply migrations
6. **VendorBankAccount Model** - Bank details for payments
7. **Bank Core Fields** - bank_name, branch_name, account_name, account_number
8. **Bank Routing Fields** - swift_code, branch_code, is_default
9. **Bank Currency Field** - Multi-currency support
10. **Bank Account Migrations** - Apply migrations
11. **VendorAddress Model** - Multiple addresses
12. **AddressType Choices** - MAIN, WAREHOUSE, BILLING, SHIPPING
13. **Vendor Address Fields** - Address fields with type
14. **Address Migrations** - Apply migrations
15. **VendorService Class** - Main service for vendor operations
16. **Vendor CRUD** - Create, update, deactivate vendors

### Technology Context

| Technology | Purpose |
|------------|---------|
| Django ORM | Contact, bank, address models |
| Validators | Bank account validation |
| Service Layer | Business logic encapsulation |
| Foreign Keys | Vendor relationships |

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | `01_Tasks-19-23_Contact-Model.md` | 19-23 | VendorContact model, roles, fields, migrations |
| 02 | `02_Tasks-24-28_Bank-Account-Model.md` | 24-28 | VendorBankAccount model, fields, currency, migrations |
| 03 | `03_Tasks-29-34_Address-Service.md` | 29-34 | VendorAddress model, types, VendorService, CRUD |

---

## Task Summary

| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 19 | Create VendorContact Model | Medium | 25 min |
| 20 | Define ContactRole Choices | Low | 15 min |
| 21 | Add Contact Core Fields | Medium | 20 min |
| 22 | Add Contact Role Fields | Medium | 20 min |
| 23 | Run Contact Migrations | Low | 15 min |
| 24 | Create VendorBankAccount Model | Medium | 25 min |
| 25 | Add Bank Core Fields | Medium | 20 min |
| 26 | Add Bank Routing Fields | Medium | 20 min |
| 27 | Add Bank Currency Field | Low | 15 min |
| 28 | Run Bank Account Migrations | Low | 15 min |
| 29 | Create VendorAddress Model | Medium | 25 min |
| 30 | Define AddressType Choices | Low | 15 min |
| 31 | Add Vendor Address Fields | Medium | 20 min |
| 32 | Run Address Migrations | Low | 15 min |
| 33 | Create VendorService Class | High | 30 min |
| 34 | Implement Vendor CRUD | Medium | 25 min |

---

## Execution Order

```
[Tasks 19-23: VendorContact model]
         │
         ▼
[Tasks 24-28: VendorBankAccount model]
         │
         ▼
[Tasks 29-34: VendorAddress and VendorService]
```

---

## Expected Deliverables

```
apps/vendors/
├── models/
│   ├── __init__.py
│   ├── vendor.py
│   ├── vendor_contact.py         # Tasks 19-22
│   ├── vendor_bank.py            # Tasks 24-27
│   └── vendor_address.py         # Tasks 29-31
├── services/
│   ├── __init__.py
│   └── vendor_service.py         # Tasks 33-34
└── migrations/
    ├── 0002_contact.py           # Task 23
    ├── 0003_bank.py              # Task 28
    └── 0004_address.py           # Task 32
```

---

## Notes for AI Agents

### ContactRole Choices
- **SALES**: Sales representative
- **ACCOUNTS**: Accounts/finance contact
- **LOGISTICS**: Shipping/logistics contact
- **MANAGER**: General manager
- **SUPPORT**: Technical support
- **OTHER**: Other role

### VendorContact Fields
- vendor: FK to Vendor
- first_name: CharField
- last_name: CharField
- email: EmailField
- phone: CharField
- mobile: CharField
- role: Choice field
- department: CharField
- job_title: CharField
- is_primary: Boolean

### Contact Rules
- Each vendor must have at least one contact
- Only one contact can be marked is_primary per vendor
- Email or phone required

### VendorBankAccount Fields
- vendor: FK to Vendor
- bank_name: CharField
- branch_name: CharField
- account_name: CharField
- account_number: CharField
- swift_code: CharField
- branch_code: CharField
- currency: CharField (default LKR)
- is_default: Boolean

### Sri Lanka Banks
| Bank | Swift Code |
|------|------------|
| Bank of Ceylon | BABORLKXXX |
| People's Bank | PABORLKXXX |
| Commercial Bank | CABORLKXXX |
| Hatton National | HNTBLKLXXX |
| Sampath Bank | SAMPBCLXXX |

### AddressType Choices
- **MAIN**: Main office address
- **WAREHOUSE**: Warehouse/storage
- **BILLING**: Billing address
- **SHIPPING**: Shipping origin

### VendorAddress Fields
- vendor: FK to Vendor
- address_type: Choice field
- address_line_1: CharField
- address_line_2: CharField (optional)
- city: CharField
- district: CharField
- province: CharField
- postal_code: CharField
- country: CharField (default "Sri Lanka")
- is_default: Boolean

### VendorService Methods
- create_vendor(data, contacts, addresses, banks)
- update_vendor(vendor_id, data)
- deactivate_vendor(vendor_id)
- reactivate_vendor(vendor_id)
- block_vendor(vendor_id, reason)
- get_vendor_with_details(vendor_id)
