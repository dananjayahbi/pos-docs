# Tasks 29-34: Display Elements, Modal & API

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 11 - POS Interface  
> **Group:** B - Product Search & Quick Buttons  
> **Document:** 02 of 02  
> **Tasks Covered:** 29, 30, 31, 32, 33, 34

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-17-28_Search-QuickButtons.md](01_Tasks-17-28_Search-QuickButtons.md)
- **→ Next Group:** [../Group-C_Cart-Management/](../Group-C_Cart-Management/)

---

## Document Overview

This document covers product display enhancements, variant selection modal, and API integration for product search and quick buttons functionality.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 29 | Create Product Image Display | Low |
| 30 | Create Out of Stock Indicator | Low |
| 31 | Create Price Display in Button | Low |
| 32 | Load Quick Button Products | Medium |
| 33 | Create Variant Selection Modal | Medium |
| 34 | Connect Product Search to API | Medium |

---

## Task 29: Create Product Image Display

### Overview
Create a reusable product image display component that shows product images with fallback placeholders, used across quick buttons and search results.

### Dependencies
- Task 24: Create Quick Button Component
- Task 21: Create Search Result Item

### Instructions

1. **Create image component**
   - Create `ProductImage.tsx` in ProductPanel directory
   - Reusable image display
   - Accept image URL and alt text props

2. **Implement image rendering**
   - Use Next.js Image component for optimization
   - Set appropriate sizes
   - Maintain aspect ratio
   - Lazy loading enabled

3. **Add placeholder handling**
   - Show placeholder if no image URL
   - Default product icon or image
   - Same dimensions as actual image
   - Gray background color

4. **Handle image errors**
   - onError handler
   - Switch to placeholder on load failure
   - Log error for debugging
   - Graceful degradation

5. **Add image sizing variants**
   - Small: 40x40px (search results)
   - Medium: 80x80px (quick buttons)
   - Large: 120x120px (modals)
   - Accept size prop

6. **Optimize image loading**
   - Use Next.js Image optimization
   - Appropriate quality settings
   - Blur placeholder (optional)
   - Priority loading for above fold

7. **Style image container**
   - Border radius for rounded corners
   - Object-fit: cover
   - Background color for loading
   - Border or shadow (optional)

### Image Size Variants
```
Small (40x40px):
┌──────┐
│      │  ← Search Results
└──────┘

Medium (80x80px):
┌────────────┐
│            │  ← Quick Buttons
└────────────┘

Large (120x120px):
┌──────────────────┐
│                  │  ← Modals
└──────────────────┘
```

### Image States

| State | Display |
|-------|---------|
| Loading | Gray placeholder with pulse |
| Loaded | Actual product image |
| Error | Fallback icon/placeholder |
| No Image | Default product icon |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/ProductImage.tsx

// Imports
// ProductImage props
// ProductImage component
//   - Image container
//   - Next.js Image component
//   - Error handler
//   - Placeholder logic
//   - Size variants
```

### Verification Checklist
- [ ] `ProductImage.tsx` created
- [ ] Image rendering works
- [ ] Placeholder shows when needed
- [ ] Error handling implemented
- [ ] Size variants functional
- [ ] Optimization applied
- [ ] Styling consistent
- [ ] Alt text for accessibility

---

## Task 30: Create Out of Stock Indicator

### Overview
Create a visual indicator component that displays product stock status with color-coded warnings for out of stock and low stock situations.

### Dependencies
- Task 24: Create Quick Button Component

### Instructions

1. **Create indicator component**
   - Create `StockIndicator.tsx` in ProductPanel directory
   - Visual stock status display
   - Accept stock quantity and reorder point props

2. **Define stock status logic**
   - In Stock: quantity > reorder_point
   - Low Stock: 0 < quantity <= reorder_point
   - Out of Stock: quantity <= 0
   - Calculate status from quantity

3. **Create indicator variants**
   - Badge style: Small label with text
   - Overlay style: Full overlay on image
   - Dot style: Small colored dot
   - Accept variant prop

4. **Add color coding**
   - Green: In stock
   - Yellow/Orange: Low stock
   - Red: Out of stock
   - Gray: Unknown/loading

5. **Display stock text**
   - Badge: "In Stock", "Low Stock", "Out of Stock"
   - Overlay: "OUT OF STOCK" (prominent)
   - Dot: No text, color only
   - Optional: Show exact quantity

6. **Style indicator appropriately**
   - Badge: Small, rounded, positioned corner
   - Overlay: Semi-transparent, centered
   - Dot: 8-10px diameter, absolute positioned
   - Clear, readable typography

7. **Add conditional rendering**
   - Only show if stock info available
   - Hide "In Stock" for quick buttons (optional)
   - Always show Low/Out of Stock
   - Respect display preferences

### Stock Indicator Styles
```
Badge Style:
┌────────────┐
│   Product  │
│            │ [Low Stock]
└────────────┘

Overlay Style:
┌────────────┐
│            │
│OUT OF STOCK│  ← Semi-transparent overlay
│            │
└────────────┘

Dot Style:
┌────────────┐
│ ●          │  ← Small colored dot
│   Product  │
└────────────┘
```

### Stock Status Colors

| Status | Color | Hex | Usage |
|--------|-------|-----|-------|
| In Stock | Green | #10B981 | Sufficient inventory |
| Low Stock | Yellow | #F59E0B | Below reorder point |
| Out of Stock | Red | #EF4444 | No inventory |
| Unknown | Gray | #6B7280 | Loading/unavailable |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/StockIndicator.tsx

// Imports
// StockIndicator props
// StockIndicator component
//   - Status calculation
//   - Variant rendering
//   - Color mapping
//   - Conditional display
```

### Verification Checklist
- [ ] `StockIndicator.tsx` created
- [ ] Stock status calculated correctly
- [ ] Color coding appropriate
- [ ] Badge style works
- [ ] Overlay style works
- [ ] Dot style works
- [ ] Text displays clearly
- [ ] Conditional rendering correct

---

## Task 31: Create Price Display in Button

### Overview
Create a formatted price display component that shows product prices with proper currency formatting and optional variant pricing indicators.

### Dependencies
- Task 24: Create Quick Button Component

### Instructions

1. **Create price display component**
   - Create `PriceDisplay.tsx` in ProductPanel directory
   - Formatted price rendering
   - Accept price value prop

2. **Implement currency formatting**
   - Format to Sri Lankan Rupees (LKR)
   - Use Intl.NumberFormat for localization
   - Two decimal places
   - Thousands separator (comma)

3. **Add currency symbol**
   - Prefix: "LKR" or "Rs."
   - Consistent with system settings
   - Clear, readable font
   - Appropriate spacing

4. **Handle price variants**
   - Single price: Display as-is
   - Price range: "LKR 100 - 200"
   - From price: "From LKR 100"
   - Accept min/max price props

5. **Style price text**
   - Bold or semi-bold font
   - Larger than other text
   - Prominent visibility
   - Right-aligned or centered

6. **Add sale price handling**
   - Original price with strikethrough
   - Sale price highlighted
   - Discount percentage (optional)
   - Color coding (red for sale)

7. **Handle zero/null prices**
   - Show "Price not available"
   - Or contact for price message
   - Hide if product not for sale
   - Graceful error handling

### Price Display Formats
```
Standard Price:
LKR 100.00

Price Range (for variants):
LKR 100 - 250

From Price:
From LKR 100

Sale Price:
LKR 100.00  LKR 80.00
  ↑ (strikethrough)  ↑ (highlighted)
```

### Price Formatting Examples

| Input | Output | Note |
|-------|--------|------|
| 100 | LKR 100.00 | Standard |
| 1234.56 | LKR 1,234.56 | With separator |
| 0 | Contact for price | Zero price |
| null | Price unavailable | No price |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/PriceDisplay.tsx

// Imports
// PriceDisplay props
// PriceDisplay component
//   - Price formatting function
//   - Currency display
//   - Variant handling
//   - Sale price logic
//   - Null/zero handling
```

### Verification Checklist
- [ ] `PriceDisplay.tsx` created
- [ ] Currency formatting correct
- [ ] LKR symbol displayed
- [ ] Price ranges handled
- [ ] Sale prices shown correctly
- [ ] Zero/null prices handled
- [ ] Typography prominent
- [ ] Alignment appropriate

---

## Task 32: Load Quick Button Products

### Overview
Implement API integration to fetch and load quick button products from the backend, with caching and error handling for optimal performance.

### Dependencies
- Task 23: Create Quick Buttons Container

### Instructions

1. **Create API service function**
   - Create or use existing API service
   - Function: `fetchQuickProducts()`
   - Endpoint: `/api/pos/quick-products`
   - Return: Product array

2. **Define API request**
   - GET request to quick products endpoint
   - Include tenant context
   - Include user/shift context (optional)
   - Authentication headers

3. **Implement data fetching**
   - Use in QuickButtons component
   - Fetch on component mount
   - Use useEffect hook
   - Store in component state

4. **Add loading state**
   - Set loading true before fetch
   - Show loading skeleton during fetch
   - Set loading false after response
   - Handle concurrent requests

5. **Implement error handling**
   - Try-catch block for fetch
   - Log errors to console
   - Show error message to user
   - Retry mechanism (optional)

6. **Add response caching**
   - Cache products in memory
   - Use React Query or SWR (optional)
   - Set cache duration (5-10 minutes)
   - Invalidate on product updates

7. **Process response data**
   - Validate response structure
   - Transform data if needed
   - Sort by display order or name
   - Filter active products only

8. **Add refresh mechanism**
   - Manual refresh button (optional)
   - Auto-refresh on interval (optional)
   - Refresh on window focus
   - Clear cache on refresh

### API Integration Flow
```
Component Mount
    │
    ▼
Check Cache
    │
    ├─── Cache Valid ────► Use Cached Data
    │
    └─── Cache Invalid
            │
            ▼
    Set Loading State
            │
            ▼
    Fetch from API
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
  Success      Error
      │           │
      ▼           ▼
 Transform    Show Error
  Data          Message
      │           │
      ▼           │
  Update Cache    │
      │           │
      └─────┬─────┘
            │
            ▼
    Update State
            │
            ▼
    Render Products
```

### API Response Structure
```typescript
{
  success: true,
  data: {
    products: [
      {
        id: "prod_123",
        name: "Product Name",
        sku: "SKU001",
        price: 100.00,
        image_url: "https://...",
        category: "Food",
        stock_quantity: 50,
        has_variants: false,
        display_order: 1
      },
      // ... more products
    ]
  }
}
```

### Expected Implementation
```typescript
// In QuickButtons component or API service:

// fetchQuickProducts function
//   - API call setup
//   - Request headers
//   - Error handling
//   - Response transformation

// useEffect in QuickButtons
//   - Call fetchQuickProducts
//   - Update products state
//   - Handle loading/error states
```

### Verification Checklist
- [ ] API service function created
- [ ] GET request configured
- [ ] Tenant context included
- [ ] Authentication headers set
- [ ] Loading state implemented
- [ ] Error handling added
- [ ] Response validated
- [ ] Data transformed correctly
- [ ] Caching implemented (optional)
- [ ] Products displayed in UI

---

## Task 33: Create Variant Selection Modal

### Overview
Create a modal dialog for selecting product variants when a product with variants is added to cart, displaying all available variants with stock and pricing.

### Dependencies
- Task 22: Create Add from Search
- Task 28: Create Quick Button Action

### Instructions

1. **Create variant modal component**
   - Create `VariantModal.tsx` in ProductPanel directory
   - Modal dialog component
   - Accept product and variants props

2. **Define modal structure**
   - Modal overlay (semi-transparent backdrop)
   - Modal content container
   - Header with product name and close button
   - Variants list
   - Footer with action buttons

3. **Display product information**
   - Product name in header
   - Product image (optional)
   - Base price (if applicable)
   - Description (optional)

4. **Create variants list**
   - List all available variants
   - Each variant as selectable option
   - Radio buttons or cards
   - Single selection only

5. **Show variant details**
   - Variant name (e.g., "Small - Blue")
   - Price for variant
   - Stock quantity
   - SKU (optional)
   - Out of stock indicator

6. **Add quantity selector**
   - Quantity input field
   - +/- buttons
   - Default: 1
   - Min: 1, Max: stock quantity

7. **Implement action buttons**
   - "Add to Cart" button (primary)
   - "Cancel" button (secondary)
   - Disable add if no variant selected
   - Disable add if out of stock

8. **Handle modal state**
   - Open/close state
   - Selected variant state
   - Quantity state
   - Reset on open/close

9. **Add keyboard support**
   - Escape to close
   - Enter to confirm
   - Tab navigation
   - Focus trap within modal

### Variant Modal Layout
```
┌─────────────────────────────────────────┐
│ Select Variant                      [×] │ ← Header
├─────────────────────────────────────────┤
│ Product Name                            │
│ [Product Image]                         │
│                                         │
│ Available Variants:                     │
│                                         │
│ ○ Small - Red        LKR 100  (25 pcs) │
│ ● Medium - Blue      LKR 120  (10 pcs) │ ← Selected
│ ○ Large - Green      LKR 150  (Out)    │
│                                         │
│ Quantity: [─] [  1  ] [+]               │
│                                         │
│         [ Cancel ]  [ Add to Cart ]     │ ← Footer
└─────────────────────────────────────────┘
```

### Variant Item Display

| Element | Content |
|---------|---------|
| Radio Button | Selection indicator |
| Variant Name | Size, color, etc. |
| Price | Variant-specific price |
| Stock | Available quantity |
| Stock Status | In/low/out indicator |

### Expected Component Structure
```typescript
// File: frontend/components/modules/pos/ProductPanel/VariantModal.tsx

// 'use client' directive
// Imports
// VariantModal props
// VariantModal component
//   - Modal overlay
//   - Modal content
//   - Product info section
//   - Variants list
//   - Quantity selector
//   - Action buttons
//   - State management
//   - Keyboard handlers
```

### Verification Checklist
- [ ] `VariantModal.tsx` created
- [ ] Modal opens/closes correctly
- [ ] Product info displayed
- [ ] Variants list renders
- [ ] Variant selection works
- [ ] Stock status shown
- [ ] Quantity selector functional
- [ ] Add to cart works
- [ ] Cancel closes modal
- [ ] Keyboard support implemented
- [ ] Focus trapped in modal
- [ ] Backdrop click closes modal

---

## Task 34: Connect Product Search to API

### Overview
Implement API integration for product search functionality, enabling real-time product lookups with debouncing and result filtering.

### Dependencies
- Task 17: Create Product Search Bar

### Instructions

1. **Create search API function**
   - Create or use API service
   - Function: `searchProducts(query)`
   - Endpoint: `/api/pos/products/search`
   - Return: Product array

2. **Define API request**
   - GET request with query parameter
   - Query param: `?q=search_term`
   - Include filters (category, stock status)
   - Authentication headers

3. **Implement debounced search**
   - Use debounce utility (lodash or custom)
   - Delay: 300ms
   - Cancel previous requests
   - Only search if query length >= 2

4. **Add search state management**
   - Search query state
   - Results state
   - Loading state
   - Error state

5. **Handle search execution**
   - Call API on query change
   - Set loading true before call
   - Update results on success
   - Set loading false after response

6. **Process search results**
   - Validate response structure
   - Transform data if needed
   - Limit results (max 20)
   - Sort by relevance

7. **Implement barcode search**
   - Detect barcode input (from Task 19)
   - Search by SKU/barcode field
   - Exact match priority
   - Auto-add if single result

8. **Add error handling**
   - Network errors: Show retry option
   - Empty results: "No products found"
   - Invalid query: Clear results
   - Log errors for debugging

9. **Optimize performance**
   - Cancel in-flight requests on new search
   - Cache recent searches (optional)
   - Abort controller for cancellation
   - Minimize re-renders

### Search API Flow
```
User Types in Search
    │
    ▼
Debounce (300ms)
    │
    ▼
Check Query Length
    │
    ├─── < 2 chars ────► Clear Results
    │
    └─── >= 2 chars
            │
            ▼
    Set Loading State
            │
            ▼
    Cancel Previous Request
            │
            ▼
    Call Search API
            │
      ┌─────┴─────┐
      │           │
      ▼           ▼
  Success      Error
      │           │
      ▼           ▼
 Transform    Show Error
  Results       Message
      │           │
      └─────┬─────┘
            │
            ▼
    Update Results State
            │
            ▼
    Display Results
```

### Search Request Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| q | string | Search query |
| category | string | Filter by category (optional) |
| in_stock | boolean | Only in-stock items (optional) |
| limit | number | Max results (default: 20) |

### Search Response Structure
```typescript
{
  success: true,
  data: {
    products: [
      {
        id: "prod_123",
        name: "Product Name",
        sku: "SKU001",
        barcode: "1234567890",
        price: 100.00,
        image_url: "https://...",
        category: "Food",
        stock_quantity: 50,
        has_variants: false,
        variants: []  // if has_variants is true
      },
      // ... more products
    ],
    total: 25,
    query: "search term"
  }
}
```

### Expected Implementation
```typescript
// In ProductSearch component or API service:

// searchProducts API function
//   - API call with query param
//   - Abort controller
//   - Error handling
//   - Response transformation

// In ProductSearch component:
// useDebouncedSearch hook or effect
//   - Debounce search query
//   - Call searchProducts
//   - Update state
//   - Handle results
```

### Verification Checklist
- [ ] Search API function created
- [ ] Debouncing implemented (300ms)
- [ ] Query parameters configured
- [ ] Request cancellation works
- [ ] Loading state shown
- [ ] Results displayed correctly
- [ ] Empty results handled
- [ ] Error handling implemented
- [ ] Barcode search functional
- [ ] Performance optimized
- [ ] Results clickable to add to cart

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 29 | Create Product Image Display | Reusable image component |
| 30 | Create Out of Stock Indicator | Stock status visual |
| 31 | Create Price Display in Button | Formatted price display |
| 32 | Load Quick Button Products | API integration for quick products |
| 33 | Create Variant Selection Modal | Variant picker modal |
| 34 | Connect Product Search to API | Search API integration |

### Complete Group B Progress
```
frontend/components/modules/pos/ProductPanel/
├── ProductPanel.tsx                  # Group A
├── ProductSearch.tsx                 # Task 17 ✓
├── SearchInput.tsx                   # Task 18 ✓
├── SearchResults.tsx                 # Task 20 ✓
├── SearchResultItem.tsx              # Task 21 ✓
├── QuickButtons.tsx                  # Task 23 ✓
├── QuickButton.tsx                   # Task 24 ✓
├── QuickButtonGrid.tsx               # Task 25 ✓
├── CategoryTabs.tsx                  # Task 26 ✓
├── CategoryTab.tsx                   # Task 27 ✓
├── ProductImage.tsx                  # Task 29 ✓
├── StockIndicator.tsx                # Task 30 ✓
├── PriceDisplay.tsx                  # Task 31 ✓
├── VariantModal.tsx                  # Task 33 ✓
└── index.ts

API Services:
├── fetchQuickProducts()              # Task 32 ✓
└── searchProducts()                  # Task 34 ✓
```

### Group B Complete: Product Selection Ready
✓ **All Tasks Completed (17-34)**
- Product search with barcode scanning
- Search results with keyboard navigation
- Quick buttons with category filtering
- Variant selection modal
- Stock indicators and price formatting
- API integration for search and quick products

### Next Steps
Proceed to **Group C: Cart Management** to implement shopping cart functionality with quantity controls and state management.

Navigate to: [../Group-C_Cart-Management/01_Tasks-35-44_CartUI-Items.md](../Group-C_Cart-Management/01_Tasks-35-44_CartUI-Items.md)

---

## Notes for AI Agents

1. **Image Optimization:** Use Next.js Image component for automatic optimization and lazy loading
2. **Stock Indicators:** Color code (green/yellow/red) for immediate visual recognition
3. **Price Formatting:** Use Intl.NumberFormat for proper LKR currency formatting
4. **API Caching:** Consider React Query or SWR for automatic caching and revalidation
5. **Variant Modal:** Focus trap and keyboard support essential for accessibility
6. **Search Debouncing:** 300ms delay prevents excessive API calls while typing
7. **Error Handling:** Always provide user-friendly error messages and retry options
8. **Next Group:** Cart state management with Zustand and localStorage persistence
