# Group A: Data Collection

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 11 - Platform Analytics AI  
> **Group:** A of F  
> **Tasks Covered:** 01-16  
> **Group Goal:** Implement data collection for platform analytics

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous SubPhase:** [SubPhase-10_Advanced-Image-Optimization](../../SubPhase-10_Advanced-Image-Optimization/)
- **→ Next Group:** [Group-B_Health-Scoring](../Group-B_Health-Scoring/)

---

## Group Overview

This group implements data collection. Creates UsageLog Model with Log Fields. Creates Request Logger and Response Logger middleware. Creates Error Logger. Creates TransactionEvent with Event Types and Event Publisher. Creates SystemMetrics Model with CPU Collector, Memory Collector, Storage Collector, and DB Metrics. Creates Metrics Scheduler and Data Aggregator. Verifies Collection.

### Key Outcomes

- UsageLog Model
- Log Fields
- Request Logger
- Response Logger
- Error Logger
- TransactionEvent
- Event Types
- Event Publisher
- SystemMetrics Model
- CPU Collector
- Memory Collector
- Storage Collector
- DB Metrics
- Metrics Scheduler
- Data Aggregator
- Collection verified

### Technology Context

- **Logging:** Django middleware
- **Events:** Celery async
- **Metrics:** psutil
- **Storage:** PostgreSQL

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-01-08_Usage-Events.md` | Create usage logs and events | 01-08 |
| 02 | `02_Tasks-09-16_Metrics-Aggregator.md` | Create metrics and aggregator | 09-16 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 01 | Create UsageLog Model | Medium | None |
| 02 | Create Log Fields | Low | Task 01 |
| 03 | Create Request Logger | Medium | Task 02 |
| 04 | Create Response Logger | Low | Task 03 |
| 05 | Create Error Logger | Low | Task 04 |
| 06 | Create TransactionEvent | Medium | Task 05 |
| 07 | Create Event Types | Low | Task 06 |
| 08 | Create Event Publisher | Medium | Task 07 |
| 09 | Create SystemMetrics Model | Medium | Task 08 |
| 10 | Create CPU Collector | Low | Task 09 |
| 11 | Create Memory Collector | Low | Task 10 |
| 12 | Create Storage Collector | Low | Task 11 |
| 13 | Create DB Metrics | Medium | Task 12 |
| 14 | Create Metrics Scheduler | Low | Task 13 |
| 15 | Create Data Aggregator | Medium | Task 14 |
| 16 | Verify Collection | Low | Task 15 |

---

## Execution Order

```
Task 01: UsageLog Model
    │
    ▼
Task 02: Log Fields
    │
    ▼
Task 03: Request Logger
    │
    ▼
Task 04: Response Logger
    │
    ▼
Task 05: Error Logger
    │
    ▼
Task 06: TransactionEvent
    │
    ▼
Task 07: Event Types
    │
    ▼
Task 08: Event Publisher
    │
    ▼
Task 09: SystemMetrics Model
    │
    ├────────┬────────┬────────┐
    ▼        ▼        ▼        ▼
T-10      T-11      T-12      T-13
(CPU)   (Memory) (Storage)  (DB)
    │        │        │        │
    └────────┴────────┴────────┘
                  │
                  ▼
           Task 14: Metrics Scheduler
                  │
                  ▼
           Task 15: Data Aggregator
                  │
                  ▼
           Task 16: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── platform_analytics/
        ├── models/
        │   ├── usage_log.py
        │   ├── transaction_event.py
        │   └── system_metrics.py
        └── collectors/
            ├── usage.py
            ├── metrics.py
            └── aggregator.py
```

---

## Notes for AI Agents

### UsageLog Model (Task 01)
| Model | UsageLog |
|-------|----------|
| Purpose | Track API usage |

### Log Fields (Task 02)
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Log ID |
| tenant_id | string | Tenant |
| user_id | string | User |
| endpoint | string | API path |
| method | string | GET/POST/etc |
| status_code | int | Response code |
| response_time | int | ms |
| request_size | int | bytes |
| response_size | int | bytes |
| ip_address | string | Client IP |
| user_agent | string | Browser |
| timestamp | datetime | When |

### Request Logger (Task 03)
| Middleware | UsageLogMiddleware |
|------------|-------------------|
| Hook | process_request |

### Response Logger (Task 04)
| Hook | process_response |
|------|------------------|
| Log | Status, time, size |

### Error Logger (Task 05)
| Hook | process_exception |
|------|-------------------|
| Log | Error type, trace |

### TransactionEvent (Task 06)
| Model | TransactionEvent |
|-------|------------------|
| Purpose | Business events |

### Event Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Event ID |
| tenant_id | string | Tenant |
| event_type | string | Type |
| entity_type | string | order, product |
| entity_id | string | Record ID |
| amount | decimal | If applicable |
| metadata | JSON | Extra data |
| timestamp | datetime | When |

### Event Types (Task 07)
| Event | Description |
|-------|-------------|
| SALE | Sale completed |
| REFUND | Refund processed |
| VOID | Transaction voided |
| LOGIN | User login |
| SIGNUP | New user |
| ORDER | Order placed |

### Event Publisher (Task 08)
| Method | publish_event(event) |
|--------|----------------------|
| Async | Celery task |

### SystemMetrics Model (Task 09)
| Model | SystemMetrics |
|-------|---------------|

### SystemMetrics Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Metric ID |
| tenant_id | string | Tenant (or null) |
| metric_type | string | cpu/memory/etc |
| value | decimal | Value |
| unit | string | %/MB/etc |
| timestamp | datetime | When |

### CPU Collector (Task 10)
| Library | psutil |
|---------|--------|
| Metric | cpu_percent |

### Memory Collector (Task 11)
| Metric | memory_percent |
|--------|----------------|
| Also | memory_used_mb |

### Storage Collector (Task 12)
| Metric | disk_usage |
|--------|------------|
| Per | Tenant storage |

### DB Metrics (Task 13)
| Metric | Query stats |
|--------|-------------|
| Track | Slow queries |
| Track | Connection pool |

### Metrics Scheduler (Task 14)
| Schedule | Every 5 minutes |
|----------|-----------------|
| Task | Celery beat |

### Data Aggregator (Task 15)
| Method | aggregate(period) |
|--------|-------------------|
| Periods | hourly, daily |

### Aggregation Output
| Period | Table |
|--------|-------|
| Hourly | usage_hourly |
| Daily | usage_daily |
| Monthly | usage_monthly |
