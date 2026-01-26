# Tasks 08-14: Category Routes & States

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** A - Product Routes & Pages Structure  
> **Document:** 02 of 02  
> **Tasks Covered:** 08, 09, 10, 11, 12, 13, 14

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-07_Product-Routes.md](01_Tasks-01-07_Product-Routes.md)

---

## Document Overview

This document covers the creation of category management routes, page metadata configuration, and essential loading/error states for the product module. It establishes the complete route structure for category management (list, create, edit), configures SEO-friendly metadata for all product and category pages, implements loading states with skeletons, creates error boundaries with user-friendly messages, and verifies the entire route structure is functional.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 08 | Create Categories Page Route | Low | 20 min |
| 09 | Create Category Create Page Route | Low | 15 min |
| 10 | Create Category Edit Page Route | Low | 15 min |
| 11 | Configure Page Metadata | Low | 25 min |
| 12 | Create Product Loading States | Low | 30 min |
| 13 | Create Product Error States | Low | 25 min |
| 14 | Verify Route Structure | Low | 20 min |

---

## Task 08: Create Categories Page Route

### Overview
Create the categories list page route within the products module. This route displays a hierarchical category tree with search, filtering, and bulk actions. Categories are displayed under the /products/categories path and share the products layout with tab navigation. This page serves as the main interface for viewing and managing product categories.

### Dependencies
- Task 01: Create Products Route Directory (from Document 01)
- Task 02: Create Products Layout (from Document 01)

### Instructions

1. **Navigate to products directory**
   - Go to `frontend/app/(dashboard)/products/` directory
   - This is where all product-related routes are organized
   - Verify the directory structure is in place

2. **Create categories subdirectory**
   - Create new directory named `categories`
   - This establishes the base path `/products/categories`
   - Categories are organized as a sub-section of products

3. **Create categories page file**
   - Create `page.tsx` in `categories/` directory
   - This file renders at `/products/categories` route
   - Follows Next.js App Router page conventions

4. **Set up page component structure**
   - Define default export function `CategoriesPage`
   - Use async function if server component needs data
   - Accept optional searchParams prop for filtering

5. **Plan page layout sections**
   - Header section with page title and actions
   - Search and filter controls
   - Category tree/table display area
   - Pagination or infinite scroll controls

6. **Add page header elements**
   - Page title: "Product Categories"
   - Subtitle describing category management
   - "Add Category" button linking to create route
   - Optional bulk action buttons

7. **Prepare data fetching strategy**
   - Plan for server-side data loading
   - Consider category hierarchy structure
   - Handle search params for filtering
   - Implement pagination logic

### Categories Route Purpose

| Feature | Benefit |
|---------|---------|
| Hierarchical View | Shows parent-child relationships |
| Tree Navigation | Expand/collapse category levels |
| Search & Filter | Quick category discovery |
| Bulk Operations | Efficient category management |

### Directory Structure
```
frontend/app/(dashboard)/products/
├── layout.tsx           # Products layout with tabs
├── page.tsx             # Products list
├── categories/          # Categories section
│   ├── page.tsx         # Categories list (THIS FILE)
│   ├── new/
│   │   └── page.tsx     # (Task 09)
│   └── [id]/
│       └── page.tsx     # (Task 10)
└── [id]/                # Product detail routes
```

### URL Mapping

| File Path | URL Path | Page Purpose |
|-----------|----------|--------------|
| `categories/page.tsx` | `/products/categories` | Category list view |
| `categories/new/page.tsx` | `/products/categories/new` | Create new category |
| `categories/[id]/page.tsx` | `/products/categories/[id]` | Edit category |

### Page Component Props

| Prop | Type | Description |
|------|------|-------------|
| searchParams | object | URL query parameters for filtering |

### Categories Page Sections

```
┌──────────────────────────────────────────┐
│  Product Categories           [+ Add]    │
│  ────────────────────────────────────    │
│                                          │
│  🔍 Search   [Filter ▼]   [Actions ▼]   │
│  ────────────────────────────────────    │
│                                          │
│  📁 Electronics                          │
│    ├─ 📁 Computers                       │
│    │   ├─ Laptops                        │
│    │   └─ Desktops                       │
│    └─ 📁 Mobile Devices                  │
│        ├─ Phones                         │
│        └─ Tablets                        │
│                                          │
│  📁 Clothing                             │
│    ├─ Men's Wear                         │
│    └─ Women's Wear                       │
│                                          │
└──────────────────────────────────────────┘
```

### Categories Page Header Actions

| Action | Purpose | Destination |
|--------|---------|-------------|
| Add Category | Create new category | `/products/categories/new` |
| Import | Bulk import categories | Import modal/page |
| Export | Export category data | Download handler |

### Expected Outcome
- Categories list page route created
- Accessible at `/products/categories` URL
- Page structure ready for component integration
- Tab navigation shows "Categories" as active

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/categories/page.tsx` file created
- [ ] Page component exports properly
- [ ] Route accessible via URL navigation
- [ ] Categories tab appears in products layout
- [ ] Page ready for data integration

---

## Task 09: Create Category Create Page Route

### Overview
Create the new category creation page route. This route provides a form interface for adding new product categories with fields for name, description, parent category selection, slug configuration, image upload, and SEO settings. The page is accessed via /products/categories/new and includes form validation and submission handling.

### Dependencies
- Task 08: Create Categories Page Route

### Instructions

1. **Create new subdirectory**
   - Navigate to `frontend/app/(dashboard)/products/categories/` directory
   - Create new directory named `new`
   - This establishes the `/products/categories/new` route

2. **Create page file**
   - Create `page.tsx` in the `new/` directory
   - This renders the category creation form
   - Use client component if form has interactivity

3. **Define page component**
   - Create default export function `NewCategoryPage`
   - Set up component structure for form layout
   - Prepare state management for form data

4. **Plan form layout sections**
   - Page header with title and breadcrumbs
   - Main form area with input fields
   - Action buttons (Save, Save & Add Another, Cancel)
   - Form validation messages area

5. **Define required form fields**
   - Category Name (required)
   - Slug (auto-generated or manual)
   - Parent Category (dropdown, optional)
   - Description (rich text, optional)
   - Display Order (number)
   - Status (Active/Inactive toggle)

6. **Add optional fields**
   - Category Image upload
   - Meta Title (SEO)
   - Meta Description (SEO)
   - Custom attributes

7. **Implement navigation**
   - Back button to categories list
   - Breadcrumb: Products > Categories > New
   - Cancel button with confirmation if unsaved changes

### Category Create Form Structure

```
┌─────────────────────────────────────────┐
│  Products > Categories > New Category   │
│  ─────────────────────────────────────  │
│                                         │
│  Basic Information                      │
│  ┌───────────────────────────────────┐ │
│  │ Name: [________________]          │ │
│  │ Slug: [________________]          │ │
│  │ Parent: [Select parent... ▼]     │ │
│  │ Status: [●Active ○Inactive]      │ │
│  └───────────────────────────────────┘ │
│                                         │
│  Description                            │
│  ┌───────────────────────────────────┐ │
│  │ [Rich text editor area]           │ │
│  └───────────────────────────────────┘ │
│                                         │
│  SEO Settings                           │
│  ┌───────────────────────────────────┐ │
│  │ Meta Title: [_____________]       │ │
│  │ Meta Description: [_______]       │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Cancel]  [Save & Add Another] [Save] │
└─────────────────────────────────────────┘
```

### Form Field Specifications

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| Name | Text | Yes | Max 100 chars, unique |
| Slug | Text | Yes | URL-safe, unique |
| Parent | Dropdown | No | Valid category ID |
| Description | Rich Text | No | Max 5000 chars |
| Display Order | Number | No | Integer, default 0 |
| Status | Toggle | Yes | Active/Inactive |
| Image | File Upload | No | Image formats only |
| Meta Title | Text | No | Max 70 chars (SEO) |
| Meta Description | Textarea | No | Max 160 chars (SEO) |

### Action Buttons

| Button | Behavior | Validation |
|--------|----------|------------|
| Save | Create category, redirect to list | Full validation required |
| Save & Add Another | Create category, clear form | Full validation required |
| Cancel | Return to list with confirmation | Warn if unsaved changes |

### Form Validation Rules

| Rule | Description |
|------|-------------|
| Required Fields | Name and Slug must be filled |
| Unique Name | Category name must be unique |
| Unique Slug | Slug must be unique across categories |
| Parent Validation | Cannot select self or descendant as parent |
| Circular Reference | Prevent circular parent-child relationships |

### Parent Category Selection

```
Dropdown Structure:
┌──────────────────────────┐
│ [No Parent]             │ ← Root category
│ Electronics             │ ← Top-level
│   ├─ Computers          │ ← Can be parent
│   └─ Mobile Devices     │
│ Clothing                │
│   ├─ Men's Wear         │
│   └─ Women's Wear       │
└──────────────────────────┘
```

### Expected Outcome
- Category creation page route established
- Form layout ready for component integration
- Accessible via "Add Category" button
- Proper navigation and breadcrumbs

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/categories/new/page.tsx` file created
- [ ] Page component exports properly
- [ ] Route accessible at `/products/categories/new`
- [ ] Form structure planned with all required fields
- [ ] Navigation links configured
- [ ] Ready for form component integration

---

## Task 10: Create Category Edit Page Route

### Overview
Create the category edit page route using Next.js dynamic routing. This route allows editing existing categories by loading category data based on the URL parameter (category ID). The page reuses the same form structure as the create page but pre-populates with existing category data. Accessed via /products/categories/[id] path.

### Dependencies
- Task 08: Create Categories Page Route
- Task 09: Create Category Create Page Route

### Instructions

1. **Create dynamic route directory**
   - Navigate to `frontend/app/(dashboard)/products/categories/` directory
   - Create new directory named `[id]` (including brackets)
   - Brackets indicate dynamic route parameter

2. **Create page file**
   - Create `page.tsx` in the `[id]/` directory
   - This file handles `/products/categories/123` style routes
   - ID parameter is accessible via props

3. **Define page component with params**
   - Create async function `EditCategoryPage`
   - Accept params prop containing the dynamic ID
   - Use ID to fetch category data

4. **Implement data loading**
   - Fetch category data by ID from API
   - Handle loading state during data fetch
   - Handle not found scenarios (invalid ID)

5. **Reuse form structure**
   - Use same form layout as create page
   - Pre-populate all fields with fetched data
   - Change page title to "Edit Category"
   - Update breadcrumbs accordingly

6. **Add additional actions**
   - Delete category button (with confirmation)
   - View products in category link
   - Move category to different parent

7. **Handle parent category restrictions**
   - Cannot select self as parent
   - Cannot select own descendants as parent
   - Prevent circular reference issues

### Dynamic Route Structure

```
frontend/app/(dashboard)/products/categories/
├── page.tsx          # List page
├── new/
│   └── page.tsx      # Create page
└── [id]/
    └── page.tsx      # Edit page (THIS FILE)
```

### URL Pattern Examples

| URL | Parameter | Category |
|-----|-----------|----------|
| `/products/categories/123` | id: "123" | Edit Electronics |
| `/products/categories/456` | id: "456" | Edit Computers |
| `/products/categories/789` | id: "789" | Edit Clothing |

### Page Component Props

| Prop | Type | Description |
|------|------|-------------|
| params | object | Contains route parameters |
| params.id | string | Category ID from URL |

### Edit Page Structure

```
┌─────────────────────────────────────────┐
│  Products > Categories > Electronics    │
│  ─────────────────────────────────────  │
│                                         │
│  Basic Information                      │
│  ┌───────────────────────────────────┐ │
│  │ Name: [Electronics___]           │ │
│  │ Slug: [electronics___]           │ │
│  │ Parent: [No Parent___▼]          │ │
│  │ Status: [●Active ○Inactive]      │ │
│  │                                  │ │
│  │ Created: Jan 15, 2026            │ │
│  │ Updated: Jan 20, 2026            │ │
│  │ Products: 145                    │ │
│  └───────────────────────────────────┘ │
│                                         │
│  [Delete] [View Products]  [Cancel] [Save] │
└─────────────────────────────────────────┘
```

### Data Loading Flow

```
1. Extract ID from URL params
    ↓
2. Fetch category data from API
    ↓
3. Check if category exists
    ↓
4. Pre-populate form fields
    ↓
5. Enable editing
```

### Error Handling Scenarios

| Scenario | Response |
|----------|----------|
| Category Not Found | Show 404 error message |
| Invalid ID Format | Redirect to list or show error |
| Permission Denied | Show unauthorized message |
| Load Failure | Show error with retry option |

### Delete Category Confirmation

```
┌──────────────────────────────────────┐
│  ⚠️ Delete Category?                 │
│                                      │
│  Are you sure you want to delete     │
│  "Electronics" category?             │
│                                      │
│  This category has 145 products.     │
│  They will be moved to:              │
│  [Select category... ▼]              │
│                                      │
│        [Cancel]  [Delete Category]   │
└──────────────────────────────────────┘
```

### Parent Selection Rules

| Rule | Implementation |
|------|----------------|
| Cannot Select Self | Filter out current category from dropdown |
| Cannot Select Descendants | Filter out all child categories |
| Valid Parents Only | Show only categories that won't create loops |

### Expected Outcome
- Category edit page with dynamic routing
- Category data loaded and pre-populated
- All form fields editable
- Delete functionality available
- Proper error handling for invalid IDs

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/categories/[id]/page.tsx` file created
- [ ] Page accepts and uses params.id
- [ ] Dynamic route accessible with various IDs
- [ ] Data fetching strategy implemented
- [ ] Form pre-population logic ready
- [ ] Delete action planned
- [ ] Error handling for not found categories

---

## Task 11: Configure Page Metadata

### Overview
Configure Next.js metadata for all product and category pages to improve SEO, social sharing, and browser tab display. This includes static metadata for list pages and dynamic metadata for detail/edit pages that incorporate product/category names. Proper metadata enhances discoverability and provides better user experience.

### Dependencies
- Task 01-10: All route pages created (from both documents)

### Instructions

1. **Understand Next.js metadata API**
   - Static metadata: export const metadata object
   - Dynamic metadata: export async generateMetadata function
   - Template metadata: use %s placeholder for dynamic titles
   - Override behavior: page metadata overrides parent layout

2. **Configure products list metadata**
   - File: `products/page.tsx`
   - Title: "Products - LankaCommerce Cloud"
   - Description: "Manage your product catalog, inventory, and pricing"
   - Add Open Graph tags for social sharing

3. **Configure product create metadata**
   - File: `products/new/page.tsx`
   - Title: "Create Product - LankaCommerce Cloud"
   - Description: "Add new product to your inventory"
   - Set noindex (don't index form pages)

4. **Configure product detail dynamic metadata**
   - File: `products/[id]/page.tsx`
   - Fetch product name from API
   - Title: "{Product Name} - LankaCommerce Cloud"
   - Description: Use product short description
   - Include product image in Open Graph tags

5. **Configure product edit metadata**
   - File: `products/[id]/edit/page.tsx`
   - Title: "Edit {Product Name} - LankaCommerce Cloud"
   - Description: "Edit product details and settings"
   - Set noindex for edit pages

6. **Configure product variants metadata**
   - File: `products/[id]/variants/page.tsx`
   - Title: "{Product Name} Variants - LankaCommerce Cloud"
   - Description: "Manage product variants and options"

7. **Configure categories list metadata**
   - File: `categories/page.tsx`
   - Title: "Product Categories - LankaCommerce Cloud"
   - Description: "Organize products with hierarchical categories"

8. **Configure category create metadata**
   - File: `categories/new/page.tsx`
   - Title: "Create Category - LankaCommerce Cloud"
   - Description: "Add new product category"
   - Set noindex

9. **Configure category edit metadata**
   - File: `categories/[id]/page.tsx`
   - Title: "Edit {Category Name} - LankaCommerce Cloud"
   - Description: "Edit category details and hierarchy"
   - Set noindex

10. **Add metadata template in layout**
    - File: `products/layout.tsx`
    - Set template for title pattern
    - Configure default Open Graph image
    - Set application name and locale

### Metadata Types by Page

| Page Type | Metadata Type | Title Format |
|-----------|---------------|--------------|
| List Pages | Static | "{Page} - LCC" |
| Create Pages | Static | "Create {Entity} - LCC" |
| Detail Pages | Dynamic | "{Name} - LCC" |
| Edit Pages | Dynamic | "Edit {Name} - LCC" |

### Static Metadata Structure

```typescript
export const metadata = {
  title: "Products - LankaCommerce Cloud",
  description: "Manage your product catalog",
  robots: "index, follow",
  openGraph: {
    title: "Products",
    description: "Manage your product catalog",
    type: "website"
  }
}
```

### Dynamic Metadata Structure

```typescript
export async function generateMetadata({ params }) {
  const product = await fetchProduct(params.id);
  
  return {
    title: `${product.name} - LankaCommerce Cloud`,
    description: product.description,
    openGraph: {
      title: product.name,
      images: [product.image]
    }
  }
}
```

### Metadata Fields Configuration

| Field | Purpose | Example |
|-------|---------|---------|
| title | Browser tab, bookmarks | "Products - LCC" |
| description | Search results snippet | "Manage product catalog" |
| keywords | Search engine indexing | "products, inventory, ERP" |
| robots | Search engine behavior | "index, follow" or "noindex" |
| openGraph.title | Social media cards | "Product Management" |
| openGraph.description | Social media preview | "View and manage products" |
| openGraph.image | Social media thumbnail | Product/logo image URL |
| canonical | Duplicate content handling | Absolute URL to page |

### Page-Specific Metadata

#### Products List Page
- Title: "Products - LankaCommerce Cloud"
- Description: "Manage your product catalog, inventory, pricing, and stock levels"
- Robots: index, follow
- Keywords: products, inventory, catalog, ERP

#### Product Create Page
- Title: "Create Product - LankaCommerce Cloud"
- Description: "Add new product to your inventory catalog"
- Robots: noindex (don't index forms)

#### Product Detail Page (Dynamic)
- Title: "{Product Name} - LankaCommerce Cloud"
- Description: "{Product short description or first 160 chars}"
- Image: Product primary image URL
- Robots: index, follow

#### Product Edit Page (Dynamic)
- Title: "Edit {Product Name} - LankaCommerce Cloud"
- Description: "Edit product details, pricing, and inventory"
- Robots: noindex

#### Categories Page
- Title: "Product Categories - LankaCommerce Cloud"
- Description: "Organize and manage product categories hierarchically"
- Robots: index, follow

#### Category Edit Page (Dynamic)
- Title: "Edit {Category Name} - LankaCommerce Cloud"
- Description: "Edit category settings and hierarchy"
- Robots: noindex

### SEO Best Practices

| Practice | Implementation |
|----------|----------------|
| Title Length | Keep under 60 characters |
| Description Length | Keep under 160 characters |
| Unique Titles | Each page should have unique title |
| No Index Forms | Set noindex on create/edit pages |
| Dynamic Content | Include entity names in titles |
| Mobile Friendly | Ensure responsive viewport meta tag |

### Open Graph Tags

```
Essential OG Tags:
├── og:title (Page title for social media)
├── og:description (Preview description)
├── og:image (Preview image, 1200x630 recommended)
├── og:url (Canonical URL of page)
└── og:type (website, article, product)
```

### Metadata Inheritance

```
Root Layout (app/layout.tsx)
    │
    ├─ Default site metadata
    │  └─ Application name: LankaCommerce Cloud
    │
    └─ Dashboard Layout (app/(dashboard)/layout.tsx)
        │
        └─ Products Layout (products/layout.tsx)
            │
            ├─ Metadata template: %s - LCC
            │
            └─ Product Pages (page.tsx)
                │
                └─ Page-specific metadata overrides
```

### Expected Outcome
- All pages have proper metadata configured
- SEO-friendly titles and descriptions
- Dynamic titles include entity names
- Form pages set to noindex
- Social sharing previews work correctly

### Verification Checklist
- [ ] Products list metadata configured
- [ ] Product create metadata with noindex
- [ ] Product detail dynamic metadata
- [ ] Product edit dynamic metadata
- [ ] Product variants metadata
- [ ] Categories list metadata
- [ ] Category create metadata with noindex
- [ ] Category edit dynamic metadata
- [ ] Open Graph tags added where appropriate
- [ ] Title lengths under 60 characters
- [ ] Description lengths under 160 characters

---

## Task 12: Create Product Loading States

### Overview
Create loading.tsx files for product pages to provide instant feedback while data is being fetched. Next.js automatically wraps pages in Suspense boundaries and displays loading states during server-side data loading. Implement skeleton screens that match the actual page layout to create seamless loading experiences without layout shift.

### Dependencies
- Task 01-10: All route pages created

### Instructions

1. **Understand Next.js loading.tsx convention**
   - Placed alongside page.tsx files
   - Automatically shown during Suspense
   - Should match page layout structure
   - Use skeleton components for placeholders

2. **Create products list loading state**
   - File: `products/loading.tsx`
   - Match layout of data table
   - Show skeleton rows for products
   - Include skeleton for search/filter controls

3. **Create product detail loading state**
   - File: `products/[id]/loading.tsx`
   - Match product detail page layout
   - Show skeleton for product information
   - Include placeholders for images and specs

4. **Create product form loading state**
   - Used for: `products/new/loading.tsx` and `products/[id]/edit/loading.tsx`
   - Match form layout structure
   - Show skeleton for form fields
   - Include placeholder action buttons

5. **Create categories loading state**
   - File: `categories/loading.tsx`
   - Match category tree structure
   - Show skeleton hierarchy items
   - Animate for better perception

6. **Implement skeleton components**
   - Create reusable Skeleton component
   - Support different shapes (text, rectangle, circle)
   - Add subtle pulse animation
   - Ensure accessibility (aria-busy, aria-live)

7. **Match loading to actual layout**
   - Use same spacing and dimensions
   - Maintain consistent grid/flex structure
   - Prevent layout shift when content loads
   - Test with various content types

### Loading State Locations

| Page | Loading File | Loading Type |
|------|--------------|--------------|
| Products List | `products/loading.tsx` | Table skeleton |
| Product Create | `products/new/loading.tsx` | Form skeleton |
| Product Detail | `products/[id]/loading.tsx` | Detail skeleton |
| Product Edit | `products/[id]/edit/loading.tsx` | Form skeleton |
| Product Variants | `products/[id]/variants/loading.tsx` | Variants skeleton |
| Categories | `categories/loading.tsx` | Tree skeleton |
| Category Create | `categories/new/loading.tsx` | Form skeleton |
| Category Edit | `categories/[id]/loading.tsx` | Form skeleton |

### Products List Loading Skeleton

```
┌──────────────────────────────────────────┐
│  [▓▓▓▓▓▓▓▓]              [▓▓▓] [▓▓▓]    │
│  ────────────────────────────────────    │
│                                          │
│  [▓▓▓▓▓]  [▓▓▓▓▓▓]  [▓▓▓]                │
│  ────────────────────────────────────    │
│                                          │
│  ┌────────────────────────────────────┐ │
│  │ [▓▓▓▓] [▓▓▓▓▓▓] [▓▓▓] [▓▓▓] [▓▓▓] │ │
│  │ [▓▓▓▓] [▓▓▓▓▓▓] [▓▓▓] [▓▓▓] [▓▓▓] │ │
│  │ [▓▓▓▓] [▓▓▓▓▓▓] [▓▓▓] [▓▓▓] [▓▓▓] │ │
│  │ [▓▓▓▓] [▓▓▓▓▓▓] [▓▓▓] [▓▓▓] [▓▓▓] │ │
│  │ [▓▓▓▓] [▓▓▓▓▓▓] [▓▓▓] [▓▓▓] [▓▓▓] │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [▓▓▓] [▓▓▓] [▓▓▓]                       │
└──────────────────────────────────────────┘
   ▲                ▲               ▲
   Header         Table           Pagination
```

### Product Detail Loading Skeleton

```
┌──────────────────────────────────────────┐
│  [▓▓▓] > [▓▓▓▓▓] > [▓▓▓▓▓▓▓]            │
│  ────────────────────────────────────    │
│                                          │
│  ┌─────────────┐  ┌─────────────────┐   │
│  │             │  │ [▓▓▓▓▓▓▓▓▓▓▓] │   │
│  │   [▓▓▓▓]    │  │                 │   │
│  │             │  │ [▓▓▓▓▓▓]        │   │
│  │             │  │ [▓▓▓▓▓▓▓▓▓▓▓] │   │
│  └─────────────┘  │                 │   │
│                   │ [▓▓▓] [▓▓▓▓▓]   │   │
│  [▓] [▓] [▓] [▓]  └─────────────────┘   │
└──────────────────────────────────────────┘
   ▲                ▲
   Images           Details
```

### Form Loading Skeleton

```
┌──────────────────────────────────────────┐
│  [▓▓▓▓▓▓▓▓▓]                            │
│  ────────────────────────────────────    │
│                                          │
│  [▓▓▓▓▓]                                 │
│  ┌────────────────────────────────────┐ │
│  │ [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [▓▓▓▓▓]                                 │
│  ┌────────────────────────────────────┐ │
│  │ [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]       │ │
│  └────────────────────────────────────┘ │
│                                          │
│  [▓▓▓▓▓▓]                                │
│  ┌────────────────────────────────────┐ │
│  │ [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]       │ │
│  │ [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]       │ │
│  │ [▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓]       │ │
│  └────────────────────────────────────┘ │
│                                          │
│         [▓▓▓▓▓▓▓]  [▓▓▓▓▓▓▓]            │
└──────────────────────────────────────────┘
```

### Category Tree Loading Skeleton

```
┌──────────────────────────────────────────┐
│  [▓▓▓▓▓▓▓▓▓▓▓▓]          [▓▓▓]          │
│  ────────────────────────────────────    │
│                                          │
│  📁 [▓▓▓▓▓▓▓▓▓▓▓▓]                       │
│    ├─ [▓▓▓▓▓▓▓▓]                         │
│    │   ├─ [▓▓▓▓▓▓]                       │
│    │   └─ [▓▓▓▓▓▓▓]                      │
│    └─ [▓▓▓▓▓▓▓▓▓]                        │
│                                          │
│  📁 [▓▓▓▓▓▓▓▓▓]                          │
│    ├─ [▓▓▓▓▓▓▓]                          │
│    └─ [▓▓▓▓▓▓▓▓]                         │
└──────────────────────────────────────────┘
```

### Skeleton Component Props

| Prop | Type | Values | Description |
|------|------|--------|-------------|
| variant | string | "text", "rectangular", "circular" | Shape type |
| width | string/number | CSS value | Width of skeleton |
| height | string/number | CSS value | Height of skeleton |
| animation | string | "pulse", "wave", "none" | Animation type |
| className | string | Tailwind classes | Additional styling |

### Skeleton Animation

```css
Pulse Animation:
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.4; }
}

Wave Animation:
@keyframes wave {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
```

### Accessibility Considerations

| Feature | Implementation |
|---------|----------------|
| ARIA Labels | `aria-label="Loading..."` |
| Live Region | `aria-live="polite"` |
| Busy State | `aria-busy="true"` |
| Screen Reader | Announce loading state |

### Loading State Best Practices

| Practice | Implementation |
|----------|----------------|
| Match Layout | Same structure as actual content |
| Prevent Shift | Use exact dimensions |
| Subtle Animation | Pulse or wave, not distracting |
| Fast Appearance | Show immediately, no delay |
| Accessible | Proper ARIA attributes |

### Expected Outcome
- Loading states for all product/category pages
- Skeleton screens match actual layouts
- Smooth loading transitions without shift
- Accessible loading indicators
- Professional loading experience

### Verification Checklist
- [ ] Products list loading.tsx created
- [ ] Product detail loading.tsx created
- [ ] Product create loading.tsx created
- [ ] Product edit loading.tsx created
- [ ] Categories loading.tsx created
- [ ] Category create loading.tsx created
- [ ] Category edit loading.tsx created
- [ ] Skeleton components match page layouts
- [ ] Loading animations implemented
- [ ] ARIA attributes added for accessibility
- [ ] No layout shift when content loads
- [ ] Loading states appear instantly

---

## Task 13: Create Product Error States

### Overview
Create error.tsx files for product pages to handle and display errors gracefully. Next.js error boundaries automatically catch errors during rendering, data fetching, or event handling. Implement user-friendly error messages with recovery options like retry buttons, navigation back to list, or contact support. Errors should be logged for debugging while presenting helpful information to users.

### Dependencies
- Task 01-10: All route pages created
- Task 12: Create Product Loading States

### Instructions

1. **Understand Next.js error.tsx convention**
   - Must be client component ('use client')
   - Receives error and reset props
   - Automatically wraps pages in error boundary
   - Catches synchronous and asynchronous errors

2. **Create products error boundary**
   - File: `products/error.tsx`
   - Handle product list loading errors
   - Show error message and retry option
   - Include navigation back to dashboard

3. **Create product detail error boundary**
   - File: `products/[id]/error.tsx`
   - Handle product not found scenarios
   - Display user-friendly "Product not found" message
   - Provide link back to product list

4. **Create categories error boundary**
   - File: `categories/error.tsx`
   - Handle category loading errors
   - Show retry option for transient failures
   - Navigate back to products on cancel

5. **Implement error component structure**
   - Error icon/illustration
   - Error heading and description
   - Error details (in development only)
   - Action buttons (Retry, Go Back, Home)

6. **Add error logging**
   - Log errors to console in development
   - Send to error tracking service (production)
   - Include error context and stack trace
   - Avoid exposing sensitive information

7. **Handle different error types**
   - Not Found (404): Entity doesn't exist
   - Unauthorized (401/403): Permission denied
   - Server Error (500): Backend failure
   - Network Error: Connection issues
   - Validation Error: Invalid data

### Error Boundary Locations

| Page | Error File | Error Context |
|------|------------|---------------|
| Products List | `products/error.tsx` | List loading failure |
| Product Create | `products/new/error.tsx` | Form initialization error |
| Product Detail | `products/[id]/error.tsx` | Product not found/load error |
| Product Edit | `products/[id]/edit/error.tsx` | Edit page load error |
| Product Variants | `products/[id]/variants/error.tsx` | Variants load error |
| Categories | `categories/error.tsx` | Categories load error |
| Category Create | `categories/new/error.tsx` | Form initialization error |
| Category Edit | `categories/[id]/error.tsx` | Category not found/load error |

### Error Component Props

| Prop | Type | Description |
|------|------|-------------|
| error | Error | JavaScript Error object |
| reset | function | Function to retry operation |

### Generic Error Display

```
┌──────────────────────────────────────────┐
│                                          │
│              ⚠️                          │
│                                          │
│    Something Went Wrong                  │
│                                          │
│    We encountered an error while         │
│    loading this page. Please try         │
│    again or return to the product list.  │
│                                          │
│    [Try Again]  [Back to Products]       │
│                                          │
└──────────────────────────────────────────┘
```

### Not Found Error (Product)

```
┌──────────────────────────────────────────┐
│                                          │
│              🔍                          │
│                                          │
│    Product Not Found                     │
│                                          │
│    The product you're looking for       │
│    doesn't exist or has been removed.   │
│                                          │
│    Product ID: 12345                     │
│                                          │
│    [Back to Products]  [Home]            │
│                                          │
└──────────────────────────────────────────┘
```

### Permission Error

```
┌──────────────────────────────────────────┐
│                                          │
│              🔒                          │
│                                          │
│    Access Denied                         │
│                                          │
│    You don't have permission to view     │
│    this page. Please contact your        │
│    administrator if you need access.     │
│                                          │
│    [Back to Products]  [Contact Support] │
│                                          │
└──────────────────────────────────────────┘
```

### Network Error

```
┌──────────────────────────────────────────┐
│                                          │
│              📡                          │
│                                          │
│    Connection Error                      │
│                                          │
│    Unable to connect to the server.      │
│    Please check your internet            │
│    connection and try again.             │
│                                          │
│    [Try Again]  [Back to Products]       │
│                                          │
└──────────────────────────────────────────┘
```

### Error Type Detection

| Error Type | Detection Method | User Message |
|------------|------------------|--------------|
| Not Found | Status 404 or specific error | "Product not found" |
| Unauthorized | Status 401/403 | "Access denied" |
| Server Error | Status 500 | "Server error occurred" |
| Network Error | Network exception | "Connection error" |
| Validation | Validation error | "Invalid data" |
| Unknown | All other errors | "Something went wrong" |

### Error Component Structure

```
ErrorComponent
├── Error Icon/Illustration
│   └── Different icon per error type
│
├── Error Heading
│   └── User-friendly title
│
├── Error Description
│   └── Clear explanation of issue
│
├── Error Details (Dev Only)
│   ├── Error message
│   └── Stack trace
│
└── Action Buttons
    ├── Retry (calls reset())
    ├── Go Back
    └── Navigate to safe page
```

### Action Buttons by Context

| Context | Primary Action | Secondary Action | Tertiary Action |
|---------|---------------|------------------|-----------------|
| List Load Error | Try Again | Go to Dashboard | - |
| Detail Not Found | Back to List | Go to Dashboard | - |
| Create Error | Try Again | Cancel | - |
| Edit Error | Try Again | View Details | Back to List |
| Permission Error | Go Back | Contact Support | - |

### Error Logging Strategy

| Environment | Logging Approach |
|-------------|------------------|
| Development | Console.error with full details |
| Staging | Send to error tracking + console |
| Production | Send to error tracking only |

### Error Logging Data

```typescript
Log Structure:
{
  timestamp: Date,
  errorType: string,
  message: string,
  stack: string,
  url: string,
  userId: string,
  context: {
    route: string,
    params: object,
    userAgent: string
  }
}
```

### Error Recovery Flow

```
Error Occurs
    │
    ├─ Display Error UI
    │   ├─ Show user-friendly message
    │   ├─ Hide technical details (prod)
    │   └─ Present action options
    │
    ├─ Log Error
    │   ├─ Console (dev)
    │   └─ Error tracking (prod)
    │
    └─ Wait for User Action
        ├─ Retry → Call reset()
        ├─ Go Back → router.back()
        └─ Navigate → router.push()
```

### Accessibility in Error States

| Feature | Implementation |
|---------|----------------|
| Focus Management | Auto-focus retry button |
| ARIA Role | `role="alert"` on error container |
| Error Announcement | Screen reader announces error |
| Keyboard Navigation | All actions keyboard accessible |

### Error Display Best Practices

| Practice | Implementation |
|----------|----------------|
| User-Friendly | No technical jargon |
| Actionable | Provide clear next steps |
| Contextual | Tailor message to situation |
| Honest | Don't hide errors completely |
| Helpful | Suggest solutions |

### Expected Outcome
- Error boundaries for all product/category routes
- User-friendly error messages without technical details
- Recovery options (retry, navigate back)
- Errors logged appropriately per environment
- Graceful degradation on failures

### Verification Checklist
- [ ] Products list error.tsx created
- [ ] Product detail error.tsx created
- [ ] Product create error.tsx created
- [ ] Product edit error.tsx created
- [ ] Categories error.tsx created
- [ ] Category create error.tsx created
- [ ] Category edit error.tsx created
- [ ] Error components are client components
- [ ] Error and reset props handled correctly
- [ ] User-friendly error messages displayed
- [ ] Retry functionality implemented
- [ ] Navigation options provided
- [ ] Error logging configured
- [ ] Different error types handled appropriately
- [ ] Accessibility features implemented

---

## Task 14: Verify Route Structure

### Overview
Conduct comprehensive verification of the entire products route structure to ensure all pages are accessible, properly configured, and functioning as expected. This includes testing navigation between routes, verifying layouts are applied correctly, checking metadata displays properly, confirming loading and error states work, and validating dynamic routes with various IDs.

### Dependencies
- Task 01-13: All previous tasks completed

### Instructions

1. **Verify directory structure**
   - Check all directories exist as planned
   - Confirm naming conventions followed
   - Ensure proper nesting of routes
   - Validate dynamic route folders use [brackets]

2. **Test static routes**
   - Navigate to `/products` (list page)
   - Navigate to `/products/new` (create page)
   - Navigate to `/products/categories` (categories list)
   - Navigate to `/products/categories/new` (category create)
   - Verify each page renders without errors

3. **Test dynamic routes**
   - Navigate to `/products/123` (product detail)
   - Navigate to `/products/123/edit` (product edit)
   - Navigate to `/products/123/variants` (product variants)
   - Navigate to `/products/categories/456` (category edit)
   - Test with various valid and invalid IDs

4. **Verify layout application**
   - Confirm products layout wraps all product pages
   - Check tabs appear on all pages (Products, Categories)
   - Verify active tab highlights correctly
   - Ensure dashboard layout wraps products layout

5. **Test navigation flow**
   - Click "New Product" button → Goes to create page
   - Click product row → Goes to detail page
   - Click "Edit" button → Goes to edit page
   - Click breadcrumb links → Navigates correctly
   - Use browser back/forward buttons

6. **Verify metadata**
   - Check browser tab titles for each page
   - Verify page titles match expectations
   - Inspect metadata in browser dev tools
   - Confirm dynamic titles show entity names

7. **Test loading states**
   - Trigger data fetching operations
   - Verify loading skeletons appear
   - Confirm skeletons match page layout
   - Check loading states don't cause layout shift

8. **Test error states**
   - Navigate to non-existent product ID
   - Simulate network errors (dev tools)
   - Verify error boundaries catch errors
   - Test retry and navigation buttons

9. **Test responsive behavior**
   - View pages on mobile viewport
   - Check tablet viewport layout
   - Verify desktop layout
   - Ensure all breakpoints work correctly

10. **Verify accessibility**
    - Test keyboard navigation through pages
    - Use screen reader to navigate
    - Check focus indicators visible
    - Verify ARIA labels present

11. **Document any issues**
    - Note missing files or routes
    - Record unexpected behaviors
    - List accessibility problems
    - Document performance issues

12. **Create verification report**
    - List all tested routes with status
    - Document test results for each feature
    - Note pass/fail for each requirement
    - Provide recommendations for fixes

### Directory Structure Verification

```
✓ Check this structure exists:

frontend/app/(dashboard)/products/
├── ✓ layout.tsx
├── ✓ page.tsx
├── ✓ loading.tsx
├── ✓ error.tsx
├── ✓ new/
│   ├── ✓ page.tsx
│   ├── ✓ loading.tsx
│   └── ✓ error.tsx
├── ✓ [id]/
│   ├── ✓ page.tsx
│   ├── ✓ loading.tsx
│   ├── ✓ error.tsx
│   ├── ✓ edit/
│   │   ├── ✓ page.tsx
│   │   ├── ✓ loading.tsx
│   │   └── ✓ error.tsx
│   └── ✓ variants/
│       ├── ✓ page.tsx
│       ├── ✓ loading.tsx
│       └── ✓ error.tsx
└── ✓ categories/
    ├── ✓ page.tsx
    ├── ✓ loading.tsx
    ├── ✓ error.tsx
    ├── ✓ new/
    │   ├── ✓ page.tsx
    │   ├── ✓ loading.tsx
    │   └── ✓ error.tsx
    └── ✓ [id]/
        ├── ✓ page.tsx
        ├── ✓ loading.tsx
        └── ✓ error.tsx
```

### Route Testing Checklist

| Route | URL | Expected Result | Status |
|-------|-----|-----------------|--------|
| Products List | `/products` | Show product table | [ ] |
| Product Create | `/products/new` | Show create form | [ ] |
| Product Detail | `/products/[id]` | Show product details | [ ] |
| Product Edit | `/products/[id]/edit` | Show edit form | [ ] |
| Product Variants | `/products/[id]/variants` | Show variants list | [ ] |
| Categories List | `/products/categories` | Show category tree | [ ] |
| Category Create | `/products/categories/new` | Show create form | [ ] |
| Category Edit | `/products/categories/[id]` | Show edit form | [ ] |

### Layout Verification

| Aspect | Expected | Verification |
|--------|----------|--------------|
| Products Layout | Wraps all pages | [ ] |
| Tab Navigation | Shows on all pages | [ ] |
| Active Tab | Highlights correctly | [ ] |
| Dashboard Layout | Wraps products | [ ] |
| Breadcrumbs | Show on all pages | [ ] |

### Metadata Verification

| Page | Expected Title | Actual | Status |
|------|----------------|--------|--------|
| Products List | "Products - LCC" | | [ ] |
| Product Create | "Create Product - LCC" | | [ ] |
| Product Detail | "{Name} - LCC" | | [ ] |
| Product Edit | "Edit {Name} - LCC" | | [ ] |
| Categories | "Product Categories - LCC" | | [ ] |
| Category Create | "Create Category - LCC" | | [ ] |
| Category Edit | "Edit {Name} - LCC" | | [ ] |

### Navigation Flow Testing

```
Start: /products
    │
    ├─ Click "New Product"
    │   └─ Navigate to: /products/new ✓
    │
    ├─ Click product row
    │   └─ Navigate to: /products/123 ✓
    │       │
    │       ├─ Click "Edit"
    │       │   └─ Navigate to: /products/123/edit ✓
    │       │
    │       └─ Click "Variants"
    │           └─ Navigate to: /products/123/variants ✓
    │
    └─ Click "Categories" tab
        └─ Navigate to: /products/categories ✓
            │
            ├─ Click "New Category"
            │   └─ Navigate to: /products/categories/new ✓
            │
            └─ Click category row
                └─ Navigate to: /products/categories/456 ✓
```

### Loading State Testing

| Page | Trigger | Expected Skeleton | Status |
|------|---------|-------------------|--------|
| Products List | Navigate to page | Table skeleton | [ ] |
| Product Detail | Navigate with ID | Detail skeleton | [ ] |
| Product Edit | Navigate to edit | Form skeleton | [ ] |
| Categories | Navigate to page | Tree skeleton | [ ] |

### Error State Testing

| Scenario | Expected Error | Recovery Options | Status |
|----------|----------------|------------------|--------|
| Invalid Product ID | "Product not found" | Back to list | [ ] |
| Invalid Category ID | "Category not found" | Back to list | [ ] |
| Network Failure | "Connection error" | Retry, Go back | [ ] |
| Server Error | "Server error" | Retry, Go back | [ ] |

### Responsive Testing

| Viewport | Size | Layout Check | Status |
|----------|------|--------------|--------|
| Mobile | 375px | Stacked layout, no tabs | [ ] |
| Tablet | 768px | Adapted layout, visible tabs | [ ] |
| Desktop | 1440px | Full layout, all features | [ ] |

### Accessibility Testing

| Feature | Test Method | Expected | Status |
|---------|-------------|----------|--------|
| Keyboard Nav | Tab through pages | All interactive elements focusable | [ ] |
| Focus Indicators | Tab to buttons | Visible focus rings | [ ] |
| Screen Reader | Use NVDA/JAWS | Proper announcements | [ ] |
| ARIA Labels | Inspect elements | Present and descriptive | [ ] |
| Heading Hierarchy | Check heading levels | Proper h1-h6 structure | [ ] |

### Performance Verification

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Initial Load | < 2s | | [ ] |
| Route Transition | < 500ms | | [ ] |
| Loading State Display | Instant | | [ ] |
| Error Recovery | < 1s | | [ ] |

### Browser Compatibility

| Browser | Version | Tested | Issues | Status |
|---------|---------|--------|--------|--------|
| Chrome | Latest | [ ] | | [ ] |
| Firefox | Latest | [ ] | | [ ] |
| Safari | Latest | [ ] | | [ ] |
| Edge | Latest | [ ] | | [ ] |

### Testing Tools

| Tool | Purpose |
|------|---------|
| Browser DevTools | Inspect metadata, network, console |
| React DevTools | Check component tree, props |
| Network Tab | Monitor API calls, loading times |
| Lighthouse | Performance, accessibility scores |
| Axe DevTools | Accessibility audit |
| Screen Reader | NVDA, JAWS, or VoiceOver |

### Issue Tracking Template

```
Issue #: [Number]
Route: [Affected route]
Category: [Bug/Enhancement/Accessibility]
Severity: [High/Medium/Low]
Description: [Clear description of issue]
Steps to Reproduce:
  1. [Step 1]
  2. [Step 2]
Expected: [Expected behavior]
Actual: [Actual behavior]
Fix Required: [Yes/No]
```

### Verification Report Template

```
PRODUCTS MODULE ROUTE VERIFICATION REPORT
Generated: [Date]

SUMMARY
├── Total Routes Tested: [Number]
├── Routes Passing: [Number]
├── Routes Failing: [Number]
└── Overall Status: [Pass/Fail]

ROUTE STATUS
├── Products List: [✓/✗]
├── Product Create: [✓/✗]
├── Product Detail: [✓/✗]
├── Product Edit: [✓/✗]
├── Product Variants: [✓/✗]
├── Categories List: [✓/✗]
├── Category Create: [✓/✗]
└── Category Edit: [✓/✗]

FEATURE VERIFICATION
├── Layouts: [✓/✗]
├── Metadata: [✓/✗]
├── Loading States: [✓/✗]
├── Error States: [✓/✗]
├── Navigation: [✓/✗]
├── Responsive: [✓/✗]
└── Accessibility: [✓/✗]

ISSUES FOUND
[List of issues]

RECOMMENDATIONS
[List of recommended fixes or improvements]
```

### Expected Outcome
- All routes verified and functional
- Navigation flows work correctly
- Layouts applied properly
- Metadata displays correctly
- Loading and error states work
- Responsive design functions
- Accessibility requirements met
- Comprehensive verification report created

### Verification Checklist
- [ ] Directory structure verified
- [ ] All static routes tested
- [ ] All dynamic routes tested with various IDs
- [ ] Layout application verified
- [ ] Tab navigation tested
- [ ] Breadcrumb navigation tested
- [ ] Metadata verified on all pages
- [ ] Loading states tested and functional
- [ ] Error states tested with retry
- [ ] Responsive design tested (mobile, tablet, desktop)
- [ ] Keyboard navigation tested
- [ ] Screen reader compatibility verified
- [ ] Focus indicators visible
- [ ] Performance acceptable
- [ ] Browser compatibility verified
- [ ] Issues documented
- [ ] Verification report created

---

## Summary

This document completed the product module route structure by creating category management routes, configuring comprehensive metadata for SEO, implementing loading states with skeleton screens, creating error boundaries with recovery options, and conducting thorough verification of the entire route system. These elements ensure a professional, accessible, and user-friendly product management interface.

### Completed Tasks
8. ✓ Created categories page route with hierarchical display
9. ✓ Created category create page route with form
10. ✓ Created category edit page route with dynamic routing
11. ✓ Configured page metadata for all product and category pages
12. ✓ Created loading states matching actual page layouts
13. ✓ Created error boundaries with user-friendly messages
14. ✓ Verified complete route structure functionality

### Next Steps
Proceed to **Group-B_Product-Listing-Page** to implement the product listing UI components including data tables, search functionality, filters, sorting, pagination, and bulk actions.

---

## Related Documentation

- **Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md) - Group overview and task summary
- **Previous:** [01_Tasks-01-07_Product-Routes.md](01_Tasks-01-07_Product-Routes.md) - Product route creation
- **SubPhase:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md) - Complete SubPhase-08 overview
- **Phase:** [00_SUBPHASES_SUMMARY.md](../../00_SUBPHASES_SUMMARY.md) - Phase-07 summary

---

**Document Complete** ✓
