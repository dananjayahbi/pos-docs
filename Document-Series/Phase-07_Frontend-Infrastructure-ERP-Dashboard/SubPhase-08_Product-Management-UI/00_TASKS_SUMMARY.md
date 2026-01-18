# SubPhase 08: Product Management UI - Tasks Summary

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase Index:** 08 of 14  
> **SubPhase Goal:** Build product management interfaces including listing, creation, editing, variants, and category management  
> **Total Tasks:** 96 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-07_Dashboard-Layout](../SubPhase-07_Dashboard-Layout/)
- **→ Next SubPhase:** [SubPhase-09_Inventory-Management-UI](../SubPhase-09_Inventory-Management-UI/)

---

## SubPhase Overview

This sub-phase creates the complete product management module UI for the ERP dashboard. It includes product listing with data tables, product creation/editing forms, variant management, category management, and bulk operations. This is one of the core modules of the ERP system.

### Key Outcomes
- Product listing page with data table
- Product creation form with validation
- Product editing form with all fields
- Variant management interface
- Category management CRUD
- Image upload and management
- Bulk actions (delete, update status)
- Import/export functionality
- Search and advanced filtering

### Technology Context
- **Data Table:** TanStack Table with server-side operations
- **Forms:** React Hook Form + Zod
- **Image Upload:** Drag-drop with preview
- **State:** TanStack Query for server state
- **API:** Product service from SubPhase-04

### Product Data Structure
- Basic info: name, SKU, description, status
- Pricing: cost, price, tax category
- Inventory: track stock, reorder point
- Categorization: categories, tags
- Media: images, documents
- Variants: size, color, etc.

---

## Task Execution Order

```
TASK GROUP A: Product Routes & Pages Structure (Tasks 01-14)
        │
        ▼
TASK GROUP B: Product Listing Page (Tasks 15-34)
        │
        ▼
TASK GROUP C: Product Form & Creation (Tasks 35-54)
        │
        ▼
TASK GROUP D: Product Editing & Details (Tasks 55-70)
        │
        ▼
TASK GROUP E: Variant & Category Management (Tasks 71-86)
        │
        ▼
TASK GROUP F: Import/Export & Testing (Tasks 87-96)
```

---

## Task Index

### Group A: Product Routes & Pages Structure (Tasks 01-14)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Products Route Directory** | Set up app/(dashboard)/products/ directory | SubPhase-07 | 🔴 Not Created |
| 02 | **Create Products Layout** | Layout for product pages with tabs | Task 01 | 🔴 Not Created |
| 03 | **Create Products List Page Route** | Create products/page.tsx for listing | Task 01 | 🔴 Not Created |
| 04 | **Create Product Create Page Route** | Create products/new/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create Product Detail Page Route** | Create products/[id]/page.tsx | Task 01 | 🔴 Not Created |
| 06 | **Create Product Edit Page Route** | Create products/[id]/edit/page.tsx | Task 05 | 🔴 Not Created |
| 07 | **Create Product Variants Page Route** | Create products/[id]/variants/page.tsx | Task 05 | 🔴 Not Created |
| 08 | **Create Categories Page Route** | Create products/categories/page.tsx | Task 01 | 🔴 Not Created |
| 09 | **Create Category Create Page Route** | Create products/categories/new/page.tsx | Task 08 | 🔴 Not Created |
| 10 | **Create Category Edit Page Route** | Create products/categories/[id]/page.tsx | Task 08 | 🔴 Not Created |
| 11 | **Configure Page Metadata** | Set up SEO metadata for all pages | Task 01 | 🔴 Not Created |
| 12 | **Create Product Loading States** | Loading.tsx for product pages | Task 01 | 🔴 Not Created |
| 13 | **Create Product Error States** | Error.tsx for product pages | Task 01 | 🔴 Not Created |
| 14 | **Verify Route Structure** | Test all routes are accessible | Task 13 | 🔴 Not Created |

---

### Group B: Product Listing Page (Tasks 15-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 15 | **Create Product List Page Component** | Main product listing page component | Task 14 | 🔴 Not Created |
| 16 | **Create Product List Header** | Page header with title and create button | Task 15 | 🔴 Not Created |
| 17 | **Create Product Filters Bar** | Toolbar with search and filters | Task 15 | 🔴 Not Created |
| 18 | **Create Search Input** | Search by name, SKU, description | Task 17 | 🔴 Not Created |
| 19 | **Create Status Filter** | Filter by product status (active, draft, archived) | Task 17 | 🔴 Not Created |
| 20 | **Create Category Filter** | Filter by product category | Task 17 | 🔴 Not Created |
| 21 | **Create Stock Filter** | Filter by stock level (all, low, out of stock) | Task 17 | 🔴 Not Created |
| 22 | **Create Clear Filters Button** | Button to reset all filters | Task 17 | 🔴 Not Created |
| 23 | **Create Product Data Table** | TanStack Table for product listing | Task 15 | 🔴 Not Created |
| 24 | **Define Product Table Columns** | Name, SKU, Category, Price, Stock, Status, Actions | Task 23 | 🔴 Not Created |
| 25 | **Create Product Name Cell** | Cell with image thumbnail and name | Task 24 | 🔴 Not Created |
| 26 | **Create Price Cell** | Cell with formatted LKR price | Task 24 | 🔴 Not Created |
| 27 | **Create Stock Cell** | Cell with stock level and indicator | Task 24 | 🔴 Not Created |
| 28 | **Create Status Badge Cell** | Cell with status badge (active/draft/archived) | Task 24 | 🔴 Not Created |
| 29 | **Create Actions Cell** | Cell with edit, delete, view actions | Task 24 | 🔴 Not Created |
| 30 | **Implement Table Sorting** | Sort by name, price, stock, created date | Task 23 | 🔴 Not Created |
| 31 | **Implement Table Pagination** | Server-side pagination controls | Task 23 | 🔴 Not Created |
| 32 | **Implement Row Selection** | Checkbox selection for bulk actions | Task 23 | 🔴 Not Created |
| 33 | **Create Bulk Actions Bar** | Bar with bulk delete, status update | Task 32 | 🔴 Not Created |
| 34 | **Connect Table to API** | Use useProducts hook for data fetching | Task 31 | 🔴 Not Created |

---

### Group C: Product Form & Creation (Tasks 35-54)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create Product Form Schema** | Zod schema for product validation | Task 14 | 🔴 Not Created |
| 36 | **Create Product Form Component** | Main product form with React Hook Form | Task 35 | 🔴 Not Created |
| 37 | **Create Basic Info Section** | Name, SKU, description fields | Task 36 | 🔴 Not Created |
| 38 | **Create SKU Auto-Generate** | Auto-generate SKU from product name | Task 37 | 🔴 Not Created |
| 39 | **Create Description Editor** | Rich text editor for description | Task 37 | 🔴 Not Created |
| 40 | **Create Pricing Section** | Cost price, selling price, tax fields | Task 36 | 🔴 Not Created |
| 41 | **Create Price Input Component** | LKR formatted price input | Task 40 | 🔴 Not Created |
| 42 | **Create Tax Category Select** | Dropdown for tax category selection | Task 40 | 🔴 Not Created |
| 43 | **Create Inventory Section** | Track inventory, reorder point fields | Task 36 | 🔴 Not Created |
| 44 | **Create Initial Stock Input** | Input for initial stock quantity | Task 43 | 🔴 Not Created |
| 45 | **Create Reorder Point Input** | Input for reorder alert threshold | Task 43 | 🔴 Not Created |
| 46 | **Create Categorization Section** | Categories, tags selection | Task 36 | 🔴 Not Created |
| 47 | **Create Category Multi-Select** | Multi-select for categories | Task 46 | 🔴 Not Created |
| 48 | **Create Tags Input** | Tag input with autocomplete | Task 46 | 🔴 Not Created |
| 49 | **Create Media Section** | Image upload and management | Task 36 | 🔴 Not Created |
| 50 | **Create Image Upload Zone** | Drag-drop image upload area | Task 49 | 🔴 Not Created |
| 51 | **Create Image Preview Grid** | Grid of uploaded images with reorder | Task 50 | 🔴 Not Created |
| 52 | **Create Image Delete Action** | Delete uploaded image | Task 51 | 🔴 Not Created |
| 53 | **Create Form Submit Handler** | Handle form submission to API | Task 36 | 🔴 Not Created |
| 54 | **Create Create Product Page** | Complete create product page | Task 53 | 🔴 Not Created |

---

### Group D: Product Editing & Details (Tasks 55-70)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 55 | **Create Product Detail Page** | Read-only product detail view | Task 14 | 🔴 Not Created |
| 56 | **Create Product Detail Header** | Header with name, status, actions | Task 55 | 🔴 Not Created |
| 57 | **Create Product Info Card** | Card with basic product info | Task 55 | 🔴 Not Created |
| 58 | **Create Product Pricing Card** | Card with pricing information | Task 55 | 🔴 Not Created |
| 59 | **Create Product Inventory Card** | Card with stock levels per warehouse | Task 55 | 🔴 Not Created |
| 60 | **Create Product Image Gallery** | Image gallery with lightbox | Task 55 | 🔴 Not Created |
| 61 | **Create Product Activity Timeline** | Recent activity/changes timeline | Task 55 | 🔴 Not Created |
| 62 | **Create Edit Product Page** | Page with pre-filled form for editing | Task 54 | 🔴 Not Created |
| 63 | **Fetch Product Data for Edit** | Use useProduct hook to fetch data | Task 62 | 🔴 Not Created |
| 64 | **Populate Form with Existing Data** | Set form default values from API | Task 63 | 🔴 Not Created |
| 65 | **Create Update Handler** | Handle form update submission | Task 64 | 🔴 Not Created |
| 66 | **Handle Optimistic Updates** | Optimistically update UI on save | Task 65 | 🔴 Not Created |
| 67 | **Create Delete Product Dialog** | Confirmation dialog for deletion | Task 55 | 🔴 Not Created |
| 68 | **Implement Product Deletion** | Delete product with API call | Task 67 | 🔴 Not Created |
| 69 | **Create Archive/Restore Actions** | Archive and restore product | Task 55 | 🔴 Not Created |
| 70 | **Create Duplicate Product Action** | Clone product to create new | Task 55 | 🔴 Not Created |

---

### Group E: Variant & Category Management (Tasks 71-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 71 | **Create Variant Management Page** | Page to manage product variants | Task 14 | 🔴 Not Created |
| 72 | **Create Variant Attribute Selector** | Select attributes (size, color, etc.) | Task 71 | 🔴 Not Created |
| 73 | **Create Variant Matrix Builder** | Generate variants from attribute combinations | Task 72 | 🔴 Not Created |
| 74 | **Create Variant Table** | Table listing all variants with prices/stock | Task 73 | 🔴 Not Created |
| 75 | **Create Variant Inline Editor** | Edit variant price/SKU inline in table | Task 74 | 🔴 Not Created |
| 76 | **Create Variant Bulk Edit** | Bulk update variant prices | Task 74 | 🔴 Not Created |
| 77 | **Create Variant Delete Action** | Delete individual variant | Task 74 | 🔴 Not Created |
| 78 | **Create Category List Page** | List all categories with hierarchy | Task 14 | 🔴 Not Created |
| 79 | **Create Category Tree View** | Tree display for category hierarchy | Task 78 | 🔴 Not Created |
| 80 | **Create Category Form** | Form for create/edit category | Task 78 | 🔴 Not Created |
| 81 | **Create Category Name Input** | Name input with slug preview | Task 80 | 🔴 Not Created |
| 82 | **Create Parent Category Select** | Select parent for subcategory | Task 80 | 🔴 Not Created |
| 83 | **Create Category Image Upload** | Upload category image | Task 80 | 🔴 Not Created |
| 84 | **Create Category Create Page** | Complete create category page | Task 80 | 🔴 Not Created |
| 85 | **Create Category Edit Page** | Edit existing category | Task 80 | 🔴 Not Created |
| 86 | **Create Category Delete Dialog** | Confirm category deletion | Task 78 | 🔴 Not Created |

---

### Group F: Import/Export & Testing (Tasks 87-96)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 87 | **Create Export Products Button** | Button to export product list | Task 34 | 🔴 Not Created |
| 88 | **Create Export Format Selector** | Select CSV, Excel, PDF format | Task 87 | 🔴 Not Created |
| 89 | **Implement Export Logic** | Download file with selected format | Task 88 | 🔴 Not Created |
| 90 | **Create Import Products Button** | Button to open import dialog | Task 34 | 🔴 Not Created |
| 91 | **Create Import Dialog** | Dialog for file upload and mapping | Task 90 | 🔴 Not Created |
| 92 | **Create Import File Upload** | Upload CSV/Excel file | Task 91 | 🔴 Not Created |
| 93 | **Create Import Preview Table** | Preview imported data before confirm | Task 92 | 🔴 Not Created |
| 94 | **Implement Import Logic** | Submit import to API | Task 93 | 🔴 Not Created |
| 95 | **Create Product Module Documentation** | Document all product UI components | Task 94 | 🔴 Not Created |
| 96 | **Final Verification & Testing** | Test complete product module | Task 95 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (dashboard)/
│       └── products/
│           ├── layout.tsx
│           ├── page.tsx              # Product list
│           ├── loading.tsx
│           ├── error.tsx
│           ├── new/
│           │   └── page.tsx          # Create product
│           ├── [id]/
│           │   ├── page.tsx          # Product detail
│           │   ├── edit/
│           │   │   └── page.tsx      # Edit product
│           │   └── variants/
│           │       └── page.tsx      # Manage variants
│           └── categories/
│               ├── page.tsx          # Category list
│               ├── new/
│               │   └── page.tsx      # Create category
│               └── [id]/
│                   └── page.tsx      # Edit category
├── components/
│   └── modules/
│       └── products/
│           ├── ProductList/
│           │   ├── ProductList.tsx
│           │   ├── ProductFilters.tsx
│           │   ├── ProductTable.tsx
│           │   ├── ProductTableColumns.tsx
│           │   ├── BulkActionsBar.tsx
│           │   └── index.ts
│           ├── ProductForm/
│           │   ├── ProductForm.tsx
│           │   ├── BasicInfoSection.tsx
│           │   ├── PricingSection.tsx
│           │   ├── InventorySection.tsx
│           │   ├── CategorizationSection.tsx
│           │   ├── MediaSection.tsx
│           │   └── index.ts
│           ├── ProductDetail/
│           │   ├── ProductDetail.tsx
│           │   ├── ProductInfoCard.tsx
│           │   ├── ProductPricingCard.tsx
│           │   ├── ProductInventoryCard.tsx
│           │   ├── ProductImageGallery.tsx
│           │   └── index.ts
│           ├── Variants/
│           │   ├── VariantManager.tsx
│           │   ├── VariantMatrix.tsx
│           │   ├── VariantTable.tsx
│           │   └── index.ts
│           ├── Categories/
│           │   ├── CategoryList.tsx
│           │   ├── CategoryTree.tsx
│           │   ├── CategoryForm.tsx
│           │   └── index.ts
│           ├── Import/
│           │   ├── ImportDialog.tsx
│           │   ├── ImportPreview.tsx
│           │   └── index.ts
│           └── index.ts
└── lib/
    └── validations/
        ├── product.ts
        └── category.ts
```

---

## Product Table Columns

| Column | Field | Sortable | Description |
|--------|-------|----------|-------------|
| Select | - | No | Checkbox for row selection |
| Product | name, image | Yes | Thumbnail + product name |
| SKU | sku | Yes | Product SKU code |
| Category | category.name | No | Primary category |
| Price | selling_price | Yes | Formatted selling price |
| Stock | total_stock | Yes | Total stock with indicator |
| Status | status | No | Status badge |
| Actions | - | No | View, Edit, Delete menu |

---

## Progress Tracking

| Metric | Count |
|--------|-------|
| Total Tasks | 96 |
| Tasks Completed | 0 |
| Tasks In Progress | 0 |
| Tasks Not Started | 96 |

**Last Updated:** 2026-01-17  
**Current Status:** Ready for task document creation

---

## Notes for AI Agents

1. **Execution Order:** Tasks must be executed in numerical order within each group
2. **Data Table:** Use TanStack Table for all list views with server-side operations
3. **Forms:** Use React Hook Form with Zod for all forms
4. **State:** Use TanStack Query hooks from SubPhase-05 for data fetching
5. **Optimistic Updates:** Implement optimistic updates for better UX
6. **Image Upload:** Handle image preview and upload to storage
7. **Validation:** Both client-side and display server validation errors
8. **Dependencies:** This sub-phase depends on SubPhase-07 (Dashboard Layout) and Phase-04 APIs
9. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
10. **Sri Lanka Context:** Price inputs should format as LKR
11. **Bulk Operations:** Support bulk delete and status update
12. **Import/Export:** Support CSV and Excel formats
