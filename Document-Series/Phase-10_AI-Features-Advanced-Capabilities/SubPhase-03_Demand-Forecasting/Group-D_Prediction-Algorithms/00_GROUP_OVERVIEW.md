# Group D: Prediction Algorithms

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** D of F  
> **Tasks Covered:** 49-66  
> **Group Goal:** Implement Prophet and ARIMA forecasting algorithms

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Festival-Calendar](../Group-C_Festival-Calendar/)
- **→ Next Group:** [Group-E_Reorder-Suggestions](../Group-E_Reorder-Suggestions/)

---

## Group Overview

This group implements prediction algorithms. Creates ForecastTrainer ABC with abstract train and predict methods. Creates ProphetForecaster with add_holidays to add Sri Lanka festivals, add_seasonality for custom seasonality, Prophet train and Prophet predict methods. Creates ARIMAForecaster with auto_arima for automatic parameter selection, ARIMA train and ARIMA predict. Creates ModelSelector with cross_validate for time series CV and compare_models to select best algorithm. Creates ForecastTrainingTask with weekly schedule. Verifies forecasting.

### Key Outcomes

- ForecastTrainer ABC
- train abstract method
- predict abstract method
- ProphetForecaster
- add_holidays method
- add_seasonality method
- Prophet train
- Prophet predict
- ARIMAForecaster
- auto_arima method
- ARIMA train
- ARIMA predict
- ModelSelector
- cross_validate method
- compare_models method
- ForecastTrainingTask
- Forecast schedule (weekly)
- Forecasting verified

### Technology Context

- **Prophet:** Facebook time series
- **ARIMA:** Auto-ARIMA
- **CV:** Time series split
- **Metrics:** MAE, RMSE, MAPE

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-56_ABC-Prophet.md` | Create ABC and Prophet | 49-56 |
| 02 | `02_Tasks-57-66_ARIMA-Selector-Task.md` | Create ARIMA, selector, task | 57-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Create ForecastTrainer ABC | Medium | Task 48 |
| 50 | Create train Abstract | Low | Task 49 |
| 51 | Create predict Abstract | Low | Task 49 |
| 52 | Create ProphetForecaster | High | Task 51 |
| 53 | Create add_holidays | Medium | Task 52 |
| 54 | Create add_seasonality | Medium | Task 53 |
| 55 | Create Prophet train | High | Task 54 |
| 56 | Create Prophet predict | Medium | Task 55 |
| 57 | Create ARIMAForecaster | High | Task 51 |
| 58 | Create auto_arima | High | Task 57 |
| 59 | Create ARIMA train | Medium | Task 58 |
| 60 | Create ARIMA predict | Medium | Task 59 |
| 61 | Create ModelSelector | High | Task 60 |
| 62 | Create cross_validate | High | Task 61 |
| 63 | Create compare_models | Medium | Task 62 |
| 64 | Create ForecastTrainingTask | Medium | Task 63 |
| 65 | Create Forecast Schedule | Low | Task 64 |
| 66 | Verify Forecasting | Low | Task 65 |

---

## Execution Order

```
Task 49: ForecastTrainer ABC
    │
    ├────────┐
    ▼        ▼
T-50      T-51
(train) (predict)
    │        │
    └────────┘
         │
    ┌────┴────┐
    ▼         ▼
T-52       T-57
(Prophet) (ARIMA)
    │         │
    ▼         ▼
T-53       T-58
(Holiday)(AutoARI)
    │         │
    ▼         ▼
T-54       T-59
(Season) (Train)
    │         │
    ▼         ▼
T-55       T-60
(Train) (Predict)
    │         │
    ▼         │
T-56        │
(Predict)   │
    │         │
    └────┬────┘
         │
         ▼
Task 61: ModelSelector
         │
         ▼
Task 62: cross_validate
         │
         ▼
Task 63: compare_models
         │
         ▼
Task 64: ForecastTrainingTask
         │
         ▼
Task 65: Forecast Schedule
         │
         ▼
Task 66: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── forecasting/
            ├── algorithms/
            │   ├── __init__.py
            │   ├── base.py
            │   ├── prophet.py
            │   ├── arima.py
            │   └── selector.py
            └── tasks/
                └── training_tasks.py
```

---

## Notes for AI Agents

### ForecastTrainer ABC (Task 49)
| Class | ForecastTrainer(ABC) |
|-------|----------------------|
| Purpose | Base forecaster class |

### train Abstract (Task 50)
| Method | train(df: DataFrame) -> ForecastModel |
|--------|---------------------------------------|
| Action | Train on historical data |
| Return | Trained model reference |

### predict Abstract (Task 51)
| Method | predict(periods: int) -> DataFrame |
|--------|-----------------------------------|
| Action | Forecast future periods |
| Return | DataFrame with predictions |

### ProphetForecaster (Task 52)
| Class | ProphetForecaster(ForecastTrainer) |
|-------|-----------------------------------|
| Purpose | Facebook Prophet implementation |

### add_holidays (Task 53)
| Method | add_holidays(model) |
|--------|---------------------|
| Action | Add Sri Lanka holidays |
| Use | FestivalCalendar |

### Prophet Holidays Format
| Column | Description |
|--------|-------------|
| holiday | Festival name |
| ds | Date |
| lower_window | Days before |
| upper_window | Days after |

### add_seasonality (Task 54)
| Method | add_seasonality(model) |
|--------|------------------------|
| Action | Add custom seasonality |
| Types | Weekly, monthly, yearly |

### Prophet train (Task 55)
| Method | train(df) |
|--------|----------|
| Action | Fit Prophet model |
| Data | ds, y columns |

### Prophet predict (Task 56)
| Method | predict(periods) |
|--------|-----------------|
| Return | yhat, yhat_lower, yhat_upper |
| Columns | ds, yhat, yhat_lower, yhat_upper |

### ARIMAForecaster (Task 57)
| Class | ARIMAForecaster(ForecastTrainer) |
|-------|----------------------------------|
| Purpose | ARIMA implementation |

### auto_arima (Task 58)
| Method | auto_arima(df) |
|--------|----------------|
| Return | Best (p, d, q) order |
| Library | pmdarima.auto_arima |

### Auto-ARIMA Parameters
| Parameter | Value |
|-----------|-------|
| start_p | 0 |
| start_q | 0 |
| max_p | 5 |
| max_q | 5 |
| d | None (auto) |
| seasonal | True |
| m | 7 (weekly) |

### ARIMA train (Task 59)
| Method | train(df) |
|--------|----------|
| Action | Fit ARIMA model |
| Return | Fitted model |

### ARIMA predict (Task 60)
| Method | predict(periods) |
|--------|-----------------|
| Return | Predictions with CI |
| Columns | forecast, conf_lower, conf_upper |

### ModelSelector (Task 61)
| Class | ModelSelector |
|-------|---------------|
| Purpose | Select best model |

### cross_validate (Task 62)
| Method | cross_validate(model, df, splits=5) |
|--------|-------------------------------------|
| Return | CV scores |
| Type | Time series split |

### Time Series CV
| Split | Train | Test |
|-------|-------|------|
| 1 | Week 1-4 | Week 5 |
| 2 | Week 1-5 | Week 6 |
| 3 | Week 1-6 | Week 7 |
| ... | ... | ... |

### compare_models (Task 63)
| Method | compare_models(df) |
|--------|-------------------|
| Return | Best model name |
| Metric | MAPE (lowest wins) |

### Model Comparison
| Model | Pros | Cons |
|-------|------|------|
| Prophet | Holidays, seasonality | Slower |
| ARIMA | Fast, simple | No holidays |

### ForecastTrainingTask (Task 64)
| Task | train_forecasts_task |
|------|----------------------|
| Type | Celery task |
| Queue | training |

### Forecast Schedule (Task 65)
| Schedule | Weekly (Sunday 4:00 AM) |
|----------|------------------------|
| Action | Retrain all forecasts |
