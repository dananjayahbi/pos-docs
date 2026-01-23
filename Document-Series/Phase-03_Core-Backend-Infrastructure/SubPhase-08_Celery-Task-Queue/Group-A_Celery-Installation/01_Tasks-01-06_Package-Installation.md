# Tasks 01-06: Package Installation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 08 - Celery Task Queue  
> **Group:** A - Celery Installation  
> **Document:** 01 of 04  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-07-08_Django-App-Registration.md](02_Tasks-07-08_Django-App-Registration.md)

---

## Document Overview

This document covers the installation of all Celery-related packages required for the LankaCommerce Cloud task queue system. These packages include the core Celery library, Redis client, scheduling extensions, result storage backend, and monitoring tools.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Install celery Package | Simple |
| 02 | Pin Celery Version | Simple |
| 03 | Install redis Package | Simple |
| 04 | Install django-celery-beat | Simple |
| 05 | Install django-celery-results | Simple |
| 06 | Install flower | Simple |

---

## Task 01: Install celery Package

### Overview
Install the core Celery distributed task queue library that enables asynchronous task processing for the LankaCommerce Cloud platform.

### Dependencies
- None (first task in this subphase)

### Instructions

1. **Install Celery via pip**
   - Install the celery package in your Python environment
   - Ensure you're in the backend directory
   - Use the virtual environment or Docker container for installation

2. **Verify installation**
   - Check that celery is successfully installed
   - Verify the celery command is available
   - Check the installed version

### Package Information
| Property | Value |
|----------|-------|
| Package Name | celery |
| Purpose | Distributed task queue framework |
| Use Case | Background jobs, async operations |
| Documentation | https://docs.celeryq.dev/ |

### Expected Outcome
- Celery package installed in Python environment
- Celery command-line tool available
- Ready for configuration

### Verification Checklist
- [ ] Celery package is installed successfully
- [ ] Can import celery in Python
- [ ] Celery CLI shows version information
- [ ] No installation errors occurred

---

## Task 02: Pin Celery Version

### Overview
Pin the Celery version in requirements file to ensure consistent deployments across all environments and prevent unexpected breaking changes.

### Dependencies
- Task 01: Install celery Package

### Instructions

1. **Determine installed version**
   - Check the exact version of Celery that was installed
   - Note the full version number (major.minor.patch)

2. **Add to requirements file**
   - Add celery with version pin to requirements file
   - Use exact version pinning for production stability
   - Include in the appropriate requirements file (base.txt or production.txt)

3. **Version specification format**
   - Use exact version: `celery==5.3.4` (example version)
   - Avoid loose pinning like `celery>=5.0`
   - Document why this specific version was chosen

### Version Pinning Strategy
| Format | Example | Use Case |
|--------|---------|----------|
| Exact pin | `celery==5.3.4` | Production (recommended) |
| Minor version | `celery~=5.3.0` | Allow patch updates |
| Range | `celery>=5.3,<6.0` | Development only |

### Recommended Version (as of 2026)
- Use Celery 5.3.x or later for Python 3.12+ support
- Avoid Celery 4.x (deprecated)
- Check compatibility with Django 5.x

### Expected Outcome
- Celery version pinned in requirements file
- Version documented and reproducible
- All environments will use the same version

### Verification Checklist
- [ ] Version is pinned in requirements file
- [ ] Version format uses exact pinning
- [ ] Version is compatible with Python 3.12+
- [ ] Version is compatible with Django 5.x

---

## Task 03: Install redis Package

### Overview
Install the Redis Python client library that enables Celery to communicate with Redis, which serves as both the message broker and result backend.

### Dependencies
- Task 01: Install celery Package

### Instructions

1. **Install redis package**
   - Install the redis Python client library
   - This is required for Celery to connect to Redis
   - Ensure compatibility with Celery version

2. **Verify Redis client**
   - Check that redis package is installed
   - Verify you can import redis in Python
   - Test basic Redis connection (if Redis server is running)

3. **Pin version in requirements**
   - Add redis with version pin to requirements file
   - Use stable version compatible with Celery

### Package Information
| Property | Value |
|----------|-------|
| Package Name | redis |
| Purpose | Python Redis client library |
| Use Case | Broker and result backend connection |
| Documentation | https://redis-py.readthedocs.io/ |

### Redis Connection Requirements
- Redis server must be running (Docker service)
- Default port: 6379
- Connection string format: `redis://host:port/db`
- For LCC: `redis://redis:6379/0` (Docker network)

### Expected Outcome
- Redis Python client installed
- Can connect to Redis server
- Ready for Celery broker configuration

### Verification Checklist
- [ ] Redis package is installed successfully
- [ ] Can import redis in Python
- [ ] Version is compatible with Celery
- [ ] Redis server is accessible

---

## Task 04: Install django-celery-beat

### Overview
Install the django-celery-beat extension that provides database-backed periodic task scheduling, allowing dynamic schedule management through Django admin interface.

### Dependencies
- Task 01: Install celery Package

### Instructions

1. **Install django-celery-beat**
   - Install the django-celery-beat package
   - This enables database-backed periodic task scheduling
   - Allows runtime schedule modification without code changes

2. **Verify installation**
   - Check that django_celery_beat can be imported
   - Verify package dependencies are satisfied

3. **Pin version in requirements**
   - Add django-celery-beat with version pin
   - Ensure compatibility with Django 5.x and Celery version

### Package Information
| Property | Value |
|----------|-------|
| Package Name | django-celery-beat |
| Purpose | Database-backed periodic task scheduler |
| Use Case | Cron-like scheduling, dynamic schedules |
| Documentation | https://django-celery-beat.readthedocs.io/ |

### Key Features
- Store periodic tasks in Django database
- Manage schedules via Django admin
- Crontab and interval scheduling
- Enable/disable tasks without restart
- Multi-tenant schedule isolation

### Expected Outcome
- django-celery-beat package installed
- Ready to add to INSTALLED_APPS
- Database models available for scheduling

### Verification Checklist
- [ ] django-celery-beat is installed successfully
- [ ] Can import django_celery_beat
- [ ] Compatible with Django 5.x
- [ ] Compatible with installed Celery version

---

## Task 05: Install django-celery-results

### Overview
Install the django-celery-results extension that stores Celery task results in the Django database, enabling result persistence and querying through Django ORM.

### Dependencies
- Task 01: Install celery Package

### Instructions

1. **Install django-celery-results**
   - Install the django-celery-results package
   - This enables database storage for task results
   - Allows querying task history through Django admin

2. **Verify installation**
   - Check that django_celery_results can be imported
   - Verify package dependencies are satisfied

3. **Pin version in requirements**
   - Add django-celery-results with version pin
   - Ensure compatibility with Django 5.x and Celery version

### Package Information
| Property | Value |
|----------|-------|
| Package Name | django-celery-results |
| Purpose | Store task results in Django database |
| Use Case | Result persistence, task history, monitoring |
| Documentation | https://django-celery-results.readthedocs.io/ |

### Key Features
- Store task results in database
- Query results using Django ORM
- View task history in Django admin
- Result retention policies
- Tenant-isolated task results

### Result Storage Options
| Backend | Pros | Cons |
|---------|------|------|
| django-db | ORM integration, tenant isolation | Slower than Redis |
| redis | Fast, ephemeral | No historical data |
| database+redis | Best of both | Requires both |

### Expected Outcome
- django-celery-results package installed
- Ready to add to INSTALLED_APPS
- Database models available for results

### Verification Checklist
- [ ] django-celery-results is installed successfully
- [ ] Can import django_celery_results
- [ ] Compatible with Django 5.x
- [ ] Compatible with installed Celery version

---

## Task 06: Install flower

### Overview
Install Flower, a web-based monitoring tool for Celery that provides real-time task monitoring, worker management, and task statistics visualization.

### Dependencies
- Task 01: Install celery Package

### Instructions

1. **Install flower package**
   - Install the flower monitoring tool
   - This provides web UI for Celery monitoring
   - Essential for production task queue visibility

2. **Verify installation**
   - Check that flower command is available
   - Verify you can import flower in Python

3. **Pin version in requirements**
   - Add flower with version pin to requirements file
   - Use stable version compatible with Celery

### Package Information
| Property | Value |
|----------|-------|
| Package Name | flower |
| Purpose | Web-based Celery monitoring |
| Use Case | Task monitoring, worker management |
| Documentation | https://flower.readthedocs.io/ |

### Flower Features
| Feature | Purpose |
|---------|---------|
| Real-time monitoring | Track tasks as they execute |
| Task history | View completed tasks |
| Worker management | Monitor/control workers |
| Task statistics | Success/failure rates |
| Task details | Arguments, results, tracebacks |
| Task retry | Manually retry failed tasks |

### Flower Access Considerations
- Requires authentication in production
- Should be behind reverse proxy
- Consider separate Docker service
- Restrict access to authorized users

### Expected Outcome
- Flower package installed
- Flower command available
- Ready for configuration and deployment

### Verification Checklist
- [ ] Flower is installed successfully
- [ ] Flower command is available
- [ ] Can import flower in Python
- [ ] Version is compatible with Celery

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 01 | Install celery Package | Celery core library |
| 02 | Pin Celery Version | Version in requirements |
| 03 | Install redis Package | Redis client library |
| 04 | Install django-celery-beat | Scheduling extension |
| 05 | Install django-celery-results | Result storage backend |
| 06 | Install flower | Monitoring tool |

### Packages Installed
```
celery==5.3.4 (example version)
redis==5.0.1 (example version)
django-celery-beat==2.5.0 (example version)
django-celery-results==2.5.1 (example version)
flower==2.0.1 (example version)
```

### Environment State
- All Celery packages installed
- Requirements file updated with version pins
- Python environment ready for configuration
- Ready to proceed with Django app registration

### Next Steps
Proceed to [02_Tasks-07-08_Django-App-Registration.md](02_Tasks-07-08_Django-App-Registration.md) to register Celery Django apps in INSTALLED_APPS.

---

## Notes for AI Agents

1. **Package Installation:** Install all packages before proceeding to configuration
2. **Version Pinning:** Always use exact version pins for production stability
3. **Compatibility:** Verify Django 5.x and Python 3.12+ compatibility
4. **Redis Dependency:** Ensure Redis server is running in Docker
5. **Virtual Environment:** Install in backend virtual environment or Docker container
6. **Requirements File:** Use appropriate requirements file (base.txt or production.txt)
7. **No Code:** This document provides WHAT to do, not HOW to code it
