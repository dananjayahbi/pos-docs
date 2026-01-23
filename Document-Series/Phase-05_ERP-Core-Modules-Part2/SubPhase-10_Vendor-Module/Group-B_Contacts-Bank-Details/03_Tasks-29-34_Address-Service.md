# Tasks 29-34: VendorAddress Model and VendorService

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** B - Contacts & Bank Details  
> **Document:** 03 of 03  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-24-28_Bank-Account-Model.md](02_Tasks-24-28_Bank-Account-Model.md)

---

## Document Overview

This document creates the VendorAddress model for multiple addresses per vendor and implements the VendorService class for vendor CRUD operations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 29 | Create VendorAddress Model | Medium | 25 min |
| 30 | Define AddressType Choices | Low | 15 min |
| 31 | Add Vendor Address Fields | Medium | 20 min |
| 32 | Run Address Migrations | Low | 15 min |
| 33 | Create VendorService Class | High | 30 min |
| 34 | Implement Vendor CRUD | Medium | 25 min |

---

## Task 29: Create VendorAddress Model

### Overview
Create VendorAddress model to store multiple addresses per vendor (main office, warehouses, billing, shipping).

### Dependencies
- Task 28: Run Bank Account Migrations

### Instructions

1. **Create vendor_address.py file**
   - Create at `apps/vendors/models/vendor_address.py`
   - Add module docstring

2. **Define VendorAddress model**
   - Inherit from BaseModel
   - Add UUIDField as primary key
   - Add ForeignKey to Vendor (CASCADE, related_name='addresses')

3. **Configure Meta class**
   - Table name: vendors_vendor_address
   - Ordering: ['-is_default', 'address_type']

4. **Update models __init__.py**
   - Import VendorAddress

### Expected Outcome
- VendorAddress model structure
- Vendor relationship

### Verification Checklist
- [ ] vendor_address.py created
- [ ] Model defined with vendor FK
- [ ] Meta class configured

---

## Task 30: Define AddressType Choices

### Overview
Define address type choices: MAIN, WAREHOUSE, BILLING, SHIPPING.

### Dependencies
- Task 29: Create VendorAddress Model

### Instructions

1. **Open constants.py**
   - Add address type constants

2. **Define constants**
   - ADDRESS_TYPE_MAIN: Main office
   - ADDRESS_TYPE_WAREHOUSE: Warehouse/storage
   - ADDRESS_TYPE_BILLING: Billing address
   - ADDRESS_TYPE_SHIPPING: Shipping origin

3. **Create ADDRESS_TYPE_CHOICES tuple**

### Address Type Details

| Type | Value | Purpose |
|------|-------|---------|
| MAIN | 'MAIN' | Main office address |
| WAREHOUSE | 'WAREHOUSE' | Warehouse location |
| BILLING | 'BILLING' | Billing address |
| SHIPPING | 'SHIPPING' | Shipping origin |

### Expected Outcome
- Address type categorization

### Verification Checklist
- [ ] All address type constants defined
- [ ] Choices tuple created

---

## Task 31: Add Vendor Address Fields

### Overview
Add address fields including type, address lines, city, district, province, postal code, and default designation.

### Dependencies
- Task 30: Define AddressType Choices

### Instructions

1. **Add address_type field**
   - CharField with ADDRESS_TYPE_CHOICES
   - Default: ADDRESS_TYPE_MAIN

2. **Add address fields**
   - address_line_1: CharField(255)
   - address_line_2: CharField(255), optional
   - city: CharField(100)
   - district: CharField(100)
   - province: CharField(100)
   - postal_code: CharField(20)
   - country: CharField(100), default "Sri Lanka"

3. **Add designation fields**
   - is_default: BooleanField, default False
   - is_active: BooleanField, default True

4. **Add notes and timestamps**
   - notes: TextField, optional
   - created_at, updated_at: DateTimeField

### Address Fields Summary

| Field | Type | Required |
|-------|------|----------|
| address_type | CharField | Yes |
| address_line_1 | CharField(255) | Yes |
| address_line_2 | CharField(255) | No |
| city | CharField(100) | Yes |
| district | CharField(100) | Yes |
| province | CharField(100) | Yes |
| postal_code | CharField(20) | No |
| country | CharField(100) | Yes |
| is_default | BooleanField | Yes |
| is_active | BooleanField | Yes |

### Expected Outcome
- Complete address storage
- Type categorization
- Default address support

### Verification Checklist
- [ ] Address type field added
- [ ] All address fields added
- [ ] Default designation added

---

## Task 32: Run Address Migrations

### Overview
Generate and apply migrations for VendorAddress model.

### Dependencies
- Task 31: Add Vendor Address Fields

### Instructions

1. **Generate migration**
   - Run makemigrations vendors

2. **Apply migration**
   - Run migrate vendors

3. **Test address operations**
   - Create test address
   - Link to vendor
   - Test default address logic

### Expected Outcome
- Address table created
- All fields operational

### Verification Checklist
- [ ] Migration generated and applied
- [ ] Table created
- [ ] Test address created

---

## Task 33: Create VendorService Class

### Overview
Create VendorService class to encapsulate vendor business logic and CRUD operations.

### Dependencies
- Task 32: Run Address Migrations

### Instructions

1. **Create vendor_service.py file**
   - Create at `apps/vendors/services/vendor_service.py`
   - Add module docstring

2. **Import required modules**
   - Import Vendor, VendorContact, VendorBankAccount, VendorAddress
   - Import Django transaction support
   - Import exceptions

3. **Define VendorService class**
   - Add class docstring
   - Static methods or class methods

4. **Add service structure**
   - Methods for CRUD operations
   - Transaction management
   - Validation logic
   - Error handling

### Service Methods

#### Core Methods
- create_vendor(data, contacts, addresses, banks)
- update_vendor(vendor_id, data)
- delete_vendor(vendor_id)
- get_vendor(vendor_id)
- list_vendors(filters)

#### Status Methods
- activate_vendor(vendor_id)
- deactivate_vendor(vendor_id)
- block_vendor(vendor_id, reason)
- approve_vendor(vendor_id, approver)

#### Related Data Methods
- add_contact(vendor_id, contact_data)
- add_bank_account(vendor_id, bank_data)
- add_address(vendor_id, address_data)

### Expected Outcome
- Service layer for vendors
- Business logic encapsulation
- Transaction safety

### Verification Checklist
- [ ] vendor_service.py created
- [ ] VendorService class defined
- [ ] Core methods structured

---

## Task 34: Implement Vendor CRUD

### Overview
Implement create, update, and deactivate methods in VendorService with proper transaction handling.

### Dependencies
- Task 33: Create VendorService Class

### Instructions

1. **Implement create_vendor method**
   - Accept vendor data dictionary
   - Accept optional contacts list
   - Accept optional addresses list
   - Accept optional bank accounts list
   - Use transaction.atomic()
   - Create vendor record
   - Create related records
   - Generate vendor code automatically
   - Return created vendor

2. **Implement update_vendor method**
   - Accept vendor_id and update data
   - Load vendor instance
   - Update fields
   - Handle related records updates
   - Use transaction.atomic()
   - Return updated vendor

3. **Implement deactivate_vendor method**
   - Accept vendor_id
   - Set status to INACTIVE
   - Optional: Set inactive_date
   - Check if has pending orders
   - Return deactivated vendor

4. **Add validation logic**
   - Validate required fields
   - Validate email format
   - Validate phone format
   - Check duplicates (tax_id, company_name)
   - Raise clear exceptions

5. **Add error handling**
   - Handle Vendor.DoesNotExist
   - Handle integrity errors
   - Handle validation errors
   - Return meaningful error messages

### Create Vendor Flow
```
1. Validate input data
2. Start transaction
3. Create Vendor record
4. Generate vendor_code
5. Create contacts (if provided)
6. Create addresses (if provided)
7. Create bank accounts (if provided)
8. Commit transaction
9. Return vendor
```

### Update Vendor Flow
```
1. Load vendor by ID
2. Validate update data
3. Start transaction
4. Update vendor fields
5. Update related records if provided
6. Commit transaction
7. Return updated vendor
```

### Expected Outcome
- Complete CRUD operations
- Transaction safety
- Proper validation
- Error handling

### Verification Checklist
- [ ] create_vendor implemented
- [ ] update_vendor implemented
- [ ] deactivate_vendor implemented
- [ ] Validation logic added
- [ ] Error handling added
- [ ] Transaction management used

---

## Notes for AI Agents

### Service Layer Benefits
- Centralizes business logic
- Ensures transaction consistency
- Reusable across views/tasks
- Easier testing
- Audit trail support

### Transaction Management
Use transaction.atomic() for operations involving multiple models to ensure all-or-nothing commits.

### Validation Strategy
- Field-level: Model field validators
- Object-level: Model clean() method
- Business-level: Service layer validation
- API-level: Serializer validation

### Default Address Logic
Only one is_default=True per address_type per vendor. When setting new default of same type, unset previous default.

### Related Data Creation
When creating vendor with contacts/addresses/banks:
- Create vendor first (get vendor.id)
- Then create related records with vendor FK
- All within same transaction
- Rollback all if any fails
