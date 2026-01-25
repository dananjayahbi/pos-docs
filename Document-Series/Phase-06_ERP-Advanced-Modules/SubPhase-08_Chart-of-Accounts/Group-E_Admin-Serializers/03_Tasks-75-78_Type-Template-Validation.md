# Tasks 75-78: Type, Template, and Validation Serializers

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** E - Admin & Serializers  
> **Document:** 03 of 03  
> **Tasks Covered:** 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-72-74_Account-Serializers.md](02_Tasks-72-74_Account-Serializers.md)

---

## Document Overview

This document covers the creation of serializers for AccountTypeConfig and COATemplate models, plus custom validation logic for account creation and updates. These serializers ensure data integrity, enforce business rules, and provide clear validation messages to API clients. The validation logic prevents invalid account configurations and protects critical system data.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 75 | Create AccountTypeSerializer | Low | 20 min |
| 76 | Create COATemplateSerializer | Low | 20 min |
| 77 | Add Create Account Validation | Medium | 30 min |
| 78 | Add Update Account Validation | Medium | 30 min |

---

## Task 75: Create AccountTypeSerializer

### Overview
Create the AccountTypeConfigSerializer for serializing account type configuration data. This serializer handles account type definitions including type codes (Asset, Liability, etc.), normal balances, code ranges, and category requirements. It provides type information for account creation and type selection interfaces.

### Dependencies
- AccountTypeConfig model is fully implemented
- Django REST Framework is installed

### Instructions

1. **Create account_type.py module**
   - Navigate to apps/accounting/serializers/
   - Create account_type.py file
   - This will contain AccountTypeConfigSerializer
   - Import necessary DRF components

2. **Import required dependencies**
   - Import serializers from rest_framework
   - Import AccountTypeConfig model
   - Import any custom validators
   - Import choice constants if defined

3. **Create AccountTypeConfigSerializer class**
   - Define class inheriting from serializers.ModelSerializer
   - Set model to AccountTypeConfig in Meta class
   - Configure fields for API exposure

4. **Include identification fields**
   - Include 'id' field (primary key)
   - Include 'type_code' field (unique code)
   - Include 'type_name' field (display name)
   - Include 'description' field (optional)

5. **Include balance configuration**
   - Include 'normal_balance' field (Debit/Credit)
   - This defines expected balance side
   - Critical for accounting calculations
   - Display as readable string

6. **Include code range fields**
   - Include 'code_range_start' field
   - Include 'code_range_end' field
   - Define valid account code range for type
   - Example: Assets = 1000-1999

7. **Include category configuration**
   - Include 'category_required' field (boolean)
   - Indicates if category must be specified
   - Include 'allowed_categories' field (list)
   - Show which categories are valid

8. **Include reporting configuration**
   - Include 'financial_statement' field
   - Shows where type appears (Balance Sheet, Income Statement)
   - Include 'display_order' field
   - Controls sort order in reports

9. **Include control flags**
   - Include 'is_system' field (read-only)
   - Include 'allow_header_accounts' field
   - Include 'allow_transactions' field
   - Control account behavior

10. **Include metadata fields**
    - Include 'created_at' field (read-only)
    - Include 'updated_at' field (read-only)
    - Include 'is_active' field
    - Standard audit fields

11. **Configure read-only fields**
    - Set is_system as read-only
    - Set code ranges as read-only (fixed by design)
    - Set financial_statement as read-only
    - Protect critical configuration

12. **Add custom display fields**
    - Add 'code_range_display' combining start and end
    - Add 'allowed_categories_display' as readable list
    - Add 'account_count' showing number of accounts
    - Useful for UI display

13. **Add validation methods**
    - Validate normal_balance is Debit or Credit
    - Validate code_range_start < code_range_end
    - Validate allowed_categories are valid choices
    - Ensure data integrity

14. **Add serializer docstring**
    - Document serializer purpose
    - List included fields
    - Note read-only restrictions
    - Explain use cases

### Serializer Structure

```
AccountTypeConfigSerializer
├── Identification
│   ├── id (read-only)
│   ├── type_code (Asset, Liability, etc.)
│   ├── type_name (display name)
│   └── description
├── Balance Configuration
│   ├── normal_balance (Debit/Credit)
│   └── financial_statement (BS/IS)
├── Code Range
│   ├── code_range_start (1000)
│   ├── code_range_end (1999)
│   └── code_range_display (custom)
├── Category Configuration
│   ├── category_required (boolean)
│   └── allowed_categories (list)
├── Control Flags
│   ├── is_system (read-only)
│   ├── allow_header_accounts
│   └── allow_transactions
└── Metadata
    ├── display_order
    ├── is_active
    ├── created_at (read-only)
    └── updated_at (read-only)
```

### Field Details

| Field | Type | Read-Only | Purpose |
|-------|------|-----------|---------|
| id | Integer | Yes | Primary key |
| type_code | String | No | Unique code (Asset, Liability) |
| type_name | String | No | Display name |
| description | Text | No | Type description |
| normal_balance | Choice | No | Debit or Credit |
| code_range_start | Integer | Yes | Min account code |
| code_range_end | Integer | Yes | Max account code |
| category_required | Boolean | No | Must specify category |
| allowed_categories | List | No | Valid category options |
| financial_statement | Choice | Yes | BS or IS |
| allow_header_accounts | Boolean | No | Can create headers |
| allow_transactions | Boolean | No | Can post transactions |
| is_system | Boolean | Yes | System-managed type |
| display_order | Integer | No | Sort order in reports |

### API Response Example

#### Account Type Response
```json
{
  "id": 1,
  "type_code": "Asset",
  "type_name": "Asset",
  "description": "Resources owned by the company",
  "normal_balance": "Debit",
  "code_range_start": 1000,
  "code_range_end": 1999,
  "code_range_display": "1000-1999",
  "category_required": true,
  "allowed_categories": ["Current", "Non-Current"],
  "financial_statement": "Balance Sheet",
  "allow_header_accounts": true,
  "allow_transactions": false,
  "is_system": true,
  "display_order": 1,
  "is_active": true,
  "account_count": 45,
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-01T00:00:00Z"
}
```

### Custom Display Fields

#### code_range_display
- Combines code_range_start and code_range_end
- Format: "1000-1999"
- Easier to read than separate fields
- Implementation: SerializerMethodField

#### allowed_categories_display
- Formats category list as readable string
- Format: "Current, Non-Current"
- Useful for UI dropdowns
- Implementation: SerializerMethodField

#### account_count
- Count of accounts using this type
- Useful for analytics
- Calculated via reverse relationship
- Implementation: SerializerMethodField

### Validation Logic

#### Validate Normal Balance
- Must be "Debit" or "Credit"
- Case-sensitive or normalize to title case
- Raise ValidationError if invalid
- Implementation in validate_normal_balance()

#### Validate Code Range
- code_range_start must be less than code_range_end
- Both must be positive integers
- Range must not overlap with other types
- Implementation in validate()

#### Validate Allowed Categories
- Each category must be in valid choices
- Cannot be empty if category_required is True
- Implementation in validate_allowed_categories()

### Use Cases

#### Account Creation Form
- Load all account types
- Show type selection dropdown
- Display code range for selected type
- Show required category options

#### Type Management
- CRUD operations for account types
- View type configurations
- Update type settings
- Disable unused types

#### Validation Reference
- Check account code against type range
- Verify category is allowed for type
- Enforce business rules

### Expected Outcome
- AccountTypeConfigSerializer fully functional
- All type configuration fields exposed
- Read-only fields protected
- Custom display fields for UI
- Validation ensures data integrity

### Verification Checklist
- [ ] account_type.py module created
- [ ] AccountTypeConfigSerializer class defined
- [ ] All identification fields included
- [ ] Balance configuration included
- [ ] Code range fields included
- [ ] Category configuration included
- [ ] Control flags included
- [ ] Read-only fields configured
- [ ] Custom display fields added
- [ ] Validation methods implemented
- [ ] Test serialization of AccountTypeConfig
- [ ] Verify JSON output structure
- [ ] Test validation logic

---

## Task 76: Create COATemplateSerializer

### Overview
Create the COATemplateSerializer for serializing chart of accounts templates. These templates provide pre-configured account structures for different business types (retail, manufacturing, services, etc.) and industries. The serializer supports template selection during tenant setup and template management.

### Dependencies
- COATemplate model is fully implemented
- Task 75: AccountTypeSerializer created

### Instructions

1. **Create coa_template.py module**
   - Navigate to apps/accounting/serializers/
   - Create coa_template.py file
   - This will contain COATemplateSerializer
   - Import necessary DRF components

2. **Import required dependencies**
   - Import serializers from rest_framework
   - Import COATemplate model
   - Import Country model (for localization)
   - Import any related models

3. **Create COATemplateSerializer class**
   - Define class inheriting from serializers.ModelSerializer
   - Set model to COATemplate in Meta class
   - Configure fields for template information

4. **Include identification fields**
   - Include 'id' field (primary key)
   - Include 'template_code' field (unique identifier)
   - Include 'template_name' field (display name)
   - Include 'description' field (detailed info)

5. **Include categorization fields**
   - Include 'business_type' field
   - Example values: Retail, Manufacturing, Services
   - Include 'industry' field (optional)
   - Example: Restaurants, Construction, Healthcare
   - Include 'country' field for localization

6. **Include template metadata**
   - Include 'version' field (template version)
   - Include 'language' field (for internationalization)
   - Include 'is_default' field (default template flag)
   - Include 'is_active' field (availability status)

7. **Include account statistics**
   - Add 'account_count' field
   - Shows number of accounts in template
   - Calculated from template accounts
   - Implementation: SerializerMethodField

8. **Include structure information**
   - Add 'max_depth' field
   - Shows deepest level in hierarchy
   - Add 'has_opening_balances' field
   - Indicates if template includes balances

9. **Include localization info**
   - Include 'currency' field
   - Default currency for template
   - Include 'date_format' field (optional)
   - Include 'number_format' field (optional)

10. **Include template features**
    - Add 'supports_multi_currency' field
    - Add 'supports_cost_centers' field
    - Add 'supports_departments' field
    - Indicate template capabilities

11. **Include author/source info**
    - Include 'author' field (who created)
    - Include 'source' field (origin)
    - Include 'license' field (usage rights)
    - Include 'documentation_url' field

12. **Include timestamps**
    - Include 'created_at' field (read-only)
    - Include 'updated_at' field (read-only)
    - Include 'last_used_at' field
    - Track template usage

13. **Add preview data**
    - Create 'sample_accounts' field
    - Show first few accounts as preview
    - Use nested AccountSerializer
    - Limit to 5-10 accounts

14. **Add usage statistics**
    - Add 'times_used' field
    - Count of tenant installations
    - Add 'rating' field (if user ratings exist)
    - Help users choose popular templates

15. **Configure read-only fields**
    - Set statistical fields as read-only
    - Set system-generated fields as read-only
    - Protect template integrity

### Serializer Structure

```
COATemplateSerializer
├── Identification
│   ├── id (read-only)
│   ├── template_code (unique)
│   ├── template_name
│   └── description
├── Categorization
│   ├── business_type
│   ├── industry
│   └── country
├── Metadata
│   ├── version
│   ├── language
│   ├── is_default
│   └── is_active
├── Statistics
│   ├── account_count (calculated)
│   ├── max_depth (calculated)
│   ├── times_used (calculated)
│   └── rating (optional)
├── Localization
│   ├── currency
│   ├── date_format
│   └── number_format
├── Features
│   ├── supports_multi_currency
│   ├── supports_cost_centers
│   └── supports_departments
├── Source Info
│   ├── author
│   ├── source
│   ├── license
│   └── documentation_url
└── Preview
    └── sample_accounts (nested)
```

### Field Details

| Field | Type | Read-Only | Purpose |
|-------|------|-----------|---------|
| id | Integer | Yes | Primary key |
| template_code | String | No | Unique identifier |
| template_name | String | No | Display name |
| description | Text | No | Template description |
| business_type | Choice | No | Business category |
| industry | String | No | Specific industry |
| country | FK | No | Country/region |
| version | String | No | Template version (1.0) |
| language | String | No | Language code (en, si) |
| is_default | Boolean | No | Default template |
| is_active | Boolean | No | Available for use |
| account_count | Integer | Yes | Number of accounts |
| max_depth | Integer | Yes | Hierarchy depth |
| currency | String | No | Default currency |
| supports_multi_currency | Boolean | No | Multi-currency support |
| times_used | Integer | Yes | Usage count |
| created_at | DateTime | Yes | Creation timestamp |

### API Response Example

#### Template Response
```json
{
  "id": 1,
  "template_code": "LK-RETAIL-001",
  "template_name": "Sri Lankan Retail Store",
  "description": "Standard chart of accounts for retail businesses in Sri Lanka",
  "business_type": "Retail",
  "industry": "Retail Trade",
  "country": "LK",
  "version": "1.0",
  "language": "en",
  "is_default": true,
  "is_active": true,
  "account_count": 87,
  "max_depth": 4,
  "has_opening_balances": false,
  "currency": "LKR",
  "supports_multi_currency": true,
  "supports_cost_centers": false,
  "supports_departments": true,
  "author": "Accounting Team",
  "source": "ICASL Guidelines",
  "license": "MIT",
  "documentation_url": "https://example.com/docs/retail-template",
  "times_used": 245,
  "rating": 4.5,
  "sample_accounts": [
    {"code": "1000", "name": "Assets", "is_header": true},
    {"code": "1100", "name": "Current Assets", "is_header": true},
    {"code": "1110", "name": "Cash & Bank", "is_header": true},
    {"code": "1111", "name": "Cash on Hand", "is_header": false},
    {"code": "1112", "name": "Cash at Bank", "is_header": false}
  ],
  "created_at": "2025-01-01T00:00:00Z",
  "updated_at": "2025-01-15T00:00:00Z",
  "last_used_at": "2025-01-23T14:30:00Z"
}
```

### Custom Calculated Fields

#### account_count
- Count of template accounts
- Query related TemplateAccount objects
- Implementation: `return obj.template_accounts.count()`

#### max_depth
- Maximum hierarchy depth in template
- Use MPTT level field
- Implementation: `return obj.template_accounts.aggregate(Max('level'))['level__max']`

#### times_used
- Count of tenants using this template
- Query Tenant model for template FK
- Implementation: `return obj.tenant_set.count()`

### Sample Accounts Preview

#### Purpose
- Give users preview of template structure
- Show account naming conventions
- Demonstrate hierarchy
- Help choose appropriate template

#### Implementation
- Query first 10 template accounts
- Order by code
- Serialize with minimal AccountSerializer
- Include code, name, is_header only

### Business Type Choices

| Business Type | Description | Example Industries |
|--------------|-------------|-------------------|
| Retail | Goods resale | Stores, supermarkets |
| Manufacturing | Goods production | Factories, workshops |
| Services | Service provision | Consulting, IT services |
| Construction | Building projects | Contractors, builders |
| Healthcare | Medical services | Clinics, hospitals |
| Hospitality | Accommodation/food | Hotels, restaurants |
| Agriculture | Farming/cultivation | Farms, plantations |

### Template Localization

#### Purpose
- Adapt templates to country requirements
- Meet local accounting standards
- Use local language and currency
- Comply with tax regulations

#### Localization Aspects
- **Language**: Account names in local language
- **Currency**: Default currency for country
- **Tax Accounts**: Country-specific tax accounts
- **Regulations**: Comply with local GAAP

#### Sri Lanka Specific
- Currency: LKR
- Tax: VAT, NBT, EPF, ETF accounts
- Compliance: SLSCA standards
- Language: English, Sinhala, Tamil options

### Use Cases

#### Tenant Setup
- Display available templates
- Filter by business type and country
- Show template preview
- Apply selected template to new tenant

#### Template Management
- Create new templates
- Update existing templates
- Activate/deactivate templates
- Track template usage

#### Template Selection UI
- Show templates with descriptions
- Display account count and depth
- Show usage statistics and ratings
- Preview sample accounts

### Expected Outcome
- COATemplateSerializer fully functional
- All template information exposed
- Sample accounts preview included
- Usage statistics calculated
- Support for template selection interface

### Verification Checklist
- [ ] coa_template.py module created
- [ ] COATemplateSerializer class defined
- [ ] All identification fields included
- [ ] Categorization fields included
- [ ] Metadata fields included
- [ ] Statistical fields implemented
- [ ] Localization fields included
- [ ] Feature flags included
- [ ] Source information included
- [ ] Sample accounts preview implemented
- [ ] Usage statistics calculated
- [ ] Test serialization of COATemplate
- [ ] Verify JSON output structure
- [ ] Test with various template types

---

## Task 77: Add Create Account Validation

### Overview
Implement custom validation logic in AccountSerializer for account creation. This validation ensures that new accounts meet business rules including code range validation, code uniqueness, parent type matching, and system account restrictions. Proper validation prevents data integrity issues and enforces accounting principles.

### Dependencies
- Task 72: Create AccountSerializer
- Task 75: Create AccountTypeSerializer

### Instructions

1. **Open AccountSerializer**
   - Navigate to serializers/account.py
   - Locate AccountSerializer class
   - Prepare to add validation methods

2. **Add validate_code method**
   - Create validate_code(self, value) method
   - This validates individual code field
   - Called automatically by DRF
   - Raises ValidationError if invalid

3. **Implement code format validation**
   - Check code is numeric string
   - Validate length (typically 4 digits)
   - Ensure no special characters
   - Handle leading zeros appropriately

4. **Implement code uniqueness validation**
   - Check if code already exists in tenant
   - Query Account.objects.filter(code=value)
   - Consider tenant scope in multi-tenancy
   - Allow updates (exclude current instance)

5. **Implement code range validation**
   - Get account_type from initial_data
   - Retrieve type's code_range_start and code_range_end
   - Ensure code falls within range
   - Provide clear error message with valid range

6. **Add validate method for cross-field validation**
   - Create validate(self, attrs) method
   - Validates multiple fields together
   - Called after individual field validation
   - Returns validated attrs dictionary

7. **Validate parent account type matching**
   - Extract parent from attrs
   - Extract account_type from attrs
   - If parent exists, check parent.account_type == account_type
   - Prevent cross-type hierarchies

8. **Validate header account restrictions**
   - If is_header is True, validate type allows headers
   - Check account_type.allow_header_accounts
   - Prevent invalid header accounts
   - Provide clear error message

9. **Validate opening balance requirements**
   - If account is detail account (not header)
   - Opening balance may be required or optional
   - Validate currency matches tenant
   - Ensure balance is decimal format

10. **Validate system account restrictions**
    - Prevent manual creation of system accounts
    - Check if code is reserved for system
    - Check if is_system is set (should not be in create)
    - System accounts only created via fixtures

11. **Validate category requirements**
    - Check if account_type.category_required is True
    - If required, ensure category is provided
    - Validate category is in allowed_categories
    - Provide list of valid categories in error

12. **Add validation for circular references**
    - Prevent account being its own parent
    - Prevent circular parent-child relationships
    - Use MPTT validation helpers
    - This is mostly handled by MPTT but double-check

13. **Validate required fields based on type**
    - Some types may require additional fields
    - Example: Control accounts need link to sub-ledger
    - Validate based on account configuration
    - Dynamic validation based on type

14. **Add helpful error messages**
    - Each validation should have clear message
    - Include valid range or options in message
    - Example: "Code must be between 1000 and 1999 for Asset accounts"
    - Help users fix the issue quickly

15. **Test validation thoroughly**
    - Test each validation rule
    - Test valid and invalid inputs
    - Test edge cases
    - Ensure proper error messages

### Validation Methods Structure

```
AccountSerializer Validation (Create)
├── validate_code()
│   ├── Format validation (numeric, length)
│   ├── Uniqueness check (per tenant)
│   └── Range check (within type range)
├── validate()
│   ├── Parent type matching
│   ├── Header account restrictions
│   ├── Category requirements
│   ├── Opening balance validation
│   └── System account prevention
└── Error Messages
    ├── Clear description of issue
    ├── Valid options or range
    └── Actionable guidance
```

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Code Format | Numeric, 4 digits | "Code must be a 4-digit number" |
| Code Unique | Not exists in DB | "Account code already exists" |
| Code Range | Within type range | "Code must be 1000-1999 for Assets" |
| Parent Type | Same as account type | "Parent must be same account type" |
| Header Allowed | Type allows headers | "This account type cannot have headers" |
| Category Required | Category provided | "Category is required for this type" |
| Category Valid | In allowed list | "Category must be one of: Current, Non-Current" |
| System Restriction | is_system not set | "System accounts cannot be created manually" |

### Code Validation Examples

#### Valid Codes
- "1000" → Valid (4 digits, numeric)
- "1100" → Valid
- "2350" → Valid

#### Invalid Codes
- "100" → Invalid (too short)
- "10000" → Invalid (too long)
- "ABC1" → Invalid (not numeric)
- "12.5" → Invalid (decimal)

### Code Range Validation Implementation

#### Logic
```python
def validate_code(self, value):
    # Format validation
    if not value.isdigit() or len(value) != 4:
        raise ValidationError("Account code must be a 4-digit number")
    
    # Uniqueness validation
    tenant = get_current_tenant()
    if Account.objects.filter(tenant=tenant, code=value).exists():
        raise ValidationError("Account code already exists")
    
    # Range validation
    account_type_id = self.initial_data.get('account_type')
    if account_type_id:
        account_type = AccountTypeConfig.objects.get(id=account_type_id)
        code_int = int(value)
        if not (account_type.code_range_start <= code_int <= account_type.code_range_end):
            raise ValidationError(
                f"Code must be between {account_type.code_range_start} "
                f"and {account_type.code_range_end} for {account_type.type_name} accounts"
            )
    
    return value
```

### Parent Type Validation

#### Purpose
- Ensure hierarchy integrity
- Prevent cross-type relationships
- Maintain accounting structure

#### Implementation
```python
def validate(self, attrs):
    parent = attrs.get('parent')
    account_type = attrs.get('account_type')
    
    if parent and account_type:
        if parent.account_type != account_type:
            raise ValidationError({
                'parent': f"Parent account must be of type {account_type.type_name}"
            })
    
    return attrs
```

### Category Requirement Validation

#### Purpose
- Enforce type-specific requirements
- Ensure proper categorization
- Support financial reporting

#### Implementation
```python
def validate(self, attrs):
    account_type = attrs.get('account_type')
    category = attrs.get('category')
    
    if account_type and account_type.category_required and not category:
        raise ValidationError({
            'category': f"Category is required for {account_type.type_name} accounts. "
                       f"Valid options: {', '.join(account_type.allowed_categories)}"
        })
    
    if category and account_type:
        if category not in account_type.allowed_categories:
            raise ValidationError({
                'category': f"Category must be one of: {', '.join(account_type.allowed_categories)}"
            })
    
    return attrs
```

### Error Response Example

#### Invalid Create Request
```json
{
  "code": ["Code must be between 1000 and 1999 for Asset accounts"],
  "parent": ["Parent account must be of type Asset"],
  "category": ["Category is required for Asset accounts. Valid options: Current, Non-Current"]
}
```

### Expected Outcome
- Comprehensive validation for account creation
- Code format, uniqueness, and range validated
- Parent type matching enforced
- Category requirements checked
- Clear error messages guide users
- Data integrity maintained

### Verification Checklist
- [ ] validate_code method implemented
- [ ] Code format validation works
- [ ] Code uniqueness checked
- [ ] Code range validated against type
- [ ] validate method implemented
- [ ] Parent type matching validated
- [ ] Header account restrictions enforced
- [ ] Category requirements validated
- [ ] System account creation prevented
- [ ] Opening balance validation added
- [ ] Error messages are clear and helpful
- [ ] Test valid account creation
- [ ] Test invalid code format
- [ ] Test code out of range
- [ ] Test parent type mismatch
- [ ] Test missing required category
- [ ] Test duplicate code rejection

---

## Task 78: Add Update Account Validation

### Overview
Implement custom validation logic in AccountSerializer for account updates. This validation enforces restrictions on updating protected fields like account type and code for system accounts, prevents modification of accounts with transactions, and validates parent changes. Update validation is more restrictive than create validation to protect financial data integrity.

### Dependencies
- Task 77: Add Create Account Validation

### Instructions

1. **Add update-specific validation method**
   - Create validate_update(self, instance, attrs) method
   - Called during update operations
   - Has access to existing instance
   - Can compare old vs new values

2. **Override validate method for update detection**
   - Check if self.instance exists (update mode)
   - Apply different rules for create vs update
   - Call validate_update if in update mode
   - Maintain backward compatibility

3. **Prevent account type changes**
   - Compare new account_type with instance.account_type
   - If different, check if account has transactions
   - If has transactions, raise ValidationError
   - If no transactions, allow change (with warning)

4. **Prevent code changes for system accounts**
   - Check if instance.is_system is True
   - If system account, prevent code changes
   - Raise ValidationError with clear message
   - System account codes are fixed

5. **Prevent changes to accounts with transactions**
   - Check if account has posted journal entries
   - Query JournalEntry model for account
   - If has transactions, restrict certain changes
   - Allow only safe changes (name, description)

6. **Define protected fields for system accounts**
   - code: Cannot change
   - account_type: Cannot change
   - is_system: Cannot change (already read-only)
   - parent: May be restricted
   - category: May be restricted

7. **Define restricted fields with transactions**
   - account_type: Cannot change
   - code: Should not change (warn if attempting)
   - parent: May change if same type
   - is_header: Cannot change if has transactions

8. **Validate parent changes**
   - If parent is being changed
   - Validate new parent is same account_type
   - Validate not creating circular reference
   - Validate account can be moved (no transactions or allow)

9. **Validate status changes**
   - If status is changing to Inactive or Archived
   - Check if account has non-zero balance
   - Warn or prevent if has balance
   - Allow with force flag if needed

10. **Validate is_header changes**
    - If changing is_header from False to True
    - Ensure account has no transactions
    - Ensure would not conflict with children
    - If changing True to False, ensure no children

11. **Add transaction count check method**
    - Create helper method to count transactions
    - Query journal entries for account
    - Cache result to avoid multiple queries
    - Use in multiple validation rules

12. **Add balance check method**
    - Create helper method to check balance
    - Return current_balance
    - Use to prevent archiving accounts with balances
    - Consider threshold (allow if < $0.01)

13. **Implement warning vs error distinction**
    - Some changes should warn, not block
    - Use custom response or metadata
    - Example: Changing code warns but allows
    - Critical changes (type) raise errors

14. **Add override mechanism (with caution)**
    - Add 'force_update' flag in context
    - Allow overriding certain validations
    - Require special permission
    - Log forced updates for audit

15. **Test update validation thoroughly**
    - Test updating each field individually
    - Test system account update restrictions
    - Test accounts with transactions
    - Test accounts with children
    - Test status changes with balances

### Update Validation Structure

```
AccountSerializer Validation (Update)
├── validate() - Route to update validation
│   └── if self.instance:
│       └── validate_update()
├── validate_update()
│   ├── Check is_system → restrict protected fields
│   ├── Check has_transactions → restrict changes
│   ├── Validate account_type change
│   ├── Validate code change
│   ├── Validate parent change
│   ├── Validate status change
│   ├── Validate is_header change
│   └── Return validated attrs
└── Helper Methods
    ├── has_transactions()
    ├── get_transaction_count()
    ├── has_balance()
    └── can_change_field()
```

### Update Validation Rules

| Scenario | Field | Rule | Can Override |
|----------|-------|------|--------------|
| System Account | code | Cannot change | No |
| System Account | account_type | Cannot change | No |
| System Account | parent | Limited | Admin only |
| Has Transactions | account_type | Cannot change | No |
| Has Transactions | code | Warning only | Yes |
| Has Transactions | parent | Can change (same type) | Yes |
| Has Transactions | is_header | Cannot change | No |
| Has Balance | status → Inactive | Warning | Yes |
| Has Balance | status → Archived | Blocked | Admin only |
| Is Header | is_header → False | Must have no children | No |

### System Account Protection

#### Purpose
- Protect critical system accounts
- Prevent accidental misconfiguration
- Maintain system integrity

#### Protected Fields
- code: Fixed by design
- account_type: Fixed by design
- is_system: Cannot be unset
- May restrict parent, category

#### Implementation
```python
def validate_update(self, instance, attrs):
    if instance.is_system:
        protected_fields = ['code', 'account_type']
        for field in protected_fields:
            if field in attrs and attrs[field] != getattr(instance, field):
                raise ValidationError({
                    field: "Cannot change this field for system accounts"
                })
    return attrs
```

### Transaction Existence Check

#### Purpose
- Prevent changes that would invalidate transactions
- Maintain accounting trail integrity
- Protect posted financial data

#### Fields Restricted
- account_type: Would change transaction meaning
- is_header: Headers shouldn't have transactions
- May restrict code changes

#### Implementation
```python
def has_transactions(self, instance):
    return instance.journal_entries.exists()

def validate_update(self, instance, attrs):
    if self.has_transactions(instance):
        if 'account_type' in attrs and attrs['account_type'] != instance.account_type:
            raise ValidationError({
                'account_type': "Cannot change account type for accounts with transactions"
            })
    return attrs
```

### Parent Change Validation

#### Purpose
- Allow reorganization when safe
- Prevent breaking hierarchy integrity
- Maintain type consistency

#### Rules
- New parent must be same account_type
- Cannot create circular reference
- May require no transactions (or allow with warning)

#### Implementation
```python
def validate_update(self, instance, attrs):
    if 'parent' in attrs:
        new_parent = attrs['parent']
        if new_parent:
            # Type matching
            if new_parent.account_type != instance.account_type:
                raise ValidationError({
                    'parent': "New parent must be same account type"
                })
            
            # Circular reference check
            if new_parent.id == instance.id:
                raise ValidationError({
                    'parent': "Account cannot be its own parent"
                })
            
            # Check if new_parent is descendant
            if new_parent in instance.get_descendants():
                raise ValidationError({
                    'parent': "Cannot move account under its own descendant"
                })
    
    return attrs
```

### Status Change Validation

#### Purpose
- Prevent accidental account disabling
- Warn about balance implications
- Support cleanup of unused accounts

#### Rules
- Inactive: Allow if no recent transactions
- Archived: Require zero balance
- Warning if has balance
- Force flag can override with permission

#### Implementation
```python
def validate_update(self, instance, attrs):
    if 'status' in attrs:
        new_status = attrs['status']
        if new_status in ['Inactive', 'Archived']:
            if abs(instance.current_balance) > 0.01:
                if not self.context.get('force_update'):
                    raise ValidationError({
                        'status': f"Cannot change status to {new_status} while account has balance. "
                                 f"Current balance: {instance.current_balance}"
                    })
    return attrs
```

### Header Account Changes

#### Purpose
- Maintain hierarchy structure
- Prevent header accounts with transactions
- Ensure children exist for headers

#### Rules
- Cannot change False → True if has transactions
- Cannot change True → False if has children
- Headers organize, detail accounts transact

#### Implementation
```python
def validate_update(self, instance, attrs):
    if 'is_header' in attrs:
        new_is_header = attrs['is_header']
        
        # Changing to header
        if new_is_header and not instance.is_header:
            if self.has_transactions(instance):
                raise ValidationError({
                    'is_header': "Cannot convert to header account while it has transactions"
                })
        
        # Changing from header
        if not new_is_header and instance.is_header:
            if instance.get_children().exists():
                raise ValidationError({
                    'is_header': "Cannot convert from header account while it has child accounts"
                })
    
    return attrs
```

### Force Update Mechanism

#### Purpose
- Allow administrators to override restrictions
- Handle exceptional cases
- Maintain audit trail

#### Implementation
- Add 'force_update' flag to context
- Check user permission for force updates
- Log all forced updates
- Require reason for force update

#### Usage
```python
serializer = AccountSerializer(
    account,
    data=update_data,
    partial=True,
    context={
        'force_update': True,
        'force_reason': "Correcting historical error",
        'request': request
    }
)
```

### Error Response Example

#### Invalid Update Request
```json
{
  "code": ["Cannot change account code for system accounts"],
  "account_type": ["Cannot change account type for accounts with transactions"],
  "status": ["Cannot change status to Archived while account has balance. Current balance: 5000.00"],
  "is_header": ["Cannot convert to header account while it has transactions"]
}
```

### Expected Outcome
- Comprehensive validation for account updates
- System accounts protected from changes
- Accounts with transactions restricted appropriately
- Parent changes validated for type and circularity
- Status changes checked against balance
- Header account changes validated
- Force update mechanism for admin overrides

### Verification Checklist
- [ ] validate_update method implemented
- [ ] Update detection logic added
- [ ] System account protection implemented
- [ ] Transaction existence checking works
- [ ] Account type change restricted
- [ ] Code change restricted for system accounts
- [ ] Parent change validation implemented
- [ ] Status change validation implemented
- [ ] is_header change validation implemented
- [ ] Balance check method created
- [ ] Transaction count method created
- [ ] Force update mechanism implemented
- [ ] Test updating allowed fields (name, description)
- [ ] Test restricting system account changes
- [ ] Test restricting accounts with transactions
- [ ] Test parent change validation
- [ ] Test status change with balance
- [ ] Test header account change restrictions
- [ ] Test force update override

---

## Summary Diagram: Serializer Validation Flow

```
Serializer Validation Architecture
│
├─── AccountTypeConfigSerializer (Task 75)
│    ├─── Type identification and configuration
│    ├─── Code range definition
│    ├─── Category requirements
│    └─── Balance and reporting config
│
├─── COATemplateSerializer (Task 76)
│    ├─── Template identification
│    ├─── Business type categorization
│    ├─── Account statistics
│    ├─── Localization information
│    └─── Sample account preview
│
├─── Create Validation (Task 77)
│    ├─── validate_code()
│    │   ├─── Format (4 digits, numeric)
│    │   ├─── Uniqueness (per tenant)
│    │   └─── Range (within type range)
│    └─── validate()
│        ├─── Parent type matching
│        ├─── Header restrictions
│        ├─── Category requirements
│        └─── System account prevention
│
└─── Update Validation (Task 78)
     ├─── validate_update()
     │   ├─── System account protection
     │   ├─── Transaction-based restrictions
     │   ├─── Type change prevention
     │   ├─── Code change restrictions
     │   ├─── Parent change validation
     │   ├─── Status change checking
     │   └─── Header change validation
     └─── Helper Methods
         ├─── has_transactions()
         ├─── has_balance()
         └─── can_change_field()

Result: Comprehensive validation ensuring data integrity and business rule compliance
```

---

## End of Document

**Group E Complete:** You have finished all serializer and admin configuration tasks. Proceed to Group-F for API endpoints, testing, and documentation.
