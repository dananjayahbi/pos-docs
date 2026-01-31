# Tasks 35-45: Entity Extractor and Regex Patterns

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 06 - AI Chatbot Backend  
> **Group:** C - Entity Extraction  
> **Document:** 01 of 02  
> **Tasks Covered:** 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **← Previous Group:** [Group-B_Intent-Classification](../Group-B_Intent-Classification/)
- **→ Next Document:** [02_Tasks-46-50_SpaCy-Context-Verify.md](02_Tasks-46-50_SpaCy-Context-Verify.md)

---

## Document Overview

This document covers the creation of the EntityExtractor system with regex-based pattern matching capabilities. It establishes the foundational entity extraction infrastructure, including the base extractor class, extract method, six core entity types (ORDER_ID, PRODUCT_NAME, QUANTITY, DATE, PHONE, EMAIL), and regex patterns specifically designed for order IDs and Sri Lankan phone numbers.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 35 | Create EntityExtractor | High | 90 min |
| 36 | Create extract Method | Medium | 60 min |
| 37 | Create ORDER_ID Entity | Low | 30 min |
| 38 | Create PRODUCT_NAME Entity | Low | 30 min |
| 39 | Create QUANTITY Entity | Low | 30 min |
| 40 | Create DATE Entity | Low | 45 min |
| 41 | Create PHONE Entity | Low | 30 min |
| 42 | Create EMAIL Entity | Low | 30 min |
| 43 | Create Regex Extractor | Medium | 60 min |
| 44 | Create Order ID Pattern | Low | 30 min |
| 45 | Create Phone Pattern | Low | 30 min |

---

## Task 35: Create EntityExtractor

### Overview
Create the EntityExtractor class as the core component for extracting structured entities from user messages. This class orchestrates multiple extraction strategies (regex, SpaCy, context-based) and returns a unified dictionary of extracted entities with confidence scores.

### Dependencies
- Task 34: Intent classification system complete
- Backend project structure established
- Python environment configured

### Instructions

1. **Navigate to chatbot extraction module**
   - Go to `backend/apps/chatbot/` directory
   - Create new directory named `extraction`
   - This module handles all entity extraction logic

2. **Create extractor.py file**
   - Create `extraction/extractor.py` in the extraction directory
   - This file contains the main EntityExtractor class
   - Initialize the file with proper Python structure

3. **Define EntityExtractor class**
   - Create class named `EntityExtractor`
   - This class coordinates all extraction strategies
   - Design for extensibility and modularity

4. **Initialize extractor dependencies**
   - Define `__init__` method accepting optional configuration
   - Store references to regex extractor, SpaCy extractor, validators
   - Initialize empty extractors list for strategy pattern

5. **Create entity type registry**
   - Define class-level constant for supported entity types
   - Include ORDER_ID, PRODUCT_NAME, QUANTITY, DATE, PHONE, EMAIL
   - Each type maps to extraction strategy and validator

6. **Add extractor registration method**
   - Create method `register_extractor` to add extraction strategies
   - Accept extractor instance and priority parameter
   - Store extractors in ordered list by priority

7. **Implement configuration options**
   - Accept tenant-specific extraction rules
   - Support enabled/disabled entity types per tenant
   - Allow custom validation rules injection

### EntityExtractor Architecture

```
EntityExtractor
    │
    ├─── Regex Extractor (Priority 1)
    ├─── SpaCy Extractor (Priority 2)
    ├─── Context Extractor (Priority 3)
    │
    ├─── Entity Registry
    │    ├─── ORDER_ID
    │    ├─── PRODUCT_NAME
    │    ├─── QUANTITY
    │    ├─── DATE
    │    ├─── PHONE
    │    └─── EMAIL
    │
    └─── Validators
         ├─── Format Validators
         ├─── Business Validators
         └─── Existence Validators
```

### Entity Type Registry Structure

| Entity Type | Extractor Strategy | Validator | Priority |
|-------------|-------------------|-----------|----------|
| ORDER_ID | Regex | Order exists | High |
| PRODUCT_NAME | SpaCy + Fuzzy Match | Product exists | High |
| QUANTITY | Regex + NLP | Range check | Medium |
| DATE | Regex + dateutil | Future/Past check | Medium |
| PHONE | Regex | Format check | Medium |
| EMAIL | Regex | Format check | Low |

### Configuration Options

| Option | Type | Description |
|--------|------|-------------|
| enabled_entities | List[str] | Entity types to extract |
| tenant_id | str | Tenant context for validation |
| strict_mode | bool | Require validation for all |
| confidence_threshold | float | Minimum confidence (0.0-1.0) |

### Expected Outcome
- EntityExtractor class defined with extensible architecture
- Support for multiple extraction strategies
- Entity type registry configured
- Configuration system for tenant-specific rules

### Verification Checklist
- [ ] `backend/apps/chatbot/extraction/extractor.py` created
- [ ] EntityExtractor class defined
- [ ] Entity type registry established
- [ ] Extractor registration method implemented
- [ ] Configuration options supported

---

## Task 36: Create extract Method

### Overview
Implement the extract method as the primary interface for entity extraction. This method coordinates multiple extraction strategies, merges results, resolves conflicts, calculates confidence scores, and returns a structured dictionary containing all extracted entities.

### Dependencies
- Task 35: Create EntityExtractor

### Instructions

1. **Define extract method signature**
   - Create method named `extract` on EntityExtractor class
   - Accept `text` parameter (string) as the message to analyze
   - Accept optional `context` parameter (dict) for conversation history
   - Return dictionary with entities and confidence scores

2. **Implement text preprocessing**
   - Clean and normalize input text
   - Remove extra whitespace and special characters
   - Convert to lowercase for case-insensitive matching

3. **Execute extraction strategies**
   - Loop through registered extractors in priority order
   - Call each extractor's extract method with text
   - Collect results from all extractors

4. **Merge extraction results**
   - Combine results from multiple extractors
   - Handle overlapping entity matches
   - Prioritize higher-confidence extractions

5. **Resolve entity conflicts**
   - When multiple extractors find same entity type
   - Compare confidence scores and choose highest
   - Keep alternative matches if confidence is close

6. **Calculate confidence scores**
   - Each entity gets confidence score (0.0 to 1.0)
   - Based on extractor confidence and validation results
   - Higher score means more certain extraction

7. **Apply context resolution**
   - Use conversation context to resolve ambiguous entities
   - Fill missing entities from previous messages
   - Link pronouns to context entities

8. **Structure return format**
   - Return dictionary with 'entities' and 'confidence' keys
   - Entities organized by type with list of matches
   - Each match includes value, start position, end position

9. **Add logging and debugging**
   - Log extraction process for debugging
   - Track which extractor found each entity
   - Record confidence scores and conflicts

### Extract Method Flow

```
Input: "Cancel order #12345"
         │
         ▼
    Preprocess Text
         │
         ▼
    ┌───────────────┐
    │ Regex Extract │ → ORDER_ID: #12345 (0.95)
    └───────────────┘
         │
         ▼
    ┌───────────────┐
    │ SpaCy Extract │ → No additional entities
    └───────────────┘
         │
         ▼
    ┌───────────────┐
    │Context Extract│ → Customer from history
    └───────────────┘
         │
         ▼
    Merge & Resolve
         │
         ▼
    Calculate Confidence
         │
         ▼
Output: {
  entities: {
    ORDER_ID: ["12345"],
    CUSTOMER: ["stored_customer"]
  },
  confidence: {
    ORDER_ID: 0.95,
    CUSTOMER: 0.80
  }
}
```

### Return Format Structure

```
{
  "entities": {
    "ORDER_ID": [
      {
        "value": "12345",
        "raw": "#12345",
        "start": 13,
        "end": 19,
        "extractor": "regex"
      }
    ],
    "PRODUCT_NAME": [
      {
        "value": "Dell Laptop",
        "raw": "dell laptop",
        "start": 25,
        "end": 36,
        "extractor": "spacy"
      }
    ]
  },
  "confidence": {
    "ORDER_ID": 0.95,
    "PRODUCT_NAME": 0.82
  },
  "metadata": {
    "text_length": 45,
    "extractors_used": ["regex", "spacy"],
    "processing_time_ms": 23
  }
}
```

### Conflict Resolution Strategy

| Scenario | Resolution |
|----------|------------|
| Same entity, different values | Choose highest confidence |
| Same entity, same value | Merge with highest confidence |
| Overlapping text spans | Choose longer match or higher confidence |
| Ambiguous references | Use context to resolve |

### Confidence Calculation

| Factor | Weight | Description |
|--------|--------|-------------|
| Extractor Base Confidence | 40% | Inherent extractor reliability |
| Validation Result | 30% | Does entity exist/valid format |
| Context Match | 20% | Matches conversation history |
| Pattern Strength | 10% | Regex pattern specificity |

### Expected Outcome
- Functional extract method returning structured entities
- Multiple extraction strategies coordinated
- Conflict resolution implemented
- Confidence scoring calculated
- Context-aware extraction

### Verification Checklist
- [ ] `extract` method defined with proper signature
- [ ] Text preprocessing implemented
- [ ] Multiple extractors executed in order
- [ ] Results merged and conflicts resolved
- [ ] Confidence scores calculated
- [ ] Return format matches specification

---

## Task 37: Create ORDER_ID Entity

### Overview
Define the ORDER_ID entity type for extracting order identifiers from user messages. This entity recognizes various order ID formats including numeric IDs with hash prefix, ORD prefix, or standalone numbers.

### Dependencies
- Task 36: Create extract Method

### Instructions

1. **Define ORDER_ID entity type constant**
   - Add ORDER_ID to entity type registry
   - Define entity type string as "ORDER_ID"
   - Configure for high priority extraction

2. **Specify supported formats**
   - Hash-prefixed format: #12345
   - ORD-prefixed format: ORD-12345, ORD-123456
   - Standalone numeric: order 12345, order number 67890
   - Case-insensitive matching

3. **Configure extraction strategy**
   - Use regex as primary extraction method
   - Pattern matches 5-8 digit order IDs
   - Optional prefix characters

4. **Define normalization rules**
   - Remove hash symbol and prefixes
   - Keep only numeric portion
   - Left-pad if necessary for consistency

5. **Add validation requirements**
   - Order ID must exist in database
   - Belongs to current tenant
   - User has permission to access order

6. **Configure confidence factors**
   - High confidence (0.95) with # or ORD prefix
   - Medium confidence (0.80) with "order" keyword
   - Lower confidence (0.60) for standalone numbers

### ORDER_ID Formats and Examples

| Format | Pattern | Example Input | Extracted Value |
|--------|---------|---------------|-----------------|
| Hash Prefix | #\d{5,8} | "Check #12345" | 12345 |
| ORD Prefix | ORD-\d{5,8} | "Cancel ORD-67890" | 67890 |
| Order Keyword | order\s+\d{5,8} | "My order 23456" | 23456 |
| Order Number | order\s+number\s+\d{5,8} | "Order number 98765" | 98765 |
| Standalone | \d{5,8} (context) | "Status of 11223" | 11223 |

### ORDER_ID Entity Configuration

| Property | Value | Description |
|----------|-------|-------------|
| type | ORDER_ID | Entity type identifier |
| priority | High | Extract before other entities |
| extractor | Regex | Primary extraction method |
| validator | OrderValidator | Check order exists |
| normalizer | strip_prefix | Remove # and ORD- |
| min_length | 5 | Minimum digits |
| max_length | 8 | Maximum digits |

### Normalization Examples

| Raw Input | Normalized Output |
|-----------|-------------------|
| #12345 | 12345 |
| ORD-67890 | 67890 |
| order 23456 | 23456 |
| Order Number 98765 | 98765 |

### Validation Rules

| Rule | Check | Error Message |
|------|-------|---------------|
| Exists | Order ID in database | "Order not found" |
| Tenant | Belongs to tenant | "Order not accessible" |
| Permission | User can view order | "Permission denied" |
| Status | Order not deleted | "Order no longer available" |

### Expected Outcome
- ORDER_ID entity type configured in registry
- Multiple format support implemented
- Normalization rules defined
- Validation requirements specified

### Verification Checklist
- [ ] ORDER_ID added to entity registry
- [ ] Supported formats documented
- [ ] Regex patterns defined for extraction
- [ ] Normalization rules specified
- [ ] Validation requirements configured

---

## Task 38: Create PRODUCT_NAME Entity

### Overview
Define the PRODUCT_NAME entity type for extracting product references from user messages. This entity uses a combination of SpaCy NER and fuzzy matching against the tenant's product catalog to identify product mentions.

### Dependencies
- Task 36: Create extract Method

### Instructions

1. **Define PRODUCT_NAME entity type constant**
   - Add PRODUCT_NAME to entity type registry
   - Define entity type string as "PRODUCT_NAME"
   - Configure for high priority after ORDER_ID

2. **Configure extraction strategy**
   - Use SpaCy NER for initial detection
   - Apply fuzzy matching against product catalog
   - Use noun phrase extraction as fallback

3. **Implement catalog matching**
   - Load tenant product catalog from database
   - Create searchable index of product names
   - Include product variations and synonyms

4. **Define fuzzy matching parameters**
   - Use string similarity algorithms (Levenshtein distance)
   - Set minimum similarity threshold (0.75)
   - Account for common misspellings

5. **Add normalization rules**
   - Convert to catalog product name format
   - Map variations to canonical name
   - Preserve brand names properly

6. **Configure confidence scoring**
   - Exact match: 0.95 confidence
   - Close fuzzy match (> 0.85): 0.85 confidence
   - Moderate match (0.75-0.85): 0.70 confidence

7. **Handle multi-word products**
   - Extract complete product names
   - Match brand + product combinations
   - Handle product names with special characters

### PRODUCT_NAME Extraction Strategy

```
User Input: "Check stock of dell latitude laptop"
         │
         ▼
    SpaCy NER
    (Detect product phrase)
         │
         ▼
    Extract: "dell latitude laptop"
         │
         ▼
    Fuzzy Match Against Catalog
         │
         ├─── Dell Latitude 5420 Laptop (0.92)
         ├─── Dell Latitude 7400 Laptop (0.88)
         └─── Dell Inspiron Laptop (0.65)
         │
         ▼
    Select Best Match
         │
         ▼
    Return: "Dell Latitude 5420 Laptop" (0.92)
```

### Product Matching Examples

| User Input | Catalog Match | Similarity | Confidence |
|------------|---------------|------------|------------|
| "dell laptop" | Dell Latitude 5420 Laptop | 0.82 | 0.75 |
| "iphone 14" | iPhone 14 Pro 128GB | 0.88 | 0.85 |
| "hp printer" | HP LaserJet Pro M404n | 0.78 | 0.70 |
| "samsung galaxy" | Samsung Galaxy S23 | 0.90 | 0.88 |

### PRODUCT_NAME Entity Configuration

| Property | Value | Description |
|----------|-------|-------------|
| type | PRODUCT_NAME | Entity type identifier |
| priority | High | High priority extraction |
| extractor | SpaCy + Fuzzy | Hybrid approach |
| validator | CatalogValidator | Check product exists |
| normalizer | catalog_name | Use canonical name |
| min_similarity | 0.75 | Minimum match threshold |

### Fuzzy Matching Configuration

| Parameter | Value | Purpose |
|-----------|-------|---------|
| Algorithm | Levenshtein | String distance metric |
| Threshold | 0.75 | Minimum similarity |
| Max Results | 3 | Top matching products |
| Case Sensitive | False | Ignore case differences |

### Catalog Integration

| Aspect | Implementation |
|--------|----------------|
| Catalog Loading | Load on extractor initialization |
| Cache Duration | 5 minutes |
| Update Trigger | Product catalog changes |
| Tenant Isolation | Separate catalog per tenant |

### Expected Outcome
- PRODUCT_NAME entity type configured
- SpaCy + fuzzy matching implemented
- Catalog integration specified
- Normalization and validation rules defined

### Verification Checklist
- [ ] PRODUCT_NAME added to entity registry
- [ ] SpaCy extraction strategy configured
- [ ] Fuzzy matching parameters defined
- [ ] Catalog loading mechanism specified
- [ ] Confidence scoring rules established

---

## Task 39: Create QUANTITY Entity

### Overview
Define the QUANTITY entity type for extracting numerical quantities from user messages. This entity recognizes both numeric digits and written number words, handling various formats including units and descriptors.

### Dependencies
- Task 36: Create extract Method

### Instructions

1. **Define QUANTITY entity type constant**
   - Add QUANTITY to entity type registry
   - Define entity type string as "QUANTITY"
   - Configure for medium priority extraction

2. **Configure numeric detection**
   - Extract digits (1, 5, 100, 1000)
   - Extract decimal numbers (1.5, 2.25)
   - Handle comma-separated numbers (1,000)

3. **Add word-to-number parsing**
   - Parse number words: one, two, five, ten
   - Handle compound numbers: twenty-five, thirty-two
   - Parse complex forms: one hundred, two thousand

4. **Implement unit detection**
   - Recognize unit indicators: pieces, items, units, pcs
   - Handle quantity descriptors: dozen, pair, set
   - Extract without requiring unit mention

5. **Define normalization rules**
   - Convert all formats to integer or float
   - Remove commas and units
   - Standardize to numeric value

6. **Add validation rules**
   - Quantity must be positive
   - Reasonable range (1 to 10,000)
   - Integer for countable items

7. **Configure confidence scoring**
   - Numeric with unit: 0.95 confidence
   - Numeric without unit: 0.85 confidence
   - Word form: 0.80 confidence

### QUANTITY Extraction Examples

| User Input | Extracted Value | Confidence | Notes |
|------------|-----------------|------------|-------|
| "Order 5 laptops" | 5 | 0.95 | Numeric with context |
| "I need ten units" | 10 | 0.80 | Word form |
| "Ship 1000 pcs" | 1000 | 0.95 | Large quantity |
| "Add 2.5 kg" | 2.5 | 0.90 | Decimal quantity |
| "Need twenty-five" | 25 | 0.80 | Compound word |

### Number Word Mappings

| Word Form | Numeric Value |
|-----------|---------------|
| one | 1 |
| five | 5 |
| ten | 10 |
| twenty | 20 |
| hundred | 100 |
| thousand | 1000 |
| dozen | 12 |
| pair | 2 |

### Compound Number Examples

| Input | Parsing | Output |
|-------|---------|--------|
| "twenty-five" | 20 + 5 | 25 |
| "one hundred fifty" | 100 + 50 | 150 |
| "two thousand" | 2 × 1000 | 2000 |
| "three dozen" | 3 × 12 | 36 |

### QUANTITY Entity Configuration

| Property | Value | Description |
|----------|-------|-------------|
| type | QUANTITY | Entity type identifier |
| priority | Medium | Extract after IDs |
| extractor | Regex + NLP | Hybrid approach |
| validator | RangeValidator | Check reasonable range |
| normalizer | to_numeric | Convert to number |
| min_value | 1 | Minimum quantity |
| max_value | 10000 | Maximum quantity |

### Validation Rules

| Rule | Check | Error |
|------|-------|-------|
| Positive | value > 0 | "Quantity must be positive" |
| Maximum | value <= 10000 | "Quantity too large" |
| Integer | For countable items | "Must be whole number" |

### Expected Outcome
- QUANTITY entity type configured
- Numeric and word parsing implemented
- Unit detection specified
- Normalization and validation rules defined

### Verification Checklist
- [ ] QUANTITY added to entity registry
- [ ] Numeric extraction configured
- [ ] Word-to-number parsing defined
- [ ] Unit detection specified
- [ ] Validation rules established

---

## Task 40: Create DATE Entity

### Overview
Define the DATE entity type for extracting date references from user messages. This entity handles various date formats, relative dates (tomorrow, next week), and natural language date expressions using the dateutil library.

### Dependencies
- Task 36: Create extract Method

### Instructions

1. **Define DATE entity type constant**
   - Add DATE to entity type registry
   - Define entity type string as "DATE"
   - Configure for medium priority extraction

2. **Configure date parsing library**
   - Use dateutil.parser for flexible parsing
   - Handle multiple date formats automatically
   - Support locale-specific formats

3. **Implement relative date parsing**
   - Parse "today", "tomorrow", "yesterday"
   - Handle "next week", "next month"
   - Process "in 3 days", "2 weeks ago"

4. **Add specific date format support**
   - ISO format: 2025-03-15
   - Common formats: 15/03/2025, March 15, 2025
   - Informal: 15th March, Mar 15

5. **Configure weekday parsing**
   - Parse day names: Monday, Tuesday, etc.
   - Handle "next Monday", "this Friday"
   - Calculate dates from current week

6. **Define normalization rules**
   - Convert all dates to ISO format (YYYY-MM-DD)
   - Include time if specified (YYYY-MM-DD HH:MM)
   - Use tenant timezone for parsing

7. **Add validation rules**
   - Date must be valid calendar date
   - Check reasonable range (past 5 years to future 2 years)
   - Warn for past dates in ordering context

8. **Configure confidence scoring**
   - ISO format: 0.95 confidence
   - Relative dates: 0.90 confidence
   - Informal formats: 0.80 confidence

### DATE Parsing Examples

| User Input | Current Date | Parsed Date | Format |
|------------|--------------|-------------|--------|
| "tomorrow" | 2025-01-31 | 2025-02-01 | Relative |
| "next week" | 2025-01-31 | 2025-02-07 | Relative |
| "15th March" | 2025-01-31 | 2025-03-15 | Informal |
| "2025-04-20" | 2025-01-31 | 2025-04-20 | ISO |
| "next Monday" | 2025-01-31 | 2025-02-03 | Weekday |

### Relative Date Calculations

| Expression | Calculation | Example |
|------------|-------------|---------|
| today | Current date | 2025-01-31 |
| tomorrow | +1 day | 2025-02-01 |
| yesterday | -1 day | 2025-01-30 |
| next week | +7 days | 2025-02-07 |
| next month | +1 month | 2025-02-28 |
| in 3 days | +3 days | 2025-02-03 |

### Supported Date Formats

| Format | Example | Description |
|--------|---------|-------------|
| ISO 8601 | 2025-03-15 | Standard format |
| DD/MM/YYYY | 15/03/2025 | Common format |
| MM/DD/YYYY | 03/15/2025 | US format |
| Full Text | March 15, 2025 | Written format |
| Abbreviated | Mar 15, 2025 | Short month |
| Ordinal | 15th March 2025 | With ordinal |

### DATE Entity Configuration

| Property | Value | Description |
|----------|-------|-------------|
| type | DATE | Entity type identifier |
| priority | Medium | Medium priority |
| extractor | Regex + dateutil | Hybrid approach |
| validator | DateValidator | Check valid date |
| normalizer | to_iso | ISO format |
| timezone | Tenant timezone | For parsing |

### Validation Rules

| Rule | Check | Message |
|------|-------|---------|
| Valid Date | Parseable date | "Invalid date" |
| Future Check | For delivery dates | "Date in past" |
| Range Check | Within 5 years | "Date out of range" |

### Expected Outcome
- DATE entity type configured
- Multiple format support implemented
- Relative date parsing specified
- Normalization to ISO format defined

### Verification Checklist
- [ ] DATE added to entity registry
- [ ] dateutil parser configured
- [ ] Relative date parsing implemented
- [ ] Format support documented
- [ ] Validation rules established

---

## Task 41: Create PHONE Entity

### Overview
Define the PHONE entity type for extracting phone numbers from user messages. This entity specifically handles Sri Lankan phone number formats including mobile numbers with +94 prefix and local formats with leading zero.

### Dependencies
- Task 36: Create extract Method

### Instructions

1. **Define PHONE entity type constant**
   - Add PHONE to entity type registry
   - Define entity type string as "PHONE"
   - Configure for medium priority extraction

2. **Configure Sri Lankan mobile formats**
   - International format: +94 followed by 9 digits
   - Local format: 0 followed by 9 digits
   - Common mobile prefixes: 070, 071, 072, 075, 076, 077, 078

3. **Configure landline formats**
   - Colombo: 011 followed by 7 digits
   - Other areas: 0XX followed by 7 digits
   - Support with/without spaces and hyphens

4. **Define normalization rules**
   - Convert all to international format (+94XXXXXXXXX)
   - Remove spaces, hyphens, parentheses
   - Replace leading 0 with +94

5. **Add format validation**
   - Verify digit count (9 digits after country code)
   - Validate mobile prefixes
   - Check landline area codes

6. **Configure confidence scoring**
   - With +94 prefix: 0.95 confidence
   - With 0 prefix and valid format: 0.90 confidence
   - Without prefix but valid length: 0.70 confidence

### Sri Lankan Phone Number Formats

| Format Type | Pattern | Example |
|-------------|---------|---------|
| International Mobile | +94XXXXXXXXX | +94771234567 |
| Local Mobile | 0XXXXXXXXX | 0771234567 |
| Mobile with Spaces | +94 XX XXX XXXX | +94 77 123 4567 |
| Mobile with Hyphens | 0XX-XXX-XXXX | 077-123-4567 |
| Colombo Landline | 011XXXXXXX | 0112345678 |
| Provincial Landline | 0XXXXXXXXX | 0812345678 |

### Valid Mobile Prefixes

| Operator | Prefixes | Example |
|----------|----------|---------|
| Dialog | 076, 077 | 0771234567 |
| Mobitel | 071, 072 | 0712345678 |
| Hutch | 078 | 0781234567 |
| Airtel | 070, 075 | 0701234567 |

### Phone Number Normalization

| Input | Normalized | Notes |
|-------|------------|-------|
| +94771234567 | +94771234567 | Already normalized |
| 0771234567 | +94771234567 | Replace 0 with +94 |
| 077 123 4567 | +94771234567 | Remove spaces |
| 077-123-4567 | +94771234567 | Remove hyphens |
| (077) 123 4567 | +94771234567 | Remove parentheses |

### PHONE Entity Configuration

| Property | Value | Description |
|----------|-------|-------------|
| type | PHONE | Entity type identifier |
| priority | Medium | Medium priority |
| extractor | Regex | Pattern matching |
| validator | PhoneValidator | Format validation |
| normalizer | to_international | +94 format |
| country_code | +94 | Sri Lanka |

### Regex Pattern Components

| Component | Pattern | Matches |
|-----------|---------|---------|
| International | \+94[0-9]{9} | +94771234567 |
| Local Mobile | 0(7[0-8])[0-9]{7} | 0771234567 |
| Landline | 0(11\|[2-9][0-9])[0-9]{7} | 0112345678 |
| With Separators | Allow spaces/hyphens | 077-123-4567 |

### Validation Rules

| Rule | Check | Message |
|------|-------|---------|
| Format | Matches pattern | "Invalid phone format" |
| Prefix | Valid operator prefix | "Invalid mobile prefix" |
| Length | Correct digit count | "Invalid phone length" |

### Expected Outcome
- PHONE entity type configured for Sri Lankan numbers
- Multiple format support implemented
- Normalization to international format
- Validation rules established

### Verification Checklist
- [ ] PHONE added to entity registry
- [ ] Sri Lankan format patterns defined
- [ ] Mobile and landline support configured
- [ ] Normalization rules specified
- [ ] Validation implemented

---

## Task 42: Create EMAIL Entity

### Overview
Define the EMAIL entity type for extracting email addresses from user messages. This entity uses RFC 5322 compliant regex patterns to identify valid email addresses with format validation.

### Dependencies
- Task 36: Create extract Method

### Instructions

1. **Define EMAIL entity type constant**
   - Add EMAIL to entity type registry
   - Define entity type string as "EMAIL"
   - Configure for low priority extraction

2. **Configure email regex pattern**
   - Use RFC 5322 compliant pattern
   - Support common email formats
   - Handle subdomains and special characters

3. **Define basic pattern components**
   - Local part: alphanumeric + dots, hyphens, underscores
   - @ symbol required
   - Domain: alphanumeric + dots, hyphens
   - TLD: 2+ characters

4. **Add format validation**
   - Verify @ symbol present
   - Check domain has TLD
   - Validate character restrictions

5. **Configure normalization rules**
   - Convert to lowercase
   - Trim whitespace
   - Keep original format otherwise

6. **Add confidence scoring**
   - Complete valid format: 0.95 confidence
   - Missing TLD but valid otherwise: 0.70 confidence
   - Suspicious format: 0.50 confidence

7. **Handle edge cases**
   - Multiple @ symbols (invalid)
   - Email in brackets or parentheses
   - Email with display name: "John Doe <john@example.com>"

### Email Format Examples

| Pattern | Example | Valid |
|---------|---------|-------|
| Basic | user@domain.com | ✓ |
| With Dots | first.last@company.com | ✓ |
| With Hyphens | user-name@domain.com | ✓ |
| With Numbers | user123@domain.com | ✓ |
| Subdomain | user@mail.domain.com | ✓ |
| Plus Sign | user+tag@domain.com | ✓ |
| Underscore | user_name@domain.com | ✓ |
| Missing @ | userdomain.com | ✗ |
| Multiple @ | user@@domain.com | ✗ |
| No TLD | user@domain | ✗ |

### EMAIL Entity Configuration

| Property | Value | Description |
|----------|-------|-------------|
| type | EMAIL | Entity type identifier |
| priority | Low | Lower priority |
| extractor | Regex | Pattern matching |
| validator | EmailValidator | Format check |
| normalizer | to_lowercase | Lowercase email |
| pattern | RFC 5322 | Standard compliant |

### Regex Pattern Structure

```
^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+
  @
[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?
  (?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*
$
```

### Pattern Components

| Component | Pattern | Description |
|-----------|---------|-------------|
| Local Part | [a-zA-Z0-9._%+-]+ | Before @ symbol |
| @ Symbol | @ | Required separator |
| Domain | [a-zA-Z0-9.-]+ | Domain name |
| TLD | \.[a-zA-Z]{2,} | Top-level domain |

### Validation Rules

| Rule | Check | Message |
|------|-------|---------|
| Format | Matches RFC 5322 | "Invalid email format" |
| @ Present | Contains @ symbol | "Missing @ symbol" |
| TLD Present | Has valid TLD | "Invalid domain" |
| Length | < 254 characters | "Email too long" |

### Edge Case Handling

| Input | Extraction | Notes |
|-------|------------|-------|
| "Contact john@example.com" | john@example.com | Simple extraction |
| "Email: <user@domain.com>" | user@domain.com | Remove brackets |
| "John Doe <j@d.com>" | j@d.com | Extract from display name |
| "user@@domain.com" | None | Invalid format |

### Expected Outcome
- EMAIL entity type configured
- RFC 5322 compliant pattern implemented
- Format validation specified
- Normalization rules defined

### Verification Checklist
- [ ] EMAIL added to entity registry
- [ ] RFC 5322 pattern implemented
- [ ] Format validation configured
- [ ] Normalization to lowercase
- [ ] Edge cases handled

---

## Task 43: Create Regex Extractor

### Overview
Create the RegexExtractor class as a specialized entity extractor using regular expression patterns. This class implements pattern-based extraction for structured entities like order IDs, phone numbers, and email addresses with high precision.

### Dependencies
- Task 42: Create EMAIL Entity

### Instructions

1. **Create regex.py file**
   - Create `extraction/regex.py` in extraction directory
   - This file contains RegexExtractor class
   - Import Python re module for regex operations

2. **Define RegexExtractor class**
   - Create class named `RegexExtractor`
   - Implement extractor interface from EntityExtractor
   - Initialize with pattern registry

3. **Create pattern registry**
   - Define dictionary to store entity patterns
   - Map entity type to compiled regex patterns
   - Support multiple patterns per entity type

4. **Implement pattern registration**
   - Create method `register_pattern`
   - Accept entity type and regex pattern
   - Compile pattern for efficiency

5. **Create extract method**
   - Implement `extract(text)` method
   - Apply all registered patterns to text
   - Return list of matches with positions

6. **Add match metadata**
   - Capture matched text and position
   - Store match groups if pattern has groups
   - Include pattern name that matched

7. **Implement confidence calculation**
   - Base confidence from pattern specificity
   - Higher confidence for more specific patterns
   - Adjust based on context validation

8. **Add pattern compilation optimization**
   - Compile patterns once during initialization
   - Cache compiled patterns for reuse
   - Handle pattern compilation errors

9. **Configure flags and options**
   - Support case-insensitive matching (re.IGNORECASE)
   - Multi-line matching if needed (re.MULTILINE)
   - Unicode support (re.UNICODE)

### RegexExtractor Architecture

```
RegexExtractor
    │
    ├─── Pattern Registry
    │    ├─── ORDER_ID: [pattern1, pattern2]
    │    ├─── PHONE: [mobile_pattern, landline_pattern]
    │    └─── EMAIL: [email_pattern]
    │
    ├─── extract(text)
    │    ├─── Loop through patterns
    │    ├─── Apply to text
    │    └─── Collect matches
    │
    └─── Match Result
         ├─── entity_type
         ├─── value
         ├─── start_pos
         ├─── end_pos
         └─── confidence
```

### Pattern Registry Structure

| Entity Type | Patterns | Priority |
|-------------|----------|----------|
| ORDER_ID | #\d{5,8}, ORD-\d{5,8} | High |
| PHONE | +94\d{9}, 0\d{9} | High |
| EMAIL | RFC 5322 pattern | Medium |
| QUANTITY | \d+, number words | Low |

### Extract Method Flow

```
Input: "Order #12345 to +94771234567"
         │
         ▼
    Loop Pattern Registry
         │
    ┌────┴────┬────────┐
    ▼         ▼        ▼
ORDER_ID   PHONE    EMAIL
   │         │        │
   ▼         ▼        ▼
#12345  +94771234567  None
         │
         ▼
    Collect Matches
         │
         ▼
Output: [
  {type: ORDER_ID, value: "12345", start: 6, end: 12},
  {type: PHONE, value: "+94771234567", start: 16, end: 28}
]
```

### Match Result Format

```
{
  "entity_type": "ORDER_ID",
  "value": "12345",
  "raw_value": "#12345",
  "start_pos": 6,
  "end_pos": 12,
  "pattern_name": "hash_prefix",
  "confidence": 0.95,
  "groups": []
}
```

### Pattern Flags Configuration

| Flag | Usage | Purpose |
|------|-------|---------|
| re.IGNORECASE | Case-insensitive | Match regardless of case |
| re.MULTILINE | Multi-line mode | ^ and $ match line boundaries |
| re.UNICODE | Unicode support | Handle international characters |
| re.VERBOSE | Readable patterns | Allow comments in patterns |

### Expected Outcome
- RegexExtractor class implemented
- Pattern registry system created
- Extract method functioning
- Match metadata captured

### Verification Checklist
- [ ] `backend/apps/chatbot/extraction/regex.py` created
- [ ] RegexExtractor class defined
- [ ] Pattern registry implemented
- [ ] Extract method returns proper format
- [ ] Confidence calculation included

---

## Task 44: Create Order ID Pattern

### Overview
Define specific regex patterns for extracting order IDs from user messages. Implement multiple pattern variations to handle different order ID formats commonly used in e-commerce systems.

### Dependencies
- Task 43: Create Regex Extractor

### Instructions

1. **Define hash prefix pattern**
   - Pattern: `#\d{5,8}`
   - Matches: #12345, #123456, #1234567
   - Most specific and high confidence

2. **Define ORD prefix pattern**
   - Pattern: `ORD-?\d{5,8}`
   - Matches: ORD-12345, ORD12345
   - Optional hyphen between prefix and number

3. **Define order keyword pattern**
   - Pattern: `order\s+(?:number\s+)?(\d{5,8})`
   - Matches: "order 12345", "order number 12345"
   - Case-insensitive matching

4. **Define standalone number pattern**
   - Pattern: `\b\d{5,8}\b`
   - Matches: standalone 5-8 digit numbers
   - Lower confidence, requires context

5. **Register all patterns**
   - Add each pattern to RegexExtractor
   - Assign confidence levels to each pattern
   - Set pattern names for debugging

6. **Configure pattern priority**
   - Hash prefix: Priority 1 (0.95 confidence)
   - ORD prefix: Priority 2 (0.95 confidence)
   - Order keyword: Priority 3 (0.85 confidence)
   - Standalone: Priority 4 (0.60 confidence)

7. **Add capture groups**
   - Extract numeric portion in capture group
   - Allow easy normalization from matches
   - Handle prefix removal automatically

### Order ID Pattern Specifications

| Pattern Name | Regex | Example Matches | Confidence |
|--------------|-------|-----------------|------------|
| hash_prefix | `#\d{5,8}` | #12345, #1234567 | 0.95 |
| ord_prefix | `ORD-?\d{5,8}` | ORD-12345, ORD67890 | 0.95 |
| order_keyword | `order\s+(?:number\s+)?(\d{5,8})` | order 12345, order number 67890 | 0.85 |
| standalone | `\b\d{5,8}\b` | 12345, 1234567 | 0.60 |

### Pattern Testing Examples

| Input Text | Matched Pattern | Extracted Value |
|------------|-----------------|-----------------|
| "Status of #12345" | hash_prefix | 12345 |
| "Cancel ORD-67890" | ord_prefix | 67890 |
| "My order 23456" | order_keyword | 23456 |
| "Order number 98765" | order_keyword | 98765 |
| "Check 11223 status" | standalone | 11223 |

### Pattern Compilation

```
Patterns compiled with flags:
- re.IGNORECASE (case-insensitive)
- re.UNICODE (Unicode support)

Compiled Patterns:
1. hash_prefix = re.compile(r'#\d{5,8}', re.IGNORECASE | re.UNICODE)
2. ord_prefix = re.compile(r'ORD-?\d{5,8}', re.IGNORECASE | re.UNICODE)
3. order_keyword = re.compile(r'order\s+(?:number\s+)?(\d{5,8})', re.IGNORECASE | re.UNICODE)
4. standalone = re.compile(r'\b\d{5,8}\b', re.UNICODE)
```

### Capture Group Usage

| Pattern | Capture Group | Purpose |
|---------|---------------|---------|
| hash_prefix | Group 0 | Full match including # |
| ord_prefix | Group 0 | Full match including ORD- |
| order_keyword | Group 1 | Only the numeric ID |
| standalone | Group 0 | The number itself |

### Conflict Resolution

| Scenario | Resolution |
|----------|------------|
| Multiple patterns match | Use highest confidence |
| Overlapping matches | Choose most specific |
| Same number different formats | Prefer explicit format (#, ORD-) |

### Expected Outcome
- Order ID patterns registered in RegexExtractor
- Multiple format support implemented
- Confidence levels assigned
- Pattern priority configured

### Verification Checklist
- [ ] Hash prefix pattern defined
- [ ] ORD prefix pattern defined
- [ ] Order keyword pattern defined
- [ ] Standalone pattern defined
- [ ] All patterns registered with confidence levels

---

## Task 45: Create Phone Pattern

### Overview
Define specific regex patterns for extracting Sri Lankan phone numbers from user messages. Implement patterns for both mobile and landline formats with proper normalization to international format.

### Dependencies
- Task 43: Create Regex Extractor

### Instructions

1. **Define international mobile pattern**
   - Pattern: `\+94\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}`
   - Matches: +94771234567, +94 77 123 4567
   - Allows optional spacing

2. **Define local mobile pattern**
   - Pattern: `0[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}`
   - Matches: 0771234567, 077 123 4567
   - 10 digits starting with 0

3. **Define landline pattern**
   - Pattern: `0(11|[2-9][0-9])\s?[0-9]{7}`
   - Matches: 0112345678, 0812345678
   - Colombo (011) and provincial codes

4. **Add separator tolerance**
   - Allow spaces: `\s?` between digit groups
   - Allow hyphens: `[-\s]?` as alternative
   - Allow parentheses: `\(?\d+\)?`

5. **Register all phone patterns**
   - Add international mobile pattern (highest confidence)
   - Add local mobile pattern (high confidence)
   - Add landline pattern (medium confidence)

6. **Configure normalization**
   - Remove all spaces and hyphens
   - Convert local (0XX) to international (+94XX)
   - Validate digit count after normalization

7. **Set confidence levels**
   - International format: 0.95 confidence
   - Local mobile: 0.90 confidence
   - Landline: 0.85 confidence

### Phone Pattern Specifications

| Pattern Name | Regex | Example | Confidence |
|--------------|-------|---------|------------|
| international_mobile | `\+94[0-9]{9}` | +94771234567 | 0.95 |
| international_spaced | `\+94\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}` | +94 77 123 4567 | 0.95 |
| local_mobile | `0[0-9]{2}[0-9]{7}` | 0771234567 | 0.90 |
| local_mobile_spaced | `0[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}` | 077 123 4567 | 0.90 |
| landline | `0(11\|[2-9][0-9])[0-9]{7}` | 0112345678 | 0.85 |

### Mobile Prefix Validation

| Prefix | Operator | Valid |
|--------|----------|-------|
| 070 | Mobitel/Airtel | ✓ |
| 071 | Mobitel | ✓ |
| 072 | Mobitel | ✓ |
| 075 | Airtel | ✓ |
| 076 | Dialog | ✓ |
| 077 | Dialog | ✓ |
| 078 | Hutch | ✓ |

### Normalization Examples

| Input | Pattern Matched | Normalized Output |
|-------|----------------|-------------------|
| +94771234567 | international_mobile | +94771234567 |
| +94 77 123 4567 | international_spaced | +94771234567 |
| 0771234567 | local_mobile | +94771234567 |
| 077 123 4567 | local_mobile_spaced | +94771234567 |
| 077-123-4567 | local_mobile_spaced | +94771234567 |
| 0112345678 | landline | +94112345678 |

### Pattern Compilation with Flags

```
Patterns compiled with:
- re.IGNORECASE: Not needed for numbers
- re.UNICODE: Support Unicode digits

Mobile International:
re.compile(r'\+94[0-9]{9}', re.UNICODE)

Mobile Local:
re.compile(r'0[0-9]{2}[0-9]{7}', re.UNICODE)

Mobile with Spaces:
re.compile(r'\+94\s?[0-9]{2}\s?[0-9]{3}\s?[0-9]{4}', re.UNICODE)

Landline:
re.compile(r'0(11|[2-9][0-9])[0-9]{7}', re.UNICODE)
```

### Validation After Extraction

| Check | Rule | Action |
|-------|------|--------|
| Digit Count | Must be 9 after +94 | Reject if not |
| Mobile Prefix | Must be 070-078 | Validate prefix |
| Landline Area | Valid area code | Check area code |

### Expected Outcome
- Phone patterns registered for Sri Lankan numbers
- International and local format support
- Normalization rules configured
- Prefix validation implemented

### Verification Checklist
- [ ] International mobile pattern defined
- [ ] Local mobile pattern defined
- [ ] Landline pattern defined
- [ ] Separator tolerance added
- [ ] All patterns registered with confidence
- [ ] Normalization to +94 format specified

---

## Summary

This document covered the foundational entity extraction system with Tasks 35-45. You've established:

✅ **EntityExtractor Class** - Core extraction orchestrator
✅ **extract Method** - Unified extraction interface
✅ **Six Entity Types** - ORDER_ID, PRODUCT_NAME, QUANTITY, DATE, PHONE, EMAIL
✅ **RegexExtractor** - Pattern-based extraction engine
✅ **Order ID Patterns** - Multiple format support
✅ **Phone Patterns** - Sri Lankan number formats

### Extraction Capabilities Summary

| Entity Type | Extractor | Formats | Confidence |
|-------------|-----------|---------|------------|
| ORDER_ID | Regex | #12345, ORD-12345 | 0.95 |
| PRODUCT_NAME | SpaCy + Fuzzy | Catalog matching | 0.75-0.95 |
| QUANTITY | Regex + NLP | 5, five, 5 units | 0.80-0.95 |
| DATE | Regex + dateutil | Tomorrow, 2025-03-15 | 0.80-0.95 |
| PHONE | Regex | +94771234567 | 0.85-0.95 |
| EMAIL | Regex | user@domain.com | 0.95 |

### Next Steps

Continue to [02_Tasks-46-50_SpaCy-Context-Verify.md](02_Tasks-46-50_SpaCy-Context-Verify.md) to implement:
- SpaCy NER extractor
- Entity caching
- Context-based entity resolution
- Entity validation
- Extraction verification

---

**End of Document 01 of 02**
