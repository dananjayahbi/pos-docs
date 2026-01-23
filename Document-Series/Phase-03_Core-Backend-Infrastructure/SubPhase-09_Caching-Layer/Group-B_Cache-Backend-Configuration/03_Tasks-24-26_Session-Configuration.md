# Tasks 24-26: Session Configuration

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 09 - Caching Layer  
> **Group:** B - Cache Backend Configuration  
> **Document:** 03 of 04  
> **Tasks Covered:** 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [02_Tasks-20-23_Cache-Options.md](02_Tasks-20-23_Cache-Options.md)
- **→ Next Document:** [04_Tasks-27-30_Timeout-Constants.md](04_Tasks-27-30_Timeout-Constants.md)

---

## Document Overview

This document covers configuration of Django's session framework to use Redis cache for session storage instead of the default database backend.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 24 | Configure SESSION_ENGINE | Simple |
| 25 | Configure SESSION_CACHE_ALIAS | Simple |
| 26 | Configure SESSION_COOKIE_AGE | Simple |

---

## Task 24: Configure SESSION_ENGINE

### Overview
Configure Django to use cache-based session engine instead of database sessions.

### Dependencies
- Task 23: Configure MAX_ENTRIES

### Instructions

1. **Understand session engine options**
   - Database: Default, uses django_session table
   - Cache: Stores sessions in cache only
   - Cached DB: Writes to cache and database
   - File: Stores in filesystem
   - Cookie: Stores in client cookie

2. **Choose cache engine**
   - SESSION_ENGINE: 'django.contrib.sessions.backends.cache'
   - Fastest session backend
   - No database writes per request

3. **Add to base.py settings**
   - Add SESSION_ENGINE setting
   - Place in session configuration section
   - Add comment explaining choice

4. **Document benefits**
   - No database I/O for sessions
   - Automatic expiration via Redis TTL
   - Scales horizontally
   - Reduces database load

5. **Document considerations**
   - Sessions lost if Redis flushes
   - No persistence to database
   - Ensure Redis backups if critical

6. **Alternative: cached_db**
   - SESSION_ENGINE: 'django.contrib.sessions.backends.cached_db'
   - Writes to both cache and database
   - Fallback if cache fails
   - Consider for mission-critical applications

### Session Engine Comparison
| Engine | Speed | Persistence | Use Case |
|--------|-------|-------------|----------|
| **cache** | Fastest | Cache only | Standard production |
| **cached_db** | Fast | Cache + DB | Mission-critical |
| **db** | Slow | Database | Small sites |
| **file** | Medium | Filesystem | Development |

### Verification
- SESSION_ENGINE set to cache backend
- Setting added to base.py
- Benefits and trade-offs documented

---

## Task 25: Configure SESSION_CACHE_ALIAS

### Overview
Specify which cache alias Django should use for session storage.

### Dependencies
- Task 24: Configure SESSION_ENGINE

### Instructions

1. **Understand cache alias setting**
   - SESSION_CACHE_ALIAS specifies which CACHES entry to use
   - Must match an alias in CACHES dictionary
   - Defaults to 'default' if not specified

2. **Set to sessions alias**
   - SESSION_CACHE_ALIAS: 'sessions'
   - Uses dedicated Redis database (DB 1)
   - Separates sessions from general cache

3. **Add to base.py**
   - Add below SESSION_ENGINE setting
   - Group all session settings together
   - Add comment explaining database separation

4. **Verify sessions cache exists**
   - Ensure 'sessions' alias defined in CACHES
   - Check Redis DB 1 is used
   - Verify timeout matches session age

5. **Document separation benefits**
   - Can clear default cache without affecting sessions
   - Independent monitoring of session storage
   - Different Redis configuration possible
   - Easier debugging

### Session Cache Configuration Flow
```
Session Request Flow:
├── User makes request
├── Django reads session from Redis DB 1
├── Middleware processes request
├── View executes
├── Django writes session to Redis DB 1
└── Session auto-expires per timeout
```

### Verification
- SESSION_CACHE_ALIAS set to 'sessions'
- sessions cache alias exists in CACHES
- Redis DB 1 used for sessions
- Setting documented

---

## Task 26: Configure SESSION_COOKIE_AGE

### Overview
Configure how long user sessions should remain valid.

### Dependencies
- Task 25: Configure SESSION_CACHE_ALIAS

### Instructions

1. **Understand SESSION_COOKIE_AGE**
   - Age of session cookie in seconds
   - Determines when user must re-authenticate
   - Default: 1209600 (2 weeks)

2. **Review default value**
   - Django default: 1209600 seconds (2 weeks)
   - Check if appropriate for application
   - Consider security vs convenience

3. **Set SESSION_COOKIE_AGE**
   - Keep default: 1209600
   - Or adjust based on security requirements
   - Add to base.py settings

4. **Configure related session settings**
   - SESSION_COOKIE_SECURE: True (production, HTTPS only)
   - SESSION_COOKIE_HTTPONLY: True (prevent JavaScript access)
   - SESSION_COOKIE_SAMESITE: 'Lax' or 'Strict'
   - SESSION_SAVE_EVERY_REQUEST: False (performance)

5. **Match cache timeout**
   - Ensure sessions cache TIMEOUT matches SESSION_COOKIE_AGE
   - Prevents premature session expiration
   - Already configured in sessions cache (1209600)

6. **Document session security settings**
   - Explain each security-related session setting
   - Note production requirements (HTTPS)
   - Reference OWASP session management guidelines

### Session Settings Reference
| Setting | Value | Purpose |
|---------|-------|---------|
| **SESSION_ENGINE** | cached backend | Fast session storage |
| **SESSION_CACHE_ALIAS** | 'sessions' | Dedicated cache |
| **SESSION_COOKIE_AGE** | 1209600 (2 weeks) | Session lifetime |
| **SESSION_COOKIE_SECURE** | True (prod) | HTTPS only |
| **SESSION_COOKIE_HTTPONLY** | True | No JavaScript access |
| **SESSION_COOKIE_SAMESITE** | 'Lax' | CSRF protection |
| **SESSION_SAVE_EVERY_REQUEST** | False | Update on changes only |

### Session Age Recommendations
| Application Type | Recommended Age | Reasoning |
|-----------------|----------------|-----------|
| **E-commerce** | 1209600 (2 weeks) | Convenience for shopping |
| **Banking** | 900 (15 minutes) | High security requirement |
| **Social Media** | 2592000 (30 days) | Long-term engagement |
| **Admin Panel** | 3600 (1 hour) | Security for admin access |

### Verification
- SESSION_COOKIE_AGE configured
- Value matches cache timeout
- Security settings configured
- All session settings documented

---

## Expected Outcome After This Document

```
backend/config/settings/base.py updated with:
# Session Configuration
SESSION_ENGINE = 'django.contrib.sessions.backends.cache'
SESSION_CACHE_ALIAS = 'sessions'
SESSION_COOKIE_AGE = 1209600  # 2 weeks
SESSION_COOKIE_SECURE = True  # Production only
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
SESSION_SAVE_EVERY_REQUEST = False
```

---

## Sri Lanka-Specific Considerations

- **Session Duration:** 2 weeks appropriate for Sri Lankan SME users
- **HTTPS Requirement:** Ensure SSL certificates from local providers (LK Domain Registry)
- **Cookie Security:** Important for POS and e-commerce applications
- **Session Persistence:** Consider cached_db if Redis reliability concerns

---

## Common Issues and Solutions

### Issue 1: Sessions Not Persisting
**Symptoms:** Users logged out unexpectedly

**Solutions:**
- Verify SESSION_ENGINE set correctly
- Check SESSION_CACHE_ALIAS matches CACHES key
- Ensure Redis is running
- Verify cache timeout not too short
- Check SESSION_COOKIE_AGE value

### Issue 2: Session Data Lost on Redis Restart
**Symptoms:** All users logged out when Redis restarts

**Solutions:**
- Enable Redis persistence (RDB or AOF)
- Consider cached_db engine for persistence
- Implement session warning for users
- Set up Redis high availability

### Issue 3: SESSION_COOKIE_SECURE Errors in Development
**Symptoms:** Can't set cookies in local development

**Solutions:**
- Set SESSION_COOKIE_SECURE = False in development settings
- Or use HTTPS in local development
- Override in settings/development.py

### Issue 4: Sessions Working But Slow
**Symptoms:** Session reads/writes are slow

**Solutions:**
- Check Redis connection latency
- Verify using sessions cache alias
- Check Redis isn't overloaded
- Monitor Redis performance

---

## Notes for AI Agents

1. **Engine Choice:** cache engine recommended for most applications
2. **Cache Alias:** Always use dedicated 'sessions' alias
3. **Security:** All COOKIE_* security settings important for production
4. **Timeout Match:** Cache timeout must match or exceed SESSION_COOKIE_AGE
5. **HTTPS:** SESSION_COOKIE_SECURE requires HTTPS in production
6. **Performance:** SESSION_SAVE_EVERY_REQUEST = False for better performance
7. **Testing:** Test session persistence across requests
8. **Git Commit:** Commit session configuration separately if desired

---

## Validation Checklist

Before proceeding to the next document:

- [ ] SESSION_ENGINE set to cache backend
- [ ] SESSION_CACHE_ALIAS set to 'sessions'
- [ ] SESSION_COOKIE_AGE configured
- [ ] SESSION_COOKIE_SECURE set for production
- [ ] SESSION_COOKIE_HTTPONLY set to True
- [ ] SESSION_COOKIE_SAMESITE configured
- [ ] SESSION_SAVE_EVERY_REQUEST set to False
- [ ] Cache timeout matches session age
- [ ] Django starts without errors
- [ ] Session persistence tested
- [ ] Changes committed to Git

---

## Next Steps

Proceed to [04_Tasks-27-30_Timeout-Constants.md](04_Tasks-27-30_Timeout-Constants.md) to create cache timeout constants for consistent TTL management across the application.
