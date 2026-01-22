# Group E: Fallback & Reliability

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 09 - Domex & Other Couriers  
> **Group:** E of F  
> **Tasks Covered:** 73-82  
> **Group Goal:** Implement fallback logic and courier reliability monitoring

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-D_Courier-Comparison](../Group-D_Courier-Comparison/)
- **→ Next Group:** [Group-F_Frontend-Testing](../Group-F_Frontend-Testing/)

---

## Group Overview

This group implements fallback and reliability. Creates courier priority order for fallback selection. Creates health check to ping courier APIs. Creates zone availability check to verify courier covers destination. Creates auto fallback logic to switch couriers on failure. Creates fallback logging. Creates retry with fallback logic. Creates CourierStatus model to track courier API status. Creates status dashboard in admin. Creates alert on failure notifications. Verifies fallback logic.

### Key Outcomes

- Courier priority order
- Health check service
- Availability check
- Auto fallback logic
- Fallback logging
- Retry with fallback
- CourierStatus model
- Status dashboard
- Alert on failure
- Fallback logic verified

### Technology Context

- **Fallback:** Automatic switching
- **Health check:** Periodic API pings
- **Priority:** Configurable order
- **Alerts:** Email/SMS on failure

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-73-78_Fallback-Logic.md` | Create fallback logic | 73-78 |
| 02 | `02_Tasks-79-82_Status-Alert-Verify.md` | Create status and alerts | 79-82 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 73 | Create Courier Priority | Low | Task 72 |
| 74 | Create Health Check | Medium | Task 73 |
| 75 | Create Availability Check | Medium | Task 74 |
| 76 | Create Auto Fallback | High | Task 75 |
| 77 | Create Fallback Logging | Low | Task 76 |
| 78 | Create Retry with Fallback | Medium | Task 76 |
| 79 | Create CourierStatus Model | Medium | Task 74 |
| 80 | Create Status Dashboard | Medium | Task 79 |
| 81 | Create Alert on Failure | Medium | Task 79 |
| 82 | Verify Fallback Logic | Low | Task 81 |

---

## Execution Order

```
Task 73: Courier Priority
    │
    ▼
Task 74: Health Check
    │
    ├─────────┐
    ▼         ▼
T-75       T-79
(Avail)  (Status)
    │         │
    ▼         ├─────────┐
T-76         ▼         ▼
(Auto)     T-80      T-81
    │    (Dash)   (Alert)
    ├─────────┐         │
    ▼         ▼         │
T-77       T-78        │
(Log)    (Retry)       │
    │         │         │
    └─────────┴─────────┘
              │
              ▼
        Task 82: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── shipping/
        ├── services/
        │   ├── fallback.py
        │   └── health_check.py
        ├── models/
        │   └── courier_status.py
        └── admin/
            └── status_admin.py
```

---

## Notes for AI Agents

### Courier Priority (Task 73)
| Order | Courier |
|-------|---------|
| 1 | Preferred (tenant setting) |
| 2 | Koombiyo |
| 3 | Domex |
| 4 | Prompt X |
| 5 | Royal Express |
| 6 | Trance Express |

### Health Check (Task 74)
| Action | Ping courier API |
|--------|------------------|
| Method | GET /health or similar |
| Timeout | 5 seconds |
| Frequency | Every 5 minutes |

### Availability Check (Task 75)
| Check | Courier covers zone |
|-------|---------------------|
| Input | destination city/district |
| Return | Boolean |

### Auto Fallback (Task 76)
| Trigger | API failure |
|---------|-------------|
| Action | Try next in priority |
| Max attempts | 3 couriers |

### Fallback Flow
| Step | Action |
|------|--------|
| 1 | Try preferred courier |
| 2 | On failure, try next |
| 3 | Continue until success |
| 4 | All fail → raise error |

### Fallback Logging (Task 77)
| Log | Fallback events |
|-----|-----------------|
| Fields | from_courier, to_courier, reason |
| Level | WARNING |

### Retry with Fallback (Task 78)
| First | Retry same courier (3x) |
|-------|-------------------------|
| Then | Fallback to next |
| Backoff | Exponential |

### CourierStatus Model (Task 79)
| Field | Type |
|-------|------|
| courier | CharField |
| is_healthy | BooleanField |
| last_check | DateTimeField |
| last_success | DateTimeField |
| error_count | IntegerField |

### Status Dashboard (Task 80)
| View | Admin courier status |
|------|----------------------|
| Display | Health indicators |
| Actions | Manual health check |

### Alert on Failure (Task 81)
| Trigger | Courier down |
|---------|--------------|
| Threshold | 3 consecutive failures |
| Notify | Admin email/SMS |

### Reliability Metrics
| Metric | Description |
|--------|-------------|
| Uptime | % successful calls |
| Response time | Average API latency |
| Error rate | Failed calls per day |
