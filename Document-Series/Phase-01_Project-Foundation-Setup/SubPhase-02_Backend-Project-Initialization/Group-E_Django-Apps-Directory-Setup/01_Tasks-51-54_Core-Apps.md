# Tasks 51-54: Core Apps Creation

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 02 - Backend Project Initialization  
> **Group:** E - Django Apps Directory Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 51, 52, 53, 54

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-D_Core-Dependencies-Installation/03_Tasks-47-50_Support-Compile.md](../Group-D_Core-Dependencies-Installation/03_Tasks-47-50_Support-Compile.md)
- **→ Next Document:** [02_Tasks-55-60_Business-Placeholders-1.md](02_Tasks-55-60_Business-Placeholders-1.md)

---

## Document Overview

This document covers creating the apps package and three core Django applications: core, tenants, and users.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 51 | Create apps/ Package | Simple |
| 52 | Create apps/core/ App | Medium |
| 53 | Create apps/tenants/ App | Medium |
| 54 | Create apps/users/ App | Medium |

---

## Task 51: Create apps/ Package

### Overview
Create the apps directory as a Python package to contain all Django applications.

### Dependencies
- Task 10: Create Django project (Group B)

### Instructions

1. **Create apps directory**
   - Create backend/apps/ directory

2. **Create __init__.py**
   - Create apps/__init__.py
   - File can be empty

3. **Document purpose**
   - Add docstring explaining package purpose

### Directory Structure

```
backend/
├── apps/
│   └── __init__.py
├── config/
└── manage.py
```

### Package __init__.py Content

Add docstring:

```python
"""
LankaCommerce Cloud Django Applications Package.

All Django apps are organized under this package.
Import pattern: from apps.core.models import BaseModel
"""
```

### Import Benefits

| Pattern | Example |
|---------|---------|
| Absolute | `from apps.core.models import BaseModel` |
| Consistent | All apps under `apps.` namespace |
| Clear | Distinguishes from third-party packages |

### Expected Outcome
- apps/ directory created
- Package ready for app creation

### Verification Checklist
- [ ] apps/ directory exists
- [ ] apps/__init__.py exists
- [ ] Docstring added

---

## Task 52: Create apps/core/ App

### Overview
Create the core app containing base models, mixins, utilities, and shared functionality.

### Dependencies
- Task 51: Create apps/ Package

### Instructions

1. **Create core directory**
   - Create apps/core/ directory

2. **Create standard Django files**
   - __init__.py
   - apps.py
   - models.py
   - admin.py
   - views.py
   - tests.py

3. **Configure apps.py**
   - Set proper name and label
   - Add verbose_name

4. **Set up models.py structure**
   - Add base model imports placeholder
   - Prepare for BaseModel, TimeStampedMixin

5. **Create additional directories**
   - management/commands/
   - templatetags/
   - utils/

### Directory Structure

```
apps/core/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
├── views.py
├── management/
│   ├── __init__.py
│   └── commands/
│       └── __init__.py
├── templatetags/
│   └── __init__.py
└── utils/
    └── __init__.py
```

### apps.py Configuration

| Setting | Value |
|---------|-------|
| `name` | 'apps.core' |
| `label` | 'core' |
| `verbose_name` | 'Core Framework' |

### Core App Contents (Planned)

| Module | Purpose |
|--------|---------|
| `models.py` | BaseModel, TimeStampedMixin |
| `utils/` | Helper functions |
| `management/commands/` | Custom commands |
| `templatetags/` | Template tags |

### Base Models Preview

Will contain:
- `BaseModel` - UUID primary key, timestamps
- `TimeStampedMixin` - created_at, updated_at
- `SoftDeleteMixin` - is_deleted, deleted_at
- `TenantAwareMixin` - Tenant scoping

### Expected Outcome
- Core app fully structured
- Ready for base model development

### Verification Checklist
- [ ] apps/core/ directory created
- [ ] All standard files present
- [ ] apps.py configured correctly
- [ ] management/commands/ created
- [ ] utils/ package created

---

## Task 53: Create apps/tenants/ App

### Overview
Create the tenants app for multi-tenancy models and domain management.

### Dependencies
- Task 51: Create apps/ Package

### Instructions

1. **Create tenants directory**
   - Create apps/tenants/ directory

2. **Create standard Django files**
   - __init__.py
   - apps.py
   - models.py
   - admin.py
   - views.py
   - tests.py

3. **Configure apps.py**
   - Set proper name and label
   - Add verbose_name

4. **Prepare models.py**
   - Add imports placeholder for TenantMixin
   - Prepare for Tenant and Domain models

5. **Create additional directories**
   - management/commands/
   - middleware/
   - utils/

### Directory Structure

```
apps/tenants/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
├── views.py
├── management/
│   ├── __init__.py
│   └── commands/
│       └── __init__.py
├── middleware/
│   └── __init__.py
└── utils/
    └── __init__.py
```

### apps.py Configuration

| Setting | Value |
|---------|-------|
| `name` | 'apps.tenants' |
| `label` | 'tenants' |
| `verbose_name` | 'Multi-Tenancy' |

### Tenant Models Preview

Will contain:
- `Tenant` - Extends TenantMixin from django-tenants
- `Domain` - Extends DomainMixin from django-tenants
- `TenantSettings` - Per-tenant configuration
- `TenantBilling` - Subscription and billing info

### Middleware Preview

Will contain:
- `TenantMiddleware` - Tenant resolution from domain
- Custom tenant context handling

### Management Commands Preview

Will contain:
- `create_tenant` - Create new tenant
- `delete_tenant` - Remove tenant
- `list_tenants` - List all tenants

### Expected Outcome
- Tenants app fully structured
- Ready for multi-tenancy implementation

### Verification Checklist
- [ ] apps/tenants/ directory created
- [ ] All standard files present
- [ ] apps.py configured correctly
- [ ] middleware/ package created
- [ ] management/commands/ created

---

## Task 54: Create apps/users/ App

### Overview
Create the users app for custom user model, authentication, and user profiles.

### Dependencies
- Task 51: Create apps/ Package

### Instructions

1. **Create users directory**
   - Create apps/users/ directory

2. **Create standard Django files**
   - __init__.py
   - apps.py
   - models.py
   - admin.py
   - views.py
   - tests.py

3. **Configure apps.py**
   - Set proper name and label
   - Add verbose_name

4. **Prepare models.py**
   - Add imports placeholder
   - Prepare for custom User model

5. **Create additional directories**
   - api/ (for serializers, viewsets)
   - managers/
   - signals/

6. **Note AUTH_USER_MODEL**
   - Will set AUTH_USER_MODEL = 'users.User' in settings

### Directory Structure

```
apps/users/
├── __init__.py
├── admin.py
├── apps.py
├── models.py
├── tests.py
├── views.py
├── api/
│   ├── __init__.py
│   ├── serializers.py
│   ├── views.py
│   └── urls.py
├── managers/
│   └── __init__.py
└── signals/
    └── __init__.py
```

### apps.py Configuration

| Setting | Value |
|---------|-------|
| `name` | 'apps.users' |
| `label` | 'users' |
| `verbose_name` | 'User Management' |

### User Models Preview

Will contain:
- `User` - Custom user model (AbstractBaseUser)
- `UserProfile` - Extended user information
- `UserPreferences` - User settings
- `LoginHistory` - Authentication audit

### Custom User Features

| Feature | Implementation |
|---------|----------------|
| Email as username | USERNAME_FIELD = 'email' |
| Phone support | Validated +94 format |
| Tenant awareness | ForeignKey to Tenant |
| Role assignment | ManyToMany to Role |

### API Structure Preview

| Module | Contents |
|--------|----------|
| `serializers.py` | UserSerializer, LoginSerializer |
| `views.py` | UserViewSet, AuthViews |
| `urls.py` | API endpoints |

### Settings Update Required

After users app is created:
- Set `AUTH_USER_MODEL = 'users.User'`
- Must be done before first migration

### Expected Outcome
- Users app fully structured
- Ready for custom user model

### Verification Checklist
- [ ] apps/users/ directory created
- [ ] All standard files present
- [ ] apps.py configured correctly
- [ ] api/ package created
- [ ] managers/ package created
- [ ] signals/ package created

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 51 | Create apps/ Package | apps/__init__.py |
| 52 | Create apps/core/ App | Core framework app |
| 53 | Create apps/tenants/ App | Multi-tenancy app |
| 54 | Create apps/users/ App | User management app |

### Core Apps Structure

```
backend/apps/
├── __init__.py
├── core/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   ├── management/commands/
│   ├── templatetags/
│   └── utils/
├── tenants/
│   ├── __init__.py
│   ├── admin.py
│   ├── apps.py
│   ├── models.py
│   ├── tests.py
│   ├── views.py
│   ├── management/commands/
│   ├── middleware/
│   └── utils/
└── users/
    ├── __init__.py
    ├── admin.py
    ├── apps.py
    ├── models.py
    ├── tests.py
    ├── views.py
    ├── api/
    ├── managers/
    └── signals/
```

### Next Steps
Proceed to [02_Tasks-55-60_Business-Placeholders-1.md](02_Tasks-55-60_Business-Placeholders-1.md) for business module placeholders.

---

## Notes for AI Agents

1. **Package Name:** Use 'apps.X' in apps.py name field
2. **Label:** Use simple 'X' for label field
3. **AUTH_USER_MODEL:** Add to settings before migrations
4. **No Migrations Yet:** Just create structure
5. **Git:** Do NOT commit yet - complete all Group E tasks first
