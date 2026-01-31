# Tasks 10-16: Indexes, Compression, and Storage Management

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 08 - POS Offline Enhancement  
> **Group:** A - IndexedDB Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 10, 11, 12, 13, 14, 15, 16

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-01-09_Dexie-Tables.md](01_Tasks-01-09_Dexie-Tables.md)
- **→ Next Group:** [Group-B_Service-Worker](../Group-B_Service-Worker/)

---

## Document Overview

This document covers advanced IndexedDB configuration including compound indexes for query optimization, migration system for schema versioning, seed data creation for initial testing, data compression for storage efficiency, storage quota monitoring, data cleanup utilities, and comprehensive IndexedDB verification. These features ensure the offline POS system operates efficiently and reliably.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 10 | Create Indexes | Low | 15 min |
| 11 | Create Migration System | Medium | 35 min |
| 12 | Create Seed Data | Low | 25 min |
| 13 | Create Data Compression | Medium | 30 min |
| 14 | Create Storage Quota | Low | 20 min |
| 15 | Create Data Cleanup | Low | 25 min |
| 16 | Verify IndexedDB | Low | 20 min |

---

## Task 10: Create Indexes

### Overview
Review and optimize the indexes defined in the database schema to ensure efficient query performance. While basic indexes were defined during table creation, this task focuses on verifying index effectiveness, considering compound indexes for common query patterns, and documenting index usage strategies for optimal performance.

### Dependencies
- Task 09: Create SyncQueue Table

### Instructions

1. **Review existing indexes**
   - Examine all indexes defined in Task 03-09
   - Verify each index serves a clear query purpose
   - Identify missing indexes for common queries

2. **Analyze query patterns**
   - List most frequent database queries
   - Identify queries that scan multiple fields
   - Determine which queries benefit from compound indexes

3. **Consider compound indexes**
   - Identify queries filtering by multiple fields
   - Evaluate if compound indexes improve performance
   - Note: Dexie v4 has limited compound index support
   - Use single-field indexes for flexibility

4. **Document index usage strategy**
   - Create documentation for each index
   - Explain query patterns each index supports
   - Provide query examples for developers

5. **Optimize index selectivity**
   - Ensure indexes on high-selectivity fields
   - Avoid indexing low-selectivity fields (e.g., boolean with few values)
   - Balance index count vs query performance

6. **Test index performance**
   - Create sample data for testing
   - Run queries with and without indexes
   - Measure query execution time
   - Verify indexes improve performance

7. **Plan for future indexes**
   - Document potential future indexes
   - Note requirements for compound indexes
   - Plan for schema version updates

### Current Index Summary

| Table | Indexes | Purpose |
|-------|---------|---------|
| products | id, sku, barcode, name, category_id | Product lookups and searches |
| customers | id, phone, email, name | Customer identification |
| sales | id, temp_id, customer_id, status, synced, created_at | Sales queries and sync |
| sale_items | id, sale_id, product_id | Relationship queries |
| inventory | product_id | Direct inventory lookup |
| settings | key | Setting retrieval |
| sync_queue | ++id, status, priority | Queue processing |

### Query Pattern Analysis

```
High-Frequency Queries:
├── Product by barcode (barcode scan)
│   └── Index: products.barcode
│
├── Customer by phone (customer lookup)
│   └── Index: customers.phone
│
├── Unsynced sales (sync processing)
│   └── Index: sales.synced
│
├── Items for sale (sale details)
│   └── Index: sale_items.sale_id
│
└── Pending sync queue (sync processing)
    └── Indexes: sync_queue.status, sync_queue.priority
```

### Compound Index Considerations

```
Potential Compound Indexes:
├── sales [status + synced]
│   ├── Query: Find completed unsynced sales
│   ├── Current: Two separate indexes
│   └── Alternative: Filter in code (small result sets)
│
├── sync_queue [status + priority]
│   ├── Query: Find pending items by priority
│   ├── Current: Two separate indexes
│   └── Note: Dexie can use multiple indexes
│
└── sales [customer_id + created_at]
    ├── Query: Customer sales in date range
    ├── Current: Two separate indexes
    └── Alternative: Filter dates in code
```

### Index Performance Guidelines

| Index Type | When to Use | When to Avoid |
|------------|-------------|---------------|
| Single Field | Most queries | Never, always beneficial |
| Compound | Multiple filter fields, large datasets | Small datasets, Dexie limitations |
| Multi-entry | Array fields | Non-array fields |
| Full-text | Text search | Structured data |

### Index Selectivity Analysis

```
High Selectivity (Good for indexing):
├── id (unique)
├── sku (unique or near-unique)
├── barcode (unique)
├── phone (unique per customer)
├── email (unique per customer)
└── temp_id (unique)

Medium Selectivity (Good for indexing):
├── name (multiple people share names)
├── category_id (products per category)
├── customer_id (sales per customer)
├── product_id (sales per product)
└── created_at (timestamp)

Low Selectivity (Consider carefully):
├── status (few distinct values)
├── synced (boolean: true/false)
├── priority (only 1-3)
└── is_active (boolean)
```

### Dexie Index Limitations

| Limitation | Description | Workaround |
|------------|-------------|------------|
| Limited Compound Index | Dexie v4 has basic compound index support | Use multiple single indexes |
| No Partial Index | Cannot index subset of records | Filter in application code |
| No Expression Index | Cannot index computed values | Store computed values |
| Array Indexes | Multi-entry support with * prefix | Use for array fields |

### Index Usage Examples

```
Barcode Scan Query:
├── Query: db.products.where('barcode').equals(scannedCode).first()
├── Index Used: products.barcode
├── Performance: O(log n) - fast lookup
└── Result: Single product or undefined

Customer Phone Lookup:
├── Query: db.customers.where('phone').equals(phoneNumber).first()
├── Index Used: customers.phone
├── Performance: O(log n) - fast lookup
└── Result: Customer record

Unsynced Sales:
├── Query: db.sales.where('synced').equals(false).toArray()
├── Index Used: sales.synced
├── Performance: O(log n + k) - k is result count
└── Result: Array of unsynced sales

Customer Sales in Date Range:
├── Query: db.sales
│           .where('customer_id').equals(customerId)
│           .filter(s => s.created_at >= startDate && s.created_at <= endDate)
├── Index Used: sales.customer_id
├── Additional Filter: Date range in code
└── Result: Customer sales in range
```

### Index Monitoring Strategy

| Metric | Method | Action |
|--------|--------|--------|
| Query Time | Measure with performance.now() | Optimize slow queries |
| Index Usage | Log queries using indexes | Remove unused indexes |
| Storage Size | navigator.storage.estimate() | Balance indexes vs space |
| Cache Hit Rate | Track cache effectiveness | Adjust caching strategy |

### Expected Outcome
- All necessary indexes verified and documented
- Query patterns analyzed and optimized
- Index usage strategy documented
- Performance testing completed
- Future index needs identified

### Verification Checklist
- [ ] All table indexes reviewed
- [ ] Query patterns documented
- [ ] Compound index needs evaluated
- [ ] Index selectivity analyzed
- [ ] Performance tests conducted
- [ ] Index usage examples created
- [ ] Documentation updated
- [ ] Future index requirements noted

---

## Task 11: Create Migration System

### Overview
Implement a database migration system using Dexie's built-in versioning to handle schema changes over time. This system enables safe database schema updates in production, allowing the application to evolve without breaking existing user data or requiring manual database resets.

### Dependencies
- Task 10: Create Indexes

### Instructions

1. **Understand Dexie version system**
   - Dexie uses numeric versions (1, 2, 3, etc.)
   - Each version defines schema changes
   - Versions are cumulative, not independent
   - Dexie auto-migrates from old to new versions

2. **Plan version 1 schema**
   - Version 1 is the current schema from Tasks 03-09
   - This is the baseline schema
   - All tables and indexes defined
   - No migration logic needed for v1

3. **Create migration structure**
   - Keep version 1 definition in database.ts
   - Add comments for future versions
   - Plan version increment strategy
   - Document when to create new versions

4. **Define migration triggers**
   - New table addition
   - New index on existing table
   - Table or field removal
   - Index modification or removal

5. **Implement version 2 example (future)**
   - Demonstrate how to add new version
   - Show adding new table or index
   - Include data migration if needed
   - Document upgrade logic

6. **Add version change handler**
   - Use Dexie upgrade() method for data migration
   - Transform existing data if schema changes
   - Handle null/default values for new fields
   - Test migration with sample data

7. **Create migration testing strategy**
   - Test upgrade from each old version
   - Verify data integrity after migration
   - Handle edge cases and errors
   - Document rollback procedures

8. **Document migration best practices**
   - When to increment version
   - How to handle breaking changes
   - Data transformation strategies
   - Testing requirements

### Dexie Version System Overview

```
Version Progression:
Version 1 (Current)
├── Initial schema
├── All 7 tables defined
└── Base indexes

Version 2 (Future Example)
├── All Version 1 tables
├── Add new table: returns
├── Add index: products.supplier_id
└── Migration logic (if needed)

Version 3 (Future)
├── All Version 2 schema
├── Add new fields
└── Data transformation
```

### Version Declaration Syntax

```
Current Version 1:
this.version(1).stores({
  products: 'id, sku, barcode, name, category_id',
  customers: 'id, phone, email, name',
  sales: 'id, temp_id, customer_id, status, synced, created_at',
  sale_items: 'id, sale_id, product_id',
  inventory: 'product_id',
  settings: 'key',
  sync_queue: '++id, status, priority'
});

Future Version 2 Example:
this.version(2).stores({
  products: 'id, sku, barcode, name, category_id, supplier_id', // Added supplier_id
  customers: 'id, phone, email, name',
  sales: 'id, temp_id, customer_id, status, synced, created_at',
  sale_items: 'id, sale_id, product_id',
  inventory: 'product_id',
  settings: 'key',
  sync_queue: '++id, status, priority',
  returns: 'id, sale_id, created_at' // New table
});
```

### Migration Triggers

| Trigger | Action | Version Increment |
|---------|--------|-------------------|
| Add Table | Create new table in stores() | Yes |
| Add Index | Add to table index list | Yes |
| Remove Index | Remove from index list | Yes |
| Remove Table | Set table to null | Yes |
| Add Field | No schema change needed | No |
| Remove Field | No schema change needed | No |
| Modify Field Type | Requires data migration | Yes |

### Data Migration Example

```
Version 2 with Data Migration:
this.version(2).stores({
  // Same schema as v2 above
}).upgrade(async (trans) => {
  // Migrate existing products
  const products = await trans.table('products').toArray();
  
  // Add default supplier_id to existing products
  await Promise.all(
    products.map(product => 
      trans.table('products').update(product.id, { 
        supplier_id: 'SUPPLIER_DEFAULT' 
      })
    )
  );
});

Version 3 - Transform Data:
this.version(3).stores({
  // Same schema
}).upgrade(async (trans) => {
  // Transform sale status from old format to new format
  const sales = await trans.table('sales').toArray();
  
  await Promise.all(
    sales.map(sale => {
      let newStatus = sale.status;
      // Transform old status values
      if (sale.status === 'complete') newStatus = 'completed';
      if (sale.status === 'pending') newStatus = 'draft';
      
      return trans.table('sales').update(sale.id, { status: newStatus });
    })
  );
});
```

### Migration Best Practices

| Practice | Description | Benefit |
|----------|-------------|---------|
| Test Thoroughly | Test migration on copy of production data | Prevent data loss |
| Backup First | Export data before migration | Enable rollback |
| Incremental | One version at a time | Easier debugging |
| Document Changes | Comment why version increased | Team awareness |
| Default Values | Provide defaults for new fields | Handle existing data |
| Validation | Verify data after migration | Ensure integrity |

### Version Increment Guidelines

```
When to Increment Version:
YES:
├── Adding new table
├── Adding index to table
├── Removing index from table
├── Removing table
└── Changing indexed field

NO:
├── Adding non-indexed field to table
├── Removing non-indexed field
├── Changing field that's not indexed
└── Modifying field values (do in upgrade())
```

### Migration Testing Checklist

```
Testing Requirements:
├── 1. Create database with Version 1
├── 2. Add sample data to all tables
├── 3. Upgrade to Version 2
├── 4. Verify schema changes applied
├── 5. Verify existing data preserved
├── 6. Verify new defaults applied
├── 7. Test queries on migrated data
├── 8. Check for performance issues
└── 9. Validate data integrity
```

### Error Handling

| Error Scenario | Handling Strategy |
|----------------|-------------------|
| Migration Fails | Dexie reverts to old schema automatically |
| Data Corruption | Keep backup, restore if needed |
| Version Conflict | Clear database, reload from server |
| Browser Compatibility | Test on all target browsers |

### Rollback Strategy

```
Rollback Options:
├── Option 1: Revert code to previous version
│   └── Browser keeps current schema until code downgrade
│
├── Option 2: Clear and reload database
│   ├── db.delete()
│   ├── Recreate with old version
│   └── Reload data from server
│
└── Option 3: Manual data export/import
    ├── Export data to JSON
    ├── Clear database
    ├── Create new database
    └── Import data
```

### Version Documentation Template

```
Version History:
├── Version 1 (2026-01-31)
│   ├── Initial schema
│   ├── Tables: products, customers, sales, sale_items, inventory, settings, sync_queue
│   └── Purpose: Baseline offline POS schema
│
├── Version 2 (Future)
│   ├── Added: returns table
│   ├── Added: products.supplier_id index
│   ├── Migration: Set default supplier_id
│   └── Purpose: Support product returns
│
└── Version 3 (Future)
    ├── Changed: Standardize status values
    ├── Migration: Transform old status to new format
    └── Purpose: Consistent status across tables
```

### Expected Outcome
- Migration system implemented using Dexie versioning
- Version 1 schema established as baseline
- Migration patterns documented for future use
- Testing strategy defined for schema changes
- Version history documentation created

### Verification Checklist
- [ ] Version 1 schema finalized
- [ ] Migration system structure documented
- [ ] Example Version 2 migration created
- [ ] Upgrade logic examples provided
- [ ] Migration triggers documented
- [ ] Testing checklist created
- [ ] Rollback strategy defined
- [ ] Version history template created
- [ ] Best practices documented

---

## Task 12: Create Seed Data

### Overview
Create seed data utilities to populate the database with sample data for development, testing, and demonstration purposes. Seed data enables testing of all offline POS features without requiring server connectivity, facilitating development and quality assurance.

### Dependencies
- Task 11: Create Migration System

### Instructions

1. **Create seed data directory**
   - Navigate to lib/offline directory
   - Create new file named 'seed-data.ts'
   - This file will contain all seeding functions

2. **Define sample products**
   - Create array of product objects
   - Include variety of categories
   - Include different price points
   - Cover edge cases (no barcode, special characters)

3. **Define sample customers**
   - Create array of customer objects
   - Include various loyalty point levels
   - Include customers with and without email
   - Cover different phone number formats

4. **Define sample sales**
   - Create completed sales with line items
   - Include some unsynced sales
   - Include sales with different statuses
   - Link to sample customers

5. **Define sample inventory**
   - Create inventory records for products
   - Include various stock levels
   - Include low stock items
   - Include out of stock items

6. **Define sample settings**
   - Create common settings
   - Include tax rate, receipt text, printer settings
   - Include display preferences
   - Cover all setting categories

7. **Create seeding functions**
   - Create seedProducts() function
   - Create seedCustomers() function
   - Create seedSales() function
   - Create seedInventory() function
   - Create seedSettings() function
   - Create seedAll() master function

8. **Implement idempotent seeding**
   - Check if data already exists
   - Clear existing data before seeding
   - Use clearAllData() function
   - Prevent duplicate seeding

9. **Add seed data in development mode**
   - Call seed functions on app initialization
   - Only in development environment
   - Skip in production
   - Provide UI button to reseed

### Sample Data Structure

```
Seed Data Organization:
├── Products (15-20 items)
│   ├── Electronics category
│   ├── Clothing category
│   ├── Food category
│   └── Miscellaneous category
│
├── Customers (5-10 customers)
│   ├── Regular customers
│   ├── VIP customers
│   └── New customers
│
├── Sales (5-10 completed sales)
│   ├── Synced sales
│   ├── Unsynced sales
│   └── Sales with multiple items
│
├── Inventory (Matches products)
│   ├── In-stock items
│   ├── Low-stock items
│   └── Out-of-stock items
│
└── Settings (10-15 settings)
    ├── Tax settings
    ├── Receipt settings
    ├── Printer settings
    └── Display settings
```

### Sample Product Data

| SKU | Name | Category | Price | Barcode | Stock |
|-----|------|----------|-------|---------|-------|
| ELEC001 | Laptop Computer | Electronics | 75000 | 1234567890123 | 10 |
| ELEC002 | Wireless Mouse | Electronics | 2500 | 1234567890124 | 50 |
| CLOTH001 | T-Shirt Blue | Clothing | 1500 | 1234567890125 | 30 |
| CLOTH002 | Jeans Black | Clothing | 4500 | 1234567890126 | 20 |
| FOOD001 | Rice 5kg | Food | 1200 | 1234567890127 | 100 |
| FOOD002 | Cooking Oil 1L | Food | 800 | 1234567890128 | 75 |

### Sample Customer Data

| Name | Phone | Email | Loyalty Points |
|------|-------|-------|----------------|
| John Silva | +94771234567 | john@example.com | 500 |
| Mary Fernando | +94772345678 | mary@example.com | 1200 |
| David Perera | +94773456789 | - | 150 |
| Sarah Dias | +94774567890 | sarah@example.com | 850 |
| Michael Kumar | +94775678901 | mike@example.com | 2300 |

### Sample Sales Structure

```
Sale Example:
├── Sale ID: OFFLINE_1738360800000_a3k9f2
├── Customer: John Silva
├── Status: completed
├── Synced: false
├── Items:
│   ├── Laptop Computer × 1 = Rs. 75,000
│   └── Wireless Mouse × 2 = Rs. 5,000
├── Subtotal: Rs. 80,000
├── Tax (18%): Rs. 14,400
└── Total: Rs. 94,400
```

### Seeding Function Structure

```
Seed Function Pattern:
async function seedProducts() {
  // Check if products already exist
  const count = await db.products.count();
  if (count > 0) {
    console.log('Products already seeded');
    return;
  }
  
  // Define sample products
  const products = [
    { id: 'PROD001', sku: 'ELEC001', /* ... */ },
    { id: 'PROD002', sku: 'ELEC002', /* ... */ },
    // ... more products
  ];
  
  // Insert products
  await db.products.bulkAdd(products);
  console.log(`Seeded ${products.length} products`);
}

Master Seed Function:
async function seedAll() {
  console.log('Starting database seeding...');
  
  await seedProducts();
  await seedCustomers();
  await seedSales();
  await seedInventory();
  await seedSettings();
  
  console.log('Database seeding complete');
}
```

### Clear Data Function

```
Clear Function:
async function clearAllData() {
  await db.products.clear();
  await db.customers.clear();
  await db.sales.clear();
  await db.sale_items.clear();
  await db.inventory.clear();
  await db.settings.clear();
  await db.sync_queue.clear();
  
  console.log('All data cleared');
}

Reseed Function:
async function reseedDatabase() {
  await clearAllData();
  await seedAll();
  console.log('Database reseeded');
}
```

### Development Integration

```
App Initialization:
if (process.env.NODE_ENV === 'development') {
  // Check if database is empty
  const productCount = await db.products.count();
  
  if (productCount === 0) {
    // Seed data on first load
    await seedAll();
  }
}

Development UI:
<DevTools>
  <Button onClick={reseedDatabase}>
    Reseed Database
  </Button>
  <Button onClick={clearAllData}>
    Clear All Data
  </Button>
</DevTools>
```

### Seed Data Best Practices

| Practice | Description | Benefit |
|----------|-------------|---------|
| Realistic Data | Use realistic values | Better testing |
| Edge Cases | Include edge cases | Catch bugs |
| Relationships | Link related data correctly | Test joins |
| Variety | Diverse data types | Comprehensive testing |
| Volume | Sufficient quantity | Performance testing |
| Idempotent | Safe to run multiple times | No duplicates |

### Testing with Seed Data

```
Test Scenarios:
├── Product Search
│   ├── Search by name
│   ├── Search by SKU
│   └── Scan barcode
│
├── Customer Lookup
│   ├── Lookup by phone
│   ├── Lookup by email
│   └── Search by name
│
├── Sales Processing
│   ├── Create new sale
│   ├── Add items to sale
│   ├── Apply customer discount
│   └── Complete sale
│
├── Inventory Management
│   ├── Check stock levels
│   ├── Low stock alerts
│   └── Stock deduction on sale
│
└── Data Synchronization
    ├── Queue unsynced sales
    ├── Process sync queue
    └── Handle sync errors
```

### Expected Outcome
- Seed data file created with sample data
- Seeding functions implemented for all tables
- Clear and reseed utilities available
- Development mode integration complete
- Sufficient data for comprehensive testing

### Verification Checklist
- [ ] seed-data.ts file created
- [ ] Sample products defined (15-20)
- [ ] Sample customers defined (5-10)
- [ ] Sample sales defined (5-10)
- [ ] Sample inventory data defined
- [ ] Sample settings defined
- [ ] seedProducts() function implemented
- [ ] seedCustomers() function implemented
- [ ] seedSales() function implemented
- [ ] seedInventory() function implemented
- [ ] seedSettings() function implemented
- [ ] seedAll() master function created
- [ ] clearAllData() function created
- [ ] reseedDatabase() function created
- [ ] Development mode integration added
- [ ] Testing with seed data validated

---

## Task 13: Create Data Compression

### Overview
Implement data compression utilities using LZ-String library to reduce storage footprint for large text fields in the IndexedDB database. Compression is especially beneficial for fields like product descriptions, customer notes, sale metadata, and sync queue payloads, enabling more efficient use of browser storage quotas.

### Dependencies
- Task 12: Create Seed Data

### Instructions

1. **Install LZ-String library**
   - Run package manager install command
   - Use lz-string package for compression
   - Verify installation in package.json
   - Import LZString in compression utilities

2. **Create compression utilities file**
   - Create file lib/offline/compression.ts
   - Import LZ-String methods
   - Create compression wrapper functions
   - Add error handling

3. **Implement compress function**
   - Accept string data as input
   - Use LZString.compress() method
   - Return compressed string
   - Handle null/undefined gracefully

4. **Implement decompress function**
   - Accept compressed string as input
   - Use LZString.decompress() method
   - Return original string
   - Handle corruption errors

5. **Create typed compression helpers**
   - Create compressJSON() for object compression
   - Create decompressJSON() for object decompression
   - Combine JSON.stringify with compression
   - Handle serialization errors

6. **Identify fields for compression**
   - Product: description, metadata
   - Customer: notes, metadata
   - Sale: notes, metadata
   - SyncQueue: data payload
   - Settings: large JSON values

7. **Implement compression in data operations**
   - Compress before storing to database
   - Decompress after retrieving from database
   - Create helper functions for common patterns
   - Document which fields are compressed

8. **Add compression performance monitoring**
   - Log original vs compressed size
   - Calculate compression ratio
   - Track compression time
   - Report storage savings

9. **Handle compression errors gracefully**
   - Try-catch blocks around compression
   - Fallback to uncompressed if compression fails
   - Log errors for debugging
   - Ensure data integrity

### LZ-String Installation

| Package | lz-string |
|---------|-----------|
| Version | ^1.5.0 |
| Type | Production dependency |
| Size | ~20KB minified |

### Compression Utility Functions

```
Basic Compression:
├── compress(data: string): string
│   ├── Input: Raw string
│   ├── Process: LZString.compress()
│   └── Output: Compressed string
│
└── decompress(compressed: string): string
    ├── Input: Compressed string
    ├── Process: LZString.decompress()
    └── Output: Original string

JSON Compression:
├── compressJSON(obj: any): string
│   ├── Input: JavaScript object
│   ├── Process: JSON.stringify() → compress()
│   └── Output: Compressed JSON string
│
└── decompressJSON<T>(compressed: string): T
    ├── Input: Compressed JSON string
    ├── Process: decompress() → JSON.parse()
    └── Output: Original object
```

### Compression Implementation Example

```
Compression Utilities:
export function compress(data: string | null | undefined): string | null {
  if (!data) return null;
  
  try {
    return LZString.compress(data);
  } catch (error) {
    console.error('Compression failed:', error);
    return data; // Fallback to uncompressed
  }
}

export function decompress(compressed: string | null | undefined): string | null {
  if (!compressed) return null;
  
  try {
    return LZString.decompress(compressed);
  } catch (error) {
    console.error('Decompression failed:', error);
    return compressed; // Return as-is if decompression fails
  }
}

export function compressJSON(obj: any): string | null {
  if (!obj) return null;
  
  try {
    const json = JSON.stringify(obj);
    return compress(json);
  } catch (error) {
    console.error('JSON compression failed:', error);
    return null;
  }
}

export function decompressJSON<T>(compressed: string | null | undefined): T | null {
  if (!compressed) return null;
  
  try {
    const json = decompress(compressed);
    return json ? JSON.parse(json) : null;
  } catch (error) {
    console.error('JSON decompression failed:', error);
    return null;
  }
}
```

### Fields to Compress

| Table | Field | Reason | Compression Type |
|-------|-------|--------|------------------|
| products | description | Long text | String |
| products | metadata | Complex object | JSON |
| customers | notes | Long text | String |
| customers | metadata | Complex object | JSON |
| sales | notes | Long text | String |
| sales | metadata | Complex object | JSON |
| sync_queue | data | Large payloads | JSON |
| settings | value | Large JSON configs | Conditional |

### Compression Integration Pattern

```
Storing Product with Compression:
async function saveProduct(product: Product) {
  const compressed = {
    ...product,
    description: compress(product.description),
    metadata: compressJSON(product.metadata)
  };
  
  await db.products.put(compressed);
}

Retrieving Product with Decompression:
async function getProduct(id: string): Promise<Product> {
  const compressed = await db.products.get(id);
  
  if (!compressed) return null;
  
  return {
    ...compressed,
    description: decompress(compressed.description),
    metadata: decompressJSON(compressed.metadata)
  };
}

Bulk Operations:
async function getAllProducts(): Promise<Product[]> {
  const compressed = await db.products.toArray();
  
  return compressed.map(p => ({
    ...p,
    description: decompress(p.description),
    metadata: decompressJSON(p.metadata)
  }));
}
```

### Compression Performance Metrics

```
Compression Analysis:
├── Original Size: 1000 bytes
├── Compressed Size: 400 bytes
├── Compression Ratio: 60%
├── Storage Saved: 600 bytes
└── Compression Time: 2ms

Calculate Compression Ratio:
const originalSize = new Blob([originalData]).size;
const compressedSize = new Blob([compressedData]).size;
const ratio = ((originalSize - compressedSize) / originalSize) * 100;
console.log(`Compression ratio: ${ratio.toFixed(1)}%`);
```

### When to Use Compression

| Scenario | Compress? | Reason |
|----------|-----------|--------|
| Long descriptions | Yes | Significant size reduction |
| Large metadata objects | Yes | JSON serialization is verbose |
| Short strings (<50 chars) | No | Overhead exceeds benefit |
| Numeric values | No | Numbers are already compact |
| IDs and SKUs | No | Short identifiers |
| Large JSON payloads | Yes | JSON is highly compressible |
| Frequently accessed data | Consider | Decompression adds overhead |

### Compression Thresholds

```
Compression Decision Logic:
function shouldCompress(data: string): boolean {
  // Don't compress if null or undefined
  if (!data) return false;
  
  // Don't compress short strings
  if (data.length < 100) return false;
  
  // Compress longer strings
  return true;
}

Conditional Compression:
function smartCompress(data: string): string {
  return shouldCompress(data) ? compress(data) : data;
}
```

### Error Handling Strategy

| Error Type | Handling | Fallback |
|------------|----------|----------|
| Compression Fails | Log error | Store uncompressed |
| Decompression Fails | Log error | Return compressed data |
| JSON Parse Error | Log error | Return null |
| Null/Undefined Input | Skip processing | Return input as-is |
| Memory Limit | Catch error | Use uncompressed |

### Performance Considerations

```
Optimization Strategies:
├── Lazy Decompression
│   └── Decompress only when field is accessed
│
├── Caching
│   └── Cache decompressed data in memory
│
├── Batch Processing
│   └── Compress/decompress multiple items together
│
└── Selective Compression
    └── Compress only fields above size threshold
```

### Expected Outcome
- LZ-String library installed
- Compression utilities created
- Compress and decompress functions implemented
- JSON compression helpers available
- Compression integrated into data operations
- Storage savings achieved

### Verification Checklist
- [ ] lz-string package installed
- [ ] compression.ts file created
- [ ] compress() function implemented
- [ ] decompress() function implemented
- [ ] compressJSON() function implemented
- [ ] decompressJSON() function implemented
- [ ] Error handling added to all functions
- [ ] Fields for compression identified
- [ ] Compression integrated into save operations
- [ ] Decompression integrated into load operations
- [ ] Performance monitoring implemented
- [ ] Compression thresholds defined
- [ ] Testing with sample data completed

---

## Task 14: Create Storage Quota

### Overview
Implement storage quota monitoring using the Navigator Storage API to track IndexedDB usage and prevent exceeding browser storage limits. This system alerts users when storage is running low and provides utilities to free up space by removing old or unnecessary data.

### Dependencies
- Task 13: Create Data Compression

### Instructions

1. **Create storage utilities file**
   - Create file lib/offline/storage-quota.ts
   - Import Navigator Storage API types
   - Create quota checking functions
   - Add warning threshold constants

2. **Implement quota estimation**
   - Use navigator.storage.estimate() API
   - Retrieve quota and usage values
   - Calculate percentage used
   - Handle browser compatibility

3. **Define storage thresholds**
   - Warning threshold: 75% of quota
   - Critical threshold: 90% of quota
   - Emergency threshold: 95% of quota
   - Set cleanup trigger points

4. **Create quota checking function**
   - Check current usage vs quota
   - Return usage statistics object
   - Determine warning level
   - Provide storage recommendations

5. **Implement quota monitoring**
   - Check quota periodically (e.g., every hour)
   - Check after large data operations
   - Show warnings when thresholds exceeded
   - Log quota status to console

6. **Create storage info display**
   - Format bytes to human-readable (MB, GB)
   - Display used, available, and total storage
   - Show percentage bar in UI
   - Provide cleanup suggestions

7. **Handle quota exceeded scenarios**
   - Catch QuotaExceededError
   - Trigger automatic cleanup
   - Notify user of storage issue
   - Suggest clearing old data

8. **Implement fallback strategies**
   - Reduce data retention periods
   - Compress more aggressively
   - Remove synced data earlier
   - Prioritize critical data

### Storage API Structure

```
Navigator Storage API:
navigator.storage.estimate()
├── Returns Promise<StorageEstimate>
├── Properties:
│   ├── quota: number (bytes available)
│   ├── usage: number (bytes used)
│   └── usageDetails: object (breakdown by storage type)
└── Browser Support: Chrome, Firefox, Edge, Safari
```

### Storage Quota Function

```
Quota Check Function:
async function getStorageQuota() {
  if (!navigator.storage || !navigator.storage.estimate) {
    return {
      supported: false,
      quota: 0,
      usage: 0,
      percentage: 0,
      available: 0
    };
  }
  
  const estimate = await navigator.storage.estimate();
  const quota = estimate.quota || 0;
  const usage = estimate.usage || 0;
  const percentage = quota > 0 ? (usage / quota) * 100 : 0;
  const available = quota - usage;
  
  return {
    supported: true,
    quota,
    usage,
    percentage,
    available,
    formattedQuota: formatBytes(quota),
    formattedUsage: formatBytes(usage),
    formattedAvailable: formatBytes(available),
    warningLevel: getWarningLevel(percentage)
  };
}

Warning Level Function:
function getWarningLevel(percentage: number): 'safe' | 'warning' | 'critical' | 'emergency' {
  if (percentage >= 95) return 'emergency';
  if (percentage >= 90) return 'critical';
  if (percentage >= 75) return 'warning';
  return 'safe';
}
```

### Storage Thresholds

| Level | Percentage | Action | User Message |
|-------|------------|--------|--------------|
| Safe | 0-74% | None | Storage healthy |
| Warning | 75-89% | Log warning | Storage filling up |
| Critical | 90-94% | Show alert | Low storage space |
| Emergency | 95-100% | Force cleanup | Storage almost full |

### Byte Formatting Utility

```
Format Bytes Function:
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

Examples:
├── 1024 → "1 KB"
├── 1048576 → "1 MB"
├── 104857600 → "100 MB"
└── 1073741824 → "1 GB"
```

### Quota Monitoring Strategy

```
Periodic Monitoring:
├── Check quota on app initialization
├── Check after data sync operations
├── Check hourly during active use
├── Check before large data operations
└── Check after data cleanup

Monitoring Implementation:
// Check on app start
useEffect(() => {
  checkStorageQuota();
}, []);

// Check hourly
useEffect(() => {
  const interval = setInterval(checkStorageQuota, 60 * 60 * 1000);
  return () => clearInterval(interval);
}, []);

// Check after data operations
async function saveData(data) {
  await db.table.add(data);
  await checkStorageQuota();
}
```

### Storage Warning UI

```
UI Display Structure:
┌─────────────────────────────────────┐
│  Storage Usage                      │
│                                     │
│  ████████████░░░░░░ 75% Used        │
│                                     │
│  Used: 150 MB / 200 MB             │
│  Available: 50 MB                   │
│                                     │
│  ⚠ Warning: Storage filling up      │
│  Consider cleaning old data         │
│                                     │
│  [Clean Old Data] [Details]        │
└─────────────────────────────────────┘
```

### Quota Exceeded Error Handling

```
Error Handler:
async function handleQuotaExceeded() {
  console.error('Storage quota exceeded');
  
  // 1. Try automatic cleanup
  await cleanupOldSyncedSales();
  
  // 2. Check if cleanup freed space
  const quota = await getStorageQuota();
  
  if (quota.warningLevel === 'emergency') {
    // 3. More aggressive cleanup
    await cleanupAllSyncedData();
    await removeOldDrafts();
  }
  
  // 4. Notify user
  showNotification({
    type: 'warning',
    title: 'Storage Full',
    message: 'Some data has been cleaned up to free space.'
  });
}

Catch Quota Error:
try {
  await db.sales.add(newSale);
} catch (error) {
  if (error.name === 'QuotaExceededError') {
    await handleQuotaExceeded();
    // Retry operation
    await db.sales.add(newSale);
  }
}
```

### Browser Storage Quotas

| Browser | Typical Quota | Notes |
|---------|---------------|-------|
| Chrome | ~60% of disk space | Shared across all origins |
| Firefox | Up to 2GB per origin | Can request more |
| Safari | ~1GB | More restrictive |
| Edge | ~60% of disk space | Similar to Chrome |

### Storage Management Recommendations

```
Storage Optimization Tips:
├── Sync and Remove Old Sales
│   └── Keep only last 30 days locally
│
├── Compress Large Fields
│   └── Descriptions, notes, metadata
│
├── Remove Synced Data
│   └── Delete after 7 days of successful sync
│
├── Limit Product Catalog
│   └── Sync only active products
│
└── Clear Cache Periodically
    └── User-triggered or automatic
```

### Expected Outcome
- Storage quota utilities created
- Quota monitoring implemented
- Warning thresholds defined
- UI displays storage status
- Quota exceeded errors handled gracefully
- Cleanup strategies implemented

### Verification Checklist
- [ ] storage-quota.ts file created
- [ ] getStorageQuota() function implemented
- [ ] navigator.storage.estimate() integrated
- [ ] Quota and usage calculated
- [ ] Warning levels defined
- [ ] formatBytes() utility created
- [ ] Periodic quota monitoring implemented
- [ ] Storage warning UI created
- [ ] Quota exceeded error handling added
- [ ] Automatic cleanup triggered on low storage
- [ ] User notifications implemented
- [ ] Browser compatibility tested

---

## Task 15: Create Data Cleanup

### Overview
Implement data cleanup utilities to automatically remove old, synced, or unnecessary data from IndexedDB, freeing up storage space and maintaining database performance. Cleanup strategies include removing old synced sales, clearing success sync queue items, and purging stale data based on retention policies.

### Dependencies
- Task 14: Create Storage Quota

### Instructions

1. **Create cleanup utilities file**
   - Create file lib/offline/cleanup.ts
   - Import database instance
   - Create cleanup functions for each table
   - Add configurable retention policies

2. **Define retention policies**
   - Sales: Keep 30 days
   - Synced sales: Remove after 7 days
   - Success sync items: Remove after 7 days
   - Failed sync items: Keep 30 days for retry
   - Draft sales: Keep 7 days

3. **Implement cleanup for synced sales**
   - Find sales where synced = true
   - Filter sales older than 7 days
   - Delete sale and related sale_items
   - Log number of records removed

4. **Implement cleanup for sync queue**
   - Find items with status 'success'
   - Filter items older than 7 days
   - Delete success items
   - Keep failed items for debugging

5. **Implement cleanup for draft sales**
   - Find sales with status 'draft'
   - Filter drafts older than 7 days
   - Delete old drafts and items
   - Prevent data loss for active drafts

6. **Create master cleanup function**
   - Call all cleanup functions
   - Run in sequence
   - Log total space freed
   - Return cleanup statistics

7. **Implement automatic cleanup scheduling**
   - Run cleanup daily at startup
   - Run cleanup when storage warning triggered
   - Allow manual cleanup trigger
   - Configure cleanup frequency

8. **Add cleanup safeguards**
   - Never delete unsynced data
   - Confirm before bulk deletions
   - Backup before major cleanup
   - Validate data integrity after cleanup

9. **Create cleanup analytics**
   - Track records deleted
   - Calculate storage freed
   - Log cleanup duration
   - Report cleanup success rate

### Retention Policy Configuration

```
Retention Policies:
const RETENTION_POLICIES = {
  // Sales
  SYNCED_SALES_DAYS: 7,          // Remove synced sales after 7 days
  UNSYNCED_SALES_DAYS: 30,        // Keep unsynced sales for 30 days
  DRAFT_SALES_DAYS: 7,            // Remove old drafts after 7 days
  
  // Sync Queue
  SUCCESS_SYNC_DAYS: 7,           // Remove success items after 7 days
  FAILED_SYNC_DAYS: 30,           // Keep failed items for 30 days
  
  // Other
  INACTIVE_PRODUCTS_DAYS: 90,     // Archive inactive products
  OLD_CUSTOMERS_DAYS: 365,        // Keep customers for 1 year
};
```

### Cleanup Functions

```
Cleanup Synced Sales:
async function cleanupSyncedSales(): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_POLICIES.SYNCED_SALES_DAYS);
  
  // Find old synced sales
  const oldSales = await db.sales
    .where('synced').equals(true)
    .and(sale => sale.synced_at < cutoffDate)
    .toArray();
  
  // Delete sales and their items
  for (const sale of oldSales) {
    await db.sale_items.where('sale_id').equals(sale.id).delete();
    await db.sales.delete(sale.id);
  }
  
  console.log(`Cleaned up ${oldSales.length} synced sales`);
  return oldSales.length;
}

Cleanup Sync Queue:
async function cleanupSyncQueue(): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_POLICIES.SUCCESS_SYNC_DAYS);
  
  // Delete old success items
  const deleted = await db.sync_queue
    .where('status').equals('success')
    .and(item => item.synced_at < cutoffDate)
    .delete();
  
  console.log(`Cleaned up ${deleted} sync queue items`);
  return deleted;
}

Cleanup Draft Sales:
async function cleanupDraftSales(): Promise<number> {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_POLICIES.DRAFT_SALES_DAYS);
  
  // Find old draft sales
  const oldDrafts = await db.sales
    .where('status').equals('draft')
    .and(sale => sale.created_at < cutoffDate)
    .toArray();
  
  // Delete drafts and their items
  for (const draft of oldDrafts) {
    await db.sale_items.where('sale_id').equals(draft.id).delete();
    await db.sales.delete(draft.id);
  }
  
  console.log(`Cleaned up ${oldDrafts.length} draft sales`);
  return oldDrafts.length;
}

Master Cleanup Function:
async function cleanupAllData(): Promise<CleanupResult> {
  console.log('Starting data cleanup...');
  const startTime = performance.now();
  
  const result = {
    syncedSales: await cleanupSyncedSales(),
    syncQueue: await cleanupSyncQueue(),
    draftSales: await cleanupDraftSales(),
    totalRecords: 0,
    durationMs: 0
  };
  
  result.totalRecords = result.syncedSales + result.syncQueue + result.draftSales;
  result.durationMs = performance.now() - startTime;
  
  console.log(`Cleanup complete: ${result.totalRecords} records removed in ${result.durationMs.toFixed(0)}ms`);
  return result;
}
```

### Cleanup Safeguards

| Safeguard | Implementation | Purpose |
|-----------|----------------|---------|
| Unsynced Data | Never delete synced=false | Prevent data loss |
| Recent Data | Check date thresholds | Keep active data |
| Confirmation | Ask user before cleanup | Prevent accidents |
| Validation | Verify after cleanup | Ensure integrity |
| Logging | Log all deletions | Audit trail |

### Cleanup Scheduling

```
Automatic Cleanup:
├── On App Startup
│   └── Run cleanup if last cleanup > 24 hours
│
├── Storage Warning
│   └── Run cleanup when storage > 75%
│
├── Daily Schedule
│   └── Run cleanup at 3 AM local time
│
└── Manual Trigger
    └── User clicks "Clean Old Data" button

Cleanup Scheduler:
async function scheduleCleanup() {
  // Check if cleanup needed
  const lastCleanup = await getLastCleanupTime();
  const hoursSinceCleanup = (Date.now() - lastCleanup) / (1000 * 60 * 60);
  
  if (hoursSinceCleanup >= 24) {
    await cleanupAllData();
    await setLastCleanupTime(Date.now());
  }
}

// Run on app startup
scheduleCleanup();

// Run when storage warning
if (storageQuota.warningLevel === 'critical') {
  await cleanupAllData();
}
```

### Cleanup UI Integration

```
Cleanup UI:
┌─────────────────────────────────────┐
│  Data Management                    │
│                                     │
│  Last Cleanup: 2 days ago           │
│                                     │
│  Cleanable Data:                    │
│  • 45 synced sales (7+ days old)    │
│  • 123 success sync items           │
│  • 5 old draft sales                │
│                                     │
│  Est. Space to Free: 8.5 MB         │
│                                     │
│  [Run Cleanup Now]                  │
└─────────────────────────────────────┘

Cleanup Confirmation:
┌─────────────────────────────────────┐
│  Confirm Data Cleanup               │
│                                     │
│  This will remove:                  │
│  • Old synced sales                 │
│  • Success sync queue items         │
│  • Abandoned draft sales            │
│                                     │
│  ✓ Unsynced data will be kept       │
│  ✓ Recent data will be kept         │
│                                     │
│  [Cancel]  [Confirm Cleanup]        │
└─────────────────────────────────────┘
```

### Cleanup Analytics

```
Cleanup Statistics:
{
  "timestamp": "2026-01-31T10:00:00Z",
  "durationMs": 245,
  "recordsDeleted": {
    "syncedSales": 45,
    "syncQueue": 123,
    "draftSales": 5,
    "total": 173
  },
  "storageFreed": "8.5 MB",
  "errors": 0
}

Track Cleanup History:
async function logCleanupResult(result: CleanupResult) {
  const log = {
    timestamp: new Date(),
    ...result
  };
  
  // Store in settings table
  const history = await getCleanupHistory();
  history.push(log);
  
  // Keep only last 10 cleanup records
  const recent = history.slice(-10);
  await db.settings.put({
    key: 'cleanup_history',
    value: JSON.stringify(recent),
    type: 'json'
  });
}
```

### Performance Optimization

| Strategy | Implementation | Benefit |
|----------|----------------|---------|
| Batch Deletion | Delete in batches of 100 | Avoid memory issues |
| Transaction | Use single transaction | Faster execution |
| Indexing | Use indexed queries | Quick filtering |
| Background | Run in Web Worker | Don't block UI |
| Throttle | Limit cleanup frequency | Reduce overhead |

### Expected Outcome
- Cleanup utilities created for all tables
- Retention policies defined and configurable
- Automatic cleanup scheduling implemented
- Manual cleanup trigger available
- Storage space freed effectively
- Data integrity maintained

### Verification Checklist
- [ ] cleanup.ts file created
- [ ] Retention policies defined
- [ ] cleanupSyncedSales() function implemented
- [ ] cleanupSyncQueue() function implemented
- [ ] cleanupDraftSales() function implemented
- [ ] cleanupAllData() master function created
- [ ] Safeguards implemented (never delete unsynced)
- [ ] Automatic cleanup scheduling added
- [ ] Manual cleanup trigger in UI
- [ ] Cleanup statistics tracked
- [ ] Cleanup analytics logged
- [ ] Performance tested with large datasets
- [ ] User confirmations implemented

---

## Task 16: Verify IndexedDB

### Overview
Perform comprehensive verification of the complete IndexedDB setup to ensure all tables, indexes, functions, and utilities are working correctly. This verification includes testing database operations, validating data integrity, checking performance, and confirming offline functionality.

### Dependencies
- Task 15: Create Data Cleanup

### Instructions

1. **Verify database initialization**
   - Confirm database opens successfully
   - Verify correct database name and version
   - Check all seven tables exist
   - Validate table schemas match definitions

2. **Test basic CRUD operations**
   - Test Create: Add records to each table
   - Test Read: Retrieve records by ID
   - Test Update: Modify existing records
   - Test Delete: Remove records from tables

3. **Verify indexes and queries**
   - Test indexed queries (equals, anyOf)
   - Test non-indexed queries (filter)
   - Verify query performance with indexes
   - Test compound query patterns

4. **Test data relationships**
   - Create sale with multiple sale items
   - Verify sale-customer relationship
   - Test product-inventory linkage
   - Validate sync queue relationships

5. **Test seed data functionality**
   - Run seedAll() function
   - Verify all tables populated
   - Check data relationships correct
   - Test clearAllData() and reseed

6. **Verify compression utilities**
   - Test compress() and decompress()
   - Test compressJSON() and decompressJSON()
   - Verify data integrity after compression
   - Measure compression ratios

7. **Test storage quota monitoring**
   - Check getStorageQuota() returns correct data
   - Verify warning levels trigger appropriately
   - Test quota exceeded error handling
   - Validate formatted output

8. **Test data cleanup utilities**
   - Run cleanup functions with test data
   - Verify correct records deleted
   - Confirm unsynced data preserved
   - Check cleanup statistics accurate

9. **Test migration system**
   - Verify version 1 schema applied
   - Test database reopening after version change
   - Validate migration patterns work
   - Document migration testing results

10. **Perform performance testing**
    - Test bulk insert operations
    - Measure query execution times
    - Test with large datasets (1000+ records)
    - Verify acceptable performance

11. **Test offline scenarios**
    - Create sales while offline
    - Verify sync queue populated
    - Test data persistence across sessions
    - Confirm no data loss

12. **Validate browser compatibility**
    - Test in Chrome, Firefox, Edge
    - Verify Safari compatibility
    - Check mobile browser support
    - Document any browser-specific issues

13. **Create verification report**
    - Document all test results
    - List any issues found
    - Provide recommendations
    - Sign off on IndexedDB setup

### Verification Checklist

```
Database Initialization:
├── [ ] Database opens without errors
├── [ ] Database name is 'pos-offline-db'
├── [ ] Version is 1
├── [ ] All 7 tables exist
└── [ ] Table schemas match definitions

CRUD Operations:
├── [ ] Create: Add product record
├── [ ] Create: Add customer record
├── [ ] Create: Add sale record
├── [ ] Read: Get product by ID
├── [ ] Read: Get customer by phone
├── [ ] Read: Get sale by temp_id
├── [ ] Update: Modify product
├── [ ] Update: Modify customer
├── [ ] Update: Modify sale
├── [ ] Delete: Remove product
├── [ ] Delete: Remove customer
└── [ ] Delete: Remove sale

Index Verification:
├── [ ] Product barcode search works
├── [ ] Customer phone lookup works
├── [ ] Sales by status query works
├── [ ] Unsynced sales query works
├── [ ] Sale items by sale_id query works
├── [ ] Sync queue by status query works
└── [ ] Index performance acceptable

Relationships:
├── [ ] Sale with items created correctly
├── [ ] Sale links to customer
├── [ ] Items link to products
├── [ ] Inventory links to products
└── [ ] Sync queue links to data

Seed Data:
├── [ ] seedAll() populates all tables
├── [ ] Product count correct
├── [ ] Customer count correct
├── [ ] Sales count correct
├── [ ] Relationships intact
└── [ ] clearAllData() removes all records

Compression:
├── [ ] compress() reduces size
├── [ ] decompress() restores original
├── [ ] compressJSON() handles objects
├── [ ] decompressJSON() restores objects
└── [ ] Compression ratio acceptable

Storage Quota:
├── [ ] getStorageQuota() returns data
├── [ ] Quota value is reasonable
├── [ ] Usage calculated correctly
├── [ ] Percentage accurate
├── [ ] Warning levels trigger correctly
└── [ ] Formatted output readable

Data Cleanup:
├── [ ] cleanupSyncedSales() works
├── [ ] cleanupSyncQueue() works
├── [ ] cleanupDraftSales() works
├── [ ] Unsynced data preserved
├── [ ] Cleanup stats accurate
└── [ ] No data loss

Migration:
├── [ ] Version 1 schema applied
├── [ ] Database reopens successfully
├── [ ] Migration patterns documented
└── [ ] Ready for future versions

Performance:
├── [ ] Bulk insert of 100 products < 1 second
├── [ ] Query 1000 products < 500ms
├── [ ] Index queries < 50ms
└── [ ] App remains responsive

Offline Functionality:
├── [ ] Sales created offline
├── [ ] Sync queue populated
├── [ ] Data persists across sessions
└── [ ] No data loss on refresh

Browser Compatibility:
├── [ ] Chrome: Working
├── [ ] Firefox: Working
├── [ ] Edge: Working
├── [ ] Safari: Working
└── [ ] Mobile browsers: Working
```

### Test Scenarios

```
Scenario 1: Complete Sale Flow
├── 1. Create customer
├── 2. Look up products by barcode
├── 3. Check inventory availability
├── 4. Create sale with items
├── 5. Deduct inventory
├── 6. Add to sync queue
└── Verify: All steps complete successfully

Scenario 2: Offline to Online Sync
├── 1. Create sales offline
├── 2. Verify sync queue populated
├── 3. Simulate going online
├── 4. Process sync queue
├── 5. Mark sales as synced
└── Verify: All sales synced

Scenario 3: Storage Management
├── 1. Fill database with data
├── 2. Check storage quota
├── 3. Trigger cleanup
├── 4. Verify space freed
└── Verify: Storage managed effectively

Scenario 4: Data Persistence
├── 1. Add data to database
├── 2. Close browser tab
├── 3. Reopen application
├── 4. Verify data still present
└── Verify: Data persists correctly
```

### Performance Benchmarks

| Operation | Target | Acceptable | Action if Exceeded |
|-----------|--------|------------|-------------------|
| Add single product | <10ms | <50ms | Investigate |
| Bulk add 100 products | <500ms | <2s | Optimize |
| Query by index | <20ms | <100ms | Check indexes |
| Query without index | <200ms | <1s | Add index |
| Compress 1KB text | <5ms | <20ms | Acceptable |
| Decompress 1KB text | <5ms | <20ms | Acceptable |

### Verification Report Template

```
IndexedDB Verification Report
Date: [Date]
Version: 1.0
Status: [Pass/Fail]

Summary:
[Overall assessment of IndexedDB setup]

Database Initialization: [Pass/Fail]
- Details: [...]

CRUD Operations: [Pass/Fail]
- Details: [...]

Indexes and Queries: [Pass/Fail]
- Details: [...]

Relationships: [Pass/Fail]
- Details: [...]

Seed Data: [Pass/Fail]
- Details: [...]

Compression: [Pass/Fail]
- Details: [...]

Storage Quota: [Pass/Fail]
- Details: [...]

Data Cleanup: [Pass/Fail]
- Details: [...]

Performance: [Pass/Fail]
- Details: [...]

Browser Compatibility: [Pass/Fail]
- Details: [...]

Issues Found:
1. [Issue description]
2. [Issue description]

Recommendations:
1. [Recommendation]
2. [Recommendation]

Sign-off: [Name]
```

### Expected Outcome
- Comprehensive verification completed
- All database operations tested
- Performance benchmarks met
- Browser compatibility confirmed
- Verification report created
- IndexedDB setup approved for production

### Verification Checklist
- [ ] Database initialization verified
- [ ] All CRUD operations tested
- [ ] Index queries validated
- [ ] Data relationships confirmed
- [ ] Seed data functionality tested
- [ ] Compression utilities verified
- [ ] Storage quota monitoring tested
- [ ] Data cleanup utilities validated
- [ ] Migration system documented
- [ ] Performance benchmarks met
- [ ] Offline functionality confirmed
- [ ] Browser compatibility verified
- [ ] Test scenarios executed
- [ ] Verification report created
- [ ] Sign-off obtained

---

## Summary

This document completed the advanced configuration of the IndexedDB offline storage system, including query optimization through indexes, schema versioning with the migration system, development seed data, data compression for storage efficiency, storage quota monitoring, automated data cleanup, and comprehensive verification of all functionality.

### Completed Tasks
10. ✓ Reviewed and optimized database indexes
11. ✓ Created migration system for schema versioning
12. ✓ Implemented seed data for testing and development
13. ✓ Added data compression utilities with LZ-String
14. ✓ Created storage quota monitoring system
15. ✓ Implemented data cleanup utilities
16. ✓ Verified complete IndexedDB setup

### IndexedDB Setup Complete
The IndexedDB setup is now complete and ready for integration with the POS offline enhancement features. The database provides robust offline storage with efficient querying, data compression, storage management, and synchronization capabilities.

### Next Steps
Proceed to [Group-B_Service-Worker](../Group-B_Service-Worker/) to implement Service Worker for offline caching, network request interception, and background synchronization to complete the offline POS functionality.
