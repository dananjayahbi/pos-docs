# Tasks 29-30: Settings Integration & Testing

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** B - Celery Configuration  
> **Document:** 03 of 03  
> **Tasks Covered:** 29, 30

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-20-28_Celery-Settings.md](02_Tasks-20-28_Celery-Settings.md)
- **→ Next Group:** [../Group-C_Task-Infrastructure/](../Group-C_Task-Infrastructure/)

---

## Document Overview

This document covers the integration of Celery settings into Django's main settings files and testing the complete Celery configuration to ensure everything works correctly before proceeding to task implementation.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Import Celery Settings | Simple |
| 30 | Test Celery Config | Medium |

---

## Task 29: Import Celery Settings

### Overview
Import the Celery settings from the dedicated celery.py settings file into Django's main settings module, ensuring Celery configuration is loaded with Django.

### Dependencies
- Task 20: Create Celery Settings File
- Tasks 21-28: All Celery settings configured

### Instructions

1. **Locate base settings file**
   - Find your main Django settings file
   - For LCC: `backend/config/settings/base.py`
   - This is where common settings are defined

2. **Import Celery settings**
   - Add import statement at the end of base.py
   - Import all settings from config.settings.celery
   - Use wildcard import or explicit imports

3. **Verify import location**
   - Import should be at the bottom of base.py
   - After all other settings
   - Allows Celery settings to reference other settings

4. **Document the import**
   - Add comment explaining Celery settings import
   - Note that settings use CELERY_ prefix
   - Document settings file location

### Import Methods
| Method | Example | Use Case |
|--------|---------|----------|
| Wildcard | `from .celery import *` | Import all settings |
| Explicit | Import specific settings | Fine control |
| Module | Import as module | Namespaced access |

Recommended: Wildcard import for simplicity

### Import Location in base.py
Place import at end of file:
```python
# ... other Django settings ...

# Celery Configuration
# Import all Celery settings from dedicated file
from .celery import *
```

### Settings Inheritance
| File | Purpose | Celery Settings |
|------|---------|-----------------|
| base.py | Common settings | Imported here |
| development.py | Dev overrides | Can override |
| production.py | Prod overrides | Can override |

### Environment-Specific Overrides
Development might override:
- CELERY_BROKER_URL (local Redis)
- CELERY_TASK_ALWAYS_EAGER (synchronous testing)

Production might override:
- CELERY_BROKER_URL (production Redis with password)
- CELERY_RESULT_EXPIRES (longer retention)

### Expected Outcome
- Celery settings imported into Django
- All CELERY_* settings available
- Settings loaded when Django starts
- Ready for Celery application to use

### Verification Checklist
- [ ] Import statement added to base.py
- [ ] Import is at end of file
- [ ] Import statement is documented
- [ ] No import errors when loading settings
- [ ] Can access CELERY_* settings

---

## Task 30: Test Celery Config

### Overview
Verify that the complete Celery configuration is working correctly by testing the connection, settings loading, task discovery, and basic task execution.

### Dependencies
- Task 29: Import Celery Settings
- Task 19: Update config __init__.py
- All previous Group B tasks complete

### Instructions

1. **Test Celery app import**
   - Open Django shell
   - Import celery_app from config
   - Verify no import errors
   - Check app is properly initialized

2. **Verify settings loaded**
   - Check that Celery app has settings configured
   - Verify broker URL is correct
   - Verify result backend is configured
   - Check timezone is set

3. **Test broker connection**
   - Verify Celery can connect to Redis
   - Use Celery inspect commands
   - Check broker connection status
   - Ensure no connection errors

4. **Test result backend connection**
   - If using django-db, verify tables exist
   - If using Redis, verify connection to results DB
   - Test writing and reading results
   - Ensure backend is accessible

5. **Verify task autodiscovery**
   - Check that Celery finds installed apps
   - Verify autodiscovery is configured
   - List registered tasks (should be empty initially)
   - Confirm autodiscovery mechanism works

6. **Create simple test task**
   - Create a minimal test task
   - Use @shared_task decorator
   - Place in a tasks.py file
   - Import and verify task is registered

7. **Test task execution (optional)**
   - Call the test task asynchronously
   - Verify task is queued
   - Check task result
   - Confirm end-to-end flow works

8. **Review configuration**
   - Double-check all settings
   - Verify values are appropriate
   - Ensure security best practices
   - Document any issues found

### Test Checklist Categories
| Category | Tests |
|----------|-------|
| Import | Can import celery_app |
| Settings | All CELERY_* settings present |
| Broker | Connection to Redis successful |
| Backend | Result storage accessible |
| Discovery | Autodiscovery configured |
| Tasks | Test task registered |
| Execution | Task runs successfully |

### Django Shell Test Commands
Open Django shell and test:
1. Import celery_app
2. Check app.conf settings
3. Verify broker_url
4. Verify result_backend
5. Check timezone
6. List registered tasks
7. Test inspect commands

### Celery Inspect Commands
Use these to verify worker readiness:
| Command | Purpose |
|---------|---------|
| inspect active | Active tasks |
| inspect registered | Registered tasks |
| inspect stats | Worker statistics |
| inspect ping | Worker health check |

Note: Workers must be running for inspect commands

### Simple Test Task Structure
Create test task in apps/core/tasks.py:
- Use @shared_task decorator
- Simple function (e.g., add two numbers)
- Return a value
- Test task registration
- Test task execution

### Common Configuration Issues
| Issue | Symptom | Solution |
|-------|---------|----------|
| Import Error | Cannot import celery_app | Check config/__init__.py |
| Settings Not Loaded | CELERY_* not in app.conf | Check import in base.py |
| Broker Connection | Connection refused | Verify Redis running |
| Backend Error | Result storage fails | Check backend config |
| Task Not Found | Task not registered | Verify autodiscovery |

### Configuration Verification Points
| Point | Expected |
|-------|----------|
| app.conf.broker_url | redis://redis:6379/0 |
| app.conf.result_backend | django-db |
| app.conf.accept_content | ['json'] |
| app.conf.task_serializer | json |
| app.conf.result_serializer | json |
| app.conf.timezone | Asia/Colombo |
| app.conf.task_track_started | True |
| app.conf.task_time_limit | 1800 |

### Testing Without Workers
Can test configuration without running workers:
- Import celery_app
- Check settings
- Verify connections
- Register test tasks
- Don't execute tasks (requires workers)

### Expected Outcome
- All configuration tests pass
- No import or connection errors
- Settings are correctly loaded
- Ready to implement tasks
- Workers can start successfully

### Verification Checklist
- [ ] Can import celery_app successfully
- [ ] All CELERY_* settings present in app.conf
- [ ] Broker URL is correct and accessible
- [ ] Result backend is configured correctly
- [ ] Timezone is set to Asia/Colombo
- [ ] Serialization settings are JSON
- [ ] Task tracking is enabled
- [ ] Time limits are configured
- [ ] Autodiscovery is working
- [ ] Test task registers successfully
- [ ] No configuration errors or warnings

---

## Complete Configuration Review

### File Structure Verification
```
backend/
├── config/
│   ├── __init__.py          # Exports celery_app
│   ├── celery.py            # Celery app initialization
│   └── settings/
│       ├── base.py          # Imports Celery settings
│       └── celery.py        # Celery settings
```

### Settings Summary
All required settings configured:
- [x] CELERY_BROKER_URL
- [x] CELERY_RESULT_BACKEND
- [x] CELERY_ACCEPT_CONTENT
- [x] CELERY_TASK_SERIALIZER
- [x] CELERY_RESULT_SERIALIZER
- [x] CELERY_TIMEZONE
- [x] CELERY_TASK_TRACK_STARTED
- [x] CELERY_TASK_TIME_LIMIT

### Integration Points
| Component | Status |
|-----------|--------|
| Django Settings | ✓ Celery settings imported |
| Celery App | ✓ Initialized with Django |
| Config Export | ✓ celery_app exported |
| Autodiscovery | ✓ Configured for INSTALLED_APPS |
| Broker | ✓ Redis connected |
| Result Backend | ✓ Database configured |

### Security Checklist
- [x] JSON-only serialization
- [x] No pickle accepted
- [x] Broker URL from environment
- [x] Time limits configured
- [x] Appropriate timeouts set

### Sri Lanka Localization
- [x] Timezone: Asia/Colombo
- [x] Appropriate for business hours
- [x] No DST complications

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Import Celery Settings | Settings integrated in base.py |
| 30 | Test Celery Config | Configuration verified |

### Group B Completion Status
All configuration tasks complete:
✓ Celery app created
✓ Django settings configured
✓ Task autodiscovery enabled
✓ Settings imported
✓ Configuration tested

### Configuration State
- Celery application initialized
- All settings configured
- Django integration complete
- Broker and backend connected
- Ready for task implementation

### Environment Variables Required
```
CELERY_BROKER_URL=redis://redis:6379/0
REDIS_URL=redis://redis:6379/0  # If needed
```

### Next Steps
Proceed to [Group-C_Task-Infrastructure](../Group-C_Task-Infrastructure/) to create base task classes and common task implementations.

---

## Notes for AI Agents

1. **Import Location:** Import Celery settings at end of base.py
2. **Wildcard Import:** Use `from .celery import *` for simplicity
3. **Testing Order:** Test imports, then settings, then connections
4. **Worker Not Required:** Can test config without workers running
5. **Simple Test Task:** Create minimal task to verify registration
6. **Inspect Commands:** Only work if workers are running
7. **Environment Variables:** Ensure .env file has CELERY_BROKER_URL
8. **Error Handling:** Check each component systematically
9. **Documentation:** Document any configuration decisions
10. **Next Phase:** Ready to implement actual tasks in Group C
