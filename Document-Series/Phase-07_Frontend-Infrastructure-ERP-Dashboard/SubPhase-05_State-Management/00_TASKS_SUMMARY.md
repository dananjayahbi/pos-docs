# SubPhase 05: State Management - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 05 of 14  
> **SubPhase Goal:** Configure Zustand for global UI state and TanStack Query for server state management  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 8-10 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_API-Client-Layer](../SubPhase-04_API-Client-Layer/)
- **→ Next SubPhase:** [SubPhase-06_Authentication-UI](../SubPhase-06_Authentication-UI/)

---

## SubPhase Overview

This sub-phase establishes the state management layer for the frontend application. It uses Zustand for client-side global state (UI state, auth state) and TanStack Query (React Query) for server state (API data caching, mutations, and synchronization).

### Key Outcomes
- Zustand configured with persistence
- Global UI state store (sidebar, theme, modals)
- Auth state store (user, tenant, permissions)
- TanStack Query configured with defaults
- Query hooks for all API services
- Mutation hooks with optimistic updates
- Cache invalidation strategies
- DevTools integration for debugging

### Technology Context
- **Client State:** Zustand (lightweight, no boilerplate)
- **Server State:** TanStack Query v5 (React Query)
- **Persistence:** zustand/middleware/persist
- **DevTools:** TanStack Query DevTools, Zustand DevTools

### State Categories
- **UI State:** Sidebar, modals, theme, notifications
- **Auth State:** User, tenant, tokens, permissions
- **Server State:** Products, inventory, customers, orders, etc.

---

## Task Execution Order

```
TASK GROUP A: Zustand Installation & Configuration (Tasks 01-14)
        │
        ▼
TASK GROUP B: UI State Stores (Tasks 15-30)
        │
        ▼
TASK GROUP C: Auth State Store (Tasks 31-44)
        │
        ▼
TASK GROUP D: TanStack Query Setup (Tasks 45-60)
        │
        ▼
TASK GROUP E: Module Query Hooks (Tasks 61-78)
        │
        ▼
TASK GROUP F: Mutations, Cache & DevTools (Tasks 79-88)
```

---

## Task Index

### Group A: Zustand Installation & Configuration (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install Zustand** | Add zustand as dependency for client state | SubPhase-04 | 🔴 Not Created |
| 02 | **Create Store Directory** | Set up store/ directory structure | Task 01 | 🔴 Not Created |
| 03 | **Create Store Types** | Define TypeScript types for store states | Task 02 | 🔴 Not Created |
| 04 | **Configure Zustand Immer Middleware** | Install and configure immer for immutable updates | Task 01 | 🔴 Not Created |
| 05 | **Configure Zustand Persist Middleware** | Set up persist middleware for localStorage | Task 01 | 🔴 Not Created |
| 06 | **Configure Zustand DevTools** | Enable devtools middleware for debugging | Task 01 | 🔴 Not Created |
| 07 | **Create createStore Utility** | Create helper to combine middlewares | Task 04-06 | 🔴 Not Created |
| 08 | **Create Store Selector Patterns** | Define patterns for efficient selectors | Task 03 | 🔴 Not Created |
| 09 | **Create useShallow Hook** | Set up useShallow for optimized subscriptions | Task 01 | 🔴 Not Created |
| 10 | **Create Store Reset Utilities** | Create utility to reset stores on logout | Task 02 | 🔴 Not Created |
| 11 | **Create Store Hydration Handler** | Handle SSR hydration for persisted stores | Task 05 | 🔴 Not Created |
| 12 | **Create Store Index File** | Create store/index.ts exporting all stores | Task 02 | 🔴 Not Created |
| 13 | **Install Zustand DevTools Extension** | Document browser extension installation | Task 06 | 🔴 Not Created |
| 14 | **Verify Zustand Setup** | Test basic store creation and updates | Task 07 | 🔴 Not Created |

---

### Group B: UI State Stores (Tasks 15-30)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create UI Store** | Create store/uiStore.ts for UI state | Task 14 | 🔴 Not Created |
| 16 | **Define Sidebar State** | Add isCollapsed, activeMenu state | Task 15 | 🔴 Not Created |
| 17 | **Create toggleSidebar Action** | Action to toggle sidebar collapsed state | Task 16 | 🔴 Not Created |
| 18 | **Create setActiveMenu Action** | Action to set current active menu item | Task 16 | 🔴 Not Created |
| 19 | **Define Theme State** | Add theme (light/dark/system) state | Task 15 | 🔴 Not Created |
| 20 | **Create setTheme Action** | Action to change theme preference | Task 19 | 🔴 Not Created |
| 21 | **Define Modal State** | Add modal registry (open modals, props) | Task 15 | 🔴 Not Created |
| 22 | **Create openModal Action** | Action to open modal by ID with props | Task 21 | 🔴 Not Created |
| 23 | **Create closeModal Action** | Action to close modal by ID | Task 21 | 🔴 Not Created |
| 24 | **Create closeAllModals Action** | Action to close all open modals | Task 21 | 🔴 Not Created |
| 25 | **Define Notification State** | Add notifications array with types | Task 15 | 🔴 Not Created |
| 26 | **Create addNotification Action** | Action to add notification to queue | Task 25 | 🔴 Not Created |
| 27 | **Create removeNotification Action** | Action to remove notification by ID | Task 25 | 🔴 Not Created |
| 28 | **Create clearNotifications Action** | Action to clear all notifications | Task 25 | 🔴 Not Created |
| 29 | **Define CommandPalette State** | Add isOpen state for command palette | Task 15 | 🔴 Not Created |
| 30 | **Create toggleCommandPalette Action** | Action to open/close command palette | Task 29 | 🔴 Not Created |

---

### Group C: Auth State Store (Tasks 31-44)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 31 | **Create Auth Store** | Create store/authStore.ts for auth state | Task 14 | 🔴 Not Created |
| 32 | **Define User State** | Add user object with profile data | Task 31 | 🔴 Not Created |
| 33 | **Define Tenant State** | Add tenant object with subscription info | Task 31 | 🔴 Not Created |
| 34 | **Define Permissions State** | Add permissions array for RBAC | Task 31 | 🔴 Not Created |
| 35 | **Define Auth Status State** | Add isAuthenticated, isLoading states | Task 31 | 🔴 Not Created |
| 36 | **Create setUser Action** | Action to set user after login | Task 32 | 🔴 Not Created |
| 37 | **Create setTenant Action** | Action to set current tenant | Task 33 | 🔴 Not Created |
| 38 | **Create setPermissions Action** | Action to set user permissions | Task 34 | 🔴 Not Created |
| 39 | **Create login Action** | Composite action for login flow | Task 36-38 | 🔴 Not Created |
| 40 | **Create logout Action** | Action to clear auth state and tokens | Task 31 | 🔴 Not Created |
| 41 | **Create hasPermission Selector** | Selector to check specific permission | Task 34 | 🔴 Not Created |
| 42 | **Create canAccess Selector** | Selector for route/feature access check | Task 41 | 🔴 Not Created |
| 43 | **Persist Auth Store** | Configure persistence for auth state | Task 31 | 🔴 Not Created |
| 44 | **Create useAuth Hook** | Convenience hook for auth state access | Task 43 | 🔴 Not Created |

---

### Group D: TanStack Query Setup (Tasks 45-60)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 45 | **Install TanStack Query** | Add @tanstack/react-query as dependency | SubPhase-04 | 🔴 Not Created |
| 46 | **Install TanStack Query DevTools** | Add @tanstack/react-query-devtools | Task 45 | 🔴 Not Created |
| 47 | **Create QueryClient Configuration** | Configure default query options | Task 45 | 🔴 Not Created |
| 48 | **Set Default Stale Time** | Configure staleTime (5 minutes) | Task 47 | 🔴 Not Created |
| 49 | **Set Default Cache Time** | Configure gcTime (10 minutes) | Task 47 | 🔴 Not Created |
| 50 | **Set Default Retry Config** | Configure retry count and delay | Task 47 | 🔴 Not Created |
| 51 | **Configure Refetch on Window Focus** | Set refetchOnWindowFocus behavior | Task 47 | 🔴 Not Created |
| 52 | **Create QueryClientProvider** | Set up provider in root layout | Task 47 | 🔴 Not Created |
| 53 | **Add ReactQueryDevtools** | Add devtools component to layout | Task 46 | 🔴 Not Created |
| 54 | **Create Query Key Factory** | Create centralized query key management | Task 45 | 🔴 Not Created |
| 55 | **Define Product Query Keys** | Define keys for product queries | Task 54 | 🔴 Not Created |
| 56 | **Define Inventory Query Keys** | Define keys for inventory queries | Task 54 | 🔴 Not Created |
| 57 | **Define Customer Query Keys** | Define keys for customer queries | Task 54 | 🔴 Not Created |
| 58 | **Define Sales Query Keys** | Define keys for sales/order queries | Task 54 | 🔴 Not Created |
| 59 | **Define HR Query Keys** | Define keys for HR/employee queries | Task 54 | 🔴 Not Created |
| 60 | **Create QueryKey Index File** | Export all query key factories | Task 59 | 🔴 Not Created |

---

### Group E: Module Query Hooks (Tasks 61-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 61 | **Create useProducts Hook** | Query hook for product list with filters | Task 60 | 🔴 Not Created |
| 62 | **Create useProduct Hook** | Query hook for single product by ID | Task 60 | 🔴 Not Created |
| 63 | **Create useCategories Hook** | Query hook for category list | Task 60 | 🔴 Not Created |
| 64 | **Create useInventory Hook** | Query hook for stock levels | Task 60 | 🔴 Not Created |
| 65 | **Create useWarehouses Hook** | Query hook for warehouse list | Task 60 | 🔴 Not Created |
| 66 | **Create useStockMovements Hook** | Query hook for movement history | Task 60 | 🔴 Not Created |
| 67 | **Create useCustomers Hook** | Query hook for customer list | Task 60 | 🔴 Not Created |
| 68 | **Create useCustomer Hook** | Query hook for single customer | Task 60 | 🔴 Not Created |
| 69 | **Create useVendors Hook** | Query hook for vendor list | Task 60 | 🔴 Not Created |
| 70 | **Create useOrders Hook** | Query hook for order list | Task 60 | 🔴 Not Created |
| 71 | **Create useOrder Hook** | Query hook for single order | Task 60 | 🔴 Not Created |
| 72 | **Create useInvoices Hook** | Query hook for invoice list | Task 60 | 🔴 Not Created |
| 73 | **Create useEmployees Hook** | Query hook for employee list | Task 60 | 🔴 Not Created |
| 74 | **Create useEmployee Hook** | Query hook for single employee | Task 60 | 🔴 Not Created |
| 75 | **Create useAttendance Hook** | Query hook for attendance records | Task 60 | 🔴 Not Created |
| 76 | **Create useDashboardStats Hook** | Query hook for dashboard KPIs | Task 60 | 🔴 Not Created |
| 77 | **Create useReports Hook** | Query hook for report data | Task 60 | 🔴 Not Created |
| 78 | **Create Hooks Index File** | Export all query hooks | Task 77 | 🔴 Not Created |

---

### Group F: Mutations, Cache & DevTools (Tasks 79-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create useCreateProduct Mutation** | Mutation hook for product creation | Task 78 | 🔴 Not Created |
| 80 | **Create useUpdateProduct Mutation** | Mutation with optimistic update | Task 79 | 🔴 Not Created |
| 81 | **Create useDeleteProduct Mutation** | Mutation with cache invalidation | Task 79 | 🔴 Not Created |
| 82 | **Create Generic Mutation Factory** | Factory for common mutation patterns | Task 81 | 🔴 Not Created |
| 83 | **Implement Optimistic Updates** | Configure optimistic update patterns | Task 80 | 🔴 Not Created |
| 84 | **Implement Cache Invalidation** | Define invalidation strategies | Task 81 | 🔴 Not Created |
| 85 | **Create usePrefetch Hook** | Hook for prefetching data on hover | Task 78 | 🔴 Not Created |
| 86 | **Create Infinite Query Hooks** | Hooks for infinite scroll lists | Task 78 | 🔴 Not Created |
| 87 | **Create State Management Documentation** | Document all stores and hooks | Task 86 | 🔴 Not Created |
| 88 | **Final Verification & Testing** | Test all state management flows | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── store/
│   ├── authStore.ts          # Auth state (user, tenant, permissions)
│   ├── uiStore.ts            # UI state (sidebar, theme, modals)
│   ├── types.ts              # Store type definitions
│   ├── utils.ts              # Store utilities
│   └── index.ts              # Store exports
├── hooks/
│   ├── queries/
│   │   ├── useProducts.ts
│   │   ├── useProduct.ts
│   │   ├── useCategories.ts
│   │   ├── useInventory.ts
│   │   ├── useWarehouses.ts
│   │   ├── useStockMovements.ts
│   │   ├── useCustomers.ts
│   │   ├── useCustomer.ts
│   │   ├── useVendors.ts
│   │   ├── useOrders.ts
│   │   ├── useOrder.ts
│   │   ├── useInvoices.ts
│   │   ├── useEmployees.ts
│   │   ├── useEmployee.ts
│   │   ├── useAttendance.ts
│   │   ├── useDashboardStats.ts
│   │   ├── useReports.ts
│   │   └── index.ts
│   ├── mutations/
│   │   ├── useProductMutations.ts
│   │   ├── useCustomerMutations.ts
│   │   ├── useOrderMutations.ts
│   │   └── index.ts
│   ├── useAuth.ts
│   ├── usePrefetch.ts
│   └── index.ts
├── lib/
│   ├── queryClient.ts        # Query client configuration
│   └── queryKeys.ts          # Query key factories
└── providers/
    └── QueryProvider.tsx      # TanStack Query provider
```

---

## Store Structure Reference

### UI Store State
```typescript
interface UIState {
  sidebar: {
    isCollapsed: boolean;
    activeMenu: string | null;
  };
  theme: 'light' | 'dark' | 'system';
  modals: Map<string, { isOpen: boolean; props?: any }>;
  notifications: Notification[];
  commandPalette: { isOpen: boolean };
}
```

### Auth Store State
```typescript
interface AuthState {
  user: User | null;
  tenant: Tenant | null;
  permissions: string[];
  isAuthenticated: boolean;
  isLoading: boolean;
}
```

### Query Key Factory Pattern
```typescript
const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
};
```

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 88 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 88 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Zustand vs Query:** Use Zustand for UI/client state, TanStack Query for server state
3. **Selectors:** Always use selectors to avoid unnecessary re-renders
4. **Persistence:** Only persist non-sensitive UI preferences
5. **Query Keys:** Follow the query key factory pattern for consistency
6. **Stale Time:** Configure appropriate stale times based on data freshness needs
7. **Optimistic Updates:** Use for better UX on mutations
8. **Cache Invalidation:** Invalidate related queries after mutations
9. **Dependencies:** This sub-phase depends on SubPhase-04 (API Client Layer)
10. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
11. **DevTools:** Enable devtools in development only
12. **SSR Hydration:** Handle hydration mismatch for persisted stores
