# Tasks 83-90: Related Products, Recently Viewed & Cross-Sell

> **Phase:** 08 - Webstore & E-Commerce Platform  
> **SubPhase:** 04 - Product Detail Page  
> **Group:** F - Related Products & Testing  
> **Document:** 01 of 02  
> **Tasks Covered:** 83, 84, 85, 86, 87, 88, 89, 90

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Tabs-Reviews](../Group-E_Tabs-Reviews/)
- **→ Next Document:** [02_Tasks-91-94_Final-Testing.md](02_Tasks-91-94_Final-Testing.md)

---

## Document Overview

This document covers related products, recently viewed, and cross-sell sections below product tabs.

| Task # | Task Name | Est. Time |
|--------|-----------|-----------|
| 83 | Create Related Products Section | 35 min |
| 84 | Create Related Products Grid | 25 min |
| 85 | Create Related Product Card | 30 min |
| 86 | Create Related Products Data Fetcher | 40 min |
| 87 | Create Recently Viewed Section | 35 min |
| 88 | Create Recently Viewed Storage | 30 min |
| 89 | Create Cross-Sell Section | 35 min |
| 90 | Create Cross-Sell Bundle Card | 25 min |

---

## Task 83: Create Related Products Section

### Overview
Create the RelatedProducts component that displays a section of products similar to the current product. This component shows a header with title and appears below the product tabs, featuring a horizontal scrollable grid of related product cards based on category, tags, or attributes.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 82 | Component | Reviews testing must be complete |
| Product Card | Component | Reuse from catalog pages |
| TanStack Query | Library | For data fetching and caching |

### Instructions

1. **Setup**: Create `frontend/components/storefront/product/RelatedProducts/` directory and `RelatedProducts.tsx` component
2. **Props**: Define `productId` (string), `categoryId` (string), `limit` (number, default 8)
3. **Container**: Use `<section>` with max-w-7xl, mt-12, responsive padding
4. **Header**: Flex layout with "You May Also Like" title and optional "View All" link
5. **Data**: Integrate RelatedProductsDataFetcher (Task 86) with loading/error/empty states
6. **Layout**: Use RelatedProductsGrid (Task 84), horizontal scroll (mobile), grid (desktop)
7. **Navigation**: Add left/right arrow buttons with show/hide logic
8. **Responsive**: Mobile (scroll), Tablet (3-4 items), Desktop (4-5 items)

### Related Products Section Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  Related Products Section                                        │
├──────────────────────────────────────────────────────────────────┤
│  You May Also Like                              [View All →]     │
│  ────────────────────────────────────────────────────────────    │
│                                                                   │
│  [←]  [Product] [Product] [Product] [Product] [Product]  [→]    │
│       Card 1    Card 2    Card 3    Card 4    Card 5            │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Section Layout Options

| Layout Type | Mobile | Tablet | Desktop | Description |
|-------------|--------|--------|---------|-------------|
| Horizontal Scroll | ✓ | ✓ | Optional | Swipeable row |
| Grid with Arrows | ✗ | ✓ | ✓ | Static grid with navigation |
| Full Grid | ✗ | ✗ | ✓ | 4-5 column grid |

### Expected Outcome
A visually appealing related products section with responsive layout, smooth horizontal scrolling on mobile, and proper loading/error states that encourages users to explore similar products.

### Verification Checklist
- [ ] Section renders below product tabs
- [ ] Header with title displays correctly
- [ ] Horizontal scroll works smoothly on mobile
- [ ] Grid layout works on desktop
- [ ] Loading skeleton shows during data fetch
- [ ] Error state displays when fetch fails
- [ ] Empty state handled gracefully
- [ ] Section hidden when no products available
- [ ] Responsive padding and spacing correct
- [ ] Scroll navigation buttons functional (if implemented)

---

## Task 84: Create Related Products Grid

### Overview
Create the RelatedProductsGrid component that displays a horizontal scrollable or static grid of related product cards. This component handles the layout, spacing, and responsive behavior for displaying multiple product cards in the related products section.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 83 | Component | RelatedProducts section must exist |
| Product Card | Component | Reusable product card component |

### Instructions

1. **Setup**: Create `RelatedProductsGrid.tsx` with props `products` (Product[]), `layout`, `itemsPerRow`
2. **Horizontal Scroll**: Flexbox with overflow-x-auto, gap-4, momentum scrolling, scroll-snap
3. **Grid**: CSS Grid with grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5
4. **Cards**: Set width w-[280px], map products to ProductCard with keys
5. **Loading**: Display 4-5 skeleton cards with pulse animation

### Grid Layout Comparison

```
MOBILE (Horizontal Scroll):
┌─────────────────────────────────────────────┐
│ [Card 1] [Card 2] [Card 3] [Card 4] [C...] │
│                                             │
│ ←──────── Swipe ────────→                  │
└─────────────────────────────────────────────┘

DESKTOP (Static Grid):
┌─────────────────────────────────────────────┐
│ [Card 1]  [Card 2]  [Card 3]  [Card 4]     │
│ [Card 5]  [Card 6]  [Card 7]  [Card 8]     │
└─────────────────────────────────────────────┘
```

### Scroll Behavior Settings

| Property | Mobile | Tablet | Desktop | Purpose |
|----------|--------|--------|---------|---------|
| overflow-x | auto | auto | hidden/auto | Enable horizontal scroll |
| scroll-snap-type | x mandatory | x proximity | none | Snap to cards |
| scroll-padding | 16px | 24px | 32px | Edge spacing |
| gap | 16px | 20px | 24px | Card spacing |

### Expected Outcome
A smooth, responsive grid layout that allows horizontal scrolling on mobile devices and can optionally display as a static grid on desktop, with proper spacing and product card rendering.

### Verification Checklist
- [ ] Horizontal scroll works on mobile
- [ ] Scroll snap points align cards properly
- [ ] Grid layout works on desktop (if enabled)
- [ ] Cards maintain consistent size
- [ ] Gap spacing correct between cards
- [ ] Loading skeleton displays correctly
- [ ] All products render with ProductCard
- [ ] Responsive breakpoints function properly
- [ ] Smooth scrolling on iOS/Android
- [ ] Last card has appropriate padding

---

## Task 85: Create Related Product Card

### Overview
Create the RelatedProductCard component that displays a compact version of a product within the related products section. This card shows the product image, name, price, discount badge, and rating, optimized for horizontal scroll layout.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 84 | Component | RelatedProductsGrid must exist |
| Next.js Image | Library | For optimized images |
| Link Component | Library | Next.js Link for navigation |

### Instructions

1. **Setup**: Create `RelatedProductCard.tsx` with props `product`, `compact`, `onCardClick`
2. **Container**: Link wrapper, w-[280px], border, rounded, hover effects
3. **Image**: Next.js Image aspect-square, discount badge, wishlist button overlays
4. **Info**: Padding p-3, category, product name (line-clamp-2), LKR price
5. **Details**: Star rating, review count, stock status badge
6. **Optional**: Quick action buttons on hover, responsive sizing for compact mode

### Related Product Card Structure

```
┌───────────────────────────┐
│         [♡]               │
│                           │
│      Product Image        │  ← Discount badge overlay
│      (aspect-square)      │
│                           │
├───────────────────────────┤
│ Brand/Category            │
│ Product Name Here...      │
│                           │
│ ₨1,999  ₨̶2̶,̶5̶0̶0̶  (20% OFF)│
│ ⭐⭐⭐⭐⭐ (25)              │
│                           │
│ ✓ In Stock                │
└───────────────────────────┘
```

### Card Size Variations

| Size Mode | Width | Image Height | Padding | Use Case |
|-----------|-------|--------------|---------|----------|
| Default | 280px | 280px | 16px | Standard horizontal scroll |
| Compact | 240px | 240px | 12px | More items visible |
| Large | 320px | 320px | 20px | Desktop grid layout |

### Price Display Examples

| Scenario | Display | Badge | Text Color |
|----------|---------|-------|------------|
| No Discount | ₨2,500 | - | Gray-900 |
| On Sale | ₨1,999 ₨̶2̶,̶5̶0̶0̶ | 20% OFF | Red (sale) |
| Low Price | ₨599 | - | Green |

### Expected Outcome
A compact, visually appealing product card optimized for horizontal scrolling, with clear pricing information, product image, and essential details that encourages clicks to the product detail page.

### Verification Checklist
- [ ] Card renders with correct dimensions
- [ ] Product image loads and displays properly
- [ ] Product name truncates with ellipsis
- [ ] Price displays correctly in LKR (₨)
- [ ] Discount badge shows when applicable
- [ ] Star rating and count display
- [ ] Stock status indicator visible
- [ ] Link navigates to correct product page
- [ ] Hover effects work smoothly
- [ ] Card maintains consistent height
- [ ] Responsive styling works on all screens

---

## Task 86: Create Related Products Data Fetcher

### Overview
Create the useRelatedProducts hook that fetches related product data from the backend API based on the current product's category, tags, or attributes. This hook uses TanStack Query for data fetching, caching, and state management.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 85 | Component | RelatedProductCard must exist |
| TanStack Query | Library | React Query for data fetching |
| API Client | Service | Axios or fetch for API calls |

### Instructions

1. **API Service**: Create `getRelatedProducts(productId, options)` in `services/api/products.ts`
2. **Hook**: Create `useRelatedProducts.ts` with TanStack Query's useQuery
3. **Configuration**: Query key `['related-products', productId]`, staleTime 5min, retry 2, no refetchOnWindowFocus
4. **Algorithm**: Priority - same category+price range, same tags, high rating, popular
5. **Error Handling**: Return empty array on error, log for debugging
6. **Types**: Define RelatedProductsResponse and Product interfaces

### Data Fetcher Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│  useRelatedProducts Hook                                     │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Input: productId, categoryId, limit                        │
│         │                                                    │
│         ▼                                                    │
│  [Check TanStack Query Cache]                               │
│         │                                                    │
│         ├─ Cache Hit ──→ Return Cached Data                 │
│         │                                                    │
│         └─ Cache Miss                                        │
│                 │                                            │
│                 ▼                                            │
│         [API Call: GET /api/products/{id}/related]          │
│                 │                                            │
│                 ├─ Success ──→ Cache & Return Data          │
│                 │                                            │
│                 └─ Error ──→ Return Empty Array             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Backend Algorithm Priority

| Priority | Criteria | Weight | Example |
|----------|----------|--------|---------|
| 1 | Same category + price range (±30%) | High | T-shirts ₨1,400-₨2,600 |
| 2 | Same tags (color, style, brand) | Medium | Blue, Casual, Nike |
| 3 | High rating in category | Low | Top-rated products |
| 4 | Recently viewed by others | Low | Popular alternatives |

### Query Configuration

| Option | Value | Reason |
|--------|-------|--------|
| staleTime | 5 min | Related products don't change frequently |
| cacheTime | 10 min | Keep in cache longer than stale time |
| retry | 2 | Retry failed requests twice |
| refetchOnWindowFocus | false | Static data, no need to refetch |

### Expected Outcome
A robust data fetching hook that retrieves related products efficiently, caches results to minimize API calls, handles errors gracefully, and provides loading states for the UI.

### Verification Checklist
- [ ] Hook fetches related products successfully
- [ ] TanStack Query cache works correctly
- [ ] Loading state displays during fetch
- [ ] Error state handled gracefully
- [ ] Empty state returns empty array
- [ ] Query key includes productId for cache isolation
- [ ] staleTime and cacheTime configured
- [ ] Retry logic works on failure
- [ ] API endpoint called with correct params
- [ ] TypeScript types are correct

---

## Task 87: Create Recently Viewed Section

### Overview
Create the RecentlyViewed component that displays a list of products the user has recently visited. This component reads from localStorage to show a horizontal scrollable section of previously viewed products, helping users return to items they're interested in.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 86 | Hook | Related products data fetcher complete |
| localStorage | Browser API | For storing viewed products |
| Product Card | Component | Reusable product card |

### Instructions

1. **Setup**: Create `RecentlyViewed/RecentlyViewed.tsx` with props `currentProductId`, `limit` (default 8), `title`
2. **Container**: Section with max-w-7xl, mt-12, responsive padding
3. **Header**: Title with optional "Clear History" button
4. **localStorage**: useEffect to read on mount, filter out current product, handle JSON parse errors
5. **Data**: Fetch full product details if only IDs stored, use TanStack Query
6. **Layout**: Reuse RelatedProductsGrid with horizontal scroll
7. **Clear Function**: Clear localStorage, update state, show empty state
8. **Empty State**: "No recently viewed products" message, hide section if empty
9. **Client-Only**: Use useEffect to avoid hydration issues

### Recently Viewed Section Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  Recently Viewed Section                                         │
├──────────────────────────────────────────────────────────────────┤
│  Recently Viewed                                [Clear History]   │
│  ────────────────────────────────────────────────────────────    │
│                                                                   │
│  [Product] [Product] [Product] [Product] [Product] [Product]    │
│  Card 1    Card 2    Card 3    Card 4    Card 5    Card 6       │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### localStorage Data Structure

```json
{
  "recentlyViewed": [
    {
      "productId": "prod_123",
      "viewedAt": "2026-01-26T10:30:00Z",
      "slug": "product-name"
    },
    {
      "productId": "prod_456",
      "viewedAt": "2026-01-26T09:15:00Z",
      "slug": "another-product"
    }
  ]
}
```

### Storage Strategy

| Approach | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| Store IDs Only | Minimal storage | Requires fetch | ✓ Best for most cases |
| Store Full Products | No fetch needed | Large storage size | Use for small catalogs |
| Store Slug + Basic Info | Balance | Moderate complexity | Good compromise |

### Expected Outcome
A functional recently viewed section that reads from localStorage, displays products the user has previously visited, and provides a way to clear history, enhancing user experience by facilitating product rediscovery.

### Verification Checklist
- [ ] Section renders below related products
- [ ] localStorage read successfully on mount
- [ ] Recently viewed products display correctly
- [ ] Current product excluded from list
- [ ] Horizontal scroll works on mobile
- [ ] Empty state displays when no history
- [ ] Clear history button functions
- [ ] localStorage cleared when button clicked
- [ ] No hydration errors (client-only rendering)
- [ ] Products limited to specified count

---

## Task 88: Create Recently Viewed Storage

### Overview
Create the useRecentlyViewed hook that manages storing and retrieving recently viewed products in localStorage. This hook provides functions to add products to history, retrieve history, clear history, and automatically update when products are viewed.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 87 | Component | RecentlyViewed section must exist |
| localStorage | Browser API | For persistent storage |

### Instructions

1. **Setup**: Create `useRecentlyViewed.ts` hook, define RECENTLY_VIEWED_KEY constant
2. **Interfaces**: RecentlyViewedItem (productId, viewedAt, slug), UseRecentlyViewedReturn
3. **addToRecentlyViewed**: Read history, prepend new product, remove duplicates, limit to 20 items
4. **getRecentlyViewed**: Read/parse JSON, sort by viewedAt, return limited array
5. **clearRecentlyViewed**: Remove localStorage key, update state, trigger re-render
6. **removeFromRecentlyViewed**: Filter out specific productId, update localStorage
7. **Auto-save**: useEffect to detect product view, call addToRecentlyViewed once
8. **Error Handling**: Validate localStorage available (SSR-safe), handle quota/parse errors
9. **State Sync**: Use useState, sync with localStorage, listen for storage events across tabs

### Hook Usage Flow

```
┌─────────────────────────────────────────────────────────────┐
│  useRecentlyViewed Hook                                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  User Views Product                                          │
│         │                                                    │
│         ▼                                                    │
│  addToRecentlyViewed(product)                               │
│         │                                                    │
│         ├─ Read Current History from localStorage           │
│         ├─ Remove Duplicate (if exists)                     │
│         ├─ Add New Product to Beginning                     │
│         ├─ Limit to Max Items (20)                          │
│         └─ Save to localStorage                             │
│                                                              │
│  Component Requests History                                  │
│         │                                                    │
│         ▼                                                    │
│  getRecentlyViewed(limit)                                   │
│         │                                                    │
│         ├─ Read from localStorage                           │
│         ├─ Parse JSON                                       │
│         ├─ Sort by viewedAt                                 │
│         └─ Return Limited Array                             │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### localStorage Structure Example

```json
{
  "ecommerce_recently_viewed": [
    {
      "productId": "prod_xyz",
      "slug": "blue-cotton-shirt",
      "viewedAt": "2026-01-26T14:30:00.000Z",
      "name": "Blue Cotton Shirt",
      "price": 1999,
      "image": "/images/products/shirt.jpg"
    }
  ]
}
```

### Storage Configuration

| Setting | Value | Reason |
|---------|-------|--------|
| Max Stored Items | 20 | Balance storage and history |
| Display Limit | 8 | UI space optimization |
| Storage Key | ecommerce_recently_viewed | Namespace for app |
| Auto-Save | Yes | Track views automatically |

### Error Handling Scenarios

| Scenario | Handling | Fallback |
|----------|----------|----------|
| localStorage Unavailable | Catch error | Return empty array |
| Quota Exceeded | Remove oldest items | Keep only 10 items |
| JSON Parse Error | Log error | Return empty array |
| Invalid Data Format | Validate and filter | Skip invalid items |

### Expected Outcome
A robust hook that manages recently viewed products with localStorage, provides easy-to-use functions for adding, retrieving, and clearing history, and handles errors gracefully.

### Verification Checklist
- [ ] addToRecentlyViewed saves to localStorage
- [ ] getRecentlyViewed retrieves correct data
- [ ] clearRecentlyViewed removes all data
- [ ] Duplicate products removed from history
- [ ] History limited to max items (20)
- [ ] Most recent products appear first
- [ ] localStorage errors handled gracefully
- [ ] Hook works in SSR environment (client-only)
- [ ] State synchronizes across components
- [ ] TypeScript types are correct

---

## Task 89: Create Cross-Sell Section

### Overview
Create the CrossSellSection component that displays "Frequently Bought Together" bundles. This component shows the current product combined with complementary products, displaying the total bundle price with a discount and an easy "Add Bundle to Cart" action.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 88 | Hook | Recently viewed storage must exist |
| Cart Store | State | Zustand cart store for adding bundles |
| Product API | Service | Fetch cross-sell data |

### Instructions

1. **Setup**: Create `CrossSell/CrossSellSection.tsx` with props `product`, `bundleProducts`, `discount`
2. **Container**: Section with max-w-7xl, mt-12, border/background for separation
3. **Header**: "Frequently Bought Together" title with subtitle explaining savings
4. **Bundle Preview**: Horizontal layout - current product + "+" + 1-2 complementary products
5. **Summary Panel**: List products with checkboxes, individual prices, total original price
6. **Pricing**: Calculate sum, apply bundle discount (e.g., 10%), show "You Save ₨X" in green
7. **Selection Logic**: State to track selected products, update total, require min 2 products
8. **CTA Button**: "Add Bundle to Cart" - adds selected products, loading state, success toast
9. **Product Links**: Each card links to detail page with "View Details"
10. **Responsive**: Mobile (stack), Tablet (2-col), Desktop (horizontal with summary)

### Cross-Sell Section Structure

```
┌──────────────────────────────────────────────────────────────────┐
│  Frequently Bought Together                                      │
│  Buy these products together and save!                           │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────┐      ┌────────────┐      ┌────────────┐        │
│  │  Product   │  +   │  Product   │  +   │  Product   │        │
│  │   Image    │      │   Image    │      │   Image    │        │
│  │            │      │            │      │            │        │
│  │  ₨1,999    │      │  ₨599      │      │  ₨799      │        │
│  └────────────┘      └────────────┘      └────────────┘        │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ This Bundle:                                             │   │
│  │ ☑ Blue Cotton Shirt              ₨̶1̶,̶9̶9̶9̶                │   │
│  │ ☑ Matching Belt                  ₨̶5̶9̶9̶                  │   │
│  │ ☑ Casual Shoes                   ₨̶7̶9̶9̶                  │   │
│  │                                                          │   │
│  │ Total Original Price: ₨3,397                            │   │
│  │ Bundle Price: ₨2,999                                    │   │
│  │ You Save: ₨398 (12% off)                                │   │
│  │                                                          │   │
│  │          [Add Bundle to Cart]                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

### Bundle Pricing Calculation

| Component | Value | Calculation |
|-----------|-------|-------------|
| Product A | ₨1,999 | Current product |
| Product B | ₨599 | Cross-sell item 1 |
| Product C | ₨799 | Cross-sell item 2 |
| **Subtotal** | **₨3,397** | Sum of all |
| Bundle Discount (12%) | -₨398 | 12% off subtotal |
| **Bundle Price** | **₨2,999** | Final price |

### Bundle Selection States

| Products Selected | Bundle Available | Button State | Action |
|-------------------|------------------|--------------|--------|
| Current only | ✗ | Disabled | "Select at least 2" |
| Current + 1 | ✓ | Enabled | Add 2 to cart |
| Current + 2 | ✓ | Enabled | Add 3 to cart |
| All 3 | ✓ | Enabled | Add all to cart |

### Expected Outcome
A compelling cross-sell section that presents bundle offers attractively, calculates savings clearly, and makes it easy for users to add multiple complementary products to their cart at once.

### Verification Checklist
- [ ] Section renders below recently viewed
- [ ] Current product displays in bundle
- [ ] Complementary products display correctly
- [ ] "+" separators visible between products
- [ ] Bundle pricing calculates correctly
- [ ] Savings amount displays in green
- [ ] Checkboxes toggle product selection
- [ ] Total updates when products unchecked
- [ ] "Add Bundle to Cart" button functional
- [ ] Success toast shows after adding
- [ ] Responsive layout works on mobile
- [ ] Individual product links work

---

## Task 90: Create Cross-Sell Bundle Card

### Overview
Create the BundleCard component that displays a single product within the cross-sell bundle section. This compact card shows the product image, name, and price with a checkbox to include or exclude the product from the bundle.

### Dependencies
| Dependency | Type | Description |
|------------|------|-------------|
| Task 89 | Component | CrossSellSection must exist |
| Next.js Image | Library | For optimized images |
| Checkbox Component | UI | Custom or Radix UI checkbox |

### Instructions

1. **Setup**: Create `BundleCard.tsx` with props `product`, `isSelected`, `onToggle`, `isMainProduct`
2. **Container**: Div with border, padding, rounded corners, hover shadow
3. **Checkbox**: Top-left position (hidden/disabled for main product), controlled by isSelected
4. **Image**: Next.js Image 80x80 or 100x100, aspect square, rounded
5. **Info**: Product name (truncate 2 lines), price in LKR (₨), smaller font
6. **Link**: Wrap in Next.js Link to product page, checkbox still toggleable
7. **Selected State**: Apply accent border/background when isSelected true
8. **Main Product**: Show "This Item" badge, distinct styling, always included
9. **Responsive**: Adjust image size for mobile, maintain consistent height

### Bundle Card Structure

```
┌───────────────────────────┐
│ ☑                         │
│ ┌─────────────────────┐   │
│ │   Product Image     │   │
│ │   (100x100)         │   │
│ └─────────────────────┘   │
│                           │
│ Product Name Here...      │
│ ₨1,999                    │
│                           │
└───────────────────────────┘

Main Product (Always Selected):
┌───────────────────────────┐
│ [This Item]               │
│ ┌─────────────────────┐   │
│ │   Product Image     │   │
│ │   (100x100)         │   │
│ └─────────────────────┘   │
│                           │
│ Product Name Here...      │
│ ₨1,999                    │
│                           │
└───────────────────────────┘
```

### Card Size Specifications

| Element | Mobile | Tablet | Desktop | Notes |
|---------|--------|--------|---------|-------|
| Card Width | 100% | 180px | 200px | Responsive |
| Image Size | 80x80px | 100x100px | 100x100px | Square ratio |
| Padding | 12px | 16px | 16px | Internal spacing |
| Name Lines | 2 | 2 | 2 | Truncate with ellipsis |

### Card States

| State | Checkbox | Border | Background | Use Case |
|-------|----------|--------|------------|----------|
| Unselected | Unchecked | Gray | White | Optional product |
| Selected | Checked | Blue | Light Blue | Included in bundle |
| Main Product | Hidden/Disabled | Blue | Light Blue | Current product |
| Hover | - | Darker | Subtle shadow | Interactive feedback |

### Expected Outcome
A clean, compact bundle card that clearly shows product information, allows users to include or exclude products from the bundle (except main product), and provides visual feedback for selection state.

### Verification Checklist
- [ ] Card displays product image correctly
- [ ] Product name truncates properly
- [ ] Price displays in LKR (₨)
- [ ] Checkbox toggles selection state
- [ ] Main product shows "This Item" badge
- [ ] Selected state styling applies
- [ ] Link navigates to product page
- [ ] Hover effects work smoothly
- [ ] Responsive sizing works on all screens
- [ ] Consistent height across cards in bundle

---

## Document Summary

### Tasks Completed
This document covered **8 tasks (Tasks 83-90)** focused on related products, recently viewed products, and cross-sell functionality for the product detail page.

### Key Components Created
1. **RelatedProducts** - Section displaying similar products
2. **RelatedProductsGrid** - Horizontal scrollable grid layout
3. **RelatedProductCard** - Compact product card for horizontal scroll
4. **useRelatedProducts** - Data fetching hook with TanStack Query
5. **RecentlyViewed** - Section showing user's browsing history
6. **useRecentlyViewed** - localStorage management hook
7. **CrossSellSection** - "Frequently Bought Together" bundle
8. **BundleCard** - Product card for bundle selection

### Technology Integration
- **TanStack Query** for efficient data fetching and caching
- **localStorage** for client-side history tracking
- **Horizontal Scroll** with snap points for mobile UX
- **Bundle Pricing Logic** with discount calculations

### Next Steps
Proceed to **[02_Tasks-91-94_Final-Testing.md](02_Tasks-91-94_Final-Testing.md)** for comprehensive testing of all product detail page features.

---

**Document Version:** 1.0  
**Last Updated:** January 26, 2026  
**Status:** ✅ Complete
