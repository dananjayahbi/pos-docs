# Group E: Trending & Serving

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Implement trending products and unified recommendation engine

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Personalized-Recommendations](../Group-D_Personalized-Recommendations/)
- **→ Next Group:** [Group-F_API-Frontend](../Group-F_API-Frontend/)

---

## Group Overview

This group implements trending and unified serving. Creates TrendingService with sales_velocity to calculate velocity, time_decay for temporal decay, get_trending for top trending products, and category_trending for category-specific trending. Creates TrendingTask as Celery task. Creates trending cache. Creates RecommendationEngine as unified engine with get_fbt, get_similar, get_personalized, and get_trending methods. Creates recommendation signals for product views. Verifies engine.

### Key Outcomes

- TrendingService
- sales_velocity method
- time_decay method
- get_trending method
- category_trending method
- TrendingTask
- Trending cache
- RecommendationEngine
- Engine get_fbt
- Engine get_similar
- Engine get_personalized
- Engine get_trending
- Recommendation signals
- Engine verified

### Technology Context

- **Velocity:** Sales per time
- **Decay:** Exponential decay
- **Engine:** Unified interface
- **Signals:** Django signals

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-75_Trending-Cache.md` | Create trending and cache | 69-75 |
| 02 | `02_Tasks-76-82_Engine-Signals-Verify.md` | Create engine and signals | 76-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create TrendingService | Medium | Task 68 |
| 70 | Create sales_velocity | Medium | Task 69 |
| 71 | Create time_decay | Low | Task 70 |
| 72 | Create get_trending Method | Medium | Task 71 |
| 73 | Create category_trending | Medium | Task 72 |
| 74 | Create TrendingTask | Medium | Task 73 |
| 75 | Create Trending Cache | Medium | Task 74 |
| 76 | Create RecommendationEngine | High | Task 75 |
| 77 | Create Engine get_fbt | Low | Task 76 |
| 78 | Create Engine get_similar | Low | Task 76 |
| 79 | Create Engine get_personalized | Low | Task 76 |
| 80 | Create Engine get_trending | Low | Task 76 |
| 81 | Create Recommendation Signals | Medium | Task 80 |
| 82 | Verify Engine | Low | Task 81 |

---

## Execution Order

```
Task 69: TrendingService
    │
    ▼
Task 70: sales_velocity
    │
    ▼
Task 71: time_decay
    │
    ▼
Task 72: get_trending
    │
    ▼
Task 73: category_trending
    │
    ▼
Task 74: TrendingTask
    │
    ▼
Task 75: Trending Cache
    │
    ▼
Task 76: RecommendationEngine
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-77      T-78      T-79     T-80
(FBT)  (Similar)(Personal)(Trend)
    │        │        │        │
    └────────┴────────┴────────┘
                   │
                   ▼
          Task 81: Signals
                   │
                   ▼
          Task 82: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── recommendations/
            ├── services/
            │   ├── trending_service.py
            │   └── engine.py
            ├── tasks/
            │   └── trending_tasks.py
            └── signals.py
```

---

## Notes for AI Agents

### TrendingService (Task 69)
| Class | TrendingService |
|-------|-----------------|
| Purpose | Trending products |

### sales_velocity (Task 70)
| Method | sales_velocity(product_id, days=7) |
|--------|-----------------------------------|
| Return | Sales per day |
| Formula | total_sales / days |

### time_decay (Task 71)
| Method | time_decay(timestamp, decay_rate=0.95) |
|--------|----------------------------------------|
| Return | Decay factor 0-1 |
| Formula | decay_rate ^ days_ago |

### Time Decay Formula
| Days Ago | Factor (0.95) |
|----------|---------------|
| 0 | 1.0 |
| 1 | 0.95 |
| 7 | 0.70 |
| 14 | 0.49 |
| 30 | 0.21 |

### get_trending Method (Task 72)
| Method | get_trending(limit=20) |
|--------|------------------------|
| Return | Top trending products |
| Formula | velocity * decay_factor |

### category_trending (Task 73)
| Method | category_trending(category_id, limit=10) |
|--------|------------------------------------------|
| Return | Trending in category |

### TrendingTask (Task 74)
| Task | compute_trending_task |
|------|----------------------|
| Type | Celery task |
| Schedule | Every 4 hours |

### Trending Cache (Task 75)
| Key | trending:{tenant}[:category] |
|-----|------------------------------|
| TTL | 4 hours |

### RecommendationEngine (Task 76)
| Class | RecommendationEngine |
|-------|----------------------|
| Purpose | Unified recommendation interface |
| Pattern | Facade |

### Engine get_fbt (Task 77)
| Method | get_fbt(product_id, limit=5) |
|--------|------------------------------|
| Return | FBT products |
| Delegate | FBTService |

### Engine get_similar (Task 78)
| Method | get_similar(product_id, limit=10) |
|--------|-----------------------------------|
| Return | Similar products |
| Delegate | SimilarProductsService |

### Engine get_personalized (Task 79)
| Method | get_personalized(customer_id, limit=10) |
|--------|----------------------------------------|
| Return | Personalized products |
| Delegate | PersonalizedService |

### Engine get_trending (Task 80)
| Method | get_trending(category_id=None, limit=20) |
|--------|------------------------------------------|
| Return | Trending products |
| Delegate | TrendingService |

### Recommendation Signals (Task 81)
| Signal | Trigger |
|--------|---------|
| product_viewed | Product detail page |
| product_added_to_cart | Add to cart |
| product_purchased | Order completed |

### Signal Actions
| Signal | Action |
|--------|--------|
| product_viewed | Create VIEW interaction |
| product_added_to_cart | Create CART interaction |
| product_purchased | Create PURCHASE interaction |
