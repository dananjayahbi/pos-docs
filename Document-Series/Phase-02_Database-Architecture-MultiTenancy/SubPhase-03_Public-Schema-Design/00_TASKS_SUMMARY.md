# SubPhase 03: Public Schema Design - Tasks Summary

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase Index:** 03 of 10  
> **SubPhase Goal:** Design the shared public schema for platform-wide data  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 6-7 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_Django-Tenants-Installation](../SubPhase-02_Django-Tenants-Installation/)
- **→ Next SubPhase:** [SubPhase-04_Tenant-Model-Domain-Model](../SubPhase-04_Tenant-Model-Domain-Model/)

---

## SubPhase Overview

This sub-phase designs and implements the public schema - the shared database schema that contains platform-level data accessible across all tenants. The public schema stores tenant registry, subscription plans, platform settings, and super admin functionality.

### Key Outcomes
- Public schema tables fully designed
- Platform-level models implemented
- Subscription plans model created
- Feature flags system designed
- Platform settings management ready
- Super admin user management configured

### Public Schema Structure
```
public/
├── tenants              # Tenant registry
├── domains              # Domain mappings
├── subscription_plans   # Available plans
├── plan_features        # Features per plan
├── platform_settings    # Global settings
├── platform_users       # Super admin users
├── feature_flags        # Platform feature toggles
├── audit_logs           # Platform-level audit
├── billing_info         # Tenant billing records
└── announcements        # Platform announcements
```

### Dependencies
- **Requires:** SubPhase-02 (Django-Tenants Installation)
- **django-tenants must be configured with SHARED_APPS**

---

## Task Execution Order

```
TASK GROUP A: Public Schema Planning (Tasks 01-12)
        │
        ▼
TASK GROUP B: Subscription Plans Model (Tasks 13-28)
        │
        ▼
TASK GROUP C: Platform Settings Model (Tasks 29-42)
        │
        ▼
TASK GROUP D: Platform Users & Super Admin (Tasks 43-58)
        │
        ▼
TASK GROUP E: Feature Flags System (Tasks 59-72)
        │
        ▼
TASK GROUP F: Platform Audit & Billing (Tasks 73-84)
        │
        ▼
TASK GROUP G: Migration & Verification (Tasks 85-92)
```

---

## Task Index

### Group A: Public Schema Planning (Tasks 01-12)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create platform App** | Create apps/platform Django app | SubPhase-02 | 🔴 Not Created |
| 02 | **Create platform/__init__.py** | App initialization file | Task 01 | 🔴 Not Created |
| 03 | **Create platform/apps.py** | App configuration class | Task 02 | 🔴 Not Created |
| 04 | **Register platform in SHARED_APPS** | Add to shared apps list | Task 03 | 🔴 Not Created |
| 05 | **Create platform/models/__init__.py** | Models package init | Task 01 | 🔴 Not Created |
| 06 | **Define Public Schema ERD** | Document relationships | Task 01 | 🔴 Not Created |
| 07 | **Create Base Model Class** | Timestamped base model | Task 05 | 🔴 Not Created |
| 08 | **Create UUID Mixin** | UUID primary key mixin | Task 07 | 🔴 Not Created |
| 09 | **Create Soft Delete Mixin** | Soft deletion support | Task 07 | 🔴 Not Created |
| 10 | **Create Audit Mixin** | Created/updated by fields | Task 07 | 🔴 Not Created |
| 11 | **Document Naming Conventions** | Table naming standards | Task 06 | 🔴 Not Created |
| 12 | **Create Admin Base Classes** | Reusable admin classes | Task 07 | 🔴 Not Created |

---

### Group B: Subscription Plans Model (Tasks 13-28)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 13 | **Create SubscriptionPlan Model** | Base subscription model | Task 07 | 🔴 Not Created |
| 14 | **Add Plan Name Field** | Plan name (Free, Starter, etc.) | Task 13 | 🔴 Not Created |
| 15 | **Add Plan Slug Field** | URL-safe plan identifier | Task 13 | 🔴 Not Created |
| 16 | **Add Description Field** | Plan description text | Task 13 | 🔴 Not Created |
| 17 | **Add Monthly Price Field** | Monthly pricing (LKR) | Task 13 | 🔴 Not Created |
| 18 | **Add Annual Price Field** | Annual pricing (LKR) | Task 13 | 🔴 Not Created |
| 19 | **Add Max Users Field** | User limit per plan | Task 13 | 🔴 Not Created |
| 20 | **Add Max Products Field** | Product limit per plan | Task 13 | 🔴 Not Created |
| 21 | **Add Max Locations Field** | Location limit per plan | Task 13 | 🔴 Not Created |
| 22 | **Add Storage Limit Field** | Storage in MB/GB | Task 13 | 🔴 Not Created |
| 23 | **Add Is Active Field** | Plan availability status | Task 13 | 🔴 Not Created |
| 24 | **Add Display Order Field** | UI ordering | Task 13 | 🔴 Not Created |
| 25 | **Create PlanFeature Model** | Features per plan | Task 23 | 🔴 Not Created |
| 26 | **Add Feature Key/Value** | Feature identification | Task 25 | 🔴 Not Created |
| 27 | **Create SubscriptionPlan Admin** | Admin interface | Task 25 | 🔴 Not Created |
| 28 | **Create Default Plans Fixture** | Free/Starter/Pro/Enterprise | Task 27 | 🔴 Not Created |

---

### Group C: Platform Settings Model (Tasks 29-42)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 29 | **Create PlatformSettings Model** | Singleton settings model | Task 07 | 🔴 Not Created |
| 30 | **Add Platform Name Field** | Platform branding name | Task 29 | 🔴 Not Created |
| 31 | **Add Platform Logo Field** | Logo image field | Task 29 | 🔴 Not Created |
| 32 | **Add Contact Email Field** | Platform support email | Task 29 | 🔴 Not Created |
| 33 | **Add Terms URL Field** | Terms of service link | Task 29 | 🔴 Not Created |
| 34 | **Add Privacy URL Field** | Privacy policy link | Task 29 | 🔴 Not Created |
| 35 | **Add Maintenance Mode Field** | Platform-wide maintenance | Task 29 | 🔴 Not Created |
| 36 | **Add Registration Open Field** | New tenant signups | Task 29 | 🔴 Not Created |
| 37 | **Add Default Plan FK** | Default plan for new tenants | Task 29, 28 | 🔴 Not Created |
| 38 | **Add Trial Days Field** | Free trial period | Task 29 | 🔴 Not Created |
| 39 | **Create Settings Singleton Pattern** | Only one row allowed | Task 35 | 🔴 Not Created |
| 40 | **Create Settings Admin** | Admin interface | Task 39 | 🔴 Not Created |
| 41 | **Create Settings Caching** | Cache platform settings | Task 39 | 🔴 Not Created |
| 42 | **Create get_settings() Helper** | Quick settings access | Task 41 | 🔴 Not Created |

---

### Group D: Platform Users & Super Admin (Tasks 43-58)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 43 | **Create PlatformUser Model** | Super admin user model | Task 07 | 🔴 Not Created |
| 44 | **Extend AbstractUser** | Django user extension | Task 43 | 🔴 Not Created |
| 45 | **Add Is Platform Admin Field** | Super admin flag | Task 43 | 🔴 Not Created |
| 46 | **Add Phone Number Field** | Admin contact phone | Task 43 | 🔴 Not Created |
| 47 | **Add Profile Photo Field** | Admin avatar | Task 43 | 🔴 Not Created |
| 48 | **Add Last Login IP Field** | Security tracking | Task 43 | 🔴 Not Created |
| 49 | **Add Two Factor Enabled** | 2FA status | Task 43 | 🔴 Not Created |
| 50 | **Create PlatformRole Model** | Admin role definitions | Task 43 | 🔴 Not Created |
| 51 | **Add Role Permissions** | Role-based permissions | Task 50 | 🔴 Not Created |
| 52 | **Create User-Role M2M** | Role assignment | Task 51 | 🔴 Not Created |
| 53 | **Create Custom User Manager** | User creation methods | Task 44 | 🔴 Not Created |
| 54 | **Create PlatformUser Admin** | Admin interface | Task 52 | 🔴 Not Created |
| 55 | **Configure AUTH_USER_MODEL** | Point to PlatformUser | Task 54 | 🔴 Not Created |
| 56 | **Create Superuser Command** | Create platform admin | Task 53 | 🔴 Not Created |
| 57 | **Create User Permissions** | Custom permissions | Task 51 | 🔴 Not Created |
| 58 | **Document User Hierarchy** | User types documentation | Task 57 | 🔴 Not Created |

---

### Group E: Feature Flags System (Tasks 59-72)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 59 | **Create FeatureFlag Model** | Feature toggle model | Task 07 | 🔴 Not Created |
| 60 | **Add Flag Key Field** | Unique flag identifier | Task 59 | 🔴 Not Created |
| 61 | **Add Flag Name Field** | Human-readable name | Task 59 | 🔴 Not Created |
| 62 | **Add Description Field** | Flag purpose description | Task 59 | 🔴 Not Created |
| 63 | **Add Is Enabled Field** | Global enable/disable | Task 59 | 🔴 Not Created |
| 64 | **Add Rollout Percentage** | Gradual rollout support | Task 59 | 🔴 Not Created |
| 65 | **Create TenantFeatureFlag** | Per-tenant overrides | Task 63 | 🔴 Not Created |
| 66 | **Add Tenant FK** | Link to specific tenant | Task 65 | 🔴 Not Created |
| 67 | **Add Override Value** | Tenant-specific value | Task 65 | 🔴 Not Created |
| 68 | **Create Flag Caching** | Cache flag values | Task 65 | 🔴 Not Created |
| 69 | **Create is_enabled() Helper** | Check flag status | Task 68 | 🔴 Not Created |
| 70 | **Create Flag Admin** | Admin interface | Task 65 | 🔴 Not Created |
| 71 | **Create Flag Middleware** | Request-level flags | Task 69 | 🔴 Not Created |
| 72 | **Create Default Flags Fixture** | Initial feature flags | Task 70 | 🔴 Not Created |

---

### Group F: Platform Audit & Billing (Tasks 73-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 73 | **Create PlatformAuditLog** | Platform-level audit | Task 07 | 🔴 Not Created |
| 74 | **Add Action Field** | Action type enum | Task 73 | 🔴 Not Created |
| 75 | **Add Actor Field** | Who performed action | Task 73 | 🔴 Not Created |
| 76 | **Add Target Tenant Field** | Affected tenant | Task 73 | 🔴 Not Created |
| 77 | **Add Metadata JSONField** | Action details | Task 73 | 🔴 Not Created |
| 78 | **Add IP Address Field** | Request IP | Task 73 | 🔴 Not Created |
| 79 | **Create TenantBilling Model** | Billing information | Task 07 | 🔴 Not Created |
| 80 | **Add Billing Address Fields** | Address for invoices | Task 79 | 🔴 Not Created |
| 81 | **Add Tax ID Field** | Business tax number | Task 79 | 🔴 Not Created |
| 82 | **Add Payment Method Field** | Payment preferences | Task 79 | 🔴 Not Created |
| 83 | **Create Announcement Model** | Platform announcements | Task 07 | 🔴 Not Created |
| 84 | **Add Announcement Fields** | Title, content, dates | Task 83 | 🔴 Not Created |

---

### Group G: Migration & Verification (Tasks 85-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 85 | **Create Platform Migrations** | makemigrations platform | Task 84 | 🔴 Not Created |
| 86 | **Review Migration Files** | Check generated SQL | Task 85 | 🔴 Not Created |
| 87 | **Run Shared Migrations** | migrate_schemas --shared | Task 86 | 🔴 Not Created |
| 88 | **Verify Public Tables** | Check tables created | Task 87 | 🔴 Not Created |
| 89 | **Load Default Fixtures** | Plans, flags, settings | Task 88 | 🔴 Not Created |
| 90 | **Create Platform Admin User** | First super admin | Task 89 | 🔴 Not Created |
| 91 | **Run Verification Tests** | Test all models | Task 90 | 🔴 Not Created |
| 92 | **Create Initial Commit** | Commit public schema | Task 91 | 🔴 Not Created |

---

## Task Details

### Task 13: Create SubscriptionPlan Model

**Goal:** Create the subscription plan model for tenant billing.

**Content (apps/platform/models/subscription.py):**
```python
from django.db import models
from django.core.validators import MinValueValidator
from decimal import Decimal

from .base import BaseModel


class SubscriptionPlan(BaseModel):
    """
    Subscription plan definitions for tenant billing.
    Stored in the public schema, accessible platform-wide.
    """
    
    # Plan identification
    name = models.CharField(
        max_length=100,
        unique=True,
        help_text="Plan name (e.g., Free, Starter, Pro)"
    )
    slug = models.SlugField(
        max_length=50,
        unique=True,
        help_text="URL-safe identifier"
    )
    description = models.TextField(
        blank=True,
        help_text="Plan description for marketing"
    )
    
    # Pricing (LKR - Sri Lankan Rupees)
    monthly_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Monthly price in LKR"
    )
    annual_price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))],
        help_text="Annual price in LKR (typically discounted)"
    )
    
    # Limits
    max_users = models.PositiveIntegerField(
        default=1,
        help_text="Maximum users allowed (0 = unlimited)"
    )
    max_products = models.PositiveIntegerField(
        default=100,
        help_text="Maximum products (0 = unlimited)"
    )
    max_locations = models.PositiveIntegerField(
        default=1,
        help_text="Maximum store locations"
    )
    max_storage_mb = models.PositiveIntegerField(
        default=500,
        help_text="Storage limit in megabytes"
    )
    
    # Availability
    is_active = models.BooleanField(
        default=True,
        help_text="Whether plan is available for new subscriptions"
    )
    is_featured = models.BooleanField(
        default=False,
        help_text="Featured in pricing page"
    )
    display_order = models.PositiveIntegerField(
        default=0,
        help_text="Order in pricing page display"
    )
    
    class Meta:
        verbose_name = 'Subscription Plan'
        verbose_name_plural = 'Subscription Plans'
        ordering = ['display_order', 'monthly_price']
    
    def __str__(self):
        return f"{self.name} - LKR {self.monthly_price}/month"
    
    @property
    def annual_savings(self) -> Decimal:
        """Calculate savings when paying annually."""
        monthly_annual = self.monthly_price * 12
        return monthly_annual - self.annual_price


class PlanFeature(BaseModel):
    """
    Individual features included in a subscription plan.
    Allows flexible feature definition without schema changes.
    """
    
    plan = models.ForeignKey(
        SubscriptionPlan,
        on_delete=models.CASCADE,
        related_name='features'
    )
    feature_key = models.CharField(
        max_length=100,
        help_text="Feature identifier (e.g., 'api_access', 'reports')"
    )
    feature_name = models.CharField(
        max_length=200,
        help_text="Human-readable feature name"
    )
    feature_value = models.CharField(
        max_length=200,
        default='true',
        help_text="Feature value (true/false or specific value)"
    )
    display_text = models.CharField(
        max_length=255,
        blank=True,
        help_text="Text to display in pricing table"
    )
    
    class Meta:
        verbose_name = 'Plan Feature'
        verbose_name_plural = 'Plan Features'
        unique_together = ['plan', 'feature_key']
        ordering = ['plan', 'feature_key']
    
    def __str__(self):
        return f"{self.plan.name} - {self.feature_name}"
```

---

### Task 29: Create PlatformSettings Model

**Goal:** Create singleton platform settings model.

**Content (apps/platform/models/settings.py):**
```python
from django.db import models
from django.core.cache import cache
from django.core.exceptions import ValidationError

from .base import BaseModel


class PlatformSettings(BaseModel):
    """
    Singleton model for platform-wide settings.
    Only one instance should exist in the database.
    """
    
    # Branding
    platform_name = models.CharField(
        max_length=100,
        default='LankaCommerce Cloud',
        help_text="Platform display name"
    )
    platform_tagline = models.CharField(
        max_length=255,
        default='Cloud ERP & POS for Sri Lankan SMEs',
        blank=True
    )
    platform_logo = models.ImageField(
        upload_to='platform/',
        blank=True,
        null=True
    )
    primary_color = models.CharField(
        max_length=7,
        default='#2563eb',
        help_text="Primary brand color (hex)"
    )
    
    # Contact
    contact_email = models.EmailField(
        default='support@lankacommerce.lk'
    )
    contact_phone = models.CharField(
        max_length=20,
        blank=True
    )
    
    # Legal
    terms_url = models.URLField(
        blank=True,
        help_text="Terms of Service URL"
    )
    privacy_url = models.URLField(
        blank=True,
        help_text="Privacy Policy URL"
    )
    
    # Operations
    maintenance_mode = models.BooleanField(
        default=False,
        help_text="Enable platform-wide maintenance mode"
    )
    maintenance_message = models.TextField(
        blank=True,
        default="We're performing scheduled maintenance. Please check back soon."
    )
    registration_open = models.BooleanField(
        default=True,
        help_text="Allow new tenant registrations"
    )
    
    # Defaults
    default_plan = models.ForeignKey(
        'platform.SubscriptionPlan',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        help_text="Default plan for new tenants"
    )
    trial_days = models.PositiveIntegerField(
        default=14,
        help_text="Free trial period in days"
    )
    
    class Meta:
        verbose_name = 'Platform Settings'
        verbose_name_plural = 'Platform Settings'
    
    def __str__(self):
        return 'Platform Settings'
    
    def save(self, *args, **kwargs):
        """Ensure only one instance exists."""
        if not self.pk and PlatformSettings.objects.exists():
            raise ValidationError(
                "Only one PlatformSettings instance allowed."
            )
        super().save(*args, **kwargs)
        # Invalidate cache
        cache.delete('platform_settings')
    
    @classmethod
    def get_settings(cls):
        """Get cached platform settings."""
        settings = cache.get('platform_settings')
        if settings is None:
            settings, _ = cls.objects.get_or_create(pk=1)
            cache.set('platform_settings', settings, timeout=300)
        return settings


def get_platform_settings():
    """Shortcut function for getting platform settings."""
    return PlatformSettings.get_settings()
```

---

### Task 59: Create FeatureFlag Model

**Goal:** Create feature flag system for gradual rollouts.

**Content (apps/platform/models/features.py):**
```python
from django.db import models
from django.core.cache import cache
from django.core.validators import MaxValueValidator, MinValueValidator

from .base import BaseModel


class FeatureFlag(BaseModel):
    """
    Platform-wide feature flags for controlled feature rollouts.
    Supports percentage-based rollouts and per-tenant overrides.
    """
    
    # Identification
    key = models.CharField(
        max_length=100,
        unique=True,
        help_text="Unique flag key (e.g., 'new_dashboard', 'ai_features')"
    )
    name = models.CharField(
        max_length=200,
        help_text="Human-readable flag name"
    )
    description = models.TextField(
        blank=True,
        help_text="Description of what this flag controls"
    )
    
    # Status
    is_enabled = models.BooleanField(
        default=False,
        help_text="Global enable/disable"
    )
    
    # Rollout
    rollout_percentage = models.PositiveIntegerField(
        default=100,
        validators=[MaxValueValidator(100), MinValueValidator(0)],
        help_text="Percentage of tenants to enable (0-100)"
    )
    
    # Metadata
    category = models.CharField(
        max_length=50,
        default='general',
        help_text="Flag category for organization"
    )
    
    class Meta:
        verbose_name = 'Feature Flag'
        verbose_name_plural = 'Feature Flags'
        ordering = ['category', 'key']
    
    def __str__(self):
        status = "✓" if self.is_enabled else "✗"
        return f"[{status}] {self.name}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Invalidate cache
        cache.delete(f'feature_flag_{self.key}')
        cache.delete('feature_flags_all')
    
    @classmethod
    def is_flag_enabled(cls, key: str, tenant_id: str = None) -> bool:
        """
        Check if a feature flag is enabled.
        Checks tenant-specific override first, then global flag.
        """
        # Check cache first
        cache_key = f'feature_flag_{key}_{tenant_id or "global"}'
        cached = cache.get(cache_key)
        if cached is not None:
            return cached
        
        try:
            flag = cls.objects.get(key=key)
        except cls.DoesNotExist:
            return False
        
        if not flag.is_enabled:
            cache.set(cache_key, False, timeout=60)
            return False
        
        # Check tenant-specific override
        if tenant_id:
            try:
                override = TenantFeatureOverride.objects.get(
                    flag=flag,
                    tenant_id=tenant_id
                )
                cache.set(cache_key, override.is_enabled, timeout=60)
                return override.is_enabled
            except TenantFeatureOverride.DoesNotExist:
                pass
        
        # Check rollout percentage
        if flag.rollout_percentage < 100 and tenant_id:
            # Use tenant_id hash for consistent rollout
            tenant_hash = hash(tenant_id) % 100
            enabled = tenant_hash < flag.rollout_percentage
            cache.set(cache_key, enabled, timeout=60)
            return enabled
        
        cache.set(cache_key, True, timeout=60)
        return True


class TenantFeatureOverride(BaseModel):
    """
    Per-tenant override for feature flags.
    Allows enabling/disabling features for specific tenants.
    """
    
    flag = models.ForeignKey(
        FeatureFlag,
        on_delete=models.CASCADE,
        related_name='tenant_overrides'
    )
    tenant_id = models.CharField(
        max_length=100,
        help_text="Tenant schema name or ID"
    )
    is_enabled = models.BooleanField(
        default=True,
        help_text="Override value for this tenant"
    )
    reason = models.CharField(
        max_length=255,
        blank=True,
        help_text="Reason for override"
    )
    
    class Meta:
        verbose_name = 'Tenant Feature Override'
        verbose_name_plural = 'Tenant Feature Overrides'
        unique_together = ['flag', 'tenant_id']
    
    def __str__(self):
        status = "enabled" if self.is_enabled else "disabled"
        return f"{self.flag.key} {status} for {self.tenant_id}"
    
    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        # Invalidate cache
        cache.delete(f'feature_flag_{self.flag.key}_{self.tenant_id}')
```

---

### Task 73: Create PlatformAuditLog

**Goal:** Create audit logging for platform actions.

**Content (apps/platform/models/audit.py):**
```python
from django.db import models
from django.conf import settings


class PlatformAuditLog(models.Model):
    """
    Audit log for platform-level actions.
    Tracks admin actions on tenants and settings.
    """
    
    class ActionType(models.TextChoices):
        TENANT_CREATED = 'tenant_created', 'Tenant Created'
        TENANT_UPDATED = 'tenant_updated', 'Tenant Updated'
        TENANT_SUSPENDED = 'tenant_suspended', 'Tenant Suspended'
        TENANT_ACTIVATED = 'tenant_activated', 'Tenant Activated'
        TENANT_DELETED = 'tenant_deleted', 'Tenant Deleted'
        PLAN_CHANGED = 'plan_changed', 'Plan Changed'
        SETTINGS_UPDATED = 'settings_updated', 'Settings Updated'
        FLAG_TOGGLED = 'flag_toggled', 'Feature Flag Toggled'
        USER_LOGIN = 'user_login', 'User Login'
        USER_LOGOUT = 'user_logout', 'User Logout'
    
    # Action details
    action = models.CharField(
        max_length=50,
        choices=ActionType.choices
    )
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # Actor (who performed the action)
    actor = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        related_name='platform_audit_logs'
    )
    actor_email = models.EmailField(
        blank=True,
        help_text="Denormalized email for historical record"
    )
    
    # Target (what was acted upon)
    target_tenant_id = models.CharField(
        max_length=100,
        blank=True,
        help_text="Tenant ID if action was on a tenant"
    )
    target_description = models.CharField(
        max_length=255,
        blank=True,
        help_text="Human-readable target description"
    )
    
    # Context
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True
    )
    user_agent = models.TextField(blank=True)
    metadata = models.JSONField(
        default=dict,
        blank=True,
        help_text="Additional action details"
    )
    
    class Meta:
        verbose_name = 'Platform Audit Log'
        verbose_name_plural = 'Platform Audit Logs'
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['action', 'timestamp']),
            models.Index(fields=['actor', 'timestamp']),
            models.Index(fields=['target_tenant_id']),
        ]
    
    def __str__(self):
        return f"{self.action} by {self.actor_email} at {self.timestamp}"
    
    @classmethod
    def log(cls, action, actor, target_tenant_id='', target_description='',
            ip_address=None, user_agent='', metadata=None):
        """Create an audit log entry."""
        return cls.objects.create(
            action=action,
            actor=actor,
            actor_email=actor.email if actor else '',
            target_tenant_id=target_tenant_id,
            target_description=target_description,
            ip_address=ip_address,
            user_agent=user_agent,
            metadata=metadata or {}
        )
```

---

## Expected Final Structure

```
backend/
├── apps/
│   └── platform/
│       ├── __init__.py
│       ├── apps.py
│       ├── admin.py
│       ├── models/
│       │   ├── __init__.py
│       │   ├── base.py
│       │   ├── subscription.py
│       │   ├── settings.py
│       │   ├── users.py
│       │   ├── features.py
│       │   ├── audit.py
│       │   └── billing.py
│       ├── migrations/
│       │   ├── __init__.py
│       │   └── 0001_initial.py
│       └── fixtures/
│           ├── default_plans.json
│           ├── default_settings.json
│           └── default_flags.json
└── docs/
    └── public-schema/
        ├── overview.md
        ├── subscription-plans.md
        ├── feature-flags.md
        └── audit-logging.md
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 92 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 92 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Complete Group A before B, etc.
2. **Public Schema Only:** All models here are SHARED_APPS
3. **Singleton Pattern:** PlatformSettings must be singleton
4. **Caching Important:** Use caching for settings/flags
5. **UUID Primary Keys:** Consider using UUIDs for security
6. **LKR Currency:** Prices in Sri Lankan Rupees
7. **Soft Deletes:** Consider soft delete for audit trail
8. **Fixtures:** Create JSON fixtures for initial data
