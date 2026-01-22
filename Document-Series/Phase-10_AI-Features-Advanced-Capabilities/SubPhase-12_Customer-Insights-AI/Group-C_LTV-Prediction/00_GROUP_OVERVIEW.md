# Group C: LTV Prediction

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** C of F  
> **Tasks Covered:** 35-52  
> **Group Goal:** Implement customer lifetime value prediction

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_RFM-Segmentation](../Group-B_RFM-Segmentation/)
- **→ Next Group:** [Group-D_Churn-Prediction](../Group-D_Churn-Prediction/)

---

## Group Overview

This group implements LTV prediction. Creates LTVPredictor Class. Creates LTV Features including Tenure, Frequency, AOV, Category, and Channel features. Creates XGBoost Model with Training Pipeline. Creates LTV Tiers and Predicted LTV with LTV Confidence. Creates CustomerLTV Model and LTV History. Creates LTV Scheduler, LTV API, and LTV Report. Verifies LTV Prediction.

### Key Outcomes

- LTVPredictor Class
- LTV Features
- Tenure Feature
- Frequency Feature
- AOV Feature
- Category Feature
- Channel Feature
- XGBoost Model
- Training Pipeline
- LTV Tiers
- Predicted LTV
- LTV Confidence
- CustomerLTV Model
- LTV History
- LTV Scheduler
- LTV API
- LTV Report
- Prediction verified

### Technology Context

- **ML:** XGBoost regression
- **Features:** 10+ customer features
- **Prediction:** 12-month LTV
- **Schedule:** Weekly

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-35-44_Features-Model.md` | Create features and XGBoost model | 35-44 |
| 02 | `02_Tasks-45-52_LTV-API.md` | Create LTV model and API | 45-52 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 35 | Create LTVPredictor Class | Medium | Task 34 |
| 36 | Create LTV Features | Medium | Task 35 |
| 37 | Create Tenure Feature | Low | Task 36 |
| 38 | Create Frequency Feature | Low | Task 36 |
| 39 | Create AOV Feature | Low | Task 36 |
| 40 | Create Category Feature | Low | Task 36 |
| 41 | Create Channel Feature | Low | Task 36 |
| 42 | Create XGBoost Model | High | Task 41 |
| 43 | Create Training Pipeline | High | Task 42 |
| 44 | Create LTV Tiers | Low | Task 43 |
| 45 | Create Predicted LTV | Medium | Task 44 |
| 46 | Create LTV Confidence | Low | Task 45 |
| 47 | Create CustomerLTV Model | Medium | Task 46 |
| 48 | Create LTV History | Low | Task 47 |
| 49 | Create LTV Scheduler | Low | Task 48 |
| 50 | Create LTV API | Medium | Task 49 |
| 51 | Create LTV Report | Medium | Task 50 |
| 52 | Verify LTV Prediction | Low | Task 51 |

---

## Execution Order

```
Task 35: LTVPredictor Class
    │
    ▼
Task 36: LTV Features
    │
    ├─────┬─────┬─────┬─────┐
    ▼     ▼     ▼     ▼     ▼
T-37   T-38   T-39   T-40   T-41
(Ten) (Freq)(AOV) (Cat)(Chan)
    │     │     │     │     │
    └─────┴─────┴─────┴─────┘
                │
                ▼
        Task 42: XGBoost Model
                │
                ▼
        Task 43: Training Pipeline
                │
                ▼
        Task 44: LTV Tiers
                │
                ▼
        Task 45: Predicted LTV
                │
                ▼
        Task 46: LTV Confidence
                │
                ▼
        Task 47: CustomerLTV Model
                │
                ▼
        Task 48: LTV History
                │
                ▼
        Task 49: LTV Scheduler
                │
                ▼
        Task 50: LTV API
                │
                ▼
        Task 51: LTV Report
                │
                ▼
        Task 52: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── customer_insights/
        ├── models/
        │   └── customer_ltv.py
        └── analytics/
            └── ltv_predictor.py
```

---

## Notes for AI Agents

### LTVPredictor Class (Task 35)
| Class | LTVPredictor |
|-------|--------------|
| Method | predict(customer_id) |
| Return | LTVResult |

### LTV Features (Task 36)
| Purpose | Feature engineering |
|---------|---------------------|
| Count | 10+ features |

### Tenure Feature (Task 37)
| Feature | customer_tenure_days |
|---------|----------------------|
| Calc | Today - first_order_date |

### Frequency Feature (Task 38)
| Feature | order_frequency |
|---------|-----------------|
| Calc | Orders per month |

### AOV Feature (Task 39)
| Feature | average_order_value |
|---------|---------------------|
| Calc | Total spend / orders |

### Category Feature (Task 40)
| Feature | category_diversity |
|---------|---------------------|
| Calc | Unique categories bought |

### Channel Feature (Task 41)
| Feature | acquisition_channel |
|---------|---------------------|
| Values | organic, paid, referral |
| Encoding | One-hot |

### XGBoost Model (Task 42)
| Algorithm | XGBRegressor |
|-----------|--------------|
| Library | xgboost |
| Target | 12-month LTV |

### Model Hyperparameters
| Parameter | Value |
|-----------|-------|
| n_estimators | 100 |
| max_depth | 6 |
| learning_rate | 0.1 |
| min_child_weight | 1 |

### Training Pipeline (Task 43)
| Data | Customers with 12+ months history |
|------|-----------------------------------|
| Split | 80/20 train/test |
| Metric | RMSE, MAE |
| Retrain | Monthly |

### LTV Tiers (Task 44)
| Tier | LTV Range (LKR) |
|------|-----------------|
| Platinum | > 500,000 |
| Gold | 200,000 - 500,000 |
| Silver | 50,000 - 200,000 |
| Bronze | < 50,000 |

### Predicted LTV (Task 45)
| Output | 12-month predicted LTV |
|--------|------------------------|
| Unit | LKR |

### LTV Confidence (Task 46)
| Output | Prediction confidence |
|--------|----------------------|
| Range | 0-100% |
| Method | Model uncertainty |

### CustomerLTV Model (Task 47)
| Model | CustomerLTV |
|-------|-------------|

### LTV Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Record ID |
| customer_id | string | Customer |
| predicted_ltv | decimal | 12-month LTV |
| tier | string | Platinum/Gold/Silver/Bronze |
| confidence | int | 0-100 |
| calculated_at | datetime | When |

### LTV History (Task 48)
| Model | LTVHistory |
|-------|------------|
| Track | LTV changes over time |

### LTV Scheduler (Task 49)
| Schedule | Weekly Sunday |
|----------|---------------|
| Task | Celery beat |

### LTV API (Task 50)
| Endpoint | GET /api/insights/ltv/{customer_id} |
|----------|-------------------------------------|
| Return | LTV details |

### LTV Report (Task 51)
| Endpoint | GET /api/insights/ltv/report |
|----------|------------------------------|
| Return | Distribution stats |

### Report Data
| Field | Description |
|-------|-------------|
| tier_distribution | Count per tier |
| avg_ltv | Average LTV |
| total_predicted | Sum of LTV |
| top_customers | Highest LTV |
