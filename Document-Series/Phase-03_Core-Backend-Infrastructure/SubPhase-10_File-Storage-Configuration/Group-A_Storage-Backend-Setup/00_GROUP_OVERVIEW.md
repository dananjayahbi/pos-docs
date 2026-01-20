# Group A: Storage Backend Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 10 - File Storage Configuration  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Install packages and configure basic file storage settings

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Tenant-Isolated-Storage/](../Group-B_Tenant-Isolated-Storage/)

---

## Group Overview

This group sets up the basic file storage infrastructure for the LankaCommerce Cloud platform. It includes installing required packages (django-storages, Pillow), creating the storage module, and configuring media and static file settings.

### Key Outcomes
- django-storages and Pillow packages installed
- Storage module created at apps/core/storage/
- MEDIA_URL and MEDIA_ROOT configured
- STATIC_URL and STATIC_ROOT configured
- Local media directory created
- Basic file upload verified

### Technology Context
- **Packages:** django-storages, Pillow
- **Settings File:** config/settings/storage.py
- **Media URL:** /media/
- **Static URL:** /static/
- **Local Path:** /media/ directory

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-04_Package-Installation.md | 01-04 | Install django-storages, pin version, install Pillow, pin Pillow version |
| 02 | 02_Tasks-05-08_Storage-Module-Setup.md | 05-08 | Create storage module, __init__.py, storage settings file, configure MEDIA_URL |
| 03 | 03_Tasks-09-14_Static-Media-Config.md | 09-14 | Configure MEDIA_ROOT, STATIC_URL, STATIC_ROOT, create media dir, import settings, test upload |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Install django-storages | SubPhase-06 | Simple |
| 02 | Pin django-storages Version | Task 01 | Simple |
| 03 | Install Pillow | Task 02 | Simple |
| 04 | Pin Pillow Version | Task 03 | Simple |
| 05 | Create storage Module | Task 04 | Simple |
| 06 | Create storage __init__.py | Task 05 | Simple |
| 07 | Create Storage Settings File | Task 06 | Medium |
| 08 | Configure MEDIA_URL | Task 07 | Simple |
| 09 | Configure MEDIA_ROOT | Task 08 | Simple |
| 10 | Configure STATIC_URL | Task 09 | Simple |
| 11 | Configure STATIC_ROOT | Task 10 | Simple |
| 12 | Create Media Directory | Task 11 | Simple |
| 13 | Import Storage Settings | Task 12 | Simple |
| 14 | Test Basic File Upload | Task 13 | Simple |

---

## Execution Order

```
01_Tasks-01-04_Package-Installation.md
        │
        ▼
02_Tasks-05-08_Storage-Module-Setup.md
        │
        ▼
03_Tasks-09-14_Static-Media-Config.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── requirements/
│   └── base.txt              # django-storages, Pillow added
├── config/
│   └── settings/
│       └── storage.py        # Storage settings module
├── apps/
│   └── core/
│       └── storage/
│           └── __init__.py   # Storage module init
└── media/                    # Local media directory
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-06 complete
2. **Version:** Use django-storages>=1.14.0, Pillow>=10.0.0
3. **Media URL:** Use /media/ for consistency
4. **Gitignore:** Add /media/ to .gitignore (except .gitkeep)
5. **Settings Import:** Import storage.py in base.py
6. **Git Commit:** Commit after completing this group
