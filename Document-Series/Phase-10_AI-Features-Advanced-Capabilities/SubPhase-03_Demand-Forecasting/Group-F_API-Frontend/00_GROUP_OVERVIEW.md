# Group F: API & Frontend

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** F of F  
> **Tasks Covered:** 81-90  
> **Group Goal:** Create forecast API endpoints and frontend components

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Reorder-Suggestions](../Group-E_Reorder-Suggestions/)
- **→ Next SubPhase:** [SubPhase-04_Smart-Search-Backend](../../SubPhase-04_Smart-Search-Backend/)

---

## Group Overview

This group creates API and frontend. Creates Forecast API Views using DRF ViewSet. Creates Product Forecast endpoint at GET /api/products/{id}/forecast/. Creates Reorder Suggestions endpoint at GET /api/inventory/reorder/. Creates Festival Calendar API at GET /api/festivals/. Creates TypeScript forecast types. Creates frontend API client. Creates ForecastChart component for demand visualization. Creates ReorderTable component for reorder list. Creates FestivalCalendarUI component. Creates integration tests.

### Key Outcomes

- Forecast API Views
- Product Forecast endpoint
- Reorder Suggestions endpoint
- Festival Calendar API
- Forecast types
- Forecast API client
- ForecastChart component
- ReorderTable component
- FestivalCalendarUI component
- Integration tests

### Technology Context

- **API:** Django REST Framework
- **Frontend:** Next.js + TypeScript
- **Charts:** Recharts
- **Components:** Shadcn/UI

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-81-90_API-Components-Tests.md` | Create API, components, tests | 81-90 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 81 | Create Forecast API Views | Medium | Task 80 |
| 82 | Create Product Forecast | Low | Task 81 |
| 83 | Create Reorder Suggestions | Low | Task 81 |
| 84 | Create Festival Calendar API | Low | Task 81 |
| 85 | Create Forecast Types | Low | Task 84 |
| 86 | Create Forecast API Client | Medium | Task 85 |
| 87 | Create ForecastChart | Medium | Task 86 |
| 88 | Create ReorderTable | Medium | Task 86 |
| 89 | Create FestivalCalendarUI | Medium | Task 86 |
| 90 | Create Integration Tests | Medium | Task 89 |

---

## Execution Order

```
Task 81: Forecast API Views
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-82      T-83      T-84
(Fore)  (Reord) (Festival)
    │        │        │
    └────────┴────────┘
              │
              ▼
       Task 85: Forecast Types
              │
              ▼
       Task 86: API Client
              │
       ┌──────┼──────┐
       ▼      ▼      ▼
    T-87    T-88   T-89
  (Chart)(Table)(Calendar)
       │      │      │
       └──────┴──────┘
              │
              ▼
       Task 90: Integration Tests
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── forecasting/
            └── api/
                └── views.py

frontend/
├── lib/
│   └── forecasting/
│       ├── types.ts
│       └── client.ts
└── components/
    └── inventory/
        ├── ForecastChart.tsx
        ├── ReorderTable.tsx
        └── FestivalCalendar.tsx

tests/
└── ai/
    └── test_forecasting_e2e.py
```

---

## Notes for AI Agents

### Forecast API Views (Task 81)
| ViewSet | ForecastViewSet |
|---------|-----------------|
| Purpose | Forecast endpoints |

### Product Forecast (Task 82)
| Endpoint | GET /api/products/{id}/forecast/ |
|----------|----------------------------------|
| Params | horizon (7, 30, 90 days) |
| Return | List of forecasts |

### Forecast Response
| Field | Description |
|-------|-------------|
| forecasts | List of predictions |
| product_id | Product ID |
| model | prophet / arima |
| generated_at | Timestamp |

### Forecast Item Format
| Field | Description |
|-------|-------------|
| date | Forecast date |
| predicted_demand | Predicted quantity |
| confidence_low | Lower bound |
| confidence_high | Upper bound |

### Reorder Suggestions (Task 83)
| Endpoint | GET /api/inventory/reorder/ |
|----------|----------------------------|
| Params | urgency, category |
| Return | List of suggestions |

### Reorder Response
| Field | Description |
|-------|-------------|
| suggestions | List of suggestions |
| total | Total count |
| critical_count | Critical items |

### Festival Calendar API (Task 84)
| Endpoint | GET /api/festivals/ |
|----------|---------------------|
| Params | start_date, end_date |
| Return | List of festivals |

### Festival Response
| Field | Description |
|-------|-------------|
| name | Festival name |
| type | RELIGIOUS, CULTURAL |
| start_date | Start date |
| end_date | End date |
| impact_factor | Demand multiplier |

### Forecast Types (Task 85)
| Type | Fields |
|------|--------|
| Forecast | date, predicted_demand, confidence_low, confidence_high |
| ForecastResponse | forecasts, product_id, model, generated_at |
| ReorderSuggestion | product, suggested_qty, reorder_date, urgency |
| Festival | name, type, start_date, end_date, impact_factor |

### Forecast API Client (Task 86)
| Method | Endpoint |
|--------|----------|
| getProductForecast | GET /products/{id}/forecast/ |
| getReorderSuggestions | GET /inventory/reorder/ |
| getFestivals | GET /festivals/ |

### ForecastChart Component (Task 87)
| Component | ForecastChart |
|-----------|---------------|
| Props | productId, horizon |
| Display | Line chart with CI |

### ForecastChart Features
| Feature | Description |
|---------|-------------|
| Line | Predicted demand |
| Band | Confidence interval |
| Markers | Festival periods |
| Tooltip | Date, demand, CI |

### ReorderTable Component (Task 88)
| Component | ReorderTable |
|-----------|--------------|
| Props | urgencyFilter |
| Display | Data table |

### ReorderTable Features
| Feature | Description |
|---------|-------------|
| Columns | Product, qty, date, urgency |
| Sort | By urgency, date |
| Filter | By urgency level |
| Action | Create PO |

### FestivalCalendarUI Component (Task 89)
| Component | FestivalCalendar |
|-----------|------------------|
| Props | year, month |
| Display | Calendar view |

### FestivalCalendar Features
| Feature | Description |
|---------|-------------|
| View | Month/year |
| Highlight | Festival days |
| Color | By impact factor |
| Tooltip | Festival details |

### Integration Tests (Task 90)
| Test | Coverage |
|------|----------|
| test_forecast_endpoint | Forecast API |
| test_reorder_endpoint | Reorder API |
| test_festival_endpoint | Festival API |
| test_forecast_accuracy | Model metrics |
