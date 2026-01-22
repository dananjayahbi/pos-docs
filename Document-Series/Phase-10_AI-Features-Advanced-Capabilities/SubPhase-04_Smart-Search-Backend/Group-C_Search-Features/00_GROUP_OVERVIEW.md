# Group C: Search Features

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement search service with fuzzy matching, synonyms, and filters

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Index-Management](../Group-B_Index-Management/)
- **→ Next Group:** [Group-D_Ranking-Boosting](../Group-D_Ranking-Boosting/)

---

## Group Overview

This group implements search features. Creates SearchService with search method. Configures Typo Tolerance with min_word_size setting. Creates Synonym model with word and synonyms fields. Creates SynonymService with add_synonym and sync_synonyms methods. Creates Filter Builder with category_filter, brand_filter, price_filter, and stock_filter methods. Creates Faceted Search and Highlighting. Verifies search features.

### Key Outcomes

- SearchService
- search method
- Typo Tolerance
- min_word_size setting
- Synonym model
- word field
- synonyms field
- SynonymService
- add_synonym method
- sync_synonyms method
- Filter Builder
- category_filter
- brand_filter
- price_filter
- stock_filter
- Faceted Search
- Highlighting
- Search features verified

### Technology Context

- **Fuzzy:** MeiliSearch typo tolerance
- **Synonyms:** Custom dictionary
- **Filters:** Faceted filtering
- **Highlight:** Match highlighting

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Service-Synonyms.md` | Create service and synonyms | 35-44 |
| 02 | `02_Tasks-45-52_Filters-Facets-Highlight.md` | Create filters, facets, highlight | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create SearchService | High | Task 34 |
| 36 | Create search Method | Medium | Task 35 |
| 37 | Create Typo Tolerance | Medium | Task 36 |
| 38 | Create min_word_size | Low | Task 37 |
| 39 | Create Synonym Model | Medium | Task 38 |
| 40 | Create word Field | Low | Task 39 |
| 41 | Create synonyms Field | Low | Task 39 |
| 42 | Create SynonymService | Medium | Task 41 |
| 43 | Create add_synonym Method | Low | Task 42 |
| 44 | Create sync_synonyms Method | Medium | Task 43 |
| 45 | Create Filter Builder | Medium | Task 36 |
| 46 | Create category_filter | Low | Task 45 |
| 47 | Create brand_filter | Low | Task 45 |
| 48 | Create price_filter | Low | Task 45 |
| 49 | Create stock_filter | Low | Task 45 |
| 50 | Create Faceted Search | Medium | Task 49 |
| 51 | Create Highlighting | Low | Task 36 |
| 52 | Verify Search Features | Low | Task 51 |

---

## Execution Order

```
Task 35: SearchService
    │
    ▼
Task 36: search
    │
    ├────────────────────────┬─────────────────┐
    ▼                        ▼                 ▼
Task 37: Typo         Task 45: Filters    Task 51: Highlight
    │                        │                 │
    ▼                   ┌────┼────┬────┐       │
Task 38: min_word       ▼    ▼    ▼    ▼       │
    │                 T-46  T-47  T-48  T-49   │
    ▼               (Cat) (Brand)(Price)(Stock)│
Task 39: Synonym Model   │    │    │    │      │
    │                    └────┴────┴────┘      │
    ├────────┐                 │               │
    ▼        ▼                 ▼               │
T-40      T-41          Task 50: Faceted       │
(Word) (Synonyms)              │               │
    │        │                 │               │
    └────────┘                 │               │
         │                     │               │
         ▼                     │               │
  Task 42: SynonymService      │               │
         │                     │               │
         ▼                     │               │
  Task 43: add_synonym         │               │
         │                     │               │
         ▼                     │               │
  Task 44: sync_synonyms       │               │
         │                     │               │
         └─────────────────────┴───────────────┘
                        │
                        ▼
                 Task 52: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        ├── models/
        │   └── synonym.py
        └── services/
            ├── __init__.py
            ├── search_service.py
            ├── synonym_service.py
            └── filter_builder.py
```

---

## Notes for AI Agents

### SearchService (Task 35)
| Class | SearchService |
|-------|---------------|
| Purpose | Execute searches |

### search Method (Task 36)
| Method | search(query, filters=None, limit=20, offset=0) |
|--------|------------------------------------------------|
| Return | SearchResults object |
| Steps | Query → Filter → Rank → Return |

### Search Pipeline
| Step | Action |
|------|--------|
| 1 | Tokenize query |
| 2 | Apply typo tolerance |
| 3 | Expand synonyms |
| 4 | Apply filters |
| 5 | Rank results |
| 6 | Highlight matches |

### Typo Tolerance (Task 37)
| Setting | typoTolerance |
|---------|---------------|
| Enabled | True |
| minWordSizeForTypos | See below |

### min_word_size (Task 38)
| Setting | Value |
|---------|-------|
| oneTypo | 5 (chars) |
| twoTypos | 9 (chars) |

### Typo Examples
| Query | Matches |
|-------|---------|
| "iphne" | "iphone" |
| "samung" | "samsung" |
| "lapto" | "laptop" |

### Synonym Model (Task 39)
| Class | Synonym |
|-------|---------|
| Purpose | Store synonyms |

### word Field (Task 40)
| Field | Type |
|-------|------|
| Name | word |
| Type | CharField(100) |
| Unique | True |

### synonyms Field (Task 41)
| Field | Type |
|-------|------|
| Name | synonyms |
| Type | JSONField |
| Format | ["synonym1", "synonym2"] |

### Synonym Examples
| Word | Synonyms |
|------|----------|
| mobile | phone, smartphone, cell |
| laptop | notebook, computer |
| tv | television, led, lcd |

### SynonymService (Task 42)
| Class | SynonymService |
|-------|----------------|
| Purpose | Manage synonyms |

### add_synonym Method (Task 43)
| Method | add_synonym(word, synonyms) |
|--------|----------------------------|
| Action | Add/update synonym |

### sync_synonyms Method (Task 44)
| Method | sync_synonyms() |
|--------|-----------------|
| Action | Push to MeiliSearch |
| Format | MeiliSearch synonyms format |

### Filter Builder (Task 45)
| Class | FilterBuilder |
|-------|---------------|
| Purpose | Build filter queries |

### category_filter (Task 46)
| Method | category_filter(category_id) |
|--------|------------------------------|
| Return | category_id = X |

### brand_filter (Task 47)
| Method | brand_filter(brand) |
|--------|---------------------|
| Return | brand = 'X' |

### price_filter (Task 48)
| Method | price_filter(min_price, max_price) |
|--------|-----------------------------------|
| Return | price >= X AND price <= Y |

### stock_filter (Task 49)
| Method | stock_filter(in_stock_only=True) |
|--------|----------------------------------|
| Return | stock > 0 |

### Faceted Search (Task 50)
| Feature | Faceted search |
|---------|----------------|
| Return | Facet counts |
| Facets | category, brand, price range |

### Facet Response
| Facet | Example |
|-------|---------|
| category | {"Electronics": 50, "Clothing": 30} |
| brand | {"Apple": 20, "Samsung": 15} |
| price_range | {"0-100": 25, "100-500": 40} |

### Highlighting (Task 51)
| Feature | Highlight matches |
|---------|-------------------|
| Tags | <em>match</em> |
| Fields | name, description |
