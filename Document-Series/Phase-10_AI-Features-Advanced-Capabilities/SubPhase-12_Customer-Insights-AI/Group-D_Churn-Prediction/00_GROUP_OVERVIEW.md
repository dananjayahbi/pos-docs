# Group D: Churn Prediction

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** D of F  
> **Tasks Covered:** 53-68  
> **Group Goal:** Implement customer churn prediction

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_LTV-Prediction](../Group-C_LTV-Prediction/)
- **→ Next Group:** [Group-E_Insights-Dashboard](../Group-E_Insights-Dashboard/)

---

## Group Overview

This group implements churn prediction. Creates ChurnPredictor Class. Creates Churn Features including Inactivity, Frequency Drop, AOV Drop, Engagement, and Support Tickets features. Creates Classification Model with Training Pipeline. Creates Churn Probability and Risk Tiers. Creates ChurnRisk Model and Risk Scheduler. Creates Churn API and At-Risk List. Verifies Churn Prediction.

### Key Outcomes

- ChurnPredictor Class
- Churn Features
- Inactivity Feature
- Frequency Drop Feature
- AOV Drop Feature
- Engagement Feature
- Support Tickets Feature
- Classification Model
- Training Pipeline
- Churn Probability
- Risk Tiers
- ChurnRisk Model
- Risk Scheduler
- Churn API
- At-Risk List
- Prediction verified

### Technology Context

- **ML:** Random Forest classifier
- **Features:** Behavioral signals
- **Output:** Churn probability
- **Schedule:** Weekly

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-53-62_Features-Model.md` | Create features and classifier | 53-62 |
| 02 | `02_Tasks-63-68_Risk-API.md` | Create risk model and API | 63-68 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 53 | Create ChurnPredictor Class | Medium | Task 52 |
| 54 | Create Churn Features | Medium | Task 53 |
| 55 | Create Inactivity Feature | Low | Task 54 |
| 56 | Create Frequency Drop | Medium | Task 54 |
| 57 | Create AOV Drop | Medium | Task 54 |
| 58 | Create Engagement Feature | Medium | Task 54 |
| 59 | Create Support Tickets | Low | Task 54 |
| 60 | Create Classification Model | High | Task 59 |
| 61 | Create Training Pipeline | High | Task 60 |
| 62 | Create Churn Probability | Medium | Task 61 |
| 63 | Create Risk Tiers | Low | Task 62 |
| 64 | Create ChurnRisk Model | Medium | Task 63 |
| 65 | Create Risk Scheduler | Low | Task 64 |
| 66 | Create Churn API | Medium | Task 65 |
| 67 | Create At-Risk List | Low | Task 66 |
| 68 | Verify Churn Prediction | Low | Task 67 |

---

## Execution Order

```
Task 53: ChurnPredictor Class
    │
    ▼
Task 54: Churn Features
    │
    ├─────┬─────┬─────┬─────┐
    ▼     ▼     ▼     ▼     ▼
T-55   T-56   T-57   T-58   T-59
(Inact)(Freq)(AOV)(Engag)(Tix)
    │     │     │     │     │
    └─────┴─────┴─────┴─────┘
                │
                ▼
        Task 60: Classification Model
                │
                ▼
        Task 61: Training Pipeline
                │
                ▼
        Task 62: Churn Probability
                │
                ▼
        Task 63: Risk Tiers
                │
                ▼
        Task 64: ChurnRisk Model
                │
                ▼
        Task 65: Risk Scheduler
                │
                ▼
        Task 66: Churn API
                │
                ▼
        Task 67: At-Risk List
                │
                ▼
        Task 68: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── customer_insights/
        ├── models/
        │   └── churn_risk.py
        └── analytics/
            └── churn_predictor.py
```

---

## Notes for AI Agents

### ChurnPredictor Class (Task 53)
| Class | ChurnPredictor |
|-------|----------------|
| Method | predict(customer_id) |
| Return | ChurnResult |

### Churn Features (Task 54)
| Purpose | Feature engineering |
|---------|---------------------|
| Count | 10+ features |

### Inactivity Feature (Task 55)
| Feature | days_since_last_order |
|---------|----------------------|
| Calc | Today - last_order_date |

### Frequency Drop (Task 56)
| Feature | frequency_decline |
|---------|-------------------|
| Calc | (3-month freq - 6-month freq) / 6-month freq |

### AOV Drop (Task 57)
| Feature | aov_decline |
|---------|-------------|
| Calc | (Recent AOV - Historical AOV) / Historical AOV |

### Engagement Feature (Task 58)
| Feature | engagement_score |
|---------|------------------|
| Factors | Site visits, email opens, clicks |

### Support Tickets (Task 59)
| Feature | support_ticket_count |
|---------|----------------------|
| Calc | Count in last 90 days |

### Classification Model (Task 60)
| Algorithm | RandomForestClassifier |
|-----------|------------------------|
| Library | sklearn |
| Target | churn (0/1) |

### Model Hyperparameters
| Parameter | Value |
|-----------|-------|
| n_estimators | 100 |
| max_depth | 10 |
| min_samples_split | 5 |
| class_weight | balanced |

### Training Pipeline (Task 61)
| Data | Customers with known churn |
|------|----------------------------|
| Churn def | No order in 90+ days |
| Split | 80/20 train/test |
| Metric | Precision, Recall, F1 |
| Retrain | Monthly |

### Churn Probability (Task 62)
| Output | Probability 0-100% |
|--------|---------------------|
| Method | predict_proba |

### Risk Tiers (Task 63)
| Risk Level | Probability |
|------------|-------------|
| Critical | > 80% |
| High | 50-80% |
| Medium | 20-50% |
| Low | < 20% |

### ChurnRisk Model (Task 64)
| Model | ChurnRisk |
|-------|-----------|

### Risk Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Record ID |
| customer_id | string | Customer |
| churn_probability | int | 0-100 |
| risk_tier | string | Critical/High/Medium/Low |
| key_factors | array | Top risk factors |
| calculated_at | datetime | When |

### Risk Scheduler (Task 65)
| Schedule | Weekly Sunday |
|----------|---------------|
| Task | Celery beat |

### Churn API (Task 66)
| Endpoint | GET /api/insights/churn/{customer_id} |
|----------|---------------------------------------|
| Return | Churn risk details |

### At-Risk List (Task 67)
| Endpoint | GET /api/insights/churn/at-risk |
|----------|--------------------------------|
| Filter | risk_tier >= High |

### List Response
| Field | Description |
|-------|-------------|
| customers | At-risk customers |
| total | Count |
| by_tier | Count per tier |
