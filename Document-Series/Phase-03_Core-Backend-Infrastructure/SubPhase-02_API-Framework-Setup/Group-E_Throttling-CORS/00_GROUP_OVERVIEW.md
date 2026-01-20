# Group E: Throttling & CORS

> **Phase:** 03 - Core Backend Infrastructure  
> **SubPhase:** 02 - API Framework Setup  
> **Group:** E of F  
> **Tasks Covered:** 57-72  
> **Group Goal:** Configure rate limiting and CORS for API security

---

## Navigation

- **↑ Parent:** [../00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [../Group-D_Authentication-Setup/](../Group-D_Authentication-Setup/)
- **→ Next Group:** [../Group-F_Pagination-Response/](../Group-F_Pagination-Response/)

---

## Group Overview

This group configures API throttling (rate limiting) and CORS (Cross-Origin Resource Sharing) settings to protect the API from abuse and enable frontend access.

### Key Outcomes
- Configure throttle classes
- Set anonymous user rate limits (100/hour)
- Set authenticated user rate limits (1000/hour)
- Configure burst rate protection
- Configure CORS allowed origins
- Configure CORS credentials
- Configure CORS allowed methods
- Configure CORS allowed headers
- Add CORS middleware
- Create dev CORS settings (permissive)
- Create prod CORS settings (strict)
- Test and document settings

### Technology Context
- **Throttling:** Prevent API abuse
- **CORS:** Cross-origin requests
- **Dev vs Prod:** Different CORS configs

---

## Documents in This Group

| # | Document | Tasks | Description |
|---|----------|-------|-------------|
| 01 | 01_Tasks-57-63_Throttling-Config.md | 57-63 | Throttle classes, anon rate, user rate, burst protection |
| 02 | 02_Tasks-64-69_CORS-Setup.md | 64-69 | Allowed origins, credentials, methods, headers, middleware, dev config |
| 03 | 03_Tasks-70-72_Prod-Test-Docs.md | 70-72 | Prod CORS config, test headers, documentation |

---

## Task Summary

| Task # | Task Name | Dependencies | Complexity |
|--------|-----------|--------------|------------|
| 57 | Configure DEFAULT_THROTTLE_CLASSES | Task 56 | Simple |
| 58 | Create AnonRateThrottle Settings | Task 57 | Simple |
| 59 | Create UserRateThrottle Settings | Task 58 | Simple |
| 60 | Set DEFAULT_THROTTLE_RATES | Task 59 | Medium |
| 61 | Set Anon Rate | Task 60 | Simple |
| 62 | Set User Rate | Task 61 | Simple |
| 63 | Create Burst Rate | Task 62 | Medium |
| 64 | Configure CORS_ALLOWED_ORIGINS | Task 63 | Simple |
| 65 | Configure CORS_ALLOW_CREDENTIALS | Task 64 | Simple |
| 66 | Configure CORS_ALLOW_METHODS | Task 65 | Simple |
| 67 | Configure CORS_ALLOW_HEADERS | Task 66 | Simple |
| 68 | Add CorsMiddleware | Task 67 | Simple |
| 69 | Configure Dev CORS Settings | Task 68 | Simple |
| 70 | Configure Prod CORS Settings | Task 69 | Medium |
| 71 | Test CORS Headers | Task 70 | Simple |
| 72 | Document Throttling & CORS | Task 71 | Medium |

---

## Execution Order

```
01_Tasks-57-63_Throttling-Config.md
        │
        ▼
02_Tasks-64-69_CORS-Setup.md
        │
        ▼
03_Tasks-70-72_Prod-Test-Docs.md
```

---

## Expected Deliverables

After completing this group:

```
backend/config/settings/
├── base.py               # Import CORS settings
├── drf.py                # Updated with throttling
├── cors.py               # CORS configuration
├── development.py        # Dev CORS overrides
└── production.py         # Prod CORS settings
```

---

## Throttling Configuration

```python
# config/settings/drf.py
REST_FRAMEWORK = {
    # ...existing settings...
    
    # Throttling
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.AnonRateThrottle',
        'rest_framework.throttling.UserRateThrottle',
    ],
    'DEFAULT_THROTTLE_RATES': {
        'anon': '100/hour',
        'user': '1000/hour',
        'burst': '60/minute',  # Short burst protection
    },
}
```

---

## CORS Configuration

```python
# config/settings/cors.py

# Development (permissive)
CORS_ALLOW_ALL_ORIGINS = True  # Only for development!

# Production (strict)
CORS_ALLOWED_ORIGINS = [
    'https://app.lankacommerce.cloud',
    'https://admin.lankacommerce.cloud',
    'https://webstore.lankacommerce.cloud',
]

# Common settings
CORS_ALLOW_CREDENTIALS = True

CORS_ALLOW_METHODS = [
    'DELETE',
    'GET',
    'OPTIONS',
    'PATCH',
    'POST',
    'PUT',
]

CORS_ALLOW_HEADERS = [
    'accept',
    'accept-encoding',
    'authorization',
    'content-type',
    'dnt',
    'origin',
    'user-agent',
    'x-csrftoken',
    'x-requested-with',
    'x-tenant-id',
]
```

---

## Middleware Order

```python
MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',  # MUST be first
    'django.middleware.security.SecurityMiddleware',
    # ...rest of middleware
]
```

---

## Rate Limits Summary

| User Type | Rate | Purpose |
|-----------|------|---------|
| Anonymous | 100/hour | Prevent abuse from unauthenticated users |
| Authenticated | 1000/hour | Allow higher limits for users |
| Burst | 60/minute | Prevent rapid-fire requests |

---

## Notes for AI Agents

1. **Dependencies:** Requires Group D complete
2. **Middleware Order:** CORS must be FIRST
3. **Dev vs Prod:** Different CORS configs!
4. **Throttling:** Protect against abuse
5. **X-Tenant-ID:** Allow tenant header in CORS
6. **Git Commit:** Commit after completing this group

