# Tasks 53-59: Create Ranking Rules

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** D - Ranking & Boosting  
> **Document:** 01 of 02  
> **Tasks Covered:** 53, 54, 55, 56, 57, 58, 59

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-60-66_Personalization-Verify.md](02_Tasks-60-66_Personalization-Verify.md)

---

## Document Overview

This document covers the creation of MeiliSearch ranking rules and custom ranking configuration for the LankaCommerce Cloud ERP search system. It establishes the foundational ranking algorithm that determines how search results are ordered, from basic word matching to custom business metrics like sales count.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 53 | Create RankingRules | Medium | 30 min |
| 54 | Create words Rule | Low | 15 min |
| 55 | Create typo Rule | Low | 15 min |
| 56 | Create proximity Rule | Low | 15 min |
| 57 | Create attribute Rule | Low | 15 min |
| 58 | Create exactness Rule | Low | 15 min |
| 59 | Create Custom Ranking | Medium | 25 min |

---

## Task 53: Create RankingRules

### Overview
Create the main RankingRules class that configures MeiliSearch ranking algorithm for product search. This class defines the order and priority of ranking criteria, ensuring search results are ordered by relevance and business value. The ranking system uses a hierarchical approach where each rule acts as a tiebreaker for the previous one.

### Dependencies
- Task 52: Advanced search features must be complete
- MeiliSearch client is configured and working
- Product index structure is established

### Instructions

1. **Create the ranking module**
   - Navigate to `backend/apps/search/ranking/`
   - Create `__init__.py` for module initialization
   - Create `rules.py` for ranking rule implementations

2. **Define RankingRules class**
   - Create main class to manage all ranking configurations
   - Include methods for setting up default rules
   - Provide interface for customizing rule order

3. **Establish rule hierarchy**
   - Define the standard MeiliSearch rule order
   - Set priority levels for each rule type
   - Ensure proper fallback mechanisms

4. **Configure default ranking order**
   - words (highest priority - match relevance)
   - typo (second - spelling tolerance)
   - proximity (third - word distance)
   - attribute (fourth - field importance)
   - sort (fifth - custom sorting)
   - exactness (sixth - exact matches)
   - custom attributes (lowest - business metrics)

5. **Implement rule management methods**
   - Method to get current rules configuration
   - Method to update rules for specific indexes
   - Method to reset to default configuration

6. **Add logging and error handling**
   - Log rule changes for debugging
   - Handle MeiliSearch API errors gracefully
   - Validate rule configurations before applying

### Default Ranking Priority

| Priority | Rule | Purpose |
|----------|------|---------|
| 1 | words | More matching query words = higher rank |
| 2 | typo | Fewer typos in matches = higher rank |
| 3 | proximity | Closer matching words = higher rank |
| 4 | attribute | Matches in important fields = higher rank |
| 5 | sort | Custom sort criteria |
| 6 | exactness | Exact matches = higher rank |
| 7 | sales_count:desc | Popular products = higher rank |

### Rule Configuration Structure

```
RankingRules Configuration:
├── Built-in Rules (MeiliSearch)
│   ├── words (Task 54)
│   ├── typo (Task 55)
│   ├── proximity (Task 56)
│   ├── attribute (Task 57)
│   └── exactness (Task 58)
└── Custom Rules (Task 59)
    └── sales_count:desc
```

### Expected Outcome
- Functional RankingRules class with rule management
- Default rule configuration matching LCC requirements
- Methods for updating and retrieving rule settings
- Proper error handling and logging

### Verification Checklist
- [ ] `backend/apps/search/ranking/rules.py` file created
- [ ] RankingRules class properly defined
- [ ] Default rule order configured
- [ ] Rule management methods implemented
- [ ] Error handling for MeiliSearch operations
- [ ] Logging for rule changes

---

## Task 54: Create words Rule

### Overview
Configure the words ranking rule that prioritizes search results based on the number of query words found in the document. This rule ensures that documents matching more words from the search query are ranked higher. It's the most important rule as it determines basic search relevance.

### Dependencies
- Task 53: Create RankingRules

### Instructions

1. **Understand words rule behavior**
   - Results matching more query words rank higher
   - Case-insensitive matching
   - Stemming and language processing applied
   - Partial word matches are considered

2. **Configure words rule priority**
   - Set as highest priority (position 1)
   - Ensure it's the first rule in the ranking array
   - This rule acts as the primary relevance filter

3. **Implement words rule configuration**
   - Add "words" to the ranking rules array
   - Position at index 0 for highest priority
   - Verify MeiliSearch accepts the configuration

4. **Handle edge cases**
   - Single word queries (all results match equally)
   - Stop words and common terms
   - Unicode and special characters
   - Multi-language support for Sinhala/Tamil

5. **Test words rule effectiveness**
   - Query: "laptop bag" should rank documents with both words higher
   - Query: "blue shirt" should prioritize results with both terms
   - Verify partial matches work correctly

### Words Rule Examples

| Query | Document A | Document B | Ranking |
|-------|------------|------------|---------|
| "laptop bag" | "Gaming Laptop Bag" (2/2 words) | "Laptop Stand" (1/2 words) | A > B |
| "wireless mouse" | "Wireless Gaming Mouse" (2/2 words) | "Computer Mouse" (1/2 words) | A > B |
| "mobile phone case" | "Mobile Phone Case" (3/3 words) | "Phone Cover" (1/3 words) | A > B |

### Implementation Focus

| Aspect | Implementation |
|--------|----------------|
| Position | First in ranking array |
| Behavior | Count matching words |
| Case Sensitivity | Insensitive |
| Language Support | Multi-language |

### Expected Outcome
- words rule configured as highest priority
- Proper word matching behavior verified
- Multi-language support working
- Edge cases handled appropriately

### Verification Checklist
- [ ] "words" rule added to ranking configuration
- [ ] Positioned at priority 1 (index 0)
- [ ] Multi-word queries rank correctly
- [ ] Case-insensitive matching works
- [ ] Sinhala/Tamil language support verified

---

## Task 55: Create typo Rule

### Overview
Configure the typo ranking rule that handles spelling mistakes and variations in search queries. This rule ensures that results with fewer typos or character differences from the query terms are ranked higher. It enables fault-tolerant search that improves user experience by finding relevant results even with misspelled queries.

### Dependencies
- Task 53: Create RankingRules
- Task 54: words rule must be configured first

### Instructions

1. **Configure typo tolerance settings**
   - Set maximum allowed typos per word
   - Configure typo tolerance based on word length
   - Define acceptable character substitutions

2. **Set typo rule priority**
   - Position as second priority (after words)
   - Ensures typo-free matches rank higher than typo matches
   - Acts as tiebreaker for equal word matches

3. **Define typo tolerance levels**
   - 1-4 characters: 0 typos allowed
   - 5-8 characters: 1 typo allowed
   - 9+ characters: 2 typos allowed
   - Configurable per tenant needs

4. **Handle common spelling errors**
   - Character substitutions (o/0, i/1, s/5)
   - Character transpositions (teh → the)
   - Missing or extra characters
   - Keyboard layout errors (qwerty patterns)

5. **Implement language-specific tolerance**
   - English common misspellings
   - Sinhala romanization variations
   - Tamil transliteration patterns
   - Brand name spelling variations

6. **Configure typo scoring**
   - Exact matches score highest
   - 1-typo matches score lower
   - 2-typo matches score lowest
   - No matches beyond tolerance limit

### Typo Tolerance Configuration

| Word Length | Max Typos | Examples |
|-------------|-----------|----------|
| 1-4 chars | 0 | "bag", "pen", "cup" |
| 5-8 chars | 1 | "laptop" → "laptap" |
| 9+ chars | 2 | "smartphone" → "smartfone" |

### Common Typo Patterns

| Type | Example | Handling |
|------|---------|----------|
| Substitution | "laptop" → "laptap" | Character replacement |
| Transposition | "mobile" → "moblie" | Character swap |
| Insertion | "phone" → "phonee" | Extra character |
| Deletion | "computer" → "computr" | Missing character |

### Language-Specific Handling

| Language | Pattern | Example |
|----------|---------|---------|
| English | Common misspellings | "recieve" → "receive" |
| Sinhala | Romanization | "kiri" ↔ "keeri" |
| Tamil | Transliteration | "vanakkam" variants |

### Expected Outcome
- Typo rule configured with appropriate tolerance
- Spelling mistakes handled gracefully
- Language-specific patterns supported
- Progressive scoring based on typo count

### Verification Checklist
- [ ] "typo" rule added at priority 2
- [ ] Typo tolerance levels configured
- [ ] Common misspellings handled correctly
- [ ] Multi-language support verified
- [ ] Scoring works progressively

---

## Task 56: Create proximity Rule

### Overview
Configure the proximity ranking rule that prioritizes results where query words appear closer together in the document. This rule improves search relevance by understanding that words appearing near each other are more likely to be contextually related than words scattered throughout the document.

### Dependencies
- Task 53: Create RankingRules
- Tasks 54-55: words and typo rules must be configured

### Instructions

1. **Configure proximity calculation**
   - Measure word distance in document fields
   - Calculate proximity scores for word pairs
   - Weight proximity by field importance

2. **Set proximity rule priority**
   - Position as third priority (after typo)
   - Acts as tiebreaker for equal typo scores
   - Considers word relationships and context

3. **Define proximity scoring**
   - Adjacent words score highest
   - Words within same sentence score high
   - Words in same paragraph score medium
   - Words in different sections score low

4. **Handle different field types**
   - Product names: high proximity weight
   - Descriptions: medium proximity weight
   - Categories: medium proximity weight
   - Tags: lower proximity weight

5. **Configure proximity thresholds**
   - Immediate proximity (0-2 words apart)
   - Close proximity (3-5 words apart)
   - Medium proximity (6-10 words apart)
   - Distant (11+ words apart)

6. **Implement phrase detection**
   - Recognize common phrases and idioms
   - Handle compound words and hyphenated terms
   - Consider punctuation effects on proximity

### Proximity Scoring Examples

| Query | Text Match | Distance | Score |
|-------|------------|----------|-------|
| "laptop bag" | "laptop bag" | 0 words | Highest |
| "laptop bag" | "laptop carrying bag" | 1 word | High |
| "laptop bag" | "bag for laptop" | 2 words | Medium |
| "laptop bag" | "laptop... bag" (far apart) | 20+ words | Low |

### Field Proximity Weights

| Field | Weight | Reasoning |
|-------|--------|-----------|
| name | 1.0 | Product names are concise |
| sku | 0.8 | SKUs are structured |
| short_description | 0.7 | Summary content |
| description | 0.5 | Longer, less focused |
| category_name | 0.6 | Category context |

### Proximity Distance Scoring

| Distance | Score Multiplier | Description |
|----------|------------------|-------------|
| 0-1 words | 1.0 | Adjacent/immediate |
| 2-3 words | 0.8 | Very close |
| 4-6 words | 0.6 | Close |
| 7-10 words | 0.4 | Medium |
| 11+ words | 0.2 | Distant |

### Expected Outcome
- Proximity rule configured with distance weighting
- Field-specific proximity scoring implemented
- Phrase and context recognition working
- Progressive scoring based on word distance

### Verification Checklist
- [ ] "proximity" rule added at priority 3
- [ ] Distance calculation implemented
- [ ] Field-specific weights configured
- [ ] Phrase detection working
- [ ] Progressive distance scoring verified

---

## Task 57: Create attribute Rule

### Overview
Configure the attribute ranking rule that prioritizes matches based on the importance of document fields where matches occur. This rule ensures that matches in important fields like product names rank higher than matches in less important fields like descriptions or tags.

### Dependencies
- Task 53: Create RankingRules
- Tasks 54-56: Previous ranking rules must be configured

### Instructions

1. **Define searchable attributes hierarchy**
   - Establish field importance order
   - Configure field weights for ranking
   - Set searchable and rankable attributes

2. **Configure attribute priority order**
   - name (highest priority - product names)
   - sku (high priority - product codes)
   - short_description (medium-high priority)
   - description (medium priority)
   - category_name (medium priority)
   - brand (medium-low priority)
   - tags (lowest priority)

3. **Set attribute rule priority**
   - Position as fourth priority (after proximity)
   - Ensures field importance affects ranking
   - Balances content relevance with field significance

4. **Configure field searchability**
   - Mark primary fields as searchable
   - Set field-specific search weights
   - Configure field ranking contribution

5. **Handle field-specific matching**
   - Name matches get highest boost
   - SKU matches are exact and important
   - Description matches provide context
   - Tag matches indicate category relevance

6. **Implement attribute boost factors**
   - Calculate field importance multipliers
   - Apply boosts based on match field
   - Consider field content length and quality

### Attribute Priority Hierarchy

| Priority | Field | Weight | Purpose |
|----------|-------|--------|---------|
| 1 | name | 1.0 | Primary product identifier |
| 2 | sku | 0.9 | Unique product code |
| 3 | short_description | 0.7 | Key product features |
| 4 | description | 0.5 | Detailed information |
| 5 | category_name | 0.6 | Product classification |
| 6 | brand | 0.4 | Manufacturer/brand info |
| 7 | tags | 0.3 | Additional keywords |

### Field Matching Examples

| Query | Field Match | Priority | Boost |
|-------|-------------|----------|-------|
| "Dell Laptop" | name: "Dell Inspiron Laptop" | 1 | 100% |
| "DELL-123" | sku: "DELL-123-INSPIRON" | 2 | 90% |
| "Gaming" | description: "...gaming performance..." | 4 | 50% |
| "Electronics" | category_name: "Electronics" | 5 | 60% |

### Searchable Attributes Configuration

| Attribute | Searchable | Ranked | Notes |
|-----------|------------|--------|-------|
| name | Yes | Yes | Primary search field |
| sku | Yes | Yes | Exact matching important |
| short_description | Yes | Yes | Summary content |
| description | Yes | Yes | Full content search |
| category_name | Yes | Yes | Classification context |
| brand | Yes | Yes | Brand-specific searches |
| tags | Yes | Yes | Keyword matching |
| price | No | No | Numerical, not text |

### Expected Outcome
- Attribute rule configured with field hierarchy
- Field importance weights properly set
- Searchable attributes correctly configured
- Field-specific boosting implemented

### Verification Checklist
- [ ] "attribute" rule added at priority 4
- [ ] Field hierarchy established
- [ ] Searchable attributes configured
- [ ] Field weights properly set
- [ ] Boost factors working correctly

---

## Task 58: Create exactness Rule

### Overview
Configure the exactness ranking rule that prioritizes exact matches over partial matches. This rule ensures that when users search for specific terms, products with exact matches in their fields rank higher than products with only partial or stemmed matches.

### Dependencies
- Task 53: Create RankingRules
- Tasks 54-57: Previous ranking rules must be configured

### Instructions

1. **Configure exactness matching**
   - Define exact match criteria
   - Handle case-insensitive exact matching
   - Configure partial vs complete word matching

2. **Set exactness rule priority**
   - Position as sixth priority (after sort)
   - Acts as final relevance tiebreaker
   - Prioritizes precision over recall

3. **Define exactness levels**
   - Complete phrase matches (highest)
   - Complete word matches (high)
   - Prefix matches (medium)
   - Stemmed matches (lowest)

4. **Handle different match types**
   - Exact phrase: "gaming laptop" matches "Gaming Laptop"
   - Exact word: "laptop" matches "Laptop" but not "laptops"
   - Prefix match: "lap" matches "laptop"
   - Stem match: "running" matches "run"

5. **Configure field-specific exactness**
   - SKU fields require exact matching
   - Brand names prefer exact matching
   - Product names balance exact and partial
   - Descriptions allow more flexible matching

6. **Implement exactness scoring**
   - Full exact matches score highest
   - Partial exact matches score medium
   - Non-exact matches score lowest
   - Consider match position within field

### Exactness Match Types

| Match Type | Example Query | Example Match | Score |
|------------|---------------|---------------|-------|
| Exact Phrase | "gaming laptop" | "Gaming Laptop Pro" | 100% |
| Exact Word | "laptop" | "Laptop Bag" | 90% |
| Prefix | "lap" | "Laptop Stand" | 70% |
| Stem | "running" | "Run Shoes" | 60% |
| Partial | "top" | "Desktop Computer" | 50% |

### Field-Specific Exactness Settings

| Field | Exactness Level | Tolerance | Reasoning |
|-------|-----------------|-----------|-----------|
| sku | Strict | Low | Product codes must be exact |
| name | High | Medium | Product names prefer exact |
| brand | High | Low | Brand names should be exact |
| category_name | Medium | Medium | Categories allow some variation |
| description | Low | High | Descriptions allow flexibility |

### Exactness Configuration

| Setting | Value | Purpose |
|---------|-------|---------|
| Exact Match Boost | 1.2x | Boost exact matches |
| Prefix Min Length | 3 chars | Minimum prefix length |
| Stem Matching | Enabled | Allow stemmed matches |
| Case Sensitivity | Disabled | Ignore case differences |

### Expected Outcome
- Exactness rule configured with proper matching
- Different exactness levels implemented
- Field-specific exactness settings applied
- Scoring system for match precision

### Verification Checklist
- [ ] "exactness" rule added at priority 6
- [ ] Exact match detection working
- [ ] Field-specific settings configured
- [ ] Match type scoring implemented
- [ ] Case-insensitive matching verified

---

## Task 59: Create Custom Ranking

### Overview
Configure custom ranking attributes that incorporate business-specific metrics into the search ranking algorithm. This includes sales count, popularity metrics, and other business intelligence data that helps surface the most valuable products to customers.

### Dependencies
- Task 58: exactness rule must be configured
- Product sales data must be available
- Analytics system must be tracking product metrics

### Instructions

1. **Configure sales count ranking**
   - Add "sales_count:desc" to ranking rules
   - Position after built-in rules (priority 7)
   - Ensure sales data is properly indexed

2. **Set up custom ranking attributes**
   - sales_count: total product sales
   - view_count: product page views
   - cart_additions: add-to-cart events
   - rating_average: customer ratings
   - inventory_level: stock availability

3. **Configure ranking attribute order**
   - sales_count:desc (primary business metric)
   - rating_average:desc (quality indicator)
   - view_count:desc (popularity indicator)
   - inventory_level:desc (availability)

4. **Implement data synchronization**
   - Update sales counts regularly
   - Sync view counts from analytics
   - Update ratings from review system
   - Refresh inventory levels from ERP

5. **Handle missing data gracefully**
   - Default values for new products
   - Null value handling in ranking
   - Fallback ranking for incomplete data

6. **Configure update frequency**
   - Sales count: hourly updates
   - View count: real-time or hourly
   - Ratings: immediate on review submission
   - Inventory: real-time from ERP

### Custom Ranking Attributes

| Attribute | Type | Order | Purpose |
|-----------|------|-------|---------|
| sales_count | Integer | desc | Popular products first |
| rating_average | Float | desc | Highly rated first |
| view_count | Integer | desc | Frequently viewed first |
| inventory_level | Integer | desc | In-stock first |
| created_at | Datetime | desc | Newer products boost |

### Data Synchronization Schedule

| Metric | Update Frequency | Source | Method |
|--------|------------------|--------|---------|
| sales_count | Hourly | ERP Sales | Batch sync |
| view_count | Hourly | Analytics | API sync |
| rating_average | Immediate | Review System | Real-time |
| inventory_level | Real-time | ERP Inventory | Webhook |

### Custom Ranking Configuration

```
Custom Attributes Priority:
├── sales_count:desc (Primary business metric)
├── rating_average:desc (Quality signal)
├── view_count:desc (Popularity signal)
├── inventory_level:desc (Availability signal)
└── created_at:desc (Freshness signal)
```

### Expected Outcome
- Custom ranking with business metrics implemented
- Sales count prioritization working
- Data synchronization process established
- Missing data handling configured

### Verification Checklist
- [ ] "sales_count:desc" added to ranking rules
- [ ] Custom attributes properly configured
- [ ] Data synchronization working
- [ ] Missing data handled gracefully
- [ ] Update frequencies implemented
- [ ] Business metrics affecting search results

---

## Summary

This document established the complete ranking system for MeiliSearch in the LankaCommerce Cloud ERP, from basic text matching rules to custom business metrics. The ranking system provides a comprehensive algorithm that balances search relevance with business value, ensuring customers find both relevant and popular products.

### Completed Tasks
1. ✓ Created RankingRules class for configuration management
2. ✓ Configured words rule for query term matching priority
3. ✓ Configured typo rule for fault-tolerant search
4. ✓ Configured proximity rule for contextual word relationships
5. ✓ Configured attribute rule for field importance hierarchy
6. ✓ Configured exactness rule for precise match prioritization
7. ✓ Created custom ranking with sales count and business metrics

### Next Steps
Proceed to [02_Tasks-60-66_Personalization-Verify.md](02_Tasks-60-66_Personalization-Verify.md) to implement personalization services, popularity boosting, and verification of the complete ranking system.