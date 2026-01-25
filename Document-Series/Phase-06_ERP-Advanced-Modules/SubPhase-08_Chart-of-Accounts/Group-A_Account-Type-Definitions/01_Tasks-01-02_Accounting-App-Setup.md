# Tasks 01-02: Accounting App Setup

> **Phase:** 06 - ERP Advanced Modules  
> **SubPhase:** 08 - Chart of Accounts  
> **Group:** A - Account Type Definitions  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-03-06_Account-Enums.md](02_Tasks-03-06_Account-Enums.md)

---

## Document Overview

This document covers the initialization of the accounting Django application, which will house the Chart of Accounts system including account types, account hierarchies, and financial reporting structures. The accounting app is a critical component of the ERP system, managing the foundation of double-entry bookkeeping and financial transactions.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create accounting App | Low | 15 min |
| 02 | Register accounting App | Low | 10 min |

---

## Task 01: Create Accounting App

### Overview
Create the Django accounting application that will contain all Chart of Accounts functionality, including account types, account hierarchies, journal entries, ledgers, and financial reporting models. This app is fundamental to the financial management capabilities of the LankaCommerce Cloud ERP system.

### Dependencies
- Django project structure established
- Core backend infrastructure in place
- Multi-tenancy system configured

### Instructions

1. **Navigate to apps directory**
   - Go to the project's `apps/` directory
   - This is where all Django applications are organized
   - Ensures consistent application structure

2. **Create accounting app using Django management command**
   - Use `python manage.py startapp accounting` in the apps directory
   - Alternative: manually create directory structure
   - Generates standard Django app boilerplate

3. **Create directory structure for accounting app**
   - Main app directory: `apps/accounting/`
   - Models subdirectory: `apps/accounting/models/`
   - Admin subdirectory: `apps/accounting/admin/` (optional)
   - Tests subdirectory: `apps/accounting/tests/`
   - Management commands: `apps/accounting/management/commands/`
   - Fixtures directory: `apps/accounting/fixtures/`

4. **Create models package structure**
   - Convert `models.py` to `models/` directory
   - Create `models/__init__.py` for imports
   - Prepare for multiple model files (enums, account_type, account, journal)

5. **Create admin package structure**
   - Convert `admin.py` to `admin/` directory (optional but recommended)
   - Create `admin/__init__.py`
   - Allows separation of admin configurations

6. **Create fixtures directory**
   - Create `fixtures/` directory for JSON fixtures
   - Will store default account types
   - Enables data seeding for new tenants

7. **Create management commands directory**
   - Create `management/` directory
   - Create `management/__init__.py`
   - Create `management/commands/` subdirectory
   - Create `management/commands/__init__.py`
   - Enables custom Django management commands

8. **Create tests directory structure**
   - Create `tests/` directory
   - Create `tests/__init__.py`
   - Prepare for comprehensive test coverage

### Directory Structure
```
apps/accounting/
├── __init__.py                      # App package initialization
├── apps.py                          # App configuration
├── models/
│   ├── __init__.py                 # Model imports
│   └── (model files to be created)
├── admin/
│   ├── __init__.py                 # Admin imports
│   └── (admin files to be created)
├── fixtures/
│   └── (fixture files to be created)
├── management/
│   ├── __init__.py
│   └── commands/
│       ├── __init__.py
│       └── (command files to be created)
├── tests/
│   ├── __init__.py
│   └── (test files to be created)
├── migrations/
│   └── __init__.py                 # Django migrations
└── views.py                        # API views (if needed)
```

### App Purpose

The accounting app serves as the foundation for:
- Chart of Accounts management
- Account type definitions (Asset, Liability, Equity, Revenue, Expense)
- Account hierarchies (parent-child relationships)
- Account groupings and categories
- Default account templates for Sri Lankan businesses
- Account lifecycle management (active, inactive, archived)
- Financial reporting structures

### Expected Outcome
- Clean accounting app structure
- Organized directory layout for scalability
- Foundation for double-entry bookkeeping system
- Proper package initialization for imports

### Verification Checklist
- [ ] `apps/accounting/` directory exists
- [ ] `apps/accounting/__init__.py` file created
- [ ] `apps/accounting/apps.py` file created
- [ ] `apps/accounting/models/` directory exists
- [ ] `apps/accounting/models/__init__.py` file created
- [ ] `apps/accounting/fixtures/` directory exists
- [ ] `apps/accounting/management/commands/` directory exists
- [ ] `apps/accounting/tests/` directory exists
- [ ] `apps/accounting/migrations/` directory exists

---

## Task 02: Register Accounting App

### Overview
Register the accounting application in Django settings so it becomes part of the project. The accounting app must be registered as a tenant-specific app (TENANT_APPS) since each tenant will have their own Chart of Accounts and financial data.

### Dependencies
- Task 01: Create accounting App

### Instructions

1. **Open Django settings file**
   - Navigate to project settings (e.g., `config/settings/base.py`)
   - Locate the TENANT_APPS configuration
   - This is specific to django-tenants setup

2. **Identify TENANT_APPS section**
   - Find where tenant-specific apps are registered
   - These apps have data isolated per tenant
   - Distinct from SHARED_APPS (public schema)

3. **Add accounting app to TENANT_APPS**
   - Add `'apps.accounting'` to TENANT_APPS list
   - Place after core apps (e.g., after auth, contenttypes)
   - Ensures accounting data is tenant-specific

4. **Verify app name format**
   - Use full dotted path: `'apps.accounting'`
   - Must match the apps.py configuration
   - Ensures Django can find and load the app

5. **Configure AppConfig in apps.py**
   - Open `apps/accounting/apps.py`
   - Set `name = 'apps.accounting'`
   - Set `verbose_name = 'Accounting'`
   - Set `default_auto_field = 'django.db.models.BigAutoField'`

6. **Add app label if needed**
   - Optionally set `label = 'accounting'` for shorter references
   - Useful for migrations and admin panel
   - Keeps references clean

7. **Document app purpose in AppConfig**
   - Add docstring to AccountingConfig class
   - Explain app's role in ERP system
   - Note multi-tenancy considerations

### Multi-Tenancy Considerations

#### TENANT_APPS vs SHARED_APPS

**TENANT_APPS (accounting belongs here):**
- Data isolated per tenant
- Each tenant has own Chart of Accounts
- Account codes can be customized per tenant
- Account structures differ by business type
- Financial data is fully segregated

**SHARED_APPS (if needed for reference data):**
- Shared across all tenants
- Could include standard account templates
- Industry-specific account structures
- Not used for actual financial data

### App Registration Impact

| Aspect | Impact |
|--------|--------|
| **Migrations** | Tenant schema migrations auto-generated |
| **Database Tables** | Created in each tenant's schema |
| **Admin Panel** | Accounting models appear in admin |
| **API Endpoints** | Can create API views for accounts |
| **Permissions** | Tenant-specific permissions apply |

### Settings Configuration Format

The TENANT_APPS should include:
```
TENANT_APPS = [
    'django.contrib.contenttypes',
    'django.contrib.auth',
    
    # Core ERP apps
    'apps.core',
    'apps.inventory',
    'apps.sales',
    'apps.pos',
    
    # Financial apps
    'apps.accounting',  # ← New addition
    
    # Other tenant apps...
]
```

### AppConfig Structure

The `apps/accounting/apps.py` should define:
- Application name (full dotted path)
- Verbose name for admin panel
- Default auto field type
- App label for shorter references
- Optional: ready() method for startup logic

### Expected Outcome
- Accounting app registered in Django settings
- App appears in Django admin (after models created)
- App can be imported throughout project
- Migrations will be generated for this app
- Tenant-specific data isolation enabled

### Verification Checklist
- [ ] `apps.accounting` added to TENANT_APPS in settings
- [ ] AccountingConfig class properly configured in apps.py
- [ ] `name = 'apps.accounting'` set in AppConfig
- [ ] `verbose_name = 'Accounting'` set in AppConfig
- [ ] No import errors when running Django
- [ ] App appears in `python manage.py showmigrations`
- [ ] App isolation verified in multi-tenant setup

### Validation Commands

Run these commands to verify registration:

1. **Check installed apps**
   - Run `python manage.py showmigrations`
   - Accounting should appear in the list
   - Confirms app is recognized

2. **Verify import**
   - Run `python manage.py shell`
   - Import: `from apps.accounting.apps import AccountingConfig`
   - Should not raise ImportError

3. **Check tenant configuration**
   - Verify accounting in TENANT_APPS, not SHARED_APPS
   - Ensures proper data isolation
   - Critical for multi-tenancy

---

## Group A Progress

After completing these tasks, you will have:
- ✅ Accounting Django app created and structured
- ✅ App registered in tenant configuration
- ⬜ Account type enums (next document)
- ⬜ AccountTypeConfig model (subsequent document)
- ⬜ Fixtures and testing (final document)

### Next Steps
Proceed to [02_Tasks-03-06_Account-Enums.md](02_Tasks-03-06_Account-Enums.md) to define the enumeration types for account types, categories, statuses, and normal balances.

---

## Notes for AI Agents

### Critical Considerations
1. **Multi-tenancy**: Accounting must be in TENANT_APPS, not SHARED_APPS
2. **Package Structure**: Use models/ and admin/ directories, not single files
3. **Naming Convention**: Full path `apps.accounting` in settings
4. **Fixtures Location**: Create fixtures/ directory for account type data
5. **Management Commands**: Prepare structure for data loading commands

### Sri Lankan Context
- Chart of Accounts will follow Sri Lankan accounting standards
- Default account structures for Sri Lankan SMEs
- Support for LKR (₨) currency in financial reports
- Compliance with local tax regulations (VAT, NBT, etc.)
- Multi-language support (English, Sinhala, Sinhaglish)

### Security & Permissions
- Tenant data isolation is critical
- Financial data requires strict access controls
- Audit trails for all account modifications
- Role-based permissions for account management
- Sensitive financial data encryption

### Testing Strategy
- Unit tests for app initialization
- Integration tests for multi-tenancy
- Fixture loading tests
- Import and configuration tests
- Permission isolation tests
