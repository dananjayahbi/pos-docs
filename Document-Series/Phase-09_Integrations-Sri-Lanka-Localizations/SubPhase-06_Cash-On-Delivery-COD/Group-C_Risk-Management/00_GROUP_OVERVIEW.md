# Group C: Risk Management

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 06 - Cash on Delivery (COD)  
> **Group:** C of F  
> **Tasks Covered:** 33-48  
> **Group Goal:** Implement OTP verification and COD risk management

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_COD-Processor-Implementation](../Group-B_COD-Processor-Implementation/)
- **→ Next Group:** [Group-D_Delivery-Collection](../Group-D_Delivery-Collection/)

---

## Group Overview

This group implements COD risk management. Creates OTP verification service with generate, send SMS, and verify methods. Creates OTP expiry of 10 minutes and retry limit of 3 attempts. Creates Sri Lanka phone validation. Creates address verification for basic checks. Creates blacklist check and CODBlacklist model for blocked phones and addresses. Creates previous COD order check and success rate calculation. Creates dynamic COD limit based on customer history. Creates risk score calculation and risk threshold for blocking high-risk orders. Verifies risk management.

### Key Outcomes

- OTP verification service
- OTP generate (6-digit)
- OTP send SMS
- OTP verify
- OTP expiry (10 mins)
- OTP retry limit (3)
- Sri Lanka phone validation
- Address verification
- Blacklist check
- CODBlacklist model
- Previous COD check
- Success rate calculation
- Dynamic COD limit
- Risk score
- Risk threshold
- Risk management verified

### Technology Context

- **OTP:** SMS gateway
- **Phone:** +94 format
- **Risk:** Score-based blocking
- **History:** Customer COD history

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-33-40_OTP-Phone-Address.md` | Create OTP and verification | 33-40 |
| 02 | `02_Tasks-41-48_Blacklist-Risk-Verify.md` | Create blacklist and risk scoring | 41-48 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 33 | Create OTP Verification Service | High | Task 32 |
| 34 | Create OTP Generate | Low | Task 33 |
| 35 | Create OTP Send SMS | Medium | Task 34 |
| 36 | Create OTP Verify | Medium | Task 33 |
| 37 | Create OTP Expiry | Low | Task 33 |
| 38 | Create OTP Retry Limit | Low | Task 33 |
| 39 | Create Phone Validation | Low | Task 33 |
| 40 | Create Address Verification | Medium | Task 32 |
| 41 | Create Blacklist Check | Medium | Task 32 |
| 42 | Create CODBlacklist Model | Medium | Task 41 |
| 43 | Create Previous COD Check | Medium | Task 32 |
| 44 | Create Success Rate Check | Medium | Task 43 |
| 45 | Create Dynamic COD Limit | Medium | Task 44 |
| 46 | Create Risk Score | High | Task 45 |
| 47 | Create Risk Threshold | Medium | Task 46 |
| 48 | Verify Risk Management | Low | Task 47 |

---

## Execution Order

```
Task 33: OTP Verification Service
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-34     T-36     T-37     T-38     T-39
(Gen)  (Verify)(Expiry)(Retry)(Phone)
    │        │        │        │        │
    ▼        │        │        │        │
T-35     │        │        │        │
(SMS)    │        │        │        │
    │        │        │        │        │
    └────────┴────────┴────────┴────────┘
                    │
    ┌───────────────┼───────────────┐
    ▼               ▼               ▼
T-40           T-41           T-43
(Addr)      (BlackChk)     (PrevCOD)
    │               │               │
    │               ▼               ▼
    │             T-42           T-44
    │           (Model)        (Rate)
    │               │               │
    │               │               ▼
    │               │             T-45
    │               │           (Limit)
    │               │               │
    └───────────────┴───────────────┘
                    │
                    ▼
              Task 46: Risk Score
                    │
                    ▼
              Task 47: Risk Threshold
                    │
                    ▼
              Task 48: Verify
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── payments/
        ├── processors/
        │   └── cod/
        │       └── risk.py
        ├── models/
        │   └── cod_blacklist.py
        └── services/
            └── otp_service.py
```

---

## Notes for AI Agents

### OTP Verification Service (Task 33)
| Method | Description |
|--------|-------------|
| generate | Create 6-digit OTP |
| send | Send via SMS |
| verify | Validate OTP |

### OTP Generate (Task 34)
| Format | 6 digits |
|--------|----------|
| Range | 100000-999999 |
| Store | Redis with expiry |

### OTP Send SMS (Task 35)
| Gateway | SMS integration |
|---------|-----------------|
| Template | "Your COD verification OTP: {otp}" |
| Phone | +94 format |

### OTP Verify (Task 36)
| Input | phone, otp |
|-------|------------|
| Check | Match stored OTP |
| Output | True/False |

### OTP Expiry (Task 37)
| Duration | 10 minutes |
|----------|------------|
| Storage | Redis TTL |

### OTP Retry Limit (Task 38)
| Max attempts | 3 |
|--------------|---|
| Lockout | 30 minutes |

### Phone Validation (Task 39)
| Format | +94XXXXXXXXX |
|--------|--------------|
| Mobile | 07X XXX XXXX |
| Regex | /^\\+94[0-9]{9}$/ |

### Address Verification (Task 40)
| Check | Basic validation |
|-------|-----------------|
| District | Valid Sri Lanka district |
| Postal code | Valid format |

### Blacklist Check (Task 41)
| Check | Phone and address |
|-------|-------------------|
| Block | Blacklisted entries |

### CODBlacklist Model (Task 42)
| Field | Type |
|-------|------|
| tenant | ForeignKey |
| phone | CharField |
| address_hash | CharField |
| reason | TextField |
| blocked_at | DateTimeField |

### Previous COD Check (Task 43)
| Check | Past COD orders |
|-------|-----------------|
| Query | Customer COD history |
| Count | Total, success, failed |

### Success Rate Check (Task 44)
| Calculate | success / total |
|-----------|-----------------|
| Threshold | Below 50% = high risk |

### Dynamic COD Limit (Task 45)
| History | Limit |
|---------|-------|
| New customer | First order limit |
| 1-5 successful | ₨25,000 |
| 5+ successful | ₨50,000 |
| Low success rate | ₨10,000 |

### Risk Score (Task 46)
| Factor | Weight |
|--------|--------|
| New customer | +30 |
| Low success rate | +40 |
| Address in blacklist area | +20 |
| High order value | +10 |
| Max score | 100 |

### Risk Threshold (Task 47)
| Score | Action |
|-------|--------|
| 0-40 | Allow COD |
| 41-60 | Require OTP |
| 61-80 | Lower limit |
| 81-100 | Block COD |
