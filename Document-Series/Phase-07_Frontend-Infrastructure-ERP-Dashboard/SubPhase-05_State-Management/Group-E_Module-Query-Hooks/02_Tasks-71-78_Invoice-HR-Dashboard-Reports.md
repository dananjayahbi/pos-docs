# Tasks 71-78: Invoice, HR, Dashboard, and Reports Query Hooks

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** E - Module Query Hooks  
> **Document:** 02 of 02  
> **Tasks Covered:** 71, 72, 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-61-70_Product-Inventory-Customer-Sales.md](01_Tasks-61-70_Product-Inventory-Customer-Sales.md)

---

## Document Overview

This document covers the creation of TanStack Query hooks for Invoices, Human Resources, Dashboard Statistics, and Reports modules. These hooks complete the query layer for the ERP system, providing specialized data fetching for financial documents, employee management, real-time dashboards, and business intelligence reporting.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 71 | Create useOrder Hook | Low | 20 min |
| 72 | Create useInvoices Hook | Medium | 40 min |
| 73 | Create useEmployees Hook | Medium | 40 min |
| 74 | Create useEmployee Hook | Low | 20 min |
| 75 | Create useAttendance Hook | Low | 30 min |
| 76 | Create useDashboardStats Hook | Medium | 35 min |
| 77 | Create useReports Hook | Medium | 40 min |
| 78 | Create Hooks Index File | Low | 15 min |

---

## Task 71: Create useOrder Hook

### Overview
Create a TanStack Query hook for fetching a single order's complete details by ID. This hook provides comprehensive order information including line items, customer details, payment records, fulfillment status, and order history for detailed order management and customer service operations.

### Dependencies
- Task 60: QueryKey Index File
- Task 70: Create useOrders Hook (for cache consistency)
- Order API service exists
- Order and OrderDetail TypeScript interfaces defined

### Instructions

1. **Create useOrder.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query utilities
   - Import order services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import orderApi service
   - Import orderKeys from key factory
   - Import Order, OrderDetail types
   - Import UseQueryResult type

3. **Define hook parameters**
   - id: string (order ID, required)
   - includeItems: boolean (include line items, default true)
   - includeHistory: boolean (include status history, default false)
   - enabled: boolean (conditional fetching)

4. **Define hook function**
   - Function name: useOrder
   - Accept id as first parameter
   - Accept options object (optional)
   - Return typed query result

5. **Implement conditional fetching**
   - Use enabled: !!id
   - Skip query if ID is falsy
   - Prevent unnecessary API calls

6. **Implement query key**
   - Use orderKeys.detail(id, options)
   - Include options in cache key
   - Separate cache for different data levels

7. **Implement query function**
   - Call orderApi.getOrder(id, options)
   - Fetch order header details
   - Optionally fetch line items
   - Optionally fetch history

8. **Configure query options**
   - Set staleTime to 2 minutes
   - Enable cache integration with list
   - Set retry to 2 attempts
   - Merge custom options

9. **Add data enrichment**
   - Calculate order totals breakdown
   - Compute fulfillment percentage
   - Determine next action required
   - Format display fields

10. **Return query result**
    - Return complete useQuery result
    - Typed with OrderDetail interface
    - Include all related data

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| id | string | Yes | - | Order unique identifier |
| options | object | No | {} | Additional options |
| options.includeItems | boolean | No | true | Include line items |
| options.includeHistory | boolean | No | false | Include status history |
| options.enabled | boolean | No | !!id | Enable query execution |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | OrderDetail | null | Detailed order object |
| isLoading | boolean | Initial fetch loading |
| isFetching | boolean | Background refetch |
| error | Error | null | Error object |
| refetch | function | Manual refetch |
| isSuccess | boolean | Success indicator |

### OrderDetail Data Structure

#### Core Order Data
| Field | Type | Description |
|-------|------|-------------|
| id | string | Order identifier |
| orderNumber | string | Display order number |
| customerId | string | Customer identifier |
| customer | Customer | Full customer object |
| orderDate | Date | Order creation date |
| status | string | Current order status |
| paymentStatus | string | Payment status |
| fulfillmentStatus | string | Fulfillment status |
| createdBy | string | User who created |
| createdAt | Date | Creation timestamp |
| updatedAt | Date | Last update timestamp |

#### Financial Details
| Field | Type | Description |
|-------|------|-------------|
| subtotal | number | Items subtotal |
| taxRate | number | Applied tax rate (%) |
| taxAmount | number | Calculated tax |
| discountType | string | null | Percentage or fixed |
| discountValue | number | Discount amount/rate |
| discountAmount | number | Calculated discount |
| shippingAmount | number | Shipping cost |
| totalAmount | number | Final order total |
| paidAmount | number | Total payments received |
| balanceAmount | number | Remaining balance |

#### Shipping Information
| Field | Type | Description |
|-------|------|-------------|
| shippingAddress | Address | Delivery address |
| shippingMethod | string | null | Shipping method |
| shippingCarrier | string | null | Carrier name |
| trackingNumber | string | null | Tracking number |
| estimatedDelivery | Date | null | Expected delivery |
| actualDelivery | Date | null | Actual delivery date |

#### Line Items (Optional)
| Field | Type | Description |
|-------|------|-------------|
| items | OrderItem[] | null | Array of order items |
| itemCount | number | Total unique items |
| quantityTotal | number | Total quantity |

#### Order History (Optional)
| Field | Type | Description |
|-------|------|-------------|
| history | OrderHistory[] | null | Status change history |
| payments | Payment[] | null | Payment transactions |
| notes | Note[] | null | Order notes/comments |

### OrderItem Structure

#### Line Item Details
| Field | Type | Description |
|-------|------|-------------|
| id | string | Line item identifier |
| productId | string | Product identifier |
| productName | string | Product name |
| productSku | string | Product SKU |
| quantity | number | Ordered quantity |
| unitPrice | number | Price per unit |
| discountAmount | number | Line discount |
| taxAmount | number | Line tax |
| lineTotal | number | Line total |
| status | string | Item status |
| fulfilledQuantity | number | Quantity fulfilled |
| remainingQuantity | number | Quantity pending |

### Conditional Data Loading

#### Include Items Option
```
includeItems: true (default)
- Fetch order with line items
- Complete order view
- Response: ~5-10KB
- Use for: Order detail page

includeItems: false
- Fetch header only
- Faster response (~1-2KB)
- Use for: Quick order lookup
```

#### Include History Option
```
includeHistory: false (default)
- No status change history
- Basic order information only
- Use for: General order view

includeHistory: true
- Full audit trail
- All status changes
- Payment history
- Response: +3-5KB
- Use for: Customer service, auditing
```

### Cache Strategy

#### Query Key Variations
```
Cache Keys Based on Options:
['orders', 'detail', 'ord-123', { includeItems: true }]
['orders', 'detail', 'ord-123', { includeItems: true, includeHistory: true }]

Default (includeItems: true):
['orders', 'detail', 'ord-123', { includeItems: true }]
```

#### Integration with List Cache
```
Cache Integration Flow:
1. User views order list (Task 70)
2. List cache contains basic order data
3. User clicks order to view details
4. Detail hook checks list cache
5. Shows basic data immediately
6. Fetches full details (items + history)
7. Updates with complete information

Performance:
- Initial display: <50ms (from cache)
- Full data: 200-300ms (from API)
- Smooth user experience
```

### Data Enrichment

#### Fulfillment Percentage
```
Calculation:
fulfilledQuantity = SUM(items.fulfilledQuantity)
totalQuantity = SUM(items.quantity)
fulfillmentPercentage = (fulfilledQuantity / totalQuantity) × 100

Status Indicators:
0%:      Not started (Red)
1-99%:   In progress (Orange)
100%:    Complete (Green)

Display:
"5 of 10 items fulfilled (50%)"
```

#### Balance Calculation
```
Balance = totalAmount - paidAmount

Scenarios:
balanceAmount > 0:    Payment due
balanceAmount = 0:    Fully paid
balanceAmount < 0:    Overpayment/Credit

Display:
"Balance Due: $150.00"
"Paid in Full"
"Credit: $25.00"
```

#### Next Action Determination
```
Action Priority Logic:
1. If status = 'pending':
   → "Awaiting Confirmation"
2. If paymentStatus = 'unpaid':
   → "Payment Required"
3. If fulfillmentStatus = 'unfulfilled' AND paymentStatus = 'paid':
   → "Ready to Fulfill"
4. If fulfillmentStatus = 'fulfilled' AND NOT shipped:
   → "Ready to Ship"
5. If shipped AND NOT delivered:
   → "In Transit"
6. If delivered:
   → "Completed"
```

### Order Status Tracking

#### Status Timeline Visualization
```
Order Lifecycle Timeline:
┌─────────┐   ┌───────────┐   ┌───────────┐   ┌───────────┐
│ Created │──▶│ Confirmed │──▶│ Fulfilled │──▶│ Delivered │
└─────────┘   └───────────┘   └───────────┘   └───────────┘
  Jan 20        Jan 20           Jan 21          Jan 23
  10:00 AM      2:30 PM          9:00 AM         3:00 PM
```

#### Status History Structure
| Field | Type | Description |
|-------|------|-------------|
| id | string | History record ID |
| orderId | string | Order identifier |
| statusType | string | order, payment, or fulfillment |
| oldStatus | string | null | Previous status |
| newStatus | string | New status |
| changedBy | string | User who changed |
| changedAt | Date | Change timestamp |
| notes | string | null | Change reason/notes |

### Payment Tracking

#### Payment Record Structure
| Field | Type | Description |
|-------|------|-------------|
| id | string | Payment identifier |
| orderId | string | Order identifier |
| amount | number | Payment amount |
| paymentMethod | string | Payment method |
| paymentDate | Date | Payment date |
| transactionId | string | null | External transaction ID |
| status | string | success, pending, failed |
| notes | string | null | Payment notes |

#### Payment Summary
```
Order Total: $1,250.00
Payments:
  Jan 20: Credit Card   $500.00
  Jan 21: Bank Transfer $500.00
  Jan 22: Credit Card   $250.00
  ────────────────────────────
  Total Paid:           $1,250.00
  Balance Due:          $0.00
```

### Discounts Calculation

#### Discount Types
```
Percentage Discount:
discountType: 'percentage'
discountValue: 10
subtotal: $1,000.00
discountAmount: $100.00 (10% of subtotal)
Total after discount: $900.00

Fixed Amount Discount:
discountType: 'fixed'
discountValue: 50
subtotal: $1,000.00
discountAmount: $50.00 (fixed)
Total after discount: $950.00
```

### Tax Calculation

#### Tax Application
```
Tax Calculation:
subtotal: $1,000.00
discountAmount: $100.00
taxableAmount: $900.00
taxRate: 10%
taxAmount: $90.00

Final Total:
subtotal:        $1,000.00
- discount:      -$100.00
+ tax:           +$90.00
+ shipping:      +$50.00
──────────────────────────
Total:           $1,040.00
```

### Error Handling

#### Order Not Found (404)
```
Scenarios:
- Invalid order ID
- Order deleted
- No access permission

Response:
- error.code: "ORDER_NOT_FOUND"
- error.message: "Order not found"
- Redirect to order list
- Show notification
```

#### Access Denied (403)
```
Scenarios:
- Different tenant's order
- Insufficient permissions

Response:
- error.code: "FORBIDDEN"
- error.message: "Access denied"
- Show error message
- Don't expose order existence
```

### Performance Optimization

#### Stale Time Configuration
```
staleTime: 2 minutes

Rationale:
- Order details somewhat dynamic
- Status updates moderate frequency
- Balance freshness vs API load
- Allow quick back navigation
```

#### Progressive Data Loading
```
Load Strategy:
Phase 1: Order header (cached, instant)
Phase 2: Line items (if included)
Phase 3: Status history (if included)
Phase 4: Related data (payments, shipments)

User sees header within 100ms
Complete data within 300ms
```

### Use Cases

#### Order Detail Page
```
useOrder('ord-123', {
  includeItems: true,
  includeHistory: false
})

Display: Full order view with items
```

#### Customer Service Review
```
useOrder('ord-123', {
  includeItems: true,
  includeHistory: true
})

Display: Complete order audit trail
```

#### Quick Order Status Check
```
useOrder('ord-123', {
  includeItems: false,
  includeHistory: false
})

Display: Order status summary only
```

### Expected Outcome
- Functional useOrder hook
- Complete order detail view
- Optional line items loading
- Optional history loading
- Cache integration with list
- Computed financial totals

### Verification Checklist
- [ ] useOrder.ts file created
- [ ] Hook accepts id parameter
- [ ] Conditional fetching (enabled: !!id)
- [ ] Query key uses orderKeys.detail()
- [ ] includeItems option works
- [ ] includeHistory option works
- [ ] Balance calculated correctly
- [ ] Fulfillment percentage computed
- [ ] Next action determined
- [ ] StaleTime set to 2 minutes
- [ ] Error handling for 404, 403
- [ ] Return type properly typed

---

## Task 72: Create useInvoices Hook

### Overview
Create a TanStack Query hook for fetching invoice/billing records with comprehensive filtering by payment status, due date, customer, and date ranges. This hook supports accounts receivable management, payment tracking, and financial reporting with real-time updates.

### Dependencies
- Task 60: QueryKey Index File
- Invoice API service exists
- Invoice TypeScript interface defined
- Query key factory includes invoice keys

### Instructions

1. **Create useInvoices.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import invoice services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import invoiceApi service
   - Import invoiceKeys from key factory
   - Import Invoice, InvoiceFilters types
   - Import UseQueryResult type

3. **Define InvoiceFilters interface**
   - search: optional string (invoice number, customer)
   - customerId: optional string for customer filter
   - status: 'all' | 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
   - paymentStatus: 'all' | 'unpaid' | 'partial' | 'paid'
   - dueStatus: 'all' | 'not_due' | 'due_soon' | 'overdue'
   - startDate: optional Date for date range
   - endDate: optional Date for date range
   - sortBy: sort field selection
   - sortOrder: 'asc' | 'desc'
   - page: number for pagination
   - limit: number for page size

4. **Define hook function**
   - Function name: useInvoices
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use invoiceKeys.list(filters)
   - Include all filter parameters
   - Serialize dates in cache key

6. **Implement query function**
   - Call invoiceApi.getInvoices(filters)
   - Fetch paginated invoice data
   - Include customer information
   - Calculate aging and due status

7. **Configure query options**
   - Set staleTime to 1 minute
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus: true
   - Invoices frequently updated

8. **Add status filtering**
   - Draft: Not yet sent
   - Sent: Issued to customer
   - Paid: Fully paid
   - Overdue: Past due date
   - Cancelled: Voided invoice

9. **Add due status filtering**
   - not_due: Due date in future
   - due_soon: Due within 7 days
   - overdue: Past due date
   - Auto-computed from due date

10. **Return query result**
    - Return complete useQuery result
    - Typed with Invoice array
    - Include pagination and totals

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | InvoiceFilters | No | {} | Filter options |
| filters.search | string | No | '' | Search query |
| filters.customerId | string | No | null | Customer filter |
| filters.status | string | No | 'all' | Invoice status |
| filters.paymentStatus | string | No | 'all' | Payment status |
| filters.dueStatus | string | No | 'all' | Due date status |
| filters.startDate | Date | No | month start | Date range start |
| filters.endDate | Date | No | now | Date range end |
| filters.sortBy | string | No | 'invoiceDate' | Sort field |
| filters.sortOrder | string | No | 'desc' | Sort direction |
| filters.page | number | No | 1 | Page number |
| filters.limit | number | No | 25 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | PaginatedInvoices | Invoice records with metadata |
| data.items | Invoice[] | Array of invoices |
| data.total | number | Total invoice count |
| data.totalAmount | number | Sum of invoice amounts |
| data.totalPaid | number | Sum of payments received |
| data.totalDue | number | Sum of balances due |
| data.page | number | Current page |
| data.pages | number | Total pages |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |

### Invoice Data Structure

#### Invoice Interface
| Field | Type | Description |
|-------|------|-------------|
| id | string | Invoice identifier |
| invoiceNumber | string | Display invoice number |
| customerId | string | Customer identifier |
| customerName | string | Customer name |
| invoiceDate | Date | Invoice issue date |
| dueDate | Date | Payment due date |
| status | string | Invoice status |
| paymentStatus | string | Payment status |
| orderId | string | null | Related order ID |
| subtotal | number | Items subtotal |
| taxAmount | number | Tax amount |
| discountAmount | number | Discount amount |
| totalAmount | number | Invoice total |
| paidAmount | number | Amount paid |
| balanceAmount | number | Amount due |
| paymentMethod | string | null | Payment method |
| notes | string | null | Invoice notes |
| createdAt | Date | Creation timestamp |
| sentAt | Date | null | Date sent to customer |
| paidAt | Date | null | Payment date |
| daysOverdue | number | Days past due (if overdue) |

### Status Filtering

#### Invoice Status Lifecycle
```
Invoice Status Flow:
┌───────┐   ┌──────┐   ┌──────┐
│ draft │──▶│ sent │──▶│ paid │
└───────┘   └──────┘   └──────┘
    │           │
    │           └──────┐
    ▼                  ▼
┌───────────┐    ┌─────────┐
│ cancelled │    │overdue  │
└───────────┘    └─────────┘

Status Descriptions:
- draft: Created but not sent
- sent: Issued to customer
- paid: Fully paid
- overdue: Past due date, unpaid
- cancelled: Voided/cancelled
```

#### Payment Status
```
Payment Status:
┌────────┐   ┌─────────┐   ┌──────┐
│ unpaid │──▶│ partial │──▶│ paid │
└────────┘   └─────────┘   └──────┘

Calculations:
unpaid:   paidAmount = 0
partial:  0 < paidAmount < totalAmount
paid:     paidAmount >= totalAmount
```

#### Due Status Computation
```
Due Status Logic:
1. Calculate daysUntilDue = dueDate - TODAY
2. Determine status:

not_due:
  daysUntilDue > 7
  "Due in 15 days"

due_soon:
  0 <= daysUntilDue <= 7
  "Due in 3 days"
  
overdue:
  daysUntilDue < 0
  daysOverdue = |daysUntilDue|
  "Overdue by 5 days"
```

### Multi-Status Filtering

#### Accounts Receivable Priority
```
High Priority Invoices:
- status: 'sent'
- paymentStatus: 'unpaid'
- dueStatus: 'overdue'

Result: Overdue unpaid invoices
Action: Payment collection required
```

#### Upcoming Payments
```
Payment Reminders:
- status: 'sent'
- paymentStatus: 'unpaid' OR 'partial'
- dueStatus: 'due_soon'

Result: Due within 7 days
Action: Send payment reminders
```

### Date Range Filtering

#### Invoice Date vs Due Date
```
Filter Options:
1. By Invoice Date (default)
   - When invoice was issued
   - Useful for: Period reports

2. By Due Date
   - When payment is due
   - Useful for: Cash flow forecasting

Example:
Invoice Date: Jan 15, 2026
Payment Terms: Net 30
Due Date: Feb 14, 2026
```

### Search Implementation

#### Multi-Field Search
```
Search Query: "INV-2026"

Searches in:
1. Invoice number
   - "INV-2026-001" ✓
   - "INV-2026-125" ✓
2. Customer name
   - "Invoice Tech Ltd" ✓
3. Customer code
   - No match
4. Order number (if linked)
   - "ORD-INV-2026-001" ✓

Returns: All matching invoices
```

### Sorting Strategies

#### By Invoice Date (Default)
- Descending (newest first): Default
- Most recent invoices at top
- Current period focus
- Real-time invoice monitoring

#### By Due Date
- Ascending (soonest first)
- Prioritize urgent payments
- Cash flow management
- Payment collection focus

#### By Total Amount
- Descending (highest first)
- Identify large invoices
- Revenue focus
- High-value collections

#### By Days Overdue
- Descending (most overdue first)
- Collection priority
- Risk management
- Customer follow-up

### Aggregated Totals

#### Summary Statistics
```
Invoice Summary (returned with each query):
┌────────────────────────────────────┐
│ Total Invoices: 156                │
│ Total Amount: $245,800.00          │
│ Total Paid: $198,650.00            │
│ Total Outstanding: $47,150.00      │
│ Overdue Amount: $12,300.00         │
│ Overdue Count: 8                   │
└────────────────────────────────────┘

Use Cases:
- AR dashboard
- Cash flow analysis
- Collection metrics
- Financial reporting
```

### Aging Analysis

#### Invoice Aging Buckets
```
Accounts Receivable Aging:
┌────────────┬────────┬──────────┐
│ Period     │ Count  │ Amount   │
├────────────┼────────┼──────────┤
│ Current    │   95   │ $35,000  │
│ 1-30 days  │   40   │ $18,500  │
│ 31-60 days │   15   │  $9,800  │
│ 61-90 days │    4   │  $3,200  │
│ 90+ days   │    2   │  $1,500  │
└────────────┴────────┴──────────┘

Calculation:
daysOverdue = TODAY - dueDate
Bucket = aging category
```

### Performance Optimization

#### Stale Time Configuration
```
staleTime: 1 minute

Rationale:
- Invoices frequently updated
- Payment status changes
- Real-time AR visibility critical
- Balance freshness vs load
```

#### Pagination Strategy
```
Page Size:
- Default: 25 invoices
- AR dashboard: 50 invoices
- Reports: 100 invoices
- Export: 1000 maximum
```

### Real-Time Updates

#### Auto-Invalidation Triggers
- Invoice created: Invalidate list
- Payment received: Invalidate invoice + list
- Invoice sent: Update status
- Invoice voided: Invalidate list
- Due date passed: Refetch to update overdue

### Use Cases

#### Accounts Receivable Dashboard
```
useInvoices({
  status: 'sent',
  paymentStatus: 'unpaid',
  dueStatus: 'overdue',
  sortBy: 'daysOverdue',
  sortOrder: 'desc'
})

Display: Overdue invoices prioritized
```

#### Customer Invoice History
```
useInvoices({
  customerId: 'cust-123',
  sortBy: 'invoiceDate',
  sortOrder: 'desc'
})

Display: All invoices for customer
```

#### Payment Collection List
```
useInvoices({
  dueStatus: 'due_soon',
  paymentStatus: 'unpaid',
  sortBy: 'dueDate',
  sortOrder: 'asc'
})

Display: Upcoming due invoices
```

#### Period Financial Report
```
useInvoices({
  startDate: firstDayOfMonth,
  endDate: lastDayOfMonth,
  status: 'all'
})

Display: Month's invoices summary
```

### Expected Outcome
- Functional useInvoices hook
- Comprehensive status filtering
- Due date status computation
- Aging analysis support
- Aggregated financial totals
- Real-time payment tracking

### Verification Checklist
- [ ] useInvoices.ts file created
- [ ] InvoiceFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses invoiceKeys.list()
- [ ] All status filters implemented
- [ ] Due status computed correctly
- [ ] Days overdue calculated
- [ ] Aggregated totals returned
- [ ] StaleTime set to 1 minute
- [ ] KeepPreviousData enabled
- [ ] Return type properly typed

---

## Task 73: Create useEmployees Hook

### Overview
Create a TanStack Query hook for fetching employee records with filtering by department, role, employment status, and search capabilities. This hook supports HR management, payroll operations, and organizational structure visualization.

### Dependencies
- Task 60: QueryKey Index File
- Employee API service exists
- Employee TypeScript interface defined
- Query key factory includes employee keys

### Instructions

1. **Create useEmployees.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import employee services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import employeeApi service
   - Import employeeKeys from key factory
   - Import Employee, EmployeeFilters types
   - Import UseQueryResult type

3. **Define EmployeeFilters interface**
   - search: optional string (name, email, employee ID)
   - departmentId: optional string for department filter
   - role: optional string for role filter
   - employmentType: 'all' | 'full_time' | 'part_time' | 'contract'
   - status: 'all' | 'active' | 'inactive' | 'on_leave'
   - sortBy: 'name' | 'hireDate' | 'department'
   - sortOrder: 'asc' | 'desc'
   - page: number for pagination
   - limit: number for page size

4. **Define hook function**
   - Function name: useEmployees
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use employeeKeys.list(filters)
   - Include all filter parameters
   - Separate cache per combination

6. **Implement query function**
   - Call employeeApi.getEmployees(filters)
   - Fetch paginated employee data
   - Include department information
   - Include employment details

7. **Configure query options**
   - Set staleTime to 10 minutes
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus: false
   - Employee data relatively stable

8. **Add employment type filtering**
   - full_time: Regular employees
   - part_time: Part-time employees
   - contract: Contract/temporary workers
   - all: All employment types

9. **Add status filtering**
   - active: Currently employed
   - inactive: Terminated/resigned
   - on_leave: Temporary leave
   - all: All statuses

10. **Return query result**
    - Return complete useQuery result
    - Typed with Employee array
    - Include pagination metadata

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | EmployeeFilters | No | {} | Filter options |
| filters.search | string | No | '' | Search query |
| filters.departmentId | string | No | null | Department filter |
| filters.role | string | No | null | Role filter |
| filters.employmentType | string | No | 'all' | Employment type |
| filters.status | string | No | 'active' | Employment status |
| filters.sortBy | string | No | 'name' | Sort field |
| filters.sortOrder | string | No | 'asc' | Sort direction |
| filters.page | number | No | 1 | Page number |
| filters.limit | number | No | 25 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | PaginatedEmployees | Employee records with metadata |
| data.items | Employee[] | Array of employees |
| data.total | number | Total employee count |
| data.page | number | Current page |
| data.pages | number | Total pages |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |

### Employee Data Structure

#### Employee Interface
| Field | Type | Description |
|-------|------|-------------|
| id | string | Employee identifier |
| employeeId | string | Employee number/code |
| firstName | string | First name |
| lastName | string | Last name |
| fullName | string | Full name (computed) |
| email | string | Work email |
| phone | string | null | Phone number |
| mobile | string | null | Mobile number |
| departmentId | string | Department identifier |
| departmentName | string | Department name |
| role | string | Job role/title |
| managerId | string | null | Manager employee ID |
| managerName | string | null | Manager full name |
| employmentType | string | full_time, part_time, contract |
| status | string | active, inactive, on_leave |
| hireDate | Date | Employment start date |
| terminationDate | Date | null | Employment end date |
| salary | number | null | Salary (if authorized) |
| address | Address | null | Home address |
| emergencyContact | object | null | Emergency contact info |
| createdAt | Date | Record creation |
| updatedAt | Date | Last update |

### Filter Processing

#### Employment Type Filter
```
Employment Types:
┌─────────────┐
│  full_time  │ → Regular full-time employees
│             │   40 hours/week
│             │   Full benefits
└─────────────┘

┌─────────────┐
│  part_time  │ → Part-time employees
│             │   <40 hours/week
│             │   Partial benefits
└─────────────┘

┌─────────────┐
│  contract   │ → Contract workers
│             │   Fixed-term
│             │   Project-based
└─────────────┘
```

#### Status Filter
```
Employment Status:
┌─────────────┐
│   active    │ → Currently employed
│             │   Working status
└─────────────┘

┌─────────────┐
│  on_leave   │ → Temporary leave
│             │   Medical, maternity, etc.
│             │   Expected to return
└─────────────┘

┌─────────────┐
│  inactive   │ → No longer employed
│             │   Resigned, terminated
│             │   Historical records
└─────────────┘
```

### Search Implementation

#### Multi-Field Search
```
Search Query: "john"

Searches in:
1. First name
   - "John" ✓
2. Last name
   - "Johnson" ✓
3. Full name
   - "John Smith" ✓
4. Employee ID
   - "EMP-JOHN-001" ✓
5. Email
   - "john.doe@company.com" ✓

Returns: All matching employees
```

### Sorting Strategies

#### By Name (Default)
```
Sort by: lastName, firstName
Order: Ascending (A-Z)

Example:
- Anderson, Alice
- Brown, Bob
- Smith, John
- Williams, Sarah
```

#### By Hire Date
```
Sort by: hireDate
Descending: Newest hires first
Ascending: Longest tenure first

Use Cases:
- New employee onboarding
- Seniority-based lists
- Tenure analysis
```

#### By Department
```
Sort by: departmentName, lastName
Groups employees by department
Alphabetical within department

Example:
Finance
  - Anderson, Alice
  - Smith, John
Sales
  - Brown, Bob
  - Williams, Sarah
```

### Department Hierarchy

#### Department Structure
```
Organization Structure:
┌────────────────────┐
│   Executive        │
├────────────────────┤
│ - CEO              │
│ - CFO              │
│ - CTO              │
└────────────────────┘
         │
    ┌────┴────┬────────────┐
    ▼         ▼            ▼
┌────────┐ ┌───────┐  ┌──────────┐
│Finance │ │  IT   │  │  Sales   │
├────────┤ ├───────┤  ├──────────┤
│ 5 empl │ │ 8 emp │  │ 12 empl  │
└────────┘ └───────┘  └──────────┘
```

### Role-Based Filtering

#### Common Roles
```
Role Categories:
- Management: CEO, Manager, Director
- Technical: Developer, Engineer, Analyst
- Sales: Sales Rep, Account Manager
- Support: Customer Service, Help Desk
- Finance: Accountant, Financial Analyst
- HR: HR Manager, Recruiter
- Operations: Operations Manager, Coordinator
```

### Manager Relationships

#### Reporting Structure
```
Manager Chain:
Employee: John Smith
├─ Reports to: Jane Doe (Manager)
│  └─ Reports to: Bob Johnson (Director)
│     └─ Reports to: Alice Williams (VP)
│
└─ Direct Reports: 3 employees
   ├─ Mark Brown
   ├─ Sarah Davis
   └─ Tom Wilson
```

### Privacy and Authorization

#### Sensitive Data Handling
```
Data Visibility Rules:
┌───────────────────────┬──────────┬──────────┐
│ Field                 │ Employee │ HR/Admin │
├───────────────────────┼──────────┼──────────┤
│ Name, Email, Dept     │    ✓     │    ✓     │
│ Phone, Role           │    ✓     │    ✓     │
│ Hire Date             │    ✓     │    ✓     │
│ Salary                │    ✗     │    ✓     │
│ Home Address          │    ✗     │    ✓     │
│ Emergency Contact     │    ✗     │    ✓     │
│ Termination Date      │    ✗     │    ✓     │
└───────────────────────┴──────────┴──────────┘

API filters based on user permissions
```

### Performance Optimization

#### Stale Time Configuration
```
staleTime: 10 minutes

Rationale:
- Employee data changes infrequently
- New hires occasional
- Terminations rare
- Reduce API load
```

#### Cache Strategy
```
Cache Considerations:
- Long stale time (10 min)
- No refetch on window focus
- Manual refetch on changes
- Small dataset (typically <1000 employees)
```

### Use Cases

#### Employee Directory
```
useEmployees({
  status: 'active',
  sortBy: 'name',
  sortOrder: 'asc'
})

Display: Searchable employee directory
```

#### Department View
```
useEmployees({
  departmentId: 'dept-finance',
  status: 'active'
})

Display: Department team list
```

#### Payroll Processing
```
useEmployees({
  status: 'active',
  employmentType: 'full_time',
  sortBy: 'employeeId'
})

Display: Payroll-eligible employees
```

#### Org Chart
```
useEmployees({
  status: 'active',
  sortBy: 'department'
})

Display: Hierarchical organization chart
```

### Expected Outcome
- Functional useEmployees hook
- Department and role filtering
- Employment type filtering
- Status filtering
- Privacy-aware data access
- Organizational structure support

### Verification Checklist
- [ ] useEmployees.ts file created
- [ ] EmployeeFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses employeeKeys.list()
- [ ] Search functionality implemented
- [ ] Department filtering works
- [ ] Role filtering works
- [ ] Employment type filtering works
- [ ] Status filtering works
- [ ] StaleTime set to 10 minutes
- [ ] RefetchOnWindowFocus disabled
- [ ] Return type properly typed

---

## Task 74: Create useEmployee Hook

### Overview
Create a TanStack Query hook for fetching a single employee's detailed information by ID. This hook provides comprehensive employee profile data including personal information, employment history, performance records, and attendance summaries for HR management and employee self-service.

### Dependencies
- Task 60: QueryKey Index File
- Task 73: Create useEmployees Hook (for cache consistency)
- Employee API service exists
- Employee and EmployeeDetail TypeScript interfaces defined

### Instructions

1. **Create useEmployee.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import employee services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import employeeApi service
   - Import employeeKeys from key factory
   - Import Employee, EmployeeDetail types
   - Import UseQueryResult type

3. **Define hook parameters**
   - id: string (employee ID, required)
   - includeAttendance: boolean (include attendance summary)
   - includePerformance: boolean (include performance reviews)
   - enabled: boolean (conditional fetching)

4. **Define hook function**
   - Function name: useEmployee
   - Accept id as first parameter
   - Accept options object (optional)
   - Return typed query result

5. **Implement conditional fetching**
   - Use enabled: !!id
   - Skip query if ID is falsy
   - Prevent unnecessary API calls

6. **Implement query key**
   - Use employeeKeys.detail(id, options)
   - Include options in cache key
   - Separate cache for different data levels

7. **Implement query function**
   - Call employeeApi.getEmployee(id, options)
   - Fetch employee profile
   - Optionally fetch attendance data
   - Optionally fetch performance data

8. **Configure query options**
   - Set staleTime to 15 minutes
   - Enable cache integration with list
   - Set retry to 2 attempts
   - Merge custom options

9. **Add data enrichment**
   - Calculate employment duration
   - Compute age from birth date
   - Determine years of service
   - Format display fields

10. **Return query result**
    - Return complete useQuery result
    - Typed with EmployeeDetail interface
    - Include all related data

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| id | string | Yes | - | Employee unique identifier |
| options | object | No | {} | Additional options |
| options.includeAttendance | boolean | No | false | Include attendance summary |
| options.includePerformance | boolean | No | false | Include performance reviews |
| options.enabled | boolean | No | !!id | Enable query execution |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | EmployeeDetail | null | Detailed employee object |
| isLoading | boolean | Initial fetch loading |
| isFetching | boolean | Background refetch |
| error | Error | null | Error object |
| refetch | function | Manual refetch |
| isSuccess | boolean | Success indicator |

### EmployeeDetail Data Structure

#### Core Employee Data
| Field | Type | Description |
|-------|------|-------------|
| id | string | Employee identifier |
| employeeId | string | Employee number |
| firstName | string | First name |
| middleName | string | null | Middle name |
| lastName | string | Last name |
| fullName | string | Full name (computed) |
| email | string | Work email |
| personalEmail | string | null | Personal email |
| phone | string | null | Work phone |
| mobile | string | null | Mobile phone |
| dateOfBirth | Date | null | Birth date |
| age | number | null | Computed age |
| gender | string | null | Gender |
| nationality | string | null | Nationality |
| address | Address | Home address |

#### Employment Information
| Field | Type | Description |
|-------|------|-------------|
| departmentId | string | Department identifier |
| department | Department | Full department object |
| role | string | Job title/role |
| managerId | string | null | Manager employee ID |
| manager | Employee | null | Manager details |
| employmentType | string | Employment type |
| status | string | Employment status |
| hireDate | Date | Employment start date |
| terminationDate | Date | null | Employment end date |
| probationEndDate | Date | null | Probation period end |
| yearsOfService | number | Computed tenure |
| workLocation | string | null | Primary work location |

#### Compensation (Authorization Required)
| Field | Type | Description |
|-------|------|-------------|
| salary | number | null | Base salary |
| salaryFrequency | string | null | Monthly, annual |
| currency | string | null | Salary currency |
| payrollId | string | null | Payroll system ID |
| bankAccount | object | null | Bank details |

#### Emergency Contact
| Field | Type | Description |
|-------|------|-------------|
| emergencyContact | object | null | Emergency contact |
| emergencyContact.name | string | Contact name |
| emergencyContact.relationship | string | Relationship |
| emergencyContact.phone | string | Contact phone |

#### Documents and Records
| Field | Type | Description |
|-------|------|-------------|
| documents | Document[] | null | Uploaded documents |
| certifications | Certification[] | null | Professional certs |
| trainings | Training[] | null | Training records |

#### Related Data (Optional)
| Field | Type | Description |
|-------|------|-------------|
| attendanceSummary | object | null | Attendance statistics |
| performanceReviews | Review[] | null | Performance history |
| directReports | Employee[] | null | Team members |

### Conditional Data Loading

#### Include Attendance Option
```
includeAttendance: false (default)
- Profile information only
- Faster response (~2KB)
- Use for: General employee view

includeAttendance: true
- Profile + attendance summary
- Additional ~2KB
- Use for: HR dashboard, attendance review
- Includes: Days present, absent, late, on leave
```

#### Include Performance Option
```
includePerformance: false (default)
- No performance review data
- Basic profile only
- Use for: Employee directory

includePerformance: true
- Profile + performance reviews
- Additional ~5KB
- Use for: Performance management
- Includes: Review history, ratings, goals
```

### Cache Strategy

#### Query Key Variations
```
Cache Keys:
['employees', 'detail', 'emp-123', {}]
['employees', 'detail', 'emp-123', { includeAttendance: true }]
['employees', 'detail', 'emp-123', { includeAttendance: true, includePerformance: true }]

Benefits:
- Partial data served quickly
- Full data loaded on demand
- Optimal performance per use case
```

### Data Enrichment

#### Age Calculation
```
Age Computation:
dateOfBirth: "1990-05-15"
currentDate: "2026-01-25"
age: 35 years

Display:
"35 years old" or "Born May 15, 1990"

Privacy: Hide if not authorized
```

#### Years of Service
```
Tenure Calculation:
hireDate: "2020-03-01"
currentDate: "2026-01-25"
yearsOfService: 5.9 years

Display:
"5 years, 10 months"

Milestones:
- 1 year: Probation complete
- 5 years: Long service award
- 10 years: Tenure recognition
```

#### Probation Status
```
Probation Logic:
hireDate: "2025-11-01"
probationPeriod: 90 days
probationEndDate: "2026-01-30"
currentDate: "2026-01-25"

Status: "On probation (5 days remaining)"

Post-probation: "Permanent employee"
```

### Attendance Summary Structure

#### Attendance Statistics
| Field | Type | Description |
|-------|------|-------------|
| period | string | Summary period (e.g., "This Month") |
| totalDays | number | Total working days |
| presentDays | number | Days present |
| absentDays | number | Days absent |
| lateDays | number | Days late |
| leaveDays | number | Days on leave |
| attendanceRate | number | Percentage (presentDays / totalDays) |

#### Attendance Rate Display
```
Attendance Rate Calculation:
presentDays: 18
totalDays: 20
attendanceRate: 90%

Status Indicators:
95-100%: Excellent (Green)
85-94%:  Good (Blue)
70-84%:  Average (Yellow)
<70%:    Poor (Red)

Display: "90% attendance (18 of 20 days)"
```

### Performance Review Structure

#### Review Record
| Field | Type | Description |
|-------|------|-------------|
| id | string | Review identifier |
| period | string | Review period |
| reviewDate | Date | Review date |
| reviewType | string | Annual, quarterly, etc. |
| overallRating | number | 1-5 rating |
| goals | Goal[] | Performance goals |
| strengths | string | Strength notes |
| improvements | string | Improvement areas |
| reviewedBy | string | Manager/reviewer |

#### Rating System
```
Performance Ratings:
5: Exceeds Expectations (Outstanding)
4: Meets Expectations (Good)
3: Satisfactory (Average)
2: Needs Improvement (Below Average)
1: Unsatisfactory (Poor)

Display:
★★★★★ (5/5) - Exceeds Expectations
```

### Privacy and Authorization

#### Data Access Control
```
Field Visibility:
┌────────────────────┬──────────┬──────────┬──────────┐
│ Field              │ Employee │ Manager  │ HR/Admin │
├────────────────────┼──────────┼──────────┼──────────┤
│ Personal Info      │    ✓     │    ✓     │    ✓     │
│ Contact            │    ✓     │    ✓     │    ✓     │
│ Department, Role   │    ✓     │    ✓     │    ✓     │
│ Hire Date          │    ✓     │    ✓     │    ✓     │
│ Salary             │    ✗     │    ✗     │    ✓     │
│ Home Address       │    ✓     │    ✗     │    ✓     │
│ Emergency Contact  │    ✓     │    ✗     │    ✓     │
│ Performance        │    ✓     │    ✓     │    ✓     │
│ Attendance         │    ✓     │    ✓     │    ✓     │
└────────────────────┴──────────┴──────────┴──────────┘

Self-service: Employee views own data
Management: Manager views team data
HR: Full access to all employees
```

### Error Handling

#### Employee Not Found (404)
```
Scenarios:
- Invalid employee ID
- Employee deleted
- No access permission

Response:
- error.code: "EMPLOYEE_NOT_FOUND"
- Redirect to employee list
- Show notification
```

#### Access Denied (403)
```
Scenarios:
- Unauthorized to view employee
- Different tenant
- Insufficient permissions

Response:
- error.code: "FORBIDDEN"
- Show error message
- Don't expose employee existence
```

### Performance Optimization

#### Stale Time Configuration
```
staleTime: 15 minutes

Rationale:
- Employee data very stable
- Changes infrequent
- Long stale time acceptable
- Reduce API load
```

### Use Cases

#### Employee Profile Page
```
useEmployee('emp-123', {
  includeAttendance: false,
  includePerformance: false
})

Display: Basic employee profile
```

#### HR Dashboard
```
useEmployee('emp-123', {
  includeAttendance: true,
  includePerformance: true
})

Display: Complete employee view
```

#### Manager Team View
```
useEmployee('emp-123', {
  includeAttendance: true,
  includePerformance: true
})

Display: Team member details
```

#### Employee Self-Service
```
useEmployee(currentUserId, {
  includeAttendance: true,
  includePerformance: true
})

Display: Personal profile and records
```

### Expected Outcome
- Functional useEmployee hook
- Detailed employee information
- Optional attendance data
- Optional performance data
- Privacy-aware data access
- Cache integration with list

### Verification Checklist
- [ ] useEmployee.ts file created
- [ ] Hook accepts id parameter
- [ ] Conditional fetching (enabled: !!id)
- [ ] Query key uses employeeKeys.detail()
- [ ] includeAttendance option works
- [ ] includePerformance option works
- [ ] Age calculated correctly
- [ ] Years of service computed
- [ ] Probation status determined
- [ ] StaleTime set to 15 minutes
- [ ] Error handling for 404, 403
- [ ] Return type properly typed

---

## Task 75: Create useAttendance Hook

### Overview
Create a TanStack Query hook for fetching employee attendance records with filtering by date range, employee, and status. This hook supports attendance tracking, timesheet management, and payroll processing with real-time attendance monitoring.

### Dependencies
- Task 60: QueryKey Index File
- Attendance API service exists
- Attendance TypeScript interface defined
- Query key factory includes attendance keys

### Instructions

1. **Create useAttendance.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import attendance services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import attendanceApi service
   - Import attendanceKeys from key factory
   - Import Attendance, AttendanceFilters types
   - Import UseQueryResult type

3. **Define AttendanceFilters interface**
   - employeeId: optional string for employee filter
   - departmentId: optional string for department filter
   - status: 'all' | 'present' | 'absent' | 'late' | 'on_leave'
   - startDate: Date for date range start
   - endDate: Date for date range end
   - sortBy: 'date' | 'employee'
   - sortOrder: 'asc' | 'desc'
   - page: number for pagination
   - limit: number for page size

4. **Define hook function**
   - Function name: useAttendance
   - Accept filters parameter (required for dates)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use attendanceKeys.list(filters)
   - Include all filter parameters
   - Serialize dates in cache key

6. **Implement query function**
   - Call attendanceApi.getAttendance(filters)
   - Fetch paginated attendance records
   - Include employee information
   - Calculate attendance statistics

7. **Configure query options**
   - Set staleTime to 30 seconds
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus: true
   - Attendance frequently updated

8. **Add status filtering**
   - present: Marked present
   - absent: Marked absent
   - late: Late arrival
   - on_leave: Approved leave
   - all: All statuses

9. **Add date range validation**
   - Require startDate and endDate
   - Validate date range sanity
   - Maximum range: 31 days
   - Default: Current day

10. **Return query result**
    - Return complete useQuery result
    - Typed with Attendance array
    - Include summary statistics

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | AttendanceFilters | Yes | - | Filter options (dates required) |
| filters.employeeId | string | No | null | Employee filter |
| filters.departmentId | string | No | null | Department filter |
| filters.status | string | No | 'all' | Attendance status |
| filters.startDate | Date | Yes | - | Date range start |
| filters.endDate | Date | Yes | - | Date range end |
| filters.sortBy | string | No | 'date' | Sort field |
| filters.sortOrder | string | No | 'desc' | Sort direction |
| filters.page | number | No | 1 | Page number |
| filters.limit | number | No | 50 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | PaginatedAttendance | Attendance records with stats |
| data.items | Attendance[] | Array of attendance records |
| data.summary | object | Attendance summary statistics |
| data.total | number | Total records |
| data.page | number | Current page |
| data.pages | number | Total pages |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |

### Attendance Data Structure

#### Attendance Record
| Field | Type | Description |
|-------|------|-------------|
| id | string | Attendance record ID |
| employeeId | string | Employee identifier |
| employeeName | string | Employee full name |
| employeeNumber | string | Employee number |
| departmentName | string | Department name |
| date | Date | Attendance date |
| status | string | Attendance status |
| clockIn | Date | null | Clock in time |
| clockOut | Date | null | Clock out time |
| workHours | number | null | Hours worked |
| lateMinutes | number | null | Minutes late |
| overtimeHours | number | null | Overtime hours |
| leaveType | string | null | Type of leave (if on leave) |
| notes | string | null | Attendance notes |
| markedBy | string | null | Who marked attendance |
| markedAt | Date | When attendance marked |

### Attendance Status Categories

#### Status Definitions
```
Attendance Statuses:
┌──────────┐
│ present  │ → Employee present and on time
│          │   Clock in before cutoff
│          │   Normal working hours
└──────────┘

┌──────────┐
│  absent  │ → Employee did not attend
│          │   No clock in record
│          │   Unexcused absence
└──────────┘

┌──────────┐
│   late   │ → Employee present but late
│          │   Clock in after cutoff
│          │   Late minutes tracked
└──────────┘

┌──────────┐
│on_leave  │ → Employee on approved leave
│          │   Sick leave, vacation, etc.
│          │   Excused absence
└──────────┘
```

#### Status Determination Logic
```
Status Calculation:
1. Check if leave approved for date
   → on_leave

2. Check if clock in exists
   NO → absent
   YES → Continue

3. Check clock in time vs shift start
   Late > grace period (e.g., 15 min)
   → late
   Otherwise → present

4. Calculate work hours
   workHours = clockOut - clockIn
   
5. Calculate overtime
   overtimeHours = max(0, workHours - standardHours)
```

### Date Range Filtering

#### Required Date Range
```
Date Range Requirement:
- startDate and endDate are REQUIRED
- No default date range
- Forces explicit time period selection
- Prevents accidental large queries

Validation:
- endDate >= startDate
- Range <= 31 days (configurable)
- Both dates must be valid
```

#### Common Date Range Presets
```
Attendance Periods:
- Today: Current date only
- This Week: Monday to Sunday
- Last Week: Previous week
- This Month: 1st to today
- Last Month: Previous month (full)
- Custom: User-selected range

Default Usage:
startDate: Start of current day
endDate: End of current day
```

### Summary Statistics Structure

#### Attendance Summary
| Field | Type | Description |
|-------|------|-------------|
| totalRecords | number | Total attendance records |
| presentCount | number | Days present |
| absentCount | number | Days absent |
| lateCount | number | Days late |
| leaveCount | number | Days on leave |
| attendanceRate | number | Present / (Present + Absent) |
| averageWorkHours | number | Average hours per day |
| totalWorkHours | number | Total hours worked |
| totalOvertimeHours | number | Total overtime |

#### Attendance Rate Calculation
```
Attendance Rate Formula:
attendanceRate = (presentCount + lateCount) / (totalRecords - leaveCount) × 100

Excludes approved leave from calculation
Includes late as "present" for rate

Example:
Total Days: 20
Present: 15
Late: 2
Absent: 1
On Leave: 2

attendanceRate = (15 + 2) / (20 - 2) × 100 = 94.4%
```

### Filter Combinations

#### Employee Attendance Report
```
useAttendance({
  employeeId: 'emp-123',
  startDate: startOfMonth,
  endDate: endOfMonth,
  status: 'all'
})

Display: Monthly attendance for employee
```

#### Department Attendance
```
useAttendance({
  departmentId: 'dept-sales',
  startDate: today,
  endDate: today,
  status: 'all'
})

Display: Today's attendance for department
```

#### Absentee Report
```
useAttendance({
  status: 'absent',
  startDate: startOfWeek,
  endDate: today
})

Display: This week's absences
```

#### Late Arrivals
```
useAttendance({
  status: 'late',
  startDate: startOfMonth,
  endDate: today,
  sortBy: 'employee'
})

Display: Monthly late arrivals by employee
```

### Work Hours Tracking

#### Clock In/Out Flow
```
Daily Attendance Flow:
┌───────────┐
│ Clock In  │ → 08:00 AM
└───────────┘
      │
      ▼
┌───────────┐
│  Working  │
└───────────┘
      │
      ▼
┌───────────┐
│ Clock Out │ → 05:00 PM
└───────────┘
      │
      ▼
Work Hours: 9 hours
Standard: 8 hours
Overtime: 1 hour
```

#### Hours Calculation
```
Work Hours:
clockIn:  08:15 AM
clockOut: 05:30 PM
workHours: 9.25 hours

Standard Hours: 8 hours
Overtime: 1.25 hours

Break Deduction (if configured):
Lunch Break: 1 hour
Net Work Hours: 8.25 hours
```

### Leave Type Tracking

#### Leave Categories
```
Leave Types:
- Sick Leave
- Annual Leave / Vacation
- Maternity/Paternity Leave
- Unpaid Leave
- Compensatory Leave
- Public Holiday
- Bereavement Leave

Each leave type tracked separately
Affects attendance rate differently
```

### Real-Time Updates

#### Auto-Refetch Configuration
```
staleTime: 30 seconds

Rationale:
- Real-time attendance monitoring
- Clock in/out updates frequent
- Balance freshness vs load
- Critical for daily operations

Refetch Triggers:
- Window focus: Yes
- Interval: Optional (for live dashboard)
- On clock in/out: Manual invalidation
```

### Performance Optimization

#### Pagination Strategy
```
Page Size:
- Default: 50 records
- Daily view: 100 records (all staff)
- Monthly view: 50 records with pagination
- Export: 1000 maximum

Performance:
50 records:  ~150ms
100 records: ~250ms
```

#### Date Range Limit
```
Maximum Range: 31 days

Prevents:
- Excessive data loading
- Slow query performance
- Memory issues
- UI responsiveness problems

For longer periods:
- Use reports (Task 77)
- Export functionality
- Aggregate summaries
```

### Use Cases

#### Daily Attendance Dashboard
```
useAttendance({
  startDate: today,
  endDate: today,
  status: 'all',
  sortBy: 'employee'
})

Display: Today's attendance with real-time updates
```

#### Employee Timesheet
```
useAttendance({
  employeeId: 'emp-123',
  startDate: startOfMonth,
  endDate: endOfMonth
})

Display: Monthly timesheet for employee
```

#### Attendance Monitoring
```
useAttendance({
  status: 'absent',
  startDate: today,
  endDate: today
})

Display: Today's absentees for follow-up
```

#### Payroll Processing
```
useAttendance({
  startDate: payrollStart,
  endDate: payrollEnd,
  status: 'all'
})

Display: Attendance for payroll calculation
```

### Expected Outcome
- Functional useAttendance hook
- Date range required filtering
- Status filtering
- Work hours tracking
- Attendance rate calculation
- Summary statistics
- Real-time updates support

### Verification Checklist
- [ ] useAttendance.ts file created
- [ ] AttendanceFilters interface defined
- [ ] Hook requires startDate and endDate
- [ ] Query key uses attendanceKeys.list()
- [ ] Status filtering implemented
- [ ] Employee filtering works
- [ ] Department filtering works
- [ ] Date range validation implemented
- [ ] Summary statistics calculated
- [ ] Work hours computed correctly
- [ ] StaleTime set to 30 seconds
- [ ] KeepPreviousData enabled
- [ ] Return type properly typed

---

## Task 76: Create useDashboardStats Hook

### Overview
Create a TanStack Query hook for fetching real-time dashboard statistics and key performance indicators (KPIs) for the ERP system. This hook provides aggregated metrics for sales, orders, inventory, customers, and financial data with auto-refresh capabilities for live dashboard displays.

### Dependencies
- Task 60: QueryKey Index File
- Dashboard API service exists
- DashboardStats TypeScript interface defined
- Multiple module APIs accessible

### Instructions

1. **Create useDashboardStats.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import dashboard services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import dashboardApi service
   - Import dashboardKeys from key factory
   - Import DashboardStats, StatsFilters types
   - Import UseQueryResult type

3. **Define StatsFilters interface**
   - period: 'today' | 'week' | 'month' | 'year'
   - compareWithPrevious: boolean (include comparison)
   - modules: array of modules to include
   - refreshInterval: number (milliseconds)

4. **Define hook function**
   - Function name: useDashboardStats
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use dashboardKeys.stats(filters)
   - Include period in cache key
   - Separate cache per period

6. **Implement query function**
   - Call dashboardApi.getStats(filters)
   - Fetch aggregated statistics
   - Calculate comparisons if enabled
   - Format KPIs

7. **Configure query options**
   - Set staleTime to 1 minute
   - Enable refetchInterval based on filters
   - Set refetchOnWindowFocus: true
   - Dashboard needs fresh data

8. **Add period comparison**
   - Calculate previous period stats
   - Compute percentage change
   - Determine trend direction
   - Format comparison display

9. **Add modular stats loading**
   - Support loading specific modules only
   - Reduce payload for focused dashboards
   - Enable/disable modules dynamically

10. **Return query result**
    - Return complete useQuery result
    - Typed with DashboardStats interface
    - Include all KPIs and comparisons

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | StatsFilters | No | {} | Filter options |
| filters.period | string | No | 'today' | Time period |
| filters.compareWithPrevious | boolean | No | true | Include comparison |
| filters.modules | string[] | No | all | Modules to include |
| filters.refreshInterval | number | No | 60000 | Auto-refresh (ms) |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | DashboardStats | Dashboard statistics |
| isLoading | boolean | Initial loading state |
| isFetching | boolean | Background refetch |
| error | Error | null | Error object |
| refetch | function | Manual refetch |
| dataUpdatedAt | number | Last update timestamp |

### DashboardStats Data Structure

#### Sales Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalSales | number | Total sales amount |
| salesCount | number | Number of sales transactions |
| averageOrderValue | number | Average sale amount |
| salesTrend | string | 'up' | 'down' | 'stable' |
| salesChange | number | Percentage change vs previous |
| topSellingProducts | Product[] | Best sellers |

#### Order Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalOrders | number | Total order count |
| pendingOrders | number | Orders pending confirmation |
| completedOrders | number | Completed orders |
| cancelledOrders | number | Cancelled orders |
| ordersTrend | string | Trend direction |
| ordersChange | number | Percentage change |

#### Inventory Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalProducts | number | Total product count |
| lowStockProducts | number | Products below reorder level |
| outOfStockProducts | number | Products with zero stock |
| totalInventoryValue | number | Total stock value |
| stockTrend | string | Trend direction |

#### Customer Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalCustomers | number | Total customer count |
| newCustomers | number | New customers in period |
| activeCustomers | number | Customers with orders |
| customersTrend | string | Trend direction |
| customersChange | number | Percentage change |
| topCustomers | Customer[] | Highest spenders |

#### Financial Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalRevenue | number | Total revenue |
| outstandingPayments | number | Unpaid invoices total |
| overduePayments | number | Overdue invoices total |
| profitMargin | number | Profit margin percentage |
| revenueTrend | string | Trend direction |
| revenueChange | number | Percentage change |

### Period Definitions

#### Time Period Options
```
Period Configurations:
┌────────┬─────────────────────┬──────────────────────┐
│ Period │ Current Range       │ Previous Comparison  │
├────────┼─────────────────────┼──────────────────────┤
│ today  │ Today 00:00 - now   │ Yesterday            │
│ week   │ Mon - now           │ Previous week        │
│ month  │ 1st - now           │ Previous month       │
│ year   │ Jan 1 - now         │ Previous year        │
└────────┴─────────────────────┴──────────────────────┘
```

#### Period Calculation Examples
```
Example: January 25, 2026

Today:
- Current: Jan 25, 2026 (00:00 - now)
- Previous: Jan 24, 2026 (full day)

Week:
- Current: Jan 20-25, 2026 (Mon - now)
- Previous: Jan 13-19, 2026 (full week)

Month:
- Current: Jan 1-25, 2026 (month start - now)
- Previous: Dec 1-31, 2025 (full month)

Year:
- Current: Jan 1 - Jan 25, 2026
- Previous: Jan 1 - Jan 25, 2025 (same days)
```

### Comparison Calculations

#### Percentage Change Formula
```
Change Calculation:
change = ((current - previous) / previous) × 100

Examples:
Current: 1500, Previous: 1200
change = ((1500 - 1200) / 1200) × 100 = 25%
Trend: up ↑

Current: 800, Previous: 1000
change = ((800 - 1000) / 1000) × 100 = -20%
Trend: down ↓

Current: 1000, Previous: 1000
change = 0%
Trend: stable →
```

#### Trend Determination
```
Trend Logic:
if (change > 5):    trend = 'up'      ↑
if (change < -5):   trend = 'down'    ↓
else:               trend = 'stable'  →

Threshold: 5% (configurable)

Visual Indicators:
up:     Green color, up arrow
down:   Red color, down arrow
stable: Gray color, horizontal line
```

### Modular Stats Loading

#### Module Selection
```
Available Modules:
- 'sales': Sales statistics
- 'orders': Order statistics
- 'inventory': Inventory statistics
- 'customers': Customer statistics
- 'financial': Financial statistics

Usage:
// Load all modules (default)
useDashboardStats()

// Load specific modules only
useDashboardStats({
  modules: ['sales', 'orders']
})

Benefits:
- Reduce payload size
- Faster response time
- Focused dashboards
- Bandwidth optimization
```

### Auto-Refresh Configuration

#### Refresh Interval
```
Refresh Strategies:
┌──────────────────┬──────────────┬────────────┐
│ Dashboard Type   │ Interval     │ Use Case   │
├──────────────────┼──────────────┼────────────┤
│ Executive        │ 5 minutes    │ Overview   │
│ Sales            │ 1 minute     │ Real-time  │
│ Operations       │ 30 seconds   │ Live ops   │
│ Analytics        │ 15 minutes   │ Analysis   │
└──────────────────┴──────────────┴────────────┘

Configuration:
useDashboardStats({
  refreshInterval: 60000 // 1 minute
})

Disable:
refreshInterval: 0 or false
```

#### Intelligent Refresh
```
Refresh Optimization:
1. Only refresh when tab is active
2. Pause when user is inactive
3. Exponential backoff on errors
4. Faster refresh during business hours
5. Slower refresh outside hours

Implementation:
refetchInterval: isBusinessHours ? 60000 : 300000
refetchIntervalInBackground: false
```

### Top Lists

#### Top Selling Products
| Field | Type | Description |
|-------|------|-------------|
| productId | string | Product identifier |
| productName | string | Product name |
| quantitySold | number | Units sold in period |
| revenue | number | Total revenue generated |
| percentOfTotal | number | Percentage of total sales |

#### Top Customers
| Field | Type | Description |
|-------|------|-------------|
| customerId | string | Customer identifier |
| customerName | string | Customer name |
| orderCount | number | Orders in period |
| totalSpent | number | Total purchase amount |
| percentOfRevenue | number | Percentage of total revenue |

### Performance Optimization

#### Stale Time Configuration
```
staleTime: 1 minute

Rationale:
- Dashboard data time-sensitive
- KPIs change frequently
- Users expect fresh data
- Balance freshness vs load

With Auto-Refresh:
staleTime: 0 (always fetch fresh)
refetchInterval: 60000 (every minute)
```

#### Caching Strategy
```
Cache Management:
- Different cache per period
- Period change = new fetch
- Comparison data cached separately
- Previous period reused when possible

Example:
User views 'today' stats → Cached
User switches to 'week' → New fetch
User switches back to 'today' → From cache (if fresh)
```

### Error Handling

#### Partial Data Loading
```
Graceful Degradation:
If a module fails:
1. Show other modules' data
2. Display error for failed module
3. Allow retry for failed module
4. Don't fail entire dashboard

Example:
Sales stats: ✓ Loaded
Orders stats: ✓ Loaded
Inventory stats: ✗ Error
→ Show sales and orders, error message for inventory
```

#### Stale Data Display
```
Stale Data Handling:
1. Show last successful data
2. Display "Last updated: 5 minutes ago"
3. Show loading indicator
4. Attempt background refresh
5. Allow manual refresh

User sees:
"Data as of 14:30 (5 min ago)"
[Refresh button]
```

### Use Cases

#### Executive Dashboard
```
useDashboardStats({
  period: 'month',
  compareWithPrevious: true,
  refreshInterval: 300000 // 5 minutes
})

Display: Monthly KPIs with comparison
```

#### Sales Real-Time Dashboard
```
useDashboardStats({
  period: 'today',
  modules: ['sales', 'orders'],
  compareWithPrevious: true,
  refreshInterval: 60000 // 1 minute
})

Display: Today's sales metrics, live updates
```

#### Inventory Dashboard
```
useDashboardStats({
  period: 'week',
  modules: ['inventory'],
  compareWithPrevious: false,
  refreshInterval: 300000 // 5 minutes
})

Display: Weekly inventory metrics
```

#### Custom Dashboard Widget
```
useDashboardStats({
  period: 'today',
  modules: ['sales'],
  compareWithPrevious: true,
  refreshInterval: 0 // Manual refresh only
})

Display: Single metric widget
```

### Expected Outcome
- Functional useDashboardStats hook
- Period-based statistics
- Comparison with previous period
- Modular stats loading
- Auto-refresh capability
- Trend indicators
- Top lists included

### Verification Checklist
- [ ] useDashboardStats.ts file created
- [ ] StatsFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses dashboardKeys.stats()
- [ ] All periods supported (today, week, month, year)
- [ ] Comparison calculations correct
- [ ] Trend determination works
- [ ] Module selection implemented
- [ ] Auto-refresh configurable
- [ ] Top lists included
- [ ] StaleTime set to 1 minute
- [ ] RefetchInterval configurable
- [ ] Return type properly typed

---

## Task 77: Create useReports Hook

### Overview
Create a TanStack Query hook for fetching generated reports and business intelligence data. This hook supports various report types including sales reports, inventory reports, financial reports, and custom reports with filtering, date ranges, and export capabilities.

### Dependencies
- Task 60: QueryKey Index File
- Reports API service exists
- Report TypeScript interfaces defined
- Query key factory includes report keys

### Instructions

1. **Create useReports.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import reports services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import reportsApi service
   - Import reportKeys from key factory
   - Import Report, ReportFilters types
   - Import UseQueryResult type

3. **Define ReportFilters interface**
   - reportType: sales, inventory, financial, customer, custom
   - dateRange: start and end dates
   - groupBy: day, week, month, quarter, year
   - format: table, chart, summary
   - filters: report-specific filters
   - includeChartData: boolean for visualization data

4. **Define hook function**
   - Function name: useReports
   - Accept reportType as first parameter
   - Accept filters parameter
   - Accept custom query options
   - Return typed query result

5. **Implement query key generation**
   - Use reportKeys.generate(reportType, filters)
   - Include all filter parameters
   - Serialize date ranges in key

6. **Implement query function**
   - Call reportsApi.generateReport(reportType, filters)
   - Fetch/generate report data
   - Include aggregations
   - Format for display

7. **Configure query options**
   - Set staleTime to 5 minutes
   - Disable refetchOnWindowFocus (reports stable)
   - Set cacheTime to 15 minutes
   - Reports are compute-intensive

8. **Add report type handling**
   - Sales Report: Revenue, orders, products
   - Inventory Report: Stock levels, movements
   - Financial Report: Income, expenses, profit
   - Customer Report: Acquisition, retention
   - Custom Report: User-defined parameters

9. **Add grouping logic**
   - Group data by time period
   - Aggregate metrics per group
   - Calculate totals and averages
   - Format for visualization

10. **Return query result**
    - Return complete useQuery result
    - Typed with Report interface
    - Include data and chart data

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| reportType | string | Yes | - | Type of report |
| filters | ReportFilters | Yes | - | Report parameters |
| filters.dateRange | object | Yes | - | Start and end dates |
| filters.groupBy | string | No | 'day' | Grouping period |
| filters.format | string | No | 'table' | Output format |
| filters.includeChartData | boolean | No | true | Include viz data |
| options | object | No | {} | Additional query options |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | Report | Report data and metadata |
| data.type | string | Report type |
| data.title | string | Report title |
| data.period | object | Date range |
| data.rows | array | Report data rows |
| data.summary | object | Aggregated totals |
| data.chartData | object | null | Chart visualization data |
| isLoading | boolean | Loading state |
| isFetching | boolean | Refetch state |
| error | Error | null | Error object |
| refetch | function | Manual refetch/regenerate |

### Report Types

#### Sales Report
```
Sales Report Structure:
┌─────────────────────────────────────────┐
│ Sales Report - January 2026             │
├─────────────┬───────┬─────────┬─────────┤
│ Date        │Orders │Revenue  │ Avg Order│
├─────────────┼───────┼─────────┼─────────┤
│ Jan 1       │  45   │$12,500  │ $278    │
│ Jan 2       │  52   │$15,800  │ $304    │
│ Jan 3       │  38   │$10,200  │ $268    │
│ ...         │  ...  │  ...    │  ...    │
├─────────────┼───────┼─────────┼─────────┤
│ Total       │ 1,245 │$350,000 │ $281    │
└─────────────┴───────┴─────────┴─────────┘

Metrics:
- Total orders
- Total revenue
- Average order value
- Top products
- Sales by category
- Sales trend
```

#### Inventory Report
```
Inventory Report Structure:
┌─────────────────────────────────────────┐
│ Inventory Report - Current              │
├──────────────┬─────────┬────────┬───────┤
│ Product      │ Stock   │ Value  │Status │
├──────────────┼─────────┼────────┼───────┤
│ Product A    │   150   │$7,500  │ OK    │
│ Product B    │    12   │$1,200  │ Low   │
│ Product C    │     0   │$0      │ Out   │
│ ...          │   ...   │  ...   │ ...   │
├──────────────┼─────────┼────────┼───────┤
│ Total        │  2,450  │$98,000 │       │
└──────────────┴─────────┴────────┴───────┘

Metrics:
- Total inventory value
- Low stock items count
- Out of stock items count
- Stock turnover rate
- Inventory by warehouse
```

#### Financial Report
```
Financial Report Structure:
┌─────────────────────────────────────────┐
│ Financial Report - January 2026         │
├─────────────────────────┬───────────────┤
│ Revenue                 │   $350,000    │
│ Cost of Goods Sold      │  -$210,000    │
│ ─────────────────────── │ ────────────  │
│ Gross Profit            │   $140,000    │
│ Operating Expenses      │   -$45,000    │
│ ─────────────────────── │ ────────────  │
│ Net Profit              │    $95,000    │
│ Profit Margin           │      27%      │
└─────────────────────────┴───────────────┘

Metrics:
- Total revenue
- Total expenses
- Gross profit
- Net profit
- Profit margin
- Cash flow
```

#### Customer Report
```
Customer Report Structure:
┌─────────────────────────────────────────┐
│ Customer Report - January 2026          │
├─────────────────────────┬───────────────┤
│ Total Customers         │     1,245     │
│ New Customers           │       78      │
│ Active Customers        │      856      │
│ Retention Rate          │      92%      │
│ Avg Customer Value      │   $1,250      │
│ Customer Lifetime Value │   $5,800      │
└─────────────────────────┴───────────────┘

Metrics:
- Customer acquisition
- Customer retention
- Churn rate
- Customer lifetime value
- Customer segmentation
```

### Date Range Configuration

#### Date Range Structure
```
Date Range Object:
{
  startDate: Date,
  endDate: Date,
  label: string // "Jan 1 - Jan 25, 2026"
}

Validation:
- startDate <= endDate
- Range <= 365 days (configurable)
- Both dates required
```

#### Common Date Ranges
```
Predefined Ranges:
- Last 7 Days
- Last 30 Days
- Last 90 Days
- This Month
- Last Month
- This Quarter
- Last Quarter
- This Year
- Last Year
- Custom Range (user-selected)
```

### Grouping Options

#### Time Period Grouping
```
Group By Options:
┌──────────┬────────────────────┬─────────────┐
│ Group    │ Aggregation        │ Data Points │
├──────────┼────────────────────┼─────────────┤
│ day      │ Sum per day        │ 30 (month)  │
│ week     │ Sum per week       │ 4-5 (month) │
│ month    │ Sum per month      │ 12 (year)   │
│ quarter  │ Sum per quarter    │ 4 (year)    │
│ year     │ Sum per year       │ Multiple    │
└──────────┴────────────────────┴─────────────┘

Selection Criteria:
- Short period (< 31 days): Group by day
- Medium period (31-90 days): Group by week
- Long period (> 90 days): Group by month
- Year+ analysis: Group by quarter or year
```

### Output Formats

#### Table Format
```
Table Format (default):
- Rows: Data records
- Columns: Metrics
- Sortable: Yes
- Filterable: Yes
- Exportable: CSV, Excel
- Pagination: Optional

Use Cases:
- Detailed analysis
- Data export
- Drill-down exploration
```

#### Chart Format
```
Chart Format:
- Type: Line, bar, pie
- Data: Aggregated by grouping
- Interactive: Hover tooltips
- Responsive: Yes

Chart Data Structure:
{
  labels: ['Jan 1', 'Jan 2', ...],
  datasets: [{
    label: 'Revenue',
    data: [12500, 15800, ...]
  }]
}

Use Cases:
- Trend visualization
- Comparison charts
- Dashboard widgets
```

#### Summary Format
```
Summary Format:
- Key metrics only
- No detailed rows
- Aggregated totals
- Comparison data
- Percentage changes

Use Cases:
- Executive summary
- Quick overview
- Dashboard cards
- KPI monitoring
```

### Chart Data Structure

#### Chart Data for Visualization
```
Chart Data Object:
{
  type: 'line' | 'bar' | 'pie',
  labels: string[],
  datasets: [{
    label: string,
    data: number[],
    backgroundColor: string,
    borderColor: string
  }],
  options: {
    // Chart.js options
  }
}

Automatic Generation:
- Convert table data to chart format
- Select appropriate chart type
- Apply styling
- Configure interactivity
```

### Report-Specific Filters

#### Sales Report Filters
| Filter | Type | Description |
|--------|------|-------------|
| categoryId | string | Product category |
| customerId | string | Specific customer |
| paymentMethod | string | Payment type |
| orderStatus | string | Order status |

#### Inventory Report Filters
| Filter | Type | Description |
|--------|------|-------------|
| warehouseId | string | Specific warehouse |
| stockStatus | string | in_stock, low, out |
| categoryId | string | Product category |
| valueThreshold | number | Min inventory value |

#### Financial Report Filters
| Filter | Type | Description |
|--------|------|-------------|
| accountType | string | Revenue, expense |
| departmentId | string | Department |
| costCenter | string | Cost center |
| reportingEntity | string | Entity/subsidiary |

### Performance Considerations

#### Report Generation Time
```
Generation Time by Type:
┌──────────────────┬──────────────┬────────────┐
│ Report Type      │ Complexity   │ Avg Time   │
├──────────────────┼──────────────┼────────────┤
│ Sales Summary    │ Low          │ 1-2 sec    │
│ Detailed Sales   │ Medium       │ 3-5 sec    │
│ Inventory        │ Low          │ 1-2 sec    │
│ Financial        │ High         │ 5-10 sec   │
│ Custom Complex   │ Very High    │ 10-30 sec  │
└──────────────────┴──────────────┴────────────┘

User Experience:
- Show loading indicator
- Display progress if > 5 sec
- Allow cancellation
- Cache results
```

#### Caching Strategy
```
staleTime: 5 minutes
cacheTime: 15 minutes

Rationale:
- Reports compute-intensive
- Data relatively stable
- Cache for quick access
- Reduce server load

Cache Key:
reportKeys.generate(type, filters)
- Different filters = different cache
- Same filters = reuse cache
```

### Error Handling

#### Generation Errors
```
Error Scenarios:
1. Invalid date range
   → Error: "End date must be after start date"
   
2. No data for period
   → Warning: "No data found for selected period"
   → Display empty report with message
   
3. Timeout (> 30 seconds)
   → Error: "Report generation timeout"
   → Suggest narrower date range
   
4. Insufficient permissions
   → Error: "Access denied to financial data"
```

### Use Cases

#### Monthly Sales Report
```
useReports('sales', {
  dateRange: {
    startDate: startOfMonth,
    endDate: endOfMonth
  },
  groupBy: 'day',
  format: 'table',
  includeChartData: true
})

Display: Detailed sales table with trend chart
```

#### Inventory Status Report
```
useReports('inventory', {
  dateRange: {
    startDate: now,
    endDate: now
  },
  groupBy: null, // Current snapshot
  format: 'table',
  filters: {
    stockStatus: 'low'
  }
})

Display: Low stock items list
```

#### Quarterly Financial Report
```
useReports('financial', {
  dateRange: {
    startDate: startOfQuarter,
    endDate: endOfQuarter
  },
  groupBy: 'month',
  format: 'summary',
  includeChartData: true
})

Display: Financial summary with monthly breakdown
```

#### Custom Analysis Report
```
useReports('custom', {
  dateRange: {
    startDate: customStart,
    endDate: customEnd
  },
  groupBy: 'week',
  format: 'chart',
  filters: {
    // Custom filters
  }
})

Display: Custom chart visualization
```

### Expected Outcome
- Functional useReports hook
- Multiple report types supported
- Flexible date range selection
- Configurable grouping
- Multiple output formats
- Chart data generation
- Report-specific filtering
- Performance optimized

### Verification Checklist
- [ ] useReports.ts file created
- [ ] ReportFilters interface defined
- [ ] Hook accepts reportType parameter
- [ ] Query key uses reportKeys.generate()
- [ ] All report types supported
- [ ] Date range validation implemented
- [ ] Grouping options work
- [ ] Output formats supported
- [ ] Chart data generated correctly
- [ ] Report-specific filters work
- [ ] StaleTime set to 5 minutes
- [ ] CacheTime set to 15 minutes
- [ ] Error handling implemented
- [ ] Return type properly typed

---

## Task 78: Create Hooks Index File

### Overview
Create a centralized index file that exports all query hooks for easy importing throughout the application. This barrel export file provides a single import point for all TanStack Query hooks, improving developer experience and maintainability.

### Dependencies
- All previous tasks (61-77) completed
- All query hook files exist
- TypeScript configured

### Instructions

1. **Create index.ts file**
   - Navigate to `frontend/hooks/queries/` directory
   - Create `index.ts` file
   - This will be the barrel export

2. **Add file header**
   - Add descriptive comment block
   - Explain purpose of index file
   - Note: Auto-generated or manually maintained
   - Include usage examples

3. **Import all product hooks**
   - Import useProducts from './useProducts'
   - Import useProduct from './useProduct'
   - Import useCategories from './useCategories'

4. **Import all inventory hooks**
   - Import useInventory from './useInventory'
   - Import useWarehouses from './useWarehouses'
   - Import useStockMovements from './useStockMovements'

5. **Import all customer hooks**
   - Import useCustomers from './useCustomers'
   - Import useCustomer from './useCustomer'

6. **Import all vendor hooks**
   - Import useVendors from './useVendors'

7. **Import all order hooks**
   - Import useOrders from './useOrders'
   - Import useOrder from './useOrder'

8. **Import all invoice hooks**
   - Import useInvoices from './useInvoices'

9. **Import all HR hooks**
   - Import useEmployees from './useEmployees'
   - Import useEmployee from './useEmployee'
   - Import useAttendance from './useAttendance'

10. **Import dashboard and report hooks**
    - Import useDashboardStats from './useDashboardStats'
    - Import useReports from './useReports'

11. **Create named exports**
    - Export all imported hooks
    - Use named exports (not default)
    - Group by category with comments

12. **Create type exports**
    - Export filter types
    - Export data types
    - Export result types

13. **Add JSDoc documentation**
    - Document each export
    - Include usage examples
    - Note dependencies

### Index File Structure

#### File Organization
```
frontend/hooks/queries/index.ts

Sections:
1. File header and description
2. Product module exports
3. Inventory module exports
4. Customer module exports
5. Vendor module exports
6. Sales module exports
7. Invoice module exports
8. HR module exports
9. Dashboard and reports exports
10. Type exports
```

#### Import Statement Examples
```typescript
// Individual imports
import { useProducts } from '@/hooks/queries';
import { useCustomers, useCustomer } from '@/hooks/queries';

// Multiple related imports
import {
  useProducts,
  useProduct,
  useCategories
} from '@/hooks/queries';

// Everything (not recommended)
import * as queries from '@/hooks/queries';
```

### Export Categories

#### Product Management Hooks
```typescript
/**
 * Product Management Hooks
 * Hooks for fetching product data, categories, and related information
 */
export { useProducts } from './useProducts';
export { useProduct } from './useProduct';
export { useCategories } from './useCategories';
```

#### Inventory Management Hooks
```typescript
/**
 * Inventory Management Hooks
 * Hooks for inventory levels, warehouses, and stock movements
 */
export { useInventory } from './useInventory';
export { useWarehouses } from './useWarehouses';
export { useStockMovements } from './useStockMovements';
```

#### Customer Management Hooks
```typescript
/**
 * Customer Management Hooks
 * Hooks for customer data and related information
 */
export { useCustomers } from './useCustomers';
export { useCustomer } from './useCustomer';
```

#### Vendor Management Hooks
```typescript
/**
 * Vendor Management Hooks
 * Hooks for vendor/supplier data
 */
export { useVendors } from './useVendors';
```

#### Sales Management Hooks
```typescript
/**
 * Sales Management Hooks
 * Hooks for orders and sales transactions
 */
export { useOrders } from './useOrders';
export { useOrder } from './useOrder';
```

#### Financial Management Hooks
```typescript
/**
 * Financial Management Hooks
 * Hooks for invoices and billing
 */
export { useInvoices } from './useInvoices';
```

#### HR Management Hooks
```typescript
/**
 * HR Management Hooks
 * Hooks for employee and attendance data
 */
export { useEmployees } from './useEmployees';
export { useEmployee } from './useEmployee';
export { useAttendance } from './useAttendance';
```

#### Dashboard and Reporting Hooks
```typescript
/**
 * Dashboard and Reporting Hooks
 * Hooks for dashboard statistics and reports
 */
export { useDashboardStats } from './useDashboardStats';
export { useReports } from './useReports';
```

### Type Exports

#### Re-export Filter Types
```typescript
/**
 * Filter Types
 * Type definitions for query filters
 */
export type { ProductFilters } from './useProducts';
export type { InventoryFilters } from './useInventory';
export type { CustomerFilters } from './useCustomers';
export type { VendorFilters } from './useVendors';
export type { OrderFilters } from './useOrders';
export type { InvoiceFilters } from './useInvoices';
export type { EmployeeFilters } from './useEmployees';
export type { AttendanceFilters } from './useAttendance';
export type { StatsFilters } from './useDashboardStats';
export type { ReportFilters } from './useReports';
```

#### Re-export Data Types
```typescript
/**
 * Data Types
 * Type definitions for data structures
 */
export type { Product, Category } from './useProducts';
export type { InventoryItem } from './useInventory';
export type { Customer } from './useCustomers';
export type { Vendor } from './useVendors';
export type { Order } from './useOrders';
export type { Invoice } from './useInvoices';
export type { Employee } from './useEmployees';
export type { Attendance } from './useAttendance';
export type { DashboardStats } from './useDashboardStats';
export type { Report } from './useReports';
```

### Usage Documentation

#### Component Usage Examples
```typescript
/**
 * Usage Example: Product List Component
 * 
 * import { useProducts } from '@/hooks/queries';
 * 
 * function ProductList() {
 *   const { data, isLoading, error } = useProducts({
 *     status: 'active',
 *     page: 1
 *   });
 * 
 *   if (isLoading) return <Loading />;
 *   if (error) return <Error />;
 *   return <List items={data.items} />;
 * }
 */

/**
 * Usage Example: Dashboard Component
 * 
 * import { useDashboardStats } from '@/hooks/queries';
 * 
 * function Dashboard() {
 *   const { data } = useDashboardStats({
 *     period: 'today',
 *     refreshInterval: 60000
 *   });
 * 
 *   return <Stats data={data} />;
 * }
 */
```

### Maintenance Guidelines

#### Adding New Hooks
```
Steps to Add New Hook:
1. Create new hook file in hooks/queries/
2. Implement hook following established patterns
3. Add import to index.ts
4. Add export to appropriate category
5. Export types if applicable
6. Update documentation
7. Run linting and type checks
```

#### Removing Deprecated Hooks
```
Steps to Remove Hook:
1. Mark as deprecated in hook file
2. Add deprecation notice in index.ts
3. Update documentation
4. After migration period, remove import
5. Remove export from index.ts
6. Delete hook file
```

### File Organization Best Practices

#### Alphabetical Ordering
- Order imports alphabetically within category
- Order exports alphabetically
- Easier to locate specific hooks
- Consistent code style

#### Category Grouping
- Group related hooks together
- Clear section comments
- Logical organization
- Improved readability

#### Consistent Naming
- All hooks start with "use"
- Singular for detail hooks (useProduct)
- Plural for list hooks (useProducts)
- Clear, descriptive names

### Expected Outcome
- Centralized index.ts file created
- All query hooks exported
- Organized by functional category
- Type exports included
- Usage documentation provided
- Easy to import and use
- Maintainable structure

### Verification Checklist
- [ ] index.ts file created in hooks/queries/
- [ ] All product hooks exported
- [ ] All inventory hooks exported
- [ ] All customer hooks exported
- [ ] All vendor hooks exported
- [ ] All order hooks exported
- [ ] All invoice hooks exported
- [ ] All HR hooks exported
- [ ] Dashboard and report hooks exported
- [ ] All filter types exported
- [ ] All data types exported
- [ ] Category comments added
- [ ] Usage examples included
- [ ] JSDoc documentation complete
- [ ] File compiles without errors
- [ ] Import statements work in test file

---

## Summary

This document completed the creation of 8 additional TanStack Query hooks for the ERP system:

### Hooks Created (Tasks 71-78)
- **Sales Detail**: useOrder (single order detail view)
- **Financial**: useInvoices (accounts receivable management)
- **Human Resources**: useEmployees, useEmployee (employee management)
- **Attendance**: useAttendance (time tracking and attendance)
- **Dashboard**: useDashboardStats (real-time KPIs and metrics)
- **Reporting**: useReports (business intelligence reports)
- **Integration**: Index file (centralized exports)

### Combined with Document 01 (Tasks 61-70)
The complete Group E implementation provides:
- **18 query hooks** total (17 data hooks + 1 index)
- **All major ERP modules** covered
- **Consistent patterns** across all hooks
- **Type-safe interfaces** for all data
- **Comprehensive filtering** capabilities
- **Real-time updates** where needed
- **Performance optimization** built-in
- **Error handling** standardized

### Key Features Implemented
1. **Query Key Factory Integration**: All hooks use centralized key management
2. **Caching Strategy**: Appropriate stale times per module
3. **Pagination Support**: Consistent pagination across list hooks
4. **Filtering**: Comprehensive filter options for each module
5. **Sorting**: Multiple sort options where applicable
6. **Real-time Updates**: Auto-refresh for time-sensitive data
7. **Conditional Fetching**: Enable/disable queries as needed
8. **Type Safety**: Full TypeScript coverage
9. **Error Handling**: Consistent error patterns
10. **Performance**: Optimized for large datasets

### Next Steps
Proceed to **Group F** to implement:
- Mutation hooks for data modification
- Cache invalidation strategies
- Optimistic updates
- TanStack Query DevTools configuration

**All tasks in Group E (Tasks 61-78) are now complete!**
