# Group E: Admin Dashboard

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 11 - Platform Analytics AI  
> **Group:** E of F  
> **Tasks Covered:** 67-80  
> **Group Goal:** Create platform admin dashboard

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Fraud-Detection](../Group-D_Fraud-Detection/)
- **→ Next Group:** [Group-F_Alerts-Testing](../Group-F_Alerts-Testing/)

---

## Group Overview

This group creates the admin dashboard. Creates Dashboard Layout and Overview Page with KPI Cards. Creates Tenant List with Health Column. Creates Tenant Detail page. Creates Health Chart, Usage Chart, Anomaly Panel, Fraud Panel, and Resource Chart. Creates Export Report and Filter Controls. Verifies Dashboard.

### Key Outcomes

- Dashboard Layout
- Overview Page
- KPI Cards
- Tenant List
- Health Column
- Tenant Detail
- Health Chart
- Usage Chart
- Anomaly Panel
- Fraud Panel
- Resource Chart
- Export Report
- Filter Controls
- Dashboard verified

### Technology Context

- **Framework:** Next.js
- **Charts:** Recharts
- **Access:** Platform admin only
- **Data:** Real-time + historical

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-67-80_Dashboard-Components.md` | Create dashboard components | 67-80 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 67 | Create Dashboard Layout | Medium | Task 66 |
| 68 | Create Overview Page | Medium | Task 67 |
| 69 | Create KPI Cards | Low | Task 68 |
| 70 | Create Tenant List | Medium | Task 69 |
| 71 | Create Health Column | Low | Task 70 |
| 72 | Create Tenant Detail | Medium | Task 71 |
| 73 | Create Health Chart | Medium | Task 72 |
| 74 | Create Usage Chart | Medium | Task 73 |
| 75 | Create Anomaly Panel | Medium | Task 74 |
| 76 | Create Fraud Panel | Medium | Task 75 |
| 77 | Create Resource Chart | Medium | Task 76 |
| 78 | Create Export Report | Low | Task 77 |
| 79 | Create Filter Controls | Low | Task 78 |
| 80 | Verify Dashboard | Low | Task 79 |

---

## Execution Order

```
Task 67: Dashboard Layout
    │
    ▼
Task 68: Overview Page
    │
    ▼
Task 69: KPI Cards
    │
    ▼
Task 70: Tenant List
    │
    ▼
Task 71: Health Column
    │
    ▼
Task 72: Tenant Detail
    │
    ├───┬───┬───┬───┐
    ▼   ▼   ▼   ▼   ▼
T-73  T-74  T-75  T-76  T-77
(Health)(Use)(Anom)(Fraud)(Res)
    │   │   │   │   │
    └───┴───┴───┴───┘
              │
              ▼
       Task 78: Export Report
              │
              ▼
       Task 79: Filter Controls
              │
              ▼
       Task 80: Verify
```

---

## Expected Deliverables

```
frontend/
└── components/
    └── admin/
        └── platform/
            ├── PlatformDashboard.tsx
            ├── OverviewPage.tsx
            ├── KPICards.tsx
            ├── TenantList.tsx
            ├── TenantDetail.tsx
            ├── AnomalyPanel.tsx
            ├── FraudPanel.tsx
            └── charts/
                ├── HealthChart.tsx
                ├── UsageChart.tsx
                └── ResourceChart.tsx
```

---

## Notes for AI Agents

### Dashboard Layout (Task 67)
| Component | PlatformDashboard |
|-----------|-------------------|
| Layout | Sidebar + main |
| Access | Super admin only |

### Layout Sections
| Section | Content |
|---------|---------|
| Sidebar | Navigation |
| Header | Title, user |
| Main | Page content |

### Overview Page (Task 68)
| Component | OverviewPage |
|-----------|--------------|
| Purpose | Platform summary |

### Overview Sections
| Section | Content |
|---------|---------|
| KPIs | Key metrics |
| Health dist | Tenant health |
| Alerts | Recent alerts |
| Activity | Recent activity |

### KPI Cards (Task 69)
| Component | KPICards |
|-----------|----------|

### KPI Metrics
| KPI | Description |
|-----|-------------|
| Total Tenants | Active tenant count |
| Total GMV | Platform GMV |
| Healthy % | Healthy tenants |
| Active Users | DAU across platform |
| Open Anomalies | Unresolved |
| Fraud Alerts | Pending review |

### Tenant List (Task 70)
| Component | TenantList |
|-----------|------------|
| Features | Sort, filter, search |

### List Columns
| Column | Description |
|--------|-------------|
| Name | Tenant name |
| Plan | Subscription |
| Health | Health score |
| GMV | Monthly GMV |
| Users | Active users |
| Status | Active/Inactive |

### Health Column (Task 71)
| Display | Color-coded badge |
|---------|-------------------|

### Health Colors
| Category | Color |
|----------|-------|
| Healthy | Green |
| Stable | Blue |
| At Risk | Yellow |
| Critical | Orange |
| Churning | Red |

### Tenant Detail (Task 72)
| Component | TenantDetail |
|-----------|--------------|
| View | Single tenant |

### Detail Sections
| Section | Content |
|---------|---------|
| Info | Tenant details |
| Health | Score breakdown |
| Charts | Usage, revenue |
| Alerts | Anomalies, fraud |

### Health Chart (Task 73)
| Component | HealthChart |
|-----------|-------------|
| Type | Line chart |
| Data | 30-day history |

### Usage Chart (Task 74)
| Component | UsageChart |
|-----------|------------|
| Type | Area chart |
| Metrics | API calls, users |

### Anomaly Panel (Task 75)
| Component | AnomalyPanel |
|-----------|--------------|
| List | Recent anomalies |

### Panel Columns
| Column | Description |
|--------|-------------|
| Type | Anomaly type |
| Severity | Level |
| Metric | Affected |
| Time | When detected |
| Status | Open/resolved |

### Fraud Panel (Task 76)
| Component | FraudPanel |
|-----------|------------|
| List | Fraud alerts |

### Fraud Columns
| Column | Description |
|--------|-------------|
| Transaction | ID |
| Risk | Score |
| Rules | Triggered |
| Status | Pending/reviewed |
| Action | Take action |

### Resource Chart (Task 77)
| Component | ResourceChart |
|-----------|---------------|
| Metrics | CPU, Memory, Storage |
| Type | Multi-line |

### Export Report (Task 78)
| Formats | CSV, PDF |
|---------|----------|
| Content | Selected data |

### Filter Controls (Task 79)
| Controls | Date range, tenant |
|----------|-------------------|

### Filter Options
| Filter | Type |
|--------|------|
| Date range | Picker |
| Tenant | Dropdown |
| Health | Multi-select |
| Status | Toggle |
