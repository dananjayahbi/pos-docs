# Tasks 01-05: Redis Package Installation

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** A - Redis Setup  
> **Document:** 01 of 03  
> **Tasks Covered:** 01, 02, 03, 04, 05

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** None (First Document)
- **→ Next Document:** [02_Tasks-06-10_Redis-Settings-URLs.md](02_Tasks-06-10_Redis-Settings-URLs.md)

---

## Document Overview

This document covers the installation of Redis-related Python packages and verification of the Redis Docker service. These are the foundational steps for implementing a Redis-based caching layer in LankaCommerce Cloud.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 01 | Install django-redis | Simple |
| 02 | Pin django-redis Version | Simple |
| 03 | Install redis Package | Simple |
| 04 | Verify Redis Running | Simple |
| 05 | Test Redis Connection | Simple |

---

## Task 01: Install django-redis

### Overview
Install the django-redis package which provides Redis cache backend for Django.

### Dependencies
- SubPhase-06 complete (Docker with Redis service)
- Python virtual environment activated

### Instructions

1. **Locate requirements file**
   - Navigate to backend/requirements/base.txt

2. **Add django-redis to requirements**
   - Add django-redis to the base requirements file
   - This package provides Redis integration for Django's cache framework

3. **Install the package**
   - Install django-redis using pip
   - Ensure installation completes successfully

### Verification
- django-redis package is installed
- Package appears in pip list output

---

## Task 02: Pin django-redis Version

### Overview
Pin the django-redis version to ensure consistent behavior across environments.

### Dependencies
- Task 01: Install django-redis

### Instructions

1. **Check current version**
   - Verify the installed django-redis version
   - Ensure version is compatible with Django 5.x

2. **Update requirements with version**
   - Pin django-redis to a specific version in base.txt
   - Use format: django-redis>=5.4.0
   - This ensures Django 5.x compatibility

3. **Document version selection**
   - Add inline comment explaining version requirement
   - Note Django 5.x compatibility requirement

### Version Requirements
- Minimum: django-redis 5.4.0
- Reason: Full Django 5.x support
- Redis protocol version 3 support

### Verification
- Version specified in base.txt
- Version meets minimum requirement
- Version note documented

---

## Task 03: Install redis Package

### Overview
Install the redis Python client library for direct Redis operations.

### Dependencies
- Task 02: Pin django-redis Version

### Instructions

1. **Add redis to requirements**
   - Add redis package to base.txt
   - This is the Python Redis client library

2. **Pin redis version**
   - Use version compatible with django-redis
   - Format: redis>=5.0.0

3. **Install the package**
   - Install redis using pip
   - Verify successful installation

4. **Document package purpose**
   - Add comment explaining redis vs django-redis
   - redis: Low-level client for custom operations
   - django-redis: Django cache backend

### Package Roles
| Package | Purpose |
|---------|---------|
| **redis** | Python Redis client for direct operations |
| **django-redis** | Django cache backend using redis |

### Verification
- redis package installed
- Version 5.0.0 or higher
- Both redis and django-redis present in pip list

---

## Task 04: Verify Redis Running

### Overview
Verify that the Redis service is running in Docker and accessible.

### Dependencies
- Task 03: Install redis Package
- Docker compose file with Redis service

### Instructions

1. **Locate docker-compose.yml**
   - Find the Docker compose configuration file
   - Verify Redis service definition exists

2. **Check Redis service configuration**
   - Verify Redis service is defined
   - Check port mapping (6379:6379)
   - Verify volume for data persistence
   - Check healthcheck configuration

3. **Start Docker services if needed**
   - Use Docker compose to start services
   - Wait for Redis to be healthy

4. **Verify Redis container running**
   - Check Docker container status
   - Verify Redis container is healthy
   - Check Redis logs for startup confirmation

5. **Verify port accessibility**
   - Ensure port 6379 is accessible
   - Check no port conflicts exist

### Expected Docker Configuration
- Service name: redis
- Image: redis:7-alpine
- Port: 6379:6379
- Volume: Redis data persistence
- Healthcheck: redis-cli ping

### Verification Checklist
- [ ] Redis service defined in docker-compose.yml
- [ ] Redis container is running
- [ ] Redis container shows healthy status
- [ ] Port 6379 is accessible
- [ ] Redis logs show successful startup

---

## Task 05: Test Redis Connection

### Overview
Test the connection to Redis from Python to ensure everything is configured correctly.

### Dependencies
- Task 04: Verify Redis Running

### Instructions

1. **Create test script location**
   - Decide on temporary test file location
   - Can use Django shell or temporary Python file

2. **Import redis library**
   - Import the redis Python client

3. **Create Redis connection**
   - Connect to Redis at localhost:6379
   - Use database 0 for initial testing

4. **Test basic operations**
   - Test PING command to verify connectivity
   - Test SET operation to write a test key
   - Test GET operation to read the test key
   - Test DEL operation to clean up test data

5. **Verify connection parameters**
   - Host: localhost (or redis in Docker network)
   - Port: 6379
   - Database: 0
   - Decode responses: True

6. **Handle connection errors**
   - Catch connection refused errors
   - Catch timeout errors
   - Log clear error messages

7. **Clean up test data**
   - Delete any test keys created
   - Close the Redis connection

### Connection Test Sequence
```
Connection Test Flow:
├── 1. Import redis
├── 2. Create StrictRedis client
├── 3. Test ping() -> Should return True
├── 4. Test set('test_key', 'test_value')
├── 5. Test get('test_key') -> Should return 'test_value'
├── 6. Test delete('test_key')
└── 7. Close connection
```

### Expected Behaviors
| Operation | Expected Result |
|-----------|----------------|
| **ping()** | Returns True or "PONG" |
| **set()** | Returns True |
| **get()** | Returns stored value |
| **delete()** | Returns 1 (key deleted) |

### Error Scenarios
| Error | Likely Cause | Solution |
|-------|--------------|----------|
| **Connection refused** | Redis not running | Start Redis container |
| **Timeout** | Port not accessible | Check firewall/network |
| **Authentication failed** | Redis requires password | Add password to connection |

### Verification Checklist
- [ ] Redis connection successful
- [ ] PING command works
- [ ] SET operation successful
- [ ] GET operation retrieves correct value
- [ ] DELETE operation works
- [ ] No error messages
- [ ] Test data cleaned up

---

## Expected Outcome After This Document

```
backend/
├── requirements/
│   └── base.txt                # django-redis>=5.4.0, redis>=5.0.0 added
└── docker-compose.yml          # Redis service verified running
```

### Package Verification
```
pip list output should show:
- django-redis     5.4.0 (or higher)
- redis            5.0.0 (or higher)
```

### Redis Service Status
- Redis container running and healthy
- Port 6379 accessible
- Connection test successful

---

## Sri Lanka-Specific Considerations

- **Hosting:** Configure Redis for local cloud hosting (SLT Data Center, Dialog Axiata)
- **Network:** Consider Sri Lanka network latency when setting timeouts
- **Backup:** Plan for Redis persistence (RDB/AOF) for business continuity
- **Timezone:** Redis uses UTC internally; application converts to Asia/Colombo

---

## Common Issues and Solutions

### Issue 1: django-redis Installation Fails
**Symptoms:** pip install error for django-redis

**Solutions:**
- Upgrade pip to latest version
- Check Python version compatibility (3.12+)
- Clear pip cache and retry
- Install from GitHub if PyPI has issues

### Issue 2: Redis Connection Refused
**Symptoms:** Connection refused when testing Redis

**Solutions:**
- Verify Redis container is running
- Check Docker network configuration
- Verify port 6379 is not in use by another service
- Check host name (localhost vs redis vs 127.0.0.1)

### Issue 3: redis Package Version Conflict
**Symptoms:** Dependency resolver reports conflicts

**Solutions:**
- Update all packages in requirements
- Check django-redis documentation for compatible redis versions
- Use pip-compile to resolve dependencies

### Issue 4: Docker Redis Not Starting
**Symptoms:** Redis container fails to start or shows unhealthy

**Solutions:**
- Check Docker logs for Redis
- Verify volume permissions
- Check available disk space
- Verify Redis image is downloaded
- Try pulling redis:7-alpine explicitly

---

## Notes for AI Agents

1. **Package Order:** Install django-redis before redis for dependency resolution
2. **Version Pinning:** Always pin exact versions in production
3. **Docker Network:** Use service name 'redis' when connecting from other containers
4. **Connection String:** redis://redis:6379/0 for Docker, redis://localhost:6379/0 for local
5. **Testing:** Use Django shell or pytest for connection testing
6. **Cleanup:** Always delete test keys after verification
7. **Documentation:** Update .env.example with Redis connection details
8. **Git Commit:** Commit requirements changes separately from Docker changes

---

## Validation Checklist

Before proceeding to the next document:

- [ ] django-redis installed and version pinned
- [ ] redis package installed and version pinned
- [ ] Both packages appear in requirements/base.txt
- [ ] Redis Docker container running
- [ ] Redis healthcheck passing
- [ ] Connection test successful from Python
- [ ] Test data cleaned up
- [ ] Changes committed to Git

---

## Next Steps

After completing these tasks:
1. Proceed to [02_Tasks-06-10_Redis-Settings-URLs.md](02_Tasks-06-10_Redis-Settings-URLs.md)
2. Configure Redis settings in Django
3. Set up environment-specific Redis URLs
