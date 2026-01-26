# Tasks 79-84: Mutations and Cache Strategies

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** F - Mutations, Cache & DevTools  
> **Document:** 01 of 02  
> **Tasks Covered:** 79, 80, 81, 82, 83, 84

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-85-88_Prefetch-Infinite-Docs.md](02_Tasks-85-88_Prefetch-Infinite-Docs.md)

---

## Document Overview

This document covers the creation of mutation hooks for data modification operations in the ERP dashboard. It includes create, update, and delete mutations for products, a generic mutation factory for code reuse, and advanced cache management strategies including optimistic updates and cache invalidation patterns. These mutations provide the foundation for all data modification operations across the frontend application.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 79 | Create useCreateProduct Mutation | Medium | 45 min |
| 80 | Create useUpdateProduct Mutation | Medium | 50 min |
| 81 | Create useDeleteProduct Mutation | Medium | 45 min |
| 82 | Create Generic Mutation Factory | High | 60 min |
| 83 | Implement Optimistic Updates | Medium | 50 min |
| 84 | Implement Cache Invalidation | Medium | 55 min |

---

## Task 79: Create useCreateProduct Mutation

### Overview
Create the useCreateProduct mutation hook for creating new products in the system. This hook wraps TanStack Query's useMutation to provide a consistent interface for product creation with automatic cache invalidation, error handling, and success notifications.

### Dependencies
- Task 78: Hooks Index (from Group E)
- TanStack Query installed and configured
- Product service API methods available
- Toast notification system configured

### Instructions

1. **Create mutations directory structure**
   - Navigate to `frontend/hooks/` directory
   - Create new directory named `mutations`
   - This will house all mutation hooks

2. **Create useProductMutations.ts file**
   - Create file in `hooks/mutations/` directory
   - This will contain all product-related mutations
   - Import necessary dependencies

3. **Import required dependencies**
   - Import `useMutation` from `@tanstack/react-query`
   - Import `useQueryClient` from `@tanstack/react-query`
   - Import product service from API layer
   - Import toast notification utilities
   - Import type definitions for Product

4. **Define CreateProductInput type**
   - Create interface for product creation data
   - Include required fields: name, sku, price
   - Include optional fields: description, category, image
   - Add validation requirements in JSDoc

5. **Create useCreateProduct hook**
   - Export custom hook function
   - Accept optional configuration object
   - Return useMutation instance

6. **Configure mutation function**
   - Set mutationFn to productService.create
   - Pass CreateProductInput as parameter type
   - Return Promise<Product> from service call

7. **Implement onSuccess callback**
   - Invalidate products list queries
   - Use queryClient.invalidateQueries
   - Target all queries with ['products'] key prefix
   - Show success toast notification

8. **Implement onError callback**
   - Extract error message from error object
   - Show error toast notification
   - Log error to console for debugging
   - Include error details in notification

9. **Add retry configuration**
   - Set retry to false for mutations
   - Mutations should not auto-retry
   - User should explicitly retry failed mutations

10. **Export hook from mutations index**
    - Create `mutations/index.ts` file
    - Export useCreateProduct hook
    - Re-export from main hooks index

### Hook Structure

| Component | Purpose |
|-----------|---------|
| mutationFn | Calls productService.create |
| onSuccess | Invalidates cache, shows success toast |
| onError | Shows error toast, logs error |
| retry | Disabled for explicit user control |

### Usage Pattern

The hook provides the following interface:

| Property | Type | Description |
|----------|------|-------------|
| mutate | function | Synchronous mutation trigger |
| mutateAsync | function | Async mutation trigger with Promise |
| data | Product | Created product data |
| error | Error | Error object if mutation fails |
| isLoading | boolean | Mutation in progress |
| isSuccess | boolean | Mutation succeeded |
| isError | boolean | Mutation failed |
| reset | function | Reset mutation state |

### Cache Invalidation Strategy

| Action | Queries Invalidated |
|--------|-------------------|
| Create product | All queries with ['products'] prefix |
| Reason | New product should appear in all lists |
| Impact | Product lists refetch automatically |

### Error Handling

| Error Type | Handling Strategy |
|------------|------------------|
| Network error | Show "Network error" toast |
| Validation error | Show field-specific errors |
| Server error | Show server message |
| Unknown error | Show generic error message |

### Success Feedback

| Event | User Feedback |
|-------|--------------|
| Product created | Success toast with product name |
| Cache updated | Lists refresh automatically |
| Form reset | Handled by calling component |

### Expected Outcome
- Functional useCreateProduct mutation hook
- Automatic cache invalidation on success
- User-friendly error handling
- Toast notifications for feedback

### Verification Checklist
- [ ] `hooks/mutations/useProductMutations.ts` file created
- [ ] useCreateProduct hook exported
- [ ] CreateProductInput type defined
- [ ] mutationFn configured correctly
- [ ] onSuccess invalidates products cache
- [ ] onError shows error notification
- [ ] Success toast appears on creation
- [ ] Product lists refresh after creation
- [ ] Hook exported from mutations index
- [ ] TypeScript types are correct

---

## Task 80: Create useUpdateProduct Mutation

### Overview
Create the useUpdateProduct mutation hook for updating existing products. This hook includes more sophisticated cache management than create, targeting both the specific product detail query and related list queries for invalidation. It forms the foundation for implementing optimistic updates in Task 83.

### Dependencies
- Task 79: Create useCreateProduct Mutation
- Product service update method available
- Query keys properly structured

### Instructions

1. **Open useProductMutations.ts file**
   - Navigate to `hooks/mutations/useProductMutations.ts`
   - Add new hook below useCreateProduct

2. **Define UpdateProductInput type**
   - Create interface extending Partial<Product>
   - Require id field for identification
   - Make all other fields optional
   - Add JSDoc comments for clarity

3. **Define UpdateProductVariables type**
   - Create interface with id and updates properties
   - id: string - product identifier
   - updates: UpdateProductInput - fields to update
   - Used as mutation parameter type

4. **Create useUpdateProduct hook**
   - Export custom hook function
   - Accept optional configuration object
   - Allow configuration to override defaults

5. **Configure mutation function**
   - Set mutationFn to productService.update
   - Accept UpdateProductVariables as parameter
   - Destructure id and updates from variables
   - Call service with both parameters

6. **Implement onSuccess callback**
   - Receive updated product data
   - Invalidate specific product detail query
   - Use queryClient.invalidateQueries with ['products', id]
   - Also invalidate all product list queries
   - Show success toast with product name

7. **Implement onError callback**
   - Extract error message from response
   - Show detailed error toast
   - Log error with context for debugging
   - Include product id in error log

8. **Add retry configuration**
   - Set retry to false
   - User should manually retry updates
   - Prevents unexpected state changes

9. **Export hook**
   - Add to mutations/index.ts exports
   - Update main hooks index
   - Ensure TypeScript exports are correct

### Hook Structure

| Component | Purpose |
|-----------|---------|
| mutationFn | Calls productService.update |
| onSuccess | Invalidates detail + lists, shows toast |
| onError | Shows error, logs with context |
| Variables | { id, updates } structure |

### Mutation Variables

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Product identifier |
| updates | Partial<Product> | Yes | Fields to update |

### Cache Invalidation Strategy

| Query Type | Invalidation Key | Reason |
|------------|-----------------|--------|
| Product detail | ['products', id] | Updated data needs refresh |
| Product lists | ['products'] | Product may appear in lists |
| Search results | ['products', 'search'] | Search cache may be stale |

### Multi-Level Invalidation

```
Update Product
    │
    ├── Invalidate Detail
    │   └── ['products', productId]
    │
    └── Invalidate Lists
        ├── ['products']
        ├── ['products', 'search']
        └── ['products', 'category', categoryId]
```

### Optimistic Update Preparation

This hook's structure prepares for optimistic updates:

| Element | Optimistic Use |
|---------|---------------|
| onMutate | Will add for optimistic update |
| Variables | Contains both id and updates |
| onError | Will receive context for rollback |
| onSettled | Will ensure final sync |

### Error Handling

| Error Scenario | User Feedback |
|----------------|--------------|
| Product not found | "Product no longer exists" |
| Validation error | Field-specific error messages |
| Concurrent update | "Product was modified by another user" |
| Permission denied | "You don't have permission to update" |

### Success Feedback

| Event | Action |
|-------|--------|
| Update successful | Toast: "Product {name} updated" |
| Detail view | Automatically refreshes |
| List views | Show updated data |
| Form | Returns to previous state or closes |

### Expected Outcome
- Functional useUpdateProduct mutation hook
- Targeted cache invalidation for efficiency
- Structured for future optimistic updates
- Comprehensive error handling

### Verification Checklist
- [ ] useUpdateProduct hook created
- [ ] UpdateProductInput type defined
- [ ] UpdateProductVariables type defined
- [ ] mutationFn accepts id and updates
- [ ] Product detail query invalidated
- [ ] Product list queries invalidated
- [ ] Success toast shows product name
- [ ] Error handling includes context
- [ ] Hook exported correctly
- [ ] TypeScript types validated

---

## Task 81: Create useDeleteProduct Mutation

### Overview
Create the useDeleteProduct mutation hook for removing products from the system. This hook includes comprehensive cache invalidation to remove the deleted product from all relevant queries and implements confirmation patterns for destructive actions. It serves as the foundation for advanced cache invalidation strategies in Task 84.

### Dependencies
- Task 79: Create useCreateProduct Mutation
- Product service delete method available
- Confirmation dialog system available

### Instructions

1. **Open useProductMutations.ts file**
   - Navigate to `hooks/mutations/useProductMutations.ts`
   - Add new hook after useUpdateProduct

2. **Define DeleteProductInput type**
   - Create simple interface with id field
   - id: string - product identifier to delete
   - Optional reason field for audit log

3. **Create useDeleteProduct hook**
   - Export custom hook function
   - Accept optional configuration object
   - Include confirmation callback option

4. **Configure mutation function**
   - Set mutationFn to productService.delete
   - Accept product id as string parameter
   - Return Promise<void> or success message

5. **Implement onMutate callback**
   - Cancel any outgoing product queries
   - Use queryClient.cancelQueries
   - Prevent race conditions during deletion
   - Return context for potential rollback

6. **Implement onSuccess callback**
   - Invalidate all product-related queries
   - Use aggressive invalidation strategy
   - Remove product from query cache completely
   - Show success toast notification

7. **Implement cache removal**
   - Use queryClient.removeQueries for deleted product
   - Target specific product detail: ['products', id]
   - Ensures deleted product doesn't appear in cache
   - More aggressive than invalidation

8. **Implement onError callback**
   - Show error toast with details
   - Log error with product id
   - Optionally refetch queries to restore state
   - Handle common delete errors

9. **Add confirmation handling**
   - Accept optional confirm callback in config
   - If provided, call before mutation
   - Wait for confirmation before proceeding
   - Cancel if user declines

10. **Export hook**
    - Add to mutations/index.ts exports
    - Update main hooks index
    - Document confirmation pattern

### Hook Structure

| Component | Purpose |
|-----------|---------|
| mutationFn | Calls productService.delete |
| onMutate | Cancels queries to prevent race conditions |
| onSuccess | Removes from cache, invalidates lists |
| onError | Shows error, restores state |
| confirm | Optional confirmation callback |

### Mutation Flow

```
User Triggers Delete
    │
    ▼
Confirmation Dialog (optional)
    │
    ├── Cancel ──→ Stop
    │
    ▼ Confirm
onMutate
    │
    ├── Cancel outgoing queries
    └── Save context
    │
    ▼
Delete API Call
    │
    ├── Success ──→ onSuccess
    │   ├── Remove from cache
    │   ├── Invalidate lists
    │   └── Show toast
    │
    └── Error ──→ onError
        ├── Show error
        └── Optionally refetch
```

### Cache Management Strategy

| Action | Cache Operation | Query Key |
|--------|----------------|-----------|
| Remove detail | queryClient.removeQueries | ['products', id] |
| Invalidate lists | queryClient.invalidateQueries | ['products'] |
| Invalidate search | queryClient.invalidateQueries | ['products', 'search'] |
| Invalidate category | queryClient.invalidateQueries | ['products', 'category'] |

### Aggressive Cache Invalidation

| Operation | Purpose |
|-----------|---------|
| removeQueries | Completely removes product from cache |
| invalidateQueries | Forces refetch of all product lists |
| cancelQueries | Prevents race conditions |

### Why removeQueries vs invalidateQueries?

| Scenario | Use removeQueries | Use invalidateQueries |
|----------|------------------|---------------------|
| Deleted item | Yes | No |
| Updated item | No | Yes |
| Created item | No | Yes |
| Reason | Item no longer exists | Item needs refresh |

### Confirmation Pattern

| Confirmation Type | Implementation |
|------------------|----------------|
| Dialog | Pass confirm callback in config |
| Inline | Use confirmDelete prop |
| None | Omit confirmation callback |

### Error Handling

| Error Type | Handling |
|------------|----------|
| Product in use | "Cannot delete: product is in active orders" |
| Not found | "Product already deleted" |
| Permission denied | "You don't have permission to delete" |
| Network error | "Failed to delete: network error" |

### Cascade Considerations

| Related Data | Action |
|--------------|--------|
| Order items | Prevent delete if in orders |
| Inventory | Cascade delete inventory records |
| Images | Cascade delete product images |
| Audit log | Keep for historical records |

### Success Feedback

| Event | User Feedback |
|-------|--------------|
| Delete successful | Toast: "Product deleted successfully" |
| List view | Product removed immediately |
| Detail view | Navigate away or show 404 |
| Related views | Update to reflect deletion |

### Expected Outcome
- Functional useDeleteProduct mutation hook
- Comprehensive cache cleanup on deletion
- Optional confirmation support
- Proper race condition prevention

### Verification Checklist
- [ ] useDeleteProduct hook created
- [ ] DeleteProductInput type defined
- [ ] mutationFn configured for delete
- [ ] onMutate cancels outgoing queries
- [ ] onSuccess removes product from cache
- [ ] All product lists invalidated
- [ ] Confirmation callback supported
- [ ] Error handling for common cases
- [ ] Race conditions prevented
- [ ] Hook exported correctly

---

## Task 82: Create Generic Mutation Factory

### Overview
Create a reusable mutation factory function that generates mutation hooks with common patterns. This factory reduces code duplication across create, update, and delete mutations for different resources (products, customers, orders, etc.). It encapsulates best practices for cache invalidation, error handling, and optimistic updates in a single, configurable function.

### Dependencies
- Task 79: Create useCreateProduct Mutation
- Task 80: Create useUpdateProduct Mutation
- Task 81: Create useDeleteProduct Mutation
- Understanding of mutation patterns from previous tasks

### Instructions

1. **Create mutation factory file**
   - Create `hooks/mutations/mutationFactory.ts`
   - This will contain generic factory functions
   - Import all necessary TanStack Query types

2. **Define MutationConfig interface**
   - Create generic interface for configuration
   - Include resource name for cache keys
   - Include API service methods
   - Include invalidation strategies
   - Add optional callbacks

3. **Define InvalidationStrategy enum**
   - Create enum for different strategies
   - EXACT: Invalidate specific item
   - PARTIAL: Invalidate lists only
   - ALL: Invalidate everything for resource
   - RELATED: Invalidate cross-resource queries

4. **Create createMutationHook factory function**
   - Accept MutationConfig as parameter
   - Return custom hook function
   - Use TypeScript generics for type safety
   - Support all CRUD operations

5. **Implement mutation operation types**
   - Define CREATE operation handler
   - Define UPDATE operation handler
   - Define DELETE operation handler
   - Each with appropriate invalidation

6. **Build cache key generator**
   - Create function to generate query keys
   - Accept resource name and identifiers
   - Return consistent key arrays
   - Support nested resources

7. **Implement invalidation handler**
   - Accept InvalidationStrategy enum value
   - Execute appropriate invalidation
   - Support multiple related resources
   - Log invalidation for debugging

8. **Add optimistic update support**
   - Create optimistic update helper
   - Accept updater function
   - Store previous data in context
   - Support rollback on error

9. **Create toast notification helper**
   - Generate success messages
   - Generate error messages
   - Use resource name in messages
   - Support custom message templates

10. **Export factory and types**
    - Export createMutationHook factory
    - Export MutationConfig interface
    - Export InvalidationStrategy enum
    - Export helper types

11. **Create example usage documentation**
    - Document factory usage in JSDoc
    - Provide examples for each operation
    - Show custom configuration options
    - Include TypeScript examples

12. **Refactor existing hooks (optional)**
    - Optionally refactor useProductMutations
    - Use factory for consistency
    - Demonstrate factory benefits
    - Maintain backward compatibility

### Factory Structure

| Component | Purpose |
|-----------|---------|
| MutationConfig | Configuration interface |
| InvalidationStrategy | Cache invalidation strategies |
| createMutationHook | Main factory function |
| generateCacheKey | Consistent key generation |
| invalidateCache | Invalidation handler |
| optimisticUpdate | Optimistic update helper |

### MutationConfig Interface

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| resource | string | Yes | Resource name (e.g., 'products') |
| service | object | Yes | API service with CRUD methods |
| invalidationStrategy | enum | No | Default invalidation strategy |
| relatedResources | string[] | No | Related resources to invalidate |
| optimistic | boolean | No | Enable optimistic updates |
| toastMessages | object | No | Custom toast messages |

### InvalidationStrategy Enum

| Strategy | When to Use | Queries Invalidated |
|----------|-------------|-------------------|
| EXACT | Single item changed | [resource, id] |
| PARTIAL | List needs update | [resource] (lists only) |
| ALL | Major change | All [resource] queries |
| RELATED | Cross-resource impact | [resource] + related |

### Factory Usage Example Structure

```
createMutationHook configuration:
├── resource: 'products'
├── service: productService
├── invalidationStrategy: InvalidationStrategy.ALL
├── relatedResources: ['inventory', 'orders']
├── optimistic: true
└── toastMessages: { success, error }

Returns:
├── useCreateProduct
├── useUpdateProduct
└── useDeleteProduct
```

### Operation Handlers

| Operation | Input | Output | Invalidation |
|-----------|-------|--------|-------------|
| CREATE | New item data | Created item | Lists |
| UPDATE | Item id + updates | Updated item | Detail + Lists |
| DELETE | Item id | void | All |

### Cache Key Generation

| Input | Generated Key | Usage |
|-------|--------------|--------|
| 'products' | ['products'] | List queries |
| 'products', '123' | ['products', '123'] | Detail query |
| 'products', 'search', term | ['products', 'search', term] | Search query |

### Optimistic Update Helper

| Step | Action |
|------|--------|
| 1 | Cancel outgoing queries |
| 2 | Get current cache data |
| 3 | Apply optimistic update |
| 4 | Return previous data |
| 5 | Rollback on error |

### Generic Type Parameters

| Parameter | Purpose | Example |
|-----------|---------|---------|
| TData | Resource type | Product |
| TCreate | Create input | CreateProductInput |
| TUpdate | Update input | UpdateProductInput |
| TDelete | Delete input | string (id) |

### Factory Benefits

| Benefit | Description |
|---------|-------------|
| Code reuse | Single implementation for all resources |
| Consistency | Same patterns across all mutations |
| Maintainability | Update once, fix everywhere |
| Type safety | Full TypeScript support |
| Best practices | Encapsulates optimal patterns |

### Cross-Resource Invalidation

| Primary Action | Related Invalidations |
|---------------|---------------------|
| Create product | Products, inventory |
| Update product | Products, orders, inventory |
| Delete product | Products, orders, inventory, analytics |
| Create order | Orders, products (stock), customers |

### Extensibility

The factory supports extension through:

| Extension Point | Purpose |
|----------------|---------|
| Custom callbacks | Override default behavior |
| Custom invalidation | Resource-specific logic |
| Custom toasts | Branded messaging |
| Middleware | Add logging, analytics |

### Expected Outcome
- Reusable mutation factory function
- Reduced code duplication
- Consistent mutation patterns
- Flexible configuration options
- Full TypeScript support

### Verification Checklist
- [ ] mutationFactory.ts file created
- [ ] MutationConfig interface defined
- [ ] InvalidationStrategy enum created
- [ ] createMutationHook factory implemented
- [ ] Cache key generator created
- [ ] Invalidation handler implemented
- [ ] Optimistic update support added
- [ ] Toast notification helper created
- [ ] TypeScript generics configured
- [ ] JSDoc documentation complete
- [ ] Example usage documented
- [ ] Factory exported correctly

---

## Task 83: Implement Optimistic Updates

### Overview
Implement optimistic update patterns for mutations to provide instant UI feedback before server confirmation. This enhances perceived performance by immediately updating the UI with expected results, then syncing with the server response. If the mutation fails, the UI rolls back to the previous state.

### Dependencies
- Task 80: Create useUpdateProduct Mutation
- Task 82: Create Generic Mutation Factory
- Understanding of TanStack Query context

### Instructions

1. **Open useProductMutations.ts file**
   - Navigate to `hooks/mutations/useProductMutations.ts`
   - Modify useUpdateProduct hook

2. **Add onMutate callback to useUpdateProduct**
   - Create async onMutate function
   - This runs before mutation is triggered
   - Contains optimistic update logic

3. **Cancel outgoing queries in onMutate**
   - Use await queryClient.cancelQueries
   - Target product queries: ['products']
   - Prevents race conditions
   - Ensures optimistic update isn't overwritten

4. **Snapshot previous data**
   - Use queryClient.getQueryData
   - Get current product detail data
   - Get current products list data
   - Store for potential rollback

5. **Apply optimistic update to detail query**
   - Use queryClient.setQueryData
   - Target product detail: ['products', id]
   - Merge existing data with updates
   - Return optimistically updated product

6. **Apply optimistic update to list queries**
   - Use queryClient.setQueriesData
   - Target all product list queries
   - Find and update product in each list
   - Maintain list structure and order

7. **Return context from onMutate**
   - Return object with previous data
   - Structure: { previousProduct, previousLists }
   - This context is passed to onError
   - Used for rollback if mutation fails

8. **Modify onError to handle rollback**
   - Accept context parameter
   - Check if context exists
   - Restore previous product detail
   - Restore previous lists
   - Show error toast

9. **Add onSettled callback**
   - Runs after success or error
   - Always invalidate affected queries
   - Ensures eventual consistency
   - Syncs with server state

10. **Create optimistic update helper function**
    - Extract logic to reusable function
    - Accept resource, id, and updates
    - Return context object
    - Use in multiple mutation hooks

11. **Add optimistic updates to other mutations**
    - Apply pattern to useUpdateCustomer
    - Apply to useUpdateOrder
    - Apply to any frequently updated resources
    - Maintain consistency across hooks

12. **Add visual feedback for optimistic state**
    - Return isPending flag from hook
    - Component can show loading state
    - Different from isLoading (pre-mutation)
    - Indicates optimistic update active

### Optimistic Update Flow

```
User Triggers Update
    │
    ▼
onMutate
    │
    ├── Cancel outgoing queries
    ├── Snapshot current data
    ├── Update cache optimistically
    └── Return context { previous }
    │
    ▼
UI Updates Immediately
    │
    ▼
API Call
    │
    ├── Success ──→ onSuccess
    │   └── Invalidate (already correct)
    │
    └── Error ──→ onError
        ├── Restore from context
        └── Show error
    │
    ▼
onSettled
    └── Invalidate to ensure sync
```

### Optimistic Update Pattern

| Step | Function | Purpose |
|------|----------|---------|
| 1 | onMutate | Prepare optimistic update |
| 2 | cancelQueries | Prevent race conditions |
| 3 | getQueryData | Snapshot for rollback |
| 4 | setQueryData | Apply optimistic update |
| 5 | return context | Pass to error handler |
| 6 | onError | Rollback if fails |
| 7 | onSettled | Sync with server |

### Context Object Structure

| Field | Type | Purpose |
|-------|------|---------|
| previousProduct | Product | Detail query snapshot |
| previousLists | Map | List queries snapshots |
| timestamp | number | When optimistic update occurred |

### Detail Query Optimistic Update

| Step | Action |
|------|--------|
| 1 | Get current product data |
| 2 | Merge with updates |
| 3 | Set updated data in cache |
| 4 | UI reflects change instantly |

### List Query Optimistic Update

| Step | Action |
|------|--------|
| 1 | Get all list queries |
| 2 | Find product in each list |
| 3 | Update product in place |
| 4 | Preserve list order |
| 5 | Update all lists simultaneously |

### Rollback Strategy

| Scenario | Action |
|----------|--------|
| Network error | Restore previous data |
| Validation error | Restore previous data |
| Server error | Restore previous data |
| Success | Keep optimistic data |

### Optimistic Update Helper

| Parameter | Type | Description |
|-----------|------|-------------|
| resource | string | Resource name |
| id | string | Item identifier |
| updates | Partial<T> | Fields to update |
| Returns | Context | Rollback context |

### Benefits of Optimistic Updates

| Benefit | Impact |
|---------|--------|
| Instant feedback | User sees result immediately |
| Better UX | Feels faster and more responsive |
| Perceived performance | App feels snappy |
| Reduced waiting | No spinner for common actions |

### When to Use Optimistic Updates

| Scenario | Use Optimistic? | Reason |
|----------|----------------|--------|
| Update name | Yes | Low risk, instant feedback |
| Update price | Maybe | Medium risk, important field |
| Delete item | No | High risk, irreversible |
| Create item | No | Server generates id |
| Toggle flag | Yes | Perfect for optimistic |

### Race Condition Prevention

| Risk | Prevention |
|------|-----------|
| Query refetch overwrites | cancelQueries before update |
| Multiple updates | Serialize with mutateAsync |
| Stale data | onSettled ensures sync |

### Visual Feedback Patterns

| State | UI Indicator |
|-------|-------------|
| Pending mutation | Dim/opacity on item |
| Optimistic update | Subtle highlight |
| Success | Flash green |
| Rollback | Flash red, restore |

### Error Handling with Optimistic Updates

| Error Type | User Experience |
|------------|----------------|
| Network error | See optimistic update, then rollback + toast |
| Validation error | Rollback + specific error message |
| Conflict | Rollback + show server version |

### Testing Optimistic Updates

| Test Case | Expected Behavior |
|-----------|------------------|
| Successful update | Instant UI change, no flash |
| Failed update | Brief optimistic, then rollback |
| Race condition | No stale data shown |
| Multiple updates | Each update applies correctly |

### Expected Outcome
- Optimistic updates implemented for update mutations
- Instant UI feedback for user actions
- Proper rollback on errors
- Race condition prevention
- Improved perceived performance

### Verification Checklist
- [ ] onMutate callback added to useUpdateProduct
- [ ] Outgoing queries cancelled
- [ ] Previous data snapshotted
- [ ] Detail query updated optimistically
- [ ] List queries updated optimistically
- [ ] Context returned from onMutate
- [ ] onError rolls back on failure
- [ ] onSettled ensures sync
- [ ] Optimistic update helper created
- [ ] Visual feedback implemented
- [ ] Race conditions prevented
- [ ] Pattern tested with various scenarios

---

## Task 84: Implement Cache Invalidation

### Overview
Implement comprehensive cache invalidation strategies to keep application data synchronized with the server. This includes exact invalidation for specific items, partial invalidation for lists, full invalidation for major changes, and cross-resource invalidation for related data. Proper cache invalidation ensures users always see up-to-date information.

### Dependencies
- Task 81: Create useDeleteProduct Mutation
- Task 82: Create Generic Mutation Factory
- Understanding of query key structure

### Instructions

1. **Create cache invalidation utility file**
   - Create `hooks/mutations/cacheInvalidation.ts`
   - This will contain invalidation helpers
   - Import queryClient type

2. **Define InvalidationStrategy enum**
   - EXACT: Single item only
   - PARTIAL: Lists and searches
   - ALL: Everything for resource
   - RELATED: Cross-resource invalidation
   - SELECTIVE: Custom query matching

3. **Create InvalidationConfig interface**
   - Define configuration options
   - Resource name and identifiers
   - Strategy to use
   - Related resources array
   - Custom query matchers

4. **Create invalidateCache helper function**
   - Accept queryClient instance
   - Accept InvalidationConfig
   - Execute strategy-based invalidation
   - Return invalidation statistics

5. **Implement exact invalidation**
   - Target specific item query
   - Use exact query key match
   - Example: ['products', '123']
   - Only refetches single item

6. **Implement partial invalidation**
   - Target list and search queries
   - Use partial key matching
   - Example: ['products'] matches all product queries
   - Excludes detail queries with specific IDs

7. **Implement full invalidation**
   - Target all queries for resource
   - Use predicate function
   - Matches any query starting with resource name
   - Most aggressive strategy

8. **Implement related resource invalidation**
   - Accept array of related resources
   - Invalidate each related resource
   - Use appropriate strategy for each
   - Example: Update product → invalidate inventory

9. **Create invalidation matrix**
   - Define which mutations invalidate which queries
   - Create lookup table
   - Document in constants file
   - Use for consistent invalidation

10. **Add logging for invalidation**
    - Log which queries are invalidated
    - Include strategy used
    - Add development mode only logging
    - Help debug cache issues

11. **Create selective invalidation helper**
    - Accept custom predicate function
    - Iterate through query cache
    - Apply predicate to each query
    - Invalidate matching queries

12. **Implement cache removal for deletes**
    - Create removeFromCache helper
    - Use queryClient.removeQueries
    - More aggressive than invalidation
    - Use for deleted items

13. **Add invalidation to all mutations**
    - Update useCreateProduct
    - Update useUpdateProduct
    - Update useDeleteProduct
    - Apply appropriate strategies

14. **Create invalidation testing helper**
    - Function to inspect query cache
    - List all queries for resource
    - Show invalidation state
    - Use in development/testing

### Invalidation Strategies Comparison

| Strategy | Scope | Performance | Use Case |
|----------|-------|-------------|----------|
| EXACT | Single item | High | Detail view updated |
| PARTIAL | Lists only | Medium | New item created |
| ALL | Everything | Low | Major data change |
| RELATED | Cross-resource | Variable | Dependent data |
| SELECTIVE | Custom match | Variable | Complex scenarios |

### Invalidation Flow

```
Mutation Success
    │
    ▼
Determine Strategy
    │
    ├── EXACT
    │   └── Invalidate ['resource', id]
    │
    ├── PARTIAL
    │   └── Invalidate ['resource'] (lists)
    │
    ├── ALL
    │   └── Invalidate all ['resource', ...]
    │
    └── RELATED
        └── Invalidate each related resource
```

### Query Key Structure

| Query Type | Key Pattern | Invalidation |
|------------|-------------|--------------|
| List all | ['products'] | PARTIAL or ALL |
| List filtered | ['products', { filter }] | PARTIAL or ALL |
| Search | ['products', 'search', term] | PARTIAL or ALL |
| Detail | ['products', id] | EXACT |
| Related | ['inventory', 'product', id] | RELATED |

### Invalidation Matrix

| Mutation | Primary Resource | Related Resources |
|----------|-----------------|-------------------|
| Create product | products (PARTIAL) | inventory (ALL) |
| Update product | products (EXACT + PARTIAL) | orders (SELECTIVE), inventory (EXACT) |
| Delete product | products (ALL + REMOVE) | orders (SELECTIVE), inventory (ALL) |
| Create order | orders (PARTIAL) | products (SELECTIVE), customers (EXACT) |

### Resource Dependencies

```
Products
    ├── Inventory (direct)
    ├── Orders (indirect)
    └── Analytics (indirect)

Orders
    ├── Products (direct)
    ├── Customers (direct)
    └── Inventory (indirect)

Customers
    ├── Orders (direct)
    └── Analytics (indirect)
```

### Cache Invalidation vs Removal

| Operation | When to Use | Effect |
|-----------|-------------|--------|
| invalidateQueries | Item still exists | Marks stale, triggers refetch |
| removeQueries | Item deleted | Removes from cache completely |
| refetchQueries | Force immediate | Fetches now, not on next use |

### Predicate Function Pattern

| Use Case | Predicate |
|----------|-----------|
| All product queries | queryKey[0] === 'products' |
| Specific product lists | queryKey[0] === 'products' && !queryKey[1] |
| Product in category | queryKey[0] === 'products' && queryKey[1] === categoryId |

### Logging Invalidation

| Log Level | When | Information |
|-----------|------|-------------|
| Debug | Every invalidation | Resource, strategy, query keys |
| Info | RELATED invalidation | Cross-resource dependencies |
| Warn | No queries matched | Possible cache key mismatch |

### Invalidation Configuration Examples

**Create Product:**
| Field | Value |
|-------|-------|
| resource | 'products' |
| strategy | PARTIAL |
| relatedResources | ['inventory'] |

**Update Product:**
| Field | Value |
|-------|-------|
| resource | 'products' |
| strategy | EXACT + PARTIAL |
| id | productId |
| relatedResources | ['orders', 'inventory'] |

**Delete Product:**
| Field | Value |
|-------|-------|
| resource | 'products' |
| strategy | ALL |
| operation | REMOVE |
| relatedResources | ['orders', 'inventory', 'analytics'] |

### Performance Considerations

| Strategy | Queries Refetched | Network Impact |
|----------|------------------|----------------|
| EXACT | 1 | Minimal |
| PARTIAL | 2-5 typical | Low |
| ALL | 10+ possible | High |
| RELATED | Varies | Medium-High |

### Optimization Strategies

| Optimization | Impact |
|-------------|--------|
| Use EXACT when possible | Reduces unnecessary refetches |
| Batch invalidations | Single pass through cache |
| Stale time configuration | Reduces refetch frequency |
| Background refetching | Non-blocking updates |

### Testing Invalidation

| Test Scenario | Expected Result |
|---------------|----------------|
| Create product | Lists refetch, new item appears |
| Update product | Detail and lists refetch |
| Delete product | Item removed, lists refetch |
| Concurrent mutations | All invalidations apply |

### Common Invalidation Pitfalls

| Pitfall | Solution |
|---------|----------|
| Over-invalidation | Use more specific strategies |
| Under-invalidation | Include related resources |
| Wrong query keys | Match exact key structure |
| Race conditions | Use cancelQueries first |

### Expected Outcome
- Comprehensive cache invalidation system
- Multiple invalidation strategies
- Cross-resource invalidation support
- Proper cache cleanup for deletions
- Development tools for debugging

### Verification Checklist
- [ ] cacheInvalidation.ts file created
- [ ] InvalidationStrategy enum defined
- [ ] InvalidationConfig interface created
- [ ] invalidateCache helper implemented
- [ ] Exact invalidation working
- [ ] Partial invalidation working
- [ ] Full invalidation working
- [ ] Related resource invalidation working
- [ ] Invalidation matrix documented
- [ ] Logging implemented
- [ ] Cache removal for deletes
- [ ] All mutations use proper strategies
- [ ] Testing helper created
- [ ] Performance optimized

---

## Summary

This document covered the creation of mutation hooks and cache management strategies:

- **Task 79:** Created useCreateProduct mutation with cache invalidation
- **Task 80:** Created useUpdateProduct mutation with targeted invalidation
- **Task 81:** Created useDeleteProduct mutation with cache removal
- **Task 82:** Created generic mutation factory for code reuse
- **Task 83:** Implemented optimistic updates for instant UI feedback
- **Task 84:** Implemented comprehensive cache invalidation strategies

These mutations provide the foundation for all data modification operations in the ERP dashboard, with sophisticated cache management for optimal performance and user experience.

**Next Steps:** Proceed to [02_Tasks-85-88_Prefetch-Infinite-Docs.md](02_Tasks-85-88_Prefetch-Infinite-Docs.md) to implement prefetch hooks, infinite queries, and complete state management documentation.

---

**Document Status:** Complete  
**Last Updated:** 2026-01-25  
**Next Review:** After Task 88 completion
