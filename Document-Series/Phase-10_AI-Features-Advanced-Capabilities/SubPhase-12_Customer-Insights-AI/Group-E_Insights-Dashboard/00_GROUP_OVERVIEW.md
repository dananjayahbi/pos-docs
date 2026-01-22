# Group E: Insights Dashboard

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 12 - Customer Insights AI (FINAL SUBPHASE)  
> **Group:** E of F  
> **Tasks Covered:** 69-82  
> **Group Goal:** Create customer insights dashboard

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Churn-Prediction](../Group-D_Churn-Prediction/)
- **→ Next Group:** [Group-F_Automation-Testing](../Group-F_Automation-Testing/)

---

## Group Overview

This group creates the insights dashboard. Creates Dashboard Layout and Overview Page. Creates Segment Chart and Segment Table. Creates LTV Chart and Churn Chart. Creates Customer Detail with Timeline View. Creates Cohort View and Cohort Chart. Creates Filter Controls. Creates Export CSV and Export PDF. Verifies Dashboard.

### Key Outcomes

- Dashboard Layout
- Overview Page
- Segment Chart
- Segment Table
- LTV Chart
- Churn Chart
- Customer Detail
- Timeline View
- Cohort View
- Cohort Chart
- Filter Controls
- Export CSV
- Export PDF
- Dashboard verified

### Technology Context

- **Framework:** Next.js
- **Charts:** Recharts
- **Export:** CSV, PDF
- **Access:** Tenant admin

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-69-82_Dashboard-Components.md` | Create dashboard components | 69-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 69 | Create Dashboard Layout | Medium | Task 68 |
| 70 | Create Overview Page | Medium | Task 69 |
| 71 | Create Segment Chart | Medium | Task 70 |
| 72 | Create Segment Table | Medium | Task 71 |
| 73 | Create LTV Chart | Medium | Task 72 |
| 74 | Create Churn Chart | Medium | Task 73 |
| 75 | Create Customer Detail | Medium | Task 74 |
| 76 | Create Timeline View | Medium | Task 75 |
| 77 | Create Cohort View | Medium | Task 76 |
| 78 | Create Cohort Chart | Medium | Task 77 |
| 79 | Create Filter Controls | Low | Task 78 |
| 80 | Create Export CSV | Low | Task 79 |
| 81 | Create Export PDF | Medium | Task 80 |
| 82 | Verify Dashboard | Low | Task 81 |

---

## Execution Order

```
Task 69: Dashboard Layout
    │
    ▼
Task 70: Overview Page
    │
    ▼
Task 71: Segment Chart
    │
    ▼
Task 72: Segment Table
    │
    ▼
Task 73: LTV Chart
    │
    ▼
Task 74: Churn Chart
    │
    ▼
Task 75: Customer Detail
    │
    ▼
Task 76: Timeline View
    │
    ▼
Task 77: Cohort View
    │
    ▼
Task 78: Cohort Chart
    │
    ▼
Task 79: Filter Controls
    │
    ▼
Task 80: Export CSV
    │
    ▼
Task 81: Export PDF
    │
    ▼
Task 82: Verify
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── insights/
        ├── InsightsDashboard.tsx
        ├── OverviewPage.tsx
        ├── CustomerDetail.tsx
        ├── CohortView.tsx
        └── charts/
            ├── SegmentChart.tsx
            ├── LTVChart.tsx
            ├── ChurnChart.tsx
            └── CohortChart.tsx
```

---

## Notes for AI Agents

### Dashboard Layout (Task 69)
| Component | InsightsDashboard |
|-----------|-------------------|
| Layout | Sidebar + main |
| Access | Tenant admin |

### Layout Sections
| Section | Content |
|---------|---------|
| Sidebar | Navigation |
| Header | Title, filters |
| Main | Page content |

### Overview Page (Task 70)
| Component | OverviewPage |
|-----------|--------------|
| Purpose | Summary stats |

### Overview Cards
| Card | Metric |
|------|--------|
| Total Customers | Active count |
| Avg LTV | Average LTV |
| At-Risk | High-risk count |
| Champions | Champion count |

### Segment Chart (Task 71)
| Component | SegmentChart |
|-----------|--------------|
| Type | Pie chart |
| Data | Segment distribution |

### Segment Colors
| Segment | Color |
|---------|-------|
| Champions | Gold |
| Loyal | Blue |
| Promising | Green |
| At Risk | Orange |
| Lost | Red |
| New | Purple |

### Segment Table (Task 72)
| Component | SegmentTable |
|-----------|--------------|
| Type | Data table |

### Table Columns
| Column | Description |
|--------|-------------|
| Customer | Name |
| Segment | RFM segment |
| R/F/M | Scores |
| LTV | Predicted LTV |
| Risk | Churn risk |

### LTV Chart (Task 73)
| Component | LTVChart |
|-----------|----------|
| Type | Bar chart |
| Data | LTV tier distribution |

### Churn Chart (Task 74)
| Component | ChurnChart |
|-----------|------------|
| Type | Bar chart |
| Data | Risk tier distribution |

### Customer Detail (Task 75)
| Component | CustomerDetail |
|-----------|----------------|
| View | Single customer |

### Detail Sections
| Section | Content |
|---------|---------|
| Profile | Name, email, phone |
| Metrics | Orders, spend, AOV |
| Segment | RFM scores |
| LTV | Predicted LTV, tier |
| Risk | Churn probability |
| Timeline | Purchase history |

### Timeline View (Task 76)
| Component | TimelineView |
|-----------|--------------|
| Type | Vertical timeline |
| Data | Order history |

### Timeline Entry
| Field | Description |
|-------|-------------|
| Date | Order date |
| Order | Order number |
| Amount | Order total |
| Items | Item count |

### Cohort View (Task 77)
| Component | CohortView |
|-----------|------------|
| Purpose | Cohort analysis |

### Cohort Table
| Row | Cohort month |
|-----|--------------|
| Columns | Months since |
| Cell | Retention % |

### Cohort Chart (Task 78)
| Component | CohortChart |
|-----------|-------------|
| Type | Line chart |
| Data | Retention curves |

### Filter Controls (Task 79)
| Controls | Segment, date, tier |
|----------|---------------------|

### Filter Options
| Filter | Type |
|--------|------|
| Segment | Multi-select |
| Date range | Picker |
| LTV tier | Dropdown |
| Risk tier | Dropdown |
| Search | Text input |

### Export CSV (Task 80)
| Format | CSV |
|--------|-----|
| Content | Filtered data |

### CSV Columns
| Column | Description |
|--------|-------------|
| customer_id | ID |
| name | Name |
| segment | RFM segment |
| ltv | Predicted LTV |
| churn_risk | Risk % |

### Export PDF (Task 81)
| Format | PDF |
|--------|-----|
| Content | Report with charts |
| Library | jspdf, html2canvas |
