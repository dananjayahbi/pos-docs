# Group A: Forecasting Models

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Set up forecasting dependencies and data models

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_Product-Recommendations](../../SubPhase-02_Product-Recommendations/)
- **→ Next Group:** [Group-B_Historical-Data-Processing](../Group-B_Historical-Data-Processing/)

---

## Group Overview

This group sets up forecasting models. Installs Prophet, statsmodels, and pmdarima libraries. Creates Forecast model with product FK, forecast_date, predicted_demand, confidence_low, confidence_high, and model_version fields. Creates ForecastModel model to store trained model metadata with algorithm field for prophet/arima, metrics field for MAE/RMSE/MAPE, and trained_at timestamp. Generates migrations. Verifies models.

### Key Outcomes

- Prophet installed
- statsmodels installed
- pmdarima installed
- Forecast model
- product FK
- forecast_date field
- predicted_demand field
- confidence_low field
- confidence_high field
- model_version field
- ForecastModel model
- algorithm field
- metrics field
- trained_at field
- Forecast migrations
- Models verified

### Technology Context

- **Prophet:** Facebook time series
- **statsmodels:** Statistical models
- **pmdarima:** Auto-ARIMA
- **Storage:** PostgreSQL

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-10_Dependencies-Forecast-Model.md` | Install dependencies and create forecast model | 01-10 |
| 02 | `02_Tasks-11-16_ForecastModel-Migration.md` | Create ForecastModel and migration | 11-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Install Prophet | Low | SubPhase-02 |
| 02 | Install statsmodels | Low | Task 01 |
| 03 | Install pmdarima | Low | Task 02 |
| 04 | Create Forecast Model | Medium | Task 03 |
| 05 | Create product FK | Low | Task 04 |
| 06 | Create forecast_date Field | Low | Task 04 |
| 07 | Create predicted_demand Field | Low | Task 04 |
| 08 | Create confidence_low Field | Low | Task 04 |
| 09 | Create confidence_high Field | Low | Task 04 |
| 10 | Create model_version Field | Low | Task 04 |
| 11 | Create ForecastModel Model | Medium | Task 04 |
| 12 | Create algorithm Field | Low | Task 11 |
| 13 | Create metrics Field | Low | Task 11 |
| 14 | Create trained_at Field | Low | Task 11 |
| 15 | Create Forecast Migrations | Low | Task 14 |
| 16 | Verify Models | Low | Task 15 |

---

## Execution Order

```
Task 01: Install Prophet
    │
    ▼
Task 02: Install statsmodels
    │
    ▼
Task 03: Install pmdarima
    │
    ▼
Task 04: Forecast Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-05      T-06      T-07      T-08     T-09    T-10     T-11
(Prod)  (Date)  (Demand)(Low)  (High) (Ver) (FModel)
    │        │        │        │        │        │        │
    │        │        │        │        │        │   ┌────┼────┬────────┐
    │        │        │        │        │        │   ▼    ▼    ▼        ▼
    │        │        │        │        │        │ T-12  T-13  T-14
    │        │        │        │        │        │(Alg)(Metric)(Time)
    │        │        │        │        │        │   │    │    │
    └────────┴────────┴────────┴────────┴────────┴───┴────┴────┘
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
        └── forecasting/
            ├── __init__.py
            └── models/
                ├── forecast.py
                └── forecast_model.py
```

---

## Notes for AI Agents

### Prophet (Task 01)
| Package | prophet |
|---------|---------|
| Version | >=1.1.0 |
| Use | Time series forecasting |

### statsmodels (Task 02)
| Package | statsmodels |
|---------|-------------|
| Version | >=0.14.0 |
| Use | Statistical analysis |

### pmdarima (Task 03)
| Package | pmdarima |
|---------|----------|
| Version | >=2.0.0 |
| Use | Auto-ARIMA |

### Forecast Model (Task 04)
| Class | Forecast |
|-------|----------|
| Purpose | Store predictions |
| Unique | product + forecast_date |

### product FK (Task 05)
| Field | Type |
|-------|------|
| Name | product |
| FK | Product |
| On delete | CASCADE |

### forecast_date Field (Task 06)
| Field | Type |
|-------|------|
| Name | forecast_date |
| Type | DateField |
| Index | True |

### predicted_demand Field (Task 07)
| Field | Type |
|-------|------|
| Name | predicted_demand |
| Type | FloatField |
| Use | Forecasted quantity |

### confidence_low Field (Task 08)
| Field | Type |
|-------|------|
| Name | confidence_low |
| Type | FloatField |
| Use | Lower 95% bound |

### confidence_high Field (Task 09)
| Field | Type |
|-------|------|
| Name | confidence_high |
| Type | FloatField |
| Use | Upper 95% bound |

### model_version Field (Task 10)
| Field | Type |
|-------|------|
| Name | model_version |
| Type | CharField |
| Use | Track model version |

### ForecastModel Model (Task 11)
| Class | ForecastModel |
|-------|---------------|
| Purpose | Store trained model metadata |
| OneToOne | Product |

### algorithm Field (Task 12)
| Field | Type |
|-------|------|
| Name | algorithm |
| Type | CharField |
| Choices | prophet, arima |

### metrics Field (Task 13)
| Field | Type |
|-------|------|
| Name | metrics |
| Type | JSONField |
| Content | MAE, RMSE, MAPE |

### Metrics Format
| Metric | Description |
|--------|-------------|
| MAE | Mean Absolute Error |
| RMSE | Root Mean Square Error |
| MAPE | Mean Absolute Percentage Error |

### trained_at Field (Task 14)
| Field | Type |
|-------|------|
| Name | trained_at |
| Type | DateTimeField |
| Auto | On create |
