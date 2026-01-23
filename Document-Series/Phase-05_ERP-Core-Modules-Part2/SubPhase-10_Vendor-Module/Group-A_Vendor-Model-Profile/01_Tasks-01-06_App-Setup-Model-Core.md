# Tasks 01-06: App Setup, Status/Type, Model Core

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 10 - Vendor Module  
> **Group:** A - Vendor Model & Profile  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-12_Address-Contact-Terms-Rating.md](02_Tasks-07-12_Address-Contact-Terms-Rating.md)

---

## Document Overview

This document establishes the foundation of the vendor management system, including Django app creation, app registration, vendor status and type choices, and the core Vendor model with essential identification and business fields.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create vendors Django App | Low | 15 min |
| 02 | Register vendors App | Low | 10 min |
| 03 | Define VendorStatus Choices | Low | 15 min |
| 04 | Define VendorType Choices | Low | 15 min |
| 05 | Create Vendor Model Core Fields | Medium | 25 min |
| 06 | Add Vendor Type Fields | Medium | 20 min |

---

## Task 01: Create Vendors Django App

### Overview
Create a new Django app named `vendors` within the `apps` directory to manage all vendor-related functionality including supplier management, vendor catalogs, performance tracking, and vendor communications.

### Dependencies
- Django project structure established
- `apps/` directory exists

### Instructions

1. **Navigate to apps directory**
   - Open terminal in project root
   - Change to `apps/` directory

2. **Create vendors app**
   - Use Django's startapp command
   - Name the app `vendors`

3. **Create app subdirectory structure**
   - Create `models/` directory inside `vendors/`
   - Create `services/` directory inside `vendors/`
   - Create `serializers/` directory inside `vendors/`
   - Create `views/` directory inside `vendors/`
   - Create `tests/` directory inside `vendors/`

4. **Create package initialization files**
   - Create `__init__.py` in `models/` directory
   - Create `__init__.py` in `services/` directory
   - Create `__init__.py` in `serializers/` directory
   - Create `__init__.py` in `views/` directory
   - Create `__init__.py` in `tests/` directory

5. **Update apps.py configuration**
   - Open `apps/vendors/apps.py`
   - Set app name to `apps.vendors`
   - Add verbose_name as "Vendors"

### Directory Structure
```
apps/vendors/
├── __init__.py
├── apps.py                       # App configuration
├── models/
│   └── __init__.py              # Models package
├── services/
│   └── __init__.py              # Services package
├── serializers/
│   └── __init__.py              # Serializers package
├── views/
│   └── __init__.py              # Views package
├── tests/
│   └── __init__.py              # Tests package
├── constants.py                  # To be created in Task 03-04
├── admin.py                      # Django admin
└── urls.py                       # URL routing
```

### Expected Outcome
- Clean Django app structure for vendor management
- Organized subdirectories for models, services, views
- Foundation for vendor module development

### Verification Checklist
- [ ] `apps/vendors/` directory exists
- [ ] `vendors/apps.py` configured with correct name
- [ ] All subdirectories created (models, services, etc.)
- [ ] All `__init__.py` files in place

---

## Task 02: Register Vendors App

### Overview
Register the vendors app in Django settings to make it available within the multi-tenant architecture. The app must be added to TENANT_APPS since vendors are tenant-specific data.

### Dependencies
- Task 01: Create vendors Django App

### Instructions

1. **Open Django settings file**
   - Navigate to `config/settings/base.py` or equivalent
   - Locate TENANT_APPS configuration

2. **Add vendors to TENANT_APPS**
   - Add `'apps.vendors'` to TENANT_APPS list
   - Place after other ERP modules (inventory, pos, etc.)
   - Maintain alphabetical or logical ordering

3. **Verify app is tenant-scoped**
   - Confirm vendors is in TENANT_APPS, not SHARED_APPS
   - Vendors data is tenant-specific, not shared
   - Each tenant has separate vendor database tables

4. **Check app imports**
   - Ensure no import errors occur
   - Verify app can be discovered by Django

### Expected TENANT_APPS Structure
```python
TENANT_APPS = [
    # Other tenant apps
    'apps.inventory',
    'apps.pos',
    'apps.purchases',
    'apps.vendors',  # Add here
    # ...
]
```

### Expected Outcome
- Vendors app registered in Django settings
- App available for tenant database operations
- Migrations will create tables in tenant schemas

### Verification Checklist
- [ ] `apps.vendors` added to TENANT_APPS
- [ ] No import errors on settings load
- [ ] Django can discover the app
- [ ] App appears in `python manage.py showmigrations`

---

## Task 03: Define VendorStatus Choices

### Overview
Define standard vendor status choices to track vendor lifecycle states from pending approval through active operation to inactive or blocked status. These choices ensure consistent vendor state management across the system.

### Dependencies
- Task 01: Create vendors Django App

### Instructions

1. **Create constants.py file**
   - Create file at `apps/vendors/constants.py`
   - Add module docstring explaining purpose

2. **Add module docstring**
   - Document purpose of constants module
   - Explain vendor status and type definitions
   - Note usage in Vendor model

3. **Define VENDOR_STATUS_ACTIVE constant**
   - Value: 'ACTIVE'
   - Purpose: Vendor is active and can receive orders
   - Default status for approved vendors

4. **Define VENDOR_STATUS_INACTIVE constant**
   - Value: 'INACTIVE'
   - Purpose: Vendor is inactive, no new orders allowed
   - Used for temporarily suspended vendors

5. **Define VENDOR_STATUS_BLOCKED constant**
   - Value: 'BLOCKED'
   - Purpose: Vendor blocked due to quality/payment issues
   - Prevents any transactions

6. **Define VENDOR_STATUS_PENDING_APPROVAL constant**
   - Value: 'PENDING_APPROVAL'
   - Purpose: New vendor awaiting approval
   - Initial status for new vendors

7. **Create VENDOR_STATUS_CHOICES tuple**
   - Format as Django choices: (value, display_name)
   - Include all status constants
   - Order logically by workflow

### Vendor Status Details

| Constant | Value | Display Name | Purpose |
|----------|-------|--------------|---------|
| VENDOR_STATUS_ACTIVE | 'ACTIVE' | Active | Vendor operational |
| VENDOR_STATUS_INACTIVE | 'INACTIVE' | Inactive | Temporarily suspended |
| VENDOR_STATUS_BLOCKED | 'BLOCKED' | Blocked | Blocked due to issues |
| VENDOR_STATUS_PENDING_APPROVAL | 'PENDING_APPROVAL' | Pending Approval | Awaiting approval |

### Status Workflow
```
PENDING_APPROVAL
        │
        ▼
     ACTIVE ←──────┐
        │          │
        ├──→ INACTIVE
        │          │
        └──→ BLOCKED
```

### Expected Outcome
- Clear vendor status definitions
- Django-compatible choices tuple
- Foundation for status-based workflows

### Verification Checklist
- [ ] `constants.py` file created
- [ ] All status constants defined
- [ ] VENDOR_STATUS_CHOICES tuple created
- [ ] Status values follow naming convention

---

## Task 04: Define VendorType Choices

### Overview
Define standard vendor type choices to categorize vendors based on their business model and supply chain role. This classification helps in vendor management, reporting, and procurement decisions.

### Dependencies
- Task 03: Define VendorStatus Choices

### Instructions

1. **Open constants.py file**
   - Navigate to `apps/vendors/constants.py`
   - Continue after status choices

2. **Define VENDOR_TYPE_MANUFACTURER constant**
   - Value: 'MANUFACTURER'
   - Purpose: Vendor produces goods directly
   - Direct source for products

3. **Define VENDOR_TYPE_DISTRIBUTOR constant**
   - Value: 'DISTRIBUTOR'
   - Purpose: Authorized distributor of branded products
   - Handles multiple brands

4. **Define VENDOR_TYPE_WHOLESALER constant**
   - Value: 'WHOLESALER'
   - Purpose: Bulk supplier with competitive pricing
   - Volume-focused business

5. **Define VENDOR_TYPE_IMPORTER constant**
   - Value: 'IMPORTER'
   - Purpose: Imports goods from overseas
   - International supply chain

6. **Define VENDOR_TYPE_SERVICE constant**
   - Value: 'SERVICE'
   - Purpose: Service provider (not goods)
   - Used for maintenance, consulting, etc.

7. **Create VENDOR_TYPE_CHOICES tuple**
   - Format as Django choices
   - Include all type constants
   - Order by common usage

### Vendor Type Details

| Constant | Value | Display Name | Use Case |
|----------|-------|--------------|----------|
| VENDOR_TYPE_MANUFACTURER | 'MANUFACTURER' | Manufacturer | Direct producer |
| VENDOR_TYPE_DISTRIBUTOR | 'DISTRIBUTOR' | Distributor | Brand distributor |
| VENDOR_TYPE_WHOLESALER | 'WHOLESALER' | Wholesaler | Bulk supplier |
| VENDOR_TYPE_IMPORTER | 'IMPORTER' | Importer | Import specialist |
| VENDOR_TYPE_SERVICE | 'SERVICE' | Service Provider | Services only |

### Type Characteristics

#### Manufacturer
- Produces goods directly
- Factory or production facility
- Custom manufacturing possible
- Usually best pricing

#### Distributor
- Authorized by brands
- Warranty support
- Brand compliance
- Marketing support

#### Wholesaler
- High volume focus
- Competitive bulk pricing
- Fast delivery
- Multiple product lines

#### Importer
- International sourcing
- Customs handling
- Currency management
- Lead time considerations

#### Service Provider
- Maintenance services
- Installation services
- Consulting
- Support contracts

### Expected Outcome
- Clear vendor type categorization
- Django-compatible choices tuple
- Foundation for type-specific logic

### Verification Checklist
- [ ] All type constants defined
- [ ] VENDOR_TYPE_CHOICES tuple created
- [ ] Type values follow naming convention
- [ ] Types cover all vendor categories

---

## Task 05: Create Vendor Model Core Fields

### Overview
Create the main Vendor model with core identification fields including vendor code, company name, and display name. This establishes the base structure for all vendor data.

### Dependencies
- Task 01: Create vendors Django App
- Task 03: Define VendorStatus Choices
- Task 04: Define VendorType Choices

### Instructions

1. **Create vendor.py model file**
   - Create file at `apps/vendors/models/vendor.py`
   - Add module docstring

2. **Import required modules**
   - Import Django model fields
   - Import TenantAwareModel or BaseModel
   - Import UUID for primary key
   - Import constants from constants.py

3. **Define Vendor model class**
   - Inherit from TenantAwareModel or appropriate base
   - Add class docstring explaining purpose
   - Add Meta class with table name and ordering

4. **Add id field**
   - Type: UUIDField
   - Primary key: True
   - Default: uuid.uuid4
   - Editable: False

5. **Add vendor_code field**
   - Type: CharField
   - Max length: 20
   - Unique: True
   - Indexed: True
   - Blank: True (auto-generated)

6. **Add company_name field**
   - Type: CharField
   - Max length: 200
   - Required: Cannot be blank or null
   - Indexed: True for search

7. **Add display_name field**
   - Type: CharField
   - Max length: 200
   - Optional: Can be blank
   - Purpose: Short/friendly name for UI

8. **Add status field**
   - Type: CharField
   - Max length: 30
   - Choices: VENDOR_STATUS_CHOICES
   - Default: VENDOR_STATUS_PENDING_APPROVAL
   - Indexed: True

9. **Add __str__ method**
   - Return format: "{vendor_code} - {company_name}"
   - Handle cases where code not yet generated

10. **Update models __init__.py**
    - Import Vendor model
    - Add to __all__ list

### Core Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| id | UUIDField | Yes | Primary key |
| vendor_code | CharField(20) | Auto | Unique identifier |
| company_name | CharField(200) | Yes | Legal business name |
| display_name | CharField(200) | No | Display/short name |
| status | CharField(30) | Yes | Vendor status |

### Vendor Code Format
```
VND-{SEQUENCE}

Examples:
VND-00001
VND-00002
VND-00150
```

### Expected Outcome
- Vendor model with core identification fields
- Proper indexing for performance
- Status tracking capability

### Verification Checklist
- [ ] `vendor.py` model file created
- [ ] All core fields defined
- [ ] Proper field types and constraints
- [ ] `__str__` method implemented
- [ ] Model imported in `__init__.py`

---

## Task 06: Add Vendor Type Fields

### Overview
Add vendor type classification and business registration fields to the Vendor model. These fields categorize vendors by business model and store legal registration information.

### Dependencies
- Task 05: Create Vendor Model Core Fields

### Instructions

1. **Open vendor.py model file**
   - Navigate to `apps/vendors/models/vendor.py`
   - Locate Vendor model class

2. **Add vendor_type field**
   - Type: CharField
   - Max length: 30
   - Choices: VENDOR_TYPE_CHOICES
   - Required: Cannot be blank or null
   - Indexed: True

3. **Add business_registration field**
   - Type: CharField
   - Max length: 50
   - Optional: Can be blank and null
   - Purpose: Business registration number
   - Help text: Business registration or company registration number

4. **Add tax_id field**
   - Type: CharField
   - Max length: 50
   - Optional: Can be blank and null
   - Purpose: Tax identification number
   - Help text: VAT number, TIN, or other tax ID

5. **Add is_local_vendor field**
   - Type: BooleanField
   - Default: True
   - Purpose: Distinguish local vs international vendors
   - Affects payment, currency, customs

6. **Add country field**
   - Type: CharField
   - Max length: 100
   - Default: "Sri Lanka"
   - Purpose: Vendor's country of operation

7. **Update Meta class**
   - Add composite index on (status, vendor_type)
   - This improves filtered queries performance

### Type Fields Summary

| Field | Type | Required | Purpose |
|-------|------|----------|---------|
| vendor_type | CharField(30) | Yes | Business model type |
| business_registration | CharField(50) | No | Registration number |
| tax_id | CharField(50) | No | Tax ID/VAT number |
| is_local_vendor | BooleanField | Yes | Local vs international |
| country | CharField(100) | Yes | Country of operation |

### Business Registration Examples

#### Sri Lanka
```
Registration: PV 12345
Tax ID: 123456789V (TIN)
```

#### International
```
Registration: Company registration from home country
Tax ID: VAT number or equivalent
```

### Expected Outcome
- Complete vendor type classification
- Legal registration tracking
- Local vs international vendor distinction

### Verification Checklist
- [ ] vendor_type field added with choices
- [ ] business_registration field added
- [ ] tax_id field added
- [ ] is_local_vendor field added
- [ ] country field added with default
- [ ] Composite index added to Meta

---

## Notes for AI Agents

### Vendor Status Workflow
- New vendors start as PENDING_APPROVAL
- After verification, set to ACTIVE
- Can be INACTIVE temporarily (vacation, restructuring)
- BLOCKED for serious issues (quality, payment)

### Vendor Type Selection
- Choose based on primary business model
- A vendor can be both manufacturer and distributor
- Use tags field (later) for additional classifications
- Type affects default payment terms and lead times

### Required vs Optional Fields
**Required:**
- company_name
- vendor_type
- status (has default)

**Recommended:**
- vendor_code (auto-generated)
- business_registration
- tax_id
- At least one contact (added in Group B)

### Indexing Strategy
Single indexes:
- vendor_code (unique)
- company_name
- status
- vendor_type

Composite indexes:
- (status, vendor_type) - for filtered lists

### Naming Conventions
- Field names: snake_case
- Choice constants: UPPER_SNAKE_CASE with prefix
- Model name: PascalCase
- Method names: snake_case

### Multi-tenancy Considerations
- Vendors are tenant-specific
- Each tenant has separate vendor database
- Vendor codes unique within tenant
- No cross-tenant vendor sharing
