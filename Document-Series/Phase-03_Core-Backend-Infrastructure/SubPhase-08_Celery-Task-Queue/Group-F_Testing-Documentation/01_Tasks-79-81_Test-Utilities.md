# Tasks 79-81: Test Utilities

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 03  
> **Tasks Covered:** 79, 80, 81

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-82-86_Task-Tests.md](02_Tasks-82-86_Task-Tests.md)

---

## Document Overview

This document covers the creation of test utilities, test configuration, and setup for testing Celery tasks in synchronous mode.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 79 | Create Celery Test Utils | Simple |
| 80 | Create Celery Test Settings | Simple |
| 81 | Configure CELERY_ALWAYS_EAGER | Simple |

---

## Task 79: Create Celery Test Utils

### Overview
Create utility functions and fixtures for testing Celery tasks, including tenant setup, mock services, and common test helpers.

### Dependencies
- Test infrastructure (SubPhase-07 if exists)
- pytest configured

### Instructions

1. **Create test utilities directory**
   - Create apps/core/tests/test_tasks/
   - Separate Celery tests from other tests
   - Organized structure

2. **Create test utilities file**
   - Create apps/core/tests/test_tasks/conftest.py
   - Contains pytest fixtures
   - Shared across all task tests

3. **Create tenant fixtures**
   - Fixture to create test tenant
   - Set up tenant schema
   - Switch to tenant context
   - Clean up after test

4. **Create task result fixture**
   - Fixture for task result checking
   - Wait for async results if needed
   - Extract result data

5. **Create mock service fixtures**
   - Mock email service
   - Mock SMS service
   - Mock external APIs
   - Prevents real API calls in tests

6. **Create test data fixtures**
   - Sample products
   - Sample orders
   - Sample users
   - Reusable across tests

7. **Create Celery app fixture**
   - Access to Celery app in tests
   - Can check registered tasks
   - Can inspect configuration

8. **Add utility functions**
   - Function to run task synchronously
   - Function to clear task results
   - Function to get task state
   - Helper functions

9. **Document fixture usage**
   - Docstrings for each fixture
   - Usage examples
   - Parameter descriptions

### Test Directory Structure
```
apps/core/tests/test_tasks/
├── __init__.py
├── conftest.py              # Fixtures
├── test_email_tasks.py      # Email tests
├── test_report_tasks.py     # Report tests
└── test_scheduled_tasks.py  # Scheduled tests
```

### Tenant Fixture Example
```python
@pytest.fixture
def test_tenant(db):
    """
    Create a test tenant with schema.
    
    Usage:
        def test_my_task(test_tenant):
            # test_tenant is active
            result = my_task.delay(...)
    """
    # Create tenant
    # Set up schema
    # Switch to tenant
    # Yield tenant
    # Clean up
```

### Mock Service Fixture Example
```python
@pytest.fixture
def mock_email_service(monkeypatch):
    """
    Mock email service to prevent real emails in tests.
    
    Returns dict with sent emails for verification.
    """
    sent_emails = []
    
    def mock_send(to, subject, body):
        sent_emails.append({
            'to': to,
            'subject': subject,
            'body': body,
        })
        return True
    
    # Patch email service
    monkeypatch.setattr('apps.core.services.email.send', mock_send)
    
    return sent_emails
```

### Test Data Fixture Example
```python
@pytest.fixture
def sample_product(test_tenant):
    """Create a sample product for testing."""
    from apps.inventory.models import Product
    
    return Product.objects.create(
        name='Test Product',
        sku='TEST-001',
        price=100.00,
        stock=10,
    )
```

### Celery App Fixture Example
```python
@pytest.fixture
def celery_app():
    """
    Access to Celery app for inspection.
    """
    from config import celery_app
    return celery_app
```

### Utility Functions Example
```python
def run_task_sync(task, *args, **kwargs):
    """
    Run task synchronously and return result.
    
    Args:
        task: Celery task
        *args: Task arguments
        **kwargs: Task keyword arguments
        
    Returns:
        Task result
    """
    result = task.apply(args=args, kwargs=kwargs)
    return result.get()


def clear_task_results():
    """Clear all task results from backend."""
    from celery.result import AsyncResult
    # Implementation
```

### Fixture Categories
| Category | Purpose | Examples |
|----------|---------|----------|
| Tenant | Multi-tenancy setup | test_tenant, tenant_schema |
| Mocks | Prevent external calls | mock_email, mock_sms |
| Data | Test data creation | sample_product, sample_order |
| Celery | Task testing | celery_app, task_result |
| Utilities | Helper functions | run_sync, clear_results |

### Expected Outcome
- Test utilities directory created
- conftest.py with fixtures
- Tenant fixtures available
- Mock service fixtures ready
- Test data fixtures prepared
- Utility functions implemented

### Verification Checklist
- [ ] test_tasks directory created
- [ ] conftest.py file created
- [ ] Tenant fixture implemented
- [ ] Mock service fixtures created
- [ ] Test data fixtures added
- [ ] Celery app fixture added
- [ ] Utility functions implemented
- [ ] All fixtures documented
- [ ] Fixtures tested individually

---

## Task 80: Create Celery Test Settings

### Overview
Create separate test settings for Celery that enable synchronous task execution and configure test-specific behavior.

### Dependencies
- Base Celery settings (Task 25)
- Test settings file

### Instructions

1. **Locate or create test settings**
   - File: config/settings/test.py
   - Imports from base settings
   - Overrides for testing

2. **Import base Celery settings**
   - Import from celery.py
   - Override only what's needed
   - Keep most settings same

3. **Enable synchronous execution**
   - Set CELERY_ALWAYS_EAGER = True
   - Tasks execute immediately
   - No worker needed

4. **Enable exception propagation**
   - Set CELERY_EAGER_PROPAGATES = True
   - Exceptions raised in tests
   - Easier debugging

5. **Disable result backend (optional)**
   - Can set CELERY_RESULT_BACKEND = None
   - Results not stored
   - Faster tests
   - LCC: Keep enabled for result tests

6. **Set short timeouts**
   - Reduce timeouts for tests
   - Faster failure detection
   - Don't wait full production timeout

7. **Disable retry delays (optional)**
   - Can set retry_backoff = False in tests
   - Or reduce delays
   - Faster test execution

8. **Configure test broker**
   - Can use in-memory broker
   - Or Redis for tests
   - LCC: Use Redis for consistency

9. **Document test settings**
   - Explain each override
   - Why different from production
   - Impact on tests

### Test Settings Structure
```python
# config/settings/test.py

from .base import *
from .celery import *

# Database
DATABASES = {
    'default': {
        # Test database config
    }
}

# Celery Test Settings
CELERY_ALWAYS_EAGER = True
CELERY_EAGER_PROPAGATES = True

# Optional: Faster tests
CELERY_TASK_DEFAULT_RETRY_DELAY = 0
CELERY_TASK_RETRY_BACKOFF = False

# Keep result backend for testing results
# CELERY_RESULT_BACKEND remains as configured
```

### Key Test Settings
| Setting | Value | Purpose |
|---------|-------|---------|
| CELERY_ALWAYS_EAGER | True | Sync execution |
| CELERY_EAGER_PROPAGATES | True | Raise exceptions |
| CELERY_TASK_DEFAULT_RETRY_DELAY | 0 | No delay in tests |
| CELERY_TASK_RETRY_BACKOFF | False | Disable backoff |

### CELERY_ALWAYS_EAGER Behavior
```python
# Production (ALWAYS_EAGER=False):
result = my_task.delay(arg)
# Returns AsyncResult immediately
# Task runs in worker
# Need to wait for result

# Test (ALWAYS_EAGER=True):
result = my_task.delay(arg)
# Returns EagerResult after execution
# Task runs immediately in same process
# Result available immediately
```

### Exception Propagation
```python
# With EAGER_PROPAGATES=True
def test_task_error():
    with pytest.raises(ValueError):
        my_task.delay(bad_arg)  # Exception raised directly

# With EAGER_PROPAGATES=False
def test_task_error():
    result = my_task.delay(bad_arg)
    # Exception stored in result, not raised
    assert result.failed()
```

### Test vs Production Settings
| Aspect | Production | Test |
|--------|------------|------|
| Execution | Asynchronous | Synchronous |
| Worker | Required | Not required |
| Exceptions | Stored in result | Raised directly |
| Delays | Full backoff | No/minimal delay |
| Broker | Redis | Redis (same) |
| Results | Stored | Stored (same) |

### Expected Outcome
- Test settings file created/updated
- CELERY_ALWAYS_EAGER enabled
- Exception propagation enabled
- Test-specific overrides configured
- Settings documented

### Verification Checklist
- [ ] test.py settings file exists
- [ ] Celery settings imported
- [ ] CELERY_ALWAYS_EAGER = True
- [ ] CELERY_EAGER_PROPAGATES = True
- [ ] Optional optimizations added
- [ ] Broker configured for tests
- [ ] Result backend configured
- [ ] Settings documented
- [ ] Test settings load correctly

---

## Task 81: Configure CELERY_ALWAYS_EAGER

### Overview
Ensure CELERY_ALWAYS_EAGER is properly configured and understand its implications for testing Celery tasks synchronously.

### Dependencies
- Task 80: Test settings created

### Instructions

1. **Verify ALWAYS_EAGER in test settings**
   - Check config/settings/test.py
   - CELERY_ALWAYS_EAGER = True
   - CELERY_EAGER_PROPAGATES = True

2. **Understand eager execution**
   - Tasks execute in same process
   - No worker needed
   - Synchronous execution
   - Immediate results

3. **Test eager mode behavior**
   - Run simple task test
   - Verify immediate execution
   - Check result available immediately
   - No worker should be needed

4. **Verify test runner uses test settings**
   - pytest.ini or setup.cfg
   - DJANGO_SETTINGS_MODULE=config.settings.test
   - Or --settings=config.settings.test flag

5. **Test exception propagation**
   - Create task that raises exception
   - Run in eager mode
   - Verify exception raised in test
   - Can use pytest.raises()

6. **Document limitations of eager mode**
   - Doesn't test worker behavior
   - Doesn't test async execution
   - Doesn't test broker communication
   - Doesn't test distributed aspects

7. **Plan integration tests**
   - Eager mode for unit tests
   - Real workers for integration tests
   - Use pytest markers to separate
   - Example: @pytest.mark.integration

8. **Create example test**
   - Simple task test using eager mode
   - Demonstrates synchronous execution
   - Shows result checking
   - Template for other tests

### Eager Mode Execution Flow
```
Without ALWAYS_EAGER (Production):
┌──────────┐      ┌────────┐      ┌────────┐
│   Test   │─────>│ Broker │─────>│ Worker │
└──────────┘      └────────┘      └────────┘
    │                                  │
    └──────── Wait for result ─────────┘

With ALWAYS_EAGER (Test):
┌──────────┐
│   Test   │── Execute immediately ──> Result
└──────────┘
```

### Testing Eager Mode
```python
# config/settings/test.py
CELERY_ALWAYS_EAGER = True
CELERY_EAGER_PROPAGATES = True

# Test file
def test_eager_execution(test_tenant):
    """Test that task executes immediately in eager mode."""
    from apps.core.tasks.email_tasks import send_email_task
    
    # Task executes immediately
    result = send_email_task.delay(
        to='test@example.com',
        subject='Test',
        body='Test body',
    )
    
    # Result available immediately
    assert result.successful()
    assert result.result == True  # or expected return value
```

### Exception Propagation Test
```python
def test_exception_propagation():
    """Test that exceptions are raised in eager mode."""
    from apps.core.tasks.test_tasks import failing_task
    
    with pytest.raises(ValueError, match="Test error"):
        failing_task.delay()
```

### pytest Configuration
```ini
# pytest.ini
[pytest]
DJANGO_SETTINGS_MODULE = config.settings.test
python_files = test_*.py
python_classes = Test*
python_functions = test_*
```

### Test Markers for Different Test Types
```python
# pytest.ini
[pytest]
markers =
    unit: Unit tests (run with eager mode)
    integration: Integration tests (require real workers)
    slow: Slow tests

# Test file
@pytest.mark.unit
def test_email_task(test_tenant):
    """Unit test with eager mode."""
    pass

@pytest.mark.integration
def test_distributed_task():
    """Integration test with real workers."""
    pass
```

### Eager Mode Limitations
| Aspect | Tested in Eager | Need Real Workers |
|--------|-----------------|-------------------|
| Task logic | ✅ Yes | Optional |
| Return values | ✅ Yes | Optional |
| Exceptions | ✅ Yes | Optional |
| Async execution | ❌ No | ✅ Yes |
| Worker behavior | ❌ No | ✅ Yes |
| Broker communication | ❌ No | ✅ Yes |
| Task routing | ❌ No | ✅ Yes |
| Retries (real) | ❌ No | ✅ Yes |
| Distributed execution | ❌ No | ✅ Yes |

### Test Strategy
| Test Type | Mode | Purpose |
|-----------|------|---------|
| Unit tests | Eager mode | Test task logic |
| Integration tests | Real workers | Test system integration |
| End-to-end | Real workers | Full system test |

LCC: Mostly eager mode, selective integration tests

### Expected Outcome
- ALWAYS_EAGER properly configured
- Eager mode tested and working
- Exception propagation verified
- Test runner configured
- Limitations understood
- Test strategy defined

### Verification Checklist
- [ ] CELERY_ALWAYS_EAGER = True in test.py
- [ ] CELERY_EAGER_PROPAGATES = True in test.py
- [ ] pytest uses test settings
- [ ] Simple task test passes
- [ ] Exception test works
- [ ] Limitations documented
- [ ] Test markers configured
- [ ] Integration test strategy defined
- [ ] Example tests created

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 79 | Create Celery Test Utils | Fixtures and utilities |
| 80 | Create Celery Test Settings | Test configuration |
| 81 | Configure CELERY_ALWAYS_EAGER | Synchronous testing |

### Test Infrastructure Complete
| Component | Status | Location |
|-----------|--------|----------|
| Test directory | ✅ Created | apps/core/tests/test_tasks/ |
| Test fixtures | ✅ Created | conftest.py |
| Test settings | ✅ Configured | config/settings/test.py |
| Eager mode | ✅ Enabled | CELERY_ALWAYS_EAGER=True |

### Available Test Fixtures
| Fixture | Purpose |
|---------|---------|
| test_tenant | Create test tenant with schema |
| mock_email_service | Mock email sending |
| mock_sms_service | Mock SMS sending |
| sample_product | Create test product |
| sample_order | Create test order |
| celery_app | Access Celery app |

### Test Configuration
```python
# config/settings/test.py
CELERY_ALWAYS_EAGER = True
CELERY_EAGER_PROPAGATES = True
CELERY_TASK_DEFAULT_RETRY_DELAY = 0
```

### Test Execution
```bash
# Run all tests
pytest apps/core/tests/test_tasks/

# Run specific test file
pytest apps/core/tests/test_tasks/test_email_tasks.py

# Run with coverage
pytest apps/core/tests/test_tasks/ --cov=apps.core.tasks

# Run only unit tests (eager mode)
pytest -m unit

# Run integration tests (need workers)
pytest -m integration
```

### Next Steps
Proceed to [02_Tasks-82-86_Task-Tests.md](02_Tasks-82-86_Task-Tests.md) to create comprehensive tests for all task types.

---

## Notes for AI Agents

1. **Eager Mode:** Essential for fast unit tests
2. **Fixtures:** Reusable test setup, use pytest fixtures
3. **Mocking:** Always mock external services in tests
4. **Tenants:** Always test with tenant context
5. **Isolation:** Each test should be independent
6. **Coverage:** Aim for >80% coverage on tasks
7. **Integration:** Some tests need real workers
8. **Documentation:** Document all fixtures clearly
9. **Markers:** Use pytest markers to categorize tests
10. **CI/CD:** Eager mode perfect for CI pipeline
