# Tasks 24-28: VendorBankAccount Model

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** B - Contacts & Bank Details  
> **Document:** 02 of 03  
> **Tasks Covered:** 24, 25, 26, 27, 28

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-19-23_Contact-Model.md](01_Tasks-19-23_Contact-Model.md)
- **→ Next Document:** [03_Tasks-29-34_Address-Service.md](03_Tasks-29-34_Address-Service.md)

---

## Document Overview

This document creates the VendorBankAccount model to store vendor banking details for payment processing, supporting multiple bank accounts and currencies.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 24 | Create VendorBankAccount Model | Medium | 25 min |
| 25 | Add Bank Core Fields | Medium | 20 min |
| 26 | Add Bank Routing Fields | Medium | 20 min |
| 27 | Add Bank Currency Field | Low | 15 min |
| 28 | Run Bank Account Migrations | Low | 15 min |

---

## Task 24: Create VendorBankAccount Model

### Overview
Create the VendorBankAccount model to manage vendor bank account details for payment processing. Vendors can have multiple bank accounts for different currencies or purposes.

### Dependencies
- Task 23: Run Contact Migrations

### Instructions

1. **Create vendor_bank.py file**
   - Create at `apps/vendors/models/vendor_bank.py`
   - Add module docstring

2. **Import required modules**
   - Import Django model fields
   - Import BaseModel or TenantAwareModel
   - Import UUID
   - Import Vendor model

3. **Define VendorBankAccount model class**
   - Inherit from appropriate base
   - Add class docstring
   - Add Meta class

4. **Add id field**
   - Type: UUIDField
   - Primary key: True
   - Default: uuid.uuid4
   - Editable: False

5. **Add vendor field**
   - Type: ForeignKey to Vendor
   - On_delete: CASCADE
   - Related_name: 'bank_accounts'
   - Purpose: Link to vendor

6. **Configure Meta class**
   - Table name: vendors_vendor_bank_account
   - Ordering: ['-is_default', 'bank_name']
   - Verbose names

7. **Add __str__ method**
   - Return: "{bank_name} - {account_number} ({vendor})"

8. **Update models __init__.py**
   - Import VendorBankAccount
   - Add to __all__ list

### Model Structure

#### Relationships
```
Vendor (1) ──────── (Many) VendorBankAccount

Multiple accounts for:
- Different currencies (LKR, USD)
- Different banks
- Different purposes
```

### Expected Outcome
- VendorBankAccount model structure
- Vendor relationship established
- Foundation for bank details

### Verification Checklist
- [ ] vendor_bank.py created
- [ ] VendorBankAccount model defined
- [ ] Vendor relationship added
- [ ] Meta class configured
- [ ] Model imported

---

## Task 25: Add Bank Core Fields

### Overview
Add essential bank account fields including bank name, branch, account holder, and account number.

### Dependencies
- Task 24: Create VendorBankAccount Model

### Instructions

1. **Add bank_name field**
   - Type: CharField
   - Max length: 200
   - Required: Cannot be blank
   - Purpose: Name of bank

2. **Add branch_name field**
   - Type: CharField
   - Max length: 200
   - Optional: Can be blank
   - Purpose: Bank branch name/location

3. **Add account_name field**
   - Type: CharField
   - Max length: 200
   - Required: Cannot be blank
   - Purpose: Account holder name
   - Should match vendor company name

4. **Add account_number field**
   - Type: CharField
   - Max length: 50
   - Required: Cannot be blank
   - Purpose: Bank account number
   - Encrypted storage recommended

### Bank Core Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| bank_name | CharField(200) | Yes | Bank name |
| branch_name | CharField(200) | No | Branch location |
| account_name | CharField(200) | Yes | Account holder |
| account_number | CharField(50) | Yes | Account number |

### Sri Lanka Major Banks
- Bank of Ceylon (BOC)
- People's Bank
- Commercial Bank of Ceylon
- Hatton National Bank (HNB)
- Sampath Bank
- National Savings Bank (NSB)
- Seylan Bank
- DFCC Bank

### Account Number Formats

#### Sri Lankan Banks
```
12-15 digits, varies by bank
Example: 1234567890123
```

### Expected Outcome
- Core bank details captured
- Account identification complete

### Verification Checklist
- [ ] All core fields added
- [ ] Required fields enforced
- [ ] Proper field lengths

---

## Task 26: Add Bank Routing Fields

### Overview
Add routing and identification fields including SWIFT code, branch code, and default account designation.

### Dependencies
- Task 25: Add Bank Core Fields

### Instructions

1. **Add swift_code field**
   - Type: CharField
   - Max length: 11
   - Optional: Can be blank
   - Purpose: SWIFT/BIC code for international
   - Format: 8 or 11 characters

2. **Add branch_code field**
   - Type: CharField
   - Max length: 20
   - Optional: Can be blank
   - Purpose: Bank branch code
   - Used in Sri Lanka

3. **Add iban field**
   - Type: CharField
   - Max length: 34
   - Optional: Can be blank
   - Purpose: IBAN for international accounts

4. **Add is_default field**
   - Type: BooleanField
   - Default: False
   - Purpose: Mark as default account
   - Only one default per vendor

5. **Add is_active field**
   - Type: BooleanField
   - Default: True
   - Purpose: Account still valid

6. **Add verification_status field**
   - Type: CharField
   - Max length: 20
   - Choices: PENDING, VERIFIED, FAILED
   - Default: PENDING
   - Purpose: Track verification

### Routing Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| swift_code | CharField(11) | No | SWIFT/BIC code |
| branch_code | CharField(20) | No | Branch code |
| iban | CharField(34) | No | IBAN |
| is_default | BooleanField | Yes | Default account |
| is_active | BooleanField | Yes | Active status |
| verification_status | CharField(20) | Yes | Verification |

### Sri Lanka Bank SWIFT Codes

| Bank | SWIFT Code |
|------|------------|
| Bank of Ceylon | BABORLKXXX |
| People's Bank | PABORLKXXX |
| Commercial Bank | CABORLKXXX |
| Hatton National | HNTBLKLXXX |
| Sampath Bank | SAMPBCLXXX |

### Expected Outcome
- International transfer support
- Default account management
- Verification tracking

### Verification Checklist
- [ ] SWIFT and branch code added
- [ ] Default designation added
- [ ] Verification status added

---

## Task 27: Add Bank Currency Field

### Overview
Add currency field to support multi-currency bank accounts, essential for international vendors.

### Dependencies
- Task 26: Add Bank Routing Fields

### Instructions

1. **Add currency field**
   - Type: CharField
   - Max length: 3
   - Default: "LKR"
   - Purpose: Account currency
   - Format: ISO 4217 codes

2. **Add notes field**
   - Type: TextField
   - Optional: Can be blank
   - Purpose: Additional notes

3. **Add created_at and updated_at**
   - Type: DateTimeField
   - Auto timestamps

4. **Add created_by field**
   - Type: ForeignKey to User
   - On_delete: SET_NULL
   - Null: True

### Currency Support

| Code | Currency | Use Case |
|------|----------|----------|
| LKR | Sri Lankan Rupee | Local payments |
| USD | US Dollar | Imports |
| EUR | Euro | European imports |
| GBP | British Pound | UK imports |
| INR | Indian Rupee | India imports |

### Expected Outcome
- Multi-currency support
- Audit trail

### Verification Checklist
- [ ] Currency field added
- [ ] Notes field added
- [ ] Timestamps added

---

## Task 28: Run Bank Account Migrations

### Overview
Generate and apply migrations for VendorBankAccount model.

### Dependencies
- Task 27: Add Bank Currency Field

### Instructions

1. **Generate migration**
   - Run makemigrations
   - Review migration file

2. **Apply migration**
   - Run migrate command
   - Verify table creation

3. **Test bank account operations**
   - Create test bank account
   - Link to vendor
   - Test default account logic

### Expected Outcome
- Bank account table created
- All fields operational

### Verification Checklist
- [ ] Migration generated
- [ ] Migration applied
- [ ] Table created
- [ ] Test account created

---

## Notes for AI Agents

### Default Account Logic
Only one is_default=True per vendor. When setting new default, unset previous default automatically.

### Security Considerations
- Encrypt account_number in database
- Restrict access to bank details
- Log all bank account access
- Mask account numbers in UI

### Verification Process
- Verify account with small deposit
- Confirm account holder name matches
- Validate SWIFT code format
- Check bank/branch existence
