# Tasks 45-52: Filters, Facets, and Highlighting

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** C - Search Features  
> **Document:** 02 of 02  
> **Tasks Covered:** 45, 46, 47, 48, 49, 50, 51, 52

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-44_Service-Synonyms.md](01_Tasks-35-44_Service-Synonyms.md)

---

## Document Overview

This document covers the creation of advanced search features including filter builder for dynamic query construction, faceted search for result categorization, and search result highlighting. These features enhance user experience by providing precise filtering capabilities and visual feedback for search matches in the LankaCommerce Cloud ERP system.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 45 | Create Filter Builder | Medium | 40 min |
| 46 | Create category_filter Method | Low | 20 min |
| 47 | Create brand_filter Method | Low | 15 min |
| 48 | Create price_filter Method | Low | 25 min |
| 49 | Create stock_filter Method | Low | 15 min |
| 50 | Create Faceted Search | Medium | 35 min |
| 51 | Create Highlighting | Low | 25 min |
| 52 | Verify Search Features | Low | 30 min |

---

## Task 45: Create Filter Builder

### Overview
Create a FilterBuilder class that constructs MeiliSearch filter queries dynamically based on user-specified criteria. This builder provides a clean interface for creating complex filter combinations and ensures proper query syntax for category, brand, price, and stock filtering operations.

### Dependencies
- Task 36: search method implemented in SearchService
- Product model with filterable attributes (category, brand, price, stock)

### Instructions

1. **Create FilterBuilder file structure**
   - Navigate to `backend/apps/search/services/` directory
   - Create new file named `filter_builder.py`
   - Import required modules for query construction
   - Plan filter method signatures and return formats

2. **Design FilterBuilder class architecture**
   - Create FilterBuilder class with proper initialization
   - Design methods for different filter types
   - Plan filter combination and validation logic
   - Consider extensibility for future filter types

3. **Implement base filter infrastructure**
   - Create private methods for query sanitization
   - Add validation helpers for filter parameters
   - Implement query escaping for special characters
   - Create methods for combining multiple filters

4. **Add filter validation methods**
   - Create method to validate filter parameter types
   - Add validation for numeric ranges and values
   - Implement string validation and sanitization
   - Add method to validate filter combinations

5. **Implement filter combination logic**
   - Create method to combine filters with AND logic
   - Add method to combine filters with OR logic
   - Implement filter grouping and precedence
   - Add method to build final filter string

6. **Create filter utility methods**
   - Add method to escape special characters in values
   - Create method to validate date and numeric ranges
   - Implement filter optimization and simplification
   - Add debugging and logging utilities

### FilterBuilder Architecture

```
FilterBuilder
├── __init__() → Initialize builder
├── _validate_filter() → Validate filter parameters
├── _escape_value() → Escape special characters
├── _combine_filters() → Combine multiple filters
├── category_filter() → Category filtering (Task 46)
├── brand_filter() → Brand filtering (Task 47)
├── price_filter() → Price range filtering (Task 48)
├── stock_filter() → Stock availability filtering (Task 49)
└── build() → Build final filter string
```

### Filter Types Overview

| Filter Type | Method | Parameters | Example Output |
|-------------|--------|------------|----------------|
| Category | category_filter() | category_id | category_id = 5 |
| Brand | brand_filter() | brand_name | brand = 'Apple' |
| Price | price_filter() | min, max | price >= 100 AND price <= 500 |
| Stock | stock_filter() | in_stock_only | stock > 0 |

### Filter Validation Rules

| Parameter Type | Validation |
|----------------|------------|
| Integer | Must be positive, within reasonable range |
| String | Non-empty, escaped for special characters |
| Float | Positive for prices, proper decimal format |
| Boolean | True/False validation |

### Filter Combination Examples

```python
# Single filter
filter_builder.category_filter(5).build()
# Result: "category_id = 5"

# Multiple filters
filter_builder.category_filter(5).brand_filter("Apple").build()
# Result: "category_id = 5 AND brand = 'Apple'"

# Complex filter
filter_builder.price_filter(100, 500).stock_filter(True).build()
# Result: "price >= 100 AND price <= 500 AND stock > 0"
```

### MeiliSearch Filter Syntax

| Operation | Syntax | Example |
|-----------|--------|---------|
| Equality | field = value | category_id = 5 |
| String Equality | field = 'value' | brand = 'Apple' |
| Range | field >= min AND field <= max | price >= 100 AND price <= 500 |
| Greater Than | field > value | stock > 0 |
| Combination | filter1 AND filter2 | category_id = 5 AND brand = 'Apple' |

### Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| Invalid Parameter | Raise ValueError with descriptive message |
| Type Mismatch | Convert where possible or raise TypeError |
| Range Error | Validate min/max relationships |
| SQL Injection | Escape and sanitize all user inputs |

### Filter Builder Usage Pattern

```python
# Initialize builder
builder = FilterBuilder()

# Add filters
builder.category_filter(electronics_id)
builder.brand_filter("Samsung")
builder.price_filter(min_price=200, max_price=1000)
builder.stock_filter(in_stock_only=True)

# Build final filter
filter_query = builder.build()
```

### Expected Outcome
- Functional FilterBuilder class with proper initialization
- Filter validation and sanitization methods
- Foundation for specific filter implementations
- Query combination and building capabilities

### Verification Checklist
- [ ] `backend/apps/search/services/filter_builder.py` created
- [ ] FilterBuilder class defined with proper architecture
- [ ] Filter validation and sanitization methods implemented
- [ ] Query combination logic prepared
- [ ] Error handling for invalid parameters
- [ ] Foundation ready for specific filter methods

---

## Task 46: Create category_filter Method

### Overview
Implement the category_filter method in FilterBuilder to create category-based filtering for search results. This method enables users to filter products by specific categories, supporting both single category filtering and category hierarchy navigation in the LankaCommerce Cloud ERP system.

### Dependencies
- Task 45: Create Filter Builder

### Instructions

1. **Define category_filter method signature**
   - Create method in FilterBuilder class
   - Accept category_id parameter as integer
   - Add optional parameter for include_subcategories
   - Include proper type hints and documentation

2. **Implement category ID validation**
   - Validate category_id is a positive integer
   - Check category exists in database (optional verification)
   - Handle None or invalid category ID values
   - Add appropriate error messages for validation failures

3. **Create category filter query construction**
   - Build MeiliSearch filter string for category matching
   - Use proper syntax: "category_id = X"
   - Handle category ID escaping and formatting
   - Ensure query compatibility with MeiliSearch

4. **Add subcategory support (optional)**
   - Implement logic for including subcategories
   - Query category hierarchy if include_subcategories is True
   - Build filter for category ID list using IN operator
   - Handle parent-child category relationships

5. **Implement filter builder integration**
   - Add category filter to internal filter collection
   - Support method chaining with other filters
   - Maintain filter order and combination logic
   - Return self for fluent interface pattern

6. **Add logging and debugging support**
   - Log category filter creation with parameters
   - Add debug information for filter construction
   - Include category filter in builder state tracking
   - Support filter inspection and debugging

### Method Signature

```python
def category_filter(self, category_id: int, include_subcategories: bool = False) -> 'FilterBuilder':
    """
    Add category filter to the query.
    
    Args:
        category_id: ID of the category to filter by
        include_subcategories: Include child categories in filter
        
    Returns:
        Self for method chaining
    """
```

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| category_id | int | Yes | Category ID to filter by |
| include_subcategories | bool | No | Include child categories (default: False) |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Type Check | isinstance(category_id, int) | "Category ID must be integer" |
| Positive Value | category_id > 0 | "Category ID must be positive" |
| Exists (Optional) | Category.objects.filter(id=category_id).exists() | "Category does not exist" |

### Filter Query Examples

| Input | Output |
|-------|--------|
| category_filter(5) | "category_id = 5" |
| category_filter(10) | "category_id = 10" |

### Subcategory Support (Advanced)

```python
# With subcategories
category_filter(5, include_subcategories=True)
# Output: "category_id IN [5, 15, 25, 35]"  # Parent + children
```

### Category Hierarchy Example

```
Electronics (ID: 5)
├── Phones (ID: 15)
├── Laptops (ID: 25)
└── Accessories (ID: 35)

# category_filter(5, True) includes all IDs: [5, 15, 25, 35]
```

### Method Implementation Flow

```
Validate category_id Parameter
    │
    ▼
Check Include Subcategories Flag
    │
    ├── False → Simple Filter
    └── True → Query Subcategories
    │
    ▼
Build MeiliSearch Filter String
    │
    ▼
Add to Internal Filter Collection
    │
    ▼
Return Self for Method Chaining
```

### Filter Builder Integration

| Operation | Implementation |
|-----------|----------------|
| Add Filter | self._filters.append(filter_string) |
| Method Chain | return self |
| Combine | Join with AND when building final query |

### Usage Examples

```python
# Simple category filter
builder.category_filter(5)  # Electronics only

# Category with other filters
builder.category_filter(5).brand_filter("Apple")

# Method chaining
filter_query = (FilterBuilder()
                .category_filter(electronics_id)
                .price_filter(100, 500)
                .build())
```

### Error Handling

| Error Case | Action |
|------------|--------|
| None category_id | Raise ValueError("Category ID is required") |
| Negative category_id | Raise ValueError("Category ID must be positive") |
| String category_id | Raise TypeError("Category ID must be integer") |

### Expected Outcome
- Functional category_filter method with proper validation
- MeiliSearch-compatible filter query construction
- Method chaining support for filter combinations
- Optional subcategory inclusion functionality

### Verification Checklist
- [ ] category_filter method signature defined correctly
- [ ] Category ID validation implemented
- [ ] MeiliSearch filter query construction working
- [ ] Method chaining returns self properly
- [ ] Error handling for invalid category IDs
- [ ] Integration with FilterBuilder class
- [ ] Optional subcategory support consideration

---

## Task 47: Create brand_filter Method

### Overview
Implement the brand_filter method in FilterBuilder to enable brand-based product filtering. This method allows users to filter search results by specific brands, supporting exact brand name matching and proper string handling for brand-based queries in the LankaCommerce Cloud ERP system.

### Dependencies
- Task 45: Create Filter Builder

### Instructions

1. **Define brand_filter method signature**
   - Create method in FilterBuilder class
   - Accept brand parameter as string
   - Add proper type hints and comprehensive documentation
   - Support method chaining pattern

2. **Implement brand name validation**
   - Validate brand parameter is not None or empty
   - Strip whitespace and normalize brand name
   - Check brand name length limits (reasonable constraints)
   - Handle special characters in brand names

3. **Create brand filter query construction**
   - Build MeiliSearch filter string with proper quoting
   - Use syntax: "brand = 'Brand Name'"
   - Escape single quotes and special characters in brand names
   - Ensure case-sensitive or case-insensitive matching as needed

4. **Handle brand name normalization**
   - Normalize brand name formatting (trim, case handling)
   - Handle brand names with spaces and special characters
   - Consider brand name variations and aliases
   - Implement consistent brand name formatting

5. **Add brand existence validation (optional)**
   - Check if brand exists in product database
   - Provide warning for non-existent brands
   - Handle brand name variations and typos
   - Consider fuzzy brand matching for user convenience

6. **Implement filter integration and logging**
   - Add brand filter to internal filter collection
   - Support combination with other filter types
   - Log brand filter creation for debugging
   - Maintain filter order and precedence

### Method Signature

```python
def brand_filter(self, brand: str) -> 'FilterBuilder':
    """
    Add brand filter to the query.
    
    Args:
        brand: Brand name to filter by
        
    Returns:
        Self for method chaining
    """
```

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| brand | str | Yes | Brand name to filter by |

### Brand Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Not None | brand is not None | "Brand name is required" |
| Not Empty | len(brand.strip()) > 0 | "Brand name cannot be empty" |
| Max Length | len(brand) <= 50 | "Brand name too long (max 50 chars)" |
| Valid Chars | Contains valid characters | "Brand name contains invalid characters" |

### String Escaping Examples

| Input Brand | Escaped Output |
|-------------|----------------|
| "Apple" | brand = 'Apple' |
| "Samsung Galaxy" | brand = 'Samsung Galaxy' |
| "LG (Life's Good)" | brand = 'LG (Life\'s Good)' |
| "D-Link" | brand = 'D-Link' |

### Filter Query Construction

```python
# Simple brand
"Apple" → "brand = 'Apple'"

# Brand with spaces
"Samsung Galaxy" → "brand = 'Samsung Galaxy'"

# Brand with quotes
"Life's Good" → "brand = 'Life\'s Good'"
```

### Brand Name Normalization

| Original | Normalized |
|----------|------------|
| " Apple " | "Apple" |
| "SAMSUNG" | "Samsung" (if case normalization enabled) |
| "sony" | "Sony" (if case normalization enabled) |

### Method Implementation Flow

```
Validate Brand Parameter
    │
    ▼
Normalize Brand Name
    │
    ▼
Escape Special Characters
    │
    ▼
Build MeiliSearch Filter String
    │
    ▼
Add to Filter Collection
    │
    ▼
Return Self for Chaining
```

### Popular Brand Examples

| Category | Brands |
|----------|--------|
| Electronics | Apple, Samsung, Sony, LG |
| Automotive | Toyota, Honda, Nissan |
| Clothing | Nike, Adidas, Puma |
| Computing | Dell, HP, Lenovo |

### Error Handling

| Error Case | Action |
|------------|--------|
| None brand | Raise ValueError("Brand name is required") |
| Empty brand | Raise ValueError("Brand name cannot be empty") |
| Too long brand | Raise ValueError("Brand name exceeds maximum length") |

### Filter Combination Examples

```python
# Brand only
builder.brand_filter("Apple")
# Result: "brand = 'Apple'"

# Brand with category
builder.category_filter(5).brand_filter("Samsung")
# Result: "category_id = 5 AND brand = 'Samsung'"

# Multiple filters
builder.brand_filter("Sony").price_filter(100, 500).stock_filter(True)
# Result: "brand = 'Sony' AND price >= 100 AND price <= 500 AND stock > 0"
```

### Usage Examples

```python
# Simple brand filter
filter_builder = FilterBuilder().brand_filter("Apple")

# Method chaining
query = (FilterBuilder()
         .category_filter(electronics_id)
         .brand_filter("Samsung")
         .build())

# Brand with special characters
filter_builder.brand_filter("Life's Good")
```

### Expected Outcome
- Functional brand_filter method with string validation
- Proper escaping and quoting for MeiliSearch queries
- Brand name normalization and validation
- Integration with FilterBuilder for method chaining

### Verification Checklist
- [ ] brand_filter method signature defined correctly
- [ ] Brand name validation and normalization implemented
- [ ] String escaping for special characters working
- [ ] MeiliSearch filter query construction proper
- [ ] Method chaining support implemented
- [ ] Error handling for invalid brand names
- [ ] Integration with other filter methods tested

---

## Task 48: Create price_filter Method

### Overview
Implement the price_filter method in FilterBuilder to enable price range filtering for search results. This method supports minimum and maximum price constraints, handles currency formatting, and provides flexible price filtering options for the LankaCommerce Cloud ERP system.

### Dependencies
- Task 45: Create Filter Builder

### Instructions

1. **Define price_filter method signature**
   - Create method in FilterBuilder class
   - Accept min_price and max_price as optional parameters
   - Both parameters should be float or None
   - Include comprehensive documentation and examples

2. **Implement price parameter validation**
   - Validate price values are positive numbers or None
   - Check that min_price <= max_price when both provided
   - Handle decimal precision and rounding
   - Validate reasonable price ranges for product catalog

3. **Create price filter query construction**
   - Build minimum price filter: "price >= min_price"
   - Build maximum price filter: "price <= max_price"
   - Combine both when both min and max provided
   - Handle single-bound filters (only min or only max)

4. **Implement price range validation**
   - Ensure minimum price is not negative
   - Validate maximum price is reasonable (not excessively high)
   - Check price range makes sense (min < max)
   - Handle edge cases like zero prices

5. **Add currency and decimal handling**
   - Format prices to appropriate decimal places (2 decimals)
   - Handle currency conversion if needed
   - Ensure consistent price formatting across filters
   - Consider price precision and rounding rules

6. **Implement filter combination and logging**
   - Add price filter to filter collection
   - Support combination with other filter types
   - Log price filter creation with range details
   - Handle filter precedence and ordering

### Method Signature

```python
def price_filter(self, min_price: Optional[float] = None, max_price: Optional[float] = None) -> 'FilterBuilder':
    """
    Add price range filter to the query.
    
    Args:
        min_price: Minimum price (inclusive)
        max_price: Maximum price (inclusive)
        
    Returns:
        Self for method chaining
    """
```

### Method Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| min_price | float or None | No | Minimum price threshold |
| max_price | float or None | No | Maximum price threshold |

### Price Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Non-negative | price >= 0 | "Price cannot be negative" |
| Reasonable Max | price <= 1000000 | "Price exceeds maximum limit" |
| Range Valid | min_price <= max_price | "Minimum price must be less than maximum" |
| At Least One | min_price or max_price | "At least one price bound required" |

### Filter Query Examples

| Input | Output |
|-------|--------|
| price_filter(min_price=100) | "price >= 100.00" |
| price_filter(max_price=500) | "price <= 500.00" |
| price_filter(100, 500) | "price >= 100.00 AND price <= 500.00" |

### Price Range Scenarios

| Scenario | min_price | max_price | Filter Result |
|----------|-----------|-----------|---------------|
| Minimum only | 50.00 | None | "price >= 50.00" |
| Maximum only | None | 200.00 | "price <= 200.00" |
| Range | 50.00 | 200.00 | "price >= 50.00 AND price <= 200.00" |
| Equal bounds | 100.00 | 100.00 | "price >= 100.00 AND price <= 100.00" |

### Method Implementation Flow

```
Validate At Least One Parameter Provided
    │
    ▼
Validate Min Price (if provided)
    │
    ▼
Validate Max Price (if provided)
    │
    ▼
Validate Min <= Max (if both provided)
    │
    ▼
Build Filter Components
    │
    ▼
Combine Filter Components with AND
    │
    ▼
Add to Filter Collection
```

### Price Formatting

| Input | Formatted |
|-------|-----------|
| 100 | 100.00 |
| 99.9 | 99.90 |
| 199.999 | 200.00 (rounded) |
| 0 | 0.00 |

### Error Handling

| Error Case | Action |
|------------|--------|
| Both None | Raise ValueError("At least one price bound required") |
| Negative price | Raise ValueError("Price cannot be negative") |
| Min > Max | Raise ValueError("Min price must be <= max price") |
| Invalid type | Raise TypeError("Price must be numeric") |

### Common Price Ranges

| Category | Typical Ranges (LKR) |
|----------|---------------------|
| Electronics | 5,000 - 500,000 |
| Clothing | 500 - 50,000 |
| Books | 200 - 10,000 |
| Furniture | 10,000 - 1,000,000 |

### Usage Examples

```python
# Minimum price only
builder.price_filter(min_price=1000.0)

# Maximum price only
builder.price_filter(max_price=50000.0)

# Price range
builder.price_filter(min_price=1000.0, max_price=50000.0)

# Combined with other filters
(FilterBuilder()
 .category_filter(electronics_id)
 .price_filter(min_price=5000.0, max_price=100000.0)
 .brand_filter("Samsung")
 .build())
```

### Filter Combination Examples

```python
# Price with category
"category_id = 5 AND price >= 100.00 AND price <= 500.00"

# Price with brand and stock
"brand = 'Apple' AND price >= 200.00 AND stock > 0"
```

### Expected Outcome
- Functional price_filter method with range validation
- Proper decimal formatting and price handling
- Support for both minimum and maximum price bounds
- Integration with FilterBuilder for complex queries

### Verification Checklist
- [ ] price_filter method signature defined correctly
- [ ] Price validation for negative and excessive values
- [ ] Range validation (min <= max) implemented
- [ ] Decimal formatting to 2 places working
- [ ] Filter query construction for min/max/range
- [ ] Method chaining support implemented
- [ ] Error handling for invalid price inputs
- [ ] Integration with other filters tested

---

## Task 49: Create stock_filter Method

### Overview
Implement the stock_filter method in FilterBuilder to enable stock availability filtering for search results. This method allows users to filter products based on stock availability, supporting both in-stock filtering and specific stock level constraints for inventory management in LankaCommerce Cloud ERP.

### Dependencies
- Task 45: Create Filter Builder

### Instructions

1. **Define stock_filter method signature**
   - Create method in FilterBuilder class
   - Accept in_stock_only parameter as boolean (default True)
   - Add optional min_stock parameter for minimum stock levels
   - Include proper type hints and documentation

2. **Implement stock filtering logic**
   - Create filter for products with stock > 0 when in_stock_only=True
   - Create filter for products with stock = 0 when in_stock_only=False
   - Support minimum stock level filtering with min_stock parameter
   - Handle stock level validation and constraints

3. **Create stock filter query construction**
   - Build "stock > 0" filter for in-stock products
   - Build "stock = 0" filter for out-of-stock products
   - Build "stock >= min_stock" for minimum stock requirements
   - Combine stock filters appropriately

4. **Implement stock parameter validation**
   - Validate in_stock_only is boolean type
   - Validate min_stock is positive integer if provided
   - Check reasonable stock level limits
   - Handle None values appropriately

5. **Add advanced stock filtering options**
   - Support low stock filtering (stock <= threshold)
   - Add high stock filtering for overstock identification
   - Implement stock range filtering if needed
   - Consider stock status enumeration filtering

6. **Integrate with filter builder and logging**
   - Add stock filter to internal filter collection
   - Support method chaining with other filters
   - Log stock filter parameters for debugging
   - Maintain filter order and combination logic

### Method Signature

```python
def stock_filter(self, in_stock_only: bool = True, min_stock: Optional[int] = None) -> 'FilterBuilder':
    """
    Add stock availability filter to the query.
    
    Args:
        in_stock_only: Filter for products in stock (stock > 0)
        min_stock: Minimum stock level required
        
    Returns:
        Self for method chaining
    """
```

### Method Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| in_stock_only | bool | True | Show only products with stock > 0 |
| min_stock | int or None | None | Minimum stock level required |

### Stock Filter Logic

| Configuration | Filter Query |
|---------------|--------------|
| in_stock_only=True | "stock > 0" |
| in_stock_only=False | "stock = 0" |
| min_stock=5 | "stock >= 5" |
| in_stock_only=True, min_stock=10 | "stock >= 10" |

### Stock Level Categories

| Stock Level | Status | Description |
|-------------|--------|-------------|
| 0 | Out of Stock | No inventory available |
| 1-5 | Low Stock | Limited inventory |
| 6-50 | Normal Stock | Adequate inventory |
| 51+ | High Stock | Abundant inventory |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Boolean Type | isinstance(in_stock_only, bool) | "in_stock_only must be boolean" |
| Positive Stock | min_stock > 0 | "Minimum stock must be positive" |
| Reasonable Max | min_stock <= 10000 | "Minimum stock exceeds reasonable limit" |

### Filter Construction Examples

```python
# In stock only (default)
stock_filter() → "stock > 0"

# Out of stock only
stock_filter(in_stock_only=False) → "stock = 0"

# Minimum stock level
stock_filter(min_stock=5) → "stock >= 5"

# In stock with minimum (min_stock takes precedence)
stock_filter(in_stock_only=True, min_stock=10) → "stock >= 10"
```

### Method Implementation Flow

```
Validate in_stock_only Parameter
    │
    ▼
Validate min_stock Parameter (if provided)
    │
    ▼
Determine Filter Logic:
├── min_stock provided → "stock >= min_stock"
├── in_stock_only=True → "stock > 0"  
└── in_stock_only=False → "stock = 0"
    │
    ▼
Build Filter Query String
    │
    ▼
Add to Filter Collection
```

### Stock Status Use Cases

| Use Case | Configuration | Result |
|----------|---------------|--------|
| Available Products | in_stock_only=True | Shows products with any stock |
| Reorder Needed | in_stock_only=False | Shows out-of-stock items |
| Bulk Orders | min_stock=50 | Shows high-stock items |
| Low Stock Alert | Custom logic | Shows items needing restock |

### Error Handling

| Error Case | Action |
|------------|--------|
| Invalid boolean | Raise TypeError("in_stock_only must be boolean") |
| Negative min_stock | Raise ValueError("Minimum stock cannot be negative") |
| Excessive min_stock | Raise ValueError("Minimum stock exceeds limit") |

### Inventory Management Integration

| Feature | Implementation |
|---------|----------------|
| Stock Alerts | Filter for stock <= reorder_level |
| Overstock | Filter for stock >= overstock_level |
| Dead Stock | Filter for stock > 0 AND last_sale > 90_days |
| Fast Moving | Filter with high turnover rate |

### Usage Examples

```python
# Show only available products
builder.stock_filter()

# Show out-of-stock items
builder.stock_filter(in_stock_only=False)

# Minimum stock level
builder.stock_filter(min_stock=10)

# Combined with other filters
(FilterBuilder()
 .category_filter(electronics_id)
 .brand_filter("Samsung")
 .stock_filter(min_stock=5)
 .build())
```

### Filter Combination Examples

```python
# Stock with category and price
"category_id = 5 AND brand = 'Apple' AND stock > 0 AND price >= 100.00"

# Out of stock analysis
"category_id = 10 AND stock = 0"

# High stock items
"stock >= 100 AND category_id = 15"
```

### Expected Outcome
- Functional stock_filter method with boolean and numeric validation
- Support for in-stock, out-of-stock, and minimum stock filtering
- Integration with inventory management requirements
- Method chaining for complex filter combinations

### Verification Checklist
- [ ] stock_filter method signature defined correctly
- [ ] Boolean validation for in_stock_only parameter
- [ ] Numeric validation for min_stock parameter
- [ ] Filter query construction for different scenarios
- [ ] Method chaining support implemented
- [ ] Error handling for invalid parameters
- [ ] Integration with FilterBuilder class tested

---

## Task 50: Create Faceted Search

### Overview
Implement faceted search functionality that provides aggregated counts of search results grouped by various attributes (category, brand, price ranges). This feature enables users to understand result distribution and refine searches through interactive facets in the LankaCommerce Cloud ERP system.

### Dependencies
- Task 49: All filter methods implemented in FilterBuilder
- MeiliSearch facets configuration

### Instructions

1. **Configure MeiliSearch facets settings**
   - Set up faceted attributes in MeiliSearch index
   - Configure facets for category, brand, price_range, and stock_status
   - Enable facet distribution in search settings
   - Test facet configuration and response format

2. **Create FacetedSearch class**
   - Create new file `faceted_search.py` in services directory
   - Design class to handle facet aggregation and formatting
   - Import required MeiliSearch and Django modules
   - Plan facet response structure and data formatting

3. **Implement facet data retrieval**
   - Create method to execute search with facet aggregation
   - Configure MeiliSearch to return facet distributions
   - Handle facet response parsing and formatting
   - Process facet counts and category information

4. **Create price range faceting**
   - Implement dynamic price range buckets
   - Create price ranges: 0-50, 50-100, 100-500, 500+
   - Calculate price range counts from search results
   - Format price ranges for display

5. **Implement category faceting**
   - Retrieve category facet counts from MeiliSearch
   - Map category IDs to category names
   - Handle category hierarchy display if needed
   - Format category facets with product counts

6. **Create brand faceting**
   - Extract brand facet information from search results
   - Handle brand name normalization and display
   - Sort brands by popularity (product count)
   - Format brand facets for user interface

### Faceted Search Architecture

```
FacetedSearch
├── __init__(meilisearch_client) → Initialize service
├── configure_facets() → Set up MeiliSearch facets
├── execute_faceted_search() → Run search with facets
├── process_facet_response() → Parse MeiliSearch response
├── format_category_facets() → Format category data
├── format_brand_facets() → Format brand data
├── calculate_price_ranges() → Create price buckets
└── get_faceted_results() → Main public method
```

### MeiliSearch Facets Configuration

| Facet Attribute | Type | Purpose |
|-----------------|------|---------|
| category_id | Numeric | Category grouping |
| brand | String | Brand grouping |
| price | Numeric | Price range calculation |
| stock_status | String | Availability grouping |

### Facet Response Structure

```python
{
    "facetDistribution": {
        "category_id": {
            "5": 150,    # Electronics: 150 products
            "10": 75,    # Clothing: 75 products
            "15": 50     # Books: 50 products
        },
        "brand": {
            "Apple": 45,
            "Samsung": 38,
            "Sony": 22
        }
    }
}
```

### Price Range Implementation

| Range | Condition | Display |
|-------|-----------|---------|
| Low | 0 <= price < 100 | "Under LKR 100" |
| Medium | 100 <= price < 500 | "LKR 100 - 500" |
| High | 500 <= price < 2000 | "LKR 500 - 2,000" |
| Premium | price >= 2000 | "Over LKR 2,000" |

### Faceted Search Method Flow

```
Execute Search Query with Facets Enabled
    │
    ▼
Retrieve MeiliSearch Facet Response
    │
    ▼
Process Category Facets
    │
    ▼
Process Brand Facets
    │
    ▼
Calculate Price Range Facets
    │
    ▼
Format Final Facet Response
    │
    ▼
Return Structured Facet Data
```

### Facet Data Processing

| Facet Type | Processing Required |
|------------|-------------------|
| Category | Map IDs to names, sort by count |
| Brand | Normalize names, sort by popularity |
| Price | Calculate ranges, format currency |
| Stock | Group by availability status |

### Faceted Results Format

```python
{
    "results": [...],  # Search results
    "facets": {
        "categories": [
            {"id": 5, "name": "Electronics", "count": 150, "selected": False},
            {"id": 10, "name": "Clothing", "count": 75, "selected": True}
        ],
        "brands": [
            {"name": "Apple", "count": 45, "selected": False},
            {"name": "Samsung", "count": 38, "selected": True}
        ],
        "price_ranges": [
            {"range": "0-100", "count": 25, "display": "Under LKR 100"},
            {"range": "100-500", "count": 120, "display": "LKR 100-500"}
        ],
        "stock_status": [
            {"status": "in_stock", "count": 200, "display": "In Stock"},
            {"status": "out_of_stock", "count": 15, "display": "Out of Stock"}
        ]
    }
}
```

### Integration with SearchService

| Integration Point | Implementation |
|------------------|----------------|
| Search Method | Add facets parameter to search method |
| Response Format | Include facets in SearchResults object |
| Filter Application | Apply selected facets as filters |
| UI Integration | Format facets for frontend consumption |

### Performance Considerations

| Aspect | Optimization |
|--------|-------------|
| Facet Calculation | Cache frequently accessed facets |
| Category Mapping | Cache category ID to name mapping |
| Response Size | Limit facet counts to top N items |
| Query Performance | Index faceted attributes properly |

### Error Handling

| Error Type | Handling |
|------------|----------|
| MeiliSearch Error | Log error, return empty facets |
| Facet Parse Error | Log warning, skip problematic facet |
| Category Not Found | Use ID as fallback display name |
| Network Timeout | Return cached facets if available |

### Expected Outcome
- Functional faceted search with category, brand, and price facets
- Proper facet count aggregation and formatting
- Integration with existing search infrastructure
- User-friendly facet response structure

### Verification Checklist
- [ ] MeiliSearch facets configured for required attributes
- [ ] FacetedSearch class implemented with proper methods
- [ ] Category facets working with ID to name mapping
- [ ] Brand facets sorted by popularity
- [ ] Price range calculation and formatting
- [ ] Integration with SearchService class
- [ ] Error handling for facet processing failures
- [ ] Performance optimized for large result sets

---

## Task 51: Create Highlighting

### Overview
Implement search result highlighting that marks matching terms in product names and descriptions with HTML tags. This feature provides visual feedback to users showing exactly which parts of the text match their search query, enhancing the search experience in LankaCommerce Cloud ERP.

### Dependencies
- Task 36: search method implemented in SearchService
- MeiliSearch highlighting configuration

### Instructions

1. **Configure MeiliSearch highlighting settings**
   - Enable highlighting in MeiliSearch index settings
   - Set highlight pre-tag to `<em>` and post-tag to `</em>`
   - Configure highlightable attributes (name, description, sku)
   - Test highlighting configuration and response format

2. **Update SearchService for highlighting**
   - Modify search method to request highlighted results
   - Add highlighting parameters to MeiliSearch query
   - Configure which fields should be highlighted
   - Handle highlighting response parsing

3. **Implement highlight processing**
   - Create method to process MeiliSearch highlight response
   - Extract highlighted snippets from search results
   - Handle multiple highlights in single field
   - Preserve original text when no highlights found

4. **Create highlighting utility methods**
   - Create method to sanitize and validate highlight tags
   - Implement custom highlight tag configuration
   - Add method to strip highlights for plain text display
   - Create highlighting statistics and metrics

5. **Add highlighting to search results**
   - Include highlighted fields in SearchResults structure
   - Preserve both original and highlighted text versions
   - Format highlights for frontend consumption
   - Handle highlighting edge cases and errors

6. **Implement highlighting customization**
   - Support custom highlight tags beyond `<em>`
   - Add configuration for highlight styling
   - Implement snippet extraction around highlights
   - Create highlight truncation for long descriptions

### Highlighting Configuration

```python
# MeiliSearch highlighting settings
{
    "highlightPreTag": "<em>",
    "highlightPostTag": "</em>",
    "attributesToHighlight": ["name", "description", "sku"]
}
```

### Highlighting Settings

| Setting | Value | Purpose |
|---------|-------|---------|
| highlightPreTag | `<em>` | Opening highlight tag |
| highlightPostTag | `</em>` | Closing highlight tag |
| attributesToHighlight | ["name", "description", "sku"] | Fields to highlight |
| cropLength | 200 | Maximum snippet length |

### Search Result with Highlighting

```python
# Original result
{
    "name": "Samsung Galaxy S21 Smartphone",
    "description": "Latest Samsung smartphone with advanced features"
}

# With highlighting (query: "samsung phone")
{
    "name": "Samsung Galaxy S21 Smartphone",
    "description": "Latest Samsung smartphone with advanced features",
    "_formatted": {
        "name": "<em>Samsung</em> Galaxy S21 Smart<em>phone</em>",
        "description": "Latest <em>Samsung</em> smart<em>phone</em> with advanced features"
    }
}
```

### Highlight Processing Flow

```
Execute Search with Highlighting Enabled
    │
    ▼
Receive MeiliSearch Response with _formatted
    │
    ▼
Process Each Result's Highlighted Fields
    │
    ▼
Extract and Validate Highlight Tags
    │
    ▼
Create Highlighted Result Object
    │
    ▼
Include in Search Response
```

### Highlightable Fields

| Field | Priority | Max Length | Purpose |
|-------|----------|------------|---------|
| name | High | 100 chars | Product title highlighting |
| description | Medium | 300 chars | Product details highlighting |
| sku | Low | 50 chars | Product code highlighting |
| brand | Medium | 50 chars | Brand name highlighting |

### Highlighted Result Structure

```python
{
    "id": 123,
    "name": "Samsung Galaxy S21",
    "description": "Latest smartphone...",
    "highlighted": {
        "name": "<em>Samsung</em> Galaxy S21",
        "description": "Latest <em>smartphone</em>...",
        "has_highlights": True,
        "highlight_count": 2
    }
}
```

### Highlighting Examples

| Query | Text | Highlighted |
|-------|------|-------------|
| "iphone" | "Apple iPhone 13 Pro" | "Apple <em>iPhone</em> 13 Pro" |
| "samsung phone" | "Samsung Galaxy smartphone" | "<em>Samsung</em> Galaxy smart<em>phone</em>" |
| "laptop dell" | "Dell Inspiron laptop computer" | "<em>Dell</em> Inspiron <em>laptop</em> computer" |

### Custom Highlight Tags

| Style | Pre-tag | Post-tag | CSS Class |
|-------|---------|----------|-----------|
| Emphasis | `<em>` | `</em>` | highlight-em |
| Strong | `<strong>` | `</strong>` | highlight-strong |
| Custom | `<mark class="highlight">` | `</mark>` | highlight |

### Snippet Extraction

| Field | Strategy |
|-------|----------|
| Short fields | Highlight entire field |
| Long descriptions | Extract snippet around highlights |
| Multiple highlights | Show best matching snippets |
| No highlights | Show beginning of field |

### Error Handling

| Error Type | Handling |
|------------|----------|
| Missing _formatted | Use original text |
| Invalid highlight tags | Strip malformed tags |
| Encoding issues | Handle UTF-8 properly |
| Long highlights | Truncate with ellipsis |

### Performance Considerations

| Aspect | Optimization |
|--------|-------------|
| Highlight processing | Process in background if possible |
| Large results | Limit highlighting to top results |
| Complex queries | Cache highlighted results |
| Memory usage | Stream process large result sets |

### Security Considerations

| Risk | Mitigation |
|------|------------|
| XSS injection | Sanitize and validate highlight tags |
| HTML injection | Use safe HTML tags only |
| Script injection | Strip script tags from highlights |

### Integration Points

| Component | Integration |
|-----------|-------------|
| SearchService | Add highlighting to search method |
| SearchResults | Include highlighted fields |
| Frontend | Render highlights with proper CSS |
| API Response | Include highlighting metadata |

### Expected Outcome
- Search results with properly highlighted matching terms
- Support for multiple highlightable fields
- Customizable highlight tags and styling
- Integration with existing search infrastructure

### Verification Checklist
- [ ] MeiliSearch highlighting configuration enabled
- [ ] SearchService updated to request highlights
- [ ] Highlight processing methods implemented
- [ ] Highlighted results included in search response
- [ ] Multiple fields highlighting working
- [ ] Error handling for missing highlights
- [ ] Security validation for highlight tags
- [ ] Performance optimization for large results

---

## Task 52: Verify Search Features

### Overview
Conduct comprehensive testing and verification of all implemented search features to ensure proper functionality, performance, and integration. This task validates SearchService, synonym management, filtering capabilities, faceted search, and highlighting features work correctly together in the LankaCommerce Cloud ERP system.

### Dependencies
- Task 51: Create Highlighting completed
- All previous Group-C tasks implemented
- Test data available for verification

### Instructions

1. **Prepare test environment and data**
   - Set up test database with sample products
   - Create diverse product data (categories, brands, prices, stock)
   - Add test synonyms for common search terms
   - Ensure MeiliSearch index is populated with test data

2. **Verify SearchService functionality**
   - Test basic search queries with various terms
   - Validate search results accuracy and relevance
   - Test pagination with different limit and offset values
   - Verify search performance meets requirements

3. **Test typo tolerance and fuzzy matching**
   - Test common misspellings ("iphne" → "iphone")
   - Verify minWordSizeForTypos settings work correctly
   - Test edge cases with very short and long words
   - Validate typo tolerance doesn't affect exact matches

4. **Verify synonym functionality**
   - Test synonym expansion in search queries
   - Add new synonyms using SynonymService
   - Verify sync_synonyms updates MeiliSearch correctly
   - Test synonym deactivation and reactivation

5. **Test all filter methods**
   - Verify category filtering with valid category IDs
   - Test brand filtering with various brand names
   - Validate price range filtering with different bounds
   - Test stock filtering for in-stock and out-of-stock items

6. **Validate faceted search features**
   - Test facet generation for categories, brands, prices
   - Verify facet counts match actual search results
   - Test facet filtering and result updates
   - Validate performance with large result sets

### Test Categories Overview

| Category | Features to Test |
|----------|------------------|
| Basic Search | Query processing, results, pagination |
| Typo Tolerance | Fuzzy matching, word size thresholds |
| Synonyms | Expansion, management, synchronization |
| Filters | Category, brand, price, stock filtering |
| Facets | Count generation, filtering integration |
| Highlighting | Match marking, multiple fields |

### SearchService Verification Tests

| Test Case | Expected Behavior |
|-----------|-------------------|
| Simple query | Returns relevant products |
| Empty query | Returns all products or error |
| Long query | Handles complex search terms |
| Special characters | Processes safely without errors |
| Pagination | Correct limit/offset handling |

### Typo Tolerance Test Cases

| Query | Expected Match | Test Purpose |
|-------|----------------|-------------|
| "iphne" | "iphone" | Single typo correction |
| "samung" | "samsung" | Single typo in brand |
| "lapto" | "laptop" | Short word no correction |
| "smartfon" | "smartphone" | Two typos in long word |

### Synonym Test Scenarios

| Primary Word | Synonyms | Test Query | Expected Results |
|-------------|----------|------------|------------------|
| mobile | ["phone", "smartphone"] | "phone" | Include mobile products |
| laptop | ["notebook", "computer"] | "notebook" | Include laptop products |
| tv | ["television", "led"] | "television" | Include TV products |

### Filter Verification Matrix

| Filter Type | Test Cases |
|-------------|------------|
| Category | Valid ID, invalid ID, non-existent category |
| Brand | Exact match, case sensitivity, special characters |
| Price | Min only, max only, range, zero prices |
| Stock | In stock, out of stock, minimum stock levels |

### Filter Combination Tests

```python
# Test 1: Category + Brand
category_filter(electronics_id).brand_filter("Apple")

# Test 2: Price + Stock
price_filter(100, 500).stock_filter(True)

# Test 3: All filters combined
category_filter(5).brand_filter("Samsung").price_filter(200, 1000).stock_filter(True)
```

### Faceted Search Verification

| Facet Type | Verification |
|------------|-------------|
| Categories | Count matches filtered results |
| Brands | Top brands appear in correct order |
| Price Ranges | Ranges cover all price points |
| Stock Status | In-stock vs out-of-stock counts |

### Highlighting Verification

| Test Case | Expected Highlight |
|-----------|-------------------|
| Single word | `<em>term</em>` |
| Multiple words | Multiple `<em>` tags |
| Partial matches | Highlight matched portions |
| No matches | Original text unchanged |

### Performance Benchmarks

| Operation | Target Time | Maximum Results |
|-----------|-------------|-----------------|
| Basic search | < 100ms | 1000 products |
| Filtered search | < 200ms | 500 products |
| Faceted search | < 300ms | 100 facets |
| Synonym sync | < 2s | 500 synonyms |

### Error Handling Verification

| Error Scenario | Expected Response |
|----------------|-------------------|
| MeiliSearch down | Graceful error message |
| Invalid filter | ValidationError |
| Timeout | Partial results or timeout error |
| Database error | Logged error, fallback response |

### Integration Testing Checklist

| Component | Integration Test |
|-----------|-----------------|
| SearchService + Filters | Combined functionality works |
| Synonyms + Search | Synonym expansion in results |
| Facets + Filters | Facet counts update with filters |
| Highlighting + Search | Highlights appear in results |

### Verification Method Implementation

```python
def verify_search_features():
    """Comprehensive search features verification."""
    
    # Test basic search
    test_basic_search()
    
    # Test typo tolerance
    test_typo_tolerance()
    
    # Test synonyms
    test_synonym_functionality()
    
    # Test filters
    test_filter_methods()
    
    # Test faceted search
    test_faceted_search()
    
    # Test highlighting
    test_highlighting()
    
    # Performance tests
    test_performance_benchmarks()
    
    return verification_report
```

### Expected Verification Results

| Feature | Success Criteria |
|---------|------------------|
| SearchService | All basic operations work correctly |
| Typo Tolerance | Fuzzy matching improves search accuracy |
| Synonyms | Search results include synonym matches |
| Filters | All filter types work individually and combined |
| Facets | Accurate counts and proper filtering |
| Highlighting | Query terms properly highlighted |

### Verification Report Structure

```python
{
    "overall_status": "PASSED",
    "test_results": {
        "search_service": "PASSED",
        "typo_tolerance": "PASSED",
        "synonyms": "PASSED",
        "filters": "PASSED",
        "facets": "PASSED",
        "highlighting": "PASSED"
    },
    "performance_metrics": {...},
    "errors_found": [],
    "recommendations": [...]
}
```

### Documentation and Handoff

| Deliverable | Description |
|-------------|-------------|
| Test Report | Comprehensive verification results |
| Performance Metrics | Search operation benchmarks |
| Configuration Guide | Settings and deployment notes |
| Troubleshooting Guide | Common issues and solutions |

### Expected Outcome
- All search features verified to work correctly
- Performance benchmarks meet requirements
- Integration between components functions properly
- Comprehensive test documentation completed

### Verification Checklist
- [ ] Test environment set up with sample data
- [ ] Basic search functionality verified
- [ ] Typo tolerance working with correct thresholds
- [ ] Synonym management and synchronization working
- [ ] All filter methods tested individually
- [ ] Filter combinations working correctly
- [ ] Faceted search generating accurate counts
- [ ] Highlighting properly marking search terms
- [ ] Performance benchmarks achieved
- [ ] Error handling working as expected
- [ ] Integration testing completed
- [ ] Verification report generated

---

## Summary

This document implemented advanced search features including dynamic filter construction, faceted search capabilities, and search result highlighting for LankaCommerce Cloud ERP, completing the comprehensive search infrastructure with user-friendly filtering and visual feedback mechanisms.

### Completed Tasks
1. ✓ Created FilterBuilder class for dynamic query construction
2. ✓ Implemented category_filter method for product categorization
3. ✓ Created brand_filter method for brand-based filtering
4. ✓ Implemented price_filter method with range support
5. ✓ Created stock_filter method for inventory-based filtering
6. ✓ Implemented faceted search for result categorization and counts
7. ✓ Created highlighting for search term visual feedback
8. ✓ Conducted comprehensive verification of all search features

### Final Deliverables
- **FilterBuilder Service**: Dynamic filter query construction with validation
- **Faceted Search**: Category, brand, price, and stock facets with accurate counts
- **Search Highlighting**: Visual feedback for matching terms in results
- **Comprehensive Testing**: All search features verified and performance benchmarks met

### Next Steps
The search features are now complete and ready for integration with the frontend interface. Proceed to the next group in SubPhase-04 for ranking and boosting capabilities, or continue with frontend search interface development in the appropriate phase.