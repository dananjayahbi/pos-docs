# Tasks 39-45: Search Service & Methods

> **Phase:** 05 - ERP Core Modules Part 2  
> **SubPhase:** 01 - POS Terminal Core  
> **Group:** C - Product Search & Barcode  
> **Document:** 01 of 03  
> **Tasks Covered:** 39, 40, 41, 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-46-50_Stock-Price-Quick-Buttons.md](02_Tasks-46-50_Stock-Price-Quick-Buttons.md)
- **← Previous Group:** [../Group-B_Cart-Line-Item-Management/](../Group-B_Cart-Line-Item-Management/)

---

## Document Overview

This document covers the creation of the product search submodule and ProductSearchService with various search methods. These components enable cashiers to quickly find products using barcodes, SKU codes, or product names during checkout.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 39 | Create search submodule | Low | 10 min |
| 40 | Create ProductSearchService | Medium | 25 min |
| 41 | Implement barcode_search | Medium | 20 min |
| 42 | Implement sku_search | Medium | 20 min |
| 43 | Implement name_search | Medium | 25 min |
| 44 | Implement combined_search | High | 30 min |
| 45 | Add variant resolution | Medium | 20 min |

---

## Task 39: Create Search Submodule

### Overview
Create the dedicated search package within the POS app to house all product search-related functionality.

### Dependencies
- Phase 04 Product models must exist
- POS app structure must be established

### Instructions

1. **Create search package directory**
   - Navigate to `apps/pos/` directory
   - Create new directory named `search`
   - Create `__init__.py` in the search directory

2. **Create services subdirectory**
   - Inside `search/`, create `services/` directory
   - Create `services/__init__.py` file
   - This will house the ProductSearchService

3. **Create models subdirectory**
   - Inside `search/`, create `models/` directory
   - Create `models/__init__.py` file
   - This will house QuickButton and related models (later tasks)

4. **Create validators module**
   - Inside `search/`, create `validators.py` file
   - This will house barcode format validators (later tasks)

5. **Update search package init**
   - Edit `search/__init__.py`
   - Add docstring describing the search package purpose
   - Add default namespace indicating this is the search module

### Expected Directory Structure

```
apps/pos/
├── search/
│   ├── __init__.py              # Package init with docstring
│   ├── services/
│   │   └── __init__.py          # Services package init
│   ├── models/
│   │   └── __init__.py          # Models package init
│   └── validators.py            # Barcode validators (empty for now)
```

### Package Purpose Documentation

The search package should document:
- Purpose: Product search functionality for POS terminals
- Components: Search services, quick button models, barcode validators
- Usage: Called by POS terminal views/APIs during product lookup
- Scope: Barcode, SKU, name, combined search operations

### Verification Checklist
- [ ] `search/` directory exists under `apps/pos/`
- [ ] `search/__init__.py` exists with docstring
- [ ] `search/services/` directory exists
- [ ] `search/services/__init__.py` exists
- [ ] `search/models/` directory exists
- [ ] `search/models/__init__.py` exists
- [ ] `search/validators.py` file exists
- [ ] Directory structure matches expected layout

---

## Task 40: Create ProductSearchService

### Overview
Create the ProductSearchService class that centralizes all product search logic. This service will be used by POS terminals to search for products during checkout.

### Dependencies
- Task 39: Search submodule structure
- Product models from Phase 04
- Tenant-aware context

### Instructions

1. **Create product_search.py file**
   - Navigate to `apps/pos/search/services/`
   - Create file named `product_search.py`

2. **Import required dependencies**
   - Import Django Q objects for complex queries
   - Import Product model from inventory app
   - Import ProductVariant model (if exists)
   - Import tenant-aware context utilities
   - Import typing hints (List, Optional, Dict)

3. **Define ProductSearchService class**
   - Create class named `ProductSearchService`
   - Add class-level docstring explaining service purpose
   - Design as a service class (not instantiated, class methods)

4. **Add tenant context management**
   - Define private class method `_get_tenant_products()`
   - Return queryset filtered to current tenant schema
   - Apply default product filters (active, not deleted)
   - Include related fields for optimization (select_related/prefetch_related)

5. **Add base query optimization**
   - Apply select_related for category, unit, brand
   - Apply prefetch_related for variants, prices
   - Ensure tax information is loaded
   - Optimize for read performance

6. **Add result formatting method**
   - Define private method `_format_product_result()`
   - Accept product instance as parameter
   - Return dictionary with essential product information
   - Include: id, name, sku, barcode, price, stock, category

7. **Add deduplication method**
   - Define private method `_deduplicate_results()`
   - Accept list of products as parameter
   - Remove duplicates based on product ID
   - Maintain order of first occurrence

8. **Update services init**
   - Edit `services/__init__.py`
   - Import ProductSearchService
   - Add to `__all__` export list

### Service Architecture Diagram

```
┌─────────────────────────────────────────────────┐
│         ProductSearchService                     │
├─────────────────────────────────────────────────┤
│ Class Methods:                                   │
│  + barcode_search(barcode: str)                 │
│  + sku_search(sku: str, exact: bool)            │
│  + name_search(query: str)                      │
│  + combined_search(query: str)                  │
│                                                  │
│ Private Methods:                                 │
│  - _get_tenant_products()                       │
│  - _format_product_result(product)              │
│  - _deduplicate_results(products)               │
└─────────────────────────────────────────────────┘
         │
         ├─► Queries Product Model
         ├─► Applies Tenant Context
         └─► Returns Formatted Results
```

### Service Method Signature

| Method | Parameters | Return Type |
|--------|------------|-------------|
| `_get_tenant_products()` | None | QuerySet[Product] |
| `_format_product_result()` | product: Product | Dict[str, Any] |
| `_deduplicate_results()` | products: List[Product] | List[Product] |

### Product Result Format

The formatted result dictionary should include:
- **id**: Product primary key (UUID or int)
- **name**: Product display name
- **sku**: Stock keeping unit code
- **barcode**: Primary barcode
- **price**: Current selling price (Decimal)
- **stock_quantity**: Available stock (Decimal)
- **category**: Category name (string)
- **unit**: Unit of measure (string)
- **image_url**: Product image URL (optional)
- **is_variant**: Boolean indicating if product has variants
- **tax_rate**: Applicable tax rate percentage

### Tenant Context Considerations

- All queries must respect current tenant schema
- Use tenant-aware middleware context
- Never expose products from other tenants
- Apply tenant-specific pricing rules
- Respect tenant-specific product visibility settings

### Performance Optimization

- Use select_related for single foreign keys
- Use prefetch_related for reverse relations
- Apply database indexes on barcode, SKU fields
- Cache frequently searched products
- Limit result sets to reasonable numbers

### Expected Outcome

```python
# Service structure (no actual code, just structure)
class ProductSearchService:
    """
    Centralized service for product search operations in POS.
    
    Provides methods for searching products by:
    - Barcode (exact match)
    - SKU (exact or partial match)
    - Name (fuzzy search)
    - Combined search (all methods)
    """
    
    @classmethod
    def _get_tenant_products(cls):
        """Returns optimized queryset of tenant products."""
        pass
    
    @classmethod
    def _format_product_result(cls, product):
        """Formats product instance to dictionary."""
        pass
    
    @classmethod
    def _deduplicate_results(cls, products):
        """Removes duplicate products from list."""
        pass
```

### Verification Checklist
- [ ] `product_search.py` file created in services directory
- [ ] ProductSearchService class defined
- [ ] Class docstring explains service purpose
- [ ] Tenant context method implemented
- [ ] Query optimization applied (select_related, prefetch_related)
- [ ] Result formatting method exists
- [ ] Deduplication method exists
- [ ] Service exported from services/__init__.py
- [ ] All imports are correct and available

---

## Task 41: Implement barcode_search

### Overview
Implement the barcode_search method that performs exact barcode lookup. This is the highest priority search method since barcode scans are expected to return a single, exact product match.

### Dependencies
- Task 40: ProductSearchService class
- Product model with barcode field
- Product variant support (if variants have separate barcodes)

### Instructions

1. **Define barcode_search class method**
   - Add `@classmethod` decorator
   - Method name: `barcode_search`
   - Parameters: `cls, barcode: str`
   - Return type: `Optional[Dict[str, Any]]`

2. **Add input validation**
   - Check if barcode parameter is provided
   - Trim whitespace from barcode
   - Return None if barcode is empty or None

3. **Query product by barcode**
   - Call `_get_tenant_products()` to get base queryset
   - Filter by barcode field (exact match)
   - Use `.filter(barcode=barcode)`
   - Apply `.first()` to get single result

4. **Handle product not found**
   - If no product found, return None
   - Log search miss for analytics (optional)

5. **Format and return result**
   - If product found, call `_format_product_result(product)`
   - Return formatted dictionary
   - Include barcode_matched=True flag

6. **Add method docstring**
   - Describe purpose: exact barcode lookup
   - Document parameter: barcode string
   - Document return: product dict or None
   - Note: Returns first match only

### Search Flow Diagram

```
┌────────────────┐
│  Scan Barcode  │
└────────┬───────┘
         │
         ▼
┌─────────────────────┐
│ barcode_search(...)  │
└─────────┬───────────┘
          │
          ├─► Validate Input
          │    ├─ Trim whitespace
          │    └─ Check not empty
          │
          ├─► Query Database
          │    ├─ Filter by barcode
          │    ├─ Apply tenant filter
          │    └─ Get first match
          │
          └─► Return Result
               ├─ None if not found
               └─ Product dict if found
```

### Barcode Matching Logic

| Input | Matching Strategy | Result |
|-------|-------------------|--------|
| "1234567890123" | Exact match on barcode field | Single product |
| "ABC-DEF-GHI" | Exact match (alphanumeric) | Single product |
| "" (empty) | No query, return None | None |
| "9999999" (not found) | No match | None |

### Method Signature

```python
@classmethod
def barcode_search(cls, barcode: str) -> Optional[Dict[str, Any]]:
    """
    Search for product by exact barcode match.
    
    Args:
        barcode: The barcode string to search for
        
    Returns:
        Product dictionary if found, None otherwise
        
    Example:
        product = ProductSearchService.barcode_search("1234567890123")
        if product:
            # Add to cart
    """
```

### Return Format Example

```python
{
    'id': 'uuid-or-int',
    'name': 'Coca-Cola 500ml',
    'sku': 'BEV-COKE-500',
    'barcode': '1234567890123',
    'price': Decimal('150.00'),
    'stock_quantity': Decimal('100'),
    'category': 'Beverages',
    'unit': 'bottle',
    'image_url': '/media/products/coke.jpg',
    'is_variant': False,
    'tax_rate': Decimal('8.00'),
    'barcode_matched': True
}
```

### Edge Cases to Handle

1. **Multiple Products with Same Barcode**
   - Should not happen in properly configured system
   - Return first match found
   - Log warning for data integrity issue

2. **Barcode with Leading/Trailing Spaces**
   - Trim input before searching
   - Prevent match failures due to whitespace

3. **Case Sensitivity**
   - Barcodes are typically case-insensitive
   - Use case-insensitive matching if needed

4. **Null/None Barcode**
   - Return None immediately
   - Don't query database

### Performance Considerations

- Ensure database index on barcode field
- Barcode search should be fastest search method
- Typical search time: < 10ms
- Cache frequent barcode lookups

### Verification Checklist
- [ ] barcode_search method added to ProductSearchService
- [ ] Method accepts barcode string parameter
- [ ] Input validation implemented (trim, empty check)
- [ ] Queries tenant-filtered products
- [ ] Returns None if not found
- [ ] Returns formatted product dict if found
- [ ] Method docstring is complete
- [ ] Handles empty/None barcode gracefully

---

## Task 42: Implement sku_search

### Overview
Implement the sku_search method that supports both exact and partial SKU matching. SKU search is used when cashiers manually type product codes.

### Dependencies
- Task 40: ProductSearchService class
- Product model with SKU field

### Instructions

1. **Define sku_search class method**
   - Add `@classmethod` decorator
   - Method name: `sku_search`
   - Parameters: `cls, sku: str, exact: bool = True`
   - Return type: `List[Dict[str, Any]]`

2. **Add input validation**
   - Check if sku parameter is provided
   - Trim whitespace from sku
   - Return empty list if sku is empty or None

3. **Handle exact search mode**
   - If exact=True parameter:
     - Filter by exact SKU match (case-insensitive)
     - Use `.filter(sku__iexact=sku)`
     - Return first match as single-item list

4. **Handle partial search mode**
   - If exact=False parameter:
     - Filter by SKU containing query (case-insensitive)
     - Use `.filter(sku__icontains=sku)`
     - Return all matches (limit to reasonable number)

5. **Order results appropriately**
   - For partial search, order by:
     - Exact matches first
     - Then by SKU alphabetically
     - Then by product name

6. **Format and return results**
   - Convert queryset to list
   - Apply `_format_product_result()` to each product
   - Add sku_matched=True flag
   - Return list of formatted products

7. **Add method docstring**
   - Describe exact vs partial search modes
   - Document parameters and return type
   - Provide usage examples

### Search Mode Comparison

```
Exact Mode (exact=True):
┌──────────────┐
│ Input: "ABC" │
└──────┬───────┘
       │
       ▼
  SKU = "ABC"  ────────► Single Result
  SKU = "ABC-123" ────► No Match
  SKU = "XYZ-ABC" ────► No Match

Partial Mode (exact=False):
┌──────────────┐
│ Input: "ABC" │
└──────┬───────┘
       │
       ▼
  SKU = "ABC" ─────────► Match (priority 1)
  SKU = "ABC-123" ─────► Match (priority 2)
  SKU = "XYZ-ABC-DEF" ─► Match (priority 3)
```

### Method Signature

```python
@classmethod
def sku_search(cls, sku: str, exact: bool = True) -> List[Dict[str, Any]]:
    """
    Search for products by SKU code.
    
    Args:
        sku: The SKU string to search for
        exact: If True, only exact matches. If False, partial matches.
        
    Returns:
        List of product dictionaries (empty list if none found)
        
    Examples:
        # Exact search
        products = ProductSearchService.sku_search("BEV-COKE-500")
        
        # Partial search
        products = ProductSearchService.sku_search("COKE", exact=False)
    """
```

### Search Priority Logic

For partial search results:

1. **Priority 1: Exact Match**
   - SKU exactly equals query (case-insensitive)
   - Example: Query "ABC" matches SKU "ABC"

2. **Priority 2: Starts With**
   - SKU starts with query
   - Example: Query "ABC" matches SKU "ABC-123"

3. **Priority 3: Contains**
   - SKU contains query anywhere
   - Example: Query "ABC" matches SKU "XYZ-ABC-DEF"

### Ordering Diagram

```
Partial Search Results Ordering:

┌─────────────────────────────────┐
│ 1. Exact Matches (SKU = query)  │
├─────────────────────────────────┤
│ 2. Starts With (SKU^query)      │
├─────────────────────────────────┤
│ 3. Contains (SKU~query)         │
└─────────────────────────────────┘

Within each group: Sort alphabetically by SKU
```

### Return Format Examples

**Exact Search (single result):**
```python
[
    {
        'id': 'uuid-1',
        'name': 'Coca-Cola 500ml',
        'sku': 'BEV-COKE-500',
        'barcode': '1234567890123',
        'price': Decimal('150.00'),
        'sku_matched': True,
        # ... other fields
    }
]
```

**Partial Search (multiple results):**
```python
[
    {
        'id': 'uuid-1',
        'sku': 'COKE',  # Exact match first
        'name': 'Coca-Cola Original',
        # ...
    },
    {
        'id': 'uuid-2',
        'sku': 'COKE-500',  # Starts with query
        'name': 'Coca-Cola 500ml',
        # ...
    },
    {
        'id': 'uuid-3',
        'sku': 'BEV-COKE-1L',  # Contains query
        'name': 'Coca-Cola 1 Liter',
        # ...
    }
]
```

### Result Limiting

- For partial search, limit results to prevent overload
- Default limit: 50 products
- Configurable via settings: `POS_SKU_SEARCH_LIMIT`
- Show most relevant results first

### Use Cases

| Scenario | Search Type | Example |
|----------|-------------|---------|
| Cashier types exact SKU | Exact | "BEV-COKE-500" |
| Cashier types partial code | Partial | "COKE" |
| Quick lookup by category prefix | Partial | "BEV" (all beverages) |
| Autocomplete suggestions | Partial | "CO" |

### Performance Considerations

- Index SKU field for fast lookups
- Exact search: very fast (indexed equality)
- Partial search: moderate (LIKE query)
- Consider full-text index for large catalogs

### Verification Checklist
- [ ] sku_search method added to ProductSearchService
- [ ] Method accepts sku and exact parameters
- [ ] Exact mode returns single result (or empty)
- [ ] Partial mode returns multiple results
- [ ] Results ordered by relevance
- [ ] Input validation implemented
- [ ] Method docstring is complete
- [ ] Returns empty list when no matches

---

## Task 43: Implement name_search

### Overview
Implement the name_search method using fuzzy matching to search products by name. This allows cashiers to find products when they don't know the exact barcode or SKU.

### Dependencies
- Task 40: ProductSearchService class
- PostgreSQL trigram extension (pg_trgm) for similarity search
- Product model with name field

### Instructions

1. **Enable trigram extension**
   - Ensure PostgreSQL pg_trgm extension is enabled
   - Create migration to add extension if not exists
   - This enables similarity() and word_similarity() functions

2. **Define name_search class method**
   - Add `@classmethod` decorator
   - Method name: `name_search`
   - Parameters: `cls, query: str, limit: int = 20`
   - Return type: `List[Dict[str, Any]]`

3. **Add input validation**
   - Check if query parameter is provided
   - Trim whitespace from query
   - Return empty list if query is empty or None
   - Require minimum query length (e.g., 2 characters)

4. **Implement exact name match first**
   - Check for exact name match (case-insensitive)
   - Use `.filter(name__iexact=query)`
   - If exact match found, return as first result

5. **Implement fuzzy search**
   - Use Django's TrigramSimilarity or SearchVector
   - Filter products where name contains query words
   - Use `.filter(name__icontains=query)` as base
   - Apply similarity scoring for ranking

6. **Add relevance scoring**
   - Calculate similarity score for each result
   - Score based on:
     - Position of match (start of name ranks higher)
     - Word boundary matches
     - Overall similarity percentage

7. **Order results by relevance**
   - Sort by similarity score (descending)
   - Then by name alphabetically
   - Apply limit parameter to results

8. **Format and return results**
   - Convert queryset to list (apply limit)
   - Apply `_format_product_result()` to each
   - Add name_matched=True flag
   - Include similarity_score in result

9. **Add method docstring**
   - Describe fuzzy search behavior
   - Document parameters and return type
   - Provide usage examples

### Fuzzy Search Flow

```
┌─────────────────┐
│ Input: "cola"   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ Step 1: Exact Match Check   │
│ "cola" = name?              │
└────────┬────────────────────┘
         │ No exact match
         ▼
┌─────────────────────────────┐
│ Step 2: Contains Filter     │
│ name ICONTAINS "cola"       │
└────────┬────────────────────┘
         │ Found multiple
         ▼
┌─────────────────────────────┐
│ Step 3: Calculate Similarity│
│ - "Coca-Cola" → 0.8         │
│ - "Pepsi Cola" → 0.6        │
│ - "Cola Flavored Candy" → 0.4│
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Step 4: Order by Score      │
│ Return top N results        │
└─────────────────────────────┘
```

### Similarity Scoring Factors

| Factor | Weight | Example |
|--------|--------|---------|
| Exact match | 1.0 | "Cola" == "Cola" |
| Starts with query | 0.9 | "Cola Drink" starts with "Cola" |
| Word boundary match | 0.8 | "Coca Cola" contains word "Cola" |
| Contains query | 0.6 | "Chocolate Cola" contains "Cola" |
| Trigram similarity | 0.4 | "Kola" similar to "Cola" |

### Method Signature

```python
@classmethod
def name_search(cls, query: str, limit: int = 20) -> List[Dict[str, Any]]:
    """
    Search for products by name using fuzzy matching.
    
    Uses PostgreSQL trigram similarity for fuzzy search.
    Returns results ordered by relevance.
    
    Args:
        query: The search term (product name or part of name)
        limit: Maximum number of results (default 20)
        
    Returns:
        List of product dictionaries ordered by relevance
        
    Examples:
        products = ProductSearchService.name_search("coca")
        # Returns Coca-Cola, Coca-Cola Zero, etc.
    """
```

### Search Examples

| Query | Matches | Order |
|-------|---------|-------|
| "coca" | "Coca-Cola", "Coca-Cola Zero", "Coca Flavored" | Exact → Starts → Contains |
| "milk" | "Milk Full Cream", "Almond Milk", "Chocolate Milk" | Exact → Starts → Contains |
| "bred" | "Bread", "Bred Loaf" (typo tolerance) | Similarity score |
| "choc" | "Chocolate Bar", "Chocolate Milk", "Choc Chip Cookie" | Relevance |

### Minimum Query Length

- Require at least 2 characters for search
- Prevents accidental single-character searches
- Reduces database load
- Return empty list if query too short

```
Query Length Check:

len(query) < 2 ──► Return []
len(query) >= 2 ──► Proceed with search
```

### Result Limiting

- Default limit: 20 results
- Configurable: `POS_NAME_SEARCH_LIMIT` setting
- Shows most relevant results
- Prevents overwhelming UI with too many results

### Return Format Example

```python
[
    {
        'id': 'uuid-1',
        'name': 'Coca-Cola 500ml',
        'sku': 'BEV-COKE-500',
        'barcode': '1234567890123',
        'price': Decimal('150.00'),
        'name_matched': True,
        'similarity_score': 0.95,
        # ... other fields
    },
    {
        'id': 'uuid-2',
        'name': 'Coca-Cola Zero 500ml',
        'sku': 'BEV-COKE-ZERO-500',
        'similarity_score': 0.88,
        # ...
    }
]
```

### PostgreSQL Trigram Setup

Ensure extension is available:
```sql
CREATE EXTENSION IF NOT EXISTS pg_trgm;
```

Create trigram index for performance:
```sql
CREATE INDEX product_name_trgm_idx 
ON products 
USING gin (name gin_trgm_ops);
```

### Alternative Search Strategies

If trigram not available:

1. **Simple ICONTAINS**
   - Use `.filter(name__icontains=query)`
   - Order by name
   - Good for basic needs

2. **SearchVector**
   - Use Django's full-text search
   - Better for multiple fields
   - Requires search configuration

3. **Levenshtein Distance**
   - Use for typo tolerance
   - More computation intensive
   - Good for exact matching with errors

### Use Cases

| Scenario | Query | Expected Results |
|----------|-------|------------------|
| Can't remember exact name | "coke" | All Coca-Cola products |
| Typing quickly | "choclat" | Chocolate products (typo tolerance) |
| Category search | "drink" | All beverage items |
| Brand search | "nestle" | All Nestle products |

### Performance Considerations

- Trigram searches are slower than exact matches
- Index improves performance significantly
- Limit results to reasonable number
- Consider caching popular searches

### Verification Checklist
- [ ] name_search method added to ProductSearchService
- [ ] Method accepts query and limit parameters
- [ ] Minimum query length validation (2+ chars)
- [ ] Fuzzy matching implemented (trigram or alternative)
- [ ] Results ordered by relevance/similarity
- [ ] Result limiting applied
- [ ] Method docstring is complete
- [ ] Returns empty list for invalid queries
- [ ] Similarity score included in results

---

## Task 44: Implement combined_search

### Overview
Implement the combined_search method that intelligently searches across barcode, SKU, and name in priority order. This is the primary search method called by POS terminal UI.

### Dependencies
- Task 41: barcode_search method
- Task 42: sku_search method
- Task 43: name_search method

### Instructions

1. **Define combined_search class method**
   - Add `@classmethod` decorator
   - Method name: `combined_search`
   - Parameters: `cls, query: str, limit: int = 20`
   - Return type: `List[Dict[str, Any]]`

2. **Add input validation**
   - Check if query parameter is provided
   - Trim whitespace from query
   - Return empty list if query is empty or None

3. **Implement priority search cascade**
   - **Step 1**: Try barcode_search first
   - If exact barcode match found, return immediately
   - Single result as list

4. **Try exact SKU search**
   - **Step 2**: Call sku_search with exact=True
   - If exact SKU match found, return immediately
   - Single result as list

5. **Combine fuzzy searches**
   - **Step 3**: Call name_search with query
   - **Step 4**: Call sku_search with exact=False
   - Combine results from both

6. **Deduplicate combined results**
   - Use `_deduplicate_results()` helper
   - Remove duplicate products
   - Maintain order (name matches first, then SKU)

7. **Apply result limiting**
   - Limit combined results to specified limit
   - Default limit: 20 products
   - Take top N by relevance

8. **Add search metadata**
   - Add search_method field to each result
   - Indicates which method found the product
   - Values: 'barcode', 'sku_exact', 'sku_partial', 'name'

9. **Add method docstring**
   - Describe priority search logic
   - Document cascading behavior
   - Provide usage examples

### Combined Search Flow Diagram

```
┌──────────────────┐
│  User Query: X   │
└────────┬─────────┘
         │
         ▼
┌──────────────────────┐
│ Try Barcode Search   │  ◄─── Priority 1 (Highest)
└────────┬─────────────┘
         │
         ├─► Found? ──Yes──► Return [product]
         │
         No
         │
         ▼
┌──────────────────────┐
│ Try Exact SKU Search │  ◄─── Priority 2
└────────┬─────────────┘
         │
         ├─► Found? ──Yes──► Return [product]
         │
         No
         │
         ▼
┌──────────────────────┐
│ Parallel Search:     │  ◄─── Priority 3
│  - Name Search       │
│  - Partial SKU       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Combine & Dedupe     │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Return Top N Results │
└──────────────────────┘
```

### Priority Logic Explanation

**Why this priority order?**

1. **Barcode First** - Most accurate, typically from scanner
2. **Exact SKU Second** - Manual entry of known code
3. **Fuzzy Searches Last** - When user doesn't know exact identifier

**Early Return Optimization:**
- Barcode/exact SKU matches return immediately
- Avoids unnecessary fuzzy searches
- Improves response time for exact matches

### Method Signature

```python
@classmethod
def combined_search(cls, query: str, limit: int = 20) -> List[Dict[str, Any]]:
    """
    Combined product search across barcode, SKU, and name.
    
    Search priority:
    1. Exact barcode match (returns immediately if found)
    2. Exact SKU match (returns immediately if found)
    3. Name fuzzy search + Partial SKU search (combined and deduplicated)
    
    Args:
        query: Search query (can be barcode, SKU, or product name)
        limit: Maximum number of results for fuzzy search (default 20)
        
    Returns:
        List of product dictionaries ordered by search priority
        
    Examples:
        # Barcode scan
        products = ProductSearchService.combined_search("1234567890123")
        # Returns single product immediately
        
        # SKU entry
        products = ProductSearchService.combined_search("BEV-COKE-500")
        # Returns exact SKU match immediately
        
        # Name search
        products = ProductSearchService.combined_search("coca")
        # Returns multiple matching products
    """
```

### Search Decision Tree

```
Input Query
    │
    ├─► Is Numeric & 8-13 digits?
    │       │
    │       Yes ──► Likely Barcode
    │       │        ├─► Try barcode_search
    │       │        └─► If found, return
    │       │
    │       No ──► Continue
    │
    ├─► Matches SKU Pattern?
    │       │
    │       Yes ──► Likely SKU
    │       │        ├─► Try sku_search (exact)
    │       │        └─► If found, return
    │       │
    │       No ──► Continue
    │
    └─► Default to Fuzzy
            │
            ├─► name_search
            ├─► sku_search (partial)
            └─► Return combined
```

### Deduplication Strategy

When combining name and partial SKU results:

```
Name Results:        SKU Results:
  Product A            Product A  ◄─── Duplicate
  Product B            Product C
  Product D            Product D  ◄─── Duplicate

After Deduplication:
  Product A (from name)
  Product B (from name)
  Product D (from name)
  Product C (from SKU)
```

Keep first occurrence, prefer name search results over SKU.

### Search Metadata

Add metadata to help UI understand result source:

```python
{
    'id': 'uuid-1',
    'name': 'Coca-Cola 500ml',
    'search_method': 'barcode',  # How it was found
    'match_quality': 'exact',     # exact, partial, fuzzy
    # ... other product fields
}
```

| search_method | Description |
|---------------|-------------|
| 'barcode' | Found via barcode search |
| 'sku_exact' | Found via exact SKU match |
| 'sku_partial' | Found via partial SKU match |
| 'name' | Found via name fuzzy search |

### Return Format Examples

**Barcode Match (immediate return):**
```python
[
    {
        'id': 'uuid-1',
        'name': 'Coca-Cola 500ml',
        'barcode': '1234567890123',
        'search_method': 'barcode',
        'match_quality': 'exact',
        # ... other fields
    }
]
```

**Fuzzy Search Results:**
```python
[
    # Name matches first
    {
        'id': 'uuid-1',
        'name': 'Coca-Cola Original',
        'search_method': 'name',
        'match_quality': 'fuzzy',
        # ...
    },
    {
        'id': 'uuid-2',
        'name': 'Coca-Cola Zero',
        'search_method': 'name',
        # ...
    },
    # Then SKU partial matches
    {
        'id': 'uuid-3',
        'name': 'Pepsi Cola',
        'sku': 'BEV-COLA-500',
        'search_method': 'sku_partial',
        # ...
    }
]
```

### Performance Optimization

- Early returns prevent unnecessary searches
- Barcode/exact SKU searches are fastest
- Fuzzy searches only when needed
- Deduplication is efficient (O(n))
- Result limiting prevents large result sets

### Use Case Examples

| Query Type | Input | Search Path | Result Count |
|------------|-------|-------------|--------------|
| Barcode scan | "1234567890123" | Barcode → Return | 1 |
| SKU entry | "BEV-COKE-500" | SKU exact → Return | 1 |
| Partial SKU | "COKE" | SKU exact (fail) → Fuzzy | Multiple |
| Product name | "coca cola" | Barcode (fail) → SKU (fail) → Fuzzy | Multiple |
| Ambiguous | "123" | All searches, combine | Multiple |

### Error Handling

- Invalid query: Return empty list
- Database error: Log and return empty list
- Timeout: Return partial results if any
- No matches: Return empty list (not error)

### Verification Checklist
- [ ] combined_search method added to ProductSearchService
- [ ] Method accepts query and limit parameters
- [ ] Barcode search tried first (priority 1)
- [ ] Exact SKU search tried second (priority 2)
- [ ] Name and partial SKU searched if no exact match
- [ ] Results deduplicated correctly
- [ ] Result limiting applied
- [ ] Search metadata included in results
- [ ] Method docstring is complete
- [ ] Early returns work correctly for exact matches

---

## Task 45: Add Variant Resolution

### Overview
Enhance search methods to properly resolve product variants when a barcode matches a specific variant rather than the parent product.

### Dependencies
- Tasks 41-44: Search methods implemented
- Product and ProductVariant models
- Variant barcode support

### Instructions

1. **Understand variant structure**
   - Parent product: Base product (e.g., "T-Shirt")
   - Variants: Variations (e.g., "T-Shirt - Red - Large")
   - Each variant can have unique barcode
   - Variants inherit from parent but have own price/stock

2. **Modify barcode_search for variants**
   - Check if barcode matches a variant first
   - Query ProductVariant model by barcode
   - If variant found, return variant information
   - Include parent product context

3. **Add variant query method**
   - Create private method `_search_variant_by_barcode()`
   - Query ProductVariant.objects.filter(barcode=...)
   - Return variant if found, None otherwise

4. **Update result formatting for variants**
   - Modify `_format_product_result()` to handle variants
   - Include is_variant=True flag
   - Add variant_attributes (size, color, etc.)
   - Add parent_product_id
   - Add parent_product_name

5. **Add variant resolution to combined_search**
   - When barcode search checks variants
   - Return variant details in results
   - Ensure variant stock and price used (not parent)

6. **Handle variant display in results**
   - Format variant name: "{parent} - {attributes}"
   - Example: "T-Shirt - Red - Large"
   - Include variant image if available
   - Fall back to parent image otherwise

7. **Add variant SKU resolution**
   - Variants can have own SKU
   - Check variant SKU in sku_search
   - Prioritize variant SKU over parent SKU

8. **Update search priority for variants**
   - Barcode → Check variant first, then product
   - SKU → Check variant first, then product
   - Name → Search parent products, include variants

### Variant Resolution Flow

```
┌───────────────────────┐
│ Barcode: 9876543210   │
└──────────┬────────────┘
           │
           ▼
┌────────────────────────┐
│ Check ProductVariant    │
│ by barcode             │
└──────────┬─────────────┘
           │
           ├─► Found Variant?
           │       │
           │      Yes ─────┐
           │               │
           No              │
           │               │
           ▼               ▼
┌────────────────┐  ┌──────────────────┐
│ Check Product  │  │ Return Variant   │
│ by barcode     │  │ + Parent Context │
└────────────────┘  └──────────────────┘
```

### Variant Data Structure

**Parent Product:**
```python
{
    'id': 'product-uuid-1',
    'name': 'T-Shirt',
    'sku': 'CLOTH-TSHIRT',
    'barcode': None,  # Parent may not have barcode
    'has_variants': True,
    'variant_count': 6,
    # Base product info
}
```

**Variant Product:**
```python
{
    'id': 'variant-uuid-1',
    'name': 'T-Shirt - Red - Large',  # Formatted name
    'sku': 'CLOTH-TSHIRT-RED-L',
    'barcode': '9876543210123',
    'is_variant': True,
    'parent_product_id': 'product-uuid-1',
    'parent_product_name': 'T-Shirt',
    'variant_attributes': {
        'color': 'Red',
        'size': 'Large'
    },
    'price': Decimal('500.00'),  # Variant-specific price
    'stock_quantity': Decimal('15'),  # Variant-specific stock
    # Other fields
}
```

### Variant Search Priority

| Search Type | Priority Order |
|-------------|----------------|
| Barcode | 1. Variant barcode<br>2. Product barcode |
| SKU | 1. Variant SKU<br>2. Product SKU |
| Name | 1. Product name<br>2. Include variants in results |

### Method: _search_variant_by_barcode

```python
@classmethod
def _search_variant_by_barcode(cls, barcode: str):
    """
    Search for product variant by barcode.
    
    Args:
        barcode: The barcode to search for
        
    Returns:
        ProductVariant instance if found, None otherwise
    """
```

### Variant Name Formatting

Format variant display name by combining:
1. Parent product name
2. Variant attribute values

**Examples:**
- Parent: "T-Shirt", Attributes: {color: "Red", size: "L"}
  → "T-Shirt - Red - L"
  
- Parent: "Coffee", Attributes: {roast: "Dark", size: "500g"}
  → "Coffee - Dark - 500g"

- Parent: "Phone Case", Attributes: {model: "iPhone 14", color: "Blue"}
  → "Phone Case - iPhone 14 - Blue"

### Variant Result Format

```python
{
    # Variant identification
    'id': 'variant-id',
    'is_variant': True,
    'parent_product_id': 'parent-id',
    
    # Display information
    'name': 'T-Shirt - Red - Large',
    'parent_product_name': 'T-Shirt',
    
    # Variant attributes
    'variant_attributes': {
        'color': 'Red',
        'size': 'Large'
    },
    
    # Variant-specific data
    'sku': 'CLOTH-TSHIRT-RED-L',
    'barcode': '9876543210123',
    'price': Decimal('500.00'),
    'stock_quantity': Decimal('15'),
    
    # Inherited/shared data
    'category': 'Clothing',
    'unit': 'piece',
    'tax_rate': Decimal('8.00'),
    'image_url': '/media/variants/tshirt-red-l.jpg',
    
    # Search metadata
    'search_method': 'barcode',
    'match_quality': 'exact'
}
```

### Use Cases

**Use Case 1: Barcode scan of variant**
- Cashier scans barcode on red large t-shirt
- System finds variant by barcode
- Returns variant with parent context
- Adds variant to cart with correct price/stock

**Use Case 2: Manual search by variant SKU**
- Cashier enters "CLOTH-TSHIRT-RED-L"
- System finds variant by SKU
- Returns variant information
- Shows parent product name for context

**Use Case 3: Name search shows all variants**
- Cashier searches "t-shirt"
- System returns parent product
- Optionally shows variants as separate results
- Each variant listed with attributes

### Variant Stock and Pricing

**Important:** Always use variant-specific data:
- Stock quantity from variant, not parent
- Price from variant, not parent
- Availability based on variant stock
- Tax may be inherited from parent

```
Stock Check:
Parent: has_variants=True ─► Check variant stock
Variant: stock_quantity=15 ─► Use this value

Price Check:
Parent: price=400.00 ─► Don't use
Variant: price=500.00 ─► Use this value
```

### Variant Resolution Edge Cases

1. **Variant without barcode**
   - Can only be found by SKU or name
   - Must select from search results

2. **Multiple variants with same barcode**
   - Should not happen (data integrity issue)
   - Return first match, log warning

3. **Variant of deleted parent**
   - Variant should be inactive
   - Exclude from search results

4. **Out-of-stock variant**
   - Still appears in search results
   - Flagged as unavailable (next task)

### Performance Considerations

- Join variant and parent in single query
- Use select_related to avoid N+1 queries
- Index variant barcode and SKU fields
- Cache variant attribute lookups

### Verification Checklist
- [ ] _search_variant_by_barcode method created
- [ ] barcode_search checks variants first
- [ ] Variant results include parent context
- [ ] Variant name formatted correctly
- [ ] Variant attributes included in results
- [ ] Variant stock and price used (not parent)
- [ ] sku_search checks variants
- [ ] Result formatting handles variants
- [ ] is_variant flag added to results
- [ ] parent_product_id and name included

---

## Summary

This document covered the core product search functionality:

1. **Task 39**: Created search submodule structure
2. **Task 40**: Created ProductSearchService class
3. **Task 41**: Implemented exact barcode search
4. **Task 42**: Implemented exact and partial SKU search
5. **Task 43**: Implemented fuzzy name search with trigram similarity
6. **Task 44**: Implemented combined priority search cascade
7. **Task 45**: Added variant resolution for barcode and SKU searches

**Key Outcomes:**
- Centralized search service for POS operations
- Multiple search methods with intelligent prioritization
- Support for product variants with separate barcodes
- Optimized queries with tenant filtering
- Formatted results ready for POS UI consumption

**Next Steps:**
- Add stock availability checking (Task 46)
- Include pricing information (Task 47)
- Create quick button models (Tasks 48-50)

---

## Related Documentation

- [Group Overview](00_GROUP_OVERVIEW.md)
- [Next Document: Stock, Price & Quick Buttons](02_Tasks-46-50_Stock-Price-Quick-Buttons.md)
- [Phase 04: Product Models](../../Phase-04_ERP-Core-Modules-Part1/)
- [Django Trigram Documentation](https://docs.djangoproject.com/en/4.2/ref/contrib/postgres/search/#trigram-similarity)

---

*Document maintained by LankaCommerce Development Team*  
*Last Updated: January 2026*
