# Tasks 67-74: Search Logging and Pattern Learning

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** E - Learning System  
> **Document:** 01 of 02  
> **Tasks Covered:** 67, 68, 69, 70, 71, 72, 73, 74

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-75-78_Pending-Auto-Verify.md](02_Tasks-75-78_Pending-Auto-Verify.md)

---

## Document Overview

This document covers the implementation of search behavior logging and pattern learning capabilities for the Sinhaglish search system. It establishes the SearchLearning service, TransliterationLog model for tracking user search behavior, and PatternLearner for identifying new transliteration patterns from user interactions. These components enable the system to learn from user behavior and continuously improve search quality.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 67 | Create SearchLearning Service | Medium | 45 min |
| 68 | Create TransliterationLog Model | Medium | 40 min |
| 69 | Create query Field | Low | 15 min |
| 70 | Create expanded Field | Low | 15 min |
| 71 | Create clicked_product FK | Low | 20 min |
| 72 | Create PatternLearner Class | High | 60 min |
| 73 | Create identify_patterns Method | High | 75 min |
| 74 | Create suggest_words Method | Medium | 50 min |

---

## Task 67: Create SearchLearning Service

### Overview
Create the SearchLearning service class that orchestrates the learning process from user search behavior. This service acts as the central coordinator for logging searches, tracking user interactions, and triggering pattern analysis. It provides the main interface for the search system to record user behavior and derive insights for continuous improvement.

### Dependencies
- Task 66: Complete search results integration
- Django models framework
- Search service infrastructure

### Instructions

1. **Create learning service file**
   - Navigate to `backend/apps/search/sinhaglish/services/` directory
   - Create new file named `learning.py`
   - This file will contain all learning-related service classes

2. **Import required dependencies**
   - Import Django model utilities
   - Import timezone utilities for timestamp handling
   - Import typing utilities for type hints
   - Import database query utilities (Q, F, Count, etc.)

3. **Define SearchLearning class**
   - Create class named `SearchLearning`
   - Add docstring explaining the service purpose
   - Define class as singleton or utility class pattern

4. **Add initialization method**
   - Define `__init__` method if stateful
   - Initialize any required configuration
   - Set up references to related services

5. **Create log_search method**
   - Method signature: `log_search(query, expanded_query, customer, results_count, found_match)`
   - Accept original query, expanded query, customer reference, result count, and match status
   - Create TransliterationLog entry with provided data
   - Return created log instance

6. **Create log_click method**
   - Method signature: `log_click(log_id, product_id)`
   - Accept log entry ID and clicked product ID
   - Update TransliterationLog with clicked product reference
   - Mark timestamp of click event

7. **Create analyze_patterns method**
   - Method signature: `analyze_patterns(days=30)`
   - Trigger pattern identification process
   - Call PatternLearner to analyze recent logs
   - Return identified patterns and suggestions

8. **Add utility methods**
   - Create `get_recent_logs` method for retrieving logs within time period
   - Create `get_user_search_history` for individual user analysis
   - Create `get_popular_searches` for frequency analysis

9. **Implement error handling**
   - Add try-except blocks for database operations
   - Log errors appropriately
   - Ensure graceful degradation if logging fails

10. **Add logging and monitoring**
    - Log important operations (search logging, pattern analysis)
    - Track performance metrics
    - Record analysis outcomes

### Service Architecture

```
SearchLearning Service
├── log_search()
│   ├── Create TransliterationLog entry
│   ├── Record query details
│   └── Return log instance
│
├── log_click()
│   ├── Update log with product click
│   ├── Mark click timestamp
│   └── Save updated log
│
├── analyze_patterns()
│   ├── Retrieve recent logs
│   ├── Call PatternLearner
│   └── Return pattern insights
│
└── Utility Methods
    ├── get_recent_logs()
    ├── get_user_search_history()
    └── get_popular_searches()
```

### Method Specifications

| Method | Parameters | Return Type | Purpose |
|--------|------------|-------------|---------|
| log_search | query, expanded_query, customer, results_count, found_match | TransliterationLog | Record search event |
| log_click | log_id, product_id | TransliterationLog | Record product click |
| analyze_patterns | days=30 | Dict[patterns, suggestions] | Trigger analysis |
| get_recent_logs | days=30, customer=None | QuerySet | Retrieve logs |
| get_popular_searches | days=30, limit=50 | List[Dict] | Get frequent searches |

### Learning Flow Integration

```
Search Request
      │
      ▼
SearchService.search()
      │
      ├─► SearchLearning.log_search()
      │   └─► Create TransliterationLog
      │
      ▼
Return Results to User
      │
      ▼
User Clicks Product
      │
      ▼
SearchLearning.log_click()
      └─► Update log with clicked_product
      
      (Later, scheduled task)
      │
      ▼
SearchLearning.analyze_patterns()
      └─► PatternLearner.identify_patterns()
```

### Error Handling Strategy

| Error Type | Handling Approach |
|------------|-------------------|
| Database Error | Log error, return None, continue search |
| Invalid Product ID | Log warning, skip click logging |
| Missing Customer | Log anonymously (customer=None) |
| Analysis Failure | Log error, alert admin, retry later |

### Performance Considerations

| Aspect | Strategy |
|--------|----------|
| Logging Speed | Asynchronous logging using Celery |
| Database Load | Batch inserts when possible |
| Query Optimization | Index on timestamp, query fields |
| Analysis Timing | Run during off-peak hours |

### Expected Outcome
- Functional SearchLearning service class
- Methods for logging searches and clicks
- Integration point for pattern analysis
- Robust error handling and logging
- Foundation for continuous learning

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/services/learning.py` file created
- [ ] SearchLearning class defined
- [ ] log_search method implemented
- [ ] log_click method implemented
- [ ] analyze_patterns method implemented
- [ ] Utility methods created
- [ ] Error handling implemented
- [ ] Logging and monitoring added
- [ ] Type hints used throughout
- [ ] Docstrings provided for all methods

---

## Task 68: Create TransliterationLog Model

### Overview
Create the TransliterationLog Django model to persist user search behavior data. This model captures comprehensive information about each search query, including the original romanized input, expanded transliteration output, search results, and user interactions. The data enables pattern analysis and continuous improvement of the transliteration dictionary.

### Dependencies
- Task 67: Create SearchLearning Service
- Django models framework
- Product and Customer models

### Instructions

1. **Create model file**
   - Navigate to `backend/apps/search/sinhaglish/models/` directory
   - Create new file named `transliteration_log.py`
   - Import Django model utilities and base classes

2. **Import required dependencies**
   - Import Django models and field types
   - Import timezone utilities
   - Import Customer model from accounts app
   - Import Product model from products app
   - Import any base model mixins

3. **Define TransliterationLog model class**
   - Create class inheriting from `models.Model`
   - Add comprehensive docstring explaining purpose
   - Define model meta options

4. **Add primary key field**
   - Use UUID or auto-incrementing ID
   - Set as primary key
   - Add db_index for performance

5. **Add core fields (Tasks 69-71)**
   - These will be implemented in separate tasks
   - Placeholder: query, expanded, clicked_product
   - Additional fields defined below

6. **Add customer foreign key**
   - Field name: `customer`
   - Foreign key to Customer model
   - Set null=True, blank=True for anonymous searches
   - Add on_delete=SET_NULL to preserve logs

7. **Add results metadata fields**
   - Field name: `results_count`
   - Type: IntegerField with default=0
   - Stores number of search results returned

8. **Add match indicator field**
   - Field name: `found_match`
   - Type: BooleanField with default=False
   - Indicates if query was successfully transliterated

9. **Add timestamp fields**
   - Field name: `timestamp`
   - Type: DateTimeField with auto_now_add=True
   - Records when search occurred
   - Add `clicked_at` DateTimeField (null=True) for click timing

10. **Add session tracking field**
    - Field name: `session_key`
    - Type: CharField(max_length=40, null=True, blank=True)
    - Links searches within same session

11. **Configure model Meta**
    - Set table name: `search_transliteration_log`
    - Add ordering by `-timestamp` (newest first)
    - Add indexes on query, timestamp, customer
    - Set verbose names for admin interface

12. **Define __str__ method**
    - Return format: `{query} -> {expanded} [{timestamp}]`
    - Provide readable representation

13. **Add custom model methods**
    - Create `is_clicked` property (returns bool if clicked_product exists)
    - Create `time_to_click` method (calculates duration from search to click)
    - Create `was_successful` method (returns True if found_match and is_clicked)

14. **Set up data retention**
    - Add database constraint or management command
    - Configure automatic deletion after 90 days
    - Consider archiving for analytics

15. **Register model in __init__.py**
    - Add import to `models/__init__.py`
    - Make model accessible from package level

### Model Structure

```
TransliterationLog
├── id (Primary Key)
├── query (CharField) ──────────────► [Task 69]
├── expanded (TextField) ───────────► [Task 70]
├── clicked_product (FK) ───────────► [Task 71]
├── customer (FK, nullable)
├── results_count (IntegerField)
├── found_match (BooleanField)
├── timestamp (DateTimeField)
├── clicked_at (DateTimeField, nullable)
└── session_key (CharField, nullable)
```

### Field Specifications

| Field | Type | Constraints | Purpose |
|-------|------|-------------|---------|
| id | UUID/BigAutoField | Primary Key | Unique identifier |
| customer | ForeignKey | nullable, SET_NULL | User reference |
| results_count | IntegerField | default=0 | Result count |
| found_match | BooleanField | default=False | Match indicator |
| timestamp | DateTimeField | auto_now_add | Search time |
| clicked_at | DateTimeField | nullable | Click time |
| session_key | CharField(40) | nullable | Session tracking |

### Database Indexes

| Index Name | Fields | Purpose |
|------------|--------|---------|
| idx_query | query | Fast query lookup |
| idx_timestamp | timestamp | Time-based filtering |
| idx_customer | customer | User history queries |
| idx_query_timestamp | query, timestamp | Combined filtering |

### Model Meta Configuration

```
Meta Options
├── db_table = 'search_transliteration_log'
├── ordering = ['-timestamp']
├── indexes = [query, timestamp, customer]
├── verbose_name = 'Transliteration Log'
└── verbose_name_plural = 'Transliteration Logs'
```

### Custom Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| is_clicked | bool | True if product was clicked |
| time_to_click | timedelta | Duration from search to click |
| was_successful | bool | True if matched and clicked |

### Data Retention Policy

| Aspect | Configuration |
|--------|---------------|
| Retention Period | 90 days |
| Cleanup Method | Celery periodic task |
| Schedule | Daily at 2:00 AM |
| Archiving | Optional: export to data warehouse |

### Privacy Considerations

| Concern | Mitigation |
|---------|------------|
| User Privacy | Allow null customer (anonymous) |
| Data Minimization | Only log essential fields |
| Retention Limit | Auto-delete after 90 days |
| Access Control | Admin-only access |

### Expected Outcome
- Functional TransliterationLog model
- Comprehensive field structure for logging
- Proper indexes for query performance
- Custom methods for analysis
- Data retention policy configured

### Verification Checklist
- [ ] `transliteration_log.py` file created
- [ ] TransliterationLog model class defined
- [ ] All fields defined (except those in Tasks 69-71)
- [ ] Foreign keys properly configured
- [ ] Indexes added for performance
- [ ] Model Meta configured correctly
- [ ] __str__ method implemented
- [ ] Custom methods created
- [ ] Model registered in __init__.py
- [ ] Data retention strategy documented

---

## Task 69: Create query Field

### Overview
Add the query field to the TransliterationLog model to store the original romanized search query entered by the user. This field captures the exact user input before any transliteration processing, enabling analysis of raw search patterns and identification of new romanization conventions.

### Dependencies
- Task 68: Create TransliterationLog Model

### Instructions

1. **Open TransliterationLog model**
   - Navigate to `backend/apps/search/sinhaglish/models/transliteration_log.py`
   - Locate the TransliterationLog class definition

2. **Add query field definition**
   - Add field after id/primary key field
   - Field name: `query`
   - Field type: `CharField`
   - Set max_length to 255 characters

3. **Configure field constraints**
   - Set blank=False (required field)
   - Set null=False (database constraint)
   - No default value (must be provided)

4. **Add database index**
   - Set db_index=True for fast lookups
   - Critical for pattern analysis queries
   - Enables efficient filtering by query text

5. **Add field help text**
   - Set help_text parameter
   - Text: "Original romanized search query entered by user"
   - Provides documentation in admin interface

6. **Add field validation**
   - Consider adding custom validator for length
   - Strip whitespace in pre-save signal
   - Normalize case if needed (lowercase for consistency)

7. **Update model migrations**
   - Create Django migration after adding field
   - Run makemigrations command
   - Review generated migration file

8. **Update __str__ method**
   - Ensure query field is included in string representation
   - Format: `{query} -> {expanded} [{timestamp}]`

9. **Add query property methods**
   - Create `normalized_query` property (lowercase, stripped)
   - Create `query_length` property for analytics

### Field Specification

| Attribute | Value | Rationale |
|-----------|-------|-----------|
| Field Type | CharField | Text storage with length limit |
| Max Length | 255 | Accommodates typical queries |
| Blank | False | Query is mandatory |
| Null | False | Database constraint |
| DB Index | True | Fast query performance |
| Help Text | "Original romanized..." | Admin documentation |

### Query Field Purpose

```
User Input: "peni kadala"
      │
      ▼
Store in query field ────► TransliterationLog.query = "peni kadala"
      │
      ▼
Used for:
├── Pattern analysis
├── Frequency counting
├── New word identification
└── Search history display
```

### Database Schema

```sql
ALTER TABLE search_transliteration_log
ADD COLUMN query VARCHAR(255) NOT NULL;

CREATE INDEX idx_transliteration_log_query
ON search_transliteration_log(query);
```

### Query Normalization

| Input | Normalized | Action |
|-------|------------|--------|
| " peni kadala " | "peni kadala" | Strip whitespace |
| "Peni Kadala" | "peni kadala" | Lowercase |
| "peni  kadala" | "peni kadala" | Collapse spaces |

### Analytics Use Cases

| Use Case | Query Pattern |
|----------|---------------|
| Most searched | `SELECT query, COUNT(*) ... GROUP BY query ORDER BY count DESC` |
| Unknown words | `SELECT query WHERE found_match=False` |
| Failed searches | `SELECT query WHERE results_count=0` |
| Popular terms | `SELECT query WHERE results_count > 10` |

### Expected Outcome
- query field added to TransliterationLog model
- Field properly indexed for performance
- Validation and normalization in place
- Migration generated and ready to apply
- Model methods updated to use query field

### Verification Checklist
- [ ] query field defined in model
- [ ] Field type is CharField with max_length=255
- [ ] db_index=True set for performance
- [ ] blank=False and null=False configured
- [ ] help_text provided
- [ ] Migration created successfully
- [ ] __str__ method includes query
- [ ] Property methods added for normalization
- [ ] Field appears in Django admin

---

## Task 70: Create expanded Field

### Overview
Add the expanded field to the TransliterationLog model to store the transliterated search query after Sinhaglish-to-English conversion. This field captures the output of the transliteration process, enabling comparison with the original query and analysis of transliteration accuracy and effectiveness.

### Dependencies
- Task 68: Create TransliterationLog Model
- Task 69: Create query Field

### Instructions

1. **Open TransliterationLog model**
   - Navigate to `backend/apps/search/sinhaglish/models/transliteration_log.py`
   - Locate the TransliterationLog class definition
   - Add field after query field

2. **Add expanded field definition**
   - Field name: `expanded`
   - Field type: `TextField` (not CharField - may be long)
   - Stores full transliteration output with all variations

3. **Configure field constraints**
   - Set blank=True (may be empty if no expansion)
   - Set null=True (NULL if transliteration failed)
   - Add default="" for consistency

4. **Add field help text**
   - Set help_text parameter
   - Text: "Expanded English translation of romanized query"
   - Provides context in admin interface

5. **Consider JSON storage option**
   - Alternative: Use JSONField if storing structured data
   - Can store multiple expansion variations
   - Allows storing confidence scores per expansion

6. **Add field indexing considerations**
   - TextField generally not indexed due to size
   - Consider adding GIN index for full-text search
   - PostgreSQL specific: add `db_index=True` with GIN

7. **Update model migrations**
   - Create Django migration after adding field
   - Run makemigrations command
   - Review migration for TextField handling

8. **Add expanded property methods**
   - Create `expansion_length` property
   - Create `expansion_ratio` property (expanded/query length)
   - Create `has_expansion` property (bool)

9. **Update admin display**
   - Add expanded to list_display in admin
   - Truncate long values in list view
   - Show full value in detail view

### Field Specification

| Attribute | Value | Rationale |
|-----------|-------|-----------|
| Field Type | TextField | Variable length, can be long |
| Blank | True | May be empty |
| Null | True | NULL if no expansion |
| Default | "" | Empty string fallback |
| DB Index | False/GIN | TextField index strategy |
| Help Text | "Expanded English..." | Admin documentation |

### Expanded Field Purpose

```
Original Query: "peni kadala"
      │
      ▼
Transliteration Process
      │
      ▼
Expanded: "brown chickpeas chickpea lentils"
      │
      ▼
Store in expanded field ────► TransliterationLog.expanded
      │
      ▼
Used for:
├── Accuracy analysis
├── Expansion effectiveness
├── Alternative term discovery
└── Debugging transliteration
```

### Query vs Expanded Comparison

| Query (Input) | Expanded (Output) | Result |
|---------------|-------------------|--------|
| "peni kadala" | "brown chickpeas lentils" | Successful |
| "xyz123" | "" | No expansion |
| "rice" | "rice" | Passthrough (already English) |
| "basmati" | "basmati rice" | Enriched |

### Expansion Analysis

| Metric | Calculation | Purpose |
|--------|-------------|---------|
| Expansion Ratio | len(expanded) / len(query) | Measure growth |
| Token Count | len(expanded.split()) | Word additions |
| Has Expansion | expanded != query | Success indicator |

### Storage Considerations

```
TextField (Chosen)
└── Pros: Simple, flexible length
└── Cons: No indexing, no structure

vs

JSONField (Alternative)
└── Pros: Structured, multiple variations
└── Cons: More complex queries
    Example: {"terms": ["brown chickpeas", "lentils"], "confidence": 0.85}
```

### Expected Outcome
- expanded field added to TransliterationLog model
- Field accommodates variable-length output
- NULL handling for failed expansions
- Property methods for analysis
- Migration generated successfully

### Verification Checklist
- [ ] expanded field defined in model
- [ ] Field type is TextField
- [ ] blank=True and null=True configured
- [ ] help_text provided
- [ ] Migration created successfully
- [ ] Property methods added (expansion_length, has_expansion)
- [ ] Admin interface shows field appropriately
- [ ] Field handles empty/null values correctly

---

## Task 71: Create clicked_product FK

### Overview
Add the clicked_product foreign key field to the TransliterationLog model to track which product (if any) the user clicked after performing a search. This field establishes the critical link between search queries and user actions, enabling the learning system to identify successful search patterns and infer meaning from user behavior.

### Dependencies
- Task 68: Create TransliterationLog Model
- Task 69: Create query Field
- Task 70: Create expanded Field
- Product model exists

### Instructions

1. **Open TransliterationLog model**
   - Navigate to `backend/apps/search/sinhaglish/models/transliteration_log.py`
   - Locate the TransliterationLog class definition
   - Add field after expanded field

2. **Import Product model**
   - Add import at top of file
   - Import path: `from apps.products.models import Product`
   - Ensure products app is in INSTALLED_APPS

3. **Add clicked_product field definition**
   - Field name: `clicked_product`
   - Field type: `ForeignKey`
   - Target model: `Product`
   - Specify using string reference or direct import

4. **Configure foreign key parameters**
   - Set on_delete=SET_NULL (preserve log if product deleted)
   - Set null=True (no click initially)
   - Set blank=True (optional field)
   - Add related_name='search_logs' for reverse queries

5. **Add database index**
   - Set db_index=True for fast filtering
   - Enables quick "most clicked products" queries
   - Critical for learning analysis

6. **Add field help text**
   - Set help_text parameter
   - Text: "Product clicked by user after this search (if any)"
   - Documents relationship purpose

7. **Update model migrations**
   - Create Django migration after adding field
   - Run makemigrations command
   - Review foreign key constraint generation

8. **Add clicked product methods**
   - Create `has_click` property (returns bool)
   - Create `click_relevance` method (is clicked product relevant to query?)
   - Create `time_to_click` method (time between search and click)

9. **Update SearchLearning service**
   - Modify log_click method to update this field
   - Ensure atomic update with clicked_at timestamp
   - Add validation for product existence

10. **Consider additional click metadata**
    - Add `click_position` field (which position in results?)
    - Add `click_score` field (relevance score at click time)
    - Track if product was in top 5, top 10, etc.

### Field Specification

| Attribute | Value | Rationale |
|-----------|-------|-----------|
| Field Type | ForeignKey | Relationship to Product |
| Target Model | Product | Links to product catalog |
| on_delete | SET_NULL | Preserve logs if product deleted |
| Null | True | Not all searches result in clicks |
| Blank | True | Optional field |
| Related Name | 'search_logs' | Reverse query access |
| DB Index | True | Performance for analysis |

### Foreign Key Relationship

```
TransliterationLog ──────► Product
       │                      │
       │ clicked_product      │
       │ (FK, nullable)       │
       │                      │
       └──────────────────────┘

Reverse Query:
product.search_logs.all()  ──► All searches that clicked this product
```

### Click Tracking Flow

```
User performs search
      │
      ▼
TransliterationLog created
      │ (clicked_product = NULL)
      ▼
User views results
      │
      ▼
User clicks product
      │
      ▼
Update log entry:
├── clicked_product = Product(id=X)
├── clicked_at = timezone.now()
└── Save to database
```

### Learning Signal Strength

| Scenario | clicked_product | Interpretation |
|----------|-----------------|----------------|
| NULL | NULL | No click (abandoned search) |
| Set, quick | Product ID | Strong relevance signal |
| Set, delayed | Product ID | Moderate relevance |
| Multiple logs, same product | Product ID | Pattern confirmation |

### Analytics Queries

| Analysis | Query Pattern |
|----------|---------------|
| Most clicked products | `Product.objects.annotate(clicks=Count('search_logs'))` |
| Clickthrough rate | `logs_with_clicks / total_logs` |
| Query-to-product mapping | `Group by query, clicked_product` |
| Successful patterns | `WHERE clicked_product IS NOT NULL` |

### Click Metadata (Optional)

| Field | Type | Purpose |
|-------|------|---------|
| click_position | IntegerField | Position in result list (1-based) |
| click_score | FloatField | Relevance score at click |
| in_top_5 | BooleanField | Clicked product in top 5 results |

### Expected Outcome
- clicked_product FK field added to model
- Relationship to Product model established
- NULL handling for unclicked searches
- Property methods for click analysis
- Migration generated and ready

### Verification Checklist
- [ ] clicked_product field defined in model
- [ ] Field type is ForeignKey to Product
- [ ] on_delete=SET_NULL configured
- [ ] null=True and blank=True set
- [ ] related_name='search_logs' configured
- [ ] db_index=True for performance
- [ ] Product model imported correctly
- [ ] Migration created successfully
- [ ] has_click property method added
- [ ] time_to_click method implemented
- [ ] SearchLearning.log_click updated to use field

---

## Task 72: Create PatternLearner Class

### Overview
Create the PatternLearner class responsible for analyzing TransliterationLog data to identify patterns indicating new or missing Sinhaglish-to-English transliterations. This sophisticated analysis engine examines user search behavior, click patterns, and query frequencies to discover gaps in the current dictionary and suggest new word mappings based on real usage.

### Dependencies
- Task 71: Create clicked_product FK
- TransliterationLog model complete
- SearchLearning service exists

### Instructions

1. **Add PatternLearner to learning.py**
   - Open `backend/apps/search/sinhaglish/services/learning.py`
   - Add PatternLearner class below SearchLearning

2. **Import required dependencies**
   - Import Django ORM utilities (Q, F, Count, Avg, etc.)
   - Import datetime and timezone utilities
   - Import collections utilities (Counter, defaultdict)
   - Import typing utilities for type hints
   - Import TransliterationLog model

3. **Define PatternLearner class**
   - Create class named `PatternLearner`
   - Add comprehensive docstring explaining purpose
   - Define as utility class or instantiable service

4. **Add initialization method**
   - Define `__init__` method
   - Accept configuration parameters (thresholds, time windows)
   - Initialize internal state for pattern tracking

5. **Define pattern detection logic**
   - Identify "unknown word" signals: no expansion but product clicked
   - Identify "consistent pattern" signals: repeated query with same click
   - Identify "high frequency" signals: popular terms without dictionary entry
   - Identify "user corrections" signals: similar queries with different outcomes

6. **Create pattern analysis workflow**
   - Step 1: Gather relevant logs from specified time period
   - Step 2: Filter logs based on learning criteria
   - Step 3: Group similar queries together
   - Step 4: Analyze click patterns for each group
   - Step 5: Score patterns by confidence and frequency
   - Step 6: Extract potential new words

7. **Add configuration properties**
   - Minimum frequency threshold (default: 5 occurrences)
   - Minimum click consistency (default: 60% same product)
   - Time window for analysis (default: 30 days)
   - Minimum distinct users (default: 3 users)

8. **Implement query similarity detection**
   - Use string similarity algorithms (Levenshtein, Jaro-Winkler)
   - Group queries with similarity > 80%
   - Handle typos and variations

9. **Add confidence scoring system**
   - Score based on frequency (more = higher confidence)
   - Score based on click consistency (same product = higher)
   - Score based on distinct users (more users = higher)
   - Score based on result counts (no results = strong signal)
   - Combine scores into overall confidence (0-100)

10. **Create pattern result structure**
    - Define dataclass or dict structure for patterns
    - Include: query, frequency, clicked_products, confidence_score
    - Include: suggested_english, evidence_logs

11. **Add logging and diagnostics**
    - Log pattern detection process
    - Track analysis statistics
    - Record discovered patterns for review

### PatternLearner Architecture

```
PatternLearner
├── __init__(config)
│   └── Initialize thresholds
│
├── identify_patterns(days) ──────► [Task 73]
│   ├── Gather logs
│   ├── Apply filters
│   ├── Group similar queries
│   ├── Analyze patterns
│   └── Score confidence
│
├── suggest_words(patterns) ───────► [Task 74]
│   ├── Extract candidates
│   ├── Infer English meaning
│   ├── Create PendingWord entries
│   └── Return suggestions
│
└── Helper Methods
    ├── _similarity_score(q1, q2)
    ├── _group_similar_queries(logs)
    ├── _calculate_confidence(pattern)
    └── _infer_meaning(pattern)
```

### Learning Signals

| Signal | Detection Criteria | Confidence Weight |
|--------|-------------------|-------------------|
| Unknown Word | expanded empty, clicked_product set | High (0.8) |
| Consistent Pattern | Same query → same product (3+ times) | High (0.85) |
| High Frequency | Query count > threshold, no expansion | Medium (0.6) |
| Multiple Users | 5+ distinct users, same behavior | Very High (0.9) |
| Zero Results | results_count = 0, but clicked product | Medium (0.65) |

### Pattern Detection Flow

```
Query TransliterationLogs (30 days)
      │
      ▼
Filter: found_match=False OR results_count < 5
      │
      ▼
Group similar queries
      │
      ├─► Group 1: ["peni kadala", "penikadala", "peni-kadala"]
      │        └─► Frequency: 47, Distinct users: 12
      │
      ├─► Group 2: ["pol sambol", "polsambol"]
      │        └─► Frequency: 38, Distinct users: 9
      │
      └─► Group 3: ["gotukola", "gotu kola"]
               └─► Frequency: 22, Distinct users: 6
      │
      ▼
Analyze click patterns per group
      │
      ├─► Group 1 → Product "Brown Chickpeas" (85% of clicks)
      ├─► Group 2 → Product "Coconut Sambol" (78% of clicks)
      └─► Group 3 → Product "Gotu Kola Leaves" (90% of clicks)
      │
      ▼
Calculate confidence scores
      │
      ├─► Pattern 1: confidence=0.88 (high frequency + consistency)
      ├─► Pattern 2: confidence=0.81
      └─► Pattern 3: confidence=0.86
      │
      ▼
Return ranked patterns
```

### Similarity Grouping

| Query 1 | Query 2 | Similarity | Group |
|---------|---------|------------|-------|
| "peni kadala" | "penikadala" | 95% | Same |
| "peni kadala" | "peni kadalaa" | 92% | Same |
| "peni kadala" | "pol sambol" | 15% | Different |
| "gotukola" | "gotu kola" | 90% | Same |

### Confidence Calculation

```
Base Confidence = 0.5

+ Frequency Score:
  - 5-10 occurrences: +0.1
  - 11-20 occurrences: +0.15
  - 21-50 occurrences: +0.20
  - 50+ occurrences: +0.25

+ Click Consistency Score:
  - 60-70% same product: +0.10
  - 71-80% same product: +0.15
  - 81-90% same product: +0.20
  - 91-100% same product: +0.25

+ User Diversity Score:
  - 3-5 distinct users: +0.05
  - 6-10 distinct users: +0.10
  - 11+ distinct users: +0.15

+ Zero Results Bonus:
  - results_count = 0: +0.10

= Final Confidence (0.0 - 1.0)
```

### Configuration Parameters

| Parameter | Default | Purpose |
|-----------|---------|---------|
| min_frequency | 5 | Minimum query occurrences |
| min_click_rate | 0.60 | Minimum click consistency |
| analysis_days | 30 | Time window for logs |
| min_users | 3 | Minimum distinct users |
| similarity_threshold | 0.80 | Query grouping threshold |
| max_patterns | 100 | Maximum patterns to return |

### Expected Outcome
- Functional PatternLearner class
- Configuration system for thresholds
- Foundation for pattern identification
- Similarity detection logic
- Confidence scoring algorithm
- Structured pattern output

### Verification Checklist
- [ ] PatternLearner class defined in learning.py
- [ ] __init__ method with configuration
- [ ] Helper methods for similarity detection
- [ ] Confidence scoring system implemented
- [ ] Learning signal detection logic defined
- [ ] Pattern result structure defined
- [ ] Logging and diagnostics added
- [ ] Type hints throughout
- [ ] Comprehensive docstrings
- [ ] Configuration parameters documented

---

## Task 73: Create identify_patterns Method

### Overview
Implement the identify_patterns method in the PatternLearner class to perform the actual analysis of TransliterationLog data and extract potential new transliteration patterns. This method orchestrates the complete pattern detection workflow, from log retrieval through similarity grouping to confidence scoring, returning a structured list of discovered patterns ready for review.

### Dependencies
- Task 72: Create PatternLearner Class
- All TransliterationLog fields complete

### Instructions

1. **Define method signature**
   - Open `backend/apps/search/sinhaglish/services/learning.py`
   - Locate PatternLearner class
   - Add `identify_patterns` method with `days=30` parameter

2. **Set up return type**
   - Define return type: `List[Dict[str, Any]]`
   - Each dict represents one discovered pattern
   - Include all necessary pattern metadata

3. **Step 1: Retrieve relevant logs**
   - Query TransliterationLog for past N days
   - Filter timestamp >= (now - days)
   - Apply learning criteria filters

4. **Define learning criteria filters**
   - Include: `found_match=False` (no transliteration found)
   - Include: `results_count < 5` (poor results)
   - Include: `clicked_product__isnull=False` (user found something)
   - Exclude: queries already in dictionary
   - Exclude: single-character queries
   - Exclude: purely numeric queries

5. **Step 2: Group similar queries**
   - Extract all query strings from filtered logs
   - Use similarity detection algorithm
   - Create groups of similar queries (>80% similarity)
   - Store group membership mapping

6. **Implement similarity algorithm**
   - Use Levenshtein distance or Jaro-Winkler
   - Normalize queries (lowercase, strip, collapse spaces)
   - Calculate pairwise similarity
   - Use clustering or greedy grouping
   - Return dict: {canonical_query: [similar_queries]}

7. **Step 3: Analyze each query group**
   - Iterate through query groups
   - For each group, gather statistics:
     - Total frequency (sum of all occurrences)
     - Distinct user count
     - Clicked products distribution
     - Average results count
     - Time range (first to last occurrence)

8. **Calculate click consistency**
   - Count clicks per product for the group
   - Find most-clicked product
   - Calculate percentage: most_clicks / total_clicks
   - Identify if click pattern is consistent (>60%)

9. **Step 4: Score pattern confidence**
   - Apply confidence calculation algorithm (from Task 72)
   - Combine frequency, consistency, user diversity
   - Add bonus for zero results + click
   - Normalize score to 0-100 scale

10. **Apply filtering thresholds**
    - Filter patterns by min_frequency (default: 5)
    - Filter by min_click_rate (default: 0.60)
    - Filter by min_users (default: 3)
    - Filter by min_confidence (default: 0.50)

11. **Step 5: Build pattern results**
    - For each qualifying pattern, create result dict
    - Include: canonical_query, variants, frequency
    - Include: clicked_products (with counts), primary_product
    - Include: confidence_score, distinct_users
    - Include: evidence_log_ids for traceability

12. **Sort and limit results**
    - Sort patterns by confidence score (descending)
    - Limit to top N patterns (default: 100)
    - Prioritize high-confidence, high-frequency patterns

13. **Add logging and metrics**
    - Log analysis start and completion
    - Log number of logs analyzed
    - Log number of patterns discovered
    - Log filtering statistics

14. **Handle edge cases**
    - Empty result set (no logs in period)
    - No patterns meeting thresholds
    - Database errors during analysis
    - Performance for large log volumes

15. **Return results**
    - Return list of pattern dicts
    - Ensure consistent structure
    - Include metadata (analysis_date, days_analyzed)

### Method Signature

```python
def identify_patterns(self, days: int = 30) -> List[Dict[str, Any]]:
    """
    Analyze TransliterationLog data to identify new transliteration patterns.
    
    Args:
        days: Number of days to look back for log analysis (default: 30)
    
    Returns:
        List of pattern dicts with query, frequency, products, confidence
    """
```

### Pattern Result Structure

```python
{
    "canonical_query": "peni kadala",
    "variants": ["penikadala", "peni-kadala", "peni kadala"],
    "frequency": 47,
    "distinct_users": 12,
    "clicked_products": [
        {"product_id": 123, "name": "Brown Chickpeas", "click_count": 40},
        {"product_id": 456, "name": "Lentils", "click_count": 7}
    ],
    "primary_product": {"product_id": 123, "name": "Brown Chickpeas"},
    "click_consistency": 0.85,  # 40/47
    "confidence_score": 0.88,
    "average_results": 2.3,
    "evidence_log_ids": [101, 102, 103, ...],
    "first_seen": "2026-01-01T10:30:00Z",
    "last_seen": "2026-01-30T15:45:00Z"
}
```

### Analysis Workflow

```
identify_patterns(days=30) called
      │
      ▼
[1] Query logs (timestamp >= now - 30 days)
      │ Result: 5,432 logs
      ▼
[2] Apply filters (found_match=False, clicked_product set)
      │ Result: 847 logs
      ▼
[3] Extract unique queries
      │ Result: 234 unique queries
      ▼
[4] Group similar queries
      │ Result: 87 query groups
      ▼
[5] Analyze each group
      ├─► Group 1: "peni kadala" (47 occurrences)
      │        ├─► Users: 12
      │        ├─► Primary product: Brown Chickpeas (85%)
      │        └─► Confidence: 0.88
      │
      ├─► Group 2: "pol sambol" (38 occurrences)
      │        ├─► Users: 9
      │        ├─► Primary product: Coconut Sambol (78%)
      │        └─► Confidence: 0.81
      │
      └─► ... (85 more groups)
      │
      ▼
[6] Apply thresholds (freq≥5, users≥3, confidence≥0.5)
      │ Result: 52 patterns pass
      ▼
[7] Sort by confidence (descending)
      │
      ▼
[8] Return top 100 patterns
      │
      ▼
Return: List[Dict] (52 patterns)
```

### Filtering Logic

```python
# Initial query
logs = TransliterationLog.objects.filter(
    timestamp__gte=cutoff_date
).select_related('clicked_product', 'customer')

# Learning criteria
logs = logs.filter(
    Q(found_match=False) |  # No transliteration
    Q(results_count__lt=5)  # Poor results
).filter(
    clicked_product__isnull=False  # But user found something
).exclude(
    query__regex=r'^\d+$'  # Exclude pure numbers
).exclude(
    query__length__lt=2  # Exclude single char
)
```

### Similarity Grouping Algorithm

```
Input: ["peni kadala", "penikadala", "peni-kadala", "pol sambol"]
      │
      ▼
Normalize: ["peni kadala", "penikadala", "peni kadala", "pol sambol"]
      │
      ▼
Calculate similarities:
- "peni kadala" vs "penikadala": 0.95
- "peni kadala" vs "peni kadala": 1.00
- "peni kadala" vs "pol sambol": 0.12
- "penikadala" vs "pol sambol": 0.10
      │
      ▼
Group (threshold=0.80):
- Group A: ["peni kadala", "penikadala", "peni-kadala"]
- Group B: ["pol sambol"]
      │
      ▼
Output: {
    "peni kadala": ["peni kadala", "penikadala", "peni-kadala"],
    "pol sambol": ["pol sambol"]
}
```

### Performance Optimization

| Strategy | Implementation |
|----------|----------------|
| Index usage | Ensure query, timestamp indexed |
| Batch processing | Process in chunks of 1000 logs |
| Query optimization | Use select_related, prefetch_related |
| Caching | Cache dictionary lookup results |
| Time limiting | Set query timeout for large datasets |

### Expected Outcome
- Functional identify_patterns method
- Complete analysis workflow implemented
- Pattern discovery from log data
- Confidence scoring applied
- Filtered, sorted results returned
- Comprehensive logging and error handling

### Verification Checklist
- [ ] identify_patterns method defined with correct signature
- [ ] Days parameter accepted and used correctly
- [ ] Log retrieval query implemented
- [ ] Learning criteria filters applied
- [ ] Similarity grouping algorithm implemented
- [ ] Pattern analysis per group completed
- [ ] Confidence scoring integrated
- [ ] Threshold filtering applied
- [ ] Results sorted by confidence
- [ ] Pattern result structure matches specification
- [ ] Logging and metrics added
- [ ] Edge cases handled
- [ ] Return type correctly typed
- [ ] Method docstring complete

---

## Task 74: Create suggest_words Method

### Overview
Implement the suggest_words method in the PatternLearner class to convert identified patterns into concrete word suggestions ready for dictionary addition. This method takes patterns discovered by identify_patterns, infers the English meaning from clicked products and context, and creates structured suggestions that can be reviewed and approved by administrators.

### Dependencies
- Task 73: Create identify_patterns Method
- Task 72: Create PatternLearner Class
- Product model with name/description fields

### Instructions

1. **Define method signature**
   - Add `suggest_words` method to PatternLearner class
   - Accept `patterns` parameter (output from identify_patterns)
   - Optional parameter: `auto_create_pending=True`

2. **Set up return type**
   - Return type: `List[Dict[str, Any]]`
   - Each dict represents a word suggestion
   - Structure ready for PendingWord model creation

3. **Step 1: Validate input patterns**
   - Check patterns list is not empty
   - Validate each pattern has required fields
   - Skip malformed patterns with warning

4. **Step 2: Process each pattern**
   - Iterate through patterns list
   - For each pattern, extract suggestion data
   - Build suggestion dict structure

5. **Extract romanized term**
   - Use canonical_query as romanized form
   - Normalize: lowercase, strip whitespace
   - Handle variants (store in metadata)

6. **Infer English meaning**
   - Primary source: clicked product names
   - Use primary_product name as base
   - Extract common words from all clicked products
   - Clean and normalize product names

7. **Implement English inference algorithm**
   - Get primary product name (most clicked)
   - Remove brand names and qualifiers
   - Extract core descriptive words
   - Handle multi-product scenarios (combine terms)
   - Example: "Brown Chickpeas 500g" → "brown chickpeas"

8. **Calculate suggestion confidence**
   - Use pattern confidence_score as base
   - Adjust based on product name clarity
   - Higher if single dominant product (>80% clicks)
   - Lower if multiple competing products

9. **Build suggestion structure**
   - romanized: normalized query
   - suggested_english: inferred English meaning
   - frequency: pattern frequency
   - confidence: calculated confidence score
   - source_queries: list of variant queries
   - clicked_products: product reference data
   - evidence_log_ids: traceability

10. **Add metadata**
    - analysis_date: when analysis performed
    - distinct_users: number of unique users
    - click_consistency: how consistent clicks are
    - recommended_action: AUTO_ADD, REVIEW, or REJECT

11. **Determine recommended action**
    - AUTO_ADD if: confidence > 0.80, frequency > 50, consistency > 0.80
    - REVIEW if: confidence > 0.50, frequency > 5
    - REJECT if: confidence < 0.50 or suspicious patterns

12. **Optional: Create PendingWord entries**
    - If auto_create_pending=True
    - Import PendingWord model
    - Create database entry for each suggestion
    - Set status=PENDING
    - Handle duplicates (update existing)

13. **Filter and deduplicate**
    - Remove suggestions for existing dictionary words
    - Check against current Sinhaglish mappings
    - Deduplicate similar suggestions
    - Keep highest confidence version

14. **Sort suggestions**
    - Sort by confidence (descending)
    - Then by frequency (descending)
    - Prioritize actionable suggestions

15. **Return suggestions list**
    - Return list of suggestion dicts
    - Include summary metadata
    - Log suggestion count and recommendations

### Method Signature

```python
def suggest_words(
    self,
    patterns: List[Dict[str, Any]],
    auto_create_pending: bool = True
) -> List[Dict[str, Any]]:
    """
    Convert identified patterns into word suggestions for dictionary addition.
    
    Args:
        patterns: List of patterns from identify_patterns()
        auto_create_pending: Create PendingWord entries automatically
    
    Returns:
        List of word suggestion dicts ready for review/approval
    """
```

### Suggestion Result Structure

```python
{
    "romanized": "peni kadala",
    "suggested_english": "brown chickpeas",
    "confidence": 0.88,
    "frequency": 47,
    "distinct_users": 12,
    "click_consistency": 0.85,
    "source_queries": ["peni kadala", "penikadala", "peni-kadala"],
    "clicked_products": [
        {"id": 123, "name": "Brown Chickpeas 500g", "clicks": 40},
        {"id": 456, "name": "Chickpea Lentils", "clicks": 7}
    ],
    "evidence_log_ids": [101, 102, 103, ...],
    "recommended_action": "AUTO_ADD",  # or "REVIEW" or "REJECT"
    "reasoning": "High confidence and frequency with consistent clicks",
    "analysis_date": "2026-01-31T10:00:00Z"
}
```

### English Inference Algorithm

```
Pattern: {"canonical_query": "peni kadala", "primary_product": "Brown Chickpeas 500g"}
      │
      ▼
[1] Extract primary product name: "Brown Chickpeas 500g"
      │
      ▼
[2] Clean product name:
      ├─► Remove sizes: "Brown Chickpeas"
      ├─► Remove brands: "Brown Chickpeas"
      └─► Lowercase: "brown chickpeas"
      │
      ▼
[3] Check other clicked products:
      ├─► Product 2: "Chickpea Lentils" → "chickpea lentils"
      └─► Product 3: "Brown Chickpeas Organic" → "brown chickpeas organic"
      │
      ▼
[4] Find common terms: ["chickpea", "chickpeas", "brown"]
      │
      ▼
[5] Build suggested English: "brown chickpeas"
      │
      ▼
Output: suggested_english = "brown chickpeas"
```

### Product Name Cleaning

| Raw Product Name | Cleaned English | Removal Actions |
|------------------|-----------------|-----------------|
| "Brown Chickpeas 500g" | "brown chickpeas" | Remove size |
| "SunRise Rice 1kg" | "rice" | Remove brand, size |
| "Coconut Sambol (Hot)" | "coconut sambol" | Remove qualifiers |
| "Gotu Kola Leaves Fresh" | "gotu kola leaves" | Remove freshness |

### Recommended Action Logic

```
if confidence > 0.80 AND frequency > 50 AND click_consistency > 0.80:
    recommended_action = "AUTO_ADD"
    reasoning = "High confidence, high frequency, consistent clicks"

elif confidence > 0.50 AND frequency > 5:
    recommended_action = "REVIEW"
    reasoning = "Good confidence, needs admin verification"

else:
    recommended_action = "REJECT"
    reasoning = "Low confidence or insufficient data"
```

### Recommendation Criteria

| Action | Confidence | Frequency | Consistency | Description |
|--------|------------|-----------|-------------|-------------|
| AUTO_ADD | >0.80 | >50 | >0.80 | Very strong signal |
| REVIEW | >0.50 | >5 | >0.60 | Good signal, verify |
| REJECT | <0.50 | <5 | <0.60 | Weak signal |

### Suggestion Processing Flow

```
Input: patterns from identify_patterns() (52 patterns)
      │
      ▼
[1] Validate patterns
      │ Valid: 52, Invalid: 0
      ▼
[2] Process each pattern
      │
      ├─► Pattern 1: "peni kadala"
      │        ├─► Infer English: "brown chickpeas"
      │        ├─► Confidence: 0.88
      │        ├─► Recommend: AUTO_ADD
      │        └─► Create suggestion dict
      │
      ├─► Pattern 2: "pol sambol"
      │        ├─► Infer English: "coconut sambol"
      │        ├─► Confidence: 0.81
      │        ├─► Recommend: REVIEW
      │        └─► Create suggestion dict
      │
      └─► ... (50 more patterns)
      │
      ▼
[3] Filter existing dictionary words
      │ Removed: 8 (already in dictionary)
      ▼
[4] Deduplicate similar suggestions
      │ Removed: 3 (duplicates)
      ▼
[5] Sort by confidence + frequency
      │
      ▼
[6] Create PendingWord entries (if enabled)
      │ Created: 41 pending words
      ▼
Return: 41 suggestions
```

### Deduplication Strategy

| Suggestion 1 | Suggestion 2 | Similarity | Action |
|--------------|--------------|------------|--------|
| "peni kadala" → "brown chickpeas" | "penikadala" → "brown chickpeas" | Same English | Keep higher confidence |
| "gotukola" → "gotu kola" | "gotu kola" → "gotu kola" | Same romanized | Merge as variants |
| "rice" → "rice" | <existing> | In dictionary | Skip |

### Expected Outcome
- Functional suggest_words method
- English meaning inference from products
- Structured suggestion output
- Recommended actions assigned
- Optional PendingWord creation
- Deduplication and filtering

### Verification Checklist
- [ ] suggest_words method defined with correct signature
- [ ] Patterns parameter validated
- [ ] Romanized term extracted correctly
- [ ] English inference algorithm implemented
- [ ] Product name cleaning logic added
- [ ] Confidence calculation adjusted
- [ ] Recommended action logic implemented
- [ ] Suggestion structure matches specification
- [ ] Deduplication logic applied
- [ ] Dictionary word filtering implemented
- [ ] PendingWord creation (if enabled) works
- [ ] Results sorted appropriately
- [ ] Logging and error handling added
- [ ] Method docstring complete

---

## Summary

This document established the foundation for the learning system by implementing search behavior logging and pattern analysis capabilities. The SearchLearning service provides orchestration, TransliterationLog model captures user behavior, and PatternLearner analyzes data to discover new transliteration patterns.

### Completed Tasks
1. ✓ Created SearchLearning service for orchestration
2. ✓ Created TransliterationLog model for data persistence
3. ✓ Added query field to capture user input
4. ✓ Added expanded field to capture transliteration output
5. ✓ Added clicked_product FK to track user interactions
6. ✓ Created PatternLearner class for analysis
7. ✓ Implemented identify_patterns method for discovery
8. ✓ Implemented suggest_words method for recommendations

### Key Outcomes
- **Search Logging:** Every search and click is tracked for analysis
- **Pattern Detection:** Automated discovery of new transliteration needs
- **Learning Signals:** Multiple data points indicate new word requirements
- **Word Suggestions:** Automated recommendations for dictionary expansion
- **Confidence Scoring:** Quantified reliability of each suggestion

### Next Steps
Proceed to [02_Tasks-75-78_Pending-Auto-Verify.md](02_Tasks-75-78_Pending-Auto-Verify.md) to implement the PendingWord model, admin review interface, auto-approval system for popular terms, and comprehensive verification of the learning system.
