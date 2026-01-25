# Tasks 63-66: Validators and Archive

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** D - Account Management Features  
> **Document:** 04 of 04  
> **Tasks Covered:** 63, 64, 65, 66

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-59-62_Balance-Service.md](03_Tasks-59-62_Balance-Service.md)
- **→ Next Group:** [Group-E_Admin-Serializers](../Group-E_Admin-Serializers/)

---

## Document Overview

This document covers the implementation of account validation logic and archive functionality. The AccountValidator class enforces business rules including account code range validation, deletion prevention for accounts with transactions, and soft archival. These features ensure data integrity, prevent accidental deletion of important financial data, and support compliance requirements.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 63 | Create Account Validator | Medium | 45 min |
| 64 | Add Code Range Validation | Low | 30 min |
| 65 | Add Deletion Validation | Medium | 40 min |
| 66 | Add Archive Functionality | Low | 30 min |

---

## Task 63: Create Account Validator

### Overview
Create the AccountValidator class to centralize all account validation logic and business rules. This validator ensures account data integrity through code format validation, uniqueness checks, hierarchy validation, and business rule enforcement. It separates validation logic from models and views, providing reusable validation across the application.

### Dependencies
- Account model with all fields
- Account type constants defined
- Code range mappings established (Group-A)
- Multi-tenancy infrastructure

### Instructions

1. **Create validators file**
   - Navigate to `apps/accounting/services/` directory
   - Create file `validators.py`
   - This will contain validation classes and functions

2. **Import required dependencies**
   - Import Account model
   - Import Django validators (ValidationError)
   - Import account type constants
   - Import code range constants
   - Import regular expressions (re)
   - Import logging

3. **Define AccountValidator class**
   - Create class with comprehensive docstring
   - Explain validator purpose and validation rules
   - Document validation methods
   - Note when to use each validator

4. **Add class-level configuration**
   - Define code format regex patterns
   - Define account type to code range mappings
   - Define validation error messages
   - Set logging configuration

5. **Create constructor method**
   - Accept tenant parameter
   - Optional: Accept account instance for validation
   - Store tenant reference
   - Initialize logger

6. **Add tenant validation**
   - Create _validate_tenant() private method
   - Check tenant exists
   - Check tenant is active
   - Raise ValidationError if invalid

7. **Add code format validation**
   - Create validate_code_format() method
   - Check code is numeric
   - Check code length (typically 4 digits)
   - Check code is positive integer
   - Raise ValidationError with specific message

8. **Add code uniqueness validation**
   - Create validate_code_unique() method
   - Check if code already exists for tenant
   - Exclude current account if updating
   - Consider parent context if needed
   - Raise ValidationError if duplicate

9. **Add account type validation**
   - Create validate_account_type() method
   - Check account_type is in valid choices
   - Verify account_type constant exists
   - Raise ValidationError for invalid type

10. **Add parent validation**
    - Create validate_parent() method
    - Check parent exists if specified
    - Verify parent belongs to same tenant
    - Check parent has is_group=True
    - Prevent parent = self (circular reference)
    - Raise ValidationError for invalid parent

11. **Add hierarchy depth validation**
    - Create validate_hierarchy_depth() method
    - Calculate depth from root
    - Check against maximum depth (e.g., 5 levels)
    - Prevent excessively deep hierarchies
    - Raise ValidationError if too deep

12. **Add system account protection**
    - Create validate_system_account() method
    - Check if account is system account
    - Prevent modification of critical fields
    - Prevent deletion
    - Allow only balance updates

13. **Add posting validation**
    - Create validate_posting() method
    - If is_group=True, verify allow_direct_posting=False
    - If allow_direct_posting=False, check no journal entries
    - Enforce posting rules
    - Raise ValidationError for violations

14. **Add bulk validation method**
    - Create validate_account() method
    - Run all applicable validations
    - Collect all validation errors
    - Return list of errors or raise ValidationError
    - Used during account save

15. **Add validation error formatting**
    - Create _format_error() method
    - Generate user-friendly error messages
    - Include field names and invalid values
    - Provide suggestions for correction
    - Return formatted string

16. **Add logging for validations**
    - Log validation attempts at DEBUG level
    - Log validation failures at WARNING level
    - Include account code and validation type
    - Aid troubleshooting

17. **Import validator in package**
    - Open `services/__init__.py`
    - Import AccountValidator
    - Export in __all__ list

### Validator Class Structure

```
AccountValidator
├── __init__(tenant, account=None)
│   ├── Store tenant reference
│   ├── Store account if provided
│   ├── Initialize logger
│   └── Validate tenant
├── Public Validation Methods
│   ├── validate_code_format(code)
│   ├── validate_code_unique(code, exclude_id)
│   ├── validate_code_range(code, account_type) - Task 64
│   ├── validate_account_type(account_type)
│   ├── validate_parent(parent_id, account_id)
│   ├── validate_hierarchy_depth(account)
│   ├── validate_system_account(account)
│   ├── validate_posting(account)
│   ├── validate_can_delete(account_id) - Task 65
│   └── validate_account(account)
└── Private Helper Methods
    ├── _validate_tenant()
    ├── _format_error(field, message)
    └── _check_circular_reference(account, parent)
```

### Validation Rules Summary

| Validation | Rule | Purpose |
|------------|------|---------|
| Code Format | Must be 4-digit number | Consistency |
| Code Uniqueness | Unique within tenant | Prevent duplicates |
| Code Range | Must fall within type's range | Organization |
| Account Type | Must be valid type constant | Data integrity |
| Parent Account | Must exist and be group account | Hierarchy integrity |
| Hierarchy Depth | Maximum 5 levels | Prevent complexity |
| System Account | Cannot delete/modify critical fields | Data protection |
| Posting Rules | Group accounts cannot have direct entries | Business logic |

### Code Format Validation

Account codes must follow standard format:

```
Valid Formats:
- 1000 (4 digits, numeric)
- 1100 (4 digits, numeric)
- 5230 (4 digits, numeric)

Invalid Formats:
- 100 (too short)
- 10000 (too long)
- ABC1 (contains letters)
- -1000 (negative)
- 1.100 (contains decimal)

Regex Pattern:
^[0-9]{4}$
```

### Code Uniqueness Validation

```
Uniqueness Check:
├── Query Account.objects
├── Filter by tenant
├── Filter by account_code
├── Exclude current account (if updating)
└── If exists: Raise ValidationError

Example Query:
existing = Account.objects.filter(
    tenant=tenant,
    account_code=code
).exclude(id=account_id).exists()

if existing:
    raise ValidationError(f"Account code {code} already exists")
```

### Parent Validation Flow

```
Validate Parent
         │
         ▼
  Parent ID Provided?
         │
         ├─ No ──→ Valid (root account)
         │
         ▼ (Yes)
  Parent Exists?
         │
         ├─ No ──→ ValidationError
         │
         ▼ (Yes)
  Parent Same Tenant?
         │
         ├─ No ──→ ValidationError
         │
         ▼ (Yes)
  Parent is_group=True?
         │
         ├─ No ──→ ValidationError
         │
         ▼ (Yes)
  Parent = Self?
         │
         ├─ Yes ──→ ValidationError (circular)
         │
         ▼ (No)
  Check Circular Reference
         │
         ├─ Circular ──→ ValidationError
         │
         ▼ (No circular)
  Valid Parent
```

### Hierarchy Depth Calculation

```
Calculate Depth:

Method 1: Recursive
def get_depth(account, depth=0):
    if account.parent_account is None:
        return depth
    return get_depth(account.parent_account, depth + 1)

Method 2: Iterative
depth = 0
current = account
while current.parent_account is not None:
    depth += 1
    current = current.parent_account
    if depth > MAX_DEPTH:
        raise ValidationError("Max hierarchy depth exceeded")
return depth

MAX_DEPTH = 5 (configurable)
```

### System Account Protection

System accounts have special rules:

```
System Account Restrictions:
├── Cannot be deleted
├── Cannot change account_type
├── Cannot change account_code
├── Cannot change is_system_account flag
├── Can update account_name (with caution)
├── Can update balance fields
└── Can update status (with restrictions)

Protected System Accounts:
- Cash accounts
- Primary bank account
- Accounts payable
- Retained earnings
- Current year profit/loss
- Default revenue/expense accounts
```

### Posting Rule Validation

```
Posting Rules:

Rule 1: Group Accounts
if account.is_group == True:
    - Must have allow_direct_posting = False
    - Cannot have journal entry lines
    - Balance comes from children only

Rule 2: Leaf Accounts
if account.is_group == False:
    - Can have allow_direct_posting = True or False
    - If False, no direct journal entries
    - Use for control accounts

Rule 3: Control Accounts
if account.allow_direct_posting == False:
    - Cannot post journal entries directly
    - Used for summary/reporting
    - Balance from children or system
```

### Circular Reference Detection

```
Circular Reference Check:

Scenario:
A → B → C → A (circular)

Detection:
visited = set()
current = account.parent_account

while current is not None:
    if current.id == account.id:
        raise ValidationError("Circular parent reference detected")
    if current.id in visited:
        raise ValidationError("Circular reference in hierarchy")
    visited.add(current.id)
    current = current.parent_account

Prevents infinite loops in hierarchy traversal
```

### Bulk Validation

```
validate_account(account) runs all checks:

1. validate_code_format(account.account_code)
2. validate_code_unique(account.account_code, account.id)
3. validate_code_range(account.account_code, account.account_type)
4. validate_account_type(account.account_type)
5. validate_parent(account.parent_account_id, account.id)
6. validate_hierarchy_depth(account)
7. validate_system_account(account) if is_system_account
8. validate_posting(account)

Collects all errors, raises ValidationError with all messages
Or returns success if all pass
```

### Error Message Formatting

```
User-Friendly Messages:

Instead of: "Invalid value"
Use: "Account code must be 4 digits (e.g., 1000)"

Instead of: "Constraint violation"
Use: "Account code 1100 already exists. Please choose a different code."

Instead of: "Foreign key error"
Use: "Parent account 1000 not found. Ensure the parent account exists."

Format: "[Field]: [Issue] ([Suggestion])"
```

### Expected Outcome
- AccountValidator class created
- Constructor accepts tenant and optional account
- Multiple validation methods implemented
- Code format validation functional
- Uniqueness validation working
- Parent and hierarchy validation in place
- System account protection enforced
- Posting rule validation implemented
- Comprehensive error messages
- Foundation for specific validators (Tasks 64-65)

### Verification Checklist
- [ ] `apps/accounting/services/validators.py` created
- [ ] AccountValidator class defined
- [ ] Class docstring explains validation rules
- [ ] Constructor accepts tenant parameter
- [ ] Optional account parameter supported
- [ ] _validate_tenant() method implemented
- [ ] validate_code_format() method created
- [ ] validate_code_unique() method implemented
- [ ] validate_account_type() method created
- [ ] validate_parent() method implemented
- [ ] validate_hierarchy_depth() method created
- [ ] validate_system_account() method implemented
- [ ] validate_posting() method created
- [ ] validate_account() bulk validation method
- [ ] Circular reference detection implemented
- [ ] Error message formatting implemented
- [ ] Logging configured
- [ ] Validator imported in `services/__init__.py`

---

## Task 64: Add Code Range Validation

### Overview
Implement the validate_code_range() method to ensure account codes fall within the defined range for their account type. This validation enforces the account code organization structure, where Assets use 1000-1999, Liabilities use 2000-2999, etc. It prevents mismatched codes and maintains consistent account categorization.

### Dependencies
- Task 63: AccountValidator class created
- Account type constants defined
- Code range mappings established (from Group-A)

### Instructions

1. **Open validators file**
   - Navigate to `apps/accounting/services/validators.py`
   - Locate AccountValidator class

2. **Define code range mappings**
   - Add class-level constant: CODE_RANGES
   - Map each account type to its code range
   - Use tuple format: (min_code, max_code)

3. **Map account types to ranges**
   - ASSET: (1000, 1999)
   - LIABILITY: (2000, 2999)
   - EQUITY: (3000, 3999)
   - REVENUE: (4000, 4999)
   - EXPENSE: (5000, 6999)

4. **Define validate_code_range method**
   - Add public method: validate_code_range(account_code, account_type)
   - Add comprehensive docstring
   - Document parameters, return value, exceptions

5. **Add method signature**
   - Accept account_code parameter (string or int)
   - Accept account_type parameter (string constant)
   - Return True if valid
   - Raise ValidationError if invalid

6. **Convert code to integer**
   - Convert account_code to integer
   - Handle non-numeric codes gracefully
   - Raise ValidationError for invalid format

7. **Validate account type**
   - Check account_type exists in CODE_RANGES
   - Raise ValidationError if unknown type
   - Message: "Unknown account type: {account_type}"

8. **Get code range for type**
   - Look up code range in CODE_RANGES
   - Extract min_code and max_code
   - Store for comparison

9. **Check code within range**
   - Verify: min_code <= account_code <= max_code
   - If outside range, prepare error message
   - If within range, return True

10. **Format validation error**
    - Create descriptive error message
    - Include: account code, account type, valid range
    - Example: "Account code 5000 invalid for type ASSET. ASSET accounts must be between 1000 and 1999."

11. **Raise ValidationError**
    - Raise ValidationError with formatted message
    - Include code and valid_range in error data
    - Allow caller to handle appropriately

12. **Log validation attempt**
    - Log at DEBUG level when called
    - Log validation result (pass/fail)
    - Include account_code, account_type, result

13. **Handle edge cases**
    - Code exactly at range boundaries (valid)
    - Code as string vs. integer (convert)
    - Null or empty code (raise error)
    - None account_type (raise error)

14. **Add helper method for range display**
    - Create _format_code_range(min, max) method
    - Return human-readable range
    - Example: "1000-1999" or "1000 to 1999"

15. **Integrate with bulk validation**
    - Ensure validate_account() calls validate_code_range()
    - Include in pre-save validation
    - Run during account creation and updates

### Method Flow Diagram

```
validate_code_range(account_code, account_type)
         │
         ▼
  Convert Code to Integer
         │
         ├─ Invalid Format ──→ ValidationError
         │
         ▼ (Valid)
  Validate Account Type
         │
         ├─ Unknown Type ──→ ValidationError
         │
         ▼ (Known)
  Get Code Range for Type
         │
         ▼
  Check: min_code <= code <= max_code
         │
         ├─ Out of Range ──→ Format Error Message
         │                   │
         │                   ▼
         │              Log Validation Failure
         │                   │
         │                   ▼
         │              Raise ValidationError
         │
         ▼ (In Range)
  Log Validation Success
         │
         ▼
  Return True
```

### Code Range Mapping

```
CODE_RANGES = {
    'ASSET': (1000, 1999),
    'LIABILITY': (2000, 2999),
    'EQUITY': (3000, 3999),
    'REVENUE': (4000, 4999),
    'EXPENSE': (5000, 6999),
}

Extended Expense Range:
EXPENSE uses 5000-6999 (2000 codes)
Accommodates both Operating (5000-5999) and Non-Operating (6000-6999) expenses
```

### Validation Examples

#### Valid Codes

| Code | Type | Range | Result |
|------|------|-------|--------|
| 1100 | ASSET | 1000-1999 | ✓ Valid |
| 2500 | LIABILITY | 2000-2999 | ✓ Valid |
| 3300 | EQUITY | 3000-3999 | ✓ Valid |
| 4100 | REVENUE | 4000-4999 | ✓ Valid |
| 5200 | EXPENSE | 5000-6999 | ✓ Valid |
| 6100 | EXPENSE | 5000-6999 | ✓ Valid |

#### Invalid Codes

| Code | Type | Range | Result | Reason |
|------|------|-------|--------|--------|
| 5000 | ASSET | 1000-1999 | ✗ Invalid | Outside range |
| 1500 | LIABILITY | 2000-2999 | ✗ Invalid | Wrong type range |
| 4500 | EXPENSE | 5000-6999 | ✗ Invalid | Revenue range, not expense |
| 7000 | EXPENSE | 5000-6999 | ✗ Invalid | Exceeds max |
| 999 | ASSET | 1000-1999 | ✗ Invalid | Below min |

### Error Messages

```
Example Error Messages:

1. Code Outside Range:
"Account code 5000 is invalid for ASSET type. ASSET accounts must be between 1000 and 1999."

2. Code Below Minimum:
"Account code 999 is below the minimum for ASSET accounts (1000)."

3. Code Above Maximum:
"Account code 7000 exceeds the maximum for EXPENSE accounts (6999)."

4. Unknown Account Type:
"Unknown account type: INVALID_TYPE. Valid types are: ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE."

5. Invalid Code Format:
"Account code 'ABC' is not a valid numeric code."
```

### Range Boundary Handling

```
Boundary Cases:

1. Minimum Boundary:
   Code: 1000, Type: ASSET, Range: 1000-1999
   Result: Valid (>= min_code)

2. Maximum Boundary:
   Code: 1999, Type: ASSET, Range: 1000-1999
   Result: Valid (<= max_code)

3. Just Below Minimum:
   Code: 999, Type: ASSET, Range: 1000-1999
   Result: Invalid

4. Just Above Maximum:
   Code: 2000, Type: ASSET, Range: 1000-1999
   Result: Invalid (enters LIABILITY range)
```

### Integration with Account Save

```
Account Save Process:

Before Save:
├── Run validate_code_format()
├── Run validate_code_unique()
├── Run validate_code_range() ← This method
├── Run validate_account_type()
└── If all pass: Save account

Implementation:
def save(self, *args, **kwargs):
    validator = AccountValidator(tenant=self.tenant)
    validator.validate_account(self)
    super().save(*args, **kwargs)
```

### Code Type Inference

Optional feature: Infer type from code:

```
def infer_account_type(code):
    code_int = int(code)
    if 1000 <= code_int <= 1999:
        return 'ASSET'
    elif 2000 <= code_int <= 2999:
        return 'LIABILITY'
    elif 3000 <= code_int <= 3999:
        return 'EQUITY'
    elif 4000 <= code_int <= 4999:
        return 'REVENUE'
    elif 5000 <= code_int <= 6999:
        return 'EXPENSE'
    else:
        return None

Use Case:
- Auto-suggest account type when user enters code
- Validate code/type consistency
- Import data validation
```

### Performance Considerations

```
Validation Performance:

1. Simple Integer Comparison:
   - Very fast: O(1) operation
   - Dictionary lookup: O(1)
   - Range check: O(1)
   - Total: Negligible overhead

2. Caching:
   - CODE_RANGES is class-level constant
   - No database query needed
   - No computation required

3. Bulk Validation:
   - Validate multiple accounts efficiently
   - No performance concerns
```

### Expected Outcome
- validate_code_range() method implemented
- Code range validation functional
- Account type to range mapping enforced
- Clear error messages for violations
- Boundary cases handled correctly
- Integration with bulk validation

### Verification Checklist
- [ ] validate_code_range(account_code, account_type) method added
- [ ] CODE_RANGES class constant defined
- [ ] All account types mapped to ranges
- [ ] Method accepts account_code parameter
- [ ] Method accepts account_type parameter
- [ ] Account code converted to integer
- [ ] Invalid code format raises ValidationError
- [ ] Unknown account type raises ValidationError
- [ ] Code range lookup implemented
- [ ] Range check performed (min <= code <= max)
- [ ] Descriptive error message formatted
- [ ] ValidationError raised for out-of-range codes
- [ ] Validation result logged
- [ ] Boundary cases handled correctly
- [ ] Method returns True for valid codes
- [ ] Method integrated in validate_account()
- [ ] Method documented with docstring

---

## Task 65: Add Deletion Validation

### Overview
Implement the validate_can_delete() method to prevent deletion of accounts that have associated financial transactions. This critical business rule protects financial data integrity by ensuring accounts with journal entries cannot be deleted, preventing loss of historical financial information and maintaining audit trails.

### Dependencies
- Task 63: AccountValidator class created
- JournalEntryLine model exists
- Account model structure finalized

### Instructions

1. **Open validators file**
   - Navigate to `apps/accounting/services/validators.py`
   - Locate AccountValidator class

2. **Define validate_can_delete method**
   - Add public method: validate_can_delete(account_id)
   - Add comprehensive docstring
   - Document parameters, return value, exceptions
   - Explain deletion rules

3. **Add method signature**
   - Accept account_id parameter (UUID or int)
   - Return True if account can be deleted
   - Raise ValidationError if account cannot be deleted

4. **Validate account exists**
   - Call _validate_account(account_id)
   - Get account instance
   - Verify account belongs to tenant

5. **Check for system account**
   - If account.is_system_account is True:
     - Cannot delete system accounts
     - Raise ValidationError immediately
     - Message: "Cannot delete system account {code}"

6. **Check for child accounts**
   - Query Account model for children
   - Filter by parent_account = account_id
   - If children exist:
     - Cannot delete parent with children
     - Raise ValidationError
     - Message: "Cannot delete account with {count} child accounts"

7. **Check for journal entries**
   - Query JournalEntryLine model
   - Filter by account = account_id
   - Count journal entry lines
   - Store count for error message

8. **Evaluate journal entry count**
   - If count > 0:
     - Account has transactions
     - Cannot delete
     - Proceed to error

9. **Format deletion error**
   - Create detailed error message
   - Include account code and name
   - Include transaction count
   - Suggest archival instead
   - Example: "Cannot delete account 1110 (Petty Cash) with 45 transactions. Archive instead."

10. **Raise ValidationError**
    - Raise ValidationError with formatted message
    - Include account_id and entry_count in error data
    - Allow caller to handle appropriately

11. **Log deletion validation**
    - Log at INFO level when deletion blocked
    - Include: account_code, reason, entry count
    - Example: "Deletion blocked for account 1110: 45 journal entries exist"

12. **Return success if deletable**
    - If no system account flag
    - And no child accounts
    - And no journal entries
    - Return True (safe to delete)

13. **Handle additional deletion rules**
    - Check if account is referenced in budgets
    - Check if account is referenced in reports
    - Check if account is referenced in templates
    - Add business-specific rules as needed

14. **Suggest alternative actions**
    - In error message, suggest archive_account()
    - Explain soft delete vs. hard delete
    - Provide guidance on safe operations

### Method Flow Diagram

```
validate_can_delete(account_id)
         │
         ▼
  Validate & Get Account
         │
         ▼
  Is System Account?
         │
         ├─ Yes ──→ Raise ValidationError
         │          "Cannot delete system account"
         │
         ▼ (No)
  Has Child Accounts?
         │
         ├─ Yes ──→ Raise ValidationError
         │          "Cannot delete account with children"
         │
         ▼ (No)
  Query Journal Entry Lines
         │
         ▼
  Count Transactions
         │
         ├─ Count > 0 ──→ Format Error Message
         │                │
         │                ▼
         │           Log Deletion Blocked
         │                │
         │                ▼
         │           Raise ValidationError
         │           "Cannot delete account with transactions"
         │
         ▼ (Count = 0)
  Log Deletion Allowed
         │
         ▼
  Return True
```

### Deletion Rules Summary

| Condition | Can Delete? | Action |
|-----------|-------------|--------|
| System account | No | Raise error |
| Has child accounts | No | Delete children first |
| Has journal entries | No | Archive instead |
| No transactions | Yes | Safe to delete |
| Referenced in budgets | No* | Remove budget references first |
| Referenced in reports | Yes** | Reports use historical data |

\* Optional rule depending on business requirements  
\** Reports typically query archived accounts

### System Account Protection

```
System Account Rules:

Protected Accounts:
- Critical to system operation
- Cannot be deleted under any circumstances
- Examples:
  * Petty Cash (1110)
  * Primary Bank Account (1120)
  * Accounts Payable (2100)
  * Retained Earnings (3300)
  * Current Year Profit/Loss (3400)
  * Default Sales Revenue (4100)
  * Default COGS (5100)

Protection:
- is_system_account flag prevents deletion
- Admin override not allowed
- Even if no transactions exist
```

### Child Account Handling

```
Parent-Child Deletion:

Scenario 1: Delete Parent with Children
Action: Blocked
Reason: Would orphan child accounts
Solution: Delete children first, then parent

Scenario 2: Delete Child
Action: Allowed (if no transactions)
Effect: No impact on parent

Scenario 3: Delete Hierarchy
Action: Delete from leaf to root
Order:
1. Delete leaf accounts (no children)
2. Move up hierarchy
3. Delete parent last
```

### Journal Entry Check

```
Transaction Check Query:

Count Query:
entry_count = JournalEntryLine.objects.filter(
    account_id=account_id,
    journal_entry__tenant=tenant
).count()

Considerations:
1. Include all entry statuses (DRAFT, POSTED, VOID)
2. Include deleted entries (soft delete)
3. Check across all date ranges
4. Consider archived entries

Why Count All?
- Historical data integrity
- Audit trail preservation
- Compliance requirements
- Future reference
```

### Error Messages

```
Example Error Messages:

1. System Account:
"Cannot delete system account 1110 (Petty Cash). System accounts are protected."

2. Has Children:
"Cannot delete account 1100 (Current Assets) because it has 4 child accounts. Delete child accounts first."

3. Has Transactions:
"Cannot delete account 5210 (Rent Expense) because it has 127 journal entries. Use archive functionality instead to preserve historical data."

4. Multiple Issues:
"Cannot delete account 1000 (Assets) for the following reasons:
- Account is a system account
- Account has 8 child accounts
- Account is referenced in 3 active budgets"

5. Suggested Alternative:
"This account cannot be deleted. Consider using archive_account() to hide it from selections while preserving historical data."
```

### Validation in Delete Workflow

```
Account Delete Process:

1. User Initiates Delete:
   ├── Via Admin Interface
   ├── Via API Request
   └── Via Management Command

2. Before Delete Signal:
   └── Call validate_can_delete(account_id)

3. Validation Result:
   ├── Valid ──→ Proceed with delete
   │            ├── Delete account record
   │            └── Log deletion
   │
   └── Invalid ──→ Raise ValidationError
                  ├── Display error to user
                  ├── Suggest archive
                  └── Abort deletion

4. Alternative Offered:
   └── "Would you like to archive this account instead?"
```

### Cascade Deletion Consideration

```
Cascade Deletion NOT Used:

Standard Approach:
- Accounts are NOT cascade deleted
- Child accounts must be deleted explicitly
- Journal entries remain intact

Prevents:
- Accidental data loss
- Broken audit trails
- Orphaned transactions
- Historical data gaps

Alternative:
- Soft delete (archive)
- Hide from active lists
- Preserve all data
- Maintain referential integrity
```

### Integration with UI

```
UI Integration:

Delete Button Logic:
1. User clicks "Delete" on account
2. AJAX call to validation endpoint
3. Server runs validate_can_delete()
4. If valid:
   - Show confirmation dialog
   - "Delete account 1234? This cannot be undone."
5. If invalid:
   - Show error message
   - Offer "Archive" button instead
   - "This account has 50 transactions. Archive it?"

Admin Interface:
- Delete button disabled for system accounts
- Tooltip explains why deletion blocked
- Archive button always available
```

### Expected Outcome
- validate_can_delete() method implemented
- System account deletion blocked
- Accounts with children cannot be deleted
- Accounts with transactions cannot be deleted
- Clear error messages guide users
- Alternative actions suggested
- Integration with delete workflow

### Verification Checklist
- [ ] validate_can_delete(account_id) method added
- [ ] Method accepts account_id parameter
- [ ] Account validation performed
- [ ] System account check implemented
- [ ] System account deletion blocked
- [ ] Child account check implemented
- [ ] Parent with children deletion blocked
- [ ] Journal entry line query implemented
- [ ] Transaction count evaluated
- [ ] Accounts with transactions deletion blocked
- [ ] Descriptive error messages formatted
- [ ] Error suggests archive alternative
- [ ] ValidationError raised for blocked deletions
- [ ] Validation logged at INFO level
- [ ] Method returns True for deletable accounts
- [ ] Method integrated with delete workflow
- [ ] Method documented with docstring

---

## Task 66: Add Archive Functionality

### Overview
Implement the archive_account() method to provide soft delete functionality for accounts. This method changes an account's status to ARCHIVED, hiding it from active selections while preserving all historical data and transactions. Archival is the recommended alternative to deletion for accounts with financial history, maintaining data integrity and supporting compliance requirements.

### Dependencies
- Task 63: AccountValidator class created
- Task 65: validate_can_delete() implemented
- Account model with status field
- Account status constants (ACTIVE, ARCHIVED, CLOSED)

### Instructions

1. **Open validators file**
   - Navigate to `apps/accounting/services/validators.py`
   - Locate AccountValidator class

2. **Define archive_account method**
   - Add public method: archive_account(account_id, archive_children=False)
   - Add comprehensive docstring
   - Document parameters, return value, exceptions
   - Explain archival process and effects

3. **Add method signature**
   - Accept account_id parameter (UUID or int)
   - Accept optional archive_children boolean (default False)
   - Return archived account instance
   - Raise ValidationError if archival fails

4. **Validate account exists**
   - Call _validate_account(account_id)
   - Get account instance
   - Verify account belongs to tenant
   - Store account for update

5. **Check current status**
   - If account.status == ARCHIVED:
     - Already archived
     - Log warning
     - Option 1: Return without error (idempotent)
     - Option 2: Raise ValidationError

6. **Prevent system account archival**
   - Optional: Allow or block system account archival
   - If blocking:
     - Check account.is_system_account
     - Raise ValidationError if True
   - If allowing:
     - Proceed with extra logging

7. **Check for child accounts**
   - Query Account model for active children
   - Filter by parent_account = account_id
   - Filter by status = ACTIVE
   - Count active children

8. **Handle child accounts**
   - If active children exist:
     - And archive_children is False:
       - Raise ValidationError
       - Message: "Account has {count} active child accounts"
     - And archive_children is True:
       - Recursively archive children
       - Log each child archival

9. **Update account status**
   - Set account.status = ARCHIVED
   - Set account.archived_at = timezone.now()
   - Optional: Set account.archived_by = current_user
   - Prepare to save

10. **Use atomic transaction**
    - Wrap status update in transaction.atomic()
    - Ensure atomic archival
    - Include child archival in transaction
    - Enable rollback on error

11. **Save account**
    - Call account.save()
    - Update database
    - Commit transaction

12. **Log archival**
    - Log at INFO level
    - Include: account_code, account_name, tenant
    - Example: "Archived account 5230 (Office Supplies) for tenant ABC Corp"

13. **Archive children if requested**
    - If archive_children is True:
      - Query child accounts
      - For each child:
        - Recursively call archive_account(child.id, True)
        - Log child archival
    - Handle recursion depth limits

14. **Create audit trail**
    - Optional: Create AccountStatusHistory entry
    - Record: account, old_status, new_status, changed_at, changed_by
    - Provides audit trail for compliance

15. **Return archived account**
    - Return updated account instance
    - Caller can verify status change
    - Include in API responses

16. **Add error handling**
    - Catch validation errors
    - Catch database errors during save
    - Log errors with context
    - Rollback transaction on error
    - Re-raise with clear message

### Method Flow Diagram

```
archive_account(account_id, archive_children)
         │
         ▼
  Validate & Get Account
         │
         ▼
  Already Archived?
         │
         ├─ Yes ──→ Log Warning
         │          └──→ Return Account (idempotent)
         │
         ▼ (No - Currently Active)
  Check System Account
         │
         ├─ System & Blocked ──→ Raise ValidationError
         │
         ▼ (Allowed)
  Query Active Children
         │
         ▼
  Has Active Children?
         │
         ├─ Yes & !archive_children ──→ Raise ValidationError
         │
         ├─ Yes & archive_children ──→ Archive Children Recursively
         │
         ▼
  Begin Transaction
         │
         ▼
  Set status = ARCHIVED
         │
         ▼
  Set archived_at = now()
         │
         ▼
  Save Account
         │
         ▼
  Create Audit Record
         │
         ▼
  Commit Transaction
         │
         ▼
  Log Archival
         │
         ▼
  Return Archived Account
```

### Account Status States

| Status | Description | Visible in Selections? | Can Post Transactions? |
|--------|-------------|------------------------|------------------------|
| ACTIVE | Normal operation | Yes | Yes |
| ARCHIVED | Soft deleted | No | No (historical only) |
| CLOSED | Year-end closed | Depends | No |
| INACTIVE | Temporarily disabled | No | No |

### Archive vs. Delete Comparison

| Aspect | Archive (Soft Delete) | Delete (Hard Delete) |
|--------|----------------------|---------------------|
| Data Preserved | Yes | No |
| Transactions Intact | Yes | Would break references |
| Audit Trail | Complete | Lost |
| Reversible | Yes (unarchive) | No |
| When to Use | Accounts with history | Accounts with no history |
| Compliance | Meets requirements | May violate regulations |

### Recursive Child Archival

```
Recursive Archival:

Parent Account: 5000 - Operating Expenses
├── 5100 - Personnel (Active)
│   ├── 5110 - Salaries (Active)
│   └── 5120 - Benefits (Active)
└── 5200 - Facility (Active)
    ├── 5210 - Rent (Active)
    └── 5220 - Utilities (Active)

Command: archive_account(5000, archive_children=True)

Process:
1. Archive 5000
2. Find children: [5100, 5200]
3. Archive 5100:
   a. Find children: [5110, 5120]
   b. Archive 5110
   c. Archive 5120
   d. Archive 5100
4. Archive 5200:
   a. Find children: [5210, 5220]
   b. Archive 5210
   c. Archive 5220
   d. Archive 5200
5. Complete

Result: All 7 accounts archived
```

### Archival Without Children Flag

```
Scenario: Archive parent without children flag

Command: archive_account(5000, archive_children=False)

Check:
- 5000 has active children (5100, 5200)

Result:
- Raise ValidationError
- Message: "Cannot archive account 5000 (Operating Expenses) with 2 active child accounts. Set archive_children=True to archive all children, or archive children individually first."

User Options:
1. Archive children manually first
2. Use archive_children=True
3. Cancel archival
```

### Audit Trail Recording

```
AccountStatusHistory Model (Optional):

Fields:
├── id (UUID, PK)
├── account (ForeignKey)
├── old_status (CharField)
├── new_status (CharField)
├── changed_at (DateTimeField)
├── changed_by (ForeignKey to User, null)
├── reason (TextField, optional)
└── notes (TextField, optional)

Benefits:
- Complete status change history
- Who archived when
- Compliance documentation
- Troubleshooting tool

Query:
history = AccountStatusHistory.objects.filter(
    account_id=account_id
).order_by('-changed_at')
```

### Unarchive Functionality

```
Companion Method: unarchive_account(account_id)

Purpose: Reactivate archived account

Process:
1. Get archived account
2. Check if status == ARCHIVED
3. Set status = ACTIVE
4. Clear archived_at timestamp
5. Save account
6. Log reactivation
7. Return account

Use Cases:
- Account archived by mistake
- Account needed again
- Seasonal accounts
- Reorganization

Considerations:
- Verify account data still valid
- Check parent account is active
- Ensure code still unique
- Validate current settings
```

### UI Integration

```
Admin Interface:

Archive Button:
- Available for all accounts
- Visible even with transactions
- Confirmation dialog:
  "Archive account 1234 (Account Name)? 
   It will be hidden from selections but preserved for history."
- Options:
  [x] Archive child accounts too
  [ ] Cancel  [Archive]

Bulk Archive:
- Select multiple accounts
- "Archive Selected" action
- Processes each account
- Shows success/failure for each

Archived Accounts View:
- Separate view for archived accounts
- Filter: "Show: [Active] [Archived] [All]"
- Unarchive button available
- View historical transactions
```

### Expected Outcome
- archive_account() method implemented
- Soft delete via status change
- Child account handling with archive_children flag
- Recursive archival functional
- Transaction safety with atomic operations
- Audit trail creation
- Comprehensive logging
- Alternative to hard deletion

### Verification Checklist
- [ ] archive_account(account_id, archive_children) method added
- [ ] Method accepts account_id parameter
- [ ] archive_children parameter supported (default False)
- [ ] Account validation performed
- [ ] Current status checked
- [ ] Already archived accounts handled (idempotent)
- [ ] System account archival policy implemented
- [ ] Active children queried
- [ ] Children handling based on archive_children flag
- [ ] ValidationError raised if children exist and flag False
- [ ] Recursive child archival implemented
- [ ] Transaction wraps archival
- [ ] status field updated to ARCHIVED
- [ ] archived_at timestamp set
- [ ] Account saved to database
- [ ] Audit record created (if implemented)
- [ ] Archival logged at INFO level
- [ ] Archived account returned
- [ ] Errors caught and handled
- [ ] Method documented with docstring

---

## Summary

This document implemented account validation logic and archive functionality:

- **Task 63:** Created AccountValidator class with comprehensive validation methods for code format, uniqueness, account type, parent relationships, hierarchy depth, system accounts, and posting rules
- **Task 64:** Implemented validate_code_range() to enforce account code organization, ensuring codes fall within defined ranges for each account type
- **Task 65:** Implemented validate_can_delete() to prevent deletion of system accounts, accounts with children, and accounts with journal entries, protecting financial data integrity
- **Task 66:** Implemented archive_account() for soft delete functionality with recursive child archival, providing a safe alternative to deletion while preserving historical data

The validation and archive system now provides:
- Comprehensive business rule enforcement
- Code range validation maintaining account organization
- Deletion prevention protecting critical financial data
- Soft delete via archival preserving audit trails
- Recursive child archival for hierarchy management
- Clear error messages guiding users to correct actions
- Transaction safety and data integrity
- Compliance with financial data retention requirements

**Next Steps:** Group E implements the Django admin interface and DRF serializers for account management.
