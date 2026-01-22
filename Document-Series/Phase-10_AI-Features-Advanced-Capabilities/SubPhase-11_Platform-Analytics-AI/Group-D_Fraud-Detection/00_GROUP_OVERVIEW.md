# Group D: Fraud Detection

> **Phase:** 10 - AI Features & Advanced Capabilities  
> **SubPhase:** 11 - Platform Analytics AI  
> **Group:** D of F  
> **Tasks Covered:** 51-66  
> **Group Goal:** Implement fraud detection system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-C_Anomaly-Detection](../Group-C_Anomaly-Detection/)
- **→ Next Group:** [Group-E_Admin-Dashboard](../Group-E_Admin-Dashboard/)

---

## Group Overview

This group implements fraud detection. Creates FraudDetector Class with Fraud Rules. Creates Velocity Check, Amount Check, Pattern Check, IP Check, and Device Check. Creates ML Fraud Model with Fraud Features and Training Pipeline. Creates Risk Score. Creates FraudAlert Model with Alert Actions and Whitelist. Creates Fraud API. Verifies Fraud Detection.

### Key Outcomes

- FraudDetector Class
- Fraud Rules
- Velocity Check
- Amount Check
- Pattern Check
- IP Check
- Device Check
- ML Fraud Model
- Fraud Features
- Training Pipeline
- Risk Score
- FraudAlert Model
- Alert Actions
- Whitelist
- Fraud API
- Fraud verified

### Technology Context

- **Approach:** Rules + ML hybrid
- **ML:** Random Forest
- **Score:** 0-100 risk
- **Actions:** Block, Review

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-51-60_Rules-ML.md` | Create rules and ML model | 51-60 |
| 02 | `02_Tasks-61-66_Alerts-API.md` | Create alerts and API | 61-66 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 51 | Create FraudDetector Class | Medium | Task 50 |
| 52 | Create Fraud Rules | Medium | Task 51 |
| 53 | Create Velocity Check | Medium | Task 52 |
| 54 | Create Amount Check | Low | Task 52 |
| 55 | Create Pattern Check | Medium | Task 52 |
| 56 | Create IP Check | Medium | Task 52 |
| 57 | Create Device Check | Medium | Task 56 |
| 58 | Create ML Fraud Model | High | Task 57 |
| 59 | Create Fraud Features | Medium | Task 58 |
| 60 | Create Training Pipeline | High | Task 59 |
| 61 | Create Risk Score | Medium | Task 60 |
| 62 | Create FraudAlert Model | Medium | Task 61 |
| 63 | Create Alert Actions | Low | Task 62 |
| 64 | Create Whitelist | Low | Task 63 |
| 65 | Create Fraud API | Medium | Task 64 |
| 66 | Verify Fraud Detection | Low | Task 65 |

---

## Execution Order

```
Task 51: FraudDetector Class
    │
    ▼
Task 52: Fraud Rules
    │
    ├───┬───┬───┬───┐
    ▼   ▼   ▼   ▼   ▼
T-53  T-54  T-55  T-56
(Vel)(Amt)(Pat)(IP)
    │   │   │   │
    │   │   │   ▼
    │   │   │  T-57
    │   │   │ (Dev)
    │   │   │   │
    └───┴───┴───┘
          │
          ▼
   Task 58: ML Fraud Model
          │
          ▼
   Task 59: Fraud Features
          │
          ▼
   Task 60: Training Pipeline
          │
          ▼
   Task 61: Risk Score
          │
          ▼
   Task 62: FraudAlert Model
          │
          ▼
   Task 63: Alert Actions
          │
          ▼
   Task 64: Whitelist
          │
          ▼
   Task 65: Fraud API
          │
          ▼
   Task 66: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── platform_analytics/
        ├── models/
        │   └── fraud_alert.py
        └── analytics/
            └── fraud_detector.py
```

---

## Notes for AI Agents

### FraudDetector Class (Task 51)
| Class | FraudDetector |
|-------|---------------|
| Method | detect(transaction) |
| Return | RiskResult |

### Fraud Rules (Task 52)
| Engine | Rule-based checks |
|--------|-------------------|
| Order | Run all rules |

### Velocity Check (Task 53)
| Rule | Transaction rate |
|------|------------------|

### Velocity Thresholds
| Period | Limit |
|--------|-------|
| 1 minute | 3 transactions |
| 1 hour | 20 transactions |
| 1 day | 100 transactions |

### Amount Check (Task 54)
| Rule | Unusual amounts |
|------|-----------------|

### Amount Flags
| Condition | Flag |
|-----------|------|
| >10x avg order | High |
| Round numbers only | Medium |
| Exact limits | Medium |

### Pattern Check (Task 55)
| Rule | Suspicious patterns |
|------|---------------------|

### Pattern Flags
| Pattern | Flag |
|---------|------|
| Same amount repeatedly | High |
| Sequential amounts | Medium |
| All same product | Medium |

### IP Check (Task 56)
| Rule | IP reputation |
|------|---------------|

### IP Flags
| Check | Flag |
|-------|------|
| VPN/Proxy | Medium |
| Blacklisted | High |
| Country mismatch | Low |

### Device Check (Task 57)
| Rule | Device fingerprint |
|------|-------------------|
| Library | FingerprintJS |

### Device Flags
| Check | Flag |
|-------|------|
| New device | Low |
| Many devices | Medium |
| Emulator | High |

### ML Fraud Model (Task 58)
| Algorithm | Random Forest |
|-----------|---------------|
| Library | sklearn |

### Fraud Features (Task 59)
| Feature | Description |
|---------|-------------|
| velocity_1h | Trans in 1 hour |
| amount_zscore | Amount deviation |
| device_age | Days since first seen |
| ip_risk | IP risk score |
| user_history | Past fraud flags |
| time_of_day | Hour (0-23) |

### Training Pipeline (Task 60)
| Data | Historical transactions |
|------|------------------------|
| Labels | fraud/not_fraud |
| Split | 80/20 train/test |
| Retrain | Monthly |

### Risk Score (Task 61)
| Output | 0-100 score |
|--------|-------------|
| Combine | Rules + ML |

### Risk Levels
| Score | Level | Action |
|-------|-------|--------|
| 0-30 | Low | Allow |
| 31-60 | Medium | Review |
| 61-80 | High | Delay |
| 81-100 | Critical | Block |

### FraudAlert Model (Task 62)
| Model | FraudAlert |
|-------|------------|

### Alert Fields
| Field | Type | Description |
|-------|------|-------------|
| id | UUID | Alert ID |
| tenant_id | string | Tenant |
| transaction_id | string | Transaction |
| risk_score | int | 0-100 |
| triggered_rules | array | Rules hit |
| status | string | pending/reviewed |
| action_taken | string | Action |
| reviewed_by | string | Admin user |
| created_at | datetime | When |

### Alert Actions (Task 63)
| Action | Description |
|--------|-------------|
| ALLOW | Let through |
| BLOCK | Block transaction |
| REVIEW | Manual review |
| HOLD | Hold for 24h |

### Whitelist (Task 64)
| Purpose | Trusted entities |
|---------|------------------|
| Types | IP, device, customer |

### Fraud API (Task 65)
| Endpoint | GET /api/admin/fraud |
|----------|---------------------|
| Endpoint | POST /api/fraud/check |

### Check API Request
| Field | Description |
|-------|-------------|
| transaction | Transaction data |
| Return | Risk score + flags |
