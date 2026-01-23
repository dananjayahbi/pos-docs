# Tasks 15-19: CACHES Setting Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** B - Cache Backend Configuration  
> **Document:** 01 of 04  
> **Tasks Covered:** 15, 16, 17, 18, 19

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Redis-Setup/](../Group-A_Redis-Setup/)
- **→ Next Document:** [02_Tasks-20-23_Cache-Options.md](02_Tasks-20-23_Cache-Options.md)

---

## Document Overview

This document covers the configuration of Django's CACHES setting to use Redis as the cache backend. Multiple cache aliases are set up for different purposes (default cache, sessions, Celery results), each using dedicated Redis databases.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 15 | Configure CACHES Setting | Medium |
| 16 | Add default Cache Backend | Simple |
| 17 | Add sessions Cache Backend | Simple |
| 18 | Configure Cache Locations | Simple |
| 19 | Configure Cache Options | Medium |

---

## Task 15: Configure CACHES Setting

### Overview
Configure Django's CACHES setting dictionary to define multiple cache backends using Redis.

### Dependencies
- Task 14: Test Redis Settings (Group A)

### Instructions

1. **Locate cache configuration location**
   - Decide where to place CACHES setting
   - Option 1: In base.py after Redis import
   - Option 2: In separate cache.py settings module
   - Recommended: cache.py for organization

2. **Create cache.py settings module**
   - Create config/settings/cache.py
   - Add docstring describing cache configuration
   - Import required Redis settings

3. **Import Redis settings**
   - Import REDIS_URL and database constants
   - Import from redis.py settings module
   - Ensure Redis settings loaded first

4. **Initialize CACHES dictionary**
   - Create CACHES dictionary
   - This is Django's cache configuration
   - Will contain multiple cache backend definitions

5. **Understand CACHES structure**
   - Each key is a cache alias (name)
   - Each value is a backend configuration dict
   - Can define multiple caches for different purposes

6. **Document cache aliases**
   - Document each cache alias purpose
   - Explain when to use each alias
   - Note database allocation

7. **Plan cache aliases**
   - default: General application caching
   - sessions: Session storage
   - celery: Optional Celery results cache
   - Add comments for each planned alias

### CACHES Dictionary Structure
```
CACHES structure:
{
    'alias_name': {
        'BACKEND': 'cache backend class path',
        'LOCATION': 'redis connection URL',
        'OPTIONS': {
            # Backend-specific options
        },
        'TIMEOUT': default_timeout_seconds,
        'KEY_PREFIX': 'prefix_string',
    }
}
```

### Planned Cache Aliases
| Alias | Purpose | Redis DB | Typical Usage |
|-------|---------|----------|---------------|
| **default** | General cache | 0 | QuerySets, views, computations |
| **sessions** | User sessions | 1 | Django sessions, auth tokens |
| **celery** | Task results (optional) | 2 | Celery task result storage |

### Cache Alias Selection Guidelines
```
When to use which cache alias:

default cache:
├── QuerySet caching
├── View response caching
├── Computed data caching
├── Template fragment caching
└── General application data

sessions cache:
├── User session data
├── Authentication state
├── Shopping cart (if session-based)
└── Temporary user data

celery cache (optional):
├── Task result storage
├── Task state tracking
└── Task coordination
```

### Verification
- cache.py settings file created
- CACHES dictionary initialized
- Redis settings imported
- Cache aliases planned and documented

---

## Task 16: Add default Cache Backend

### Overview
Configure the "default" cache backend using Redis for general application caching.

### Dependencies
- Task 15: Configure CACHES Setting

### Instructions

1. **Add default cache entry**
   - Add "default" key to CACHES dictionary
   - This is the primary cache Django uses

2. **Set Redis backend**
   - BACKEND: 'django_redis.cache.RedisCache'
   - This is django-redis's cache backend class

3. **Configure location**
   - Use REDIS_URL with database 0
   - Format: redis://host:6379/0
   - Use REDIS_DB_DEFAULT_CACHE constant

4. **Set basic timeout**
   - TIMEOUT: 300 (5 minutes default)
   - Will be customized later per use case
   - None = no expiration (not recommended)

5. **Add backend comment**
   - Explain this is the default cache
   - Note what it's used for
   - Reference Redis DB 0

6. **Verify default cache required**
   - Django requires 'default' cache alias
   - Many third-party packages use 'default'
   - Always configure even if using other aliases

### Default Cache Configuration
```
CACHES['default'] configuration:
├── BACKEND
│   └── 'django_redis.cache.RedisCache'
├── LOCATION
│   └── Redis URL with DB 0
├── TIMEOUT
│   └── 300 seconds (5 minutes)
└── [OPTIONS] - Added in next tasks
```

### Backend Class Options
| Backend | Use Case | Performance |
|---------|----------|-------------|
| **django_redis.cache.RedisCache** | Production | Fastest |
| **django.core.cache.backends.locmem.LocMemCache** | Testing | Fast, isolated |
| **django.core.cache.backends.dummy.DummyCache** | Development (no cache) | N/A |

### Default Cache Usage Patterns
```
Common uses of default cache:
├── @cache_page decorator on views
├── cache.get() / cache.set() calls without alias
├── QuerySet caching with .cache()
├── Template {% cache %} tags
├── Third-party package caching
└── Django middleware caching
```

### Verification
- default cache entry added to CACHES
- RedisCache backend specified
- Location uses Redis DB 0
- Default timeout set
- Configuration documented

---

## Task 17: Add sessions Cache Backend

### Overview
Configure the "sessions" cache backend using Redis for Django session storage.

### Dependencies
- Task 16: Add default Cache Backend

### Instructions

1. **Add sessions cache entry**
   - Add "sessions" key to CACHES dictionary
   - This cache stores user session data

2. **Set Redis backend**
   - Same BACKEND as default: 'django_redis.cache.RedisCache'
   - Consistent backend across caches

3. **Configure location**
   - Use REDIS_URL with database 1
   - Format: redis://host:6379/1
   - Use REDIS_DB_SESSIONS constant
   - Separates sessions from general cache

4. **Set session timeout**
   - TIMEOUT: Match Django's SESSION_COOKIE_AGE
   - Typically 1209600 (2 weeks)
   - Sessions expire when cookie expires

5. **Add sessions comment**
   - Explain this stores user sessions
   - Note database separation reason
   - Reference Django session framework

6. **Document session caching benefits**
   - Faster than database sessions
   - Scales better than file sessions
   - Automatic expiration handling
   - No database writes per request

### Sessions Cache Configuration
```
CACHES['sessions'] configuration:
├── BACKEND
│   └── 'django_redis.cache.RedisCache'
├── LOCATION
│   └── Redis URL with DB 1
├── TIMEOUT
│   └── 1209600 seconds (2 weeks)
└── [OPTIONS] - Added in next tasks
```

### Session Storage Comparison
| Backend | Read Speed | Write Speed | Scalability | Recommended |
|---------|-----------|-------------|-------------|-------------|
| **Redis Cache** | Fastest | Fastest | Excellent | Production |
| **Database** | Slow | Slow | Poor | Small sites only |
| **File** | Medium | Medium | Poor | Development |
| **Cookie** | N/A | N/A | Good | Stateless only |

### Session Cache Benefits
```
Why separate sessions cache:
├── Database Isolation
│   └── Clear sessions without affecting other cache
├── Different Expiration
│   └── Sessions need longer TTL than general cache
├── Monitoring
│   └── Track session storage separately
├── Scaling
│   └── Scale session storage independently
└── Security
    └── Isolate sensitive session data
```

### Verification
- sessions cache entry added to CACHES
- RedisCache backend specified
- Location uses Redis DB 1
- Timeout matches session age
- Separation from default cache

---

## Task 18: Configure Cache Locations

### Overview
Configure the LOCATION setting for each cache alias with proper Redis URLs including database numbers.

### Dependencies
- Task 17: Add sessions Cache Backend

### Instructions

1. **Review location format**
   - Format: redis://host:port/database
   - Must include database number
   - Use constants for database numbers

2. **Configure default cache location**
   - Build URL with REDIS_DB_DEFAULT_CACHE (0)
   - Parse base URL and replace database number
   - Or construct from components

3. **Configure sessions cache location**
   - Build URL with REDIS_DB_SESSIONS (1)
   - Ensure different database than default

4. **Create URL builder function**
   - Function to build Redis URL with specific database
   - Input: database number
   - Output: Complete Redis URL
   - Reusable for all cache aliases

5. **Handle URL variations**
   - Support redis:// scheme
   - Support rediss:// (TLS) scheme
   - Support Unix socket paths
   - Parse and rebuild URLs correctly

6. **Validate URLs**
   - Ensure each cache uses correct database
   - Verify no database number conflicts
   - Check URL format valid

7. **Add location comments**
   - Document which database each cache uses
   - Explain database separation
   - Note any special URL handling

### URL Builder Pattern
```
URL building options:

Option 1 - String replacement:
base_url = 'redis://localhost:6379'
default_location = f"{base_url}/0"
sessions_location = f"{base_url}/1"

Option 2 - URL parsing:
from urllib.parse import urlparse, urlunparse
parsed = urlparse(REDIS_URL)
# Modify path component with database number
# Reconstruct URL

Option 3 - Helper function:
def get_redis_url(db):
    return REDIS_URL.rsplit('/', 1)[0] + f'/{db}'
```

### Location Configuration per Alias
| Cache Alias | Location Pattern | Database | Example |
|-------------|-----------------|----------|---------|
| **default** | redis://host:6379/0 | 0 | redis://localhost:6379/0 |
| **sessions** | redis://host:6379/1 | 1 | redis://localhost:6379/1 |
| **celery** | redis://host:6379/2 | 2 | redis://localhost:6379/2 |

### URL Validation Checklist
- [ ] Each cache has LOCATION specified
- [ ] Database numbers match constants
- [ ] No duplicate database numbers
- [ ] URLs syntactically correct
- [ ] URLs use correct scheme (redis/rediss)
- [ ] Host and port match REDIS_URL
- [ ] URLs tested and working

### Verification
- All cache aliases have LOCATION set
- Each uses correct Redis database
- URLs properly formatted
- Database isolation verified

---

## Task 19: Configure Cache Options

### Overview
Configure the OPTIONS dictionary for each cache backend with Redis-specific settings.

### Dependencies
- Task 18: Configure Cache Locations

### Instructions

1. **Understand OPTIONS purpose**
   - OPTIONS dict contains backend-specific settings
   - Different backends accept different options
   - django-redis has specific option keys

2. **Add OPTIONS to default cache**
   - Add OPTIONS dictionary to default cache config
   - Will contain Redis client configuration

3. **Configure Redis client class**
   - CLIENT_CLASS: 'django_redis.client.DefaultClient'
   - This is the default django-redis client
   - Handles connection pooling and serialization

4. **Add connection pool configuration**
   - Use pool settings from Redis settings
   - Reference MAX_CONNECTIONS
   - Include pool timeout settings

5. **Configure serializer**
   - SERIALIZER: JSON or Pickle
   - Default: 'django_redis.serializers.json.JSONSerializer'
   - JSON is safer but more restrictive
   - Pickle for Python objects but security risk

6. **Add compression option**
   - COMPRESSOR: Optional compression
   - Options: 'django_redis.compressors.zlib.ZlibCompressor'
   - Only if caching large objects
   - Trade-off: CPU vs bandwidth

7. **Configure parser**
   - PARSER_CLASS: Response parser
   - Default: 'django_redis.parsers.DefaultParser'
   - Usually don't need to change

8. **Add socket options**
   - SOCKET_CONNECT_TIMEOUT: From Redis settings
   - SOCKET_TIMEOUT: From Redis settings
   - TCP_NODELAY: True for lower latency
   - TCP_KEEPALIVE: True for connection health

9. **Configure retry logic**
   - RETRY_ON_TIMEOUT: True
   - Retry failed operations
   - Helps with transient network issues

10. **Copy OPTIONS to other caches**
    - sessions cache uses same OPTIONS
    - Any future cache aliases use same OPTIONS
    - Consistent configuration across caches

11. **Document OPTIONS choices**
    - Comment each significant option
    - Explain why defaults changed
    - Note performance implications

### OPTIONS Dictionary Structure
```
OPTIONS structure:
{
    'CLIENT_CLASS': 'client class path',
    'CONNECTION_POOL_KWARGS': {
        'max_connections': integer,
        'timeout': seconds,
    },
    'SERIALIZER': 'serializer class path',
    'COMPRESSOR': 'compressor class path' (optional),
    'PARSER_CLASS': 'parser class path',
    'SOCKET_CONNECT_TIMEOUT': seconds,
    'SOCKET_TIMEOUT': seconds,
    'RETRY_ON_TIMEOUT': boolean,
}
```

### Client Class Options
| Client Class | Use Case | Features |
|--------------|----------|----------|
| **DefaultClient** | Standard use | Connection pooling, standard serialization |
| **ShardClient** | Multiple Redis servers | Client-side sharding |
| **SentinelClient** | High availability | Redis Sentinel support |
| **HerdClient** | Cache stampede protection | Dogpile cache pattern |

### Serializer Options
| Serializer | Pros | Cons | Recommended |
|------------|------|------|-------------|
| **JSON** | Safe, readable, cross-language | Limited types | Production |
| **Pickle** | Any Python object | Security risk, Python-only | Trusted data only |
| **MessagePack** | Fast, compact | Requires library | High performance |

### OPTIONS Configuration Checklist
- [ ] CLIENT_CLASS specified
- [ ] Connection pool settings included
- [ ] Serializer chosen and configured
- [ ] Socket timeouts from Redis settings
- [ ] Retry on timeout enabled
- [ ] Parser class specified (or default)
- [ ] Compression considered (if needed)
- [ ] Same OPTIONS for all caches

### Verification
- OPTIONS dictionary added to all caches
- Redis client class specified
- Connection pool configured
- Serializer selected
- Socket settings match Redis config
- Retry logic enabled

---

## Expected Outcome After This Document

```
backend/
├── config/
│   └── settings/
│       ├── base.py               # Imports cache.py
│       ├── redis.py              # Redis connection settings
│       └── cache.py              # CACHES configuration
```

### cache.py Content Structure
```
cache.py now contains:
├── Imports from redis.py
├── URL builder helper (optional)
├── CACHES dictionary
│   ├── 'default' cache
│   │   ├── BACKEND
│   │   ├── LOCATION (DB 0)
│   │   ├── TIMEOUT
│   │   └── OPTIONS
│   └── 'sessions' cache
│       ├── BACKEND
│       ├── LOCATION (DB 1)
│       ├── TIMEOUT
│       └── OPTIONS
```

---

## Sri Lanka-Specific Considerations

- **Serialization:** Use JSON for multi-language support (Sinhala, Tamil)
- **Compression:** Consider for bandwidth optimization on slower connections
- **Connection Pool:** Size appropriately for local network speeds
- **Timeout:** Account for potential routing delays within Sri Lanka ISPs

---

## Common Issues and Solutions

### Issue 1: CACHES Setting Not Recognized
**Symptoms:** Django doesn't use cache, cache operations fail

**Solutions:**
- Verify CACHES in settings module
- Check settings import order
- Ensure cache.py imported in base.py
- Test with Django shell

### Issue 2: Wrong Redis Database Used
**Symptoms:** Keys appear in wrong database, data conflicts

**Solutions:**
- Verify LOCATION includes database number
- Check URL format: redis://host:6379/0
- Test each cache alias separately
- Use redis-cli to verify database isolation

### Issue 3: Connection Pool Errors
**Symptoms:** Too many connections, pool exhaustion

**Solutions:**
- Adjust max_connections in OPTIONS
- Check for connection leaks
- Review application concurrency
- Monitor active connections

### Issue 4: Serialization Errors
**Symptoms:** Can't cache certain objects

**Solutions:**
- Check object is JSON-serializable
- Consider using Pickle serializer (security risks)
- Implement custom serialization
- Convert complex objects to dictionaries

### Issue 5: Import Errors
**Symptoms:** Can't import django_redis

**Solutions:**
- Verify django-redis installed
- Check package version compatibility
- Update requirements.txt
- Reinstall package

---

## Notes for AI Agents

1. **Alias Names:** 'default' is required; other names are customary
2. **Database Separation:** Different databases for different purposes prevents conflicts
3. **OPTIONS:** Most important settings are CLIENT_CLASS and serializer
4. **Serializer Choice:** JSON for safety, Pickle only if needed and trusted
5. **Connection Pool:** Reuse settings from redis.py for consistency
6. **Testing:** Test each cache alias independently
7. **Documentation:** Comment complex OPTIONS clearly
8. **Git Commit:** Commit cache.py separately from later cache constant changes

---

## Validation Checklist

Before proceeding to the next document:

- [ ] cache.py settings file created
- [ ] CACHES dictionary defined
- [ ] default cache configured
- [ ] sessions cache configured
- [ ] Correct Redis databases used
- [ ] LOCATION set for each cache
- [ ] OPTIONS configured for each cache
- [ ] Redis client class specified
- [ ] Serializer selected
- [ ] Connection pool settings included
- [ ] Timeout settings referenced
- [ ] cache.py imported in base.py
- [ ] Django starts without errors
- [ ] Changes committed to Git

---

## Next Steps

After completing these tasks:
1. Proceed to [02_Tasks-20-23_Cache-Options.md](02_Tasks-20-23_Cache-Options.md)
2. Configure additional cache options (KEY_PREFIX, MAX_ENTRIES)
3. Set up cache timeout constants
