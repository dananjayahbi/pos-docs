# Group C: OTP System

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** C of F  
> **Tasks Covered:** 39-54  
> **Group Goal:** Implement OTP generation, sending, and verification system

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-B_Provider-Implementations](../Group-B_Provider-Implementations/)
- **→ Next Group:** [Group-D_Notification-Service](../Group-D_Notification-Service/)

---

## Group Overview

This group implements OTP verification. Creates OTP model with phone field, 6-digit otp_code, purpose enum (LOGIN, REGISTER, RESET, VERIFY), expires_at timestamp, attempts counter, and is_verified flag. Creates OTPService with generate_otp to create 6-digit code, send_otp to send via SMS, and verify_otp to validate code. Creates 5-minute expiry, 3-attempt limit, and 60-second resend cooldown. Creates Celery cleanup task to remove expired OTPs. Verifies OTP flow.

### Key Outcomes

- OTP model
- phone field
- otp_code field
- purpose field
- expires_at field
- attempts field
- is_verified field
- OTPService
- generate_otp method
- send_otp method
- verify_otp method
- OTP expiry (5 min)
- Max attempts (3)
- Resend cooldown (60s)
- OTP cleanup task
- OTP system verified

### Technology Context

- **OTP:** 6-digit numeric
- **Expiry:** 5 minutes default
- **Security:** 3 max attempts
- **Cooldown:** 60 seconds

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-39-48_Model-Service.md` | Create OTP model and service | 39-48 |
| 02 | `02_Tasks-49-54_Limits-Cleanup-Verify.md` | Create limits, cleanup, verify | 49-54 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 39 | Create OTP Model | Medium | Task 38 |
| 40 | Create phone Field | Low | Task 39 |
| 41 | Create otp_code Field | Low | Task 39 |
| 42 | Create purpose Field | Low | Task 39 |
| 43 | Create expires_at Field | Low | Task 39 |
| 44 | Create attempts Field | Low | Task 39 |
| 45 | Create is_verified Field | Low | Task 39 |
| 46 | Create OTPService | High | Task 45 |
| 47 | Create generate_otp | Medium | Task 46 |
| 48 | Create send_otp | Medium | Task 47 |
| 49 | Create verify_otp | Medium | Task 48 |
| 50 | Create OTP Expiry | Low | Task 49 |
| 51 | Create Max Attempts | Low | Task 50 |
| 52 | Create Resend Cooldown | Low | Task 51 |
| 53 | Create OTP Cleanup | Medium | Task 52 |
| 54 | Verify OTP System | Low | Task 53 |

---

## Execution Order

```
Task 39: OTP Model
    │
    ├────────┬────────┬────────┬────────┬────────┐
    ▼        ▼        ▼        ▼        ▼        ▼
T-40      T-41      T-42      T-43     T-44     T-45
(Phone)  (Code)  (Purpose)(Expiry)(Attempt)(Verify)
    │        │        │        │        │        │
    └────────┴────────┴────────┴────────┴────────┘
                           │
                           ▼
                   Task 46: OTPService
                           │
                           ▼
                   Task 47: generate_otp
                           │
                           ▼
                   Task 48: send_otp
                           │
                           ▼
                   Task 49: verify_otp
                           │
                           ▼
                   Task 50: OTP Expiry
                           │
                           ▼
                   Task 51: Max Attempts
                           │
                           ▼
                   Task 52: Resend Cooldown
                           │
                           ▼
                   Task 53: OTP Cleanup
                           │
                           ▼
                   Task 54: Verify OTP System
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        ├── models/
        │   └── otp.py
        ├── services/
        │   └── otp_service.py
        └── tasks/
            └── otp_cleanup_task.py
```

---

## Notes for AI Agents

### OTP Model (Task 39)
| Class | OTP |
|-------|-----|
| Purpose | Store OTP codes |
| Indexes | phone + purpose |

### phone Field (Task 40)
| Field | Type |
|-------|------|
| Name | phone |
| Type | CharField(max_length=15) |
| Format | +94XXXXXXXXX |

### otp_code Field (Task 41)
| Field | Type |
|-------|------|
| Name | otp_code |
| Type | CharField(max_length=6) |
| Format | 6 digits |

### purpose Field (Task 42)
| Purpose | Description |
|---------|-------------|
| LOGIN | Phone login |
| REGISTER | New registration |
| RESET | Password reset |
| VERIFY | Phone verification |

### expires_at Field (Task 43)
| Field | Type |
|-------|------|
| Name | expires_at |
| Type | DateTimeField |
| Default | now + 5 minutes |

### attempts Field (Task 44)
| Field | Type |
|-------|------|
| Name | attempts |
| Type | IntegerField |
| Default | 0 |
| Max | 3 |

### is_verified Field (Task 45)
| Field | Type |
|-------|------|
| Name | is_verified |
| Type | BooleanField |
| Default | False |

### OTPService (Task 46)
| Class | OTPService |
|-------|------------|
| Purpose | OTP generation and verification |
| Uses | SMSProviderFactory |

### generate_otp (Task 47)
| Method | generate_otp(phone, purpose) |
|--------|------------------------------|
| Return | 6-digit code |
| Use | secrets.randbelow |

### send_otp (Task 48)
| Method | send_otp(phone, purpose) |
|--------|--------------------------|
| Action | Generate + send SMS |
| Template | "Your OTP is {code}. Valid for 5 minutes." |

### verify_otp (Task 49)
| Method | verify_otp(phone, code, purpose) |
|--------|----------------------------------|
| Return | Boolean |
| Actions | Check expiry, increment attempts |

### OTP Expiry (Task 50)
| Setting | OTP_EXPIRY_MINUTES |
|---------|-------------------|
| Default | 5 |
| Check | expires_at > now |

### Max Attempts (Task 51)
| Setting | OTP_MAX_ATTEMPTS |
|---------|-----------------|
| Default | 3 |
| Action | Block after max |

### Resend Cooldown (Task 52)
| Setting | OTP_RESEND_COOLDOWN |
|---------|---------------------|
| Default | 60 seconds |
| Check | Last OTP sent time |

### OTP Cleanup (Task 53)
| Task | cleanup_expired_otps |
|------|---------------------|
| Schedule | Every hour |
| Action | Delete expired OTPs |
