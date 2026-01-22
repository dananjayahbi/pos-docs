# Group A: Search Engine Setup

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up MeiliSearch engine and configuration

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-03_Demand-Forecasting](../../SubPhase-03_Demand-Forecasting/)
- **→ Next Group:** [Group-B_Index-Management](../Group-B_Index-Management/)

---

## Group Overview

This group sets up search engine. Installs MeiliSearch Docker container and meilisearch-python client. Creates search settings in Django with MEILISEARCH_HOST, MEILISEARCH_API_KEY, and MEILISEARCH_INDEX_PREFIX. Creates SearchClient wrapper with get_index method and tenant_index_name for tenant-scoped naming. Creates SearchConfig model with is_enabled, searchable_attrs, filterable_attrs, and ranking_rules fields. Generates migrations. Verifies MeiliSearch connection.

### Key Outcomes

- MeiliSearch installed
- meilisearch-python installed
- Search settings
- MEILISEARCH_HOST
- MEILISEARCH_API_KEY
- MEILISEARCH_INDEX_PREFIX
- SearchClient
- get_index method
- tenant_index_name method
- SearchConfig model
- is_enabled field
- searchable_attrs field
- filterable_attrs field
- ranking_rules field
- Search migrations
- MeiliSearch verified

### Technology Context

- **Engine:** MeiliSearch
- **Client:** meilisearch-python
- **Container:** Docker
- **Isolation:** Tenant prefixed indexes

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-09_Install-Client.md` | Install MeiliSearch and create client | 01-09 |
| 02 | `02_Tasks-10-16_Config-Migration.md` | Create config model and migration | 10-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Install MeiliSearch | Medium | SubPhase-03 |
| 02 | Install meilisearch Python | Low | Task 01 |
| 03 | Create Search Settings | Low | Task 02 |
| 04 | Create MEILISEARCH_HOST | Low | Task 03 |
| 05 | Create MEILISEARCH_API_KEY | Low | Task 03 |
| 06 | Create MEILISEARCH_INDEX_PREFIX | Low | Task 03 |
| 07 | Create SearchClient | Medium | Task 06 |
| 08 | Create get_index Method | Low | Task 07 |
| 09 | Create tenant_index_name | Low | Task 08 |
| 10 | Create SearchConfig Model | Medium | Task 09 |
| 11 | Create is_enabled Field | Low | Task 10 |
| 12 | Create searchable_attrs Field | Low | Task 10 |
| 13 | Create filterable_attrs Field | Low | Task 10 |
| 14 | Create ranking_rules Field | Low | Task 10 |
| 15 | Create Search Migrations | Low | Task 14 |
| 16 | Verify MeiliSearch | Low | Task 15 |

---

## Execution Order

```
Task 01: Install MeiliSearch
    │
    ▼
Task 02: Install meilisearch Python
    │
    ▼
Task 03: Search Settings
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-04      T-05      T-06
(Host)   (Key)  (Prefix)
    │        │        │
    └────────┴────────┘
              │
              ▼
       Task 07: SearchClient
              │
              ▼
       Task 08: get_index
              │
              ▼
       Task 09: tenant_index_name
              │
              ▼
       Task 10: SearchConfig Model
              │
    ┌─────────┼─────────┬─────────┐
    ▼         ▼         ▼         ▼
T-11       T-12       T-13      T-14
(Enable) (Search) (Filter)   (Rank)
    │         │         │         │
    └─────────┴─────────┴─────────┘
                   │
                   ▼
            Task 15: Migrations
                   │
                   ▼
            Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── search/
        ├── __init__.py
        ├── models/
        │   └── search_config.py
        └── clients/
            └── meili_client.py
```

---

## Notes for AI Agents

### MeiliSearch (Task 01)
| Service | MeiliSearch |
|---------|-------------|
| Version | 1.x |
| Container | getmeili/meilisearch |
| Port | 7700 |

### Docker Setup
| Aspect | Value |
|--------|-------|
| Image | getmeili/meilisearch:latest |
| Volume | meili_data:/meili_data |
| Env | MEILI_MASTER_KEY |

### meilisearch Python (Task 02)
| Package | meilisearch |
|---------|-------------|
| Version | >=0.28.0 |
| Use | Python client |

### MEILISEARCH_HOST (Task 04)
| Setting | MEILISEARCH_HOST |
|---------|------------------|
| Default | http://localhost:7700 |
| Prod | http://meilisearch:7700 |

### MEILISEARCH_API_KEY (Task 05)
| Setting | MEILISEARCH_API_KEY |
|---------|---------------------|
| Type | Master key |
| Env | MEILI_MASTER_KEY |

### MEILISEARCH_INDEX_PREFIX (Task 06)
| Setting | MEILISEARCH_INDEX_PREFIX |
|---------|-------------------------|
| Default | lcc_ |
| Format | lcc_{tenant}_products |

### SearchClient (Task 07)
| Class | SearchClient |
|-------|--------------|
| Purpose | MeiliSearch wrapper |
| Singleton | Yes |

### get_index Method (Task 08)
| Method | get_index(index_name) |
|--------|----------------------|
| Return | Index object |
| Create | If not exists |

### tenant_index_name (Task 09)
| Method | tenant_index_name(tenant, index_type) |
|--------|--------------------------------------|
| Format | lcc_{tenant_id}_products |
| Use | Tenant isolation |

### SearchConfig Model (Task 10)
| Class | SearchConfig |
|-------|--------------|
| Purpose | Per-tenant search config |
| OneToOne | Tenant |

### is_enabled Field (Task 11)
| Field | Type |
|-------|------|
| Name | is_enabled |
| Type | BooleanField |
| Default | True |

### searchable_attrs Field (Task 12)
| Field | Type |
|-------|------|
| Name | searchable_attrs |
| Type | JSONField |
| Default | ["name", "sku", "description"] |

### filterable_attrs Field (Task 13)
| Field | Type |
|-------|------|
| Name | filterable_attrs |
| Type | JSONField |
| Default | ["category_id", "brand", "price"] |

### ranking_rules Field (Task 14)
| Field | Type |
|-------|------|
| Name | ranking_rules |
| Type | JSONField |
| Default | See default ranking rules |

### Default Ranking Rules
| Order | Rule |
|-------|------|
| 1 | words |
| 2 | typo |
| 3 | proximity |
| 4 | attribute |
| 5 | sort |
| 6 | exactness |
