# Group D: Search Integration

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** D of F  
> **Tasks Covered:** 53-66  
> **Group Goal:** Integrate Sinhaglish with main search service

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Phonetic-Matching](../Group-C_Phonetic-Matching/)
- **→ Next Group:** [Group-E_Learning-System](../Group-E_Learning-System/)

---

## Group Overview

This group integrates with search. Creates SinhaglishService with expand_query method, tokenize method, and translate_token method. Creates Query Expansion to add English terms and Multi-Term Query for phrases. Creates SearchService Integration with pre_search_hook. Creates Index Sinhala Names. Creates Multi-Script Results and Highlight Sinhala. Creates Tamil-glish support with TamilWord Model. Verifies integration.

### Key Outcomes

- SinhaglishService
- expand_query method
- tokenize method
- translate_token method
- Query Expansion
- Multi-Term Query
- SearchService Integration
- pre_search_hook
- Index Sinhala Names
- Multi-Script Results
- Highlight Sinhala
- Tamil-glish
- TamilWord Model
- Integration verified

### Technology Context

- **Query Expansion:** Add translations
- **Multi-script:** Sinhala + English
- **Hook:** Pre-search processing
- **Tamil:** Bonus support

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-60_Service-Integration.md` | Create service and integration | 53-60 |
| 02 | `02_Tasks-61-66_MultiScript-Tamil.md` | Create multi-script and Tamil | 61-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create SinhaglishService | High | Task 52 |
| 54 | Create expand_query Method | Medium | Task 53 |
| 55 | Create tokenize Method | Low | Task 54 |
| 56 | Create translate_token | Medium | Task 55 |
| 57 | Create Query Expansion | Medium | Task 56 |
| 58 | Create Multi-Term Query | Medium | Task 57 |
| 59 | Create SearchService Integration | Medium | Task 58 |
| 60 | Create pre_search_hook | Medium | Task 59 |
| 61 | Create Index Sinhala Names | Medium | Task 60 |
| 62 | Create Multi-Script Results | Medium | Task 61 |
| 63 | Create Highlight Sinhala | Low | Task 62 |
| 64 | Create Tamil-glish | Medium | Task 53 |
| 65 | Create TamilWord Model | Medium | Task 64 |
| 66 | Verify Integration | Low | Task 65 |

---

## Execution Order

```
Task 53: SinhaglishService
    │
    ├─────────────────────────┐
    ▼                         ▼
Task 54: expand_query    Task 64: Tamil-glish
    │                         │
    ▼                         ▼
Task 55: tokenize        Task 65: TamilWord
    │                         │
    ▼                         │
Task 56: translate_token      │
    │                         │
    ▼                         │
Task 57: Query Expansion      │
    │                         │
    ▼                         │
Task 58: Multi-Term Query     │
    │                         │
    ▼                         │
Task 59: SearchService Integration
    │                         │
    ▼                         │
Task 60: pre_search_hook      │
    │                         │
    ▼                         │
Task 61: Index Sinhala Names  │
    │                         │
    ▼                         │
Task 62: Multi-Script Results │
    │                         │
    ▼                         │
Task 63: Highlight Sinhala    │
    │                         │
    └─────────────────────────┘
              │
              ▼
       Task 66: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        └── sinhaglish/
            └── services/
                ├── __init__.py
                └── sinhaglish_service.py
```

---

## Notes for AI Agents

### SinhaglishService (Task 53)
| Class | SinhaglishService |
|-------|-------------------|
| Purpose | Main Sinhaglish service |

### expand_query Method (Task 54)
| Method | expand_query(query) |
|--------|---------------------|
| Return | Expanded query |
| Process | Tokenize → Translate → Expand |

### Query Expansion Example
| Input | Output |
|-------|--------|
| "kiri kesel" | "kiri kesel milk banana" |
| "loku malu" | "loku malu big fish large" |

### tokenize Method (Task 55)
| Method | tokenize(query) |
|--------|-----------------|
| Return | List of tokens |
| Separator | Space |

### translate_token (Task 56)
| Method | translate_token(token) |
|--------|------------------------|
| Return | (original, english, sinhala) |
| Lookup | Dictionary + phonetic |

### Translation Process
| Step | Action |
|------|--------|
| 1 | Exact match lookup |
| 2 | Variant lookup |
| 3 | Phonetic lookup |
| 4 | Return translations |

### Query Expansion (Task 57)
| Method | expand(tokens, translations) |
|--------|------------------------------|
| Return | Expanded query string |
| Format | original + english + sinhala |

### Multi-Term Query (Task 58)
| Feature | Multi-term |
|---------|-----------|
| Handle | "kiri kesel" as phrase |
| Expand | Each term independently |

### SearchService Integration (Task 59)
| Integration | SearchService |
|-------------|---------------|
| Point | pre_search_hook |
| Action | Expand query |

### pre_search_hook (Task 60)
| Hook | pre_search_hook(query) |
|------|------------------------|
| When | Before MeiliSearch |
| Action | Call SinhaglishService.expand_query |

### Index Sinhala Names (Task 61)
| Field | sinhala_name |
|-------|--------------|
| Index | MeiliSearch |
| Searchable | Yes |

### Multi-Script Results (Task 62)
| Feature | Multi-script |
|---------|-------------|
| Return | name + sinhala_name |
| Display | Both in UI |

### Multi-Script Response
| Field | Content |
|-------|---------|
| name | English name |
| sinhala_name | Sinhala name |
| matched_term | Which term matched |

### Highlight Sinhala (Task 63)
| Feature | Highlight |
|---------|----------|
| Highlight | Sinhala matches |
| Tags | <em>match</em> |

### Tamil-glish (Task 64)
| Feature | Tamil support |
|---------|--------------|
| Similar | To Sinhaglish |
| Dictionary | Separate |

### Tamil Examples
| Romanized | Tamil | English |
|-----------|-------|---------|
| paal | பால் | Milk |
| arisi | அரிசி | Rice |
| meen | மீன் | Fish |

### TamilWord Model (Task 65)
| Class | TamilWord |
|-------|-----------|
| Purpose | Tamil dictionary |
| Fields | Same as SinhalaWord |
