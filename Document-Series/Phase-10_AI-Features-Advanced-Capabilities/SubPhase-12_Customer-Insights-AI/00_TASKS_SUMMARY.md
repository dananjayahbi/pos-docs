# SubPhase 12: Customer Insights AI - Tasks Summary

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase Index:** 12 of 12 (FINAL SUBPHASE!)  
> **SubPhase Goal:** Implement AI-powered customer segmentation, LTV prediction, and churn analysis  
> **Total Tasks:** 92 | **Status:** Planning  
> **Estimated Duration:** 14-16 hours

---

## Navigation

- **↑ Parent:** [00_SUBPHASES_SUMMARY.md](../00_SUBPHASES_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-11_Platform-Analytics-AI](../SubPhase-11_Platform-Analytics-AI/)
- **→ Next Phase:** Phase 10 Complete! 🎉

---

## SubPhase Overview

This sub-phase implements customer-level AI analytics for tenants including RFM segmentation, customer lifetime value (LTV) prediction, churn prediction, and personalized marketing automation triggers.

### Key Outcomes
- RFM customer segmentation
- Customer LTV prediction
- Churn risk scoring
- Cohort analysis
- Purchase pattern analysis
- Marketing automation triggers
- Customer insights dashboard
- Export and reporting

### Customer Insights Architecture
```
┌──────────────────────────────────────────────────────────────────┐
│                  Customer Insights Engine                        │
└──────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Sources                                │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ Orders      │  │ Customer     │  │ Product                 │ │
│  │ History     │  │ Profile      │  │ Interactions            │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                      AI Models                                   │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ RFM         │  │ LTV          │  │ Churn                   │ │
│  │ Segmenter   │  │ Predictor    │  │ Predictor               │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
│  ┌─────────────┐  ┌──────────────┐  ┌─────────────────────────┐ │
│  │ Cohort      │  │ Pattern      │  │ Next Purchase           │ │
│  │ Analyzer    │  │ Analyzer     │  │ Predictor               │ │
│  └─────────────┘  └──────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
          │
          ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Actions & Outputs                             │
│  ┌─────────────────────────┐  ┌───────────────────────────────┐ │
│  │ Marketing Automation    │  │ Insights Dashboard            │ │
│  │ Triggers                │  │ Reports & Export              │ │
│  └─────────────────────────┘  └───────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

### Technology Stack
- **ML:** scikit-learn, XGBoost
- **Clustering:** K-Means, DBSCAN
- **Prediction:** Random Forest, Gradient Boosting
- **Analysis:** pandas, numpy

---

## Task Execution Order

```
TASK GROUP A: Data Preparation (Tasks 01-16)
        │
        ▼
TASK GROUP B: RFM Segmentation (Tasks 17-34)
        │
        ▼
TASK GROUP C: LTV Prediction (Tasks 35-52)
        │
        ▼
TASK GROUP D: Churn Prediction (Tasks 53-68)
        │
        ▼
TASK GROUP E: Insights Dashboard (Tasks 69-82)
        │
        ▼
TASK GROUP F: Automation & Testing (Tasks 83-92)
```

---

## Task Index

### Group A: Data Preparation (Tasks 01-16)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 01 | **Create CustomerMetrics Model** | Customer stats | None | 🔴 Not Created |
| 02 | **Create Metrics Fields** | total_orders/aov | Task 01 | 🔴 Not Created |
| 03 | **Create Order Aggregator** | Aggregate orders | Task 02 | 🔴 Not Created |
| 04 | **Create First Order Date** | First purchase | Task 03 | 🔴 Not Created |
| 05 | **Create Last Order Date** | Last purchase | Task 04 | 🔴 Not Created |
| 06 | **Create Order Count** | Total orders | Task 05 | 🔴 Not Created |
| 07 | **Create Total Spend** | Lifetime spend | Task 06 | 🔴 Not Created |
| 08 | **Create Average Order** | AOV calculation | Task 07 | 🔴 Not Created |
| 09 | **Create Order Frequency** | Days between | Task 08 | 🔴 Not Created |
| 10 | **Create Product Categories** | Preferred cats | Task 09 | 🔴 Not Created |
| 11 | **Create Purchase Days** | Preferred days | Task 10 | 🔴 Not Created |
| 12 | **Create Time of Day** | Preferred hours | Task 11 | 🔴 Not Created |
| 13 | **Create Metrics Scheduler** | Daily update | Task 12 | 🔴 Not Created |
| 14 | **Create Historical Snapshots** | Monthly snapshots | Task 13 | 🔴 Not Created |
| 15 | **Create Data Cleanup** | Remove outliers | Task 14 | 🔴 Not Created |
| 16 | **Verify Data Preparation** | Test metrics | Task 15 | 🔴 Not Created |

---

### Group B: RFM Segmentation (Tasks 17-34)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 17 | **Create RFMCalculator Class** | RFM calculator | Task 16 | 🔴 Not Created |
| 18 | **Create Recency Score** | Days since last | Task 17 | 🔴 Not Created |
| 19 | **Create Frequency Score** | Purchase count | Task 18 | 🔴 Not Created |
| 20 | **Create Monetary Score** | Total spend | Task 19 | 🔴 Not Created |
| 21 | **Create Quintile Method** | 1-5 scoring | Task 20 | 🔴 Not Created |
| 22 | **Create RFM Segments** | Segment mapping | Task 21 | 🔴 Not Created |
| 23 | **Create Champions Segment** | High R, F, M | Task 22 | 🔴 Not Created |
| 24 | **Create Loyal Segment** | High F, M | Task 22 | 🔴 Not Created |
| 25 | **Create At Risk Segment** | Low R, high F | Task 22 | 🔴 Not Created |
| 26 | **Create Lost Segment** | Low R, F, M | Task 22 | 🔴 Not Created |
| 27 | **Create New Segment** | Recent first | Task 22 | 🔴 Not Created |
| 28 | **Create Promising Segment** | Medium all | Task 22 | 🔴 Not Created |
| 29 | **Create CustomerSegment Model** | Store segment | Task 28 | 🔴 Not Created |
| 30 | **Create Segment History** | Track changes | Task 29 | 🔴 Not Created |
| 31 | **Create Segment Scheduler** | Weekly update | Task 30 | 🔴 Not Created |
| 32 | **Create Segment API** | Get segments | Task 31 | 🔴 Not Created |
| 33 | **Create Segment Stats** | Segment counts | Task 32 | 🔴 Not Created |
| 34 | **Verify RFM Segmentation** | Test segments | Task 33 | 🔴 Not Created |

---

### Group C: LTV Prediction (Tasks 35-52)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 35 | **Create LTVPredictor Class** | LTV predictor | Task 34 | 🔴 Not Created |
| 36 | **Create LTV Features** | Feature extraction | Task 35 | 🔴 Not Created |
| 37 | **Create Tenure Feature** | Customer age | Task 36 | 🔴 Not Created |
| 38 | **Create Frequency Feature** | Order frequency | Task 36 | 🔴 Not Created |
| 39 | **Create AOV Feature** | Avg order value | Task 36 | 🔴 Not Created |
| 40 | **Create Category Feature** | Category preference | Task 36 | 🔴 Not Created |
| 41 | **Create Channel Feature** | Acquisition channel | Task 36 | 🔴 Not Created |
| 42 | **Create XGBoost Model** | Regression model | Task 41 | 🔴 Not Created |
| 43 | **Create Training Pipeline** | Train model | Task 42 | 🔴 Not Created |
| 44 | **Create LTV Tiers** | High/Medium/Low | Task 43 | 🔴 Not Created |
| 45 | **Create Predicted LTV** | 12-month LTV | Task 44 | 🔴 Not Created |
| 46 | **Create LTV Confidence** | Prediction confidence | Task 45 | 🔴 Not Created |
| 47 | **Create CustomerLTV Model** | Store LTV | Task 46 | 🔴 Not Created |
| 48 | **Create LTV History** | Track changes | Task 47 | 🔴 Not Created |
| 49 | **Create LTV Scheduler** | Weekly update | Task 48 | 🔴 Not Created |
| 50 | **Create LTV API** | Get LTV data | Task 49 | 🔴 Not Created |
| 51 | **Create LTV Report** | LTV distribution | Task 50 | 🔴 Not Created |
| 52 | **Verify LTV Prediction** | Test accuracy | Task 51 | 🔴 Not Created |

---

### Group D: Churn Prediction (Tasks 53-68)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 53 | **Create ChurnPredictor Class** | Churn predictor | Task 52 | 🔴 Not Created |
| 54 | **Create Churn Features** | Feature extraction | Task 53 | 🔴 Not Created |
| 55 | **Create Inactivity Feature** | Days since order | Task 54 | 🔴 Not Created |
| 56 | **Create Frequency Drop** | Declining orders | Task 54 | 🔴 Not Created |
| 57 | **Create AOV Drop** | Declining spend | Task 54 | 🔴 Not Created |
| 58 | **Create Engagement Feature** | Site activity | Task 54 | 🔴 Not Created |
| 59 | **Create Support Tickets** | Complaint history | Task 54 | 🔴 Not Created |
| 60 | **Create Classification Model** | Random Forest | Task 59 | 🔴 Not Created |
| 61 | **Create Training Pipeline** | Train classifier | Task 60 | 🔴 Not Created |
| 62 | **Create Churn Probability** | 0-100% risk | Task 61 | 🔴 Not Created |
| 63 | **Create Risk Tiers** | High/Medium/Low | Task 62 | 🔴 Not Created |
| 64 | **Create ChurnRisk Model** | Store risk | Task 63 | 🔴 Not Created |
| 65 | **Create Risk Scheduler** | Weekly update | Task 64 | 🔴 Not Created |
| 66 | **Create Churn API** | Get churn data | Task 65 | 🔴 Not Created |
| 67 | **Create At-Risk List** | High-risk list | Task 66 | 🔴 Not Created |
| 68 | **Verify Churn Prediction** | Test accuracy | Task 67 | 🔴 Not Created |

---

### Group E: Insights Dashboard (Tasks 69-82)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 69 | **Create Dashboard Layout** | Insights layout | Task 68 | 🔴 Not Created |
| 70 | **Create Overview Page** | Summary stats | Task 69 | 🔴 Not Created |
| 71 | **Create Segment Chart** | Pie chart | Task 70 | 🔴 Not Created |
| 72 | **Create Segment Table** | Segment list | Task 71 | 🔴 Not Created |
| 73 | **Create LTV Chart** | LTV distribution | Task 72 | 🔴 Not Created |
| 74 | **Create Churn Chart** | Risk distribution | Task 73 | 🔴 Not Created |
| 75 | **Create Customer Detail** | Individual view | Task 74 | 🔴 Not Created |
| 76 | **Create Timeline View** | Purchase timeline | Task 75 | 🔴 Not Created |
| 77 | **Create Cohort View** | Cohort analysis | Task 76 | 🔴 Not Created |
| 78 | **Create Cohort Chart** | Retention curve | Task 77 | 🔴 Not Created |
| 79 | **Create Filter Controls** | Segment/date filter | Task 78 | 🔴 Not Created |
| 80 | **Create Export CSV** | Export data | Task 79 | 🔴 Not Created |
| 81 | **Create Export PDF** | Export report | Task 80 | 🔴 Not Created |
| 82 | **Verify Dashboard** | Test dashboard | Task 81 | 🔴 Not Created |

---

### Group F: Automation & Testing (Tasks 83-92)

| Task # | Task Name | Description | Dependencies | Status |
|--------|-----------|-------------|--------------|--------|
| 83 | **Create Automation Triggers** | Event triggers | Task 82 | 🔴 Not Created |
| 84 | **Create Churn Alert** | High-risk alert | Task 83 | 🔴 Not Created |
| 85 | **Create Win-Back Trigger** | Lost customer | Task 84 | 🔴 Not Created |
| 86 | **Create VIP Alert** | Champion customer | Task 85 | 🔴 Not Created |
| 87 | **Create Birthday Trigger** | Birthday promo | Task 86 | 🔴 Not Created |
| 88 | **Create Webhook Dispatcher** | Send to external | Task 87 | 🔴 Not Created |
| 89 | **Create Unit Tests** | Model tests | Task 88 | 🔴 Not Created |
| 90 | **Create Integration Tests** | E2E tests | Task 89 | 🔴 Not Created |
| 91 | **Create Accuracy Tests** | Model accuracy | Task 90 | 🔴 Not Created |
| 92 | **Create Documentation** | Insights docs | Task 91 | 🔴 Not Created |

---

## Expected Final Structure

```
backend/
└── apps/
    └── customer_insights/
        ├── __init__.py
        ├── models/
        │   ├── __init__.py
        │   ├── customer_metrics.py           # Metrics (Task 01)
        │   ├── customer_segment.py           # Segments (Task 29)
        │   ├── customer_ltv.py               # LTV (Task 47)
        │   └── churn_risk.py                 # Churn (Task 64)
        ├── analytics/
        │   ├── __init__.py
        │   ├── aggregator.py                 # Data prep (Task 03)
        │   ├── rfm.py                        # RFM (Task 17)
        │   ├── ltv_predictor.py              # LTV (Task 35)
        │   └── churn_predictor.py            # Churn (Task 53)
        ├── automation/
        │   ├── __init__.py
        │   ├── triggers.py                   # Triggers (Task 83)
        │   └── webhook.py                    # Dispatcher (Task 88)
        ├── api/
        │   ├── views.py                      # API views
        │   ├── serializers.py                # Serializers
        │   └── urls.py                       # Routes
        └── tasks.py                          # Celery tasks

frontend/
└── components/
    └── insights/
        ├── InsightsDashboard.tsx             # Dashboard (Task 69)
        ├── OverviewPage.tsx                  # Overview (Task 70)
        ├── CustomerDetail.tsx                # Detail (Task 75)
        ├── CohortView.tsx                    # Cohort (Task 77)
        └── charts/
            ├── SegmentChart.tsx              # Segments (Task 71)
            ├── LTVChart.tsx                  # LTV (Task 73)
            ├── ChurnChart.tsx                # Churn (Task 74)
            └── CohortChart.tsx               # Retention (Task 78)
```

---

## Progress Tracking

| Group | Name | Tasks | Completed | Progress |
|-------|------|-------|-----------|----------|
| A | Data Preparation | 16 | 0 | 0% |
| B | RFM Segmentation | 18 | 0 | 0% |
| C | LTV Prediction | 18 | 0 | 0% |
| D | Churn Prediction | 16 | 0 | 0% |
| E | Insights Dashboard | 14 | 0 | 0% |
| F | Automation & Testing | 10 | 0 | 0% |
| **Total** | | **92** | **0** | **0%** |

---

## RFM Segments

| Segment | R Score | F Score | M Score | Description |
|---------|---------|---------|---------|-------------|
| Champions | 4-5 | 4-5 | 4-5 | Best customers |
| Loyal | 2-5 | 3-5 | 3-5 | Frequent buyers |
| Promising | 3-4 | 1-3 | 1-3 | Recent buyers |
| At Risk | 2-3 | 2-4 | 2-4 | Declining activity |
| Lost | 1-2 | 1-2 | 1-2 | Inactive customers |
| New | 4-5 | 1 | 1-2 | First-time buyers |

---

## LTV Tiers

| Tier | LTV Range (LKR) | Action |
|------|-----------------|--------|
| Platinum | > 500,000 | VIP treatment |
| Gold | 200,000 - 500,000 | Loyalty rewards |
| Silver | 50,000 - 200,000 | Engagement campaigns |
| Bronze | < 50,000 | Nurture programs |

---

## Churn Risk Levels

| Risk Level | Probability | Action |
|------------|-------------|--------|
| Critical | > 80% | Immediate outreach |
| High | 50-80% | Win-back campaign |
| Medium | 20-50% | Engagement email |
| Low | < 20% | Regular communication |

---

## Automation Triggers

| Trigger | Condition | Action |
|---------|-----------|--------|
| Churn Alert | Risk > 70% | Notify owner |
| Win-Back | Inactive 60+ days | Send offer |
| VIP Alert | New Champion | Notify owner |
| Birthday | Birthday tomorrow | Send promo |
| Anniversary | 1 year customer | Send reward |

---

## Notes for AI Agents

1. **Execute tasks in order** - Follow Group A → F sequence
2. **RFM** - Quintile scoring (1-5)
3. **LTV** - XGBoost regression model
4. **Churn** - Random Forest classifier
5. **Weekly updates** - Run predictions weekly
6. **Cohort analysis** - Monthly cohorts
7. **Automation** - Webhook triggers to external
8. **Export** - CSV and PDF reports
9. **Multi-tenant** - Per-tenant predictions
10. **FINAL SUBPHASE** - Phase 10 Complete! 🎉
