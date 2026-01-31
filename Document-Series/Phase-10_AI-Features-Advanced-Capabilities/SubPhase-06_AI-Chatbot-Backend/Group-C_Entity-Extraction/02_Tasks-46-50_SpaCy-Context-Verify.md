# Tasks 46-50: SpaCy Extractor, Context, and Verification

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** C - Entity Extraction  
> **Document:** 02 of 02  
> **Tasks Covered:** 46, 47, 48, 49, 50

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Document:** [01_Tasks-35-45_Extractor-Patterns.md](01_Tasks-35-45_Extractor-Patterns.md)
- **→ Next Group:** [Group-D_Action-Handlers](../Group-D_Action-Handlers/)

---

## Document Overview

This document covers the advanced entity extraction capabilities using SpaCy NER, entity caching for performance, context-based entity resolution from conversation history, entity validation against business rules, and comprehensive verification testing. These components complete the entity extraction system with intelligent context awareness and validation.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 46 | Create SpaCy Extractor | High | 90 min |
| 47 | Create Entity Cache | Medium | 60 min |
| 48 | Create Context Entities | Medium | 75 min |
| 49 | Create Entity Validation | Medium | 60 min |
| 50 | Verify Extraction | Low | 45 min |

---

## Task 46: Create SpaCy Extractor

### Overview
Create the SpaCyExtractor class that leverages SpaCy's Named Entity Recognition (NER) capabilities to extract entities from natural language text. This extractor complements regex patterns by handling more complex, context-dependent entities using machine learning.

### Dependencies
- Task 45: Create Phone Pattern
- SpaCy library installed in Python environment
- SpaCy English model (en_core_web_sm) downloaded

### Instructions

1. **Create spacy_ner.py file**
   - Create `extraction/spacy_ner.py` in extraction directory
   - This file contains SpaCyExtractor class
   - Import SpaCy library and model loading utilities

2. **Define SpaCyExtractor class**
   - Create class named `SpaCyExtractor`
   - Implement extractor interface compatible with EntityExtractor
   - Initialize SpaCy NLP pipeline

3. **Load SpaCy model**
   - Load `en_core_web_sm` model in `__init__` method
   - Handle model not found error gracefully
   - Cache loaded model for reuse across instances

4. **Create entity mapping configuration**
   - Map SpaCy entity labels to system entity types
   - Define mapping dictionary for conversions
   - Support custom mappings per tenant

5. **Implement extract method**
   - Accept text parameter for extraction
   - Process text through SpaCy NLP pipeline
   - Extract entities from doc.ents collection

6. **Map SpaCy entities to system types**
   - Convert SpaCy labels (DATE, TIME, MONEY, etc.)
   - Map to system entity types (DATE, PRICE, QUANTITY, etc.)
   - Filter unmapped or irrelevant entities

7. **Add confidence scoring**
   - SpaCy doesn't provide confidence by default
   - Estimate confidence based on entity type and context
   - Use entity length and position as factors

8. **Extract additional metadata**
   - Capture entity position (start, end)
   - Store entity label from SpaCy
   - Include surrounding context for validation

9. **Handle multi-word entities**
   - SpaCy naturally handles multi-word entities
   - Extract complete phrases (e.g., "Dell Latitude Laptop")
   - Preserve entity boundaries correctly

10. **Add model fallback strategy**
    - If model not available, return empty results
    - Log warning about missing model
    - Allow system to function with regex only

### SpaCy Entity Mapping

| SpaCy Label | System Entity Type | Example | Confidence |
|-------------|-------------------|---------|------------|
| DATE | DATE | "tomorrow", "March 15" | 0.85 |
| TIME | TIME | "3pm", "15:00" | 0.85 |
| MONEY | PRICE | "$100", "Rs 5000" | 0.80 |
| CARDINAL | QUANTITY | "5", "twenty" | 0.75 |
| PERSON | CUSTOMER_NAME | "John Smith" | 0.80 |
| ORG | ORGANIZATION | "LCC Store" | 0.75 |
| PRODUCT | PRODUCT_NAME | "iPhone 14" | 0.80 |
| GPE | LOCATION | "Colombo", "Sri Lanka" | 0.85 |

### SpaCy Extractor Architecture

```
SpaCyExtractor
    │
    ├─── SpaCy Model (en_core_web_sm)
    │    ├─── Tokenizer
    │    ├─── POS Tagger
    │    ├─── Dependency Parser
    │    └─── NER Component
    │
    ├─── Entity Mapping
    │    ├─── SpaCy Label → System Type
    │    └─── Confidence Estimation
    │
    └─── extract(text)
         ├─── Process with SpaCy
         ├─── Extract entities
         ├─── Map to system types
         └─── Return results
```

### Extract Method Flow

```
Input: "Order 5 laptops for delivery tomorrow"
         │
         ▼
    SpaCy NLP Pipeline
         │
    ┌────┴────────────┐
    ▼                 ▼
Tokenize       POS Tag
    │                 │
    └────┬────────────┘
         ▼
    NER Detection
         │
    ┌────┴────┬──────────┐
    ▼         ▼          ▼
CARDINAL    PRODUCT     DATE
   "5"      "laptops"  "tomorrow"
    │         │          │
    ▼         ▼          ▼
QUANTITY   PRODUCT_NAME  DATE
         │
         ▼
Output: [
  {type: QUANTITY, value: "5", confidence: 0.75},
  {type: PRODUCT_NAME, value: "laptops", confidence: 0.80},
  {type: DATE, value: "tomorrow", confidence: 0.85}
]
```

### SpaCy Model Configuration

| Aspect | Configuration |
|--------|---------------|
| Model | en_core_web_sm |
| Version | >= 3.0 |
| Components | tok2vec, tagger, parser, ner |
| Language | English |
| Size | ~12MB |

### Confidence Estimation Factors

| Factor | Impact | Weight |
|--------|--------|--------|
| Entity Label | Known labels higher | 40% |
| Entity Length | Longer entities more confident | 20% |
| Context Words | Indicator words nearby | 25% |
| Position | Beginning/end vs middle | 15% |

### Model Installation

```
Installation Steps:
1. Install SpaCy: pip install spacy
2. Download model: python -m spacy download en_core_web_sm
3. Verify: python -c "import spacy; spacy.load('en_core_web_sm')"

Alternative Models:
- en_core_web_md (43MB, better accuracy)
- en_core_web_lg (741MB, best accuracy)
- en_core_web_trf (438MB, transformer-based)
```

### Expected Outcome
- SpaCyExtractor class implemented with NER capabilities
- Entity mapping from SpaCy to system types
- Confidence estimation for extractions
- Model loading with error handling

### Verification Checklist
- [ ] `backend/apps/chatbot/extraction/spacy_ner.py` created
- [ ] SpaCyExtractor class defined
- [ ] SpaCy model loaded successfully
- [ ] Entity mapping configured
- [ ] Extract method returns proper format
- [ ] Confidence scores calculated

---

## Task 47: Create Entity Cache

### Overview
Implement entity caching to store extracted entities in Redis for improved performance and context persistence across conversation turns. The cache reduces repeated extraction overhead and maintains entity history for context resolution.

### Dependencies
- Task 46: Create SpaCy Extractor
- Redis server configured and running
- Django cache framework configured

### Instructions

1. **Configure Redis cache backend**
   - Add entity cache configuration to Django settings
   - Use separate Redis database for entity cache
   - Configure TTL (Time To Live) for cached entities

2. **Create cache key structure**
   - Define key pattern: `conversation:{id}:entities`
   - Include tenant ID for multi-tenancy: `tenant:{tid}:conversation:{id}:entities`
   - Use structured keys for easy querying

3. **Implement entity caching method**
   - Create method `cache_entities` accepting conversation_id and entities
   - Serialize entities to JSON format
   - Store in Redis with configured TTL

4. **Implement entity retrieval method**
   - Create method `get_cached_entities` accepting conversation_id
   - Retrieve from Redis cache
   - Deserialize JSON to entity dictionary

5. **Add cache invalidation**
   - Invalidate on conversation deletion
   - Update on new entity extraction
   - Merge new entities with cached ones

6. **Configure cache TTL**
   - Set default TTL to 1 hour (3600 seconds)
   - Allow configuration per tenant
   - Extend TTL on cache access

7. **Implement cache warming**
   - Pre-populate cache for active conversations
   - Load from database on cache miss
   - Background task for cache maintenance

8. **Add cache statistics**
   - Track cache hit/miss rates
   - Monitor cache size per conversation
   - Log cache performance metrics

9. **Handle cache failures gracefully**
   - Fallback to direct extraction on cache unavailable
   - Log cache errors without breaking extraction
   - Queue cache updates for retry

### Entity Cache Architecture

```
Entity Cache System
    │
    ├─── Redis Backend
    │    ├─── Database 2 (Entities)
    │    ├─── TTL: 1 hour
    │    └─── Eviction: LRU
    │
    ├─── Cache Operations
    │    ├─── Set (cache_entities)
    │    ├─── Get (get_cached_entities)
    │    ├─── Update (merge_entities)
    │    └─── Invalidate (clear_entities)
    │
    └─── Cache Keys
         ├─── tenant:{tid}:conversation:{id}:entities
         ├─── tenant:{tid}:conversation:{id}:last_update
         └─── tenant:{tid}:user:{uid}:recent_entities
```

### Cache Key Structure

| Key Pattern | Purpose | TTL | Example |
|-------------|---------|-----|---------|
| `tenant:1:conversation:abc123:entities` | Conversation entities | 1 hour | All entities from conversation |
| `tenant:1:conversation:abc123:last_update` | Update timestamp | 1 hour | ISO timestamp |
| `tenant:1:user:456:recent_entities` | User recent entities | 30 min | Cross-conversation entities |

### Cached Entity Format

```
{
  "conversation_id": "abc123",
  "tenant_id": "1",
  "entities": {
    "ORDER_ID": [
      {
        "value": "12345",
        "message_index": 3,
        "timestamp": "2025-01-31T10:30:00Z",
        "confidence": 0.95
      }
    ],
    "PRODUCT_NAME": [
      {
        "value": "Dell Laptop",
        "message_index": 2,
        "timestamp": "2025-01-31T10:29:00Z",
        "confidence": 0.82
      }
    ]
  },
  "last_updated": "2025-01-31T10:30:00Z",
  "message_count": 5
}
```

### Cache Operations

| Operation | Method | Description |
|-----------|--------|-------------|
| Set | `cache_entities(conv_id, entities)` | Store entities in cache |
| Get | `get_cached_entities(conv_id)` | Retrieve from cache |
| Update | `merge_entities(conv_id, new_entities)` | Merge new with cached |
| Invalidate | `clear_entities(conv_id)` | Remove from cache |
| Extend TTL | `touch_entities(conv_id)` | Reset expiration |

### Cache Performance Strategy

```
Request Flow with Caching:

User Message
    │
    ▼
Check Cache
    │
┌───┴───┐
│       │
▼       ▼
Hit    Miss
│       │
│       ▼
│   Extract Entities
│       │
│       ▼
│   Store in Cache
│       │
└───┬───┘
    │
    ▼
Return Entities
```

### Cache Metrics

| Metric | Description | Target |
|--------|-------------|--------|
| Hit Rate | % of cache hits | > 70% |
| Miss Rate | % of cache misses | < 30% |
| Avg Size | Average entity cache size | < 10KB |
| TTL Hit | Entries accessed before expiry | > 80% |

### Redis Configuration

```
Redis Settings:
- Database: 2 (entities)
- Max Memory: 256MB
- Eviction Policy: LRU (Least Recently Used)
- Persistence: RDB + AOF
- Connection Pool: 10 connections
```

### Expected Outcome
- Entity caching implemented in Redis
- Cache operations (set, get, update, invalidate)
- TTL configuration with 1-hour expiration
- Cache statistics and monitoring

### Verification Checklist
- [ ] Redis cache configured for entities
- [ ] Cache key structure defined
- [ ] `cache_entities` method implemented
- [ ] `get_cached_entities` method implemented
- [ ] TTL configured (1 hour)
- [ ] Cache invalidation on conversation changes
- [ ] Graceful fallback on cache failure

---

## Task 48: Create Context Entities

### Overview
Implement context-based entity resolution that extracts entities from conversation history to resolve ambiguous references in current messages. This enables the chatbot to understand pronouns and implicit references using past conversation context.

### Dependencies
- Task 47: Create Entity Cache

### Instructions

1. **Create context.py file**
   - Create `extraction/context.py` in extraction directory
   - This file contains ContextExtractor class
   - Import conversation history utilities

2. **Define ContextExtractor class**
   - Create class named `ContextExtractor`
   - Implement extractor interface for compatibility
   - Initialize with conversation history access

3. **Implement history retrieval**
   - Create method to fetch conversation messages
   - Retrieve last N messages (configurable, default 10)
   - Load from cache or database

4. **Extract entities from history**
   - Loop through historical messages
   - Extract entities from each message
   - Maintain entity timeline with message indices

5. **Implement reference resolution**
   - Detect pronouns and references: "my order", "that product", "this address"
   - Map references to most recent entity of type
   - Use proximity and recency for disambiguation

6. **Create entity ranking**
   - Rank entities by recency (most recent first)
   - Consider frequency (mentioned multiple times)
   - Weight by message importance (user vs bot)

7. **Add reference detection patterns**
   - Pronouns: "my", "that", "this", "it", "them"
   - Implicit references: "the order", "the product"
   - Create pattern library for common references

8. **Implement confidence adjustment**
   - Context entities start with lower confidence
   - Increase confidence if reference is clear
   - Decrease if multiple candidates exist

9. **Handle multi-turn context**
   - Track entity mentions across turns
   - Resolve co-references (same entity, different mentions)
   - Build entity mention graph

10. **Add context window configuration**
    - Configure history lookback (number of messages)
    - Set time window (e.g., last 30 minutes)
    - Allow tenant-specific configuration

### Context Entity Resolution Flow

```
Current Message: "What's the status?"
         │
         ▼
Load Conversation History
         │
    ┌────┴────┬─────────┬──────────┐
    ▼         ▼         ▼          ▼
Msg -4    Msg -3    Msg -2     Msg -1
"Hi"      "Order   "Laptop"   "Cancel"
          #12345"
         │
         ▼
Extract Historical Entities
         │
    ┌────┴────┐
    ▼         ▼
ORDER_ID   PRODUCT_NAME
 12345      Laptop
         │
         ▼
Detect Reference in Current
("status" → needs ORDER_ID context)
         │
         ▼
Resolve to Context Entity
         │
         ▼
Return: ORDER_ID = 12345 (from Msg -3, confidence 0.80)
```

### Reference Pattern Library

| Pattern | Entity Type | Example | Resolution |
|---------|-------------|---------|------------|
| "my order" | ORDER_ID | "Cancel my order" | Most recent ORDER_ID |
| "that product" | PRODUCT_NAME | "Show me that product" | Most recent PRODUCT_NAME |
| "this address" | ADDRESS | "Update this address" | Most recent ADDRESS |
| "the order" | ORDER_ID | "Track the order" | Most recent ORDER_ID |
| "it" | ANY | "Cancel it" | Most recent entity |

### Context Window Configuration

| Parameter | Default | Range | Purpose |
|-----------|---------|-------|---------|
| message_count | 10 | 5-20 | Number of historical messages |
| time_window_minutes | 30 | 10-60 | Time limit for context |
| max_entities_per_type | 3 | 1-5 | Keep top N entities per type |
| recency_weight | 0.6 | 0.0-1.0 | Weight for recent entities |
| frequency_weight | 0.4 | 0.0-1.0 | Weight for frequent entities |

### Entity Ranking Algorithm

```
Entity Score = (Recency × recency_weight) + (Frequency × frequency_weight)

Recency Score:
- Message -1: 1.0
- Message -2: 0.9
- Message -3: 0.8
- Message -N: max(0.1, 1.0 - (N × 0.1))

Frequency Score:
- 1 mention: 0.5
- 2 mentions: 0.75
- 3+ mentions: 1.0

Example:
ORDER_ID "12345" mentioned in Message -2 and Message -5:
Recency = (0.9 + 0.6) / 2 = 0.75
Frequency = 0.75 (2 mentions)
Score = (0.75 × 0.6) + (0.75 × 0.4) = 0.75
```

### Context Entity Resolution Examples

| Current Message | Context | Resolved Entity | Confidence |
|----------------|---------|-----------------|------------|
| "Cancel it" | Previous: "Order #12345" | ORDER_ID: 12345 | 0.80 |
| "My order status" | Previous: "#67890 placed" | ORDER_ID: 67890 | 0.85 |
| "That product price" | Previous: "Dell Laptop" | PRODUCT: Dell Laptop | 0.75 |
| "Update the address" | Previous: "123 Main St" | ADDRESS: 123 Main St | 0.80 |

### Co-reference Resolution

```
Conversation History:
1. User: "I want to order a Dell laptop"
   → PRODUCT_NAME: "Dell laptop"

2. Bot: "Sure, which Dell laptop model?"

3. User: "The XPS 15"
   → PRODUCT_NAME: "Dell XPS 15" (refined)

4. User: "Add it to cart"
   → PRODUCT_NAME: "Dell XPS 15" (co-reference)

Entity Graph:
"Dell laptop" → "Dell XPS 15" → "it"
(All refer to same product)
```

### Expected Outcome
- ContextExtractor class extracting entities from history
- Reference pattern detection implemented
- Entity ranking by recency and frequency
- Pronoun and implicit reference resolution

### Verification Checklist
- [ ] `backend/apps/chatbot/extraction/context.py` created
- [ ] ContextExtractor class defined
- [ ] Conversation history retrieval implemented
- [ ] Reference pattern library configured
- [ ] Entity ranking algorithm implemented
- [ ] Confidence scoring for context entities

---

## Task 49: Create Entity Validation

### Overview
Implement comprehensive entity validation that checks extracted entities against business rules, database existence, and format requirements. Validation ensures entities are not only correctly extracted but also valid and actionable.

### Dependencies
- Task 48: Create Context Entities

### Instructions

1. **Create validators.py file**
   - Create `extraction/validators.py` in extraction directory
   - This file contains entity validator classes
   - Import database models and validation utilities

2. **Define base EntityValidator class**
   - Create abstract base class `EntityValidator`
   - Define `validate` method signature
   - Return validation result with success/error

3. **Create OrderIDValidator**
   - Validate ORDER_ID entities
   - Check order exists in database
   - Verify belongs to current tenant
   - Confirm user has permission to access

4. **Create ProductNameValidator**
   - Validate PRODUCT_NAME entities
   - Check product exists in catalog
   - Verify product is active/available
   - Confirm tenant has access to product

5. **Create PhoneValidator**
   - Validate PHONE entities
   - Check format matches Sri Lankan patterns
   - Verify digit count is correct
   - Normalize to international format

6. **Create EmailValidator**
   - Validate EMAIL entities
   - Check RFC 5322 compliance
   - Verify domain has valid TLD
   - Optional: DNS MX record check

7. **Create QuantityValidator**
   - Validate QUANTITY entities
   - Check value is positive
   - Verify within reasonable range (1-10,000)
   - Ensure integer for countable items

8. **Create DateValidator**
   - Validate DATE entities
   - Check date is parseable
   - Verify not too far in past/future
   - Warn if date seems inappropriate for context

9. **Implement validation result format**
   - Return dictionary with `valid`, `error`, `normalized_value`
   - Include validation confidence adjustment
   - Provide user-friendly error messages

10. **Add async validation support**
    - Some validators need database queries
    - Implement async validate method
    - Batch validation for performance

11. **Create validation registry**
    - Map entity types to validator classes
    - Support custom validators per tenant
    - Allow validation rule configuration

### Validation Architecture

```
Entity Validation System
    │
    ├─── Validator Registry
    │    ├─── ORDER_ID → OrderIDValidator
    │    ├─── PRODUCT_NAME → ProductNameValidator
    │    ├─── QUANTITY → QuantityValidator
    │    ├─── DATE → DateValidator
    │    ├─── PHONE → PhoneValidator
    │    └─── EMAIL → EmailValidator
    │
    ├─── Validation Flow
    │    ├─── Format Validation (fast)
    │    ├─── Business Rules (medium)
    │    └─── Database Check (slow)
    │
    └─── Validation Result
         ├─── valid: bool
         ├─── error: str
         ├─── normalized_value: any
         └─── confidence_adjustment: float
```

### Validator Specifications

| Validator | Checks | Database Query | Async |
|-----------|--------|----------------|-------|
| OrderIDValidator | Exists, tenant, permission | Yes | Yes |
| ProductNameValidator | Exists, active, tenant | Yes | Yes |
| PhoneValidator | Format, digit count | No | No |
| EmailValidator | Format, TLD | No | No |
| QuantityValidator | Range, positive | No | No |
| DateValidator | Valid date, range | No | No |

### OrderIDValidator Logic

```
Validation Steps:
1. Check format (5-8 digits)
2. Query order from database
3. Verify order.tenant_id == current_tenant
4. Check user permission for order
5. Confirm order not deleted/cancelled

Validation Result:
{
  "valid": true,
  "error": null,
  "normalized_value": "12345",
  "confidence_adjustment": 0.0,
  "metadata": {
    "order_status": "shipped",
    "order_date": "2025-01-25"
  }
}
```

### ProductNameValidator Logic

```
Validation Steps:
1. Fuzzy match against catalog
2. Check product is active
3. Verify in current tenant catalog
4. Check stock availability (optional)

Validation Result:
{
  "valid": true,
  "error": null,
  "normalized_value": "Dell Latitude 5420 Laptop",
  "confidence_adjustment": 0.05,
  "metadata": {
    "product_id": "PROD-789",
    "in_stock": true,
    "price": 850.00
  }
}
```

### Validation Error Messages

| Validator | Error Case | User Message |
|-----------|------------|--------------|
| OrderIDValidator | Not found | "Order not found. Please check the order number." |
| OrderIDValidator | Wrong tenant | "You don't have access to this order." |
| ProductNameValidator | Not found | "Product not found in catalog." |
| ProductNameValidator | Inactive | "This product is no longer available." |
| PhoneValidator | Invalid format | "Invalid phone number format." |
| EmailValidator | Invalid format | "Invalid email address format." |
| QuantityValidator | Too large | "Quantity exceeds maximum allowed (10,000)." |
| DateValidator | Past date | "Date must be in the future for orders." |

### Validation Result Format

```
{
  "valid": boolean,
  "error": string | null,
  "normalized_value": any,
  "confidence_adjustment": float,
  "metadata": {
    // Validator-specific metadata
  }
}

Examples:

Valid:
{
  "valid": true,
  "error": null,
  "normalized_value": "12345",
  "confidence_adjustment": 0.0,
  "metadata": {"order_status": "shipped"}
}

Invalid:
{
  "valid": false,
  "error": "Order not found",
  "normalized_value": null,
  "confidence_adjustment": -0.3,
  "metadata": {}
}
```

### Confidence Adjustment Rules

| Validation Result | Adjustment | Reason |
|-------------------|------------|--------|
| Valid + Exists | +0.05 | Confirmed in database |
| Valid Format Only | 0.0 | No additional confidence |
| Invalid Format | -0.3 | Likely wrong extraction |
| Not Found | -0.2 | May be typo or error |
| Permission Denied | -0.1 | Correct entity, wrong context |

### Async Validation Example

```
Async Validation Flow:

Multiple Entities:
- ORDER_ID: 12345
- PRODUCT_NAME: Dell Laptop
- QUANTITY: 5

Parallel Validation:
├─── OrderIDValidator.validate(12345) → DB Query
├─── ProductNameValidator.validate("Dell Laptop") → DB Query
└─── QuantityValidator.validate(5) → No DB Query

Await All:
Results = [
  {valid: true, entity: ORDER_ID},
  {valid: true, entity: PRODUCT_NAME},
  {valid: true, entity: QUANTITY}
]

Return: All Valid
```

### Expected Outcome
- Entity validation system with multiple validators
- Database existence checking for orders and products
- Format validation for phone and email
- Business rule validation for quantities and dates
- Async validation support for performance

### Verification Checklist
- [ ] `backend/apps/chatbot/extraction/validators.py` created
- [ ] Base EntityValidator class defined
- [ ] OrderIDValidator implemented with DB check
- [ ] ProductNameValidator implemented with catalog check
- [ ] PhoneValidator with format validation
- [ ] EmailValidator with RFC compliance
- [ ] QuantityValidator with range check
- [ ] DateValidator with date parsing
- [ ] Validation result format standardized
- [ ] Async validation support added

---

## Task 50: Verify Extraction

### Overview
Implement comprehensive testing and verification of the entity extraction system. Create test cases covering all entity types, extraction strategies, context resolution, validation, and edge cases to ensure robust and reliable extraction.

### Dependencies
- Task 49: Create Entity Validation

### Instructions

1. **Create test file structure**
   - Create `backend/apps/chatbot/tests/test_extraction.py`
   - Organize tests by extraction component
   - Use Django TestCase or pytest fixtures

2. **Test EntityExtractor initialization**
   - Verify extractor loads correctly
   - Check all extractors registered
   - Confirm entity type registry populated

3. **Test Regex extraction**
   - Test ORDER_ID patterns (hash, ORD-, keyword, standalone)
   - Test PHONE patterns (international, local, landline)
   - Test EMAIL pattern (various formats)
   - Verify confidence scores assigned correctly

4. **Test SpaCy extraction**
   - Test DATE extraction (relative and absolute)
   - Test QUANTITY extraction (numeric and word form)
   - Test PRODUCT_NAME extraction
   - Verify entity mapping from SpaCy labels

5. **Test context resolution**
   - Test pronoun resolution ("my order", "it", "that")
   - Test implicit reference resolution
   - Test entity ranking by recency
   - Verify co-reference resolution across messages

6. **Test entity validation**
   - Test valid entities pass validation
   - Test invalid entities fail validation
   - Test database existence checks
   - Verify error messages generated correctly

7. **Test entity caching**
   - Test cache write operations
   - Test cache read operations
   - Test cache invalidation
   - Verify TTL behavior

8. **Test edge cases**
   - Empty text input
   - Multiple entities of same type
   - Overlapping entity matches
   - Ambiguous references
   - Malformed entities

9. **Test multi-entity extraction**
   - Test messages with multiple entity types
   - Verify all entities extracted correctly
   - Test entity conflict resolution
   - Check merged results accuracy

10. **Test performance**
    - Measure extraction time for typical messages
    - Test batch extraction of multiple messages
    - Verify cache improves performance
    - Check memory usage reasonable

11. **Create test fixtures**
    - Sample conversation histories
    - Mock database objects (orders, products)
    - Sample entity patterns
    - Expected extraction results

12. **Document test coverage**
    - Calculate code coverage percentage
    - Identify untested code paths
    - Document known limitations
    - Create test report

### Test Case Categories

| Category | Test Count | Focus |
|----------|------------|-------|
| Regex Extraction | 15 | Pattern matching accuracy |
| SpaCy Extraction | 10 | NER entity detection |
| Context Resolution | 12 | Reference resolution |
| Validation | 18 | Business rules and format |
| Caching | 8 | Cache operations |
| Edge Cases | 10 | Error handling |
| Integration | 7 | End-to-end flow |
| Performance | 5 | Speed and efficiency |

### Sample Test Cases

#### Test 1: ORDER_ID Hash Prefix
```
Input: "Check status of #12345"
Expected: {
  "entities": {
    "ORDER_ID": [{
      "value": "12345",
      "raw": "#12345",
      "confidence": 0.95
    }]
  }
}
```

#### Test 2: Phone International Format
```
Input: "Call me at +94771234567"
Expected: {
  "entities": {
    "PHONE": [{
      "value": "+94771234567",
      "raw": "+94771234567",
      "confidence": 0.95
    }]
  }
}
```

#### Test 3: Context Resolution
```
Conversation:
1. "I want to order #12345"
2. "What's the status?"

Expected for Message 2: {
  "entities": {
    "ORDER_ID": [{
      "value": "12345",
      "source": "context",
      "confidence": 0.80
    }]
  }
}
```

#### Test 4: Multi-Entity Extraction
```
Input: "Order 5 laptops to +94771234567 by tomorrow"
Expected: {
  "entities": {
    "QUANTITY": [{"value": 5, "confidence": 0.85}],
    "PRODUCT_NAME": [{"value": "laptops", "confidence": 0.80}],
    "PHONE": [{"value": "+94771234567", "confidence": 0.95}],
    "DATE": [{"value": "2025-02-01", "confidence": 0.90}]
  }
}
```

### Test Fixtures Structure

```
fixtures/
├── conversations.json
│   └── Sample conversation histories
├── orders.json
│   └── Test order data
├── products.json
│   └── Test product catalog
└── expected_results.json
    └── Expected extraction outputs
```

### Entity Extraction Test Flow Diagram

```
Test Execution Flow:

Test Case
    │
    ├─── Setup
    │    ├─── Load fixtures
    │    ├─── Initialize extractors
    │    └─── Mock database
    │
    ├─── Execute
    │    ├─── Call extract method
    │    ├─── Process with all extractors
    │    └─── Apply validation
    │
    ├─── Assert
    │    ├─── Check entities extracted
    │    ├─── Verify confidence scores
    │    ├─── Validate entity values
    │    └─── Confirm no errors
    │
    └─── Teardown
         ├─── Clear cache
         ├─── Reset database
         └─── Clean up resources
```

### Performance Benchmarks

| Operation | Target Time | Acceptable |
|-----------|-------------|------------|
| Regex extraction | < 5ms | < 10ms |
| SpaCy extraction | < 50ms | < 100ms |
| Context resolution | < 20ms | < 50ms |
| Validation (no DB) | < 5ms | < 10ms |
| Validation (DB) | < 100ms | < 200ms |
| Cache read | < 2ms | < 5ms |
| Full extraction | < 150ms | < 300ms |

### Edge Cases to Test

| Edge Case | Input | Expected Behavior |
|-----------|-------|-------------------|
| Empty Text | "" | Return empty entities |
| No Entities | "Hello" | Return empty entities |
| Multiple Same Entity | "Order #12345 and #67890" | Extract both |
| Overlapping Patterns | "email@order.com #12345" | Extract both correctly |
| Ambiguous Reference | "it" with no context | Low confidence or skip |
| Invalid Entity | "#999" (order doesn't exist) | Extract but fail validation |
| Long Text | 1000+ characters | Extract within time limit |
| Special Characters | "Order #1234$" | Handle gracefully |

### Coverage Goals

| Component | Target Coverage | Minimum |
|-----------|----------------|---------|
| EntityExtractor | 95% | 85% |
| RegexExtractor | 90% | 80% |
| SpaCyExtractor | 85% | 75% |
| ContextExtractor | 90% | 80% |
| Validators | 95% | 90% |
| Overall | 90% | 80% |

### Expected Outcome
- Comprehensive test suite covering all extraction components
- Test cases for all entity types and extraction strategies
- Edge case and error handling tests
- Performance benchmarks validated
- Test coverage above 80%

### Verification Checklist
- [ ] Test file created with organized structure
- [ ] Regex extraction tests implemented
- [ ] SpaCy extraction tests implemented
- [ ] Context resolution tests implemented
- [ ] Validation tests implemented
- [ ] Cache tests implemented
- [ ] Edge case tests implemented
- [ ] Multi-entity tests implemented
- [ ] Performance tests executed
- [ ] Test fixtures created
- [ ] Test coverage calculated (>80%)
- [ ] All tests passing

---

## Summary

This document completed the entity extraction system with Tasks 46-50. You've implemented:

✅ **SpaCy Extractor** - NER-based entity extraction using machine learning
✅ **Entity Cache** - Redis-based caching for performance optimization
✅ **Context Entities** - Conversation history-based entity resolution
✅ **Entity Validation** - Business rules and database validation
✅ **Extraction Verification** - Comprehensive testing and validation

### Complete Entity Extraction System

```
User Message: "Cancel my order by tomorrow"
    │
    ├─── Regex Extractor
    │    └─── (No explicit ORDER_ID found)
    │
    ├─── SpaCy Extractor
    │    └─── DATE: "tomorrow" (0.85)
    │
    ├─── Context Extractor
    │    └─── ORDER_ID: "12345" from history (0.80)
    │
    ├─── Validation
    │    ├─── ORDER_ID: Valid, exists, accessible
    │    └─── DATE: Valid, future date
    │
    └─── Final Result
         ├─── ORDER_ID: 12345 (0.85 confidence)
         └─── DATE: 2025-02-01 (0.85 confidence)
```

### Entity Extraction Capabilities

| Component | Capability | Performance |
|-----------|------------|-------------|
| Regex Patterns | Structured entities | < 10ms |
| SpaCy NER | Natural language entities | < 100ms |
| Context Resolution | Reference resolution | < 50ms |
| Validation | Business rules | < 200ms |
| Caching | Performance boost | 70%+ hit rate |

### Integration with Chatbot

The entity extraction system integrates with:
- **Intent Classification (Group B)** - Provides entities for classified intents
- **Action Handlers (Group D)** - Supplies validated entities for actions
- **Conversation Context** - Maintains entity history across turns
- **Response Generation** - Uses entities for personalized responses

### Next Steps

Continue to **Group-D_Action-Handlers** to implement action execution using the extracted and validated entities. The action handlers will use the entities to perform operations like order cancellation, status checks, product searches, and more.

---

**End of Document 02 of 02**  
**End of Group C: Entity Extraction**
