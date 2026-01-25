# Tasks 04-10: Bank Configuration and GL Linking Fields

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** A - Bank Account Configuration  
> **Document:** 02 of 03  
> **Tasks Covered:** 04, 05, 06, 07, 08, 09, 10

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-03_Reconciliation-Module-BankAccount.md](01_Tasks-01-03_Reconciliation-Module-BankAccount.md)
- **→ Next Document:** [03_Tasks-11-14_Reconciliation-Tracking-Migrations.md](03_Tasks-11-14_Reconciliation-Tracking-Migrations.md)

---

## Document Overview

This document adds essential bank identification fields and General Ledger integration to the BankAccount model. It includes account naming, account numbers, bank and branch information, GL account foreign key linking, account type selection, and currency configuration for multi-currency support. These fields enable comprehensive bank account management and automated journal posting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 04 | Add Bank Account Name | Low | 10 min |
| 05 | Add Bank Account Number | Low | 12 min |
| 06 | Add Bank Name Field | Low | 10 min |
| 07 | Add Bank Branch Field | Low | 15 min |
| 08 | Add GL Account FK | Medium | 30 min |
| 09 | Add Account Type Field | Low | 10 min |
| 10 | Add Currency Field | Low | 15 min |

---

## Task 04: Add Bank Account Name

### Overview
Add an account name field to the BankAccount model for human-readable identification. This field stores a descriptive name for the bank account, making it easy to identify accounts in selection lists, reports, and administrative interfaces.

### Dependencies
- Task 03: Create BankAccount Model

### Instructions

1. **Open bank_account.py model file**
   - Navigate to `apps/accounting/reconciliation/models/bank_account.py`
   - Locate the BankAccount model class

2. **Add account_name field**
   - Add CharField for account name
   - Set max_length=100
   - Required field (blank=False, null=False)
   - Add help_text for user guidance

3. **Position field appropriately**
   - Place after tenant and account_type fields
   - Group with other identification fields
   - Follow logical field ordering

4. **Add field validation**
   - Consider adding validators for special characters
   - Ensure name is meaningful and descriptive
   - Prevent empty strings

### Field Specification

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Text storage |
| max_length | 100 | Reasonable name length |
| blank | False | Must provide name |
| null | False | Database constraint |
| db_index | False | Not frequently searched alone |
| help_text | "Descriptive name for this bank account" | User guidance |

### Account Name Examples

| Business Type | Account Name Examples |
|--------------|----------------------|
| Retail Store | "Main Operating Account", "Payroll Account", "Savings Reserve" |
| Restaurant | "Daily Collections", "Supplier Payments", "Petty Cash" |
| Manufacturing | "Operations Checking", "Payroll Account", "Tax Reserve" |
| Service Business | "Client Deposits", "Operating Account", "Emergency Fund" |

### Naming Best Practices

**Good Names:**
- Clear purpose indication
- Business context included
- Distinguishable from others
- Professional terminology

**Examples:**
- ✅ "Main Operating - Commercial Bank"
- ✅ "Payroll Disbursement Account"
- ✅ "USD Revenue Account"
- ✅ "Petty Cash - Head Office"

**Avoid:**
- ❌ "Account 1", "Account 2"
- ❌ "Bank", "Checking"
- ❌ Unclear abbreviations
- ❌ Personal account names

### Expected Outcome
- User-friendly account identification
- Clear account naming convention
- Easy account selection in UI
- Professional account organization

### Verification Checklist
- [ ] account_name field added to model
- [ ] Field is required (no blank/null)
- [ ] max_length set to 100
- [ ] help_text provided
- [ ] Positioned logically in model

---

## Task 05: Add Bank Account Number

### Overview
Add a bank account number field to store the actual account number issued by the bank. This field is critical for bank statement matching, reconciliation, and external bank communication. The account number uniquely identifies the account at the financial institution.

### Dependencies
- Task 03: Create BankAccount Model

### Instructions

1. **Open bank_account.py model file**
   - Continue in `apps/accounting/reconciliation/models/bank_account.py`
   - Add account number field after account_name

2. **Add account_number field**
   - Add CharField for account number
   - Set max_length=50
   - Required field (blank=False, null=False)
   - Add help_text explaining format

3. **Add uniqueness constraint**
   - Consider adding unique=True at tenant level
   - Prevent duplicate account numbers
   - Or use unique_together in Meta class

4. **Add field indexing**
   - Add db_index=True for search performance
   - Account number frequently used in lookups
   - Improves query performance

5. **Consider formatting validation**
   - Different banks use different formats
   - May include letters and numbers
   - Hyphens or spaces may be present
   - Allow flexible format

### Field Specification

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Alphanumeric support |
| max_length | 50 | Accommodate various formats |
| blank | False | Must provide number |
| null | False | Database constraint |
| db_index | True | Fast lookups |
| unique | False | Handled at tenant level |
| help_text | "Bank account number as shown on statements" | User guidance |

### Account Number Formats

| Bank Type | Format Example | Length | Characters |
|-----------|---------------|--------|------------|
| Sri Lankan Banks | 1234567890 | 10-15 digits | Numeric |
| International IBAN | LK12CEYB12345678901234 | 22-34 chars | Alphanumeric |
| US Banks | 123456789 | 9-17 digits | Numeric |
| UK Banks | 12345678 | 8 digits | Numeric |

### Sri Lankan Bank Account Examples

**Bank of Ceylon:**
- Format: 0012345678
- Length: 10 digits
- Numeric only

**Commercial Bank:**
- Format: 8001234567890
- Length: 13 digits
- May include branch code prefix

**Sampath Bank:**
- Format: 123456789012
- Length: 12 digits
- Numeric only

### Account Number Security Considerations

**Display in UI:**
- Mask account numbers in lists (e.g., "****6789")
- Show full number only to authorized users
- Log access to sensitive data

**Storage:**
- Store actual account number
- Do not encrypt (needed for matching)
- Protect via application security
- Restrict database access

**Validation:**
- Allow flexible format
- Trim whitespace
- Remove common separators (hyphens, spaces)
- Normalize for storage

### Expected Outcome
- Secure account number storage
- Flexible format support
- Fast account lookups
- Foundation for statement matching

### Verification Checklist
- [ ] account_number field added
- [ ] max_length set to 50
- [ ] Field is required
- [ ] db_index set to True
- [ ] help_text provided
- [ ] Positioned after account_name

---

## Task 06: Add Bank Name Field

### Overview
Add a bank name field to identify the financial institution holding the account. This field stores the name of the bank, which is essential for reporting, bank communication, and organizing accounts by institution.

### Dependencies
- Task 03: Create BankAccount Model

### Instructions

1. **Open bank_account.py model file**
   - Continue in bank_account.py
   - Add bank_name field after account_number

2. **Add bank_name field**
   - Add CharField for bank name
   - Set max_length=200
   - Required field (blank=False, null=False)
   - Add help_text with examples

3. **Consider adding choices**
   - Option: Define common Sri Lankan banks as choices
   - Alternative: Allow free text for flexibility
   - Balance between standardization and flexibility

4. **Add field indexing**
   - Add db_index=True
   - Enables filtering by bank
   - Improves report performance

### Field Specification

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Bank name storage |
| max_length | 200 | Long bank names |
| blank | False | Must specify bank |
| null | False | Database constraint |
| db_index | True | Fast filtering |
| help_text | "Name of the financial institution" | User guidance |

### Sri Lankan Banks List

| Bank Name | Type | Common Usage |
|-----------|------|--------------|
| Bank of Ceylon | State-owned | Most common |
| People's Bank | State-owned | Very common |
| Commercial Bank of Ceylon | Private | Common |
| Hatton National Bank (HNB) | Private | Common |
| Sampath Bank | Private | Common |
| Seylan Bank | Private | Common |
| Nations Trust Bank | Private | Common |
| DFCC Bank | Private | Less common |
| National Development Bank (NDB) | Private | Less common |
| Pan Asia Bank | Private | Less common |

### International Banks in Sri Lanka

| Bank Name | Type |
|-----------|------|
| Standard Chartered Bank | International |
| Citibank | International |
| HSBC | International |

### Bank Name Standardization Options

**Option 1: Free Text (Recommended)**
- Pros: Flexibility for any bank
- Pros: No maintenance of bank list
- Cons: Inconsistent spelling
- Cons: Harder to filter/report

**Option 2: Choices with "Other"**
- Pros: Standardization for common banks
- Pros: Still allows flexibility
- Cons: Requires maintaining list
- Cons: More complex UI

**Option 3: Separate Bank Model**
- Pros: Full normalization
- Pros: Easy to extend bank details
- Cons: Over-engineering for MVP
- Cons: Additional complexity

### Recommended Approach
Use free text with suggestions in frontend:
- Store any bank name
- Provide autocomplete suggestions
- No database constraints on values
- Flexible and simple

### Expected Outcome
- Clear bank identification
- Support for any financial institution
- Fast filtering by bank
- Foundation for bank-specific logic

### Verification Checklist
- [ ] bank_name field added
- [ ] max_length set to 200
- [ ] Field is required
- [ ] db_index set to True
- [ ] help_text provided

---

## Task 07: Add Bank Branch Field

### Overview
Add bank branch fields to identify the specific branch where the account is held. This includes branch name and branch code, which are important for check clearing, bank communication, and detailed account identification in Sri Lanka's banking system.

### Dependencies
- Task 03: Create BankAccount Model

### Instructions

1. **Open bank_account.py model file**
   - Continue in bank_account.py
   - Add branch fields after bank_name

2. **Add branch_name field**
   - Add CharField for branch name
   - Set max_length=200
   - Optional field (blank=True, null=True)
   - Add help_text with examples

3. **Add branch_code field**
   - Add CharField for branch code
   - Set max_length=20
   - Optional field (blank=True, null=True)
   - Add help_text explaining format

4. **Position fields logically**
   - Group branch fields together
   - Place after bank_name
   - Before GL account linking

### Field Specifications

**branch_name Field:**
| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Branch name storage |
| max_length | 200 | Long branch names |
| blank | True | Optional information |
| null | True | Database constraint |
| db_index | False | Rarely filtered |
| help_text | "Branch name (e.g., 'Colombo Main Branch')" | User guidance |

**branch_code Field:**
| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Branch code storage |
| max_length | 20 | Short code format |
| blank | True | Optional information |
| null | True | Database constraint |
| db_index | False | Rarely searched |
| help_text | "Branch code or SWIFT code" | User guidance |

### Sri Lankan Branch Code Examples

**Bank of Ceylon:**
- Main Branch, Colombo: 0001
- Fort Branch: 0002
- Kandy Branch: 0031
- Format: 4-digit numeric

**Commercial Bank:**
- Head Office: 001
- Colombo Super Branch: 002
- Kandy: 031
- Format: 3-digit numeric

**SWIFT Code Format:**
- Example: CEYLKLKAXXX
- CEYL: Bank code
- LK: Country code
- KA: Location code
- XXX: Branch code

### Branch Information Usage

**Use Cases:**
- Check clearing identification
- Inter-branch transfers
- Bank statement headers
- Official correspondence
- Legal documentation

**Optional Because:**
- Not all accounts need branch detail
- Online-only accounts may not have branch
- International accounts use SWIFT
- Can be added later if needed

### Branch Name Examples

| City | Branch Name Examples |
|------|---------------------|
| Colombo | "Colombo Main Branch", "Fort Branch", "Bambalapitiya" |
| Kandy | "Kandy Branch", "Kandy City" |
| Galle | "Galle Branch", "Galle Fort" |
| Jaffna | "Jaffna Branch" |

### Expected Outcome
- Detailed branch identification
- Support for branch-specific operations
- Flexible optional fields
- Complete bank account profile

### Verification Checklist
- [ ] branch_name field added
- [ ] branch_name is optional (blank=True, null=True)
- [ ] branch_name max_length=200
- [ ] branch_code field added
- [ ] branch_code is optional (blank=True, null=True)
- [ ] branch_code max_length=20
- [ ] help_text provided for both fields
- [ ] Fields positioned after bank_name

---

## Task 08: Add GL Account FK

### Overview
Add a foreign key to the Chart of Accounts to link the bank account to a General Ledger account. This link enables automatic journal entry posting when reconciliations are completed and ensures proper financial statement reporting. The GL account type must match the bank account type for accounting integrity.

### Dependencies
- Task 03: Create BankAccount Model
- Account model (Chart of Accounts) exists

### Instructions

1. **Open bank_account.py model file**
   - Continue in bank_account.py
   - Add GL account foreign key

2. **Import Account model**
   - Import Account from accounting.models
   - Ensure proper import path
   - May need relative import

3. **Add gl_account field**
   - Add ForeignKey to Account model
   - Required field (blank=False, null=False)
   - Add on_delete=models.PROTECT
   - Add related_name='bank_accounts'

4. **Add field constraints**
   - Add db_index=True for performance
   - Consider adding validators
   - Add help_text explaining linkage

5. **Update save method validation**
   - Validate GL account type matches bank account type
   - Check account type compatibility
   - Raise ValidationError for mismatch

6. **Add clean method**
   - Implement model-level validation
   - Check GL account belongs to same tenant
   - Verify account type rules

### Field Specification

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | ForeignKey | Relationship to Account |
| to | Account | Chart of Accounts model |
| blank | False | Must link to GL account |
| null | False | Database constraint |
| on_delete | PROTECT | Prevent accidental deletion |
| related_name | 'bank_accounts' | Reverse relation |
| db_index | True | Fast lookups |
| help_text | "General Ledger account for this bank account" | User guidance |

### GL Account Linking Rules

```
Bank Account Type → GL Account Type Mapping
══════════════════════════════════════════

CHECKING Account:
  └─ Must link to: Asset Account
     └─ Account Code Range: 1100-1120
        └─ Example: 1100 - Cash in Bank - Checking

SAVINGS Account:
  └─ Must link to: Asset Account
     └─ Account Code Range: 1130-1140
        └─ Example: 1130 - Cash in Bank - Savings

CREDIT_CARD Account:
  └─ Must link to: Liability Account
     └─ Account Code Range: 2100-2120
        └─ Example: 2100 - Credit Card Payable

CASH Account:
  └─ Must link to: Asset Account
     └─ Account Code Range: 1100-1110
        └─ Example: 1101 - Cash on Hand - Petty Cash
```

### Account Type Validation Logic

```
Validation Flow
═══════════════

1. Get bank_account.account_type
2. Get gl_account.account_type from Chart of Accounts
3. Apply validation rules:

   IF bank_account.account_type in [CHECKING, SAVINGS, CASH]:
      REQUIRE gl_account.account_type == ASSET
   
   IF bank_account.account_type == CREDIT_CARD:
      REQUIRE gl_account.account_type == LIABILITY
   
4. IF validation fails:
   RAISE ValidationError with clear message

5. Check tenant isolation:
   REQUIRE gl_account.tenant == bank_account.tenant
```

### Sample GL Account Structure

**Assets - Cash Accounts:**
```
1100 - Cash and Cash Equivalents
  1101 - Cash on Hand
  1102 - Petty Cash
  1110 - Cash in Bank - Checking
    1111 - Bank of Ceylon - Checking
    1112 - Commercial Bank - Checking
  1130 - Cash in Bank - Savings
    1131 - Bank of Ceylon - Savings
    1132 - Commercial Bank - Savings
```

**Liabilities - Credit Cards:**
```
2100 - Short-term Liabilities
  2110 - Credit Card Payable
    2111 - Commercial Bank Credit Card
    2112 - Amex Corporate Card
```

### Foreign Key Protection

**on_delete=models.PROTECT:**
- Prevents deletion of GL account if bank accounts exist
- Protects data integrity
- Requires unlinking before deletion
- Better than CASCADE for financial data

### Multi-Tenant Validation

Ensure GL account belongs to same tenant:
- Check tenant_id matches
- Prevent cross-tenant account linking
- Maintain data isolation
- Critical security requirement

### Expected Outcome
- Proper GL account integration
- Automated journal posting capability
- Type-safe account linking
- Multi-tenant data integrity

### Verification Checklist
- [ ] Account model imported
- [ ] gl_account ForeignKey added
- [ ] on_delete set to PROTECT
- [ ] related_name set to 'bank_accounts'
- [ ] Field is required
- [ ] db_index set to True
- [ ] help_text provided
- [ ] Validation in save method
- [ ] Tenant isolation check
- [ ] Account type compatibility check

---

## Task 09: Add Account Type Field

### Overview
This task verifies that the account_type field is properly configured in the BankAccount model. The field was added in Task 03 but needs to be confirmed with proper placement among other configuration fields and proper integration with the BankAccountType enumeration.

### Dependencies
- Task 03: Create BankAccount Model
- Task 02: Define BankAccountType Enum

### Instructions

1. **Verify account_type field exists**
   - Check bank_account.py model file
   - Confirm field was added in Task 03
   - Ensure proper configuration

2. **Verify field properties**
   - CharField with choices from BankAccountType
   - max_length sufficient for enum values
   - Required field (blank=False, null=False)
   - help_text provided

3. **Verify field positioning**
   - Placed logically with other core fields
   - Near tenant and identification fields
   - Before bank-specific details

4. **Verify enumeration integration**
   - BankAccountType properly imported
   - Choices set correctly
   - All enum values available

### Field Specification (Verification)

| Property | Expected Value | Verification |
|----------|---------------|--------------|
| Field Type | CharField | Confirm type |
| max_length | 20 or more | Fits enum values |
| choices | BankAccountType.choices | Proper enum reference |
| blank | False | Required field |
| null | False | Database constraint |
| help_text | Account classification description | User guidance |

### Account Type Usage

**In Model Validation:**
- Determines GL account type requirements
- Affects balance type (debit/credit)
- Influences reconciliation logic

**In UI:**
- Dropdown selection with labels
- Filter accounts by type
- Group accounts in reports

**In Reports:**
- Separate sections by type
- Different formatting for credit cards
- Aggregate by account type

### Expected Outcome
- Properly configured account_type field
- Full BankAccountType enumeration integration
- Ready for account classification

### Verification Checklist
- [ ] account_type field exists in model
- [ ] Field uses BankAccountType.choices
- [ ] Field is required
- [ ] Field is properly positioned
- [ ] help_text provided
- [ ] Enum imported correctly

---

## Task 10: Add Currency Field

### Overview
Add a currency field to support multi-currency bank accounts. While most Sri Lankan businesses operate in LKR (Sri Lankan Rupee), some businesses maintain foreign currency accounts for international transactions. This field stores the ISO 4217 currency code for the account.

### Dependencies
- Task 03: Create BankAccount Model

### Instructions

1. **Open bank_account.py model file**
   - Continue in bank_account.py
   - Add currency field after account_type

2. **Add currency field**
   - Add CharField for currency code
   - Set max_length=3 (ISO 4217 standard)
   - Set default='LKR'
   - Required field (blank=False, null=False)
   - Add help_text with ISO reference

3. **Add field validation**
   - Consider adding choices for common currencies
   - Or validate against ISO 4217 list
   - Ensure uppercase storage

4. **Add field indexing**
   - Add db_index=True
   - Enable filtering by currency
   - Support multi-currency reports

### Field Specification

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Currency code storage |
| max_length | 3 | ISO 4217 standard |
| blank | False | Must specify currency |
| null | False | Database constraint |
| default | 'LKR' | Sri Lankan Rupee |
| db_index | True | Fast filtering |
| help_text | "ISO 4217 currency code (e.g., LKR, USD, EUR)" | User guidance |

### ISO 4217 Currency Codes

**Common Currencies in Sri Lanka:**

| Code | Currency | Country | Usage |
|------|----------|---------|-------|
| LKR | Sri Lankan Rupee | Sri Lanka | Primary currency |
| USD | US Dollar | United States | Foreign trade |
| EUR | Euro | European Union | European trade |
| GBP | British Pound | United Kingdom | UK trade |
| INR | Indian Rupee | India | Regional trade |
| SGD | Singapore Dollar | Singapore | Asian trade |
| JPY | Japanese Yen | Japan | Asian trade |
| AUD | Australian Dollar | Australia | Trade/remittances |

### Currency Usage Scenarios

**LKR Accounts (Default):**
- All domestic transactions
- Local supplier payments
- Local customer collections
- Salaries and wages
- Tax payments

**USD Accounts:**
- Export revenue collection
- Import payments
- Foreign supplier payments
- International services
- Forex holdings

**Other Foreign Currency:**
- Specialized trade relationships
- Remittance collections
- Investment holdings
- International payroll

### Multi-Currency Considerations

**Exchange Rate Handling:**
- Currency field identifies account currency
- Exchange rates handled separately
- Transactions recorded in account currency
- Conversion for consolidated reports

**Reporting:**
- Filter accounts by currency
- Separate balances by currency
- Consolidate with exchange rates
- Multi-currency balance sheet

**Bank Statement Import:**
- Statement currency must match account currency
- Validate currency during import
- Reject mismatched statements
- Convert if necessary (advanced feature)

### Default Currency Logic

```
Currency Assignment Flow
════════════════════════

New Bank Account Created:
  │
  ├─ Currency specified? → Use specified currency
  │
  └─ Currency not specified? → Default to 'LKR'
     └─ Sri Lankan business default
        └─ Can be changed later
```

### Future Currency Features

**Phase 1 (Current):**
- Store currency code
- Display currency in UI
- Filter by currency

**Phase 2 (Future):**
- Currency conversion
- Exchange rate tables
- Multi-currency reports
- Forex gain/loss tracking

### Expected Outcome
- Multi-currency account support
- LKR default for Sri Lankan operations
- ISO 4217 compliance
- Foundation for forex features

### Verification Checklist
- [ ] currency field added
- [ ] max_length set to 3
- [ ] default set to 'LKR'
- [ ] Field is required
- [ ] db_index set to True
- [ ] help_text provided
- [ ] Positioned appropriately

---

## Summary

This document added critical bank identification and configuration fields to the BankAccount model, including account name and number, bank and branch details, General Ledger account linking with validation, account type classification, and multi-currency support. The model now has complete bank account profile capabilities.

### Completed Tasks
- ✅ Task 04: Add Bank Account Name
- ✅ Task 05: Add Bank Account Number
- ✅ Task 06: Add Bank Name Field
- ✅ Task 07: Add Bank Branch Field
- ✅ Task 08: Add GL Account FK
- ✅ Task 09: Add Account Type Field (verification)
- ✅ Task 10: Add Currency Field

### Next Steps
- Add reconciliation tracking fields (last reconciled date and balance)
- Add active flag for account status management
- Run database migrations to create tables
- Test model validation and constraints
