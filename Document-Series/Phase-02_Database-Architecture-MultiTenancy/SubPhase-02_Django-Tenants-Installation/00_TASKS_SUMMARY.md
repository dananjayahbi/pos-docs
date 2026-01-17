# SubPhase 02: Django-Tenants Installation - Tasks Summary

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase Index:** 02 of 10  
> **SubPhase Goal:** Install and configure django-tenants as the multi-tenancy solution  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 5-6 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_PostgreSQL-Configuration](../SubPhase-01_PostgreSQL-Configuration/)
- **→ Next SubPhase:** [SubPhase-03_Public-Schema-Design](../SubPhase-03_Public-Schema-Design/)

---

## SubPhase Overview

This sub-phase installs and configures the django-tenants package, which provides PostgreSQL schema-based multi-tenancy for Django. This is the core package that enables data isolation between tenants through separate database schemas.

### Key Outcomes
- django-tenants package installed
- Database settings configured for multi-tenancy
- SHARED_APPS and TENANT_APPS properly defined
- Database routers configured
- TENANT_MODEL and TENANT_DOMAIN_MODEL specified
- Initial multi-tenant configuration working

### Technology Context
- **Package:** django-tenants (PostgreSQL-based)
- **Strategy:** Schema-based isolation
- **Database:** PostgreSQL 15+ (required)
- **Django:** 5.x compatibility

### Dependencies
- **Requires:** SubPhase-01 (PostgreSQL Configuration)
- **PostgreSQL must be configured with schema support**

---

## Task Execution Order

```
TASK GROUP A: Package Installation (Tasks 01-10)
        │
        ▼
TASK GROUP B: Database Settings Configuration (Tasks 11-26)
        │
        ▼
TASK GROUP C: App Classification (SHARED vs TENANT) (Tasks 27-42)
        │
        ▼
TASK GROUP D: Model Configuration (Tasks 43-56)
        │
        ▼
TASK GROUP E: Database Router Setup (Tasks 57-68)
        │
        ▼
TASK GROUP F: Initial Migration & Verification (Tasks 69-86)
```

---

## Task Index

### Group A: Package Installation (Tasks 01-10)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install django-tenants** | pip install django-tenants | SubPhase-01 | 🔴 Not Created |
| 02 | **Verify Package Version** | Check compatible version | Task 01 | 🔴 Not Created |
| 03 | **Add to requirements.txt** | Add django-tenants to deps | Task 01 | 🔴 Not Created |
| 04 | **Install psycopg2-binary** | PostgreSQL adapter | Task 01 | 🔴 Not Created |
| 05 | **Verify PostgreSQL Connection** | Test database connection | Task 04 | 🔴 Not Created |
| 06 | **Review django-tenants Docs** | Understand configuration | Task 01 | 🔴 Not Created |
| 07 | **Create tenants/ App Directory** | Create tenants Django app | Task 01 | 🔴 Not Created |
| 08 | **Register tenants App** | Add to settings.py | Task 07 | 🔴 Not Created |
| 09 | **Create apps/tenants/__init__.py** | App initialization | Task 07 | 🔴 Not Created |
| 10 | **Create apps/tenants/apps.py** | App configuration | Task 09 | 🔴 Not Created |

---

### Group B: Database Settings Configuration (Tasks 11-26)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 11 | **Update DATABASES Setting** | Configure database engine | Task 05 | 🔴 Not Created |
| 12 | **Set DATABASE ENGINE** | django_tenants.postgresql_backend | Task 11 | 🔴 Not Created |
| 13 | **Configure Database URL** | Use django-environ for URL | Task 11 | 🔴 Not Created |
| 14 | **Set DATABASE_ROUTERS** | Add TenantSyncRouter | Task 11 | 🔴 Not Created |
| 15 | **Configure DEFAULT_FILE_STORAGE** | Tenant-aware file storage | Task 11 | 🔴 Not Created |
| 16 | **Set TENANT_MODEL** | Point to Tenant model | Task 11 | 🔴 Not Created |
| 17 | **Set TENANT_DOMAIN_MODEL** | Point to Domain model | Task 11 | 🔴 Not Created |
| 18 | **Configure PUBLIC_SCHEMA_NAME** | Set to 'public' | Task 11 | 🔴 Not Created |
| 19 | **Configure TENANT_LIMIT_SET_CALLS** | Optimize SQL queries | Task 11 | 🔴 Not Created |
| 20 | **Configure SHOW_PUBLIC_IF_NO_TENANT** | Fallback behavior | Task 11 | 🔴 Not Created |
| 21 | **Configure AUTO_DROP_SCHEMA** | Schema cleanup | Task 11 | 🔴 Not Created |
| 22 | **Configure AUTO_CREATE_SCHEMA** | Auto-create schemas | Task 11 | 🔴 Not Created |
| 23 | **Configure TENANT_COLOR_ADMIN_APPS** | Admin UI distinction | Task 11 | 🔴 Not Created |
| 24 | **Create Database Config Module** | Separate db config file | Task 11 | 🔴 Not Created |
| 25 | **Test Database Configuration** | Verify settings work | Task 24 | 🔴 Not Created |
| 26 | **Document Database Settings** | Configuration docs | Task 25 | 🔴 Not Created |

---

### Group C: App Classification (SHARED vs TENANT) (Tasks 27-42)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 27 | **Define SHARED_APPS List** | Apps in public schema | Task 11 | 🔴 Not Created |
| 28 | **Add django_tenants to SHARED** | Tenants app shared | Task 27 | 🔴 Not Created |
| 29 | **Add contenttypes to SHARED** | Django contenttypes | Task 27 | 🔴 Not Created |
| 30 | **Add auth to SHARED** | Django auth shared | Task 27 | 🔴 Not Created |
| 31 | **Add sessions to SHARED** | Sessions in public | Task 27 | 🔴 Not Created |
| 32 | **Add tenants App to SHARED** | Our tenants app | Task 27 | 🔴 Not Created |
| 33 | **Define TENANT_APPS List** | Apps per tenant | Task 27 | 🔴 Not Created |
| 34 | **Add contenttypes to TENANT** | Required for tenant | Task 33 | 🔴 Not Created |
| 35 | **Add auth to TENANT** | Users per tenant | Task 33 | 🔴 Not Created |
| 36 | **Define INSTALLED_APPS** | Combine SHARED + TENANT | Task 27, 33 | 🔴 Not Created |
| 37 | **Order django_tenants First** | Must be first in list | Task 36 | 🔴 Not Created |
| 38 | **Create apps/__init__.py** | Apps package init | Task 27 | 🔴 Not Created |
| 39 | **Create Core Tenant Apps** | List future tenant apps | Task 33 | 🔴 Not Created |
| 40 | **Document App Classification** | Shared vs Tenant guide | Task 36 | 🔴 Not Created |
| 41 | **Create App Registry** | Central app listing | Task 39 | 🔴 Not Created |
| 42 | **Verify App Configuration** | Test imports work | Task 41 | 🔴 Not Created |

---

### Group D: Model Configuration (Tasks 43-56)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 43 | **Create Tenant Model** | TenantMixin subclass | Task 32 | 🔴 Not Created |
| 44 | **Add Tenant Schema Name** | Schema name field | Task 43 | 🔴 Not Created |
| 45 | **Add Tenant Name Field** | Business name | Task 43 | 🔴 Not Created |
| 46 | **Add Tenant Slug Field** | URL-safe identifier | Task 43 | 🔴 Not Created |
| 47 | **Add Tenant Created Field** | Creation timestamp | Task 43 | 🔴 Not Created |
| 48 | **Add Tenant Settings Field** | JSONField for settings | Task 43 | 🔴 Not Created |
| 49 | **Create Domain Model** | DomainMixin subclass | Task 43 | 🔴 Not Created |
| 50 | **Add Domain Tenant FK** | Link to Tenant | Task 49 | 🔴 Not Created |
| 51 | **Add Domain Name Field** | Domain string | Task 49 | 🔴 Not Created |
| 52 | **Add Is Primary Field** | Primary domain flag | Task 49 | 🔴 Not Created |
| 53 | **Create Model Admin** | Admin for Tenant/Domain | Task 49 | 🔴 Not Created |
| 54 | **Add Model Meta Classes** | Verbose names, ordering | Task 49 | 🔴 Not Created |
| 55 | **Add Model __str__ Methods** | String representations | Task 54 | 🔴 Not Created |
| 56 | **Document Tenant Models** | Model documentation | Task 55 | 🔴 Not Created |

---

### Group E: Database Router Setup (Tasks 57-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 57 | **Understand TenantSyncRouter** | Review router logic | Task 14 | 🔴 Not Created |
| 58 | **Configure Router in Settings** | Add to DATABASE_ROUTERS | Task 57 | 🔴 Not Created |
| 59 | **Create Custom Router** | Extend if needed | Task 58 | 🔴 Not Created |
| 60 | **Configure db_for_read** | Read routing logic | Task 59 | 🔴 Not Created |
| 61 | **Configure db_for_write** | Write routing logic | Task 59 | 🔴 Not Created |
| 62 | **Configure allow_migrate** | Migration routing | Task 59 | 🔴 Not Created |
| 63 | **Configure allow_relation** | Cross-schema relations | Task 59 | 🔴 Not Created |
| 64 | **Prevent Cross-Schema FK** | Block invalid relations | Task 63 | 🔴 Not Created |
| 65 | **Test Router Logic** | Verify routing works | Task 64 | 🔴 Not Created |
| 66 | **Create Router Tests** | Unit tests for router | Task 65 | 🔴 Not Created |
| 67 | **Document Router Behavior** | Routing documentation | Task 66 | 🔴 Not Created |
| 68 | **Handle Edge Cases** | Special routing cases | Task 65 | 🔴 Not Created |

---

### Group F: Initial Migration & Verification (Tasks 69-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Initial Migrations** | makemigrations tenants | Task 56 | 🔴 Not Created |
| 70 | **Review Migration Files** | Check generated SQL | Task 69 | 🔴 Not Created |
| 71 | **Run Shared Migrations** | migrate_schemas --shared | Task 70 | 🔴 Not Created |
| 72 | **Verify Public Schema** | Check public tables | Task 71 | 🔴 Not Created |
| 73 | **Create Public Tenant** | First tenant (public) | Task 72 | 🔴 Not Created |
| 74 | **Create Public Domain** | localhost domain | Task 73 | 🔴 Not Created |
| 75 | **Test Tenant Creation** | Create test tenant | Task 74 | 🔴 Not Created |
| 76 | **Verify Schema Creation** | Check tenant schema | Task 75 | 🔴 Not Created |
| 77 | **Run Tenant Migrations** | migrate_schemas | Task 76 | 🔴 Not Created |
| 78 | **Create Test Domain** | test.localhost | Task 77 | 🔴 Not Created |
| 79 | **Test Tenant Switching** | Switch between tenants | Task 78 | 🔴 Not Created |
| 80 | **Verify Data Isolation** | Test data separation | Task 79 | 🔴 Not Created |
| 81 | **Create Management Commands** | Custom tenant commands | Task 80 | 🔴 Not Created |
| 82 | **Create tenant_create Command** | CLI tenant creation | Task 81 | 🔴 Not Created |
| 83 | **Create tenant_list Command** | CLI tenant listing | Task 81 | 🔴 Not Created |
| 84 | **Add Makefile Commands** | make create-tenant | Task 82 | 🔴 Not Created |
| 85 | **Run Full Verification** | Complete test suite | Task 84 | 🔴 Not Created |
| 86 | **Create Initial Commit** | Commit django-tenants | Task 85 | 🔴 Not Created |

---

## Task Details

### Task 11: Update DATABASES Setting

**Goal:** Configure database for django-tenants.

**Content (settings/base.py):**
```python
# Database configuration for django-tenants
DATABASES = {
    'default': {
        'ENGINE': 'django_tenants.postgresql_backend',
        'NAME': env('DATABASE_NAME', default='lankacommerce'),
        'USER': env('DATABASE_USER', default='postgres'),
        'PASSWORD': env('DATABASE_PASSWORD', default='postgres'),
        'HOST': env('DATABASE_HOST', default='localhost'),
        'PORT': env('DATABASE_PORT', default='5432'),
        'CONN_MAX_AGE': 60,
        'OPTIONS': {
            'connect_timeout': 10,
        },
    }
}

# Database routers for multi-tenancy
DATABASE_ROUTERS = (
    'django_tenants.routers.TenantSyncRouter',
)

# Tenant configuration
TENANT_MODEL = 'tenants.Tenant'
TENANT_DOMAIN_MODEL = 'tenants.Domain'

# Schema configuration
PUBLIC_SCHEMA_NAME = 'public'
TENANT_LIMIT_SET_CALLS = True
SHOW_PUBLIC_IF_NO_TENANT_FOUND = True
AUTO_DROP_SCHEMA = False
AUTO_CREATE_SCHEMA = True
```

---

### Task 27: Define SHARED_APPS List

**Goal:** Define apps that exist in the public schema only.

**Content (settings/base.py):**
```python
# Apps that exist ONLY in the public schema
SHARED_APPS = [
    'django_tenants',  # Must be first!
    
    # Django core apps (shared)
    'django.contrib.contenttypes',
    'django.contrib.auth',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.admin',
    
    # Our shared apps
    'apps.tenants',  # Tenant management
    'apps.platform',  # Platform-level functionality
]

# Apps that exist in EACH tenant schema
TENANT_APPS = [
    # Django core apps (per tenant)
    'django.contrib.contenttypes',
    'django.contrib.auth',
    
    # Our tenant-specific apps
    'apps.users',  # Tenant users
    'apps.products',  # Product catalog
    'apps.inventory',  # Stock management
    'apps.orders',  # Order management
    'apps.customers',  # Customer database
    'apps.pos',  # Point of sale
    'apps.accounting',  # Financial records
    'apps.reports',  # Reporting
]

# Combined INSTALLED_APPS
INSTALLED_APPS = list(SHARED_APPS) + [
    app for app in TENANT_APPS if app not in SHARED_APPS
]
```

---

### Task 43: Create Tenant Model

**Goal:** Create the Tenant model for tenant management.

**Content (apps/tenants/models.py):**
```python
from django.db import models
from django_tenants.models import TenantMixin, DomainMixin


class Tenant(TenantMixin):
    """
    Multi-tenant model representing a business/organization.
    Each tenant has its own PostgreSQL schema with isolated data.
    """
    
    # Business information
    name = models.CharField(
        max_length=255,
        help_text="Business/Organization name"
    )
    slug = models.SlugField(
        max_length=100,
        unique=True,
        help_text="URL-safe identifier (used in subdomain)"
    )
    
    # Subscription and status
    is_active = models.BooleanField(
        default=True,
        help_text="Whether the tenant is active"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Tenant settings (JSON)
    settings = models.JSONField(
        default=dict,
        blank=True,
        help_text="Tenant-specific settings"
    )
    
    # Required field for django-tenants
    auto_create_schema = True
    auto_drop_schema = False
    
    class Meta:
        verbose_name = 'Tenant'
        verbose_name_plural = 'Tenants'
        ordering = ['name']
    
    def __str__(self):
        return self.name


class Domain(DomainMixin):
    """
    Domain model for mapping domains/subdomains to tenants.
    Supports both subdomains (shop.lankacommerce.lk) and
    custom domains (www.myshop.com).
    """
    
    # Override to add additional fields if needed
    is_primary = models.BooleanField(
        default=False,
        help_text="Primary domain for this tenant"
    )
    
    # SSL certificate status (for custom domains)
    ssl_enabled = models.BooleanField(
        default=False,
        help_text="Whether SSL is enabled"
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = 'Domain'
        verbose_name_plural = 'Domains'
        ordering = ['-is_primary', 'domain']
    
    def __str__(self):
        primary = " (primary)" if self.is_primary else ""
        return f"{self.domain}{primary}"
```

---

### Task 82: Create tenant_create Command

**Goal:** Create management command for tenant creation.

**Content (apps/tenants/management/commands/tenant_create.py):**
```python
from django.core.management.base import BaseCommand, CommandError
from django.utils.text import slugify

from apps.tenants.models import Tenant, Domain


class Command(BaseCommand):
    help = 'Create a new tenant with schema and domain'
    
    def add_arguments(self, parser):
        parser.add_argument(
            'name',
            type=str,
            help='Business name for the tenant'
        )
        parser.add_argument(
            '--slug',
            type=str,
            help='Custom slug (default: auto-generated from name)'
        )
        parser.add_argument(
            '--domain',
            type=str,
            help='Domain name (default: <slug>.localhost)'
        )
        parser.add_argument(
            '--schema',
            type=str,
            help='Schema name (default: tenant_<slug>)'
        )
    
    def handle(self, *args, **options):
        name = options['name']
        slug = options.get('slug') or slugify(name)
        domain_name = options.get('domain') or f"{slug}.localhost"
        schema_name = options.get('schema') or f"tenant_{slug}"
        
        self.stdout.write(f"Creating tenant: {name}")
        self.stdout.write(f"  Slug: {slug}")
        self.stdout.write(f"  Schema: {schema_name}")
        self.stdout.write(f"  Domain: {domain_name}")
        
        # Check if tenant exists
        if Tenant.objects.filter(slug=slug).exists():
            raise CommandError(f"Tenant with slug '{slug}' already exists")
        
        # Create tenant (this also creates the schema)
        tenant = Tenant.objects.create(
            name=name,
            slug=slug,
            schema_name=schema_name,
            is_active=True,
        )
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created tenant: {tenant}"))
        
        # Create domain
        domain = Domain.objects.create(
            tenant=tenant,
            domain=domain_name,
            is_primary=True,
        )
        
        self.stdout.write(self.style.SUCCESS(f"✅ Created domain: {domain}"))
        
        self.stdout.write(self.style.SUCCESS(
            f"\n🎉 Tenant '{name}' created successfully!\n"
            f"   Access at: http://{domain_name}/"
        ))
```

---

## Expected Final Structure

```
backend/
├── apps/
│   └── tenants/
│       ├── __init__.py
│       ├── apps.py
│       ├── models.py
│       ├── admin.py
│       ├── migrations/
│       │   ├── __init__.py
│       │   └── 0001_initial.py
│       └── management/
│           ├── __init__.py
│           └── commands/
│               ├── __init__.py
│               ├── tenant_create.py
│               └── tenant_list.py
├── config/
│   └── settings/
│       └── base.py (updated with django-tenants)
├── requirements/
│   └── base.txt (django-tenants added)
└── docs/
    └── multi-tenancy/
        ├── setup.md
        ├── app-classification.md
        └── router.md
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 86 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 86 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **django_tenants First:** Must be first in SHARED_APPS
3. **PostgreSQL Required:** Only works with PostgreSQL
4. **contenttypes in Both:** Must be in both SHARED and TENANT
5. **Schema Naming:** Use tenant_<slug> pattern
6. **Public Tenant:** Create a public tenant first
7. **Migrations:** Use migrate_schemas command
8. **Testing:** Always test data isolation between tenants
