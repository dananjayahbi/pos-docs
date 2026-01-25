# Tasks 13-16: Migrations, Fixtures, and Testing

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** A - Account Type Definitions  
> **Document:** 04 of 04  
> **Tasks Covered:** 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-07-12_AccountTypeConfig-Model.md](03_Tasks-07-12_AccountTypeConfig-Model.md)
- **→ Next Group:** [Group-B_Account-Model-Hierarchy](../Group-B_Account-Model-Hierarchy/)

---

## Document Overview

This document covers the finalization of the AccountTypeConfig model through database migrations, creation of JSON fixtures for the five account types, implementation of a management command to load fixtures, and comprehensive testing to ensure the configuration system works correctly.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 13 | Run AccountTypeConfig Migrations | Low | 10 min |
| 14 | Create AccountType Fixture | Medium | 30 min |
| 15 | Create Load Fixture Command | Medium | 25 min |
| 16 | Test AccountType Configuration | Medium | 30 min |

---

## Task 13: Run AccountTypeConfig Migrations

### Overview
Generate and run Django migrations to create the AccountTypeConfig database table with all defined fields. This task transforms the model definition into actual database schema, enabling data storage and retrieval.

### Dependencies
- Task 12: Add Type Description field
- All model fields defined

### Instructions

1. **Verify model is complete**
   - Review AccountTypeConfig model in `apps/accounting/models/account_type.py`
   - Ensure all fields are properly defined
   - Check imports and model inheritance

2. **Import model in models package**
   - Open `apps/accounting/models/__init__.py`
   - Import AccountTypeConfig from account_type module
   - Makes model available to Django's migration system

3. **Check for migration conflicts**
   - Run `python manage.py makemigrations --dry-run`
   - Verify no conflicting migrations exist
   - Review expected changes

4. **Generate migration file**
   - Run `python manage.py makemigrations accounting`
   - Django creates migration file in `apps/accounting/migrations/`
   - Review generated migration for accuracy

5. **Inspect migration file**
   - Open the generated migration file
   - Verify CreateModel operation includes all fields
   - Check field types, constraints, and indexes
   - Ensure Meta options are included

6. **Run migration for shared schema (if applicable)**
   - If AccountTypeConfig is in SHARED_APPS
   - Run `python manage.py migrate_schemas --shared`
   - Creates table in public schema

7. **Run migration for tenant schemas**
   - If AccountTypeConfig is in TENANT_APPS
   - Run `python manage.py migrate_schemas --tenant`
   - Creates table in all tenant schemas

8. **Verify table creation**
   - Connect to database using psql or GUI tool
   - Check for `accounting_account_type_config` table
   - Verify column definitions match model fields
   - Confirm indexes and constraints exist

### Migration File Structure

The generated migration should include:
- **dependencies:** Link to previous migrations
- **operations:** CreateModel operation
- **fields:** All seven fields (type_name, normal_balance, code_start, code_end, display_order, description, id)
- **options:** Meta options (db_table, ordering, verbose_name)
- **indexes:** Indexes on type_name, display_order, code_start, code_end
- **constraints:** Unique constraints on type_name and display_order

### Multi-Tenancy Migration Considerations

#### Shared Schema Approach
If AccountTypeConfig is shared across tenants:
- Migrate to public schema only
- One set of account types for all tenants
- Consistent across organization
- Run: `python manage.py migrate_schemas --shared`

#### Tenant Schema Approach
If AccountTypeConfig is tenant-specific:
- Migrate to each tenant schema
- Allows customization per tenant
- More flexible but complex
- Run: `python manage.py migrate_schemas --tenant`

**Recommendation:** Use shared schema approach for standard account types.

### Expected Database Schema

Table: `accounting_account_type_config`

| Column | Type | Constraints | Index |
|--------|------|-------------|-------|
| id | bigint | PRIMARY KEY | Yes (auto) |
| type_name | varchar(30) | NOT NULL, UNIQUE | Yes |
| normal_balance | varchar(10) | NOT NULL | No |
| code_start | integer | NOT NULL | Yes |
| code_end | integer | NOT NULL | Yes |
| display_order | smallint | NOT NULL, UNIQUE | Yes |
| description | text | NULL | No |

### Verification Commands

1. **Check migration status:**
   ```
   python manage.py showmigrations accounting
   ```

2. **List database tables:**
   ```
   python manage.py dbshell
   \dt accounting_*
   ```

3. **Describe table structure:**
   ```
   \d accounting_account_type_config
   ```

### Expected Outcome
- Migration file generated successfully
- Database table created
- All fields, indexes, and constraints in place
- Ready for data insertion

### Verification Checklist
- [ ] AccountTypeConfig imported in models/__init__.py
- [ ] Migration file generated without errors
- [ ] Migration file includes all fields
- [ ] Migration run successfully
- [ ] Table exists in database
- [ ] Table structure matches model definition
- [ ] Indexes created on key fields
- [ ] Unique constraints enforced

---

## Task 14: Create AccountType Fixture

### Overview
Create a JSON fixture file containing the five fundamental account types with their configurations. This fixture provides the seed data needed to populate the AccountTypeConfig table with standard account type definitions.

### Dependencies
- Task 13: Run AccountTypeConfig Migrations

### Instructions

1. **Create fixtures directory**
   - Navigate to `apps/accounting/`
   - Create `fixtures/` directory if not exists
   - Django automatically searches this directory

2. **Create fixture file**
   - Create `account_types.json` in fixtures directory
   - Full path: `apps/accounting/fixtures/account_types.json`
   - Use proper JSON formatting

3. **Define fixture structure**
   - JSON array of objects
   - Each object represents one AccountTypeConfig record
   - Include model name, primary key, and fields

4. **Add ASSET account type configuration**
   - type_name: "ASSET"
   - normal_balance: "DEBIT"
   - code_start: 1000
   - code_end: 1999
   - display_order: 1
   - description: Comprehensive asset description

5. **Add LIABILITY account type configuration**
   - type_name: "LIABILITY"
   - normal_balance: "CREDIT"
   - code_start: 2000
   - code_end: 2999
   - display_order: 2
   - description: Comprehensive liability description

6. **Add EQUITY account type configuration**
   - type_name: "EQUITY"
   - normal_balance: "CREDIT"
   - code_start: 3000
   - code_end: 3999
   - display_order: 3
   - description: Comprehensive equity description

7. **Add REVENUE account type configuration**
   - type_name: "REVENUE"
   - normal_balance: "CREDIT"
   - code_start: 4000
   - code_end: 4999
   - display_order: 4
   - description: Comprehensive revenue description

8. **Add EXPENSE account type configuration**
   - type_name: "EXPENSE"
   - normal_balance: "DEBIT"
   - code_start: 5000
   - code_end: 5999
   - display_order: 5
   - description: Comprehensive expense description

9. **Validate JSON syntax**
   - Use JSON validator or linter
   - Ensure proper formatting
   - Check for trailing commas, missing quotes
   - Verify bracket and brace matching

### Fixture Format Structure

Each record in the fixture should follow this structure:
```
{
  "model": "accounting.accounttypeconfig",
  "pk": 1,
  "fields": {
    "type_name": "ASSET",
    "normal_balance": "DEBIT",
    "code_start": 1000,
    "code_end": 1999,
    "display_order": 1,
    "description": "..."
  }
}
```

### Account Type Fixture Data

#### ASSET Configuration
- **Type:** ASSET
- **Normal Balance:** DEBIT
- **Code Range:** 1000-1999
- **Display Order:** 1
- **Description:** "Assets represent resources owned or controlled by the business that provide future economic benefits. Assets include cash, bank balances, inventory, equipment, property, and amounts owed by customers (accounts receivable). Assets have a debit normal balance and increase with debit entries. Common examples include: Cash and Bank Accounts, Accounts Receivable, Inventory, Prepaid Expenses, Fixed Assets (land, buildings, equipment, vehicles), and Intangible Assets (patents, trademarks, goodwill)."

#### LIABILITY Configuration
- **Type:** LIABILITY
- **Normal Balance:** CREDIT
- **Code Range:** 2000-2999
- **Display Order:** 2
- **Description:** "Liabilities represent obligations owed by the business to external parties. These are debts or financial commitments that must be settled in the future through transfer of assets or provision of services. Liabilities have a credit normal balance and increase with credit entries. Common examples include: Accounts Payable, Loans Payable, Credit Card Payables, Accrued Expenses, Payroll Liabilities, and Tax Liabilities (VAT, NBT, income tax payable)."

#### EQUITY Configuration
- **Type:** EQUITY
- **Normal Balance:** CREDIT
- **Code Range:** 3000-3999
- **Display Order:** 3
- **Description:** "Equity represents the owner's stake in the business. It is the residual interest in assets after deducting liabilities. Equity includes capital contributed by owners and profits retained in the business. Equity has a credit normal balance and increases with credit entries. The accounting equation: Assets = Liabilities + Equity. Common examples include: Owner's Capital, Retained Earnings, Current Year Profit/Loss, and Drawings/Dividends."

#### REVENUE Configuration
- **Type:** REVENUE
- **Normal Balance:** CREDIT
- **Code Range:** 4000-4999
- **Display Order:** 4
- **Description:** "Revenue represents income earned by the business from its normal operations and other sources. Revenue increases equity and is recognized when earned, regardless of when cash is received. Revenue has a credit normal balance and increases with credit entries. Revenue increases net income on the income statement. Common examples include: Sales Revenue, Service Revenue, Rental Income, Interest Income, Commission Income, and Other Income."

#### EXPENSE Configuration
- **Type:** EXPENSE
- **Normal Balance:** DEBIT
- **Code Range:** 5000-5999
- **Display Order:** 5
- **Description:** "Expenses represent costs incurred by the business in the process of earning revenue. Expenses decrease equity and are recognized when incurred, regardless of when cash is paid. Expenses have a debit normal balance and increase with debit entries. Expenses decrease net income on the income statement. Common examples include: Cost of Goods Sold, Rent Expense, Salaries and Wages, Utilities, Office Supplies, Depreciation, Interest Expense, and Advertising and Marketing."

### Fixture Loading Methods

#### Method 1: Django loaddata Command
```
python manage.py loaddata account_types
```
- Searches fixtures directory automatically
- Loads into current database
- Simple and straightforward

#### Method 2: Custom Management Command
- More control over loading process
- Can add validation logic
- Can handle tenant-specific loading
- Recommended approach (next task)

### Sri Lankan Context in Descriptions

Enhance descriptions with local terminology:
- Reference LKR currency
- Include Sri Lankan tax types (VAT, NBT)
- Mention local business practices
- Use familiar examples

### Expected Outcome
- JSON fixture file created with five account types
- All configurations accurate and complete
- Valid JSON syntax
- Ready for loading into database

### Verification Checklist
- [ ] `apps/accounting/fixtures/` directory exists
- [ ] `account_types.json` file created
- [ ] Five account type records defined
- [ ] All required fields included
- [ ] Normal balances correct (Asset/Expense=DEBIT, others=CREDIT)
- [ ] Code ranges correct (1000-1999, 2000-2999, etc.)
- [ ] Display orders sequential (1-5)
- [ ] Descriptions comprehensive and accurate
- [ ] JSON syntax valid
- [ ] File can be loaded without errors

---

## Task 15: Create Load Fixture Command

### Overview
Create a custom Django management command to load the account type fixtures into the database. This command provides controlled fixture loading with validation, error handling, and support for multi-tenancy scenarios.

### Dependencies
- Task 14: Create AccountType Fixture

### Instructions

1. **Verify management commands structure**
   - Ensure `apps/accounting/management/commands/` exists
   - Verify `__init__.py` files in management and commands directories
   - Django automatically discovers commands here

2. **Create management command file**
   - Create `load_account_types.py` in commands directory
   - Full path: `apps/accounting/management/commands/load_account_types.py`
   - Command name will be `load_account_types`

3. **Import required modules**
   - Import BaseCommand from Django management
   - Import AccountTypeConfig model
   - Import NormalBalance enum
   - Import transaction support for atomic operations
   - Import JSON for fixture loading

4. **Create Command class**
   - Inherit from BaseCommand
   - Set helpful help text
   - Define command options if needed

5. **Implement handle method**
   - Main entry point for command execution
   - Contains all loading logic
   - Handles success and error cases

6. **Add data validation**
   - Check if account types already exist
   - Optionally clear existing data (with caution)
   - Validate fixture data before insertion
   - Check for required fields

7. **Implement atomic transaction**
   - Wrap loading in database transaction
   - Ensures all-or-nothing loading
   - Rollback on any error
   - Prevents partial data corruption

8. **Create account type records**
   - Load fixture JSON file
   - Iterate through account type definitions
   - Create AccountTypeConfig objects
   - Set all fields from fixture data

9. **Add logging and output**
   - Log start of loading process
   - Output progress for each account type
   - Report success message with count
   - Log any errors encountered

10. **Add error handling**
    - Catch JSON parsing errors
    - Catch database integrity errors
    - Catch validation errors
    - Provide helpful error messages

11. **Support command options**
    - Add `--clear` option to delete existing data
    - Add `--dry-run` option to preview changes
    - Add `--verbose` option for detailed output
    - Document options in help text

### Command Execution Flow

```
Command Start
    │
    ▼
Check Existing Data
    │
    ├─ If exists and --clear not set
    │  └─> Skip or warn
    │
    ├─ If --clear set
    │  └─> Delete existing records
    │
    ▼
Load Fixture File
    │
    ▼
Parse JSON Data
    │
    ▼
Validate Data
    │
    ▼
Begin Transaction
    │
    ▼
For Each Account Type:
    ├─ Create AccountTypeConfig object
    ├─ Set all fields
    ├─ Save to database
    └─ Log progress
    │
    ▼
Commit Transaction
    │
    ▼
Report Success
```

### Command Usage Examples

#### Load Account Types (Default)
```
python manage.py load_account_types
```

#### Clear Existing and Reload
```
python manage.py load_account_types --clear
```

#### Dry Run (Preview)
```
python manage.py load_account_types --dry-run
```

#### Verbose Output
```
python manage.py load_account_types --verbose
```

### Multi-Tenancy Considerations

#### Shared Schema Approach
If AccountTypeConfig is in public schema:
- Load once for entire system
- All tenants share same configuration
- Run after shared schema migrations

#### Tenant Schema Approach
If AccountTypeConfig is in tenant schemas:
- Load for each tenant separately
- Iterate through tenants
- Use tenant activation context
- Consider loading during tenant creation

### Error Scenarios

#### File Not Found
- Fixture file missing from fixtures directory
- Solution: Verify file path and existence

#### JSON Parse Error
- Invalid JSON syntax in fixture file
- Solution: Validate JSON format

#### Integrity Error
- Duplicate account type names
- Overlapping code ranges
- Solution: Clear existing data or fix fixture

#### Validation Error
- Invalid enum values
- code_end <= code_start
- Solution: Fix fixture data

### Expected Outcome
- Custom management command created
- Fixtures load successfully
- Five account types in database
- Atomic transaction ensures data integrity

### Verification Checklist
- [ ] Command file created in correct location
- [ ] Command class inherits from BaseCommand
- [ ] handle() method implemented
- [ ] Atomic transaction wraps loading
- [ ] Fixture file loading implemented
- [ ] Error handling in place
- [ ] Success message displayed
- [ ] Command options documented
- [ ] Can run: `python manage.py load_account_types`
- [ ] Five account types loaded successfully

---

## Task 16: Test AccountType Configuration

### Overview
Create comprehensive tests for the AccountTypeConfig model and related functionality. Tests verify model behavior, fixture loading, validation rules, and ensure the configuration system works correctly for the Chart of Accounts.

### Dependencies
- Task 15: Create Load Fixture Command

### Instructions

1. **Create test file**
   - Navigate to `apps/accounting/tests/`
   - Create `test_account_types.py`
   - Import Django test framework classes

2. **Import required modules**
   - Import TestCase from Django
   - Import AccountTypeConfig model
   - Import AccountType, NormalBalance enums
   - Import management call_command
   - Import ValidationError

3. **Create test class for model**
   - Name: `TestAccountTypeConfigModel`
   - Inherit from TestCase
   - Contains tests for model functionality

4. **Test account type creation**
   - Create AccountTypeConfig instance
   - Set all required fields
   - Save to database
   - Assert record exists

5. **Test unique constraints**
   - Create first account type
   - Attempt to create duplicate type_name
   - Assert IntegrityError raised
   - Test display_order uniqueness

6. **Test code range validation**
   - Create account type with code_end <= code_start
   - Call model's clean() method
   - Assert ValidationError raised
   - Test valid range passes

7. **Test enum field validation**
   - Test valid enum values accepted
   - Test invalid values rejected
   - Test type_name uses AccountType enum
   - Test normal_balance uses NormalBalance enum

8. **Test model string representation**
   - Create account type
   - Call str(account_type)
   - Assert returns expected format
   - Verify display name shown

9. **Test ordering**
   - Create multiple account types
   - Query all records
   - Assert ordered by display_order
   - Verify order matches expectations

10. **Create test class for fixtures**
    - Name: `TestAccountTypeFixtures`
    - Tests fixture loading functionality

11. **Test fixture loading**
    - Call management command: `load_account_types`
    - Assert five account types created
    - Verify all types present
    - Check configuration correctness

12. **Test fixture data accuracy**
    - Query each account type by name
    - Assert code ranges correct
    - Assert normal balances correct
    - Assert display orders correct

13. **Test account type retrieval**
    - Query by type_name
    - Query by code range
    - Test filtering by normal_balance
    - Test ordering in queries

14. **Test code range validation logic**
    - Test code within range (valid)
    - Test code below start (invalid)
    - Test code above end (invalid)
    - Test boundary values

15. **Add integration tests**
    - Test fixture loading command
    - Test command options (--clear, --dry-run)
    - Test error scenarios
    - Test multi-tenant isolation (if applicable)

### Test Coverage Areas

#### Model Tests
- Field constraints and validation
- Unique constraints
- Range validation
- Enum value validation
- String representation
- Default ordering
- Model methods

#### Fixture Tests
- Fixture file loading
- Data accuracy
- All five types present
- Configuration correctness
- No duplicates

#### Validation Tests
- Code range overlap detection
- code_end > code_start validation
- Invalid enum value rejection
- Null/blank field validation

#### Query Tests
- Retrieval by type_name
- Filtering by normal_balance
- Ordering verification
- Code range queries

### Test Data Examples

#### Valid Account Type
```
type_name: "ASSET"
normal_balance: "DEBIT"
code_start: 1000
code_end: 1999
display_order: 1
```

#### Invalid Account Type (Bad Range)
```
type_name: "ASSET"
normal_balance: "DEBIT"
code_start: 1999  # Should be less than end
code_end: 1000
display_order: 1
```

### Running Tests

#### Run All Accounting Tests
```
python manage.py test apps.accounting
```

#### Run Specific Test File
```
python manage.py test apps.accounting.tests.test_account_types
```

#### Run with Coverage
```
coverage run --source='apps.accounting' manage.py test apps.accounting
coverage report
```

### Expected Test Results

All tests should pass, including:
- ✓ Account type creation successful
- ✓ Unique constraints enforced
- ✓ Code range validation works
- ✓ Enum validation works
- ✓ Fixture loading succeeds
- ✓ Five account types loaded
- ✓ Configuration data accurate
- ✓ Queries return correct results

### Expected Outcome
- Comprehensive test suite created
- All tests pass successfully
- Model behavior verified
- Fixture loading validated
- Code confidence established

### Verification Checklist
- [ ] Test file created: `test_account_types.py`
- [ ] Model test class created
- [ ] Account type creation test passes
- [ ] Unique constraint tests pass
- [ ] Code range validation tests pass
- [ ] Enum validation tests pass
- [ ] String representation test passes
- [ ] Ordering test passes
- [ ] Fixture test class created
- [ ] Fixture loading test passes
- [ ] Fixture data accuracy tests pass
- [ ] All five types verified
- [ ] Integration tests pass
- [ ] Test coverage adequate (>80%)
- [ ] All tests run without errors

---

## Group A Completion Summary

After completing all tasks in Group A, you will have:

### ✅ Deliverables
1. **Accounting Django App**
   - Properly structured and registered
   - Organized models and fixtures directories

2. **Enumeration Types**
   - AccountType enum (5 types)
   - AccountCategory enum (7 categories)
   - AccountStatus enum (3 statuses)
   - NormalBalance enum (2 values)

3. **AccountTypeConfig Model**
   - Complete model definition
   - All fields implemented
   - Validation logic in place

4. **Database**
   - Migrations generated and run
   - Table created with proper schema
   - Indexes and constraints enforced

5. **Seed Data**
   - JSON fixture with 5 account types
   - Custom management command
   - Data loaded successfully

6. **Tests**
   - Comprehensive test suite
   - Model and fixture tests
   - All tests passing

### 📊 Account Types Configured

| Type | Code Range | Normal Balance | Order |
|------|------------|----------------|-------|
| ASSET | 1000-1999 | DEBIT | 1 |
| LIABILITY | 2000-2999 | CREDIT | 2 |
| EQUITY | 3000-3999 | CREDIT | 3 |
| REVENUE | 4000-4999 | CREDIT | 4 |
| EXPENSE | 5000-5999 | DEBIT | 5 |

### 🎯 Key Achievements
- Foundation for Chart of Accounts established
- Double-entry bookkeeping principles implemented
- Account type classification system in place
- Code range validation framework ready
- Data seeding mechanism functional

### ➡️ Next Steps
Proceed to **Group B: Account Model & Hierarchy** to create the main Account model using django-mptt for hierarchical tree structure, implementing parent-child relationships and all account management fields.

---

## Notes for AI Agents

### Testing Best Practices
- Use Django's TestCase for database isolation
- Create setUp() method for common test data
- Use descriptive test method names
- Test both positive and negative scenarios
- Aim for high test coverage (>80%)

### Fixture Management
- Store fixtures in app's fixtures/ directory
- Use descriptive filenames (account_types.json)
- Include comments in JSON for documentation
- Version control fixture files
- Consider environment-specific fixtures

### Management Commands
- Follow Django command conventions
- Provide helpful help text
- Add options for flexibility
- Include error handling
- Log progress and results
- Make commands idempotent when possible

### Migration Best Practices
- Review generated migrations before applying
- Test migrations in development first
- Back up database before production migrations
- Consider data migrations separately
- Document complex migrations
- Test rollback scenarios

### Multi-Tenancy Reminders
- Decide schema placement (shared vs tenant)
- Test with multiple tenants if tenant-specific
- Ensure data isolation
- Consider tenant provisioning flow
- Document multi-tenancy decisions
