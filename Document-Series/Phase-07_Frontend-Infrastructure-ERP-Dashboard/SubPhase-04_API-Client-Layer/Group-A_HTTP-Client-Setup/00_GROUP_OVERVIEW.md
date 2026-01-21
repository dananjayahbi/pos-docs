# Group A: HTTP Client Setup

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** A of F  
> **Tasks Covered:** 01-14  
> **Group Goal:** Create the base Axios HTTP client with configuration and type definitions

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** None (First Group)
- **→ Next Group:** [Group-B_Authentication-Token-Management](../Group-B_Authentication-Token-Management/)

---

## Group Overview

This group establishes the foundation for all API communication. Installs Axios as the HTTP client and creates the services/api/ directory structure. Creates the base apiClient.ts with Axios instance configured with base URL from environment variable, default headers (Content-Type, Accept), request timeout (30 seconds), and CORS credentials. Defines TypeScript types for API responses, errors, and request configuration. Creates a factory function for custom client instances.

### Key Outcomes

- Axios installed as HTTP client
- services/api/ directory created
- apiClient.ts base Axios instance
- Base URL from NEXT_PUBLIC_API_URL
- Default headers configured
- 30-second request timeout
- withCredentials for cookies
- types/api.ts created
- APIResponse<T> generic type
- PaginatedResponse<T> type
- APIError interface
- RequestConfig type
- API client factory function
- Basic request verification

### Technology Context

- **HTTP Client:** Axios
- **Type Safety:** TypeScript strict mode
- **Environment:** Next.js env variables
- **Backend:** Django REST Framework

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-07_Axios-Client-Configuration.md` | Install Axios and configure base client | 01-07 |
| 02 | `02_Tasks-08-14_Types-Factory-Verification.md` | Create type definitions and factory | 08-14 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Install Axios | Low | SubPhase-01 |
| 02 | Create API Client Directory | Low | Task 01 |
| 03 | Create Base API Client | Medium | Task 01 |
| 04 | Configure Base URL | Low | Task 03 |
| 05 | Configure Default Headers | Low | Task 03 |
| 06 | Configure Request Timeout | Low | Task 03 |
| 07 | Configure CORS Credentials | Low | Task 03 |
| 08 | Create Type Definitions | Low | Task 02 |
| 09 | Create APIResponse Type | Low | Task 08 |
| 10 | Create PaginatedResponse Type | Low | Task 08 |
| 11 | Create APIError Type | Low | Task 08 |
| 12 | Create RequestConfig Type | Low | Task 08 |
| 13 | Create API Client Factory | Medium | Task 03 |
| 14 | Verify API Client Setup | Low | Task 07 |

---

## Execution Order

```
Task 01: Install Axios
    │
    ▼
Task 02: Create Directory
    │
    ├──────────────────────┐
    ▼                      ▼
Task 03               Task 08
(Base Client)         (Type Definitions)
    │                      │
    ├────┬────┬────┐       ├────┬────┬────┐
    ▼    ▼    ▼    ▼       ▼    ▼    ▼    ▼
   04   05   06   07      09   10   11   12
   │    │    │    │        │    │    │    │
   └────┴────┴────┘        └────┴────┴────┘
         │                       │
         └───────────┬───────────┘
                     ▼
                Task 13: Factory
                     │
                     ▼
                Task 14: Verify
```

---

## Expected Deliverables

```
frontend/
├── services/
│   └── api/
│       └── apiClient.ts
└── types/
    └── api.ts
```

---

## Notes for AI Agents

### Axios Installation (Task 01)
| Command | Description |
|---------|-------------|
| pnpm add axios | Add Axios HTTP client |

### Base Client Configuration (Tasks 03-07)
| Config | Value |
|--------|-------|
| baseURL | process.env.NEXT_PUBLIC_API_URL |
| timeout | 30000 (30 seconds) |
| withCredentials | true |
| Content-Type | application/json |
| Accept | application/json |

### APIResponse Type (Task 09)
| Field | Type | Description |
|-------|------|-------------|
| data | T | Response payload |
| message | string? | Optional message |
| timestamp | string | ISO timestamp |

### PaginatedResponse Type (Task 10)
| Field | Type | Description |
|-------|------|-------------|
| data | T[] | Array of items |
| pagination.page | number | Current page |
| pagination.pageSize | number | Items per page |
| pagination.totalPages | number | Total pages |
| pagination.totalCount | number | Total items |
| pagination.hasNext | boolean | Has next page |
| pagination.hasPrevious | boolean | Has previous |

### APIError Type (Task 11)
| Field | Type | Description |
|-------|------|-------------|
| code | string | Error code |
| message | string | Error message |
| details | Record? | Field errors |
| timestamp | string | ISO timestamp |

### Factory Function Purpose (Task 13)
- Create isolated Axios instances
- Different base URLs
- Module-specific timeouts
- Custom interceptors per instance
