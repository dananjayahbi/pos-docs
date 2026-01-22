# Group F: API & Testing

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** F of F  
> **Tasks Covered:** 79-88  
> **Group Goal:** Create search API endpoints and frontend integration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Analytics-Optimization](../Group-E_Analytics-Optimization/)
- **→ Next SubPhase:** [SubPhase-05_Smart-Search-Sinhala-Glish](../../SubPhase-05_Smart-Search-Sinhala-Glish/)

---

## Group Overview

This group creates API and frontend. Creates Search API Views using DRF ViewSet. Creates Search Endpoint at GET /api/search/. Creates Suggest Endpoint at GET /api/search/suggest/. Creates Synonym Admin API. Creates TypeScript search types. Creates frontend API client. Creates useSearch React hook. Creates SearchInput component. Creates integration tests. Creates documentation.

### Key Outcomes

- Search API Views
- Search Endpoint
- Suggest Endpoint
- Synonym Admin API
- Search types
- Search API client
- useSearch hook
- SearchInput component
- Integration tests
- Documentation

### Technology Context

- **API:** Django REST Framework
- **Frontend:** Next.js + TypeScript
- **Hook:** React Query
- **Components:** Shadcn/UI

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-88_API-Components-Docs.md` | Create API, components, docs | 79-88 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create Search API Views | Medium | Task 78 |
| 80 | Create Search Endpoint | Low | Task 79 |
| 81 | Create Suggest Endpoint | Low | Task 79 |
| 82 | Create Synonym Admin API | Medium | Task 79 |
| 83 | Create Search Types | Low | Task 82 |
| 84 | Create Search API Client | Medium | Task 83 |
| 85 | Create useSearch Hook | Medium | Task 84 |
| 86 | Create SearchInput Component | Medium | Task 85 |
| 87 | Create Integration Tests | Medium | Task 86 |
| 88 | Create Documentation | Low | Task 87 |

---

## Execution Order

```
Task 79: Search API Views
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-80      T-81      T-82
(Search)(Suggest)(Synonym)
    │        │        │
    └────────┴────────┘
              │
              ▼
       Task 83: Search Types
              │
              ▼
       Task 84: API Client
              │
              ▼
       Task 85: useSearch Hook
              │
              ▼
       Task 86: SearchInput
              │
              ▼
       Task 87: Integration Tests
              │
              ▼
       Task 88: Documentation
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        └── api/
            └── views.py

frontend/
├── lib/
│   └── search/
│       ├── types.ts
│       ├── client.ts
│       └── hooks.ts
└── components/
    └── search/
        └── SearchInput.tsx

tests/
└── search/
    └── test_search_e2e.py

docs/
└── search/
    └── README.md
```

---

## Notes for AI Agents

### Search API Views (Task 79)
| ViewSet | SearchViewSet |
|---------|---------------|
| Purpose | Search endpoints |

### Search Endpoint (Task 80)
| Endpoint | GET /api/search/ |
|----------|------------------|
| Params | q, filters, limit, offset |
| Return | SearchResults |

### Search Request
| Param | Type | Description |
|-------|------|-------------|
| q | string | Query (required) |
| category | int | Category filter |
| brand | string | Brand filter |
| min_price | float | Min price |
| max_price | float | Max price |
| in_stock | bool | Stock filter |
| limit | int | Results limit |
| offset | int | Pagination |

### Search Response
| Field | Description |
|-------|-------------|
| results | Product list |
| total | Total matches |
| facets | Facet counts |
| query | Original query |
| latency_ms | Search time |

### Suggest Endpoint (Task 81)
| Endpoint | GET /api/search/suggest/ |
|----------|--------------------------|
| Params | q (prefix) |
| Return | Suggestions list |

### Suggest Response
| Field | Description |
|-------|-------------|
| suggestions | List of strings |
| query | Input prefix |

### Synonym Admin API (Task 82)
| Endpoint | /api/admin/synonyms/ |
|----------|----------------------|
| Methods | GET, POST, PUT, DELETE |
| Auth | Admin only |

### Synonym Endpoints
| Method | Endpoint | Action |
|--------|----------|--------|
| GET | /synonyms/ | List all |
| POST | /synonyms/ | Create |
| PUT | /synonyms/{id}/ | Update |
| DELETE | /synonyms/{id}/ | Delete |
| POST | /synonyms/sync/ | Sync to search |

### Search Types (Task 83)
| Type | Fields |
|------|--------|
| SearchResult | id, name, price, category, brand, highlight |
| SearchResponse | results, total, facets, latency_ms |
| Suggestion | text, type |
| SearchFilters | category, brand, min_price, max_price, in_stock |

### Search API Client (Task 84)
| Method | Endpoint |
|--------|----------|
| search | GET /search/ |
| suggest | GET /search/suggest/ |

### useSearch Hook (Task 85)
| Hook | useSearch(options) |
|------|-------------------|
| Return | { results, loading, error, search } |
| Debounce | 300ms |

### useSearch Options
| Option | Description |
|--------|-------------|
| debounceMs | Debounce delay |
| minChars | Min chars to search |
| autoSuggest | Enable suggestions |

### SearchInput Component (Task 86)
| Component | SearchInput |
|-----------|-------------|
| Props | onSearch, placeholder |
| Features | Suggestions dropdown |

### SearchInput Features
| Feature | Description |
|---------|-------------|
| Input | Search text input |
| Suggestions | Dropdown list |
| Loading | Loading indicator |
| Clear | Clear button |
| Keyboard | Arrow nav, Enter |

### Integration Tests (Task 87)
| Test | Coverage |
|------|----------|
| test_search_basic | Basic search |
| test_search_filters | Filter search |
| test_search_fuzzy | Typo tolerance |
| test_search_synonyms | Synonym matching |
| test_suggest | Suggestions |
| test_analytics | Logging |

### Documentation (Task 88)
| Section | Content |
|---------|---------|
| Overview | Search capabilities |
| API Reference | Endpoints |
| Configuration | Settings |
| Synonyms | Managing synonyms |
| Analytics | Using analytics |
| Troubleshooting | Common issues |
