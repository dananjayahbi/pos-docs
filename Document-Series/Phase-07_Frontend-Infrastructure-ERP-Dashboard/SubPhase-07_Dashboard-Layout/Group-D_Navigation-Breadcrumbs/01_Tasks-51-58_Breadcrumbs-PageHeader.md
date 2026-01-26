# Tasks 51-58: Breadcrumbs & Page Header

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 07 - Dashboard Layout  
> **Group:** D - Navigation & Breadcrumbs  
> **Document:** 01 of 01  
> **Tasks Covered:** 51, 52, 53, 54, 55, 56, 57, 58

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [../Group-C_Header-Component/01_Tasks-33-41_Header-Search-Notifications.md](../Group-C_Header-Component/01_Tasks-33-41_Header-Search-Notifications.md)

---

## Document Overview

This document covers the implementation of breadcrumb navigation and page header components for the ERP dashboard. Breadcrumbs provide contextual navigation showing the user's location within the application hierarchy, while page headers create consistent page layouts with titles and action buttons. The breadcrumb system automatically generates navigation trails from routes, handles dynamic segments by fetching resource names, and integrates seamlessly with the page layout system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 51 | Create Breadcrumb Component | Medium | 35 min |
| 52 | Create BreadcrumbItem Component | Low | 20 min |
| 53 | Create BreadcrumbSeparator | Low | 15 min |
| 54 | Create useBreadcrumbs Hook | High | 45 min |
| 55 | Define Route-to-Breadcrumb Mapping | Medium | 30 min |
| 56 | Handle Dynamic Route Segments | High | 50 min |
| 57 | Add Breadcrumb to Page Container | Low | 20 min |
| 58 | Create Page Header Component | Medium | 35 min |

---

## Task 51: Create Breadcrumb Component

### Overview
Create the main Breadcrumb component that serves as the container for the breadcrumb navigation system. This component uses semantic HTML with proper ARIA labels for accessibility, renders a horizontal navigation list, and accepts an array of breadcrumb items to display. The component provides a clean, accessible way to show users their current location within the application hierarchy and allows quick navigation to parent pages.

### Dependencies
- SubPhase-03: Component Library Setup (Shadcn/ui components)
- SubPhase-02: Tailwind Design System (styling utilities)

### Instructions

1. **Create breadcrumb directory structure**
   - Navigate to `frontend/components/layout/` directory
   - Create new directory named `Breadcrumb`
   - This organizes all breadcrumb-related components together
   - Keeps layout components organized and discoverable

2. **Create main Breadcrumb component file**
   - Create `Breadcrumb.tsx` in the Breadcrumb directory
   - This file contains the breadcrumb container component
   - Uses TypeScript for type safety

3. **Define component props interface**
   - Create BreadcrumbProps interface
   - Include items array prop for breadcrumb data
   - Each item should have label, href, and optional isCurrent flag
   - Add optional className for style customization

4. **Set up semantic navigation structure**
   - Use nav element as outer container
   - Add aria-label="Breadcrumb" for screen readers
   - This follows WAI-ARIA breadcrumb pattern
   - Ensures accessibility compliance

5. **Create ordered list container**
   - Use ol element for breadcrumb list
   - Lists maintain semantic order of navigation
   - Apply flex layout for horizontal alignment
   - Add spacing between items

6. **Implement children rendering logic**
   - Map through items array
   - Render BreadcrumbItem for each entry
   - Add BreadcrumbSeparator between items (not after last)
   - Use conditional logic to detect last item

7. **Apply component styling**
   - Use Tailwind classes for layout and spacing
   - Add text-sm for compact breadcrumb text
   - Apply text-muted-foreground for subtle appearance
   - Ensure hover states for interactive items

8. **Handle empty state**
   - Return null if items array is empty
   - Or render minimal breadcrumb with just home
   - Prevents rendering empty navigation element

### Breadcrumb Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│ <nav aria-label="Breadcrumb">                                │
│   <ol> (flex container)                                      │
│     ├── <BreadcrumbItem> Dashboard </BreadcrumbItem>         │
│     ├── <BreadcrumbSeparator />                              │
│     ├── <BreadcrumbItem> Products </BreadcrumbItem>          │
│     ├── <BreadcrumbSeparator />                              │
│     └── <BreadcrumbItem current> Electronics                 │
│   </ol>                                                       │
│ </nav>                                                        │
└─────────────────────────────────────────────────────────────┘
```

### Accessibility Requirements

| Requirement | Implementation |
|-------------|----------------|
| Semantic HTML | nav element with aria-label |
| List Structure | ol element for ordered navigation |
| Current Page | aria-current="page" on active item |
| Keyboard Navigation | Links support Tab key navigation |
| Screen Reader | Announces "Breadcrumb navigation" |

### Expected Outcome
- Breadcrumb component that renders navigation trail
- Semantic HTML structure with proper ARIA attributes
- Flexible design accepting dynamic item arrays
- Clean separation between container and item components
- Accessible to screen readers and keyboard users

### Verification Checklist
- [ ] Breadcrumb.tsx file created in correct location
- [ ] Component uses semantic nav and ol elements
- [ ] aria-label="Breadcrumb" attribute present
- [ ] Props interface includes items array
- [ ] Items render with separators between them
- [ ] Last item does not have trailing separator
- [ ] Component handles empty items array gracefully
- [ ] Styling follows design system conventions
- [ ] Component is properly typed with TypeScript

---

## Task 52: Create BreadcrumbItem Component

### Overview
Create the BreadcrumbItem component that represents individual breadcrumb entries in the navigation trail. Each item can be either a clickable link to navigate to parent pages or a static text element for the current page. The component uses proper semantic HTML (li element) and applies appropriate ARIA attributes to indicate the current page location.

### Dependencies
- Task 51: Create Breadcrumb Component

### Instructions

1. **Create BreadcrumbItem component file**
   - Create `BreadcrumbItem.tsx` in Breadcrumb directory
   - Component renders individual breadcrumb entries
   - Handles both link and non-link states

2. **Define component props interface**
   - Create BreadcrumbItemProps interface
   - Include label (string) for display text
   - Include optional href (string) for navigation
   - Include isCurrent (boolean) flag for active page
   - Add optional className for custom styling

3. **Set up list item structure**
   - Use li element as component root
   - List items maintain proper semantic structure
   - Apply inline-flex for alignment with separators

4. **Implement conditional rendering logic**
   - Check if isCurrent flag is true
   - If current page: render span with text
   - If not current: render Next.js Link component
   - Current page should not be clickable

5. **Add current page indicators**
   - Apply aria-current="page" when isCurrent is true
   - This tells screen readers the user's location
   - Add visual styling to distinguish current page
   - Use font-medium for current page emphasis

6. **Style link elements**
   - Use text-muted-foreground for non-current items
   - Add hover:text-foreground for hover effect
   - Include transition-colors for smooth state changes
   - Underline on hover for clear link indication

7. **Handle missing href safely**
   - If href is not provided and not current, render span
   - Prevents broken links or undefined hrefs
   - Gracefully degrades to non-interactive text

8. **Apply truncation for long labels**
   - Add max-width constraint if needed
   - Use text-ellipsis for overflow handling
   - Prevents layout breaking with long names
   - Add title attribute for full text on hover

### BreadcrumbItem States

```
┌─────────────────────────────────────────────────────────────┐
│ Link State (Non-current):                                    │
│   <li>                                                        │
│     <Link href="/products">                                  │
│       Products  ← (clickable, muted color, hover effect)     │
│     </Link>                                                   │
│   </li>                                                       │
├─────────────────────────────────────────────────────────────┤
│ Current State:                                                │
│   <li>                                                        │
│     <span aria-current="page">                               │
│       Category Detail  ← (not clickable, medium weight)      │
│     </span>                                                   │
│   </li>                                                       │
└─────────────────────────────────────────────────────────────┘
```

### Item Styling Matrix

| State | Text Color | Font Weight | Interactive | ARIA |
|-------|-----------|-------------|-------------|------|
| Link | muted-foreground | normal | Yes | None |
| Link Hover | foreground | normal | Yes | None |
| Current | foreground | medium | No | aria-current="page" |

### Expected Outcome
- BreadcrumbItem component rendering list items
- Links use Next.js Link for client-side navigation
- Current page shown as non-interactive text
- Proper ARIA attributes for accessibility
- Visual distinction between clickable and current items

### Verification Checklist
- [ ] BreadcrumbItem.tsx file created
- [ ] Component uses li element as root
- [ ] Conditional rendering based on isCurrent flag
- [ ] Links use Next.js Link component
- [ ] Current page has aria-current="page" attribute
- [ ] Visual styling distinguishes link vs current
- [ ] Hover effects apply to link items only
- [ ] Long text truncates appropriately
- [ ] Component properly typed with TypeScript interface

---

## Task 53: Create BreadcrumbSeparator

### Overview
Create the BreadcrumbSeparator component that renders visual separators between breadcrumb items. The separator uses a chevron icon to indicate navigation direction and is marked as decorative to hide it from screen readers. This creates a visual flow showing the hierarchy from parent to child pages without adding noise to the accessibility tree.

### Dependencies
- Task 51: Create Breadcrumb Component
- Lucide React icons library (ChevronRight icon)

### Instructions

1. **Create BreadcrumbSeparator component file**
   - Create `BreadcrumbSeparator.tsx` in Breadcrumb directory
   - Component is simple and stateless
   - No props required for basic separator

2. **Import ChevronRight icon**
   - Import ChevronRight from lucide-react
   - This provides right-pointing chevron
   - Indicates forward navigation direction
   - Consistent with UI conventions

3. **Set up separator structure**
   - Use span element as container
   - Apply inline-flex for alignment with items
   - Add horizontal padding for spacing
   - Align icon vertically with text

4. **Add aria-hidden attribute**
   - Set aria-hidden="true" on separator
   - Prevents screen readers from announcing icon
   - Separators are purely visual decoration
   - Screen readers use list structure instead

5. **Configure icon size**
   - Set icon size to 16px (h-4 w-4 in Tailwind)
   - Matches text height for alignment
   - Not too large to dominate breadcrumb
   - Maintains visual balance

6. **Apply subtle icon color**
   - Use text-muted-foreground for low emphasis
   - Separators should not draw attention
   - Maintains focus on breadcrumb labels
   - Creates cohesive visual hierarchy

7. **Consider alternative separator props**
   - Optionally accept custom icon or character
   - Allow className override for special cases
   - Keep default implementation simple
   - Support both icon and text separators

8. **Ensure consistent spacing**
   - Use mx-2 for horizontal margins (8px each side)
   - Creates balanced space around separator
   - Prevents cramped appearance
   - Aligns with design system spacing scale

### Separator Visual Representation

```
┌─────────────────────────────────────────────────────────────┐
│ Breadcrumb Flow with Separators:                             │
│                                                               │
│   Dashboard  >  Products  >  Categories  >  Electronics      │
│            ^             ^               ^                    │
│            └─────────────┴───────────────┘                    │
│              BreadcrumbSeparator (aria-hidden)                │
│                                                               │
│ Screen Reader Experience:                                     │
│   "Breadcrumb navigation"                                     │
│   "Link: Dashboard"                                           │
│   "Link: Products"                                            │
│   "Link: Categories"                                          │
│   "Electronics, current page"                                 │
│   (Separators are not announced)                              │
└─────────────────────────────────────────────────────────────┘
```

### Separator Design Options

| Option | Icon/Character | Use Case |
|--------|----------------|----------|
| Chevron | > (ChevronRight) | Default, clear direction |
| Slash | / | Alternative, compact |
| Dot | • | Minimalist style |
| Arrow | → | Explicit direction |

### Expected Outcome
- BreadcrumbSeparator component with chevron icon
- Component hidden from screen readers with aria-hidden
- Proper sizing and spacing for visual alignment
- Subtle styling that doesn't compete with labels
- Reusable component for consistent separator appearance

### Verification Checklist
- [ ] BreadcrumbSeparator.tsx file created
- [ ] ChevronRight icon imported from lucide-react
- [ ] aria-hidden="true" attribute applied
- [ ] Icon size is 16px (h-4 w-4)
- [ ] Muted color applied to icon
- [ ] Horizontal margins provide adequate spacing
- [ ] Separator aligns vertically with breadcrumb text
- [ ] Component renders correctly between items
- [ ] Visual appearance matches design system

---

## Task 54: Create useBreadcrumbs Hook

### Overview
Create the useBreadcrumbs custom hook that automatically generates breadcrumb data from the current route. This hook analyzes the URL pathname, splits it into segments, maps each segment to a human-readable label using a route mapping configuration, and handles dynamic route parameters. The hook provides the complete breadcrumb trail as an array of items ready for rendering, making breadcrumb integration seamless across all pages.

### Dependencies
- Task 55: Define Route-to-Breadcrumb Mapping (can develop in parallel)
- Next.js navigation hooks (usePathname, useParams)

### Instructions

1. **Create hook file**
   - Create `useBreadcrumbs.ts` in `frontend/hooks/` directory
   - Export named function useBreadcrumbs
   - Hook returns array of breadcrumb items
   - Uses TypeScript for type safety

2. **Define breadcrumb item type**
   - Create BreadcrumbItem interface
   - Include label (string) for display text
   - Include href (string) for navigation path
   - Include isCurrent (boolean) for active page
   - Export type for use in components

3. **Import Next.js navigation hooks**
   - Import usePathname from next/navigation
   - Import useParams from next/navigation
   - These provide current route information
   - Work in both client and server components

4. **Import route mapping configuration**
   - Import routeToLabelMap from lib/navigation
   - This maps route segments to display labels
   - Provides default labels for all routes
   - Handled in Task 55

5. **Get current pathname and params**
   - Call usePathname to get full path
   - Call useParams to get dynamic segments
   - Example: /products/categories/[id] returns id value
   - Store in hook scope for processing

6. **Split pathname into segments**
   - Remove leading slash and split by "/"
   - Filter out empty strings from split
   - Example: "/dashboard/products/123" → ["dashboard", "products", "123"]
   - Store segments array for mapping

7. **Build breadcrumb path iteratively**
   - Initialize empty breadcrumbs array
   - Loop through each segment with index
   - Build cumulative path for each segment
   - Example: "dashboard", "dashboard/products", "dashboard/products/123"

8. **Map segments to labels**
   - For each segment, check route mapping
   - Use mapped label if available
   - Fall back to capitalized segment if no mapping
   - Handle dynamic segments (checked in params object)

9. **Determine current page**
   - Last breadcrumb in array is current page
   - Set isCurrent to true for last item
   - Set isCurrent to false for all others
   - Current page is not a link

10. **Handle dynamic route segments**
    - Check if segment matches dynamic pattern (e.g., numeric ID)
    - If dynamic, attempt to fetch display name
    - Use placeholder while loading
    - Fall back to segment value if fetch fails
    - Details in Task 56

11. **Add home/dashboard breadcrumb**
    - Always prepend dashboard as first item
    - Provides consistent starting point
    - Links to /dashboard route
    - User can always return to main dashboard

12. **Return breadcrumb array**
    - Return array of BreadcrumbItem objects
    - Each item has label, href, and isCurrent
    - Array is ready for rendering in Breadcrumb component
    - Hook updates when route changes

### Breadcrumb Generation Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Route: /dashboard/products/categories/123                    │
│                                                               │
│ Step 1: Split Pathname                                       │
│   → ["dashboard", "products", "categories", "123"]           │
│                                                               │
│ Step 2: Build Paths                                          │
│   → /dashboard                                               │
│   → /dashboard/products                                      │
│   → /dashboard/products/categories                           │
│   → /dashboard/products/categories/123                       │
│                                                               │
│ Step 3: Map to Labels                                        │
│   "dashboard"   → "Dashboard"     (from routeToLabelMap)     │
│   "products"    → "Products"      (from routeToLabelMap)     │
│   "categories"  → "Categories"    (from routeToLabelMap)     │
│   "123"         → "Electronics"   (from API/cache)           │
│                                                               │
│ Step 4: Mark Current                                         │
│   Last item → isCurrent: true                                │
│   Others    → isCurrent: false                               │
│                                                               │
│ Step 5: Return Array                                         │
│   [                                                           │
│     { label: "Dashboard", href: "/dashboard", ... },         │
│     { label: "Products", href: ".../products", ... },        │
│     { label: "Categories", href: ".../categories", ... },    │
│     { label: "Electronics", href: "...", isCurrent: true }   │
│   ]                                                           │
└─────────────────────────────────────────────────────────────┘
```

### Hook Usage Pattern

| Hook Input | Processing | Output |
|------------|------------|--------|
| pathname: "/dashboard" | Single segment | [Dashboard] |
| pathname: "/products" | Map to label | [Dashboard > Products] |
| pathname: "/products/123" | Dynamic segment | [Dashboard > Products > Product Name] |
| pathname: "/products/categories/new" | Static segments | [Dashboard > Products > Categories > New] |

### Expected Outcome
- useBreadcrumbs hook that generates breadcrumb data
- Automatic pathname analysis and segment extraction
- Route-to-label mapping using configuration
- Dynamic segment handling for resource names
- Returns array ready for Breadcrumb component
- Updates automatically when route changes

### Verification Checklist
- [ ] useBreadcrumbs.ts file created in hooks directory
- [ ] BreadcrumbItem interface defined and exported
- [ ] Hook uses usePathname and useParams
- [ ] Pathname correctly split into segments
- [ ] Segments mapped to labels using configuration
- [ ] Cumulative paths built for each segment
- [ ] Current page marked with isCurrent flag
- [ ] Dashboard prepended as first breadcrumb
- [ ] Return type correctly typed as BreadcrumbItem array
- [ ] Hook handles edge cases (empty path, single segment)

---

## Task 55: Define Route-to-Breadcrumb Mapping

### Overview
Create a comprehensive route mapping configuration that translates route segments to human-readable breadcrumb labels. This mapping ensures consistent labeling across the application, handles nested routes, supports both static and dynamic segments, and provides a centralized location for managing breadcrumb display text. The mapping covers all major sections of the ERP system including products, inventory, sales, customers, vendors, HR, and settings.

### Dependencies
- None (foundational configuration)

### Instructions

1. **Create navigation utilities file**
   - Create `navigation.ts` in `frontend/lib/` directory
   - This file contains route mapping and utilities
   - Centralized location for navigation configuration
   - Easily maintainable and extensible

2. **Define route label map type**
   - Create type RouteToLabelMap as Record<string, string>
   - Keys are route segments (lowercase)
   - Values are display labels (title case)
   - TypeScript ensures type safety

3. **Map dashboard routes**
   - "dashboard" → "Dashboard"
   - Main entry point for all pages
   - Appears as first breadcrumb on all pages

4. **Map product management routes**
   - "products" → "Products"
   - "categories" → "Categories"
   - "attributes" → "Attributes"
   - "variants" → "Variants"
   - Covers product catalog structure

5. **Map inventory routes**
   - "inventory" → "Inventory"
   - "warehouses" → "Warehouses"
   - "stock-movements" → "Stock Movements"
   - "adjustments" → "Adjustments"
   - "transfers" → "Transfers"
   - Complete inventory management paths

6. **Map sales and orders routes**
   - "sales" → "Sales"
   - "orders" → "Orders"
   - "invoices" → "Invoices"
   - "quotations" → "Quotations"
   - "returns" → "Returns"
   - Sales process navigation

7. **Map POS routes**
   - "pos" → "Point of Sale"
   - "sessions" → "Sessions"
   - "transactions" → "Transactions"
   - "receipts" → "Receipts"
   - Point of sale interface paths

8. **Map customer and vendor routes**
   - "customers" → "Customers"
   - "vendors" → "Vendors"
   - "contacts" → "Contacts"
   - "leads" → "Leads"
   - CRM section navigation

9. **Map HR and payroll routes**
   - "hr" → "Human Resources"
   - "employees" → "Employees"
   - "departments" → "Departments"
   - "attendance" → "Attendance"
   - "payroll" → "Payroll"
   - "leaves" → "Leave Management"
   - HR module structure

10. **Map settings routes**
    - "settings" → "Settings"
    - "profile" → "Profile"
    - "company" → "Company Settings"
    - "users" → "User Management"
    - "roles" → "Roles & Permissions"
    - "integrations" → "Integrations"
    - Configuration areas

11. **Map common action routes**
    - "new" → "New"
    - "edit" → "Edit"
    - "view" → "View"
    - "details" → "Details"
    - Standard CRUD operations

12. **Export route map**
    - Export routeToLabelMap constant
    - Make available for useBreadcrumbs hook
    - Allow other components to use mapping
    - Single source of truth for labels

13. **Add helper function for unmapped segments**
    - Create getRouteLabel function
    - Accepts segment string
    - Returns mapped label or formatted segment
    - Handles edge cases gracefully

14. **Handle special characters in segments**
    - Replace hyphens with spaces
    - Capitalize each word
    - Example: "stock-movements" → "Stock Movements"
    - Fallback for unmapped routes

### Route Mapping Structure

```
┌─────────────────────────────────────────────────────────────┐
│ Route Segment Mapping (routeToLabelMap)                      │
│                                                               │
│ Core Navigation:                                              │
│   "dashboard"        → "Dashboard"                           │
│                                                               │
│ Product Management:                                           │
│   "products"         → "Products"                            │
│   "categories"       → "Categories"                          │
│   "attributes"       → "Attributes"                          │
│                                                               │
│ Inventory:                                                    │
│   "inventory"        → "Inventory"                           │
│   "warehouses"       → "Warehouses"                          │
│   "stock-movements"  → "Stock Movements"                     │
│                                                               │
│ Sales:                                                        │
│   "sales"            → "Sales"                               │
│   "orders"           → "Orders"                              │
│   "invoices"         → "Invoices"                            │
│                                                               │
│ CRM:                                                          │
│   "customers"        → "Customers"                           │
│   "vendors"          → "Vendors"                             │
│                                                               │
│ HR:                                                           │
│   "hr"               → "Human Resources"                     │
│   "employees"        → "Employees"                           │
│   "payroll"          → "Payroll"                             │
│                                                               │
│ Settings:                                                     │
│   "settings"         → "Settings"                            │
│   "users"            → "User Management"                     │
│   "roles"            → "Roles & Permissions"                 │
│                                                               │
│ Actions:                                                      │
│   "new"              → "New"                                 │
│   "edit"             → "Edit"                                │
│   "view"             → "View"                                │
└─────────────────────────────────────────────────────────────┘
```

### Mapping Coverage Matrix

| Module | Segments Mapped | Example Path | Example Breadcrumb |
|--------|----------------|--------------|-------------------|
| Products | 4 | /products/categories | Dashboard > Products > Categories |
| Inventory | 5 | /inventory/warehouses | Dashboard > Inventory > Warehouses |
| Sales | 5 | /sales/orders/new | Dashboard > Sales > Orders > New |
| POS | 4 | /pos/sessions | Dashboard > Point of Sale > Sessions |
| Customers | 4 | /customers/leads | Dashboard > Customers > Leads |
| HR | 6 | /hr/employees/123 | Dashboard > HR > Employees > [Name] |
| Settings | 6 | /settings/roles | Dashboard > Settings > Roles & Permissions |

### Expected Outcome
- Comprehensive route-to-label mapping configuration
- All major ERP modules covered
- Consistent label formatting across application
- Helper function for unmapped segments
- Single source of truth for breadcrumb labels
- Easy to extend with new routes

### Verification Checklist
- [ ] navigation.ts file created in lib directory
- [ ] RouteToLabelMap type defined
- [ ] routeToLabelMap constant exported
- [ ] Dashboard route mapped
- [ ] All product management routes mapped
- [ ] Inventory management routes mapped
- [ ] Sales and orders routes mapped
- [ ] POS routes mapped
- [ ] Customer and vendor routes mapped
- [ ] HR and payroll routes mapped
- [ ] Settings routes mapped
- [ ] Common action routes (new, edit, view) mapped
- [ ] getRouteLabel helper function created
- [ ] Function handles unmapped segments gracefully

---

## Task 56: Handle Dynamic Route Segments

### Overview
Implement logic to handle dynamic route segments in breadcrumbs by fetching and displaying actual resource names instead of IDs or slugs. This enhancement makes breadcrumbs more meaningful by showing "Electronics" instead of "123", or "John Doe" instead of "emp_456". The system identifies dynamic segments, fetches resource data from APIs or cache, handles loading states, and falls back gracefully when data is unavailable.

### Dependencies
- Task 54: Create useBreadcrumbs Hook
- Task 55: Define Route-to-Breadcrumb Mapping
- SubPhase-04: API Client Layer (data fetching)

### Instructions

1. **Identify dynamic segment patterns**
   - Numeric IDs: segments that are pure numbers
   - UUID patterns: segments matching UUID format
   - Slug patterns: segments with specific slug format
   - Prefixed IDs: segments like "prod_123" or "emp_456"
   - Use regex to detect each pattern

2. **Create dynamic segment detection function**
   - Add isDynamicSegment function to navigation.ts
   - Check segment against known patterns
   - Return boolean indicating if dynamic
   - Use in useBreadcrumbs hook

3. **Map segments to resource types**
   - Determine resource type from parent segment
   - Example: /products/123 → product resource
   - Example: /customers/456 → customer resource
   - Create resourceTypeMap in navigation.ts

4. **Create resource label fetcher**
   - Add getResourceLabel async function
   - Accepts resource type and ID
   - Returns display name for resource
   - Handles multiple resource types

5. **Implement product name fetching**
   - For product IDs, call products API
   - Extract product name from response
   - Cache result to avoid repeated calls
   - Example: ID "123" → "Wireless Mouse"

6. **Implement category name fetching**
   - For category IDs, call categories API
   - Use category hierarchy for context
   - Return category name
   - Example: ID "cat_5" → "Electronics"

7. **Implement customer name fetching**
   - For customer IDs, fetch customer data
   - Format as "Customer Name"
   - Handle both individual and company names
   - Example: ID "cust_789" → "Acme Corp"

8. **Implement employee name fetching**
   - For employee IDs, fetch employee data
   - Format as "First Last" or display name
   - Respect privacy settings if applicable
   - Example: ID "emp_101" → "John Smith"

9. **Implement order number fetching**
   - For order IDs, fetch order data
   - Display order number instead of ID
   - Example: ID "ord_555" → "Order #ORD-2024-555"

10. **Add loading state handling**
    - Show placeholder while fetching
    - Use loading indicator or skeleton
    - Don't block breadcrumb rendering
    - Example: "Loading..." or "..."

11. **Implement caching strategy**
    - Use React Query or SWR for caching
    - Cache fetched names to reduce API calls
    - Set appropriate cache duration
    - Invalidate on resource updates

12. **Add error handling**
    - Catch failed API requests
    - Fall back to showing ID
    - Log errors for debugging
    - Don't break breadcrumb rendering

13. **Handle special action segments**
    - Skip fetching for "new", "edit", "view"
    - These are static action indicators
    - No API call needed
    - Use mapped labels directly

14. **Optimize performance**
    - Fetch only necessary data (name field)
    - Use parallel requests if multiple dynamic segments
    - Implement request deduplication
    - Consider prefetching on navigation

### Dynamic Segment Resolution Flow

```
┌─────────────────────────────────────────────────────────────┐
│ Route: /products/categories/cat_123                          │
│                                                               │
│ Segment Analysis:                                             │
│   "products"    → Static, use routeToLabelMap               │
│   "categories"  → Static, use routeToLabelMap               │
│   "cat_123"     → Dynamic, prefixed ID pattern              │
│                                                               │
│ Dynamic Segment Resolution:                                   │
│   Step 1: Detect Pattern                                     │
│     ✓ Matches /^cat_\d+$/ regex                             │
│     → Identified as category ID                              │
│                                                               │
│   Step 2: Determine Resource Type                            │
│     Parent segment: "categories"                             │
│     → Resource type: "category"                              │
│                                                               │
│   Step 3: Fetch Resource Data                                │
│     API Call: GET /api/categories/cat_123                    │
│     Response: { id: "cat_123", name: "Electronics", ... }    │
│                                                               │
│   Step 4: Extract Display Name                               │
│     Use "name" field from response                           │
│     → Label: "Electronics"                                   │
│                                                               │
│   Step 5: Cache Result                                       │
│     Store in cache: "cat_123" → "Electronics"               │
│     Duration: 5 minutes                                      │
│                                                               │
│   Step 6: Render Breadcrumb                                  │
│     Final: Dashboard > Products > Categories > Electronics   │
└─────────────────────────────────────────────────────────────┘
```

### Resource Type Mapping

| Parent Segment | Resource Type | API Endpoint | Name Field |
|----------------|---------------|--------------|-----------|
| products | product | /api/products/:id | name |
| categories | category | /api/categories/:id | name |
| customers | customer | /api/customers/:id | full_name |
| vendors | vendor | /api/vendors/:id | company_name |
| employees | employee | /api/employees/:id | display_name |
| orders | order | /api/orders/:id | order_number |
| warehouses | warehouse | /api/warehouses/:id | name |
| invoices | invoice | /api/invoices/:id | invoice_number |

### Loading States

```
┌─────────────────────────────────────────────────────────────┐
│ Initial Load (before fetch):                                 │
│   Dashboard > Products > Categories > ...                    │
│                                                               │
│ Loading State (during fetch):                                │
│   Dashboard > Products > Categories > Loading...             │
│                                                               │
│ Loaded State (after fetch):                                  │
│   Dashboard > Products > Categories > Electronics            │
│                                                               │
│ Error State (fetch failed):                                  │
│   Dashboard > Products > Categories > cat_123                │
│   (Falls back to showing ID)                                 │
└─────────────────────────────────────────────────────────────┘
```

### Expected Outcome
- Dynamic segments resolved to meaningful names
- Resource names fetched from appropriate APIs
- Caching implemented to reduce redundant requests
- Loading and error states handled gracefully
- Multiple resource types supported
- Performance optimized with minimal API calls

### Verification Checklist
- [ ] isDynamicSegment function detects ID patterns
- [ ] resourceTypeMap created in navigation.ts
- [ ] getResourceLabel function implemented
- [ ] Product name fetching works
- [ ] Category name fetching works
- [ ] Customer name fetching works
- [ ] Employee name fetching works
- [ ] Order number fetching works
- [ ] Loading state displays while fetching
- [ ] Caching strategy implemented
- [ ] Error handling falls back to ID
- [ ] Static action segments skipped
- [ ] Performance optimized with caching
- [ ] Multiple dynamic segments handled correctly

---

## Task 57: Add Breadcrumb to Page Container

### Overview
Integrate the Breadcrumb component into the page layout system to display navigation trails on all dashboard pages. This task creates a consistent page structure with breadcrumbs appearing at the top of the content area, below the header, and above the page content. The integration uses the useBreadcrumbs hook to automatically generate breadcrumb data based on the current route.

### Dependencies
- Task 51: Create Breadcrumb Component
- Task 54: Create useBreadcrumbs Hook
- SubPhase-07, Group-A: Dashboard Layout (page container structure)

### Instructions

1. **Locate dashboard layout file**
   - Navigate to `frontend/app/(dashboard)/layout.tsx`
   - This is the root layout for all dashboard pages
   - Contains main page structure and navigation

2. **Import Breadcrumb component**
   - Import Breadcrumb from components/layout/Breadcrumb
   - Import useBreadcrumbs hook
   - Ensure imports are properly typed

3. **Call useBreadcrumbs hook**
   - Invoke hook at component top level
   - Store result in breadcrumbItems variable
   - Hook automatically updates on route changes

4. **Identify content area location**
   - Find main content section in layout
   - Breadcrumb should appear after header
   - Place before page-specific content
   - Maintain existing spacing and structure

5. **Add breadcrumb container**
   - Create div or section for breadcrumb
   - Apply appropriate wrapper classes
   - Use consistent padding with page layout
   - Example: px-6 py-3 or similar spacing

6. **Render Breadcrumb component**
   - Pass breadcrumbItems to Breadcrumb component
   - Component handles all rendering logic
   - Breadcrumb appears on all dashboard pages

7. **Apply responsive spacing**
   - Adjust padding for mobile devices
   - Ensure breadcrumb doesn't overflow
   - Use responsive Tailwind classes
   - Example: px-4 md:px-6 for mobile/desktop

8. **Add visual separation**
   - Optional: add border-bottom to breadcrumb area
   - Creates visual separation from content
   - Use subtle border color (border-border)
   - Maintains clean page structure

9. **Handle breadcrumb visibility**
   - Consider hiding breadcrumb on very specific pages
   - Dashboard home might not need breadcrumbs
   - Use conditional rendering if needed
   - Most pages should show breadcrumbs

10. **Test on multiple pages**
    - Navigate to different routes
    - Verify breadcrumbs update correctly
    - Check spacing and alignment
    - Ensure responsive behavior works

11. **Position relative to page header**
    - If page has PageHeader component (Task 58)
    - Breadcrumb should appear above PageHeader
    - Creates logical hierarchy: Breadcrumb → Title → Content
    - Maintain consistent vertical rhythm

12. **Consider sticky breadcrumb**
    - Optionally make breadcrumb sticky on scroll
    - Add position-sticky and top-0
    - Keeps navigation accessible on long pages
    - Add background to sticky breadcrumb

### Page Layout Structure with Breadcrumb

```
┌─────────────────────────────────────────────────────────────┐
│ ┌───────────────────────────────────────────────────────┐   │
│ │                    HEADER / TOPBAR                    │   │
│ │  (Logo, Search, Notifications, User Menu)             │   │
│ └───────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│ ┌────┬────────────────────────────────────────────────┐     │
│ │    │  ┌──────────────────────────────────────────┐  │     │
│ │    │  │ BREADCRUMB                                │  │     │
│ │ S  │  │ Dashboard > Products > Categories        │  │     │
│ │ I  │  └──────────────────────────────────────────┘  │     │
│ │ D  │  ┌──────────────────────────────────────────┐  │     │
│ │ E  │  │ PAGE HEADER                               │  │     │
│ │ B  │  │ [Title]                    [Action Btns]  │  │     │
│ │ A  │  └──────────────────────────────────────────┘  │     │
│ │ R  │  ┌──────────────────────────────────────────┐  │     │
│ │    │  │                                           │  │     │
│ │    │  │ PAGE CONTENT                              │  │     │
│ │    │  │                                           │  │     │
│ │    │  │                                           │  │     │
│ │    │  └──────────────────────────────────────────┘  │     │
│ └────┴────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

### Layout Integration Points

| Element | Position | Spacing | Behavior |
|---------|----------|---------|----------|
| Header | Top fixed | N/A | Always visible |
| Sidebar | Left fixed | N/A | Collapsible |
| Breadcrumb | Top of content | py-3 px-6 | Updates per route |
| Page Header | Below breadcrumb | pt-0 px-6 | Page-specific |
| Content | Main area | p-6 | Scrollable |

### Expected Outcome
- Breadcrumb component integrated into dashboard layout
- Breadcrumbs appear on all dashboard pages automatically
- Proper spacing and alignment with page structure
- Responsive design works on all screen sizes
- Breadcrumbs update when navigation occurs

### Verification Checklist
- [ ] Breadcrumb component imported in layout file
- [ ] useBreadcrumbs hook called in layout
- [ ] Breadcrumb renders in correct position
- [ ] Breadcrumb appears after header
- [ ] Breadcrumb appears before page content
- [ ] Proper spacing applied (px-6 py-3 or similar)
- [ ] Responsive spacing works on mobile
- [ ] Breadcrumbs update on route changes
- [ ] Visual separation from content (optional border)
- [ ] Layout tested on multiple pages
- [ ] No layout shift or overflow issues

---

## Task 58: Create Page Header Component

### Overview
Create a reusable PageHeader component that provides a consistent header section for all dashboard pages. The component displays a page title, optional subtitle or description, and action buttons aligned to the right. This creates a standardized page structure where every page has a clear title and relevant actions (like "Add New", "Export", "Settings") positioned consistently, improving the user experience and interface coherence.

### Dependencies
- SubPhase-02: Tailwind Design System
- SubPhase-03: Component Library Setup (Button components)

### Instructions

1. **Create Page directory structure**
   - Navigate to `frontend/components/layout/` directory
   - Create new directory named `Page`
   - Organizes page-related layout components
   - Keeps structure clean and discoverable

2. **Create PageHeader component file**
   - Create `PageHeader.tsx` in Page directory
   - This is main page header component
   - Uses TypeScript for type safety

3. **Define component props interface**
   - Create PageHeaderProps interface
   - Include title (string, required) for main heading
   - Include optional subtitle or description (string)
   - Include optional children for action buttons
   - Include optional className for customization

4. **Set up header container structure**
   - Use header element as semantic container
   - Apply flex layout for title/actions alignment
   - Use items-center for vertical alignment
   - Add justify-between to space title and actions

5. **Create title section**
   - Use div to group title and subtitle
   - Keeps text content grouped on left
   - Allows actions to align right

6. **Render page title**
   - Use h1 element for main title
   - Apply text-3xl font-bold for prominence
   - Use text-foreground for proper color
   - Maintains heading hierarchy

7. **Render optional subtitle**
   - Check if subtitle prop provided
   - Use p element with text-muted-foreground
   - Apply text-sm for smaller size
   - Add mt-1 for spacing from title

8. **Create actions section**
   - Use div to contain action elements
   - Apply flex layout for button grouping
   - Add gap-2 for spacing between buttons
   - Items-center for vertical alignment

9. **Render children as actions**
   - Render children prop in actions section
   - Children typically contains buttons
   - Example: "Add Product", "Export", "Filter"
   - Allows flexible action composition

10. **Apply responsive design**
    - Stack title and actions on mobile
    - Use flex-col on small screens
    - Switch to flex-row on medium+ screens
    - Adjust spacing and alignment per breakpoint

11. **Add bottom spacing**
    - Apply mb-6 or pb-6 to header
    - Creates separation from page content
    - Maintains consistent vertical rhythm
    - Optional bottom border for visual separation

12. **Handle long titles**
    - Add truncate class to title if needed
    - Prevents layout breaking with long text
    - Consider wrapping instead of truncating
    - Test with realistic content lengths

13. **Create index barrel export**
    - Create `index.ts` in Page directory
    - Export PageHeader component
    - Simplifies imports in consuming components

### PageHeader Component Structure

```
┌─────────────────────────────────────────────────────────────┐
│ <header> (flex, justify-between, items-center)               │
│   ┌──────────────────────────────┐ ┌──────────────────────┐ │
│   │ <div> (title section)        │ │ <div> (actions)      │ │
│   │   <h1>Product Categories</h1>│ │   [Add Category]     │ │
│   │   <p>Manage your product    │ │   [Import]           │ │
│   │      category hierarchy</p>  │ │   [Export]           │ │
│   └──────────────────────────────┘ └──────────────────────┘ │
│ </header>                                                     │
└─────────────────────────────────────────────────────────────┘
```

### Responsive Layout Behavior

```
┌─────────────────────────────────────────────────────────────┐
│ Desktop (md and up):                                          │
│   ┌────────────────────────────────────────────────────┐    │
│   │ [Title + Subtitle]            [Button] [Button]    │    │
│   └────────────────────────────────────────────────────┘    │
│                                                               │
│ Mobile (sm and below):                                        │
│   ┌────────────────────────────────────────────────────┐    │
│   │ [Title + Subtitle]                                 │    │
│   │ [Button] [Button]                                  │    │
│   └────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

### PageHeader Usage Examples

| Page | Title | Subtitle | Actions |
|------|-------|----------|---------|
| Products List | "Products" | "Manage your product catalog" | [Add Product] [Import] [Export] |
| Product Detail | "Wireless Mouse" | "SKU: WM-001" | [Edit] [Delete] [Duplicate] |
| Categories | "Product Categories" | "Organize products into categories" | [Add Category] [Bulk Edit] |
| Orders | "Sales Orders" | "View and manage customer orders" | [New Order] [Export] [Filter] |
| Settings | "Settings" | "Configure your ERP system" | [Save Changes] |

### Styling Customization Options

| Prop | Purpose | Example |
|------|---------|---------|
| className | Override container styles | "bg-card p-4 rounded-lg" |
| title | Main heading text | "Product Management" |
| subtitle | Supporting description | "Add and organize products" |
| children | Action buttons/elements | <Button>Add New</Button> |

### Expected Outcome
- Reusable PageHeader component for consistent page structure
- Flex layout with title on left, actions on right
- Optional subtitle for additional context
- Responsive design stacking on mobile
- Clean separation between title and actions
- Easy to use with flexible action composition

### Verification Checklist
- [ ] PageHeader.tsx file created in Page directory
- [ ] PageHeaderProps interface defined
- [ ] Component uses header semantic element
- [ ] Title renders as h1 element
- [ ] Subtitle renders conditionally when provided
- [ ] Actions section accepts children prop
- [ ] Flex layout aligns title and actions correctly
- [ ] Responsive design works on mobile and desktop
- [ ] Bottom spacing separates header from content
- [ ] Long titles handled gracefully
- [ ] index.ts barrel export created
- [ ] Component properly typed with TypeScript
- [ ] Styling follows design system conventions
- [ ] Component tested with various content combinations

---

## Final Integration and Testing

### Complete Breadcrumb System Flow

```
┌─────────────────────────────────────────────────────────────┐
│ User navigates to: /dashboard/products/categories/123        │
│                                                               │
│ 1. Next.js Router updates pathname                           │
│                                                               │
│ 2. Dashboard Layout re-renders                               │
│    └─> useBreadcrumbs hook executes                         │
│        ├─> Gets pathname: "/dashboard/products/categories... │
│        ├─> Splits into segments                              │
│        ├─> Maps "dashboard" → "Dashboard"                    │
│        ├─> Maps "products" → "Products"                      │
│        ├─> Maps "categories" → "Categories"                  │
│        ├─> Detects "123" as dynamic                          │
│        ├─> Fetches category name → "Electronics"            │
│        └─> Returns breadcrumb items array                    │
│                                                               │
│ 3. Breadcrumb component renders                              │
│    <nav aria-label="Breadcrumb">                             │
│      <ol>                                                     │
│        <BreadcrumbItem href="/dashboard">                    │
│          Dashboard                                            │
│        </BreadcrumbItem>                                      │
│        <BreadcrumbSeparator />                               │
│        <BreadcrumbItem href="/dashboard/products">           │
│          Products                                             │
│        </BreadcrumbItem>                                      │
│        <BreadcrumbSeparator />                               │
│        <BreadcrumbItem href=".../categories">                │
│          Categories                                           │
│        </BreadcrumbItem>                                      │
│        <BreadcrumbSeparator />                               │
│        <BreadcrumbItem isCurrent>                            │
│          Electronics                                          │
│        </BreadcrumbItem>                                      │
│      </ol>                                                    │
│    </nav>                                                     │
│                                                               │
│ 4. PageHeader renders below breadcrumb                       │
│    <header>                                                   │
│      <h1>Electronics</h1>                                    │
│      <p>Category details and products</p>                    │
│      [Edit] [Delete] buttons                                 │
│    </header>                                                  │
└─────────────────────────────────────────────────────────────┘
```

### Component Interaction Matrix

| Component | Depends On | Provides | Used By |
|-----------|-----------|----------|---------|
| Breadcrumb | BreadcrumbItem, BreadcrumbSeparator | Navigation trail container | Dashboard Layout |
| BreadcrumbItem | Next.js Link | Individual breadcrumb entry | Breadcrumb |
| BreadcrumbSeparator | Lucide icons | Visual separator | Breadcrumb |
| useBreadcrumbs | routeToLabelMap, getResourceLabel | Breadcrumb items array | Dashboard Layout |
| routeToLabelMap | None | Route label mapping | useBreadcrumbs |
| getResourceLabel | API client | Resource names | useBreadcrumbs |
| PageHeader | None | Page title/actions layout | Individual pages |

### System-Wide Testing Checklist

#### Breadcrumb Functionality
- [ ] Breadcrumbs appear on all dashboard pages
- [ ] Home/Dashboard always appears as first item
- [ ] Static routes map to correct labels
- [ ] Dynamic segments fetch correct names
- [ ] Current page marked appropriately (not a link)
- [ ] Separators appear between items (not at end)
- [ ] Clicking breadcrumb navigates correctly
- [ ] Breadcrumbs update on route change

#### Accessibility Testing
- [ ] nav element has aria-label="Breadcrumb"
- [ ] Breadcrumb uses ol element structure
- [ ] Current page has aria-current="page"
- [ ] Separators have aria-hidden="true"
- [ ] Keyboard navigation works (Tab through links)
- [ ] Screen reader announces breadcrumb trail correctly
- [ ] Focus indicators visible on all links

#### Dynamic Segments
- [ ] Product IDs resolve to product names
- [ ] Category IDs resolve to category names
- [ ] Customer IDs resolve to customer names
- [ ] Employee IDs resolve to employee names
- [ ] Order IDs resolve to order numbers
- [ ] Loading state shows during fetch
- [ ] Error state falls back to showing ID
- [ ] Cached names don't refetch unnecessarily

#### Route Coverage
- [ ] Dashboard route works
- [ ] Product routes work
- [ ] Inventory routes work
- [ ] Sales routes work
- [ ] POS routes work
- [ ] Customer routes work
- [ ] Vendor routes work
- [ ] HR routes work
- [ ] Settings routes work
- [ ] Nested routes work (3+ levels)

#### PageHeader Integration
- [ ] PageHeader renders on all pages
- [ ] Title displays correctly
- [ ] Subtitle displays when provided
- [ ] Action buttons render in correct position
- [ ] Layout responsive on mobile
- [ ] Spacing consistent across pages
- [ ] Long titles handled properly

#### Visual and UX
- [ ] Breadcrumb spacing consistent with design
- [ ] Text sizes appropriate and readable
- [ ] Colors match design system (muted/foreground)
- [ ] Hover states work on links
- [ ] Mobile layout doesn't overflow
- [ ] PageHeader aligns with breadcrumb
- [ ] Overall page hierarchy clear and logical

#### Performance
- [ ] No unnecessary API calls for static routes
- [ ] Dynamic segment names cached appropriately
- [ ] Page loads don't block on breadcrumb fetch
- [ ] No layout shift when breadcrumb loads
- [ ] Component re-renders optimized
- [ ] Large breadcrumb trails (5+ items) perform well

### Documentation Updates Required

After completing all tasks:

1. **Update Component Documentation**
   - Document Breadcrumb component API
   - Document PageHeader component API
   - Document useBreadcrumbs hook usage
   - Add examples to component library docs

2. **Update Navigation Configuration Docs**
   - Document route mapping structure
   - Explain how to add new routes
   - Document dynamic segment handling
   - Provide troubleshooting guide

3. **Update Page Layout Guidelines**
   - Document standard page structure
   - Show breadcrumb + PageHeader pattern
   - Provide page layout examples
   - Document responsive behavior

4. **Create Developer Guide**
   - How to extend route mappings
   - How to add new resource types
   - How to customize breadcrumb appearance
   - How to handle edge cases

---

## Summary

This document covered the complete implementation of breadcrumb navigation and page header components, creating a cohesive page layout system. The breadcrumb system automatically generates navigation trails from routes, intelligently handles dynamic segments by fetching resource names, and integrates seamlessly with the page layout. The PageHeader component provides consistent page structure with titles and actions across all dashboard pages.

### Key Deliverables

1. **Breadcrumb Component** - Main container with semantic HTML and ARIA labels
2. **BreadcrumbItem Component** - Individual items with link/current state handling
3. **BreadcrumbSeparator Component** - Visual separators hidden from screen readers
4. **useBreadcrumbs Hook** - Automatic breadcrumb generation from routes
5. **Route Mapping Configuration** - Comprehensive route-to-label mapping
6. **Dynamic Segment Handling** - Fetch and display resource names instead of IDs
7. **Layout Integration** - Breadcrumbs in dashboard layout
8. **PageHeader Component** - Consistent page title and action layout

### Implementation Priority

1. **Phase 1** - Core Components (Tasks 51-53)
   - Build Breadcrumb, BreadcrumbItem, BreadcrumbSeparator
   - Test rendering and styling
   - Verify accessibility

2. **Phase 2** - Route Mapping (Task 55)
   - Define comprehensive route mappings
   - Create helper functions
   - Document mapping structure

3. **Phase 3** - Hook Implementation (Task 54)
   - Build useBreadcrumbs hook
   - Integrate route mapping
   - Test on various routes

4. **Phase 4** - Dynamic Segments (Task 56)
   - Implement resource name fetching
   - Add caching strategy
   - Handle loading and error states

5. **Phase 5** - Integration (Tasks 57-58)
   - Add breadcrumb to layout
   - Create PageHeader component
   - Test complete system

### Success Criteria

- ✓ Breadcrumbs appear on all dashboard pages automatically
- ✓ Navigation trails accurately reflect page hierarchy
- ✓ Dynamic segments display meaningful names, not IDs
- ✓ Accessibility standards fully met (WCAG AA)
- ✓ Performance optimized with caching and minimal API calls
- ✓ PageHeader provides consistent page structure
- ✓ Responsive design works on all screen sizes
- ✓ Code is maintainable and well-documented

---

**Document Completion:** 8 of 8 tasks documented (100%)  
**Estimated Total Implementation Time:** 4 hours 10 minutes  
**Next Steps:** Proceed with implementation starting with core components, then route mapping, hook implementation, dynamic segment handling, and finally integration and testing.
