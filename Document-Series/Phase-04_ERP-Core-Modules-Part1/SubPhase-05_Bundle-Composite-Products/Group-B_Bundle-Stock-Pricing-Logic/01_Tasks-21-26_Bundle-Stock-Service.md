# Tasks 21-26: Bundle Stock Service

> **Phase:** 04 - ERP Core Modules Part 1  
> **SubPhase:** 05 - Bundle & Composite Products  
> **Group:** B - Bundle Stock & Pricing Logic  
> **Document:** 01 of 03  
> **Tasks Covered:** 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-31_Bundle-Pricing-Service.md](02_Tasks-27-31_Bundle-Pricing-Service.md)

---

## Document Overview

This document implements the stock management service for bundle products. Bundle stock availability is calculated based on component product availability - a bundle is only available when all required components are in stock in sufficient quantities. This service provides methods to calculate available stock, check availability, identify limiting items (bottlenecks), and reserve stock for orders.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 21 | Create bundle_services.py | Low | 3 min |
| 22 | Create BundleStockService Class | Medium | 10 min |
| 23 | Add get_available_stock Method | High | 15 min |
| 24 | Add check_availability Method | Medium | 10 min |
| 25 | Add get_limiting_item Method | Medium | 10 min |
| 26 | Add reserve_stock Method | High | 15 min |

---

## Task 21: Create bundle_services.py

### Overview
Create a new service module to house bundle-related business logic, following the service layer pattern to separate business rules from models and views.

### Dependencies
- Group A: Bundle Product Models (ProductBundle and BundleItem models)

### Instructions

1. **Navigate to services directory**
   - Open backend/apps/products/services/ directory
   - This directory should already exist from previous sub-phases

2. **Create bundle_services.py file**
   - Create new file named bundle_services.py
   - Will contain BundleStockService and BundlePricingService classes

3. **Add file-level imports**
   - Import Django ORM functions (Min, F, Q)
   - Import transaction support for atomic operations
   - Import Decimal for precise calculations
   - Import typing hints (Optional, Dict, List, Tuple)

4. **Import bundle models**
   - Import ProductBundle from products.models
   - Import BundleItem from products.models
   - Import Product from products.models
   - Import ProductVariant if needed

5. **Add file-level docstring**
   - Describe: Bundle business logic services
   - Mention stock calculations and pricing
   - Note tenant-aware operations

6. **Structure file organization**
   - BundleStockService class (tasks 22-26)
   - BundlePricingService class (tasks 27-31)
   - Helper functions if needed
   - Keep related logic grouped

### Expected Outcome
```
backend/apps/products/services/
├── __init__.py
└── bundle_services.py    # NEW FILE
```

### Verification Checklist
- [ ] bundle_services.py file exists
- [ ] File contains necessary imports
- [ ] Models are imported correctly
- [ ] File docstring is present
- [ ] File structure is planned

---

## Task 22: Create BundleStockService Class

### Overview
Define the BundleStockService class that will contain all stock-related calculations for bundles. This service calculates how many bundles can be created based on component availability.

### Dependencies
- Task 21: Create bundle_services.py

### Instructions

1. **Define BundleStockService class**
   - Class name: BundleStockService
   - No inheritance needed (utility class)
   - May use @staticmethod or regular methods

2. **Add class-level docstring**
   - Describe: Service for calculating bundle stock availability
   - Explain: Based on minimum component availability
   - Note formula: MIN(component_stock / required_quantity)

3. **Add __init__ method (if using instance methods)**
   - Accept bundle parameter (ProductBundle instance)
   - Store bundle reference as self.bundle
   - Alternative: use static methods with bundle parameter

4. **Plan service methods**
   - get_available_stock: calculate maximum bundle quantity
   - check_availability: verify if quantity is available
   - get_limiting_item: find bottleneck component
   - reserve_stock: allocate component stock for order

5. **Consider caching strategy**
   - Stock calculations can be expensive
   - Consider caching results temporarily
   - Invalidate cache on stock changes

6. **Plan error handling**
   - Handle missing stock information
   - Handle invalid bundle configurations
   - Return appropriate defaults (0 for unavailable)

### Service Pattern
```
BundleStockService(bundle)
   ├── get_available_stock() → int
   ├── check_availability(quantity) → bool
   ├── get_limiting_item() → BundleItem
   └── reserve_stock(quantity) → bool
```

### Expected Outcome
The BundleStockService class is defined and ready to receive method implementations.

### Verification Checklist
- [ ] BundleStockService class is defined
- [ ] Class docstring explains purpose
- [ ] __init__ method structure is planned
- [ ] Method signatures are planned
- [ ] Error handling strategy is considered

---

## Task 23: Add get_available_stock Method

### Overview
Implement the core method that calculates how many complete bundles can be created based on current component stock levels. This method considers required quantities and returns the minimum availability across all components.

### Dependencies
- Task 22: Create BundleStockService Class

### Instructions

1. **Define get_available_stock method**
   - Method name: get_available_stock
   - Parameters: self (if instance method)
   - Return type: int (maximum bundle quantity)

2. **Retrieve bundle items**
   - Query: bundle.items.select_related('product', 'variant')
   - Filter for required items only (is_optional=False)
   - Prefetch related data to avoid N+1 queries

3. **Calculate stock for each item**
   - For each BundleItem:
     - Get component product stock
     - If variant specified, use variant stock
     - Otherwise use product stock
     - Divide stock by item quantity
     - Floor division for integer result

4. **Handle stock calculation logic**
   - Component stock: product.stock_quantity or variant.stock_quantity
   - Item quantity: bundle_item.quantity
   - Available bundles for item: floor(component_stock / item_quantity)
   - Overall availability: MIN of all items

5. **Handle edge cases**
   - No items in bundle: return 0
   - Zero stock: return 0
   - Infinite stock flag: handle as unlimited
   - Negative stock: treat as 0

6. **Return minimum availability**
   - Find minimum value across all components
   - Return integer (number of complete bundles)
   - Return 0 if any component unavailable

### Calculation Algorithm
```
For each required BundleItem:
  1. Get component stock:
     - If variant specified: use variant.stock_quantity
     - Else: use product.stock_quantity
  
  2. Calculate item availability:
     available_for_item = floor(component_stock / item.quantity)
  
  3. Track minimum:
     min_availability = min(min_availability, available_for_item)

Return min_availability
```

### Calculation Examples

**Example 1: Simple Bundle**
```
Bundle: "Gift Set"
Items:
  - Tea Box: stock=30, quantity=1 → 30 bundles possible
  - Cookies: stock=50, quantity=2 → 25 bundles possible
  - Gift Bag: stock=100, quantity=1 → 100 bundles possible

Available Stock: MIN(30, 25, 100) = 25 bundles
```

**Example 2: With Optional Items**
```
Bundle: "Customizable Set"
Required Items:
  - Main Item: stock=20, quantity=1 → 20 bundles
  - Side Item: stock=40, quantity=2 → 20 bundles
Optional Items (ignored):
  - Gift Card: stock=5, quantity=1 → not considered

Available Stock: MIN(20, 20) = 20 bundles
```

**Example 3: Out of Stock Component**
```
Bundle: "Premium Set"
Items:
  - Product A: stock=100, quantity=1 → 100 bundles
  - Product B: stock=0, quantity=1 → 0 bundles
  - Product C: stock=50, quantity=1 → 50 bundles

Available Stock: MIN(100, 0, 50) = 0 bundles
```

### Expected Outcome
The get_available_stock method accurately calculates the maximum number of bundles that can be created.

### Verification Checklist
- [ ] get_available_stock method is defined
- [ ] Retrieves only required items
- [ ] Calculates per-item availability correctly
- [ ] Handles variant vs product stock
- [ ] Returns minimum across all items
- [ ] Handles edge cases (no items, zero stock)
- [ ] Uses efficient queries (select_related)

---

## Task 24: Add check_availability Method

### Overview
Create a method to verify if a specific quantity of bundles is available, useful for cart validation and order placement checks.

### Dependencies
- Task 23: Add get_available_stock Method

### Instructions

1. **Define check_availability method**
   - Method name: check_availability
   - Parameters: self, quantity (int)
   - Return type: bool

2. **Call get_available_stock method**
   - Retrieve current available stock
   - Use the previously implemented method
   - Leverage existing calculation logic

3. **Compare with requested quantity**
   - Check if available_stock >= requested quantity
   - Return True if sufficient stock
   - Return False if insufficient

4. **Add parameter validation**
   - Ensure quantity is positive integer
   - Return False for invalid quantities
   - Handle quantity = 0 (return True)

5. **Consider performance optimization**
   - May return early if possible
   - For large quantities, check component stock first
   - Avoid full calculation if obviously unavailable

6. **Add detailed logging**
   - Log availability checks
   - Include bundle ID and requested quantity
   - Useful for debugging stock issues

### Method Logic
```
def check_availability(quantity):
    if quantity <= 0:
        return True  # Zero or negative is technically "available"
    
    available = get_available_stock()
    return available >= quantity
```

### Usage Examples

**Sufficient Stock:**
```
available_stock = 25
check_availability(10) → True
check_availability(25) → True
check_availability(1) → True
```

**Insufficient Stock:**
```
available_stock = 25
check_availability(26) → False
check_availability(50) → False
check_availability(100) → False
```

**Edge Cases:**
```
available_stock = 0
check_availability(1) → False
check_availability(0) → True

available_stock = 10
check_availability(-5) → True (or handle as invalid)
```

### Expected Outcome
The check_availability method provides a simple boolean check for stock availability.

### Verification Checklist
- [ ] check_availability method is defined
- [ ] Accepts quantity parameter
- [ ] Returns boolean value
- [ ] Uses get_available_stock internally
- [ ] Validates input parameters
- [ ] Handles edge cases correctly

---

## Task 25: Add get_limiting_item Method

### Overview
Implement a method to identify which component is the bottleneck limiting bundle availability. This helps merchants understand which product needs restocking to increase bundle availability.

### Dependencies
- Task 24: Add check_availability Method

### Instructions

1. **Define get_limiting_item method**
   - Method name: get_limiting_item
   - Parameters: self
   - Return type: Optional[BundleItem]

2. **Retrieve bundle items**
   - Query required items (is_optional=False)
   - Include related product and variant data
   - Use select_related for efficiency

3. **Calculate availability for each item**
   - For each BundleItem:
     - Get component stock
     - Calculate bundles possible: stock / quantity
     - Track item and its availability

4. **Find minimum availability**
   - Identify item with lowest availability
   - This is the limiting (bottleneck) item
   - Multiple items may have same minimum

5. **Return limiting item**
   - Return the BundleItem with minimum availability
   - Return None if no items or all unlimited
   - If tie, return first limiting item

6. **Add detailed information**
   - Consider returning tuple: (item, available_quantity)
   - Useful for displaying why bundle is limited
   - Helps in inventory management

### Algorithm
```
limiting_item = None
min_availability = infinity

For each required BundleItem:
    component_stock = get stock from product/variant
    item_availability = floor(component_stock / item.quantity)
    
    if item_availability < min_availability:
        min_availability = item_availability
        limiting_item = item

return limiting_item
```

### Use Case Examples

**Single Bottleneck:**
```
Bundle: "Gift Set"
Items:
  - Tea Box: 30 stock / 1 qty = 30 bundles
  - Cookies: 50 stock / 2 qty = 25 bundles
  - Gift Bag: 100 stock / 1 qty = 100 bundles

Limiting Item: Cookies (allows only 25 bundles)
```

**Multiple Items Same Limit:**
```
Bundle: "Balanced Set"
Items:
  - Product A: 20 stock / 1 qty = 20 bundles
  - Product B: 40 stock / 2 qty = 20 bundles
  - Product C: 100 stock / 1 qty = 100 bundles

Limiting Items: Product A and B (both at 20)
Return: Product A (first encountered)
```

**Out of Stock:**
```
Bundle: "Problem Set"
Items:
  - Product A: 50 stock / 1 qty = 50 bundles
  - Product B: 0 stock / 1 qty = 0 bundles ← limiting

Limiting Item: Product B (completely blocks bundles)
```

### Expected Outcome
The get_limiting_item method identifies the bottleneck component in bundle availability.

### Verification Checklist
- [ ] get_limiting_item method is defined
- [ ] Returns Optional[BundleItem]
- [ ] Calculates per-item availability
- [ ] Finds minimum correctly
- [ ] Handles ties appropriately
- [ ] Returns None when appropriate

---

## Task 26: Add reserve_stock Method

### Overview
Implement a transactional method to reserve component stock when a bundle is ordered. This method decrements stock for all bundle components atomically to prevent overselling.

### Dependencies
- Task 25: Add get_limiting_item Method

### Instructions

1. **Define reserve_stock method**
   - Method name: reserve_stock
   - Parameters: self, quantity (int), order_reference (optional)
   - Return type: bool (success/failure)

2. **Wrap in database transaction**
   - Use @transaction.atomic decorator
   - Ensures all-or-nothing stock deduction
   - Prevents partial reservations

3. **Validate availability first**
   - Call check_availability(quantity)
   - Return False if insufficient stock
   - Prevent overselling

4. **Reserve stock for each component**
   - Loop through required items
   - For each item:
     - Calculate stock to deduct: item.quantity * bundle_quantity
     - Deduct from product or variant stock
     - Handle variant priority (use variant stock if specified)

5. **Use select_for_update for concurrency**
   - Lock product/variant rows during update
   - Prevents race conditions
   - Essential for high-traffic scenarios

6. **Handle reservation failure**
   - Catch exceptions (insufficient stock, locked rows)
   - Transaction rollback occurs automatically
   - Return False on any error
   - Log failure details

7. **Track reservation (optional)**
   - Consider creating StockReservation record
   - Link to order for traceability
   - Useful for inventory auditing

8. **Return success status**
   - Return True if all reservations successful
   - Return False if any failure occurred
   - Consider raising exceptions for serious errors

### Reservation Algorithm
```
@transaction.atomic
def reserve_stock(quantity):
    # Check availability
    if not check_availability(quantity):
        return False
    
    # Get required items with row locks
    items = bundle.items.filter(is_optional=False)\
                 .select_for_update()
    
    # Reserve stock for each item
    for item in items:
        stock_needed = item.quantity * quantity
        
        if item.variant:
            item.variant.stock_quantity -= stock_needed
            item.variant.save()
        else:
            item.product.stock_quantity -= stock_needed
            item.product.save()
    
    return True
```

### Reservation Examples

**Successful Reservation:**
```
Bundle: "Gift Set" (quantity: 2 bundles)
Items:
  - Tea Box: stock=30, qty=1 → deduct 2, new stock=28
  - Cookies: stock=50, qty=2 → deduct 4, new stock=46
  - Gift Bag: stock=100, qty=1 → deduct 2, new stock=98

Result: True (all reservations successful)
```

**Failed Reservation (Insufficient Stock):**
```
Bundle: "Gift Set" (quantity: 30 bundles)
Items:
  - Tea Box: stock=30, qty=1 → need 30 (available)
  - Cookies: stock=50, qty=2 → need 60 (insufficient!)
  
Result: False (transaction rolled back, no stock changes)
```

**Concurrent Reservation Handling:**
```
Request 1: Reserve 20 bundles
Request 2: Reserve 15 bundles (simultaneously)

With select_for_update:
  - Request 1 locks rows, completes
  - Request 2 waits, then evaluates remaining stock
  - Prevents double-allocation
```

### Expected Outcome
The reserve_stock method safely reserves component stock with transaction guarantees.

### Verification Checklist
- [ ] reserve_stock method is defined
- [ ] Uses @transaction.atomic
- [ ] Validates availability before reservation
- [ ] Uses select_for_update for concurrency
- [ ] Deducts stock from correct product/variant
- [ ] Handles errors with rollback
- [ ] Returns boolean success status
- [ ] Logs reservation activities

---

## Summary of Tasks 21-26

### What Was Accomplished
- Created bundle_services.py file
- Implemented BundleStockService class
- Developed stock calculation algorithm
- Added availability checking
- Created limiting item identification
- Implemented transactional stock reservation

### BundleStockService Methods
```
BundleStockService:
  ├── get_available_stock() → int
  │     Calculate maximum bundles based on components
  │
  ├── check_availability(quantity) → bool
  │     Verify if specific quantity is available
  │
  ├── get_limiting_item() → BundleItem
  │     Identify bottleneck component
  │
  └── reserve_stock(quantity) → bool
        Atomically reserve component stock
```

### Stock Calculation Formula
```
Bundle Availability = MIN(
    floor(component_1_stock / component_1_quantity),
    floor(component_2_stock / component_2_quantity),
    ...
    floor(component_n_stock / component_n_quantity)
)

Only required items (is_optional=False) are considered.
```

### Key Concepts
- **Component-Based Availability:** Bundle stock depends on all components
- **Bottleneck Identification:** Limiting item determines maximum bundles
- **Atomic Reservations:** Transactions prevent overselling
- **Concurrency Control:** Row locks prevent race conditions
- **Optional Items Ignored:** Only required items limit availability

### Next Steps
The next document will implement BundlePricingService for calculating bundle prices with discounts.

---

## Notes for Developers

### Performance Considerations
- Use select_related to avoid N+1 queries
- Cache stock calculations when appropriate
- Consider database indexes on stock_quantity fields
- Use select_for_update only when reserving

### Concurrency Safety
- Always use transactions for reservations
- Row locks prevent double-allocation
- Handle lock timeouts gracefully
- Consider queue systems for high volume

### Business Rules
- Only required items limit stock
- Optional items don't affect availability
- Variant stock takes priority over product stock
- Zero or negative stock means unavailable

### Testing Requirements
- Test with various item quantities
- Test concurrent reservation attempts
- Test transaction rollback on failure
- Test optional vs required items
- Verify limiting item detection
- Test edge cases (zero stock, no items)

### Integration Points
- Cart validation uses check_availability
- Order placement uses reserve_stock
- Product detail page uses get_available_stock
- Admin dashboard uses get_limiting_item
- Inventory reports use these methods

---
