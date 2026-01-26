# Tasks 54-60: Query Key Factory

> **Phase:** 07 - Frontend Infrastructure & ERP Dashboard  
> **SubPhase:** 05 - State Management  
> **Group:** D - TanStack Query Setup  
> **Document:** 02 of 02  
> **Tasks Covered:** 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-45-53_Installation-Configuration.md](01_Tasks-45-53_Installation-Configuration.md)

---

## Document Overview

This document covers the creation of a centralized query key factory that provides consistent, hierarchical, and type-safe query keys for all ERP modules. The factory pattern ensures cache keys are organized, predictable, and support efficient invalidation strategies. Query keys are defined for Products, Inventory, Customers, Sales, and HR modules.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 54 | Create Query Key Factory | Medium | 30 min |
| 55 | Define Product Query Keys | Low | 15 min |
| 56 | Define Inventory Query Keys | Low | 15 min |
| 57 | Define Customer Query Keys | Low | 15 min |
| 58 | Define Sales Query Keys | Low | 15 min |
| 59 | Define HR Query Keys | Low | 15 min |
| 60 | Create QueryKey Index File | Low | 10 min |

---

## Task 54: Create Query Key Factory

### Overview
Create a centralized query key factory that generates consistent, hierarchical query keys for all TanStack Query operations. The factory pattern provides a standardized structure for query keys, enabling predictable cache invalidation, type safety, and easier debugging.

### Dependencies
- Task 45: Install TanStack Query

### Instructions

1. **Create lib directory if needed**
   - Navigate to frontend/src or frontend/app
   - Ensure lib/ directory exists
   - This houses utility and configuration files

2. **Create queryKeys.ts file**
   - Create new file: lib/queryKeys.ts
   - This will contain all query key factories
   - Use TypeScript for type safety

3. **Add file header documentation**
   - Document query key factory pattern
   - Explain hierarchical structure
   - Note usage in query hooks

4. **Define factory pattern interface**
   - Document standard factory methods
   - Explain all(), lists(), list(), details(), detail()
   - Show example usage

5. **Create base type definitions**
   - Define types for filter objects
   - Create types for ID parameters
   - Ensure type safety across modules

6. **Export factory structure**
   - Named export for each module factory
   - Centralized access to all keys
   - Consistent pattern across modules

### Query Key Factory Purpose

**Why Factory Pattern:**
- Consistency across all modules
- Hierarchical invalidation support
- Type-safe key generation
- Single source of truth
- Easier refactoring
- Better debugging

**Benefits:**
- No magic strings scattered in code
- Automatic invalidation scoping
- IDE autocomplete support
- Compile-time type checking
- Easy to test and mock

### Query Key Hierarchy

```
┌──────────────────────────────────────┐
│        Query Key Hierarchy           │
├──────────────────────────────────────┤
│  ['products']                        │
│     │                                 │
│     ├── ['products', 'list']         │
│     │      └── ['products', 'list', filters] │
│     │                                 │
│     └── ['products', 'detail']       │
│            └── ['products', 'detail', id] │
└──────────────────────────────────────┘
```

### Factory Method Pattern

Each module factory provides standard methods:

**all():**
- Returns: ['module']
- Purpose: Base key for entire module
- Invalidates: All module queries

**lists():**
- Returns: ['module', 'list']
- Purpose: Base key for all list queries
- Invalidates: All lists, not details

**list(filters):**
- Returns: ['module', 'list', filters]
- Purpose: Specific filtered list
- Invalidates: Only this filtered list

**details():**
- Returns: ['module', 'detail']
- Purpose: Base key for all detail queries
- Invalidates: All details, not lists

**detail(id):**
- Returns: ['module', 'detail', id]
- Purpose: Specific item detail
- Invalidates: Only this item

### Factory Structure Template

**Module Factory Interface:**
```
{
  all: () => string[]
  lists: () => string[]
  list: (filters?: FilterType) => (string | FilterType)[]
  details: () => string[]
  detail: (id: string | number) => (string | number)[]
}
```

**Example for Products:**
```
productKeys.all()              → ['products']
productKeys.lists()            → ['products', 'list']
productKeys.list({ status })   → ['products', 'list', { status }]
productKeys.details()          → ['products', 'detail']
productKeys.detail('123')      → ['products', 'detail', '123']
```

### Hierarchical Invalidation

**Invalidation Scope:**

**Invalidate all():**
- Clears entire module cache
- Affects lists and details
- Use after major changes

**Invalidate lists():**
- Clears all list queries
- Details remain cached
- Use after item creation

**Invalidate list(filters):**
- Clears specific filtered list
- Other lists remain cached
- Use after filtered update

**Invalidate detail(id):**
- Clears single item
- Lists and other items cached
- Use after item update

### Invalidation Examples

**Create Product:**
```
// Invalidate all product lists
queryClient.invalidateQueries({ 
  queryKey: productKeys.lists() 
})
```

**Update Product:**
```
// Invalidate specific product and all lists
queryClient.invalidateQueries({ 
  queryKey: productKeys.detail(productId) 
})
queryClient.invalidateQueries({ 
  queryKey: productKeys.lists() 
})
```

**Delete Product:**
```
// Invalidate entire products module
queryClient.invalidateQueries({ 
  queryKey: productKeys.all() 
})
```

### Query Key Best Practices

**Structure:**
- Always use arrays
- Keep hierarchy shallow (2-3 levels)
- Use consistent naming
- Include all identifying info

**Filters:**
- Include as last array element
- Serialize to stable object
- Order object keys consistently
- Use JSON.stringify for stability

**IDs:**
- Use string or number consistently
- Include in second-to-last position
- Never use objects as IDs
- Validate ID type

**Type Safety:**
- Define filter types
- Type ID parameters
- Use const assertions
- Export types

### File Structure

```
frontend/
├── lib/
│   ├── queryClient.ts        # QueryClient config
│   └── queryKeys.ts          # Query key factories
└── hooks/
    └── useProducts.ts        # Uses productKeys
```

### Expected Outcome
- lib/queryKeys.ts file created
- Factory pattern interface documented
- Type definitions for filters and IDs
- Base structure ready for module keys
- Consistent pattern established
- Type-safe key generation

### Verification Checklist
- [ ] lib/queryKeys.ts file created
- [ ] File header documentation added
- [ ] Factory pattern explained
- [ ] Hierarchical structure documented
- [ ] Type definitions created
- [ ] Example usage included
- [ ] Ready for module-specific keys

### Query Key Factory Benefits

**Development:**
- IDE autocomplete
- Type checking
- Refactoring safety
- Easy to test

**Runtime:**
- Consistent keys
- Predictable caching
- Efficient invalidation
- Clear debugging

**Maintenance:**
- Single source of truth
- Easy to modify
- Clear patterns
- Self-documenting

---

## Task 55: Define Product Query Keys

### Overview
Define the query key factory for the Products module, providing keys for product lists, filtered lists, product details, and related queries. These keys will be used by all product-related queries and mutations throughout the application.

### Dependencies
- Task 54: Create Query Key Factory

### Instructions

1. **Open queryKeys.ts file**
   - Navigate to lib/queryKeys.ts
   - Prepare to add productKeys factory

2. **Define product filter types**
   - Create interface for product list filters
   - Include common filter fields (category, status, etc.)
   - Make all fields optional

3. **Create productKeys factory object**
   - Export const productKeys
   - Implement all factory methods
   - Use const assertion for type safety

4. **Implement all() method**
   - Returns ['products'] as const
   - Base key for all product queries
   - Used for invalidating entire module

5. **Implement lists() method**
   - Returns ['products', 'list'] as const
   - Base key for all product list queries
   - Used for invalidating all lists

6. **Implement list(filters) method**
   - Accepts optional ProductFilters parameter
   - Returns ['products', 'list', filters]
   - Handles undefined filters gracefully

7. **Implement details() method**
   - Returns ['products', 'detail'] as const
   - Base key for all product detail queries
   - Used for invalidating all product details

8. **Implement detail(id) method**
   - Accepts string or number ID
   - Returns ['products', 'detail', id]
   - Used for specific product cache

9. **Add additional product-specific keys**
   - Categories: ['products', 'categories']
   - Variants: ['products', 'variants', productId]
   - Stock: ['products', 'stock', productId]
   - Pricing: ['products', 'pricing', productId]

### Product Filter Interface

**ProductFilters Type:**
Fields for filtering product lists:

| Field | Type | Purpose |
|-------|------|---------|
| category | string | Filter by category ID |
| status | string | active, inactive, archived |
| search | string | Search by name/SKU |
| minPrice | number | Minimum price filter |
| maxPrice | number | Maximum price filter |
| inStock | boolean | Only in-stock items |
| tags | string[] | Filter by tags |

### Product Keys Structure

```
productKeys
├── all()                     → ['products']
├── lists()                   → ['products', 'list']
├── list(filters)             → ['products', 'list', filters]
├── details()                 → ['products', 'detail']
├── detail(id)                → ['products', 'detail', id]
├── categories()              → ['products', 'categories']
├── variants(productId)       → ['products', 'variants', productId]
├── stock(productId)          → ['products', 'stock', productId]
└── pricing(productId)        → ['products', 'pricing', productId]
```

### Product Query Key Examples

**Basic Keys:**
```
productKeys.all()
→ ['products']

productKeys.lists()
→ ['products', 'list']

productKeys.detail('prod_123')
→ ['products', 'detail', 'prod_123']
```

**Filtered Lists:**
```
productKeys.list({ status: 'active' })
→ ['products', 'list', { status: 'active' }]

productKeys.list({ category: 'electronics', inStock: true })
→ ['products', 'list', { category: 'electronics', inStock: true }]

productKeys.list({ search: 'laptop', minPrice: 500 })
→ ['products', 'list', { search: 'laptop', minPrice: 500 }]
```

**Related Data:**
```
productKeys.categories()
→ ['products', 'categories']

productKeys.variants('prod_123')
→ ['products', 'variants', 'prod_123']

productKeys.stock('prod_123')
→ ['products', 'stock', 'prod_123']
```

### Product Query Usage Examples

**List Products:**
```
useQuery({
  queryKey: productKeys.list({ status: 'active' }),
  queryFn: () => fetchProducts({ status: 'active' })
})
```

**Get Product Detail:**
```
useQuery({
  queryKey: productKeys.detail(productId),
  queryFn: () => fetchProduct(productId)
})
```

**Get Product Variants:**
```
useQuery({
  queryKey: productKeys.variants(productId),
  queryFn: () => fetchProductVariants(productId)
})
```

### Product Mutation Invalidation

**Create Product:**
```
useMutation({
  mutationFn: createProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ 
      queryKey: productKeys.lists() 
    })
  }
})
```

**Update Product:**
```
useMutation({
  mutationFn: updateProduct,
  onSuccess: (_, productId) => {
    queryClient.invalidateQueries({ 
      queryKey: productKeys.detail(productId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: productKeys.lists() 
    })
  }
})
```

**Delete Product:**
```
useMutation({
  mutationFn: deleteProduct,
  onSuccess: () => {
    queryClient.invalidateQueries({ 
      queryKey: productKeys.all() 
    })
  }
})
```

**Update Stock:**
```
useMutation({
  mutationFn: updateStock,
  onSuccess: (_, productId) => {
    queryClient.invalidateQueries({ 
      queryKey: productKeys.stock(productId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: productKeys.detail(productId) 
    })
  }
})
```

### Expected Outcome
- productKeys factory defined
- ProductFilters interface created
- All standard factory methods implemented
- Additional product-specific keys added
- Type-safe key generation
- Ready for use in product queries

### Verification Checklist
- [ ] ProductFilters interface defined
- [ ] productKeys object exported
- [ ] all() method implemented
- [ ] lists() method implemented
- [ ] list(filters) method implemented
- [ ] details() method implemented
- [ ] detail(id) method implemented
- [ ] categories() key added
- [ ] variants(id) key added
- [ ] stock(id) key added
- [ ] pricing(id) key added
- [ ] Const assertions used
- [ ] TypeScript types correct

---

## Task 56: Define Inventory Query Keys

### Overview
Define the query key factory for the Inventory module, providing keys for inventory levels, stock movements, warehouse locations, and stock adjustments. These keys manage inventory-related cache and support efficient updates for stock changes.

### Dependencies
- Task 54: Create Query Key Factory

### Instructions

1. **Open queryKeys.ts file**
   - Navigate to lib/queryKeys.ts
   - Add inventoryKeys factory below productKeys

2. **Define inventory filter types**
   - Create InventoryFilters interface
   - Include warehouse, product, status filters
   - Make all fields optional

3. **Create inventoryKeys factory object**
   - Export const inventoryKeys
   - Implement all factory methods
   - Use const assertion

4. **Implement standard methods**
   - all(): Base inventory key
   - lists(): All inventory lists
   - list(filters): Filtered inventory
   - details(): All inventory details
   - detail(id): Specific inventory item

5. **Add inventory-specific keys**
   - stockLevels(): All stock levels
   - stockLevel(productId, warehouseId): Specific level
   - movements(): Stock movement history
   - movement(id): Specific movement
   - warehouses(): All warehouses
   - warehouse(id): Specific warehouse
   - lowStock(): Items below threshold

### Inventory Filter Interface

**InventoryFilters Type:**

| Field | Type | Purpose |
|-------|------|---------|
| warehouse | string | Filter by warehouse ID |
| product | string | Filter by product ID |
| status | string | in-stock, low-stock, out-of-stock |
| category | string | Product category filter |
| location | string | Warehouse location/zone |
| threshold | number | Stock threshold comparison |

### Inventory Keys Structure

```
inventoryKeys
├── all()                         → ['inventory']
├── lists()                       → ['inventory', 'list']
├── list(filters)                 → ['inventory', 'list', filters]
├── details()                     → ['inventory', 'detail']
├── detail(id)                    → ['inventory', 'detail', id]
├── stockLevels()                 → ['inventory', 'stockLevels']
├── stockLevel(productId, whId)   → ['inventory', 'stockLevel', productId, whId]
├── movements()                   → ['inventory', 'movements']
├── movement(id)                  → ['inventory', 'movement', id]
├── warehouses()                  → ['inventory', 'warehouses']
├── warehouse(id)                 → ['inventory', 'warehouse', id]
└── lowStock()                    → ['inventory', 'lowStock']
```

### Inventory Query Key Examples

**Stock Levels:**
```
inventoryKeys.stockLevels()
→ ['inventory', 'stockLevels']

inventoryKeys.stockLevel('prod_123', 'wh_main')
→ ['inventory', 'stockLevel', 'prod_123', 'wh_main']

inventoryKeys.lowStock()
→ ['inventory', 'lowStock']
```

**Stock Movements:**
```
inventoryKeys.movements()
→ ['inventory', 'movements']

inventoryKeys.movement('mov_456')
→ ['inventory', 'movement', 'mov_456']
```

**Warehouse Data:**
```
inventoryKeys.warehouses()
→ ['inventory', 'warehouses']

inventoryKeys.warehouse('wh_main')
→ ['inventory', 'warehouse', 'wh_main']
```

### Inventory Query Usage

**Get Stock Level:**
```
useQuery({
  queryKey: inventoryKeys.stockLevel(productId, warehouseId),
  queryFn: () => fetchStockLevel(productId, warehouseId),
  staleTime: 60000  // 1 min for real-time needs
})
```

**List Low Stock Items:**
```
useQuery({
  queryKey: inventoryKeys.lowStock(),
  queryFn: () => fetchLowStockItems(),
  staleTime: 120000  // 2 min
})
```

**Get Stock Movements:**
```
useQuery({
  queryKey: inventoryKeys.movements(),
  queryFn: () => fetchStockMovements()
})
```

### Inventory Mutation Invalidation

**Stock Adjustment:**
```
useMutation({
  mutationFn: adjustStock,
  onSuccess: (_, { productId, warehouseId }) => {
    queryClient.invalidateQueries({ 
      queryKey: inventoryKeys.stockLevel(productId, warehouseId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: inventoryKeys.lowStock() 
    })
    queryClient.invalidateQueries({ 
      queryKey: inventoryKeys.movements() 
    })
  }
})
```

**Stock Transfer:**
```
useMutation({
  mutationFn: transferStock,
  onSuccess: (_, { fromWarehouse, toWarehouse, productId }) => {
    // Invalidate both warehouse stock levels
    queryClient.invalidateQueries({ 
      queryKey: inventoryKeys.stockLevel(productId, fromWarehouse) 
    })
    queryClient.invalidateQueries({ 
      queryKey: inventoryKeys.stockLevel(productId, toWarehouse) 
    })
    queryClient.invalidateQueries({ 
      queryKey: inventoryKeys.movements() 
    })
  }
})
```

### Expected Outcome
- inventoryKeys factory defined
- InventoryFilters interface created
- Standard factory methods implemented
- Inventory-specific keys added
- Support for multi-warehouse scenarios
- Efficient stock level cache management

### Verification Checklist
- [ ] InventoryFilters interface defined
- [ ] inventoryKeys object exported
- [ ] Standard methods implemented
- [ ] stockLevels() key added
- [ ] stockLevel(productId, warehouseId) added
- [ ] movements() and movement(id) added
- [ ] warehouses() and warehouse(id) added
- [ ] lowStock() key added
- [ ] Const assertions used
- [ ] TypeScript types correct

---

## Task 57: Define Customer Query Keys

### Overview
Define the query key factory for the Customer module, providing keys for customer lists, customer details, addresses, orders, and payment methods. These keys support customer relationship management and order history tracking.

### Dependencies
- Task 54: Create Query Key Factory

### Instructions

1. **Open queryKeys.ts file**
   - Navigate to lib/queryKeys.ts
   - Add customerKeys factory

2. **Define customer filter types**
   - Create CustomerFilters interface
   - Include status, type, search filters
   - Make all fields optional

3. **Create customerKeys factory object**
   - Export const customerKeys
   - Implement standard factory methods
   - Use const assertion

4. **Implement standard methods**
   - all(): Base customer key
   - lists(): All customer lists
   - list(filters): Filtered customers
   - details(): All customer details
   - detail(id): Specific customer

5. **Add customer-specific keys**
   - addresses(customerId): Customer addresses
   - address(addressId): Specific address
   - orders(customerId): Customer orders
   - paymentMethods(customerId): Payment methods
   - paymentMethod(id): Specific payment method
   - loyaltyPoints(customerId): Loyalty program data

### Customer Filter Interface

**CustomerFilters Type:**

| Field | Type | Purpose |
|-------|------|---------|
| status | string | active, inactive, blocked |
| type | string | retail, wholesale, vip |
| search | string | Search name/email/phone |
| country | string | Filter by country |
| loyaltyTier | string | Filter by loyalty tier |
| hasOrders | boolean | Only customers with orders |
| dateJoined | string | Registration date filter |

### Customer Keys Structure

```
customerKeys
├── all()                       → ['customers']
├── lists()                     → ['customers', 'list']
├── list(filters)               → ['customers', 'list', filters]
├── details()                   → ['customers', 'detail']
├── detail(id)                  → ['customers', 'detail', id]
├── addresses(customerId)       → ['customers', 'addresses', customerId]
├── address(addressId)          → ['customers', 'address', addressId]
├── orders(customerId)          → ['customers', 'orders', customerId]
├── paymentMethods(customerId)  → ['customers', 'paymentMethods', customerId]
├── paymentMethod(id)           → ['customers', 'paymentMethod', id]
└── loyaltyPoints(customerId)   → ['customers', 'loyaltyPoints', customerId]
```

### Customer Query Key Examples

**Customer Data:**
```
customerKeys.all()
→ ['customers']

customerKeys.detail('cust_789')
→ ['customers', 'detail', 'cust_789']

customerKeys.list({ type: 'vip', status: 'active' })
→ ['customers', 'list', { type: 'vip', status: 'active' }]
```

**Customer Relationships:**
```
customerKeys.addresses('cust_789')
→ ['customers', 'addresses', 'cust_789']

customerKeys.orders('cust_789')
→ ['customers', 'orders', 'cust_789']

customerKeys.loyaltyPoints('cust_789')
→ ['customers', 'loyaltyPoints', 'cust_789']
```

### Customer Query Usage

**List Customers:**
```
useQuery({
  queryKey: customerKeys.list({ status: 'active' }),
  queryFn: () => fetchCustomers({ status: 'active' })
})
```

**Get Customer Detail:**
```
useQuery({
  queryKey: customerKeys.detail(customerId),
  queryFn: () => fetchCustomer(customerId)
})
```

**Get Customer Orders:**
```
useQuery({
  queryKey: customerKeys.orders(customerId),
  queryFn: () => fetchCustomerOrders(customerId)
})
```

**Get Customer Addresses:**
```
useQuery({
  queryKey: customerKeys.addresses(customerId),
  queryFn: () => fetchCustomerAddresses(customerId)
})
```

### Customer Mutation Invalidation

**Update Customer:**
```
useMutation({
  mutationFn: updateCustomer,
  onSuccess: (_, customerId) => {
    queryClient.invalidateQueries({ 
      queryKey: customerKeys.detail(customerId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: customerKeys.lists() 
    })
  }
})
```

**Add Address:**
```
useMutation({
  mutationFn: addAddress,
  onSuccess: (_, { customerId }) => {
    queryClient.invalidateQueries({ 
      queryKey: customerKeys.addresses(customerId) 
    })
  }
})
```

**Add Loyalty Points:**
```
useMutation({
  mutationFn: addLoyaltyPoints,
  onSuccess: (_, { customerId }) => {
    queryClient.invalidateQueries({ 
      queryKey: customerKeys.loyaltyPoints(customerId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: customerKeys.detail(customerId) 
    })
  }
})
```

### Expected Outcome
- customerKeys factory defined
- CustomerFilters interface created
- Standard factory methods implemented
- Customer relationship keys added
- Address and order keys included
- Loyalty program support

### Verification Checklist
- [ ] CustomerFilters interface defined
- [ ] customerKeys object exported
- [ ] Standard methods implemented
- [ ] addresses(customerId) added
- [ ] address(id) added
- [ ] orders(customerId) added
- [ ] paymentMethods(customerId) added
- [ ] paymentMethod(id) added
- [ ] loyaltyPoints(customerId) added
- [ ] Const assertions used
- [ ] TypeScript types correct

---

## Task 58: Define Sales Query Keys

### Overview
Define the query key factory for the Sales module, providing keys for orders, invoices, payments, and sales analytics. These keys support point-of-sale operations, order management, and financial reporting.

### Dependencies
- Task 54: Create Query Key Factory

### Instructions

1. **Open queryKeys.ts file**
   - Navigate to lib/queryKeys.ts
   - Add salesKeys factory

2. **Define sales filter types**
   - Create SalesFilters interface
   - Include date range, status, payment filters
   - Make all fields optional

3. **Create salesKeys factory object**
   - Export const salesKeys
   - Implement standard factory methods
   - Use const assertion

4. **Implement standard methods**
   - all(): Base sales key
   - lists(): All sales lists
   - list(filters): Filtered sales
   - details(): All sale details
   - detail(id): Specific sale

5. **Add sales-specific keys**
   - orders(): All orders
   - order(id): Specific order
   - invoices(): All invoices
   - invoice(id): Specific invoice
   - payments(): All payments
   - payment(id): Specific payment
   - refunds(): All refunds
   - refund(id): Specific refund
   - analytics(range): Sales analytics
   - dailySummary(date): Daily sales summary

### Sales Filter Interface

**SalesFilters Type:**

| Field | Type | Purpose |
|-------|------|---------|
| status | string | pending, completed, cancelled |
| paymentStatus | string | paid, unpaid, partial |
| dateFrom | string | Start date filter |
| dateTo | string | End date filter |
| customer | string | Filter by customer ID |
| cashier | string | Filter by cashier/user |
| minAmount | number | Minimum order amount |
| maxAmount | number | Maximum order amount |
| paymentMethod | string | cash, card, etc. |

### Sales Keys Structure

```
salesKeys
├── all()                    → ['sales']
├── lists()                  → ['sales', 'list']
├── list(filters)            → ['sales', 'list', filters]
├── details()                → ['sales', 'detail']
├── detail(id)               → ['sales', 'detail', id]
├── orders()                 → ['sales', 'orders']
├── order(id)                → ['sales', 'order', id]
├── invoices()               → ['sales', 'invoices']
├── invoice(id)              → ['sales', 'invoice', id]
├── payments()               → ['sales', 'payments']
├── payment(id)              → ['sales', 'payment', id]
├── refunds()                → ['sales', 'refunds']
├── refund(id)               → ['sales', 'refund', id]
├── analytics(range)         → ['sales', 'analytics', range]
└── dailySummary(date)       → ['sales', 'dailySummary', date]
```

### Sales Query Key Examples

**Orders:**
```
salesKeys.orders()
→ ['sales', 'orders']

salesKeys.order('ord_123')
→ ['sales', 'order', 'ord_123']

salesKeys.list({ status: 'completed', dateFrom: '2025-01-01' })
→ ['sales', 'list', { status: 'completed', dateFrom: '2025-01-01' }]
```

**Invoices and Payments:**
```
salesKeys.invoices()
→ ['sales', 'invoices']

salesKeys.invoice('inv_456')
→ ['sales', 'invoice', 'inv_456']

salesKeys.payment('pay_789')
→ ['sales', 'payment', 'pay_789']
```

**Analytics:**
```
salesKeys.analytics({ start: '2025-01-01', end: '2025-01-31' })
→ ['sales', 'analytics', { start: '2025-01-01', end: '2025-01-31' }]

salesKeys.dailySummary('2025-01-25')
→ ['sales', 'dailySummary', '2025-01-25']
```

### Sales Query Usage

**List Orders:**
```
useQuery({
  queryKey: salesKeys.list({ 
    status: 'completed',
    dateFrom: startDate,
    dateTo: endDate
  }),
  queryFn: () => fetchSales({ 
    status: 'completed',
    dateFrom: startDate,
    dateTo: endDate
  })
})
```

**Get Order Detail:**
```
useQuery({
  queryKey: salesKeys.order(orderId),
  queryFn: () => fetchOrder(orderId)
})
```

**Get Sales Analytics:**
```
useQuery({
  queryKey: salesKeys.analytics({ start, end }),
  queryFn: () => fetchSalesAnalytics(start, end),
  staleTime: 120000  // 2 min for analytics
})
```

**Daily Summary:**
```
useQuery({
  queryKey: salesKeys.dailySummary(today),
  queryFn: () => fetchDailySummary(today),
  staleTime: 60000  // 1 min for live dashboard
})
```

### Sales Mutation Invalidation

**Create Order:**
```
useMutation({
  mutationFn: createOrder,
  onSuccess: () => {
    queryClient.invalidateQueries({ 
      queryKey: salesKeys.orders() 
    })
    queryClient.invalidateQueries({ 
      queryKey: salesKeys.dailySummary(today) 
    })
    queryClient.invalidateQueries({ 
      queryKey: salesKeys.analytics({ start, end }) 
    })
  }
})
```

**Process Payment:**
```
useMutation({
  mutationFn: processPayment,
  onSuccess: (_, { orderId }) => {
    queryClient.invalidateQueries({ 
      queryKey: salesKeys.order(orderId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: salesKeys.payments() 
    })
  }
})
```

**Issue Refund:**
```
useMutation({
  mutationFn: issueRefund,
  onSuccess: (_, { orderId }) => {
    queryClient.invalidateQueries({ 
      queryKey: salesKeys.order(orderId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: salesKeys.refunds() 
    })
    queryClient.invalidateQueries({ 
      queryKey: salesKeys.analytics({ start, end }) 
    })
  }
})
```

### Expected Outcome
- salesKeys factory defined
- SalesFilters interface created
- Standard factory methods implemented
- Order, invoice, payment keys added
- Analytics and reporting keys included
- Date-based filtering support

### Verification Checklist
- [ ] SalesFilters interface defined
- [ ] salesKeys object exported
- [ ] Standard methods implemented
- [ ] orders() and order(id) added
- [ ] invoices() and invoice(id) added
- [ ] payments() and payment(id) added
- [ ] refunds() and refund(id) added
- [ ] analytics(range) added
- [ ] dailySummary(date) added
- [ ] Const assertions used
- [ ] TypeScript types correct

---

## Task 59: Define HR Query Keys

### Overview
Define the query key factory for the Human Resources module, providing keys for employees, schedules, attendance, payroll, and leave management. These keys support workforce management and administrative functions.

### Dependencies
- Task 54: Create Query Key Factory

### Instructions

1. **Open queryKeys.ts file**
   - Navigate to lib/queryKeys.ts
   - Add hrKeys factory

2. **Define HR filter types**
   - Create HRFilters interface
   - Include department, role, status filters
   - Make all fields optional

3. **Create hrKeys factory object**
   - Export const hrKeys
   - Implement standard factory methods
   - Use const assertion

4. **Implement standard methods**
   - all(): Base HR key
   - lists(): All employee lists
   - list(filters): Filtered employees
   - details(): All employee details
   - detail(id): Specific employee

5. **Add HR-specific keys**
   - employees(): All employees
   - employee(id): Specific employee
   - schedules(): All schedules
   - schedule(id): Specific schedule
   - attendance(): Attendance records
   - attendanceRecord(id): Specific record
   - leaves(): Leave requests
   - leave(id): Specific leave
   - payroll(period): Payroll for period
   - performance(employeeId): Performance data

### HR Filter Interface

**HRFilters Type:**

| Field | Type | Purpose |
|-------|------|---------|
| department | string | Filter by department |
| role | string | Filter by job role |
| status | string | active, on-leave, terminated |
| search | string | Search name/email/ID |
| manager | string | Filter by manager ID |
| location | string | Filter by work location |
| employmentType | string | full-time, part-time, contract |
| hireDate | string | Hire date filter |

### HR Keys Structure

```
hrKeys
├── all()                        → ['hr']
├── lists()                      → ['hr', 'list']
├── list(filters)                → ['hr', 'list', filters]
├── details()                    → ['hr', 'detail']
├── detail(id)                   → ['hr', 'detail', id]
├── employees()                  → ['hr', 'employees']
├── employee(id)                 → ['hr', 'employee', id]
├── schedules()                  → ['hr', 'schedules']
├── schedule(id)                 → ['hr', 'schedule', id]
├── attendance()                 → ['hr', 'attendance']
├── attendanceRecord(id)         → ['hr', 'attendanceRecord', id]
├── leaves()                     → ['hr', 'leaves']
├── leave(id)                    → ['hr', 'leave', id]
├── payroll(period)              → ['hr', 'payroll', period]
└── performance(employeeId)      → ['hr', 'performance', employeeId]
```

### HR Query Key Examples

**Employees:**
```
hrKeys.employees()
→ ['hr', 'employees']

hrKeys.employee('emp_123')
→ ['hr', 'employee', 'emp_123']

hrKeys.list({ department: 'sales', status: 'active' })
→ ['hr', 'list', { department: 'sales', status: 'active' }]
```

**Schedules and Attendance:**
```
hrKeys.schedules()
→ ['hr', 'schedules']

hrKeys.schedule('sched_456')
→ ['hr', 'schedule', 'sched_456']

hrKeys.attendance()
→ ['hr', 'attendance']

hrKeys.attendanceRecord('att_789')
→ ['hr', 'attendanceRecord', 'att_789']
```

**Leave and Payroll:**
```
hrKeys.leaves()
→ ['hr', 'leaves']

hrKeys.leave('leave_101')
→ ['hr', 'leave', 'leave_101']

hrKeys.payroll('2025-01')
→ ['hr', 'payroll', '2025-01']
```

### HR Query Usage

**List Employees:**
```
useQuery({
  queryKey: hrKeys.list({ department: 'sales' }),
  queryFn: () => fetchEmployees({ department: 'sales' })
})
```

**Get Employee Detail:**
```
useQuery({
  queryKey: hrKeys.employee(employeeId),
  queryFn: () => fetchEmployee(employeeId)
})
```

**Get Attendance Records:**
```
useQuery({
  queryKey: hrKeys.attendance(),
  queryFn: () => fetchAttendance(),
  staleTime: 60000  // 1 min for real-time tracking
})
```

**Get Payroll:**
```
useQuery({
  queryKey: hrKeys.payroll(payPeriod),
  queryFn: () => fetchPayroll(payPeriod),
  staleTime: 600000  // 10 min, changes rarely
})
```

### HR Mutation Invalidation

**Update Employee:**
```
useMutation({
  mutationFn: updateEmployee,
  onSuccess: (_, employeeId) => {
    queryClient.invalidateQueries({ 
      queryKey: hrKeys.employee(employeeId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: hrKeys.lists() 
    })
  }
})
```

**Clock In/Out:**
```
useMutation({
  mutationFn: clockIn,
  onSuccess: (_, employeeId) => {
    queryClient.invalidateQueries({ 
      queryKey: hrKeys.attendance() 
    })
    queryClient.invalidateQueries({ 
      queryKey: hrKeys.employee(employeeId) 
    })
  }
})
```

**Approve Leave:**
```
useMutation({
  mutationFn: approveLeave,
  onSuccess: (_, { leaveId, employeeId }) => {
    queryClient.invalidateQueries({ 
      queryKey: hrKeys.leave(leaveId) 
    })
    queryClient.invalidateQueries({ 
      queryKey: hrKeys.leaves() 
    })
    queryClient.invalidateQueries({ 
      queryKey: hrKeys.employee(employeeId) 
    })
  }
})
```

### Expected Outcome
- hrKeys factory defined
- HRFilters interface created
- Standard factory methods implemented
- Employee management keys added
- Attendance and scheduling support
- Payroll and leave management keys

### Verification Checklist
- [ ] HRFilters interface defined
- [ ] hrKeys object exported
- [ ] Standard methods implemented
- [ ] employees() and employee(id) added
- [ ] schedules() and schedule(id) added
- [ ] attendance() and attendanceRecord(id) added
- [ ] leaves() and leave(id) added
- [ ] payroll(period) added
- [ ] performance(employeeId) added
- [ ] Const assertions used
- [ ] TypeScript types correct

---

## Task 60: Create QueryKey Index File

### Overview
Create an index export file that aggregates all query key factories, providing a single import point for all modules. This simplifies imports throughout the application and ensures consistent access to query keys.

### Dependencies
- Task 59: Define HR Query Keys (all module keys must be defined)

### Instructions

1. **Review queryKeys.ts file**
   - Ensure all module keys are defined
   - Verify exports are correctly structured
   - Check TypeScript types are exported

2. **Create exports section**
   - Add dedicated exports section at end of file
   - Use named exports for clarity
   - Group by module

3. **Export all factory objects**
   - Export productKeys
   - Export inventoryKeys
   - Export customerKeys
   - Export salesKeys
   - Export hrKeys

4. **Export filter type interfaces**
   - Export ProductFilters
   - Export InventoryFilters
   - Export CustomerFilters
   - Export SalesFilters
   - Export HRFilters

5. **Add file documentation**
   - Document import usage
   - Show example imports
   - Note factory pattern benefits

6. **Verify single import point**
   - All keys accessible from one file
   - No need to import from multiple files
   - Clean import statements throughout app

### Export Structure

**Named Exports:**
```
export { productKeys }
export { inventoryKeys }
export { customerKeys }
export { salesKeys }
export { hrKeys }

export type { ProductFilters }
export type { InventoryFilters }
export type { CustomerFilters }
export type { SalesFilters }
export type { HRFilters }
```

**Alternative Aggregate Export:**
```
export const queryKeys = {
  products: productKeys,
  inventory: inventoryKeys,
  customers: customerKeys,
  sales: salesKeys,
  hr: hrKeys
}
```

### Import Usage Examples

**Named Imports:**
```
import { productKeys, customerKeys } from '@/lib/queryKeys'

// Usage
queryKey: productKeys.list({ status: 'active' })
queryKey: customerKeys.detail(customerId)
```

**Aggregate Import:**
```
import { queryKeys } from '@/lib/queryKeys'

// Usage
queryKey: queryKeys.products.list({ status: 'active' })
queryKey: queryKeys.customers.detail(customerId)
```

**Type Imports:**
```
import type { ProductFilters, CustomerFilters } from '@/lib/queryKeys'

// Usage in function signature
function useProducts(filters?: ProductFilters) {
  // ...
}
```

### File Organization

```
lib/queryKeys.ts
├── File Header Documentation
├── Type Definitions
│   ├── ProductFilters
│   ├── InventoryFilters
│   ├── CustomerFilters
│   ├── SalesFilters
│   └── HRFilters
├── Factory Implementations
│   ├── productKeys
│   ├── inventoryKeys
│   ├── customerKeys
│   ├── salesKeys
│   └── hrKeys
└── Exports Section
    ├── Factory Exports
    └── Type Exports
```

### Benefits of Index Export

**Single Import Point:**
- One file for all query keys
- Consistent import statements
- Easy to find and use
- Reduced cognitive load

**Maintainability:**
- Add new modules in one place
- Update exports centrally
- Refactor safely
- Clear organization

**Developer Experience:**
- IDE autocomplete works well
- Easy to discover available keys
- Type safety preserved
- Clear module boundaries

### Usage Throughout Application

**In Query Hooks:**
```
// hooks/useProducts.ts
import { productKeys } from '@/lib/queryKeys'

export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters),
    queryFn: () => fetchProducts(filters)
  })
}
```

**In Mutation Handlers:**
```
// hooks/useCreateProduct.ts
import { productKeys } from '@/lib/queryKeys'
import { queryClient } from '@/lib/queryClient'

export function useCreateProduct() {
  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ 
        queryKey: productKeys.lists() 
      })
    }
  })
}
```

**In Components:**
```
// components/ProductList.tsx
import { productKeys } from '@/lib/queryKeys'

function ProductList() {
  const { data } = useQuery({
    queryKey: productKeys.list(),
    queryFn: fetchProducts
  })
  
  // ...
}
```

### Expected Outcome
- All query key factories exported
- All filter types exported
- Single import point established
- Documentation added
- Type safety maintained
- Ready for use throughout application

### Verification Checklist
- [ ] All factory objects exported
- [ ] All filter types exported
- [ ] Export section added at end of file
- [ ] Named exports used
- [ ] Type exports use 'export type' syntax
- [ ] File documentation updated
- [ ] Import examples added
- [ ] Can import all keys from single file
- [ ] TypeScript compilation succeeds
- [ ] IDE autocomplete works

### Query Keys File Complete

**Final File Structure:**
```
lib/queryKeys.ts (complete)
├── Documentation (100 lines)
├── Type Definitions (50 lines)
├── productKeys (40 lines)
├── inventoryKeys (50 lines)
├── customerKeys (45 lines)
├── salesKeys (50 lines)
├── hrKeys (45 lines)
└── Exports (20 lines)
Total: ~400 lines
```

---

## Summary and Verification

### Completed Query Key Factories

After completing Tasks 54-60, the query key factory system is fully implemented:

**Modules Covered:**
- Products (Task 55)
- Inventory (Task 56)
- Customers (Task 57)
- Sales (Task 58)
- HR (Task 59)

**Factory Pattern:**
- Consistent structure across modules
- Hierarchical key organization
- Type-safe key generation
- Efficient invalidation support

### Query Key Factory Benefits

**Consistency:**
- Single pattern for all modules
- Predictable key structure
- Easy to understand
- Reduced errors

**Type Safety:**
- TypeScript interfaces for filters
- Compile-time error detection
- IDE autocomplete support
- Refactoring confidence

**Performance:**
- Precise cache invalidation
- No over-invalidation
- Hierarchical scope control
- Efficient updates

**Maintainability:**
- Centralized key definitions
- Easy to extend
- Clear documentation
- Self-explanatory structure

### Factory Method Summary

| Method | Purpose | Scope |
|--------|---------|-------|
| all() | Module base key | Entire module |
| lists() | List base key | All lists |
| list(filters) | Filtered list | Specific list |
| details() | Detail base key | All details |
| detail(id) | Item detail | Single item |

### Module-Specific Keys Summary

**Products:**
- Categories, variants, stock, pricing

**Inventory:**
- Stock levels, movements, warehouses, low stock

**Customers:**
- Addresses, orders, payment methods, loyalty

**Sales:**
- Orders, invoices, payments, refunds, analytics

**HR:**
- Employees, schedules, attendance, leaves, payroll

### File Structure Created

```
frontend/
└── lib/
    └── queryKeys.ts              # Complete query key factory
        ├── Type Definitions
        ├── productKeys
        ├── inventoryKeys
        ├── customerKeys
        ├── salesKeys
        ├── hrKeys
        └── Exports
```

### Usage Pattern Established

**Import:**
```
import { productKeys, customerKeys } from '@/lib/queryKeys'
```

**Use in Query:**
```
useQuery({
  queryKey: productKeys.list({ status: 'active' }),
  queryFn: () => fetchProducts({ status: 'active' })
})
```

**Invalidate on Mutation:**
```
useMutation({
  mutationFn: updateProduct,
  onSuccess: (_, id) => {
    queryClient.invalidateQueries({ 
      queryKey: productKeys.detail(id) 
    })
    queryClient.invalidateQueries({ 
      queryKey: productKeys.lists() 
    })
  }
})
```

### Next Steps

**Immediate:**
- Integrate QueryProvider into app layout
- Create custom query hooks in Group E
- Implement mutations in Group F

**Module Hooks:**
- useProducts (list, detail, create, update)
- useInventory (stock levels, movements, adjustments)
- useCustomers (CRUD operations)
- useSales (orders, payments, analytics)
- useHR (employees, attendance, payroll)

**Testing:**
- Test query key generation
- Verify cache invalidation
- Check hierarchical scoping
- Validate type safety

### Verification Commands

**Type Check:**
```
npm run type-check
```

**Lint Check:**
```
npm run lint
```

**Build Check:**
```
npm run build
```

### Best Practices Applied

✓ Factory pattern for consistency
✓ Hierarchical key structure
✓ Type-safe filter interfaces
✓ Const assertions for type literals
✓ Clear method naming
✓ Comprehensive documentation
✓ Module-specific keys
✓ Single export point
✓ TypeScript throughout
✓ Ready for scale

### Query Key Anti-Patterns Avoided

✗ Magic strings in components
✗ Inconsistent key structure
✗ Over-invalidation (all() misuse)
✗ Missing type definitions
✗ Scattered key definitions
✗ Hard-coded filters in keys
✗ Mutation without invalidation
✗ Duplicate key logic

---

## Conclusion

The query key factory system is complete with factories for all major ERP modules. The centralized, type-safe, hierarchical approach ensures consistent cache management, efficient invalidation, and excellent developer experience. Combined with the QueryClient configuration from Document 01, TanStack Query is fully configured and ready for use throughout the ERP dashboard application.

The next group (Group E: Module Query Hooks) will build upon these query keys to create custom hooks for each module, providing a clean API for data fetching and mutations.
