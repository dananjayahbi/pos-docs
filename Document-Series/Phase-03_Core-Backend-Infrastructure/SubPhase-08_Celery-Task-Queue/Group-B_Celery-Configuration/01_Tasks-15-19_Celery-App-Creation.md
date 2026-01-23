# Tasks 15-19: Celery App Creation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** B - Celery Configuration  
> **Document:** 01 of 03  
> **Tasks Covered:** 15, 16, 17, 18, 19

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-20-28_Celery-Settings.md](02_Tasks-20-28_Celery-Settings.md)

---

## Document Overview

This document covers the creation of the Celery application instance, integration with Django settings, and task autodiscovery configuration for the LankaCommerce Cloud platform.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Create celery.py File | Simple |
| 16 | Create Celery App Instance | Medium |
| 17 | Configure Django Settings | Medium |
| 18 | Configure Task Autodiscover | Medium |
| 19 | Update config __init__.py | Simple |

---

## Task 15: Create celery.py File

### Overview
Create the main celery.py file in the Django project configuration directory that will contain the Celery application initialization code.

### Dependencies
- Group A: All installation tasks complete

### Instructions

1. **Locate project configuration directory**
   - Find your Django project's configuration directory
   - For LCC: `backend/config/`
   - This is where settings.py or settings module resides

2. **Create celery.py file**
   - Create a new file named `celery.py` in the config directory
   - This file will contain Celery application setup
   - Keep it separate from settings for clarity

3. **File purpose and structure**
   - This file initializes the Celery application
   - Configures integration with Django
   - Sets up task autodiscovery
   - Exports celery_app for use throughout project

### File Location
```
backend/
├── config/
│   ├── __init__.py
│   ├── celery.py          # Create this file
│   ├── urls.py
│   └── settings/
│       ├── base.py
│       ├── development.py
│       └── production.py
```

### Purpose of celery.py
| Responsibility | Description |
|----------------|-------------|
| App Initialization | Create Celery application instance |
| Django Integration | Configure Celery to use Django settings |
| Task Discovery | Automatically find tasks in all apps |
| Configuration | Load Celery settings from Django |

### Expected Outcome
- celery.py file exists in config directory
- Ready for Celery application code
- Positioned for Django integration

### Verification Checklist
- [ ] celery.py file created in config directory
- [ ] File is in same directory as settings module
- [ ] File is ready for Celery app initialization code
- [ ] Path is correct: backend/config/celery.py

---

## Task 16: Create Celery App Instance

### Overview
Initialize the Celery application instance with appropriate configuration for the LankaCommerce Cloud project, including app naming and Django settings integration.

### Dependencies
- Task 15: Create celery.py File

### Instructions

1. **Import required modules**
   - Import os module for environment variables
   - Import Celery class from celery package
   - Import Django setup function

2. **Set Django settings module**
   - Set DJANGO_SETTINGS_MODULE environment variable
   - Point to your Django settings module
   - For LCC: 'config.settings.development' or 'config.settings.production'
   - Use environment-specific settings

3. **Initialize Django**
   - Call Django setup function
   - This ensures Django is ready before Celery starts
   - Required for Django models and settings access

4. **Create Celery app instance**
   - Create Celery application instance
   - Provide app name (e.g., 'lankacommerce_cloud' or 'lcc')
   - This name appears in logs and monitoring tools

5. **Document the app instance**
   - Add docstring explaining purpose
   - Document app name choice
   - Include usage notes

### Celery App Parameters
| Parameter | Value | Purpose |
|-----------|-------|---------|
| App Name | lankacommerce_cloud | Identifies app in logs |
| Main Module | __name__ | Current module reference |
| Broker | Set via settings | Redis URL |
| Backend | Set via settings | Result storage |

### App Naming Considerations
| Option | Pros | Cons |
|--------|------|------|
| Project Name | Clear, descriptive | Longer |
| Abbreviation | Shorter | Less clear |
| Generic | Simple | Not specific |

Recommendation: Use 'lankacommerce_cloud' or 'lcc' for clarity

### Expected Outcome
- Celery application instance created
- Django settings module configured
- App properly named
- Ready for configuration

### Verification Checklist
- [ ] Celery app instance created
- [ ] App has meaningful name
- [ ] Django settings module is set
- [ ] Django setup is called
- [ ] Can import celery_app from module

---

## Task 17: Configure Django Settings

### Overview
Configure the Celery application to load all configuration from Django settings using the namespace pattern, enabling centralized configuration management.

### Dependencies
- Task 16: Create Celery App Instance

### Instructions

1. **Configure settings namespace**
   - Tell Celery to read configuration from Django settings
   - Use 'CELERY' as the namespace prefix
   - This means settings like CELERY_BROKER_URL in Django

2. **Call config_from_object method**
   - Use the config_from_object method on Celery app
   - Pass Django settings module reference
   - Specify the namespace parameter as 'CELERY'

3. **Understand namespace pattern**
   - All Celery settings in Django must start with 'CELERY_'
   - For example: CELERY_BROKER_URL, CELERY_RESULT_BACKEND
   - Celery strips the prefix when reading settings

4. **Benefits of namespace approach**
   - Clear separation between Django and Celery settings
   - Easy to identify Celery configuration
   - Prevents naming conflicts
   - Standard Django settings pattern

### Configuration Loading
| Method | Purpose |
|--------|---------|
| config_from_object | Load settings from Django |
| namespace | Prefix for Celery settings |
| django.conf:settings | Django settings object |

### Namespace Pattern Examples
| Django Setting | Celery Setting |
|----------------|----------------|
| CELERY_BROKER_URL | broker_url |
| CELERY_RESULT_BACKEND | result_backend |
| CELERY_TIMEZONE | timezone |
| CELERY_TASK_SERIALIZER | task_serializer |

### Why Use Namespace?
| Benefit | Explanation |
|---------|-------------|
| Organization | Group all Celery settings together |
| Clarity | Obvious which settings are for Celery |
| Compatibility | Standard Django pattern |
| Flexibility | Easy to override per environment |

### Expected Outcome
- Celery configured to read from Django settings
- Uses CELERY_ namespace prefix
- Ready to add Celery settings to Django configuration
- Centralized configuration

### Verification Checklist
- [ ] config_from_object is called on Celery app
- [ ] Django settings module is referenced
- [ ] Namespace is set to 'CELERY'
- [ ] Configuration loading is properly set up
- [ ] Ready to add CELERY_* settings to Django

---

## Task 18: Configure Task Autodiscover

### Overview
Configure Celery to automatically discover and register tasks from all installed Django applications, eliminating the need for manual task imports.

### Dependencies
- Task 17: Configure Django Settings

### Instructions

1. **Call autodiscover_tasks method**
   - Use the autodiscover_tasks method on Celery app
   - This enables automatic task discovery
   - Celery will look for tasks.py in each app

2. **Understand discovery mechanism**
   - Celery looks for tasks.py file in each Django app
   - Also looks for tasks/ directory with __init__.py
   - Automatically imports and registers all tasks
   - Works with Django's INSTALLED_APPS

3. **Task file naming conventions**
   - Single file: tasks.py in app root
   - Multiple files: tasks/ directory with modules
   - All task files are discovered automatically

4. **Discovery process**
   - Celery reads INSTALLED_APPS from Django settings
   - For each app, looks for tasks module
   - Imports all tasks found
   - Registers tasks with Celery app

### Task Discovery Patterns
| Pattern | Structure | Use Case |
|---------|-----------|----------|
| Single File | app/tasks.py | Simple apps, few tasks |
| Task Package | app/tasks/__init__.py | Many tasks, organized |
| Submodules | app/tasks/email_tasks.py | Categorized tasks |

### What Gets Discovered
Celery discovers:
- Functions decorated with @shared_task
- Functions decorated with @app.task
- Task classes inheriting from Task
- All modules named tasks.py or in tasks/

### Discovery Scope
| App Location | Discovered |
|--------------|-----------|
| Django apps in INSTALLED_APPS | Yes |
| Third-party apps | Yes, if they have tasks |
| Project apps | Yes |
| Non-INSTALLED_APPS | No |

### Benefits of Autodiscovery
| Benefit | Explanation |
|---------|-------------|
| Convenience | No manual imports needed |
| Maintainability | Add tasks without updating imports |
| Consistency | Standard location for tasks |
| Scalability | Works with many apps |

### Expected Outcome
- Autodiscovery configured
- Celery will find tasks in all Django apps
- No manual task registration needed
- Ready to create tasks

### Verification Checklist
- [ ] autodiscover_tasks is called on Celery app
- [ ] No arguments passed (uses INSTALLED_APPS)
- [ ] Celery will look for tasks.py in each app
- [ ] Task discovery is automatic
- [ ] Ready to create task modules

---

## Task 19: Update config __init__.py

### Overview
Export the Celery application instance from the config package's __init__.py file, making it available for import throughout the project and ensuring it loads when Django starts.

### Dependencies
- Task 16: Create Celery App Instance
- Task 17: Configure Django Settings
- Task 18: Configure Task Autodiscover

### Instructions

1. **Open config/__init__.py**
   - Locate the config package's __init__.py file
   - This file may already exist with other content
   - You'll add Celery import here

2. **Import celery_app**
   - Import the celery_app instance from config.celery
   - This ensures Celery is initialized when Django loads
   - Makes celery_app available as config.celery_app

3. **Add to __all__ export**
   - If __all__ exists, add 'celery_app' to it
   - If __all__ doesn't exist, create it
   - This explicitly exports celery_app from package

4. **Add docstring or comment**
   - Document why celery_app is imported here
   - Explain that this ensures Celery loads with Django
   - Note the shared_task decorator requirement

### Import Purpose
| Reason | Explanation |
|--------|-------------|
| Django Integration | Loads when Django starts |
| Shared Tasks | Enables @shared_task decorator |
| Accessibility | Makes celery_app importable |
| Auto-loading | Ensures Celery initializes |

### File Structure
```python
# config/__init__.py

# Import celery_app to ensure it's loaded when Django starts
# This makes @shared_task decorator work correctly
from .celery import celery_app

__all__ = ['celery_app']
```

### Import Location Importance
| Location | Effect |
|----------|--------|
| config/__init__.py | Loads with Django (correct) |
| apps/ files | May not load early enough |
| views.py | Too late, not automatic |

### Shared Task Requirement
For @shared_task to work:
- Celery app must be imported somewhere
- config/__init__.py is the standard location
- Django loads config package on startup
- Ensures Celery is ready for task definitions

### Expected Outcome
- celery_app is imported in config/__init__.py
- Celery initializes when Django starts
- @shared_task decorator works throughout project
- celery_app is accessible via config.celery_app

### Verification Checklist
- [ ] celery_app is imported in config/__init__.py
- [ ] Import is from .celery (relative import)
- [ ] __all__ includes 'celery_app'
- [ ] File has comment explaining purpose
- [ ] Can import celery_app from config package
- [ ] Django startup includes Celery initialization

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 15 | Create celery.py File | File created in config/ |
| 16 | Create Celery App Instance | Celery app initialized |
| 17 | Configure Django Settings | Settings integration configured |
| 18 | Configure Task Autodiscover | Task discovery enabled |
| 19 | Update config __init__.py | celery_app exported |

### File Structure Created
```
backend/
├── config/
│   ├── __init__.py          # Exports celery_app
│   ├── celery.py            # Celery app definition
│   └── settings/
│       └── ...
```

### Celery Application Status
- ✓ Celery app instance created
- ✓ Configured to use Django settings with CELERY_ namespace
- ✓ Task autodiscovery enabled for all Django apps
- ✓ Exported from config package for project-wide access
- ✓ Ready for Celery settings configuration

### Configuration Pattern
- Settings loaded from Django using namespace='CELERY'
- Tasks discovered automatically from INSTALLED_APPS
- Celery app accessible as config.celery_app
- @shared_task decorator will work throughout project

### Next Steps
Proceed to [02_Tasks-20-28_Celery-Settings.md](02_Tasks-20-28_Celery-Settings.md) to configure all Celery settings in Django.

---

## Notes for AI Agents

1. **File Location:** celery.py goes in config/ directory, same level as settings/
2. **App Naming:** Use descriptive name for the project
3. **Namespace:** Always use 'CELERY' namespace with Django settings
4. **Autodiscovery:** No arguments needed, uses INSTALLED_APPS automatically
5. **Export Required:** Must import celery_app in config/__init__.py
6. **Shared Task:** Export enables @shared_task decorator usage
7. **Django Setup:** Must call django.setup() before Celery operations
