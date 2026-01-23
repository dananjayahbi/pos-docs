# Tasks 20-23: Cache Options Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** B - Cache Backend Configuration  
> **Document:** 02 of 04  
> **Tasks Covered:** 20, 21, 22, 23

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-15-19_CACHES-Setting.md](01_Tasks-15-19_CACHES-Setting.md)
- **→ Next Document:** [03_Tasks-24-26_Session-Configuration.md](03_Tasks-24-26_Session-Configuration.md)

---

## Document Overview

This document covers configuration of additional cache options including default timeout, key prefix, custom key function, and maximum entries limit.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 20 | Set Default Timeout | Simple |
| 21 | Configure KEY_PREFIX | Simple |
| 22 | Configure KEY_FUNCTION | Medium |
| 23 | Configure MAX_ENTRIES | Simple |

---

## Task 20: Set Default Timeout

### Overview
Configure the default cache timeout (TTL) for each cache alias to ensure cached data expires appropriately.

### Dependencies
- Task 19: Configure Cache Options

### Instructions

1. **Review timeout purpose**
   - TIMEOUT sets default expiration in seconds
   - Applies to cache.set() without explicit timeout
   - Different aliases can have different defaults

2. **Set default cache timeout**
   - TIMEOUT: 300 (5 minutes)
   - Reasonable default for general caching
   - Balances freshness vs cache hits

3. **Set sessions cache timeout**
   - TIMEOUT: 1209600 (2 weeks)
   - Match Django's SESSION_COOKIE_AGE
   - Keeps sessions until cookies expire

4. **Document timeout guidelines**
   - When to use shorter timeouts (volatile data)
   - When to use longer timeouts (stable data)
   - How to override per cache.set() call

5. **Add timeout constants**
   - Will create named constants in next group
   - Document plan to use SHORT_CACHE, MEDIUM_CACHE, LONG_CACHE

### Timeout Guidelines
| Data Type | Recommended Timeout | Reason |
|-----------|-------------------|---------|
| **Real-time stats** | 60-300s (1-5min) | Data changes frequently |
| **Product lists** | 600-3600s (10-60min) | Updates less frequently |
| **Static content** | 86400s (1 day) | Rarely changes |
| **User sessions** | 1209600s (2 weeks) | Match cookie lifetime |

### Verification
- Default timeout set for each cache
- Timeouts appropriate for cache purpose
- Timeout values documented

---

## Task 21: Configure KEY_PREFIX

### Overview
Configure a global key prefix for all cache keys to namespace LankaCommerce Cloud cache keys and prevent conflicts.

### Dependencies
- Task 20: Set Default Timeout

### Instructions

1. **Understand key prefix purpose**
   - Prefixes all cache keys automatically
   - Prevents conflicts with other apps
   - Makes cache keys identifiable

2. **Choose prefix value**
   - Use "lcc" for LankaCommerce Cloud
   - Or "lankacommerce" for clarity
   - Keep short to reduce key length

3. **Add KEY_PREFIX to default cache**
   - Add to CACHES['default'] configuration
   - KEY_PREFIX: 'lcc'

4. **Add KEY_PREFIX to sessions cache**
   - Same prefix or different?
   - Recommend same: 'lcc'
   - Django sessions add own prefix

5. **Document prefix usage**
   - Actual keys: lcc:module:identifier
   - Example: lcc:products:list
   - Tenant prefix added separately (later)

6. **Consider version in prefix**
   - Could use: lcc:v1
   - Allows cache invalidation on deploy
   - Document for future consideration

### Key Prefix Examples
```
Without prefix:
products:list

With prefix 'lcc':
lcc:products:list

With version prefix:
lcc:v1:products:list

With tenant (added later):
lcc:tenant:001:products:list
```

### Verification
- KEY_PREFIX added to all caches
- Prefix value consistent
- Prefix documented

---

## Task 22: Configure KEY_FUNCTION

### Overview
Configure a custom key function to control how cache keys are generated, including tenant scoping.

### Dependencies
- Task 21: Configure KEY_PREFIX

### Instructions

1. **Understand KEY_FUNCTION purpose**
   - Controls how cache keys are generated
   - Can add custom logic (tenant scoping)
   - Receives key, prefix, version

2. **Decide on custom function need**
   - Will implement tenant scoping in Group C
   - For now, document intent
   - May use default initially

3. **Document default key function**
   - Django default: prefix:version:key
   - Works for non-tenant keys
   - Will override for tenant keys

4. **Plan custom key function**
   - Will create: make_tenant_key_function
   - Format: prefix:tenant:{schema}:key
   - Implemented in Group C

5. **Add placeholder comment**
   - Note KEY_FUNCTION will be customized
   - Reference tenant scoping section
   - Keep default for now

6. **Document key format**
   - Standard keys: lcc:version:key
   - Tenant keys (future): lcc:tenant:{schema}:key
   - Shared keys: lcc:shared:key

### Default vs Custom Key Functions
| Scenario | Function | Key Format |
|----------|----------|------------|
| **Default Django** | None (default) | prefix:version:key |
| **With PREFIX** | None (default) | lcc:1:products:list |
| **Custom (future)** | make_tenant_key | lcc:tenant:001:products:list |

### Verification
- KEY_FUNCTION decision documented
- Default function understood
- Custom function planned for Group C

---

## Task 23: Configure MAX_ENTRIES

### Overview
Configure the maximum number of entries for each cache to prevent unlimited memory growth.

### Dependencies
- Task 22: Configure KEY_FUNCTION

### Instructions

1. **Understand MAX_ENTRIES purpose**
   - Limits total keys in cache
   - Triggers LRU eviction when reached
   - Prevents memory exhaustion

2. **Determine if applicable**
   - MAX_ENTRIES is for LocMemCache
   - Redis handles own memory management
   - May not be needed for Redis backend

3. **Document Redis memory management**
   - Redis uses maxmemory setting
   - Redis eviction policies: allkeys-lru, volatile-lru
   - Configured in redis.conf, not Django

4. **Set MAX_ENTRIES for completeness**
   - Can set to large value: 1000000
   - Or omit for Redis (no effect)
   - Include for documentation

5. **Document Redis maxmemory config**
   - Set in Docker redis.conf
   - Typical: maxmemory 256mb (development)
   - Production: Based on available RAM

6. **Add eviction policy note**
   - Redis default: noeviction (no auto-delete)
   - Recommended: allkeys-lru (delete least recently used)
   - Configure in Redis, not Django

### Cache Size Management
| Backend | Size Limit Method | Django Setting | Redis Setting |
|---------|------------------|---------------|---------------|
| **Redis** | maxmemory in redis.conf | MAX_ENTRIES (ignored) | maxmemory 256mb |
| **LocMemCache** | Django MAX_ENTRIES | MAX_ENTRIES: 300 | N/A |
| **DatabaseCache** | Database size | No limit | N/A |

### Redis Eviction Policies
| Policy | Behavior | Use Case |
|--------|----------|----------|
| **noeviction** | Return error when full | Not recommended |
| **allkeys-lru** | Remove least recently used | General caching |
| **volatile-lru** | Remove LRU with TTL | Mixed TTL/permanent |
| **allkeys-random** | Remove random key | Even access pattern |

### Verification
- MAX_ENTRIES consideration documented
- Redis memory management documented
- Eviction policy documented

---

## Expected Outcome After This Document

```
backend/config/settings/cache.py updated:
├── CACHES dictionary
│   ├── 'default'
│   │   ├── TIMEOUT: 300
│   │   ├── KEY_PREFIX: 'lcc'
│   │   ├── KEY_FUNCTION: (default, planned custom)
│   │   └── MAX_ENTRIES: (optional, documented)
│   └── 'sessions'
│       ├── TIMEOUT: 1209600
│       ├── KEY_PREFIX: 'lcc'
│       └── (same options)
```

---

## Sri Lanka-Specific Considerations

- **Timeout Values:** Consider slower network speeds when setting timeouts
- **Key Prefix:** Use clear prefix for multi-tenant context
- **Memory:** Plan Redis memory based on expected cache size for Sri Lankan SME usage patterns

---

## Notes for AI Agents

1. **Timeout:** Default 300s (5min) is good starting point; tune based on usage
2. **KEY_PREFIX:** Short prefix reduces key size; "lcc" recommended
3. **KEY_FUNCTION:** Will customize in Group C for tenant scoping
4. **MAX_ENTRIES:** Not critical for Redis; focus on redis.conf maxmemory
5. **Documentation:** Document all options even if using defaults
6. **Git Commit:** Can combine with previous cache configuration commit

---

## Validation Checklist

Before proceeding to the next document:

- [ ] Default timeout configured for each cache
- [ ] KEY_PREFIX set to 'lcc' (or chosen value)
- [ ] KEY_FUNCTION decision documented
- [ ] MAX_ENTRIES consideration documented
- [ ] Redis memory management documented
- [ ] All options added to CACHES configuration
- [ ] Django starts without errors
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [03_Tasks-24-26_Session-Configuration.md](03_Tasks-24-26_Session-Configuration.md) to configure Django session engine to use Redis cache.
