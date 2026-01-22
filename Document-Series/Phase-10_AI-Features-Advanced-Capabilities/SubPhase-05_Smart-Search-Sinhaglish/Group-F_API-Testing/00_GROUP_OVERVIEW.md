# Group F: API & Testing

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 05 - Smart Search Sinhaglish  
> **Group:** F of F  
> **Tasks Covered:** 79-86  
> **Group Goal:** Create Sinhaglish API endpoints and frontend integration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Learning-System](../Group-E_Learning-System/)
- **→ Next SubPhase:** [SubPhase-06_AI-Chatbot-Backend](../../SubPhase-06_AI-Chatbot-Backend/)

---

## Group Overview

This group creates API and frontend. Creates Sinhaglish API using DRF ViewSet. Creates Translate Endpoint at POST /api/translate/. Creates Dictionary API at GET /api/dictionary/. Creates TypeScript Sinhaglish types. Creates Sinhaglish API client. Creates Multi-Script Display component. Creates integration tests. Creates documentation.

### Key Outcomes

- Sinhaglish API
- Translate Endpoint
- Dictionary API
- Sinhaglish types
- Sinhaglish client
- Multi-Script Display
- Integration tests
- Documentation

### Technology Context

- **API:** Django REST Framework
- **Frontend:** Next.js + TypeScript
- **Display:** Multi-script
- **Testing:** pytest

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-86_API-Components-Docs.md` | Create API, components, docs | 79-86 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create Sinhaglish API | Medium | Task 78 |
| 80 | Create Translate Endpoint | Low | Task 79 |
| 81 | Create Dictionary API | Low | Task 79 |
| 82 | Create Sinhaglish Types | Low | Task 81 |
| 83 | Create Sinhaglish Client | Medium | Task 82 |
| 84 | Create Multi-Script Display | Medium | Task 83 |
| 85 | Create Integration Tests | Medium | Task 84 |
| 86 | Create Documentation | Low | Task 85 |

---

## Execution Order

```
Task 79: Sinhaglish API
    │
    ├────────┐
    ▼        ▼
T-80      T-81
(Translate)(Dict)
    │        │
    └────────┘
         │
         ▼
  Task 82: Sinhaglish Types
         │
         ▼
  Task 83: Sinhaglish Client
         │
         ▼
  Task 84: Multi-Script Display
         │
         ▼
  Task 85: Integration Tests
         │
         ▼
  Task 86: Documentation
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        └── sinhaglish/
            └── api/
                └── views.py

frontend/
└── lib/
    └── search/
        └── sinhaglish/
            ├── types.ts
            └── client.ts

tests/
└── search/
    └── test_sinhaglish_e2e.py

docs/
└── sinhaglish/
    └── README.md
```

---

## Notes for AI Agents

### Sinhaglish API (Task 79)
| ViewSet | SinhaglishViewSet |
|---------|-------------------|
| Purpose | Sinhaglish endpoints |

### Translate Endpoint (Task 80)
| Endpoint | POST /api/translate/ |
|----------|----------------------|
| Body | { "query": "kiri kesel" } |
| Return | Translation result |

### Translate Request
| Field | Type | Description |
|-------|------|-------------|
| query | string | Romanized query |

### Translate Response
| Field | Description |
|-------|-------------|
| original | Original query |
| expanded | Expanded query |
| tokens | Token translations |
| sinhala | Sinhala Unicode |

### Token Translation
| Field | Description |
|-------|-------------|
| token | Original token |
| sinhala | Sinhala text |
| english | English meaning |
| matched | How matched |

### Dictionary API (Task 81)
| Endpoint | GET /api/dictionary/ |
|----------|----------------------|
| Params | q (search), category |
| Return | Dictionary entries |

### Dictionary Response
| Field | Description |
|-------|-------------|
| entries | List of words |
| total | Total count |

### Dictionary Entry
| Field | Description |
|-------|-------------|
| romanized | English spelling |
| sinhala_text | Sinhala Unicode |
| english_meaning | Translation |
| category | Word category |
| variants | Alt spellings |

### Sinhaglish Types (Task 82)
| Type | Fields |
|------|--------|
| TranslateRequest | query |
| TranslateResponse | original, expanded, tokens, sinhala |
| TokenTranslation | token, sinhala, english, matched |
| DictionaryEntry | romanized, sinhala_text, english_meaning, variants |

### Sinhaglish Client (Task 83)
| Method | Endpoint |
|--------|----------|
| translate | POST /translate/ |
| lookup | GET /dictionary/ |

### Multi-Script Display (Task 84)
| Component | MultiScriptDisplay |
|-----------|-------------------|
| Props | name, sinhala_name |
| Display | Both scripts |

### MultiScriptDisplay Features
| Feature | Description |
|---------|-------------|
| Primary | Product name |
| Secondary | Sinhala name |
| Highlight | Matched text |
| Toggle | Show/hide Sinhala |

### Integration Tests (Task 85)
| Test | Coverage |
|------|----------|
| test_translate_basic | Basic translation |
| test_translate_multi | Multi-token |
| test_phonetic_match | Phonetic matching |
| test_dictionary_lookup | Dictionary API |
| test_search_integration | Full search |
| test_learning | Learning system |

### Test Scenarios
| Scenario | Input | Expected |
|----------|-------|----------|
| Exact match | "kiri" | milk |
| Variant | "keeri" | milk |
| Phonetic | "kere" | milk |
| Multi-term | "kiri kesel" | milk banana |
| No match | "xyz" | no expansion |

### Documentation (Task 86)
| Section | Content |
|---------|---------|
| Overview | Sinhaglish concept |
| Dictionary | Managing words |
| API Reference | Endpoints |
| Examples | Code examples |
| Contributing | Adding words |
| Troubleshooting | Common issues |

### Sinhaglish Concept
| Term | Meaning |
|------|---------|
| Sinhaglish | Sinhala in English chars |
| Romanized | English spelling |
| Transliteration | Script conversion |
| Query Expansion | Add translations |
