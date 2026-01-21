# Group D: TanStack Query Setup

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** D of F  
> **Tasks Covered:** 45-60  
> **Group Goal:** Configure TanStack Query (React Query) for server state management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Auth-State-Store](../Group-C_Auth-State-Store/)
- **→ Next Group:** [Group-E_Module-Query-Hooks](../Group-E_Module-Query-Hooks/)

---

## Group Overview

This group installs and configures TanStack Query (React Query) for server state management. Installs the query package and DevTools. Creates QueryClient with default options: staleTime (5 minutes), gcTime (10 minutes), retry configuration, and refetchOnWindowFocus behavior. Sets up QueryClientProvider in root layout and adds ReactQueryDevtools. Creates a centralized query key factory with module-specific keys for products, inventory, customers, sales, and HR.

### Key Outcomes

- TanStack Query installed
- TanStack Query DevTools installed
- QueryClient configured
- Default staleTime (5 min)
- Default gcTime (10 min)
- Default retry config
- refetchOnWindowFocus configured
- QueryClientProvider in layout
- ReactQueryDevtools added
- Query key factory created
- Product query keys defined
- Inventory query keys defined
- Customer query keys defined
- Sales query keys defined
- HR query keys defined
- QueryKey index file created

### Technology Context

- **Server State:** TanStack Query v5
- **Caching:** Built-in cache with TTL
- **DevTools:** In-browser debugging
- **Query Keys:** Factory pattern

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-45-53_Installation-Configuration.md` | Install and configure TanStack Query | 45-53 |
| 02 | `02_Tasks-54-60_Query-Key-Factory.md` | Create query key factory for all modules | 54-60 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 45 | Install TanStack Query | Low | SubPhase-04 |
| 46 | Install DevTools | Low | Task 45 |
| 47 | Create QueryClient Configuration | Medium | Task 45 |
| 48 | Set Default Stale Time | Low | Task 47 |
| 49 | Set Default Cache Time | Low | Task 47 |
| 50 | Set Default Retry Config | Low | Task 47 |
| 51 | Configure Refetch on Window Focus | Low | Task 47 |
| 52 | Create QueryClientProvider | Low | Task 47 |
| 53 | Add ReactQueryDevtools | Low | Task 46 |
| 54 | Create Query Key Factory | Medium | Task 45 |
| 55 | Define Product Query Keys | Low | Task 54 |
| 56 | Define Inventory Query Keys | Low | Task 54 |
| 57 | Define Customer Query Keys | Low | Task 54 |
| 58 | Define Sales Query Keys | Low | Task 54 |
| 59 | Define HR Query Keys | Low | Task 54 |
| 60 | Create QueryKey Index File | Low | Task 59 |

---

## Execution Order

```
Task 45: Install TanStack Query
    │
    ├──────────────────────┐
    ▼                      ▼
Task 46               Task 47
(DevTools)            (QueryClient)
    │                      │
    │               ┌──────┼──────┬──────┐
    │               ▼      ▼      ▼      ▼
    │              48     49     50     51
    │               │      │      │      │
    │               └──────┴──────┴──────┘
    │                      │
    │                      ▼
    │                 Task 52: Provider
    │                      │
    └──────────────────────┤
                           ▼
                      Task 53: DevTools
                           │
                           ▼
                      Task 54: Key Factory
                           │
              ┌────┬───────┼───────┬────┐
              ▼    ▼       ▼       ▼    ▼
             55   56      57      58   59
              │    │       │       │    │
              └────┴───────┴───────┴────┘
                           │
                           ▼
                      Task 60: Index
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   ├── queryClient.ts
│   └── queryKeys.ts
└── providers/
    └── QueryProvider.tsx
```

---

## Notes for AI Agents

### Package Installation (Tasks 45-46)
| Package | Purpose |
|---------|---------|
| @tanstack/react-query | Core library |
| @tanstack/react-query-devtools | Browser devtools |

### QueryClient Defaults (Tasks 48-51)
| Option | Value | Description |
|--------|-------|-------------|
| staleTime | 5 * 60 * 1000 | Data fresh for 5 min |
| gcTime | 10 * 60 * 1000 | Cache kept 10 min |
| retry | 3 | Retry failed requests |
| retryDelay | exponential | Backoff strategy |
| refetchOnWindowFocus | true | Refetch on focus |

### QueryClientProvider Setup (Task 52)
- Create QueryClient instance
- Wrap app in QueryClientProvider
- Pass client as prop

### DevTools Configuration (Task 53)
| Option | Value | Description |
|--------|-------|-------------|
| initialIsOpen | false | Start closed |
| position | bottom-right | DevTools position |

### Query Key Factory Pattern (Task 54)
| Method | Purpose |
|--------|---------|
| all | Base key for module |
| lists | Key for list queries |
| list(filters) | Key with specific filters |
| details | Key for detail queries |
| detail(id) | Key for specific item |

### Product Keys (Task 55)
| Key | Structure |
|-----|-----------|
| all | ['products'] |
| lists | ['products', 'list'] |
| list | ['products', 'list', filters] |
| details | ['products', 'detail'] |
| detail | ['products', 'detail', id] |

### Query Key Benefits
- Consistent cache keys
- Easy invalidation
- Type-safe with const assertions
- Hierarchical invalidation
