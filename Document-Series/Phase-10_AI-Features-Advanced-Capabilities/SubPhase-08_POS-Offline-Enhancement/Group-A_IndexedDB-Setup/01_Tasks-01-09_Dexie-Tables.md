# Tasks 01-09: Dexie Installation and Database Tables

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** A - IndexedDB Setup  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-10-16_Indexes-Compression.md](02_Tasks-10-16_Indexes-Compression.md)

---

## Document Overview

This document covers the installation of Dexie.js as the IndexedDB wrapper and the creation of all database tables required for offline POS functionality. It establishes the foundational database schema including tables for Products, Customers, Sales, SaleItems, Inventory, Settings, and SyncQueue. These tables enable local storage of critical business data for offline operation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Install Dexie.js | Low | 10 min |
| 02 | Create Database Schema | Medium | 30 min |
| 03 | Create Products Table | Low | 20 min |
| 04 | Create Customers Table | Low | 20 min |
| 05 | Create Sales Table | Medium | 25 min |
| 06 | Create SaleItems Table | Low | 20 min |
| 07 | Create Inventory Table | Low | 20 min |
| 08 | Create Settings Table | Low | 15 min |
| 09 | Create SyncQueue Table | Medium | 25 min |

---

## Task 01: Install Dexie.js

### Overview
Install Dexie.js as the IndexedDB wrapper library. Dexie.js provides a minimalistic yet powerful API for working with IndexedDB, making it easier to manage database operations compared to the raw IndexedDB API. This library will serve as the foundation for all offline storage functionality in the POS system.

### Dependencies
- Frontend project initialized with npm/yarn
- Node.js environment properly configured
- Package.json exists in frontend directory

### Instructions

1. **Navigate to frontend directory**
   - Open terminal in the project root
   - Change directory to the frontend project folder
   - Verify you're in the correct location with package.json present

2. **Install Dexie.js package**
   - Run package manager install command
   - Use version 4.x or later for latest features
   - Wait for installation to complete
   - Verify no errors during installation

3. **Install TypeScript type definitions**
   - Dexie.js includes built-in TypeScript definitions
   - No separate @types package needed
   - TypeScript support comes out of the box

4. **Verify installation**
   - Check package.json dependencies section
   - Confirm dexie is listed with correct version
   - Run build command to verify no import errors

5. **Review Dexie.js documentation**
   - Familiarize yourself with core concepts
   - Understand table definition syntax
   - Review indexing and query patterns

### Package Information

| Property | Value |
|----------|-------|
| Package Name | dexie |
| Version | ^4.0.0 or later |
| Type | Production dependency |
| Size | ~50KB minified |
| TypeScript | Built-in definitions |

### Installation Command Reference

| Package Manager | Command |
|-----------------|---------|
| npm | npm install dexie |
| yarn | yarn add dexie |
| pnpm | pnpm add dexie |

### Why Dexie.js?

| Advantage | Description |
|-----------|-------------|
| Simple API | Intuitive syntax compared to raw IndexedDB |
| TypeScript Support | Full type safety and autocompletion |
| Query Methods | Powerful query and filtering capabilities |
| Version Management | Built-in schema versioning system |
| Promise-based | Modern async/await compatible |
| Small Footprint | Minimal bundle size impact |

### Dexie vs Raw IndexedDB

```
Raw IndexedDB Complexity:
├── Open database request
├── Handle version changes
├── Create object stores in upgradeneeded
├── Manage transactions manually
└── Handle complex error scenarios

Dexie Simplicity:
├── Declare schema in constructor
├── Automatic transaction management
├── Simple query methods
└── Built-in error handling
```

### Expected Outcome
- Dexie.js successfully installed in frontend project
- Package appears in dependencies
- No installation errors or warnings
- Ready to create database schema

### Verification Checklist
- [ ] Dexie package installed successfully
- [ ] Version 4.x or later confirmed
- [ ] Listed in package.json dependencies
- [ ] No installation errors reported
- [ ] Frontend build succeeds with package installed

---

## Task 02: Create Database Schema

### Overview
Create the main database schema class that extends Dexie and defines all tables for the POS offline system. This schema serves as the central definition for the entire IndexedDB structure, including table names, primary keys, and indexes. The schema establishes the foundation for all subsequent table configurations.

### Dependencies
- Task 01: Install Dexie.js

### Instructions

1. **Create offline database directory structure**
   - Navigate to frontend/lib directory
   - Create new directory named 'offline'
   - This will house all offline-related code

2. **Create database schema file**
   - Create file named 'database.ts' in lib/offline directory
   - This file will contain the main database class
   - Set up TypeScript module structure

3. **Import Dexie library**
   - Import Dexie class from dexie package
   - Import Dexie types for TypeScript support
   - Prepare for table interface definitions

4. **Define table interfaces**
   - Create TypeScript interfaces for each table type
   - Define Product, Customer, Sale, SaleItem, Inventory, Settings, SyncQueue interfaces
   - Include all fields with proper types

5. **Create POSDatabase class**
   - Extend Dexie class
   - Name the class POSDatabase
   - Add table property declarations with proper types

6. **Initialize database in constructor**
   - Call super() with database name 'pos-offline-db'
   - Define database version (start with version 1)
   - Use version().stores() to declare table schemas

7. **Declare table schemas**
   - Define each table with primary key and indexes
   - Use Dexie schema syntax (comma-separated index list)
   - Primary key specified first, indexes follow

8. **Create database instance singleton**
   - Export a single instance of POSDatabase
   - Ensure only one database connection exists
   - This prevents multiple connection issues

### Database Configuration

| Property | Value | Purpose |
|----------|-------|---------|
| Database Name | pos-offline-db | Unique identifier in browser |
| Version | 1 | Schema version for migrations |
| Location | IndexedDB | Browser storage API |
| Max Size | ~200 MB | Browser quota limit |

### POSDatabase Class Structure

```
POSDatabase (extends Dexie)
├── Database Name: pos-offline-db
├── Version: 1
├── Tables:
│   ├── products
│   ├── customers
│   ├── sales
│   ├── sale_items
│   ├── inventory
│   ├── settings
│   └── sync_queue
└── Instance: Singleton export
```

### Table Interface Examples

| Interface | Key Fields | Purpose |
|-----------|------------|---------|
| Product | id, sku, barcode, name, price | Product catalog |
| Customer | id, phone, email, name | Customer records |
| Sale | id, temp_id, customer_id, total | Sales transactions |
| SaleItem | id, sale_id, product_id, quantity | Line items |
| Inventory | product_id, stock_level | Stock tracking |
| Settings | key, value | App configuration |
| SyncQueue | id, type, data, status | Sync management |

### Schema Syntax Format

```
Version Declaration:
version(1).stores({
  tableName: 'primaryKey, index1, index2, index3'
})

Example:
version(1).stores({
  products: 'id, sku, barcode, category_id',
  customers: 'id, phone, email'
})
```

### Dexie Schema Syntax Rules

| Rule | Description | Example |
|------|-------------|---------|
| Primary Key First | Always specify primary key first | 'id, ...' |
| Auto-increment | Use ++ prefix for auto-increment | '++id, ...' |
| Comma Separation | Separate indexes with commas | 'id, name, email' |
| No Spaces | No spaces around commas | 'id,name,email' |
| Compound Index | Use + to combine fields | '[name+age]' |
| Multi-entry | Use * for array fields | '*tags' |

### Directory Structure

```
frontend/
└── lib/
    └── offline/
        ├── database.ts         # Main database schema (this task)
        ├── schema.ts           # (Optional) Separate schema definitions
        └── tables/             # (Future) Individual table utilities
            ├── products.ts
            ├── customers.ts
            └── ...
```

### Expected Outcome
- POSDatabase class created extending Dexie
- All seven tables declared in schema
- TypeScript interfaces defined for type safety
- Database instance exported as singleton
- Schema version set to 1

### Verification Checklist
- [ ] lib/offline/database.ts file created
- [ ] POSDatabase class extends Dexie
- [ ] Database named 'pos-offline-db'
- [ ] Version 1 declared
- [ ] All seven tables defined in stores()
- [ ] TypeScript interfaces created for each table
- [ ] Singleton database instance exported
- [ ] No TypeScript errors in file

---

## Task 03: Create Products Table

### Overview
Create the Products table schema to store product catalog information locally for offline access. This table enables the POS system to display product details, prices, and inventory information even without internet connectivity. Products are the core of any retail system and must be quickly searchable by multiple attributes.

### Dependencies
- Task 02: Create Database Schema

### Instructions

1. **Define Products table in schema**
   - Locate POSDatabase class in database.ts
   - Add products table to version().stores() declaration
   - Specify primary key and indexes

2. **Specify primary key field**
   - Use 'id' as primary key
   - This matches the server-side product ID
   - Enables easy synchronization with backend

3. **Add indexed fields for queries**
   - Index 'sku' field for SKU-based searches
   - Index 'barcode' field for barcode scanning
   - Index 'name' field for name-based searches
   - Index 'category_id' for category filtering

4. **Define complete Products interface**
   - Create Product interface with all fields
   - Include id, sku, barcode, name, description
   - Include price, cost, category_id, category_name
   - Include stock, unit, tax_rate, is_active
   - Include image_url, updated_at, metadata fields

5. **Add table declaration to POSDatabase**
   - Add products property to class
   - Type it as Table<Product>
   - This enables TypeScript autocompletion

6. **Document field purposes**
   - Add comments explaining each field
   - Note which fields are searchable
   - Indicate required vs optional fields

7. **Consider data constraints**
   - Plan for string length limits
   - Consider numeric precision for prices
   - Handle nullable fields appropriately

### Products Table Schema

| Field | Type | Indexed | Required | Purpose |
|-------|------|---------|----------|---------|
| id | string | Primary | Yes | Unique product identifier |
| sku | string | Yes | Yes | Stock keeping unit code |
| barcode | string | Yes | No | Barcode for scanning |
| name | string | Yes | Yes | Product display name |
| description | string | No | No | Product description |
| price | number | No | Yes | Selling price |
| cost | number | No | No | Purchase cost |
| category_id | string | Yes | No | Category reference |
| category_name | string | No | No | Category display name |
| stock | number | No | Yes | Current stock level |
| unit | string | No | Yes | Unit of measurement |
| tax_rate | number | No | No | Tax percentage |
| is_active | boolean | No | Yes | Product availability |
| image_url | string | No | No | Product image URL |
| updated_at | Date | No | Yes | Last update timestamp |
| metadata | object | No | No | Additional attributes |

### Dexie Schema Declaration

```
Schema Format:
products: 'id, sku, barcode, name, category_id'

Breakdown:
├── id             → Primary key
├── sku            → Indexed for SKU search
├── barcode        → Indexed for scanning
├── name           → Indexed for text search
└── category_id    → Indexed for filtering
```

### Index Purpose and Usage

| Index | Use Case | Query Example |
|-------|----------|---------------|
| id | Direct product lookup | Get product by ID |
| sku | SKU search | Find product by SKU |
| barcode | Barcode scanning | Scan barcode to find product |
| name | Product search | Search products by name |
| category_id | Category filtering | List products in category |

### Product Search Patterns

```
Search by Barcode (POS scanning):
├── User scans barcode
├── Query: products.where('barcode').equals(scannedCode)
├── Returns: Single product
└── Displays: Product details for sale

Search by Name (Product search):
├── User types partial name
├── Query: products.where('name').startsWithIgnoreCase(query)
├── Returns: Array of matching products
└── Displays: Search results

Filter by Category (Browse products):
├── User selects category
├── Query: products.where('category_id').equals(categoryId)
├── Returns: Products in category
└── Displays: Category product list
```

### Performance Considerations

| Aspect | Strategy | Benefit |
|--------|----------|---------|
| Indexing | Index frequently queried fields | Fast lookups |
| Barcode Search | Indexed barcode field | Instant scanning |
| Name Search | Indexed name field | Quick text search |
| Pagination | Limit query results | Reduce memory usage |
| Caching | Keep frequently accessed products | Faster access |

### Data Synchronization

| Sync Scenario | Approach |
|---------------|----------|
| Initial Load | Download all active products from server |
| Updates | Sync changed products periodically |
| Additions | Add new products during sync |
| Deletions | Mark inactive or remove old products |
| Conflicts | Server data overwrites local data |

### Expected Outcome
- Products table defined in database schema
- Primary key and indexes configured
- Product interface created with all fields
- Table property added to POSDatabase class
- Ready for product data storage and retrieval

### Verification Checklist
- [ ] Products table added to schema stores()
- [ ] Primary key 'id' specified
- [ ] Indexes added for sku, barcode, name, category_id
- [ ] Product TypeScript interface created
- [ ] All required fields defined in interface
- [ ] products property added to POSDatabase class
- [ ] Table typed as Table<Product>
- [ ] No TypeScript errors

---

## Task 04: Create Customers Table

### Overview
Create the Customers table schema to store customer information locally for offline customer lookup and loyalty tracking. This table enables the POS system to identify customers, apply loyalty discounts, and track purchase history even without internet connectivity. Customer data must be searchable by phone number, email, and name.

### Dependencies
- Task 02: Create Database Schema

### Instructions

1. **Define Customers table in schema**
   - Locate POSDatabase class in database.ts
   - Add customers table to version().stores() declaration
   - Specify primary key and indexes

2. **Specify primary key field**
   - Use 'id' as primary key
   - This matches the server-side customer ID
   - Enables synchronization with backend

3. **Add indexed fields for queries**
   - Index 'phone' field for phone-based lookup
   - Index 'email' field for email-based search
   - Index 'name' field for name-based search
   - These are the most common search methods

4. **Define complete Customer interface**
   - Create Customer interface with all fields
   - Include id, phone, email, name
   - Include address, city, postal_code
   - Include loyalty_points, total_purchases, member_since
   - Include is_active, notes, updated_at fields

5. **Add table declaration to POSDatabase**
   - Add customers property to class
   - Type it as Table<Customer>
   - Enable TypeScript support

6. **Plan for privacy and security**
   - Consider data sensitivity of customer info
   - Plan for data encryption if needed
   - Ensure GDPR/privacy compliance

7. **Consider customer lookup patterns**
   - Phone lookup is most common in retail
   - Email lookup for online orders
   - Name search for walk-in customers
   - Support partial matching where possible

### Customers Table Schema

| Field | Type | Indexed | Required | Purpose |
|-------|------|---------|----------|---------|
| id | string | Primary | Yes | Unique customer identifier |
| phone | string | Yes | Yes | Phone number for lookup |
| email | string | Yes | No | Email address |
| name | string | Yes | Yes | Customer full name |
| address | string | No | No | Street address |
| city | string | No | No | City name |
| postal_code | string | No | No | Postal/ZIP code |
| loyalty_points | number | No | Yes | Current loyalty points |
| total_purchases | number | No | Yes | Lifetime purchase value |
| member_since | Date | No | Yes | Registration date |
| is_active | boolean | No | Yes | Account status |
| notes | string | No | No | Additional customer notes |
| updated_at | Date | No | Yes | Last update timestamp |

### Dexie Schema Declaration

```
Schema Format:
customers: 'id, phone, email, name'

Breakdown:
├── id      → Primary key
├── phone   → Indexed for phone lookup
├── email   → Indexed for email search
└── name    → Indexed for name search
```

### Index Purpose and Usage

| Index | Use Case | Query Example |
|-------|----------|---------------|
| id | Direct customer lookup | Get customer by ID |
| phone | Phone-based search | Find customer by phone |
| email | Email lookup | Find customer by email |
| name | Name search | Search customers by name |

### Customer Lookup Patterns

```
Lookup by Phone (Most common):
├── User enters phone number
├── Query: customers.where('phone').equals(phoneNumber)
├── Returns: Customer record
└── Action: Apply loyalty discount

Lookup by Email:
├── User enters email
├── Query: customers.where('email').equals(email)
├── Returns: Customer record
└── Action: Associate order with customer

Search by Name:
├── User types partial name
├── Query: customers.where('name').startsWithIgnoreCase(query)
├── Returns: Matching customers
└── Action: Select correct customer
```

### Loyalty Points Integration

```
Loyalty System Flow:
├── Customer lookup during checkout
├── Display current loyalty points
├── Calculate points earned from purchase
├── Apply discount if points redeemed
├── Update local loyalty_points
└── Queue sync to server
```

### Customer Data Privacy

| Concern | Mitigation |
|---------|------------|
| Sensitive Data | Store only necessary information |
| Data Encryption | Consider encrypting phone/email |
| Data Retention | Clean up old customer records |
| GDPR Compliance | Support data deletion requests |
| Access Control | Limit who can view customer data |

### Performance Optimization

| Strategy | Implementation | Benefit |
|----------|----------------|---------|
| Phone Index | Indexed phone field | Fast phone lookup |
| Name Search | Indexed name field | Quick name search |
| Caching | Cache frequent customers | Faster repeat lookups |
| Pagination | Limit search results | Reduce memory usage |

### Expected Outcome
- Customers table defined in database schema
- Primary key and indexes configured
- Customer interface created with all fields
- Table property added to POSDatabase class
- Ready for customer data storage and lookup

### Verification Checklist
- [ ] Customers table added to schema stores()
- [ ] Primary key 'id' specified
- [ ] Indexes added for phone, email, name
- [ ] Customer TypeScript interface created
- [ ] All required fields defined in interface
- [ ] customers property added to POSDatabase class
- [ ] Table typed as Table<Customer>
- [ ] Privacy considerations documented
- [ ] No TypeScript errors

---

## Task 05: Create Sales Table

### Overview
Create the Sales table schema to store completed and pending sales transactions locally. This table is critical for offline POS operations as it records all sales made when the system is offline, enabling the business to continue operating without internet connectivity. Sales data must be synchronized with the server when connectivity is restored.

### Dependencies
- Task 02: Create Database Schema

### Instructions

1. **Define Sales table in schema**
   - Locate POSDatabase class in database.ts
   - Add sales table to version().stores() declaration
   - Specify primary key and critical indexes

2. **Specify primary key field**
   - Use 'id' as primary key
   - This is the server-assigned sale ID after sync
   - May be empty for offline-created sales

3. **Add temporary ID for offline sales**
   - Index 'temp_id' field
   - Generated locally before server sync
   - Used to track sales created offline
   - Replaced with server ID after sync

4. **Add sync-related indexes**
   - Index 'synced' boolean field
   - Enables quick filtering of unsynced sales
   - Critical for sync queue processing

5. **Add timestamp indexes**
   - Index 'created_at' field
   - Enables date range queries
   - Useful for reports and cleanup

6. **Define complete Sale interface**
   - Create Sale interface with all fields
   - Include id, temp_id, customer_id
   - Include items array, subtotal, tax, discount, total
   - Include payment_method, status, synced
   - Include created_at, synced_at, metadata fields

7. **Add table declaration to POSDatabase**
   - Add sales property to class
   - Type it as Table<Sale>
   - Enable full TypeScript support

8. **Plan for sale states**
   - Draft: Sale in progress
   - Completed: Sale finalized offline
   - Synced: Sale synchronized to server
   - Failed: Sync failed, needs retry

### Sales Table Schema

| Field | Type | Indexed | Required | Purpose |
|-------|------|---------|----------|---------|
| id | string | Primary | No | Server-assigned sale ID |
| temp_id | string | Yes | Yes | Local temporary ID |
| customer_id | string | Yes | No | Associated customer |
| subtotal | number | No | Yes | Sum before tax/discount |
| tax | number | No | Yes | Tax amount |
| discount | number | No | Yes | Discount amount |
| total | number | No | Yes | Final total amount |
| payment_method | string | No | Yes | Payment type |
| status | string | Yes | Yes | Sale status |
| synced | boolean | Yes | Yes | Sync status flag |
| created_at | Date | Yes | Yes | Sale timestamp |
| synced_at | Date | No | No | Sync timestamp |
| cashier_id | string | No | Yes | Cashier who created sale |
| terminal_id | string | No | No | POS terminal identifier |
| notes | string | No | No | Sale notes |
| metadata | object | No | No | Additional data |

### Dexie Schema Declaration

```
Schema Format:
sales: 'id, temp_id, customer_id, status, synced, created_at'

Breakdown:
├── id           → Primary key (may be empty initially)
├── temp_id      → Local identifier for offline sales
├── customer_id  → Link to customer
├── status       → Filter by sale status
├── synced       → Find unsynced sales
└── created_at   → Date-based queries
```

### Index Purpose and Usage

| Index | Use Case | Query Example |
|-------|----------|---------------|
| id | Direct sale lookup | Get sale by server ID |
| temp_id | Offline sale tracking | Find sale by temp ID |
| customer_id | Customer purchase history | List customer's sales |
| status | Filter by status | Find draft/completed sales |
| synced | Sync queue | Find all unsynced sales |
| created_at | Date range queries | Sales for today/week/month |

### Sale Lifecycle States

```
Offline Sale Flow:
├── Draft
│   ├── Sale being created
│   ├── temp_id generated
│   └── status: 'draft'
│
├── Completed
│   ├── Payment received
│   ├── Items finalized
│   ├── status: 'completed'
│   └── synced: false
│
├── Queued for Sync
│   ├── Added to sync_queue
│   ├── status: 'completed'
│   └── synced: false
│
└── Synced
    ├── Sent to server
    ├── Server ID received
    ├── status: 'completed'
    └── synced: true
```

### Sync Strategy

| Scenario | Handling |
|----------|----------|
| Created Offline | Use temp_id, sync when online |
| Server ID Assignment | Update id, keep temp_id for reference |
| Sync Failure | Retry with exponential backoff |
| Conflict Resolution | Server data takes precedence |
| Orphaned Sales | Keep for 30 days, then review |

### Temporary ID Generation

```
Temp ID Format:
OFFLINE_[TIMESTAMP]_[RANDOM]

Example:
OFFLINE_1738360800000_a3k9f2

Components:
├── OFFLINE_    → Prefix identifier
├── 1738360800000  → Unix timestamp
├── _           → Separator
└── a3k9f2      → Random string (6 chars)
```

### Query Patterns

```
Find Unsynced Sales:
├── Query: sales.where('synced').equals(false)
├── Returns: All sales needing sync
└── Action: Add to sync queue

Today's Sales Report:
├── Calculate today's date range
├── Query: sales.where('created_at').between(startOfDay, endOfDay)
├── Returns: Sales for today
└── Action: Calculate totals

Customer Purchase History:
├── Query: sales.where('customer_id').equals(customerId)
├── Returns: Customer's sales
└── Action: Display purchase history
```

### Expected Outcome
- Sales table defined in database schema
- Primary and indexes configured for sync operations
- Sale interface created with all fields
- Table property added to POSDatabase class
- Ready to store offline and synced sales

### Verification Checklist
- [ ] Sales table added to schema stores()
- [ ] Primary key 'id' specified
- [ ] Indexes added for temp_id, customer_id, status, synced, created_at
- [ ] Sale TypeScript interface created
- [ ] All required fields defined in interface
- [ ] sales property added to POSDatabase class
- [ ] Table typed as Table<Sale>
- [ ] Temporary ID strategy documented
- [ ] Sync states defined
- [ ] No TypeScript errors

---

## Task 06: Create SaleItems Table

### Overview
Create the SaleItems table schema to store individual line items for each sale transaction. This table maintains the relationship between sales and products, storing quantity, price, and other details for each product sold. Sale items are critical for detailed transaction records and inventory management.

### Dependencies
- Task 05: Create Sales Table

### Instructions

1. **Define SaleItems table in schema**
   - Locate POSDatabase class in database.ts
   - Add sale_items table to version().stores() declaration
   - Configure primary key and relationship indexes

2. **Specify primary key field**
   - Use 'id' as primary key
   - Each line item has unique identifier
   - Enables individual item tracking

3. **Add relationship indexes**
   - Index 'sale_id' field for sale lookup
   - Index 'product_id' field for product tracking
   - These enable efficient relationship queries

4. **Define complete SaleItem interface**
   - Create SaleItem interface with all fields
   - Include id, sale_id, product_id
   - Include product_name, product_sku
   - Include quantity, unit_price, tax_rate
   - Include subtotal, tax, total
   - Include discount, metadata fields

5. **Add table declaration to POSDatabase**
   - Add sale_items property to class
   - Type it as Table<SaleItem>
   - Enable TypeScript autocompletion

6. **Plan for sale-item relationships**
   - One sale has many sale items
   - Each item references one sale
   - Each item references one product
   - Support bulk queries for sale items

7. **Consider price snapshot**
   - Store price at time of sale
   - Don't rely on current product price
   - Preserve historical pricing data
   - Important for auditing and returns

### SaleItems Table Schema

| Field | Type | Indexed | Required | Purpose |
|-------|------|---------|----------|---------|
| id | string | Primary | Yes | Unique line item identifier |
| sale_id | string | Yes | Yes | Reference to parent sale |
| product_id | string | Yes | Yes | Reference to product |
| product_name | string | No | Yes | Product name snapshot |
| product_sku | string | No | No | Product SKU snapshot |
| quantity | number | No | Yes | Items sold |
| unit_price | number | No | Yes | Price per unit |
| tax_rate | number | No | Yes | Tax percentage |
| subtotal | number | No | Yes | quantity × unit_price |
| tax | number | No | Yes | Calculated tax amount |
| discount | number | No | Yes | Line item discount |
| total | number | No | Yes | Final line total |
| metadata | object | No | No | Additional item data |

### Dexie Schema Declaration

```
Schema Format:
sale_items: 'id, sale_id, product_id'

Breakdown:
├── id          → Primary key
├── sale_id     → Index for sale lookup
└── product_id  → Index for product tracking
```

### Index Purpose and Usage

| Index | Use Case | Query Example |
|-------|----------|---------------|
| id | Direct item lookup | Get item by ID |
| sale_id | Sale line items | Get all items for sale |
| product_id | Product sales history | Get all sales of product |

### Sale-Item Relationship

```
One-to-Many Relationship:
Sale
├── id: "SALE_001"
├── total: 150.00
└── Items:
    ├── SaleItem 1
    │   ├── sale_id: "SALE_001"
    │   ├── product_id: "PROD_001"
    │   ├── quantity: 2
    │   └── total: 50.00
    │
    ├── SaleItem 2
    │   ├── sale_id: "SALE_001"
    │   ├── product_id: "PROD_002"
    │   ├── quantity: 1
    │   └── total: 100.00
    │
    └── Sum of Items = Sale Total
```

### Query Patterns

```
Get Items for Sale:
├── Query: sale_items.where('sale_id').equals(saleId)
├── Returns: Array of sale items
├── Action: Display sale details
└── Calculate: Sum totals for verification

Product Sales Report:
├── Query: sale_items.where('product_id').equals(productId)
├── Returns: All sales of product
├── Action: Calculate total quantity sold
└── Display: Product performance

Bulk Insert (During Sale):
├── Create array of sale items
├── Call: sale_items.bulkAdd(itemsArray)
├── Result: All items inserted efficiently
└── Benefit: Single transaction
```

### Price Snapshot Strategy

| Field | Snapshot | Reason |
|-------|----------|--------|
| product_name | Yes | Product name may change |
| product_sku | Yes | SKU may change |
| unit_price | Yes | Price changes over time |
| tax_rate | Yes | Tax rates may change |

### Calculation Logic

```
Line Item Calculations:
├── Subtotal = quantity × unit_price
├── Tax = subtotal × (tax_rate / 100)
├── Discount = (applied discount logic)
└── Total = subtotal + tax - discount

Sale Total Calculation:
├── Sum all item subtotals
├── Sum all item taxes
├── Sum all item discounts
└── Sale Total = sum of item totals
```

### Performance Considerations

| Aspect | Strategy | Benefit |
|--------|----------|---------|
| Bulk Insert | Use bulkAdd() for multiple items | Faster insertion |
| Sale Lookup | Index sale_id | Quick item retrieval |
| Product Reports | Index product_id | Fast product queries |
| Eager Loading | Load items with sale | Reduce queries |

### Expected Outcome
- SaleItems table defined in database schema
- Relationship indexes configured
- SaleItem interface created with all fields
- Table property added to POSDatabase class
- Ready to store line items for sales

### Verification Checklist
- [ ] SaleItems table added to schema stores()
- [ ] Primary key 'id' specified
- [ ] Indexes added for sale_id, product_id
- [ ] SaleItem TypeScript interface created
- [ ] All required fields defined in interface
- [ ] sale_items property added to POSDatabase class
- [ ] Table typed as Table<SaleItem>
- [ ] Price snapshot strategy documented
- [ ] Calculation logic planned
- [ ] No TypeScript errors

---

## Task 07: Create Inventory Table

### Overview
Create the Inventory table schema to track current stock levels locally for offline inventory management. This table maintains real-time inventory counts that update as sales are processed, enabling the POS system to prevent overselling and display accurate stock information without server connectivity.

### Dependencies
- Task 02: Create Database Schema

### Instructions

1. **Define Inventory table in schema**
   - Locate POSDatabase class in database.ts
   - Add inventory table to version().stores() declaration
   - Configure primary key as product_id

2. **Use product_id as primary key**
   - Primary key is 'product_id' (not auto-generated)
   - One inventory record per product
   - Simplifies inventory lookups
   - Matches product table structure

3. **Plan for minimal additional indexes**
   - Primary key handles most queries
   - Consider indexing 'updated_at' for sync
   - Keep indexes minimal for performance

4. **Define complete Inventory interface**
   - Create Inventory interface with all fields
   - Include product_id, stock_level
   - Include reserved_stock, available_stock
   - Include reorder_point, reorder_quantity
   - Include last_counted, updated_at fields

5. **Add table declaration to POSDatabase**
   - Add inventory property to class
   - Type it as Table<Inventory>
   - Enable TypeScript support

6. **Plan for stock operations**
   - Decrease stock on sale
   - Increase stock on return
   - Reserve stock for pending orders
   - Track stock movements for audit

7. **Consider stock synchronization**
   - Sync local stock with server periodically
   - Handle concurrent stock updates
   - Resolve stock discrepancies
   - Queue stock adjustments for sync

### Inventory Table Schema

| Field | Type | Indexed | Required | Purpose |
|-------|------|---------|----------|---------|
| product_id | string | Primary | Yes | Product identifier |
| stock_level | number | No | Yes | Total stock quantity |
| reserved_stock | number | No | Yes | Stock reserved for orders |
| available_stock | number | No | Yes | Available for sale |
| reorder_point | number | No | No | Low stock threshold |
| reorder_quantity | number | No | No | Suggested reorder amount |
| last_counted | Date | No | No | Last physical count date |
| updated_at | Date | No | Yes | Last update timestamp |

### Dexie Schema Declaration

```
Schema Format:
inventory: 'product_id'

Breakdown:
└── product_id  → Primary key (no auto-increment)
```

### Stock Calculation

```
Available Stock Calculation:
available_stock = stock_level - reserved_stock

Example:
├── stock_level: 100
├── reserved_stock: 15
└── available_stock: 85 (available for sale)
```

### Stock Operation Flows

```
Sale Stock Deduction:
├── Find inventory by product_id
├── Check: available_stock >= quantity
├── If yes: stock_level -= quantity
├── If no: Show "Insufficient stock" error
└── Update: updated_at timestamp

Stock Return/Refund:
├── Find inventory by product_id
├── Increase: stock_level += quantity
├── Update: available_stock calculation
└── Queue: Sync adjustment to server

Stock Reservation:
├── Find inventory by product_id
├── Increase: reserved_stock += quantity
├── Decrease: available_stock calculation
└── Use case: Hold stock for customer
```

### Query Patterns

```
Check Stock Availability:
├── Query: inventory.get(productId)
├── Returns: Inventory record
├── Check: available_stock >= requestedQuantity
└── Action: Allow or deny sale

Low Stock Alert:
├── Query: inventory.where('stock_level').below(reorderPoint)
├── Returns: Products below reorder point
├── Action: Generate reorder list
└── Display: Low stock warnings

Bulk Stock Update:
├── Prepare: Array of inventory updates
├── Call: inventory.bulkPut(updates)
├── Result: Multiple records updated
└── Use: After server sync
```

### Stock Synchronization Strategy

| Scenario | Handling |
|----------|----------|
| Sale Made | Decrease local stock immediately |
| Stock Received | Increase local stock, queue sync |
| Server Sync | Download current stock levels |
| Conflict | Server stock overrides local |
| Offline Changes | Track in sync queue |

### Low Stock Management

```
Reorder Point System:
├── Product stock falls below reorder_point
├── System generates alert
├── Suggested reorder: reorder_quantity
├── Display in dashboard
└── Generate purchase order
```

### Performance Optimization

| Strategy | Implementation | Benefit |
|----------|----------------|---------|
| Direct Lookup | product_id as primary key | Instant access |
| Batch Updates | bulkPut() for multiple items | Faster syncs |
| Calculation Cache | Store available_stock | No runtime calculation |
| Minimal Indexes | Only essential indexes | Better write performance |

### Expected Outcome
- Inventory table defined in database schema
- Product-based primary key configured
- Inventory interface created with stock tracking fields
- Table property added to POSDatabase class
- Ready for real-time inventory management

### Verification Checklist
- [ ] Inventory table added to schema stores()
- [ ] Primary key 'product_id' specified
- [ ] Inventory TypeScript interface created
- [ ] All required fields defined in interface
- [ ] inventory property added to POSDatabase class
- [ ] Table typed as Table<Inventory>
- [ ] Stock calculation logic documented
- [ ] Stock operation flows planned
- [ ] No TypeScript errors

---

## Task 08: Create Settings Table

### Overview
Create the Settings table schema to store application configuration and preferences locally. This table enables the POS system to maintain configuration settings offline, including tax rates, receipt templates, printer settings, and user preferences. Settings are stored as key-value pairs for flexibility.

### Dependencies
- Task 02: Create Database Schema

### Instructions

1. **Define Settings table in schema**
   - Locate POSDatabase class in database.ts
   - Add settings table to version().stores() declaration
   - Use simple key-value structure

2. **Use key as primary key**
   - Primary key is 'key' (string)
   - Each setting has unique key identifier
   - No auto-increment needed
   - Enables direct key-based lookup

3. **Plan for minimal indexing**
   - Primary key handles all lookups
   - No additional indexes needed
   - Simple structure for fast access

4. **Define complete Setting interface**
   - Create Setting interface with fields
   - Include key, value, type
   - Include description, category
   - Include is_synced, updated_at fields

5. **Add table declaration to POSDatabase**
   - Add settings property to class
   - Type it as Table<Setting>
   - Enable TypeScript support

6. **Plan setting categories**
   - General: Application settings
   - Tax: Tax rates and rules
   - Receipt: Receipt template and format
   - Printer: Printer configuration
   - Display: UI preferences
   - Security: Security settings

7. **Define value types**
   - String: Text values
   - Number: Numeric values
   - Boolean: True/false flags
   - JSON: Complex objects
   - Store type for proper parsing

### Settings Table Schema

| Field | Type | Indexed | Required | Purpose |
|-------|------|---------|----------|---------|
| key | string | Primary | Yes | Unique setting identifier |
| value | string | No | Yes | Setting value (stringified) |
| type | string | No | Yes | Value type (string/number/boolean/json) |
| description | string | No | No | Setting description |
| category | string | No | No | Setting category |
| is_synced | boolean | No | Yes | Synced with server |
| updated_at | Date | No | Yes | Last update timestamp |

### Dexie Schema Declaration

```
Schema Format:
settings: 'key'

Breakdown:
└── key  → Primary key (unique setting identifier)
```

### Setting Key Naming Convention

```
Naming Pattern:
[category].[specific_setting]

Examples:
├── tax.default_rate
├── tax.include_in_price
├── receipt.header_text
├── receipt.footer_text
├── printer.name
├── printer.width
├── display.theme
└── security.require_password
```

### Common Settings

| Key | Type | Example Value | Purpose |
|-----|------|---------------|---------|
| tax.default_rate | number | "18" | Default tax percentage |
| tax.include_in_price | boolean | "true" | Tax included in display price |
| receipt.header_text | string | "Thank you for shopping!" | Receipt header |
| receipt.footer_text | string | "Visit us again" | Receipt footer |
| receipt.logo_url | string | "/logo.png" | Receipt logo path |
| printer.name | string | "EPSON TM-T88" | Printer device name |
| printer.paper_width | number | "80" | Paper width in mm |
| display.theme | string | "light" | UI theme |
| display.language | string | "en" | Display language |
| security.pin_required | boolean | "true" | Require cashier PIN |

### Value Type Handling

```
Type System:
├── string
│   └── Store as-is
│
├── number
│   └── Store as string, parse on read
│
├── boolean
│   └── Store "true"/"false", parse on read
│
└── json
    └── JSON.stringify on write, JSON.parse on read
```

### Query Patterns

```
Get Single Setting:
├── Query: settings.get(key)
├── Returns: Setting object
├── Parse: Convert value based on type
└── Use: Application configuration

Get Settings by Category:
├── Query: settings.toArray()
├── Filter: items.filter(s => s.category === category)
├── Returns: Array of settings
└── Use: Display settings group

Update Setting:
├── Prepare: { key, value, type, updated_at }
├── Call: settings.put(setting)
├── Result: Setting updated
└── Queue: Sync to server
```

### Setting Access Helpers

```
Helper Function Pattern:
├── getSetting(key, defaultValue)
│   ├── Query database
│   ├── Parse value by type
│   └── Return value or default
│
├── setSetting(key, value, type)
│   ├── Validate value
│   ├── Stringify if needed
│   ├── Store in database
│   └── Queue sync
│
└── getSettingsByCategory(category)
    ├── Get all settings
    ├── Filter by category
    └── Return array
```

### Default Settings

```
Initial Settings to Create:
├── tax.default_rate: "18"
├── tax.include_in_price: "false"
├── receipt.header_text: "Thank You"
├── receipt.footer_text: "Visit Again"
├── printer.paper_width: "80"
├── display.theme: "light"
├── display.language: "en"
└── security.pin_required: "false"
```

### Synchronization Strategy

| Scenario | Handling |
|----------|----------|
| Server Settings | Download on initial sync |
| Local Changes | Queue for server sync |
| Conflict | Server settings take precedence |
| Offline Changes | Apply immediately, sync later |

### Expected Outcome
- Settings table defined in database schema
- Key-value structure configured
- Setting interface created with type support
- Table property added to POSDatabase class
- Ready to store application configuration

### Verification Checklist
- [ ] Settings table added to schema stores()
- [ ] Primary key 'key' specified
- [ ] Setting TypeScript interface created
- [ ] All required fields defined in interface
- [ ] settings property added to POSDatabase class
- [ ] Table typed as Table<Setting>
- [ ] Key naming convention documented
- [ ] Common settings listed
- [ ] Value type handling planned
- [ ] No TypeScript errors

---

## Task 09: Create SyncQueue Table

### Overview
Create the SyncQueue table schema to manage the queue of data changes that need to be synchronized with the server when internet connectivity is restored. This table is critical for reliable offline operation, tracking all create, update, and delete operations performed while offline, and ensuring data consistency with the backend.

### Dependencies
- Task 02: Create Database Schema

### Instructions

1. **Define SyncQueue table in schema**
   - Locate POSDatabase class in database.ts
   - Add sync_queue table to version().stores() declaration
   - Use auto-increment primary key

2. **Configure auto-increment ID**
   - Use '++id' syntax for auto-increment
   - Each sync item gets automatic sequential ID
   - No manual ID management required

3. **Add sync status index**
   - Index 'status' field for filtering
   - Enables quick lookup of pending/failed items
   - Critical for sync processing

4. **Add priority index**
   - Index 'priority' field for queue ordering
   - Enables processing high-priority items first
   - Improves sync efficiency

5. **Define complete SyncQueueItem interface**
   - Create SyncQueueItem interface with all fields
   - Include id, type, operation
   - Include data, priority, status
   - Include retries, max_retries, error
   - Include created_at, updated_at, synced_at fields

6. **Add table declaration to POSDatabase**
   - Add sync_queue property to class
   - Type it as Table<SyncQueueItem>
   - Enable TypeScript support

7. **Define sync item types**
   - sale: Sales transactions
   - inventory: Inventory adjustments
   - customer: Customer data changes
   - product: Product updates
   - payment: Payment records

8. **Plan sync operations**
   - create: Create new record on server
   - update: Update existing record
   - delete: Delete record on server

9. **Define status values**
   - pending: Waiting to sync
   - syncing: Currently syncing
   - success: Successfully synced
   - failed: Sync failed, will retry
   - abandoned: Max retries exceeded

10. **Implement priority levels**
    - 1: Critical (sales, payments)
    - 2: High (inventory, customers)
    - 3: Normal (products, settings)

### SyncQueue Table Schema

| Field | Type | Indexed | Required | Purpose |
|-------|------|---------|----------|---------|
| id | number | Primary | Auto | Unique queue item ID |
| type | string | No | Yes | Data type (sale/inventory/etc) |
| operation | string | No | Yes | Operation (create/update/delete) |
| data | object | No | Yes | Payload to sync |
| priority | number | Yes | Yes | Sync priority (1-3) |
| status | string | Yes | Yes | Sync status |
| retries | number | No | Yes | Attempt count |
| max_retries | number | No | Yes | Max retry limit |
| error | string | No | No | Last error message |
| created_at | Date | No | Yes | Queue timestamp |
| updated_at | Date | No | Yes | Last update timestamp |
| synced_at | Date | No | No | Successful sync timestamp |

### Dexie Schema Declaration

```
Schema Format:
sync_queue: '++id, status, priority'

Breakdown:
├── ++id      → Auto-increment primary key
├── status    → Index for filtering by status
└── priority  → Index for priority ordering
```

### Sync Queue Structure

```
Queue Processing Order:
1. Filter by status: 'pending' or 'failed'
2. Sort by priority: 1 (high) to 3 (low)
3. Sort by created_at: Oldest first
4. Process in order

Example Queue:
├── [Priority 1] Sale #123 (pending)
├── [Priority 1] Payment #456 (pending)
├── [Priority 2] Inventory Update (pending)
├── [Priority 2] Customer Update (failed, retry 1)
└── [Priority 3] Product Update (pending)
```

### Sync Item Types and Operations

| Type | Operations | Priority | Example Data |
|------|------------|----------|--------------|
| sale | create | 1 | Complete sale transaction |
| payment | create | 1 | Payment details |
| inventory | create, update | 2 | Stock adjustments |
| customer | create, update, delete | 2 | Customer records |
| product | create, update | 3 | Product updates |
| settings | update | 3 | Setting changes |

### Status Lifecycle

```
Sync Item Lifecycle:
├── pending
│   ├── Initial state
│   └── Ready for sync
│
├── syncing
│   ├── Sync in progress
│   └── Locked from retry
│
├── success
│   ├── Successfully synced
│   ├── Can be deleted
│   └── Archive for audit
│
├── failed
│   ├── Sync failed
│   ├── Will retry
│   └── retries++
│
└── abandoned
    ├── Max retries exceeded
    ├── Requires manual review
    └── Alert administrator
```

### Query Patterns

```
Get Pending Sync Items:
├── Query: sync_queue.where('status').equals('pending')
├── Sort: orderBy('priority').thenBy('created_at')
├── Returns: Items to sync
└── Action: Process sync queue

Retry Failed Items:
├── Query: sync_queue.where('status').equals('failed')
├── Filter: retries < max_retries
├── Update: status to 'pending'
└── Action: Retry sync

Clean Success Items:
├── Query: sync_queue.where('status').equals('success')
├── Filter: synced_at < 7 days ago
├── Action: Delete old success items
└── Purpose: Keep queue clean
```

### Retry Strategy

```
Exponential Backoff:
├── Attempt 1: Immediate
├── Attempt 2: 5 seconds
├── Attempt 3: 15 seconds
├── Attempt 4: 45 seconds
└── Attempt 5: 135 seconds (abandoned)

Max Retries: 5
Backoff Formula: delay = 5 * (3 ^ (retries - 1))
```

### Sync Processing Flow

```
Sync Process:
├── 1. Get pending items (priority order)
├── 2. For each item:
│   ├── Update status to 'syncing'
│   ├── Send data to server
│   ├── If success:
│   │   ├── Update status to 'success'
│   │   ├── Set synced_at timestamp
│   │   └── Update related record (e.g., sale.synced = true)
│   └── If failure:
│       ├── Increment retries
│       ├── Store error message
│       ├── Check if retries < max_retries
│       ├── If yes: status = 'failed' (will retry)
│       └── If no: status = 'abandoned'
├── 3. Wait for backoff delay
└── 4. Repeat until queue empty
```

### Error Handling

| Error Type | Action | Status | Retry |
|------------|--------|--------|-------|
| Network Error | Retry with backoff | failed | Yes |
| Server Error 5xx | Retry with backoff | failed | Yes |
| Client Error 4xx | Log and abandon | abandoned | No |
| Validation Error | Log and abandon | abandoned | No |
| Timeout | Retry with backoff | failed | Yes |

### Expected Outcome
- SyncQueue table defined in database schema
- Auto-increment ID and status/priority indexes configured
- SyncQueueItem interface created with all fields
- Table property added to POSDatabase class
- Ready to manage offline data synchronization

### Verification Checklist
- [ ] SyncQueue table added to schema stores()
- [ ] Auto-increment primary key '++id' specified
- [ ] Indexes added for status, priority
- [ ] SyncQueueItem TypeScript interface created
- [ ] All required fields defined in interface
- [ ] sync_queue property added to POSDatabase class
- [ ] Table typed as Table<SyncQueueItem>
- [ ] Sync types and operations documented
- [ ] Status lifecycle defined
- [ ] Priority levels defined
- [ ] Retry strategy documented
- [ ] No TypeScript errors

---

## Summary

This document established the foundation of the IndexedDB offline storage system by installing Dexie.js and creating all required database tables. The schema includes Products, Customers, Sales, SaleItems, Inventory, Settings, and SyncQueue tables, providing complete offline functionality for the POS system.

### Completed Tasks
1. ✓ Installed Dexie.js wrapper library
2. ✓ Created POSDatabase schema class
3. ✓ Created Products table with search indexes
4. ✓ Created Customers table with lookup indexes
5. ✓ Created Sales table with sync tracking
6. ✓ Created SaleItems table for transaction details
7. ✓ Created Inventory table for stock management
8. ✓ Created Settings table for configuration
9. ✓ Created SyncQueue table for offline synchronization

### Next Steps
Proceed to [02_Tasks-10-16_Indexes-Compression.md](02_Tasks-10-16_Indexes-Compression.md) to configure compound indexes, implement migration system, create seed data, add data compression, implement storage quota management, and set up data cleanup utilities.
