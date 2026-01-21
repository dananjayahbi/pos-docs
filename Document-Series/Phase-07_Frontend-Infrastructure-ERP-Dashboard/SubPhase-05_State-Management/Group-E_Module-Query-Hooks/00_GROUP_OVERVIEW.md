# Group E: Module Query Hooks

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** E of F  
> **Tasks Covered:** 61-78  
> **Group Goal:** Create TanStack Query hooks for all ERP module data fetching

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_TanStack-Query-Setup](../Group-D_TanStack-Query-Setup/)
- **→ Next Group:** [Group-F_Mutations-Cache-DevTools](../Group-F_Mutations-Cache-DevTools/)

---

## Group Overview

This group creates TanStack Query hooks for fetching data from all ERP modules. Creates query hooks for: Products (useProducts, useProduct, useCategories), Inventory (useInventory, useWarehouses, useStockMovements), Customers (useCustomers, useCustomer), Vendors (useVendors), Sales (useOrders, useOrder, useInvoices), HR (useEmployees, useEmployee, useAttendance), Dashboard (useDashboardStats), and Reports (useReports). Each hook uses the appropriate query key factory and API service.

### Key Outcomes

- useProducts hook (list with filters)
- useProduct hook (single by ID)
- useCategories hook
- useInventory hook (stock levels)
- useWarehouses hook
- useStockMovements hook
- useCustomers hook
- useCustomer hook
- useVendors hook
- useOrders hook
- useOrder hook
- useInvoices hook
- useEmployees hook
- useEmployee hook
- useAttendance hook
- useDashboardStats hook
- useReports hook
- Hooks index file created

### Technology Context

- **Query Hooks:** useQuery from TanStack
- **API Integration:** Uses API services
- **Keys:** Uses query key factory
- **Options:** Supports enabled, refetchInterval

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-61-70_Product-Inventory-Customer-Sales.md` | Create query hooks for core modules | 61-70 |
| 02 | `02_Tasks-71-78_Invoice-HR-Dashboard-Reports.md` | Create query hooks for invoices, HR, dashboard, reports | 71-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 61 | Create useProducts Hook | Medium | Task 60 |
| 62 | Create useProduct Hook | Low | Task 60 |
| 63 | Create useCategories Hook | Low | Task 60 |
| 64 | Create useInventory Hook | Medium | Task 60 |
| 65 | Create useWarehouses Hook | Low | Task 60 |
| 66 | Create useStockMovements Hook | Low | Task 60 |
| 67 | Create useCustomers Hook | Medium | Task 60 |
| 68 | Create useCustomer Hook | Low | Task 60 |
| 69 | Create useVendors Hook | Medium | Task 60 |
| 70 | Create useOrders Hook | Medium | Task 60 |
| 71 | Create useOrder Hook | Low | Task 60 |
| 72 | Create useInvoices Hook | Medium | Task 60 |
| 73 | Create useEmployees Hook | Medium | Task 60 |
| 74 | Create useEmployee Hook | Low | Task 60 |
| 75 | Create useAttendance Hook | Low | Task 60 |
| 76 | Create useDashboardStats Hook | Medium | Task 60 |
| 77 | Create useReports Hook | Medium | Task 60 |
| 78 | Create Hooks Index File | Low | Task 77 |

---

## Execution Order

```
Task 60: QueryKey Index (from Group D)
    │
    ├──────────────────────────────────────────────────────────────┐
    ▼                                                              │
┌───────────────────────────────────────────────────────────┐      │
│  Tasks 61-70 (can be parallel)                            │      │
│  ┌────┬────┬────┬────┬────┬────┬────┬────┬────┬────┐     │      │
│  ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼    ▼    │     │      │
│  61   62   63   64   65   66   67   68   69   70   │     │      │
│  │    │    │    │    │    │    │    │    │    │    │     │      │
│  └────┴────┴────┴────┴────┴────┴────┴────┴────┴────┘     │      │
└───────────────────────────────────────────────────────────┘      │
                           │                                        │
                           ▼                                        │
┌───────────────────────────────────────────────────────────┐      │
│  Tasks 71-77 (can be parallel)                            │      │
│  ┌────┬────┬────┬────┬────┬────┬────┐                    │      │
│  ▼    ▼    ▼    ▼    ▼    ▼    ▼    │                    │      │
│  71   72   73   74   75   76   77   │                    │      │
│  │    │    │    │    │    │    │    │                    │      │
│  └────┴────┴────┴────┴────┴────┴────┘                    │      │
└───────────────────────────────────────────────────────────┘      │
                           │                                        │
                           ▼                                        │
                      Task 78: Index ◄──────────────────────────────┘
```

---

## Expected Deliverables

```
frontend/
└── hooks/
    └── queries/
        ├── useProducts.ts
        ├── useProduct.ts
        ├── useCategories.ts
        ├── useInventory.ts
        ├── useWarehouses.ts
        ├── useStockMovements.ts
        ├── useCustomers.ts
        ├── useCustomer.ts
        ├── useVendors.ts
        ├── useOrders.ts
        ├── useOrder.ts
        ├── useInvoices.ts
        ├── useEmployees.ts
        ├── useEmployee.ts
        ├── useAttendance.ts
        ├── useDashboardStats.ts
        ├── useReports.ts
        └── index.ts
```

---

## Notes for AI Agents

### Query Hook Pattern
| Parameter | Type | Description |
|-----------|------|-------------|
| queryKey | array | From key factory |
| queryFn | function | API service call |
| enabled | boolean? | Conditional fetch |
| staleTime | number? | Override default |
| refetchInterval | number? | Polling interval |

### useProducts Hook (Task 61)
| Param | Type | Description |
|-------|------|-------------|
| filters | ProductFilters | Search, category, status |
| Returns | UseQueryResult | Data, loading, error |

### useProduct Hook (Task 62)
| Param | Type | Description |
|-------|------|-------------|
| id | string | Product ID |
| enabled | boolean | Skip if no ID |
| Returns | UseQueryResult | Product data |

### List Hooks Pattern
- Accept filters object
- Use filters in query key
- Pass filters to API service
- Return paginated response

### Detail Hooks Pattern
- Accept ID parameter
- Use enabled: !!id
- Return single item
- Error on not found

### useDashboardStats Hook (Task 76)
| Data | Type | Description |
|------|------|-------------|
| totalSales | number | Today's sales |
| orderCount | number | Orders today |
| customerCount | number | Total customers |
| lowStockCount | number | Low stock alerts |
| topProducts | array | Best sellers |

### Polling for Dashboard
```
refetchInterval: 30 * 1000 // 30 seconds
```
