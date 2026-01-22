# Group B: RFM Segmentation

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** B of F  
> **Tasks Covered:** 17-34  
> **Group Goal:** Implement RFM customer segmentation

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_Data-Preparation](../Group-A_Data-Preparation/)
- **→ Next Group:** [Group-C_LTV-Prediction](../Group-C_LTV-Prediction/)

---

## Group Overview

This group implements RFM segmentation. Creates RFMCalculator Class. Creates Recency Score, Frequency Score, and Monetary Score. Creates Quintile Method. Creates RFM Segments including Champions, Loyal, At Risk, Lost, New, and Promising segments. Creates CustomerSegment Model and Segment History. Creates Segment Scheduler, Segment API, and Segment Stats. Verifies RFM Segmentation.

### Key Outcomes

- RFMCalculator Class
- Recency Score
- Frequency Score
- Monetary Score
- Quintile Method
- RFM Segments
- Champions Segment
- Loyal Segment
- At Risk Segment
- Lost Segment
- New Segment
- Promising Segment
- CustomerSegment Model
- Segment History
- Segment Scheduler
- Segment API
- Segment Stats
- Segmentation verified

### Technology Context

- **Method:** RFM Analysis
- **Scoring:** Quintile (1-5)
- **Segments:** 6 categories
- **Schedule:** Weekly

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-26_RFM-Calculator.md` | Create RFM calculator and segments | 17-26 |
| 02 | `02_Tasks-27-34_Model-API.md` | Create model and API | 27-34 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create RFMCalculator Class | Medium | Task 16 |
| 18 | Create Recency Score | Low | Task 17 |
| 19 | Create Frequency Score | Low | Task 18 |
| 20 | Create Monetary Score | Low | Task 19 |
| 21 | Create Quintile Method | Medium | Task 20 |
| 22 | Create RFM Segments | Medium | Task 21 |
| 23 | Create Champions Segment | Low | Task 22 |
| 24 | Create Loyal Segment | Low | Task 22 |
| 25 | Create At Risk Segment | Low | Task 22 |
| 26 | Create Lost Segment | Low | Task 22 |
| 27 | Create New Segment | Low | Task 22 |
| 28 | Create Promising Segment | Low | Task 22 |
| 29 | Create CustomerSegment Model | Medium | Task 28 |
| 30 | Create Segment History | Low | Task 29 |
| 31 | Create Segment Scheduler | Low | Task 30 |
| 32 | Create Segment API | Medium | Task 31 |
| 33 | Create Segment Stats | Low | Task 32 |
| 34 | Verify RFM Segmentation | Low | Task 33 |

---

## Execution Order

```
Task 17: RFMCalculator Class
    │
    ▼
Task 18: Recency Score
    │
    ▼
Task 19: Frequency Score
    │
    ▼
Task 20: Monetary Score
    │
    ▼
Task 21: Quintile Method
    │
    ▼
Task 22: RFM Segments
    │
    ├──────┬──────┬──────┬──────┬──────┐
    ▼      ▼      ▼      ▼      ▼      ▼
T-23    T-24    T-25    T-26    T-27    T-28
(Champ)(Loyal)(Risk)(Lost) (New)(Prom)
    │      │      │      │      │      │
    └──────┴──────┴──────┴──────┴──────┘
                    │
                    ▼
          Task 29: CustomerSegment Model
                    │
                    ▼
          Task 30: Segment History
                    │
                    ▼
          Task 31: Segment Scheduler
                    │
                    ▼
          Task 32: Segment API
                    │
                    ▼
          Task 33: Segment Stats
                    │
                    ▼
          Task 34: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── customer_insights/
        ├── models/
        │   └── customer_segment.py
        └── analytics/
            └── rfm.py
```

---

## Notes for AI Agents

### RFMCalculator Class (Task 17)
| Class | RFMCalculator |
|-------|---------------|
| Method | calculate(customer_id) |
| Return | RFMResult |

### Recency Score (Task 18)
| Metric | Days since last order |
|--------|----------------------|
| Lower is better | More recent = higher score |

### Recency Scoring
| Days | Score |
|------|-------|
| 0-30 | 5 |
| 31-60 | 4 |
| 61-90 | 3 |
| 91-180 | 2 |
| 181+ | 1 |

### Frequency Score (Task 19)
| Metric | Total order count |
|--------|-------------------|
| Higher is better | More orders = higher score |

### Monetary Score (Task 20)
| Metric | Total spend |
|--------|-------------|
| Higher is better | More spend = higher score |

### Quintile Method (Task 21)
| Method | pandas.qcut |
|--------|-------------|
| Bins | 5 (quintiles) |

### Quintile Ranges
| Quintile | Score |
|----------|-------|
| 0-20% | 1 |
| 21-40% | 2 |
| 41-60% | 3 |
| 61-80% | 4 |
| 81-100% | 5 |

### RFM Segments (Task 22)
| Purpose | Map R/F/M scores to segments |
|---------|------------------------------|

### Champions Segment (Task 23)
| Segment | Champions |
|---------|-----------|
| R Score | 4-5 |
| F Score | 4-5 |
| M Score | 4-5 |
| Action | VIP treatment |

### Loyal Segment (Task 24)
| Segment | Loyal |
|---------|-------|
| R Score | 2-5 |
| F Score | 3-5 |
| M Score | 3-5 |
| Action | Loyalty rewards |

### At Risk Segment (Task 25)
| Segment | At Risk |
|---------|---------|
| R Score | 2-3 |
| F Score | 2-4 |
| M Score | 2-4 |
| Action | Win-back campaign |

### Lost Segment (Task 26)
| Segment | Lost |
|---------|------|
| R Score | 1-2 |
| F Score | 1-2 |
| M Score | 1-2 |
| Action | Reactivation offer |

### New Segment (Task 27)
| Segment | New |
|---------|-----|
| R Score | 4-5 |
| F Score | 1 |
| M Score | 1-2 |
| Action | Welcome nurture |

### Promising Segment (Task 28)
| Segment | Promising |
|---------|-----------|
| R Score | 3-4 |
| F Score | 1-3 |
| M Score | 1-3 |
| Action | Engagement campaign |

### CustomerSegment Model (Task 29)
| Model | CustomerSegment |
|-------|-----------------|

### Segment Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Record ID |
| customer_id | string | Customer |
| r_score | int | Recency (1-5) |
| f_score | int | Frequency (1-5) |
| m_score | int | Monetary (1-5) |
| segment | string | Segment name |
| calculated_at | datetime | When |

### Segment History (Task 30)
| Model | SegmentHistory |
|-------|----------------|
| Track | Segment changes |

### Segment Scheduler (Task 31)
| Schedule | Weekly Sunday |
|----------|---------------|
| Task | Celery beat |

### Segment API (Task 32)
| Endpoint | GET /api/insights/segments |
|----------|---------------------------|
| Filters | segment, date_range |

### Segment Stats (Task 33)
| Endpoint | GET /api/insights/segments/stats |
|----------|----------------------------------|
| Return | Count per segment |

### Stats Response
| Field | Description |
|-------|-------------|
| champions | Count |
| loyal | Count |
| at_risk | Count |
| lost | Count |
| new | Count |
| promising | Count |
