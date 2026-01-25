# Tasks 49-57: Template Model and Service

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 09 - Journal Entries  
> **Group:** D - Templates & Recurring  
> **Document:** 01 of 02  
> **Tasks Covered:** 49, 50, 51, 52, 53, 54, 55, 56, 57

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-58-64_Recurring-Entry-Celery.md](02_Tasks-58-64_Recurring-Entry-Celery.md)

---

## Document Overview

This document covers the implementation of the JournalEntryTemplate system, which enables users to create reusable journal entry patterns for common accounting transactions. Templates store line item definitions in JSON format, allowing quick creation of standardized entries like monthly rent, depreciation, or recurring expenses.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 49 | Create JournalEntryTemplate Model | Medium | 30 min |
| 50 | Add Template Name Field | Low | 10 min |
| 51 | Add Template Description | Low | 10 min |
| 52 | Add Template Lines JSON | Medium | 25 min |
| 53 | Add Template Category | Low | 15 min |
| 54 | Run Template Migrations | Low | 5 min |
| 55 | Create Template Service | Medium | 35 min |
| 56 | Add Create From Template | Medium | 30 min |
| 57 | Add Save As Template | Medium | 30 min |

---

## Task 49: Create JournalEntryTemplate Model

### Overview
Create the foundational JournalEntryTemplate model that stores reusable journal entry patterns. This model serves as a library of standardized entries, enabling consistent and efficient creation of common accounting transactions.

### Dependencies
- Task 48: Journal entry locking functionality must be complete
- Django models framework
- Multi-tenancy base model (TenantAwareModel)

### Instructions

1. **Create journal_template.py file**
   - Navigate to `apps/accounting/models/` directory
   - Create new file named `journal_template.py`
   - This will contain the JournalEntryTemplate model

2. **Import required dependencies**
   - Import Django model components (models, JSONField)
   - Import TenantAwareModel from core.models
   - Import timezone utilities for timestamp fields

3. **Define JournalEntryTemplate class**
   - Inherit from TenantAwareModel
   - Add comprehensive class docstring
   - Explain template purpose and usage pattern

4. **Add Meta class configuration**
   - Set database table name: 'accounting_journal_entry_templates'
   - Define verbose names (singular and plural)
   - Set default ordering by name (ascending)
   - Add index on category field for filtering

5. **Prepare for field additions**
   - Structure will be completed in subsequent tasks
   - Each task adds specific fields and functionality
   - Maintain clean separation of concerns

### Model Purpose

| Aspect | Purpose |
|--------|---------|
| Template Storage | Store reusable entry patterns |
| Standardization | Ensure consistency across entries |
| Efficiency | Quick creation of common entries |
| Categorization | Organize templates by use case |

### Template Use Cases

#### Monthly Rent Payment
- Standardized monthly expense entry
- Consistent account allocation
- Predictable debit/credit structure

#### Depreciation Entries
- Monthly asset depreciation
- Fixed account patterns
- Variable amount based on asset value

#### Prepaid Expense Amortization
- Periodic expense recognition
- Consistent amortization pattern
- Monthly adjustment entries

#### Payroll Distribution
- Standard payroll entry structure
- Multiple line items for different expense accounts
- Consistent allocation pattern

### Expected Outcome
- Base JournalEntryTemplate model created
- Proper inheritance from TenantAwareModel
- Meta configuration established
- Ready for field additions

### Verification Checklist
- [ ] `journal_template.py` file created in models directory
- [ ] JournalEntryTemplate class defined
- [ ] Inherits from TenantAwareModel
- [ ] Class docstring added
- [ ] Meta class configured with table name
- [ ] Default ordering specified
- [ ] File follows Django model conventions

---

## Task 50: Add Template Name Field

### Overview
Add the name field to the JournalEntryTemplate model. This field provides a descriptive identifier for each template, enabling easy recognition and selection when creating journal entries.

### Dependencies
- Task 49: JournalEntryTemplate model must exist

### Instructions

1. **Open journal_template.py file**
   - Navigate to `apps/accounting/models/journal_template.py`
   - Locate the JournalEntryTemplate model class

2. **Add name field**
   - Type: CharField
   - Maximum length: 100 characters
   - Required field (blank=False, null=False)
   - Add helpful help_text explaining purpose

3. **Add field documentation**
   - Inline comment explaining field purpose
   - Note: Used in template selection dropdowns
   - Note: Should be unique per tenant for clarity

4. **Consider naming conventions**
   - Examples: "Monthly Rent Payment", "Asset Depreciation", "Payroll Distribution"
   - Should be descriptive and easily searchable
   - Avoid abbreviations or codes

### Field Specifications

| Property | Value |
|----------|-------|
| Field Type | CharField |
| Max Length | 100 |
| Required | Yes |
| Blank | False |
| Null | False |
| Indexed | No (name searching uses DB text search) |

### Naming Best Practices

#### Good Template Names
- "Monthly Office Rent Payment"
- "Equipment Depreciation Entry"
- "Prepaid Insurance Amortization"
- "Bank Interest Income Recognition"
- "Employee Payroll Distribution"

#### Poor Template Names
- "Template 1"
- "RENT"
- "Dep"
- "Entry"
- "JE-001"

### Expected Outcome
- Name field added to model
- Clear identification of templates
- User-friendly template selection
- Searchable template library

### Verification Checklist
- [ ] name field added as CharField
- [ ] max_length set to 100
- [ ] Field is required (not blank/null)
- [ ] help_text provided
- [ ] Field documentation added

---

## Task 51: Add Template Description

### Overview
Add a description field to provide detailed information about the template's purpose, usage instructions, and when to apply it. This field helps users understand the appropriate context for each template.

### Dependencies
- Task 49: JournalEntryTemplate model must exist

### Instructions

1. **Open journal_template.py file**
   - Continue in the JournalEntryTemplate model
   - Add description field after name field

2. **Add description field**
   - Type: TextField
   - Optional field (blank=True, null=True)
   - Allows longer explanatory text
   - Add help_text for field purpose

3. **Add field documentation**
   - Explain intended use case
   - Note: Should include usage instructions
   - Note: Can reference account codes or amounts

4. **Consider description content**
   - Explain what the template does
   - When to use it (timing, circumstances)
   - Any special considerations
   - Variable fields that need user input

### Field Specifications

| Property | Value |
|----------|-------|
| Field Type | TextField |
| Required | No |
| Blank | True |
| Null | True |
| Max Length | Unlimited (database TEXT type) |

### Description Examples

#### Monthly Rent Template Description
```
Use this template to record monthly rent payments. 
Debits Rent Expense (5300) and credits Bank Account (1110).
Update the amount field when creating the entry.
Typically used on the 1st of each month.
```

#### Depreciation Template Description
```
Monthly depreciation entry for fixed assets.
Debits Depreciation Expense (5400) and credits Accumulated Depreciation (1520).
Calculate monthly depreciation amount based on asset depreciation schedule.
Run at month-end closing.
```

#### Prepaid Insurance Template Description
```
Monthly amortization of prepaid insurance.
Debits Insurance Expense (5250) and credits Prepaid Insurance (1310).
Amount should be annual premium divided by 12 months.
Record on the last day of each month.
```

### Expected Outcome
- Description field added to model
- Clear usage instructions available
- Enhanced template understanding
- Better user guidance

### Verification Checklist
- [ ] description field added as TextField
- [ ] Field is optional (blank=True, null=True)
- [ ] help_text provided
- [ ] Field positioned after name field

---

## Task 52: Add Template Lines JSON

### Overview
Add the template_lines field to store the actual journal entry line items in JSON format. This field contains the structure of debits and credits with account codes, descriptions, and placeholder values for amounts.

### Dependencies
- Task 49: JournalEntryTemplate model must exist

### Instructions

1. **Open journal_template.py file**
   - Continue in the JournalEntryTemplate model
   - Add template_lines field after description

2. **Import JSONField**
   - Ensure JSONField is imported from django.db.models
   - Required for storing structured line item data

3. **Add template_lines field**
   - Type: JSONField
   - Required field (blank=False, null=False)
   - Default: empty dictionary with lines array
   - Add comprehensive help_text

4. **Define JSON structure in docstring**
   - Document expected JSON format
   - Include example structure
   - Explain variable placeholders ({{amount}}, {{description}})

5. **Add field validation note**
   - Note: JSON must contain 'lines' array
   - Note: Each line must have account_code, description, debit, credit
   - Note: Validation will be handled in service layer

### Field Specifications

| Property | Value |
|----------|-------|
| Field Type | JSONField |
| Required | Yes |
| Blank | False |
| Null | False |
| Default | {"lines": []} |

### JSON Structure Format

```json
{
  "lines": [
    {
      "account_code": "string",
      "description": "string",
      "debit": "number or {{variable}}",
      "credit": "number or {{variable}}"
    }
  ]
}
```

### Template Line Examples

#### Simple Rent Payment Template
```json
{
  "lines": [
    {
      "account_code": "5300",
      "description": "Monthly Office Rent",
      "debit": "{{amount}}",
      "credit": null
    },
    {
      "account_code": "1110",
      "description": "Bank Payment - Rent",
      "debit": null,
      "credit": "{{amount}}"
    }
  ]
}
```

#### Complex Payroll Template
```json
{
  "lines": [
    {
      "account_code": "6100",
      "description": "Gross Salaries",
      "debit": "{{gross_salary}}",
      "credit": null
    },
    {
      "account_code": "2110",
      "description": "Employee Tax Withholding",
      "debit": null,
      "credit": "{{tax_withheld}}"
    },
    {
      "account_code": "2120",
      "description": "EPF Contribution",
      "debit": null,
      "credit": "{{epf_amount}}"
    },
    {
      "account_code": "1110",
      "description": "Net Salary Payment",
      "debit": null,
      "credit": "{{net_salary}}"
    }
  ]
}
```

### Variable Placeholder System

| Placeholder | Description | Example Value |
|-------------|-------------|---------------|
| {{amount}} | Single amount value | 50000.00 |
| {{description}} | Dynamic description | "Payment for January" |
| {{date}} | Date reference | "2026-01-31" |
| Custom variables | User-defined placeholders | {{gross_salary}}, {{tax_amount}} |

### Expected Outcome
- template_lines field stores entry structure
- JSON format enables flexible line definitions
- Variable placeholders support dynamic values
- Foundation for entry generation from templates

### Verification Checklist
- [ ] template_lines field added as JSONField
- [ ] Default value set to {"lines": []}
- [ ] Field is required
- [ ] help_text explains JSON structure
- [ ] Documentation includes example format
- [ ] Variable placeholder system documented

---

## Task 53: Add Template Category

### Overview
Add a category field to organize templates into logical groups. Categories help users find relevant templates quickly and enable filtering in the template library interface.

### Dependencies
- Task 49: JournalEntryTemplate model must exist

### Instructions

1. **Open journal_template.py file**
   - Continue in the JournalEntryTemplate model
   - Add category field after template_lines

2. **Define CATEGORY_CHOICES constant**
   - Create tuple with category choices
   - Place above the model class definition
   - Include common accounting entry categories

3. **Define category constants**
   - GENERAL: General purpose templates
   - MONTH_END: Month-end closing entries
   - PAYROLL: Payroll-related templates
   - DEPRECIATION: Asset depreciation entries
   - ACCRUALS: Accrual and deferral entries
   - CUSTOM: User-defined category

4. **Add category field**
   - Type: CharField
   - Max length: 20 characters
   - Choices: CATEGORY_CHOICES
   - Default: 'GENERAL'
   - Add index for filtering performance

5. **Add field documentation**
   - Explain category purpose
   - Note: Used for template filtering
   - Note: Helps organize template library

### Field Specifications

| Property | Value |
|----------|-------|
| Field Type | CharField |
| Max Length | 20 |
| Choices | CATEGORY_CHOICES |
| Default | 'GENERAL' |
| Required | Yes |
| Indexed | Yes |

### Category Definitions

| Category | Purpose | Example Templates |
|----------|---------|-------------------|
| GENERAL | General purpose entries | Bank transfers, adjustments |
| MONTH_END | Month-end closing | Accruals, deferrals, reversals |
| PAYROLL | Payroll processing | Salary payment, tax withholding |
| DEPRECIATION | Asset depreciation | Monthly depreciation, asset write-offs |
| ACCRUALS | Accrual accounting | Prepaid expenses, deferred revenue |
| CUSTOM | User-defined | Business-specific templates |

### Template Categorization Examples

#### Month-End Templates
- Prepaid expense amortization
- Accrued expense recognition
- Deferred revenue recognition
- Depreciation entries
- Month-end reversals

#### Payroll Templates
- Gross salary payment
- Tax withholdings
- EPF/ETF contributions
- Employee advances recovery
- Bonus payments

#### Depreciation Templates
- Building depreciation
- Equipment depreciation
- Vehicle depreciation
- Furniture depreciation
- Computer equipment depreciation

### Expected Outcome
- Category field enables template organization
- Templates grouped by accounting function
- Easy filtering in template selection
- Logical template library structure

### Verification Checklist
- [ ] CATEGORY_CHOICES constant defined
- [ ] All category constants created
- [ ] category field added as CharField
- [ ] max_length set to 20
- [ ] choices parameter set
- [ ] default value set to 'GENERAL'
- [ ] Field is indexed
- [ ] Category descriptions documented

---

## Task 54: Run Template Migrations

### Overview
Generate and apply database migrations for the JournalEntryTemplate model. This creates the database table with all defined fields and indexes.

### Dependencies
- Task 49: JournalEntryTemplate model created
- Task 50: Name field added
- Task 51: Description field added
- Task 52: Template lines JSON field added
- Task 53: Category field added

### Instructions

1. **Verify model is complete**
   - Open `journal_template.py`
   - Ensure all fields are defined
   - Verify Meta class configuration
   - Check model is imported in `models/__init__.py`

2. **Import model in models package**
   - Open `apps/accounting/models/__init__.py`
   - Add import: `from .journal_template import JournalEntryTemplate`
   - Ensures Django discovers the model

3. **Generate migration file**
   - Open terminal in project root
   - Activate virtual environment
   - Run: `python manage.py makemigrations accounting`
   - Review generated migration file

4. **Review migration file**
   - Navigate to `apps/accounting/migrations/`
   - Open newly generated migration file
   - Verify all fields are included
   - Check field types and constraints

5. **Apply migration**
   - Run: `python manage.py migrate accounting`
   - Verify migration applies successfully
   - Check for any errors or warnings

6. **Verify database table**
   - Connect to PostgreSQL database
   - List tables to confirm 'accounting_journal_entry_templates' exists
   - Describe table structure to verify fields
   - Check indexes are created

### Migration Checklist

| Step | Command | Expected Outcome |
|------|---------|------------------|
| Import model | Add to `__init__.py` | Model discoverable |
| Make migrations | `makemigrations accounting` | Migration file created |
| Review migration | Open migration file | All fields present |
| Apply migration | `migrate accounting` | Table created |
| Verify table | Database query | Table structure correct |

### Expected Migration Operations

- **Create table:** accounting_journal_entry_templates
- **Add fields:**
  - id (auto-generated primary key)
  - name (varchar 100)
  - description (text, nullable)
  - template_lines (jsonb)
  - category (varchar 20, indexed)
  - tenant_id (foreign key to tenants)
  - created_at, updated_at (timestamps)
  - created_by, updated_by (foreign keys to users)

### Expected Outcome
- JournalEntryTemplate table created in database
- All fields properly defined with correct types
- Indexes created for performance
- Model ready for data operations

### Verification Checklist
- [ ] Model imported in `models/__init__.py`
- [ ] Migration file generated successfully
- [ ] Migration file reviewed and correct
- [ ] Migration applied without errors
- [ ] Database table exists
- [ ] Table structure matches model definition
- [ ] Indexes created on category field
- [ ] Foreign key constraints established

---

## Task 55: Create Template Service

### Overview
Create the TemplateService class to handle template operations including retrieval, validation, and management. This service provides a centralized interface for all template-related business logic.

### Dependencies
- Task 54: JournalEntryTemplate migrations completed
- Service pattern established in accounting app

### Instructions

1. **Create template_service.py file**
   - Navigate to `apps/accounting/services/` directory
   - Create new file named `template_service.py`
   - This will contain TemplateService class

2. **Import required dependencies**
   - Import JournalEntryTemplate model
   - Import Django exceptions (ValidationError, ObjectDoesNotExist)
   - Import typing utilities for type hints

3. **Define TemplateService class**
   - Create class with comprehensive docstring
   - Explain service purpose and responsibilities
   - Note: Handles all template-related operations

4. **Add get_template method**
   - Accepts template_id as parameter
   - Retrieves template by ID for current tenant
   - Raises exception if not found
   - Returns JournalEntryTemplate instance

5. **Add list_templates method**
   - Accepts optional category filter
   - Returns queryset of templates for current tenant
   - Filters by category if provided
   - Orders by name (alphabetical)

6. **Add validate_template_lines method**
   - Accepts template_lines JSON as parameter
   - Validates JSON structure
   - Checks required fields (account_code, description, debit, credit)
   - Validates debit/credit mutual exclusivity
   - Returns validation result with errors list

7. **Add get_template_by_name method**
   - Accepts template name as parameter
   - Searches templates by name (case-insensitive)
   - Returns template or None
   - Useful for template lookup by name

### Service Method Overview

| Method | Purpose | Parameters | Return Type |
|--------|---------|------------|-------------|
| get_template | Retrieve template by ID | template_id | JournalEntryTemplate |
| list_templates | List templates with filter | category (optional) | QuerySet |
| validate_template_lines | Validate JSON structure | template_lines | dict (valid, errors) |
| get_template_by_name | Find template by name | name | JournalEntryTemplate or None |

### Template Validation Rules

#### JSON Structure Validation
- Must contain 'lines' array
- Lines array must not be empty
- Each line must be a dictionary

#### Line Item Validation
- account_code: Required, must be string
- description: Required, must be string
- debit: Must be number, null, or variable placeholder
- credit: Must be number, null, or variable placeholder
- Exactly one of debit or credit must be null (mutual exclusivity)

#### Variable Placeholder Validation
- Format: {{variable_name}}
- Valid characters: alphanumeric and underscore
- Must be wrapped in double curly braces

### Template Service Usage Examples

#### List All Templates
```
Method: list_templates()
Returns: All templates for current tenant
Use case: Template selection dropdown
```

#### List Month-End Templates
```
Method: list_templates(category='MONTH_END')
Returns: Filtered templates
Use case: Month-end closing workflow
```

#### Validate Template Before Saving
```
Method: validate_template_lines(lines_json)
Returns: {"valid": True/False, "errors": [...]}
Use case: Template creation validation
```

### Expected Outcome
- TemplateService class provides centralized template operations
- Clean interface for template management
- Validation logic encapsulated in service
- Reusable methods across controllers

### Verification Checklist
- [ ] template_service.py file created
- [ ] TemplateService class defined
- [ ] get_template method implemented
- [ ] list_templates method implemented
- [ ] validate_template_lines method implemented
- [ ] get_template_by_name method implemented
- [ ] Comprehensive docstrings added
- [ ] Type hints included
- [ ] Service imported in services/__init__.py

---

## Task 56: Add Create From Template

### Overview
Implement the create_from_template method in TemplateService that generates a new journal entry from a template. This method substitutes variable placeholders with actual values and creates a complete journal entry with line items.

### Dependencies
- Task 55: TemplateService class must exist
- JournalEntry and JournalEntryLine models available

### Instructions

1. **Open template_service.py file**
   - Navigate to TemplateService class
   - Add create_from_template method

2. **Define method signature**
   - Parameters:
     - template_id: Template to use
     - entry_date: Date for the journal entry
     - description: Entry description (optional, uses template desc)
     - variable_values: Dictionary mapping placeholders to values
   - Returns: JournalEntry instance

3. **Implement method logic**
   - Retrieve template by ID
   - Validate variable_values contains all required placeholders
   - Create JournalEntry instance
   - Parse template_lines JSON
   - For each template line:
     - Substitute variables in amounts
     - Substitute variables in descriptions
     - Create JournalEntryLine instance
   - Return created entry

4. **Add variable substitution logic**
   - Extract placeholders from template ({{variable}})
   - Replace with values from variable_values dict
   - Handle missing variables gracefully
   - Validate final amounts are numeric

5. **Add validation checks**
   - Verify template exists
   - Ensure all required variables provided
   - Validate entry balances (debits = credits)
   - Check all accounts exist in chart of accounts

6. **Add error handling**
   - Raise ValidationError for missing variables
   - Raise ValidationError for unbalanced entry
   - Raise ValidationError for invalid accounts
   - Provide clear error messages

### Method Flow Diagram

```
create_from_template()
    │
    ├─→ Retrieve template
    │
    ├─→ Extract required variables
    │
    ├─→ Validate variable_values provided
    │
    ├─→ Create JournalEntry
    │       │
    │       ├─→ Set entry_date
    │       ├─→ Set description
    │       └─→ Set status = 'DRAFT'
    │
    ├─→ Loop through template lines
    │       │
    │       ├─→ Substitute variables
    │       ├─→ Validate amounts
    │       └─→ Create JournalEntryLine
    │
    ├─→ Validate entry balance
    │
    └─→ Return JournalEntry
```

### Variable Substitution Examples

#### Simple Template (Single Variable)
```
Template Line:
{
  "account_code": "5300",
  "description": "Monthly Rent",
  "debit": "{{amount}}",
  "credit": null
}

Variable Values: {"amount": 50000}

Result Line:
- Account: 5300
- Description: "Monthly Rent"
- Debit: 50000.00
- Credit: 0.00
```

#### Complex Template (Multiple Variables)
```
Template Line:
{
  "account_code": "6100",
  "description": "Salary for {{month}}",
  "debit": "{{gross_salary}}",
  "credit": null
}

Variable Values: {
  "month": "January",
  "gross_salary": 150000
}

Result Line:
- Account: 6100
- Description: "Salary for January"
- Debit: 150000.00
- Credit: 0.00
```

### Entry Creation Example

```
Template: "Monthly Rent Payment"
Template Lines:
- DR Rent Expense (5300): {{amount}}
- CR Bank (1110): {{amount}}

Usage:
create_from_template(
  template_id=1,
  entry_date="2026-01-31",
  description="January Rent Payment",
  variable_values={"amount": 50000}
)

Created Entry:
- Date: 2026-01-31
- Description: "January Rent Payment"
- Lines:
  1. DR 5300 - Rent Expense: 50,000.00
  2. CR 1110 - Bank: 50,000.00
- Status: DRAFT
- Balanced: Yes
```

### Expected Outcome
- Functional entry creation from templates
- Variable substitution working correctly
- Validation ensures balanced entries
- Clean interface for template usage

### Verification Checklist
- [ ] create_from_template method added
- [ ] Method signature correct with all parameters
- [ ] Template retrieval implemented
- [ ] Variable extraction logic implemented
- [ ] Variable substitution working
- [ ] JournalEntry creation implemented
- [ ] JournalEntryLine creation in loop
- [ ] Balance validation implemented
- [ ] Error handling for missing variables
- [ ] Method tested with sample template

---

## Task 57: Add Save As Template

### Overview
Implement the save_as_template method in TemplateService that creates a template from an existing journal entry. This method extracts line items, converts amounts to variable placeholders, and stores the entry structure as a reusable template.

### Dependencies
- Task 55: TemplateService class must exist
- Task 56: create_from_template method implemented

### Instructions

1. **Open template_service.py file**
   - Continue in TemplateService class
   - Add save_as_template method

2. **Define method signature**
   - Parameters:
     - journal_entry: JournalEntry instance to convert
     - template_name: Name for the new template
     - template_description: Description (optional)
     - category: Template category (default 'GENERAL')
     - variable_mapping: Dict mapping line amounts to variable names
   - Returns: JournalEntryTemplate instance

3. **Implement method logic**
   - Extract all lines from journal entry
   - Build template_lines JSON structure
   - For each line:
     - Get account code
     - Get description
     - Convert amount to variable or keep as value
     - Structure debit/credit appropriately
   - Create JournalEntryTemplate instance
   - Save and return template

4. **Add variable mapping logic**
   - If variable_mapping provided, use custom names
   - If not provided, generate default variables ({{amount_1}}, {{amount_2}})
   - Handle repeated amounts intelligently
   - Preserve debit/credit structure

5. **Add template building logic**
   - Create JSON lines array
   - Each line contains account_code, description, debit, credit
   - Maintain entry balance structure
   - Preserve line order

6. **Add validation**
   - Verify journal entry is balanced
   - Check template_name is unique
   - Validate category is valid choice
   - Ensure entry has line items

### Method Flow Diagram

```
save_as_template()
    │
    ├─→ Validate journal entry
    │       ├─→ Check is balanced
    │       ├─→ Check has line items
    │       └─→ Validate status
    │
    ├─→ Extract line items
    │
    ├─→ Build template_lines JSON
    │       │
    │       └─→ For each line:
    │           ├─→ Get account code
    │           ├─→ Get description
    │           ├─→ Map amount to variable
    │           └─→ Add to lines array
    │
    ├─→ Create JournalEntryTemplate
    │       ├─→ Set name
    │       ├─→ Set description
    │       ├─→ Set template_lines
    │       └─→ Set category
    │
    └─→ Return template
```

### Variable Mapping Examples

#### Automatic Mapping (No variable_mapping provided)
```
Journal Entry Lines:
- DR Rent Expense (5300): 50,000
- CR Bank (1110): 50,000

Generated Template Lines:
{
  "lines": [
    {
      "account_code": "5300",
      "description": "Rent Expense",
      "debit": "{{amount}}",
      "credit": null
    },
    {
      "account_code": "1110",
      "description": "Bank",
      "debit": null,
      "credit": "{{amount}}"
    }
  ]
}

Note: Same amount used in both lines, single variable
```

#### Custom Mapping (variable_mapping provided)
```
Journal Entry Lines:
- DR Salary Expense (6100): 150,000
- CR Tax Withholding (2110): 15,000
- CR EPF Payable (2120): 15,000
- CR Bank (1110): 120,000

Variable Mapping: {
  150000: "gross_salary",
  15000: "tax_withheld",
  15000: "epf_amount",
  120000: "net_salary"
}

Generated Template Lines:
{
  "lines": [
    {
      "account_code": "6100",
      "description": "Salary Expense",
      "debit": "{{gross_salary}}",
      "credit": null
    },
    {
      "account_code": "2110",
      "description": "Tax Withholding",
      "debit": null,
      "credit": "{{tax_withheld}}"
    },
    {
      "account_code": "2120",
      "description": "EPF Payable",
      "debit": null,
      "credit": "{{epf_amount}}"
    },
    {
      "account_code": "1110",
      "description": "Bank",
      "debit": null,
      "credit": "{{net_salary}}"
    }
  ]
}
```

### Template Creation Examples

#### Simple Expense Template
```
Source Entry:
Date: 2026-01-15
Description: "Electricity Bill Payment"
Lines:
- DR Utilities Expense (5400): 8,500
- CR Bank (1110): 8,500

Save As Template:
Name: "Monthly Electricity Bill"
Description: "Record monthly electricity expense"
Category: GENERAL

Result Template:
- Name: "Monthly Electricity Bill"
- Lines: 2 (with {{amount}} variable)
- Can be reused monthly with different amounts
```

#### Complex Multi-Line Template
```
Source Entry:
Date: 2026-01-31
Description: "January Payroll"
Lines:
- DR Gross Salaries (6100): 500,000
- CR Employee Tax (2110): 50,000
- CR EPF (2120): 60,000
- CR ETF (2130): 15,000
- CR Net Salaries Bank (1110): 375,000

Save As Template:
Name: "Monthly Payroll Distribution"
Description: "Standard payroll entry with tax and EPF/ETF"
Category: PAYROLL

Result Template:
- Name: "Monthly Payroll Distribution"
- Lines: 5 (each with unique variable)
- Variables: gross_salary, tax, epf, etf, net_pay
```

### Expected Outcome
- Functional template creation from entries
- Existing entries can be converted to templates
- Variable mapping provides flexibility
- Template library grows from real transactions

### Verification Checklist
- [ ] save_as_template method added
- [ ] Method signature correct with parameters
- [ ] Entry line extraction implemented
- [ ] Template lines JSON building working
- [ ] Variable mapping logic implemented
- [ ] Default variable generation working
- [ ] JournalEntryTemplate creation implemented
- [ ] Validation for balanced entry
- [ ] Template name uniqueness checked
- [ ] Method tested with sample entry
- [ ] Both automatic and custom mapping tested

---

## Notes for AI Agents

### Template System Architecture

The JournalEntryTemplate system follows a copy-on-create pattern:
1. Templates store entry structure with variable placeholders
2. Creating from template generates new JournalEntry instance
3. Template remains unchanged after entry creation
4. Multiple entries can be created from single template

### JSON Template Format

Templates use JSONField to store flexible line item structures:
- Allows variable number of lines
- Supports variable placeholders ({{variable}})
- Preserves account codes and descriptions
- Maintains debit/credit structure

### Variable Placeholder System

Variables enable template reusability:
- Format: {{variable_name}}
- Can appear in amounts and descriptions
- Substituted when creating entry from template
- Validation ensures all variables provided

### Service Layer Separation

TemplateService encapsulates all template logic:
- Models remain simple data structures
- Service handles validation and business logic
- Controllers call service methods
- Promotes code reusability and testing

### Common Template Patterns

#### Single Amount Templates
Most common pattern with one variable:
```
DR Expense Account: {{amount}}
CR Bank Account: {{amount}}
```

#### Percentage-Based Templates
Multiple variables derived from base amount:
```
DR Gross Salary: {{gross}}
CR Tax: {{gross}} * 10%
CR Net Salary: {{gross}} * 90%
```
Note: Percentage calculations done before template creation

#### Multi-Party Templates
Separate variables for each component:
```
DR Asset: {{asset_cost}}
DR Installation: {{installation_cost}}
CR Accounts Payable: {{total_cost}}
```

### Template Categories Usage

- **GENERAL:** Day-to-day entries (bank transfers, payments)
- **MONTH_END:** Closing entries (accruals, depreciation)
- **PAYROLL:** Salary, tax withholding, benefits
- **DEPRECIATION:** Asset depreciation schedules
- **ACCRUALS:** Prepaid/deferred revenue recognition
- **CUSTOM:** Business-specific specialized entries

### Integration Points

Templates integrate with:
- Journal entry creation workflow
- Recurring entry system (next document)
- Approval workflows (later group)
- Month-end closing procedures
- Automated entry generation

---

## Final Checklist

### Model Implementation
- [ ] JournalEntryTemplate model created with all fields
- [ ] name, description, template_lines, category fields added
- [ ] Meta class configured properly
- [ ] Model inherits from TenantAwareModel
- [ ] Migrations generated and applied successfully

### Service Implementation
- [ ] TemplateService class created
- [ ] get_template method implemented
- [ ] list_templates method implemented with filtering
- [ ] validate_template_lines method validates JSON structure
- [ ] create_from_template method generates entries
- [ ] save_as_template method creates templates from entries

### Validation
- [ ] Template lines JSON structure validated
- [ ] Variable placeholder format validated
- [ ] Entry balance validation implemented
- [ ] Account existence validation added
- [ ] Missing variable detection working

### Testing Readiness
- [ ] All service methods documented
- [ ] Example usage patterns provided
- [ ] Error handling implemented
- [ ] Type hints added throughout
- [ ] Ready for unit tests (next phase)

### Integration Readiness
- [ ] Service ready for API endpoint integration
- [ ] Template creation workflow defined
- [ ] Entry generation workflow established
- [ ] Foundation for recurring entries (next document)
- [ ] Admin interface ready for implementation
