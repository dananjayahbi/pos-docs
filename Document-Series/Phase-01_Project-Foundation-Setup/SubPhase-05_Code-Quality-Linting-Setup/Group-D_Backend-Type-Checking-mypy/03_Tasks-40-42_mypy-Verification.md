# Tasks 40-42: mypy Verification

> **Phase:** 01 - Project Foundation & Setup  
> **SubPhase:** 05 - Code Quality & Linting Setup  
> **Group:** D - Backend Type Checking - mypy  
> **Document:** 03 of 03  
> **Tasks Covered:** 40, 41, 42

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-36-39_mypy-Configuration.md](02_Tasks-36-39_mypy-Configuration.md)
- **→ Next Group:** [../Group-E_Frontend-Linting-ESLint/00_GROUP_OVERVIEW.md](../Group-E_Frontend-Linting-ESLint/)

---

## Document Overview

This document covers running initial type checks, adding annotations, and documentation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 40 | Run Initial Type Check | Medium |
| 41 | Add Type Annotations | Complex |
| 42 | Document mypy Usage | Simple |

---

## Task 40: Run Initial Type Check

### Overview
Run mypy on the codebase to identify type issues.

### Dependencies
- Task 39: Per-module overrides configured

### Instructions

1. **Run mypy**
   - Check entire codebase

2. **Review output**
   - Understand error types

3. **Prioritize fixes**
   - Most critical first

### Run mypy

```bash
# Run mypy on entire codebase
mypy .

# Run on specific directory
mypy apps/

# Show error statistics
mypy . --show-error-stats

# Generate HTML report
mypy . --html-report mypy-report
```

### Expected Output Types

| Output | Meaning |
|--------|---------|
| Success: no issues | All checks pass |
| error: Type error | Fix required |
| note: Revealed type | Info about inferred type |

### Example Output

```
apps/accounts/views.py:15: error: Function is missing a return type annotation  [no-untyped-def]
apps/inventory/models.py:42: error: Argument 1 to "filter" has incompatible type  [arg-type]
Found 2 errors in 2 files (checked 25 source files)
```

### Common First-Run Errors

| Error Code | Issue | Priority |
|------------|-------|----------|
| no-untyped-def | Missing function types | High |
| arg-type | Wrong argument type | High |
| return-value | Wrong return type | High |
| assignment | Wrong assignment type | Medium |
| import | Import errors | Low |

### Makefile Commands

```makefile
# ==================================================
# Type Checking
# ==================================================

.PHONY: typecheck
typecheck:
	@echo "Running mypy type check..."
	mypy .
	@echo "Type check complete!"

.PHONY: typecheck-report
typecheck-report:
	@echo "Generating mypy report..."
	mypy . --html-report mypy-report
	@echo "Report generated in mypy-report/"
```

### Expected Outcome
- mypy runs successfully
- Issues identified
- Baseline established

### Verification Checklist
- [ ] mypy runs without crash
- [ ] Plugin loads correctly
- [ ] Migrations ignored
- [ ] Errors documented

---

## Task 41: Add Type Annotations

### Overview
Add type annotations to core code to establish typed baseline.

### Dependencies
- Task 40: Run Initial Type Check

### Instructions

1. **Prioritize core modules**
   - Models, utilities first

2. **Add function annotations**
   - Parameters and returns

3. **Add variable annotations**
   - Where needed

### Function Annotations

```python
# Before
def get_user(user_id):
    return User.objects.get(id=user_id)

# After
def get_user(user_id: int) -> User:
    return User.objects.get(id=user_id)
```

### Model Annotations

```python
from django.db import models
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from apps.orders.models import Order

class User(models.Model):
    username: str = models.CharField(max_length=150)
    email: str = models.EmailField()
    
    def get_recent_orders(self) -> "models.QuerySet[Order]":
        return self.orders.filter(created_at__gte=timezone.now() - timedelta(days=30))
```

### Common Type Patterns

| Pattern | Example |
|---------|---------|
| Optional | `def f(x: int | None = None) -> str:` |
| List | `def f(items: list[str]) -> int:` |
| Dict | `def f(data: dict[str, Any]) -> None:` |
| QuerySet | `def f() -> QuerySet[User]:` |
| Union | `def f(x: int | str) -> None:` |

### Django-Specific Types

```python
from django.http import HttpRequest, HttpResponse
from django.db.models import QuerySet
from rest_framework.request import Request
from rest_framework.response import Response

def my_view(request: HttpRequest) -> HttpResponse:
    ...

def api_view(request: Request) -> Response:
    ...
```

### Type Alias Examples

```python
from typing import TypeAlias

UserId: TypeAlias = int
Price: TypeAlias = Decimal
OrderItems: TypeAlias = list[dict[str, Any]]
```

### Priority Order for Adding Types

| Priority | Area | Reason |
|----------|------|--------|
| 1 | Core utilities | Reused everywhere |
| 2 | Model methods | API contracts |
| 3 | Serializers | Data validation |
| 4 | Views | Request/Response |
| 5 | Tests | Optional |

### Git Commit

```bash
git add -A
git commit -m "feat: add type annotations to core modules

- Add function parameter types
- Add return type annotations
- Add model method types"
```

### Expected Outcome
- Core code typed
- Type errors reduced

### Verification Checklist
- [ ] Core utilities typed
- [ ] Model methods typed
- [ ] mypy errors reduced
- [ ] Changes committed

---

## Task 42: Document mypy Usage

### Overview
Document mypy usage for team developers.

### Dependencies
- Task 31: mypy installed

### Instructions

1. **Add to README**
   - Type checking section

2. **Document commands**
   - Common usage

3. **IDE setup notes**
   - VS Code, PyCharm

### README Addition

Add to `backend/README.md`:

```markdown
## Type Checking

This project uses [mypy](https://mypy.readthedocs.io/) for static type checking.

### Quick Commands

```bash
# Run type check
make typecheck

# Generate HTML report
make typecheck-report
```

### Configuration

mypy is configured in `mypy.ini`:
- Python 3.12 target
- Strict mode enabled
- Django plugin configured
- Migrations ignored

### Adding Type Hints

```python
# Function with types
def get_user(user_id: int) -> User:
    return User.objects.get(id=user_id)

# Optional parameter
def find_users(name: str | None = None) -> QuerySet[User]:
    if name:
        return User.objects.filter(name__icontains=name)
    return User.objects.all()
```

### Common Types

| Type | Import | Example |
|------|--------|---------|
| QuerySet | django.db.models | `QuerySet[User]` |
| HttpRequest | django.http | `request: HttpRequest` |
| Request | rest_framework.request | `request: Request` |

### IDE Setup

#### VS Code
Install Pylance extension (includes mypy).

#### PyCharm
Enable mypy in Settings → Python Integrated Tools → Type Checker.
```

### Developer Guidelines

Add to CONTRIBUTING.md:

```markdown
## Type Hints

### Requirements
- All new functions must have type annotations
- All new class methods must be typed
- Core modules require complete typing

### Running Type Check
```bash
make typecheck
```

### Ignoring Errors
Use `# type: ignore[error-code]` sparingly:
```python
result = untyped_library.call()  # type: ignore[no-untyped-call]
```
```

### Final Makefile Commands

```makefile
# ==================================================
# Complete Quality Commands
# ==================================================

.PHONY: quality
quality: format sort-imports lint typecheck
	@echo "All quality checks passed!"

.PHONY: quality-fix
quality-fix: lint-fix format sort-imports typecheck
	@echo "Quality fixes applied!"
```

### Expected Outcome
- README updated
- CONTRIBUTING updated
- Team guidelines clear

### Verification Checklist
- [ ] README has type checking section
- [ ] Commands documented
- [ ] IDE setup explained
- [ ] CONTRIBUTING.md updated

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 40 | Run Initial Type Check | Baseline established |
| 41 | Add Type Annotations | Core code typed |
| 42 | Document mypy Usage | README and guidelines |

### Group D Complete

All 12 tasks for mypy setup are complete:

| Task | Description | Status |
|------|-------------|--------|
| 31 | Install mypy | ✅ |
| 32 | Install Django Stubs | ✅ |
| 33 | Install DRF Stubs | ✅ |
| 34 | Create mypy.ini | ✅ |
| 35 | Configure Python Version | ✅ |
| 36 | Configure Strict Mode | ✅ |
| 37 | Configure Plugins | ✅ |
| 38 | Configure Ignore Missing | ✅ |
| 39 | Configure Per-Module | ✅ |
| 40 | Run Initial Type Check | ✅ |
| 41 | Add Type Annotations | ✅ |
| 42 | Document mypy Usage | ✅ |

### Final Makefile Commands

| Command | Purpose |
|---------|---------|
| `make typecheck` | Run mypy |
| `make typecheck-report` | Generate HTML report |
| `make quality` | All quality checks |

### Files Created/Updated

```
backend/
├── mypy.ini            # mypy configuration
├── Makefile            # Type check commands
├── README.md           # Type checking documentation
└── CONTRIBUTING.md     # Type hint guidelines
```

### Next Steps
Proceed to [Group E: Frontend Linting - ESLint](../Group-E_Frontend-Linting-ESLint/00_GROUP_OVERVIEW.md) for frontend linting configuration.

---

## Notes for AI Agents

1. **Run early:** Type check before committing
2. **Strict mode:** Start strict, add ignores as needed
3. **Priority:** Core utilities > models > views > tests
4. **Django types:** Use django-stubs types
5. **DRF types:** Use Request/Response from DRF
6. **Documentation:** Update as types expand
7. **CI/CD:** Add typecheck to pipeline
