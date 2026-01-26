# Tasks 01-07: Product Routes & Pages Structure

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** A - Product Routes & Pages Structure  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-08-14_Category-Routes-States.md](02_Tasks-08-14_Category-Routes-States.md)

---

## Document Overview

This document covers the creation of the product management route structure with all primary product pages. It establishes the foundational directory structure for product management within the dashboard, including the products route group setup, shared layout component with tab navigation, and all essential product pages (list, create, detail, edit, and variants).

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create Products Route Directory | Low | 15 min |
| 02 | Create Products Layout | Medium | 30 min |
| 03 | Create Products List Page Route | Low | 20 min |
| 04 | Create Product Create Page Route | Low | 20 min |
| 05 | Create Product Detail Page Route | Low | 20 min |
| 06 | Create Product Edit Page Route | Low | 20 min |
| 07 | Create Product Variants Page Route | Medium | 25 min |

---

## Task 01: Create Products Route Directory

### Overview
Create the `products` directory within the dashboard route group in the Next.js App Router. This directory will house all product-related pages including list, create, detail, edit, and variants views. The structure follows Next.js conventions for nested and dynamic routes.

### Dependencies
- SubPhase-07 (Dashboard Layout) must be complete
- Dashboard route group `(dashboard)` exists
- Next.js App Router structure is established
- Frontend project is initialized

### Instructions

1. **Navigate to the dashboard directory**
   - Go to `frontend/app/(dashboard)/` directory
   - Verify this directory exists from SubPhase-07
   - This is where all dashboard feature modules live

2. **Create the products directory**
   - Create a new directory named `products`
   - This becomes the base route for all product management
   - URL path will be `/products` (dashboard layout applies)

3. **Create nested route structure**
   - Create `new/` subdirectory for product creation
   - Create `[id]/` subdirectory for dynamic product routes
   - Create `[id]/edit/` for edit functionality
   - Create `[id]/variants/` for variant management
   - Create `categories/` subdirectory for category management

4. **Understand route hierarchy**
   - `app/(dashboard)/products/page.tsx` → `/products` (list)
   - `app/(dashboard)/products/new/page.tsx` → `/products/new` (create)
   - `app/(dashboard)/products/[id]/page.tsx` → `/products/123` (detail)
   - `app/(dashboard)/products/[id]/edit/page.tsx` → `/products/123/edit`
   - `app/(dashboard)/products/[id]/variants/page.tsx` → `/products/123/variants`

5. **Verify directory structure**
   - Confirm all directories created correctly
   - Ensure proper naming conventions (lowercase, hyphens)
   - Validate dynamic route syntax with square brackets

### Route Structure Purpose

| Directory | Purpose | URL Pattern |
|-----------|---------|-------------|
| `products/` | Main product module | `/products/*` |
| `new/` | Create new product | `/products/new` |
| `[id]/` | Product-specific routes | `/products/:id` |
| `[id]/edit/` | Edit product | `/products/:id/edit` |
| `[id]/variants/` | Manage variants | `/products/:id/variants` |
| `categories/` | Category management | `/products/categories` |

### Directory Structure
```
frontend/app/(dashboard)/
└── products/
    ├── layout.tsx           # (Created in Task 02)
    ├── page.tsx             # (Created in Task 03)
    ├── loading.tsx          # (Created in Group B)
    ├── error.tsx            # (Created in Group B)
    ├── new/
    │   └── page.tsx         # (Created in Task 04)
    ├── [id]/
    │   ├── page.tsx         # (Created in Task 05)
    │   ├── edit/
    │   │   └── page.tsx     # (Created in Task 06)
    │   └── variants/
    │       └── page.tsx     # (Created in Task 07)
    └── categories/
        ├── page.tsx         # (Created in Group B)
        ├── new/
        │   └── page.tsx     # (Created in Group B)
        └── [id]/
            └── page.tsx     # (Created in Group B)
```

### URL Mapping Examples

| File Path | URL Path | Page Purpose |
|-----------|----------|--------------|
| `products/page.tsx` | `/products` | Product listing |
| `products/new/page.tsx` | `/products/new` | Create product form |
| `products/[id]/page.tsx` | `/products/123` | View product details |
| `products/[id]/edit/page.tsx` | `/products/123/edit` | Edit product form |
| `products/[id]/variants/page.tsx` | `/products/123/variants` | Manage variants |

### Expected Outcome
- Complete directory structure for product management
- Proper nested and dynamic route organization
- Foundation for all product-related pages
- Follows Next.js App Router best practices

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/` directory exists
- [ ] `products/new/` subdirectory created
- [ ] `products/[id]/` subdirectory created (with square brackets)
- [ ] `products/[id]/edit/` subdirectory created
- [ ] `products/[id]/variants/` subdirectory created
- [ ] `products/categories/` subdirectory created
- [ ] Directory names follow lowercase convention
- [ ] Located within `(dashboard)` route group

---

## Task 02: Create Products Layout

### Overview
Create the layout component for the products route that provides consistent navigation across all product-related pages. This layout includes tab navigation to switch between Products and Categories views, maintaining the active state and preserving the dashboard layout.

### Dependencies
- Task 01: Create Products Route Directory

### Instructions

1. **Create layout.tsx file**
   - Navigate to `frontend/app/(dashboard)/products/` directory
   - Create new file named `layout.tsx`
   - This layout wraps all pages within the products directory

2. **Import required dependencies**
   - Import React types (ReactNode)
   - Import Link from 'next/link'
   - Import usePathname hook from 'next/navigation'
   - Import any UI components (Button, Card, etc.)

3. **Define layout component structure**
   - Create default export function `ProductsLayout`
   - Accept `children` prop of type `ReactNode`
   - Use client component ('use client') if using hooks
   - Return JSX with header and content sections

4. **Implement header section**
   - Create page title: "Product Management"
   - Add optional description or breadcrumbs
   - Include action buttons if needed (e.g., Quick Actions)

5. **Create tab navigation**
   - Implement tabs for "Products" and "Categories"
   - Products tab links to `/products`
   - Categories tab links to `/products/categories`
   - Style active tab differently based on current route

6. **Implement active tab detection**
   - Use `usePathname()` hook to get current path
   - Highlight active tab based on pathname
   - Consider nested routes (e.g., `/products/new` should highlight Products tab)

7. **Add content wrapper**
   - Wrap `{children}` in appropriate container
   - Apply consistent spacing and padding
   - Ensure proper responsive behavior

8. **Style the layout**
   - Apply consistent spacing (padding, margins)
   - Use Tailwind classes for tabs and navigation
   - Ensure visual hierarchy (header → tabs → content)

### Layout Component Props

| Prop | Type | Description |
|------|------|-------------|
| children | ReactNode | Page content to render |

### Layout Structure

```
┌──────────────────────────────────────────────┐
│  Product Management                          │
│                                              │
│  ┌──────────┬───────────┐                   │
│  │ Products │ Categories │                   │
│  └──────────┴───────────┘                   │
│                                              │
│  ┌────────────────────────────────────────┐ │
│  │                                        │ │
│  │         {children}                     │ │
│  │      (Product Pages)                   │ │
│  │                                        │ │
│  └────────────────────────────────────────┘ │
└──────────────────────────────────────────────┘
```

### Tab Navigation

| Tab | Path | Active When | Description |
|-----|------|-------------|-------------|
| Products | `/products` | pathname starts with `/products` (exclude `/products/categories`) | Product listing and management |
| Categories | `/products/categories` | pathname starts with `/products/categories` | Category management |

### Tab State Logic

| Current Path | Products Tab | Categories Tab |
|--------------|--------------|----------------|
| `/products` | Active | Inactive |
| `/products/new` | Active | Inactive |
| `/products/123` | Active | Inactive |
| `/products/123/edit` | Active | Inactive |
| `/products/categories` | Inactive | Active |
| `/products/categories/new` | Inactive | Active |

### Active Tab Styling

| State | Tailwind Classes | Visual Effect |
|-------|------------------|---------------|
| Active | `border-b-2 border-blue-600 text-blue-600 font-semibold` | Blue underline, bold text |
| Inactive | `border-b-2 border-transparent text-gray-600 hover:text-gray-900` | Gray text, hover effect |

### Layout Sections

| Section | Purpose | Styling |
|---------|---------|---------|
| Header | Page title and context | `mb-6 flex justify-between items-center` |
| Tabs | Navigation between views | `border-b border-gray-200 mb-6` |
| Content | Page-specific content | `{children}` with padding |

### Responsive Considerations

```
Mobile (< 640px)
├── Stack header elements vertically
├── Full-width tabs
└── Reduced padding

Tablet/Desktop (≥ 640px)
├── Header with flex layout
├── Horizontal tabs
└── Standard padding
```

### Expected Outcome
- Functional layout component for products module
- Tab navigation between Products and Categories
- Active tab highlighting based on current route
- Consistent header across all product pages
- Responsive design for all screen sizes

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/layout.tsx` file created
- [ ] Layout component accepts children prop
- [ ] Header with "Product Management" title implemented
- [ ] Tab navigation with Products and Categories tabs
- [ ] Products tab links to `/products`
- [ ] Categories tab links to `/products/categories`
- [ ] Active tab detection using usePathname()
- [ ] Active tab styled differently
- [ ] Responsive design implemented
- [ ] Component exports properly as default

---

## Task 03: Create Products List Page Route

### Overview
Create the main products list page that displays all products in a data table format. This page serves as the landing page for the products module and provides functionality to view, search, filter, and navigate to other product-related actions.

### Dependencies
- Task 01: Create Products Route Directory
- Task 02: Create Products Layout

### Instructions

1. **Create page.tsx file**
   - Navigate to `frontend/app/(dashboard)/products/` directory
   - Create new file named `page.tsx`
   - This is the main products list page (route: `/products`)

2. **Set up page component structure**
   - Create default export function `ProductsPage`
   - Use server component (default) or client component if needed
   - Import required components and utilities

3. **Define page metadata**
   - Export metadata object with page title
   - Set title to "Products | LankaCommerce Cloud"
   - Add description for SEO purposes

4. **Implement page header**
   - Add page title: "Products"
   - Include product count or summary information
   - Add "Create Product" button linking to `/products/new`

5. **Plan data table structure**
   - Define columns: SKU, Name, Category, Stock, Price, Status, Actions
   - Plan for sortable columns (SKU, Name, Price)
   - Plan for filterable fields (Category, Status)

6. **Add search and filter controls**
   - Search input for product name/SKU
   - Category filter dropdown
   - Status filter (Active/Inactive)
   - Stock filter (In Stock/Low Stock/Out of Stock)

7. **Implement table row actions**
   - View button/link to `/products/[id]`
   - Edit button/link to `/products/[id]/edit`
   - Variants button/link to `/products/[id]/variants`
   - Delete action (with confirmation)

8. **Add pagination controls**
   - Page size selector (10, 25, 50, 100)
   - Previous/Next buttons
   - Page number display
   - Total count display

9. **Consider empty state**
   - Display when no products exist
   - Show "Create your first product" message
   - Include "Create Product" button

10. **Add placeholder for data fetching**
    - Add comment indicating where API call will go
    - Note that actual data fetching will be in Group B
    - Use mock data structure for now

### Page Structure

```
┌────────────────────────────────────────────────────────┐
│  Products                          [Create Product]    │
│                                                        │
│  ┌──────────────┐  ┌──────────┐  ┌──────────┐        │
│  │ Search       │  │ Category │  │ Status   │        │
│  └──────────────┘  └──────────┘  └──────────┘        │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ SKU │ Name │ Category │ Stock │ Price │ Actions │ │
│  ├─────┼──────┼──────────┼───────┼───────┼─────────┤ │
│  │ ... │ ...  │ ...      │ ...   │ ...   │ [E][V] │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ← Previous  Page 1 of 10  Next →        [Page Size]  │
└────────────────────────────────────────────────────────┘
```

### Data Table Columns

| Column | Width | Sortable | Description |
|--------|-------|----------|-------------|
| SKU | 100px | Yes | Product SKU code |
| Name | 250px | Yes | Product name with thumbnail |
| Category | 150px | No | Primary category name |
| Stock | 80px | No | Available quantity |
| Price | 100px | Yes | Base price |
| Status | 100px | No | Active/Inactive badge |
| Actions | 120px | No | View/Edit/Variants buttons |

### Action Buttons

| Action | Icon | Link/Handler | Description |
|--------|------|--------------|-------------|
| View | Eye | `/products/[id]` | View product details |
| Edit | Pencil | `/products/[id]/edit` | Edit product |
| Variants | Boxes | `/products/[id]/variants` | Manage variants |
| Delete | Trash | Handler function | Delete product |

### Filter Controls

| Filter | Type | Options | Default |
|--------|------|---------|---------|
| Search | Text Input | - | Empty |
| Category | Dropdown | All, Category1, Category2... | All |
| Status | Dropdown | All, Active, Inactive | All |
| Stock Status | Dropdown | All, In Stock, Low Stock, Out | All |

### Pagination Configuration

| Setting | Options | Default |
|---------|---------|---------|
| Page Size | 10, 25, 50, 100 | 25 |
| Current Page | 1 to N | 1 |
| Total Items | Dynamic | 0 |

### Empty State

```
┌────────────────────────────────────┐
│                                    │
│          📦 No Products            │
│                                    │
│   You haven't created any          │
│   products yet. Get started        │
│   by creating your first product.  │
│                                    │
│      [Create Product]              │
│                                    │
└────────────────────────────────────┘
```

### Mock Data Structure (Placeholder)

| Field | Type | Example |
|-------|------|---------|
| id | string | "prod_123abc" |
| sku | string | "SKU-001" |
| name | string | "Product Name" |
| category | string | "Electronics" |
| stock | number | 150 |
| price | number | 999.99 |
| status | string | "active" |

### Expected Outcome
- Functional products list page at `/products`
- Page header with title and create button
- Search and filter controls layout
- Data table structure with columns
- Row actions (view, edit, variants, delete)
- Pagination controls
- Empty state handling
- Proper metadata for SEO

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/page.tsx` file created
- [ ] Page component exports as default
- [ ] Metadata object exported with title and description
- [ ] Page header with "Products" title implemented
- [ ] "Create Product" button links to `/products/new`
- [ ] Search input field added
- [ ] Category filter dropdown added
- [ ] Status filter dropdown added
- [ ] Data table structure with all columns defined
- [ ] Action buttons (View, Edit, Variants) link correctly
- [ ] Pagination controls implemented
- [ ] Empty state component or message added
- [ ] Comments added for future data fetching
- [ ] Page renders without errors

---

## Task 04: Create Product Create Page Route

### Overview
Create the product creation page that allows users to add new products to the inventory. This page includes a comprehensive form with all necessary fields for product information, including basic details, pricing, inventory, images, and SEO settings.

### Dependencies
- Task 01: Create Products Route Directory
- Task 02: Create Products Layout

### Instructions

1. **Create page.tsx file in new directory**
   - Navigate to `frontend/app/(dashboard)/products/new/` directory
   - Create new file named `page.tsx`
   - This page handles new product creation (route: `/products/new`)

2. **Set up page component structure**
   - Create default export function `CreateProductPage`
   - Determine if client or server component (likely client for forms)
   - Import required form components and utilities

3. **Define page metadata**
   - Export metadata object with page title
   - Set title to "Create Product | LankaCommerce Cloud"
   - Add description for context

4. **Implement page header**
   - Add breadcrumb navigation: Products > Create
   - Add page title: "Create New Product"
   - Include "Back to Products" link to `/products`

5. **Plan form structure**
   - Organize form into logical sections using tabs or accordion
   - Basic Information section
   - Pricing section
   - Inventory section
   - Images & Media section
   - SEO & Metadata section

6. **Define Basic Information fields**
   - Product Name (required, text input)
   - SKU (required, text input, unique)
   - Description (rich text editor or textarea)
   - Category (required, dropdown/select)
   - Brand (optional, dropdown/select or text input)
   - Tags (multi-select or tag input)
   - Status (Active/Inactive toggle)

7. **Define Pricing fields**
   - Base Price (required, number input)
   - Compare at Price (optional, number input for strikethrough)
   - Cost per Item (optional, for profit calculations)
   - Tax Configuration (taxable checkbox, tax class)
   - Currency (default LKR)

8. **Define Inventory fields**
   - Track Inventory (checkbox)
   - Quantity (number input)
   - SKU (if not in basic section)
   - Barcode (optional, text input)
   - Low Stock Threshold (number input)
   - Allow Backorders (checkbox)

9. **Define Images & Media section**
   - Primary Image upload (required)
   - Additional Images upload (multiple)
   - Image alt text fields
   - Drag-and-drop reorder capability

10. **Define SEO & Metadata fields**
    - SEO Title (text input, max 60 chars)
    - Meta Description (textarea, max 160 chars)
    - URL Slug (text input, auto-generated from name)
    - Search Keywords (tag input)

11. **Add form actions**
    - "Create Product" button (primary action)
    - "Save as Draft" button (secondary action)
    - "Cancel" button linking back to `/products`

12. **Add validation placeholders**
    - Note required fields
    - Add comments for validation rules
    - Plan error message display

### Page Structure

```
┌────────────────────────────────────────────────────────┐
│  Products > Create                  [Back to Products] │
│                                                        │
│  Create New Product                                    │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ ┌────┬────────┬──────────┬────────┬──────┐      │ │
│  │ │Info│Pricing │Inventory │Images  │ SEO  │      │ │
│  │ └────┴────────┴──────────┴────────┴──────┘      │ │
│  │                                                  │ │
│  │  [Active Form Section with Fields]              │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  [Cancel]              [Save as Draft] [Create Product]│
└────────────────────────────────────────────────────────┘
```

### Form Sections

| Section | Priority | Fields Count | Collapsible |
|---------|----------|--------------|-------------|
| Basic Information | High | 7 | No |
| Pricing | High | 5 | No |
| Inventory | Medium | 6 | Yes |
| Images & Media | High | 3 | No |
| SEO & Metadata | Low | 4 | Yes |

### Basic Information Fields

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Product Name | Text | Yes | Max 200 chars |
| SKU | Text | Yes | Unique, alphanumeric |
| Description | Rich Text | No | Max 5000 chars |
| Category | Select | Yes | Must exist |
| Brand | Select/Text | No | - |
| Tags | Multi-select | No | - |
| Status | Toggle | Yes | Default: Active |

### Pricing Fields

| Field | Type | Required | Default |
|-------|------|----------|---------|
| Base Price | Number | Yes | 0.00 |
| Compare at Price | Number | No | - |
| Cost per Item | Number | No | - |
| Taxable | Checkbox | No | true |
| Tax Class | Select | No | Standard |

### Inventory Fields

| Field | Type | Required | Default |
|-------|------|----------|---------|
| Track Inventory | Checkbox | No | true |
| Quantity | Number | Conditional | 0 |
| Barcode | Text | No | - |
| Low Stock Threshold | Number | No | 10 |
| Allow Backorders | Checkbox | No | false |

### Images & Media

| Component | Description | Max |
|-----------|-------------|-----|
| Primary Image | Main product image | 1 |
| Additional Images | Gallery images | 10 |
| Image Upload | Drag-and-drop or click to upload | 5MB per image |

### Form Actions

| Button | Type | Action | Position |
|--------|------|--------|----------|
| Cancel | Secondary | Navigate to `/products` | Left |
| Save as Draft | Secondary | Save with draft status | Right |
| Create Product | Primary | Submit form | Right |

### Validation Rules

| Rule | Description |
|------|-------------|
| Required Fields | Name, SKU, Category, Price |
| SKU Uniqueness | Check against existing products |
| Price Validation | Must be positive number |
| Stock Validation | Cannot be negative |
| Image Format | JPG, PNG, WebP only |
| Image Size | Max 5MB per image |

### Expected Outcome
- Functional product creation page at `/products/new`
- Comprehensive form with all product fields
- Organized sections with tabs or accordion
- Form validation placeholders
- Action buttons (Cancel, Save Draft, Create)
- Proper metadata and navigation
- Ready for form logic implementation in later groups

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/new/page.tsx` file created
- [ ] Page component exports as default
- [ ] Metadata exported with title
- [ ] Breadcrumb navigation implemented
- [ ] Page header with title added
- [ ] "Back to Products" link added
- [ ] Form sections organized (tabs or accordion)
- [ ] All Basic Information fields added
- [ ] All Pricing fields added
- [ ] All Inventory fields added
- [ ] Images & Media upload section added
- [ ] SEO & Metadata fields added
- [ ] Cancel button links to `/products`
- [ ] Save as Draft button added
- [ ] Create Product button added
- [ ] Comments added for validation rules
- [ ] Page renders without errors

---

## Task 05: Create Product Detail Page Route

### Overview
Create the product detail view page that displays comprehensive information about a single product. This page is accessed via dynamic route parameter and shows all product data in a read-only format with options to edit or manage variants.

### Dependencies
- Task 01: Create Products Route Directory
- Task 02: Create Products Layout

### Instructions

1. **Create page.tsx file in [id] directory**
   - Navigate to `frontend/app/(dashboard)/products/[id]/` directory
   - Create new file named `page.tsx`
   - This page displays product details (route: `/products/[id]`)

2. **Set up page component structure**
   - Create default export function `ProductDetailPage`
   - Accept params prop with id parameter
   - Use async function if fetching data server-side
   - Import required components

3. **Define page props interface**
   - Create interface for params: `{ params: { id: string } }`
   - TypeScript type for the page props

4. **Implement dynamic metadata generation**
   - Export `generateMetadata` function
   - Use product ID to fetch product data
   - Set title to "{Product Name} | LankaCommerce Cloud"
   - Use product description for meta description

5. **Implement page header**
   - Add breadcrumb: Products > {Product Name}
   - Display product name as page title
   - Add status badge (Active/Inactive)
   - Include action buttons (Edit, Manage Variants, Delete)

6. **Create product overview section**
   - Display primary product image (large)
   - Show basic information table
   - Include SKU, Category, Brand, Tags
   - Display creation and update timestamps

7. **Create pricing section**
   - Display Base Price (large, prominent)
   - Show Compare at Price (if set)
   - Display Cost per Item (if set)
   - Show Profit Margin calculation
   - Display Tax information

8. **Create inventory section**
   - Show current stock quantity
   - Display low stock warning if applicable
   - Show barcode (if exists)
   - Display inventory tracking status
   - Show backorder settings

9. **Create description section**
   - Display full product description
   - Render rich text formatting
   - Show in expandable card

10. **Create images gallery section**
    - Display all product images
    - Show primary image first
    - Implement lightbox or modal for full view
    - Display image count

11. **Create SEO information section**
    - Display SEO title
    - Show meta description
    - Display URL slug
    - Show search keywords

12. **Add related actions panel**
    - "Edit Product" button → `/products/[id]/edit`
    - "Manage Variants" button → `/products/[id]/variants`
    - "View in Store" link (if applicable)
    - "Delete Product" button (with confirmation)

13. **Add placeholder for data fetching**
    - Comment where API call will go
    - Note params.id usage for fetching
    - Add mock data structure

### Page Structure

```
┌────────────────────────────────────────────────────────┐
│  Products > Product Name                               │
│                                                        │
│  Product Name                        [Active] [Edit]  │
│                                                        │
│  ┌──────────┐  ┌──────────────────────────────────┐  │
│  │          │  │ SKU: ABC123                       │  │
│  │  Image   │  │ Category: Electronics             │  │
│  │          │  │ Brand: BrandName                  │  │
│  └──────────┘  └──────────────────────────────────┘  │
│                                                        │
│  ┌────────────────┐  ┌─────────────┐  ┌───────────┐  │
│  │ Pricing        │  │ Inventory   │  │ Images    │  │
│  │ LKR 999.99     │  │ Stock: 150  │  │ 5 images  │  │
│  └────────────────┘  └─────────────┘  └───────────┘  │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Description                                       │ │
│  │ [Full product description text]                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  [Edit] [Manage Variants] [View in Store] [Delete]   │
└────────────────────────────────────────────────────────┘
```

### Page Sections

| Section | Priority | Content | Collapsible |
|---------|----------|---------|-------------|
| Header | High | Title, status, actions | No |
| Overview | High | Image, basic info | No |
| Pricing | High | Prices, margins | No |
| Inventory | High | Stock levels | No |
| Description | Medium | Full description | Yes |
| Images Gallery | Medium | All images | Yes |
| SEO Info | Low | SEO metadata | Yes |

### Product Overview Data

| Field | Display Format | Example |
|-------|----------------|---------|
| SKU | Text label | SKU: ABC-123 |
| Category | Link to category | Electronics |
| Brand | Text label | Samsung |
| Tags | Badge list | Sale, Featured, New |
| Created | Relative date | Created 2 days ago |
| Updated | Relative date | Updated 1 hour ago |

### Pricing Display

| Field | Format | Notes |
|-------|--------|-------|
| Base Price | LKR 999.99 | Large, prominent |
| Compare Price | ~~LKR 1,299.99~~ | Strikethrough if set |
| Cost | LKR 600.00 | Smaller text |
| Margin | 40% | Calculated, green if positive |
| Tax | 15% VAT | Display if taxable |

### Inventory Display

| Field | Format | Condition |
|-------|--------|-----------|
| Stock | 150 units | Show quantity |
| Status | In Stock | Green badge if > threshold |
| Warning | Low Stock! | Orange badge if low |
| Barcode | 1234567890123 | Display if exists |
| Tracking | Enabled/Disabled | Checkbox icon |

### Action Buttons

| Button | Link/Handler | Style | Position |
|--------|--------------|-------|----------|
| Edit Product | `/products/[id]/edit` | Primary | Top right |
| Manage Variants | `/products/[id]/variants` | Secondary | Bottom |
| View in Store | External link | Secondary | Bottom |
| Delete Product | Handler with modal | Danger | Bottom |

### Status Badge

| Status | Color | Display |
|--------|-------|---------|
| Active | Green | ✓ Active |
| Inactive | Gray | Inactive |
| Draft | Yellow | Draft |

### Images Gallery Layout

```
┌─────────────────────────────────────┐
│  [Primary Image - Large]            │
│                                     │
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐ [+2]  │
│  │ T1 │ │ T2 │ │ T3 │ │ T4 │       │
│  └────┘ └────┘ └────┘ └────┘       │
└─────────────────────────────────────┘
```

### Expected Outcome
- Functional product detail page at `/products/[id]`
- Dynamic metadata based on product
- Comprehensive product information display
- Organized sections for different data types
- Action buttons for common tasks
- Status indicators and badges
- Responsive layout
- Placeholder for data fetching

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/[id]/page.tsx` file created
- [ ] Page component accepts params prop with id
- [ ] TypeScript interface for params defined
- [ ] generateMetadata function exported
- [ ] Breadcrumb navigation with product name
- [ ] Page header with title and status badge
- [ ] Edit button links to `/products/[id]/edit`
- [ ] Product overview section with image and info table
- [ ] Pricing section with all price fields
- [ ] Inventory section with stock info
- [ ] Description section implemented
- [ ] Images gallery section added
- [ ] SEO information section added
- [ ] Manage Variants button links to `/products/[id]/variants`
- [ ] Delete button added (with confirmation note)
- [ ] Comments for data fetching added
- [ ] Page renders without errors

---

## Task 06: Create Product Edit Page Route

### Overview
Create the product edit page that allows users to modify existing product information. This page is similar to the create page but pre-populated with existing data and accessed via a dynamic route parameter.

### Dependencies
- Task 01: Create Products Route Directory
- Task 05: Create Product Detail Page Route

### Instructions

1. **Create page.tsx file in edit directory**
   - Navigate to `frontend/app/(dashboard)/products/[id]/edit/` directory
   - Create new file named `page.tsx`
   - This page handles product editing (route: `/products/[id]/edit`)

2. **Set up page component structure**
   - Create default export function `EditProductPage`
   - Accept params prop with id parameter
   - Use async function if fetching data server-side
   - Import form components and utilities

3. **Define page props interface**
   - Create interface: `{ params: { id: string } }`
   - TypeScript type for page props

4. **Implement dynamic metadata generation**
   - Export `generateMetadata` function
   - Fetch product data using params.id
   - Set title to "Edit {Product Name} | LankaCommerce Cloud"

5. **Implement page header**
   - Add breadcrumb: Products > {Product Name} > Edit
   - Add page title: "Edit Product"
   - Display current product name as subtitle
   - Include "Back to Product" link to `/products/[id]`

6. **Implement form structure (similar to Task 04)**
   - Use same form sections as create page
   - Basic Information section
   - Pricing section
   - Inventory section
   - Images & Media section
   - SEO & Metadata section

7. **Plan data pre-population**
   - Add comments for fetching existing product data
   - Note that form fields will be populated with current values
   - Include params.id in data fetching logic placeholder

8. **Define all form fields (same as Task 04)**
   - Product Name, SKU, Description, Category, Brand, Tags, Status
   - Base Price, Compare Price, Cost, Tax settings
   - Inventory tracking, Quantity, Barcode, Thresholds
   - Images (show existing, allow additions/removals)
   - SEO fields (Title, Description, Slug, Keywords)

9. **Add form actions**
   - "Cancel" button linking to `/products/[id]`
   - "Save Changes" button (primary action)
   - "Save as Draft" button (if status changed to draft)
   - Consider "Delete Product" button (with confirmation)

10. **Add image management**
    - Display existing images with remove option
    - Allow adding new images
    - Enable reordering images
    - Handle primary image selection

11. **Add change tracking (optional)**
    - Note which fields have been modified
    - Show "Unsaved changes" warning
    - Implement "Discard changes" confirmation

12. **Add validation placeholders**
    - Note required fields
    - Add comments for validation rules
    - Plan error message display

### Page Structure

```
┌────────────────────────────────────────────────────────┐
│  Products > Product Name > Edit    [Back to Product]  │
│                                                        │
│  Edit Product                                          │
│  Product Name                                          │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ ┌────┬────────┬──────────┬────────┬──────┐      │ │
│  │ │Info│Pricing │Inventory │Images  │ SEO  │      │ │
│  │ └────┴────────┴──────────┴────────┴──────┘      │ │
│  │                                                  │ │
│  │  [Active Form Section with Pre-filled Fields]   │ │
│  │                                                  │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  [Cancel]                             [Save Changes]  │
└────────────────────────────────────────────────────────┘
```

### Form Sections (Reuse from Task 04)

| Section | Fields | Pre-populated | Editable |
|---------|--------|---------------|----------|
| Basic Info | 7 | Yes | Yes |
| Pricing | 5 | Yes | Yes |
| Inventory | 6 | Yes | Yes |
| Images | 3 | Yes (existing) | Yes (add/remove) |
| SEO | 4 | Yes | Yes |

### Data Pre-population Strategy

| Step | Action | Purpose |
|------|--------|---------|
| 1 | Fetch product data | Get current values |
| 2 | Parse data into form fields | Populate inputs |
| 3 | Set form state | Initialize form |
| 4 | Enable editing | Allow modifications |

### Image Management

| Action | Description | Implementation |
|--------|-------------|----------------|
| View Existing | Display current images | Image grid with thumbnails |
| Remove Image | Delete from product | Click X button |
| Add Image | Upload new image | Drag-and-drop or file picker |
| Reorder | Change image sequence | Drag to reorder |
| Set Primary | Select main image | Radio button or click |

### Form Actions

| Button | Type | Action | Position |
|--------|------|--------|----------|
| Cancel | Secondary | Navigate to `/products/[id]` | Left |
| Delete Product | Danger | Handler with confirmation | Left |
| Save as Draft | Secondary | Save with draft status | Right |
| Save Changes | Primary | Submit form with updates | Right |

### Validation Considerations

| Rule | Description | Error Display |
|------|-------------|---------------|
| Required Fields | Name, SKU, Category, Price | Inline below field |
| SKU Uniqueness | Check if changed | Real-time validation |
| Price Validation | Must be positive | Inline below field |
| Stock Validation | Cannot be negative | Inline below field |
| Image Format | JPG, PNG, WebP | On upload |

### Change Tracking (Optional)

```
┌────────────────────────────────────┐
│  ⚠ Unsaved Changes                │
│                                    │
│  You have unsaved changes.         │
│  Are you sure you want to leave?   │
│                                    │
│  [Stay on Page] [Leave Anyway]    │
└────────────────────────────────────┘
```

### Differences from Create Page

| Aspect | Create Page | Edit Page |
|--------|-------------|-----------|
| Route | `/products/new` | `/products/[id]/edit` |
| Title | "Create New Product" | "Edit Product" |
| Data | Empty form | Pre-filled with current data |
| Action | Create | Update |
| Back Link | `/products` | `/products/[id]` |
| Delete Option | No | Yes (optional) |

### Expected Outcome
- Functional product edit page at `/products/[id]/edit`
- Dynamic metadata with product name
- Form pre-populated with existing data (placeholder)
- All form sections matching create page
- Edit-specific actions (Cancel to detail, Save changes)
- Image management capabilities
- Proper metadata and navigation
- Ready for form logic and data fetching

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/[id]/edit/page.tsx` file created
- [ ] Page component accepts params prop with id
- [ ] TypeScript interface for params defined
- [ ] generateMetadata function exported
- [ ] Breadcrumb includes Products > Product Name > Edit
- [ ] "Back to Product" link to `/products/[id]`
- [ ] Page title "Edit Product" displayed
- [ ] All form sections from Task 04 included
- [ ] Comments for data pre-population added
- [ ] Image management section with remove/add capability
- [ ] Cancel button links to `/products/[id]`
- [ ] Save Changes button added
- [ ] Optional Delete Product button added
- [ ] Comments for validation rules added
- [ ] Page renders without errors

---

## Task 07: Create Product Variants Page Route

### Overview
Create the product variants management page that allows users to create and manage product variations (e.g., sizes, colors, materials). This page displays variant options, specific variant SKUs, prices, and inventory for each combination.

### Dependencies
- Task 01: Create Products Route Directory
- Task 05: Create Product Detail Page Route

### Instructions

1. **Create page.tsx file in variants directory**
   - Navigate to `frontend/app/(dashboard)/products/[id]/variants/` directory
   - Create new file named `page.tsx`
   - This page manages product variants (route: `/products/[id]/variants`)

2. **Set up page component structure**
   - Create default export function `ProductVariantsPage`
   - Accept params prop with id parameter
   - Use async function if needed for data fetching
   - Likely needs client component for interactivity

3. **Define page props interface**
   - Create interface: `{ params: { id: string } }`
   - TypeScript type for page props

4. **Implement dynamic metadata generation**
   - Export `generateMetadata` function
   - Set title to "Manage Variants - {Product Name} | LankaCommerce Cloud"

5. **Implement page header**
   - Add breadcrumb: Products > {Product Name} > Variants
   - Add page title: "Product Variants"
   - Display parent product name
   - Include "Back to Product" link to `/products/[id]`

6. **Create variant options section**
   - Display list of option types (e.g., Size, Color)
   - Show values for each option (e.g., Size: S, M, L, XL)
   - Add "Add Option" button
   - Include edit/delete for each option

7. **Create option type management**
   - Form to add new option type (e.g., "Material")
   - Input to add option values (e.g., "Cotton", "Polyester")
   - Reorder options capability
   - Remove option type (with confirmation if variants exist)

8. **Create variants table**
   - Display all variant combinations
   - Columns: Image, Variant (e.g., "S / Red"), SKU, Price, Stock, Status, Actions
   - Auto-generate rows for all combinations
   - Allow manual editing of each variant

9. **Implement variant table features**
   - Sortable columns
   - Bulk actions (select multiple variants)
   - Bulk edit (price, stock)
   - Enable/disable individual variants

10. **Create variant detail row/modal**
    - Inline editing or modal for each variant
    - Fields: SKU, Barcode, Price, Compare Price, Cost, Stock, Image
    - Save button for each variant
    - Validation for variant-specific fields

11. **Add variant generation logic**
    - Button: "Generate Variants"
    - Auto-create all combinations from options
    - Pre-fill with parent product data
    - Allow customization after generation

12. **Create empty state**
    - Display when no options are defined
    - Message: "Add variant options to create variants"
    - "Add Option" call-to-action button

13. **Add variant statistics**
    - Total variants count
    - Active variants count
    - Total inventory across variants
    - Lowest/highest variant price

### Page Structure

```
┌────────────────────────────────────────────────────────┐
│  Products > Product Name > Variants  [Back to Product] │
│                                                        │
│  Product Variants                                      │
│  Product Name                                          │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Variant Options                                  │ │
│  │                                                  │ │
│  │ Size: [S] [M] [L] [XL]              [Edit]      │ │
│  │ Color: [Red] [Blue] [Green]         [Edit]      │ │
│  │                                                  │ │
│  │ [Add Option]                [Generate Variants] │ │
│  └──────────────────────────────────────────────────┘ │
│                                                        │
│  ┌──────────────────────────────────────────────────┐ │
│  │ Img │ Variant │ SKU │ Price │ Stock │ Actions  │ │
│  ├─────┼─────────┼─────┼───────┼───────┼──────────┤ │
│  │ [▪] │ S/Red   │ ... │ ...   │ ...   │ [E] [D] │ │
│  │ [▪] │ S/Blue  │ ... │ ...   │ ...   │ [E] [D] │ │
│  └──────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

### Page Sections

| Section | Purpose | Priority |
|---------|---------|----------|
| Header | Navigation and context | High |
| Statistics | Variant overview metrics | Medium |
| Options | Manage option types and values | High |
| Variants Table | List and edit variants | High |
| Empty State | Guide when no options exist | High |

### Variant Options Display

| Option Type | Example Values | Actions |
|-------------|----------------|---------|
| Size | S, M, L, XL | Edit, Delete, Reorder |
| Color | Red, Blue, Green, Yellow | Edit, Delete, Reorder |
| Material | Cotton, Polyester, Blend | Edit, Delete, Reorder |

### Option Type Management

| Action | Description | UI Element |
|--------|-------------|------------|
| Add Option | Create new option type | Button + Modal/Form |
| Edit Option | Modify option name/values | Inline or Modal |
| Delete Option | Remove option type | Delete button + Confirm |
| Add Value | Add value to existing option | Input field + Add button |

### Variants Table Columns

| Column | Width | Editable | Description |
|--------|-------|----------|-------------|
| Image | 60px | Yes | Variant-specific image |
| Variant | 200px | No | Option combination (S / Red) |
| SKU | 150px | Yes | Unique variant SKU |
| Price | 100px | Yes | Variant price (may differ from base) |
| Stock | 80px | Yes | Variant inventory |
| Status | 100px | Yes | Active/Inactive toggle |
| Actions | 100px | No | Edit, Delete buttons |

### Variant Statistics

| Metric | Display | Calculation |
|--------|---------|-------------|
| Total Variants | 12 variants | Count of all variant rows |
| Active Variants | 10 active | Count where status = active |
| Total Stock | 350 units | Sum of all variant stock |
| Price Range | LKR 899 - 1,299 | Min to Max variant price |

### Variant Generation Flow

```
1. Define Options
   ├── Add Option Type (Size)
   ├── Add Values (S, M, L)
   ├── Add Option Type (Color)
   └── Add Values (Red, Blue)
       │
2. Generate Variants
   └── Creates combinations:
       ├── S / Red
       ├── S / Blue
       ├── M / Red
       ├── M / Blue
       ├── L / Red
       └── L / Blue
           │
3. Customize Each Variant
   └── Edit SKU, Price, Stock individually
```

### Variant Data Structure (Placeholder)

| Field | Type | Example | Inherited |
|-------|------|---------|-----------|
| id | string | "var_123" | No |
| productId | string | params.id | Yes |
| options | object | {size: "M", color: "Red"} | No |
| sku | string | "SKU-M-RED" | No (auto-generated) |
| price | number | 999.99 | Yes (from product) |
| stock | number | 50 | No |
| image | string | URL | Yes (from product) |
| status | string | "active" | Yes |

### Bulk Actions

| Action | Description | Selection |
|--------|-------------|-----------|
| Bulk Edit Price | Update price for selected variants | Checkbox select |
| Bulk Edit Stock | Update stock for selected variants | Checkbox select |
| Bulk Enable | Set status to active | Checkbox select |
| Bulk Disable | Set status to inactive | Checkbox select |

### Empty State

```
┌────────────────────────────────────┐
│                                    │
│          📦 No Variant Options     │
│                                    │
│   This product doesn't have        │
│   variant options yet. Add         │
│   options like Size or Color       │
│   to create product variants.      │
│                                    │
│      [Add Option]                  │
│                                    │
└────────────────────────────────────┘
```

### Expected Outcome
- Functional variants management page at `/products/[id]/variants`
- Dynamic metadata with product name
- Variant options management section
- Variants table with all combinations
- Variant generation functionality
- Individual variant editing capability
- Bulk actions for multiple variants
- Statistics and overview metrics
- Empty state for products without options
- Proper navigation and back link

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/[id]/variants/page.tsx` file created
- [ ] Page component accepts params prop with id
- [ ] TypeScript interface for params defined
- [ ] generateMetadata function exported
- [ ] Breadcrumb includes Products > Product Name > Variants
- [ ] "Back to Product" link to `/products/[id]`
- [ ] Page title "Product Variants" displayed
- [ ] Variant options section implemented
- [ ] "Add Option" button added
- [ ] "Generate Variants" button added
- [ ] Variants table with columns defined
- [ ] Variant statistics section added
- [ ] Bulk actions checkboxes added
- [ ] Individual variant edit capability added
- [ ] Empty state for no options implemented
- [ ] Comments for data fetching added
- [ ] Page renders without errors

---

## Summary

This document established the complete route structure for product management, including the products directory setup, shared layout with tab navigation, and all primary product pages (list, create, detail, edit, and variants). These pages provide the foundation for comprehensive product management functionality within the ERP system.

### Completed Tasks
1. ✓ Created products route directory with proper structure
2. ✓ Created products layout with tab navigation (Products/Categories)
3. ✓ Created products list page with data table structure
4. ✓ Created product create page with comprehensive form
5. ✓ Created product detail page with read-only view
6. ✓ Created product edit page with pre-populated form
7. ✓ Created product variants page with options management

### Next Steps
Proceed to [02_Tasks-08-14_Category-Routes-States.md](02_Tasks-08-14_Category-Routes-States.md) to create category management routes, configure page metadata, and implement loading and error states for all product pages.
