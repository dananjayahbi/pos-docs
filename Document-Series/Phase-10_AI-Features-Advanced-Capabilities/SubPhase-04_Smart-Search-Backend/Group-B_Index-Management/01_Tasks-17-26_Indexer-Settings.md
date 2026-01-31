# Tasks 17-26: Indexer and Settings

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** B - Index Management  
> **Document:** 01 of 02  
> **Tasks Covered:** 17, 18, 19, 20, 21, 22, 23, 24, 25, 26

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-27-34_Sync-Signals-Admin.md](02_Tasks-27-34_Sync-Signals-Admin.md)

---

## Document Overview

This document covers the creation of the ProductIndexer class with methods for document conversion and index operations, plus IndexSettings configuration for search optimization. It establishes the foundational indexing infrastructure that converts ERP product data into searchable MeiliSearch documents with proper attribute configurations.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 17 | Create ProductIndexer | High | 45 min |
| 18 | Create to_document Method | Medium | 30 min |
| 19 | Create index_product Method | Low | 20 min |
| 20 | Create bulk_index Method | Medium | 35 min |
| 21 | Create delete_product Method | Low | 20 min |
| 22 | Create update_product Method | Low | 25 min |
| 23 | Create IndexSettings | Medium | 30 min |
| 24 | Create searchable_attributes | Low | 20 min |
| 25 | Create filterable_attributes | Low | 20 min |
| 26 | Create sortable_attributes | Low | 20 min |

---

## Task 17: Create ProductIndexer

### Overview
Create the main ProductIndexer class that handles all product indexing operations. This class serves as the central interface between Django product models and MeiliSearch index. It manages the 'products' index and provides methods for document conversion and index operations.

### Dependencies
- Task 16: Create SearchClient connection
- MeiliSearch client configuration is complete
- Product models are available from ERP modules

### Instructions

1. **Create indexing directory structure**
   - Navigate to `backend/apps/search/` directory
   - Create new `indexing/` subdirectory
   - Add `__init__.py` file to make it a Python package

2. **Create ProductIndexer file**
   - Create `product_indexer.py` file in the indexing directory
   - This will contain the main ProductIndexer class

3. **Import required dependencies**
   - Import MeiliSearch client from search engine setup
   - Import Product model from ERP inventory app
   - Import logging for error handling and monitoring
   - Import typing for proper type hints

4. **Design ProductIndexer class structure**
   - Create class with proper initialization
   - Set index name as 'products' for consistency
   - Store MeiliSearch client instance for operations
   - Add logger for debugging and monitoring

5. **Configure class initialization**
   - Accept optional client parameter for dependency injection
   - Default to global search client if none provided
   - Set up index reference for all operations
   - Initialize any required class attributes

### Class Design Structure

| Component | Purpose | Implementation |
|-----------|---------|----------------|
| `__init__` | Initialize indexer | Store client and index reference |
| `client` | MeiliSearch client | Use SearchClient from Task 16 |
| `index_name` | Index identifier | Set to 'products' |
| `logger` | Error logging | Use Python logging module |

### Index Configuration

```
ProductIndexer
├── Index Name: 'products'
├── Client: MeiliSearch instance
├── Purpose: Product document indexing
└── Methods: (Created in following tasks)
```

### Class Responsibility Matrix

| Responsibility | Method | Task |
|----------------|--------|------|
| Document conversion | to_document | Task 18 |
| Single indexing | index_product | Task 19 |
| Batch indexing | bulk_index | Task 20 |
| Document deletion | delete_product | Task 21 |
| Document updates | update_product | Task 22 |

### Expected Outcome
- Functional ProductIndexer class with proper initialization
- MeiliSearch client integration established
- Index reference configured for 'products'
- Foundation ready for indexing methods

### Verification Checklist
- [ ] `backend/apps/search/indexing/` directory created
- [ ] `product_indexer.py` file exists
- [ ] ProductIndexer class defined
- [ ] MeiliSearch client properly integrated
- [ ] Index name set to 'products'
- [ ] Logging configured for monitoring

---

## Task 18: Create to_document Method

### Overview
Implement the to_document method that converts Django Product model instances into MeiliSearch-compatible document format. This method extracts relevant fields and structures them for optimal search performance while handling relationships and data type conversions.

### Dependencies
- Task 17: Create ProductIndexer class
- Product model with all required fields exists
- Category and brand relationships are established

### Instructions

1. **Define method signature**
   - Add to_document method to ProductIndexer class
   - Accept product parameter (Product model instance)
   - Return dictionary representing searchable document
   - Add proper type hints for clarity

2. **Extract basic product fields**
   - Map product.id to document 'id' field
   - Convert product.name to document 'name' field
   - Include product.sku as document 'sku' field
   - Add product.description to document structure

3. **Handle price data conversion**
   - Convert product.price to float for numerical operations
   - Ensure proper decimal handling for currency
   - Handle None values gracefully with default 0.0

4. **Process category relationships**
   - Extract product.category_id for filtering
   - Include product.category.name for text search
   - Handle cases where category might be None
   - Use safe attribute access to prevent errors

5. **Include inventory and sales data**
   - Add product.stock_quantity as 'stock' field
   - Include product.sales_count for popularity sorting
   - Add product.brand information if available
   - Include product.is_active status flag

6. **Add metadata fields**
   - Include created_at timestamp for sorting
   - Add updated_at for incremental sync tracking
   - Consider any additional searchable attributes
   - Ensure all fields are properly typed for MeiliSearch

### Document Structure Map

| Document Field | Source Field | Type | Purpose |
|----------------|--------------|------|---------|
| id | product.id | int | Primary key |
| name | product.name | str | Text search |
| sku | product.sku | str | Code search |
| description | product.description | str | Text search |
| price | product.price | float | Price filter/sort |
| category_id | product.category_id | int | Category filter |
| category_name | product.category.name | str | Category search |
| brand | product.brand | str | Brand filter |
| stock | product.stock_quantity | int | Stock filter |
| sales_count | product.sales_count | int | Popularity sort |
| is_active | product.is_active | bool | Status filter |
| created_at | product.created_at | str | Date sort |

### Data Type Conversions

| Field | Input Type | Output Type | Conversion |
|-------|------------|-------------|------------|
| price | Decimal | float | float(price) |
| category_name | ForeignKey | str | category.name if category else None |
| timestamps | datetime | str | ISO format string |
| boolean flags | bool | bool | Direct mapping |

### Error Handling Strategy

```
Conversion Process
├── Check product instance validity
├── Handle missing relationships (category/brand)
├── Convert data types safely
├── Provide default values for None fields
└── Return complete document dictionary
```

### Expected Outcome
- Functional to_document method converting products to search documents
- Proper handling of all product fields and relationships
- Safe data type conversions with error handling
- Consistent document structure for MeiliSearch indexing

### Verification Checklist
- [ ] to_document method added to ProductIndexer class
- [ ] All required fields extracted from product model
- [ ] Price conversion to float implemented
- [ ] Category relationship handled safely
- [ ] Stock and sales data included
- [ ] Brand information extracted
- [ ] Boolean fields properly mapped
- [ ] Timestamp fields converted to strings
- [ ] Error handling for missing relationships
- [ ] Method returns complete document dictionary

---

## Task 19: Create index_product Method

### Overview
Implement the index_product method for adding or updating a single product document in the MeiliSearch index. This method handles individual product indexing operations, typically used for real-time updates when products are created or modified through signals.

### Dependencies
- Task 18: Create to_document method
- ProductIndexer class is functional
- MeiliSearch client connection established

### Instructions

1. **Define method signature**
   - Add index_product method to ProductIndexer class
   - Accept product parameter (Product model instance)
   - Return operation result or success indicator
   - Add proper type hints and docstring

2. **Convert product to document**
   - Use the to_document method from Task 18
   - Get searchable document representation
   - Validate document structure before indexing
   - Handle any conversion errors gracefully

3. **Execute MeiliSearch indexing**
   - Use MeiliSearch client to add document to index
   - Call appropriate method for single document addition
   - Pass the converted document to the index
   - Store operation result for verification

4. **Handle indexing errors**
   - Wrap indexing operation in try-catch block
   - Log any errors that occur during indexing
   - Provide meaningful error messages
   - Consider retry logic for network failures

5. **Return operation status**
   - Return success indicator upon completion
   - Include task ID from MeiliSearch response
   - Provide error information if indexing fails
   - Log successful operations for monitoring

### Method Flow Diagram

```
index_product(product)
        │
        ▼
   Convert to document
        │
        ▼
    Validate document
        │
        ▼
   Send to MeiliSearch
        │
        ▼
   Handle response/errors
        │
        ▼
    Return result
```

### Error Handling Cases

| Error Type | Cause | Action |
|------------|-------|--------|
| Conversion Error | Invalid product data | Log error, return failure |
| Network Error | MeiliSearch unavailable | Log error, consider retry |
| Index Error | Document format issue | Log error, return failure |
| Permission Error | Access denied | Log error, return failure |

### Usage Scenarios

| Scenario | When Used | Trigger |
|----------|-----------|---------|
| New Product | Product creation | Django post_save signal |
| Product Update | Product modification | Django post_save signal |
| Manual Indexing | Admin operations | Management command |
| Data Recovery | Index repair | Sync operations |

### Response Handling

| Response Type | Action | Logging |
|---------------|--------|---------|
| Success | Return task ID | Log successful indexing |
| Error | Return error details | Log error with context |
| Timeout | Handle gracefully | Log timeout issue |

### Expected Outcome
- Functional index_product method for single document indexing
- Proper error handling for various failure scenarios
- Integration with to_document method for data conversion
- Logging for monitoring and debugging purposes

### Verification Checklist
- [ ] index_product method added to ProductIndexer class
- [ ] Uses to_document method for conversion
- [ ] MeiliSearch client integration working
- [ ] Error handling implemented
- [ ] Success/failure status returned
- [ ] Logging for operations and errors
- [ ] Method handles network failures gracefully
- [ ] Proper type hints and documentation
- [ ] Integration ready for Django signals

---

## Task 20: Create bulk_index Method

### Overview
Implement the bulk_index method for efficiently indexing multiple products in batches. This method is essential for initial data loading and full synchronization operations, providing significant performance improvements over individual indexing for large datasets.

### Dependencies
- Task 19: Create index_product method
- Task 18: Create to_document method
- ProductIndexer class is functional

### Instructions

1. **Define method signature with batch parameters**
   - Add bulk_index method to ProductIndexer class
   - Accept products parameter (QuerySet or list of products)
   - Add optional batch_size parameter (default 1000)
   - Return summary of indexing operation results

2. **Implement batch processing logic**
   - Process products in chunks based on batch_size
   - Convert each batch of products to documents
   - Use to_document method for each product in batch
   - Collect all documents for batch submission

3. **Execute MeiliSearch bulk operations**
   - Use MeiliSearch client bulk indexing methods
   - Submit entire document batches at once
   - Handle MeiliSearch response and task IDs
   - Track successful and failed operations

4. **Add progress monitoring**
   - Log progress for each batch processed
   - Calculate and report completion percentage
   - Track timing for performance optimization
   - Provide feedback for long-running operations

5. **Implement comprehensive error handling**
   - Handle errors at batch level and individual document level
   - Continue processing remaining batches on partial failures
   - Collect and report failed documents for retry
   - Maintain operation summary with success/failure counts

6. **Optimize memory usage**
   - Process products in chunks to manage memory
   - Clear processed documents from memory
   - Use generator patterns where appropriate
   - Avoid loading entire dataset into memory

### Batch Processing Flow

```
bulk_index(products, batch_size=1000)
            │
            ▼
    Split into batches (1000 each)
            │
            ▼
    For each batch:
    ├── Convert to documents
    ├── Submit to MeiliSearch
    ├── Handle response
    └── Log progress
            │
            ▼
    Return operation summary
```

### Batch Size Optimization

| Product Count | Recommended Batch Size | Reason |
|---------------|------------------------|--------|
| < 1,000 | 500 | Small dataset |
| 1,000 - 10,000 | 1,000 | Default optimal |
| 10,000 - 100,000 | 2,000 | Large dataset |
| > 100,000 | 1,500 | Memory management |

### Error Recovery Strategy

| Error Level | Strategy | Action |
|-------------|----------|--------|
| Document Error | Skip document | Log and continue |
| Batch Error | Retry batch | Log and retry once |
| Network Error | Pause and retry | Wait then continue |
| Critical Error | Stop operation | Report failure |

### Performance Monitoring

| Metric | Tracking | Purpose |
|--------|----------|---------|
| Documents/second | Track rate | Performance tuning |
| Batch completion time | Time each batch | Identify bottlenecks |
| Memory usage | Monitor growth | Prevent OOM errors |
| Error rate | Count failures | Quality monitoring |

### Operation Summary Format

| Field | Type | Description |
|-------|------|-------------|
| total_products | int | Total products processed |
| successful_batches | int | Batches processed successfully |
| failed_batches | int | Batches that failed |
| total_documents | int | Documents indexed |
| failed_documents | list | List of failed document IDs |
| processing_time | float | Total operation time |

### Expected Outcome
- Efficient bulk_index method handling large product datasets
- Batch processing with configurable batch sizes
- Comprehensive error handling and recovery
- Progress monitoring and performance tracking
- Memory-efficient processing of large datasets

### Verification Checklist
- [ ] bulk_index method added to ProductIndexer class
- [ ] Batch processing implemented with configurable size
- [ ] Uses to_document method for conversions
- [ ] MeiliSearch bulk operations integrated
- [ ] Progress logging implemented
- [ ] Error handling for batch and document failures
- [ ] Memory usage optimized for large datasets
- [ ] Operation summary returned with statistics
- [ ] Performance monitoring included
- [ ] Integration ready for sync tasks

---

## Task 21: Create delete_product Method

### Overview
Implement the delete_product method for removing product documents from the MeiliSearch index. This method handles product deletion operations, ensuring index consistency when products are removed from the ERP system through signals or administrative actions.

### Dependencies
- Task 17: Create ProductIndexer class
- MeiliSearch client connection established
- Understanding of MeiliSearch deletion operations

### Instructions

1. **Define method signature**
   - Add delete_product method to ProductIndexer class
   - Accept product_id parameter (integer or string)
   - Return deletion operation result
   - Add proper type hints and documentation

2. **Validate input parameters**
   - Ensure product_id is provided and valid
   - Convert product_id to appropriate type if needed
   - Handle edge cases like None or invalid IDs
   - Log validation issues for debugging

3. **Execute MeiliSearch deletion**
   - Use MeiliSearch client delete document method
   - Pass product_id to identify document to remove
   - Handle MeiliSearch response and task ID
   - Store operation result for verification

4. **Implement error handling**
   - Wrap deletion operation in try-catch block
   - Handle cases where document doesn't exist
   - Log errors with appropriate context
   - Distinguish between different error types

5. **Add operation logging**
   - Log successful deletion operations
   - Include product_id in log messages
   - Record any errors or failures
   - Provide context for debugging issues

### Method Flow Diagram

```
delete_product(product_id)
        │
        ▼
   Validate product_id
        │
        ▼
   Call MeiliSearch delete
        │
        ▼
   Handle response/errors
        │
        ▼
    Return result
```

### Error Handling Scenarios

| Scenario | Error Type | Action |
|----------|------------|--------|
| Document not found | NotFoundError | Log warning, return success |
| Invalid product_id | ValueError | Log error, return failure |
| Network failure | NetworkError | Log error, return failure |
| Permission denied | AuthError | Log error, return failure |

### Deletion Use Cases

| Use Case | Trigger | Context |
|----------|---------|---------|
| Product deletion | Django post_delete signal | Automatic cleanup |
| Bulk cleanup | Management command | Administrative task |
| Index maintenance | Sync operations | Data consistency |
| Testing | Test teardown | Development testing |

### Response Handling

| Response | Meaning | Action |
|----------|---------|--------|
| Success | Document deleted | Log success, return True |
| Not found | Document missing | Log warning, return True |
| Error | Operation failed | Log error, return False |

### Integration Points

| Integration | When Called | Parameters |
|-------------|-------------|------------|
| Django Signals | Product deletion | product.id |
| Sync Tasks | Cleanup operations | List of product_ids |
| Admin Actions | Manual deletion | Selected product_ids |
| Management Commands | Bulk operations | QuerySet of IDs |

### Expected Outcome
- Functional delete_product method for document removal
- Proper error handling for various deletion scenarios
- Integration with MeiliSearch deletion operations
- Logging for monitoring and debugging
- Ready for Django signal integration

### Verification Checklist
- [ ] delete_product method added to ProductIndexer class
- [ ] Product ID validation implemented
- [ ] MeiliSearch delete operation integrated
- [ ] Error handling for various scenarios
- [ ] Success/failure status returned
- [ ] Logging for operations and errors
- [ ] Handles non-existent documents gracefully
- [ ] Method ready for signal integration
- [ ] Type hints and documentation added

---

## Task 22: Create update_product Method

### Overview
Implement the update_product method for updating existing product documents in the MeiliSearch index. This method handles partial updates efficiently, ensuring index data stays synchronized with product changes while maintaining optimal performance.

### Dependencies
- Task 18: Create to_document method
- Task 19: Create index_product method
- ProductIndexer class is functional

### Instructions

1. **Define method signature**
   - Add update_product method to ProductIndexer class
   - Accept product parameter (Product model instance)
   - Return update operation result
   - Add proper type hints and comprehensive documentation

2. **Implement update strategy**
   - Use to_document method to get current product data
   - Convert product to complete document format
   - Use MeiliSearch update operation for efficiency
   - Handle partial vs full document updates

3. **Optimize update operations**
   - Check if document exists before updating
   - Use upsert operation to handle missing documents
   - Minimize data transfer by updating only changed fields
   - Cache frequent updates for batch processing

4. **Add comprehensive error handling**
   - Handle cases where product or document doesn't exist
   - Manage network errors and timeouts gracefully
   - Distinguish between temporary and permanent failures
   - Provide retry logic for recoverable errors

5. **Implement operation logging**
   - Log successful update operations with context
   - Record any errors or failures with details
   - Track update frequency for performance monitoring
   - Include timing information for optimization

6. **Handle edge cases**
   - Deal with concurrent updates gracefully
   - Handle product state changes during update
   - Manage cases where product is deleted during update
   - Account for schema changes in product model

### Update Strategy Flow

```
update_product(product)
        │
        ▼
   Convert to document
        │
        ▼
   Check document exists
        │
        ▼
   Execute MeiliSearch update
        │
        ▼
   Handle response/errors
        │
        ▼
    Return result
```

### Update vs Index Decision

| Condition | Method | Reason |
|-----------|--------|--------|
| Document exists | Update | Efficient partial update |
| Document missing | Index | Create new document |
| Bulk operations | Bulk update | Performance optimization |
| Single changes | Update | Real-time synchronization |

### Error Recovery Patterns

| Error Type | Recovery Strategy | Max Retries |
|------------|-------------------|-------------|
| Network timeout | Exponential backoff | 3 |
| Document conflict | Retry with fresh data | 2 |
| Index unavailable | Wait and retry | 5 |
| Invalid data | Log and skip | 0 |

### Performance Optimization

| Technique | Implementation | Benefit |
|-----------|----------------|---------|
| Document caching | Store recent conversions | Reduce CPU usage |
| Batch updates | Group frequent updates | Reduce network calls |
| Change detection | Compare before update | Skip unnecessary updates |
| Async processing | Use Celery for updates | Non-blocking operations |

### Integration Scenarios

| Scenario | Usage | Frequency |
|----------|-------|-----------|
| Django signals | Automatic updates | High |
| Admin interface | Manual updates | Medium |
| Bulk operations | Data migrations | Low |
| API endpoints | Real-time updates | High |

### Expected Outcome
- Efficient update_product method for document updates
- Optimal handling of existing vs new documents
- Comprehensive error handling and retry logic
- Performance optimizations for frequent updates
- Integration ready for Django signals and admin

### Verification Checklist
- [ ] update_product method added to ProductIndexer class
- [ ] Uses to_document method for data conversion
- [ ] MeiliSearch update operations integrated
- [ ] Upsert functionality for missing documents
- [ ] Error handling for various scenarios
- [ ] Success/failure status returned
- [ ] Logging for operations and errors
- [ ] Performance optimizations implemented
- [ ] Edge cases handled properly
- [ ] Integration ready for signals

---

## Task 23: Create IndexSettings

### Overview
Create the IndexSettings class to configure MeiliSearch index attributes for optimal search performance. This class defines searchable, filterable, and sortable attributes that determine how users can interact with the product search functionality.

### Dependencies
- Task 22: Create update_product method
- ProductIndexer class is complete
- Understanding of MeiliSearch attribute configuration

### Instructions

1. **Create IndexSettings file structure**
   - Create `settings.py` file in the indexing directory
   - Import necessary MeiliSearch configuration modules
   - Add logging for configuration monitoring
   - Include error handling utilities

2. **Design IndexSettings class**
   - Create class for managing index configuration
   - Initialize with MeiliSearch client connection
   - Reference the 'products' index consistently
   - Add methods for applying different attribute types

3. **Configure index reference**
   - Store reference to products index
   - Ensure consistent index naming with ProductIndexer
   - Add validation for index existence
   - Handle index creation if needed

4. **Implement configuration application**
   - Create methods to apply each attribute type
   - Use MeiliSearch client to update index settings
   - Handle configuration errors gracefully
   - Provide feedback on successful configuration

5. **Add configuration validation**
   - Validate attribute names against document structure
   - Ensure attributes exist in indexed documents
   - Check for conflicting configurations
   - Warn about potential performance impacts

6. **Implement configuration monitoring**
   - Log all configuration changes
   - Track configuration application success/failure
   - Monitor configuration performance impact
   - Provide debugging information

### Class Structure Design

```
IndexSettings
├── __init__(client): Initialize with MeiliSearch client
├── apply_searchable_attributes(): Configure search fields
├── apply_filterable_attributes(): Configure filter fields
├── apply_sortable_attributes(): Configure sort fields
├── apply_all_settings(): Apply complete configuration
└── validate_configuration(): Verify settings
```

### Configuration Methods

| Method | Purpose | Configuration Target |
|--------|---------|---------------------|
| apply_searchable_attributes | Set search fields | Text search optimization |
| apply_filterable_attributes | Set filter fields | Faceted search setup |
| apply_sortable_attributes | Set sort fields | Sort option configuration |
| apply_all_settings | Apply complete config | Full index setup |

### Index Configuration Flow

```
IndexSettings Initialization
        │
        ▼
   Validate MeiliSearch connection
        │
        ▼
   Configure searchable attributes
        │
        ▼
   Configure filterable attributes
        │
        ▼
   Configure sortable attributes
        │
        ▼
   Validate configuration applied
```

### Configuration Validation

| Validation Type | Check | Action on Failure |
|----------------|-------|-------------------|
| Attribute existence | Field in document | Log warning |
| Type compatibility | Correct data type | Log error |
| Performance impact | Large text fields | Log warning |
| Conflicting settings | Overlapping configs | Log error |

### Error Handling Strategy

| Error Type | Response | Recovery |
|------------|----------|---------|
| Network error | Log and retry | Exponential backoff |
| Configuration error | Log and skip | Continue with valid settings |
| Permission error | Log and abort | Require admin intervention |
| Invalid attribute | Log warning | Skip invalid attribute |

### Expected Outcome
- Functional IndexSettings class for index configuration
- Methods for applying different attribute types
- Configuration validation and error handling
- Logging for monitoring and debugging
- Foundation for searchable, filterable, and sortable attributes

### Verification Checklist
- [ ] `settings.py` file created in indexing directory
- [ ] IndexSettings class defined
- [ ] MeiliSearch client integration working
- [ ] Configuration application methods created
- [ ] Error handling implemented
- [ ] Logging for configuration operations
- [ ] Validation for attribute existence
- [ ] Index reference properly managed
- [ ] Ready for attribute configuration methods

---

## Task 24: Create searchable_attributes

### Overview
Configure searchable attributes for the products index to optimize text search performance. Define the order and priority of fields that users can search, ensuring the most relevant fields are weighted appropriately for accurate search results.

### Dependencies
- Task 23: Create IndexSettings class
- Document structure from to_document method established
- Understanding of search relevance weighting

### Instructions

1. **Define searchable attributes method**
   - Add apply_searchable_attributes method to IndexSettings class
   - Configure the list of searchable fields in priority order
   - Set appropriate weights for search relevance
   - Apply configuration to MeiliSearch index

2. **Establish search priority hierarchy**
   - Set product name as highest priority (weight 1)
   - Configure SKU as second priority (weight 2)
   - Set description as third priority (weight 3)
   - Add category name as fourth priority (weight 4)
   - Include brand as fifth priority (weight 5)

3. **Configure MeiliSearch searchable attributes**
   - Use MeiliSearch client to update searchable attributes
   - Apply the ordered list of fields to the index
   - Ensure proper field name mapping to document structure
   - Handle configuration errors gracefully

4. **Validate searchable configuration**
   - Verify all specified fields exist in product documents
   - Check that field types are suitable for text search
   - Ensure no conflicts with other attribute configurations
   - Log warnings for any invalid fields

5. **Add performance considerations**
   - Monitor impact of searchable field count on performance
   - Consider field content size for search optimization
   - Balance search comprehensiveness with speed
   - Document recommendations for future optimization

### Searchable Attributes Priority

| Priority | Field | Source | Purpose |
|----------|-------|--------|---------|
| 1 | name | product.name | Primary search field |
| 2 | sku | product.sku | Product code search |
| 3 | description | product.description | Detailed content search |
| 4 | category_name | product.category.name | Category-based search |
| 5 | brand | product.brand | Brand-based search |

### Search Behavior Configuration

```
Search Query: "laptop gaming"
├── name: Highest relevance for exact matches
├── sku: Medium relevance for code matches
├── description: Lower relevance for content matches
├── category_name: Context relevance
└── brand: Brand-specific relevance
```

### Field Weight Impact

| Field Weight | Search Impact | Use Case |
|--------------|---------------|----------|
| 1 (highest) | Exact name matches appear first | Product name search |
| 2 | SKU matches ranked highly | Code-based search |
| 3 | Description matches ranked lower | Content discovery |
| 4 | Category context provided | Category-aware search |
| 5 | Brand context included | Brand filtering |

### Performance Considerations

| Factor | Impact | Optimization |
|--------|--------|--------------|
| Field count | More fields = slower indexing | Limit to essential fields |
| Field size | Large text = more storage | Consider truncation |
| Update frequency | Changes require reindexing | Batch updates when possible |
| Search complexity | More fields = complex scoring | Monitor query performance |

### Configuration Application Flow

```
apply_searchable_attributes()
        │
        ▼
   Validate field existence
        │
        ▼
   Configure priority order
        │
        ▼
   Apply to MeiliSearch index
        │
        ▼
   Verify configuration success
```

### Expected Outcome
- Optimized searchable attributes configuration for products index
- Proper field priority weighting for relevant search results
- Text search functionality across name, SKU, description, category, and brand
- Configuration validation and error handling
- Performance-optimized search field selection

### Verification Checklist
- [ ] apply_searchable_attributes method added to IndexSettings
- [ ] Search priority hierarchy implemented (name, sku, description, category_name, brand)
- [ ] MeiliSearch configuration applied successfully
- [ ] Field existence validation implemented
- [ ] Error handling for configuration failures
- [ ] Logging for configuration operations
- [ ] Performance considerations documented
- [ ] Search relevance weighting configured
- [ ] Integration with IndexSettings class complete

---

## Task 25: Create filterable_attributes

### Overview
Configure filterable attributes for the products index to enable faceted search and filtering capabilities. Define fields that users can filter by, such as category, brand, price range, stock status, and product activity, enabling comprehensive product discovery and refinement.

### Dependencies
- Task 24: Create searchable_attributes
- IndexSettings class is functional
- Understanding of MeiliSearch filtering capabilities

### Instructions

1. **Define filterable attributes method**
   - Add apply_filterable_attributes method to IndexSettings class
   - Configure the list of fields available for filtering
   - Apply filterable configuration to MeiliSearch index
   - Handle configuration errors and validation

2. **Configure category filtering**
   - Enable category_id field for category-based filtering
   - Support exact category matching and selection
   - Allow frontend to build category filter menus
   - Ensure efficient filtering performance

3. **Set up brand filtering**
   - Configure brand field for brand-based filtering
   - Enable exact brand matching capabilities
   - Support multiple brand selection scenarios
   - Optimize for brand filter performance

4. **Configure price range filtering**
   - Enable price field for numerical range filtering
   - Support price range queries (min/max)
   - Handle decimal precision for currency values
   - Optimize for price sorting and filtering

5. **Add stock and status filtering**
   - Configure stock field for inventory-based filtering
   - Enable is_active field for active product filtering
   - Support stock availability filtering (in-stock/out-of-stock)
   - Allow combination filters for complex queries

6. **Implement additional filters**
   - Add sales_count for popularity-based filtering
   - Consider created_at for new product filtering
   - Include any custom attributes for specialized filtering
   - Ensure filter compatibility with search functionality

### Filterable Attributes Configuration

| Field | Type | Filter Purpose | Example Usage |
|-------|------|----------------|---------------|
| category_id | integer | Category selection | "Electronics", "Clothing" |
| brand | string | Brand selection | "Apple", "Samsung", "Nike" |
| price | float | Price range | "$100 - $500", "Under $50" |
| is_active | boolean | Active products only | "Available products" |
| stock | integer | Stock availability | "In stock", "Low stock" |
| sales_count | integer | Popularity filtering | "Best sellers" |

### Filter Usage Scenarios

```
Filter Combinations
├── Category + Brand: "Electronics by Apple"
├── Price Range + Stock: "$100-$500 in stock"
├── Brand + Active Status: "Active Samsung products"
├── Category + Price + Stock: "Electronics under $200 in stock"
└── Popularity + Active: "Best selling active products"
```

### MeiliSearch Filter Syntax Support

| Filter Type | Syntax | Example |
|-------------|--------|---------|
| Exact match | field = value | category_id = 1 |
| Range filter | field > value AND field < value | price > 100 AND price < 500 |
| Multiple values | field IN [value1, value2] | brand IN ["Apple", "Samsung"] |
| Boolean filter | field = true/false | is_active = true |
| Existence filter | field EXISTS | stock EXISTS |

### Performance Optimization

| Optimization | Implementation | Benefit |
|--------------|----------------|---------|
| Index structure | Proper field indexing | Fast filter queries |
| Data types | Correct type configuration | Efficient comparisons |
| Field size | Optimize filter field sizes | Reduced memory usage |
| Combined filters | Test filter combinations | Ensure query performance |

### Configuration Application

```
apply_filterable_attributes()
        │
        ▼
   Validate field types
        │
        ▼
   Configure filter fields list
        │
        ▼
   Apply to MeiliSearch index
        │
        ▼
   Test filter functionality
```

### Expected Outcome
- Comprehensive filterable attributes configuration for product search
- Category, brand, price, stock, and status filtering capabilities
- Optimized filter performance for common use cases
- Support for complex filter combinations
- Integration with search functionality

### Verification Checklist
- [ ] apply_filterable_attributes method added to IndexSettings
- [ ] Category filtering configured (category_id)
- [ ] Brand filtering enabled (brand)
- [ ] Price range filtering implemented (price)
- [ ] Stock filtering configured (stock)
- [ ] Active status filtering enabled (is_active)
- [ ] Sales count filtering added (sales_count)
- [ ] MeiliSearch configuration applied successfully
- [ ] Field type validation implemented
- [ ] Error handling for configuration failures
- [ ] Filter performance optimization considered
- [ ] Integration with IndexSettings class complete

---

## Task 26: Create sortable_attributes

### Overview
Configure sortable attributes for the products index to enable sorting functionality on search results. Define fields that users can sort by, including price, creation date, popularity, and other relevant metrics for comprehensive product ordering capabilities.

### Dependencies
- Task 25: Create filterable_attributes
- IndexSettings class is complete
- Understanding of sorting performance implications

### Instructions

1. **Define sortable attributes method**
   - Add apply_sortable_attributes method to IndexSettings class
   - Configure the list of fields available for sorting
   - Apply sortable configuration to MeiliSearch index
   - Ensure proper error handling and validation

2. **Configure price sorting**
   - Enable price field for price-based sorting
   - Support both ascending (low to high) and descending (high to low) sorting
   - Ensure proper decimal handling for accurate price ordering
   - Optimize for price sorting performance

3. **Set up date sorting**
   - Configure created_at field for date-based sorting
   - Support newest first and oldest first sorting
   - Handle datetime formatting for proper chronological ordering
   - Enable "New Arrivals" and date-range sorting

4. **Configure popularity sorting**
   - Enable sales_count field for popularity-based sorting
   - Support best-sellers and least popular sorting
   - Consider combining with other metrics for relevance
   - Optimize for frequently used popularity sorting

5. **Add additional sorting options**
   - Configure name field for alphabetical sorting
   - Enable stock quantity sorting for inventory management
   - Consider any custom metrics for specialized sorting
   - Ensure sort compatibility with filtering and search

6. **Optimize sorting performance**
   - Consider index implications for sort fields
   - Balance sort options with performance requirements
   - Test sorting performance with large datasets
   - Document recommended sort combinations

### Sortable Attributes Configuration

| Field | Sort Purpose | Ascending | Descending |
|-------|--------------|-----------|------------|
| price | Price ordering | Low to High | High to Low |
| created_at | Date ordering | Oldest First | Newest First |
| sales_count | Popularity | Least Popular | Best Sellers |
| name | Alphabetical | A to Z | Z to A |
| stock | Inventory | Low Stock | High Stock |

### Common Sorting Scenarios

```
Sort Options Menu
├── Price: Low to High / High to Low
├── Newest First / Oldest First
├── Best Sellers / Least Popular
├── Name: A-Z / Z-A
└── Stock: Low to High / High to Low
```

### Sort Performance Considerations

| Factor | Impact | Optimization |
|--------|--------|--------------|
| Field type | Numeric sorts faster than text | Use appropriate data types |
| Field size | Smaller fields sort faster | Optimize field storage |
| Index size | Larger indexes sort slower | Consider pagination |
| Combined operations | Sort + filter = complex query | Test combinations |

### MeiliSearch Sort Syntax

| Sort Type | Syntax | Example |
|-----------|--------|---------|
| Ascending | field:asc | price:asc |
| Descending | field:desc | created_at:desc |
| Multiple sorts | field1:asc,field2:desc | price:asc,sales_count:desc |
| Default sort | relevance first | _score:desc,price:asc |

### Sort Integration with Filtering

| Combination | Use Case | Example |
|-------------|----------|---------|
| Filter + Sort | Category products by price | Electronics sorted by price:asc |
| Search + Sort | Search results by popularity | "laptop" sorted by sales_count:desc |
| Multi-filter + Sort | Complex product discovery | Brand + price range sorted by newest |

### Configuration Validation

```
apply_sortable_attributes()
        │
        ▼
   Validate field data types
        │
        ▼
   Configure sortable fields list
        │
        ▼
   Apply to MeiliSearch index
        │
        ▼
   Test sort functionality
```

### Expected Outcome
- Comprehensive sortable attributes configuration for product search
- Price, date, popularity, name, and stock sorting capabilities
- Optimized sort performance for common use cases
- Integration with filtering and search functionality
- Support for multiple sort criteria combinations

### Verification Checklist
- [ ] apply_sortable_attributes method added to IndexSettings
- [ ] Price sorting configured (price)
- [ ] Date sorting enabled (created_at)
- [ ] Popularity sorting implemented (sales_count)
- [ ] Alphabetical sorting configured (name)
- [ ] Stock sorting enabled (stock)
- [ ] MeiliSearch configuration applied successfully
- [ ] Field type validation for sorting implemented
- [ ] Error handling for configuration failures
- [ ] Sort performance optimization considered
- [ ] Integration with filtering and search tested
- [ ] IndexSettings class configuration complete

---

## Summary

This document established the foundational indexing infrastructure for the Smart Search backend, including the ProductIndexer class with comprehensive document conversion and index operation methods, plus IndexSettings configuration for optimal search performance. These components provide the core functionality for converting ERP product data into searchable MeiliSearch documents.

### Completed Tasks
1. ✓ Created ProductIndexer class with MeiliSearch integration
2. ✓ Implemented to_document method for product-to-document conversion
3. ✓ Created index_product method for single document indexing
4. ✓ Implemented bulk_index method for efficient batch operations
5. ✓ Created delete_product method for document removal
6. ✓ Implemented update_product method for document updates
7. ✓ Created IndexSettings class for index configuration
8. ✓ Configured searchable_attributes for text search optimization
9. ✓ Set up filterable_attributes for faceted search capabilities
10. ✓ Configured sortable_attributes for result ordering functionality

### Next Steps
Proceed to [02_Tasks-27-34_Sync-Signals-Admin.md](02_Tasks-27-34_Sync-Signals-Admin.md) to implement synchronization tasks, Django signals for automatic indexing, and admin interface for index management.