# Tasks 01-11: SinhalaWord and Transliteration Models

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** A - Dictionary Models  
> **Document:** 01 of 02  
> **Tasks Covered:** 01, 02, 03, 04, 05, 06, 07, 08, 09, 10, 11

---

## Navigation

- **↑ Parent:** [00_GROUP_OVERVIEW.md](00_GROUP_OVERVIEW.md)
- **→ Next Document:** [02_Tasks-12-16_ProductTranslation-Migration.md](02_Tasks-12-16_ProductTranslation-Migration.md)

---

## Document Overview

This document covers the creation of two critical dictionary models for the Sinhaglish search system: SinhalaWord and Transliteration. The SinhalaWord model serves as the core dictionary storing Sinhala words in Unicode, their romanized forms, English meanings, phonetic keys for sound-based matching, and categorization. The Transliteration model handles alternative spellings and variations of Sinhala words, enabling flexible search matching.

### Tasks in This Document
| Task # | Task Name | Complexity | Est. Time |
|--------|-----------|------------|-----------|
| 01 | Create SinhalaWord Model | Medium | 30 min |
| 02 | Create sinhala_text Field | Low | 15 min |
| 03 | Create romanized Field | Low | 15 min |
| 04 | Create english_meaning Field | Low | 15 min |
| 05 | Create phonetic_key Field | Low | 20 min |
| 06 | Create category Field | Low | 20 min |
| 07 | Create frequency Field | Low | 15 min |
| 08 | Create Transliteration Model | Medium | 25 min |
| 09 | Create word FK | Low | 15 min |
| 10 | Create variant Field | Low | 15 min |
| 11 | Create is_common Field | Low | 15 min |

---

## Task 01: Create SinhalaWord Model

### Overview
Create the SinhalaWord model as the foundation of the Sinhala dictionary system. This model stores individual Sinhala words with their Unicode representation, romanized forms, English translations, phonetic keys, categorization, and usage frequency. The model will support multi-tenant architecture and enable efficient search operations through proper indexing.

### Dependencies
- SubPhase-04 (Smart Search Backend) must be complete
- Django models structure established
- Multi-tenancy system configured
- Base model mixins available

### Instructions

1. **Navigate to the search app directory**
   - Go to `backend/apps/search/` directory
   - Create subdirectory named `sinhaglish` if it doesn't exist
   - This module handles Sinhaglish search functionality

2. **Create models directory structure**
   - Create `models/` subdirectory within `sinhaglish/`
   - Create `__init__.py` file in `models/` directory
   - This allows importing models as a package

3. **Create sinhala_word model file**
   - Create new file `sinhala_word.py` in `models/` directory
   - Import Django model base classes
   - Import necessary field types and validators

4. **Define SinhalaWord model class**
   - Create class inheriting from appropriate base model
   - Include tenant-aware model inheritance if needed
   - Add model Meta class for configuration

5. **Configure model metadata**
   - Set `verbose_name` to "Sinhala Word"
   - Set `verbose_name_plural` to "Sinhala Words"
   - Define `ordering` to sort by romanized field
   - Set `db_table` name if custom table name needed

6. **Plan model relationships**
   - This model will be referenced by Transliteration (Task 08)
   - This model will be referenced by ProductTranslation (Task 12)
   - Consider reverse relationship naming

7. **Add string representation method**
   - Implement `__str__` method
   - Return romanized field value for readability
   - Include sinhala_text in parentheses for context

8. **Register model in __init__.py**
   - Import SinhalaWord in `models/__init__.py`
   - Export in `__all__` list for clean imports

### Model Purpose and Use Cases

| Purpose | Description |
|---------|-------------|
| Dictionary Storage | Central repository for Sinhala vocabulary |
| Search Matching | Enable product search via Sinhala/Sinhaglish |
| Translation | Map Sinhala terms to English meanings |
| Phonetic Matching | Support sound-based search queries |
| Categorization | Group words by product categories |

### Model Structure Overview

```
┌────────────────────────────────────┐
│       SinhalaWord Model            │
├────────────────────────────────────┤
│ - sinhala_text (Unicode)          │ ← Task 02
│ - romanized (English spelling)     │ ← Task 03
│ - english_meaning (Translation)    │ ← Task 04
│ - phonetic_key (Sound hash)        │ ← Task 05
│ - category (Product category)      │ ← Task 06
│ - frequency (Usage count)          │ ← Task 07
├────────────────────────────────────┤
│ Relationships:                     │
│ → Transliteration (one-to-many)   │
│ → ProductTranslation (one-to-one) │
└────────────────────────────────────┘
```

### Base Model Inheritance

| Option | Use When |
|--------|----------|
| models.Model | Simple, non-tenant dictionary |
| TenantAwareModel | Shared across tenants |
| TenantModel | Isolated per tenant |

### Directory Structure

```
backend/apps/search/sinhaglish/
├── __init__.py
└── models/
    ├── __init__.py
    └── sinhala_word.py       # Created in this task
```

### Expected Outcome
- SinhalaWord model class created
- Model properly inherits from base classes
- Meta configuration defined
- String representation implemented
- Model registered for import
- Foundation ready for field definitions (Tasks 02-07)

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/models/sinhala_word.py` file created
- [ ] SinhalaWord class defined with proper inheritance
- [ ] Model Meta class configured
- [ ] `__str__` method implemented
- [ ] Model imported in `models/__init__.py`
- [ ] Django imports are correct
- [ ] Model follows project naming conventions

---

## Task 02: Create sinhala_text Field

### Overview
Add the `sinhala_text` field to store Sinhala words in Unicode format. This field holds the original Sinhala script representation, enabling native language display and accurate linguistic processing. The field supports the full Sinhala Unicode range (U+0D80 to U+0DFF) and is essential for displaying search results in Sinhala.

### Dependencies
- Task 01: Create SinhalaWord Model

### Instructions

1. **Open sinhala_word.py file**
   - Navigate to `backend/apps/search/sinhaglish/models/sinhala_word.py`
   - Locate the SinhalaWord class definition

2. **Import required field type**
   - Ensure CharField is imported from django.db.models
   - Import validators if custom validation needed

3. **Add sinhala_text field**
   - Define as CharField with max_length=100
   - Set unique=True to prevent duplicate entries
   - Add verbose_name="Sinhala Text" for admin interface

4. **Configure field properties**
   - Set null=False and blank=False (required field)
   - Add db_index=True for search optimization
   - Consider adding help_text for admin clarity

5. **Add field validation**
   - Consider adding custom validator for Sinhala Unicode
   - Validate characters are within Sinhala range (U+0D80-U+0DFF)
   - Handle edge cases like mixed scripts

6. **Update model string representation**
   - If not already done, include sinhala_text in `__str__` method
   - Display both romanized and sinhala_text for clarity

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Text storage |
| Max Length | 100 | Accommodate longest words |
| Unique | True | Prevent duplicates |
| Null | False | Required field |
| Blank | False | Must have value |
| DB Index | True | Search optimization |
| Verbose Name | "Sinhala Text" | Admin display |

### Sinhala Unicode Range

| Character Type | Unicode Range | Examples |
|----------------|---------------|----------|
| Vowels | U+0D85 - U+0D96 | අ, ආ, ඉ, ඊ |
| Consonants | U+0D9A - U+0DC6 | ක, ග, ච, ජ |
| Vowel Signs | U+0DCF - U+0DDF | ා, ි, ී, ු |
| Other Signs | U+0DCA, U+0DD9-U+0DDF | ් (hal), ේ, ෙ |

### Example Sinhala Words

| Sinhala | Romanized | Meaning | Category |
|---------|-----------|---------|----------|
| කිරි | kiri | Milk | grocery |
| බත් | bath | Rice | grocery |
| මළු | malu | Fish | grocery |
| පාන් | paan | Bread | grocery |
| සබන් | saban | Soap | household |

### Database Storage

```
Table: sinhala_words
┌─────┬──────────────┬────────────┬─────────────────┐
│ ID  │ sinhala_text │ romanized  │ english_meaning │
├─────┼──────────────┼────────────┼─────────────────┤
│ 1   │ කිරි         │ kiri       │ Milk            │
│ 2   │ බත්          │ bath       │ Rice            │
│ 3   │ මළු          │ malu       │ Fish            │
└─────┴──────────────┴────────────┴─────────────────┘
         ↑ Unicode      ↑ ASCII      ↑ English
      (This field)
```

### Indexing Strategy

| Index Type | Purpose | Performance Impact |
|------------|---------|-------------------|
| B-tree (default) | Exact lookups | Fast for equality |
| GIN (optional) | Full-text search | Best for text search |

### Expected Outcome
- sinhala_text field added to SinhalaWord model
- Field properly configured for Unicode storage
- Indexing enabled for search performance
- Validation ensures only Sinhala characters
- Field ready for data population

### Verification Checklist
- [ ] sinhala_text field added to SinhalaWord model
- [ ] Field type is CharField with max_length=100
- [ ] unique=True constraint applied
- [ ] db_index=True for performance
- [ ] verbose_name set for admin interface
- [ ] Field marked as required (null=False, blank=False)
- [ ] Unicode support verified

---

## Task 03: Create romanized Field

### Overview
Add the `romanized` field to store the English transliteration of Sinhala words. This field is critical for Sinhaglish search, allowing users to type Sinhala words using English characters. The field must be indexed for fast search operations and support case-insensitive matching.

### Dependencies
- Task 01: Create SinhalaWord Model

### Instructions

1. **Open sinhala_word.py file**
   - Navigate to the SinhalaWord model definition
   - Prepare to add romanized field

2. **Add romanized field**
   - Define as CharField with max_length=100
   - Set unique=True to prevent duplicate romanizations
   - Add verbose_name="Romanized" for clarity

3. **Configure search optimization**
   - Set db_index=True for fast lookups
   - Consider adding database function index for case-insensitive search
   - Plan for lowercase normalization in queries

4. **Set field properties**
   - Set null=False and blank=False (required)
   - Add help_text explaining romanization format
   - Consider adding validation for ASCII-only characters

5. **Define romanization rules**
   - Document romanization conventions in docstring
   - Plan for consistent romanization patterns
   - Consider multiple romanization standards

6. **Update model ordering**
   - Ensure Meta class orders by romanized field
   - This provides alphabetical listing

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Text storage |
| Max Length | 100 | Match sinhala_text length |
| Unique | True | Prevent duplicates |
| Null | False | Required field |
| Blank | False | Must have value |
| DB Index | True | Critical for search |
| Verbose Name | "Romanized" | Admin display |

### Romanization Examples

| Sinhala | Romanized | Alternative Spellings |
|---------|-----------|----------------------|
| කිරි | kiri | keeri, kere, kiree |
| බත් | bath | bhath, baath, bat |
| මළු | malu | mallu, maalu |
| පාන් | paan | pan, pahn |
| සබන් | saban | sabun, sabahn |

### Romanization Conventions

```
Sinhala Letter → Romanized Form
────────────────────────────────
ක → k
ග → g
ච → ch
ජ → j
ට → t
ඩ → d
ණ → n
ත → th
ද → dh
න → n
ප → p
බ → b
ම → m
ය → y
ර → r
ල → l
ව → w, v
ස → s
හ → h

Vowels:
අ → a
ආ → aa
ඉ → i
ඊ → ee
උ → u
ඌ → uu
එ → e
ඒ → ae
ඔ → o
ඕ → oo
```

### Search Query Pattern

```
User Search Flow:
─────────────────
User types: "kiri"
    ↓
Query: WHERE romanized = 'kiri' (exact)
   OR: WHERE romanized ILIKE '%kiri%' (partial)
    ↓
Match: SinhalaWord(sinhala_text="කිරි", romanized="kiri")
    ↓
Return: Products with sinhala_name containing "කිරි"
```

### Index Performance

| Query Type | Without Index | With Index |
|------------|---------------|------------|
| Exact match | O(n) scan | O(log n) lookup |
| Prefix match | O(n) scan | O(log n) lookup |
| Contains | O(n) scan | O(n) with index |

### Case-Insensitive Handling

| Approach | Implementation |
|----------|----------------|
| Store lowercase | Store normalized, query as-is |
| Query conversion | Store mixed, query with LOWER() |
| Functional index | Index on LOWER(romanized) |

### Expected Outcome
- romanized field added to SinhalaWord model
- Field indexed for fast search operations
- Unique constraint prevents duplicates
- Field ready for Sinhaglish query matching
- Foundation for alternative spellings (Transliteration model)

### Verification Checklist
- [ ] romanized field added to SinhalaWord model
- [ ] Field type is CharField with max_length=100
- [ ] unique=True constraint applied
- [ ] db_index=True for search performance
- [ ] verbose_name set appropriately
- [ ] Field marked as required
- [ ] Romanization conventions documented

---

## Task 04: Create english_meaning Field

### Overview
Add the `english_meaning` field to store English translations of Sinhala words. This field enables bilingual display in search results, helps with disambiguation, and supports admin users who may not be fluent in Sinhala. The field allows longer text to accommodate detailed translations and multiple meanings.

### Dependencies
- Task 01: Create SinhalaWord Model

### Instructions

1. **Open sinhala_word.py file**
   - Navigate to the SinhalaWord model definition
   - Prepare to add english_meaning field

2. **Add english_meaning field**
   - Define as CharField with max_length=200
   - Longer length accommodates multiple meanings
   - Add verbose_name="English Meaning"

3. **Configure field properties**
   - Set null=False and blank=False (required)
   - Consider db_index=False (not primary search field)
   - Add help_text for admin guidance

4. **Define translation conventions**
   - Single word translations when possible
   - Multiple meanings separated by commas or semicolons
   - Consider adding notes field for extended definitions

5. **Plan for multiple meanings**
   - Decide on separator character (comma, semicolon)
   - Document in model docstring
   - Consider primary meaning first

6. **Update admin display**
   - Include english_meaning in list_display
   - Enable search by english_meaning in admin
   - Add to admin filters if needed

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Text storage |
| Max Length | 200 | Multiple meanings |
| Null | False | Required field |
| Blank | False | Must have value |
| DB Index | False | Not primary search |
| Verbose Name | "English Meaning" | Admin display |

### Translation Examples

| Sinhala | Romanized | English Meaning |
|---------|-----------|-----------------|
| කිරි | kiri | Milk |
| බත් | bath | Rice, Cooked rice |
| මළු | malu | Fish |
| පාන් | paan | Bread, Loaf |
| සබන් | saban | Soap |
| තේ | the | Tea |
| සීනි | seeni | Sugar |
| අතු | ath | Vegetable, Greens |

### Multiple Meanings Format

```
Single Meaning:
├── english_meaning = "Milk"

Multiple Meanings (Comma):
├── english_meaning = "Rice, Cooked rice"

Multiple Meanings (Semicolon):
├── english_meaning = "Bread; Loaf; Bun"

With Context (Parentheses):
├── english_meaning = "Fish (general), Seafood"
```

### Translation Guidelines

| Category | Translation Approach |
|----------|---------------------|
| Single Object | One word: "Milk", "Soap" |
| General Terms | Primary + alternatives: "Rice, Cooked rice" |
| Context-Specific | Include context: "Fish (fresh)" |
| Multiple Uses | Separate with semicolon: "Pan; Pot" |

### Display Usage

```
Search Result Display:
┌──────────────────────────────────┐
│  කිරි (kiri)                     │
│  English: Milk                   │
│  Category: Grocery               │
└──────────────────────────────────┘

Admin List View:
┌──────────┬────────────┬─────────────────┐
│ Sinhala  │ Romanized  │ English Meaning │
├──────────┼────────────┼─────────────────┤
│ කිරි     │ kiri       │ Milk            │
│ බත්      │ bath       │ Rice            │
│ මළු      │ malu       │ Fish            │
└──────────┴────────────┴─────────────────┘
```

### Expected Outcome
- english_meaning field added to SinhalaWord model
- Field accommodates single and multiple meanings
- Translations support bilingual display
- Field visible in admin interface
- Clear translation guidelines documented

### Verification Checklist
- [ ] english_meaning field added to SinhalaWord model
- [ ] Field type is CharField with max_length=200
- [ ] verbose_name set appropriately
- [ ] Field marked as required
- [ ] Translation format documented
- [ ] Admin display configured
- [ ] Field ready for data entry

---

## Task 05: Create phonetic_key Field

### Overview
Add the `phonetic_key` field to store phonetic hash values for sound-based matching. This field implements a Soundex-like algorithm adapted for Sinhala phonetics, enabling search queries to match words that sound similar even with spelling variations. This is crucial for handling different romanization styles and user typos.

### Dependencies
- Task 01: Create SinhalaWord Model
- Task 03: Create romanized Field

### Instructions

1. **Open sinhala_word.py file**
   - Navigate to the SinhalaWord model definition
   - Prepare to add phonetic_key field

2. **Add phonetic_key field**
   - Define as CharField with max_length=20
   - Sufficient for phonetic hash codes
   - Add verbose_name="Phonetic Key"

3. **Configure indexing**
   - Set db_index=True for fast phonetic matching
   - This enables sound-based search queries
   - Consider composite index with category

4. **Set field properties**
   - Set null=True and blank=True initially
   - Field can be auto-generated from romanized
   - Mark as editable=False if auto-calculated

5. **Plan phonetic algorithm**
   - Research Soundex algorithm basics
   - Adapt for Sinhala phonetic patterns
   - Consider Sri Lankan pronunciation rules

6. **Document phonetic rules**
   - Add docstring explaining algorithm
   - Document which sounds are considered similar
   - Provide examples of matching keys

7. **Plan calculation method**
   - Create model method `calculate_phonetic_key()`
   - Call in save() method to auto-generate
   - Or use signal for generation

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Hash storage |
| Max Length | 20 | Phonetic codes |
| Null | True | Auto-calculated |
| Blank | True | Auto-calculated |
| DB Index | True | Phonetic search |
| Editable | False | Auto-generated |
| Verbose Name | "Phonetic Key" | Admin display |

### Phonetic Matching Concept

```
Phonetic Matching Flow:
──────────────────────
Word 1: "kiri"  → Phonetic Key: "K600"
Word 2: "keeri" → Phonetic Key: "K600"
Word 3: "kere"  → Phonetic Key: "K600"
                       ↓
                 Same phonetic key
                       ↓
              Considered similar sounds
```

### Soundex Algorithm Basics

```
1. Keep first letter
2. Remove vowels (except first)
3. Replace consonants with codes:
   ─ Similar sounds → Same code
   
Code Groups:
├── 1: B, F, P, V
├── 2: C, G, J, K, Q, S, X, Z
├── 3: D, T
├── 4: L
├── 5: M, N
└── 6: R

Example: "kiri" → K600
         ↑ ↑↑
         K 6 (R) 0 (I removed) 0 (padding)
```

### Sinhala Phonetic Adaptations

| Sound Group | Letters | Code | Examples |
|-------------|---------|------|----------|
| Plosives (voiced) | ග, ඩ, ද, බ | 1 | bath, baath |
| Plosives (unvoiced) | ක, ට, ත, ප | 2 | kiri, keeri |
| Nasals | ම, න, ණ, ං | 3 | malu, maalu |
| Liquids | ල, ර | 4 | lunu, loonu |
| Fricatives | ස, හ, ශ, ෂ | 5 | saban, sabun |
| Approximants | ය, ව | 6 | yahapath |

### Phonetic Key Examples

| Word | Romanized | Phonetic Key | Matches With |
|------|-----------|--------------|--------------|
| කිරි | kiri | K600 | keeri, kere |
| බත් | bath | B300 | bhath, baath |
| මළු | malu | M400 | mallu, maalu |
| සබන් | saban | S150 | sabun, sabahn |

### Search Query with Phonetics

```
User types: "keeri" (variant spelling)
    ↓
Calculate phonetic_key: "K600"
    ↓
Query: SELECT * FROM sinhala_words
       WHERE phonetic_key = 'K600'
    ↓
Returns: ["kiri", "keeri", "kere"]
    ↓
User finds: Milk products
```

### Auto-Calculation Strategy

| Approach | When | How |
|----------|------|-----|
| On Save | Model save | Override save() method |
| Signal | Post-save | Use Django signals |
| Property | On access | Use @property decorator |
| Migration | One-time | Data migration script |

### Expected Outcome
- phonetic_key field added to SinhalaWord model
- Field indexed for phonetic search
- Phonetic algorithm documented
- Foundation for sound-based matching
- Method to calculate phonetic keys planned

### Verification Checklist
- [ ] phonetic_key field added to SinhalaWord model
- [ ] Field type is CharField with max_length=20
- [ ] db_index=True for performance
- [ ] Field set as auto-calculated (editable=False)
- [ ] Phonetic algorithm documented
- [ ] Soundex adaptation planned
- [ ] Calculation method planned

---

## Task 06: Create category Field

### Overview
Add the `category` field to classify Sinhala words into product categories. This field enables filtered searches, improves relevance by limiting searches to specific product types, and supports category-specific dictionaries. The field uses predefined choices matching the ERP system's product categories.

### Dependencies
- Task 01: Create SinhalaWord Model

### Instructions

1. **Open sinhala_word.py file**
   - Navigate to the SinhalaWord model definition
   - Prepare to add category field

2. **Define category choices**
   - Create class-level constant or enum for categories
   - Define as tuple of tuples: (value, label)
   - Align with ERP product categories

3. **Add category field**
   - Define as CharField with max_length=50
   - Set choices parameter to category choices
   - Add verbose_name="Category"

4. **Configure field properties**
   - Set null=True and blank=True (optional)
   - Add db_index=True for filtered queries
   - Consider default value

5. **Define category options**
   - GROCERY: Food and beverages
   - HOUSEHOLD: Household items
   - CLOTHING: Apparel and accessories
   - ELECTRONICS: Electronic items
   - COLORS: Color descriptors
   - SIZES: Size descriptors
   - GENERAL: Uncategorized terms

6. **Update admin interface**
   - Add category to list_filter
   - Enable search by category
   - Display in list view

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Enumeration |
| Max Length | 50 | Category names |
| Choices | Defined tuple | Limited options |
| Null | True | Optional field |
| Blank | True | Optional field |
| DB Index | True | Filtered searches |
| Verbose Name | "Category" | Admin display |

### Category Definitions

| Category | Value | Description | Example Words |
|----------|-------|-------------|---------------|
| Grocery | GROCERY | Food items | කිරි, බත්, මළු, පාන් |
| Household | HOUSEHOLD | Home products | සබන්, පොල් |
| Clothing | CLOTHING | Apparel | කමිස, සරම |
| Electronics | ELECTRONICS | Tech items | දුරකථන |
| Colors | COLORS | Color words | රතු, නිල්, කහ |
| Sizes | SIZES | Size terms | විශාල, කුඩා |
| General | GENERAL | Other terms | අලුත්, පරණ |

### Category Choices Implementation

```
Category Choices Structure:
───────────────────────────
CATEGORY_CHOICES = (
    ('GROCERY', 'Grocery'),
    ('HOUSEHOLD', 'Household'),
    ('CLOTHING', 'Clothing'),
    ('ELECTRONICS', 'Electronics'),
    ('COLORS', 'Colors'),
    ('SIZES', 'Sizes'),
    ('GENERAL', 'General'),
)

Field Definition:
category = models.CharField(
    max_length=50,
    choices=CATEGORY_CHOICES,
    ...
)
```

### Category Distribution Examples

```
GROCERY Category:
├── කිරි (kiri) - Milk
├── බත් (bath) - Rice
├── මළු (malu) - Fish
├── පාන් (paan) - Bread
└── සීනි (seeni) - Sugar

HOUSEHOLD Category:
├── සබන් (saban) - Soap
├── බුරුසු (burusu) - Brush
└── බාල්දිය (baldiya) - Bucket

COLORS Category:
├── රතු (rathu) - Red
├── නිල් (nil) - Blue
└── කහ (kaha) - Yellow
```

### Filtered Search Usage

```
Search Query with Category:
───────────────────────────
User query: "kiri" in category "GROCERY"
    ↓
Query: SELECT * FROM sinhala_words
       WHERE romanized = 'kiri'
       AND category = 'GROCERY'
    ↓
Returns: Only grocery-related "kiri" terms
    ↓
Improved search relevance
```

### Admin Interface Enhancement

```
Admin List View:
┌──────────┬────────────┬─────────────┬───────────┐
│ Sinhala  │ Romanized  │ Category    │ Frequency │
├──────────┼────────────┼─────────────┼───────────┤
│ කිරි     │ kiri       │ Grocery     │ 150       │
│ සබන්     │ saban      │ Household   │ 75        │
│ රතු      │ rathu      │ Colors      │ 45        │
└──────────┴────────────┴─────────────┴───────────┘

Filter Sidebar:
└── By Category
    ├── Grocery (15)
    ├── Household (8)
    ├── Clothing (5)
    ├── Electronics (3)
    ├── Colors (7)
    └── General (12)
```

### Search Relevance Benefits

| Without Category | With Category |
|------------------|---------------|
| "pan" returns bread, pots, pans | "pan" in GROCERY returns only bread |
| Many irrelevant results | Focused, relevant results |
| User must filter manually | System filters automatically |

### Expected Outcome
- category field added to SinhalaWord model
- Predefined choices limit valid values
- Field indexed for filtered searches
- Categories aligned with product system
- Admin interface supports category filtering

### Verification Checklist
- [ ] category field added to SinhalaWord model
- [ ] Field type is CharField with max_length=50
- [ ] CATEGORY_CHOICES defined with all categories
- [ ] choices parameter set on field
- [ ] db_index=True for performance
- [ ] verbose_name set appropriately
- [ ] Admin list_filter includes category

---

## Task 07: Create frequency Field

### Overview
Add the `frequency` field to track how often each Sinhala word is searched or used in the system. This field enables intelligent search ranking, popular word identification, and dictionary optimization. Higher frequency words appear first in search results, improving user experience.

### Dependencies
- Task 01: Create SinhalaWord Model

### Instructions

1. **Open sinhala_word.py file**
   - Navigate to the SinhalaWord model definition
   - Prepare to add frequency field

2. **Add frequency field**
   - Define as IntegerField
   - Set default=0 for new entries
   - Add verbose_name="Frequency"

3. **Configure field properties**
   - Set null=False and blank=False
   - Add db_index=True for sorting by popularity
   - Consider validators for non-negative values

4. **Plan frequency tracking**
   - Increment on each search match
   - Update via search query analytics
   - Consider batch updates for performance

5. **Define usage patterns**
   - Search result ranking (ORDER BY frequency DESC)
   - Popular words dashboard
   - Dictionary optimization priorities

6. **Update model ordering**
   - Consider secondary ordering by frequency
   - Primary: romanized, Secondary: -frequency
   - High-frequency words appear first

7. **Plan analytics integration**
   - Track search queries
   - Link queries to matched words
   - Increment frequency atomically

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | IntegerField | Numeric counter |
| Default | 0 | New entries start at zero |
| Null | False | Must have value |
| Blank | False | Must have value |
| DB Index | True | Sorting by popularity |
| Validators | ≥ 0 | Non-negative |
| Verbose Name | "Frequency" | Admin display |

### Frequency Usage Patterns

```
Search Flow with Frequency:
──────────────────────────
1. User searches "kiri"
2. System finds SinhalaWord(romanized="kiri")
3. Increment frequency: frequency += 1
4. Return results ordered by frequency
5. Popular terms appear first
```

### Frequency-Based Ranking

```
Search Results (Ordered by Frequency):
┌────┬──────────┬────────────┬───────────┐
│ #  │ Sinhala  │ Romanized  │ Frequency │
├────┼──────────┼────────────┼───────────┤
│ 1  │ කිරි     │ kiri       │ 245       │ ← Most popular
│ 2  │ බත්      │ bath       │ 198       │
│ 3  │ මළු      │ malu       │ 156       │
│ 4  │ පාන්     │ paan       │ 134       │
│ 5  │ සීනි     │ seeni      │ 98        │
└────┴──────────┴────────────┴───────────┘
```

### Frequency Tracking Methods

| Method | Description | Use Case |
|--------|-------------|----------|
| Real-time | Increment immediately on search | Accurate, slower |
| Batch | Update periodically from logs | Faster, slight delay |
| Hybrid | Critical updates real-time, others batch | Balanced |

### Increment Implementation

```
Atomic Increment (Thread-safe):
───────────────────────────────
from django.db.models import F

# When word is matched in search:
sinhala_word.frequency = F('frequency') + 1
sinhala_word.save(update_fields=['frequency'])

# F() ensures atomic operation
```

### Frequency Analytics

```
Popular Words Report:
┌─────────────┬───────────┬───────────┐
│ Category    │ Top Word  │ Frequency │
├─────────────┼───────────┼───────────┤
│ Grocery     │ කිරි      │ 245       │
│ Household   │ සබන්      │ 156       │
│ Colors      │ රතු       │ 89        │
└─────────────┴───────────┴───────────┘

Frequency Distribution:
High (>200):  ████████ 8 words
Medium (50-200): ████████████ 12 words
Low (<50):    ████████████████████ 20 words
```

### Search Result Ordering

```
Query Options:
─────────────
# Most relevant (frequency-based):
SELECT * FROM sinhala_words
WHERE romanized ILIKE '%search%'
ORDER BY frequency DESC, romanized ASC

# Alphabetical:
SELECT * FROM sinhala_words
WHERE romanized ILIKE '%search%'
ORDER BY romanized ASC

# Recent additions:
SELECT * FROM sinhala_words
WHERE romanized ILIKE '%search%'
ORDER BY created_at DESC
```

### Admin Dashboard Insights

| Metric | Calculation | Use |
|--------|-------------|-----|
| Total Searches | SUM(frequency) | Overall usage |
| Avg Frequency | AVG(frequency) | Typical usage |
| Most Popular | MAX(frequency) | Top term |
| Unused Words | WHERE frequency = 0 | Dictionary cleanup |

### Expected Outcome
- frequency field added to SinhalaWord model
- Field tracks word usage over time
- Search results ordered by popularity
- Foundation for analytics and insights
- Non-negative validation ensured

### Verification Checklist
- [ ] frequency field added to SinhalaWord model
- [ ] Field type is IntegerField
- [ ] default=0 set for new entries
- [ ] db_index=True for sorting
- [ ] Non-negative validator added
- [ ] verbose_name set appropriately
- [ ] Increment strategy planned
- [ ] Ordering considers frequency

---

## Task 08: Create Transliteration Model

### Overview
Create the Transliteration model to store alternative romanized spellings of Sinhala words. This model handles spelling variations that users might type when searching (e.g., "kiri", "keeri", "kere"). Each transliteration variant links to a SinhalaWord and is marked as common or uncommon, enabling flexible search matching.

### Dependencies
- Task 01: Create SinhalaWord Model

### Instructions

1. **Create transliteration model file**
   - Create new file `transliteration.py` in `models/` directory
   - Import Django model base classes
   - Import necessary field types

2. **Define Transliteration model class**
   - Create class inheriting from appropriate base model
   - Include tenant-aware model inheritance if needed
   - Add model Meta class for configuration

3. **Configure model metadata**
   - Set `verbose_name` to "Transliteration"
   - Set `verbose_name_plural` to "Transliterations"
   - Define `ordering` to sort by variant
   - Set unique_together on (word, variant)

4. **Plan model relationships**
   - Foreign key to SinhalaWord (Task 09)
   - Multiple transliterations per word (one-to-many)
   - Consider reverse relationship name

5. **Add string representation method**
   - Implement `__str__` method
   - Return variant with word reference
   - Format: "keeri (variant of kiri)"

6. **Define model purpose**
   - Store alternative spellings
   - Enable fuzzy matching
   - Support user typing variations

7. **Register model in __init__.py**
   - Import Transliteration in `models/__init__.py`
   - Export in `__all__` list

### Model Purpose and Use Cases

| Purpose | Description |
|---------|-------------|
| Variant Storage | Multiple spellings per word |
| Fuzzy Matching | Match despite spelling differences |
| User Flexibility | Accept various input styles |
| Search Enhancement | Increase result coverage |

### Model Structure Overview

```
┌────────────────────────────────────┐
│    Transliteration Model           │
├────────────────────────────────────┤
│ - word (FK to SinhalaWord)        │ ← Task 09
│ - variant (Alternative spelling)   │ ← Task 10
│ - is_common (Popularity flag)      │ ← Task 11
├────────────────────────────────────┤
│ Relationship:                      │
│ ← SinhalaWord (many-to-one)       │
└────────────────────────────────────┘
```

### Relationship Diagram

```
SinhalaWord (One)          Transliteration (Many)
┌────────────────┐         ┌───────────────────┐
│ id: 1          │←────────│ word_id: 1       │
│ sinhala: කිරි  │         │ variant: "keeri" │
│ romanized: kiri│         │ is_common: False │
└────────────────┘         └───────────────────┘
                           ┌───────────────────┐
                           │ word_id: 1       │
                           │ variant: "kere"  │
                           │ is_common: False │
                           └───────────────────┘
                           ┌───────────────────┐
                           │ word_id: 1       │
                           │ variant: "kiree" │
                           │ is_common: False │
                           └───────────────────┘
```

### Transliteration Examples

| SinhalaWord | Primary Romanized | Transliteration Variants |
|-------------|-------------------|-------------------------|
| කිරි | kiri | keeri, kere, kiree, kere |
| බත් | bath | bhath, baath, bat |
| මළු | malu | mallu, maalu, maloo |
| සබන් | saban | sabun, sabahn, sabon |
| තේ | the | thay, te, thee |

### Model Meta Configuration

```
Meta Class Settings:
───────────────────
verbose_name = "Transliteration"
verbose_name_plural = "Transliterations"
ordering = ['variant']
unique_together = [['word', 'variant']]

Purpose:
├── verbose_name: Admin display
├── ordering: Alphabetical listing
└── unique_together: Prevent duplicate variants per word
```

### Directory Structure

```
backend/apps/search/sinhaglish/models/
├── __init__.py
├── sinhala_word.py           # Task 01
└── transliteration.py        # Created in this task
```

### Search Integration

```
Search Query Expansion:
──────────────────────
User types: "keeri"
    ↓
1. Direct match: WHERE romanized = 'keeri' (not found)
2. Variant match: WHERE variant = 'keeri' (found!)
    ↓
Transliteration(variant="keeri", word_id=1)
    ↓
SinhalaWord(id=1, romanized="kiri", sinhala="කිරි")
    ↓
Return: Milk products
```

### Expected Outcome
- Transliteration model class created
- Model properly inherits from base classes
- Meta configuration defined
- Relationship to SinhalaWord planned
- String representation implemented
- Foundation ready for field definitions (Tasks 09-11)

### Verification Checklist
- [ ] `backend/apps/search/sinhaglish/models/transliteration.py` file created
- [ ] Transliteration class defined with proper inheritance
- [ ] Model Meta class configured
- [ ] `__str__` method implemented
- [ ] Model imported in `models/__init__.py`
- [ ] unique_together constraint planned
- [ ] Model follows project naming conventions

---

## Task 09: Create word FK

### Overview
Add the `word` foreign key field to the Transliteration model, establishing the relationship between alternative spellings and their primary Sinhala word entries. This foreign key enables querying all variants of a word and reverse lookups from SinhalaWord to its transliterations.

### Dependencies
- Task 01: Create SinhalaWord Model
- Task 08: Create Transliteration Model

### Instructions

1. **Open transliteration.py file**
   - Navigate to `backend/apps/search/sinhaglish/models/transliteration.py`
   - Locate the Transliteration class definition

2. **Import SinhalaWord model**
   - Import SinhalaWord from sinhala_word module
   - Ensure proper import path

3. **Add word foreign key field**
   - Define as ForeignKey to SinhalaWord
   - Set on_delete=models.CASCADE
   - Add verbose_name="Sinhala Word"

4. **Configure relationship properties**
   - Set related_name='transliterations' for reverse lookup
   - This allows: word.transliterations.all()
   - Add db_index=True for query performance

5. **Set field properties**
   - Set null=False and blank=False (required)
   - Each transliteration must link to a word

6. **Update unique_together constraint**
   - Ensure Meta class includes unique_together
   - Set to [['word', 'variant']]
   - Prevents duplicate variants per word

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | ForeignKey | Relationship |
| Related Model | SinhalaWord | Target model |
| On Delete | CASCADE | Delete variants with word |
| Related Name | transliterations | Reverse query name |
| Null | False | Required relationship |
| Blank | False | Required relationship |
| DB Index | True | Query optimization |

### Relationship Details

```
Relationship Type: Many-to-One
─────────────────────────────
Many Transliterations → One SinhalaWord

Example:
SinhalaWord: කිරි (kiri)
    ↑
    │ ForeignKey (word)
    │
    ├── Transliteration: keeri
    ├── Transliteration: kere
    └── Transliteration: kiree
```

### On Delete Behavior

| on_delete Option | Behavior | Use Case |
|------------------|----------|----------|
| CASCADE | Delete variants when word deleted | Chosen (maintain integrity) |
| PROTECT | Prevent word deletion if variants exist | Too restrictive |
| SET_NULL | Set FK to NULL when word deleted | Orphans variants |
| SET_DEFAULT | Set FK to default value | Requires default word |

### Reverse Relationship Usage

```
Forward Query (Transliteration → SinhalaWord):
─────────────────────────────────────────────
transliteration = Transliteration.objects.get(variant='keeri')
sinhala_word = transliteration.word
print(sinhala_word.romanized)  # Output: "kiri"

Reverse Query (SinhalaWord → Transliterations):
──────────────────────────────────────────────
sinhala_word = SinhalaWord.objects.get(romanized='kiri')
variants = sinhala_word.transliterations.all()
for variant in variants:
    print(variant.variant)
# Output: keeri, kere, kiree
```

### Database Schema

```
Table: transliterations
┌─────┬─────────┬─────────┬────────────┐
│ id  │ word_id │ variant │ is_common  │
├─────┼─────────┼─────────┼────────────┤
│ 1   │ 1       │ keeri   │ False      │
│ 2   │ 1       │ kere    │ False      │
│ 3   │ 1       │ kiree   │ False      │
│ 4   │ 2       │ bhath   │ True       │
│ 5   │ 2       │ baath   │ False      │
└─────┴─────────┴─────────┴────────────┘
          ↑
     Foreign Key to sinhala_words(id)
```

### Query Examples

```
Get all variants of a word:
──────────────────────────
word = SinhalaWord.objects.get(romanized='kiri')
variants = word.transliterations.values_list('variant', flat=True)
# Returns: ['keeri', 'kere', 'kiree']

Find word by variant:
────────────────────
trans = Transliteration.objects.select_related('word').get(variant='keeri')
word = trans.word
# Returns: SinhalaWord(romanized='kiri')

Count variants per word:
───────────────────────
from django.db.models import Count
words = SinhalaWord.objects.annotate(
    variant_count=Count('transliterations')
)
```

### Unique Together Constraint

```
Constraint Purpose:
──────────────────
unique_together = [['word', 'variant']]

Prevents:
├── Duplicate: word=1, variant='keeri'
└── Duplicate: word=1, variant='keeri'

Allows:
├── Different word: word=2, variant='keeri' (OK - different word)
└── Different variant: word=1, variant='kere' (OK - different spelling)
```

### Expected Outcome
- word foreign key added to Transliteration model
- Relationship to SinhalaWord established
- Cascade deletion configured
- Reverse relationship named 'transliterations'
- Indexed for query performance
- Unique constraint prevents duplicates

### Verification Checklist
- [ ] word field added to Transliteration model
- [ ] Field type is ForeignKey
- [ ] Related model is SinhalaWord
- [ ] on_delete=models.CASCADE set
- [ ] related_name='transliterations' set
- [ ] db_index=True for performance
- [ ] unique_together includes ['word', 'variant']
- [ ] SinhalaWord model imported correctly

---

## Task 10: Create variant Field

### Overview
Add the `variant` field to store alternative romanized spellings of Sinhala words. This field enables users to search using different transliteration styles, common misspellings, or phonetic variations. The field is indexed for fast search operations and works in conjunction with the primary romanized field in SinhalaWord.

### Dependencies
- Task 08: Create Transliteration Model

### Instructions

1. **Open transliteration.py file**
   - Navigate to the Transliteration model definition
   - Prepare to add variant field

2. **Add variant field**
   - Define as CharField with max_length=100
   - Match length of romanized field in SinhalaWord
   - Add verbose_name="Variant Spelling"

3. **Configure indexing**
   - Set db_index=True for search queries
   - Critical for variant lookup performance
   - Consider case-insensitive index

4. **Set field properties**
   - Set null=False and blank=False (required)
   - Add help_text for admin guidance
   - Consider lowercase normalization

5. **Update unique_together**
   - Ensure Meta includes [['word', 'variant']]
   - Prevents duplicate variants per word
   - Allows same variant for different words

6. **Define variant guidelines**
   - Document acceptable variant formats
   - Match romanization style of primary field
   - Consider phonetic variations

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | CharField | Text storage |
| Max Length | 100 | Match SinhalaWord.romanized |
| Null | False | Required field |
| Blank | False | Must have value |
| DB Index | True | Search performance |
| Verbose Name | "Variant Spelling" | Admin display |

### Variant Types

| Variant Type | Description | Examples |
|--------------|-------------|----------|
| Phonetic | Sound-alike spelling | kiri → keeri, kere |
| Regional | Regional pronunciation | bath → bhath |
| Length | Vowel length variation | malu → maalu, mallu |
| Common Misspelling | Frequent user errors | saban → sabun |
| Alternative System | Different romanization | the → thay, te |

### Variant Examples by Word

```
කිරි (kiri) - Milk:
├── keeri (ee vowel variant)
├── kere  (short form)
├── kiree (ie variant)
└── kiri  (should be in SinhalaWord.romanized)

බත් (bath) - Rice:
├── bhath (aspirated variant)
├── baath (long vowel)
├── bat   (without final h)
└── bath  (primary romanized)

මළු (malu) - Fish:
├── mallu (double consonant)
├── maalu (long vowel)
├── maloo (o variant)
└── malu  (primary romanized)

සබන් (saban) - Soap:
├── sabun (u/a variation)
├── sabahn (with h)
├── sabon (o variant)
└── saban (primary romanized)
```

### Variant vs Primary Romanized

```
Storage Strategy:
────────────────
SinhalaWord Model:
├── romanized: "kiri" (primary, most common)

Transliteration Model:
├── variant: "keeri" (alternative 1)
├── variant: "kere"  (alternative 2)
└── variant: "kiree" (alternative 3)

Note: Primary romanized can also appear as variant
      if you want unified search logic
```

### Search Query Integration

```
Comprehensive Search Query:
──────────────────────────
User types: "keeri"

Query 1: Check primary romanized
SELECT * FROM sinhala_words WHERE romanized = 'keeri'
Result: No match

Query 2: Check variants
SELECT sw.* FROM sinhala_words sw
JOIN transliterations t ON t.word_id = sw.id
WHERE t.variant = 'keeri'
Result: Match! (word: kiri)

Combined Query:
SELECT sw.* FROM sinhala_words sw
LEFT JOIN transliterations t ON t.word_id = sw.id
WHERE sw.romanized = 'keeri' OR t.variant = 'keeri'
```

### Admin Interface

```
Admin Display:
─────────────
SinhalaWord: කිරි (kiri)
└── Transliterations:
    ├── keeri (common)
    ├── kere  (uncommon)
    └── kiree (uncommon)

Inline Edit:
┌─────────────────────────────────────┐
│ SinhalaWord: කිරි (kiri)            │
├─────────────────────────────────────┤
│ Transliterations:                   │
│ ┌───────────┬────────────┬────┐    │
│ │ Variant   │ Is Common  │ Del│    │
│ ├───────────┼────────────┼────┤    │
│ │ keeri     │ ☐          │ ☐  │    │
│ │ kere      │ ☐          │ ☐  │    │
│ │ kiree     │ ☐          │ ☐  │    │
│ └───────────┴────────────┴────┘    │
│ [Add another Transliteration]       │
└─────────────────────────────────────┘
```

### Indexing Strategy

```
Index Options:
─────────────
1. Standard B-tree Index:
   CREATE INDEX idx_variant ON transliterations(variant)
   Purpose: Fast exact match, prefix search

2. Case-Insensitive Index:
   CREATE INDEX idx_variant_lower ON transliterations(LOWER(variant))
   Purpose: Case-insensitive search

3. Trigram Index (PostgreSQL):
   CREATE INDEX idx_variant_trgm ON transliterations USING gin(variant gin_trgm_ops)
   Purpose: Fuzzy matching, typo tolerance
```

### Expected Outcome
- variant field added to Transliteration model
- Field indexed for fast search
- Multiple variants per word supported
- Unique constraint prevents duplicates per word
- Search queries can match primary or variant spellings

### Verification Checklist
- [ ] variant field added to Transliteration model
- [ ] Field type is CharField with max_length=100
- [ ] db_index=True for search performance
- [ ] verbose_name set appropriately
- [ ] Field marked as required
- [ ] unique_together includes ['word', 'variant']
- [ ] Variant format documented

---

## Task 11: Create is_common Field

### Overview
Add the `is_common` field to mark whether a transliteration variant is commonly used or rare. This field enables intelligent search result ranking, prioritizing common variants over uncommon ones. It helps distinguish between widely-accepted alternative spellings and rare variations.

### Dependencies
- Task 08: Create Transliteration Model

### Instructions

1. **Open transliteration.py file**
   - Navigate to the Transliteration model definition
   - Prepare to add is_common field

2. **Add is_common field**
   - Define as BooleanField
   - Set default=False (variants are uncommon by default)
   - Add verbose_name="Is Common Variant"

3. **Configure field properties**
   - Set null=False (boolean has True/False/default)
   - Set blank=True (optional in forms)
   - Add help_text for admin guidance

4. **Define "common" criteria**
   - Used by significant portion of users
   - Officially recognized alternative spelling
   - Regional standard romanization
   - Documented in dictionaries

5. **Plan ranking strategy**
   - Common variants rank higher in search
   - Primary romanized ranks highest
   - Uncommon variants rank lowest

6. **Update admin interface**
   - Add is_common to list_display
   - Enable filtering by common/uncommon
   - Show checkboxes in inline forms

### Field Specifications

| Property | Value | Purpose |
|----------|-------|---------|
| Field Type | BooleanField | True/False flag |
| Default | False | Most variants uncommon |
| Null | False | Always has value |
| Blank | True | Optional in forms |
| DB Index | False | Not primary search field |
| Verbose Name | "Is Common Variant" | Admin display |

### Common vs Uncommon Examples

```
කිරි (kiri) - Milk:
├── keeri  → is_common=True  (widely used)
├── kere   → is_common=False (rare)
└── kiree  → is_common=False (rare)

බත් (bath) - Rice:
├── bhath  → is_common=True  (common regional)
├── baath  → is_common=False (uncommon)
└── bat    → is_common=False (rare)

මළු (malu) - Fish:
├── mallu  → is_common=False (uncommon)
├── maalu  → is_common=True  (common variant)
└── maloo  → is_common=False (rare)
```

### Ranking Strategy

```
Search Result Ranking:
─────────────────────
Priority 1: Primary romanized (SinhalaWord.romanized)
    ↓
Priority 2: Common variants (is_common=True)
    ↓
Priority 3: Uncommon variants (is_common=False)

Example Search for "keeri":
┌────┬───────────┬─────────────┬──────────┬──────────┐
│ #  │ Match Type│ Word        │ Is Common│ Rank     │
├────┼───────────┼─────────────┼──────────┼──────────┤
│ 1  │ Primary   │ keeri       │ N/A      │ Highest  │
│ 2  │ Common    │ kiri→keeri  │ True     │ High     │
│ 3  │ Uncommon  │ kere→keeri  │ False    │ Lower    │
└────┴───────────┴─────────────┴──────────┴──────────┘
```

### Query with Ranking

```
Search Query with Ranking:
─────────────────────────
SELECT sw.*,
       CASE
           WHEN sw.romanized = 'keeri' THEN 1
           WHEN t.variant = 'keeri' AND t.is_common THEN 2
           WHEN t.variant = 'keeri' AND NOT t.is_common THEN 3
           ELSE 4
       END AS rank_score
FROM sinhala_words sw
LEFT JOIN transliterations t ON t.word_id = sw.id
WHERE sw.romanized = 'keeri'
   OR t.variant = 'keeri'
ORDER BY rank_score ASC, sw.frequency DESC
```

### Common Variant Criteria

| Criterion | Description | Example |
|-----------|-------------|---------|
| Usage Frequency | Used by >20% of users | "bhath" for bath |
| Official Standard | In official romanization | "ae" for ඒ sound |
| Regional Norm | Standard in region | "th" vs "dh" |
| Dictionary Entry | Listed in dictionaries | Multiple recognized forms |
| Educational | Taught in schools | Standard transliteration |

### Admin Interface Enhancement

```
Transliteration List View:
┌──────────┬─────────────┬────────────┬───────────┐
│ Word     │ Variant     │ Is Common  │ Usage     │
├──────────┼─────────────┼────────────┼───────────┤
│ kiri     │ keeri       │ ✓          │ High      │
│ kiri     │ kere        │ ✗          │ Low       │
│ bath     │ bhath       │ ✓          │ High      │
│ bath     │ baath       │ ✗          │ Medium    │
└──────────┴─────────────┴────────────┴───────────┘

Filter Options:
├── All variants
├── Common variants only (is_common=True)
└── Uncommon variants only (is_common=False)
```

### Usage Statistics

```
Variant Distribution Analysis:
─────────────────────────────
Total Transliterations: 45
├── Common (is_common=True): 12 (27%)
└── Uncommon (is_common=False): 33 (73%)

Common Variants by Category:
├── Grocery: 5 common variants
├── Household: 3 common variants
├── Colors: 2 common variants
└── General: 2 common variants
```

### Search Result Display

```
Search Results for "keeri":
──────────────────────────
┌──────────────────────────────────────┐
│ Milk Products                         │
│ කිරි (kiri)                          │
│ Also matches: keeri (common variant) │
│                                       │
│ [Anchor Full Cream 400g]             │
│ [Highland Fresh Milk 1L]             │
└──────────────────────────────────────┘
      ↑ Indicates common variant matched
```

### Expected Outcome
- is_common field added to Transliteration model
- Field enables variant ranking in search
- Common variants prioritized over uncommon
- Admin interface supports filtering by commonality
- Foundation for intelligent search results

### Verification Checklist
- [ ] is_common field added to Transliteration model
- [ ] Field type is BooleanField
- [ ] default=False set appropriately
- [ ] verbose_name set appropriately
- [ ] help_text provides guidance
- [ ] Admin list_display includes is_common
- [ ] Admin filter_list includes is_common
- [ ] Common variant criteria documented

---

## Summary

This document established the foundational dictionary models for Sinhaglish search, including the SinhalaWord model with all essential fields for storing Sinhala vocabulary (Unicode text, romanization, English meanings, phonetic keys, categories, and usage frequency), and the Transliteration model for managing alternative spellings with commonality flags.

### Completed Tasks
1. ✓ Created SinhalaWord model foundation
2. ✓ Added sinhala_text field for Unicode storage
3. ✓ Added romanized field for Sinhaglish search
4. ✓ Added english_meaning field for translations
5. ✓ Added phonetic_key field for sound-based matching
6. ✓ Added category field for classification
7. ✓ Added frequency field for usage tracking
8. ✓ Created Transliteration model foundation
9. ✓ Added word foreign key relationship
10. ✓ Added variant field for alternative spellings
11. ✓ Added is_common field for variant ranking

### Next Steps
Proceed to [02_Tasks-12-16_ProductTranslation-Migration.md](02_Tasks-12-16_ProductTranslation-Migration.md) to create the ProductTranslation model linking products to Sinhala names and generate database migrations for all dictionary models.

### Data Model Summary

```
┌─────────────────────────────────────┐
│         SinhalaWord                 │
├─────────────────────────────────────┤
│ - id (PK)                           │
│ - sinhala_text (Unicode)            │
│ - romanized (Sinhaglish)            │
│ - english_meaning (Translation)     │
│ - phonetic_key (Sound hash)         │
│ - category (Product category)       │
│ - frequency (Usage count)           │
└─────────────────────────────────────┘
         ↑                      ↑
         │                      │
         │ (one-to-many)        │ (one-to-one)
         │                      │
┌────────┴─────────┐    ┌───────┴────────────┐
│ Transliteration  │    │ ProductTranslation │
├──────────────────┤    ├────────────────────┤
│ - word_id (FK)   │    │ - product_id (FK)  │
│ - variant        │    │ - word_id (FK)     │
│ - is_common      │    │ - sinhala_name     │
└──────────────────┘    └────────────────────┘
                              (Next Document)
```
