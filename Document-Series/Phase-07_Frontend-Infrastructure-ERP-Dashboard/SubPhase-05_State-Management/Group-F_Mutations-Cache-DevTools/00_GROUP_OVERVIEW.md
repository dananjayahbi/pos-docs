# Group F: Mutations, Cache & DevTools

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** F of F  
> **Tasks Covered:** 79-88  
> **Group Goal:** Create mutation hooks with optimistic updates, cache invalidation, and documentation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Module-Query-Hooks](../Group-E_Module-Query-Hooks/)
- **→ Next Group:** None (Last Group) | **Next SubPhase:** [SubPhase-06_Authentication-UI](../SubPhase-06_Authentication-UI/)

---

## Group Overview

This group creates mutation hooks for data modification with optimistic updates and cache management. Creates useCreateProduct, useUpdateProduct (with optimistic update), and useDeleteProduct (with cache invalidation) mutations. Creates a generic mutation factory for common patterns. Implements optimistic update and cache invalidation strategies. Creates usePrefetch hook for prefetching data on hover. Creates infinite query hooks for virtualized lists. Documents all state management patterns and performs final verification.

### Key Outcomes

- useCreateProduct mutation
- useUpdateProduct mutation (optimistic)
- useDeleteProduct mutation (invalidation)
- Generic mutation factory
- Optimistic update patterns
- Cache invalidation strategies
- usePrefetch hook
- Infinite query hooks
- State management documentation
- Final verification completed

### Technology Context

- **Mutations:** useMutation from TanStack
- **Optimistic Updates:** Local cache update
- **Cache Invalidation:** queryClient.invalidateQueries
- **Infinite Queries:** useInfiniteQuery

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-84_Mutations-Cache-Strategies.md` | Create mutations and cache strategies | 79-84 |
| 02 | `02_Tasks-85-88_Prefetch-Infinite-Docs.md` | Create prefetch, infinite queries, and documentation | 85-88 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create useCreateProduct Mutation | Medium | Task 78 |
| 80 | Create useUpdateProduct Mutation | Medium | Task 79 |
| 81 | Create useDeleteProduct Mutation | Medium | Task 79 |
| 82 | Create Generic Mutation Factory | High | Task 81 |
| 83 | Implement Optimistic Updates | Medium | Task 80 |
| 84 | Implement Cache Invalidation | Medium | Task 81 |
| 85 | Create usePrefetch Hook | Low | Task 78 |
| 86 | Create Infinite Query Hooks | Medium | Task 78 |
| 87 | Create State Management Documentation | Medium | Task 86 |
| 88 | Final Verification & Testing | Low | Task 87 |

---

## Execution Order

```
Task 78: Hooks Index (from Group E)
    │
    ▼
Task 79: useCreateProduct
    │
    ├──────────────────────┐
    ▼                      ▼
Task 80               Task 81
(update)              (delete)
    │                      │
    ├──────────────────────┤
    ▼                      ▼
Task 83               Task 84
(optimistic)          (invalidation)
    │                      │
    └──────────┬───────────┘
               ▼
          Task 82: Factory
               │
    ┌──────────┼──────────┐
    ▼          ▼          ▼
Task 85    Task 86    Task 87
(prefetch) (infinite)  (docs)
    │          │          │
    └──────────┴──────────┘
               │
               ▼
          Task 88: Verify
```

---

## Expected Deliverables

```
frontend/
├── hooks/
│   ├── mutations/
│   │   ├── useProductMutations.ts
│   │   ├── useCustomerMutations.ts
│   │   ├── useOrderMutations.ts
│   │   └── index.ts
│   ├── usePrefetch.ts
│   └── index.ts
└── docs/
    └── state-management/
        └── README.md
```

---

## Notes for AI Agents

### Mutation Hook Pattern
| Property | Type | Description |
|----------|------|-------------|
| mutationFn | function | API service call |
| onMutate | function | Before mutation |
| onSuccess | function | On success |
| onError | function | On error |
| onSettled | function | Always runs |

### useCreateProduct (Task 79)
| Step | Action |
|------|--------|
| mutationFn | productService.create |
| onSuccess | Invalidate products list |
| onSuccess | Show success toast |
| onError | Show error toast |

### Optimistic Update Pattern (Task 83)
| Step | Action |
|------|--------|
| onMutate | Cancel outgoing queries |
| onMutate | Get previous data |
| onMutate | Update cache optimistically |
| onMutate | Return { previousData } |
| onError | Rollback to previousData |
| onSettled | Invalidate to sync |

### Cache Invalidation Strategies (Task 84)
| Strategy | When to Use |
|----------|-------------|
| Exact | Single item changed |
| Partial | List needs refresh |
| All | Module data changed |
| Related | Cross-module impact |

### Invalidation Examples
| Action | Invalidate |
|--------|------------|
| Create product | products.lists() |
| Update product | products.detail(id), products.lists() |
| Delete product | products.all |
| Create order | orders.lists(), inventory.all |

### usePrefetch Hook (Task 85)
| Param | Type | Description |
|-------|------|-------------|
| queryKey | array | Query to prefetch |
| queryFn | function | Fetch function |
| staleTime | number | Freshness threshold |

### Prefetch on Hover Pattern
- onMouseEnter triggers prefetch
- Only if data not in cache
- Improves perceived performance

### Infinite Query Hook Pattern (Task 86)
| Property | Type | Description |
|----------|------|-------------|
| queryKey | array | Base query key |
| queryFn | function | Fetch page |
| getNextPageParam | function | Next page cursor |
| getPreviousPageParam | function | Prev page cursor |

### Documentation Topics (Task 87)
| Topic | Description |
|-------|-------------|
| Store structure | Zustand stores overview |
| Query patterns | TanStack Query usage |
| Mutation patterns | Create/Update/Delete |
| Cache strategies | Invalidation guide |
| Performance tips | Optimization patterns |
