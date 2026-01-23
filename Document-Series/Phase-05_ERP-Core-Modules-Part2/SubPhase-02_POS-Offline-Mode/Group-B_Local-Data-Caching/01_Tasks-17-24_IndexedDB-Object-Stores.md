# Tasks 17-24: IndexedDB Object Stores

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 02 - POS Offline Mode  
> **Group:** B - Local Data Caching  
> **Document:** 01 of 03  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [../Group-A_Offline-Data-Architecture/](../Group-A_Offline-Data-Architecture/)
- **→ Next Document:** [02_Tasks-25-30_Versioning-Cache-Service.md](02_Tasks-25-30_Versioning-Cache-Service.md)

---

## Document Overview

This document covers the creation of IndexedDB service layer and all object stores required for offline POS functionality. IndexedDB provides structured client-side storage for products, customers, transactions, and settings.

### Tasks in This Document
| Task # | Task Name | Complexity |
|--------|-----------|------------|
| 17 | Create IndexedDB Service | High |
| 18 | Define Database Schema | Medium |
| 19 | Create Products Object Store | Medium |
| 20 | Add Product Indexes | Medium |
| 21 | Create Categories Object Store | Medium |
| 22 | Create Customers Object Store | Medium |
| 23 | Create Settings Object Store | Medium |
| 24 | Create Transactions Object Store | Medium |

---

## Task 17: Create IndexedDB Service

### Overview
Create a TypeScript service class that wraps IndexedDB operations, providing a clean API for database management, transactions, and CRUD operations.

### Dependencies
- None (foundational task)

### Instructions

1. **Create IndexedDB service file**
   - Create `frontend/lib/offline/indexeddb.ts` file
   - Set up TypeScript interfaces for type safety

2. **Define database configuration constants**
   - Database name: `lcc_pos_cache`
   - Database version: `1`
   - Object store names as constants

3. **Create IDBService class structure**
   - Private property for IDBDatabase instance
   - Constructor for initialization
   - Method to open database connection
   - Method to close database connection

4. **Implement database opening method**
   - Use `indexedDB.open()` with database name and version
   - Handle `onupgradeneeded` event for schema creation
   - Handle `onsuccess` event for connection established
   - Handle `onerror` and `onblocked` events
   - Return Promise that resolves with database instance

5. **Create transaction helper methods**
   - Method to start read-only transaction
   - Method to start read-write transaction
   - Accept store names and transaction mode parameters
   - Return IDBTransaction instance

6. **Implement CRUD operation wrappers**
   - `get(storeName, key)` - retrieve single record
   - `getAll(storeName)` - retrieve all records
   - `put(storeName, value)` - insert or update record
   - `add(storeName, value)` - insert new record only
   - `delete(storeName, key)` - delete record by key
   - `clear(storeName)` - delete all records in store

7. **Add index query methods**
   - `getByIndex(storeName, indexName, value)` - query by index
   - `getAllByIndex(storeName, indexName, value)` - get multiple by index
   - Support for key ranges (greater than, less than, between)

8. **Implement cursor-based iteration**
   - `openCursor(storeName, direction)` - open cursor for iteration
   - Support forward and backward direction
   - Support filtering during iteration

9. **Add bulk operations**
   - `bulkPut(storeName, values[])` - insert/update multiple records
   - `bulkDelete(storeName, keys[])` - delete multiple records
   - Use single transaction for performance

10. **Create error handling utilities**
    - Wrap all operations in try-catch blocks
    - Convert IDBRequest errors to Promise rejections
    - Log errors for debugging
    - Provide meaningful error messages

11. **Add connection state management**
    - Track connection status (closed, opening, open)
    - Auto-reconnect on connection loss
    - Singleton pattern to reuse connection

12. **Export service instance**
    - Create and export singleton instance
    - Export TypeScript types and interfaces

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        └── indexeddb.ts       # IndexedDB service wrapper
```

### Verification Checklist
- [ ] IndexedDB service file created in `frontend/lib/offline/`
- [ ] IDBService class implements all CRUD methods
- [ ] Transaction helpers support read-only and read-write modes
- [ ] Index query methods are implemented
- [ ] Bulk operations use single transactions
- [ ] Error handling wraps all database operations
- [ ] Connection state is properly managed
- [ ] Singleton pattern is implemented
- [ ] TypeScript interfaces are defined
- [ ] Service instance is exported

---

## Task 18: Define Database Schema

### Overview
Define the complete database schema with all object stores, key paths, and indexes required for offline POS operations.

### Dependencies
- Task 17: Create IndexedDB Service

### Instructions

1. **Create schema definition file**
   - Create `frontend/lib/offline/schema.ts` file
   - Define TypeScript interfaces for all entities

2. **Define database version constant**
   - Export `DATABASE_VERSION = 1`
   - Document schema changes for future versions

3. **Define object store names enum**
   - PRODUCTS
   - VARIANTS
   - CATEGORIES
   - CUSTOMERS
   - TRANSACTIONS
   - SYNC_META

4. **Create Product entity interface**
   - Include: id, name, description, barcode, sku, category_id
   - Include: price, cost, tax_rate, stock_quantity
   - Include: images[], status, updated_at, created_at
   - All timestamps as ISO strings

5. **Create ProductVariant entity interface**
   - Include: id, product_id, name, barcode, sku
   - Include: price_adjustment, stock_quantity, attributes
   - Include: updated_at, created_at

6. **Create Category entity interface**
   - Include: id, name, slug, parent_id, description
   - Include: image, sort_order, status
   - Include: updated_at, created_at

7. **Create Customer entity interface**
   - Include: id, name, email, phone, address
   - Include: loyalty_points, total_purchases, tier
   - Include: notes, status, updated_at, created_at

8. **Create Transaction entity interface**
   - Include: offline_id, terminal_id, session_id
   - Include: items[], customer_id, total, subtotal, tax
   - Include: payment_method, status, created_at
   - Include: sync_status, sync_attempts, server_id

9. **Create SyncMeta entity interface**
   - Include: entity_type (key path)
   - Include: last_sync_at, version, record_count
   - Include: sync_token, has_more

10. **Define index configurations**
    - Create interface for IndexConfig with name, keyPath, options
    - Define indexes array for each object store
    - Document unique vs non-unique indexes

11. **Create schema upgrade function**
    - Accept IDBDatabase instance and old version
    - Create all object stores if not exists
    - Create all indexes on each object store
    - Handle version migrations

12. **Export schema configuration**
    - Export all entity interfaces
    - Export object store names enum
    - Export schema upgrade function
    - Document schema design decisions

### Database Schema Structure
```
lcc_pos_cache (v1)
├── products
│   ├── keyPath: 'id'
│   └── indexes: barcode, sku, name, category_id, updated_at
├── variants
│   ├── keyPath: 'id'
│   └── indexes: product_id, barcode, sku
├── categories
│   ├── keyPath: 'id'
│   └── indexes: parent_id, slug
├── customers
│   ├── keyPath: 'id'
│   └── indexes: phone, email, name
├── transactions
│   ├── keyPath: 'offline_id'
│   └── indexes: status, created_at, terminal_id, sync_status
└── sync_meta
    └── keyPath: 'entity_type'
```

### Index Strategy

| Object Store | Index | Unique | Purpose |
|--------------|-------|--------|---------|
| products | barcode | Yes | Barcode scanning lookup |
| products | sku | Yes | SKU search |
| products | name | No | Name-based search |
| products | category_id | No | Filter by category |
| products | updated_at | No | Incremental sync |
| variants | product_id | No | Get product variants |
| variants | barcode | Yes | Variant barcode scan |
| categories | parent_id | No | Category hierarchy |
| categories | slug | Yes | URL-friendly lookup |
| customers | phone | Yes | Phone number lookup |
| customers | email | Yes | Email lookup |
| transactions | status | No | Filter by status |
| transactions | sync_status | No | Find unsynced transactions |

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        └── schema.ts          # Database schema definitions
```

### Verification Checklist
- [ ] Schema definition file created
- [ ] All entity TypeScript interfaces defined
- [ ] Object store names enum exported
- [ ] All index configurations documented
- [ ] Schema upgrade function implemented
- [ ] Key paths defined for all stores
- [ ] Unique indexes identified correctly
- [ ] Database version constant defined
- [ ] Schema structure documented
- [ ] All entity fields have proper types

---

## Task 19: Create Products Object Store

### Overview
Implement the products object store with full product data structure, supporting barcode scanning, pricing, stock tracking, and product search.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 18: Define Database Schema

### Instructions

1. **Create products service file**
   - Create `frontend/lib/offline/stores/products.ts`
   - Import IDBService and Product interface

2. **Implement createProductStore method**
   - Create object store with keyPath: 'id'
   - Set autoIncrement to false (using server IDs)
   - Called during schema upgrade

3. **Implement addProduct method**
   - Accept Product object
   - Validate required fields (id, name, price)
   - Use `put` operation to insert/update
   - Return Promise with operation result

4. **Implement getProduct method**
   - Accept product ID parameter
   - Query products store by primary key
   - Return Promise with Product or null

5. **Implement getAllProducts method**
   - Query all products from store
   - Support optional filters (status, category_id)
   - Return Promise with Product array

6. **Implement updateProduct method**
   - Accept product ID and partial update object
   - Retrieve existing product
   - Merge updates with existing data
   - Update updated_at timestamp
   - Save back to store

7. **Implement deleteProduct method**
   - Accept product ID parameter
   - Delete from products store
   - Return Promise with success status

8. **Implement bulkAddProducts method**
   - Accept array of Product objects
   - Use single transaction for all operations
   - Use `put` to handle updates of existing products
   - Return count of products inserted/updated

9. **Add product search method**
   - Accept search term parameter
   - Search by name (case-insensitive)
   - Use cursor to iterate and filter
   - Return matching products array

10. **Implement product validation**
    - Validate price is positive number
    - Validate stock_quantity is non-negative
    - Validate tax_rate is between 0 and 100
    - Validate required fields are present

11. **Add product counting method**
    - Count total products in store
    - Count by status (active, inactive)
    - Return Promise with counts

12. **Export products service**
    - Export ProductsService class instance
    - Export TypeScript interfaces

### Product Data Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Server product ID (UUID) |
| name | string | Yes | Product display name |
| description | string | No | Product description |
| barcode | string | No | Product barcode (unique) |
| sku | string | No | Stock Keeping Unit (unique) |
| category_id | string | No | Category reference |
| price | number | Yes | Selling price in LKR |
| cost | number | No | Cost price for margin calculation |
| tax_rate | number | Yes | Tax percentage (0-100) |
| stock_quantity | number | Yes | Current stock level |
| images | string[] | No | Product image URLs |
| status | string | Yes | 'active' or 'inactive' |
| updated_at | string | Yes | ISO timestamp of last update |
| created_at | string | Yes | ISO timestamp of creation |

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        └── stores/
            └── products.ts    # Products store service
```

### Verification Checklist
- [ ] Products service file created
- [ ] Object store creation implemented
- [ ] CRUD methods for single product implemented
- [ ] Bulk operations implemented
- [ ] Product search method implemented
- [ ] Product validation implemented
- [ ] Counting methods implemented
- [ ] TypeScript interfaces used
- [ ] All methods return Promises
- [ ] Error handling in all methods

---

## Task 20: Add Product Indexes

### Overview
Create indexes on the products object store to enable fast lookups by barcode, SKU, name, category, and sync timestamp.

### Dependencies
- Task 19: Create Products Object Store

### Instructions

1. **Update schema upgrade function**
   - Modify products store creation to add indexes
   - Create indexes during database upgrade

2. **Create barcode index**
   - Index name: 'barcode'
   - Key path: 'barcode'
   - Options: { unique: true }
   - Purpose: Fast barcode scanning lookup

3. **Create SKU index**
   - Index name: 'sku'
   - Key path: 'sku'
   - Options: { unique: true }
   - Purpose: SKU-based search

4. **Create name index**
   - Index name: 'name'
   - Key path: 'name'
   - Options: { unique: false }
   - Purpose: Name-based search and sorting

5. **Create category_id index**
   - Index name: 'category_id'
   - Key path: 'category_id'
   - Options: { unique: false }
   - Purpose: Filter products by category

6. **Create updated_at index**
   - Index name: 'updated_at'
   - Key path: 'updated_at'
   - Options: { unique: false }
   - Purpose: Incremental sync queries

7. **Implement getProductByBarcode method**
   - Accept barcode parameter
   - Query using barcode index
   - Return Promise with Product or null
   - Handle missing or invalid barcodes

8. **Implement getProductBySKU method**
   - Accept SKU parameter
   - Query using sku index
   - Return Promise with Product or null

9. **Implement getProductsByCategory method**
   - Accept category_id parameter
   - Query using category_id index
   - Return Promise with Product array
   - Sort by name or price

10. **Implement getProductsUpdatedAfter method**
    - Accept timestamp parameter
    - Query using updated_at index
    - Use IDBKeyRange.lowerBound for range query
    - Return products updated after timestamp

11. **Add compound query methods**
    - Get active products by category
    - Get in-stock products by category
    - Combine index queries with filtering

12. **Optimize index usage**
    - Document which queries use which indexes
    - Provide guidance on query performance
    - Test index effectiveness

### Index Configuration Table

| Index Name | Key Path | Unique | Multientry | Use Case |
|------------|----------|--------|------------|----------|
| barcode | barcode | Yes | No | Scan product at POS |
| sku | sku | Yes | No | Search by SKU |
| name | name | No | No | Search by name, sorting |
| category_id | category_id | No | No | Category filtering |
| updated_at | updated_at | No | No | Incremental sync |

### Query Performance Guide

| Query Type | Index Used | Performance |
|------------|------------|-------------|
| Get by barcode | barcode | O(log n) - Excellent |
| Get by SKU | sku | O(log n) - Excellent |
| Get by category | category_id | O(log n + m) - Good |
| Search by name prefix | name + cursor | O(n) - Fair |
| Get all products | None | O(n) - Slow for large datasets |
| Sync query | updated_at | O(log n + m) - Good |

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        └── stores/
            └── products.ts    # Updated with index queries
```

### Verification Checklist
- [ ] All five indexes created on products store
- [ ] Unique constraints set correctly
- [ ] Index creation in schema upgrade function
- [ ] getProductByBarcode method implemented
- [ ] getProductBySKU method implemented
- [ ] getProductsByCategory method implemented
- [ ] getProductsUpdatedAfter method implemented
- [ ] Compound query methods implemented
- [ ] Index usage documented
- [ ] Query performance tested

---

## Task 21: Create Categories Object Store

### Overview
Implement the categories object store to support hierarchical category structure, category navigation, and product filtering by category.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 18: Define Database Schema

### Instructions

1. **Create categories service file**
   - Create `frontend/lib/offline/stores/categories.ts`
   - Import IDBService and Category interface

2. **Implement createCategoryStore method**
   - Create object store with keyPath: 'id'
   - Create parent_id index (non-unique)
   - Create slug index (unique)
   - Called during schema upgrade

3. **Implement addCategory method**
   - Accept Category object
   - Validate required fields (id, name, slug)
   - Validate parent_id exists if provided
   - Use `put` operation to insert/update

4. **Implement getCategory method**
   - Accept category ID parameter
   - Query categories store by primary key
   - Return Promise with Category or null

5. **Implement getAllCategories method**
   - Query all categories from store
   - Return Promise with Category array
   - Sort by sort_order then name

6. **Implement getCategoryBySlug method**
   - Accept slug parameter
   - Query using slug index
   - Return Promise with Category or null

7. **Implement getSubcategories method**
   - Accept parent category ID parameter
   - Query using parent_id index
   - Return child categories array
   - Sort by sort_order

8. **Implement getCategoryTree method**
   - Build hierarchical category structure
   - Start with root categories (parent_id = null)
   - Recursively attach subcategories
   - Return tree structure

9. **Implement getCategoryPath method**
   - Accept category ID parameter
   - Build breadcrumb path from root to category
   - Return array of categories in path
   - Example: [Electronics, Computers, Laptops]

10. **Implement bulkAddCategories method**
    - Accept array of Category objects
    - Use single transaction
    - Return count of categories inserted/updated

11. **Add category validation**
    - Validate slug format (lowercase, hyphens)
    - Prevent circular parent references
    - Validate sort_order is non-negative

12. **Export categories service**
    - Export CategoriesService class instance
    - Export TypeScript interfaces

### Category Data Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Server category ID (UUID) |
| name | string | Yes | Category display name |
| slug | string | Yes | URL-friendly identifier (unique) |
| parent_id | string | No | Parent category reference |
| description | string | No | Category description |
| image | string | No | Category image URL |
| sort_order | number | Yes | Display order within parent |
| status | string | Yes | 'active' or 'inactive' |
| updated_at | string | Yes | ISO timestamp |
| created_at | string | Yes | ISO timestamp |

### Category Hierarchy Example
```
Electronics (id: cat-1)
├── Computers (id: cat-2, parent_id: cat-1)
│   ├── Laptops (id: cat-3, parent_id: cat-2)
│   └── Desktops (id: cat-4, parent_id: cat-2)
└── Phones (id: cat-5, parent_id: cat-1)
    ├── Smartphones (id: cat-6, parent_id: cat-5)
    └── Feature Phones (id: cat-7, parent_id: cat-5)
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        └── stores/
            ├── products.ts
            └── categories.ts  # Categories store service
```

### Verification Checklist
- [ ] Categories service file created
- [ ] Object store with indexes created
- [ ] CRUD methods for categories implemented
- [ ] Slug-based lookup implemented
- [ ] Subcategory retrieval implemented
- [ ] Category tree building implemented
- [ ] Category path/breadcrumb implemented
- [ ] Bulk operations implemented
- [ ] Category validation implemented
- [ ] Circular reference prevention implemented

---

## Task 22: Create Customers Object Store

### Overview
Implement the customers object store to cache customer data for offline lookup during checkout, supporting phone and email-based search.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 18: Define Database Schema

### Instructions

1. **Create customers service file**
   - Create `frontend/lib/offline/stores/customers.ts`
   - Import IDBService and Customer interface

2. **Implement createCustomerStore method**
   - Create object store with keyPath: 'id'
   - Create phone index (unique)
   - Create email index (unique)
   - Create name index (non-unique)
   - Called during schema upgrade

3. **Implement addCustomer method**
   - Accept Customer object
   - Validate required fields (id, name, phone or email)
   - Normalize phone number format
   - Normalize email to lowercase
   - Use `put` operation to insert/update

4. **Implement getCustomer method**
   - Accept customer ID parameter
   - Query customers store by primary key
   - Return Promise with Customer or null

5. **Implement getCustomerByPhone method**
   - Accept phone number parameter
   - Normalize phone format before query
   - Query using phone index
   - Return Promise with Customer or null

6. **Implement getCustomerByEmail method**
   - Accept email parameter
   - Normalize email to lowercase
   - Query using email index
   - Return Promise with Customer or null

7. **Implement searchCustomers method**
   - Accept search term parameter
   - Search by name (case-insensitive)
   - Use name index with cursor
   - Return matching customers array
   - Limit results to prevent performance issues

8. **Implement bulkAddCustomers method**
   - Accept array of Customer objects
   - Normalize all phone and email fields
   - Use single transaction
   - Return count of customers inserted/updated

9. **Implement updateCustomerLoyalty method**
   - Accept customer ID and loyalty points delta
   - Retrieve customer
   - Update loyalty_points and tier if needed
   - Update total_purchases
   - Save back to store

10. **Add customer validation**
    - Validate phone number format
    - Validate email format
    - Validate loyalty_points is non-negative
    - Ensure at least phone or email is provided

11. **Implement data normalization**
    - Phone: remove spaces, dashes, parentheses
    - Phone: add Sri Lanka country code if missing (+94)
    - Email: trim and convert to lowercase

12. **Export customers service**
    - Export CustomersService class instance
    - Export TypeScript interfaces

### Customer Data Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Yes | Server customer ID (UUID) |
| name | string | Yes | Customer full name |
| email | string | No* | Customer email (unique) |
| phone | string | No* | Customer phone (unique) |
| address | string | No | Customer address |
| loyalty_points | number | Yes | Loyalty program points |
| total_purchases | number | Yes | Total purchase amount (LKR) |
| tier | string | Yes | Customer tier (bronze, silver, gold) |
| notes | string | No | Internal notes |
| status | string | Yes | 'active' or 'inactive' |
| updated_at | string | Yes | ISO timestamp |
| created_at | string | Yes | ISO timestamp |

*At least one of email or phone is required

### Phone Number Normalization

| Input | Normalized Output |
|-------|-------------------|
| 0771234567 | +94771234567 |
| 077-123-4567 | +94771234567 |
| (077) 123 4567 | +94771234567 |
| +94 77 123 4567 | +94771234567 |

### Customer Tier Calculation

| Total Purchases (LKR) | Tier |
|----------------------|------|
| 0 - 49,999 | Bronze |
| 50,000 - 199,999 | Silver |
| 200,000+ | Gold |

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        └── stores/
            ├── products.ts
            ├── categories.ts
            └── customers.ts   # Customers store service
```

### Verification Checklist
- [ ] Customers service file created
- [ ] Object store with all indexes created
- [ ] CRUD methods for customers implemented
- [ ] Phone-based lookup implemented
- [ ] Email-based lookup implemented
- [ ] Customer search by name implemented
- [ ] Bulk operations implemented
- [ ] Loyalty points update implemented
- [ ] Phone number normalization implemented
- [ ] Email normalization implemented
- [ ] Customer validation implemented
- [ ] Tier calculation implemented

---

## Task 23: Create Settings Object Store

### Overview
Implement the settings object store to cache terminal configuration, tax rates, payment methods, and other settings required for offline operations.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 18: Define Database Schema

### Instructions

1. **Create settings service file**
   - Create `frontend/lib/offline/stores/settings.ts`
   - Import IDBService and Setting interface

2. **Implement createSettingsStore method**
   - Create object store with keyPath: 'key'
   - No indexes needed (small dataset)
   - Called during schema upgrade

3. **Define settings categories**
   - Terminal settings (terminal_id, name, location)
   - Tax rates (default_tax_rate, tax_categories)
   - Payment methods (enabled methods, configurations)
   - Receipt settings (template, footer, logo)
   - Quick buttons (configured quick access items)

4. **Implement setSetting method**
   - Accept key and value parameters
   - Accept optional metadata (updated_at, synced)
   - Validate setting structure
   - Use `put` operation to insert/update

5. **Implement getSetting method**
   - Accept setting key parameter
   - Query settings store by key
   - Return Promise with value or null
   - Provide default value option

6. **Implement getAllSettings method**
   - Query all settings from store
   - Return Promise with Map of key-value pairs
   - Group by category if requested

7. **Implement bulkSetSettings method**
   - Accept object with multiple key-value pairs
   - Use single transaction
   - Update updated_at timestamp for all
   - Return count of settings updated

8. **Implement deleteSetting method**
   - Accept setting key parameter
   - Delete from settings store
   - Return Promise with success status

9. **Create terminal settings methods**
   - getTerminalSettings() - return terminal config
   - updateTerminalSettings(config) - update terminal config
   - Include: terminal_id, name, location, timezone

10. **Create tax settings methods**
    - getTaxRates() - return all tax configurations
    - getDefaultTaxRate() - return default tax percentage
    - updateTaxRates(rates) - update tax configuration

11. **Create payment methods settings**
    - getPaymentMethods() - return enabled payment methods
    - isPaymentMethodEnabled(method) - check if method is active
    - updatePaymentMethods(methods) - update payment configuration

12. **Export settings service**
    - Export SettingsService class instance
    - Export setting key constants
    - Export TypeScript interfaces

### Settings Data Structure

| Key | Value Type | Description |
|-----|------------|-------------|
| terminal_id | string | Unique terminal identifier |
| terminal_name | string | Terminal display name |
| terminal_location | string | Physical location |
| default_tax_rate | number | Default tax percentage |
| tax_categories | object | Tax rates by category |
| payment_methods | array | Enabled payment methods |
| receipt_template | string | Receipt template HTML |
| receipt_footer | string | Footer text for receipts |
| quick_buttons | array | Quick access button configs |
| currency | string | Currency code (LKR) |
| timezone | string | Timezone (Asia/Colombo) |

### Tax Configuration Structure
```typescript
{
  default_tax_rate: 12.0,
  tax_categories: {
    'food': 8.0,
    'electronics': 15.0,
    'services': 18.0,
    'exempt': 0.0
  }
}
```

### Payment Methods Configuration
```typescript
[
  { method: 'cash', enabled: true, requires_exact: false },
  { method: 'card', enabled: true, requires_auth: true },
  { method: 'qr', enabled: true, qr_provider: 'payhere' },
  { method: 'credit', enabled: true, credit_limit: 50000 }
]
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        └── stores/
            ├── products.ts
            ├── categories.ts
            ├── customers.ts
            └── settings.ts    # Settings store service
```

### Verification Checklist
- [ ] Settings service file created
- [ ] Object store creation implemented
- [ ] Generic get/set methods implemented
- [ ] Bulk operations implemented
- [ ] Terminal settings methods implemented
- [ ] Tax settings methods implemented
- [ ] Payment methods settings implemented
- [ ] Setting validation implemented
- [ ] Default values supported
- [ ] TypeScript interfaces defined
- [ ] Setting key constants exported

---

## Task 24: Create Transactions Object Store

### Overview
Implement the transactions object store to queue transactions created while offline, tracking their sync status and retry attempts.

### Dependencies
- Task 17: Create IndexedDB Service
- Task 18: Define Database Schema

### Instructions

1. **Create transactions service file**
   - Create `frontend/lib/offline/stores/transactions.ts`
   - Import IDBService and Transaction interface

2. **Implement createTransactionsStore method**
   - Create object store with keyPath: 'offline_id'
   - Create status index (non-unique)
   - Create created_at index (non-unique)
   - Create terminal_id index (non-unique)
   - Create sync_status index (non-unique)
   - Called during schema upgrade

3. **Implement addTransaction method**
   - Accept Transaction object
   - Generate offline_id (UUID)
   - Set initial sync_status to 'pending'
   - Set sync_attempts to 0
   - Validate transaction structure
   - Use `add` operation to insert only

4. **Implement getTransaction method**
   - Accept offline_id parameter
   - Query transactions store by primary key
   - Return Promise with Transaction or null

5. **Implement getPendingTransactions method**
   - Query using sync_status index
   - Filter for sync_status = 'pending'
   - Sort by created_at ascending (FIFO)
   - Return Promise with Transaction array

6. **Implement getFailedTransactions method**
   - Query using sync_status index
   - Filter for sync_status = 'failed'
   - Include transactions with sync_attempts > 0
   - Return Promise with Transaction array

7. **Implement updateTransactionSyncStatus method**
   - Accept offline_id and new sync_status
   - Accept optional server_id (after successful sync)
   - Update sync_status, sync_attempts, last_sync_attempt
   - If synced successfully, store server_id

8. **Implement markTransactionSynced method**
   - Accept offline_id and server_id
   - Set sync_status to 'synced'
   - Set server_id
   - Set synced_at timestamp

9. **Implement markTransactionFailed method**
   - Accept offline_id and error details
   - Set sync_status to 'failed'
   - Increment sync_attempts counter
   - Store error message and timestamp

10. **Implement retryFailedTransactions method**
    - Reset sync_status from 'failed' to 'pending'
    - Reset for transactions with sync_attempts < max
    - Return count of transactions reset

11. **Implement deleteOldTransactions method**
    - Accept age threshold (e.g., 30 days)
    - Delete synced transactions older than threshold
    - Keep failed transactions for manual review
    - Return count of transactions deleted

12. **Implement getTransactionStats method**
    - Count pending transactions
    - Count failed transactions
    - Count synced transactions
    - Calculate oldest pending transaction age
    - Return statistics object

13. **Export transactions service**
    - Export TransactionsService class instance
    - Export sync status constants
    - Export TypeScript interfaces

### Transaction Data Structure

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| offline_id | string | Yes | Client-generated UUID |
| terminal_id | string | Yes | Terminal that created transaction |
| session_id | string | Yes | POS session reference |
| items | array | Yes | Transaction line items |
| customer_id | string | No | Customer reference |
| subtotal | number | Yes | Subtotal before tax (LKR) |
| tax | number | Yes | Total tax amount (LKR) |
| total | number | Yes | Final total (LKR) |
| payment_method | string | Yes | Payment method used |
| status | string | Yes | 'completed', 'refunded', 'void' |
| sync_status | string | Yes | 'pending', 'syncing', 'synced', 'failed' |
| sync_attempts | number | Yes | Number of sync attempts |
| last_sync_attempt | string | No | ISO timestamp of last attempt |
| sync_error | string | No | Last sync error message |
| server_id | string | No | Server transaction ID after sync |
| created_at | string | Yes | ISO timestamp |
| synced_at | string | No | ISO timestamp when synced |

### Transaction Item Structure
```typescript
{
  product_id: string,
  variant_id?: string,
  name: string,
  quantity: number,
  price: number,
  tax_rate: number,
  discount: number,
  subtotal: number,
  total: number
}
```

### Sync Status Flow
```
pending → syncing → synced
           ↓
         failed → (retry) → pending
```

### Expected Outcome
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts
        ├── schema.ts
        └── stores/
            ├── products.ts
            ├── categories.ts
            ├── customers.ts
            ├── settings.ts
            └── transactions.ts # Transactions store service
```

### Verification Checklist
- [ ] Transactions service file created
- [ ] Object store with all indexes created
- [ ] Transaction creation with offline_id generation
- [ ] Get pending transactions implemented
- [ ] Get failed transactions implemented
- [ ] Sync status update methods implemented
- [ ] Mark synced method implemented
- [ ] Mark failed method implemented
- [ ] Retry failed transactions implemented
- [ ] Delete old transactions implemented
- [ ] Transaction stats method implemented
- [ ] Transaction validation implemented
- [ ] All sync statuses handled

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 17 | Create IndexedDB Service | `indexeddb.ts` - Database wrapper service |
| 18 | Define Database Schema | `schema.ts` - All entity definitions |
| 19 | Create Products Object Store | `stores/products.ts` - Products service |
| 20 | Add Product Indexes | Enhanced products queries |
| 21 | Create Categories Object Store | `stores/categories.ts` - Categories service |
| 22 | Create Customers Object Store | `stores/customers.ts` - Customers service |
| 23 | Create Settings Object Store | `stores/settings.ts` - Settings service |
| 24 | Create Transactions Object Store | `stores/transactions.ts` - Transactions service |

### Final Directory Structure
```
frontend/
└── lib/
    └── offline/
        ├── indexeddb.ts           # IndexedDB wrapper service
        ├── schema.ts              # Database schema definitions
        └── stores/
            ├── products.ts        # Products store service
            ├── categories.ts      # Categories store service
            ├── customers.ts       # Customers store service
            ├── settings.ts        # Settings store service
            └── transactions.ts    # Transactions store service
```

### Database Schema Summary
```
lcc_pos_cache (v1)
├── products (keyPath: 'id')
│   └── indexes: barcode*, sku*, name, category_id, updated_at
├── variants (keyPath: 'id')
│   └── indexes: product_id, barcode*, sku*
├── categories (keyPath: 'id')
│   └── indexes: parent_id, slug*
├── customers (keyPath: 'id')
│   └── indexes: phone*, email*, name
├── transactions (keyPath: 'offline_id')
│   └── indexes: status, created_at, terminal_id, sync_status
└── settings (keyPath: 'key')
    └── no indexes

* = unique index
```

### Group Completion Status
Tasks 17-24 complete. All IndexedDB object stores are now defined with proper indexes and service layers.

### Next Steps
Proceed to [02_Tasks-25-30_Versioning-Cache-Service.md](02_Tasks-25-30_Versioning-Cache-Service.md) to implement data versioning and cache population services.

---

## Notes for AI Agents

1. **Execution Order:** Tasks 17-18 must be completed first; tasks 19-24 can be done in parallel
2. **No Code Generation:** These are instructions only; implementation is developer's responsibility
3. **TypeScript Required:** All services must use TypeScript with strict type checking
4. **Error Handling:** All database operations must be wrapped in try-catch blocks
5. **Unique Constraints:** Barcode, SKU, phone, email, and slug indexes must be unique
6. **Sync Status:** Transaction sync_status is critical for offline queue management
7. **Performance:** Use bulk operations and transactions for multiple records
8. **Testing:** Test with large datasets (10,000+ products) to verify performance
9. **Validation:** Implement input validation before storing data
10. **Normalization:** Phone and email fields must be normalized for consistent queries
