# Tasks 01-07: BankAccount Model and Core Fields

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** A - Bank Account Configuration  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Config-Verify.md](02_Tasks-08-14_Config-Verify.md)

---

## Document Overview

This document covers the creation of the BankAccount model and its core fields. It establishes the foundational data structure for storing tenant-specific bank account information that will be displayed to customers during bank transfer payments. This includes bank name, account number, account holder name, branch details, SWIFT code, and active status toggle.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create BankAccount Model | Medium | 30 min |
| 02 | Create Bank Name Field | Low | 15 min |
| 03 | Create Account Number Field | Low | 15 min |
| 04 | Create Account Name Field | Low | 15 min |
| 05 | Create Branch Field | Low | 10 min |
| 06 | Create Swift Code Field | Low | 10 min |
| 07 | Create Is Active Field | Low | 10 min |

---

## Task 01: Create BankAccount Model

### Overview
Create the BankAccount model in the payments app to store tenant-specific bank account information. This model will hold all bank account details that customers need for making bank transfer payments. Each tenant can configure multiple bank accounts, allowing them to accept payments at different banks or maintain multiple accounts for different purposes.

### Dependencies
- SubPhase-01 (Multi-tenancy setup) must be complete
- Phase-02 (Database Architecture & Multi-Tenancy) must be complete
- Backend payments app must exist

### Instructions

1. **Navigate to payments app models directory**
   - Go to `backend/apps/payments/models/` directory
   - This directory contains all payment-related models
   - Ensure the directory has an `__init__.py` file

2. **Create bank_account.py file**
   - Create new file named `bank_account.py`
   - This will contain the BankAccount model
   - Follow project model naming conventions

3. **Import required dependencies**
   - Import Django models (from django.db import models)
   - Import timezone utilities (from django.utils import timezone)
   - Import validation utilities (from django.core.validators)
   - Import BaseModel from core.models (project base model with common fields)
   - Import Tenant model (from tenants app or django_tenants)

4. **Define BankAccount model class**
   - Create class `BankAccount` inheriting from BaseModel
   - BaseModel provides: id, created_at, updated_at, created_by, updated_by
   - Add model Meta class for database configuration

5. **Add tenant foreign key**
   - Create ForeignKey to Tenant model
   - Set on_delete to models.CASCADE (delete accounts when tenant deleted)
   - Set related_name to 'bank_accounts'
   - This links each account to a specific tenant

6. **Configure model Meta options**
   - Set db_table to 'payments_bank_accounts'
   - Set verbose_name to 'Bank Account'
   - Set verbose_name_plural to 'Bank Accounts'
   - Add ordering by ['display_order', '-created_at']
   - Add indexes for tenant and is_active fields

7. **Add model string representation**
   - Implement `__str__` method
   - Return format: "{bank_name} - {account_number}"
   - Ensure human-readable representation

8. **Update models __init__.py**
   - Add import for BankAccount model
   - Add to __all__ list for proper exports
   - Follow project import conventions

### Model Structure Overview

```
BankAccount
├── BaseModel Fields (inherited)
│   ├── id (UUID, primary key)
│   ├── created_at (DateTime)
│   ├── updated_at (DateTime)
│   ├── created_by (ForeignKey to User)
│   └── updated_by (ForeignKey to User)
├── tenant (ForeignKey to Tenant)
├── bank_name (CharField) - Task 02
├── account_number (CharField) - Task 03
├── account_name (CharField) - Task 04
├── branch (CharField) - Task 05
├── swift_code (CharField) - Task 06
├── is_active (BooleanField) - Task 07
└── display_order (IntegerField) - Task 08 (Next doc)
```

### Model Relationships

| Relationship | Target Model | Type | Purpose |
|--------------|--------------|------|---------|
| tenant | Tenant | ForeignKey | Multi-tenancy support |
| created_by | User | ForeignKey | Audit trail (from BaseModel) |
| updated_by | User | ForeignKey | Audit trail (from BaseModel) |
| payment_orders | PaymentOrder | Reverse FK | Payments using this account |

### Database Table Configuration

| Meta Option | Value | Purpose |
|-------------|-------|---------|
| db_table | payments_bank_accounts | Explicit table naming |
| verbose_name | Bank Account | Admin display (singular) |
| verbose_name_plural | Bank Accounts | Admin display (plural) |
| ordering | [display_order, -created_at] | Default sort order |

### Database Indexes

```
Index 1: tenant_id
└── Purpose: Fast lookup of accounts by tenant

Index 2: tenant_id + is_active
└── Purpose: Fast lookup of active accounts per tenant

Index 3: display_order
└── Purpose: Efficient ordering in queries
```

### Multi-Tenancy Considerations

| Aspect | Implementation |
|--------|----------------|
| Isolation | Each tenant has separate accounts |
| Queries | Always filter by tenant |
| Uniqueness | Account numbers unique per tenant |
| Deletion | Cascade when tenant deleted |

### Expected Outcome
- BankAccount model created in payments app
- Proper inheritance from BaseModel
- Tenant foreign key relationship established
- Database table configuration defined
- Ready to receive field definitions in subsequent tasks

### Verification Checklist
- [ ] `backend/apps/payments/models/bank_account.py` file created
- [ ] BankAccount class inherits from BaseModel
- [ ] Tenant ForeignKey added with CASCADE delete
- [ ] Model Meta class configured properly
- [ ] `__str__` method implemented
- [ ] Model imported in `__init__.py`
- [ ] No syntax errors in model definition

---

## Task 02: Create Bank Name Field

### Overview
Add the bank_name field to the BankAccount model with a predefined list of Sri Lankan banks as choices. This field allows tenants to select from common banks in Sri Lanka, ensuring consistency and proper display of bank names to customers during payment.

### Dependencies
- Task 01: Create BankAccount Model

### Instructions

1. **Define bank choices constant**
   - Create BANK_CHOICES tuple at module level (before model class)
   - Include major Sri Lankan banks as tuples (code, display_name)
   - Order alphabetically for easy selection
   - Keep codes uppercase for consistency

2. **Add bank_name field to model**
   - Create CharField with max_length of 50
   - Set choices parameter to BANK_CHOICES
   - Set verbose_name to 'Bank Name'
   - Set help_text to explain the field purpose
   - Make field required (null=False, blank=False)

3. **Add field validation**
   - Django automatically validates against choices
   - Ensure selected value is in BANK_CHOICES
   - Consider custom validator if additional rules needed

4. **Update model string representation (if needed)**
   - Ensure __str__ method uses bank_name correctly
   - Display human-readable bank name

### Sri Lankan Banks List

| Bank Code | Bank Name | Type |
|-----------|-----------|------|
| BOC | Bank of Ceylon | State |
| PEOPLES | People's Bank | State |
| COMBANK | Commercial Bank of Ceylon | Private |
| SAMPATH | Sampath Bank | Private |
| HNB | Hatton National Bank | Private |
| SEYLAN | Seylan Bank | Private |
| NTB | Nations Trust Bank | Private |
| DFCC | DFCC Bank | Private |
| NDB | National Development Bank | Private |
| PAN_ASIA | Pan Asia Bank | Private |
| UNION | Union Bank | Private |
| CARGILLS | Cargills Bank | Private |
| NSB | National Savings Bank | State |
| RDB | Regional Development Bank | State |

### Bank Choices Implementation

```
BANK_CHOICES = [
    ('BOC', 'Bank of Ceylon'),
    ('PEOPLES', 'People's Bank'),
    ('COMBANK', 'Commercial Bank of Ceylon'),
    ('SAMPATH', 'Sampath Bank'),
    ('HNB', 'Hatton National Bank'),
    ('SEYLAN', 'Seylan Bank'),
    ('NTB', 'Nations Trust Bank'),
    ('DFCC', 'DFCC Bank'),
    ('NDB', 'National Development Bank'),
    ('PAN_ASIA', 'Pan Asia Bank'),
    ('UNION', 'Union Bank'),
    ('CARGILLS', 'Cargills Bank'),
    ('NSB', 'National Savings Bank'),
    ('RDB', 'Regional Development Bank'),
]
```

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store bank code |
| max_length | 50 | Accommodate longest bank code |
| choices | BANK_CHOICES | Predefined bank list |
| null | False | Field is required |
| blank | False | Must be filled in forms |
| verbose_name | Bank Name | Display in admin |
| help_text | Select the bank | Guide users |

### Form Rendering

```
In Django Admin/Forms:
┌────────────────────────────┐
│ Bank Name: [Dropdown ▼]   │
│                            │
│ Options:                   │
│ - Bank of Ceylon           │
│ - People's Bank            │
│ - Commercial Bank of Ceylon│
│ - Sampath Bank             │
│ - Hatton National Bank     │
│ - ...                      │
└────────────────────────────┘
```

### Database Storage

| Aspect | Details |
|--------|---------|
| Stored Value | Bank code (e.g., 'BOC', 'SAMPATH') |
| Display Value | Bank name (e.g., 'Bank of Ceylon') |
| Database Type | VARCHAR(50) |
| Index | Consider adding for frequent queries |

### Expected Outcome
- bank_name field added to BankAccount model
- Dropdown with Sri Lankan banks available
- Validation ensures only valid banks selected
- Database stores bank codes efficiently

### Verification Checklist
- [ ] BANK_CHOICES constant defined with 14 banks
- [ ] bank_name CharField added to model
- [ ] Field has choices parameter set
- [ ] Field is required (null=False, blank=False)
- [ ] verbose_name and help_text configured
- [ ] No syntax errors in field definition

---

## Task 03: Create Account Number Field

### Overview
Add the account_number field to store the bank account number. This field must accommodate various account number formats used by different Sri Lankan banks while ensuring data validation and security. Account numbers are displayed to customers for making payments.

### Dependencies
- Task 01: Create BankAccount Model

### Instructions

1. **Add account_number field to model**
   - Create CharField with max_length of 20
   - Account numbers in Sri Lanka typically 10-18 digits
   - Set verbose_name to 'Account Number'
   - Set help_text to guide users on format

2. **Configure field properties**
   - Set null=False (field is required)
   - Set blank=False (must be filled in forms)
   - Consider unique_together with tenant in Meta

3. **Add field validators**
   - Import RegexValidator from django.core.validators
   - Create validator for account number format
   - Allow only digits and hyphens
   - Minimum length validation (usually 8 digits)

4. **Add data sanitization method (optional)**
   - Create clean method to remove spaces and special characters
   - Normalize format before saving
   - Override save() method if needed

5. **Update unique constraints**
   - Add unique_together constraint in Meta
   - Constraint: ('tenant', 'account_number')
   - Prevents duplicate accounts per tenant

### Account Number Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store account numbers |
| max_length | 20 | Support various formats |
| null | False | Field is required |
| blank | False | Must be filled |
| validators | RegexValidator | Format validation |
| verbose_name | Account Number | Display in admin |
| help_text | Enter bank account number | User guidance |

### Validation Rules

| Rule | Pattern | Example Valid | Example Invalid |
|------|---------|---------------|-----------------|
| Digits Only | ^[0-9]+$ | 1234567890 | 123-456-7890 |
| With Hyphens | ^[0-9\-]+$ | 123-456-7890 | 123.456.7890 |
| Length | 8-20 chars | 12345678 to 12345678901234567890 | 123 |

### Account Number Formats by Bank

```
Common Formats in Sri Lanka:
├── 10 digits: 0123456789
├── 12 digits: 012345678901
├── 14 digits: 01234567890123
└── With hyphens: 0123-4567-8901
```

### Uniqueness Constraint

```
Meta class:
    unique_together = [
        ['tenant', 'account_number']
    ]

Purpose:
└── Prevent same account number twice per tenant
    (Different tenants can use same number)
```

### Data Security Considerations

| Concern | Mitigation |
|---------|------------|
| Display | Show last 4 digits only in some contexts |
| Storage | Store complete number (needed for customer) |
| Logging | Mask in logs |
| Access | Restrict to authorized users |

### Validator Implementation Example

```
Pattern: ^[0-9]{8,20}$
Message: "Account number must be 8-20 digits"

Regex breakdown:
├── ^: Start of string
├── [0-9]: Only digits
├── {8,20}: Length 8 to 20
└── $: End of string
```

### Expected Outcome
- account_number field added to model
- Proper validation for format and length
- Unique constraint per tenant
- Ready to store various account formats

### Verification Checklist
- [ ] account_number CharField added
- [ ] max_length set to 20
- [ ] Field is required (null=False, blank=False)
- [ ] RegexValidator configured
- [ ] unique_together constraint added in Meta
- [ ] verbose_name and help_text set
- [ ] Validator tests account number formats correctly

---

## Task 04: Create Account Name Field

### Overview
Add the account_name field to store the name of the account holder (typically the business name). This field displays to customers during payment to verify they are paying to the correct business. The account name should match the name registered with the bank.

### Dependencies
- Task 01: Create BankAccount Model

### Instructions

1. **Add account_name field to model**
   - Create CharField with max_length of 100
   - Account names can be business or personal names
   - Set verbose_name to 'Account Holder Name'
   - Set help_text to explain expected value

2. **Configure field properties**
   - Set null=False (field is required)
   - Set blank=False (must be filled in forms)
   - No unique constraint (same name across accounts is valid)

3. **Add character validation (optional)**
   - Consider validator for allowed characters
   - Allow letters, spaces, and common punctuation
   - Reject special characters that might cause issues

4. **Add case normalization (optional)**
   - Consider storing in title case or uppercase
   - Override save() method for normalization
   - Ensure consistency across records

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store account holder name |
| max_length | 100 | Support long business names |
| null | False | Field is required |
| blank | False | Must be filled |
| verbose_name | Account Holder Name | Display in admin |
| help_text | Name as registered with bank | User guidance |

### Account Name Examples

| Type | Example | Length |
|------|---------|--------|
| Individual | John Doe | 8 chars |
| Business Short | ABC Store | 9 chars |
| Business Medium | Lanka Fashion Boutique | 23 chars |
| Business Long | Lanka Commerce Cloud Private Limited | 37 chars |
| DBA | John's Electronics (Pvt) Ltd | 28 chars |

### Character Validation

```
Allowed Characters:
├── Letters: A-Z, a-z (English)
├── Spaces: Single spaces between words
├── Punctuation: . , ' - ( )
└── Numbers: 0-9 (for business names)

Disallowed:
├── Special chars: @ # $ % & * = +
├── Multiple spaces
└── Leading/trailing spaces
```

### Display Contexts

| Context | Display Format | Purpose |
|---------|----------------|---------|
| Payment Page | Full name | Customer verification |
| Admin List | Full name | Management |
| Receipts | Full name | Documentation |
| Reports | Full name or truncated | Analytics |

### Normalization Options

| Method | Example Input | Stored As | Notes |
|--------|---------------|-----------|-------|
| As-is | ABC store | ABC store | No change |
| Title Case | ABC store | Abc Store | Capitalize words |
| Upper Case | ABC store | ABC STORE | All uppercase |
| Trim | "  ABC Store  " | ABC Store | Remove extra spaces |

### Data Quality Considerations

| Aspect | Implementation |
|--------|----------------|
| Consistency | Store as registered with bank |
| Validation | Check for empty or whitespace-only |
| Length | Ensure fits in 100 characters |
| Duplicates | Allow (same business, multiple accounts) |

### Expected Outcome
- account_name field added to model
- Supports various business and personal names
- Proper validation for data quality
- Displayed correctly to customers

### Verification Checklist
- [ ] account_name CharField added
- [ ] max_length set to 100
- [ ] Field is required (null=False, blank=False)
- [ ] verbose_name set to 'Account Holder Name'
- [ ] help_text explains expected value
- [ ] Optional character validator configured
- [ ] Field accommodates various name formats

---

## Task 05: Create Branch Field

### Overview
Add the branch field to optionally store the bank branch name or code. While not always required for electronic transfers, branch information helps customers identify the specific branch where the account is held and may be needed for certain payment verification processes.

### Dependencies
- Task 01: Create BankAccount Model

### Instructions

1. **Add branch field to model**
   - Create CharField with max_length of 100
   - Branch names can vary in length
   - Set verbose_name to 'Branch'
   - Set help_text to guide users

2. **Configure as optional field**
   - Set null=True (field is optional)
   - Set blank=True (can be empty in forms)
   - Set default to empty string or None

3. **Consider common branch formats**
   - Branch name: "Colombo Main Branch"
   - Branch code: "001" or "CMB001"
   - Branch location: "Fort, Colombo"
   - Support all formats with sufficient length

4. **Add display logic (optional)**
   - Create method to format branch display
   - Handle empty/null cases gracefully
   - Use in string representations

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store branch information |
| max_length | 100 | Support long branch names |
| null | True | Field is optional |
| blank | True | Can be empty in forms |
| default | "" | Empty string default |
| verbose_name | Branch | Display in admin |
| help_text | Branch name or code | User guidance |

### Branch Information Formats

| Format | Example | Use Case |
|--------|---------|----------|
| Branch Name | Colombo Main Branch | Customer-facing |
| Branch Code | 001 | Internal reference |
| Combined | 001 - Colombo Main | Both identifier and name |
| Location | Fort, Colombo | Geographic reference |
| Full Address | No. 1 Main St, Colombo 01 | Complete location |

### Common Sri Lankan Bank Branches

```
Bank of Ceylon:
├── Colombo Main Branch (001)
├── Kandy Branch (010)
├── Galle Branch (020)
└── Jaffna Branch (030)

Commercial Bank:
├── Head Office Branch
├── Fort Branch
├── Bambalapitiya Branch
└── Nugegoda Branch
```

### Display Logic

| Scenario | Branch Value | Display As |
|----------|--------------|------------|
| Has value | "Colombo Main" | "Colombo Main" |
| Empty string | "" | "N/A" or "Not specified" |
| Null | None | "N/A" or "Not specified" |

### Usage in Payment Display

```
Payment Instructions Display:

Bank: Commercial Bank of Ceylon
Account Number: 1234567890
Account Name: ABC Store (Pvt) Ltd
Branch: Colombo Main Branch    ← Optional field
SWIFT: CCEYLKLX
```

### Field Importance by Payment Type

| Payment Type | Branch Importance | Notes |
|--------------|-------------------|-------|
| Online Transfer | Low | Usually not needed |
| Mobile Banking | Low | Usually not needed |
| Counter Deposit | High | Customer needs branch info |
| Cheque Deposit | Medium | May be verified |
| SWIFT Transfer | Low | SWIFT code more important |

### Expected Outcome
- branch field added to model as optional
- Supports various branch information formats
- Handles empty values gracefully
- Available for display when needed

### Verification Checklist
- [ ] branch CharField added
- [ ] max_length set to 100
- [ ] Field is optional (null=True, blank=True)
- [ ] default value configured
- [ ] verbose_name and help_text set
- [ ] Field handles empty values correctly

---

## Task 06: Create Swift Code Field

### Overview
Add the swift_code field to optionally store the bank's SWIFT/BIC code. This code is essential for international wire transfers and may be required by some payment gateways. While optional for domestic payments, it's important for businesses accepting international transfers.

### Dependencies
- Task 01: Create BankAccount Model

### Instructions

1. **Add swift_code field to model**
   - Create CharField with max_length of 11
   - SWIFT codes are 8 or 11 characters
   - Set verbose_name to 'SWIFT/BIC Code'
   - Set help_text to explain purpose

2. **Configure as optional field**
   - Set null=True (field is optional)
   - Set blank=True (can be empty in forms)
   - Not required for domestic-only operations

3. **Add SWIFT format validator**
   - Import RegexValidator
   - SWIFT format: 4 letters (bank) + 2 letters (country) + 2 alphanumeric (location) + optional 3 alphanumeric (branch)
   - Pattern: ^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$
   - Ensure uppercase letters

4. **Add case normalization**
   - Override save() method or use validator
   - Convert to uppercase before saving
   - Remove spaces and hyphens if present

5. **Add field help text with examples**
   - Include Sri Lankan bank SWIFT examples
   - Explain when field is needed
   - Guide users on where to find SWIFT code

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Store SWIFT code |
| max_length | 11 | Standard SWIFT length |
| null | True | Field is optional |
| blank | True | Can be empty |
| validators | RegexValidator | Format validation |
| verbose_name | SWIFT/BIC Code | Display in admin |
| help_text | For international transfers | User guidance |

### SWIFT Code Format

```
Structure: AAAABBCCXXX
├── AAAA: Bank Code (4 letters)
├── BB: Country Code (2 letters, ISO 3166)
├── CC: Location Code (2 letters/digits)
└── XXX: Branch Code (3 letters/digits, optional)

Examples:
├── 8 characters: BCEYLKLX (Bank of Ceylon, main)
├── 11 characters: BCEYLKLXXXX (Bank of Ceylon, specific branch)
```

### Sri Lankan Bank SWIFT Codes

| Bank Name | SWIFT Code (8-char) | SWIFT Code (11-char) |
|-----------|---------------------|----------------------|
| Bank of Ceylon | BCEYLKLX | BCEYLKLXXXX |
| People's Bank | PSBKLKLX | PSBKLKLXXXX |
| Commercial Bank | CCEYLKLX | CCEYLKLXXXX |
| Sampath Bank | BSAMLKLX | BSAMLKLXXXX |
| Hatton National Bank | HBLILKLX | HBLILKLXXXX |
| Seylan Bank | SEYBLKLX | SEYBLKLXXXX |
| Nations Trust Bank | NTBCLKLX | NTBCLKLXXXX |
| DFCC Bank | DFCCLKLX | DFCCLKLXXXX |

### SWIFT Code Validation

| Validation Rule | Pattern | Example Valid | Example Invalid |
|----------------|---------|---------------|-----------------|
| Length | 8 or 11 chars | BCEYLKLX | BCEY |
| Format | Letters + digits | BCEYLKLX | BCE-YLKLX |
| Bank Code | 4 letters | BCEA | BC12 |
| Country Code | 2 letters | LK | L1 |
| Location | 2 alphanum | LX | L |

### Validator Implementation

```
Regex Pattern: ^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$

Breakdown:
├── ^[A-Z]{6}: Six uppercase letters (bank + country)
├── [A-Z0-9]{2}: Two letters/digits (location)
├── ([A-Z0-9]{3})?: Optional three letters/digits (branch)
└── $: End of string

Error Message:
"Enter a valid SWIFT/BIC code (e.g., BCEYLKLX or BCEYLKLXXXX)"
```

### Use Cases

| Scenario | SWIFT Required | Notes |
|----------|----------------|-------|
| Domestic Transfers | No | Not typically used |
| International Transfers | Yes | Essential for routing |
| Payment Gateways | Maybe | Some gateways require it |
| Customer Display | Optional | Shows professionalism |

### Display Format

```
When Present:
Bank: Commercial Bank of Ceylon
SWIFT: CCEYLKLX

When Empty:
Bank: Commercial Bank of Ceylon
SWIFT: Not available
```

### Expected Outcome
- swift_code field added as optional
- Proper SWIFT format validation
- Uppercase normalization
- Supports both 8 and 11 character codes

### Verification Checklist
- [ ] swift_code CharField added
- [ ] max_length set to 11
- [ ] Field is optional (null=True, blank=True)
- [ ] RegexValidator for SWIFT format configured
- [ ] Uppercase normalization implemented
- [ ] verbose_name set to 'SWIFT/BIC Code'
- [ ] help_text includes examples
- [ ] Validates both 8 and 11 character codes

---

## Task 07: Create Is Active Field

### Overview
Add the is_active field to enable/disable bank accounts without deleting them. This boolean field allows tenants to temporarily hide accounts from customer payment options while retaining the account data for historical records and potential future reactivation.

### Dependencies
- Task 01: Create BankAccount Model

### Instructions

1. **Add is_active field to model**
   - Create BooleanField
   - Set default to True (new accounts active by default)
   - Set verbose_name to 'Active'
   - Set help_text to explain functionality

2. **Configure field properties**
   - Set null=False (boolean fields should not be null)
   - Set default=True (activate on creation)
   - No blank parameter needed for BooleanField

3. **Add database index**
   - Update Meta class indexes
   - Add index for ('tenant', 'is_active')
   - Optimize queries for active accounts per tenant

4. **Update model manager (optional)**
   - Create custom manager with active() method
   - Filter for is_active=True by default
   - Provide all_accounts() for admin views

5. **Consider admin display**
   - Add is_active to list_display in admin
   - Add is_active to list_filter in admin
   - Show visual indicator (icon/color) for active status

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | BooleanField | True/False state |
| default | True | New accounts active |
| null | False | No null values |
| verbose_name | Active | Display in admin |
| help_text | Uncheck to hide from customers | User guidance |
| db_index | True (composite) | Query optimization |

### Active Status Behavior

| Status | Customer View | Admin View | Payments |
|--------|---------------|------------|----------|
| True (Active) | Visible | Shows "Active" | Accepted |
| False (Inactive) | Hidden | Shows "Inactive" | Not accepted |

### Use Cases for Inactive Accounts

```
Scenarios for Setting is_active=False:
├── Temporary: Account under maintenance
├── Seasonal: Account used only certain times
├── Deprecated: Moving to new account gradually
├── Testing: Account was for testing
└── Full: Account reached transaction limit
```

### Query Optimization

```
Index Structure:
CREATE INDEX idx_bankaccount_tenant_active
ON payments_bank_accounts(tenant_id, is_active);

Common Query:
SELECT * FROM payments_bank_accounts
WHERE tenant_id = ? AND is_active = TRUE
ORDER BY display_order;

Benefits:
└── Fast filtering of active accounts per tenant
```

### Admin Display Options

| Display Element | Implementation | Purpose |
|----------------|----------------|---------|
| List Column | is_active | Show status in list |
| Boolean Icon | ✓ / ✗ | Visual indicator |
| Filter Sidebar | is_active | Filter by status |
| Actions | Toggle active/inactive | Bulk operations |
| Colors | Green/Red | Visual distinction |

### Custom Manager Example

```
Query Methods:
├── BankAccount.objects.active()
│   └── Returns only is_active=True
├── BankAccount.objects.inactive()
│   └── Returns only is_active=False
└── BankAccount.objects.all()
    └── Returns all accounts

Usage:
active_accounts = BankAccount.objects.active()
all_accounts = BankAccount.objects.all()
```

### State Transitions

```
Creation → Active (default)
Active → Inactive (manual toggle)
Inactive → Active (manual toggle)
Any State → Deleted (hard delete, avoided)

Lifecycle:
┌─────────┐
│ Created │
│ (Active)│
└────┬────┘
     │
     ├─→ [Active] ←──┐
     │                 │
     └─→ [Inactive] ──┘
```

### Impact on Other Features

| Feature | Behavior with Inactive Account |
|---------|-------------------------------|
| Payment Options | Not shown to customer |
| Reports | Still included in historical data |
| Admin | Visible with "Inactive" label |
| APIs | Excluded from public endpoints |
| Webhooks | Not used for new payments |

### Expected Outcome
- is_active field added to model
- Defaults to True for new accounts
- Database indexed for performance
- Ready to filter active accounts in queries

### Verification Checklist
- [ ] is_active BooleanField added
- [ ] default set to True
- [ ] verbose_name and help_text configured
- [ ] Database index added in Meta (tenant + is_active)
- [ ] Field displays correctly in admin
- [ ] Queries can filter by is_active efficiently

---

## Summary

This document established the BankAccount model and its core fields required for storing tenant-specific bank account information. The model now contains all essential data fields needed to display bank account details to customers during bank transfer payments.

### Completed Tasks
1. ✓ Created BankAccount model with tenant relationship
2. ✓ Added bank_name field with Sri Lankan banks choices
3. ✓ Added account_number field with validation
4. ✓ Added account_name field for account holder
5. ✓ Added branch field as optional information
6. ✓ Added swift_code field for international transfers
7. ✓ Added is_active field for account management

### Model Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| tenant | ForeignKey | Yes | Multi-tenancy |
| bank_name | CharField | Yes | Bank selection |
| account_number | CharField | Yes | Account identifier |
| account_name | CharField | Yes | Account holder |
| branch | CharField | No | Branch information |
| swift_code | CharField | No | International transfers |
| is_active | BooleanField | Yes | Visibility toggle |

### Next Steps
Proceed to [02_Tasks-08-14_Config-Verify.md](02_Tasks-08-14_Config-Verify.md) to add display ordering, create admin interface, configure BankTransferConfig model for payment settings, and verify the complete bank account configuration.
