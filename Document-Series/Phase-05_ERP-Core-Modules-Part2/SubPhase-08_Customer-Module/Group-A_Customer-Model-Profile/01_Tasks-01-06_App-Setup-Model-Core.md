# Tasks 01-06: App Setup and Model Core

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 08 - Customer Module  
> **Group:** A - Customer Model & Profile  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Contact-Tax-Dates-Financial-Marketing.md](02_Tasks-07-12_Contact-Tax-Dates-Financial-Marketing.md)

---

## Document Overview

This document covers the foundational setup of the Customer module, including creating the Django app, registering it as a tenant-aware app, defining core customer type and status choices, and establishing the Customer model's core and type-specific fields.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create customers Django App | Low | 15 min |
| 02 | Register customers App | Low | 10 min |
| 03 | Define CustomerType Choices | Low | 15 min |
| 04 | Define CustomerStatus Choices | Low | 15 min |
| 05 | Create Customer Model Core Fields | Medium | 25 min |
| 06 | Add Customer Type Fields | Medium | 20 min |

---

## Task 01: Create Customers Django App

### Overview
Create the `customers` Django application to manage all customer-related functionality. This app will handle customer profiles, addresses, contact information, communication history, and customer data management for the multi-tenant ERP system.

### Dependencies
- Django project structure is established
- Multi-tenancy infrastructure is in place
- `apps/` directory exists

### Instructions

1. **Create customers directory structure**
   - Navigate to `apps/` directory
   - Create new directory named `customers`
   - This will house all customer management functionality

2. **Create package initialization file**
   - Create `__init__.py` in `customers/` directory
   - Leave empty or add module docstring

3. **Create Django app configuration**
   - Create `apps.py` in `customers/` directory
   - Define CustomersConfig class
   - Set app name as 'apps.customers'
   - Set verbose name as 'Customer Management'

4. **Create models subdirectory**
   - Create `models/` directory inside `customers/`
   - This will contain all customer-related models

5. **Create models package initialization**
   - Create `__init__.py` in `models/` directory
   - Leave empty initially (will import models later)

6. **Create constants module**
   - Create `constants.py` in `customers/` directory
   - Will contain customer types, statuses, and sources

7. **Create services subdirectory**
   - Create `services/` directory inside `customers/`
   - Will contain business logic services

8. **Create services package initialization**
   - Create `__init__.py` in `services/` directory

9. **Create admin module**
   - Create `admin.py` in `customers/` directory
   - Will contain Django admin configurations

### Directory Structure
```
apps/customers/
├── __init__.py                    # Package initialization
├── apps.py                        # App configuration
├── models/
│   └── __init__.py               # Models package init
├── services/
│   └── __init__.py               # Services package init
├── constants.py                  # Constants definitions
└── admin.py                      # Admin configurations
```

### Module Purpose

| Module | Purpose |
|--------|---------|
| `customers/__init__.py` | Package entry point |
| `customers/apps.py` | Django app configuration |
| `models/__init__.py` | Model imports and exports |
| `services/__init__.py` | Service layer exports |
| `constants.py` | Customer types, statuses, sources |
| `admin.py` | Django admin customization |

### Expected Outcome
- Clean Django app structure
- Organized location for customer functionality
- Foundation for customer management system
- Separation of concerns (models, services, admin)

### Verification Checklist
- [ ] `apps/customers/` directory exists
- [ ] `customers/__init__.py` file created
- [ ] `customers/apps.py` file created with CustomersConfig
- [ ] `customers/models/` directory exists
- [ ] `customers/models/__init__.py` file created
- [ ] `customers/services/` directory exists
- [ ] `customers/services/__init__.py` file created
- [ ] `customers/constants.py` file created
- [ ] `customers/admin.py` file created

---

## Task 02: Register Customers App

### Overview
Register the customers app in the tenant-specific applications list (TENANT_APPS) to ensure it operates within the multi-tenancy framework. This registration enables tenant isolation for customer data.

### Dependencies
- Task 01: Create customers Django App
- Django settings configuration exists
- Multi-tenancy settings (django-tenants) configured

### Instructions

1. **Locate tenant settings configuration**
   - Open the Django settings file
   - Find TENANT_APPS configuration section
   - This list contains tenant-aware applications

2. **Add customers app to TENANT_APPS**
   - Add 'apps.customers' to TENANT_APPS list
   - Place it in appropriate order (after core apps, before optional modules)
   - Ensure proper comma separation

3. **Verify app label consistency**
   - Confirm app label matches 'apps.customers'
   - Matches the name configured in CustomersConfig

4. **Add app to INSTALLED_APPS references**
   - If using combined INSTALLED_APPS configuration
   - Ensure customers app is included properly
   - Maintain correct ordering

### TENANT_APPS Configuration

```
Tenant-Aware Application Structure
═══════════════════════════════════

TENANT_APPS should include:
  ├── Core tenant models
  ├── ERP modules:
  │   ├── apps.inventory
  │   ├── apps.pos
  │   ├── apps.customers        ← Add here
  │   ├── apps.suppliers
  │   └── ...
  └── Other tenant-specific apps
```

### Registration Importance

| Aspect | Impact |
|--------|--------|
| Tenant Isolation | Customer data separated per tenant |
| Schema Management | Tables created in tenant schemas |
| Migrations | Applied to all tenant databases |
| Data Access | Automatic tenant filtering |

### Expected Outcome
- Customers app registered as tenant-aware
- Customer data will be tenant-isolated
- Migrations will apply to tenant schemas
- Django recognizes the customers app

### Verification Checklist
- [ ] 'apps.customers' added to TENANT_APPS
- [ ] Proper position in TENANT_APPS list
- [ ] No syntax errors in settings file
- [ ] Django can import the app without errors
- [ ] App appears in `python manage.py showmigrations`

---

## Task 03: Define CustomerType Choices

### Overview
Define customer type choices to categorize customers based on their entity type. The system supports individuals, businesses, government entities, and nonprofits, each with specific field requirements and behaviors.

### Dependencies
- Task 01: Create customers Django App
- constants.py file exists

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/customers/constants.py`
   - Prepare to define customer type constants

2. **Add module docstring**
   - Add comprehensive module documentation
   - Explain the purpose of constants
   - Note usage context (model choices, filtering, validation)

3. **Define CUSTOMER_TYPE_INDIVIDUAL constant**
   - Value: 'individual'
   - Purpose: Personal/retail customers
   - Most common customer type for B2C

4. **Define CUSTOMER_TYPE_BUSINESS constant**
   - Value: 'business'
   - Purpose: Companies and businesses
   - B2B customers with company details

5. **Define CUSTOMER_TYPE_GOVERNMENT constant**
   - Value: 'government'
   - Purpose: Government entities
   - Sri Lanka government departments

6. **Define CUSTOMER_TYPE_NONPROFIT constant**
   - Value: 'nonprofit'
   - Purpose: NGOs and charities
   - Tax-exempt organizations

7. **Define CUSTOMER_TYPE_CHOICES tuple**
   - Create tuple of customer type choices
   - Follow Django's choices pattern (value, display_name)
   - Include all customer types

### Customer Type Details

| Constant | Value | Display Name | Use Case |
|----------|-------|--------------|----------|
| CUSTOMER_TYPE_INDIVIDUAL | 'individual' | Individual | Personal/retail customers |
| CUSTOMER_TYPE_BUSINESS | 'business' | Business | Companies, partnerships |
| CUSTOMER_TYPE_GOVERNMENT | 'government' | Government | Government departments |
| CUSTOMER_TYPE_NONPROFIT | 'nonprofit' | Non-Profit | NGOs, charities, foundations |

### Customer Type Characteristics

#### Individual Customers
- **Primary Fields**: first_name, last_name
- **Optional Fields**: email, phone
- **Tax Fields**: Generally not required
- **Identification**: Name-based
- **Use Cases**: 
  - Retail customers
  - Walk-in purchases
  - Personal accounts

#### Business Customers
- **Primary Fields**: company_name, company_registration
- **Required Fields**: tax_id (optional), vat_number (optional)
- **Additional Fields**: Contact person details
- **Identification**: Company registration number
- **Use Cases**:
  - B2B sales
  - Wholesale accounts
  - Corporate customers
  - Resellers

#### Government Customers
- **Primary Fields**: company_name (department name)
- **Specific Fields**: department_code, budget_code
- **Requirements**: Official procurement processes
- **Identification**: Department code
- **Use Cases**:
  - Government procurement
  - Public sector sales
  - Grant-funded purchases

#### Nonprofit Customers
- **Primary Fields**: company_name (organization name)
- **Specific Fields**: registration_number, tax_exempt_status
- **Requirements**: Charitable organization verification
- **Identification**: Registration number
- **Use Cases**:
  - NGO purchases
  - Charitable organizations
  - Religious institutions

### Field Requirements by Type

| Field | Individual | Business | Government | Nonprofit |
|-------|-----------|----------|------------|-----------|
| first_name | ✅ Required | Optional | Optional | Optional |
| last_name | ✅ Required | Optional | Optional | Optional |
| company_name | - | ✅ Required | ✅ Required | ✅ Required |
| company_registration | - | ✅ Required | Optional | ✅ Required |
| tax_id | - | Optional | - | Optional |
| vat_number | - | Optional | - | - |

### Display Name Logic

```
Customer Display Name Generation
═════════════════════════════════

INDIVIDUAL:
  → "{first_name} {last_name}"
  → Example: "Saman Perera"

BUSINESS:
  → "{company_name}"
  → Example: "ABC Trading (Pvt) Ltd"

GOVERNMENT:
  → "{company_name}"
  → Example: "Ministry of Health"

NONPROFIT:
  → "{company_name}"
  → Example: "Red Cross Society"
```

### Sri Lanka Context

| Customer Type | Sri Lanka Examples |
|--------------|-------------------|
| Individual | Retail customers, personal accounts |
| Business | Private limited companies (Pvt Ltd), partnerships |
| Government | Ministries, departments, provincial councils |
| Nonprofit | NGOs, charity organizations, temples, churches |

### Expected Outcome
- Clear customer type categorization
- Consistent customer type values
- Foundation for type-specific validation
- Support for various entity types

### Verification Checklist
- [ ] CUSTOMER_TYPE_INDIVIDUAL constant defined
- [ ] CUSTOMER_TYPE_BUSINESS constant defined
- [ ] CUSTOMER_TYPE_GOVERNMENT constant defined
- [ ] CUSTOMER_TYPE_NONPROFIT constant defined
- [ ] CUSTOMER_TYPE_CHOICES tuple created
- [ ] All constants follow naming convention
- [ ] Display names are user-friendly
- [ ] Module docstring added

---

## Task 04: Define CustomerStatus Choices

### Overview
Define customer status choices to manage customer lifecycle states. The system tracks whether customers are active, inactive, blocked, or archived, controlling their ability to transact and visibility in the system.

### Dependencies
- Task 01: Create customers Django App
- constants.py file exists

### Instructions

1. **Open constants.py file**
   - Continue in `apps/customers/constants.py`
   - Add customer status constants section

2. **Define CUSTOMER_STATUS_ACTIVE constant**
   - Value: 'active'
   - Purpose: Active customers who can place orders
   - Default status for new customers

3. **Define CUSTOMER_STATUS_INACTIVE constant**
   - Value: 'inactive'
   - Purpose: Temporarily inactive customers
   - Cannot place orders until reactivated

4. **Define CUSTOMER_STATUS_BLOCKED constant**
   - Value: 'blocked'
   - Purpose: Blocked customers (payment issues, fraud)
   - Requires manual unblocking

5. **Define CUSTOMER_STATUS_ARCHIVED constant**
   - Value: 'archived'
   - Purpose: Archived customers
   - Hidden from standard searches, historical records

6. **Define CUSTOMER_STATUS_CHOICES tuple**
   - Create tuple of customer status choices
   - Follow Django's choices pattern (value, display_name)
   - Include all statuses

### Customer Status Details

| Constant | Value | Display Name | Can Order | Visible in Search | Use Case |
|----------|-------|--------------|-----------|-------------------|----------|
| CUSTOMER_STATUS_ACTIVE | 'active' | Active | ✅ Yes | ✅ Yes | Normal operation |
| CUSTOMER_STATUS_INACTIVE | 'inactive' | Inactive | ❌ No | ✅ Yes | Temporary suspension |
| CUSTOMER_STATUS_BLOCKED | 'blocked' | Blocked | ❌ No | ✅ Yes | Payment/fraud issues |
| CUSTOMER_STATUS_ARCHIVED | 'archived' | Archived | ❌ No | ❌ No | Historical records |

### Status Lifecycle Flow

```
Customer Status Lifecycle
═════════════════════════

        ┌─────────────┐
        │   ACTIVE    │ ◄──── Default for new customers
        └──────┬──────┘
               │
               ├────► INACTIVE ──────┐
               │                     │
               ├────► BLOCKED ───────┤
               │                     │
               └────► ARCHIVED       │
                          ▲          │
                          │          │
                          └──────────┘
                       (Permanent state)
```

### Status Behaviors

#### ACTIVE Status
- **Permissions**: Full access to place orders
- **Visibility**: Appears in all customer searches
- **POS**: Can be selected for transactions
- **Webstore**: Can login and purchase
- **Default**: New customers start as ACTIVE
- **Financial**: No restrictions

#### INACTIVE Status
- **Permissions**: Cannot place orders
- **Visibility**: Appears in customer searches
- **POS**: Can view history but cannot transact
- **Webstore**: Cannot login
- **Reason**: Temporary suspension, dormant account
- **Reactivation**: Can be set back to ACTIVE

#### BLOCKED Status
- **Permissions**: Completely blocked from orders
- **Visibility**: Appears in searches with warning
- **POS**: Warning displayed, manager approval needed
- **Webstore**: Login blocked with message
- **Reasons**:
  - Outstanding debt exceeding limit
  - Fraudulent activity detected
  - Multiple payment failures
  - Terms violation
- **Reactivation**: Requires manual review and approval

#### ARCHIVED Status
- **Permissions**: No access
- **Visibility**: Hidden from standard searches
- **POS**: Not selectable
- **Webstore**: Account closed
- **Reasons**:
  - Customer requested deletion
  - Long-term inactivity (GDPR compliance)
  - Duplicate record cleanup
  - Business closed
- **Characteristics**: Permanent state, data retained for history

### Status Transition Rules

| From Status | To Status | Allowed | Conditions |
|-------------|-----------|---------|------------|
| ACTIVE | INACTIVE | ✅ Yes | Anytime |
| ACTIVE | BLOCKED | ✅ Yes | Requires reason |
| ACTIVE | ARCHIVED | ✅ Yes | No outstanding balance |
| INACTIVE | ACTIVE | ✅ Yes | Anytime |
| INACTIVE | BLOCKED | ✅ Yes | Requires reason |
| INACTIVE | ARCHIVED | ✅ Yes | No outstanding balance |
| BLOCKED | ACTIVE | ✅ Yes | Issues resolved |
| BLOCKED | ARCHIVED | ✅ Yes | No outstanding balance |
| ARCHIVED | * | ❌ No | Permanent state |

### Status Change Triggers

| Trigger | Resulting Status | Reason |
|---------|-----------------|--------|
| New customer created | ACTIVE | Default |
| Manual deactivation | INACTIVE | Staff action |
| Outstanding debt > limit | BLOCKED | Automated |
| Fraud detection | BLOCKED | Automated/Manual |
| No activity > 2 years | INACTIVE | Automated |
| Customer deletion request | ARCHIVED | Manual |
| Duplicate merge | ARCHIVED | Automated |

### Sri Lanka Business Context

| Scenario | Status | Notes |
|----------|--------|-------|
| Regular customer | ACTIVE | Normal operations |
| Seasonal business | INACTIVE | Reactivate seasonally |
| Debt collection case | BLOCKED | Until payment received |
| Business closed | ARCHIVED | Historical records only |
| Fraudulent checks | BLOCKED | Police case filed |

### Expected Outcome
- Clear customer status management
- Controlled access based on status
- Status transition tracking
- Support for customer lifecycle management

### Verification Checklist
- [ ] CUSTOMER_STATUS_ACTIVE constant defined
- [ ] CUSTOMER_STATUS_INACTIVE constant defined
- [ ] CUSTOMER_STATUS_BLOCKED constant defined
- [ ] CUSTOMER_STATUS_ARCHIVED constant defined
- [ ] CUSTOMER_STATUS_CHOICES tuple created
- [ ] All constants follow naming convention
- [ ] Display names are user-friendly
- [ ] Status behaviors documented

---

## Task 05: Create Customer Model Core Fields

### Overview
Create the core Customer model with essential identification and naming fields. This model serves as the central customer profile, storing basic information applicable to all customer types.

### Dependencies
- Task 01: Create customers Django App
- Task 03: Define CustomerType Choices
- Task 04: Define CustomerStatus Choices
- Tenant model exists
- Base model mixins available (TenantAwareMixin, TimestampMixin)

### Instructions

1. **Create customer.py model file**
   - Create file at `apps/customers/models/customer.py`
   - Import necessary Django components

2. **Import required modules**
   - Import Django model fields
   - Import base model mixins (TenantAwareMixin, TimestampMixin)
   - Import customer constants
   - Import UUID for primary key

3. **Define Customer model class**
   - Inherit from TenantAwareMixin and TimestampMixin
   - Add model docstring explaining purpose

4. **Add id field**
   - UUIDField as primary key
   - Default to uuid.uuid4
   - Not editable

5. **Add customer_code field**
   - CharField, max_length=50
   - Unique per tenant
   - Format: CUST-{sequence}
   - Auto-generated (will add generator later)

6. **Add first_name field**
   - CharField, max_length=100
   - Required for INDIVIDUAL type
   - Optional for other types
   - Set blank=True, null=False, default=''

7. **Add last_name field**
   - CharField, max_length=100
   - Required for INDIVIDUAL type
   - Optional for other types
   - Set blank=True, null=False, default=''

8. **Add display_name field**
   - CharField, max_length=200
   - Auto-generated from first/last name or company name
   - Used for display purposes throughout system

9. **Add customer_type field**
   - CharField with CUSTOMER_TYPE_CHOICES
   - Default to CUSTOMER_TYPE_INDIVIDUAL
   - Required field

10. **Add status field**
    - CharField with CUSTOMER_STATUS_CHOICES
    - Default to CUSTOMER_STATUS_ACTIVE
    - Required field

11. **Add Meta class**
    - Set verbose_name and verbose_name_plural
    - Add ordering by display_name
    - Add unique_together constraint (tenant, customer_code)
    - Add indexes on customer_code and status

12. **Add __str__ method**
    - Return display_name
    - Include customer_code
    - Format: "{display_name} ({customer_code})"

13. **Update models/__init__.py**
    - Import Customer model
    - Add to __all__ list

### Customer Model Core Structure

```
┌─────────────────────────────────────────────────┐
│              Customer Model (Core)              │
├─────────────────────────────────────────────────┤
│ Identification Fields:                          │
│  • id (UUIDField, primary key)                  │
│  • customer_code (CharField, unique)            │
│                                                 │
│ Name Fields:                                    │
│  • first_name (CharField)                       │
│  • last_name (CharField)                        │
│  • display_name (CharField)                     │
│                                                 │
│ Type & Status:                                  │
│  • customer_type (Choice field)                 │
│  • status (Choice field)                        │
│                                                 │
│ Inherited from TenantAwareMixin:                │
│  • tenant (ForeignKey)                          │
│                                                 │
│ Inherited from TimestampMixin:                  │
│  • created_at (DateTimeField)                   │
│  • updated_at (DateTimeField)                   │
└─────────────────────────────────────────────────┘
```

### Field Details

| Field | Type | Required | Max Length | Purpose |
|-------|------|----------|------------|---------|
| id | UUIDField | Yes | - | Primary key |
| customer_code | CharField | Yes | 50 | Unique customer identifier |
| first_name | CharField | Conditional | 100 | Individual first name |
| last_name | CharField | Conditional | 100 | Individual last name |
| display_name | CharField | Yes | 200 | Display name (generated) |
| customer_type | CharField | Yes | 20 | Customer type choice |
| status | CharField | Yes | 20 | Customer status choice |

### Customer Code Format

```
Customer Code Generation
════════════════════════

Format: CUST-{sequence}

Examples:
  CUST-00001
  CUST-00002
  CUST-12345

Characteristics:
  • Prefix: CUST-
  • Sequence: 5-digit zero-padded
  • Unique per tenant
  • Auto-generated on creation
```

### Display Name Generation Logic

```
Display Name Rules
══════════════════

INDIVIDUAL:
  if first_name and last_name:
    display_name = f"{first_name} {last_name}"
  elif first_name:
    display_name = first_name
  else:
    display_name = customer_code

Examples:
  "Saman Perera"
  "Nimal"
  "CUST-00001"
```

### Model Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| idx_customer_code | (tenant, customer_code) | Fast lookup by code |
| idx_customer_status | (tenant, status) | Filter by status |
| idx_customer_name | (tenant, first_name, last_name) | Name search |
| idx_customer_display | (tenant, display_name) | Display name lookup |

### Expected Outcome
- Functional Customer model foundation
- Unique customer identification
- Flexible naming structure
- Type and status tracking
- Tenant isolation

### Verification Checklist
- [ ] customer.py file created
- [ ] Customer class defined
- [ ] id field added (UUIDField)
- [ ] customer_code field added
- [ ] first_name field added
- [ ] last_name field added
- [ ] display_name field added
- [ ] customer_type field with choices
- [ ] status field with choices
- [ ] Meta class configured
- [ ] __str__ method implemented
- [ ] Model imported in __init__.py

---

## Task 06: Add Customer Type Fields

### Overview
Add type-specific fields to the Customer model to support business, government, and nonprofit customer types. These fields store company information, registration details, and organizational identifiers.

### Dependencies
- Task 05: Create Customer Model Core Fields

### Instructions

1. **Open customer.py model file**
   - Navigate to `apps/customers/models/customer.py`
   - Locate Customer model class

2. **Add company_name field**
   - CharField, max_length=200
   - Required for BUSINESS, GOVERNMENT, NONPROFIT
   - Optional for INDIVIDUAL
   - Set blank=True, null=False, default=''

3. **Add company_registration field**
   - CharField, max_length=100
   - Business registration number
   - Required for BUSINESS
   - Optional for others
   - Set blank=True, null=False, default=''

4. **Add department_name field**
   - CharField, max_length=200
   - For GOVERNMENT type
   - Department or ministry name
   - Set blank=True, null=False, default=''

5. **Add department_code field**
   - CharField, max_length=50
   - Government department code
   - For GOVERNMENT type
   - Set blank=True, null=False, default=''

6. **Add organization_name field**
   - CharField, max_length=200
   - For NONPROFIT type
   - NGO or charity full name
   - Set blank=True, null=False, default=''

7. **Add registration_number field**
   - CharField, max_length=100
   - Nonprofit registration number
   - For NONPROFIT type
   - Set blank=True, null=False, default=''

8. **Add tax_exempt_status field**
   - BooleanField, default=False
   - Indicates tax-exempt status
   - Primarily for NONPROFIT type
   - Can apply to other types

9. **Update display_name generation logic**
   - Consider company_name for BUSINESS types
   - Consider organization_name for NONPROFIT types
   - Consider department_name for GOVERNMENT types

10. **Update model docstring**
    - Document type-specific fields
    - Explain field usage per customer type

### Type-Specific Fields Structure

```
┌─────────────────────────────────────────────────┐
│         Customer Type-Specific Fields           │
├─────────────────────────────────────────────────┤
│ Business Fields:                                │
│  • company_name (CharField, 200)                │
│  • company_registration (CharField, 100)        │
│                                                 │
│ Government Fields:                              │
│  • department_name (CharField, 200)             │
│  • department_code (CharField, 50)              │
│                                                 │
│ Nonprofit Fields:                               │
│  • organization_name (CharField, 200)           │
│  • registration_number (CharField, 100)         │
│  • tax_exempt_status (BooleanField)             │
└─────────────────────────────────────────────────┘
```

### Field Requirements by Type

| Field | Individual | Business | Government | Nonprofit |
|-------|-----------|----------|------------|-----------|
| company_name | - | ✅ Required | ✅ Required | - |
| company_registration | - | ✅ Required | Optional | - |
| department_name | - | - | ✅ Required | - |
| department_code | - | - | Optional | - |
| organization_name | - | - | - | ✅ Required |
| registration_number | - | - | - | ✅ Required |
| tax_exempt_status | - | - | - | ✅ Common |

### Sri Lanka Business Registration

#### Company Registration Format
```
Sri Lanka Company Registration Numbers
═══════════════════════════════════════

Private Limited Companies:
  • Format: PV {number}
  • Example: PV 12345

Partnerships:
  • Format: PT {number}
  • Example: PT 67890

Sole Proprietorship:
  • Format: BR {number}
  • Example: BR 11223
```

#### Government Department Codes
```
Sri Lanka Government Departments
═════════════════════════════════

Ministry Codes:
  • Format: MIN-{code}
  • Example: MIN-HEALTH

Department Codes:
  • Format: DEPT-{code}
  • Example: DEPT-CUSTOMS

Provincial Councils:
  • Format: PC-{province}-{dept}
  • Example: PC-WESTERN-HEALTH
```

#### Nonprofit Registration
```
NGO/Nonprofit Registration
═══════════════════════════

Voluntary Social Services Organizations:
  • Format: VSSO/{year}/{number}
  • Example: VSSO/2020/123

Companies Limited by Guarantee:
  • Format: GA {number}
  • Example: GA 456

Societies Registration:
  • Format: SOC/{year}/{number}
  • Example: SOC/2019/789
```

### Display Name Logic (Updated)

```
Enhanced Display Name Generation
═════════════════════════════════

INDIVIDUAL:
  display_name = f"{first_name} {last_name}"

BUSINESS:
  display_name = company_name
  Example: "ABC Trading (Pvt) Ltd"

GOVERNMENT:
  if department_name:
    display_name = department_name
  else:
    display_name = company_name
  Example: "Department of Customs"

NONPROFIT:
  if organization_name:
    display_name = organization_name
  else:
    display_name = company_name
  Example: "Red Cross Society of Sri Lanka"
```

### Field Usage Examples

#### Business Customer
```
customer_type: BUSINESS
company_name: "LankaMart Trading (Pvt) Ltd"
company_registration: "PV 12345"
display_name: "LankaMart Trading (Pvt) Ltd"
```

#### Government Customer
```
customer_type: GOVERNMENT
company_name: "Ministry of Health"
department_name: "National Hospital Colombo"
department_code: "MIN-HEALTH-NHC"
display_name: "National Hospital Colombo"
```

#### Nonprofit Customer
```
customer_type: NONPROFIT
organization_name: "Children's Education Foundation"
registration_number: "VSSO/2020/456"
tax_exempt_status: true
display_name: "Children's Education Foundation"
```

### Validation Rules

| Field | Validation |
|-------|-----------|
| company_name | Required if customer_type is BUSINESS or GOVERNMENT |
| company_registration | Required if customer_type is BUSINESS |
| department_name | Required if customer_type is GOVERNMENT |
| organization_name | Required if customer_type is NONPROFIT |
| registration_number | Required if customer_type is NONPROFIT |

### Expected Outcome
- Support for all customer types
- Type-specific field storage
- Proper field requirements per type
- Sri Lanka registration format support
- Enhanced display name generation

### Verification Checklist
- [ ] company_name field added
- [ ] company_registration field added
- [ ] department_name field added
- [ ] department_code field added
- [ ] organization_name field added
- [ ] registration_number field added
- [ ] tax_exempt_status field added
- [ ] All fields have appropriate defaults
- [ ] display_name logic updated
- [ ] Model docstring updated

---

## Summary

This document established the foundational Customer module infrastructure:

### Completed Infrastructure
- ✅ Customers Django app created
- ✅ App registered as tenant-aware
- ✅ Customer type choices defined (INDIVIDUAL, BUSINESS, GOVERNMENT, NONPROFIT)
- ✅ Customer status choices defined (ACTIVE, INACTIVE, BLOCKED, ARCHIVED)
- ✅ Customer model core fields implemented
- ✅ Type-specific fields added

### Key Achievements
1. **Organized Structure** - Clean Django app with proper organization
2. **Multi-tenancy** - Registered as tenant-aware application
3. **Type Flexibility** - Support for various customer entity types
4. **Status Management** - Lifecycle state tracking
5. **Core Identity** - Unique customer identification and naming
6. **Type Support** - Fields for business, government, and nonprofit details

### Next Steps
Proceed to [02_Tasks-07-12_Contact-Tax-Dates-Financial-Marketing.md](02_Tasks-07-12_Contact-Tax-Dates-Financial-Marketing.md) to add contact fields, tax information, date tracking, financial summaries, marketing preferences, and notes.

---

**Document Status:** ✅ Complete  
**Total Tasks:** 6  
**Total Lines:** ~1100
