# Group A: Test Infrastructure

> **Phase:** 02 - Database Architecture & Multi-Tenancy  
> **SubPhase:** 10 - Testing Multi-Tenancy  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Set up the testing infrastructure with pytest and custom markers

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [../Group-B_TenantTestCase-Base-Class/](../Group-B_TenantTestCase-Base-Class/)

---

## Group Overview

This group establishes the testing infrastructure including pytest configuration, test database settings, test schema management, and custom pytest markers for multi-tenant tests.

### Key Outcomes
- Create tests/ directory structure
- Create conftest.py with pytest fixtures
- Configure test database settings
- Create test schema management utilities
- Install pytest-django
- Install pytest-xdist (parallel tests)
- Install factory-boy
- Install faker for fake data
- Create test settings module
- Configure pytest.ini
- Create custom pytest markers
- Add @pytest.mark.multi_tenant marker
- Add @pytest.mark.slow marker
- Document test infrastructure

### Technology Context
- **pytest:** Python testing framework
- **pytest-django:** Django integration
- **pytest-xdist:** Parallel execution
- **factory-boy:** Test data factories

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-01-05_Structure-Config.md | 01-05 | Test structure, conftest, database, schema, pytest-django |
| 02 | 02_Tasks-06-10_Packages-Settings.md | 06-10 | pytest-xdist, factory-boy, faker, settings, pytest.ini |
| 03 | 03_Tasks-11-14_Markers-Docs.md | 11-14 | Custom markers, multi_tenant, slow, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 01 | Create Test Module Structure | SubPhase-09 | Simple |
| 02 | Create conftest.py | Task 01 | Medium |
| 03 | Configure Test Database | Task 02 | Medium |
| 04 | Create Test Schema Management | Task 03 | Medium |
| 05 | Install pytest-django | Task 01 | Simple |
| 06 | Install pytest-xdist | Task 05 | Simple |
| 07 | Install factory-boy | Task 05 | Simple |
| 08 | Install faker | Task 07 | Simple |
| 09 | Create Test Settings Module | Task 03 | Medium |
| 10 | Configure Test Runner | Task 09 | Simple |
| 11 | Create Test Markers | Task 10 | Simple |
| 12 | Add Multi-Tenant Marker | Task 11 | Simple |
| 13 | Add Slow Test Marker | Task 11 | Simple |
| 14 | Document Test Infrastructure | Task 13 | Simple |

---

## Execution Order

```
01_Tasks-01-05_Structure-Config.md
        │
        ▼
02_Tasks-06-10_Packages-Settings.md
        │
        ▼
03_Tasks-11-14_Markers-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/
├── tests/
│   ├── __init__.py
│   └── conftest.py
├── config/
│   └── settings/
│       └── test.py
├── pytest.ini
└── requirements/
    └── test.txt

docs/
└── testing/
    └── overview.md
```

---

## pytest.ini Configuration

```ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = -v --reuse-db --tb=short
markers =
    multi_tenant: Tests that require multi-tenant setup
    isolation: Tests for data isolation verification
    leak: Tests for data leak prevention
    performance: Performance benchmark tests
    slow: Slow running tests
```

---

## Test Settings

```python
# config/settings/test.py
from .base import *

# Use fast password hasher
PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']

# Disable migrations in tests
class DisableMigrations:
    def __contains__(self, item): return True
    def __getitem__(self, item): return None

MIGRATION_MODULES = DisableMigrations()

# Test database
DATABASES['default']['TEST'] = {
    'NAME': 'test_lcc_database',
}
```

---

## Notes for AI Agents

1. **Dependencies:** Requires SubPhase-09 complete
2. **pytest:** Use pytest, not unittest
3. **Markers:** Add custom markers for filtering
4. **Parallel:** Use pytest-xdist for speed
5. **Factory-Boy:** Use for test data generation
6. **Git Commit:** Commit after completing this group

