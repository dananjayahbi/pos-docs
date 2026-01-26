# Tasks 61-70: Product, Inventory, Customer, and Sales Query Hooks

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** E - Module Query Hooks  
> **Document:** 01 of 02  
> **Tasks Covered:** 61, 62, 63, 64, 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-71-78_Invoice-HR-Dashboard-Reports.md](02_Tasks-71-78_Invoice-HR-Dashboard-Reports.md)

---

## Document Overview

This document covers the creation of TanStack Query hooks for core ERP modules including Products, Inventory Management, Customers, and Sales Orders. These hooks provide a standardized interface for fetching and caching data from the backend API, with support for filtering, pagination, and real-time updates.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 61 | Create useProducts Hook | Medium | 40 min |
| 62 | Create useProduct Hook | Low | 20 min |
| 63 | Create useCategories Hook | Low | 20 min |
| 64 | Create useInventory Hook | Medium | 35 min |
| 65 | Create useWarehouses Hook | Low | 20 min |
| 66 | Create useStockMovements Hook | Low | 25 min |
| 67 | Create useCustomers Hook | Medium | 40 min |
| 68 | Create useCustomer Hook | Low | 20 min |
| 69 | Create useVendors Hook | Medium | 35 min |
| 70 | Create useOrders Hook | Medium | 40 min |

---

## Task 61: Create useProducts Hook

### Overview
Create a TanStack Query hook for fetching a paginated and filtered list of products. This hook supports searching by name or SKU, filtering by category, status (active/inactive), and stock availability. It implements caching and automatic refetching for optimal user experience.

### Dependencies
- Task 60: QueryKey Index File (from Group D)
- API service for products endpoint exists
- Product TypeScript interfaces defined
- Query key factory configured

### Instructions

1. **Create useProducts.ts file**
   - Navigate to `frontend/hooks/queries/` directory
   - Create new file `useProducts.ts`
   - Import necessary dependencies

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import productApi from API services layer
   - Import productKeys from query key factory
   - Import Product and ProductFilters types
   - Import UseQueryResult type

3. **Define ProductFilters interface**
   - search: optional string for name/SKU search
   - categoryId: optional string for category filter
   - status: optional 'active' | 'inactive' | 'all'
   - inStock: optional boolean for stock filter
   - page: optional number for pagination (default 1)
   - limit: optional number for page size (default 20)

4. **Define hook function signature**
   - Function name: useProducts
   - Accept filters parameter (ProductFilters, optional)
   - Accept options parameter (useQuery options, optional)
   - Return UseQueryResult with Product array data

5. **Implement query key generation**
   - Use productKeys.list(filters) from key factory
   - Ensures cache key includes all filter parameters
   - Enables automatic cache invalidation

6. **Implement query function**
   - Call productApi.getProducts(filters)
   - Handle pagination parameters
   - Process filter parameters
   - Return API response data

7. **Configure query options**
   - Set staleTime to 5 minutes
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus to true
   - Merge with custom options passed to hook

8. **Return query result**
   - Return complete useQuery result object
   - Includes data, isLoading, error, refetch, etc.
   - Properly typed with Product array

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | ProductFilters | No | {} | Filter and pagination options |
| filters.search | string | No | - | Search by name or SKU |
| filters.categoryId | string | No | - | Filter by category ID |
| filters.status | string | No | 'all' | Filter by active/inactive |
| filters.inStock | boolean | No | - | Filter by stock availability |
| filters.page | number | No | 1 | Current page number |
| filters.limit | number | No | 20 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | Product[] | Array of product objects |
| isLoading | boolean | Initial loading state |
| isFetching | boolean | Background refetch state |
| error | Error | null | Error object if request failed |
| refetch | function | Manual refetch trigger |
| isSuccess | boolean | Successful fetch indicator |
| isError | boolean | Error state indicator |

### Query Key Structure

```
Query Key Example:
['products', 'list', { 
  search: 'laptop', 
  categoryId: 'cat-123', 
  status: 'active',
  page: 1,
  limit: 20 
}]

Cache Behavior:
- Different filters = different cache entries
- Filter order doesn't matter (normalized)
- Null/undefined filters omitted from key
```

### Filter Processing Logic

#### Search Filter
- Searches product name (case-insensitive)
- Searches product SKU (exact or partial match)
- Backend performs database search
- Empty string = no search filter

#### Category Filter
- Filters by exact category ID match
- Null/undefined = all categories
- Invalid ID returns empty results
- Supports nested category hierarchy

#### Status Filter
- 'active': Only active products
- 'inactive': Only inactive products
- 'all': Both active and inactive
- Default behavior: active products only

#### Stock Filter
- true: Only products with stock > 0
- false: Only products with stock = 0
- undefined: All products regardless of stock

### Pagination Flow

```
Page Navigation:
┌─────────────┐
│  Page 1     │ ← Initial load (filters.page = 1)
│  Items 1-20 │
└─────────────┘
      │
      ▼ User clicks "Next"
┌─────────────┐
│  Page 2     │ ← Fetch with filters.page = 2
│  Items 21-40│ ← Previous data remains until new data loads
└─────────────┘
      │
      ▼ Filter changes
┌─────────────┐
│  Page 1     │ ← Reset to page 1 with new filters
│  Filtered   │
└─────────────┘
```

### Caching Strategy

#### Stale Time Configuration
- Set to 5 minutes (300000ms)
- Data considered fresh for 5 minutes
- No refetch during stale period
- User can manually refetch anytime

#### Cache Invalidation Scenarios
- Product created: Invalidate list cache
- Product updated: Invalidate specific product and list
- Product deleted: Invalidate list cache
- Bulk operations: Invalidate entire product cache

#### Background Refetching
- Refetch on window focus (enabled)
- Refetch on component remount (disabled)
- Keep previous data during refetch (enabled)
- Show stale data while fetching fresh data

### Error Handling

#### Network Errors
- Connection timeout
- Network unavailable
- Server unreachable
- Retry logic: 3 attempts with exponential backoff

#### API Errors
- 400 Bad Request: Invalid filters
- 401 Unauthorized: Authentication required
- 403 Forbidden: Insufficient permissions
- 404 Not Found: Invalid endpoint
- 500 Server Error: Backend failure

#### Error Response Structure
| Property | Type | Description |
|----------|------|-------------|
| message | string | User-friendly error message |
| code | string | Error code for handling |
| status | number | HTTP status code |
| details | object | Additional error context |

### Performance Considerations

#### Debouncing Search Input
- Hook doesn't handle debouncing internally
- Implement debouncing in component
- Recommended delay: 300-500ms
- Prevents excessive API calls

#### Optimistic Updates
- Display cached data immediately
- Fetch fresh data in background
- Update UI when fresh data arrives
- Maintain smooth user experience

#### Memory Management
- Cached data garbage collected after 10 minutes of inactivity
- Limit total cache size
- Remove least recently used entries
- Monitor memory usage in production

### Expected Outcome
- Functional useProducts hook
- Support for comprehensive filtering
- Efficient caching and refetching
- Seamless pagination experience
- Proper error handling

### Verification Checklist
- [ ] useProducts.ts file created in hooks/queries/
- [ ] ProductFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses productKeys.list()
- [ ] Query function calls productApi.getProducts()
- [ ] StaleTime set to 5 minutes
- [ ] KeepPreviousData enabled for pagination
- [ ] Return type properly typed
- [ ] All filters properly processed
- [ ] Error handling implemented

---

## Task 62: Create useProduct Hook

### Overview
Create a TanStack Query hook for fetching a single product by its unique identifier. This hook supports conditional fetching (only when ID is provided) and automatic cache integration with the products list hook.

### Dependencies
- Task 60: QueryKey Index File
- Task 61: Create useProducts Hook (for cache consistency)
- Product API service exists
- Product TypeScript interface defined

### Instructions

1. **Create useProduct.ts file**
   - Create file in `frontend/hooks/queries/`
   - Import TanStack Query utilities
   - Import API services and types

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import productApi service
   - Import productKeys from key factory
   - Import Product type interface
   - Import UseQueryResult type

3. **Define hook parameters interface**
   - id: string (product ID, required)
   - enabled: boolean (optional, default true)
   - options: useQuery options (optional)

4. **Define hook function**
   - Function name: useProduct
   - Accept id as first parameter
   - Accept options object for useQuery config
   - Return typed query result

5. **Implement conditional fetching**
   - Use enabled option: !!id
   - Only fetch when ID is truthy
   - Skip query if ID is null/undefined/empty

6. **Implement query key**
   - Use productKeys.detail(id)
   - Unique key for each product
   - Integrates with list cache

7. **Implement query function**
   - Call productApi.getProduct(id)
   - Handle API response
   - Return product data

8. **Configure query options**
   - Set staleTime to 10 minutes
   - Enable cache reuse from list query
   - Set retry to 2 attempts
   - Merge custom options

9. **Add select transformer (optional)**
   - Transform API response if needed
   - Normalize data structure
   - Compute derived fields

10. **Return query result**
    - Return complete useQuery result
    - Properly typed with Product interface
    - Include loading and error states

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| id | string | Yes | - | Product unique identifier |
| options | object | No | {} | Additional useQuery options |
| options.enabled | boolean | No | !!id | Enable/disable query |
| options.staleTime | number | No | 600000 | Data freshness duration |
| options.retry | number | No | 2 | Failed request retry count |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | Product | null | Single product object |
| isLoading | boolean | Initial fetch loading state |
| isFetching | boolean | Refetch loading state |
| error | Error | null | Error if request failed |
| refetch | function | Manual refetch function |
| isSuccess | boolean | Successful fetch flag |
| isError | boolean | Error state flag |

### Query Key Structure

```
Query Key Example:
['products', 'detail', 'prod-abc123']

Cache Hierarchy:
products
├── list (all products with filters)
└── detail
    ├── prod-abc123
    ├── prod-def456
    └── prod-ghi789
```

### Conditional Fetching Logic

#### Enabled States
| Scenario | ID Value | Enabled | Behavior |
|----------|----------|---------|----------|
| Valid ID | 'prod-123' | true | Fetch product data |
| Empty ID | '' | false | Skip query execution |
| Null ID | null | false | Skip query execution |
| Undefined ID | undefined | false | Skip query execution |
| Custom disable | 'prod-123' | false | Skip despite valid ID |

#### Use Cases for Conditional Fetching
- Route parameter not yet loaded
- Dependent on user selection
- Form in create mode (no existing ID)
- Permission-based access control
- Progressive data loading

### Cache Integration

#### Initial Population from List Query
```
Scenario: User views product list, then clicks product
1. List query populates cache:
   ['products', 'list'] → Array of products
2. User clicks product ID 'prod-123'
3. Detail query checks cache
4. If product 'prod-123' in list cache:
   - Use cached data immediately
   - Fetch fresh data in background
5. If not in cache:
   - Show loading state
   - Fetch from API
```

#### Cache Update on Mutation
```
When product is updated:
1. Mutation completes
2. Invalidate ['products', 'detail', id]
3. Invalidate ['products', 'list']
4. Both queries refetch automatically
5. UI updates with fresh data
```

### Data Transformation

#### API Response Structure
| Field | Type | Transform | Final Type |
|-------|------|-----------|------------|
| id | string | None | string |
| name | string | Trim whitespace | string |
| sku | string | Uppercase | string |
| price | number | Parse float | number |
| stock | number | Parse int | number |
| category | object | Normalize | Category |
| created_at | string | Parse to Date | Date |
| updated_at | string | Parse to Date | Date |

#### Computed Fields
- isLowStock: computed from stock and reorder_level
- displayPrice: formatted with currency symbol
- categoryPath: full category hierarchy path
- availability: derived from stock and status

### Error Handling

#### Not Found (404)
- Product ID doesn't exist
- Product deleted after cache population
- Set error state with user-friendly message
- Allow retry or redirect to list

#### Access Denied (403)
- User lacks permission to view product
- Product belongs to different tenant
- Display appropriate error message
- Don't retry automatically

#### Network Errors
- Temporary connection issues
- Retry 2 times with backoff
- Show cached data if available
- Display offline indicator

### Loading States

#### Initial Load
- isLoading: true
- data: undefined
- Show skeleton loader
- Disable dependent actions

#### Background Refetch
- isLoading: false
- isFetching: true
- data: previous data visible
- Show subtle loading indicator

#### Error State
- isError: true
- error: Error object
- data: undefined
- Show error message with retry option

### Performance Optimization

#### Stale Time Strategy
- Set to 10 minutes (longer than list)
- Product details change less frequently
- Reduces unnecessary API calls
- User can manually refresh

#### Prefetching
- Prefetch on list item hover
- Preload related products
- Background fetch for next/prev
- Improve perceived performance

#### Dependent Queries
- Wait for product data before fetching related data
- Use enabled: !!data for dependent queries
- Fetch variants, reviews, inventory in parallel
- Optimize waterfall requests

### Expected Outcome
- Functional useProduct hook
- Conditional fetching based on ID
- Seamless cache integration
- Proper loading and error states
- Type-safe implementation

### Verification Checklist
- [ ] useProduct.ts file created
- [ ] Hook accepts id parameter
- [ ] Conditional fetching implemented (enabled: !!id)
- [ ] Query key uses productKeys.detail(id)
- [ ] Query function calls productApi.getProduct()
- [ ] StaleTime set to 10 minutes
- [ ] Return type properly typed
- [ ] Error handling for 404, 403
- [ ] Cache integration with list query
- [ ] Loading states properly exposed

---

## Task 63: Create useCategories Hook

### Overview
Create a TanStack Query hook for fetching product categories in a hierarchical structure. This hook supports flat or tree-structured data, filtering by parent category, and sorting options. Categories are cached aggressively since they change infrequently.

### Dependencies
- Task 60: QueryKey Index File
- Category API service exists
- Category TypeScript interfaces defined
- Query key factory includes category keys

### Instructions

1. **Create useCategories.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Set up imports for TanStack Query
   - Import types and services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import categoryApi service
   - Import categoryKeys from key factory
   - Import Category and CategoryFilters types
   - Import UseQueryResult type

3. **Define CategoryFilters interface**
   - parentId: optional string for hierarchy filter
   - includeInactive: boolean (default false)
   - format: 'flat' | 'tree' (default 'flat')
   - sortBy: 'name' | 'order' | 'created' (default 'order')

4. **Define hook function**
   - Function name: useCategories
   - Accept filters parameter (optional)
   - Accept custom options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use categoryKeys.list(filters)
   - Include format in cache key
   - Include parent filter in key

6. **Implement query function**
   - Call categoryApi.getCategories(filters)
   - Handle hierarchy parameters
   - Process format transformation
   - Apply sorting

7. **Configure query options**
   - Set staleTime to 30 minutes
   - Enable refetchOnMount: false
   - Set cacheTime to 1 hour
   - Categories rarely change

8. **Add tree transformation logic**
   - If format is 'tree', build hierarchy
   - Nest children under parent categories
   - Maintain sort order in tree
   - Handle orphaned categories

9. **Add sorting logic**
   - Sort by order field (custom ordering)
   - Sort by name (alphabetical)
   - Sort by created date (newest first)
   - Recursive sort for tree format

10. **Return query result**
    - Return complete useQuery result
    - Typed with Category array
    - Include utility flags

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | CategoryFilters | No | {} | Filtering and format options |
| filters.parentId | string | No | null | Filter by parent category |
| filters.includeInactive | boolean | No | false | Include inactive categories |
| filters.format | string | No | 'flat' | Return format (flat/tree) |
| filters.sortBy | string | No | 'order' | Sort criteria |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | Category[] | Array or tree of categories |
| isLoading | boolean | Initial loading state |
| error | Error | null | Error object if failed |
| refetch | function | Manual refetch trigger |
| isSuccess | boolean | Success indicator |

### Category Data Structure

#### Flat Format
```
Categories Array (Flat):
[
  { id: 'cat-1', name: 'Electronics', parentId: null, order: 1 },
  { id: 'cat-2', name: 'Laptops', parentId: 'cat-1', order: 1 },
  { id: 'cat-3', name: 'Gaming', parentId: 'cat-2', order: 1 },
  { id: 'cat-4', name: 'Business', parentId: 'cat-2', order: 2 },
  { id: 'cat-5', name: 'Phones', parentId: 'cat-1', order: 2 }
]

Use Case:
- Simple dropdowns
- Breadcrumb navigation
- Filter lists
- Quick lookups
```

#### Tree Format
```
Categories Tree (Hierarchical):
[
  {
    id: 'cat-1',
    name: 'Electronics',
    parentId: null,
    order: 1,
    children: [
      {
        id: 'cat-2',
        name: 'Laptops',
        parentId: 'cat-1',
        order: 1,
        children: [
          { id: 'cat-3', name: 'Gaming', children: [] },
          { id: 'cat-4', name: 'Business', children: [] }
        ]
      },
      {
        id: 'cat-5',
        name: 'Phones',
        children: []
      }
    ]
  }
]

Use Case:
- Tree view components
- Nested navigation menus
- Category browser
- Hierarchical displays
```

### Filter Processing

#### Parent Filter
- null: Root level categories only
- undefined: All categories (flat)
- specific ID: Direct children only
- Useful for progressive loading

#### Include Inactive Filter
- false (default): Active categories only
- true: Both active and inactive
- Inactive categories hidden from customers
- Visible in admin interfaces

### Sorting Strategies

#### By Custom Order
- Uses order field (integer)
- Manually set by administrators
- Allows drag-and-drop reordering
- Default and recommended sort

#### By Name
- Alphabetical ascending (A-Z)
- Case-insensitive comparison
- Ignores special characters
- User-friendly for large lists

#### By Creation Date
- Newest categories first
- Useful for recent additions
- Shows category growth over time
- Helpful in admin dashboards

### Tree Building Algorithm

```
Tree Building Process:
1. Start with flat array of all categories
2. Create map: categoryId → category object
3. Initialize result array (root level)
4. For each category:
   a. If parentId is null → Add to root
   b. If parentId exists → Find parent in map
   c. Add to parent's children array
   d. Create children array if not exists
5. Recursively sort children at each level
6. Return root level array

Time Complexity: O(n)
Space Complexity: O(n)
```

### Caching Strategy

#### Extended Stale Time
- Set to 30 minutes
- Categories rarely change
- Reduces API load significantly
- Admin changes invalidate cache

#### Cache Time
- Set to 1 hour
- Keep unused data longer
- Quick return to category pages
- Memory efficient (small dataset)

#### Refetch Behavior
- Don't refetch on mount by default
- Only refetch on explicit invalidation
- Refetch on window focus: false
- Manual refetch available

### Cache Invalidation Triggers

| Event | Invalidate | Reason |
|-------|------------|--------|
| Category created | All lists | New item affects all views |
| Category updated | Specific + lists | Name/order changed |
| Category deleted | All lists | Remove from all caches |
| Category reordered | All lists | Order affects all views |
| Hierarchy changed | All lists | Parent relationships changed |

### Error Handling

#### Empty Categories
- No categories exist in system
- Return empty array
- Not an error condition
- Show "no categories" message

#### Malformed Hierarchy
- Orphaned categories (parent doesn't exist)
- Place orphans at root level
- Log warning for admin
- Don't fail entire query

#### Circular References
- Category is ancestor of itself
- Detect during tree building
- Break circular link
- Log error for correction

### Performance Considerations

#### Small Dataset Optimization
- Categories typically < 100 items
- Fetch all at once (no pagination)
- Transform client-side (tree building)
- Cache entire dataset

#### Tree Transformation Cost
- Perform client-side for flexibility
- One-time cost on initial load
- Cached after first transformation
- Negligible performance impact

#### Memory Usage
- Flat format: ~5-10KB
- Tree format: ~10-20KB (includes children)
- Acceptable for client-side storage
- GC'd when cache expires

### Expected Outcome
- Functional useCategories hook
- Support for flat and tree formats
- Flexible filtering and sorting
- Aggressive caching for performance
- Clean hierarchical data structure

### Verification Checklist
- [ ] useCategories.ts file created
- [ ] CategoryFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses categoryKeys.list()
- [ ] Flat format returns array
- [ ] Tree format builds hierarchy correctly
- [ ] Sorting implemented for all options
- [ ] StaleTime set to 30 minutes
- [ ] RefetchOnMount disabled
- [ ] Error handling for malformed data
- [ ] Return type properly typed

---

## Task 64: Create useInventory Hook

### Overview
Create a TanStack Query hook for fetching current inventory stock levels across all warehouses. This hook aggregates stock data, supports filtering by product, warehouse, and stock status, and provides real-time inventory visibility for the ERP system.

### Dependencies
- Task 60: QueryKey Index File
- Inventory API service exists
- Inventory and Stock TypeScript interfaces defined
- Warehouse data available

### Instructions

1. **Create useInventory.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query utilities
   - Import inventory services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import inventoryApi service
   - Import inventoryKeys from key factory
   - Import InventoryItem, InventoryFilters types
   - Import UseQueryResult type

3. **Define InventoryFilters interface**
   - productId: optional string to filter by product
   - warehouseId: optional string to filter by warehouse
   - stockStatus: 'all' | 'in_stock' | 'low_stock' | 'out_of_stock'
   - search: optional string for product search
   - page: number for pagination
   - limit: number for page size

4. **Define hook function**
   - Function name: useInventory
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use inventoryKeys.list(filters)
   - Include all filter parameters in key
   - Separate cache entries per filter combination

6. **Implement query function**
   - Call inventoryApi.getInventoryLevels(filters)
   - Fetch aggregate stock data
   - Include product details
   - Include warehouse information

7. **Configure query options**
   - Set staleTime to 2 minutes
   - Enable refetchInterval: 5 minutes (optional)
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus: true

8. **Add stock status filtering logic**
   - in_stock: quantity > 0
   - low_stock: quantity <= reorder_level && quantity > 0
   - out_of_stock: quantity === 0
   - all: no filtering

9. **Add data transformation**
   - Calculate total stock across warehouses
   - Compute stock status for each item
   - Format quantities with units
   - Include variance data

10. **Return query result**
    - Return complete useQuery result
    - Typed with InventoryItem array
    - Include pagination metadata

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | InventoryFilters | No | {} | Filtering and pagination |
| filters.productId | string | No | null | Filter by specific product |
| filters.warehouseId | string | No | null | Filter by warehouse |
| filters.stockStatus | string | No | 'all' | Stock level filter |
| filters.search | string | No | '' | Search product name/SKU |
| filters.page | number | No | 1 | Page number |
| filters.limit | number | No | 50 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | PaginatedInventory | Inventory items with metadata |
| data.items | InventoryItem[] | Array of inventory records |
| data.total | number | Total item count |
| data.page | number | Current page |
| data.pages | number | Total pages |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |

### Inventory Item Structure

#### InventoryItem Interface
| Field | Type | Description |
|-------|------|-------------|
| id | string | Inventory record ID |
| productId | string | Product identifier |
| productName | string | Product name |
| productSku | string | Product SKU |
| warehouseId | string | Warehouse identifier |
| warehouseName | string | Warehouse name |
| quantity | number | Current stock quantity |
| unit | string | Unit of measurement |
| reorderLevel | number | Reorder threshold |
| reorderQuantity | number | Default reorder amount |
| lastRestocked | Date | null | Last restock date |
| stockStatus | string | Computed status |
| value | number | Total value (qty × price) |

#### Stock Status Calculation
```
Stock Status Logic:
┌─────────────────┐
│ quantity === 0? │ → YES → out_of_stock
└────────┬────────┘
         NO
         ▼
┌────────────────────────┐
│ quantity <= reorderLevel?│ → YES → low_stock
└────────┬───────────────┘
         NO
         ▼
      in_stock
```

### Filter Processing

#### Product Filter
- Specific product ID: Shows stock across all warehouses for that product
- Useful for product detail pages
- Shows inventory distribution
- Aggregates total available stock

#### Warehouse Filter
- Specific warehouse ID: Shows all products in that warehouse
- Useful for warehouse management view
- Location-specific inventory
- Warehouse capacity planning

#### Combined Filters
- Product + Warehouse: Specific stock level at location
- Product + Status: Products matching status
- Warehouse + Status: Location items by status
- All filters: Precise inventory query

### Stock Status Categories

#### In Stock
- quantity > reorder_level
- Adequate inventory available
- No immediate action required
- Green indicator in UI

#### Low Stock
- quantity <= reorder_level AND quantity > 0
- Approaching stockout
- Reorder recommended
- Yellow/Orange indicator in UI

#### Out of Stock
- quantity === 0
- No inventory available
- Immediate reorder needed
- Red indicator in UI

### Aggregation Logic

#### Multi-Warehouse Totals
```
Product Stock Aggregation:
Product: Laptop Model X
├── Warehouse A: 15 units
├── Warehouse B: 8 units
├── Warehouse C: 0 units
└── TOTAL: 23 units

Status Determination:
- Use total across all warehouses
- Status: in_stock (23 > reorder_level)
```

#### Warehouse Summary
```
Warehouse Stock Summary:
Warehouse A
├── Total Products: 150
├── In Stock: 120
├── Low Stock: 25
├── Out of Stock: 5
└── Total Value: $125,000
```

### Real-Time Updates

#### Polling Strategy
- Optional refetchInterval: 5 minutes
- Balance freshness vs API load
- Enable for critical inventory pages
- Disable for reports and history

#### Auto-Refetch Triggers
- Window focus: Refetch when user returns
- Network reconnect: Refetch after offline
- Manual stock adjustment: Invalidate cache
- Stock movement recorded: Invalidate related

### Data Transformation

#### Quantity Formatting
- Add unit suffix (pieces, boxes, kg)
- Format large numbers with separators
- Handle decimal quantities
- Show precision based on unit type

#### Value Calculation
- value = quantity × unit_cost
- Aggregate value by warehouse
- Compute total inventory value
- Currency formatting applied

#### Date Formatting
- lastRestocked: Relative time (2 hours ago)
- Absolute date in tooltip
- Handle null values gracefully
- Timezone-aware formatting

### Performance Optimization

#### Pagination
- Default 50 items per page
- Adjust based on use case
- Warehouse view: Higher limit
- Product search: Lower limit
- Balance load time vs completeness

#### Selective Loading
- Load only necessary fields
- Skip unused computed fields
- Lazy load detailed info
- Reduce response payload size

#### Cache Efficiency
- 2-minute stale time balances freshness
- Short enough for accuracy
- Long enough to reduce calls
- Adjust based on business needs

### Error Handling

#### Stock Discrepancy
- Computed stock doesn't match actual
- Display warning to user
- Trigger stock count workflow
- Log for investigation

#### Missing Product Data
- Inventory exists but product deleted
- Show as orphaned inventory
- Allow cleanup actions
- Prevent data corruption

#### Warehouse Unavailable
- Warehouse temporarily offline
- Exclude from totals
- Show warning indicator
- Retry connection periodically

### Expected Outcome
- Functional useInventory hook
- Real-time inventory visibility
- Multi-warehouse aggregation
- Flexible filtering by status
- Accurate stock calculations

### Verification Checklist
- [ ] useInventory.ts file created
- [ ] InventoryFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses inventoryKeys.list()
- [ ] Stock status filtering implemented
- [ ] Multi-warehouse aggregation works
- [ ] StaleTime set to 2 minutes
- [ ] RefetchInterval optional
- [ ] Pagination implemented
- [ ] Value calculations correct
- [ ] Return type properly typed

---

## Task 65: Create useWarehouses Hook

### Overview
Create a TanStack Query hook for fetching warehouse/location data. This hook provides a list of all storage locations where inventory is kept, supporting filtering by status and type, and enabling location-based inventory management.

### Dependencies
- Task 60: QueryKey Index File
- Warehouse API service exists
- Warehouse TypeScript interface defined
- Query key factory includes warehouse keys

### Instructions

1. **Create useWarehouses.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import warehouse services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import warehouseApi service
   - Import warehouseKeys from key factory
   - Import Warehouse and WarehouseFilters types
   - Import UseQueryResult type

3. **Define WarehouseFilters interface**
   - status: 'all' | 'active' | 'inactive'
   - type: 'warehouse' | 'retail' | 'all'
   - includeStats: boolean (include inventory stats)

4. **Define hook function**
   - Function name: useWarehouses
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use warehouseKeys.list(filters)
   - Include includeStats in cache key
   - Different keys for different filter combinations

6. **Implement query function**
   - Call warehouseApi.getWarehouses(filters)
   - Fetch warehouse data
   - Include location details
   - Optionally fetch inventory stats

7. **Configure query options**
   - Set staleTime to 15 minutes
   - Enable refetchOnMount: false
   - Warehouses change infrequently
   - Manual refetch on updates

8. **Add stats aggregation (if enabled)**
   - Total products in warehouse
   - Total inventory value
   - Low stock item count
   - Out of stock item count

9. **Add sorting logic**
   - Sort by name (default)
   - Sort by location code
   - Sort by inventory value
   - Sort by creation date

10. **Return query result**
    - Return complete useQuery result
    - Typed with Warehouse array
    - Include computed statistics

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | WarehouseFilters | No | {} | Filter options |
| filters.status | string | No | 'active' | Active/inactive filter |
| filters.type | string | No | 'all' | Warehouse type filter |
| filters.includeStats | boolean | No | false | Include inventory statistics |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | Warehouse[] | Array of warehouses |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |
| isSuccess | boolean | Success flag |

### Warehouse Data Structure

#### Warehouse Interface
| Field | Type | Description |
|-------|------|-------------|
| id | string | Warehouse identifier |
| name | string | Warehouse name |
| code | string | Unique location code |
| type | string | warehouse or retail |
| address | Address | Full address object |
| isActive | boolean | Active status |
| capacity | number | Maximum capacity |
| manager | string | null | Warehouse manager name |
| phone | string | null | Contact phone |
| email | string | null | Contact email |
| stats | object | null | Inventory statistics (optional) |

#### Warehouse Statistics (Optional)
| Field | Type | Description |
|-------|------|-------------|
| totalProducts | number | Unique product count |
| totalQuantity | number | Total units stored |
| totalValue | number | Total inventory value |
| inStockCount | number | Products with adequate stock |
| lowStockCount | number | Products below reorder level |
| outOfStockCount | number | Products with zero stock |
| utilizationRate | number | Capacity utilization (%) |

### Filter Processing

#### Status Filter
- 'active': Only active warehouses
- 'inactive': Only inactive/closed warehouses
- 'all': Both active and inactive
- Default: active (hide closed locations)

#### Type Filter
```
Warehouse Types:
┌─────────────────┐
│   warehouse     │ → Main storage facility, large capacity
│                 │   Distribution center, bulk storage
└─────────────────┘

┌─────────────────┐
│     retail      │ → Store location, customer-facing
│                 │   Point of sale, limited storage
└─────────────────┘

Use Cases:
- warehouse: Bulk operations, transfers
- retail: Customer orders, walk-in sales
- all: Full inventory visibility
```

#### Include Stats Filter
- false (default): Basic warehouse info only
- true: Include inventory statistics
- Stats require additional queries
- Use when displaying warehouse dashboard

### Statistics Calculation

#### Performance Impact
```
Without Stats (includeStats: false):
- Single query: Warehouse data
- Response time: ~50ms
- Response size: ~2KB

With Stats (includeStats: true):
- Multiple queries: Warehouse + Inventory
- Response time: ~200ms
- Response size: ~8KB

Recommendation:
- List views: Don't include stats
- Detail views: Include stats
- Dashboards: Include stats
- Dropdowns: Don't include stats
```

#### Capacity Utilization
```
utilizationRate = (totalQuantity / capacity) × 100

Status Indicators:
0-60%:   Underutilized (Green)
61-85%:  Optimal (Blue)
86-95%:  Near Capacity (Yellow)
96-100%: At Capacity (Orange)
>100%:   Over Capacity (Red)
```

### Sorting Strategies

#### By Name (Default)
- Alphabetical ascending
- Most user-friendly
- Easy to locate warehouses
- Consistent ordering

#### By Location Code
- Alphanumeric code sort
- Useful for structured codes
- Example: WH-001, WH-002, RET-NYC
- System-oriented view

#### By Inventory Value
- Descending by total value
- Shows most valuable locations
- Useful for financial reports
- Prioritizes high-value facilities

### Caching Strategy

#### Extended Stale Time
- Set to 15 minutes
- Warehouses rarely added/changed
- Reduce API load
- Still responsive to changes

#### No Refetch on Mount
- Don't refetch when component remounts
- Use cached data
- Only refetch on explicit invalidation
- User can manually refresh

### Use Cases

#### Warehouse Selection Dropdown
```
useWarehouses({
  status: 'active',
  type: 'all',
  includeStats: false
})

Display: Simple list for user selection
```

#### Warehouse Management Dashboard
```
useWarehouses({
  status: 'all',
  type: 'warehouse',
  includeStats: true
})

Display: Detailed cards with statistics
```

#### Inventory Transfer
```
useWarehouses({
  status: 'active',
  type: 'warehouse',
  includeStats: false
})

Display: Source and destination selection
```

#### Retail Locations Map
```
useWarehouses({
  status: 'active',
  type: 'retail',
  includeStats: true
})

Display: Map pins with inventory info
```

### Error Handling

#### Empty Warehouses
- No warehouses configured
- Not an error (valid state)
- Show onboarding prompt
- Guide user to create warehouse

#### Invalid Address Data
- Malformed address object
- Display partial information
- Don't fail entire query
- Log warning for cleanup

### Expected Outcome
- Functional useWarehouses hook
- Support for warehouse types
- Optional inventory statistics
- Flexible filtering
- Efficient caching

### Verification Checklist
- [ ] useWarehouses.ts file created
- [ ] WarehouseFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses warehouseKeys.list()
- [ ] Status filtering implemented
- [ ] Type filtering implemented
- [ ] includeStats option works
- [ ] Statistics calculation accurate
- [ ] StaleTime set to 15 minutes
- [ ] RefetchOnMount disabled
- [ ] Return type properly typed

---

## Task 66: Create useStockMovements Hook

### Overview
Create a TanStack Query hook for fetching stock movement history and transactions. This hook provides an audit trail of all inventory changes including receipts, transfers, adjustments, and sales, with filtering by date range, product, warehouse, and movement type.

### Dependencies
- Task 60: QueryKey Index File
- Task 64: Create useInventory Hook (for context)
- Stock movement API service exists
- StockMovement TypeScript interface defined

### Instructions

1. **Create useStockMovements.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import stock movement services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import stockMovementApi service
   - Import stockMovementKeys from key factory
   - Import StockMovement, MovementFilters types
   - Import UseQueryResult type

3. **Define MovementFilters interface**
   - productId: optional string
   - warehouseId: optional string
   - movementType: 'all' | 'in' | 'out' | 'adjustment' | 'transfer'
   - startDate: optional Date for date range
   - endDate: optional Date for date range
   - page: number for pagination
   - limit: number for page size

4. **Define hook function**
   - Function name: useStockMovements
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use stockMovementKeys.list(filters)
   - Include all filter parameters
   - Serialize dates properly in key

6. **Implement query function**
   - Call stockMovementApi.getMovements(filters)
   - Fetch paginated movement history
   - Include related product and warehouse data
   - Format dates and quantities

7. **Configure query options**
   - Set staleTime to 1 minute
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus: true
   - Movement history needs freshness

8. **Add movement type filtering**
   - 'in': Stock received (purchases, returns)
   - 'out': Stock removed (sales, transfers)
   - 'adjustment': Manual corrections
   - 'transfer': Between warehouses
   - 'all': All movement types

9. **Add date range filtering**
   - Default to last 30 days
   - Support custom date ranges
   - Handle timezone conversion
   - Validate date range validity

10. **Return query result**
    - Return complete useQuery result
    - Typed with StockMovement array
    - Include pagination metadata

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | MovementFilters | No | {} | Filter and pagination |
| filters.productId | string | No | null | Filter by product |
| filters.warehouseId | string | No | null | Filter by warehouse |
| filters.movementType | string | No | 'all' | Movement direction |
| filters.startDate | Date | No | 30 days ago | Range start |
| filters.endDate | Date | No | now | Range end |
| filters.page | number | No | 1 | Page number |
| filters.limit | number | No | 50 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | PaginatedMovements | Movement records with metadata |
| data.items | StockMovement[] | Array of movements |
| data.total | number | Total records |
| data.page | number | Current page |
| data.pages | number | Total pages |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |

### StockMovement Data Structure

#### StockMovement Interface
| Field | Type | Description |
|-------|------|-------------|
| id | string | Movement record ID |
| productId | string | Product identifier |
| productName | string | Product name |
| productSku | string | Product SKU |
| warehouseId | string | Warehouse identifier |
| warehouseName | string | Warehouse name |
| movementType | string | Type of movement |
| direction | 'in' | 'out' | Stock direction |
| quantity | number | Quantity moved |
| unit | string | Unit of measurement |
| previousQuantity | number | Stock before movement |
| newQuantity | number | Stock after movement |
| referenceType | string | Related document type |
| referenceId | string | Related document ID |
| reason | string | null | Movement reason |
| performedBy | string | User who performed |
| performedAt | Date | Movement timestamp |
| notes | string | null | Additional notes |

### Movement Type Categories

#### Stock In (Receipt)
```
Movement Types: Stock Received
┌────────────────────┐
│  Purchase Receipt  │ → From vendor purchase order
├────────────────────┤
│  Customer Return   │ → Returned by customer
├────────────────────┤
│  Transfer In       │ → From another warehouse
├────────────────────┤
│  Production        │ → Manufactured items
└────────────────────┘

Direction: 'in'
Effect: Increases inventory
Color: Green
Icon: Arrow up / Plus
```

#### Stock Out (Issue)
```
Movement Types: Stock Removed
┌────────────────────┐
│  Sale              │ → Sold to customer
├────────────────────┤
│  Vendor Return     │ → Returned to vendor
├────────────────────┤
│  Transfer Out      │ → To another warehouse
├────────────────────┤
│  Damage/Loss       │ → Damaged or lost items
└────────────────────┘

Direction: 'out'
Effect: Decreases inventory
Color: Red
Icon: Arrow down / Minus
```

#### Adjustment
```
Movement Types: Manual Corrections
┌────────────────────┐
│  Stock Count       │ → Physical inventory count
├────────────────────┤
│  Correction        │ → Error correction
├────────────────────┤
│  Write-off         │ → Obsolete stock removal
└────────────────────┘

Direction: 'in' or 'out' (depends on correction)
Effect: Adjusts to actual quantity
Color: Orange
Icon: Edit / Adjust
```

#### Transfer
```
Movement Types: Location Changes
┌────────────────────────────────┐
│  Transfer Out (Source)         │
│  Transfer In (Destination)     │
└────────────────────────────────┘

Creates two records:
1. 'out' at source warehouse
2. 'in' at destination warehouse

Linked by transfer ID
Zero-sum on total inventory
```

### Filter Combinations

#### Product History
```
useStockMovements({
  productId: 'prod-123',
  movementType: 'all',
  startDate: 90 days ago,
  endDate: now
})

Use Case: Complete product movement history
Displays: All transactions for specific product
```

#### Warehouse Activity
```
useStockMovements({
  warehouseId: 'wh-001',
  movementType: 'all',
  startDate: today,
  endDate: now
})

Use Case: Today's warehouse transactions
Displays: All in/out for specific location
```

#### Recent Adjustments
```
useStockMovements({
  movementType: 'adjustment',
  startDate: 7 days ago,
  endDate: now
})

Use Case: Recent manual corrections
Displays: Audit trail of adjustments
```

### Date Range Handling

#### Default Date Range
```
Default Behavior:
startDate: 30 days before current date
endDate: current date/time

Rationale:
- Most users interested in recent history
- Balances data volume vs relevance
- Faster queries with narrower range
```

#### Custom Date Ranges
```
Common Presets:
- Today: midnight to now
- This Week: Monday to now
- This Month: 1st to now
- Last Month: 1st to last day of previous month
- Last 90 Days: 90 days ago to now
- Year to Date: Jan 1 to now
- Custom: User-selected start and end
```

#### Timezone Considerations
```
Date Handling:
1. User selects dates in local timezone
2. Convert to UTC for API request
3. Server stores in UTC
4. Response includes UTC timestamps
5. Display in user's local timezone

Example:
User (EST): Jan 15, 2026 00:00
API (UTC): Jan 15, 2026 05:00
Display: Jan 15, 2026 12:00 AM EST
```

### Pagination Strategy

#### Page Size Considerations
```
Recommended Limits:
- History view: 50 items per page
- Audit report: 100 items per page
- Quick lookup: 20 items per page
- Export: 1000 items (with warning)

Balance:
- Performance vs completeness
- Load time vs scrolling
- User patience vs data needs
```

### Reference Linking

#### Reference Types
| Type | Description | Link To |
|------|-------------|---------|
| purchase | Purchase order receipt | Purchase Order detail |
| sale | Sale transaction | Sale/Invoice detail |
| transfer | Warehouse transfer | Transfer document |
| adjustment | Stock count/correction | Adjustment form |
| return | Customer/vendor return | Return document |

#### Navigation Flow
```
Movement Record Click:
1. Identify reference type and ID
2. Navigate to referenced document
3. Highlight related items
4. Show movement context
5. Allow navigation back
```

### Audit Trail Features

#### Tracking Information
- Who: User who performed movement
- When: Precise timestamp
- What: Product and quantity
- Where: Warehouse location
- Why: Reason/notes
- How: Movement type and reference

#### Immutability
- Movement records cannot be edited
- Only new correcting movements
- Complete audit trail preservation
- Regulatory compliance support

### Performance Optimization

#### Query Optimization
- Index on productId, warehouseId, performedAt
- Efficient date range queries
- Pagination reduces payload
- Avoid full table scans

#### Cache Strategy
- Short stale time (1 minute)
- History can be time-sensitive
- Keep previous data during pagination
- Invalidate on new movements

### Expected Outcome
- Functional useStockMovements hook
- Complete movement history access
- Flexible filtering options
- Date range support
- Pagination for large datasets

### Verification Checklist
- [ ] useStockMovements.ts file created
- [ ] MovementFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses stockMovementKeys.list()
- [ ] Movement type filtering implemented
- [ ] Date range filtering works
- [ ] Pagination implemented
- [ ] StaleTime set to 1 minute
- [ ] KeepPreviousData enabled
- [ ] Reference linking supported
- [ ] Return type properly typed

---

## Task 67: Create useCustomers Hook

### Overview
Create a TanStack Query hook for fetching customer records with support for searching, filtering by various criteria, and pagination. This hook provides access to the customer database for sales, invoicing, and CRM functionality.

### Dependencies
- Task 60: QueryKey Index File
- Customer API service exists
- Customer TypeScript interface defined
- Query key factory includes customer keys

### Instructions

1. **Create useCustomers.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import customer services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import customerApi service
   - Import customerKeys from key factory
   - Import Customer, CustomerFilters types
   - Import UseQueryResult type

3. **Define CustomerFilters interface**
   - search: optional string (name, email, phone)
   - customerType: 'all' | 'retail' | 'wholesale'
   - status: 'all' | 'active' | 'inactive'
   - creditStatus: 'all' | 'good' | 'overdue'
   - sortBy: 'name' | 'created' | 'lastOrder' | 'totalSpent'
   - sortOrder: 'asc' | 'desc'
   - page: number for pagination
   - limit: number for page size

4. **Define hook function**
   - Function name: useCustomers
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use customerKeys.list(filters)
   - Include all filter and sort parameters
   - Separate cache per filter combination

6. **Implement query function**
   - Call customerApi.getCustomers(filters)
   - Fetch paginated customer data
   - Include customer statistics
   - Process search and filters server-side

7. **Configure query options**
   - Set staleTime to 3 minutes
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus: true
   - Customer data moderately dynamic

8. **Add search functionality**
   - Search by customer name
   - Search by email address
   - Search by phone number
   - Search by customer code/ID

9. **Add sorting logic**
   - Sort by name (alphabetical)
   - Sort by creation date (newest/oldest)
   - Sort by last order date (recent customers)
   - Sort by total spent (best customers)

10. **Return query result**
    - Return complete useQuery result
    - Typed with Customer array
    - Include pagination and total count

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | CustomerFilters | No | {} | Search and filter options |
| filters.search | string | No | '' | Search query |
| filters.customerType | string | No | 'all' | Customer type filter |
| filters.status | string | No | 'active' | Active/inactive filter |
| filters.creditStatus | string | No | 'all' | Credit standing filter |
| filters.sortBy | string | No | 'name' | Sort field |
| filters.sortOrder | string | No | 'asc' | Sort direction |
| filters.page | number | No | 1 | Page number |
| filters.limit | number | No | 25 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | PaginatedCustomers | Customer records with metadata |
| data.items | Customer[] | Array of customers |
| data.total | number | Total customer count |
| data.page | number | Current page |
| data.pages | number | Total pages |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |

### Customer Data Structure

#### Customer Interface
| Field | Type | Description |
|-------|------|-------------|
| id | string | Customer identifier |
| code | string | Unique customer code |
| name | string | Full name or company name |
| email | string | null | Email address |
| phone | string | null | Primary phone number |
| customerType | string | retail or wholesale |
| status | string | active or inactive |
| address | Address | null | Billing address |
| shippingAddress | Address | null | Shipping address |
| taxId | string | null | Tax identification |
| creditLimit | number | Maximum credit allowed |
| currentCredit | number | Current outstanding credit |
| creditStatus | string | good or overdue |
| totalOrders | number | Lifetime order count |
| totalSpent | number | Lifetime purchase value |
| lastOrderDate | Date | null | Most recent order |
| createdAt | Date | Customer creation date |
| notes | string | null | Internal notes |

### Filter Processing

#### Customer Type Filter
```
Customer Types:
┌─────────────────┐
│     retail      │ → Individual consumers
│                 │   B2C transactions
│                 │   Standard pricing
│                 │   Single unit purchases
└─────────────────┘

┌─────────────────┐
│   wholesale     │ → Business customers
│                 │   B2B transactions
│                 │   Bulk pricing
│                 │   Credit terms
└─────────────────┘
```

#### Status Filter
- 'active': Currently trading customers
- 'inactive': Dormant or closed accounts
- 'all': Both active and inactive
- Default: active (hide closed accounts)

#### Credit Status Filter
```
Credit Status Categories:
┌─────────────────┐
│      good       │ → No overdue payments
│                 │   Within credit limit
│                 │   Reliable payment history
└─────────────────┘

┌─────────────────┐
│    overdue      │ → Outstanding payments past due
│                 │   May exceed credit limit
│                 │   Payment reminder needed
└─────────────────┘

Use Cases:
- good: Normal order processing
- overdue: Credit hold, collection
- all: Full customer visibility
```

### Search Implementation

#### Multi-Field Search
```
Search Query: "john"

Searches in:
1. Customer name (case-insensitive)
   - "John Smith" ✓
   - "Johnny's Store" ✓
2. Email address
   - "john.doe@email.com" ✓
3. Phone number
   - No match
4. Customer code
   - "JOHN-001" ✓

Returns: All matching records
```

#### Search Performance
```
Optimization Strategies:
1. Database indexing on searchable fields
2. Full-text search for name
3. Exact match for codes
4. Debounce user input (300ms)
5. Minimum 2-3 characters to search
```

### Sorting Strategies

#### By Name (Default)
```
Sort Order: Alphabetical
- Ascending (A-Z): Default
- Descending (Z-A): Optional

Handling:
- Case-insensitive sort
- Ignore special characters
- Numbers sorted after letters
- Empty names at end
```

#### By Creation Date
```
Sort Order: Chronological
- Newest First (desc): Recent signups
- Oldest First (asc): Long-term customers

Use Cases:
- New customer onboarding
- Historical analysis
- Customer acquisition trends
```

#### By Last Order Date
```
Sort Order: Recency
- Most Recent (desc): Active customers
- Least Recent (asc): Inactive customers

Identification:
- Recent: Ordered within 30 days
- Moderate: Ordered within 90 days
- Inactive: No orders >90 days
- Never: No orders (null date)
```

#### By Total Spent
```
Sort Order: Purchase Value
- Highest First (desc): VIP customers
- Lowest First (asc): New/small buyers

Insights:
- Top 20%: High-value customers
- Middle 60%: Regular customers
- Bottom 20%: Occasional buyers

Revenue Focus:
Pareto Principle: 80% revenue from 20% customers
```

### Credit Management

#### Credit Limit Tracking
```
Credit Status Calculation:
┌────────────────────────────────┐
│ currentCredit <= creditLimit?  │ → YES → Within Limit
└───────────────┬────────────────┘
                NO
                ▼
          Over Credit Limit
```

#### Overdue Detection
```
Overdue Logic:
1. Fetch all customer invoices
2. Check payment due dates
3. Compare with current date
4. If any invoice overdue:
   - creditStatus = 'overdue'
5. Else:
   - creditStatus = 'good'

Grace Period:
- 1-7 days: Reminder
- 8-14 days: Warning
- 15+ days: Overdue status
```

### Customer Statistics

#### Computed Fields
| Field | Calculation | Purpose |
|-------|-------------|---------|
| totalOrders | COUNT(orders) | Customer activity level |
| totalSpent | SUM(order.total) | Lifetime value |
| averageOrderValue | totalSpent / totalOrders | Spending pattern |
| lastOrderDate | MAX(order.date) | Recency indicator |
| daysSinceLastOrder | NOW - lastOrderDate | Inactive identification |

### Pagination Considerations

#### Page Size
- Default: 25 customers per page
- List view: 25-50 items
- Dropdown: 10-15 items
- Export: 1000 items maximum

#### Performance
```
Response Time vs Page Size:
25 items:  ~100ms
50 items:  ~150ms
100 items: ~250ms
500 items: ~1000ms
```

### Use Cases

#### Customer Selection in Order
```
useCustomers({
  status: 'active',
  sortBy: 'name',
  limit: 15
})

Display: Searchable dropdown
```

#### Customer Management Dashboard
```
useCustomers({
  status: 'all',
  sortBy: 'totalSpent',
  sortOrder: 'desc',
  limit: 50
})

Display: Sortable table with actions
```

#### Credit Review List
```
useCustomers({
  creditStatus: 'overdue',
  sortBy: 'lastOrder',
  sortOrder: 'asc'
})

Display: Customers needing follow-up
```

### Expected Outcome
- Functional useCustomers hook
- Comprehensive search and filtering
- Multiple sorting options
- Credit status tracking
- Pagination support

### Verification Checklist
- [ ] useCustomers.ts file created
- [ ] CustomerFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses customerKeys.list()
- [ ] Search across multiple fields
- [ ] Customer type filtering works
- [ ] Credit status filtering works
- [ ] All sort options implemented
- [ ] StaleTime set to 3 minutes
- [ ] KeepPreviousData enabled
- [ ] Return type properly typed

---

## Task 68: Create useCustomer Hook

### Overview
Create a TanStack Query hook for fetching a single customer's detailed information by ID. This hook includes customer profile, contact details, statistics, recent orders, and payment history, providing a complete customer view for CRM and sales operations.

### Dependencies
- Task 60: QueryKey Index File
- Task 67: Create useCustomers Hook (for cache consistency)
- Customer API service exists
- Customer TypeScript interface defined

### Instructions

1. **Create useCustomer.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import customer services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import customerApi service
   - Import customerKeys from key factory
   - Import Customer, CustomerDetail types
   - Import UseQueryResult type

3. **Define hook parameters**
   - id: string (customer ID, required)
   - includeOrders: boolean (fetch recent orders)
   - includePayments: boolean (fetch payment history)
   - enabled: boolean (conditional fetching)

4. **Define hook function**
   - Function name: useCustomer
   - Accept id as first parameter
   - Accept options object (optional)
   - Return typed query result

5. **Implement conditional fetching**
   - Use enabled: !!id
   - Skip query if ID is falsy
   - Prevent unnecessary API calls

6. **Implement query key**
   - Use customerKeys.detail(id, options)
   - Include includeOrders and includePayments in key
   - Separate cache for different data levels

7. **Implement query function**
   - Call customerApi.getCustomer(id, options)
   - Fetch customer profile
   - Optionally fetch related data
   - Aggregate statistics

8. **Configure query options**
   - Set staleTime to 5 minutes
   - Enable cache integration with list
   - Set retry to 2 attempts
   - Merge custom options

9. **Add data enrichment**
   - Calculate customer lifetime value
   - Compute days since last order
   - Determine customer segment
   - Format display fields

10. **Return query result**
    - Return complete useQuery result
    - Typed with CustomerDetail interface
    - Include all related data

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| id | string | Yes | - | Customer unique identifier |
| options | object | No | {} | Additional options |
| options.includeOrders | boolean | No | false | Include recent orders |
| options.includePayments | boolean | No | false | Include payment history |
| options.enabled | boolean | No | !!id | Enable query execution |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | CustomerDetail | null | Detailed customer object |
| isLoading | boolean | Initial fetch loading |
| isFetching | boolean | Background refetch |
| error | Error | null | Error object |
| refetch | function | Manual refetch |
| isSuccess | boolean | Success indicator |

### CustomerDetail Data Structure

#### Core Customer Data
| Field | Type | Description |
|-------|------|-------------|
| id | string | Customer identifier |
| code | string | Unique customer code |
| name | string | Full name |
| email | string | null | Email address |
| phone | string | null | Phone number |
| mobile | string | null | Mobile number |
| customerType | string | retail or wholesale |
| status | string | active or inactive |
| billingAddress | Address | Billing address |
| shippingAddress | Address | Shipping address |
| taxId | string | null | Tax ID number |
| website | string | null | Company website |
| createdAt | Date | Registration date |
| updatedAt | Date | Last modification |
| notes | string | null | Internal notes |

#### Financial Data
| Field | Type | Description |
|-------|------|-------------|
| creditLimit | number | Maximum credit |
| currentCredit | number | Outstanding amount |
| availableCredit | number | Remaining credit |
| creditStatus | string | good or overdue |
| paymentTerms | string | null | Net 30, COD, etc |
| preferredPaymentMethod | string | null | Payment preference |

#### Statistics
| Field | Type | Description |
|-------|------|-------------|
| totalOrders | number | Lifetime order count |
| totalSpent | number | Lifetime purchase value |
| averageOrderValue | number | Avg order amount |
| lastOrderDate | Date | null | Most recent order |
| lastPaymentDate | Date | null | Most recent payment |
| daysSinceLastOrder | number | Recency metric |
| customerSegment | string | VIP/Regular/New |

#### Related Data (Optional)
| Field | Type | Description |
|-------|------|-------------|
| recentOrders | Order[] | null | Last 10 orders |
| paymentHistory | Payment[] | null | Last 20 payments |
| outstandingInvoices | Invoice[] | null | Unpaid invoices |

### Conditional Data Loading

#### Include Orders Option
```
includeOrders: false (default)
- Fetch customer profile only
- Faster response (~100ms)
- Smaller payload (~2KB)
- Use for: Quick customer lookup

includeOrders: true
- Fetch customer + recent orders
- Slower response (~300ms)
- Larger payload (~10KB)
- Use for: Customer detail page
```

#### Include Payments Option
```
includePayments: false (default)
- No payment history
- Basic financial summary only
- Use for: General customer view

includePayments: true
- Full payment transaction history
- Payment method breakdown
- Outstanding balance details
- Use for: Accounting, collections
```

### Cache Strategy

#### Query Key Variations
```
Cache Keys Based on Options:
['customers', 'detail', 'cust-123', {}]
['customers', 'detail', 'cust-123', { includeOrders: true }]
['customers', 'detail', 'cust-123', { includeOrders: true, includePayments: true }]

Separate cache entries allow:
- Partial data served quickly
- Full data loaded on demand
- Optimal performance per use case
```

#### Initial Population from List
```
Flow:
1. User views customer list (Task 67)
2. List cache contains basic customer data
3. User clicks customer to view details
4. Detail hook finds basic data in list cache
5. Shows basic data immediately
6. Fetches full details in background
7. Updates with complete information
```

### Data Enrichment

#### Available Credit Calculation
```
availableCredit = creditLimit - currentCredit

Example:
creditLimit: $10,000
currentCredit: $3,500
availableCredit: $6,500

Status:
>75% available: Good
50-75% available: Moderate
25-50% available: Caution
<25% available: High Utilization
```

#### Customer Segment Classification
```
Segmentation Logic:
1. Calculate totalSpent and daysSinceLastOrder
2. Apply segmentation rules:

VIP:
- totalSpent > $50,000
- OR totalOrders > 100
- AND lastOrder within 30 days

Regular:
- totalSpent > $5,000
- AND lastOrder within 90 days

New:
- totalOrders < 5
- OR createdAt within 30 days

Inactive:
- lastOrder > 90 days ago

Lost:
- lastOrder > 365 days ago
```

#### Display Formatting
```
Formatted Fields:
- creditLimit: $10,000.00
- currentCredit: $3,500.00
- totalSpent: $125,450.75
- averageOrderValue: $1,254.51
- phone: (555) 123-4567
- taxId: XX-XXXXXXX (masked)
- lastOrderDate: "2 days ago"
```

### Error Handling

#### Customer Not Found (404)
```
Scenarios:
- Invalid customer ID
- Customer deleted
- No access permission

Response:
- error.message: "Customer not found"
- error.code: "CUSTOMER_NOT_FOUND"
- Redirect to customer list
- Show notification
```

#### Access Denied (403)
```
Scenarios:
- Different tenant customer
- Insufficient permissions

Response:
- error.message: "Access denied"
- error.code: "FORBIDDEN"
- Stay on current page
- Show error message
```

### Performance Optimization

#### Progressive Loading
```
Load Strategy:
1. Fetch basic profile (fast)
2. Show customer info immediately
3. Fetch orders in background (if enabled)
4. Fetch payments in background (if enabled)
5. Update UI as data arrives

User sees profile within 100ms
Full data loaded within 500ms
```

#### Stale Time Configuration
```
staleTime: 5 minutes

Rationale:
- Customer data moderately dynamic
- Balance freshness vs API load
- Allow quick navigation back
- Still responsive to changes
```

### Use Cases

#### Quick Customer Lookup
```
useCustomer('cust-123', {
  includeOrders: false,
  includePayments: false
})

Context: Order entry, quick reference
Display: Basic contact and credit info
```

#### Customer Detail Page
```
useCustomer('cust-123', {
  includeOrders: true,
  includePayments: false
})

Context: Full customer profile view
Display: Profile + recent order history
```

#### Accounts Receivable Review
```
useCustomer('cust-123', {
  includeOrders: true,
  includePayments: true
})

Context: Financial review, collections
Display: Complete financial history
```

### Expected Outcome
- Functional useCustomer hook
- Detailed customer information
- Optional related data loading
- Computed statistics and segments
- Cache integration with list

### Verification Checklist
- [ ] useCustomer.ts file created
- [ ] Hook accepts id parameter
- [ ] Conditional fetching (enabled: !!id)
- [ ] Query key uses customerKeys.detail()
- [ ] includeOrders option works
- [ ] includePayments option works
- [ ] Customer segments calculated
- [ ] Available credit computed
- [ ] StaleTime set to 5 minutes
- [ ] Error handling for 404, 403
- [ ] Return type properly typed

---

## Task 69: Create useVendors Hook

### Overview
Create a TanStack Query hook for fetching vendor/supplier records with filtering, searching, and sorting capabilities. This hook supports vendor management for purchasing, inventory procurement, and accounts payable operations.

### Dependencies
- Task 60: QueryKey Index File
- Vendor API service exists
- Vendor TypeScript interface defined
- Query key factory includes vendor keys

### Instructions

1. **Create useVendors.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import vendor services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import vendorApi service
   - Import vendorKeys from key factory
   - Import Vendor, VendorFilters types
   - Import UseQueryResult type

3. **Define VendorFilters interface**
   - search: optional string (name, code, email)
   - status: 'all' | 'active' | 'inactive'
   - category: optional string (vendor category)
   - paymentStatus: 'all' | 'current' | 'overdue'
   - sortBy: 'name' | 'created' | 'lastPurchase' | 'totalPurchased'
   - sortOrder: 'asc' | 'desc'
   - page: number for pagination
   - limit: number for page size

4. **Define hook function**
   - Function name: useVendors
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use vendorKeys.list(filters)
   - Include all filter and sort parameters
   - Separate cache per filter combination

6. **Implement query function**
   - Call vendorApi.getVendors(filters)
   - Fetch paginated vendor data
   - Include vendor statistics
   - Process search and filters

7. **Configure query options**
   - Set staleTime to 5 minutes
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus: true
   - Vendor data moderately stable

8. **Add search functionality**
   - Search by vendor name
   - Search by vendor code
   - Search by contact email
   - Search by phone number

9. **Add sorting logic**
   - Sort by name (alphabetical)
   - Sort by creation date
   - Sort by last purchase date
   - Sort by total purchased amount

10. **Return query result**
    - Return complete useQuery result
    - Typed with Vendor array
    - Include pagination metadata

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | VendorFilters | No | {} | Filter and search options |
| filters.search | string | No | '' | Search query |
| filters.status | string | No | 'active' | Active/inactive filter |
| filters.category | string | No | null | Vendor category filter |
| filters.paymentStatus | string | No | 'all' | Payment status filter |
| filters.sortBy | string | No | 'name' | Sort field |
| filters.sortOrder | string | No | 'asc' | Sort direction |
| filters.page | number | No | 1 | Page number |
| filters.limit | number | No | 25 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | PaginatedVendors | Vendor records with metadata |
| data.items | Vendor[] | Array of vendors |
| data.total | number | Total vendor count |
| data.page | number | Current page |
| data.pages | number | Total pages |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |

### Vendor Data Structure

#### Vendor Interface
| Field | Type | Description |
|-------|------|-------------|
| id | string | Vendor identifier |
| code | string | Unique vendor code |
| name | string | Vendor company name |
| category | string | null | Vendor category |
| status | string | active or inactive |
| contactPerson | string | null | Primary contact name |
| email | string | null | Contact email |
| phone | string | null | Primary phone |
| mobile | string | null | Mobile number |
| website | string | null | Vendor website |
| address | Address | Vendor address |
| taxId | string | null | Tax identification |
| paymentTerms | string | null | Net 30, Net 60, etc |
| bankAccount | string | null | Bank account info |
| currentPayable | number | Outstanding amount owed |
| paymentStatus | string | current or overdue |
| totalPurchaseOrders | number | Lifetime PO count |
| totalPurchased | number | Lifetime purchase value |
| lastPurchaseDate | Date | null | Most recent purchase |
| createdAt | Date | Vendor creation date |
| notes | string | null | Internal notes |

### Filter Processing

#### Status Filter
```
Vendor Status:
┌─────────────────┐
│     active      │ → Currently trading vendors
│                 │   Accept orders
│                 │   Regular suppliers
└─────────────────┘

┌─────────────────┐
│    inactive     │ → No longer used
│                 │   Historical records
│                 │   Contract ended
└─────────────────┘
```

#### Category Filter
```
Vendor Categories:
- Raw Materials
- Finished Goods
- Packaging Supplies
- Equipment/Machinery
- Services
- Utilities
- Miscellaneous

Purpose:
- Organize vendor list
- Procurement planning
- Spending analysis
- Vendor comparison
```

#### Payment Status Filter
```
Payment Status:
┌─────────────────┐
│     current     │ → No overdue payments
│                 │   Good standing
│                 │   Normal terms apply
└─────────────────┘

┌─────────────────┐
│    overdue      │ → Past due payments exist
│                 │   Payment reminder needed
│                 │   Risk of supply disruption
└─────────────────┘
```

### Search Implementation

#### Multi-Field Search
```
Search Query: "tech"

Searches in:
1. Vendor name
   - "TechSupply Inc" ✓
   - "Advanced Technology" ✓
2. Vendor code
   - "TECH-001" ✓
3. Contact email
   - "contact@techsupply.com" ✓
4. Contact person
   - "Michael Technician" ✓

Returns: All matching vendors
```

### Sorting Strategies

#### By Name (Default)
- Alphabetical ascending (A-Z)
- Company name sorting
- Case-insensitive
- Most user-friendly

#### By Creation Date
- Chronological order
- Newest first (desc) for recent additions
- Oldest first (asc) for long-term relationships
- Vendor onboarding tracking

#### By Last Purchase Date
- Most recent purchase first (desc)
- Identifies active vendors
- Highlights inactive vendors
- Supplier relationship health

#### By Total Purchased
- Highest amount first (desc)
- Identifies key suppliers
- Strategic vendor management
- Negotiation leverage analysis

### Vendor Statistics

#### Computed Metrics
| Metric | Calculation | Purpose |
|--------|-------------|---------|
| totalPurchaseOrders | COUNT(purchase_orders) | Vendor activity |
| totalPurchased | SUM(po.total_amount) | Spending analysis |
| averagePurchaseValue | totalPurchased / totalPurchaseOrders | Order patterns |
| daysSinceLastPurchase | NOW - lastPurchaseDate | Vendor engagement |

### Payment Status Detection

#### Current Status Logic
```
Current Payment Status:
1. Fetch all vendor invoices/bills
2. Check payment due dates
3. All payments on time or early
4. paymentStatus = 'current'

Criteria:
- No overdue invoices
- All invoices paid within terms
- Good payment history
```

#### Overdue Status Logic
```
Overdue Detection:
1. Fetch unpaid invoices
2. Check due dates vs current date
3. Any invoice past due date
4. paymentStatus = 'overdue'

Implications:
- Payment follow-up needed
- Potential late fees
- Vendor relationship risk
- Cash flow management
```

### Use Cases

#### Purchase Order Creation
```
useVendors({
  status: 'active',
  sortBy: 'name',
  limit: 15
})

Display: Vendor dropdown selector
```

#### Vendor Management Dashboard
```
useVendors({
  status: 'all',
  sortBy: 'totalPurchased',
  sortOrder: 'desc',
  limit: 50
})

Display: Sortable vendor table
```

#### Accounts Payable Review
```
useVendors({
  paymentStatus: 'overdue',
  sortBy: 'lastPurchase',
  sortOrder: 'asc'
})

Display: Vendors requiring payment
```

#### Procurement Planning
```
useVendors({
  category: 'Raw Materials',
  status: 'active',
  sortBy: 'lastPurchase'
})

Display: Category-specific suppliers
```

### Performance Considerations

#### Pagination
- Default 25 vendors per page
- Balance load time vs scroll
- Adjust based on use case
- List view: 25-50 items
- Dropdown: 10-15 items

#### Cache Strategy
- StaleTime: 5 minutes
- Vendors change infrequently
- Keep previous data during pagination
- Background refetch on focus

### Expected Outcome
- Functional useVendors hook
- Comprehensive search and filtering
- Payment status tracking
- Multiple sorting options
- Vendor statistics included

### Verification Checklist
- [ ] useVendors.ts file created
- [ ] VendorFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses vendorKeys.list()
- [ ] Search functionality implemented
- [ ] Status filtering works
- [ ] Category filtering works
- [ ] Payment status filtering works
- [ ] All sort options implemented
- [ ] StaleTime set to 5 minutes
- [ ] KeepPreviousData enabled
- [ ] Return type properly typed

---

## Task 70: Create useOrders Hook

### Overview
Create a TanStack Query hook for fetching sales order records with comprehensive filtering, searching, and sorting capabilities. This hook supports order management, fulfillment tracking, and sales analysis with real-time data updates.

### Dependencies
- Task 60: QueryKey Index File
- Order API service exists
- Order TypeScript interface defined
- Query key factory includes order keys

### Instructions

1. **Create useOrders.ts file**
   - Create in `frontend/hooks/queries/` directory
   - Import TanStack Query
   - Import order services

2. **Import required modules**
   - Import useQuery from TanStack Query
   - Import orderApi service
   - Import orderKeys from key factory
   - Import Order, OrderFilters types
   - Import UseQueryResult type

3. **Define OrderFilters interface**
   - search: optional string (order number, customer name)
   - customerId: optional string for customer filter
   - status: order status filter
   - paymentStatus: payment status filter
   - fulfillmentStatus: fulfillment status filter
   - startDate: optional Date for date range
   - endDate: optional Date for date range
   - sortBy: sort field selection
   - sortOrder: 'asc' | 'desc'
   - page: number for pagination
   - limit: number for page size

4. **Define hook function**
   - Function name: useOrders
   - Accept filters parameter (optional)
   - Accept custom query options (optional)
   - Return typed query result

5. **Implement query key generation**
   - Use orderKeys.list(filters)
   - Include all filter parameters
   - Serialize dates in cache key

6. **Implement query function**
   - Call orderApi.getOrders(filters)
   - Fetch paginated order data
   - Include customer information
   - Include order totals and status

7. **Configure query options**
   - Set staleTime to 1 minute
   - Enable keepPreviousData for pagination
   - Set refetchOnWindowFocus: true
   - Orders are frequently updated

8. **Add status filtering**
   - Order status: draft, pending, confirmed, completed, cancelled
   - Payment status: unpaid, partial, paid, refunded
   - Fulfillment status: unfulfilled, partial, fulfilled, delivered

9. **Add date range filtering**
   - Filter by order date
   - Support custom date ranges
   - Default to current month
   - Handle timezone conversion

10. **Return query result**
    - Return complete useQuery result
    - Typed with Order array
    - Include pagination and totals

### Hook Interface Design

#### Input Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| filters | OrderFilters | No | {} | Filter options |
| filters.search | string | No | '' | Search query |
| filters.customerId | string | No | null | Customer filter |
| filters.status | string | No | 'all' | Order status |
| filters.paymentStatus | string | No | 'all' | Payment status |
| filters.fulfillmentStatus | string | No | 'all' | Fulfillment status |
| filters.startDate | Date | No | month start | Date range start |
| filters.endDate | Date | No | now | Date range end |
| filters.sortBy | string | No | 'orderDate' | Sort field |
| filters.sortOrder | string | No | 'desc' | Sort direction |
| filters.page | number | No | 1 | Page number |
| filters.limit | number | No | 25 | Items per page |

#### Return Value
| Property | Type | Description |
|----------|------|-------------|
| data | PaginatedOrders | Order records with metadata |
| data.items | Order[] | Array of orders |
| data.total | number | Total order count |
| data.totalAmount | number | Sum of order amounts |
| data.page | number | Current page |
| data.pages | number | Total pages |
| isLoading | boolean | Loading state |
| error | Error | null | Error object |
| refetch | function | Manual refetch |

### Order Data Structure

#### Order Interface
| Field | Type | Description |
|-------|------|-------------|
| id | string | Order identifier |
| orderNumber | string | Human-readable order number |
| customerId | string | Customer identifier |
| customerName | string | Customer name |
| orderDate | Date | Order creation date |
| status | string | Order status |
| paymentStatus | string | Payment status |
| fulfillmentStatus | string | Fulfillment status |
| subtotal | number | Items total |
| taxAmount | number | Tax amount |
| discountAmount | number | Discount applied |
| shippingAmount | number | Shipping cost |
| totalAmount | number | Final total |
| itemCount | number | Number of line items |
| paymentMethod | string | null | Payment method used |
| shippingMethod | string | null | Shipping method |
| trackingNumber | string | null | Shipping tracking |
| notes | string | null | Order notes |
| createdAt | Date | Record creation |
| updatedAt | Date | Last modification |

### Status Filtering

#### Order Status
```
Order Status Lifecycle:
┌───────┐   ┌─────────┐   ┌───────────┐   ┌───────────┐
│ draft │──▶│ pending │──▶│ confirmed │──▶│ completed │
└───────┘   └─────────┘   └───────────┘   └───────────┘
                │                              
                └──────────┐                  
                           ▼                  
                      ┌──────────┐            
                      │cancelled │            
                      └──────────┘            

Descriptions:
- draft: Order being created, not submitted
- pending: Submitted, awaiting confirmation
- confirmed: Approved, ready for fulfillment
- completed: Fulfilled and delivered
- cancelled: Order cancelled
```

#### Payment Status
```
Payment Status Flow:
┌────────┐   ┌─────────┐   ┌──────┐
│ unpaid │──▶│ partial │──▶│ paid │
└────────┘   └─────────┘   └──────┘
                               │
                               ▼
                          ┌──────────┐
                          │ refunded │
                          └──────────┘

Descriptions:
- unpaid: No payment received
- partial: Partial payment made
- paid: Fully paid
- refunded: Payment returned
```

#### Fulfillment Status
```
Fulfillment Status Flow:
┌─────────────┐   ┌─────────┐   ┌───────────┐   ┌───────────┐
│ unfulfilled │──▶│ partial │──▶│ fulfilled │──▶│ delivered │
└─────────────┘   └─────────┘   └───────────┘   └───────────┘

Descriptions:
- unfulfilled: Items not picked/packed
- partial: Some items fulfilled
- fulfilled: All items packed, not shipped
- delivered: Shipped and delivered
```

### Multi-Status Filtering

#### Combined Status View
```
Example: Ready to Ship Orders
- status: 'confirmed'
- paymentStatus: 'paid'
- fulfillmentStatus: 'unfulfilled'

Result: Orders that are:
✓ Confirmed by customer
✓ Payment received
✓ Not yet fulfilled
→ Ready for picking/packing
```

### Date Range Filtering

#### Default Date Range
```
Default: Current Month
startDate: First day of current month (00:00)
endDate: Current date/time

Example (January 2026):
startDate: Jan 1, 2026 00:00
endDate: Jan 25, 2026 14:30
```

#### Common Date Presets
```
Preset Date Ranges:
- Today: Midnight to now
- Yesterday: Previous day (full day)
- This Week: Monday to now
- Last Week: Previous Monday to Sunday
- This Month: 1st to now
- Last Month: Previous month (full)
- This Quarter: Quarter start to now
- This Year: Jan 1 to now
- Last 30 Days: 30 days ago to now
- Last 90 Days: 90 days ago to now
- Custom: User-selected dates
```

### Search Implementation

#### Multi-Field Search
```
Search Query: "smith"

Searches in:
1. Order number
   - "ORD-SMITH-2026-001" ✓
2. Customer name
   - "John Smith" ✓
   - "Smith & Associates" ✓
3. Customer email
   - "jsmith@email.com" ✓
4. Tracking number
   - No match

Returns: All matching orders
```

### Sorting Strategies

#### By Order Date (Default)
- Descending (newest first): Default
- Most recent orders at top
- Real-time order monitoring
- Today's orders prioritized

#### By Order Number
- Alphanumeric sorting
- Sequential order viewing
- Specific order location
- Pattern-based organization

#### By Total Amount
- Highest amount first (desc)
- Identifies large orders
- Revenue-focused view
- VIP order prioritization

#### By Customer Name
- Alphabetical sorting
- Customer-grouped orders
- Quick customer lookup
- Relationship-focused view

### Performance Optimization

#### Stale Time Configuration
```
staleTime: 1 minute

Rationale:
- Orders frequently updated
- Status changes common
- Payment updates regular
- Balance freshness vs load
```

#### Pagination Strategy
```
Page Size Considerations:
- Default: 25 orders per page
- Dashboard: 10 recent orders
- Full list: 50 orders per page
- Export: 1000 orders (with warning)

Performance:
25 orders:  ~150ms response
50 orders:  ~250ms response
100 orders: ~500ms response
```

### Real-Time Updates

#### Auto-Refetch Triggers
- Window focus: Refetch latest data
- New order created: Invalidate cache
- Order status changed: Invalidate specific order
- Payment received: Update payment status
- Item shipped: Update fulfillment status

### Aggregated Totals

#### Summary Statistics
```
Returned with each query:
┌─────────────────────────────┐
│ Total Orders: 247           │
│ Total Amount: $125,450.00   │
│ Avg Order Value: $507.89    │
│ Unpaid Orders: 12           │
│ Unfulfilled Orders: 8       │
└─────────────────────────────┘

Use Cases:
- Dashboard summary cards
- Period comparison
- Performance metrics
- Business insights
```

### Expected Outcome
- Functional useOrders hook
- Comprehensive status filtering
- Date range support
- Real-time order updates
- Aggregated totals included

### Verification Checklist
- [ ] useOrders.ts file created
- [ ] OrderFilters interface defined
- [ ] Hook accepts filters parameter
- [ ] Query key uses orderKeys.list()
- [ ] All status filters implemented
- [ ] Date range filtering works
- [ ] Search functionality works
- [ ] All sort options implemented
- [ ] StaleTime set to 1 minute
- [ ] KeepPreviousData enabled
- [ ] Aggregated totals returned
- [ ] Return type properly typed

---

## Summary

This document covered the creation of 10 TanStack Query hooks for core ERP modules:
- **Product Management**: useProducts, useProduct, useCategories
- **Inventory Management**: useInventory, useWarehouses, useStockMovements
- **Customer Management**: useCustomers, useCustomer
- **Vendor Management**: useVendors
- **Sales Management**: useOrders

These hooks provide a consistent, type-safe interface for data fetching with built-in caching, error handling, and loading states. They integrate with the query key factory and API services established in previous groups.

**Next Steps**: Continue to [Document 02](02_Tasks-71-78_Invoice-HR-Dashboard-Reports.md) to create hooks for Invoices, HR, Dashboard Statistics, and Reports.
