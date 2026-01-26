# Tasks 01-07: Customer & Vendor Routes

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** A - CRM Routes & Pages Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_PO-Routes-Verify.md](02_Tasks-08-14_PO-Routes-Verify.md)

---

## Document Overview

This document covers the creation of the CRM module route structure, including directory setup for customers, vendors, and the creation of all customer and vendor pages with their respective routes. It establishes the foundational structure for the Customer Relationship Management (CRM) module with three main sections: customers, vendors, and purchase orders.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create CRM Route Directories | Low | 15 min |
| 02 | Create Customers List Page Route | Low | 20 min |
| 03 | Create Customer Details Page Route | Low | 20 min |
| 04 | Create New Customer Page Route | Low | 20 min |
| 05 | Create Vendors List Page Route | Low | 20 min |
| 06 | Create Vendor Details Page Route | Low | 20 min |
| 07 | Create New Vendor Page Route | Low | 20 min |

---

## Task 01: Create CRM Route Directories

### Overview
Create the main directory structure for the CRM module inside the dashboard route group. This sets up three primary directories: customers/, vendors/, and purchase-orders/, each serving as a container for their respective CRUD operations and views.

### Dependencies
- SubPhase-07 (Dashboard Layout & Navigation) must be complete
- Dashboard route group exists at `app/(dashboard)/`
- Next.js App Router is initialized

### Instructions

1. **Navigate to dashboard route group**
   - Go to `frontend/app/(dashboard)/` directory
   - This is where all ERP modules reside

2. **Create customers directory**
   - Create new directory `customers/`
   - Full path: `frontend/app/(dashboard)/customers/`
   - This will handle all customer-related routes

3. **Create vendors directory**
   - Create new directory `vendors/`
   - Full path: `frontend/app/(dashboard)/vendors/`
   - This will handle all vendor-related routes

4. **Create purchase-orders directory**
   - Create new directory `purchase-orders/`
   - Full path: `frontend/app/(dashboard)/purchase-orders/`
   - This will handle all purchase order routes

5. **Verify directory structure**
   - Confirm all three directories exist
   - Ensure proper naming (lowercase, hyphenated)

### Directory Structure
```
frontend/app/(dashboard)/
├── customers/
│   ├── page.tsx             # (Task 02)
│   ├── new/                 # (Task 04)
│   └── [id]/                # (Task 03)
├── vendors/
│   ├── page.tsx             # (Task 05)
│   ├── new/                 # (Task 07)
│   └── [id]/                # (Task 06)
└── purchase-orders/
    ├── page.tsx             # (Task 08)
    ├── new/                 # (Task 10)
    └── [id]/                # (Task 09)
```

### Route Mapping

| Directory | URL Path | Purpose |
|-----------|----------|---------|
| `customers/` | `/customers` | Customer management |
| `vendors/` | `/vendors` | Vendor management |
| `purchase-orders/` | `/purchase-orders` | PO management |

### Expected Outcome
- Three main CRM directories created
- Clean, organized structure for CRM module
- Foundation for all CRM pages

### Verification Checklist
- [ ] `frontend/app/(dashboard)/customers/` exists
- [ ] `frontend/app/(dashboard)/vendors/` exists
- [ ] `frontend/app/(dashboard)/purchase-orders/` exists
- [ ] Directory names use lowercase and hyphens

---

## Task 02: Create Customers List Page Route

### Overview
Create the main customers listing page route at `/customers`. This page will display a filterable table of all customers with summary statistics and action buttons. It serves as the entry point for all customer management operations.

### Dependencies
- Task 01: Create CRM Route Directories

### Instructions

1. **Create page.tsx file**
   - Navigate to `frontend/app/(dashboard)/customers/` directory
   - Create new file named `page.tsx`
   - This file represents the `/customers` route

2. **Import required dependencies**
   - Import Metadata type from Next.js
   - Import CustomersList component (will be created in Group B)
   - Import Suspense from React

3. **Define page metadata**
   - Export metadata object
   - Set title to "Customers | LankaCommerce Cloud"
   - Add description: "Manage your customers and view customer profiles"

4. **Create page component**
   - Define default export async function `CustomersPage`
   - Component will be server component by default
   - Return CustomersList component

5. **Add Suspense wrapper**
   - Wrap CustomersList in Suspense boundary
   - Add fallback loading component
   - Handle async data fetching gracefully

6. **Plan component structure**
   - CustomersList will contain:
     - Page header with title and "Add Customer" button
     - Summary cards (total customers, active, credit outstanding)
     - Filter bar (search, status, type, credit filters)
     - Customers data table

### Page Layout Structure

```
┌─────────────────────────────────────────────┐
│ Customers                    [Add Customer] │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │  Total   │  │  Active  │  │  Credit  │  │
│  │    450   │  │    420   │  │  ₨1.2M   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
├─────────────────────────────────────────────┤
│  🔍 Search   [Status▼] [Type▼] [Credit▼]   │
├─────────────────────────────────────────────┤
│  Name         Phone        Orders  Balance  │
│  John Silva   0771234567   45     ₨125,000 │
│  Mary Perera  0772345678   32     ₨98,000  │
│  ...                                        │
└─────────────────────────────────────────────┘
```

### URL Information

| Route | URL | Description |
|-------|-----|-------------|
| Customers List | `/customers` | Main listing page |

### Expected Outcome
- Customers list page route created
- Metadata configured for SEO
- Suspense boundary for loading states
- Route accessible at `/customers`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/customers/page.tsx` exists
- [ ] Metadata exports with correct title
- [ ] Page component is default export
- [ ] Route renders at `/customers` URL

---

## Task 03: Create Customer Details Page Route

### Overview
Create the dynamic customer details page route at `/customers/[id]`. This page displays a comprehensive 360-degree view of an individual customer, including their profile information, order history, invoices, communication log, and internal notes.

### Dependencies
- Task 01: Create CRM Route Directories
- Task 02: Create Customers List Page Route

### Instructions

1. **Create [id] directory**
   - Navigate to `frontend/app/(dashboard)/customers/` directory
   - Create new directory named `[id]`
   - Square brackets indicate a dynamic route parameter

2. **Create page.tsx in [id] directory**
   - Navigate to `frontend/app/(dashboard)/customers/[id]/` directory
   - Create new file named `page.tsx`
   - This creates the `/customers/:id` dynamic route

3. **Define page props type**
   - Create props interface with params object
   - Include id parameter from route
   - TypeScript: `{ params: { id: string } }`

4. **Import required dependencies**
   - Import Metadata, ResolvingMetadata from Next.js
   - Import CustomerDetails component (Group C)
   - Import Suspense from React

5. **Create generateMetadata function**
   - Export async function generateMetadata
   - Accept props and parent metadata as parameters
   - Fetch customer name from API using id
   - Return metadata with dynamic title: "Customer Name | LCC"
   - Handle errors gracefully

6. **Create page component**
   - Define default export async function `CustomerDetailsPage`
   - Accept props with params containing id
   - Extract id from params
   - Return CustomerDetails component with id prop

7. **Add loading boundary**
   - Wrap CustomerDetails in Suspense
   - Provide fallback loading UI
   - Enable streaming

### Dynamic Route Pattern

```
URL Pattern: /customers/[id]

Examples:
- /customers/cus_abc123def456  →  Customer Details for cus_abc123def456
- /customers/cus_xyz789ghi012  →  Customer Details for cus_xyz789ghi012

Route Parameter:
params.id = "cus_abc123def456"
```

### Customer Details Page Structure

```
┌─────────────────────────────────────────────┐
│ ← Back    [JS] John Silva       [Edit]      │
│           john@example.com      [⋮ More]    │
├─────────────────────────────────────────────┤
│  ₨1.2M        45         2024-01-15         │
│  Total Spent  Orders     Last Order         │
├─────────────────────────────────────────────┤
│  [Overview] [Orders] [Invoices] [Comm] [Notes]
├─────────────────────────────────────────────┤
│  Contact Information                        │
│  • Phone: +94 77 123 4567                   │
│  • Email: john@example.com                  │
│  • Address: 123 Main St, Colombo           │
│                                             │
│  Credit Information                         │
│  • Limit: ₨500,000                         │
│  • Used: ₨125,000 (25%)                    │
│  • Available: ₨375,000                     │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Dynamic customer details route created
- Route accepts id parameter
- Dynamic metadata generation
- Page accessible at `/customers/:id`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/customers/[id]/page.tsx` exists
- [ ] generateMetadata function exports
- [ ] Page component accepts and uses id param
- [ ] Route renders at `/customers/cus_test123`

---

## Task 04: Create New Customer Page Route

### Overview
Create the new customer creation page route at `/customers/new`. This page displays a comprehensive form for creating a new customer record with contact information, address details, business type, credit terms, and additional metadata.

### Dependencies
- Task 01: Create CRM Route Directories
- Task 02: Create Customers List Page Route

### Instructions

1. **Create new directory**
   - Navigate to `frontend/app/(dashboard)/customers/` directory
   - Create new directory named `new`
   - This creates a static route at `/customers/new`

2. **Create page.tsx in new directory**
   - Navigate to `frontend/app/(dashboard)/customers/new/` directory
   - Create new file named `page.tsx`
   - This file represents the `/customers/new` route

3. **Import required dependencies**
   - Import Metadata from Next.js
   - Import CustomerForm component (Group F)
   - Import page header components

4. **Define page metadata**
   - Export metadata object
   - Set title to "New Customer | LankaCommerce Cloud"
   - Add description: "Create a new customer record"

5. **Create page component**
   - Define default export function `NewCustomerPage`
   - Create page header with back button
   - Add page title "Create New Customer"
   - Return CustomerForm component

6. **Plan form sections**
   - Basic Information (name, type)
   - Contact Details (phone, email)
   - Address Information (street, city, country)
   - Credit Terms (limit, payment terms)
   - Additional Notes

### New Customer Page Structure

```
┌─────────────────────────────────────────────┐
│ ← Back to Customers                         │
│                                             │
│ Create New Customer                         │
├─────────────────────────────────────────────┤
│  Basic Information                          │
│  ┌────────────────────────────────────┐    │
│  │ Customer Name *                    │    │
│  └────────────────────────────────────┘    │
│  ┌────────────┐                            │
│  │ Type *    ▼│                            │
│  └────────────┘                            │
│                                             │
│  Contact Details                            │
│  ┌─────────────┐  ┌────────────────────┐   │
│  │ Phone *     │  │ Email              │   │
│  └─────────────┘  └────────────────────┘   │
│                                             │
│  Address Information                        │
│  ┌────────────────────────────────────┐    │
│  │ Street Address                     │    │
│  └────────────────────────────────────┘    │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ City        │  │ Postal Code │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  Credit Terms                               │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ Credit Limit│  │ Payment Terms│          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  [Cancel]              [Create Customer]    │
└─────────────────────────────────────────────┘
```

### Form Fields Overview

| Section | Fields | Required |
|---------|--------|----------|
| Basic Info | Name, Type | Yes |
| Contact | Phone, Email | Phone required |
| Address | Street, City, Postal, Country | Optional |
| Credit | Limit, Terms | Optional |
| Notes | Internal notes | Optional |

### Expected Outcome
- New customer page route created
- Form component properly integrated
- Metadata configured for SEO
- Route accessible at `/customers/new`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/customers/new/page.tsx` exists
- [ ] Metadata exports with correct title
- [ ] Page component renders form
- [ ] Route accessible at `/customers/new`

---

## Task 05: Create Vendors List Page Route

### Overview
Create the main vendors listing page route at `/vendors`. This page displays a filterable table of all vendors with summary statistics, contact information, and product categories. It serves as the primary interface for vendor management operations.

### Dependencies
- Task 01: Create CRM Route Directories

### Instructions

1. **Create page.tsx file**
   - Navigate to `frontend/app/(dashboard)/vendors/` directory
   - Create new file named `page.tsx`
   - This file represents the `/vendors` route

2. **Import required dependencies**
   - Import Metadata type from Next.js
   - Import VendorsList component (will be created in Group D)
   - Import Suspense from React

3. **Define page metadata**
   - Export metadata object
   - Set title to "Vendors | LankaCommerce Cloud"
   - Add description: "Manage suppliers and view vendor details"

4. **Create page component**
   - Define default export async function `VendorsPage`
   - Component is server component by default
   - Return VendorsList component

5. **Add Suspense wrapper**
   - Wrap VendorsList in Suspense boundary
   - Add fallback loading component
   - Handle async data fetching

6. **Plan component structure**
   - VendorsList will contain:
     - Page header with title and "Add Vendor" button
     - Summary cards (total vendors, active vendors)
     - Filter bar (search, status filters)
     - Vendors data table

### Page Layout Structure

```
┌─────────────────────────────────────────────┐
│ Vendors                       [Add Vendor]  │
├─────────────────────────────────────────────┤
│  ┌──────────────┐    ┌──────────────┐      │
│  │ Total Vendors│    │Active Vendors│      │
│  │     125      │    │     118      │      │
│  └──────────────┘    └──────────────┘      │
├─────────────────────────────────────────────┤
│  🔍 Search vendors...    [Status▼]         │
├─────────────────────────────────────────────┤
│  Name             Contact         Products  │
│  ABC Suppliers    0711234567     Electronics│
│  XYZ Traders      0712345678     Clothing   │
│  ...                                        │
└─────────────────────────────────────────────┘
```

### URL Information

| Route | URL | Description |
|-------|-----|-------------|
| Vendors List | `/vendors` | Main listing page |

### Expected Outcome
- Vendors list page route created
- Metadata configured for SEO
- Suspense boundary for loading states
- Route accessible at `/vendors`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/vendors/page.tsx` exists
- [ ] Metadata exports with correct title
- [ ] Page component is default export
- [ ] Route renders at `/vendors` URL

---

## Task 06: Create Vendor Details Page Route

### Overview
Create the dynamic vendor details page route at `/vendors/[id]`. This page displays comprehensive vendor information including company details, payment terms, product catalog, and purchase order history.

### Dependencies
- Task 01: Create CRM Route Directories
- Task 05: Create Vendors List Page Route

### Instructions

1. **Create [id] directory**
   - Navigate to `frontend/app/(dashboard)/vendors/` directory
   - Create new directory named `[id]`
   - Square brackets indicate dynamic route parameter

2. **Create page.tsx in [id] directory**
   - Navigate to `frontend/app/(dashboard)/vendors/[id]/` directory
   - Create new file named `page.tsx`
   - This creates the `/vendors/:id` dynamic route

3. **Define page props type**
   - Create props interface with params object
   - Include id parameter from route
   - TypeScript: `{ params: { id: string } }`

4. **Import required dependencies**
   - Import Metadata, ResolvingMetadata from Next.js
   - Import VendorDetails component (Group D)
   - Import Suspense from React

5. **Create generateMetadata function**
   - Export async function generateMetadata
   - Accept props and parent metadata as parameters
   - Fetch vendor name from API using id
   - Return metadata with dynamic title: "Vendor Name | LCC"
   - Handle errors gracefully

6. **Create page component**
   - Define default export async function `VendorDetailsPage`
   - Accept props with params containing id
   - Extract id from params
   - Return VendorDetails component with id prop

7. **Add loading boundary**
   - Wrap VendorDetails in Suspense
   - Provide fallback loading UI
   - Enable streaming

### Dynamic Route Pattern

```
URL Pattern: /vendors/[id]

Examples:
- /vendors/ven_abc123def456  →  Vendor Details for ven_abc123def456
- /vendors/ven_xyz789ghi012  →  Vendor Details for ven_xyz789ghi012

Route Parameter:
params.id = "ven_abc123def456"
```

### Vendor Details Page Structure

```
┌─────────────────────────────────────────────┐
│ ← Back    ABC Suppliers Ltd      [Edit]     │
│           Active                  [⋮ More]  │
├─────────────────────────────────────────────┤
│  [Overview] [Products] [PO History]         │
├─────────────────────────────────────────────┤
│  Company Information                        │
│  • Contact: Raj Kumar                       │
│  • Phone: +94 71 123 4567                   │
│  • Email: info@abcsuppliers.lk             │
│  • Address: 45 Industrial Rd, Colombo 10   │
│                                             │
│  Payment Terms                              │
│  • Terms: Net 30 Days                       │
│  • Currency: LKR                           │
│  • Tax ID: 123456789V                      │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Dynamic vendor details route created
- Route accepts id parameter
- Dynamic metadata generation
- Page accessible at `/vendors/:id`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/vendors/[id]/page.tsx` exists
- [ ] generateMetadata function exports
- [ ] Page component accepts and uses id param
- [ ] Route renders at `/vendors/ven_test123`

---

## Task 07: Create New Vendor Page Route

### Overview
Create the new vendor creation page route at `/vendors/new`. This page displays a comprehensive form for adding a new vendor/supplier to the system with company information, contact details, payment terms, and product categories.

### Dependencies
- Task 01: Create CRM Route Directories
- Task 05: Create Vendors List Page Route

### Instructions

1. **Create new directory**
   - Navigate to `frontend/app/(dashboard)/vendors/` directory
   - Create new directory named `new`
   - This creates a static route at `/vendors/new`

2. **Create page.tsx in new directory**
   - Navigate to `frontend/app/(dashboard)/vendors/new/` directory
   - Create new file named `page.tsx`
   - This file represents the `/vendors/new` route

3. **Import required dependencies**
   - Import Metadata from Next.js
   - Import VendorForm component (Group D)
   - Import page header components

4. **Define page metadata**
   - Export metadata object
   - Set title to "New Vendor | LankaCommerce Cloud"
   - Add description: "Add a new vendor or supplier"

5. **Create page component**
   - Define default export function `NewVendorPage`
   - Create page header with back button
   - Add page title "Add New Vendor"
   - Return VendorForm component

6. **Plan form sections**
   - Company Information (name, business type)
   - Contact Details (contact person, phone, email)
   - Address Information
   - Payment Terms (credit days, currency)
   - Product Categories (tags/categories)

### New Vendor Page Structure

```
┌─────────────────────────────────────────────┐
│ ← Back to Vendors                           │
│                                             │
│ Add New Vendor                              │
├─────────────────────────────────────────────┤
│  Company Information                        │
│  ┌────────────────────────────────────┐    │
│  │ Company Name *                     │    │
│  └────────────────────────────────────┘    │
│  ┌────────────────────────────────────┐    │
│  │ Business Type                      │    │
│  └────────────────────────────────────┘    │
│                                             │
│  Contact Details                            │
│  ┌────────────────────────────────────┐    │
│  │ Contact Person Name *              │    │
│  └────────────────────────────────────┘    │
│  ┌─────────────┐  ┌────────────────────┐   │
│  │ Phone *     │  │ Email *            │   │
│  └─────────────┘  └────────────────────┘   │
│                                             │
│  Address Information                        │
│  ┌────────────────────────────────────┐    │
│  │ Street Address                     │    │
│  └────────────────────────────────────┘    │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ City        │  │ Postal Code │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  Payment Terms                              │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ Credit Days │  │ Currency   ▼│          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  Product Categories                         │
│  ┌────────────────────────────────────┐    │
│  │ Electronics, Hardware, ...         │    │
│  └────────────────────────────────────┘    │
│                                             │
│  [Cancel]                [Create Vendor]    │
└─────────────────────────────────────────────┘
```

### Form Fields Overview

| Section | Fields | Required |
|---------|--------|----------|
| Company | Name, Business Type | Name required |
| Contact | Person, Phone, Email | All required |
| Address | Street, City, Postal, Country | Optional |
| Payment | Credit Days, Currency | Optional |
| Products | Categories/Tags | Optional |

### Expected Outcome
- New vendor page route created
- Form component properly integrated
- Metadata configured for SEO
- Route accessible at `/vendors/new`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/vendors/new/page.tsx` exists
- [ ] Metadata exports with correct title
- [ ] Page component renders form
- [ ] Route accessible at `/vendors/new`

---

## Summary

This document established the customer and vendor route structure for the CRM module. The following routes are now available:

### Customer Routes
- `/customers` - List all customers
- `/customers/new` - Create new customer
- `/customers/[id]` - View customer details

### Vendor Routes
- `/vendors` - List all vendors
- `/vendors/new` - Create new vendor
- `/vendors/[id]` - View vendor details

All routes follow Next.js App Router conventions with proper metadata configuration and Suspense boundaries for optimal loading states. The next document will complete the purchase orders routes and add loading and error boundaries.
