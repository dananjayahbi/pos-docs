# Group B: Historical Data Processing

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 03 - Demand Forecasting  
> **Group:** B of F  
> **Tasks Covered:** 17-32  
> **Group Goal:** Process historical sales data for forecasting

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Forecasting-Models](../Group-A_Forecasting-Models/)
- **→ Next Group:** [Group-C_Festival-Calendar](../Group-C_Festival-Calendar/)

---

## Group Overview

This group processes historical data. Creates SalesDataExtractor with get_daily_sales, get_weekly_sales, and get_monthly_sales aggregation methods. Creates DataCleaner with handle_missing to fill missing dates, remove_outliers for outlier detection, and smooth_data for moving average smoothing. Creates SeasonalityDetector with detect_weekly, detect_monthly, and detect_yearly pattern detection. Creates TrendAnalyzer with calculate_trend for long-term trend and trend_direction for up/down/stable classification. Verifies data processing.

### Key Outcomes

- SalesDataExtractor
- get_daily_sales method
- get_weekly_sales method
- get_monthly_sales method
- DataCleaner
- handle_missing method
- remove_outliers method
- smooth_data method
- SeasonalityDetector
- detect_weekly method
- detect_monthly method
- detect_yearly method
- TrendAnalyzer
- calculate_trend method
- trend_direction method
- Data processing verified

### Technology Context

- **Aggregation:** Pandas resample
- **Outliers:** IQR / Z-score
- **Smoothing:** Moving average
- **Seasonality:** FFT / STL

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-24_Extractor-Cleaner.md` | Create extractor and cleaner | 17-24 |
| 02 | `02_Tasks-25-32_Seasonality-Trend.md` | Create seasonality and trend | 25-32 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create SalesDataExtractor | Medium | Task 16 |
| 18 | Create get_daily_sales | Medium | Task 17 |
| 19 | Create get_weekly_sales | Low | Task 17 |
| 20 | Create get_monthly_sales | Low | Task 17 |
| 21 | Create DataCleaner | Medium | Task 20 |
| 22 | Create handle_missing | Medium | Task 21 |
| 23 | Create remove_outliers | Medium | Task 22 |
| 24 | Create smooth_data | Low | Task 23 |
| 25 | Create SeasonalityDetector | High | Task 24 |
| 26 | Create detect_weekly | Medium | Task 25 |
| 27 | Create detect_monthly | Medium | Task 25 |
| 28 | Create detect_yearly | Medium | Task 25 |
| 29 | Create TrendAnalyzer | Medium | Task 28 |
| 30 | Create calculate_trend | Medium | Task 29 |
| 31 | Create trend_direction | Low | Task 30 |
| 32 | Verify Data Processing | Low | Task 31 |

---

## Execution Order

```
Task 17: SalesDataExtractor
    │
    ├────────┬────────┐
    ▼        ▼        ▼
T-18      T-19      T-20
(Daily) (Weekly)(Monthly)
    │        │        │
    └────────┴────────┘
              │
              ▼
       Task 21: DataCleaner
              │
              ▼
       Task 22: handle_missing
              │
              ▼
       Task 23: remove_outliers
              │
              ▼
       Task 24: smooth_data
              │
              ▼
       Task 25: SeasonalityDetector
              │
         ┌────┼────┐
         ▼    ▼    ▼
      T-26  T-27  T-28
    (Week)(Month)(Year)
         │    │    │
         └────┴────┘
              │
              ▼
       Task 29: TrendAnalyzer
              │
              ▼
       Task 30: calculate_trend
              │
              ▼
       Task 31: trend_direction
              │
              ▼
       Task 32: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── ai/
        └── forecasting/
            └── data/
                ├── __init__.py
                ├── extractor.py
                ├── cleaner.py
                ├── seasonality.py
                └── trend.py
```

---

## Notes for AI Agents

### SalesDataExtractor (Task 17)
| Class | SalesDataExtractor |
|-------|-------------------|
| Purpose | Extract sales history |
| Source | OrderItem model |

### get_daily_sales (Task 18)
| Method | get_daily_sales(product_id, start_date, end_date) |
|--------|--------------------------------------------------|
| Return | DataFrame with date, quantity |
| Aggregation | Sum per day |

### get_weekly_sales (Task 19)
| Method | get_weekly_sales(product_id, start_date, end_date) |
|--------|---------------------------------------------------|
| Return | DataFrame with week, quantity |
| Aggregation | Sum per week |

### get_monthly_sales (Task 20)
| Method | get_monthly_sales(product_id, start_date, end_date) |
|--------|-----------------------------------------------------|
| Return | DataFrame with month, quantity |
| Aggregation | Sum per month |

### DataCleaner (Task 21)
| Class | DataCleaner |
|-------|-------------|
| Purpose | Clean sales data |

### handle_missing (Task 22)
| Method | handle_missing(df) |
|--------|-------------------|
| Action | Fill missing dates |
| Strategy | Forward fill / Interpolate |

### Missing Data Strategy
| Gap Size | Strategy |
|----------|----------|
| 1-3 days | Interpolate |
| 4-7 days | Forward fill |
| >7 days | Mean imputation |

### remove_outliers (Task 23)
| Method | remove_outliers(df, method='iqr') |
|--------|----------------------------------|
| Action | Remove/cap outliers |
| Methods | IQR, Z-score |

### Outlier Detection
| Method | Threshold |
|--------|-----------|
| IQR | 1.5 * IQR |
| Z-score | |z| > 3 |

### smooth_data (Task 24)
| Method | smooth_data(df, window=7) |
|--------|--------------------------|
| Action | Moving average |
| Window | 7 days default |

### SeasonalityDetector (Task 25)
| Class | SeasonalityDetector |
|-------|---------------------|
| Purpose | Detect patterns |

### detect_weekly (Task 26)
| Method | detect_weekly(df) |
|--------|-------------------|
| Return | Weekly pattern coefficients |
| Days | Mon-Sun factors |

### detect_monthly (Task 27)
| Method | detect_monthly(df) |
|--------|-------------------|
| Return | Monthly pattern |
| Use | Beginning/mid/end month |

### detect_yearly (Task 28)
| Method | detect_yearly(df) |
|--------|------------------|
| Return | Yearly seasonality |
| Use | Festival periods |

### TrendAnalyzer (Task 29)
| Class | TrendAnalyzer |
|-------|---------------|
| Purpose | Analyze trends |

### calculate_trend (Task 30)
| Method | calculate_trend(df) |
|--------|---------------------|
| Return | Trend coefficient |
| Method | Linear regression |

### trend_direction (Task 31)
| Method | trend_direction(trend_coef) |
|--------|----------------------------|
| Return | up / down / stable |
| Thresholds | ±0.05 for stable |

### Trend Classification
| Coefficient | Direction |
|-------------|-----------|
| > 0.05 | Up |
| < -0.05 | Down |
| -0.05 to 0.05 | Stable |
