# Group C: Platform Settings Model

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 03 - Public Schema Design  
> **Group:** C of G  
> **Tasks Covered:** 29-42  
> **Group Goal:** Create platform-wide settings with singleton pattern

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-B_Subscription-Plans-Model/](../Group-B_Subscription-Plans-Model/)
- **→ Next Group:** [../Group-D_Platform-Users-Super-Admin/](../Group-D_Platform-Users-Super-Admin/)

---

## Group Overview

This group creates the PlatformSettings model using the singleton pattern. This model stores platform-wide configuration like branding, contact information, maintenance mode, and default tenant settings.

### Key Outcomes
- PlatformSettings model created (singleton)
- Platform name field
- Platform logo image field
- Contact email field
- Terms of service URL field
- Privacy policy URL field
- Maintenance mode toggle
- Registration open toggle
- Default plan foreign key
- Trial days field
- Singleton pattern implemented
- Settings admin interface
- Settings caching implemented
- get_settings() helper function

### Technology Context
- **Pattern:** Singleton (only one row)
- **Caching:** Redis-based settings cache
- **Images:** Platform logo storage
- **FK:** Link to default subscription plan

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-29-34_Settings-Branding.md | 29-34 | Create PlatformSettings, name, logo, contact email, terms URL, privacy URL |
| 02 | 02_Tasks-35-38_Settings-Features.md | 35-38 | Maintenance mode, registration open, default plan FK, trial days |
| 03 | 03_Tasks-39-42_Singleton-Caching-Helper.md | 39-42 | Singleton pattern, settings admin, caching, get_settings() helper |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 29 | Create PlatformSettings Model | Task 07 | Medium |
| 30 | Add Platform Name Field | Task 29 | Simple |
| 31 | Add Platform Logo Field | Task 29 | Simple |
| 32 | Add Contact Email Field | Task 29 | Simple |
| 33 | Add Terms URL Field | Task 29 | Simple |
| 34 | Add Privacy URL Field | Task 29 | Simple |
| 35 | Add Maintenance Mode Field | Task 29 | Simple |
| 36 | Add Registration Open Field | Task 29 | Simple |
| 37 | Add Default Plan FK | Task 29, 28 | Simple |
| 38 | Add Trial Days Field | Task 29 | Simple |
| 39 | Create Settings Singleton Pattern | Task 35 | Medium |
| 40 | Create Settings Admin | Task 39 | Medium |
| 41 | Create Settings Caching | Task 39 | Medium |
| 42 | Create get_settings() Helper | Task 41 | Simple |

---

## Execution Order

```
01_Tasks-29-34_Settings-Branding.md
        │
        ▼
02_Tasks-35-38_Settings-Features.md
        │
        ▼
03_Tasks-39-42_Singleton-Caching-Helper.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
└── apps/
    └── platform/
        ├── models/
        │   └── settings.py      # PlatformSettings
        ├── admin.py             # Updated with settings admin
        └── utils/
            └── settings.py      # get_settings() helper
```

---

## Singleton Pattern Implementation

```python
class PlatformSettings(models.Model):
    class Meta:
        verbose_name_plural = "Platform Settings"

    def save(self, *args, **kwargs):
        self.pk = 1  # Force single row
        super().save(*args, **kwargs)

    @classmethod
    def get_solo(cls):
        obj, created = cls.objects.get_or_create(pk=1)
        return obj
```

---

## Settings Caching

```python
def get_settings():
    from django.core.cache import cache
    settings = cache.get('platform_settings')
    if not settings:
        settings = PlatformSettings.get_solo()
        cache.set('platform_settings', settings, 60 * 60)
    return settings
```

---

## Notes for AI Agents

1. **Dependencies:** Requires Group B complete (SubscriptionPlan exists)
2. **Singleton:** Only one settings row allowed
3. **Caching:** Cache settings for 1 hour
4. **Cache Invalidation:** Clear cache on save
5. **Default Plan:** FK to SubscriptionPlan for new tenants
6. **Git Commit:** Commit after completing this group

