# Tasks 31-32: Tasks Module Setup

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** C - Task Infrastructure  
> **Document:** 01 of 04  
> **Tasks Covered:** 31, 32

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-33-39_Base-Task-Classes.md](02_Tasks-33-39_Base-Task-Classes.md)

---

## Document Overview

This document covers the creation of the tasks module structure within the core app, establishing the foundation for all Celery task implementations in the LankaCommerce Cloud platform.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 31 | Create tasks Module | Simple |
| 32 | Create tasks __init__.py | Simple |

---

## Task 31: Create tasks Module

### Overview
Create a tasks package (directory with __init__.py) within the core app to organize all Celery task implementations, providing a centralized location for task definitions.

### Dependencies
- Group B: Celery configuration complete
- apps/core app exists

### Instructions

1. **Locate core app directory**
   - Find the core Django app
   - For LCC: `backend/apps/core/`
   - This is where shared functionality resides

2. **Create tasks directory**
   - Create a new directory named `tasks`
   - This will be a Python package, not a single file
   - Use package structure for better organization

3. **Understand package vs. module**
   - Package: Directory with __init__.py (multiple files)
   - Module: Single .py file
   - Package allows organizing tasks by category

4. **Plan task organization**
   - Different task types in separate files
   - Base classes in base.py
   - Specific tasks in categorized files
   - All exported from __init__.py

### Package vs. Module Decision
| Structure | Use Case |
|-----------|----------|
| tasks.py (module) | Few tasks, simple structure |
| tasks/ (package) | Many tasks, categorized |

LCC uses package structure for scalability.

### Directory Structure
```
backend/apps/core/
├── __init__.py
├── models.py
├── views.py
├── admin.py
└── tasks/              # Create this directory
    └── __init__.py     # Next task
```

### Task Organization by Category
Plan for these task files:
| File | Purpose |
|------|---------|
| base.py | Base task classes |
| email_tasks.py | Email-related tasks |
| report_tasks.py | Report generation tasks |
| notification_tasks.py | Push/SMS notifications |
| cleanup_tasks.py | Maintenance tasks |

### Benefits of Package Structure
| Benefit | Explanation |
|---------|-------------|
| Organization | Group related tasks |
| Maintainability | Easy to find specific tasks |
| Scalability | Add new categories easily |
| Clarity | Clear responsibility per file |
| Testing | Test categories independently |

### Expected Outcome
- tasks/ directory created in core app
- Package structure ready for task files
- Foundation for task organization
- Ready for __init__.py creation

### Verification Checklist
- [ ] tasks/ directory exists in apps/core/
- [ ] Directory is empty (ready for __init__.py)
- [ ] Path is correct: backend/apps/core/tasks/
- [ ] Ready to become Python package

---

## Task 32: Create tasks __init__.py

### Overview
Create the __init__.py file for the tasks package, making it a proper Python package and setting up the export structure for all tasks.

### Dependencies
- Task 31: Create tasks Module

### Instructions

1. **Create __init__.py file**
   - Create file in tasks/ directory
   - For LCC: `backend/apps/core/tasks/__init__.py`
   - This makes tasks/ a Python package

2. **Add package docstring**
   - Document the package purpose
   - Explain task organization
   - Note that tasks use @shared_task decorator

3. **Set up __all__ list**
   - Create empty __all__ list initially
   - Will populate as tasks are created
   - Controls what gets imported with `from tasks import *`

4. **Add placeholder comment**
   - Note where task imports will go
   - Document import pattern
   - Explain export strategy

5. **Future imports structure**
   - Import from each task file
   - Add to __all__ list
   - Make tasks accessible from package level

### File Purpose
| Purpose | Description |
|---------|-------------|
| Package Marker | Makes directory a Python package |
| Export Control | Defines public API via __all__ |
| Import Aggregation | Central import point |
| Documentation | Package-level docstring |

### Initial File Structure
```python
"""
Celery tasks for LankaCommerce Cloud core app.

This package contains all Celery task implementations organized by category:
- base.py: Base task classes
- email_tasks.py: Email-related tasks
- report_tasks.py: Report generation tasks
- notification_tasks.py: Notification tasks

All tasks use @shared_task decorator for Django integration.
"""

# Task imports will be added here as tasks are created
# Example:
# from .email_tasks import send_email_task
# from .report_tasks import generate_report_task

# Public exports
__all__ = [
    # Task names will be added here
]
```

### Export Strategy
| Stage | __all__ Content |
|-------|-----------------|
| Initial | Empty list |
| After base classes | Base task classes |
| After tasks | All public tasks |
| Final | Complete task API |

### Import Pattern
As tasks are created:
```python
from .email_tasks import (
    send_email_task,
    send_bulk_email_task,
)
from .report_tasks import (
    generate_report_task,
)

__all__ = [
    'send_email_task',
    'send_bulk_email_task',
    'generate_report_task',
]
```

### Package Access Patterns
Users can import tasks in these ways:
| Pattern | Usage |
|---------|-------|
| `from apps.core.tasks import send_email_task` | Specific import |
| `from apps.core import tasks` | Module import |
| `import apps.core.tasks as core_tasks` | Aliased import |

### Autodiscovery Integration
| Aspect | Behavior |
|--------|----------|
| Discovery | Celery autodiscovers this package |
| Registration | All @shared_task decorators found |
| Naming | Tasks get full import path name |

### Expected Outcome
- __init__.py created in tasks/
- Package properly initialized
- Documentation in place
- Ready to add task files
- Export structure defined

### Verification Checklist
- [ ] __init__.py exists in tasks/ directory
- [ ] File has package docstring
- [ ] __all__ list is created (empty initially)
- [ ] File is valid Python
- [ ] Can import tasks package
- [ ] Path is correct: backend/apps/core/tasks/__init__.py

---

## Tasks Package Architecture

### Directory Structure After Setup
```
backend/apps/core/tasks/
├── __init__.py          # Created in this task
├── base.py              # Coming in next doc
├── email_tasks.py       # Coming in doc 03
├── report_tasks.py      # Coming in doc 03
└── notification_tasks.py # Coming in doc 03
```

### Task Naming Conventions
| Convention | Example | Purpose |
|------------|---------|---------|
| Verb_noun_task | send_email_task | Action-oriented |
| Category prefix | email_send_task | Grouped by type |
| Snake case | generate_report_task | Python style |
| _task suffix | cleanup_sessions_task | Identify as task |

Recommendation: verb_noun_task pattern

### Task Registration
| Decorator | Use Case |
|-----------|----------|
| @shared_task | Standard (use this) |
| @app.task | Tied to specific Celery app |
| @task | Old style (avoid) |

Always use @shared_task for Django integration.

### Module Organization Benefits
| Benefit | Impact |
|---------|--------|
| Separation of Concerns | Each file has single responsibility |
| Easy Navigation | Find tasks by category |
| Reduced Conflicts | Multiple developers can work independently |
| Clear Testing | Test each category separately |
| Documentation | Self-documenting structure |

### Scalability Considerations
As project grows:
- Add new task files for new categories
- Keep files focused (< 500 lines)
- Use subdirectories if needed (tasks/reports/)
- Maintain consistent naming
- Update __all__ list

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 31 | Create tasks Module | tasks/ directory created |
| 32 | Create tasks __init__.py | Package initialized |

### Package Status
- tasks/ package created in apps/core/
- __init__.py properly configured
- Export structure defined
- Ready for task implementations

### Directory Structure
```
backend/apps/core/
└── tasks/
    └── __init__.py
```

### Next Steps
Proceed to [02_Tasks-33-39_Base-Task-Classes.md](02_Tasks-33-39_Base-Task-Classes.md) to create base task classes with lifecycle hooks and tenant-aware functionality.

---

## Notes for AI Agents

1. **Package Structure:** Use package (directory) not module (file)
2. **Core App:** Tasks go in apps/core/tasks/ for shared tasks
3. **Organization:** Separate files for different task categories
4. **__all__ List:** Explicitly control public API
5. **Docstrings:** Document package purpose clearly
6. **Import Pattern:** Import and re-export for convenience
7. **Autodiscovery:** Celery finds tasks automatically
8. **Naming:** Use verb_noun_task convention
9. **Shared Task:** Always use @shared_task decorator
10. **Scalability:** Structure supports growth
