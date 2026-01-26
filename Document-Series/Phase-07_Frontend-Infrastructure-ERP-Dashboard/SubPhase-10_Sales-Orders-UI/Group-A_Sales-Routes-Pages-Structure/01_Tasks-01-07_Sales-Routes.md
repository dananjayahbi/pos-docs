# Tasks 01-07: Sales Routes & Pages Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 10 - Sales & Orders UI  
> **Group:** A - Sales Routes & Pages Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Quotes-Loading-Verify.md](02_Tasks-08-14_Quotes-Loading-Verify.md)

---

## Document Overview

This document covers the creation of the sales module route structure, including orders, invoices, and the beginning of quotes. It establishes the foundational directory structure for all sales-related pages and implements the orders layout with tabs, order listing, order details, new order creation, invoice listing, and invoice details routes.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Sales Route Directories | Low | 20 min |
| 02 | Create Orders Layout | Low | 30 min |
| 03 | Create Orders List Page Route | Low | 25 min |
| 04 | Create Order Details Page Route | Low | 25 min |
| 05 | Create New Order Page Route | Low | 25 min |
| 06 | Create Invoices List Page Route | Low | 25 min |
| 07 | Create Invoice Details Page Route | Low | 25 min |

---

## Task 01: Create Sales Route Directories

### Overview
Create the directory structure for the sales management module within the dashboard route group. This establishes three main directories: orders/, invoices/, and quotes/, each containing the necessary subdirectories for list pages, detail pages, and creation pages where applicable.

### Dependencies
- SubPhase-07 (Dashboard Layout & Navigation) must be complete
- Next.js App Router structure is established
- Dashboard route group exists at `app/(dashboard)/`

### Instructions

1. **Navigate to the dashboard directory**
   - Go to `frontend/app/(dashboard)/` directory
   - This is where all dashboard modules are organized
   - Confirm the directory exists from previous SubPhases

2. **Create the orders directory structure**
   - Create `orders/` directory for order management
   - Inside `orders/`, create `new/` subdirectory for new order creation
   - Inside `orders/`, create `[id]/` subdirectory for dynamic order details
   - The `[id]` notation creates a dynamic route parameter

3. **Create the invoices directory structure**
   - Create `invoices/` directory for invoice management
   - Inside `invoices/`, create `[id]/` subdirectory for dynamic invoice details
   - Invoices are typically view-only, so no "new" subdirectory needed

4. **Create the quotes directory structure**
   - Create `quotes/` directory for quote management
   - Inside `quotes/`, create `new/` subdirectory for new quote creation
   - Inside `quotes/`, create `[id]/` subdirectory for dynamic quote details

5. **Verify directory structure**
   - Confirm all three main directories exist
   - Confirm all subdirectories are properly named
   - Ensure dynamic route folders use square brackets correctly

### Directory Structure
```
frontend/app/(dashboard)/
├── orders/
│   ├── new/              # New order creation
│   └── [id]/             # Order details (dynamic)
├── invoices/
│   └── [id]/             # Invoice details (dynamic)
└── quotes/
    ├── new/              # New quote creation
    └── [id]/             # Quote details (dynamic)
```

### URL Mapping

| Directory | Example URL | Purpose |
|-----------|-------------|---------|
| `orders/` | `/orders` | Order listing page |
| `orders/new/` | `/orders/new` | Create new order |
| `orders/[id]/` | `/orders/ORD-001` | View order details |
| `invoices/` | `/invoices` | Invoice listing page |
| `invoices/[id]/` | `/invoices/INV-001` | View invoice details |
| `quotes/` | `/quotes` | Quote listing page |
| `quotes/new/` | `/quotes/new` | Create new quote |
| `quotes/[id]/` | `/quotes/QUO-001` | View quote details |

### Route Type Explanation

| Route Type | Example | Description |
|------------|---------|-------------|
| Static | `orders/` | Fixed path, no parameters |
| Nested Static | `orders/new/` | Fixed nested path |
| Dynamic | `orders/[id]/` | Variable parameter in URL |

### Sales Module Organization

```
Sales Module
├── Orders
│   ├── List all orders
│   ├── Create new order
│   └── View order details
├── Invoices
│   ├── List all invoices
│   └── View invoice details
└── Quotes
    ├── List all quotes
    ├── Create new quote
    └── View quote details
```

### Expected Outcome
- Complete directory structure for sales module
- Dynamic route folders properly configured
- Foundation for all sales-related pages
- Organized structure following Next.js conventions

### Verification Checklist
- [ ] `frontend/app/(dashboard)/orders/` directory exists
- [ ] `frontend/app/(dashboard)/orders/new/` directory exists
- [ ] `frontend/app/(dashboard)/orders/[id]/` directory exists with square brackets
- [ ] `frontend/app/(dashboard)/invoices/` directory exists
- [ ] `frontend/app/(dashboard)/invoices/[id]/` directory exists with square brackets
- [ ] `frontend/app/(dashboard)/quotes/` directory exists
- [ ] `frontend/app/(dashboard)/quotes/new/` directory exists
- [ ] `frontend/app/(dashboard)/quotes/[id]/` directory exists with square brackets

---

## Task 02: Create Orders Layout

### Overview
Create a specialized layout component for the orders section that includes a tab navigation system. This layout wraps all order-related pages and provides quick navigation between different order status views (All, Pending, Processing, Shipped). The tabs use query parameters to filter orders without changing the base URL.

### Dependencies
- Task 01: Create Sales Route Directories

### Instructions

1. **Create layout.tsx file in orders directory**
   - Navigate to `frontend/app/(dashboard)/orders/` directory
   - Create new file named `layout.tsx`
   - This layout wraps all pages within the orders directory

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import navigation hooks (usePathname, useSearchParams)
   - Import Link component from Next.js
   - Import any UI components (Tabs, TabsList, TabsTrigger from shadcn/ui)

3. **Define layout metadata**
   - Export metadata object with page title
   - Set title to "Orders | LankaCommerce Cloud"
   - Configure description for SEO

4. **Create layout component structure**
   - Define default export function `OrdersLayout`
   - Accept `children` prop of type `ReactNode`
   - Return JSX structure with header and tabs

5. **Implement tab navigation**
   - Create tabs for: All Orders, Pending, Processing, Shipped
   - Use query parameters for filtering (e.g., ?status=pending)
   - Highlight active tab based on current query parameters
   - Link each tab to appropriate URL with query string

6. **Add page header**
   - Include page title "Orders"
   - Add action buttons (e.g., "New Order" button linking to /orders/new)
   - Position header above tab navigation

7. **Structure content area**
   - Place tab navigation below header
   - Render children below tabs
   - Ensure proper spacing and layout

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Orders                         [+ New Order]       │ ← Header
├─────────────────────────────────────────────────────┤
│  [All Orders] [Pending] [Processing] [Shipped]     │ ← Tabs
├─────────────────────────────────────────────────────┤
│                                                     │
│                  {children}                         │ ← Page Content
│              (Orders List Page)                     │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Tab Configuration

| Tab Label | Query Parameter | URL Example | Description |
|-----------|----------------|-------------|-------------|
| All Orders | (none) | `/orders` | Show all orders |
| Pending | `status=pending` | `/orders?status=pending` | Orders awaiting processing |
| Processing | `status=processing` | `/orders?status=processing` | Orders being prepared |
| Shipped | `status=shipped` | `/orders?status=shipped` | Orders dispatched |

### Tab Navigation Behavior

| User Action | URL Change | Result |
|-------------|------------|--------|
| Click "All Orders" | → `/orders` | Show all orders |
| Click "Pending" | → `/orders?status=pending` | Filter to pending only |
| Click "Processing" | → `/orders?status=processing` | Filter to processing only |
| Click "Shipped" | → `/orders?status=shipped` | Filter to shipped only |
| Click "New Order" | → `/orders/new` | Navigate to creation form |

### Header Actions

| Action | Type | Location | Target |
|--------|------|----------|--------|
| New Order | Button | Top-right | `/orders/new` |

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Page content to render below tabs |

### Layout Hierarchy

```
OrdersLayout
├── Container
│   ├── Header Section
│   │   ├── Title: "Orders"
│   │   └── Actions: "New Order" button
│   ├── Tab Navigation
│   │   ├── All Orders tab
│   │   ├── Pending tab
│   │   ├── Processing tab
│   │   └── Shipped tab
│   └── Content Section
│       └── {children} (page.tsx content)
```

### Expected Outcome
- Functional orders layout with tab navigation
- Tab-based filtering using query parameters
- Header with page title and action button
- Proper TypeScript typing for props
- Ready to receive page content as children

### Verification Checklist
- [ ] `frontend/app/(dashboard)/orders/layout.tsx` file created
- [ ] Layout component exports properly
- [ ] Accepts children prop correctly
- [ ] Four tabs defined (All, Pending, Processing, Shipped)
- [ ] Tabs use query parameters for filtering
- [ ] Header includes "Orders" title
- [ ] "New Order" button links to `/orders/new`
- [ ] Active tab highlights based on current query parameter
- [ ] Metadata configured for SEO

---

## Task 03: Create Orders List Page Route

### Overview
Create the main orders listing page that displays a table or grid of all orders with filtering, sorting, and pagination capabilities. This page responds to query parameters from the tabs in the orders layout to filter orders by status. It serves as the landing page for the orders section at `/orders`.

### Dependencies
- Task 01: Create Sales Route Directories
- Task 02: Create Orders Layout

### Instructions

1. **Create page.tsx file in orders directory**
   - Navigate to `frontend/app/(dashboard)/orders/` directory
   - Create new file named `page.tsx`
   - This is the default page for the `/orders` route

2. **Set up page component structure**
   - Define default export function `OrdersPage`
   - Make it an async server component (for data fetching)
   - Accept searchParams prop for query parameter access

3. **Import required dependencies**
   - Import data fetching utilities (API client)
   - Import UI components (Table, Pagination, Badge, etc.)
   - Import type definitions (Order, OrderStatus)
   - Import date formatting utilities

4. **Extract query parameters**
   - Access status filter from searchParams
   - Access pagination parameters (page, limit)
   - Access sorting parameters (sortBy, order)
   - Provide default values for missing parameters

5. **Fetch orders data**
   - Call backend API to fetch orders list
   - Pass filters, pagination, and sorting parameters
   - Handle loading and error states appropriately
   - Use server-side data fetching for SEO

6. **Create orders table structure**
   - Define columns: Order ID, Customer, Date, Total, Status, Actions
   - Display order data in rows
   - Add sorting controls to column headers
   - Make rows clickable to navigate to order details

7. **Implement status badge display**
   - Create colored badges for order statuses
   - Use consistent color scheme (pending: yellow, processing: blue, shipped: green, etc.)
   - Display status prominently in table

8. **Add action buttons**
   - Include "View" button/link for each order
   - Include "Edit" option if applicable
   - Include "Cancel" option for pending orders
   - Link actions to appropriate routes

9. **Implement pagination**
   - Display pagination controls at bottom
   - Show current page and total pages
   - Update URL with page parameter on navigation
   - Maintain other query parameters when paginating

10. **Add empty state**
    - Display friendly message when no orders found
    - Provide "Create Order" button in empty state
    - Consider different messages for filtered vs. unfiltered views

### Page Structure

```
┌─────────────────────────────────────────────────────┐
│  Orders Table                                       │
│  ┌─────┬─────────┬────────┬────────┬────────┬────┐ │
│  │ ID  │ Customer│ Date   │ Total  │ Status │ ⚙  │ │
│  ├─────┼─────────┼────────┼────────┼────────┼────┤ │
│  │ 001 │ John Doe│ Jan 15 │ $250   │ 🟢 Ship│ 👁 │ │
│  │ 002 │ Jane Sm │ Jan 14 │ $180   │ 🟡 Pend│ 👁 │ │
│  │ 003 │ Bob Will│ Jan 14 │ $320   │ 🔵 Proc│ 👁 │ │
│  └─────┴─────────┴────────┴────────┴────────┴────┘ │
│                                                     │
│  ← Previous  Page 1 of 10  Next →                  │
└─────────────────────────────────────────────────────┘
```

### Table Columns

| Column | Width | Content | Sortable | Description |
|--------|-------|---------|----------|-------------|
| Order ID | 10% | ORD-001 | Yes | Unique order identifier |
| Customer | 20% | Name | Yes | Customer name |
| Order Date | 15% | Jan 15, 2026 | Yes | Date order was placed |
| Total Amount | 15% | $250.00 | Yes | Order total |
| Status | 15% | Badge | Yes | Current order status |
| Actions | 10% | Icons | No | View/Edit/Cancel |

### Order Status Colors

| Status | Badge Color | Text Color | Meaning |
|--------|-------------|------------|---------|
| Pending | Yellow (bg-yellow-100) | text-yellow-800 | Awaiting processing |
| Processing | Blue (bg-blue-100) | text-blue-800 | Being prepared |
| Shipped | Green (bg-green-100) | text-green-800 | Dispatched to customer |
| Delivered | Emerald (bg-emerald-100) | text-emerald-800 | Received by customer |
| Cancelled | Red (bg-red-100) | text-red-800 | Order cancelled |

### Query Parameter Handling

| Parameter | Values | Default | Purpose |
|-----------|--------|---------|---------|
| status | pending, processing, shipped, delivered, cancelled | (all) | Filter by status |
| page | 1, 2, 3... | 1 | Pagination |
| limit | 10, 25, 50, 100 | 25 | Items per page |
| sortBy | id, customer, date, total, status | date | Sort column |
| order | asc, desc | desc | Sort direction |

### Action Buttons

| Action | Icon | Behavior | Availability |
|--------|------|----------|--------------|
| View | Eye | Navigate to `/orders/[id]` | All orders |
| Edit | Pencil | Navigate to `/orders/[id]/edit` | Pending/Processing only |
| Cancel | X | Show confirmation, cancel order | Pending/Processing only |

### Empty State Scenarios

| Scenario | Message | Action |
|----------|---------|--------|
| No orders at all | "No orders yet. Create your first order!" | [+ Create Order] button |
| No matching filter | "No orders found with status: Pending" | Link to clear filter |
| Search returned nothing | "No orders match your search criteria" | Clear search button |

### Data Flow

```
User visits /orders?status=pending
    │
    ▼
Page component receives searchParams
    │
    ▼
Extract status = "pending"
    │
    ▼
Call API: GET /api/orders?status=pending
    │
    ▼
Receive orders data
    │
    ▼
Render table with filtered orders
    │
    ▼
Display "Pending" badge for all rows
```

### Expected Outcome
- Functional orders listing page at `/orders`
- Table displaying order data with all columns
- Status filtering based on query parameters
- Pagination controls working correctly
- Clickable rows navigate to order details
- Empty state displays when no orders found

### Verification Checklist
- [ ] `frontend/app/(dashboard)/orders/page.tsx` file created
- [ ] Page component exports as default
- [ ] Accepts searchParams prop correctly
- [ ] Fetches orders from backend API
- [ ] Displays orders in table format
- [ ] Shows all required columns (ID, Customer, Date, Total, Status, Actions)
- [ ] Status badges display with correct colors
- [ ] Responds to status filter from query parameters
- [ ] Pagination works and updates URL
- [ ] Rows clickable and navigate to order details
- [ ] Empty state displays when no orders
- [ ] Action buttons link to correct routes

---

## Task 04: Create Order Details Page Route

### Overview
Create the dynamic order details page that displays comprehensive information about a specific order. This page uses the `[id]` dynamic route parameter to fetch and display order data, including customer information, order items, pricing breakdown, shipping details, payment information, and order status timeline.

### Dependencies
- Task 01: Create Sales Route Directories

### Instructions

1. **Create page.tsx file in [id] directory**
   - Navigate to `frontend/app/(dashboard)/orders/[id]/` directory
   - Create new file named `page.tsx`
   - This creates a dynamic route accessible at `/orders/{orderId}`

2. **Set up dynamic page component**
   - Define default export function `OrderDetailPage`
   - Make it an async server component
   - Accept params prop containing the dynamic `id` parameter

3. **Import required dependencies**
   - Import data fetching utilities (API client)
   - Import UI components (Card, Badge, Table, Button, etc.)
   - Import type definitions (Order, OrderItem, Customer, etc.)
   - Import date and currency formatting utilities

4. **Extract order ID from params**
   - Access `id` from params prop
   - Validate ID format if necessary
   - Use ID for API calls

5. **Fetch order data**
   - Call backend API with order ID
   - Fetch complete order details including related data
   - Handle 404 if order not found
   - Handle other error states

6. **Create page header section**
   - Display order ID prominently
   - Show current order status with badge
   - Include action buttons (Edit, Cancel, Print, etc.)
   - Display order date and time

7. **Create customer information section**
   - Display customer name and contact details
   - Show billing address
   - Show shipping address
   - Include customer ID or account link

8. **Create order items section**
   - Display items table with columns: Product, SKU, Quantity, Unit Price, Total
   - Calculate and display subtotal
   - Show tax amount
   - Show shipping cost
   - Display grand total prominently

9. **Create order timeline section**
   - Show order status history
   - Display timestamps for each status change
   - Include user who made each change
   - Visual timeline with icons

10. **Create payment information section**
    - Display payment method
    - Show payment status (Paid, Pending, Failed)
    - Include transaction ID if applicable
    - Show payment date

11. **Create shipping information section**
    - Display shipping method
    - Show tracking number if available
    - Include carrier information
    - Display estimated delivery date

12. **Add action buttons**
    - Edit Order (if status allows)
    - Cancel Order (if status allows)
    - Generate Invoice button
    - Print Order button
    - Contact Customer button

### Page Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Order #ORD-001     [Edit] [Cancel] [Print]        │ ← Header
│  Status: 🔵 Processing                              │
│  Date: Jan 15, 2026, 10:30 AM                      │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐        │
│  │  Customer Info   │  │  Shipping Info   │        │
│  │  John Doe        │  │  Express         │        │
│  │  john@email.com  │  │  Track: TRK123   │        │
│  └──────────────────┘  └──────────────────┘        │
├─────────────────────────────────────────────────────┤
│  Order Items                                        │
│  ┌──────────┬─────┬────┬────────┬────────┐         │
│  │ Product  │ SKU │ Qty│ Price  │ Total  │         │
│  ├──────────┼─────┼────┼────────┼────────┤         │
│  │ Widget A │ W001│  2 │ $50.00 │ $100.00│         │
│  │ Widget B │ W002│  1 │ $75.00 │  $75.00│         │
│  └──────────┴─────┴────┴────────┴────────┘         │
│                          Subtotal: $175.00          │
│                          Tax:       $17.50          │
│                          Shipping:  $10.00          │
│                          Total:    $202.50          │
├─────────────────────────────────────────────────────┤
│  Order Timeline                                     │
│  ● Order Placed      Jan 15, 10:30 AM               │
│  ● Payment Received  Jan 15, 10:35 AM               │
│  ● Processing        Jan 15, 11:00 AM               │
│  ○ Shipped           (Pending)                      │
└─────────────────────────────────────────────────────┘
```

### Page Sections

| Section | Priority | Content |
|---------|----------|---------|
| Header | High | Order ID, Status, Date, Action buttons |
| Customer Info | High | Name, Email, Phone, Addresses |
| Order Items | Critical | Products table with pricing |
| Order Summary | Critical | Subtotal, Tax, Shipping, Total |
| Timeline | Medium | Status history with timestamps |
| Payment Info | High | Method, Status, Transaction ID |
| Shipping Info | High | Method, Tracking, Delivery date |

### Order Items Table

| Column | Width | Content | Description |
|--------|-------|---------|-------------|
| Product | 35% | Name & Image | Product name with thumbnail |
| SKU | 15% | Code | Product SKU |
| Quantity | 10% | Number | Items ordered |
| Unit Price | 20% | Currency | Price per item |
| Total | 20% | Currency | Qty × Price |

### Order Status Timeline Events

| Event | Icon | Description |
|-------|------|-------------|
| Order Placed | 🛒 | Customer submitted order |
| Payment Received | 💳 | Payment processed successfully |
| Processing | 🔄 | Order being prepared |
| Shipped | 📦 | Order dispatched to customer |
| Delivered | ✅ | Customer received order |
| Cancelled | ❌ | Order cancelled |

### Action Buttons Availability

| Button | Pending | Processing | Shipped | Delivered | Cancelled |
|--------|---------|------------|---------|-----------|-----------|
| Edit | ✅ | ✅ | ❌ | ❌ | ❌ |
| Cancel | ✅ | ✅ | ❌ | ❌ | ❌ |
| Generate Invoice | ✅ | ✅ | ✅ | ✅ | ❌ |
| Print | ✅ | ✅ | ✅ | ✅ | ✅ |
| Contact Customer | ✅ | ✅ | ✅ | ✅ | ✅ |

### Price Breakdown Structure

```
Order Items Total:        $175.00
    ├── Widget A (×2)      $100.00
    └── Widget B (×1)       $75.00
Tax (10%):                 $17.50
Shipping:                  $10.00
Discount:                  -$5.00
─────────────────────────────────
Grand Total:              $197.50
```

### Data Requirements

| Data Type | Source API | Required Fields |
|-----------|------------|-----------------|
| Order | GET /api/orders/{id} | id, status, date, customer_id, total |
| Customer | Included in order | name, email, phone, addresses |
| Items | Included in order | product_name, sku, qty, price |
| Timeline | Included in order | events with timestamps |
| Payment | Included in order | method, status, transaction_id |
| Shipping | Included in order | method, tracking, carrier |

### Error Handling

| Error | Status | Action |
|-------|--------|--------|
| Order not found | 404 | Display "Order not found" message with back link |
| Unauthorized | 403 | Redirect to login or show error |
| Server error | 500 | Display error message with retry option |

### Expected Outcome
- Functional order details page at `/orders/{orderId}`
- All order information displayed in organized sections
- Order items table with complete pricing breakdown
- Order timeline showing status history
- Action buttons working and contextually available
- Proper error handling for invalid order IDs

### Verification Checklist
- [ ] `frontend/app/(dashboard)/orders/[id]/page.tsx` file created
- [ ] Page component exports as default
- [ ] Accepts params prop with id correctly
- [ ] Fetches order data using dynamic ID
- [ ] Displays order header with ID and status
- [ ] Customer information section complete
- [ ] Order items table displays correctly
- [ ] Price breakdown accurate (subtotal, tax, shipping, total)
- [ ] Order timeline shows status history
- [ ] Payment information displayed
- [ ] Shipping information displayed
- [ ] Action buttons available and contextual to status
- [ ] 404 handling for invalid order IDs
- [ ] All data formatted correctly (dates, currency)

---

## Task 05: Create New Order Page Route

### Overview
Create the new order creation page with a comprehensive form for entering order details. This page allows users to manually create orders by selecting customers, adding products, specifying quantities, applying discounts, selecting shipping methods, and configuring payment options. The form includes validation and calculation of totals in real-time.

### Dependencies
- Task 01: Create Sales Route Directories

### Instructions

1. **Create page.tsx file in new directory**
   - Navigate to `frontend/app/(dashboard)/orders/new/` directory
   - Create new file named `page.tsx`
   - This creates the route accessible at `/orders/new`

2. **Set up page component structure**
   - Define default export function `NewOrderPage`
   - Use client component (add 'use client' directive)
   - Initialize form state management (React Hook Form or similar)

3. **Import required dependencies**
   - Import form components (Input, Select, Button, etc.)
   - Import validation utilities (Zod schema)
   - Import type definitions (CreateOrderDTO, Product, Customer)
   - Import calculation utilities for totals
   - Import API client for data submission

4. **Create page header**
   - Display "New Order" title
   - Include breadcrumb navigation (Orders > New Order)
   - Add Cancel and Save Draft buttons

5. **Create customer selection section**
   - Add searchable customer dropdown
   - Include option to create new customer inline
   - Display selected customer details
   - Pre-fill shipping address from customer data

6. **Create product selection section**
   - Add product search/autocomplete input
   - Display selected products in a table
   - Include columns: Product, SKU, Price, Quantity, Discount, Total
   - Allow removing products from order
   - Show real-time subtotal calculation

7. **Create pricing and calculations section**
   - Display calculated subtotal
   - Add tax rate selector or input
   - Calculate and display tax amount
   - Add shipping cost input
   - Add discount input (percentage or fixed amount)
   - Display grand total prominently

8. **Create shipping details section**
   - Add shipping address form fields
   - Include shipping method selector (Standard, Express, etc.)
   - Add estimated delivery date display
   - Include special instructions text area

9. **Create payment details section**
   - Add payment method selector (Credit Card, Cash, etc.)
   - Include payment status selector (Paid, Pending, COD)
   - Add payment notes field

10. **Implement form validation**
    - Validate required fields (customer, at least one product)
    - Validate quantity values (positive integers)
    - Validate price and discount formats
    - Show inline error messages

11. **Implement calculation logic**
    - Calculate line item totals (price × quantity - discount)
    - Calculate subtotal (sum of line items)
    - Calculate tax (subtotal × tax rate)
    - Calculate grand total (subtotal + tax + shipping - discounts)
    - Update totals in real-time as values change

12. **Add form actions**
    - Create "Save Draft" button (saves without finalizing)
    - Create "Create Order" button (finalizes and submits)
    - Create "Cancel" button (returns to orders list)
    - Show loading state during submission
    - Handle success (redirect to order details)
    - Handle errors (display error messages)

### Form Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  New Order                     [Cancel] [Save]      │ ← Header
├─────────────────────────────────────────────────────┤
│  Customer                                           │
│  ┌─────────────────────────────────────────────┐   │
│  │ 🔍 Search customer...                        │   │
│  └─────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────┤
│  Products                            [+ Add Product]│
│  ┌──────────┬──────┬─────┬────┬────────┬────────┐  │
│  │ Product  │ SKU  │Price│ Qty│Discount│ Total  │  │
│  ├──────────┼──────┼─────┼────┼────────┼────────┤  │
│  │ Widget A │ W001 │ $50 │ [2]│ [0]    │ $100   │  │
│  │ Widget B │ W002 │ $75 │ [1]│ [$5]   │  $70   │  │
│  └──────────┴──────┴─────┴────┴────────┴────────┘  │
│                               Subtotal: $170.00     │
├─────────────────────────────────────────────────────┤
│  Pricing                                            │
│  Tax Rate: [10%]          Tax Amount: $17.00       │
│  Shipping: [$10.00]       Discount: [$0.00]        │
│                          Grand Total: $197.00       │
├─────────────────────────────────────────────────────┤
│  Shipping Details                                   │
│  Address: [________________]  Method: [Express ▼]  │
│  Special Instructions: [__________________________] │
├─────────────────────────────────────────────────────┤
│  Payment                                            │
│  Method: [Credit Card ▼]  Status: [Paid ▼]         │
│                                                     │
│                       [Cancel] [Create Order]      │
└─────────────────────────────────────────────────────┘
```

### Form Sections

| Section | Priority | Fields | Validation |
|---------|----------|--------|------------|
| Customer | Required | Customer selector | Must select customer |
| Products | Required | Product list, quantities | At least 1 product |
| Pricing | Auto-calculated | Subtotal, tax, shipping, total | Valid numbers |
| Shipping | Required | Address, method | Complete address |
| Payment | Required | Method, status | Must select method |

### Product Line Item Fields

| Field | Type | Required | Validation | Description |
|-------|------|----------|------------|-------------|
| Product | Search/Select | Yes | Must exist | Product to order |
| SKU | Display only | - | - | Auto-filled from product |
| Price | Number | Yes | > 0 | Unit price (editable) |
| Quantity | Number | Yes | > 0, integer | Items to order |
| Discount | Number | No | >= 0 | Discount per item |
| Total | Calculated | - | - | (Price - Discount) × Qty |

### Calculation Formulas

```
Line Item Total = (Unit Price - Item Discount) × Quantity

Subtotal = Sum of all Line Item Totals

Tax Amount = Subtotal × (Tax Rate / 100)

Grand Total = Subtotal + Tax Amount + Shipping Cost - Order Discount
```

### Shipping Methods

| Method | Delivery Time | Cost Calculation |
|--------|---------------|------------------|
| Standard | 5-7 days | Fixed rate or weight-based |
| Express | 2-3 days | Fixed rate (higher) |
| Overnight | 1 day | Fixed rate (highest) |
| Free Shipping | 7-10 days | $0 (over threshold) |

### Payment Methods

| Method | Status Options | Notes |
|--------|----------------|-------|
| Credit Card | Paid, Pending, Failed | Requires transaction ID |
| Debit Card | Paid, Pending, Failed | Requires transaction ID |
| Cash | Paid | Manual entry |
| Cash on Delivery | Pending | Paid on delivery |
| Bank Transfer | Pending, Paid | Requires reference |
| Store Credit | Paid | Auto-deducted |

### Form Validation Rules

| Field | Rule | Error Message |
|-------|------|---------------|
| Customer | Required | "Please select a customer" |
| Products | Min 1 item | "Add at least one product" |
| Quantity | Integer > 0 | "Quantity must be at least 1" |
| Price | Number >= 0 | "Price must be valid" |
| Shipping Address | All fields | "Complete shipping address required" |
| Payment Method | Required | "Select a payment method" |

### Form Actions

| Button | Behavior | Validation | Outcome |
|--------|----------|------------|---------|
| Create Order | Submit form | Full validation | Create order, redirect to details |
| Save Draft | Save incomplete | Minimal validation | Save draft, stay on page or redirect |
| Cancel | Discard changes | None | Show confirmation, redirect to list |
| Add Product | Add row | None | Add new product row to table |
| Remove Product | Remove row | None | Remove product from order |

### Real-Time Calculations

| Trigger | Recalculate |
|---------|-------------|
| Quantity changed | Line total, Subtotal, Tax, Grand Total |
| Price changed | Line total, Subtotal, Tax, Grand Total |
| Item discount changed | Line total, Subtotal, Tax, Grand Total |
| Product added | Subtotal, Tax, Grand Total |
| Product removed | Subtotal, Tax, Grand Total |
| Tax rate changed | Tax amount, Grand Total |
| Shipping cost changed | Grand Total |
| Order discount changed | Grand Total |

### Error Handling

| Error Type | Display Location | Action |
|------------|------------------|--------|
| Field validation | Inline below field | Show red text |
| Form submission | Toast/Alert top | Show error message |
| API error | Top of form | Show error banner |
| Network error | Modal | Show retry option |

### Expected Outcome
- Functional new order creation page at `/orders/new`
- Complete form with all necessary sections
- Real-time calculation of totals
- Form validation working correctly
- Customer and product selection functional
- Successful submission creates order and redirects
- Draft saving capability working

### Verification Checklist
- [ ] `frontend/app/(dashboard)/orders/new/page.tsx` file created
- [ ] Page component exports as default
- [ ] 'use client' directive added for client component
- [ ] Customer selection field working
- [ ] Product search/selection functional
- [ ] Product table displays selected items
- [ ] Quantity inputs accept valid numbers
- [ ] Price calculations accurate
- [ ] Subtotal calculates correctly
- [ ] Tax calculation working
- [ ] Grand total calculates correctly
- [ ] Shipping address form complete
- [ ] Shipping method selector working
- [ ] Payment method selector working
- [ ] Form validation displays errors
- [ ] "Create Order" button submits form
- [ ] Successful submission redirects to order details
- [ ] "Cancel" button returns to orders list
- [ ] Loading state displays during submission

---

## Task 06: Create Invoices List Page Route

### Overview
Create the invoices listing page that displays a table of all generated invoices with filtering, sorting, and search capabilities. Unlike orders, invoices are typically generated from completed or shipped orders and are primarily view-only documents. This page provides quick access to invoice details and PDF generation.

### Dependencies
- Task 01: Create Sales Route Directories

### Instructions

1. **Create page.tsx file in invoices directory**
   - Navigate to `frontend/app/(dashboard)/invoices/` directory
   - Create new file named `page.tsx`
   - This is the default page for the `/invoices` route

2. **Set up page component structure**
   - Define default export function `InvoicesPage`
   - Make it an async server component (for data fetching)
   - Accept searchParams prop for query parameter access

3. **Import required dependencies**
   - Import data fetching utilities (API client)
   - Import UI components (Table, Badge, Button, etc.)
   - Import type definitions (Invoice, InvoiceStatus)
   - Import date and currency formatting utilities

4. **Extract query parameters**
   - Access search query from searchParams
   - Access pagination parameters (page, limit)
   - Access date range filters (from, to)
   - Access payment status filter
   - Provide default values for missing parameters

5. **Fetch invoices data**
   - Call backend API to fetch invoices list
   - Pass filters, pagination, and sorting parameters
   - Handle loading and error states appropriately
   - Use server-side data fetching for SEO

6. **Create page header**
   - Display "Invoices" title
   - Add search input for invoice number or customer
   - Include filter options (date range, payment status)
   - Add date range picker for filtering

7. **Create invoices table structure**
   - Define columns: Invoice #, Order #, Customer, Date, Amount, Payment Status, Actions
   - Display invoice data in rows
   - Add sorting controls to column headers
   - Make rows clickable to navigate to invoice details

8. **Implement payment status badges**
   - Create colored badges for payment statuses
   - Use consistent color scheme (paid: green, pending: yellow, overdue: red)
   - Display status prominently in table

9. **Add action buttons for each invoice**
   - Include "View" button to see invoice details
   - Include "Download PDF" button for direct download
   - Include "Send Email" button to email invoice
   - Add "Mark as Paid" button for pending invoices

10. **Implement search functionality**
    - Add search input in header
    - Search by invoice number, order number, or customer name
    - Update results as user types (debounced)
    - Display search results count

11. **Add filter controls**
    - Payment status filter (All, Paid, Pending, Overdue)
    - Date range filter (Today, This Week, This Month, Custom)
    - Customer filter (dropdown or autocomplete)
    - Clear filters button

12. **Implement pagination**
    - Display pagination controls at bottom
    - Show current page and total pages
    - Update URL with page parameter on navigation
    - Maintain other query parameters when paginating

13. **Add summary statistics**
    - Show total invoices count
    - Display total invoiced amount
    - Show total paid amount
    - Show total outstanding amount

14. **Add empty state**
    - Display friendly message when no invoices found
    - Provide helpful text for filtered views
    - Link back to orders if no invoices exist

### Page Structure

```
┌─────────────────────────────────────────────────────┐
│  Invoices                                           │
│  ┌────────────────┐  [Status ▼] [Date Range ▼]    │
│  │ 🔍 Search...   │                                 │
│  └────────────────┘                                 │
├─────────────────────────────────────────────────────┤
│  📊 Statistics                                      │
│  Total: 45 | Invoiced: $12,450 | Paid: $10,200     │
├─────────────────────────────────────────────────────┤
│  Invoices Table                                     │
│  ┌────────┬────────┬─────────┬────────┬────────┬──┐│
│  │Invoice#│Order # │Customer │ Date   │ Amount │💰││
│  ├────────┼────────┼─────────┼────────┼────────┼──┤│
│  │INV-001 │ORD-001 │John Doe │Jan 15  │ $250   │🟢││
│  │INV-002 │ORD-002 │Jane Sm  │Jan 14  │ $180   │🟡││
│  │INV-003 │ORD-005 │Bob Will │Jan 13  │ $320   │🔴││
│  └────────┴────────┴─────────┴────────┴────────┴──┘│
│                                                     │
│  ← Previous  Page 1 of 10  Next →                  │
└─────────────────────────────────────────────────────┘
```

### Table Columns

| Column | Width | Content | Sortable | Description |
|--------|-------|---------|----------|-------------|
| Invoice # | 12% | INV-001 | Yes | Unique invoice identifier |
| Order # | 12% | ORD-001 | Yes | Related order number |
| Customer | 20% | Name | Yes | Customer name |
| Invoice Date | 15% | Jan 15, 2026 | Yes | Date invoice was generated |
| Amount | 15% | $250.00 | Yes | Invoice total |
| Payment Status | 15% | Badge | Yes | Payment status |
| Actions | 11% | Buttons | No | View/Download/Email |

### Payment Status Colors

| Status | Badge Color | Text Color | Meaning |
|--------|-------------|------------|---------|
| Paid | Green (bg-green-100) | text-green-800 | Fully paid |
| Pending | Yellow (bg-yellow-100) | text-yellow-800 | Payment awaited |
| Overdue | Red (bg-red-100) | text-red-800 | Past due date |
| Partially Paid | Orange (bg-orange-100) | text-orange-800 | Partial payment received |
| Cancelled | Gray (bg-gray-100) | text-gray-800 | Invoice cancelled |

### Query Parameters

| Parameter | Values | Default | Purpose |
|-----------|--------|---------|---------|
| search | string | (empty) | Search term |
| status | paid, pending, overdue, partial, cancelled | (all) | Payment status filter |
| dateFrom | YYYY-MM-DD | 30 days ago | Start date |
| dateTo | YYYY-MM-DD | today | End date |
| page | 1, 2, 3... | 1 | Pagination |
| limit | 10, 25, 50, 100 | 25 | Items per page |
| sortBy | number, date, amount, status | date | Sort column |
| order | asc, desc | desc | Sort direction |

### Action Buttons

| Action | Icon | Behavior | Availability |
|--------|------|----------|--------------|
| View | 👁 | Navigate to `/invoices/[id]` | All invoices |
| Download PDF | 📄 | Download invoice PDF | All except cancelled |
| Send Email | 📧 | Send invoice to customer | All except cancelled |
| Mark as Paid | ✓ | Update status to paid | Pending/Overdue only |

### Filter Options

| Filter Type | Options | Behavior |
|-------------|---------|----------|
| Payment Status | All, Paid, Pending, Overdue, Partial | Filter by payment status |
| Date Range | Today, This Week, This Month, Custom | Filter by invoice date |
| Customer | Dropdown with search | Filter by specific customer |

### Summary Statistics

| Statistic | Calculation | Display |
|-----------|-------------|---------|
| Total Invoices | Count of all invoices | Number (e.g., "45") |
| Total Invoiced | Sum of all invoice amounts | Currency (e.g., "$12,450.00") |
| Total Paid | Sum of paid invoice amounts | Currency (e.g., "$10,200.00") |
| Outstanding | Invoiced - Paid | Currency (e.g., "$2,250.00") |

### Empty State Scenarios

| Scenario | Message | Action |
|----------|---------|--------|
| No invoices at all | "No invoices generated yet" | Link to orders page |
| No matching filter | "No invoices found matching your criteria" | Clear filters button |
| No search results | "No invoices match your search" | Clear search button |

### Search Behavior

```
User types in search box
    │
    ▼
Debounce 300ms
    │
    ▼
Call API with search term
    │
    ▼
Search in: Invoice #, Order #, Customer Name
    │
    ▼
Return matching invoices
    │
    ▼
Update table display
```

### Data Flow

```
User visits /invoices?status=pending
    │
    ▼
Page receives searchParams
    │
    ▼
Extract filters (status, date range, etc.)
    │
    ▼
Call API: GET /api/invoices?status=pending
    │
    ▼
Receive invoices data
    │
    ▼
Calculate summary statistics
    │
    ▼
Render table with filtered invoices
```

### Expected Outcome
- Functional invoices listing page at `/invoices`
- Table displaying invoice data with all columns
- Search functionality working
- Filter controls functional
- Payment status badges display correctly
- Summary statistics calculated and displayed
- Pagination working and updates URL
- Action buttons functional for each invoice
- Empty state displays appropriately

### Verification Checklist
- [ ] `frontend/app/(dashboard)/invoices/page.tsx` file created
- [ ] Page component exports as default
- [ ] Accepts searchParams prop correctly
- [ ] Fetches invoices from backend API
- [ ] Displays invoices in table format
- [ ] Shows all required columns
- [ ] Payment status badges display with correct colors
- [ ] Search input functional
- [ ] Filter controls working (status, date range)
- [ ] Summary statistics calculated correctly
- [ ] Pagination works and updates URL
- [ ] Rows clickable and navigate to invoice details
- [ ] Action buttons display correctly
- [ ] "Download PDF" triggers download
- [ ] "Send Email" opens email modal/action
- [ ] "Mark as Paid" updates invoice status
- [ ] Empty state displays when no invoices

---

## Task 07: Create Invoice Details Page Route

### Overview
Create the dynamic invoice details page that displays comprehensive information about a specific invoice. This page uses the `[id]` dynamic route parameter to fetch and display invoice data, including invoice header, customer billing and shipping information, itemized line items, payment details, and PDF generation capability. The page is designed for viewing and printing invoices.

### Dependencies
- Task 01: Create Sales Route Directories
- Task 06: Create Invoices List Page Route

### Instructions

1. **Create page.tsx file in [id] directory**
   - Navigate to `frontend/app/(dashboard)/invoices/[id]/` directory
   - Create new file named `page.tsx`
   - This creates a dynamic route accessible at `/invoices/{invoiceId}`

2. **Set up dynamic page component**
   - Define default export function `InvoiceDetailPage`
   - Make it an async server component
   - Accept params prop containing the dynamic `id` parameter

3. **Import required dependencies**
   - Import data fetching utilities (API client)
   - Import UI components (Card, Badge, Table, Button, etc.)
   - Import type definitions (Invoice, InvoiceItem, Customer, etc.)
   - Import date and currency formatting utilities
   - Import PDF generation utilities

4. **Extract invoice ID from params**
   - Access `id` from params prop
   - Validate ID format if necessary
   - Use ID for API calls

5. **Fetch invoice data**
   - Call backend API with invoice ID
   - Fetch complete invoice details including related order data
   - Handle 404 if invoice not found
   - Handle other error states

6. **Create invoice header section**
   - Display "INVOICE" title prominently
   - Show company logo and business information
   - Display invoice number and date
   - Show due date if applicable
   - Include action buttons (Download PDF, Print, Send Email, Mark as Paid)

7. **Create billing information section**
   - Display company/seller information (Bill From)
   - Display customer information (Bill To)
   - Show billing address
   - Show shipping address if different
   - Include customer contact details

8. **Create invoice items table**
   - Display items with columns: Description, SKU, Quantity, Unit Price, Total
   - Show all line items from the order
   - Format currency properly
   - Align numbers to the right

9. **Create pricing summary section**
   - Display subtotal
   - Show tax breakdown (if multiple rates, show each)
   - Show shipping cost
   - Display discounts if applicable
   - Show grand total prominently
   - Include amount paid and balance due

10. **Create payment information section**
    - Display payment status with badge
    - Show payment method
    - Display payment date if paid
    - Show transaction ID or reference
    - Include payment terms

11. **Create notes section**
    - Display invoice notes or terms
    - Show payment instructions
    - Include company policies
    - Add thank you message

12. **Add action buttons**
    - Download PDF button (generates and downloads PDF)
    - Print button (opens print dialog with print-optimized view)
    - Send Email button (opens modal to send invoice via email)
    - Mark as Paid button (for pending invoices only)
    - Back to Invoices button

13. **Implement print styles**
    - Create print-specific CSS
    - Hide action buttons when printing
    - Ensure proper page breaks
    - Optimize layout for A4/Letter paper

### Page Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  ┌──────────┐        INVOICE                        │ ← Header
│  │   LOGO   │        #INV-001                        │
│  └──────────┘        Jan 15, 2026                    │
│  [📄 PDF] [🖨 Print] [📧 Email] [✓ Mark Paid]       │
├─────────────────────────────────────────────────────┤
│  ┌──────────────────┐  ┌──────────────────┐         │
│  │  Bill From       │  │  Bill To         │         │
│  │  LCC Company     │  │  John Doe        │         │
│  │  123 Main St     │  │  john@email.com  │         │
│  │  Colombo         │  │  456 Oak Ave     │         │
│  └──────────────────┘  └──────────────────┘         │
├─────────────────────────────────────────────────────┤
│  Invoice Items                                      │
│  ┌───────────────┬──────┬─────┬──────┬──────────┐  │
│  │ Description   │ SKU  │ Qty │Price │  Total   │  │
│  ├───────────────┼──────┼─────┼──────┼──────────┤  │
│  │ Widget A      │ W001 │   2 │ $50  │  $100.00 │  │
│  │ Widget B      │ W002 │   1 │ $75  │   $75.00 │  │
│  └───────────────┴──────┴─────┴──────┴──────────┘  │
│                                                     │
│                               Subtotal:   $175.00   │
│                               Tax (10%):   $17.50   │
│                               Shipping:    $10.00   │
│                               ─────────────────────  │
│                               Total:      $202.50   │
│                               Paid:      -$202.50   │
│                               Balance:      $0.00   │
├─────────────────────────────────────────────────────┤
│  Payment Information                                │
│  Status: 🟢 Paid                                    │
│  Method: Credit Card                                │
│  Date: Jan 15, 2026                                 │
│  Transaction: TXN-123456                            │
├─────────────────────────────────────────────────────┤
│  Notes                                              │
│  Thank you for your business!                       │
│  Payment terms: Net 30                              │
└─────────────────────────────────────────────────────┘
```

### Page Sections

| Section | Priority | Content |
|---------|----------|---------|
| Header | Critical | Invoice #, Date, Logo, Actions |
| Billing Info | Critical | Bill From, Bill To addresses |
| Invoice Items | Critical | Itemized list with prices |
| Price Summary | Critical | Subtotal, Tax, Total, Balance |
| Payment Info | High | Status, Method, Date, Reference |
| Notes | Medium | Terms, Instructions, Thank you |

### Invoice Items Table

| Column | Width | Alignment | Content | Description |
|--------|-------|-----------|---------|-------------|
| Description | 40% | Left | Product name | Full product description |
| SKU | 15% | Left | Code | Product SKU |
| Quantity | 10% | Right | Number | Items ordered |
| Unit Price | 17.5% | Right | Currency | Price per item |
| Total | 17.5% | Right | Currency | Qty × Price |

### Price Breakdown Structure

```
Line Items:
├── Widget A (×2)               $100.00
└── Widget B (×1)                $75.00
                                ────────
Subtotal:                        $175.00
Tax (10%):                        $17.50
Shipping:                         $10.00
Discount:                         -$5.00
                                ════════
TOTAL:                           $197.50
Amount Paid:                    -$197.50
                                ────────
BALANCE DUE:                       $0.00
```

### Payment Status Display

| Status | Badge | Additional Info |
|--------|-------|-----------------|
| Paid | 🟢 Green Badge | Payment date, Method, Transaction ID |
| Pending | 🟡 Yellow Badge | Due date, Payment instructions |
| Overdue | 🔴 Red Badge | Days overdue, Late fees if applicable |
| Partially Paid | 🟠 Orange Badge | Amount paid, Balance remaining |
| Cancelled | ⚫ Gray Badge | Cancellation date, Reason |

### Action Buttons Availability

| Button | Paid | Pending | Overdue | Cancelled |
|--------|------|---------|---------|-----------|
| Download PDF | ✅ | ✅ | ✅ | ✅ |
| Print | ✅ | ✅ | ✅ | ✅ |
| Send Email | ✅ | ✅ | ✅ | ❌ |
| Mark as Paid | ❌ | ✅ | ✅ | ❌ |

### Invoice Header Information

| Field | Description | Format |
|-------|-------------|--------|
| Invoice Number | Unique identifier | INV-001 |
| Invoice Date | Date generated | Jan 15, 2026 |
| Due Date | Payment deadline | Feb 14, 2026 |
| Order Number | Related order | ORD-001 |
| Payment Terms | Terms (Net 30, etc.) | Net 30 days |

### Billing Information Fields

| Section | Fields | Description |
|---------|--------|-------------|
| Bill From | Company name, Address, Tax ID, Contact | Seller information |
| Bill To | Customer name, Billing address, Contact | Buyer information |
| Ship To | Shipping address (if different) | Delivery address |

### PDF Generation Specifications

| Aspect | Specification |
|--------|---------------|
| Page Size | A4 (210mm × 297mm) |
| Margins | 20mm all sides |
| Font | Professional (Arial, Helvetica) |
| Logo | Company logo at top |
| Colors | Match brand colors |
| Layout | Same as web view |
| File Name | invoice-{invoice_number}.pdf |

### Print Optimization

| Element | Print Behavior |
|---------|----------------|
| Action Buttons | Hidden |
| Navigation | Hidden |
| Colors | Optimized for B&W printing |
| Page Breaks | Smart breaks after sections |
| Backgrounds | Light or removed |
| Links | Display as text |

### Email Invoice Features

| Feature | Description |
|---------|-------------|
| Recipient | Pre-fill customer email |
| Subject | "Invoice #INV-001 from LCC" |
| Body | Professional message template |
| Attachment | PDF automatically attached |
| CC/BCC | Optional additional recipients |
| Send Copy | Option to send copy to sender |

### Error Handling

| Error | Status | Action |
|-------|--------|--------|
| Invoice not found | 404 | Display "Invoice not found" message |
| Unauthorized | 403 | Redirect to login |
| PDF generation failed | 500 | Show error, offer retry |
| Email send failed | 500 | Show error, offer retry |

### Data Requirements

| Data Type | Source API | Required Fields |
|-----------|------------|-----------------|
| Invoice | GET /api/invoices/{id} | All invoice fields |
| Order | Included in invoice | Related order details |
| Customer | Included in invoice | Customer and addresses |
| Items | Included in invoice | Line items with prices |
| Payment | Included in invoice | Payment status and details |
| Company | Configuration | Company info for header |

### Expected Outcome
- Functional invoice details page at `/invoices/{invoiceId}`
- Professional invoice layout ready for viewing and printing
- All invoice information displayed clearly
- PDF download functionality working
- Print-optimized styling applied
- Email sending capability functional
- Payment status update working for applicable invoices

### Verification Checklist
- [ ] `frontend/app/(dashboard)/invoices/[id]/page.tsx` file created
- [ ] Page component exports as default
- [ ] Accepts params prop with id correctly
- [ ] Fetches invoice data using dynamic ID
- [ ] Displays invoice header with number and date
- [ ] Company logo and information displayed
- [ ] Billing information (Bill From/To) complete
- [ ] Invoice items table displays correctly
- [ ] Price breakdown accurate and formatted
- [ ] Payment status badge displays correctly
- [ ] Payment information section complete
- [ ] Action buttons available and functional
- [ ] Download PDF button generates and downloads PDF
- [ ] Print button opens print-optimized view
- [ ] Send Email button opens email modal
- [ ] Mark as Paid updates invoice status (when applicable)
- [ ] Print styles hide unnecessary elements
- [ ] 404 handling for invalid invoice IDs
- [ ] All currency values formatted correctly
- [ ] All dates formatted consistently

---

## Document Complete

This document has covered Tasks 01-07, establishing the foundational route structure for the sales module. The next document will cover Tasks 08-14, completing the quotes routes and adding loading states, error boundaries, and verification steps.

**Progress:** 7 of 14 tasks documented in Group A.

**Continue to:** [02_Tasks-08-14_Quotes-Loading-Verify.md](02_Tasks-08-14_Quotes-Loading-Verify.md)
