# Group A: DRF Installation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 02 - API Framework Setup  
> **Group:** A of F  
> **Tasks Covered:** 01-12  
> **Group Goal:** Install Django REST Framework and related packages

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_Core-Configuration/](../Group-B_Core-Configuration/)

---

## Group Overview

This group installs Django REST Framework and all supporting packages for the API layer. DRF was chosen over Django Ninja for its mature ecosystem and better django-tenants integration.

### Key Outcomes
- Install djangorestframework
- Pin DRF version in requirements
- Install django-filter for filtering
- Install djangorestframework-simplejwt for JWT auth
- Install drf-spectacular for OpenAPI docs
- Install django-cors-headers for CORS
- Register all apps in INSTALLED_APPS
- Update requirements.txt
- Verify installation works

### Technology Context
- **DRF:** Django REST Framework for API
- **django-filter:** QuerySet filtering
- **simplejwt:** JWT authentication
- **drf-spectacular:** OpenAPI 3.0 documentation
- **django-cors-headers:** CORS handling

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-06_Install-Packages.md | 01-06 | Install DRF, django-filter, simplejwt, spectacular, cors |
| 02 | 02_Tasks-07-12_Register-Verify.md | 07-12 | Add to INSTALLED_APPS, update requirements, verify |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Install djangorestframework | SubPhase-01 | Simple |
| 02 | Pin DRF Version | Task 01 | Simple |
| 03 | Install django-filter | Task 02 | Simple |
| 04 | Install djangorestframework-simplejwt | Task 02 | Simple |
| 05 | Install drf-spectacular | Task 02 | Simple |
| 06 | Install django-cors-headers | Task 02 | Simple |
| 07 | Add rest_framework to INSTALLED_APPS | Task 01 | Simple |
| 08 | Add django_filters to INSTALLED_APPS | Task 03 | Simple |
| 09 | Add corsheaders to INSTALLED_APPS | Task 06 | Simple |
| 10 | Add drf_spectacular to INSTALLED_APPS | Task 05 | Simple |
| 11 | Update requirements.txt | Task 10 | Simple |
| 12 | Verify Installation | Task 11 | Simple |

---

## Execution Order

```
01_Tasks-01-06_Install-Packages.md
        │
        ▼
02_Tasks-07-12_Register-Verify.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── requirements/
│   └── base.txt
│       ├── djangorestframework==3.14.x
│       ├── django-filter==23.x
│       ├── djangorestframework-simplejwt==5.x
│       ├── drf-spectacular==0.26.x
│       └── django-cors-headers==4.x
└── config/
    └── settings/
        └── base.py  # Updated INSTALLED_APPS
```

---

## Packages to Install

```bash
pip install djangorestframework
pip install django-filter
pip install djangorestframework-simplejwt
pip install drf-spectacular
pip install django-cors-headers
```

---

## INSTALLED_APPS Configuration

```python
# config/settings/base.py
INSTALLED_APPS = [
    # ...existing apps...
    
    # Third-party
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    'django_filters',
    'corsheaders',
    'drf_spectacular',
]
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-01 complete
2. **Order Matters:** Install packages before registering
3. **Versions:** Pin specific versions in requirements
4. **Verification:** Server must start after registration
5. **DRF Choice:** Use DRF, not Django Ninja
6. **Git Commit:** Commit after completing this group

