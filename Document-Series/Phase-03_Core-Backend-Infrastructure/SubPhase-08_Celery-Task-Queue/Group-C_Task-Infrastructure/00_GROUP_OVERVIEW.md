# Group C: Task Infrastructure

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** C of F  
> **Tasks Covered:** 31-46  
> **Group Goal:** Create base task classes and common task implementations

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Celery-Configuration](../Group-B_Celery-Configuration/)
- **→ Next Group:** [Group-D_Celery-Beat-Scheduling](../Group-D_Celery-Beat-Scheduling/)

---

## Group Overview

This group creates the task infrastructure including base task classes, tenant-aware tasks, and common task implementations for email, reports, and notifications.

### Key Components
- **BaseTask Class:** Abstract base with lifecycle hooks
- **TenantAwareTask Class:** Task with tenant context
- **Email Tasks:** Transactional email sending
- **Report Tasks:** Report generation
- **Notification Tasks:** Push/SMS notifications

### Task Lifecycle Hooks
| Hook | Purpose |
|------|---------|
| on_success | Called when task completes successfully |
| on_failure | Called when task fails after all retries |
| on_retry | Called before each retry attempt |

### Tenant-Aware Task Flow
1. Caller passes tenant_id in apply_async
2. Task retrieves tenant from ID
3. Task sets database schema to tenant schema
4. Task executes with correct tenant context
5. Schema reset after task completion

---

## Documents in This Group

| Document # | Document Name | Tasks Covered | Description |
|------------|---------------|---------------|-------------|
| DOC-01 | Tasks Module Setup | Tasks 31-32 | Create tasks package |
| DOC-02 | Base Task Classes | Tasks 33-39 | BaseTask and TenantAwareTask |
| DOC-03 | Common Tasks | Tasks 40-45 | Email, Report, Notification tasks |
| DOC-04 | Export & Testing | Tasks 45-46 | Export and test |

---

## Task Summary

| Task # | Task Name | Key Points |
|--------|-----------|------------|
| 31 | Create tasks Module | apps/core/tasks/ directory |
| 32 | Create tasks __init__.py | Export tasks |
| 33 | Create BaseTask Class | Abstract base task |
| 34 | Add on_success Hook | Success callback |
| 35 | Add on_failure Hook | Failure callback |
| 36 | Add on_retry Hook | Retry callback |
| 37 | Create TenantAwareTask | Tenant context task |
| 38 | Pass Tenant ID to Task | In apply_async kwargs |
| 39 | Restore Tenant in Task | Set schema before execution |
| 40 | Create Email Tasks | email_tasks.py |
| 41 | Add send_email_task | Generic email task |
| 42 | Create Report Tasks | report_tasks.py |
| 43 | Add generate_report_task | Report generation |
| 44 | Create Notification Tasks | notification_tasks.py |
| 45 | Export All Tasks | In __init__.py |
| 46 | Test Task Infrastructure | Task tests |

---

## Execution Order

```
[Tasks 31-32: Module Setup]
        │
        ▼
[Tasks 33-39: Base Task Classes]
        │
        ▼
[Tasks 40-44: Common Tasks]
        │
        ▼
[Tasks 45-46: Export & Test]
```

---

## Expected Deliverables

### File Structure
```
backend/apps/core/
└── tasks/
    ├── __init__.py
    ├── base.py
    ├── email_tasks.py
    ├── report_tasks.py
    └── notification_tasks.py
```

### BaseTask Requirements
- Inherit from Celery Task
- Implement on_success, on_failure, on_retry hooks
- Log task lifecycle events
- Support for task binding (bind=True)

### TenantAwareTask Requirements
- Inherit from BaseTask
- Accept tenant_id parameter
- Set tenant schema before task execution
- Reset schema after task completion
- Handle tenant not found errors

### Common Task Types
| Task | Purpose |
|------|---------|
| send_email_task | Send transactional emails |
| send_bulk_email_task | Batch email sending |
| generate_report_task | Generate PDF/Excel reports |
| send_notification_task | Push/SMS notifications |

---

## Notes for AI Agents

1. **Base Class:** All tasks should inherit from BaseTask
2. **Tenant Context:** Use TenantAwareTask for tenant-specific operations
3. **Schema Isolation:** Each tenant has isolated database schema
4. **Error Handling:** Hooks should not raise exceptions
5. **Logging:** Log all task lifecycle events
6. **Bind Tasks:** Use bind=True for self reference
7. **Export:** All public tasks exported from __init__.py
