# Tasks 67-70: Sentry Installation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 07 - Exception Handling  
> **Group:** E - Logging & Sentry  
> **Document:** 02 of 03  
> **Tasks Covered:** 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-61-66_Error-Logging-Module.md](01_Tasks-61-66_Error-Logging-Module.md)
- **→ Next Document:** [03_Tasks-71-74_Sentry-Context-Tags.md](03_Tasks-71-74_Sentry-Context-Tags.md)

---

## Document Overview

This document covers Sentry SDK installation and basic configuration.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 67 | Install sentry-sdk | Simple |
| 68 | Create Sentry Settings | Medium |
| 69 | Configure Sentry DSN | Simple |
| 70 | Configure Sample Rate | Simple |

---

## Task 67: Install sentry-sdk

Add to `backend/requirements/production.txt`:

```
sentry-sdk[django]==1.40.0
```

Install:
```bash
pip install sentry-sdk[django]
```

---

## Task 68-70: Create Sentry Settings

Create `backend/config/settings/sentry.py`:

```python
"""
Sentry Configuration

Error tracking and monitoring for production.
"""

import os
import sentry_sdk
from sentry_sdk.integrations.django import DjangoIntegration
from sentry_sdk.integrations.celery import CeleryIntegration
from sentry_sdk.integrations.redis import RedisIntegration


def init_sentry():
    """Initialize Sentry error tracking."""
    
    # Task 69: Configure Sentry DSN
    sentry_dsn = os.environ.get('SENTRY_DSN')
    
    if not sentry_dsn:
        return  # Sentry disabled if no DSN
    
    environment = os.environ.get('DJANGO_ENV', 'development')
    release = os.environ.get('GIT_COMMIT_SHA', 'unknown')
    
    # Task 70: Configure Sample Rate
    traces_sample_rate = float(os.environ.get('SENTRY_TRACES_SAMPLE_RATE', '1.0'))
    
    sentry_sdk.init(
        dsn=sentry_dsn,
        integrations=[
            DjangoIntegration(),
            CeleryIntegration(),
            RedisIntegration(),
        ],
        environment=environment,
        release=release,
        traces_sample_rate=traces_sample_rate,
        send_default_pii=False,  # Don't send personal data
        before_send=before_send_handler,
    )


def before_send_handler(event, hint):
    """
    Process events before sending to Sentry.
    
    Args:
        event: Sentry event dict
        hint: Additional context
        
    Returns:
        Modified event or None to drop
    """
    # Filter out specific exceptions if needed
    if 'exc_info' in hint:
        exc_type, exc_value, tb = hint['exc_info']
        
        # Don't send validation errors to Sentry
        if exc_type.__name__ in ['ValidationError', 'ValidationException']:
            return None
    
    return event
```

Update `backend/config/settings/production.py`:

```python
from .sentry import init_sentry

# Initialize Sentry
init_sentry()
```

---

## Environment Variables

Add to `.env`:

```bash
# Sentry Configuration
SENTRY_DSN=https://your-dsn@sentry.io/project-id
DJANGO_ENV=production
SENTRY_TRACES_SAMPLE_RATE=1.0
```

---

## Notes for AI Agents

- **DSN:** Never commit DSN to code
- **Environment:** Disable in development
- **Sample Rate:** 1.0 = 100%, 0.1 = 10%
- **Integrations:** Django, Celery, Redis
- **PII:** Don't send personal data
- **Filtering:** Filter out expected errors
