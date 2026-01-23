# Tasks 87-91: Unit & Integration Tests

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** F - Testing & Documentation  
> **Document:** 01 of 02  
> **Tasks Covered:** 87, 88, 89, 90, 91

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-92-94_API-Tests-Documentation.md](02_Tasks-92-94_API-Tests-Documentation.md)

---

## Document Overview

This document covers comprehensive unit and integration testing for the POS module, including terminal/session management, cart operations, product search, payment processing, and end-to-end transaction flows.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 87 | Create terminal/session tests | Medium | 30 min |
| 88 | Create cart operation tests | High | 35 min |
| 89 | Create product search tests | Medium | 30 min |
| 90 | Create payment processing tests | High | 40 min |
| 91 | Create transaction flow tests | High | 40 min |

---

## Task 87: Create Terminal/Session Tests

### Overview
Create comprehensive unit tests for POSTerminal and POSSession models, covering creation, validation, session lifecycle (open/close), and cash reconciliation.

### Dependencies
- Task 80: Implement POS terminal service
- Task 81: Implement POS session service
- pytest-django installed
- factory_boy configured

### Instructions

1. **Create test factories file**
   - Create `apps/pos/tests/factories.py`
   - Import factory_boy, Faker, and required models
   - Define TenantFactory for test tenant creation
   - Define StoreFactory for test store creation
   - Define UserFactory for test user (cashier) creation
   - Define POSTerminalFactory with default values
   - Define POSSessionFactory with default values
   - Define ProductFactory for test products
   - Define ProductVariantFactory for test variants
   - Use Faker for generating realistic test data

2. **Create test configuration file**
   - Create `apps/pos/tests/conftest.py`
   - Define pytest fixtures for common test objects
   - Create `tenant` fixture returning test tenant
   - Create `store` fixture with test store
   - Create `cashier` fixture with test user
   - Create `terminal` fixture with active terminal
   - Create `session` fixture with open session
   - Create `product` fixture with test product
   - Use `@pytest.mark.django_db` decorator
   - Configure Django test settings

3. **Create terminal model tests**
   - Create `apps/pos/tests/test_terminal.py`
   - Import pytest, factories, and models
   - Mark module with `@pytest.mark.django_db`
   - Test POSTerminal creation with valid data
   - Test terminal_code uniqueness per tenant
   - Test terminal name validation
   - Test terminal is_active status
   - Test terminal store relationship
   - Test terminal default values (e.g., currency)
   - Test terminal string representation
   - Test terminal manager methods (active terminals)

4. **Create session creation tests**
   - In `test_terminal.py` or separate `test_session.py`
   - Test POSSession creation with valid terminal
   - Test session requires terminal reference
   - Test session requires cashier assignment
   - Test opening_balance validation (non-negative)
   - Test session status defaults to 'open'
   - Test session_number auto-generation
   - Test session start_time auto-population
   - Test session end_time is null on creation

5. **Create open_session tests**
   - Test open_session service method with valid terminal
   - Test open_session with cashier user
   - Test open_session with opening balance
   - Test open_session validates terminal is active
   - Test open_session validates terminal not in active session
   - Test open_session creates new session record
   - Test open_session sets session status to 'open'
   - Test open_session records start_time
   - Test open_session raises error if session already open
   - Test open_session with zero opening balance

6. **Create close_session tests**
   - Test close_session with valid session_id
   - Test close_session with closing_cash_amount
   - Test close_session validates session exists
   - Test close_session validates session is open
   - Test close_session sets status to 'closed'
   - Test close_session records end_time
   - Test close_session calculates expected_cash from transactions
   - Test close_session calculates cash_variance (expected vs actual)
   - Test close_session with no transactions (variance = closing - opening)
   - Test close_session raises error if already closed

7. **Create cash reconciliation tests**
   - Test cash variance calculation: actual - expected
   - Test positive variance (cash over)
   - Test negative variance (cash short)
   - Test zero variance (balanced)
   - Test variance with multiple payment types (only cash counted)
   - Test expected_cash includes opening balance
   - Test expected_cash from cash transactions in session
   - Test closing balance validation (non-negative)

8. **Create session status transition tests**
   - Test session status flow: open → closed
   - Test cannot reopen closed session
   - Test cannot close non-existent session
   - Test session status prevents multiple opens on same terminal
   - Test session filtering by status

9. **Create session edge cases tests**
   - Test session with no transactions
   - Test session with only non-cash payments
   - Test session close with missing closing_cash
   - Test session duration calculation
   - Test multiple sessions per terminal (sequential)
   - Test session data integrity

### Test Organization

| Test File | Purpose | Test Count |
|-----------|---------|------------|
| `factories.py` | Model factories for test data | N/A |
| `conftest.py` | Shared fixtures and configuration | N/A |
| `test_terminal.py` | POSTerminal model tests | ~8-10 |
| `test_session.py` | POSSession model tests | ~15-20 |

### Testing Best Practices
- Use factories for test data creation
- Each test should be independent and isolated
- Use descriptive test names: `test_<action>_<condition>_<expected_result>`
- Use pytest fixtures for common setup
- Test both success and failure cases
- Use `pytest.raises()` for exception testing
- Clean up test data (handled by Django TestCase)
- Use `@pytest.mark.parametrize` for multiple scenarios

### Test Coverage Goals
- Terminal model: 100% coverage
- Session model: 100% coverage
- Session lifecycle methods: 100% coverage
- Cash reconciliation logic: 100% coverage

### Expected Test File Structure

```
Terminal/Session Tests
├── POSTerminal Model
│   ├── Test creation with valid data
│   ├── Test uniqueness constraints
│   ├── Test validation rules
│   ├── Test default values
│   └── Test relationships
├── POSSession Model
│   ├── Test creation with valid data
│   ├── Test required fields
│   ├── Test auto-generated fields
│   └── Test default values
├── Open Session Service
│   ├── Test successful open
│   ├── Test validation (active terminal)
│   ├── Test validation (no active session)
│   └── Test error cases
├── Close Session Service
│   ├── Test successful close
│   ├── Test cash reconciliation
│   ├── Test variance calculation
│   └── Test error cases
└── Edge Cases
    ├── Test multiple sessions (sequential)
    ├── Test session with no transactions
    └── Test data integrity
```

### Pytest Command Examples

| Command | Purpose |
|---------|---------|
| `pytest apps/pos/tests/test_terminal.py` | Run terminal tests only |
| `pytest apps/pos/tests/test_session.py` | Run session tests only |
| `pytest apps/pos/tests/ -v` | Run all POS tests with verbose output |
| `pytest apps/pos/tests/ --cov=apps/pos` | Run with coverage report |
| `pytest -k "test_open_session"` | Run specific test pattern |

### Verification Checklist
- [ ] `factories.py` created with all required factories
- [ ] `conftest.py` created with shared fixtures
- [ ] Terminal model tests created (8-10 tests)
- [ ] Session model tests created (15-20 tests)
- [ ] Open session service tests created
- [ ] Close session service tests created
- [ ] Cash reconciliation tests created
- [ ] Edge cases covered
- [ ] All tests pass successfully
- [ ] Test coverage > 90% for terminal/session code

---

## Task 88: Create Cart Operation Tests

### Overview
Create comprehensive tests for cart operations including item management (add, update, remove), discount application, and total calculations.

### Dependencies
- Task 82: Implement POS cart service
- Task 87: Terminal/session tests and factories
- ProductFactory and ProductVariantFactory

### Instructions

1. **Create cart test file**
   - Create `apps/pos/tests/test_cart.py`
   - Import pytest, factories, cart service, and models
   - Mark module with `@pytest.mark.django_db`

2. **Add cart factories to factories.py**
   - Define POSCartFactory with session reference
   - Define POSCartItemFactory with cart and product references
   - Include variant field (nullable)
   - Include quantity (default 1)
   - Include price and subtotal fields
   - Use Faker for cart reference generation

3. **Create cart creation tests**
   - Test create_cart with valid session
   - Test cart_reference auto-generation (format: CART-YYYYMMDD-XXXX)
   - Test cart status defaults to 'active'
   - Test cart belongs to correct session
   - Test cart totals initialize to zero
   - Test cart created_at timestamp
   - Test multiple carts per session

4. **Create add_to_cart tests**
   - Test add_to_cart with product only (no variant)
   - Test add_to_cart with product and variant
   - Test add_to_cart validates product exists
   - Test add_to_cart validates variant belongs to product
   - Test add_to_cart checks stock availability
   - Test add_to_cart creates POSCartItem record
   - Test add_to_cart sets item price from product
   - Test add_to_cart sets item price from variant (if provided)
   - Test add_to_cart with custom quantity
   - Test add_to_cart increments quantity if item exists
   - Test add_to_cart calculates line subtotal
   - Test add_to_cart updates cart totals

5. **Create update_quantity tests**
   - Test update_quantity with valid cart_item_id
   - Test update_quantity with positive quantity
   - Test update_quantity recalculates line subtotal
   - Test update_quantity updates cart totals
   - Test update_quantity validates stock availability
   - Test update_quantity with quantity=0 (should remove item)
   - Test update_quantity raises error if item not found
   - Test update_quantity validates non-negative quantity

6. **Create remove_from_cart tests**
   - Test remove_from_cart with valid cart_item_id
   - Test remove_from_cart deletes item record
   - Test remove_from_cart updates cart totals
   - Test remove_from_cart raises error if item not found
   - Test remove_from_cart with multiple items (only removes specified)

7. **Create line discount tests**
   - Test apply_line_discount with percentage discount
   - Test apply_line_discount with fixed amount discount
   - Test apply_line_discount validates discount type
   - Test apply_line_discount validates discount value (positive)
   - Test apply_line_discount calculates discount_amount
   - Test apply_line_discount updates line subtotal_after_discount
   - Test apply_line_discount updates cart totals
   - Test apply_line_discount with 0% discount
   - Test apply_line_discount with 100% discount
   - Test apply_line_discount prevents negative subtotal

8. **Create cart-level discount tests**
   - Test apply_cart_discount with percentage discount
   - Test apply_cart_discount with fixed amount discount
   - Test apply_cart_discount validates discount type
   - Test apply_cart_discount calculates total_discount
   - Test apply_cart_discount updates cart grand_total
   - Test apply_cart_discount applied after all line discounts
   - Test apply_cart_discount with promotion code (optional)
   - Test apply_cart_discount prevents negative grand_total

9. **Create calculate_totals tests**
   - Test calculate_totals sums all line subtotals
   - Test calculate_totals applies line discounts
   - Test calculate_totals calculates subtotal_before_discount
   - Test calculate_totals calculates subtotal_after_discount
   - Test calculate_totals applies cart discount
   - Test calculate_totals calculates tax (if applicable)
   - Test calculate_totals calculates grand_total
   - Test calculate_totals with empty cart (all zeros)
   - Test calculate_totals accuracy with decimal precision
   - Test calculate_totals with multiple items and discounts

10. **Create cart reference generation tests**
    - Test cart_reference format: CART-YYYYMMDD-XXXX
    - Test cart_reference uniqueness
    - Test cart_reference increments sequence number
    - Test cart_reference date component matches creation date
    - Test cart_reference with high volume (concurrency)

11. **Create cart validation tests**
    - Test cart cannot add inactive products
    - Test cart cannot add out-of-stock items
    - Test cart validates quantity > 0
    - Test cart validates session is open
    - Test cart item belongs to correct cart

12. **Create cart state management tests**
    - Test cart status: active, completed, held, void
    - Test cannot modify completed cart
    - Test cannot modify void cart
    - Test hold_cart changes status to 'held'
    - Test recall_cart reactivates held cart
    - Test clear_cart removes all items

### Test Scenarios Diagram

```
Cart Lifecycle & Operations
┌─────────────────────────────────────────────────┐
│              Create Cart                        │
│         (session, reference)                    │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│           Add Items to Cart                     │
│  ┌──────────────────────────────────────────┐  │
│  │ Product Only │ Product + Variant         │  │
│  │ Quantity: 1  │ Quantity: N               │  │
│  │ Check stock  │ Check stock               │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Modify Cart Items                       │
│  ┌──────────────────────────────────────────┐  │
│  │ Update Qty │ Remove Item │ Apply Discount│  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│        Apply Cart-Level Discount                │
│         (percentage or fixed)                   │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Calculate Totals                       │
│  ┌──────────────────────────────────────────┐  │
│  │ Line subtotals                           │  │
│  │ + Line discounts                         │  │
│  │ = Subtotal                               │  │
│  │ - Cart discount                          │  │
│  │ + Tax (if applicable)                    │  │
│  │ = Grand Total                            │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Complete / Hold / Void                 │
└─────────────────────────────────────────────────┘
```

### Test Data Examples

| Scenario | Product Price | Qty | Line Discount | Cart Discount | Expected Total |
|----------|---------------|-----|---------------|---------------|----------------|
| Simple | 100.00 | 2 | 0% | 0% | 200.00 |
| Line discount | 100.00 | 2 | 10% | 0% | 180.00 |
| Cart discount | 100.00 | 2 | 0% | 20.00 | 180.00 |
| Both discounts | 100.00 | 2 | 10% | 20.00 | 160.00 |
| Multiple items | Various | Various | Various | 10% | Calculated |

### Testing Best Practices
- Test one operation per test function
- Use factory fixtures for test data
- Verify cart totals after each operation
- Test both success and failure paths
- Use parametrized tests for multiple scenarios
- Mock stock availability checks if needed
- Test decimal precision for monetary calculations

### Test Coverage Goals
- Cart service methods: 100% coverage
- Cart operations: Add, update, remove, discount
- Total calculation logic: 100% accuracy
- Edge cases: Empty cart, max quantity, zero price

### Expected Test File Structure

```
Cart Operation Tests
├── Cart Creation
│   ├── Test create with session
│   ├── Test reference generation
│   └── Test default values
├── Add to Cart
│   ├── Test add product
│   ├── Test add variant
│   ├── Test stock validation
│   ├── Test quantity increment
│   └── Test totals update
├── Update Quantity
│   ├── Test increase quantity
│   ├── Test decrease quantity
│   ├── Test remove (qty=0)
│   └── Test validation
├── Remove from Cart
│   ├── Test remove item
│   └── Test totals update
├── Line Discounts
│   ├── Test percentage discount
│   ├── Test fixed discount
│   └── Test validation
├── Cart Discounts
│   ├── Test percentage discount
│   ├── Test fixed discount
│   └── Test with promotion code
├── Calculate Totals
│   ├── Test line totals
│   ├── Test discounts applied
│   ├── Test grand total
│   └── Test decimal precision
└── Cart State
    ├── Test hold cart
    ├── Test recall cart
    ├── Test clear cart
    └── Test void cart
```

### Pytest Command Examples

| Command | Purpose |
|---------|---------|
| `pytest apps/pos/tests/test_cart.py -v` | Run all cart tests |
| `pytest -k "test_add_to_cart"` | Run add_to_cart tests only |
| `pytest -k "discount"` | Run all discount tests |
| `pytest apps/pos/tests/test_cart.py --cov=apps/pos/services/cart_service.py` | Coverage for cart service |

### Verification Checklist
- [ ] Cart creation tests created (5-7 tests)
- [ ] Add to cart tests created (8-10 tests)
- [ ] Update quantity tests created (6-8 tests)
- [ ] Remove from cart tests created (3-4 tests)
- [ ] Line discount tests created (7-9 tests)
- [ ] Cart discount tests created (6-8 tests)
- [ ] Calculate totals tests created (8-10 tests)
- [ ] Cart reference tests created (4-5 tests)
- [ ] Cart validation tests created (5-6 tests)
- [ ] Cart state tests created (5-6 tests)
- [ ] All tests pass successfully
- [ ] Test coverage > 95% for cart service

---

## Task 89: Create Product Search Tests

### Overview
Create comprehensive tests for product search functionality including barcode search, SKU search, name search, combined search, and variant resolution.

### Dependencies
- Task 83: Implement product search service
- Task 87: ProductFactory and ProductVariantFactory
- Test products with various attributes

### Instructions

1. **Create search test file**
   - Create `apps/pos/tests/test_search.py`
   - Import pytest, factories, search service, and models
   - Mark module with `@pytest.mark.django_db`

2. **Add search test fixtures to conftest.py**
   - Create `products_catalog` fixture with diverse products
   - Include products with barcodes
   - Include products with SKUs
   - Include products with various names
   - Include products with variants (size, color)
   - Include active and inactive products
   - Include in-stock and out-of-stock products

3. **Create barcode search tests**
   - Test barcode_search with exact match
   - Test barcode_search returns single product
   - Test barcode_search with variant barcode (returns variant)
   - Test barcode_search with non-existent barcode (returns None)
   - Test barcode_search case-insensitive
   - Test barcode_search ignores inactive products
   - Test barcode_search validates barcode format
   - Test barcode_search with multiple results (should return first)

4. **Create SKU search tests**
   - Test sku_search with exact match
   - Test sku_search with partial match (starts with)
   - Test sku_search returns list of products
   - Test sku_search case-insensitive
   - Test sku_search ignores inactive products
   - Test sku_search with empty results
   - Test sku_search with variant SKU (returns variant)
   - Test sku_search ordering (alphabetical or relevance)

5. **Create name search tests**
   - Test name_search with full name match
   - Test name_search with partial name (contains)
   - Test name_search with fuzzy matching
   - Test name_search case-insensitive
   - Test name_search returns list of products
   - Test name_search ignores inactive products
   - Test name_search relevance ranking
   - Test name_search with special characters
   - Test name_search with Sinhala characters (if supported)
   - Test name_search minimum length validation (e.g., 2 chars)

6. **Create combined search tests**
   - Test combined_search checks barcode first
   - Test combined_search falls back to SKU if no barcode match
   - Test combined_search falls back to name if no SKU match
   - Test combined_search returns prioritized results
   - Test combined_search with multiple matches across types
   - Test combined_search limits results (e.g., top 10)
   - Test combined_search with empty query returns empty results

7. **Create variant resolution tests**
   - Test search resolves product variants correctly
   - Test variant search returns variant-specific details (price, stock)
   - Test variant search includes parent product info
   - Test variant barcode unique across all variants
   - Test variant SKU search includes parent product
   - Test variant name includes variant attributes (e.g., "T-Shirt - Blue - M")

8. **Create stock availability filter tests**
   - Test search filters out out-of-stock items (optional parameter)
   - Test search includes stock quantity in results
   - Test search with include_out_of_stock=True
   - Test search with include_out_of_stock=False
   - Test variant-level stock filtering

9. **Create price inclusion tests**
   - Test search results include selling price
   - Test search results include cost price (for authorized users)
   - Test search results include variant prices
   - Test search results include price with tax
   - Test search results include discounted price (if active promotion)

10. **Create search performance tests**
    - Test search response time with large catalog (>1000 products)
    - Test search with database indexes (verify query efficiency)
    - Test search caching (if implemented)
    - Test search pagination (offset/limit)

11. **Create search validation tests**
    - Test search with empty query string
    - Test search with whitespace-only query
    - Test search with very long query (>100 chars)
    - Test search with SQL injection attempts (safety)
    - Test search with special regex characters

12. **Create search result structure tests**
    - Test search result includes product_id
    - Test search result includes product name
    - Test search result includes barcode
    - Test search result includes SKU
    - Test search result includes price
    - Test search result includes stock_quantity
    - Test search result includes variant info (if applicable)
    - Test search result includes image_url (if available)

### Search Scenarios Diagram

```
Product Search Flow
┌─────────────────────────────────────────────────┐
│            Search Query Input                   │
│         (barcode, SKU, or name)                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
        ┌────────┴────────┐
        │  Query Type?    │
        └────────┬────────┘
                 │
     ┌───────────┼───────────┐
     │           │           │
     ▼           ▼           ▼
┌─────────┐ ┌─────────┐ ┌─────────┐
│ Barcode │ │   SKU   │ │  Name   │
│  Exact  │ │ Partial │ │  Fuzzy  │
└────┬────┘ └────┬────┘ └────┬────┘
     │           │           │
     └───────────┼───────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Filter Results                         │
│  ┌──────────────────────────────────────────┐  │
│  │ Active products only                     │  │
│  │ In-stock filter (optional)               │  │
│  │ Price range filter (optional)            │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│        Resolve Variants                         │
│  ┌──────────────────────────────────────────┐  │
│  │ Check if product has variants            │  │
│  │ Include variant-specific info            │  │
│  │ (price, stock, barcode)                  │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Return Results                         │
│  ┌──────────────────────────────────────────┐  │
│  │ Product/variant details                  │  │
│  │ Pricing information                      │  │
│  │ Stock availability                       │  │
│  │ Sorted by relevance                      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### Test Data Examples

| Test Case | Query | Expected Result |
|-----------|-------|-----------------|
| Barcode exact | "8901234567890" | Single product with that barcode |
| SKU exact | "TSHIRT-001" | Products with matching SKU |
| Name partial | "Coca" | Products: "Coca Cola 330ml", "Coca Cola 1L" |
| Name fuzzy | "coka cola" | Products with "Coca Cola" (fuzzy match) |
| Combined | "TSH" | Barcode check → SKU match → Name match |
| Variant | "TSHIRT-001-BLU-M" | Variant with parent product info |
| Out of stock | Query with filter | Excludes out-of-stock items |

### Testing Best Practices
- Create diverse test product catalog (fixtures)
- Test with realistic product data
- Test edge cases (special chars, Unicode)
- Verify search result ordering/relevance
- Test search performance with large datasets
- Mock external services if search uses Elasticsearch
- Validate result structure consistency

### Test Coverage Goals
- Barcode search: 100% coverage
- SKU search: 100% coverage
- Name search: 100% coverage
- Combined search: 100% coverage
- Variant resolution: 100% coverage
- Filter logic: 100% coverage

### Expected Test File Structure

```
Product Search Tests
├── Barcode Search
│   ├── Test exact match
│   ├── Test variant barcode
│   ├── Test not found
│   └── Test inactive filter
├── SKU Search
│   ├── Test exact match
│   ├── Test partial match
│   ├── Test multiple results
│   └── Test variant SKU
├── Name Search
│   ├── Test full name
│   ├── Test partial name
│   ├── Test fuzzy match
│   ├── Test case-insensitive
│   └── Test special characters
├── Combined Search
│   ├── Test priority order
│   ├── Test fallback logic
│   └── Test result limiting
├── Variant Resolution
│   ├── Test variant details
│   ├── Test parent product info
│   └── Test variant-specific price
├── Stock Filtering
│   ├── Test include out-of-stock
│   ├── Test exclude out-of-stock
│   └── Test variant stock
├── Price Inclusion
│   ├── Test selling price
│   ├── Test variant price
│   └── Test promotional price
├── Validation
│   ├── Test empty query
│   ├── Test long query
│   └── Test special characters
└── Result Structure
    ├── Test required fields
    ├── Test optional fields
    └── Test consistency
```

### Pytest Command Examples

| Command | Purpose |
|---------|---------|
| `pytest apps/pos/tests/test_search.py -v` | Run all search tests |
| `pytest -k "test_barcode_search"` | Run barcode search tests |
| `pytest -k "test_name_search"` | Run name search tests |
| `pytest apps/pos/tests/test_search.py --cov=apps/pos/services/search_service.py` | Coverage for search service |

### Verification Checklist
- [ ] Barcode search tests created (6-8 tests)
- [ ] SKU search tests created (6-8 tests)
- [ ] Name search tests created (8-10 tests)
- [ ] Combined search tests created (5-7 tests)
- [ ] Variant resolution tests created (5-6 tests)
- [ ] Stock filtering tests created (4-5 tests)
- [ ] Price inclusion tests created (4-5 tests)
- [ ] Search validation tests created (5-6 tests)
- [ ] Result structure tests created (3-4 tests)
- [ ] All tests pass successfully
- [ ] Test coverage > 95% for search service

---

## Task 90: Create Payment Processing Tests

### Overview
Create comprehensive tests for payment processing including cash, card, mobile payments, store credit, split payments, and payment validation.

### Dependencies
- Task 84: Implement payment processing service
- Task 88: Cart tests and cart fixtures
- Payment method configurations

### Instructions

1. **Create payment test file**
   - Create `apps/pos/tests/test_payment.py`
   - Import pytest, factories, payment service, and models
   - Mark module with `@pytest.mark.django_db`

2. **Add payment factories to factories.py**
   - Define PaymentMethodFactory (cash, card, mobile, store_credit)
   - Define POSTransactionFactory with cart reference
   - Define POSPaymentFactory with transaction and method references
   - Include amount, status, payment_method_type fields
   - Include transaction_reference (for card/mobile)
   - Include payment_date timestamp

3. **Create cash payment tests**
   - Test process_cash_payment with exact amount
   - Test process_cash_payment with amount > total (returns change)
   - Test process_cash_payment calculates correct change
   - Test process_cash_payment with insufficient amount (raises error)
   - Test process_cash_payment creates payment record
   - Test process_cash_payment sets status to 'completed'
   - Test process_cash_payment updates session cash totals
   - Test process_cash_payment in LKR currency

4. **Create card payment tests**
   - Test process_card_payment with valid card details
   - Test process_card_payment integrates with payment gateway (mocked)
   - Test process_card_payment creates payment record
   - Test process_card_payment stores transaction_reference
   - Test process_card_payment sets status to 'completed'
   - Test process_card_payment handles gateway timeout (status: pending)
   - Test process_card_payment handles gateway decline (status: failed)
   - Test process_card_payment with card types (Visa, MasterCard)

5. **Create mobile payment tests**
   - Test process_mobile_payment with provider (e.g., eZ Cash, mCash)
   - Test process_mobile_payment with mobile number
   - Test process_mobile_payment creates payment record
   - Test process_mobile_payment stores transaction_reference
   - Test process_mobile_payment sets status to 'completed'
   - Test process_mobile_payment handles pending confirmation
   - Test process_mobile_payment validates mobile number format
   - Test process_mobile_payment with different providers

6. **Create store credit payment tests**
   - Test process_store_credit with valid customer account
   - Test process_store_credit checks available credit balance
   - Test process_store_credit deducts from customer credit
   - Test process_store_credit creates payment record
   - Test process_store_credit with insufficient credit (raises error)
   - Test process_store_credit updates customer credit balance
   - Test process_store_credit requires customer association

7. **Create split payment tests**
   - Test split_payment with two methods (cash + card)
   - Test split_payment with three methods (cash + card + mobile)
   - Test split_payment validates total amounts match transaction total
   - Test split_payment creates multiple payment records
   - Test split_payment with insufficient total (raises error)
   - Test split_payment with overpayment (raises error)
   - Test split_payment validates each payment method
   - Test split_payment processes each method independently

8. **Create payment validation tests**
   - Test payment validates amount > 0
   - Test payment validates cart is not empty
   - Test payment validates session is open
   - Test payment validates transaction not already paid
   - Test payment validates payment method is active
   - Test payment validates customer exists (for store credit)

9. **Create payment status transition tests**
   - Test payment status: pending → completed
   - Test payment status: pending → failed
   - Test payment cannot transition from completed to pending
   - Test payment cannot transition from failed to completed (requires new payment)
   - Test payment status filtering

10. **Create payment gateway integration tests (mocked)**
    - Mock payment gateway API calls
    - Test gateway successful response handling
    - Test gateway error response handling
    - Test gateway timeout handling
    - Test gateway decline handling
    - Test retry logic for failed payments

11. **Create payment record tests**
    - Test payment record includes transaction_id
    - Test payment record includes payment_method_type
    - Test payment record includes amount
    - Test payment record includes status
    - Test payment record includes transaction_reference
    - Test payment record includes payment_date
    - Test payment record includes cashier (user)

12. **Create payment refund tests (if applicable)**
    - Test refund_payment for cash payment
    - Test refund_payment for card payment (requires gateway)
    - Test refund_payment updates payment status to 'refunded'
    - Test refund_payment creates refund record
    - Test partial refund vs full refund
    - Test refund validation (only for completed payments)

### Payment Flow Diagram

```
Payment Processing Flow
┌─────────────────────────────────────────────────┐
│         Select Payment Method(s)                │
│    (cash, card, mobile, store_credit)           │
└────────────────┬────────────────────────────────┘
                 │
      ┌──────────┴──────────┐
      │   Single Payment?   │
      └──────────┬──────────┘
                 │
         ┌───────┴────────┐
         │                │
         ▼                ▼
    ┌─────────┐    ┌──────────────┐
    │ Single  │    │ Split Payment│
    │ Payment │    │ (multiple)   │
    └────┬────┘    └──────┬───────┘
         │                │
         └────────┬────────┘
                  │
         ┌────────┴────────┐
         │  Process Each   │
         │  Payment Method │
         └────────┬────────┘
                  │
     ┌────────────┼────────────┐
     │            │            │
     ▼            ▼            ▼
┌─────────┐  ┌──────┐  ┌──────────┐
│  Cash   │  │ Card │  │  Mobile  │
│ Change? │  │ Auth │  │   Auth   │
└────┬────┘  └───┬──┘  └─────┬────┘
     │           │            │
     └───────────┼────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│        Validate Payment Total                   │
│      (must equal transaction total)             │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│       Create Payment Record(s)                  │
│  ┌──────────────────────────────────────────┐  │
│  │ Transaction ID                           │  │
│  │ Payment method                           │  │
│  │ Amount                                   │  │
│  │ Status (completed/pending/failed)        │  │
│  │ Transaction reference                    │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│    Update Session Totals & Complete Txn        │
└─────────────────────────────────────────────────┘
```

### Test Data Examples

| Payment Method | Amount | Expected Result | Change |
|----------------|--------|-----------------|--------|
| Cash | 1000.00 | Completed | 0.00 |
| Cash | 1200.00 | Completed | 200.00 |
| Card | 1000.00 | Completed/Pending | N/A |
| Mobile | 1000.00 | Completed/Pending | N/A |
| Store Credit | 500.00 | Completed | N/A |
| Split (Cash+Card) | 500+500 | Completed | 0.00 |
| Split (Cash+Card+Mobile) | 300+400+300 | Completed | 0.00 |

### Testing Best Practices
- Mock external payment gateway calls
- Test both synchronous and asynchronous payment flows
- Verify payment record creation
- Test decimal precision for monetary amounts
- Test currency handling (LKR)
- Test concurrent payment processing (if applicable)
- Validate payment status transitions

### Test Coverage Goals
- Cash payment: 100% coverage
- Card payment: 100% coverage (mocked gateway)
- Mobile payment: 100% coverage (mocked gateway)
- Store credit: 100% coverage
- Split payment: 100% coverage
- Payment validation: 100% coverage

### Expected Test File Structure

```
Payment Processing Tests
├── Cash Payment
│   ├── Test exact amount
│   ├── Test with change
│   ├── Test insufficient amount
│   └── Test record creation
├── Card Payment
│   ├── Test successful payment
│   ├── Test gateway integration (mocked)
│   ├── Test timeout handling
│   └── Test decline handling
├── Mobile Payment
│   ├── Test successful payment
│   ├── Test different providers
│   ├── Test pending confirmation
│   └── Test validation
├── Store Credit Payment
│   ├── Test sufficient credit
│   ├── Test insufficient credit
│   └── Test balance update
├── Split Payment
│   ├── Test two methods
│   ├── Test three methods
│   ├── Test validation
│   └── Test record creation
├── Payment Validation
│   ├── Test amount validation
│   ├── Test cart validation
│   ├── Test session validation
│   └── Test method validation
├── Payment Status
│   ├── Test status transitions
│   └── Test status filtering
└── Payment Records
    ├── Test record fields
    ├── Test transaction reference
    └── Test timestamp
```

### Pytest Command Examples

| Command | Purpose |
|---------|---------|
| `pytest apps/pos/tests/test_payment.py -v` | Run all payment tests |
| `pytest -k "test_process_cash"` | Run cash payment tests |
| `pytest -k "split_payment"` | Run split payment tests |
| `pytest apps/pos/tests/test_payment.py --cov=apps/pos/services/payment_service.py` | Coverage for payment service |

### Verification Checklist
- [ ] Cash payment tests created (6-8 tests)
- [ ] Card payment tests created (7-9 tests)
- [ ] Mobile payment tests created (6-8 tests)
- [ ] Store credit tests created (5-6 tests)
- [ ] Split payment tests created (6-8 tests)
- [ ] Payment validation tests created (6-8 tests)
- [ ] Payment status tests created (4-5 tests)
- [ ] Payment record tests created (5-7 tests)
- [ ] Refund tests created (if applicable, 5-6 tests)
- [ ] All tests pass successfully
- [ ] Test coverage > 95% for payment service

---

## Task 91: Create Transaction Flow Tests

### Overview
Create comprehensive end-to-end tests for complete transaction flows including cart creation, item addition, payment processing, transaction completion, stock updates, and void/refund scenarios.

### Dependencies
- Task 85: Implement transaction completion service
- Tasks 87-90: All previous test files and fixtures
- Complete POS service integration

### Instructions

1. **Create transaction flow test file**
   - Create `apps/pos/tests/test_transaction.py`
   - Import pytest, all factories, all services, and models
   - Mark module with `@pytest.mark.django_db`

2. **Add transaction factories (if not already in factories.py)**
   - Define POSTransactionFactory with all relationships
   - Include transaction_number, status, totals
   - Include session, cart, cashier references
   - Include payment records as related factory

3. **Create complete transaction flow tests**
   - Test end-to-end transaction: open session → add items → apply discount → process payment → complete
   - Test transaction creates all required records (cart, items, payments, transaction)
   - Test transaction updates session totals (sales_amount, transactions_count)
   - Test transaction updates stock quantities
   - Test transaction generates transaction_number (format: TXN-YYYYMMDD-XXXX)
   - Test transaction status transitions: cart → payment → completed
   - Test transaction records all timestamps (created_at, completed_at)

4. **Create stock update tests**
   - Test transaction completion decrements product stock
   - Test transaction completion decrements variant stock (if applicable)
   - Test transaction respects stock tracking settings
   - Test transaction handles insufficient stock during completion
   - Test transaction with multiple items updates all stocks
   - Test transaction void restores stock quantities

5. **Create session totals update tests**
   - Test transaction updates session.total_sales
   - Test transaction updates session.total_transactions
   - Test transaction updates session.cash_total (for cash payments)
   - Test transaction updates session.card_total (for card payments)
   - Test transaction updates session.mobile_total (for mobile payments)
   - Test transaction with split payment updates all totals

6. **Create held cart workflow tests**
   - Test hold_cart changes cart status to 'held'
   - Test hold_cart with cart_reference or customer identifier
   - Test recall_cart retrieves held cart
   - Test recall_cart changes status back to 'active'
   - Test recall_cart validates session is still open
   - Test multiple held carts per session
   - Test held cart expires after time period (optional)

7. **Create void transaction tests**
   - Test void_transaction with valid transaction_id
   - Test void_transaction validates transaction is completed
   - Test void_transaction changes status to 'void'
   - Test void_transaction creates void record with reason
   - Test void_transaction restores stock quantities
   - Test void_transaction requires manager authorization (if applicable)
   - Test void_transaction updates session totals (negative adjustment)
   - Test void_transaction within same session vs different session

8. **Create transaction number generation tests**
   - Test transaction_number format: TXN-YYYYMMDD-XXXX
   - Test transaction_number uniqueness
   - Test transaction_number sequence increments
   - Test transaction_number date component matches transaction date
   - Test transaction_number with high volume (concurrency)

9. **Create multiple transactions in session tests**
   - Test session with multiple completed transactions
   - Test session totals aggregate all transactions
   - Test transaction sequence within session
   - Test transaction isolation (one doesn't affect another)
   - Test session close with multiple transactions

10. **Create transaction validation tests**
    - Test transaction requires non-empty cart
    - Test transaction requires valid payment (amount matches total)
    - Test transaction requires open session
    - Test transaction validates cashier authorization
    - Test transaction prevents duplicate completion

11. **Create transaction record tests**
    - Test transaction record includes transaction_number
    - Test transaction record includes session_id
    - Test transaction record includes cart_id
    - Test transaction record includes cashier_id
    - Test transaction record includes customer_id (if provided)
    - Test transaction record includes totals (subtotal, discount, tax, grand_total)
    - Test transaction record includes status
    - Test transaction record includes timestamps
    - Test transaction record includes payment records (as related objects)

12. **Create transaction query tests**
    - Test query transactions by session
    - Test query transactions by date range
    - Test query transactions by cashier
    - Test query transactions by status
    - Test query transactions by transaction_number
    - Test transaction search with filters

13. **Create concurrent transaction tests (edge case)**
    - Test multiple cashiers on different terminals (concurrent transactions)
    - Test transaction_number uniqueness under concurrency
    - Test stock update race conditions (pessimistic locking)
    - Test session totals accuracy with concurrent updates

### Transaction Flow Diagram

```
Complete Transaction Flow
┌─────────────────────────────────────────────────┐
│              Open Session                       │
│      (cashier, terminal, opening_balance)       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│             Create Cart                         │
│         (session, cart_reference)               │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│           Add Items to Cart                     │
│  ┌──────────────────────────────────────────┐  │
│  │ Product search (barcode/SKU/name)        │  │
│  │ Add to cart (product, variant, qty)      │  │
│  │ Update quantities                        │  │
│  │ Remove items                             │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Apply Discounts (Optional)              │
│  ┌──────────────────────────────────────────┐  │
│  │ Line discounts (per item)                │  │
│  │ Cart discount (total)                    │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│          Calculate Totals                       │
│  (subtotal, discounts, tax, grand_total)        │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Process Payment(s)                      │
│  ┌──────────────────────────────────────────┐  │
│  │ Cash / Card / Mobile / Store Credit      │  │
│  │ Split payment (if applicable)            │  │
│  │ Payment validation                       │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│         Complete Transaction                    │
│  ┌──────────────────────────────────────────┐  │
│  │ Generate transaction_number              │  │
│  │ Create transaction record                │  │
│  │ Update stock quantities                  │  │
│  │ Update session totals                    │  │
│  │ Mark cart as completed                   │  │
│  │ Mark payments as completed               │  │
│  └──────────────────────────────────────────┘  │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│        Print Receipt (Optional)                 │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│        More Transactions? (loop)                │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────┐
│           Close Session                         │
│  (closing_cash, cash_reconciliation)            │
└─────────────────────────────────────────────────┘

Alternative Flows:
┌─────────────────────────────────────────────────┐
│         Hold Cart (Optional)                    │
│  Save cart for later, recall when needed        │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│       Void Transaction (Optional)               │
│  Cancel completed transaction, restore stock    │
└─────────────────────────────────────────────────┘
```

### Test Scenarios

| Scenario | Steps | Expected Outcome |
|----------|-------|------------------|
| Simple sale | Open session → Add item → Cash payment → Complete | Transaction completed, stock updated, session totals updated |
| Multiple items | Add 5 items → Apply line discounts → Card payment → Complete | All items in transaction, discounts applied, payment processed |
| Split payment | Add items → Pay 50% cash, 50% card → Complete | Two payment records, transaction completed |
| Held cart | Add items → Hold cart → Create new cart → Recall held cart → Complete | Cart recalled with all items, completed successfully |
| Void transaction | Complete transaction → Void with reason | Transaction voided, stock restored, session adjusted |
| Multiple transactions | Complete 3 transactions in one session | Session totals aggregate all three |

### Testing Best Practices
- Test complete flows, not just individual methods
- Verify all side effects (stock, session totals, statuses)
- Test both happy path and error paths
- Use fixtures for complex setup (open session, add products)
- Verify data integrity across related tables
- Test transaction isolation and concurrency
- Use database transactions (rollback on test failure)

### Test Coverage Goals
- Complete transaction flow: 100% coverage
- Stock update logic: 100% coverage
- Session totals update: 100% coverage
- Void transaction: 100% coverage
- Held cart workflow: 100% coverage

### Expected Test File Structure

```
Transaction Flow Tests
├── Complete Transaction Flow
│   ├── Test simple sale
│   ├── Test multiple items
│   ├── Test with discounts
│   ├── Test with tax
│   └── Test record creation
├── Stock Updates
│   ├── Test stock decrement
│   ├── Test variant stock
│   ├── Test insufficient stock
│   └── Test void restores stock
├── Session Totals
│   ├── Test sales total update
│   ├── Test transaction count
│   ├── Test payment totals
│   └── Test multiple transactions
├── Held Cart Workflow
│   ├── Test hold cart
│   ├── Test recall cart
│   ├── Test multiple held carts
│   └── Test validation
├── Void Transaction
│   ├── Test void completed
│   ├── Test void validation
│   ├── Test stock restoration
│   └── Test session adjustment
├── Transaction Number
│   ├── Test format
│   ├── Test uniqueness
│   ├── Test sequence
│   └── Test concurrency
├── Multiple Transactions
│   ├── Test session aggregation
│   ├── Test isolation
│   └── Test sequence
├── Validation
│   ├── Test cart validation
│   ├── Test payment validation
│   └── Test session validation
└── Query & Search
    ├── Test query by session
    ├── Test query by date
    ├── Test query by cashier
    └── Test filters
```

### Pytest Command Examples

| Command | Purpose |
|---------|---------|
| `pytest apps/pos/tests/test_transaction.py -v` | Run all transaction tests |
| `pytest -k "test_complete_transaction"` | Run complete flow tests |
| `pytest -k "void"` | Run void transaction tests |
| `pytest apps/pos/tests/test_transaction.py --cov=apps/pos/services/` | Coverage for all services |

### Verification Checklist
- [ ] Complete transaction flow tests created (8-10 tests)
- [ ] Stock update tests created (5-6 tests)
- [ ] Session totals tests created (6-7 tests)
- [ ] Held cart workflow tests created (5-6 tests)
- [ ] Void transaction tests created (6-8 tests)
- [ ] Transaction number tests created (4-5 tests)
- [ ] Multiple transactions tests created (4-5 tests)
- [ ] Validation tests created (4-5 tests)
- [ ] Query tests created (5-6 tests)
- [ ] Concurrent tests created (3-4 tests)
- [ ] All tests pass successfully
- [ ] End-to-end coverage > 95%

---

## Summary

### Tasks Completed in This Document
| Task # | Task Name | Key Deliverable |
|--------|-----------|-----------------|
| 87 | Create terminal/session tests | Terminal and session model/service tests |
| 88 | Create cart operation tests | Cart operations and calculations tests |
| 89 | Create product search tests | Search functionality tests (barcode, SKU, name) |
| 90 | Create payment processing tests | Payment methods and validation tests |
| 91 | Create transaction flow tests | End-to-end transaction flow tests |

### Test Suite Structure
```
apps/pos/tests/
├── __init__.py
├── conftest.py              # Shared fixtures
├── factories.py             # Test data factories
├── test_terminal.py         # Task 87: Terminal tests
├── test_session.py          # Task 87: Session tests
├── test_cart.py             # Task 88: Cart operation tests
├── test_search.py           # Task 89: Product search tests
├── test_payment.py          # Task 90: Payment processing tests
└── test_transaction.py      # Task 91: Transaction flow tests
```

### Test Statistics
| Test File | Estimated Tests | Coverage Target |
|-----------|-----------------|-----------------|
| test_terminal.py | 8-10 | 100% |
| test_session.py | 15-20 | 100% |
| test_cart.py | 50-60 | 95%+ |
| test_search.py | 45-55 | 95%+ |
| test_payment.py | 55-65 | 95%+ |
| test_transaction.py | 55-65 | 95%+ |
| **Total** | **230-280** | **95%+** |

### Next Steps
1. Proceed to [02_Tasks-92-94_API-Tests-Documentation.md](02_Tasks-92-94_API-Tests-Documentation.md) for API tests and documentation
2. Run all tests: `pytest apps/pos/tests/ -v --cov=apps/pos`
3. Generate coverage report: `pytest apps/pos/tests/ --cov=apps/pos --cov-report=html`
4. Review and fix any failing tests
5. Ensure overall test coverage > 95%

---

## Notes for AI Agents

1. **Test Execution Order:** Tasks 87-91 should be completed in sequence as they build upon each other
2. **No Code Generation:** These are instructions only; test implementation is the developer's responsibility
3. **Factory Pattern:** Use factory_boy for all test data creation to maintain consistency
4. **Pytest Fixtures:** Leverage pytest fixtures for reusable test setup
5. **Django Test Database:** All tests use Django's test database (automatic creation/teardown)
6. **Coverage Goals:** Aim for >95% test coverage for all POS services
7. **Test Independence:** Each test should be independent and not rely on other tests
8. **Mocking:** Mock external services (payment gateways, APIs) to ensure test isolation
9. **Parametrized Tests:** Use `@pytest.mark.parametrize` for testing multiple scenarios efficiently
10. **Test Documentation:** Each test function should have a clear, descriptive name and docstring
