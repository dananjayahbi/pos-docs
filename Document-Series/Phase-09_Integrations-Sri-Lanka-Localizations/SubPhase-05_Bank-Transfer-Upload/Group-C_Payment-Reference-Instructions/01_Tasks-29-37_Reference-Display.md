# Tasks 29-37: Reference Generation and Display

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 05 - Bank Transfer with Upload  
> **Group:** C - Payment Reference & Instructions  
> **Document:** 01 of 02  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34, 35, 36, 37

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-B_Bank-Transfer-Processor/02_Tasks-22-28_Expiry-Refund-Verify.md](../Group-B_Bank-Transfer-Processor/02_Tasks-22-28_Expiry-Refund-Verify.md)
- **→ Next Document:** [02_Tasks-38-44_Channels-Reminder-Verify.md](02_Tasks-38-44_Channels-Reminder-Verify.md)

---

## Document Overview

This document covers the creation of payment reference generation system and payment instructions display. It establishes the unique reference format for bank transfers, validates references, creates customizable payment instructions templates, and implements user-friendly displays for bank details, amounts, and expiry times with copy-to-clipboard functionality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 29 | Create Reference Generator | Medium | 45 min |
| 30 | Create Reference Format | Low | 20 min |
| 31 | Create Reference Validation | Low | 30 min |
| 32 | Create Payment Instructions | Medium | 60 min |
| 33 | Create Instructions Model | Medium | 45 min |
| 34 | Create Bank Details Display | Low | 30 min |
| 35 | Create Amount Display | Low | 25 min |
| 36 | Create Expiry Display | Low | 25 min |
| 37 | Create Copy to Clipboard | Low | 30 min |

---

## Task 29: Create Reference Generator

### Overview
Create a reference generator that produces unique payment references for each bank transfer order. The generator ensures each reference is unique, traceable, and follows a standardized format that customers can easily use when making bank transfers.

### Dependencies
- Task 28: Verify Bank Transfer Processor (Group B)
- Bank transfer processor must be fully functional
- Order model must exist with ID field

### Instructions

1. **Navigate to the processors directory**
   - Go to `backend/apps/payments/processors/bank_transfer/`
   - This is where bank transfer-specific logic resides

2. **Create reference.py module**
   - Create new file named `reference.py`
   - This module handles all reference generation logic

3. **Import required dependencies**
   - Import random and string for generating random characters
   - Import Order model to access order details
   - Import BankTransferPayment model to check uniqueness
   - Import logging for error tracking

4. **Define generate_reference function**
   - Create function that accepts order_id as parameter
   - Function should return a unique reference string
   - Handle edge cases (invalid order_id, collisions)

5. **Implement uniqueness check**
   - Query BankTransferPayment model to verify reference doesn't exist
   - Implement retry logic (max 5 attempts) if collision occurs
   - Raise exception if unable to generate unique reference after retries

6. **Add logging**
   - Log each reference generation attempt
   - Log any collisions detected
   - Log final generated reference

7. **Create helper function for random generation**
   - Create separate function to generate random alphanumeric string
   - Use uppercase letters and digits (A-Z, 0-9)
   - Length should be 4 characters

### Reference Generation Logic

```
┌────────────────────────────────────────┐
│  Generate Reference Request            │
│  Input: order_id                       │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│  Format: ORD-{order_id}-{random}       │
│  Generate random 4-char alphanumeric   │
└────────────┬───────────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│  Check if reference exists             │
│  Query BankTransferPayment             │
└────────────┬───────────────────────────┘
             │
        ┌────┴────┐
        │         │
    Exists?    No │
        │         │
        ▼         ▼
    Retry      Return
   (Max 5)   Reference
```

### Reference Generator Specifications

| Specification | Value | Description |
|---------------|-------|-------------|
| Function Name | generate_reference | Main entry point |
| Input | order_id (int) | Order ID to generate reference for |
| Output | reference (str) | Unique reference string |
| Max Retries | 5 | Maximum collision retry attempts |
| Random Length | 4 | Characters in random portion |
| Character Set | A-Z, 0-9 | Alphanumeric uppercase only |

### Error Handling

| Error Type | Condition | Action |
|------------|-----------|--------|
| Invalid Order ID | order_id is None or <= 0 | Raise ValueError |
| Collision | Reference exists in database | Retry with new random |
| Max Retries Exceeded | 5 collisions in a row | Raise RuntimeError |
| Database Error | Query fails | Log error, raise exception |

### Expected Outcome
- Functional reference generator that produces unique references
- Collision detection and retry mechanism
- Proper error handling and logging
- Helper functions for random string generation

### Verification Checklist
- [ ] `reference.py` file created in processors/bank_transfer/
- [ ] generate_reference function implemented
- [ ] Uniqueness check queries BankTransferPayment model
- [ ] Retry logic handles collisions (max 5 attempts)
- [ ] Random string generation uses A-Z and 0-9
- [ ] Error handling covers all edge cases
- [ ] Logging added for generation attempts and collisions

---

## Task 30: Create Reference Format

### Overview
Define and implement the standardized reference format for bank transfers. The format must be clear, easy to read, and contain sufficient information for tracking while remaining short enough for customers to type manually if needed.

### Dependencies
- Task 29: Create Reference Generator

### Instructions

1. **Define format specification**
   - Format: `ORD-{order_id}-{random}`
   - Order ID: Variable length integer
   - Random: Exactly 4 alphanumeric characters (uppercase)

2. **Update generate_reference function**
   - Modify function to use exact format specification
   - Use f-string for formatting: `f"ORD-{order_id}-{random}"`
   - Ensure consistent casing (uppercase)

3. **Create format validation constant**
   - Define REFERENCE_PATTERN constant at module level
   - Use regex pattern to validate format
   - Pattern: `^ORD-\d+-[A-Z0-9]{4}$`

4. **Add format documentation**
   - Add docstring to generate_reference function
   - Document format structure and examples
   - Explain each component of the reference

5. **Create format helper functions**
   - Create parse_reference function to extract order_id
   - Create is_valid_format function to check pattern match
   - Return parsed components as dictionary

### Reference Format Structure

```
Format: ORD-{order_id}-{random}
        ─┬─ ────┬──── ──┬──
         │      │       │
         │      │       └─ Random identifier (4 chars)
         │      └───────── Order ID (variable length)
         └──────────────── Prefix (constant)

Examples:
- ORD-12345-A7B3
- ORD-789-K2M9
- ORD-100234-Z8X1
```

### Format Components

| Component | Description | Example | Rules |
|-----------|-------------|---------|-------|
| Prefix | Fixed "ORD" identifier | ORD | Always uppercase |
| Separator 1 | Hyphen after prefix | - | Required |
| Order ID | Variable length integer | 12345 | No leading zeros |
| Separator 2 | Hyphen before random | - | Required |
| Random | 4-character identifier | A7B3 | A-Z, 0-9 only |

### Regex Pattern Breakdown

| Pattern Part | Meaning | Matches |
|-------------|---------|---------|
| `^` | Start of string | - |
| `ORD` | Literal "ORD" | ORD |
| `-` | Literal hyphen | - |
| `\d+` | One or more digits | 12345, 789 |
| `-` | Literal hyphen | - |
| `[A-Z0-9]{4}` | Exactly 4 alphanumeric | A7B3, K2M9 |
| `$` | End of string | - |

### Format Examples

| Valid Examples | Invalid Examples | Reason |
|---------------|------------------|---------|
| ORD-12345-A7B3 | ord-12345-a7b3 | Lowercase |
| ORD-1-Z9K2 | ORD-12345-ABC | Random too short |
| ORD-999999-K0P1 | ORD-12345-ABCDE | Random too long |
| ORD-5000-M3N4 | ORD--A7B3 | Missing order ID |

### Expected Outcome
- Standardized format specification documented
- Format constant defined with regex pattern
- Helper functions for parsing and validation
- Comprehensive format documentation

### Verification Checklist
- [ ] Format follows specification: ORD-{order_id}-{random}
- [ ] REFERENCE_PATTERN constant defined with regex
- [ ] generate_reference uses f-string formatting
- [ ] parse_reference function extracts order_id
- [ ] is_valid_format function validates pattern
- [ ] Docstring documents format with examples
- [ ] Random portion always 4 uppercase alphanumeric chars

---

## Task 31: Create Reference Validation

### Overview
Implement comprehensive validation for payment references. Validation ensures references follow the correct format, are unique in the database, and belong to valid orders. This prevents duplicate references and ensures data integrity.

### Dependencies
- Task 29: Create Reference Generator
- Task 30: Create Reference Format

### Instructions

1. **Create validate_reference function**
   - Accept reference string as parameter
   - Return tuple: (is_valid: bool, error_message: str)
   - Perform multiple validation checks

2. **Implement format validation**
   - Use REFERENCE_PATTERN to check format
   - Return False if format doesn't match
   - Provide clear error message describing issue

3. **Implement uniqueness validation**
   - Query BankTransferPayment model with reference
   - Check if reference already exists in database
   - Allow validation to skip uniqueness check (optional parameter)

4. **Implement order ID extraction and validation**
   - Parse order_id from reference using parse_reference
   - Verify order exists in database
   - Check order is in valid state for payment

5. **Create validation error messages**
   - Define clear, actionable error messages
   - Include format examples in messages
   - Specify which validation check failed

6. **Add validation to payment creation**
   - Integrate validation into BankTransferProcessor
   - Call validate_reference before creating payment
   - Raise exception if validation fails

7. **Create validation tests**
   - Test valid references pass validation
   - Test invalid formats fail appropriately
   - Test duplicate detection works correctly

### Validation Flow

```
┌─────────────────────────────┐
│  validate_reference(ref)    │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Check Format               │
│  Pattern: ^ORD-\d+-[A-Z0-9]{4}$ │
└──────────┬──────────────────┘
           │
       Valid? ───No──→ Return (False, "Invalid format")
           │
          Yes
           │
           ▼
┌─────────────────────────────┐
│  Parse Order ID             │
│  Extract from reference     │
└──────────┬──────────────────┘
           │
           ▼
┌─────────────────────────────┐
│  Check Order Exists         │
│  Query Order model          │
└──────────┬──────────────────┘
           │
      Exists? ───No──→ Return (False, "Order not found")
           │
          Yes
           │
           ▼
┌─────────────────────────────┐
│  Check Uniqueness           │
│  Query BankTransferPayment  │
└──────────┬──────────────────┘
           │
     Unique? ───No──→ Return (False, "Reference exists")
           │
          Yes
           │
           ▼
      Return (True, "")
```

### Validation Checks

| Check | Description | Error Message |
|-------|-------------|---------------|
| Format | Matches regex pattern | "Reference format invalid. Expected: ORD-{id}-{code}" |
| Order Exists | Order ID exists in database | "Order #{order_id} not found" |
| Uniqueness | Reference not used before | "Reference already exists in system" |
| Order State | Order allows payment | "Order #{order_id} cannot accept payments" |

### Validation Function Signature

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| reference | str | Required | Reference to validate |
| check_unique | bool | True | Whether to check uniqueness |
| check_order | bool | True | Whether to validate order exists |

### Return Values

| Return | Type | Description |
|--------|------|-------------|
| is_valid | bool | True if all checks pass |
| error_message | str | Empty if valid, error details if invalid |

### Expected Outcome
- Comprehensive validation function checking format, uniqueness, and order
- Clear error messages for each validation failure
- Integration with BankTransferProcessor
- Validation prevents duplicate or malformed references

### Verification Checklist
- [ ] validate_reference function created
- [ ] Format validation using REFERENCE_PATTERN
- [ ] Uniqueness check queries BankTransferPayment
- [ ] Order existence validation queries Order model
- [ ] Function returns (bool, str) tuple
- [ ] Error messages are clear and actionable
- [ ] Validation integrated into payment creation flow
- [ ] Optional parameters allow skipping certain checks

---

## Task 32: Create Payment Instructions

### Overview
Create a comprehensive payment instructions system that generates clear, complete instructions for customers to complete their bank transfer. Instructions include all active bank accounts, the payment reference, exact amount, and deadline. The system must support customization and multiple languages.

### Dependencies
- Task 28: Verify Bank Transfer Processor (Group B)
- Task 29: Create Reference Generator
- Task 08: Create Bank Account API (Group A)

### Instructions

1. **Create instructions.py module**
   - Navigate to `backend/apps/payments/processors/bank_transfer/`
   - Create new file named `instructions.py`
   - This module handles instruction generation

2. **Import required dependencies**
   - Import BankAccount, Order, BankTransferPayment models
   - Import timezone utilities for deadline formatting
   - Import Decimal for amount calculations
   - Import gettext for internationalization

3. **Create generate_instructions function**
   - Accept payment object as parameter
   - Retrieve all active bank accounts for tenant
   - Format all instruction components
   - Return structured instructions dictionary

4. **Fetch active bank accounts**
   - Query BankAccount model filtered by tenant
   - Filter for is_active=True
   - Order by display_order or bank name
   - Include all account details

5. **Format instruction components**
   - Create bank details section (all accounts)
   - Format payment reference prominently
   - Format amount with currency symbol
   - Format deadline with timezone

6. **Create instruction template structure**
   - Define dictionary with sections
   - Include: header, bank_accounts, reference, amount, deadline
   - Add important_notes section
   - Include contact_info for support

7. **Add template customization support**
   - Check for custom template in PaymentInstructionTemplate model
   - Allow tenant-specific instruction customization
   - Fall back to default template if none exists

8. **Implement multi-language support**
   - Support English (en), Sinhala (si), Tamil (ta)
   - Use gettext for translatable strings
   - Allow language parameter in function call

### Instruction Generation Flow

```
┌──────────────────────────────────────┐
│  generate_instructions(payment)      │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Fetch Active Bank Accounts          │
│  tenant.bank_accounts.filter(        │
│    is_active=True                    │
│  )                                   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Check Custom Template               │
│  PaymentInstructionTemplate          │
│  .objects.filter(tenant=...)         │
└────────────┬─────────────────────────┘
             │
        ┌────┴────┐
        │         │
    Found?       No
        │         │
       Yes        │
        │         ▼
        │    Use Default
        │     Template
        │         │
        └────┬────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Format Instruction Components       │
│  - Bank details (all accounts)       │
│  - Reference                         │
│  - Amount (with LKR symbol)          │
│  - Deadline (with timezone)          │
│  - Important notes                   │
└────────────┬─────────────────────────┘
             │
             ▼
┌──────────────────────────────────────┐
│  Return Instructions Dictionary      │
└──────────────────────────────────────┘
```

### Instructions Dictionary Structure

| Section | Type | Description | Example |
|---------|------|-------------|---------|
| header | str | Title and greeting | "Payment Instructions for Order #12345" |
| bank_accounts | list | All active accounts | [{bank, account, name, branch}, ...] |
| reference | str | Payment reference | "ORD-12345-A7B3" |
| amount | dict | Amount details | {value: 5000.00, currency: "LKR", formatted: "₨ 5,000.00"} |
| deadline | dict | Payment deadline | {datetime: "...", formatted: "31/01/2026 18:00", timezone: "Asia/Colombo"} |
| important_notes | list | Key instructions | ["Include reference", "Pay exact amount"] |
| contact_info | dict | Support details | {email: "...", phone: "..."} |

### Bank Account Details Format

| Field | Description | Example |
|-------|-------------|---------|
| bank_name | Name of bank | "Commercial Bank of Ceylon" |
| account_number | Account number | "1234567890" |
| account_holder_name | Account name | "LankaCommerce Cloud (Pvt) Ltd" |
| branch_name | Branch location | "Colombo 03 Branch" |
| swift_code | SWIFT/BIC code | "CCEYLKLX" |

### Important Notes Content

| Note | Description |
|------|-------------|
| Reference | "You MUST include the payment reference in your transfer" |
| Amount | "Pay the exact amount shown. Do not round up or down." |
| Deadline | "Payment must be completed before the deadline" |
| Proof | "After payment, upload proof via the provided link" |
| Contact | "Contact support if you have any questions" |

### Expected Outcome
- Comprehensive instruction generation function
- Structured dictionary containing all payment details
- Support for multiple active bank accounts
- Template customization capability
- Multi-language support foundation

### Verification Checklist
- [ ] `instructions.py` file created
- [ ] generate_instructions function implemented
- [ ] Function fetches all active bank accounts
- [ ] Instruction dictionary includes all sections
- [ ] Amount formatted with LKR currency
- [ ] Deadline formatted with Asia/Colombo timezone
- [ ] Support for custom templates checked
- [ ] Important notes section included
- [ ] Contact information included
- [ ] Function returns complete dictionary

---

## Task 33: Create Instructions Model

### Overview
Create a database model to store customizable payment instruction templates. This allows tenants to customize their payment instructions with their own messaging, branding, and specific requirements while maintaining the core structure.

### Dependencies
- Task 32: Create Payment Instructions

### Instructions

1. **Navigate to models directory**
   - Go to `backend/apps/payments/models/`
   - Open or create `instruction_templates.py`

2. **Import required dependencies**
   - Import Django model fields and validators
   - Import TenantAwareModel from core.models.mixins
   - Import LANGUAGE_CHOICES constant

3. **Create PaymentInstructionTemplate model**
   - Inherit from TenantAwareModel for multi-tenancy
   - Include tenant foreign key (handled by mixin)
   - Add fields for template customization

4. **Define core fields**
   - template_name: CharField for template identifier
   - language: CharField with choices (en, si, ta)
   - is_active: BooleanField for enabling/disabling
   - is_default: BooleanField for default template

5. **Define content fields**
   - header_text: CharField for custom header
   - instruction_text: TextField for main instructions
   - important_notes: TextField for custom notes (one per line)
   - footer_text: CharField for custom footer

6. **Define optional customization fields**
   - show_all_bank_accounts: BooleanField (default True)
   - preferred_bank_account: ForeignKey to BankAccount (optional)
   - custom_support_email: EmailField (optional)
   - custom_support_phone: CharField (optional)

7. **Add metadata fields**
   - created_at: DateTimeField (auto_now_add)
   - updated_at: DateTimeField (auto_now)
   - created_by: ForeignKey to User

8. **Define model Meta**
   - Set ordering by language and template_name
   - Add unique_together for (tenant, language, is_default)
   - Set verbose_name and verbose_name_plural

9. **Implement model methods**
   - __str__ method returning template_name and language
   - get_instruction_content method to render template
   - clean method to validate only one default per language

10. **Create model manager**
    - Add custom manager for active templates
    - Method to get default template for language
    - Method to get all active templates for tenant

11. **Add to __init__.py**
    - Import model in `apps/payments/models/__init__.py`
    - Make model available for imports

### Model Schema

```
PaymentInstructionTemplate
├── id (PK, UUID)
├── tenant (FK to Tenant)
├── template_name (CharField, max_length=100)
├── language (CharField, choices, max_length=5)
├── is_active (BooleanField, default=True)
├── is_default (BooleanField, default=False)
├── header_text (CharField, max_length=200)
├── instruction_text (TextField)
├── important_notes (TextField)
├── footer_text (CharField, max_length=200)
├── show_all_bank_accounts (BooleanField, default=True)
├── preferred_bank_account (FK to BankAccount, null=True)
├── custom_support_email (EmailField, blank=True)
├── custom_support_phone (CharField, max_length=20, blank=True)
├── created_at (DateTimeField)
├── updated_at (DateTimeField)
└── created_by (FK to User)
```

### Field Specifications

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| template_name | CharField(100) | Required | Template identifier |
| language | CharField(5) | Choices: en, si, ta | Template language |
| is_active | BooleanField | Default: True | Enable/disable template |
| is_default | BooleanField | Default: False | Default for language |
| header_text | CharField(200) | Required | Custom header message |
| instruction_text | TextField | Required | Main instruction content |
| important_notes | TextField | Required | Important notes (line-separated) |
| footer_text | CharField(200) | Optional | Custom footer message |

### Language Choices

| Code | Language | Display Name |
|------|----------|--------------|
| en | English | English |
| si | Sinhala | සිංහල |
| ta | Tamil | தமிழ் |

### Model Methods

| Method | Description | Returns |
|--------|-------------|---------|
| __str__() | String representation | "{template_name} ({language})" |
| get_instruction_content() | Render full template | Formatted string |
| clean() | Validate uniqueness | None (raises ValidationError) |

### Manager Methods

| Method | Description | Parameters | Returns |
|--------|-------------|------------|---------|
| active() | Get active templates | tenant | QuerySet |
| get_default() | Get default template | tenant, language | Model instance or None |
| get_for_language() | Get all for language | tenant, language | QuerySet |

### Expected Outcome
- PaymentInstructionTemplate model created
- Full support for customization fields
- Multi-language support (en, si, ta)
- Validation ensures one default per language
- Custom manager for common queries

### Verification Checklist
- [ ] Model created in `instruction_templates.py`
- [ ] Inherits from TenantAwareModel
- [ ] All core fields defined with correct types
- [ ] Language choices defined (en, si, ta)
- [ ] is_default field with validation
- [ ] Optional customization fields included
- [ ] Model Meta configured (ordering, unique_together)
- [ ] __str__ method returns template_name and language
- [ ] clean() method validates one default per language
- [ ] Custom manager with active() and get_default() methods
- [ ] Model imported in __init__.py
- [ ] Migration created and applied

---

## Task 34: Create Bank Details Display

### Overview
Create a user-friendly bank details display component that presents all active bank accounts in a clear, organized format. The display must be easy to read, copy-friendly, and include all necessary information for customers to complete their bank transfer.

### Dependencies
- Task 32: Create Payment Instructions
- Task 08: Create Bank Account API (Group A)

### Instructions

1. **Define display format specification**
   - Determine layout for single vs multiple accounts
   - Define field order and labeling
   - Specify formatting for each field

2. **Create format_bank_details function**
   - Location: `backend/apps/payments/processors/bank_transfer/instructions.py`
   - Accept list of BankAccount objects
   - Return formatted string or dictionary

3. **Format individual bank account**
   - Create format_single_bank function
   - Include all required fields
   - Use consistent formatting

4. **Define field labels**
   - Bank Name: "Bank"
   - Account Number: "Account Number"
   - Account Holder: "Account Name"
   - Branch: "Branch"
   - SWIFT Code: "SWIFT/BIC" (if available)

5. **Format for display**
   - Use clear separators between accounts
   - Align field names and values
   - Add spacing for readability

6. **Create HTML display format**
   - Create format_bank_details_html function
   - Use HTML tags for structure
   - Include copy-friendly formatting

7. **Create plain text format**
   - Create format_bank_details_text function
   - Use plain text with clear formatting
   - Suitable for SMS and simple displays

### Bank Details Display Format

```
Plain Text Format:

─────────────────────────────────────────
Bank Account 1:
─────────────────────────────────────────
Bank:              Commercial Bank of Ceylon
Account Number:    1234567890
Account Name:      LankaCommerce Cloud (Pvt) Ltd
Branch:            Colombo 03 Branch
SWIFT/BIC:         CCEYLKLX

─────────────────────────────────────────
Bank Account 2:
─────────────────────────────────────────
Bank:              Sampath Bank PLC
Account Number:    9876543210
Account Name:      LankaCommerce Cloud (Pvt) Ltd
Branch:            Nugegoda Branch
SWIFT/BIC:         BSAMLKLX
```

### Display Functions

| Function | Purpose | Output Format |
|----------|---------|---------------|
| format_bank_details | Main formatter | Returns dict with both formats |
| format_single_bank | Format one account | Dict with account details |
| format_bank_details_html | HTML display | HTML string with tags |
| format_bank_details_text | Plain text | Plain text string |

### Field Formatting Rules

| Field | Format | Example |
|-------|--------|---------|
| Bank Name | Full name, no abbreviation | "Commercial Bank of Ceylon" |
| Account Number | No spaces or formatting | "1234567890" |
| Account Holder | Full legal name | "LankaCommerce Cloud (Pvt) Ltd" |
| Branch | Branch name with location | "Colombo 03 Branch" |
| SWIFT Code | Uppercase, no spaces | "CCEYLKLX" |

### HTML Display Structure

```html
<div class="bank-accounts">
  <div class="bank-account">
    <h4>Bank Account 1</h4>
    <table class="bank-details">
      <tr>
        <td class="label">Bank:</td>
        <td class="value">Commercial Bank of Ceylon</td>
      </tr>
      <tr>
        <td class="label">Account Number:</td>
        <td class="value">1234567890</td>
      </tr>
      <!-- More rows -->
    </table>
  </div>
</div>
```

### Display for Multiple Accounts

| Scenario | Display Approach |
|----------|------------------|
| 1 Account | Single account with all details |
| 2-3 Accounts | All accounts displayed in sequence |
| 4+ Accounts | All displayed with numbered sections |
| Preferred Account | Highlighted or shown first |

### Expected Outcome
- Functions to format bank details in multiple formats
- Clear, organized display of all account information
- Support for single and multiple accounts
- Both HTML and plain text formats available

### Verification Checklist
- [ ] format_bank_details function created
- [ ] format_single_bank helper function created
- [ ] Plain text formatting implemented
- [ ] HTML formatting implemented
- [ ] All required fields included in display
- [ ] Multiple accounts handled correctly
- [ ] Field labels are clear and consistent
- [ ] Formatting is copy-friendly
- [ ] SWIFT code shown when available
- [ ] Functions return structured data

---

## Task 35: Create Amount Display

### Overview
Create amount display formatting specifically for Sri Lankan Rupees (LKR). The display must show the currency symbol, proper thousands separators, and decimal places. Amount must be prominently displayed and easy to read to avoid payment errors.

### Dependencies
- Task 32: Create Payment Instructions

### Instructions

1. **Create format_amount function**
   - Location: `backend/apps/payments/processors/bank_transfer/instructions.py`
   - Accept Decimal amount as parameter
   - Accept optional currency parameter (default: "LKR")
   - Return formatted amount string

2. **Import formatting utilities**
   - Import locale for number formatting
   - Import Decimal from decimal module
   - Import currency symbol constants

3. **Define LKR currency symbol**
   - Use "₨" as primary symbol
   - Use "LKR" as fallback text
   - Define constant: CURRENCY_SYMBOL_LKR = "₨"

4. **Implement thousands separator**
   - Use comma (,) as thousands separator
   - Format: 1,000.00 or 10,000.00 or 100,000.00
   - Ensure proper grouping for all amounts

5. **Format decimal places**
   - Always show 2 decimal places
   - Round to 2 decimal places if necessary
   - Use period (.) as decimal separator

6. **Create display formats**
   - Symbol format: "₨ 5,000.00"
   - Code format: "5,000.00 LKR"
   - Full format: "₨ 5,000.00 (LKR)"

7. **Handle edge cases**
   - Zero amount: "₨ 0.00"
   - Very large amounts: proper formatting with all commas
   - Negative amounts: "-₨ 1,000.00" (if ever needed)

8. **Create amount context dictionary**
   - Create get_amount_context function
   - Return dict with value, currency, formatted, symbol
   - Include both display formats

### Amount Formatting Examples

| Amount (Decimal) | Formatted Output | Notes |
|------------------|------------------|-------|
| 1500.00 | ₨ 1,500.00 | Basic format |
| 15000.00 | ₨ 15,000.00 | Thousands separator |
| 150000.00 | ₨ 150,000.00 | Hundred thousands |
| 1500000.00 | ₨ 1,500,000.00 | Million |
| 99.50 | ₨ 99.50 | Less than 1000 |
| 0.00 | ₨ 0.00 | Zero |

### Format Function Signature

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| amount | Decimal | Required | Amount to format |
| currency | str | "LKR" | Currency code |
| include_symbol | bool | True | Show currency symbol |
| include_code | bool | False | Show currency code |

### Amount Context Dictionary

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| value | Decimal | 5000.00 | Raw numeric value |
| currency | str | "LKR" | Currency code |
| symbol | str | "₨" | Currency symbol |
| formatted | str | "₨ 5,000.00" | Formatted display |
| formatted_code | str | "5,000.00 LKR" | Code format |
| formatted_full | str | "₨ 5,000.00 (LKR)" | Full format |

### Display Variations

| Context | Format to Use | Example |
|---------|---------------|---------|
| Payment Instructions | Symbol format | "₨ 5,000.00" |
| Email Subject | Code format | "5,000.00 LKR" |
| SMS | Symbol only | "₨5,000.00" (no space) |
| Receipt | Full format | "₨ 5,000.00 (LKR)" |

### Formatting Rules

| Rule | Description |
|------|-------------|
| Thousands | Comma separator every 3 digits from right |
| Decimals | Always 2 decimal places, use period |
| Symbol | Space between symbol and amount |
| Rounding | Round to 2 decimals using ROUND_HALF_UP |
| Negative | Minus sign before symbol |

### Expected Outcome
- format_amount function with multiple format options
- Proper LKR symbol usage (₨)
- Thousands separators for readability
- Always 2 decimal places
- Context dictionary with all format variations

### Verification Checklist
- [ ] format_amount function created
- [ ] LKR symbol constant defined (₨)
- [ ] Thousands separator (comma) implemented correctly
- [ ] Always shows 2 decimal places
- [ ] get_amount_context returns complete dictionary
- [ ] Handles zero and very large amounts
- [ ] Symbol format: "₨ 5,000.00"
- [ ] Code format: "5,000.00 LKR"
- [ ] Full format: "₨ 5,000.00 (LKR)"
- [ ] Proper spacing between symbol and amount

---

## Task 36: Create Expiry Display

### Overview
Create expiry deadline display formatting with proper timezone handling for Sri Lanka (Asia/Colombo). The display must clearly show when payment must be completed, including date, time, and timezone information to avoid confusion.

### Dependencies
- Task 32: Create Payment Instructions

### Instructions

1. **Create format_expiry function**
   - Location: `backend/apps/payments/processors/bank_transfer/instructions.py`
   - Accept datetime object as parameter
   - Accept optional timezone parameter (default: "Asia/Colombo")
   - Return formatted deadline string

2. **Import timezone utilities**
   - Import timezone from django.utils
   - Import pytz for timezone handling
   - Import datetime formatting utilities

3. **Define Sri Lanka timezone constant**
   - Define TIMEZONE_SL = "Asia/Colombo"
   - Use this as default timezone

4. **Convert to local timezone**
   - Convert UTC datetime to Asia/Colombo
   - Use pytz.timezone for conversion
   - Handle timezone-aware and naive datetimes

5. **Format date and time**
   - Date format: DD/MM/YYYY
   - Time format: HH:MM (24-hour)
   - Combined: "DD/MM/YYYY HH:MM"

6. **Create display formats**
   - Short format: "31/01/2026 18:00"
   - Long format: "31st January 2026 at 6:00 PM"
   - Full format: "31/01/2026 18:00 (Asia/Colombo)"

7. **Add urgency indicator**
   - Calculate time remaining
   - Add urgency level (high/medium/low)
   - Return urgency message if needed

8. **Create expiry context dictionary**
   - Create get_expiry_context function
   - Return dict with datetime, formatted strings, urgency
   - Include countdown information

### Expiry Formatting Examples

| Datetime | Short Format | Long Format |
|----------|--------------|-------------|
| 2026-01-31 18:00:00+05:30 | 31/01/2026 18:00 | 31st January 2026 at 6:00 PM |
| 2026-02-15 09:30:00+05:30 | 15/02/2026 09:30 | 15th February 2026 at 9:30 AM |
| 2026-12-25 23:59:00+05:30 | 25/12/2026 23:59 | 25th December 2026 at 11:59 PM |

### Format Function Signature

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| expiry_datetime | datetime | Required | Expiry deadline |
| timezone_str | str | "Asia/Colombo" | Target timezone |
| format_type | str | "short" | Format: short/long/full |

### Expiry Context Dictionary

| Key | Type | Example | Description |
|-----|------|---------|-------------|
| datetime | datetime | 2026-01-31 18:00+05:30 | Original datetime |
| date | str | "31/01/2026" | Date only |
| time | str | "18:00" | Time only |
| formatted_short | str | "31/01/2026 18:00" | Short format |
| formatted_long | str | "31st January 2026 at 6:00 PM" | Long format |
| timezone | str | "Asia/Colombo" | Timezone name |
| time_remaining | timedelta | 24:00:00 | Time until expiry |
| hours_remaining | int | 24 | Hours until expiry |
| urgency | str | "high" | Urgency level |
| urgency_message | str | "Payment expires in 6 hours!" | Alert message |

### Urgency Levels

| Time Remaining | Urgency Level | Message |
|----------------|---------------|---------|
| > 24 hours | low | "Pay before: {deadline}" |
| 6-24 hours | medium | "Payment expires in {hours} hours" |
| < 6 hours | high | "URGENT: Payment expires in {hours} hours!" |
| < 1 hour | critical | "CRITICAL: Payment expires in {minutes} minutes!" |

### Display Formats for Different Contexts

| Context | Format to Use | Example |
|---------|---------------|---------|
| Instructions | Short with label | "Pay before: 31/01/2026 18:00" |
| Email | Long format | "31st January 2026 at 6:00 PM" |
| SMS | Date only | "Pay by 31/01/2026" |
| Reminder | Urgency message | "URGENT: Payment expires in 6 hours!" |

### Timezone Handling

| Input Timezone | Processing | Output |
|----------------|------------|--------|
| UTC | Convert to Asia/Colombo | Localized datetime |
| Naive | Assume UTC, then convert | Localized datetime |
| Asia/Colombo | No conversion needed | As provided |

### Expected Outcome
- format_expiry function with multiple format options
- Proper timezone conversion to Asia/Colombo
- Multiple display formats (short, long, full)
- Urgency calculation and messaging
- Complete context dictionary with all variations

### Verification Checklist
- [ ] format_expiry function created
- [ ] Asia/Colombo timezone constant defined
- [ ] Timezone conversion handles UTC to local
- [ ] Short format: DD/MM/YYYY HH:MM
- [ ] Long format with ordinal and AM/PM
- [ ] get_expiry_context returns complete dictionary
- [ ] Time remaining calculated correctly
- [ ] Urgency levels implemented (low/medium/high/critical)
- [ ] Urgency messages appropriate for each level
- [ ] Handles timezone-aware and naive datetimes

---

## Task 37: Create Copy to Clipboard

### Overview
Create copy-to-clipboard functionality that allows customers to easily copy payment details. This includes bank account numbers, payment reference, and complete payment instructions. The feature must work across different platforms and provide user feedback.

### Dependencies
- Task 34: Create Bank Details Display
- Task 35: Create Amount Display
- Task 36: Create Expiry Display

### Instructions

1. **Create copyable text format**
   - Define function to generate copy-friendly text
   - Include all essential payment details
   - Format for plain text pasting

2. **Format payment details for copy**
   - Create format_for_clipboard function
   - Location: `backend/apps/payments/processors/bank_transfer/instructions.py`
   - Accept payment object as parameter
   - Return formatted string ready to copy

3. **Structure copyable content**
   - Order reference at top (most important)
   - Amount clearly displayed
   - Bank account details (first or preferred)
   - Deadline at bottom
   - Add separators for readability

4. **Create individual copy functions**
   - format_reference_copy: Just the reference
   - format_amount_copy: Just the amount
   - format_account_copy: Just one bank account
   - format_full_instructions_copy: Complete instructions

5. **Add labels for clarity**
   - Each field should have clear label
   - Use "REFERENCE:", "AMOUNT:", "DEADLINE:", etc.
   - Labels in uppercase for emphasis

6. **Format for different contexts**
   - SMS copy format (shorter, essential only)
   - Email copy format (complete details)
   - Quick copy format (reference + amount only)

7. **Create copy endpoint (optional)**
   - API endpoint to generate copyable text
   - Return text ready for clipboard
   - Include different format options

### Copyable Text Format

```
PAYMENT REFERENCE: ORD-12345-A7B3

AMOUNT: ₨ 5,000.00

BANK DETAILS:
Bank: Commercial Bank of Ceylon
Account: 1234567890
Name: LankaCommerce Cloud (Pvt) Ltd
Branch: Colombo 03 Branch

PAY BEFORE: 31/01/2026 18:00

IMPORTANT: Include the reference in your transfer!
```

### Copy Functions

| Function | Returns | Use Case |
|----------|---------|----------|
| format_reference_copy | "ORD-12345-A7B3" | Copy reference only |
| format_amount_copy | "₨ 5,000.00" | Copy amount only |
| format_account_copy | Bank details block | Copy one account |
| format_full_instructions_copy | Complete instructions | Copy everything |
| format_sms_copy | Condensed version | Share via SMS |

### Copy Format Specifications

| Format Type | Length | Includes |
|-------------|--------|----------|
| Reference Only | ~20 chars | Reference code |
| Amount Only | ~15 chars | Formatted amount |
| Quick Copy | ~100 chars | Reference + Amount + Bank |
| Full Copy | ~300 chars | All details |
| SMS Copy | ~150 chars | Essential details only |

### SMS Copy Format

```
Pay ₨5,000.00
Ref: ORD-12345-A7B3
Bank: Commercial Bank
Acc: 1234567890
By: 31/01/2026 18:00
```

### Quick Copy Format

```
REF: ORD-12345-A7B3
AMOUNT: ₨ 5,000.00
ACCOUNT: 1234567890 (Commercial Bank)
```

### Full Instructions Copy Format

```
═══════════════════════════════════
PAYMENT INSTRUCTIONS - Order #12345
═══════════════════════════════════

PAYMENT REFERENCE: ORD-12345-A7B3
** Include this reference in your transfer! **

AMOUNT TO PAY: ₨ 5,000.00

BANK ACCOUNT DETAILS:
─────────────────────────────────
Bank Name:        Commercial Bank of Ceylon
Account Number:   1234567890
Account Holder:   LankaCommerce Cloud (Pvt) Ltd
Branch:           Colombo 03 Branch
─────────────────────────────────

DEADLINE: 31/01/2026 18:00 (Asia/Colombo)

IMPORTANT NOTES:
✓ Pay exact amount shown
✓ Include payment reference
✓ Upload proof after payment
✓ Contact support if needed
```

### Copy Function Return Structure

| Function | Returns Type | Structure |
|----------|--------------|-----------|
| format_reference_copy | str | Plain text reference |
| format_amount_copy | str | Formatted amount |
| format_account_copy | str | Multi-line bank details |
| format_full_instructions_copy | str | Complete formatted block |
| format_sms_copy | str | Compact format |

### Expected Outcome
- Functions to generate copyable text in various formats
- Clear formatting with labels and separators
- Multiple format options for different use cases
- Plain text optimized for clipboard operations
- SMS-friendly compact format

### Verification Checklist
- [ ] format_for_clipboard main function created
- [ ] format_reference_copy returns plain reference
- [ ] format_amount_copy returns formatted amount
- [ ] format_account_copy returns bank details block
- [ ] format_full_instructions_copy returns complete text
- [ ] format_sms_copy returns compact format
- [ ] All formats use clear labels (uppercase)
- [ ] Separators used for readability
- [ ] Reference prominently displayed at top
- [ ] Important notes included in full format
- [ ] All text is plain (no HTML or special formatting)

---

## Summary

This document covered the creation of payment reference generation and display systems for bank transfer payments. The implementation includes:

1. **Reference Generation (Tasks 29-31):** Unique reference generator with format ORD-{order_id}-{random}, validation, and collision detection
2. **Payment Instructions (Tasks 32-33):** Comprehensive instruction system with customizable templates supporting multiple languages
3. **Display Formatting (Tasks 34-36):** User-friendly displays for bank details, amounts (LKR), and expiry deadlines with timezone support
4. **Copy Functionality (Task 37):** Multiple copy-to-clipboard formats for easy sharing

All components work together to provide a complete, user-friendly payment instruction system that guides customers through the bank transfer process while maintaining data integrity and flexibility for tenant customization.

### Next Steps
Proceed to [02_Tasks-38-44_Channels-Reminder-Verify.md](02_Tasks-38-44_Channels-Reminder-Verify.md) to implement multi-channel delivery (email, WhatsApp, SMS) and automated payment reminders.
