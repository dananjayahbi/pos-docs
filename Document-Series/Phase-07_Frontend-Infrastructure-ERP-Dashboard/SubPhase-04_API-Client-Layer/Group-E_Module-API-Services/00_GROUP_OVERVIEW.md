# Group E: Module API Services

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** E of F  
> **Tasks Covered:** 59-78  
> **Group Goal:** Create typed API service functions for all ERP modules

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Error-Handling-Retry-Logic](../Group-D_Error-Handling-Retry-Logic/)
- **→ Next Group:** [Group-F_API-Utilities-Documentation](../Group-F_API-Utilities-Documentation/)

---

## Group Overview

This group creates typed API services for all ERP modules. Defines types and implements CRUD services for: Products (productService, categoryService), Inventory (inventoryService, warehouseService), Customers (customerService), Vendors (vendorService), Sales (salesService, invoiceService), HR (employeeService, attendanceService, payrollService), and Reports (reportsService). Also creates settingsService for tenant configuration.

### Key Outcomes

- Product types defined
- productService with CRUD
- categoryService with CRUD
- Inventory types defined
- inventoryService for stock
- warehouseService for locations
- Customer types defined
- customerService with CRUD
- Vendor types defined
- vendorService with CRUD
- Sales types defined
- salesService for orders
- invoiceService for billing
- HR types defined
- employeeService with CRUD
- attendanceService for time
- payrollService for salary
- Reports types defined
- reportsService for analytics
- settingsService for config

### Technology Context

- **API Pattern:** RESTful CRUD operations
- **Type Safety:** TypeScript interfaces
- **Endpoints:** Django REST Framework
- **Response Format:** APIResponse<T> wrapper

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-59-68_Product-Inventory-Customer-Vendor.md` | Create product, inventory, customer, vendor services | 59-68 |
| 02 | `02_Tasks-69-78_Sales-HR-Reports-Settings.md` | Create sales, HR, reports, settings services | 69-78 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 59 | Create Product Types | Low | Task 08 |
| 60 | Create Product Service | Medium | Task 59 |
| 61 | Create Category Service | Low | Task 59 |
| 62 | Create Inventory Types | Low | Task 08 |
| 63 | Create Inventory Service | Medium | Task 62 |
| 64 | Create Warehouse Service | Low | Task 62 |
| 65 | Create Customer Types | Low | Task 08 |
| 66 | Create Customer Service | Medium | Task 65 |
| 67 | Create Vendor Types | Low | Task 08 |
| 68 | Create Vendor Service | Medium | Task 67 |
| 69 | Create Sales Types | Low | Task 08 |
| 70 | Create Sales Service | Medium | Task 69 |
| 71 | Create Invoice Service | Medium | Task 69 |
| 72 | Create HR Types | Low | Task 08 |
| 73 | Create Employee Service | Medium | Task 72 |
| 74 | Create Attendance Service | Low | Task 72 |
| 75 | Create Payroll Service | Medium | Task 72 |
| 76 | Create Reports Types | Low | Task 08 |
| 77 | Create Reports Service | Medium | Task 76 |
| 78 | Create Settings Service | Low | Task 08 |

---

## Execution Order

```
Task 59: Product Types
    │
    ├──────────────────────┐
    ▼                      ▼
Task 60               Task 61
(productService)      (categoryService)
    │                      │
    └──────────┬───────────┘
               ▼
         Task 62: Inventory Types
               │
    ┌──────────┴──────────┐
    ▼                     ▼
Task 63              Task 64
(inventoryService)   (warehouseService)
    │                     │
    └──────────┬──────────┘
               ▼
    ┌──────────┴──────────┐
    ▼                     ▼
Task 65              Task 67
(Customer Types)     (Vendor Types)
    │                     │
    ▼                     ▼
Task 66              Task 68
(customerService)    (vendorService)
    │                     │
    └──────────┬──────────┘
               ▼
         Task 69: Sales Types
               │
    ┌──────────┴──────────┐
    ▼                     ▼
Task 70              Task 71
(salesService)       (invoiceService)
    │                     │
    └──────────┬──────────┘
               ▼
         Task 72: HR Types
               │
    ┌──────┬───┴───┬──────┐
    ▼      ▼       ▼      │
   73     74      75      │
    │      │       │      │
    └──────┴───────┴──────┘
               │
               ▼
         Task 76: Reports Types
               │
               ▼
         Task 77: reportsService
               │
               ▼
         Task 78: settingsService
```

---

## Expected Deliverables

```
frontend/
├── services/
│   └── api/
│       ├── productService.ts
│       ├── categoryService.ts
│       ├── inventoryService.ts
│       ├── warehouseService.ts
│       ├── customerService.ts
│       ├── vendorService.ts
│       ├── salesService.ts
│       ├── invoiceService.ts
│       ├── employeeService.ts
│       ├── attendanceService.ts
│       ├── payrollService.ts
│       ├── reportsService.ts
│       └── settingsService.ts
└── types/
    ├── product.ts
    ├── inventory.ts
    ├── customer.ts
    ├── vendor.ts
    ├── sales.ts
    ├── hr.ts
    └── reports.ts
```

---

## Notes for AI Agents

### Standard CRUD Service Pattern
| Function | Method | Endpoint |
|----------|--------|----------|
| getAll | GET | /module |
| getById | GET | /module/{id} |
| create | POST | /module |
| update | PATCH | /module/{id} |
| delete | DELETE | /module/{id} |

### Product Types (Task 59)
| Type | Fields |
|------|--------|
| Product | id, name, sku, price, category, variants |
| Category | id, name, slug, parent, children |
| ProductVariant | id, productId, sku, options, price |

### Inventory Types (Task 62)
| Type | Fields |
|------|--------|
| Stock | productId, warehouseId, quantity, reserved |
| Warehouse | id, name, code, address, isDefault |
| StockMovement | id, type, quantity, from, to, date |

### Customer Types (Task 65)
| Type | Fields |
|------|--------|
| Customer | id, name, email, phone, addresses |
| CustomerAddress | id, line1, line2, city, postalCode |

### Vendor Types (Task 67)
| Type | Fields |
|------|--------|
| Vendor | id, name, email, phone, address |
| PurchaseOrder | id, vendorId, items, status, total |

### Sales Types (Task 69)
| Type | Fields |
|------|--------|
| Order | id, customerId, items, status, total |
| OrderItem | productId, quantity, price, discount |
| Invoice | id, orderId, number, status, dueDate |
| Payment | id, invoiceId, amount, method, date |

### HR Types (Task 72)
| Type | Fields |
|------|--------|
| Employee | id, name, email, department, position |
| Attendance | employeeId, date, checkIn, checkOut |
| LeaveRequest | employeeId, type, startDate, endDate |
| Payroll | employeeId, period, basicSalary, deductions |

### Reports Types (Task 76)
| Type | Fields |
|------|--------|
| ReportDefinition | id, name, type, filters |
| ReportInstance | id, definitionId, generatedAt, data |
