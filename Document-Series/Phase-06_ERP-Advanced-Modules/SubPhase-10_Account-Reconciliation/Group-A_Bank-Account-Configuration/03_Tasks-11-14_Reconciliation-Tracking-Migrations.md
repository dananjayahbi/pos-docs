# Tasks 11-14: Reconciliation Tracking and Migrations

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 10 - Account Reconciliation  
> **Group:** A - Bank Account Configuration  
> **Document:** 03 of 03  
> **Tasks Covered:** 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-04-10_Bank-Configuration-Fields.md](02_Tasks-04-10_Bank-Configuration-Fields.md)
- **→ Next Group:** [../Group-B_Statement-Import/](../Group-B_Statement-Import/)

---

## Document Overview

This document completes the BankAccount model by adding reconciliation tracking fields and executing database migrations. The reconciliation tracking fields store the date and balance of the last completed reconciliation, enabling proper opening balance calculation for subsequent reconciliation sessions. The active flag controls account availability, and migrations create the database schema.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 11 | Add Last Reconciled Date | Low | 10 min |
| 12 | Add Last Reconciled Balance | Low | 12 min |
| 13 | Add Active Flag | Low | 8 min |
| 14 | Run BankAccount Migrations | Low | 15 min |

---

## Task 11: Add Last Reconciled Date

### Overview
Add a field to track the date of the most recent completed reconciliation for the bank account. This date is used to determine the starting point for the next reconciliation session and to identify accounts that are overdue for reconciliation. It also provides an audit trail of reconciliation frequency.

### Dependencies
- Task 10: Add Currency Field

### Instructions

1. **Open bank_account.py model file**
   - Navigate to `apps/accounting/reconciliation/models/bank_account.py`
   - Add reconciliation tracking fields section

2. **Add last_reconciled_date field**
   - Add DateField for reconciliation date
   - Optional field (blank=True, null=True)
   - Initially null for new accounts
   - Add help_text explaining usage

3. **Position field appropriately**
   - Group with other reconciliation tracking fields
   - Place after currency field
   - Before is_active flag

4. **Add field indexing**
   - Add db_index=True
   - Enable filtering overdue accounts
   - Support reconciliation reports

### Field Specification

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DateField | Date-only storage |
| blank | True | Optional initially |
| null | True | Database constraint |
| default | None | No default date |
| db_index | True | Fast date filtering |
| help_text | "Date of last completed reconciliation" | User guidance |

### Last Reconciled Date Usage

**Initial State:**
- New accounts: null (never reconciled)
- First reconciliation: set after completion
- Historical tracking begins

**Update Timing:**
- Updated when reconciliation is completed
- Not updated for in-progress reconciliations
- Not updated for cancelled reconciliations
- Only successful completion updates

**Usage Scenarios:**
1. **Opening Balance Calculation**
   - Next reconciliation starts from this date
   - Opening balance = last reconciled balance
   - Date + 1 day = reconciliation start

2. **Overdue Detection**
   - Current date - last_reconciled_date > threshold
   - Example: Alert if > 35 days
   - Support monthly reconciliation schedule

3. **Audit Trail**
   - Track reconciliation frequency
   - Identify neglected accounts
   - Compliance reporting

### Reconciliation Schedule Examples

| Frequency | Threshold | Alert Condition |
|-----------|-----------|----------------|
| Daily | 3 days | last_reconciled_date < today - 3 days |
| Weekly | 10 days | last_reconciled_date < today - 10 days |
| Monthly | 35 days | last_reconciled_date < today - 35 days |
| Quarterly | 100 days | last_reconciled_date < today - 100 days |

### Date Tracking Workflow

```
Reconciliation Lifecycle
════════════════════════

New Bank Account:
  last_reconciled_date = null
  last_reconciled_balance = null
  │
  ▼
First Reconciliation Started:
  (Fields unchanged)
  │
  ▼
First Reconciliation Completed:
  last_reconciled_date = reconciliation_date
  last_reconciled_balance = closing_balance
  │
  ▼
Next Reconciliation Started:
  Opening balance = last_reconciled_balance
  Start date = last_reconciled_date + 1 day
  │
  ▼
Next Reconciliation Completed:
  last_reconciled_date = reconciliation_date (updated)
  last_reconciled_balance = closing_balance (updated)
```

### Query Examples (Conceptual)

**Find Overdue Accounts:**
Query accounts where last_reconciled_date is more than 35 days ago or is null.

**Find Never Reconciled:**
Query accounts where last_reconciled_date is null.

**Reconciliation Status Dashboard:**
Group accounts by days since last reconciliation and display counts.

### Expected Outcome
- Track last reconciliation timing
- Enable overdue detection
- Support opening balance calculation
- Provide audit trail

### Verification Checklist
- [ ] last_reconciled_date field added
- [ ] Field type is DateField
- [ ] Field is optional (blank=True, null=True)
- [ ] db_index set to True
- [ ] help_text provided
- [ ] Positioned with reconciliation fields

---

## Task 12: Add Last Reconciled Balance

### Overview
Add a field to store the closing balance from the most recent completed reconciliation. This balance serves as the opening balance for the next reconciliation session and provides a reference point for balance verification and discrepancy detection.

### Dependencies
- Task 11: Add Last Reconciled Date

### Instructions

1. **Open bank_account.py model file**
   - Continue in bank_account.py
   - Add balance tracking field

2. **Add last_reconciled_balance field**
   - Add DecimalField for balance amount
   - Optional field (blank=True, null=True)
   - Set max_digits=20, decimal_places=2
   - Add help_text explaining usage

3. **Position field appropriately**
   - Place immediately after last_reconciled_date
   - Group reconciliation tracking fields together
   - Maintain logical field ordering

4. **Consider currency implications**
   - Balance in account's currency
   - No currency conversion
   - Matches bank statement currency

### Field Specification

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | DecimalField | Precise decimal storage |
| max_digits | 20 | Large balance support |
| decimal_places | 2 | Standard currency precision |
| blank | True | Optional initially |
| null | True | Database constraint |
| default | None | No default balance |
| help_text | "Balance confirmed at last reconciliation" | User guidance |

### Balance Precision

**Decimal Configuration:**
- max_digits=20: Supports up to 999,999,999,999,999,999.99
- decimal_places=2: Standard currency precision
- Sufficient for business accounts
- Prevents floating-point errors

**Example Balances:**
- LKR 1,500,000.50
- USD 25,750.00
- EUR 18,250.75
- Negative for credit card accounts

### Last Reconciled Balance Usage

**Opening Balance Calculation:**
The last reconciled balance becomes the starting point for the next reconciliation:

```
Next Reconciliation Opening Balance
═══════════════════════════════════

Opening Balance = last_reconciled_balance

If last_reconciled_balance is null:
  Opening Balance = 0.00 (or manual entry)
  First reconciliation for account

If last_reconciled_balance exists:
  Opening Balance = last_reconciled_balance
  Continuing from previous reconciliation
```

**Balance Verification:**
Compare current GL balance to last reconciled balance plus subsequent transactions:

```
Expected Current Balance
════════════════════════

Expected Balance = last_reconciled_balance
                 + Sum(credits since last_reconciled_date)
                 - Sum(debits since last_reconciled_date)

If Current GL Balance ≠ Expected Balance:
  → Investigate discrepancy
  → May indicate unrecorded transactions
  → Or reconciliation errors
```

**Discrepancy Detection:**
Identify potential issues by comparing balances:
- Large unexpected changes
- Negative balances for asset accounts
- Balance exceeds credit limit (for credit cards)

### Balance Update Workflow

```
Balance Tracking Lifecycle
══════════════════════════

Reconciliation Completed:
  │
  ├─ Get statement closing_balance
  │  (e.g., LKR 1,850,000.00)
  │
  ├─ Validate matches GL balance
  │  (after adjustments)
  │
  ├─ Update last_reconciled_balance
  │  last_reconciled_balance = closing_balance
  │
  └─ Use in next reconciliation
     Opening Balance = LKR 1,850,000.00
```

### Multi-Currency Balances

**Currency Consistency:**
- Balance stored in account's currency
- LKR account: balance in LKR
- USD account: balance in USD
- No automatic conversion

**Reporting:**
- Display balance with currency symbol
- LKR 1,850,000.00
- USD 25,750.00
- Convert for consolidated reports (separate feature)

### Negative Balances

**Interpretation by Account Type:**

| Account Type | Negative Balance Meaning |
|-------------|--------------------------|
| CHECKING | Overdraft situation (concerning) |
| SAVINGS | Error or unusual activity |
| CREDIT_CARD | Amount owed (normal) |
| CASH | Should never be negative |

**Validation Considerations:**
- Allow negative for credit cards (normal)
- Warn for negative checking/savings (overdraft)
- Prevent negative cash accounts (physical cash)

### Expected Outcome
- Track last reconciled balance
- Enable opening balance calculation
- Support balance verification
- Detect discrepancies early

### Verification Checklist
- [ ] last_reconciled_balance field added
- [ ] DecimalField with max_digits=20, decimal_places=2
- [ ] Field is optional (blank=True, null=True)
- [ ] help_text provided
- [ ] Positioned after last_reconciled_date
- [ ] Grouped with reconciliation fields

---

## Task 13: Add Active Flag

### Overview
This task verifies that the is_active flag is properly configured in the BankAccount model. The field was added in Task 03 but needs confirmation of proper configuration, positioning, and integration with business logic for managing account lifecycle states.

### Dependencies
- Task 03: Create BankAccount Model

### Instructions

1. **Verify is_active field exists**
   - Check bank_account.py model file
   - Confirm field was added in Task 03
   - Ensure proper configuration

2. **Verify field properties**
   - BooleanField type
   - default=True (accounts active by default)
   - Required field (no blank/null)
   - help_text provided

3. **Verify field positioning**
   - Placed appropriately in model
   - Near other status/control fields
   - Before or after reconciliation tracking

4. **Verify field indexing**
   - Add db_index=True if not present
   - Enable filtering active accounts
   - Improve query performance

5. **Add model manager (optional)**
   - Consider adding ActiveAccountsManager
   - Filters only active accounts by default
   - Simplifies common queries

### Field Specification (Verification)

| Property | Expected Value | Verification |
|----------|---------------|--------------|
| Field Type | BooleanField | Confirm type |
| default | True | Active by default |
| blank | False | Not nullable |
| null | False | Database constraint |
| db_index | True | Fast filtering |
| help_text | Account status description | User guidance |

### Active Flag Usage

**Active Accounts (is_active=True):**
- Appear in account selection dropdowns
- Can create new reconciliations
- Can import bank statements
- Included in dashboard summaries
- Available for new transactions
- Shown in reports by default

**Inactive Accounts (is_active=False):**
- Hidden from standard selection lists
- Cannot create new reconciliations
- Cannot import new statements
- Historical data preserved
- Existing reconciliations accessible
- Included in historical reports
- Can be reactivated if needed

### Deactivation Scenarios

**When to Deactivate:**
1. **Account Closed:** Bank account closed at institution
2. **No Longer Used:** Business decision to stop using
3. **Duplicate Entry:** Consolidating duplicate accounts
4. **System Cleanup:** Archiving old test accounts

**Deactivation Process:**
1. Complete all pending reconciliations
2. Verify no outstanding items
3. Document reason for deactivation
4. Set is_active=False
5. Historical data remains intact

### Business Rules for Active Flag

```
Active Flag Constraints
═══════════════════════

Before Setting is_active=False:
  ├─ Check for in-progress reconciliations
  │  └─ If found: Require completion or cancellation
  │
  ├─ Check for unmatched statement lines
  │  └─ If found: Require resolution or documentation
  │
  └─ Optional: Require manager approval

Before Setting is_active=True (reactivation):
  ├─ Verify account still exists at bank
  ├─ Optional: Require approval
  └─ May need balance verification
```

### Query Filtering

**Default Queries:**
Filter to show only active accounts in standard views.

**Administrative Queries:**
Include inactive accounts for full account management and historical analysis.

**Reactivation:**
Allow reactivation of inactive accounts with appropriate permissions and validation.

### Model Manager Pattern (Optional)

**ActiveAccountsManager:**
Provides default filtering for active accounts only, simplifying common queries throughout the application.

**Usage:**
Default manager returns all accounts, active manager returns only active accounts.

### Expected Outcome
- Proper active flag configuration
- Account lifecycle management
- Soft delete functionality
- Historical data preservation

### Verification Checklist
- [ ] is_active field exists in model
- [ ] Field type is BooleanField
- [ ] default set to True
- [ ] Field is required
- [ ] db_index added or confirmed
- [ ] help_text provided
- [ ] Field positioned appropriately
- [ ] Business rules documented

---

## Task 14: Run BankAccount Migrations

### Overview
Generate and execute Django migrations to create the BankAccount model table and related database schema. This task creates the physical database structure based on the model definition, including all fields, indexes, and constraints.

### Dependencies
- Task 13: Add Active Flag
- All BankAccount model fields added
- PostgreSQL database configured

### Instructions

1. **Verify model completeness**
   - Review bank_account.py model
   - Confirm all fields added (Tasks 03-13)
   - Check all relationships defined
   - Verify Meta class configuration

2. **Update models package initialization**
   - Open `apps/accounting/reconciliation/models/__init__.py`
   - Import BankAccount model
   - Import BankAccountType enum
   - Add to __all__ list for exports

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run makemigrations command for accounting app
   - Review generated migration file

4. **Review migration file**
   - Check migration number sequence
   - Verify all fields included
   - Confirm indexes created
   - Check foreign key constraints

5. **Check for migration conflicts**
   - Look for conflicting migrations
   - Resolve any merge conflicts
   - Ensure migration dependencies correct

6. **Apply migration to database**
   - Run migrate command
   - Verify successful execution
   - Check for any errors

7. **Verify database schema**
   - Connect to PostgreSQL database
   - Check table creation
   - Verify column definitions
   - Confirm indexes created
   - Test foreign key constraints

8. **Test model in Django shell**
   - Open Django shell
   - Import BankAccount model
   - Create test instance
   - Verify field validation
   - Test save and query operations

### Migration Commands

**Generate Migration:**
```bash
python manage.py makemigrations accounting
```

Expected output indicates new migration file created for BankAccount model.

**Review Migration:**
```bash
python manage.py sqlmigrate accounting <migration_number>
```

Shows SQL that will be executed.

**Apply Migration:**
```bash
python manage.py migrate accounting
```

Applies pending migrations to database.

**Check Migration Status:**
```bash
python manage.py showmigrations accounting
```

Shows applied and pending migrations.

### Migration File Structure

**Expected Migration Contents:**
- CreateModel operation for BankAccount
- All field definitions with types
- Foreign key to Tenant
- Foreign key to Account (GL account)
- Foreign key to User (created_by, updated_by)
- Indexes on key fields
- Unique constraints (if any)
- Meta options (db_table, ordering)

### Database Schema Verification

**Table Name:**
- accounting_bank_account (from Meta.db_table)

**Columns:**
- id: BigAutoField (primary key)
- tenant_id: BigInteger (foreign key)
- account_type: VARCHAR(20)
- account_name: VARCHAR(100)
- account_number: VARCHAR(50)
- bank_name: VARCHAR(200)
- branch_name: VARCHAR(200), nullable
- branch_code: VARCHAR(20), nullable
- gl_account_id: BigInteger (foreign key)
- currency: VARCHAR(3)
- last_reconciled_date: DATE, nullable
- last_reconciled_balance: DECIMAL(20,2), nullable
- is_active: BOOLEAN
- created_at: TIMESTAMP
- updated_at: TIMESTAMP
- created_by_id: BigInteger (foreign key), nullable
- updated_by_id: BigInteger (foreign key), nullable

**Indexes:**
- Primary key on id
- Foreign key indexes on tenant_id, gl_account_id, created_by_id, updated_by_id
- Index on account_number
- Index on bank_name
- Index on currency
- Index on last_reconciled_date
- Index on is_active

**Constraints:**
- Foreign keys with appropriate on_delete actions
- NOT NULL constraints on required fields
- DEFAULT values where specified

### Testing the Model

**Test Cases:**

1. **Create Bank Account**
   - Create new BankAccount instance
   - Set all required fields
   - Save to database
   - Verify created successfully

2. **Query Bank Accounts**
   - Filter by tenant
   - Filter by account_type
   - Filter by is_active
   - Test ordering

3. **Test Validation**
   - Try creating without required fields
   - Verify ValidationError raised
   - Test GL account type validation
   - Test tenant isolation

4. **Test Relationships**
   - Access tenant from bank account
   - Access GL account from bank account
   - Access bank accounts from tenant (reverse relation)
   - Access bank accounts from GL account (reverse relation)

### Common Migration Issues

**Issue: Migration Conflicts**
- Cause: Multiple developers creating migrations
- Solution: Merge migrations or create merge migration

**Issue: Foreign Key Errors**
- Cause: Referenced model doesn't exist
- Solution: Check migration dependencies, add dependency

**Issue: Index Name Too Long**
- Cause: PostgreSQL index name limit
- Solution: Specify custom index name in db_index

**Issue: Data Migration Needed**
- Cause: Changing field constraints with existing data
- Solution: Create data migration before schema migration

### Post-Migration Verification Checklist

- [ ] Migration file generated
- [ ] Migration file reviewed for accuracy
- [ ] Migration applied successfully
- [ ] Table created in database
- [ ] All columns present with correct types
- [ ] Indexes created
- [ ] Foreign keys established
- [ ] Test instance creation successful
- [ ] Test queries working
- [ ] Validation rules enforced

### Expected Outcome
- Database table for BankAccount created
- All fields properly defined
- Indexes for performance
- Foreign key relationships established
- Model ready for use in application

### Verification Checklist
- [ ] models/__init__.py updated with imports
- [ ] makemigrations command executed
- [ ] Migration file generated
- [ ] Migration file reviewed
- [ ] migrate command executed
- [ ] Migration applied successfully
- [ ] Database schema verified
- [ ] Test instance created
- [ ] Queries tested
- [ ] No errors in console

---

## Summary

This document completed the BankAccount model by adding reconciliation tracking fields and executing database migrations. The model now tracks the date and balance of the last reconciliation, supports active/inactive status management, and has a complete database schema in PostgreSQL.

### Completed Tasks
- ✅ Task 11: Add Last Reconciled Date
- ✅ Task 12: Add Last Reconciled Balance
- ✅ Task 13: Add Active Flag (verification)
- ✅ Task 14: Run BankAccount Migrations

### Group A Summary

**BankAccount Model Complete:**
- ✅ Reconciliation module structure created
- ✅ BankAccountType enumeration defined
- ✅ Core BankAccount model implemented
- ✅ Bank identification fields added
- ✅ GL account linking configured
- ✅ Currency support implemented
- ✅ Reconciliation tracking added
- ✅ Database migrations applied

**Model Capabilities:**
- Multi-tenant bank account management
- Proper GL account integration
- Bank and branch identification
- Multi-currency support (LKR default)
- Reconciliation tracking and history
- Active/inactive status control
- Complete audit trail

### Next Group
Proceed to **Group B: Statement Import** to implement bank statement and statement line models with CSV import functionality.
