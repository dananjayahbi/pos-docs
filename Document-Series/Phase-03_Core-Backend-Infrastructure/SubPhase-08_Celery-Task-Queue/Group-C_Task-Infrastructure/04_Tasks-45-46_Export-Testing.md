# Tasks 45-46: Export & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** C - Task Infrastructure  
> **Document:** 04 of 04  
> **Tasks Covered:** 45, 46

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [03_Tasks-40-44_Common-Tasks.md](03_Tasks-40-44_Common-Tasks.md)
- **→ Next Group:** [../Group-D_Celery-Beat-Scheduling/](../Group-D_Celery-Beat-Scheduling/)

---

## Document Overview

This document covers exporting all created tasks from the tasks package and implementing comprehensive tests to verify task functionality and infrastructure.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 45 | Export All Tasks | Simple |
| 46 | Test Task Infrastructure | Complex |

---

## Task 45: Export All Tasks

### Overview
Update the tasks package __init__.py to import and export all created tasks, making them easily accessible throughout the LankaCommerce Cloud application.

### Dependencies
- Task 41: Add send_email_task
- Task 43: Add generate_report_task
- Task 44: Create Notification Tasks

### Instructions

1. **Open tasks/__init__.py**
   - Navigate to backend/apps/core/tasks/__init__.py
   - This file was created in Task 32
   - Currently has placeholder comments

2. **Import base classes**
   - Import BaseTask from base module
   - Import TenantAwareTask from base module
   - These are useful for other apps creating tasks

3. **Import email tasks**
   - Import send_email_task from email_tasks module
   - Import any other email tasks created
   - Add to import statement

4. **Import report tasks**
   - Import generate_report_task from report_tasks module
   - Import any other report tasks created
   - Add to import statement

5. **Import notification tasks**
   - Import send_notification_task from notification_tasks module
   - Import any other notification tasks created
   - Add to import statement

6. **Update __all__ list**
   - Add all base classes to __all__
   - Add all task functions to __all__
   - Maintain alphabetical order
   - Document each export

7. **Add version or metadata (optional)**
   - Add __version__ if tracking
   - Add module-level documentation
   - Document task categories

### Import Structure
```python
"""
Celery tasks for LankaCommerce Cloud core app.
"""

# Base classes
from .base import BaseTask, TenantAwareTask

# Email tasks
from .email_tasks import send_email_task

# Report tasks
from .report_tasks import generate_report_task

# Notification tasks
from .notification_tasks import send_notification_task

__all__ = [
    # Base classes
    'BaseTask',
    'TenantAwareTask',
    # Email tasks
    'send_email_task',
    # Report tasks
    'generate_report_task',
    # Notification tasks
    'send_notification_task',
]
```

### Export Categories
| Category | Exports |
|----------|---------|
| Base Classes | BaseTask, TenantAwareTask |
| Email Tasks | send_email_task |
| Report Tasks | generate_report_task |
| Notification Tasks | send_notification_task |

### Import Patterns for Users
After exporting, users can import as:
```python
# Import specific task
from apps.core.tasks import send_email_task

# Import multiple tasks
from apps.core.tasks import (
    send_email_task,
    generate_report_task,
)

# Import base for custom tasks
from apps.core.tasks import TenantAwareTask
```

### __all__ Best Practices
| Practice | Rationale |
|----------|-----------|
| Explicit exports | Control public API |
| Alphabetical order | Easy to find |
| Grouped by category | Clear organization |
| Comments | Document purpose |

### Documentation Updates
Update package docstring with:
- List of available tasks
- Usage examples
- Import patterns
- Base class documentation

### Expected Outcome
- All tasks exported from package
- Clean import interface
- __all__ list complete
- Documentation updated
- Easy to use from other modules

### Verification Checklist
- [ ] All base classes imported
- [ ] All task functions imported
- [ ] __all__ list includes all exports
- [ ] Imports are alphabetically ordered
- [ ] Can import tasks from package
- [ ] No import errors
- [ ] Documentation is updated

---

## Task 46: Test Task Infrastructure

### Overview
Create comprehensive tests for the task infrastructure including base classes, lifecycle hooks, tenant awareness, and all common tasks to ensure reliability.

### Dependencies
- Task 45: Export All Tasks
- All previous Group C tasks complete

### Instructions

1. **Create test directory structure**
   - Create tests/test_tasks/ directory
   - Create __init__.py in test directory
   - Organize tests by task category

2. **Create conftest.py for fixtures**
   - Create pytest fixtures for testing
   - Tenant fixtures
   - User fixtures
   - Email fixtures
   - Database fixtures

3. **Test BaseTask class**
   - Test task creation
   - Test lifecycle hooks
   - Test logging
   - Test error handling

4. **Test TenantAwareTask class**
   - Test schema switching
   - Test tenant retrieval
   - Test schema restoration
   - Test error scenarios (invalid tenant, etc.)

5. **Test send_email_task**
   - Test successful email sending
   - Test email validation
   - Test retry logic
   - Test error handling
   - Test with mock SMTP backend

6. **Test generate_report_task**
   - Test PDF generation
   - Test Excel generation
   - Test CSV generation
   - Test file storage
   - Test progress tracking
   - Test timeouts

7. **Test send_notification_task**
   - Test push notifications
   - Test SMS notifications
   - Test in-app notifications
   - Test error handling
   - Test retry logic

8. **Test task autodiscovery**
   - Verify tasks are registered
   - Check task naming
   - Verify task accessibility

9. **Integration tests**
   - Test end-to-end task execution
   - Test with real Celery worker (optional)
   - Test with CELERY_ALWAYS_EAGER

10. **Performance tests**
    - Test task execution time
    - Test with large data sets
    - Test concurrent execution
    - Test resource usage

### Test Directory Structure
```
backend/tests/
└── test_tasks/
    ├── __init__.py
    ├── conftest.py          # Fixtures
    ├── test_base_task.py    # BaseTask tests
    ├── test_tenant_task.py  # TenantAwareTask tests
    ├── test_email_tasks.py  # Email task tests
    ├── test_report_tasks.py # Report task tests
    └── test_notification_tasks.py  # Notification tests
```

### Test Configuration
| Setting | Value | Purpose |
|---------|-------|---------|
| CELERY_ALWAYS_EAGER | True | Synchronous execution |
| CELERY_EAGER_PROPAGATES_EXCEPTIONS | True | Show exceptions |
| EMAIL_BACKEND | 'django.core.mail.backends.locmem.EmailBackend' | Mock email |

### Pytest Fixtures Needed
| Fixture | Purpose |
|---------|---------|
| celery_app | Celery application |
| tenant | Test tenant |
| user | Test user |
| email_data | Email test data |
| report_data | Report test data |

### BaseTask Tests
| Test | Purpose |
|------|---------|
| test_task_creation | Task can be instantiated |
| test_on_success_called | Hook executes on success |
| test_on_failure_called | Hook executes on failure |
| test_on_retry_called | Hook executes on retry |
| test_logging | Logs are generated |

### TenantAwareTask Tests
| Test | Purpose |
|------|---------|
| test_tenant_retrieval | Gets tenant from ID |
| test_schema_switch | Switches to tenant schema |
| test_schema_restore | Restores public schema |
| test_invalid_tenant | Handles missing tenant |
| test_error_restores_schema | Schema restored on error |

### Email Task Tests
| Test | Purpose |
|------|---------|
| test_send_email_success | Sends email successfully |
| test_send_email_invalid | Validates email address |
| test_send_email_retry | Retries on transient error |
| test_send_email_failure | Handles permanent failure |
| test_email_with_attachment | Sends with attachments |
| test_html_email | Sends HTML email |

### Report Task Tests
| Test | Purpose |
|------|---------|
| test_generate_pdf_report | Generates PDF |
| test_generate_excel_report | Generates Excel |
| test_generate_csv_report | Generates CSV |
| test_report_storage | Stores file correctly |
| test_report_progress | Updates progress |
| test_report_timeout | Handles timeout |

### Notification Task Tests
| Test | Purpose |
|------|---------|
| test_send_push | Sends push notification |
| test_send_sms | Sends SMS |
| test_send_in_app | Creates in-app notification |
| test_notification_retry | Retries on failure |

### Test Utilities
Create helper functions:
| Function | Purpose |
|----------|---------|
| create_test_tenant | Create tenant for testing |
| create_test_task | Create mock task |
| assert_task_called | Verify task called |
| assert_schema_correct | Verify schema state |
| mock_email_backend | Mock email sending |

### Mocking Strategy
| Component | Mocking Approach |
|-----------|------------------|
| Email Backend | Use locmem backend |
| SMS Service | Mock API client |
| File Storage | Use temporary storage |
| Database | Use test database |
| External APIs | Use responses library |

### Test Scenarios
| Scenario | Tests |
|----------|-------|
| Happy Path | All operations succeed |
| Validation Errors | Invalid inputs handled |
| Transient Errors | Retries work correctly |
| Permanent Errors | Fail appropriately |
| Concurrent Execution | No race conditions |
| Resource Limits | Handles timeouts |

### Coverage Goals
| Component | Target Coverage |
|-----------|----------------|
| Base Classes | 100% |
| Task Functions | 90%+ |
| Error Handlers | 95%+ |
| Happy Paths | 100% |
| Edge Cases | 80%+ |

### Running Tests
Commands to run tests:
```bash
# All task tests
pytest tests/test_tasks/

# Specific test file
pytest tests/test_tasks/test_email_tasks.py

# With coverage
pytest tests/test_tasks/ --cov=apps.core.tasks

# Verbose output
pytest tests/test_tasks/ -v
```

### Continuous Integration
| Aspect | Configuration |
|--------|---------------|
| Test Runner | pytest |
| Coverage Tool | pytest-cov |
| CI Platform | GitHub Actions / GitLab CI |
| Coverage Threshold | 90% |

### Expected Outcome
- Comprehensive test suite created
- All base classes tested
- All common tasks tested
- High test coverage achieved
- Tests pass consistently
- CI/CD integration ready

### Verification Checklist
- [ ] Test directory structure created
- [ ] conftest.py with fixtures created
- [ ] BaseTask tests implemented
- [ ] TenantAwareTask tests implemented
- [ ] Email task tests implemented
- [ ] Report task tests implemented
- [ ] Notification task tests implemented
- [ ] All tests pass
- [ ] Coverage above 90%
- [ ] Tests run in CI/CD
- [ ] Documentation updated with test info

---

## Testing Best Practices

### Test Organization
| Principle | Implementation |
|-----------|----------------|
| One test per scenario | Focused tests |
| Descriptive names | test_send_email_with_invalid_address |
| Arrange-Act-Assert | Clear test structure |
| Independent tests | No test dependencies |

### Fixture Design
| Fixture | Scope | Purpose |
|---------|-------|---------|
| celery_app | Session | Reuse across tests |
| tenant | Function | Fresh per test |
| user | Function | Fresh per test |
| db_transaction | Function | Rollback after test |

### Mock vs Real
| Component | Approach | Rationale |
|-----------|----------|-----------|
| Database | Real (test DB) | Integration testing |
| Email | Mock | Fast, no external deps |
| File System | Real (temp) | Test actual I/O |
| External APIs | Mock | Reliability, speed |

### Test Data Management
| Strategy | Purpose |
|----------|---------|
| Factories | Generate test data |
| Fixtures | Reusable data sets |
| Faker | Realistic fake data |
| Seed Data | Known data sets |

### Assertion Strategies
| Type | Example |
|------|---------|
| Equality | assert result == expected |
| Exception | with pytest.raises(Exception) |
| Mock Calls | mock.assert_called_once() |
| Database | assert Model.objects.count() == 1 |

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 45 | Export All Tasks | Complete __init__.py |
| 46 | Test Task Infrastructure | Comprehensive test suite |

### Group C Completion Status
All task infrastructure complete:
✓ Tasks module created
✓ Base task classes implemented
✓ Common tasks created
✓ Tasks exported
✓ Tests implemented

### File Structure Complete
```
backend/apps/core/tasks/
├── __init__.py              # All exports
├── base.py                  # Base classes
├── email_tasks.py           # Email tasks
├── report_tasks.py          # Report tasks
└── notification_tasks.py    # Notification tasks

backend/tests/test_tasks/
├── __init__.py
├── conftest.py
├── test_base_task.py
├── test_tenant_task.py
├── test_email_tasks.py
├── test_report_tasks.py
└── test_notification_tasks.py
```

### Tasks Available for Use
| Task | Purpose | Base Class |
|------|---------|------------|
| send_email_task | Async email sending | TenantAwareTask |
| generate_report_task | Report generation | TenantAwareTask |
| send_notification_task | Notifications | TenantAwareTask |

### Test Coverage
- Base classes: 100%
- Common tasks: 90%+
- Error scenarios: 95%+
- Total coverage: 90%+

### Next Steps
Proceed to [Group-D_Celery-Beat-Scheduling](../Group-D_Celery-Beat-Scheduling/) to configure periodic task scheduling with Celery Beat.

---

## Notes for AI Agents

1. **Export All:** Ensure every public task is in __all__
2. **Test Coverage:** Aim for 90%+ coverage
3. **Mock Appropriately:** Mock external services, use real database
4. **Eager Mode:** Use CELERY_ALWAYS_EAGER for synchronous testing
5. **Fixtures:** Create reusable fixtures in conftest.py
6. **Tenant Tests:** Test schema switching thoroughly
7. **Error Scenarios:** Test all error paths
8. **Integration Tests:** Test end-to-end flows
9. **CI/CD:** Integrate tests into pipeline
10. **Documentation:** Document test setup and running
