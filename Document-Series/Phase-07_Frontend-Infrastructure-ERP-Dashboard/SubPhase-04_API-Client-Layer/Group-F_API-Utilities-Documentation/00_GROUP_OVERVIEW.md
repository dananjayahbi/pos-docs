# Group F: API Utilities & Documentation

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** F of F  
> **Tasks Covered:** 79-90  
> **Group Goal:** Create API utilities, mock server, tests, and documentation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Module-API-Services](../Group-E_Module-API-Services/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-05_State-Management](../SubPhase-05_State-Management/)

---

## Group Overview

This group creates API utilities and documentation. Implements query string builder for URL parameters, URL path builder for dynamic paths, FormData builder for file uploads, file upload and download helpers. Creates in-memory cache layer for GET requests and client-side rate limiter. Creates service index file for clean imports. Sets up MSW (Mock Service Worker) for development mocking. Creates unit tests and comprehensive API documentation.

### Key Outcomes

- Query string builder utility
- URL path builder utility
- FormData builder utility
- File upload helper
- File download helper
- API cache layer
- API rate limiter
- Service index file (index.ts)
- MSW mock server setup
- API client unit tests
- API documentation
- Final verification completed

### Technology Context

- **Query Strings:** URLSearchParams API
- **File Uploads:** FormData, multipart
- **Mocking:** MSW (Mock Service Worker)
- **Testing:** Jest or Vitest
- **Caching:** In-memory Map

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-85_Utilities-Cache-RateLimiter.md` | Create API utilities, cache, and rate limiter | 79-85 |
| 02 | `02_Tasks-86-90_Index-Mock-Test-Docs.md` | Create index, MSW, tests, and documentation | 86-90 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create Query String Builder | Low | Task 02 |
| 80 | Create URL Path Builder | Low | Task 02 |
| 81 | Create Form Data Builder | Low | Task 02 |
| 82 | Create File Upload Helper | Medium | Task 81 |
| 83 | Create Download File Helper | Low | Task 02 |
| 84 | Create API Cache Layer | Medium | Task 02 |
| 85 | Create API Rate Limiter | Medium | Task 02 |
| 86 | Create Service Index File | Low | Task 78 |
| 87 | Create API Mock Server | Medium | Task 86 |
| 88 | Create API Client Tests | Medium | Task 87 |
| 89 | Create API Documentation | Medium | Task 88 |
| 90 | Final Verification & Integration | Low | Task 89 |

---

## Execution Order

```
Task 79: Query String Builder
    │
    ▼
Task 80: URL Path Builder
    │
    ▼
Task 81: FormData Builder
    │
    ▼
Task 82: File Upload Helper
    │
    ├──────────────────────┐
    ▼                      ▼
Task 83               Tasks 84-85
(Download)            (Cache, Rate Limiter)
    │                      │
    └──────────┬───────────┘
               ▼
         Task 86: Index File
               │
               ▼
         Task 87: MSW Mock Server
               │
               ▼
         Task 88: Unit Tests
               │
               ▼
         Task 89: Documentation
               │
               ▼
         Task 90: Verification
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   ├── queryString.ts
│   ├── urlBuilder.ts
│   ├── formDataBuilder.ts
│   ├── fileHelpers.ts
│   ├── apiCache.ts
│   └── rateLimiter.ts
├── services/
│   └── api/
│       └── index.ts
├── mocks/
│   ├── handlers.ts
│   └── server.ts
├── __tests__/
│   └── api/
│       ├── apiClient.test.ts
│       └── services.test.ts
└── docs/
    └── api/
        └── README.md
```

---

## Notes for AI Agents

### Query String Builder (Task 79)
| Feature | Description |
|---------|-------------|
| Nested objects | Flatten with dot notation |
| Arrays | Repeat key or comma-separate |
| Null/undefined | Omit from output |
| Encoding | URL encode all values |

### URL Path Builder (Task 80)
| Feature | Description |
|---------|-------------|
| Path params | Replace :id with values |
| Query params | Append as query string |
| Base URL | Prepend base URL |

### FormData Builder (Task 81)
| Feature | Description |
|---------|-------------|
| Files | Append as File objects |
| Objects | JSON stringify nested |
| Arrays | Multiple entries or JSON |

### File Upload Helper (Task 82)
| Feature | Description |
|---------|-------------|
| Progress | XHR progress events |
| Multiple files | Array of files |
| Validation | Type and size checks |
| Cancel | AbortController support |

### Download File Helper (Task 83)
| Feature | Description |
|---------|-------------|
| Blob | Handle blob response |
| Filename | Extract from headers |
| Trigger | Create anchor click |

### API Cache Configuration (Task 84)
| Option | Default | Description |
|--------|---------|-------------|
| maxAge | 5 minutes | Cache TTL |
| maxSize | 100 | Max cached items |
| keyFn | URL + params | Cache key generator |

### Rate Limiter Configuration (Task 85)
| Option | Default | Description |
|--------|---------|-------------|
| maxRequests | 10 | Max requests per window |
| windowMs | 60000 | Window size (1 minute) |
| delay | true | Delay instead of reject |

### MSW Setup (Task 87)
- handlers.ts defines mock responses
- server.ts creates MSW server
- Intercept in development/test
- Match API endpoints

### API Client Tests (Task 88)
| Test Case | Description |
|-----------|-------------|
| GET request | Success response |
| POST request | Create with body |
| Error handling | 401, 403, 500 |
| Token refresh | 401 with retry |
| Retry logic | Network errors |

### API Documentation (Task 89)
- Service function signatures
- Type definitions
- Usage examples
- Error handling patterns
- Authentication flow
