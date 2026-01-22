# Group D: Delivery & Collection

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** D of F  
> **Tasks Covered:** 49-62  
> **Group Goal:** Implement delivery tracking and cash collection workflow

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Risk-Management](../Group-C_Risk-Management/)
- **→ Next Group:** [Group-E_Reconciliation-Reports](../Group-E_Reconciliation-Reports/)

---

## Group Overview

This group implements delivery and collection tracking. Creates CODCollection model with order foreign key, expected collection amount, actual collected amount, collection status (pending/collected/failed), collection date, agent reference, and collection notes. Creates DeliveryAttempt model with attempt status (delivered/failed/rescheduled), failure reason codes, and max attempts limit of 3. Creates reschedule logic for customer rescheduling. Verifies delivery collection flow.

### Key Outcomes

- CODCollection model
- Order foreign key
- Expected collection amount
- Actual collected amount
- Collection status
- Collection date
- Agent reference
- Collection notes
- DeliveryAttempt model
- Attempt status
- Failure reason
- Max attempts (3)
- Reschedule logic
- Delivery collection verified

### Technology Context

- **Collection:** Cash tracking
- **Attempts:** Max 3 deliveries
- **Agent:** Delivery agent ID
- **Reschedule:** Customer option

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-49-56_Collection-Model.md` | Create collection model and fields | 49-56 |
| 02 | `02_Tasks-57-62_Attempt-Reschedule-Verify.md` | Create attempts and reschedule | 57-62 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 49 | Create CODCollection Model | Medium | Task 48 |
| 50 | Create Collection Order FK | Low | Task 49 |
| 51 | Create Collection Amount | Low | Task 49 |
| 52 | Create Collected Amount | Low | Task 49 |
| 53 | Create Collection Status | Low | Task 49 |
| 54 | Create Collection Date | Low | Task 49 |
| 55 | Create Agent Reference | Low | Task 49 |
| 56 | Create Collection Notes | Low | Task 49 |
| 57 | Create Delivery Attempt Model | Medium | Task 48 |
| 58 | Create Attempt Status | Low | Task 57 |
| 59 | Create Failure Reason | Low | Task 58 |
| 60 | Create Max Attempts | Low | Task 57 |
| 61 | Create Reschedule Logic | Medium | Task 60 |
| 62 | Verify Delivery Collection | Low | Task 61 |

---

## Execution Order

```
Task 49: CODCollection Model
    │
    ├────────┬────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼        ▼
T-50     T-51     T-52     T-53     T-54     T-55     T-56
(Order)(Expect)(Actual)(Status)(Date) (Agent)(Notes)
    │        │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┴────────┘
                              │
                              ▼
                   Task 57: DeliveryAttempt Model
                              │
                    ┌─────────┴─────────┬────────┐
                    ▼                   ▼        ▼
                 T-58                T-60
              (Status)              (Max)
                    │                   │
                    ▼                   ▼
                 T-59                T-61
              (Reason)           (Reschedule)
                    │                   │
                    └─────────┬─────────┘
                              │
                              ▼
                        Task 62: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── models/
        │   ├── cod_collection.py
        │   └── delivery_attempt.py
        └── services/
            └── delivery_service.py
```

---

## Notes for AI Agents

### CODCollection Model (Task 49)
| Field | Type |
|-------|------|
| order | ForeignKey |
| expected_amount | DecimalField |
| collected_amount | DecimalField |
| status | CharField (choices) |
| collection_date | DateTimeField |

### Collection Order FK (Task 50)
| Field | Type |
|-------|------|
| Name | order |
| Related | Order model |
| On delete | PROTECT |

### Collection Amount (Task 51)
| Field | Type |
|-------|------|
| Name | expected_amount |
| Use | Amount to collect |
| Include | Order total + COD fee |

### Collected Amount (Task 52)
| Field | Type |
|-------|------|
| Name | collected_amount |
| Use | Actual amount collected |
| Default | 0.00 |

### Collection Status (Task 53)
| Status | Description |
|--------|-------------|
| PENDING | Awaiting collection |
| COLLECTED | Cash collected |
| FAILED | Collection failed |
| PARTIAL | Partial collection |

### Collection Date (Task 54)
| Field | Type |
|-------|------|
| Name | collection_date |
| Auto | Set on collection |
| Null | True until collected |

### Agent Reference (Task 55)
| Field | Type |
|-------|------|
| Name | agent_reference |
| Use | Delivery agent ID |
| Source | Courier API |

### Collection Notes (Task 56)
| Field | Type |
|-------|------|
| Name | notes |
| Use | Agent notes |
| Max length | 500 |

### DeliveryAttempt Model (Task 57)
| Field | Type |
|-------|------|
| collection | ForeignKey |
| attempt_number | IntegerField |
| status | CharField (choices) |
| attempted_at | DateTimeField |

### Attempt Status (Task 58)
| Status | Description |
|--------|-------------|
| DELIVERED | Successfully delivered |
| FAILED | Delivery failed |
| RESCHEDULED | Customer rescheduled |

### Failure Reason (Task 59)
| Reason | Code |
|--------|------|
| CUSTOMER_UNAVAILABLE | Customer not available |
| WRONG_ADDRESS | Address incorrect |
| CUSTOMER_REFUSED | Customer refused |
| INSUFFICIENT_CASH | Customer has no cash |
| OTHER | Other reason |

### Max Attempts (Task 60)
| Setting | Value |
|---------|-------|
| Max | 3 attempts |
| After max | Return to sender |

### Reschedule Logic (Task 61)
| Feature | Description |
|---------|-------------|
| Allowed | Before max attempts |
| Customer | Can reschedule once |
| New date | Within 7 days |
