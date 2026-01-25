# Tasks 51-55: COA Fixtures and Templates

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** D - Account Management Features  
> **Document:** 01 of 04  
> **Tasks Covered:** 51, 52, 53, 54, 55

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-56-58_COA-Initializer-Service.md](02_Tasks-56-58_COA-Initializer-Service.md)

---

## Document Overview

This document establishes the foundation for chart of accounts templates and fixtures. It covers converting the default account structure from Group-C into a reusable JSON fixture, creating the COATemplate model for industry-specific account variations, and running migrations. These elements enable automated tenant COA initialization and support for multiple industry templates.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Default COA Fixture | Medium | 45 min |
| 52 | Create COA Template Model | Medium | 30 min |
| 53 | Add Template Name Field | Low | 10 min |
| 54 | Add Template Accounts JSON | Low | 15 min |
| 55 | Run Template Migrations | Low | 10 min |

---

## Task 51: Create Default COA Fixture

### Overview
Convert all account definitions from Group-C (Assets, Liabilities, Equity, Revenue, Expenses) into a comprehensive JSON fixture file. This fixture serves as the default chart of accounts template for new tenants and provides the foundation for initializing standard accounting structures. The fixture includes all account codes, names, types, hierarchical relationships, and configuration settings.

### Dependencies
- Task 50: All Group-C expense accounts defined
- Account model structure finalized
- Account type constants established
- Hierarchical parent-child relationships defined

### Instructions

1. **Create fixtures directory**
   - Navigate to `apps/accounting/` application directory
   - Create `fixtures/` subdirectory if not exists
   - This directory stores static data for database seeding

2. **Create default COA fixture file**
   - Create file named `default_coa.json` in fixtures directory
   - This will contain all standard account definitions
   - Use Django fixture JSON format

3. **Define fixture metadata structure**
   - Each account entry needs model reference
   - Include primary key placeholder (will be auto-generated)
   - Define all required field mappings

4. **Add Asset accounts to fixture**
   - Include all accounts from Tasks 26-30
   - Current Assets group (1000-1999 range)
   - Bank accounts, cash, receivables, inventory, prepaid
   - Non-Current Assets group (1500-1999 range)
   - Fixed assets, accumulated depreciation, intangibles
   - Maintain hierarchical parent references

5. **Add Liability accounts to fixture**
   - Include all accounts from Tasks 31-35
   - Current Liabilities (2000-2499 range)
   - Accounts payable, short-term loans, accrued expenses
   - Non-Current Liabilities (2500-2999 range)
   - Long-term loans, deferred revenue, bonds payable
   - Preserve parent-child relationships

6. **Add Equity accounts to fixture**
   - Include all accounts from Tasks 36-40
   - Owner's Equity section (3000-3999 range)
   - Share capital, retained earnings, current year profit
   - Partner capital accounts
   - Drawings and distributions

7. **Add Revenue accounts to fixture**
   - Include all accounts from Tasks 41-44
   - Operating Revenue (4000-4499 range)
   - Sales revenue, service revenue, subscription revenue
   - Other Revenue (4500-4999 range)
   - Interest income, rental income, miscellaneous income
   - Group under revenue parent accounts

8. **Add Expense accounts to fixture**
   - Include all accounts from Tasks 45-50
   - Operating Expenses (5000-5999 range)
   - Cost of goods sold, salaries, rent, utilities
   - Depreciation, marketing, office supplies
   - Non-Operating Expenses (6000-6999 range)
   - Interest expense, loss on disposal, foreign exchange loss
   - Maintain expense category hierarchies

9. **Configure account attributes**
   - Set account_code for each entry
   - Set account_name with proper capitalization
   - Set account_type (ASSET, LIABILITY, EQUITY, REVENUE, EXPENSE)
   - Set normal_balance (DEBIT or CREDIT)
   - Set parent_account references where applicable
   - Set is_group flag (True for parent accounts)
   - Set is_system_account for critical accounts
   - Set allow_direct_posting based on account type
   - Initialize current_balance to 0.00
   - Set opening_balance to 0.00
   - Set status to ACTIVE

10. **Organize fixture structure**
    - Group accounts by type for readability
    - Order accounts by account_code
    - Add comments between sections
    - Use consistent indentation (2 or 4 spaces)
    - Validate JSON syntax

11. **Handle parent-child references**
    - Parent accounts must appear before children
    - Use account_code as reference identifier
    - Ensure parent codes match exactly
    - Root accounts have null parent

12. **Add metadata fields**
    - Include description for each account
    - Add notes for complex accounts
    - Set creation metadata
    - Tag system-critical accounts

### Fixture Data Structure

Each account entry in the fixture follows this pattern:

```
Account Entry Structure:
├── model: "accounting.Account"
├── pk: null (auto-generated)
└── fields:
    ├── account_code: "1000"
    ├── account_name: "Current Assets"
    ├── account_type: "ASSET"
    ├── normal_balance: "DEBIT"
    ├── parent_account: null
    ├── is_group: true
    ├── is_system_account: false
    ├── allow_direct_posting: false
    ├── current_balance: "0.00"
    ├── opening_balance: "0.00"
    ├── status: "ACTIVE"
    ├── description: "Parent account for current assets"
    └── notes: ""
```

### Account Organization

| Section | Code Range | Count | Purpose |
|---------|------------|-------|---------|
| Assets | 1000-1999 | ~25-30 | Company resources and holdings |
| Liabilities | 2000-2999 | ~20-25 | Company obligations |
| Equity | 3000-3999 | ~10-15 | Owner's investment and earnings |
| Revenue | 4000-4999 | ~15-20 | Income from operations |
| Expenses | 5000-6999 | ~40-50 | Cost of operations |

### Parent-Child Examples

#### Asset Hierarchy
```
1000 - Current Assets (Group)
  ├── 1100 - Cash and Bank (Group)
  │   ├── 1110 - Petty Cash
  │   └── 1120 - Bank Account - Primary
  └── 1200 - Accounts Receivable (Group)
      ├── 1210 - Trade Debtors
      └── 1220 - Other Receivables
```

#### Expense Hierarchy
```
5000 - Operating Expenses (Group)
  ├── 5100 - Personnel Costs (Group)
  │   ├── 5110 - Salaries and Wages
  │   └── 5120 - Employee Benefits
  └── 5200 - Facility Costs (Group)
      ├── 5210 - Rent Expense
      └── 5220 - Utilities Expense
```

### System Account Flags

Mark these accounts as `is_system_account: true`:
- 1110 - Petty Cash
- 1120 - Bank Account - Primary
- 2100 - Accounts Payable - Trade
- 3300 - Retained Earnings
- 3400 - Current Year Profit/Loss
- 4100 - Sales Revenue
- 5100 - Cost of Goods Sold

### Direct Posting Rules

Set `allow_direct_posting: false` for:
- All group/parent accounts (is_group: true)
- Summary accounts that only aggregate children
- Control accounts

Set `allow_direct_posting: true` for:
- Leaf accounts that receive transactions
- Operating accounts for daily use
- Detailed tracking accounts

### Expected Outcome
- Complete JSON fixture with 100-120 accounts
- All Group-C accounts represented
- Proper hierarchical structure maintained
- System accounts flagged appropriately
- Ready for database loading
- Foundation for tenant initialization

### Verification Checklist
- [ ] `apps/accounting/fixtures/default_coa.json` created
- [ ] All Asset accounts included (1000-1999)
- [ ] All Liability accounts included (2000-2999)
- [ ] All Equity accounts included (3000-3999)
- [ ] All Revenue accounts included (4000-4999)
- [ ] All Expense accounts included (5000-6999)
- [ ] Account codes unique and in correct ranges
- [ ] Parent-child relationships properly defined
- [ ] is_group flags set correctly
- [ ] is_system_account flags set for critical accounts
- [ ] allow_direct_posting set appropriately
- [ ] All normal_balance values correct
- [ ] All account_type values match constants
- [ ] JSON syntax valid
- [ ] File properly formatted and readable
- [ ] Fixture loadable via Django loaddata command

---

## Task 52: Create COA Template Model

### Overview
Create the COATemplate model to store industry-specific chart of accounts templates. This model enables businesses to initialize their COA based on predefined templates tailored to different industries (Retail, Service, Manufacturing, Restaurant, etc.). Templates provide standardized account structures while allowing customization per tenant.

### Dependencies
- Task 51: Default COA fixture created
- Account model exists
- Django project configured
- Multi-tenancy structure in place

### Instructions

1. **Create template model file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file `coa_template.py`
   - This will define the COATemplate model

2. **Import required dependencies**
   - Import Django model components
   - Import UUID for unique identifiers
   - Import JSONField for storing account structure
   - Import timezone utilities
   - Import User model for tracking

3. **Define COATemplate model class**
   - Inherit from Django's Model class
   - Add comprehensive model docstring
   - Explain template purpose and usage

4. **Add model metadata**
   - Set verbose_name to "COA Template"
   - Set verbose_name_plural to "COA Templates"
   - Set db_table to "accounting_coa_template"
   - Set ordering by template name

5. **Define primary key field**
   - Use UUIDField for primary key
   - Set default to uuid.uuid4
   - Make non-editable
   - Ensures globally unique template IDs

6. **Prepare for additional fields**
   - Structure model to accept name field (Task 53)
   - Structure model to accept accounts JSONField (Task 54)
   - Structure model to accept metadata fields

7. **Add industry category field**
   - Create CharField for industry
   - Max length: 50 characters
   - Choices: RETAIL, SERVICE, MANUFACTURING, RESTAURANT, PROFESSIONAL
   - Help text: "Industry category for this template"

8. **Add description field**
   - Create TextField for detailed description
   - Set blank=True for optional entry
   - Help text: "Detailed description of this template"

9. **Add activation status field**
   - Create BooleanField: is_active
   - Default to True
   - Help text: "Whether this template is available for use"
   - Allows templates to be disabled without deletion

10. **Add audit fields**
    - Create created_at: DateTimeField with auto_now_add
    - Create updated_at: DateTimeField with auto_now
    - Create created_by: ForeignKey to User (nullable)
    - Create updated_by: ForeignKey to User (nullable)
    - Track template lifecycle

11. **Add __str__ method**
    - Return template name for display
    - Include industry in parentheses
    - Example: "Retail Business (RETAIL)"

12. **Add get_absolute_url method**
    - Return URL to template detail view
    - Use reverse with template ID

13. **Add account_count property**
    - Calculate number of accounts in template
    - Return count from accounts JSONField
    - Useful for template comparison

14. **Import model in package**
    - Open `models/__init__.py`
    - Import COATemplate class
    - Export in __all__ list

### Model Structure Diagram

```
COATemplate Model
├── Identification
│   ├── id (UUID, PK)
│   ├── template_name (CharField) - Task 53
│   └── industry (CharField)
├── Content
│   ├── template_accounts (JSONField) - Task 54
│   └── description (TextField)
├── Status
│   └── is_active (BooleanField)
└── Audit Trail
    ├── created_at (DateTimeField)
    ├── updated_at (DateTimeField)
    ├── created_by (ForeignKey)
    └── updated_by (ForeignKey)
```

### Industry Category Choices

| Choice Value | Display Name | Use Case |
|--------------|--------------|----------|
| RETAIL | Retail Business | Stores selling physical goods |
| SERVICE | Service Company | Professional services, consulting |
| MANUFACTURING | Manufacturing | Production and assembly operations |
| RESTAURANT | Restaurant/Hospitality | Food service, hotels |
| PROFESSIONAL | Professional Services | Law, accounting, medical practices |
| CONSTRUCTION | Construction | Building and contracting |
| NONPROFIT | Non-Profit Organization | Charitable organizations |
| ECOMMERCE | E-Commerce | Online retail |

### Template Metadata

Templates include:
- Industry-specific account categories
- Common accounts for that industry
- Standard account naming conventions
- Typical account hierarchies
- Regulatory compliance accounts (if applicable)

### Template vs. Fixture

| Aspect | Fixture | Template |
|--------|---------|----------|
| Storage | JSON file | Database model |
| Purpose | Default accounts | Industry-specific accounts |
| Customization | Static | Dynamic |
| Management | Code deployment | Admin interface |
| Count | One default | Multiple templates |

### Expected Outcome
- COATemplate model defined
- Industry categorization supported
- Template activation control
- Audit trail for changes
- Foundation for template management
- Ready for name and accounts fields (Tasks 53-54)

### Verification Checklist
- [ ] `apps/accounting/models/coa_template.py` created
- [ ] COATemplate class defined
- [ ] Model inherits from Django Model
- [ ] UUID primary key field added
- [ ] industry field with choices created
- [ ] description field added
- [ ] is_active field added
- [ ] Audit fields (created_at, updated_at) added
- [ ] Audit user fields (created_by, updated_by) added
- [ ] __str__ method implemented
- [ ] Model metadata configured
- [ ] Model imported in `models/__init__.py`
- [ ] Model ready for migration (Task 55)
- [ ] Prepared for name field (Task 53)
- [ ] Prepared for accounts field (Task 54)

---

## Task 53: Add Template Name Field

### Overview
Add the template_name field to the COATemplate model. This field stores the human-readable name of the template and must be unique across all templates. The name serves as the primary identifier for users selecting templates during tenant initialization and provides clear template identification in administrative interfaces.

### Dependencies
- Task 52: COATemplate model created
- Model file structure established

### Instructions

1. **Open COATemplate model file**
   - Navigate to `apps/accounting/models/coa_template.py`
   - Locate the COATemplate class definition

2. **Add template_name field**
   - Add CharField for template_name
   - Set max_length to 100 characters
   - Set unique=True to prevent duplicates
   - Set db_index=True for query performance

3. **Configure field attributes**
   - Set verbose_name to "Template Name"
   - Set help_text: "Unique name for this COA template"
   - Make field required (blank=False, null=False)

4. **Add field validation**
   - Ensure name is not empty
   - Trim whitespace from input
   - Validate name length
   - Check for special characters if needed

5. **Position field in model**
   - Place after primary key field
   - Place before industry field
   - Follow logical ordering

6. **Update __str__ method**
   - Modify to return just template_name
   - Remove industry from return value
   - Simplify display representation

7. **Add name normalization method**
   - Create clean method or override save
   - Strip whitespace from template_name
   - Ensure consistent casing (Title Case)
   - Prevent duplicate names with different cases

8. **Document field purpose**
   - Add inline comment explaining uniqueness requirement
   - Note usage in template selection interface

### Field Specifications

| Attribute | Value | Reason |
|-----------|-------|--------|
| Field Type | CharField | Short text identifier |
| max_length | 100 | Sufficient for descriptive names |
| unique | True | Prevents duplicate templates |
| db_index | True | Fast template lookups |
| blank | False | Required field |
| null | False | Must have value |

### Template Name Examples

| Template Name | Industry | Description |
|---------------|----------|-------------|
| Standard Retail Business | RETAIL | Complete retail store setup |
| Service Company - Basic | SERVICE | Basic service business accounts |
| Manufacturing - Full | MANUFACTURING | Comprehensive manufacturing COA |
| Restaurant Operations | RESTAURANT | Food service industry accounts |
| Professional Practice | PROFESSIONAL | For law, medical, accounting firms |
| Small Business Starter | RETAIL | Simplified retail setup |
| E-Commerce Platform | ECOMMERCE | Online sales focused accounts |

### Uniqueness Enforcement

The unique constraint prevents:
- Duplicate template names
- User confusion during selection
- Template identification ambiguity
- Administrative errors

Database enforcement ensures:
- Immediate validation
- Consistent error handling
- Reliable uniqueness guarantee
- No application-level race conditions

### Name Validation Rules

1. **Length Requirements**
   - Minimum: 5 characters
   - Maximum: 100 characters
   - Prevents overly short/long names

2. **Character Requirements**
   - Allow letters, numbers, spaces
   - Allow hyphens and parentheses
   - Block special SQL characters
   - Block control characters

3. **Case Handling**
   - Store in original case
   - Compare case-insensitively for uniqueness
   - Display as entered

4. **Whitespace Handling**
   - Trim leading/trailing spaces
   - Collapse multiple spaces to single
   - Normalize before saving

### Integration Points

Template name used in:
- Template selection dropdown
- COA initialization interface
- Template management admin
- API responses
- Reporting and analytics
- Audit logs

### Expected Outcome
- template_name field added to model
- Uniqueness enforced at database level
- Clear template identification
- Ready for data entry
- Supports template selection UI

### Verification Checklist
- [ ] template_name field added to COATemplate
- [ ] Field type is CharField
- [ ] max_length set to 100
- [ ] unique=True constraint added
- [ ] db_index=True for performance
- [ ] verbose_name set appropriately
- [ ] help_text added
- [ ] Field is required (not blank/null)
- [ ] __str__ method updated
- [ ] Field positioned logically in model
- [ ] Validation rules documented
- [ ] Model ready for migration

---

## Task 54: Add Template Accounts JSON Field

### Overview
Add the template_accounts JSONField to store the complete account structure for each template. This field contains the hierarchical account definitions including codes, names, types, parent relationships, and configuration settings. The JSON structure mirrors the fixture format, allowing flexible account definitions while maintaining data integrity through JSON schema validation.

### Dependencies
- Task 52: COATemplate model created
- Task 53: template_name field added
- Django's JSONField available (Django 3.1+)

### Instructions

1. **Open COATemplate model file**
   - Navigate to `apps/accounting/models/coa_template.py`
   - Locate the COATemplate class definition

2. **Import JSONField**
   - Import JSONField from django.db.models
   - Ensure Django version supports native JSONField
   - For older versions, use from django.contrib.postgres.fields

3. **Add template_accounts field**
   - Add JSONField for template_accounts
   - Set default to empty list: default=list
   - Set blank=False (required field)

4. **Configure field attributes**
   - Set verbose_name to "Template Accounts"
   - Set help_text: "JSON structure containing all account definitions"
   - Add encoder/decoder classes if needed

5. **Define JSON structure validation**
   - Create validator function for account structure
   - Validate required fields in each account entry
   - Check data types for each field
   - Ensure parent references are valid

6. **Document JSON schema**
   - Add comprehensive docstring
   - Include example JSON structure
   - Document required fields
   - Document optional fields
   - Explain hierarchical relationships

7. **Add helper methods**
   - Create get_account_count() method
   - Create get_accounts_by_type(account_type) method
   - Create validate_account_structure() method
   - Create get_root_accounts() method

8. **Implement account extraction**
   - Method to extract all accounts from JSON
   - Method to extract parent accounts
   - Method to extract leaf accounts
   - Support filtering by account type

9. **Add data integrity checks**
   - Validate account codes are unique
   - Validate parent references exist
   - Validate account types are valid
   - Check for circular parent references

10. **Create template preview method**
    - Generate summary of template accounts
    - Return account counts by type
    - Show hierarchical structure
    - Useful for template comparison

### JSON Structure Schema

Each account entry in template_accounts must include:

```
Account Object Structure:
{
  "account_code": "1100",              # Required, unique
  "account_name": "Cash and Bank",     # Required
  "account_type": "ASSET",             # Required (from AccountType)
  "normal_balance": "DEBIT",           # Required (DEBIT/CREDIT)
  "parent_code": "1000",               # Optional (null for root)
  "is_group": true,                    # Required, boolean
  "allow_direct_posting": false,       # Required, boolean
  "is_system_account": false,          # Optional, default false
  "description": "Cash accounts",      # Optional
  "notes": ""                          # Optional
}
```

### Template Accounts Array

The template_accounts field stores an array of account objects:

```
[
  {
    "account_code": "1000",
    "account_name": "Assets",
    "account_type": "ASSET",
    "normal_balance": "DEBIT",
    "parent_code": null,
    "is_group": true,
    "allow_direct_posting": false,
    "description": "All asset accounts"
  },
  {
    "account_code": "1100",
    "account_name": "Current Assets",
    "account_type": "ASSET",
    "normal_balance": "DEBIT",
    "parent_code": "1000",
    "is_group": true,
    "allow_direct_posting": false,
    "description": "Current assets group"
  }
]
```

### Validation Rules

| Validation | Rule | Purpose |
|------------|------|---------|
| Required Fields | All accounts must have code, name, type | Data completeness |
| Unique Codes | account_code unique within template | No duplicates |
| Valid Types | account_type in AccountType choices | Type safety |
| Parent References | parent_code exists in template or null | Referential integrity |
| Circular References | No account can be its own ancestor | Hierarchy integrity |
| Code Format | Matches code format rules | Consistency |

### Helper Methods

#### get_account_count()
- Returns total number of accounts in template
- Quick metric for template complexity

#### get_accounts_by_type(account_type)
- Returns all accounts of specified type
- Useful for type-specific operations
- Parameters: account_type (ASSET, LIABILITY, etc.)
- Returns: List of account dictionaries

#### validate_account_structure()
- Performs comprehensive validation
- Checks all validation rules
- Returns validation errors if any
- Called before saving template

#### get_root_accounts()
- Returns accounts with parent_code=null
- Shows top-level structure
- Useful for tree rendering

#### get_hierarchy_depth()
- Calculates maximum nesting level
- Returns integer depth
- Helps assess complexity

### Industry-Specific Variations

Different templates for same industry can vary:

#### Retail - Basic
- Essential accounts only
- Simplified structure
- ~60-80 accounts

#### Retail - Advanced
- Detailed tracking accounts
- Multiple departments
- Comprehensive cost centers
- ~120-150 accounts

#### Service - Consulting
- Project-based accounts
- Time tracking accounts
- No inventory accounts
- ~70-90 accounts

### Data Integrity

The JSONField provides:
- Flexible structure
- Easy updates and modifications
- Query support (PostgreSQL)
- No schema migrations for structure changes

Validation ensures:
- Required fields present
- Data types correct
- Relationships valid
- Business rules enforced

### Expected Outcome
- template_accounts JSONField added
- JSON schema documented
- Validation methods implemented
- Helper methods for account access
- Data integrity ensured
- Ready for template creation and initialization

### Verification Checklist
- [ ] template_accounts field added to COATemplate
- [ ] Field type is JSONField
- [ ] default=list set
- [ ] verbose_name set appropriately
- [ ] help_text added
- [ ] JSON schema documented in docstring
- [ ] Validator function created
- [ ] get_account_count() method added
- [ ] get_accounts_by_type() method added
- [ ] validate_account_structure() method added
- [ ] get_root_accounts() method added
- [ ] Uniqueness validation implemented
- [ ] Parent reference validation implemented
- [ ] Circular reference check implemented
- [ ] Model ready for migration

---

## Task 55: Run Template Migrations

### Overview
Generate and apply Django migrations for the COATemplate model. This task creates the database schema for storing chart of accounts templates, including all fields defined in Tasks 52-54. The migration establishes the foundation for template management and tenant COA initialization.

### Dependencies
- Task 52: COATemplate model created
- Task 53: template_name field added
- Task 54: template_accounts JSONField added
- Django migrations framework configured

### Instructions

1. **Verify model completeness**
   - Open `apps/accounting/models/coa_template.py`
   - Confirm all fields present: id, template_name, industry, description, template_accounts, is_active, audit fields
   - Verify model imports in `models/__init__.py`
   - Check model metadata (db_table, verbose_name, ordering)

2. **Check for pending migrations**
   - Open terminal in project root
   - Run: `python manage.py showmigrations accounting`
   - Identify any unapplied migrations
   - Note the last migration number

3. **Generate migration file**
   - Run: `python manage.py makemigrations accounting`
   - Django will detect COATemplate model
   - Migration file created in `apps/accounting/migrations/`
   - File named like: `0003_coatemplate.py`

4. **Review generated migration**
   - Open the new migration file
   - Verify operations include CreateModel for COATemplate
   - Check all fields are present with correct types
   - Verify field constraints (unique, db_index, default values)
   - Confirm foreign key relationships
   - Check indexes created appropriately

5. **Validate migration dependencies**
   - Ensure migration depends on previous accounting migrations
   - Check dependencies on auth.User model
   - Verify no circular dependencies

6. **Add migration documentation**
   - Add docstring to migration class
   - Explain what the migration creates
   - Note any special considerations
   - Document any manual steps if needed

7. **Test migration in development**
   - Create database backup (if production-like data exists)
   - Run: `python manage.py migrate accounting`
   - Monitor output for errors
   - Verify migration applies successfully

8. **Verify database schema**
   - Run: `python manage.py dbshell`
   - Execute: `\d accounting_coa_template` (PostgreSQL)
   - Verify table structure matches model
   - Check indexes created
   - Verify constraints in place

9. **Test migration rollback**
   - Run: `python manage.py migrate accounting 0002` (previous migration)
   - Verify table dropped successfully
   - Re-apply: `python manage.py migrate accounting`
   - Confirm forward migration works

10. **Update migration documentation**
    - Add migration notes to project documentation
    - Document schema changes
    - Note any data migration requirements

11. **Commit migration file**
    - Add migration file to version control
    - Include in commit with model changes
    - Use descriptive commit message

### Migration Structure

The generated migration should contain:

```
Migration Operations:
├── CreateModel: COATemplate
│   ├── id (UUIDField, primary_key)
│   ├── template_name (CharField, unique, indexed)
│   ├── industry (CharField, choices)
│   ├── description (TextField, blank)
│   ├── template_accounts (JSONField, default=list)
│   ├── is_active (BooleanField, default=True)
│   ├── created_at (DateTimeField, auto_now_add)
│   ├── updated_at (DateTimeField, auto_now)
│   ├── created_by (ForeignKey to User, null)
│   └── updated_by (ForeignKey to User, null)
└── Database Constraints:
    ├── UNIQUE: template_name
    ├── INDEX: template_name
    └── FOREIGN KEY: created_by, updated_by → auth_user
```

### Migration File Structure

Expected migration file format:

```
Migration File Structure:
├── dependencies: List of prerequisite migrations
├── operations: List of schema operations
│   └── migrations.CreateModel(
│       name='COATemplate',
│       fields=[...],
│       options={'db_table': 'accounting_coa_template', ...}
│   )
└── Migration class with database operations
```

### Database Schema Verification

Check these aspects after migration:

| Aspect | Verification | Command |
|--------|--------------|---------|
| Table Created | accounting_coa_template exists | `\dt accounting_*` |
| Primary Key | id column with UUID type | `\d accounting_coa_template` |
| Unique Constraint | template_name unique | Check constraints section |
| Index Created | template_name indexed | `\di accounting_*` |
| JSON Support | template_accounts column exists | Describe table |
| Foreign Keys | created_by, updated_by links | Check foreign keys |

### Common Migration Issues

#### Issue: JSONField Not Supported
- **Cause:** Older Django version or non-PostgreSQL database
- **Solution:** Upgrade Django to 3.1+ or use django.contrib.postgres.fields.JSONField for PostgreSQL
- **Alternative:** Use TextField with JSON serialization for other databases

#### Issue: Migration Conflicts
- **Cause:** Multiple developers creating migrations simultaneously
- **Solution:** Pull latest changes, delete local migration, regenerate
- **Prevention:** Coordinate migration creation in team

#### Issue: Foreign Key Errors
- **Cause:** User model not available when migration runs
- **Solution:** Add dependency on auth migrations
- **Fix:** Edit migration dependencies list

### Testing Checklist

After migration, test:
- [ ] Create COATemplate instance via Django shell
- [ ] Save template with all fields
- [ ] Verify template_name uniqueness constraint
- [ ] Test template_accounts JSON storage
- [ ] Query templates by industry
- [ ] Filter active templates
- [ ] Access template via admin interface
- [ ] Update template and verify updated_at changes

### Expected Outcome
- Migration file generated successfully
- Database schema created for COATemplate
- All fields present with correct types
- Constraints and indexes in place
- Model usable in Django application
- Foundation for template management ready

### Verification Checklist
- [ ] Migration file generated in migrations directory
- [ ] Migration file numbered sequentially (e.g., 0003_coatemplate.py)
- [ ] Migration dependencies correct
- [ ] CreateModel operation includes all fields
- [ ] Field types match model definition
- [ ] Unique constraint on template_name
- [ ] Index on template_name
- [ ] Foreign keys to User model configured
- [ ] Migration applied successfully
- [ ] Database table created: accounting_coa_template
- [ ] Table structure matches model
- [ ] Can create COATemplate instances
- [ ] Template name uniqueness enforced
- [ ] JSON field stores account data
- [ ] Migration documented
- [ ] Migration committed to version control

---

## Summary

This document established the foundation for chart of accounts template management:

- **Task 51:** Created comprehensive default COA fixture with 100+ accounts covering all types
- **Task 52:** Defined COATemplate model with industry categorization and audit trail
- **Task 53:** Added unique template_name field for clear template identification
- **Task 54:** Added template_accounts JSONField with validation for storing account structures
- **Task 55:** Generated and applied migrations creating the template database schema

The template system now supports:
- Default account fixture for standard initialization
- Industry-specific template storage
- Flexible account structure via JSON
- Template activation control
- Comprehensive audit trail

**Next Steps:** Document 02 implements the COAInitializer service to use these templates for tenant account setup.
