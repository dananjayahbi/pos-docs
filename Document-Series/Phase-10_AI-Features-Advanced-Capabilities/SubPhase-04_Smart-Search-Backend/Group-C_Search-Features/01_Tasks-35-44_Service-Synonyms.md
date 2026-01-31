# Tasks 35-44: Service and Synonyms

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** C - Search Features  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-45-52_Filters-Facets-Highlight.md](02_Tasks-45-52_Filters-Facets-Highlight.md)

---

## Document Overview

This document covers the creation of the core search service and synonym management system for LankaCommerce Cloud ERP. It establishes the SearchService with typo tolerance, creates the Synonym model with database fields, and implements SynonymService for managing synonyms that enhance search accuracy and user experience.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create SearchService | High | 45 min |
| 36 | Create search Method | Medium | 30 min |
| 37 | Create Typo Tolerance | Medium | 25 min |
| 38 | Create min_word_size Setting | Low | 15 min |
| 39 | Create Synonym Model | Medium | 30 min |
| 40 | Create word Field | Low | 10 min |
| 41 | Create synonyms Field | Low | 15 min |
| 42 | Create SynonymService | Medium | 35 min |
| 43 | Create add_synonym Method | Low | 20 min |
| 44 | Create sync_synonyms Method | Medium | 25 min |

---

## Task 35: Create SearchService

### Overview
Create the core SearchService class that handles all search operations for the LankaCommerce Cloud ERP system. This service will interact with MeiliSearch to execute queries, apply filters, and return structured results with proper error handling and logging.

### Dependencies
- Task 34: MeiliSearch client setup completed
- MeiliSearch server running and configured
- Product index created and populated

### Instructions

1. **Create SearchService file structure**
   - Navigate to `backend/apps/search/services/` directory
   - Create new file named `search_service.py`
   - Ensure proper Django app structure is maintained

2. **Import required dependencies**
   - Import meilisearch client from index management
   - Import Django settings and logging utilities
   - Import typing modules for type hints
   - Import custom exceptions from search app

3. **Design SearchService class structure**
   - Create SearchService class with proper initialization
   - Accept MeiliSearch client as dependency injection
   - Initialize with default index configuration
   - Include proper error handling and logging setup

4. **Implement service initialization**
   - Set up client connection to MeiliSearch server
   - Configure default search parameters (limit, offset)
   - Initialize error handling mechanisms
   - Setup logging for search operations and debugging

5. **Add service configuration methods**
   - Create method to validate MeiliSearch connection
   - Add method to check index health and status
   - Implement service health check functionality
   - Create method to get search statistics

6. **Implement base search infrastructure**
   - Create private methods for query preprocessing
   - Add result formatting and post-processing methods
   - Implement pagination helper methods
   - Add search metrics and performance tracking

### SearchService Architecture

```
SearchService
├── __init__(client) → Initialize service
├── _validate_connection() → Check MeiliSearch health
├── _preprocess_query() → Clean and prepare query
├── _format_results() → Format search response
├── _handle_search_error() → Error handling
└── search() → Main search method (Task 36)
```

### Service Configuration

| Parameter | Default Value | Purpose |
|-----------|---------------|---------|
| default_limit | 20 | Results per page |
| default_offset | 0 | Starting position |
| max_limit | 100 | Maximum results allowed |
| timeout | 5000ms | Search timeout |

### Error Handling Strategy

| Error Type | Action |
|------------|--------|
| Connection Error | Log and raise SearchUnavailableException |
| Timeout Error | Log and return partial results |
| Index Error | Log and raise IndexNotFoundException |
| Query Error | Log and raise InvalidQueryException |

### Expected Outcome
- Functional SearchService class with proper initialization
- Connection validation and health check methods
- Error handling and logging infrastructure
- Foundation for search method implementation

### Verification Checklist
- [ ] `backend/apps/search/services/search_service.py` file created
- [ ] SearchService class defined with proper __init__ method
- [ ] MeiliSearch client integration implemented
- [ ] Error handling and logging configured
- [ ] Connection validation methods added
- [ ] Service health check functionality included

---

## Task 36: Create search Method

### Overview
Implement the main search method in SearchService that executes queries against MeiliSearch. This method handles query processing, applies basic filters, manages pagination, and returns structured search results with proper formatting and error handling.

### Dependencies
- Task 35: Create SearchService

### Instructions

1. **Define search method signature**
   - Create public method named `search` in SearchService class
   - Accept parameters: query (str), filters (dict), limit (int), offset (int)
   - Add proper type hints for all parameters and return type
   - Include comprehensive docstring with parameter descriptions

2. **Implement query preprocessing**
   - Validate and sanitize input query string
   - Handle empty or null queries appropriately
   - Trim whitespace and normalize query text
   - Check query length limits and special characters

3. **Configure search parameters**
   - Set up MeiliSearch query parameters
   - Configure searchable attributes for products
   - Set result limit and offset for pagination
   - Add sorting and ranking parameters

4. **Execute search query**
   - Call MeiliSearch client with prepared parameters
   - Handle search execution with proper timeout
   - Catch and handle search-specific exceptions
   - Log search queries and execution time

5. **Process search results**
   - Format raw MeiliSearch results into structured data
   - Calculate total results count and pagination info
   - Extract and format product information
   - Add search metadata (query time, total hits)

6. **Implement result pagination**
   - Calculate total pages based on limit and total results
   - Add pagination metadata to response
   - Validate offset and limit parameters
   - Handle edge cases (empty results, large offsets)

### Search Method Flow

```
search(query, filters, limit, offset)
    │
    ▼
Validate Parameters
    │
    ▼
Preprocess Query
    │
    ▼
Execute MeiliSearch Query
    │
    ▼
Process Results
    │
    ▼
Add Pagination Metadata
    │
    ▼
Return SearchResults Object
```

### Method Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| query | str | Required | Search query string |
| filters | dict | None | Filter conditions |
| limit | int | 20 | Results per page |
| offset | int | 0 | Starting position |

### SearchResults Structure

| Field | Type | Description |
|-------|------|-------------|
| results | List[Product] | Product results |
| total_hits | int | Total matching products |
| query_time | float | Search execution time |
| page | int | Current page number |
| total_pages | int | Total pages available |
| has_more | bool | More results available |

### Search Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| searchableAttributes | ["name", "description", "sku"] | Fields to search |
| displayedAttributes | ["*"] | Fields to return |
| limit | 1-100 | Results per page |
| offset | 0+ | Pagination offset |

### Expected Outcome
- Functional search method with proper parameter handling
- MeiliSearch query execution with error handling
- Structured search results with pagination metadata
- Comprehensive logging and performance tracking

### Verification Checklist
- [ ] search method signature defined with proper types
- [ ] Query validation and preprocessing implemented
- [ ] MeiliSearch query execution with error handling
- [ ] Result formatting and pagination logic
- [ ] SearchResults object structure implemented
- [ ] Performance logging and metrics added

---

## Task 37: Create Typo Tolerance

### Overview
Configure typo tolerance in MeiliSearch to handle user spelling mistakes and improve search accuracy. This feature enables fuzzy matching that finds relevant results even when users make typing errors, enhancing the overall search experience for LankaCommerce Cloud ERP users.

### Dependencies
- Task 36: Create search Method
- MeiliSearch index configuration access

### Instructions

1. **Research MeiliSearch typo tolerance**
   - Study MeiliSearch typo tolerance documentation
   - Understand typo tolerance settings and parameters
   - Review best practices for e-commerce search
   - Analyze impact on search performance and accuracy

2. **Create typo tolerance configuration**
   - Navigate to search service configuration area
   - Create dedicated method for typo tolerance setup
   - Define configuration parameters and their values
   - Prepare typo tolerance settings object

3. **Implement typo tolerance settings**
   - Enable typo tolerance in MeiliSearch index settings
   - Configure typo tolerance to be active by default
   - Set up reasonable defaults for commerce search
   - Add configuration validation and error handling

4. **Configure typo tolerance parameters**
   - Set minWordSizeForTypos settings (implemented in Task 38)
   - Configure disableOnWords list for critical terms
   - Set disableOnAttributes for exact-match fields
   - Add custom typo tolerance rules if needed

5. **Create typo tolerance update method**
   - Implement method to update index typo tolerance settings
   - Add retry logic for index update operations
   - Include proper error handling for configuration failures
   - Log typo tolerance configuration changes

6. **Test typo tolerance configuration**
   - Create test cases for common typing mistakes
   - Verify typo tolerance works for product names
   - Test edge cases and performance impact
   - Validate configuration applies correctly to index

### Typo Tolerance Configuration

```
Typo Tolerance Settings
├── enabled: true → Enable fuzzy matching
├── minWordSizeForTypos → Word size thresholds (Task 38)
├── disableOnWords: [] → Exact match words
└── disableOnAttributes: ["sku", "barcode"] → Exact fields
```

### Common E-commerce Typos

| User Types | Should Find |
|------------|-------------|
| "iphne" | "iphone" |
| "samung" | "samsung" |
| "lapto" | "laptop" |
| "camra" | "camera" |
| "mobil" | "mobile" |

### Typo Tolerance Levels

| Typos | Word Length | Examples |
|-------|-------------|----------|
| 0 | 1-4 chars | "tv", "led" → exact match only |
| 1 | 5-8 chars | "phone" → "phne", "fone" |
| 2 | 9+ chars | "smartphone" → "smarphone", "smartfone" |

### Configuration Method Structure

| Method | Purpose |
|--------|---------|
| configure_typo_tolerance() | Main configuration method |
| update_index_settings() | Apply settings to MeiliSearch |
| validate_typo_config() | Validate configuration |
| test_typo_tolerance() | Test typo matching |

### Expected Outcome
- Typo tolerance enabled and configured in MeiliSearch
- Fuzzy matching working for product searches
- Configuration method for updating typo settings
- Proper error handling and logging

### Verification Checklist
- [ ] Typo tolerance enabled in MeiliSearch index settings
- [ ] Configuration method created and tested
- [ ] Common typos successfully match products
- [ ] Settings update method with error handling
- [ ] Configuration validation and logging
- [ ] Performance impact assessed and acceptable

---

## Task 38: Create min_word_size Setting

### Overview
Configure the minWordSizeForTypos setting in MeiliSearch to define the minimum word length required before typo tolerance is applied. This fine-tunes the search accuracy by preventing false matches on short words while allowing fuzzy matching on longer terms.

### Dependencies
- Task 37: Create Typo Tolerance

### Instructions

1. **Understand minWordSizeForTypos concept**
   - Study how word length affects typo tolerance
   - Understand oneTypo and twoTypos thresholds
   - Review impact on search accuracy and performance
   - Analyze best practices for e-commerce applications

2. **Define word size thresholds**
   - Set oneTypo threshold for single character mistakes
   - Set twoTypos threshold for double character mistakes
   - Consider product naming conventions in Lanka
   - Balance between accuracy and search flexibility

3. **Configure oneTypo setting**
   - Set minimum word length for one typo tolerance
   - Recommended value: 5 characters minimum
   - Test with common product names and brands
   - Validate setting doesn't break exact matches

4. **Configure twoTypos setting**
   - Set minimum word length for two typo tolerance
   - Recommended value: 9 characters minimum
   - Test with longer product descriptions and names
   - Ensure performance remains acceptable

5. **Implement word size configuration**
   - Add minWordSizeForTypos to typo tolerance settings
   - Create configuration validation method
   - Update index settings with new parameters
   - Include proper error handling for configuration

6. **Test word size settings**
   - Test short words (3-4 chars) for exact matching only
   - Test medium words (5-8 chars) for one typo tolerance
   - Test long words (9+ chars) for two typo tolerance
   - Verify search accuracy and performance metrics

### Word Size Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| oneTypo | 5 | Min chars for 1 typo |
| twoTypos | 9 | Min chars for 2 typos |

### Word Length Examples

| Word Length | Typo Tolerance | Examples |
|-------------|----------------|----------|
| 1-4 chars | None | "TV", "LED", "DVD" |
| 5-8 chars | 1 typo | "phone", "mouse", "cable" |
| 9+ chars | 2 typos | "smartphone", "headphones", "television" |

### Typo Matching Examples

| Query | Word Length | Typos Allowed | Matches |
|-------|-------------|---------------|---------|
| "tv" | 2 | 0 | Only "TV" |
| "phon" | 4 | 0 | Only "phon" |
| "phone" | 5 | 1 | "phone", "fone" |
| "smartphon" | 9 | 2 | "smartphone", "smartfone" |

### Configuration Structure

```
minWordSizeForTypos: {
    oneTypo: 5,     // Words 5-8 chars: 1 typo max
    twoTypos: 9     // Words 9+ chars: 2 typos max
}
```

### Testing Strategy

| Test Case | Query | Expected Behavior |
|-----------|-------|-------------------|
| Short word exact | "TV" | Exact match only |
| Medium word typo | "phne" | Finds "phone" |
| Long word typos | "smartfon" | Finds "smartphone" |
| Edge case | "phone" vs "fone" | Both should work |

### Expected Outcome
- minWordSizeForTypos configured with optimal values
- Short words require exact matches
- Medium words allow single typo
- Long words allow double typos
- Improved search accuracy and user experience

### Verification Checklist
- [ ] oneTypo threshold set to 5 characters
- [ ] twoTypos threshold set to 9 characters
- [ ] Configuration applied to MeiliSearch index
- [ ] Short words tested for exact matching only
- [ ] Medium words tested for single typo tolerance
- [ ] Long words tested for double typo tolerance
- [ ] Performance impact measured and acceptable

---

## Task 39: Create Synonym Model

### Overview
Create a Django model to store synonyms that enhance search results by mapping alternative terms to primary search terms. This model enables users to find products using different terminology, improving search coverage and user experience in the LankaCommerce Cloud ERP system.

### Dependencies
- Task 38: minWordSizeForTypos setting configured
- Django ORM and database setup completed

### Instructions

1. **Design Synonym model structure**
   - Navigate to `backend/apps/search/models/` directory
   - Create new file named `synonym.py`
   - Plan model fields and relationships
   - Consider database performance and indexing

2. **Import required Django modules**
   - Import Django model base classes and field types
   - Import JSONField for storing synonym lists
   - Import validation utilities and custom validators
   - Import timezone utilities if needed

3. **Create Synonym model class**
   - Define Synonym class inheriting from Django Model
   - Add proper model metadata and documentation
   - Include database table name configuration
   - Set up model ordering and representation methods

4. **Implement model fields**
   - Add word field for primary search term (Task 40)
   - Add synonyms field for alternative terms (Task 41)
   - Include created_at and updated_at timestamp fields
   - Add is_active field for enabling/disabling synonyms

5. **Configure model metadata**
   - Set database table name to search_synonyms
   - Add model ordering by word alphabetically
   - Configure unique constraints and indexes
   - Add model documentation and help text

6. **Implement model methods**
   - Create __str__ method for admin interface display
   - Add clean() method for model validation
   - Implement save() method with custom logic if needed
   - Create helper methods for synonym management

### Synonym Model Structure

```
Synonym Model
├── id (AutoField) → Primary key
├── word (CharField) → Primary search term (Task 40)
├── synonyms (JSONField) → Alternative terms (Task 41)
├── is_active (BooleanField) → Enable/disable
├── created_at (DateTimeField) → Creation timestamp
├── updated_at (DateTimeField) → Last update timestamp
└── Meta → Database configuration
```

### Model Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| db_table | search_synonyms | Database table name |
| ordering | ['word'] | Alphabetical ordering |
| verbose_name | Synonym | Admin display name |
| verbose_name_plural | Synonyms | Admin display name |

### Synonym Examples

| Word | Synonyms |
|------|----------|
| mobile | ["phone", "smartphone", "cell"] |
| laptop | ["notebook", "computer"] |
| tv | ["television", "led", "lcd"] |
| bike | ["bicycle", "cycle"] |

### Model Validation Rules

| Field | Validation |
|-------|------------|
| word | Required, max 100 chars, unique |
| synonyms | Must be list, non-empty, max 50 items |
| is_active | Boolean, defaults to True |

### Database Indexes

| Index | Fields | Purpose |
|-------|--------|---------|
| Primary | id | Primary key |
| Unique | word | Prevent duplicates |
| Regular | is_active | Filter active synonyms |
| Composite | word, is_active | Query optimization |

### Expected Outcome
- Functional Synonym Django model
- Proper field definitions and validation
- Database table with appropriate indexes
- Model methods for admin interface and management

### Verification Checklist
- [ ] `backend/apps/search/models/synonym.py` file created
- [ ] Synonym model class defined with proper inheritance
- [ ] Model fields added (word, synonyms, timestamps, is_active)
- [ ] Model metadata configured correctly
- [ ] __str__ and validation methods implemented
- [ ] Database migrations created and applied

---

## Task 40: Create word Field

### Overview
Implement the word field in the Synonym model to store the primary search term that users might search for. This field serves as the key that triggers synonym expansion during search operations, enabling users to find products using various terminology.

### Dependencies
- Task 39: Create Synonym Model

### Instructions

1. **Define word field characteristics**
   - Determine appropriate field type (CharField)
   - Set maximum length based on search term analysis
   - Configure field as unique to prevent duplicates
   - Add database index for performance optimization

2. **Implement CharField for word**
   - Create word field as CharField with 100 character limit
   - Set unique=True to ensure no duplicate primary terms
   - Add db_index=True for query performance
   - Include help_text for admin interface clarity

3. **Configure field validation**
   - Add max_length validation (100 characters)
   - Ensure field is required (null=False, blank=False)
   - Add custom validation for word format if needed
   - Consider case sensitivity implications

4. **Add field constraints**
   - Set unique constraint at database level
   - Add blank=False to prevent empty values
   - Configure null=False to require values
   - Consider adding custom validators for format

5. **Implement field indexing**
   - Add database index for fast lookups
   - Consider composite indexes with other fields
   - Optimize for search and admin queries
   - Plan for case-insensitive searches if needed

6. **Test word field functionality**
   - Create test cases for field validation
   - Test unique constraint enforcement
   - Verify database index creation
   - Test field in admin interface

### Word Field Configuration

```python
word = models.CharField(
    max_length=100,
    unique=True,
    db_index=True,
    blank=False,
    null=False,
    help_text="Primary search term"
)
```

### Field Properties

| Property | Value | Purpose |
|----------|-------|---------|
| Type | CharField | Text storage |
| max_length | 100 | Reasonable term length |
| unique | True | No duplicates |
| db_index | True | Fast lookups |
| blank | False | Required in forms |
| null | False | Required in database |

### Word Field Examples

| Valid Words | Invalid Words |
|-------------|---------------|
| "mobile" | "" (empty) |
| "laptop computer" | null (missing) |
| "TV" | "a"*101 (too long) |
| "smartphone" | duplicate existing |

### Validation Rules

| Rule | Description |
|------|-------------|
| Required | Cannot be empty or null |
| Length | 1-100 characters maximum |
| Uniqueness | No duplicate words allowed |
| Format | Standard text, no special validation |

### Database Considerations

| Aspect | Implementation |
|--------|----------------|
| Index Type | B-tree index for text searches |
| Collation | Case-sensitive by default |
| Storage | VARCHAR(100) in database |
| Constraints | UNIQUE constraint enforced |

### Admin Interface Impact

| Feature | Behavior |
|---------|----------|
| Display | Shows word as primary identifier |
| Search | Searchable field in admin |
| Validation | Real-time uniqueness checking |
| Ordering | Default model ordering by word |

### Expected Outcome
- Functional word field with proper constraints
- Database index for performance optimization
- Unique constraint preventing duplicates
- Proper validation and admin interface integration

### Verification Checklist
- [ ] word field added to Synonym model as CharField
- [ ] max_length set to 100 characters
- [ ] unique=True constraint configured
- [ ] db_index=True for performance
- [ ] Field validation working correctly
- [ ] Admin interface shows field properly
- [ ] Database migration created and applied

---

## Task 41: Create synonyms Field

### Overview
Implement the synonyms field in the Synonym model using Django's JSONField to store a list of alternative terms. This field contains the alternative search terms that should match the primary word, enabling flexible search capabilities across different terminology.

### Dependencies
- Task 39: Create Synonym Model
- Task 40: Create word Field

### Instructions

1. **Choose appropriate field type**
   - Select JSONField for storing synonym arrays
   - Consider alternative storage approaches
   - Plan for database compatibility (PostgreSQL JSONField)
   - Ensure proper JSON serialization and deserialization

2. **Configure JSONField for synonyms**
   - Create synonyms field as JSONField
   - Set default value as empty list
   - Configure field to be required
   - Add appropriate validation for JSON structure

3. **Implement synonym list validation**
   - Ensure synonyms field contains a list/array
   - Validate each synonym is a string
   - Check maximum number of synonyms per word (50 max)
   - Prevent empty strings in synonym list

4. **Add custom validation methods**
   - Create clean method for model-level validation
   - Validate synonym list format and content
   - Check for duplicate synonyms within the list
   - Ensure synonyms don't match the primary word

5. **Configure field properties**
   - Set blank=False to require values in forms
   - Set null=False to require database values
   - Add help_text for admin interface guidance
   - Consider adding custom validator functions

6. **Test synonyms field functionality**
   - Test JSON serialization and deserialization
   - Validate list structure enforcement
   - Test synonym list size limits
   - Verify admin interface functionality

### Synonyms Field Configuration

```python
synonyms = models.JSONField(
    default=list,
    blank=False,
    null=False,
    help_text="List of alternative search terms"
)
```

### Field Properties

| Property | Value | Purpose |
|----------|-------|---------|
| Type | JSONField | Store JSON array |
| default | list | Empty list default |
| blank | False | Required in forms |
| null | False | Required in database |
| validation | Custom | List format and content |

### Synonym Data Examples

| Word | Synonyms JSON |
|------|---------------|
| mobile | ["phone", "smartphone", "cell"] |
| laptop | ["notebook", "computer", "pc"] |
| tv | ["television", "led", "lcd", "monitor"] |
| bike | ["bicycle", "cycle"] |

### Validation Rules

| Rule | Description |
|------|-------------|
| Type | Must be a list/array |
| Content | Each item must be a string |
| Length | Maximum 50 synonyms per word |
| Uniqueness | No duplicate synonyms in list |
| Non-empty | At least one synonym required |

### JSON Structure

```json
{
    "word": "mobile",
    "synonyms": ["phone", "smartphone", "cell", "handset"]
}
```

### Custom Validation Logic

| Validation | Check |
|------------|-------|
| is_list | isinstance(value, list) |
| non_empty | len(value) > 0 |
| max_items | len(value) <= 50 |
| string_items | all(isinstance(s, str) for s in value) |
| no_duplicates | len(set(value)) == len(value) |

### Database Storage

| Database | Storage Type |
|----------|-------------|
| PostgreSQL | JSONB field |
| SQLite | TEXT with JSON |
| MySQL | JSON field (5.7+) |

### Expected Outcome
- Functional synonyms field storing JSON arrays
- Proper validation for list structure and content
- Database storage optimized for JSON queries
- Admin interface supporting list editing

### Verification Checklist
- [ ] synonyms field added as JSONField
- [ ] Default value set to empty list
- [ ] Custom validation implemented
- [ ] Maximum synonym limit enforced (50)
- [ ] JSON structure validation working
- [ ] Admin interface supports list editing
- [ ] Database queries work with JSON field

---

## Task 42: Create SynonymService

### Overview
Create a service class to manage synonym operations including adding, updating, deleting, and synchronizing synonyms with MeiliSearch. This service provides a clean interface for synonym management and ensures proper integration between the Django model and the search engine.

### Dependencies
- Task 41: Create synonyms Field
- SynonymModel fully implemented

### Instructions

1. **Create SynonymService file structure**
   - Navigate to `backend/apps/search/services/` directory
   - Create new file named `synonym_service.py`
   - Import required Django and MeiliSearch modules
   - Import the Synonym model created in previous tasks

2. **Design SynonymService class structure**
   - Create SynonymService class with proper initialization
   - Accept MeiliSearch client as dependency injection
   - Initialize with proper error handling and logging
   - Plan methods for CRUD operations

3. **Implement service initialization**
   - Set up MeiliSearch client connection
   - Initialize logging for synonym operations
   - Configure error handling mechanisms
   - Set up service defaults and configuration

4. **Create synonym management methods**
   - Plan add_synonym method (implemented in Task 43)
   - Plan sync_synonyms method (implemented in Task 44)
   - Add helper methods for validation and formatting
   - Create methods for getting and deleting synonyms

5. **Implement synonym retrieval methods**
   - Create method to get all active synonyms
   - Add method to get specific synonym by word
   - Implement search functionality for synonyms
   - Add method to get synonym statistics

6. **Add synonym validation methods**
   - Create method to validate synonym data
   - Add method to check for conflicts and duplicates
   - Implement synonym formatting helpers
   - Create method to validate MeiliSearch compatibility

### SynonymService Architecture

```
SynonymService
├── __init__(client) → Initialize service
├── get_all_synonyms() → Retrieve all synonyms
├── get_synonym(word) → Get specific synonym
├── search_synonyms(query) → Search synonyms
├── validate_synonym_data() → Validate input
├── add_synonym() → Add/update synonym (Task 43)
├── delete_synonym() → Remove synonym
└── sync_synonyms() → Sync with MeiliSearch (Task 44)
```

### Service Methods Overview

| Method | Purpose | Return Type |
|--------|---------|-------------|
| get_all_synonyms() | Get all active synonyms | List[Synonym] |
| get_synonym(word) | Get specific synonym | Synonym or None |
| search_synonyms(query) | Search synonyms | List[Synonym] |
| delete_synonym(word) | Delete synonym | bool |
| validate_synonym_data() | Validate input | bool |

### Synonym Data Flow

```
Django Admin/API
    │
    ▼
SynonymService
    │
    ├── Add/Update → Synonym Model → Database
    │
    └── Sync → MeiliSearch → Search Index
```

### Error Handling Strategy

| Error Type | Handling |
|------------|----------|
| Database Error | Log and raise SynonymDatabaseException |
| Validation Error | Return validation error details |
| MeiliSearch Error | Log and raise SearchSyncException |
| Network Error | Retry with exponential backoff |

### Service Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| max_synonyms | 1000 | Prevent excessive synonyms |
| sync_batch_size | 100 | Batch sync operations |
| retry_attempts | 3 | Error recovery attempts |
| cache_timeout | 300 | Cache synonym data |

### Logging Strategy

| Event | Log Level | Information |
|-------|-----------|-------------|
| Synonym Added | INFO | Word and synonym count |
| Sync Success | INFO | Number of synonyms synced |
| Validation Error | WARNING | Validation failure details |
| Service Error | ERROR | Error details and stack trace |

### Expected Outcome
- Functional SynonymService class with proper initialization
- Methods for synonym retrieval and management
- Error handling and logging infrastructure
- Foundation for add_synonym and sync_synonyms methods

### Verification Checklist
- [ ] `backend/apps/search/services/synonym_service.py` created
- [ ] SynonymService class defined with proper initialization
- [ ] MeiliSearch client integration configured
- [ ] Synonym retrieval methods implemented
- [ ] Error handling and logging configured
- [ ] Validation helper methods added

---

## Task 43: Create add_synonym Method

### Overview
Implement the add_synonym method in SynonymService to create or update synonym entries in the database. This method handles synonym data validation, database operations, and provides proper error handling for synonym management operations.

### Dependencies
- Task 42: Create SynonymService

### Instructions

1. **Define add_synonym method signature**
   - Create method in SynonymService class
   - Accept parameters: word (str) and synonyms (list)
   - Add proper type hints for parameters and return type
   - Include comprehensive docstring with examples

2. **Implement input validation**
   - Validate word parameter is not empty or None
   - Check word length meets model field requirements
   - Validate synonyms parameter is a list with string items
   - Check synonym list length limits (maximum 50 items)

3. **Add synonym data processing**
   - Clean and normalize word input (strip whitespace, lowercase)
   - Process synonym list (remove duplicates, normalize case)
   - Validate synonyms don't contain the primary word
   - Check for conflicting existing synonyms

4. **Implement database operations**
   - Check if synonym entry already exists for the word
   - Create new Synonym model instance or update existing
   - Use get_or_create pattern for safe database operations
   - Handle database constraints and unique violations

5. **Add transaction handling**
   - Wrap database operations in transaction
   - Implement rollback on validation or save errors
   - Ensure data consistency during operations
   - Add proper error logging for failed transactions

6. **Implement return value and logging**
   - Return success status and created/updated synonym instance
   - Log successful synonym additions with details
   - Log validation errors and database failures
   - Return appropriate error messages for debugging

### Method Signature and Parameters

```python
def add_synonym(self, word: str, synonyms: List[str]) -> Tuple[bool, Union[Synonym, str]]:
    """
    Add or update a synonym entry.
    
    Args:
        word: Primary search term
        synonyms: List of alternative terms
        
    Returns:
        Tuple of (success: bool, result: Synonym or error_message)
    """
```

### Method Parameters

| Parameter | Type | Validation |
|-----------|------|------------|
| word | str | Required, 1-100 chars, non-empty |
| synonyms | List[str] | Required, 1-50 items, non-empty strings |

### Validation Process

```
Input Validation
    │
    ▼
Word Validation (length, format)
    │
    ▼
Synonyms List Validation
    │
    ▼
Duplicate Check
    │
    ▼
Database Operation
    │
    ▼
Success/Error Response
```

### Validation Rules

| Rule | Check |
|------|-------|
| Word Required | word is not None and len(word.strip()) > 0 |
| Word Length | len(word) <= 100 |
| Synonyms List | isinstance(synonyms, list) and len(synonyms) > 0 |
| Synonyms Count | len(synonyms) <= 50 |
| Synonym Format | all(isinstance(s, str) and s.strip() for s in synonyms) |

### Database Operations

| Operation | Action |
|-----------|--------|
| Check Existing | Synonym.objects.filter(word=word).first() |
| Create New | Synonym.objects.create(word=word, synonyms=synonyms) |
| Update Existing | existing.synonyms = synonyms; existing.save() |
| Transaction | Use atomic transaction for consistency |

### Error Handling

| Error Type | Response |
|------------|----------|
| ValidationError | (False, "Validation error: details") |
| IntegrityError | (False, "Database constraint violation") |
| DatabaseError | (False, "Database operation failed") |
| GeneralError | (False, "Unexpected error occurred") |

### Success Response

| Case | Response |
|------|----------|
| Created New | (True, synonym_instance) |
| Updated Existing | (True, synonym_instance) |

### Method Usage Examples

```python
# Add new synonym
success, result = service.add_synonym("mobile", ["phone", "smartphone"])

# Update existing synonym
success, result = service.add_synonym("laptop", ["notebook", "computer", "pc"])

# Handle validation error
success, error = service.add_synonym("", ["phone"])  # Returns (False, error_msg)
```

### Expected Outcome
- Functional add_synonym method with comprehensive validation
- Database operations with transaction handling
- Proper error handling and user-friendly error messages
- Logging for successful operations and failures

### Verification Checklist
- [ ] add_synonym method signature defined correctly
- [ ] Input validation implemented for word and synonyms
- [ ] Database operations use get_or_create pattern
- [ ] Transaction handling prevents data inconsistency
- [ ] Error handling covers all failure cases
- [ ] Success and error responses properly formatted
- [ ] Logging implemented for operations and errors

---

## Task 44: Create sync_synonyms Method

### Overview
Implement the sync_synonyms method in SynonymService to synchronize synonym data from the Django database with MeiliSearch index. This method ensures that all active synonyms are properly configured in the search engine for enhanced search functionality.

### Dependencies
- Task 43: Create add_synonym Method
- MeiliSearch client configured and accessible

### Instructions

1. **Define sync_synonyms method signature**
   - Create method in SynonymService class
   - Method should not require parameters (syncs all active)
   - Add proper type hints for return type
   - Include comprehensive docstring explaining sync process

2. **Implement synonym data retrieval**
   - Query all active synonyms from database
   - Convert Django model instances to MeiliSearch format
   - Handle empty synonym lists appropriately
   - Sort synonyms for consistent ordering

3. **Convert to MeiliSearch format**
   - Transform synonym data to MeiliSearch dictionary format
   - Map primary words to their synonym lists
   - Ensure proper JSON serialization compatibility
   - Handle special characters and encoding issues

4. **Implement MeiliSearch synchronization**
   - Update MeiliSearch index synonym settings
   - Use proper MeiliSearch client methods for synonym updates
   - Handle MeiliSearch API responses and errors
   - Implement batch processing for large synonym sets

5. **Add error handling and retry logic**
   - Catch MeiliSearch connection and API errors
   - Implement retry mechanism with exponential backoff
   - Handle partial sync failures gracefully
   - Log detailed error information for debugging

6. **Implement sync verification and logging**
   - Verify synonym settings were applied successfully
   - Log sync operation details (count, time, status)
   - Return sync status and operation metrics
   - Add performance monitoring for sync operations

### Method Signature

```python
def sync_synonyms(self) -> Dict[str, Any]:
    """
    Synchronize all active synonyms with MeiliSearch index.
    
    Returns:
        Dict containing sync status, count, and timing information
    """
```

### Sync Process Flow

```
Get Active Synonyms from Database
    │
    ▼
Convert to MeiliSearch Format
    │
    ▼
Validate Synonym Data
    │
    ▼
Update MeiliSearch Index Settings
    │
    ▼
Verify Sync Success
    │
    ▼
Return Sync Results
```

### Database Query

| Operation | Query |
|-----------|-------|
| Get Active | Synonym.objects.filter(is_active=True) |
| Order | .order_by('word') |
| Values | .values('word', 'synonyms') |

### MeiliSearch Format Conversion

```python
# Django format
{"word": "mobile", "synonyms": ["phone", "smartphone"]}

# MeiliSearch format
{
    "mobile": ["phone", "smartphone"],
    "phone": ["mobile", "smartphone"],
    "smartphone": ["mobile", "phone"]
}
```

### Synonym Dictionary Structure

| Key | Value | Description |
|-----|-------|-------------|
| word | List[str] | All related terms including synonyms |
| synonym1 | List[str] | All related terms including word |
| synonym2 | List[str] | All related terms including word |

### Error Handling Strategy

| Error Type | Action |
|------------|--------|
| Database Error | Log error and return failure status |
| MeiliSearch Connection | Retry with exponential backoff |
| API Error | Log details and return partial success |
| Validation Error | Skip invalid entries and continue |

### Retry Logic Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| max_retries | 3 | Maximum retry attempts |
| base_delay | 1 second | Initial retry delay |
| max_delay | 10 seconds | Maximum retry delay |
| backoff_factor | 2 | Exponential backoff multiplier |

### Sync Response Structure

```python
{
    "success": True,
    "synonyms_count": 25,
    "sync_time": 1.234,
    "meilisearch_response": {...},
    "errors": []
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| success | bool | Overall sync success status |
| synonyms_count | int | Number of synonyms processed |
| sync_time | float | Time taken in seconds |
| meilisearch_response | dict | MeiliSearch API response |
| errors | List[str] | Any errors encountered |

### Performance Considerations

| Aspect | Consideration |
|--------|---------------|
| Batch Size | Process synonyms in batches if large dataset |
| Caching | Cache converted synonyms temporarily |
| Network | Handle network timeouts gracefully |
| Memory | Process large synonym sets efficiently |

### Expected Outcome
- Functional sync_synonyms method with comprehensive error handling
- Synonym data successfully synchronized with MeiliSearch
- Detailed logging and monitoring of sync operations
- Proper error recovery and retry mechanisms

### Verification Checklist
- [ ] sync_synonyms method signature defined correctly
- [ ] Database query retrieves all active synonyms
- [ ] Synonym format conversion to MeiliSearch structure
- [ ] MeiliSearch index update with error handling
- [ ] Retry logic implemented for network failures
- [ ] Sync status and metrics returned properly
- [ ] Comprehensive logging for sync operations
- [ ] Performance optimized for large synonym sets

---

## Summary

This document established the core search service and synonym management system for LankaCommerce Cloud ERP, including the SearchService with typo tolerance configuration, comprehensive Synonym model with database fields, and SynonymService for managing synonyms and synchronizing with MeiliSearch.

### Completed Tasks
1. ✓ Created SearchService class with MeiliSearch integration
2. ✓ Implemented search method with query processing and pagination
3. ✓ Configured typo tolerance for fuzzy matching capabilities
4. ✓ Set minWordSizeForTypos thresholds for optimal search accuracy
5. ✓ Created Synonym Django model for database storage
6. ✓ Implemented word field with unique constraints and indexing
7. ✓ Added synonyms JSONField for storing alternative terms
8. ✓ Created SynonymService for synonym management operations
9. ✓ Implemented add_synonym method with validation and error handling
10. ✓ Created sync_synonyms method for MeiliSearch synchronization

### Next Steps
Proceed to [02_Tasks-45-52_Filters-Facets-Highlight.md](02_Tasks-45-52_Filters-Facets-Highlight.md) to implement filter builder, faceted search, highlighting features, and complete search feature verification.