# Tasks 11-14: Redis Pool and Integration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** A - Redis Setup  
> **Document:** 03 of 03  
> **Tasks Covered:** 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-06-10_Redis-Settings-URLs.md](02_Tasks-06-10_Redis-Settings-URLs.md)
- **→ Next Group:** [../Group-B_Cache-Backend-Configuration/](../Group-B_Cache-Backend-Configuration/)

---

## Document Overview

This document covers the configuration of Redis connection pool settings, socket timeouts, and integration of Redis settings into Django's base configuration. These settings optimize connection management and ensure reliable Redis operations.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 11 | Configure Connection Pool | Medium |
| 12 | Configure Socket Timeout | Simple |
| 13 | Import Redis Settings | Simple |
| 14 | Test Redis Settings | Simple |

---

## Task 11: Configure Connection Pool

### Overview
Configure Redis connection pool settings to optimize connection reuse and manage resources efficiently.

### Dependencies
- Task 10: Configure Redis Database

### Instructions

1. **Understand connection pooling**
   - Connection pool maintains reusable Redis connections
   - Reduces overhead of creating new connections
   - Limits total connections to prevent resource exhaustion

2. **Add connection pool settings**
   - Add pool configuration to redis.py settings
   - Configure pool for each Redis database/purpose

3. **Set maximum connections per pool**
   - Default: 10 connections per pool
   - Development: 5-10 connections sufficient
   - Production: 20-50 connections based on load
   - Calculate based on: (workers × threads) + buffer

4. **Configure connection pool parameters**
   - max_connections: Maximum pool size
   - connection_pool_class: Connection pool implementation
   - connection_pool_kwargs: Additional pool arguments

5. **Set connection pool timeout**
   - Time to wait for available connection
   - Default: 20 seconds
   - Prevents indefinite blocking

6. **Configure pool per database**
   - Separate pool for default cache
   - Separate pool for sessions
   - Separate pool for Celery
   - Independent pool sizing based on usage

7. **Add connection retry settings**
   - retry_on_timeout: True
   - retry_on_error: Specific error types
   - max_retries: Usually 3

8. **Document pool sizing guidelines**
   - Formula: max_connections = (gunicorn_workers × threads) × 1.5
   - Example: 4 workers × 2 threads × 1.5 = 12 connections
   - Add 20% buffer for spikes

### Connection Pool Configuration Structure
```
Pool settings structure:
├── MAX_CONNECTIONS
│   ├── Default cache: Based on worker count
│   ├── Sessions: Lower (5-10)
│   └── Celery: Based on Celery workers
├── CONNECTION_POOL_CLASS
│   └── redis.ConnectionPool or BlockingConnectionPool
├── CONNECTION_POOL_TIMEOUT
│   └── Time to wait for connection (seconds)
└── RETRY_SETTINGS
    ├── retry_on_timeout: True/False
    └── max_retries: Integer
```

### Pool Sizing Guidelines
| Environment | Workers | Threads | Pool Size | Reasoning |
|-------------|---------|---------|-----------|-----------|
| **Development** | 1 | 1 | 5 | Minimal load |
| **Staging** | 2 | 2 | 8 | Testing load |
| **Production (Small)** | 4 | 2 | 15 | 4×2×1.5 + buffer |
| **Production (Large)** | 8 | 4 | 50 | 8×4×1.5 + buffer |

### Pool Configuration per Database
| Database | Purpose | Pool Size | Reasoning |
|----------|---------|-----------|-----------|
| **DB 0** | Default cache | Based on workers | High concurrency |
| **DB 1** | Sessions | 10 (fixed) | Lower concurrency |
| **DB 2** | Celery | Based on Celery workers | Task processing |
| **DB 3** | Rate limits | 5 (fixed) | Minimal usage |

### Connection Pool Monitoring
Monitor these metrics:
- Total connections in pool
- Active (in-use) connections
- Idle connections
- Connection wait time
- Connection errors

### Verification
- Connection pool settings configured
- Pool size appropriate for environment
- Pool timeout set
- Retry settings configured
- Per-database pools configured

---

## Task 12: Configure Socket Timeout

### Overview
Configure socket timeout settings to prevent hanging connections and handle network issues gracefully.

### Dependencies
- Task 11: Configure Connection Pool

### Instructions

1. **Understand socket timeout types**
   - Socket connect timeout: Time to establish connection
   - Socket read timeout: Time to wait for response
   - Combined into socket_timeout for Redis

2. **Add socket timeout setting**
   - Add SOCKET_TIMEOUT to redis.py
   - Set timeout in seconds

3. **Set development timeout**
   - Development: 5 seconds
   - Local network should be fast
   - Short timeout catches issues quickly

4. **Set production timeout**
   - Production: 3-5 seconds for same region
   - Increase for cross-region: 10 seconds
   - Consider network latency

5. **Configure socket keepalive**
   - Enable TCP keepalive
   - Detect broken connections
   - Keepalive interval: 60 seconds

6. **Add socket connect timeout**
   - Separate timeout for connection establishment
   - Usually same as socket_timeout
   - Default: 5 seconds

7. **Configure health check timeout**
   - Timeout for PING health checks
   - Shorter than socket_timeout
   - Default: 2 seconds

8. **Document timeout considerations**
   - Network latency between app and Redis
   - Geographic distance
   - Expected operation duration
   - Trade-off: too short = false timeouts, too long = slow failure detection

### Timeout Configuration Structure
```
Timeout settings:
├── SOCKET_TIMEOUT
│   └── General read/write timeout (seconds)
├── SOCKET_CONNECT_TIMEOUT
│   └── Connection establishment timeout (seconds)
├── SOCKET_KEEPALIVE
│   └── Enable TCP keepalive (boolean)
├── SOCKET_KEEPALIVE_OPTIONS
│   ├── TCP_KEEPIDLE: Time before keepalive probes
│   ├── TCP_KEEPINTVL: Interval between probes
│   └── TCP_KEEPCNT: Number of probes before failure
└── HEALTH_CHECK_INTERVAL
    └── How often to check connection health (seconds)
```

### Environment-Specific Timeouts
| Environment | Socket Timeout | Connect Timeout | Keepalive | Reasoning |
|-------------|---------------|-----------------|-----------|-----------|
| **Development** | 5s | 5s | Enabled | Fast local network |
| **Production (Same Region)** | 3s | 3s | Enabled | Low latency |
| **Production (Cross Region)** | 10s | 10s | Enabled | Higher latency |
| **Testing** | 2s | 2s | Disabled | Fast failure for tests |

### Network Latency Considerations for Sri Lanka
| Scenario | Expected RTT | Recommended Timeout |
|----------|-------------|---------------------|
| **App and Redis in same datacenter** | <1ms | 2-3 seconds |
| **Within Colombo (different DCs)** | 2-5ms | 3-5 seconds |
| **Colombo to other Sri Lanka cities** | 10-20ms | 5-7 seconds |
| **Sri Lanka to Singapore** | 30-50ms | 10 seconds |
| **Sri Lanka to Mumbai** | 20-40ms | 10 seconds |

### Timeout Error Handling
| Error Type | Cause | Solution |
|------------|-------|----------|
| **TimeoutError** | Redis didn't respond | Retry or fail gracefully |
| **ConnectionError** | Can't connect | Check Redis status, network |
| **SocketTimeout** | Socket read/write timeout | Increase timeout or check network |

### Verification
- Socket timeout configured
- Connect timeout configured
- Keepalive settings configured
- Environment-specific timeouts set
- Timeout handling tested

---

## Task 13: Import Redis Settings

### Overview
Import the Redis settings module into Django's base settings to activate the Redis configuration.

### Dependencies
- Task 12: Configure Socket Timeout

### Instructions

1. **Locate base settings file**
   - Navigate to config/settings/base.py
   - This is the main Django settings file

2. **Add import statement**
   - Import redis settings module at appropriate location
   - Place with other settings module imports

3. **Import all Redis configuration**
   - Import all constants and settings from redis.py
   - Use: from .redis import *
   - Or import specific settings explicitly

4. **Verify import order**
   - Import redis settings after environment setup
   - Import before CACHES configuration
   - Ensure dependencies are loaded first

5. **Add import comment**
   - Document what's being imported
   - Explain Redis settings purpose
   - Note dependencies

6. **Verify no import errors**
   - Check no circular imports
   - Verify all required variables available
   - Test settings loading

7. **Update settings documentation**
   - Document that Redis settings are imported
   - Note the redis.py file location
   - Reference Redis configuration section

### Import Structure
```
base.py import structure:
├── Standard library imports
├── Third-party imports (Django, etc.)
├── Environment configuration
├── from .redis import *          # Redis settings import
├── Database configuration
├── Cache configuration (uses Redis settings)
└── Other application settings
```

### Import Methods
```
Method 1 - Import all:
from .redis import *

Method 2 - Explicit imports:
from .redis import (
    REDIS_URL,
    REDIS_DB_DEFAULT_CACHE,
    REDIS_DB_SESSIONS,
    MAX_CONNECTIONS,
    SOCKET_TIMEOUT,
)

Method 3 - Module import:
from . import redis
# Access as: redis.REDIS_URL
```

### Import Checklist
- [ ] Import statement added to base.py
- [ ] Import location appropriate (after env, before CACHES)
- [ ] All Redis settings accessible
- [ ] No circular import errors
- [ ] No undefined variable errors
- [ ] Import documented with comment

### Verification
- Redis settings imported successfully
- Settings accessible in Django
- No import errors on startup
- Settings load in correct order

---

## Task 14: Test Redis Settings

### Overview
Verify that all Redis settings are correctly configured and Redis connection works with the configured settings.

### Dependencies
- Task 13: Import Redis Settings

### Instructions

1. **Start Django development server**
   - Run Django development server
   - Verify no startup errors
   - Check for Redis-related errors in logs

2. **Test settings loading**
   - Access Django shell
   - Import settings module
   - Verify all Redis settings are present

3. **Verify REDIS_URL value**
   - Check REDIS_URL is correct
   - Verify environment variable loaded
   - Confirm URL format valid

4. **Verify database allocation**
   - Check all database constants defined
   - Verify values are correct (0-15)
   - Confirm no duplicate allocations

5. **Test connection pool settings**
   - Verify MAX_CONNECTIONS is set
   - Check pool timeout configured
   - Confirm retry settings present

6. **Test socket timeout settings**
   - Verify SOCKET_TIMEOUT is set
   - Check keepalive configured
   - Confirm timeout values reasonable

7. **Test Redis connection with settings**
   - Create Redis client using configured settings
   - Test PING command
   - Test basic operations (SET/GET)
   - Verify connection uses pool
   - Check timeout behavior

8. **Test multi-database access**
   - Test connection to each database (0, 1, 2, 3)
   - Verify isolation between databases
   - Test database switching

9. **Test in Docker environment**
   - If using Docker, verify redis:// host works
   - Test from within Docker container
   - Verify network connectivity

10. **Verify settings in different environments**
    - Test with DEBUG=True (development)
    - Test with DEBUG=False (production simulation)
    - Verify appropriate settings used

11. **Check for deprecation warnings**
    - Look for Redis/django-redis deprecation warnings
    - Address any compatibility issues
    - Update settings if needed

12. **Document test results**
    - Document successful tests
    - Note any issues found and resolved
    - Record performance baselines

### Testing Script Structure
```
Test sequence:
├── 1. Django settings load without errors
├── 2. Redis settings present and valid
├── 3. Connection successful
├── 4. Pool configuration active
├── 5. Timeout settings working
├── 6. Multi-database access works
└── 7. Production simulation passes
```

### Settings Validation Checklist
| Setting | Expected Value | Validation Method |
|---------|---------------|-------------------|
| **REDIS_URL** | redis://host:6379/0 | Check format, test connection |
| **MAX_CONNECTIONS** | 5-50 (based on env) | Verify integer, reasonable value |
| **SOCKET_TIMEOUT** | 3-10 seconds | Verify integer, test timeout |
| **DB_DEFAULT_CACHE** | 0 | Check integer 0-15 |
| **DB_SESSIONS** | 1 | Check integer 0-15 |
| **DB_CELERY** | 2 | Check integer 0-15 |
| **DB_RATE_LIMIT** | 3 | Check integer 0-15 |

### Connection Test Verification
```
Test cases:
1. Basic connectivity
   - Redis PING returns PONG
   
2. Database isolation
   - Set key in DB 0, not visible in DB 1
   
3. Connection pool
   - Multiple connections use same pool
   - Connections reused after close
   
4. Timeout behavior
   - Slow operations timeout correctly
   - Timeout doesn't affect other operations
   
5. Error handling
   - Connection errors handled gracefully
   - Retry logic works as expected
```

### Common Test Issues
| Issue | Symptom | Solution |
|-------|---------|----------|
| **Import Error** | Settings not found | Check import path |
| **Connection Refused** | Can't connect to Redis | Verify Redis running |
| **Wrong Database** | Keys in wrong DB | Check URL database number |
| **Timeout Too Short** | Frequent timeouts | Increase timeout value |
| **Pool Exhaustion** | Blocked waiting for connection | Increase pool size |

### Verification
- Django starts without errors
- All Redis settings present
- Redis connection successful
- Pool configuration working
- Timeout settings functional
- Multi-database access works
- Tests documented

---

## Expected Outcome After This Document

```
backend/
├── config/
│   └── settings/
│       ├── base.py               # Imports redis.py settings
│       └── redis.py              # Complete Redis configuration
└── [Test results documented]
```

### Complete Redis Configuration
```
redis.py now includes:
├── Environment variable loading
├── REDIS_URL configuration
├── Database allocation constants
├── Connection pool settings
│   ├── MAX_CONNECTIONS
│   ├── POOL_TIMEOUT
│   └── RETRY_SETTINGS
├── Socket timeout settings
│   ├── SOCKET_TIMEOUT
│   ├── SOCKET_CONNECT_TIMEOUT
│   └── KEEPALIVE settings
└── Helper functions
```

---

## Sri Lanka-Specific Considerations

- **Hosting Location:** Consider SLT Data Center or Dialog Cloud for low-latency Redis
- **Network Reliability:** Configure keepalive for intermittent connectivity issues
- **Timeout Values:** Account for potential ISP routing delays in timeout configuration
- **Backup Redis:** Consider Redis sentinel/cluster for high availability
- **Monitoring:** Set up monitoring for Redis performance and connection health

---

## Common Issues and Solutions

### Issue 1: Connection Pool Exhausted
**Symptoms:** "ConnectionError: Too many connections"

**Solutions:**
- Increase MAX_CONNECTIONS in pool settings
- Check for connection leaks (connections not being closed)
- Review application concurrency (workers × threads)
- Monitor active connections
- Implement connection cleanup in error handlers

### Issue 2: Socket Timeout on All Requests
**Symptoms:** Frequent socket timeout errors

**Solutions:**
- Increase SOCKET_TIMEOUT value
- Check network latency to Redis
- Verify Redis isn't overloaded
- Check for slow Redis commands (use SLOWLOG)
- Consider Redis performance tuning

### Issue 3: Settings Not Loading
**Symptoms:** Settings undefined or using wrong values

**Solutions:**
- Verify import order in base.py
- Check for circular imports
- Ensure redis.py in correct location
- Verify environment variables set
- Test settings loading in Django shell

### Issue 4: Different Settings in Development vs Docker
**Symptoms:** Works locally but fails in Docker

**Solutions:**
- Use correct hostname (redis vs localhost)
- Check Docker network configuration
- Verify environment variables in Docker
- Test from inside container
- Review docker-compose.yml settings

### Issue 5: Redis Connection Works But Pool Doesn't
**Symptoms:** Direct connection works, pool connection fails

**Solutions:**
- Verify pool configuration syntax
- Check ConnectionPool class imported correctly
- Ensure pool parameters compatible with Redis version
- Test pool creation separately
- Check for pool timeout too short

---

## Notes for AI Agents

1. **Connection Pool:** Essential for production performance and resource management
2. **Timeout Tuning:** Balance between catching failures and allowing slow operations
3. **Environment Variables:** Always verify environment variables loaded before use
4. **Import Order:** Redis settings must load before CACHES configuration
5. **Testing:** Test in both development and Docker environments
6. **Monitoring:** Set up monitoring for connection pool and timeout metrics
7. **Documentation:** Document all settings and their purposes
8. **Git Commit:** Commit complete Redis configuration as single logical unit

---

## Validation Checklist

Before proceeding to the next group:

- [ ] Connection pool settings configured
- [ ] Pool size appropriate for environment
- [ ] Socket timeout settings configured
- [ ] Keepalive settings configured
- [ ] Redis settings imported in base.py
- [ ] Django starts without errors
- [ ] Redis connection successful
- [ ] All database constants accessible
- [ ] Pool functionality verified
- [ ] Timeout behavior tested
- [ ] Multi-database access works
- [ ] Docker environment tested
- [ ] Changes committed to Git

---

## Next Steps

After completing Group A:
1. **Git Commit:** Commit all Redis setup configuration
2. **Documentation:** Update project documentation with Redis setup
3. **Proceed to Group B:** [Cache Backend Configuration](../Group-B_Cache-Backend-Configuration/)
4. Configure Django CACHES setting with Redis backend
5. Set up cache aliases for different purposes
