# Group D: Ranking & Boosting

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 04 - Smart Search Backend  
> **Group:** D of F  
> **Tasks Covered:** 53-66  
> **Group Goal:** Implement ranking rules and personalization boosting

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Search-Features](../Group-C_Search-Features/)
- **→ Next Group:** [Group-E_Analytics-Optimization](../Group-E_Analytics-Optimization/)

---

## Group Overview

This group implements ranking. Creates RankingRules with words, typo, proximity, attribute, and exactness rules. Creates Custom Ranking for sales count boost. Creates PersonalizationService with recently_viewed_boost, category_affinity, and apply_personalization methods. Creates PopularityBoost with calculate_popularity method. Verifies ranking.

### Key Outcomes

- RankingRules
- words rule
- typo rule
- proximity rule
- attribute rule
- exactness rule
- Custom Ranking
- PersonalizationService
- recently_viewed_boost
- category_affinity
- apply_personalization
- PopularityBoost
- calculate_popularity
- Ranking verified

### Technology Context

- **Ranking:** MeiliSearch rules
- **Personalization:** Post-search boost
- **Popularity:** Sales-based
- **Affinity:** User preferences

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-59_Rules-Custom.md` | Create ranking rules | 53-59 |
| 02 | `02_Tasks-60-66_Personalization-Verify.md` | Create personalization and verify | 60-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create RankingRules | Medium | Task 52 |
| 54 | Create words Rule | Low | Task 53 |
| 55 | Create typo Rule | Low | Task 53 |
| 56 | Create proximity Rule | Low | Task 53 |
| 57 | Create attribute Rule | Low | Task 53 |
| 58 | Create exactness Rule | Low | Task 53 |
| 59 | Create Custom Ranking | Medium | Task 58 |
| 60 | Create PersonalizationService | High | Task 59 |
| 61 | Create recently_viewed_boost | Medium | Task 60 |
| 62 | Create category_affinity | Medium | Task 60 |
| 63 | Create apply_personalization | Medium | Task 62 |
| 64 | Create PopularityBoost | Medium | Task 59 |
| 65 | Create calculate_popularity | Medium | Task 64 |
| 66 | Verify Ranking | Low | Task 65 |

---

## Execution Order

```
Task 53: RankingRules
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-54      T-55      T-56      T-57     T-58
(Words) (Typo)  (Prox)   (Attr) (Exact)
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                      │
                      ▼
             Task 59: Custom Ranking
                      │
              ┌───────┴───────┐
              ▼               ▼
       Task 60: Personal  Task 64: Popularity
              │               │
              ▼               ▼
       Task 61: viewed    Task 65: calculate
              │               │
              ▼               │
       Task 62: affinity      │
              │               │
              ▼               │
       Task 63: apply         │
              │               │
              └───────────────┘
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
        ├── ranking/
        │   ├── __init__.py
        │   ├── rules.py
        │   └── popularity.py
        └── services/
            └── personalization.py
```

---

## Notes for AI Agents

### RankingRules (Task 53)
| Class | RankingRules |
|-------|--------------|
| Purpose | Configure ranking |

### Default Order
| Priority | Rule |
|----------|------|
| 1 | words |
| 2 | typo |
| 3 | proximity |
| 4 | attribute |
| 5 | sort |
| 6 | exactness |
| 7 | sales_count:desc |

### words Rule (Task 54)
| Rule | words |
|------|-------|
| Priority | 1 |
| Purpose | More matching words = higher |

### typo Rule (Task 55)
| Rule | typo |
|------|------|
| Priority | 2 |
| Purpose | Fewer typos = higher |

### proximity Rule (Task 56)
| Rule | proximity |
|------|-----------|
| Priority | 3 |
| Purpose | Closer words = higher |

### Proximity Example
| Query | Match | Score |
|-------|-------|-------|
| "laptop bag" | "laptop bag" | High |
| "laptop bag" | "laptop carrying bag" | Medium |
| "laptop bag" | "bag for laptop" | Lower |

### attribute Rule (Task 57)
| Rule | attribute |
|------|-----------|
| Priority | 4 |
| Purpose | Match in name > description |

### Attribute Order
| Priority | Attribute |
|----------|-----------|
| 1 | name |
| 2 | sku |
| 3 | description |
| 4 | category_name |
| 5 | brand |

### exactness Rule (Task 58)
| Rule | exactness |
|------|-----------|
| Priority | 6 |
| Purpose | Exact match boost |

### Custom Ranking (Task 59)
| Rule | sales_count:desc |
|------|-----------------|
| Purpose | Popular products first |
| Custom | Yes |

### PersonalizationService (Task 60)
| Class | PersonalizationService |
|-------|------------------------|
| Purpose | User-based boosting |
| Applied | After MeiliSearch |

### recently_viewed_boost (Task 61)
| Method | recently_viewed_boost(customer_id, results) |
|--------|---------------------------------------------|
| Action | Boost recently viewed |
| Boost | 1.2x for last 7 days |

### category_affinity (Task 62)
| Method | category_affinity(customer_id) |
|--------|-------------------------------|
| Return | Category weights |
| Source | Purchase/view history |

### Category Affinity Calculation
| Action | Weight |
|--------|--------|
| Purchase | 5 |
| Add to cart | 3 |
| View | 1 |

### apply_personalization (Task 63)
| Method | apply_personalization(customer_id, results) |
|--------|---------------------------------------------|
| Action | Re-rank with personalization |
| Return | Boosted results |

### PopularityBoost (Task 64)
| Class | PopularityBoost |
|-------|-----------------|
| Purpose | Boost popular items |

### calculate_popularity (Task 65)
| Method | calculate_popularity(product_id) |
|--------|----------------------------------|
| Return | Popularity score 0-100 |
| Factors | Sales, views, recency |

### Popularity Formula
| Factor | Weight |
|--------|--------|
| Sales (30d) | 0.5 |
| Views (7d) | 0.3 |
| Cart adds (7d) | 0.2 |
