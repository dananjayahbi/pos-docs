# Group B: Health Scoring

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 11 - Platform Analytics AI  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Implement tenant health scoring system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Data-Collection](../Group-A_Data-Collection/)
- **→ Next Group:** [Group-C_Anomaly-Detection](../Group-C_Anomaly-Detection/)

---

## Group Overview

This group implements health scoring. Creates TenantHealth Model with Health Metrics. Creates Activity Score, Revenue Score, Growth Score, Feature Usage Score, Error Rate Score, and Payment Score. Creates HealthCalculator with Weight Config and Score Normalization. Creates Health Categories and Health History. Creates Health Scheduler and Health API. Verifies Health Score.

### Key Outcomes

- TenantHealth Model
- Health Metrics
- Activity Score
- Revenue Score
- Growth Score
- Feature Usage Score
- Error Rate Score
- Payment Score
- HealthCalculator
- Weight Config
- Score Normalization
- Health Categories
- Health History
- Health Scheduler
- Health API
- Health verified

### Technology Context

- **Score:** Weighted multi-factor
- **Range:** 0-100
- **Calculation:** Daily batch
- **Storage:** Time series

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_Health-Components.md` | Create health score components | 17-26 |
| 02 | `02_Tasks-27-32_Calculator-API.md` | Create calculator and API | 27-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create TenantHealth Model | Medium | Task 16 |
| 18 | Create Health Metrics | Low | Task 17 |
| 19 | Create Activity Score | Medium | Task 18 |
| 20 | Create Revenue Score | Medium | Task 18 |
| 21 | Create Growth Score | Medium | Task 18 |
| 22 | Create Feature Usage Score | Medium | Task 18 |
| 23 | Create Error Rate Score | Low | Task 18 |
| 24 | Create Payment Score | Low | Task 18 |
| 25 | Create HealthCalculator | High | Task 24 |
| 26 | Create Weight Config | Low | Task 25 |
| 27 | Create Score Normalization | Low | Task 26 |
| 28 | Create Health Categories | Low | Task 27 |
| 29 | Create Health History | Medium | Task 28 |
| 30 | Create Health Scheduler | Low | Task 29 |
| 31 | Create Health API | Medium | Task 30 |
| 32 | Verify Health Score | Low | Task 31 |

---

## Execution Order

```
Task 17: TenantHealth Model
    │
    ▼
Task 18: Health Metrics
    │
    ├───┬───┬───┬───┬───┐
    ▼   ▼   ▼   ▼   ▼   ▼
T-19  T-20  T-21  T-22  T-23  T-24
(Act)(Rev)(Grow)(Feat)(Err)(Pay)
    │   │   │   │   │   │
    └───┴───┴───┴───┴───┘
              │
              ▼
       Task 25: HealthCalculator
              │
              ▼
       Task 26: Weight Config
              │
              ▼
       Task 27: Score Normalization
              │
              ▼
       Task 28: Health Categories
              │
              ▼
       Task 29: Health History
              │
              ▼
       Task 30: Health Scheduler
              │
              ▼
       Task 31: Health API
              │
              ▼
       Task 32: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── platform_analytics/
        ├── models/
        │   └── tenant_health.py
        └── analytics/
            └── health_scorer.py
```

---

## Notes for AI Agents

### TenantHealth Model (Task 17)
| Model | TenantHealth |
|-------|--------------|

### TenantHealth Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Record ID |
| tenant_id | string | Tenant |
| overall_score | int | 0-100 |
| activity_score | int | 0-100 |
| revenue_score | int | 0-100 |
| growth_score | int | 0-100 |
| feature_score | int | 0-100 |
| error_score | int | 0-100 |
| payment_score | int | 0-100 |
| category | string | Health category |
| calculated_at | datetime | When |

### Health Metrics (Task 18)
| Purpose | Define metrics per component |
|---------|------------------------------|

### Activity Score (Task 19)
| Factors | Description |
|---------|-------------|
| login_frequency | Daily logins |
| api_calls | API usage |
| active_users | DAU/MAU |

### Activity Formula
| Range | Score |
|-------|-------|
| High activity | 80-100 |
| Medium | 50-79 |
| Low | 20-49 |
| Inactive | 0-19 |

### Revenue Score (Task 20)
| Factors | Description |
|---------|-------------|
| gmv_trend | Revenue trend |
| avg_order_value | AOV |
| transaction_count | Volume |

### Growth Score (Task 21)
| Factors | Description |
|---------|-------------|
| order_growth | MoM growth |
| customer_growth | New customers |
| product_growth | Catalog size |

### Feature Usage Score (Task 22)
| Factors | Description |
|---------|-------------|
| features_used | Active features |
| integration_count | Integrations |
| advanced_features | Premium features |

### Error Rate Score (Task 23)
| Factors | Description |
|---------|-------------|
| error_rate | Errors/requests |
| uptime | System uptime |
| response_time | Avg latency |

### Error Formula
| Error Rate | Score |
|------------|-------|
| <1% | 100 |
| 1-5% | 80 |
| 5-10% | 60 |
| >10% | 40 |

### Payment Score (Task 24)
| Factors | Description |
|---------|-------------|
| payment_success | Success rate |
| on_time_payment | Billing status |
| chargeback_rate | Disputes |

### HealthCalculator (Task 25)
| Class | HealthCalculator |
|-------|------------------|
| Method | calculate(tenant_id) |

### Weight Config (Task 26)
| Component | Weight |
|-----------|--------|
| Activity | 20% |
| Revenue | 25% |
| Growth | 20% |
| Features | 15% |
| Errors | 10% |
| Payments | 10% |

### Score Normalization (Task 27)
| Range | 0-100 |
|-------|-------|
| Method | Min-max scaling |

### Health Categories (Task 28)
| Score | Category |
|-------|----------|
| 80-100 | Healthy |
| 60-79 | Stable |
| 40-59 | At Risk |
| 20-39 | Critical |
| 0-19 | Churning |

### Health History (Task 29)
| Model | TenantHealthHistory |
|-------|---------------------|
| Track | Daily scores |

### Health Scheduler (Task 30)
| Schedule | Daily 2 AM |
|----------|------------|
| Task | Calculate all tenants |

### Health API (Task 31)
| Endpoint | GET /api/admin/health/{tenant_id} |
|----------|----------------------------------|
| Return | Health details |

### API Response
| Field | Description |
|-------|-------------|
| overall_score | Total score |
| components | Component scores |
| category | Health category |
| trend | Score trend |
| history | Last 30 days |
