# Group F: API & Frontend

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** F of F  
> **Tasks Covered:** 83-92  
> **Group Goal:** Create recommendation API endpoints and frontend components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Trending-Serving](../Group-E_Trending-Serving/)
- **→ Next SubPhase:** [SubPhase-03_Demand-Forecasting](../../SubPhase-03_Demand-Forecasting/)

---

## Group Overview

This group creates API and frontend. Creates Recommendation API Views using DRF ViewSet. Creates FBT endpoint at GET /api/products/{id}/fbt/. Creates Similar endpoint at GET /api/products/{id}/similar/. Creates Personalized endpoint at GET /api/recommendations/personalized/. Creates Trending endpoint at GET /api/recommendations/trending/. Creates TypeScript recommendation types. Creates frontend API client. Creates FBTCarousel component. Creates SimilarProductsGrid component. Creates integration tests.

### Key Outcomes

- Recommendation API Views
- FBT endpoint
- Similar endpoint
- Personalized endpoint
- Trending endpoint
- Recommendation types
- Recommendation API client
- FBTCarousel component
- SimilarProductsGrid component
- Integration tests

### Technology Context

- **API:** Django REST Framework
- **Frontend:** Next.js + TypeScript
- **Components:** Shadcn/UI
- **Testing:** pytest

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-83-92_API-Components-Tests.md` | Create API, components, tests | 83-92 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 83 | Create Recommendation API Views | Medium | Task 82 |
| 84 | Create FBT Endpoint | Low | Task 83 |
| 85 | Create Similar Endpoint | Low | Task 83 |
| 86 | Create Personalized Endpoint | Low | Task 83 |
| 87 | Create Trending Endpoint | Low | Task 83 |
| 88 | Create Recommendation Types | Low | Task 87 |
| 89 | Create Recommendation API Client | Medium | Task 88 |
| 90 | Create FBTCarousel Component | Medium | Task 89 |
| 91 | Create SimilarProductsGrid | Medium | Task 89 |
| 92 | Create Integration Tests | Medium | Task 91 |

---

## Execution Order

```
Task 83: Recommendation API Views
    │
    ├────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼
T-84      T-85      T-86      T-87
(FBT)  (Similar)(Personal)(Trend)
    │        │        │        │
    └────────┴────────┴────────┘
                   │
                   ▼
          Task 88: Recommendation Types
                   │
                   ▼
          Task 89: API Client
                   │
              ┌────┴────┐
              ▼         ▼
           T-90       T-91
         (FBT)    (Similar)
              │         │
              └────┬────┘
                   │
                   ▼
          Task 92: Integration Tests
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── recommendations/
            └── api/
                └── views.py

frontend/
├── lib/
│   └── recommendations/
│       ├── types.ts
│       └── client.ts
└── components/
    └── product/
        ├── FBTCarousel.tsx
        └── SimilarProductsGrid.tsx

tests/
└── ai/
    └── test_recommendations_e2e.py
```

---

## Notes for AI Agents

### Recommendation API Views (Task 83)
| ViewSet | RecommendationViewSet |
|---------|----------------------|
| Purpose | Recommendation endpoints |

### FBT Endpoint (Task 84)
| Endpoint | GET /api/products/{id}/fbt/ |
|----------|----------------------------|
| Params | limit (default 5) |
| Return | List of products |

### FBT Response
| Field | Description |
|-------|-------------|
| products | List of recommended products |
| source_product_id | Original product |
| recommendation_type | FBT |

### Similar Endpoint (Task 85)
| Endpoint | GET /api/products/{id}/similar/ |
|----------|--------------------------------|
| Params | limit, category_filter, price_filter |
| Return | List of similar products |

### Personalized Endpoint (Task 86)
| Endpoint | GET /api/recommendations/personalized/ |
|----------|---------------------------------------|
| Auth | Required |
| Return | Personalized products |

### Trending Endpoint (Task 87)
| Endpoint | GET /api/recommendations/trending/ |
|----------|-----------------------------------|
| Params | category_id (optional), limit |
| Return | Trending products |

### Recommendation Types (Task 88)
| Type | Fields |
|------|--------|
| Recommendation | id, product, score, rank |
| FBTResponse | products, source_product_id |
| SimilarResponse | products, source_product_id |
| PersonalizedResponse | products, customer_id |
| TrendingResponse | products, category_id |

### TypeScript Interfaces
| Interface | Purpose |
|-----------|---------|
| RecommendedProduct | Product with score |
| FBTProps | FBT component props |
| SimilarGridProps | Similar grid props |

### Recommendation API Client (Task 89)
| Method | Endpoint |
|--------|----------|
| getFBT | GET /products/{id}/fbt/ |
| getSimilar | GET /products/{id}/similar/ |
| getPersonalized | GET /recommendations/personalized/ |
| getTrending | GET /recommendations/trending/ |

### FBTCarousel Component (Task 90)
| Component | FBTCarousel |
|-----------|-------------|
| Props | productId, limit |
| Display | Horizontal carousel |

### FBTCarousel Features
| Feature | Description |
|---------|-------------|
| Loading | Skeleton loading |
| Empty | "No recommendations" message |
| Scroll | Horizontal scroll |
| Click | Navigate to product |

### SimilarProductsGrid (Task 91)
| Component | SimilarProductsGrid |
|-----------|---------------------|
| Props | productId, limit, columns |
| Display | Grid layout |

### SimilarGrid Features
| Feature | Description |
|---------|-------------|
| Grid | 2-4 columns |
| Card | Product card with score |
| Filter | Category, price filters |

### Integration Tests (Task 92)
| Test | Coverage |
|------|----------|
| test_fbt_endpoint | FBT API |
| test_similar_endpoint | Similar API |
| test_personalized_endpoint | Personalized API |
| test_trending_endpoint | Trending API |
| test_cold_start | New user fallback |
