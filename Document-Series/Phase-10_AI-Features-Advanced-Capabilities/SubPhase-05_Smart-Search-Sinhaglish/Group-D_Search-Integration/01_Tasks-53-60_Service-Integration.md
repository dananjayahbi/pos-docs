# Tasks 53-60: Service Integration and Query Expansion

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** D - Search Integration  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59, 60

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-61-66_MultiScript-Tamil.md](02_Tasks-61-66_MultiScript-Tamil.md)

---

## Document Overview

This document covers the creation of the SinhaglishService, which integrates Sinhaglish search capabilities with the main search system. It establishes query expansion, tokenization, translation, and search service integration through pre-search hooks. The service transforms romanized Sinhalese queries into expanded multi-language search terms.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create SinhaglishService | High | 90 min |
| 54 | Create expand_query Method | Medium | 60 min |
| 55 | Create tokenize Method | Low | 30 min |
| 56 | Create translate_token | Medium | 45 min |
| 57 | Create Query Expansion | Medium | 45 min |
| 58 | Create Multi-Term Query | Medium | 45 min |
| 59 | Create SearchService Integration | Medium | 45 min |
| 60 | Create pre_search_hook | Medium | 45 min |

---

## Task 53: Create SinhaglishService

### Overview
Create the main SinhaglishService class that serves as the central service for handling Sinhaglish search queries. This service orchestrates query expansion, tokenization, translation, and integration with the existing search infrastructure. It acts as a bridge between user input in romanized Sinhala and the search engine's multi-language capabilities.

### Dependencies
- Task 52 (from Group-C): Phonetic matching system must be complete
- SinhalaWord model must exist with dictionary data
- Variant system must be operational
- Search infrastructure must be established

### Instructions

1. **Create service directory structure**
   - Navigate to `backend/apps/search/sinhaglish/` directory
   - Create new directory named `services`
   - Create `__init__.py` file in services directory
   - This will house the main Sinhaglish service

2. **Create SinhaglishService file**
   - Create `sinhaglish_service.py` in the services directory
   - Set up Python class structure
   - Import necessary dependencies (SinhalaWord, variants, phonetics)

3. **Define SinhaglishService class**
   - Create main class `SinhaglishService`
   - Initialize with references to dictionary and phonetic matcher
   - Set up configuration options (max expansions, confidence threshold)

4. **Initialize dictionary access**
   - Set up database query access to SinhalaWord model
   - Implement caching mechanism for frequently accessed words
   - Configure variant lookup access
   - Set up phonetic matcher integration

5. **Define service interface**
   - Plan method signatures for public API
   - expand_query: Main entry point for query expansion
   - tokenize: Break query into searchable tokens
   - translate_token: Convert single token to translations
   - Support helper methods for internal operations

6. **Implement configuration options**
   - max_expansions: Limit number of translations per term
   - confidence_threshold: Minimum match confidence to include
   - enable_phonetic: Toggle phonetic matching
   - enable_variants: Toggle variant lookup
   - cache_ttl: Cache time-to-live for translations

7. **Set up error handling**
   - Handle database connection errors gracefully
   - Manage missing dictionary entries
   - Handle malformed queries
   - Provide fallback to original query on failures

8. **Implement service initialization**
   - Create singleton pattern or service registry
   - Lazy load dictionary data if needed
   - Set up logging for debugging
   - Initialize performance monitoring

### Service Architecture

```
┌─────────────────────────────────────────────┐
│        SinhaglishService                    │
├─────────────────────────────────────────────┤
│  Configuration                              │
│  ├── max_expansions: 5                     │
│  ├── confidence_threshold: 0.7             │
│  └── caching enabled                        │
├─────────────────────────────────────────────┤
│  Components                                 │
│  ├── Dictionary Access (SinhalaWord)       │
│  ├── Variant Lookup                        │
│  ├── Phonetic Matcher                      │
│  └── Cache Layer                            │
├─────────────────────────────────────────────┤
│  Public Methods                             │
│  ├── expand_query(query) → expanded        │
│  ├── tokenize(query) → tokens              │
│  └── translate_token(token) → translations │
└─────────────────────────────────────────────┘
```

### Service Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| max_expansions | int | 5 | Max translations per term |
| confidence_threshold | float | 0.7 | Min match confidence |
| enable_phonetic | bool | True | Use phonetic matching |
| enable_variants | bool | True | Use variant lookup |
| cache_ttl | int | 3600 | Cache duration in seconds |
| max_query_length | int | 200 | Max input query length |

### Service Dependencies

| Component | Purpose | Source |
|-----------|---------|--------|
| SinhalaWord Model | Dictionary data | Group-A Task 06 |
| VariantMatcher | Variant lookup | Group-B Task 34 |
| PhoneticMatcher | Phonetic matching | Group-C Task 52 |
| Cache Backend | Performance optimization | Django cache |

### Service Initialization Flow

```
Initialize SinhaglishService
        │
        ├─→ Load Configuration
        │   ├── Read settings from config
        │   └── Set default values
        │
        ├─→ Setup Database Access
        │   ├── Initialize ORM connection
        │   └── Prepare query filters
        │
        ├─→ Initialize Matchers
        │   ├── Create VariantMatcher instance
        │   └── Create PhoneticMatcher instance
        │
        ├─→ Setup Cache
        │   ├── Connect to cache backend
        │   └── Configure cache keys
        │
        └─→ Ready for Queries
```

### Error Handling Strategy

| Error Type | Handling Approach | Fallback |
|------------|-------------------|----------|
| Database Error | Log and retry once | Return original query |
| Missing Dictionary | Log warning | Use phonetic only |
| Invalid Input | Sanitize input | Remove invalid chars |
| Cache Failure | Continue without cache | Direct database query |
| Timeout | Abort after 5 seconds | Return partial results |

### Performance Considerations

| Concern | Solution |
|---------|----------|
| Slow dictionary lookup | Implement caching layer |
| Large result sets | Limit expansions per term |
| Multiple queries | Batch translation requests |
| Memory usage | Use generator patterns |
| Response time | Set timeout limits |

### Expected Outcome
- Functional SinhaglishService class with complete structure
- Proper initialization of all components
- Configuration system in place
- Error handling implemented
- Ready to receive method implementations (Tasks 54-58)

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/services/` directory created
- [ ] `sinhaglish_service.py` file created
- [ ] SinhaglishService class defined
- [ ] Configuration options implemented
- [ ] Dictionary access initialized
- [ ] Variant matcher integrated
- [ ] Phonetic matcher integrated
- [ ] Cache layer configured
- [ ] Error handling implemented
- [ ] Service can be instantiated successfully
- [ ] Logging configured
- [ ] Service exports properly from `__init__.py`

---

## Task 54: Create expand_query Method

### Overview
Implement the expand_query method, which is the main entry point for the SinhaglishService. This method takes a user's search query in romanized Sinhala and returns an expanded query containing the original terms plus their English and Sinhala translations. This enables multi-language search without requiring users to switch between languages.

### Dependencies
- Task 53: Create SinhaglishService
- Tasks 55-58: Will implement helper methods called by expand_query

### Instructions

1. **Define method signature**
   - Method name: `expand_query`
   - Input parameter: `query` (string) - user's search input
   - Return type: string - expanded query with all translations
   - Add docstring with examples

2. **Implement input validation**
   - Check if query is not empty or None
   - Trim whitespace from beginning and end
   - Validate query length against max_query_length
   - Return original query if invalid

3. **Implement query caching**
   - Generate cache key from query
   - Check if expanded query exists in cache
   - Return cached result if available
   - Cache final result before returning

4. **Tokenize the query**
   - Call tokenize method (Task 55) to split query
   - Handle multi-word phrases appropriately
   - Preserve token order for result quality

5. **Translate each token**
   - Loop through each token from tokenization
   - Call translate_token method (Task 56) for each
   - Collect all translations (original, English, Sinhala)
   - Handle translation failures gracefully

6. **Expand the query**
   - Call query expansion logic (Task 57)
   - Combine original query with all translations
   - Format expanded query string
   - Remove duplicate terms

7. **Optimize expansion**
   - Limit total number of terms in expansion
   - Prioritize higher confidence translations
   - Handle multi-term phrases (Task 58)
   - Preserve phrase boundaries

8. **Return expanded query**
   - Format final expanded query string
   - Store in cache for future requests
   - Log query and expansion for analytics
   - Return expanded query to caller

### Method Flow Diagram

```
expand_query(query: "kiri kesel")
        │
        ├─→ Validate Input
        │   └── Check length, not empty
        │
        ├─→ Check Cache
        │   └── Return if found
        │
        ├─→ Tokenize Query
        │   └── ["kiri", "kesel"]
        │
        ├─→ Translate Each Token
        │   ├── "kiri" → ("kiri", "milk", "කිරි")
        │   └── "kesel" → ("kesel", "banana", "කෙසෙල්")
        │
        ├─→ Expand Query
        │   └── Combine all terms
        │
        ├─→ Format Result
        │   └── "kiri kesel milk banana කිරි කෙසෙල්"
        │
        ├─→ Cache Result
        │   └── Store for future use
        │
        └─→ Return Expanded Query
```

### Expansion Examples

| Input Query | Tokenized | Expanded Query |
|-------------|-----------|----------------|
| "kiri" | ["kiri"] | "kiri milk කිරි" |
| "kiri kesel" | ["kiri", "kesel"] | "kiri kesel milk banana කිරි කෙසෙල්" |
| "loku malu" | ["loku", "malu"] | "loku malu big large fish මාළු" |
| "kopi tea" | ["kopi", "tea"] | "kopi tea coffee කෝපි" |

### Query Expansion Strategy

```
Original Query: "kiri kesel"
        │
        ├─→ Token 1: "kiri"
        │   ├── Original: "kiri"
        │   ├── English: "milk"
        │   └── Sinhala: "කිරි"
        │
        └─→ Token 2: "kesel"
            ├── Original: "kesel"
            ├── English: "banana"
            └── Sinhala: "කෙසෙල්"

Combined Expansion:
"kiri kesel milk banana කිරි කෙසෙල්"
```

### Caching Strategy

| Cache Key | Value | TTL |
|-----------|-------|-----|
| `sinhaglish:query:kiri` | "kiri milk කිරි" | 1 hour |
| `sinhaglish:query:kiri kesel` | "kiri kesel milk banana..." | 1 hour |
| `sinhaglish:query:loku malu` | "loku malu big large fish..." | 1 hour |

### Performance Optimization

| Optimization | Benefit |
|--------------|---------|
| Cache frequent queries | Reduce translation overhead |
| Limit expansion terms | Faster search execution |
| Batch translations | Fewer database queries |
| Early validation | Skip invalid queries quickly |

### Error Handling

| Error Scenario | Handling |
|----------------|----------|
| Empty query | Return empty string |
| Very long query | Truncate to max_query_length |
| Translation failure | Include only successful translations |
| Cache unavailable | Continue without caching |
| All translations fail | Return original query |

### Expected Outcome
- Functional expand_query method that orchestrates full expansion
- Proper integration with tokenize and translate_token methods
- Efficient caching implementation
- Multi-language query expansion working correctly
- Original query preserved in expansion

### Verification Checklist
- [ ] expand_query method implemented in SinhaglishService
- [ ] Input validation working correctly
- [ ] Cache check and storage implemented
- [ ] Tokenization integration complete
- [ ] Translation integration complete
- [ ] Query expansion logic working
- [ ] Multi-language terms included in output
- [ ] Error handling for edge cases
- [ ] Performance acceptable (< 100ms for common queries)
- [ ] Method documented with examples

---

## Task 55: Create tokenize Method

### Overview
Implement the tokenize method that splits a search query into individual tokens (words or terms). This method handles the segmentation of user input, preparing it for translation. It must preserve important query structure while breaking text into searchable units.

### Dependencies
- Task 54: Create expand_query Method (calls this method)

### Instructions

1. **Define method signature**
   - Method name: `tokenize`
   - Input parameter: `query` (string) - search query to tokenize
   - Return type: list of strings - individual tokens
   - Add docstring with examples

2. **Implement basic tokenization**
   - Split query by whitespace (spaces, tabs, newlines)
   - Use string split() method or regex for robustness
   - Handle multiple consecutive spaces

3. **Clean individual tokens**
   - Strip whitespace from each token
   - Remove empty tokens from result list
   - Convert to lowercase for consistency

4. **Handle special characters**
   - Decide on punctuation handling (keep or remove)
   - Preserve hyphens in compound words if needed
   - Remove or preserve numbers based on requirements

5. **Preserve phrase markers (optional)**
   - Detect quoted phrases "kiri bath"
   - Keep phrases as single tokens if quotes present
   - Remove quotes but preserve phrase grouping

6. **Implement token validation**
   - Filter out single-character tokens (unless meaningful)
   - Remove stop words if configured (optional)
   - Validate token length (min/max)

7. **Optimize token list**
   - Remove duplicate tokens while preserving order
   - Limit maximum number of tokens
   - Sort by relevance if needed

8. **Return token list**
   - Return list of clean, validated tokens
   - Preserve original order from query
   - Handle empty result (return empty list)

### Tokenization Flow

```
tokenize("kiri kesel and loku malu")
        │
        ├─→ Split by Whitespace
        │   └── ["kiri", "kesel", "and", "loku", "malu"]
        │
        ├─→ Clean Tokens
        │   └── Strip spaces, lowercase
        │
        ├─→ Remove Stop Words (optional)
        │   └── ["kiri", "kesel", "loku", "malu"]
        │
        ├─→ Validate Tokens
        │   └── Check length, characters
        │
        └─→ Return Token List
            └── ["kiri", "kesel", "loku", "malu"]
```

### Tokenization Examples

| Input Query | Tokenized Output |
|-------------|------------------|
| "kiri" | ["kiri"] |
| "kiri kesel" | ["kiri", "kesel"] |
| "loku  malu" | ["loku", "malu"] |
| "Kiri Kesel" | ["kiri", "kesel"] |
| "  kiri  " | ["kiri"] |
| "kiri-bath" | ["kiri-bath"] or ["kiri", "bath"] |

### Special Cases

| Case | Handling | Example |
|------|----------|---------|
| Multiple spaces | Collapse to single split | "kiri  kesel" → ["kiri", "kesel"] |
| Leading/trailing spaces | Strip before splitting | "  kiri  " → ["kiri"] |
| Mixed case | Convert to lowercase | "Kiri" → ["kiri"] |
| Empty query | Return empty list | "" → [] |
| Single word | Return single-item list | "kiri" → ["kiri"] |

### Token Cleaning Process

```
Token: "  Kiri  "
    │
    ├─→ Strip Whitespace
    │   └── "Kiri"
    │
    ├─→ Convert to Lowercase
    │   └── "kiri"
    │
    ├─→ Validate Length
    │   └── ✓ Valid (>= 2 chars)
    │
    └─→ Return Token
        └── "kiri"
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| min_token_length | int | 2 | Minimum token length |
| max_token_length | int | 50 | Maximum token length |
| preserve_hyphens | bool | True | Keep hyphenated words together |
| remove_numbers | bool | False | Filter out numeric tokens |
| max_tokens | int | 10 | Maximum tokens to return |

### Token Validation Rules

| Rule | Description | Action |
|------|-------------|--------|
| Minimum length | Token must be at least 2 characters | Discard if shorter |
| Maximum length | Token must not exceed 50 characters | Truncate or discard |
| Empty token | Token is empty or whitespace only | Discard |
| Valid characters | Token contains valid characters | Keep or clean |

### Performance Considerations

| Consideration | Implementation |
|---------------|----------------|
| Simple split | Use built-in string.split() for speed |
| Avoid regex | Use regex only if complex rules needed |
| List comprehension | Efficient token cleaning |
| Early validation | Filter invalid tokens early |

### Expected Outcome
- Functional tokenize method that splits queries correctly
- Clean, lowercase tokens returned
- Special cases handled appropriately
- Empty and invalid tokens filtered out
- Efficient tokenization for typical queries

### Verification Checklist
- [ ] tokenize method implemented in SinhaglishService
- [ ] Query split by whitespace correctly
- [ ] Tokens stripped and lowercased
- [ ] Empty tokens filtered out
- [ ] Multiple spaces handled correctly
- [ ] Special characters handled as configured
- [ ] Token validation rules applied
- [ ] Returns list of strings
- [ ] Handles empty query gracefully
- [ ] Performance acceptable (< 10ms)

---

## Task 56: Create translate_token Method

### Overview
Implement the translate_token method that takes a single romanized Sinhala token and returns its translations in English and Sinhala script. This method coordinates dictionary lookup, variant matching, and phonetic matching to find the best translations for a given token.

### Dependencies
- Task 55: Create tokenize Method
- SinhalaWord model with dictionary data
- VariantMatcher from Group-B
- PhoneticMatcher from Group-C

### Instructions

1. **Define method signature**
   - Method name: `translate_token`
   - Input parameter: `token` (string) - single romanized word
   - Return type: tuple (original, english, sinhala) or dict
   - Add docstring with examples

2. **Implement token caching**
   - Generate cache key for token
   - Check cache for existing translation
   - Return cached translation if available
   - Cache new translations before returning

3. **Implement exact match lookup**
   - Query SinhalaWord model for exact romanized match
   - Filter by active=True entries
   - If found, extract English and Sinhala translations
   - Return immediately if exact match found

4. **Implement variant lookup**
   - If no exact match, use VariantMatcher
   - Look up token in variant system
   - Find canonical form of token
   - Query dictionary with canonical form

5. **Implement phonetic matching**
   - If variant lookup fails, use PhoneticMatcher
   - Generate phonetic code for token
   - Find words with similar phonetic codes
   - Rank by phonetic similarity score
   - Return best match above confidence threshold

6. **Handle multiple translations**
   - If multiple matches found, select best one
   - Prioritize exact matches over variants
   - Prioritize variants over phonetic matches
   - Use frequency or popularity if available

7. **Format translation result**
   - Structure: (original_token, english_translation, sinhala_script)
   - Example: ("kiri", "milk", "කිරි")
   - Include confidence score if using phonetic matching
   - Handle missing translations gracefully

8. **Handle translation failures**
   - If no translation found, return original token only
   - Structure: (token, token, token) to maintain consistency
   - Log failed translations for dictionary improvement
   - Don't fail entire query on single token failure

### Translation Flow

```
translate_token("kiri")
        │
        ├─→ Check Cache
        │   └── Not found, continue
        │
        ├─→ Exact Match Lookup
        │   ├── Query SinhalaWord.romanized = "kiri"
        │   └── ✓ Found: ("kiri", "milk", "කිරි")
        │
        └─→ Return Translation
            └── ("kiri", "milk", "කිරි")

translate_token("keeree")
        │
        ├─→ Check Cache
        │   └── Not found
        │
        ├─→ Exact Match Lookup
        │   └── ✗ Not found
        │
        ├─→ Variant Lookup
        │   ├── Find variant: "keeree" → "kiri"
        │   └── ✓ Found: ("kiri", "milk", "කිරි")
        │
        └─→ Return Translation
            └── ("kiri", "milk", "කිරි")

translate_token("kree")
        │
        ├─→ Exact Match → ✗
        ├─→ Variant Lookup → ✗
        │
        ├─→ Phonetic Match
        │   ├── Generate code: "KR"
        │   ├── Find similar: "kiri" (score 0.85)
        │   └── ✓ Above threshold
        │
        └─→ Return Translation
            └── ("kiri", "milk", "කිරි")
```

### Translation Lookup Priority

```
Priority 1: Exact Match
└── Query: romanized = "kiri"
    └── Result: Immediate return

Priority 2: Variant Match
└── Lookup: "keeree" → canonical "kiri"
    └── Query: romanized = "kiri"
        └── Result: Return with variant note

Priority 3: Phonetic Match
└── Generate: phonetic code "KR"
    └── Query: similar phonetic codes
        └── Rank: by similarity score
            └── Result: Return best match > threshold

Priority 4: No Match
└── Return: (token, token, token)
```

### Translation Examples

| Input Token | Lookup Method | Result |
|-------------|---------------|--------|
| "kiri" | Exact match | ("kiri", "milk", "කිරි") |
| "keeree" | Variant → "kiri" | ("kiri", "milk", "කිරි") |
| "malu" | Exact match | ("malu", "fish", "මාළු") |
| "loku" | Exact match | ("loku", "big", "ලොකු") |
| "unknown" | No match | ("unknown", "unknown", "unknown") |

### Translation Result Structure

| Format | Description | Use Case |
|--------|-------------|----------|
| Tuple | (original, english, sinhala) | Simple, fast |
| Dict | {"original": "kiri", "english": "milk", ...} | More flexibility |
| Object | Translation class instance | Rich metadata |

### Caching Strategy

| Cache Key | Value | Purpose |
|-----------|-------|---------|
| `token:kiri` | ("kiri", "milk", "කිරි") | Exact translations |
| `token:keeree` | ("kiri", "milk", "කිරි") | Variant translations |
| `token:unknown` | ("unknown", "unknown", "unknown") | Failed lookups |

### Error Handling

| Error | Handling |
|-------|----------|
| Database error | Return (token, token, token) |
| Empty token | Return empty tuple or None |
| Invalid characters | Clean token, retry |
| Multiple matches | Select highest confidence |
| Timeout | Return partial result or original |

### Performance Optimization

| Optimization | Benefit |
|--------------|---------|
| Cache all translations | Avoid repeated lookups |
| Limit phonetic candidates | Faster phonetic matching |
| Index dictionary fields | Faster queries |
| Batch token lookups | Reduce database calls |

### Expected Outcome
- Functional translate_token method with multiple lookup strategies
- Proper fallback chain: exact → variant → phonetic → original
- Caching for performance
- Consistent return format
- Graceful handling of unknown tokens

### Verification Checklist
- [ ] translate_token method implemented
- [ ] Exact match lookup working
- [ ] Variant lookup integrated
- [ ] Phonetic match integrated
- [ ] Returns proper tuple/dict structure
- [ ] Caching implemented
- [ ] Handles unknown tokens gracefully
- [ ] Priority order working correctly
- [ ] Performance acceptable (< 20ms per token)
- [ ] Method documented with examples

---

## Task 57: Create Query Expansion

### Overview
Implement the query expansion logic that combines original tokens with their translations to create a multi-language search query. This process takes the tokenized query and translation results, then intelligently formats them into an expanded query string that searches across multiple languages simultaneously.

### Dependencies
- Task 56: Create translate_token Method
- Translation results from translate_token

### Instructions

1. **Define expansion method**
   - Method name: `expand` or integrate into expand_query
   - Input: list of token translations
   - Output: expanded query string
   - Add logic to combine all translation variants

2. **Collect all translations**
   - Iterate through each token's translations
   - Extract original term, English, and Sinhala
   - Store in collection for combining
   - Track which terms have translations

3. **Build expanded query string**
   - Start with original query terms
   - Append English translations
   - Append Sinhala script terms
   - Separate with spaces

4. **Remove duplicate terms**
   - Identify duplicate words in expansion
   - Remove duplicates while preserving first occurrence
   - Keep duplicates if in different scripts
   - Handle case-insensitive duplicates

5. **Implement term prioritization**
   - Place original terms first for relevance
   - Group English translations together
   - Group Sinhala terms together
   - Consider mixing for better results

6. **Optimize query length**
   - Limit total number of terms in expansion
   - Prioritize higher-confidence translations
   - Remove low-value terms if needed
   - Keep query under search engine limits

7. **Format final query string**
   - Join terms with appropriate separator (space)
   - Ensure no extra whitespace
   - Validate final query format
   - Return clean, ready-to-search query

8. **Handle edge cases**
   - Empty translation lists
   - All translations failed
   - Single-word queries
   - Very long expansions

### Query Expansion Flow

```
expand([
    ("kiri", "milk", "කිරි"),
    ("kesel", "banana", "කෙසෙල්")
])
        │
        ├─→ Extract Original Terms
        │   └── ["kiri", "kesel"]
        │
        ├─→ Extract English Translations
        │   └── ["milk", "banana"]
        │
        ├─→ Extract Sinhala Translations
        │   └── ["කිරි", "කෙසෙල්"]
        │
        ├─→ Combine All Terms
        │   └── ["kiri", "kesel", "milk", "banana", "කිරි", "කෙසෙල්"]
        │
        ├─→ Remove Duplicates
        │   └── No duplicates found
        │
        ├─→ Join with Spaces
        │   └── "kiri kesel milk banana කිරි කෙසෙල්"
        │
        └─→ Return Expanded Query
```

### Expansion Strategies

| Strategy | Description | Example |
|----------|-------------|---------|
| Original-first | Original + English + Sinhala | "kiri milk කිරි kesel banana කෙසෙල්" |
| Grouped | All original, then English, then Sinhala | "kiri kesel milk banana කිරි කෙසෙල්" |
| Interleaved | Alternate between languages | "kiri milk කිරි kesel banana කෙසෙල්" |
| Prioritized | High-confidence terms first | "milk kiri කිරි kesel banana කෙසෙල්" |

### Expansion Examples

| Input Translations | Expansion Strategy | Expanded Query |
|-------------------|-------------------|----------------|
| [("kiri", "milk", "කිරි")] | Grouped | "kiri milk කිරි" |
| [("kiri", "milk", "කිරි"), ("kesel", "banana", "කෙසෙල්")] | Grouped | "kiri kesel milk banana කිරි කෙසෙල්" |
| [("loku", "big large", "ලොකු")] | Multiple English | "loku big large ලොකු" |
| [("unknown", "unknown", "unknown")] | No translation | "unknown" |

### Duplicate Removal Logic

```
Terms: ["kiri", "milk", "කිරි", "kiri", "milk"]
    │
    ├─→ Check: "kiri" (first occurrence)
    │   └── Keep
    │
    ├─→ Check: "milk" (first occurrence)
    │   └── Keep
    │
    ├─→ Check: "කිරි" (different script)
    │   └── Keep
    │
    ├─→ Check: "kiri" (duplicate)
    │   └── Remove
    │
    └─→ Check: "milk" (duplicate)
        └── Remove

Result: ["kiri", "milk", "කිරි"]
```

### Term Prioritization

| Priority | Term Type | Reason |
|----------|-----------|--------|
| 1 | Original romanized | User's exact input |
| 2 | English translations | Wider product coverage |
| 3 | Sinhala script | Native language products |
| 4 | Variants | Alternative spellings |

### Length Optimization

| Constraint | Limit | Action if Exceeded |
|------------|-------|-------------------|
| Max terms | 20 terms | Remove lowest-confidence translations |
| Max characters | 500 chars | Truncate expansion |
| Max per language | 10 terms each | Limit translations per language |

### Query Format

```
┌────────────────────────────────────────────┐
│  Expanded Query Format                     │
├────────────────────────────────────────────┤
│  [original terms] [english] [sinhala]      │
│                                            │
│  Example:                                  │
│  kiri kesel milk banana කිරි කෙසෙල්       │
│                                            │
│  Structure:                                │
│  ├── Original: kiri kesel                  │
│  ├── English: milk banana                  │
│  └── Sinhala: කිරි කෙසෙල්                  │
└────────────────────────────────────────────┘
```

### Edge Cases

| Case | Handling |
|------|----------|
| No translations found | Return original query |
| Empty input | Return empty string |
| All same translations | Return single set of terms |
| Partial translations | Include successful translations + originals |
| Very long expansion | Truncate to max length |

### Expected Outcome
- Functional query expansion logic
- Multi-language terms combined effectively
- Duplicates removed appropriately
- Query length optimized
- Clean, well-formatted output

### Verification Checklist
- [ ] Expansion logic implemented
- [ ] Collects all translation variants
- [ ] Combines original, English, and Sinhala terms
- [ ] Removes duplicate terms correctly
- [ ] Respects length limits
- [ ] Returns clean query string
- [ ] Handles edge cases (empty, no translations)
- [ ] Performance acceptable
- [ ] Query format valid for search engine

---

## Task 58: Create Multi-Term Query

### Overview
Implement support for multi-term queries and phrase handling in the Sinhaglish search system. This feature ensures that multi-word phrases like "kiri bath" (milk rice) are expanded correctly, with each term translated independently while preserving phrase structure and relationships.

### Dependencies
- Task 57: Create Query Expansion
- Task 55: Create tokenize Method

### Instructions

1. **Identify phrase patterns**
   - Detect multi-word terms in user query
   - Identify quoted phrases: "kiri bath"
   - Recognize common compound terms
   - Preserve word order in phrases

2. **Implement phrase tokenization**
   - Modify tokenize method to detect phrases
   - Keep phrase terms together when appropriate
   - Also tokenize phrase components individually
   - Return both phrase and component tokens

3. **Translate phrase components**
   - Split phrase into individual words
   - Translate each word independently
   - Keep phrase structure intact
   - Combine component translations

4. **Build phrase expansions**
   - Create expansion for full phrase
   - Create expansions for individual components
   - Include partial phrase matches
   - Maintain term proximity information

5. **Combine phrase and term expansions**
   - Include original phrase in expansion
   - Include component translations
   - Add translated phrase if available
   - Optimize term order for search relevance

6. **Handle common multi-word terms**
   - Identify frequent multi-word combinations
   - Store common phrase translations
   - Expand known phrases as units
   - Fall back to component expansion for unknown phrases

7. **Implement proximity hints**
   - Indicate which terms should appear near each other
   - Use search engine proximity operators if supported
   - Group related translations together
   - Preserve semantic relationships

8. **Optimize multi-term queries**
   - Balance phrase vs component matching
   - Limit expansion size for multi-term queries
   - Prioritize most likely interpretations
   - Maintain query performance

### Multi-Term Query Flow

```
Query: "kiri bath"
        │
        ├─→ Detect Phrase
        │   └── Two-word phrase identified
        │
        ├─→ Tokenize Components
        │   └── ["kiri", "bath"]
        │
        ├─→ Translate Each Component
        │   ├── "kiri" → ("kiri", "milk", "කිරි")
        │   └── "bath" → ("bath", "rice", "බත්")
        │
        ├─→ Combine Phrase Expansion
        │   ├── Original: "kiri bath"
        │   ├── Component English: "milk rice"
        │   ├── Component Sinhala: "කිරි බත්"
        │   └── Individual terms: "kiri milk කිරි bath rice බත්"
        │
        └─→ Return Expanded Query
            └── "kiri bath milk rice කිරි බත්"
```

### Phrase Expansion Examples

| Input Query | Phrase Type | Expanded Query |
|-------------|-------------|----------------|
| "kiri bath" | Two-word phrase | "kiri bath milk rice කිරි බත්" |
| "loku malu" | Two-word phrase | "loku malu big large fish මාළු" |
| "kiri" | Single word | "kiri milk කිරි" |
| "pol roti kesel" | Three-word phrase | "pol roti kesel coconut bread banana..." |

### Phrase Detection Strategies

| Strategy | Description | Example |
|----------|-------------|---------|
| Quoted phrases | User explicitly marks phrases | "kiri bath" |
| Adjacent tokens | Consecutive tokens treated as phrase | kiri bath |
| Common combinations | Known multi-word terms | kiri bath, loku malu |
| Proximity-based | Terms likely to appear together | adj + noun patterns |

### Component vs Phrase Expansion

```
Input: "kiri bath"

Component Expansion:
├── "kiri" → ["kiri", "milk", "කිරි"]
└── "bath" → ["bath", "rice", "බත්"]

Phrase Expansion:
└── "kiri bath" → ["kiri bath", "milk rice", "කිරි බත්"]

Combined Expansion:
"kiri bath" + "milk rice" + "කිරි බත්" + 
"kiri" + "milk" + "කිරි" + 
"bath" + "rice" + "බත්"

Optimized:
"kiri bath milk rice කිරි බත්"
(duplicates removed)
```

### Multi-Term Translation Table

| Multi-Term Input | Component 1 | Component 2 | Combined English | Combined Sinhala |
|-----------------|-------------|-------------|------------------|------------------|
| kiri bath | kiri (milk) | bath (rice) | milk rice | කිරි බත් |
| loku malu | loku (big) | malu (fish) | big fish, large fish | ලොකු මාළු |
| pol roti | pol (coconut) | roti (bread) | coconut bread | පොල් රොටි |

### Proximity Preservation

```
Query: "loku malu"
        │
Expansion with Proximity:
│
├── Phrase Level (close proximity)
│   └── "loku malu" OR "big fish" OR "large fish"
│
├── Component Level (any proximity)
│   └── "loku" + "big" + "large" + "malu" + "fish"
│
└── Script Level (parallel search)
    └── "ලොකු මාළු"
```

### Query Structure for Search Engines

| Search Engine | Phrase Syntax | Proximity Syntax |
|---------------|---------------|------------------|
| MeiliSearch | No special syntax | Terms in query |
| Elasticsearch | "kiri bath" (quoted) | "kiri bath"~5 (slop) |
| PostgreSQL FTS | 'kiri <-> bath' | 'kiri <2> bath' |

### Phrase Expansion Limits

| Limit | Value | Reason |
|-------|-------|--------|
| Max phrase length | 5 words | Avoid over-expansion |
| Max phrase expansions | 3 variants | Limit combinations |
| Max total terms | 20 | Search performance |

### Common Multi-Word Terms Dictionary (Optional)

| Romanized | English | Sinhala | Category |
|-----------|---------|---------|----------|
| kiri bath | milk rice | කිරි බත් | Food |
| pol roti | coconut bread | පොල් රොටි | Food |
| loku malu | big fish | ලොකු මාළු | Descriptor |
| kopi kade | coffee shop | කෝපි කඩේ | Place |

### Expected Outcome
- Multi-term query support implemented
- Phrase detection and expansion working
- Component-level translation preserved
- Phrase structure maintained in expansions
- Balanced phrase vs component matching

### Verification Checklist
- [ ] Multi-term phrase detection implemented
- [ ] Component tokenization working
- [ ] Each component translates independently
- [ ] Phrase expansions generated correctly
- [ ] Original phrase preserved in expansion
- [ ] Duplicates removed across phrase and components
- [ ] Query length remains reasonable
- [ ] Phrase proximity hints included if supported
- [ ] Common multi-word terms handled
- [ ] Performance acceptable for multi-term queries

---

## Task 59: Create SearchService Integration

### Overview
Integrate the SinhaglishService with the main SearchService of the application. This task creates the connection point where Sinhaglish query expansion becomes part of the standard search workflow, allowing all searches to benefit from multi-language expansion without requiring changes to calling code.

### Dependencies
- Task 58: Create Multi-Term Query
- Existing SearchService implementation
- SinhaglishService fully functional

### Instructions

1. **Locate SearchService**
   - Find existing SearchService in backend/apps/search/
   - Review current search workflow
   - Identify integration points
   - Understand current architecture

2. **Add SinhaglishService dependency**
   - Import SinhaglishService in SearchService
   - Initialize SinhaglishService instance
   - Configure Sinhaglish options
   - Set up service availability checks

3. **Identify pre-search hook point**
   - Locate where queries are received in SearchService
   - Find point before query sent to search engine
   - Identify query transformation area
   - Plan hook implementation (Task 60)

4. **Design integration architecture**
   - Determine if Sinhaglish is always-on or optional
   - Plan configuration toggle (enable/disable)
   - Design failure handling (fallback to original)
   - Plan logging and monitoring

5. **Implement service reference**
   - Add SinhaglishService as SearchService attribute
   - Initialize in SearchService __init__ method
   - Handle initialization errors gracefully
   - Support lazy initialization if needed

6. **Create configuration options**
   - Add enable_sinhaglish flag to SearchService config
   - Support per-tenant enabling/disabling
   - Allow runtime toggling
   - Set defaults (enabled by default recommended)

7. **Implement error isolation**
   - Wrap Sinhaglish calls in try-except blocks
   - Log Sinhaglish errors separately
   - Continue with original query if Sinhaglish fails
   - Don't break search if Sinhaglish unavailable

8. **Add monitoring and metrics**
   - Track Sinhaglish expansion usage
   - Monitor expansion times
   - Log expansion effectiveness
   - Track error rates

### Integration Architecture

```
┌─────────────────────────────────────────┐
│           SearchService                  │
├─────────────────────────────────────────┤
│                                          │
│  search(query, filters, ...) {          │
│    │                                     │
│    ├─→ pre_search_hook(query)           │
│    │   ├─→ SinhaglishService.expand()   │
│    │   └─→ expanded_query                │
│    │                                     │
│    ├─→ MeiliSearch.search(expanded_query│
│    │                                     │
│    └─→ return results                    │
│  }                                       │
│                                          │
│  Components:                             │
│  ├── SinhaglishService instance          │
│  ├── Configuration flags                 │
│  └── Error handling                      │
└─────────────────────────────────────────┘
```

### Integration Flow

```
User Query: "kiri"
    │
    ├─→ SearchService.search("kiri")
    │       │
    │       ├─→ pre_search_hook("kiri")
    │       │       │
    │       │       └─→ SinhaglishService.expand_query("kiri")
    │       │               │
    │       │               └─→ Returns: "kiri milk කිරි"
    │       │
    │       ├─→ MeiliSearch.search("kiri milk කිරි")
    │       │       │
    │       │       └─→ Returns: [results]
    │       │
    │       └─→ Return results to user
    │
    └─→ User receives multi-language results
```

### SearchService Configuration

| Setting | Type | Default | Description |
|---------|------|---------|-------------|
| enable_sinhaglish | bool | True | Enable Sinhaglish expansion |
| sinhaglish_required | bool | False | Fail if Sinhaglish unavailable |
| log_expansions | bool | True | Log query expansions |
| expansion_timeout | int | 100 | Max ms for expansion |

### Integration Points

| Integration Point | Purpose | Implementation |
|------------------|---------|----------------|
| SearchService.__init__ | Initialize SinhaglishService | Create service instance |
| search() method | Main search entry | Call pre_search_hook |
| pre_search_hook() | Query preprocessing | Expand query with Sinhaglish |
| Configuration | Runtime control | enable_sinhaglish flag |

### Error Handling Strategy

```
try:
    expanded_query = sinhaglish_service.expand_query(query)
except DatabaseError:
    log.error("Sinhaglish database error")
    expanded_query = query  # Use original
except TimeoutError:
    log.warning("Sinhaglish timeout")
    expanded_query = query  # Use original
except Exception as e:
    log.error(f"Sinhaglish unexpected error: {e}")
    expanded_query = query  # Use original

# Continue with search using expanded_query or original
```

### Service Initialization

```
class SearchService:
    def __init__(self, config):
        self.config = config
        self.meilisearch = MeiliSearchClient(...)
        
        # Initialize Sinhaglish
        if config.enable_sinhaglish:
            try:
                self.sinhaglish = SinhaglishService()
            except Exception as e:
                log.error(f"Failed to init Sinhaglish: {e}")
                self.sinhaglish = None
```

### Monitoring Metrics

| Metric | Type | Purpose |
|--------|------|---------|
| sinhaglish_expansion_count | Counter | Track usage |
| sinhaglish_expansion_time | Histogram | Monitor performance |
| sinhaglish_expansion_errors | Counter | Track failures |
| sinhaglish_cache_hit_rate | Gauge | Cache effectiveness |

### Expected Outcome
- SinhaglishService integrated into SearchService
- Integration point identified for pre-search hook
- Configuration options available
- Error handling prevents search failures
- Monitoring and logging in place

### Verification Checklist
- [ ] SearchService located and reviewed
- [ ] SinhaglishService imported in SearchService
- [ ] Service instance created in __init__
- [ ] Configuration flag added (enable_sinhaglish)
- [ ] Integration point identified for hook
- [ ] Error handling implemented
- [ ] Fallback to original query working
- [ ] Monitoring/logging added
- [ ] Integration tested with sample queries
- [ ] Documentation updated

---

## Task 60: Create pre_search_hook

### Overview
Implement the pre_search_hook method that serves as the actual integration point where query expansion happens. This hook intercepts search queries before they reach the search engine, expands them using the SinhaglishService, and returns the expanded query for searching.

### Dependencies
- Task 59: Create SearchService Integration
- SinhaglishService fully implemented (Tasks 53-58)

### Instructions

1. **Define hook method**
   - Method name: `pre_search_hook`
   - Location: In SearchService class
   - Input parameter: original query string
   - Return: expanded query string

2. **Implement hook logic structure**
   - Check if Sinhaglish is enabled
   - Validate input query
   - Call SinhaglishService.expand_query
   - Return expanded query

3. **Add feature flag check**
   - Check enable_sinhaglish configuration
   - If disabled, return original query unchanged
   - Log when Sinhaglish is disabled
   - Support runtime enabling/disabling

4. **Implement query validation**
   - Check if query is not empty
   - Verify query is string type
   - Check query length is reasonable
   - Return original if invalid

5. **Call SinhaglishService expansion**
   - Invoke sinhaglish_service.expand_query(query)
   - Capture expanded query result
   - Handle expansion errors
   - Set timeout for expansion

6. **Implement error handling**
   - Wrap expansion call in try-except
   - Catch all exception types
   - Log errors with context
   - Return original query on any error

7. **Add logging and monitoring**
   - Log original query (debug level)
   - Log expanded query (debug level)
   - Log expansion time
   - Increment usage metrics
   - Log errors (error level)

8. **Integrate with search method**
   - Call pre_search_hook in search() method
   - Pass result to search engine
   - Maintain backward compatibility
   - Don't break existing functionality

### Pre-Search Hook Flow

```
pre_search_hook(query: "kiri")
        │
        ├─→ Check: Sinhaglish Enabled?
        │   └── Yes, continue
        │
        ├─→ Validate Query
        │   └── Valid string, not empty
        │
        ├─→ Call: sinhaglish_service.expand_query("kiri")
        │   │
        │   ├─→ Tokenize: ["kiri"]
        │   ├─→ Translate: ("kiri", "milk", "කිරි")
        │   ├─→ Expand: "kiri milk කිරි"
        │   └─→ Return expanded query
        │
        ├─→ Log Expansion
        │   └── "kiri" → "kiri milk කිරි"
        │
        └─→ Return: "kiri milk කිරි"
```

### Hook Implementation Pseudocode

```
Method: pre_search_hook(query)
    │
    ├─→ IF not enabled: return query
    │
    ├─→ IF query invalid: return query
    │
    ├─→ TRY:
    │   ├─→ expanded = sinhaglish_service.expand_query(query)
    │   ├─→ log(f"Expanded: {query} → {expanded}")
    │   └─→ return expanded
    │
    └─→ EXCEPT Exception as e:
        ├─→ log_error(f"Expansion failed: {e}")
        └─→ return query  # Return original
```

### Integration with Search Method

```
def search(self, query, filters=None, ...):
    """Main search method"""
    
    # PRE-SEARCH HOOK - Query Expansion
    expanded_query = self.pre_search_hook(query)
    
    # Continue with search using expanded query
    results = self.meilisearch.search(
        index='products',
        query=expanded_query,
        filters=filters,
        ...
    )
    
    return results
```

### Hook Configuration

| Configuration | Check | Action |
|---------------|-------|--------|
| enable_sinhaglish=True | Enabled | Expand query |
| enable_sinhaglish=False | Disabled | Return original |
| sinhaglish_service=None | Unavailable | Return original |
| query=None or empty | Invalid | Return original |

### Error Handling Matrix

| Error Type | Handling | Log Level | Return Value |
|------------|----------|-----------|--------------|
| Service unavailable | Log and continue | Warning | Original query |
| Expansion timeout | Log and continue | Warning | Original query |
| Database error | Log and continue | Error | Original query |
| Invalid query | Skip expansion | Debug | Original query |
| Any exception | Log and continue | Error | Original query |

### Logging Examples

| Event | Log Level | Message |
|-------|-----------|---------|
| Expansion success | Debug | "Query expanded: 'kiri' → 'kiri milk කිරි'" |
| Expansion skipped | Debug | "Sinhaglish disabled, using original query" |
| Expansion error | Error | "Sinhaglish expansion failed: DatabaseError" |
| Invalid query | Debug | "Invalid query for Sinhaglish, skipped" |

### Performance Monitoring

```
Hook Performance:
├── Start time: record timestamp
├── Call expansion: sinhaglish_service.expand_query()
├── End time: record timestamp
├── Calculate duration: end - start
├── Log metric: "expansion_time_ms: 45"
└── Alert if > threshold (100ms)
```

### Hook Testing Scenarios

| Test Scenario | Input | Expected Output |
|---------------|-------|-----------------|
| Normal query | "kiri" | "kiri milk කිරි" |
| Multi-word query | "kiri kesel" | "kiri kesel milk banana..." |
| Empty query | "" | "" |
| Sinhaglish disabled | "kiri" (disabled) | "kiri" |
| Service error | "kiri" (service fails) | "kiri" |

### Expected Outcome
- Functional pre_search_hook that expands queries
- Seamless integration with SearchService.search()
- Graceful error handling without breaking search
- Proper logging and monitoring
- Configuration-driven enable/disable

### Verification Checklist
- [ ] pre_search_hook method created in SearchService
- [ ] Method accepts query parameter
- [ ] Checks if Sinhaglish is enabled
- [ ] Validates query before expansion
- [ ] Calls SinhaglishService.expand_query
- [ ] Returns expanded query on success
- [ ] Returns original query on error
- [ ] Error handling with try-except implemented
- [ ] Logging added for debugging
- [ ] Integrated into search() method
- [ ] Tested with various query types
- [ ] Performance acceptable (< 100ms overhead)

---

## Summary

This document established the foundational SinhaglishService and its integration with the search system. It implemented query expansion through tokenization, translation, and multi-term handling, then integrated this functionality into the SearchService via a pre-search hook.

### Completed Tasks
1. ✓ Created SinhaglishService with configuration and architecture
2. ✓ Created expand_query method as main entry point
3. ✓ Created tokenize method for query segmentation
4. ✓ Created translate_token method with fallback strategies
5. ✓ Created query expansion logic for multi-language search
6. ✓ Created multi-term query support for phrases
7. ✓ Created SearchService integration architecture
8. ✓ Created pre_search_hook for seamless integration

### Next Steps
Proceed to [02_Tasks-61-66_MultiScript-Tamil.md](02_Tasks-61-66_MultiScript-Tamil.md) to implement multi-script results, Sinhala indexing, highlighting, and Tamil-glish support with verification.
