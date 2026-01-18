# SubPhase 03: Product Catalog Pages - Tasks Summary

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase Index:** 03 of 14  
> **SubPhase Goal:** Build category and collection pages with product grid, filters, sorting, and pagination  
> **Total Tasks:** 96 | **Status:** Planning  
> **Estimated Duration:** 10-12 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_Storefront-Layout](../SubPhase-02_Storefront-Layout/)
- **→ Next SubPhase:** [SubPhase-04_Product-Detail-Page](../SubPhase-04_Product-Detail-Page/)

---

## SubPhase Overview

This sub-phase creates the product catalog pages including all products listing, category pages, collection pages, product grid, filter sidebar, sort options, and pagination.

### Key Outcomes
- All products page
- Category product pages
- Collection product pages
- Responsive product grid
- Filter sidebar (categories, price, attributes)
- Sort options (price, newest, popular)
- Pagination / Load more
- Active filters display
- No results state

### Pages
- `/products` - All products
- `/products/category/[slug]` - Category products
- `/products/collection/[slug]` - Collection products

### Technology Context
- **Data Fetching:** Server Components + TanStack Query
- **Filters:** URL search params for shareable URLs
- **Grid:** CSS Grid for responsive layout
- **Pagination:** Server-side pagination

---

## Task Execution Order

```
TASK GROUP A: Catalog Routes & Pages (Tasks 01-16)
        │
        ▼
TASK GROUP B: Product Grid & Cards (Tasks 17-36)
        │
        ▼
TASK GROUP C: Filter Sidebar (Tasks 37-54)
        │
        ▼
TASK GROUP D: Sort & Pagination (Tasks 55-70)
        │
        ▼
TASK GROUP E: Category & Collection Pages (Tasks 71-84)
        │
        ▼
TASK GROUP F: Empty States & Testing (Tasks 85-96)
```

---

## Task Index

### Group A: Catalog Routes & Pages (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create Products Directory** | Set up (storefront)/products/ | SubPhase-02 | 🔴 Not Created |
| 02 | **Create All Products Page Route** | Create products/page.tsx | Task 01 | 🔴 Not Created |
| 03 | **Create Category Page Route** | Create products/category/[slug]/page.tsx | Task 01 | 🔴 Not Created |
| 04 | **Create Collection Page Route** | Create products/collection/[slug]/page.tsx | Task 01 | 🔴 Not Created |
| 05 | **Create Products Layout** | Shared layout for product pages | Task 01 | 🔴 Not Created |
| 06 | **Create Products Loading State** | Loading skeleton for grid | Task 02 | 🔴 Not Created |
| 07 | **Create Products Error State** | Error handling for products | Task 02 | 🔴 Not Created |
| 08 | **Create Catalog Page Component** | Main catalog page wrapper | Task 02 | 🔴 Not Created |
| 09 | **Create Catalog Header** | Page header with breadcrumb | Task 08 | 🔴 Not Created |
| 10 | **Create Breadcrumb Component** | Navigation breadcrumb | Task 09 | 🔴 Not Created |
| 11 | **Create Catalog Title** | Page title (All Products, Category name) | Task 09 | 🔴 Not Created |
| 12 | **Create Product Count Display** | "X products found" | Task 08 | 🔴 Not Created |
| 13 | **Create Catalog Main Content** | Grid and sidebar container | Task 08 | 🔴 Not Created |
| 14 | **Create Sidebar Container** | Left sidebar for filters | Task 13 | 🔴 Not Created |
| 15 | **Create Grid Container** | Right side for product grid | Task 13 | 🔴 Not Created |
| 16 | **Verify Route Structure** | Test all catalog routes | Task 15 | 🔴 Not Created |

---

### Group B: Product Grid & Cards (Tasks 17-36)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create Product Grid Component** | Responsive product grid | Task 16 | 🔴 Not Created |
| 18 | **Create Grid Layout Config** | 2/3/4 column responsive | Task 17 | 🔴 Not Created |
| 19 | **Create Product Card Component** | Individual product card | Task 17 | 🔴 Not Created |
| 20 | **Create Card Image Section** | Product image container | Task 19 | 🔴 Not Created |
| 21 | **Create Card Image Component** | Image with lazy loading | Task 20 | 🔴 Not Created |
| 22 | **Create Card Image Hover** | Secondary image on hover | Task 20 | 🔴 Not Created |
| 23 | **Create Card Badge** | Sale/New/Out of Stock badge | Task 20 | 🔴 Not Created |
| 24 | **Create Card Quick Actions** | Wishlist, quick view icons | Task 20 | 🔴 Not Created |
| 25 | **Create Card Content Section** | Product details container | Task 19 | 🔴 Not Created |
| 26 | **Create Card Category** | Product category link | Task 25 | 🔴 Not Created |
| 27 | **Create Card Title** | Product name with link | Task 25 | 🔴 Not Created |
| 28 | **Create Card Rating** | Star rating display | Task 25 | 🔴 Not Created |
| 29 | **Create Card Price** | Price with sale styling | Task 25 | 🔴 Not Created |
| 30 | **Create Regular Price Display** | Normal price | Task 29 | 🔴 Not Created |
| 31 | **Create Sale Price Display** | Discounted price styling | Task 29 | 🔴 Not Created |
| 32 | **Create Discount Percentage** | "-20% OFF" badge | Task 29 | 🔴 Not Created |
| 33 | **Create Card Add to Cart** | Quick add to cart button | Task 19 | 🔴 Not Created |
| 34 | **Create Card Variant Select** | Quick variant selection | Task 33 | 🔴 Not Created |
| 35 | **Create Product Card Skeleton** | Loading skeleton card | Task 19 | 🔴 Not Created |
| 36 | **Verify Product Cards** | Test card rendering | Task 35 | 🔴 Not Created |

---

### Group C: Filter Sidebar (Tasks 37-54)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 37 | **Create Filter Sidebar Component** | Main filter container | Task 16 | 🔴 Not Created |
| 38 | **Create Filter Section Component** | Collapsible filter section | Task 37 | 🔴 Not Created |
| 39 | **Create Filter Section Header** | Section title with toggle | Task 38 | 🔴 Not Created |
| 40 | **Create Filter Section Content** | Filter options content | Task 38 | 🔴 Not Created |
| 41 | **Create Category Filter** | Category checkbox list | Task 37 | 🔴 Not Created |
| 42 | **Create Category Checkbox** | Single category option | Task 41 | 🔴 Not Created |
| 43 | **Create Price Range Filter** | Min/Max price inputs | Task 37 | 🔴 Not Created |
| 44 | **Create Price Range Slider** | Visual price slider | Task 43 | 🔴 Not Created |
| 45 | **Create Price Input Fields** | Manual price inputs | Task 43 | 🔴 Not Created |
| 46 | **Create Attribute Filters** | Size, Color, Brand filters | Task 37 | 🔴 Not Created |
| 47 | **Create Color Filter** | Color swatch options | Task 46 | 🔴 Not Created |
| 48 | **Create Size Filter** | Size checkbox options | Task 46 | 🔴 Not Created |
| 49 | **Create Brand Filter** | Brand checkbox list | Task 46 | 🔴 Not Created |
| 50 | **Create In Stock Filter** | Availability toggle | Task 37 | 🔴 Not Created |
| 51 | **Create On Sale Filter** | Sale items toggle | Task 37 | 🔴 Not Created |
| 52 | **Create Apply Filters Button** | Apply filter changes | Task 37 | 🔴 Not Created |
| 53 | **Create Clear Filters Button** | Reset all filters | Task 37 | 🔴 Not Created |
| 54 | **Verify Filter Functionality** | Test filter operations | Task 53 | 🔴 Not Created |

---

### Group D: Sort & Pagination (Tasks 55-70)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 55 | **Create Toolbar Component** | Sort and view options bar | Task 16 | 🔴 Not Created |
| 56 | **Create Active Filters Display** | Show applied filters | Task 55 | 🔴 Not Created |
| 57 | **Create Active Filter Tag** | Single filter tag | Task 56 | 🔴 Not Created |
| 58 | **Create Remove Filter Action** | Remove single filter | Task 57 | 🔴 Not Created |
| 59 | **Create Sort Dropdown** | Sort options select | Task 55 | 🔴 Not Created |
| 60 | **Define Sort Options** | Price, Newest, Popular, Rating | Task 59 | 🔴 Not Created |
| 61 | **Create Sort Change Handler** | Handle sort change | Task 59 | 🔴 Not Created |
| 62 | **Create View Toggle** | Grid/List view toggle | Task 55 | 🔴 Not Created |
| 63 | **Create List View Layout** | Alternative list view | Task 62 | 🔴 Not Created |
| 64 | **Create Mobile Filter Button** | Open filters on mobile | Task 55 | 🔴 Not Created |
| 65 | **Create Mobile Filter Drawer** | Filter sidebar as drawer | Task 64 | 🔴 Not Created |
| 66 | **Create Pagination Component** | Page navigation | Task 16 | 🔴 Not Created |
| 67 | **Create Page Numbers** | Clickable page numbers | Task 66 | 🔴 Not Created |
| 68 | **Create Previous/Next Buttons** | Navigation buttons | Task 66 | 🔴 Not Created |
| 69 | **Create Load More Button** | Alternative to pagination | Task 66 | 🔴 Not Created |
| 70 | **Create URL State Sync** | Sync filters to URL params | Task 69 | 🔴 Not Created |

---

### Group E: Category & Collection Pages (Tasks 71-84)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 71 | **Create Category Page Component** | Category-specific page | Task 70 | 🔴 Not Created |
| 72 | **Create Category Header** | Category banner and title | Task 71 | 🔴 Not Created |
| 73 | **Create Category Banner Image** | Category hero image | Task 72 | 🔴 Not Created |
| 74 | **Create Category Description** | Category description text | Task 72 | 🔴 Not Created |
| 75 | **Create Subcategory Navigation** | Child categories links | Task 71 | 🔴 Not Created |
| 76 | **Create Category Data Fetcher** | Fetch category products | Task 71 | 🔴 Not Created |
| 77 | **Create Category SEO Meta** | Category page meta tags | Task 71 | 🔴 Not Created |
| 78 | **Create Collection Page Component** | Collection-specific page | Task 70 | 🔴 Not Created |
| 79 | **Create Collection Header** | Collection banner and title | Task 78 | 🔴 Not Created |
| 80 | **Create Collection Description** | Collection story/description | Task 79 | 🔴 Not Created |
| 81 | **Create Collection Data Fetcher** | Fetch collection products | Task 78 | 🔴 Not Created |
| 82 | **Create Collection SEO Meta** | Collection page meta tags | Task 78 | 🔴 Not Created |
| 83 | **Create Featured Collections Section** | Show featured on home | Task 78 | 🔴 Not Created |
| 84 | **Verify Category/Collection Pages** | Test both page types | Task 83 | 🔴 Not Created |

---

### Group F: Empty States & Testing (Tasks 85-96)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 85 | **Create No Results State** | Empty search results | Task 84 | 🔴 Not Created |
| 86 | **Create No Results Illustration** | Empty state graphic | Task 85 | 🔴 Not Created |
| 87 | **Create No Results Message** | Helpful message text | Task 85 | 🔴 Not Created |
| 88 | **Create Suggestion Links** | Popular categories links | Task 85 | 🔴 Not Created |
| 89 | **Create Loading Grid Skeleton** | Full grid loading state | Task 36 | 🔴 Not Created |
| 90 | **Create Filter Skeleton** | Sidebar loading state | Task 54 | 🔴 Not Created |
| 91 | **Create Quick View Modal** | Product quick view popup | Task 24 | 🔴 Not Created |
| 92 | **Create Quick View Content** | Modal product details | Task 91 | 🔴 Not Created |
| 93 | **Create Catalog Hooks** | useProducts, useCategories | Task 84 | 🔴 Not Created |
| 94 | **Create Catalog Component Exports** | Export all components | Task 93 | 🔴 Not Created |
| 95 | **Create Catalog Documentation** | Document all components | Task 94 | 🔴 Not Created |
| 96 | **Final Verification & Testing** | Test complete catalog | Task 95 | 🔴 Not Created |

---

## Expected Final Structure

```
frontend/
├── app/
│   └── (storefront)/
│       └── products/
│           ├── page.tsx                    # All products
│           ├── layout.tsx                  # Products layout
│           ├── loading.tsx                 # Loading state
│           ├── error.tsx                   # Error state
│           ├── category/
│           │   └── [slug]/
│           │       └── page.tsx            # Category page
│           └── collection/
│               └── [slug]/
│                   └── page.tsx            # Collection page
├── components/
│   └── storefront/
│       └── catalog/
│           ├── CatalogPage.tsx
│           ├── CatalogHeader.tsx
│           ├── ProductGrid/
│           │   ├── ProductGrid.tsx
│           │   ├── ProductCard.tsx
│           │   ├── ProductCardSkeleton.tsx
│           │   └── index.ts
│           ├── Filters/
│           │   ├── FilterSidebar.tsx
│           │   ├── FilterSection.tsx
│           │   ├── CategoryFilter.tsx
│           │   ├── PriceFilter.tsx
│           │   ├── AttributeFilters.tsx
│           │   ├── MobileFilterDrawer.tsx
│           │   └── index.ts
│           ├── Toolbar/
│           │   ├── CatalogToolbar.tsx
│           │   ├── SortDropdown.tsx
│           │   ├── ViewToggle.tsx
│           │   ├── ActiveFilters.tsx
│           │   └── index.ts
│           ├── Pagination/
│           │   ├── Pagination.tsx
│           │   ├── LoadMoreButton.tsx
│           │   └── index.ts
│           ├── Category/
│           │   ├── CategoryPage.tsx
│           │   ├── CategoryHeader.tsx
│           │   └── index.ts
│           ├── Collection/
│           │   ├── CollectionPage.tsx
│           │   ├── CollectionHeader.tsx
│           │   └── index.ts
│           ├── EmptyState.tsx
│           ├── QuickViewModal.tsx
│           └── index.ts
└── hooks/
    └── store/
        ├── useProducts.ts
        ├── useCategories.ts
        └── useFilters.ts
```

---

## Sort Options

| Option | Label | API Parameter |
|--------|-------|---------------|
| newest | Newest First | `-created_at` |
| price_low | Price: Low to High | `price` |
| price_high | Price: High to Low | `-price` |
| popular | Most Popular | `-sales_count` |
| rating | Highest Rated | `-avg_rating` |

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
2. **URL State:** Filters must sync to URL for shareable links
3. **Mobile First:** Filters become drawer on mobile
4. **LKR Currency:** All prices in Sri Lankan Rupees (₨)
5. **SEO:** Category/Collection pages need proper meta tags
6. **Image Optimization:** Use Next.js Image component
7. **Dependencies:** This sub-phase depends on SubPhase-02
8. **No Code Snippets in Tasks:** Individual task documents should focus on descriptions, not implementation code
9. **Quick View:** Optional product preview modal
10. **Lazy Loading:** Images should lazy load
11. **Pagination:** Default 24 products per page
12. **Server Components:** Use RSC for initial data
