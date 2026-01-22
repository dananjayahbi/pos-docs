# Group A: Recommendation Models

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 02 - Product Recommendations  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up recommendation data models and interaction tracking

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-01_AI-Infrastructure-Setup](../../SubPhase-01_AI-Infrastructure-Setup/)
- **→ Next Group:** [Group-B_Frequently-Bought-Together](../Group-B_Frequently-Bought-Together/)

---

## Group Overview

This group sets up recommendation models. Installs mlxtend for association rules. Creates RecommendationType enum for FBT/similar/personalized/trending. Creates Recommendation model with recommendation_type, source_product FK, target_product FK, score, rank, and computed_at fields. Creates UserProductInteraction model with interaction_type for view/cart/purchase, customer FK, product FK, and timestamp. Generates migrations. Verifies models.

### Key Outcomes

- mlxtend installed
- RecommendationType enum
- Recommendation model
- recommendation_type field
- source_product FK
- target_product FK
- score field
- rank field
- computed_at field
- UserProductInteraction model
- interaction_type field
- customer FK
- product FK
- timestamp field
- Recommendation migrations
- Models verified

### Technology Context

- **mlxtend:** Association rules
- **Types:** FBT, similar, personalized, trending
- **Interactions:** View, cart, purchase
- **Storage:** PostgreSQL

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-09_Setup-Recommendation-Model.md` | Create setup and recommendation model | 01-09 |
| 02 | `02_Tasks-10-16_Interaction-Model-Migration.md` | Create interaction model and migration | 10-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Install mlxtend | Low | SubPhase-01 |
| 02 | Create RecommendationType Enum | Low | Task 01 |
| 03 | Create Recommendation Model | Medium | Task 02 |
| 04 | Create recommendation_type Field | Low | Task 03 |
| 05 | Create source_product FK | Low | Task 03 |
| 06 | Create target_product FK | Low | Task 03 |
| 07 | Create score Field | Low | Task 03 |
| 08 | Create rank Field | Low | Task 03 |
| 09 | Create computed_at Field | Low | Task 03 |
| 10 | Create UserProductInteraction Model | Medium | Task 03 |
| 11 | Create interaction_type Field | Low | Task 10 |
| 12 | Create customer FK | Low | Task 10 |
| 13 | Create product FK | Low | Task 10 |
| 14 | Create timestamp Field | Low | Task 10 |
| 15 | Create Recommendation Migrations | Low | Task 14 |
| 16 | Verify Models | Low | Task 15 |

---

## Execution Order

```
Task 01: Install mlxtend
    │
    ▼
Task 02: RecommendationType Enum
    │
    ▼
Task 03: Recommendation Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-04      T-05      T-06      T-07     T-08     T-09    T-10
(Type)  (Source)(Target)(Score)(Rank)(Time)(Interact)
    │        │        │        │        │        │        │
    │        │        │        │        │        │   ┌────┼────┬────────┬────────┐
    │        │        │        │        │        │   ▼    ▼    ▼        ▼        ▼
    │        │        │        │        │        │ T-11  T-12  T-13    T-14
    │        │        │        │        │        │(Int) (Cust)(Prod) (Time)
    │        │        │        │        │        │   │    │    │        │
    └────────┴────────┴────────┴────────┴────────┴───┴────┴────┴────────┘
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
    └── ai/
        └── recommendations/
            ├── __init__.py
            └── models/
                ├── recommendation.py
                └── user_interaction.py
```

---

## Notes for AI Agents

### mlxtend (Task 01)
| Package | mlxtend |
|---------|---------|
| Version | >=0.22.0 |
| Use | Apriori, FP-Growth |

### RecommendationType Enum (Task 02)
| Type | Description |
|------|-------------|
| FBT | Frequently Bought Together |
| SIMILAR | Similar Products |
| PERSONALIZED | Personalized For You |
| TRENDING | Trending Now |

### Recommendation Model (Task 03)
| Class | Recommendation |
|-------|----------------|
| Purpose | Store recommendations |
| Unique | type + source + target |

### recommendation_type Field (Task 04)
| Field | Type |
|-------|------|
| Name | recommendation_type |
| Type | CharField (enum) |
| Choices | FBT, SIMILAR, PERSONALIZED, TRENDING |

### source_product FK (Task 05)
| Field | Type |
|-------|------|
| Name | source_product |
| FK | Product |
| Null | True (for trending) |

### target_product FK (Task 06)
| Field | Type |
|-------|------|
| Name | target_product |
| FK | Product |
| Related | recommended_for |

### score Field (Task 07)
| Field | Type |
|-------|------|
| Name | score |
| Type | FloatField |
| Range | 0.0 to 1.0 |

### rank Field (Task 08)
| Field | Type |
|-------|------|
| Name | rank |
| Type | IntegerField |
| Use | Display order |

### computed_at Field (Task 09)
| Field | Type |
|-------|------|
| Name | computed_at |
| Type | DateTimeField |
| Auto | On create |

### UserProductInteraction Model (Task 10)
| Class | UserProductInteraction |
|-------|------------------------|
| Purpose | Track user-product events |
| Indexes | customer + product |

### interaction_type Field (Task 11)
| Type | Weight | Description |
|------|--------|-------------|
| VIEW | 1 | Product view |
| CART | 3 | Add to cart |
| PURCHASE | 5 | Completed purchase |

### customer FK (Task 12)
| Field | Type |
|-------|------|
| Name | customer |
| FK | Customer |
| Null | True (anonymous) |

### product FK (Task 13)
| Field | Type |
|-------|------|
| Name | product |
| FK | Product |
| On delete | CASCADE |

### timestamp Field (Task 14)
| Field | Type |
|-------|------|
| Name | timestamp |
| Type | DateTimeField |
| Auto | On create |
