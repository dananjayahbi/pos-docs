# SubPhase 05: Smart Search Sinhala-glish - Tasks Summary

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase Index:** 05 of 12  
> **SubPhase Goal:** Implement Sinhala transliteration support for search (Sinhala typed in English)  
> **Total Tasks:** 86 | **Status:** Planning  
> **Estimated Duration:** 11-13 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-04_Smart-Search-Backend](../SubPhase-04_Smart-Search-Backend/)
- **→ Next SubPhase:** [SubPhase-06_AI-Chatbot-Backend](../SubPhase-06_AI-Chatbot-Backend/)

---

## SubPhase Overview

This sub-phase implements "Sinhala-glish" support - the ability to search using Sinhala words typed in English characters (transliteration), enabling Sri Lankan users to search naturally.

### Key Outcomes
- Sinhala-English transliteration dictionary
- Phonetic matching algorithm
- Common transliteration patterns
- Learning from search behavior
- Tamil-glish support (bonus)
- Multi-script search results

### Transliteration Examples
| Input (English) | Sinhala | English Meaning |
|-----------------|---------|-----------------|
| kiri | කිරි | Milk |
| bath | බත් | Cooked Rice |
| sahal | සහල් | Rice (uncooked) |
| malu | මළු | Fish |
| parippu | පරිප්පු | Lentils |
| kaema | කෑම | Food |
| gas | ගෑස් | Gas |
| tel | තෙල් | Oil |

### Technology Stack
- **Dictionary:** PostgreSQL with full-text search
- **Phonetic:** Soundex/Metaphone variants
- **ML:** Character-level embeddings (optional)
- **Cache:** Redis for dictionary lookups

---

## Task Execution Order

```
TASK GROUP A: Dictionary Models (Tasks 01-16)
        │
        ▼
TASK GROUP B: Core Dictionary (Tasks 17-36)
        │
        ▼
TASK GROUP C: Phonetic Matching (Tasks 37-52)
        │
        ▼
TASK GROUP D: Search Integration (Tasks 53-66)
        │
        ▼
TASK GROUP E: Learning System (Tasks 67-78)
        │
        ▼
TASK GROUP F: API & Testing (Tasks 79-86)
```

---

## Task Index

### Group A: Dictionary Models (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create SinhalaWord Model** | Sinhala dictionary | SubPhase-04 | 🔴 Not Created |
| 02 | **Create sinhala_text Field** | Sinhala Unicode | Task 01 | 🔴 Not Created |
| 03 | **Create romanized Field** | Roman spelling | Task 01 | 🔴 Not Created |
| 04 | **Create english_meaning Field** | English translation | Task 01 | 🔴 Not Created |
| 05 | **Create phonetic_key Field** | Phonetic hash | Task 01 | 🔴 Not Created |
| 06 | **Create category Field** | Word category | Task 01 | 🔴 Not Created |
| 07 | **Create frequency Field** | Usage frequency | Task 01 | 🔴 Not Created |
| 08 | **Create Transliteration Model** | Alternative spellings | Task 01 | 🔴 Not Created |
| 09 | **Create word FK** | Link to SinhalaWord | Task 08 | 🔴 Not Created |
| 10 | **Create variant Field** | Spelling variant | Task 08 | 🔴 Not Created |
| 11 | **Create is_common Field** | Common variant | Task 08 | 🔴 Not Created |
| 12 | **Create ProductTranslation Model** | Product Sinhala names | Task 01 | 🔴 Not Created |
| 13 | **Create product FK** | Link to product | Task 12 | 🔴 Not Created |
| 14 | **Create sinhala_name Field** | Sinhala name | Task 12 | 🔴 Not Created |
| 15 | **Create Dictionary Migrations** | Generate migrations | Task 14 | 🔴 Not Created |
| 16 | **Verify Models** | Test model creation | Task 15 | 🔴 Not Created |

---

### Group B: Core Dictionary (Tasks 17-36)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create Grocery Words** | Grocery items | Task 16 | 🔴 Not Created |
| 18 | **Create Milk/Dairy Words** | kiri, curd, butter | Task 17 | 🔴 Not Created |
| 19 | **Create Rice/Grain Words** | sahal, bath, kurakkan | Task 17 | 🔴 Not Created |
| 20 | **Create Meat/Fish Words** | malu, mas, kukul | Task 17 | 🔴 Not Created |
| 21 | **Create Vegetable Words** | elawalu, karawila | Task 17 | 🔴 Not Created |
| 22 | **Create Fruit Words** | palam, ambul | Task 17 | 🔴 Not Created |
| 23 | **Create Spice Words** | kurundu, gammiris | Task 17 | 🔴 Not Created |
| 24 | **Create Household Words** | Household items | Task 17 | 🔴 Not Created |
| 25 | **Create Clothing Words** | Clothing items | Task 17 | 🔴 Not Created |
| 26 | **Create Electronics Words** | Electronics terms | Task 17 | 🔴 Not Created |
| 27 | **Create Common Phrases** | Common shopping phrases | Task 17 | 🔴 Not Created |
| 28 | **Create Color Words** | Colors in Sinhala | Task 17 | 🔴 Not Created |
| 29 | **Create Size Words** | loku, podi, etc. | Task 17 | 🔴 Not Created |
| 30 | **Create Quantity Words** | eka, deka, thuna | Task 17 | 🔴 Not Created |
| 31 | **Create DictionaryService** | Dictionary lookup | Task 30 | 🔴 Not Created |
| 32 | **Create lookup Method** | Find by romanized | Task 31 | 🔴 Not Created |
| 33 | **Create get_variants Method** | Get all spellings | Task 32 | 🔴 Not Created |
| 34 | **Create Dictionary Cache** | Redis cache | Task 33 | 🔴 Not Created |
| 35 | **Create Dictionary Admin** | Admin CRUD | Task 31 | 🔴 Not Created |
| 36 | **Verify Dictionary** | Test lookups | Task 35 | 🔴 Not Created |

---

### Group C: Phonetic Matching (Tasks 37-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 37 | **Create PhoneticEncoder** | Phonetic encoding | Task 36 | 🔴 Not Created |
| 38 | **Create SinhalaSoundex** | Sinhala Soundex | Task 37 | 🔴 Not Created |
| 39 | **Create encode Method** | Generate phonetic key | Task 38 | 🔴 Not Created |
| 40 | **Create Consonant Mapping** | Sinhala consonants | Task 39 | 🔴 Not Created |
| 41 | **Create Vowel Handling** | Handle vowels | Task 40 | 🔴 Not Created |
| 42 | **Create Double Letters** | Handle doubles | Task 41 | 🔴 Not Created |
| 43 | **Create PhoneticMatcher** | Phonetic search | Task 42 | 🔴 Not Created |
| 44 | **Create find_similar Method** | Find similar sounds | Task 43 | 🔴 Not Created |
| 45 | **Create Similarity Threshold** | Match threshold | Task 44 | 🔴 Not Created |
| 46 | **Create Fuzzy Phonetic** | Fuzzy + phonetic | Task 45 | 🔴 Not Created |
| 47 | **Create TransliterationPatterns** | Common patterns | Task 36 | 🔴 Not Created |
| 48 | **Create th Pattern** | th → ත | Task 47 | 🔴 Not Created |
| 49 | **Create aa Pattern** | aa → ආ | Task 47 | 🔴 Not Created |
| 50 | **Create Pattern Matcher** | Apply patterns | Task 49 | 🔴 Not Created |
| 51 | **Create Index Phonetics** | Index phonetic keys | Task 50 | 🔴 Not Created |
| 52 | **Verify Phonetic** | Test matching | Task 51 | 🔴 Not Created |

---

### Group D: Search Integration (Tasks 53-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create SinhaglishService** | Main Sinhaglish service | Task 52 | 🔴 Not Created |
| 54 | **Create expand_query Method** | Expand search query | Task 53 | 🔴 Not Created |
| 55 | **Create tokenize Method** | Tokenize query | Task 54 | 🔴 Not Created |
| 56 | **Create translate_token** | Translate each token | Task 55 | 🔴 Not Created |
| 57 | **Create Query Expansion** | Add English terms | Task 56 | 🔴 Not Created |
| 58 | **Create Multi-Term Query** | Handle phrases | Task 57 | 🔴 Not Created |
| 59 | **Create SearchService Integration** | Integrate with search | Task 58 | 🔴 Not Created |
| 60 | **Create pre_search_hook** | Expand before search | Task 59 | 🔴 Not Created |
| 61 | **Create Index Sinhala Names** | Index product Sinhala | Task 60 | 🔴 Not Created |
| 62 | **Create Multi-Script Results** | Return with scripts | Task 61 | 🔴 Not Created |
| 63 | **Create Highlight Sinhala** | Highlight matches | Task 62 | 🔴 Not Created |
| 64 | **Create Tamil-glish** | Tamil support | Task 53 | 🔴 Not Created |
| 65 | **Create TamilWord Model** | Tamil dictionary | Task 64 | 🔴 Not Created |
| 66 | **Verify Integration** | Test search | Task 65 | 🔴 Not Created |

---

### Group E: Learning System (Tasks 67-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create SearchLearning** | Learn from behavior | Task 66 | 🔴 Not Created |
| 68 | **Create TransliterationLog** | Log translations | Task 67 | 🔴 Not Created |
| 69 | **Create query Field** | Original query | Task 68 | 🔴 Not Created |
| 70 | **Create expanded Field** | Expanded query | Task 68 | 🔴 Not Created |
| 71 | **Create clicked_product FK** | What was clicked | Task 68 | 🔴 Not Created |
| 72 | **Create PatternLearner** | Learn patterns | Task 71 | 🔴 Not Created |
| 73 | **Create identify_patterns** | Find new patterns | Task 72 | 🔴 Not Created |
| 74 | **Create suggest_words** | Suggest dictionary | Task 73 | 🔴 Not Created |
| 75 | **Create PendingWord Model** | Pending additions | Task 74 | 🔴 Not Created |
| 76 | **Create Admin Review UI** | Review pending | Task 75 | 🔴 Not Created |
| 77 | **Create Auto-Add Popular** | Auto-add frequent | Task 76 | 🔴 Not Created |
| 78 | **Verify Learning** | Test learning | Task 77 | 🔴 Not Created |

---

### Group F: API & Testing (Tasks 79-86)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Sinhaglish API** | DRF ViewSet | Task 78 | 🔴 Not Created |
| 80 | **Create Translate Endpoint** | POST /api/translate/ | Task 79 | 🔴 Not Created |
| 81 | **Create Dictionary API** | GET /api/dictionary/ | Task 79 | 🔴 Not Created |
| 82 | **Create Sinhaglish Types** | TypeScript interfaces | Task 81 | 🔴 Not Created |
| 83 | **Create Sinhaglish Client** | Frontend API client | Task 82 | 🔴 Not Created |
| 84 | **Create Multi-Script Display** | Show both scripts | Task 83 | 🔴 Not Created |
| 85 | **Create Integration Tests** | E2E Sinhaglish tests | Task 84 | 🔴 Not Created |
| 86 | **Create Documentation** | Sinhaglish docs | Task 85 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── search/
        └── sinhaglish/
            ├── __init__.py
            ├── models/
            │   ├── sinhala_word.py            # SinhalaWord (Task 01)
            │   ├── transliteration.py         # Transliteration (Task 08)
            │   ├── product_translation.py     # ProductTranslation (Task 12)
            │   ├── transliteration_log.py     # TransliterationLog (Task 68)
            │   └── pending_word.py            # PendingWord (Task 75)
            ├── dictionary/
            │   ├── __init__.py
            │   ├── data/
            │   │   ├── grocery.py             # Grocery words (Task 17)
            │   │   ├── household.py           # Household (Task 24)
            │   │   ├── clothing.py            # Clothing (Task 25)
            │   │   └── common.py              # Common phrases (Task 27)
            │   └── service.py                 # DictionaryService (Task 31)
            ├── phonetic/
            │   ├── __init__.py
            │   ├── encoder.py                 # PhoneticEncoder (Task 37)
            │   ├── soundex.py                 # SinhalaSoundex (Task 38)
            │   ├── matcher.py                 # PhoneticMatcher (Task 43)
            │   └── patterns.py                # TransliterationPatterns (Task 47)
            ├── services/
            │   ├── __init__.py
            │   ├── sinhaglish_service.py      # SinhaglishService (Task 53)
            │   └── learning.py                # SearchLearning (Task 67)
            └── api/
                └── views.py                   # API views (Task 79)

frontend/
└── lib/
    └── search/
        └── sinhaglish/
            ├── types.ts                       # Types (Task 82)
            └── client.ts                      # API client (Task 83)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Dictionary Models | 16 | 0 | 0% |
| B | Core Dictionary | 20 | 0 | 0% |
| C | Phonetic Matching | 16 | 0 | 0% |
| D | Search Integration | 14 | 0 | 0% |
| E | Learning System | 12 | 0 | 0% |
| F | API & Testing | 8 | 0 | 0% |
| **Total** | | **86** | **0** | **0%** |

---

## Common Transliteration Patterns

| Pattern | Sinhala Sound | Example |
|---------|---------------|---------|
| th | ත (soft t) | thel → තෙල් |
| dh | ද (soft d) | dhawala → ධවල |
| aa | ආ (long a) | kaama → කාම |
| ee | ඊ (long e) | geema → ගීම |
| oo | ඕ (long o) | pooja → පූජා |
| ch | ච | chaya → ඡය |
| ng | ං | anga → අංග |

---

## Dictionary Categories

| Category | Examples | Count (Initial) |
|----------|----------|-----------------|
| Grocery | kiri, bath, malu | 200+ |
| Household | watura, sabun | 100+ |
| Clothing | sarama, hettaya | 50+ |
| Electronics | phone, TV | 30+ |
| Colors | kaha, nil, rathu | 15+ |
| Sizes | loku, podi | 10+ |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Build dictionary first** - Core dictionary before search
3. **Phonetic keys** - Generate on word creation
4. **Multiple variants** - Allow many spellings per word
5. **Query expansion** - Add English equivalents
6. **Learning system** - Log and learn from searches
7. **Admin review** - Pending words need approval
8. **Cache dictionary** - Redis for fast lookups
9. **Tamil support** - Optional Tamil-glish
10. **Multi-script** - Return Sinhala and English
