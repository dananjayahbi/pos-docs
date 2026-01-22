# Group B: Frequently Bought Together

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement Frequently Bought Together using Apriori algorithm

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Recommendation-Models](../Group-A_Recommendation-Models/)
- **→ Next Group:** [Group-C_Similar-Products](../Group-C_Similar-Products/)

---

## Group Overview

This group implements FBT recommendations. Creates BasketAnalyzer with get_transactions to extract order baskets and encode_transactions for one-hot encoding. Creates AprioriTrainer with find_frequent_itemsets and generate_rules methods. Configures min_support and min_confidence settings. Creates FBTService with train, get_fbt, and store_recommendations methods. Creates FBTTrainingTask as Celery task with daily schedule. Creates FBT Redis cache. Creates admin interface. Verifies FBT flow.

### Key Outcomes

- BasketAnalyzer
- get_transactions method
- encode_transactions method
- AprioriTrainer
- find_frequent_itemsets method
- generate_rules method
- min_support setting
- min_confidence setting
- FBTService
- train method
- get_fbt method
- store_recommendations method
- FBTTrainingTask
- FBT schedule (daily)
- FBT cache
- cache_fbt method
- FBT admin
- FBT verified

### Technology Context

- **Algorithm:** Apriori / FP-Growth
- **Library:** mlxtend
- **Schedule:** Daily retraining
- **Cache:** Redis

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-24_Basket-Apriori.md` | Create basket analyzer and Apriori | 17-24 |
| 02 | `02_Tasks-25-34_FBT-Service-Cache.md` | Create FBT service and cache | 25-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create BasketAnalyzer | Medium | Task 16 |
| 18 | Create get_transactions | Medium | Task 17 |
| 19 | Create encode_transactions | Medium | Task 18 |
| 20 | Create AprioriTrainer | High | Task 19 |
| 21 | Create find_frequent_itemsets | Medium | Task 20 |
| 22 | Create generate_rules | Medium | Task 21 |
| 23 | Create min_support Setting | Low | Task 22 |
| 24 | Create min_confidence Setting | Low | Task 22 |
| 25 | Create FBTService | High | Task 24 |
| 26 | Create train Method | Medium | Task 25 |
| 27 | Create get_fbt Method | Medium | Task 26 |
| 28 | Create store_recommendations | Medium | Task 27 |
| 29 | Create FBTTrainingTask | Medium | Task 28 |
| 30 | Create FBT Schedule | Low | Task 29 |
| 31 | Create FBT Cache | Medium | Task 30 |
| 32 | Create cache_fbt Method | Low | Task 31 |
| 33 | Create FBT Admin | Medium | Task 28 |
| 34 | Verify FBT | Low | Task 33 |

---

## Execution Order

```
Task 17: BasketAnalyzer
    │
    ▼
Task 18: get_transactions
    │
    ▼
Task 19: encode_transactions
    │
    ▼
Task 20: AprioriTrainer
    │
    ├────────┐
    ▼        ▼
T-21      T-22
(Items) (Rules)
    │        │
    │   ┌────┴────┐
    │   ▼         ▼
    │ T-23      T-24
    │(Support)(Confid)
    │   │         │
    └───┴─────────┘
           │
           ▼
    Task 25: FBTService
           │
           ▼
    Task 26: train
           │
           ▼
    Task 27: get_fbt
           │
           ├─────────────────┐
           ▼                 ▼
    Task 28: store      Task 33: Admin
           │                 │
           ▼                 │
    Task 29: FBTTrainingTask │
           │                 │
           ▼                 │
    Task 30: Schedule        │
           │                 │
           ▼                 │
    Task 31: FBT Cache       │
           │                 │
           ▼                 │
    Task 32: cache_fbt       │
           │                 │
           └─────────────────┘
                    │
                    ▼
             Task 34: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── recommendations/
            ├── algorithms/
            │   └── apriori.py
            ├── services/
            │   └── fbt_service.py
            └── tasks/
                └── fbt_tasks.py
```

---

## Notes for AI Agents

### BasketAnalyzer (Task 17)
| Class | BasketAnalyzer |
|-------|----------------|
| Purpose | Analyze order baskets |

### get_transactions (Task 18)
| Method | get_transactions(tenant, start_date, end_date) |
|--------|------------------------------------------------|
| Return | List of product ID lists |
| Source | Order items |

### Transaction Format
| Format | Example |
|--------|---------|
| Input | Order items |
| Output | [[P1, P2], [P1, P3, P4], [P2, P4]] |

### encode_transactions (Task 19)
| Method | encode_transactions(transactions) |
|--------|----------------------------------|
| Return | One-hot encoded DataFrame |
| Use | For Apriori input |

### AprioriTrainer (Task 20)
| Class | AprioriTrainer(ModelTrainer) |
|-------|------------------------------|
| Purpose | Train Apriori model |

### find_frequent_itemsets (Task 21)
| Method | find_frequent_itemsets(df, min_support) |
|--------|----------------------------------------|
| Return | Frequent itemsets DataFrame |
| Library | mlxtend.frequent_patterns.apriori |

### generate_rules (Task 22)
| Method | generate_rules(itemsets, min_confidence) |
|--------|------------------------------------------|
| Return | Association rules DataFrame |
| Library | mlxtend.frequent_patterns.association_rules |

### min_support Setting (Task 23)
| Setting | FBT_MIN_SUPPORT |
|---------|-----------------|
| Default | 0.01 |
| Range | 0.001 - 0.1 |

### min_confidence Setting (Task 24)
| Setting | FBT_MIN_CONFIDENCE |
|---------|-------------------|
| Default | 0.3 |
| Range | 0.1 - 0.9 |

### FBTService (Task 25)
| Class | FBTService |
|-------|------------|
| Purpose | FBT recommendations |

### train Method (Task 26)
| Method | train(tenant) |
|--------|---------------|
| Action | Train Apriori model |
| Save | Store rules |

### get_fbt Method (Task 27)
| Method | get_fbt(product_id, limit=5) |
|--------|------------------------------|
| Return | List of recommended products |
| Cache | Check Redis first |

### store_recommendations (Task 28)
| Method | store_recommendations(rules) |
|--------|------------------------------|
| Action | Save to Recommendation model |
| Type | FBT |

### FBTTrainingTask (Task 29)
| Task | train_fbt_task |
|------|----------------|
| Type | Celery task |
| Queue | training |

### FBT Schedule (Task 30)
| Schedule | Daily at 2:00 AM |
|----------|------------------|
| Action | Retrain FBT model |

### FBT Cache (Task 31)
| Key | fbt:{tenant}:{product_id} |
|-----|--------------------------|
| TTL | 24 hours |

### cache_fbt Method (Task 32)
| Method | cache_fbt(product_id, recommendations) |
|--------|----------------------------------------|
| Action | Store in Redis |
