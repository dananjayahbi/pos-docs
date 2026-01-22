# Group B: Provider Implementations

> **Phase:** 09 - Integrations & Sri Lanka Localizations  
> **SubPhase:** 12 - SMS Gateway Integration  
> **Group:** B of F  
> **Tasks Covered:** 17-38  
> **Group Goal:** Implement SMS provider clients for Dialog, Notify.lk, and TextIt

---

## Navigation

- **↑ Parent:** [00_TASKS_SUMMARY.md](../00_TASKS_SUMMARY.md)
- **← Previous Group:** [Group-A_SMS-Configuration](../Group-A_SMS-Configuration/)
- **→ Next Group:** [Group-C_OTP-System](../Group-C_OTP-System/)

---

## Group Overview

This group implements SMS providers. Creates DialogSMSClient with HTTP client, authentication, send, balance check, and status methods. Creates DialogProvider implementing SMSProvider ABC. Creates NotifyLkClient with REST client, auth, send, balance, and status methods. Creates NotifyLkProvider implementing ABC. Creates TextItClient with client, auth, send, and balance methods. Creates TextItProvider implementing ABC. Registers all providers with SMSProviderFactory. Creates provider fallback logic to auto-switch on failure. Verifies all providers.

### Key Outcomes

- DialogSMSClient
- Dialog auth
- Dialog send
- Dialog balance
- Dialog status
- DialogProvider
- NotifyLkClient
- NotifyLk auth
- NotifyLk send
- NotifyLk balance
- NotifyLk status
- NotifyLkProvider
- TextItClient
- TextIt auth
- TextIt send
- TextIt balance
- TextItProvider
- Register Dialog
- Register NotifyLk
- Register TextIt
- Provider fallback
- Providers verified

### Technology Context

- **Dialog:** Largest Sri Lanka carrier
- **Notify.lk:** SMS aggregator
- **TextIt:** Alternative provider
- **Fallback:** Auto-switch on failure

---

## Documents in This Group

| # | Document | Description | Tasks Covered |
|---|----------|-------------|---------------|
| 01 | `01_Tasks-17-22_Dialog-Provider.md` | Create Dialog client and provider | 17-22 |
| 02 | `02_Tasks-23-28_NotifyLk-Provider.md` | Create NotifyLk client and provider | 23-28 |
| 03 | `03_Tasks-29-38_TextIt-Factory-Fallback.md` | Create TextIt, register, fallback | 29-38 |

---

## Task Summary

| Task # | Task Name | Complexity | Dependencies |
|--------|-----------|------------|--------------|
| 17 | Create DialogSMSClient | High | Task 16 |
| 18 | Create Dialog Auth | Low | Task 17 |
| 19 | Create Dialog Send | Medium | Task 18 |
| 20 | Create Dialog Balance | Low | Task 18 |
| 21 | Create Dialog Status | Low | Task 18 |
| 22 | Create DialogProvider | Medium | Task 21 |
| 23 | Create NotifyLkClient | High | Task 16 |
| 24 | Create NotifyLk Auth | Low | Task 23 |
| 25 | Create NotifyLk Send | Medium | Task 24 |
| 26 | Create NotifyLk Balance | Low | Task 24 |
| 27 | Create NotifyLk Status | Low | Task 24 |
| 28 | Create NotifyLkProvider | Medium | Task 27 |
| 29 | Create TextItClient | High | Task 16 |
| 30 | Create TextIt Auth | Low | Task 29 |
| 31 | Create TextIt Send | Medium | Task 30 |
| 32 | Create TextIt Balance | Low | Task 30 |
| 33 | Create TextItProvider | Medium | Task 32 |
| 34 | Register Dialog Provider | Low | Task 22 |
| 35 | Register NotifyLk Provider | Low | Task 28 |
| 36 | Register TextIt Provider | Low | Task 33 |
| 37 | Create Provider Fallback | Medium | Task 36 |
| 38 | Verify Providers | Low | Task 37 |

---

## Execution Order

```
                    Task 16: SMS Migrations
                              │
         ┌────────────────────┼────────────────────┐
         ▼                    ▼                    ▼
Task 17: Dialog          Task 23: NotifyLk    Task 29: TextIt
    │                         │                    │
    ▼                         ▼                    ▼
Task 18: Auth            Task 24: Auth        Task 30: Auth
    │                         │                    │
    ├────────┬────────┐       ├────────┬────────┐  ├────────┐
    ▼        ▼        ▼       ▼        ▼        ▼  ▼        ▼
T-19      T-20      T-21    T-25     T-26     T-27 T-31    T-32
(Send)   (Bal)   (Status) (Send)   (Bal)  (Stat)(Send)  (Bal)
    │        │        │       │        │        │  │        │
    └────────┴────────┘       └────────┴────────┘  └────────┘
              │                        │                 │
              ▼                        ▼                 ▼
        Task 22              Task 28              Task 33
      (DialogProv)        (NotifyProv)         (TextProv)
              │                        │                 │
              ▼                        ▼                 ▼
        Task 34              Task 35              Task 36
       (Register)           (Register)          (Register)
              │                        │                 │
              └────────────────────────┴─────────────────┘
                                    │
                                    ▼
                          Task 37: Provider Fallback
                                    │
                                    ▼
                          Task 38: Verify Providers
```

---

## Expected Deliverables

```
backend/
└── apps/
    └── notifications/
        └── providers/
            ├── dialog/
            │   ├── client.py
            │   └── provider.py
            ├── notifylk/
            │   ├── client.py
            │   └── provider.py
            └── textit/
                ├── client.py
                └── provider.py
```

---

## Notes for AI Agents

### DialogSMSClient (Task 17)
| Class | DialogSMSClient |
|-------|-----------------|
| Base URL | https://api.dialog.lk/sms/ |
| Protocol | HTTP/REST |

### Dialog Auth (Task 18)
| Type | API Key |
|------|---------|
| Header | Authorization |
| Format | Bearer {api_key} |

### Dialog Send (Task 19)
| Method | send(to, message, sender_id) |
|--------|------------------------------|
| Return | message_id |
| Endpoint | POST /send |

### Dialog Balance (Task 20)
| Method | check_balance() |
|--------|-----------------|
| Return | float (credits) |
| Endpoint | GET /balance |

### Dialog Status (Task 21)
| Method | get_status(message_id) |
|--------|------------------------|
| Return | pending/sent/delivered/failed |
| Endpoint | GET /status/{id} |

### DialogProvider (Task 22)
| Class | DialogProvider(SMSProvider) |
|-------|----------------------------|
| Implements | SMSProvider ABC |

### NotifyLkClient (Task 23)
| Class | NotifyLkClient |
|-------|----------------|
| Base URL | https://app.notify.lk/api/v1/ |
| Protocol | REST JSON |

### NotifyLk Auth (Task 24)
| Type | User ID + API Key |
|------|-------------------|
| Header | X-User-Id, X-Api-Key |

### NotifyLk Send (Task 25)
| Method | send(to, message, sender_id) |
|--------|------------------------------|
| Endpoint | POST /send |
| Param | to, message, sender_id |

### NotifyLk Balance (Task 26)
| Method | check_balance() |
|--------|-----------------|
| Endpoint | GET /balance |
| Return | float (LKR) |

### NotifyLk Status (Task 27)
| Method | get_status(message_id) |
|--------|------------------------|
| Endpoint | GET /status/{id} |

### NotifyLkProvider (Task 28)
| Class | NotifyLkProvider(SMSProvider) |
|-------|------------------------------|
| Implements | SMSProvider ABC |

### TextItClient (Task 29)
| Class | TextItClient |
|-------|--------------|
| Base URL | https://textit.lk/api/ |
| Protocol | REST |

### TextIt Auth (Task 30)
| Type | API Key |
|------|---------|
| Param | api_key query param |

### TextIt Send (Task 31)
| Method | send(to, message, sender_id) |
|--------|------------------------------|
| Endpoint | POST /sendsms |

### TextIt Balance (Task 32)
| Method | check_balance() |
|--------|-----------------|
| Endpoint | GET /balance |

### TextItProvider (Task 33)
| Class | TextItProvider(SMSProvider) |
|-------|----------------------------|
| Implements | SMSProvider ABC |

### Register Providers (Tasks 34-36)
| Provider | Name |
|----------|------|
| DialogProvider | dialog |
| NotifyLkProvider | notifylk |
| TextItProvider | textit |

### Provider Fallback (Task 37)
| Logic | Auto-switch on failure |
|-------|------------------------|
| Priority | dialog → notifylk → textit |
| Retry | 3 attempts before switch |
