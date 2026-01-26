# Tasks 59-68: Product, Inventory, Customer, Vendor API Services

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 04 - API Client Layer  
> **Group:** E - Module API Services  
> **Document:** 01 of 02  
> **Tasks Covered:** 59, 60, 61, 62, 63, 64, 65, 66, 67, 68

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-69-78_Sales-HR-Reports-Settings.md](02_Tasks-69-78_Sales-HR-Reports-Settings.md)

---

## Document Overview

This document covers the creation of typed API services for Product, Inventory, Customer, and Vendor modules. Each service provides type-safe CRUD operations with proper error handling, data transformation, and integration with the API client infrastructure.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 59 | Create Product Types | Low | 20 min |
| 60 | Create Product Service | Medium | 45 min |
| 61 | Create Category Service | Low | 30 min |
| 62 | Create Inventory Types | Low | 20 min |
| 63 | Create Inventory Service | Medium | 45 min |
| 64 | Create Warehouse Service | Low | 30 min |
| 65 | Create Customer Types | Low | 20 min |
| 66 | Create Customer Service | Medium | 45 min |
| 67 | Create Vendor Types | Low | 20 min |
| 68 | Create Vendor Service | Medium | 45 min |

---

## Task 59: Create Product Types

### Overview
Define comprehensive TypeScript types for products including product entities, variants, pricing structures, stock tracking, and API request/response formats. These types ensure type safety across product operations.

### Dependencies
- Task 08: Create base types (APIResponse, PaginatedResponse, QueryParams)
- Frontend project initialized with TypeScript
- API client infrastructure established

### Instructions

1. **Create product types file**
   - Navigate to `frontend/src/types/` directory
   - Create new file named `product.types.ts`
   - Add file header with description and exports overview

2. **Define ProductStatus enum**
   - Create enum for product lifecycle states
   - Include: DRAFT, ACTIVE, DISCONTINUED, OUT_OF_STOCK
   - Each status controls visibility and ordering

3. **Define ProductType enum**
   - Create enum for product categorization
   - Include: SIMPLE, VARIABLE, SERVICE, DIGITAL
   - Determines variant and inventory behavior

4. **Define UnitOfMeasure enum**
   - Create enum for measurement units
   - Include: PIECE, KG, GRAM, LITER, METER, SQUARE_METER
   - Used for quantity tracking and pricing

5. **Define ProductVariant interface**
   - Represents product variations (size, color, etc.)
   - Include: id, productId, sku, variantName, attributeValues
   - Include: price, compareAtPrice, cost, stockQuantity
   - Include: barcode, weight, dimensions, isActive

6. **Define ProductAttribute interface**
   - Represents configurable product attributes
   - Include: id, name, values (array of options)
   - Used for creating product variants

7. **Define ProductPricing interface**
   - Represents product pricing structure
   - Include: basePrice, compareAtPrice, cost, margin
   - Include: taxRate, taxInclusive, currencyCode
   - Include: priceTiers (quantity-based pricing)

8. **Define ProductInventory interface**
   - Represents stock tracking information
   - Include: trackInventory, stockQuantity, lowStockThreshold
   - Include: allowBackorder, requiresSerial, warehouseAllocations

9. **Define ProductImage interface**
   - Represents product media assets
   - Include: id, url, thumbnailUrl, alt, position
   - Include: isPrimary, size, format

10. **Define Product interface (main entity)**
    - Core product entity structure
    - Include: id, tenantId, sku, barcode, name, description
    - Include: productType, status, categoryId, brandId
    - Include: unitOfMeasure, pricing, inventory
    - Include: variants (if variable), attributes, images
    - Include: tags, customFields, seoMetadata
    - Include: isActive, createdAt, updatedAt, createdBy

11. **Define ProductCategory interface**
    - Represents product categorization
    - Include: id, name, slug, description, parentId
    - Include: imageUrl, displayOrder, isActive
    - Include: productCount, seoMetadata

12. **Define ProductBrand interface**
    - Represents product brands/manufacturers
    - Include: id, name, slug, description, logoUrl
    - Include: website, isActive, productCount

13. **Define ProductCreateRequest interface**
    - API request format for creating products
    - Include: all required product fields
    - Include: optional variant definitions
    - Include: optional image uploads

14. **Define ProductUpdateRequest interface**
    - API request format for updating products
    - Include: partial product fields (all optional)
    - Include: variant modifications
    - Include: image operations (add/remove/reorder)

15. **Define ProductSearchParams interface**
    - Query parameters for product search
    - Include: query (search text), categoryId, brandId
    - Include: status, productType, priceRange (min/max)
    - Include: inStock, tags, sort, pagination

16. **Define ProductBulkOperation interface**
    - Represents bulk product operations
    - Include: productIds, operation (update/delete/activate)
    - Include: changes (fields to update in bulk)

17. **Define ProductImportRow interface**
    - Represents product data for CSV import
    - Include: mapped product fields
    - Include: validation status and errors

### Type Structure Diagram

```
Product Types Hierarchy
│
├── Enums
│   ├── ProductStatus (DRAFT, ACTIVE, DISCONTINUED, OUT_OF_STOCK)
│   ├── ProductType (SIMPLE, VARIABLE, SERVICE, DIGITAL)
│   └── UnitOfMeasure (PIECE, KG, GRAM, LITER, METER, SQUARE_METER)
│
├── Supporting Interfaces
│   ├── ProductVariant
│   ├── ProductAttribute
│   ├── ProductPricing
│   ├── ProductInventory
│   ├── ProductImage
│   ├── ProductCategory
│   └── ProductBrand
│
├── Main Entity
│   └── Product
│
└── API Interfaces
    ├── ProductCreateRequest
    ├── ProductUpdateRequest
    ├── ProductSearchParams
    ├── ProductBulkOperation
    └── ProductImportRow
```

### Type Usage Matrix

| Type | Used In | Purpose |
|------|---------|---------|
| Product | Product service, lists, details | Main product entity |
| ProductVariant | Product entity, variant selector | Product variations |
| ProductPricing | Product entity, pricing display | Price management |
| ProductInventory | Product entity, stock tracking | Inventory control |
| ProductCategory | Product filters, navigation | Categorization |
| ProductCreateRequest | Create product API calls | New product data |
| ProductUpdateRequest | Update product API calls | Product modifications |
| ProductSearchParams | Product search/filter API | Query construction |

### Expected Outcome
- Complete type definitions for product domain
- Type safety for product CRUD operations
- Proper interfaces for API requests/responses
- Support for simple and variable products
- Comprehensive pricing and inventory types

### Verification Checklist
- [ ] `product.types.ts` file created
- [ ] All enums defined (ProductStatus, ProductType, UnitOfMeasure)
- [ ] All supporting interfaces created
- [ ] Main Product interface complete
- [ ] API request/response interfaces defined
- [ ] Types exported for use in services
- [ ] No TypeScript compilation errors

---

## Task 60: Create Product Service

### Overview
Create a comprehensive product service that provides type-safe CRUD operations for products. The service handles product creation, retrieval, updates, deletion, variant management, and bulk operations.

### Dependencies
- Task 59: Create Product Types
- Task 08: Base API types and client
- Task 16: API client instance configured

### Instructions

1. **Create product service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `product.service.ts`
   - Import Product types and API client utilities

2. **Import required dependencies**
   - Import Product, ProductCreateRequest, ProductUpdateRequest, ProductSearchParams
   - Import APIResponse, PaginatedResponse from base types
   - Import apiClient from API client configuration
   - Import error handling utilities

3. **Define API endpoint constants**
   - Create constant for base endpoint: `/api/products/`
   - Create constants for specific endpoints (variants, images, bulk)
   - Use template literals for dynamic endpoints

4. **Create getProducts function**
   - Signature: `(params?: ProductSearchParams) => Promise<PaginatedResponse<Product>>`
   - Accepts optional search/filter parameters
   - Constructs query string from params
   - Makes GET request to products endpoint
   - Returns paginated product list
   - Handles errors with proper error messages

5. **Create getProductById function**
   - Signature: `(id: string) => Promise<APIResponse<Product>>`
   - Accepts product ID
   - Makes GET request to `/api/products/{id}/`
   - Returns single product with full details
   - Includes variants, images, inventory
   - Handles 404 errors gracefully

6. **Create getProductBySku function**
   - Signature: `(sku: string) => Promise<APIResponse<Product>>`
   - Accepts product SKU
   - Makes GET request to `/api/products/by-sku/{sku}/`
   - Returns product matching SKU
   - Useful for barcode scanning

7. **Create getProductByBarcode function**
   - Signature: `(barcode: string) => Promise<APIResponse<Product>>`
   - Accepts barcode value
   - Makes GET request to `/api/products/by-barcode/{barcode}/`
   - Returns product matching barcode
   - Used in POS scanning operations

8. **Create createProduct function**
   - Signature: `(data: ProductCreateRequest) => Promise<APIResponse<Product>>`
   - Accepts product creation data
   - Validates required fields
   - Makes POST request to `/api/products/`
   - Returns created product with generated ID
   - Handles validation errors

9. **Create updateProduct function**
   - Signature: `(id: string, data: ProductUpdateRequest) => Promise<APIResponse<Product>>`
   - Accepts product ID and update data
   - Merges partial updates
   - Makes PUT or PATCH request to `/api/products/{id}/`
   - Returns updated product
   - Handles version conflicts

10. **Create deleteProduct function**
    - Signature: `(id: string) => Promise<APIResponse<void>>`
    - Accepts product ID
    - Makes DELETE request to `/api/products/{id}/`
    - Returns success confirmation
    - Handles cascade dependencies

11. **Create bulkUpdateProducts function**
    - Signature: `(operation: ProductBulkOperation) => Promise<APIResponse<number>>`
    - Accepts bulk operation definition
    - Makes POST request to `/api/products/bulk/`
    - Returns count of affected products
    - Supports status changes, category reassignment

12. **Create bulkDeleteProducts function**
    - Signature: `(productIds: string[]) => Promise<APIResponse<number>>`
    - Accepts array of product IDs
    - Makes DELETE request to `/api/products/bulk/`
    - Returns count of deleted products
    - Validates cascading impact

13. **Create getProductVariants function**
    - Signature: `(productId: string) => Promise<APIResponse<ProductVariant[]>>`
    - Accepts product ID
    - Makes GET request to `/api/products/{id}/variants/`
    - Returns all variants for product
    - Only applicable for variable products

14. **Create createProductVariant function**
    - Signature: `(productId: string, data: Partial<ProductVariant>) => Promise<APIResponse<ProductVariant>>`
    - Accepts product ID and variant data
    - Makes POST request to `/api/products/{id}/variants/`
    - Returns created variant
    - Auto-generates SKU if not provided

15. **Create updateProductVariant function**
    - Signature: `(productId: string, variantId: string, data: Partial<ProductVariant>) => Promise<APIResponse<ProductVariant>>`
    - Accepts product ID, variant ID, and update data
    - Makes PATCH request to `/api/products/{id}/variants/{variantId}/`
    - Returns updated variant

16. **Create deleteProductVariant function**
    - Signature: `(productId: string, variantId: string) => Promise<APIResponse<void>>`
    - Accepts product ID and variant ID
    - Makes DELETE request to `/api/products/{id}/variants/{variantId}/`
    - Prevents deletion if variant has transactions

17. **Create uploadProductImage function**
    - Signature: `(productId: string, file: File, isPrimary?: boolean) => Promise<APIResponse<ProductImage>>`
    - Accepts product ID and image file
    - Creates FormData with file
    - Makes POST request to `/api/products/{id}/images/`
    - Returns uploaded image metadata
    - Supports image optimization

18. **Create reorderProductImages function**
    - Signature: `(productId: string, imageOrder: string[]) => Promise<APIResponse<void>>`
    - Accepts product ID and ordered image IDs
    - Makes PUT request to `/api/products/{id}/images/reorder/`
    - Updates image display order

19. **Create deleteProductImage function**
    - Signature: `(productId: string, imageId: string) => Promise<APIResponse<void>>`
    - Accepts product ID and image ID
    - Makes DELETE request to `/api/products/{id}/images/{imageId}/`
    - Removes image from storage

20. **Create checkProductAvailability function**
    - Signature: `(productId: string, quantity: number, warehouseId?: string) => Promise<APIResponse<boolean>>`
    - Accepts product ID, quantity, optional warehouse
    - Makes GET request to `/api/products/{id}/availability/`
    - Returns availability status
    - Checks stock levels and backorder settings

21. **Create export default productService object**
    - Bundle all functions in service object
    - Provides namespace for product operations
    - Enables named imports in components

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getProducts | GET | /api/products/ | List/search products |
| getProductById | GET | /api/products/{id}/ | Get single product |
| getProductBySku | GET | /api/products/by-sku/{sku}/ | Find by SKU |
| getProductByBarcode | GET | /api/products/by-barcode/{barcode}/ | Find by barcode |
| createProduct | POST | /api/products/ | Create new product |
| updateProduct | PATCH | /api/products/{id}/ | Update product |
| deleteProduct | DELETE | /api/products/{id}/ | Delete product |
| bulkUpdateProducts | POST | /api/products/bulk/ | Bulk update |
| bulkDeleteProducts | DELETE | /api/products/bulk/ | Bulk delete |
| getProductVariants | GET | /api/products/{id}/variants/ | List variants |
| createProductVariant | POST | /api/products/{id}/variants/ | Add variant |
| updateProductVariant | PATCH | /api/products/{id}/variants/{variantId}/ | Update variant |
| deleteProductVariant | DELETE | /api/products/{id}/variants/{variantId}/ | Remove variant |
| uploadProductImage | POST | /api/products/{id}/images/ | Add image |
| reorderProductImages | PUT | /api/products/{id}/images/reorder/ | Change order |
| deleteProductImage | DELETE | /api/products/{id}/images/{imageId}/ | Remove image |
| checkProductAvailability | GET | /api/products/{id}/availability/ | Check stock |

### Error Handling Strategy

| Error Type | HTTP Status | Handling |
|------------|-------------|----------|
| Validation Error | 400 | Return field-specific errors |
| Not Found | 404 | Return null or empty result |
| Duplicate SKU | 409 | Suggest alternative SKU |
| Low Stock Warning | 200 | Include warning in response |
| Inventory Lock | 423 | Indicate product reserved |

### Expected Outcome
- Complete product service with all CRUD operations
- Type-safe function signatures
- Proper error handling and transformation
- Support for variants and images
- Bulk operation capabilities

### Verification Checklist
- [ ] `product.service.ts` file created
- [ ] All CRUD functions implemented
- [ ] Variant management functions complete
- [ ] Image management functions complete
- [ ] Bulk operations implemented
- [ ] Error handling in place
- [ ] Service exported as default
- [ ] No TypeScript errors

---

## Task 61: Create Category Service

### Overview
Create a category service for managing product categories with hierarchical structure support. The service provides CRUD operations for categories and handles parent-child relationships.

### Dependencies
- Task 59: Create Product Types (ProductCategory interface)
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create category service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `category.service.ts`
   - Import ProductCategory type and API utilities

2. **Import required dependencies**
   - Import ProductCategory from product types
   - Import APIResponse, PaginatedResponse
   - Import apiClient
   - Import error handling utilities

3. **Define API endpoint constants**
   - Create constant: `CATEGORY_ENDPOINT = '/api/categories/'`
   - Create constant for tree endpoint: `/api/categories/tree/`
   - Create constant for move endpoint: `/api/categories/move/`

4. **Define CategoryCreateRequest interface**
   - Include: name, slug, description, parentId
   - Include: imageUrl, displayOrder, isActive
   - Include: seoMetadata (title, description, keywords)

5. **Define CategoryUpdateRequest interface**
   - Partial version of create request
   - All fields optional for flexible updates

6. **Define CategoryTreeNode interface**
   - Extends ProductCategory
   - Include: children (array of CategoryTreeNode)
   - Include: level (depth in hierarchy)
   - Include: path (array of ancestor IDs)

7. **Create getCategories function**
   - Signature: `(params?: { parentId?: string; includeInactive?: boolean }) => Promise<PaginatedResponse<ProductCategory>>`
   - Accepts optional parent filter
   - Makes GET request to categories endpoint
   - Returns flat list of categories
   - Supports filtering by parent

8. **Create getCategoryTree function**
   - Signature: `() => Promise<APIResponse<CategoryTreeNode[]>>`
   - Makes GET request to `/api/categories/tree/`
   - Returns nested category structure
   - Includes product counts at each level
   - Used for navigation menus

9. **Create getCategoryById function**
   - Signature: `(id: string) => Promise<APIResponse<ProductCategory>>`
   - Accepts category ID
   - Makes GET request to `/api/categories/{id}/`
   - Returns single category with details

10. **Create getCategoryBySlug function**
    - Signature: `(slug: string) => Promise<APIResponse<ProductCategory>>`
    - Accepts category slug
    - Makes GET request to `/api/categories/by-slug/{slug}/`
    - Used for SEO-friendly URLs

11. **Create createCategory function**
    - Signature: `(data: CategoryCreateRequest) => Promise<APIResponse<ProductCategory>>`
    - Accepts category creation data
    - Validates parent exists if parentId provided
    - Makes POST request to categories endpoint
    - Returns created category

12. **Create updateCategory function**
    - Signature: `(id: string, data: CategoryUpdateRequest) => Promise<APIResponse<ProductCategory>>`
    - Accepts category ID and update data
    - Makes PATCH request to `/api/categories/{id}/`
    - Returns updated category
    - Prevents circular parent references

13. **Create deleteCategory function**
    - Signature: `(id: string, reassignTo?: string) => Promise<APIResponse<void>>`
    - Accepts category ID
    - Optional reassignTo for product migration
    - Makes DELETE request to `/api/categories/{id}/`
    - Handles products in category

14. **Create moveCategoryfunction**
    - Signature: `(id: string, newParentId: string | null, position?: number) => Promise<APIResponse<ProductCategory>>`
    - Accepts category ID and new parent
    - Makes POST request to `/api/categories/move/`
    - Updates category hierarchy
    - Reorders siblings if position specified

15. **Create reorderCategories function**
    - Signature: `(parentId: string | null, categoryOrder: string[]) => Promise<APIResponse<void>>`
    - Accepts parent ID and ordered category IDs
    - Makes PUT request to `/api/categories/reorder/`
    - Updates displayOrder for categories

16. **Create getCategoryPath function**
    - Signature: `(id: string) => Promise<APIResponse<ProductCategory[]>>`
    - Accepts category ID
    - Makes GET request to `/api/categories/{id}/path/`
    - Returns breadcrumb trail (ancestors)

17. **Create export default categoryService object**
    - Bundle all functions in service object
    - Provides organized API surface

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getCategories | GET | /api/categories/ | List categories |
| getCategoryTree | GET | /api/categories/tree/ | Get hierarchy |
| getCategoryById | GET | /api/categories/{id}/ | Get single category |
| getCategoryBySlug | GET | /api/categories/by-slug/{slug}/ | Get by URL slug |
| createCategory | POST | /api/categories/ | Create category |
| updateCategory | PATCH | /api/categories/{id}/ | Update category |
| deleteCategory | DELETE | /api/categories/{id}/ | Delete category |
| moveCategory | POST | /api/categories/move/ | Change parent |
| reorderCategories | PUT | /api/categories/reorder/ | Update order |
| getCategoryPath | GET | /api/categories/{id}/path/ | Get breadcrumb |

### Hierarchy Operations

| Operation | Validation | Effect |
|-----------|------------|--------|
| Create with parent | Parent must exist | Nested category |
| Move category | Prevent circular reference | Update hierarchy |
| Delete with children | Require reassignment or cascade | Remove branch |
| Reorder siblings | Same parent required | Update displayOrder |

### Expected Outcome
- Complete category service with CRUD operations
- Hierarchical category management
- Category tree retrieval for navigation
- URL slug support for SEO

### Verification Checklist
- [ ] `category.service.ts` file created
- [ ] All CRUD functions implemented
- [ ] Hierarchy operations complete
- [ ] Tree retrieval function works
- [ ] Slug-based retrieval supported
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 62: Create Inventory Types

### Overview
Define comprehensive TypeScript types for inventory management including stock tracking, warehouse locations, stock movements, and inventory adjustments. These types support multi-warehouse inventory operations.

### Dependencies
- Task 08: Base API types
- Task 59: Product types (for product references)
- Frontend TypeScript configuration

### Instructions

1. **Create inventory types file**
   - Navigate to `frontend/src/types/` directory
   - Create new file named `inventory.types.ts`
   - Add file header and exports overview

2. **Define StockMovementType enum**
   - Create enum for stock transaction types
   - Include: PURCHASE, SALE, ADJUSTMENT, TRANSFER, RETURN, DAMAGE
   - Used to categorize stock changes

3. **Define StockMovementStatus enum**
   - Create enum for transaction status
   - Include: PENDING, COMPLETED, CANCELLED
   - Tracks movement processing state

4. **Define AdjustmentReason enum**
   - Create enum for adjustment justifications
   - Include: DAMAGE, THEFT, EXPIRED, RECOUNT, ERROR, OTHER
   - Required for audit trail

5. **Define InventoryValuationMethod enum**
   - Create enum for costing methods
   - Include: FIFO, LIFO, AVERAGE, STANDARD
   - Determines inventory value calculation

6. **Define Warehouse interface**
   - Represents physical storage location
   - Include: id, tenantId, code, name, description
   - Include: address (full address object), contactPhone, contactEmail
   - Include: isActive, isPrimary, capacity, currentUtilization
   - Include: createdAt, updatedAt

7. **Define WarehouseLocation interface**
   - Represents storage location within warehouse
   - Include: id, warehouseId, zone, aisle, rack, shelf, bin
   - Include: locationCode (concatenated), capacity, isActive
   - Used for bin-level tracking

8. **Define StockLevel interface**
   - Represents current stock at location
   - Include: id, productId, variantId, warehouseId
   - Include: quantityOnHand, quantityAvailable, quantityReserved
   - Include: quantityIncoming, quantityOnOrder
   - Include: lastCountDate, lastRestockDate

9. **Define StockMovement interface**
   - Represents inventory transaction
   - Include: id, tenantId, movementType, status
   - Include: productId, variantId, sku, quantity
   - Include: sourceWarehouseId, destinationWarehouseId
   - Include: unitCost, totalCost, referenceType, referenceId
   - Include: notes, createdBy, createdAt, completedAt

10. **Define StockAdjustment interface**
    - Represents inventory correction
    - Include: id, productId, variantId, warehouseId
    - Include: quantityBefore, quantityAfter, difference
    - Include: reason, reasonNotes, adjustedBy, adjustedAt
    - Include: approvedBy, approvalDate

11. **Define StockTransfer interface**
    - Represents inter-warehouse transfer
    - Include: id, transferNumber, sourceWarehouseId, destinationWarehouseId
    - Include: items (array of products/quantities)
    - Include: status, requestedBy, approvedBy, completedBy
    - Include: requestDate, approvalDate, shipDate, receiveDate
    - Include: notes, shippingDetails

12. **Define StockCount interface**
    - Represents physical inventory count
    - Include: id, countNumber, warehouseId, countDate
    - Include: countType (FULL, CYCLE, SPOT), status
    - Include: items (array with expected/actual quantities)
    - Include: discrepancies, totalVariance, countedBy
    - Include: approvedBy, approvalDate

13. **Define LowStockAlert interface**
    - Represents stock level warning
    - Include: id, productId, variantId, warehouseId
    - Include: currentQuantity, threshold, status
    - Include: alertDate, acknowledgedBy, acknowledgedAt
    - Include: reorderQuantity, reorderStatus

14. **Define InventoryValue interface**
    - Represents inventory valuation snapshot
    - Include: id, warehouseId, valuationDate, method
    - Include: totalUnits, totalValue, averageCost
    - Include: categoryBreakdown, productBreakdown

15. **Define StockMovementCreateRequest interface**
    - API request for recording stock movement
    - Include: movementType, productId, variantId, quantity
    - Include: sourceWarehouseId, destinationWarehouseId
    - Include: unitCost, referenceType, referenceId, notes

16. **Define StockAdjustmentCreateRequest interface**
    - API request for stock adjustment
    - Include: productId, variantId, warehouseId
    - Include: quantityChange, reason, reasonNotes

17. **Define StockTransferCreateRequest interface**
    - API request for transfer creation
    - Include: sourceWarehouseId, destinationWarehouseId
    - Include: items (productId, variantId, quantity)
    - Include: requestedDate, notes

18. **Define InventorySearchParams interface**
    - Query parameters for inventory search
    - Include: warehouseId, productId, categoryId
    - Include: lowStock, outOfStock, includeInactive
    - Include: sort, pagination

### Type Structure Diagram

```
Inventory Types Hierarchy
│
├── Enums
│   ├── StockMovementType (PURCHASE, SALE, ADJUSTMENT, TRANSFER, RETURN, DAMAGE)
│   ├── StockMovementStatus (PENDING, COMPLETED, CANCELLED)
│   ├── AdjustmentReason (DAMAGE, THEFT, EXPIRED, RECOUNT, ERROR, OTHER)
│   └── InventoryValuationMethod (FIFO, LIFO, AVERAGE, STANDARD)
│
├── Location Entities
│   ├── Warehouse
│   └── WarehouseLocation
│
├── Stock Entities
│   ├── StockLevel
│   ├── StockMovement
│   ├── StockAdjustment
│   ├── StockTransfer
│   ├── StockCount
│   ├── LowStockAlert
│   └── InventoryValue
│
└── API Interfaces
    ├── StockMovementCreateRequest
    ├── StockAdjustmentCreateRequest
    ├── StockTransferCreateRequest
    └── InventorySearchParams
```

### Type Relationships

| Type | Related Types | Relationship |
|------|---------------|--------------|
| StockLevel | Product, Warehouse | Many stock levels per product/warehouse |
| StockMovement | Product, Warehouse | Tracks all stock transactions |
| StockTransfer | Warehouse, StockMovement | Multi-item warehouse transfer |
| StockAdjustment | Product, Warehouse | Corrects stock discrepancies |
| LowStockAlert | Product, Warehouse | Triggered by threshold |

### Expected Outcome
- Complete type definitions for inventory domain
- Multi-warehouse support
- Stock movement tracking types
- Inventory adjustment types
- Valuation and reporting types

### Verification Checklist
- [ ] `inventory.types.ts` file created
- [ ] All enums defined
- [ ] Warehouse types complete
- [ ] Stock tracking types created
- [ ] Movement and adjustment types defined
- [ ] API request interfaces complete
- [ ] Types exported
- [ ] No TypeScript errors

---

## Task 63: Create Inventory Service

### Overview
Create a comprehensive inventory service that provides type-safe operations for stock management, warehouse operations, stock movements, transfers, and adjustments. The service integrates with multi-warehouse inventory tracking.

### Dependencies
- Task 62: Create Inventory Types
- Task 59: Product Types
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create inventory service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `inventory.service.ts`
   - Import inventory types and API utilities

2. **Import required dependencies**
   - Import all inventory types
   - Import Product types
   - Import APIResponse, PaginatedResponse
   - Import apiClient and error utilities

3. **Define API endpoint constants**
   - Create constant: `INVENTORY_ENDPOINT = '/api/inventory/'`
   - Create constants for movements, adjustments, transfers
   - Create constants for reports and alerts

4. **Create getStockLevels function**
   - Signature: `(params?: InventorySearchParams) => Promise<PaginatedResponse<StockLevel>>`
   - Accepts optional filter parameters
   - Makes GET request to `/api/inventory/stock-levels/`
   - Returns stock levels across warehouses
   - Supports filtering by product, warehouse, low stock

5. **Create getStockLevelByProduct function**
   - Signature: `(productId: string, warehouseId?: string) => Promise<APIResponse<StockLevel[]>>`
   - Accepts product ID and optional warehouse filter
   - Makes GET request to `/api/inventory/stock-levels/product/{productId}/`
   - Returns stock across all or specific warehouse
   - Shows available, reserved, incoming quantities

6. **Create getStockLevelByWarehouse function**
   - Signature: `(warehouseId: string, categoryId?: string) => Promise<PaginatedResponse<StockLevel>>`
   - Accepts warehouse ID and optional category
   - Makes GET request to `/api/inventory/stock-levels/warehouse/{warehouseId}/`
   - Returns all products in warehouse
   - Useful for warehouse audits

7. **Create getStockMovements function**
   - Signature: `(params?: { productId?: string; warehouseId?: string; movementType?: StockMovementType; startDate?: string; endDate?: string }) => Promise<PaginatedResponse<StockMovement>>`
   - Accepts optional filter parameters
   - Makes GET request to `/api/inventory/movements/`
   - Returns paginated movement history
   - Supports date range filtering

8. **Create createStockMovement function**
   - Signature: `(data: StockMovementCreateRequest) => Promise<APIResponse<StockMovement>>`
   - Accepts movement creation data
   - Makes POST request to `/api/inventory/movements/`
   - Creates movement record and updates stock
   - Returns created movement with updated balances

9. **Create getStockAdjustments function**
   - Signature: `(params?: { warehouseId?: string; startDate?: string; endDate?: string }) => Promise<PaginatedResponse<StockAdjustment>>`
   - Accepts optional filters
   - Makes GET request to `/api/inventory/adjustments/`
   - Returns adjustment history
   - Used for audit reporting

10. **Create createStockAdjustment function**
    - Signature: `(data: StockAdjustmentCreateRequest) => Promise<APIResponse<StockAdjustment>>`
    - Accepts adjustment data
    - Requires reason and authorization
    - Makes POST request to `/api/inventory/adjustments/`
    - Updates stock level immediately
    - Creates audit trail

11. **Create getStockTransfers function**
    - Signature: `(params?: { sourceWarehouseId?: string; destinationWarehouseId?: string; status?: StockMovementStatus }) => Promise<PaginatedResponse<StockTransfer>>`
    - Accepts optional filters
    - Makes GET request to `/api/inventory/transfers/`
    - Returns transfer requests
    - Supports status filtering

12. **Create getStockTransferById function**
    - Signature: `(id: string) => Promise<APIResponse<StockTransfer>>`
    - Accepts transfer ID
    - Makes GET request to `/api/inventory/transfers/{id}/`
    - Returns transfer details with items
    - Shows transfer status and dates

13. **Create createStockTransfer function**
    - Signature: `(data: StockTransferCreateRequest) => Promise<APIResponse<StockTransfer>>`
    - Accepts transfer request data
    - Makes POST request to `/api/inventory/transfers/`
    - Creates transfer in PENDING status
    - Returns transfer with number

14. **Create approveStockTransfer function**
    - Signature: `(id: string, notes?: string) => Promise<APIResponse<StockTransfer>>`
    - Accepts transfer ID
    - Makes POST request to `/api/inventory/transfers/{id}/approve/`
    - Changes status to APPROVED
    - Reserves stock at source

15. **Create completeStockTransfer function**
    - Signature: `(id: string, receivedItems: { productId: string; variantId?: string; quantityReceived: number }[]) => Promise<APIResponse<StockTransfer>>`
    - Accepts transfer ID and received quantities
    - Makes POST request to `/api/inventory/transfers/{id}/complete/`
    - Moves stock between warehouses
    - Handles quantity discrepancies

16. **Create cancelStockTransfer function**
    - Signature: `(id: string, reason: string) => Promise<APIResponse<StockTransfer>>`
    - Accepts transfer ID and cancellation reason
    - Makes POST request to `/api/inventory/transfers/{id}/cancel/`
    - Changes status to CANCELLED
    - Releases reserved stock

17. **Create performStockCount function**
    - Signature: `(data: { warehouseId: string; countType: string; items: { productId: string; variantId?: string; countedQuantity: number }[] }) => Promise<APIResponse<StockCount>>`
    - Accepts count data
    - Makes POST request to `/api/inventory/stock-counts/`
    - Creates count record
    - Identifies discrepancies
    - Can auto-adjust if configured

18. **Create getStockCountById function**
    - Signature: `(id: string) => Promise<APIResponse<StockCount>>`
    - Accepts count ID
    - Makes GET request to `/api/inventory/stock-counts/{id}/`
    - Returns count details with variances

19. **Create getLowStockAlerts function**
    - Signature: `(warehouseId?: string) => Promise<APIResponse<LowStockAlert[]>>`
    - Accepts optional warehouse filter
    - Makes GET request to `/api/inventory/low-stock-alerts/`
    - Returns active alerts
    - Shows products below threshold

20. **Create acknowledgeAlert function**
    - Signature: `(alertId: string) => Promise<APIResponse<void>>`
    - Accepts alert ID
    - Makes POST request to `/api/inventory/low-stock-alerts/{alertId}/acknowledge/`
    - Marks alert as acknowledged
    - Updates alert status

21. **Create getInventoryValue function**
    - Signature: `(warehouseId?: string, date?: string) => Promise<APIResponse<InventoryValue>>`
    - Accepts optional warehouse and date
    - Makes GET request to `/api/inventory/valuation/`
    - Returns inventory value calculation
    - Based on configured valuation method

22. **Create reserveStock function**
    - Signature: `(productId: string, variantId: string | undefined, quantity: number, warehouseId: string, referenceType: string, referenceId: string) => Promise<APIResponse<void>>`
    - Accepts product, quantity, and reference info
    - Makes POST request to `/api/inventory/reserve/`
    - Reduces available quantity
    - Increases reserved quantity
    - Used for order fulfillment

23. **Create releaseStock function**
    - Signature: `(referenceType: string, referenceId: string) => Promise<APIResponse<void>>`
    - Accepts reference to reservation
    - Makes POST request to `/api/inventory/release/`
    - Returns reserved stock to available
    - Used when order cancelled

24. **Create export default inventoryService object**
    - Bundle all functions in service object
    - Provides complete inventory API

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getStockLevels | GET | /api/inventory/stock-levels/ | List stock levels |
| getStockLevelByProduct | GET | /api/inventory/stock-levels/product/{id}/ | Product stock |
| getStockLevelByWarehouse | GET | /api/inventory/stock-levels/warehouse/{id}/ | Warehouse stock |
| getStockMovements | GET | /api/inventory/movements/ | Movement history |
| createStockMovement | POST | /api/inventory/movements/ | Record movement |
| getStockAdjustments | GET | /api/inventory/adjustments/ | Adjustment history |
| createStockAdjustment | POST | /api/inventory/adjustments/ | Adjust stock |
| getStockTransfers | GET | /api/inventory/transfers/ | List transfers |
| getStockTransferById | GET | /api/inventory/transfers/{id}/ | Transfer details |
| createStockTransfer | POST | /api/inventory/transfers/ | Request transfer |
| approveStockTransfer | POST | /api/inventory/transfers/{id}/approve/ | Approve transfer |
| completeStockTransfer | POST | /api/inventory/transfers/{id}/complete/ | Finish transfer |
| cancelStockTransfer | POST | /api/inventory/transfers/{id}/cancel/ | Cancel transfer |
| performStockCount | POST | /api/inventory/stock-counts/ | Physical count |
| getStockCountById | GET | /api/inventory/stock-counts/{id}/ | Count details |
| getLowStockAlerts | GET | /api/inventory/low-stock-alerts/ | Active alerts |
| acknowledgeAlert | POST | /api/inventory/low-stock-alerts/{id}/acknowledge/ | Acknowledge alert |
| getInventoryValue | GET | /api/inventory/valuation/ | Inventory value |
| reserveStock | POST | /api/inventory/reserve/ | Reserve for order |
| releaseStock | POST | /api/inventory/release/ | Release reservation |

### Stock Movement Workflow

| Stage | Function | Effect |
|-------|----------|--------|
| 1. Purchase | createStockMovement (PURCHASE) | Increase onHand |
| 2. Reserve | reserveStock | Decrease available, increase reserved |
| 3. Sale | createStockMovement (SALE) | Decrease onHand and reserved |
| 4. Cancel | releaseStock | Increase available, decrease reserved |
| 5. Adjust | createStockAdjustment | Correct discrepancy |

### Expected Outcome
- Complete inventory service with stock management
- Multi-warehouse operations support
- Stock transfer workflow
- Adjustment and count capabilities
- Stock reservation system

### Verification Checklist
- [ ] `inventory.service.ts` file created
- [ ] Stock level functions implemented
- [ ] Movement tracking functions complete
- [ ] Adjustment functions implemented
- [ ] Transfer workflow functions complete
- [ ] Alert management functions added
- [ ] Valuation function implemented
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 64: Create Warehouse Service

### Overview
Create a warehouse service for managing warehouse locations, configurations, and operational settings. The service provides CRUD operations for warehouses and warehouse location management.

### Dependencies
- Task 62: Create Inventory Types (Warehouse interface)
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create warehouse service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `warehouse.service.ts`
   - Import Warehouse types and API utilities

2. **Import required dependencies**
   - Import Warehouse, WarehouseLocation types
   - Import APIResponse, PaginatedResponse
   - Import apiClient
   - Import error handling utilities

3. **Define API endpoint constants**
   - Create constant: `WAREHOUSE_ENDPOINT = '/api/warehouses/'`
   - Create constant for locations: `/api/warehouses/locations/`

4. **Define WarehouseCreateRequest interface**
   - Include: code, name, description
   - Include: address (street, city, state, postal, country)
   - Include: contactPhone, contactEmail
   - Include: capacity, isPrimary, isActive

5. **Define WarehouseUpdateRequest interface**
   - Partial version of create request
   - All fields optional

6. **Define LocationCreateRequest interface**
   - Include: warehouseId, zone, aisle, rack, shelf, bin
   - Include: capacity, isActive
   - Auto-generate locationCode from components

7. **Create getWarehouses function**
   - Signature: `(includeInactive?: boolean) => Promise<APIResponse<Warehouse[]>>`
   - Accepts optional inactive flag
   - Makes GET request to `/api/warehouses/`
   - Returns all warehouses
   - Ordered by isPrimary, name

8. **Create getWarehouseById function**
   - Signature: `(id: string) => Promise<APIResponse<Warehouse>>`
   - Accepts warehouse ID
   - Makes GET request to `/api/warehouses/{id}/`
   - Returns warehouse with full details

9. **Create getWarehouseByCode function**
   - Signature: `(code: string) => Promise<APIResponse<Warehouse>>`
   - Accepts warehouse code
   - Makes GET request to `/api/warehouses/by-code/{code}/`
   - Returns matching warehouse

10. **Create createWarehouse function**
    - Signature: `(data: WarehouseCreateRequest) => Promise<APIResponse<Warehouse>>`
    - Accepts warehouse creation data
    - Makes POST request to `/api/warehouses/`
    - Returns created warehouse
    - Auto-sets isPrimary if first warehouse

11. **Create updateWarehouse function**
    - Signature: `(id: string, data: WarehouseUpdateRequest) => Promise<APIResponse<Warehouse>>`
    - Accepts warehouse ID and update data
    - Makes PATCH request to `/api/warehouses/{id}/`
    - Returns updated warehouse
    - Prevents removing isPrimary without replacement

12. **Create deleteWarehouse function**
    - Signature: `(id: string) => Promise<APIResponse<void>>`
    - Accepts warehouse ID
    - Makes DELETE request to `/api/warehouses/{id}/`
    - Validates no stock exists
    - Prevents deletion of primary warehouse

13. **Create setPrimaryWarehouse function**
    - Signature: `(id: string) => Promise<APIResponse<Warehouse>>`
    - Accepts warehouse ID
    - Makes POST request to `/api/warehouses/{id}/set-primary/`
    - Updates isPrimary flags
    - Ensures only one primary

14. **Create getWarehouseLocations function**
    - Signature: `(warehouseId: string) => Promise<APIResponse<WarehouseLocation[]>>`
    - Accepts warehouse ID
    - Makes GET request to `/api/warehouses/{id}/locations/`
    - Returns all locations in warehouse
    - Ordered by locationCode

15. **Create createWarehouseLocation function**
    - Signature: `(data: LocationCreateRequest) => Promise<APIResponse<WarehouseLocation>>`
    - Accepts location creation data
    - Makes POST request to `/api/warehouses/locations/`
    - Returns created location
    - Auto-generates locationCode

16. **Create updateWarehouseLocation function**
    - Signature: `(id: string, data: Partial<LocationCreateRequest>) => Promise<APIResponse<WarehouseLocation>>`
    - Accepts location ID and update data
    - Makes PATCH request to `/api/warehouses/locations/{id}/`
    - Returns updated location

17. **Create deleteWarehouseLocation function**
    - Signature: `(id: string) => Promise<APIResponse<void>>`
    - Accepts location ID
    - Makes DELETE request to `/api/warehouses/locations/{id}/`
    - Validates no stock at location

18. **Create getWarehouseUtilization function**
    - Signature: `(id: string) => Promise<APIResponse<{ capacity: number; utilized: number; percentage: number }>>`
    - Accepts warehouse ID
    - Makes GET request to `/api/warehouses/{id}/utilization/`
    - Returns capacity usage statistics

19. **Create export default warehouseService object**
    - Bundle all functions in service object
    - Provides warehouse management API

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getWarehouses | GET | /api/warehouses/ | List warehouses |
| getWarehouseById | GET | /api/warehouses/{id}/ | Get single warehouse |
| getWarehouseByCode | GET | /api/warehouses/by-code/{code}/ | Get by code |
| createWarehouse | POST | /api/warehouses/ | Create warehouse |
| updateWarehouse | PATCH | /api/warehouses/{id}/ | Update warehouse |
| deleteWarehouse | DELETE | /api/warehouses/{id}/ | Delete warehouse |
| setPrimaryWarehouse | POST | /api/warehouses/{id}/set-primary/ | Set as primary |
| getWarehouseLocations | GET | /api/warehouses/{id}/locations/ | List locations |
| createWarehouseLocation | POST | /api/warehouses/locations/ | Create location |
| updateWarehouseLocation | PATCH | /api/warehouses/locations/{id}/ | Update location |
| deleteWarehouseLocation | DELETE | /api/warehouses/locations/{id}/ | Delete location |
| getWarehouseUtilization | GET | /api/warehouses/{id}/utilization/ | Usage stats |

### Warehouse Management Rules

| Rule | Validation | Effect |
|------|------------|--------|
| Primary warehouse | Only one allowed | Auto-unset others |
| Delete with stock | Not permitted | Must transfer stock first |
| Location code | Auto-generated | Zone-Aisle-Rack-Shelf-Bin |
| First warehouse | Auto-set primary | Convenience |

### Expected Outcome
- Complete warehouse management service
- Warehouse CRUD operations
- Location management within warehouses
- Primary warehouse designation
- Utilization tracking

### Verification Checklist
- [ ] `warehouse.service.ts` file created
- [ ] Warehouse CRUD functions implemented
- [ ] Location management functions complete
- [ ] Primary warehouse function added
- [ ] Utilization function implemented
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 65: Create Customer Types

### Overview
Define comprehensive TypeScript types for customer management including customer entities, addresses, contacts, payment methods, transaction history, and loyalty programs. These types support CRM and sales operations.

### Dependencies
- Task 08: Base API types
- Frontend TypeScript configuration

### Instructions

1. **Create customer types file**
   - Navigate to `frontend/src/types/` directory
   - Create new file named `customer.types.ts`
   - Add file header and exports overview

2. **Define CustomerType enum**
   - Create enum for customer classification
   - Include: INDIVIDUAL, BUSINESS, WHOLESALER, DISTRIBUTOR
   - Affects pricing, terms, and credit

3. **Define CustomerStatus enum**
   - Create enum for customer lifecycle
   - Include: ACTIVE, INACTIVE, SUSPENDED, BLOCKED
   - Controls ordering permissions

4. **Define PaymentTerms enum**
   - Create enum for payment conditions
   - Include: NET_0, NET_15, NET_30, NET_45, NET_60, COD, PREPAID
   - Used for credit customers

5. **Define CustomerAddress interface**
   - Represents customer address
   - Include: id, customerId, addressType (BILLING, SHIPPING, BOTH)
   - Include: street, street2, city, state, postalCode, country
   - Include: isDefault, label, notes

6. **Define CustomerContact interface**
   - Represents contact person
   - Include: id, customerId, firstName, lastName, title
   - Include: email, phone, mobile, isPrimary

7. **Define CustomerPaymentMethod interface**
   - Represents saved payment method
   - Include: id, customerId, type (CASH, CARD, BANK_TRANSFER)
   - Include: cardLastFour, cardBrand, expiryMonth, expiryYear
   - Include: bankName, accountLastFour, isDefault

8. **Define CustomerCreditLimit interface**
   - Represents credit configuration
   - Include: creditLimit, currentBalance, availableCredit
   - Include: paymentTerms, overdueDays, lastPaymentDate

9. **Define CustomerLoyalty interface**
   - Represents loyalty program participation
   - Include: id, customerId, tierLevel, points, lifetimeValue
   - Include: memberSince, lastPurchaseDate, purchaseCount
   - Include: rewardsEarned, rewardsRedeemed

10. **Define CustomerNote interface**
    - Represents customer notes/comments
    - Include: id, customerId, note, category
    - Include: createdBy, createdAt, isPrivate

11. **Define Customer interface (main entity)**
    - Core customer entity
    - Include: id, tenantId, customerNumber, customerType, status
    - Include: firstName, lastName, companyName, displayName
    - Include: email, phone, mobile, taxId
    - Include: addresses, contacts, paymentMethods
    - Include: creditLimit, loyalty, priceTierId
    - Include: tags, customFields, preferences
    - Include: totalOrders, totalSpent, averageOrderValue
    - Include: lastOrderDate, isActive, createdAt, updatedAt

12. **Define CustomerGroup interface**
    - Represents customer segmentation
    - Include: id, name, description, criteria
    - Include: discountPercentage, priceTierId
    - Include: customerCount, isActive

13. **Define CustomerTransaction interface**
    - Represents transaction history entry
    - Include: id, customerId, transactionType (SALE, PAYMENT, REFUND, CREDIT)
    - Include: amount, balance, referenceType, referenceId
    - Include: transactionDate, notes

14. **Define CustomerCreateRequest interface**
    - API request for creating customer
    - Include: all required customer fields
    - Include: optional addresses and contacts
    - Include: credit and loyalty setup

15. **Define CustomerUpdateRequest interface**
    - API request for updating customer
    - Partial version for flexible updates
    - Include: address and contact modifications

16. **Define CustomerSearchParams interface**
    - Query parameters for customer search
    - Include: query, customerType, status, groupId
    - Include: creditStatus (GOOD, OVERDUE, EXCEEDED)
    - Include: tags, orderDateRange, sort, pagination

17. **Define CustomerStatement interface**
    - Represents customer account statement
    - Include: customerId, periodStart, periodEnd
    - Include: openingBalance, closingBalance
    - Include: transactions, totalSales, totalPayments
    - Include: outstandingAmount, overdueAmount

### Type Structure Diagram

```
Customer Types Hierarchy
│
├── Enums
│   ├── CustomerType (INDIVIDUAL, BUSINESS, WHOLESALER, DISTRIBUTOR)
│   ├── CustomerStatus (ACTIVE, INACTIVE, SUSPENDED, BLOCKED)
│   └── PaymentTerms (NET_0, NET_15, NET_30, NET_45, NET_60, COD, PREPAID)
│
├── Supporting Interfaces
│   ├── CustomerAddress
│   ├── CustomerContact
│   ├── CustomerPaymentMethod
│   ├── CustomerCreditLimit
│   ├── CustomerLoyalty
│   ├── CustomerNote
│   ├── CustomerGroup
│   └── CustomerTransaction
│
├── Main Entity
│   └── Customer
│
└── API Interfaces
    ├── CustomerCreateRequest
    ├── CustomerUpdateRequest
    ├── CustomerSearchParams
    └── CustomerStatement
```

### Type Relationships

| Type | Related Types | Relationship |
|------|---------------|--------------|
| Customer | CustomerAddress | One to many addresses |
| Customer | CustomerContact | One to many contacts |
| Customer | CustomerPaymentMethod | One to many payment methods |
| Customer | CustomerCreditLimit | One to one credit config |
| Customer | CustomerLoyalty | One to one loyalty record |
| Customer | CustomerGroup | Many to many membership |
| Customer | CustomerTransaction | One to many transactions |

### Expected Outcome
- Complete type definitions for customer domain
- Support for B2C and B2B customers
- Multi-address and multi-contact support
- Credit management types
- Loyalty program types
- Transaction history types

### Verification Checklist
- [ ] `customer.types.ts` file created
- [ ] All enums defined
- [ ] Supporting interfaces complete
- [ ] Main Customer interface created
- [ ] API request interfaces defined
- [ ] Types exported
- [ ] No TypeScript errors

---

## Task 66: Create Customer Service

### Overview
Create a comprehensive customer service that provides type-safe CRUD operations for customers, addresses, contacts, credit management, and transaction history. The service supports both B2C and B2B customer management.

### Dependencies
- Task 65: Create Customer Types
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create customer service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `customer.service.ts`
   - Import Customer types and API utilities

2. **Import required dependencies**
   - Import all customer types
   - Import APIResponse, PaginatedResponse
   - Import apiClient
   - Import error handling utilities

3. **Define API endpoint constants**
   - Create constant: `CUSTOMER_ENDPOINT = '/api/customers/'`
   - Create constants for addresses, contacts, transactions
   - Create constants for credit and loyalty endpoints

4. **Create getCustomers function**
   - Signature: `(params?: CustomerSearchParams) => Promise<PaginatedResponse<Customer>>`
   - Accepts optional search/filter parameters
   - Makes GET request to `/api/customers/`
   - Returns paginated customer list
   - Supports search by name, email, phone, customer number

5. **Create getCustomerById function**
   - Signature: `(id: string) => Promise<APIResponse<Customer>>`
   - Accepts customer ID
   - Makes GET request to `/api/customers/{id}/`
   - Returns single customer with full details
   - Includes addresses, contacts, credit info

6. **Create getCustomerByNumber function**
   - Signature: `(customerNumber: string) => Promise<APIResponse<Customer>>`
   - Accepts customer number
   - Makes GET request to `/api/customers/by-number/{customerNumber}/`
   - Returns customer matching number

7. **Create getCustomerByEmail function**
   - Signature: `(email: string) => Promise<APIResponse<Customer>>`
   - Accepts email address
   - Makes GET request to `/api/customers/by-email/{email}/`
   - Returns customer matching email
   - Used for duplicate checking

8. **Create createCustomer function**
   - Signature: `(data: CustomerCreateRequest) => Promise<APIResponse<Customer>>`
   - Accepts customer creation data
   - Validates required fields
   - Makes POST request to `/api/customers/`
   - Returns created customer with generated number
   - Auto-generates customer number if not provided

9. **Create updateCustomer function**
   - Signature: `(id: string, data: CustomerUpdateRequest) => Promise<APIResponse<Customer>>`
   - Accepts customer ID and update data
   - Makes PATCH request to `/api/customers/{id}/`
   - Returns updated customer
   - Supports partial updates

10. **Create deleteCustomer function**
    - Signature: `(id: string) => Promise<APIResponse<void>>`
    - Accepts customer ID
    - Makes DELETE request to `/api/customers/{id}/`
    - Soft delete (sets inactive)
    - Validates no outstanding balance

11. **Create getCustomerAddresses function**
    - Signature: `(customerId: string) => Promise<APIResponse<CustomerAddress[]>>`
    - Accepts customer ID
    - Makes GET request to `/api/customers/{id}/addresses/`
    - Returns all addresses for customer
    - Ordered by isDefault, addressType

12. **Create createCustomerAddress function**
    - Signature: `(customerId: string, data: Omit<CustomerAddress, 'id' | 'customerId'>) => Promise<APIResponse<CustomerAddress>>`
    - Accepts customer ID and address data
    - Makes POST request to `/api/customers/{id}/addresses/`
    - Returns created address
    - Auto-sets isDefault if first address

13. **Create updateCustomerAddress function**
    - Signature: `(customerId: string, addressId: string, data: Partial<CustomerAddress>) => Promise<APIResponse<CustomerAddress>>`
    - Accepts customer ID, address ID, and update data
    - Makes PATCH request to `/api/customers/{customerId}/addresses/{addressId}/`
    - Returns updated address

14. **Create deleteCustomerAddress function**
    - Signature: `(customerId: string, addressId: string) => Promise<APIResponse<void>>`
    - Accepts customer ID and address ID
    - Makes DELETE request to `/api/customers/{customerId}/addresses/{addressId}/`
    - Prevents deletion of default address without replacement

15. **Create setDefaultAddress function**
    - Signature: `(customerId: string, addressId: string, addressType: 'BILLING' | 'SHIPPING') => Promise<APIResponse<void>>`
    - Accepts customer ID, address ID, and type
    - Makes POST request to `/api/customers/{customerId}/addresses/{addressId}/set-default/`
    - Updates isDefault flags

16. **Create getCustomerContacts function**
    - Signature: `(customerId: string) => Promise<APIResponse<CustomerContact[]>>`
    - Accepts customer ID
    - Makes GET request to `/api/customers/{id}/contacts/`
    - Returns all contacts for customer

17. **Create createCustomerContact function**
    - Signature: `(customerId: string, data: Omit<CustomerContact, 'id' | 'customerId'>) => Promise<APIResponse<CustomerContact>>`
    - Accepts customer ID and contact data
    - Makes POST request to `/api/customers/{id}/contacts/`
    - Returns created contact

18. **Create updateCustomerContact function**
    - Signature: `(customerId: string, contactId: string, data: Partial<CustomerContact>) => Promise<APIResponse<CustomerContact>>`
    - Accepts customer ID, contact ID, and update data
    - Makes PATCH request to `/api/customers/{customerId}/contacts/{contactId}/`
    - Returns updated contact

19. **Create deleteCustomerContact function**
    - Signature: `(customerId: string, contactId: string) => Promise<APIResponse<void>>`
    - Accepts customer ID and contact ID
    - Makes DELETE request to `/api/customers/{customerId}/contacts/{contactId}/`

20. **Create getCustomerCreditInfo function**
    - Signature: `(customerId: string) => Promise<APIResponse<CustomerCreditLimit>>`
    - Accepts customer ID
    - Makes GET request to `/api/customers/{id}/credit/`
    - Returns credit limit and current balance

21. **Create updateCustomerCredit function**
    - Signature: `(customerId: string, data: Partial<CustomerCreditLimit>) => Promise<APIResponse<CustomerCreditLimit>>`
    - Accepts customer ID and credit data
    - Makes PATCH request to `/api/customers/{id}/credit/`
    - Returns updated credit configuration
    - Requires authorization for limit increases

22. **Create getCustomerTransactions function**
    - Signature: `(customerId: string, params?: { startDate?: string; endDate?: string; transactionType?: string }) => Promise<PaginatedResponse<CustomerTransaction>>`
    - Accepts customer ID and optional filters
    - Makes GET request to `/api/customers/{id}/transactions/`
    - Returns transaction history
    - Used for statement generation

23. **Create getCustomerStatement function**
    - Signature: `(customerId: string, startDate: string, endDate: string) => Promise<APIResponse<CustomerStatement>>`
    - Accepts customer ID and date range
    - Makes GET request to `/api/customers/{id}/statement/`
    - Returns formatted statement with transactions
    - Shows opening/closing balance

24. **Create recordCustomerPayment function**
    - Signature: `(customerId: string, data: { amount: number; paymentMethod: string; referenceId?: string; notes?: string }) => Promise<APIResponse<CustomerTransaction>>`
    - Accepts customer ID and payment details
    - Makes POST request to `/api/customers/{id}/payments/`
    - Reduces customer balance
    - Creates payment transaction record

25. **Create getCustomerLoyalty function**
    - Signature: `(customerId: string) => Promise<APIResponse<CustomerLoyalty>>`
    - Accepts customer ID
    - Makes GET request to `/api/customers/{id}/loyalty/`
    - Returns loyalty program details

26. **Create addLoyaltyPoints function**
    - Signature: `(customerId: string, points: number, referenceType: string, referenceId: string) => Promise<APIResponse<CustomerLoyalty>>`
    - Accepts customer ID, points, and reference
    - Makes POST request to `/api/customers/{id}/loyalty/add-points/`
    - Increases loyalty points
    - Updates tier if applicable

27. **Create redeemLoyaltyPoints function**
    - Signature: `(customerId: string, points: number, redemptionType: string) => Promise<APIResponse<CustomerLoyalty>>`
    - Accepts customer ID, points, and redemption type
    - Makes POST request to `/api/customers/{id}/loyalty/redeem-points/`
    - Decreases loyalty points
    - Returns updated loyalty info

28. **Create addCustomerNote function**
    - Signature: `(customerId: string, note: string, category?: string, isPrivate?: boolean) => Promise<APIResponse<CustomerNote>>`
    - Accepts customer ID and note details
    - Makes POST request to `/api/customers/{id}/notes/`
    - Creates customer note record

29. **Create getCustomerNotes function**
    - Signature: `(customerId: string) => Promise<APIResponse<CustomerNote[]>>`
    - Accepts customer ID
    - Makes GET request to `/api/customers/{id}/notes/`
    - Returns all notes for customer
    - Ordered by date descending

30. **Create export default customerService object**
    - Bundle all functions in service object
    - Provides complete customer API

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getCustomers | GET | /api/customers/ | List/search customers |
| getCustomerById | GET | /api/customers/{id}/ | Get single customer |
| getCustomerByNumber | GET | /api/customers/by-number/{number}/ | Find by number |
| getCustomerByEmail | GET | /api/customers/by-email/{email}/ | Find by email |
| createCustomer | POST | /api/customers/ | Create customer |
| updateCustomer | PATCH | /api/customers/{id}/ | Update customer |
| deleteCustomer | DELETE | /api/customers/{id}/ | Delete customer |
| getCustomerAddresses | GET | /api/customers/{id}/addresses/ | List addresses |
| createCustomerAddress | POST | /api/customers/{id}/addresses/ | Add address |
| updateCustomerAddress | PATCH | /api/customers/{id}/addresses/{addressId}/ | Update address |
| deleteCustomerAddress | DELETE | /api/customers/{id}/addresses/{addressId}/ | Remove address |
| setDefaultAddress | POST | /api/customers/{id}/addresses/{addressId}/set-default/ | Set default |
| getCustomerContacts | GET | /api/customers/{id}/contacts/ | List contacts |
| createCustomerContact | POST | /api/customers/{id}/contacts/ | Add contact |
| updateCustomerContact | PATCH | /api/customers/{id}/contacts/{contactId}/ | Update contact |
| deleteCustomerContact | DELETE | /api/customers/{id}/contacts/{contactId}/ | Remove contact |
| getCustomerCreditInfo | GET | /api/customers/{id}/credit/ | Get credit info |
| updateCustomerCredit | PATCH | /api/customers/{id}/credit/ | Update credit |
| getCustomerTransactions | GET | /api/customers/{id}/transactions/ | Transaction history |
| getCustomerStatement | GET | /api/customers/{id}/statement/ | Account statement |
| recordCustomerPayment | POST | /api/customers/{id}/payments/ | Record payment |
| getCustomerLoyalty | GET | /api/customers/{id}/loyalty/ | Loyalty details |
| addLoyaltyPoints | POST | /api/customers/{id}/loyalty/add-points/ | Add points |
| redeemLoyaltyPoints | POST | /api/customers/{id}/loyalty/redeem-points/ | Redeem points |
| addCustomerNote | POST | /api/customers/{id}/notes/ | Add note |
| getCustomerNotes | GET | /api/customers/{id}/notes/ | List notes |

### Customer Management Workflow

| Stage | Function | Purpose |
|-------|----------|---------|
| 1. Create | createCustomer | Register new customer |
| 2. Add Details | createCustomerAddress, createCustomerContact | Complete profile |
| 3. Configure Credit | updateCustomerCredit | Set payment terms |
| 4. Track Sales | getCustomerTransactions | Monitor purchases |
| 5. Manage Loyalty | addLoyaltyPoints, redeemLoyaltyPoints | Reward program |
| 6. Process Payments | recordCustomerPayment | Reduce balance |

### Expected Outcome
- Complete customer service with CRUD operations
- Multi-address and multi-contact support
- Credit management capabilities
- Transaction history tracking
- Loyalty program integration
- Customer statement generation

### Verification Checklist
- [ ] `customer.service.ts` file created
- [ ] Customer CRUD functions implemented
- [ ] Address management complete
- [ ] Contact management complete
- [ ] Credit functions implemented
- [ ] Transaction functions complete
- [ ] Loyalty functions added
- [ ] Service exported
- [ ] No TypeScript errors

---

## Task 67: Create Vendor Types

### Overview
Define comprehensive TypeScript types for vendor management including vendor entities, contacts, payment terms, purchase history, and performance tracking. These types support procurement and accounts payable operations.

### Dependencies
- Task 08: Base API types
- Frontend TypeScript configuration

### Instructions

1. **Create vendor types file**
   - Navigate to `frontend/src/types/` directory
   - Create new file named `vendor.types.ts`
   - Add file header and exports overview

2. **Define VendorType enum**
   - Create enum for vendor classification
   - Include: SUPPLIER, MANUFACTURER, DISTRIBUTOR, SERVICE_PROVIDER, CONTRACTOR
   - Affects procurement workflows

3. **Define VendorStatus enum**
   - Create enum for vendor lifecycle
   - Include: ACTIVE, INACTIVE, SUSPENDED, BLOCKED, PROSPECT
   - Controls purchasing permissions

4. **Define VendorCategory enum**
   - Create enum for vendor categorization
   - Include: RAW_MATERIALS, FINISHED_GOODS, SERVICES, EQUIPMENT, UTILITIES
   - Used for vendor classification

5. **Define VendorPaymentTerms enum**
   - Create enum for payment conditions
   - Include: NET_7, NET_15, NET_30, NET_45, NET_60, NET_90, COD, PREPAID
   - Standard payment terms

6. **Define VendorContact interface**
   - Represents vendor contact person
   - Include: id, vendorId, firstName, lastName, title
   - Include: email, phone, mobile, department
   - Include: isPrimary, isAccounts, isProcurement

7. **Define VendorAddress interface**
   - Represents vendor address
   - Include: id, vendorId, addressType (OFFICE, WAREHOUSE, BILLING)
   - Include: street, street2, city, state, postalCode, country
   - Include: isDefault, notes

8. **Define VendorBankAccount interface**
   - Represents vendor payment details
   - Include: id, vendorId, bankName, accountName
   - Include: accountNumber, routingNumber, swiftCode
   - Include: currency, isDefault

9. **Define VendorProduct interface**
   - Represents products supplied by vendor
   - Include: id, vendorId, productId, vendorSKU
   - Include: unitCost, moq (minimum order quantity), leadTimeDays
   - Include: isPreferred, lastPurchaseDate, lastPurchasePrice

10. **Define VendorPerformance interface**
    - Represents vendor metrics
    - Include: id, vendorId, period (month/quarter/year)
    - Include: totalOrders, totalValue, averageOrderValue
    - Include: onTimeDeliveryRate, qualityRating, responseTime
    - Include: defectRate, returnRate

11. **Define Vendor interface (main entity)**
    - Core vendor entity
    - Include: id, tenantId, vendorNumber, vendorType, status
    - Include: companyName, tradeName, legalName, taxId
    - Include: email, phone, fax, website
    - Include: category, paymentTerms, currency
    - Include: addresses, contacts, bankAccounts
    - Include: creditRating, totalPurchases, averageLeadTime
    - Include: tags, customFields, notes
    - Include: isActive, createdAt, updatedAt

12. **Define VendorGroup interface**
    - Represents vendor grouping
    - Include: id, name, description, criteria
    - Include: vendorCount, isActive

13. **Define PurchaseOrder interface**
    - Represents PO to vendor
    - Include: id, poNumber, vendorId, orderDate
    - Include: expectedDate, status (DRAFT, SENT, ACKNOWLEDGED, SHIPPED, RECEIVED, CANCELLED)
    - Include: items (productId, quantity, unitCost, total)
    - Include: subtotal, tax, shipping, total
    - Include: shippingAddress, billingAddress
    - Include: notes, terms, createdBy

14. **Define VendorInvoice interface**
    - Represents vendor bill/invoice
    - Include: id, invoiceNumber, vendorId, purchaseOrderId
    - Include: invoiceDate, dueDate, status
    - Include: items, subtotal, tax, total
    - Include: amountPaid, amountDue
    - Include: paymentDate, notes

15. **Define VendorPayment interface**
    - Represents payment to vendor
    - Include: id, vendorId, paymentNumber, paymentDate
    - Include: amount, paymentMethod, referenceNumber
    - Include: invoices (array of invoice allocations)
    - Include: notes, createdBy

16. **Define VendorCreateRequest interface**
    - API request for creating vendor
    - Include: all required vendor fields
    - Include: optional contacts and addresses
    - Include: payment terms setup

17. **Define VendorUpdateRequest interface**
    - API request for updating vendor
    - Partial version for flexible updates

18. **Define VendorSearchParams interface**
    - Query parameters for vendor search
    - Include: query, vendorType, status, category
    - Include: tags, performanceRating, sort, pagination

### Type Structure Diagram

```
Vendor Types Hierarchy
│
├── Enums
│   ├── VendorType (SUPPLIER, MANUFACTURER, DISTRIBUTOR, SERVICE_PROVIDER, CONTRACTOR)
│   ├── VendorStatus (ACTIVE, INACTIVE, SUSPENDED, BLOCKED, PROSPECT)
│   ├── VendorCategory (RAW_MATERIALS, FINISHED_GOODS, SERVICES, EQUIPMENT, UTILITIES)
│   └── VendorPaymentTerms (NET_7, NET_15, NET_30, NET_45, NET_60, NET_90, COD, PREPAID)
│
├── Supporting Interfaces
│   ├── VendorContact
│   ├── VendorAddress
│   ├── VendorBankAccount
│   ├── VendorProduct
│   ├── VendorPerformance
│   ├── VendorGroup
│   ├── PurchaseOrder
│   ├── VendorInvoice
│   └── VendorPayment
│
├── Main Entity
│   └── Vendor
│
└── API Interfaces
    ├── VendorCreateRequest
    ├── VendorUpdateRequest
    └── VendorSearchParams
```

### Type Relationships

| Type | Related Types | Relationship |
|------|---------------|--------------|
| Vendor | VendorContact | One to many contacts |
| Vendor | VendorAddress | One to many addresses |
| Vendor | VendorBankAccount | One to many accounts |
| Vendor | VendorProduct | Many to many (products) |
| Vendor | PurchaseOrder | One to many orders |
| Vendor | VendorInvoice | One to many invoices |
| Vendor | VendorPayment | One to many payments |
| Vendor | VendorPerformance | One to many metrics |

### Expected Outcome
- Complete type definitions for vendor domain
- Support for procurement operations
- Multi-contact and multi-address support
- Purchase order and invoice types
- Payment and performance tracking types

### Verification Checklist
- [ ] `vendor.types.ts` file created
- [ ] All enums defined
- [ ] Supporting interfaces complete
- [ ] Main Vendor interface created
- [ ] Purchase order types defined
- [ ] Invoice and payment types added
- [ ] API request interfaces defined
- [ ] Types exported
- [ ] No TypeScript errors

---

## Task 68: Create Vendor Service

### Overview
Create a comprehensive vendor service that provides type-safe CRUD operations for vendors, contacts, purchase orders, invoices, payments, and performance tracking. The service supports procurement and accounts payable workflows.

### Dependencies
- Task 67: Create Vendor Types
- Task 08: Base API types
- Task 16: API client configured

### Instructions

1. **Create vendor service file**
   - Navigate to `frontend/src/services/` directory
   - Create new file named `vendor.service.ts`
   - Import Vendor types and API utilities

2. **Import required dependencies**
   - Import all vendor types
   - Import APIResponse, PaginatedResponse
   - Import apiClient
   - Import error handling utilities

3. **Define API endpoint constants**
   - Create constant: `VENDOR_ENDPOINT = '/api/vendors/'`
   - Create constants for contacts, addresses, products
   - Create constants for POs, invoices, payments

4. **Create getVendors function**
   - Signature: `(params?: VendorSearchParams) => Promise<PaginatedResponse<Vendor>>`
   - Accepts optional search/filter parameters
   - Makes GET request to `/api/vendors/`
   - Returns paginated vendor list
   - Supports search by name, email, vendor number

5. **Create getVendorById function**
   - Signature: `(id: string) => Promise<APIResponse<Vendor>>`
   - Accepts vendor ID
   - Makes GET request to `/api/vendors/{id}/`
   - Returns single vendor with full details

6. **Create getVendorByNumber function**
   - Signature: `(vendorNumber: string) => Promise<APIResponse<Vendor>>`
   - Accepts vendor number
   - Makes GET request to `/api/vendors/by-number/{vendorNumber}/`
   - Returns vendor matching number

7. **Create createVendor function**
   - Signature: `(data: VendorCreateRequest) => Promise<APIResponse<Vendor>>`
   - Accepts vendor creation data
   - Makes POST request to `/api/vendors/`
   - Returns created vendor with generated number

8. **Create updateVendor function**
   - Signature: `(id: string, data: VendorUpdateRequest) => Promise<APIResponse<Vendor>>`
   - Accepts vendor ID and update data
   - Makes PATCH request to `/api/vendors/{id}/`
   - Returns updated vendor

9. **Create deleteVendor function**
   - Signature: `(id: string) => Promise<APIResponse<void>>`
   - Accepts vendor ID
   - Makes DELETE request to `/api/vendors/{id}/`
   - Soft delete (sets inactive)
   - Validates no outstanding POs or invoices

10. **Create getVendorContacts function**
    - Signature: `(vendorId: string) => Promise<APIResponse<VendorContact[]>>`
    - Accepts vendor ID
    - Makes GET request to `/api/vendors/{id}/contacts/`
    - Returns all contacts for vendor

11. **Create createVendorContact function**
    - Signature: `(vendorId: string, data: Omit<VendorContact, 'id' | 'vendorId'>) => Promise<APIResponse<VendorContact>>`
    - Accepts vendor ID and contact data
    - Makes POST request to `/api/vendors/{id}/contacts/`
    - Returns created contact

12. **Create updateVendorContact function**
    - Signature: `(vendorId: string, contactId: string, data: Partial<VendorContact>) => Promise<APIResponse<VendorContact>>`
    - Accepts vendor ID, contact ID, and update data
    - Makes PATCH request to `/api/vendors/{vendorId}/contacts/{contactId}/`
    - Returns updated contact

13. **Create deleteVendorContact function**
    - Signature: `(vendorId: string, contactId: string) => Promise<APIResponse<void>>`
    - Accepts vendor ID and contact ID
    - Makes DELETE request to `/api/vendors/{vendorId}/contacts/{contactId}/`

14. **Create getVendorProducts function**
    - Signature: `(vendorId: string) => Promise<PaginatedResponse<VendorProduct>>`
    - Accepts vendor ID
    - Makes GET request to `/api/vendors/{id}/products/`
    - Returns products supplied by vendor
    - Shows pricing and lead times

15. **Create addVendorProduct function**
    - Signature: `(vendorId: string, data: Omit<VendorProduct, 'id' | 'vendorId'>) => Promise<APIResponse<VendorProduct>>`
    - Accepts vendor ID and product mapping
    - Makes POST request to `/api/vendors/{id}/products/`
    - Links product to vendor with pricing

16. **Create updateVendorProduct function**
    - Signature: `(vendorId: string, vendorProductId: string, data: Partial<VendorProduct>) => Promise<APIResponse<VendorProduct>>`
    - Accepts vendor ID, vendor product ID, and updates
    - Makes PATCH request to `/api/vendors/{vendorId}/products/{vendorProductId}/`
    - Updates pricing or lead time

17. **Create removeVendorProduct function**
    - Signature: `(vendorId: string, vendorProductId: string) => Promise<APIResponse<void>>`
    - Accepts vendor ID and vendor product ID
    - Makes DELETE request to `/api/vendors/{vendorId}/products/{vendorProductId}/`
    - Unlinks product from vendor

18. **Create getPurchaseOrders function**
    - Signature: `(params?: { vendorId?: string; status?: string; startDate?: string; endDate?: string }) => Promise<PaginatedResponse<PurchaseOrder>>`
    - Accepts optional filters
    - Makes GET request to `/api/purchase-orders/`
    - Returns purchase orders

19. **Create getPurchaseOrderById function**
    - Signature: `(id: string) => Promise<APIResponse<PurchaseOrder>>`
    - Accepts PO ID
    - Makes GET request to `/api/purchase-orders/{id}/`
    - Returns PO with items

20. **Create createPurchaseOrder function**
    - Signature: `(data: Omit<PurchaseOrder, 'id' | 'poNumber' | 'createdAt'>) => Promise<APIResponse<PurchaseOrder>>`
    - Accepts PO creation data
    - Makes POST request to `/api/purchase-orders/`
    - Returns created PO with number

21. **Create updatePurchaseOrder function**
    - Signature: `(id: string, data: Partial<PurchaseOrder>) => Promise<APIResponse<PurchaseOrder>>`
    - Accepts PO ID and updates
    - Makes PATCH request to `/api/purchase-orders/{id}/`
    - Only updates if status is DRAFT

22. **Create receivePurchaseOrder function**
    - Signature: `(id: string, receivedItems: { itemId: string; quantityReceived: number }[]) => Promise<APIResponse<PurchaseOrder>>`
    - Accepts PO ID and received quantities
    - Makes POST request to `/api/purchase-orders/{id}/receive/`
    - Updates status to RECEIVED
    - Creates stock movements

23. **Create cancelPurchaseOrder function**
    - Signature: `(id: string, reason: string) => Promise<APIResponse<PurchaseOrder>>`
    - Accepts PO ID and cancellation reason
    - Makes POST request to `/api/purchase-orders/{id}/cancel/`
    - Changes status to CANCELLED

24. **Create getVendorInvoices function**
    - Signature: `(vendorId: string, params?: { status?: string; startDate?: string; endDate?: string }) => Promise<PaginatedResponse<VendorInvoice>>`
    - Accepts vendor ID and optional filters
    - Makes GET request to `/api/vendors/{id}/invoices/`
    - Returns vendor invoices

25. **Create createVendorInvoice function**
    - Signature: `(data: Omit<VendorInvoice, 'id' | 'createdAt'>) => Promise<APIResponse<VendorInvoice>>`
    - Accepts invoice data
    - Makes POST request to `/api/vendor-invoices/`
    - Returns created invoice

26. **Create recordVendorPayment function**
    - Signature: `(data: Omit<VendorPayment, 'id' | 'paymentNumber' | 'createdAt'>) => Promise<APIResponse<VendorPayment>>`
    - Accepts payment data
    - Makes POST request to `/api/vendor-payments/`
    - Creates payment record
    - Updates invoice balances

27. **Create getVendorPayments function**
    - Signature: `(vendorId: string, params?: { startDate?: string; endDate?: string }) => Promise<PaginatedResponse<VendorPayment>>`
    - Accepts vendor ID and date filters
    - Makes GET request to `/api/vendors/{id}/payments/`
    - Returns payment history

28. **Create getVendorPerformance function**
    - Signature: `(vendorId: string, period?: string) => Promise<APIResponse<VendorPerformance>>`
    - Accepts vendor ID and optional period
    - Makes GET request to `/api/vendors/{id}/performance/`
    - Returns performance metrics

29. **Create getVendorBalance function**
    - Signature: `(vendorId: string) => Promise<APIResponse<{ totalPayable: number; overdue: number; current: number }>>`
    - Accepts vendor ID
    - Makes GET request to `/api/vendors/{id}/balance/`
    - Returns outstanding amounts

30. **Create export default vendorService object**
    - Bundle all functions in service object
    - Provides complete vendor API

### Service Function Matrix

| Function | Method | Endpoint | Purpose |
|----------|--------|----------|---------|
| getVendors | GET | /api/vendors/ | List/search vendors |
| getVendorById | GET | /api/vendors/{id}/ | Get single vendor |
| getVendorByNumber | GET | /api/vendors/by-number/{number}/ | Find by number |
| createVendor | POST | /api/vendors/ | Create vendor |
| updateVendor | PATCH | /api/vendors/{id}/ | Update vendor |
| deleteVendor | DELETE | /api/vendors/{id}/ | Delete vendor |
| getVendorContacts | GET | /api/vendors/{id}/contacts/ | List contacts |
| createVendorContact | POST | /api/vendors/{id}/contacts/ | Add contact |
| updateVendorContact | PATCH | /api/vendors/{id}/contacts/{contactId}/ | Update contact |
| deleteVendorContact | DELETE | /api/vendors/{id}/contacts/{contactId}/ | Remove contact |
| getVendorProducts | GET | /api/vendors/{id}/products/ | List products |
| addVendorProduct | POST | /api/vendors/{id}/products/ | Link product |
| updateVendorProduct | PATCH | /api/vendors/{id}/products/{productId}/ | Update pricing |
| removeVendorProduct | DELETE | /api/vendors/{id}/products/{productId}/ | Unlink product |
| getPurchaseOrders | GET | /api/purchase-orders/ | List POs |
| getPurchaseOrderById | GET | /api/purchase-orders/{id}/ | Get PO details |
| createPurchaseOrder | POST | /api/purchase-orders/ | Create PO |
| updatePurchaseOrder | PATCH | /api/purchase-orders/{id}/ | Update PO |
| receivePurchaseOrder | POST | /api/purchase-orders/{id}/receive/ | Receive goods |
| cancelPurchaseOrder | POST | /api/purchase-orders/{id}/cancel/ | Cancel PO |
| getVendorInvoices | GET | /api/vendors/{id}/invoices/ | List invoices |
| createVendorInvoice | POST | /api/vendor-invoices/ | Create invoice |
| recordVendorPayment | POST | /api/vendor-payments/ | Record payment |
| getVendorPayments | GET | /api/vendors/{id}/payments/ | Payment history |
| getVendorPerformance | GET | /api/vendors/{id}/performance/ | Performance metrics |
| getVendorBalance | GET | /api/vendors/{id}/balance/ | Outstanding balance |

### Purchase Workflow

| Stage | Function | Purpose |
|-------|----------|---------|
| 1. Create | createPurchaseOrder | Initiate purchase |
| 2. Send | Send PO to vendor | Email or print |
| 3. Receive | receivePurchaseOrder | Accept goods |
| 4. Invoice | createVendorInvoice | Vendor bill |
| 5. Pay | recordVendorPayment | Settle invoice |
| 6. Track | getVendorPerformance | Monitor quality |

### Expected Outcome
- Complete vendor service with CRUD operations
- Contact and address management
- Product-vendor mapping with pricing
- Purchase order management
- Invoice and payment tracking
- Performance metrics

### Verification Checklist
- [ ] `vendor.service.ts` file created
- [ ] Vendor CRUD functions implemented
- [ ] Contact management complete
- [ ] Product mapping functions added
- [ ] Purchase order functions complete
- [ ] Invoice functions implemented
- [ ] Payment functions added
- [ ] Performance tracking added
- [ ] Service exported
- [ ] No TypeScript errors

---

## Summary

This document covered the creation of types and services for Product, Inventory, Customer, and Vendor modules. These services provide the foundation for core ERP operations including catalog management, stock control, CRM, and procurement.

### Completed Tasks
- Task 59: Product Types ✓
- Task 60: Product Service ✓
- Task 61: Category Service ✓
- Task 62: Inventory Types ✓
- Task 63: Inventory Service ✓
- Task 64: Warehouse Service ✓
- Task 65: Customer Types ✓
- Task 66: Customer Service ✓
- Task 67: Vendor Types ✓
- Task 68: Vendor Service ✓

### Next Steps
Continue to [02_Tasks-69-78_Sales-HR-Reports-Settings.md](02_Tasks-69-78_Sales-HR-Reports-Settings.md) for Sales, HR, Reports, and Settings API services.
