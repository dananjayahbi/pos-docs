# Tasks 08-14: PO Routes & Verification

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 12 - Customer & Vendor UI  
> **Group:** A - CRM Routes & Pages Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Customer-Vendor-Routes.md](01_Tasks-01-07_Customer-Vendor-Routes.md)
- **→ Next Group:** [Group-B_Customer-Listing-Filters](../Group-B_Customer-Listing-Filters/)

---

## Document Overview

This document completes the CRM route structure by creating purchase order routes, configuring page metadata for all CRM pages, implementing loading states with loading.tsx files, creating error boundaries, and verifying the entire route structure works correctly.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create Purchase Orders Page Route | Low | 20 min |
| 09 | Create PO Details Page Route | Low | 20 min |
| 10 | Create New PO Page Route | Low | 20 min |
| 11 | Configure Page Metadata | Low | 25 min |
| 12 | Create CRM Loading States | Low | 30 min |
| 13 | Create CRM Error Boundaries | Low | 30 min |
| 14 | Verify Route Structure | Low | 20 min |

---

## Task 08: Create Purchase Orders Page Route

### Overview
Create the main purchase orders listing page route at `/purchase-orders`. This page displays all purchase orders with filtering capabilities, status indicators, and summary statistics for procurement management.

### Dependencies
- Task 01: Create CRM Route Directories

### Instructions

1. **Create page.tsx file**
   - Navigate to `frontend/app/(dashboard)/purchase-orders/` directory
   - Create new file named `page.tsx`
   - This file represents the `/purchase-orders` route

2. **Import required dependencies**
   - Import Metadata type from Next.js
   - Import POList component (will be created in Group E)
   - Import Suspense from React

3. **Define page metadata**
   - Export metadata object
   - Set title to "Purchase Orders | LankaCommerce Cloud"
   - Add description: "Manage purchase orders and vendor procurement"

4. **Create page component**
   - Define default export async function `PurchaseOrdersPage`
   - Component is server component by default
   - Return POList component

5. **Add Suspense wrapper**
   - Wrap POList in Suspense boundary
   - Add fallback loading component
   - Handle async data fetching

6. **Plan component structure**
   - POList will contain:
     - Page header with title and "Create PO" button
     - Filter bar (vendor search, status, date range)
     - Purchase orders data table
     - Status badges (Draft, Sent, Partial, Received)

### Page Layout Structure

```
┌─────────────────────────────────────────────┐
│ Purchase Orders              [Create PO]    │
├─────────────────────────────────────────────┤
│  🔍 Search   [Vendor▼] [Status▼] [Date▼]   │
├─────────────────────────────────────────────┤
│  PO #       Vendor        Date      Total   │
│  PO-001     ABC Suppliers 2024-01   ₨250K  │
│  [Received]                                 │
│  PO-002     XYZ Traders   2024-01   ₨180K  │
│  [Partial]                                  │
│  ...                                        │
└─────────────────────────────────────────────┘
```

### URL Information

| Route | URL | Description |
|-------|-----|-------------|
| PO List | `/purchase-orders` | Main listing page |

### Expected Outcome
- PO list page route created
- Metadata configured for SEO
- Suspense boundary for loading states
- Route accessible at `/purchase-orders`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/purchase-orders/page.tsx` exists
- [ ] Metadata exports with correct title
- [ ] Page component is default export
- [ ] Route renders at `/purchase-orders` URL

---

## Task 09: Create PO Details Page Route

### Overview
Create the dynamic purchase order details page route at `/purchase-orders/[id]`. This page displays comprehensive PO information including line items, receiving status, vendor details, and actions to receive items.

### Dependencies
- Task 08: Create Purchase Orders Page Route

### Instructions

1. **Create [id] directory**
   - Navigate to `frontend/app/(dashboard)/purchase-orders/` directory
   - Create new directory named `[id]`
   - Square brackets indicate dynamic route parameter

2. **Create page.tsx in [id] directory**
   - Navigate to `frontend/app/(dashboard)/purchase-orders/[id]/` directory
   - Create new file named `page.tsx`
   - This creates the `/purchase-orders/:id` dynamic route

3. **Define page props type**
   - Create props interface with params object
   - Include id parameter from route
   - TypeScript: `{ params: { id: string } }`

4. **Import required dependencies**
   - Import Metadata, ResolvingMetadata from Next.js
   - Import PODetails component (Group E)
   - Import Suspense from React

5. **Create generateMetadata function**
   - Export async function generateMetadata
   - Accept props and parent metadata
   - Fetch PO number from API using id
   - Return metadata with dynamic title: "PO-XXX | LCC"
   - Handle errors gracefully

6. **Create page component**
   - Define default export async function `PODetailsPage`
   - Accept props with params containing id
   - Extract id from params
   - Return PODetails component with id prop

7. **Add loading boundary**
   - Wrap PODetails in Suspense
   - Provide fallback loading UI

### Dynamic Route Pattern

```
URL Pattern: /purchase-orders/[id]

Examples:
- /purchase-orders/po_abc123def456
- /purchase-orders/po_xyz789ghi012

Route Parameter:
params.id = "po_abc123def456"
```

### PO Details Page Structure

```
┌─────────────────────────────────────────────┐
│ ← Back    PO-001                 [Receive]  │
│           ABC Suppliers Ltd      [⋮ More]   │
│           Status: [Partial]                 │
├─────────────────────────────────────────────┤
│  Order Date: 2024-01-15                     │
│  Expected: 2024-01-25                       │
│  Total: ₨250,000                           │
├─────────────────────────────────────────────┤
│  Items                                      │
│  ┌─────────────────────────────────────┐   │
│  │ Product      Qty  Recv'd  Price     │   │
│  │ Widget A     100   80     ₨1,000    │   │
│  │ Widget B     50    0      ₨2,000    │   │
│  │ ...                                 │   │
│  └─────────────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

### Expected Outcome
- Dynamic PO details route created
- Route accepts id parameter
- Dynamic metadata generation
- Page accessible at `/purchase-orders/:id`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/purchase-orders/[id]/page.tsx` exists
- [ ] generateMetadata function exports
- [ ] Page component accepts and uses id param
- [ ] Route renders at `/purchase-orders/po_test123`

---

## Task 10: Create New PO Page Route

### Overview
Create the new purchase order creation page route at `/purchase-orders/new`. This page displays a comprehensive form for creating new purchase orders with vendor selection, item management, and delivery details.

### Dependencies
- Task 08: Create Purchase Orders Page Route

### Instructions

1. **Create new directory**
   - Navigate to `frontend/app/(dashboard)/purchase-orders/` directory
   - Create new directory named `new`
   - This creates static route at `/purchase-orders/new`

2. **Create page.tsx in new directory**
   - Navigate to `frontend/app/(dashboard)/purchase-orders/new/` directory
   - Create new file named `page.tsx`
   - This file represents the `/purchase-orders/new` route

3. **Import required dependencies**
   - Import Metadata from Next.js
   - Import POForm component (Group E)
   - Import page header components

4. **Define page metadata**
   - Export metadata object
   - Set title to "New Purchase Order | LankaCommerce Cloud"
   - Add description: "Create a new purchase order"

5. **Create page component**
   - Define default export function `NewPOPage`
   - Create page header with back button
   - Add page title "Create Purchase Order"
   - Return POForm component

6. **Plan form sections**
   - Vendor Selection (search and select vendor)
   - Order Details (PO number, date, expected date)
   - Line Items (product, quantity, price)
   - Delivery Information
   - Notes and Terms

### New PO Page Structure

```
┌─────────────────────────────────────────────┐
│ ← Back to Purchase Orders                   │
│                                             │
│ Create Purchase Order                       │
├─────────────────────────────────────────────┤
│  Vendor *                                   │
│  ┌────────────────────────────────────┐    │
│  │ Search vendor...                  ▼│    │
│  └────────────────────────────────────┘    │
│                                             │
│  Order Details                              │
│  ┌─────────────┐  ┌─────────────┐          │
│  │ PO Date *   │  │ Expected    │          │
│  └─────────────┘  └─────────────┘          │
│                                             │
│  Items                      [+ Add Item]    │
│  ┌─────────────────────────────────────┐   │
│  │ Product     Qty    Price   Total    │   │
│  │ Widget A    100    ₨1,000  ₨100,000│   │
│  │ [Remove]                            │   │
│  └─────────────────────────────────────┘   │
│                                             │
│  Subtotal:             ₨100,000            │
│  Tax:                  ₨18,000             │
│  Total:                ₨118,000            │
│                                             │
│  Delivery Address                           │
│  ┌────────────────────────────────────┐    │
│  │ Warehouse address...               │    │
│  └────────────────────────────────────┘    │
│                                             │
│  [Cancel]           [Save Draft] [Submit]   │
└─────────────────────────────────────────────┘
```

### Form Fields Overview

| Section | Fields | Required |
|---------|--------|----------|
| Vendor | Vendor selection | Yes |
| Details | PO Date, Expected Date | PO Date required |
| Items | Product, Quantity, Price | At least 1 item |
| Delivery | Address | Optional |
| Notes | Internal notes, Terms | Optional |

### Expected Outcome
- New PO page route created
- Form component properly integrated
- Metadata configured for SEO
- Route accessible at `/purchase-orders/new`

### Verification Checklist
- [ ] `frontend/app/(dashboard)/purchase-orders/new/page.tsx` exists
- [ ] Metadata exports with correct title
- [ ] Page component renders form
- [ ] Route accessible at `/purchase-orders/new`

---

## Task 11: Configure Page Metadata

### Overview
Configure comprehensive metadata for all CRM pages to improve SEO, social sharing, and browser tab display. This includes titles, descriptions, Open Graph tags, and Twitter Card information.

### Dependencies
- Tasks 02-10: All page routes created

### Instructions

1. **Review existing metadata**
   - Check all page.tsx files
   - Verify basic title and description exist
   - Identify missing metadata fields

2. **Create metadata utility**
   - Create `lib/metadata/crm.ts` file
   - Define helper function for CRM metadata
   - Include default OG image path
   - Set up common metadata patterns

3. **Enhance customers list metadata**
   - Add Open Graph title and description
   - Add Twitter Card metadata
   - Include canonical URL
   - Add keywords for SEO

4. **Enhance customer details metadata**
   - Use dynamic customer name in title
   - Generate description from customer data
   - Include OG image if customer has logo
   - Add structured data for organization

5. **Enhance vendors metadata**
   - Configure vendor list page metadata
   - Add vendor-specific OG tags
   - Include business category information

6. **Enhance PO metadata**
   - Configure PO list metadata
   - Add PO details dynamic metadata
   - Include financial transaction tags

7. **Add robots meta tags**
   - Set appropriate robots directives
   - Configure indexing preferences
   - Add sitemap references

### Metadata Configuration Table

| Page | Title | Description |
|------|-------|-------------|
| Customers List | Customers \| LCC | Manage your customers and view customer profiles |
| Customer Details | {Name} \| LCC | View detailed information for {Name} |
| New Customer | New Customer \| LCC | Create a new customer record |
| Vendors List | Vendors \| LCC | Manage suppliers and view vendor details |
| Vendor Details | {Name} \| LCC | View vendor details for {Name} |
| New Vendor | New Vendor \| LCC | Add a new vendor or supplier |
| PO List | Purchase Orders \| LCC | Manage purchase orders and vendor procurement |
| PO Details | {PO Number} \| LCC | View purchase order details for {PO Number} |
| New PO | New Purchase Order \| LCC | Create a new purchase order |

### Metadata Fields Structure

```
Metadata Object:
├── title
├── description
├── openGraph
│   ├── title
│   ├── description
│   ├── images
│   └── type
├── twitter
│   ├── card
│   ├── title
│   ├── description
│   └── images
└── robots
    ├── index
    └── follow
```

### Expected Outcome
- All pages have comprehensive metadata
- SEO optimization complete
- Social sharing configured
- Browser tabs display meaningful titles

### Verification Checklist
- [ ] All page routes have metadata exports
- [ ] Dynamic pages use generateMetadata
- [ ] Open Graph tags configured
- [ ] Twitter Card tags added
- [ ] Robots directives set appropriately

---

## Task 12: Create CRM Loading States

### Overview
Create loading.tsx files for all CRM routes to provide skeleton loaders and loading states while data is being fetched. These files leverage Next.js's built-in loading UI pattern with React Suspense.

### Dependencies
- Tasks 02-10: All page routes created

### Instructions

1. **Create customers loading state**
   - Navigate to `frontend/app/(dashboard)/customers/` directory
   - Create new file `loading.tsx`
   - Import skeleton components
   - Define default export function `CustomersLoading`
   - Create loading UI matching customer list layout

2. **Create customer details loading state**
   - Navigate to `frontend/app/(dashboard)/customers/[id]/` directory
   - Create new file `loading.tsx`
   - Define CustomerDetailsLoading component
   - Match customer profile layout structure

3. **Create vendors loading state**
   - Navigate to `frontend/app/(dashboard)/vendors/` directory
   - Create new file `loading.tsx`
   - Define VendorsLoading component
   - Match vendors list layout

4. **Create vendor details loading state**
   - Navigate to `frontend/app/(dashboard)/vendors/[id]/` directory
   - Create new file `loading.tsx`
   - Define VendorDetailsLoading component

5. **Create PO loading states**
   - Create loading.tsx in purchase-orders directory
   - Create loading.tsx in purchase-orders/[id] directory
   - Match respective page layouts

6. **Design skeleton patterns**
   - Use consistent skeleton design
   - Match actual page structure
   - Include proper spacing
   - Add subtle animations

### Loading State Structure

```
Customers List Loading:
┌─────────────────────────────────────────────┐
│ ████████             ▓▓▓▓▓▓▓▓▓▓▓▓           │
├─────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ ▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓ │  │ ▓▓▓▓▓▓▓ │  │
│  │ ▓▓▓▓▓   │  │ ▓▓▓▓▓   │  │ ▓▓▓▓▓   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
├─────────────────────────────────────────────┤
│  ▓▓▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓ ▓▓▓▓▓                 │
├─────────────────────────────────────────────┤
│  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓▓▓▓▓           │
│  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓▓▓▓▓           │
│  ▓▓▓▓▓▓▓ ▓▓▓▓▓▓▓▓▓ ▓▓▓▓ ▓▓▓▓▓▓▓▓           │
└─────────────────────────────────────────────┘
```

### Skeleton Component Usage

| Component | Purpose |
|-----------|---------|
| Skeleton.Rectangle | Card backgrounds |
| Skeleton.Text | Text lines |
| Skeleton.Circle | Avatar placeholders |
| Skeleton.Table | Table row placeholders |

### Loading Files Location

```
frontend/app/(dashboard)/
├── customers/
│   ├── loading.tsx             ← Task 12
│   ├── [id]/
│   │   └── loading.tsx         ← Task 12
│   └── new/
│       (no loading needed)
├── vendors/
│   ├── loading.tsx             ← Task 12
│   ├── [id]/
│   │   └── loading.tsx         ← Task 12
│   └── new/
│       (no loading needed)
└── purchase-orders/
    ├── loading.tsx             ← Task 12
    ├── [id]/
    │   └── loading.tsx         ← Task 12
    └── new/
        (no loading needed)
```

### Expected Outcome
- Loading states for all list pages
- Loading states for all details pages
- Skeleton UI matches actual layouts
- Smooth loading experience

### Verification Checklist
- [ ] All loading.tsx files created
- [ ] Skeleton patterns match page layouts
- [ ] Loading states render correctly
- [ ] Animations are subtle and professional

---

## Task 13: Create CRM Error Boundaries

### Overview
Create error.tsx files for all CRM routes to handle errors gracefully and provide user-friendly error messages with recovery options. These error boundaries catch runtime errors and provide fallback UI.

### Dependencies
- Tasks 02-10: All page routes created

### Instructions

1. **Create customers error boundary**
   - Navigate to `frontend/app/(dashboard)/customers/` directory
   - Create new file `error.tsx`
   - Mark as client component with 'use client' directive
   - Import error UI components
   - Define default export function `CustomersError`
   - Accept error and reset props

2. **Create customer details error boundary**
   - Navigate to `frontend/app/(dashboard)/customers/[id]/` directory
   - Create new file `error.tsx`
   - Define CustomerDetailsError component
   - Handle "Customer not found" specific error

3. **Create vendors error boundaries**
   - Create error.tsx in vendors directory
   - Create error.tsx in vendors/[id] directory
   - Handle vendor-specific errors

4. **Create PO error boundaries**
   - Create error.tsx in purchase-orders directory
   - Create error.tsx in purchase-orders/[id] directory
   - Handle PO-specific errors

5. **Design error UI patterns**
   - Include error icon
   - Display error message
   - Show "Try Again" button
   - Add "Go Back" option
   - Include contact support link

6. **Implement error logging**
   - Log errors to console in development
   - Send errors to monitoring service in production
   - Include error context and user info

### Error UI Structure

```
┌─────────────────────────────────────────────┐
│                                             │
│              ⚠️                             │
│                                             │
│         Something went wrong                │
│                                             │
│  We couldn't load the customer data.        │
│  Please try again or contact support.       │
│                                             │
│                                             │
│      [Try Again]    [Go Back]              │
│                                             │
│      Need help? Contact support             │
│                                             │
└─────────────────────────────────────────────┘
```

### Error Types to Handle

| Error Type | Message | Action |
|------------|---------|--------|
| Network Error | Connection failed | Retry |
| 404 Not Found | Item not found | Go back |
| 403 Forbidden | Access denied | Go home |
| 500 Server Error | Server error | Retry / Contact |
| Unknown Error | Unexpected error | Retry / Report |

### Error Boundary Files Location

```
frontend/app/(dashboard)/
├── customers/
│   ├── error.tsx              ← Task 13
│   ├── [id]/
│   │   └── error.tsx          ← Task 13
│   └── new/
│       └── error.tsx          ← Task 13
├── vendors/
│   ├── error.tsx              ← Task 13
│   ├── [id]/
│   │   └── error.tsx          ← Task 13
│   └── new/
│       └── error.tsx          ← Task 13
└── purchase-orders/
    ├── error.tsx              ← Task 13
    ├── [id]/
    │   └── error.tsx          ← Task 13
    └── new/
        └── error.tsx          ← Task 13
```

### Expected Outcome
- Error boundaries for all routes
- User-friendly error messages
- Recovery options available
- Errors logged appropriately

### Verification Checklist
- [ ] All error.tsx files created
- [ ] Files marked with 'use client'
- [ ] Error and reset props handled
- [ ] Error UI is user-friendly
- [ ] Recovery options provided

---

## Task 14: Verify Route Structure

### Overview
Perform comprehensive verification of the entire CRM route structure to ensure all routes are accessible, metadata is correct, loading states work, and error boundaries function properly. This final validation ensures the routing foundation is solid before building components.

### Dependencies
- Task 13: Create CRM Error Boundaries

### Instructions

1. **Create route verification checklist**
   - List all routes to verify
   - Document expected behavior for each
   - Prepare test scenarios

2. **Verify customer routes**
   - Navigate to `/customers` in browser
   - Verify page loads and metadata displays
   - Check loading state appears briefly
   - Navigate to `/customers/new`
   - Navigate to `/customers/test-id`
   - Test error boundary with invalid ID

3. **Verify vendor routes**
   - Navigate to `/vendors`
   - Check metadata and loading
   - Navigate to `/vendors/new`
   - Navigate to `/vendors/test-id`
   - Test error scenarios

4. **Verify PO routes**
   - Navigate to `/purchase-orders`
   - Check metadata and loading
   - Navigate to `/purchase-orders/new`
   - Navigate to `/purchase-orders/test-id`
   - Test error handling

5. **Test navigation flow**
   - Test navigation from dashboard
   - Verify back buttons work
   - Test browser back/forward
   - Verify URL updates correctly

6. **Verify loading states**
   - Simulate slow network
   - Verify skeleton loaders appear
   - Check animation smoothness
   - Verify transition to actual content

7. **Test error boundaries**
   - Trigger intentional errors
   - Verify error UI displays
   - Test "Try Again" button
   - Verify error recovery

8. **Document verification results**
   - Create verification report
   - List any issues found
   - Document resolution steps
   - Confirm all routes working

### Route Verification Table

| Route | Metadata | Loading | Error | Status |
|-------|----------|---------|-------|--------|
| /customers | ✓ | ✓ | ✓ | ✓ |
| /customers/new | ✓ | N/A | ✓ | ✓ |
| /customers/[id] | ✓ | ✓ | ✓ | ✓ |
| /vendors | ✓ | ✓ | ✓ | ✓ |
| /vendors/new | ✓ | N/A | ✓ | ✓ |
| /vendors/[id] | ✓ | ✓ | ✓ | ✓ |
| /purchase-orders | ✓ | ✓ | ✓ | ✓ |
| /purchase-orders/new | ✓ | N/A | ✓ | ✓ |
| /purchase-orders/[id] | ✓ | ✓ | ✓ | ✓ |

### Test Scenarios

| Scenario | Expected Behavior |
|----------|-------------------|
| Navigate to list page | Page loads with proper title |
| Navigate to details page | Dynamic metadata loads |
| Navigate to new page | Form displays correctly |
| Slow network | Skeleton loader appears |
| Invalid ID | Error boundary displays |
| Try again after error | Page retries loading |
| Browser back button | Navigation works correctly |

### Verification Commands

Run these commands to verify route setup:
- Check route files exist
- Verify file exports
- Run TypeScript type checking
- Run development server and test manually

### Expected Outcome
- All routes accessible and working
- Metadata correct on all pages
- Loading states display properly
- Error boundaries function correctly
- Navigation flows smoothly
- No console errors
- Route structure ready for component development

### Verification Checklist
- [ ] All 9 routes accessible
- [ ] Metadata displays correctly in browser tabs
- [ ] Loading states appear and transition smoothly
- [ ] Error boundaries catch and display errors
- [ ] Navigation between routes works
- [ ] Browser navigation (back/forward) works
- [ ] URL parameters parsed correctly
- [ ] No TypeScript errors
- [ ] No console errors in browser
- [ ] Verification report documented

---

## Summary

This document completed the CRM route structure with purchase orders, metadata configuration, loading states, and error boundaries. The following have been implemented:

### Purchase Order Routes
- `/purchase-orders` - List all purchase orders
- `/purchase-orders/new` - Create new purchase order
- `/purchase-orders/[id]` - View purchase order details

### Metadata Configuration
- All pages have comprehensive metadata
- SEO optimization complete
- Open Graph and Twitter Cards configured

### Loading States
- Skeleton loaders for all list and details pages
- Smooth loading transitions
- Consistent loading UI patterns

### Error Boundaries
- Error handling for all routes
- User-friendly error messages
- Recovery options provided

### Verification Complete
- All 9 routes tested and verified
- Navigation flows confirmed
- Ready for component development in next groups

The CRM module route structure is now complete and ready for building the actual page components in subsequent groups.
