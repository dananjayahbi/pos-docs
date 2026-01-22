# Group F: Frontend & Testing

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** F of F  
> **Tasks Covered:** 79-86  
> **Group Goal:** Create frontend components, admin UIs, and integration tests

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-E_Delivery-Reports](../Group-E_Delivery-Reports/)
- **→ Next Phase:** [Phase-10_AI-Features-Advanced-Capabilities](../../../Phase-10_AI-Features-Advanced-Capabilities/)

---

## Group Overview

This group creates frontend and testing. Creates TypeScript interfaces for SMS types. Creates frontend API client for SMS endpoints. Creates OTP input component for 6-digit code entry. Creates phone verification UI for verification flow. Creates SMS config UI for admin provider configuration. Creates SMS usage dashboard for analytics. Creates integration tests for E2E SMS flow. Creates documentation.

### Key Outcomes

- SMS TypeScript types
- SMS API client
- OTP input component
- Phone verification UI
- SMS config UI
- SMS usage dashboard
- Integration tests
- Documentation

### Technology Context

- **Frontend:** Next.js + TypeScript
- **UI:** Shadcn/UI components
- **OTP:** 6-digit input
- **Testing:** pytest + Jest

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-79-86_Types-Components-Tests.md` | Create types, components, tests | 79-86 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 79 | Create SMS Types | Low | Task 78 |
| 80 | Create SMS API Client | Medium | Task 79 |
| 81 | Create OTP Input Component | Medium | Task 80 |
| 82 | Create Phone Verification UI | Medium | Task 81 |
| 83 | Create SMS Config UI | Medium | Task 80 |
| 84 | Create SMS Usage Dashboard | Medium | Task 80 |
| 85 | Create Integration Tests | Medium | Task 84 |
| 86 | Create Documentation | Medium | Task 85 |

---

## Execution Order

```
Task 79: SMS Types
    │
    ▼
Task 80: SMS API Client
    │
    ├─────────┬─────────┬─────────┐
    ▼         ▼         ▼         ▼
T-81       T-83       T-84
(OTP)    (Config) (Dashboard)
    │         │         │
    ▼         │         │
T-82         │         │
(Verify)      │         │
    │         │         │
    └─────────┴─────────┘
              │
              ▼
       Task 85: Integration Tests
              │
              ▼
       Task 86: Documentation
```

---

## Expected Deliverables

```
frontend/
├── lib/
│   └── notifications/
│       └── sms/
│           ├── types.ts
│           └── client.ts
└── components/
    ├── auth/
    │   ├── OTPInput.tsx
    │   └── PhoneVerification.tsx
    └── admin/
        ├── SMSConfig.tsx
        └── SMSUsageDashboard.tsx

tests/
└── notifications/
    └── test_sms_e2e.py

docs/
└── integrations/
    └── sms.md
```

---

## Notes for AI Agents

### SMS Types (Task 79)
| Type | Fields |
|------|--------|
| SMSConfig | provider, sender_id, is_enabled, monthly_limit |
| SMSTemplate | name, text, language |
| SMSLog | id, recipient, status, provider, cost |
| OTPRequest | phone, purpose |
| OTPVerify | phone, code, purpose |

### SMS API Client (Task 80)
| Method | Endpoint |
|--------|----------|
| getConfig | GET /api/sms/config/ |
| updateConfig | PUT /api/sms/config/ |
| sendOTP | POST /api/sms/otp/send/ |
| verifyOTP | POST /api/sms/otp/verify/ |
| getUsageStats | GET /api/sms/stats/ |
| getBalance | GET /api/sms/balance/ |

### OTP Input Component (Task 81)
| Component | OTPInput |
|-----------|----------|
| Props | length (6), onComplete |
| Features | Auto-focus, paste support |

### OTPInput Props
| Prop | Type | Description |
|------|------|-------------|
| length | number | Number of digits (default 6) |
| onComplete | function | Called when all digits entered |
| disabled | boolean | Disable input |
| error | string | Error message |

### Phone Verification UI (Task 82)
| Component | PhoneVerification |
|-----------|-------------------|
| Steps | Enter phone → Send OTP → Verify |
| Features | Resend timer, error handling |

### Phone Verification Flow
| Step | UI |
|------|-----|
| 1 | Phone input with +94 prefix |
| 2 | Send OTP button |
| 3 | OTP input (6 digits) |
| 4 | Verify button |
| 5 | Success/Retry |

### SMS Config UI (Task 83)
| Component | SMSConfig |
|-----------|-----------|
| Features | Provider selection, API key, sender ID |
| Admin | Tenant configuration |

### SMSConfig Fields
| Field | Type |
|-------|------|
| Provider | Select (Dialog, Notify.lk, TextIt) |
| API Key | Password input |
| Sender ID | Text input (11 chars max) |
| Enabled | Toggle switch |
| Monthly Limit | Number input |

### SMS Usage Dashboard (Task 84)
| Component | SMSUsageDashboard |
|-----------|-------------------|
| Metrics | Sent, delivered, failed, cost |
| Charts | Usage over time, by provider |

### Dashboard Metrics
| Metric | Display |
|--------|---------|
| Total Sent | Number card |
| Delivery Rate | Percentage |
| Failed | Number with alert |
| Total Cost | LKR amount |
| Balance | Remaining credits |

### Integration Tests (Task 85)
| Test | Coverage |
|------|----------|
| test_send_sms | Send via provider |
| test_otp_flow | Generate + verify OTP |
| test_dlr_webhook | Delivery callback |
| test_fallback | Provider fallback |

### Documentation (Task 86)
| Section | Content |
|---------|---------|
| Setup | Provider configuration |
| Providers | Dialog, Notify.lk, TextIt |
| OTP | OTP flow documentation |
| Webhooks | DLR webhook setup |
| Troubleshooting | Common issues |
