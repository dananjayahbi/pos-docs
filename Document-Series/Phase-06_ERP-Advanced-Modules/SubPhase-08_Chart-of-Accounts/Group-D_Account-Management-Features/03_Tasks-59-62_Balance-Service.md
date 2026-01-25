# Tasks 59-62: Balance Service

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** D - Account Management Features  
> **Document:** 03 of 04  
> **Tasks Covered:** 59, 60, 61, 62

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-56-58_COA-Initializer-Service.md](02_Tasks-56-58_COA-Initializer-Service.md)
- **→ Next Document:** [04_Tasks-63-66_Validators-Archive.md](04_Tasks-63-66_Validators-Archive.md)

---

## Document Overview

This document covers the implementation of the AccountBalanceService, which handles real-time balance calculations for chart of accounts. The service calculates account balances from journal entries, considers normal balance conventions (debit/credit), updates stored balance fields, and aggregates child account balances to parent accounts. This provides accurate, up-to-date financial positions for reporting and decision-making.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create Account Balance Service | High | 60 min |
| 60 | Add Calculate Balance Method | Medium | 50 min |
| 61 | Add Update Balance Method | Medium | 35 min |
| 62 | Add Get Children Balances | Medium | 45 min |

---

## Task 59: Create Account Balance Service

### Overview
Create the AccountBalanceService class to handle all account balance calculations and updates. This service encapsulates balance computation logic, including normal balance conventions, debit/credit rules, parent-child aggregation, and balance caching. It separates balance calculation from models and views, providing a reusable, testable service for financial calculations.

### Dependencies
- Account model with current_balance field
- JournalEntry and JournalEntryLine models exist
- Multi-tenancy infrastructure
- Hierarchical account structure established

### Instructions

1. **Create balance service file**
   - Navigate to `apps/accounting/services/` directory
   - Create file `balance_service.py`
   - This will contain AccountBalanceService class

2. **Import required dependencies**
   - Import Account model
   - Import JournalEntry and JournalEntryLine models
   - Import Django database functions (Sum, F, Q)
   - Import Decimal for precise calculations
   - Import logging for operation tracking
   - Import transaction utilities

3. **Define AccountBalanceService class**
   - Create class with comprehensive docstring
   - Explain service purpose and balance calculation rules
   - Document debit/credit conventions
   - Note normal balance by account type

4. **Add class-level constants**
   - Define DEBIT_NORMAL_TYPES = [ASSET, EXPENSE]
   - Define CREDIT_NORMAL_TYPES = [LIABILITY, EQUITY, REVENUE]
   - Define DEBIT = 'DEBIT'
   - Define CREDIT = 'CREDIT'

5. **Create constructor method**
   - Accept tenant parameter
   - Optional: Accept account parameter for single-account operations
   - Store tenant reference
   - Initialize logger
   - Validate tenant

6. **Add tenant validation**
   - Create _validate_tenant() private method
   - Check tenant exists
   - Check tenant is active
   - Raise appropriate exceptions

7. **Add account validation**
   - Create _validate_account() private method
   - Check account exists
   - Check account belongs to tenant
   - Check account status is ACTIVE
   - Return validated account

8. **Add normal balance determination**
   - Create _get_normal_balance(account) method
   - Check account type
   - Return DEBIT for Assets and Expenses
   - Return CREDIT for Liabilities, Equity, Revenue
   - Handle edge cases

9. **Add journal entry query builder**
   - Create _get_journal_entries(account_id) method
   - Query JournalEntryLine for account
   - Filter by tenant
   - Filter by posted entries only
   - Exclude void/cancelled entries
   - Return queryset

10. **Add balance calculation helper**
    - Create _sum_debits_credits(account_id) method
    - Aggregate debit amounts
    - Aggregate credit amounts
    - Return tuple: (total_debits, total_credits)
    - Use Django Sum aggregation

11. **Add opening balance handler**
    - Create _get_opening_balance(account) method
    - Return account.opening_balance
    - Handle null opening balances (default 0)
    - Support fiscal year-specific openings

12. **Add balance formula calculator**
    - Create _apply_balance_formula() method
    - Accept opening, debits, credits, normal_balance
    - Apply formula based on normal balance:
      - DEBIT normal: Balance = Opening + Debits - Credits
      - CREDIT normal: Balance = Opening + Credits - Debits
    - Return calculated balance as Decimal

13. **Add precision handling**
    - Use Decimal for all calculations
    - Set precision to 2 decimal places
    - Configure rounding mode (ROUND_HALF_UP)
    - Prevent floating-point errors

14. **Add caching strategy consideration**
    - Note: current_balance stored in Account model
    - Balance recalculated when needed
    - Option to cache in Redis for high-traffic accounts
    - Cache invalidation on new entries

15. **Add logging configuration**
    - Log balance calculations at DEBUG level
    - Log balance updates at INFO level
    - Log errors at ERROR level
    - Include account codes and amounts in logs

16. **Add error handling**
    - Handle missing accounts gracefully
    - Handle database errors
    - Handle calculation errors
    - Provide clear error messages

17. **Add transaction support**
    - Wrap balance updates in transactions when appropriate
    - Ensure atomic balance updates
    - Support bulk updates

18. **Import service in package**
    - Open `services/__init__.py`
    - Import AccountBalanceService
    - Export in __all__ list

### Service Class Structure

```
AccountBalanceService
├── __init__(tenant, account=None)
│   ├── Store tenant reference
│   ├── Store account if provided
│   ├── Initialize logger
│   └── Validate tenant
├── Public Methods
│   ├── calculate_balance(account_id) - Task 60
│   ├── update_balance(account_id) - Task 61
│   └── get_children_balances(account_id) - Task 62
└── Private Helper Methods
    ├── _validate_tenant()
    ├── _validate_account(account_id)
    ├── _get_normal_balance(account)
    ├── _get_journal_entries(account_id)
    ├── _sum_debits_credits(account_id)
    ├── _get_opening_balance(account)
    └── _apply_balance_formula(opening, debits, credits, normal_balance)
```

### Normal Balance Convention

Understanding normal balance is critical for correct calculations:

| Account Type | Normal Balance | Increases With | Decreases With |
|--------------|----------------|----------------|----------------|
| ASSET | DEBIT | Debits | Credits |
| EXPENSE | DEBIT | Debits | Credits |
| LIABILITY | CREDIT | Credits | Debits |
| EQUITY | CREDIT | Credits | Debits |
| REVENUE | CREDIT | Credits | Debits |

### Balance Calculation Formulas

#### For Debit Normal Balance Accounts (Assets, Expenses)
```
Current Balance = Opening Balance + Total Debits - Total Credits

Example - Asset Account:
Opening: $1,000
Debits:  +$500 (increase)
Credits: -$200 (decrease)
Balance: $1,000 + $500 - $200 = $1,300
```

#### For Credit Normal Balance Accounts (Liabilities, Equity, Revenue)
```
Current Balance = Opening Balance + Total Credits - Total Debits

Example - Revenue Account:
Opening: $0
Credits: +$1,000 (revenue earned)
Debits:  -$50 (revenue reversal)
Balance: $0 + $1,000 - $50 = $950
```

### Balance Calculation Flow

```
Calculate Balance Request
         │
         ▼
  Validate Account
         │
         ▼
  Determine Normal Balance
         │
         ▼
  Get Opening Balance
         │
         ▼
  Query Journal Entry Lines
         │
         ▼
  Sum Debit Amounts
         │
         ▼
  Sum Credit Amounts
         │
         ▼
  Apply Balance Formula
    (based on normal balance)
         │
         ▼
  Round to 2 Decimals
         │
         ▼
  Return Balance
```

### Journal Entry Filtering

When querying entries for balance calculation:

#### Include
- Posted journal entries (status=POSTED)
- Entries within date range (if specified)
- Entries for the specific tenant
- Entries for the specific account

#### Exclude
- Draft entries (not finalized)
- Void entries (cancelled)
- Deleted entries
- Future-dated entries (if calculating historical balance)

### Precision and Decimal Handling

Financial calculations require precision:

1. **Use Decimal Type**
   - Import from Python's decimal module
   - Never use float for money
   - Set DECIMAL_PLACES = 2

2. **Configure Rounding**
   - Use ROUND_HALF_UP for standard rounding
   - Consistent with accounting standards
   - Apply to final balance only

3. **Aggregation Precision**
   - Django Sum returns Decimal by default
   - Database handles precision
   - Verify field type is DecimalField

4. **Display Formatting**
   - Format with currency symbol
   - Two decimal places always
   - Thousands separator for readability

### Error Scenarios

#### Account Not Found
- Raise AccountDoesNotExist exception
- Provide account ID in message
- Log warning

#### Tenant Mismatch
- Raise PermissionDenied exception
- Prevent cross-tenant access
- Log security warning

#### Invalid Account Type
- Raise ValidationError
- Check account_type in valid choices
- Log error

#### Database Error
- Catch OperationalError
- Log full error details
- Re-raise with context

### Performance Considerations

Balance calculations can be expensive:

1. **Query Optimization**
   - Use select_related for foreign keys
   - Use aggregation at database level
   - Avoid N+1 queries

2. **Caching Strategy**
   - Cache balance in current_balance field
   - Recalculate on demand or via triggers
   - Consider Redis for high-frequency accounts

3. **Batch Processing**
   - Update multiple balances in single transaction
   - Use bulk operations where possible
   - Schedule off-peak recalculations

4. **Indexing**
   - Index journal_entry_line.account_id
   - Index journal_entry.status
   - Composite index on (account_id, posted_date)

### Expected Outcome
- AccountBalanceService class created
- Constructor accepts tenant and optional account
- Helper methods for balance components
- Normal balance logic implemented
- Precision handling configured
- Logging and error handling in place
- Foundation for calculation methods (Tasks 60-62)

### Verification Checklist
- [ ] `apps/accounting/services/balance_service.py` created
- [ ] AccountBalanceService class defined
- [ ] Class docstring explains balance calculation rules
- [ ] Constructor accepts tenant parameter
- [ ] Optional account parameter in constructor
- [ ] _validate_tenant() method implemented
- [ ] _validate_account() method implemented
- [ ] _get_normal_balance() method created
- [ ] DEBIT_NORMAL_TYPES and CREDIT_NORMAL_TYPES constants defined
- [ ] _get_journal_entries() query builder created
- [ ] _sum_debits_credits() aggregation method implemented
- [ ] _get_opening_balance() method created
- [ ] _apply_balance_formula() calculator implemented
- [ ] Decimal type used for all amounts
- [ ] Precision set to 2 decimal places
- [ ] Logging configured
- [ ] Error handling implemented
- [ ] Service imported in `services/__init__.py`

---

## Task 60: Add Calculate Balance Method

### Overview
Implement the calculate_balance() method to compute an account's current balance from journal entries. This method queries all posted journal entry lines for the account, sums debits and credits, applies the appropriate balance formula based on normal balance type, and returns the calculated balance. It provides real-time balance calculation without modifying stored values.

### Dependencies
- Task 59: AccountBalanceService created
- Helper methods (_sum_debits_credits, _apply_balance_formula, etc.)
- JournalEntry and JournalEntryLine models
- Account model with opening_balance field

### Instructions

1. **Open balance service file**
   - Navigate to `apps/accounting/services/balance_service.py`
   - Locate AccountBalanceService class

2. **Define calculate_balance method**
   - Add public method: calculate_balance(account_id, as_of_date=None)
   - Add comprehensive docstring
   - Document parameters and return value
   - Explain balance calculation logic

3. **Add method signature**
   - Accept account_id parameter (UUID or int)
   - Accept optional as_of_date for historical balance
   - Return Decimal value (balance amount)
   - Raise exceptions for invalid input

4. **Validate account**
   - Call _validate_account(account_id)
   - Get account instance
   - Verify account exists and belongs to tenant
   - Store account for use in method

5. **Determine normal balance**
   - Call _get_normal_balance(account)
   - Store normal balance type (DEBIT or CREDIT)
   - Use for balance formula

6. **Get opening balance**
   - Call _get_opening_balance(account)
   - Store opening balance
   - Default to Decimal('0.00') if null

7. **Query journal entry lines**
   - Call _get_journal_entries(account_id)
   - Filter by as_of_date if provided
   - Get queryset of applicable entries
   - Ensure only posted entries included

8. **Apply date filter if provided**
   - If as_of_date specified:
     - Filter journal_entry__posted_date <= as_of_date
     - Calculate historical balance
   - If not provided:
     - Use all entries (current balance)

9. **Sum debits and credits**
   - Call _sum_debits_credits(account_id)
   - Get tuple: (total_debits, total_credits)
   - Handle null results (no entries)
   - Convert to Decimal if needed

10. **Apply balance formula**
    - Call _apply_balance_formula()
    - Pass: opening_balance, total_debits, total_credits, normal_balance
    - Get calculated balance
    - Ensure result is Decimal

11. **Round balance**
    - Round to 2 decimal places
    - Use ROUND_HALF_UP mode
    - Ensure consistent formatting

12. **Log calculation**
    - Log at DEBUG level
    - Include: account_code, opening, debits, credits, calculated balance
    - Example: "Calculated balance for account 1100: Opening 1000.00 + Debits 500.00 - Credits 200.00 = 1300.00"

13. **Handle group accounts**
    - If account.is_group is True:
      - Note: Balance should come from children
      - Option 1: Return sum of children balances
      - Option 2: Return 0 and log warning
      - Document expected behavior

14. **Handle zero-balance accounts**
    - If no opening and no entries, return Decimal('0.00')
    - Valid scenario for new accounts
    - No error needed

15. **Return calculated balance**
    - Return Decimal value
    - Positive balance: Debit balance for debit accounts, Credit balance for credit accounts
    - Negative balance: Opposite of normal balance (rare, may indicate error)

16. **Add error handling**
    - Catch AccountDoesNotExist
    - Catch database errors
    - Log errors with context
    - Re-raise with clear message

### Method Flow Diagram

```
calculate_balance(account_id, as_of_date)
         │
         ▼
  Validate Account
         │
         ▼
  Get Account Instance
         │
         ▼
  Determine Normal Balance
         │
         ▼
  Get Opening Balance
         │
         ▼
  Query Journal Entries
    (filter by date if specified)
         │
         ▼
  Sum Debit Amounts
         │
         ▼
  Sum Credit Amounts
         │
         ▼
  Apply Balance Formula
    (based on normal balance)
         │
         ▼
  Round to 2 Decimals
         │
         ▼
  Log Calculation
         │
         ▼
  Return Balance
```

### Balance Calculation Examples

#### Asset Account (Debit Normal)
```
Account: 1110 - Petty Cash
Type: ASSET
Normal Balance: DEBIT

Opening Balance: $500.00
Journal Entries:
- Debit $100.00 (cash added)
- Credit $30.00 (cash spent)
- Debit $50.00 (cash added)
- Credit $20.00 (cash spent)

Calculation:
Total Debits = $100 + $50 = $150.00
Total Credits = $30 + $20 = $50.00
Balance = $500 + $150 - $50 = $600.00
```

#### Revenue Account (Credit Normal)
```
Account: 4100 - Sales Revenue
Type: REVENUE
Normal Balance: CREDIT

Opening Balance: $0.00
Journal Entries:
- Credit $1,000.00 (sale made)
- Credit $500.00 (sale made)
- Debit $50.00 (sale return)

Calculation:
Total Credits = $1,000 + $500 = $1,500.00
Total Debits = $50.00
Balance = $0 + $1,500 - $50 = $1,450.00
```

#### Liability Account (Credit Normal)
```
Account: 2100 - Accounts Payable
Type: LIABILITY
Normal Balance: CREDIT

Opening Balance: $2,000.00
Journal Entries:
- Credit $300.00 (new payable)
- Debit $500.00 (payment made)
- Credit $200.00 (new payable)

Calculation:
Total Credits = $300 + $200 = $500.00
Total Debits = $500.00
Balance = $2,000 + $500 - $500 = $2,000.00
```

### Historical Balance Calculation

When as_of_date is provided:

```
as_of_date = 2025-01-15

Include:
- Opening balance (always included)
- Journal entries posted <= 2025-01-15

Exclude:
- Journal entries posted > 2025-01-15

Use Case:
- Month-end reporting
- Historical financial statements
- Audit trails
- Comparative analysis
```

### Group Account Handling

Group accounts (parent accounts) typically don't have direct postings:

#### Option 1: Return Zero
```
if account.is_group:
    logger.warning(f"Account {account.account_code} is a group account")
    return Decimal('0.00')
```

#### Option 2: Sum Children (Implemented in Task 62)
```
if account.is_group:
    return self.get_children_balances(account_id)
```

#### Option 3: Calculate from Direct Entries
```
# Some systems allow direct posting to group accounts
# Calculate normally, ignoring group status
```

### Query Optimization

Efficient balance calculation:

1. **Single Query Aggregation**
   ```
   Use Django's aggregate() to sum in one query
   Avoid iterating through entries in Python
   Let database handle aggregation
   ```

2. **Indexed Fields**
   ```
   Ensure indexes on:
   - journal_entry_line.account_id
   - journal_entry.posted_date
   - journal_entry.status
   ```

3. **Selective Field Loading**
   ```
   Only load needed fields:
   - debit_amount
   - credit_amount
   No need for full object
   ```

### Precision Example

```
Django Query:
entries = JournalEntryLine.objects.filter(
    account_id=account_id,
    journal_entry__status='POSTED'
)

Aggregation:
totals = entries.aggregate(
    total_debits=Sum('debit_amount'),
    total_credits=Sum('credit_amount')
)

Returns:
{
    'total_debits': Decimal('1500.00'),
    'total_credits': Decimal('750.00')
}

All values are Decimal type
Precision maintained throughout
```

### Expected Outcome
- calculate_balance() method implemented
- Real-time balance calculation working
- Normal balance conventions applied
- Historical balance supported via as_of_date
- Decimal precision maintained
- Efficient database queries
- Comprehensive logging

### Verification Checklist
- [ ] calculate_balance(account_id, as_of_date) method added
- [ ] Method accepts account_id parameter
- [ ] Optional as_of_date parameter supported
- [ ] Account validation performed
- [ ] Account instance retrieved
- [ ] Normal balance determined
- [ ] Opening balance retrieved
- [ ] Journal entries queried
- [ ] Date filtering applied when as_of_date provided
- [ ] Debits and credits summed via aggregation
- [ ] Balance formula applied based on normal balance
- [ ] Result rounded to 2 decimals
- [ ] Decimal type used throughout
- [ ] Group account handling implemented
- [ ] Zero-balance accounts handled
- [ ] Calculation logged at DEBUG level
- [ ] Errors caught and handled
- [ ] Method returns Decimal value
- [ ] Method documented with docstring

---

## Task 61: Add Update Balance Method

### Overview
Implement the update_balance() method to calculate and persist an account's current balance to the database. This method calls calculate_balance() to compute the balance, then updates the account's current_balance field, creating an audit trail of balance changes. It enables balance caching for performance and supports balance snapshots for reporting.

### Dependencies
- Task 59: AccountBalanceService created
- Task 60: calculate_balance() method implemented
- Account model with current_balance field
- Account model with balance_last_updated timestamp field

### Instructions

1. **Open balance service file**
   - Navigate to `apps/accounting/services/balance_service.py`
   - Locate AccountBalanceService class

2. **Define update_balance method**
   - Add public method: update_balance(account_id)
   - Add comprehensive docstring
   - Document parameters and return value
   - Explain update process and side effects

3. **Add method signature**
   - Accept account_id parameter (UUID or int)
   - Optional: Accept force_update boolean (default False)
   - Return tuple: (old_balance, new_balance)
   - Raise exceptions for invalid input

4. **Validate account**
   - Call _validate_account(account_id)
   - Get account instance
   - Verify account exists and belongs to tenant
   - Check account status is ACTIVE

5. **Store current balance**
   - Read account.current_balance
   - Store as old_balance
   - Used for comparison and return value

6. **Calculate new balance**
   - Call calculate_balance(account_id)
   - Get calculated balance as Decimal
   - This is the new balance to store

7. **Check if update needed**
   - Compare old_balance and new_balance
   - If equal and not force_update:
     - Log: "Balance unchanged, skipping update"
     - Return (old_balance, old_balance)
   - If different or force_update:
     - Proceed with update

8. **Update account balance**
   - Set account.current_balance = new_balance
   - Set account.balance_last_updated = timezone.now()
   - Optional: Set account.updated_at = timezone.now()
   - Save account instance

9. **Use atomic transaction**
   - Wrap update in transaction.atomic()
   - Ensure balance and timestamp updated together
   - Prevent race conditions
   - Enable rollback on error

10. **Create balance history record**
    - Optional: Create AccountBalanceHistory entry
    - Store: account, old_balance, new_balance, updated_at, updated_by
    - Provides audit trail of balance changes
    - Useful for troubleshooting discrepancies

11. **Calculate balance change**
    - Compute difference: new_balance - old_balance
    - Store as balance_change
    - Include in logs and return value

12. **Log balance update**
    - Log at INFO level
    - Include: account_code, old_balance, new_balance, change
    - Example: "Updated balance for account 1100: $1,300.00 -> $1,450.00 (+$150.00)"

13. **Handle concurrent updates**
    - Use select_for_update() to lock row
    - Prevent simultaneous updates
    - Ensure data consistency
    - Important for high-traffic accounts

14. **Trigger balance cascade**
    - If account has parent, consider updating parent balance
    - Option: Queue parent balance update
    - Option: Update parent immediately
    - Prevent infinite recursion

15. **Return update results**
    - Return tuple: (old_balance, new_balance)
    - Caller can check if balance changed
    - Used in APIs and reporting

16. **Add error handling**
    - Catch account validation errors
    - Catch database errors during save
    - Log errors with full context
    - Re-raise with clear message

### Method Flow Diagram

```
update_balance(account_id)
         │
         ▼
  Validate Account
         │
         ▼
  Get Account Instance
         │
         ▼
  Store Current Balance
    (old_balance)
         │
         ▼
  Calculate New Balance
    (call calculate_balance)
         │
         ▼
  Compare Balances
         │
         ├─ Unchanged & !force ──→ Return (old, old)
         │
         ▼ (Changed or forced)
  Begin Transaction
         │
         ▼
  Lock Account Row
    (select_for_update)
         │
         ▼
  Update current_balance
         │
         ▼
  Update balance_last_updated
         │
         ▼
  Save Account
         │
         ▼
  Create History Record
    (optional)
         │
         ▼
  Commit Transaction
         │
         ▼
  Log Update
         │
         ▼
  Trigger Parent Update
    (if applicable)
         │
         ▼
  Return (old_balance, new_balance)
```

### Transaction Safety

Update wrapped in transaction:

```
Transaction Flow:
├── BEGIN TRANSACTION
├── SELECT ... FOR UPDATE (lock account)
├── Calculate new balance
├── UPDATE account SET current_balance = ..., balance_last_updated = ...
├── INSERT INTO balance_history (optional)
├── COMMIT
└── RELEASE LOCK

Benefits:
- Atomic update
- No partial updates
- Concurrent access controlled
- Consistent state guaranteed
```

### Row Locking Strategy

Prevent concurrent balance updates:

```
Query Pattern:
account = Account.objects.select_for_update().get(id=account_id)

Effect:
- Row locked until transaction completes
- Other transactions wait
- Prevents race conditions
- Ensures serialized updates

Use When:
- High transaction volume
- Critical balance accuracy required
- Multiple simultaneous update attempts possible
```

### Balance History Tracking

Optional audit trail:

```
AccountBalanceHistory Model:
├── id (UUID, PK)
├── account (ForeignKey)
├── old_balance (DecimalField)
├── new_balance (DecimalField)
├── balance_change (DecimalField)
├── updated_at (DateTimeField)
├── updated_by (ForeignKey to User, nullable)
└── notes (TextField, optional)

Benefits:
- Complete audit trail
- Balance change history
- Troubleshooting tool
- Compliance requirement
```

### Parent Balance Propagation

When child balance updates, parent may need update:

```
Propagation Strategy:

Option 1: Immediate Update
- Update child balance
- Recalculate parent balance immediately
- Recursive update to root
- Pros: Always accurate
- Cons: Performance impact

Option 2: Deferred Update
- Update child balance
- Queue parent for update
- Process queue asynchronously
- Pros: Better performance
- Cons: Temporary inconsistency

Option 3: Manual Update
- Update child only
- User triggers parent update
- Or scheduled batch job
- Pros: Controlled timing
- Cons: Manual intervention required
```

### Update Scenarios

#### Scenario 1: New Journal Entry Posted
```
Event: Journal entry posted with line for account 1110
Action: Call update_balance(1110)
Result: Balance recalculated and stored
```

#### Scenario 2: Journal Entry Voided
```
Event: Journal entry voided, affecting account 1110
Action: Call update_balance(1110)
Result: Balance recalculated without void entry
```

#### Scenario 3: Opening Balance Changed
```
Event: Account opening balance adjusted
Action: Call update_balance(account_id)
Result: Balance recalculated from new opening
```

#### Scenario 4: Scheduled Reconciliation
```
Event: Nightly balance reconciliation job
Action: Update all account balances
Result: Ensure all balances accurate
```

### Performance Considerations

Balance updates can be frequent:

1. **Selective Updates**
   - Only update when balance changes
   - Skip update if balance unchanged
   - Use force_update for required updates

2. **Batch Updates**
   - Update multiple accounts in batch
   - Single transaction for multiple updates
   - Reduce transaction overhead

3. **Async Processing**
   - Queue balance updates
   - Process via Celery task
   - Non-blocking user operations

4. **Caching Strategy**
   - Balance stored in database
   - Recalculate on demand or scheduled
   - Balance with cache invalidation

### Return Value Usage

```
old_balance, new_balance = service.update_balance(account_id)

balance_change = new_balance - old_balance

if balance_change != 0:
    print(f"Balance changed by {balance_change}")
    
if old_balance == new_balance:
    print("Balance unchanged")
```

### Expected Outcome
- update_balance() method implemented
- Calculated balance persisted to database
- Balance timestamp updated
- Transaction safety ensured
- Optional balance history created
- Efficient update with change detection
- Parent propagation considered

### Verification Checklist
- [ ] update_balance(account_id) method added
- [ ] Method accepts account_id parameter
- [ ] Optional force_update parameter supported
- [ ] Account validation performed
- [ ] Current balance stored as old_balance
- [ ] New balance calculated via calculate_balance()
- [ ] Balance comparison performed
- [ ] Unchanged balances skipped (unless forced)
- [ ] Transaction wraps update
- [ ] select_for_update() used for row locking
- [ ] current_balance field updated
- [ ] balance_last_updated timestamp set
- [ ] Account saved to database
- [ ] Balance history record created (if implemented)
- [ ] Balance change logged at INFO level
- [ ] Parent balance update triggered (if implemented)
- [ ] Tuple (old_balance, new_balance) returned
- [ ] Errors caught and handled
- [ ] Method documented with docstring

---

## Task 62: Add Get Children Balances

### Overview
Implement the get_children_balances() method to aggregate balances from all child accounts to a parent account. This method recursively collects balances from all descendants, sums them according to account type rules, and returns the aggregated balance. It enables group account balance reporting and supports hierarchical financial statements.

### Dependencies
- Task 59: AccountBalanceService created
- Task 60: calculate_balance() method implemented
- Task 61: update_balance() method implemented (optional)
- Hierarchical account structure with parent-child relationships

### Instructions

1. **Open balance service file**
   - Navigate to `apps/accounting/services/balance_service.py`
   - Locate AccountBalanceService class

2. **Define get_children_balances method**
   - Add public method: get_children_balances(account_id, recursive=True)
   - Add comprehensive docstring
   - Document parameters and return value
   - Explain aggregation logic

3. **Add method signature**
   - Accept account_id parameter (UUID or int)
   - Accept recursive boolean (default True)
   - recursive=True: Include all descendants
   - recursive=False: Include only direct children
   - Return Decimal (aggregated balance)

4. **Validate account**
   - Call _validate_account(account_id)
   - Get account instance
   - Verify account exists and belongs to tenant
   - Verify account is a group account (is_group=True)

5. **Check if group account**
   - If account.is_group is False:
     - Log warning
     - Option 1: Return account's own balance
     - Option 2: Raise error
     - Document expected behavior

6. **Query child accounts**
   - Query Account model
   - Filter by parent_account = account_id
   - Filter by tenant
   - Filter by status = ACTIVE
   - Get queryset of direct children

7. **Initialize aggregation**
   - Create variable: total_balance = Decimal('0.00')
   - Will accumulate child balances

8. **Iterate through children**
   - For each child account:
     - Get child balance
     - Add to total_balance
     - Handle recursive case

9. **Get child balance**
   - If child.is_group and recursive:
     - Recursively call get_children_balances(child.id)
     - Get aggregated balance of child's descendants
   - Else:
     - Call calculate_balance(child.id)
     - Get child's own balance

10. **Aggregate balances**
    - Add child balance to total_balance
    - Use Decimal addition for precision
    - Handle positive and negative balances

11. **Handle mixed account types**
    - All children should be same type as parent
    - If mixed types (rare):
      - Log warning
      - Still aggregate (sum)
      - May indicate configuration error

12. **Handle negative balances**
    - Negative balance = opposite of normal balance
    - Include in aggregation as-is
    - Don't reverse sign
    - Sum algebraically

13. **Round aggregated balance**
    - Round final result to 2 decimals
    - Use ROUND_HALF_UP
    - Ensure consistent precision

14. **Log aggregation**
    - Log at DEBUG level
    - Include: parent account, child count, total balance
    - Example: "Aggregated balance for 1000 (Assets) from 5 children: $45,000.00"

15. **Prevent infinite recursion**
    - Check for circular parent references (rare)
    - Set maximum recursion depth
    - Raise error if exceeded

16. **Cache aggregated balances**
    - Consider caching result
    - Invalidate when child balances change
    - Improves performance for frequent queries

17. **Return aggregated balance**
    - Return Decimal value
    - Represents total of all children
    - Used for group account reporting

18. **Add error handling**
    - Catch account validation errors
    - Catch recursion errors
    - Log errors with context
    - Re-raise with clear message

### Method Flow Diagram

```
get_children_balances(account_id, recursive)
         │
         ▼
  Validate Account
         │
         ▼
  Verify is_group = True
         │
         ▼
  Query Direct Children
    (parent_account = account_id)
         │
         ▼
  Initialize total_balance = 0
         │
         ▼
  For Each Child:
         │
         ├─ Is child a group & recursive?
         │  │
         │  ├─ Yes ──→ Recursive Call
         │  │          get_children_balances(child_id)
         │  │
         │  └─ No ───→ Call calculate_balance(child_id)
         │
         ▼
  Add child balance to total
         │
         ▼
  Round to 2 Decimals
         │
         ▼
  Log Aggregation
         │
         ▼
  Return total_balance
```

### Recursive Aggregation Example

```
Account Hierarchy:
1000 - Assets (Group)
├── 1100 - Current Assets (Group)
│   ├── 1110 - Cash ($5,000)
│   └── 1120 - Bank ($10,000)
└── 1500 - Fixed Assets (Group)
    ├── 1510 - Equipment ($20,000)
    └── 1520 - Vehicles ($15,000)

Calculation (recursive=True):
1. get_children_balances(1000)
2. Find children: [1100, 1500]
3. Process 1100 (is_group=True, recursive=True):
   - get_children_balances(1100)
   - Find children: [1110, 1120]
   - calculate_balance(1110) = $5,000
   - calculate_balance(1120) = $10,000
   - Return $15,000
4. Process 1500 (is_group=True, recursive=True):
   - get_children_balances(1500)
   - Find children: [1510, 1520]
   - calculate_balance(1510) = $20,000
   - calculate_balance(1520) = $15,000
   - Return $35,000
5. Aggregate: $15,000 + $35,000 = $50,000
6. Return $50,000
```

### Non-Recursive Aggregation Example

```
Same hierarchy, recursive=False:

get_children_balances(1000, recursive=False)
1. Find direct children: [1100, 1500]
2. calculate_balance(1100) = $15,000 (its current_balance)
3. calculate_balance(1500) = $35,000 (its current_balance)
4. Aggregate: $15,000 + $35,000 = $50,000
5. Return $50,000

Note: Assumes 1100 and 1500 current_balance is up-to-date
```

### Recursion Control

Prevent infinite loops:

```
Recursion Safeguards:
├── Maximum depth limit (e.g., 10 levels)
├── Track visited accounts
├── Detect circular references
└── Raise RecursionError if limit exceeded

Implementation:
visited = set()
max_depth = 10

def _get_children_recursive(account_id, depth=0):
    if depth > max_depth:
        raise RecursionError("Max hierarchy depth exceeded")
    if account_id in visited:
        raise CircularReferenceError("Circular parent reference")
    visited.add(account_id)
    # ... aggregation logic ...
```

### Performance Optimization

Aggregation can be expensive for deep hierarchies:

1. **Batch Loading**
   ```
   Load all descendant accounts in single query
   Use prefetch_related for parent relationships
   Avoid N+1 query problem
   ```

2. **Cache Aggregated Balances**
   ```
   Store aggregated balance in parent account
   Update when children change
   Trade-off: Storage vs. computation
   ```

3. **Materialized Path**
   ```
   Store full path in account (e.g., "1000.1100.1110")
   Query all descendants with LIKE query
   Single query for entire subtree
   ```

4. **Denormalized Balance**
   ```
   Store aggregated balance in parent
   Update via triggers or scheduled jobs
   Read directly without calculation
   ```

### Use Cases

#### Financial Statement Generation
```
Generate Balance Sheet:
1. Get Assets balance: get_children_balances(1000)
2. Get Liabilities balance: get_children_balances(2000)
3. Get Equity balance: get_children_balances(3000)
4. Verify: Assets = Liabilities + Equity
```

#### Departmental Reporting
```
Get Department Expenses:
1. Each department is a group account under 5000
2. get_children_balances(5100) for HR expenses
3. get_children_balances(5200) for IT expenses
4. Compare departmental spending
```

#### Budget vs. Actual
```
Compare budget to actual:
1. Budget stored at group level
2. Actual transactions in leaf accounts
3. get_children_balances(group_id) for actual
4. Compare to budget
```

### Expected Outcome
- get_children_balances() method implemented
- Recursive aggregation working
- Non-recursive aggregation supported
- Hierarchical balance calculation functional
- Efficient query strategy
- Recursion safeguards in place
- Comprehensive logging

### Verification Checklist
- [ ] get_children_balances(account_id, recursive) method added
- [ ] Method accepts account_id parameter
- [ ] recursive parameter supported (default True)
- [ ] Account validation performed
- [ ] is_group check implemented
- [ ] Direct children queried
- [ ] Active accounts filtered
- [ ] total_balance initialized to Decimal('0.00')
- [ ] Child iteration implemented
- [ ] Recursive call for group children (when recursive=True)
- [ ] calculate_balance() called for leaf children
- [ ] Balances aggregated using Decimal addition
- [ ] Final balance rounded to 2 decimals
- [ ] Circular reference detection implemented
- [ ] Maximum recursion depth enforced
- [ ] Aggregation logged at DEBUG level
- [ ] Decimal precision maintained
- [ ] Errors caught and handled
- [ ] Method returns Decimal value
- [ ] Method documented with docstring

---

## Summary

This document implemented the AccountBalanceService for real-time balance calculations:

- **Task 59:** Created AccountBalanceService class with helper methods for normal balance determination, journal entry queries, and balance formula application
- **Task 60:** Implemented calculate_balance() to compute real-time balances from journal entries considering debit/credit rules and normal balance conventions
- **Task 61:** Implemented update_balance() to persist calculated balances with transaction safety, row locking, and optional audit trail
- **Task 62:** Implemented get_children_balances() for hierarchical balance aggregation from child to parent accounts

The balance service now provides:
- Accurate balance calculations respecting normal balance rules
- Real-time balance computation from journal entries
- Historical balance calculation via as_of_date
- Persistent balance caching with timestamps
- Hierarchical balance aggregation for group accounts
- Transaction safety and row locking
- Comprehensive logging and error handling

**Next Steps:** Document 04 implements the AccountValidator for business rule enforcement and archive functionality.
