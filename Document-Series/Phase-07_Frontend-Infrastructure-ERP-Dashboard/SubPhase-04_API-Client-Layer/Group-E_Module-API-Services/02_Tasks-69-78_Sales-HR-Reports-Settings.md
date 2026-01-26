# Tasks 69-78: Sales, HR, Reports, Settings API Services

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** E - Module API Services  
> **Document:** 02 of 02  
> **Tasks Covered:** 69, 70, 71, 72, 73, 74, 75, 76, 77, 78

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-59-68_Product-Inventory-Customer-Vendor.md](01_Tasks-59-68_Product-Inventory-Customer-Vendor.md)

---

## Document Overview

This document covers the creation of typed API services for Sales, HR, Reports, and Settings modules. Each service provides type-safe operations with proper error handling, data transformation, and integration with the API client infrastructure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 69 | Create Sales Types | Low | 20 min |
| 70 | Create Sales Service | Medium | 45 min |
| 71 | Create Invoice Service | Medium | 40 min |
| 72 | Create HR Types | Low | 20 min |
| 73 | Create Employee Service | Medium | 45 min |
| 74 | Create Attendance Service | Low | 30 min |
| 75 | Create Payroll Service | Medium | 40 min |
| 76 | Create Reports Types | Low | 15 min |
| 77 | Create Reports Service | Medium | 35 min |
| 78 | Create Settings Service | Low | 30 min |

---

## Task 69: Create Sales Types

### Overview
Define comprehensive TypeScript types for sales operations including orders, order items, payment processing, fulfillment, and order status tracking. These types support the complete sales workflow from quote to delivery.

### Dependencies
- Task 08: Base API types
- Task 59: Product types (for product references)
- Task 65: Customer types (for customer references)
- Frontend TypeScript configuration

### Instructions

1. **Create sales types file**
   - Navigate to `frontend/src/types/` directory
   - Create new file named `sales.types.ts`
   - Add file header and exports overview

2. **Define OrderStatus enum**
   - Create enum for order lifecycle
   - Include: DRAFT, PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED, REFUNDED
   - Tracks order progression

3. **Define OrderType enum**
   - Create enum for order categorization
   - Include: SALE, QUOTE, RETURN, EXCHANGE
   - Determines order behavior

4. **Define PaymentStatus enum**
   - Create enum for payment state
   - Include: UNPAID, PARTIAL, PAID, OVERPAID, REFUNDED
   - Tracks payment completion

5. **Define FulfillmentStatus enum**
   - Create enum for delivery state
   - Include: UNFULFILLED, PARTIALLY_FULFILLED, FULFILLED, DELIVERED, RETURNED
   - Tracks shipping status

6. **Define ShippingMethod enum**
   - Create enum for delivery options
   - Include: PICKUP, STANDARD, EXPRESS, OVERNIGHT, COURIER
   - Affects delivery time and cost

7. **Define OrderSource enum**
   - Create enum for order origin
   - Include: POS, WEBSTORE, PHONE, EMAIL, WALK_IN
   - Tracks sales channel

8. **Define OrderItem interface**
   - Represents line item in order
   - Include: id, orderId, productId, variantId
   - Include: sku, name, description, quantity
   - Include: unitPrice, discount, discountType (FIXED, PERCENTAGE)
   - Include: taxRate, taxAmount, subtotal, total
   - Include: warehouseId, notes

9. **Define OrderDiscount interface**
   - Represents order-level discount
   - Include: id, orderId, discountCode, discountName
   - Include: discountType, discountValue, discountAmount
   - Include: appliedBy, appliedAt

10. **Define OrderPayment interface**
    - Represents payment transaction
    - Include: id, orderId, paymentNumber, paymentDate
    - Include: paymentMethod (CASH, CARD, BANK_TRANSFER, CREDIT)
    - Include: amount, referenceNumber, cardLastFour
    - Include: status, processedBy, notes

11. **Define OrderShipment interface**
    - Represents shipment details
    - Include: id, orderId, shipmentNumber, carrier
    - Include: trackingNumber, shippingMethod
    - Include: shippedDate, estimatedDelivery, deliveredDate
    - Include: items (array with productId, quantity)
    - Include: weight, dimensions, shippingCost

12. **Define OrderAddress interface**
    - Represents shipping/billing address
    - Include: addressType (BILLING, SHIPPING)
    - Include: firstName, lastName, companyName
    - Include: street, street2, city, state, postalCode, country
    - Include: phone, email

13. **Define OrderNote interface**
    - Represents order comment
    - Include: id, orderId, note, category
    - Include: isCustomerVisible, createdBy, createdAt

14. **Define Order interface (main entity)**
    - Core order entity
    - Include: id, tenantId, orderNumber, orderType, orderStatus
    - Include: orderSource, orderDate
    - Include: customerId, customerName, customerEmail, customerPhone
    - Include: items (array of OrderItem)
    - Include: discounts (array of OrderDiscount)
    - Include: payments (array of OrderPayment)
    - Include: shipments (array of OrderShipment)
    - Include: billingAddress, shippingAddress
    - Include: subtotal, discountTotal, taxTotal, shippingCost, total
    - Include: paymentStatus, fulfillmentStatus
    - Include: notes, tags, customFields
    - Include: salesPersonId, warehouseId
    - Include: createdBy, createdAt, updatedAt, completedAt

15. **Define OrderCreateRequest interface**
    - API request for creating order
    - Include: all required order fields
    - Include: items array
    - Include: optional payment and shipping

16. **Define OrderUpdateRequest interface**
    - API request for updating order
    - Partial version for flexible updates
    - Only updates allowed in certain statuses

17. **Define OrderSearchParams interface**
    - Query parameters for order search
    - Include: query, customerId, orderStatus, paymentStatus
    - Include: fulfillmentStatus, orderSource, startDate, endDate
    - Include: salesPersonId, tags, sort, pagination

18. **Define OrderSummary interface**
    - Represents order statistics
    - Include: totalOrders, totalValue, averageOrderValue
    - Include: statusBreakdown, sourceBreakdown
    - Include: period (date range)

19. **Define QuickSaleRequest interface**
    - Simplified POS sale request
    - Include: items (productId, quantity, price)
    - Include: customerId (optional), payments
    - Include: warehouseId, notes

### Type Structure Diagram

```
Sales Types Hierarchy
│
├── Enums
│   ├── OrderStatus (DRAFT, PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, COMPLETED, CANCELLED, REFUNDED)
│   ├── OrderType (SALE, QUOTE, RETURN, EXCHANGE)
│   ├── PaymentStatus (UNPAID, PARTIAL, PAID, OVERPAID, REFUNDED)
│   ├── FulfillmentStatus (UNFULFILLED, PARTIALLY_FULFILLED, FULFILLED, DELIVERED, RETURNED)
│   ├── ShippingMethod (PICKUP, STANDARD, EXPRESS, OVERNIGHT, COURIER)
│   └── OrderSource (POS, WEBSTORE, PHONE, EMAIL, WALK_IN)
│
├── Supporting Interfaces
│   ├── OrderItem
│   ├── OrderDiscount
│   ├── OrderPayment
│   ├── OrderShipment
│   ├── OrderAddress
│   ├── OrderNote
│   └── OrderSummary
│
├── Main Entity
│   └── Order
│
└── API Interfaces
    ├── OrderCreateRequest
    ├── OrderUpdateRequest
    ├── OrderSearchParams
    └── QuickSaleRequest
```

### Type Relationships

| Type | Related Types | Relationship |
|------|---------------|--------------|
| Order | OrderItem | One to many items |
| Order | OrderPayment | One to many payments |
| Order | OrderShipment | One to many shipments |
| Order | OrderDiscount | One to many discounts |
| Order | Customer | Many orders to one customer |
| OrderItem | Product | Many items reference products |

### Expected Outcome
- Complete type definitions for sales domain
- Order lifecycle tracking types
- Payment and fulfillment types
- Multi-item order support
- Discount and shipping types

### Verification Checklist
- [ ] `sales.types.ts` file created
- [ ] All enums defined
- [ ] Supporting interfaces complete
- [ ] Main Order interface created
- [ ] API request interfaces defined
- [ ] Types exported
- [ ] No TypeScript errors

---

## Task 70: Create Sales Service

### Overview
Create a comprehensive sales service that provides type-safe operations for order management, payment processing, fulfillment, and order status updates. The service supports the complete sales workflow from creation to completion.

### Dependencies
- Task 69: Create Sales Types
- Task 59: Product Types
- Task 65: Customer Types
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create sales service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `sales.service.ts`
   - Import Sales types and API utilities

2. **Import required dependencies**
   - Import all sales types
   - Import Product and Customer types
   - Import APIResponse, PaginatedResponse
   - Import apiClient and error utilities

3. **Define API endpoint constants**
   - Create constant: `ORDERS_ENDPOINT = '/api/orders/'`
   - Create constants for payments, shipments, actions
   - Create constant for quick sale: `/api/orders/quick-sale/`

4. **Create getOrders function**
   - Signature: `(params?: OrderSearchParams) => Promise<PaginatedResponse<Order>>`
   - Accepts optional search/filter parameters
   - Makes GET request to `/api/orders/`
   - Returns paginated order list
   - Supports complex filtering

5. **Create getOrderById function**
   - Signature: `(id: string) => Promise<APIResponse<Order>>`
   - Accepts order ID
   - Makes GET request to `/api/orders/{id}/`
   - Returns single order with full details
   - Includes items, payments, shipments

6. **Create getOrderByNumber function**
   - Signature: `(orderNumber: string) => Promise<APIResponse<Order>>`
   - Accepts order number
   - Makes GET request to `/api/orders/by-number/{orderNumber}/`
   - Returns order matching number

7. **Create createOrder function**
   - Signature: `(data: OrderCreateRequest) => Promise<APIResponse<Order>>`
   - Accepts order creation data
   - Validates items and customer
   - Makes POST request to `/api/orders/`
   - Returns created order with generated number
   - Reserves stock for items

8. **Create updateOrder function**
   - Signature: `(id: string, data: OrderUpdateRequest) => Promise<APIResponse<Order>>`
   - Accepts order ID and update data
   - Makes PATCH request to `/api/orders/{id}/`
   - Returns updated order
   - Only allows updates in certain statuses

9. **Create deleteOrder function**
   - Signature: `(id: string) => Promise<APIResponse<void>>`
   - Accepts order ID
   - Makes DELETE request to `/api/orders/{id}/`
   - Only deletes DRAFT orders
   - Releases reserved stock

10. **Create confirmOrder function**
    - Signature: `(id: string) => Promise<APIResponse<Order>>`
    - Accepts order ID
    - Makes POST request to `/api/orders/{id}/confirm/`
    - Changes status to CONFIRMED
    - Finalizes stock reservation

11. **Create cancelOrder function**
    - Signature: `(id: string, reason: string) => Promise<APIResponse<Order>>`
    - Accepts order ID and cancellation reason
    - Makes POST request to `/api/orders/{id}/cancel/`
    - Changes status to CANCELLED
    - Releases stock and refunds payments

12. **Create addOrderItem function**
    - Signature: `(orderId: string, item: Omit<OrderItem, 'id' | 'orderId'>) => Promise<APIResponse<Order>>`
    - Accepts order ID and item data
    - Makes POST request to `/api/orders/{id}/items/`
    - Adds item to order
    - Recalculates totals

13. **Create updateOrderItem function**
    - Signature: `(orderId: string, itemId: string, data: Partial<OrderItem>) => Promise<APIResponse<Order>>`
    - Accepts order ID, item ID, and updates
    - Makes PATCH request to `/api/orders/{orderId}/items/{itemId}/`
    - Updates item quantity or price
    - Recalculates totals

14. **Create removeOrderItem function**
    - Signature: `(orderId: string, itemId: string) => Promise<APIResponse<Order>>`
    - Accepts order ID and item ID
    - Makes DELETE request to `/api/orders/{orderId}/items/{itemId}/`
    - Removes item from order
    - Recalculates totals

15. **Create applyDiscount function**
    - Signature: `(orderId: string, discount: Omit<OrderDiscount, 'id' | 'orderId'>) => Promise<APIResponse<Order>>`
    - Accepts order ID and discount data
    - Makes POST request to `/api/orders/{id}/discounts/`
    - Applies discount to order
    - Recalculates totals

16. **Create removeDiscount function**
    - Signature: `(orderId: string, discountId: string) => Promise<APIResponse<Order>>`
    - Accepts order ID and discount ID
    - Makes DELETE request to `/api/orders/{orderId}/discounts/{discountId}/`
    - Removes discount from order

17. **Create addPayment function**
    - Signature: `(orderId: string, payment: Omit<OrderPayment, 'id' | 'orderId' | 'paymentNumber'>) => Promise<APIResponse<OrderPayment>>`
    - Accepts order ID and payment data
    - Makes POST request to `/api/orders/{id}/payments/`
    - Records payment
    - Updates payment status

18. **Create refundPayment function**
    - Signature: `(orderId: string, paymentId: string, amount?: number, reason?: string) => Promise<APIResponse<OrderPayment>>`
    - Accepts order ID, payment ID, optional partial amount
    - Makes POST request to `/api/orders/{orderId}/payments/{paymentId}/refund/`
    - Processes refund
    - Updates payment and order status

19. **Create createShipment function**
    - Signature: `(orderId: string, shipment: Omit<OrderShipment, 'id' | 'orderId' | 'shipmentNumber'>) => Promise<APIResponse<OrderShipment>>`
    - Accepts order ID and shipment data
    - Makes POST request to `/api/orders/{id}/shipments/`
    - Creates shipment record
    - Updates fulfillment status
    - Creates stock movements

20. **Create updateShipment function**
    - Signature: `(orderId: string, shipmentId: string, data: Partial<OrderShipment>) => Promise<APIResponse<OrderShipment>>`
    - Accepts order ID, shipment ID, and updates
    - Makes PATCH request to `/api/orders/{orderId}/shipments/{shipmentId}/`
    - Updates tracking or delivery info

21. **Create markAsDelivered function**
    - Signature: `(orderId: string, shipmentId: string, deliveryDate: string) => Promise<APIResponse<Order>>`
    - Accepts order ID, shipment ID, and delivery date
    - Makes POST request to `/api/orders/{orderId}/shipments/{shipmentId}/deliver/`
    - Marks shipment as delivered
    - Updates order status

22. **Create addOrderNote function**
    - Signature: `(orderId: string, note: Omit<OrderNote, 'id' | 'orderId' | 'createdAt'>) => Promise<APIResponse<OrderNote>>`
    - Accepts order ID and note data
    - Makes POST request to `/api/orders/{id}/notes/`
    - Adds note to order

23. **Create getOrderNotes function**
    - Signature: `(orderId: string) => Promise<APIResponse<OrderNote[]>>`
    - Accepts order ID
    - Makes GET request to `/api/orders/{id}/notes/`
    - Returns all notes for order

24. **Create createQuickSale function**
    - Signature: `(data: QuickSaleRequest) => Promise<APIResponse<Order>>`
    - Accepts quick sale data (simplified POS)
    - Makes POST request to `/api/orders/quick-sale/`
    - Creates and completes order in one step
    - Auto-confirms and processes payment
    - Used for fast POS transactions

25. **Create getOrderSummary function**
    - Signature: `(params?: { startDate?: string; endDate?: string; salesPersonId?: string }) => Promise<APIResponse<OrderSummary>>`
    - Accepts optional filters
    - Makes GET request to `/api/orders/summary/`
    - Returns aggregated statistics
    - Shows revenue and order metrics

26. **Create getOrdersByCustomer function**
    - Signature: `(customerId: string, params?: { status?: OrderStatus; limit?: number }) => Promise<PaginatedResponse<Order>>`
    - Accepts customer ID and optional filters
    - Makes GET request to `/api/orders/by-customer/{customerId}/`
    - Returns customer's order history

27. **Create calculateOrderTotal function (utility)**
    - Signature: `(items: OrderItem[], discounts?: OrderDiscount[], shippingCost?: number) => { subtotal: number; discountTotal: number; taxTotal: number; total: number }`
    - Client-side calculation utility
    - Calculates order totals from items
    - Applies discounts and tax
    - Used for real-time updates

28. **Create export default salesService object**
    - Bundle all functions in service object
    - Provides complete sales API

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getOrders | GET | /api/orders/ | List/search orders |
| getOrderById | GET | /api/orders/{id}/ | Get single order |
| getOrderByNumber | GET | /api/orders/by-number/{number}/ | Find by number |
| createOrder | POST | /api/orders/ | Create order |
| updateOrder | PATCH | /api/orders/{id}/ | Update order |
| deleteOrder | DELETE | /api/orders/{id}/ | Delete draft |
| confirmOrder | POST | /api/orders/{id}/confirm/ | Confirm order |
| cancelOrder | POST | /api/orders/{id}/cancel/ | Cancel order |
| addOrderItem | POST | /api/orders/{id}/items/ | Add item |
| updateOrderItem | PATCH | /api/orders/{id}/items/{itemId}/ | Update item |
| removeOrderItem | DELETE | /api/orders/{id}/items/{itemId}/ | Remove item |
| applyDiscount | POST | /api/orders/{id}/discounts/ | Apply discount |
| removeDiscount | DELETE | /api/orders/{id}/discounts/{discountId}/ | Remove discount |
| addPayment | POST | /api/orders/{id}/payments/ | Record payment |
| refundPayment | POST | /api/orders/{id}/payments/{paymentId}/refund/ | Refund payment |
| createShipment | POST | /api/orders/{id}/shipments/ | Create shipment |
| updateShipment | PATCH | /api/orders/{id}/shipments/{shipmentId}/ | Update shipment |
| markAsDelivered | POST | /api/orders/{id}/shipments/{shipmentId}/deliver/ | Mark delivered |
| addOrderNote | POST | /api/orders/{id}/notes/ | Add note |
| getOrderNotes | GET | /api/orders/{id}/notes/ | List notes |
| createQuickSale | POST | /api/orders/quick-sale/ | Fast POS sale |
| getOrderSummary | GET | /api/orders/summary/ | Statistics |
| getOrdersByCustomer | GET | /api/orders/by-customer/{customerId}/ | Customer orders |

### Order Workflow

| Stage | Function | Effect |
|-------|----------|--------|
| 1. Create | createOrder | Draft order |
| 2. Add Items | addOrderItem | Build cart |
| 3. Apply Discount | applyDiscount | Reduce price |
| 4. Confirm | confirmOrder | Finalize order |
| 5. Payment | addPayment | Record payment |
| 6. Ship | createShipment | Dispatch goods |
| 7. Deliver | markAsDelivered | Complete order |

### Expected Outcome
- Complete sales service with order management
- Item and discount management
- Payment processing
- Shipment tracking
- Quick sale for POS
- Order statistics

### Verification Checklist
- [ ] `sales.service.ts` file created
- [ ] Order CRUD functions implemented
- [ ] Item management functions complete
- [ ] Discount functions added
- [ ] Payment functions implemented
- [ ] Shipment functions complete
- [ ] Quick sale function added
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 71: Create Invoice Service

### Overview
Create an invoice service for generating and managing invoices from orders. The service handles invoice creation, PDF generation, payment tracking, and invoice status management.

### Dependencies
- Task 69: Sales Types (Order interface)
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create invoice service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `invoice.service.ts`
   - Import invoice types and API utilities

2. **Import required dependencies**
   - Import Order, OrderPayment types from sales
   - Import APIResponse, PaginatedResponse
   - Import apiClient

3. **Define InvoiceStatus enum**
   - Include: DRAFT, SENT, PAID, PARTIAL, OVERDUE, VOID, CANCELLED
   - Tracks invoice lifecycle

4. **Define Invoice interface**
   - Include: id, invoiceNumber, orderId, customerId
   - Include: invoiceDate, dueDate, status
   - Include: items (from order), subtotal, tax, total
   - Include: amountPaid, amountDue
   - Include: notes, terms
   - Include: createdBy, createdAt, paidAt

5. **Define API endpoint constants**
   - Create constant: `INVOICE_ENDPOINT = '/api/invoices/'`

6. **Create getInvoices function**
   - Signature: `(params?: { customerId?: string; status?: InvoiceStatus; startDate?: string; endDate?: string }) => Promise<PaginatedResponse<Invoice>>`
   - Accepts optional filters
   - Makes GET request to `/api/invoices/`
   - Returns paginated invoice list

7. **Create getInvoiceById function**
   - Signature: `(id: string) => Promise<APIResponse<Invoice>>`
   - Accepts invoice ID
   - Makes GET request to `/api/invoices/{id}/`
   - Returns invoice with full details

8. **Create getInvoiceByNumber function**
   - Signature: `(invoiceNumber: string) => Promise<APIResponse<Invoice>>`
   - Accepts invoice number
   - Makes GET request to `/api/invoices/by-number/{invoiceNumber}/`
   - Returns matching invoice

9. **Create createInvoiceFromOrder function**
   - Signature: `(orderId: string, data?: { dueDate?: string; notes?: string; terms?: string }) => Promise<APIResponse<Invoice>>`
   - Accepts order ID and optional invoice data
   - Makes POST request to `/api/invoices/from-order/{orderId}/`
   - Generates invoice from order
   - Auto-populates items and totals

10. **Create updateInvoice function**
    - Signature: `(id: string, data: Partial<Invoice>) => Promise<APIResponse<Invoice>>`
    - Accepts invoice ID and update data
    - Makes PATCH request to `/api/invoices/{id}/`
    - Returns updated invoice
    - Only updates DRAFT invoices

11. **Create sendInvoice function**
    - Signature: `(id: string, emailTo?: string) => Promise<APIResponse<void>>`
    - Accepts invoice ID and optional email
    - Makes POST request to `/api/invoices/{id}/send/`
    - Sends invoice via email
    - Changes status to SENT

12. **Create recordInvoicePayment function**
    - Signature: `(id: string, payment: { amount: number; paymentMethod: string; paymentDate?: string; referenceNumber?: string }) => Promise<APIResponse<Invoice>>`
    - Accepts invoice ID and payment data
    - Makes POST request to `/api/invoices/{id}/payments/`
    - Records payment against invoice
    - Updates status (PAID or PARTIAL)

13. **Create voidInvoice function**
    - Signature: `(id: string, reason: string) => Promise<APIResponse<Invoice>>`
    - Accepts invoice ID and reason
    - Makes POST request to `/api/invoices/{id}/void/`
    - Changes status to VOID
    - Cannot be undone

14. **Create downloadInvoicePDF function**
    - Signature: `(id: string) => Promise<Blob>`
    - Accepts invoice ID
    - Makes GET request to `/api/invoices/{id}/pdf/`
    - Returns PDF blob
    - Used for downloading/printing

15. **Create getInvoicesByCustomer function**
    - Signature: `(customerId: string, status?: InvoiceStatus) => Promise<PaginatedResponse<Invoice>>`
    - Accepts customer ID and optional status
    - Makes GET request to `/api/invoices/by-customer/{customerId}/`
    - Returns customer's invoices

16. **Create getOverdueInvoices function**
    - Signature: `() => Promise<APIResponse<Invoice[]>>`
    - Makes GET request to `/api/invoices/overdue/`
    - Returns invoices past due date
    - Used for collections

17. **Create export default invoiceService object**
    - Bundle all functions in service object

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getInvoices | GET | /api/invoices/ | List invoices |
| getInvoiceById | GET | /api/invoices/{id}/ | Get single invoice |
| getInvoiceByNumber | GET | /api/invoices/by-number/{number}/ | Find by number |
| createInvoiceFromOrder | POST | /api/invoices/from-order/{orderId}/ | Generate invoice |
| updateInvoice | PATCH | /api/invoices/{id}/ | Update invoice |
| sendInvoice | POST | /api/invoices/{id}/send/ | Email invoice |
| recordInvoicePayment | POST | /api/invoices/{id}/payments/ | Record payment |
| voidInvoice | POST | /api/invoices/{id}/void/ | Void invoice |
| downloadInvoicePDF | GET | /api/invoices/{id}/pdf/ | Download PDF |
| getInvoicesByCustomer | GET | /api/invoices/by-customer/{customerId}/ | Customer invoices |
| getOverdueInvoices | GET | /api/invoices/overdue/ | Overdue list |

### Invoice Workflow

| Stage | Function | Effect |
|-------|----------|--------|
| 1. Create | createInvoiceFromOrder | Generate from order |
| 2. Send | sendInvoice | Email to customer |
| 3. Payment | recordInvoicePayment | Track payment |
| 4. Close | Auto-status update | Mark as paid |

### Expected Outcome
- Invoice generation from orders
- Invoice status tracking
- Payment recording
- PDF generation
- Email delivery

### Verification Checklist
- [ ] `invoice.service.ts` file created
- [ ] All functions implemented
- [ ] PDF download function added
- [ ] Email function included
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 72: Create HR Types

### Overview
Define comprehensive TypeScript types for human resources management including employees, departments, attendance, leave, and payroll. These types support HR operations and workforce management.

### Dependencies
- Task 08: Base API types
- Frontend TypeScript configuration

### Instructions

1. **Create HR types file**
   - Navigate to `frontend/src/types/` directory
   - Create new file named `hr.types.ts`
   - Add file header and exports overview

2. **Define EmploymentType enum**
   - Create enum for employment classification
   - Include: FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERN
   - Affects benefits and payroll

3. **Define EmployeeStatus enum**
   - Create enum for employee state
   - Include: ACTIVE, ON_LEAVE, SUSPENDED, TERMINATED, RETIRED
   - Controls access and payroll

4. **Define LeaveType enum**
   - Create enum for leave categories
   - Include: ANNUAL, SICK, UNPAID, MATERNITY, PATERNITY, BEREAVEMENT, STUDY
   - Used for leave management

5. **Define LeaveStatus enum**
   - Create enum for leave request state
   - Include: PENDING, APPROVED, REJECTED, CANCELLED
   - Tracks approval workflow

6. **Define AttendanceStatus enum**
   - Create enum for attendance state
   - Include: PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE
   - Daily attendance tracking

7. **Define Department interface**
   - Represents organizational unit
   - Include: id, name, code, description
   - Include: managerId, parentDepartmentId
   - Include: employeeCount, isActive

8. **Define Position interface**
   - Represents job role
   - Include: id, title, code, description
   - Include: departmentId, level, category
   - Include: isActive

9. **Define Employee interface (main entity)**
   - Core employee entity
   - Include: id, tenantId, employeeNumber, userId
   - Include: firstName, lastName, email, phone
   - Include: dateOfBirth, gender, nationality
   - Include: employmentType, status, departmentId, positionId
   - Include: hireDate, terminationDate, probationEndDate
   - Include: managerId, workLocation
   - Include: emergencyContact (name, relationship, phone)
   - Include: bankAccount (bankName, accountNumber)
   - Include: taxId, socialSecurityNumber
   - Include: salary, payrollSchedule
   - Include: isActive, createdAt, updatedAt

10. **Define LeaveBalance interface**
    - Represents leave entitlement
    - Include: id, employeeId, leaveType, year
    - Include: totalEntitlement, used, remaining, pending

11. **Define LeaveRequest interface**
    - Represents leave application
    - Include: id, employeeId, leaveType, status
    - Include: startDate, endDate, days, reason
    - Include: approvedBy, approvalDate, rejectionReason
    - Include: createdAt

12. **Define Attendance interface**
    - Represents daily attendance record
    - Include: id, employeeId, date, status
    - Include: checkInTime, checkOutTime, workHours
    - Include: isLate, lateMinutes
    - Include: notes, recordedBy

13. **Define Payroll interface**
    - Represents payroll run
    - Include: id, payrollNumber, period (month/year), status
    - Include: processedDate, paymentDate
    - Include: employeeCount, totalGross, totalDeductions, totalNet
    - Include: processedBy

14. **Define PayrollItem interface**
    - Represents individual payslip
    - Include: id, payrollId, employeeId
    - Include: basicSalary, allowances, deductions
    - Include: grossPay, netPay, taxAmount
    - Include: workingDays, paidDays, absences

15. **Define EmployeeCreateRequest interface**
    - API request for creating employee
    - Include: all required employee fields
    - Include: optional banking and emergency contact

16. **Define EmployeeUpdateRequest interface**
    - API request for updating employee
    - Partial version for flexible updates

17. **Define EmployeeSearchParams interface**
    - Query parameters for employee search
    - Include: query, departmentId, positionId, status
    - Include: employmentType, managerId, sort, pagination

### Type Structure Diagram

```
HR Types Hierarchy
│
├── Enums
│   ├── EmploymentType (FULL_TIME, PART_TIME, CONTRACT, TEMPORARY, INTERN)
│   ├── EmployeeStatus (ACTIVE, ON_LEAVE, SUSPENDED, TERMINATED, RETIRED)
│   ├── LeaveType (ANNUAL, SICK, UNPAID, MATERNITY, PATERNITY, BEREAVEMENT, STUDY)
│   ├── LeaveStatus (PENDING, APPROVED, REJECTED, CANCELLED)
│   └── AttendanceStatus (PRESENT, ABSENT, LATE, HALF_DAY, ON_LEAVE)
│
├── Supporting Interfaces
│   ├── Department
│   ├── Position
│   ├── LeaveBalance
│   ├── LeaveRequest
│   ├── Attendance
│   ├── Payroll
│   └── PayrollItem
│
├── Main Entity
│   └── Employee
│
└── API Interfaces
    ├── EmployeeCreateRequest
    ├── EmployeeUpdateRequest
    └── EmployeeSearchParams
```

### Expected Outcome
- Complete type definitions for HR domain
- Employee and department types
- Leave management types
- Attendance tracking types
- Payroll types

### Verification Checklist
- [ ] `hr.types.ts` file created
- [ ] All enums defined
- [ ] Supporting interfaces complete
- [ ] Main Employee interface created
- [ ] API request interfaces defined
- [ ] Types exported
- [ ] No TypeScript errors

---

## Task 73: Create Employee Service

### Overview
Create a comprehensive employee service that provides type-safe CRUD operations for employee management, department assignment, and employee information retrieval.

### Dependencies
- Task 72: Create HR Types
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create employee service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `employee.service.ts`
   - Import Employee types and API utilities

2. **Import required dependencies**
   - Import all HR types
   - Import APIResponse, PaginatedResponse
   - Import apiClient

3. **Define API endpoint constants**
   - Create constant: `EMPLOYEE_ENDPOINT = '/api/employees/'`
   - Create constant: `DEPARTMENT_ENDPOINT = '/api/departments/'`
   - Create constant: `POSITION_ENDPOINT = '/api/positions/'`

4. **Create getEmployees function**
   - Signature: `(params?: EmployeeSearchParams) => Promise<PaginatedResponse<Employee>>`
   - Accepts optional search/filter parameters
   - Makes GET request to `/api/employees/`
   - Returns paginated employee list

5. **Create getEmployeeById function**
   - Signature: `(id: string) => Promise<APIResponse<Employee>>`
   - Accepts employee ID
   - Makes GET request to `/api/employees/{id}/`
   - Returns employee with full details

6. **Create getEmployeeByNumber function**
   - Signature: `(employeeNumber: string) => Promise<APIResponse<Employee>>`
   - Accepts employee number
   - Makes GET request to `/api/employees/by-number/{employeeNumber}/`
   - Returns matching employee

7. **Create createEmployee function**
   - Signature: `(data: EmployeeCreateRequest) => Promise<APIResponse<Employee>>`
   - Accepts employee creation data
   - Makes POST request to `/api/employees/`
   - Returns created employee with generated number
   - Auto-creates user account if email provided

8. **Create updateEmployee function**
   - Signature: `(id: string, data: EmployeeUpdateRequest) => Promise<APIResponse<Employee>>`
   - Accepts employee ID and update data
   - Makes PATCH request to `/api/employees/{id}/`
   - Returns updated employee

9. **Create terminateEmployee function**
   - Signature: `(id: string, terminationDate: string, reason: string) => Promise<APIResponse<Employee>>`
   - Accepts employee ID, date, and reason
   - Makes POST request to `/api/employees/{id}/terminate/`
   - Changes status to TERMINATED
   - Deactivates user account

10. **Create reactivateEmployee function**
    - Signature: `(id: string) => Promise<APIResponse<Employee>>`
    - Accepts employee ID
    - Makes POST request to `/api/employees/{id}/reactivate/`
    - Changes status back to ACTIVE

11. **Create getDepartments function**
    - Signature: `(includeInactive?: boolean) => Promise<APIResponse<Department[]>>`
    - Accepts optional inactive flag
    - Makes GET request to `/api/departments/`
    - Returns all departments

12. **Create createDepartment function**
    - Signature: `(data: Omit<Department, 'id' | 'employeeCount'>) => Promise<APIResponse<Department>>`
    - Accepts department data
    - Makes POST request to `/api/departments/`
    - Returns created department

13. **Create updateDepartment function**
    - Signature: `(id: string, data: Partial<Department>) => Promise<APIResponse<Department>>`
    - Accepts department ID and updates
    - Makes PATCH request to `/api/departments/{id}/`
    - Returns updated department

14. **Create deleteDepartment function**
    - Signature: `(id: string, reassignTo?: string) => Promise<APIResponse<void>>`
    - Accepts department ID and optional reassignment
    - Makes DELETE request to `/api/departments/{id}/`
    - Validates no employees or provides reassignment

15. **Create getPositions function**
    - Signature: `(departmentId?: string) => Promise<APIResponse<Position[]>>`
    - Accepts optional department filter
    - Makes GET request to `/api/positions/`
    - Returns positions

16. **Create createPosition function**
    - Signature: `(data: Omit<Position, 'id'>) => Promise<APIResponse<Position>>`
    - Accepts position data
    - Makes POST request to `/api/positions/`
    - Returns created position

17. **Create updatePosition function**
    - Signature: `(id: string, data: Partial<Position>) => Promise<APIResponse<Position>>`
    - Accepts position ID and updates
    - Makes PATCH request to `/api/positions/{id}/`
    - Returns updated position

18. **Create deletePosition function**
    - Signature: `(id: string) => Promise<APIResponse<void>>`
    - Accepts position ID
    - Makes DELETE request to `/api/positions/{id}/`
    - Validates no employees in position

19. **Create getEmployeesByDepartment function**
    - Signature: `(departmentId: string) => Promise<APIResponse<Employee[]>>`
    - Accepts department ID
    - Makes GET request to `/api/employees/by-department/{departmentId}/`
    - Returns department employees

20. **Create getEmployeesByManager function**
    - Signature: `(managerId: string) => Promise<APIResponse<Employee[]>>`
    - Accepts manager employee ID
    - Makes GET request to `/api/employees/by-manager/{managerId}/`
    - Returns direct reports

21. **Create export default employeeService object**
    - Bundle all functions in service object

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getEmployees | GET | /api/employees/ | List employees |
| getEmployeeById | GET | /api/employees/{id}/ | Get single employee |
| getEmployeeByNumber | GET | /api/employees/by-number/{number}/ | Find by number |
| createEmployee | POST | /api/employees/ | Create employee |
| updateEmployee | PATCH | /api/employees/{id}/ | Update employee |
| terminateEmployee | POST | /api/employees/{id}/terminate/ | Terminate |
| reactivateEmployee | POST | /api/employees/{id}/reactivate/ | Reactivate |
| getDepartments | GET | /api/departments/ | List departments |
| createDepartment | POST | /api/departments/ | Create department |
| updateDepartment | PATCH | /api/departments/{id}/ | Update department |
| deleteDepartment | DELETE | /api/departments/{id}/ | Delete department |
| getPositions | GET | /api/positions/ | List positions |
| createPosition | POST | /api/positions/ | Create position |
| updatePosition | PATCH | /api/positions/{id}/ | Update position |
| deletePosition | DELETE | /api/positions/{id}/ | Delete position |
| getEmployeesByDepartment | GET | /api/employees/by-department/{id}/ | Department roster |
| getEmployeesByManager | GET | /api/employees/by-manager/{id}/ | Direct reports |

### Expected Outcome
- Complete employee management service
- Department and position management
- Employee lifecycle operations
- Organizational hierarchy queries

### Verification Checklist
- [ ] `employee.service.ts` file created
- [ ] All CRUD functions implemented
- [ ] Department functions complete
- [ ] Position functions complete
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 74: Create Attendance Service

### Overview
Create an attendance service for managing employee attendance records, check-in/check-out, and attendance reporting.

### Dependencies
- Task 72: HR Types (Attendance interface)
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create attendance service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `attendance.service.ts`
   - Import Attendance types and API utilities

2. **Import required dependencies**
   - Import Attendance, AttendanceStatus from HR types
   - Import APIResponse, PaginatedResponse
   - Import apiClient

3. **Define API endpoint constants**
   - Create constant: `ATTENDANCE_ENDPOINT = '/api/attendance/'`

4. **Create getAttendance function**
   - Signature: `(params?: { employeeId?: string; departmentId?: string; startDate?: string; endDate?: string; status?: AttendanceStatus }) => Promise<PaginatedResponse<Attendance>>`
   - Accepts optional filters
   - Makes GET request to `/api/attendance/`
   - Returns attendance records

5. **Create getAttendanceByEmployee function**
   - Signature: `(employeeId: string, month: string) => Promise<APIResponse<Attendance[]>>`
   - Accepts employee ID and month (YYYY-MM)
   - Makes GET request to `/api/attendance/employee/{employeeId}/`
   - Returns monthly attendance

6. **Create checkIn function**
   - Signature: `(employeeId: string, time?: string) => Promise<APIResponse<Attendance>>`
   - Accepts employee ID and optional time
   - Makes POST request to `/api/attendance/check-in/`
   - Records check-in time
   - Auto-detects late arrival

7. **Create checkOut function**
   - Signature: `(employeeId: string, time?: string) => Promise<APIResponse<Attendance>>`
   - Accepts employee ID and optional time
   - Makes POST request to `/api/attendance/check-out/`
   - Records check-out time
   - Calculates work hours

8. **Create markAttendance function**
   - Signature: `(data: { employeeId: string; date: string; status: AttendanceStatus; checkInTime?: string; checkOutTime?: string; notes?: string }) => Promise<APIResponse<Attendance>>`
   - Accepts manual attendance record
   - Makes POST request to `/api/attendance/mark/`
   - Creates or updates attendance
   - Used for manual corrections

9. **Create updateAttendance function**
   - Signature: `(id: string, data: Partial<Attendance>) => Promise<APIResponse<Attendance>>`
   - Accepts attendance ID and updates
   - Makes PATCH request to `/api/attendance/{id}/`
   - Returns updated record

10. **Create getAttendanceSummary function**
    - Signature: `(employeeId: string, startDate: string, endDate: string) => Promise<APIResponse<{ present: number; absent: number; late: number; halfDay: number; onLeave: number; totalWorkHours: number }>>`
    - Accepts employee ID and date range
    - Makes GET request to `/api/attendance/summary/`
    - Returns attendance statistics

11. **Create getDepartmentAttendance function**
    - Signature: `(departmentId: string, date: string) => Promise<APIResponse<Attendance[]>>`
    - Accepts department ID and date
    - Makes GET request to `/api/attendance/department/{departmentId}/`
    - Returns daily department attendance

12. **Create export default attendanceService object**
    - Bundle all functions in service object

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getAttendance | GET | /api/attendance/ | List records |
| getAttendanceByEmployee | GET | /api/attendance/employee/{id}/ | Employee attendance |
| checkIn | POST | /api/attendance/check-in/ | Record check-in |
| checkOut | POST | /api/attendance/check-out/ | Record check-out |
| markAttendance | POST | /api/attendance/mark/ | Manual entry |
| updateAttendance | PATCH | /api/attendance/{id}/ | Update record |
| getAttendanceSummary | GET | /api/attendance/summary/ | Statistics |
| getDepartmentAttendance | GET | /api/attendance/department/{id}/ | Department roster |

### Expected Outcome
- Attendance tracking service
- Check-in/check-out operations
- Manual attendance marking
- Attendance reporting

### Verification Checklist
- [ ] `attendance.service.ts` file created
- [ ] All functions implemented
- [ ] Summary function added
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 75: Create Payroll Service

### Overview
Create a payroll service for managing payroll runs, payslip generation, and salary processing.

### Dependencies
- Task 72: HR Types (Payroll interface)
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create payroll service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `payroll.service.ts`
   - Import Payroll types and API utilities

2. **Import required dependencies**
   - Import Payroll, PayrollItem from HR types
   - Import APIResponse, PaginatedResponse
   - Import apiClient

3. **Define API endpoint constants**
   - Create constant: `PAYROLL_ENDPOINT = '/api/payroll/'`

4. **Create getPayrollRuns function**
   - Signature: `(params?: { year?: number; status?: string }) => Promise<PaginatedResponse<Payroll>>`
   - Accepts optional filters
   - Makes GET request to `/api/payroll/`
   - Returns payroll runs

5. **Create getPayrollById function**
   - Signature: `(id: string) => Promise<APIResponse<Payroll>>`
   - Accepts payroll ID
   - Makes GET request to `/api/payroll/{id}/`
   - Returns payroll details with items

6. **Create createPayrollRun function**
   - Signature: `(data: { period: string; paymentDate: string; employeeIds?: string[] }) => Promise<APIResponse<Payroll>>`
   - Accepts payroll run data
   - Makes POST request to `/api/payroll/`
   - Creates payroll run
   - Calculates salaries based on attendance

7. **Create processPayroll function**
   - Signature: `(id: string) => Promise<APIResponse<Payroll>>`
   - Accepts payroll ID
   - Makes POST request to `/api/payroll/{id}/process/`
   - Finalizes payroll
   - Changes status to PROCESSED
   - Cannot be modified after

8. **Create getPayrollItems function**
   - Signature: `(payrollId: string) => Promise<APIResponse<PayrollItem[]>>`
   - Accepts payroll ID
   - Makes GET request to `/api/payroll/{id}/items/`
   - Returns all payslips in run

9. **Create getEmployeePayslips function**
   - Signature: `(employeeId: string, year?: number) => Promise<PaginatedResponse<PayrollItem>>`
   - Accepts employee ID and optional year
   - Makes GET request to `/api/payroll/employee/{employeeId}/`
   - Returns employee's payslips

10. **Create downloadPayslipPDF function**
    - Signature: `(payrollItemId: string) => Promise<Blob>`
    - Accepts payroll item ID
    - Makes GET request to `/api/payroll/items/{id}/pdf/`
    - Returns PDF blob
    - Used for downloading payslip

11. **Create updatePayrollItem function**
    - Signature: `(payrollItemId: string, data: Partial<PayrollItem>) => Promise<APIResponse<PayrollItem>>`
    - Accepts payroll item ID and updates
    - Makes PATCH request to `/api/payroll/items/{id}/`
    - Updates allowances or deductions
    - Only before payroll processed

12. **Create export default payrollService object**
    - Bundle all functions in service object

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getPayrollRuns | GET | /api/payroll/ | List payroll runs |
| getPayrollById | GET | /api/payroll/{id}/ | Get payroll details |
| createPayrollRun | POST | /api/payroll/ | Create payroll |
| processPayroll | POST | /api/payroll/{id}/process/ | Finalize payroll |
| getPayrollItems | GET | /api/payroll/{id}/items/ | List payslips |
| getEmployeePayslips | GET | /api/payroll/employee/{id}/ | Employee payslips |
| downloadPayslipPDF | GET | /api/payroll/items/{id}/pdf/ | Download payslip |
| updatePayrollItem | PATCH | /api/payroll/items/{id}/ | Update payslip |

### Payroll Workflow

| Stage | Function | Effect |
|-------|----------|--------|
| 1. Create | createPayrollRun | Draft payroll |
| 2. Review | getPayrollItems | Verify calculations |
| 3. Adjust | updatePayrollItem | Correct values |
| 4. Process | processPayroll | Finalize |
| 5. Distribute | downloadPayslipPDF | Print/email |

### Expected Outcome
- Payroll run management
- Payslip generation
- PDF export
- Employee payslip history

### Verification Checklist
- [ ] `payroll.service.ts` file created
- [ ] All functions implemented
- [ ] PDF download function added
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 76: Create Reports Types

### Overview
Define TypeScript types for reporting functionality including report configurations, parameters, and result formats. These types support various analytics and business intelligence reports.

### Dependencies
- Task 08: Base API types
- Frontend TypeScript configuration

### Instructions

1. **Create reports types file**
   - Navigate to `frontend/src/types/` directory
   - Create new file named `reports.types.ts`
   - Add file header and exports overview

2. **Define ReportType enum**
   - Create enum for report categories
   - Include: SALES, INVENTORY, CUSTOMERS, VENDORS, HR, FINANCIAL, CUSTOM
   - Categorizes reports

3. **Define ReportFormat enum**
   - Create enum for output formats
   - Include: PDF, EXCEL, CSV, JSON
   - Determines export format

4. **Define DateRangeType enum**
   - Create enum for period shortcuts
   - Include: TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, THIS_MONTH, LAST_MONTH, THIS_QUARTER, LAST_QUARTER, THIS_YEAR, LAST_YEAR, CUSTOM
   - Used for date filters

5. **Define ReportParameter interface**
   - Represents report filter parameter
   - Include: name, type (STRING, NUMBER, DATE, BOOLEAN, SELECT)
   - Include: label, required, defaultValue, options

6. **Define ReportConfig interface**
   - Represents report definition
   - Include: id, name, description, reportType
   - Include: parameters (array of ReportParameter)
   - Include: isPublic, createdBy

7. **Define ReportRequest interface**
   - Represents report execution request
   - Include: reportId, parameters (key-value pairs)
   - Include: dateRange (startDate, endDate, rangeType)
   - Include: format, filters

8. **Define ReportResult interface**
   - Represents report output
   - Include: id, reportId, reportName, generatedAt
   - Include: parameters, data (generic object or array)
   - Include: summary (key metrics), charts (visualization data)
   - Include: totalRecords, executionTime

9. **Define ChartData interface**
   - Represents visualization data
   - Include: chartType (BAR, LINE, PIE, AREA)
   - Include: title, labels, datasets
   - Include: xAxis, yAxis, legend

10. **Define SalesReport interface**
    - Represents sales analytics
    - Include: period, totalSales, totalOrders, averageOrderValue
    - Include: salesByDay, salesByProduct, salesByCustomer
    - Include: paymentMethodBreakdown, topProducts

11. **Define InventoryReport interface**
    - Represents inventory analytics
    - Include: totalProducts, totalValue, lowStockItems
    - Include: stockByCategory, stockByWarehouse
    - Include: topMovingProducts, slowMovingProducts

12. **Define CustomerReport interface**
    - Represents customer analytics
    - Include: totalCustomers, newCustomers, activeCustomers
    - Include: topCustomers, customersBySegment
    - Include: averageLifetimeValue, retentionRate

### Type Structure Diagram

```
Reports Types Hierarchy
│
├── Enums
│   ├── ReportType (SALES, INVENTORY, CUSTOMERS, VENDORS, HR, FINANCIAL, CUSTOM)
│   ├── ReportFormat (PDF, EXCEL, CSV, JSON)
│   └── DateRangeType (TODAY, YESTERDAY, THIS_WEEK, LAST_WEEK, ...)
│
├── Supporting Interfaces
│   ├── ReportParameter
│   ├── ReportConfig
│   ├── ChartData
│   ├── SalesReport
│   ├── InventoryReport
│   └── CustomerReport
│
└── API Interfaces
    ├── ReportRequest
    └── ReportResult
```

### Expected Outcome
- Complete type definitions for reports
- Flexible parameter system
- Multiple output formats
- Specific report types

### Verification Checklist
- [ ] `reports.types.ts` file created
- [ ] All enums defined
- [ ] Supporting interfaces complete
- [ ] Specific report types defined
- [ ] Types exported
- [ ] No TypeScript errors

---

## Task 77: Create Reports Service

### Overview
Create a comprehensive reports service that provides report generation, execution, and export capabilities for various business analytics reports.

### Dependencies
- Task 76: Create Reports Types
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create reports service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `reports.service.ts`
   - Import Reports types and API utilities

2. **Import required dependencies**
   - Import all reports types
   - Import APIResponse, PaginatedResponse
   - Import apiClient

3. **Define API endpoint constants**
   - Create constant: `REPORTS_ENDPOINT = '/api/reports/'`

4. **Create getReportConfigs function**
   - Signature: `(reportType?: ReportType) => Promise<APIResponse<ReportConfig[]>>`
   - Accepts optional report type filter
   - Makes GET request to `/api/reports/configs/`
   - Returns available reports

5. **Create generateReport function**
   - Signature: `(request: ReportRequest) => Promise<APIResponse<ReportResult>>`
   - Accepts report request
   - Makes POST request to `/api/reports/generate/`
   - Executes report and returns results

6. **Create exportReport function**
   - Signature: `(reportId: string, format: ReportFormat, request: ReportRequest) => Promise<Blob>`
   - Accepts report ID, format, and parameters
   - Makes POST request to `/api/reports/export/`
   - Returns file blob for download

7. **Create getSalesReport function**
   - Signature: `(startDate: string, endDate: string, filters?: { customerId?: string; productId?: string; salesPersonId?: string }) => Promise<APIResponse<SalesReport>>`
   - Accepts date range and optional filters
   - Makes GET request to `/api/reports/sales/`
   - Returns sales analytics

8. **Create getInventoryReport function**
   - Signature: `(warehouseId?: string, categoryId?: string) => Promise<APIResponse<InventoryReport>>`
   - Accepts optional filters
   - Makes GET request to `/api/reports/inventory/`
   - Returns inventory analytics

9. **Create getCustomerReport function**
   - Signature: `(startDate: string, endDate: string) => Promise<APIResponse<CustomerReport>>`
   - Accepts date range
   - Makes GET request to `/api/reports/customers/`
   - Returns customer analytics

10. **Create getDashboardMetrics function**
    - Signature: `(period?: DateRangeType) => Promise<APIResponse<{ sales: number; orders: number; customers: number; revenue: number; trends: ChartData[] }>>`
    - Accepts optional period
    - Makes GET request to `/api/reports/dashboard/`
    - Returns key metrics for dashboard

11. **Create getProfitLossReport function**
    - Signature: `(startDate: string, endDate: string) => Promise<APIResponse<{ revenue: number; costs: number; grossProfit: number; expenses: number; netProfit: number; breakdown: any[] }>>`
    - Accepts date range
    - Makes GET request to `/api/reports/profit-loss/`
    - Returns P&L statement

12. **Create getTopSellingProducts function**
    - Signature: `(startDate: string, endDate: string, limit?: number) => Promise<APIResponse<{ productId: string; productName: string; quantitySold: number; revenue: number }[]>>`
    - Accepts date range and limit
    - Makes GET request to `/api/reports/top-products/`
    - Returns best sellers

13. **Create export default reportsService object**
    - Bundle all functions in service object

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getReportConfigs | GET | /api/reports/configs/ | List available reports |
| generateReport | POST | /api/reports/generate/ | Execute report |
| exportReport | POST | /api/reports/export/ | Export to file |
| getSalesReport | GET | /api/reports/sales/ | Sales analytics |
| getInventoryReport | GET | /api/reports/inventory/ | Inventory analytics |
| getCustomerReport | GET | /api/reports/customers/ | Customer analytics |
| getDashboardMetrics | GET | /api/reports/dashboard/ | Dashboard data |
| getProfitLossReport | GET | /api/reports/profit-loss/ | P&L statement |
| getTopSellingProducts | GET | /api/reports/top-products/ | Best sellers |

### Expected Outcome
- Comprehensive reporting service
- Multiple report types
- Export capabilities
- Dashboard metrics

### Verification Checklist
- [ ] `reports.service.ts` file created
- [ ] All functions implemented
- [ ] Export function added
- [ ] Dashboard function included
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 78: Create Settings Service

### Overview
Create a settings service for managing tenant-specific configurations, system preferences, and application settings. The service provides CRUD operations for various configuration categories.

### Dependencies
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create settings service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `settings.service.ts`
   - Import API utilities

2. **Import required dependencies**
   - Import APIResponse
   - Import apiClient

3. **Define SettingCategory enum**
   - Include: GENERAL, SALES, INVENTORY, HR, ACCOUNTING, NOTIFICATIONS, INTEGRATIONS
   - Categorizes settings

4. **Define Setting interface**
   - Include: key, value, category, dataType
   - Include: label, description, isPublic
   - Include: updatedBy, updatedAt

5. **Define TenantSettings interface**
   - Represents tenant configuration
   - Include: tenantId, companyName, timezone, currency
   - Include: dateFormat, timeFormat, language
   - Include: logo, address, contactInfo
   - Include: taxSettings, receiptSettings
   - Include: features (enabled modules)

6. **Define API endpoint constants**
   - Create constant: `SETTINGS_ENDPOINT = '/api/settings/'`

7. **Create getTenantSettings function**
   - Signature: `() => Promise<APIResponse<TenantSettings>>`
   - Makes GET request to `/api/settings/tenant/`
   - Returns current tenant configuration

8. **Create updateTenantSettings function**
   - Signature: `(data: Partial<TenantSettings>) => Promise<APIResponse<TenantSettings>>`
   - Accepts settings updates
   - Makes PATCH request to `/api/settings/tenant/`
   - Returns updated configuration

9. **Create getSettingsByCategory function**
   - Signature: `(category: SettingCategory) => Promise<APIResponse<Setting[]>>`
   - Accepts setting category
   - Makes GET request to `/api/settings/category/{category}/`
   - Returns category settings

10. **Create getSetting function**
    - Signature: `(key: string) => Promise<APIResponse<Setting>>`
    - Accepts setting key
    - Makes GET request to `/api/settings/{key}/`
    - Returns single setting

11. **Create updateSetting function**
    - Signature: `(key: string, value: any) => Promise<APIResponse<Setting>>`
    - Accepts setting key and new value
    - Makes PATCH request to `/api/settings/{key}/`
    - Returns updated setting

12. **Create getFeatureFlags function**
    - Signature: `() => Promise<APIResponse<Record<string, boolean>>>`
    - Makes GET request to `/api/settings/features/`
    - Returns enabled features/modules
    - Used for feature toggles

13. **Create updateFeatureFlag function**
    - Signature: `(feature: string, enabled: boolean) => Promise<APIResponse<void>>`
    - Accepts feature name and state
    - Makes PATCH request to `/api/settings/features/{feature}/`
    - Enables or disables feature

14. **Create uploadLogo function**
    - Signature: `(file: File) => Promise<APIResponse<{ url: string }>>`
    - Accepts logo file
    - Creates FormData with file
    - Makes POST request to `/api/settings/logo/`
    - Returns uploaded logo URL

15. **Create getTaxRates function**
    - Signature: `() => Promise<APIResponse<{ name: string; rate: number; isDefault: boolean }[]>>`
    - Makes GET request to `/api/settings/tax-rates/`
    - Returns configured tax rates

16. **Create updateTaxRates function**
    - Signature: `(rates: { name: string; rate: number; isDefault: boolean }[]) => Promise<APIResponse<void>>`
    - Accepts tax rate configurations
    - Makes PUT request to `/api/settings/tax-rates/`
    - Updates tax configuration

17. **Create export default settingsService object**
    - Bundle all functions in service object

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getTenantSettings | GET | /api/settings/tenant/ | Get tenant config |
| updateTenantSettings | PATCH | /api/settings/tenant/ | Update config |
| getSettingsByCategory | GET | /api/settings/category/{category}/ | Category settings |
| getSetting | GET | /api/settings/{key}/ | Single setting |
| updateSetting | PATCH | /api/settings/{key}/ | Update setting |
| getFeatureFlags | GET | /api/settings/features/ | Enabled features |
| updateFeatureFlag | PATCH | /api/settings/features/{feature}/ | Toggle feature |
| uploadLogo | POST | /api/settings/logo/ | Upload logo |
| getTaxRates | GET | /api/settings/tax-rates/ | Tax configuration |
| updateTaxRates | PUT | /api/settings/tax-rates/ | Update taxes |

### Settings Categories

| Category | Settings |
|----------|----------|
| GENERAL | Company info, timezone, language, currency |
| SALES | Tax rates, receipt format, order defaults |
| INVENTORY | Stock tracking, valuation method, alerts |
| HR | Working hours, leave policies, payroll schedule |
| ACCOUNTING | Fiscal year, accounting method |
| NOTIFICATIONS | Email alerts, SMS notifications |
| INTEGRATIONS | API keys, third-party services |

### Expected Outcome
- Complete settings management service
- Tenant configuration
- Category-based settings
- Feature flag management
- Tax configuration

### Verification Checklist
- [ ] `settings.service.ts` file created
- [ ] All functions implemented
- [ ] Feature flag functions added
- [ ] Logo upload function included
- [ ] Service exported
- [ ] No TypeScript errors

---

## Summary

This document covered the creation of types and services for Sales, HR, Reports, and Settings modules. These services complete the API client layer for the ERP system, providing comprehensive functionality across all major modules.

### Completed Tasks
- Task 69: Sales Types ✓
- Task 70: Sales Service ✓
- Task 71: Invoice Service ✓
- Task 72: HR Types ✓
- Task 73: Employee Service ✓
- Task 74: Attendance Service ✓
- Task 75: Payroll Service ✓
- Task 76: Reports Types ✓
- Task 77: Reports Service ✓
- Task 78: Settings Service ✓

### All Group E Tasks Completed
The API Client Layer Module Services (Group E) is now complete with:
- Product, Inventory, Customer, and Vendor services (Tasks 59-68)
- Sales, HR, Reports, and Settings services (Tasks 69-78)
- Full type safety across all operations
- Comprehensive CRUD capabilities
- Business logic integration

### Integration Points
These services integrate with:
- API Client infrastructure (Group A-D)
- Authentication system (Group B)
- Error handling (Group D)
- Base types and interceptors

### Next Steps
Proceed to Group F for API Utilities and Documentation to finalize the API Client Layer.
