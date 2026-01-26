# Tasks 62-70: Edit Page and Delete Actions

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 08 - Product Management UI  
> **Group:** D - Product Editing & Details  
> **Document:** 02 of 02  
> **Tasks Covered:** 62, 63, 64, 65, 66, 67, 68, 69, 70

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-55-61_Detail-Page.md](01_Tasks-55-61_Detail-Page.md)

---

## Document Overview

This document covers the creation of the product edit page, data fetching and form population, update handlers with optimistic updates, and action implementations including delete, archive/restore, and duplicate functionality. These features enable complete product lifecycle management with a smooth user experience.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 62 | Create Edit Product Page | Medium | 45 min |
| 63 | Fetch Product Data for Edit | Low | 20 min |
| 64 | Populate Form with Existing Data | Low | 30 min |
| 65 | Create Update Handler | Medium | 35 min |
| 66 | Handle Optimistic Updates | Medium | 40 min |
| 67 | Create Delete Product Dialog | Low | 25 min |
| 68 | Implement Product Deletion | Medium | 30 min |
| 69 | Create Archive/Restore Actions | Low | 25 min |
| 70 | Create Duplicate Product Action | Medium | 40 min |

---

## Task 62: Create Edit Product Page

### Overview
Create the edit product page at `/products/[id]/edit` route. This page reuses the ProductForm component from the creation flow but in edit mode, displaying existing product data and handling updates instead of creation.

### Dependencies
- Task 54: Create Product Form Component
- Task 55: Create Product Detail Page
- SubPhase-03: Frontend routing established

### Instructions

1. **Create edit directory structure**
   - Navigate to `frontend/app/(dashboard)/products/[id]/` directory
   - Create new directory named `edit`
   - This creates the dynamic route for editing products

2. **Create edit page file**
   - Create `page.tsx` in the `edit` directory
   - Set up async page component for data fetching
   - Configure proper TypeScript types for params

3. **Define page params interface**
   - Create interface for route parameters
   - Include `id` parameter (string)
   - Type the params prop correctly for Next.js 14

4. **Implement page metadata**
   - Export dynamic `generateMetadata` function
   - Fetch product name for page title
   - Set title to "Edit {Product Name} | Products"

5. **Create page component structure**
   - Define async default export function
   - Accept params prop with product ID
   - Return main page structure with ProductForm

6. **Add page header section**
   - Display breadcrumb navigation (Products → Detail → Edit)
   - Show page title "Edit Product"
   - Add back button to product detail page

7. **Integrate ProductForm component**
   - Import ProductForm from Group-C components
   - Pass product ID as prop for edit mode
   - Configure form to handle updates instead of creation

8. **Add loading state**
   - Import and use Suspense for loading UI
   - Create skeleton loader for form
   - Ensure smooth transition when data loads

### Page Structure

```
┌─────────────────────────────────────────┐
│  ← Back | Breadcrumb: Products > Edit   │
├─────────────────────────────────────────┤
│                                         │
│  Edit Product                           │
│                                         │
│  ┌───────────────────────────────────┐ │
│  │                                   │ │
│  │      ProductForm Component        │ │
│  │      (Pre-filled with data)       │ │
│  │                                   │ │
│  │  - Basic Information             │ │
│  │  - Pricing & Inventory           │ │
│  │  - Categories & Tags             │ │
│  │  - Images                         │ │
│  │  - Description                    │ │
│  │                                   │ │
│  │  [Cancel]  [Update Product]      │ │
│  │                                   │ │
│  └───────────────────────────────────┘ │
│                                         │
└─────────────────────────────────────────┘
```

### Route Parameters

| Param | Type | Description | Example |
|-------|------|-------------|---------|
| id | string | Product ID from URL | "prod_abc123" |

### Page URL Structure

| Pattern | Example | Purpose |
|---------|---------|---------|
| `/products/[id]/edit` | `/products/prod_123/edit` | Edit specific product |

### Metadata Configuration

| Field | Value | Purpose |
|-------|-------|---------|
| title | "Edit {Product Name}" | Browser tab title |
| description | "Edit product details" | SEO description |

### Breadcrumb Navigation

```
Products → Product Detail → Edit Product
   ↓            ↓                ↓
/products  /products/[id]  /products/[id]/edit
```

### Expected Outcome
- Functional edit page at correct route
- ProductForm component integrated in edit mode
- Page header with navigation
- Proper loading states
- Correct metadata for SEO

### Verification Checklist
- [ ] `frontend/app/(dashboard)/products/[id]/edit/page.tsx` created
- [ ] Page component accepts params prop
- [ ] Metadata generated dynamically
- [ ] Breadcrumb navigation displayed
- [ ] Back button functional
- [ ] ProductForm component rendered
- [ ] Loading state with Suspense implemented
- [ ] Page accessible at `/products/[id]/edit`

---

## Task 63: Fetch Product Data for Edit

### Overview
Implement data fetching logic to retrieve product details for the edit form. Use the `useProduct` hook from API utilities to fetch product data by ID, handle loading states, and manage errors appropriately.

### Dependencies
- Task 62: Create Edit Product Page
- Group-A: API hooks and services implemented

### Instructions

1. **Import useProduct hook**
   - Import from `@/hooks/api/useProducts` or equivalent
   - Ensure hook supports fetching single product by ID
   - Review hook return types for data, loading, error

2. **Extract product ID from route**
   - Access product ID from page params
   - Validate ID format before fetching
   - Handle invalid ID cases gracefully

3. **Implement data fetching in component**
   - Call useProduct hook with product ID
   - Pass ID as parameter to hook
   - Hook should trigger fetch on mount

4. **Handle loading state**
   - Display skeleton loader while fetching
   - Show spinner or placeholder in form area
   - Prevent form interaction during loading

5. **Handle error state**
   - Check for error from useProduct hook
   - Display error message if fetch fails
   - Provide retry button or redirect option

6. **Handle product not found**
   - Detect 404 response from API
   - Display "Product not found" message
   - Provide link to return to product list

7. **Pass data to form component**
   - Wait for data to be available
   - Pass product data to ProductForm
   - Ensure data structure matches form expectations

8. **Implement automatic refetching**
   - Configure stale time in TanStack Query
   - Enable refetch on window focus
   - Ensure data stays fresh during editing

### Data Fetching Flow

```
Page Mounts
    ↓
Extract Product ID
    ↓
Call useProduct(id)
    ↓
┌───────────┬──────────────┬────────────┐
│ Loading   │ Error        │ Success    │
├───────────┼──────────────┼────────────┤
│ Show      │ Show Error   │ Pass Data  │
│ Skeleton  │ Message      │ to Form    │
└───────────┴──────────────┴────────────┘
```

### Hook Return Values

| Property | Type | Description |
|----------|------|-------------|
| data | Product \| undefined | Product data object |
| isLoading | boolean | True while fetching |
| isError | boolean | True if fetch failed |
| error | Error \| null | Error object if failed |
| refetch | function | Manual refetch trigger |

### Error Handling Strategy

| Error Type | User Message | Action |
|------------|--------------|--------|
| Network Error | "Unable to load product" | Retry button |
| 404 Not Found | "Product not found" | Return to list |
| 403 Forbidden | "Access denied" | Return to list |
| 500 Server Error | "Server error occurred" | Retry button |

### Loading State Display

```
┌─────────────────────────────────────┐
│  Edit Product                       │
├─────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │   │ ← Skeleton
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │   │
│  │ ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓     │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
```

### Data Validation

| Check | Purpose |
|-------|---------|
| ID format | Ensure valid product ID |
| Data completeness | Verify all required fields present |
| Type validation | Confirm data types match expected |

### Expected Outcome
- Product data fetched successfully by ID
- Loading states displayed during fetch
- Errors handled gracefully with messages
- Data ready for form population

### Verification Checklist
- [ ] useProduct hook imported and called
- [ ] Product ID extracted from params
- [ ] Loading state displays skeleton
- [ ] Error state shows error message
- [ ] 404 handled with appropriate message
- [ ] Product data available in component
- [ ] Refetch functionality works
- [ ] Data structure validated before use

---

## Task 64: Populate Form with Existing Data

### Overview
Populate the ProductForm component with existing product data fetched from the API. Transform API response data into form default values, handle nested objects, format dates and numbers correctly, and ensure all form fields display current product information.

### Dependencies
- Task 63: Fetch Product Data for Edit

### Instructions

1. **Transform product data to form format**
   - Map API response fields to form field names
   - Handle field name differences (snake_case to camelCase)
   - Ensure all required fields have values

2. **Set form default values**
   - Pass product data to ProductForm as `defaultValues` prop
   - Use React Hook Form's reset method if needed
   - Trigger form initialization with data

3. **Handle basic information fields**
   - Populate name, SKU, description fields
   - Set status (active, draft, archived)
   - Handle empty or null values with fallbacks

4. **Handle pricing fields**
   - Format cost_price for display (convert cents to currency)
   - Format selling_price for display
   - Calculate and display profit margin
   - Set tax category if available

5. **Handle inventory fields**
   - Set track_inventory boolean
   - Populate stock levels per warehouse
   - Handle low_stock_threshold value
   - Display current stock information

6. **Handle category and tag relationships**
   - Extract category IDs from relationships
   - Map categories to form multi-select format
   - Extract and format tags array
   - Handle empty categories or tags

7. **Handle image data**
   - Map product images to form image format
   - Set primary image flag
   - Include image URLs and IDs
   - Handle products without images

8. **Handle date fields**
   - Format created_at and updated_at for display
   - Handle timezone conversions if needed
   - Use appropriate date format (ISO 8601)

### Data Transformation Flow

```
API Response
    ↓
┌──────────────────────────────────────┐
│ Transform Field Names                │
│ (snake_case → camelCase)             │
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│ Format Values                        │
│ (prices, dates, booleans)            │
└──────────────────────────────────────┘
    ↓
┌──────────────────────────────────────┐
│ Handle Nested Objects                │
│ (categories, images, inventory)      │
└──────────────────────────────────────┘
    ↓
Form Default Values
```

### Field Mapping

| API Field | Form Field | Transformation |
|-----------|------------|----------------|
| name | name | Direct mapping |
| sku | sku | Direct mapping |
| description | description | Direct mapping |
| cost_price | costPrice | Divide by 100 (cents → currency) |
| selling_price | sellingPrice | Divide by 100 |
| track_inventory | trackInventory | Boolean |
| categories | categoryIds | Extract IDs to array |
| tags | tags | Map to string array |
| images | images | Map with URLs and IDs |

### Price Formatting

| Input (API) | Output (Form) | Transformation |
|-------------|---------------|----------------|
| 250000 | 2500.00 | Divide by 100 |
| 350000 | 3500.00 | Divide by 100 |
| null | 0.00 | Default to 0 |

### Category/Tag Transformation

```
API Response:
{
  categories: [
    { id: "cat_1", name: "Electronics" },
    { id: "cat_2", name: "Accessories" }
  ]
}

Form Values:
{
  categoryIds: ["cat_1", "cat_2"]
}
```

### Image Transformation

```
API Response:
{
  images: [
    { id: "img_1", url: "...", is_primary: true },
    { id: "img_2", url: "...", is_primary: false }
  ]
}

Form Values:
{
  images: [
    { id: "img_1", url: "...", isPrimary: true },
    { id: "img_2", url: "...", isPrimary: false }
  ]
}
```

### Inventory Transformation

```
API Response:
{
  inventory: [
    { warehouse_id: "wh_1", available: 50, reserved: 5 }
  ]
}

Form Values:
{
  inventory: [
    { warehouseId: "wh_1", available: 50, reserved: 5 }
  ]
}
```

### Default Value Handling

| Scenario | Handling |
|----------|----------|
| Null string | Empty string "" |
| Null number | Zero 0 |
| Missing array | Empty array [] |
| Missing object | Empty object {} |

### Expected Outcome
- Form fields populated with existing product data
- All data types correctly formatted
- Nested relationships properly mapped
- Form ready for user edits

### Verification Checklist
- [ ] Basic fields populated (name, SKU, description)
- [ ] Prices formatted correctly (cents to currency)
- [ ] Status field shows current value
- [ ] Categories displayed in multi-select
- [ ] Tags populated in tag input
- [ ] Images displayed with primary indicator
- [ ] Inventory data populated per warehouse
- [ ] Track inventory checkbox reflects current state
- [ ] No console errors during population
- [ ] Form validation works with populated data

---

## Task 65: Create Update Handler

### Overview
Implement the product update handler that processes form submission, transforms form data back to API format, calls the update mutation, handles response, and provides user feedback. This handler manages the entire update workflow from form submission to success confirmation.

### Dependencies
- Task 64: Populate Form with Existing Data
- Group-A: API mutation hooks available

### Instructions

1. **Import update mutation hook**
   - Import `useUpdateProduct` hook from API utilities
   - Review mutation parameters and return values
   - Understand mutation success/error callbacks

2. **Define update handler function**
   - Create `handleUpdate` async function
   - Accept form data as parameter
   - Type parameter with ProductFormData interface

3. **Transform form data to API format**
   - Convert camelCase to snake_case
   - Transform prices (currency to cents)
   - Format nested objects correctly
   - Remove unchanged fields if using PATCH

4. **Prepare mutation payload**
   - Include product ID in payload
   - Add form data fields
   - Handle partial updates vs full updates
   - Include only modified fields for efficiency

5. **Call update mutation**
   - Invoke mutation with product ID and data
   - Use try-catch for error handling
   - Await mutation completion

6. **Handle successful update**
   - Display success toast notification
   - Show "Product updated successfully" message
   - Navigate to product detail page
   - Invalidate product list cache

7. **Handle update errors**
   - Catch mutation errors
   - Display error toast with message
   - Keep user on edit page
   - Log error for debugging

8. **Implement loading state**
   - Use mutation loading state
   - Disable form during submission
   - Show loading spinner on submit button
   - Prevent duplicate submissions

### Update Flow Diagram

```
Form Submit
    ↓
Validate Form Data
    ↓
Transform to API Format
    ↓
Call Update Mutation
    ↓
┌─────────────┬────────────┐
│ Success     │ Error      │
├─────────────┼────────────┤
│ Toast       │ Toast      │
│ Success     │ Error      │
│ ↓           │ ↓          │
│ Invalidate  │ Stay on    │
│ Cache       │ Page       │
│ ↓           │            │
│ Navigate    │            │
│ to Detail   │            │
└─────────────┴────────────┘
```

### Data Transformation (Form → API)

| Form Field | API Field | Transformation |
|------------|-----------|----------------|
| name | name | Direct |
| sku | sku | Direct |
| costPrice | cost_price | Multiply by 100 (currency → cents) |
| sellingPrice | selling_price | Multiply by 100 |
| trackInventory | track_inventory | Boolean |
| categoryIds | categories | Map to ID array |
| tags | tags | String array |
| images | images | Map to image objects |

### Mutation Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID to update |
| data | object | Updated product data |

### Success Response Handling

| Action | Implementation |
|--------|----------------|
| Toast | `toast.success("Product updated")` |
| Cache | Invalidate queries: `products`, `product-{id}` |
| Navigation | `router.push(/products/${id})` |

### Error Response Handling

| Error Code | Message | Action |
|------------|---------|--------|
| 400 | "Invalid data provided" | Show validation errors |
| 403 | "Access denied" | Show permission error |
| 404 | "Product not found" | Redirect to list |
| 500 | "Server error" | Show generic error, retry |

### Button States

| State | Label | Disabled | Icon |
|-------|-------|----------|------|
| Idle | "Update Product" | No | None |
| Loading | "Updating..." | Yes | Spinner |
| Success | "Updated!" | Yes | Checkmark |
| Error | "Update Product" | No | None |

### Expected Outcome
- Update handler processes form submissions
- Data transformed correctly to API format
- Success and error states handled appropriately
- User feedback provided via toasts
- Navigation after successful update

### Verification Checklist
- [ ] useUpdateProduct hook imported
- [ ] handleUpdate function defined
- [ ] Form data transformed to API format
- [ ] Prices converted to cents
- [ ] Mutation called with correct parameters
- [ ] Success toast displayed on update
- [ ] Error toast displayed on failure
- [ ] Navigation to detail page after success
- [ ] Loading state disables form
- [ ] Duplicate submissions prevented
- [ ] Cache invalidated after update

---

## Task 66: Handle Optimistic Updates

### Overview
Implement optimistic UI updates to provide instant feedback when updating product data. Update local cache immediately before API response, show changes instantly to the user, and gracefully revert if the mutation fails. This enhances perceived performance and user experience.

### Dependencies
- Task 65: Create Update Handler

### Instructions

1. **Configure optimistic update in mutation**
   - Access mutation `onMutate` callback
   - Update occurs before API call completes
   - Provide instant UI feedback

2. **Cancel outgoing queries**
   - Cancel any in-flight product queries
   - Prevent race conditions with cache updates
   - Use queryClient.cancelQueries

3. **Snapshot previous data**
   - Save current cache data before update
   - Store snapshot for potential rollback
   - Return snapshot from onMutate

4. **Optimistically update cache**
   - Use queryClient.setQueryData
   - Update product list cache
   - Update single product cache
   - Merge new data with existing data

5. **Handle mutation success**
   - Invalidate queries to fetch fresh data
   - Ensure cache consistency
   - Keep optimistic update until fresh data loads

6. **Handle mutation error**
   - Revert cache to previous snapshot
   - Restore original data
   - Show error message to user

7. **Update UI immediately**
   - Form should show updated values
   - Product list should reflect changes
   - No delay waiting for API response

8. **Implement smooth transitions**
   - Add fade animations for updates
   - Show subtle indicators for pending changes
   - Avoid jarring visual changes

### Optimistic Update Flow

```
User Submits Form
    ↓
onMutate Callback
    ↓
Cancel Queries ──────────┐
    ↓                     │
Snapshot Old Data         │
    ↓                     │
Update Cache Optimistically│
    ↓                     │
Show Updated UI           │
    ↓                     │
Send API Request          │
    ↓                     │
┌───────────┬───────────┐ │
│ Success   │ Error     │ │
├───────────┼───────────┤ │
│ Invalidate│ Rollback ←┘
│ Queries   │ Snapshot
└───────────┴───────────┘
```

### Cache Update Strategy

| Cache Key | Update Action | Purpose |
|-----------|---------------|---------|
| `products` | Update item in array | List reflects changes |
| `product-${id}` | Replace entire object | Detail page reflects changes |
| `product-${id}-inventory` | Update inventory data | Stock levels updated |

### Mutation Callbacks

| Callback | Timing | Purpose |
|----------|--------|---------|
| onMutate | Before API call | Optimistic update, snapshot |
| onSuccess | After success | Invalidate, refetch |
| onError | After error | Rollback, error handling |
| onSettled | Always runs | Cleanup, final state |

### Optimistic Update Example Structure

```typescript
onMutate: async (updatedData) => {
  // Cancel queries
  await queryClient.cancelQueries(['product', id]);
  
  // Snapshot previous
  const previous = queryClient.getQueryData(['product', id]);
  
  // Optimistically update
  queryClient.setQueryData(['product', id], (old) => ({
    ...old,
    ...updatedData
  }));
  
  // Return context with snapshot
  return { previous };
}

onError: (err, variables, context) => {
  // Rollback to snapshot
  queryClient.setQueryData(['product', id], context.previous);
}

onSettled: () => {
  // Refetch to ensure consistency
  queryClient.invalidateQueries(['product', id]);
}
```

### Rollback Scenarios

| Scenario | Action | User Feedback |
|----------|--------|---------------|
| Network Error | Revert cache | "Update failed, changes reverted" |
| Validation Error | Revert cache | Show validation errors |
| Server Error | Revert cache | "Server error, please retry" |
| Permission Error | Revert cache | "Access denied" |

### UI Indicators

| State | Visual Indicator |
|-------|------------------|
| Optimistic Update | Subtle opacity change |
| Pending API | Loading spinner (small) |
| Success | Green checkmark (brief) |
| Error | Red indicator, revert animation |

### Performance Considerations

| Aspect | Implementation |
|--------|----------------|
| Large Lists | Update only affected items |
| Multiple Caches | Update all relevant caches |
| Concurrent Updates | Queue updates, prevent conflicts |
| Memory | Clean up old snapshots |

### Expected Outcome
- Instant UI updates when user saves changes
- Smooth user experience without waiting
- Automatic rollback on errors
- Cache consistency maintained

### Verification Checklist
- [ ] Optimistic update configured in mutation
- [ ] Previous data snapshot created
- [ ] Cache updated before API call
- [ ] Product list shows changes immediately
- [ ] Product detail shows changes immediately
- [ ] Rollback works on error
- [ ] Success invalidates queries
- [ ] No race conditions with concurrent updates
- [ ] UI shows pending state indicator
- [ ] Smooth animations during updates

---

## Task 67: Create Delete Product Dialog

### Overview
Create a confirmation dialog component for product deletion. This dialog presents a clear warning message, displays product information, explains the consequences of deletion, and provides cancel and confirm actions. Implements best practices for destructive actions.

### Dependencies
- Task 55: Create Product Detail Page
- SubPhase-04: Dialog components available

### Instructions

1. **Create DeleteProductDialog component file**
   - Navigate to `frontend/components/modules/products/ProductDetail/`
   - Create file `DeleteProductDialog.tsx`
   - Set up TypeScript React component structure

2. **Define component props interface**
   - `isOpen`: boolean for dialog visibility
   - `onClose`: callback to close dialog
   - `onConfirm`: callback for confirmed deletion
   - `product`: product data object
   - `isLoading`: boolean for loading state during deletion

3. **Import dialog components**
   - Import Dialog/AlertDialog from UI library
   - Import Button component
   - Import necessary icons (AlertTriangle, Trash)

4. **Create dialog structure**
   - Dialog header with warning icon
   - Dialog title "Delete Product"
   - Dialog description with warning message
   - Product information display
   - Action buttons (Cancel, Delete)

5. **Display product information**
   - Show product name prominently
   - Display SKU for identification
   - Show current status
   - Include category information

6. **Write clear warning message**
   - Explain deletion is permanent
   - List consequences (lost data, broken references)
   - Mention alternative (archive instead)
   - Use clear, non-technical language

7. **Style delete button as destructive**
   - Use red/destructive color scheme
   - Add prominent styling for serious action
   - Disable during loading state
   - Show loading spinner when deleting

8. **Add accessibility features**
   - Set appropriate ARIA labels
   - Configure focus trap in dialog
   - Support keyboard navigation (Escape to close)
   - Use semantic HTML

### Dialog Structure

```
┌──────────────────────────────────────────┐
│  ⚠ Delete Product                        │
├──────────────────────────────────────────┤
│                                          │
│  Are you sure you want to delete         │
│  this product?                           │
│                                          │
│  Product: Wireless Mouse Pro             │
│  SKU: WMP-001                            │
│                                          │
│  Warning: This action cannot be undone.  │
│  All product data will be permanently    │
│  removed. Consider archiving instead.    │
│                                          │
│  ┌─────────┐  ┌──────────────┐         │
│  │ Cancel  │  │ Delete Product│         │
│  └─────────┘  └──────────────┘         │
│                    ↑ Red/Destructive     │
└──────────────────────────────────────────┘
```

### Component Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| isOpen | boolean | Yes | Dialog visibility |
| onClose | function | Yes | Close handler |
| onConfirm | function | Yes | Delete confirmation handler |
| product | Product | Yes | Product to delete |
| isLoading | boolean | No | Loading state during deletion |

### Warning Message Content

| Section | Content |
|---------|---------|
| Main Question | "Are you sure you want to delete this product?" |
| Consequences | "This action cannot be undone" |
| Data Loss | "All product data will be permanently removed" |
| Alternative | "Consider archiving the product instead" |
| Impact | "Related orders and reports will lose product reference" |

### Button Configuration

| Button | Variant | Color | Action | Keyboard |
|--------|---------|-------|--------|----------|
| Cancel | Outline | Gray | Close dialog | Escape |
| Delete | Solid | Red | Confirm deletion | Enter |

### Product Information Display

| Field | Display Format |
|-------|----------------|
| Name | Bold, larger text |
| SKU | Monospace font |
| Status | Badge component |
| Categories | Comma-separated list |

### Loading State

| Element | Loading Behavior |
|---------|------------------|
| Delete Button | Show spinner, "Deleting..." text |
| Cancel Button | Disabled during deletion |
| Dialog | Prevent closing during deletion |

### Accessibility Features

| Feature | Implementation |
|---------|----------------|
| Focus Management | Focus on Cancel button on open |
| Keyboard Nav | Tab between buttons |
| Escape Key | Close dialog (if not loading) |
| Screen Reader | Announce dialog role and labels |
| Focus Trap | Keep focus within dialog |

### Expected Outcome
- Functional confirmation dialog for deletion
- Clear warning about consequences
- Product information displayed
- Accessible and keyboard navigable
- Properly styled destructive action

### Verification Checklist
- [ ] DeleteProductDialog component created
- [ ] Props interface defined correctly
- [ ] Dialog opens and closes properly
- [ ] Product information displayed
- [ ] Warning message is clear and complete
- [ ] Cancel button closes dialog
- [ ] Delete button triggers onConfirm
- [ ] Loading state disables interactions
- [ ] Destructive styling applied to delete button
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Focus trap implemented
- [ ] ARIA labels configured

---

## Task 68: Implement Product Deletion

### Overview
Implement the product deletion functionality that handles the actual deletion API call, manages loading and error states, provides user feedback, and updates the UI appropriately after successful deletion. Integrates with the delete dialog and handles navigation after deletion.

### Dependencies
- Task 67: Create Delete Product Dialog

### Instructions

1. **Import delete mutation hook**
   - Import `useDeleteProduct` hook from API utilities
   - Review mutation parameters and callbacks
   - Understand deletion response structure

2. **Create deletion handler function**
   - Define `handleDelete` async function
   - Accept product ID as parameter
   - Implement proper error handling

3. **Integrate with delete dialog**
   - Pass `handleDelete` to dialog's `onConfirm` prop
   - Manage dialog open/closed state
   - Control dialog from product detail header or actions menu

4. **Call delete mutation**
   - Invoke mutation with product ID
   - Use mutation loading state in dialog
   - Handle mutation errors gracefully

5. **Handle successful deletion**
   - Display success toast notification
   - Close delete dialog
   - Navigate to products list page
   - Invalidate product queries in cache

6. **Handle deletion errors**
   - Catch and display error message
   - Keep dialog open on error
   - Show specific error based on error code
   - Allow user to retry

7. **Update cache after deletion**
   - Remove product from list cache
   - Invalidate detail page query
   - Update related queries (categories, inventory)
   - Ensure UI consistency

8. **Add confirmation step for safety**
   - Require explicit confirm action
   - No accidental deletions
   - Consider requiring text confirmation for critical products

### Deletion Flow

```
User Clicks Delete
    ↓
Open Delete Dialog
    ↓
Show Product Info + Warning
    ↓
User Confirms
    ↓
Call Delete Mutation
    ↓
┌──────────────┬─────────────┐
│ Success      │ Error       │
├──────────────┼─────────────┤
│ Close Dialog │ Show Error  │
│ ↓            │ Keep Dialog │
│ Toast Success│ Open        │
│ ↓            │             │
│ Update Cache │             │
│ ↓            │             │
│ Navigate to  │             │
│ Products List│             │
└──────────────┴─────────────┘
```

### Delete Handler Implementation

| Step | Action |
|------|--------|
| 1 | Accept product ID |
| 2 | Call deleteProduct mutation |
| 3 | Set loading state |
| 4 | Wait for API response |
| 5 | Handle success or error |
| 6 | Update UI accordingly |

### Mutation Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| id | string | Product ID to delete |

### Success Actions

| Action | Implementation |
|--------|----------------|
| Toast | `toast.success("Product deleted successfully")` |
| Dialog | `setIsOpen(false)` |
| Navigation | `router.push("/products")` |
| Cache | `queryClient.invalidateQueries(["products"])` |
| Cache | `queryClient.removeQueries(["product", id])` |

### Error Handling

| Error Type | Status Code | Message | Action |
|------------|-------------|---------|--------|
| Not Found | 404 | "Product not found" | Close dialog, redirect |
| Forbidden | 403 | "Access denied" | Show error, keep dialog |
| Conflict | 409 | "Product has related orders" | Show error, suggest archive |
| Server Error | 500 | "Unable to delete product" | Show error, allow retry |

### Cache Updates

| Query Key | Update Action |
|-----------|---------------|
| `["products"]` | Invalidate (refetch list) |
| `["product", id]` | Remove query |
| `["product-inventory", id]` | Remove query |
| `["categories"]` | Invalidate (update counts) |

### Navigation After Deletion

| Source Page | Destination |
|-------------|-------------|
| Product Detail | Products List |
| Products List | Stay on list (update) |

### Toast Notifications

| Event | Type | Message | Duration |
|-------|------|---------|----------|
| Success | Success | "Product deleted successfully" | 3s |
| Error (Generic) | Error | "Failed to delete product" | 5s |
| Error (Specific) | Error | Error message from API | 5s |

### Expected Outcome
- Product deletion works correctly
- User receives clear feedback
- UI updates after deletion
- Navigation to appropriate page
- Cache stays consistent

### Verification Checklist
- [ ] useDeleteProduct hook imported and used
- [ ] handleDelete function implemented
- [ ] Function integrated with delete dialog
- [ ] Loading state passed to dialog
- [ ] Success toast displayed
- [ ] Error toast displayed on failure
- [ ] Dialog closes on success
- [ ] Navigation to products list after success
- [ ] Product removed from list cache
- [ ] Detail page query removed
- [ ] Related queries invalidated
- [ ] Error messages are user-friendly
- [ ] Retry functionality available on error

---

## Task 69: Create Archive/Restore Actions

### Overview
Implement archive and restore actions for products as a reversible alternative to deletion. Archived products are hidden from active views but can be restored later. Create action buttons in the product detail header, implement API calls, handle optimistic updates, and provide clear user feedback.

### Dependencies
- Task 55: Create Product Detail Page
- Task 56: Create Product Detail Header

### Instructions

1. **Add archive/restore buttons to header**
   - Update ProductDetailHeader component
   - Add Archive button in actions menu (if product is active)
   - Add Restore button in actions menu (if product is archived)
   - Use appropriate icons (Archive, ArchiveRestore)

2. **Import archive mutation hooks**
   - Import or create `useArchiveProduct` hook
   - Import or create `useRestoreProduct` hook
   - Or use single `useUpdateProduct` with status change

3. **Create archive handler function**
   - Define `handleArchive` function
   - Call mutation to update product status to "archived"
   - Handle success and error cases

4. **Create restore handler function**
   - Define `handleRestore` function
   - Call mutation to update product status to "active"
   - Handle success and error cases

5. **Implement optimistic updates**
   - Update product status in cache immediately
   - Show updated status badge without waiting
   - Revert on error

6. **Display success feedback**
   - Show toast on successful archive
   - Show toast on successful restore
   - Update status badge in header
   - Update action button visibility

7. **Handle errors gracefully**
   - Display error toast if archive fails
   - Display error toast if restore fails
   - Allow user to retry action

8. **Add confirmation for archive (optional)**
   - Consider showing confirmation dialog for archive
   - Less critical than delete, but still important
   - Can be simple confirmation without extensive warning

### Archive/Restore Flow

```
Product Detail Page
    ↓
Product Status: Active
    ↓
User Clicks "Archive"
    ↓
Optimistic Update → Status: Archived
    ↓
API Call (PATCH /products/:id)
    ↓
┌──────────────┬────────────────┐
│ Success      │ Error          │
├──────────────┼────────────────┤
│ Toast        │ Revert Status  │
│ "Archived"   │ Toast Error    │
│ ↓            │                │
│ Show Restore │                │
│ Button       │                │
└──────────────┴────────────────┘
```

### Action Button Visibility

| Product Status | Archive Button | Restore Button |
|----------------|----------------|----------------|
| Active | Visible | Hidden |
| Archived | Hidden | Visible |
| Draft | Visible | Hidden |

### API Call Structure

| Action | Method | Endpoint | Payload |
|--------|--------|----------|---------|
| Archive | PATCH | `/api/products/:id` | `{ status: "archived" }` |
| Restore | PATCH | `/api/products/:id` | `{ status: "active" }` |

### Optimistic Update Implementation

| Step | Action |
|------|--------|
| 1 | Cancel related queries |
| 2 | Snapshot current data |
| 3 | Update cache with new status |
| 4 | Show updated UI immediately |
| 5 | Make API call |
| 6 | On error: rollback to snapshot |
| 7 | On success: invalidate queries |

### Toast Notifications

| Action | Message | Type | Duration |
|--------|---------|------|----------|
| Archive Success | "Product archived successfully" | Success | 3s |
| Archive Error | "Failed to archive product" | Error | 5s |
| Restore Success | "Product restored successfully" | Success | 3s |
| Restore Error | "Failed to restore product" | Error | 5s |

### Status Badge Updates

| Status | Badge Color | Badge Text |
|--------|-------------|------------|
| Active | Green | Active |
| Archived | Gray | Archived |
| Draft | Yellow | Draft |

### Header Actions Menu Structure

```
More Actions (⋮)
├── Edit Product
├── Duplicate Product
├── Archive Product (if active)
├── Restore Product (if archived)
└── Delete Product
```

### Cache Updates

| Query | Update Action |
|-------|---------------|
| `["product", id]` | Update status field |
| `["products"]` | Invalidate (refetch list) |
| `["products", { status: "active" }]` | Invalidate |
| `["products", { status: "archived" }]` | Invalidate |

### Expected Outcome
- Archive button available for active products
- Restore button available for archived products
- Status updates immediately with optimistic update
- Success and error feedback provided
- Cache stays consistent

### Verification Checklist
- [ ] Archive button added to header actions
- [ ] Restore button added to header actions
- [ ] Button visibility based on product status
- [ ] handleArchive function implemented
- [ ] handleRestore function implemented
- [ ] Optimistic update configured
- [ ] Status badge updates immediately
- [ ] Success toast displayed for archive
- [ ] Success toast displayed for restore
- [ ] Error toast displayed on failure
- [ ] Product list updated after archive/restore
- [ ] Action button switches after status change
- [ ] Rollback works on error

---

## Task 70: Create Duplicate Product Action

### Overview
Implement product duplication functionality that allows users to create a new product based on an existing one. Fetch the product data, navigate to the creation page with pre-filled form data (except unique fields like SKU), and allow the user to make adjustments before saving the duplicate.

### Dependencies
- Task 55: Create Product Detail Page
- Task 54: Create Product Form Component

### Instructions

1. **Add duplicate button to header actions**
   - Update ProductDetailHeader component
   - Add "Duplicate" button in actions dropdown menu
   - Use Copy or Duplicate icon
   - Place between Edit and Archive actions

2. **Create duplication handler function**
   - Define `handleDuplicate` function
   - Fetch current product data
   - Transform data for duplication
   - Navigate to create page with data

3. **Fetch product data for duplication**
   - Use existing product data from detail page
   - Or fetch fresh data if needed
   - Ensure all data is available

4. **Transform data for duplication**
   - Copy all product fields
   - Clear SKU field (must be unique)
   - Clear product ID (new product)
   - Append "(Copy)" to product name
   - Clear created/updated timestamps
   - Handle images (keep references or clear)

5. **Navigate to product creation page**
   - Use Next.js router to navigate to `/products/new`
   - Pass transformed data via state or URL params
   - Or store in global state/context

6. **Pre-fill creation form with data**
   - Modify ProductForm to accept initialData prop
   - Populate form fields with duplicated data
   - SKU field should be empty or auto-generated
   - Name should indicate it's a copy

7. **Handle images for duplication**
   - Option A: Keep same image references (faster)
   - Option B: Clear images (user uploads new)
   - Option C: Create copies of images (complex)
   - Consider business requirements

8. **Provide user feedback**
   - Show toast: "Duplicate product created"
   - Indicate fields that need attention (SKU)
   - Allow user to modify before saving

### Duplication Flow

```
Product Detail Page
    ↓
User Clicks "Duplicate"
    ↓
Fetch Product Data
    ↓
Transform Data:
  - Copy fields
  - Clear SKU
  - Clear ID
  - Add "(Copy)" to name
  - Handle images
    ↓
Navigate to /products/new
    ↓
Pre-fill Form with Data
    ↓
User Modifies as Needed
    ↓
User Submits Form
    ↓
New Product Created
```

### Data Transformation

| Original Field | Duplicated Field | Transformation |
|----------------|------------------|----------------|
| id | (none) | Cleared (new ID on save) |
| name | name | Append " (Copy)" |
| sku | sku | Cleared or auto-generate |
| description | description | Keep as-is |
| cost_price | cost_price | Keep as-is |
| selling_price | selling_price | Keep as-is |
| status | status | Set to "draft" |
| categories | categories | Keep as-is |
| tags | tags | Keep as-is |
| images | images | Keep references or clear |
| track_inventory | track_inventory | Keep as-is |
| inventory | inventory | Clear (start fresh) |
| created_at | (none) | Cleared |
| updated_at | (none) | Cleared |

### Name Transformation Examples

| Original Name | Duplicated Name |
|---------------|-----------------|
| Wireless Mouse | Wireless Mouse (Copy) |
| USB Cable | USB Cable (Copy) |
| Laptop Pro | Laptop Pro (Copy) |

### Navigation Strategy

**Option A: URL State**
```
/products/new?duplicate=prod_123
(Fetch data in creation page)
```

**Option B: Router State**
```typescript
router.push('/products/new', {
  state: { duplicateData: transformedData }
});
```

**Option C: Global State**
```typescript
setDuplicateData(transformedData);
router.push('/products/new');
```

### Image Handling Options

| Option | Pros | Cons | Implementation |
|--------|------|------|----------------|
| Keep References | Fast, no upload | Shared images | Copy image URLs |
| Clear Images | Forces new images | Extra work | Set images: [] |
| Copy Images | Independent copies | Complex, slower | Create new image records |

### Form Pre-fill Implementation

| Approach | Method |
|----------|--------|
| Props | Pass data as ProductForm prop |
| Context | Use product context provider |
| State | Global or router state |

### User Feedback

| Event | Message | Type |
|-------|---------|------|
| Duplication Started | "Preparing duplicate product..." | Info |
| Form Pre-filled | "Product duplicated. Update SKU before saving." | Info |
| Validation Error | "Please provide a unique SKU" | Warning |

### Fields Requiring Attention

| Field | Why | Indication |
|-------|-----|------------|
| SKU | Must be unique | Empty or error highlight |
| Name | Should be customized | "(Copy)" suffix added |
| Inventory | Should be reviewed | Cleared or flagged |

### Expected Outcome
- Duplicate button in product actions menu
- Clicking duplicate navigates to creation page
- Form pre-filled with product data
- SKU cleared for new unique value
- Name indicates it's a duplicate
- User can modify and save as new product

### Verification Checklist
- [ ] Duplicate button added to actions menu
- [ ] handleDuplicate function implemented
- [ ] Product data fetched and transformed
- [ ] ID and SKU cleared
- [ ] Name appended with "(Copy)"
- [ ] Navigation to /products/new works
- [ ] Creation form pre-filled with data
- [ ] SKU field is empty or highlighted
- [ ] Status set to "draft"
- [ ] Images handled appropriately
- [ ] Inventory data cleared or flagged
- [ ] User can modify duplicated data
- [ ] Saving creates new product (not update)
- [ ] Toast notification shows on duplicate

---

## Summary

This document covered the implementation of product editing, data fetching, form population, optimistic updates, and product actions including delete, archive/restore, and duplication. These features provide complete product lifecycle management with a smooth, responsive user experience.

### Completed Tasks
1. ✓ Created edit product page at `/products/[id]/edit`
2. ✓ Implemented product data fetching with useProduct hook
3. ✓ Populated form with existing product data
4. ✓ Created update handler with proper data transformation
5. ✓ Implemented optimistic updates for instant feedback
6. ✓ Created delete confirmation dialog with warnings
7. ✓ Implemented product deletion with error handling
8. ✓ Created archive/restore actions for reversible hiding
9. ✓ Implemented duplicate product functionality

### Key Features Delivered
- Edit page with pre-filled form
- Optimistic UI updates
- Comprehensive delete confirmation
- Archive as deletion alternative
- Product duplication workflow
- Proper error handling throughout
- Cache management and consistency

### Next Steps
Proceed to Group-E to implement variant management (creating, editing product variants, bulk operations) and category management (creating, editing categories and subcategories).
