# SubPhase 04: Smart Search Backend - Tasks Summary

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase Index:** 04 of 12  
> **SubPhase Goal:** Implement advanced search with fuzzy matching, synonyms, and intelligent ranking  
> **Total Tasks:** 88 | **Status:** Planning  
> **Estimated Duration:** 12-14 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Demand-Forecasting](../SubPhase-03_Demand-Forecasting/)
- **→ Next SubPhase:** [SubPhase-05_Smart-Search-Sinhala-Glish](../SubPhase-05_Smart-Search-Sinhala-Glish/)

---

## SubPhase Overview

This sub-phase implements advanced search capabilities including fuzzy matching, synonym support, typo tolerance, and intelligent ranking with personalization.

### Key Outcomes
- MeiliSearch integration
- Fuzzy matching (typo tolerance)
- Synonym dictionary
- Attribute filtering
- Category/brand boosting
- Search analytics
- Tenant-scoped indexes

### Search Pipeline
```
Query → Tokenize → Fuzzy Match → Synonym Expand →
Filter → Rank → Boost (personalization) → Results
```

### Technology Stack
- **Search Engine:** MeiliSearch (primary)
- **Alternative:** Elasticsearch
- **Python Client:** meilisearch-python
- **Indexing:** Celery for background sync

---

## Task Execution Order

```
TASK GROUP A: Search Engine Setup (Tasks 01-16)
        │
        ▼
TASK GROUP B: Index Management (Tasks 17-34)
        │
        ▼
TASK GROUP C: Search Features (Tasks 35-52)
        │
        ▼
TASK GROUP D: Ranking & Boosting (Tasks 53-66)
        │
        ▼
TASK GROUP E: Analytics & Optimization (Tasks 67-78)
        │
        ▼
TASK GROUP F: API & Testing (Tasks 79-88)
```

---

## Task Index

### Group A: Search Engine Setup (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install MeiliSearch** | Docker container setup | SubPhase-03 | 🔴 Not Created |
| 02 | **Install meilisearch Python** | Python client | Task 01 | 🔴 Not Created |
| 03 | **Create Search Settings** | Django settings | Task 02 | 🔴 Not Created |
| 04 | **Create MEILISEARCH_HOST** | Host URL setting | Task 03 | 🔴 Not Created |
| 05 | **Create MEILISEARCH_API_KEY** | Master API key | Task 03 | 🔴 Not Created |
| 06 | **Create MEILISEARCH_INDEX_PREFIX** | Tenant prefix | Task 03 | 🔴 Not Created |
| 07 | **Create SearchClient** | MeiliSearch client wrapper | Task 06 | 🔴 Not Created |
| 08 | **Create get_index Method** | Get/create index | Task 07 | 🔴 Not Created |
| 09 | **Create tenant_index_name** | Tenant-scoped name | Task 08 | 🔴 Not Created |
| 10 | **Create SearchConfig Model** | Tenant search config | Task 09 | 🔴 Not Created |
| 11 | **Create is_enabled Field** | Enable/disable search | Task 10 | 🔴 Not Created |
| 12 | **Create searchable_attrs Field** | Searchable fields | Task 10 | 🔴 Not Created |
| 13 | **Create filterable_attrs Field** | Filterable fields | Task 10 | 🔴 Not Created |
| 14 | **Create ranking_rules Field** | Custom ranking | Task 10 | 🔴 Not Created |
| 15 | **Create Search Migrations** | Generate migrations | Task 14 | 🔴 Not Created |
| 16 | **Verify MeiliSearch** | Test connection | Task 15 | 🔴 Not Created |

---

### Group B: Index Management (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create ProductIndexer** | Product indexing | Task 16 | 🔴 Not Created |
| 18 | **Create to_document Method** | Product to doc | Task 17 | 🔴 Not Created |
| 19 | **Create index_product Method** | Single product | Task 18 | 🔴 Not Created |
| 20 | **Create bulk_index Method** | Batch indexing | Task 19 | 🔴 Not Created |
| 21 | **Create delete_product Method** | Remove from index | Task 20 | 🔴 Not Created |
| 22 | **Create update_product Method** | Update document | Task 21 | 🔴 Not Created |
| 23 | **Create IndexSettings** | Configure index | Task 22 | 🔴 Not Created |
| 24 | **Create searchable_attributes** | Name, description, SKU | Task 23 | 🔴 Not Created |
| 25 | **Create filterable_attributes** | Category, brand, price | Task 23 | 🔴 Not Created |
| 26 | **Create sortable_attributes** | Price, created_at | Task 23 | 🔴 Not Created |
| 27 | **Create IndexSyncTask** | Celery full sync | Task 26 | 🔴 Not Created |
| 28 | **Create Incremental Sync** | Delta updates | Task 27 | 🔴 Not Created |
| 29 | **Create Sync Schedule** | Hourly sync | Task 28 | 🔴 Not Created |
| 30 | **Create Product Signals** | On save/delete signals | Task 22 | 🔴 Not Created |
| 31 | **Create on_product_save** | Index on save | Task 30 | 🔴 Not Created |
| 32 | **Create on_product_delete** | Remove on delete | Task 30 | 🔴 Not Created |
| 33 | **Create Index Admin** | Admin for config | Task 10 | 🔴 Not Created |
| 34 | **Verify Indexing** | Test index sync | Task 33 | 🔴 Not Created |

---

### Group C: Search Features (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create SearchService** | Main search service | Task 34 | 🔴 Not Created |
| 36 | **Create search Method** | Execute search | Task 35 | 🔴 Not Created |
| 37 | **Create Typo Tolerance** | Configure typo tolerance | Task 36 | 🔴 Not Created |
| 38 | **Create min_word_size** | Min chars for typo | Task 37 | 🔴 Not Created |
| 39 | **Create Synonym Model** | Synonym definitions | Task 38 | 🔴 Not Created |
| 40 | **Create word Field** | Original word | Task 39 | 🔴 Not Created |
| 41 | **Create synonyms Field** | Synonym list JSON | Task 39 | 🔴 Not Created |
| 42 | **Create SynonymService** | Synonym management | Task 41 | 🔴 Not Created |
| 43 | **Create add_synonym Method** | Add synonym | Task 42 | 🔴 Not Created |
| 44 | **Create sync_synonyms Method** | Sync to MeiliSearch | Task 43 | 🔴 Not Created |
| 45 | **Create Filter Builder** | Build filter queries | Task 36 | 🔴 Not Created |
| 46 | **Create category_filter** | Filter by category | Task 45 | 🔴 Not Created |
| 47 | **Create brand_filter** | Filter by brand | Task 45 | 🔴 Not Created |
| 48 | **Create price_filter** | Filter by price range | Task 45 | 🔴 Not Created |
| 49 | **Create stock_filter** | In-stock only | Task 45 | 🔴 Not Created |
| 50 | **Create Faceted Search** | Get facet counts | Task 49 | 🔴 Not Created |
| 51 | **Create Highlighting** | Highlight matches | Task 36 | 🔴 Not Created |
| 52 | **Verify Search Features** | Test search | Task 51 | 🔴 Not Created |

---

### Group D: Ranking & Boosting (Tasks 53-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create RankingRules** | Custom ranking rules | Task 52 | 🔴 Not Created |
| 54 | **Create words Rule** | Text match priority | Task 53 | 🔴 Not Created |
| 55 | **Create typo Rule** | Typo count priority | Task 53 | 🔴 Not Created |
| 56 | **Create proximity Rule** | Word proximity | Task 53 | 🔴 Not Created |
| 57 | **Create attribute Rule** | Attribute order | Task 53 | 🔴 Not Created |
| 58 | **Create exactness Rule** | Exact match boost | Task 53 | 🔴 Not Created |
| 59 | **Create Custom Ranking** | Sales count boost | Task 58 | 🔴 Not Created |
| 60 | **Create PersonalizationService** | User personalization | Task 59 | 🔴 Not Created |
| 61 | **Create recently_viewed_boost** | Boost recent views | Task 60 | 🔴 Not Created |
| 62 | **Create category_affinity** | User category pref | Task 60 | 🔴 Not Created |
| 63 | **Create apply_personalization** | Apply to results | Task 62 | 🔴 Not Created |
| 64 | **Create PopularityBoost** | Boost popular items | Task 59 | 🔴 Not Created |
| 65 | **Create calculate_popularity** | Popularity score | Task 64 | 🔴 Not Created |
| 66 | **Verify Ranking** | Test ranking | Task 65 | 🔴 Not Created |

---

### Group E: Analytics & Optimization (Tasks 67-78)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create SearchLog Model** | Log all searches | Task 66 | 🔴 Not Created |
| 68 | **Create query Field** | Search query | Task 67 | 🔴 Not Created |
| 69 | **Create results_count Field** | Results returned | Task 67 | 🔴 Not Created |
| 70 | **Create clicked_product FK** | Product clicked | Task 67 | 🔴 Not Created |
| 71 | **Create latency_ms Field** | Search time | Task 67 | 🔴 Not Created |
| 72 | **Create SearchAnalytics** | Analytics service | Task 71 | 🔴 Not Created |
| 73 | **Create top_queries** | Most searched | Task 72 | 🔴 Not Created |
| 74 | **Create zero_results** | No results queries | Task 72 | 🔴 Not Created |
| 75 | **Create click_through_rate** | CTR calculation | Task 72 | 🔴 Not Created |
| 76 | **Create Suggestion Service** | Auto-suggestions | Task 75 | 🔴 Not Created |
| 77 | **Create get_suggestions** | Get suggestions | Task 76 | 🔴 Not Created |
| 78 | **Verify Analytics** | Test analytics | Task 77 | 🔴 Not Created |

---

### Group F: API & Testing (Tasks 79-88)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 79 | **Create Search API Views** | DRF ViewSet | Task 78 | 🔴 Not Created |
| 80 | **Create Search Endpoint** | GET /api/search/ | Task 79 | 🔴 Not Created |
| 81 | **Create Suggest Endpoint** | GET /api/search/suggest/ | Task 79 | 🔴 Not Created |
| 82 | **Create Synonym Admin API** | CRUD synonyms | Task 79 | 🔴 Not Created |
| 83 | **Create Search Types** | TypeScript interfaces | Task 82 | 🔴 Not Created |
| 84 | **Create Search API Client** | Frontend API client | Task 83 | 🔴 Not Created |
| 85 | **Create useSearch Hook** | React search hook | Task 84 | 🔴 Not Created |
| 86 | **Create SearchInput Component** | Search with suggestions | Task 85 | 🔴 Not Created |
| 87 | **Create Integration Tests** | E2E search tests | Task 86 | 🔴 Not Created |
| 88 | **Create Documentation** | Search docs | Task 87 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── search/
        ├── __init__.py
        ├── models/
        │   ├── search_config.py              # SearchConfig (Task 10)
        │   ├── synonym.py                    # Synonym (Task 39)
        │   └── search_log.py                 # SearchLog (Task 67)
        ├── clients/
        │   └── meili_client.py               # SearchClient (Task 07)
        ├── indexing/
        │   ├── __init__.py
        │   ├── product_indexer.py            # ProductIndexer (Task 17)
        │   ├── settings.py                   # IndexSettings (Task 23)
        │   └── signals.py                    # Product signals (Task 30)
        ├── services/
        │   ├── __init__.py
        │   ├── search_service.py             # SearchService (Task 35)
        │   ├── synonym_service.py            # SynonymService (Task 42)
        │   ├── filter_builder.py             # Filter Builder (Task 45)
        │   ├── personalization.py            # PersonalizationService (Task 60)
        │   ├── suggestion_service.py         # Suggestion (Task 76)
        │   └── analytics.py                  # SearchAnalytics (Task 72)
        ├── ranking/
        │   ├── __init__.py
        │   ├── rules.py                      # RankingRules (Task 53)
        │   └── popularity.py                 # PopularityBoost (Task 64)
        ├── tasks/
        │   └── sync_tasks.py                 # Sync tasks (Task 27)
        └── api/
            └── views.py                      # API views (Task 79)

frontend/
└── lib/
    └── search/
        ├── types.ts                          # Types (Task 83)
        ├── client.ts                         # API client (Task 84)
        └── hooks.ts                          # useSearch (Task 85)
└── components/
    └── search/
        └── SearchInput.tsx                   # Input (Task 86)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Search Engine Setup | 16 | 0 | 0% |
| B | Index Management | 18 | 0 | 0% |
| C | Search Features | 18 | 0 | 0% |
| D | Ranking & Boosting | 14 | 0 | 0% |
| E | Analytics & Optimization | 12 | 0 | 0% |
| F | API & Testing | 10 | 0 | 0% |
| **Total** | | **88** | **0** | **0%** |

---

## Searchable Attributes

| Attribute | Weight | Description |
|-----------|--------|-------------|
| name | High | Product name |
| sku | High | SKU code |
| description | Medium | Product description |
| category_name | Medium | Category name |
| brand_name | Medium | Brand name |
| tags | Low | Product tags |

---

## Default Ranking Rules

| Order | Rule | Description |
|-------|------|-------------|
| 1 | words | Number of matching words |
| 2 | typo | Number of typos |
| 3 | proximity | Word proximity |
| 4 | attribute | Attribute position |
| 5 | sort | Custom sort |
| 6 | exactness | Exact match |
| 7 | sales_count:desc | Custom: popularity |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **MeiliSearch primary** - Use MeiliSearch for search
3. **Tenant isolation** - Prefix indexes with tenant ID
4. **Real-time sync** - Use signals for immediate updates
5. **Typo tolerance** - Enable for 1-2 character typos
6. **Synonyms** - Sync to MeiliSearch on change
7. **Faceted search** - Return facet counts
8. **Personalization** - Apply after MeiliSearch results
9. **Analytics** - Log all searches for optimization
10. **Suggestions** - Based on popular searches
