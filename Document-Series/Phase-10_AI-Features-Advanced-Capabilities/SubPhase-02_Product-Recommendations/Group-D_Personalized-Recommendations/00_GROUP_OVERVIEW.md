# Group D: Personalized Recommendations

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Implement personalized recommendations using collaborative filtering

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Similar-Products](../Group-C_Similar-Products/)
- **→ Next Group:** [Group-E_Trending-Serving](../Group-E_Trending-Serving/)

---

## Group Overview

This group implements personalized recommendations. Creates UserItemMatrix with build_matrix for sparse matrix and implicit_ratings for interaction weights. Creates CollaborativeFilter with user_based and item_based CF methods. Creates MatrixFactorization using SVD decomposition. Creates train method. Creates PersonalizedService with get_personalized, cold_start_handler for new users, and exclude_purchased to filter bought items. Creates CFTrainingTask with weekly schedule. Creates personalized cache. Verifies personalized flow.

### Key Outcomes

- UserItemMatrix
- build_matrix method
- implicit_ratings method
- CollaborativeFilter
- user_based CF
- item_based CF
- MatrixFactorization
- train method
- PersonalizedService
- get_personalized method
- cold_start_handler
- exclude_purchased
- CFTrainingTask
- CF schedule (weekly)
- Personalized cache
- Personalized verified

### Technology Context

- **CF:** Collaborative Filtering
- **SVD:** Matrix factorization
- **Implicit:** View/cart/purchase weights
- **Cold start:** Trending fallback

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-60_Matrix-CF-SVD.md` | Create matrix and CF | 53-60 |
| 02 | `02_Tasks-61-68_Service-Cache-Verify.md` | Create service, cache, verify | 61-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create UserItemMatrix | High | Task 52 |
| 54 | Create build_matrix Method | Medium | Task 53 |
| 55 | Create implicit_ratings | Medium | Task 54 |
| 56 | Create CollaborativeFilter | High | Task 55 |
| 57 | Create user_based CF | High | Task 56 |
| 58 | Create item_based CF | High | Task 56 |
| 59 | Create MatrixFactorization | High | Task 58 |
| 60 | Create train Method | Medium | Task 59 |
| 61 | Create PersonalizedService | High | Task 60 |
| 62 | Create get_personalized Method | Medium | Task 61 |
| 63 | Create cold_start_handler | Medium | Task 62 |
| 64 | Create exclude_purchased | Low | Task 63 |
| 65 | Create CFTrainingTask | Medium | Task 64 |
| 66 | Create CF Schedule | Low | Task 65 |
| 67 | Create Personalized Cache | Medium | Task 66 |
| 68 | Verify Personalized | Low | Task 67 |

---

## Execution Order

```
Task 53: UserItemMatrix
    │
    ▼
Task 54: build_matrix
    │
    ▼
Task 55: implicit_ratings
    │
    ▼
Task 56: CollaborativeFilter
    │
    ├────────┐
    ▼        ▼
T-57      T-58
(User)   (Item)
    │        │
    └────────┘
         │
         ▼
Task 59: MatrixFactorization
         │
         ▼
Task 60: train
         │
         ▼
Task 61: PersonalizedService
         │
         ▼
Task 62: get_personalized
         │
         ▼
Task 63: cold_start_handler
         │
         ▼
Task 64: exclude_purchased
         │
         ▼
Task 65: CFTrainingTask
         │
         ▼
Task 66: CF Schedule
         │
         ▼
Task 67: Personalized Cache
         │
         ▼
Task 68: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── recommendations/
            ├── algorithms/
            │   ├── collaborative.py
            │   └── matrix_factorization.py
            ├── services/
            │   └── personalized_service.py
            └── tasks/
                └── cf_tasks.py
```

---

## Notes for AI Agents

### UserItemMatrix (Task 53)
| Class | UserItemMatrix |
|-------|----------------|
| Purpose | Build user-item matrix |

### build_matrix Method (Task 54)
| Method | build_matrix(tenant, start_date) |
|--------|----------------------------------|
| Return | Sparse CSR matrix |
| Rows | Customers |
| Cols | Products |

### implicit_ratings (Task 55)
| Interaction | Weight |
|-------------|--------|
| VIEW | 1 |
| CART | 3 |
| PURCHASE | 5 |

### CollaborativeFilter (Task 56)
| Class | CollaborativeFilter |
|-------|---------------------|
| Purpose | CF algorithms |

### user_based CF (Task 57)
| Algorithm | User-based |
|-----------|-----------|
| Logic | Users who are similar bought... |
| Similarity | Cosine on user vectors |

### item_based CF (Task 58)
| Algorithm | Item-based |
|-----------|-----------|
| Logic | Users who bought this also bought... |
| Similarity | Cosine on item vectors |

### MatrixFactorization (Task 59)
| Class | MatrixFactorization |
|-------|---------------------|
| Algorithm | SVD / NMF |
| Factors | 50 latent factors |

### SVD Parameters
| Parameter | Value |
|-----------|-------|
| n_factors | 50 |
| n_epochs | 20 |
| lr | 0.01 |
| reg | 0.1 |

### train Method (Task 60)
| Method | train(matrix) |
|--------|---------------|
| Return | Trained model |
| Output | User/item factors |

### PersonalizedService (Task 61)
| Class | PersonalizedService |
|-------|---------------------|
| Purpose | Personalized recommendations |

### get_personalized Method (Task 62)
| Method | get_personalized(customer_id, limit=10) |
|--------|----------------------------------------|
| Return | Recommended products |
| Logic | Dot product user/item factors |

### cold_start_handler (Task 63)
| Method | cold_start_handler(customer_id) |
|--------|--------------------------------|
| Condition | < 3 interactions |
| Fallback | Return trending products |

### exclude_purchased (Task 64)
| Method | exclude_purchased(customer_id, products) |
|--------|------------------------------------------|
| Action | Filter out purchased items |
| Return | Filtered list |

### CFTrainingTask (Task 65)
| Task | train_cf_task |
|------|---------------|
| Type | Celery task |
| Queue | training |

### CF Schedule (Task 66)
| Schedule | Weekly (Sunday 3:00 AM) |
|----------|------------------------|
| Action | Retrain CF model |

### Personalized Cache (Task 67)
| Key | personalized:{tenant}:{customer_id} |
|-----|-----------------------------------|
| TTL | 6 hours |
