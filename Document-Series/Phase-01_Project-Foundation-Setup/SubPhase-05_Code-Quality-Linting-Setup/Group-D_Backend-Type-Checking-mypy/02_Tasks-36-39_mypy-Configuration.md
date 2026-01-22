# Tasks 36-39: mypy Configuration

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** D - Backend Type Checking - mypy  
> **Document:** 02 of 03  
> **Tasks Covered:** 36, 37, 38, 39

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-31-35_mypy-Installation.md](01_Tasks-31-35_mypy-Installation.md)
- **→ Next Document:** [03_Tasks-40-42_mypy-Verification.md](03_Tasks-40-42_mypy-Verification.md)

---

## Document Overview

This document covers configuring strict mode, Django plugins, and per-module overrides.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 36 | Configure Strict Mode | Simple |
| 37 | Configure Plugins | Medium |
| 38 | Configure Ignore Missing Imports | Simple |
| 39 | Configure Per-Module Overrides | Medium |

---

## Task 36: Configure Strict Mode

### Overview
Enable strict type checking for maximum type safety.

### Dependencies
- Task 34: mypy.ini file exists

### Instructions

1. **Enable strict mode**
   - Turn on all strict checks

2. **Document implications**
   - What strict enables

3. **Alternative granular settings**
   - Individual options

### Configuration Addition

```ini
[mypy]
python_version = 3.12

# Enable strict mode for maximum type safety
strict = true
```

### What Strict Mode Enables

| Setting | Effect |
|---------|--------|
| disallow_untyped_calls | Error on calling untyped functions |
| disallow_untyped_defs | Error on untyped function definitions |
| disallow_incomplete_defs | Error on partial type hints |
| check_untyped_defs | Check inside untyped functions |
| disallow_untyped_decorators | Error on untyped decorators |
| no_implicit_optional | No implicit Optional |
| warn_redundant_casts | Warn on unnecessary casts |
| warn_return_any | Warn on returning Any |
| warn_unused_ignores | Warn on unused type:ignore |
| strict_equality | Strict equality checks |

### Gradual Typing Alternative

If strict is too aggressive initially:

```ini
[mypy]
python_version = 3.12

# Gradual strict settings
disallow_untyped_defs = true
disallow_incomplete_defs = true
check_untyped_defs = true
warn_return_any = true
warn_unused_ignores = true
```

### Expected Outcome
- Strict type checking enabled
- Maximum type safety

### Verification Checklist
- [ ] strict = true set
- [ ] Implications understood
- [ ] Team aware of requirements

---

## Task 37: Configure Plugins

### Overview
Configure Django mypy plugin for Django-specific type support.

### Dependencies
- Task 32: Django stubs installed
- Task 34: mypy.ini file exists

### Instructions

1. **Add plugins configuration**
   - Django plugin path

2. **Configure Django settings**
   - Settings module path

3. **Add DRF plugin**
   - If needed

### Configuration Addition

```ini
[mypy]
python_version = 3.12
strict = true

# Plugins for framework support
plugins = [
    "mypy_django_plugin.main",
]

# Django settings for mypy plugin
[mypy.plugins.django-stubs]
django_settings_module = "config.settings.base"
```

### Plugin Explained

| Plugin | Purpose |
|--------|---------|
| mypy_django_plugin.main | Django model, queryset, settings typing |

### Django Settings Module

The settings module path depends on project structure:

| Structure | Settings Module |
|-----------|-----------------|
| Single file | `config.settings` |
| Split settings | `config.settings.base` |
| Env-based | `config.settings.local` |

### Common Settings Paths

```
backend/
└── config/
    └── settings/
        ├── __init__.py
        ├── base.py         # config.settings.base
        ├── local.py        # config.settings.local
        └── production.py   # config.settings.production
```

### What Django Plugin Provides

| Feature | Type Support |
|---------|--------------|
| Models | Field types, QuerySet[Model] |
| Managers | Custom manager typing |
| Settings | django.conf.settings typing |
| Forms | Form field types |
| Admin | ModelAdmin typing |

### Expected Outcome
- Django plugin configured
- Settings module specified

### Verification Checklist
- [ ] Plugin added
- [ ] Settings module correct
- [ ] Django types work

---

## Task 38: Configure Ignore Missing Imports

### Overview
Configure mypy to handle missing type stubs gracefully.

### Dependencies
- Task 34: mypy.ini file exists

### Instructions

1. **Set ignore_missing_imports**
   - For libraries without stubs

2. **Document reason**
   - Why some packages lack stubs

3. **Alternative per-module**
   - Selective ignoring

### Configuration Addition

```ini
[mypy]
python_version = 3.12
strict = true
plugins = ["mypy_django_plugin.main"]

# Handle missing type stubs
ignore_missing_imports = true
```

### Why Ignore Missing Imports

| Scenario | Behavior |
|----------|----------|
| Library has stubs | Full type checking |
| Library has inline types | Full type checking |
| No stubs available | Error without ignore |

### Common Libraries Without Full Stubs

| Library | Status |
|---------|--------|
| Some Celery plugins | Partial |
| Smaller Django packages | None |
| Custom internal packages | Varies |

### Alternative: Per-Module Ignore

```ini
# Instead of global ignore
ignore_missing_imports = false

# Ignore specific modules
[mypy-some_untyped_library.*]
ignore_missing_imports = true
```

### Additional Settings

```ini
[mypy]
python_version = 3.12
strict = true
plugins = ["mypy_django_plugin.main"]
ignore_missing_imports = true

# Show error codes for easier debugging
show_error_codes = true

# Pretty output
pretty = true

# Show column numbers
show_column_numbers = true
```

### Expected Outcome
- Missing imports handled
- No false errors from third-party

### Verification Checklist
- [ ] ignore_missing_imports = true
- [ ] Third-party libraries work
- [ ] Error output configured

---

## Task 39: Configure Per-Module Overrides

### Overview
Configure module-specific mypy settings for different code areas.

### Dependencies
- Task 34: mypy.ini file exists

### Instructions

1. **Configure migrations override**
   - Ignore auto-generated code

2. **Configure tests override**
   - Looser typing for tests

3. **Configure settings override**
   - Handle Django settings

### Migrations Override

```ini
# Ignore all migration files (auto-generated)
[mypy-*.migrations.*]
ignore_errors = true
```

### Tests Override

```ini
# Looser typing in test files
[mypy-tests.*]
disallow_untyped_defs = false
disallow_untyped_calls = false
```

### Settings Override

```ini
# Handle Django settings with dynamic attributes
[mypy-config.settings.*]
ignore_errors = false
```

### Third-Party Overrides

```ini
# Specific library handling
[mypy-celery.*]
ignore_missing_imports = true

[mypy-redis.*]
ignore_missing_imports = true
```

### Complete Per-Module Section

```ini
# ==================================================
# Per-Module Overrides
# ==================================================

# Django migrations (auto-generated, ignore completely)
[mypy-*.migrations.*]
ignore_errors = true

# Test files (allow untyped for flexibility)
[mypy-tests.*]
disallow_untyped_defs = false
disallow_untyped_calls = false

# Conftest files
[mypy-conftest]
disallow_untyped_defs = false

# Third-party without stubs
[mypy-celery.*]
ignore_missing_imports = true

[mypy-kombu.*]
ignore_missing_imports = true
```

### When to Add Overrides

| Situation | Action |
|-----------|--------|
| Auto-generated code | ignore_errors = true |
| Tests | Disable some strict checks |
| Third-party no stubs | ignore_missing_imports = true |
| Legacy code | Gradual typing with disallow_untyped_defs = false |

### Expected Outcome
- Migrations ignored
- Tests have appropriate flexibility
- Third-party handled

### Verification Checklist
- [ ] Migrations ignored
- [ ] Tests configured
- [ ] Third-party overrides added
- [ ] No false positives

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 36 | Configure Strict Mode | strict = true |
| 37 | Configure Plugins | Django plugin |
| 38 | Configure Ignore Missing Imports | Handle untyped libs |
| 39 | Configure Per-Module Overrides | Migrations, tests |

### Complete mypy.ini

```ini
# ==================================================
# LankaCommerce Cloud - mypy Configuration
# ==================================================
# Purpose: Static type checking configuration
# Python: 3.12
# Frameworks: Django 5.x, DRF
# ==================================================

[mypy]
# Target Python version
python_version = 3.12

# Enable strict mode
strict = true

# Plugins for framework support
plugins = [
    "mypy_django_plugin.main",
]

# Handle missing type stubs
ignore_missing_imports = true

# Output settings
show_error_codes = true
pretty = true
show_column_numbers = true

# ==================================================
# Django Plugin Configuration
# ==================================================
[mypy.plugins.django-stubs]
django_settings_module = "config.settings.base"

# ==================================================
# Per-Module Overrides
# ==================================================

# Django migrations (auto-generated)
[mypy-*.migrations.*]
ignore_errors = true

# Test files
[mypy-tests.*]
disallow_untyped_defs = false
disallow_untyped_calls = false

# Conftest
[mypy-conftest]
disallow_untyped_defs = false

# Third-party without stubs
[mypy-celery.*]
ignore_missing_imports = true

[mypy-kombu.*]
ignore_missing_imports = true
```

### Next Steps
Proceed to [03_Tasks-40-42_mypy-Verification.md](03_Tasks-40-42_mypy-Verification.md) for running type check and documentation.

---

## Notes for AI Agents

1. **Strict mode:** Start with strict, add ignores as needed
2. **Django plugin:** Essential for Django projects
3. **Settings module:** Must match project structure
4. **Migrations:** Always ignore (auto-generated)
5. **Tests:** Can be looser for flexibility
6. **Overrides:** Use wildcards like *.migrations.*
7. **Error codes:** Enable for easier debugging
