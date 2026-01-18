# SubPhase 03: Demand Forecasting - Tasks Summary

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase Index:** 03 of 12  
> **SubPhase Goal:** Implement inventory demand forecasting with Sri Lanka festival awareness  
> **Total Tasks:** 90 | **Status:** Planning  
> **Estimated Duration:** 13-15 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-02_Product-Recommendations](../SubPhase-02_Product-Recommendations/)
- **→ Next SubPhase:** [SubPhase-04_Smart-Search-Backend](../SubPhase-04_Smart-Search-Backend/)

---

## SubPhase Overview

This sub-phase implements demand forecasting for inventory management, including historical sales analysis, seasonal pattern detection, Sri Lanka festival awareness, and smart reorder suggestions.

### Key Outcomes
- Historical sales analysis
- Seasonal pattern detection
- Sri Lanka festival calendar
- Demand prediction models
- Reorder point calculation
- Lead time consideration
- Forecast API endpoints

### Sri Lanka Festivals
| Festival | Period | Impact |
|----------|--------|--------|
| Sinhala/Tamil New Year | April 13-14 | Very High |
| Vesak | May (Full Moon) | High |
| Poson | June (Full Moon) | Medium |
| Deepavali | October/November | High |
| Christmas | December 25 | High |
| Ramadan/Eid | Variable | Medium |

### Technology Stack
- **Algorithms:** Prophet, ARIMA, scikit-learn
- **Time Series:** statsmodels, pmdarima
- **Storage:** PostgreSQL for forecasts
- **Serving:** Celery for periodic forecasting

---

## Task Execution Order

```
TASK GROUP A: Forecasting Models (Tasks 01-16)
        │
        ▼
TASK GROUP B: Historical Data Processing (Tasks 17-32)
        │
        ▼
TASK GROUP C: Festival Calendar (Tasks 33-48)
        │
        ▼
TASK GROUP D: Prediction Algorithms (Tasks 49-66)
        │
        ▼
TASK GROUP E: Reorder Suggestions (Tasks 67-80)
        │
        ▼
TASK GROUP F: API & Frontend (Tasks 81-90)
```

---

## Task Index

### Group A: Forecasting Models (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Install Prophet** | Facebook Prophet | SubPhase-02 | 🔴 Not Created |
| 02 | **Install statsmodels** | Statistical models | Task 01 | 🔴 Not Created |
| 03 | **Install pmdarima** | Auto-ARIMA | Task 02 | 🔴 Not Created |
| 04 | **Create Forecast Model** | Forecast storage | Task 03 | 🔴 Not Created |
| 05 | **Create product FK** | Product link | Task 04 | 🔴 Not Created |
| 06 | **Create forecast_date Field** | Date forecasted | Task 04 | 🔴 Not Created |
| 07 | **Create predicted_demand Field** | Demand quantity | Task 04 | 🔴 Not Created |
| 08 | **Create confidence_low Field** | Lower bound | Task 04 | 🔴 Not Created |
| 09 | **Create confidence_high Field** | Upper bound | Task 04 | 🔴 Not Created |
| 10 | **Create model_version Field** | Model version | Task 04 | 🔴 Not Created |
| 11 | **Create ForecastModel Model** | Trained model metadata | Task 04 | 🔴 Not Created |
| 12 | **Create algorithm Field** | prophet/arima | Task 11 | 🔴 Not Created |
| 13 | **Create metrics Field** | MAE, RMSE, MAPE | Task 11 | 🔴 Not Created |
| 14 | **Create trained_at Field** | Training timestamp | Task 11 | 🔴 Not Created |
| 15 | **Create Forecast Migrations** | Generate migrations | Task 14 | 🔴 Not Created |
| 16 | **Verify Models** | Test model creation | Task 15 | 🔴 Not Created |

---

### Group B: Historical Data Processing (Tasks 17-32)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create SalesDataExtractor** | Extract sales history | Task 16 | 🔴 Not Created |
| 18 | **Create get_daily_sales** | Daily aggregation | Task 17 | 🔴 Not Created |
| 19 | **Create get_weekly_sales** | Weekly aggregation | Task 17 | 🔴 Not Created |
| 20 | **Create get_monthly_sales** | Monthly aggregation | Task 17 | 🔴 Not Created |
| 21 | **Create DataCleaner** | Clean sales data | Task 20 | 🔴 Not Created |
| 22 | **Create handle_missing** | Fill missing dates | Task 21 | 🔴 Not Created |
| 23 | **Create remove_outliers** | Outlier detection | Task 22 | 🔴 Not Created |
| 24 | **Create smooth_data** | Moving average | Task 23 | 🔴 Not Created |
| 25 | **Create SeasonalityDetector** | Detect patterns | Task 24 | 🔴 Not Created |
| 26 | **Create detect_weekly** | Weekly patterns | Task 25 | 🔴 Not Created |
| 27 | **Create detect_monthly** | Monthly patterns | Task 25 | 🔴 Not Created |
| 28 | **Create detect_yearly** | Yearly patterns | Task 25 | 🔴 Not Created |
| 29 | **Create TrendAnalyzer** | Trend analysis | Task 28 | 🔴 Not Created |
| 30 | **Create calculate_trend** | Long-term trend | Task 29 | 🔴 Not Created |
| 31 | **Create trend_direction** | Up/Down/Stable | Task 30 | 🔴 Not Created |
| 32 | **Verify Data Processing** | Test processing | Task 31 | 🔴 Not Created |

---

### Group C: Festival Calendar (Tasks 33-48)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 33 | **Create Festival Model** | Festival definitions | Task 32 | 🔴 Not Created |
| 34 | **Create festival_name Field** | Name identifier | Task 33 | 🔴 Not Created |
| 35 | **Create festival_type Field** | Type category | Task 33 | 🔴 Not Created |
| 36 | **Create date_start Field** | Start date | Task 33 | 🔴 Not Created |
| 37 | **Create date_end Field** | End date | Task 33 | 🔴 Not Created |
| 38 | **Create impact_factor Field** | Demand multiplier | Task 33 | 🔴 Not Created |
| 39 | **Create is_recurring Field** | Yearly recurring | Task 33 | 🔴 Not Created |
| 40 | **Create FestivalCalendar** | Calendar service | Task 39 | 🔴 Not Created |
| 41 | **Create Sinhala New Year** | April 13-14 | Task 40 | 🔴 Not Created |
| 42 | **Create Vesak Full Moon** | Variable May | Task 40 | 🔴 Not Created |
| 43 | **Create Poson Full Moon** | Variable June | Task 40 | 🔴 Not Created |
| 44 | **Create Deepavali** | Variable Oct/Nov | Task 40 | 🔴 Not Created |
| 45 | **Create Christmas** | December 25 | Task 40 | 🔴 Not Created |
| 46 | **Create get_festivals Method** | Get festivals in range | Task 45 | 🔴 Not Created |
| 47 | **Create get_impact Method** | Get impact for date | Task 46 | 🔴 Not Created |
| 48 | **Verify Festival Calendar** | Test calendar | Task 47 | 🔴 Not Created |

---

### Group D: Prediction Algorithms (Tasks 49-66)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 49 | **Create ForecastTrainer ABC** | Abstract trainer | Task 48 | 🔴 Not Created |
| 50 | **Create train Abstract** | Training method | Task 49 | 🔴 Not Created |
| 51 | **Create predict Abstract** | Prediction method | Task 49 | 🔴 Not Created |
| 52 | **Create ProphetForecaster** | Prophet implementation | Task 51 | 🔴 Not Created |
| 53 | **Create add_holidays** | Add festival holidays | Task 52 | 🔴 Not Created |
| 54 | **Create add_seasonality** | Custom seasonality | Task 53 | 🔴 Not Created |
| 55 | **Create Prophet train** | Train Prophet model | Task 54 | 🔴 Not Created |
| 56 | **Create Prophet predict** | Prophet forecast | Task 55 | 🔴 Not Created |
| 57 | **Create ARIMAForecaster** | ARIMA implementation | Task 51 | 🔴 Not Created |
| 58 | **Create auto_arima** | Auto parameter selection | Task 57 | 🔴 Not Created |
| 59 | **Create ARIMA train** | Train ARIMA | Task 58 | 🔴 Not Created |
| 60 | **Create ARIMA predict** | ARIMA forecast | Task 59 | 🔴 Not Created |
| 61 | **Create ModelSelector** | Best model selection | Task 60 | 🔴 Not Created |
| 62 | **Create cross_validate** | Time series CV | Task 61 | 🔴 Not Created |
| 63 | **Create compare_models** | Compare algorithms | Task 62 | 🔴 Not Created |
| 64 | **Create ForecastTrainingTask** | Celery training | Task 63 | 🔴 Not Created |
| 65 | **Create Forecast Schedule** | Weekly retraining | Task 64 | 🔴 Not Created |
| 66 | **Verify Forecasting** | Test predictions | Task 65 | 🔴 Not Created |

---

### Group E: Reorder Suggestions (Tasks 67-80)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 67 | **Create ReorderService** | Reorder calculation | Task 66 | 🔴 Not Created |
| 68 | **Create safety_stock** | Safety stock calc | Task 67 | 🔴 Not Created |
| 69 | **Create reorder_point** | Reorder point calc | Task 68 | 🔴 Not Created |
| 70 | **Create lead_time_demand** | Demand during lead | Task 69 | 🔴 Not Created |
| 71 | **Create optimal_order_qty** | EOQ calculation | Task 70 | 🔴 Not Created |
| 72 | **Create ReorderSuggestion Model** | Suggestion storage | Task 71 | 🔴 Not Created |
| 73 | **Create suggested_qty Field** | Quantity to order | Task 72 | 🔴 Not Created |
| 74 | **Create reorder_date Field** | When to order | Task 72 | 🔴 Not Created |
| 75 | **Create urgency Field** | low/medium/high | Task 72 | 🔴 Not Created |
| 76 | **Create ReorderAlert** | Alert on low stock | Task 75 | 🔴 Not Created |
| 77 | **Create generate_suggestions** | Batch suggestions | Task 76 | 🔴 Not Created |
| 78 | **Create ReorderTask** | Celery task | Task 77 | 🔴 Not Created |
| 79 | **Create Reorder Dashboard** | Admin dashboard | Task 78 | 🔴 Not Created |
| 80 | **Verify Reorder** | Test suggestions | Task 79 | 🔴 Not Created |

---

### Group F: API & Frontend (Tasks 81-90)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 81 | **Create Forecast API Views** | DRF ViewSet | Task 80 | 🔴 Not Created |
| 82 | **Create Product Forecast** | GET /api/products/{id}/forecast/ | Task 81 | 🔴 Not Created |
| 83 | **Create Reorder Suggestions** | GET /api/inventory/reorder/ | Task 81 | 🔴 Not Created |
| 84 | **Create Festival Calendar API** | GET /api/festivals/ | Task 81 | 🔴 Not Created |
| 85 | **Create Forecast Types** | TypeScript interfaces | Task 84 | 🔴 Not Created |
| 86 | **Create Forecast API Client** | Frontend API client | Task 85 | 🔴 Not Created |
| 87 | **Create ForecastChart** | Demand chart | Task 86 | 🔴 Not Created |
| 88 | **Create ReorderTable** | Reorder list | Task 86 | 🔴 Not Created |
| 89 | **Create FestivalCalendarUI** | Festival display | Task 86 | 🔴 Not Created |
| 90 | **Create Integration Tests** | E2E forecast tests | Task 89 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── ai/
        └── forecasting/
            ├── __init__.py
            ├── models/
            │   ├── forecast.py               # Forecast (Task 04)
            │   ├── forecast_model.py         # ForecastModel (Task 11)
            │   ├── festival.py               # Festival (Task 33)
            │   └── reorder_suggestion.py     # ReorderSuggestion (Task 72)
            ├── data/
            │   ├── __init__.py
            │   ├── extractor.py              # SalesDataExtractor (Task 17)
            │   ├── cleaner.py                # DataCleaner (Task 21)
            │   ├── seasonality.py            # SeasonalityDetector (Task 25)
            │   └── trend.py                  # TrendAnalyzer (Task 29)
            ├── calendar/
            │   ├── __init__.py
            │   └── festival_calendar.py      # FestivalCalendar (Task 40)
            ├── algorithms/
            │   ├── __init__.py
            │   ├── base.py                   # ForecastTrainer ABC (Task 49)
            │   ├── prophet.py                # ProphetForecaster (Task 52)
            │   ├── arima.py                  # ARIMAForecaster (Task 57)
            │   └── selector.py               # ModelSelector (Task 61)
            ├── services/
            │   ├── __init__.py
            │   └── reorder_service.py        # ReorderService (Task 67)
            ├── tasks/
            │   ├── training_tasks.py         # Training tasks (Task 64)
            │   └── reorder_tasks.py          # Reorder tasks (Task 78)
            └── api/
                └── views.py                  # API views (Task 81)

frontend/
└── lib/
    └── forecasting/
        ├── types.ts                          # Types (Task 85)
        └── client.ts                         # API client (Task 86)
└── components/
    └── inventory/
        ├── ForecastChart.tsx                 # Chart (Task 87)
        ├── ReorderTable.tsx                  # Table (Task 88)
        └── FestivalCalendar.tsx              # Calendar (Task 89)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Forecasting Models | 16 | 0 | 0% |
| B | Historical Data Processing | 16 | 0 | 0% |
| C | Festival Calendar | 16 | 0 | 0% |
| D | Prediction Algorithms | 18 | 0 | 0% |
| E | Reorder Suggestions | 14 | 0 | 0% |
| F | API & Frontend | 10 | 0 | 0% |
| **Total** | | **90** | **0** | **0%** |

---

## Festival Impact Factors

| Festival | Impact Factor | Duration |
|----------|--------------|----------|
| Sinhala/Tamil New Year | 2.5x | 7 days |
| Vesak | 1.8x | 3 days |
| Poson | 1.5x | 2 days |
| Deepavali | 2.0x | 3 days |
| Christmas | 2.2x | 7 days |
| Ramadan/Eid | 1.6x | 3 days |

---

## Forecast Horizon

| Type | Horizon | Use Case |
|------|---------|----------|
| Short-term | 7 days | Daily operations |
| Medium-term | 30 days | Reorder planning |
| Long-term | 90 days | Seasonal planning |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **Prophet primary** - Use Facebook Prophet for main forecasting
3. **ARIMA fallback** - Use auto-ARIMA as alternative
4. **Festival calendar** - Sri Lanka specific holidays
5. **Time series CV** - Use time-based cross-validation
6. **Multi-tenant** - All forecasts scoped to tenant
7. **Lead time** - Consider supplier lead times
8. **Safety stock** - Buffer for demand variability
9. **Weekly training** - Retrain models weekly
10. **Confidence intervals** - Provide prediction bounds
